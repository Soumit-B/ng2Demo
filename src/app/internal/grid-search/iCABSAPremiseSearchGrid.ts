import { Component, NgZone, ViewChild, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { HttpService } from '../../../shared/services/http-service';
import { ErrorService } from '../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { GridComponent } from './../../../shared/components/grid/grid';
import { AccountSearchComponent } from '../search/iCABSASAccountSearch';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { ContractActionTypes } from '../../actions/contract';
import { Utils } from '../../../shared/services/utility';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { ProductSearchGridComponent } from './../search/iCABSBProductSearch';
import { GlobalizeService } from './../../../shared/services/globalize.service';

@Component({
    templateUrl: 'iCABSAPremiseSearchGrid.html',
    providers: [ErrorService, MessageService]
})

export class PremiseSearchGridComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('topContainer') container: ElementRef;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('premiseGrid') premiseGrid: GridComponent;

    public maxColumn: number = 13;
    public currentPage: number = 1;
    public gridData: any;
    public gridTotalItems: number;
    public itemsPerPage: number;
    public errorSubscription: Subscription;
    public messageSubscription: Subscription;
    public storeSubscription: Subscription;
    public routerSubscription: Subscription;
    public translateSubscription: Subscription;
    public premiseSearchFormGroup: FormGroup;
    public storeData: any;
    public query: URLSearchParams = new URLSearchParams();
    public queryLookUp: URLSearchParams = new URLSearchParams();
    public inputParams: any = {
        'parentMode': 'Contract',
        'pageTitle': 'Premise Search',
        'pageHeader': 'Premises Filter Options',
        'showBusinessCode': false,
        'showCountryCode': false
    };
    public inputParamsProduct: any = {
        'parentMode': 'LookUp'
    };
    public queryParams: any = {
        action: '2',
        operation: 'Application/iCABSAPremiseSearchGrid',
        module: 'premises',
        method: 'contract-management/grid',
        contentType: 'application/x-www-form-urlencoded',
        full: 'Full',
        sortOrder: 'Descending',
        branchNumber: ''
    };
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public ajaxSubscription: Subscription;
    public querySubscription: Subscription;

    public statusList: Array<any> = [];

    public optionsList: Array<any> = [];
    public status = 'All';
    public statusObjectList: Object = {};
    public options = 'Options';
    public dt: Date = null;
    public dtDisplay: string;
    public showCloseButton: boolean = true;
    public showHeader: boolean = true;
    public searchModalRoute: string;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public errorMessage: string;
    public isRequesting: boolean = false;
    public showStatus: boolean = true;
    public branchList: Array<any> = [];
    public branchItemsToDisplay: Array<any> = ['item', 'desc'];
    public branchFields: Array<any>;
    public productComponent: Component;
    public premiseComponent: Component;
    public backLinkText: string = '';
    public backLinkUrl: string = '';
    public showMenu: boolean = true;
    public contractTypeLabel: string = 'Contract';
    public gridSortHeaders: Array<any> = [];
    public validateProperties: Array<any> = [];
    public sortType: any;
    private premiseData: any;
    private productData: any;
    private contractData: any;
    private pageQueryParams: any;
    private headerClicked: string = 'PremiseNumber';

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private httpService: HttpService,
        private serviceConstants: ServiceConstants,
        private zone: NgZone,
        private global: GlobalConstant,
        private ajaxconstant: AjaxObservableConstant,
        private authService: AuthService,
        private _fb: FormBuilder,
        private errorService: ErrorService,
        private messageService: MessageService,
        private titleService: Title,
        private componentInteractionService: ComponentInteractionService,
        private translate: TranslateService,
        private localeTranslateService: LocaleTranslationService,
        private store: Store<any>,
        private utils: Utils,
        private globalize: GlobalizeService
    ) {
        this.storeSubscription = store.select('contract').subscribe(data => {
            this.storeData = data;
            this.contractData = data['data'];
        });
        this.querySubscription = this.route.queryParams.subscribe(params => {
            this.pageQueryParams = params;
            if (params['parentMode'] || params['ParentMode'])
                this.inputParams.parentMode = params['parentMode'] || params['ParentMode'];
            if (!(this.contractData && !(Object.keys(this.contractData).length === 0 && this.contractData.constructor === Object))) {
                this.contractData = params;
                this.storeData['code'] = {
                    country: this.utils.getCountryCode(),
                    business: this.utils.getBusinessCode()
                };
            }
            if (!this.contractData['ContractTypeCode']) {
                this.contractData['ContractTypeCode'] = params['ContractTypeCode'];
                switch (this.contractData['ContractTypeCode']) {
                    case 'J':
                        this.contractTypeLabel = 'Job';
                        break;
                    case 'P':
                        this.contractTypeLabel = 'Product Sale';
                        break;
                    default:
                        this.contractTypeLabel = 'Contract';
                        break;
                }
            }
        });
    }

    ngOnInit(): void {
        this.setGridHeaders();
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.componentInteractionService.emitMessage(false);
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.zone.run(() => {
                    if (data['errorMessage']) {
                        this.errorModal.show(data, true);
                    }
                });
            }
        });

        this.messageService.emitMessage(0);
        this.messageSubscription = this.messageService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.zone.run(() => {
                    this.messageModal.show({ msg: 'Record Saved Successfully', title: 'Message' }, false);
                });
            }

        });

        this.ajaxSubscription = this.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.zone.run(() => {
                    switch (event) {
                        case this.ajaxconstant.START:
                            this.isRequesting = true;
                            break;
                        case this.ajaxconstant.COMPLETE:
                            this.isRequesting = false;
                            break;
                    }
                });
            }
        });

        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.fetchTranslationContent();
            }
        });
        this.localeTranslateService.setUpTranslation();

        this.premiseSearchFormGroup = this.fb.group({
            ContractNumber: [{ value: '', disabled: true }],
            ContractName: [{ value: '', disabled: true }],
            PremiseNumber: [{ value: '', disabled: false }],
            PremisesName: [{ value: '', disabled: false }],
            AddressLine1: [{ value: '', disabled: false }],
            PostCode: [{ value: '', disabled: false }],
            ClientReference: [{ value: '', disabled: false }],
            PositionPremiseNumber: [{ value: '', disabled: false }],
            ProductCode: [{ value: '', disabled: false }],
            ProductDesc: [{ value: '', disabled: true }],
            BranchName: [{ value: '', disabled: true }],
            BranchNumber: [{ value: '', disabled: false }],
            ServiceBranch: [{ value: '', disabled: false }],
            ShowDeletedProducts: [{ value: '', disabled: false }]
        });



        if (this.storeData) {
            this.premiseSearchFormGroup.controls['ContractNumber'].setValue(this.contractData.ContractNumber);
            this.premiseSearchFormGroup.controls['ContractName'].setValue(this.contractData.ContractName);
        }

        if (this.inputParams.parentMode.trim() === 'Contract') {
            this.inputParams.pageTitle = 'Contract Premise Search';
        }

        if (this.inputParams.parentMode.trim() === 'Inter-CompanyPortfolio' || this.inputParams.parentMode.trim() === 'GroupAccountPortfolio') {
            this.contractData['DateTo'] = this.pageQueryParams['AtDate'];
        } else {
            if (this.pageQueryParams['RunningReadOnly'] === 'yes') {
                this.showMenu = false;
            }
        }

        // Checking contract type code
        switch (this.contractData.ContractTypeCode) {
            case 'C':
                this.showStatus = true;
                break;

            default:
                this.showStatus = false;
                break;
        }

        this.productComponent = ProductSearchGridComponent;
        this.titleService.setTitle(this.inputParams.pageTitle);
        this.itemsPerPage = this.global.AppConstants().tableConfig.itemsPerPage;
        this.statusList = [
            {
                value: 'All',
                text: 'All'
            },
            {
                value: 'L',
                text: 'Current'
            },
            {
                value: 'FL',
                text: 'Forward Current'
            },
            {
                value: 'D',
                text: 'Deleted'
            },
            {
                value: 'FD',
                text: 'Forward Deleted'
            },
            {
                value: 'PD',
                text: 'Pending Deletion'
            },
            {
                value: 'T',
                text: 'Terminated'
            },
            {
                value: 'FT',
                text: 'Forward Terminated'
            },
            {
                value: 'PT',
                text: 'Pending Termination'
            },
            {
                value: 'C',
                text: 'Cancelled'
            }
        ];

        this.optionsList = [
            {
                value: 'Options',
                text: 'Options'
            },
            {
                value: 'Add Premises',
                text: 'Add Premises'
            }
        ];

    }

    ngOnDestroy(): void {
        this.errorSubscription.unsubscribe();
        this.messageSubscription.unsubscribe();
        this.ajaxSubscription.unsubscribe();
        this.translateSubscription.unsubscribe();
        this.titleService.setTitle('');

    }

    private setGridHeaders(): void {
        this.gridSortHeaders = [
          {
              'fieldName': 'PremiseNumber',
              'index': 0,
              'sortType': 'ASC'
          },
          {
              'fieldName': 'PremisePostcode',
              'index': 4,
              'sortType': 'ASC'
          },
          {
              'fieldName': 'ClientReference',
              'index': 11,
              'sortType': 'ASC'
          },
          {
              'fieldName': 'PremiseAddressLine4',
              'index': 3,
              'sortType': 'ASC'
          },
          {
              'fieldName': 'ServiceBranchNumber',
              'index': 6,
              'sortType': 'ASC'
          }
        ];

        this.validateProperties = [
            {
                'type': MntConst.eTypeInteger,
                'index': 0,
                'align': 'center',
                'readonly': true
            },
            {
                'type': MntConst.eTypeText,
                'index': 1,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 2,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 3,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 4,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeCode,
                'index': 5,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeInteger,
                'index': 6,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeDate,
                'index': 7,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeCurrency,
                'index': 8,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeInteger,
                'index': 9,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 10,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 11,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeDate,
                'index': 12,
                'align': 'center'
            }
        ];
        for (let k = 0; k < this.gridSortHeaders.length; k++) {
          if (this.gridSortHeaders[k].fieldName === this.headerClicked) {
              this.gridSortHeaders[k].sortType = this.sortType === 'Descending' ? 'DESC' : 'ASC';
          }
        }
    }

    public sortGrid(data: any): void {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.fetchGridData();
    }

    public fetchBranchDetails(): void {
        this.queryParams.branchNumber = this.utils.getBranchCode();
        let userCode = this.authService.getSavedUserCode();
        let data = [{
            'table': 'Branch',
            'query': { 'BusinessCode': this.utils.getBusinessCode() },
            'fields': ['BranchNumber', 'BranchName']
        },
        {
            'table': 'UserAuthorityBranch',
            'query': { 'UserCode': userCode.UserCode, 'BusinessCode': this.utils.getBusinessCode() },
            'fields': ['BusinessCode', 'BranchNumber', 'DefaultBranchInd', 'CurrentBranchInd', 'UserCode']
        }];
        this.lookUpRecord(data, 100).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        let arr = [];
                        let none = {
                            item: 'All',
                            desc: 'All'
                        };
                        arr.push(none);
                        for (let k = 0; k < e['results'][0].length; k++) {
                            let obj = {
                                item: e['results'][0][k].BranchNumber,
                                desc: e['results'][0][k].BranchName
                            };
                            arr.push(JSON.parse(JSON.stringify(obj)));

                        }
                        this.branchList = arr;
                    }

                    if (e['results'][1].length > 0 && !this.queryParams.branchNumber) {
                        for (let i = 0; i < e['results'][1].length; i++) {
                            if (e['results'][1][i].DefaultBranchInd) {
                                this.queryParams.branchNumber = e['results'][1][i].BranchNumber;
                            }
                        }

                    }
                }
                this.fetchGridData();
            },
            (error) => {
                this.fetchGridData();
            }
        );
    }


    public lookUpRecord(data: any, maxresults: number): any {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    }

    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }

    }

    public onGridRowDblClick(data: any): void {
        if (data.cellIndex === 0) {
            this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
                queryParams: {
                    parentMode: 'GridSearch',
                    PremiseNumber: data.trRowData[0].text,
                    AccountNumber: this.contractData['AccountNumber'],
                    AccountName: this.contractData['AccountName'],
                    ContractNumber: this.premiseSearchFormGroup.controls['ContractNumber'].value,
                    // ContractName: this.premiseSearchFormGroup.controls['ContractName'].value,
                    contractTypeCode: this.contractData['ContractTypeCode']
                }
            });
        }
    }

    public fetchTranslationContent(): void {
        this.getTranslatedValue('Premise Search', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    switch (this.contractData['ContractTypeCode']) {
                        case 'J':
                            this.titleService.setTitle('Job ' + res);
                            break;
                        case 'P':
                            this.titleService.setTitle('Product Sale ' + res);
                            break;
                        default:
                            this.titleService.setTitle('Contract ' + res);
                            break;
                    }
                } else {
                    this.titleService.setTitle(this.inputParams.pageTitle);
                }
            });

        });

        this.getTranslatedValue('Premises Filter Options', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.inputParams.pageHeader = res;
                }
            });

        });

    }

    public fetchGridData(): void {
        this.query.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.query.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.query.set(this.serviceConstants.Action, this.queryParams.action);
        this.query.set('PageSize', this.itemsPerPage.toString());
        this.query.set('PageCurrent', this.currentPage.toString());
        this.query.set('FullAccess', this.queryParams.full);
        this.query.set('riSortOrder', this.queryParams.sortOrder);
        this.query.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.query.set('ContractNumber', this.premiseSearchFormGroup.controls['ContractNumber'].value);
        this.query.set('PremiseNumber', this.premiseSearchFormGroup.controls['PositionPremiseNumber'].value);
        this.query.set('PremiseName', this.premiseSearchFormGroup.controls['PremisesName'].value);
        this.query.set('PremiseAddress', this.premiseSearchFormGroup.controls['AddressLine1'].value);
        this.query.set('PremisePostcode', this.premiseSearchFormGroup.controls['PostCode'].value);
        this.query.set('ProductCode', this.premiseSearchFormGroup.controls['ProductCode'].value);
        this.query.set('ClientReference', this.premiseSearchFormGroup.controls['ClientReference'].value);
        this.query.set('BranchNumber', this.premiseSearchFormGroup.controls['ServiceBranch'].value);
        this.query.set('LoggedInBranch', this.queryParams.branchNumber);
        this.query.set('HeaderClickedColumn', this.headerClicked);
        this.query.set('PortfolioStatus', this.status);
        this.query.set('DateTo', this.globalize.parseDateToFixedFormat(this.dtDisplay) as string);
        if (this.premiseSearchFormGroup.controls['ShowDeletedProducts'].value === '') {
            this.premiseSearchFormGroup.controls['ShowDeletedProducts'].setValue(false);
        }
        this.query.set('FilterShowDeleted', this.premiseSearchFormGroup.controls['ShowDeletedProducts'].value);
        this.queryParams.search = this.query;
        this.premiseGrid.loadGridData(this.queryParams);

    }
    ngAfterViewInit(): void {
        this.fetchBranchDetails();
    }

    public onProductBlur(event: any): void {
        if (this.premiseSearchFormGroup.controls['ProductCode'].value && this.premiseSearchFormGroup.controls['ProductCode'].value !== '') {
            let productData = [{
                'table': 'Product',
                'query': { 'ProductCode': this.premiseSearchFormGroup.controls['ProductCode'].value, 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['BusinessCode', 'ProductDesc']
            }];

            this.lookUpRecord(productData, 100).subscribe(
                (e) => {
                    if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                        this.premiseSearchFormGroup.controls['ProductDesc'].setValue(e['results'][0][0].ProductDesc);

                    } else {
                        this.premiseSearchFormGroup.controls['ProductDesc'].setValue('');
                        //e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                        //this.errorService.emitError(e);

                    }

                },
                (error) => {
                    error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                    //this.errorService.emitError(error);
                    this.premiseSearchFormGroup.controls['ProductDesc'].setValue('');

                }
            );
        } else {
            this.premiseSearchFormGroup.controls['ProductDesc'].setValue('');
        }

    }

    public gridInfo(value: any): void {
        if (value && value.totalPages) {
            this.gridTotalItems = parseInt(value.totalPages, 10) * this.itemsPerPage;
        } else {
            this.gridTotalItems = 0;
        }

    }

    public getCurrentPage(event: any): void {
        this.currentPage = event.value;
        this.fetchGridData();
    }

    public statusChange(data: any): void {
        // statement
    }

    public optionsChange(data: any): void {
        if (this.options === 'Add Premises') {
            this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
                queryParams: {
                    parentMode: 'GridSearchAdd',
                    contractTypeCode: this.contractData['ContractTypeCode'],
                    AccountNumber: this.contractData['AccountNumber'],
                    AccountName: this.contractData['AccountName'],
                    ContractNumber: this.premiseSearchFormGroup.controls['ContractNumber'].value
                    // ContractName: this.premiseSearchFormGroup.controls['ContractName'].value
                }
            });
        }
    }

    public onRefresh(): void {
        //this.currentPage = 1;
        this.fetchGridData();
    }

    public onPremiseDataReceived(data: any, route: any): void {
        this.premiseData = data;
        //this.premiseSearchFormGroup.controls['PremiseNumber'].setValue(data.PremiseNumber);
        this.premiseSearchFormGroup.controls['PremisesName'].setValue(data.PremiseDesc);
    }

    public onProductDataReceived(data: any, route: any): void {
        if (data) {
            this.productData = data;
            this.premiseSearchFormGroup.controls['ProductCode'].setValue(data.ProductCode);
            this.premiseSearchFormGroup.controls['ProductDesc'].setValue(data.ProductDesc);
        }
    }

    public onBranchSelected(event: any): void {
        if (event.value && event.value.item && event.value.item !== 'All') {
            this.premiseSearchFormGroup.controls['ServiceBranch'].setValue(event.value.item);
        } else {
            this.premiseSearchFormGroup.controls['ServiceBranch'].setValue('');
        }


    }

    public isNumber(evt: any): boolean {
        evt = (evt) ? evt : window.event;
        let charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    public toUpperCase(event: any): void {
        let target = event.target.getAttribute('formControlName');
        let elementValue = event.target.value;
        this.premiseSearchFormGroup.controls[target].setValue(elementValue.toUpperCase());
    }

    public dateSelectedValue(value: any): void {
        if (value && value.value) {
            this.dtDisplay = value.value;
        } else {
            this.dtDisplay = '';
        }
    }
}
