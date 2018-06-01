import { InternalMaintenanceSalesModuleRoutes } from './../../base/PageRoutes';
/**
 * Component - iCABSAInvoiceGRoupMaintenance
 * Route - maintenance/invoicegroup/search
 * Menu - BILL TO CASH > PRE INVOICE MANAGEMENT > Invoice Group
 * Functionality - Invoice search and details
 */
import { RouteAwayGlobals } from './../../../shared/services/route-away-global.service';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Renderer } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BillToCashConstants } from '../bill-to-cash-constants';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AddressInvoiceTabComponent } from '../tabs/AddressInvoiceTab.component';
import { AddressStatementTabComponent } from '../tabs/AddressStatementTab.component';
import { GeneralTabComponent } from '../tabs/GeneralTab.component';
import { EDIInvoicingTabComponent } from '../tabs/EDIInvoicing.component';
import { HttpService } from './../../../shared/services/http-service';
import { InvoiceActionTypes } from './../../actions/invoice';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { Utils } from './../../../shared/services/utility';
import { RiExchange } from './../../../shared/services/riExchange';
import { Observable } from 'rxjs/Observable';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { Router } from '@angular/router';
import { MessageService } from './../../../shared/services/message.service';
import { Logger } from '@nsalaun/ng2-logger';
import { ActivatedRoute } from '@angular/router';
import { ContactActionTypes } from './../../actions/contact';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { TabsComponent } from './../../../shared/components/tabs/tabs';
import { InvoiceGroupGridComponent } from './../../internal/grid-search/iCABSAInvoiceGroupGrid';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { AccountSearchComponent } from './../../internal/search/iCABSASAccountSearch';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { CBBService } from './../../../shared/services/cbb.service';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { DropdownStaticGroupedComponent } from './../../../shared/components/dropdown-static-grouped/dropdown-static-grouped';
import { ElementRef } from '@angular/core';
import { StaticUtils } from './../../../shared/services/static.utility';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
import { Title } from '@angular/platform-browser';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { CBBConstants } from './../../../shared/constants/cbb.constants';

@Component({
    selector: 'icabs-invoice-group-maintenance',
    templateUrl: 'iCABSAInvoiceGroupMaintenance.html'
})

export class InvoiceGroupMaintenanceComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('invoiceTabs') public invoiceTabs: TabsComponent;
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('invoiceGroupEllipsis') public invoiceGroupEllipsis: EllipsisComponent;
    @ViewChild('premiseSearchEllipsis') public premiseSearchEllipsis: EllipsisComponent;
    @ViewChild('menuDropDown') public menuDropDown: DropdownStaticGroupedComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    public optionsList: Array<any>;
    public tabList: Array<any>;
    public componentList: Array<any>;
    public invoiceFormGroup: FormGroup;
    public sysCharParams: Object;
    public autoOpen: boolean = false;
    public parentModeFromURL: Object;
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public isRequesting = false;
    private requestedAddressType: string;
    public isAccountNumberDisable: boolean = false;
    // Subscriptions
    public contactStoreSubscription: Subscription;
    public storeSubscription: Subscription;
    public messageSubscription: Subscription;
    public errorSubscription: Subscription;
    public routeSubscription: Subscription;
    public ajaxSubscription: Subscription;

    // Query Objects
    public invoiceQuery: URLSearchParams;
    public syscharQuery: URLSearchParams;
    public lookupQuery: URLSearchParams;
    public liveInvoiceQuery: URLSearchParams;
    public getDefaultQuery: URLSearchParams;
    public mandateQuery: URLSearchParams;
    public postcodeQuery: URLSearchParams;
    public deliveryQuery: URLSearchParams;
    public formSaveData: Object;

    // Store Objects
    public storeData: Object;
    public storeInvoice: Object;
    public storeCode: Object;
    public storeSentFromParent: Object;
    public storeMode: Object;
    public storeOtherDetails: Object;
    public storeFormGroup: Object;
    public storeParams: Object;
    public storeFormValidKey: string = 'main';
    public storeContact: Object;

    // Invoice Group Number Required Span Show Hide
    public invoiceGroupNumberShowHide: boolean = true;

    // Message Modal Configurations
    public showMessageHeader = true;
    public showErrorHeader = true;
    public disableForm: boolean = true;

    // Objects Used For Save Operations
    public fieldsNotToSave = [
        'CurrencyDesc',
        'LanguageDescription',
        'InvoiceFeeDesc',
        'PaymentDesc',
        'PaymentTermDesc',
        'CurrencyDesc',
        'CollectFromName'
    ];
    public paramsWithDifferentNames = {
        InvoiceFormatCode: 'SystemInvoiceFormatCode',
        InvoiceLanguageCode: 'LanguageCode'
    };
    public fieldsToCapitialize = [
        'InvoiceName',
        'InvoiceAddressLine1',
        'InvoiceAddressLine2',
        'InvoiceAddressLine3',
        'InvoiceAddressLine4',
        'InvoiceAddressLine5',
        'InvoiceContactName',
        'StatementName',
        'StatementAddressLine1',
        'StatementAddressLine2',
        'StatementAddressLine3',
        'StatementAddressLine4',
        'StatementAddressLine5',
        'StatementContactName'
    ];
    public tabNameList = [
        'AddressInvoice',
        'AddressStatement',
        'General',
        'EDIInvoicing'
    ];
    public isInvoiceGroupNumberDisabled = true;

    // Ellipsis Component
    public invoiceGroupGridComponent = InvoiceGroupGridComponent;
    public accountSearchComponent = AccountSearchComponent;
    public premiseSearchComponent = PremiseSearchComponent;
    public ellipsisQueryParams: any = {
        inputParamsAccountNumber: {
            parentMode: 'LookUp',
            autoOpen: false,
            showAddNewDisplay: false
        },
        inputParamsInvoiceGroupNumber: {
            parentMode: 'Lookup'
        },
        inputParamsPremiseSearch: {
            parentMode: 'InvoiceGroup'
        }
    };
    public showHeader: boolean = true;
    public showCloseButton: boolean = true;
    public modalConfig: Object;
    public isPremisesSearchHidden: boolean = true;
    private queryParams: any = {
        AccountNumber: '',
        AccountName: '',
        InvoiceGroupNumber: ''
    };

    // Prompt Modal Model Properties
    public showPromptMessageHeader: boolean = true;
    public promptConfirmTitle: string;
    public promptConfirmContent: string;

    // Dropdown default value
    private dropdownDefault: any = {
        id: '',
        text: ''
    };

    constructor(
        public store: Store<any>,
        public contactStore: Store<any>,
        public serviceConstants: ServiceConstants,
        public httpService: HttpService,
        public formBuilder: FormBuilder,
        public sysCharConstants: SysCharConstants,
        public utils: Utils,
        public riExchange: RiExchange,
        public globalConstant: GlobalConstant,
        public router: Router,
        public messageService: MessageService,
        public logger: Logger,
        public activatedRoute: ActivatedRoute,
        public ajaxconstant: AjaxObservableConstant,
        public localeTranslateService: LocaleTranslationService,
        public cbbService: CBBService,
        private renderer: Renderer,
        public routeAwayGlobals: RouteAwayGlobals,
        private titleService: Title,
        private translate: TranslateService
    ) {
        // Initialize Dropdown Menu Options
        this.optionsList = StaticUtils.deepCopy(BillToCashConstants.c_o_MENU_OPTIONS_LIST);
        // Initialize Tab List
        this.tabList = BillToCashConstants.c_o_TAB_LIST;
        // Initialize Component List To Be Displayed In Tabs
        this.componentList = [AddressInvoiceTabComponent,
            AddressStatementTabComponent,
            GeneralTabComponent,
            EDIInvoicingTabComponent];

        // Set Store In RiExchange
        this.riExchange.getStore('invoice');

        // Set Modal Config For Ellipsis
        this.modalConfig = BillToCashConstants.c_o_ELLIPSIS_MODAL_CONFIG;

        /**
         * Check if page navigated back from Contact page
         * QueryString will contain parentMode=contact
         * If parentMode is set to contact; Subscribe to contact store for contact details
         */
        this.contactStoreSubscription = this.store.select('contact').subscribe((data) => {
            this.getContactDetails(data);
        });

        /*
         * Subscribe To Store Data
         * Called an object method from the callback instead of directly using the method
         * Since "this" object context will be lost if used as callback
         */
        this.storeSubscription = this.store.select('invoice').subscribe((data) => {
            this.storeUpdateHandler(data);
        });

        // Initialize SysChar Parameters
        this.sysCharParams = BillToCashConstants.c_o_SYSCHAR_PARAMS['InvoiceGroupMaintenance'];

        // Set Promp Modal Configurations
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;

        this.ajaxSource$ = this.ajaxSource.asObservable();
        // Ajax Subscription For Spinner
        this.ajaxSubscription = this.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                switch (event) {
                    case this.ajaxconstant.START:
                        this.isRequesting = true;
                        break;
                    case this.ajaxconstant.COMPLETE:
                        this.isRequesting = false;
                        break;
                }
            }
        });
    }

    // Lifecycle Methods
    // ngOnInit - Executed When The Component Is Loaded
    public ngOnInit(): void {
        // Set Modal Config For Ellipsis
        this.modalConfig = BillToCashConstants.c_o_ELLIPSIS_MODAL_CONFIG;
        // Initialize Form
        this.buidForm();

        // Set Invoice Store Objects
        this.setInvoiceData(this.storeInvoice, true);

        this.routeSubscription = this.activatedRoute.queryParams.subscribe((data) => {
            this.parentModeFromURL = data;
            this.queryParams['parentMode'] = data['parentMode'];
            if (!this.invoiceFormGroup) {
                return;
            }
            if (data.hasOwnProperty('AccountNumber')) {
                this.ellipsisQueryParams.inputParamsAccountNumber.autoOpen = false;
                this.queryParams['AccountNumber'] = data['AccountNumber'];
                this.invoiceFormGroup.controls['AccountNumber'].setValue(data['AccountNumber']);
            }
            if (data.hasOwnProperty('AccountName')) {
                this.queryParams['AccountName'] = data['AccountName'];
                this.invoiceFormGroup.controls['AccountName'].setValue(data['AccountName']);
            }
            if (data.hasOwnProperty('InvoiceGroupNumber')) {
                this.queryParams['InvoiceGroupNumber'] = data['InvoiceGroupNumber'];
                this.isInvoiceGroupNumberDisabled = false;
                this.invoiceFormGroup.controls['InvoiceGroupNumber'].enable();
                this.onInvoiceGroupNumberReceived({
                    'Number': data['InvoiceGroupNumber']
                });
            }
            if (data.hasOwnProperty('IGParentMode')) {
                this.queryParams['IGParentMode'] = data['IGParentMode'];
                this.queryParams['ContractNumber'] = data['ContractNumber'];
                this.queryParams['PremiseNumber'] = data['PremiseNumber'];
                this.queryParams['currentContractType'] = data['currentContractType'];
                this.cbbService.setCountryCode(data[CBBConstants.c_s_URL_PARAM_COUNTRYCODE], true);
                this.cbbService.setBusinessCode(data[CBBConstants.c_s_URL_PARAM_BUSINESSCODE], false, true);
                this.cbbService.setBranchCode(data[CBBConstants.c_s_URL_PARAM_BRANCHCODE], true);
                this.queryParams[CBBConstants.c_s_URL_PARAM_COUNTRYCODE] = data[CBBConstants.c_s_URL_PARAM_COUNTRYCODE];
                this.queryParams[CBBConstants.c_s_URL_PARAM_BUSINESSCODE] = data[CBBConstants.c_s_URL_PARAM_BUSINESSCODE];
            }
            if (this.queryParams['parentMode'] === 'IGSearchAdd') {
                this.isAccountNumberDisable = true;
                this.invoiceFormGroup.controls['AccountNumber'].disable();
                this.isInvoiceGroupNumberDisabled = true;
                this.invoiceFormGroup.controls['InvoiceGroupNumber'].disable();
                this.setFormMode();
            }
        });
    }

    // ngAfterViewInit - Executed After View Initialization
    public ngAfterViewInit(): void {
        // Get SysChar Parameters
        this.getSysChar();

        // Message Subscription
        this.messageService.emitMessage(0);
        this.messageSubscription = this.messageService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
            }
        });

        // Initialize Translate Service
        this.localeTranslateService.setUpTranslation();

        // If Returned From Address Selection Page; Dispatch Event To Update Address
        if (this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['AddressSelected']]
            || this.parentModeFromURL['parentMode'] === 'contact') {
            if (this.parentModeFromURL['parentMode'] === 'contact') {
                let contactData = this.contactStore['data'];
                this.storeSentFromParent['ContactName'] = contactData['ContactName'];
                this.storeSentFromParent['ContactPosition'] = contactData['ContactPosition'];
                this.storeSentFromParent['ContactTelephone'] = contactData['ContactTelephone'];
                this.storeSentFromParent['ContactMobileNumber'] = contactData['ContactMobileNumber'];
                this.storeSentFromParent['ContactEmailAddress'] = contactData['ContactEmailAddress'];
                this.storeSentFromParent['ContactDepartment'] = contactData['ContactDepartment'];
                this.storeSentFromParent['ContactPosition'] = contactData['ContactFax'];
            }

            this.store.dispatch({
                type: InvoiceActionTypes.ADDRESS_DATA_RECEIVED
            });
        }

        this.invoiceFormGroup.controls['InvoiceGroupNumber'].disable();
        this.invoiceTabs.tabFocusTo(0);
        if (this.invoiceFormGroup.controls['AccountNumber'].value) {
            this.isInvoiceGroupNumberDisabled = false;
            if (this.queryParams['parentMode'] !== 'IGSearchAdd') {
                this.invoiceFormGroup.controls['InvoiceGroupNumber'].enable();
            }
        }

        this.store.dispatch({
            type: InvoiceActionTypes.CHECK_NAVIGATION_BACK
        });

        if (this.queryParams['AccountNumber']) {
            this.ellipsisQueryParams.inputParamsAccountNumber.autoOpen = false;
            this.invoiceFormGroup.controls['AccountNumber'].setValue(this.queryParams['AccountNumber']);
        }
        if (this.queryParams['AccountName']) {
            this.invoiceFormGroup.controls['AccountName'].setValue(this.queryParams['AccountName']);
        }

        if (this.queryParams['InvoiceGroupNumber']) {
            this.invoiceFormGroup.controls['InvoiceGroupNumber'].setValue(this.queryParams['InvoiceGroupNumber']);
        }
        let parentMode: string = this.queryParams['parentMode'];
        switch (parentMode) {
            case 'PremiseSearchAdd':
            case 'ContactManagement':
            case 'AccountAdd':
            case 'AccountSearch':
                this.isAccountNumberDisable = true;
                this.isInvoiceGroupNumberDisabled = true;
                this.setFormMode();
                break;
        }

        this.getTranslatedValue('Invoice Group Maintenance', null).subscribe((res: string) => {
            if (res) {
                this.titleService.setTitle(res);
            }
        });
    }

    // ngOnDestroy - Executed On Destroy
    public ngOnDestroy(): void {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
        if (this.contactStoreSubscription) {
            this.contactStoreSubscription.unsubscribe();
        }
        if (this.messageSubscription) {
            this.messageSubscription.unsubscribe();
        }
        if (this.errorSubscription) {
            this.errorSubscription.unsubscribe();
        }
    }

    // Object Methods
    /**
     * Method - setEllipsisParams
     * Sets all the ellipsis input paramters in the page
     */
    public setEllipsisParams(): void {
        for (let key in this.ellipsisQueryParams) {
            if (!key) {
                continue;
            }
            this.ellipsisQueryParams[key]['parentMode'] = this.ellipsisQueryParams[key].parentMode;
            this.ellipsisQueryParams[key][this.serviceConstants.BusinessCode] = this.utils.getBusinessCode();
            this.ellipsisQueryParams[key][this.serviceConstants.CountryCode] = this.utils.getCountryCode();
        }
    }

    /**
     * Method - storeUpdateHandler
     * Callback for any publish to store objects
     * Updates object properties for use
     */
    public storeUpdateHandler(data: Object): void {
        this.storeMode = {};
        this.storeCode = {};
        this.storeSentFromParent = {};
        this.storeParams = {};
        this.storeInvoice = {};
        // Set objects in class property
        if (data) {
            if (data['mode']) {
                this.storeMode = data['mode'];
            }
            if (data['code']) {
                this.storeCode = data['code'];
            }
            if (data['sentFromParent']) {
                this.storeSentFromParent = data['sentFromParent'];
            }
            if (data['params']) {
                this.storeSentFromParent = data['params'];
            }
            if (data['invoice']) {
                this.storeInvoice = data['invoice'];
            }
        }

        switch (data && data['action']) {
            case InvoiceActionTypes.SAVE_DATA:
                this.storeData = data['data'];
                // Call Method To Update Forms
                this.setFormData();
                // Lookup To Get Details
                this.getDetails();
                break;
            case InvoiceActionTypes.SAVE_MODE:
                this.storeMode = data['mode'];
                let disableCBB: boolean = false;
                if (!this.storeMode['searchMode']) {
                    disableCBB = true;
                }
                this.cbbService.disableComponent(disableCBB);
                this.riExchange.riInputElement.Enable(this.invoiceFormGroup, 'InvoiceGroupNumber');
                if (this.storeMode['addMode']) {
                    this.riExchange.riInputElement.Disable(this.invoiceFormGroup, 'InvoiceGroupNumber');
                    this.clearForms();
                    this.getDefaults();
                    if (this.queryParams['parentMode'] !== 'IGSearchAdd') {
                        this.invoiceTabs.tabFocusTo(0);
                    }
                }
                break;
            case InvoiceActionTypes.SAVE_INVOICE:
                this.storeInvoice = data['invoice'];
                break;
            case InvoiceActionTypes.SAVE_CODE:
                this.storeCode = data['code'];
                this.setEllipsisParams();
                break;
            case InvoiceActionTypes.SAVE_OTHER_DETAILS:
                // Set Details In Forms
                this.setDetailsInForms();
                break;
            case InvoiceActionTypes.SEND_DATA_FROM_PARENT:
                this.storeSentFromParent = data['sentFromParent'];
                if (!this.requestedAddressType) {
                    this.setFormMode();
                }
                break;
            case InvoiceActionTypes.CHECK_LIVE_INVOICE:
                this.isLiveInvoice();
                break;
            case InvoiceActionTypes.NAVIGATE:
                // Navigate Away From The Page
                this.navigateAway(data['navigateTo']);
                break;
            case InvoiceActionTypes.SET_FORM_GROUPS:
                this.storeFormGroup = data['formGroup'];
                break;
            case InvoiceActionTypes.DISPATCH_ERROR:
                // Error thrown from tab components
                this.dispatchError(data['error']);
                break;
            case InvoiceActionTypes.SAVE_PARAMS:
                this.getAddressFromOtherPage(data['params']);
                break;
            case InvoiceActionTypes.CHECK_NAVIGATION_BACK:
                this.invoiceFormGroup.controls['AccountNumber'].setValue(this.storeInvoice['AccountNumber']);
                this.invoiceFormGroup.controls['AccountName'].setValue(this.storeInvoice['AccountName']);
                this.invoiceFormGroup.controls['InvoiceGroupNumber'].setValue(this.storeInvoice['InvoiceGroupNumber']);
                if (!this.invoiceFormGroup.controls['AccountNumber'].value) {
                    this.ellipsisQueryParams.inputParamsAccountNumber.autoOpen = true;
                    return;
                }
                this.onInvoiceGroupNumberReceived();
                // Update ellipsis
                this.ellipsisQueryParams.inputParamsInvoiceGroupNumber[this.serviceConstants.AccountNumber] = this.storeInvoice['AccountNumber'];
                this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountName'] = this.invoiceFormGroup.controls['AccountName'].value;
                this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountNumberChanged'] = true;
                this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['parentMode'] = 'InvoiceGroupMaintenance';
                this.invoiceGroupEllipsis.childConfigParams = this.ellipsisQueryParams.inputParamsInvoiceGroupNumber;
                break;
        }
    }

    /**
     * Method - getContactDetails
     * Gets executed when page returns from contact maintainance page
     */
    public getContactDetails(contactData: any): void {
        this.storeContact = contactData['data'];
    }

    /**
     * Method - getInvoiceData
     * Makes the HTTP call and gets the data
     */
    public getInvoiceData(): any {
        this.invoiceQuery = new URLSearchParams();

        // Initialize Query
        this.invoiceQuery = this.prepareQueryDefaults();
        this.invoiceQuery.set(this.serviceConstants.AccountNumber,
            this.invoiceFormGroup.controls[this.serviceConstants.AccountNumber].value);
        this.invoiceQuery.set(BillToCashConstants.c_o_REQUEST_PARAM_NAMES['InvoiceGroupNumber'],
            this.invoiceFormGroup.controls['InvoiceGroupNumber'].value);

        // Return Promise To Make HTTP call
        return this.httpService.makeGetRequest(
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'],
            this.invoiceQuery);
    }

    /**
     * Method - buildForm
     * Initializes the form
     */
    public buidForm(): void {
        this.invoiceFormGroup = this.formBuilder.group({
            AccountNumber: [{ value: '', disabled: false }, Validators.required],
            AccountName: [{ value: '', disabled: true }],
            InvoiceGroupNumber: [{ value: '', disabled: false }, Validators.required]
        });

        // Set In Store For Validation
        this.store.dispatch({
            type: InvoiceActionTypes.SET_FORM_GROUPS,
            payload: {
                name: this.storeFormValidKey,
                form: this.invoiceFormGroup
            }
        });

        // Set Values In Controls If Account Number And Name Available In Invoice Store Key
        if (this.storeInvoice[this.serviceConstants.AccountNumber]) {
            this.invoiceFormGroup.controls[this.serviceConstants.AccountNumber].setValue(this.storeInvoice[this.serviceConstants.AccountNumber]);
        }
        if (this.storeInvoice['AccountName']) {
            this.invoiceFormGroup.controls['AccountName'].setValue(this.storeInvoice['AccountName']);
        }
    }

    /**
     * Method - setFormData
     * Sets form data and updates invoice store
     */
    public setFormData(): void {
        let parentMode = this.riExchange.ParentMode({});

        // Set Payload
        this.storeInvoice['AccountNumber'] = this.storeData['AccountNumber'];
        this.storeInvoice['InvoiceGroupNumber'] = this.storeData['InvoiceGroupNumber'];

        // Set Form Data Based On The Parent Mode
        switch (parentMode) {
            case 'General':
                this.invoiceFormGroup.controls['AccountNumber'].setValue(this.storeData['AccountNumber']);
                this.invoiceFormGroup.controls['InvoiceGroupNumber'].setValue(this.storeData['InvoiceGroupNumber']);
                break;
            case 'GeneralSearch':
                this.invoiceFormGroup.controls['AccountNumber'].setValue(this.storeData['AccountNumber']);
                this.invoiceFormGroup.controls['InvoiceGroupNumber'].setValue(this.storeData['InvoiceGroupNumber']);
                break;
            case 'History':
                this.invoiceFormGroup.controls['AccountNumber'].setValue(this.storeData['AccountNumber']);
                this.invoiceFormGroup.controls['InvoiceGroupNumber'].setValue(this.storeData['InvoiceGroupNumber']);
                break;
        }
        this.disableForm = false;
    }

    /**
     * Method - createSysCharListForQuery
     * Creates A Comma Seperated List Of SysChars
     * This List Needs To Be Passed With The SysChar Query
     */
    public createSysCharListForQuery(): string {
        let sysCharList = [
            this.sysCharConstants.SystemCharEnableAddressLine3,
            this.sysCharConstants.SystemCharMaximumAddressLength,
            this.sysCharConstants.SystemCharEnableInvoiceFee,
            this.sysCharConstants.SystemCharEnableHopewiserPAF,
            this.sysCharConstants.SystemCharEnableDatabasePAF,
            this.sysCharConstants.SystemCharAddressLine4Required,
            this.sysCharConstants.SystemCharAddressLine5Required,
            this.sysCharConstants.SystemCharPostCodeRequired,
            this.sysCharConstants.SystemCharPostCodeMustExistinPAF,
            this.sysCharConstants.SystemCharRunPAFSearchOnFirstAddressLine,
            this.sysCharConstants.SystemCharDisableFirstCapitalOnAddressContact,
            this.sysCharConstants.SystemCharInvoiceShowProductDetail,
            this.sysCharConstants.SystemCharEnablePostcodeDefaulting,
            this.sysCharConstants.SystemCharEnableValidatePostcodeSuburb,
            this.sysCharConstants.SystemCharEnableGPSCoordinates,
            this.sysCharConstants.SystemCharHidePostcode,
            this.sysCharConstants.SystemCharPrintEDIInvoices,
            this.sysCharConstants.SystemCharEnablePayTypeAtInvoiceGroupLevel,
            this.sysCharConstants.SystemCharEnableBankDetailEntry
        ];

        return sysCharList.join(',');
    }

    /**
     * Method - getSysChars
     * Method To Get SysChar Values From Service
     */
    public getSysChar(): any {
        this.syscharQuery = new URLSearchParams();

        // Add Parameters To Query
        this.syscharQuery = this.prepareQueryDefaults();
        this.syscharQuery.set(this.serviceConstants.SystemCharNumber,
            this.createSysCharListForQuery());

        // Make HTTP Call
        Observable.forkJoin(
            this.httpService.sysCharRequest(this.syscharQuery),
            this.getMultiContactInd()
        ).subscribe(
            (data) => {
                let multiContactInd = false;

                // Call Method To Update SysChars
                this.updateSysChar(data[0]);

                // Update MultiContactInd
                if (data[1]['results'] && data[1]['results'].length > 0 && data[1]['results'][0][0]) {
                    multiContactInd = true;
                }
                this.sysCharParams['vSCMultiContactInd'] = multiContactInd;

                // Sensitize Controls Based On Condition
                this.optionsList = StaticUtils.deepCopy(BillToCashConstants.c_o_MENU_OPTIONS_LIST);
                if (this.sysCharParams['vSCMultiContactInd']) {
                    this.optionsList = StaticUtils.deepCopy(BillToCashConstants.c_o_MENU_OPTIONS_LIST);
                    if (this.storeMode['addMode']) {
                        this.sensitiseContactDetails(true);
                    } else if (this.storeMode['updateMode'] && this.invoiceFormGroup.controls['InvoiceGroupNumber'].value) {
                        this.sensitiseContactDetails(false);
                    }
                } else {
                    this.optionsList[1].list = this.optionsList[1].list.slice(2);
                }

                // Publish SysChar Values In Store
                this.store.dispatch({
                    type: InvoiceActionTypes.SAVE_SYSCHAR,
                    payload: this.sysCharParams
                });
            },
            (error) => {
                this.dispatchGeneralError(error);
            }
            );
    }

    /**
     * Method - updateFromSysChars
     * Update View And Store From The SysChar Values
     */
    public updateSysChar(sysChars: any): void {
        let records: Object;

        // If No Record Returned; Throw Error And Break From Method
        if (!sysChars || !sysChars.records.length) {
            return;
        }

        records = sysChars.records;

        this.sysCharParams['vSCEnableAddressLine3'] = records[0].Required;
        this.sysCharParams['vSCAddressLine3Logical'] = records[0].Logical;
        this.sysCharParams['vSCEnableMaxAddress'] = records[1].Required;
        this.sysCharParams['vSCEnableMaxAddressValue'] = records[1].Integer;
        this.sysCharParams['vSCEnableInvoiceFee'] = records[2].Required;
        this.sysCharParams['vSCEnableHopewiserPAF'] = records[3].Required;
        this.sysCharParams['vSCEnableDatabasePAF'] = records[4].Required;
        this.sysCharParams['vSCAddressLine4Required'] = records[5].Required;
        this.sysCharParams['vSCAddressLine4Logical'] = records[5].Logical;
        this.sysCharParams['vSCAddressLine5Required'] = records[6].Required;
        this.sysCharParams['vSCAddressLine5Logical'] = records[6].Logical;
        this.sysCharParams['vSCPostCodeRequired'] = records[7].Required;
        this.sysCharParams['vSCPostCodeMustExistInPAF'] = records[8].Required;
        this.sysCharParams['vSCRunPAFSearchOn1stAddressLine'] = records[9].Required;
        this.sysCharParams['vSCCapitalFirstLtr'] = !records[10].Required;
        this.sysCharParams['vSCInvoiceShowProductDetail'] = records[11].Required;
        this.sysCharParams['vEnablePostcodeDefaulting'] = records[12].Required;
        this.sysCharParams['vSCEnableValidatePostcodeSuburb'] = records[13].Required;
        this.sysCharParams['vSCEnablePostcodeSuburbLog'] = records[13].Logical;
        this.sysCharParams['vSCEnableGPSCoordinates'] = records[14].Required;
        this.sysCharParams['vSCHidePostcode'] = records[15].Required;
        this.sysCharParams['vSCPrintEDIInvoices'] = records[16].Required;
        this.sysCharParams['vSCEnablePayTypeAtInvGroupLev'] = records[17].Required;

        // Set Mandate Referene
        this.sysCharParams['vSCOAMandateRequired'] = true;
        if (records[18].Required || !records[18].Logical) {
            this.sysCharParams['vSCOAMandateRequired'] = false;
        }

        // Create Disabled Field List
        this.sysCharParams['vDisableFieldList'] = '';
        if (!this.sysCharParams['vSCEnableAddressLine3']) {// Address Line 3
            this.sysCharParams['vDisableFieldList'] += 'AddressLine3';
        }
    }


    /**
     * Method - getMultiContactInd
     * Execute lookup and populate MultiContactInd SysChar
     */
    public getMultiContactInd(): Observable<any> {
        let data: Array<Object> = [{
            'table': 'riRegistry',
            'query': { 'RegSection': 'Contact Person' },
            'fields': ['RegSection']
        }];

        return this.prepareLookup(data, '1');
    }

    /**
     * Method - setInvoiceData
     * Sets data into store for further use
     */
    public setInvoiceData(data: any, route: any): void {
        let parentMode: string;
        // Save Data Into Code Store
        this.store.dispatch({
            type: InvoiceActionTypes.SAVE_CODE,
            payload: {
                business: this.queryParams[CBBConstants.c_s_URL_PARAM_BUSINESSCODE] || this.utils.getBusinessCode(),
                country: this.queryParams[CBBConstants.c_s_URL_PARAM_COUNTRYCODE] || this.utils.getCountryCode()
            }
        });

        // Save Data Into Params Parameter Store
        if (data && data.parentMode) {
            parentMode = this.riExchange.ParentMode({});
            this.store.dispatch({
                type: InvoiceActionTypes.SEND_DATA_FROM_PARENT,
                payload: {
                    parentMode: data.parentMode
                }
            });

            switch (parentMode) {
                case 'Search':
                case 'PremiseSearchAdd':
                case 'ContactManagement':
                case 'Account':
                case 'AccountSearch':
                case 'IGSearchAdd':
                case 'AccountAdd':
                    let accountNumber = this.queryParams['AccountNumber'] || this.riExchange.GetParentHTMLInputValue({}, 'AccountNumber');
                    if (accountNumber) {
                        this.storeInvoice['AccountNumber'] = accountNumber;
                        this.storeInvoice['AcccounName'] = this.queryParams['AccountName'] || this.riExchange.GetParentHTMLInputValue({}, 'AccountName');
                        this.storeInvoice['InvoiceGroupNumber'] = this.riExchange.GetParentHTMLInputValue({}, 'InvoiceGroupNumber');
                    }
                    break;

            }
        }

        // If Add Mode Do Not Execute Service Call
        if (this.storeMode['addMode']) {
            this.invoiceFormGroup.controls['InvoiceGroupNumber'].setValue('');
            this.clearForms();
            return;
        }

        // Save Data Into Mode Store
        this.storeMode = this.updateFormMode('updateMode');
        this.store.dispatch({
            type: InvoiceActionTypes.SAVE_MODE,
            payload: this.storeMode
        });

        // Set Form Mode
        this.setFormMode();

        // Get Contact Data
        this.contactStore.dispatch({
            type: ''
        });
    }

    /**
     * Method - setFormMode
     * Set for mode based on sentFromParent key
     */
    public setFormMode(): void {
        let parentMode = this.riExchange.ParentMode({}) || this.queryParams['parentMode'];
        if (!parentMode) {
            parentMode = this.queryParams['parentMode'];
        }

        // Set Form Mode
        switch (parentMode) {
            case 'PremiseSearchAdd':
            case 'ContactManagement':
            case 'Account':
            case 'AccountAdd':
            case 'IGSearchAdd':
                this.storeMode = this.updateFormMode('addMode');
                this.store.dispatch({
                    type: InvoiceActionTypes.SAVE_MODE,
                    payload: this.storeMode
                });
                break;
            case 'GeneralSearch':
                this.storeMode = this.updateFormMode('searchMode');
                break;
            default:
                this.storeMode = this.updateFormMode('updateMode');
                break;
        }
    }

    /**
     * Method - updateMode
     * Modifies the mode object
     * Sets the passed mode to true and everything else to false
     */
    public updateFormMode(modeToUpdate: string): Object {
        let result: Object = {};
        let modes: Array<string> = ['updateMode', 'addMode', 'searchMode'];

        for (let i = 0; i < modes.length; i++) {
            if (modes[i] === modeToUpdate) {
                result[modes[i]] = true;
                continue;
            }
            result[modes[i]] = false;
        }

        return result;
    }

    /**
     * Method - getDetails
     * Executes lookup to fetch miscellaneous details
     * E.g. - AccountName, Invoice Issue Type Description etc.
     */
    public getDetails(): void {
        let data: Array<any> = BillToCashConstants.c_o_LOOKUP_PARAMS['InvoiceGroupMaintenance']['details'];

        this.storeData['AccountNumber'] = this.invoiceFormGroup.controls['AccountNumber'].value;
        // Traverse Through The data Array And Prepare Request Payload For Lookup
        for (let i = 0; i < data.length; i++) {
            let query = data[i]['query'];
            for (let key in query) {
                if (!key) {
                    continue;
                }
                query[key] = this.storeData[key];
            }
        }

        this.prepareLookup(data, '5').subscribe(
            (data) => {
                this.storeOtherDetails = {
                    AccountName: data['results'][0][0]['AccountName'],
                    SystemInvoiceIssueTypeDesc: data['results'][1][0]['SystemInvoiceIssueTypeDesc'],
                    SystemInvoiceFormatDesc: data['results'][2][0]['SystemInvoiceFormatDesc'],
                    CurrencyDesc: data['results'][3][0]['CurrencyDesc'],
                    PaymentTermDesc: data['results'][4][0]['PaymentTermDesc'],
                    LanguageDescription: data['results'][5][0]['LanguageDescription'],
                    InvoiceFeeDesc: data['results'][6].length > 0 ? data['results'][6][0]['InvoiceFeeDesc'] : ''
                };

                // Save In otherDetails Key In Store
                this.store.dispatch({
                    type: InvoiceActionTypes.SAVE_OTHER_DETAILS,
                    payload: this.storeOtherDetails
                });
                this.cbbService.disableComponent(true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.dispatchGeneralError(error);
            }
        );
    }

    /**
     * Method - clearForms
     * Clears forms in the tabs - For add mode
     */
    public clearForms(): void {
        let formGroups = this.storeFormGroup;

        // Clear InvoiceFormGroup Control
        this.invoiceGroupNumberShowHide = false;
        if (!this.invoiceFormGroup) {
            return;
        }
        this.invoiceFormGroup.controls['InvoiceGroupNumber'].setValue('');
        this.invoiceFormGroup.controls['InvoiceGroupNumber'].clearValidators();

        // Clear Other Controls
        for (let key in formGroups) {
            if (!key) {
                continue;
            }
            let formGroup = formGroups[key];
            if (!formGroup || key === 'main') {
                continue;
            }
            if (key === 'dropdownComponents') {
                for (let dropdown in formGroup) {
                    if (!dropdown) {
                        continue;
                    }
                    formGroup[dropdown].selectedItem = '';
                }
                continue;
            }
            for (let control in formGroup['controls']) {
                if (!control) {
                    continue;
                }
                formGroup['controls'][control].setValue('');
            }
        }
    }

    /**
     * Method - prepareLookup
     * Sets up the query paramters and prepares lookup request
     * Reutrns a promise
     */
    public prepareLookup(data: Array<any>, maxResults: string): Observable<any> {
        this.lookupQuery = new URLSearchParams();

        // Set Paramters
        this.lookupQuery = this.prepareQueryDefaults();
        this.lookupQuery.set(this.serviceConstants.MaxResults, maxResults);

        return this.httpService.lookUpRequest(this.lookupQuery, data);
    }

    /**
     * Method - setDetailsInForms
     * Called from the store otherDetails key update
     * Updates the form controls
     */
    public setDetailsInForms(): void {
        if (!this.invoiceFormGroup) {
            return;
        }
        // Set Account Name
        this.invoiceFormGroup.controls['AccountName'].setValue(this.storeOtherDetails['AccountName']);

        // Set In Store
        this.storeInvoice['AccountName'] = this.storeOtherDetails['AccountName'];
        this.storeInvoice[this.serviceConstants.AccountNumber] = this.getControlValueFromStore('main', this.serviceConstants.AccountNumber);
        this.storeInvoice[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['InvoiceGroupNumber']] = this.getControlValueFromStore('main', BillToCashConstants.c_o_REQUEST_PARAM_NAMES['InvoiceGroupNumber']);
        this.storeInvoice[BillToCashConstants.c_o_STORE_KEY_NAMES['AccountNumberChanged']] = true;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber[this.serviceConstants.AccountNumber] = this.invoiceFormGroup.controls['AccountNumber'].value;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountNumberChanged'] = true;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountName'] = this.storeOtherDetails['AccountName'];
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['parentMode'] = 'InvoiceGroupMaintenance';
        this.invoiceGroupEllipsis.childConfigParams = this.ellipsisQueryParams.inputParamsInvoiceGroupNumber;
        this.invoiceTabs.tabFocusTo(0);
    }

    /**
     * Method - isLiveInvoice
     * Makes HTTP call to check if current invoice is a live invoice
     * On promise callback sets the store so that the General Tab child can be updated
     */
    public isLiveInvoice(): void {
        this.liveInvoiceQuery = new URLSearchParams();

        // Initialize Query
        this.liveInvoiceQuery = this.prepareQueryDefaults('6');
        this.liveInvoiceQuery.set(this.serviceConstants.AccountNumber,
            this.storeData['AccountNumber']);
        this.liveInvoiceQuery.set(BillToCashConstants.c_o_REQUEST_PARAM_NAMES['InvoiceGroupNumber'],
            this.storeData['InvoiceGroupNumber']);
        this.liveInvoiceQuery.set(BillToCashConstants.c_o_REQUEST_PARAM_NAMES['Function'],
            'LiveInvoiceGroup');

        // Return Promise To Make HTTP call
        this.httpService.makeGetRequest(
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'],
            this.liveInvoiceQuery).subscribe(
            (data) => {
                let resp: string = (data.LiveInvoiceGroupInd === 'TRUE' || data.LiveInvoiceGroupInd === 'yes') ? 'yes' : 'no';
                // Save In Store With Action - UPDATE
                this.store.dispatch({
                    type: InvoiceActionTypes.UPDATE_LIVE_INVOICE,
                    payload: this.utils.convertResponseValueToCheckboxInput(resp)
                });
            },
            (error) => {
                this.dispatchGeneralError(error);
            }
            );
    }

    /**
     * Method - getAddressFromOtherPage
     * Get address from ellipsis
     */
    public getAddressFromOtherPage(data: any): void {
        this.requestedAddressType = data.AddressType;

        // Open Ellipsis Based On The Type
        switch (this.requestedAddressType) {
            case 'Invoice':
                this.ellipsisQueryParams.inputParamsInvoiceGroupNumber.parentMode = 'SearchAddress';
                this.invoiceGroupEllipsis.openModal();
                break;
        }
    }

    /**
     * Method - navigateAway
     * Navigates to other pages
     * Takes page name as parameter
     * Picks up the route and mode from collection in constants object
     */
    public navigateAway(page: string): void {
        let route = BillToCashConstants.c_o_ROUTES_AND_MODES[page].route;
        let mode = BillToCashConstants.c_o_ROUTES_AND_MODES[page].mode;

        // Stop If Route Is Not Set
        if (!route) {
            return;
        }

        // Set In URL For Few Routes
        if (page === 'ContactDetailsInv' || page === 'ContactDetailsStat') {
            this.router.navigate([route], {
                queryParams: {
                    parentMode: mode,
                    accountNumber: this.riExchange.riInputElement.GetValue(this.invoiceFormGroup, 'AccountNumber'),
                    invoiceGroupNumber: this.riExchange.riInputElement.GetValue(this.invoiceFormGroup, 'InvoiceGroupNumber')
                }
            });
            return;
        }

        // Update Store sentFromParent Key With Mode
        this.storeSentFromParent['parentMode'] = mode;
        // Dispatch Data To Store
        this.store.dispatch({
            type: InvoiceActionTypes.SEND_DATA_FROM_PARENT,
            payload: this.storeSentFromParent
        });

        // Navigate
        this.router.navigate([route]);
    }

    /**
     * Method - validateForms
     * Validates the form
     * Dispatch store action to notify parent
     */
    public validateForms(): void {
        let isValid: boolean = true;
        let mandateReferenceNumber: string = this.getControlValueFromStore('General', 'ExOAMandateReference');
        let parameterName: string;
        let value: string = '';
        let tabToFocus: number = -1;

        this.formSaveData = {};

        this.ajaxSource.next(this.ajaxconstant.START);
        /**
         * Traverse the store formGroup object
         * Validate every form in the page including tabs
         * Mark invalid form controls
         * If all the forms are valid proceed with save
         */
        for (let formGroup in this.storeFormGroup) {
            if (!formGroup) {
                continue;
            }
            if (formGroup === 'dropdownComponents') {
                let dropdownGroup: any = this.storeFormGroup[formGroup];
                for (let dropdown in dropdownGroup) {
                    if (!dropdown || dropdown === 'InvoiceIssueTypeCode') {
                        continue;
                    }
                    parameterName = (this.paramsWithDifferentNames[dropdown] || dropdown);
                    this.formSaveData[parameterName] = dropdownGroup[dropdown].selectedItem;
                    dropdownGroup[dropdown].isValid = true;
                    if (!dropdownGroup[dropdown].selectedItem) {
                        dropdownGroup[dropdown].isValid = false;
                    }
                }
                continue;
            }
            let formGroupControls = this.storeFormGroup[formGroup].controls;
            for (let control in formGroupControls) {
                if (!control) {
                    continue;
                }
                let formControl = formGroupControls[control];
                // If In Not To Save List Do Not Add In Save Data
                if (this.fieldsNotToSave.indexOf(control) < 0) {
                    parameterName = (this.paramsWithDifferentNames[control] || control);
                    // If Capitialize Required Capitialize And Set Value
                    value = this.sysCharParams['vSCCapitalFirstLtr'] && formControl.value && (typeof formControl.value === 'string')
                        ? this.utils.capitalizeFirstLetter(formControl.value) : formControl.value;
                    formControl.setValue(value);
                    this.formSaveData[parameterName] = value || '';
                    // If Value Is true/false Convert to Yes/No
                    if (typeof formControl.value === 'boolean') {
                        this.formSaveData[control] = this.utils.convertCheckboxValueToRequestValue(formControl.value);
                    }
                }
                if (formControl.invalid) {
                    if (formGroup !== this.storeFormValidKey && tabToFocus === -1) {
                        tabToFocus = this.tabNameList.indexOf(formGroup);
                    }
                    isValid = false;
                    formControl.markAsTouched();
                }
            }
        }

        if (!isValid) {
            this.invoiceTabs.tabFocusTo(tabToFocus);
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            return;
        }

        /*
         * Execute Service To Check If Mandate Reference Is Required
         * Display Message As Returned From Service
         * On Close Of Message Execute Validate And Save
         */
        if (this.storeMode['addMode'] && !mandateReferenceNumber && this.sysCharParams['vSCOAMandateRequired']) {
            this.checkMandateRequired().subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    // Save Will Happen Only Close of Modal
                    // Update Function Pointer To Proceed With Save
                    this.onMessageClose = this.checkPostCodeAndDelivery;
                    if (data.ErrorMessageDesc) {
                        this.messageService.emitMessage({
                            msg: data.ErrorMessageDesc
                        });
                    }
                },
                (error) => {
                    this.dispatchGeneralError(error);
                }
            );
            return;
        }

        /**
         * If mandate reference is changed and is not blank
         * Execute service to validate reference number
         */
        if (this.storeFormGroup['General'].controls['ExOAMandateReference'].dirty && mandateReferenceNumber) {
            this.validateMandateReferenceNumber().subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    // Undefined Check Has Been Done To Make Sure That Messsage Displayed Even Returned As Empty String From Service
                    // In Case Of Empty String Will Display General Error
                    if (data['fullError'] !== undefined) {
                        // Update Function Pointer And Content To Proceed With Save
                        this.promptConfirmContent = data['fullError'];
                        this.promptConfirm = this.checkPostCodeAndDelivery;
                        this.promptConfirmModal.show();
                        return;
                    }
                    this.checkPostCodeAndDelivery();
                },
                (error) => {
                    this.dispatchGeneralError(error);
                }
            );
            return;
        }

        //
        this.checkPostCodeAndDelivery();
    }

    /**
     * Method - checkMandaterequired
     * Make HTTP call to check if ExOAMandateReference is required
     */
    public checkMandateRequired(): Observable<any> {
        this.mandateQuery = new URLSearchParams();
        let formData: Object = {};

        // Initialize Query
        this.mandateQuery = this.prepareQueryDefaults('6');

        formData[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['ExOAMandateReference']] = '';
        formData[this.serviceConstants.Function] = 'WarnNoMandateNumber';

        return this.httpService.makePostRequest(
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'],
            this.mandateQuery,
            formData);
    }

    /**
     * Method - validateMandateReferenceNumber
     * Make HTTP call to vlidate mandate reference number for account number and invoice group number
     */
    public validateMandateReferenceNumber(): Observable<any> {
        this.mandateQuery = new URLSearchParams();
        let formData: Object = {};

        // Initialize Query
        this.mandateQuery = this.prepareQueryDefaults('6');

        formData[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['ExOAMandateReference']] = '';
        formData[this.serviceConstants.Function] = 'ValidateExOAMandateReference';
        formData[this.serviceConstants.AccountNumber] = this.getControlValueFromStore('main', 'AccountNumber');
        formData[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['InvoiceGroupNumber']] = this.getControlValueFromStore('main', 'InvoiceGroupNumber');

        return this.httpService.makePostRequest(
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'],
            this.mandateQuery,
            formData);
    }

    /**
     * Method - checkPostCode
     * Make HTTP call to validate post code against Address
     * Takes address type as parameter
     * Populates form data based on address type
     */
    public checkPostCode(): Observable<any> {
        this.mandateQuery = new URLSearchParams();
        let formData: Object = {};
        let addressType: string = 'Invoice';

        // Initialize Query
        this.postcodeQuery = this.prepareQueryDefaults('6');

        for (let i = 0; i < BillToCashConstants.c_arr_CHECKPOSTCODE_PARAMS.length; i++) {
            let fieldName = addressType + BillToCashConstants.c_arr_CHECKPOSTCODE_PARAMS[i];
            formData[fieldName] = this.getControlValueFromStore('Address' + addressType, fieldName);
        }
        addressType = 'Statement';
        for (let i = 0; i < BillToCashConstants.c_arr_CHECKPOSTCODE_PARAMS.length; i++) {
            let fieldName = addressType + BillToCashConstants.c_arr_CHECKPOSTCODE_PARAMS[i];
            formData[fieldName] = this.getControlValueFromStore('Address' + addressType, fieldName);
        }

        // Set Function Name
        formData[this.serviceConstants.Function] = 'CheckPostcode';

        return this.httpService.makePostRequest(
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'],
            this.postcodeQuery,
            formData);
    }

    /**
     * Method - checkDelivery
     * Make HTTP call to validate delivery
     */
    public checkDelivery(): Observable<any> {
        this.deliveryQuery = new URLSearchParams();
        let invoiceContactName = this.getControlValueFromStore('AddressInvoice', 'InvoiceContactName');
        let invoiceContactEmail = this.getControlValueFromStore('AddressInvoice', 'InvoiceContactEmail');
        let invoiceContactFax = this.getControlValueFromStore('AddressInvoice', 'InvoiceContactFax');
        let invoiceIssueTypeCode = this.getControlValueFromStore('General', 'InvoiceIssueTypeCode');
        let formData: Object = {};

        // Initialize Query
        this.deliveryQuery = this.prepareQueryDefaults('6');

        // Add To formData If Not Blank
        if (invoiceContactName) {
            formData['InvoiceContactName'] = invoiceContactName;
        }
        if (invoiceContactEmail) {
            formData['InvoiceContactEmail'] = invoiceContactEmail;
        }
        if (invoiceContactFax) {
            formData['InvoiceContactFax'] = invoiceContactFax;
        }
        if (invoiceIssueTypeCode) {
            formData['InvoiceIssueTypeCode'] = invoiceIssueTypeCode;
        }

        // Set Function Name
        formData[this.serviceConstants.Function] = 'CheckDelivery';

        return this.httpService.makePostRequest(
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'],
            this.deliveryQuery,
            formData);
    }

    /**
     * Method - checkPostCodeAndDelivery
     * Executes service to check post code and delivery
     * On success executes save
     */
    public checkPostCodeAndDelivery(): void {
        let requests: Array<Observable<any>> = [];

        // Include PostCode Checks Based On The Conditions
        if (this.sysCharParams['vSCPostCodeMustExistInPAF']
            && (this.sysCharParams['vSCEnableHopewiserPAF']
                || this.sysCharParams['vSCEnableDatabasePAF'])) {
            requests.push(this.checkPostCode());
            // Set Check Delivery
            requests.push(this.checkDelivery());

            this.onMessageClose = function (): void {
                this.saveData();
            };
            Observable.forkJoin(requests).subscribe(
                (data) => {
                    let hasNoError: boolean = true;
                    for (let i = 0; i < data.length; i++) {
                        if (data[0]['ErrorMessageDesc'] !== '') {
                            hasNoError = false;
                            this.messageService.emitMessage({
                                msg: data[0]['ErrorMessageDesc']
                            });
                            break;
                        }
                        this.saveData();
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.dispatchGeneralError(error);
                }
            );

            return;
        }

        this.saveData();
    }

    /**
     * Method - getDefaults
     * Makes HTTP call and gets data on account number change
     * Also sets the live invoice flag
     */
    public getDefaults(): void {
        this.getDefaultQuery = new URLSearchParams();
        let formData: Object = {};

        // Initialize Query
        this.getDefaultQuery = this.prepareQueryDefaults('6');

        // Initialize Form Data
        formData[this.serviceConstants.AccountNumber] = this.invoiceFormGroup.controls['AccountNumber'].value;
        if (this.invoiceFormGroup.controls['InvoiceGroupNumber'].value) {
            formData[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['InvoiceGroupNumber']] = this.invoiceFormGroup.controls['InvoiceGroupNumber'].value;
        }
        formData[this.serviceConstants.Function] = 'GetDefaults';

        // Make Calls
        this.httpService.makePostRequest(
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'],
            this.getDefaultQuery,
            formData).subscribe(
            (data) => {
                if (data.errorMessage) {
                    return;
                }
                this.store.dispatch({
                    type: InvoiceActionTypes.SAVE_DATA,
                    payload: data
                });
                this.isLiveInvoice();
            },
            (error) => {
                this.dispatchGeneralError(error);
            });
    }

    /**
     * Method - getControlValueFromStore
     * Takes store form key name and control name as parameter
     * Finds the control value from store object
     * Class property populated from store is used to find control value
     * If control not found in forms looks into dropdown collection
     */
    public getControlValueFromStore(form: string, control: string): any {
        let formControl: FormControl = this.storeFormGroup[form].controls[control];
        let dropdown = this.storeFormGroup[BillToCashConstants.c_o_STORE_KEY_NAMES['Dropdown']];

        if (formControl) {
            return formControl.value;
        }

        if (dropdown[control]) {
            return dropdown[control].selectedItem;
        }

        return '';
    }

    /**
     * Method - prepareQueryDefaults
     * Prepares common query defaults
     * Takes action as argument
     * If action not passed it will be defaulted to 0
     */
    public prepareQueryDefaults(action?: string): URLSearchParams {
        let query: URLSearchParams = new URLSearchParams();

        if (!action) {
            action = '0';
        }

        query.set(this.serviceConstants.BusinessCode,
            this.utils.getBusinessCode());
        query.set(this.serviceConstants.CountryCode,
            this.utils.getCountryCode());
        query.set(this.serviceConstants.Action, action);

        return query;
    }

    /**
     * Method - dispatchError
     * Common function to dispatch errors in the page
     * Logs error and displays error modal
     * Takes error object, error message and is log required as parameters
     * error is the raw error object passed from the error handlers
     * If error message is not passed displays general error
     * Error loggged based on if is log required passed as true
     */
    public dispatchError(payload: Object): void {
        // Set Modal On Close To noop
        this.onMessageClose = this.utils.noop;

        if (payload['isLogRequired'] && payload['error']) {
            this.logger.log(payload['error']);
        }

        if (payload['msg'] === undefined || payload['msg'] === '') {
            payload['msg'] = MessageConstant.Message.GeneralError;
        }

        this.messageService.emitMessage({
            msg: payload['msg']
        });
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
    }

    /**
     * Method - dispatchGeneralError
     * Common function dispatch service errors
     * Calls dispatchError method
     * Sends no error message so that general message is displayed
     */
    public dispatchGeneralError(error: any): void {
        let errorObject: Object = {};
        errorObject[BillToCashConstants.c_o_ERROROBJECT_KEYS.isLogRequired] = true;
        errorObject[BillToCashConstants.c_o_ERROROBJECT_KEYS.error] = error;
        this.dispatchError(errorObject);
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
    }

    /**
     * Method - saveData
     * Makes HTTP Call Save Data
     */
    public saveData(): void {
        let action = '2';
        this.invoiceQuery = new URLSearchParams();

        // Modify Parameters For Save
        if (this.storeMode['addMode']) {
            action = '1';
            this.formSaveData['Function'] = 'GetDefaults';
        }

        this.onMessageClose = this.utils.noop;
        this.invoiceQuery = this.prepareQueryDefaults(action);

        // Make Calls
        this.httpService.makePostRequest(
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'],
            BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'],
            this.invoiceQuery,
            this.formSaveData).subscribe(
            (data) => {
                if (data.InvoiceGroupNumber) {
                    this.storeFormGroup['main'].controls['InvoiceGroupNumber'].setValue(data.InvoiceGroupNumber);
                }
                if (data.ExOAMandateReference && data.ExOAMandateReference !== 'undefined') {
                    this.storeFormGroup['General'].controls['ExOAMandateReference'].setValue(data.ExOAMandateReference);
                }
                this.storeInvoice['InvoiceGroupNumber'] = data.InvoiceGroupNumber;
                this.riExchange.riInputElement.Enable(this.invoiceFormGroup, 'InvoiceGroupNumber');
                this.store.dispatch({
                    type: InvoiceActionTypes.SAVE_INVOICE,
                    payload: this.storeInvoice
                });
                if (data.errorMessage) {
                    this.dispatchError({
                        msg: data.errorMessage
                    });
                    return;
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                for (let formGroup in this.storeFormGroup) {
                    if (formGroup && formGroup !== 'dropdownComponents') {
                        this.storeFormGroup[formGroup]['markAsPristine']();
                    }
                }
                this.messageService.emitMessage({
                    msg: MessageConstant.Message.RecordSavedSuccessfully
                });
            },
            (error) => {
                this.dispatchError({
                    isLogRequired: true,
                    error: error,
                    msg: MessageConstant.Message.SaveError
                });
            });
    }

    /**
     * Method - sensitiseContactDetails
     * Enable/Disable contact details controls
     */
    public sensitiseContactDetails(disable: boolean): void {
        if (!this.storeFormGroup['AddressInvoice']) {
            return;
        }
        if (disable) {
            this.storeFormGroup['AddressInvoice'].controls['InvoiceContactName'].disable();
            this.storeFormGroup['AddressInvoice'].controls['InvoiceContactPosition'].disable();
            this.storeFormGroup['AddressInvoice'].controls['InvoiceContactDepartment'].disable();
            this.storeFormGroup['AddressInvoice'].controls['InvoiceContactMobile'].disable();
            this.storeFormGroup['AddressInvoice'].controls['InvoiceContactPosition'].disable();
            this.storeFormGroup['AddressInvoice'].controls['InvoiceContactTelephone'].disable();
            this.storeFormGroup['AddressInvoice'].controls['InvoiceContactFax'].disable();
            this.storeFormGroup['AddressInvoice'].controls['InvoiceContactEmail'].disable();

            this.storeFormGroup['AddressStatement'].controls['StatementContactName'].disable();
            this.storeFormGroup['AddressStatement'].controls['StatementContactPosition'].disable();
            this.storeFormGroup['AddressStatement'].controls['StatementContactDepartment'].disable();
            this.storeFormGroup['AddressStatement'].controls['StatementContactMobile'].disable();
            this.storeFormGroup['AddressStatement'].controls['StatementContactPosition'].disable();
            this.storeFormGroup['AddressStatement'].controls['StatementContactTelephone'].disable();
            this.storeFormGroup['AddressStatement'].controls['StatementContactFax'].disable();
            this.storeFormGroup['AddressStatement'].controls['StatementContactEmail'].disable();
        } else {
            this.storeFormGroup['AddressInvoice'].controls['InvoiceContactName'].enable();
            this.storeFormGroup['AddressInvoice'].controls['InvoiceContactPosition'].enable();
            this.storeFormGroup['AddressInvoice'].controls['InvoiceContactDepartment'].enable();
            this.storeFormGroup['AddressInvoice'].controls['InvoiceContactMobile'].enable();
            this.storeFormGroup['AddressInvoice'].controls['InvoiceContactPosition'].enable();
            this.storeFormGroup['AddressInvoice'].controls['InvoiceContactTelephone'].enable();
            this.storeFormGroup['AddressInvoice'].controls['InvoiceContactFax'].enable();
            this.storeFormGroup['AddressInvoice'].controls['InvoiceContactEmail'].enable();

            this.storeFormGroup['AddressStatement'].controls['StatementContactName'].enable();
            this.storeFormGroup['AddressStatement'].controls['StatementContactPosition'].enable();
            this.storeFormGroup['AddressStatement'].controls['StatementContactDepartment'].enable();
            this.storeFormGroup['AddressStatement'].controls['StatementContactMobile'].enable();
            this.storeFormGroup['AddressStatement'].controls['StatementContactPosition'].enable();
            this.storeFormGroup['AddressStatement'].controls['StatementContactTelephone'].enable();
            this.storeFormGroup['AddressStatement'].controls['StatementContactFax'].enable();
            this.storeFormGroup['AddressStatement'].controls['StatementContactEmail'].enable();
        }
    }

    // Events
    /**
     * Method - onAccountNumberReceived
     * Gets executed when Account Number is selected from ellipsis modal
     */
    public onAccountNumberReceived(data: any): void {
        let accountNumber = data['AccountNumber'];
        let accountName = data['AccountName'];

        // Set Account Number
        this.invoiceFormGroup.controls['AccountNumber'].setValue(accountNumber);
        this.invoiceFormGroup.controls['AccountName'].setValue(accountName);

        // Update Syschars And Modify Controls
        this.getSysChar();

        // Set Flag In Store; So That InvoiceGroupGrid Service Is Not Sending Too Many Requests
        this.storeInvoice[this.serviceConstants.AccountNumber] = accountNumber;
        this.storeInvoice['AccountName'] = accountName;
        this.storeInvoice[BillToCashConstants.c_o_STORE_KEY_NAMES['AccountNumberChanged']] = true;

        this.store.dispatch({
            type: InvoiceActionTypes.SAVE_INVOICE,
            payload: this.storeInvoice
        });
        // Update ellipsis
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber[this.serviceConstants.AccountNumber] = accountNumber;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountName'] = accountName;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountNumberChanged'] = true;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['parentMode'] = 'InvoiceGroupMaintenance';
        this.invoiceGroupEllipsis.childConfigParams = this.ellipsisQueryParams.inputParamsInvoiceGroupNumber;

        // Enable Invoice Group Number Ellipsis
        this.invoiceFormGroup.controls['InvoiceGroupNumber'].setValue('');
        for (let formGroup in this.storeFormGroup) {
            if (!formGroup || formGroup === 'main') {
                continue;
            }
            if (formGroup === 'dropdownComponents') {
                this.storeFormGroup['dropdownComponents']['InvoiceIssueTypeCode'].isFirstItemSelected = true;
                this.storeFormGroup['dropdownComponents']['InvoiceIssueTypeCode'].isDisabled = true;
                continue;
            }
            this.storeFormGroup[formGroup].reset();
            this.storeFormGroup[formGroup].disable();
        }
        this.isInvoiceGroupNumberDisabled = false;
        this.invoiceFormGroup.controls['InvoiceGroupNumber'].enable();
    }

    public onInvoiceGroupNumberChange(): void {
        this.onInvoiceGroupNumberReceived();
    }

    /**
     * Method - onInvoiceGroupNumberReceived
     * Gets executed when Invoice Group Number is selected from ellipsis modal
     */
    public onInvoiceGroupNumberReceived(data?: any): void {
        //let invoiceGroupNumber: string = data && data['Number'] ? data['Number'] : this.riExchange.riInputElement.GetValue(this.invoiceFormGroup, 'InvoiceGroupNumber');
        let invoiceGroupNumber: string = '';
        if (data) {
            if (data['Number']) {
                invoiceGroupNumber = data['Number'];
            } else if (data['trRowData'] && data['trRowData'][0]) {
                invoiceGroupNumber = data['trRowData'][0].text;
            } else {
                invoiceGroupNumber = this.riExchange.riInputElement.GetValue(this.invoiceFormGroup, 'InvoiceGroupNumber');
            }
        } else {
            invoiceGroupNumber = this.riExchange.riInputElement.GetValue(this.invoiceFormGroup, 'InvoiceGroupNumber');
        }

        if (!invoiceGroupNumber) {
            for (let formGroup in this.storeFormGroup) {
                if (!formGroup || formGroup === 'main') {
                    continue;
                }
                if (formGroup === 'dropdownComponents') {
                    this.storeFormGroup['dropdownComponents']['InvoiceIssueTypeCode'].isFirstItemSelected = true;
                    this.storeFormGroup['dropdownComponents']['InvoiceIssueTypeCode'].isDisabled = true;
                    continue;
                }
                this.storeFormGroup[formGroup].reset();
                this.storeFormGroup[formGroup].disable();
            }
            this.disableForm = true;
            this.store.dispatch({
                type: InvoiceActionTypes.DISABLE_FORMS
            });
            return;
        }

        // If parentMode Is Set To 'SearchAddress'
        if (this.requestedAddressType && this.requestedAddressType === 'Invoice') {
            this.storeSentFromParent[this.serviceConstants.AccountNumber] = this.invoiceFormGroup.controls['AccountNumber'].value;
            this.storeSentFromParent['InvoiceGroupNumber'] = invoiceGroupNumber;
            this.store.dispatch({
                type: InvoiceActionTypes.SEND_DATA_FROM_PARENT,
                payload: this.storeSentFromParent
            });
            this.store.dispatch({
                type: InvoiceActionTypes.ADDRESS_DATA_RECEIVED
            });
            this.requestedAddressType = '';
            this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['parentMode'] = 'InvoiceGroupMaintenance';
            return;
        }

        // Set Invoice Group Number
        this.invoiceFormGroup.controls['InvoiceGroupNumber'].setValue(invoiceGroupNumber);
        this.storeInvoice['InvoiceGroupNumber'] = invoiceGroupNumber;
        // Set Invoice Group Description If Form Group Is Avaialable
        if (data && data['Description'] && this.storeFormGroup['General']) {
            this.storeFormGroup['General'].controls['InvoiceGroupDesc'].setValue(data['Description']);
        }

        // Set Mode
        this.storeMode = this.updateFormMode('updateMode');
        this.invoiceFormGroup.controls['InvoiceGroupNumber'].setValidators(Validators.required);
        this.invoiceGroupNumberShowHide = true;
        this.store.dispatch({
            type: InvoiceActionTypes.SAVE_MODE,
            payload: this.storeMode
        });

        // If Both Account And Invoice Details Are Present Make HTTP Call Fetch Details
        if (!this.getControlValueFromStore('main', this.serviceConstants.AccountNumber)
            || !this.getControlValueFromStore('main', 'InvoiceGroupNumber')) {
            return;
        }

        // Get Invoice Data
        this.ajaxSource.next(this.ajaxconstant.START);
        this.getInvoiceData().subscribe((data) => {
            if (data.errorMessage) {
                let errorObject: Object = {};
                errorObject[BillToCashConstants.c_o_ERROROBJECT_KEYS.message] = data.errorMessage;
                this.dispatchError(errorObject);
                return;
            }
            this.store.dispatch({
                type: InvoiceActionTypes.SAVE_DATA,
                payload: data
            });
        }, (error) => {
            this.dispatchGeneralError(error);
        });
    }

    public onInvoiceDataReturn(): void {
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['parentMode'] = 'InvoiceGroupMaintenance';
    }

    /**
     * Method - onAccountNumberChange
     * Executes when account number is changed
     */
    public onAccountNumberChange(): void {
        let accountNumber: string = this.invoiceFormGroup.controls['AccountNumber'].value;
        let accountName: string = '';//this.invoiceFormGroup.controls['AccountName'].value;
        let invoiceGroupNumber: string = this.invoiceFormGroup.controls['InvoiceGroupNumber'].value;
        let lookupAccountNameData: Array<Object> = [{}];

        this.isInvoiceGroupNumberDisabled = false;
        this.invoiceFormGroup.controls['AccountName'].setValue('');
        this.invoiceTabs.tabFocusTo(0);

        // Do Not Format If Null Or Length Is Same As Default
        if (!accountNumber) {
            this.isInvoiceGroupNumberDisabled = true;
            this.invoiceFormGroup.controls['InvoiceGroupNumber'].setValue('');
            this.invoiceFormGroup.controls['InvoiceGroupNumber'].disable();
            for (let formGroup in this.storeFormGroup) {
                if (!formGroup || formGroup === 'main') {
                    continue;
                }
                if (formGroup === 'dropdownComponents') {
                    this.storeFormGroup['dropdownComponents']['InvoiceIssueTypeCode'].isFirstItemSelected = true;
                    this.storeFormGroup['dropdownComponents']['InvoiceIssueTypeCode'].isDisabled = true;
                    continue;
                }
                this.storeFormGroup[formGroup].reset();
                this.storeFormGroup[formGroup].disable();
            }
            this.disableForm = true;
            this.store.dispatch({
                type: InvoiceActionTypes.DISABLE_FORMS
            });
            this.cbbService.disableComponent(false);
            return;
        }
        if (accountNumber.length === this.globalConstant.AppConstants['defaultFormatSize']) {
            return;
        }

        accountNumber = this.utils.fillLeadingZeros(accountNumber);
        this.invoiceFormGroup.controls['InvoiceGroupNumber'].enable();

        this.invoiceFormGroup.controls['AccountNumber'].setValue(accountNumber);
        this.storeInvoice[this.serviceConstants.AccountNumber] = accountNumber;
        this.storeInvoice[BillToCashConstants.c_o_STORE_KEY_NAMES['AccountNumberChanged']] = true;
        // Update ellipsis
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber[this.serviceConstants.AccountNumber] = accountNumber;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountName'] = accountName;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountNumberChanged'] = true;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['parentMode'] = 'InvoiceGroupMaintenance';
        this.invoiceGroupEllipsis.childConfigParams = this.ellipsisQueryParams.inputParamsInvoiceGroupNumber;

        this.store.dispatch({
            type: InvoiceActionTypes.SAVE_INVOICE,
            payload: this.storeInvoice
        });

        // Enable Invoice Group Number Ellipsis
        this.invoiceFormGroup.controls['InvoiceGroupNumber'].setValue('');
        for (let formGroup in this.storeFormGroup) {
            if (!formGroup || formGroup === 'main') {
                continue;
            }
            if (formGroup === 'dropdownComponents') {
                this.storeFormGroup['dropdownComponents']['InvoiceIssueTypeCode'].isFirstItemSelected = true;
                this.storeFormGroup['dropdownComponents']['InvoiceIssueTypeCode'].isDisabled = true;
                continue;
            }
            this.storeFormGroup[formGroup].reset();
            this.storeFormGroup[formGroup].disable();
        }
        this.isInvoiceGroupNumberDisabled = false;

        lookupAccountNameData = [{
            'table': 'Account',
            'query': { 'AccountNumber': accountNumber },
            'fields': ['AccountName']
        }];

        this.ajaxSource.next(this.ajaxconstant.START);
        this.prepareLookup(lookupAccountNameData, '1').subscribe(
            data => {
                if (!data.results || !data.results[0].length) {
                    this.dispatchError({
                        msg: MessageConstant.Message.RecordNotFound
                    });
                    return;
                }
                let accountName: string = data.results[0][0].AccountName;
                this.invoiceFormGroup.controls['AccountName'].setValue(accountName);
                this.storeInvoice['AccountName'] = accountName;

                this.ellipsisQueryParams.inputParamsInvoiceGroupNumber[this.serviceConstants.AccountNumber] = accountNumber;
                this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountName'] = accountName;
                this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountNumberChanged'] = true;
                this.invoiceGroupEllipsis.childConfigParams = this.ellipsisQueryParams.inputParamsInvoiceGroupNumber;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                this.store.dispatch({
                    type: InvoiceActionTypes.SAVE_INVOICE,
                    payload: this.storeInvoice
                });
            },
            error => {
                this.dispatchGeneralError(error);
            }
        );
    }

    /**
     * Method - onDropdownMenuChange
     * Executes on dropdown menu change
     */
    public onDropdownMenuChange(selectedItem: any): void {
        // Navigate Based On The Menu Selection
        switch (selectedItem) {
            case 'Contact Details - Invoice':
                this.navigateAway('ContactDetailsInv');
                break;
            case 'Contact Details - Statement':
                this.navigateAway('ContactDetailsStat');
                break;
            case 'Show Premises':
                this.isPremisesSearchHidden = false;
                this.ellipsisQueryParams.inputParamsPremiseSearch = {
                    parentMode: 'InvoiceGroup',
                    AccountNumber: this.storeInvoice[this.serviceConstants.AccountNumber],
                    AccountName: this.storeInvoice['AccountName'],
                    InvoiceGroupNumber: this.storeInvoice['InvoiceGroupNumber'],
                    showAddNew: true
                };
                this.premiseSearchEllipsis.childConfigParams = this.ellipsisQueryParams.inputParamsPremiseSearch;
                this.premiseSearchEllipsis.openModal();
                break;
            case 'Add Premises':
                this.router.navigate([InternalMaintenanceSalesModuleRoutes.ICABSAINVOICEGROUPPREMISEMAINTENANCE], {
                    queryParams: {
                        parentMode: 'InvoiceGroup',
                        AccountNumber: this.riExchange.riInputElement.GetValue(this.invoiceFormGroup, 'AccountNumber'),
                        InvoiceGroupNumber: this.riExchange.riInputElement.GetValue(this.invoiceFormGroup, 'InvoiceGroupNumber')
                    }
                });
                break;
            case 'Invoice Narrative':
                this.router.navigate([InternalMaintenanceSalesModuleRoutes.ICABSAINVOICENARRATIVEMAINTENANCE], {
                    queryParams: {
                        parentMode: 'InvoiceGroup',
                        currentContractTypeURLParameter: '',
                        ContractNumber: '',
                        AccountNumber: this.riExchange.riInputElement.GetValue(this.invoiceFormGroup, 'AccountNumber'),
                        PremiseNumber: '',
                        InvoiceGroupNumber: this.riExchange.riInputElement.GetValue(this.invoiceFormGroup, 'InvoiceGroupNumber'),
                        InvoiceNarrativeText: '',
                        backLabel: 'Invoice Group Maintenance',
                        backRoute: '#/billtocash/maintenance/invoicegroup/search?fromMenu=true'
                    }
                });
                break;
            case 'Invoice History':
                this.router.navigate(['/billtocash/contract/invoice'], {
                    queryParams: {
                        parentMode: 'Account',
                        AccountNumber: this.invoiceFormGroup.controls['AccountNumber'].value,
                        AccountName: this.invoiceFormGroup.controls['AccountName'].value
                    }
                });
                break;
            case 'Mandate Reference':
                this.messageService.emitMessage({
                    msg: 'Page Under Construction'
                });
                break;
        }
    }

    /**
     * Method - saveInvoiceGroupData
     * Executes on click of save button
     */
    public saveInvoiceGroupData(): void {
        let isValid: boolean = true;
        let parameterName: string;
        let value: string = '';
        let tabToFocus: number = -1;

        this.formSaveData = {};

        /**
         * Traverse the store formGroup object
         * Validate every form in the page including tabs
         * Mark invalid form controls
         * If all the forms are valid proceed with save
         */
        for (let formGroup in this.storeFormGroup) {
            if (!formGroup) {
                continue;
            }
            if (formGroup === 'dropdownComponents') {
                let dropdownGroup: any = this.storeFormGroup[formGroup];
                for (let dropdown in dropdownGroup) {
                    if (!dropdown || dropdown === 'InvoiceIssueTypeCode') {
                        continue;
                    }
                    parameterName = (this.paramsWithDifferentNames[dropdown] || dropdown);
                    this.formSaveData[parameterName] = dropdownGroup[dropdown].selectedItem;
                    dropdownGroup[dropdown].isValid = true;
                    if (!dropdownGroup[dropdown].selectedItem) {
                        dropdownGroup[dropdown].isValid = false;
                    }
                }
                continue;
            }
            let formGroupControls = this.storeFormGroup[formGroup].controls;
            for (let control in formGroupControls) {
                if (!control) {
                    continue;
                }
                let formControl = formGroupControls[control];
                // If In Not To Save List Do Not Add In Save Data
                if (this.fieldsNotToSave.indexOf(control) < 0) {
                    parameterName = (this.paramsWithDifferentNames[control] || control);
                    // If Capitialize Required Capitialize And Set Value
                    value = this.sysCharParams['vSCCapitalFirstLtr'] && formControl.value && (typeof formControl.value === 'string')
                        ? this.utils.capitalizeFirstLetter(formControl.value) : formControl.value;
                    formControl.setValue(value);
                    this.formSaveData[parameterName] = value || '';
                    // If Value Is true/false Convert to Yes/No
                    if (typeof formControl.value === 'boolean') {
                        this.formSaveData[control] = this.utils.convertCheckboxValueToRequestValue(formControl.value);
                    }
                }
                if (formControl.invalid) {
                    if (formGroup !== this.storeFormValidKey && tabToFocus === -1) {
                        tabToFocus = this.tabNameList.indexOf(formGroup);
                    }
                    isValid = false;
                    formControl.markAsTouched();
                }
            }
        }

        if (!isValid) {
            this.invoiceTabs.tabFocusTo(tabToFocus);
            return;
        }
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        this.promptConfirm = function (event: any): void {
            this.validateForms();
        };
        this.promptConfirmModal.show();
    }

    /**
     * Method - resetForm
     * Executes on click of cancel button
     */
    public resetForm(): void {
        /*
         * Reset forms if data is fetched
         * Will be a case when user directly clicks add button.
         */
        if (!this.storeData) {
            for (let formGroup in this.storeFormGroup) {
                if (!formGroup || formGroup === 'main') {
                    continue;
                }
                if (formGroup === 'dropdownComponents') {
                    continue;
                }
                this.storeFormGroup[formGroup].reset();
            }
            return;
        }

        /*
         * Execute logic if  data is fetched and add clicked
         * Reset to previous data
         */
        this.invoiceFormGroup.controls['InvoiceGroupNumber'].setValue(this.storeData['InvoiceGroupNumber']);
        this.store.dispatch({
            type: InvoiceActionTypes.RESET_FORMS
        });
    }

    public promptConfirm(event: any): void {
        this.validateForms();
    }

    public onPremiseSearchClose(): void {
        this.menuDropDown.selectedItem = 'Options';
        this.isPremisesSearchHidden = true;
    }

    public onSaveFocus(e: any): void {
        let nextTab: number = 0;
        let code = (e.keyCode ? e.keyCode : e.which);
        let elemList = document.querySelectorAll('.tab-container .nav-tabs li a');
        let currentSelectedIndex = Array.prototype.indexOf.call(elemList, document.querySelector('.tab-container .nav-tabs li a.active'));
        if (code === 9 && currentSelectedIndex < (elemList.length - 1)) {
            let click = new CustomEvent('click', { bubbles: true });
            nextTab = currentSelectedIndex + 1;
            this.invoiceTabs.tabFocusTo(nextTab);
            setTimeout(() => {
                document.querySelector('.tab-container .tab-content .tab-pane:nth-child(' + nextTab + ') .ui-select-toggle, .tab-container .tab-content .tab-pane.active input:not([disabled]), .tab-container .tab-content .tab-pane.active select:not([disabled])')['focus']();
            }, 100);
        }
        return;
    }

    /**
     * Method - onMessageClose
     * Execute on close of modal
     */
    // tslint:disable-next-line:no-empty
    public onMessageClose(): void {
    }

    public canDeactivate(): Observable<boolean> {
        let isDirty: boolean = this.storeFormGroup['AddressInvoice'].dirty
            || this.storeFormGroup['AddressStatement'].dirty
            || this.storeFormGroup['General'].dirty
            || this.storeFormGroup['EDIInvoicing'].dirty;
        this.routeAwayGlobals.setSaveEnabledFlag(isDirty);
        this.routeAwayComponent.promptModal.cancelEmit.subscribe(data => {
            this.menuDropDown.selectedItem = 'Options';
        });
        if (this.routeAwayComponent) {
            return this.routeAwayComponent.canDeactivate();
        }
    }

    public getTranslatedValue(key: any, params?: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }
    }
}
