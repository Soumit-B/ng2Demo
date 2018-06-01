import { InternalGridSearchServiceModuleRoutes, InternalMaintenanceServiceModuleRoutes } from './../../base/PageRoutes';
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';
import { setTimeout } from 'timers';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
/*import { ContractActionTypes } from './../../actions/contract';*/
import { CBBService } from './../../../shared/services/cbb.service';
import { CBBComponent } from './../../../shared/components/cbb/cbb';
import { RiExchange } from './../../../shared/services/riExchange';
import { TabsComponent } from './../../../shared/components/tabs/tabs';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { Utils } from './../../../shared/services/utility';
import { SpeedScriptConstants } from './../../../shared/constants/speed-script.constant';
import { DiscountsComponent } from './tabs/Discounts.component';
import { TelesalesComponent } from './tabs/Telesales.component';
import { InvoiceTextComponent } from './tabs/InvoiceText.component';
import { EDIInvoicingComponent } from './tabs/EDIInvoicing.component';
import { BankDetailsComponent } from './tabs/BankDetails.component';
import { GeneralComponent } from './tabs/General.component';
import { AccountManagementComponent } from './tabs/AccountManagement.component';
import { AddressComponent } from './tabs/Address.component';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { LocalStorageService } from 'ng2-webstorage';
import { TranslateService } from 'ng2-translate';
import { AccountMaintenanceActionTypes } from './../../actions/account-maintenance';
import { ActionTypes } from './../../actions/account';
import { Logger } from '@nsalaun/ng2-logger';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { Title } from '@angular/platform-browser';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { MessageService } from './../../../shared/services/message.service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AuthService } from './../../../shared/services/auth.service';
import { ErrorService } from './../../../shared/services/error.service';
import { HttpService } from './../../../shared/services/http-service';
import { AccountSearchComponent } from './../../internal/search/iCABSASAccountSearch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams, Http } from '@angular/http';
import { AccountHistoryGridComponent } from './../../internal/grid-search/iCABSAAccountHistoryGrid';
import { OnInit, Component, NgZone, OnDestroy, ViewChild, AfterViewInit, Renderer } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PostCodeSearchComponent } from '../../internal/search/iCABSBPostcodeSearch.component';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { Subscription } from 'rxjs/Subscription';
import { AccountGroupSearchComponent } from '../../internal/search/iCABSAAccountGroupSearch';
import { Store } from '@ngrx/store';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/Rx';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { GlobalizeService } from '../../../shared/services/globalize.service';

@Component({
    selector: 'icabs-account-maintenance',
    templateUrl: 'iCABSAAccountMaintenance.html',
    providers: [ComponentInteractionService, ErrorService, MessageService]
})

export class AccountMaintenanceComponent implements OnDestroy, OnInit, AfterViewInit {
    @ViewChild('accountNumberEllipsis') accountNumberEllipsis: EllipsisComponent;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('AccountNumber') public formControlAccountNumber;
    @ViewChild('AccountName') public formControlAccountName;
    @ViewChild('AccountMaintenanceTabs') riTab: TabsComponent;
    @ViewChild('contractNumberEllipsis') contractNumberEllipsis: EllipsisComponent;
    @ViewChild('postcodeSearchEllipsis') postcodeSearchEllipsis: EllipsisComponent;
    @ViewChild('riPostcodeSearchEllipsis') riPostcodeSearchEllipsis: EllipsisComponent;

    //contract modal settings on View Contract option select from Options Dropdown
    public ellipsisConfig = {
        contract: {
            disabled: false,
            showHeader: true,
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Account',
                'currentContractType': '',
                'showAddNew': false,
                'showCountry': false,
                'showBusiness': false,
                'countryCode': this.utilService.getCountryCode(),
                'businessCode': this.utilService.getBusinessCode(),
                'accountNumber': '',
                'accountName': ''
            },
            component: ContractSearchComponent
        },
        riPostcodeSearch: {
            disabled: false,
            showHeader: true,
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Account',
                'currentContractType': '',
                'showAddNew': false,
                'showCountry': false,
                'showBusiness': false,
                'countryCode': this.utilService.getCountryCode(),
                'businessCode': this.utilService.getBusinessCode(),
                'accountNumber': '',
                'accountName': ''
            },
            component: ScreenNotReadyComponent
        },
        postcodeSearch: {
            disabled: false,
            showHeader: true,
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Account',
                'currentContractType': '',
                'showAddNew': false,
                'showCountry': false,
                'showBusiness': false,
                'countryCode': this.utilService.getCountryCode(),
                'businessCode': this.utilService.getBusinessCode(),
                'accountNumber': '',
                'accountName': ''
            },
            component: ScreenNotReadyComponent
        }
    };
    public promptTitle: string;
    public accountFormGroup: FormGroup;
    public storeData: any;
    public lastStoreData: any;
    public reloadPage: boolean;
    public accountData: any;
    public accountSearchData: any;
    public accounthistorygrid = AccountHistoryGridComponent;
    public accountStoreData: any;
    public parentAccountStoreData: any;
    public inputParamsAccHistory: any = { 'parentMode': 'Account' };

    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public componentInteractionSubscription: Subscription;
    public ajaxSubscription: Subscription;
    public routerSubscription: Subscription;
    public storeSubscription: Subscription;
    public querySubscription: Subscription;
    public errorSubscription: Subscription;
    public messageSubscription: Subscription;
    public translateSubscription: Subscription;
    public storeSubscriptionAddressChange: Subscription;
    public subscriptionManager: Subscription;
    public accountSearchComponent = AccountSearchComponent;
    public errorMessage: string;
    public isRequesting: boolean = false;
    public hideEllipsis: boolean = false;
    public autoOpen: any = '';
    public autoOpenSearch: boolean = false;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public addBtn: boolean = true;
    public updateBtn: boolean = true;
    public searchBtn: boolean = true;
    public fetchBtn: boolean = false;
    public saveBtn: boolean = false;
    public isSaveDisabled: boolean = false;

    public method: string = 'contract-management/maintenance';
    public module: string = 'account';
    public operation: string = 'Application/iCABSAAccountMaintenance';
    public contentType: string = 'application/x-www-form-urlencoded';
    public addNew: boolean = true;
    public commenceDateDisplay: string;
    public inactiveEffectDateDisplay: string;
    public query: URLSearchParams = new URLSearchParams();
    public queryLookUp: URLSearchParams = new URLSearchParams();
    public querySysChar: URLSearchParams = new URLSearchParams();
    public queryAccount: URLSearchParams = new URLSearchParams();
    public searchModalRoute: string = '';
    public searchPageRoute: string = '';
    public showHeader: boolean = true;
    public showCloseButton: boolean = true;
    public showErrorHeader: boolean = true;
    public showMessageHeader: boolean = true;
    public options: any = '';

    public promptContent: string = '';
    // InputParams from parent to child
    public inputParams: any = {
        'parentMode': 'LookUp-Search',
        'businessCode': '',
        'countryCode': '',
        'BranchNumber': '',
        'lstBranchSelection': '',
        'AccountNumber': '',
        'showAddNewDisplay': true
    };
    public defaultCode: any = {
        country: '',
        business: '',
        BranchNumber: ''
    };

    public translatedMessageList: any = {
        'message1': '',
        'message2': ''
    };

    public updateMode: boolean = false;
    public addMode: boolean = false;
    public searchMode: boolean = true;
    public showControlBtn: boolean = true;
    public parentMode: string = '';
    public savedParentMode: string = '';

    public postCode: string;
    public accgrpsearch: string;
    public DataBlockfromparent: any = {
        'GroupAccountNumber': '2',
        'GroupName': 'GroupName from Account Maintenance Page'
    };


    public fieldDisabled: any = {
        'BtnSendToNAV': false,
        'cmdGetAddress': false,
        'cmdSetInvoiceGroupDefault': false,
        'cmdSetInvoiceGroupEDI': false,
        'selMandateTypeCode': false,
        'cmdGenerateNew': false
    };

    public fieldVisibility: any = {
        'menuControl': true,
        'AccountOwningBranch': true,
        'tdCustomerInfo': false,
        'tdBadDebtAccount': false,
        'tdPNOL': false
    };

    public fieldRequired: any = {
        'isAccountNumberRequired': true,
        'isAccountNameRequired': true,
        'isAccountOwningBranchRequired': true
    };

    public virtualTableField: any = {
        'CrossReferenceAccountName': '',
        'BankAccountTypeDesc': '',
        'GroupName': '',
        'AccountBusinessTypeDesc': '',
        'LogoTypeDesc': '',
        'EmployeeSurname': '',
        'AccountOwnerSurname': '',
        'TierSystemDescription': '',
        'TierDescription': '',
        'CategoryDesc': '',
        'riCountryDescription': ''
    };

    public otherParams: any = {
        'glAllowUserAuthUpdate': false,
        'cEmployeeLimitChildDrillOptions': ''
    };

    public pageParams: any = {
        'CancelEvent': false,
        'lastTabIndex': 0,
        'showPostCode': false,
        'addressLineFocus': false,
        'capitalizeFirstLetterField': {}
    };

    public sysCharParams: Object = {
        vSCEnableAddressLine3: '',
        vSCAddressLine3Logical: '',
        vSCEnableHopewiserPAF: '',
        vSCEnableDatabasePAF: '',
        vSCAddressLine4Required: '',
        vSCAddressLine4Logical: '',
        vSCAddressLine5Required: '',
        vSCAddressLine5Logical: '',
        vSCPostCodeRequired: '',
        vSCPostCodeMustExistInPAF: '',
        vSCRunPAFSearchOn1stAddressLine: '',
        vSCGroupAccount: '',
        vSCAccountDiscounts: '',
        vSCCommonStatement: '',
        vSCEnableGPSCoordinates: '',
        vSCHidePostcode: '',
        vSCSendOneOffAccntToNAV: '',
        vSCEnableMaxAddress: '',
        vSCEnableMaxAddressValue: '',
        vSCCapitalFirstLtr: '',
        vSCEnableValidatePostcodeSuburb: '',
        vSCEnablePostcodeSuburbLog: '',
        vRequired: '',
        vSCEnableTaxCodeDefaultingText: '',
        vEnableAccountLogo: '',
        vEnablePostcodeDefaulting: '',
        vSCMandatoryAccOC: '',
        vSCMandatoryAccOCLevel: '',
        vSCVisitTolerances: '',
        vDisableFieldList: '',
        vDefaultCountryCode: '',
        vSCEnableTaxCodeDefaulting: '',
        SCEnablePDADebt: true,
        vSCMultiContactInd: '',
        vSCInfestationTolerances: '',
        vSCSendOneOffAccntToNAVlog: '',
        vSCEnableAccountAddressMessage: '',
        vSCEnableBankDetailEntry: '',
        vSCEnableSEPAFinanceMandate: '',
        vSCEnableSEPAFinanceMandateLog: '',
        vBankAccountFormatCode: '',
        vDefaultMandateType: '',
        vSCHideBankDetailsTab: '',

        glAllowUserAuthUpdate: '',
        gcRegContactCentreReview: '',
        ttMandateType: [],
        vbEnableValidatePostcodeSuburb: '',
        vbEnablePostcodeSuburbLog: '',
        lRegContactCentreReview: ''
    };


    public tabName = {
        main: 'main',
        address: 'address',
        accountManagement: 'accountManagement',
        general: 'general',
        bankDetails: 'bankDetails',
        ediInvoicing: 'ediInvoicing',
        invoiceText: 'invoiceText',
        teleSales: 'teleSales',
        discounts: 'discounts'
    };

    public dropdown = {
        AccountOwningBranch: {
            params: {
                'parentMode': 'LookUp-AccountOwningBranch'
            },
            active: {
                id: '',
                text: ''
            },
            disabled: false
        }
    };

    public ttMandateType: any[] = [];
    public sentFromParent: any;

    public params: Object;
    public mode: Object;
    public currentMode: string;
    public rowId: string;
    public initializeData: boolean = true;

    public AccountGroupComponent = AccountGroupSearchComponent;
    public dynamicComponent: any = PostCodeSearchComponent;
    public queryParamValues: any = {};
    public modalTitle: string = '';
    public zipCode: string;
    public isAccountNumberEllipsisDisabled: boolean = false;
    public lastActivatedTabIndex: any = 0;
    public tabsError: Object = {
        tabA: false,
        tabB: false,
        tabC: false,
        tabD: false,
        tabE: false,
        tabF: false,
        tabG: false,
        tabH: false
    };

    public tabs: Array<any> = [
        { title: 'Address', active: true },
        { title: 'Account Management', disabled: false },
        { title: 'General', removable: false },
        { title: 'Bank Details', customClass: '' },
        { title: 'EDI Invoicing', customClass: '' },
        { title: 'Invoice Text', customClass: '' },
        { title: 'Telesales', customClass: '' },
        { title: 'Discounts', customClass: '' }
    ];
    //public componentList: Array<any> = [AddressComponent];
    public componentList: Array<any> = [AddressComponent, AccountManagementComponent, GeneralComponent, BankDetailsComponent, EDIInvoicingComponent, InvoiceTextComponent, TelesalesComponent, DiscountsComponent];
    public optionsList: Array<any> = [
        { title: '', list: ['Options'] },
        { title: 'Portfolio', list: ['Premises Details', 'Service Covers', 'Account Information', 'Telesales Order'] },
        { title: 'History', list: ['History', 'Event History'] },
        { title: 'Invoicing', list: ['Pro Rata Charge', 'Invoice Narrative', 'Invoice Charge', 'Invoice History'] },
        { title: 'Service', list: ['Product Summary', 'Static Visits (SOS)', 'Visit Summary', 'Service Recommendations', 'State of Service', 'Visit Tolerances', 'Infestation Tolerances'] },
        { title: 'Customer Relations', list: ['Contact Management', 'Contact Centre Search', 'Customer Information', 'Prospect Conversion'] }
    ];

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public componentInteractionService: ComponentInteractionService,
        public zone: NgZone,
        public httpService: HttpService,
        public fb: FormBuilder,
        public serviceConstants: ServiceConstants,
        public errorService: ErrorService,
        public messageService: MessageService,
        public authService: AuthService,
        public ajaxconstant: AjaxObservableConstant,
        public titleService: Title,
        public sysCharConstants: SysCharConstants,
        public store: Store<any>,
        public logger: Logger,
        public translate: TranslateService,
        public ls: LocalStorageService,
        public http: Http,
        public translateService: LocaleTranslationService,
        public speedScriptConstants: SpeedScriptConstants,
        public utilService: Utils,
        public routeAwayGlobals: RouteAwayGlobals,
        public riExchange: RiExchange,
        private cbbService: CBBService,
        private renderer: Renderer,
        private globalize: GlobalizeService
    ) {

        this.accountFormGroup = this.fb.group({
            AccountNumber: [{ value: '', disabled: false }, Validators.required],
            AccountName: [{ value: '', disabled: false }, Validators.required],
            AccountOwningBranch: [{ value: '', disabled: false }, Validators.required],
            CallLogID: [{ value: '', disabled: true }],
            WindowClosingName: [{ value: '', disabled: true }],
            ClosedWithChanges: [{ value: '', disabled: true }],
            SelectedOwner: [{ value: '', disabled: true }],
            PNOL: [{ value: false, disabled: true }],
            MandateTypeCode: [{ value: '', disabled: true }],
            ErrorMessageDesc: [{ value: '', disabled: true }],
            CustomerInfoAvailable: [{ value: '', disabled: true }],
            PageError: [{ value: '', disabled: true }]
        });

        this.subscriptionManager = new Subscription();
        this.storeSubscription = store.select('accountMaintenance').subscribe(data => {

            this.storeData = data;
            if (data && data['action']) {
                switch (data['action']) {
                    case AccountMaintenanceActionTypes.SAVE_DATA:
                        if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                            this.accountData = data['data'];
                            this.setFormData(data);
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_ACCOUNT:
                        if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                            this.accountData = data['data'];
                            this.setFormData(data);
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_MODE:
                        if (data['mode'] && !(Object.keys(data['mode']).length === 0 && data['mode'].constructor === Object)) {
                            this.addMode = data['mode'].addMode;
                            this.updateMode = data['mode'].updateMode;
                            this.searchMode = data['mode'].searchMode;
                            this.processForm();
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_SYSCHAR:
                        this.sysCharParams = data['syschars'];
                        this.processSysChar(true);
                        break;
                    case AccountMaintenanceActionTypes.SAVE_PROCESSED_SYSCHAR:
                        if (data['processedSysChar']) {
                            this.sysCharParams = data['processedSysChar'];
                            this.initPage();
                            if (this.parentMode) {
                                this.getParentModeData();
                            }
                            else if (this.initializeData === true) {  //to reload page data
                                if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                                    this.initializeData = false;
                                    this.initializeFormData();
                                }
                            }
                        }
                        break;
                    case AccountMaintenanceActionTypes.FORM_INIT:
                        this.initPage();
                        break;
                    case AccountMaintenanceActionTypes.SAVE_SENT_FROM_PARENT:
                        this.sentFromParent = data['sentFromParent'];
                        break;
                    case AccountMaintenanceActionTypes.FORM_VALIDITY:

                        break;
                    case AccountMaintenanceActionTypes.SAVE_OTHER_PARAMS:

                        break;
                    case AccountMaintenanceActionTypes.SUBMIT_FORM_VALIDITY:
                        if (data && data['formValidity']) {
                            this.tabsError = {
                                tabA: !data['formValidity'].address,
                                tabB: !data['formValidity'].accountManagement,
                                tabC: !data['formValidity'].general,
                                tabD: !data['formValidity'].bankDetails,
                                tabE: !data['formValidity'].ediInvoicing,
                                tabF: !data['formValidity'].invoiceText,
                                tabG: !data['formValidity'].teleSales,
                                tabH: !data['formValidity'].discounts
                            };
                            if (data['formValidity'].main &&
                                data['formValidity'].address &&
                                data['formValidity'].accountManagement &&
                                data['formValidity'].general &&
                                data['formValidity'].bankDetails &&
                                data['formValidity'].ediInvoicing &&
                                data['formValidity'].invoiceText &&
                                data['formValidity'].teleSales &&
                                data['formValidity'].discounts
                            ) {
                                this.storeData['otherParams'].CancelEvent = false;
                                this.resetErrorTab();
                                let beforeSave: Subscription = this.riMaintenance_BeforeSave().subscribe((e) => {
                                    if (this.storeData['otherParams'].CancelEvent === false) {
                                        //this.promptTitle = MessageConstant.Message.ConfirmTitle;
                                        this.promptTitle = MessageConstant.Message.ConfirmRecord;
                                        this.promptModal.show();
                                    }
                                });
                                this.subscriptionManager.add(beforeSave);
                            }
                            else {
                                this.showErrorTab();
                            }
                        }
                        break;
                    default:
                        break;
                }

            }
        });

        this.storeSubscriptionAddressChange = store.select('account').subscribe(data => {

            this.parentAccountStoreData = data;
            if (data && data['action']) {
                switch (data['action']) {
                    case ActionTypes.SAVE_ACCOUNT_ROW_DATA:
                        this.sentFromParent = data['rowData'].rowData;
                        break;
                    default:
                        break;
                }
            }
        });


        let code = {
            business: utilService.getBusinessCode(),
            country: utilService.getCountryCode()
        };
        this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_CODE, payload: code });


        this.defaultCode.country = utilService.getCountryCode();
        this.defaultCode.business = utilService.getBusinessCode();

        this.querySubscription = this.route.queryParams.subscribe(params => {
            this.queryParamValues = params;
            if (params['parent']) {
                this.parentMode = params['parent'];
                this.savedParentMode = params['parent'];
            }
            if (params['Mode']) {
                this.parentMode = params['Mode'];
                this.savedParentMode = params['Mode'];
            }
            if (params['parentMode']) {
                this.parentMode = params['parentMode'];
                this.savedParentMode = params['parentMode'];
            }
            this.rowId = params['AccountRowID'];
        });

    }

    ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.routeAwayGlobals.setEllipseOpenFlag(false);
        String.prototype['capitalizeFirstLetter'] = function (): void {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        this.lastStoreData = this.storeData;
        this.inputParams.businessCode = this.defaultCode.business;
        this.inputParams.countryCode = this.defaultCode.country;
        if (this.parentMode === 'CallCentreSearch') {
            this.inputParams['showAddNewDisplay'] = false;
            this.inputParams['showAddNew'] = false;
        }


        // if (this.ttMandateType.length === 0) {
        //     this.createMandateTypeTempData(false);
        // }

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


        this.getSpeedScriptData();
        //this.componentInteractionService.emitMessage(true);
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

        this.messageService.emitMessage(0);
        this.messageSubscription = this.messageService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                if (data && data.addMode) {
                    this.initializeData = false;
                    this.store.dispatch({
                        type: AccountMaintenanceActionTypes.CLEAR_DATA, payload: {}
                    });
                    this.tabsError = {
                        tabA: false,
                        tabB: false,
                        tabC: false,
                        tabD: false,
                        tabE: false,
                        tabF: false,
                        tabG: false,
                        tabH: false
                    };
                    this.accountData = null;
                    this.onAdd();
                }
            }
        });

        this.routerSubscription = this.router.events.subscribe(event => {
            this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_PARAMS, payload: JSON.parse(JSON.stringify(this.inputParams)) });
            if (event.url && ((event.url.indexOf('/contractmanagement/account/maintenance/search') >= 0) || (event.url.indexOf(ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE) >= 0))) {
                if (!(this.storeData && this.storeData['data'] && !(Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object))) {
                    this.searchModalRoute = '';
                    if (!this.parentMode) {
                        this.autoOpenSearch = true;
                    }
                }
                else {
                    this.autoOpenSearch = false;
                }
            }
        });

        try {
            this.translateService.setUpTranslation();
        }
        catch (e) {
            //console.log(e);
        }

        this.translateSubscription = this.translateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.fetchTranslationContent();
            }
        });


        //this.titleService.setTitle(this.inputParams.pageTitle);
        //new window['Clipboard']('.btn-copy');
        this.dispathFormGroup();
        //this.routeAwayUpdateSaveFlag(); // CR implementation
        //this.routeAwayGlobals.setEllipseOpenFlag(false); // CR implementation
    }

    public ngAfterViewInit(): void {
        if ((this.autoOpen === true) || (!this.storeData)) {
            if (!this.parentMode) {
                this.autoOpenSearch = true;
            }
        }

        if (this.parentMode) {
            this.autoOpenSearch = false;
        }
    }

    public dispathFormGroup(): void {
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                main: this.accountFormGroup
            }
        });

        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                main: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                main: this.fieldVisibility
            }
        });

        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_OTHER_PARAMS, payload: this.pageParams
        });
    }

    public getParentModeData(): void {
        this.autoOpenSearch = false;
        switch (this.parentMode) {
            case 'CallCentreSearch':
            case 'WorkOrderMaintenance':

                if (this.queryParamValues) {
                    this.saveBtn = true;
                    //this.routeAwayGlobals.setSaveEnabledFlag(true);
                    this.updateMode = true;
                    this.addMode = false;
                    this.searchMode = false;

                    let param = {
                        'AccountName': this.queryParamValues['AccountName'] || '',
                        'AccountNumber': this.queryParamValues['AccountNumber'] || ''
                    };
                    this.accountFormGroup.controls['AccountNumber'].setValue(param.AccountNumber);
                    this.accountFormGroup.controls['AccountName'].setValue(param.AccountName);
                    this.loadSelectedDataRow();
                }
                this.inputParams.showAddNewDisplay = false;
                this.inputParams['showAddNew'] = false;
                this.isAccountNumberEllipsisDisabled = true;
                break;
            case 'LoadByKeyFields':
                if (this.sentFromParent) {
                    this.fetchRecord();
                }
                break;
            case 'History':
                this.autoOpenSearch = false;
                if (this.parentAccountStoreData && this.parentAccountStoreData['rowData'] && this.parentAccountStoreData['rowData'].rowData) {
                    this.sentFromParent = this.parentAccountStoreData['rowData'].rowData;

                    let param = {
                        'AccountName': this.sentFromParent.name,
                        'AccountNumber': this.sentFromParent.number
                    };

                    this.saveBtn = true;
                    //this.routeAwayGlobals.setSaveEnabledFlag(true);
                    this.updateMode = true;
                    this.addMode = false;
                    this.searchMode = false;

                    this.accountFormGroup.controls['AccountNumber'].setValue(param.AccountNumber);
                    this.accountFormGroup.controls['AccountName'].setValue(param.AccountName);
                    this.loadSelectedDataRow();
                }
                break;
            case 'NatAccContracts':
            case 'Profitability':
            case 'ComReqPlan':
                if (this.sentFromParent) {
                    this.rowId = this.sentFromParent.attrBusinessCodeAccountRowID;
                    this.fetchRecord();
                }
                break;
            case 'GeneralSearch':
                this.autoOpenSearch = false;
                if (this.parentAccountStoreData && this.parentAccountStoreData['rowData'] && this.parentAccountStoreData['rowData'].rowData) {
                    this.sentFromParent = this.parentAccountStoreData['rowData'].rowData;

                    this.saveBtn = true;
                    //this.routeAwayGlobals.setSaveEnabledFlag(true);
                    this.updateMode = true;
                    this.addMode = false;
                    this.searchMode = false;

                    let param = {
                        'AccountNumber': this.sentFromParent.number,
                        'AccountName': this.sentFromParent.name
                    };

                    this.accountFormGroup.controls['AccountNumber'].setValue(param.AccountNumber);
                    this.accountFormGroup.controls['AccountName'].setValue(param.AccountName);
                    this.loadSelectedDataRow();
                }
                else if (this.rowId) {
                    this.saveBtn = true;
                    //this.routeAwayGlobals.setSaveEnabledFlag(true);
                    this.updateMode = true;
                    this.addMode = false;
                    this.searchMode = false;
                    let params = { 'AccountROWID': this.rowId };
                    this.loadSelectedDataRow(params);
                }
                break;
            case 'BusinessDailyTransactions':
                if (this.rowId) {
                    let params = { 'ROWID': this.rowId };
                    this.loadSelectedDataRow(params);
                }
                break;
            case 'DailyTransactions':
            case 'PDAReconciliation':
                if (this.rowId) {
                    let params = { 'ROWID': this.rowId };
                    this.loadSelectedDataRow(params);
                }
                break;
            case 'ContractPOExpiryGrid':

                this.store.dispatch({
                    type: AccountMaintenanceActionTypes.SAVE_MODE, payload:
                    {
                        updateMode: false,
                        addMode: false,
                        searchMode: false
                    }
                });
                if (this.rowId) {
                    let params = { 'ROWID': this.rowId };
                    this.loadSelectedDataRow(params);
                }
                this.inputParams.showAddNewDisplay = false;
                break;
            case 'ProspectReport':
            case 'ActivityReport':
                if (this.rowId) {
                    this.store.dispatch({
                        type: AccountMaintenanceActionTypes.SAVE_MODE, payload:
                        {
                            updateMode: true,
                            addMode: false,
                            searchMode: false
                        }
                    });
                    let params = { 'AccountRowID': this.rowId };
                    this.loadSelectedDataRow(params);
                }
                break;
        }

    }

    public showErrorTab(): void {
        let tabsElemList = document.querySelectorAll('.tab-content ul li');

        if (this.tabsError['tabA'] === true) {
            this.riTab.tabFocusTo(0);
        }
        else if (this.tabsError['tabB'] === true) {
            this.riTab.tabFocusTo(1);
        }
        else if (this.tabsError['tabC'] === true) {
            this.riTab.tabFocusTo(2);
        }
        else if (this.tabsError['tabD'] === true) {
            this.riTab.tabFocusTo(3);
        }
        else if (this.tabsError['tabE'] === true) {
            this.riTab.tabFocusTo(4);
        }
        else if (this.tabsError['tabF'] === true) {
            this.riTab.tabFocusTo(5);
        }
        else if (this.tabsError['tabG'] === true) {
            this.riTab.tabFocusTo(6);
        }
        else if (this.tabsError['tabH'] === true) {
            this.riTab.tabFocusTo(7);
        }

        setTimeout(() => {
            this.showErrorTabs();
        }, 100);

    }


    public fetchTranslationContent(): void {
        this.getTranslatedValue('Changes made to Account Address Information will not affect invoicing.', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.translatedMessageList.message_1 = res;
                }
            });

        });

        this.getTranslatedValue('The suburb, state and postcode do not match', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.translatedMessageList.message_2 = res;
                }
            });

        });

        this.getTranslatedValue('Account Maintenance', null).subscribe((res: string) => {
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


    public fetchRecord(param: any = {}): void {
        this.fetchRecordData('', param).subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    if (!e.errorMessage) {
                        this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_DATA, payload: e });
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }

    public fetchRecordData(functionName: any, params: any): any {
        this.queryAccount = new URLSearchParams();

        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        } else {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }
        this.queryAccount.set(this.serviceConstants.Action, '0');

        if (functionName !== '') {
            this.queryAccount.set(this.serviceConstants.Action, '6');
            this.queryAccount.set('Function', functionName);
        }
        for (let key in params) {
            if (key) {
                this.queryAccount.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.method, this.module, this.operation, this.queryAccount);

    }

    public fetchServiceData(functionName: any, params: any): any {
        this.queryAccount = new URLSearchParams();

        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        } else {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }
        this.queryAccount.set(this.serviceConstants.Action, '0');

        if (functionName !== '') {
            this.queryAccount.set(this.serviceConstants.Action, '6');
            this.queryAccount.set('Function', functionName);
        }
        for (let key in params) {
            if (key) {
                this.queryAccount.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.method, this.module, this.operation, this.queryAccount);

    }

    public onAccountMaintenanceDataReceived(data: any, route: any): void {
        //Set values in contract modal
        this.ellipsisConfig.contract.childConfigParams['accountNumber'] = data.AccountNumber;
        this.ellipsisConfig.contract.childConfigParams['accountName'] = data.AccountName;
        this.cbbService.disableComponent(true);
        this.lastActivatedTabIndex = 0;
        this.initializeData = false;
        this.autoOpen = false;
        this.parentMode = '';
        this.removeSpaceFromValue(data);
        this.accountSearchData = {
            data: data
        };
        this.saveBtn = true;
        /*setTimeout(() => {
            this.routeAwayGlobals.setSaveEnabledFlag(true);
        }, 0);*/
        //this.routeAwayGlobals.setSaveEnabledFlag(true);
        this.updateMode = true;
        this.addMode = false;
        this.searchMode = false;

        this.setFormData(this.accountSearchData);
        this.getSpeedScriptData('UPDATE');
        this.processForm();
        //this.routeAwayUpdateSaveFlag();
    }

    public loadSelectedDataRow(params: any = {}, mode?: any, reload: boolean = false): void {
        this.fetchAccountData('', params).subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    if (e['errorMessage']) {
                        this.errorService.emitError({ errorMessage: e['errorMessage'] });
                    } else {
                        if (mode) {
                            this.updateMode = mode.updateMode;
                            this.addMode = mode.addMode;
                            this.searchMode = mode.searchMode;
                        }
                        this.store.dispatch({
                            type: AccountMaintenanceActionTypes.SAVE_MODE, payload:
                            {
                                updateMode: this.updateMode,
                                addMode: this.addMode,
                                searchMode: this.searchMode
                            }
                        });
                        this.saveBtn = true;
                        //setTimeout(() => {
                        this.initializeForm();
                        //}, 100);
                        this.removeSpaceFromValue(e);
                        let dataset = { data: e };
                        this.getVirtualTableData(dataset);
                        this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_DATA, payload: e });
                        this.lastActivatedTabIndex = 0;
                        this.setLastActivatedTab();

                        this.accountFormGroup.controls['AccountNumber'].disable();
                        this.fieldRequired.isAccountNumberRequired = true;

                        this.accountFormGroup.updateValueAndValidity();

                        this.riMaintenance_BeforeMode();
                        this.store.dispatch({
                            type: AccountMaintenanceActionTypes.BEFORE_MODE, payload: {}
                        });

                        this.riMaintenance_AfterFetch();
                        this.riMaintenance_BeforeUpdate();

                        if ((typeof this.formControlAccountName !== 'undefined') && this.formControlAccountName) {
                            setTimeout(() => {
                                this.formControlAccountName.nativeElement.focus();
                            }, 100);
                        }
                        setTimeout(() => {
                            let elemList = document.querySelectorAll('.tab-container .nav-tabs li a');
                            for (let l = 0; l < elemList.length; l++) {
                                if (elemList[l]) {
                                    this.renderer.listen(elemList[l], 'focus', (event) => {
                                        this.setFocusToTabElement();
                                    });

                                    this.renderer.listen(elemList[l], 'click', (event) => {
                                        this.storeData['otherParams'].lastTabIndex = this.lastActivatedTabIndex;
                                    });
                                }
                            }
                        }, 100);

                        if (reload) {
                            setTimeout(() => {
                                let tabsElemList = document.querySelectorAll('.tab-content ul li');
                                if (this.lastStoreData && this.lastStoreData['otherParams']) {
                                    let tabIndex = this.lastStoreData['otherParams'].lastTabIndex;
                                    if (tabsElemList && tabIndex && tabIndex !== 0 && tabIndex < tabsElemList.length) {
                                        this.riTab.tabFocusTo(tabIndex);
                                    }
                                }

                            }, 200);
                        }

                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );

    }

    public initializeFormData(): void {
        this.initializeData = false;
        this.addMode = this.storeData['mode'].addMode;
        this.updateMode = this.storeData['mode'].updateMode;
        this.searchMode = this.storeData['mode'].searchMode;

        this.saveBtn = (this.searchMode) ? false : true;

        let searchData = {
            data: this.storeData['data']
        };
        this.setFormData(searchData);
        this.reloadPage = true;
        this.loadSelectedDataRow({}, null, this.reloadPage);
    }


    public routeOnData(): void {
        this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE]);
    }

    public TabDraw(): void {
        this.tabs = [
            { title: 'Address', active: true },
            { title: 'Account Management', disabled: false },
            { title: 'General', removable: false }
        ];
        this.componentList = [AddressComponent, AccountManagementComponent, GeneralComponent];

        if (this.sysCharParams['vSCHideBankDetailsTab'] === false) {
            this.tabs.push({ title: 'Bank Details', customClass: '' });
            this.componentList.push(BankDetailsComponent);
        }
        this.tabs.push({ title: 'EDI Invoicing', customClass: '' });
        this.tabs.push({ title: 'Invoice Text', customClass: '' });
        this.tabs.push({ title: 'Telesales', customClass: '' });

        this.componentList.push(EDIInvoicingComponent);
        this.componentList.push(InvoiceTextComponent);
        this.componentList.push(TelesalesComponent);

        if (this.sysCharParams['vSCAccountDiscounts'] === true) {
            this.tabs.push({ title: 'Discounts', customClass: '' });
            this.componentList.push(DiscountsComponent);
        }
        this.lastActivatedTabIndex = 0;
    }

    public processForm(): any {

        if (this.updateMode && !this.searchMode && !this.addMode) {
            this.accountFormGroup.controls['AccountNumber'].disable();
            this.accountFormGroup.controls['AccountName'].enable();
            this.accountFormGroup.controls['AccountOwningBranch'].enable();
            this.dropdown.AccountOwningBranch.disabled = false;
            this.isAccountNumberEllipsisDisabled = false;
        }
        if (this.searchMode && !this.updateMode && !this.addMode) {
            this.accountFormGroup.controls['AccountNumber'].enable();
            this.accountFormGroup.controls['AccountName'].disable();
            this.accountFormGroup.controls['AccountOwningBranch'].disable();
            this.dropdown.AccountOwningBranch.disabled = true;
            this.isAccountNumberEllipsisDisabled = false;
        }
        if (this.addMode && !this.updateMode && !this.searchMode) {
            this.accountFormGroup.controls['AccountNumber'].disable();
            this.accountFormGroup.controls['AccountNumber'].setValue('');
            this.accountFormGroup.controls['AccountNumber'].clearValidators();
            this.accountFormGroup.controls['AccountName'].enable();
            this.accountFormGroup.controls['AccountName'].setValue('');
            this.accountFormGroup.controls['AccountOwningBranch'].enable();
            this.accountFormGroup.controls['AccountOwningBranch'].setValue('');
            this.accountFormGroup.controls['CallLogID'].setValue('');
            this.accountFormGroup.controls['WindowClosingName'].setValue('');
            this.accountFormGroup.controls['ClosedWithChanges'].setValue('');
            this.accountFormGroup.controls['SelectedOwner'].setValue('');
            this.accountFormGroup.controls['PNOL'].setValue('');
            this.accountFormGroup.controls['MandateTypeCode'].setValue('');
            this.accountFormGroup.controls['ErrorMessageDesc'].setValue('');
            this.accountFormGroup.controls['CustomerInfoAvailable'].setValue('');
            this.isAccountNumberEllipsisDisabled = true;
        }
        this.dropdown.AccountOwningBranch.active = {
            id: this.utilService.getBranchCode(),
            text: this.utilService.getBranchText()
        };
        this.accountFormGroup.controls['AccountOwningBranch'].setValue(this.utilService.getBranchCode());
        this.accountFormGroup.updateValueAndValidity();
    }

    public setFormData(data: any): void {

        if (this.accountFormGroup && data && data['data']) {
            this.accountFormGroup.controls['AccountNumber'].setValue(data['data'].AccountNumber);
            this.accountFormGroup.controls['AccountName'].setValue(data['data'].AccountName);
            this.accountFormGroup.controls['AccountOwningBranch'].setValue(data['data'].AccountOwningBranch ? data['data'].AccountOwningBranch : '');
            if (data['data'].AccountOwningBranch) {
                this.dropdown.AccountOwningBranch.active = {
                    id: data['data'].AccountOwningBranch ? data['data'].AccountOwningBranch : '',
                    text: data['data'].AccountOwningBranch ? data['data'].AccountOwningBranch : ''
                };
            }

            this.accountFormGroup.controls['CustomerInfoAvailable'].setValue(this.setFieldValue(data['data'].CustomerInfoAvailable, true));
            this.accountFormGroup.controls['CallLogID'].setValue(this.setFieldValue(data['data'].CallLogID));
            this.accountFormGroup.controls['PNOL'].setValue(this.setFieldValue(data['data'].PNOL, true));
            this.accountFormGroup.controls['MandateTypeCode'].setValue(data['data'].MandateTypeCode);
            this.accountFormGroup.updateValueAndValidity();
        }
    }



    public sysCharParameters(): string {
        let sysCharList = [
            this.sysCharConstants.SystemCharEnableAddressLine3,
            this.sysCharConstants.SystemCharEnableHopewiserPAF,
            this.sysCharConstants.SystemCharEnableDatabasePAF,
            this.sysCharConstants.SystemCharAddressLine4Required,
            this.sysCharConstants.SystemCharAddressLine5Required,
            this.sysCharConstants.SystemCharPostCodeRequired,
            this.sysCharConstants.SystemCharPostCodeMustExistinPAF,
            this.sysCharConstants.SystemCharRunPAFSearchOnFirstAddressLine,
            this.sysCharConstants.SystemCharEnableGroupAccounts,
            this.sysCharConstants.SystemCharEnableAccountDiscounts,
            this.sysCharConstants.SystemCharDefaultStatementasCommon,
            this.sysCharConstants.SystemCharEnableGPSCoordinates,
            this.sysCharConstants.SystemCharHidePostcode,
            this.sysCharConstants.SystemCharSendOneOffAccntToNAV,
            this.sysCharConstants.SystemCharMaximumAddressLength,
            this.sysCharConstants.SystemCharDisableFirstCapitalOnAddressContact,
            this.sysCharConstants.SystemCharEnableValidatePostcodeSuburb,
            this.sysCharConstants.SystemCharDefaultTaxCodeOnServiceCoverMaint,
            this.sysCharConstants.SystemCharEnableAccountLogo,
            this.sysCharConstants.SystemCharEnablePostcodeDefaulting,
            this.sysCharConstants.SystemCharAccountOwnerCategory,
            this.sysCharConstants.SystemCharUseVisitTolerances,
            this.sysCharConstants.SystemCharUseInfestationTolerances,
            this.sysCharConstants.SystemCharSendOneOffAccntToNAV,
            this.sysCharConstants.SystemCharEnableAccountAddressMessage,
            this.sysCharConstants.SystemCharEnableBankDetailEntry,
            this.sysCharConstants.SystemCharEnableSEPAFinanceMandate,
            this.sysCharConstants.SystemCharHideBankDetailsTab
        ];
        return sysCharList.join(',');
    }

    public onSysCharDataReceive(e: any): void {

        if (e.records && e.records.length > 0) {
            this.sysCharParams['vSCEnableAddressLine3'] = e.records[0].Required ? e.records[0].Required : false;
            this.sysCharParams['vSCAddressLine3Logical'] = e.records[0].Logical ? e.records[0].Logical : false;
            this.sysCharParams['vSCEnableHopewiserPAF'] = e.records[1].Required ? e.records[1].Required : false;
            this.sysCharParams['vSCEnableDatabasePAF'] = e.records[2].Required ? e.records[2].Required : false;
            this.sysCharParams['vSCAddressLine4Required'] = e.records[3].Required ? e.records[3].Required : false;
            this.sysCharParams['vSCAddressLine4Logical'] = e.records[3].Logical ? e.records[3].Logical : false;
            this.sysCharParams['vSCAddressLine5Required'] = e.records[4].Required ? e.records[4].Required : false;
            this.sysCharParams['vSCAddressLine5Logical'] = e.records[4].Logical ? e.records[4].Logical : false;
            this.sysCharParams['vSCPostCodeRequired'] = e.records[5].Required ? e.records[5].Required : false;
            this.sysCharParams['vSCPostCodeMustExistInPAF'] = e.records[6].Required ? e.records[6].Required : false;
            this.sysCharParams['vSCRunPAFSearchOn1stAddressLine'] = e.records[7].Required ? e.records[7].Required : false;
            this.sysCharParams['vSCGroupAccount'] = e.records[8].Required ? e.records[8].Required : false;
            this.sysCharParams['vSCAccountDiscounts'] = e.records[9].Required ? e.records[9].Required : false;
            this.sysCharParams['vSCCommonStatement'] = e.records[10].Required ? e.records[10].Required : false;
            this.sysCharParams['vSCEnableGPSCoordinates'] = e.records[11].Required ? e.records[11].Required : false;
            this.sysCharParams['vSCHidePostcode'] = e.records[12].Required ? e.records[12].Required : false;
            this.sysCharParams['vSCSendOneOffAccntToNAV'] = e.records[13].Required ? e.records[13].Required : false;
            this.sysCharParams['vSCEnableMaxAddress'] = e.records[14].Logical ? e.records[14].Logical : false;
            this.sysCharParams['vSCEnableMaxAddressValue'] = e.records[14].Integer;
            this.sysCharParams['vSCCapitalFirstLtr'] = e.records[15].Required ? e.records[15].Required : false;
            this.sysCharParams['vSCEnableValidatePostcodeSuburb'] = e.records[16].Required ? e.records[16].Required : false;
            this.sysCharParams['vSCEnablePostcodeSuburbLog'] = e.records[16].Logical ? e.records[16].Logical : false;
            this.sysCharParams['vRequired'] = e.records[17].Required;
            this.sysCharParams['vSCEnableTaxCodeDefaultingText'] = e.records[17].Text ? e.records[17].Text : '';
            this.sysCharParams['vEnableAccountLogo'] = e.records[18].Required ? e.records[18].Required : false;
            this.sysCharParams['vEnablePostcodeDefaulting'] = e.records[19].Required ? e.records[19].Required : false;
            this.sysCharParams['vSCMandatoryAccOC'] = e.records[20].Required ? e.records[20].Required : false;
            this.sysCharParams['vSCMandatoryAccOCLevel'] = e.records[20].Integer;
            this.sysCharParams['vSCVisitTolerances'] = e.records[21].Required ? e.records[21].Required : false;
            this.sysCharParams['vSCInfestationTolerances'] = e.records[22].Required ? e.records[22].Required : false;
            this.sysCharParams['vSCSendOneOffAccntToNAV'] = e.records[23].Required ? e.records[23].Required : false;
            this.sysCharParams['vSCSendOneOffAccntToNAVlog'] = e.records[23].Logical ? e.records[23].Logical : false;
            this.sysCharParams['vSCEnableAccountAddressMessage'] = e.records[24].Required ? e.records[24].Required : false;
            this.sysCharParams['vSCEnableBankDetailEntry'] = e.records[25].Required ? e.records[25].Required : false;
            this.sysCharParams['vSCEnableSEPAFinanceMandate'] = e.records[26].Required ? e.records[26].Required : false;
            this.sysCharParams['vSCEnableSEPAFinanceMandateLog'] = e.records[26].Logical ? e.records[26].Logical : false;
            this.sysCharParams['vSCHideBankDetailsTab'] = e.records[27].Required ? e.records[27].Required : false;
        }
    }

    public fetchSysChar(sysCharNumbers: any): any {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.querySysChar.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        } else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            this.querySysChar.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    }

    public processSysChar(mode: boolean = false): void {

        if (this.sysCharParams['vRequired'] && this.sysCharParams['vSCEnableTaxCodeDefaultingText']) {
            let lookupValues: string[] = JSON.stringify(this.sysCharParams['vSCEnableTaxCodeDefaultingText']).split(',');
            if (lookupValues && lookupValues.find(obj => obj === '5')) {
                this.sysCharParams['vSCEnableTaxCodeDefaulting'] = true;
            }
            else {
                this.sysCharParams['vSCEnableTaxCodeDefaulting'] = false;
            }
        }
        else {
            this.sysCharParams['vSCEnableTaxCodeDefaulting'] = false;
        }

        if (!this.sysCharParams['vSCEnableTaxCodeDefaulting']) {
            this.sysCharParams['vSCEnableTaxCodeDefaulting'] = false;
        }

        this.getRegistrySetting('Contact Centre Review', this.storeData['code'].business + '_' + 'System Default Review From Drill Option')
            .subscribe((d) => {
                this.sysCharParams['gcRegContactCentreReview'] = d;
            });

        if (!this.sysCharParams['vSCEnableAddressLine3']) {
            this.sysCharParams['vDisableFieldList'] = this.sysCharParams['vDisableFieldList'] + 'DisableAddressLine3';
        }

        this.sysCharParams['vbEnableValidatePostcodeSuburb'] = this.sysCharParams['vSCEnableValidatePostcodeSuburb'] ? true : false;
        this.sysCharParams['vbEnablePostcodeSuburbLog'] = this.sysCharParams['vSCEnablePostcodeSuburbLog'] ? true : false;
        this.sysCharParams['lRegContactCentreReview'] = (this.sysCharParams['gcRegContactCentreReview'] === 'Y') ? true : false;

        this.sysCharParams['vEnablePostcodeDefaulting'] = this.sysCharParams['vEnablePostcodeDefaulting'] ? true : false;
        this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_PROCESSED_SYSCHAR, payload: this.sysCharParams });

    }


    public getSpeedScriptTableData(): any {
        let userCode = this.authService.getSavedUserCode();
        let CNFContactPersonRegSection: string = this.speedScriptConstants.CNFContactPersonRegSection;

        let data = [
            {
                'table': 'riCountry',
                'query': { 'riCountrySelected': true },
                'fields': ['riCountryCode', 'BankAccountFormatCode']
            },
            {
                'table': 'UserAuthority',
                'query': { 'BusinessCode': this.storeData['code'].business, 'UserCode': userCode },
                'fields': ['AllowUpdateOfContractInfoInd', 'UserCode']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': CNFContactPersonRegSection },
                'fields': ['RegValue', 'RegSection']
            },
            {
                'table': 'UserAuthorityBranch',
                'query': { 'UserCode': userCode, 'BusinessCode': this.storeData['code'].business },
                'fields': ['BusinessCode', 'BranchNumber', 'DefaultBranchInd', 'CurrentBranchInd', 'UserCode']
            }
        ];

        this.lookUpRecord(data, 5).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0]) {
                        this.sysCharParams['vDefaultCountryCode'] = e['results'][0][0].riCountryCode;
                        this.sysCharParams['vBankAccountFormatCode'] = e['results'][0][0].BankAccountFormatCode;
                    }

                    if (e['results'][1] && e['results'][1].length > 0) {
                        this.sysCharParams['glAllowUserAuthUpdate'] = e['results'][1][0].AllowUpdateOfContractInfoInd;
                    }
                    else {
                        let error = '2 - UserAuthority';
                    }

                    if (e['results'][2] && e['results'][2].length > 0) {
                        this.sysCharParams['vSCMultiContactInd'] = true;
                    }
                    else {
                        this.sysCharParams['vSCMultiContactInd'] = false;
                    }
                    if (e['results'][3] && e['results'][3].length > 0) {
                        for (let i = 0; i < e['results'][0].length; i++) {
                            if (e['results'][0][i].CurrentBranchInd) {
                                this.defaultCode.branchNumber = e['results'][0][i].BranchNumber;
                                break;
                            }
                        }

                    }
                }

                this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_PROCESSED_SYSCHAR, payload: JSON.parse(JSON.stringify(this.sysCharParams)) });
            },
            (error) => {
                this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_PROCESSED_SYSCHAR, payload: JSON.parse(JSON.stringify(this.sysCharParams)) });
            }
        );
    }

    public getRegistrySetting(pcRegSection: string, pcRegKey: string): Observable<any> {
        let cValue: ReplaySubject<any> = new ReplaySubject(1);
        let data = [
            {
                'table': 'riRegistry',
                'query': { 'RegSection': pcRegSection, 'RegKey': pcRegKey },
                'fields': ['RegValue', 'RegSection']
            }
        ];

        this.lookUpRecord(data, 5).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    cValue = e['results'][0].RegValue;
                }
            },
            (error) => {
                // console.log(e)
            }
        );
        return cValue;
    }

    public createMandateTypeTempData(addMode: boolean): void {
        let userCode = this.authService.getSavedUserCode();
        let gLanguageCode = this.riExchange.LanguageCode();
        let data = [
            {
                'table': 'SEPAMandateType',
                'query': { 'BusinessCode': this.storeData['code'].business },
                'fields': ['BusinessCode', 'MandateTypeCode', 'MandateTypeDesc', 'DefaultInd']
            },
            {
                'table': 'SEPAMandateTypeLang',
                'query': { 'BusinessCode': this.storeData['code'].business, 'LanguageCode': gLanguageCode },
                'fields': ['BusinessCode', 'MandateTypeCode', 'LanguageCode']
            }
        ];

        this.lookUpRecord(data, 500).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {

                    if (e['results'] && e['results'][0].length > 0) {
                        let SEPAMandateType: any[] = e['results'][0];
                        let SEPAMandateTypeLang: any[] = [];
                        if (e['results'].length > 1 && e['results'][1].length > 0) {
                            SEPAMandateTypeLang = e['results'][1];
                        }

                        SEPAMandateType.forEach(item => {
                            let filterData = SEPAMandateTypeLang.find(langObj => ((langObj.BusinessCode === item.BusinessCode)
                                && (langObj.MandateTypeCode === item.MandateTypeCode)));
                            this.ttMandateType.push({
                                'MandateTypeCode': item.MandateTypeCode,
                                'MandateTypeDesc': (filterData) ? filterData.MandateTypeDesc : item.MandateTypeDesc
                            });
                            if (item.DefaultInd === true) {
                                this.sysCharParams['vDefaultMandateType'] = item.MandateTypeCode;
                            }
                        });
                    }



                    if (this.ttMandateType && this.ttMandateType.length > 0) {
                        this.utilService.sortByKey(this.ttMandateType, 'MandateTypeDesc');
                        this.sysCharParams['ttMandateType'] = this.ttMandateType;
                    }
                }
            },
            (error) => {
                //console.log(error);
            }
        );
    }

    public getSpeedScriptData(mode: string = ''): void {

        let userCode = this.authService.getSavedUserCode();
        let CNFContactPersonRegSection: string = this.speedScriptConstants.CNFContactPersonRegSection;
        let gLanguageCode = this.riExchange.LanguageCode();
        let data = [
            {
                'table': 'SEPAMandateType',
                'query': { 'BusinessCode': this.storeData['code'].business },
                'fields': ['BusinessCode', 'MandateTypeCode', 'MandateTypeDesc', 'DefaultInd']
            },
            {
                'table': 'SEPAMandateTypeLang',
                'query': { 'BusinessCode': this.storeData['code'].business, 'LanguageCode': gLanguageCode },
                'fields': ['BusinessCode', 'MandateTypeCode', 'LanguageCode']
            }
        ];

        let data2 = [
            {
                'table': 'riCountry',
                'query': { 'riCountrySelected': true },
                'fields': ['riCountryCode', 'BankAccountFormatCode']
            },
            {
                'table': 'UserAuthority',
                'query': { 'BusinessCode': this.storeData['code'].business, 'UserCode': userCode },
                'fields': ['AllowUpdateOfContractInfoInd', 'UserCode']
            }
        ];

        let data3 = [
            {
                'table': 'riRegistry',
                'query': { 'RegSection': CNFContactPersonRegSection },
                'fields': ['RegValue', 'RegSection']
            },
            {
                'table': 'UserAuthorityBranch',
                'query': { 'UserCode': userCode, 'BusinessCode': this.storeData['code'].business },
                'fields': ['BusinessCode', 'BranchNumber', 'DefaultBranchInd', 'CurrentBranchInd', 'UserCode']
            }
        ];
        this.ttMandateType = [];
        let sysCharNumbers = this.sysCharParameters();
        this.ajaxSource.next(this.ajaxconstant.START);
        Observable.forkJoin(
            this.lookUpRecord(data, 500),
            this.lookUpRecord(data2, 10),
            this.lookUpRecord(data3, 10),
            this.fetchSysChar(sysCharNumbers)
        ).subscribe((e) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (e[0]['results'] && e[0]['results'].length > 0) {
                if (e[0]['results'] && e[0]['results'][0].length > 0) {
                    let SEPAMandateType: any[] = e[0]['results'][0];
                    let SEPAMandateTypeLang: any[] = [];
                    if (e[0]['results'].length > 1 && e[0]['results'][1].length > 0) {
                        SEPAMandateTypeLang = e[0]['results'][1];
                    }

                    SEPAMandateType.forEach(item => {
                        let filterData = SEPAMandateTypeLang.find(langObj => ((langObj.BusinessCode === item.BusinessCode)
                            && (langObj.MandateTypeCode === item.MandateTypeCode)));
                        this.ttMandateType.push({
                            'MandateTypeCode': item.MandateTypeCode,
                            'MandateTypeDesc': (filterData) ? filterData.MandateTypeDesc : item.MandateTypeDesc
                        });
                        if (item.DefaultInd === true) {
                            this.sysCharParams['vDefaultMandateType'] = item.MandateTypeCode;
                        }
                    });
                }

                if (this.ttMandateType && this.ttMandateType.length > 0) {
                    this.utilService.sortByKey(this.ttMandateType, 'MandateTypeDesc');
                    this.sysCharParams['ttMandateType'] = this.ttMandateType;
                }
            }

            if (e[1]['results'] && e[1]['results'].length > 0) {
                if (e[1]['results'][0]) {
                    this.sysCharParams['vDefaultCountryCode'] = e[1]['results'][0][0].riCountryCode;
                    this.sysCharParams['vBankAccountFormatCode'] = e[1]['results'][0][0].BankAccountFormatCode;
                }

                if (e[1]['results'][1] && e[1]['results'][1].length > 0) {

                    this.sysCharParams['glAllowUserAuthUpdate'] = e[1]['results'][1][0].AllowUpdateOfContractInfoInd;
                }
                else {
                    let error = '2 - UserAuthority';
                }
            }

            if (e[2]['results'] && e[2]['results'].length > 0) {

                if (e[2]['results'][0] && e[2]['results'][0].length > 0) {

                    this.sysCharParams['vSCMultiContactInd'] = true;
                }
                else {
                    this.sysCharParams['vSCMultiContactInd'] = false;
                }
                if (e[2]['results'][1] && e[2]['results'][1].length > 0) {
                    for (let i = 0; i < e[2]['results'][1].length; i++) {
                        if (e[2]['results'][1][i].CurrentBranchInd) {
                            this.defaultCode.branchNumber = e[2]['results'][1][i].BranchNumber;
                            break;
                        }
                    }

                }
            }


            if (e[3]['records'] && e[3]['records'].length > 0) {
                this.onSysCharDataReceive(e[3]);
            }


            this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_SYSCHAR, payload: this.sysCharParams });

            switch (mode) {
                case 'UPDATE':
                    this.loadSelectedDataRow();
                    break;
                case 'ADD':
                    setTimeout(() => {
                        this.loadDataForAddMode();
                    }, 200);

                    break;
                default:
                    break;
            }
        });
    }


    public lookUpRecord(data: any, maxresults: any): any {
        this.queryLookUp.set(this.serviceConstants.Action, '0');

        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.queryLookUp.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.queryLookUp.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        } else {
            this.queryLookUp.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            this.queryLookUp.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }

        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    }

    onPostCodeSearch(data: any): void {
        this.postCode = data.Postcode;
    }

    public modalHidden(): void {
        this.autoOpenSearch = false;
        this.initializeData = false;
        if (!this.addMode && !this.updateMode || this.searchMode) {
            this.accountFormGroup.controls['AccountNumber'].enable();
            this.store.dispatch({
                type: AccountMaintenanceActionTypes.SAVE_MODE, payload:
                {
                    updateMode: this.updateMode,
                    addMode: this.addMode,
                    searchMode: this.searchMode
                }
            });
        }
    }

    ngOnDestroy(): void {
        if (this.componentInteractionSubscription)
            this.componentInteractionSubscription.unsubscribe();
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
        if (this.querySubscription)
            this.querySubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
        if (this.subscriptionManager)
            this.subscriptionManager.unsubscribe();

        this.routeAwayGlobals.resetRouteAwayFlags();
    }


    public initPage(): void {
        this.TabDraw();
        if (this.sysCharParams['vSCSendOneOffAccntToNAVlog'] === true) {
            this.fieldVisibility.AccountOwningBranch = true;
            this.fieldRequired.isAccountOwningBranchRequired = true;
            this.accountFormGroup.controls['AccountOwningBranch'].setValidators(Validators.required);
        } else {
            this.fieldVisibility.AccountOwningBranch = false;
            this.fieldRequired.isAccountOwningBranchRequired = false;
            this.accountFormGroup.controls['AccountOwningBranch'].setErrors(null);
            this.accountFormGroup.controls['AccountOwningBranch'].clearValidators();
        }


        //if (this.sysCharParams['glAllowUserAuthUpdate']) {
        //riMaintenance.FunctionUpdate  = False
        //}

        if (this.otherParams.cEmployeeLimitChildDrillOptions !== 'Y') {
            this.fieldVisibility.menuControl = true;
        }

        this.buildMenuOptions();


        if (this.sysCharParams['vSCCapitalFirstLtr'] === true) {
            this.fieldRequired.isAccountNumberRequired = true;
            this.accountFormGroup.controls['AccountNumber'].setValidators(Validators.required);
        }
        else {
            this.fieldRequired.isAccountNumberRequired = true;
            this.accountFormGroup.controls['AccountNumber'].setValidators(Validators.required);
        }
        this.accountFormGroup.updateValueAndValidity();
        this.initializeForm();
    }


    public getVirtualTableData(data: any): any {
        let userCode = this.authService.getSavedUserCode();
        let virtualTableList = [];
        let virtualTable2List = [];

        let businessCode = this.storeData['code'].business ? this.storeData['code'].business : this.utilService.getBusinessCode();

        virtualTableList.push(
            {
                'table': 'Employee',
                'query': { 'BusinessCode': businessCode, 'EmployeeCode': (data['data'].EmployeeCode) ? data['data'].EmployeeCode : '' },
                'fields': ['EmployeeSurname']
            },
            {
                'table': 'AccountOwner',
                'query': { 'BusinessCode': businessCode, 'AccountOwner': (data['data'].AccountOwner) ? data['data'].AccountOwner : '' },
                'fields': ['AccountOwnerSurname']
            },
            {
                'table': 'Tier',
                'query': { 'BusinessCode': businessCode, 'TierCode': (data['data'].TierCode) ? data['data'].TierCode : '' },
                'fields': ['TierSystemDescription']
            },
            {
                'table': 'TierCode',
                'query': { 'BusinessCode': businessCode, 'TierCode': (data['data'].TierCode) ? data['data'].TierCode : '' },
                'fields': ['TierDescription']
            },
            {
                'table': 'CustomerCategory',
                'query': { 'BusinessCode': businessCode, 'CategoryCode': (data['data'].CategoryCode) ? data['data'].CategoryCode : '' },
                'fields': ['CategoryDesc']
            },
            {
                'table': 'riCountry',
                'query': { 'riCountryCode': data['data'].CountryCode },
                'fields': ['riCountryDescription']
            }
        );

        virtualTable2List.push(
            {
                'table': 'CrossReferenceAccount',
                'query': { 'BusinessCode': this.storeData['code'].business, 'AccountNumber': (data['data'].AccountNumber) ? data['data'].AccountNumber : '' },
                'fields': ['CrossReferenceAccountName']
            },
            {
                'table': 'BankAccountType',
                'query': { 'BankAccountTypeCode': (data['data'].BankAccountTypeCode) ? data['data'].BankAccountTypeCode : '' },
                'fields': ['BankAccountTypeDesc']
            },
            {
                'table': 'GroupAccount',
                'query': { 'GroupAccountNumber': (data['data'].GroupAccountNumber) ? data['data'].GroupAccountNumber : '' },
                'fields': ['GroupName']
            },
            {
                'table': 'AccountBusinessType',
                'query': { 'AccountBusinessTypeCode': (data['data'].AccountBusinessTypeCode) ? data['data'].AccountBusinessTypeCode : '' },
                'fields': ['AccountBusinessTypeDesc']
            },
            {
                'table': 'LogoType',
                'query': { 'LogoTypeCode': (data['data'].LogoTypeCode) ? data['data'].LogoTypeCode : '' },
                'fields': ['LogoTypeDesc']
            },
            {
                'table': 'Employee',
                'query': { 'BusinessCode': this.storeData['code'].business, 'EmployeeCode': (data['data'].EmployeeCode) ? data['data'].EmployeeCode : '' },
                'fields': ['EmployeeSurname']
            });

        this.ajaxSource.next(this.ajaxconstant.START);
        Observable.forkJoin(
            this.lookUpRecord(virtualTableList, 100),
            this.lookUpRecord(virtualTable2List, 100)
        ).subscribe((e) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (e[0]['results'] && e[0]['results'].length > 0) {

                if (e[0]['results'][0] && e[0]['results'][0].length > 0) {
                    this.virtualTableField.EmployeeSurname = e[0]['results'][0][0].EmployeeSurname;
                }
                if (e[0]['results'][1] && e[0]['results'][1].length > 0) {
                    this.virtualTableField.AccountOwnerSurname = e[0]['results'][1][0].AccountOwnerSurname;
                }
                if (e[0]['results'][2] && e[0]['results'][2].length > 0) {
                    this.virtualTableField.TierSystemDescription = e[0]['results'][2][0].TierSystemDescription;
                }
                if (e[0]['results'][3] && e[0]['results'][3].length > 0) {
                    this.virtualTableField.TierDescription = e[0]['results'][3][0].TierDescription;
                }
                if (e[0]['results'][4] && e[0]['results'][4].length > 0) {
                    this.virtualTableField.CategoryDesc = e[0]['results'][4][0].CategoryDesc;
                }
                if (e[0]['results'][5] && e[0]['results'][5].length > 0) {
                    this.virtualTableField.riCountryDescription = e[0]['results'][5][0].riCountryDescription;
                }
                this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_VIRTUAL_TABLE_DATA, payload: this.virtualTableField });
            }
            if (e[1]['results'] && e[1]['results'].length > 0) {

                if (e[1]['results'][0]) {
                    this.virtualTableField.CrossReferenceAccountName = e[1]['results'][0][0].CrossReferenceAccountName;
                }
                if (e[1]['results'][1] && e[1]['results'][1].length > 0) {

                    this.virtualTableField.BankAccountTypeDesc = e[1]['results'][1][0].BankAccountTypeDesc;
                }
                if (e[1]['results'][2] && e[1]['results'][2].length > 0) {
                    if (this.sysCharParams['vSCGroupAccount'] === true) {
                        this.virtualTableField.GroupName = e[1]['results'][2][0].GroupName;
                    }
                }
                if (e[1]['results'][3] && e[1]['results'][3].length > 0) {
                    this.virtualTableField.AccountBusinessTypeDesc = e[1]['results'][3][0].AccountBusinessTypeDesc;
                }
                if (e[1]['results'][4] && e[1]['results'][4].length > 0) {
                    this.virtualTableField.LogoTypeDesc = e[1]['results'][4][0].LogoTypeDesc;
                }
            }

            this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_VIRTUAL_TABLE_DATA, payload: this.virtualTableField });

        });
    }

    public fetchAccountData(functionName: any, params: any): any {
        this.queryAccount = new URLSearchParams();
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        } else {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }

        this.queryAccount.set(this.serviceConstants.Action, '0');

        if (this.accountFormGroup.controls['AccountNumber'].value) {
            this.queryAccount.set('AccountNumber', this.accountFormGroup.controls['AccountNumber'].value);
        }
        else {
            this.queryAccount.set('AccountNumber', '');
        }
        if (this.accountFormGroup.controls['AccountName'].value) {
            this.queryAccount.set('AccountName', this.accountFormGroup.controls['AccountName'].value);
        }
        else {
            this.queryAccount.set('AccountName', '');
        }

        if (functionName !== '') {
            this.queryAccount.set(this.serviceConstants.Action, '6');
            this.queryAccount.set('Function', functionName);
        }
        for (let key in params) {
            if (key) {
                this.queryAccount.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.method, this.module, this.operation, this.queryAccount);
    }


    public updateAccountData(): any {
        let formdata: Object = {};
        this.queryAccount = new URLSearchParams();
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        } else {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }

        this.queryAccount.set(this.serviceConstants.Action, '2');
        formdata = this.getFormDataForAccountNumber();

        if (this.storeData['data'].Account) {
            formdata['Account'] = this.storeData['data'].Account;
        }
        else {
            if (this.storeData['data'].ttAccount) {
                formdata['ttAccount'] = this.storeData['data'].ttAccount;
            }
        }

        formdata['AccountNumber'] = this.accountFormGroup.controls['AccountNumber'].value;


        this.httpService.makePostRequest(this.method, this.module, this.operation, this.queryAccount, formdata).subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                }
                else if (e['errorMessage']) {
                    this.errorModal.show({ msg: e.errorMessage, title: 'Error' }, false);
                }
                else {
                    this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: 'Message' }, false);
                    this.riMaintenance_AfterSave();
                    this.onFetch();
                    this.riMaintenance_BeforeMode();
                    this.store.dispatch({
                        type: AccountMaintenanceActionTypes.BEFORE_MODE, payload: {}
                    });
                    // this.beforeUpdate();
                    // this.store.dispatch({ type: AccountMaintenanceActionTypes.BEFORE_UPDATE, payload: {} });
                    this.riMaintenance_BeforeUpdate();
                    this.formPristine();
                }


                this.setLastActivatedTab();
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );

    }

    public addAccountData(): any {
        let formdata: Object = {};
        this.queryAccount = new URLSearchParams();

        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        } else {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }
        this.queryAccount.set(this.serviceConstants.Action, '1');
        formdata = this.getFormDataForAccountNumber();
        formdata['AccountNumber'] = '';

        this.httpService.makePostRequest(this.method, this.module, this.operation, this.queryAccount, formdata).subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                }
                else if (e['errorMessage']) {
                    //this.errorService.emitError(e['errorMessage']);
                    this.errorModal.show({ msg: e.errorMessage, title: 'Error' }, false);
                } else {
                    //this.messageModal.show({ msg: MessageConstant.Message.SavedSuccessfully, title: 'Success Message' }, false);
                    if (e.AccountNumber) {
                        this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: 'Message' }, false);
                        this.accountFormGroup.controls['AccountNumber'].setValue(e.AccountNumber);
                        this.riMaintenance_AfterSave();
                        this.onFetch();
                        this.riMaintenance_BeforeMode();
                        this.store.dispatch({
                            type: AccountMaintenanceActionTypes.BEFORE_MODE, payload: {}
                        });
                        // this.beforeUpdate();
                        // this.store.dispatch({ type: AccountMaintenanceActionTypes.BEFORE_UPDATE, payload: {} });
                        this.riMaintenance_BeforeUpdate();
                        this.formPristine();
                    }
                }
                this.setLastActivatedTab();
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }

    public getFormDataForAccountNumber(): any {
        let formdata: Object = {};
        try {
            formdata['AccountName'] = this.getFieldValue(this.accountFormGroup.controls['AccountName']);
            formdata['AccountOwningBranch'] = this.getFieldValue(this.accountFormGroup.controls['AccountOwningBranch']);
            formdata['CallLogID'] = this.getFieldValue(this.accountFormGroup.controls['CallLogID']);
            formdata['WindowClosingName'] = this.getFieldValue(this.accountFormGroup.controls['WindowClosingName']);
            formdata['ClosedWithChanges'] = this.getFieldValue(this.accountFormGroup.controls['ClosedWithChanges']);
            formdata['SelectedOwner'] = this.getFieldValue(this.accountFormGroup.controls['SelectedOwner']);
            formdata['PNOL'] = this.getFieldValue(this.accountFormGroup.controls['PNOL']);
            formdata['MandateTypeCode'] = this.getFieldValue(this.accountFormGroup.controls['MandateTypeCode']);
            formdata['ErrorMessageDesc'] = this.getFieldValue(this.accountFormGroup.controls['ErrorMessageDesc']);
            formdata['CustomerInfoAvailable'] = this.getFieldValue(this.accountFormGroup.controls['CustomerInfoAvailable']);

            // address data
            if (this.storeData['formGroup'].address !== false) {
                formdata['AccountAddressLine1'] = this.getFieldValue(this.storeData['formGroup'].address.controls['AccountAddressLine1']);
                formdata['AccountAddressLine2'] = this.getFieldValue(this.storeData['formGroup'].address.controls['AccountAddressLine2']);
                formdata['AccountAddressLine3'] = this.getFieldValue(this.storeData['formGroup'].address.controls['AccountAddressLine3']);
                formdata['AccountAddressLine4'] = this.getFieldValue(this.storeData['formGroup'].address.controls['AccountAddressLine4']);
                formdata['AccountAddressLine5'] = this.getFieldValue(this.storeData['formGroup'].address.controls['AccountAddressLine5']);
                formdata['AccountPostcode'] = this.getFieldValue(this.storeData['formGroup'].address.controls['AccountPostcode']);
                formdata['GPSCoordinateX'] = this.getFieldValue(this.storeData['formGroup'].address.controls['GPSCoordinateX']);
                formdata['GPSCoordinateY'] = this.getFieldValue(this.storeData['formGroup'].address.controls['GPSCoordinateY']);
                formdata['CountryCode'] = this.getFieldValue(this.storeData['formGroup'].address.controls['CountryCode']);
                formdata['CountryDesc'] = this.getFieldValue(this.storeData['formGroup'].address.controls['CountryDesc']);
                formdata['AccountContactName'] = this.getFieldValue(this.storeData['formGroup'].address.controls['AccountContactName']);
                formdata['AccountContactPosition'] = this.getFieldValue(this.storeData['formGroup'].address.controls['AccountContactPosition']);
                formdata['AccountContactDepartment'] = this.getFieldValue(this.storeData['formGroup'].address.controls['AccountContactDepartment']);
                formdata['AccountContactTelephone'] = this.getFieldValue(this.storeData['formGroup'].address.controls['AccountContactTelephone']);
                formdata['AccountContactMobile'] = this.getFieldValue(this.storeData['formGroup'].address.controls['AccountContactMobile']);
                formdata['AccountContactEmail'] = this.getFieldValue(this.storeData['formGroup'].address.controls['AccountContactEmail']);
                formdata['AccountContactFax'] = this.getFieldValue(this.storeData['formGroup'].address.controls['AccountContactFax']);
            }
            //accountManagement
            if (this.storeData['formGroup'].accountManagement !== false) {
                formdata['TierCode'] = this.getFieldValue(this.storeData['formGroup'].accountManagement.controls['TierCode']);
                formdata['TierDescription'] = this.getFieldValue(this.storeData['formGroup'].accountManagement.controls['TierDescription']);
                formdata['AccountOwner'] = this.getFieldValue(this.storeData['formGroup'].accountManagement.controls['AccountOwner']);
                formdata['AccountOwnerSurname'] = this.getFieldValue(this.storeData['formGroup'].accountManagement.controls['AccountOwnerSurname']);
                formdata['CategoryCode'] = this.getFieldValue(this.storeData['formGroup'].accountManagement.controls['CategoryCode']);
                formdata['CategoryDesc'] = this.getFieldValue(this.storeData['formGroup'].accountManagement.controls['CategoryDesc']);
            }
            //bankDetails
            if (this.storeData['formGroup'].bankDetails !== false) {
                formdata['BankAccountTypeCode'] = this.getFieldValue(this.storeData['formGroup'].bankDetails.controls['BankAccountTypeCode']);
                formdata['BankAccountTypeDesc'] = this.getFieldValue(this.storeData['formGroup'].bankDetails.controls['BankAccountTypeDesc']);
                formdata['BankAccountSortCode'] = this.getFieldValue(this.storeData['formGroup'].bankDetails.controls['BankAccountSortCode']);
                formdata['BankAccountNumber'] = this.getFieldValue(this.storeData['formGroup'].bankDetails.controls['BankAccountNumber']);
                formdata['VirtualBankAccountNumber'] = this.getFieldValue(this.storeData['formGroup'].bankDetails.controls['VirtualBankAccountNumber']);
                formdata['BankAccountInfo'] = this.getFieldValue(this.storeData['formGroup'].bankDetails.controls['BankAccountInfo']);
                formdata['MandateNumberSEPA'] = this.getFieldValue(this.storeData['formGroup'].bankDetails.controls['MandateNumberSEPA']);
                formdata['MandateNumberFinance'] = this.getFieldValue(this.storeData['formGroup'].bankDetails.controls['MandateNumberFinance']);
                formdata['MandateDate'] = this.globalize.parseDateToFixedFormat(this.getFieldValue(this.storeData['formGroup'].bankDetails.controls['MandateDate']));
                formdata['selMandateTypeCode'] = this.getFieldValue(this.storeData['formGroup'].bankDetails.controls['selMandateTypeCode']);
            }
            // discounts
            if (this.storeData['formGroup'].discounts !== false) {
                formdata['PromptPaymentInd'] = this.getFieldValue(this.storeData['formGroup'].discounts.controls['PromptPaymentInd'], true);
                formdata['PromptPaymentRate'] = this.globalize.parseDecimalToFixedFormat(this.getFieldValue(this.storeData['formGroup'].discounts.controls['PromptPaymentRate']), 2);
                formdata['PromptPaymentNarrative'] = this.getFieldValue(this.storeData['formGroup'].discounts.controls['PromptPaymentNarrative']);
                formdata['RetrospectiveInd'] = this.getFieldValue(this.storeData['formGroup'].discounts.controls['RetrospectiveInd'], true);
                formdata['RetrospectiveRate'] = this.globalize.parseDecimalToFixedFormat(this.getFieldValue(this.storeData['formGroup'].discounts.controls['RetrospectiveRate']), 2);
                formdata['RetrospectiveNarrative'] = this.getFieldValue(this.storeData['formGroup'].discounts.controls['RetrospectiveNarrative']);
                formdata['InvoiceDiscountInd'] = this.getFieldValue(this.storeData['formGroup'].discounts.controls['InvoiceDiscountInd'], true);
                formdata['InvoiceDiscountRate'] = this.globalize.parseDecimalToFixedFormat(this.getFieldValue(this.storeData['formGroup'].discounts.controls['InvoiceDiscountRate']), 2);
                formdata['InvoiceDiscountNarrative'] = this.getFieldValue(this.storeData['formGroup'].discounts.controls['InvoiceDiscountNarrative']);
            }
            if (this.storeData['formGroup'].ediInvoicing !== false) {
                //edi invoice
                formdata['EDIPartnerAccountCode'] = this.getFieldValue(this.storeData['formGroup'].ediInvoicing.controls['EDIPartnerAccountCode']);
                formdata['EDIPartnerANANumber'] = this.getFieldValue(this.storeData['formGroup'].ediInvoicing.controls['EDIPartnerANANumber']);
            }

            //general
            if (this.storeData['formGroup'].general !== false) {

                formdata['NationalAccount'] = this.getFieldValue(this.storeData['formGroup'].general.controls['NationalAccount'], true);
                formdata['DedicatedContactProcedureInd'] = this.getFieldValue(this.storeData['formGroup'].general.controls['DedicatedContactProcedureInd'], true);
                formdata['InSightAccountInd'] = this.getFieldValue(this.storeData['formGroup'].general.controls['InSightAccountInd'], true);
                formdata['InterGroupAccount'] = this.getFieldValue(this.storeData['formGroup'].general.controls['InterGroupAccount'], true);
                formdata['VATExempt'] = this.getFieldValue(this.storeData['formGroup'].general.controls['VATExempt'], true);
                formdata['ExcludePDADebtInd'] = this.getFieldValue(this.storeData['formGroup'].general.controls['ExcludePDADebtInd'], true);
                formdata['AccountBusinessTypeCode'] = this.getFieldValue(this.storeData['formGroup'].general.controls['AccountBusinessTypeCode']);
                formdata['AccountBusinessTypeDesc'] = this.getFieldValue(this.storeData['formGroup'].general.controls['AccountBusinessTypeDesc']);

                formdata['GroupAccountNumber'] = this.getFieldValue(this.storeData['formGroup'].general.controls['GroupAccountNumber']);
                formdata['GroupName'] = this.getFieldValue(this.storeData['formGroup'].general.controls['GroupName']);
                formdata['PriceListInd'] = this.getFieldValue(this.storeData['formGroup'].general.controls['PriceListInd'], true);
                formdata['LogoTypeCode'] = this.getFieldValue(this.storeData['formGroup'].general.controls['LogoTypeCode']);
                formdata['LogoTypeDesc'] = this.getFieldValue(this.storeData['formGroup'].general.controls['LogoTypeDesc']);
                formdata['ExternalReference'] = this.getFieldValue(this.storeData['formGroup'].general.controls['ExternalReference']);
                formdata['AccountBalance'] = this.globalize.parseCurrencyToFixedFormat(this.getFieldValue(this.storeData['formGroup'].general.controls['AccountBalance']));
                formdata['BadDebtAccount'] = this.getFieldValue(this.storeData['formGroup'].general.controls['BadDebtAccount'], true);
                formdata['BadDebtNarrative'] = this.getFieldValue(this.storeData['formGroup'].general.controls['BadDebtNarrative']);
                formdata['LiveAccount'] = this.getFieldValue(this.storeData['formGroup'].general.controls['LiveAccount'], true);
                formdata['IncludeInMarketingCampaignInd'] = this.getFieldValue(this.storeData['formGroup'].general.controls['IncludeMarketingCampaign'], true);
            }

            //invoice text
            if (this.storeData['formGroup'].invoiceText !== false) {
                formdata['CurrentInvoiceGroups'] = this.getFieldValue(this.storeData['formGroup'].invoiceText.controls['CurrentInvoiceGroups']);
                formdata['InvoiceNarrativeSL'] = this.getFieldValue(this.storeData['formGroup'].invoiceText.controls['InvoiceNarrativeSL'], true);
                formdata['CommonStatement'] = this.getFieldValue(this.storeData['formGroup'].invoiceText.controls['CommonStatement'], true);
                formdata['CreateNewInvoiceGroupInd'] = this.getFieldValue(this.storeData['formGroup'].invoiceText.controls['CreateNewInvoiceGroupInd'], true);
                formdata['OutsortInvoiceDefaultInd'] = this.getFieldValue(this.storeData['formGroup'].invoiceText.controls['OutsortInvoiceDefaultInd'], true);
                formdata['AccountInvoiceText1'] = this.getFieldValue(this.storeData['formGroup'].invoiceText.controls['AccountInvoiceText1']);
                formdata['AccountInvoiceText2'] = this.getFieldValue(this.storeData['formGroup'].invoiceText.controls['AccountInvoiceText2']);
                formdata['AccountInvoiceText3'] = this.getFieldValue(this.storeData['formGroup'].invoiceText.controls['AccountInvoiceText3']);
                formdata['AccountInvoiceText4'] = this.getFieldValue(this.storeData['formGroup'].invoiceText.controls['AccountInvoiceText4']);
                formdata['AccountInvoiceText5'] = this.getFieldValue(this.storeData['formGroup'].invoiceText.controls['AccountInvoiceText5']);
                formdata['AccountInvoiceText6'] = this.getFieldValue(this.storeData['formGroup'].invoiceText.controls['AccountInvoiceText6']);
            }
            //telesales
            if (this.storeData['formGroup'].teleSales !== false) {
                formdata['CrossReferenceAccountNumber'] = this.getFieldValue(this.storeData['formGroup'].teleSales.controls['CrossReferenceAccountNumber']);
                formdata['CrossReferenceAccountName'] = this.getFieldValue(this.storeData['formGroup'].teleSales.controls['CrossReferenceAccountName']);
                formdata['ValidationExemptInd'] = this.getFieldValue(this.storeData['formGroup'].teleSales.controls['ValidationExemptInd'], true);
                formdata['NewInvoiceGroupInd'] = this.getFieldValue(this.storeData['formGroup'].teleSales.controls['NewInvoiceGroupInd'], true);
            }
        }
        catch (e) {
            //console.log(e);
        }
        return formdata;
    }


    public postAccountEntryData(functionName: any, params: any, postdata: any): any {
        this.queryAccount = new URLSearchParams();

        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        } else {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }

        this.queryAccount.set(this.serviceConstants.Action, '0');
        if (this.storeData['data'] && this.storeData['data'].AccountNumber) {
            this.queryAccount.set('AccountNumber', this.storeData['data'].AccountNumber);
        }
        if (this.storeData['data'] && this.storeData['data'].AccountName) {
            this.queryAccount.set('AccountName', this.storeData['data'].AccountName);
        }
        else {
            this.queryAccount.set('AccountName', '');
        }

        if (functionName !== '') {
            this.queryAccount.set(this.serviceConstants.Action, '6');
        }
        for (let key in params) {
            if (key) {
                this.queryAccount.set(key, params[key]);
            }
        }
        return this.httpService.makePostRequest(this.method, this.module, this.operation, this.queryAccount, postdata);
    }



    public recordSelected(arg1?: boolean, arg2?: boolean): Boolean {
        if (this.storeData && this.storeData['data']) {
            return true;
        }
        else {
            return false;
        }
    }


    public onKeyDown(event: any): void {
        event.preventDefault();
        if (event.keyCode === 34) {

            if (event.target.id === 'GroupAccountNumber') {
                if (this.sysCharParams['vSCGroupAccount'] === true) {
                    this.router.navigate(['/application/groupaccountnumbersearch'], { queryParams: { Mode: 'LookUp' } });
                }
            }
            else if (event.target.id === 'AccountNumber') {
                if ((typeof this.accountNumberEllipsis !== 'undefined') && this.accountNumberEllipsis) {
                    this.inputParams.accountNumber = event.target.value;
                    //this.inputParams.parentMode = 'LookUp';
                    this.accountNumberEllipsis.configParams = this.inputParams;
                    this.accountNumberEllipsis.updateComponent();
                    this.accountNumberEllipsis.openModal();
                }
            }

        }
    }

    public onBlur(event: any): void {
        if (event && event.target) {
            let elementValue = event.target.value;
            let _paddedValue = elementValue;
            if (event.target.id === 'AccountNumber') {
                if (elementValue.length > 0) {
                    let num = this.numberFormatValue(elementValue, 9);
                    event.target.value = num;
                    this.accountFormGroup.controls['AccountNumber'].setValue(num);
                    if (!this.addMode && !this.updateMode) {
                        let mode = {
                            updateMode: true,
                            addMode: false,
                            searchMode: false
                        };
                        this.loadSelectedDataRow({}, mode);
                    }
                }
            }
            else if (event.target.id === 'AccountName') {
                if (elementValue && elementValue.trim() === '') {
                    this.accountFormGroup.controls['AccountName'].setValue('');
                }

                this.setCapitalizeFirstLetterValue(event);
                //this.onAccountNameChange();
                // if (this.fieldVisibility.AccountOwningBranch === false) {
                //     this.setFocusToTabElement();
                // }
            }
        }
    };

    public numberFormatValue(elementValue: string, maxLength: number): string {
        let paddedValue: string = elementValue;
        if (elementValue.length < maxLength) {
            paddedValue = this.numberPadding(elementValue, 9);
        }
        return paddedValue;
    }

    public numberPadding(num: any, size: any): string {
        let s = num + '';
        while (s.length < size) s = '0' + s;
        return s;
    }

    public buildMenuOptions(): void {
        this.fieldVisibility.menuControl = true;
        if (this.getParentHTMLInputValue('EmployeeLimitChildDrillOptions') !== 'Y') {

            let optionsList = [
                { title: '', list: [{ value: '', text: 'Options' }] },
                { title: 'Portfolio', list: [] },
                { title: 'History', list: [] },
                { title: 'Invoicing', list: [] },
                { title: 'Service', list: [] },
                { title: 'Customer Relations', list: [] }
            ];

            if (this.sysCharParams['vSCMultiContactInd'] === true) {
                optionsList[1].list.push({ value: 'contacts', text: 'Contact Details' });
            }
            optionsList[1].list.push({ value: 'Invoice Groups', text: 'Invoice Groups' });
            optionsList[1].list.push({ value: 'Premises', text: 'Show Premises' });
            optionsList[1].list.push({ value: 'View Contract', text: 'View Contract/Job' });
            if (this.getParentHTMLInputValue('CurrentCallLogID') === undefined || this.getParentHTMLInputValue('CurrentCallLogID') === '' || this.getParentHTMLInputValue('CurrentCallLogID') === null) {
                optionsList[1].list.push({ value: 'Add Contract', text: 'Add Contract' });
                optionsList[1].list.push({ value: 'Add Job', text: 'Add Job' });
                optionsList[1].list.push({ value: 'Add Product', text: 'Add Product Sales' });
            }
            optionsList[1].list.push({ value: 'Telesales Order', text: 'Telesales Order' });

            optionsList[2].list.push({ value: 'Account History', text: 'Account History' });
            optionsList[2].list.push({ value: 'Account Diary', text: 'Account Diary' });

            optionsList[3].list.push({ value: 'Invoice History', text: 'Invoice History' });

            if (this.sysCharParams['vSCVisitTolerances']) {
                optionsList[4].list.push({ value: 'Visit Tolerances', text: 'Visit Tolerances' });
            }
            if (this.sysCharParams['vSCInfestationTolerances']) {
                optionsList[4].list.push({ value: 'Infestation Tolerances', text: 'Infestation Tolerances' });
            }

            optionsList[5].list.push({ value: 'Contact Management', text: 'Contact Management' });
            optionsList[5].list.push({ value: 'Contact Management Search', text: 'Contact Centre Search' });
            optionsList[5].list.push({ value: 'Customer Information', text: 'Customer Information' });

            this.optionsList = JSON.parse(JSON.stringify(optionsList));
        }
        else {
            this.fieldVisibility.menuControl = false;
        }
    }

    public optionsChange(event: any): void {
        let mode = '';
        switch (this.options.trim()) {
            case 'Contact Management':
                mode = 'Account';
                if (this.recordSelected()) {
                    if (this.otherParams['lREGContactCentreReview']) {
                        //this.router.navigate(['/ccm/contact/search'], { queryParams: { parent: 'contract-maintenance' }});
                    } else {
                        this.router.navigate(['/ccm/centreReview'], { queryParams: { parent: 'Account' } });
                    }
                }
                break;
            case 'Contact Management Search':
                if (this.recordSelected()) {
                    //this.router.navigate(['grid/contractmanagement/maintenance/contract/premise']);
                    this.router.navigate(['ccm/callcentersearch'], {
                        queryParams: {
                            parentMode: 'Account',
                            AccountNumber: this.accountFormGroup.controls['AccountNumber'].value
                        }
                    });
                }
                break;
            case 'contacts':
                if (this.recordSelected()) {
                    this.cmdContactDetails('all');
                }
                break;
            case 'Account History':
                if (this.recordSelected()) {
                    mode = 'Account';
                    this.router.navigate(['application/accounthistorygrid'], {
                        queryParams: {
                            parentMode: 'Account',
                            AccountNumber: this.accountFormGroup.controls['AccountNumber'].value,
                            AccountName: this.accountFormGroup.controls['AccountName'].value
                        }
                    });
                }
                break;
            case 'Account Diary':
                if (this.recordSelected()) {
                    mode = 'Account';
                    //iCABSAAccountDiaryGrid.htm
                }
                break;
            case 'Invoice History':
                mode = 'Account';
                this.router.navigate(['/billtocash/contract/invoice'], {
                    queryParams: {
                        parentMode: 'Account',
                        AccountNumber: this.accountFormGroup.controls['AccountNumber'].value,
                        AccountName: this.accountFormGroup.controls['AccountName'].value
                    }
                });
                break;
            case 'Invoice Groups':
                if (this.recordSelected()) {
                    mode = 'Account';
                    this.router.navigate(['application/invoiceGroupSearch'], {
                        queryParams: {
                            parentMode: 'Account',
                            AccountNumber: this.accountFormGroup.controls['AccountNumber'].value,
                            AccountName: this.accountFormGroup.controls['AccountName'].value
                        }
                    });
                }
                break;
            case 'View Contract':
                if (this.recordSelected()) {
                    mode = 'Account';
                    //Application/iCABSAContractSearch.htm
                    this.ellipsisConfig.contract.childConfigParams['accountNumber'] = this.accountFormGroup.controls['AccountNumber'].value;
                    this.ellipsisConfig.contract.childConfigParams['accountName'] = this.accountFormGroup.controls['AccountName'].value;
                    if (this.contractNumberEllipsis) {
                        this.contractNumberEllipsis.updateComponent();
                        setTimeout(() => {
                            this.contractNumberEllipsis.openModal();
                        }, 10);
                    }
                    // this.router.navigate(['application/contractsearch'], { queryParams: { parent: mode } });

                }
                break;
            case 'Add Contract':
                if (this.recordSelected()) {
                    mode = 'AddContractFromAccount';
                    let paramObj = {
                        parentMode: mode,
                        AccountNumber: this.accountFormGroup.controls['AccountNumber'].value,
                        AccountName: this.accountFormGroup.controls['AccountName'].value,
                        PromptPaymentInd: this.accountData ? this.accountData['PromptPaymentInd'] : '',
                        RetrospectiveInd: this.accountData ? this.accountData['RetrospectiveInd'] : ''
                    };
                    //this.store.dispatch({ type: ContractActionTypes.SAVE_SENT_FROM_PARENT, payload: paramObj });
                    this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], {
                        queryParams: paramObj
                    });
                    //Application/iCABSAContractMaintenance.htm
                }
                break;
            case 'Add Job':
                if (this.recordSelected()) {
                    mode = 'AddJobFromAccount';
                    let paramObj = {
                        parentMode: mode,
                        AccountNumber: this.accountFormGroup.controls['AccountNumber'].value,
                        AccountName: this.accountFormGroup.controls['AccountName'].value,
                        PromptPaymentInd: this.accountData ? this.accountData['PromptPaymentInd'] : '',
                        RetrospectiveInd: this.accountData ? this.accountData['RetrospectiveInd'] : ''

                    };
                    //this.store.dispatch({ type: ContractActionTypes.SAVE_SENT_FROM_PARENT, payload: paramObj });
                    this.router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], { queryParams: paramObj });
                    //Application/iCABSAContractMaintenance.htm
                }
                break;
            case 'Add Product':
                if (this.recordSelected()) {
                    mode = 'AddProductFromAccount';
                    let paramObj = {
                        parentMode: mode,
                        AccountNumber: this.accountFormGroup.controls['AccountNumber'].value,
                        AccountName: this.accountFormGroup.controls['AccountName'].value,
                        PromptPaymentInd: this.accountData ? this.accountData['PromptPaymentInd'] : '',
                        RetrospectiveInd: this.accountData ? this.accountData['RetrospectiveInd'] : ''
                    };
                    //this.store.dispatch({ type: ContractActionTypes.SAVE_SENT_FROM_PARENT, payload: paramObj });
                    this.router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], { queryParams: paramObj });
                    //Application/iCABSAContractMaintenance
                }
                break;
            case 'Customer Information':
                mode = 'Account';
                this.router.navigate(
                    [InternalGridSearchServiceModuleRoutes.ICABSACUSTOMERINFORMATIONSUMMARY.URL_2],
                    {
                        queryParams: {
                            parentMode: 'Account',
                            accountNumber: this.accountFormGroup.controls['AccountNumber'].value,
                            accountName: this.accountFormGroup.controls['AccountName'].value
                        }
                    }
                );
                break;
            case 'Premises':
                mode = 'Account';
                if (this.recordSelected()) {
                    mode = 'Account';
                    this.router.navigate(['application/accountpremise'], { queryParams: { parent: mode, AccountNumber: this.accountFormGroup.controls['AccountNumber'].value } });
                    //iCABSAAccountPremiseSearchGrid.htm
                }
                //Application/iCABSAAccountPremiseSearchGrid.htm<maxwidth>" + CurrentContractTypeURLParameter
                break;
            case 'Visit Tolerances':
                if (this.recordSelected()) {
                    mode = 'AccountVisitTolerance';
                    this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSSVISITTOLERANCEGRID], {
                        queryParams: {
                            parentMode: 'AccountVisitTolerance',
                            currentContractTypeURLParameter: this.inputParams.currentContractTypeURLParameter,
                            AccountNumber: this.accountFormGroup.controls['AccountNumber'].value,
                            AccountName: this.accountFormGroup.controls['AccountName'].value
                        }
                    });
                }
                break;
            case 'Infestation Tolerances':
                if (this.recordSelected()) {
                    mode = 'AccountInfestationTolerance';
                    this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSSINFESTATIONTOLERANCEGRID], {
                        queryParams: {
                            'parentMode': mode,
                            'currentContractTypeURLParameter': this.inputParams.currentContractTypeURLParameter,
                            'AccountNumber': this.accountFormGroup.controls['AccountNumber'].value
                        }
                    });
                    //iCABSSInfestationToleranceGrid.htm
                }
                break;
            case 'Telesales Order':
                if (this.recordSelected()) {
                    mode = 'AccountTeleSalesOrder';
                    this.router.navigate([InternalMaintenanceServiceModuleRoutes.ICABSCMTELESALESENTRY], {
                        queryParams: {
                            'parentMode': 'AccountTeleSalesOrder',
                            'currentContractTypeURLParameter': this.inputParams.currentContractTypeURLParameter,
                            'AccountNumber': this.accountFormGroup.controls['AccountNumber'].value
                        }
                    });
                    break;
                }
                break;
            case 'Show Premises':
                if (this.recordSelected()) {
                    mode = 'Account';
                    this.router.navigate(['application/accountpremise'], { queryParams: { parent: mode, AccountNumber: this.accountFormGroup.controls['AccountNumber'].value } });
                    //iCABSAAccountPremiseSearchGrid.htm
                }
                break;
            default:
                // code...
                break;
        }
    }

    public onAccountBusinessTypeCodeKeydown(event: any): void {
        let mode = 'LookUp-Account';
        // if (event.keyCode === 34) {
        // }
    }

    public cmdContactDetails(cWhich: string): void {
        let mode = '';
        if (cWhich === 'all') {
            mode = 'Account';
        }
        else {
            mode = 'AccountEmergency';
        }
        //window.location = "/wsscripts/riHTMLWrapper.p?riFileName=ContactManagement/iCABSCMContactPersonMaintenance.htm<maxwidth>"
        this.router.navigate([InternalMaintenanceServiceModuleRoutes.ICABSCMCONTACTPERSONMAINTENANCE], { queryParams: { parentMode: mode, accountNumber: this.accountFormGroup.controls['AccountNumber'].value } });
    }


    public getParentHTMLInputValue(param: string): string {
        return this.riExchange.getParentHTMLValue(param);
    }



    public onAccountNameChange(): any {
        if (this.accountFormGroup.controls['AccountName'].value && this.accountFormGroup.controls['AccountName'].value.trim() === '') {
            this.setDefaultEllipsisConfig();
        }

        if (this.addMode === true) {
            let params = {
                'action': '6',
                'SearchName': this.accountFormGroup.controls['AccountName'].value
            };

            this.fetchServiceData('', params).subscribe(
                (e) => {
                    if (e.status === 'failure') {
                        this.errorService.emitError(e.oResponse);
                    } else {
                        let strFoundAccount = e.strFoundAccount;
                        if (strFoundAccount && (strFoundAccount.toLowerCase() === 'yes')) {

                            if ((typeof this.accountNumberEllipsis !== 'undefined') && this.accountNumberEllipsis) {
                                this.accountNumberEllipsis.disabled = false;
                                let obj = this.inputParams;
                                obj['parentMode'] = 'AccountSearch';
                                obj['searchValue'] = this.accountFormGroup.controls['AccountName'].value;
                                obj['showAddNewDisplay'] = false;
                                obj['showCountryCode'] = false;
                                obj['showBusinessCode'] = false;
                                obj['countryCode'] = this.utilService.getCountryCode();
                                obj['businessCode'] = this.utilService.getBusinessCode();
                                if (this.parentMode === 'CallCentreSearch') {
                                    obj['showAddNewDisplay'] = false;
                                    obj['showAddNew'] = false;
                                }
                                this.accountNumberEllipsis.childConfigParams = obj;
                                this.accountNumberEllipsis.updateComponent();
                                setTimeout(() => {
                                    this.accountNumberEllipsis.openModal();
                                    this.accountNumberEllipsis.disabled = true;
                                }, 100);
                            }
                        }
                        else {
                            if (this.accountFormGroup.controls['AccountNumber'].value) {
                                //Call riMaintenance.NormalMode()
                            } else {
                                if (this.sysCharParams['vSCRunPAFSearchOn1stAddressLine'] === true) {
                                    this.storeData['otherParams']['addressLineFocus'] = true;
                                    this.storeData['otherParams']['showPostCode'] = true;
                                    this.onCmdGetAddressClick();
                                }
                            }
                        }
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                }
            );

        }

    }

    public onCmdGetAddressClick(): void {
        if (this.sysCharParams['vSCEnableHopewiserPAF'] === true) {
            event.preventDefault();
            //this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], { queryParams: { parent: 'Account' } });
            //alert('TODO: Model/riMPAFSearch.htm');
            //this.router.navigate(['/contractmanagement/account/maintenance'], { queryParams: { parent: 'Account' } });
            if (this.riPostcodeSearchEllipsis && typeof this.riPostcodeSearchEllipsis !== 'undefined') {
                this.ellipsisConfig.riPostcodeSearch.childConfigParams.parentMode = 'Account';
                this.riPostcodeSearchEllipsis.contentComponent = ScreenNotReadyComponent;
                this.riPostcodeSearchEllipsis.updateComponent();
                setTimeout(() => {
                    this.riPostcodeSearchEllipsis.openModal();
                }, 100);
            }
        }
        else if (this.sysCharParams['vSCEnableDatabasePAF'] === true) {
            //Business/iCABSBPostcodeSearch.htm
            //this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], { queryParams: { parent: 'Account' } });
            //TODO:

            let obj = document.getElementById('AccountPostcode');
            let obj2 = document.getElementById('AccountAddressLine1');
            let focus = new CustomEvent('focus', { bubbles: false });
            if (obj) {
                this.renderer.invokeElementMethod(obj, 'focus', [focus]);
                setTimeout(() => {
                    this.renderer.invokeElementMethod(obj, 'blur', [focus]);
                }, 0);
            }
            if (obj2) {
                setTimeout(() => {
                    this.renderer.invokeElementMethod(obj2, 'focus', [focus]);
                }, 10);
            }
        }
    }

    public onCmdCustomerInformationClick(): void {
        event.preventDefault();
        //Mode = "Account"
        //this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], { queryParams: { parent: 'Account' } });
        //alert('application/iCABSACustomerInformationSummary.htm');
        //this.router.navigate(['/contractmanagement/account/maintenance'], { queryParams: { parent: 'Account' } });
        this.router.navigate(
            [InternalGridSearchServiceModuleRoutes.ICABSACUSTOMERINFORMATIONSUMMARY.URL_2],
            {
                queryParams: {
                    parentMode: 'Account',
                    accountNumber: this.accountFormGroup.controls['AccountNumber'].value,
                    accountName: this.accountFormGroup.controls['AccountName'].value
                }
            }
        );
    }


    public UpdateHTMLDocument(): void {

        if (this.addMode) {

            let postObj = {
                'AccountNumber': this.accountFormGroup.controls['AccountNumber'].value
            };
            this.postAccountEntryData('GetContactPersonChanges', {}, postObj).subscribe(
                (e) => {
                    if (e.status === 'failure') {
                        this.errorService.emitError(e.oResponse);
                    } else {
                        let contactPersonFound = e.ContactPersonFound;
                        if (contactPersonFound.toLowerCase() === 'y') {
                            this.storeData['formGroup'].address.ontrols['AccountContactName'].value = e.ContactPersonName;
                            this.storeData['formGroup'].address.controls['AccountContactPosition'].value = e.ContactPersonPosition;
                            this.storeData['formGroup'].address.controls['AccountContactDepartment'].value = e.ContactPersonDepartment;
                            this.storeData['formGroup'].address.controls['AccountContactTelephone'].value = e.ContactPersonTelephone;
                            this.storeData['formGroup'].address.controls['AccountContactMobile'].value = e.ContactPersonMobile;
                            this.storeData['formGroup'].address.controls['AccountContactEmail'].value = e.ContactPersonEmail;
                            this.storeData['formGroup'].address.controls['AccountContactFax'].value = e.ContactPersonFax;
                        }
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                }
            );

        }

    }


    public riMaintenance_BeforeAdd(): any {

        //'PKT - 22/05/2003 - Always Default InvoiceNarrativeSL to true.
        this.setformGroupControlValue('InvoiceNarrativeSL', true);
        this.setformGroupControlValue('LiveAccount', true);
        this.disableFormGroupControl('cmdAddOwner', true);

        if (this.sysCharParams['vSCCommonStatement'] === true) {
            this.setformGroupControlValue('CommonStatement', true);
        } else {
            this.setformGroupControlValue('CommonStatement', false);
        }

        this.enableFormGroupControl('AccountOwningBranch');
        this.dropdown.AccountOwningBranch.disabled = false;

        //'MSA - 06/03/2007 - Set default country code
        this.enableFormGroupControl('CountryCode');
        let tempCountryCode = (this.sysCharParams['vDefaultCountryCode']) ? this.sysCharParams['vDefaultCountryCode'] : '';
        this.setformGroupControlValue('CountryCode', tempCountryCode);

        //'MSA - 20/07/2004 - Tick 'National Account' if Branch is Nat Acc Branch.

        let postObj = {
            'Function': 'IsNationalAccountBranch',
            'BranchNumber': this.utilService.getBranchCode()
        };
        this.postAccountEntryData('IsNationalAccountBranch', {}, postObj).subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    let nationalAccount = e['NationalAccount'];
                    if (e['NationalAccount'] && (nationalAccount.toLowerCase() === 'yes' || nationalAccount.toLowerCase() === 'true' || nationalAccount.toLowerCase() === 'y' || nationalAccount === true)) {
                        this.setformGroupControlValue('NationalAccount', true);
                        this.setformGroupControlValue('ExcludePDADebtInd', true);
                    } else {
                        this.setformGroupControlValue('NationalAccount', false);
                        this.setformGroupControlValue('ExcludePDADebtInd', false);
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );


        this.showHideFields();

        if (this.sysCharParams['vSCSendOneOffAccntToNAV'] === true) {
            this.disableFormGroupControl('BtnSendToNAV', true);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusNOTSENT', true);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusOK', false);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusFAIL', false);
        }


        if (this.sysCharParams['vSCEnableBankDetailEntry'] === true) {
            this.enableFormGroupControl('BankAccountSortCode');
            this.enableFormGroupControl('BankAccountNumber');
        } else {
            this.disableFormGroupControl('BankAccountSortCode');
            this.disableFormGroupControl('BankAccountNumber');
        }

    }

    public riMaintenance_AfterSave(): any {

        if (this.sysCharParams['vSCMultiContactInd'] === true) {
            this.setVisibleField(this.tabName.address, 'spanAmendContact', true);
            this.setVisibleField(this.tabName.address, 'spanEmergencyContact', true);
        }

        if (this.sysCharParams['vSCEnableSEPAFinanceMandate'] || this.sysCharParams['vSCEnableSEPAFinanceMandateLog']) {
            this.disableFormGroupControl('selMandateTypeCode', true);
        }

    }

    public riMaintenance_BeforeUpdate(): any {
        this.disableFormGroupControl('cmdAddOwner', false);

        this.showHideFields();
        this.disableFormGroupControl('AccountOwningBranch');
        this.dropdown.AccountOwningBranch.disabled = true;

        if (this.sysCharParams['vSCMultiContactInd'] === true) {

            this.setVisibleField(this.tabName.address, 'spanAmendContact', true);
            this.setVisibleField(this.tabName.address, 'spanEmergencyContact', true);
            this.sensitiseContactDetails(false);
        }

        this.disableFormGroupControl('BankAccountTypeCode');
        this.disableFormGroupControl('BankAccountTypeDesc');
        this.disableFormGroupControl('BankAccountSortCode');
        this.disableFormGroupControl('BankAccountNumber');
        this.disableFormGroupControl('VirtualBankAccountNumber');
        this.disableFormGroupControl('BankAccountInfo');


        if (this.sysCharParams['vSCSendOneOffAccntToNAV'] === true) {
            this.disableFormGroupControl('BtnSendToNAV', true);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusNOTSENT', true);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusOK', false);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusFAIL', false);
        }


        if (this.sysCharParams['vSCEnableSEPAFinanceMandate'] || this.sysCharParams['vSCEnableSEPAFinanceMandateLog']) {
            this.disableFormGroupControl('selMandateTypeCode', false);
        }

    }

    public showHideFields(): any {
        if (this.getformGroupControlValue('BadDebtAccount') === true) {
            this.setRequiredStatus('BadDebtNarrative', true);
        } else {
            this.setRequiredStatus('BadDebtNarrative', false);
        }

        if (this.sysCharParams['vSCMandatoryAccOCLevel'] === 0 || this.sysCharParams['vSCMandatoryAccOCLevel'] === 2) {
            this.setRequiredStatus('AccountOwner', false);
            this.isError('AccountOwner');
        } else {
            this.setRequiredStatus('AccountOwner', true);
        }

        if (this.sysCharParams['vSCMandatoryAccOCLevel'] === 0 || this.sysCharParams['vSCMandatoryAccOCLevel'] === 1) {
            this.setRequiredStatus('CategoryCode', false);
            this.isError('CategoryCode');
        } else {
            this.setRequiredStatus('CategoryCode', true);
        }
    }

    public riMaintenance_BeforeSave(): Observable<any> {
        let obs: Observable<any>;
        let obs2: Observable<any>;
        let retObj: ReplaySubject<any> = new ReplaySubject(1);
        let flag = true;
        let status = true;
        let counter = 0;

        this.sysCharParams = this.storeData['processedSysChar'];

        obs = new Observable(observer => {
            if (this.sysCharParams['vSCSendOneOffAccntToNAV'] === true) {
                this.storeData['formGroup'].address.controls['BtnSendToNAV'].enable();
                this.storeData['fieldVisibility'].address.tdSentToNAVStatusNOTSENT = true;
                this.storeData['fieldVisibility'].address.tdSentToNAVStatusOK = false;
                this.storeData['fieldVisibility'].address.tdSentToNAVStatusFAIL = false;
            }
            this.accountFormGroup.controls['MandateTypeCode'].setValue(this.getFieldValue(this.storeData['formGroup'].bankDetails.controls['selMandateTypeCode']));

            observer.next(true);
        });

        obs2 = new Observable(observer => {

            if (this.sysCharParams['vbEnableValidatePostcodeSuburb'] === true) {
                let vPost: Subscription = this.validatePostcodeSuburb().subscribe((data) => {
                    if (data === true) {
                        this.riTab.tabFocusTo(0);
                        this.messageModal.show({ msg: MessageConstant.PageSpecificMessage.The_suburb_state_and_postcode_do_not_match, title: 'Message' }, false);
                        let count = 0;
                        this.messageModal.modalClose.subscribe((event) => {
                            if (count === 0) {
                                count++;
                                this.storeData['otherParams']['showPostCode'] = true;
                                this.onCmdGetAddressClick();
                                this.applyFocusToControlById('AccountAddressLine4');
                                this.SetErrorStatus('AccountAddressLine4', true);
                                this.applyFocusToControlById('AccountAddressLine5');
                                this.SetErrorStatus('AccountAddressLine5', true);
                                this.applyFocusToControlById('AccountPostcode');
                                this.SetErrorStatus('AccountPostcode', true);
                                this.storeData['otherParams'].CancelEvent = true;
                                observer.next(false);
                            }
                        });
                    }
                    else if (data === false) {
                        observer.next(true);
                    }
                    else {
                        let sub1: Subscription = obs.subscribe((e) => {
                            observer.next(e);
                        });
                        this.subscriptionManager.add(sub1);
                    }
                });

                this.subscriptionManager.add(vPost);
            }
            else {
                observer.next(true);
            }

        });

        if (this.sysCharParams['vSCEnableAccountAddressMessage'] === true) {
            if (this.updateMode) {
                status = false;
                this.messageModal.show({ msg: MessageConstant.PageSpecificMessage.Changes_made_to_Account_Address_Information_will_not_affect_invoicing, title: 'Message' }, false);
                this.messageModal.modalClose.subscribe((event) => {
                    if (counter === 0) {
                        counter++;
                        let save1: Subscription = this.beforeSaveModalConfirm().subscribe((e) => {
                            if (e === true) {
                                let sub2: Subscription = obs2.subscribe((e1) => {
                                    if (e1 === true) {
                                        let sub3: Subscription = obs.subscribe((e3) => {
                                            retObj.next(e3);
                                        });

                                        this.subscriptionManager.add(sub3);
                                    }
                                    else {
                                        retObj.next(e1);
                                    }
                                });
                                this.subscriptionManager.add(sub2);
                            }
                            else {
                                retObj.next(e);
                            }
                        });

                        this.subscriptionManager.add(save1);
                    }
                });
            }
        }

        if (status === true) {
            let save2: Subscription = this.beforeSaveModalConfirm().subscribe((e) => {
                if (e === true) {
                    let sub3: Subscription = obs2.subscribe((e1) => {
                        if (e1 === true) {
                            let sub4: Subscription = obs.subscribe((e3) => {
                                retObj.next(e3);
                            });
                            this.subscriptionManager.add(sub4);
                        }
                        else {
                            retObj.next(e1);
                        }
                    });
                    this.subscriptionManager.add(sub3);
                }
                else {
                    retObj.next(e);
                }
            });
            this.subscriptionManager.add(save2);
        }
        return retObj;
    }


    public beforeSaveModalConfirm(): Observable<any> {
        let retObj: ReplaySubject<any> = new ReplaySubject(1);

        if (this.storeData['sentFromParent']) {
            this.accountFormGroup.controls['CallLogID'].setValue(this.storeData['sentFromParent'].CurrentCallLogID);
        }
        if (this.sysCharParams['vSCPostCodeMustExistInPAF'] === true && (this.sysCharParams['vSCEnableHopewiserPAF'] === true || this.sysCharParams['vSCEnableDatabasePAF'] === true)) {

            this.ajaxSource.next(this.ajaxconstant.START);
            this.fetchAccountData('CheckPostcode', {
                action: '6',
                AccountName: this.accountFormGroup.controls['AccountName'].value ? this.accountFormGroup.controls['AccountName'].value : '',
                AccountAddressLine1: this.getFieldValue(this.storeData['formGroup'].address.controls['AccountAddressLine1']),
                AccountAddressLine2: this.getFieldValue(this.storeData['formGroup'].address.controls['AccountAddressLine2']),
                AccountAddressLine3: this.getFieldValue(this.storeData['formGroup'].address.controls['AccountAddressLine3']),
                AccountAddressLine4: this.getFieldValue(this.storeData['formGroup'].address.controls['AccountAddressLine4']),
                AccountAddressLine5: this.getFieldValue(this.storeData['formGroup'].address.controls['AccountAddressLine5']),
                AccountPostcode: this.getFieldValue(this.storeData['formGroup'].address.controls['AccountPostcode'])
            }).subscribe(
                (e) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    let errorMessage = '';
                    if (e['status'] === 'failure') {
                        this.errorService.emitError(e['oResponse']);
                        retObj.next(false);
                    }
                    else if (e['errorMessage']) {
                        this.errorService.emitError(e['errorMessage']);
                        retObj.next(false);
                    }
                    else {
                        if (e['ErrorMessageDesc']) {
                            this.messageModal.show({ msg: e['ErrorMessageDesc'], title: 'Message' }, false);
                            retObj.next(false);
                        }
                        else {
                            retObj.next(true);
                        }
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.errorService.emitError(error);
                    retObj.next(false);
                });
        }
        else {
            retObj.next(true);
        }

        return retObj;
    }

    public validatePostcodeSuburb(): Observable<any> {
        let retObj: ReplaySubject<any> = new ReplaySubject(1);

        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchAccountData('', {
            action: '0',
            ValidatePostcodeSuburb: 'ValPost',
            AccountAddressLine4: this.getFieldValue(this.storeData['formGroup'].address.controls['AccountAddressLine4']),
            AccountAddressLine5: this.getFieldValue(this.storeData['formGroup'].address.controls['AccountAddressLine5']),
            AccountPostcode: this.getFieldValue(this.storeData['formGroup'].address.controls['AccountPostcode']),
            PostcodeSuburbLog: this.getFieldValue(this.storeData['formGroup'].address.controls['PostcodeSuburbLog'])

        }).subscribe((d) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (d['status'] === 'failure') {
                this.errorService.emitError(d['oResponse']);
                retObj.next(false);
            }
            else if (d['errorMessage']) {
                this.errorService.emitError(d['errorMessage']);
                retObj.next(false);
            }
            else {
                if (d && d['PostcodeSuburbError']) {
                    let err = d['PostcodeSuburbError'];
                    if ((err === 'true') || (err === true)) {
                        //let message = 'The suburb, state and postcode do not match';
                        //let errorMessage = (this.translatedMessageList.message_1 === '') ? this.translatedMessageList.message_1 : message;
                        retObj.next(true);
                    }
                }
                else {
                    retObj.next(null);
                }
            }
        },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError(error);
                retObj.next(false);
            });

        return retObj;
    }



    public getFieldValue(controlObj: any, isCheckBox?: boolean): any {
        if (isCheckBox === true) {
            return (controlObj && controlObj.value) ? ((controlObj.value === true) ? 'Yes' : 'no') : 'no';
        }
        return (controlObj && (controlObj.value !== undefined) && (controlObj.value !== null)) ? controlObj.value : '';
    }

    public setFieldValue(val: any, isCheckBox?: boolean): any {
        if (isCheckBox === true) {
            return (val) ? ((val.toString().toLowerCase().trim() === 'yes') ? true : false) : false;
        }
        return ((val !== undefined) && (val !== null)) ? val.trim() : '';
    }


    public onAdd(): void {
        this.cbbService.disableComponent(true);
        this.lastActivatedTabIndex = 0;
        this.parentMode = '';
        this.saveBtn = true;
        //this.routeAwayGlobals.setSaveEnabledFlag(true);
        this.isSaveDisabled = false;
        this.showControlBtn = true;
        this.getSpeedScriptData('ADD');
        this.processForm();
    }

    public loadDataForAddMode(): any {
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_MODE, payload:
            {
                updateMode: false,
                addMode: true,
                searchMode: false
            }
        });
        this.initializeForm();
        this.lastActivatedTabIndex = 0;
        this.setLastActivatedTab();
        this.riMaintenance_BeforeMode();
        this.store.dispatch({ type: AccountMaintenanceActionTypes.BEFORE_MODE, payload: {} });

        this.accountFormGroup.controls['AccountNumber'].setValue('');
        this.accountFormGroup.controls['AccountNumber'].disable();
        this.fieldRequired.isAccountNumberRequired = true;
        this.accountFormGroup.updateValueAndValidity();
        this.formControlAccountNumber.nativeElement.focus();
        this.fieldVisibility.tdCustomerInfo = false;
        this.accountFormGroup.controls['AccountOwningBranch'].enable();
        this.dropdown.AccountOwningBranch.disabled = false;
        this.accountFormGroup.updateValueAndValidity();
        this.riMaintenance_BeforeAdd();
        this.riMaintenance_BeforeAddMode();

        if ((typeof this.formControlAccountName !== 'undefined') && this.formControlAccountName) {
            setTimeout(() => {
                this.formControlAccountName.nativeElement.focus();
                this.storeData['formGroup'].address.controls['AccountAddressLine1'].reset();
            }, 100);
        }
        this.lastActivatedTabIndex = 0;


        setTimeout(() => {
            let elemList = document.querySelectorAll('.tab-container .nav-tabs li a');
            for (let l = 0; l < elemList.length; l++) {
                if (elemList[l]) {
                    this.renderer.listen(elemList[l], 'focus', (event) => {
                        this.setFocusToTabElement();
                    });
                }
            }
        }, 100);
    }

    public onSubmit(formdata: any, valid: any, event: any): void {
        this.accountFormGroup.controls['PageError'].setValue('');
        //this.routeAwayGlobals.setSaveEnabledFlag(false);
        event.preventDefault();
        for (let j in this.fieldVisibility) {
            if (j) {
                let key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.accountFormGroup.controls[key]) {
                        this.accountFormGroup.controls[key].clearValidators();
                    }
                }
            }
        }

        for (let i in this.accountFormGroup.controls) {
            if (this.accountFormGroup.controls[i]) {
                this.accountFormGroup.controls[i].markAsTouched();
            }
        }


        this.store.dispatch({
            type: AccountMaintenanceActionTypes.VALIDATE_FORMS, payload: {
                main: true,
                address: true,
                accountManagement: true,
                general: true,
                bankDetails: true,
                ediInvoicing: true,
                invoiceText: true,
                teleSales: true,
                discounts: true
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_VALIDITY, payload: {
                main: this.accountFormGroup.valid
            }
        });

        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SUBMIT_FORM_VALIDITY, payload: {}
        });
        this.showErrorTab();
        this.setDefaultEllipsisConfig();
        this.accountFormGroup.controls['ClosedWithChanges'].setValue('Y');
        this.riExchange.setParentHTMLValue('ClosedWithChanges', 'Y');
        this.riExchange.setParentHTMLValue('WindowClosingName', 'AmendmentsMade');
    }


    public onUpdate(): void {
        this.saveBtn = true;
        //this.routeAwayGlobals.setSaveEnabledFlag(true);


        this.updateMode = true;
        this.addMode = false;
        this.searchMode = false;
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_MODE, payload:
            {
                updateMode: this.updateMode,
                addMode: this.addMode,
                searchMode: this.searchMode
            }
        });

        if (this.storeData && this.storeData['data']) {
            this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_DATA, payload: this.storeData['data'] });
        }

        this.riMaintenance_BeforeMode();
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.BEFORE_MODE, payload: {}
        });
        this.beforeUpdate();


    }
    public onFetch(): void {

        this.updateMode = true;
        this.addMode = false;
        this.searchMode = false;
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_MODE, payload:
            {
                updateMode: this.updateMode,
                addMode: this.addMode,
                searchMode: this.searchMode
            }
        });

        this.fetchAccountData('', {}).subscribe(
            (e) => {
                if (e.status === 'failure') {
                    showLookUp();
                } else {
                    if (e && e.AccountNumber) {
                        this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_DATA, payload: e });
                        let dataset = { data: e };
                        this.getVirtualTableData(dataset);
                    }
                    else {
                        showLookUp();
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );

        function showLookUp(): any {
            if ((typeof this.accountNumberEllipsis !== 'undefined') && this.accountNumberEllipsis) {
                this.inputParams.accountNumber = this.accountFormGroup.controls['AccountNumber'].value;
                this.accountNumberEllipsis.configParams = this.inputParams;
                this.accountNumberEllipsis.updateComponent();
                this.accountNumberEllipsis.openModal();
                return;
            }
        }


        // this.afterFetch();
        // this.store.dispatch({ type: AccountMaintenanceActionTypes.AFTER_FETCH, payload: {} });
        this.riMaintenance_AfterFetch();
    }

    public onSelect(): void {
        this.isAccountNumberEllipsisDisabled = false;
        this.autoOpenSearch = true;

        this.updateMode = false;
        this.addMode = false;
        this.searchMode = true;
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_MODE, payload:
            {
                updateMode: this.updateMode,
                addMode: this.addMode,
                searchMode: this.searchMode
            }
        });

        if (this.accountFormGroup.controls['AccountNumber'].value) {
            //this.updateBtn = false;
        }
    }

    public onCancel(): void {
        event.preventDefault();
        this.autoOpenSearch = false;
        this.isAccountNumberEllipsisDisabled = false;
        this.updateBtn = true;
        this.searchBtn = true;
        this.fetchBtn = false;
        this.saveBtn = false;
        //this.routeAwayGlobals.setSaveEnabledFlag(false);

        if (this.addMode) {
            this.accountFormGroup.reset();

            for (let key in this.accountFormGroup.controls) {
                if (this.accountFormGroup.controls[key]) {
                    this.accountFormGroup.controls[key].disable();
                }
            }

            if (this.storeData['formGroup'].address !== false) {
                let cmdGetAddress = this.storeData['formGroup'].address.controls['cmdGetAddress'].value;
                let btnAmendContact = this.storeData['formGroup'].address.controls['BtnAmendContact'].value;
                let btnSendToNAV = this.storeData['formGroup'].address.controls['BtnSendToNAV'].value;

                this.storeData['formGroup'].address.reset();
                this.storeData['formGroup'].address.controls['cmdGetAddress'].setValue(cmdGetAddress);
                this.storeData['formGroup'].address.controls['BtnAmendContact'].setValue(btnAmendContact);
                this.storeData['formGroup'].address.controls['BtnSendToNAV'].setValue(btnSendToNAV);
                for (let key in this.storeData['formGroup'].address.controls) {
                    if (this.storeData['formGroup'].address.controls[key]) {
                        this.storeData['formGroup'].address.controls[key].disable();
                    }
                }
            }

            if (this.storeData['formGroup'].accountManagement !== false) {
                let cmdAddOwner = this.storeData['formGroup'].accountManagement.controls['cmdAddOwner'].value;
                this.storeData['formGroup'].accountManagement.reset();
                this.storeData['formGroup'].accountManagement.controls['cmdAddOwner'].setValue(cmdAddOwner);
                for (let key in this.storeData['formGroup'].accountManagement.controls) {
                    if (this.storeData['formGroup'].accountManagement.controls[key]) {
                        this.storeData['formGroup'].accountManagement.controls[key].disable();
                    }
                }
            }

            if (this.storeData['formGroup'].general !== false) {
                this.storeData['formGroup'].general.reset();
                for (let key in this.storeData['formGroup'].general.controls) {
                    if (this.storeData['formGroup'].general.controls[key]) {
                        this.storeData['formGroup'].general.controls[key].disable();
                    }
                }
            }
            if (this.storeData['formGroup'].bankDetails !== false) {
                let cmdGenerateNew = this.storeData['formGroup'].bankDetails.controls['cmdGenerateNew'].value;
                this.storeData['formGroup'].bankDetails.reset();
                this.storeData['formGroup'].bankDetails.controls['cmdGenerateNew'].setValue(cmdGenerateNew);
                for (let key in this.storeData['formGroup'].bankDetails.controls) {
                    if (this.storeData['formGroup'].bankDetails.controls[key]) {
                        this.storeData['formGroup'].bankDetails.controls[key].disable();
                    }
                }
            }

            if (this.storeData['formGroup'].ediInvoicing !== false) {
                let cmdSetInvoiceGroupEDI = this.storeData['formGroup'].ediInvoicing.controls['cmdSetInvoiceGroupEDI'].value;
                this.storeData['formGroup'].ediInvoicing.reset();
                this.storeData['formGroup'].ediInvoicing.controls['cmdSetInvoiceGroupEDI'].setValue(cmdSetInvoiceGroupEDI);
                for (let key in this.storeData['formGroup'].ediInvoicing.controls) {
                    if (this.storeData['formGroup'].ediInvoicing.controls[key]) {
                        this.storeData['formGroup'].ediInvoicing.controls[key].disable();
                    }
                }
            }

            if (this.storeData['formGroup'].invoiceText !== false) {
                let cmdSetInvoiceGroupDefault = this.storeData['formGroup'].invoiceText.controls['cmdSetInvoiceGroupDefault'].value;
                this.storeData['formGroup'].invoiceText.reset();
                this.storeData['formGroup'].invoiceText.controls['cmdSetInvoiceGroupDefault'].setValue(cmdSetInvoiceGroupDefault);
                for (let key in this.storeData['formGroup'].invoiceText.controls) {
                    if (this.storeData['formGroup'].invoiceText.controls[key]) {
                        this.storeData['formGroup'].invoiceText.controls[key].disable();
                    }
                }
            }

            if (this.storeData['formGroup'].teleSales !== false) {
                this.storeData['formGroup'].teleSales.reset();
                for (let key in this.storeData['formGroup'].teleSales.controls) {
                    if (this.storeData['formGroup'].teleSales.controls[key]) {
                        this.storeData['formGroup'].teleSales.controls[key].disable();
                    }
                }
            }

            if (this.storeData['formGroup'].discounts !== false) {
                this.storeData['formGroup'].discounts.reset();
                for (let key in this.storeData['formGroup'].discounts.controls) {
                    if (this.storeData['formGroup'].discounts.controls[key]) {
                        this.storeData['formGroup'].discounts.controls[key].disable();
                    }
                }
            }

            this.searchMode = true;
            this.updateMode = false;
            this.addMode = false;

            this.store.dispatch({
                type: AccountMaintenanceActionTypes.SAVE_MODE, payload:
                {
                    updateMode: this.updateMode,
                    addMode: this.addMode,
                    searchMode: this.searchMode
                }
            });

            this.accountFormGroup.controls['AccountNumber'].disable();
            this.accountFormGroup.controls['AccountNumber'].setValidators(Validators.required);
            this.accountFormGroup.updateValueAndValidity();
            this.setDefaultEllipsisConfig();
            if ((typeof this.accountNumberEllipsis !== 'undefined') && this.accountNumberEllipsis) {
                //this.accountNumberEllipsis.disabled = false;
                //this.inputParams.accountNumber = '';
                //this.inputParams.parentMode = 'LookUp';
                //this.accountNumberEllipsis.configParams = this.inputParams;
                setTimeout(() => {
                    //this.accountNumberEllipsis.updateComponent();
                    this.accountNumberEllipsis.openModal();
                }, 100);
            }
        }
        else if (this.updateMode) {
            this.saveBtn = true;
            this.searchMode = false;
            this.updateMode = true;
            this.addMode = false;
            if (this.updateMode && this.storeData && this.storeData['data']) {
                this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_DATA, payload: this.storeData['data'] });
            }
            this.setDefaultEllipsisConfig();
        }


        this.tabsError = {
            tabA: false,
            tabB: false,
            tabC: false,
            tabD: false,
            tabE: false,
            tabF: false,
            tabG: false,
            tabH: false
        };
        this.processForm();
        this.resetErrorTab();
        this.formPristine();
    }


    public beforeUpdate(): void {
        this.accountFormGroup.controls['AccountOwningBranch'].disable();
        this.dropdown.AccountOwningBranch.disabled = true;
        this.accountFormGroup.updateValueAndValidity();
    }


    public afterSave(): void {
        if (this.sysCharParams['vSCMultiContactInd'] === true) {
            this.storeData['fieldVisibility'].address.spanAmendContact = true;
            this.storeData['fieldVisibility'].address.spanEmergencyContact = true;
        }

        if (this.sysCharParams['vSCEnableSEPAFinanceMandate'] === true || this.sysCharParams['vSCEnableSEPAFinanceMandateLog'] === true) {
            this.storeData['formGroup'].bankDetails.controls['selMandateTypeCode'].disable();
        }
    }


    public afterAbandon(): void {

        this.storeData['formGroup'].address.controls['cmdAddOwner'].disable();
        // this.showHideFields();

        if (this.sysCharParams['vSCMultiContactInd'] === true) {
            this.storeData['formGroup'].address.controls['AccountContactName'].enable();
            this.storeData['formGroup'].address.controls['AccountContactPosition'].enable();
            this.storeData['formGroup'].address.controls['AccountContactDepartment'].enable();
            this.storeData['formGroup'].address.controls['AccountContactMobile'].enable();
            this.storeData['formGroup'].address.controls['AccountContactTelephone'].enable();
            this.storeData['formGroup'].address.controls['AccountContactFax'].enable();
            this.storeData['formGroup'].address.controls['AccountContactEmail'].enable();
        }

        if (this.sysCharParams['SCSendOneOffAccntToNAV'] === true) {
            if (this.accountFormGroup.controls['AccountNumber'].value !== '') {
                this.storeData['formGroup'].address.controls['BtnSendToNAV'].enable();
            }
            else {
                this.storeData['formGroup'].address.controls['BtnSendToNAV'].disable();
            }
            this.storeData['fieldVisibility'].address.tdSentToNAVStatusNOTSENT = true;
            this.storeData['fieldVisibility'].address.tdSentToNAVStatusOK = false;
            this.storeData['fieldVisibility'].address.tdSentToNAVStatusFAIL = false;
        }

        if ((this.sysCharParams['vSCEnableSEPAFinanceMandate'] === true) || (this.sysCharParams['vSCEnableSEPAFinanceMandateLog'] === true)) {
            this.storeData['formGroup'].bankDetails.controls['selMandateTypeCode'].disable();
            this.storeData['formGroup'].bankDetails.controls['selMandateTypeCode'].setValue(this.accountFormGroup.controls['MandateTypeCode'].value);
        }


    }

    public promptSave(event: any): void {
        if (this.updateMode) {
            this.updateAccountData();
        } else if (this.addMode) {
            this.addAccountData();
        }
    }

    public onSelectTab(data: any): void {
        this.lastActivatedTabIndex = data.tabIndex;
        //this.pageParams.lastTabIndex = data.tabIndex;
        let tabsUlList = document.querySelectorAll('ul.nav-tabs li');
        if (tabsUlList) {
            let tabsElemList = document.querySelectorAll('.tab-content .tab-pane');
            for (let i = 0; i < tabsElemList.length; i++) {
                if (i.toString() === data.tabIndex.toString()) {
                    let elementListQuery = '.ui-select-toggle , input:not([disabled]) , select:not([disabled]), textarea:not([disabled])';
                    let tabItemList = tabsElemList[i].querySelectorAll(elementListQuery);
                    for (let l = 0; l < tabItemList.length; l++) {
                        let el = tabItemList[l];
                        if (el) {
                            if ((el.getAttribute('type') === null) || (el.getAttribute('type') && el.getAttribute('type').toLowerCase() !== 'hidden')) {
                                setTimeout(() => {
                                    el['focus']();
                                }, 100);
                                break;
                            }
                        }
                    }
                }

                if (tabsElemList[i].querySelectorAll('input.ng-invalid.ng-touched, textarea.ng-invalid.ng-touched').length > 0) {
                    tabsUlList[i].classList.add('red-bdr');
                }
                else {
                    tabsUlList[i].classList.remove('red-bdr');
                }
            }
        }
        //this.routeAwayUpdateSaveFlag();
        this.store.dispatch({ type: AccountMaintenanceActionTypes.TAB_CHANGE, payload: {} });
    }

    public getElementByTabIndex(tabindex: any): any {
        let elementList = document.querySelector('[tabindex=' + tabindex + ']');
        return elementList;
    }

    public setFocusToTabElement(): any {
        let tabsUlList = document.querySelectorAll('ul.nav-tabs li');
        if (tabsUlList) {
            let tabsElemList = document.querySelectorAll('.tab-content .tab-pane');
            for (let i = 0; i < tabsElemList.length; i++) {
                if (this.utilService.hasClass(tabsElemList[i], 'active')) {
                    let elementListQuery = '.ui-select-toggle , input:not([disabled]) , select:not([disabled]), textarea:not([disabled])';
                    let tabItemList = tabsElemList[i].querySelectorAll(elementListQuery);
                    for (let l = 0; l < tabItemList.length; l++) {
                        let el = tabItemList[l];
                        if (el) {
                            if ((el.getAttribute('type') === null) || (el.getAttribute('type') && el.getAttribute('type').toLowerCase() !== 'hidden')) {
                                setTimeout(() => {
                                    el['focus']();
                                }, 100);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    public resetErrorTab(): void {
        let tabsUlList = document.querySelectorAll('ul.nav-tabs li');
        if (tabsUlList) {
            for (let i = 0; i < tabsUlList.length; i++) {
                tabsUlList[i].classList.remove('red-bdr');
            }
        }
    }

    public showErrorTabs(): void {
        let tabsUlList = document.querySelectorAll('ul.nav-tabs li');
        if (tabsUlList) {
            let tabsElemList = document.querySelectorAll('.tab-content .tab-pane');
            for (let i = 0; i < tabsElemList.length; i++) {
                if (tabsElemList[i].querySelectorAll('input.ng-invalid.ng-touched, textarea.ng-invalid.ng-touched').length > 0) {
                    tabsUlList[i].classList.add('red-bdr');
                }
                else {
                    tabsUlList[i].classList.remove('red-bdr');
                }
            }
        }
    }

    public setLastActivatedTab(): void {
        if (this.riTab) {
            this.lastActivatedTabIndex = this.lastActivatedTabIndex || 0;
            if (this.riTab.tabs && (this.lastActivatedTabIndex < this.riTab.tabs.length)) {
                this.riTab.tabFocusTo(this.lastActivatedTabIndex);
            }
        }
    }

    public setDefaultEllipsisConfig(): any {
        if ((typeof this.accountNumberEllipsis !== 'undefined') && this.accountNumberEllipsis) {
            this.inputParams = {
                'parentMode': 'LookUp-Search',
                'businessCode': this.utilService.getBusinessCode(),
                'countryCode': this.utilService.getCountryCode(),
                'BranchNumber': '',
                'lstBranchSelection': '',
                'AccountNumber': '',
                'searchValue': '',
                'showAddNewDisplay': true
            };
            if (this.savedParentMode === 'CallCentreSearch') {
                this.inputParams.showAddNewDisplay = false;
                this.inputParams['showAddNew'] = false;
            }
            this.accountNumberEllipsis.childConfigParams = this.inputParams;
            this.accountNumberEllipsis.updateComponent();
        }
    }

    public AccountOwningBranchOnChange(obj: any): void {
        if (obj) {
            if (obj.BranchNumber) {
                this.accountFormGroup.controls['AccountOwningBranch'].setValue(obj.BranchNumber);
            }
            if (obj.BranchName) {
                //TODO:
            }
        }
    }

    public initializeForm(): any {

        if (this.sysCharParams['vSCGroupAccount'] && this.storeData['fieldVisibility']['general']) {
            if (this.storeData['fieldVisibility']['general'].hasOwnProperty('vSCGroupAccount')) {
                this.storeData['fieldVisibility']['general']['vSCGroupAccount'] = this.sysCharParams['vSCGroupAccount'];
            }
        }

        if (this.sysCharParams['vSCEnableHopewiserPAF'] === false) {
            this.setVisibleField(this.tabName.address, 'cmdGetAddress', false);
        }
        else {
            this.setVisibleField(this.tabName.address, 'cmdGetAddress', true);
        }

        if (this.sysCharParams['vSCEnableTaxCodeDefaulting']) {
            this.setVisibleField(this.tabName.general, 'trVATExempt', true);
        }
        else {
            this.setVisibleField(this.tabName.general, 'trVATExempt', false);
        }

        if (this.sysCharParams['SCEnablePDADebt'] === true) {
            this.setVisibleField(this.tabName.general, 'trExcludePDADebt', true);
        }
        else {
            this.setVisibleField(this.tabName.general, 'trExcludePDADebt', false);
        }

        this.disableFormGroupControl('BtnSendToNAV', true);

        if (this.sysCharParams['vSCSendOneOffAccntToNAV'] === true) {
            this.setVisibleField(this.tabName.address, 'BtnSendToNAV', true);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusNOTSENT', true);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusOK', false);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusFAIL', false);
        } else {
            this.setVisibleField(this.tabName.address, 'BtnSendToNAV', false);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusNOTSENT', false);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusOK', false);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusFAIL', false);
        }

        this.disableFormGroupControl('cmdGetAddress', true);

        this.disableFormGroupControl('cmdSetInvoiceGroupDefault', true);
        this.disableFormGroupControl('cmdSetInvoiceGroupEDI', true);

        if (!this.sysCharParams['vglAllowUserAuthUpdate']) {
            //riMaintenance.FunctionUpdate  = False
        }

        if (this.otherParams.cEmployeeLimitChildDrillOptions !== 'Y') {
            this.fieldVisibility.menuControl = true;
        }


        if (this.sysCharParams['vSCCapitalFirstLtr'] === true) {
            /* disable the capital */
            this.riMaintenanceAddTableField('AccountName', MntConst.eTypeTextFree, 'Required');
            this.addValidator_CapitalizeFirstLetter('AccountName', false);
        } else {
            this.riMaintenanceAddTableField('AccountName', MntConst.eTypeText, 'Required');
            this.addValidator_CapitalizeFirstLetter('AccountName', true);
        }

        this.riMaintenanceAddTableField('LiveAccount', MntConst.eTypeCheckBox, 'Optional');
        this.riMaintenanceAddTableField('IncludeMarketingCampaign', MntConst.eTypeCheckBox, 'Optional');

        //'MDP 30/11/07
        if (this.sysCharParams['vSCCapitalFirstLtr']) {
            /* disable the capital */
            this.riMaintenanceAddTableField('AccountAddressLine1', MntConst.eTypeTextFree, 'Required');
            this.riMaintenanceAddTableField('AccountAddressLine2', MntConst.eTypeTextFree, 'Optional');

            if (this.sysCharParams['vSCAddressLine3Logical']) {
                this.riMaintenanceAddTableField('AccountAddressLine3', MntConst.eTypeTextFree, 'Required');
            } else {
                this.riMaintenanceAddTableField('AccountAddressLine3', MntConst.eTypeTextFree, 'Optional');
            }

            if (this.sysCharParams['vSCAddressLine4Logical']) {
                this.riMaintenanceAddTableField('AccountAddressLine4', MntConst.eTypeTextFree, 'Required');
            } else {
                if (!this.sysCharParams['vbEnablePostcodeSuburbLog'] && this.sysCharParams['vbEnableValidatePostcodeSuburb']) {
                    this.riMaintenanceAddTableField('AccountAddressLine4', MntConst.eTypeTextFree, 'Optional');
                } else {
                    this.riMaintenanceAddTableField('AccountAddressLine4', MntConst.eTypeTextFree, 'Required');
                }
            }

            if (this.sysCharParams['vSCAddressLine5Logical']) {
                this.riMaintenanceAddTableField('AccountAddressLine5', MntConst.eTypeTextFree, 'Required');
            } else {
                this.riMaintenanceAddTableField('AccountAddressLine5', MntConst.eTypeTextFree, 'Optional');
            }

            this.addValidator_CapitalizeFirstLetter('AccountAddressLine1', false);
            this.addValidator_CapitalizeFirstLetter('AccountAddressLine2', false);
            this.addValidator_CapitalizeFirstLetter('AccountAddressLine3', false);
            this.addValidator_CapitalizeFirstLetter('AccountAddressLine4', false);
            this.addValidator_CapitalizeFirstLetter('AccountAddressLine5', false);

        } else {
            this.riMaintenanceAddTableField('AccountAddressLine1', MntConst.eTypeText, 'Required');
            this.riMaintenanceAddTableField('AccountAddressLine2', MntConst.eTypeText, 'Optional');

            if (this.sysCharParams['vSCAddressLine3Logical']) {
                this.riMaintenanceAddTableField('AccountAddressLine3', MntConst.eTypeText, 'Required');
            } else {
                this.riMaintenanceAddTableField('AccountAddressLine3', MntConst.eTypeText, 'Optional');
            }

            if (this.sysCharParams['vSCAddressLine4Logical']) {
                this.riMaintenanceAddTableField('AccountAddressLine4', MntConst.eTypeText, 'Required');
            } else {
                if (!this.sysCharParams['vbEnablePostcodeSuburbLog'] && this.sysCharParams['vbEnableValidatePostcodeSuburb']) {
                    this.riMaintenanceAddTableField('AccountAddressLine4', MntConst.eTypeText, 'Optional');
                } else {
                    this.riMaintenanceAddTableField('AccountAddressLine4', MntConst.eTypeText, 'Required');
                }
            }

            if (this.sysCharParams['vSCAddressLine5Logical']) {
                this.riMaintenanceAddTableField('AccountAddressLine5', MntConst.eTypeText, 'Required');
            } else {
                this.riMaintenanceAddTableField('AccountAddressLine5', MntConst.eTypeText, 'Optional');
            }

            this.addValidator_CapitalizeFirstLetter('AccountAddressLine1');
            this.addValidator_CapitalizeFirstLetter('AccountAddressLine2');
            this.addValidator_CapitalizeFirstLetter('AccountAddressLine3');
            this.addValidator_CapitalizeFirstLetter('AccountAddressLine4');
            this.addValidator_CapitalizeFirstLetter('AccountAddressLine5');
        }

        if (this.sysCharParams['vSCHidePostcode']) {
            this.riMaintenanceAddTableField('AccountPostcode', MntConst.eTypeCode, 'Optional');
        } else {
            this.riMaintenanceAddTableField('AccountPostcode', MntConst.eTypeCode, 'Required');
        }

        this.riMaintenanceAddTableField('CountryCode', MntConst.eTypeCode, 'Required');

        //'MDP 30/11/07
        if (this.sysCharParams['vSCCapitalFirstLtr']) { /* disable the capital */
            this.riMaintenanceAddTableField('AccountContactName', MntConst.eTypeTextFree, 'Required');
            this.riMaintenanceAddTableField('AccountContactPosition', MntConst.eTypeTextFree, 'Required');

            this.addValidator_CapitalizeFirstLetter('AccountContactName', false);
            this.addValidator_CapitalizeFirstLetter('AccountContactPosition', false);
        }
        else {
            this.riMaintenanceAddTableField('AccountContactName', MntConst.eTypeText, 'Required');
            this.riMaintenanceAddTableField('AccountContactPosition', MntConst.eTypeText, 'Required');

            this.addValidator_CapitalizeFirstLetter('AccountContactName');
            this.addValidator_CapitalizeFirstLetter('AccountContactPosition');
        }

        this.riMaintenanceAddTableField('AccountContactDepartment', MntConst.eTypeText, 'Optional');
        this.riMaintenanceAddTableField('AccountContactTelephone', MntConst.eTypeText, 'Required');
        this.riMaintenanceAddTableField('AccountContactMobile', MntConst.eTypeText, 'Optional');
        this.riMaintenanceAddTableField('AccountContactFax', MntConst.eTypeText, 'Optional');
        this.riMaintenanceAddTableField('AccountContactEmail', MntConst.eTypeTextFree, 'Optional');

        this.riMaintenanceAddTableField('BankAccountSortCode', MntConst.eTypeText, 'Optional');// ' SRS 65
        this.riMaintenanceAddTableField('BankAccountNumber', MntConst.eTypeText, 'Optional');
        this.riMaintenanceAddTableField('VirtualBankAccountNumber', MntConst.eTypeText, 'Optional');
        this.riMaintenanceAddTableField('BankAccountTypeCode', MntConst.eTypeCode, 'Optional');
        this.riMaintenanceAddTableField('BankAccountInfo', MntConst.eTypeText, 'Optional');

        if (this.sysCharParams['vSCEnableSEPAFinanceMandate'] || this.sysCharParams['vSCEnableSEPAFinanceMandateLog']) {
            this.riMaintenanceAddTableField('MandateNumberSEPA', MntConst.eTypeText, 'Optional');
            this.riMaintenanceAddTableField('MandateNumberFinance', MntConst.eTypeText, 'Optional');
            this.riMaintenanceAddTableField('MandateDate', MntConst.eTypeDate, 'Optional');
            this.riMaintenanceAddTableField('MandatMntConst.eTypeCode', MntConst.eTypeCode, 'Optional');
        }

        this.riMaintenanceAddTableField('CurrentInvoiceGroups', MntConst.eTypeInteger, 'ReadOnly');
        //this.riMaintenanceAddTableFieldPostData('CurrentInvoiceGroups', false);

        this.riMaintenanceAddTableField('InvoiceNarrativeSL', MntConst.eTypeCheckBox, 'Optional');
        this.riMaintenanceAddTableField('BadDebtAccount', MntConst.eTypeCheckBox, 'Optional');
        this.riMaintenanceAddTableField('BadDebtNarrative', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenanceAddTableField('NationalAccount', MntConst.eTypeCheckBox, 'Optional');
        this.riMaintenanceAddTableField('DedicatedContactProcedureInd', MntConst.eTypeCheckBox, 'Optional');
        this.riMaintenanceAddTableField('CommonStatement', MntConst.eTypeCheckBox, 'Optional');
        this.riMaintenanceAddTableField('InSightAccountInd', MntConst.eTypeCheckBox, 'Optional');
        this.riMaintenanceAddTableField('CreateNewInvoiceGroupInd', MntConst.eTypeCheckBox, 'Optional');
        this.riMaintenanceAddTableField('InterGroupAccount', MntConst.eTypeCheckBox, 'Optional');
        this.riMaintenanceAddTableField('OutsortInvoiceDefaultInd', MntConst.eTypeCheckBox, 'Optional');

        this.riMaintenanceAddTableField('ExternalReference', MntConst.eTypeText, 'Optional');

        this.riMaintenanceAddTableField('AccountBalance', MntConst.eTypeCurrency, 'ReadOnly');

        this.riMaintenanceAddTableField('AccountInvoiceText1', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenanceAddTableField('AccountInvoiceText2', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenanceAddTableField('AccountInvoiceText3', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenanceAddTableField('AccountInvoiceText4', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenanceAddTableField('AccountInvoiceText5', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenanceAddTableField('AccountInvoiceText6', MntConst.eTypeTextFree, 'Optional');

        this.riMaintenanceAddTableField('TierCode', MntConst.eTypeCode, 'LookUp');

        if (this.sysCharParams['vSCMandatoryAccOCLevel'] === 1 || this.sysCharParams['vSCMandatoryAccOCLevel'] === 3) {
            this.riMaintenanceAddTableField('AccountOwner', MntConst.eTypeCode, 'Requried');
        } else {
            // ' this.riMaintenanceAddTableField('AccountOwner',MntConst.eTypeCode,'LookUp');
            this.riMaintenanceAddTableField('AccountOwner', MntConst.eTypeCode, 'Optional');
        }

        if (this.sysCharParams['vSCMandatoryAccOCLevel'] === 2 || this.sysCharParams['vSCMandatoryAccOCLevel'] === 3) {
            this.riMaintenanceAddTableField('CategoryCode', MntConst.eTypeCode, 'Requried');
        } else {
            //'  this.riMaintenanceAddTableField('CategoryCode',MntConst.eTypeCode,'LookUp');
            this.riMaintenanceAddTableField('CategoryCode', MntConst.eTypeCode, 'Optional');
        }

        this.riMaintenanceAddTableField('AccountBusinessTypeCode', MntConst.eTypeText, 'Optional');


        if (this.sysCharParams['vSCGroupAccount']) {
            this.riMaintenanceAddTableField('GroupAccountNumber', MntConst.eTypeInteger, 'Optional');
            this.riMaintenanceAddTableField('PriceListInd', MntConst.eTypeCheckBox, 'Optional');
        }
        this.riMaintenanceAddTableField('EDIPartnerAccountCode', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenanceAddTableField('EDIPartnerANANumber', MntConst.eTypeTextFree, 'Optional');


        if (this.sysCharParams['vSCAccountDiscounts']) {
            this.riMaintenanceAddTableField('PromptPaymentInd', MntConst.eTypeCheckBox, 'Optional');
            this.riMaintenanceAddTableField('PromptPaymentRate', MntConst.eTypeDecimal2, 'Optional');
            this.riMaintenanceAddTableField('PromptPaymentNarrative', MntConst.eTypeTextFree, 'Optional');
            this.riMaintenanceAddTableField('RetrospectiveInd', MntConst.eTypeCheckBox, 'Optional');
            this.riMaintenanceAddTableField('RetrospectiveRate', MntConst.eTypeDecimal2, 'Optional');
            this.riMaintenanceAddTableField('RetrospectiveNarrative', MntConst.eTypeTextFree, 'Optional');
            this.riMaintenanceAddTableField('InvoiceDiscountInd', MntConst.eTypeCheckBox, 'Optional');
            this.riMaintenanceAddTableField('InvoiceDiscountRate', MntConst.eTypeDecimal2, 'Optional');
            this.riMaintenanceAddTableField('InvoiceDiscountNarrative', MntConst.eTypeTextFree, 'Optional');

        }

        if (this.sysCharParams['vSCEnableTaxCodeDefaulting']) {
            this.riMaintenanceAddTableField('VATExempt', MntConst.eTypeCheckBox, 'Optional');
        }


        if (this.sysCharParams['vEnableAccountLogo']) {
            this.riMaintenanceAddTableField('LogoTypeCode', MntConst.eTypeText, 'Required');
        }
        else {
            this.riMaintenanceAddTableField('LogoTypeCode', MntConst.eTypeTextFree, 'Optional');
        }
        if (this.sysCharParams['vSCSendOneOffAccntToNAVlog']) {
            this.riMaintenanceAddTableField('AccountOwningBranch', MntConst.eTypeInteger, 'Required');
        }

        //' if (my syschar on ){
        this.riMaintenanceAddTableField('ExcludePDADebtInd', MntConst.eTypeCheckBox, 'Optional');


        //' Call Centre Mods
        this.riMaintenanceAddTableField('CallLogID', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenanceAddTableField('CrossReferenceAccountNumber', MntConst.eTypeText, 'Optional');
        this.riMaintenanceAddTableField('ValidationExemptInd', MntConst.eTypeCheckBox, 'Optional');
        this.riMaintenanceAddTableField('NewInvoiceGroupInd', MntConst.eTypeCheckBox, 'Optional');
        this.riMaintenanceAddTableField('GPSCoordinateX', MntConst.eTypeText, 'Optional');
        this.riMaintenanceAddTableField('GPSCoordinateY', MntConst.eTypeText, 'Optional');

        if (this.sysCharParams['vDisableFieldList'] && (this.sysCharParams['vDisableFieldList'].toLowerCase().indexOf('DisableAddressLine3'.toLowerCase()) !== -1)) {
            this.setVisibleField(this.tabName.address, 'AccountAddressLine3', false);
        }
        else {
            this.setVisibleField(this.tabName.address, 'AccountAddressLine3', true);
        }

        if (this.sysCharParams['vSCEnableGPSCoordinates'] === true) {
            this.setVisibleField(this.tabName.address, 'GPSCoordinate', true);
        }
        else {
            this.setVisibleField(this.tabName.address, 'GPSCoordinate', false);
        }

        if (this.sysCharParams['vSCHidePostcode'] === true) {
            this.setVisibleField(this.tabName.address, 'AccountPostcode', false);
        }
        else {
            this.setVisibleField(this.tabName.address, 'AccountPostcode', true);
        }

        if ((this.sysCharParams['vSCEnableSEPAFinanceMandate'] === false) && (this.sysCharParams['vSCEnableSEPAFinanceMandateLog'] === false)) {
            this.setVisibleField(this.tabName.bankDetails, 'MandateDate', false);
            this.setVisibleField(this.tabName.bankDetails, 'SEPADirectDebit', false);
        }
        else {
            this.setVisibleField(this.tabName.bankDetails, 'MandateDate', true);
            this.setVisibleField(this.tabName.bankDetails, 'SEPADirectDebit', true);
            this.disableFormGroupControl('selMandateTypeCode');
        }

        if (this.sysCharParams['vSCEnableSEPAFinanceMandate'] === true) {
            this.setVisibleField(this.tabName.bankDetails, 'SEPAMandateRef', true);
            this.disableFormGroupControl('cmdGenerateNew');
        }
        else {
            this.setVisibleField(this.tabName.bankDetails, 'SEPAMandateRef', false);
        }

        if (this.sysCharParams['vSCEnableSEPAFinanceMandateLog'] === true) {
            this.setVisibleField(this.tabName.bankDetails, 'FinanceMandateRef', true);
        }
        else {
            this.setVisibleField(this.tabName.bankDetails, 'FinanceMandateRef', false);
        }

    }


    public riMaintenance_BeforeMode(): any {

        if (this.addMode) {
            this.setVisibleField(this.tabName.invoiceText, 'CurrentInvoiceGroups', false);
        }
        else {
            this.setVisibleField(this.tabName.invoiceText, 'CurrentInvoiceGroups', true);
        }

        if (this.updateMode) {
            this.disableFormGroupControl('cmdGetAddress', false);
        }

        if (this.updateMode && this.sysCharParams['vSCEnableSEPAFinanceMandate'] === true) {
            this.disableFormGroupControl('cmdGenerateNew', false);
        }
        else {
            this.disableFormGroupControl('cmdGenerateNew', true);
        }

        if (this.searchMode) {
            this.disableFormGroupControl('cmdGetAddress', true);
            if (this.recordSelected(false)) {
                this.disableFormGroupControl('cmdSetInvoiceGroupDefault', false);
                this.disableFormGroupControl('cmdSetInvoiceGroupEDI', false);
            }
            else {
                this.disableFormGroupControl('cmdSetInvoiceGroupDefault', true);
                this.disableFormGroupControl('cmdSetInvoiceGroupEDI', true);
            }
        }
        else {
            this.disableFormGroupControl('cmdSetInvoiceGroupDefault', true);
            this.disableFormGroupControl('cmdSetInvoiceGroupEDI', true);
        }


    }

    public riMaintenance_BeforeAddMode(): any {

        this.disableFormGroupControl('AccountNumber', true);

        if (this.sysCharParams['vSCMultiContactInd'] === true) {
            this.setVisibleField(this.tabName.address, 'spanAmendContact', false);
            this.setVisibleField(this.tabName.address, 'spanEmergencyContact', false);
            this.sensitiseContactDetails(true);
        }

        this.applyFocusToControlById('AccountName');

        this.disableFormGroupControl('cmdGetAddress', false);
        this.disableFormGroupControl('cmdSetInvoiceGroupDefault', true);
        this.disableFormGroupControl('cmdSetInvoiceGroupEDI', true);
        this.setVisibleField(this.tabName.main, 'tdCustomerInfo', false);

        if (this.sysCharParams['vSCEnableSEPAFinanceMandate'] === true || this.sysCharParams['vSCEnableSEPAFinanceMandateLog'] === true) {
            this.disableFormGroupControl('selMandateTypeCode', false);
            this.setformGroupControlValue('selMandateTypeCode', this.sysCharParams['vDefaultMandateType']);
        }

    }


    public riMaintenance_AfterFetch(): any {

        if (this.sysCharParams['vSCMultiContactInd'] === true) {
            this.setVisibleField(this.tabName.address, 'spanAmendContact', true);
            this.setVisibleField(this.tabName.address, 'spanEmergencyContact', true);
        }

        //Call riTab_TabFocusAfter
        if (this.getformGroupControlValue('CustomerInfoAvailable') === true) {
            this.setVisibleField(this.tabName.main, 'tdCustomerInfo', true);
        } else {
            this.setVisibleField(this.tabName.main, 'tdCustomerInfo', false);
        }

        if (this.getformGroupControlValue('BadDebtAccount') === true) {
            this.setVisibleField(this.tabName.main, 'tdBadDebtAccount', true);
        } else {
            this.setVisibleField(this.tabName.main, 'tdBadDebtAccount', false);
        }

        if (this.getformGroupControlValue('PNOL') === true) {
            this.setVisibleField(this.tabName.main, 'tdPNOL', true);
        } else {
            this.setVisibleField(this.tabName.main, 'tdPNOL', false);
        }

        if (this.sysCharParams['vSCSendOneOffAccntToNAV'] === true) {
            this.disableFormGroupControl('BtnSendToNAV', false);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusNOTSENT', true);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusOK', false);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusFAIL', false);
        }

        this.showHideFields(); //' a bug in the model means that this doesn't work


        if (this.sysCharParams['vSCEnableSEPAFinanceMandate'] === true || this.sysCharParams['vSCEnableSEPAFinanceMandateLog'] === true) {
            if (this.getformGroupControlValue('MandateTypeCode')) {
                this.setformGroupControlValue('selMandateTypeCode', this.getformGroupControlValue('MandateTypeCode'));
            } else {
                this.setformGroupControlValue('selMandateTypeCode', '');
            }

            this.disableFormGroupControl('selMandateTypeCode', true);
        }
    }




    public sensitiseContactDetails(lSensitise: any): any {
        if (lSensitise) {

            this.disableFormGroupControl('AccountContactName', false);
            this.disableFormGroupControl('AccountContactPosition', false);
            this.disableFormGroupControl('AccountContactDepartment', false);
            this.disableFormGroupControl('AccountContactMobile', false);
            this.disableFormGroupControl('AccountContactTelephone', false);
            this.disableFormGroupControl('AccountContactFax', false);
            this.disableFormGroupControl('AccountContactEmail', false);

            this.enableFormGroupControl('AccountContactName');
            this.enableFormGroupControl('AccountContactPosition');
            this.enableFormGroupControl('AccountContactDepartment');
            this.enableFormGroupControl('AccountContactMobile');
            this.enableFormGroupControl('AccountContactTelephone');
            this.enableFormGroupControl('AccountContactFax');
            this.enableFormGroupControl('AccountContactEmail');
            this.setRequiredStatus('AccountContactName', true);
            this.setRequiredStatus('AccountContactPosition', true);
            this.setRequiredStatus('AccountContactTelephone', true);
        }
        else {
            this.disableFormGroupControl('AccountContactName', true);
            this.disableFormGroupControl('AccountContactPosition', true);
            this.disableFormGroupControl('AccountContactDepartment', true);
            this.disableFormGroupControl('AccountContactMobile', true);
            this.disableFormGroupControl('AccountContactTelephone', true);
            this.disableFormGroupControl('AccountContactFax', true);
            this.disableFormGroupControl('AccountContactEmail', true);
        }
    }

    public getformGroupControl(controlName: any): any {
        if (this.storeData) {
            for (let tab in this.storeData['formGroup']) {
                if (tab) {
                    if (this.storeData['formGroup'][tab].controls.hasOwnProperty(controlName)) {
                        return { tab: tab, control: this.storeData['formGroup'][tab].controls[controlName] };
                    }
                }
            }
        }
        return null;
    }

    public getformGroupControlValue(controlName: any, tab?: any): any {
        if (this.storeData && this.storeData['formGroup']) {
            if (tab) {
                if (this.storeData['formGroup'][tab] && this.storeData['formGroup'][tab].controls.hasOwnProperty(controlName)) {
                    return this.storeData['formGroup'][tab].controls[controlName].value;
                }
            }
            else {
                for (let t in this.storeData['formGroup']) {
                    if (t) {
                        if (this.storeData['formGroup'][t] && this.storeData['formGroup'][t].controls.hasOwnProperty(controlName)) {
                            return this.storeData['formGroup'][t].controls[controlName].value;
                        }
                    }
                }
            }
        }
        return null;
    }

    public getformGroup(controlName: any): any {
        if (this.storeData) {
            for (let tab in this.storeData['formGroup']) {
                if (tab) {
                    if (this.storeData['formGroup'][tab].controls.hasOwnProperty(controlName)) {
                        return { tab: tab, formGroup: this.storeData['formGroup'][tab] };
                    }
                }
            }
        }
        return null;
    }

    public setformGroupControlValue(controlName: any, val: any, tab?: any): void {
        if (this.storeData && this.storeData['formGroup']) {
            if (tab) {
                if (this.storeData['formGroup'][tab] && this.storeData['formGroup'][tab].controls.hasOwnProperty(controlName)) {
                    this.storeData['formGroup'][tab].controls[controlName].setValue(val);
                }
            }
            else {
                for (let t in this.storeData['formGroup']) {
                    if (t) {
                        if (this.storeData['formGroup'][t] && this.storeData['formGroup'][t].controls.hasOwnProperty(controlName)) {
                            this.storeData['formGroup'][t].controls[controlName].setValue(val);
                            break;
                        }
                    }
                }
            }
        }
    }

    public disableFormGroupControl(controlName: any, isDisable: boolean = true): void {
        if (this.storeData && this.storeData['formGroup']) {
            for (let tab in this.storeData['formGroup']) {
                if (tab) {
                    if (this.storeData['formGroup'][tab] && this.storeData['formGroup'][tab].controls.hasOwnProperty(controlName)) {
                        if (isDisable) {
                            this.storeData['formGroup'][tab].controls[controlName].disable();
                            this.storeData['formGroup'][tab].controls[controlName].updateValueAndValidity();
                        }
                        else {
                            this.storeData['formGroup'][tab].controls[controlName].enable();
                            this.storeData['formGroup'][tab].controls[controlName].updateValueAndValidity();
                        }
                        break;
                    }
                }
            }
        }
    }

    public enableFormGroupControl(controlName: any, isEnable: boolean = true): void {
        if (this.storeData && this.storeData['formGroup']) {
            for (let tab in this.storeData['formGroup']) {
                if (tab) {
                    if (this.storeData['formGroup'][tab] && this.storeData['formGroup'][tab].controls && this.storeData['formGroup'][tab].controls.hasOwnProperty(controlName)) {
                        if (isEnable) {
                            this.storeData['formGroup'][tab].controls[controlName].enable();
                            this.storeData['formGroup'][tab].controls[controlName].updateValueAndValidity();
                        }
                        else {
                            this.storeData['formGroup'][tab].controls[controlName].disable();
                            this.storeData['formGroup'][tab].controls[controlName].updateValueAndValidity();
                        }
                        break;
                    }
                }
            }
        }
    }

    public setRequiredStatus(controlName: any, isEnable: boolean = true): void {

        let controlObj: any = {};
        controlObj = this.getformGroupControl(controlName);
        if (controlObj && controlObj.control) {
            if (isEnable) {
                controlObj.control.setValidators(Validators.required);
                controlObj.control.updateValueAndValidity();
                this.setRequiredField(controlObj.tab, controlName, true);
            }
            else {
                controlObj.control.clearValidators();
                controlObj.control.updateValueAndValidity();
                this.setRequiredField(controlObj.tab, controlName, false);
            }
        }

    }

    public setRequiredField(tab: string, controlName: any, val: any): void {
        if (this.storeData && this.storeData['fieldRequired']) {
            let ctrlName = 'is' + controlName + 'Required';
            if (this.storeData['fieldRequired'][tab]) {
                if (this.storeData['fieldRequired'][tab].hasOwnProperty(ctrlName)) {
                    this.storeData['fieldRequired'][tab][ctrlName] = val;
                }
                else if (this.storeData['fieldRequired'][tab].hasOwnProperty(controlName)) {
                    this.storeData['fieldRequired'][tab][controlName] = val;
                }
            }
        }
    }

    public setVisibleField(tab: string, fieldName: any, val: any): void {
        if (this.storeData && this.storeData['fieldVisibility'] && this.storeData['fieldVisibility'][tab]) {
            if (this.storeData['fieldVisibility'][tab].hasOwnProperty(fieldName)) {
                this.storeData['fieldVisibility'][tab][fieldName] = val;
            }
        }
    }

    public riMaintenanceAddTableField(controlName: any, type: MntConst, option: any): any {
        let controlObj: any = {};

        switch (option) {
            case 'Required':
                controlObj = this.getformGroupControl(controlName);
                if (controlObj) {
                    controlObj.control.setValidators(Validators.required);
                    controlObj.control.updateValueAndValidity();
                    this.setRequiredField(controlObj.tab, controlName, true);
                }
                break;
            case 'Optional':
                controlObj = this.getformGroupControl(controlName);
                if (controlObj) {
                    controlObj.control.clearValidators();
                    controlObj.control.updateValueAndValidity();
                    this.setRequiredField(controlObj.tab, controlName, false);
                }
                break;
            case 'ReadOnly':
                controlObj = this.getformGroupControl(controlName);
                if (controlObj) {
                    controlObj.control.disable();
                    controlObj.control.updateValueAndValidity();
                }
                break;

            default:
        }
    }

    public SetErrorStatus(controlName: any, flag: boolean): void {
        let obj = this.getformGroup(controlName);
        if (obj && obj.formGroup) {
            if (flag) {
                obj.formGroup.controls[controlName].setErrors({ remote: '' });
            }
            else {
                obj.formGroup.controls[controlName].setErrors(null);
            }
        }
    }

    public isError(controlName: any, dataType?: any): any {
        // let controlObj = this.getformGroupControl(controlName);
        // if (controlObj) {
        //     controlObj.control.setErrors({ remote: true });
        // }
    }

    public applyFocusToControlById(controlId: any): void {
        let focus = new CustomEvent('click', { bubbles: true });
        setTimeout(() => {
            try {
                let obj = document.getElementById(controlId);
                if (obj) {
                    this.renderer.invokeElementMethod(obj, 'dispatchEvent', [focus]);
                }
            }
            catch (e) {
                //TODO:
            }
        }, 0);
    }

    public applyFocusToControl(element?: any): void {
        let focus = new CustomEvent('focus', { bubbles: false });
        setTimeout(() => {
            try {
                this.renderer.invokeElementMethod(element, 'focus', [focus]);
            }
            catch (e) {
                //TODO:
            }
        }, 0);
    }

    public onSaveFocus(e: any): void {
        let nextTab: number = 0;
        let code = (e.keyCode ? e.keyCode : e.which);
        let elemList = document.querySelectorAll('.tab-container .nav-tabs li a');
        let currentSelectedIndex = Array.prototype.indexOf.call(elemList, document.querySelector('.tab-container .nav-tabs li a.active'));
        if (code === 9 && currentSelectedIndex < (elemList.length - 1)) {
            let click = new CustomEvent('click', { bubbles: true });
            nextTab = currentSelectedIndex + 1;
            this.riTab.tabFocusTo(nextTab);
            setTimeout(() => {
                document.querySelector('.tab-container .tab-content .tab-pane:nth-child(' + nextTab + ') .ui-select-toggle, .tab-container .tab-content .tab-pane.active input:not([disabled]), .tab-container .tab-content .tab-pane.active select:not([disabled])')['focus']();
            }, 100);
        }
        return;
    }

    public removeSpaceFromValue(dataSet: any): any {
        if (dataSet) {
            try {
                Object.keys(dataSet).forEach((key: any, idx: any) => {
                    if (dataSet[key]) {
                        dataSet[key] = dataSet[key].trim();
                    }
                });
            }
            catch (e) {
                //TODO:
            }
        }
    }

    public addValidator_CapitalizeFirstLetter(controlName: any, addValidator: boolean = true): any {
        let controlObj = this.getformGroupControl(controlName);
        if (controlObj && controlObj.control) {
            if (this.storeData['otherParams'] && this.storeData['otherParams'].capitalizeFirstLetterField) {
                this.storeData['otherParams'].capitalizeFirstLetterField[controlName] = addValidator;
            }
        }
    }

    public setCapitalizeFirstLetterValue(event: any): any {
        if (event && event.target) {
            let elementValue = event.target.value;
            if (elementValue && this.storeData['otherParams'] && this.storeData['otherParams'].capitalizeFirstLetterField && event.target.id && this.storeData['otherParams'].capitalizeFirstLetterField.hasOwnProperty(event.target.id)) {
                event.target.value = elementValue['capitalizeFirstLetter']();
            }
        }
    }


    public formPristine(): void {
        //console.log('-formPristine--', this.storeData['formGroup']);
        if (this.storeData['formGroup']) {
            if (this.storeData['formGroup'].main && this.storeData['formGroup'].main !== false)
                this.storeData['formGroup'].main.markAsPristine();
            if (this.storeData['formGroup'].address && this.storeData['formGroup'].address !== false)
                this.storeData['formGroup'].address.markAsPristine();
            if (this.storeData['formGroup'].accountManagement && this.storeData['formGroup'].accountManagement !== false)
                this.storeData['formGroup'].accountManagement.markAsPristine();
            if (this.storeData['formGroup'].general && this.storeData['formGroup'].general !== false)
                this.storeData['formGroup'].general.markAsPristine();
            if (this.storeData['formGroup'].bankDetails && this.storeData['formGroup'].bankDetails !== false)
                this.storeData['formGroup'].bankDetails.markAsPristine();
            if (this.storeData['formGroup'].ediInvoicing && this.storeData['formGroup'].ediInvoicing !== false)
                this.storeData['formGroup'].ediInvoicing.markAsPristine();
            if (this.storeData['formGroup'].invoiceText && this.storeData['formGroup'].invoiceText !== false)
                this.storeData['formGroup'].invoiceText.markAsPristine();
            if (this.storeData['formGroup'].teleSales && this.storeData['formGroup'].teleSales !== false)
                this.storeData['formGroup'].teleSales.markAsPristine();
            if (this.storeData['formGroup'].discounts && this.storeData['formGroup'].discounts !== false)
                this.storeData['formGroup'].discounts.markAsPristine();
        }
    }
    public checkFormDirty(): boolean {
        //console.log('-checkFormDirty--', this.storeData['formGroup']);
        if (this.storeData['formGroup']) {
            if (this.storeData['formGroup'].main && this.storeData['formGroup'].main !== false && this.storeData['formGroup'].main.dirty)
                return true;
            if (this.storeData['formGroup'].address && this.storeData['formGroup'].address !== false && this.storeData['formGroup'].address.dirty)
                return true;
            if (this.storeData['formGroup'].accountManagement && this.storeData['formGroup'].accountManagement !== false && this.storeData['formGroup'].accountManagement.dirty)
                return true;
            if (this.storeData['formGroup'].general && this.storeData['formGroup'].general !== false && this.storeData['formGroup'].general.dirty)
                return true;
            if (this.storeData['formGroup'].bankDetails && this.storeData['formGroup'].bankDetails !== false && this.storeData['formGroup'].bankDetails.dirty)
                return true;
            if (this.storeData['formGroup'].ediInvoicing && this.storeData['formGroup'].ediInvoicing !== false && this.storeData['formGroup'].ediInvoicing.dirty)
                return true;
            if (this.storeData['formGroup'].invoiceText && this.storeData['formGroup'].invoiceText !== false && this.storeData['formGroup'].invoiceText.dirty)
                return true;
            if (this.storeData['formGroup'].teleSales && this.storeData['formGroup'].teleSales !== false && this.storeData['formGroup'].teleSales.dirty)
                return true;
            if (this.storeData['formGroup'].discounts && this.storeData['formGroup'].discounts !== false && this.storeData['formGroup'].discounts.dirty)
                return true;
        }
        return false;
    }


    // CR implementation
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public canDeactivate(): Observable<boolean> {
        this.routeAwayGlobals.setSaveEnabledFlag(this.checkFormDirty());
        return this.routeAwayComponent.canDeactivate();
    }
    public routeAwayUpdateSaveFlag(): void {
        this.routeAwayGlobals.setDirtyFlag(true);
    }

    //Update Input Values after Contract Ellipses search
    public onContractDataReceived(data: any): void {
        let mode = 'Search';
        this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], { queryParams: { parentMode: mode, ContractNumber: data.ContractNumber, CurrentContractType: data.ContractTypePrefix } });
    }

    public onRiPostcodeSearchDataReceived(data: any): void {
        //TODO:
    }

    public onPostcodeSearchDataReceived(data: any): void {
        if (this.storeData['formGroup'] && this.storeData['formGroup'].address) {
            if (data && data.AccountPostcode) {
                this.storeData['formGroup'].address.controls['AccountPostcode'].setValue(data.AccountPostcode);
                this.ellipsisConfig.postcodeSearch.childConfigParams['AccountPostcode'] = data.AccountPostcode;
            }
            if (data && data.AccountAddressLine4) {
                this.storeData['formGroup'].address.controls['AccountAddressLine4'].setValue(data.AccountAddressLine4);
                this.ellipsisConfig.postcodeSearch.childConfigParams['AccountAddressLine4'] = data.AccountAddressLine4;
            }
            else {
                this.storeData['formGroup'].address.controls['AccountAddressLine4'].setValue('');
                this.ellipsisConfig.postcodeSearch.childConfigParams['AccountAddressLine4'] = '';
            }
            if (data && data.AccountAddressLine5) {
                this.storeData['formGroup'].address.controls['AccountAddressLine5'].setValue(data.AccountAddressLine5);
                this.ellipsisConfig.postcodeSearch.childConfigParams['AccountAddressLine5'] = data.AccountAddressLine5;
            }
            else {
                this.storeData['formGroup'].address.controls['AccountAddressLine5'].setValue('');
                this.ellipsisConfig.postcodeSearch.childConfigParams['AccountAddressLine5'] = '';
            }
        }
    }


}
