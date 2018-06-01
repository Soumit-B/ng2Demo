import { Component, NgZone, ViewChild, Renderer } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { Observable } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { GroupAccountNumberComponent } from '../../internal/search/iCABSSGroupAccountNumberSearch';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { MaintenanceTypeAComponent } from './contract-maintenance-tabs/maintenance-type-a';
import { MaintenanceTypeBComponent } from './contract-maintenance-tabs/maintenance-type-b';
import { MaintenanceTypeCComponent } from './contract-maintenance-tabs/maintenance-type-c';
import { MaintenanceTypeDComponent } from './contract-maintenance-tabs/maintenance-type-d';
import { MaintenanceTypeEComponent } from './contract-maintenance-tabs/maintenance-type-e';
import { HttpService } from '../../../shared/services/http-service';
import { CBBService } from '../../../shared/services/cbb.service';
import { ErrorService } from '../../../shared/services/error.service';
import { AuthService } from '../../../shared/services/auth.service';
import { RiExchange } from '../../../shared/services/riExchange';
import { MessageService } from '../../../shared/services/message.service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { SysCharConstants } from '../../../shared/constants/syscharservice.constant';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { ContractActionTypes } from '../../actions/contract';
import { Utils } from '../../../shared/services/utility';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { NavData } from '../../../shared/services/navigationData';
import { PageIdentifier } from '../../base/PageIdentifier';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
import { Subject } from 'rxjs/Subject';
export var ContractMaintenanceComponent = (function () {
    function ContractMaintenanceComponent(router, route, componentInteractionService, zone, httpService, renderer, fb, serviceConstants, errorService, messageService, riExchange, authService, ajaxconstant, titleService, SysCharConstants, store, translate, localeTranslateService, utils, routeAwayGlobals, location, cbb) {
        var _this = this;
        this.router = router;
        this.route = route;
        this.componentInteractionService = componentInteractionService;
        this.zone = zone;
        this.httpService = httpService;
        this.renderer = renderer;
        this.fb = fb;
        this.serviceConstants = serviceConstants;
        this.errorService = errorService;
        this.messageService = messageService;
        this.riExchange = riExchange;
        this.authService = authService;
        this.ajaxconstant = ajaxconstant;
        this.titleService = titleService;
        this.SysCharConstants = SysCharConstants;
        this.store = store;
        this.translate = translate;
        this.localeTranslateService = localeTranslateService;
        this.utils = utils;
        this.routeAwayGlobals = routeAwayGlobals;
        this.location = location;
        this.cbb = cbb;
        this.tabs = [
            { title: 'Address', active: true, hidden: false },
            { title: 'Invoice', disabled: false, hidden: false },
            { title: 'General', removable: false, hidden: false }
        ];
        this.ajaxSource = new BehaviorSubject(0);
        this.contractSearchComponent = ContractSearchComponent;
        this.accountSearchComponent = AccountSearchComponent;
        this.groupAccountSearchComponent = GroupAccountNumberComponent;
        this.isNegBranchDropdownsDisabled = true;
        this.negBranchNumberSelected = {
            id: '',
            text: ''
        };
        this.isRequesting = false;
        this.hideEllipsis = false;
        this.autoOpen = '';
        this.autoOpenSearch = false;
        this.autoOpenAccount = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.method = 'contract-management/maintenance';
        this.module = 'contract';
        this.operation = 'Application/iCABSAContractMaintenance';
        this.contentType = 'application/x-www-form-urlencoded';
        this.addNew = true;
        this.getContractDetails = {
            method: 'contract-management/search',
            module: 'service-cover',
            operation: 'Application/iCABSAServiceCoverSearch'
        };
        this.query = new URLSearchParams();
        this.queryLookUp = new URLSearchParams();
        this.querySysChar = new URLSearchParams();
        this.queryContract = new URLSearchParams();
        this.searchModalRoute = '';
        this.searchPageRoute = '';
        this.showHeader = true;
        this.showCloseButton = true;
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.promptTitle = '';
        this.promptConfirmTitle = '';
        this.promptContent = '';
        this.promptConfirmContent = '';
        this.defaultCode = {
            country: 'ZA',
            business: 'D'
        };
        this.inputParams = {
            'parentMode': 'AddContractFromAccount',
            'pageTitle': 'Contract Entry',
            'pageHeader': 'Contract Maintenance',
            'currentContractType': 'C',
            'currentContractTypeURLParameter': '<contract>',
            'showAddNew': true
        };
        this.contractSearchParams = {
            'parentMode': 'ContractSearch',
            'currentContractType': 'C',
            'currentContractTypeURLParameter': '<contract>',
            'showAddNew': true
        };
        this.inputParamsAccount = {
            'parentMode': 'LookUp',
            'showAddNew': false,
            'showAddNewDisplay': false,
            'countryCode': '',
            'businessCode': '',
            'showCountryCode': false,
            'showBusinessCode': false,
            'searchValue': '',
            'triggerCBBChange': false
        };
        this.inputParamsGroupAccount = {
            'parentMode': 'LookUp',
            'showAddNew': false,
            'countryCode': '',
            'businessCode': '',
            'showCountryCode': false,
            'showBusinessCode': false,
            'searchValue': ''
        };
        this.queryParams = {
            action: '0',
            operation: 'Application/iCABSAAccountMaintenance',
            module: 'account',
            method: 'contract-management/maintenance',
            contentType: 'application/x-www-form-urlencoded',
            branchNumber: '',
            branchName: ''
        };
        this.queryParamsContract = {
            action: '0',
            operation: 'Application/iCABSAContractMaintenance',
            module: 'contract',
            method: 'contract-management/maintenance',
            contentType: 'application/x-www-form-urlencoded',
            branchNumber: '',
            branchName: ''
        };
        this.labelFields = {
            contractNumber: 'Contract Number',
            lostBusinessDesc1: 'Lost Business Reason',
            lostBusinessDesc2: 'Lost Business Desc 2',
            lostBusinessDesc3: 'Lost Business Desc 3'
        };
        this.tabsError = {
            tabA: false,
            tabB: false,
            tabC: false,
            tabD: false,
            tabE: false
        };
        this.tabsToCheck = {
            tabA: true,
            tabB: true,
            tabC: true,
            tabD: false,
            tabE: false
        };
        this.componentList = [MaintenanceTypeAComponent, MaintenanceTypeBComponent, MaintenanceTypeCComponent];
        this.optionsList = [
            { title: '', list: ['Options'] },
            { title: 'Portfolio', list: ['Premises Details', 'Service Covers', 'Account Information', 'Telesales Order'] },
            { title: 'History', list: ['History', 'Event History'] },
            { title: 'Invoicing', list: ['Pro Rata Charge', 'Invoice Narrative', 'Invoice Charge', 'Invoice History'] },
            { title: 'Service', list: ['Product Summary', 'Static Visits (SOS)', 'Visit Summary', 'Service Recommendations', 'State of Service', 'Visit Tolerances', 'Infestation Tolerances', 'Waste Consignment Note History'] },
            { title: 'Customer Relations', list: ['Contact Management', 'Contact Centre Search', 'Customer Information', 'Prospect Conversion'] }
        ];
        this.branchList = [];
        this.contractCommenceDate = void 0;
        this.inactiveEffectDate = void 0;
        this.dateObjectsEnabled = {
            contractCommenceDate: false,
            inactiveEffectDate: false
        };
        this.dateObjectsValidate = {
            contractCommenceDate: false,
            inactiveEffectDate: false
        };
        this.clearDate = {
            contractCommenceDate: false,
            inactiveEffectDate: false
        };
        this.contractNameReadOnly = true;
        this.options = 'Options';
        this.updateMode = false;
        this.addMode = false;
        this.searchMode = true;
        this.showControlBtn = true;
        this.displayList = {
            'contractAnnualValue': false,
            'future': false,
            'pnol': false,
            'nationalAccount': false,
            'expired': false,
            'badDebtAccount': false,
            'badDebtAccountCheckbox': false,
            'trialPeriodInd': false,
            'anyPendingBelow': false,
            'inactiveEffectDate': false,
            'lostBusinessDesc1': false,
            'lostBusinessDesc2': false,
            'lostBusinessDesc3': false,
            'customerInformation': false,
            'copy': true,
            'moreThanOneContract': false,
            'groupAccount': true,
            'options': true
        };
        this.fieldRequired = {
            'invoiceAnnivDate': true,
            'negBranchNumber': true,
            'contractNumber': true
        };
        this.sysCharParams = {
            vDisableFields: '',
            vSCEnableAutoNumber: '',
            vSCNationalAccountChecked: '',
            vSCEnableAddressLine3: '',
            vSCAddressLine3Logical: '',
            vSCEnableMaxAddress: '',
            vSCEnableMaxAddressValue: '',
            vSCEnableInvoiceFee: '',
            vSCEnableDefaultJobExpiry: '',
            vSCEnableCompanyCode: '',
            vSCEnableMinimumDuration: '',
            vSCEnableMarktSelect: '',
            vSCEnableHopewiserPAF: '',
            vSCEnableDatabasePAF: '',
            vSCAddressLine4Required: '',
            vSCAddressLine4Logical: '',
            vSCAddressLine5Required: '',
            vSCAddressLine5Logical: '',
            vSCPostCodeRequired: '',
            vSCPostCodeMustExistInPAF: '',
            vSCEnablePostcodeDefaulting: '',
            vSCRunPAFSearchOn1stAddressLine: '',
            vSCEnableLtdCompanyAndReg: '',
            vSCTaxRegNumber: '',
            vSCAccountDiscounts: '',
            vSCMonthsNotice: '',
            vSCEnableMonthsNotice: '',
            vSCEnableMonthsNoticeNotUsed: '',
            vSCEnableExternalReference: '',
            vSCEnableExternalRefNotUsed: '',
            vSCEnableBankDetailEntry: '',
            vSCEnableLegacyMandate: '',
            vSCEnableSubsequentDuration: '',
            vSCSubsequentDuration: '',
            vSCAutoCreateRenewalProspect: '',
            vDefaultCountryCode: '',
            vDefaultCompanyCode: '',
            vDefaultCompanyDesc: '',
            vSCEnableTaxCodeDefaultingText: '',
            vSCEnableTaxCodeDefaulting: '',
            vRequired: '',
            vSCMinimumDuration: '',
            glAllowUserAuthView: '',
            glAllowUserAuthUpdate: '',
            vSCEnableTrialPeriodServices: '',
            vSCEnableTaxRegistrationNumber2: '',
            vSCEnableGPSCoordinates: '',
            vSCHidePostcode: '',
            vSCEnableHPRLExempt: '',
            vSCDisplayContractOwner: '',
            vSCContractOwnerRequired: '',
            vSCMultiContactInd: '',
            vSCDisplayContractPaymentDueDay: '',
            vSCEnableSEPAFinanceMandate: '',
            vSCEnableSEPAFinanceMandateLog: '',
            vSCDisableDefaultCountryCode: '',
            vSCHideBankDetailsTab: '',
            vCompanyVATNumberLabel: '',
            vSCGroupAccount: '',
            vSCNoticePeriod: '',
            vSCNoticePeriodNotused: '',
            vSCCapitalFirstLtr: '',
            vSCVisitTolerances: '',
            vSCInfestationTolerance: '',
            vCIEnabled: '',
            vSCConnectContrPostcodeNegEmp: '',
            vEnablePostcodeDefaulting: '',
            vShowWasteConsignmentNoteHistory: '',
            vSCEnableValidatePostcodeSuburb: '',
            vSCEnablePostcodeSuburbLog: '',
            gcREGContactCentreReview: '',
            vSCEnablePayTypeAtInvGroupLevel: '',
            vSCEnableRenewals: '',
            vExcludedBranches: []
        };
        this.otherParams = {
            disableNameSearch: '',
            blnCIEnabled: '',
            vbEnablePayTypeAtInvGroupLevel: '',
            ReqAutoInvoiceFee: '',
            vbPaymentTypeCodeInd: '',
            vbCompanyCodeInd: '',
            SepaConfigInd: '',
            vDisableFields: '',
            lREGContactCentreReview: '',
            vTrialPeriodInd: '',
            vSaveUpdate: '',
            blnContractNameJustSet: false,
            currentBranchNumber: ''
        };
        this.isAccountEllipsisDisabled = true;
        this.isContractEllipsisDisabled = false;
        this.isGroupAccountEllipsisDisabled = true;
        this.isCommenceDateDisabled = true;
        this.prospectNumber = '';
        this.validateCounter = 0;
        this.displayListClone = {};
        this.shiftTop = false;
        this.tabsHide = false;
        this.isCollapsibleOpen = false;
        this.storeData = {};
        this.contractStoreData = {};
        this.accountStoreData = {};
        this.isFormEnabled = false;
        this.isCopyClicked = false;
        this.formValidityCounter = 0;
        this.beforeSave = false;
        this.isNationalAccount = false;
        this.isChild = false;
        this.navigateToPremise = false;
        this.accountFound = false;
        this.contractFormGroup = this.fb.group({
            ContractNumber: [{ value: '', disabled: false }, [Validators.required, Validators.pattern('^[0-9]+')]],
            ContractName: [{ value: '', disabled: true }, Validators.required],
            CurrentPremises: [{ value: '', disabled: true }],
            Copy: [{ value: 'Copy', disabled: true }],
            NegBranchNumber: [{ value: '', disabled: true }],
            BranchName: [{ value: '', disabled: true }],
            ContractAnnualValue: [{ value: '', disabled: true }],
            Future: [{ value: '', disabled: true }],
            ContractCommenceDate: [{ value: '', disabled: true }, Validators.required],
            Status: [{ value: '', disabled: true }],
            InactiveEffectDate: [{ value: '', disabled: true }],
            AnyPendingBelow: [{ value: '', disabled: true }],
            LostBusinessDesc: [{ value: '', disabled: true }],
            LostBusinessDesc2: [{ value: '', disabled: true }],
            LostBusinessDesc3: [{ value: '', disabled: true }],
            TrialPeriodInd: [{ value: '', disabled: true }],
            AccountNumber: [{ value: '', disabled: true }],
            AccountName: [{ value: '', disabled: true }],
            MoreThanOneContract: [{ value: '', disabled: true }],
            BadDebtAccount: [{ value: '', disabled: true }],
            GroupAccountNumber: [{ value: '', disabled: true }],
            GroupName: [{ value: '', disabled: true }],
            AccountBalance: [{ value: '', disabled: true }],
            ShowValueButton: [{ value: '', disabled: true }],
            NationalAccount: [{ value: '', disabled: true }],
            IsNationalAccount: [{ value: '', disabled: true }],
            NationalAccountchecked: [{ value: '', disabled: true }],
            DisableList: [{ value: '', disabled: true }],
            MandateRequired: [{ value: '', disabled: true }],
            ReqAutoNumber: [{ value: '', disabled: true }],
            PaymentTypeWarning: [{ value: '', disabled: true }],
            ProspectNumber: [{ value: '', disabled: true }],
            ErrorMessageDesc: [{ value: '', disabled: true }],
            CustomerInfoAvailable: [{ value: '', disabled: true }],
            ContractHasExpired: [{ value: '', disabled: true }],
            RunningReadOnly: [{ value: '', disabled: true }],
            CallLogID: [{ value: '', disabled: true }],
            CurrentCallLogID: [{ value: '', disabled: true }],
            WindowClosingName: [{ value: '', disabled: true }],
            ClosedWithChanges: [{ value: '', disabled: true }],
            PNOL: [{ value: '', disabled: true }],
            CICustRefReq: [{ value: '', disabled: true }],
            CIRWOReq: [{ value: '', disabled: true }],
            CICFWOReq: [{ value: '', disabled: true }],
            CICFWOSep: [{ value: '', disabled: true }],
            OrigCICustRefReq: [{ value: '', disabled: true }],
            OrigCIRWOReq: [{ value: '', disabled: true }],
            OrigCICFWOReq: [{ value: '', disabled: true }],
            OrigCICFWOSep: [{ value: '', disabled: true }],
            OrigCICResponseSLA: [{ value: '', disabled: true }],
            OrigCIFirstSLAEscDays: [{ value: '', disabled: true }],
            OrigCISubSLAEscDays: [{ value: '', disabled: true }]
        });
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            _this.storeData = data;
            if (data && data['action']) {
                switch (data['action']) {
                    case ContractActionTypes.SAVE_DATA:
                        if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                            _this.contractStoreData = data['data'];
                            _this.setFormData(data);
                        }
                        break;
                    case ContractActionTypes.SAVE_ACCOUNT:
                        if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                            _this.contractStoreData = data['data'];
                            _this.setFormData(data);
                        }
                        break;
                    case ContractActionTypes.SAVE_MODE:
                        if (data['mode'] && !(Object.keys(data['mode']).length === 0 && data['mode'].constructor === Object)) {
                            _this.addMode = data['mode'].addMode;
                            _this.updateMode = data['mode'].updateMode;
                            _this.searchMode = data['mode'].searchMode;
                            _this.processForm();
                        }
                        break;
                    case ContractActionTypes.SAVE_SYSCHAR:
                        if (data['syschars']) {
                            _this.sysCharParams = data['syschars'];
                            _this.processSysChar();
                        }
                        break;
                    case ContractActionTypes.INITIALIZATION:
                        if (data && data['initialization']) {
                            if (!data['initialization'].initialLoadComplete && data['initialization'].typeA && data['initialization'].typeB && data['initialization'].typeC) {
                                setTimeout(function () {
                                    _this.postInitialization();
                                }, 0);
                                setTimeout(function () {
                                    _this.store.dispatch({
                                        type: ContractActionTypes.INITIALIZATION, payload: {
                                            initialLoadComplete: true
                                        }
                                    });
                                }, 100);
                            }
                        }
                        break;
                    case ContractActionTypes.FORM_VALIDITY:
                        if (data && data['formValidity']) {
                            _this.tabsError = {
                                tabA: !data['formValidity'].typeA,
                                tabB: !data['formValidity'].typeB,
                                tabC: !data['formValidity'].typeC,
                                tabD: !data['formValidity'].typeD,
                                tabE: !data['formValidity'].typeE
                            };
                            _this.formValidityCounter++;
                            if (_this.tabsToCheck['typeD'] === true && _this.tabsToCheck['typeE'] === true) {
                                if (_this.formValidityCounter >= 6 && data['formValidity'].main && data['formValidity'].typeA && data['formValidity'].typeB && data['formValidity'].typeC && data['formValidity'].typeD && data['formValidity'].typeE) {
                                    _this.formValidityCounter = 0;
                                    if (_this.updateMode) {
                                        _this.riMaintenanceBeforeSaveUpdate();
                                    }
                                    else if (_this.addMode) {
                                        _this.riMaintenanceBeforeSaveAdd();
                                    }
                                }
                                else {
                                    window.scrollTo(0, 0);
                                }
                            }
                            else if (_this.tabsToCheck['typeD'] === true && _this.tabsToCheck['typeE'] === false) {
                                if (_this.formValidityCounter >= 5 && data['formValidity'].main && data['formValidity'].typeA && data['formValidity'].typeB && data['formValidity'].typeC && data['formValidity'].typeD) {
                                    _this.formValidityCounter = 0;
                                    if (_this.updateMode) {
                                        _this.riMaintenanceBeforeSaveUpdate();
                                    }
                                    else if (_this.addMode) {
                                        _this.riMaintenanceBeforeSaveAdd();
                                    }
                                }
                                else {
                                    window.scrollTo(0, 0);
                                }
                            }
                            else if (_this.tabsToCheck['typeD'] === false && _this.tabsToCheck['typeE'] === true) {
                                _this.tabsError['typeD'] = _this.tabsError['typeE'];
                                if (_this.formValidityCounter >= 5 && data['formValidity'].main && data['formValidity'].typeA && data['formValidity'].typeB && data['formValidity'].typeC && data['formValidity'].typeE) {
                                    _this.formValidityCounter = 0;
                                    if (_this.updateMode) {
                                        _this.riMaintenanceBeforeSaveUpdate();
                                    }
                                    else if (_this.addMode) {
                                        _this.riMaintenanceBeforeSaveAdd();
                                    }
                                }
                                else {
                                    window.scrollTo(0, 0);
                                }
                            }
                            else {
                                if (_this.formValidityCounter >= 4 && data['formValidity'].main && data['formValidity'].typeA && data['formValidity'].typeB && data['formValidity'].typeC) {
                                    _this.formValidityCounter = 0;
                                    if (_this.updateMode) {
                                        _this.riMaintenanceBeforeSaveUpdate();
                                    }
                                    else if (_this.addMode) {
                                        _this.riMaintenanceBeforeSaveAdd();
                                    }
                                }
                                else {
                                    window.scrollTo(0, 0);
                                }
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        });
        this.routerSubscription = this.router.events.subscribe(function (event) {
            _this.store.dispatch({
                type: ContractActionTypes.INITIALIZATION, payload: {
                    initialLoadComplete: false,
                    typeA: false,
                    typeB: false,
                    typeC: false
                }
            });
            _this.currentRouteUrl = event.url;
            _this.setContractType(event.url);
        });
        this.querySubscription = this.route.queryParams.subscribe(function (params) {
            _this.currentRouteParams = params;
            if (_this.currentRouteParams.CurrentContractType || _this.currentRouteParams.currentContractType) {
                switch (_this.currentRouteParams.CurrentContractType || _this.currentRouteParams.currentContractType) {
                    case 'C':
                        _this.setPageParams('C');
                        break;
                    case 'P':
                        _this.setPageParams('P');
                        break;
                    case 'J':
                        _this.setPageParams('J');
                        break;
                }
            }
            else {
                if (_this.currentRouteParams['CurrentContractTypeURLParameter']) {
                    _this.setPageParams(_this.utils.getCurrentContractType(_this.currentRouteParams['CurrentContractTypeURLParameter']));
                }
            }
        });
        this.querySubscription = this.route.queryParams.subscribe(function (params) {
            _this.currentRouteParams = params;
            if (_this.currentRouteParams.CurrentContractType || _this.currentRouteParams.currentContractType) {
                switch (_this.currentRouteParams.CurrentContractType || _this.currentRouteParams.currentContractType) {
                    case 'C':
                        _this.setPageParams('C');
                        break;
                    case 'P':
                        _this.setPageParams('P');
                        break;
                    case 'J':
                        _this.setPageParams('J');
                        break;
                }
            }
            else {
                if (_this.currentRouteParams['CurrentContractTypeURLParameter']) {
                    _this.setPageParams(_this.utils.getCurrentContractType(_this.currentRouteParams['CurrentContractTypeURLParameter']));
                }
            }
        });
    }
    ContractMaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.localeTranslateService.setUpTranslation();
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                setTimeout(function () {
                    _this.fetchTranslationContent();
                }, 0);
            }
        });
    };
    ContractMaintenanceComponent.prototype.ngAfterViewInit = function () {
        this.setTabAttribute();
    };
    ContractMaintenanceComponent.prototype.ngOnDestroy = function () {
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
        if (this.sysCharObservable)
            this.sysCharObservable.unsubscribe();
        this.routeAwayGlobals.resetRouteAwayFlags();
    };
    ContractMaintenanceComponent.prototype.setContractType = function (val, onlyContractType) {
        switch (val) {
            case '/contractmanagement/maintenance/contract':
                if (!(this.storeData && this.storeData['data'] && !(Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object))) {
                    this.autoOpenSearch = true;
                }
                this.setPageParams('C', onlyContractType);
                break;
            case '/contractmanagement/maintenance/product':
                if (!(this.storeData && this.storeData['data'] && !(Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object))) {
                    this.autoOpenSearch = true;
                }
                this.setPageParams('P', onlyContractType);
                break;
            case '/contractmanagement/maintenance/job':
                if (!(this.storeData && this.storeData['data'] && !(Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object))) {
                    this.autoOpenSearch = true;
                }
                this.setPageParams('J', onlyContractType);
                break;
            default:
                if (val.indexOf('/maintenance/contract') !== -1) {
                    this.setPageParams('C', onlyContractType);
                }
                else if (val.indexOf('/maintenance/job') !== -1) {
                    this.setPageParams('J', onlyContractType);
                }
                else if (val.indexOf('/maintenance/product') !== -1) {
                    this.setPageParams('P', onlyContractType);
                }
                break;
        }
    };
    ContractMaintenanceComponent.prototype.postInitialization = function () {
        var _this = this;
        this.querySubscription = this.route.queryParams.subscribe(function (params) {
            _this.currentRouteParams = params;
            switch (params['parentMode']) {
                case 'AddContractFromAccount':
                    _this.inputParams.currentContractType = 'C';
                    _this.inputParams.currentContractTypeURLParameter = '<contract>';
                    break;
                case 'AddJobFromAccount':
                    _this.inputParams.currentContractType = 'J';
                    _this.inputParams.currentContractTypeURLParameter = '<job>';
                    break;
                case 'AddProductFromAccount':
                    _this.inputParams.currentContractType = 'P';
                    _this.inputParams.currentContractTypeURLParameter = '<product>';
                    break;
                case 'PipelineGrid':
                    _this.inputParams.parentMode = 'PipelineGrid';
                    break;
                case 'ProspectPremises':
                    _this.inputParams.parentMode = 'ProspectPremises';
                    break;
                default:
            }
            switch (_this.inputParams.currentContractType) {
                case 'C':
                    _this.inputParams.pageTitle = 'Contract Entry';
                    _this.inputParams.pageHeader = 'Contract Maintenance';
                    break;
                case 'P':
                    _this.inputParams.pageTitle = 'Product Sale Entry';
                    _this.inputParams.pageHeader = 'Product Sale Maintenance';
                    break;
                case 'J':
                    _this.inputParams.pageTitle = 'Job Entry';
                    _this.inputParams.pageHeader = 'Job Maintenance';
                    break;
            }
            for (var x in params) {
                if (params.hasOwnProperty(x))
                    _this.storeData['sentFromParent'][x] = params[x];
            }
            _this.store.dispatch({ type: ContractActionTypes.SAVE_PARAMS, payload: _this.inputParams });
        });
        String.prototype['capitalizeFirstLetter'] = function () {
            return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1); });
        };
        this.displayList.anyPendingBelow = false;
        this.displayList.lostBusinessDesc1 = false;
        this.displayList.lostBusinessDesc2 = false;
        this.displayList.lostBusinessDesc3 = false;
        this.displayList.anyPendingBelow = false;
        this.displayList.moreThanOneContract = false;
        this.displayList.inactiveEffectDate = false;
        this.displayList.customerInformation = false;
        this.displayList.trialPeriodInd = false;
        this.displayList.contractAnnualValue = false;
        this.displayList.future = false;
        this.defaultCode = {
            country: this.utils.getCountryCode(),
            business: this.utils.getBusinessCode()
        };
        this.storeData['code'].country = this.utils.getCountryCode();
        this.storeData['code'].business = this.utils.getBusinessCode();
        this.promptConfirmTitle = MessageConstant.Message.ConfirmRecord;
        this.store.dispatch({
            type: ContractActionTypes.FORM_GROUP, payload: {
                main: this.contractFormGroup
            }
        });
        this.contractSearchComponent = ContractSearchComponent;
        this.accountSearchComponent = AccountSearchComponent;
        this.titleService.setTitle(this.inputParams.pageTitle);
        this.displayListClone = JSON.parse(JSON.stringify(this.displayList));
        if (this.storeData && this.storeData['data'] && !(Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object)) {
            if (this.storeData['sentFromParent'] && this.storeData['sentFromParent']['isChild'] === true) {
                this.checkParentModeFromData(this.storeData);
            }
            else {
                this.contractStoreData = this.storeData['data'];
                this.setFormData(this.storeData);
                this.searchMode = false;
                this.updateMode = true;
                this.addMode = false;
                this.autoOpen = false;
                this.onContractNumberBlur({}, {
                    addMode: this.addMode,
                    updateMode: this.updateMode,
                    searchMode: this.searchMode
                });
            }
        }
        else {
            this.checkParentModeFromData(this.storeData);
        }
        if ((this.autoOpen === true)) {
            this.autoOpenSearch = true;
        }
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    if (data.errorMessage || data.fullError) {
                        if (data.fullError) {
                            if (data.errorMessage instanceof Array) {
                                data.errorMessage.push(data.fullError);
                            }
                            else {
                                if (data.errorMessage === '') {
                                    data.errorMessage = data.errorMessage + ' ' + data.fullError;
                                }
                            }
                        }
                        _this.errorModal.show(data, true);
                    }
                    else {
                        _this.errorModal.show(data, false);
                    }
                });
            }
        });
        this.messageService.emitMessage(0);
        this.messageSubscription = this.messageService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                if (data && data.addMode) {
                    if (_this.updateMode === true) {
                        _this.store.dispatch({
                            type: ContractActionTypes.SAVE_MODE, payload: {
                                updateMode: false,
                                addMode: false,
                                searchMode: true
                            }
                        });
                        _this.processForm();
                    }
                    _this.store.dispatch({
                        type: ContractActionTypes.CLEAR_DATA, payload: {}
                    });
                    _this.tabsError = {
                        tabA: false,
                        tabB: false,
                        tabC: false,
                        tabD: false,
                        tabE: false
                    };
                    _this.setDefaultFormState();
                    _this.contractStoreData = null;
                    _this.triggerFetchSysChar(data, false);
                }
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.SAVE_SERVICE, payload: {
                localeTranslateService: this.localeTranslateService,
                translate: this.translate,
                errorService: this.errorService
            }
        });
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
    };
    ContractMaintenanceComponent.prototype.setPageParams = function (type, onlyContractType) {
        switch (type) {
            case 'C':
                if (onlyContractType === true) {
                    this.inputParams.currentContractType = 'C';
                    this.inputParams.currentContractTypeURLParameter = 'contract';
                    this.contractSearchParams.currentContractType = 'C';
                    return;
                }
                this.inputParams.parentMode = 'Contract';
                this.inputParams.pageTitle = 'Contract Entry';
                this.inputParams.pageHeader = 'Contract Maintenance';
                this.labelFields['contractNumber'] = 'Contract Number';
                this.inputParams.currentContractType = 'C';
                this.inputParams.currentContractTypeURLParameter = 'contract';
                this.contractSearchParams.currentContractType = 'C';
                break;
            case 'J':
                if (onlyContractType === true) {
                    this.inputParams.currentContractType = 'J';
                    this.inputParams.currentContractTypeURLParameter = 'job';
                    this.contractSearchParams.currentContractType = 'J';
                    return;
                }
                this.inputParams.parentMode = 'Job';
                this.inputParams.pageTitle = 'Job Entry';
                this.inputParams.pageHeader = 'Job Maintenance';
                this.labelFields['contractNumber'] = 'Job Number';
                this.inputParams.currentContractType = 'J';
                this.inputParams.currentContractTypeURLParameter = 'job';
                this.contractSearchParams.currentContractType = 'J';
                break;
            case 'P':
                if (onlyContractType === true) {
                    this.inputParams.currentContractType = 'P';
                    this.inputParams.currentContractTypeURLParameter = 'product';
                    this.contractSearchParams.currentContractType = 'P';
                    return;
                }
                this.inputParams.parentMode = 'Product';
                this.inputParams.pageTitle = 'Product Sale Entry';
                this.inputParams.pageHeader = 'Product Sale Maintenance';
                this.labelFields['contractNumber'] = 'Product Sale Number';
                this.inputParams.currentContractType = 'P';
                this.inputParams.currentContractTypeURLParameter = 'product';
                this.contractSearchParams.currentContractType = 'P';
                break;
            default:
                break;
        }
    };
    ContractMaintenanceComponent.prototype.checkParentModeFromData = function (data) {
        if (data['sentFromParent']) {
            if (data['sentFromParent'].parentMode) {
                this.isChild = true;
                data['sentFromParent']['isChild'] = true;
            }
            else {
                this.isChild = false;
                data['sentFromParent']['isChild'] = false;
            }
            this.store.dispatch({ type: ContractActionTypes.SAVE_SENT_FROM_PARENT, payload: data['sentFromParent'] });
            switch (data && data['sentFromParent'].parentMode) {
                case 'Search':
                case 'SearchAdd':
                case 'Account':
                case 'AddContractFromAccount':
                case 'AddJobFromAccount':
                case 'AddProductFromAccount':
                case 'AddFromProspect':
                    this.triggerAddModeFromAccount();
                    break;
                case 'ServiceCover':
                    this.triggerUpdateMode();
                    break;
                case 'Premise':
                    this.triggerUpdateMode();
                    break;
                case 'ServiceVisitWorkIndex':
                    this.triggerSearchMode();
                    break;
                case 'ProspectPremises':
                    this.triggerSearchMode();
                    break;
                case 'LostBusinessRequestsOutcomeBusiness':
                    this.triggerSearchMode();
                    break;
                case 'Portfolio General Maintenance':
                case 'pgm':
                    this.triggerSearchMode();
                    break;
                case 'LoadByKeyFields':
                    this.triggerUpdateMode();
                    break;
                case 'Request':
                    this.triggerSearchMode();
                    this.showControlBtn = false;
                    this.autoOpen = false;
                    break;
                default:
            }
            switch (data['sentFromParent'].parentMode) {
                case 'ContractExpiryGrid':
                case 'Portfolio':
                case 'DailyTransactions':
                case 'ContractPOExpiryGrid':
                case 'PDAReconciliation':
                case 'RepeatSales':
                    this.triggerSearchMode();
                    break;
                case 'Release':
                case 'ProRataCharge':
                case 'ServiceVisitEntryGrid':
                case 'FlatRateIncrease':
                case 'ServiceValueEntryGrid':
                case 'Accept':
                case 'PremiseMatch':
                    this.triggerUpdateMode();
                    break;
                case 'SalesCallExtractDetail':
                    break;
                case 'RenewalExtractContract':
                case 'CancelledVisit':
                case 'VisitRejection':
                case 'TechServiceVisit':
                case 'SuspendServiceandInvoice':
                case 'DOWSentricon':
                    break;
                case 'Bonus':
                    break;
                case 'LostBusinessAnalysis':
                case 'InvoiceReleased':
                case 'StaticVisit':
                case 'PortfolioReports':
                case 'ServiceVisitWorkIndex':
                case 'Inter-CompanyPortfolio':
                case 'RetainedServiceCovers':
                case 'TechWorkSummary':
                case 'ClientRetention':
                case 'ComReqPlan':
                case 'CustomerCCOReport':
                    this.triggerUpdateMode();
                    break;
                case 'Entitlement':
                    break;
                case 'ServicePlanning':
                case 'ExchangesDue':
                case 'InstallationsCommence':
                case 'TimeVerification':
                    this.triggerUpdateMode();
                    break;
                case 'InvoiceDetail':
                    this.triggerUpdateMode();
                    break;
                case 'ContactMedium':
                    this.triggerUpdateMode();
                    break;
                case 'DespatchGrid':
                    break;
                case 'ScheduleSearch':
                    break;
                default:
            }
            switch (data['sentFromParent'].parentMode) {
                case 'ContractExpiryGrid':
                case 'DailyTransactions':
                case 'BusinessDailyTransactions':
                case 'ContractPOExpiryGrid':
                    this.showControlBtn = false;
                    this.inputParams.showAddNew = false;
                    this.autoOpen = false;
                    break;
                case 'AddFromProspect':
                    break;
                case 'AddContractFromAccount':
                case 'AddJobFromAccount':
                case 'AddProductFromAccount':
                    break;
                case 'Prospect':
                    this.triggerSearchMode();
                    break;
                case 'PipelineGrid':
                    this.triggerSearchMode();
                    break;
                case 'ProspectPremises':
                    this.showControlBtn = false;
                    this.inputParams.showAddNew = false;
                    break;
                case 'CallCentreSearch':
                    this.triggerUpdateMode();
                    break;
                case 'GeneralSearch':
                case 'GeneralSearch-Con':
                    this.triggerUpdateMode();
                    break;
                case 'GeneralSearchProduct':
                    this.triggerUpdateMode();
                    break;
                case 'StockUsageSearch':
                case 'TreatmentcardRecall':
                    this.triggerUpdateMode();
                    break;
                case 'NatAccContracts':
                    this.triggerUpdateMode();
                    break;
                case 'InvoiceHistory':
                    this.triggerUpdateMode();
            }
            if (this.autoOpen === '') {
                this.autoOpen = true;
            }
        }
    };
    ContractMaintenanceComponent.prototype.triggerSearchMode = function () {
        this.contractFormGroup.controls['ContractNumber'].setValue(this.storeData['sentFromParent'].ContractNumber);
        this.contractFormGroup.controls['ContractNumber'].disable();
        this.isContractEllipsisDisabled = true;
        this.autoOpen = false;
        this.onContractNumberBlur({}, {
            addMode: false,
            updateMode: false,
            searchMode: true
        });
    };
    ContractMaintenanceComponent.prototype.triggerUpdateMode = function () {
        this.contractFormGroup.controls['ContractNumber'].setValue(this.storeData['sentFromParent'].ContractNumber);
        this.isContractEllipsisDisabled = false;
        this.autoOpen = false;
        this.onContractNumberBlur({}, {
            addMode: false,
            updateMode: true,
            searchMode: false
        });
    };
    ContractMaintenanceComponent.prototype.triggerAddModeFromAccount = function () {
        var _this = this;
        this.isContractEllipsisDisabled = true;
        this.autoOpen = false;
        this.triggerFetchSysChar({
            updateMode: false,
            addMode: true,
            searchMode: false
        }, false, function () {
            _this.contractFormGroup.controls['AccountNumber'].setValue(_this.storeData['sentFromParent'].AccountNumber || _this.storeData['sentFromParent'].accountNumber);
            _this.onAccountBlur({});
        });
    };
    ContractMaintenanceComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        Observable.forkJoin(this.getTranslatedValue('Copy', null), this.getTranslatedValue('Future Change', null), this.getTranslatedValue(this.inputParams.pageTitle.toString(), null), this.getTranslatedValue(this.inputParams.pageHeader, null), this.getTranslatedValue(this.labelFields['lostBusinessDesc1'], null), this.getTranslatedValue(this.labelFields['lostBusinessDesc2'], null), this.getTranslatedValue(this.labelFields['lostBusinessDesc3'], null), this.getTranslatedValue('Contact Details', null)).subscribe(function (data) {
            if (data[0]) {
                _this.contractFormGroup.controls['Copy'].setValue(data[0]);
            }
            if (data[1]) {
                _this.contractFormGroup.controls['Future'].setValue(data[1]);
            }
            if (data[2]) {
                _this.titleService.setTitle(data[2].toString());
            }
            else {
                _this.titleService.setTitle(_this.inputParams.pageTitle.toString());
            }
            if (data[3]) {
                _this.inputParams.pageHeader = data[3];
            }
            if (data[4]) {
                _this.labelFields['lostBusinessDesc1'] = data[4];
            }
            if (data[5]) {
                _this.labelFields['lostBusinessDesc2'] = data[5];
            }
            if (data[6]) {
                _this.labelFields['lostBusinessDesc3'] = data[6];
            }
            if (data[7]) {
                if (_this.storeData['formGroup'].typeA) {
                    _this.storeData['formGroup'].typeA.controls['BtnAmendContact'].setValue(data[7]);
                }
            }
        });
    };
    ContractMaintenanceComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    ContractMaintenanceComponent.prototype.fetchBranchDetails = function (addMode, returnSubscription) {
        var _this = this;
        this.queryParams.branchNumber = this.cbb.getBranchCode();
        this.otherParams['currentBranchNumber'] = this.cbb.getBranchCode();
        var userCode = this.authService.getSavedUserCode();
        var data = [{
                'table': 'Branch',
                'query': { 'BusinessCode': this.storeData['code'].business },
                'fields': ['BranchNumber', 'BranchName', 'EnablePostCodeDefaulting']
            },
            {
                'table': 'UserAuthorityBranch',
                'query': { 'UserCode': userCode.UserCode, 'BusinessCode': this.storeData['code'].business },
                'fields': ['BranchNumber', 'DefaultBranchInd', 'CurrentBranchInd']
            }];
        if (returnSubscription) {
            return this.lookUpRecord(data, 100);
        }
        this.lookUpRecord(data, 100).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][1].length > 0) {
                    if (!_this.queryParams.branchNumber) {
                        for (var i = 0; i < e['results'][1].length; i++) {
                            if (e['results'][1][i].DefaultBranchInd) {
                                _this.queryParams.branchNumber = e['results'][1][i].BranchNumber;
                                _this.otherParams['currentBranchNumber'] = e['results'][1][i].BranchNumber;
                            }
                        }
                    }
                    if (e['results'][0].length > 0) {
                        for (var k = 0; k < e['results'][0].length; k++) {
                            _this.branchList.push(JSON.parse(JSON.stringify({
                                branchNumber: e['results'][0][k].BranchNumber,
                                branchName: e['results'][0][k].BranchName
                            })));
                            if (!e['results'][0][k].EnablePostCodeDefaulting) {
                                _this.sysCharParams['vExcludedBranches'].push(e['results'][0][k].BranchNumber);
                            }
                            if (e['results'][0][k].BranchNumber === _this.queryParams.branchNumber) {
                                _this.queryParams.branchName = e['results'][0][k].BranchName;
                            }
                        }
                    }
                    if (addMode) {
                        _this.contractFormGroup.controls['NegBranchNumber'].setValue(_this.queryParams.branchNumber);
                        _this.contractFormGroup.controls['BranchName'].setValue(_this.queryParams.branchName);
                        _this.negBranchNumberSelected = {
                            id: '',
                            text: _this.queryParams.branchNumber + ' - ' + _this.queryParams.branchName
                        };
                    }
                }
            }
        }, function (error) {
        });
    };
    ContractMaintenanceComponent.prototype.fetchCompanyDetails = function (addMode) {
        var userCode = this.authService.getSavedUserCode();
        var data = [{
                'table': 'Company',
                'query': { 'BusinessCode': this.storeData['code'].business, 'UserCode': userCode.UserCode },
                'fields': ['DefaultCompanyInd', 'CompanyCode', 'CompanyDesc']
            }];
        return this.lookUpRecord(data, 5);
    };
    ContractMaintenanceComponent.prototype.fetchUserAuthority = function () {
        var _this = this;
        var userCode = this.authService.getSavedUserCode();
        var data = [{
                'table': 'UserAuthority',
                'query': { 'BusinessCode': this.storeData['code'].business, 'UserCode': userCode.UserCode },
                'fields': ['BusinessCode', 'AllowViewOfSensitiveInfoInd', 'UserCode', 'AllowUpdateOfContractInfoInd']
            }];
        this.lookUpRecord(data, 5).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    _this.sysCharParams['glAllowUserAuthView'] = e['results'][0][0].AllowViewOfSensitiveInfoInd;
                    _this.sysCharParams['glAllowUserAuthUpdate'] = e['results'][0][0].AllowUpdateOfContractInfoInd;
                    if (!_this.sysCharParams['glAllowUserAuthUpdate']) {
                        _this.displayList.options = false;
                        _this.displayList.contractAnnualValue = false;
                    }
                }
            }
        }, function (error) {
        });
    };
    ContractMaintenanceComponent.prototype.fetchCIParams = function () {
        var _this = this;
        var data = [{
                'table': 'CIParams',
                'query': { 'BusinessCode': this.storeData['code'].business },
                'fields': ['BusinessCode', 'CIEnabled']
            }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 5).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    var tabs_1, componentList_1;
                    tabs_1 = [
                        { title: 'Address', active: true },
                        { title: 'Invoice', disabled: false },
                        { title: 'General', removable: false }
                    ];
                    componentList_1 = [MaintenanceTypeAComponent, MaintenanceTypeBComponent, MaintenanceTypeCComponent];
                    _this.otherParams['blnCIEnabled'] = e['results'][0][0].CIEnabled;
                    if (_this.sysCharParams['vSCAccountDiscounts'] === true) {
                        tabs_1.push({ title: 'Discounts', customClass: '' });
                        componentList_1.push(MaintenanceTypeDComponent);
                    }
                    if (_this.otherParams['blnCIEnabled'] === true) {
                        tabs_1.push({ title: 'Customer Integration', customClass: '' });
                        componentList_1.push(MaintenanceTypeEComponent);
                    }
                    _this.tabsHide = true;
                    setTimeout(function () {
                        _this.tabsHide = false;
                    }, 400);
                    if (tabs_1.length !== _this.tabs.length || (tabs_1.length === _this.tabs.length && tabs_1.length === 4 && tabs_1[3].title !== _this.tabs[3].title)) {
                        _this.zone.run(function () {
                            _this.tabs = tabs_1;
                            _this.componentList = componentList_1;
                        });
                    }
                }
            }
        }, function (error) {
        });
    };
    ContractMaintenanceComponent.prototype.sysCharParameters = function () {
        var sysCharList = [
            this.SysCharConstants.SystemCharMaximumAddressLength,
            this.SysCharConstants.SystemCharEnableAutoGenerationOfContractNumbers,
            this.SysCharConstants.SystemCharEnableNationalAccountWarning,
            this.SysCharConstants.SystemCharEnableAddressLine3,
            this.SysCharConstants.SystemCharEnableInvoiceFee,
            this.SysCharConstants.SystemCharEnableDefaultOfJobExpiry,
            this.SysCharConstants.SystemCharEnableMinimumDuration,
            this.SysCharConstants.SystemCharEnableCompanyCode,
            this.SysCharConstants.SystemCharEnableMarktSelect,
            this.SysCharConstants.SystemCharEnableHopewiserPAF,
            this.SysCharConstants.SystemCharEnableDatabasePAF,
            this.SysCharConstants.SystemCharAddressLine4Required,
            this.SysCharConstants.SystemCharAddressLine5Required,
            this.SysCharConstants.SystemCharPostCodeRequired,
            this.SysCharConstants.SystemCharPostCodeMustExistinPAF,
            this.SysCharConstants.SystemCharEnablePostcodeDefaulting,
            this.SysCharConstants.SystemCharRunPAFSearchOnFirstAddressLine,
            this.SysCharConstants.SystemCharEnableLtdCompanyAndRegistrationNumber,
            this.SysCharConstants.SystemCharMandatoryTaxRegistrationNumber,
            this.SysCharConstants.SystemCharEnableAccountDiscounts,
            this.SysCharConstants.SystemCharDaysFromRequestToTermOrDel,
            this.SysCharConstants.SystemCharEnableExternalReferenceInContractMaint,
            this.SysCharConstants.SystemCharEnableBankDetailEntry,
            this.SysCharConstants.SystemCharSubsequentDurationPeriod,
            this.SysCharConstants.SystemCharAutoCreateProspectRenewalDays,
            this.SysCharConstants.SystemCharEnableContractTaxRegistrationNumber2,
            this.SysCharConstants.SystemCharDefaultTaxCodeOnServiceCoverMaint,
            this.SysCharConstants.SystemCharEnableMinimumDuration,
            this.SysCharConstants.SystemCharEnableTrialPeriodServices,
            this.SysCharConstants.SystemCharEnableGPSCoordinates,
            this.SysCharConstants.SystemCharHidePostcode,
            this.SysCharConstants.SystemCharEnableHazardousPesticideLevy,
            this.SysCharConstants.SystemCharContractOwner,
            this.SysCharConstants.SystemCharDisplayContractPaymentDueDay,
            this.SysCharConstants.SystemCharEnableSEPAFinanceMandate,
            this.SysCharConstants.SystemCharDisableDefaultCountryCode,
            this.SysCharConstants.SystemCharHideBankDetailsTab,
            this.SysCharConstants.SystemCharEnableGroupAccounts,
            this.SysCharConstants.SystemCharUseVisitTolerances,
            this.SysCharConstants.SystemCharUseInfestationTolerances,
            this.SysCharConstants.SystemCharDisableFirstCapitalOnAddressContact,
            this.SysCharConstants.SystemCharConnectContractPostcodeNegEmployee,
            this.SysCharConstants.SystemCharEnablePayTypeAtInvoiceGroupLevel,
            this.SysCharConstants.SystemCharEnableValidatePostcodeSuburb,
            this.SysCharConstants.SystemCharShowWasteConsignmentNoteHistory,
            this.SysCharConstants.SystemCharEnableRecordingOfRenewalSalesStats
        ];
        return sysCharList.join(',');
    };
    ContractMaintenanceComponent.prototype.triggerFetchSysChar = function (saveModeData, returnSubscription, callback) {
        var _this = this;
        var sysCharNumbers = this.sysCharParameters();
        if (returnSubscription) {
            return this.fetchSysChar(sysCharNumbers);
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchSysChar(sysCharNumbers).subscribe(function (e) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (e.errorMessage) {
                _this.errorService.emitError({
                    errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
                });
                return false;
            }
            if (e.records && e.records.length > 0) {
                _this.onSysCharDataReceive(e);
                var data = [{
                        'table': 'riRegistry',
                        'query': { 'RegSection': 'Contact Person' },
                        'fields': ['RegSection']
                    },
                    {
                        'table': 'riRegistry',
                        'query': { 'RegSection': 'Contact Centre Review', 'RegKey': _this.storeData['code'].business + '_' + 'System Default Review From Drill Option' },
                        'fields': ['RegSection', 'RegValue']
                    },
                    {
                        'table': 'CIParams',
                        'query': { 'BusinessCode': _this.storeData['code'].business },
                        'fields': ['BusinessCode', 'CIEnabled']
                    }];
                _this.ajaxSource.next(_this.ajaxconstant.START);
                Observable.forkJoin(_this.lookUpRecord(data, 5)).subscribe(function (data) {
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    if (data[0]['results'] && data[0]['results'].length > 0) {
                        if (data[0]['results'][0].length > 0 && data[0]['results'][0][0]) {
                            _this.sysCharParams['vSCMultiContactInd'] = true;
                        }
                        else {
                            _this.sysCharParams['vSCMultiContactInd'] = false;
                        }
                        _this.buildMenuOptions();
                        if (data[0]['results'][1].length > 0 && data[0]['results'][1][0]) {
                            _this.sysCharParams['gcREGContactCentreReview'] = data[0]['results'][1][0].RegValue;
                            if (_this.sysCharParams['gcREGContactCentreReview'] === 'Y') {
                                _this.otherParams['lREGContactCentreReview'] = true;
                            }
                            else {
                                _this.otherParams['lREGContactCentreReview'] = false;
                            }
                        }
                        if (data[0]['results'][2].length > 0) {
                            var tabs_2, componentList_2;
                            tabs_2 = [
                                { title: 'Address', active: true },
                                { title: 'Invoice', disabled: false },
                                { title: 'General', removable: false }
                            ];
                            componentList_2 = [MaintenanceTypeAComponent, MaintenanceTypeBComponent, MaintenanceTypeCComponent];
                            _this.otherParams['blnCIEnabled'] = data[0]['results'][2][0].CIEnabled;
                            if (_this.sysCharParams['vSCAccountDiscounts']) {
                                tabs_2.push({ title: 'Discounts', customClass: '' });
                                componentList_2.push(MaintenanceTypeDComponent);
                                _this.tabsToCheck['typeD'] = true;
                            }
                            else {
                                _this.tabsToCheck['typeD'] = false;
                            }
                            if (_this.otherParams['blnCIEnabled']) {
                                tabs_2.push({ title: 'Customer Integration', customClass: '' });
                                componentList_2.push(MaintenanceTypeEComponent);
                                _this.tabsToCheck['typeE'] = true;
                            }
                            else {
                                _this.tabsToCheck['typeE'] = false;
                            }
                            if (tabs_2.length !== _this.tabs.length || (tabs_2.length === _this.tabs.length && tabs_2.length === 4 && tabs_2[3].title !== _this.tabs[3].title)) {
                                _this.zone.run(function () {
                                    _this.tabs = tabs_2;
                                    _this.componentList = componentList_2;
                                });
                            }
                        }
                    }
                    else {
                        _this.sysCharParams['vSCMultiContactInd'] = false;
                    }
                    var userCode = _this.authService.getSavedUserCode();
                    _this.ajaxSource.next(_this.ajaxconstant.START);
                    Observable.forkJoin(_this.lookUpRecord([
                        {
                            'table': 'Company',
                            'query': { 'BusinessCode': _this.storeData['code'].business },
                            'fields': ['DefaultCompanyInd', 'CompanyCode', 'CompanyDesc']
                        },
                        {
                            'table': 'UserAuthority',
                            'query': { 'BusinessCode': _this.storeData['code'].business, 'UserCode': userCode.UserCode },
                            'fields': ['AllowViewOfSensitiveInfoInd', 'AllowUpdateOfContractInfoInd']
                        },
                        {
                            'table': 'Branch',
                            'query': { 'BusinessCode': _this.storeData['code'].business },
                            'fields': ['BranchNumber', 'BranchName', 'EnablePostCodeDefaulting']
                        },
                        {
                            'table': 'UserAuthorityBranch',
                            'query': { 'UserCode': userCode.UserCode, 'BusinessCode': _this.storeData['code'].business },
                            'fields': ['BranchNumber', 'DefaultBranchInd', 'CurrentBranchInd']
                        }
                    ], 100), _this.fetchContractData('GetDefaultInvoiceFrequency,GetDefaultInvoiceFeeCode,GetDefaultPaymentType,GetPaymentTypeDetails', { action: '6' })).subscribe(function (data) {
                        _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                        if (data[0]['results'] && data[0]['results'].length > 0) {
                            if (data[0]['results'][0].length > 0) {
                                var defaultCompanyCode = '', defaultCompanyDesc = '', obj = {};
                                _this.otherParams['companyList'] = [];
                                _this.storeData.otherParams['companyList'] = [];
                                for (var i = 0; i < data[0]['results'][0].length; i++) {
                                    if (data[0]['results'][0][i].DefaultCompanyInd) {
                                        _this.sysCharParams['vDefaultCompanyCode'] = data[0]['results'][0][i].CompanyCode;
                                        _this.sysCharParams['vDefaultCompanyDesc'] = data[0]['results'][0][i].CompanyDesc;
                                        _this.otherParams['defaultCompanyCode'] = data[0]['results'][0][i].CompanyCode;
                                        _this.otherParams['defaultCompanyDesc'] = data[0]['results'][0][i].CompanyDesc;
                                    }
                                    obj = {
                                        code: data[0]['results'][0][i].CompanyCode,
                                        desc: data[0]['results'][0][i].CompanyDesc
                                    };
                                    _this.otherParams['companyList'].push(obj);
                                    _this.storeData.otherParams['companyList'].push(obj);
                                }
                            }
                            if (data[0]['results'][1].length > 0) {
                                _this.sysCharParams['glAllowUserAuthView'] = data[0]['results'][1][0].AllowViewOfSensitiveInfoInd;
                                _this.sysCharParams['glAllowUserAuthUpdate'] = data[0]['results'][1][0].AllowUpdateOfContractInfoInd;
                                if (!_this.sysCharParams['glAllowUserAuthUpdate']) {
                                    _this.displayList.options = false;
                                }
                                else {
                                    _this.displayList.options = true;
                                }
                                if (!_this.sysCharParams['glAllowUserAuthView']) {
                                    _this.displayList.contractAnnualValue = false;
                                }
                                else {
                                    _this.displayList.contractAnnualValue = true;
                                }
                            }
                        }
                        _this.queryParams.branchNumber = _this.cbb.getBranchCode();
                        _this.otherParams['currentBranchNumber'] = _this.cbb.getBranchCode();
                        if (data[0]['results'][3].length > 0) {
                            if (!_this.queryParams.branchNumber) {
                                for (var i = 0; i < data[0]['results'][3].length; i++) {
                                    if (data[0]['results'][3][i].DefaultBranchInd) {
                                        _this.queryParams.branchNumber = data[0]['results'][3][i].BranchNumber;
                                        _this.otherParams['currentBranchNumber'] = data[0]['results'][3][i].BranchNumber;
                                    }
                                }
                            }
                            if (data[0]['results'][2].length > 0) {
                                for (var k = 0; k < data[0]['results'][2].length; k++) {
                                    _this.branchList.push(JSON.parse(JSON.stringify({
                                        branchNumber: data[0]['results'][2][k].BranchNumber,
                                        branchName: data[0]['results'][2][k].BranchName
                                    })));
                                    if (!data[0]['results'][2][k].EnablePostCodeDefaulting) {
                                        _this.sysCharParams['vExcludedBranches'].push(data[0]['results'][2][k].BranchNumber);
                                    }
                                    if (data[0]['results'][2][k].BranchNumber === _this.queryParams.branchNumber) {
                                        _this.queryParams.branchName = data[0]['results'][2][k].BranchName;
                                    }
                                }
                            }
                            if (saveModeData) {
                                _this.contractFormGroup.controls['NegBranchNumber'].setValue(_this.queryParams.branchNumber);
                                _this.contractFormGroup.controls['BranchName'].setValue(_this.queryParams.branchName);
                                _this.negBranchNumberSelected = {
                                    id: '',
                                    text: _this.queryParams.branchNumber + ' - ' + _this.queryParams.branchName
                                };
                            }
                        }
                        if (saveModeData) {
                            if (data[1]['status'] === GlobalConstant.Configuration.Failure) {
                                _this.errorService.emitError(data[1]['oResponse']);
                            }
                            else {
                                _this.otherParams['InvoiceFeeCode'] = data[1]['InvoiceFeeCode'] ? data[1]['InvoiceFeeCode'] : '';
                                _this.otherParams['InvoiceFeeDesc'] = data[1]['InvoiceFeeDesc'] ? data[1]['InvoiceFeeDesc'] : '';
                                _this.otherParams['InvoiceFrequencyCode'] = data[1]['InvoiceFrequencyCode'] ? data[1]['InvoiceFrequencyCode'] : '';
                                _this.otherParams['InvoiceFrequencyDesc'] = data[1]['InvoiceFrequencyDesc'] ? data[1]['InvoiceFrequencyDesc'] : '';
                                _this.otherParams['PaymentDesc'] = data[1]['PaymentDesc'] ? data[1]['PaymentDesc'] : '';
                                _this.otherParams['PaymentTypeCode'] = data[1]['PaymentTypeCode'] ? data[1]['PaymentTypeCode'] : '';
                                _this.otherParams['MandateRequired'] = data[1]['MandateRequired'] ? data[1]['MandateRequired'] : '';
                            }
                            _this.sysCharParams['storage'] = _this.sysCharParams['storage'] || {};
                            _this.sysCharParams['storage'][_this.storeData['code'].country + _this.storeData['code'].business] = JSON.parse(JSON.stringify(_this.sysCharParams));
                            _this.store.dispatch({ type: ContractActionTypes.SAVE_SYSCHAR, payload: _this.sysCharParams });
                            _this.store.dispatch({ type: ContractActionTypes.SAVE_OTHER_PARAMS, payload: _this.otherParams });
                            setTimeout(function () {
                                document.getElementsByTagName('body')[0].classList.remove('modal-open');
                            }, 0);
                            setTimeout(function () {
                                _this.store.dispatch({
                                    type: ContractActionTypes.SAVE_MODE,
                                    payload: saveModeData
                                });
                                if (saveModeData && saveModeData.addMode === true)
                                    _this.riMaintenanceBeforeAdd();
                                if (callback) {
                                    callback();
                                }
                            }, 100);
                        }
                        else {
                            setTimeout(function () {
                                _this.sysCharParams['storage'] = _this.sysCharParams['storage'] || {};
                                _this.sysCharParams['storage'][_this.storeData['code'].country + _this.storeData['code'].business] = JSON.parse(JSON.stringify(_this.sysCharParams));
                                _this.store.dispatch({ type: ContractActionTypes.SAVE_SYSCHAR, payload: _this.sysCharParams });
                                _this.store.dispatch({ type: ContractActionTypes.SAVE_OTHER_PARAMS, payload: _this.otherParams });
                            }, 100);
                        }
                    }, function (error) {
                        _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                        _this.errorService.emitError({
                            errorMessage: error['errorMessage'] || ErrorConstant.Message.UnexpectedError,
                            fullError: error['fullError']
                        });
                        return;
                    });
                });
            }
            else {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.errorService.emitError({
                    errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
                });
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ContractMaintenanceComponent.prototype.onSysCharDataReceive = function (e) {
        var _this = this;
        if (e.records && e.records.length > 0) {
            if (typeof e.records[0].Required !== 'undefined') {
                this.sysCharParams['vSCEnableMaxAddress'] = e.records[0].Required;
                this.sysCharParams['vSCEnableMaxAddressValue'] = e.records[0].Integer;
                this.sysCharParams['vSCEnableAutoNumber'] = e.records[1].Required;
                this.sysCharParams['vSCNationalAccountChecked'] = e.records[2].Required;
                this.sysCharParams['vSCEnableAddressLine3'] = e.records[3].Required;
                this.sysCharParams['vSCAddressLine3Logical'] = e.records[3].Logical;
                this.sysCharParams['vSCEnableInvoiceFee'] = e.records[4].Required;
                this.sysCharParams['vSCEnableDefaultJobExpiry'] = e.records[5].Required;
                this.sysCharParams['vSCEnableMinimumDuration'] = e.records[6].Required;
                this.sysCharParams['vSCEnableCompanyCode'] = e.records[7].Required;
                this.sysCharParams['vSCEnableMarktSelect'] = e.records[8].Required;
                this.sysCharParams['vSCEnableHopewiserPAF'] = e.records[9].Required;
                this.sysCharParams['vSCEnableDatabasePAF'] = e.records[10].Required;
                this.sysCharParams['vSCAddressLine4Required'] = e.records[11].Required;
                this.sysCharParams['vSCAddressLine4Logical'] = e.records[11].Logical;
                this.sysCharParams['vSCAddressLine5Required'] = e.records[12].Required;
                this.sysCharParams['vSCAddressLine5Logical'] = e.records[12].Logical;
                this.sysCharParams['vSCPostCodeRequired'] = e.records[13].Required;
                this.sysCharParams['vSCPostCodeMustExistInPAF'] = e.records[14].Required;
                this.sysCharParams['vEnablePostcodeDefaulting'] = e.records[15].Required;
                this.sysCharParams['vSCEnablePostcodeDefaulting'] = e.records[15].Required;
                this.sysCharParams['vSCRunPAFSearchOn1stAddressLine'] = e.records[16].Required;
                this.sysCharParams['vSCEnableLtdCompanyAndReg'] = e.records[17].Required;
                this.sysCharParams['vSCTaxRegNumber'] = e.records[18].Required;
                this.sysCharParams['vSCAccountDiscounts'] = e.records[19].Required;
                this.sysCharParams['vSCEnableMonthsNoticeNotUsed'] = e.records[20].Required;
                this.sysCharParams['vSCNoticePeriodNotused'] = e.records[20].Required;
                this.sysCharParams['vSCMonthsNotice'] = e.records[20].Integer;
                this.sysCharParams['vSCNoticePeriod'] = e.records[20].Logical;
                if (this.sysCharParams['vSCEnableMonthsNoticeNotUsed']) {
                    this.sysCharParams['vSCEnableMonthsNotice'] = e.records[20].Logical;
                }
                else {
                    this.sysCharParams['vSCEnableMonthsNotice'] = false;
                }
                this.sysCharParams['vSCEnableExternalRefNotUsed'] = e.records[21].Required;
                this.sysCharParams['vSCEnableExternalReference'] = e.records[21].Logical;
                this.sysCharParams['vSCEnableBankDetailEntry'] = e.records[22].Required;
                this.sysCharParams['vSCEnableLegacyMandate'] = e.records[22].Logical;
                this.sysCharParams['vSCEnableSubsequentDuration'] = e.records[23].Required;
                this.sysCharParams['vSCSubsequentDuration'] = e.records[23].Integer;
                this.sysCharParams['vSCAutoCreateRenewalProspect'] = e.records[24].Required;
                this.sysCharParams['vSCEnableTaxRegistrationNumber2'] = e.records[25].Required;
                this.sysCharParams['vRequired'] = e.records[26].Required;
                this.sysCharParams['vSCEnableTaxCodeDefaultingText'] = e.records[26].Text;
                this.sysCharParams['vSCEnableMinimumDuration'] = e.records[27].Required;
                this.sysCharParams['vSCMinimumDuration'] = e.records[27].Integer;
                this.sysCharParams['vSCEnableTrialPeriodServices'] = e.records[28].Required;
                this.sysCharParams['vSCEnableGPSCoordinates'] = e.records[29].Required;
                this.sysCharParams['vSCHidePostcode'] = e.records[30].Required;
                this.sysCharParams['vSCEnableHPRLExempt'] = e.records[31].Required;
                this.sysCharParams['vSCDisplayContractOwner'] = e.records[32].Required;
                this.sysCharParams['vSCContractOwnerRequired'] = e.records[32].Logical;
                this.sysCharParams['vSCDisplayContractPaymentDueDay'] = e.records[33].Required;
                this.sysCharParams['vSCEnableSEPAFinanceMandate'] = e.records[34].Required;
                this.sysCharParams['vSCEnableSEPAFinanceMandateLog'] = e.records[34].Logical;
                this.sysCharParams['vSCDisableDefaultCountryCode'] = e.records[35].Required;
                this.sysCharParams['vSCHideBankDetailsTab'] = e.records[36].Required;
                this.sysCharParams['vSCGroupAccount'] = e.records[37].Required;
                this.sysCharParams['vSCVisitTolerances'] = e.records[38].Required;
                this.sysCharParams['vSCInfestationTolerance'] = e.records[39].Required;
                this.sysCharParams['vSCCapitalFirstLtr'] = e.records[40].Required;
                this.sysCharParams['vSCConnectContrPostcodeNegEmp'] = e.records[41].Required;
                this.sysCharParams['vSCEnablePayTypeAtInvGroupLevel'] = e.records[42].Required;
                this.sysCharParams['vSCEnableValidatePostcodeSuburb'] = e.records[43].Logical;
                this.sysCharParams['vSCEnablePostcodeSuburbLog'] = e.records[43].Logical;
                this.sysCharParams['vShowWasteConsignmentNoteHistory'] = e.records[44].Required;
                this.sysCharParams['vSCEnableRenewals'] = e.records[45].Required;
                if (this.sysCharParams['vSCEnablePostcodeDefaulting']) {
                    this.utils.determinePostCodeDefaulting(this.sysCharParams['vSCEnablePostcodeDefaulting']).subscribe(function (res) {
                        _this.sysCharParams['vSCEnablePostcodeDefaulting'] = res;
                        _this.sysCharParams['vEnablePostcodeDefaulting'] = res;
                    });
                }
            }
            else {
                this.sysCharParams = e.records[0];
            }
            this.otherParams['vDisableFields'] = '';
            if (!this.sysCharParams['vSCEnableCompanyCode']) {
                if (this.otherParams['vDisableFields'] !== '') {
                    this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + ',' + 'CompanyCode';
                }
                else {
                    this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + 'CompanyCode';
                }
            }
            if (!this.sysCharParams['vSCEnableMinimumDuration']) {
                if (this.otherParams['vDisableFields'] !== '') {
                    this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + ',' + 'MinimumDurationCode';
                }
                else {
                    this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + 'MinimumDurationCode';
                }
            }
            if (!this.sysCharParams['vSCEnableSubsequentDuration'] || !this.sysCharParams['vSCEnableMinimumDuration']) {
                if (this.otherParams['vDisableFields'] !== '') {
                    this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + ',' + 'SubsequentDurationCode';
                }
                else {
                    this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + 'SubsequentDurationCode';
                }
            }
            if (!this.sysCharParams['vSCEnableAddressLine3']) {
                if (this.otherParams['vDisableFields'] !== '') {
                    this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + ',' + 'DisableAddressLine3';
                }
                else {
                    this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + 'DisableAddressLine3';
                }
            }
            if (!this.sysCharParams['vSCEnableLtdCompanyAndReg']) {
                if (this.otherParams['vDisableFields'] !== '') {
                    this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + ',' + 'DisableLtdCompanyAndReg';
                }
                else {
                    this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + 'DisableLtdCompanyAndReg';
                }
            }
            if (!this.sysCharParams['vSCEnableMonthsNotice'] || !this.sysCharParams['vSCEnableMonthsNoticeNotUsed']) {
                if (this.otherParams['vDisableFields'] !== '') {
                    this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + ',' + 'DisableMonthsNotice';
                }
                else {
                    this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + 'DisableMonthsNotice';
                }
            }
            this.otherParams['ReqAutoInvoiceFee'] = this.sysCharParams['vSCEnableInvoiceFee'];
            if ((this.sysCharParams['vSCEnableBankDetailEntry'] === true && this.sysCharParams['vSCEnableSEPAFinanceMandate'] === true && this.sysCharParams['vSCEnableSEPAFinanceMandateLog'] === false) || (this.sysCharParams['vSCEnableBankDetailEntry'] === false && this.sysCharParams['vSCEnableSEPAFinanceMandate'] === false && this.sysCharParams['vSCEnableSEPAFinanceMandateLog'] === true)) {
                this.otherParams['SepaConfigInd'] = true;
            }
            else {
                this.otherParams['SepaConfigInd'] = false;
            }
            this.buildMenuOptions();
        }
    };
    ContractMaintenanceComponent.prototype.fetchSysChar = function (sysCharNumbers) {
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
    ContractMaintenanceComponent.prototype.setDefaultFormState = function () {
        this.displayList = JSON.parse(JSON.stringify(this.displayListClone));
        for (var i in this.contractFormGroup.controls) {
            if (this.contractFormGroup.controls.hasOwnProperty(i)) {
                this.contractFormGroup.controls[i].clearValidators();
            }
        }
        this.isNationalAccount = false;
        this.contractFormGroup.controls['ContractNumber'].setValidators(Validators.required);
        this.contractFormGroup.controls['ContractName'].setValidators(Validators.required);
        this.contractFormGroup.controls['ContractCommenceDate'].setValidators(Validators.required);
        this.contractFormGroup.reset();
        this.store.dispatch({ type: ContractActionTypes.FORM_RESET, payload: {} });
    };
    ContractMaintenanceComponent.prototype.lookUpRecord = function (data, maxresults) {
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
    ContractMaintenanceComponent.prototype.fetchAccountData = function (params, headers) {
        this.query.set(this.serviceConstants.BusinessCode, this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
        this.query.set(this.serviceConstants.CountryCode, this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
        this.query.set(this.serviceConstants.Action, this.queryParams.action);
        for (var key in params) {
            if (key) {
                this.query.set(key, params[key]);
            }
        }
        if (!headers) {
            headers = this.queryParams;
        }
        return this.httpService.makeGetRequest(headers.method, headers.module, headers.operation, this.query);
    };
    ContractMaintenanceComponent.prototype.fetchPremiseData = function () {
        var _this = this;
        var data = [{
                'table': 'Premise',
                'query': { 'BusinessCode': this.storeData['code'].business, 'ContractNumber': this.contractStoreData.ContractNumber, 'AccountNumber': this.contractStoreData.AccountNumber, 'ContractTypeCode': this.contractStoreData.ContractTypePrefix },
                'fields': ['BusinessCode', 'PNOL', 'PortfolioStatusCode', 'PremiseNumber', 'AccountNumber', 'ContractNumber', 'PNOLEffectiveDate']
            }];
        this.lookUpRecord(data, 5).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    if (e['results'][0][0].PNOL) {
                        _this.displayList.pnol = true;
                    }
                    else {
                        _this.displayList.pnol = false;
                    }
                }
            }
        }, function (error) {
        });
    };
    ContractMaintenanceComponent.prototype.getContractCopyData = function (params) {
        var queryContract = new URLSearchParams();
        queryContract.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryContract.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        for (var key in params) {
            if (key) {
                queryContract.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.getContractDetails.method, this.getContractDetails.module, this.getContractDetails.operation, queryContract);
    };
    ContractMaintenanceComponent.prototype.fetchContractData = function (functionName, params) {
        var _this = this;
        if (functionName === 'CheckPostcodeNegBranch') {
            if (!((this.sysCharParams['vEnablePostcodeDefaulting'] && this.storeData['mode'].addMode === true && this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== '' && this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== '' && this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== '') || (this.sysCharParams['vEnablePostcodeDefaulting'] && this.storeData['mode'].updateMode === true && this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== '' && this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== ''))) {
                this.dataEventCheckPostcodeNegBranch = new Subject();
                setTimeout(function () {
                    _this.dataEventCheckPostcodeNegBranch.next({
                        ErrorMessageDesc: ''
                    });
                    _this.dataEventCheckPostcodeNegBranch.complete();
                }, 0);
                return this.dataEventCheckPostcodeNegBranch.asObservable();
            }
        }
        else if (functionName === 'CheckPostcode') {
            if (!(this.sysCharParams['vSCPostCodeMustExistInPAF'] && (this.sysCharParams['vSCEnableHopewiserPAF'] || this.sysCharParams['vSCEnableDatabasePAF']))) {
                this.dataEventCheckPostcode = new Subject();
                setTimeout(function () {
                    _this.dataEventCheckPostcode.next({
                        ErrorMessageDesc: ''
                    });
                    _this.dataEventCheckPostcode.complete();
                }, 0);
                return this.dataEventCheckPostcode.asObservable();
            }
        }
        else if (functionName === 'WarnPostcode') {
            if (this.contractFormGroup.controls['AccountNumber'].value === '') {
                this.dataEventWarnPostcode = new Subject();
                setTimeout(function () {
                    _this.dataEventWarnPostcode.next({
                        ErrorMessageDesc: ''
                    });
                    _this.dataEventWarnPostcode.complete();
                }, 0);
                return this.dataEventWarnPostcode.asObservable();
            }
        }
        else if (functionName === 'CheckNatAcc') {
            if (this.contractFormGroup.controls['AccountNumber'].value === '') {
                this.dataEventCheckNatAcc = new Subject();
                setTimeout(function () {
                    _this.dataEventCheckNatAcc.next({
                        ErrorMessageDesc: ''
                    });
                    _this.dataEventCheckNatAcc.complete();
                }, 0);
                return this.dataEventCheckNatAcc.asObservable();
            }
        }
        this.queryContract = new URLSearchParams();
        var businessCode = this.utils.getBusinessCode();
        var countryCode = this.utils.getCountryCode();
        this.queryContract.set(this.serviceConstants.BusinessCode, businessCode);
        this.queryContract.set(this.serviceConstants.CountryCode, countryCode);
        this.queryContract.set(this.serviceConstants.Action, this.queryParamsContract.action);
        if (this.contractStoreData && this.contractStoreData.ContractNumber) {
            this.queryContract.set('ContractNumber', this.contractStoreData.ContractNumber);
        }
        if (this.inputParams && this.inputParams.currentContractType) {
            this.queryContract.set('ContractTypeCode', this.inputParams.currentContractType);
        }
        if (this.contractStoreData && this.contractStoreData.ContractTypePrefix) {
            this.queryContract.set('ContractTypeCode', this.contractStoreData.ContractTypePrefix);
        }
        if (functionName !== '') {
            this.queryContract.set(this.serviceConstants.Action, '6');
            this.queryContract.set('Function', functionName);
        }
        for (var key in params) {
            if (key) {
                this.queryContract.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.queryParamsContract.method, this.queryParamsContract.module, this.queryParamsContract.operation, this.queryContract);
    };
    ContractMaintenanceComponent.prototype.fetchContractDataPost = function (functionName, params, formData) {
        var queryContract = new URLSearchParams();
        var businessCode = this.utils.getBusinessCode();
        var countryCode = this.utils.getCountryCode();
        queryContract.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryContract.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryContract.set(this.serviceConstants.Action, this.queryParamsContract.action);
        if (this.inputParams && this.inputParams.currentContractType) {
            queryContract.set('ContractTypeCode', this.inputParams.currentContractType);
        }
        if (this.contractStoreData && this.contractStoreData.ContractTypePrefix) {
            queryContract.set('ContractTypeCode', this.contractStoreData.ContractTypePrefix);
        }
        if (functionName !== '') {
            queryContract.set(this.serviceConstants.Action, '6');
            queryContract.set('Function', functionName);
        }
        for (var key in params) {
            if (key) {
                queryContract.set(key, params[key]);
            }
        }
        return this.httpService.makePostRequest(this.queryParamsContract.method, this.queryParamsContract.module, this.queryParamsContract.operation, queryContract, formData);
    };
    ContractMaintenanceComponent.prototype.updateContract = function () {
        var _this = this;
        var formdata = {};
        this.queryContract = new URLSearchParams();
        this.queryContract.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
        this.queryContract.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        this.queryContract.set(this.serviceConstants.Action, '2');
        formdata['ContractNumber'] = this.contractFormGroup.controls['ContractNumber'].value;
        formdata['ContractName'] = this.contractFormGroup.controls['ContractName'] && this.contractFormGroup.controls['ContractName'].value ? this.contractFormGroup.controls['ContractName'].value : '';
        formdata['NegBranchNumber'] = this.contractFormGroup.controls['NegBranchNumber'] && this.contractFormGroup.controls['NegBranchNumber'].value ? this.contractFormGroup.controls['NegBranchNumber'].value : '';
        formdata['AccountNumber'] = this.contractFormGroup.controls['AccountNumber'] && this.contractFormGroup.controls['AccountNumber'].value ? this.contractFormGroup.controls['AccountNumber'].value : '';
        formdata['CurrentPremises'] = this.contractFormGroup.controls['CurrentPremises'] && this.contractFormGroup.controls['CurrentPremises'].value ? this.contractFormGroup.controls['CurrentPremises'].value : '';
        formdata['ContractHasExpired'] = this.contractFormGroup.controls['ContractHasExpired'] && this.contractFormGroup.controls['ContractHasExpired'].value ? this.contractFormGroup.controls['ContractHasExpired'].value : '';
        formdata['ExternalReference'] = this.storeData['formGroup'].typeC.controls['ExternalReference'] && this.storeData['formGroup'].typeC.controls['ExternalReference'].value ? this.storeData['formGroup'].typeC.controls['ExternalReference'].value : '';
        formdata['ContractAddressLine1'] = this.storeData['formGroup'].typeA.controls['ContractAddressLine1'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine1'].value ? this.storeData['formGroup'].typeA.controls['ContractAddressLine1'].value : '';
        formdata['ContractAddressLine2'] = this.storeData['formGroup'].typeA.controls['ContractAddressLine2'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine2'].value ? this.storeData['formGroup'].typeA.controls['ContractAddressLine2'].value : '';
        formdata['ContractAddressLine3'] = this.storeData['formGroup'].typeA.controls['ContractAddressLine3'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine3'].value ? this.storeData['formGroup'].typeA.controls['ContractAddressLine3'].value : '';
        formdata['ContractAddressLine4'] = this.storeData['formGroup'].typeA.controls['ContractAddressLine4'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value ? this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value : '';
        formdata['ContractAddressLine5'] = this.storeData['formGroup'].typeA.controls['ContractAddressLine5'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value ? this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value : '';
        formdata['ContractPostcode'] = this.storeData['formGroup'].typeA.controls['ContractPostcode'] && this.storeData['formGroup'].typeA.controls['ContractPostcode'].value ? this.storeData['formGroup'].typeA.controls['ContractPostcode'].value : '';
        formdata['CountryCode'] = this.storeData['formGroup'].typeA.controls['CountryCode'] && this.storeData['formGroup'].typeA.controls['CountryCode'].value ? this.storeData['formGroup'].typeA.controls['CountryCode'].value : '';
        formdata['ContractContactName'] = this.storeData['formGroup'].typeA.controls['ContractContactName'] && this.storeData['formGroup'].typeA.controls['ContractContactName'].value ? this.storeData['formGroup'].typeA.controls['ContractContactName'].value : '';
        formdata['ContractContactPosition'] = this.storeData['formGroup'].typeA.controls['ContractContactPosition'] && this.storeData['formGroup'].typeA.controls['ContractContactPosition'] ? this.storeData['formGroup'].typeA.controls['ContractContactPosition'].value : '';
        formdata['ContractContactDepartment'] = this.storeData['formGroup'].typeA.controls['ContractContactDepartment'] && this.storeData['formGroup'].typeA.controls['ContractContactDepartment'].value ? this.storeData['formGroup'].typeA.controls['ContractContactDepartment'].value : '';
        formdata['ContractContactTelephone'] = this.storeData['formGroup'].typeA.controls['ContractContactTelephone'] && this.storeData['formGroup'].typeA.controls['ContractContactTelephone'].value ? this.storeData['formGroup'].typeA.controls['ContractContactTelephone'].value : '';
        formdata['ContractContactMobile'] = this.storeData['formGroup'].typeA.controls['ContractContactMobile'] && this.storeData['formGroup'].typeA.controls['ContractContactMobile'].value ? this.storeData['formGroup'].typeA.controls['ContractContactMobile'].value : '';
        formdata['ContractContactFax'] = this.storeData['formGroup'].typeA.controls['ContractContactFax'] && this.storeData['formGroup'].typeA.controls['ContractContactFax'].value ? this.storeData['formGroup'].typeA.controls['ContractContactFax'].value : '';
        formdata['ContractContactEmail'] = this.storeData['formGroup'].typeA.controls['ContractContactEmail'] && this.storeData['formGroup'].typeA.controls['ContractContactEmail'].value ? this.storeData['formGroup'].typeA.controls['ContractContactEmail'].value : '';
        formdata['GPSCoordinateX'] = this.storeData['formGroup'].typeA.controls['GPSCoordinateX'] && this.storeData['formGroup'].typeA.controls['GPSCoordinateX'].value ? this.storeData['formGroup'].typeA.controls['GPSCoordinateX'].value : '';
        formdata['GPSCoordinateY'] = this.storeData['formGroup'].typeA.controls['GPSCoordinateY'] && this.storeData['formGroup'].typeA.controls['GPSCoordinateY'].value ? this.storeData['formGroup'].typeA.controls['GPSCoordinateY'].value : '';
        formdata['TelesalesInd'] = this.storeData['formGroup'].typeC.controls['Telesales'] && this.storeData['formGroup'].typeC.controls['Telesales'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['InvoiceAnnivDate'] = this.storeData['formGroup'].typeB.controls['InvoiceAnnivDate'] && this.storeData['formGroup'].typeB.controls['InvoiceAnnivDate'].value ? this.storeData['formGroup'].typeB.controls['InvoiceAnnivDate'].value : '';
        formdata['ContractResignDate'] = this.storeData['formGroup'].typeC.controls['ContractResignDate'] && this.storeData['formGroup'].typeC.controls['ContractResignDate'].value ? this.storeData['formGroup'].typeC.controls['ContractResignDate'].value : '';
        formdata['InvoiceFrequencyCode'] = this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'] && this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].value ? this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].value : '';
        formdata['InvoiceFrequencyChargeInd'] = this.contractFormGroup.controls['InvoiceFrequencyChargeInd'] && this.contractFormGroup.controls['InvoiceFrequencyChargeInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['InvoiceFrequencyChargeValue'] = this.storeData['formGroup'].typeB.controls['InvoiceFrequencyChargeValue'] && this.storeData['formGroup'].typeB.controls['InvoiceFrequencyChargeValue'].value ? this.storeData['formGroup'].typeB.controls['InvoiceFrequencyChargeValue'].value : '';
        formdata['LostBusinessNoticePeriod'] = this.storeData['formGroup'].typeC.controls['NoticePeriod'] && this.storeData['formGroup'].typeC.controls['NoticePeriod'].value ? this.storeData['formGroup'].typeC.controls['NoticePeriod'].value : '';
        formdata['AdvanceInvoiceInd'] = this.storeData['formGroup'].typeB.controls['AdvanceInvoiceInd'] && this.storeData['formGroup'].typeB.controls['AdvanceInvoiceInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['ContractDurationCode'] = this.storeData['formGroup'].typeB.controls['ContractDurationCode'] && this.storeData['formGroup'].typeB.controls['ContractDurationCode'].value ? this.storeData['formGroup'].typeB.controls['ContractDurationCode'].value : '';
        formdata['SubsequentDurationCode'] = this.storeData['formGroup'].typeB.controls['SubsequentDurationCode'] && this.storeData['formGroup'].typeB.controls['SubsequentDurationCode'].value ? this.storeData['formGroup'].typeB.controls['SubsequentDurationCode'].value : '';
        formdata['APIExemptInd'] = this.storeData['formGroup'].typeB.controls['APIExemptInd'] && this.storeData['formGroup'].typeB.controls['APIExemptInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['APIExemptText'] = this.storeData['formGroup'].typeB.controls['APIExemptText'] && this.storeData['formGroup'].typeB.controls['APIExemptText'].value ? this.storeData['formGroup'].typeB.controls['APIExemptText'].value : '';
        formdata['NextAPIDate'] = this.storeData['formGroup'].typeB.controls['NextAPIDate'] && this.storeData['formGroup'].typeB.controls['NextAPIDate'].value ? this.storeData['formGroup'].typeB.controls['NextAPIDate'].value : '';
        formdata['ContractReference'] = this.storeData['formGroup'].typeC.controls['ContractReference'] && this.storeData['formGroup'].typeC.controls['ContractReference'].value ? this.storeData['formGroup'].typeC.controls['ContractReference'].value : '';
        formdata['AgreementNumber'] = this.storeData['formGroup'].typeC.controls['AgreementNumber'] && this.storeData['formGroup'].typeC.controls['AgreementNumber'].value ? this.storeData['formGroup'].typeC.controls['AgreementNumber'].value : '';
        formdata['RenewalAgreementNumber'] = this.storeData['formGroup'].typeC.controls['RenewalAgreementNumber'] && this.storeData['formGroup'].typeC.controls['RenewalAgreementNumber'] ? this.storeData['formGroup'].typeC.controls['RenewalAgreementNumber'].value : '';
        formdata['AuthorityCode'] = this.storeData['formGroup'].typeB.controls['AuthorityCode'] && this.storeData['formGroup'].typeB.controls['AuthorityCode'].value ? this.storeData['formGroup'].typeB.controls['AuthorityCode'].value : '';
        formdata['ContractExpiryDate'] = this.storeData['formGroup'].typeB.controls['ContractExpiryDate'] && this.storeData['formGroup'].typeB.controls['ContractExpiryDate'].value ? this.storeData['formGroup'].typeB.controls['ContractExpiryDate'].value : '';
        formdata['ContractRenewalDate'] = this.storeData['formGroup'].typeB.controls['ContractRenewalDate'] && this.storeData['formGroup'].typeB.controls['ContractRenewalDate'].value ? this.storeData['formGroup'].typeB.controls['ContractRenewalDate'].value : '';
        formdata['CreateRenewalInd'] = this.storeData['formGroup'].typeB.controls['CreateRenewalInd'] && this.storeData['formGroup'].typeB.controls['CreateRenewalInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['PaymentTypeCode'] = this.storeData['formGroup'].typeB.controls['PaymentTypeCode'] && this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].value ? this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].value : '';
        formdata['VADDBranchNumber'] = this.storeData['formGroup'].typeB.controls['VADDBranchNumber'] && this.storeData['formGroup'].typeB.controls['VADDBranchNumber'].value ? this.storeData['formGroup'].typeB.controls['VADDBranchNumber'].value : '';
        formdata['VADDMandateNumber'] = this.storeData['formGroup'].typeB.controls['VADDMandateNumber'] && this.storeData['formGroup'].typeB.controls['VADDMandateNumber'].value ? this.storeData['formGroup'].typeB.controls['VADDMandateNumber'].value : '';
        formdata['MandateNumberAccount'] = this.storeData['formGroup'].typeB.controls['MandateNumberAccount'] && this.storeData['formGroup'].typeB.controls['MandateNumberAccount'].value ? this.storeData['formGroup'].typeB.controls['MandateNumberAccount'].value : '';
        formdata['MandateDate'] = this.storeData['formGroup'].typeB.controls['MandateDate'] && this.storeData['formGroup'].typeB.controls['MandateDate'].value ? this.storeData['formGroup'].typeB.controls['MandateDate'].value : '';
        formdata['CompanyCode'] = this.storeData['formGroup'].typeC.controls['CompanyCode'] && this.storeData['formGroup'].typeC.controls['CompanyCode'].value ? this.storeData['formGroup'].typeC.controls['CompanyCode'].value : '';
        formdata['MinimumDurationCode'] = this.storeData['formGroup'].typeB.controls['MinimumDurationCode'] && this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].value ? this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].value : '';
        formdata['MinimumExpiryDate'] = this.storeData['formGroup'].typeB.controls['MinimumExpiryDate'] && this.storeData['formGroup'].typeB.controls['MinimumExpiryDate'].value ? this.storeData['formGroup'].typeB.controls['MinimumExpiryDate'].value : '';
        formdata['ContractSalesEmployee'] = this.storeData['formGroup'].typeC.controls['SalesEmployee'] && this.storeData['formGroup'].typeC.controls['SalesEmployee'].value ? this.storeData['formGroup'].typeC.controls['SalesEmployee'].value : '';
        formdata['ContractOwner'] = this.storeData['formGroup'].typeC.controls['ContractOwner'] && this.storeData['formGroup'].typeC.controls['ContractOwner'].value ? this.storeData['formGroup'].typeC.controls['ContractOwner'].value : '';
        formdata['CompanyVATNumber'] = this.storeData['formGroup'].typeC.controls['CompanyVatNumber'] && this.storeData['formGroup'].typeC.controls['CompanyVatNumber'].value ? this.storeData['formGroup'].typeC.controls['CompanyVatNumber'].value : '';
        formdata['CompanyVATNumber2'] = this.storeData['formGroup'].typeC.controls['CompanyVatNumber2'] && this.storeData['formGroup'].typeC.controls['CompanyVatNumber2'].value ? this.storeData['formGroup'].typeC.controls['CompanyVatNumber2'].value : '';
        formdata['CompanyRegistrationNumber'] = this.storeData['formGroup'].typeC.controls['CompanyRegistrationNumber'] && this.storeData['formGroup'].typeC.controls['CompanyRegistrationNumber'].value ? this.storeData['formGroup'].typeC.controls['CompanyRegistrationNumber'].value : '';
        formdata['InterCompanyPortfolioInd'] = this.storeData['formGroup'].typeC.controls['InterCompanyPortfolio'] && this.storeData['formGroup'].typeC.controls['InterCompanyPortfolio'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['LimitedCompanyInd'] = this.storeData['formGroup'].typeC.controls['LimitedCompany'] && this.storeData['formGroup'].typeC.controls['LimitedCompany'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['CallLogID'] = '';
        formdata['TrialPeriodInd'] = this.contractFormGroup.controls['TrialPeriodInd'] && this.contractFormGroup.controls['TrialPeriodInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['GroupAccountPriceGroupID'] = this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'] && this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value ? this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value : '';
        formdata['ContinuousInd'] = this.storeData['formGroup'].typeB.controls['ContinuousInd'] && this.storeData['formGroup'].typeB.controls['ContinuousInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['DisableList'] = this.otherParams['vDisableFields'];
        formdata['ReqAutoNumber'] = this.sysCharParams['vSCEnableAutoNumber'] ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['MandateRequired'] = this.otherParams['MandateRequired'] ? this.otherParams['MandateRequired'] : '';
        formdata['PaymentTypeWarning'] = this.contractFormGroup.controls['PaymentTypeWarning'] && this.contractFormGroup.controls['PaymentTypeWarning'].value ? this.contractFormGroup.controls['PaymentTypeWarning'].value : '';
        formdata['ProspectNumber'] = this.prospectNumber ? this.prospectNumber : '';
        formdata['BadDebtAccount'] = this.contractFormGroup.controls['BadDebtAccount'] && this.contractFormGroup.controls['BadDebtAccount'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['PaymentDueDay'] = this.storeData['formGroup'].typeB.controls['PaymentDueDay'] && this.storeData['formGroup'].typeB.controls['PaymentDueDay'].value ? this.storeData['formGroup'].typeB.controls['PaymentDueDay'].value : '';
        formdata['GroupAccountNumber'] = this.contractFormGroup.controls['GroupAccountNumber'] && this.contractFormGroup.controls['GroupAccountNumber'].value ? this.contractFormGroup.controls['GroupAccountNumber'].value : '';
        formdata['BankAccountNumber'] = this.storeData['formGroup'].typeB.controls['BankAccountNumber'] && this.storeData['formGroup'].typeB.controls['BankAccountNumber'].value ? this.storeData['formGroup'].typeB.controls['BankAccountNumber'].value : '';
        formdata['BankAccountSortCode'] = this.storeData['formGroup'].typeB.controls['BankAccountSortCode'] && this.storeData['formGroup'].typeB.controls['BankAccountSortCode'].value ? this.storeData['formGroup'].typeB.controls['BankAccountSortCode'].value : '';
        formdata['ContractTypeCode'] = this.inputParams.currentContractType;
        formdata['ContractAnnualValue'] = this.contractFormGroup.controls['ContractAnnualValue'] && this.contractFormGroup.controls['ContractAnnualValue'].value ? this.contractFormGroup.controls['ContractAnnualValue'].value : '';
        formdata['ContractCommenceDate'] = this.contractFormGroup.controls['ContractCommenceDate'] && this.contractFormGroup.controls['ContractCommenceDate'].value ? this.contractFormGroup.controls['ContractCommenceDate'].value : '';
        formdata['PortfolioStatusCode'] = this.contractFormGroup.controls['Status'] && this.contractFormGroup.controls['Status'].value ? this.contractFormGroup.controls['Status'].value : '';
        formdata['InactiveEffectDate'] = this.contractFormGroup.controls['InactiveEffectDate'] && this.contractFormGroup.controls['InactiveEffectDate'].value ? this.contractFormGroup.controls['InactiveEffectDate'].value : '';
        formdata['AnyPendingBelow'] = this.contractFormGroup.controls['AnyPendingBelow'] && this.contractFormGroup.controls['AnyPendingBelow'].value ? this.contractFormGroup.controls['AnyPendingBelow'].value : '';
        formdata['LostBusinessDesc'] = this.contractFormGroup.controls['LostBusinessDesc'] && this.contractFormGroup.controls['LostBusinessDesc'].value ? this.contractFormGroup.controls['LostBusinessDesc'].value : '';
        formdata['LostBusinessDesc2'] = this.contractFormGroup.controls['LostBusinessDesc2'] && this.contractFormGroup.controls['LostBusinessDesc2'].value ? this.contractFormGroup.controls['LostBusinessDesc2'].value : '';
        formdata['LostBusinessDesc3'] = this.contractFormGroup.controls['LostBusinessDesc3'] && this.contractFormGroup.controls['LostBusinessDesc3'].value ? this.contractFormGroup.controls['LostBusinessDesc3'].value : '';
        formdata['MoreThanOneContract'] = this.contractFormGroup.controls['MoreThanOneContract'] && this.contractFormGroup.controls['MoreThanOneContract'].value ? this.contractFormGroup.controls['MoreThanOneContract'].value : '';
        formdata['AccountBalance'] = this.contractFormGroup.controls['AccountBalance'] && this.contractFormGroup.controls['AccountBalance'].value ? this.contractFormGroup.controls['AccountBalance'].value : '';
        formdata['InvoiceFeeCode'] = this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'] && this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].value ? this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].value : '';
        formdata['VATExempt'] = this.storeData['formGroup'].typeB.controls['VATExempt'] && this.storeData['formGroup'].typeB.controls['VATExempt'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['InvoiceSuspendInd'] = this.storeData['formGroup'].typeB.controls['InvoiceSuspendInd'] && this.storeData['formGroup'].typeB.controls['InvoiceSuspendInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['InvoiceSuspendText'] = this.storeData['formGroup'].typeB.controls['InvoiceSuspendText'] && this.storeData['formGroup'].typeB.controls['InvoiceSuspendText'].value ? this.storeData['formGroup'].typeB.controls['InvoiceSuspendText'].value : '';
        formdata['HPRLExemptInd'] = this.storeData['formGroup'].typeB.controls['HPRLExemptInd'] && this.storeData['formGroup'].typeB.controls['HPRLExemptInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['VADDApproved'] = this.storeData['formGroup'].typeB.controls['VADDApproved'] && this.storeData['formGroup'].typeB.controls['VADDApproved'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['ContractOwnerSurname'] = this.storeData['formGroup'].typeC.controls['ContractOwnerSurname'] && this.storeData['formGroup'].typeC.controls['ContractOwnerSurname'].value ? this.storeData['formGroup'].typeC.controls['ContractOwnerSurname'].value : '';
        if (this.storeData['formGroup'].typeD) {
            formdata['PromptPaymentInd'] = this.storeData['formGroup'].typeD.controls['PromptPaymentInd'] && this.storeData['formGroup'].typeD.controls['PromptPaymentInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
            formdata['PromptPaymentRate'] = this.storeData['formGroup'].typeD.controls['PromptPaymentRate'] && this.storeData['formGroup'].typeD.controls['PromptPaymentRate'].value ? this.storeData['formGroup'].typeD.controls['PromptPaymentRate'].value : '';
            formdata['PromptPaymentNarrative'] = this.storeData['formGroup'].typeD.controls['PromptPaymentNarrative'] && this.storeData['formGroup'].typeD.controls['PromptPaymentNarrative'].value ? this.storeData['formGroup'].typeD.controls['PromptPaymentNarrative'].value : '';
            formdata['RetrospectiveInd'] = this.storeData['formGroup'].typeD.controls['RetrospectiveInd'] && this.storeData['formGroup'].typeD.controls['RetrospectiveInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
            formdata['RetrospectiveRate'] = this.storeData['formGroup'].typeD.controls['RetrospectiveRate'] && this.storeData['formGroup'].typeD.controls['RetrospectiveRate'].value ? this.storeData['formGroup'].typeD.controls['RetrospectiveRate'].value : '';
            formdata['RetrospectiveNarrative'] = this.storeData['formGroup'].typeD.controls['RetrospectiveNarrative'] && this.storeData['formGroup'].typeD.controls['RetrospectiveNarrative'].value ? this.storeData['formGroup'].typeD.controls['RetrospectiveNarrative'].value : '';
        }
        if (this.storeData['formGroup'].typeE) {
            formdata['CICResponseSLA'] = this.storeData['formGroup'].typeE.controls['CICResponseSLA'] && this.storeData['formGroup'].typeE.controls['CICResponseSLA'].value ? this.storeData['formGroup'].typeE.controls['CICResponseSLA'].value : '';
            formdata['CIFirstSLAEscDays'] = this.storeData['formGroup'].typeE.controls['CIFirstSLAEscDays'] && this.storeData['formGroup'].typeE.controls['CIFirstSLAEscDays'].value ? this.storeData['formGroup'].typeE.controls['CIFirstSLAEscDays'].value : '';
            formdata['CISubSLAEscDays'] = this.storeData['formGroup'].typeE.controls['CISubSLAEscDays'] && this.storeData['formGroup'].typeE.controls['CISubSLAEscDays'].value ? this.storeData['formGroup'].typeE.controls['CISubSLAEscDays'].value : '';
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParamsContract.method, this.queryParamsContract.module, this.queryParamsContract.operation, this.queryContract, formdata).subscribe(function (e) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (e.status === GlobalConstant.Configuration.Failure) {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e['errorMessage'] || e['fullError']) {
                    _this.errorService.emitError(e);
                }
                else {
                    _this.errorService.emitError({
                        title: 'Message',
                        msg: MessageConstant.Message.RecordSavedSuccessfully
                    });
                    _this.riMaintenanceAfterSave();
                    _this.formPristine();
                }
                _this.tabsError = {
                    tabA: false,
                    tabB: false,
                    tabC: false,
                    tabD: false,
                    tabE: false
                };
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    ContractMaintenanceComponent.prototype.addContract = function () {
        var _this = this;
        var formdata = {};
        this.queryContract = new URLSearchParams();
        this.queryContract.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
        this.queryContract.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        this.queryContract.set(this.serviceConstants.Action, '1');
        formdata['ContractNumber'] = this.sysCharParams['vSCEnableAutoNumber'] ? '' : this.contractFormGroup.controls['ContractNumber'].value;
        formdata['ContractName'] = this.contractFormGroup.controls['ContractName'] && this.contractFormGroup.controls['ContractName'].value ? this.contractFormGroup.controls['ContractName'].value : '';
        formdata['NegBranchNumber'] = this.contractFormGroup.controls['NegBranchNumber'] && this.contractFormGroup.controls['NegBranchNumber'].value ? this.contractFormGroup.controls['NegBranchNumber'].value : '';
        formdata['AccountNumber'] = this.contractFormGroup.controls['AccountNumber'] && this.contractFormGroup.controls['AccountNumber'].value ? this.contractFormGroup.controls['AccountNumber'].value : '';
        formdata['CurrentPremises'] = this.contractFormGroup.controls['CurrentPremises'] && this.contractFormGroup.controls['CurrentPremises'].value ? this.contractFormGroup.controls['CurrentPremises'].value : '';
        formdata['ContractHasExpired'] = this.contractFormGroup.controls['ContractHasExpired'] && this.contractFormGroup.controls['ContractHasExpired'].value ? this.contractFormGroup.controls['ContractHasExpired'].value : GlobalConstant.Configuration.No;
        formdata['ExternalReference'] = this.storeData['formGroup'].typeC.controls['ExternalReference'] && this.storeData['formGroup'].typeC.controls['ExternalReference'].value ? this.storeData['formGroup'].typeC.controls['ExternalReference'].value : '';
        formdata['ContractAddressLine1'] = this.storeData['formGroup'].typeA.controls['ContractAddressLine1'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine1'].value ? this.storeData['formGroup'].typeA.controls['ContractAddressLine1'].value : '';
        formdata['ContractAddressLine2'] = this.storeData['formGroup'].typeA.controls['ContractAddressLine2'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine2'].value ? this.storeData['formGroup'].typeA.controls['ContractAddressLine2'].value : '';
        formdata['ContractAddressLine3'] = this.storeData['formGroup'].typeA.controls['ContractAddressLine3'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine3'].value ? this.storeData['formGroup'].typeA.controls['ContractAddressLine3'].value : '';
        formdata['ContractAddressLine4'] = this.storeData['formGroup'].typeA.controls['ContractAddressLine4'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value ? this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value : '';
        formdata['ContractAddressLine5'] = this.storeData['formGroup'].typeA.controls['ContractAddressLine5'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value ? this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value : '';
        formdata['ContractPostcode'] = this.storeData['formGroup'].typeA.controls['ContractPostcode'] && this.storeData['formGroup'].typeA.controls['ContractPostcode'].value ? this.storeData['formGroup'].typeA.controls['ContractPostcode'].value : '';
        formdata['CountryCode'] = this.storeData['formGroup'].typeA.controls['CountryCode'] && this.storeData['formGroup'].typeA.controls['CountryCode'].value ? this.storeData['formGroup'].typeA.controls['CountryCode'].value : '';
        formdata['ContractContactName'] = this.storeData['formGroup'].typeA.controls['ContractContactName'] && this.storeData['formGroup'].typeA.controls['ContractContactName'].value ? this.storeData['formGroup'].typeA.controls['ContractContactName'].value : '';
        formdata['ContractContactPosition'] = this.storeData['formGroup'].typeA.controls['ContractContactPosition'] && this.storeData['formGroup'].typeA.controls['ContractContactPosition'] ? this.storeData['formGroup'].typeA.controls['ContractContactPosition'].value : '';
        formdata['ContractContactDepartment'] = this.storeData['formGroup'].typeA.controls['ContractContactDepartment'] && this.storeData['formGroup'].typeA.controls['ContractContactDepartment'].value ? this.storeData['formGroup'].typeA.controls['ContractContactDepartment'].value : '';
        formdata['ContractContactTelephone'] = this.storeData['formGroup'].typeA.controls['ContractContactTelephone'] && this.storeData['formGroup'].typeA.controls['ContractContactTelephone'].value ? this.storeData['formGroup'].typeA.controls['ContractContactTelephone'].value : '';
        formdata['ContractContactMobile'] = this.storeData['formGroup'].typeA.controls['ContractContactMobile'] && this.storeData['formGroup'].typeA.controls['ContractContactMobile'].value ? this.storeData['formGroup'].typeA.controls['ContractContactMobile'].value : '';
        formdata['ContractContactFax'] = this.storeData['formGroup'].typeA.controls['ContractContactFax'] && this.storeData['formGroup'].typeA.controls['ContractContactFax'].value ? this.storeData['formGroup'].typeA.controls['ContractContactFax'].value : '';
        formdata['ContractContactEmail'] = this.storeData['formGroup'].typeA.controls['ContractContactEmail'] && this.storeData['formGroup'].typeA.controls['ContractContactEmail'].value ? this.storeData['formGroup'].typeA.controls['ContractContactEmail'].value : '';
        formdata['GPSCoordinateX'] = this.storeData['formGroup'].typeA.controls['GPSCoordinateX'] && this.storeData['formGroup'].typeA.controls['GPSCoordinateX'].value ? this.storeData['formGroup'].typeA.controls['GPSCoordinateX'].value : '';
        formdata['GPSCoordinateY'] = this.storeData['formGroup'].typeA.controls['GPSCoordinateY'] && this.storeData['formGroup'].typeA.controls['GPSCoordinateY'].value ? this.storeData['formGroup'].typeA.controls['GPSCoordinateY'].value : '';
        formdata['TelesalesInd'] = this.storeData['formGroup'].typeC.controls['Telesales'] && this.storeData['formGroup'].typeC.controls['Telesales'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['InvoiceAnnivDate'] = this.storeData['formGroup'].typeB.controls['InvoiceAnnivDate'] && this.storeData['formGroup'].typeB.controls['InvoiceAnnivDate'].value ? this.storeData['formGroup'].typeB.controls['InvoiceAnnivDate'].value : '';
        formdata['ContractResignDate'] = this.storeData['formGroup'].typeC.controls['ContractResignDate'] && this.storeData['formGroup'].typeC.controls['ContractResignDate'].value ? this.storeData['formGroup'].typeC.controls['ContractResignDate'].value : '';
        formdata['InvoiceFrequencyCode'] = this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'] && this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].value ? this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].value : '';
        formdata['InvoiceFrequencyChargeInd'] = this.contractFormGroup.controls['InvoiceFrequencyChargeInd'] && this.contractFormGroup.controls['InvoiceFrequencyChargeInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['InvoiceFrequencyChargeValue'] = this.storeData['formGroup'].typeB.controls['InvoiceFrequencyChargeValue'] && this.storeData['formGroup'].typeB.controls['InvoiceFrequencyChargeValue'].value ? this.storeData['formGroup'].typeB.controls['InvoiceFrequencyChargeValue'].value : '';
        formdata['LostBusinessNoticePeriod'] = this.storeData['formGroup'].typeC.controls['NoticePeriod'] && this.storeData['formGroup'].typeC.controls['NoticePeriod'].value ? this.storeData['formGroup'].typeC.controls['NoticePeriod'].value : '';
        formdata['AdvanceInvoiceInd'] = this.storeData['formGroup'].typeB.controls['AdvanceInvoiceInd'] && this.storeData['formGroup'].typeB.controls['AdvanceInvoiceInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['ContractDurationCode'] = this.storeData['formGroup'].typeB.controls['ContractDurationCode'] && this.storeData['formGroup'].typeB.controls['ContractDurationCode'].value ? this.storeData['formGroup'].typeB.controls['ContractDurationCode'].value : '';
        formdata['SubsequentDurationCode'] = this.storeData['formGroup'].typeB.controls['SubsequentDurationCode'] && this.storeData['formGroup'].typeB.controls['SubsequentDurationCode'].value ? this.storeData['formGroup'].typeB.controls['SubsequentDurationCode'].value : '';
        formdata['APIExemptInd'] = this.storeData['formGroup'].typeB.controls['APIExemptInd'] && this.storeData['formGroup'].typeB.controls['APIExemptInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['APIExemptText'] = this.storeData['formGroup'].typeB.controls['APIExemptText'] && this.storeData['formGroup'].typeB.controls['APIExemptText'].value ? this.storeData['formGroup'].typeB.controls['APIExemptText'].value : '';
        formdata['NextAPIDate'] = this.storeData['formGroup'].typeB.controls['NextAPIDate'] && this.storeData['formGroup'].typeB.controls['NextAPIDate'].value ? this.storeData['formGroup'].typeB.controls['NextAPIDate'].value : '';
        formdata['ContractReference'] = this.storeData['formGroup'].typeC.controls['ContractReference'] && this.storeData['formGroup'].typeC.controls['ContractReference'].value ? this.storeData['formGroup'].typeC.controls['ContractReference'].value : '';
        formdata['AgreementNumber'] = this.storeData['formGroup'].typeC.controls['AgreementNumber'] && this.storeData['formGroup'].typeC.controls['AgreementNumber'].value ? this.storeData['formGroup'].typeC.controls['AgreementNumber'].value : '';
        formdata['RenewalAgreementNumber'] = this.storeData['formGroup'].typeC.controls['RenewalAgreementNumber'] && this.storeData['formGroup'].typeC.controls['RenewalAgreementNumber'] ? this.storeData['formGroup'].typeC.controls['RenewalAgreementNumber'].value : '';
        formdata['AuthorityCode'] = this.storeData['formGroup'].typeB.controls['AuthorityCode'] && this.storeData['formGroup'].typeB.controls['AuthorityCode'].value ? this.storeData['formGroup'].typeB.controls['AuthorityCode'].value : '';
        formdata['ContractExpiryDate'] = this.storeData['formGroup'].typeB.controls['ContractExpiryDate'] && this.storeData['formGroup'].typeB.controls['ContractExpiryDate'].value ? this.storeData['formGroup'].typeB.controls['ContractExpiryDate'].value : '';
        formdata['ContractRenewalDate'] = this.storeData['formGroup'].typeB.controls['ContractRenewalDate'] && this.storeData['formGroup'].typeB.controls['ContractRenewalDate'].value ? this.storeData['formGroup'].typeB.controls['ContractRenewalDate'].value : '';
        formdata['CreateRenewalInd'] = this.storeData['formGroup'].typeB.controls['CreateRenewalInd'] && this.storeData['formGroup'].typeB.controls['CreateRenewalInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['PaymentTypeCode'] = this.storeData['formGroup'].typeB.controls['PaymentTypeCode'] && this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].value ? this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].value : '';
        formdata['VADDBranchNumber'] = this.storeData['formGroup'].typeB.controls['VADDBranchNumber'] && this.storeData['formGroup'].typeB.controls['VADDBranchNumber'].value ? this.storeData['formGroup'].typeB.controls['VADDBranchNumber'].value : '';
        formdata['VADDMandateNumber'] = this.storeData['formGroup'].typeB.controls['VADDMandateNumber'] && this.storeData['formGroup'].typeB.controls['VADDMandateNumber'].value ? this.storeData['formGroup'].typeB.controls['VADDMandateNumber'].value : '';
        formdata['MandateNumberAccount'] = this.storeData['formGroup'].typeB.controls['MandateNumberAccount'] && this.storeData['formGroup'].typeB.controls['MandateNumberAccount'].value ? this.storeData['formGroup'].typeB.controls['MandateNumberAccount'].value : '';
        formdata['MandateDate'] = this.storeData['formGroup'].typeB.controls['MandateDate'] && this.storeData['formGroup'].typeB.controls['MandateDate'].value ? this.storeData['formGroup'].typeB.controls['MandateDate'].value : '';
        formdata['CompanyCode'] = this.storeData['formGroup'].typeC.controls['CompanyCode'] && this.storeData['formGroup'].typeC.controls['CompanyCode'].value ? this.storeData['formGroup'].typeC.controls['CompanyCode'].value : '';
        formdata['MinimumDurationCode'] = this.storeData['formGroup'].typeB.controls['MinimumDurationCode'] && this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].value ? this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].value : '';
        formdata['MinimumExpiryDate'] = this.storeData['formGroup'].typeB.controls['MinimumExpiryDate'] && this.storeData['formGroup'].typeB.controls['MinimumExpiryDate'].value ? this.storeData['formGroup'].typeB.controls['MinimumExpiryDate'].value : '';
        formdata['ContractSalesEmployee'] = this.storeData['formGroup'].typeC.controls['SalesEmployee'] && this.storeData['formGroup'].typeC.controls['SalesEmployee'].value ? this.storeData['formGroup'].typeC.controls['SalesEmployee'].value : '';
        formdata['ContractOwner'] = this.storeData['formGroup'].typeC.controls['ContractOwner'] && this.storeData['formGroup'].typeC.controls['ContractOwner'].value ? this.storeData['formGroup'].typeC.controls['ContractOwner'].value : '';
        formdata['CompanyVATNumber'] = this.storeData['formGroup'].typeC.controls['CompanyVatNumber'] && this.storeData['formGroup'].typeC.controls['CompanyVatNumber'].value ? this.storeData['formGroup'].typeC.controls['CompanyVatNumber'].value : '';
        formdata['CompanyVATNumber2'] = this.storeData['formGroup'].typeC.controls['CompanyVatNumber2'] && this.storeData['formGroup'].typeC.controls['CompanyVatNumber2'].value ? this.storeData['formGroup'].typeC.controls['CompanyVatNumber2'].value : '';
        formdata['CompanyRegistrationNumber'] = this.storeData['formGroup'].typeC.controls['CompanyRegistrationNumber'] && this.storeData['formGroup'].typeC.controls['CompanyRegistrationNumber'].value ? this.storeData['formGroup'].typeC.controls['CompanyRegistrationNumber'].value : '';
        formdata['InterCompanyPortfolioInd'] = this.storeData['formGroup'].typeC.controls['InterCompanyPortfolio'] && this.storeData['formGroup'].typeC.controls['InterCompanyPortfolio'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['LimitedCompanyInd'] = this.storeData['formGroup'].typeC.controls['LimitedCompany'] && this.storeData['formGroup'].typeC.controls['LimitedCompany'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['CallLogID'] = '';
        formdata['TrialPeriodInd'] = this.contractFormGroup.controls['TrialPeriodInd'] && this.contractFormGroup.controls['TrialPeriodInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['GroupAccountPriceGroupID'] = this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'] && this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value ? this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value : '';
        formdata['ContinuousInd'] = this.storeData['formGroup'].typeB.controls['ContinuousInd'] && this.storeData['formGroup'].typeB.controls['ContinuousInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['DisableList'] = this.otherParams['vDisableFields'];
        formdata['ReqAutoNumber'] = this.sysCharParams['vSCEnableAutoNumber'] ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        ;
        formdata['MandateRequired'] = this.otherParams['MandateRequired'] ? this.otherParams['MandateRequired'] : '';
        formdata['PaymentTypeWarning'] = this.contractFormGroup.controls['PaymentTypeWarning'] && this.contractFormGroup.controls['PaymentTypeWarning'].value ? this.contractFormGroup.controls['PaymentTypeWarning'].value : '';
        formdata['ProspectNumber'] = this.prospectNumber ? this.prospectNumber : '';
        formdata['BadDebtAccount'] = this.contractFormGroup.controls['BadDebtAccount'] && this.contractFormGroup.controls['BadDebtAccount'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['PaymentDueDay'] = this.storeData['formGroup'].typeB.controls['PaymentDueDay'] && this.storeData['formGroup'].typeB.controls['PaymentDueDay'].value ? this.storeData['formGroup'].typeB.controls['PaymentDueDay'].value : '';
        formdata['GroupAccountNumber'] = this.contractFormGroup.controls['GroupAccountNumber'] && this.contractFormGroup.controls['GroupAccountNumber'].value ? this.contractFormGroup.controls['GroupAccountNumber'].value : '';
        formdata['BankAccountNumber'] = this.storeData['formGroup'].typeB.controls['BankAccountNumber'] && this.storeData['formGroup'].typeB.controls['BankAccountNumber'].value ? this.storeData['formGroup'].typeB.controls['BankAccountNumber'].value : '';
        formdata['BankAccountSortCode'] = this.storeData['formGroup'].typeB.controls['BankAccountSortCode'] && this.storeData['formGroup'].typeB.controls['BankAccountSortCode'].value ? this.storeData['formGroup'].typeB.controls['BankAccountSortCode'].value : '';
        formdata['ContractTypeCode'] = this.inputParams.currentContractType;
        formdata['ContractAnnualValue'] = this.contractFormGroup.controls['ContractAnnualValue'] && this.contractFormGroup.controls['ContractAnnualValue'].value ? this.contractFormGroup.controls['ContractAnnualValue'].value : '';
        formdata['ContractCommenceDate'] = this.contractFormGroup.controls['ContractCommenceDate'] && this.contractFormGroup.controls['ContractCommenceDate'].value ? this.contractFormGroup.controls['ContractCommenceDate'].value : '';
        formdata['PortfolioStatusCode'] = this.contractFormGroup.controls['Status'] && this.contractFormGroup.controls['Status'].value ? this.contractFormGroup.controls['Status'].value : '';
        formdata['InactiveEffectDate'] = this.contractFormGroup.controls['InactiveEffectDate'] && this.contractFormGroup.controls['InactiveEffectDate'].value ? this.contractFormGroup.controls['InactiveEffectDate'].value : '';
        formdata['AnyPendingBelow'] = this.contractFormGroup.controls['AnyPendingBelow'] && this.contractFormGroup.controls['AnyPendingBelow'].value ? this.contractFormGroup.controls['AnyPendingBelow'].value : '';
        formdata['LostBusinessDesc'] = this.contractFormGroup.controls['LostBusinessDesc'] && this.contractFormGroup.controls['LostBusinessDesc'].value ? this.contractFormGroup.controls['LostBusinessDesc'].value : '';
        formdata['LostBusinessDesc2'] = this.contractFormGroup.controls['LostBusinessDesc2'] && this.contractFormGroup.controls['LostBusinessDesc2'].value ? this.contractFormGroup.controls['LostBusinessDesc2'].value : '';
        formdata['LostBusinessDesc3'] = this.contractFormGroup.controls['LostBusinessDesc3'] && this.contractFormGroup.controls['LostBusinessDesc3'].value ? this.contractFormGroup.controls['LostBusinessDesc3'].value : '';
        formdata['MoreThanOneContract'] = this.contractFormGroup.controls['MoreThanOneContract'] && this.contractFormGroup.controls['MoreThanOneContract'].value ? this.contractFormGroup.controls['MoreThanOneContract'].value : '';
        formdata['AccountBalance'] = this.contractFormGroup.controls['AccountBalance'] && this.contractFormGroup.controls['AccountBalance'].value ? this.contractFormGroup.controls['AccountBalance'].value : '';
        formdata['InvoiceFeeCode'] = this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'] && this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].value ? this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].value : '';
        formdata['VATExempt'] = this.storeData['formGroup'].typeB.controls['VATExempt'] && this.storeData['formGroup'].typeB.controls['VATExempt'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['InvoiceSuspendInd'] = this.storeData['formGroup'].typeB.controls['InvoiceSuspendInd'] && this.storeData['formGroup'].typeB.controls['InvoiceSuspendInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['InvoiceSuspendText'] = this.storeData['formGroup'].typeB.controls['InvoiceSuspendText'] && this.storeData['formGroup'].typeB.controls['InvoiceSuspendText'].value ? this.storeData['formGroup'].typeB.controls['InvoiceSuspendText'].value : '';
        formdata['HPRLExemptInd'] = this.storeData['formGroup'].typeB.controls['HPRLExemptInd'] && this.storeData['formGroup'].typeB.controls['HPRLExemptInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['VADDApproved'] = this.storeData['formGroup'].typeB.controls['VADDApproved'] && this.storeData['formGroup'].typeB.controls['VADDApproved'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
        formdata['ContractOwnerSurname'] = this.storeData['formGroup'].typeC.controls['ContractOwnerSurname'] && this.storeData['formGroup'].typeC.controls['ContractOwnerSurname'].value ? this.storeData['formGroup'].typeC.controls['ContractOwnerSurname'].value : '';
        if (this.storeData['formGroup'].typeD) {
            formdata['PromptPaymentInd'] = this.storeData['formGroup'].typeD.controls['PromptPaymentInd'] && this.storeData['formGroup'].typeD.controls['PromptPaymentInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
            formdata['PromptPaymentRate'] = this.storeData['formGroup'].typeD.controls['PromptPaymentRate'] && this.storeData['formGroup'].typeD.controls['PromptPaymentRate'].value ? this.storeData['formGroup'].typeD.controls['PromptPaymentRate'].value : '';
            formdata['PromptPaymentNarrative'] = this.storeData['formGroup'].typeD.controls['PromptPaymentNarrative'] && this.storeData['formGroup'].typeD.controls['PromptPaymentNarrative'].value ? this.storeData['formGroup'].typeD.controls['PromptPaymentNarrative'].value : '';
            formdata['RetrospectiveInd'] = this.storeData['formGroup'].typeD.controls['RetrospectiveInd'] && this.storeData['formGroup'].typeD.controls['RetrospectiveInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
            formdata['RetrospectiveRate'] = this.storeData['formGroup'].typeD.controls['RetrospectiveRate'] && this.storeData['formGroup'].typeD.controls['RetrospectiveRate'].value ? this.storeData['formGroup'].typeD.controls['RetrospectiveRate'].value : '';
            formdata['RetrospectiveNarrative'] = this.storeData['formGroup'].typeD.controls['RetrospectiveNarrative'] && this.storeData['formGroup'].typeD.controls['RetrospectiveNarrative'].value ? this.storeData['formGroup'].typeD.controls['RetrospectiveNarrative'].value : '';
        }
        if (this.storeData['formGroup'].typeE) {
            formdata['CICResponseSLA'] = this.storeData['formGroup'].typeE.controls['CICResponseSLA'] && this.storeData['formGroup'].typeE.controls['CICResponseSLA'].value ? this.storeData['formGroup'].typeE.controls['CICResponseSLA'].value : '';
            formdata['CIFirstSLAEscDays'] = this.storeData['formGroup'].typeE.controls['CIFirstSLAEscDays'] && this.storeData['formGroup'].typeE.controls['CIFirstSLAEscDays'].value ? this.storeData['formGroup'].typeE.controls['CIFirstSLAEscDays'].value : '';
            formdata['CISubSLAEscDays'] = this.storeData['formGroup'].typeE.controls['CISubSLAEscDays'] && this.storeData['formGroup'].typeE.controls['CISubSLAEscDays'].value ? this.storeData['formGroup'].typeE.controls['CISubSLAEscDays'].value : '';
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParamsContract.method, this.queryParamsContract.module, this.queryParamsContract.operation, this.queryContract, formdata).subscribe(function (e) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (e.status === GlobalConstant.Configuration.Failure) {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e.errorMessage) {
                    _this.errorService.emitError(e);
                }
                else {
                    if (e && (Object.keys(e).length === 0 && e.constructor === Object)) {
                        return false;
                    }
                    _this.contractFormGroup.controls['ContractNumber'].setValue(e.ContractNumber);
                    _this.contractFormGroup.controls['AccountNumber'].setValue(e.AccountNumber);
                    _this.contractFormGroup.controls['AccountName'].setValue(e.AccountName);
                    _this.contractFormGroup.controls['Status'].setValue(e.Status);
                    _this.storeData['data'].ContractNumber = e.ContractNumber;
                    _this.storeData['data'].AccountNumber = e.AccountNumber;
                    _this.storeData['data'].Status = e.Status;
                    _this.formPristine();
                    if (e.ContractNumber) {
                        _this.fetchContractData('', { ContractNumber: e.ContractNumber }).subscribe(function (data) {
                            if (data['status'] === GlobalConstant.Configuration.Failure) {
                                _this.errorService.emitError(data['oResponse']);
                            }
                            else {
                                if (!data['errorMessage']) {
                                    _this.store.dispatch({ type: ContractActionTypes.SAVE_DATA, payload: data });
                                    if (_this.sysCharParams['vSCEnableMarktSelect']) {
                                        _this.promptTitle = MessageConstant.Message.SaveContractAddressAsAccountAddress;
                                        _this.promptModal.show();
                                    }
                                    else {
                                        _this.navigateToPremise = true;
                                        _this.setDataForPremise();
                                        _this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
                                            queryParams: {
                                                parentMode: 'Contract-Add',
                                                ContractNumber: _this.contractFormGroup.controls['ContractNumber'].value,
                                                ContractName: _this.contractFormGroup.controls['ContractName'].value,
                                                AccountNumber: _this.contractFormGroup.controls['AccountNumber'].value,
                                                AccountName: _this.contractFormGroup.controls['AccountName'].value,
                                                contractTypeCode: _this.inputParams.currentContractType
                                            }
                                        });
                                    }
                                }
                                _this.lookUpFields();
                            }
                        }, function (error) {
                            _this.errorService.emitError({
                                errorMessage: error['errorMessage'] || ErrorConstant.Message.UnexpectedError,
                                fullError: error['fullError']
                            });
                        });
                    }
                }
                _this.tabsError = {
                    tabA: false,
                    tabB: false,
                    tabC: false,
                    tabD: false,
                    tabE: false
                };
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    ContractMaintenanceComponent.prototype.lookUpFields = function () {
        var _this = this;
        var dataReg = [
            {
                'table': 'Account',
                'query': { 'BusinessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode(), 'AccountNumber': this.contractFormGroup.controls['AccountNumber'] ? this.contractFormGroup.controls['AccountNumber'].value : '' },
                'fields': ['AccountName', 'AccountNumber', 'NationalAccount', 'AccountBalance']
            },
            {
                'table': 'SystemInvoiceFrequency',
                'query': { 'InvoiceFrequencyCode': this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'] ? this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].value : '' },
                'fields': ['InvoiceFrequencyCode', 'InvoiceFrequencyDesc']
            },
            {
                'table': 'InvoiceFee',
                'query': { 'InvoiceFeeCode': this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'] ? this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].value : '' },
                'fields': ['InvoiceFeeDesc']
            },
            {
                'table': 'PaymentType',
                'query': { 'PaymentTypeCode': this.storeData['formGroup'].typeB.controls['PaymentTypeCode'] ? this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].value : '' },
                'fields': ['PaymentDesc']
            },
            {
                'table': 'Employee',
                'query': { 'EmployeeCode': this.storeData['formGroup'].typeC.controls['SalesEmployee'] ? this.storeData['formGroup'].typeC.controls['SalesEmployee'].value : '' },
                'fields': ['EmployeeSurname']
            },
            {
                'table': 'GroupAccountPriceGroup',
                'query': {
                    'GroupAccountPriceGroupID': this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'] ? this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value : '',
                    'GroupAccountNumber': this.storeData['formGroup'].main.controls['GroupAccountNumber'].value
                },
                'fields': ['GroupAccountPriceGroupDesc']
            }];
        Observable.forkJoin(this.lookUpRecord(dataReg, 100)).subscribe(function (data) {
            if (data[0] && !data[0]['errorMessage']) {
                if (data[0]['results'] && data[0]['results'][0].length > 0) {
                    if (data[0]['results'][0][0].NationalAccount) {
                        if (data[0]['results'][0][0].NationalAccount === true || data[0]['results'][0][0].NationalAccount.toString().toUpperCase() === GlobalConstant.Configuration.Yes) {
                            _this.isNationalAccount = true;
                        }
                        else {
                            _this.isNationalAccount = false;
                        }
                    }
                    else {
                        _this.isNationalAccount = false;
                    }
                    _this.contractFormGroup.controls['AccountBalance'].setValue(data[0]['results'][0][0].AccountBalance);
                    _this.contractFormGroup.controls['AccountName'].setValue(data[0]['results'][0][0].AccountName);
                }
                if (data[0]['results'] && data[0]['results'][1].length > 0) {
                    if (data[0]['results'][1][0]) {
                        _this.storeData['formGroup'].typeB.controls['InvoiceFrequencyDesc'].setValue(data[0]['results'][1][0]['InvoiceFrequencyDesc']);
                    }
                }
                if (data[0]['results'] && data[0]['results'][2].length > 0) {
                    if (data[0]['results'][2][0]) {
                        _this.storeData['formGroup'].typeB.controls['InvoiceFeeDesc'].setValue(data[0]['results'][2][0]['InvoiceFeeDesc']);
                    }
                }
                if (data[0]['results'] && data[0]['results'][3].length > 0) {
                    if (data[0]['results'][3][0]) {
                        _this.storeData['formGroup'].typeB.controls['PaymentDesc'].setValue(data[0]['results'][3][0]['PaymentDesc']);
                    }
                }
                if (data[0]['results'] && data[0]['results'][4].length > 0) {
                    if (data[0]['results'][4][0]) {
                        _this.storeData['formGroup'].typeC.controls['SalesEmployeeSurname'].setValue(data[0]['results'][4][0]['EmployeeSurname']);
                    }
                }
                if (data[0]['results'] && data[0]['results'][5].length > 0) {
                    if (data[0]['results'][5][0]) {
                        _this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupDesc'].setValue(data[0]['results'][5][0]['GroupAccountPriceGroupDesc']);
                    }
                }
            }
        });
    };
    ContractMaintenanceComponent.prototype.setDataForPremise = function () {
        var data = new NavData();
        data.setPageId(PageIdentifier.ICABSACONTRACTMAINTENANCE);
        data.setBackRoute(this.currentRouteUrl);
        data.setFormData(Object.assign({}, this.storeData['formGroup'].main.getRawValue(), this.storeData['formGroup'].typeA.getRawValue(), this.storeData['formGroup'].typeB.getRawValue(), this.storeData['formGroup'].typeC.getRawValue(), this.storeData['formGroup'].typeD ? this.storeData['formGroup'].typeD.getRawValue() : {}, this.storeData['formGroup'].typeE ? this.storeData['formGroup'].typeE.getRawValue() : {}));
        this.riExchange.pushInNavigationData(data);
    };
    ContractMaintenanceComponent.prototype.riMaintenanceBeforeAdd = function () {
        if (this.sysCharParams['vSCMultiContactInd']) {
            this.storeData['fieldVisibility'].typeA.btnAmendContact = false;
        }
        if (this.sysCharParams['vSCEnableTrialPeriodServices'] === true) {
        }
        else {
            this.displayList.trialPeriodInd = false;
        }
        this.storeData['fieldRequired'].typeA.countryCode = true;
        this.storeData['fieldRequired'].typeB.invoiceFrequencyCode = true;
        this.storeData['fieldRequired'].typeB.advanceInvoiceInd = true;
        this.storeData['fieldRequired'].typeB.advanceInvoiceInd = true;
        if (this.storeData['params']['currentContractType'] === 'C') {
            this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].setValidators(Validators.required);
            this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].setValidators(Validators.required);
        }
        this.storeData['fieldRequired'].typeB.minimumDurationCode = true;
        this.storeData['fieldRequired'].typeB.minimumExpiryDate = true;
        this.storeData['fieldRequired'].typeB.paymentTypeCode = true;
    };
    ContractMaintenanceComponent.prototype.riMaintenanceBeforeSaveAdd = function () {
        var _this = this;
        if (this.contractFormGroup.controls['TrialPeriodInd'] && this.contractFormGroup.controls['TrialPeriodInd'].value === true) {
            this.storeData['fieldRequired'].typeA.countryCode = false;
            this.storeData['fieldRequired'].typeB.advanceInvoiceInd = false;
            this.storeData['fieldRequired'].typeB.invoiceFrequencyCode = false;
            this.storeData['fieldRequired'].typeB.minimumDurationCode = false;
            this.storeData['fieldRequired'].typeB.minimumExpiryDate = false;
            this.storeData['fieldRequired'].typeB.paymentTypeCode = false;
            this.storeData['fieldRequired'].typeC.noticePeriod = false;
            this.storeData['formGroup'].typeB.controls['AdvanceInvoiceInd'].clearValidators();
            this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].clearValidators();
            this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].clearValidators();
            this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].clearValidators();
            this.storeData['formGroup'].typeC.controls['NoticePeriod'].clearValidators();
            this.storeData['formGroup'].typeB.updateValueAndValidity();
            this.storeData['formGroup'].typeC.updateValueAndValidity();
        }
        else {
            this.storeData['fieldRequired'].typeA.countryCode = true;
            this.storeData['fieldRequired'].typeB.advanceInvoiceInd = true;
            this.storeData['fieldRequired'].typeB.invoiceFrequencyCode = true;
            this.storeData['fieldRequired'].typeB.minimumDurationCode = true;
            this.storeData['fieldRequired'].typeB.minimumExpiryDate = true;
            if (this.sysCharParams['vSCEnablePayTypeAtInvGroupLevel']) {
                if (this.contractFormGroup.controls['AccountNumber'] && (this.contractFormGroup.controls['AccountNumber'].value === '' || this.contractFormGroup.controls['AccountNumber'].value === null || this.contractFormGroup.controls['AccountNumber'].value === undefined)) {
                    this.storeData['fieldRequired'].typeB.paymentTypeCode = true;
                    this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].setValidators(Validators.required);
                }
                else {
                    this.storeData['fieldRequired'].typeB.paymentTypeCode = false;
                    this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].clearValidators();
                }
            }
            else {
                this.storeData['fieldRequired'].typeB.paymentTypeCode = true;
                this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].setValidators(Validators.required);
            }
            this.storeData['fieldRequired'].typeC.noticePeriod = false;
            this.storeData['formGroup'].typeB.controls['AdvanceInvoiceInd'].setValidators(Validators.required);
            this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].setValidators(Validators.required);
            this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].setValidators(Validators.required);
            this.storeData['formGroup'].typeB.updateValueAndValidity();
            this.storeData['formGroup'].typeC.updateValueAndValidity();
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        Observable.forkJoin(this.fetchContractData('WarnCommenceDate', {
            action: '6',
            ContractCommenceDate: this.commenceDateDisplay
        }), this.fetchContractData('CheckPostcode', {
            action: '6',
            ContractName: this.contractFormGroup.controls['ContractName'] && this.contractFormGroup.controls['ContractName'] !== undefined ? this.contractFormGroup.controls['ContractName'].value : '',
            ContractAddressLine1: this.storeData['formGroup'].typeA.controls['ContractAddressLine1'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine1'].value !== undefined && this.storeData['formGroup'].typeA.controls['ContractAddressLine1'].value !== '' ? this.storeData['formGroup'].typeA.controls['ContractAddressLine1'].value : null,
            ContractAddressLine2: this.storeData['formGroup'].typeA.controls['ContractAddressLine2'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine2'].value !== undefined && this.storeData['formGroup'].typeA.controls['ContractAddressLine2'].value !== '' ? this.storeData['formGroup'].typeA.controls['ContractAddressLine2'].value : null,
            ContractAddressLine3: this.storeData['formGroup'].typeA.controls['ContractAddressLine3'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine3'].value !== undefined && this.storeData['formGroup'].typeA.controls['ContractAddressLine3'].value !== '' ? this.storeData['formGroup'].typeA.controls['ContractAddressLine3'].value : null,
            ContractAddressLine4: this.storeData['formGroup'].typeA.controls['ContractAddressLine4'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== undefined && this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== '' ? this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value : null,
            ContractAddressLine5: this.storeData['formGroup'].typeA.controls['ContractAddressLine5'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== undefined && this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== '' ? this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value : null,
            ContractPostcode: this.storeData['formGroup'].typeA.controls['ContractPostcode'] && this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== undefined && this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== '' ? this.storeData['formGroup'].typeA.controls['ContractPostcode'].value : null
        }), this.fetchContractData('CheckPostcodeNegBranch', {
            action: '6',
            NegBranchNumber: this.contractFormGroup.controls['NegBranchNumber'] && this.contractFormGroup.controls['NegBranchNumber'].value !== undefined ? this.contractFormGroup.controls['NegBranchNumber'].value : '',
            ContractAddressLine4: this.storeData['formGroup'].typeA.controls['ContractAddressLine4'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value : '',
            ContractAddressLine5: this.storeData['formGroup'].typeA.controls['ContractAddressLine5'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value : '',
            ContractPostcode: this.storeData['formGroup'].typeA.controls['ContractPostcode'] && this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractPostcode'].value : ''
        }), this.fetchContractData('WarnPostcode', {
            action: '6',
            NegBranchNumber: this.contractFormGroup.controls['NegBranchNumber'] && this.contractFormGroup.controls['NegBranchNumber'].value !== undefined ? this.contractFormGroup.controls['NegBranchNumber'].value : '',
            AccountNumber: this.contractFormGroup.controls['AccountNumber'] && this.contractFormGroup.controls['AccountNumber'].value !== undefined ? this.contractFormGroup.controls['AccountNumber'].value : '',
            ContractTypeCode: this.storeData['params'] && this.storeData['params']['currentContractType'] !== undefined ? this.storeData['params']['currentContractType'] : ''
        }), this.fetchContractData('CheckNatAcc', {
            action: '6',
            NegBranchNumber: this.contractFormGroup.controls['NegBranchNumber'] && this.contractFormGroup.controls['NegBranchNumber'].value !== undefined ? this.contractFormGroup.controls['NegBranchNumber'].value : '',
            AccountNumber: this.contractFormGroup.controls['AccountNumber'] && this.contractFormGroup.controls['AccountNumber'].value !== undefined ? this.contractFormGroup.controls['AccountNumber'].value : '',
            ContractTypeCode: this.storeData['params'] && this.storeData['params']['currentContractType'] !== undefined ? this.storeData['params']['currentContractType'] : ''
        })).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            var errorDesc = [];
            var errorInAjax = {
                ajax1: false,
                ajax2: false,
                ajax3: false,
                ajax4: false,
                ajax5: false
            };
            if (data[0]['status'] && data[0]['status'].toUpperCase() === ErrorConstant.Message.Failure) {
                _this.errorService.emitError(data[0]['oResponse']);
                return;
            }
            if (data[1]['status'] && data[1]['status'].toUpperCase() === ErrorConstant.Message.Failure) {
                _this.errorService.emitError(data[1]['oResponse']);
                return;
            }
            if (data[2]['status'] && data[2]['status'].toUpperCase() === ErrorConstant.Message.Failure) {
                _this.errorService.emitError(data[2]['oResponse']);
                return;
            }
            if (data[3]['status'] && data[3]['status'].toUpperCase() === ErrorConstant.Message.Failure) {
                _this.errorService.emitError(data[3]['oResponse']);
                return;
            }
            if (data[4]['status'] && data[4]['status'].toUpperCase() === ErrorConstant.Message.Failure) {
                _this.errorService.emitError(data[4]['oResponse']);
                return;
            }
            if (data[0]['ErrorMessageDesc'] && data[0]['ErrorMessageDesc'] !== '') {
                errorDesc.push(data[0]['ErrorMessageDesc']);
                errorInAjax['ajax1'] = true;
            }
            else if (data[0]['fullError'] && data[0]['fullError'] !== '') {
                errorDesc.push(data[0]['errorMessage'] || data[0]['fullError']);
            }
            if (_this.contractFormGroup.controls['AccountNumber'].value !== '') {
                if (data[1]['ErrorMessageDesc'] && data[1]['ErrorMessageDesc'] !== '') {
                    if (_this.sysCharParams['vSCPostCodeMustExistInPAF'] && (_this.sysCharParams['vSCEnableHopewiserPAF'] || _this.sysCharParams['vSCEnableDatabasePAF']) && _this.storeData['formGroup'].typeA.controls['ContractAddressLine1'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractAddressLine3'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== '') {
                        errorDesc.push(data[1]['ErrorMessageDesc']);
                        errorInAjax['ajax2'] = true;
                    }
                }
                else if (data[1]['fullError'] && data[1]['fullError'] !== '') {
                    if (_this.sysCharParams['vSCPostCodeMustExistInPAF'] && (_this.sysCharParams['vSCEnableHopewiserPAF'] || _this.sysCharParams['vSCEnableDatabasePAF']) && _this.storeData['formGroup'].typeA.controls['ContractAddressLine1'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractAddressLine3'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== '') {
                        errorDesc.push(data[1]['errorMessage'] || data[1]['fullError']);
                        errorInAjax['ajax2'] = true;
                    }
                }
                if (data[2]['ErrorMessageDesc'] && data[2]['ErrorMessageDesc'] !== '') {
                    if (_this.sysCharParams['vEnablePostcodeDefaulting'] && _this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== '') {
                        errorDesc.push(data[2]['ErrorMessageDesc']);
                        errorInAjax['ajax3'] = true;
                    }
                }
                else if (data[2]['fullError'] && data[2]['fullError'] !== '') {
                    if (_this.sysCharParams['vEnablePostcodeDefaulting'] && _this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== '') {
                        errorDesc.push(data[2]['errorMessage'] || data[2]['fullError']);
                        errorInAjax['ajax3'] = true;
                    }
                }
                if (data[3]['ErrorMessageDesc'] && data[3]['ErrorMessageDesc'] !== '') {
                    errorDesc.push(data[3]['ErrorMessageDesc']);
                    errorInAjax['ajax4'] = true;
                }
                else if (data[3]['fullError'] && data[3]['fullError'] !== '') {
                    errorDesc.push(data[3]['errorMessage'] || data[3]['fullError']);
                    errorInAjax['ajax4'] = true;
                }
                if (data[4]['ErrorMessageDesc'] && data[4]['ErrorMessageDesc'] !== '') {
                    errorDesc.push(data[4]['ErrorMessageDesc']);
                    errorInAjax['ajax5'] = true;
                }
                else if (data[4]['fullError'] && data[4]['fullError'] !== '') {
                    errorDesc.push(data[4]['errorMessage'] || data[4]['fullError']);
                    errorInAjax['ajax5'] = true;
                }
            }
            else {
                if (data[1]['ErrorMessageDesc'] && data[1]['ErrorMessageDesc'] !== '') {
                    if (_this.sysCharParams['vSCPostCodeMustExistInPAF'] && (_this.sysCharParams['vSCEnableHopewiserPAF'] || _this.sysCharParams['vSCEnableDatabasePAF']) && _this.storeData['formGroup'].typeA.controls['ContractAddressLine1'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractAddressLine3'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== '') {
                        errorDesc.push(data[1]['ErrorMessageDesc']);
                        errorInAjax['ajax2'] = true;
                    }
                }
                else if (data[1]['fullError'] && data[1]['fullError'] !== '') {
                    if (_this.sysCharParams['vSCPostCodeMustExistInPAF'] && (_this.sysCharParams['vSCEnableHopewiserPAF'] || _this.sysCharParams['vSCEnableDatabasePAF']) && _this.storeData['formGroup'].typeA.controls['ContractAddressLine1'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractAddressLine3'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== '') {
                        errorDesc.push(data[1]['errorMessage'] || data[1]['fullError']);
                        errorInAjax['ajax2'] = true;
                    }
                }
                if (data[2]['ErrorMessageDesc'] && data[2]['ErrorMessageDesc'] !== '') {
                    if (_this.sysCharParams['vEnablePostcodeDefaulting'] && _this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== '') {
                        errorDesc.push(data[2]['ErrorMessageDesc']);
                        errorInAjax['ajax3'] = true;
                    }
                }
                else if (data[2]['fullError'] && data[2]['fullError'] !== '') {
                    if (_this.sysCharParams['vEnablePostcodeDefaulting'] && _this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== '' && _this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== '') {
                        errorDesc.push(data[2]['errorMessage'] || data[2]['fullError']);
                        errorInAjax['ajax3'] = true;
                    }
                }
            }
            if (_this.dataEventCheckPostcodeNegBranch) {
                _this.dataEventCheckPostcodeNegBranch.unsubscribe();
            }
            if (_this.dataEventCheckPostcode) {
                _this.dataEventCheckPostcode.unsubscribe();
            }
            if (_this.dataEventWarnPostcode) {
                _this.dataEventWarnPostcode.unsubscribe();
            }
            if (_this.dataEventCheckNatAcc) {
                _this.dataEventCheckNatAcc.unsubscribe();
            }
            if (errorDesc && errorDesc.length > 0) {
                _this.errorService.emitError({
                    errorMessage: errorDesc
                });
                _this.beforeSave = true;
                _this.shiftTop = true;
            }
            else {
                _this.shiftTop = false;
            }
            _this.promptConfirmModal.show();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError({
                errorMessage: error['errorMessage'] || ErrorConstant.Message.UnexpectedError,
                fullError: error['fullError']
            });
            return;
        });
    };
    ContractMaintenanceComponent.prototype.errorModalClose = function () {
        this.beforeSave = false;
    };
    ContractMaintenanceComponent.prototype.riMaintenanceBeforeSaveUpdate = function () {
        var _this = this;
        if (this.contractFormGroup.controls['TrialPeriodInd'] && this.contractFormGroup.controls['TrialPeriodInd'].value) {
            this.otherParams['vSaveUpdate'] = true;
        }
        this.onTrialPeriodIndChange({});
        var errorDesc = [];
        this.ajaxSource.next(this.ajaxconstant.START);
        Observable.forkJoin(this.fetchContractData('CheckPostcodeNegBranch', {
            action: '6',
            NegBranchNumber: this.contractFormGroup.controls['NegBranchNumber'] && this.contractFormGroup.controls['NegBranchNumber'].value !== undefined ? this.contractFormGroup.controls['NegBranchNumber'].value : '',
            ContractAddressLine4: this.storeData['formGroup'].typeA.controls['ContractAddressLine4'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value : '',
            ContractAddressLine5: this.storeData['formGroup'].typeA.controls['ContractAddressLine5'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value : '',
            ContractPostcode: this.storeData['formGroup'].typeA.controls['ContractPostcode'] && this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractPostcode'].value : ''
        }), this.fetchContractData('WarnMandateRef', {
            action: '6',
            ContractNumber: this.contractFormGroup.controls['ContractNumber'] && this.contractFormGroup.controls['ContractNumber'].value !== undefined ? this.contractFormGroup.controls['ContractNumber'].value : '',
            CompanyCode: this.storeData['formGroup'].typeC.controls['CompanyCode'] && this.storeData['formGroup'].typeC.controls['CompanyCode'].value !== undefined ? this.storeData['formGroup'].typeC.controls['CompanyCode'].value : ''
        })).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (_this.sysCharParams['vEnablePostcodeDefaulting']) {
                if (data[0]['status'] && data[0]['status'].toUpperCase() === ErrorConstant.Message.Failure) {
                    _this.errorService.emitError(data[0]['oResponse']);
                    return;
                }
                if (data[0]['ErrorMessageDesc'] && data[0]['ErrorMessageDesc'] !== '') {
                    if (_this.sysCharParams['vEnablePostcodeDefaulting']) {
                        errorDesc.push(data[0]['ErrorMessageDesc']);
                    }
                }
            }
            if (_this.sysCharParams['vSCEnableBankDetailEntry'] && _this.sysCharParams['vSCEnableSEPAFinanceMandate'] && !_this.sysCharParams['vSCEnableSEPAFinanceMandateLog']) {
                if (data[1]['status'] && data[1]['status'].toUpperCase() === ErrorConstant.Message.Failure) {
                    _this.errorService.emitError(data[1]['oResponse']);
                    return;
                }
                if (data[1]['ErrorMessageDesc'] && data[1]['ErrorMessageDesc'] !== '') {
                    if (_this.sysCharParams['vSCEnableBankDetailEntry'] && _this.sysCharParams['vSCEnableSEPAFinanceMandate'] && !_this.sysCharParams['vSCEnableSEPAFinanceMandateLog']) {
                        errorDesc.push(data[1]['ErrorMessageDesc']);
                    }
                }
                else if (data[1]['fullError'] && data[1]['fullError'] !== '') {
                    if (_this.sysCharParams['vSCEnableBankDetailEntry'] && _this.sysCharParams['vSCEnableSEPAFinanceMandate'] && !_this.sysCharParams['vSCEnableSEPAFinanceMandateLog']) {
                        errorDesc.push(data[1]['errorMessage'] || data[1]['fullError']);
                    }
                }
            }
            if (errorDesc && errorDesc.length > 0) {
                _this.errorService.emitError({
                    errorMessage: errorDesc
                });
                _this.beforeSave = true;
                _this.shiftTop = true;
            }
            else {
                _this.shiftTop = false;
            }
            _this.promptConfirmModal.show();
            if (_this.dataEventCheckPostcodeNegBranch) {
                _this.dataEventCheckPostcodeNegBranch.unsubscribe();
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError({
                errorMessage: error['errorMessage'] || ErrorConstant.Message.UnexpectedError,
                fullError: error['fullError']
            });
            return;
        });
    };
    ContractMaintenanceComponent.prototype.riMaintenanceAfterSaveAdd = function () {
    };
    ContractMaintenanceComponent.prototype.riMaintenanceAfterSave = function () {
        if (this.sysCharParams['vSCMultiContactInd']) {
            this.storeData['fieldVisibility'].typeA.btnAmendContact = false;
        }
        if (this.sysCharParams['vSCEnableMarktSelect']) {
            this.promptTitle = MessageConstant.Message.SaveContractAddressAsAccountAddress;
            this.promptModal.show();
        }
        if (this.otherParams['blnCIEnabled']) {
            this.store.dispatch({
                type: ContractActionTypes.AFTER_SAVE, payload: {}
            });
        }
    };
    ContractMaintenanceComponent.prototype.afterFetch = function () {
        if (this.sysCharParams['vSCMultiContactInd']) {
            this.storeData['fieldVisibility'].typeA.btnAmendContact = true;
        }
        if (this.contractFormGroup.controls['ContractNumber'].value !== '') {
            if (this.inactiveEffectDateDisplay !== '') {
                this.displayList.inactiveEffectDate = true;
                if (this.contractFormGroup.controls['LostBusinessDesc'] && this.contractFormGroup.controls['LostBusinessDesc'].value !== '') {
                    this.displayList.lostBusinessDesc1 = true;
                }
            }
            else {
                this.displayList.inactiveEffectDate = false;
            }
            if (this.contractFormGroup.controls['AnyPendingBelow'] && this.contractFormGroup.controls['AnyPendingBelow'].value !== '') {
                this.displayList.anyPendingBelow = true;
            }
            else {
                this.displayList.anyPendingBelow = false;
            }
        }
        else {
            this.storeData['fieldVisibility'].typeB.apiExemptInd = false;
        }
        if (!this.sysCharParams['glAllowUserAuthView']) {
            this.displayList.contractAnnualValue = false;
        }
        else {
            this.displayList.contractAnnualValue = true;
        }
        if (this.otherParams['ReqAutoInvoiceFee'] && this.storeData['params']['currentContractType'] === 'C' && this.storeData['mode'].addMode) {
            this.storeData['fieldVisibility'].typeB.invoiceFeeCode = true;
            this.storeData['fieldRequired'].typeB.invoiceFeeCode = true;
            if (this.storeData['formGroup'].typeB.controls['InvoiceFeeCode']) {
                this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].setValidators(Validators.required);
            }
        }
        else {
            this.storeData['fieldVisibility'].typeB.invoiceFeeCode = false;
            this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].clearValidators();
        }
        this.storeData['formGroup'].typeB.updateValueAndValidity();
        if (this.contractFormGroup.controls['ContractHasExpired'] && this.contractFormGroup.controls['ContractHasExpired'].value && this.contractFormGroup.controls['ContractHasExpired'].value.toString().toUpperCase() === GlobalConstant.Configuration.Yes) {
            this.displayList.expired = true;
        }
        else {
            this.displayList.expired = false;
        }
        if (this.sysCharParams['vSCEnablePayTypeAtInvGroupLevel']) {
            this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].clearValidators();
            this.storeData['fieldVisibility'].typeB.paymentTypeCode = false;
            this.storeData['fieldRequired'].typeB.paymentTypeCode = false;
        }
    };
    ContractMaintenanceComponent.prototype.promptCancel = function (event) {
        if (this.addMode)
            this.navigateToPremiseMaintenance();
    };
    ContractMaintenanceComponent.prototype.promptSave = function (event) {
        var _this = this;
        var formdata = {
            AccountNumber: this.contractFormGroup.controls['AccountNumber'] ? this.contractFormGroup.controls['AccountNumber'].value : '',
            ContractAddressLine1: this.storeData['formGroup'].typeA.controls['ContractAddressLine1'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine1'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractAddressLine1'].value : '',
            ContractAddressLine2: this.storeData['formGroup'].typeA.controls['ContractAddressLine2'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine2'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractAddressLine2'].value : '',
            ContractAddressLine3: this.storeData['formGroup'].typeA.controls['ContractAddressLine3'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine3'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractAddressLine3'].value : '',
            ContractAddressLine4: this.storeData['formGroup'].typeA.controls['ContractAddressLine4'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value : '',
            ContractAddressLine5: this.storeData['formGroup'].typeA.controls['ContractAddressLine5'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value : '',
            ContractPostcode: this.storeData['formGroup'].typeA.controls['ContractPostcode'] && this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractPostcode'].value : '',
            CountryCode: this.storeData['formGroup'].typeA.controls['CountryCode'] && this.storeData['formGroup'].typeA.controls['CountryCode'].value !== undefined ? this.storeData['formGroup'].typeA.controls['CountryCode'].value : '',
            Function: 'UpdateAccountAddress'
        };
        this.queryContract = new URLSearchParams();
        this.queryContract.set(this.serviceConstants.BusinessCode, this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
        this.queryContract.set(this.serviceConstants.CountryCode, this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
        this.queryContract.set(this.serviceConstants.Action, '6');
        this.httpService.makePostRequest(this.queryParamsContract.method, this.queryParamsContract.module, this.queryParamsContract.operation, this.queryContract, formdata).subscribe(function (e) {
            if (e.status === GlobalConstant.Configuration.Failure) {
                _this.errorService.emitError(e.oResponse);
                if (_this.addMode)
                    _this.navigateToPremiseMaintenance();
            }
            else {
                if (e['errorMessage']) {
                    _this.errorService.emitError(e);
                    if (_this.addMode)
                        _this.navigateToPremiseMaintenance();
                    return;
                }
                else {
                    if (_this.addMode)
                        _this.navigateToPremiseMaintenance();
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
            if (_this.addMode)
                _this.navigateToPremiseMaintenance();
        });
    };
    ContractMaintenanceComponent.prototype.navigateToPremiseMaintenance = function () {
        this.navigateToPremise = true;
        this.setDataForPremise();
        this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
            queryParams: {
                parentMode: 'Contract-Add',
                ContractNumber: this.contractFormGroup.controls['ContractNumber'].value,
                ContractName: this.contractFormGroup.controls['ContractName'].value,
                AccountNumber: this.contractFormGroup.controls['AccountNumber'].value,
                AccountName: this.contractFormGroup.controls['AccountName'].value,
                contractTypeCode: this.inputParams.currentContractType
            }
        });
    };
    ContractMaintenanceComponent.prototype.promptConfirmSave = function (event) {
        if (this.addMode) {
            this.addContract();
        }
        else if (this.updateMode) {
            this.updateContract();
        }
    };
    ContractMaintenanceComponent.prototype.onContractDataReceived = function (data, route, mode) {
        var _this = this;
        var dataObj = {
            data: data
        };
        if (this.isCopyClicked) {
            this.updateMode = false;
            this.addMode = true;
            this.searchMode = false;
            this.autoOpenSearch = false;
            this.store.dispatch({
                type: ContractActionTypes.FORM_GROUP, payload: {
                    main: this.contractFormGroup
                }
            });
            data['isCopyClicked'] = true;
            this.setFormData(dataObj);
            this.store.dispatch({ type: ContractActionTypes.SAVE_DATA, payload: data });
            this.contractSearchParams['business'] = '';
            this.contractSearchParams['country'] = '';
            this.ajaxSource.next(this.ajaxconstant.START);
            this.fetchContractData('', { ContractNumber: dataObj['data'].ContractNumber }).subscribe(function (data) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                if (data['status'] === GlobalConstant.Configuration.Failure) {
                    _this.errorService.emitError(data['oResponse']);
                }
                else {
                    if (data['errorMessage']) {
                        _this.errorService.emitError({
                            errorMessage: data['errorMessage'] || ErrorConstant.Message.UnexpectedError,
                            fullError: data['fullError']
                        });
                    }
                    else {
                        data['isCopyClicked'] = true;
                        _this.onAccountBlur({});
                        _this.store.dispatch({ type: ContractActionTypes.SAVE_DATA, payload: data });
                        _this.contractFormGroup.controls['ContractNumber'].setValue('');
                        _this.store.dispatch({ type: ContractActionTypes.LOOKUP, payload: data });
                    }
                }
                setTimeout(function () {
                    _this.isCopyClicked = false;
                }, 0);
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.errorService.emitError({
                    errorMessage: error['errorMessage'] || ErrorConstant.Message.UnexpectedError,
                    fullError: error['fullError']
                });
                setTimeout(function () {
                    _this.isCopyClicked = false;
                }, 0);
            });
            return;
        }
        this.updateMode = true;
        this.addMode = false;
        this.searchMode = false;
        this.autoOpenSearch = false;
        this.store.dispatch({
            type: ContractActionTypes.FORM_GROUP, payload: {
                main: this.contractFormGroup
            }
        });
        this.contractSearchParams['business'] = '';
        this.contractSearchParams['country'] = '';
        this.setDefaultFormState();
        this.setFormData(dataObj);
        this.store.dispatch({ type: ContractActionTypes.SAVE_DATA, payload: data });
        var userCode = this.authService.getSavedUserCode();
        var dataReg = [{
                'table': 'riRegistry',
                'query': { 'RegSection': 'Contact Person' },
                'fields': ['RegSection']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': 'Contact Centre Review', 'RegKey': this.storeData['code'].business + '_' + 'System Default Review From Drill Option' },
                'fields': ['RegSection', 'RegValue']
            },
            {
                'table': 'CIParams',
                'query': { 'BusinessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode() },
                'fields': ['BusinessCode', 'CIEnabled']
            },
            {
                'table': 'Account',
                'query': { 'BusinessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode(), 'AccountNumber': this.contractFormGroup.controls['AccountNumber'] ? this.contractFormGroup.controls['AccountNumber'].value : '' },
                'fields': ['AccountName', 'AccountNumber', 'NationalAccount', 'AccountBalance']
            },
            {
                'table': 'Branch',
                'query': { 'BusinessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode() },
                'fields': ['BranchNumber', 'BranchName', 'EnablePostCodeDefaulting']
            },
            {
                'table': 'UserAuthorityBranch',
                'query': { 'UserCode': userCode.UserCode, 'BusinessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode(), 'DefaultBranchInd': 'true' },
                'fields': ['BranchNumber', 'DefaultBranchInd', 'CurrentBranchInd']
            }];
        this.ajaxSource.next(this.ajaxconstant.START);
        Observable.forkJoin(this.triggerFetchSysChar(false, true), this.lookUpRecord(dataReg, 100), this.fetchContractData('', { ContractNumber: dataObj['data'].ContractNumber })).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data[0]['errorMessage']) {
                _this.errorService.emitError({
                    errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
                });
            }
            if (!data[0]['records']) {
                _this.errorService.emitError({
                    errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
                });
                return;
            }
            _this.onSysCharDataReceive(data[0]);
            if (data[1]['results'] && data[1]['results'].length > 0) {
                if (data[1]['results'][0].length > 0 && data[1]['results'][0][0]) {
                    _this.sysCharParams['vSCMultiContactInd'] = true;
                }
                else {
                    _this.sysCharParams['vSCMultiContactInd'] = false;
                }
                _this.buildMenuOptions();
                if (data[1]['results'][1].length > 0 && data[1]['results'][1][0]) {
                    _this.sysCharParams['gcREGContactCentreReview'] = data[1]['results'][1][0].RegValue;
                    if (_this.sysCharParams['gcREGContactCentreReview'] === 'Y') {
                        _this.otherParams['lREGContactCentreReview'] = true;
                    }
                    else {
                        _this.otherParams['lREGContactCentreReview'] = false;
                    }
                }
                if (data[1]['results'][2].length > 0) {
                    var tabs = void 0, componentList = void 0;
                    tabs = [
                        { title: 'Address', active: true },
                        { title: 'Invoice', disabled: false },
                        { title: 'General', removable: false }
                    ];
                    componentList = [MaintenanceTypeAComponent, MaintenanceTypeBComponent, MaintenanceTypeCComponent];
                    _this.otherParams['blnCIEnabled'] = data[1]['results'][2][0].CIEnabled;
                    if (_this.sysCharParams['vSCAccountDiscounts']) {
                        tabs.push({ title: 'Discounts', customClass: '' });
                        componentList.push(MaintenanceTypeDComponent);
                        _this.tabsToCheck['tabD'] = true;
                    }
                    else {
                        _this.tabsToCheck['tabD'] = false;
                    }
                    if (_this.otherParams['blnCIEnabled']) {
                        tabs.push({ title: 'Customer Integration', customClass: '' });
                        componentList.push(MaintenanceTypeEComponent);
                        _this.tabsToCheck['tabE'] = true;
                    }
                    else {
                        _this.tabsToCheck['tabE'] = false;
                    }
                    if (tabs.length !== _this.tabs.length || (tabs.length === _this.tabs.length && tabs.length === 4 && tabs[3].title !== _this.tabs[3].title)) {
                        _this.tabs = tabs;
                        _this.componentList = componentList;
                    }
                }
                if (data[1]['results'][3].length > 0) {
                    if (data[1]['results'][3][0].NationalAccount) {
                        if (data[1]['results'][3][0].NationalAccount === true || data[1]['results'][3][0].NationalAccount.toString().toUpperCase() === GlobalConstant.Configuration.Yes) {
                            _this.isNationalAccount = true;
                        }
                        else {
                            _this.isNationalAccount = false;
                        }
                    }
                    else {
                        _this.isNationalAccount = false;
                    }
                    _this.contractFormGroup.controls['AccountBalance'].setValue(data[1]['results'][3][0].AccountBalance);
                }
                if (data[1]['results'][4].length > 0 && data[1]['results'][4][0]) {
                    for (var k = 0; k < data[1]['results'][4].length; k++) {
                        _this.branchList.push(JSON.parse(JSON.stringify({
                            branchNumber: data[1]['results'][4][k].BranchNumber,
                            branchName: data[1]['results'][4][k].BranchName
                        })));
                        if (!data[1]['results'][4][k].EnablePostCodeDefaulting) {
                            _this.sysCharParams['vExcludedBranches'].push(data[1]['results'][4][k].BranchNumber);
                        }
                        if (data[1]['results'][4][k].BranchNumber === _this.queryParams.branchNumber) {
                            _this.queryParams.branchName = data[1]['results'][4][k].BranchName;
                        }
                    }
                }
                _this.queryParams.branchNumber = _this.cbb.getBranchCode();
                _this.otherParams['currentBranchNumber'] = _this.cbb.getBranchCode();
                if (data[1]['results'][5].length > 0 && data[1]['results'][5][0] && !_this.queryParams.branchNumber) {
                    for (var i = 0; i < data[1]['results'][5].length; i++) {
                        if (data[1]['results'][5][i].DefaultBranchInd) {
                            _this.queryParams.branchNumber = data[1]['results'][5][i].BranchNumber;
                            _this.otherParams['currentBranchNumber'] = data[1]['results'][5][i].BranchNumber;
                        }
                    }
                }
            }
            else {
                _this.sysCharParams['vSCMultiContactInd'] = false;
            }
            setTimeout(function () {
                if (data[2]['status'] === GlobalConstant.Configuration.Failure) {
                    _this.errorService.emitError(data[2]['oResponse']);
                }
                else {
                    data['isCopyClicked'] = false;
                    _this.store.dispatch({ type: ContractActionTypes.SAVE_DATA, payload: data[2] });
                }
                if (data[1]['results'] && data[1]['results'].length > 0) {
                    if (data[1]['results'][3].length > 0) {
                        _this.contractFormGroup.controls['AccountName'].setValue(data[1]['results'][3][0].AccountName);
                    }
                }
                for (var k = 0; k < _this.branchList.length; k++) {
                    if (_this.branchList[k].branchNumber.toString() === _this.contractFormGroup.controls['NegBranchNumber'].value) {
                        _this.contractFormGroup.controls['BranchName'].setValue(_this.branchList[k].branchName);
                    }
                }
                _this.ajaxSource.next(_this.ajaxconstant.START);
                Observable.forkJoin(_this.lookUpRecord([
                    {
                        'table': 'Company',
                        'query': { 'BusinessCode': _this.storeData['code'].business ? _this.storeData['code'].business : _this.utils.getBusinessCode() },
                        'fields': ['DefaultCompanyInd', 'CompanyCode', 'CompanyDesc']
                    },
                    {
                        'table': 'UserAuthority',
                        'query': { 'BusinessCode': _this.storeData['code'].business ? _this.storeData['code'].business : _this.utils.getBusinessCode(), 'UserCode': userCode.UserCode },
                        'fields': ['AllowViewOfSensitiveInfoInd', 'AllowUpdateOfContractInfoInd']
                    },
                    {
                        'table': 'GroupAccount',
                        'query': { 'GroupAccountNumber': _this.contractFormGroup.controls['GroupAccountNumber'].value },
                        'fields': ['GroupAccountNumber', 'GroupName']
                    },
                    {
                        'table': 'Employee',
                        'query': { 'EmployeeCode': _this.storeData['formGroup'].typeC.controls['SalesEmployee'] && _this.storeData['formGroup'].typeC.controls['SalesEmployee'].value ? _this.storeData['formGroup'].typeC.controls['SalesEmployee'].value : '' },
                        'fields': ['EmployeeCode', 'EmployeeSurname']
                    },
                    {
                        'table': 'SystemInvoiceFrequency',
                        'query': { 'InvoiceFrequencyCode': _this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'] && _this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].value ? _this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].value : '' },
                        'fields': ['InvoiceFrequencyCode', 'InvoiceFrequencyDesc']
                    },
                    {
                        'table': 'InvoiceFee',
                        'query': { 'InvoiceFeeCode': _this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'] && _this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].value ? _this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].value : '' },
                        'fields': ['InvoiceFeeCode', 'InvoiceFeeDesc']
                    },
                    {
                        'table': 'PaymentType',
                        'query': { 'PaymentTypeCode': _this.storeData['formGroup'].typeB.controls['PaymentTypeCode'] && _this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].value ? _this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].value : '' },
                        'fields': ['PaymentTypeCode', 'PaymentDesc']
                    },
                    {
                        'table': 'GroupAccountPriceGroup',
                        'query': { 'GroupAccountPriceGroupID': _this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'] && _this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value ? _this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value : '' },
                        'fields': ['GroupAccountPriceGroupID', 'GroupAccountPriceGroupDesc']
                    },
                    {
                        'table': 'Employee',
                        'query': { 'EmployeeCode': _this.storeData['formGroup'].typeC.controls['ContractOwner'] && _this.storeData['formGroup'].typeC.controls['ContractOwner'].value ? _this.storeData['formGroup'].typeC.controls['ContractOwner'].value : '' },
                        'fields': ['EmployeeCode', 'EmployeeSurname']
                    }
                ], 100)).subscribe(function (data) {
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    if (data[0]['results'] && data[0]['results'].length > 0) {
                        if (data[0]['results'][0].length > 0) {
                            var defaultCompanyCode = '', defaultCompanyDesc = '', obj = {};
                            _this.otherParams['companyList'] = [];
                            _this.storeData.otherParams['companyList'] = [];
                            for (var i = 0; i < data[0]['results'][0].length; i++) {
                                if (data[0]['results'][0][i].DefaultCompanyInd) {
                                    _this.sysCharParams['vDefaultCompanyCode'] = data[0]['results'][0][i].CompanyCode;
                                    _this.sysCharParams['vDefaultCompanyDesc'] = data[0]['results'][0][i].CompanyDesc;
                                    _this.otherParams['defaultCompanyCode'] = data[0]['results'][0][i].CompanyCode;
                                    _this.otherParams['defaultCompanyDesc'] = data[0]['results'][0][i].CompanyDesc;
                                }
                                obj = {
                                    code: data[0]['results'][0][i].CompanyCode,
                                    desc: data[0]['results'][0][i].CompanyDesc
                                };
                                _this.otherParams['companyList'].push(obj);
                                _this.storeData.otherParams['companyList'].push(obj);
                            }
                        }
                        if (data[0]['results'][1].length > 0) {
                            _this.sysCharParams['glAllowUserAuthView'] = data[0]['results'][1][0].AllowViewOfSensitiveInfoInd;
                            _this.sysCharParams['glAllowUserAuthUpdate'] = data[0]['results'][1][0].AllowUpdateOfContractInfoInd;
                            if (!_this.sysCharParams['glAllowUserAuthUpdate']) {
                                _this.displayList.options = false;
                            }
                            else {
                                _this.displayList.options = true;
                            }
                            if (!_this.sysCharParams['glAllowUserAuthView']) {
                                _this.displayList.contractAnnualValue = false;
                            }
                            else {
                                _this.displayList.contractAnnualValue = true;
                            }
                        }
                        if (data[0]['results'][2].length > 0) {
                            _this.contractFormGroup.controls['GroupName'].setValue(data[0]['results'][2][0]['GroupName']);
                        }
                        else {
                            _this.contractFormGroup.controls['GroupName'].setValue('');
                        }
                        if (data[0]['results'][3].length > 0 && _this.storeData['formGroup'].typeC.controls['SalesEmployee'].value !== '') {
                            _this.storeData['formGroup'].typeC.controls['SalesEmployeeSurname'].setValue(data[0]['results'][3][0]['EmployeeSurname']);
                        }
                        else {
                            _this.storeData['formGroup'].typeC.controls['SalesEmployeeSurname'].setValue('');
                        }
                        if (data[0]['results'][4].length > 0) {
                            _this.storeData['formGroup'].typeB.controls['InvoiceFrequencyDesc'].setValue(data[0]['results'][4][0]['InvoiceFrequencyDesc']);
                        }
                        else {
                            _this.storeData['formGroup'].typeB.controls['InvoiceFrequencyDesc'].setValue('');
                        }
                        if (data[0]['results'][5].length > 0) {
                            _this.storeData['formGroup'].typeB.controls['InvoiceFeeDesc'].setValue(data[0]['results'][5][0]['InvoiceFeeDesc']);
                        }
                        else {
                            _this.storeData['formGroup'].typeB.controls['InvoiceFeeDesc'].setValue('');
                        }
                        if (data[0]['results'][6].length > 0) {
                            _this.storeData['formGroup'].typeB.controls['PaymentDesc'].setValue(data[0]['results'][6][0]['PaymentDesc']);
                        }
                        else {
                            _this.storeData['formGroup'].typeB.controls['PaymentDesc'].setValue('');
                        }
                        if (data[0]['results'][7].length > 0) {
                            _this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupDesc'].setValue(data[0]['results'][7][0]['GroupAccountPriceGroupDesc']);
                        }
                        else {
                            _this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupDesc'].setValue('');
                        }
                        if (data[0]['results'][8].length > 0 && _this.storeData['formGroup'].typeC.controls['ContractOwner'].value !== '') {
                            _this.storeData['formGroup'].typeC.controls['ContractOwnerSurname'].setValue(data[0]['results'][8][0]['EmployeeSurname']);
                        }
                        else {
                            _this.storeData['formGroup'].typeC.controls['ContractOwnerSurname'].setValue('');
                        }
                        setTimeout(function () {
                            _this.sysCharParams['storage'] = _this.sysCharParams['storage'] || {};
                            _this.sysCharParams['storage'][_this.storeData['code'].country + _this.storeData['code'].business] = JSON.parse(JSON.stringify(_this.sysCharParams));
                            _this.store.dispatch({ type: ContractActionTypes.SAVE_SYSCHAR, payload: _this.sysCharParams });
                            _this.store.dispatch({ type: ContractActionTypes.SAVE_OTHER_PARAMS, payload: _this.otherParams });
                            if (mode) {
                                _this.updateMode = mode.updateMode;
                                _this.addMode = mode.addMode;
                                _this.searchMode = mode.searchMode;
                                _this.store.dispatch({
                                    type: ContractActionTypes.SAVE_MODE, payload: mode
                                });
                                if (mode.searchMode === true) {
                                    _this.contractFormGroup.controls['ContractNumber'].disable();
                                }
                            }
                            else {
                                _this.store.dispatch({
                                    type: ContractActionTypes.SAVE_MODE, payload: {
                                        updateMode: _this.updateMode,
                                        addMode: _this.addMode,
                                        searchMode: _this.searchMode
                                    }
                                });
                            }
                            _this.commenceDateService();
                        }, 100);
                    }
                }, function (error) {
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    _this.errorService.emitError({
                        errorMessage: error['errorMessage'] || ErrorConstant.Message.UnexpectedError,
                        fullError: error['fullError']
                    });
                    return;
                });
            }, 200);
        }, function (err) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
        if (route === true) {
            this.routeOnData();
        }
    };
    ContractMaintenanceComponent.prototype.processSysChar = function () {
        this.contractFormGroup.controls['Copy'].disable();
        this.contractFormGroup.controls['Status'].disable();
        this.contractFormGroup.controls['LostBusinessDesc'].disable();
        this.contractFormGroup.controls['LostBusinessDesc2'].disable();
        this.contractFormGroup.controls['LostBusinessDesc3'].disable();
        this.contractFormGroup.controls['ContractAnnualValue'].disable();
        this.contractFormGroup.controls['AnyPendingBelow'].disable();
        this.contractFormGroup.controls['MoreThanOneContract'].disable();
        this.contractFormGroup.controls['ErrorMessageDesc'].setValue(false);
        this.contractFormGroup.controls['PNOL'].setValue(false);
        this.dateObjectsEnabled['inactiveEffectDate'] = false;
        if (this.sysCharParams['vSCGroupAccount']) {
            this.displayList.groupAccount = true;
        }
        else {
            this.displayList.groupAccount = false;
        }
        if (this.sysCharParams['vRequired'] === true && this.sysCharParams['vSCEnableTaxCodeDefaultingText'].indexOf('5') > -1) {
            this.sysCharParams['vSCEnableTaxCodeDefaulting'] = true;
        }
        else {
            this.sysCharParams['vSCEnableTaxCodeDefaulting'] = false;
        }
        if (!this.sysCharParams['vSCDisableDefaultCountryCode']) {
            this.sysCharParams['vDefaultCountryCode'] = this.storeData['code'].country;
        }
        if (this.sysCharParams['vSCEnableTaxRegistrationNumber2']) {
            this.sysCharParams['vCompanyVATNumberLabel'] = 'Tax Registration Number 1';
        }
        else {
            this.sysCharParams['vCompanyVATNumberLabel'] = 'Tax Registration Number';
        }
    };
    ContractMaintenanceComponent.prototype.routeOnData = function () {
    };
    ContractMaintenanceComponent.prototype.modalHidden = function (data) {
        this.fetchTranslationContent();
        this.contractSearchParams['accountNumber'] = '';
        this.contractSearchParams['accountName'] = '';
        this.contractSearchParams['isCopy'] = false;
        this.contractSearchParams['showAddNew'] = true;
        if (this.isCopyClicked) {
            this.setContractType(this.currentRouteUrl, true);
            this.contractSearchParams['initEmpty'] = true;
            return;
        }
        else {
            this.contractSearchParams['initEmpty'] = false;
        }
        if (this.updateMode === false && this.addMode === false) {
            this.searchMode = true;
            this.updateMode = false;
            this.addMode = false;
            this.store.dispatch({
                type: ContractActionTypes.SAVE_MODE, payload: {
                    updateMode: this.updateMode,
                    addMode: this.addMode,
                    searchMode: this.searchMode
                }
            });
            this.autoOpenSearch = false;
            this.autoOpenAccount = false;
            this.processForm();
        }
    };
    ContractMaintenanceComponent.prototype.setFormData = function (data) {
        var _this = this;
        this.contractFormGroup.controls['ContractNumber'].setValue(data['data'].ContractNumber);
        this.contractFormGroup.controls['ContractName'].setValue(this.checkFalsy(data['data'].ContractName));
        if (!this.isCopyClicked)
            this.contractFormGroup.controls['ContractAnnualValue'].setValue(data['data'].ContractAnnualValue);
        if (this.contractFormGroup.controls['AnyPendingBelow']) {
            this.contractFormGroup.controls['AnyPendingBelow'].setValue(data['data'].AnyPendingBelow);
        }
        if (this.contractFormGroup.controls['LostBusinessDesc']) {
            this.contractFormGroup.controls['LostBusinessDesc'].setValue(data['data'].LostBusinessDesc);
        }
        if (this.contractFormGroup.controls['LostBusinessDesc2']) {
            this.contractFormGroup.controls['LostBusinessDesc2'].setValue(data['data'].LostBusinessDesc2);
        }
        if (this.contractFormGroup.controls['LostBusinessDesc3']) {
            this.contractFormGroup.controls['LostBusinessDesc3'].setValue(data['data'].LostBusinessDesc3);
        }
        if (this.contractFormGroup.controls['TrialPeriodInd']) {
            if (data['data'] && data['data'].TrialPeriodInd) {
                if (data['data'].TrialPeriodInd.toUpperCase() === 'YES') {
                    this.contractFormGroup.controls['TrialPeriodInd'].setValue(true);
                }
                else {
                    this.contractFormGroup.controls['TrialPeriodInd'].setValue(false);
                }
            }
            else {
                this.contractFormGroup.controls['TrialPeriodInd'].setValue(false);
            }
        }
        if (this.contractFormGroup.controls['AccountNumber']) {
            this.contractFormGroup.controls['AccountNumber'].setValue(data['data'].AccountNumber);
        }
        if (this.contractFormGroup.controls['AccountName']) {
            this.contractFormGroup.controls['AccountName'].setValue((typeof data['data'] !== 'undefined') ? this.checkFalsy(data['data'].AccountName) : '');
        }
        if (this.contractFormGroup.controls['MoreThanOneContract']) {
            this.contractFormGroup.controls['MoreThanOneContract'].setValue(data['data'].MoreThanOneContract);
        }
        if (this.inputParams.currentContractType === 'C' && data['data'].MoreThanOneContract !== '' && !this.isCopyClicked) {
            this.displayList.moreThanOneContract = true;
        }
        else {
            this.displayList.moreThanOneContract = false;
        }
        if (this.contractFormGroup.controls['GroupAccountNumber']) {
            this.contractFormGroup.controls['GroupAccountNumber'].setValue(data['data'].GroupAccountNumber);
            if (data['data'].GroupAccountNumber === '') {
                this.storeData['fieldVisibility'].typeC.groupAccountPriceGroupID = false;
            }
            else {
                this.storeData['fieldVisibility'].typeC.groupAccountPriceGroupID = true;
            }
        }
        if (this.contractFormGroup.controls['GroupName']) {
            this.contractFormGroup.controls['GroupName'].setValue('');
        }
        if (this.contractFormGroup.controls['ShowValueButton'] && !this.isCopyClicked) {
            this.contractFormGroup.controls['ShowValueButton'].setValue(data['data'].ShowValueButton);
            if (data['data'].ShowValueButton) {
                if (data['data'].ShowValueButton.toUpperCase() === GlobalConstant.Configuration.Yes) {
                    this.displayList.future = true;
                }
                else {
                    this.displayList.future = false;
                }
            }
            else {
                this.displayList.future = false;
            }
        }
        if (this.contractFormGroup.controls['BadDebtAccount']) {
            if (data['data'].BadDebtAccount) {
                if (data['data'].BadDebtAccount.toUpperCase() === GlobalConstant.Configuration.Yes) {
                    this.contractFormGroup.controls['BadDebtAccount'].setValue(true);
                    this.displayList.badDebtAccount = true;
                    this.displayList.badDebtAccountCheckbox = true;
                }
                else {
                    this.contractFormGroup.controls['BadDebtAccount'].setValue(false);
                    this.displayList.badDebtAccount = false;
                    this.displayList.badDebtAccountCheckbox = false;
                }
            }
            else {
                this.contractFormGroup.controls['BadDebtAccount'].setValue(false);
                this.displayList.badDebtAccount = false;
                this.displayList.badDebtAccountCheckbox = false;
            }
        }
        if (this.contractFormGroup.controls['NationalAccountchecked']) {
            if (data['data'].NationalAccountchecked) {
                if (this.isNationalAccount && data['data'].NationalAccountchecked.toUpperCase() === GlobalConstant.Configuration.Yes) {
                    this.contractFormGroup.controls['NationalAccountchecked'].setValue(true);
                    this.displayList.nationalAccount = true;
                }
                else {
                    this.contractFormGroup.controls['NationalAccountchecked'].setValue(false);
                    this.displayList.nationalAccount = false;
                }
            }
            else {
                this.contractFormGroup.controls['NationalAccountchecked'].setValue(false);
                this.displayList.nationalAccount = false;
            }
        }
        if (this.contractFormGroup.controls['DisableList']) {
            this.contractFormGroup.controls['DisableList'].setValue('');
        }
        if (this.contractFormGroup.controls['MandateRequired']) {
            this.contractFormGroup.controls['MandateRequired'].setValue(data['data'].MandateRequired);
            if (data['data'].MandateRequired) {
                if (data['data'].MandateRequired.toUpperCase() === GlobalConstant.Configuration.Yes) {
                    this.contractFormGroup.controls['MandateRequired'].setValue(true);
                }
                else {
                    this.contractFormGroup.controls['MandateRequired'].setValue(false);
                }
            }
            else {
                this.contractFormGroup.controls['MandateRequired'].setValue(false);
            }
        }
        if (data['data'].PNOL) {
            if (data['data'].PNOL.toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.contractFormGroup.controls['PNOL'].setValue(true);
                this.displayList.pnol = true;
            }
            else {
                this.contractFormGroup.controls['PNOL'].setValue(false);
                this.displayList.pnol = false;
            }
        }
        else {
            this.contractFormGroup.controls['PNOL'].setValue(false);
            this.displayList.pnol = false;
        }
        if (data['data'].CustomerInfoAvailable) {
            if (data['data'].CustomerInfoAvailable.toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.contractFormGroup.controls['CustomerInfoAvailable'].setValue(true);
                this.displayList.customerInformation = true;
            }
            else {
                this.contractFormGroup.controls['CustomerInfoAvailable'].setValue(false);
                this.displayList.customerInformation = false;
            }
        }
        else {
            this.contractFormGroup.controls['CustomerInfoAvailable'].setValue(false);
            this.displayList.customerInformation = false;
        }
        if (data['data'].ContractHasExpired) {
            if (data['data'].ContractHasExpired.toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.contractFormGroup.controls['ContractHasExpired'].setValue(true);
                this.displayList.expired = true;
            }
            else {
                this.contractFormGroup.controls['ContractHasExpired'].setValue(false);
                this.displayList.expired = false;
            }
        }
        else {
            this.contractFormGroup.controls['ContractHasExpired'].setValue(false);
            this.displayList.expired = false;
        }
        if (this.contractFormGroup.controls['ReqAutoNumber']) {
            this.contractFormGroup.controls['ReqAutoNumber'].setValue('');
        }
        if (this.contractFormGroup.controls['PaymentTypeWarning']) {
            this.contractFormGroup.controls['PaymentTypeWarning'].setValue('');
        }
        if (this.contractFormGroup.controls['ProspectNumber']) {
            this.contractFormGroup.controls['ProspectNumber'].setValue(data['data'].ProspectNumber);
            this.prospectNumber = data['data'].ProspectNumber;
        }
        this.contractFormGroup.controls['ErrorMessageDesc'].setValue('');
        this.contractFormGroup.controls['RunningReadOnly'].setValue('');
        this.contractFormGroup.controls['CallLogID'].setValue('');
        this.contractFormGroup.controls['CurrentCallLogID'].setValue('');
        this.contractFormGroup.controls['WindowClosingName'].setValue('');
        this.contractFormGroup.controls['ClosedWithChanges'].setValue('');
        if (!this.isCopyClicked) {
            this.contractFormGroup.controls['CurrentPremises'].setValue(data['data'].CurrentPremises);
            this.contractFormGroup.controls['NegBranchNumber'].setValue(data['data'].NegBranchNumber);
            this.contractFormGroup.controls['BranchName'].setValue('');
            this.onNegBranchNumberBlur({});
            this.contractFormGroup.controls['Status'].setValue(data['data'].Status);
            this.clearDate['contractCommenceDate'] = false;
            if (data['data'].ContractCommenceDate) {
                if (window['moment'](data['data'].ContractCommenceDate, 'DD/MM/YYYY', true).isValid()) {
                    this.commenceDateDisplay = this.utils.convertDateString(data['data'].ContractCommenceDate);
                }
                else {
                    this.commenceDateDisplay = data['data'].ContractCommenceDate;
                }
            }
            else {
                this.commenceDateDisplay = '';
            }
            if (!this.commenceDateDisplay) {
                if (data['data'].ContractCommenceDate === '') {
                    setTimeout(function () {
                        _this.clearDate['contractCommenceDate'] = true;
                    }, 400);
                }
                this.contractCommenceDate = null;
            }
            else {
                this.clearDate['contractCommenceDate'] = false;
                this.contractCommenceDate = new Date(this.commenceDateDisplay);
                if (!window['moment'](this.commenceDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                    this.commenceDateDisplay = this.utils.formatDate(new Date(this.commenceDateDisplay));
                }
            }
            this.contractFormGroup.controls['ContractCommenceDate'].setValue(data['data'].ContractCommenceDate);
            this.clearDate['inactiveEffectDate'] = false;
            if (data['data'].InactiveEffectDate) {
                if (window['moment'](data['data'].InactiveEffectDate, 'DD/MM/YYYY', true).isValid()) {
                    this.inactiveEffectDateDisplay = this.utils.convertDateString(data['data'].InactiveEffectDate);
                }
                else {
                    this.inactiveEffectDateDisplay = data['data'].InactiveEffectDate;
                }
            }
            else {
                this.inactiveEffectDateDisplay = '';
            }
            if (!this.inactiveEffectDateDisplay) {
                if (data['data'].InactiveEffectDate === '') {
                    setTimeout(function () {
                        _this.clearDate['inactiveEffectDate'] = true;
                    }, 400);
                }
                this.inactiveEffectDate = null;
            }
            else {
                this.clearDate['inactiveEffectDate'] = false;
                this.inactiveEffectDate = new Date(this.inactiveEffectDateDisplay);
                if (!window['moment'](this.inactiveEffectDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                    this.inactiveEffectDateDisplay = this.utils.formatDate(new Date(this.inactiveEffectDateDisplay));
                }
            }
            this.contractFormGroup.controls['InactiveEffectDate'].setValue(data['data'].InactiveEffectDate);
        }
    };
    ContractMaintenanceComponent.prototype.onAccountDataReceived = function (data) {
        if (data) {
            this.contractFormGroup.controls['AccountName'].setValue(data.AccountName);
            this.contractFormGroup.controls['ContractName'].setValue(data.AccountName);
            this.contractFormGroup.controls['AccountNumber'].setValue(data.AccountNumber);
            this.contractFormGroup.controls['AccountBalance'].setValue(data.AccountBalance);
            this.contractFormGroup.controls['GroupAccountNumber'].setValue(data.GroupAccountNumber);
            this.onAccountBlur({});
        }
    };
    ContractMaintenanceComponent.prototype.onGroupAccountDataReceived = function (data) {
        if (data) {
            this.contractFormGroup.controls['GroupAccountNumber'].setValue(data.GroupAccountNumber);
            this.contractFormGroup.controls['GroupName'].setValue(data.GroupName || data.Object.GroupName);
        }
    };
    ContractMaintenanceComponent.prototype.onUpdateButtonClick = function (event) {
        this.searchMode = false;
        this.updateMode = true;
        this.addMode = false;
        this.store.dispatch({
            type: ContractActionTypes.SAVE_MODE, payload: {
                updateMode: this.updateMode,
                addMode: this.addMode,
                searchMode: this.searchMode
            }
        });
        this.processForm();
    };
    ContractMaintenanceComponent.prototype.onCancel = function (event) {
        var _this = this;
        event.preventDefault();
        if (this.addMode) {
            this.contractSearchParams['accountNumber'] = '';
            this.contractSearchParams['accountName'] = '';
            this.contractFormGroup.reset();
            this.storeData['formGroup'].typeA.reset();
            this.storeData['formGroup'].typeB.reset();
            this.storeData['formGroup'].typeC.reset();
            if (this.storeData['formGroup'].typeD) {
                this.storeData['formGroup'].typeD.reset();
            }
            if (this.storeData['formGroup'].typeE) {
                this.storeData['formGroup'].typeE.reset();
            }
            for (var key in this.contractFormGroup.controls) {
                if (this.contractFormGroup.controls[key]) {
                    this.contractFormGroup.controls[key].disable();
                }
            }
            for (var key in this.storeData['formGroup'].typeA.controls) {
                if (this.storeData['formGroup'].typeA.controls[key]) {
                    this.storeData['formGroup'].typeA.controls[key].disable();
                }
            }
            for (var key in this.storeData['formGroup'].typeB.controls) {
                if (this.storeData['formGroup'].typeB.controls[key]) {
                    this.storeData['formGroup'].typeB.controls[key].disable();
                }
            }
            for (var key in this.storeData['formGroup'].typeC.controls) {
                if (this.storeData['formGroup'].typeC.controls[key]) {
                    this.storeData['formGroup'].typeC.controls[key].disable();
                }
            }
            if (this.storeData['formGroup'].typeD) {
                for (var key in this.storeData['formGroup'].typeD.controls) {
                    if (this.storeData['formGroup'].typeD.controls[key]) {
                        this.storeData['formGroup'].typeD.controls[key].disable();
                    }
                }
            }
            if (this.storeData['formGroup'].typeE) {
                for (var key in this.storeData['formGroup'].typeE.controls) {
                    if (this.storeData['formGroup'].typeE.controls[key]) {
                        this.storeData['formGroup'].typeE.controls[key].disable();
                    }
                }
            }
            this.contractCommenceDate = void 0;
            this.inactiveEffectDate = void 0;
            this.searchMode = true;
            this.updateMode = false;
            this.addMode = false;
            this.store.dispatch({
                type: ContractActionTypes.SAVE_MODE, payload: {
                    updateMode: this.updateMode,
                    addMode: this.addMode,
                    searchMode: this.searchMode,
                    prevMode: 'Add'
                }
            });
            this.autoOpenSearch = true;
            setTimeout(function () {
                _this.autoOpenSearch = false;
            }, 100);
        }
        else if (this.updateMode) {
            var dataReg = [
                {
                    'table': 'Account',
                    'query': { 'BusinessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode(), 'AccountNumber': this.contractFormGroup.controls['AccountNumber'] ? this.contractFormGroup.controls['AccountNumber'].value : '' },
                    'fields': ['AccountName', 'AccountNumber', 'NationalAccount', 'AccountBalance']
                },
                {
                    'table': 'SystemInvoiceFrequency',
                    'query': { 'InvoiceFrequencyCode': this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'] ? this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].value : '' },
                    'fields': ['InvoiceFrequencyCode', 'InvoiceFrequencyDesc']
                },
                {
                    'table': 'InvoiceFee',
                    'query': { 'InvoiceFeeCode': this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'] ? this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].value : '' },
                    'fields': ['InvoiceFeeDesc']
                },
                {
                    'table': 'PaymentType',
                    'query': { 'PaymentTypeCode': this.storeData['formGroup'].typeB.controls['PaymentTypeCode'] ? this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].value : '' },
                    'fields': ['PaymentDesc']
                },
                {
                    'table': 'Employee',
                    'query': { 'EmployeeCode': this.storeData['formGroup'].typeC.controls['SalesEmployee'] ? this.storeData['formGroup'].typeC.controls['SalesEmployee'].value : '' },
                    'fields': ['EmployeeSurname']
                },
                {
                    'table': 'GroupAccountPriceGroup',
                    'query': {
                        'GroupAccountPriceGroupID': this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'] ? this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value : '',
                        'GroupAccountNumber': this.storeData['formGroup'].main.controls['GroupAccountNumber'].value
                    },
                    'fields': ['GroupAccountPriceGroupDesc']
                }];
            Observable.forkJoin(this.lookUpRecord(dataReg, 100), this.fetchContractData('', { ContractNumber: this.contractFormGroup.controls['ContractNumber'].value, ContractTypeCode: this.inputParams.currentContractType })).subscribe(function (data) {
                if (data[1]['status'] === GlobalConstant.Configuration.Failure) {
                    _this.errorService.emitError(data[1]['oResponse']);
                }
                else {
                    if (!data[1]['errorMessage'] && !data[1]['error']) {
                        _this.store.dispatch({ type: ContractActionTypes.SAVE_DATA, payload: data[1] });
                    }
                }
                if (data[0] && !data[0]['errorMessage']) {
                    if (data[0]['results'] && data[0]['results'][0].length > 0) {
                        if (data[0]['results'][0][0].NationalAccount) {
                            if (data[0]['results'][0][0].NationalAccount === true || data[0]['results'][0][0].NationalAccount.toString().toUpperCase() === GlobalConstant.Configuration.Yes) {
                                _this.isNationalAccount = true;
                            }
                            else {
                                _this.isNationalAccount = false;
                            }
                        }
                        else {
                            _this.isNationalAccount = false;
                        }
                        _this.contractFormGroup.controls['AccountBalance'].setValue(data[0]['results'][0][0].AccountBalance);
                        _this.contractFormGroup.controls['AccountName'].setValue(data[0]['results'][0][0].AccountName);
                    }
                    if (data[0]['results'] && data[0]['results'][1].length > 0) {
                        if (data[0]['results'][1][0]) {
                            _this.storeData['formGroup'].typeB.controls['InvoiceFrequencyDesc'].setValue(data[0]['results'][1][0]['InvoiceFrequencyDesc']);
                        }
                    }
                    if (data[0]['results'] && data[0]['results'][2].length > 0) {
                        if (data[0]['results'][2][0]) {
                            _this.storeData['formGroup'].typeB.controls['InvoiceFeeDesc'].setValue(data[0]['results'][2][0]['InvoiceFeeDesc']);
                        }
                    }
                    if (data[0]['results'] && data[0]['results'][3].length > 0) {
                        if (data[0]['results'][3][0]) {
                            _this.storeData['formGroup'].typeB.controls['PaymentDesc'].setValue(data[0]['results'][3][0]['PaymentDesc']);
                        }
                    }
                    if (data[0]['results'] && data[0]['results'][4].length > 0) {
                        if (data[0]['results'][4][0]) {
                            _this.storeData['formGroup'].typeC.controls['SalesEmployeeSurname'].setValue(data[0]['results'][4][0]['EmployeeSurname']);
                        }
                    }
                    if (data[0]['results'] && data[0]['results'][5].length > 0) {
                        if (data[0]['results'][5][0]) {
                            _this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupDesc'].setValue(data[0]['results'][5][0]['GroupAccountPriceGroupDesc']);
                        }
                    }
                }
                _this.store.dispatch({ type: ContractActionTypes.LOOKUP });
            });
        }
        this.tabsError = {
            tabA: false,
            tabB: false,
            tabC: false,
            tabD: false,
            tabE: false
        };
        this.formPristine();
        if (this.currentRouteParams && typeof this.currentRouteParams['ReDirectOnCancel'] !== 'undefined' && this.currentRouteParams['ReDirectOnCancel'] === 'true') {
            this.location.back();
        }
    };
    ContractMaintenanceComponent.prototype.optionsChange = function (event) {
        switch (this.options.trim()) {
            case 'contacts':
                this.router.navigate(['/application/ContactPersonMaintenance'], { queryParams: { parentMode: 'Contract', contractNumber: this.storeData['data'].ContractNumber } });
                break;
            case 'Premises Details':
                this.router.navigate(['grid/contractmanagement/maintenance/contract/premise'], {
                    queryParams: {
                        parentMode: 'Contract',
                        ContractNumber: this.contractFormGroup.controls['ContractNumber'].value,
                        ContractName: this.contractFormGroup.controls['ContractName'].value,
                        AccountNumber: this.contractFormGroup.controls['AccountNumber'].value,
                        AccountName: this.contractFormGroup.controls['AccountName'].value,
                        ContractTypeCode: this.inputParams.currentContractType
                    }
                });
                break;
            case 'Invoice History':
                this.router.navigate(['/billtocash/contract/invoice'], {
                    queryParams: {
                        parentMode: 'Contract',
                        ContractNumber: this.contractFormGroup.controls['ContractNumber'].value,
                        ContractName: this.contractFormGroup.controls['ContractName'].value
                    }
                });
                break;
            case 'Contact Management':
                if (this.otherParams['lREGContactCentreReview']) {
                    this.router.navigate(['/ccm/centreReview'], {
                        queryParams: {
                            parentMode: 'Contract',
                            ContractNumber: this.contractFormGroup.controls['ContractNumber'].value,
                            ContractName: this.contractFormGroup.controls['ContractName'].value,
                            AccountNumber: this.contractFormGroup.controls['AccountNumber'].value,
                            AccountName: this.contractFormGroup.controls['AccountName'].value
                        }
                    });
                }
                else {
                    this.router.navigate(['/ccm/contact/search'], {
                        queryParams: {
                            parentMode: 'Contract',
                            ContractNumber: this.contractFormGroup.controls['ContractNumber'].value,
                            ContractName: this.contractFormGroup.controls['ContractName'].value,
                            AccountNumber: this.contractFormGroup.controls['AccountNumber'].value,
                            AccountName: this.contractFormGroup.controls['AccountName'].value
                        }
                    });
                }
                break;
            case 'Pro Rata Charge':
                this.router.navigate(['grid/application/proRatacharge/summary'], {
                    queryParams: {
                        parentMode: 'Contract',
                        ContractNumber: this.contractFormGroup.controls['ContractNumber'].value,
                        ContractName: this.contractFormGroup.controls['ContractName'].value,
                        AccountNumber: this.contractFormGroup.controls['AccountNumber'].value,
                        AccountName: this.contractFormGroup.controls['AccountName'].value,
                        currentContractType: this.inputParams.currentContractType
                    }
                });
                break;
            case 'Invoice Narrative':
                this.router.navigate(['/contractmanagement/maintenance/contract/invoicenarrative'], {
                    queryParams: {
                        parentMode: 'Contract',
                        currentContractTypeURLParameter: this.inputParams.currentContractTypeURLParameter,
                        ContractNumber: this.contractFormGroup.controls['ContractNumber'].value,
                        AccountNumber: this.contractFormGroup.controls['AccountNumber'].value,
                        PremiseNumber: '',
                        InvoiceGroupNumber: '',
                        InvoiceNarrativeText: '',
                        backLabel: 'Contract Maintenance',
                        backRoute: '#/contractmanagement/maintenance/contract'
                    }
                });
                break;
            case 'Prospect Conversion':
                this.router.navigate(['grid/application/prospectconvgrid'], {
                    queryParams: {
                        parentMode: 'Contract',
                        currentContractTypefetchContURLParameter: this.inputParams.currentContractTypeURLParameter
                    }
                });
                break;
            case 'History':
                this.router.navigate(['grid/application/contract/history'], {
                    queryParams: {
                        parentMode: 'Contract',
                        currentContractTypeURLParameter: this.inputParams.currentContractTypeURLParameter
                    }
                });
                break;
            case 'Account Information':
                this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], {
                    queryParams: {
                        parentMode: 'CallCentreSearch',
                        AccountNumber: this.contractFormGroup.controls['AccountNumber'].value,
                        AccountName: this.contractFormGroup.controls['AccountName'].value
                    }
                });
                break;
            case 'Event History':
                this.router.navigate(['grid/contactmanagement/customercontactHistorygrid'], {
                    queryParams: {
                        parentMode: 'Contract',
                        currentContractTypeURLParameter: this.inputParams.currentContractTypeURLParameter,
                        ContractNumber: this.contractFormGroup.controls['ContractNumber'].value,
                        ContractName: this.contractFormGroup.controls['ContractName'].value,
                        AccountNumber: this.contractFormGroup.controls['AccountNumber'].value,
                        AccountName: this.contractFormGroup.controls['AccountName'].value,
                        backLabel: 'Contract Maintenance',
                        backRoute: '#/contractmanagement/maintenance/contract'
                    }
                });
                break;
            case 'Infestation Tolerances':
                this.router.navigate(['grid/contractmanagement/account/infestationToleranceGrid'], { queryParams: { parentMode: 'ContractInfestationTolerance', ContractNumber: this.contractFormGroup.controls['ContractNumber'].value, CurrentContractTypeURLParameter: this.inputParams.currentContractTypeURLParameter } });
                break;
            case 'Waste Consignment Note History':
                alert('Screen not part of MVP 1');
                break;
            case 'ServiceCover':
                if (this.inputParams.currentContractType === 'P') {
                    this.router.navigate(['grid/application/productSalesSCEntryGrid'], {
                        queryParams: {
                            parentMode: 'Contract',
                            currentContractTypeURLParameter: this.inputParams.currentContractTypeURLParameter,
                            'ContractNumber': this.contractFormGroup.controls['ContractNumber'].value,
                            'ContractName': this.contractFormGroup.controls['ContractName'].value,
                            'backLabel': 'Contract Maintenance'
                        }
                    });
                }
                else {
                    this.router.navigate(['/grid/contractmanagement/account/contractservicesummary'], {
                        queryParams: {
                            parentMode: 'Contract',
                            currentContractType: this.inputParams.currentContractType,
                            'ContractNumber': this.contractFormGroup.controls['ContractNumber'].value,
                            'ContractName': this.contractFormGroup.controls['ContractName'].value,
                            'ContractAnnualValue': this.contractFormGroup.controls['ContractAnnualValue'].value,
                            'RunningReadOnly': this.contractFormGroup.controls['RunningReadOnly'].value,
                            'CallLogID': this.contractFormGroup.controls['CallLogID'].value,
                            'CurrentCallLogID': this.contractFormGroup.controls['CurrentCallLogID'].value,
                            'IsNationalAccount': this.isNationalAccount,
                            'backLabel': 'Contract Maintenance'
                        }
                    });
                }
                break;
            case 'Visit Summary':
                this.router.navigate(['/grid/contractmanagement/maintenance/contract/visitsummary'], {
                    queryParams: {
                        'parentMode': 'Contract',
                        'currentContractTypeURLParameter': this.inputParams.currentContractTypeURLParameter,
                        'isNationalAccount': this.isNationalAccount,
                        'ContractNumber': this.contractFormGroup.controls['ContractNumber'].value,
                        'ContractName': this.contractFormGroup.controls['ContractName'].value
                    }
                });
                break;
            case 'StaticVisits':
                this.router.navigate(['grid/application/service/StaticVisitGridYear'], {
                    queryParams: {
                        parentMode: 'Contract',
                        currentContractType: this.inputParams.currentContractType
                    }
                });
                break;
            case 'Service Recommendations':
                this.router.navigate(['grid/application/service/recommendation'], {
                    queryParams: {
                        parentMode: 'Contract',
                        'ContractNumber': this.contractFormGroup.controls['ContractNumber'].value,
                        'ContractName': this.contractFormGroup.controls['ContractName'].value,
                        'backLabel': 'Contract Maintenance',
                        currentContractType: this.inputParams.currentContractType
                    }
                });
                break;
            case 'Customer Information':
                this.router.navigate(['/grid/maintenance/contract/customerinformation'], {
                    queryParams: {
                        parent: 'contract-maintenance'
                    }
                });
                break;
            case 'Visit Tolerances':
                this.router.navigate(['grid/application/visittolerancegrid'], {
                    queryParams: {
                        parentMode: 'ContractVisitTolerance',
                        currentContractTypeURLParameter: this.inputParams.currentContractTypeURLParameter
                    }
                });
                break;
            case 'Contact Management Search':
                this.router.navigate(['ccm/callcentersearch'], {
                    queryParams: {
                        'parentMode': 'ContactManagement',
                        'AccountNumber': this.contractFormGroup.controls['AccountNumber'].value,
                        'ContractNumber': this.contractFormGroup.controls['ContractNumber'].value,
                        'CurrentContractTypeURLParameter': this.inputParams.currentContractTypeURLParameter
                    }
                });
                break;
            case 'Telesales Order':
                this.router.navigate(['application/telesalesEntry'], {
                    queryParams: {
                        'parentMode': 'ContractTeleSalesOrder',
                        'currentContractTypeURLParameter': this.inputParams.currentContractTypeURLParameter,
                        'AccountNumber': this.contractFormGroup.controls['AccountNumber'].value,
                        'ContractNumber': this.contractFormGroup.controls['ContractNumber'].value,
                        'ProspectNumber': this.contractFormGroup.controls['ProspectNumber'].value,
                        'CurrentCallLogID': this.contractFormGroup.controls['CurrentCallLogID'].value
                    }
                });
                break;
            case 'Invoice Charge':
                this.router.navigate(['contractmanagement/account/invoiceCharge'], {
                    queryParams: {
                        'parentMode': 'Contract',
                        'AccountNumber': this.contractFormGroup.controls['AccountNumber'].value,
                        'ContractNumber': this.contractFormGroup.controls['ContractNumber'].value,
                        'ContractName': this.contractFormGroup.controls['ContractName'].value,
                        'currentContractTypeURLParameter': this.inputParams.currentContractTypeURLParameter
                    }
                });
                break;
            default:
                break;
        }
    };
    ContractMaintenanceComponent.prototype.processForm = function () {
        var _this = this;
        if (this.updateMode && !this.searchMode && !this.addMode) {
            this.contractFormGroup.controls['ContractNumber'].disable();
            this.contractFormGroup.controls['ContractName'].enable();
            this.contractFormGroup.controls['AccountNumber'].disable();
            this.contractFormGroup.controls['GroupAccountNumber'].disable();
            this.contractFormGroup.controls['Future'].enable();
            this.contractFormGroup.controls['Copy'].disable();
            this.dateObjectsEnabled['contractCommenceDate'] = false;
            this.isAccountEllipsisDisabled = true;
            this.isContractEllipsisDisabled = false;
            this.otherParams['disableNameSearch'] = true;
            this.fieldRequired.contractNumber = true;
            if (this.sysCharParams['vSCEnableTrialPeriodServices']) {
                this.onTrialPeriodIndChange({});
                if (this.contractFormGroup.controls['TrialPeriodInd'].value) {
                    this.displayList.trialPeriodInd = true;
                }
                else {
                    this.displayList.trialPeriodInd = false;
                }
            }
            this.afterFetch();
            if (this.isNationalAccount && this.storeData['data'] && this.storeData['data'].NationalAccountchecked && this.storeData['data'].NationalAccountchecked.toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.displayList.nationalAccount = true;
            }
            else {
                this.displayList.nationalAccount = false;
            }
            this.isNegBranchDropdownsDisabled = false;
            var focus_1 = new Event('focus', { bubbles: false });
            setTimeout(function () {
                _this.renderer.invokeElementMethod(document.getElementById('ContractName'), 'focus', [focus_1]);
            }, 0);
            this.cbb.disableComponent(true);
        }
        if (this.searchMode && !this.updateMode && !this.addMode) {
            this.contractFormGroup.controls['ContractNumber'].enable();
            this.contractFormGroup.controls['ContractName'].disable();
            this.isAccountEllipsisDisabled = true;
            if (this.isChild) {
                this.isContractEllipsisDisabled = true;
            }
            else {
                this.isContractEllipsisDisabled = false;
            }
            this.isNegBranchDropdownsDisabled = true;
            this.isGroupAccountEllipsisDisabled = true;
            this.dateObjectsEnabled['contractCommenceDate'] = false;
            this.dateObjectsEnabled['inactiveEffectDate'] = false;
            this.contractFormGroup.controls['Future'].enable();
            this.contractFormGroup.controls['Copy'].disable();
            this.fieldRequired.contractNumber = true;
            this.fetchTranslationContent();
        }
        if (this.addMode && !this.updateMode && !this.searchMode) {
            this.otherParams['disableNameSearch'] = false;
            if (this.sysCharParams['vSCEnableAutoNumber']) {
                this.fieldRequired.contractNumber = false;
            }
            else {
                this.fieldRequired.contractNumber = true;
            }
            this.fetchContractData('GetPaymentTypeDetails,GetNoticePeriod', {}).subscribe(function (e) {
                if (e.status === GlobalConstant.Configuration.Failure) {
                    _this.errorService.emitError(e.oResponse);
                }
                else {
                    _this.contractFormGroup.controls['PaymentTypeWarning'].setValue(e.PaymentTypeWarning);
                    if (e.PaymentTypeWarning !== '') {
                        _this.errorService.emitError({
                            errorMessage: e.PaymentTypeWarning
                        });
                    }
                }
            }, function (error) {
            });
            this.contractFormGroup.controls['ContractName'].enable();
            this.contractFormGroup.controls['ContractName'].setValue('');
            this.contractFormGroup.controls['ContractNumber'].disable();
            this.contractFormGroup.controls['ContractNumber'].setValue('');
            this.contractFormGroup.controls['CurrentPremises'].disable();
            this.contractFormGroup.controls['CurrentPremises'].setValue('');
            this.contractFormGroup.controls['NegBranchNumber'].enable();
            this.contractFormGroup.controls['BranchName'].disable();
            this.isNegBranchDropdownsDisabled = false;
            this.contractFormGroup.controls['ContractAnnualValue'].disable();
            this.contractFormGroup.controls['ContractAnnualValue'].setValue('');
            this.contractFormGroup.controls['AccountNumber'].enable();
            this.contractFormGroup.controls['AccountNumber'].setValue('');
            this.contractFormGroup.controls['AccountName'].disable();
            this.contractFormGroup.controls['AccountName'].setValue('');
            this.contractFormGroup.controls['GroupAccountNumber'].enable();
            this.contractFormGroup.controls['GroupAccountNumber'].setValue('');
            this.contractFormGroup.controls['GroupName'].disable();
            this.contractFormGroup.controls['GroupName'].setValue('');
            this.contractFormGroup.controls['AccountBalance'].disable();
            this.contractFormGroup.controls['AccountBalance'].setValue('');
            this.contractFormGroup.controls['Status'].disable();
            this.contractFormGroup.controls['Status'].setValue('');
            this.contractCommenceDate = null;
            this.commenceDateDisplay = '';
            this.clearDate['contractCommenceDate'] = true;
            this.contractFormGroup.controls['ContractCommenceDate'].setValue(this.commenceDateDisplay);
            this.inactiveEffectDate = null;
            this.inactiveEffectDateDisplay = '';
            this.clearDate['inactiveEffectDate'] = true;
            this.contractFormGroup.controls['InactiveEffectDate'].setValue(this.inactiveEffectDateDisplay);
            this.zone.run(function () {
                _this.dateObjectsEnabled['contractCommenceDate'] = true;
                _this.isAccountEllipsisDisabled = false;
                if (!_this.contractStoreData) {
                    _this.isContractEllipsisDisabled = true;
                }
            });
            if (this.sysCharParams['vSCEnableAutoNumber']) {
                this.contractFormGroup.controls['ContractNumber'].disable();
                this.contractFormGroup.controls['ContractNumber'].setValue('');
            }
            else {
                this.contractFormGroup.controls['ContractNumber'].enable();
                this.contractFormGroup.controls['ContractNumber'].setValue('');
            }
            if (this.isNationalAccount && this.storeData['data'] && this.storeData['data'].NationalAccountchecked && this.storeData['data'].NationalAccountchecked.toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.displayList.nationalAccount = true;
            }
            else {
                this.displayList.nationalAccount = false;
            }
            this.displayList.anyPendingBelow = false;
            this.displayList.lostBusinessDesc1 = false;
            this.displayList.lostBusinessDesc2 = false;
            this.displayList.lostBusinessDesc3 = false;
            this.displayList.expired = false;
            this.displayList.future = false;
            this.isGroupAccountEllipsisDisabled = false;
            this.contractFormGroup.controls['Copy'].enable();
            var focus_2 = new Event('focus', { bubbles: false });
            setTimeout(function () {
                _this.renderer.invokeElementMethod(document.getElementById('ContractName'), 'focus', [focus_2]);
            }, 0);
        }
        if (this.addMode || this.updateMode) {
            this.inputParamsAccount = Object.assign({}, this.inputParamsAccount, {
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business
            });
            this.inputParamsGroupAccount = Object.assign({}, this.inputParamsGroupAccount, {
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business
            });
            this.inputParams = Object.assign({}, this.inputParams, {
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business
            });
        }
        this.formPristine();
    };
    ContractMaintenanceComponent.prototype.buildMenuOptions = function () {
        var optionsList = [
            {
                title: '', list: [{
                        value: 'options',
                        text: 'Options'
                    }]
            },
            { title: 'Portfolio', list: [] },
            { title: 'History', list: [] },
            { title: 'Invoicing', list: [] },
            { title: 'Service', list: [] },
            { title: 'Customer Relations', list: [] }
        ];
        if (this.sysCharParams['vSCMultiContactInd']) {
            optionsList[1].list.push({
                value: 'contacts',
                text: 'Contact Details'
            });
        }
        optionsList[1].list.push({
            value: 'Premises Details',
            text: 'Premises Details'
        });
        optionsList[1].list.push({
            value: 'ServiceCover',
            text: 'Service Covers'
        });
        if (!(this.storeData['params'].parentMode === 'PipelineGrid' || this.storeData['params'].parentMode === 'ProspectPremises')) {
            optionsList[1].list.push({
                value: 'Account Information',
                text: 'Account Information'
            });
            optionsList[1].list.push({
                value: 'Telesales Order',
                text: 'Telesales Order'
            });
            optionsList[2].list.push({
                value: 'History',
                text: 'History'
            });
            optionsList[2].list.push({
                value: 'Event History',
                text: 'Event History'
            });
            optionsList[3].list.push({
                value: 'Pro Rata Charge',
                text: 'Pro Rata Charge'
            });
            optionsList[3].list.push({
                value: 'Invoice Narrative',
                text: 'Invoice Narrative'
            });
            optionsList[3].list.push({
                value: 'Invoice Charge',
                text: 'Invoice Charge'
            });
            optionsList[3].list.push({
                value: 'Invoice History',
                text: 'Invoice History'
            });
            optionsList[4].list.push({
                value: 'Product Summary',
                text: 'Product Summary'
            });
            optionsList[4].list.push({
                value: 'StaticVisits',
                text: 'Static Visits (SOS)'
            });
            optionsList[4].list.push({
                value: 'Visit Summary',
                text: 'Visit Summary'
            });
            optionsList[4].list.push({
                value: 'Service Recommendations',
                text: 'Service Recommendations'
            });
            optionsList[4].list.push({
                value: 'State Of Service',
                text: 'State of Service'
            });
            if (this.sysCharParams['vSCVisitTolerances']) {
                optionsList[4].list.push({
                    value: 'Visit Tolerances',
                    text: 'Visit Tolerances'
                });
            }
            if (this.sysCharParams['vSCInfestationTolerance']) {
                optionsList[4].list.push({
                    value: 'Infestation Tolerances',
                    text: 'Infestation Tolerances'
                });
            }
            if (this.sysCharParams['vShowWasteConsignmentNoteHistory']) {
                optionsList[4].list.push({
                    value: 'Waste Consignment Note History',
                    text: 'Waste Consignment Note History'
                });
            }
            optionsList[5].list.push({
                value: 'Contact Management',
                text: 'Contact Management'
            });
            optionsList[5].list.push({
                value: 'Contact Management Search',
                text: 'Contact Centre Search'
            });
            optionsList[5].list.push({
                value: 'Customer Information',
                text: 'Customer Information'
            });
            optionsList[5].list.push({
                value: 'Prospect Conversion',
                text: 'Prospect Conversion'
            });
        }
        this.options = this.optionsList[0].list[0].value;
        this.optionsList = JSON.parse(JSON.stringify(optionsList));
    };
    ContractMaintenanceComponent.prototype.onCustomerInformationClick = function (event) {
        this.router.navigate(['grid/maintenance/contract/customerinformation'], {
            queryParams: {
                parent: 'contract-maintenance'
            }
        });
    };
    ContractMaintenanceComponent.prototype.onCmdValueClick = function (event) {
        this.router.navigate(['grid/contractmanagement/account/serviceValue'], {
            queryParams: {
                parentMode: 'Contract',
                ContractNumber: this.contractFormGroup.controls['ContractNumber'].value,
                ContractName: this.contractFormGroup.controls['ContractName'].value,
                AccountNumber: this.contractFormGroup.controls['AccountNumber'].value,
                AccountName: this.contractFormGroup.controls['AccountName'].value,
                ContractTypeCode: this.inputParams.currentContractType,
                CurrentContractTypeURLParameter: this.inputParams.currentContractTypeURLParameter
            }
        });
    };
    ContractMaintenanceComponent.prototype.onCopyClick = function (event) {
        var _this = this;
        var isContractEllipsisDisabled = this.isContractEllipsisDisabled;
        this.isCopyClicked = true;
        this.zone.run(function () {
            _this.autoOpenSearch = true;
            _this.isContractEllipsisDisabled = false;
            _this.contractSearchParams['parentMode'] = 'ContractCopy';
            _this.contractSearchParams['showCountry'] = false;
            _this.contractSearchParams['showBusiness'] = false;
            _this.contractSearchParams['business'] = _this.storeData['code'].business;
            _this.contractSearchParams['country'] = _this.storeData['code'].country;
            _this.contractSearchParams.currentContractType = '';
            _this.contractSearchParams['accountNumber'] = _this.contractFormGroup.controls['AccountNumber'].value;
            _this.contractSearchParams['accountName'] = _this.contractFormGroup.controls['AccountName'].value;
            _this.contractSearchParams['isCopy'] = true;
            _this.contractSearchParams['showAddNew'] = false;
        });
        setTimeout(function () {
            _this.isContractEllipsisDisabled = isContractEllipsisDisabled;
            _this.contractSearchParams['showCountry'] = true;
            _this.contractSearchParams['showBusiness'] = true;
            _this.contractSearchParams['parentMode'] = 'ContractSearch';
        }, 100);
    };
    ContractMaintenanceComponent.prototype.onSubmit = function (formdata, valid, event) {
        var _this = this;
        event.preventDefault();
        for (var j in this.displayList) {
            if (this.displayList.hasOwnProperty(j)) {
                var key = j['capitalizeFirstLetter']();
                if (!this.displayList[j]) {
                    if (this.contractFormGroup.controls[key]) {
                        this.contractFormGroup.controls[key].clearValidators();
                    }
                }
            }
        }
        for (var i in this.contractFormGroup.controls) {
            if (this.contractFormGroup.controls.hasOwnProperty(i)) {
                this.contractFormGroup.controls[i].markAsTouched();
                if (this.contractFormGroup.controls[i].errors && this.contractFormGroup.controls[i].value !== '') {
                    this.contractFormGroup.controls[i].clearValidators();
                }
            }
        }
        this.dateObjectsValidate['inactiveEffectDate'] = true;
        this.dateObjectsValidate['contractCommenceDate'] = true;
        setTimeout(function () {
            _this.dateObjectsValidate['inactiveEffectDate'] = false;
            _this.dateObjectsValidate['contractCommenceDate'] = false;
        }, 100);
        this.contractFormGroup.updateValueAndValidity();
        this.store.dispatch({
            type: ContractActionTypes.VALIDATE_FORMS, payload: {
                main: true,
                typeA: true,
                typeB: true,
                typeC: true,
                typeD: true,
                typeE: true
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.FORM_VALIDITY, payload: {
                main: this.contractFormGroup.valid
            }
        });
    };
    ContractMaintenanceComponent.prototype.onSaveFocus = function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        var elemList = document.querySelectorAll('#tabCont .nav-tabs li a');
        var currentSelectedIndex = Array.prototype.indexOf.call(elemList, document.querySelector('#tabCont .nav-tabs li a.active'));
        if (code === 9 && currentSelectedIndex < (elemList.length - 1)) {
            var click = new MouseEvent('click', { bubbles: true });
            this.renderer.invokeElementMethod(elemList[currentSelectedIndex + 1], 'dispatchEvent', [click]);
            setTimeout(function () {
                document.querySelector('#tabCont .tab-content .tab-pane.active .ui-select-toggle, #tabCont .tab-content .tab-pane.active input:not([disabled]), #tabCont .tab-content .tab-pane.active select:not([disabled])')['focus']();
            }, 0);
        }
        return;
    };
    ContractMaintenanceComponent.prototype.onTabSelect = function (event) {
        var _this = this;
        setTimeout(function () {
            _this.setTabAttribute();
        }, 400);
        var tabsElemList = document.querySelectorAll('#tabCont .tab-content .tab-pane');
        for (var i = 0; i < tabsElemList.length; i++) {
            if (tabsElemList[i].querySelectorAll('input.ng-invalid.ng-touched, textarea.ng-invalid.ng-touched').length > 0) {
                if (i === 0) {
                    this.tabsError['tabA'] = true;
                }
                else if (i === 1) {
                    this.tabsError['tabB'] = true;
                }
                else if (i === 2) {
                    this.tabsError['tabC'] = true;
                }
                else if (i === 3) {
                    this.tabsError['tabD'] = true;
                }
                else if (i === 4) {
                    this.tabsError['tabE'] = true;
                }
            }
            else {
                if (i === 0) {
                    this.tabsError['tabA'] = false;
                }
                else if (i === 1) {
                    this.tabsError['tabB'] = false;
                }
                else if (i === 2) {
                    this.tabsError['tabC'] = false;
                }
                else if (i === 3) {
                    this.tabsError['tabD'] = false;
                }
                else if (i === 4) {
                    this.tabsError['tabE'] = false;
                }
            }
        }
    };
    ContractMaintenanceComponent.prototype.onContractNameBlur = function () {
        var _this = this;
        this.contractFormGroup.controls['Copy'].disable();
        setTimeout(function () {
            _this.contractFormGroup.controls['Copy'].enable();
        }, 0);
    };
    ContractMaintenanceComponent.prototype.onContractNameChange = function (event) {
        var _this = this;
        if (!this.sysCharParams['vSCCapitalFirstLtr']) {
            this.contractFormGroup.controls['ContractName'].setValue(this.contractFormGroup.controls['ContractName'].value.toString().capitalizeFirstLetter());
        }
        if (!this.otherParams['disableNameSearch']) {
            if (this.contractFormGroup.controls['ContractName'] && this.contractFormGroup.controls['ContractName'].value !== '') {
                if (this.storeData['params'].parentMode !== 'AddContractFromAccount') {
                    this.fetchContractData('', { action: '0', SearchName: this.contractFormGroup.controls['ContractName'].value }).subscribe(function (e) {
                        if (e && e.status === GlobalConstant.Configuration.Failure) {
                            _this.errorService.emitError(e.oResponse);
                        }
                        else {
                            if (e.errorMessage) {
                                _this.errorService.emitError(e);
                                return;
                            }
                            _this.otherParams['blnContractNameJustSet'] = true;
                            if (e.strFoundAccount.toUpperCase() === GlobalConstant.Configuration.Yes) {
                                _this.accountFound = true;
                                _this.inputParamsAccount.parentMode = 'ContractSearch';
                                _this.inputParamsAccount.searchValue = _this.contractFormGroup.controls['ContractName'].value;
                                _this.autoOpenAccount = true;
                                setTimeout(function () {
                                    _this.autoOpenAccount = false;
                                    _this.inputParamsAccount.parentMode = 'LookUp';
                                    _this.inputParamsAccount.searchValue = '';
                                }, 100);
                            }
                            else {
                                if (_this.contractFormGroup.controls['AccountNumber'] && _this.contractFormGroup.controls['AccountNumber'].value !== '') {
                                    _this.otherParams['disableNameSearch'] = false;
                                }
                                else {
                                    if (_this.sysCharParams['vSCRunPAFSearchOn1stAddressLine']) {
                                        var elemList = document.querySelectorAll('#tabCont .nav-tabs li a');
                                        elemList[0]['click']();
                                        _this.storeData['otherParams']['zipCodeFromOther'] = true;
                                        _this.onGetAddressClick({});
                                    }
                                }
                            }
                        }
                    }, function (error) {
                        _this.errorService.emitError(error);
                    });
                }
            }
        }
    };
    ContractMaintenanceComponent.prototype.accountModalHidden = function (event) {
        var _this = this;
        setTimeout(function () {
            if (_this.accountFound) {
                if (_this.contractFormGroup.controls['AccountNumber'] && _this.contractFormGroup.controls['AccountNumber'].value !== '') {
                    _this.otherParams['disableNameSearch'] = false;
                }
                else {
                    if (_this.sysCharParams['vSCRunPAFSearchOn1stAddressLine']) {
                        var elemList = document.querySelectorAll('#tabCont .nav-tabs li a');
                        elemList[0]['click']();
                        _this.storeData['otherParams']['zipCodeFromOther'] = true;
                        _this.onGetAddressClick({});
                    }
                }
            }
            _this.accountFound = false;
        }, 500);
    };
    ContractMaintenanceComponent.prototype.onGetAddressClick = function (event) {
        if (this.storeData['formGroup'] && !this.storeData['formGroup'].typeA.controls['GetAddress'].disabled) {
            if (this.sysCharParams['vSCEnableHopewiserPAF']) {
            }
            else if (this.sysCharParams['vSCEnableMarktSelect']) {
            }
            else if (this.sysCharParams['vSCEnableDatabasePAF']) {
            }
            this.otherParams['postCodeAutoOpen'] = true;
            this.store.dispatch({ type: ContractActionTypes.SAVE_OTHER_PARAMS, payload: this.otherParams });
        }
    };
    ContractMaintenanceComponent.prototype.onTrialPeriodIndChange = function (event) {
        var _this = this;
        if (this.sysCharParams['vSCEnableTrialPeriodServices']) {
            if (this.contractFormGroup.controls['TrialPeriodInd'] && this.contractFormGroup.controls['TrialPeriodInd'].value) {
                this.otherParams['vTrialPeriodInd'] = true;
                this.storeData['fieldRequired'].typeA.countryCode = false;
                this.storeData['fieldRequired'].typeB.advanceInvoiceInd = false;
                this.storeData['fieldRequired'].typeB.invoiceFrequencyCode = false;
                this.storeData['fieldRequired'].typeB.minimumDurationCode = false;
                this.storeData['fieldRequired'].typeB.minimumExpiryDate = false;
                this.storeData['fieldRequired'].typeB.paymentTypeCode = false;
                this.storeData['fieldRequired'].typeB.invoiceFeeCode = false;
                this.storeData['fieldRequired'].typeC.companyVATNumber = false;
                this.storeData['fieldRequired'].typeC.noticePeriod = false;
                if (this.storeData['formGroup'].typeB.controls['AdvanceInvoiceInd']) {
                    this.storeData['formGroup'].typeB.controls['AdvanceInvoiceInd'].clearValidators();
                }
                if (this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode']) {
                    this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].clearValidators();
                }
                if (this.storeData['formGroup'].typeB.controls['MinimumDurationCode']) {
                    this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].clearValidators();
                }
                if (this.storeData['formGroup'].typeB.controls['PaymentTypeCode']) {
                    this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].clearValidators();
                }
                if (this.storeData['formGroup'].typeB.controls['InvoiceFeeCode']) {
                    this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].clearValidators();
                }
                if (this.storeData['formGroup'].typeC.controls['NoticePeriod']) {
                    this.storeData['formGroup'].typeC.controls['NoticePeriod'].clearValidators();
                }
                if (this.storeData['formGroup'].typeC.controls['CompanyVATNumber']) {
                    this.storeData['formGroup'].typeC.controls['CompanyVATNumber'].clearValidators();
                }
                this.storeData['formGroup'].typeB.updateValueAndValidity();
                this.storeData['formGroup'].typeC.updateValueAndValidity();
            }
            else {
                this.otherParams['vTrialPeriodInd'] = false;
                this.storeData['fieldRequired'].typeA.countryCode = true;
                this.storeData['fieldRequired'].typeB.advanceInvoiceInd = true;
                this.storeData['fieldRequired'].typeB.invoiceFrequencyCode = true;
                this.storeData['fieldRequired'].typeB.minimumDurationCode = true;
                this.storeData['fieldRequired'].typeB.minimumExpiryDate = true;
                this.storeData['fieldRequired'].typeB.paymentTypeCode = true;
                this.storeData['fieldRequired'].typeC.companyVATNumber = true;
                if (this.storeData['formGroup'].typeB.controls['PaymentTypeCode']) {
                    this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].setValidators(Validators.required);
                }
                if (this.storeData['formGroup'].typeB.controls['AdvanceInvoiceInd']) {
                    this.storeData['formGroup'].typeB.controls['AdvanceInvoiceInd'].setValidators(Validators.required);
                }
                if (this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode']) {
                    this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].setValidators(Validators.required);
                }
                if (this.storeData['formGroup'].typeB.controls['MinimumDurationCode']) {
                    this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].setValidators(Validators.required);
                }
                if (this.storeData['formGroup'].typeC.controls['CompanyVATNumber']) {
                    this.storeData['formGroup'].typeC.controls['CompanyVATNumber'].setValidators(Validators.required);
                }
                this.storeData['formGroup'].typeB.updateValueAndValidity();
                this.storeData['formGroup'].typeC.updateValueAndValidity();
            }
            if (this.otherParams['vTrialPeriodInd'] && !this.contractFormGroup.controls['TrialPeriodInd'].value && this.otherParams['vSaveUpdate'] === true) {
                this.errorService.emitError({
                    errorMessage: MessageConstant.Message.TrialSwitchedOff
                });
            }
            else {
                this.displayList.trialPeriodInd = false;
                this.storeData['formGroup'].typeB.controls['InvoiceAnnivDate'].enable();
                this.fetchContractDataPost('UpdateContractTrialInd', { action: '7' }, { ContractNumber: this.contractFormGroup.controls['ContractNumber'].value }).subscribe(function (e) {
                    if (e.status === GlobalConstant.Configuration.Failure) {
                        _this.errorService.emitError(e.oResponse);
                    }
                }, function (error) {
                    _this.errorService.emitError(error);
                });
            }
        }
    };
    ContractMaintenanceComponent.prototype.onContractNumberBlur = function (event, mode) {
        var _this = this;
        if (event.target && this.addMode === true) {
            return;
        }
        if (this.contractFormGroup.controls['ContractNumber'].value !== '') {
            if (this.storeData['data'] && !(Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object)) {
                if (event.target && this.contractFormGroup.controls['ContractNumber'].value === this.storeData['data'].ContractNumber) {
                    return;
                }
                else if (!event.target) {
                    if (this.storeData['sentFromParent'].ContractNumber && this.storeData['data'].ContractNumber !== this.storeData['sentFromParent'].ContractNumber) {
                        this.storeData['data'].ContractNumber = this.storeData['sentFromParent'].ContractNumber;
                    }
                    if (mode) {
                        this.onContractDataReceived(this.storeData['data'], false, mode);
                    }
                    else {
                        this.onContractDataReceived(this.storeData['data'], false);
                    }
                    return;
                }
            }
            var paddedValue = this.numberPadding(this.contractFormGroup.controls['ContractNumber'].value, 8);
            this.contractFormGroup.controls['ContractNumber'].setValue(paddedValue);
            this.fetchContractData('', { ContractNumber: paddedValue, ContractTypeCode: this.inputParams.currentContractType }).subscribe(function (e) {
                if (e.status === GlobalConstant.Configuration.Failure) {
                    _this.errorService.emitError(e.oResponse);
                }
                else {
                    if (!e['errorMessage'] && !e['error']) {
                        if (mode) {
                            _this.onContractDataReceived(e, false, mode);
                        }
                        else {
                            _this.onContractDataReceived(e, false);
                        }
                    }
                    else {
                        _this.errorService.emitError(e);
                        return;
                    }
                }
            });
        }
    };
    ContractMaintenanceComponent.prototype.setValueInControls = function (control, value) {
        if (control) {
            control.setValue(value);
        }
    };
    ContractMaintenanceComponent.prototype.checkFalsy = function (value) {
        if (value === null || value === undefined) {
            return '';
        }
        else {
            return value.toString().trim();
        }
    };
    ContractMaintenanceComponent.prototype.onAccountBlur = function (event) {
        var _this = this;
        this.store.dispatch({
            type: ContractActionTypes.SAVE_FIELD, payload: {
                AccountNumber: this.contractFormGroup.controls['AccountNumber'].value
            }
        });
        if (this.contractFormGroup.controls['AccountNumber'].value) {
            var paddedValue = this.numberPadding(this.contractFormGroup.controls['AccountNumber'].value, 9);
            this.contractFormGroup.controls['AccountNumber'].setValue(paddedValue);
            var params = {
                'AccountNumber': this.contractFormGroup.controls['AccountNumber'].value,
                'Function': 'GetAccountDetails,GetExistingMandate,GetDefaults,GetPaymentTypeDetails,GetNoticePeriod,GetAccountDiscounts',
                'CompanyCode': this.storeData['formGroup'].typeC.controls['CompanyCode'] ? this.storeData['formGroup'].typeC.controls['CompanyCode'].value : '',
                'ContractTypeCode': this.inputParams.currentContractType,
                'PaymentTypeCode': this.storeData['formGroup'].typeB.controls['PaymentTypeCode'] ? this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].value : '',
                'ContractNumber': this.contractFormGroup.controls['ContractNumber'] ? this.contractFormGroup.controls['ContractNumber'].value : '',
                'BranchNumber': this.contractFormGroup.controls['NegBranchNumber'] ? this.contractFormGroup.controls['NegBranchNumber'].value : '',
                'action': '6'
            };
            this.ajaxSource.next(this.ajaxconstant.START);
            this.fetchAccountData(params, this.queryParamsContract).subscribe(function (e) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                if (e && !e.errorNumber) {
                    _this.contractFormGroup.controls['ContractName'].setValue(_this.checkFalsy(e.ContractName));
                    _this.contractFormGroup.controls['AccountName'].setValue(_this.checkFalsy(e.ContractName));
                    _this.setValueInControls(_this.storeData['formGroup'].typeA.controls['ContractAddressLine1'], _this.checkFalsy(e.ContractAddressLine1));
                    _this.setValueInControls(_this.storeData['formGroup'].typeA.controls['ContractAddressLine2'], _this.checkFalsy(e.ContractAddressLine2));
                    _this.setValueInControls(_this.storeData['formGroup'].typeA.controls['ContractAddressLine3'], _this.checkFalsy(e.ContractAddressLine3));
                    _this.setValueInControls(_this.storeData['formGroup'].typeA.controls['ContractAddressLine4'], _this.checkFalsy(e.ContractAddressLine4));
                    _this.setValueInControls(_this.storeData['formGroup'].typeA.controls['ContractAddressLine5'], _this.checkFalsy(e.ContractAddressLine5));
                    _this.setValueInControls(_this.storeData['formGroup'].typeA.controls['ContractPostcode'], _this.checkFalsy(e.ContractPostcode));
                    _this.setValueInControls(_this.storeData['formGroup'].typeA.controls['GPSCoordinateX'], _this.checkFalsy(e.GPSCoordinateX));
                    _this.setValueInControls(_this.storeData['formGroup'].typeA.controls['GPSCoordinateY'], _this.checkFalsy(e.GPSCoordinateY));
                    _this.setValueInControls(_this.storeData['formGroup'].typeA.controls['ContractContactName'], _this.checkFalsy(e.ContractContactName));
                    _this.setValueInControls(_this.storeData['formGroup'].typeA.controls['ContractContactPosition'], _this.checkFalsy(e.ContractContactPosition));
                    _this.setValueInControls(_this.storeData['formGroup'].typeA.controls['ContractContactDepartment'], _this.checkFalsy(e.ContractContactDepartment));
                    _this.setValueInControls(_this.storeData['formGroup'].typeA.controls['ContractContactTelephone'], _this.checkFalsy(e.ContractContactTelephone));
                    _this.setValueInControls(_this.storeData['formGroup'].typeA.controls['ContractContactFax'], _this.checkFalsy(e.ContractContactFax));
                    _this.setValueInControls(_this.storeData['formGroup'].typeA.controls['ContractContactEmail'], _this.checkFalsy(e.ContractContactEmail));
                    _this.setValueInControls(_this.storeData['formGroup'].typeA.controls['ContractContactMobile'], _this.checkFalsy(e.ContractContactMobile));
                    _this.setValueInControls(_this.storeData['formGroup'].typeC.controls['SalesEmployee'], _this.checkFalsy(e.ContractSalesEmployee));
                    _this.setValueInControls(_this.storeData['formGroup'].typeC.controls['SalesEmployeeSurname'], _this.checkFalsy(e.SalesEmployeeSurname));
                    _this.setValueInControls(_this.storeData['formGroup'].typeC.controls['ContractOwner'], _this.checkFalsy(e.ContractOwner));
                    _this.setValueInControls(_this.storeData['formGroup'].typeC.controls['ContractOwnerSurname'], _this.checkFalsy(e.ContractOwnerSurname));
                    _this.setValueInControls(_this.storeData['formGroup'].typeC.controls['CompanyVatNumber'], _this.checkFalsy(e.CompanyVATNumber));
                    _this.setValueInControls(_this.storeData['formGroup'].typeC.controls['CompanyRegistrationNumber'], _this.checkFalsy(e.CompanyRegistrationNumber));
                    if (_this.sysCharParams['vSCNationalAccountChecked'] && (e.NationalAccountchecked && e.NationalAccountchecked.toUpperCase() === GlobalConstant.Configuration.Yes)) {
                        _this.isNationalAccount = true;
                        _this.displayList.nationalAccount = true;
                    }
                    else {
                        _this.isNationalAccount = false;
                        _this.displayList.nationalAccount = false;
                    }
                    if (e.ContractHasExpired && e.ContractHasExpired.toUpperCase() === GlobalConstant.Configuration.Yes) {
                        _this.displayList.expired = true;
                    }
                    else {
                        _this.displayList.expired = false;
                    }
                    _this.setValueInControls(_this.contractFormGroup.controls['NationalAccountchecked'], e.NationalAccountchecked);
                    if (e.GroupAccountNumber !== '') {
                        _this.setValueInControls(_this.contractFormGroup.controls['GroupAccountNumber'], e.GroupAccountNumber);
                        _this.setValueInControls(_this.contractFormGroup.controls['GroupName'], e.GroupName);
                    }
                    else {
                        _this.setValueInControls(_this.contractFormGroup.controls['GroupAccountNumber'], '');
                        _this.setValueInControls(_this.contractFormGroup.controls['GroupName'], '');
                    }
                    _this.setValueInControls(_this.storeData['formGroup'].typeB.controls['BankAccountSortCode'], e.BankAccountSortCode);
                    _this.setValueInControls(_this.storeData['formGroup'].typeB.controls['BankAccountNumber'], e.BankAccountNumber);
                    _this.setValueInControls(_this.storeData['formGroup'].typeC.controls['ExternalReference'], e.ExternalReference);
                    if (e.VATExempt && e.VATExempt.toUpperCase() === GlobalConstant.Configuration.Yes) {
                        _this.setValueInControls(_this.storeData['formGroup'].typeB.controls['VATExempt'], true);
                    }
                    else {
                        _this.setValueInControls(_this.storeData['formGroup'].typeB.controls['VATExempt'], false);
                    }
                    _this.setValueInControls(_this.storeData['formGroup'].typeB.controls['PaymentTypeCode'], e.PaymentTypeCode);
                    _this.setValueInControls(_this.storeData['formGroup'].typeB.controls['PaymentDesc'], e.PaymentDesc);
                    _this.otherParams['PaymentDesc'] = e.PaymentDesc;
                    _this.setValueInControls(_this.storeData['formGroup'].typeB.controls['VADDMandateNumber'], e.VADDMandateNumber);
                    _this.setValueInControls(_this.storeData['formGroup'].typeB.controls['VADDBranchNumber'], e.VADDBranchNumber);
                    _this.setValueInControls(_this.storeData['formGroup'].typeC.controls['CompanyRegistrationNumber'], e.CompanyRegistrationNumber);
                    if (e.LimitedCompanyInd && e.LimitedCompanyInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                        _this.setValueInControls(_this.storeData['formGroup'].typeC.controls['LimitedCompany'], true);
                    }
                    else {
                        _this.setValueInControls(_this.storeData['formGroup'].typeC.controls['LimitedCompany'], false);
                    }
                    _this.storeData['fieldVisibility'].typeB.invoiceFeeCode = false;
                    _this.storeData['fieldRequired'].typeB.invoiceFeeCode = false;
                    _this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].clearValidators();
                    _this.storeData['formGroup'].typeA.controls['GetAddress'].disable();
                    _this.fetchDefaultEmployee();
                    _this.store.dispatch({
                        type: ContractActionTypes.PARENT_TO_CHILD_COMPONENT, payload: e
                    });
                }
                else {
                    _this.storeData['fieldVisibility'].typeB.invoiceFeeCode = false;
                    _this.storeData['fieldRequired'].typeB.invoiceFeeCode = false;
                    _this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].clearValidators();
                    _this.storeData['formGroup'].typeA.controls['GetAddress'].disable();
                    _this.errorService.emitError(e);
                }
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.errorService.emitError(error);
            });
            var data = [{
                    'table': 'Account',
                    'query': { 'BusinessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode(), 'AccountNumber': this.contractFormGroup.controls['AccountNumber'] ? this.contractFormGroup.controls['AccountNumber'].value : '' },
                    'fields': ['NationalAccount', 'AccountBalance']
                }];
            this.lookUpRecord(data, 5).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        _this.contractFormGroup.controls['AccountBalance'].setValue(e['results'][0][0]['AccountBalance']);
                    }
                }
            }, function (error) {
            });
        }
        else {
            this.contractFormGroup.controls['AccountName'].setValue('');
            this.contractSearchParams['accountNumber'] = '';
            this.contractSearchParams['accountName'] = '';
            this.storeData['fieldVisibility'].typeB.invoiceFeeCode = true;
            this.storeData['fieldRequired'].typeB.invoiceFeeCode = true;
            this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].setValidators(Validators.required);
            if (this.sysCharParams['vSCEnableInvoiceFee'] && this.storeData['params']['currentContractType'] === 'C') {
                this.storeData['fieldVisibility'].typeB.invoiceFeeCode = true;
                this.storeData['fieldRequired'].typeB.invoiceFeeCode = true;
                this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].setValidators(Validators.required);
            }
            else {
                this.storeData['fieldVisibility'].typeB.invoiceFeeCode = false;
                this.storeData['fieldRequired'].typeB.invoiceFeeCode = false;
                this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].clearValidators();
            }
            this.storeData['formGroup'].typeA.controls['GetAddress'].enable();
        }
    };
    ContractMaintenanceComponent.prototype.fetchDefaultEmployee = function () {
        var _this = this;
        this.fetchContractData('DefaultFromPostcode', {
            action: '6',
            BranchNumber: this.contractFormGroup.controls['NegBranchNumber'] ? this.contractFormGroup.controls['NegBranchNumber'].value : this.otherParams['currentBranchNumber'],
            ContractPostcode: this.storeData['formGroup'].typeA.controls['ContractPostcode'] ? this.storeData['formGroup'].typeA.controls['ContractPostcode'].value : '',
            ContractAddressLine4: this.storeData['formGroup'].typeA.controls['ContractAddressLine4'] ? this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value : '',
            ContractAddressLine5: this.storeData['formGroup'].typeA.controls['ContractAddressLine5'] ? this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value : ''
        }).subscribe(function (data) {
            if (data.status === GlobalConstant.Configuration.Failure) {
            }
            else {
                if (!data.errorMessage) {
                    if (_this.storeData['formGroup'].typeC.controls['SalesEmployee']) {
                        _this.storeData['formGroup'].typeC.controls['SalesEmployee'].setValue(data.ContractSalesEmployee);
                    }
                    if (_this.storeData['formGroup'].typeC.controls['SalesEmployeeSurname']) {
                        _this.storeData['formGroup'].typeC.controls['SalesEmployeeSurname'].setValue(data.SalesEmployeeSurname);
                    }
                }
            }
        }, function (error) {
        });
    };
    ContractMaintenanceComponent.prototype.fetchContractCopy = function (contractNumer) {
        this.getContractCopyData({
            Function: 'ContractCopy',
            FunctionName: 'ContractCopy',
            action: '0',
            ContractNumber: contractNumer ? contractNumer : this.contractFormGroup.controls['ContractNumber'].value
        }).subscribe(function (data) {
            if (data.status === GlobalConstant.Configuration.Failure) {
            }
            else {
                console.log(data);
            }
        }, function (error) {
        });
    };
    ContractMaintenanceComponent.prototype.onGroupAccountBlur = function (event) {
        var _this = this;
        if (this.contractFormGroup.controls['GroupAccountNumber'].value && this.contractFormGroup.controls['GroupAccountNumber'].value !== '') {
            var data = [{
                    'table': 'GroupAccount',
                    'query': { 'GroupAccountNumber': this.contractFormGroup.controls['GroupAccountNumber'].value },
                    'fields': ['GroupAccountNumber', 'GroupName']
                },
                {
                    'table': 'GroupAccountPriceGroup',
                    'query': {
                        'GroupAccountPriceGroupID': this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'] ? this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value : '',
                        'GroupAccountNumber': this.contractFormGroup.controls['GroupAccountNumber'].value
                    },
                    'fields': ['GroupAccountPriceGroupID', 'GroupAccountPriceGroupDesc']
                }];
            this.lookUpRecord(data, 5).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        _this.contractFormGroup.controls['GroupName'].setValue(e['results'][0][0]['GroupName']);
                        if (e['results'][1].length > 0) {
                            if (_this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value !== '') {
                                _this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupDesc'].setValue(e['results'][1][0]['GroupAccountPriceGroupDesc']);
                            }
                        }
                        else {
                            if (_this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value !== '') {
                                _this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupDesc'].setValue('');
                                _this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].setErrors({});
                            }
                        }
                    }
                    else {
                        _this.contractFormGroup.controls['GroupName'].setValue('');
                        _this.contractFormGroup.controls['GroupAccountNumber'].setErrors({});
                        if (_this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value !== '') {
                            _this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].setErrors({});
                            _this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupDesc'].setValue('');
                        }
                    }
                }
                else {
                    _this.contractFormGroup.controls['GroupAccountNumber'].setErrors({});
                    _this.contractFormGroup.controls['GroupName'].setValue('');
                }
            }, function (error) {
                _this.contractFormGroup.controls['GroupAccountNumber'].setErrors({});
                _this.contractFormGroup.controls['GroupName'].setValue('');
            });
        }
        else {
            this.contractFormGroup.controls['GroupName'].setValue('');
        }
    };
    ContractMaintenanceComponent.prototype.onNegBranchNumberBlur = function (event) {
        var found = false;
        for (var i = 0; i < this.branchList.length; i++) {
            if (this.contractFormGroup.controls['NegBranchNumber'].value === this.branchList[i].branchNumber.toString()) {
                this.contractFormGroup.controls['BranchName'].setValue(this.branchList[i].branchName);
                this.negBranchNumberSelected = {
                    id: '',
                    text: this.contractFormGroup.controls['NegBranchNumber'].value + ' - ' + this.contractFormGroup.controls['BranchName'].value
                };
                found = true;
            }
        }
        if (!found) {
            this.contractFormGroup.controls['NegBranchNumber'].setValue('');
            this.contractFormGroup.controls['BranchName'].setValue('');
        }
    };
    ContractMaintenanceComponent.prototype.onBranchDataReceived = function (data) {
        this.contractFormGroup.controls['NegBranchNumber'].setValue(data.BranchNumber);
        this.contractFormGroup.controls['BranchName'].setValue(data.BranchName);
        this.contractFormGroup.controls['NegBranchNumber'].markAsDirty();
        if (this.addMode)
            this.fetchDefaultEmployee();
        this.store.dispatch({
            type: ContractActionTypes.SET_EMPLOYEE_ON_BRANCH_CHANGE
        });
    };
    ContractMaintenanceComponent.prototype.numberPadding = function (num, size) {
        var s = num + '';
        while (s.length < size)
            s = '0' + s;
        return s;
    };
    ContractMaintenanceComponent.prototype.setTabAttribute = function () {
        var elements = document.querySelectorAll('#tabCont ul.nav-tabs li:not(.active) a');
        var activeElem = document.querySelector('#tabCont ul.nav-tabs li.active a');
        for (var i = 0; i < elements.length; i++) {
            elements[i].setAttribute('tabindex', '-1');
        }
        if (activeElem)
            activeElem.removeAttribute('tabindex');
    };
    ContractMaintenanceComponent.prototype.commenceDateService = function () {
        var _this = this;
        if (this.commenceDateDisplay && (this.addMode)) {
            var functionName = '';
            var params = {};
            var obj = {};
            var serviceObj = {};
            if (this.storeData['params']['currentContractType'] === 'C') {
                functionName = 'GetAnniversaryDate,GetMinimumExpiryDate,GetExpiryDate';
            }
            else if (this.storeData['params']['currentContractType'] === 'J') {
                functionName = 'GetAnniversaryDate,GetJobExpiryDate';
            }
            else if (this.storeData['params']['currentContractType'] === 'P') {
                functionName = 'GetAnniversaryDate,GetPaymentTypeDetails,GetNoticePeriod';
            }
            obj = {
                action: '6',
                ContractCommenceDate: this.contractFormGroup.controls['ContractCommenceDate'].value ? this.contractFormGroup.controls['ContractCommenceDate'].value : '',
                MinimumDurationCode: this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].value ? this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].value : '',
                ContractDurationCode: this.storeData['formGroup'].typeB.controls['ContractDurationCode'].value ? this.storeData['formGroup'].typeB.controls['ContractDurationCode'].value : '',
                CompanyCode: this.storeData['formGroup'].typeC.controls['CompanyCode'].value ? this.storeData['formGroup'].typeC.controls['CompanyCode'].value : ''
            };
            for (var o in obj) {
                if (obj[o] !== '') {
                    serviceObj[o] = obj[o];
                }
            }
            this.fetchContractData(functionName, serviceObj).subscribe(function (e) {
                if (e.status === GlobalConstant.Configuration.Failure) {
                    _this.errorService.emitError(e.oResponse);
                }
                else {
                    if (!e['errorMessage']) {
                        _this.store.dispatch({
                            type: ContractActionTypes.PARENT_TO_CHILD_COMPONENT, payload: e
                        });
                    }
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    ContractMaintenanceComponent.prototype.commenceDateSelectedValue = function (value) {
        if (value && value['value']) {
            this.commenceDateDisplay = value['value'];
            this.contractFormGroup.controls['ContractCommenceDate'].setValue(this.commenceDateDisplay);
        }
        else {
            this.commenceDateDisplay = '';
            this.contractFormGroup.controls['ContractCommenceDate'].setValue('');
        }
        this.contractFormGroup.controls['ContractCommenceDate'].markAsDirty();
        this.commenceDateService();
    };
    ContractMaintenanceComponent.prototype.inactiveEffectDateSelectedValue = function (value) {
        if (value && value['value']) {
            this.inactiveEffectDateDisplay = value['value'];
        }
        else {
            this.inactiveEffectDateDisplay = '';
        }
    };
    ContractMaintenanceComponent.prototype.formPristine = function () {
        if (this.storeData['formGroup'].main)
            this.storeData['formGroup'].main.markAsPristine();
        if (this.storeData['formGroup'].typeA)
            this.storeData['formGroup'].typeA.markAsPristine();
        if (this.storeData['formGroup'].typeB)
            this.storeData['formGroup'].typeB.markAsPristine();
        if (this.storeData['formGroup'].typeC)
            this.storeData['formGroup'].typeC.markAsPristine();
        if (this.storeData['formGroup'].typeD)
            this.storeData['formGroup'].typeD.markAsPristine();
        if (this.storeData['formGroup'].typeE)
            this.storeData['formGroup'].typeE.markAsPristine();
    };
    ContractMaintenanceComponent.prototype.checkFormDirty = function () {
        if (this.storeData['formGroup'].main && this.storeData['formGroup'].main.dirty)
            return true;
        if (this.storeData['formGroup'].typeA && this.storeData['formGroup'].typeA.dirty)
            return true;
        if (this.storeData['formGroup'].typeB && this.storeData['formGroup'].typeB.dirty)
            return true;
        if (this.storeData['formGroup'].typeC && this.storeData['formGroup'].typeC.dirty)
            return true;
        if (this.storeData['formGroup'].typeD && this.storeData['formGroup'].typeD.dirty)
            return true;
        if (this.storeData['formGroup'].typeE && this.storeData['formGroup'].typeE.dirty)
            return true;
        return false;
    };
    ContractMaintenanceComponent.prototype.canDeactivate = function () {
        if (this.navigateToPremise) {
            this.routeAwayGlobals.resetRouteAwayFlags();
            this.navigateToPremise = false;
        }
        else {
            this.routeAwayGlobals.setSaveEnabledFlag(this.checkFormDirty());
        }
        return this.routeAwayComponent.canDeactivate();
    };
    ContractMaintenanceComponent.prototype.routeAwayUpdateSaveFlag = function () {
        this.routeAwayGlobals.setDirtyFlag(true);
    };
    ContractMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-contract-maintenance',
                    templateUrl: 'iCABSAContractMaintenance.html',
                    providers: [ErrorService, MessageService],
                    styles: ["\n\n  .back-red {\n    background-color: #EB2A1E;\n    padding-bottom: 0.5em;\n  }\n\n  .back-green {\n    background-color: #33FF33;\n    padding-bottom: 0.5em;\n  }\n\n  .back-orange {\n    background-color: #EBA31E;\n    padding-bottom: 0.5em;\n  }\n\n  .tabs-cont {\n    -webkit-transition: opacity 0.2s;\n    transition: opacity 0.2s;\n    opacity: 1;\n    min-height: 400px;\n  }\n  .no-opacity {\n    opacity: 0;\n  }\n  "]
                },] },
    ];
    ContractMaintenanceComponent.ctorParameters = [
        { type: Router, },
        { type: ActivatedRoute, },
        { type: ComponentInteractionService, },
        { type: NgZone, },
        { type: HttpService, },
        { type: Renderer, },
        { type: FormBuilder, },
        { type: ServiceConstants, },
        { type: ErrorService, },
        { type: MessageService, },
        { type: RiExchange, },
        { type: AuthService, },
        { type: AjaxObservableConstant, },
        { type: Title, },
        { type: SysCharConstants, },
        { type: Store, },
        { type: TranslateService, },
        { type: LocaleTranslationService, },
        { type: Utils, },
        { type: RouteAwayGlobals, },
        { type: Location, },
        { type: CBBService, },
    ];
    ContractMaintenanceComponent.propDecorators = {
        'container': [{ type: ViewChild, args: ['topContainer',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'promptConfirmModal': [{ type: ViewChild, args: ['promptConfirmModal',] },],
        'tabCont': [{ type: ViewChild, args: ['tabCont',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return ContractMaintenanceComponent;
}());
