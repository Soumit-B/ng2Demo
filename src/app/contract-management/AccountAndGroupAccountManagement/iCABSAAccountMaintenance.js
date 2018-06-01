import { setTimeout } from 'timers';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { CBBService } from './../../../shared/services/cbb.service';
import { RiExchange } from './../../../shared/services/riExchange';
import { MessageConstant } from './../../../shared/constants/message.constant';
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
import { Component, NgZone, ViewChild, Renderer } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PostCodeSearchComponent } from '../../internal/search/iCABSBPostcodeSearch.component';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { AccountGroupSearchComponent } from '../../internal/search/iCABSAAccountGroupSearch';
import { Store } from '@ngrx/store';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/Rx';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
export var AccountMaintenanceComponent = (function () {
    function AccountMaintenanceComponent(router, route, componentInteractionService, zone, httpService, fb, serviceConstants, errorService, messageService, authService, ajaxconstant, titleService, sysCharConstants, store, logger, translate, ls, http, translateService, speedScriptConstants, utilService, routeAwayGlobals, riExchange, cbbService, renderer) {
        var _this = this;
        this.router = router;
        this.route = route;
        this.componentInteractionService = componentInteractionService;
        this.zone = zone;
        this.httpService = httpService;
        this.fb = fb;
        this.serviceConstants = serviceConstants;
        this.errorService = errorService;
        this.messageService = messageService;
        this.authService = authService;
        this.ajaxconstant = ajaxconstant;
        this.titleService = titleService;
        this.sysCharConstants = sysCharConstants;
        this.store = store;
        this.logger = logger;
        this.translate = translate;
        this.ls = ls;
        this.http = http;
        this.translateService = translateService;
        this.speedScriptConstants = speedScriptConstants;
        this.utilService = utilService;
        this.routeAwayGlobals = routeAwayGlobals;
        this.riExchange = riExchange;
        this.cbbService = cbbService;
        this.renderer = renderer;
        this.accounthistorygrid = AccountHistoryGridComponent;
        this.inputParamsAccHistory = { 'parentMode': 'Account' };
        this.ajaxSource = new BehaviorSubject(0);
        this.accountSearchComponent = AccountSearchComponent;
        this.isRequesting = false;
        this.hideEllipsis = false;
        this.autoOpen = '';
        this.autoOpenSearch = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.addBtn = true;
        this.updateBtn = true;
        this.searchBtn = true;
        this.fetchBtn = false;
        this.saveBtn = false;
        this.isSaveDisabled = false;
        this.method = 'contract-management/maintenance';
        this.module = 'account';
        this.operation = 'Application/iCABSAAccountMaintenance';
        this.contentType = 'application/x-www-form-urlencoded';
        this.addNew = true;
        this.query = new URLSearchParams();
        this.queryLookUp = new URLSearchParams();
        this.querySysChar = new URLSearchParams();
        this.queryAccount = new URLSearchParams();
        this.searchModalRoute = '';
        this.searchPageRoute = '';
        this.showHeader = true;
        this.showCloseButton = true;
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.options = '';
        this.promptContent = '';
        this.inputParams = {
            'parentMode': 'LookUp-Search',
            'businessCode': '',
            'countryCode': '',
            'BranchNumber': '',
            'lstBranchSelection': '',
            'AccountNumber': '',
            'showAddNewDisplay': true
        };
        this.defaultCode = {
            country: '',
            business: '',
            BranchNumber: ''
        };
        this.translatedMessageList = {
            'message1': '',
            'message2': ''
        };
        this.updateMode = false;
        this.addMode = false;
        this.searchMode = false;
        this.showControlBtn = true;
        this.parentMode = '';
        this.DataBlockfromparent = {
            'GroupAccountNumber': '2',
            'GroupName': 'GroupName from Account Maintenance Page'
        };
        this.fieldDisabled = {
            'BtnSendToNAV': false,
            'cmdGetAddress': false,
            'cmdSetInvoiceGroupDefault': false,
            'cmdSetInvoiceGroupEDI': false,
            'selMandateTypeCode': false,
            'cmdGenerateNew': false
        };
        this.fieldVisibility = {
            'menuControl': true,
            'AccountOwningBranch': true,
            'tdCustomerInfo': false,
            'tdBadDebtAccount': false,
            'tdPNOL': false
        };
        this.fieldRequired = {
            'isAccountNumberRequired': true,
            'isAccountNameRequired': true,
            'isAccountOwningBranchRequired': true
        };
        this.virtualTableField = {
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
        this.otherParams = {
            'glAllowUserAuthUpdate': false,
            'cEmployeeLimitChildDrillOptions': ''
        };
        this.pageParams = {
            'CancelEvent': false,
            'lastTabIndex': 0
        };
        this.sysCharParams = {
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
        this.tabName = {
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
        this.dropdown = {
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
        this.ttMandateType = [];
        this.initializeData = true;
        this.AccountGroupComponent = AccountGroupSearchComponent;
        this.dynamicComponent = PostCodeSearchComponent;
        this.queryParamValues = {};
        this.modalTitle = '';
        this.isAccountNumberEllipsisDisabled = false;
        this.lastActivatedTabIndex = 0;
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
        this.tabs = [
            { title: 'Address', active: true },
            { title: 'Account Management', disabled: false },
            { title: 'General', removable: false },
            { title: 'Bank Details', customClass: '' },
            { title: 'EDI Invoicing', customClass: '' },
            { title: 'Invoice Text', customClass: '' },
            { title: 'Telesales', customClass: '' },
            { title: 'Discounts', customClass: '' }
        ];
        this.componentList = [AddressComponent, AccountManagementComponent, GeneralComponent, BankDetailsComponent, EDIInvoicingComponent, InvoiceTextComponent, TelesalesComponent, DiscountsComponent];
        this.optionsList = [
            { title: '', list: ['Options'] },
            { title: 'Portfolio', list: ['Premises Details', 'Service Covers', 'Account Information', 'Telesales Order'] },
            { title: 'History', list: ['History', 'Event History'] },
            { title: 'Invoicing', list: ['Pro Rata Charge', 'Invoice Narrative', 'Invoice Charge', 'Invoice History'] },
            { title: 'Service', list: ['Product Summary', 'Static Visits (SOS)', 'Visit Summary', 'Service Recommendations', 'State of Service', 'Visit Tolerances', 'Infestation Tolerances'] },
            { title: 'Customer Relations', list: ['Contact Management', 'Contact Centre Search', 'Customer Information', 'Prospect Conversion'] }
        ];
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
        this.storeSubscription = store.select('accountMaintenance').subscribe(function (data) {
            _this.storeData = data;
            if (data && data['action']) {
                switch (data['action']) {
                    case AccountMaintenanceActionTypes.SAVE_DATA:
                        if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                            _this.accountData = data['data'];
                            _this.setFormData(data);
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_ACCOUNT:
                        if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                            _this.accountData = data['data'];
                            _this.setFormData(data);
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_MODE:
                        if (data['mode'] && !(Object.keys(data['mode']).length === 0 && data['mode'].constructor === Object)) {
                            _this.addMode = data['mode'].addMode;
                            _this.updateMode = data['mode'].updateMode;
                            _this.searchMode = data['mode'].searchMode;
                            _this.processForm();
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_SYSCHAR:
                        _this.sysCharParams = data['syschars'];
                        _this.processSysChar(true);
                        break;
                    case AccountMaintenanceActionTypes.SAVE_PROCESSED_SYSCHAR:
                        if (data['processedSysChar']) {
                            _this.sysCharParams = data['processedSysChar'];
                            _this.initPage();
                            if (_this.parentMode) {
                                _this.getParentModeData();
                            }
                            else if (_this.initializeData === true) {
                                if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                                    _this.initializeData = false;
                                    _this.initializeFormData();
                                }
                            }
                        }
                        break;
                    case AccountMaintenanceActionTypes.FORM_INIT:
                        _this.initPage();
                        break;
                    case AccountMaintenanceActionTypes.SAVE_SENT_FROM_PARENT:
                        _this.sentFromParent = data['sentFromParent'];
                        break;
                    case AccountMaintenanceActionTypes.FORM_VALIDITY:
                        break;
                    case AccountMaintenanceActionTypes.SAVE_OTHER_PARAMS:
                        break;
                    case AccountMaintenanceActionTypes.SUBMIT_FORM_VALIDITY:
                        if (data && data['formValidity']) {
                            _this.tabsError = {
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
                                data['formValidity'].discounts) {
                                _this.storeData['otherParams'].CancelEvent = false;
                                _this.resetErrorTab();
                                _this.riMaintenance_BeforeSave().subscribe(function (e) {
                                    if (_this.storeData['otherParams'].CancelEvent === false) {
                                        _this.promptTitle = MessageConstant.Message.ConfirmRecord;
                                        _this.promptModal.show();
                                    }
                                });
                            }
                            else {
                                _this.showErrorTab();
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        });
        this.storeSubscriptionAddressChange = store.select('account').subscribe(function (data) {
            _this.parentAccountStoreData = data;
            if (data && data['action']) {
                switch (data['action']) {
                    case ActionTypes.SAVE_ACCOUNT_ROW_DATA:
                        _this.sentFromParent = data['rowData'].rowData;
                        break;
                    default:
                        break;
                }
            }
        });
        var code = {
            business: utilService.getBusinessCode(),
            country: utilService.getCountryCode()
        };
        this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_CODE, payload: code });
        this.defaultCode.country = utilService.getCountryCode();
        this.defaultCode.business = utilService.getBusinessCode();
        this.querySubscription = this.route.queryParams.subscribe(function (params) {
            _this.queryParamValues = params;
            if (params['parent']) {
                _this.parentMode = params['parent'];
            }
            if (params['Mode']) {
                _this.parentMode = params['Mode'];
            }
            if (params['parentMode']) {
                _this.parentMode = params['parentMode'];
            }
            _this.rowId = params['AccountRowID'];
        });
    }
    AccountMaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.routeAwayGlobals.setEllipseOpenFlag(false);
        String.prototype['capitalizeFirstLetter'] = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        this.lastStoreData = this.storeData;
        this.inputParams.businessCode = this.defaultCode.business;
        this.inputParams.countryCode = this.defaultCode.country;
        this.ajaxSubscription = this.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.zone.run(function () {
                    switch (event) {
                        case _this.ajaxconstant.START:
                            _this.isRequesting = true;
                            break;
                        case _this.ajaxconstant.COMPLETE:
                            _this.isRequesting = false;
                            break;
                    }
                });
            }
        });
        this.getSpeedScriptData();
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    if (data.errorMessage) {
                        _this.errorModal.show(data, true);
                    }
                });
            }
        });
        this.messageService.emitMessage(0);
        this.messageSubscription = this.messageService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                if (data && data.addMode) {
                    _this.initializeData = false;
                    _this.store.dispatch({
                        type: AccountMaintenanceActionTypes.CLEAR_DATA, payload: {}
                    });
                    _this.tabsError = {
                        tabA: false,
                        tabB: false,
                        tabC: false,
                        tabD: false,
                        tabE: false,
                        tabF: false,
                        tabG: false,
                        tabH: false
                    };
                    _this.accountData = null;
                    _this.onAdd();
                }
            }
        });
        this.routerSubscription = this.router.events.subscribe(function (event) {
            _this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_PARAMS, payload: JSON.parse(JSON.stringify(_this.inputParams)) });
            if (event.url && ((event.url.indexOf('/contractmanagement/account/maintenance/search') >= 0) || (event.url.indexOf(ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE) >= 0))) {
                if (!(_this.storeData && _this.storeData['data'] && !(Object.keys(_this.storeData['data']).length === 0 && _this.storeData['data'].constructor === Object))) {
                    _this.searchModalRoute = '';
                    if (!_this.parentMode) {
                        _this.autoOpenSearch = true;
                    }
                }
                else {
                    _this.autoOpenSearch = false;
                }
            }
        });
        try {
            this.translateService.setUpTranslation();
        }
        catch (e) {
        }
        this.translateSubscription = this.translateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
            }
        });
        this.titleService.setTitle(this.inputParams.pageTitle);
        this.dispathFormGroup();
        this.routeAwayUpdateSaveFlag();
    };
    AccountMaintenanceComponent.prototype.ngAfterViewInit = function () {
        if ((this.autoOpen === true) || (!this.storeData)) {
            if (!this.parentMode) {
                this.autoOpenSearch = true;
            }
        }
        if (this.parentMode) {
            this.autoOpenSearch = false;
        }
    };
    AccountMaintenanceComponent.prototype.dispathFormGroup = function () {
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
    };
    AccountMaintenanceComponent.prototype.getParentModeData = function () {
        this.autoOpenSearch = false;
        switch (this.parentMode) {
            case 'CallCentreSearch':
            case 'WorkOrderMaintenance':
                if (this.queryParamValues) {
                    this.saveBtn = true;
                    this.routeAwayGlobals.setSaveEnabledFlag(true);
                    this.updateMode = true;
                    this.addMode = false;
                    this.searchMode = false;
                    var param = {
                        'AccountName': this.queryParamValues['AccountName'] || '',
                        'AccountNumber': this.queryParamValues['AccountNumber'] || ''
                    };
                    this.accountFormGroup.controls['AccountNumber'].setValue(param.AccountNumber);
                    this.accountFormGroup.controls['AccountName'].setValue(param.AccountName);
                    this.loadSelectedDataRow();
                }
                this.inputParams.showAddNewDisplay = false;
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
                    var param = {
                        'AccountName': this.sentFromParent.name,
                        'AccountNumber': this.sentFromParent.number
                    };
                    this.saveBtn = true;
                    this.routeAwayGlobals.setSaveEnabledFlag(true);
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
                    this.routeAwayGlobals.setSaveEnabledFlag(true);
                    this.updateMode = true;
                    this.addMode = false;
                    this.searchMode = false;
                    var param = {
                        'AccountNumber': this.sentFromParent.number,
                        'AccountName': this.sentFromParent.name
                    };
                    this.accountFormGroup.controls['AccountNumber'].setValue(param.AccountNumber);
                    this.accountFormGroup.controls['AccountName'].setValue(param.AccountName);
                    this.loadSelectedDataRow();
                }
                else if (this.rowId) {
                    this.saveBtn = true;
                    this.routeAwayGlobals.setSaveEnabledFlag(true);
                    this.updateMode = true;
                    this.addMode = false;
                    this.searchMode = false;
                    var params = { 'ROWID': this.rowId };
                    this.loadSelectedDataRow(params);
                }
                break;
            case 'BusinessDailyTransactions':
                if (this.rowId) {
                    var params = { 'ROWID': this.rowId };
                    this.loadSelectedDataRow(params);
                }
                break;
            case 'DailyTransactions':
            case 'PDAReconciliation':
                if (this.rowId) {
                    var params = { 'ROWID': this.rowId };
                    this.loadSelectedDataRow(params);
                }
                break;
            case 'ContractPOExpiryGrid':
                this.store.dispatch({
                    type: AccountMaintenanceActionTypes.SAVE_MODE, payload: {
                        updateMode: false,
                        addMode: false,
                        searchMode: false
                    }
                });
                if (this.rowId) {
                    var params = { 'ROWID': this.rowId };
                    this.loadSelectedDataRow(params);
                }
                this.inputParams.showAddNewDisplay = false;
                break;
            case 'ProspectReport':
            case 'ActivityReport':
                if (this.rowId) {
                    var params = { 'ROWID': this.rowId };
                    this.loadSelectedDataRow(params);
                }
                break;
        }
    };
    AccountMaintenanceComponent.prototype.showErrorTab = function () {
        var _this = this;
        var tabsElemList = document.querySelectorAll('.tab-content ul li');
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
        setTimeout(function () {
            _this.showErrorTabs();
        }, 100);
    };
    AccountMaintenanceComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('Changes made to Account Address Information will not affect invoicing.', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.translatedMessageList.message_1 = res;
                }
            });
        });
        this.getTranslatedValue('The suburb, state and postcode do not match', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.translatedMessageList.message_2 = res;
                }
            });
        });
    };
    AccountMaintenanceComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    AccountMaintenanceComponent.prototype.fetchRecord = function (param) {
        var _this = this;
        if (param === void 0) { param = {}; }
        this.fetchRecordData('', param).subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (!e.errorMessage) {
                    _this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_DATA, payload: e });
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    AccountMaintenanceComponent.prototype.fetchRecordData = function (functionName, params) {
        this.queryAccount = new URLSearchParams();
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        }
        else {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }
        this.queryAccount.set(this.serviceConstants.Action, '0');
        if (functionName !== '') {
            this.queryAccount.set(this.serviceConstants.Action, '6');
            this.queryAccount.set('Function', functionName);
        }
        for (var key in params) {
            if (key) {
                this.queryAccount.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.method, this.module, this.operation, this.queryAccount);
    };
    AccountMaintenanceComponent.prototype.fetchServiceData = function (functionName, params) {
        this.queryAccount = new URLSearchParams();
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        }
        else {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }
        this.queryAccount.set(this.serviceConstants.Action, '0');
        if (functionName !== '') {
            this.queryAccount.set(this.serviceConstants.Action, '6');
            this.queryAccount.set('Function', functionName);
        }
        for (var key in params) {
            if (key) {
                this.queryAccount.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.method, this.module, this.operation, this.queryAccount);
    };
    AccountMaintenanceComponent.prototype.onAccountMaintenanceDataReceived = function (data, route) {
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
        this.routeAwayGlobals.setSaveEnabledFlag(true);
        this.updateMode = true;
        this.addMode = false;
        this.searchMode = false;
        this.setFormData(this.accountSearchData);
        this.getSpeedScriptData('UPDATE');
        this.routeAwayUpdateSaveFlag();
    };
    AccountMaintenanceComponent.prototype.loadSelectedDataRow = function (params, mode, reload) {
        var _this = this;
        if (params === void 0) { params = {}; }
        if (reload === void 0) { reload = false; }
        this.fetchAccountData('', params).subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e['errorMessage']) {
                    _this.errorService.emitError({ errorMessage: e['errorMessage'] });
                }
                else {
                    if (mode) {
                        _this.updateMode = mode.updateMode;
                        _this.addMode = mode.addMode;
                        _this.searchMode = mode.searchMode;
                    }
                    _this.store.dispatch({
                        type: AccountMaintenanceActionTypes.SAVE_MODE, payload: {
                            updateMode: _this.updateMode,
                            addMode: _this.addMode,
                            searchMode: _this.searchMode
                        }
                    });
                    _this.initializeForm();
                    _this.removeSpaceFromValue(e);
                    var dataset = { data: e };
                    _this.getVirtualTableData(dataset);
                    _this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_DATA, payload: e });
                    _this.lastActivatedTabIndex = 0;
                    _this.setLastActivatedTab();
                    _this.accountFormGroup.controls['AccountNumber'].disable();
                    _this.fieldRequired.isAccountNumberRequired = true;
                    _this.accountFormGroup.updateValueAndValidity();
                    _this.riMaintenance_BeforeMode();
                    _this.store.dispatch({
                        type: AccountMaintenanceActionTypes.BEFORE_MODE, payload: {}
                    });
                    _this.riMaintenance_AfterFetch();
                    _this.riMaintenance_BeforeUpdate();
                    if ((typeof _this.formControlAccountName !== 'undefined') && _this.formControlAccountName) {
                        setTimeout(function () {
                            _this.formControlAccountName.nativeElement.focus();
                        }, 100);
                    }
                    setTimeout(function () {
                        var elemList = document.querySelectorAll('.tab-container .nav-tabs li a');
                        for (var l = 0; l < elemList.length; l++) {
                            if (elemList[l]) {
                                _this.renderer.listen(elemList[l], 'focus', function (event) {
                                    _this.setFocusToTabElement();
                                });
                                _this.renderer.listen(elemList[l], 'click', function (event) {
                                    _this.storeData['otherParams'].lastTabIndex = _this.lastActivatedTabIndex;
                                });
                            }
                        }
                    }, 100);
                    if (reload) {
                        setTimeout(function () {
                            var tabsElemList = document.querySelectorAll('.tab-content ul li');
                            if (_this.lastStoreData && _this.lastStoreData['otherParams']) {
                                var tabIndex = _this.lastStoreData['otherParams'].lastTabIndex;
                                if (tabsElemList && tabIndex && tabIndex !== 0 && tabIndex < tabsElemList.length) {
                                    _this.riTab.tabFocusTo(tabIndex);
                                }
                            }
                        }, 200);
                    }
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    AccountMaintenanceComponent.prototype.initializeFormData = function () {
        this.initializeData = false;
        this.addMode = this.storeData['mode'].addMode;
        this.updateMode = this.storeData['mode'].updateMode;
        this.searchMode = this.storeData['mode'].searchMode;
        this.saveBtn = (this.searchMode) ? false : true;
        var searchData = {
            data: this.storeData['data']
        };
        this.setFormData(searchData);
        this.reloadPage = true;
        this.loadSelectedDataRow({}, null, this.reloadPage);
    };
    AccountMaintenanceComponent.prototype.routeOnData = function () {
        this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE]);
    };
    AccountMaintenanceComponent.prototype.TabDraw = function () {
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
    };
    AccountMaintenanceComponent.prototype.processForm = function () {
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
    };
    AccountMaintenanceComponent.prototype.setFormData = function (data) {
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
    };
    AccountMaintenanceComponent.prototype.sysCharParameters = function () {
        var sysCharList = [
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
    };
    AccountMaintenanceComponent.prototype.onSysCharDataReceive = function (e) {
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
            this.sysCharParams['vSCEnableTaxCodeDefaultingText'] = e.records[17].Required ? e.records[17].Required : false;
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
    };
    AccountMaintenanceComponent.prototype.fetchSysChar = function (sysCharNumbers) {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.querySysChar.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        }
        else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            this.querySysChar.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    };
    AccountMaintenanceComponent.prototype.processSysChar = function (mode) {
        var _this = this;
        if (mode === void 0) { mode = false; }
        if (this.sysCharParams['vRequired'] && this.sysCharParams['vSCEnableTaxCodeDefaultingText']) {
            var lookupValues = JSON.stringify(this.sysCharParams['vSCEnableTaxCodeDefaultingText']).split(',');
            if (lookupValues && lookupValues.find(function (obj) { return obj === '5'; })) {
                this.sysCharParams['vSCEnableTaxCodeDefaulting'] = true;
            }
        }
        else {
            this.sysCharParams['vSCEnableTaxCodeDefaulting'] = false;
        }
        if (!this.sysCharParams['vSCEnableTaxCodeDefaulting']) {
            this.sysCharParams['vSCEnableTaxCodeDefaulting'] = false;
        }
        this.getRegistrySetting('Contact Centre Review', this.storeData['code'].business + '_' + 'System Default Review From Drill Option')
            .subscribe(function (d) {
            _this.sysCharParams['gcRegContactCentreReview'] = d;
        });
        if (!this.sysCharParams['vSCEnableAddressLine3']) {
            this.sysCharParams['vDisableFieldList'] = this.sysCharParams['vDisableFieldList'] + 'DisableAddressLine3';
        }
        this.sysCharParams['vbEnableValidatePostcodeSuburb'] = this.sysCharParams['vSCEnableValidatePostcodeSuburb'] ? true : false;
        this.sysCharParams['vbEnablePostcodeSuburbLog'] = this.sysCharParams['vSCEnablePostcodeSuburbLog'] ? true : false;
        this.sysCharParams['lRegContactCentreReview'] = (this.sysCharParams['gcRegContactCentreReview'] === 'Y') ? true : false;
        this.sysCharParams['vEnablePostcodeDefaulting'] = this.sysCharParams['vEnablePostcodeDefaulting'] ? true : false;
        this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_PROCESSED_SYSCHAR, payload: this.sysCharParams });
    };
    AccountMaintenanceComponent.prototype.getSpeedScriptTableData = function () {
        var _this = this;
        var userCode = this.authService.getSavedUserCode();
        var CNFContactPersonRegSection = this.speedScriptConstants.CNFContactPersonRegSection;
        var data = [
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
        this.lookUpRecord(data, 5).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0]) {
                    _this.sysCharParams['vDefaultCountryCode'] = e['results'][0][0].riCountryCode;
                    _this.sysCharParams['vBankAccountFormatCode'] = e['results'][0][0].BankAccountFormatCode;
                }
                if (e['results'][1] && e['results'][1].length > 0) {
                    _this.sysCharParams['glAllowUserAuthUpdate'] = e['results'][1][0].AllowUpdateOfContractInfoInd;
                }
                else {
                    var error = '2 - UserAuthority';
                }
                if (e['results'][2] && e['results'][2].length > 0) {
                    _this.sysCharParams['vSCMultiContactInd'] = true;
                }
                else {
                    _this.sysCharParams['vSCMultiContactInd'] = false;
                }
                if (e['results'][3] && e['results'][3].length > 0) {
                    for (var i = 0; i < e['results'][0].length; i++) {
                        if (e['results'][0][i].CurrentBranchInd) {
                            _this.defaultCode.branchNumber = e['results'][0][i].BranchNumber;
                            break;
                        }
                    }
                }
            }
            _this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_PROCESSED_SYSCHAR, payload: JSON.parse(JSON.stringify(_this.sysCharParams)) });
        }, function (error) {
            _this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_PROCESSED_SYSCHAR, payload: JSON.parse(JSON.stringify(_this.sysCharParams)) });
        });
    };
    AccountMaintenanceComponent.prototype.getRegistrySetting = function (pcRegSection, pcRegKey) {
        var cValue = new ReplaySubject(1);
        var data = [
            {
                'table': 'riRegistry',
                'query': { 'RegSection': pcRegSection, 'RegKey': pcRegKey },
                'fields': ['RegValue', 'RegSection']
            }
        ];
        this.lookUpRecord(data, 5).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                cValue = e['results'][0].RegValue;
            }
        }, function (error) {
        });
        return cValue;
    };
    AccountMaintenanceComponent.prototype.createMandateTypeTempData = function (addMode) {
        var _this = this;
        var userCode = this.authService.getSavedUserCode();
        var gLanguageCode = this.riExchange.LanguageCode();
        var data = [
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
        this.lookUpRecord(data, 500).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'] && e['results'][0].length > 0) {
                    var SEPAMandateType = e['results'][0];
                    var SEPAMandateTypeLang_1 = [];
                    if (e['results'].length > 1 && e['results'][1].length > 0) {
                        SEPAMandateTypeLang_1 = e['results'][1];
                    }
                    SEPAMandateType.forEach(function (item) {
                        var filterData = SEPAMandateTypeLang_1.find(function (langObj) { return ((langObj.BusinessCode === item.BusinessCode)
                            && (langObj.MandateTypeCode === item.MandateTypeCode)); });
                        _this.ttMandateType.push({
                            'MandateTypeCode': item.MandateTypeCode,
                            'MandateTypeDesc': (filterData) ? filterData.MandateTypeDesc : item.MandateTypeDesc
                        });
                        if (item.DefaultInd === true) {
                            _this.sysCharParams['vDefaultMandateType'] = item.MandateTypeCode;
                        }
                    });
                }
                if (_this.ttMandateType && _this.ttMandateType.length > 0) {
                    _this.utilService.sortByKey(_this.ttMandateType, 'MandateTypeDesc');
                    _this.sysCharParams['ttMandateType'] = _this.ttMandateType;
                }
            }
        }, function (error) {
        });
    };
    AccountMaintenanceComponent.prototype.getSpeedScriptData = function (mode) {
        var _this = this;
        if (mode === void 0) { mode = ''; }
        var userCode = this.authService.getSavedUserCode();
        var CNFContactPersonRegSection = this.speedScriptConstants.CNFContactPersonRegSection;
        var gLanguageCode = this.riExchange.LanguageCode();
        var data = [
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
        var data2 = [
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
        var data3 = [
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
        var sysCharNumbers = this.sysCharParameters();
        this.ajaxSource.next(this.ajaxconstant.START);
        Observable.forkJoin(this.lookUpRecord(data, 500), this.lookUpRecord(data2, 10), this.lookUpRecord(data3, 10), this.fetchSysChar(sysCharNumbers)).subscribe(function (e) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (e[0]['results'] && e[0]['results'].length > 0) {
                if (e[0]['results'] && e[0]['results'][0].length > 0) {
                    var SEPAMandateType = e[0]['results'][0];
                    var SEPAMandateTypeLang_2 = [];
                    if (e[0]['results'].length > 1 && e[0]['results'][1].length > 0) {
                        SEPAMandateTypeLang_2 = e[0]['results'][1];
                    }
                    SEPAMandateType.forEach(function (item) {
                        var filterData = SEPAMandateTypeLang_2.find(function (langObj) { return ((langObj.BusinessCode === item.BusinessCode)
                            && (langObj.MandateTypeCode === item.MandateTypeCode)); });
                        _this.ttMandateType.push({
                            'MandateTypeCode': item.MandateTypeCode,
                            'MandateTypeDesc': (filterData) ? filterData.MandateTypeDesc : item.MandateTypeDesc
                        });
                        if (item.DefaultInd === true) {
                            _this.sysCharParams['vDefaultMandateType'] = item.MandateTypeCode;
                        }
                    });
                }
                if (_this.ttMandateType && _this.ttMandateType.length > 0) {
                    _this.utilService.sortByKey(_this.ttMandateType, 'MandateTypeDesc');
                    _this.sysCharParams['ttMandateType'] = _this.ttMandateType;
                }
            }
            if (e[1]['results'] && e[1]['results'].length > 0) {
                if (e[1]['results'][0]) {
                    _this.sysCharParams['vDefaultCountryCode'] = e[1]['results'][0][0].riCountryCode;
                    _this.sysCharParams['vBankAccountFormatCode'] = e[1]['results'][0][0].BankAccountFormatCode;
                }
                if (e[1]['results'][1] && e[1]['results'][1].length > 0) {
                    _this.sysCharParams['glAllowUserAuthUpdate'] = e[1]['results'][1][0].AllowUpdateOfContractInfoInd;
                }
                else {
                    var error = '2 - UserAuthority';
                }
            }
            if (e[2]['results'] && e[2]['results'].length > 0) {
                if (e[2]['results'][0] && e[2]['results'][0].length > 0) {
                    _this.sysCharParams['vSCMultiContactInd'] = true;
                }
                else {
                    _this.sysCharParams['vSCMultiContactInd'] = false;
                }
                if (e[2]['results'][1] && e[2]['results'][1].length > 0) {
                    for (var i = 0; i < e[2]['results'][1].length; i++) {
                        if (e[2]['results'][1][i].CurrentBranchInd) {
                            _this.defaultCode.branchNumber = e[2]['results'][1][i].BranchNumber;
                            break;
                        }
                    }
                }
            }
            if (e[3]['records'] && e[3]['records'].length > 0) {
                _this.onSysCharDataReceive(e[3]);
            }
            _this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_SYSCHAR, payload: _this.sysCharParams });
            switch (mode) {
                case 'UPDATE':
                    _this.loadSelectedDataRow();
                    break;
                case 'ADD':
                    setTimeout(function () {
                        _this.loadDataForAddMode();
                    }, 200);
                    break;
                default:
                    break;
            }
        });
    };
    AccountMaintenanceComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.queryLookUp.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.queryLookUp.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        }
        else {
            this.queryLookUp.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            this.queryLookUp.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    };
    AccountMaintenanceComponent.prototype.onPostCodeSearch = function (data) {
        this.postCode = data.Postcode;
    };
    AccountMaintenanceComponent.prototype.modalHidden = function () {
        this.autoOpenSearch = false;
        this.initializeData = false;
        if (!this.addMode && !this.updateMode || this.searchMode) {
            this.accountFormGroup.controls['AccountNumber'].enable();
        }
    };
    AccountMaintenanceComponent.prototype.ngOnDestroy = function () {
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
        this.routeAwayGlobals.resetRouteAwayFlags();
    };
    AccountMaintenanceComponent.prototype.initPage = function () {
        this.TabDraw();
        if (this.sysCharParams['vSCSendOneOffAccntToNAVlog'] === true) {
            this.fieldVisibility.AccountOwningBranch = true;
            this.fieldRequired.isAccountOwningBranchRequired = true;
            this.accountFormGroup.controls['AccountOwningBranch'].setValidators(Validators.required);
        }
        else {
            this.fieldVisibility.AccountOwningBranch = false;
            this.fieldRequired.isAccountOwningBranchRequired = false;
            this.accountFormGroup.controls['AccountOwningBranch'].setErrors(null);
            this.accountFormGroup.controls['AccountOwningBranch'].clearValidators();
        }
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
    };
    AccountMaintenanceComponent.prototype.getVirtualTableData = function (data) {
        var _this = this;
        var userCode = this.authService.getSavedUserCode();
        var virtualTableList = [];
        var virtualTable2List = [];
        var businessCode = this.storeData['code'].business ? this.storeData['code'].business : this.utilService.getBusinessCode();
        virtualTableList.push({
            'table': 'Employee',
            'query': { 'BusinessCode': businessCode, 'EmployeeCode': (data['data'].EmployeeCode) ? data['data'].EmployeeCode : '' },
            'fields': ['EmployeeSurname']
        }, {
            'table': 'AccountOwner',
            'query': { 'BusinessCode': businessCode, 'AccountOwner': (data['data'].AccountOwner) ? data['data'].AccountOwner : '' },
            'fields': ['AccountOwnerSurname']
        }, {
            'table': 'Tier',
            'query': { 'BusinessCode': businessCode, 'TierCode': (data['data'].TierCode) ? data['data'].TierCode : '' },
            'fields': ['TierSystemDescription']
        }, {
            'table': 'TierCode',
            'query': { 'BusinessCode': businessCode, 'TierCode': (data['data'].TierCode) ? data['data'].TierCode : '' },
            'fields': ['TierDescription']
        }, {
            'table': 'CategoryCode',
            'query': { 'BusinessCode': businessCode, 'CategoryCode': (data['data'].CategoryCode) ? data['data'].CategoryCode : '' },
            'fields': ['CategoryDesc']
        }, {
            'table': 'riCountry',
            'query': { 'riCountryCode': data['data'].CountryCode },
            'fields': ['riCountryDescription']
        });
        virtualTable2List.push({
            'table': 'CrossReferenceAccount',
            'query': { 'BusinessCode': this.storeData['code'].business, 'AccountNumber': (data['data'].AccountNumber) ? data['data'].AccountNumber : '' },
            'fields': ['CrossReferenceAccountName']
        }, {
            'table': 'BankAccountType',
            'query': { 'BankAccountTypeCode': (data['data'].BankAccountTypeCode) ? data['data'].BankAccountTypeCode : '' },
            'fields': ['BankAccountTypeDesc']
        }, {
            'table': 'GroupAccount',
            'query': { 'GroupAccountNumber': (data['data'].GroupAccountNumber) ? data['data'].GroupAccountNumber : '' },
            'fields': ['GroupName']
        }, {
            'table': 'AccountBusinessType',
            'query': { 'AccountBusinessTypeCode': (data['data'].AccountBusinessTypeCode) ? data['data'].AccountBusinessTypeCode : '' },
            'fields': ['AccountBusinessTypeDesc']
        }, {
            'table': 'LogoType',
            'query': { 'LogoTypeCode': (data['data'].LogoTypeCode) ? data['data'].LogoTypeCode : '' },
            'fields': ['LogoTypeDesc']
        }, {
            'table': 'Employee',
            'query': { 'BusinessCode': this.storeData['code'].business, 'EmployeeCode': (data['data'].EmployeeCode) ? data['data'].EmployeeCode : '' },
            'fields': ['EmployeeSurname']
        });
        this.ajaxSource.next(this.ajaxconstant.START);
        Observable.forkJoin(this.lookUpRecord(virtualTableList, 100), this.lookUpRecord(virtualTable2List, 100)).subscribe(function (e) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (e[0]['results'] && e[0]['results'].length > 0) {
                if (e[0]['results'][0] && e[0]['results'][0].length > 0) {
                    _this.virtualTableField.EmployeeSurname = e[0]['results'][0][0].EmployeeSurname;
                }
                if (e[0]['results'][1] && e[0]['results'][1].length > 0) {
                    _this.virtualTableField.AccountOwnerSurname = e[0]['results'][1][0].AccountOwnerSurname;
                }
                if (e[0]['results'][2] && e[0]['results'][2].length > 0) {
                    _this.virtualTableField.TierSystemDescription = e[0]['results'][2][0].TierSystemDescription;
                }
                if (e[0]['results'][3] && e[0]['results'][3].length > 0) {
                    _this.virtualTableField.TierDescription = e[0]['results'][3][0].TierDescription;
                }
                if (e[0]['results'][4] && e[0]['results'][4].length > 0) {
                    _this.virtualTableField.CategoryDesc = e[0]['results'][4][0].CategoryDesc;
                }
                if (e[0]['results'][5] && e[0]['results'][5].length > 0) {
                    _this.virtualTableField.riCountryDescription = e[0]['results'][5][0].riCountryDescription;
                }
                _this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_VIRTUAL_TABLE_DATA, payload: _this.virtualTableField });
            }
            if (e[1]['results'] && e[1]['results'].length > 0) {
                if (e[1]['results'][0]) {
                    _this.virtualTableField.CrossReferenceAccountName = e[1]['results'][0][0].CrossReferenceAccountName;
                }
                if (e[1]['results'][1] && e[1]['results'][1].length > 0) {
                    _this.virtualTableField.BankAccountTypeDesc = e[1]['results'][1][0].BankAccountTypeDesc;
                }
                if (e[1]['results'][2] && e[1]['results'][2].length > 0) {
                    if (_this.sysCharParams['vSCGroupAccount'] === true) {
                        _this.virtualTableField.GroupName = e[1]['results'][2][0].GroupName;
                    }
                }
                if (e[1]['results'][3] && e[1]['results'][3].length > 0) {
                    _this.virtualTableField.AccountBusinessTypeDesc = e[1]['results'][3][0].AccountBusinessTypeDesc;
                }
                if (e[1]['results'][4] && e[1]['results'][4].length > 0) {
                    _this.virtualTableField.LogoTypeDesc = e[1]['results'][4][0].LogoTypeDesc;
                }
            }
            _this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_VIRTUAL_TABLE_DATA, payload: _this.virtualTableField });
        });
    };
    AccountMaintenanceComponent.prototype.fetchAccountData = function (functionName, params) {
        this.queryAccount = new URLSearchParams();
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        }
        else {
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
        for (var key in params) {
            if (key) {
                this.queryAccount.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.method, this.module, this.operation, this.queryAccount);
    };
    AccountMaintenanceComponent.prototype.updateAccountData = function () {
        var _this = this;
        var formdata = {};
        this.queryAccount = new URLSearchParams();
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        }
        else {
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
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.queryAccount, formdata).subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else if (e['errorMessage']) {
                _this.errorModal.show({ msg: e.errorMessage, title: 'Error' }, false);
            }
            else {
                _this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: 'Message' }, false);
                _this.riMaintenance_AfterSave();
                _this.onFetch();
                _this.riMaintenance_BeforeMode();
                _this.store.dispatch({
                    type: AccountMaintenanceActionTypes.BEFORE_MODE, payload: {}
                });
                _this.riMaintenance_BeforeUpdate();
            }
            _this.setLastActivatedTab();
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    AccountMaintenanceComponent.prototype.addAccountData = function () {
        var _this = this;
        var formdata = {};
        this.queryAccount = new URLSearchParams();
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        }
        else {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }
        this.queryAccount.set(this.serviceConstants.Action, '1');
        formdata = this.getFormDataForAccountNumber();
        formdata['AccountNumber'] = '';
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.queryAccount, formdata).subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else if (e['errorMessage']) {
                _this.errorModal.show({ msg: e.errorMessage, title: 'Error' }, false);
            }
            else {
                if (e.AccountNumber) {
                    _this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: 'Message' }, false);
                    _this.accountFormGroup.controls['AccountNumber'].setValue(e.AccountNumber);
                    _this.riMaintenance_AfterSave();
                    _this.onFetch();
                    _this.riMaintenance_BeforeMode();
                    _this.store.dispatch({
                        type: AccountMaintenanceActionTypes.BEFORE_MODE, payload: {}
                    });
                    _this.riMaintenance_BeforeUpdate();
                }
            }
            _this.setLastActivatedTab();
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    AccountMaintenanceComponent.prototype.getFormDataForAccountNumber = function () {
        var formdata = {};
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
            if (this.storeData['formGroup'].accountManagement !== false) {
                formdata['TierCode'] = this.getFieldValue(this.storeData['formGroup'].accountManagement.controls['TierCode']);
                formdata['TierDescription'] = this.getFieldValue(this.storeData['formGroup'].accountManagement.controls['TierDescription']);
                formdata['AccountOwner'] = this.getFieldValue(this.storeData['formGroup'].accountManagement.controls['AccountOwner']);
                formdata['AccountOwnerSurname'] = this.getFieldValue(this.storeData['formGroup'].accountManagement.controls['AccountOwnerSurname']);
                formdata['CategoryCode'] = this.getFieldValue(this.storeData['formGroup'].accountManagement.controls['CategoryCode']);
                formdata['CategoryDesc'] = this.getFieldValue(this.storeData['formGroup'].accountManagement.controls['CategoryDesc']);
            }
            if (this.storeData['formGroup'].bankDetails !== false) {
                formdata['BankAccountTypeCode'] = this.getFieldValue(this.storeData['formGroup'].bankDetails.controls['BankAccountTypeCode']);
                formdata['BankAccountTypeDesc'] = this.getFieldValue(this.storeData['formGroup'].bankDetails.controls['BankAccountTypeDesc']);
                formdata['BankAccountSortCode'] = this.getFieldValue(this.storeData['formGroup'].bankDetails.controls['BankAccountSortCode']);
                formdata['BankAccountNumber'] = this.getFieldValue(this.storeData['formGroup'].bankDetails.controls['BankAccountNumber']);
                formdata['VirtualBankAccountNumber'] = this.getFieldValue(this.storeData['formGroup'].bankDetails.controls['VirtualBankAccountNumber']);
                formdata['BankAccountInfo'] = this.getFieldValue(this.storeData['formGroup'].bankDetails.controls['BankAccountInfo']);
                formdata['MandateNumberSEPA'] = this.getFieldValue(this.storeData['formGroup'].bankDetails.controls['MandateNumberSEPA']);
                formdata['MandateNumberFinance'] = this.getFieldValue(this.storeData['formGroup'].bankDetails.controls['MandateNumberFinance']);
                formdata['MandateDate'] = this.getFieldValue(this.storeData['formGroup'].bankDetails.controls['MandateDate']);
                formdata['selMandateTypeCode'] = this.getFieldValue(this.storeData['formGroup'].bankDetails.controls['selMandateTypeCode']);
            }
            if (this.storeData['formGroup'].discounts !== false) {
                formdata['PromptPaymentInd'] = this.getFieldValue(this.storeData['formGroup'].discounts.controls['PromptPaymentInd'], true);
                formdata['PromptPaymentRate'] = this.utilService.CCurToNum(this.getFieldValue(this.storeData['formGroup'].discounts.controls['PromptPaymentRate']));
                formdata['PromptPaymentNarrative'] = this.getFieldValue(this.storeData['formGroup'].discounts.controls['PromptPaymentNarrative']);
                formdata['RetrospectiveInd'] = this.getFieldValue(this.storeData['formGroup'].discounts.controls['RetrospectiveInd'], true);
                formdata['RetrospectiveRate'] = this.utilService.CCurToNum(this.getFieldValue(this.storeData['formGroup'].discounts.controls['RetrospectiveRate']));
                formdata['RetrospectiveNarrative'] = this.getFieldValue(this.storeData['formGroup'].discounts.controls['RetrospectiveNarrative']);
                formdata['InvoiceDiscountInd'] = this.getFieldValue(this.storeData['formGroup'].discounts.controls['InvoiceDiscountInd'], true);
                formdata['InvoiceDiscountRate'] = this.utilService.CCurToNum(this.getFieldValue(this.storeData['formGroup'].discounts.controls['InvoiceDiscountRate']));
                formdata['InvoiceDiscountNarrative'] = this.getFieldValue(this.storeData['formGroup'].discounts.controls['InvoiceDiscountNarrative']);
            }
            if (this.storeData['formGroup'].ediInvoicing !== false) {
                formdata['EDIPartnerAccountCode'] = this.getFieldValue(this.storeData['formGroup'].ediInvoicing.controls['EDIPartnerAccountCode']);
                formdata['EDIPartnerANANumber'] = this.getFieldValue(this.storeData['formGroup'].ediInvoicing.controls['EDIPartnerANANumber']);
            }
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
                formdata['AccountBalance'] = this.utilService.CCurToNum(this.getFieldValue(this.storeData['formGroup'].general.controls['AccountBalance']));
                formdata['BadDebtAccount'] = this.getFieldValue(this.storeData['formGroup'].general.controls['BadDebtAccount'], true);
                formdata['BadDebtNarrative'] = this.getFieldValue(this.storeData['formGroup'].general.controls['BadDebtNarrative']);
                formdata['LiveAccount'] = this.getFieldValue(this.storeData['formGroup'].general.controls['LiveAccount'], true);
                formdata['IncludeInMarketingCampaignInd'] = this.getFieldValue(this.storeData['formGroup'].general.controls['IncludeMarketingCampaign'], true);
            }
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
            if (this.storeData['formGroup'].teleSales !== false) {
                formdata['CrossReferenceAccountNumber'] = this.getFieldValue(this.storeData['formGroup'].teleSales.controls['CrossReferenceAccountNumber']);
                formdata['CrossReferenceAccountName'] = this.getFieldValue(this.storeData['formGroup'].teleSales.controls['CrossReferenceAccountName']);
                formdata['ValidationExemptInd'] = this.getFieldValue(this.storeData['formGroup'].teleSales.controls['ValidationExemptInd'], true);
                formdata['NewInvoiceGroupInd'] = this.getFieldValue(this.storeData['formGroup'].teleSales.controls['NewInvoiceGroupInd'], true);
            }
        }
        catch (e) {
        }
        return formdata;
    };
    AccountMaintenanceComponent.prototype.postAccountEntryData = function (functionName, params, postdata) {
        this.queryAccount = new URLSearchParams();
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        }
        else {
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
        for (var key in params) {
            if (key) {
                this.queryAccount.set(key, params[key]);
            }
        }
        return this.httpService.makePostRequest(this.method, this.module, this.operation, this.queryAccount, postdata);
    };
    AccountMaintenanceComponent.prototype.recordSelected = function (arg1, arg2) {
        if (this.storeData && this.storeData['data']) {
            return true;
        }
        else {
            return false;
        }
    };
    AccountMaintenanceComponent.prototype.onKeyDown = function (event) {
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
                    this.accountNumberEllipsis.configParams = this.inputParams;
                    this.accountNumberEllipsis.updateComponent();
                    this.accountNumberEllipsis.openModal();
                }
            }
        }
    };
    AccountMaintenanceComponent.prototype.onBlur = function (event) {
        if (event && event.target) {
            var elementValue = event.target.value;
            var _paddedValue = elementValue;
            if (event.target.id === 'AccountNumber') {
                if (elementValue.length > 0) {
                    var num = this.numberFormatValue(elementValue, 9);
                    event.target.value = num;
                    this.accountFormGroup.controls['AccountNumber'].setValue(num);
                    if (!this.addMode && !this.updateMode) {
                        var mode = {
                            updateMode: true,
                            addMode: false,
                            searchMode: false
                        };
                        this.loadSelectedDataRow({}, mode);
                    }
                }
            }
            else if (event.target.id === 'AccountName') {
            }
        }
    };
    ;
    AccountMaintenanceComponent.prototype.numberFormatValue = function (elementValue, maxLength) {
        var paddedValue = elementValue;
        if (elementValue.length < maxLength) {
            paddedValue = this.numberPadding(elementValue, 9);
        }
        return paddedValue;
    };
    AccountMaintenanceComponent.prototype.numberPadding = function (num, size) {
        var s = num + '';
        while (s.length < size)
            s = '0' + s;
        return s;
    };
    AccountMaintenanceComponent.prototype.buildMenuOptions = function () {
        this.fieldVisibility.menuControl = true;
        if (this.getParentHTMLInputValue('EmployeeLimitChildDrillOptions') !== 'Y') {
            var optionsList = [
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
    };
    AccountMaintenanceComponent.prototype.optionsChange = function (event) {
        var mode = '';
        switch (this.options.trim()) {
            case 'Contact Management':
                mode = 'Account';
                if (this.recordSelected()) {
                    if (this.otherParams['lREGContactCentreReview']) {
                    }
                    else {
                        this.router.navigate(['/ccm/centreReview'], { queryParams: { parent: 'Account' } });
                    }
                }
                break;
            case 'Contact Management Search':
                if (this.recordSelected()) {
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
                    this.router.navigate(['application/contractsearch'], { queryParams: { parent: mode } });
                }
                break;
            case 'Add Contract':
                if (this.recordSelected()) {
                    mode = 'AddContractFromAccount';
                    var paramObj = {
                        parentMode: mode,
                        AccountNumber: this.accountFormGroup.controls['AccountNumber'].value,
                        AccountName: this.accountFormGroup.controls['AccountName'].value,
                        PromptPaymentInd: this.accountData ? this.accountData['PromptPaymentInd'] : '',
                        RetrospectiveInd: this.accountData ? this.accountData['RetrospectiveInd'] : ''
                    };
                    this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], {
                        queryParams: paramObj
                    });
                }
                break;
            case 'Add Job':
                if (this.recordSelected()) {
                    mode = 'AddJobFromAccount';
                    var paramObj = {
                        parentMode: mode,
                        AccountNumber: this.accountFormGroup.controls['AccountNumber'].value,
                        AccountName: this.accountFormGroup.controls['AccountName'].value,
                        PromptPaymentInd: this.accountData ? this.accountData['PromptPaymentInd'] : '',
                        RetrospectiveInd: this.accountData ? this.accountData['RetrospectiveInd'] : ''
                    };
                    this.router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], { queryParams: paramObj });
                }
                break;
            case 'Add Product':
                if (this.recordSelected()) {
                    mode = 'AddProductFromAccount';
                    var paramObj = {
                        parentMode: mode,
                        AccountNumber: this.accountFormGroup.controls['AccountNumber'].value,
                        AccountName: this.accountFormGroup.controls['AccountName'].value,
                        PromptPaymentInd: this.accountData ? this.accountData['PromptPaymentInd'] : '',
                        RetrospectiveInd: this.accountData ? this.accountData['RetrospectiveInd'] : ''
                    };
                    this.router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], { queryParams: paramObj });
                }
                break;
            case 'Customer Information':
                mode = 'Account';
                this.router.navigate(['/grid/contractmanagement/maintenance/contract/customerinformation'], {
                    queryParams: {
                        parentMode: 'Account',
                        accountNumber: this.accountFormGroup.controls['AccountNumber'].value,
                        accountName: this.accountFormGroup.controls['AccountName'].value
                    }
                });
                break;
            case 'Premises':
                mode = 'Account';
                if (this.recordSelected()) {
                    mode = 'Account';
                    this.router.navigate(['application/accountpremise'], { queryParams: { parent: mode, AccountNumber: this.accountFormGroup.controls['AccountNumber'].value } });
                }
                break;
            case 'Visit Tolerances':
                if (this.recordSelected()) {
                    mode = 'AccountVisitTolerance';
                    this.router.navigate(['grid/application/visittolerancegrid'], {
                        queryParams: {
                            parentMode: 'AccountVisitTolerance',
                            currentContractTypeURLParameter: this.inputParams.currentContractTypeURLParameter
                        }
                    });
                }
                break;
            case 'Infestation Tolerances':
                if (this.recordSelected()) {
                    mode = 'AccountInfestationTolerance';
                    this.router.navigate(['grid/contractmanagement/account/infestationToleranceGrid'], {
                        queryParams: {
                            'parentMode': mode,
                            'currentContractTypeURLParameter': this.inputParams.currentContractTypeURLParameter,
                            'AccountNumber': this.accountFormGroup.controls['AccountNumber'].value
                        }
                    });
                }
                break;
            case 'Telesales Order':
                if (this.recordSelected()) {
                    mode = 'AccountTeleSalesOrder';
                    this.router.navigate(['application/telesalesEntry'], {
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
                }
                break;
            default:
                break;
        }
    };
    AccountMaintenanceComponent.prototype.onAccountBusinessTypeCodeKeydown = function (event) {
        var mode = 'LookUp-Account';
    };
    AccountMaintenanceComponent.prototype.cmdContactDetails = function (cWhich) {
        var mode = '';
        if (cWhich === 'all') {
            mode = 'Account';
        }
        else {
            mode = 'AccountEmergency';
        }
        this.router.navigate(['/application/ContactPersonMaintenance'], { queryParams: { parentMode: mode, accountNumber: this.accountFormGroup.controls['AccountNumber'].value } });
    };
    AccountMaintenanceComponent.prototype.getParentHTMLInputValue = function (param) {
        return this.riExchange.getParentHTMLValue(param);
    };
    AccountMaintenanceComponent.prototype.onAccountNameChange = function () {
        var _this = this;
        if (this.accountFormGroup.controls['AccountName'].value && this.accountFormGroup.controls['AccountName'].value.trim() === '') {
            this.setDefaultEllipsisConfig();
        }
        if (this.addMode === true) {
            var params = {
                'action': '6',
                'SearchName': this.accountFormGroup.controls['AccountName'].value
            };
            this.fetchServiceData('', params).subscribe(function (e) {
                if (e.status === 'failure') {
                    _this.errorService.emitError(e.oResponse);
                }
                else {
                    var strFoundAccount = e.strFoundAccount;
                    if (strFoundAccount && (strFoundAccount.toLowerCase() === 'yes')) {
                        if ((typeof _this.accountNumberEllipsis !== 'undefined') && _this.accountNumberEllipsis) {
                            _this.accountNumberEllipsis.disabled = false;
                            var obj = _this.inputParams;
                            obj['parentMode'] = 'AccountSearch';
                            obj['searchValue'] = _this.accountFormGroup.controls['AccountName'].value;
                            obj['showAddNewDisplay'] = false;
                            obj['showCountryCode'] = false;
                            obj['showBusinessCode'] = false;
                            obj['countryCode'] = _this.utilService.getCountryCode();
                            obj['businessCode'] = _this.utilService.getBusinessCode();
                            _this.accountNumberEllipsis.childConfigParams = obj;
                            _this.accountNumberEllipsis.updateComponent();
                            _this.accountNumberEllipsis.openModal();
                            _this.accountNumberEllipsis.disabled = true;
                        }
                    }
                    else {
                        if (_this.accountFormGroup.controls['AccountNumber'].value) {
                        }
                        else {
                            if (_this.sysCharParams['vSCRunPAFSearchOn1stAddressLine'] === true) {
                                _this.onCmdGetAddressClick();
                            }
                        }
                    }
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    AccountMaintenanceComponent.prototype.onCmdGetAddressClick = function () {
        var _this = this;
        if (this.sysCharParams['vSCEnableHopewiserPAF'] === true) {
            event.preventDefault();
            alert('TODO: Model/riMPAFSearch.htm');
        }
        else if (this.sysCharParams['vSCEnableDatabasePAF'] === true) {
            var obj_1 = document.getElementById('AccountPostcode');
            var obj2_1 = document.getElementById('AccountAddressLine1');
            var focus_1 = new Event('focus', { bubbles: false });
            if (obj_1) {
                this.renderer.invokeElementMethod(obj_1, 'focus', [focus_1]);
                setTimeout(function () {
                    _this.renderer.invokeElementMethod(obj_1, 'blur', [focus_1]);
                }, 0);
            }
            if (obj2_1) {
                setTimeout(function () {
                    _this.renderer.invokeElementMethod(obj2_1, 'focus', [focus_1]);
                }, 10);
            }
        }
    };
    AccountMaintenanceComponent.prototype.onCmdCustomerInformationClick = function () {
        event.preventDefault();
        this.router.navigate(['/grid/contractmanagement/maintenance/contract/customerinformation'], {
            queryParams: {
                parentMode: 'Account',
                accountNumber: this.accountFormGroup.controls['AccountNumber'].value,
                accountName: this.accountFormGroup.controls['AccountName'].value
            }
        });
    };
    AccountMaintenanceComponent.prototype.UpdateHTMLDocument = function () {
        var _this = this;
        if (this.addMode) {
            var postObj = {
                'AccountNumber': this.accountFormGroup.controls['AccountNumber'].value
            };
            this.postAccountEntryData('GetContactPersonChanges', {}, postObj).subscribe(function (e) {
                if (e.status === 'failure') {
                    _this.errorService.emitError(e.oResponse);
                }
                else {
                    var contactPersonFound = e.ContactPersonFound;
                    if (contactPersonFound.toLowerCase() === 'y') {
                        _this.storeData['formGroup'].address.ontrols['AccountContactName'].value = e.ContactPersonName;
                        _this.storeData['formGroup'].address.controls['AccountContactPosition'].value = e.ContactPersonPosition;
                        _this.storeData['formGroup'].address.controls['AccountContactDepartment'].value = e.ContactPersonDepartment;
                        _this.storeData['formGroup'].address.controls['AccountContactTelephone'].value = e.ContactPersonTelephone;
                        _this.storeData['formGroup'].address.controls['AccountContactMobile'].value = e.ContactPersonMobile;
                        _this.storeData['formGroup'].address.controls['AccountContactEmail'].value = e.ContactPersonEmail;
                        _this.storeData['formGroup'].address.controls['AccountContactFax'].value = e.ContactPersonFax;
                    }
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    AccountMaintenanceComponent.prototype.riMaintenance_BeforeAdd = function () {
        var _this = this;
        this.setformGroupControlValue('InvoiceNarrativeSL', true);
        this.setformGroupControlValue('LiveAccount', true);
        this.disableFormGroupControl('cmdAddOwner', true);
        if (this.sysCharParams['vSCCommonStatement'] === true) {
            this.setformGroupControlValue('CommonStatement', true);
        }
        else {
            this.setformGroupControlValue('CommonStatement', false);
        }
        this.enableFormGroupControl('AccountOwningBranch');
        this.dropdown.AccountOwningBranch.disabled = false;
        this.enableFormGroupControl('CountryCode');
        var tempCountryCode = (this.sysCharParams['vDefaultCountryCode']) ? this.sysCharParams['vDefaultCountryCode'] : '';
        this.setformGroupControlValue('CountryCode', tempCountryCode);
        var postObj = {
            'Function': 'IsNationalAccountBranch',
            'BranchNumber': this.utilService.getBranchCode()
        };
        this.postAccountEntryData('IsNationalAccountBranch', {}, postObj).subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                var nationalAccount = e['NationalAccount'];
                if (e['NationalAccount'] && (nationalAccount.toLowerCase() === 'yes' || nationalAccount.toLowerCase() === 'true' || nationalAccount.toLowerCase() === 'y' || nationalAccount === true)) {
                    _this.setformGroupControlValue('NationalAccount', true);
                    _this.setformGroupControlValue('ExcludePDADebtInd', true);
                }
                else {
                    _this.setformGroupControlValue('NationalAccount', false);
                    _this.setformGroupControlValue('ExcludePDADebtInd', false);
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
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
        }
        else {
            this.disableFormGroupControl('BankAccountSortCode');
            this.disableFormGroupControl('BankAccountNumber');
        }
    };
    AccountMaintenanceComponent.prototype.riMaintenance_AfterSave = function () {
        if (this.sysCharParams['vSCMultiContactInd'] === true) {
            this.setVisibleField(this.tabName.address, 'spanAmendContact', true);
            this.setVisibleField(this.tabName.address, 'spanEmergencyContact', true);
        }
        if (this.sysCharParams['vSCEnableSEPAFinanceMandate'] || this.sysCharParams['vSCEnableSEPAFinanceMandateLog']) {
            this.disableFormGroupControl('selMandateTypeCode', true);
        }
    };
    AccountMaintenanceComponent.prototype.riMaintenance_BeforeUpdate = function () {
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
    };
    AccountMaintenanceComponent.prototype.showHideFields = function () {
        if (this.getformGroupControlValue('BadDebtAccount') === true) {
            this.setRequiredStatus('BadDebtNarrative', true);
        }
        else {
            this.setRequiredStatus('BadDebtNarrative', false);
        }
        if (this.sysCharParams['vSCMandatoryAccOCLevel'] === 0 || this.sysCharParams['vSCMandatoryAccOCLevel'] === 2) {
            this.setRequiredStatus('AccountOwner', false);
            this.isError('AccountOwner');
        }
        else {
            this.setRequiredStatus('AccountOwner', true);
        }
        if (this.sysCharParams['vSCMandatoryAccOCLevel'] === 0 || this.sysCharParams['vSCMandatoryAccOCLevel'] === 1) {
            this.setRequiredStatus('CategoryCode', false);
            this.isError('CategoryCode');
        }
        else {
            this.setRequiredStatus('CategoryCode', true);
        }
    };
    AccountMaintenanceComponent.prototype.riMaintenance_BeforeSave = function () {
        var _this = this;
        var obs;
        var obs2;
        var retObj = new ReplaySubject(1);
        var flag = true;
        var status = true;
        var counter = 0;
        this.sysCharParams = this.storeData['processedSysChar'];
        if (this.sysCharParams['vSCEnableAccountAddressMessage'] === true) {
            if (this.updateMode) {
                status = false;
                this.messageModal.show({ msg: MessageConstant.PageSpecificMessage.Changes_made_to_Account_Address_Information_will_not_affect_invoicing, title: 'Message' }, false);
                this.messageModal.modalClose.subscribe(function (event) {
                    if (counter === 0) {
                        counter++;
                        _this.beforeSaveModalConfirm().subscribe(function (e) {
                            if (e === true) {
                                obs2.subscribe(function (e1) {
                                    if (e1 === true) {
                                        obs.subscribe(function (e3) {
                                            retObj.next(e3);
                                        });
                                    }
                                    else {
                                        retObj.next(e1);
                                    }
                                });
                            }
                            else {
                                retObj.next(e);
                            }
                        });
                    }
                });
            }
        }
        obs2 = new Observable(function (observer) {
            if (_this.sysCharParams['vbEnableValidatePostcodeSuburb'] === true) {
                _this.validatePostcodeSuburb().subscribe(function (data) {
                    if (data === true) {
                        _this.riTab.tabFocusTo(0);
                        _this.messageModal.show({ msg: MessageConstant.PageSpecificMessage.The_suburb_state_and_postcode_do_not_match, title: 'Message' }, false);
                        var count_1 = 0;
                        _this.messageModal.modalClose.subscribe(function (event) {
                            if (count_1 === 0) {
                                count_1++;
                                _this.storeData['otherParams']['showPostCode'] = true;
                                _this.onCmdGetAddressClick();
                                _this.applyFocusToControlById('AccountAddressLine4');
                                _this.SetErrorStatus('AccountAddressLine4', true);
                                _this.applyFocusToControlById('AccountAddressLine5');
                                _this.SetErrorStatus('AccountAddressLine5', true);
                                _this.applyFocusToControlById('AccountPostcode');
                                _this.SetErrorStatus('AccountPostcode', true);
                                _this.storeData['otherParams'].CancelEvent = true;
                                observer.next(false);
                            }
                        });
                    }
                    else if (data === false) {
                        observer.next(true);
                    }
                    else {
                        obs.subscribe(function (e) {
                            observer.next(e);
                        });
                    }
                });
            }
            else {
                observer.next(true);
            }
        });
        obs = new Observable(function (observer) {
            if (_this.sysCharParams['vSCSendOneOffAccntToNAV'] === true) {
                _this.storeData['formGroup'].address.controls['BtnSendToNAV'].enable();
                _this.storeData['fieldVisibility'].address.tdSentToNAVStatusNOTSENT = true;
                _this.storeData['fieldVisibility'].address.tdSentToNAVStatusOK = false;
                _this.storeData['fieldVisibility'].address.tdSentToNAVStatusFAIL = false;
            }
            _this.accountFormGroup.controls['MandateTypeCode'].setValue(_this.getFieldValue(_this.storeData['formGroup'].bankDetails.controls['selMandateTypeCode']));
            observer.next(true);
        });
        if (status === true) {
            this.beforeSaveModalConfirm().subscribe(function (e) {
                if (e === true) {
                    obs2.subscribe(function (e1) {
                        if (e1 === true) {
                            obs.subscribe(function (e3) {
                                retObj.next(e3);
                            });
                        }
                        else {
                            retObj.next(e1);
                        }
                    });
                }
                else {
                    retObj.next(e);
                }
            });
        }
        return retObj;
    };
    AccountMaintenanceComponent.prototype.beforeSaveModalConfirm = function () {
        var _this = this;
        var retObj = new ReplaySubject(1);
        if (this.storeData['sentFromParent']) {
            this.accountFormGroup.controls['CallLogID'].setValue(this.storeData['sentFromParent'].CurrentCallLogID);
        }
        this.accountFormGroup.controls['ClosedWithChanges'].setValue('Y');
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
            }).subscribe(function (e) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                var errorMessage = '';
                if (e['status'] === 'failure') {
                    _this.errorService.emitError(e['oResponse']);
                    retObj.next(false);
                }
                else if (e['errorMessage']) {
                    _this.errorService.emitError(e['errorMessage']);
                    retObj.next(false);
                }
                else {
                    if (e['ErrorMessageDesc']) {
                        _this.messageModal.show({ msg: e['ErrorMessageDesc'], title: 'Message' }, false);
                        retObj.next(false);
                    }
                    else {
                        retObj.next(true);
                    }
                }
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.errorService.emitError(error);
                retObj.next(false);
            });
        }
        else {
            retObj.next(true);
        }
        return retObj;
    };
    AccountMaintenanceComponent.prototype.validatePostcodeSuburb = function () {
        var _this = this;
        var retObj = new ReplaySubject(1);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchAccountData('', {
            action: '0',
            ValidatePostcodeSuburb: 'ValPost',
            AccountAddressLine4: this.getFieldValue(this.storeData['formGroup'].address.controls['AccountAddressLine4']),
            AccountAddressLine5: this.getFieldValue(this.storeData['formGroup'].address.controls['AccountAddressLine5']),
            AccountPostcode: this.getFieldValue(this.storeData['formGroup'].address.controls['AccountPostcode']),
            PostcodeSuburbLog: this.getFieldValue(this.storeData['formGroup'].address.controls['PostcodeSuburbLog'])
        }).subscribe(function (d) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (d['status'] === 'failure') {
                _this.errorService.emitError(d['oResponse']);
                retObj.next(false);
            }
            else if (d['errorMessage']) {
                _this.errorService.emitError(d['errorMessage']);
                retObj.next(false);
            }
            else {
                if (d && d['PostcodeSuburbError']) {
                    var err = d['PostcodeSuburbError'];
                    if ((err === 'true') || (err === true)) {
                        retObj.next(true);
                    }
                }
                else {
                    retObj.next(null);
                }
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
            retObj.next(false);
        });
        return retObj;
    };
    AccountMaintenanceComponent.prototype.getFieldValue = function (controlObj, isCheckBox) {
        if (isCheckBox === true) {
            return (controlObj && controlObj.value) ? ((controlObj.value === true) ? 'Yes' : 'no') : 'no';
        }
        return (controlObj && controlObj.value) ? controlObj.value : '';
    };
    AccountMaintenanceComponent.prototype.setFieldValue = function (val, isCheckBox) {
        if (isCheckBox === true) {
            return (val) ? ((val.toString().toLowerCase().trim() === 'yes') ? true : false) : false;
        }
        return (val) ? val.trim() : '';
    };
    AccountMaintenanceComponent.prototype.onAdd = function () {
        this.cbbService.disableComponent(true);
        this.lastActivatedTabIndex = 0;
        this.parentMode = '';
        this.saveBtn = true;
        this.routeAwayGlobals.setSaveEnabledFlag(true);
        this.isSaveDisabled = false;
        this.showControlBtn = true;
        this.getSpeedScriptData('ADD');
    };
    AccountMaintenanceComponent.prototype.loadDataForAddMode = function () {
        var _this = this;
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_MODE, payload: {
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
            setTimeout(function () {
                _this.formControlAccountName.nativeElement.focus();
                _this.storeData['formGroup'].address.controls['AccountAddressLine1'].reset();
            }, 100);
        }
        this.lastActivatedTabIndex = 0;
        setTimeout(function () {
            var elemList = document.querySelectorAll('.tab-container .nav-tabs li a');
            for (var l = 0; l < elemList.length; l++) {
                if (elemList[l]) {
                    _this.renderer.listen(elemList[l], 'focus', function (event) {
                        _this.setFocusToTabElement();
                    });
                }
            }
        }, 100);
    };
    AccountMaintenanceComponent.prototype.onSubmit = function (formdata, valid, event) {
        this.accountFormGroup.controls['PageError'].setValue('');
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        event.preventDefault();
        for (var j in this.fieldVisibility) {
            if (j) {
                var key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.accountFormGroup.controls[key]) {
                        this.accountFormGroup.controls[key].clearValidators();
                    }
                }
            }
        }
        for (var i in this.accountFormGroup.controls) {
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
    };
    AccountMaintenanceComponent.prototype.onUpdate = function () {
        this.saveBtn = true;
        this.routeAwayGlobals.setSaveEnabledFlag(true);
        this.updateMode = true;
        this.addMode = false;
        this.searchMode = false;
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_MODE, payload: {
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
    };
    AccountMaintenanceComponent.prototype.onFetch = function () {
        var _this = this;
        this.updateMode = true;
        this.addMode = false;
        this.searchMode = false;
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_MODE, payload: {
                updateMode: this.updateMode,
                addMode: this.addMode,
                searchMode: this.searchMode
            }
        });
        this.fetchAccountData('', {}).subscribe(function (e) {
            if (e.status === 'failure') {
                showLookUp();
            }
            else {
                if (e && e.AccountNumber) {
                    _this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_DATA, payload: e });
                    var dataset = { data: e };
                    _this.getVirtualTableData(dataset);
                }
                else {
                    showLookUp();
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
        function showLookUp() {
            if ((typeof this.accountNumberEllipsis !== 'undefined') && this.accountNumberEllipsis) {
                this.inputParams.accountNumber = this.accountFormGroup.controls['AccountNumber'].value;
                this.accountNumberEllipsis.configParams = this.inputParams;
                this.accountNumberEllipsis.updateComponent();
                this.accountNumberEllipsis.openModal();
                return;
            }
        }
        this.riMaintenance_AfterFetch();
    };
    AccountMaintenanceComponent.prototype.onSelect = function () {
        this.isAccountNumberEllipsisDisabled = false;
        this.autoOpenSearch = true;
        this.updateMode = false;
        this.addMode = false;
        this.searchMode = true;
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_MODE, payload: {
                updateMode: this.updateMode,
                addMode: this.addMode,
                searchMode: this.searchMode
            }
        });
        if (this.accountFormGroup.controls['AccountNumber'].value) {
        }
    };
    AccountMaintenanceComponent.prototype.onCancel = function () {
        var _this = this;
        event.preventDefault();
        this.autoOpenSearch = false;
        this.isAccountNumberEllipsisDisabled = false;
        this.updateBtn = true;
        this.searchBtn = true;
        this.fetchBtn = false;
        this.saveBtn = false;
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        if (this.addMode) {
            this.accountFormGroup.reset();
            for (var key in this.accountFormGroup.controls) {
                if (this.accountFormGroup.controls[key]) {
                    this.accountFormGroup.controls[key].disable();
                }
            }
            if (this.storeData['formGroup'].address !== false) {
                var cmdGetAddress = this.storeData['formGroup'].address.controls['cmdGetAddress'].value;
                var btnAmendContact = this.storeData['formGroup'].address.controls['BtnAmendContact'].value;
                var btnSendToNAV = this.storeData['formGroup'].address.controls['BtnSendToNAV'].value;
                this.storeData['formGroup'].address.reset();
                this.storeData['formGroup'].address.controls['cmdGetAddress'].setValue(cmdGetAddress);
                this.storeData['formGroup'].address.controls['BtnAmendContact'].setValue(btnAmendContact);
                this.storeData['formGroup'].address.controls['BtnSendToNAV'].setValue(btnSendToNAV);
                for (var key in this.storeData['formGroup'].address.controls) {
                    if (this.storeData['formGroup'].address.controls[key]) {
                        this.storeData['formGroup'].address.controls[key].disable();
                    }
                }
            }
            if (this.storeData['formGroup'].accountManagement !== false) {
                var cmdAddOwner = this.storeData['formGroup'].accountManagement.controls['cmdAddOwner'].value;
                this.storeData['formGroup'].accountManagement.reset();
                this.storeData['formGroup'].accountManagement.controls['cmdAddOwner'].setValue(cmdAddOwner);
                for (var key in this.storeData['formGroup'].accountManagement.controls) {
                    if (this.storeData['formGroup'].accountManagement.controls[key]) {
                        this.storeData['formGroup'].accountManagement.controls[key].disable();
                    }
                }
            }
            if (this.storeData['formGroup'].general !== false) {
                this.storeData['formGroup'].general.reset();
                for (var key in this.storeData['formGroup'].general.controls) {
                    if (this.storeData['formGroup'].general.controls[key]) {
                        this.storeData['formGroup'].general.controls[key].disable();
                    }
                }
            }
            if (this.storeData['formGroup'].bankDetails !== false) {
                var cmdGenerateNew = this.storeData['formGroup'].bankDetails.controls['cmdGenerateNew'].value;
                this.storeData['formGroup'].bankDetails.reset();
                this.storeData['formGroup'].bankDetails.controls['cmdGenerateNew'].setValue(cmdGenerateNew);
                for (var key in this.storeData['formGroup'].bankDetails.controls) {
                    if (this.storeData['formGroup'].bankDetails.controls[key]) {
                        this.storeData['formGroup'].bankDetails.controls[key].disable();
                    }
                }
            }
            if (this.storeData['formGroup'].ediInvoicing !== false) {
                var cmdSetInvoiceGroupEDI = this.storeData['formGroup'].ediInvoicing.controls['cmdSetInvoiceGroupEDI'].value;
                this.storeData['formGroup'].ediInvoicing.reset();
                this.storeData['formGroup'].ediInvoicing.controls['cmdSetInvoiceGroupEDI'].setValue(cmdSetInvoiceGroupEDI);
                for (var key in this.storeData['formGroup'].ediInvoicing.controls) {
                    if (this.storeData['formGroup'].ediInvoicing.controls[key]) {
                        this.storeData['formGroup'].ediInvoicing.controls[key].disable();
                    }
                }
            }
            if (this.storeData['formGroup'].invoiceText !== false) {
                var cmdSetInvoiceGroupDefault = this.storeData['formGroup'].invoiceText.controls['cmdSetInvoiceGroupDefault'].value;
                this.storeData['formGroup'].invoiceText.reset();
                this.storeData['formGroup'].invoiceText.controls['cmdSetInvoiceGroupDefault'].setValue(cmdSetInvoiceGroupDefault);
                for (var key in this.storeData['formGroup'].invoiceText.controls) {
                    if (this.storeData['formGroup'].invoiceText.controls[key]) {
                        this.storeData['formGroup'].invoiceText.controls[key].disable();
                    }
                }
            }
            if (this.storeData['formGroup'].teleSales !== false) {
                this.storeData['formGroup'].teleSales.reset();
                for (var key in this.storeData['formGroup'].teleSales.controls) {
                    if (this.storeData['formGroup'].teleSales.controls[key]) {
                        this.storeData['formGroup'].teleSales.controls[key].disable();
                    }
                }
            }
            if (this.storeData['formGroup'].discounts !== false) {
                this.storeData['formGroup'].discounts.reset();
                for (var key in this.storeData['formGroup'].discounts.controls) {
                    if (this.storeData['formGroup'].discounts.controls[key]) {
                        this.storeData['formGroup'].discounts.controls[key].disable();
                    }
                }
            }
            this.searchMode = true;
            this.updateMode = false;
            this.addMode = false;
            this.store.dispatch({
                type: AccountMaintenanceActionTypes.SAVE_MODE, payload: {
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
                setTimeout(function () {
                    _this.accountNumberEllipsis.configParams = _this.inputParams;
                    _this.accountNumberEllipsis.updateComponent();
                    _this.accountNumberEllipsis.openModal();
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
        }
        this.setDefaultEllipsisConfig();
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
        this.resetErrorTab();
    };
    AccountMaintenanceComponent.prototype.beforeUpdate = function () {
        this.accountFormGroup.controls['AccountOwningBranch'].disable();
        this.dropdown.AccountOwningBranch.disabled = true;
        this.accountFormGroup.updateValueAndValidity();
    };
    AccountMaintenanceComponent.prototype.afterSave = function () {
        if (this.sysCharParams['vSCMultiContactInd'] === true) {
            this.storeData['fieldVisibility'].address.spanAmendContact = true;
            this.storeData['fieldVisibility'].address.spanEmergencyContact = true;
        }
        if (this.sysCharParams['vSCEnableSEPAFinanceMandate'] === true || this.sysCharParams['vSCEnableSEPAFinanceMandateLog'] === true) {
            this.storeData['formGroup'].bankDetails.controls['selMandateTypeCode'].disable();
        }
    };
    AccountMaintenanceComponent.prototype.afterAbandon = function () {
        this.storeData['formGroup'].address.controls['cmdAddOwner'].disable();
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
    };
    AccountMaintenanceComponent.prototype.promptSave = function (event) {
        if (this.updateMode) {
            this.updateAccountData();
        }
        else if (this.addMode) {
            this.addAccountData();
        }
    };
    AccountMaintenanceComponent.prototype.onSelectTab = function (data) {
        this.lastActivatedTabIndex = data.tabIndex;
        var tabsUlList = document.querySelectorAll('ul.nav-tabs li');
        if (tabsUlList) {
            var tabsElemList = document.querySelectorAll('.tab-content .tab-pane');
            for (var i = 0; i < tabsElemList.length; i++) {
                if (i.toString() === data.tabIndex.toString()) {
                    var elementListQuery = 'input:not([disabled]) , select:not([disabled]), textarea:not([disabled])';
                    var tabItemList = tabsElemList[i].querySelectorAll(elementListQuery);
                    var _loop_1 = function(l) {
                        var el = tabItemList[l];
                        if (el) {
                            if (el.getAttribute('type') && el.getAttribute('type').toLowerCase() !== 'hidden') {
                                setTimeout(function () {
                                    el['focus']();
                                }, 100);
                                return "break";
                            }
                        }
                    };
                    for (var l = 0; l < tabItemList.length; l++) {
                        var state_1 = _loop_1(l);
                        if (state_1 === "break") break;
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
        this.routeAwayUpdateSaveFlag();
        this.store.dispatch({ type: AccountMaintenanceActionTypes.TAB_CHANGE, payload: {} });
    };
    AccountMaintenanceComponent.prototype.getElementByTabIndex = function (tabindex) {
        var elementList = document.querySelector('[tabindex=' + tabindex + ']');
        return elementList;
    };
    AccountMaintenanceComponent.prototype.setFocusToTabElement = function () {
        var tabsUlList = document.querySelectorAll('ul.nav-tabs li');
        if (tabsUlList) {
            var tabsElemList = document.querySelectorAll('.tab-content .tab-pane');
            for (var i = 0; i < tabsElemList.length; i++) {
                if (this.utilService.hasClass(tabsElemList[i], 'active')) {
                    var elementListQuery = 'input:not([disabled]) , select:not([disabled]), textarea:not([disabled])';
                    var tabItemList = tabsElemList[i].querySelectorAll(elementListQuery);
                    var _loop_2 = function(l) {
                        var el = tabItemList[l];
                        if (el) {
                            if (el.getAttribute('type') && el.getAttribute('type').toLowerCase() !== 'hidden') {
                                setTimeout(function () {
                                    el['focus']();
                                }, 100);
                                return "break";
                            }
                        }
                    };
                    for (var l = 0; l < tabItemList.length; l++) {
                        var state_2 = _loop_2(l);
                        if (state_2 === "break") break;
                    }
                }
            }
        }
    };
    AccountMaintenanceComponent.prototype.resetErrorTab = function () {
        var tabsUlList = document.querySelectorAll('ul.nav-tabs li');
        if (tabsUlList) {
            for (var i = 0; i < tabsUlList.length; i++) {
                tabsUlList[i].classList.remove('red-bdr');
            }
        }
    };
    AccountMaintenanceComponent.prototype.showErrorTabs = function () {
        var tabsUlList = document.querySelectorAll('ul.nav-tabs li');
        if (tabsUlList) {
            var tabsElemList = document.querySelectorAll('.tab-content .tab-pane');
            for (var i = 0; i < tabsElemList.length; i++) {
                if (tabsElemList[i].querySelectorAll('input.ng-invalid.ng-touched, textarea.ng-invalid.ng-touched').length > 0) {
                    tabsUlList[i].classList.add('red-bdr');
                }
                else {
                    tabsUlList[i].classList.remove('red-bdr');
                }
            }
        }
    };
    AccountMaintenanceComponent.prototype.setLastActivatedTab = function () {
        if (this.riTab) {
            this.lastActivatedTabIndex = this.lastActivatedTabIndex || 0;
            if (this.riTab.tabs && (this.lastActivatedTabIndex < this.riTab.tabs.length)) {
                this.riTab.tabFocusTo(this.lastActivatedTabIndex);
            }
        }
    };
    AccountMaintenanceComponent.prototype.setDefaultEllipsisConfig = function () {
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
            this.accountNumberEllipsis.childConfigParams = this.inputParams;
            this.accountNumberEllipsis.updateComponent();
        }
    };
    AccountMaintenanceComponent.prototype.AccountOwningBranchOnChange = function (obj) {
        if (obj) {
            if (obj.BranchNumber) {
                this.accountFormGroup.controls['AccountOwningBranch'].setValue(obj.BranchNumber);
            }
            if (obj.BranchName) {
            }
        }
    };
    AccountMaintenanceComponent.prototype.initializeForm = function () {
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
            this.setVisibleField(this.tabName.address, 'trVATExempt', true);
        }
        else {
            this.setVisibleField(this.tabName.address, 'trVATExempt', false);
        }
        if (this.sysCharParams['SCEnablePDADebt'] === true) {
            this.setVisibleField(this.tabName.address, 'trExcludePDADebt', true);
        }
        else {
            this.setVisibleField(this.tabName.address, 'trExcludePDADebt', false);
        }
        this.disableFormGroupControl('BtnSendToNAV', true);
        if (this.sysCharParams['vSCSendOneOffAccntToNAV'] === true) {
            this.setVisibleField(this.tabName.address, 'BtnSendToNAV', true);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusNOTSENT', true);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusOK', false);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusFAIL', false);
        }
        else {
            this.setVisibleField(this.tabName.address, 'BtnSendToNAV', false);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusNOTSENT', false);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusOK', false);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusFAIL', false);
        }
        this.disableFormGroupControl('cmdGetAddress', true);
        this.disableFormGroupControl('cmdSetInvoiceGroupDefault', true);
        this.disableFormGroupControl('cmdSetInvoiceGroupEDI', true);
        if (!this.sysCharParams['vglAllowUserAuthUpdate']) {
        }
        if (this.otherParams.cEmployeeLimitChildDrillOptions !== 'Y') {
            this.fieldVisibility.menuControl = true;
        }
        if (this.sysCharParams['vSCCapitalFirstLtr'] === true) {
            this.riMaintenanceAddTableField('AccountName', MntConst.eTypeTextFree, 'Required');
        }
        else {
            this.riMaintenanceAddTableField('AccountName', MntConst.eTypeText, 'Required');
        }
        this.riMaintenanceAddTableField('LiveAccount', MntConst.eTypeCheckBox, 'Optional');
        this.riMaintenanceAddTableField('IncludeMarketingCampaign', MntConst.eTypeCheckBox, 'Optional');
        if (this.sysCharParams['vSCCapitalFirstLtr']) {
            this.riMaintenanceAddTableField('AccountAddressLine1', MntConst.eTypeTextFree, 'Required');
            this.riMaintenanceAddTableField('AccountAddressLine2', MntConst.eTypeTextFree, 'Optional');
            if (this.sysCharParams['vSCAddressLine3Logical']) {
                this.riMaintenanceAddTableField('AccountAddressLine3', MntConst.eTypeTextFree, 'Required');
            }
            else {
                this.riMaintenanceAddTableField('AccountAddressLine3', MntConst.eTypeTextFree, 'Optional');
            }
            if (this.sysCharParams['vSCAddressLine4Logical']) {
                this.riMaintenanceAddTableField('AccountAddressLine4', MntConst.eTypeTextFree, 'Required');
            }
            else {
                if (!this.sysCharParams['vbEnablePostcodeSuburbLog'] && this.sysCharParams['vbEnableValidatePostcodeSuburb']) {
                    this.riMaintenanceAddTableField('AccountAddressLine4', MntConst.eTypeTextFree, 'Optional');
                }
                else {
                    this.riMaintenanceAddTableField('AccountAddressLine4', MntConst.eTypeTextFree, 'Required');
                }
            }
            if (this.sysCharParams['vSCAddressLine5Logical']) {
                this.riMaintenanceAddTableField('AccountAddressLine5', MntConst.eTypeTextFree, 'Required');
            }
            else {
                this.riMaintenanceAddTableField('AccountAddressLine5', MntConst.eTypeTextFree, 'Optional');
            }
        }
        else {
            this.riMaintenanceAddTableField('AccountAddressLine1', MntConst.eTypeText, 'Required');
            this.riMaintenanceAddTableField('AccountAddressLine2', MntConst.eTypeText, 'Optional');
            if (this.sysCharParams['vSCAddressLine3Logical']) {
                this.riMaintenanceAddTableField('AccountAddressLine3', MntConst.eTypeText, 'Required');
            }
            else {
                this.riMaintenanceAddTableField('AccountAddressLine3', MntConst.eTypeText, 'Optional');
            }
            if (this.sysCharParams['vSCAddressLine4Logical']) {
                this.riMaintenanceAddTableField('AccountAddressLine4', MntConst.eTypeText, 'Required');
            }
            else {
                if (!this.sysCharParams['vbEnablePostcodeSuburbLog'] && this.sysCharParams['vbEnableValidatePostcodeSuburb']) {
                    this.riMaintenanceAddTableField('AccountAddressLine4', MntConst.eTypeText, 'Optional');
                }
                else {
                    this.riMaintenanceAddTableField('AccountAddressLine4', MntConst.eTypeText, 'Required');
                }
            }
            if (this.sysCharParams['vSCAddressLine5Logical']) {
                this.riMaintenanceAddTableField('AccountAddressLine5', MntConst.eTypeText, 'Required');
            }
            else {
                this.riMaintenanceAddTableField('AccountAddressLine5', MntConst.eTypeText, 'Optional');
            }
        }
        if (this.sysCharParams['vSCHidePostcode']) {
            this.riMaintenanceAddTableField('AccountPostcode', MntConst.eTypeCode, 'Optional');
        }
        else {
            this.riMaintenanceAddTableField('AccountPostcode', MntConst.eTypeCode, 'Required');
        }
        this.riMaintenanceAddTableField('CountryCode', MntConst.eTypeCode, 'Required');
        if (this.sysCharParams['vSCCapitalFirstLtr']) {
            this.riMaintenanceAddTableField('AccountContactName', MntConst.eTypeTextFree, 'Required');
            this.riMaintenanceAddTableField('AccountContactPosition', MntConst.eTypeTextFree, 'Required');
        }
        else {
            this.riMaintenanceAddTableField('AccountContactName', MntConst.eTypeText, 'Required');
            this.riMaintenanceAddTableField('AccountContactPosition', MntConst.eTypeText, 'Required');
        }
        this.riMaintenanceAddTableField('AccountContactDepartment', MntConst.eTypeText, 'Optional');
        this.riMaintenanceAddTableField('AccountContactTelephone', MntConst.eTypeText, 'Required');
        this.riMaintenanceAddTableField('AccountContactMobile', MntConst.eTypeText, 'Optional');
        this.riMaintenanceAddTableField('AccountContactFax', MntConst.eTypeText, 'Optional');
        this.riMaintenanceAddTableField('AccountContactEmail', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenanceAddTableField('BankAccountSortCode', MntConst.eTypeText, 'Optional');
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
        }
        else {
            this.riMaintenanceAddTableField('AccountOwner', MntConst.eTypeCode, 'Optional');
        }
        if (this.sysCharParams['vSCMandatoryAccOCLevel'] === 2 || this.sysCharParams['vSCMandatoryAccOCLevel'] === 3) {
            this.riMaintenanceAddTableField('CategoryCode', MntConst.eTypeCode, 'Requried');
        }
        else {
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
        this.riMaintenanceAddTableField('ExcludePDADebtInd', MntConst.eTypeCheckBox, 'Optional');
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
    };
    AccountMaintenanceComponent.prototype.riMaintenance_BeforeMode = function () {
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
    };
    AccountMaintenanceComponent.prototype.riMaintenance_BeforeAddMode = function () {
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
    };
    AccountMaintenanceComponent.prototype.riMaintenance_AfterFetch = function () {
        if (this.sysCharParams['vSCMultiContactInd'] === true) {
            this.setVisibleField(this.tabName.address, 'spanAmendContact', true);
            this.setVisibleField(this.tabName.address, 'spanEmergencyContact', true);
        }
        if (this.getformGroupControlValue('CustomerInfoAvailable') === true) {
            this.setVisibleField(this.tabName.main, 'tdCustomerInfo', true);
        }
        else {
            this.setVisibleField(this.tabName.main, 'tdCustomerInfo', false);
        }
        if (this.getformGroupControlValue('BadDebtAccount') === true) {
            this.setVisibleField(this.tabName.main, 'tdBadDebtAccount', true);
        }
        else {
            this.setVisibleField(this.tabName.main, 'tdBadDebtAccount', false);
        }
        if (this.getformGroupControlValue('PNOL') === true) {
            this.setVisibleField(this.tabName.main, 'tdPNOL', true);
        }
        else {
            this.setVisibleField(this.tabName.main, 'tdPNOL', false);
        }
        if (this.sysCharParams['vSCSendOneOffAccntToNAV'] === true) {
            this.disableFormGroupControl('BtnSendToNAV', false);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusNOTSENT', true);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusOK', false);
            this.setVisibleField(this.tabName.address, 'tdSentToNAVStatusFAIL', false);
        }
        this.showHideFields();
        if (this.sysCharParams['vSCEnableSEPAFinanceMandate'] === true || this.sysCharParams['vSCEnableSEPAFinanceMandateLog'] === true) {
            if (this.getformGroupControlValue('MandateTypeCode')) {
                this.setformGroupControlValue('selMandateTypeCode', this.getformGroupControlValue('MandateTypeCode'));
            }
            else {
                this.setformGroupControlValue('selMandateTypeCode', '');
            }
            this.disableFormGroupControl('selMandateTypeCode', true);
        }
    };
    AccountMaintenanceComponent.prototype.sensitiseContactDetails = function (lSensitise) {
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
    };
    AccountMaintenanceComponent.prototype.getformGroupControl = function (controlName) {
        if (this.storeData) {
            for (var tab in this.storeData['formGroup']) {
                if (tab) {
                    if (this.storeData['formGroup'][tab].controls.hasOwnProperty(controlName)) {
                        return { tab: tab, control: this.storeData['formGroup'][tab].controls[controlName] };
                    }
                }
            }
        }
        return null;
    };
    AccountMaintenanceComponent.prototype.getformGroupControlValue = function (controlName, tab) {
        if (this.storeData && this.storeData['formGroup']) {
            if (tab) {
                if (this.storeData['formGroup'][tab] && this.storeData['formGroup'][tab].controls.hasOwnProperty(controlName)) {
                    return this.storeData['formGroup'][tab].controls[controlName].value;
                }
            }
            else {
                for (var t in this.storeData['formGroup']) {
                    if (t) {
                        if (this.storeData['formGroup'][t] && this.storeData['formGroup'][t].controls.hasOwnProperty(controlName)) {
                            return this.storeData['formGroup'][t].controls[controlName].value;
                        }
                    }
                }
            }
        }
        return null;
    };
    AccountMaintenanceComponent.prototype.getformGroup = function (controlName) {
        if (this.storeData) {
            for (var tab in this.storeData['formGroup']) {
                if (tab) {
                    if (this.storeData['formGroup'][tab].controls.hasOwnProperty(controlName)) {
                        return { tab: tab, formGroup: this.storeData['formGroup'][tab] };
                    }
                }
            }
        }
        return null;
    };
    AccountMaintenanceComponent.prototype.setformGroupControlValue = function (controlName, val, tab) {
        if (this.storeData && this.storeData['formGroup']) {
            if (tab) {
                if (this.storeData['formGroup'][tab] && this.storeData['formGroup'][tab].controls.hasOwnProperty(controlName)) {
                    this.storeData['formGroup'][tab].controls[controlName].setValue(val);
                }
            }
            else {
                for (var t in this.storeData['formGroup']) {
                    if (t) {
                        if (this.storeData['formGroup'][t] && this.storeData['formGroup'][t].controls.hasOwnProperty(controlName)) {
                            this.storeData['formGroup'][t].controls[controlName].setValue(val);
                            break;
                        }
                    }
                }
            }
        }
    };
    AccountMaintenanceComponent.prototype.disableFormGroupControl = function (controlName, isDisable) {
        if (isDisable === void 0) { isDisable = true; }
        if (this.storeData && this.storeData['formGroup']) {
            for (var tab in this.storeData['formGroup']) {
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
    };
    AccountMaintenanceComponent.prototype.enableFormGroupControl = function (controlName, isEnable) {
        if (isEnable === void 0) { isEnable = true; }
        if (this.storeData && this.storeData['formGroup']) {
            for (var tab in this.storeData['formGroup']) {
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
    };
    AccountMaintenanceComponent.prototype.setRequiredStatus = function (controlName, isEnable) {
        if (isEnable === void 0) { isEnable = true; }
        var controlObj = {};
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
    };
    AccountMaintenanceComponent.prototype.setRequiredField = function (tab, controlName, val) {
        if (this.storeData && this.storeData['fieldRequired']) {
            var ctrlName = 'is' + controlName + 'Required';
            if (this.storeData['fieldRequired'][tab]) {
                if (this.storeData['fieldRequired'][tab].hasOwnProperty(ctrlName)) {
                    this.storeData['fieldRequired'][tab][ctrlName] = val;
                }
                else if (this.storeData['fieldRequired'][tab].hasOwnProperty(controlName)) {
                    this.storeData['fieldRequired'][tab][controlName] = val;
                }
            }
        }
    };
    AccountMaintenanceComponent.prototype.setVisibleField = function (tab, fieldName, val) {
        if (this.storeData && this.storeData['fieldVisibility'] && this.storeData['fieldVisibility'][tab]) {
            if (this.storeData['fieldVisibility'][tab].hasOwnProperty(fieldName)) {
                this.storeData['fieldVisibility'][tab][fieldName] = val;
            }
        }
    };
    AccountMaintenanceComponent.prototype.riMaintenanceAddTableField = function (controlName, type, option) {
        var controlObj = {};
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
    };
    AccountMaintenanceComponent.prototype.SetErrorStatus = function (controlName, flag) {
        var obj = this.getformGroup(controlName);
        if (obj && obj.formGroup) {
            if (flag) {
                obj.formGroup.controls[controlName].setErrors({ remote: '' });
            }
            else {
                obj.formGroup.controls[controlName].setErrors(null);
            }
        }
    };
    AccountMaintenanceComponent.prototype.isError = function (controlName, dataType) {
    };
    AccountMaintenanceComponent.prototype.applyFocusToControlById = function (controlId) {
        var _this = this;
        var focus = new Event('focus', { bubbles: false });
        setTimeout(function () {
            try {
                var obj = document.getElementById(controlId);
                if (obj) {
                    _this.renderer.invokeElementMethod(obj, 'focus', [focus]);
                }
            }
            catch (e) {
            }
        }, 0);
    };
    AccountMaintenanceComponent.prototype.applyFocusToControl = function (element) {
        var _this = this;
        var focus = new Event('focus', { bubbles: false });
        setTimeout(function () {
            try {
                _this.renderer.invokeElementMethod(element, 'focus', [focus]);
            }
            catch (e) {
            }
        }, 0);
    };
    AccountMaintenanceComponent.prototype.onSaveFocus = function (e) {
        var nextTab = 0;
        var code = (e.keyCode ? e.keyCode : e.which);
        var elemList = document.querySelectorAll('.tab-container .nav-tabs li a');
        var currentSelectedIndex = Array.prototype.indexOf.call(elemList, document.querySelector('.tab-container .nav-tabs li a.active'));
        if (code === 9 && currentSelectedIndex < (elemList.length - 1)) {
            var click = new MouseEvent('click', { bubbles: true });
            nextTab = currentSelectedIndex + 1;
            this.riTab.tabFocusTo(nextTab);
            setTimeout(function () {
                document.querySelector('.tab-container .tab-content .tab-pane:nth-child(' + nextTab + ') .ui-select-toggle, .tab-container .tab-content .tab-pane.active input:not([disabled]), .tab-container .tab-content .tab-pane.active select:not([disabled])')['focus']();
            }, 100);
        }
        return;
    };
    AccountMaintenanceComponent.prototype.removeSpaceFromValue = function (dataSet) {
        if (dataSet) {
            try {
                Object.keys(dataSet).forEach(function (key, idx) {
                    if (dataSet[key]) {
                        dataSet[key] = dataSet[key].trim();
                    }
                });
            }
            catch (e) {
            }
        }
    };
    AccountMaintenanceComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    AccountMaintenanceComponent.prototype.routeAwayUpdateSaveFlag = function () {
        this.routeAwayGlobals.setDirtyFlag(true);
    };
    AccountMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-account-maintenance',
                    templateUrl: 'iCABSAAccountMaintenance.html',
                    providers: [ComponentInteractionService, ErrorService, MessageService]
                },] },
    ];
    AccountMaintenanceComponent.ctorParameters = [
        { type: Router, },
        { type: ActivatedRoute, },
        { type: ComponentInteractionService, },
        { type: NgZone, },
        { type: HttpService, },
        { type: FormBuilder, },
        { type: ServiceConstants, },
        { type: ErrorService, },
        { type: MessageService, },
        { type: AuthService, },
        { type: AjaxObservableConstant, },
        { type: Title, },
        { type: SysCharConstants, },
        { type: Store, },
        { type: Logger, },
        { type: TranslateService, },
        { type: LocalStorageService, },
        { type: Http, },
        { type: LocaleTranslationService, },
        { type: SpeedScriptConstants, },
        { type: Utils, },
        { type: RouteAwayGlobals, },
        { type: RiExchange, },
        { type: CBBService, },
        { type: Renderer, },
    ];
    AccountMaintenanceComponent.propDecorators = {
        'accountNumberEllipsis': [{ type: ViewChild, args: ['accountNumberEllipsis',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'formControlAccountNumber': [{ type: ViewChild, args: ['AccountNumber',] },],
        'formControlAccountName': [{ type: ViewChild, args: ['AccountName',] },],
        'riTab': [{ type: ViewChild, args: ['AccountMaintenanceTabs',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return AccountMaintenanceComponent;
}());
