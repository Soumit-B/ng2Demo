import { InternalMaintenanceSalesModuleRoutes } from './../../base/PageRoutes';
import { ServiceCoverSearchComponent } from './../search/iCABSAServiceCoverSearch';
import { PremiseSearchComponent } from './../search/iCABSAPremiseSearch';
import { LookUp } from './../../../shared/services/lookup';
import { ContractActionTypes } from './../../actions/contract';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Location } from '@angular/common';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { Utils } from './../../../shared/services/utility';
import { PremiseSearchGridComponent } from './iCABSAPremiseSearchGrid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../shared/components/grid/grid';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { PageDataService } from './../../../shared/services/page-data.service';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { MessageService } from './../../../shared/services/message.service';
import { ErrorService } from './../../../shared/services/error.service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { Http, URLSearchParams } from '@angular/http';
import { TranslateService } from 'ng2-translate';
import { Level, Logger } from '@nsalaun/ng2-logger';
import { Component, OnInit, OnDestroy, ViewChild, NgZone, AfterViewInit, Injector, Renderer } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../shared/services/auth.service';
import { LocalStorageService } from 'ng2-webstorage';
import { RiExchange } from './../../../shared/services/riExchange';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { PostCodeSearchComponent } from '../search/iCABSBPostcodeSearch.component';
import { HttpService } from '../../../shared/services/http-service';
import { GroupAccountNumberComponent } from '../../internal/search/iCABSSGroupAccountNumberSearch';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    selector: 'icabs-visit-tolerance-grid-search',
    templateUrl: 'iCABSSVisitToleranceGrid.html',
    providers: [HttpService, ErrorService]
})
export class VisitToleranceGridComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('visitToleranceGrid') visitToleranceGrid: GridComponent;
    @ViewChild('visitTolerancePagination') visitTolerancePagination: PaginationComponent;

    @ViewChild('groupAccountNumberEllipsis') groupAccountNumberEllipsis: EllipsisComponent;
    @ViewChild('accountSearchEllipsis') accountSearchEllipsis: EllipsisComponent;
    @ViewChild('contractSearchEllipsis') contractSearchEllipsis: EllipsisComponent;
    @ViewChild('premiseSearchEllipsis') premiseSearchEllipsis: EllipsisComponent;
    @ViewChild('errorModal') public errorModal;
    public riExchange: RiExchange;

    // Subscription variable
    public errorSubscription: Subscription;
    public messageSubscription: Subscription;
    public storeSubscription: Subscription;
    public routerSubscription: Subscription;
    public translateSubscription: Subscription;
    public subscription: Subscription;
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public ajaxSubscription: Subscription;
    public lookUpSubscription: Subscription;
    public validateProperties: Array<any> = [];
    public authJson: any;
    public muleJson: any;
    public status = false;
    public showHeader: boolean = true;
    public showErrorHeader: boolean = true;

    itemsPerPage: number = 10;
    currentPage: number = 1;
    totalRecords: number = 0;
    maxColumn: number = 6;

    public query: URLSearchParams;
    public search: URLSearchParams = new URLSearchParams();
    public parentMode: string;
    public queryParams: any = {
        action: '2',
        operation: 'System/iCABSSVisitToleranceGrid',
        module: 'csi',
        method: 'service-planning/maintenance'
    };
    public inputParams: any = {
        'parentMode': 'LookUp'
    };

    public inputParamsGrpAccNumber: any = {
        'parentMode': 'LookUp',
        'Action': '2'
    };
    public inputParamsContract: any = {
        'parentMode': 'LookUp-All',
        'pageTitle': 'Contract Entry',
        //'currentContractType': 'C',
        'showAddNew': false,
        'businessCode': this.utilService.getBusinessCode(),
        'countryCode': this.utilService.getCountryCode(),
        'showCountry': false,
        'showBusiness': false
    };
    public inputParamsPremise: any = {
        'parentMode': 'LookUp',
        'businessCode': this.utilService.getBusinessCode(),
        'countryCode': this.utilService.getCountryCode()
    };
    public inputParamsProductCode: any = {
        'parentMode': 'LookUp',
        'businessCode': this.utilService.getBusinessCode(),
        'countryCode': this.utilService.getCountryCode()
    };

    public inputPremiseSearchGrid: any = {
        'parentMode': 'LookUp',
        'businessCode': this.utilService.getBusinessCode(),
        'countryCode': this.utilService.getCountryCode()
    };

    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public isRequesting: boolean = false;
    public inputParamsAccSearch: any = {
        'parentMode': 'LookUp',
        'accountName': '',
        'ContractTypeCode': '',
        'businessCode': this.utilService.getBusinessCode(),
        'countryCode': this.utilService.getCountryCode(),
        'showAddNewDisplay': false,
        'groupAccountNumber': '',
        'groupName': '',
        'showCountryCode': false,
        'showBusinessCode': false
    };

    public ellipsisConfig = {
        premises: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'ContractNumber': '',
                'ContractName': '',
                // 'currentContractType': 'C',
                // 'currentContractTypeURLParameter': '<contract>',
                'showAddNew': false
            },
            modalConfig: '',
            contentComponent: PremiseSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        product: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'ContractNumber': '',
                'ContractName': '',
                'PremiseNumber': '',
                'PremiseName': '',
                // 'currentContractType': 'C',
                // 'currentContractTypeURLParameter': '<contract>',
                'showAddNew': false
            },
            modalConfig: '',
            contentComponent: ServiceCoverSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };

    public accountSearchComponent = AccountSearchComponent;
    public contractSearchComponent = ContractSearchComponent;
    public GroupAccount: string;
    public GroupAccountNumber: string;
    public groupAccNum = GroupAccountNumberComponent;
    private premiseSearchGridComponent = PremiseSearchGridComponent;
    public accountSearchField: string;
    public ServiceCoverRowID: string;
    public ServiceCoverNumber: string;
    public pageAttribute: any = {
        'BusinessCodeRow': '',
        'GrdToleranceRow': '',
        'BusinessCodeVisitToleranceRowID': '',
        'GrdToleranceVisitToleranceRowID': '',
        'ProductCodeServiceCoverRowID': ''
    };
    public showCloseButton: boolean = true;
    public visittoleranceContractData: any = {
        'BusinessCode': '',
        'BusinessDesc': ''
    };
    public requestdata: Array<any>;
    public errorMessage: string;
    private storeData: Object = {};
    private parentData: Object = {};
    private currentContractTypeURLParameter = '<contract>';
    private currentContractTypeLabel: string;
    public inputParamsVisitTolerance: any = { 'parentMode': '' };
    public currentColumnName: string;
    public backLinkText: string;
    public visitToleranceFormGroup: FormGroup;
    public pageParams: any = {};
    public isProductCodeEllipsisDisabled: any = true;
    public isPremiseNumberEllipsisDisabled: any = true;


    constructor(
        private httpService: HttpService,
        private serviceConstants: ServiceConstants,
        private errorService: ErrorService,
        private messageService: MessageService,
        private authService: AuthService,
        private ajaxconstant: AjaxObservableConstant,
        private router: Router,
        private pageData: PageDataService,
        private titleService: Title,
        private zone: NgZone,
        private store: Store<any>,
        private translate: TranslateService,
        private ls: LocalStorageService,
        private http: Http,
        private localeTranslateService: LocaleTranslationService,
        private fb: FormBuilder,
        private logger: Logger,
        private activatedRoute: ActivatedRoute,
        private utilService: Utils,
        private global: GlobalConstant,
        private location: Location,
        private lookUp: LookUp,
        private renderer: Renderer,
        injector: Injector
    ) {
        this.injectServices(injector);
        this.storeData = {};
        this.storeSubscription = store.select('contract').subscribe(data => {
            if (data && data['action']) {
                this.storeData = data;
                switch (data['action']) {
                    case ContractActionTypes.SAVE_DATA:
                        if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                            this.parentData = data;
                        }
                        break;
                    default:
                        break;
                }
            }
        });


        this.errorSubscription = this.errorService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.zone.run(() => {
                    if (data.errorMessage) {
                        this.errorModal.show(data, true);
                    }

                });
            }
        });

        this.ajaxSource$ = this.ajaxSource.asObservable();
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


        this.inputParams.businessCode = this.utilService.getBusinessCode();
        this.visittoleranceContractData.BusinessCode = this.inputParams.businessCode;
        this.inputParams.countryCode = this.utilService.getCountryCode();
        this.accountSearchComponent = AccountSearchComponent;

        if (this.inputParams.businessCode) {
            this.doLookupformData();
        }

        this.localeTranslateService.setUpTranslation();
    }

    private injectServices(injector: Injector): void {
        this.riExchange = injector.get(RiExchange);
    }

    ngOnInit(): void {
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.itemsPerPage = this.global.AppConstants().tableConfig.itemsPerPage;
        this.visitToleranceFormGroup = this.fb.group({
            BusinessCode: [{ value: '', disabled: true }],
            BusinessDesc: [{ value: '', disabled: true }],
            GroupAccountNumber: [{ value: '', disabled: false }],
            GroupName: [{ value: '', disabled: true }],
            AccountNumber: [{ value: '', disabled: false }],
            AccountName: [{ value: '', disabled: true }],
            ContractNumber: [{ value: '', disabled: false }],
            ContractName: [{ value: '', disabled: true }],
            PremiseNumber: [{ value: '', disabled: false }],
            PremiseName: [{ value: '', disabled: true }],
            ProductCode: [{ value: '', disabled: false }],
            ProductDesc: [{ value: '', disabled: true }],
            ServiceCoverRowID: [{ value: '', disabled: true }],
            ServiceCoverNumber: [{ value: '', disabled: true }]
        });

        this.activatedRoute.queryParams.subscribe((params: Params) => {
            if (params['parentMode']) {
                this.parentMode = params['parentMode'];
                this.inputParamsVisitTolerance.parentMode = params['parentMode'];
            }
            if (params['parentMode'] === 'GroupAccountVisitTolerance') {
                if (this.storeData['data'] === undefined) {
                    this.storeData['data'] = {};
                }
                this.storeData['data'].GroupAccountNumber = params['GroupAccountNumber'];
                this.storeData['data'].GroupName = params['GroupName'];
            }

            if (params['currentContractTypeURLParameter']) {
                let contractTypeURLParameter = params['currentContractTypeURLParameter'];
                this.currentContractTypeURLParameter = this.utilService.getCurrentContractType(contractTypeURLParameter);
                this.inputParamsContract.currentContractTypeURLParameter = this.currentContractTypeURLParameter;
            }

            if (this.storeData === undefined || this.storeData['data'] === undefined) {
                this.getParentFieldValue(params);
            }
        });

        this.visitToleranceGrid.update = true;
        this.setFormData(this.storeData);
        let pageTitle = 'Visit Tolerance Entry';
        this.utilService.setTitle(pageTitle);
        this.getValidateProperties();
        this.buildGrid();

        this.visitToleranceFormGroup.valueChanges.subscribe(data => {
            this.onFieldChangeUpdateInputParams();
        });
    }

    ngAfterViewInit(): void {
        this.buildGrid();
    }

    ngOnDestroy(): void {
        if (this.errorSubscription)
            this.errorSubscription.unsubscribe();
        if (this.messageSubscription)
            this.messageSubscription.unsubscribe();
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
        if (this.routerSubscription)
            this.routerSubscription.unsubscribe();
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    }

    onSubmit(value: any): void {
        //todo--
    }

    public onFieldChangeUpdateInputParams(): void {

        this.inputParamsAccSearch['groupAccountNumber'] = this.visitToleranceFormGroup.controls['GroupAccountNumber'].value ? this.visitToleranceFormGroup.controls['GroupAccountNumber'].value : '';
        this.inputParamsAccSearch['groupName'] = this.visitToleranceFormGroup.controls['GroupName'].value ? this.visitToleranceFormGroup.controls['GroupName'].value : '';


        this.inputParamsContract['accountNumber'] = this.visitToleranceFormGroup.controls['AccountNumber'].value ? this.visitToleranceFormGroup.controls['AccountNumber'].value : '';
        this.inputParamsContract['accountName'] = this.visitToleranceFormGroup.controls['AccountName'].value ? this.visitToleranceFormGroup.controls['AccountName'].value : '';

        this.ellipsisConfig.premises.childConfigParams['ContractNumber'] = this.visitToleranceFormGroup.controls['ContractNumber'].value ? this.visitToleranceFormGroup.controls['ContractNumber'].value : '';
        this.ellipsisConfig.premises.childConfigParams['ContractName'] = this.visitToleranceFormGroup.controls['ContractName'].value ? this.visitToleranceFormGroup.controls['ContractName'].value : '';

        this.ellipsisConfig.product.childConfigParams['ContractNumber'] = this.visitToleranceFormGroup.controls['ContractNumber'].value ? this.visitToleranceFormGroup.controls['ContractNumber'].value : '';
        this.ellipsisConfig.product.childConfigParams['ContractName'] = this.visitToleranceFormGroup.controls['ContractName'].value ? this.visitToleranceFormGroup.controls['ContractName'].value : '';

        this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = this.visitToleranceFormGroup.controls['PremiseNumber'].value ? this.visitToleranceFormGroup.controls['PremiseNumber'].value : '';
        this.ellipsisConfig.product.childConfigParams['PremiseName'] = this.visitToleranceFormGroup.controls['PremiseName'].value ? this.visitToleranceFormGroup.controls['PremiseName'].value : '';

    }

    public getParentFieldValue(params: any): void {
        this.storeData = {};
        this.storeData['data'] = {};

        let groupName = params['GroupName'];
        let groupAccountNumber = params['GroupAccountNumber'];

        let accountNumber = params['AccountNumber'];
        let accountName = params['AccountName'];

        let contractNumber = params['ContractNumber'];

        let contractName = params['ContractName'];

        let premiseNumber = params['PremiseNumber'];

        let premiseName = params['PremiseName'];
        let productCode = params['ProductCode'];
        let productDesc = params['ProductDesc'];
        let ServiceCoverNumber = params['ServiceCoverNumber'];
        let currentServiceCoverRowID = params['CurrentServiceCoverRowID'];

        this.storeData['data'].GroupName = groupName ? groupName : '';
        this.storeData['data'].GroupAccountNumber = groupAccountNumber ? groupAccountNumber : '';
        this.storeData['data'].AccountNumber = accountNumber ? accountNumber : '';
        this.storeData['data'].AccountName = accountName ? accountName : '';
        this.storeData['data'].ContractNumber = contractNumber ? contractNumber : '';
        this.storeData['data'].ContractName = contractName ? contractName : '';

        this.storeData['data'].PremiseNumber = premiseNumber ? premiseNumber : '';
        this.storeData['data'].PremiseName = premiseName ? premiseName : '';
        this.storeData['data'].ProductCode = productCode ? productCode : '';
        this.storeData['data'].ProductDesc = productDesc ? productDesc : '';

        this.storeData['data'].ServiceCoverNumber = ServiceCoverNumber ? ServiceCoverNumber : '';
        this.storeData['data'].CurrentServiceCoverRowID = currentServiceCoverRowID ? currentServiceCoverRowID : '';

    }


    public getGridInfo(info: any): void {
        this.totalRecords = info.totalRows;
    }
    public getCurrentPage(data: any): void {
        this.currentPage = data.value;
        this.buildGrid();
    }

    public setFormData(data: any): void {
        this.visitToleranceFormGroup.controls['BusinessCode'].setValue(this.visittoleranceContractData.BusinessCode);
        this.visitToleranceFormGroup.controls['BusinessDesc'].setValue(this.visittoleranceContractData.BusinessDesc);

        if (data && data['data']) {
            //this.logger.warn(' VisitToleranceGridComponent --setFormData  data ', data);

            let pageparentmode: string = this.inputParamsVisitTolerance.parentMode;
            switch (pageparentmode) {
                case 'GroupAccountVisitTolerance':
                    this.visitToleranceFormGroup.controls['GroupName'].setValue((typeof data['data'].GroupName !== 'undefined') ? data['data'].GroupName : '');
                    this.visitToleranceFormGroup.controls['GroupAccountNumber'].setValue((typeof data['data'].GroupAccountNumber !== 'undefined') ? data['data'].GroupAccountNumber : '');

                    break;
                case 'AccountVisitTolerance':
                    this.visitToleranceFormGroup.controls['AccountNumber'].setValue((typeof data['data'].AccountNumber !== 'undefined') ? data['data'].AccountNumber : '');
                    this.visitToleranceFormGroup.controls['AccountName'].setValue((typeof data['data'].AccountName !== 'undefined') ? data['data'].AccountName : '');

                    this.inputParamsContract['accountNumber'] = this.visitToleranceFormGroup.controls['AccountNumber'].value;
                    this.inputParamsContract['accountName'] = this.visitToleranceFormGroup.controls['AccountName'].value;


                    break;
                case 'ContractVisitTolerance':
                    this.visitToleranceFormGroup.controls['ContractNumber'].setValue((typeof data['data'].ContractNumber !== 'undefined') ? data['data'].ContractNumber : '');
                    this.visitToleranceFormGroup.controls['ContractName'].setValue((typeof data['data'].ContractName !== 'undefined') ? data['data'].ContractName : '');

                    break;
                case 'PremiseVisitTolerance':
                    this.visitToleranceFormGroup.controls['ContractNumber'].setValue((typeof data['data'].ContractNumber !== 'undefined') ? data['data'].ContractNumber : '');
                    this.visitToleranceFormGroup.controls['ContractName'].setValue((typeof data['data'].ContractName !== 'undefined') ? data['data'].ContractName : '');
                    this.visitToleranceFormGroup.controls['PremiseNumber'].setValue((typeof data['data'].PremiseNumber !== 'undefined') ? data['data'].PremiseNumber : '');
                    this.visitToleranceFormGroup.controls['PremiseName'].setValue((typeof data['data'].PremiseName !== 'undefined') ? data['data'].PremiseName : '');
                    this.visitToleranceFormGroup.controls['ProductCode'].setValue((typeof data['data'].ProductCode !== 'undefined') ? data['data'].ProductCode : '');

                    break;
                case 'ServiceCoverVisitTolerance':
                    this.visitToleranceFormGroup.controls['ContractNumber'].setValue((typeof data['data'].ContractNumber !== 'undefined') ? data['data'].ContractNumber : '');
                    this.visitToleranceFormGroup.controls['ContractName'].setValue((typeof data['data'].ContractName !== 'undefined') ? data['data'].ContractName : '');
                    this.visitToleranceFormGroup.controls['PremiseNumber'].setValue((typeof data['data'].PremiseNumber !== 'undefined') ? data['data'].PremiseNumber : '');
                    this.visitToleranceFormGroup.controls['PremiseName'].setValue((typeof data['data'].PremiseName !== 'undefined') ? data['data'].PremiseName : '');
                    this.visitToleranceFormGroup.controls['ProductCode'].setValue((typeof data['data'].ProductCode !== 'undefined') ? data['data'].ProductCode : '');
                    this.visitToleranceFormGroup.controls['ProductDesc'].setValue((typeof data['data'].ProductDesc !== 'undefined') ? data['data'].ProductDesc : '');

                    this.visitToleranceFormGroup.controls['ServiceCoverRowID'].setValue((typeof data['data'].CurrentServiceCoverRowID !== 'undefined') ? data['data'].CurrentServiceCoverRowID : '');
                    break;
                default:
                    break;
            }
        }
        this.visitToleranceFormGroup.updateValueAndValidity();
        this.onFieldChangeUpdateInputParams();
    }
    public onGroupAccount(data: any): void {
        if (data.GroupName) {
            this.visitToleranceFormGroup.controls['GroupAccountNumber'].setValue(data.GroupAccountNumber);
            this.visitToleranceFormGroup.controls['GroupName'].setValue(data.GroupName);
            this.inputParamsAccSearch['groupName'] = data.GroupName;
            this.inputParamsAccSearch['groupAccountNumber'] = data.GroupAccountNumber;
        }
        else {
            this.visitToleranceFormGroup.controls['GroupAccountNumber'].setValue(this.GroupAccount = data.GroupAccountNumber);
            this.inputParamsAccSearch['groupAccountNumber'] = data.GroupAccountNumber;
        }
    }
    public setAccountNumber(data: any): void {
        this.visitToleranceFormGroup.controls['AccountNumber'].setValue(data.AccountNumber);
        this.visitToleranceFormGroup.controls['AccountName'].setValue(data.AccountName);
    }


    public onContractDataReceived(data: any): void {
        this.visitToleranceFormGroup.controls['ContractNumber'].setValue(data.ContractNumber);
        this.visitToleranceFormGroup.controls['ContractName'].setValue(data.ContractName);

    }

    public onPremisesDataReceived(data: any, route: any): void {
        this.visitToleranceFormGroup.controls['PremiseNumber'].setValue(data.PremiseNumber);
        this.ellipsisConfig.product.childConfigParams.PremiseNumber = data.PremiseNumber;

        if (data.PremiseName) {
            this.ellipsisConfig.product.childConfigParams.PremiseName = data.PremiseName;
            this.visitToleranceFormGroup.controls['PremiseName'].setValue(data.PremiseName);
        }

    }

    public onProductDataReceived(data: any, route: any): void {
        this.visitToleranceFormGroup.controls['ProductCode'].setValue(data.ProductCode);
        if (data.ProductDesc) {
            this.visitToleranceFormGroup.controls['ProductDesc'].setValue(data.ProductDesc);
        }
    }

    public modalHiddenPremises(): void {
        //No functionality
    }
    public modalHiddenProductCode(): void {
        //No functionality
    }

    public onChangeEvent(event: any): void {
        this.router.navigate([InternalMaintenanceSalesModuleRoutes.ICABSSVISITTOLERANCEMAINTENANCE], {
            queryParams: {
                parentMode: 'VisitToleranceGrid',
                VisitToleranceAdd: 'VisitToleranceAdd',
                currentContractTypeURLParameter: this.currentContractTypeURLParameter
            }
        });
    }


    public buildGrid(): void {
        this.search = new URLSearchParams();
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.Action, this.queryParams.action);
        this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode || this.utilService.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode || this.utilService.getCountryCode());
        this.visitToleranceGrid.update = true;
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('PageSize', this.itemsPerPage.toString());
        this.search.set('PageCurrent', this.currentPage.toString());
        this.search.set('HeaderClickedColumn', '');
        this.search.set('riSortOrder', 'Descending');
        this.search.set('Level', this.parentMode);
        this.search.set('GroupAccountNumber', this.visitToleranceFormGroup.controls['GroupAccountNumber'].value);
        this.search.set('AccountNumber', this.visitToleranceFormGroup.controls['AccountNumber'].value);
        this.search.set('ContractNumber', this.visitToleranceFormGroup.controls['ContractNumber'].value);


        if (this.parentMode === 'PremiseVisitTolerance') {
            this.search.set('PremiseNumber', this.visitToleranceFormGroup.controls['PremiseNumber'].value);
            this.search.set('ProductCode', this.visitToleranceFormGroup.controls['ProductCode'].value);
        }

        if (this.parentMode === 'ServiceCoverVisitTolerance') {
            this.search.set('PremiseNumber', this.visitToleranceFormGroup.controls['PremiseNumber'].value);
            this.search.set('ProductCode', this.visitToleranceFormGroup.controls['ProductCode'].value);
            this.search.set('ServiceCoverNumber', this.visitToleranceFormGroup.controls['ServiceCoverNumber'].value);
            this.search.set('ServiceCoverRowID', this.visitToleranceFormGroup.controls['ServiceCoverRowID'].value);
        }

        this.inputParams.search = this.search;
        this.visitToleranceGrid.loadGridData(this.inputParams);
    }


    public postData(params: any): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.BusinessCode, this.utilService.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utilService.getCountryCode());
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set('riSortOrder', 'Descending');
        this.search.set('riGridMode', '3');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('HeaderClickedColumn', 'Descending');
        this.search.set('Level', this.parentMode);
        this.search.set('GroupAccountNumber', this.visitToleranceFormGroup.controls['GroupAccountNumber'].value);
        this.search.set('AccountNumber', this.visitToleranceFormGroup.controls['AccountNumber'].value);
        this.search.set('ContractNumber', this.visitToleranceFormGroup.controls['ContractNumber'].value);
        if (this.parentMode === 'PremiseVisitTolerance') {
            this.search.set('PremiseNumber', this.visitToleranceFormGroup.controls['PremiseNumber'].value);
            this.search.set('ProductCode', this.visitToleranceFormGroup.controls['ProductCode'].value);
        }

        if (this.parentMode === 'ServiceCoverVisitTolerance') {
            this.search.set('PremiseNumber', this.visitToleranceFormGroup.controls['PremiseNumber'].value);
            this.search.set('ProductCode', this.visitToleranceFormGroup.controls['ProductCode'].value);
            this.search.set('ServiceCoverNumber', this.visitToleranceFormGroup.controls['ServiceCoverNumber'].value);
            this.search.set('ServiceCoverRowID', this.visitToleranceFormGroup.controls['ServiceCoverRowID'].value);
        }

        if (params) {
            for (let key in params) {
                if (key) {
                    this.search.set(key, params[key]);
                }
            }
        }

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, params).subscribe(
            (e) => {
                if (e.status === GlobalConstant.Configuration.Failure) {
                    this.errorService.emitError(e.oResponse);
                } else {
                    if (e['errorMessage']) {
                        this.errorService.emitError(e);
                        return;
                    }
                    //this.visitToleranceGrid.clearGridData();
                    this.buildGrid();
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }


    public selectedDataOnDoubleClick(event: any): void {
        if (event) {
            this.visitToleranceFocus(event);
            if (event.cellIndex === 0) {
                let self = { VisitToleranceRowID: this.pageAttribute.BusinessCodeVisitToleranceRowID, ParentPageMode: this.inputParamsVisitTolerance.parentMode };
                let grid = { gridData: event };
                let controls = { fromGroup: this.visitToleranceFormGroup.controls };
                let pageObj = this.riExchange.createPageObject(this.visitToleranceFormGroup, controls, self, grid);
                this.riExchange.initBridge(pageObj);
                this.router.navigate([InternalMaintenanceSalesModuleRoutes.ICABSSVISITTOLERANCEMAINTENANCE], {
                    queryParams: {
                        Mode: 'VisitToleranceGrid',
                        RowID: this.pageAttribute.BusinessCodeVisitToleranceRowID,
                        currentContractTypeURLParameter: this.currentContractTypeURLParameter
                    }
                });
            }
        }
    }


    public selectedDataOnCellFocus(event: any): void {
        this.setupTableColumn(event.colIndex, event.rowIndex);
        if (event.cellIndex === 5) {
            this.currentColumnName = 'Tolerance';
            this.visitToleranceFocus(event);
        }
    }


    public setupTableColumn(colIndex: any, rowIndex: any): any {
        let obj = document.querySelectorAll('.gridtable tbody > tr > td:first-child input[type=text]');

        if (obj && obj.length >= rowIndex) {
            obj[rowIndex].setAttribute('readonly', 'true');
        }

        let obj2 = document.querySelectorAll('.gridtable tbody > tr > td:last-child input[type=text]');
        if (obj2 && obj2.length >= rowIndex) {
            obj2[rowIndex].setAttribute('maxlength', '6');
            this.renderer.listen(obj2[rowIndex], 'keypress', (event) => {
                return /\d/.test(String.fromCharCode(((event || window.event).which || (event || window.event).which)));
            });
        }
    }

    public numeticTextvalue(event: any): any {
        let charCode = (event.which) ? event.which : event.keyCode;
        if (charCode === 46 && event.srcElement.value.split('.').length > 1) {
            return false;
        }
        if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }

    public onCellClickBlur(data: any): void {
        if ((data.cellIndex === 5) && data.updateValue && (data.cellData.text !== data.updateValue)) {
            //this.logger.warn('onCellClickBlur', data);
            let params = {
                'ToleranceRowID': data.cellData.rowID,
                'Tolerance': data.updateValue
            };

            this.postData(params);
        }
    }

    public visitToleranceFocus(event: any): void {

        if (event.cellData) {
            //this.pageAttribute.BusinessCodeRow = event.cellData.sectionRowIndex;
            //this.pageAttribute.GrdToleranceRow = event.cellData.sectionRowIndex;
            this.pageAttribute.BusinessCodeVisitToleranceRowID = event.cellData.rowID;
            this.pageAttribute.GrdToleranceVisitToleranceRowID = event.cellData.rowID;
        }
    }


    public onKeyDown(event: any): void {
        if (!event) return;

        event.preventDefault();
        if (event.keyCode === 34) {
            if (event.target.id === 'ContractNumber') {
                this.contractSearchEllipsis.openModal();
            }
            else if (event.target.id === 'AccountNumber') {
                this.accountSearchEllipsis.openModal();
            }
            else if (event.target.id === 'GroupAccountNumber') {
                this.groupAccountNumberEllipsis.openModal();
            }
            else if (event.target.id === 'ProductCode') {
                this.lookUpServiceCover();
            }
            else if (event.target.id === 'PremiseNumber') {
                this.premiseSearchEllipsis.openModal();

            }

        }
    }

    private lookUpServiceCover(): void {
        //alert('iCABSAServiceCoverSearch');
        //window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAServiceCoverSearch.htm" + CurrentContractTypeURLParameter
        //this.router.navigate(['/application/contractsearch'], { queryParams: { Mode: 'LookUp', ContractTypeUrl: this.currentContractTypeURLParameter } });
    }

    public onBlur(event: any): void {
        if (!event) return;
        let elementValue = event.target.value;
        let _paddedValue = elementValue;
        if (event.target.id === 'ContractNumber') {
            // Fill the contract number field with leading zeroes.
            if (elementValue.length > 0) {
                event.target.value = this.numberFormatValue(elementValue, 8);
                this.visitToleranceFormGroup.controls['ContractNumber'].setValue(event.target.value);
            }
            this.onDeActivate(event);
        }
        else if (event.target.id === 'AccountNumber') {
            if (elementValue.length > 0) {
                event.target.value = this.numberFormatValue(elementValue, 9);
                this.visitToleranceFormGroup.controls['AccountNumber'].setValue(event.target.value);
            }
            this.onDeActivate(event);
        }
        else if (event.target.id === 'PremiseNumber') {
            this.onDeActivate(event);
        }
        else if (event.target.id === 'ProductCode') {
            this.onDeActivate(event);
        }
        else if (event.target.id === 'GroupAccountNumber') {
            this.onDeActivate(event);
        }

    };

    public onDeActivate(event: any): void {
        //this.logger.warn('onDeActivate', event);
        let elementValue = event.target.value;
        if (event.target.id === 'ContractNumber') {
            //this.numberFormatValue(elementValue, 8);
            this.populateDescriptions();
        }
        else if (event.target.id === 'PremiseNumber') {
            //this.numberFormatValue(elementValue, 8);
            this.populateDescriptions();
        }
        else if (event.target.id === 'ProductCode') {
            this.ServiceCoverNumber = '';
            if (this.visitToleranceFormGroup.controls['ContractNumber'].value !== '' && this.visitToleranceFormGroup.controls['PremiseNumber'].value
                !== '' && this.pageAttribute.ProductCodeServiceCoverRowID === '') {
                if (this.visitToleranceFormGroup.controls['ServiceCoverNumber'].value === '') {
                    this.lookUpServiceCover();
                    //subscribe data here
                }
            }
            this.visitToleranceFormGroup.controls['ServiceCoverRowID'].setValue(this.pageAttribute.ProductCodeServiceCoverRowID);
            this.pageAttribute.ProductCodeServiceCoverRowID = '';
            this.populateDescriptions();
        }
        else if (event.target.id === 'AccountNumber') {
            //this.numberFormatValue(elementValue, 9);
            this.populateDescriptions();
        }
        else if (event.target.id === 'GroupAccountNumber') {
            this.populateDescriptions();
        }

    }

    public numberFormatValue(elementValue: string, maxLength: number): string {
        let paddedValue: string = elementValue;
        if (elementValue.length < maxLength) {
            paddedValue = this.utilService.numberPadding(elementValue, maxLength);
        }
        return paddedValue;
    }

    public refresh(): void {
        //this.currentPage = 1;
        //this.visitToleranceGrid.clearGridData();
        this.buildGrid();
    }

    private populateDescriptions(): void {

        this.query = new URLSearchParams();
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;

        if (this.inputParams.businessCode !== undefined && this.inputParams.businessCode !== null) {
            this.query.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        }
        if (this.inputParams.countryCode !== undefined && this.inputParams.countryCode !== null) {
            this.query.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        }

        this.query.set(this.serviceConstants.Action, '2');

        let postObj = {
            'Function': 'PopulateDescriptions',
            'GroupAccountNumber': this.visitToleranceFormGroup.controls['GroupAccountNumber'].value,
            'AccountNumber': this.visitToleranceFormGroup.controls['AccountNumber'].value,
            'ContractNumber': this.visitToleranceFormGroup.controls['ContractNumber'].value,
            'PremiseNumber': this.visitToleranceFormGroup.controls['PremiseNumber'].value,
            'ProductCode': this.visitToleranceFormGroup.controls['ProductCode'].value,
            'ServiceCoverRowID': this.visitToleranceFormGroup.controls['ServiceCoverRowID'].value
        };

        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.query, postObj)
            .subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    if (e) {
                        this.visitToleranceFormGroup.controls['GroupAccountNumber'].setValue(e.GroupAccountNumber);
                        this.visitToleranceFormGroup.controls['GroupName'].setValue(e.GroupName);
                        let accountNumber = (e.AccountNumber) ? this.numberFormatValue(e.AccountNumber, 9) : '';
                        this.visitToleranceFormGroup.controls['AccountNumber'].setValue(accountNumber);
                        this.visitToleranceFormGroup.controls['AccountName'].setValue(e.AccountName);
                        let contractNumber = (e.ContractNumber) ? this.numberFormatValue(e.ContractNumber, 8) : '';
                        this.visitToleranceFormGroup.controls['ContractNumber'].setValue(contractNumber);
                        this.visitToleranceFormGroup.controls['ContractName'].setValue(e.ContractName);
                        this.visitToleranceFormGroup.controls['PremiseNumber'].setValue(e.PremiseNumber);
                        this.visitToleranceFormGroup.controls['PremiseName'].setValue(e.PremiseName);
                        this.visitToleranceFormGroup.controls['ProductCode'].setValue(e.ProductCode);
                        this.visitToleranceFormGroup.controls['ProductDesc'].setValue(e.ProductDesc);
                        this.visitToleranceFormGroup.controls['ServiceCoverNumber'].setValue(e.ServiceCoverNumber);
                    }
                    else {
                        this.visitToleranceFormGroup.controls['ContractNumber'].setValue('');
                        this.visitToleranceFormGroup.controls['ContractName'].setValue('');
                        this.visitToleranceFormGroup.controls['PremiseNumber'].setValue('');
                        this.visitToleranceFormGroup.controls['PremiseName'].setValue('');
                        this.visitToleranceFormGroup.controls['ProductCode'].setValue('');
                        this.visitToleranceFormGroup.controls['ProductDesc'].setValue('');
                        this.visitToleranceFormGroup.controls['ServiceCoverNumber'].setValue('');
                        this.visitToleranceFormGroup.controls['AccountName'].setValue('');
                        this.visitToleranceFormGroup.controls['AccountNumber'].setValue('');
                        this.visitToleranceFormGroup.controls['GroupAccountNumber'].setValue('');
                        this.visitToleranceFormGroup.controls['GroupName'].setValue('');
                    }
                }

                this.inputParamsAccSearch['groupAccountNumber'] = this.visitToleranceFormGroup.controls['GroupAccountNumber'].value ? this.visitToleranceFormGroup.controls['GroupAccountNumber'].value : '';
                this.inputParamsAccSearch['groupName'] = this.visitToleranceFormGroup.controls['GroupName'].value ? this.visitToleranceFormGroup.controls['GroupName'].value : '';


                this.buildGrid();
            },
            (error) => {
                this.errorService.emitError(error);
            }
            );
    }

    public optionsChange(event: any): void {
        switch (event) {
            case 'AddVisitTolerance':
                let self = { ParentPageMode: this.inputParamsVisitTolerance.parentMode };
                let controls = { fromGroup: this.visitToleranceFormGroup.controls };
                let pageObj = this.riExchange.createPageObject(this.visitToleranceFormGroup, controls, self);
                this.riExchange.initBridge(pageObj);
                this.router.navigate([InternalMaintenanceSalesModuleRoutes.ICABSSVISITTOLERANCEMAINTENANCE], {
                    queryParams: {
                        Mode: 'VisitToleranceAdd',
                        ServiceCoverNumber: this.visitToleranceFormGroup.controls['ServiceCoverNumber'].value,
                        ServiceCoverRowID: this.visitToleranceFormGroup.controls['ServiceCoverRowID'].value,
                        currentContractTypeURLParameter: this.currentContractTypeURLParameter
                    }
                });
        }
    }

    public onBackLinkClick(event: any): void {
        event.preventDefault();
        this.location.back();
    }

    public doLookupformData(): void {
        let lookupIP = [
            {
                'table': 'Business',
                'query': {
                    'BusinessCode': this.utilService.getBusinessCode()
                },
                'fields': ['BusinessDesc']
            }
        ];

        this.lookUpSubscription = this.lookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data) {
                let business = data[0][0];
                if (business) {
                    this.visittoleranceContractData.BusinessDesc = business.BusinessDesc || '';
                }
            }
        });
    }

    public getValidateProperties(): any {
        this.validateProperties = [
        {
            'type': MntConst.eTypeInteger,
            'index': 0,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 5,
            'align': 'center'
        }];
    }


}
