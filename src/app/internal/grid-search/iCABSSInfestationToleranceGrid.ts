import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { GroupAccountNumberComponent } from './../search/iCABSSGroupAccountNumberSearch';
import { AccountSearchComponent } from './../search/iCABSASAccountSearch';
import { ContractActionTypes } from './../../actions/contract';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Location } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Input, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import { Http } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { Logger } from '@nsalaun/ng2-logger';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { LocalStorageService } from 'ng2-webstorage';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { GridComponent } from './../../../shared/components/grid/grid';
import { HttpService } from '../../../shared/services/http-service';
import { ErrorService } from '../../../shared/services/error.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ActionTypes } from '../../actions/account';
import { Utils } from '../../../shared/services/utility';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { MessageService } from '../../../shared/services/message.service';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from '../../internal/search/iCABSAServiceCoverSearch';
import { GlobalizeService } from '../../../shared/services/globalize.service';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
@Component({
    templateUrl: 'iCABSSInfestationToleranceGrid.html',
    providers: [ErrorService, ComponentInteractionService]
})
export class InfestationToleranceGridComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('infestationtoleranceGrid') infestationtoleranceGrid: GridComponent;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('BuildMenuOptions') BuildMenuOptions: DropdownStaticComponent;
    @ViewChild('infestationPagination') infestationPagination: PaginationComponent;
    @ViewChild('accnoFocus') accnoFocus;
    @ViewChild('ProductEllipsis') ProductEllipsis: EllipsisComponent;
    @ViewChild('PremiseEllipsis') PremiseEllipsis: EllipsisComponent;
    @ViewChild('AccountEllipsis') AccountEllipsis: EllipsisComponent;
    @ViewChild('grpAccountEllipsis') grpAccountEllipsis: EllipsisComponent;
    public ProductCodegetAttributeServiceCoverRowID: string = '';
    public ProductCodesetAttributeServiceCoverRowID: string = '';
    public pageparentmode: string;
    public CurrentServiceCoverRowIDdata: string = '';
    public itemsPerPage: number = 10;
    public gridCurPage: number = 1;
    public maxColumn: number;
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public ajaxSubscription: Subscription;
    public errorSubscription;
    public storeSubscription: Subscription;
    public routerSubscription: Subscription;
    public componentInteractionSubscription: Subscription;
    public showErrorHeader: boolean = true;
    public searchInfestFormGroup: FormGroup;
    public errorMessage: string;
    public currentPage: string;
    public totalRecords: number;
    public isRequesting: boolean = false;
    private routeParams: any;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: false
    };
    private infestationStoreData: any;
    private contractStoreData: any = {};
    public groupAcccountNumber: string;
    public groupName: string;
    public acccountNumber: string;
    public acccountName: string;
    public contractNumber: string;
    public contractName: string;
    public premiseNumber: string;
    public premiseName: string;
    public productCode: string;
    public productDesc: string;
    public rowID: string;
    public CurrentContractTypeURLParameter: string; // this comes from parent screen
    public CurrentContractType: string;
    public CurrentContractTypeLabel: string;
    public search: URLSearchParams = new URLSearchParams();
    public searchGet: URLSearchParams = new URLSearchParams();
    public validateProperties: Array<any> = [];
    public defaultOpt: Object =
    {
        text: 'Options',
        value: ''
    };
    public MenuOptionList: Array<any> = [
        {
            text: 'Add Infestation SLA',
            value: 'AddInfestationTolerance'
        }
    ];
    public queryParams: any = {
        action: '2',
        operation: 'System/iCABSSInfestationToleranceGrid',
        module: 'service',
        method: 'service-delivery/maintenance'
    };
    public inputParamsContract: any;
    public inputParamsPremise: any;
    public inputParamsProduct: any;

    public inputParamsAccSearch: any;
    public inputParamsGrpAccNumber: any;

    private CurrentColumnName: string = '';
    public showHeader: boolean = true;
    public showCloseButton: boolean = true;
    public inputParams: any;
    public contractSearchComponent = ContractSearchComponent;
    public premiseComponent = PremiseSearchComponent;
    public productComponent = ServiceCoverSearchComponent;
    public dynamicComponent1 = AccountSearchComponent;
    public groupAccNum = GroupAccountNumberComponent;
    public pageTitle: string = 'Infestation SLA Maintenance';
    public fromParent: any;
    public backLinkText: string;
    constructor(
        private utils: Utils,
        private httpService: HttpService,
        private serviceConstants: ServiceConstants,
        private zone: NgZone,
        private global: GlobalConstant,
        private ajaxconstant: AjaxObservableConstant,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private logger: Logger,
        private errorService: ErrorService,
        private messageService: MessageService,
        private titleService: Title,
        private componentInteractionService: ComponentInteractionService,
        private translate: TranslateService,
        private localeTranslateService: LocaleTranslationService,
        private store: Store<any>,
        private sysCharConstants: SysCharConstants,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private globalize: GlobalizeService

    ) {

    }
    private sub: Subscription;

    ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.sub = this.route.queryParams.subscribe(
            (params: any) => {
                this.routeParams = params;
            }
        );
        this.componentInteractionService.emitMessage(false);
        this.fromParent = {
            CurrentContractTypeURLParameter: this.routeParams.CurrentContractTypeURLParameter,
            GroupAccountNumber: this.routeParams.GroupAccountNumber,
            GroupName: this.routeParams.GroupName,
            AccountNumber: this.routeParams.AccountNumber,
            AccountName: this.routeParams.AccountName,
            ContractNumber: this.routeParams.ContractNumber,
            ContractName: this.routeParams.ContractName,
            PremiseNumber: this.routeParams.PremiseNumber,
            PremiseName: this.routeParams.PremiseName,
            ProductCode: this.routeParams.ProductCode,
            ProductDesc: this.routeParams.ProductDesc,
            CurrentServiceCoverRowID: this.routeParams.CurrentServiceCoverRowID,
            parentMode: this.routeParams.parentMode

        };
        this.inputParams = {
            'module': this.queryParams.module,
            'method': this.queryParams.method,
            'operation': this.queryParams.operation,
            'riGridMode': '0',
            'riCacheRefresh': 'True',
            'sortOrder': 'Descending',
            'CurrentColumnName': '',
            'FileUploaded': ''
        };
        this.inputParamsAccSearch = {
            'parentMode': 'LookUp',
            'groupAccountNumber': '',
            'groupName': '',
            'showAddNew': false,
            'showAddNewDisplay': false
        };
        this.inputParamsGrpAccNumber = {
            'parentMode': 'LookUp',
            'businessCode': this.utils.getBusinessCode(),
            'countryCode': this.utils.getCountryCode(),
            'Action': '2'
        };
        this.inputParamsContract = {
            'parentMode': 'LookUp-All',
            'CurrentContractTypeURLParameter': this.fromParent.CurrentContractTypeURLParameter,
            'accountNumber': '',
            'showAddNew': false,
            'currentContractType': this.utils.getCurrentContractType(this.fromParent.CurrentContractTypeURLParameter)
        };
        this.inputParamsPremise = {
            'parentMode': 'LookUp',
            'currentContractTypeURLParameter': this.fromParent.CurrentContractTypeURLParameter,
            'ContractNumber': '',
            'ContractName': '',
            'showAddNew': false,
            'currentContractType': this.utils.getCurrentContractType(this.fromParent.CurrentContractTypeURLParameter)

        };
        this.inputParamsProduct = {
            'parentMode': 'LookUp',
            'currentContractTypeURLParameter': this.fromParent.CurrentContractTypeURLParameter,
            'ContractNumber': '',
            'ContractName': '',
            'PremiseNumber': '',
            'PremiseName': '',
            'currentContractType': this.utils.getCurrentContractType(this.fromParent.CurrentContractTypeURLParameter)
        };
        //this data comes from parent page
        this.store.dispatch({
            type: ContractActionTypes.DATA_FROM_PARENT, payload:
            {
                fromParent: {
                    CurrentContractTypeURLParameter: this.fromParent.CurrentContractTypeURLParameter,
                    GroupAccountNumber: this.fromParent['GroupAccountNumber'],
                    GroupName: this.fromParent['GroupName'],
                    AccountNumber: this.fromParent['AccountNumber'],
                    AccountName: this.fromParent['AccountName'],
                    ContractNumber: this.fromParent['ContractNumber'],
                    ContractName: this.fromParent['ContractName'],
                    PremiseNumber: this.fromParent['PremiseNumber'],
                    PremiseName: this.fromParent['PremiseName'],
                    ProductCode: this.fromParent['ProductCode'],
                    ProductDesc: this.fromParent['ProductDesc'],
                    CurrentServiceCoverRowID: this.fromParent['CurrentServiceCoverRowID'],
                    parentMode: this.fromParent['parentMode']
                }
            }
        });
        this.storeSubscription = this.store.select('contract').subscribe(data => {
            this.contractStoreData = data;
            if (data !== null && data['fromParent'] && !(Object.keys(data['fromParent']).length === 0 && data['fromParent'].constructor === Object)) {
                this.infestationStoreData = data['fromParent'];
                this.createParent(data);
                this.buildGrid();
            }
        });
        this.itemsPerPage = this.global.AppConstants().tableConfig.itemsPerPage;
        this.maxColumn = 18;
        this.localeTranslateService.setUpTranslation();
        this.CurrentContractType = this.utils.getCurrentContractType(this.fromParent.CurrentContractTypeURLParameter);
        this.CurrentContractTypeLabel = this.utils.getCurrentContractLabel(this.CurrentContractType);
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.zone.run(() => {
                    if (data.errorMessage) {
                        this.errorModal.show(data, true);
                    }
                });
            }
        });
        this.populateDescriptions();
        this.buildGrid();

        this.validateProperties = [
            {
                'type': MntConst.eTypeText,
                'index': 0,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeCode,
                'index': 1,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeCode,
                'index': 2,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeCode,
                'index': 3,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeCode,
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
                'type': MntConst.eTypeInteger,
                'index': 7,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeInteger,
                'index': 8,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeInteger,
                'index': 9,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeInteger,
                'index': 10,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeInteger,
                'index': 11,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeInteger,
                'index': 12,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeInteger,
                'index': 13,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeInteger,
                'index': 14,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeImage,
                'index': 15,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeInteger,
                'index': 16,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeInteger,
                'index': 17,
                'align': 'center'
            }
        ];
    }

    ngAfterViewInit(): void {
        document.querySelector('.option-dropdown icabs-dropdown-static select option:last-child').setAttribute('disabled', 'disabled');
        this.getTranslatedValue('Infestation SLA Maintenance', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.titleService.setTitle(res);
                }
            });
        });
    }

    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }

    }

    ngOnDestroy(): void {
        if (this.componentInteractionSubscription)
            this.componentInteractionSubscription.unsubscribe();
        if (this.errorSubscription)
            this.errorSubscription.unsubscribe();
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
        if (this.routerSubscription)
            this.routerSubscription.unsubscribe();
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
    }
    public onBuildMenuOptionChange(event: any): void {
        if (this.BuildMenuOptions.selectedItem && this.BuildMenuOptions.selectedItem === 'AddInfestationTolerance') {
            this.router.navigate(['System/iCABSSInfestationToleranceMaintenance.htm'], { queryParams: [{ riExchangeMode: 'InfestationToleranceAdd' }] });
        }
    }
    public populateDescriptions(): void {
        this.searchGet = new URLSearchParams();
        this.searchGet.set(this.serviceConstants.Action, '0');
        this.searchGet.set(this.serviceConstants.BusinessCode, this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode());
        this.searchGet.set(this.serviceConstants.CountryCode, this.contractStoreData['code'] && this.contractStoreData['code'].country ? this.contractStoreData['code'].country : this.utils.getCountryCode());
        this.searchGet.set('Function', 'PopulateDescriptions');
        this.searchGet.set('GroupAccountNumber', this.searchInfestFormGroup.controls['GroupAccountNumber'].value);
        this.searchGet.set('AccountNumber', this.searchInfestFormGroup.controls['AccountNumber'].value);
        this.searchGet.set('ContractNumber', this.searchInfestFormGroup.controls['ContractNumber'].value);
        this.searchGet.set('PremiseNumber', this.searchInfestFormGroup.controls['PremiseNumber'].value);
        this.searchGet.set('ServiceCoverRowID', this.searchInfestFormGroup.controls['ServiceCoverRowID'].value);
        this.searchGet.set('ProductCode', this.searchInfestFormGroup.controls['ProductCode'].value);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, this.searchGet)
            .subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.errorService.emitError(e);
                    this.searchInfestFormGroup.controls['ContractNumber'].setValue('');
                    this.searchInfestFormGroup.controls['PremiseNumber'].setValue('');
                    this.searchInfestFormGroup.controls['ProductCode'].setValue('');
                    this.searchInfestFormGroup.controls['ServiceCoverNumber'].setValue('');
                    this.searchInfestFormGroup.controls['AccountName'].setValue('');
                    this.searchInfestFormGroup.controls['GroupName'].setValue('');
                    this.searchInfestFormGroup.controls['GroupAccountNumber'].setValue('');
                } else {
                    this.searchInfestFormGroup.controls['ContractNumber'].setValue(e.ContractNumber);
                    this.searchInfestFormGroup.controls['ContractName'].setValue(e.ContractName);
                    this.searchInfestFormGroup.controls['PremiseNumber'].setValue(e.PremiseNumber);
                    this.searchInfestFormGroup.controls['PremiseName'].setValue(e.PremiseName);
                    this.searchInfestFormGroup.controls['ProductCode'].setValue(e.ProductCode);
                    this.searchInfestFormGroup.controls['ProductDesc'].setValue(e.ProductDesc);
                    this.searchInfestFormGroup.controls['AccountNumber'].setValue(e.AccountNumber);
                    this.searchInfestFormGroup.controls['AccountName'].setValue(e.AccountName);
                    this.searchInfestFormGroup.controls['GroupAccountNumber'].setValue(e.GroupAccountNumber);
                    this.searchInfestFormGroup.controls['GroupName'].setValue(e.GroupName);
                    this.searchInfestFormGroup.controls['ServiceCoverNumber'].setValue(e.ServiceCoverNumber);
                    if (this.searchInfestFormGroup.controls['ContractNumber'].value) {
                        this.inputParamsPremise.ContractNumber = e.ContractNumber;
                        this.inputParamsPremise.ContractName = e.ContractName;
                        this.inputParamsProduct.ContractNumber = e.ContractNumber;
                        this.inputParamsProduct.ContractName = e.ContractName;
                        this.PremiseEllipsis.updateComponent();
                        this.ProductEllipsis.updateComponent();

                    }
                    if (this.searchInfestFormGroup.controls['AccountNumber'].value) {
                        this.inputParamsContract['accountNumber'] = this.searchInfestFormGroup.controls['AccountNumber'].value;
                        this.AccountEllipsis.updateComponent();
                    }
                    else {
                        this.inputParamsContract['accountNumber'] = '';
                        this.AccountEllipsis.updateComponent();
                    }
                    if (this.searchInfestFormGroup.controls['GroupAccountNumber'].value) {
                        this.inputParamsAccSearch['groupAccountNumber'] = this.searchInfestFormGroup.controls['GroupAccountNumber'].value;
                        this.grpAccountEllipsis.updateComponent();
                    }
                    else {
                        this.inputParamsContract['groupAccountNumber'] = '';
                        this.grpAccountEllipsis.updateComponent();
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
        this.buildGrid();
    }
    public createParent(data: any): void {
        this.pageparentmode = data.fromParent.fromParent['parentMode'];
        this.CurrentServiceCoverRowIDdata = data.fromParent.fromParent['CurrentServiceCoverRowID'];
        switch (this.pageparentmode) {
            case 'GroupAccountInfestationTolerance':
                this.searchInfestFormGroup = this.formBuilder.group({
                    BusinessCode: [{ value: this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), disabled: false }],
                    BusinessDesc: [{ value: this.utils.getBusinessDesc(this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), this.contractStoreData['code'] && this.contractStoreData['code'].country ? this.contractStoreData['code'].country : '').subscribe(res => { this.searchInfestFormGroup.controls['BusinessDesc'].setValue(res.BusinessDesc); }), disabled: true }],
                    GroupAccountNumber: [{ value: data.fromParent.fromParent['GroupAccountNumber'], disabled: false }],
                    GroupName: [{ value: data.fromParent.fromParent['GroupName'], disabled: true }],
                    AccountNumber: [{ value: '', disabled: false }],
                    AccountName: [{ value: '', disabled: true }],
                    ContractNumber: [{ value: data.fromParent.fromParent['ContractNumber'], disabled: false }],
                    ContractName: [{ value: data.fromParent.fromParent['ContractName'], disabled: true }],
                    PremiseNumber: [{ value: data.fromParent.fromParent['PremiseNumber'], disabled: false }],
                    PremiseName: [{ value: data.fromParent.fromParent['PremiseName'], disabled: true }],
                    ProductCode: [{ value: data.fromParent.fromParent['ProductCode'], disabled: false }],
                    ProductDesc: [{ value: data.fromParent.fromParent['ProductDesc'], disabled: true }],
                    ServiceCoverRowID: [{ value: data.fromParent.fromParent['CurrentServiceCoverRowID'] }],
                    ServiceCoverNumber: [{ value: '', disabled: true }]
                });
                break;
            case 'AccountInfestationTolerance':
                this.searchInfestFormGroup = this.formBuilder.group({
                    BusinessCode: [{ value: this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), disabled: false }],
                    BusinessDesc: [{ value: this.utils.getBusinessDesc(this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), this.contractStoreData['code'] && this.contractStoreData['code'].country ? this.contractStoreData['code'].country : '').subscribe(res => { this.searchInfestFormGroup.controls['BusinessDesc'].setValue(res.BusinessDesc); }), disabled: true }],
                    AccountNumber: [{ value: data.fromParent.fromParent['AccountNumber'], disabled: false }],
                    AccountName: [{ value: data.fromParent.fromParent['AccountName'], disabled: true }],
                    ContractNumber: [{ value: data.fromParent.fromParent['ContractNumber'], disabled: false }],
                    ContractName: [{ value: data.fromParent.fromParent['ContractName'], disabled: true }],
                    PremiseNumber: [{ value: data.fromParent.fromParent['PremiseNumber'], disabled: false }],
                    PremiseName: [{ value: data.fromParent.fromParent['PremiseName'], disabled: true }],
                    ProductCode: [{ value: data.fromParent.fromParent['ProductCode'], disabled: false }],
                    ProductDesc: [{ value: data.fromParent.fromParent['ProductDesc'], disabled: true }],
                    ServiceCoverRowID: [{ value: data.fromParent.fromParent['CurrentServiceCoverRowID'] }],
                    GroupAccountNumber: [{ value: '', disabled: false }],
                    GroupName: [{ value: '', disabled: true }],
                    ServiceCoverNumber: [{ value: '', disabled: true }]
                });
                break;
            case 'ContractInfestationTolerance':
                this.searchInfestFormGroup = this.formBuilder.group({
                    BusinessCode: [{ value: this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), disabled: false }],
                    BusinessDesc: [{ value: this.utils.getBusinessDesc(this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), this.contractStoreData['code'] && this.contractStoreData['code'].country ? this.contractStoreData['code'].country : '').subscribe(res => { this.searchInfestFormGroup.controls['BusinessDesc'].setValue(res.BusinessDesc); }), disabled: true }],
                    ContractNumber: [{ value: data.fromParent.fromParent['ContractNumber'], disabled: false }],
                    ContractName: [{ value: data.fromParent.fromParent['ContractName'], disabled: true }],
                    PremiseNumber: [{ value: data.fromParent.fromParent['PremiseNumber'], disabled: false }],
                    PremiseName: [{ value: data.fromParent.fromParent['PremiseName'], disabled: true }],
                    ProductCode: [{ value: data.fromParent.fromParent['ProductCode'], disabled: false }],
                    ProductDesc: [{ value: data.fromParent.fromParent['ProductDesc'], disabled: true }],
                    ServiceCoverRowID: [{ value: data.fromParent.fromParent['CurrentServiceCoverRowID'] }],
                    GroupAccountNumber: [{ value: '', disabled: false }],
                    GroupName: [{ value: '', disabled: true }],
                    AccountNumber: [{ value: '', disabled: false }],
                    AccountName: [{ value: '', disabled: true }],
                    ServiceCoverNumber: [{ value: '', disabled: true }]
                });
                break;
            case 'PremiseInfestationTolerance':
                this.searchInfestFormGroup = this.formBuilder.group({
                    BusinessCode: [{ value: this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), disabled: false }],
                    BusinessDesc: [{ value: this.utils.getBusinessDesc(this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), this.contractStoreData['code'] && this.contractStoreData['code'].country ? this.contractStoreData['code'].country : '').subscribe(res => { this.searchInfestFormGroup.controls['BusinessDesc'].setValue(res.BusinessDesc); }), disabled: true }],
                    ContractNumber: [{ value: data.fromParent.fromParent['ContractNumber'], disabled: false }],
                    ContractName: [{ value: data.fromParent.fromParent['ContractName'], disabled: true }],
                    PremiseNumber: [{ value: data.fromParent.fromParent['PremiseNumber'], disabled: false }],
                    PremiseName: [{ value: data.fromParent.fromParent['PremiseName'], disabled: true }],
                    ProductCode: [{ value: data.fromParent.fromParent['ProductCode'], disabled: false }],
                    ProductDesc: [{ value: data.fromParent.fromParent['ProductDesc'], disabled: true }],
                    ServiceCoverRowID: [{ value: data.fromParent.fromParent['CurrentServiceCoverRowID'] }],
                    GroupAccountNumber: [{ value: '', disabled: false }],
                    GroupName: [{ value: '', disabled: true }],
                    AccountNumber: [{ value: '', disabled: false }],
                    AccountName: [{ value: '', disabled: true }],
                    ServiceCoverNumber: [{ value: '', disabled: true }]
                });
                break;
            case 'ServiceCoverInfestationTolerance':
                this.searchInfestFormGroup = this.formBuilder.group({
                    BusinessCode: [{ value: this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), disabled: false }],
                    BusinessDesc: [{ value: this.utils.getBusinessDesc(this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), this.contractStoreData['code'] && this.contractStoreData['code'].country ? this.contractStoreData['code'].country : '').subscribe(res => { this.searchInfestFormGroup.controls['BusinessDesc'].setValue(res.BusinessDesc); }), disabled: true }],
                    ContractNumber: [{ value: data.fromParent.fromParent['ContractNumber'], disabled: false }],
                    ContractName: [{ value: data.fromParent.fromParent['ContractName'], disabled: true }],
                    PremiseNumber: [{ value: data.fromParent.fromParent['PremiseNumber'], disabled: false }],
                    PremiseName: [{ value: data.fromParent.fromParent['PremiseName'], disabled: true }],
                    ProductCode: [{ value: data.fromParent.fromParent['ProductCode'], disabled: false }],
                    ProductDesc: [{ value: data.fromParent.fromParent['ProductDesc'], disabled: true }],
                    ServiceCoverRowID: [{ value: data.fromParent.fromParent['CurrentServiceCoverRowID'] }],
                    GroupAccountNumber: [{ value: '', disabled: false }],
                    GroupName: [{ value: '', disabled: true }],
                    AccountNumber: [{ value: '', disabled: false }],
                    AccountName: [{ value: '', disabled: true }],
                    ServiceCoverNumber: [{ value: '', disabled: true }]
                });
                break;
            default:
                this.searchInfestFormGroup = this.formBuilder.group({
                    BusinessCode: [{ value: this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), disabled: false }],
                    BusinessDesc: [{ value: this.utils.getBusinessDesc(this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), this.contractStoreData['code'] && this.contractStoreData['code'].country ? this.contractStoreData['code'].country : '').subscribe(res => { this.searchInfestFormGroup.controls['BusinessDesc'].setValue(res.BusinessDesc); }), disabled: true }],
                    ContractNumber: [{ value: '', disabled: false }],
                    ContractName: [{ value: '', disabled: true }],
                    PremiseNumber: [{ value: '', disabled: false }],
                    PremiseName: [{ value: '', disabled: true }],
                    ProductCode: [{ value: '', disabled: false }],
                    ProductDesc: [{ value: '', disabled: true }],
                    ServiceCoverRowID: [{ value: data.fromParent.fromParent['CurrentServiceCoverRowID'] }],
                    GroupAccountNumber: [{ value: '', disabled: false }],
                    GroupName: [{ value: '', disabled: true }],
                    AccountNumber: [{ value: '', disabled: false }],
                    AccountName: [{ value: '', disabled: true }],
                    ServiceCoverNumber: [{ value: '', disabled: true }]
                });
        }
    }
    public contractNumberFormatOnChange(num: any, size: any): string {
        let s = num + '';
        while (s.length < size) s = '0' + s;
        return s;
    }
    public onBlurContract(event: any): void {
        let elementValue = event.target.value;
        if (elementValue.length > 0 && elementValue.length < 8) {
            let paddedValue = this.contractNumberFormatOnChange(elementValue, 8);
            if (event.target.id === 'ContractNumber') {
                this.searchInfestFormGroup.controls['ContractNumber'].setValue(paddedValue);
                this.inputParamsPremise.ContractNumber = this.searchInfestFormGroup.controls['ContractNumber'].value;
                this.inputParamsPremise.ContractName = this.searchInfestFormGroup.controls['ContractName'].value;
                this.inputParamsProduct.ContractNumber = this.searchInfestFormGroup.controls['ContractNumber'].value;
                this.inputParamsProduct.ContractName = this.searchInfestFormGroup.controls['ContractName'].value;
                this.PremiseEllipsis.updateComponent();

            }

        }
        if (!this.searchInfestFormGroup.controls['ContractNumber'].value) {
            this.inputParamsPremise.ContractNumber = '';
            this.inputParamsPremise.ContractName = '';
            this.inputParamsProduct.ContractNumber = '';
            this.inputParamsProduct.ContractName = '';
            this.inputParamsProduct.PremiseNumber = '';
            this.inputParamsProduct.PremiseName = '';
            this.PremiseEllipsis.updateComponent();
        }
        this.populateDescriptions();
    }

    public onContractDataReceived(data: any, route: any): void {
        this.searchInfestFormGroup.controls['ContractNumber'].setValue(data.ContractNumber);
        this.searchInfestFormGroup.controls['ContractName'].setValue(data.ContractName);
        if (this.searchInfestFormGroup.controls['ContractNumber'].value) {
            this.inputParamsPremise.ContractNumber = this.searchInfestFormGroup.controls['ContractNumber'].value;
            this.inputParamsPremise.ContractName = this.searchInfestFormGroup.controls['ContractName'].value;
            this.inputParamsProduct.ContractNumber = this.searchInfestFormGroup.controls['ContractNumber'].value;
            this.inputParamsProduct.ContractName = this.searchInfestFormGroup.controls['ContractName'].value;
            this.PremiseEllipsis.updateComponent();
            this.ProductEllipsis.updateComponent();
        }
        else {
            this.inputParamsPremise.ContractNumber = '';
            this.inputParamsPremise.ContractName = '';
            this.inputParamsProduct.ContractNumber = '';
            this.inputParamsProduct.ContractName = '';
            this.PremiseEllipsis.updateComponent();
            this.ProductEllipsis.updateComponent();
        }
    }


    public onPremiseChanged(data: any, route: any): void {
        this.searchInfestFormGroup.controls['PremiseNumber'].setValue(data.PremiseNumber);
        this.searchInfestFormGroup.controls['PremiseName'].setValue(data.PremiseName);
        if (this.searchInfestFormGroup.controls['ContractNumber'].value) {
            this.inputParamsProduct.ContractNumber = this.searchInfestFormGroup.controls['ContractNumber'].value;
            this.inputParamsProduct.ContractName = this.searchInfestFormGroup.controls['ContractName'].value;
            this.ProductEllipsis.updateComponent();
        }
        else {
            this.inputParamsProduct.ContractNumber = '';
            this.inputParamsProduct.ContractName = '';
            this.ProductEllipsis.updateComponent();
        }
        if (this.searchInfestFormGroup.controls['PremiseNumber'].value) {
            this.inputParamsProduct.PremiseNumber = this.searchInfestFormGroup.controls['PremiseNumber'].value;
            this.inputParamsProduct.PremiseName = this.searchInfestFormGroup.controls['PremiseName'].value;
            this.ProductEllipsis.updateComponent();
        }
        else {
            this.inputParamsProduct.PremiseNumber = '';
            this.inputParamsProduct.PremiseName = '';
            this.ProductEllipsis.updateComponent();
        }
        this.populateDescriptions();
    }
    public onProductChanged(data: any, route: any): void {
        this.searchInfestFormGroup.controls['ProductCode'].setValue(data.ProductCode);
        this.searchInfestFormGroup.controls['ProductDesc'].setValue(data.ProductDesc);
        this.populateDescriptions();
    }
    public setAccountNumber(data: any): void {
        if (data) {
            this.searchInfestFormGroup.controls['AccountNumber'].setValue(data.AccountNumber);
            this.searchInfestFormGroup.controls['AccountName'].setValue(data.AccountName);
            this.inputParamsContract['accountNumber'] = this.searchInfestFormGroup.controls['AccountNumber'].value;
            this.accnoFocus.nativeElement.focus();
        }
    }
    public numberPadding(num: any, size: any): string {
        let s = num + '';
        while (s.length < size) s = '0' + s;
        return s;
    }
    public onGroupAccount(data: any): void {
        if (data.GroupName) {
            this.searchInfestFormGroup.controls['GroupAccountNumber'].setValue(data.GroupAccountNumber);
            this.searchInfestFormGroup.controls['GroupName'].setValue(data.GroupName);
            this.inputParamsAccSearch['groupAccountNumber'] = data.GroupAccountNumber;
            this.inputParamsAccSearch['groupName'] = data.GroupName;
        }
    }

    public onBlurPremise(event: any): void {
        if (this.searchInfestFormGroup.controls['ContractNumber'].value) {
            this.inputParamsProduct.ContractNumber = this.searchInfestFormGroup.controls['ContractNumber'].value;
            this.inputParamsProduct.ContractName = this.searchInfestFormGroup.controls['ContractName'].value;
            this.ProductEllipsis.updateComponent();
        }
        else {
            this.inputParamsProduct.ContractNumber = '';
            this.inputParamsProduct.ContractName = '';
            this.ProductEllipsis.updateComponent();
        }
        if (this.searchInfestFormGroup.controls['PremiseNumber'].value) {
            this.inputParamsProduct.PremiseNumber = this.searchInfestFormGroup.controls['PremiseNumber'].value;
            this.inputParamsProduct.PremiseName = this.searchInfestFormGroup.controls['PremiseName'].value;
            this.ProductEllipsis.updateComponent();
        }
        else {
            this.inputParamsProduct.PremiseNumber = '';
            this.inputParamsProduct.PremiseName = '';
            this.ProductEllipsis.updateComponent();
        }
        this.populateDescriptions();
    }
    public onBlurProduct(event: any): void {
        this.searchInfestFormGroup.controls['ServiceCoverNumber'].setValue('');
        if ((this.searchInfestFormGroup.controls['ContractNumber'].value !== '' || this.searchInfestFormGroup.controls['ContractNumber'].value !== null || this.searchInfestFormGroup.controls['ContractNumber'].value !== undefined) && (this.searchInfestFormGroup.controls['PremiseNumber'].value !== '' || this.searchInfestFormGroup.controls['PremiseNumber'].value !== null || this.searchInfestFormGroup.controls['PremiseNumber'].value !== undefined) && (this.ProductCodegetAttributeServiceCoverRowID !== '' || this.ProductCodegetAttributeServiceCoverRowID !== null || this.ProductCodegetAttributeServiceCoverRowID !== undefined)
        ) {
            if ((this.searchInfestFormGroup.controls['ServiceCoverNumber'].value !== '' || this.searchInfestFormGroup.controls['ServiceCoverNumber'].value !== null || this.searchInfestFormGroup.controls['ServiceCoverNumber'].value !== undefined)) {
                this.inputParamsProduct = {
                    'parentMode': 'LookUp'
                };

            }
        }
        this.searchInfestFormGroup.controls['ServiceCoverRowID'].setValue(this.ProductCodegetAttributeServiceCoverRowID);
        this.ProductCodesetAttributeServiceCoverRowID = '';
        this.populateDescriptions();
    }
    public onBlurAccountGroup(event: any): void {
        if (this.searchInfestFormGroup.controls['GroupAccountNumber'].value) {
            this.inputParamsAccSearch['groupAccountNumber'] = this.searchInfestFormGroup.controls['GroupAccountNumber'].value;
        }
        else {
            this.inputParamsAccSearch['groupAccountNumber'] = '';
        }

        this.populateDescriptions();
    }
    public onBlurAccount(event: any): void {
        let elementValue = event.target.value;
        if (elementValue.length > 0 && elementValue.length < 9) {
            let paddedValue = this.numberPadding(elementValue, 9);
            if (event.target.id === 'AccountNumber') {
                this.searchInfestFormGroup.controls['AccountNumber'].setValue(paddedValue);
                this.inputParamsContract['accountNumber'] = this.searchInfestFormGroup.controls['AccountNumber'].value;

            }
        }
        this.populateDescriptions();
    }
    public onGridRowClick(data: any): void {
        if (data.rowData['Applies To'] === data.cellData.text) {
            this.CurrentColumnName = 'TolTableType';
            this.router.navigate(['System/iCABSSInfestationToleranceMaintenance.htm'], {
                queryParams: [{ riExchangeMode: 'InfestationToleranceGrid' }]
            });
        }
    }
    public getGridInfo(info: any): void {
        this.totalRecords = info.totalRows;
    }
    public getCurrentPage(data: any): void {
        this.gridCurPage = data.value;
        this.buildGrid();
    }
    public sortGrid(data: any): void {
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, data.fieldname);
        this.search.set(this.serviceConstants.GridSortOrder, 'Descending');
        this.buildGrid();
    }
    public buildGrid(): void {
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.BusinessCode, this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.contractStoreData['code'] && this.contractStoreData['code'].country ? this.contractStoreData['code'].country : this.utils.getCountryCode());
        this.search.set('Level', this.pageparentmode);
        this.search.set('GroupAccountNumber', this.searchInfestFormGroup.controls['GroupAccountNumber'].value);
        this.search.set('AccountNumber', this.searchInfestFormGroup.controls['AccountNumber'].value);
        this.search.set('ContractNumber', this.searchInfestFormGroup.controls['ContractNumber'].value);
        this.search.set('PremiseNumber', this.searchInfestFormGroup.controls['PremiseNumber'].value);
        this.search.set('ProductCode', this.searchInfestFormGroup.controls['ProductCode'].value);
        this.search.set('ServiceCoverNumber', this.searchInfestFormGroup.controls['ServiceCoverNumber'].value);
        this.search.set('ServiceCoverRowID', this.CurrentServiceCoverRowIDdata);
        this.search.set('HeaderClickedColumn', this.inputParams.CurrentColumnName);
        this.search.set('riSortOrder', this.inputParams.sortOrder);
        this.search.set('riGridMode', this.inputParams.riGridMode);
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('FileUploaded', '');
        this.inputParams.FileUploaded = '';
        this.search.set(this.serviceConstants.GridPageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.GridPageCurrent, this.gridCurPage.toString());
        this.search.set(this.serviceConstants.Action, this.queryParams.action);
        this.inputParams.search = this.search;
        this.infestationtoleranceGrid.loadGridData(this.inputParams);
    }
    public refresh(): void {
        this.gridCurPage = 1;
        this.buildGrid();
        this.infestationtoleranceGrid.loadGridData(this.inputParams);
    }
    public btnImportSLA_onclick(): void {
        // this.router.navigate(['Business/ICABSBToleranceSLAImport.htm'], {
        //         queryParams: [{ bottom: '<bottom>' }]
        //     });
    }

    public onBackLinkClick(event: any): void {
        event.preventDefault();
        this.location.back();
    }
}
