var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, ViewChild, Injector, Renderer } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { NavigationStart } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { NavData } from '../../../shared/services/navigationData';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { SysCharConstants } from '../../../shared/constants/syscharservice.constant';
import { SpeedScriptConstants } from '../../../shared/constants/speed-script.constant';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { CallCenterActionTypes } from '../../actions/call-centre-search';
import { Subject } from 'rxjs/Subject';
import { CallCenterGridAccountsComponent } from '../CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridAccounts.component';
import { CallCenterGridCallLogsComponent } from '../CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridCallLogs.component';
import { CallCenterGridContractsComponent } from '../CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridContracts.component';
import { CallCenterGridDashboardComponent } from '../CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridDashboard.component';
import { CallCenterGriddlContractComponent } from '../CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGriddlContract.component';
import { CallCenterGridEventHistoryComponent } from '../CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridEventHistory.component';
import { CallCenterGridHistoryComponent } from '../CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridHistory.component';
import { CallCenterGridInvoicesComponent } from '../CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridInvoices.component';
import { CallCenterGridPremisesComponent } from '../CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridPremises.component';
import { CallCenterGridWorkOrdersComponent } from '../CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridWorkOrders.component';
export var CallCentreGridComponent = (function (_super) {
    __extends(CallCentreGridComponent, _super);
    function CallCentreGridComponent(injector, titleService, fb, SysCharConstants, SpeedScriptConstants, renderer) {
        var _this = this;
        _super.call(this, injector);
        this.titleService = titleService;
        this.fb = fb;
        this.SysCharConstants = SysCharConstants;
        this.SpeedScriptConstants = SpeedScriptConstants;
        this.renderer = renderer;
        this.controls = [];
        this.pageId = PageIdentifier.ICABSCMCALLCENTREGRID;
        this.tabs = [];
        this.componentList = [];
        this.fieldVisibility = {
            CountryCode: true,
            BusinessCode: true,
            AccountProspectNumber: true,
            AccountProspectName: true,
            VisibleCurrentCallLogID: true,
            AccountProspectContactName: true,
            TdContactManagementWarning: false,
            TdBlankWarning: false,
            CmdEmployee: true,
            CmdNotepad: true,
            CmdNewCall: false,
            CmdEndCall: true,
            CmdUpdateAccount: true,
            CmdUpdateProspect: true,
            CmdNewCContact: true,
            CmdViewEmployee: true
        };
        this.list = {
            ContractType: '',
            ContractTypeDesc: '',
            ContractStatusCode: '',
            ContractStatusCodeDesc: '',
            PremiseStatusCode: '',
            PremiseStatusCodeDesc: ''
        };
        this.queryCallCentre = new URLSearchParams();
        this.queryParamsCallCenter = {
            action: '0',
            operation: 'ContactManagement/iCABSCMCallCentreGrid',
            module: 'call-centre',
            method: 'ccm/maintenance',
            contentType: 'application/x-www-form-urlencoded'
        };
        this.promptTitle = '';
        this.promptContent = '';
        this.businessData = {};
        this.showMessageHeader = true;
        this.showErrorHeader = true;
        this.loggedInBranch = '';
        this.regSection = 'Contact Centre Search';
        this.registry = {
            giLoop: '',
            gcBusinessCode: '',
            gcContractTypeCodes: '',
            gcContractTypeDescs: '',
            gcContractPortfolioStatusCodes: '',
            gcContractPortfolioStatusDescs: '',
            gcPremisePortfolioStatusCodes: '',
            gcPremisePortfolioStatusDescs: '',
            gcPortfolioStatusDesc: '',
            gcDefaultAccountSearch: '',
            gcDefaultAccountContractType: '',
            gcDefaultLiveAccount: '',
            gcDefaultNationalAccount: '',
            gcDefaultNationalAccountWhenInBr: '',
            gcDefaultAccountSearchType: '',
            gcDefaultContractType: '',
            gcDefaultContractPortfolioStatus: '',
            gcAccountPassLiveAccount: '',
            gcAccountPassContractType: '',
            gcAccountPassSearchTypeValue: '',
            gcShowNotepadWhenEndCall: '',
            gcDefaultBusinessOriginCode: '',
            gcDefaultBusinessOriginDesc: '',
            gcDefaultContactMediumCode: '',
            gcDefaultContactMediumDesc: '',
            gcDefaultProspectSourceCode: '',
            gcDefaultProspectTypeCode: '',
            gcDefaultCallSearchType: '',
            gcCallLogStartDateDays: '',
            giCallDateDays: '',
            gcWODateFromDays: '',
            giWOFromDays: '',
            gcWODateToDays: '',
            giWOToDays: '',
            gcDefaultEventHistorySearchType: '',
            gcEventHistoryDateFromDays: '',
            giEventHistoryFromDays: '',
            gcEventHistoryDateToDays: '',
            gcDefaultHistorySearchType: '',
            gcHistoryDateFromDays: '',
            giHistoryFromDays: '',
            gcHistoryDateToDays: '',
            giHistoryToDays: '',
            gcSelectedOption: '',
            gcPermissionDeniedMessage: '',
            glLimitEmployeeDataView: '',
            gcCountryDataList: '',
            gcOccupationCodeList: '',
            gcEmployeeLimitChildDrillOptions: '',
            gcWarnNewSearchAndCurrentLogID: '',
            gcShowAdvantageQuotes: '',
            gcContractPremiseSearchDelim: '',
            glSCEnableAddressLine3: '',
            glSCShowInfestations: '',
            glShowRecommendations: '',
            giContractCommenceFromDays: '',
            giPremiseCommenceFromDays: '',
            gcContractCommenceDateFromDays: '',
            gcPremiseCommenceDateFromDays: '',
            giContractCommenceToDays: '',
            giPremiseCommenceToDays: '',
            gcContractCommenceDateToDays: '',
            gcPremiseCommenceDateToDays: '',
            glShowInvoiceBalance: '',
            giNumBusinesses: '',
            glMultiContactInd: ''
        };
        this.syschars = {
            glSCEnableAddressLine3: '',
            glSCShowInfestations: '',
            glLimitEmployeeDataView: '',
            gcCountryDataList: '',
            glLimitOccupationEmployeeDataView: '',
            gcOccupationCodeList: ''
        };
        this.webSpeedVariables = {
            lRefreshAccountGrid: false,
            lRefreshDashboardGrid: true,
            lRefreshContractGrid: true,
            lRefreshPremiseGrid: true,
            lRefreshInvoiceGrid: true,
            lRefreshCallLogGrid: true,
            lRefreshEventHistoryGrid: true,
            lRefreshHistoryGrid: true,
            lRefreshWorkOrderGrid: true,
            lRefreshdlContractGrid: true,
            lClosingLogBeforeProceed: false,
            lRunningFromWOMaintTask: false,
            lForceWindowClose: false,
            cIsPropertyCareBranch: ''
        };
        this.otherVariables = {
            ConstAccountNoMaxLength: 9,
            ConstContractNoMaxLength: 8,
            ConstAccountSearchValueMaxLength: 40,
            CCMChangesMade: '',
            CurrentCallLogID: '',
            CurrentTabView: 'Initial',
            BusinessCode: '',
            ContractROWID: '',
            PremiseROWID: '',
            AccountNumber: '',
            ProspectNumber: '',
            AccountNumberType: 'A',
            ContractNumber: '',
            ContractName: '',
            ContractType: '',
            PremiseNumber: '',
            SelectedAddressLine4: '',
            SelectedAddressLine5: '',
            SelectedPostcode: '',
            ContractContactEmail: '',
            WONumber: '',
            PassContactRowID: '',
            PassProspectNumber: '',
            SelectedInvoice: '',
            SelectedInvoiceRowID: '',
            InvSelectedContract: '',
            InvSelectedPremise: '',
            CallLogSelectedContract: '',
            CallLogSelectedPremise: '',
            CustomerContactNumber: '',
            SelectedTicketNumber: '',
            ParentTaskTicketNumber: '',
            TicketAddressName: '',
            TicketAddressLine1: '',
            TicketAddressLine2: '',
            TicketAddressLine3: '',
            TicketAddressLine4: '',
            TicketAddressLine5: '',
            TicketProspectNumber: '',
            TicketServiceCoverNumber: '',
            TicketServiceCoverRowID: '',
            TicketShortDescription: '',
            TicketComments: '',
            CustomerContactRowID: '',
            WOSelectedContract: '',
            WOSelectedPremise: '',
            dlContractSelectedContract: '',
            dlContractSelectedPremise: '',
            WORunType: '',
            ProductCode: '',
            ProductDesc: '',
            ServiceCoverNumber: '',
            ServiceCoverROWID: '',
            EventHistorySelectedContract: '',
            EventHistorySelectedPremise: '',
            HistorySelectedContract: '',
            HistorySelectedPremise: '',
            LiveAccount: '',
            CurrentEventHistoryType: '',
            CurrentEventHistoryRowid: '',
            CurrentHistoryType: '',
            CurrentHistoryRowid: '',
            SelectedCallLogID: '',
            TechEmployeeCode: '',
            BusinessOriginCode: '',
            BusinessOriginDesc: '',
            ContactMediumCode: '',
            ContactMediumDesc: '',
            ProspectSourceCode: '',
            ProspectTypeCode: '',
            WindowClosingName: '',
            CallContactName: '',
            CallContactPosition: '',
            CallContactTelephone: '',
            CallContactFax: '',
            CallContactMobile: '',
            CallContactEmail: '',
            CallContactPostcode: '',
            CallTicketReference: '',
            CallNotepadSummary: '',
            NotificationCloseType: '0',
            CallNotepad: '',
            EmployeeLimitChildDrillOptions: '',
            ServiceDateStartFrom: '',
            ServiceDateStartTo: '',
            WORecommendationsExist: '',
            CreateCallLogInCCMInd: '',
            AccountLimitDataView: '',
            ContractLimitDataView: '',
            PremiseLimitDataView: ''
        };
        this.queryLookUp = new URLSearchParams();
        this.querySysChar = new URLSearchParams();
        this.storeData = {};
        this.storeFormDataClone = {
            main: {},
            tabAccounts: {},
            tabLogs: {},
            tabContracts: {},
            tabDashboard: {},
            tabDlContract: {},
            tabEventHistory: {},
            tabHistory: {},
            tabInvoices: {},
            tabPremises: {},
            tabWorkOrders: {},
            state: {
                main: {},
                tabAccounts: {},
                tabLogs: {},
                tabContracts: {},
                tabDashboard: {},
                tabDlContract: {},
                tabEventHistory: {},
                tabHistory: {},
                tabInvoices: {},
                tabPremises: {},
                tabWorkOrders: {}
            },
            pagination: {}
        };
        this.tabsTranslation = {
            tabAccounts: '',
            tabLogs: '',
            tabContracts: '',
            tabDashboard: '',
            tabDlContract: '',
            tabEventHistory: '',
            tabHistory: '',
            tabInvoices: '',
            tabPremises: '',
            tabWorkOrders: '',
            advantage: ''
        };
        this.subject = {
            CmdNewCallRecieved: '',
            CmdNewCallSent: ''
        };
        this.isFreshLoad = true;
        this.isNavAway = false;
        this.userCode = '';
        this.setErrorCallback(this);
        this.storeSubscription = this.store.select('callcentresearch').subscribe(function (data) {
            _this.storeData = data;
            if (data && data['action']) {
                switch (data['action']) {
                    case CallCenterActionTypes.INITIALIZATION:
                        if (data && data['initialization']) {
                            if (data['initialization'].tabAccounts === true && data['initialization'].tabContracts === true && data['initialization'].tabLogs === true && data['initialization'].tabDashboard === true && data['initialization'].tabEventHistory === true && data['initialization'].tabHistory === true && data['initialization'].tabInvoices === true && data['initialization'].tabPremises === true && data['initialization'].tabWorkOrders === true && data['initialization'].tabDlContract === true) {
                                _this.postInitialization();
                            }
                        }
                        break;
                    case CallCenterActionTypes.PORTFOLIO_CONTACT_DETAILS:
                        _this.portfolioContactDetails(_this.storeData['functionParams']);
                        break;
                    case CallCenterActionTypes.BUILD_TABS:
                        _this.buildTabs();
                        break;
                    case CallCenterActionTypes.DISPLAY_ERROR:
                        _this.errorService.emitError({
                            errorMessage: _this.storeData['errorMessage']
                        });
                        break;
                    case CallCenterActionTypes.DISPLAY_PROMPT_ERROR:
                        _this.promptModal.show();
                        break;
                    case CallCenterActionTypes.SHOW_PRINT_INVOICE:
                        _this.showInvoiceToScreen(_this.storeData['printInvoice']);
                        break;
                    case CallCenterActionTypes.SHOW_EMAIL_INVOICE:
                        _this.showInvoiceViaEmail(_this.storeData['emailInvoice']);
                        break;
                    case CallCenterActionTypes.RESET_ALL_SEARCH_DETAILS:
                        _this.resetAllSearchDetails();
                        break;
                    case CallCenterActionTypes.RESET_CALL_DETAILS:
                        _this.resetCallDetails();
                        break;
                    default:
                        break;
                }
                setTimeout(function () {
                    _this.storeData['action'] = '';
                }, 100);
            }
        });
        if (this.storeData['code'] && this.storeData['code'].business) {
            this.isFreshLoad = false;
        }
        this.storeData['code'].country = this.utils.getCountryCode();
        this.storeData['code'].business = this.utils.getBusinessCode();
        this.userCode = this.utils.getUserCode();
        this.formGroup = this.fb.group({
            CountryCode: [{ value: '', disabled: false }],
            BusinessCode: [{ value: '', disabled: false }],
            AccountProspectNumber: [{ value: '', disabled: true }],
            AccountProspectName: [{ value: '', disabled: true }],
            VisibleCurrentCallLogID: [{ value: '', disabled: false }],
            AccountProspectContactName: [{ value: '', disabled: true }],
            TdContactManagementWarning: [{ disabled: true }],
            TdBlankWarning: [{ disabled: true }],
            CmdUpdateAccount: [{ disabled: true }],
            CmdUpdateProspect: [{ disabled: true }],
            CmdNewCContact: [{ disabled: false }],
            CmdViewEmployee: [{ disabled: true }],
            CmdNotepad: [{ disabled: false }],
            CmdNewCall: [{ disabled: false }],
            CmdEndCall: [{ disabled: false }],
            CmdEmployee: [{ disabled: false }]
        });
    }
    CallCentreGridComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            _this.fetchTranslationContent();
        });
        this.httpService.riGetErrorMessage(2715, this.utils.getCountryCode(), this.utils.getBusinessCode()).subscribe(function (res) {
            if (res !== 0) {
                if (res === ErrorConstant.Message.ErrorMessageNotFound) {
                    _this.registry['gcPermissionDeniedMessage'] = MessageConstant.Message.PermissionDenied;
                }
                else {
                    _this.registry['gcPermissionDeniedMessage'] = res;
                }
            }
            else {
                _this.registry['gcPermissionDeniedMessage'] = MessageConstant.Message.PermissionDenied;
            }
        });
        this.buildTabs();
        if (!this.userCode) {
            this.userCode = this.utils.getUserCode();
        }
        this.pageQueryParams = this.riExchange.getRouterParams();
        this.storeData['code'].multiBusiness = this.utils.getBusinessCode();
        this.countryCodeList = this.cbbService.getCountryList();
        this.businessCodeList = this.cbbService.getBusinessListByCountry(this.storeData['code'].country);
        this.formGroup.controls['CountryCode'].setValue(this.storeData['code'].country);
        this.formGroup.controls['BusinessCode'].setValue(this.storeData['code'].business);
        this.onInit();
        this.store.dispatch({
            type: CallCenterActionTypes.FORM_GROUP, payload: {
                main: this.formGroup
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                main: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.TABS_TRANSLATION, payload: this.tabsTranslation
        });
        this.routerSubscriptionInternal = this.router.events.subscribe(function (event) {
            if (event instanceof NavigationStart) {
                if (event.url.indexOf('fromMenu=true') === -1 && event.url.indexOf('/postlogin') === -1 && event.url !== '/') {
                    var data = new NavData();
                    data.setPageId(_this.pageId);
                    _this.formClone();
                    data.setStoreData(_this.storeFormDataClone);
                    _this.riExchange.pushInNavigationData(data);
                    _this.cbbService.setCountryCode(_this.storeData['code'].country, true);
                    _this.cbbService.setBusinessCode(_this.storeData['code'].business, false, true);
                    _this.cbbService.disableComponent(true);
                    _this.isNavAway = true;
                }
                _this.storeData['action'] = '';
                if (_this.storeSubscription)
                    _this.storeSubscription.unsubscribe();
            }
        });
        this.subject['CmdNewCallRecieved'] = new Subject();
        this.subject['CmdNewCallSent'] = new Subject();
        this.storeData['subject'] = this.subject;
        this.subject['CmdNewCallRecieved'].asObservable().subscribe(function (recieved) {
            _this.cmdNewCallOnClick({}).subscribe(function (data) {
                _this.subject['CmdNewCallSent'].next(recieved);
            });
        });
    };
    CallCentreGridComponent.prototype.ngOnDestroy = function () {
        this.store.dispatch({
            type: CallCenterActionTypes.CLEAR_ALL
        });
        _super.prototype.ngOnDestroy.call(this);
        if (this.routerSubscriptionInternal) {
            this.routerSubscriptionInternal.unsubscribe();
        }
        if (this.subject['CmdNewCallRecieved']) {
            this.subject['CmdNewCallRecieved'].unsubscribe();
        }
        if (this.subject['CmdNewCallSent']) {
            this.subject['CmdNewCallSent'].unsubscribe();
        }
    };
    CallCentreGridComponent.prototype.onInit = function () {
        this.formGroup.controls['CmdUpdateAccount'].disable();
        this.formGroup.controls['CmdUpdateProspect'].disable();
        this.formGroup.controls['CmdNewCContact'].enable();
        this.formGroup.controls['CmdViewEmployee'].disable();
        this.registry.gcEmployeeLimitChildDrillOptions = 'N';
        this.registry.giNumBusinesses = this.businessCodeList.length;
        this.registry.gcContractPortfolioStatusCodes = 'L,FL,FT,PT,T,C';
        this.registry.gcPremisePortfolioStatusCodes = 'L,FL,FT,FD,PT,PD,T,D,C';
        this.registry.gcContractTypeCodes = 'all';
        this.registry.gcDefaultContractType = this.registry.gcContractTypeCodes;
    };
    CallCentreGridComponent.prototype.postInitialization = function () {
        var _this = this;
        this.triggerFetchSysChar();
        setTimeout(function () {
            _this.setupDisplayOnlyFields();
        }, 0);
        this.storeData['dropdownList'].tabAccounts.AccountContractType = [{
                value: '',
                desc: ''
            }];
        this.storeData['dropdownList'].tabContracts.ContractTypeCode = [{
                value: '',
                desc: ''
            }];
        this.storeData['dropdownList'].tabPremises.PremiseContractTypeCode = [{
                value: '',
                desc: ''
            }];
        this.storeData['dropdownList'].tabInvoices.InvoiceContractTypeCode = [{
                value: '',
                desc: ''
            }];
    };
    CallCentreGridComponent.prototype.fetchPortfolioDescription = function (portfolioStatusCodeList) {
        var portfolioData = [];
        for (var i = 0; i < portfolioStatusCodeList.length; i++) {
            portfolioData.push({
                'table': 'PortfolioStatusLang',
                'query': { 'PortfolioStatusCode': portfolioStatusCodeList[i] },
                'fields': ['PortfolioStatusCode', 'PortfolioStatusDesc']
            });
        }
        return this.lookUpRecord(portfolioData, 100);
    };
    CallCentreGridComponent.prototype.fetchRegistry = function () {
        var data = [
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account Default Search' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account Default Live Account' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account Default National Account' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account Default National Account (NatAcctBranch)' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account Default Contract Type' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account Passdown Contract Type' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account Passdown Live Account' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account Passdown Search Type Value' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account Default Search Type' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Contract Default Contract Type' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Contract Default Portfolio Status' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Show Notepad On End Call' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Default BusinessOriginCode' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Default ContactMediumCode' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Default ProspectTypeCode' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Default ProspectSourceCode' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'CallLog Default Search Type' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'CallLog DateFrom (Days)' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'WorkOrder DateFrom (Days)' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'WorkOrder DateTo (Days)' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Event History Default Search Type' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Event History DateFrom (Days)' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'History Default Search Type' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'History DateFrom (Days)' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'History DateTo (Days)' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account WarnWhenNewSearchAndCurrentLogID' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Advantage Show Quotes Tab' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account Contract/Premise Search Delimiter' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Contract Commence Date From (Days)' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Premise Commence Date From (Days)' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Contract Commence Date To (Days)' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Premise Commence Date To (Days)' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'WorkOrder Show Recommendations' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Invoice Show Balance Amount' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': this.SpeedScriptConstants.CNFContactPersonRegSection },
                'fields': ['RegSection']
            }
        ];
        return this.lookUpRecord(data, 100);
    };
    CallCentreGridComponent.prototype.windowInitialize = function () {
        var cTelesalesInd;
        if (this.registry.glSCEnableAddressLine3) {
            this.storeData['fieldVisibility'].tabAccounts.AccountAddressLine3 = true;
            this.storeData['fieldVisibility'].tabAccounts.AccountAddressLine3 = true;
        }
        cTelesalesInd = this.pageQueryParams['TelesalesInd'];
        if (cTelesalesInd === 'Y') {
            this.otherVariables.WindowClosingName = 'TelesalesAutoUpdateResult';
        }
        if (this.pageQueryParams && this.pageQueryParams['parentMode']) {
            this.formGroup.controls['CountryCode'].disable();
            this.formGroup.controls['BusinessCode'].disable();
            switch (this.pageQueryParams['parentMode']) {
                case 'ContactManagement':
                    if (this.pageQueryParams['ContractNumber'] && this.pageQueryParams['ContractNumber'] !== '') {
                        this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue('ContractNo');
                        if (this.pageQueryParams['PremiseNumber'] && this.pageQueryParams['PremiseNumber'] !== '') {
                            this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue(this.pageQueryParams['ContractNumber'] + '/' + this.pageQueryParams['PremiseNumber']);
                        }
                        else {
                            this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue(this.pageQueryParams['ContractNumber']);
                        }
                        this.storeData['formGroup'].tabAccounts.controls['AccountStatus'].setValue('all');
                        this.storeData['formGroup'].tabAccounts.controls['AccountNational'].setValue('all');
                        this.storeData['formGroup'].tabAccounts.controls['AccountContractType'].setValue('all');
                        this.storeData['formGroup'].tabAccounts.controls['AccountDataSet'].setValue('all');
                    }
                    else if (this.pageQueryParams['AccountNumber'] && this.pageQueryParams['AccountNumber'] !== '') {
                        this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue('AccountNo');
                        this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue(this.pageQueryParams['AccountNumber']);
                        this.storeData['formGroup'].tabAccounts.controls['AccountStatus'].setValue('all');
                        this.storeData['formGroup'].tabAccounts.controls['AccountNational'].setValue('all');
                        this.storeData['formGroup'].tabAccounts.controls['AccountContractType'].setValue('all');
                        this.storeData['formGroup'].tabAccounts.controls['AccountDataSet'].setValue('all');
                    }
                    break;
                case 'CallCentreReview':
                    this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue('CallRef');
                    this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue('SelectedCallLogID');
                    break;
                case 'CampaignEntry':
                    this.otherVariables.SelectedTicketNumber = this.pageQueryParams['CustomerContactNumber'];
                    this.otherVariables.ParentTaskTicketNumber = this.otherVariables.SelectedTicketNumber;
                    this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue('CustomerContactNo');
                    this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue(this.pageQueryParams['CustomerContactNumber']);
                    this.webSpeedVariables.lRunningFromWOMaintTask = true;
                    break;
                case 'WorkOrderMaintenanceAccountTask':
                case 'WorkOrderMaintenanceContractTask':
                case 'WorkOrderMaintenanceProspectTask':
                    this.otherVariables.SelectedTicketNumber = this.pageQueryParams['CustomerContactNumber'];
                    this.otherVariables.ParentTaskTicketNumber = this.otherVariables.SelectedTicketNumber;
                    this.webSpeedVariables.lRunningFromWOMaintTask = true;
                    break;
                default:
                    break;
            }
            if (this.pageQueryParams['parentMode'] === 'Account' || this.pageQueryParams['parentMode'] === 'WorkOrderMaintenanceAccount' || this.pageQueryParams['parentMode'] === 'WorkOrderMaintenanceAccountTask') {
                this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue('AccountNo');
                this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue(this.pageQueryParams['AccountNumber']);
                if (this.pageQueryParams['parentMode'] === 'Account') {
                    this.otherVariables.SelectedTicketNumber = this.pageQueryParams['CustomerContactNumber'];
                    this.otherVariables.ParentTaskTicketNumber = this.otherVariables.SelectedTicketNumber;
                    this.webSpeedVariables.lRunningFromWOMaintTask = true;
                }
            }
            if (this.pageQueryParams['parentMode'] === 'Contract' || this.pageQueryParams['parentMode'] === 'WorkOrderMaintenanceContract' || this.pageQueryParams['parentMode'] === 'WorkOrderMaintenanceContractTask') {
                this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue('ContractNo');
                this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue('ContractNumber');
                if (this.pageQueryParams['parentMode'] === 'Contract') {
                    this.otherVariables.SelectedTicketNumber = this.pageQueryParams['CustomerContactNumber'];
                    this.otherVariables.ParentTaskTicketNumber = this.otherVariables.SelectedTicketNumber;
                    this.webSpeedVariables.lRunningFromWOMaintTask = true;
                }
            }
            if (this.pageQueryParams['parentMode'] === 'WorkOrderMaintenancePremise') {
                this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue('ContractNo');
                this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue(this.pageQueryParams['ContractNumber'] + '/' + this.pageQueryParams['PremiseNumber']);
                this.otherVariables.SelectedTicketNumber = this.pageQueryParams['CustomerContactNumber'];
                this.otherVariables.ParentTaskTicketNumber = this.otherVariables.SelectedTicketNumber;
                this.webSpeedVariables.lRunningFromWOMaintTask = true;
            }
            if (this.pageQueryParams['parentMode'] === 'Premise' || this.pageQueryParams['parentMode'] === 'ServiceCover') {
                this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue('ContractNo');
                this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue(this.pageQueryParams['ContractNumber'] + '/' + this.pageQueryParams['PremiseNumber']);
            }
            if (this.pageQueryParams['parentMode'] === 'WorkOrderMaintenanceProspect' || this.pageQueryParams['parentMode'] === 'WorkOrderMaintenanceProspectTask') {
                this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue('ProspectNo');
                this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue(this.pageQueryParams['ProspectNumber']);
                this.otherVariables.SelectedTicketNumber = this.pageQueryParams['CustomerContactNumber'];
                this.otherVariables.ParentTaskTicketNumber = this.otherVariables.SelectedTicketNumber;
                this.webSpeedVariables.lRunningFromWOMaintTask = true;
            }
            if (this.webSpeedVariables.lRunningFromWOMaintTask) {
                this.storeData['formGroup'].tabLogs.controls['TicketContractNumber'].setValue(this.pageQueryParams['ContractNumber']);
                this.storeData['formGroup'].tabLogs.controls['TicketContractName'].setValue(this.pageQueryParams['ContractName']);
                this.storeData['formGroup'].tabLogs.controls['TicketPremiseNumber'].setValue(this.pageQueryParams['PremiseNumber']);
                this.storeData['formGroup'].tabLogs.controls['TicketPremiseName'].setValue(this.pageQueryParams['PremiseName']);
                this.storeData['formGroup'].tabLogs.controls['TicketContactPosition'].setValue(this.pageQueryParams['ContactPosition']);
                this.storeData['formGroup'].tabLogs.controls['TicketContactTelephone'].setValue(this.pageQueryParams['ContactTelephone']);
                this.storeData['formGroup'].tabLogs.controls['TicketContactFax'].setValue(this.pageQueryParams['ContactFax']);
                this.storeData['formGroup'].tabLogs.controls['TicketContactMobile'].setValue(this.pageQueryParams['ContactMobile']);
                this.storeData['formGroup'].tabLogs.controls['TicketContactEmail'].setValue(this.pageQueryParams['TicketContactEmail']);
                this.storeData['formGroup'].tabLogs.controls['TicketPostcode'].setValue(this.pageQueryParams['ContactPostcode']);
            }
            this.store.dispatch({
                type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['Accounts']
            });
        }
        else {
            this.formGroup.controls['CountryCode'].enable();
            this.formGroup.controls['BusinessCode'].enable();
        }
    };
    CallCentreGridComponent.prototype.buildTabs = function () {
        var tabTextList = [];
        this.tabs = [];
        this.componentList = [];
        this.tabs.push({ title: 'Customer Search', active: true, hidden: false, translated: this.storeData['tabsTranslation'].tabAccounts });
        tabTextList.push(this.storeData['tabsTranslation'].tabAccounts);
        this.componentList.push(CallCenterGridAccountsComponent);
        this.componentList.push(CallCenterGridDashboardComponent);
        this.componentList.push(CallCenterGridContractsComponent);
        this.componentList.push(CallCenterGridPremisesComponent);
        this.componentList.push(CallCenterGridInvoicesComponent);
        this.componentList.push(CallCenterGridCallLogsComponent);
        this.componentList.push(CallCenterGridEventHistoryComponent);
        this.componentList.push(CallCenterGridWorkOrdersComponent);
        this.componentList.push(CallCenterGridHistoryComponent);
        this.componentList.push(CallCenterGriddlContractComponent);
        if (this.otherVariables.AccountNumberType === 'A') {
            this.tabs.push({ title: 'Dashboard', hidden: false, translated: this.storeData['tabsTranslation'].tabDashboard });
            this.tabs.push({ title: 'Contracts/Jobs', hidden: false, translated: this.storeData['tabsTranslation'].tabContracts });
            this.tabs.push({ title: 'Premises', hidden: false, translated: this.storeData['tabsTranslation'].tabPremises });
            this.tabs.push({ title: 'Invoices', hidden: false, translated: this.storeData['tabsTranslation'].tabInvoices });
            tabTextList.push(this.storeData['tabsTranslation'].tabDashboard);
            tabTextList.push(this.storeData['tabsTranslation'].tabContracts);
            tabTextList.push(this.storeData['tabsTranslation'].tabPremises);
            tabTextList.push(this.storeData['tabsTranslation'].tabInvoices);
        }
        else {
            this.tabs.push({ title: 'Dashboard', hidden: true, translated: this.storeData['tabsTranslation'].tabDashboard });
            this.tabs.push({ title: 'Contracts/Jobs', hidden: true, translated: this.storeData['tabsTranslation'].tabContracts });
            this.tabs.push({ title: 'Premises', hidden: true, translated: this.storeData['tabsTranslation'].tabPremises });
            this.tabs.push({ title: 'Invoices', hidden: true, translated: this.storeData['tabsTranslation'].tabInvoices });
        }
        this.tabs.push({ title: 'Logs', hidden: false, translated: this.storeData['tabsTranslation'].tabLogs });
        tabTextList.push(this.storeData['tabsTranslation'].tabLogs);
        if (this.otherVariables.AccountNumberType === 'A') {
            this.tabs.push({ title: 'Event History', hidden: false, translated: this.storeData['tabsTranslation'].tabEventHistory });
            tabTextList.push(this.storeData['tabsTranslation'].tabEventHistory);
        }
        else {
            this.tabs.push({ title: 'Event History', hidden: true, translated: this.storeData['tabsTranslation'].tabEventHistory });
        }
        if (this.otherVariables.AccountNumberType !== 'NA') {
            this.tabs.push({ title: 'Work Orders', hidden: false, translated: this.storeData['tabsTranslation'].tabWorkOrders });
            tabTextList.push(this.storeData['tabsTranslation'].tabWorkOrders);
        }
        else {
            this.tabs.push({ title: 'Work Orders', hidden: true, translated: this.storeData['tabsTranslation'].tabWorkOrders });
        }
        if (this.otherVariables.AccountNumberType === 'A') {
            this.tabs.push({ title: 'History', hidden: false, translated: this.storeData['tabsTranslation'].tabHistory });
            tabTextList.push(this.storeData['tabsTranslation'].tabHistory);
        }
        else {
            this.tabs.push({ title: 'History', hidden: true, translated: this.storeData['tabsTranslation'].tabHistory });
        }
        if (this.otherVariables.AccountNumberType === 'P' && this.registry.gcShowAdvantageQuotes === 'Y') {
            this.tabs.push({ title: 'Advantage Quotes', hidden: false, translated: this.storeData['tabsTranslation'].advantage });
            tabTextList.push(this.storeData['tabsTranslation'].advantage);
        }
        else {
            this.tabs.push({ title: 'Advantage Quotes', hidden: true, translated: this.storeData['tabsTranslation'].advantage });
        }
        setTimeout(function () {
            var tabTextElements = document.querySelectorAll('#tabCont .nav-tabs li a span');
            for (var i = 0; i < tabTextElements.length; i++) {
                tabTextElements[i].parentElement.parentElement['style'].display = 'none';
                for (var j = 0; j < tabTextList.length; j++) {
                    if (tabTextElements[i]['innerText'] === tabTextList[j]) {
                        tabTextElements[i].parentElement.parentElement['style'].display = 'block';
                    }
                }
            }
        }, 100);
    };
    CallCentreGridComponent.prototype.setUpDefaults = function () {
        this.otherVariables.BusinessOriginCode = this.registry.gcDefaultBusinessOriginCode;
        this.otherVariables.BusinessOriginDesc = this.registry.gcDefaultBusinessOriginDesc;
        this.otherVariables.ContactMediumCode = this.registry.gcDefaultContactMediumCode;
        this.otherVariables.ContactMediumDesc = this.registry.gcDefaultContactMediumDesc;
        this.otherVariables.ProspectSourceCode = this.registry.gcDefaultProspectSourceCode;
        this.otherVariables.ProspectTypeCode = this.registry.gcDefaultProspectTypeCode;
        if (this.registry.gcDefaultLiveAccount === '1') {
            this.storeData['formGroup'].tabAccounts.controls['AccountStatus'].setValue('all');
        }
        if (this.registry.gcDefaultLiveAccount === '2') {
            this.storeData['formGroup'].tabAccounts.controls['AccountStatus'].setValue('liveonly');
        }
        if (this.registry.gcDefaultNationalAccount === '1') {
            this.storeData['formGroup'].tabAccounts.controls['AccountNational'].setValue('all');
        }
        else if (this.registry.gcDefaultNationalAccount === '2') {
            this.storeData['formGroup'].tabAccounts.controls['AccountNational'].setValue('nationalonly');
        }
        else if (this.registry.gcDefaultNationalAccount === '3') {
            this.storeData['formGroup'].tabAccounts.controls['AccountNational'].setValue('nonenational');
        }
        if (this.registry.gcDefaultAccountSearchType === '1') {
            this.storeData['formGroup'].tabAccounts.controls['AccountDataSet'].setValue('all');
        }
        if (this.registry.gcDefaultAccountSearchType === '2') {
            this.storeData['formGroup'].tabAccounts.controls['AccountDataSet'].setValue('allnotpublic');
        }
        if (this.registry.gcDefaultAccountSearchType === '3') {
            this.storeData['formGroup'].tabAccounts.controls['AccountDataSet'].setValue('accountspremises');
        }
        if (this.registry.gcDefaultAccountSearchType === '4') {
            this.storeData['formGroup'].tabAccounts.controls['AccountDataSet'].setValue('accounts');
        }
        if (this.registry.gcDefaultAccountSearchType === '5') {
            this.storeData['formGroup'].tabAccounts.controls['AccountDataSet'].setValue('public');
        }
        if (this.registry.gcDefaultAccountSearchType === '6') {
            this.storeData['formGroup'].tabAccounts.controls['AccountDataSet'].setValue('premises');
        }
        if (this.registry.gcDefaultAccountSearchType === '7') {
            this.storeData['formGroup'].tabAccounts.controls['AccountDataSet'].setValue('prospects');
        }
        if (this.registry.gcDefaultContractPortfolioStatus === '1') {
            this.storeData['formGroup'].tabContracts.controls['ContractStatusCode'].setValue('all');
        }
        if (this.registry.gcDefaultContractPortfolioStatus === '2') {
            this.storeData['formGroup'].tabContracts.controls['ContractStatusCode'].setValue('CurrentAll');
        }
        if (this.registry.gcDefaultEventHistorySearchType === '1') {
            this.storeData['formGroup'].tabEventHistory.controls['EventHistoryType'].setValue('all');
        }
        if (this.registry.gcDefaultEventHistorySearchType === '2') {
            this.storeData['formGroup'].tabEventHistory.controls['EventHistoryType'].setValue('visits');
        }
        if (this.registry.gcDefaultEventHistorySearchType === '3') {
            this.storeData['formGroup'].tabEventHistory.controls['EventHistoryType'].setValue('invoices');
        }
        if (this.registry.gcDefaultEventHistorySearchType === '4') {
            this.storeData['formGroup'].tabEventHistory.controls['EventHistoryType'].setValue('contacts');
        }
        if (this.registry.gcDefaultHistorySearchType === '1') {
            this.storeData['formGroup'].tabHistory.controls['HistoryType'].setValue('effective');
        }
        if (this.registry.gcDefaultHistorySearchType === '2') {
            this.storeData['formGroup'].tabHistory.controls['HistoryType'].setValue('processed');
        }
        if (this.registry.gcDefaultCallSearchType === '1') {
            this.storeData['formGroup'].tabLogs.controls['CallLogSearchOn'].setValue('all');
        }
        if (this.registry.gcDefaultCallSearchType === '2') {
            this.storeData['formGroup'].tabLogs.controls['CallLogSearchOn'].setValue('CallRef');
        }
        if (this.registry.gcDefaultCallSearchType === '3') {
            this.storeData['formGroup'].tabLogs.controls['CallLogSearchOn'].setValue('OpenOnly');
        }
        if (this.registry.gcDefaultCallSearchType === '4') {
            this.storeData['formGroup'].tabLogs.controls['CallLogSearchOn'].setValue('ClosedOnly');
        }
        var change = new Event('change', { bubbles: true });
        this.renderer.invokeElementMethod(document.querySelector('#AccountStatus'), 'dispatchEvent', [change]);
        this.renderer.invokeElementMethod(document.querySelector('#AccountContractType'), 'dispatchEvent', [change]);
        this.setDefaultDates();
    };
    CallCentreGridComponent.prototype.setDefaultDates = function () {
        var date = new Date();
        this.storeData['dateObjects'].tabLogs.CallLogDate = new Date(date.setDate(date.getDate() - this.registry.giCallDateDays));
        date = new Date();
        this.storeData['dateObjects'].tabWorkOrders.WOFromDate = new Date(date.setDate(date.getDate() - this.registry.giWOFromDays));
        date = new Date();
        this.storeData['dateObjects'].tabWorkOrders.WOToDate = new Date(date.setDate(date.getDate() + this.registry.giWOToDays));
        date = new Date();
        this.storeData['dateObjects'].tabEventHistory.EventHistoryFromDate = new Date(date.setDate(date.getDate() - this.registry.giEventHistoryFromDays));
        date = new Date();
        this.storeData['dateObjects'].tabEventHistory.EventHistoryToDate = new Date(date.setDate(date.getDate()));
        date = new Date();
        this.storeData['dateObjects'].tabHistory.HistoryFromDate = new Date(date.setDate(date.getDate() - this.registry.giHistoryFromDays));
        date = new Date();
        this.storeData['dateObjects'].tabHistory.HistoryToDate = new Date(date.setDate(date.getDate() + this.registry.giHistoryToDays));
        date = new Date();
        this.storeData['dateObjects'].tabContracts.ContractCommenceDateFrom = new Date(date.setDate(date.getDate() - this.registry.gcContractCommenceDateFromDays));
        date = new Date();
        this.storeData['dateObjects'].tabContracts.ContractCommenceDateTo = new Date(date.setDate(date.getDate() + this.registry.gcContractCommenceDateToDays));
        date = new Date();
        this.storeData['dateObjects'].tabPremises.PremiseCommenceDateFrom = new Date(date.setDate(date.getDate() - this.registry.gcPremiseCommenceDateFromDays));
        date = new Date();
        this.storeData['dateObjects'].tabPremises.PremiseCommenceDateTo = new Date(date.setDate(date.getDate() + this.registry.gcPremiseCommenceDateToDays));
    };
    CallCentreGridComponent.prototype.formClone = function () {
        for (var i in this.storeData['formGroup'].main.controls) {
            if (this.storeData['formGroup'].main.controls.hasOwnProperty(i)) {
                this.storeFormDataClone.main[i] = this.storeData['formGroup'].main.controls[i].value;
                this.storeFormDataClone.state.main[i] = this.storeData['formGroup'].main.controls[i].enabled;
            }
        }
        for (var i in this.storeData['formGroup'].tabAccounts.controls) {
            if (this.storeData['formGroup'].tabAccounts.controls.hasOwnProperty(i)) {
                this.storeFormDataClone.tabAccounts[i] = this.storeData['formGroup'].tabAccounts.controls[i].value;
                this.storeFormDataClone.state.tabAccounts[i] = this.storeData['formGroup'].tabAccounts.controls[i].enabled;
            }
        }
        for (var i in this.storeData['formGroup'].tabLogs.controls) {
            if (this.storeData['formGroup'].tabLogs.controls.hasOwnProperty(i)) {
                this.storeFormDataClone.tabLogs[i] = this.storeData['formGroup'].tabLogs.controls[i].value;
                this.storeFormDataClone.state.tabLogs[i] = this.storeData['formGroup'].tabLogs.controls[i].enabled;
            }
        }
        for (var i in this.storeData['formGroup'].tabContracts.controls) {
            if (this.storeData['formGroup'].tabContracts.controls.hasOwnProperty(i)) {
                this.storeFormDataClone.tabContracts[i] = this.storeData['formGroup'].tabContracts.controls[i].value;
                this.storeFormDataClone.state.tabContracts[i] = this.storeData['formGroup'].tabContracts.controls[i].enabled;
            }
        }
        for (var i in this.storeData['formGroup'].tabDashboard.controls) {
            if (this.storeData['formGroup'].tabDashboard.controls.hasOwnProperty(i)) {
                this.storeFormDataClone.tabDashboard[i] = this.storeData['formGroup'].tabDashboard.controls[i].value;
                this.storeFormDataClone.state.tabDashboard[i] = this.storeData['formGroup'].tabDashboard.controls[i].enabled;
            }
        }
        for (var i in this.storeData['formGroup'].tabEventHistory.controls) {
            if (this.storeData['formGroup'].tabEventHistory.controls.hasOwnProperty(i)) {
                this.storeFormDataClone.tabEventHistory[i] = this.storeData['formGroup'].tabEventHistory.controls[i].value;
                this.storeFormDataClone.state.tabEventHistory[i] = this.storeData['formGroup'].tabEventHistory.controls[i].enabled;
            }
        }
        for (var i in this.storeData['formGroup'].tabHistory.controls) {
            if (this.storeData['formGroup'].tabHistory.controls.hasOwnProperty(i)) {
                this.storeFormDataClone.tabHistory[i] = this.storeData['formGroup'].tabHistory.controls[i].value;
                this.storeFormDataClone.state.tabHistory[i] = this.storeData['formGroup'].tabHistory.controls[i].enabled;
            }
        }
        for (var i in this.storeData['formGroup'].tabInvoices.controls) {
            if (this.storeData['formGroup'].tabInvoices.controls.hasOwnProperty(i)) {
                this.storeFormDataClone.tabInvoices[i] = this.storeData['formGroup'].tabInvoices.controls[i].value;
                this.storeFormDataClone.state.tabInvoices[i] = this.storeData['formGroup'].tabInvoices.controls[i].enabled;
            }
        }
        for (var i in this.storeData['formGroup'].tabPremises.controls) {
            if (this.storeData['formGroup'].tabPremises.controls.hasOwnProperty(i)) {
                this.storeFormDataClone.tabPremises[i] = this.storeData['formGroup'].tabPremises.controls[i].value;
                this.storeFormDataClone.state.tabPremises[i] = this.storeData['formGroup'].tabPremises.controls[i].enabled;
            }
        }
        for (var i in this.storeData['formGroup'].tabWorkOrders.controls) {
            if (this.storeData['formGroup'].tabWorkOrders.controls.hasOwnProperty(i)) {
                this.storeFormDataClone.tabWorkOrders[i] = this.storeData['formGroup'].tabWorkOrders.controls[i].value;
                this.storeFormDataClone.state.tabWorkOrders[i] = this.storeData['formGroup'].tabWorkOrders.controls[i].enabled;
            }
        }
        this.storeFormDataClone['pagination'] = this.storeData['pagination'];
        this.storeFormDataClone['index'] = this.storeData['index'];
        this.storeData['storeFormDataClone'] = this.storeFormDataClone;
    };
    CallCentreGridComponent.prototype.setFormFromBaseComponent = function () {
        if (this.storeSavedData && this.storeSavedData.state && !(Object.keys(this.storeSavedData.state).length === 0 && this.storeSavedData.state.constructor === Object)) {
            this.storeData['storeSavedData'] = this.storeSavedData;
            for (var j in this.storeSavedData['state']) {
                if (this.storeSavedData['state'].hasOwnProperty(j)) {
                    for (var k in this.storeSavedData['state'][j]) {
                        if (typeof this.storeSavedData['state'][j][k] === 'string') {
                            if (this.storeSavedData['state'][j][k]) {
                                this.storeData['formGroup'][j].controls[k].enable();
                            }
                            else {
                                this.storeData['formGroup'][j].controls[k].disable();
                            }
                        }
                    }
                }
            }
        }
        if (this.storeSavedData && this.storeSavedData.main && !(Object.keys(this.storeSavedData.main).length === 0 && this.storeSavedData.main.constructor === Object)) {
            this.storeData['storeSavedData'] = this.storeSavedData;
            for (var j in this.storeSavedData) {
                if (this.storeSavedData.hasOwnProperty(j)) {
                    for (var k in this.storeSavedData[j]) {
                        if (typeof this.storeSavedData[j][k] === 'string') {
                            this.storeData['formGroup'][j].controls[k].setValue(this.storeSavedData[j][k]);
                        }
                    }
                }
            }
        }
        else {
            this.storeData['storeSavedData'] = {};
        }
        this.store.dispatch({
            type: CallCenterActionTypes.SET_PAGINATION
        });
    };
    CallCentreGridComponent.prototype.passLiveAccountStatusToAllSearches = function () {
        if (this.registry.gcAccountPassLiveAccount === 'Y') {
            if (this.storeData['formGroup'].tabAccounts.controls['AccountStatus'].value === 'liveonly') {
                this.storeData['formGroup'].tabContracts.controls['ContractStatusCode'].setValue('CurrentAll');
                this.storeData['formGroup'].tabPremises.controls['PremiseStatusCode'].setValue('CurrentAll');
            }
            else {
                this.storeData['formGroup'].tabContracts.controls['ContractStatusCode'].setValue('all');
                this.storeData['formGroup'].tabPremises.controls['PremiseStatusCode'].setValue('all');
            }
            this.webSpeedVariables.lRefreshContractGrid = true;
            this.webSpeedVariables.lRefreshPremiseGrid = true;
        }
    };
    CallCentreGridComponent.prototype.passContractTypeToAllSearches = function () {
        if (this.registry.gcAccountPassContractType === 'Y') {
            this.storeData['formGroup'].tabContracts.controls['ContractTypeCode'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountContractType'].value);
            this.storeData['formGroup'].tabPremises.controls['PremiseContractTypeCode'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountContractType'].value);
            this.storeData['formGroup'].tabInvoices.controls['InvoiceContractTypeCode'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountContractType'].value);
            this.webSpeedVariables.lRefreshContractGrid = true;
            this.webSpeedVariables.lRefreshPremiseGrid = true;
            this.webSpeedVariables.lRefreshInvoiceGrid = true;
        }
    };
    CallCentreGridComponent.prototype.getLoggedInBranch = function () {
        var businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
        var countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();
        return this.utils.getLoggedInBranch(businessCode, countryCode);
    };
    CallCentreGridComponent.prototype.getInitialSettings = function () {
        var _this = this;
        this.getLoggedInBranch().subscribe(function (data) {
            if (data.results && data.results[0] && data.results[0].length > 0) {
                _this.loggedInBranch = data.results[0][0].BranchNumber;
            }
            else if (data.results && data.results[1] && data.results[1].length > 0) {
                _this.loggedInBranch = data.results[1][0].BranchNumber;
            }
            else {
                _this.loggedInBranch = '';
            }
            if (_this.formGroup.controls['BusinessCode'].value === _this.utils.getBusinessCode() && _this.formGroup.controls['CountryCode'].value === _this.utils.getCountryCode()) {
                _this.loggedInBranch = _this.utils.getBranchCode();
            }
            _this.fetchCallCentreDataPost('GetInitialSettings', {}, { BranchNumber: _this.loggedInBranch }).subscribe(function (data) {
                if (data['status'] === GlobalConstant.Configuration.Failure) {
                    _this.errorService.emitError(data['oResponse']);
                }
                else {
                    if (!data['errorMessage']) {
                        if (data['isNationalBranch'] === 'Y') {
                            _this.registry.gcDefaultNationalAccount = _this.registry.gcDefaultNationalAccountWhenInBr;
                        }
                        if (data['isPropertyCareBranch'] === 'Y') {
                            _this.webSpeedVariables.cIsPropertyCareBranch = 'Y';
                        }
                        if (data['CreateCallLogInCCMInd'] === 'Y') {
                            _this.otherVariables.CreateCallLogInCCMInd = 'Y';
                        }
                        else {
                            _this.otherVariables.CreateCallLogInCCMInd = 'N';
                            _this.fieldVisibility.VisibleCurrentCallLogID = false;
                            _this.fieldVisibility.CmdNotepad = false;
                            _this.fieldVisibility.CmdNewCall = false;
                            _this.fieldVisibility.CmdEndCall = false;
                        }
                        _this.windowInitialize();
                        _this.setUpDefaults();
                        _this.storeOperationOnGettingInitialSettings();
                        _this.setFormFromBaseComponent();
                    }
                }
            }, function (err) {
                _this.storeOperationOnGettingInitialSettings();
            });
        });
    };
    CallCentreGridComponent.prototype.storeOperationOnGettingInitialSettings = function () {
        var _this = this;
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_OTHER_PARAMS, payload: {
                registry: this.registry,
                webSpeedVariables: this.webSpeedVariables,
                otherVariables: this.otherVariables,
                syschars: this.syschars
            }
        });
        if (this.storeData['otherParams']['otherVariables'])
            this.storeData['otherParams']['otherVariables']['currentTab'] = this.storeData['tabsTranslation'].tabAccounts;
        this.storeData['gridToBuild'] = [];
        this.storeData['action'] = '';
        this.formClone();
        setTimeout(function () {
            _this.storeData['allowAjaxOnDateChange'] = true;
        }, 0);
    };
    CallCentreGridComponent.prototype.setupDisplayOnlyFields = function () {
        this.formGroup.controls['AccountProspectNumber'].disable();
        this.formGroup.controls['AccountProspectName'].disable();
        this.formGroup.controls['AccountProspectContactName'].disable();
        this.storeData['formGroup'].tabAccounts.controls['AccountName'].disable();
        this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine1'].disable();
        this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine2'].disable();
        this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine4'].disable();
        this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine5'].disable();
        this.storeData['formGroup'].tabAccounts.controls['AccountPostcode'].disable();
        this.storeData['formGroup'].tabAccounts.controls['AccountContactName'].disable();
        this.storeData['formGroup'].tabAccounts.controls['AccountContactPosition'].disable();
        this.storeData['formGroup'].tabAccounts.controls['AccountContactTelephone'].disable();
        this.storeData['formGroup'].tabAccounts.controls['AccountContactMobile'].disable();
        this.storeData['formGroup'].tabAccounts.controls['AccountContactFax'].disable();
        this.storeData['formGroup'].tabAccounts.controls['AccountContactEmail'].disable();
        this.storeData['formGroup'].tabPremises.controls['PremiseServiceCoverList'].disable();
        this.storeData['formGroup'].tabPremises.controls['PremiseName'].disable();
        this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine1'].disable();
        this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine2'].disable();
        this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine4'].disable();
        this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine5'].disable();
        this.storeData['formGroup'].tabPremises.controls['PremisePostcode'].disable();
        this.storeData['formGroup'].tabPremises.controls['PremiseContactName'].disable();
        this.storeData['formGroup'].tabPremises.controls['PremiseContactPosition'].disable();
        this.storeData['formGroup'].tabPremises.controls['PremiseContactTelephone'].disable();
        this.storeData['formGroup'].tabPremises.controls['PremiseContactMobile'].disable();
        this.storeData['formGroup'].tabPremises.controls['PremiseContactFax'].disable();
        this.storeData['formGroup'].tabPremises.controls['PremiseContactEmail'].disable();
        this.storeData['formGroup'].tabPremises.controls['PremSelectedContract'].disable();
        this.storeData['formGroup'].tabInvoices.controls['InvSelectedContractPremise'].disable();
        this.storeData['formGroup'].tabEventHistory.controls['EventHistorySelectedContractPremise'].disable();
        this.storeData['formGroup'].tabHistory.controls['HistorySelectedContractPremise'].disable();
        this.storeData['formGroup'].tabLogs.controls['CallLogSelectedContractPremise'].disable();
        this.storeData['formGroup'].tabLogs.controls['CallLogUserName'].disable();
        this.storeData['formGroup'].tabLogs.controls['CallLogCreatedDate'].disable();
        this.storeData['formGroup'].tabLogs.controls['CallLogCreatedTime'].disable();
        this.storeData['formGroup'].tabLogs.controls['TicketContractNumber'].disable();
        this.storeData['formGroup'].tabLogs.controls['TicketContractName'].disable();
        this.storeData['formGroup'].tabLogs.controls['TicketPremiseNumber'].disable();
        this.storeData['formGroup'].tabLogs.controls['TicketPremiseName'].disable();
        this.storeData['formGroup'].tabLogs.controls['TicketProductCode'].disable();
        this.storeData['formGroup'].tabLogs.controls['TicketProductDesc'].disable();
        this.storeData['formGroup'].tabLogs.controls['TicketPremiseNumber'].disable();
        this.storeData['formGroup'].tabLogs.controls['TicketContactName'].disable();
        this.storeData['formGroup'].tabLogs.controls['TicketContactPosition'].disable();
        this.storeData['formGroup'].tabLogs.controls['TicketContactTelephone'].disable();
        this.storeData['formGroup'].tabLogs.controls['TicketContactMobile'].disable();
        this.storeData['formGroup'].tabLogs.controls['TicketContactEmail'].disable();
        this.storeData['formGroup'].tabLogs.controls['TicketContactFax'].disable();
        this.storeData['formGroup'].tabWorkOrders.controls['WOSelectedContractPremise'].disable();
    };
    CallCentreGridComponent.prototype.fetchCallCentreDataPost = function (functionName, params, formData) {
        this.queryCallCentre = new URLSearchParams();
        var businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
        var countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();
        this.queryCallCentre.set(this.serviceConstants.BusinessCode, businessCode);
        this.queryCallCentre.set(this.serviceConstants.CountryCode, countryCode);
        if (functionName !== '') {
            this.queryCallCentre.set(this.serviceConstants.Action, '6');
            this.queryCallCentre.set('Function', functionName);
        }
        for (var key in params) {
            if (key) {
                this.queryCallCentre.set(key, params[key]);
            }
        }
        return this.httpService.makePostRequest(this.queryParamsCallCenter.method, this.queryParamsCallCenter.module, this.queryParamsCallCenter.operation, this.queryCallCentre, formData);
    };
    CallCentreGridComponent.prototype.fetchCallCentreDataGet = function (functionName, params) {
        this.queryCallCentre = new URLSearchParams();
        var businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
        var countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();
        this.queryCallCentre.set(this.serviceConstants.BusinessCode, businessCode);
        this.queryCallCentre.set(this.serviceConstants.CountryCode, countryCode);
        if (functionName !== '') {
            this.queryCallCentre.set(this.serviceConstants.Action, '6');
            this.queryCallCentre.set('Function', functionName);
        }
        for (var key in params) {
            if (key) {
                this.queryCallCentre.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.queryParamsCallCenter.method, this.queryParamsCallCenter.module, this.queryParamsCallCenter.operation, this.queryCallCentre);
    };
    CallCentreGridComponent.prototype.postFetchRegistry = function () {
        var _this = this;
        setTimeout(function () {
            _this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue(_this.storeData['dropdownList'].tabAccounts.AccountSearchOn[parseInt(_this.registry.gcDefaultAccountSearch, 10) - 1].value);
            _this.storeData['formGroup'].tabContracts.controls['ContractStatusCode'].setValue(document.getElementById('ContractStatusCode')[parseInt(_this.registry.gcDefaultContractPortfolioStatus, 10)].value);
            _this.storeData['formGroup'].tabPremises.controls['PremiseStatusCode'].setValue(document.getElementById('PremiseStatusCode')[parseInt(_this.registry.gcDefaultContractPortfolioStatus, 10)].value);
        }, 0);
        if (this.registry.glMultiContactInd) {
            this.storeData['fieldVisibility']['tabPremises'].CmdContactPremise = false;
        }
        var data = [{
                'table': 'Employee',
                'query': { 'UserCode': this.userCode, 'BusinessCode': this.storeData['code'] && this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode() },
                'fields': ['OccupationCode', 'EmployeeCode']
            },
            {
                'table': 'ContractType',
                'query': { 'BusinessCode': this.storeData['code'] && this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode() },
                'fields': ['BusinessCode', 'ContractTypeCode', 'ContractTypeDesc']
            }];
        this.lookUpRecord(data, 100).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    if (_this.syschars['glLimitEmployeeDataView']) {
                        if (_this.syschars['gcCountryDataList'].length > 0 && _this.syschars['gcCountryDataList'].indexOf(e['results'][0][0].EmployeeCode)) {
                            _this.registry.gcEmployeeLimitChildDrillOptions = 'Y';
                        }
                    }
                    else if (_this.syschars['glLimitOccupationEmployeeDataView']) {
                        if (_this.syschars['gcOccupationCodeList'].length > 0 && _this.syschars['gcOccupationCodeList'].indexOf(e['results'][0][0].EmployeeCode)) {
                            _this.registry.gcEmployeeLimitChildDrillOptions = 'Y';
                        }
                    }
                }
                if (e['results'][1].length > 0) {
                    _this.list.ContractType = e['results'][1];
                    var arr = [];
                    for (var i = 0; i < e['results'][1].length; i++) {
                        arr.push(e['results'][1][i].ContractTypeCode);
                    }
                    _this.storeData['dropdownList'].tabAccounts.AccountContractType = [{
                            value: _this.registry.gcContractTypeCodes,
                            desc: ''
                        }];
                    _this.storeData['dropdownList'].tabContracts.ContractTypeCode = [{
                            value: _this.registry.gcContractTypeCodes,
                            desc: ''
                        }];
                    _this.storeData['dropdownList'].tabPremises.PremiseContractTypeCode = [{
                            value: _this.registry.gcContractTypeCodes,
                            desc: ''
                        }];
                    _this.storeData['dropdownList'].tabInvoices.InvoiceContractTypeCode = [{
                            value: _this.registry.gcContractTypeCodes,
                            desc: ''
                        }];
                    _this.registry.gcContractTypeCodes = _this.registry.gcContractTypeCodes + ',';
                    _this.registry.gcContractTypeCodes = _this.registry.gcContractTypeCodes.concat(arr.join());
                    var contractTypeLangQuery = [];
                    for (var i = 0; i < _this.list.ContractType.length; i++) {
                        contractTypeLangQuery.push({
                            'table': 'ContractTypeLang',
                            'query': { 'ContractTypeCode': _this.list.ContractType[i].ContractTypeCode, 'BusinessCode': _this.list.ContractType[i].BusinessCode },
                            'fields': ['ContractTypeDesc']
                        });
                    }
                    _this.lookUpRecord(contractTypeLangQuery, 100).subscribe(function (e) {
                        if (e['results'] && e['results'].length > 0) {
                            _this.list.ContractTypeDesc = e['results'];
                            var arr_1 = [];
                            for (var i = 0; i < e['results'].length; i++) {
                                arr_1.push(e['results'][i][0].ContractTypeDesc);
                            }
                            _this.storeData['dropdownList'].tabAccounts.AccountContractType[0].desc = _this.registry.gcContractTypeDescs;
                            _this.storeData['dropdownList'].tabContracts.ContractTypeCode[0].desc = _this.registry.gcContractTypeDescs;
                            _this.storeData['dropdownList'].tabPremises.PremiseContractTypeCode[0].desc = _this.registry.gcContractTypeDescs;
                            _this.storeData['dropdownList'].tabInvoices.InvoiceContractTypeCode[0].desc = _this.registry.gcContractTypeDescs;
                            _this.registry.gcContractTypeDescs = _this.registry.gcContractTypeDescs + ',';
                            _this.registry.gcContractTypeDescs = _this.registry.gcContractTypeDescs.concat(arr_1.join());
                            for (var i = 0; i < _this.list.ContractType.length; i++) {
                                _this.storeData['dropdownList'].tabAccounts.AccountContractType.push({
                                    value: _this.list.ContractType[i].ContractTypeCode,
                                    desc: _this.list.ContractType[i].ContractTypeDesc
                                });
                                _this.storeData['dropdownList'].tabContracts.ContractTypeCode.push({
                                    value: _this.list.ContractType[i].ContractTypeCode,
                                    desc: _this.list.ContractType[i].ContractTypeDesc
                                });
                                _this.storeData['dropdownList'].tabPremises.PremiseContractTypeCode.push({
                                    value: _this.list.ContractType[i].ContractTypeCode,
                                    desc: _this.list.ContractType[i].ContractTypeDesc
                                });
                                _this.storeData['dropdownList'].tabInvoices.InvoiceContractTypeCode.push({
                                    value: _this.list.ContractType[i].ContractTypeCode,
                                    desc: _this.list.ContractType[i].ContractTypeDesc
                                });
                            }
                            _this.storeData['formGroup'].tabAccounts.controls['AccountContractType'].setValue(_this.storeData['dropdownList'].tabAccounts.AccountContractType[parseInt(_this.registry.gcDefaultAccountContractType, 10) - 1].value);
                            _this.storeData['formGroup'].tabContracts.controls['ContractTypeCode'].setValue(_this.storeData['dropdownList'].tabContracts.ContractTypeCode[parseInt(_this.registry.gcDefaultContractType, 10) - 1].value);
                            _this.storeData['formGroup'].tabPremises.controls['PremiseContractTypeCode'].setValue(_this.storeData['dropdownList'].tabPremises.PremiseContractTypeCode[parseInt(_this.registry.gcDefaultContractType, 10) - 1].value);
                            _this.storeData['formGroup'].tabInvoices.controls['InvoiceContractTypeCode'].setValue(_this.storeData['dropdownList'].tabInvoices.InvoiceContractTypeCode[parseInt(_this.registry.gcDefaultContractType, 10) - 1].value);
                        }
                    }, function (error) {
                    });
                }
            }
            else {
            }
        }, function (error) {
        });
        this.getInitialSettings();
    };
    CallCentreGridComponent.prototype.fetchSysChar = function (sysCharNumbers) {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.querySysChar.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        }
        else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        }
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    };
    CallCentreGridComponent.prototype.sysCharParameters = function () {
        var sysCharList = [
            this.SysCharConstants.SystemCharEnableAddressLine3,
            this.SysCharConstants.SystemCharEnableInfestations,
            this.SysCharConstants.SystemCharEnableEmployeeCountryDataRestrictedView,
            this.SysCharConstants.SystemCharEnableEmployeeOccupationDataRestrictedView
        ];
        return sysCharList.join(',');
    };
    CallCentreGridComponent.prototype.countryOnChange = function (event) {
        this.storeData['code'].country = this.formGroup.controls['CountryCode'].value;
        this.businessCodeList = this.cbbService.getBusinessListByCountry(this.storeData['code'].country);
        this.formGroup.controls['BusinessCode'].setValue(this.businessCodeList[0].value);
        if (this.businessCodeList.length > 0) {
            this.storeData['code'].business = this.businessCodeList[0].value;
            this.storeData['code'].multiBusiness = this.businessCodeList[0].value;
        }
        this.fieldVisibility.CmdNotepad = true;
        this.fieldVisibility.CmdNewCall = false;
        this.fieldVisibility.CmdEndCall = true;
        this.store.dispatch({
            type: CallCenterActionTypes.CLEAR_SPECIFIC_GRID, payload: ['Accounts', 'Premises', 'Contracts', 'Logs', 'WorkOrders', 'History', 'EventHistory', 'Invoices']
        });
        var click = new Event('click', { bubbles: false });
        var elem = document.getElementById('CmdClearSearch');
        if (elem)
            this.renderer.invokeElementMethod(elem, 'click', [click]);
        this.onInit();
        this.fetchTranslationContent();
        this.postInitialization();
        this.storeData['gridToClear'] = [];
        this.storeSavedData = {};
    };
    CallCentreGridComponent.prototype.businessOnChange = function (event) {
        var _this = this;
        this.storeData['code'].business = this.formGroup.controls['BusinessCode'].value;
        if (this.storeData['code'].business === 'All') {
            this.storeData['code'].business = this.businessCodeList[0].value;
            this.storeData['code'].numberOfBusiness = this.businessCodeList.length;
        }
        this.storeData['code'].multiBusiness = this.formGroup.controls['BusinessCode'].value;
        this.fieldVisibility.CmdNotepad = true;
        this.fieldVisibility.CmdNewCall = false;
        this.fieldVisibility.CmdEndCall = true;
        this.store.dispatch({
            type: CallCenterActionTypes.CLEAR_SPECIFIC_GRID, payload: ['Accounts', 'Premises', 'Contracts', 'Logs', 'WorkOrders', 'History', 'EventHistory', 'Invoices']
        });
        this.fetchCallCentreDataGet('', { action: 0 }).subscribe(function (data) {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                _this.errorService.emitError(data['oResponse']);
            }
            else {
                if (!data['errorMessage']) {
                    _this.businessData = data;
                    var click = new Event('click', { bubbles: false });
                    var elem = document.getElementById('CmdClearSearch');
                    if (elem)
                        _this.renderer.invokeElementMethod(elem, 'click', [click]);
                }
            }
        });
        this.onInit();
        this.fetchTranslationContent();
        this.postInitialization();
        this.storeData['gridToClear'] = [];
        this.storeSavedData = {};
    };
    CallCentreGridComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        if (this.storeData['code'].business) {
            this.queryLookUp.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
        }
        else {
            this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        }
        if (this.storeData['code'].country) {
            this.queryLookUp.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        }
        else {
            this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        }
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    };
    CallCentreGridComponent.prototype.triggerFetchSysChar = function () {
        var _this = this;
        this.fetchSysChar(this.sysCharParameters()).subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError({
                    errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
                });
                return false;
            }
            if (e.records && e.records.length > 0) {
                _this.syschars['glSCEnableAddressLine3'] = e.records[0].Required;
                _this.syschars['glSCShowInfestations'] = e.records[1].Required;
                _this.syschars['glLimitEmployeeDataView'] = e.records[2].Required;
                _this.syschars['gcCountryDataList'] = e.records[2].Text;
                _this.syschars['glLimitOccupationEmployeeDataView'] = e.records[3].Required;
                _this.syschars['gcOccupationCodeList'] = e.records[3].Text;
                _this.registry.glSCEnableAddressLine3 = e.records[0].Required;
                _this.registry.glSCShowInfestations = e.records[1].Required;
                _this.registry.glLimitEmployeeDataView = e.records[2].Required;
                _this.registry.gcCountryDataList = e.records[2].Text;
                _this.registry.gcOccupationCodeList = e.records[3].Text;
            }
            Observable.forkJoin(_this.fetchPortfolioDescription(_this.registry.gcContractPortfolioStatusCodes.split(',')), _this.fetchPortfolioDescription(_this.registry.gcPremisePortfolioStatusCodes.split(',')), _this.fetchRegistry()).subscribe(function (data) {
                if (data[0]['results'] && data[0]['results'].length > 0) {
                    var arr = [];
                    _this.storeData['dropdownList'].tabContracts.ContractStatusCode = [];
                    for (var i = 0; i < data[0]['results'].length; i++) {
                        arr.push(data[0]['results'][i][0].PortfolioStatusDesc);
                        _this.storeData['dropdownList'].tabContracts.ContractStatusCode.push({
                            value: data[0]['results'][i][0].PortfolioStatusCode,
                            desc: data[0]['results'][i][0].PortfolioStatusDesc
                        });
                    }
                    _this.list['ContractStatusCodeDesc'] = arr;
                    _this.registry['gcContractPortfolioStatusDescs'] = arr.join();
                }
                if (data[1]['results'] && data[1]['results'].length > 0) {
                    var arr = [];
                    _this.storeData['dropdownList'].tabPremises.PremiseStatusCode = [];
                    for (var i = 0; i < data[1]['results'].length; i++) {
                        arr.push(data[1]['results'][i][0].PortfolioStatusDesc);
                        _this.storeData['dropdownList'].tabPremises.PremiseStatusCode.push({
                            value: data[1]['results'][i][0].PortfolioStatusCode,
                            desc: data[1]['results'][i][0].PortfolioStatusDesc
                        });
                    }
                    _this.list['PremiseStatusCodeDesc'] = arr;
                    _this.registry['gcPremisePortfolioStatusDescs'] = arr.join();
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                if (data[2]['results'] && data[2]['results'].length > 0) {
                    if (data[2]['results'][0].length > 0) {
                        _this.registry.gcDefaultAccountSearch = data[2]['results'][0][0].RegValue;
                    }
                    if (data[2]['results'][1].length > 0) {
                        _this.registry.gcDefaultLiveAccount = data[2]['results'][1][0].RegValue;
                    }
                    if (data[2]['results'][2].length > 0) {
                        _this.registry.gcDefaultNationalAccount = data[2]['results'][2][0].RegValue;
                    }
                    if (data[2]['results'][3].length > 0) {
                        _this.registry.gcDefaultNationalAccountWhenInBr = data[2]['results'][3][0].RegValue;
                    }
                    if (data[2]['results'][4].length > 0) {
                        _this.registry.gcDefaultAccountContractType = data[2]['results'][4][0].RegValue;
                    }
                    if (data[2]['results'][5].length > 0) {
                        _this.registry.gcAccountPassContractType = (!data[2]['results'][5][0].RegValue) ? 'N' : data[2]['results'][5][0].RegValue;
                    }
                    if (data[2]['results'][6].length > 0) {
                        _this.registry.gcAccountPassLiveAccount = (!data[2]['results'][6][0].RegValue) ? 'N' : data[2]['results'][6][0].RegValue;
                    }
                    if (data[2]['results'][7].length > 0) {
                        _this.registry.gcAccountPassSearchTypeValue = (!data[2]['results'][7][0].RegValue) ? 'N' : data[2]['results'][7][0].RegValue;
                    }
                    if (data[2]['results'][8].length > 0) {
                        _this.registry.gcDefaultAccountSearchType = data[2]['results'][8][0].RegValue;
                    }
                    if (data[2]['results'][9].length > 0) {
                        _this.registry.gcDefaultContractType = data[2]['results'][9][0].RegValue;
                    }
                    if (data[2]['results'][10].length > 0) {
                        _this.registry.gcDefaultContractPortfolioStatus = data[2]['results'][10][0].RegValue;
                    }
                    if (data[2]['results'][11].length > 0) {
                        _this.registry.gcShowNotepadWhenEndCall = (!data[2]['results'][11][0].RegValue) ? 'N' : data[2]['results'][11][0].RegValue;
                    }
                    if (data[2]['results'][12].length > 0) {
                        _this.registry.gcDefaultBusinessOriginCode = data[2]['results'][12][0].RegValue;
                    }
                    if (data[2]['results'][13].length > 0) {
                        _this.registry.gcDefaultContactMediumCode = data[2]['results'][13][0].RegValue;
                    }
                    if (data[2]['results'][14].length > 0) {
                        _this.registry.gcDefaultProspectTypeCode = data[2]['results'][14][0].RegValue;
                    }
                    if (data[2]['results'][15].length > 0) {
                        _this.registry.gcDefaultProspectSourceCode = data[2]['results'][15][0].RegValue;
                    }
                    if (data[2]['results'][16].length > 0) {
                        _this.registry.gcDefaultCallSearchType = data[2]['results'][16][0].RegValue;
                    }
                    if (data[2]['results'][17].length > 0) {
                        _this.registry.gcCallLogStartDateDays = data[2]['results'][17][0].RegValue;
                    }
                    if (data[2]['results'][18].length > 0) {
                        _this.registry.gcWODateFromDays = data[2]['results'][18][0].RegValue;
                    }
                    if (data[2]['results'][19].length > 0) {
                        _this.registry.gcWODateToDays = data[2]['results'][19][0].RegValue;
                    }
                    if (data[2]['results'][20].length > 0) {
                        _this.registry.gcDefaultEventHistorySearchType = data[2]['results'][20][0].RegValue;
                    }
                    if (data[2]['results'][21].length > 0) {
                        _this.registry.gcEventHistoryDateFromDays = data[2]['results'][21][0].RegValue;
                    }
                    if (data[2]['results'][22].length > 0) {
                        _this.registry.gcDefaultHistorySearchType = data[2]['results'][22][0].RegValue;
                    }
                    if (data[2]['results'][23].length > 0) {
                        _this.registry.gcHistoryDateFromDays = data[2]['results'][23][0].RegValue;
                    }
                    if (data[2]['results'][24].length > 0) {
                        _this.registry.gcHistoryDateToDays = data[2]['results'][24][0].RegValue;
                    }
                    if (data[2]['results'][25].length > 0) {
                        _this.registry.gcWarnNewSearchAndCurrentLogID = data[2]['results'][25][0].RegValue;
                    }
                    if (data[2]['results'][26].length > 0) {
                        _this.registry.gcShowAdvantageQuotes = data[2]['results'][26][0].RegValue;
                    }
                    if (data[2]['results'][27].length > 0) {
                        _this.registry.gcContractPremiseSearchDelim = data[2]['results'][27][0].RegValue;
                    }
                    if (data[2]['results'][28].length > 0) {
                        _this.registry.gcContractCommenceDateFromDays = data[2]['results'][28][0].RegValue;
                    }
                    if (data[2]['results'][29].length > 0) {
                        _this.registry.gcPremiseCommenceDateFromDays = data[2]['results'][29][0].RegValue;
                    }
                    if (data[2]['results'][30].length > 0) {
                        _this.registry.gcContractCommenceDateToDays = data[2]['results'][30][0].RegValue;
                    }
                    if (data[2]['results'][31].length > 0) {
                        _this.registry.gcPremiseCommenceDateToDays = data[2]['results'][31][0].RegValue;
                    }
                    if (data[2]['results'][32].length > 0) {
                        _this.registry.glShowRecommendations = data[2]['results'][32][0].RegValue === 'Y' ? true : false;
                    }
                    if (data[2]['results'][33].length > 0) {
                        _this.registry.glShowInvoiceBalance = data[2]['results'][33][0].RegValue === 'Y' ? true : false;
                    }
                    if (data[2]['results'][33].length > 0) {
                        _this.registry.glMultiContactInd = true;
                    }
                    else {
                        _this.registry.glMultiContactInd = false;
                    }
                    _this.registry.giCallDateDays = parseInt(_this.registry.gcCallLogStartDateDays, 10);
                    if (_this.registry.giCallDateDays === 0 || isNaN(_this.registry.giCallDateDays)) {
                        _this.registry.giCallDateDays = 90;
                    }
                    _this.registry.giWOFromDays = parseInt(_this.registry.gcWODateFromDays, 10);
                    if (_this.registry.giWOFromDays === 0 || isNaN(_this.registry.giWOFromDays)) {
                        _this.registry.giWOFromDays = 180;
                    }
                    _this.registry.giWOFromDays = parseInt(_this.registry.gcWODateFromDays, 10);
                    if (_this.registry.giWOFromDays === 0 || isNaN(_this.registry.giWOFromDays)) {
                        _this.registry.giWOFromDays = 180;
                    }
                    _this.registry.giWOToDays = parseInt(_this.registry.gcWODateToDays, 10);
                    if (_this.registry.giWOToDays === 0 || isNaN(_this.registry.giWOToDays)) {
                        _this.registry.giWOToDays = 180;
                    }
                    _this.registry.giEventHistoryFromDays = parseInt(_this.registry.gcEventHistoryDateFromDays, 10);
                    if (_this.registry.giEventHistoryFromDays === 0 || isNaN(_this.registry.giEventHistoryFromDays)) {
                        _this.registry.giEventHistoryFromDays = 180;
                    }
                    _this.registry.giContractCommenceFromDays = parseInt(_this.registry.gcContractCommenceDateFromDays, 10);
                    if (_this.registry.giContractCommenceFromDays === 0 || isNaN(_this.registry.giContractCommenceFromDays)) {
                        _this.registry.giContractCommenceFromDays = 90;
                    }
                    _this.registry.giPremiseCommenceFromDays = parseInt(_this.registry.gcPremiseCommenceDateFromDays, 10);
                    if (_this.registry.giPremiseCommenceFromDays === 0 || isNaN(_this.registry.giPremiseCommenceFromDays)) {
                        _this.registry.giPremiseCommenceFromDays = 90;
                    }
                    _this.registry.giContractCommenceToDays = parseInt(_this.registry.gcContractCommenceDateToDays, 10);
                    if (_this.registry.giContractCommenceToDays === 0 || isNaN(_this.registry.giContractCommenceToDays)) {
                        _this.registry.giContractCommenceToDays = 30;
                    }
                    _this.registry.giPremiseCommenceToDays = parseInt(_this.registry.gcPremiseCommenceDateToDays, 10);
                    if (_this.registry.giPremiseCommenceToDays === 0 || isNaN(_this.registry.giPremiseCommenceToDays)) {
                        _this.registry.giPremiseCommenceToDays = 30;
                    }
                    _this.registry.giHistoryFromDays = parseInt(_this.registry.gcHistoryDateFromDays, 10);
                    if (_this.registry.giHistoryFromDays === 0 || isNaN(_this.registry.giHistoryFromDays)) {
                        _this.registry.giHistoryFromDays = 180;
                    }
                    _this.registry.giHistoryToDays = parseInt(_this.registry.gcHistoryDateToDays, 10);
                    if (_this.registry.giHistoryToDays === 0 || isNaN(_this.registry.giHistoryToDays)) {
                        _this.registry.giHistoryToDays = 180;
                    }
                }
                if (_this.registry.gcDefaultContactMediumCode !== '') {
                    var data_1 = [
                        {
                            'table': 'ContactMedium',
                            'query': { 'ContactMediumCode': _this.registry.gcDefaultContactMediumCode },
                            'fields': ['ContactMediumSystemDesc']
                        },
                        {
                            'table': 'ContactMediumLang',
                            'query': { 'ContactMediumCode': _this.registry.gcDefaultContactMediumCode },
                            'fields': ['ContactMediumDesc']
                        }
                    ];
                    _this.lookUpRecord(data_1, 100).subscribe(function (e) {
                        if (e['results'] && e['results'].length > 0) {
                            if (e['results'][1].length > 0) {
                                _this.registry.gcDefaultContactMediumDesc = e['results'][1][0].ContactMediumDesc;
                            }
                            else {
                                _this.registry.gcDefaultContactMediumDesc = e['results'][0][0].ContactMediumSystemDesc;
                            }
                        }
                    }, function (error) {
                    });
                }
                if (_this.registry.gcDefaultBusinessOriginCode !== '') {
                    var data_2 = [
                        {
                            'table': 'BusinessOrigin',
                            'query': { 'BusinessOriginCode': _this.registry.gcDefaultBusinessOriginCode, 'BusinessCode': _this.storeData['code'].business },
                            'fields': ['BusinessOriginSystemDesc']
                        },
                        {
                            'table': 'BusinessOriginLang',
                            'query': { 'BusinessOriginCode': _this.registry.gcDefaultBusinessOriginCode, 'BusinessCode': _this.storeData['code'].business },
                            'fields': ['BusinessOriginDesc']
                        }
                    ];
                    _this.lookUpRecord(data_2, 100).subscribe(function (e) {
                        if (e['results'] && e['results'].length > 0) {
                            if (e['results'][1].length > 0) {
                                _this.registry.gcDefaultBusinessOriginDesc = e['results'][1][0].BusinessOriginDesc;
                            }
                            else {
                                _this.registry.gcDefaultBusinessOriginDesc = e['results'][0][0].BusinessOriginSystemDesc;
                            }
                        }
                    }, function (error) {
                    });
                }
                _this.registryClone = JSON.parse(JSON.stringify(_this.registry));
                _this.store.dispatch({
                    type: CallCenterActionTypes.SAVE_OTHER_PARAMS, payload: {
                        registry: _this.registry,
                        webSpeedVariables: _this.webSpeedVariables,
                        otherVariables: _this.otherVariables,
                        syschars: _this.syschars
                    }
                });
                _this.postFetchRegistry();
            });
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    CallCentreGridComponent.prototype.cmdUpdateAccountOnClick = function (event) {
        var _this = this;
        if (this.otherVariables.CurrentCallLogID === '' && this.formGroup.controls['VisibleCurrentCallLogID'].value === '') {
            this.cmdNewCallOnClick({}).subscribe(function (res) {
                _this.runAccountMaintenance();
            });
        }
        else {
            this.runAccountMaintenance();
        }
    };
    CallCentreGridComponent.prototype.cmdNewCallOnClick = function (event) {
        var _this = this;
        var lGoNewCall = 'Y';
        var dataEvent = new Subject();
        if (this.otherVariables.CCMChangesMade === 'Y') {
            if (this.otherVariables.CurrentCallLogID !== '' && this.formGroup.controls['VisibleCurrentCallLogID'].value !== '' && (this.registry.cShowNotepadWhenEndCall === 'Y' || this.otherVariables.CallNotepadSummary === '' || this.otherVariables.CallNotepad === '')) {
                lGoNewCall = 'N';
                this.cmdEndCallOnClick({});
            }
            if (this.otherVariables.CurrentCallLogID !== '' && this.formGroup.controls['VisibleCurrentCallLogID'].value !== '' && (this.registry.cShowNotepadWhenEndCall === 'N' && this.otherVariables.CallNotepadSummary !== '' && this.otherVariables.CallNotepad !== '')) {
                lGoNewCall = 'N';
                this.endCallProcessing();
            }
        }
        if (lGoNewCall === 'Y') {
            this.fetchCallCentreDataPost('NewCall', {}, { BusinessCode: this.storeData['code'].business }).subscribe(function (data) {
                if (data['status'] === GlobalConstant.Configuration.Failure) {
                    _this.errorService.emitError(data['oResponse']);
                }
                else {
                    if (!data['errorMessage']) {
                        _this.otherVariables.CurrentCallLogID = data.CallLogID;
                        _this.formGroup.controls['CmdUpdateAccount'].disable();
                        _this.formGroup.controls['CmdNewCContact'].enable();
                        dataEvent.next(data);
                        dataEvent.unsubscribe();
                    }
                }
            });
        }
        else {
            dataEvent.unsubscribe();
        }
        return dataEvent.asObservable();
    };
    CallCentreGridComponent.prototype.cmdNotepadOnClick = function (event) {
        this.errorService.emitError({
            errorMessage: 'Page is not part of current sprint'
        });
    };
    CallCentreGridComponent.prototype.cmdEndCallOnClick = function (event) {
        var _this = this;
        if (this.otherVariables.CurrentCallLogID === '' && this.formGroup.controls['VisibleCurrentCallLogID'].value === '') {
            this.cmdNewCallOnClick({}).subscribe(function (res) {
                _this.endCallTrigger();
            });
        }
        else {
            this.endCallTrigger();
        }
    };
    CallCentreGridComponent.prototype.endCallTrigger = function () {
        if (this.otherVariables.CreateCallLogInCCMInd === 'Y') {
            if (this.registry.cShowNotepadWhenEndCall === 'Y' || this.otherVariables.CallNotepadSummary === '' || this.otherVariables.CallNotepad === '') {
                setTimeout(function () {
                    alert('Page not part of current sprint');
                }, 1000);
            }
            else {
                this.endCallProcessing();
            }
        }
    };
    CallCentreGridComponent.prototype.cmdNewCContactOnClick = function (event) {
        if (this.webSpeedVariables.lRunningFromWOMaintTask) {
            this.otherVariables.SelectedTicketNumber = this.otherVariables.ParentTaskTicketNumber;
        }
        this.errorService.emitError({
            errorMessage: 'Page not part of current sprint'
        });
    };
    CallCentreGridComponent.prototype.cmdUpdateProspectOnClick = function (event) {
        var _this = this;
        if (this.otherVariables.AccountNumberType === 'P') {
            if (this.otherVariables.CurrentCallLogID === '' && this.formGroup.controls['VisibleCurrentCallLogID'].value === '') {
                this.cmdNewCallOnClick({}).subscribe(function (res) {
                    _this.runProspectMaintenance(false);
                });
            }
            else {
                this.runProspectMaintenance(false);
            }
        }
    };
    CallCentreGridComponent.prototype.cmdViewEmployeeOnClick = function (event) {
        this.runEmployeeView();
    };
    CallCentreGridComponent.prototype.runEmployeeView = function () {
        var tabText = document.querySelector('#tabCont .nav-tabs li.active a span')['innerText'];
        var parentMode;
        if (tabText === this.tabsTranslation.tabLogs || tabText === this.tabsTranslation.tabWorkOrders) {
            parentMode = 'PassTechnician';
        }
        else {
            parentMode = 'CallCentreSearch';
        }
        this.errorService.emitError({
            errorMessage: 'Page not part of current sprint'
        });
    };
    CallCentreGridComponent.prototype.riExchangeUpdateHTMLDocument = function () {
        if (this.otherVariables.WindowClosingName === 'AmendmentsMade') {
            this.otherVariables.CCMChangesMade = 'Y';
            this.formGroup.controls['VisibleCurrentCallLogID'].setValue(this.otherVariables.CurrentCallLogID);
            this.cmdEndCallOnClick({});
        }
        if (this.otherVariables.WindowClosingName === 'NewContactChanges' || this.otherVariables.WindowClosingName === 'iCABSCMPipelineProspect') {
            this.otherVariables.CCMChangesMade = 'Y';
            this.formGroup.controls['VisibleCurrentCallLogID'].setValue(this.otherVariables.CurrentCallLogID);
            this.cmdEndCallOnClick({});
        }
        if (this.otherVariables.WindowClosingName === 'NotepadEndCallOK') {
            this.endCallProcessing();
        }
    };
    CallCentreGridComponent.prototype.runAccountMaintenance = function () {
        var _this = this;
        if (this.otherVariables.CurrentCallLogID === '' && (this.formGroup.controls['VisibleCurrentCallLogID'].value === '' || this.formGroup.controls['VisibleCurrentCallLogID'].value === '0')) {
            this.cmdNewCallOnClick({}).subscribe(function (res) {
                if (_this.storeData['otherParams'].otherVariables.AccountNumber !== '') {
                    _this.router.navigate([_this.ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], {
                        queryParams: {
                            parentMode: 'CallCentreSearch',
                            AccountNumber: _this.storeData['otherParams'].otherVariables.AccountNumber,
                            CurrentCallLogID: _this.formGroup.controls['VisibleCurrentCallLogID'].value || _this.otherVariables.CurrentCallLogID
                        }
                    });
                }
            });
        }
        else {
            if (this.storeData['otherParams'].otherVariables.AccountNumber !== '') {
                this.router.navigate([this.ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], {
                    queryParams: {
                        parentMode: 'CallCentreSearch',
                        AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
                        CurrentCallLogID: this.formGroup.controls['VisibleCurrentCallLogID'].value || this.otherVariables.CurrentCallLogID
                    }
                });
            }
        }
    };
    CallCentreGridComponent.prototype.runCustomerContactMaintenance = function () {
        var _this = this;
        if (this.otherVariables.CurrentCallLogID === '' && (this.formGroup.controls['VisibleCurrentCallLogID'].value === '' || this.formGroup.controls['VisibleCurrentCallLogID'].value === '0')) {
            this.cmdNewCallOnClick({}).subscribe(function (res) {
                _this.errorService.emitError({
                    errorMessage: 'Page not part of current sprint'
                });
            });
        }
    };
    CallCentreGridComponent.prototype.runCustomerContactDetailGrid = function () {
        var _this = this;
        if (this.otherVariables.CurrentCallLogID === '' && (this.formGroup.controls['VisibleCurrentCallLogID'].value === '' || this.formGroup.controls['VisibleCurrentCallLogID'].value === '0')) {
            this.cmdNewCallOnClick({}).subscribe(function (res) {
                _this.errorService.emitError({
                    errorMessage: 'Page not part of current sprint'
                });
            });
        }
        else {
            this.errorService.emitError({
                errorMessage: 'Page not part of current sprint'
            });
        }
    };
    CallCentreGridComponent.prototype.runContractMaintenance = function () {
        var _this = this;
        if (this.otherVariables.ContractLimitDataView === 'N') {
            if (this.otherVariables.CurrentCallLogID === '' && (this.formGroup.controls['VisibleCurrentCallLogID'].value === '' || this.formGroup.controls['VisibleCurrentCallLogID'].value === '0')) {
                this.cmdNewCallOnClick({}).subscribe(function (res) {
                    _this.runContractTrigger();
                });
            }
            else {
                this.runContractTrigger();
            }
        }
        else {
            this.errorService.emitError({
                errorMessage: this.registry['gcPermissionDeniedMessage']
            });
        }
    };
    CallCentreGridComponent.prototype.runContractTrigger = function () {
        if (this.otherVariables.ContractType === 'C') {
            this.router.navigate([this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], {
                queryParams: {
                    parentMode: 'CallCentreSearch',
                    ContractNumber: this.storeData['otherParams'].otherVariables['ContractNumber'],
                    CurrentCallLogID: this.formGroup.controls['VisibleCurrentCallLogID'].value || this.otherVariables.CurrentCallLogID
                }
            });
        }
        else if (this.otherVariables.ContractType === 'J') {
            this.router.navigate([this.ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], {
                queryParams: {
                    parentMode: 'CallCentreSearch',
                    ContractNumber: this.storeData['otherParams'].otherVariables['ContractNumber'],
                    CurrentCallLogID: this.formGroup.controls['VisibleCurrentCallLogID'].value || this.otherVariables.CurrentCallLogID
                }
            });
        }
        else if (this.otherVariables.ContractType === 'P') {
            this.router.navigate([this.ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], {
                queryParams: {
                    parentMode: 'CallCentreSearch',
                    ContractNumber: this.storeData['otherParams'].otherVariables['ContractNumber'],
                    CurrentCallLogID: this.formGroup.controls['VisibleCurrentCallLogID'].value || this.otherVariables.CurrentCallLogID
                }
            });
        }
    };
    CallCentreGridComponent.prototype.runPremiseMaintenance = function () {
        var _this = this;
        if (this.otherVariables.PremiseLimitDataView === 'N') {
            if (this.otherVariables.CurrentCallLogID === '' && (this.formGroup.controls['VisibleCurrentCallLogID'].value === '' || this.formGroup.controls['VisibleCurrentCallLogID'].value === '0')) {
                this.cmdNewCallOnClick({}).subscribe(function (res) {
                    _this.router.navigate([_this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
                        queryParams: {
                            parentMode: 'CallCentreSearch',
                            ContractNumber: _this.storeData['otherParams'].otherVariables['ContractNumber'],
                            AccountNumber: _this.storeData['otherParams'].otherVariables['AccountNumber'],
                            AccountName: _this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
                            contractTypeCode: _this.storeData['otherParams'].otherVariables.ContractType,
                            CurrentCallLogID: _this.formGroup.controls['VisibleCurrentCallLogID'].value || _this.otherVariables.CurrentCallLogID
                        }
                    });
                });
            }
            else {
                this.router.navigate([this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
                    queryParams: {
                        parentMode: 'CallCentreSearch',
                        ContractNumber: this.storeData['otherParams'].otherVariables['ContractNumber'],
                        AccountNumber: this.storeData['otherParams'].otherVariables['AccountNumber'],
                        AccountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
                        contractTypeCode: this.storeData['otherParams'].otherVariables.ContractType,
                        CurrentCallLogID: this.formGroup.controls['VisibleCurrentCallLogID'].value || this.otherVariables.CurrentCallLogID
                    }
                });
            }
        }
        else {
            this.errorService.emitError({
                errorMessage: this.registry['gcPermissionDeniedMessage']
            });
        }
    };
    CallCentreGridComponent.prototype.runProspectMaintenance = function (prospectAction) {
        var _this = this;
        if (this.otherVariables.CurrentCallLogID === '' && this.formGroup.controls['VisibleCurrentCallLogID'].value === '') {
            this.fetchCallCentreDataPost('NewCall', {}, { BusinessCode: this.storeData['code'].business }).subscribe(function (data) {
                if (data['status'] === GlobalConstant.Configuration.Failure) {
                    _this.errorService.emitError(data['oResponse']);
                }
                else {
                    if (!data['errorMessage']) {
                        _this.otherVariables.CurrentCallLogID = data.CallLogID;
                        _this.formGroup.controls['VisibleCurrentCallLogID'].setValue(data.CallLogID);
                        _this.formGroup.controls['CmdUpdateAccount'].disable();
                        _this.formGroup.controls['CmdNewCContact'].enable();
                        var parentMode = void 0;
                        if (prospectAction) {
                            parentMode = 'CallCentreSearchNew';
                        }
                        else {
                            parentMode = 'CallCentreSearch';
                        }
                        _this.router.navigate(['/prospecttocontract/maintenance/prospect'], {
                            queryParams: {
                                parentMode: parentMode,
                                AccountNumber: _this.storeData['otherParams'].otherVariables['AccountNumber'],
                                AccountName: _this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
                                ProspectNumber: _this.storeData['otherParams'].otherVariables['ProspectNumber'],
                                CurrentCallLogID: _this.formGroup.controls['VisibleCurrentCallLogID'].value || _this.otherVariables.CurrentCallLogID
                            }
                        });
                    }
                }
            });
        }
    };
    CallCentreGridComponent.prototype.runCustomerInformation = function (runningForm) {
        this.router.navigate(['grid/maintenance/contract/customerinformation'], {
            queryParams: {
                parentMode: runningForm,
                AccountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
                AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
                ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
                CurrentCallLogID: this.formGroup.controls['VisibleCurrentCallLogID'].value || this.otherVariables.CurrentCallLogID
            }
        });
    };
    CallCentreGridComponent.prototype.showInvoiceToScreen = function (params) {
        var _this = this;
        var rowId = params[0];
        this.fetchCallCentreDataGet('Single', { action: 0, InvoiceNumber: params[0], LayoutNumber: 0 }).subscribe(function (data) {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                _this.errorService.emitError(data['oResponse']);
            }
            else {
                if (!data['errorMessage']) {
                    if (data.url) {
                        window.open(data.url, '_blank');
                    }
                    else if (data.fullError.indexOf('iCABSAInvoiceReprintMaintenance.htm') >= 0) {
                        var tempList = data.fullError.split('?');
                        if (tempList && tempList.length > 1) {
                            var params_1 = new URLSearchParams(tempList[1]);
                            var invoiceNumber = params_1.get('InvoiceNumber');
                            _this.router.navigate(['application/invoiceReprintMaintenance'], { queryParams: { InvoiceNumber: invoiceNumber, InvoiceRowId: rowId } });
                        }
                    }
                }
            }
        });
    };
    CallCentreGridComponent.prototype.showInvoiceViaEmail = function (params) {
        var _this = this;
        if (this.otherVariables.CurrentCallLogID === '') {
            this.cmdNewCallOnClick({}).subscribe(function (res) {
                _this.emailInvoiceService();
            });
        }
        else {
            this.emailInvoiceService();
        }
    };
    CallCentreGridComponent.prototype.emailInvoiceService = function () {
        var _this = this;
        this.fetchCallCentreDataPost('EmailInvoice', { action: 6 }, {
            CallLogID: this.formGroup.controls['VisibleCurrentCallLogID'].value || this.otherVariables.CurrentCallLogID,
            AccountNumber: this.otherVariables.AccountNumber,
            BusinessCode: this.storeData['code'].business,
            InvoiceROWID: this.otherVariables.SelectedInvoiceRowID,
            EmailAddress: this.storeData['formGroup'].tabInvoices.controls['InvoiceEmailAddress'].value
        }).subscribe(function (data) {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                _this.errorService.emitError(data['oResponse']);
            }
            else {
                if (!data['errorMessage']) {
                    _this.errorService.emitError(data['ReturnMessage']);
                    _this.otherVariables.CCMChangesMade = 'Y';
                    _this.cmdEndCallOnClick({});
                }
                else {
                    _this.errorService.emitError(data);
                }
            }
        });
    };
    CallCentreGridComponent.prototype.portfolioContactDetails = function (cLevel) {
        var _this = this;
        var cExchangeMode;
        switch (cLevel[0]) {
            case 'AC':
                cExchangeMode = 'CCMSearchAccount';
                break;
            case 'CO':
                cExchangeMode = 'CCMSearchContract';
                break;
            case 'PR':
                cExchangeMode = 'CCMSearchPremise';
                break;
            default:
                break;
        }
        if (this.otherVariables.CurrentCallLogID === '' && this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '') {
            this.cmdNewCallOnClick({}).subscribe(function (res) {
                _this.router.navigate(['/application/ContactPersonMaintenance'], {
                    queryParams: {
                        parentMode: cExchangeMode,
                        CurrentCallLogID: _this.formGroup.controls['VisibleCurrentCallLogID'].value || _this.otherVariables.CurrentCallLogID,
                        ContractNumber: _this.storeData['otherParams'].otherVariables.ContractNumber,
                        ContractName: _this.storeData['otherParams'].otherVariables.ContractName,
                        accountNumber: _this.storeData['otherParams'].otherVariables.AccountNumber,
                        accountName: _this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
                        PremiseNumber: _this.storeData['otherParams'].otherVariables['PremiseNumber'],
                        PremiseName: _this.storeData['formGroup'].tabPremises.controls['PremiseName'].value
                    }
                });
            });
        }
        else {
            this.router.navigate(['/application/ContactPersonMaintenance'], {
                queryParams: {
                    parentMode: cExchangeMode,
                    CurrentCallLogID: this.formGroup.controls['VisibleCurrentCallLogID'].value || this.otherVariables.CurrentCallLogID,
                    ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
                    ContractName: this.storeData['otherParams'].otherVariables.ContractName,
                    AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
                    AccountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
                    PremiseNumber: this.storeData['otherParams'].otherVariables['PremiseNumber'],
                    PremiseName: this.storeData['formGroup'].tabPremises.controls['PremiseName'].value
                }
            });
        }
    };
    CallCentreGridComponent.prototype.endCallProcessing = function () {
        var _this = this;
        this.fetchCallCentreDataPost('EndCall', {}, {
            CallLogID: this.otherVariables.CallLogID,
            CallContactName: this.otherVariables.CallContactName,
            CallContactPosition: this.otherVariables.CallContactPosition,
            CallContactTelephone: this.otherVariables.CallContactTelephone,
            CallContactFax: this.otherVariables.CallContactFax,
            CallContactMobile: this.otherVariables.CallContactMobile,
            CallContactEmail: this.otherVariables.CallContactEmail,
            CallContactPostcode: this.otherVariables.CallContactPostcode,
            CallTicketReference: this.otherVariables.CallTicketReference,
            CallSummary: this.otherVariables.CallSummary,
            CallDetails: this.otherVariables.CallDetails,
            NotificationCloseType: this.otherVariables.NotificationCloseType
        }).subscribe(function (data) {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                _this.errorService.emitError(data['oResponse']);
            }
            else {
                if (!data['errorMessage']) {
                }
            }
        });
        this.otherVariables.CurrentCallLogID = '';
        this.otherVariables.CCMChangesMade = '';
        this.otherVariables.SelectedTicketNumber = '';
        this.otherVariables.CallContactName = '';
        this.otherVariables.CallContactPosition = '';
        this.otherVariables.CallContactTelephone = '';
        this.otherVariables.CallContactFax = '';
        this.otherVariables.CallContactMobile = '';
        this.otherVariables.CallContactEmail = '';
        this.otherVariables.CallContactPostcode = '';
        this.otherVariables.CallTicketReference = '';
        this.otherVariables.CallNotepadSummary = '';
        this.otherVariables.CallNotepad = '';
        this.otherVariables.NotificationCloseType = '0';
        this.formGroup.controls['VisibleCurrentCallLogID'].setValue('');
        this.formGroup.controls['CmdUpdateAccount'].disable();
        this.formGroup.controls['CmdUpdateProspect'].disable();
        this.formGroup.controls['CmdNewCContact'].enable();
        this.formGroup.controls['CmdViewEmployee'].disable();
    };
    CallCentreGridComponent.prototype.cmdEmployeeOnClick = function (event) {
        this.errorService.emitError({
            errorMessage: 'Page is not part of current sprint'
        });
    };
    CallCentreGridComponent.prototype.onActionBtnFocus = function (e) {
        var elemList = document.querySelectorAll('#actionBtnCont input:not([disabled])');
        if (e.target === elemList[elemList.length - 1]) {
            var code = (e.keyCode ? e.keyCode : e.which);
            var elemList_1 = document.querySelectorAll('#tabCont .nav-tabs li a');
            var currentSelectedIndex = Array.prototype.indexOf.call(elemList_1, document.querySelector('#tabCont .nav-tabs li a.active'));
            if (code === 9 && currentSelectedIndex < (elemList_1.length - 1)) {
                var click = new MouseEvent('click', { bubbles: true });
                this.renderer.invokeElementMethod(elemList_1[currentSelectedIndex + 1], 'dispatchEvent', [click]);
                setTimeout(function () {
                    document.querySelector('#tabCont .tab-content .tab-pane.active input:not([disabled]), #tabCont .tab-content .tab-pane.active select:not([disabled])')['focus']();
                }, 0);
            }
            return;
        }
    };
    CallCentreGridComponent.prototype.resetCallDetails = function () {
        this.formGroup.controls['CmdUpdateAccount'].disable();
        this.formGroup.controls['CmdUpdateProspect'].disable();
        this.formGroup.controls['CmdNewCContact'].enable();
        this.formGroup.controls['CmdViewEmployee'].disable();
        this.storeData['fieldVisibility'].tabAccounts.FurtherRecords = false;
        this.storeData['fieldVisibility'].tabContracts.FurtherRecords = false;
        this.storeData['fieldVisibility'].tabPremises.FurtherRecords = false;
        this.storeData['fieldVisibility'].tabInvoices.FurtherRecords = false;
        this.storeData['fieldVisibility'].tabHistory.FurtherRecords = false;
        this.storeData['fieldVisibility'].tabEventHistory.FurtherRecords = false;
        this.storeData['fieldVisibility'].tabWorkOrders.FurtherRecords = false;
        this.storeData['fieldVisibility'].tabAccounts.AccountForm = false;
        this.storeData['fieldVisibility'].tabPremises.PremiseForm = false;
        this.otherVariables.CCMChangesMade = '';
        this.otherVariables.SelectedTicketNumber = '';
        this.otherVariables.CallContactName = '';
        this.otherVariables.CallContactPosition = '';
        this.otherVariables.CallContactTelephone = '';
        this.otherVariables.CallContactFax = '';
        this.otherVariables.CallContactMobile = '';
        this.otherVariables.CallContactEmail = '';
        this.otherVariables.CallContactPostcode = '';
        this.otherVariables.CallTicketReference = '';
        this.otherVariables.AccountNumber = '';
        this.storeData['formGroup'].main.controls['AccountProspectNumber'].setValue('');
        this.storeData['formGroup'].main.controls['AccountProspectName'].setValue('');
        this.storeData['formGroup'].main.controls['AccountProspectContactName'].setValue('');
        this.storeData['formGroup'].tabAccounts.controls['AccountName'].setValue('');
        this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine1'].setValue('');
        this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine2'].setValue('');
        this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine3'].setValue('');
        this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine4'].setValue('');
        this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine5'].setValue('');
        this.storeData['formGroup'].tabAccounts.controls['AccountPostcode'].setValue('');
        this.storeData['formGroup'].tabAccounts.controls['AccountContactPosition'].setValue('');
        this.storeData['formGroup'].tabAccounts.controls['AccountContactTelephone'].setValue('');
        this.otherVariables.ProspectNumber = '';
        this.otherVariables.TechEmployeeCode = '';
        this.otherVariables.ProductCode = '';
        this.otherVariables.ProductDesc = '';
        this.otherVariables.ContractNumber = '';
        this.otherVariables.ContractName = '';
        this.otherVariables.PremiseNumber = '';
        this.otherVariables.ProductCode = '';
        this.otherVariables.ProductDesc = '';
        this.otherVariables.TicketProspectNumber = '';
        this.storeData['formGroup'].tabAccounts.controls['AccountContactName'].setValue('');
        this.storeData['formGroup'].tabPremises.controls['PremiseName'].setValue('');
        if (!this.webSpeedVariables.lClosingLogBeforeProceed) {
            this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue('');
            this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue2'].setValue('');
            this.storeData['formGroup'].tabAccounts.controls['AccountDataSet'].setValue(this.storeFormDataClone.tabAccounts.AccountDataSet);
            this.storeData['formGroup'].tabAccounts.controls['AccountNational'].setValue(this.storeFormDataClone.tabAccounts.AccountNational);
            this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn2'].setValue(this.storeFormDataClone.tabAccounts.AccountSearchOn2);
            this.storeData['formGroup'].tabAccounts.controls['AccountStatus'].setValue(this.storeFormDataClone.tabAccounts.AccountStatus);
            this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue(this.storeFormDataClone.tabAccounts.AccountSearchOn);
            this.storeData['formGroup'].tabAccounts.controls['AccountContractType'].setValue(this.storeFormDataClone.tabAccounts.AccountContractType);
        }
        this.webSpeedVariables.lClosingLogBeforeProceed = false;
        this.storeData['formGroup'].tabLogs.controls['CallLogSearchOn'].setValue(this.storeFormDataClone.tabLogs.CallLogSearchOn);
        this.storeData['formGroup'].tabLogs.controls['CallLogSearchValue'].setValue('');
        this.otherVariables.SelectedTicketNumber = '';
        this.otherVariables.SelectedAddressLine4 = '';
        this.otherVariables.SelectedAddressLine5 = '';
        this.otherVariables.SelectedPostcode = '';
        this.otherVariables.AccountNumberType = 'A';
        this.resetAllSearchDetails();
    };
    CallCentreGridComponent.prototype.resetAllSearchDetails = function () {
        var _this = this;
        this.storeData['fieldVisibility'].tabContracts.FurtherRecords = false;
        this.storeData['formGroup'].tabContracts.controls['ContractSearchOn'].setValue('all');
        this.storeData['formGroup'].tabContracts.controls['ContractSearchValue'].setValue('');
        this.storeData['formGroup'].tabContracts.controls['ContractStatusCode'].setValue(this.storeFormDataClone.tabContracts.ContractStatusCode);
        this.storeData['formGroup'].tabContracts.controls['ContractTypeCode'].setValue(this.storeFormDataClone.tabContracts.ContractTypeCode);
        this.storeData['fieldVisibility'].tabPremises.FurtherRecords = false;
        this.storeData['formGroup'].tabPremises.controls['PremSelectedContract'].setValue('');
        this.storeData['formGroup'].tabPremises.controls['PremiseSearchOn'].setValue('all');
        this.storeData['formGroup'].tabPremises.controls['PremiseSearchValue'].setValue('');
        this.storeData['formGroup'].tabPremises.controls['PremiseStatusCode'].setValue('all');
        this.storeData['formGroup'].tabPremises.controls['PremiseContractTypeCode'].setValue(this.storeFormDataClone.tabPremises.PremiseContractTypeCode);
        this.otherVariables.InvSelectedContract = '';
        this.otherVariables.InvSelectedPremise = '';
        this.storeData['formGroup'].tabInvoices.controls['InvSelectedContractPremise'].setValue();
        this.storeData['formGroup'].tabInvoices.controls['InvoiceSearchOn'].setValue('all');
        this.storeData['formGroup'].tabInvoices.controls['InvoiceSearchValue'].setValue('');
        this.storeData['formGroup'].tabInvoices.controls['InvoiceContractTypeCode'].setValue(this.storeFormDataClone.tabInvoices.InvoiceContractTypeCode);
        this.otherVariables.EventHistorySelectedContract = '';
        this.otherVariables.EventHistorySelectedPremise = '';
        this.otherVariables.EventHistorySelectedContractPremise = '';
        this.storeData['formGroup'].tabEventHistory.controls['EventHistorySelectedContractPremise'].setValue('');
        this.storeData['formGroup'].tabEventHistory.controls['EventHistoryType'].setValue(this.storeFormDataClone.tabEventHistory.EventHistoryType);
        this.otherVariables.HistorySelectedContract = '';
        this.otherVariables.HistorySelectedPremise = '';
        this.storeData['formGroup'].tabHistory.controls['HistorySelectedContractPremise'].setValue('');
        this.storeData['formGroup'].tabHistory.controls['HistoryType'].setValue(this.storeFormDataClone.tabHistory.HistoryType);
        this.otherVariables.SelectedTicketNumber = '';
        this.otherVariables.CallLogSelectedContract = '';
        this.otherVariables.CallLogSelectedPremise = '';
        this.storeData['formGroup'].tabLogs.controls['CallLogSelectedContractPremise'].setValue('');
        setTimeout(function () {
            _this.storeData['formGroup'].tabLogs.controls['CallLogSearchOn'].setValue(_this.storeFormDataClone.tabLogs.CallLogSearchOn);
        }, 0);
        this.storeData['formGroup'].tabLogs.controls['CallLogSearchValue'].setValue('');
        this.otherVariables.WOSelectedContract = '';
        this.otherVariables.WOSelectedPremise = '';
        this.storeData['formGroup'].tabWorkOrders.controls['WOSelectedContractPremise'].setValue('');
        this.otherVariables.dlContractSelectedContract = '';
        this.otherVariables.dlContractSelectedPremise = '';
        this.setDefaultDates();
        this.storeData['fieldVisibility'].tabContracts.ContractSearchValue = true;
        this.storeData['fieldVisibility'].tabContracts.ContractCommenceDateFrom = false;
        this.storeData['fieldVisibility'].tabContracts.ContractCommenceDateTo = false;
        this.storeData['fieldVisibility'].tabPremises.PremiseSearchValue = true;
        this.storeData['fieldVisibility'].tabPremises.PremiseCommenceDateFrom = false;
        this.storeData['fieldVisibility'].tabPremises.PremiseCommenceDateTo = false;
        this.passLiveAccountStatusToAllSearches();
        this.passContractTypeToAllSearches();
    };
    CallCentreGridComponent.prototype.onTabSelect = function (event) {
        var _this = this;
        if (!this.isNavAway) {
            this.formGroup.controls['CmdViewEmployee'].disable();
            if (event.tabInfo) {
                this.getTranslatedValue('Premises', null).subscribe(function (res) {
                    if (res) {
                        if (event.tabInfo.translated === res || event.tabInfo.title === res || event.tabInfo.title === 'Premises') {
                            if (_this.storeData['otherParams']['otherVariables'])
                                _this.storeData['otherParams']['otherVariables']['currentTab'] = _this.storeData['tabsTranslation'].tabPremises;
                            if (_this.storeData['refresh'].tabPremises === true) {
                                _this.store.dispatch({
                                    type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['Premises']
                                });
                                _this.storeData['refresh'].tabPremises = false;
                            }
                        }
                        else {
                            if (_this.storeData['otherParams']['otherVariables'])
                                _this.storeData['otherParams']['otherVariables']['currentTab'] = '';
                        }
                    }
                });
                this.getTranslatedValue('Contracts/Jobs', null).subscribe(function (res) {
                    if (res) {
                        if (event.tabInfo.translated === res || event.tabInfo.title === res || event.tabInfo.title === 'Contracts/Jobs') {
                            if (_this.storeData['otherParams']['otherVariables'])
                                _this.storeData['otherParams']['otherVariables']['currentTab'] = _this.storeData['tabsTranslation'].tabContracts;
                            if (_this.storeData['refresh'].tabContracts === true) {
                                _this.store.dispatch({
                                    type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['Contracts']
                                });
                                _this.storeData['refresh'].tabContracts = false;
                            }
                        }
                        else {
                            if (_this.storeData['otherParams']['otherVariables'])
                                _this.storeData['otherParams']['otherVariables']['currentTab'] = '';
                        }
                    }
                });
                this.getTranslatedValue('Invoices', null).subscribe(function (res) {
                    if (res) {
                        if (event.tabInfo.translated === res || event.tabInfo.title === res || event.tabInfo.title === 'Invoices') {
                            if (_this.storeData['otherParams']['otherVariables'])
                                _this.storeData['otherParams']['otherVariables']['currentTab'] = _this.storeData['tabsTranslation'].tabInvoices;
                            if (_this.storeData['refresh'].tabInvoices === true) {
                                _this.store.dispatch({
                                    type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['Invoices']
                                });
                                _this.storeData['refresh'].tabInvoices = false;
                            }
                        }
                        else {
                            if (_this.storeData['otherParams']['otherVariables'])
                                _this.storeData['otherParams']['otherVariables']['currentTab'] = '';
                        }
                    }
                });
                this.getTranslatedValue('Work Orders', null).subscribe(function (res) {
                    if (res) {
                        if (event.tabInfo.translated === res || event.tabInfo.title === res || event.tabInfo.title === 'Work Orders') {
                            if (_this.storeData['otherParams']['otherVariables'])
                                _this.storeData['otherParams']['otherVariables']['currentTab'] = _this.storeData['tabsTranslation'].tabWorkOrders;
                            if (_this.storeData['refresh'].tabWorkOrders === true) {
                                _this.store.dispatch({
                                    type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['WorkOrders']
                                });
                                _this.storeData['refresh'].tabWorkOrders = false;
                            }
                        }
                        else {
                            if (_this.storeData['otherParams']['otherVariables'])
                                _this.storeData['otherParams']['otherVariables']['currentTab'] = '';
                        }
                    }
                });
                this.getTranslatedValue('Event History', null).subscribe(function (res) {
                    if (res) {
                        if (event.tabInfo.translated === res || event.tabInfo.title === res || event.tabInfo.title === 'Event History') {
                            if (_this.storeData['otherParams']['otherVariables'])
                                _this.storeData['otherParams']['otherVariables']['currentTab'] = _this.storeData['tabsTranslation'].tabEventHistory;
                            if (_this.storeData['refresh'].tabEventHistory === true) {
                                _this.store.dispatch({
                                    type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['EventHistory']
                                });
                                _this.storeData['refresh'].tabEventHistory = false;
                            }
                        }
                        else {
                            if (_this.storeData['otherParams']['otherVariables'])
                                _this.storeData['otherParams']['otherVariables']['currentTab'] = '';
                        }
                    }
                });
                this.getTranslatedValue('History', null).subscribe(function (res) {
                    if (res) {
                        if (event.tabInfo.translated === res || event.tabInfo.title === res || event.tabInfo.title === 'History') {
                            if (_this.storeData['otherParams']['otherVariables'])
                                _this.storeData['otherParams']['otherVariables']['currentTab'] = _this.storeData['tabsTranslation'].tabHistory;
                            if (_this.storeData['refresh'].tabHistory === true) {
                                _this.store.dispatch({
                                    type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['History']
                                });
                                _this.storeData['refresh'].tabHistory = false;
                            }
                        }
                        else {
                            if (_this.storeData['otherParams']['otherVariables'])
                                _this.storeData['otherParams']['otherVariables']['currentTab'] = '';
                        }
                    }
                });
                this.getTranslatedValue('Logs', null).subscribe(function (res) {
                    if (res) {
                        if (event.tabInfo.translated === res || event.tabInfo.title === res || event.tabInfo.title === 'Logs') {
                            if (_this.storeData['otherParams']['otherVariables'])
                                _this.storeData['otherParams']['otherVariables']['currentTab'] = _this.storeData['tabsTranslation'].tabLogs;
                            if (_this.storeData['refresh'].tabLogs === true) {
                                _this.store.dispatch({
                                    type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['Logs']
                                });
                                _this.storeData['refresh'].tabLogs = false;
                            }
                        }
                        else {
                            if (_this.storeData['otherParams']['otherVariables'])
                                _this.storeData['otherParams']['otherVariables']['currentTab'] = '';
                        }
                    }
                });
                this.getTranslatedValue('Dashboard', null).subscribe(function (res) {
                    if (res) {
                        if (event.tabInfo.translated === res || event.tabInfo.title === res || event.tabInfo.title === 'Dashboard') {
                            if (_this.storeData['otherParams']['otherVariables'])
                                _this.storeData['otherParams']['otherVariables']['currentTab'] = _this.storeData['tabsTranslation'].tabDashboard;
                            if (_this.storeData['refresh'].tabDashboard === true) {
                                _this.store.dispatch({
                                    type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['Dashboard']
                                });
                                _this.storeData['refresh'].tabDashboard = false;
                            }
                        }
                        else {
                            if (_this.storeData['otherParams']['otherVariables'])
                                _this.storeData['otherParams']['otherVariables']['currentTab'] = '';
                        }
                    }
                });
                this.getTranslatedValue('Advantage Quotes', null).subscribe(function (res) {
                    if (res) {
                        if (event.tabInfo.translated === res || event.tabInfo.title === res || event.tabInfo.title === 'Advantage Quotes') {
                            if (_this.storeData['otherParams']['otherVariables'])
                                _this.storeData['otherParams']['otherVariables']['currentTab'] = _this.storeData['tabsTranslation'].advantage;
                            if (_this.storeData['refresh'].tabDlContract === true) {
                                _this.store.dispatch({
                                    type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['DlContract']
                                });
                                _this.storeData['refresh'].tabDlContract = false;
                            }
                        }
                        else {
                            if (_this.storeData['otherParams']['otherVariables'])
                                _this.storeData['otherParams']['otherVariables']['currentTab'] = '';
                        }
                    }
                });
            }
        }
    };
    CallCentreGridComponent.prototype.promptSave = function (event) {
        this.cmdEndCallOnClick({});
    };
    CallCentreGridComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show(data, true);
    };
    CallCentreGridComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('Contact Centre - Search', null).subscribe(function (res) {
            if (res) {
                _this.titleService.setTitle(res);
                _this.pageTitle = res;
            }
            else {
            }
        });
        this.getTranslatedValue('All Types', null).subscribe(function (res) {
            if (res) {
                _this.registry.gcContractTypeDescs = res;
            }
            else {
                _this.registry.gcContractTypeDescs = 'All Types';
            }
        });
        Observable.forkJoin(this.getTranslatedValue('Customer Search', null), this.getTranslatedValue('Logs', null), this.getTranslatedValue('Contracts/Jobs', null), this.getTranslatedValue('Dashboard', null), this.getTranslatedValue('Event History', null), this.getTranslatedValue('History', null), this.getTranslatedValue('Invoices', null), this.getTranslatedValue('Premises', null), this.getTranslatedValue('Work Orders', null), this.getTranslatedValue('Advantage Quotes', null)).subscribe(function (data) {
            _this.storeData['tabsTranslation'].tabAccounts = data[0];
            _this.storeData['tabsTranslation'].tabLogs = data[1];
            _this.storeData['tabsTranslation'].tabContracts = data[2];
            _this.storeData['tabsTranslation'].tabDashboard = data[3];
            _this.storeData['tabsTranslation'].tabEventHistory = data[4];
            _this.storeData['tabsTranslation'].tabHistory = data[5];
            _this.storeData['tabsTranslation'].tabInvoices = data[6];
            _this.storeData['tabsTranslation'].tabPremises = data[7];
            _this.storeData['tabsTranslation'].tabWorkOrders = data[8];
            _this.storeData['tabsTranslation'].advantage = data[9];
            _this.tabsTranslation = _this.storeData['tabsTranslation'];
            if (_this.store) {
                _this.store.dispatch({
                    type: CallCenterActionTypes.TABS_TRANSLATION, payload: _this.tabsTranslation
                });
            }
        });
        this.getTranslatedValue('You have a current Log Reference. Do you want to close this before proceeding?', null).subscribe(function (res) {
            if (res) {
                _this.promptTitle = res;
            }
        });
    };
    CallCentreGridComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-call-center-grid',
                    templateUrl: 'iCABSCMCallCentreGrid.html',
                    styles: ["\n    .tabs-cont {\n      min-height: 400px;\n    }\n\n  "]
                },] },
    ];
    CallCentreGridComponent.ctorParameters = [
        { type: Injector, },
        { type: Title, },
        { type: FormBuilder, },
        { type: SysCharConstants, },
        { type: SpeedScriptConstants, },
        { type: Renderer, },
    ];
    CallCentreGridComponent.propDecorators = {
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return CallCentreGridComponent;
}(BaseComponent));
