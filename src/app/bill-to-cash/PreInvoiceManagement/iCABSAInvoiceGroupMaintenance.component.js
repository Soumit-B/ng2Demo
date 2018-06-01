import { RouteAwayGlobals } from './../../../shared/services/route-away-global.service';
import { Component, ViewChild, Renderer } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { FormBuilder, Validators } from '@angular/forms';
import { BillToCashConstants } from '../bill-to-cash-constants';
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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { InvoiceGroupGridComponent } from './../../internal/grid-search/iCABSAInvoiceGroupGrid';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { AccountSearchComponent } from './../../internal/search/iCABSASAccountSearch';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { CBBService } from './../../../shared/services/cbb.service';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { StaticUtils } from './../../../shared/services/static.utility';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
export var InvoiceGroupMaintenanceComponent = (function () {
    function InvoiceGroupMaintenanceComponent(store, contactStore, serviceConstants, httpService, formBuilder, sysCharConstants, utils, riExchange, globalConstant, router, messageService, logger, activatedRoute, ajaxconstant, localeTranslateService, cbbService, renderer, routeAwayGlobals) {
        var _this = this;
        this.store = store;
        this.contactStore = contactStore;
        this.serviceConstants = serviceConstants;
        this.httpService = httpService;
        this.formBuilder = formBuilder;
        this.sysCharConstants = sysCharConstants;
        this.utils = utils;
        this.riExchange = riExchange;
        this.globalConstant = globalConstant;
        this.router = router;
        this.messageService = messageService;
        this.logger = logger;
        this.activatedRoute = activatedRoute;
        this.ajaxconstant = ajaxconstant;
        this.localeTranslateService = localeTranslateService;
        this.cbbService = cbbService;
        this.renderer = renderer;
        this.routeAwayGlobals = routeAwayGlobals;
        this.autoOpen = false;
        this.ajaxSource = new BehaviorSubject(0);
        this.isRequesting = false;
        this.isAccountNumberDisable = false;
        this.storeFormValidKey = 'main';
        this.invoiceGroupNumberShowHide = true;
        this.showMessageHeader = true;
        this.showErrorHeader = true;
        this.disableForm = true;
        this.fieldsNotToSave = [
            'CurrencyDesc',
            'LanguageDescription',
            'InvoiceFeeDesc',
            'PaymentDesc',
            'PaymentTermDesc',
            'CurrencyDesc',
            'CollectFromName'
        ];
        this.paramsWithDifferentNames = {
            InvoiceFormatCode: 'SystemInvoiceFormatCode',
            InvoiceLanguageCode: 'LanguageCode'
        };
        this.fieldsToCapitialize = [
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
        this.tabNameList = [
            'AddressInvoice',
            'AddressStatement',
            'General',
            'EDIInvoicing'
        ];
        this.isInvoiceGroupNumberDisabled = true;
        this.invoiceGroupGridComponent = InvoiceGroupGridComponent;
        this.accountSearchComponent = AccountSearchComponent;
        this.premiseSearchComponent = PremiseSearchComponent;
        this.ellipsisQueryParams = {
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
        this.showHeader = true;
        this.showCloseButton = true;
        this.isPremisesSearchHidden = true;
        this.queryParams = {
            AccountNumber: '',
            AccountName: '',
            InvoiceGroupNumber: ''
        };
        this.showPromptMessageHeader = true;
        this.optionsList = StaticUtils.deepCopy(BillToCashConstants.c_o_MENU_OPTIONS_LIST);
        this.tabList = BillToCashConstants.c_o_TAB_LIST;
        this.componentList = [AddressInvoiceTabComponent,
            AddressStatementTabComponent,
            GeneralTabComponent,
            EDIInvoicingTabComponent];
        this.riExchange.getStore('invoice');
        this.modalConfig = BillToCashConstants.c_o_ELLIPSIS_MODAL_CONFIG;
        this.contactStoreSubscription = this.store.select('contact').subscribe(function (data) {
            _this.getContactDetails(data);
        });
        this.storeSubscription = this.store.select('invoice').subscribe(function (data) {
            _this.storeUpdateHandler(data);
        });
        this.sysCharParams = BillToCashConstants.c_o_SYSCHAR_PARAMS['InvoiceGroupMaintenance'];
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.ajaxSubscription = this.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                switch (event) {
                    case _this.ajaxconstant.START:
                        _this.isRequesting = true;
                        break;
                    case _this.ajaxconstant.COMPLETE:
                        _this.isRequesting = false;
                        break;
                }
            }
        });
    }
    InvoiceGroupMaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.modalConfig = BillToCashConstants.c_o_ELLIPSIS_MODAL_CONFIG;
        this.buidForm();
        this.setInvoiceData(this.storeInvoice, true);
        this.routeSubscription = this.activatedRoute.queryParams.subscribe(function (data) {
            _this.parentModeFromURL = data;
            _this.queryParams['parentMode'] = data['parentMode'];
            if (!_this.invoiceFormGroup) {
                return;
            }
            if (data.hasOwnProperty('AccountNumber')) {
                _this.ellipsisQueryParams.inputParamsAccountNumber.autoOpen = false;
                _this.queryParams['AccountNumber'] = data['AccountNumber'];
                _this.invoiceFormGroup.controls['AccountNumber'].setValue(data['AccountNumber']);
            }
            if (data.hasOwnProperty('AccountName')) {
                _this.queryParams['AccountName'] = data['AccountName'];
                _this.invoiceFormGroup.controls['AccountName'].setValue(data['AccountName']);
            }
            if (data.hasOwnProperty('InvoiceGroupNumber')) {
                _this.queryParams['InvoiceGroupNumber'] = data['InvoiceGroupNumber'];
                _this.isInvoiceGroupNumberDisabled = false;
                _this.invoiceFormGroup.controls['InvoiceGroupNumber'].enable();
                _this.onInvoiceGroupNumberReceived({
                    'Number': data['InvoiceGroupNumber']
                });
            }
            if (data.hasOwnProperty('IGParentMode')) {
                _this.queryParams['IGParentMode'] = data['IGParentMode'];
                _this.queryParams['ContractNumber'] = data['ContractNumber'];
                _this.queryParams['PremiseNumber'] = data['PremiseNumber'];
                _this.queryParams['currentContractType'] = data['currentContractType'];
            }
            if (_this.queryParams['parentMode'] === 'IGSearchAdd') {
                _this.isAccountNumberDisable = true;
                _this.invoiceFormGroup.controls['AccountNumber'].disable();
                _this.isInvoiceGroupNumberDisabled = true;
                _this.invoiceFormGroup.controls['InvoiceGroupNumber'].disable();
                _this.setFormMode();
            }
        });
    };
    InvoiceGroupMaintenanceComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.getSysChar();
        this.messageService.emitMessage(0);
        this.messageSubscription = this.messageService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
            }
        });
        this.localeTranslateService.setUpTranslation();
        if (this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['AddressSelected']]
            || this.parentModeFromURL['parentMode'] === 'contact') {
            if (this.parentModeFromURL['parentMode'] === 'contact') {
                var contactData = this.contactStore['data'];
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
        var parentMode = this.queryParams['parentMode'];
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
    };
    InvoiceGroupMaintenanceComponent.prototype.ngOnDestroy = function () {
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
    };
    InvoiceGroupMaintenanceComponent.prototype.setEllipsisParams = function () {
        for (var key in this.ellipsisQueryParams) {
            if (!key) {
                continue;
            }
            this.ellipsisQueryParams[key]['parentMode'] = this.ellipsisQueryParams[key].parentMode;
            this.ellipsisQueryParams[key][this.serviceConstants.BusinessCode] = this.utils.getBusinessCode();
            this.ellipsisQueryParams[key][this.serviceConstants.CountryCode] = this.utils.getCountryCode();
        }
    };
    InvoiceGroupMaintenanceComponent.prototype.storeUpdateHandler = function (data) {
        this.storeMode = {};
        this.storeCode = {};
        this.storeSentFromParent = {};
        this.storeParams = {};
        this.storeInvoice = {};
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
                this.setFormData();
                this.getDetails();
                break;
            case InvoiceActionTypes.SAVE_MODE:
                this.storeMode = data['mode'];
                var disableCBB = false;
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
                this.setDetailsInForms();
                break;
            case InvoiceActionTypes.SEND_DATA_FROM_PARENT:
                this.storeSentFromParent = data['sentFromParent'];
                this.setFormMode();
                break;
            case InvoiceActionTypes.CHECK_LIVE_INVOICE:
                this.isLiveInvoice();
                break;
            case InvoiceActionTypes.NAVIGATE:
                this.navigateAway(data['navigateTo']);
                break;
            case InvoiceActionTypes.SET_FORM_GROUPS:
                this.storeFormGroup = data['formGroup'];
                break;
            case InvoiceActionTypes.DISPATCH_ERROR:
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
                this.ellipsisQueryParams.inputParamsInvoiceGroupNumber[this.serviceConstants.AccountNumber] = this.storeInvoice['AccountNumber'];
                this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountName'] = this.invoiceFormGroup.controls['AccountName'].value;
                this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountNumberChanged'] = true;
                this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['parentMode'] = 'InvoiceGroupMaintenance';
                this.invoiceGroupEllipsis.childConfigParams = this.ellipsisQueryParams.inputParamsInvoiceGroupNumber;
                break;
        }
    };
    InvoiceGroupMaintenanceComponent.prototype.getContactDetails = function (contactData) {
        this.storeContact = contactData['data'];
    };
    InvoiceGroupMaintenanceComponent.prototype.getInvoiceData = function () {
        this.invoiceQuery = new URLSearchParams();
        this.invoiceQuery = this.prepareQueryDefaults();
        this.invoiceQuery.set(this.serviceConstants.AccountNumber, this.invoiceFormGroup.controls[this.serviceConstants.AccountNumber].value);
        this.invoiceQuery.set(BillToCashConstants.c_o_REQUEST_PARAM_NAMES['InvoiceGroupNumber'], this.invoiceFormGroup.controls['InvoiceGroupNumber'].value);
        return this.httpService.makeGetRequest(BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'], this.invoiceQuery);
    };
    InvoiceGroupMaintenanceComponent.prototype.buidForm = function () {
        this.invoiceFormGroup = this.formBuilder.group({
            AccountNumber: [{ value: '', disabled: false }, Validators.required],
            AccountName: [{ value: '', disabled: true }],
            InvoiceGroupNumber: [{ value: '', disabled: false }, Validators.required]
        });
        this.store.dispatch({
            type: InvoiceActionTypes.SET_FORM_GROUPS,
            payload: {
                name: this.storeFormValidKey,
                form: this.invoiceFormGroup
            }
        });
        if (this.storeInvoice[this.serviceConstants.AccountNumber]) {
            this.invoiceFormGroup.controls[this.serviceConstants.AccountNumber].setValue(this.storeInvoice[this.serviceConstants.AccountNumber]);
        }
        if (this.storeInvoice['AccountName']) {
            this.invoiceFormGroup.controls['AccountName'].setValue(this.storeInvoice['AccountName']);
        }
    };
    InvoiceGroupMaintenanceComponent.prototype.setFormData = function () {
        var parentMode = this.riExchange.ParentMode({});
        this.storeInvoice['AccountNumber'] = this.storeData['AccountNumber'];
        this.storeInvoice['InvoiceGroupNumber'] = this.storeData['InvoiceGroupNumber'];
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
    };
    InvoiceGroupMaintenanceComponent.prototype.createSysCharListForQuery = function () {
        var sysCharList = [
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
    };
    InvoiceGroupMaintenanceComponent.prototype.getSysChar = function () {
        var _this = this;
        this.syscharQuery = new URLSearchParams();
        this.syscharQuery = this.prepareQueryDefaults();
        this.syscharQuery.set(this.serviceConstants.SystemCharNumber, this.createSysCharListForQuery());
        Observable.forkJoin(this.httpService.sysCharRequest(this.syscharQuery), this.getMultiContactInd()).subscribe(function (data) {
            var multiContactInd = false;
            _this.updateSysChar(data[0]);
            if (data[1]['results'] && data[1]['results'].length > 0 && data[1]['results'][0][0]) {
                multiContactInd = true;
            }
            _this.sysCharParams['vSCMultiContactInd'] = multiContactInd;
            _this.optionsList = StaticUtils.deepCopy(BillToCashConstants.c_o_MENU_OPTIONS_LIST);
            if (_this.sysCharParams['vSCMultiContactInd']) {
                _this.optionsList = StaticUtils.deepCopy(BillToCashConstants.c_o_MENU_OPTIONS_LIST);
                if (_this.storeMode['addMode']) {
                    _this.sensitiseContactDetails(true);
                }
                else if (_this.storeMode['updateMode'] && _this.invoiceFormGroup.controls['InvoiceGroupNumber'].value) {
                    _this.sensitiseContactDetails(false);
                }
            }
            else {
                _this.optionsList[1].list = _this.optionsList[1].list.slice(2);
            }
            _this.store.dispatch({
                type: InvoiceActionTypes.SAVE_SYSCHAR,
                payload: _this.sysCharParams
            });
        }, function (error) {
            _this.dispatchGeneralError(error);
        });
    };
    InvoiceGroupMaintenanceComponent.prototype.updateSysChar = function (sysChars) {
        var records;
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
        this.sysCharParams['vSCOAMandateRequired'] = true;
        if (records[18].Required || !records[18].Logical) {
            this.sysCharParams['vSCOAMandateRequired'] = false;
        }
        this.sysCharParams['vDisableFieldList'] = '';
        if (!this.sysCharParams['vSCEnableAddressLine3']) {
            this.sysCharParams['vDisableFieldList'] += 'AddressLine3';
        }
    };
    InvoiceGroupMaintenanceComponent.prototype.getMultiContactInd = function () {
        var data = [{
                'table': 'riRegistry',
                'query': { 'RegSection': 'Contact Person' },
                'fields': ['RegSection']
            }];
        return this.prepareLookup(data, '1');
    };
    InvoiceGroupMaintenanceComponent.prototype.setInvoiceData = function (data, route) {
        var parentMode;
        this.store.dispatch({
            type: InvoiceActionTypes.SAVE_CODE,
            payload: {
                business: this.utils.getBusinessCode(),
                country: this.utils.getCountryCode()
            }
        });
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
                    var accountNumber = this.riExchange.GetParentHTMLInputValue({}, 'AccountNumber');
                    if (accountNumber) {
                        this.storeInvoice['AccountNumber'] = accountNumber;
                        this.storeInvoice['AcccounName'] = this.riExchange.GetParentHTMLInputValue({}, 'AccountName');
                        this.storeInvoice['InvoiceGroupNumber'] = this.riExchange.GetParentHTMLInputValue({}, 'InvoiceGroupNumber');
                    }
                    break;
            }
        }
        if (this.storeMode['addMode']) {
            this.invoiceFormGroup.controls['InvoiceGroupNumber'].setValue('');
            this.clearForms();
            return;
        }
        this.storeMode = this.updateFormMode('updateMode');
        this.store.dispatch({
            type: InvoiceActionTypes.SAVE_MODE,
            payload: this.storeMode
        });
        this.setFormMode();
        this.contactStore.dispatch({
            type: ''
        });
    };
    InvoiceGroupMaintenanceComponent.prototype.setFormMode = function () {
        var parentMode = this.riExchange.ParentMode({}) || this.queryParams['parentMode'];
        if (!parentMode) {
            parentMode = this.queryParams['parentMode'];
        }
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
    };
    InvoiceGroupMaintenanceComponent.prototype.updateFormMode = function (modeToUpdate) {
        var result = {};
        var modes = ['updateMode', 'addMode', 'searchMode'];
        for (var i = 0; i < modes.length; i++) {
            if (modes[i] === modeToUpdate) {
                result[modes[i]] = true;
                continue;
            }
            result[modes[i]] = false;
        }
        return result;
    };
    InvoiceGroupMaintenanceComponent.prototype.getDetails = function () {
        var _this = this;
        var data = BillToCashConstants.c_o_LOOKUP_PARAMS['InvoiceGroupMaintenance']['details'];
        this.storeData['AccountNumber'] = this.invoiceFormGroup.controls['AccountNumber'].value;
        for (var i = 0; i < data.length; i++) {
            var query = data[i]['query'];
            for (var key in query) {
                if (!key) {
                    continue;
                }
                query[key] = this.storeData[key];
            }
        }
        this.prepareLookup(data, '5').subscribe(function (data) {
            _this.storeOtherDetails = {
                AccountName: data['results'][0][0]['AccountName'],
                SystemInvoiceIssueTypeDesc: data['results'][1][0]['SystemInvoiceIssueTypeDesc'],
                SystemInvoiceFormatDesc: data['results'][2][0]['SystemInvoiceFormatDesc'],
                CurrencyDesc: data['results'][3][0]['CurrencyDesc'],
                PaymentTermDesc: data['results'][4][0]['PaymentTermDesc'],
                LanguageDescription: data['results'][5][0]['LanguageDescription'],
                InvoiceFeeDesc: data['results'][6].length > 0 ? data['results'][6][0]['InvoiceFeeDesc'] : ''
            };
            _this.store.dispatch({
                type: InvoiceActionTypes.SAVE_OTHER_DETAILS,
                payload: _this.storeOtherDetails
            });
            _this.cbbService.disableComponent(true);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.dispatchGeneralError(error);
        });
    };
    InvoiceGroupMaintenanceComponent.prototype.clearForms = function () {
        var formGroups = this.storeFormGroup;
        this.invoiceGroupNumberShowHide = false;
        if (!this.invoiceFormGroup) {
            return;
        }
        this.invoiceFormGroup.controls['InvoiceGroupNumber'].setValue('');
        this.invoiceFormGroup.controls['InvoiceGroupNumber'].clearValidators();
        for (var key in formGroups) {
            if (!key) {
                continue;
            }
            var formGroup = formGroups[key];
            if (!formGroup || key === 'main') {
                continue;
            }
            if (key === 'dropdownComponents') {
                for (var dropdown in formGroup) {
                    if (!dropdown) {
                        continue;
                    }
                    formGroup[dropdown].selectedItem = '';
                }
                continue;
            }
            for (var control in formGroup['controls']) {
                if (!control) {
                    continue;
                }
                formGroup['controls'][control].setValue('');
            }
        }
    };
    InvoiceGroupMaintenanceComponent.prototype.prepareLookup = function (data, maxResults) {
        this.lookupQuery = new URLSearchParams();
        this.lookupQuery = this.prepareQueryDefaults();
        this.lookupQuery.set(this.serviceConstants.MaxResults, maxResults);
        return this.httpService.lookUpRequest(this.lookupQuery, data);
    };
    InvoiceGroupMaintenanceComponent.prototype.setDetailsInForms = function () {
        if (!this.invoiceFormGroup) {
            return;
        }
        this.invoiceFormGroup.controls['AccountName'].setValue(this.storeOtherDetails['AccountName']);
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
    };
    InvoiceGroupMaintenanceComponent.prototype.isLiveInvoice = function () {
        var _this = this;
        this.liveInvoiceQuery = new URLSearchParams();
        this.liveInvoiceQuery = this.prepareQueryDefaults('6');
        this.liveInvoiceQuery.set(this.serviceConstants.AccountNumber, this.storeData['AccountNumber']);
        this.liveInvoiceQuery.set(BillToCashConstants.c_o_REQUEST_PARAM_NAMES['InvoiceGroupNumber'], this.storeData['InvoiceGroupNumber']);
        this.liveInvoiceQuery.set(BillToCashConstants.c_o_REQUEST_PARAM_NAMES['Function'], 'LiveInvoiceGroup');
        this.httpService.makeGetRequest(BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'], this.liveInvoiceQuery).subscribe(function (data) {
            var resp = (data.LiveInvoiceGroupInd === 'TRUE' || data.LiveInvoiceGroupInd === 'yes') ? 'yes' : 'no';
            _this.store.dispatch({
                type: InvoiceActionTypes.UPDATE_LIVE_INVOICE,
                payload: _this.utils.convertResponseValueToCheckboxInput(resp)
            });
        }, function (error) {
            _this.dispatchGeneralError(error);
        });
    };
    InvoiceGroupMaintenanceComponent.prototype.getAddressFromOtherPage = function (data) {
        this.requestedAddressType = data.AddressType;
        switch (this.requestedAddressType) {
            case 'Invoice':
                this.ellipsisQueryParams.inputParamsInvoiceGroupNumber.parentMode = 'SearchAddress';
                this.invoiceGroupEllipsis.openModal();
                break;
        }
    };
    InvoiceGroupMaintenanceComponent.prototype.navigateAway = function (page) {
        var route = BillToCashConstants.c_o_ROUTES_AND_MODES[page].route;
        var mode = BillToCashConstants.c_o_ROUTES_AND_MODES[page].mode;
        if (!route) {
            return;
        }
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
        this.storeSentFromParent['parentMode'] = mode;
        this.store.dispatch({
            type: InvoiceActionTypes.SEND_DATA_FROM_PARENT,
            payload: this.storeSentFromParent
        });
        this.router.navigate([route]);
    };
    InvoiceGroupMaintenanceComponent.prototype.validateForms = function () {
        var _this = this;
        var isValid = true;
        var mandateReferenceNumber = this.getControlValueFromStore('General', 'ExOAMandateReference');
        var parameterName;
        var value = '';
        var tabToFocus = -1;
        this.formSaveData = {};
        this.ajaxSource.next(this.ajaxconstant.START);
        for (var formGroup in this.storeFormGroup) {
            if (!formGroup) {
                continue;
            }
            if (formGroup === 'dropdownComponents') {
                var dropdownGroup = this.storeFormGroup[formGroup];
                for (var dropdown in dropdownGroup) {
                    if (!dropdown) {
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
            var formGroupControls = this.storeFormGroup[formGroup].controls;
            for (var control in formGroupControls) {
                if (!control) {
                    continue;
                }
                var formControl = formGroupControls[control];
                if (this.fieldsNotToSave.indexOf(control) < 0) {
                    parameterName = (this.paramsWithDifferentNames[control] || control);
                    value = this.sysCharParams['vSCCapitalFirstLtr'] && formControl.value && (typeof formControl.value === 'string')
                        ? this.utils.capitalizeFirstLetter(formControl.value) : formControl.value;
                    formControl.setValue(value);
                    this.formSaveData[parameterName] = value || '';
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
        if (this.storeMode['addMode'] && !mandateReferenceNumber && this.sysCharParams['vSCOAMandateRequired']) {
            this.checkMandateRequired().subscribe(function (data) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.onMessageClose = _this.checkPostCodeAndDelivery;
                if (data.ErrorMessageDesc) {
                    _this.messageService.emitMessage({
                        msg: data.ErrorMessageDesc
                    });
                }
            }, function (error) {
                _this.dispatchGeneralError(error);
            });
            return;
        }
        if (this.storeFormGroup['General'].controls['ExOAMandateReference'].dirty && mandateReferenceNumber) {
            this.validateMandateReferenceNumber().subscribe(function (data) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                if (data['fullError'] !== undefined) {
                    _this.promptConfirmContent = data['fullError'];
                    _this.promptConfirm = _this.checkPostCodeAndDelivery;
                    _this.promptConfirmModal.show();
                    return;
                }
                _this.checkPostCodeAndDelivery();
            }, function (error) {
                _this.dispatchGeneralError(error);
            });
            return;
        }
        this.checkPostCodeAndDelivery();
    };
    InvoiceGroupMaintenanceComponent.prototype.checkMandateRequired = function () {
        this.mandateQuery = new URLSearchParams();
        var formData = {};
        this.mandateQuery = this.prepareQueryDefaults('6');
        formData[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['ExOAMandateReference']] = '';
        formData[this.serviceConstants.Function] = 'WarnNoMandateNumber';
        return this.httpService.makePostRequest(BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'], this.mandateQuery, formData);
    };
    InvoiceGroupMaintenanceComponent.prototype.validateMandateReferenceNumber = function () {
        this.mandateQuery = new URLSearchParams();
        var formData = {};
        this.mandateQuery = this.prepareQueryDefaults('6');
        formData[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['ExOAMandateReference']] = '';
        formData[this.serviceConstants.Function] = 'ValidateExOAMandateReference';
        formData[this.serviceConstants.AccountNumber] = this.getControlValueFromStore('main', 'AccountNumber');
        formData[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['InvoiceGroupNumber']] = this.getControlValueFromStore('main', 'InvoiceGroupNumber');
        return this.httpService.makePostRequest(BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'], this.mandateQuery, formData);
    };
    InvoiceGroupMaintenanceComponent.prototype.checkPostCode = function (addressType) {
        this.mandateQuery = new URLSearchParams();
        var formData = {};
        this.postcodeQuery = this.prepareQueryDefaults('6');
        for (var i = 0; i < BillToCashConstants.c_arr_CHECKPOSTCODE_PARAMS.length; i++) {
            var fieldName = addressType + BillToCashConstants.c_arr_CHECKPOSTCODE_PARAMS[i];
            formData[fieldName] = this.getControlValueFromStore('Address' + addressType, fieldName);
        }
        formData[this.serviceConstants.Function] = 'CheckPostcode';
        return this.httpService.makePostRequest(BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'], this.postcodeQuery, formData);
    };
    InvoiceGroupMaintenanceComponent.prototype.checkDelivery = function () {
        this.deliveryQuery = new URLSearchParams();
        var invoiceContactName = this.getControlValueFromStore('AddressInvoice', 'InvoiceContactName');
        var invoiceContactEmail = this.getControlValueFromStore('AddressInvoice', 'InvoiceContactEmail');
        var invoiceContactFax = this.getControlValueFromStore('AddressInvoice', 'InvoiceContactFax');
        var invoiceIssueTypeCode = this.getControlValueFromStore('General', 'InvoiceIssueTypeCode');
        var formData = {};
        this.deliveryQuery = this.prepareQueryDefaults('6');
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
        formData[this.serviceConstants.Function] = 'CheckDelivery';
        return this.httpService.makePostRequest(BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'], this.deliveryQuery, formData);
    };
    InvoiceGroupMaintenanceComponent.prototype.checkPostCodeAndDelivery = function () {
        var _this = this;
        var requests = [];
        if (this.sysCharParams['vSCPostCodeMustExistInPAF']
            && (this.sysCharParams['vSCEnableHopewiserPAF']
                || this.sysCharParams['vSCEnableDatabasePAF'])) {
            requests.push(this.checkPostCode('Invoice'));
            requests.push(this.checkPostCode('Statement'));
            requests.push(this.checkDelivery());
            this.onMessageClose = function () {
                this.saveData();
            };
            Observable.forkJoin(requests).subscribe(function (data) {
                var hasNoError = true;
                for (var i = 0; i < data.length; i++) {
                    if (data[0]['ErrorMessageDesc']) {
                        hasNoError = false;
                        _this.messageService.emitMessage({
                            msg: data[0]['ErrorMessageDesc']
                        });
                        break;
                    }
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.dispatchGeneralError(error);
            });
            return;
        }
        this.saveData();
    };
    InvoiceGroupMaintenanceComponent.prototype.getDefaults = function () {
        var _this = this;
        this.getDefaultQuery = new URLSearchParams();
        var formData = {};
        this.getDefaultQuery = this.prepareQueryDefaults('6');
        formData[this.serviceConstants.AccountNumber] = this.invoiceFormGroup.controls['AccountNumber'].value;
        if (this.invoiceFormGroup.controls['InvoiceGroupNumber'].value) {
            formData[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['InvoiceGroupNumber']] = this.invoiceFormGroup.controls['InvoiceGroupNumber'].value;
        }
        formData[this.serviceConstants.Function] = 'GetDefaults';
        this.httpService.makePostRequest(BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'], this.getDefaultQuery, formData).subscribe(function (data) {
            if (data.errorMessage) {
                return;
            }
            _this.store.dispatch({
                type: InvoiceActionTypes.SAVE_DATA,
                payload: data
            });
            _this.isLiveInvoice();
        }, function (error) {
            _this.dispatchGeneralError(error);
        });
    };
    InvoiceGroupMaintenanceComponent.prototype.getControlValueFromStore = function (form, control) {
        var formControl = this.storeFormGroup[form].controls[control];
        var dropdown = this.storeFormGroup[BillToCashConstants.c_o_STORE_KEY_NAMES['Dropdown']];
        if (formControl) {
            return formControl.value;
        }
        if (dropdown[control]) {
            return dropdown[control].selectedItem;
        }
        return '';
    };
    InvoiceGroupMaintenanceComponent.prototype.prepareQueryDefaults = function (action) {
        var query = new URLSearchParams();
        if (!action) {
            action = '0';
        }
        query.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        query.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        query.set(this.serviceConstants.Action, action);
        return query;
    };
    InvoiceGroupMaintenanceComponent.prototype.dispatchError = function (payload) {
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
    };
    InvoiceGroupMaintenanceComponent.prototype.dispatchGeneralError = function (error) {
        var errorObject = {};
        errorObject[BillToCashConstants.c_o_ERROROBJECT_KEYS.isLogRequired] = true;
        errorObject[BillToCashConstants.c_o_ERROROBJECT_KEYS.error] = error;
        this.dispatchError(errorObject);
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
    };
    InvoiceGroupMaintenanceComponent.prototype.saveData = function () {
        var _this = this;
        var action = '2';
        this.invoiceQuery = new URLSearchParams();
        if (this.storeMode['addMode']) {
            action = '1';
            this.formSaveData['Function'] = 'GetDefaults';
        }
        this.onMessageClose = this.utils.noop;
        this.invoiceQuery = this.prepareQueryDefaults(action);
        this.httpService.makePostRequest(BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'], this.invoiceQuery, this.formSaveData).subscribe(function (data) {
            if (data.InvoiceGroupNumber) {
                _this.storeFormGroup['main'].controls['InvoiceGroupNumber'].setValue(data.InvoiceGroupNumber);
            }
            if (data.ExOAMandateReference && data.ExOAMandateReference !== 'undefined') {
                _this.storeFormGroup['General'].controls['ExOAMandateReference'].setValue(data.ExOAMandateReference);
            }
            _this.storeInvoice['InvoiceGroupNumber'] = data.InvoiceGroupNumber;
            _this.riExchange.riInputElement.Enable(_this.invoiceFormGroup, 'InvoiceGroupNumber');
            _this.store.dispatch({
                type: InvoiceActionTypes.SAVE_INVOICE,
                payload: _this.storeInvoice
            });
            if (data.errorMessage) {
                _this.dispatchError({
                    msg: data.errorMessage
                });
                return;
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            for (var formGroup in _this.storeFormGroup) {
                if (formGroup && formGroup !== 'dropdownComponents') {
                    _this.storeFormGroup[formGroup]['markAsPristine']();
                }
            }
            if (_this.queryParams['IGParentMode'] === 'PremiseMaintenanceSearch') {
                _this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
                    queryParams: {
                        parentMode: 'InvoiceGroup',
                        AccountNumber: _this.riExchange.riInputElement.GetValue(_this.invoiceFormGroup, 'AccountNumber'),
                        InvoiceGroupNumber: _this.riExchange.riInputElement.GetValue(_this.invoiceFormGroup, 'InvoiceGroupNumber'),
                        ContractNumber: _this.queryParams['ContractNumber'],
                        PremiseNumber: _this.queryParams['PremiseNumber'],
                        currentContractType: _this.queryParams['currentContractType']
                    }
                });
            }
            _this.messageService.emitMessage({
                msg: MessageConstant.Message.RecordSavedSuccessfully
            });
        }, function (error) {
            _this.dispatchError({
                isLogRequired: true,
                error: error,
                msg: MessageConstant.Message.SaveError
            });
        });
    };
    InvoiceGroupMaintenanceComponent.prototype.sensitiseContactDetails = function (disable) {
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
        }
        else {
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
    };
    InvoiceGroupMaintenanceComponent.prototype.onAccountNumberReceived = function (data) {
        var accountNumber = data['AccountNumber'];
        var accountName = data['AccountName'];
        this.invoiceFormGroup.controls['AccountNumber'].setValue(accountNumber);
        this.invoiceFormGroup.controls['AccountName'].setValue(accountName);
        this.getSysChar();
        this.storeInvoice[this.serviceConstants.AccountNumber] = accountNumber;
        this.storeInvoice['AccountName'] = accountName;
        this.storeInvoice[BillToCashConstants.c_o_STORE_KEY_NAMES['AccountNumberChanged']] = true;
        this.store.dispatch({
            type: InvoiceActionTypes.SAVE_INVOICE,
            payload: this.storeInvoice
        });
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber[this.serviceConstants.AccountNumber] = accountNumber;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountName'] = accountName;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountNumberChanged'] = true;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['parentMode'] = 'InvoiceGroupMaintenance';
        this.invoiceGroupEllipsis.childConfigParams = this.ellipsisQueryParams.inputParamsInvoiceGroupNumber;
        this.invoiceFormGroup.controls['InvoiceGroupNumber'].setValue('');
        for (var formGroup in this.storeFormGroup) {
            if (!formGroup || formGroup === 'main') {
                continue;
            }
            if (formGroup === 'dropdownComponents') {
                this.storeFormGroup['dropdownComponents']['InvoiceFormatCode'].selectedItem = '';
                this.storeFormGroup['dropdownComponents']['InvoiceIssueTypeCode'].selectedItem = '';
                this.storeFormGroup['dropdownComponents']['InvoiceFormatCode'].disabled = '';
                this.storeFormGroup['dropdownComponents']['InvoiceIssueTypeCode'].disabled = '';
                continue;
            }
            this.storeFormGroup[formGroup].reset();
            this.storeFormGroup[formGroup].disable();
        }
        this.isInvoiceGroupNumberDisabled = false;
        this.invoiceFormGroup.controls['InvoiceGroupNumber'].enable();
    };
    InvoiceGroupMaintenanceComponent.prototype.onInvoiceGroupNumberChange = function () {
        this.onInvoiceGroupNumberReceived();
    };
    InvoiceGroupMaintenanceComponent.prototype.onInvoiceGroupNumberReceived = function (data) {
        var _this = this;
        var invoiceGroupNumber = '';
        if (data) {
            if (data['Number']) {
                invoiceGroupNumber = data['Number'];
            }
            else if (data['trRowData'] && data['trRowData'][0]) {
                invoiceGroupNumber = data['trRowData'][0].text;
            }
            else {
                invoiceGroupNumber = this.riExchange.riInputElement.GetValue(this.invoiceFormGroup, 'InvoiceGroupNumber');
            }
        }
        else {
            invoiceGroupNumber = this.riExchange.riInputElement.GetValue(this.invoiceFormGroup, 'InvoiceGroupNumber');
        }
        if (!invoiceGroupNumber) {
            for (var formGroup in this.storeFormGroup) {
                if (!formGroup || formGroup === 'main') {
                    continue;
                }
                if (formGroup === 'dropdownComponents') {
                    this.storeFormGroup['dropdownComponents']['InvoiceFormatCode'].selectedItem = '';
                    this.storeFormGroup['dropdownComponents']['InvoiceIssueTypeCode'].selectedItem = '';
                    this.storeFormGroup['dropdownComponents']['InvoiceFormatCode'].disabled = '';
                    this.storeFormGroup['dropdownComponents']['InvoiceIssueTypeCode'].disabled = '';
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
        this.invoiceFormGroup.controls['InvoiceGroupNumber'].setValue(invoiceGroupNumber);
        this.storeInvoice['InvoiceGroupNumber'] = invoiceGroupNumber;
        if (data && data['Description'] && this.storeFormGroup['General']) {
            this.storeFormGroup['General'].controls['InvoiceGroupDesc'].setValue(data['Description']);
        }
        this.storeMode = this.updateFormMode('updateMode');
        this.invoiceFormGroup.controls['InvoiceGroupNumber'].setValidators(Validators.required);
        this.invoiceGroupNumberShowHide = true;
        this.store.dispatch({
            type: InvoiceActionTypes.SAVE_MODE,
            payload: this.storeMode
        });
        if (!this.getControlValueFromStore('main', this.serviceConstants.AccountNumber)
            || !this.getControlValueFromStore('main', 'InvoiceGroupNumber')) {
            return;
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.getInvoiceData().subscribe(function (data) {
            if (data.errorMessage) {
                var errorObject = {};
                errorObject[BillToCashConstants.c_o_ERROROBJECT_KEYS.message] = data.errorMessage;
                _this.dispatchError(errorObject);
                return;
            }
            _this.store.dispatch({
                type: InvoiceActionTypes.SAVE_DATA,
                payload: data
            });
        }, function (error) {
            _this.dispatchGeneralError(error);
        });
    };
    InvoiceGroupMaintenanceComponent.prototype.onInvoiceDataReturn = function () {
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['parentMode'] = 'InvoiceGroupMaintenance';
    };
    InvoiceGroupMaintenanceComponent.prototype.onAccountNumberChange = function () {
        var _this = this;
        var accountNumber = this.invoiceFormGroup.controls['AccountNumber'].value;
        var accountName = '';
        var invoiceGroupNumber = this.invoiceFormGroup.controls['InvoiceGroupNumber'].value;
        var lookupAccountNameData = [{}];
        this.isInvoiceGroupNumberDisabled = false;
        this.invoiceFormGroup.controls['AccountName'].setValue('');
        this.invoiceTabs.tabFocusTo(0);
        if (!accountNumber) {
            this.isInvoiceGroupNumberDisabled = true;
            this.invoiceFormGroup.controls['InvoiceGroupNumber'].setValue('');
            this.invoiceFormGroup.controls['InvoiceGroupNumber'].disable();
            for (var formGroup in this.storeFormGroup) {
                if (!formGroup || formGroup === 'main') {
                    continue;
                }
                if (formGroup === 'dropdownComponents') {
                    this.storeFormGroup['dropdownComponents']['InvoiceFormatCode'].selectedItem = '';
                    this.storeFormGroup['dropdownComponents']['InvoiceIssueTypeCode'].selectedItem = '';
                    this.storeFormGroup['dropdownComponents']['InvoiceFormatCode'].disabled = '';
                    this.storeFormGroup['dropdownComponents']['InvoiceIssueTypeCode'].disabled = '';
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
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber[this.serviceConstants.AccountNumber] = accountNumber;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountName'] = accountName;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountNumberChanged'] = true;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['parentMode'] = 'InvoiceGroupMaintenance';
        this.invoiceGroupEllipsis.childConfigParams = this.ellipsisQueryParams.inputParamsInvoiceGroupNumber;
        this.store.dispatch({
            type: InvoiceActionTypes.SAVE_INVOICE,
            payload: this.storeInvoice
        });
        this.invoiceFormGroup.controls['InvoiceGroupNumber'].setValue('');
        for (var formGroup in this.storeFormGroup) {
            if (!formGroup || formGroup === 'main') {
                continue;
            }
            if (formGroup === 'dropdownComponents') {
                this.storeFormGroup['dropdownComponents']['InvoiceFormatCode'].selectedItem = '';
                this.storeFormGroup['dropdownComponents']['InvoiceIssueTypeCode'].selectedItem = '';
                this.storeFormGroup['dropdownComponents']['InvoiceFormatCode'].disabled = '';
                this.storeFormGroup['dropdownComponents']['InvoiceIssueTypeCode'].disabled = '';
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
        this.prepareLookup(lookupAccountNameData, '1').subscribe(function (data) {
            if (!data.results || !data.results[0].length) {
                _this.dispatchError({
                    msg: MessageConstant.Message.RecordNotFound
                });
                return;
            }
            var accountName = data.results[0][0].AccountName;
            _this.invoiceFormGroup.controls['AccountName'].setValue(accountName);
            _this.storeInvoice['AccountName'] = accountName;
            _this.ellipsisQueryParams.inputParamsInvoiceGroupNumber[_this.serviceConstants.AccountNumber] = accountNumber;
            _this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountName'] = accountName;
            _this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountNumberChanged'] = true;
            _this.invoiceGroupEllipsis.childConfigParams = _this.ellipsisQueryParams.inputParamsInvoiceGroupNumber;
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.store.dispatch({
                type: InvoiceActionTypes.SAVE_INVOICE,
                payload: _this.storeInvoice
            });
        }, function (error) {
            _this.dispatchGeneralError(error);
        });
    };
    InvoiceGroupMaintenanceComponent.prototype.onDropdownMenuChange = function (selectedItem) {
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
                this.router.navigate(['maintenance/invoicepremisegroup/search'], {
                    queryParams: {
                        parentMode: 'InvoiceGroup',
                        AccountNumber: this.riExchange.riInputElement.GetValue(this.invoiceFormGroup, 'AccountNumber'),
                        InvoiceGroupNumber: this.riExchange.riInputElement.GetValue(this.invoiceFormGroup, 'InvoiceGroupNumber')
                    }
                });
                break;
            case 'Invoice Narrative':
                this.router.navigate(['/contractmanagement/maintenance/contract/invoicenarrative'], {
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
    };
    InvoiceGroupMaintenanceComponent.prototype.saveInvoiceGroupData = function () {
        var isValid = true;
        var parameterName;
        var value = '';
        var tabToFocus = -1;
        this.formSaveData = {};
        for (var formGroup in this.storeFormGroup) {
            if (!formGroup) {
                continue;
            }
            if (formGroup === 'dropdownComponents') {
                var dropdownGroup = this.storeFormGroup[formGroup];
                for (var dropdown in dropdownGroup) {
                    if (!dropdown) {
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
            var formGroupControls = this.storeFormGroup[formGroup].controls;
            for (var control in formGroupControls) {
                if (!control) {
                    continue;
                }
                var formControl = formGroupControls[control];
                if (this.fieldsNotToSave.indexOf(control) < 0) {
                    parameterName = (this.paramsWithDifferentNames[control] || control);
                    value = this.sysCharParams['vSCCapitalFirstLtr'] && formControl.value && (typeof formControl.value === 'string')
                        ? this.utils.capitalizeFirstLetter(formControl.value) : formControl.value;
                    formControl.setValue(value);
                    this.formSaveData[parameterName] = value || '';
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
        this.promptConfirm = function (event) {
            this.validateForms();
        };
        this.promptConfirmModal.show();
    };
    InvoiceGroupMaintenanceComponent.prototype.resetForm = function () {
        if (!this.storeData) {
            for (var formGroup in this.storeFormGroup) {
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
        this.invoiceFormGroup.controls['InvoiceGroupNumber'].setValue(this.storeData['InvoiceGroupNumber']);
        this.store.dispatch({
            type: InvoiceActionTypes.RESET_FORMS
        });
    };
    InvoiceGroupMaintenanceComponent.prototype.promptConfirm = function (event) {
        this.validateForms();
    };
    InvoiceGroupMaintenanceComponent.prototype.onPremiseSearchClose = function () {
        this.menuDropDown.selectedItem = 'Options';
        this.isPremisesSearchHidden = true;
    };
    InvoiceGroupMaintenanceComponent.prototype.onSaveFocus = function (e) {
        var nextTab = 0;
        var code = (e.keyCode ? e.keyCode : e.which);
        var elemList = document.querySelectorAll('.tab-container .nav-tabs li a');
        var currentSelectedIndex = Array.prototype.indexOf.call(elemList, document.querySelector('.tab-container .nav-tabs li a.active'));
        if (code === 9 && currentSelectedIndex < (elemList.length - 1)) {
            var click = new MouseEvent('click', { bubbles: true });
            nextTab = currentSelectedIndex + 1;
            this.invoiceTabs.tabFocusTo(nextTab);
            setTimeout(function () {
                document.querySelector('.tab-container .tab-content .tab-pane:nth-child(' + nextTab + ') .ui-select-toggle, .tab-container .tab-content .tab-pane.active input:not([disabled]), .tab-container .tab-content .tab-pane.active select:not([disabled])')['focus']();
            }, 100);
        }
        return;
    };
    InvoiceGroupMaintenanceComponent.prototype.onMessageClose = function () {
    };
    InvoiceGroupMaintenanceComponent.prototype.canDeactivate = function () {
        var _this = this;
        var isDirty = this.storeFormGroup['AddressInvoice'].dirty
            || this.storeFormGroup['AddressStatement'].dirty
            || this.storeFormGroup['General'].dirty
            || this.storeFormGroup['EDIInvoicing'].dirty;
        this.routeAwayGlobals.setSaveEnabledFlag(isDirty);
        this.routeAwayComponent.promptModal.cancelEmit.subscribe(function (data) {
            _this.menuDropDown.selectedItem = 'Options';
        });
        if (this.routeAwayComponent) {
            return this.routeAwayComponent.canDeactivate();
        }
    };
    InvoiceGroupMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-invoice-group-maintenance',
                    templateUrl: 'iCABSAInvoiceGroupMaintenance.html'
                },] },
    ];
    InvoiceGroupMaintenanceComponent.ctorParameters = [
        { type: Store, },
        { type: Store, },
        { type: ServiceConstants, },
        { type: HttpService, },
        { type: FormBuilder, },
        { type: SysCharConstants, },
        { type: Utils, },
        { type: RiExchange, },
        { type: GlobalConstant, },
        { type: Router, },
        { type: MessageService, },
        { type: Logger, },
        { type: ActivatedRoute, },
        { type: AjaxObservableConstant, },
        { type: LocaleTranslationService, },
        { type: CBBService, },
        { type: Renderer, },
        { type: RouteAwayGlobals, },
    ];
    InvoiceGroupMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'invoiceTabs': [{ type: ViewChild, args: ['invoiceTabs',] },],
        'promptConfirmModal': [{ type: ViewChild, args: ['promptConfirmModal',] },],
        'invoiceGroupEllipsis': [{ type: ViewChild, args: ['invoiceGroupEllipsis',] },],
        'premiseSearchEllipsis': [{ type: ViewChild, args: ['premiseSearchEllipsis',] },],
        'menuDropDown': [{ type: ViewChild, args: ['menuDropDown',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return InvoiceGroupMaintenanceComponent;
}());
