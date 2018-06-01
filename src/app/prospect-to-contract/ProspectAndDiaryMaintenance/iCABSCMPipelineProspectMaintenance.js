import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormBuilder, Validators } from '@angular/forms';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { MaintenanceTypeGeneralComponent } from './tabs/maintenanceTypeGeneral';
import { MaintenanceTypePremiseComponent } from './tabs/maintenanceTypePremise';
import { MaintenanceTypeAccountComponent } from './tabs/maintenanceTypeAccount';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { URLSearchParams } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpService } from '../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Utils } from '../../../shared/services/utility';
import { ErrorService } from '../../../shared/services/error.service';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { ActionTypes } from './../../actions/prospect';
import { Observable } from 'rxjs/Rx';
import { Title } from '@angular/platform-browser';
import { RiExchange } from './../../../shared/services/riExchange';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { MessageService } from '../../../shared/services/message.service';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { AccountPremiseSearchComponent } from '../../internal/grid-search/iCABSAAccountPremiseSearchGrid';
import { CBBService } from './../../../shared/services/cbb.service';
export var ProspectMaintenanceComponent = (function () {
    function ProspectMaintenanceComponent(_router, _componentInteractionService, httpService, serviceConstants, errorService, utils, errorMessage, ajaxconstant, store, fb, systemCharacterConstant, zone, activatedRoute, titleService, riExchange, el, serviceConstant, messageService, cbbService, _zone, translateService, routeAwayGlobals) {
        var _this = this;
        this._router = _router;
        this._componentInteractionService = _componentInteractionService;
        this.httpService = httpService;
        this.serviceConstants = serviceConstants;
        this.errorService = errorService;
        this.utils = utils;
        this.errorMessage = errorMessage;
        this.ajaxconstant = ajaxconstant;
        this.store = store;
        this.fb = fb;
        this.systemCharacterConstant = systemCharacterConstant;
        this.zone = zone;
        this.activatedRoute = activatedRoute;
        this.titleService = titleService;
        this.riExchange = riExchange;
        this.el = el;
        this.serviceConstant = serviceConstant;
        this.messageService = messageService;
        this.cbbService = cbbService;
        this._zone = _zone;
        this.translateService = translateService;
        this.routeAwayGlobals = routeAwayGlobals;
        this.pageTitle = '';
        this.isRequesting = false;
        this.ajaxSource = new BehaviorSubject(0);
        this.querySysChar = new URLSearchParams();
        this.queryLookUp = new URLSearchParams();
        this.queryParam = new URLSearchParams();
        this.showMessageHeader = true;
        this.premiseSearchComponent = PremiseSearchComponent;
        this.premiseAccountSearchComponent = AccountPremiseSearchComponent;
        this.inputParamsPremise = {
            'parentMode': 'PipelineProspect',
            'pageTitle': 'Premise'
        };
        this.inputParamsPremiseAccount = {
            'parentMode': 'Prospect',
            'pageTitle': 'Premise'
        };
        this.menuOptions = [{}];
        this.showHeader = true;
        this.modalTitle = '';
        this.ttBusiness = [{}];
        this.storeData = {};
        this.allFormControls = [];
        this.prospectROWID = '';
        this.showPromptMessageHeader = true;
        this.promptConfirmTitle = '';
        this.defaultCode = {
            country: 'ZA',
            business: 'D'
        };
        this.functionPermission = {
            FunctionAdd: false,
            FunctionDelete: false,
            FunctionSnapShot: false,
            DisplayMessages: false,
            FunctionUpdate: false,
            addMode: false,
            fetchMode: true,
            RowID: ''
        };
        this.customBusinessObject = {
            Select: false,
            Confirm: false,
            Insert: false,
            Update: false,
            Delete: false,
            Enable: false
        };
        this.fieldVisibility = {
            'isHiddenAccountNumber': false,
            'isHiddenContractNumber': false,
            'isHiddenPremiseNumber': false
        };
        this.tabs = [
            { title: 'Premises', active: true },
            { title: 'General', disabled: false },
            { title: 'Account', removable: false }
        ];
        this.autoOpen = '';
        this.autoOpenSearch = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.contractSearchParams = {
            'parentMode': 'ProspectPipeline',
            'currentContractType': 'C',
            'currentContractTypeURLParameter': '<contract>',
            'showAddNew': false
        };
        this.searchModalRoute = '';
        this.searchPageRoute = '';
        this.showCloseButton = true;
        this.contractSearchComponent = ContractSearchComponent;
        this.accountSearchComponent = AccountSearchComponent;
        this.inputParamsAccount = {
            'parentMode': 'ExistingAccountPipelineSearch',
            'showAddNewDisplay': false
        };
        this.accountRequired = false;
        this.queryParamsProspect = {
            action: '0',
            operation: 'ContactManagement/iCABSCMPipelineProspectMaintenance',
            module: 'prospect',
            method: 'prospect-to-contract/maintenance',
            contentType: 'application/x-www-form-urlencoded',
            branchNumber: '',
            branchName: ''
        };
        this.systemChars = {
            vSCEnableAddressLine3: true,
            vSCEnableHopewiserPAF: true,
            vSCEnableDatabasePAF: true,
            vSCAddressLine4Required: true,
            vSCAddressLine5Required: true,
            vSCPostCodeRequired: true,
            vSCPostCodeMustExistInPAF: true,
            vSCRunPAFSearchOn1stAddressLine: true,
            vSCEnableMaxAddressValue: true,
            vSCDisableQuoteDetsOnAddProspect: true,
            vSCBusinessOriginMandatory: true,
            vSCCustomerTypeMandatory: true,
            vSCHideContactMediumCode: true,
            vSCEnablePostcodeDefaulting: true,
            vSCMaxQuotesNumberInd: true,
            vSCMaxQuotesValueInd: true,
            vSICCodeEnable: true,
            vSCEnableValidatePostcodeSuburb: true,
            cQuoteNumberWarningMessage: '',
            cQuoteValueWarningMessage: '',
            vSCMaxQuotesNumber: 0,
            vSCMaxQuotesValue: 0,
            vDefaultProspectOriginCode: '',
            vProductSaleInUse: '',
            glSalesEmployee: '',
            vEnterWORefsList: '',
            gcDefaultSourceCode: '',
            vLocalSystemInd: false,
            vSCCapitalFirstLtr: false,
            vAddURLParam: '',
            currentURL: window.location.href,
            ErrorMessageDesc: '',
            ProspectTypeDesc: '',
            NegBranchNumber: '',
            ServiceBranchNumber: '',
            SalesBranchNumber: '',
            LoggedInBranchNumber: '',
            ContactTypeCode: '',
            CallLogID: '',
            FromCustomerContactNumber: '',
            ContactTypeDetailCode: '',
            LocalSystemInd: '',
            DefaultAssigneeEmployeeCode: '',
            ContactRedirectionUniqueID: '',
            BusinessSourceCode: '',
            BusinessOriginCode: '',
            BusinessOriginDetailCode: '',
            BusinessOriginDetailRequiredList: '',
            BusinessOriginLeadInd: '',
            WindowClosingName: '',
            CallNotepadSummary: '',
            CallTicketReference: '',
            LOSCode: '',
            routeParams: {},
            sCDisableQuoteDetsOnAddProspect: true,
            saveElement: {},
            modalComp: {},
            customBusinessObject: {}
        };
        this.fieldDisable = {
            cancel: false,
            copy: false,
            optionDisable: false,
            save: false
        };
        this.ellipsisDisable = {
            accountEllipsisDisabled: false,
            contractNumberEllipsis: false,
            premiseEllipsis: false,
            premiseAccountSearchEllipsis: false
        };
        this.vAddURLParam = '';
        this.componentList = [MaintenanceTypePremiseComponent, MaintenanceTypeGeneralComponent,
            MaintenanceTypeAccountComponent];
        this.storeData = {
            systemChars: this.systemChars,
            ttBusiness: this.ttBusiness
        };
        this.storeSubscription = store.select('prospect').subscribe(function (data) {
            if (data['action']) {
                if (data['action'].toString() === ActionTypes.FORM_CONTROLS) {
                    _this.allFormControls.push(data['data']);
                }
            }
        });
        this._componentInteractionService.emitMessage(true);
        activatedRoute.queryParams.subscribe(function (param) {
            var currentURL = window.location.href;
            if (currentURL.match(new RegExp('Prospect', 'i'))) {
                _this.vAddURLParam = 'ProspectExistAcct';
            }
            if (currentURL.match(new RegExp('NatAxJob', 'i'))) {
                _this.vAddURLParam = 'NatAxJob';
            }
            if (currentURL.match(new RegExp('Confirm', 'i'))) {
                _this.vAddURLParam = 'Confirm';
            }
            if (param)
                _this.systemChars.routeParams = param;
        });
        this.maintenanceProspectSearchFormGroup = this.fb.group({
            ProspectNumber: [{ value: '', disabled: false }],
            AccountNumber: [{ value: '', disabled: false }],
            ContractNumber: [{ value: '', disabled: false }],
            PremiseNumber: [{ value: '', disabled: false }]
        });
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
    ProspectMaintenanceComponent.prototype.fetchSysChar = function (sysCharNumbers) {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        if (this.utils.getBusinessCode()) {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        }
        else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
        }
        if (this.utils.getCountryCode()) {
            this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        }
        else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.defaultCode.country);
        }
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    };
    ProspectMaintenanceComponent.prototype.loadSystemChars = function () {
        var _this = this;
        var sysCharList = [
            this.systemCharacterConstant.SystemCharEnableAddressLine3,
            this.systemCharacterConstant.SystemCharEnableHopewiserPAF,
            this.systemCharacterConstant.SystemCharEnableDatabasePAF,
            this.systemCharacterConstant.SystemCharAddressLine4Required,
            this.systemCharacterConstant.SystemCharAddressLine5Required,
            this.systemCharacterConstant.SystemCharPostCodeRequired,
            this.systemCharacterConstant.SystemCharPostCodeMustExistinPAF,
            this.systemCharacterConstant.SystemCharRunPAFSearchOnFirstAddressLine,
            this.systemCharacterConstant.SystemCharMaximumAddressLength,
            this.systemCharacterConstant.SystemCharDisableQuoteDetailsOnAddProspect,
            this.systemCharacterConstant.SystemCharProspectEntryBusinessOriginMand,
            this.systemCharacterConstant.SystemCharProspectEntryCustomerTypeMand,
            this.systemCharacterConstant.SystemChar_HideContactMediumInProspectEntry,
            this.systemCharacterConstant.SystemCharEnablePostcodeDefaulting,
            this.systemCharacterConstant.SystemCharProspectEntryMaxQuotesBeforeWarning,
            this.systemCharacterConstant.SystemCharProspectEntryMaxValueBeforeWarning,
            this.systemCharacterConstant.SystemCharShowSICCodeOnPremise,
            this.systemCharacterConstant.SystemCharEnableValidatePostcodeSuburb,
            this.systemCharacterConstant.SystemCharDisableFirstCapitalOnAddressContact
        ];
        var sysNumbers = sysCharList.join(',');
        var dataParam = [{
                'table': 'riRegistry',
                'query': { 'regSection': 'Sales Order Processing', 'regKey': 'Central/Local', regValue: 'Local' },
                'fields': ['regValue']
            },
            {
                'table': 'ProductExpense',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ContractTypeCode': 'P' },
                'fields': ['BusinessCode']
            },
            {
                'table': 'riRegistry',
                'query': { 'regSection': 'Prospect Defaults', 'regKey': this.utils.getBusinessCode() + '"_Default ProspectOrigin"' },
                'fields': ['regValue']
            }, {
                'table': 'ContactMedium',
                'query': {},
                'fields': ['WOTypeCode', 'ContactMediumCode']
            }, {
                'table': 'Employee',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'UserCode': this.utils.getUserCode() },
                'fields': ['OccupationCode']
            }];
        var observableBatch = [this.lookUpRecord(dataParam, 0), this.fetchSysChar(sysNumbers)];
        Observable.forkJoin(observableBatch).subscribe(function (data) {
            _this.setSystemChars(data[1]);
            _this.setAdditionalVariables(data[0]['results']);
            _this.systemChars.customBusinessObject = _this.customBusinessObject;
            _this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
        });
    };
    ProspectMaintenanceComponent.prototype.setSystemChars = function (sysData) {
        if (sysData.records && sysData.records.length > 0) {
            this.systemChars['vSCEnableAddressLine3'] = sysData.records[0].Required;
            this.systemChars['vSCEnableHopewiserPAF'] = sysData.records[1].Required;
            this.systemChars['vSCEnableDatabasePAF'] = sysData.records[2].Required;
            this.systemChars['vSCAddressLine4Required'] = sysData.records[3].Required;
            this.systemChars['vSCAddressLine5Required'] = sysData.records[4].Logical;
            this.systemChars['vSCPostCodeRequired'] = sysData.records[5].Required;
            this.systemChars['vSCPostCodeMustExistInPAF'] = sysData.records[6].Required;
            this.systemChars['vSCRunPAFSearchOn1stAddressLine'] = sysData.records[7].Required;
            this.systemChars['vSCEnableMaxAddressValue'] = sysData.records[8].Integer;
            this.systemChars['vSCDisableQuoteDetsOnAddProspect'] = sysData.records[9].Required;
            this.systemChars['vSCBusinessOriginMandatory'] = sysData.records[10].Required;
            this.systemChars['vSCCustomerTypeMandatory'] = sysData.records[11].Required;
            this.systemChars['vSCHideContactMediumCode'] = sysData.records[12].Required;
            this.systemChars['vSCEnablePostcodeDefaulting'] = sysData.records[13].Required;
            this.systemChars['vSCMaxQuotesNumberInd'] = sysData.records[14].Required;
            this.systemChars['vSCMaxQuotesValueInd'] = sysData.records[15].Required;
            this.systemChars['vSCMaxQuotesNumber'] = sysData.records[14].Integer;
            this.systemChars['vSCMaxQuotesValue'] = sysData.records[15].Integer;
            this.systemChars['vSICCodeEnable'] = sysData.records[16].Required;
            this.systemChars['vSCEnableValidatePostcodeSuburb'] = sysData.records[17].Logical;
            this.systemChars['vSCCapitalFirstLtr'] = sysData.records[18].Required;
        }
    };
    ProspectMaintenanceComponent.prototype.setAdditionalVariables = function (otherData) {
        if (!this.systemChars.vSCMaxQuotesNumberInd) {
            this.systemChars.vSCMaxQuotesNumber = 0;
        }
        if (!this.systemChars.vSCMaxQuotesValueInd) {
            this.systemChars.vSCMaxQuotesValue = 0;
        }
        if ((otherData[4] && otherData[4].length.length > 0)) {
            this.getOccupation(otherData[4][0].OccupationCode);
        }
        if ((otherData[1] && otherData[1].length.length > 0)) {
            this.systemChars.vProductSaleInUse = true;
        }
        if ((otherData[0] && otherData[0].length.length > 0)) {
            this.systemChars['vLocalSystemInd'] = true;
        }
        this.systemChars.vEnterWORefsList = '';
        if ((otherData[3] && otherData[3].length > 0)) {
            for (var _i = 0, _a = otherData[3]; _i < _a.length; _i++) {
                var ctm = _a[_i];
                if (ctm.WOTypeCode) {
                    this.systemChars.vEnterWORefsList += '#' + ctm.ContactMediumCode.toLowerCase() + '#';
                }
            }
        }
        this.systemChars['vDefaultProspectOriginCode'] = '';
        if ((otherData[2] && otherData[2].length.length > 0)) {
            this.systemChars['vDefaultProspectOriginCode'] = otherData[2][0].regValue;
        }
        this.getWarningMessageA();
        this.getWarningMessageB();
    };
    ProspectMaintenanceComponent.prototype.getOccupation = function (occupation) {
        var _this = this;
        var data = [{
                'table': 'Employee',
                'query': { 'OccupationCode': occupation },
                'fields': ['SalesEmployeeInd']
            }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
            if (e && e.results.length > 0) {
                _this.systemChars['glSalesEmployee'] = true;
                _this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
            }
        });
    };
    ProspectMaintenanceComponent.prototype.getWarningMessageA = function () {
        var _this = this;
        var data = [{
                'table': 'ErrorMessageLanguage',
                'query': { 'LanguageCode': this.utils.getDefaultLang(), 'ErrorMessageCode': 2822 },
                'fields': ['ErrorMessageDisplayDescription']
            }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
            if (e && e.results[0].length > 0) {
                _this.systemChars.cQuoteNumberWarningMessage = e.results[0][0].ErrorMessageDisplayDescription;
                _this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
            }
            else {
                _this.getWarningMessage(2822, 'a');
            }
        });
    };
    ProspectMaintenanceComponent.prototype.getWarningMessageB = function () {
        var _this = this;
        var data = [{
                'table': 'ErrorMessageLanguage',
                'query': { 'LanguageCode': this.utils.getDefaultLang(), 'ErrorMessageCode': 2823 },
                'fields': ['ErrorMessageDisplayDescription']
            }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
            if (e && e.results[0].length > 0) {
                _this.systemChars.cQuoteNumberWarningMessage = e.results[0][0].ErrorMessageDisplayDescription;
                _this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
            }
            else {
                _this.getWarningMessage(2823, 'b');
            }
        });
    };
    ProspectMaintenanceComponent.prototype.getWarningMessage = function (ecode, f) {
        var _this = this;
        var data = [{
                'table': 'ErrorMessage',
                'query': { 'ErrorMessageCode': ecode },
                'fields': ['ErrorMessageDescription']
            }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
            if (e && e.results.length > 0) {
                if (f === 'a')
                    _this.systemChars.cQuoteNumberWarningMessage = e.results[0][0].ErrorMessageDescription;
                else if (f === 'b')
                    _this.systemChars.cQuoteValueWarningMessage = e.results[0][0].ErrorMessageDescription;
            }
            _this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
        });
    };
    ProspectMaintenanceComponent.prototype.getEmployeeName = function (empcode, empField) {
        var _this = this;
        var data = [{
                'table': 'Employee',
                'query': { 'EmployeeCode': empcode, 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['EmployeeSurname']
            }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
            if (e && e.results.length > 0) {
                if (e.results[0][0])
                    _this.allFormControls[0]['formPremise'].controls[empField].setValue(e.results[0][0].EmployeeSurname);
            }
        });
    };
    ProspectMaintenanceComponent.prototype.getStatusDesc = function () {
        var _this = this;
        var data = [{
                'table': 'ProspectStatusLang',
                'query': { 'ProspectStatusCode': this.allFormControls[1]['formGeneral'].controls['ProspectStatusCode'].value },
                'fields': ['ProspectStatusDesc']
            }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
            if (e.results[0][0])
                _this.allFormControls[1]['formGeneral'].controls['ProspectStatusDesc'].setValue(e.results[0][0].ProspectStatusDesc);
        });
    };
    ProspectMaintenanceComponent.prototype.getContactMediumDesc = function () {
        var _this = this;
        var data = [{
                'table': 'ContactMediumLang',
                'query': { 'ContactMediumCode': this.allFormControls[0]['formPremise'].controls['ContactMediumCode'].value },
                'fields': ['ContactMediumDesc']
            }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
            if (e.results[0][0])
                _this.allFormControls[0]['formPremise'].controls['ContactMediumDesc'].setValue(e.results[0][0].ContactMediumDesc);
        });
    };
    ProspectMaintenanceComponent.prototype.getCustomerTypeDesc = function () {
        var _this = this;
        var data = [{
                'table': 'CustomerTypeLanguage',
                'query': { 'CustomerTypeCode': this.allFormControls[1]['formGeneral'].controls['CustomerTypeCode'].value },
                'fields': ['CustomerTypeDesc']
            }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
            if (e.results[0][0])
                _this.allFormControls[1]['formGeneral'].controls['CustomerTypeDesc'].setValue(e.results[0][0].CustomerTypeDesc);
        });
    };
    ProspectMaintenanceComponent.prototype.getSICDescription = function () {
        var _this = this;
        var data = [{
                'table': 'SICCodeLang',
                'query': { 'SICCode': this.allFormControls[1]['formGeneral'].controls['SICCode'].value, 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['SICDescription']
            }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
            if (e.results[0][0])
                _this.allFormControls[1]['formGeneral'].controls['SICDescription'].setValue(e.results[0][0].SICDescription);
        });
    };
    ProspectMaintenanceComponent.prototype.getPaymentType = function () {
        var _this = this;
        var data = [{
                'table': 'PaymentType',
                'query': { 'PaymentTypeCode': this.allFormControls[0]['formPremise'].controls['PaymentTypeCode'].value },
                'fields': ['PaymentDesc']
            }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
            if (e.results[0][0])
                _this.allFormControls[0]['formPremise'].controls['PaymentDesc'].setValue(e.results[0][0].ContactMediumDesc);
        });
    };
    ProspectMaintenanceComponent.prototype.getBranch = function () {
        var _this = this;
        var data = [{
                'table': 'Branch',
                'query': { 'BranchNumber': this.allFormControls[0]['formPremise'].controls['BranchNumber'].value },
                'fields': ['BranchName']
            }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
            if (e.results[0][0])
                _this.allFormControls[0]['formPremise'].controls['BranchName'].setValue(e.results[0][0].BranchName);
        });
    };
    ProspectMaintenanceComponent.prototype.getBusinessSource = function () {
        var _this = this;
        var data = [{
                'table': 'BusinessSource',
                'query': { 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['BusinessCode', 'BusinessSourceCode', 'BusinessSourceSystemDesc', 'SalesDefaultInd']
            }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
            try {
                if ((e.results[0].length && e.results[0].length > 0)) {
                    _this.ttBusiness = [];
                    _this.businessSourceData = e.results[0];
                }
                for (var _i = 0, _a = _this.businessSourceData; _i < _a.length; _i++) {
                    var ls = _a[_i];
                    var newOption = { 'text': ls['BusinessSourceSystemDesc'], 'value': ls['BusinessSourceCode'] };
                    _this.ttBusiness.push(newOption);
                }
                _this.updateStore('ttBusiness', _this.ttBusiness);
                _this.saveStore(ActionTypes.CONTROL_DEFAULT_VALUE);
                _this.createttBusiness();
            }
            catch (err) {
            }
        });
    };
    ProspectMaintenanceComponent.prototype.getBusinessSourceLang = function (businessRow, index) {
        var _this = this;
        var data = [{
                'table': 'BusinessSourceLang',
                'query': { 'BusinessCode': businessRow.BusinessCode, 'BusinessSourceCode': businessRow.BusinessSourceCode, 'LanguageCode': this.utils.getDefaultLang() },
                'fields': ['BusinessSourceDesc']
            }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
            try {
                if (e.results[0][0].BusinessSourceDesc) {
                    _this.ttBusiness[index].text = e.results[0][0].BusinessSourceDesc;
                    _this.updateStore('ttBusiness', _this.ttBusiness);
                    _this.saveStore(ActionTypes.CONTROL_DEFAULT_VALUE);
                }
            }
            catch (err) {
            }
        });
    };
    ProspectMaintenanceComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    };
    ProspectMaintenanceComponent.prototype.createttBusiness = function () {
        var index = 0;
        this.systemChars['gcDefaultSourceCode'] = '';
        for (var _i = 0, _a = this.businessSourceData; _i < _a.length; _i++) {
            var bd = _a[_i];
            if (bd.SalesDefaultInd) {
                this.systemChars['gcDefaultSourceCode'] = bd.BusinessSourceCode;
            }
            this.getBusinessSourceLang(bd, index);
            index++;
        }
        if (this.systemChars['gcDefaultSourceCode'] === '') {
            this.systemChars['gcDefaultSourceCode'] = this.businessSourceData[0].BusinessSourceCode;
        }
    };
    ProspectMaintenanceComponent.prototype.onContractDataReceived = function (data, route) {
        this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].setValue(data.AccountNumber);
        this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].setValue(data.ContractNumber);
        this.inputParamsPremise.ContractNumber = this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value;
        this.inputParamsPremise.ContractName = data.ContractName;
        this.allFormControls[2]['formAccount'].controls['AddressLine1'].setValue(data.AccountAddressLine1);
        this.allFormControls[0]['formPremise'].controls['PremiseAddressLine1'].setValue(data.AccountAddressLine1);
        this.allFormControls[0]['formPremise'].controls['CommenceDate'].setValue(data.ContractCommenceDate);
        this.allFormControls[0]['formPremise'].controls['ContractExpiryDate'].setValue(data.ContractExpiryDate);
        if (this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value) {
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].setValidators([Validators.required]);
            this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].setValue('');
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].updateValueAndValidity();
            this.accountRequired = true;
        }
        else {
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].clearValidators();
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].updateValueAndValidity();
            this.accountRequired = false;
        }
        this.storeData['methods'] = ['updatePremiseData'];
        this.saveStore(ActionTypes.EXCHANGE_METHOD);
    };
    ProspectMaintenanceComponent.prototype.onAccountPremiseDataReceived = function (data) {
        this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].setValue(data.AccountNumber);
        this.inputParamsPremiseAccount['AccountNumber'] = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
        this.accountPremiseSearchEllipsis.openModal();
    };
    ProspectMaintenanceComponent.prototype.onAccountDataReceived = function (data, route) {
        var _this = this;
        this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].setValue(data.AccountNumber);
        this.allFormControls[2]['formAccount'].controls['AddressLine1'].setValue(data.AccountAddressLine1);
        this.allFormControls[2]['formAccount'].controls['AddressLine2'].setValue(data.AccountAddressLine2);
        this.allFormControls[2]['formAccount'].controls['AddressLine3'].setValue(data.AccountAddressLine3);
        this.allFormControls[2]['formAccount'].controls['AddressLine4'].setValue(data.AccountAddressLine4);
        this.allFormControls[2]['formAccount'].controls['AddressLine5'].setValue(data.AccountAddressLine5);
        this.allFormControls[2]['formAccount'].controls['Postcode'].setValue(data.AccountPostcode);
        this.allFormControls[2]['formAccount'].controls['ContactName'].setValue(data.AccountContactName);
        this.allFormControls[2]['formAccount'].controls['ContactPosition'].setValue(data.AccountContactPosition);
        this.allFormControls[2]['formAccount'].controls['ContactMobile'].setValue(data.AccountContactMobile);
        this.allFormControls[2]['formAccount'].controls['ContactFax'].setValue(data.AccountContactFax);
        this.allFormControls[2]['formAccount'].controls['ContactEmail'].setValue(data.AccountContactEmail);
        this.allFormControls[2]['formAccount'].controls['ContactTelephone'].setValue(data.AccountContactContactTelephone);
        this.storeData['methods'] = ['setAccountRelatedInfo'];
        this.saveStore(ActionTypes.EXCHANGE_METHOD);
        this.inputParamsPremiseAccount['AccountNumber'] = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
        this.contractSearchParams.accountNumber = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
        this.contractSearchParams.accountName = data.AccountName;
        this.contractSearchEllipsis.updateComponent();
        if (this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value !== '') {
            this.queryParam = new URLSearchParams();
            this.queryParam.set(this.serviceConstants.Action, '6');
            this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.queryParam.set('AccountNumber', this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value);
            this.queryParam.set('Function', 'GetAccountDetails');
            this.httpService.makeGetRequest(this.queryParamsProspect['method'], this.queryParamsProspect['module'], this.queryParamsProspect['operation'], this.queryParam).subscribe(function (data) {
                try {
                    if (data.errorMessage) {
                        _this.messageModal.show({ msg: data.errorMessage, title: 'Message' }, false);
                        _this.onMessageClose = function () {
                            if (this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].value === '' && this.allFormControls[2]['formAccount'].controls['AddressLine1'].value !== '') {
                                if (this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value === '') {
                                    this.inputParamsPremiseAccount['AccountNumber'] = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
                                    this.inputParamsPremiseAccount['AccountName'] = this.allFormControls[0]['formPremise'].controls['PremiseName'].value;
                                    this.accountPremiseSearchEllipsis.openModal();
                                }
                                else {
                                    this.premiseSearchEllipsis.openModal();
                                }
                                this.onMessageClose = function () {
                                };
                            }
                        };
                    }
                    else {
                        for (var cntrl in data) {
                            if (data.hasOwnProperty(cntrl)) {
                                if (_this.allFormControls[0]['formPremise'].controls[cntrl]) {
                                    _this.allFormControls[0]['formPremise'].controls[cntrl].setValue(data[cntrl]);
                                }
                                else if (_this.allFormControls[1]['formGeneral'].controls[cntrl]) {
                                    _this.allFormControls[1]['formGeneral'].controls[cntrl].setValue(data[cntrl]);
                                }
                                else if (_this.allFormControls[2]['formAccount'].controls[cntrl]) {
                                    _this.allFormControls[2]['formAccount'].controls[cntrl].setValue(data[cntrl]);
                                }
                            }
                        }
                        if (_this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].value === '' && _this.allFormControls[2]['formAccount'].controls['AddressLine1'].value !== '') {
                            if (_this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value === '') {
                                _this.inputParamsPremiseAccount['AccountName'] = '';
                                _this.inputParamsPremiseAccount['AccountNumber'] = _this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
                                _this.accountPremiseSearchEllipsis.openModal();
                            }
                            else {
                                _this.premiseSearchEllipsis.openModal();
                            }
                        }
                    }
                }
                catch (error) {
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    ProspectMaintenanceComponent.prototype.updateStore = function (storeType, data) {
        this.storeData[storeType] = data;
    };
    ProspectMaintenanceComponent.prototype.saveStore = function (action) {
        switch (action) {
            case ActionTypes.SAVE_SYSTEM_PARAMETER:
                this.store.dispatch({
                    type: ActionTypes[action],
                    payload: { systemChars: this.storeData['systemChars'], formParentControl: this.maintenanceProspectSearchFormGroup }
                });
                break;
            case ActionTypes.CONTROL_DEFAULT_VALUE:
                this.store.dispatch({
                    type: ActionTypes[action],
                    payload: this.storeData['ttBusiness']
                });
                break;
            case ActionTypes.EXCHANGE_METHOD:
                this.store.dispatch({
                    type: ActionTypes[action],
                    payload: this.storeData['methods']
                });
                break;
            default:
                break;
        }
    };
    ProspectMaintenanceComponent.prototype.menuOnChange = function (data) {
    };
    ProspectMaintenanceComponent.prototype.buildMenuOptions = function () {
        var currentURL = window.location.href;
        this.menuAddOption('', 'Options');
        this.MenuOptionDropdown.selectedItem = '';
        if (currentURL.match(new RegExp('Prospect', 'i'))) {
            this.vAddURLParam = 'ProspectExistAcct';
        }
        if (currentURL.match(new RegExp('NatAxJob', 'i'))) {
            this.menuAddOption('NatAxJobServiceCover', 'Service Cover');
            if (currentURL.match(new RegExp('Confirm', 'i'))) {
                this.menuAddOption('GoToJob', 'Job');
            }
        }
        else {
            this.menuAddOption('Diary', 'Diary');
            this.menuAddOption('WorkOrders', 'WorkOrders');
            this.menuAddOption('TeleSalesOrder', 'Telesales Order');
        }
    };
    ProspectMaintenanceComponent.prototype.menuAddOption = function (strValue, strText) {
        var newOption = { value: strValue, text: strText };
        this.menuOptions.push(newOption);
    };
    ProspectMaintenanceComponent.prototype.requireFields = function () {
        var _this = this;
        this.queryParam = new URLSearchParams();
        this.queryParam.set(this.serviceConstants.Action, '6');
        this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParam.set('Function', 'GetInitialSettings');
        this.httpService.makeGetRequest(this.queryParamsProspect['method'], this.queryParamsProspect['module'], this.queryParamsProspect['operation'], this.queryParam).subscribe(function (data) {
            try {
                _this.systemChars.DefaultClosedDate = data.DefaultClosedDate;
                _this.systemChars.DefaultProbability = data.DefaultProbability;
                _this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
            }
            catch (error) {
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ProspectMaintenanceComponent.prototype.setUI = function () {
        this.systemChars.saveElement = this.el.nativeElement.querySelector('#save');
        this.systemChars.modalComp = this.messageModal;
        var parentMode = this.riExchange.ParentMode(this.systemChars.routeParams);
        this.fieldDisable.cancel = false;
        this.buildMenuOptions();
        this.functionPermission['FunctionAdd'] = true;
        this.functionPermission['FunctionDelete'] = false;
        this.functionPermission['FunctionSnapShot'] = false;
        this.functionPermission['DisplayMessages'] = true;
        this.customBusinessObject['select'] = false;
        this.customBusinessObject['Confirm'] = false;
        this.customBusinessObject['Insert'] = true;
        this.customBusinessObject['Update'] = false;
        this.customBusinessObject['Delete'] = true;
        var currentURL = window.location.href;
        if (currentURL.match(new RegExp('Prospect', 'i'))) {
            this.customBusinessObject['Select'] = true;
            this.pageTitle = 'Prospect Entry';
            this.titleService.setTitle(this.pageTitle);
            this.tabProspect.tabFocusTo(0);
            if (this.systemChars.LocalSystemInd) {
                this.functionPermission.FunctionUpdate = true;
                this.functionPermission.FunctionDelete = true;
            }
            this.systemChars.ProspectTypeDesc = 'Prospect';
        }
        else if (currentURL.match(new RegExp('NatAxJob', 'i'))) {
            this.pageTitle = 'National Account Job Confirmation';
            this.titleService.setTitle(this.pageTitle);
            this.tabProspect.tabFocusTo(0);
            this.systemChars.ProspectTypeDesc = 'NatAxJob';
        }
        else {
            this.pageTitle = 'National Account Job Confirmation';
            this.titleService.setTitle(this.pageTitle);
            this.tabProspect.tabFocusTo(0);
            this.functionPermission['FunctionAdd'] = false;
            this.functionPermission['FunctionDelete'] = false;
            if (parentMode === 'ConfirmNatAx') {
                this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'ProspectNumber'));
                this.functionPermission.fetchMode = true;
            }
            this.systemChars.ProspectTypeDesc = 'Confirm';
        }
        if (parentMode === 'ContactManagement' || parentMode === 'WorkOrderMaintenance') {
            this.systemChars.sCDisableQuoteDetsOnAddProspect = false;
        }
        this.systemChars.CallLogID = '0';
        this.systemChars.ContactTypeCode = '';
        this.systemChars.ContactTypeDetailCode = '';
        this.requireFields();
        if (parentMode === 'ContactManagement' || parentMode === 'WorkOrderMaintenance') {
            this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'ProspectNumber'));
        }
        if (parentMode === 'ContactRelatedTicket') {
            this.systemChars.sCDisableQuoteDetsOnAddProspect = false;
            this.functionPermission.FunctionAdd = false;
            this.functionPermission.FunctionSelect = false;
            this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'RelatedProspectNumber'));
            this.systemChars.CallLogID = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'CurrentCallLogID');
            this.systemChars.FromCustomerContactNumber = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'SelectedTicketNumber');
        }
        if (parentMode === 'SalesOrder' || parentMode === 'CallCentreSearch') {
            this.systemChars.sCDisableQuoteDetsOnAddProspect = false;
            this.functionPermission.FunctionAdd = false;
            this.functionPermission.FunctionSelect = false;
            this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'ProspectNumber'));
            this.systemChars.PassContactRowID = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'ContactRowID');
            if (parentMode === 'CallCentreSearch') {
                this.systemChars.CallLogID = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'CurrentCallLogID');
                this.systemChars.FromCustomerContactNumber = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'SelectedTicketNumber');
            }
            this.prospectLookUp();
        }
        if (parentMode === 'PipelineGridNew') {
            this.systemChars.sCDisableQuoteDetsOnAddProspect = false;
            this.functionPermission.addMode = true;
        }
        if (parentMode === 'TelesalesSearch') {
            this.functionPermission.RowID = this.riExchange.GetParentHTMLInputElementAttribute(this.systemChars.routeParams, 'RowID');
            this.functionPermission.fetchMode = true;
        }
        if (parentMode === 'CallCentreSearchNew' || parentMode === 'CallCentreSearchNewExisting') {
            this.systemChars.sCDisableQuoteDetsOnAddProspect = false;
            this.functionPermission.addMode = true;
            this.systemChars.CallLogID = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'CurrentCallLogID');
            this.systemChars.FromCustomerContactNumber = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'SelectedTicketNumber');
            this.systemChars.ContactTypeCode = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'ContactTypeCode');
            this.systemChars.ContactTypeDetailCode = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'ContactTypeDetailCode');
            if (parentMode === 'CallCentreSearchNewExisting') {
                this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'AccountNumber'));
                this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'ContractNumber'));
                this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'PremiseNumber'));
                if (this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].value === '0') {
                    this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].setValue('');
                }
                if (this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].value !== '') {
                    this.getPremiseDetails();
                }
                else {
                    this.getDefaultCustomerTypeCode();
                }
            }
            else {
                this.fieldVisibility.AccountNumber = true;
                this.fieldVisibility.ContractNumber = true;
                this.fieldVisibility.PremiseNumber = true;
                this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].setValue('');
            }
        }
        this.systemChars.LoggedInBranchNumber = this.utils.getBranchCode();
        if (parentMode === 'LostBusinessRequest') {
            this.functionPermission.addMode = true;
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].disable();
            this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].disable();
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'AccountNumber'));
            this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'ContractNumber'));
            this.systemChars.AssignToEmployeeCode = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'EmployeeCode');
            this.systemChars.AssignToEmployeeName = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'EmployeeSurName');
        }
        if (this.systemChars.LocalSystemInd) {
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].disable();
            this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].disable();
        }
        this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
        this.disableAllProspect();
    };
    ProspectMaintenanceComponent.prototype.getPremiseDetails = function () {
        var _this = this;
        this.queryParam.set(this.serviceConstants.Action, '6');
        this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParam.set('ContractNumber', this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value);
        this.queryParam.set('PremiseNumber', this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].value);
        this.queryParam.set('Function', 'GetPremiseDetails');
        this.httpService.makeGetRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam).subscribe(function (data) {
            try {
                _this.allFormControls[0]['formPremise'].controls['PremiseName'].setValue(data.PremiseName);
                _this.allFormControls[0]['formGeneral'].controls['PremiseAddressLine1'].setValue(data.PremiseAddressLine1);
                _this.allFormControls[0]['formPremise'].controls['PremiseAddressLine2'].setValue(data.PremiseAddressLine2);
                _this.allFormControls[0]['formGeneral'].controls['PremiseAddressLine3'].setValue(data.PremiseAddressLine3);
                _this.allFormControls[0]['formPremise'].controls['PremiseAddressLine4'].setValue(data.PremiseAddressLine4);
                _this.allFormControls[0]['formGeneral'].controls['PremiseAddressLine5'].setValue(data.PremiseAddressLine5);
                _this.allFormControls[0]['formGeneral'].controls['PremisePostcode'].setValue(data.PremisePostcode);
                _this.allFormControls[0]['formGeneral'].controls['PremiseContactName'].setValue(data.PremiseContactName);
                _this.allFormControls[0]['formGeneral'].controls['PremiseContactPosition'].setValue(data.PremiseContactPosition);
                _this.allFormControls[0]['formGeneral'].controls['PremiseContactTelephone'].setValue(data.PremiseContactTelephone);
                _this.allFormControls[0]['formGeneral'].controls['PremiseContactFax'].setValue(data.PremiseContactFax);
                _this.allFormControls[0]['formGeneral'].controls['PremiseContactMobile'].setValue(data.PremiseContactMobile);
                _this.allFormControls[0]['formGeneral'].controls['PremiseContactEmail'].setValue(data.PremiseContactEmail);
            }
            catch (error) {
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ProspectMaintenanceComponent.prototype.getDefaultCustomerTypeCode = function () {
        var _this = this;
        this.queryParam.set(this.serviceConstants.Action, '6');
        this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParam.set('ContractNumber', this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value);
        this.queryParam.set('Function', 'GetDefaultCustomerTypeCode');
        this.httpService.makeGetRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam).subscribe(function (data) {
            try {
                _this.allFormControls[1]['formGeneral'].controls['CustomerTypeCode'].setValue(data.CustomerTypeCode);
                _this.allFormControls[1]['formGeneral'].controls['CustomerTypeDesc'].setValue(data.CustomerTypeDesc);
            }
            catch (error) {
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ProspectMaintenanceComponent.prototype.accountNumberOnchange = function (obj) {
        var _this = this;
        if (obj.value)
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].setValue(this.utils.numberPadding(obj.value, 9));
        this.inputParamsPremiseAccount['AccountNumber'] = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
        this.contractSearchParams.accountNumber = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
        this.contractSearchEllipsis.updateComponent();
        if (this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value !== '') {
            this.queryParam = new URLSearchParams();
            this.queryParam.set(this.serviceConstants.Action, '6');
            this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.queryParam.set('AccountNumber', this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value);
            this.queryParam.set('Function', 'GetAccountDetails');
            this.httpService.makeGetRequest(this.queryParamsProspect['method'], this.queryParamsProspect['module'], this.queryParamsProspect['operation'], this.queryParam).subscribe(function (data) {
                try {
                    if (data.errorMessage) {
                        _this.messageModal.show({ msg: data.errorMessage, title: 'Message' }, false);
                        _this.onMessageClose = function () {
                            if (this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].value === '' && this.allFormControls[2]['formAccount'].controls['AddressLine1'].value !== '') {
                                if (this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value === '') {
                                    this.inputParamsPremiseAccount['AccountNumber'] = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
                                    this.inputParamsPremiseAccount['AccountName'] = this.allFormControls[0]['formPremise'].controls['PremiseName'].value;
                                    this.accountPremiseSearchEllipsis.openModal();
                                }
                                else {
                                    this.premiseSearchEllipsis.openModal();
                                }
                                this.onMessageClose = function () {
                                };
                            }
                        };
                    }
                    else {
                        _this.contractSearchParams.accountName = data.ProspectName;
                        _this.contractSearchEllipsis.updateComponent();
                        for (var cntrl in data) {
                            if (data.hasOwnProperty(cntrl)) {
                                if (_this.allFormControls[2]['formAccount'].controls[cntrl]) {
                                    _this.allFormControls[2]['formAccount'].controls[cntrl].setValue(data[cntrl]);
                                }
                            }
                        }
                        if (_this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].value === '' && _this.allFormControls[2]['formAccount'].controls['AddressLine1'].value !== '') {
                            if (_this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value === '') {
                                _this.inputParamsPremiseAccount['AccountName'] = '';
                                _this.inputParamsPremiseAccount['AccountNumber'] = _this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
                                _this.accountPremiseSearchEllipsis.openModal();
                            }
                            else {
                                _this.premiseSearchEllipsis.openModal();
                            }
                        }
                    }
                }
                catch (error) {
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    ProspectMaintenanceComponent.prototype.contractNumberOnchange = function (obj) {
        var _this = this;
        if (obj.value)
            this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].setValue(this.utils.numberPadding(obj.value, 8));
        if (!this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value) {
            this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].setValue('');
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].clearValidators();
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].updateValueAndValidity();
            this.accountRequired = false;
        }
        else {
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].setValidators([Validators.required]);
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].updateValueAndValidity();
            this.accountRequired = true;
        }
        this.inputParamsPremise.ContractNumber = this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value;
        if (this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value !== '') {
            this.queryParam = new URLSearchParams();
            this.queryParam.set(this.serviceConstants.Action, '6');
            this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.queryParam.set('ContractNumber', this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value);
            this.queryParam.set('Function', 'GetContractDetails,GetAccountDetails');
            this.httpService.makeGetRequest(this.queryParamsProspect['method'], this.queryParamsProspect['module'], this.queryParamsProspect['operation'], this.queryParam).subscribe(function (data) {
                try {
                    for (var cntrl in data) {
                        if (data.hasOwnProperty(cntrl)) {
                            if (_this.allFormControls[2]['formAccount'].controls[cntrl]) {
                                _this.allFormControls[2]['formAccount'].controls[cntrl].setValue(data[cntrl]);
                            }
                            else if (_this.maintenanceProspectSearchFormGroup.controls[cntrl]) {
                                _this.maintenanceProspectSearchFormGroup.controls[cntrl].setValue(data[cntrl]);
                            }
                        }
                    }
                    _this.inputParamsPremiseAccount['AccountNumber'] = data.AccountNumber;
                }
                catch (error) {
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    ProspectMaintenanceComponent.prototype.copyPeospectDetails = function (obj) {
        this.allFormControls[0]['formPremise'].controls['BusinessSourceCodeSelect'].setValue('E');
        this.allFormControls[0]['formPremise'].controls['LOSCodeSelect'].setValue(this.systemChars.LOSCode);
        this.allFormControls[0]['formPremise'].controls['BusinessOriginCodeSelect'].setValue(this.systemChars.BusinessOriginCode);
        this.storeData['methods'] = [];
        this.storeData['methods'] = ['businessSourceCodeSelectChange', 'businessOriginCodeSelectChange', 'setAccountRelatedInfo'];
        this.saveStore(ActionTypes.EXCHANGE_METHOD);
        this.messageModal.show({ msg: 'iCABSCMProspectSearch.htm is not yet developed', title: 'Message' }, false);
    };
    ProspectMaintenanceComponent.prototype.beforeSaveData = function () {
        var _this = this;
        this.routeAwayComponent.resetDirtyFlagAfterSaveUpdate();
        if (this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value !== '' && this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value !== '') {
            this.queryParam = new URLSearchParams();
            this.queryParam.set(this.serviceConstants.Action, '6');
            this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.queryParam.set('ContractNumber', this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value);
            this.queryParam.set('AccountNumber', this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value);
            this.queryParam.set('Function', 'CheckContractForAccount');
            this.httpService.makeGetRequest(this.queryParamsProspect['method'], this.queryParamsProspect['module'], this.queryParamsProspect['operation'], this.queryParam).subscribe(function (data) {
                try {
                    if (data.ErrorMessageDesc === '') {
                        _this.saveData();
                    }
                    else {
                        _this.el.nativeElement.querySelector('#ContractNumber').focus();
                    }
                }
                catch (error) {
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
        else {
            this.saveData();
        }
    };
    ProspectMaintenanceComponent.prototype.saveData = function () {
        var formdData = {}, errorWarning = false;
        for (var c in this.allFormControls[0]['formPremise'].controls) {
            if (this.allFormControls[0]['formPremise'].controls.hasOwnProperty(c)) {
                if (typeof this.allFormControls[0]['formPremise'].controls[c].value === 'undefined') {
                    this.allFormControls[0]['formPremise'].controls[c].setValue('');
                }
                this.allFormControls[0]['formPremise'].controls[c].markAsTouched();
            }
        }
        for (var c in this.allFormControls[1]['formGeneral'].controls) {
            if (this.allFormControls[1]['formGeneral'].controls.hasOwnProperty(c)) {
                this.allFormControls[1]['formGeneral'].controls[c].markAsTouched();
            }
        }
        for (var c in this.allFormControls[2]['formAccount'].controls) {
            if (this.allFormControls[2]['formAccount'].controls.hasOwnProperty(c)) {
                this.allFormControls[2]['formAccount'].controls[c].markAsTouched();
            }
        }
        if (this.allFormControls[0]['formPremise'].valid === false) {
            this.tabProspect.tabFocusTo(0, true);
        }
        else if (this.allFormControls[1]['formGeneral'].valid === false) {
            this.tabProspect.tabFocusTo(1, true);
        }
        else if (this.allFormControls[2]['formAccount'].valid === false) {
            this.tabProspect.tabFocusTo(2, true);
        }
        if (this.allFormControls[0]['formPremise'].valid && this.allFormControls[1]['formGeneral'].valid && (this.allFormControls[2]['formAccount'].valid || this.allFormControls[2]['formAccount'].status === 'DISABLED')) {
            this.tabProspect.tabFocusTo(0, false);
            if (this.systemChars.vSCMaxQuotesNumber !== 0 && this.allFormControls[1]['formGeneral'].controls['EstimatedTotalQuotes'].value !== '' && this.allFormControls[1]['formGeneral'].controls['EstimatedTotalQuotes'].value > this.systemChars.vSCMaxQuotesNumber) {
                errorWarning = true;
                this.messageModal.show({ msg: this.systemChars.cQuoteNumberWarningMessage, title: this.pageTitle }, false);
                this.onMessageClose = function () {
                    this.onMessageClose = function () {
                        if (this.systemChars.vSCMaxQuotesValue !== 0 && this.allFormControls[1]['formGeneral'].controls['EstimatedTotalValue'].value !== '' && this.allFormControls[1]['formGeneral'].controls['EstimatedTotalValue'].value > this.systemChars.vSCMaxQuotesValue) {
                            this.messageModal.show({ msg: this.systemChars.cQuoteValueWarningMessage, title: this.pageTitle }, false);
                            this.onMessageClose = function () {
                                this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
                                this.promptConfirmModal.show();
                                this.onMessageClose = function () {
                                };
                            };
                        }
                        else {
                            this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
                            this.promptConfirmModal.show();
                            this.onMessageClose = function () {
                            };
                        }
                    };
                };
            }
            else if (this.systemChars.vSCMaxQuotesValue !== 0 && this.allFormControls[1]['formGeneral'].controls['EstimatedTotalValue'].value !== '' && this.allFormControls[1]['formGeneral'].controls['EstimatedTotalValue'].value > this.systemChars.vSCMaxQuotesValue) {
                errorWarning = true;
                this.messageModal.show({ msg: this.systemChars.cQuoteValueWarningMessage, title: this.pageTitle }, false);
                this.onMessageClose = function () {
                    this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
                    this.promptConfirmModal.show();
                    this.onMessageClose = function () {
                    };
                };
            }
            if (!errorWarning) {
                this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
                this.promptConfirmModal.show();
            }
        }
        else {
            this.storeData['methods'] = [];
            this.storeData['methods'] = ['addInvalidClass'];
            this.saveStore(ActionTypes.EXCHANGE_METHOD);
        }
    };
    ProspectMaintenanceComponent.prototype.addProspect = function (data) {
        var _this = this;
        this.queryParam = new URLSearchParams();
        this.queryParam.set(this.serviceConstant.Action, '1');
        this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParam.set('Function', 'ValidateEmplLeft');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam, data)
            .subscribe(function (e) {
            if (typeof e['status'] !== 'undefined' && e['status'] === 'failure') {
                _this.errorService.emitError(e.status);
            }
            else {
                if ((typeof e !== 'undefined' && e.errorMessage)) {
                    _this.messageModal.show({ msg: e['errorMessage'], title: _this.pageTitle }, false);
                }
                else if (typeof e !== 'undefined' && e.Prospect !== '') {
                    _this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].setValue(e.ProspectNumber);
                    _this.customBusinessObject.Update = true;
                    _this.prospectROWID = e.Prospect;
                    _this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: _this.pageTitle }, false);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ProspectMaintenanceComponent.prototype.updateProspect = function (data) {
        var _this = this;
        data['ProspectROWID'] = this.prospectROWID;
        this.queryParam = new URLSearchParams();
        this.queryParam.set(this.serviceConstant.Action, '2');
        this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParam.set('Function', 'CheckValidProspect');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam, data)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.messageModal.show({ msg: e['errorMessage'], title: _this.pageTitle }, false);
                }
                else {
                    _this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: _this.pageTitle }, false);
                    _this.messageService.emitMessage(e);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ProspectMaintenanceComponent.prototype.populateProspect = function () {
        var _this = this;
        if (this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].value !== '' && this.customBusinessObject.Update) {
            this.queryParam = new URLSearchParams();
            this.queryParam.set(this.serviceConstants.Action, '0');
            this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.queryParam.set('Function', 'CheckValidProspect');
            this.queryParam.set('ProspectNumber', this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].value);
            this.httpService.makeGetRequest(this.queryParamsProspect['method'], this.queryParamsProspect['module'], this.queryParamsProspect['operation'], this.queryParam).subscribe(function (data) {
                try {
                    for (var cntrl in data) {
                        if (data.hasOwnProperty(cntrl)) {
                            if (_this.allFormControls[0]['formPremise'].controls[cntrl]) {
                                _this.allFormControls[0]['formPremise'].controls[cntrl].setValue(data[cntrl]);
                            }
                            else if (_this.allFormControls[1]['formGeneral'].controls[cntrl]) {
                                _this.allFormControls[1]['formGeneral'].controls[cntrl].setValue(data[cntrl]);
                            }
                            else if (_this.allFormControls[2]['formAccount'].controls[cntrl]) {
                                _this.allFormControls[2]['formAccount'].controls[cntrl].setValue(data[cntrl]);
                            }
                            else if (_this.maintenanceProspectSearchFormGroup.controls[cntrl]) {
                                _this.maintenanceProspectSearchFormGroup.controls[cntrl].setValue(data[cntrl]);
                            }
                            else if (cntrl === 'BusinessSourceCode') {
                                _this.allFormControls[0]['formPremise'].controls['BusinessSourceCodeSelect'].setValue(data[cntrl]);
                            }
                            else if (cntrl === 'BusinessOriginCode') {
                                _this.allFormControls[0]['formPremise'].controls['BusinessOriginCodeSelect'].setValue(data[cntrl]);
                            }
                            else if (cntrl === 'BusinessOriginDetailCode') {
                                _this.allFormControls[0]['formPremise'].controls['BusinessOriginDetailCodeSelect'].setValue(data[cntrl]);
                            }
                            else if (cntrl === 'LOSCode') {
                                _this.allFormControls[0]['formPremise'].controls['LOSCodeSelect'].setValue(data[cntrl]);
                            }
                            else if (cntrl === 'Prospect') {
                                _this.prospectROWID = data[cntrl];
                            }
                        }
                    }
                    var currentURL = window.location.href;
                    if (currentURL.match(new RegExp('Prospect', 'i'))) {
                        _this.allFormControls[0]['formPremise'].controls['AssignToEmployeeCode'].setValue(data['ServicingSalesEmployeeCode']);
                        if (data['ServicingSalesEmployeeCode'])
                            _this.getEmployeeName(data['ServicingSalesEmployeeCode'], 'AssignToEmployeeName');
                        if (data['PDALeadEmployeeCode'])
                            _this.getEmployeeName(data['PDALeadEmployeeCode'], 'PDALeadEmployeeSurname');
                        _this.getCustomerTypeDesc();
                        if (_this.systemChars.vSICCodeEnable) {
                            _this.getSICDescription();
                        }
                    }
                    else {
                        _this.getPaymentType();
                        _this.getBranch();
                        if (data['NegotiatingSalesEmployeeCode'])
                            _this.getEmployeeName(data['NegotiatingSalesEmployeeCode'], 'NegotiatingSalesEmployeeSurname');
                        if (data['ServicingSalesEmployeeCode'])
                            _this.getEmployeeName(data['ServicingSalesEmployeeCode'], 'ServicingSalesEmployeeSurname');
                    }
                    _this.afterFetch();
                    _this.getContactMediumDesc();
                    _this.getStatusDesc();
                    _this.inputParamsPremiseAccount['AccountNumber'] = _this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
                    _this.contractSearchParams.accountNumber = _this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
                    _this.inputParamsPremise.ContractNumber = _this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value;
                }
                catch (error) {
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    ProspectMaintenanceComponent.prototype.updateStoreControl = function (action) {
        this.store.dispatch({
            type: ActionTypes[action],
            payload: { formParent: this.maintenanceProspectSearchFormGroup }
        });
    };
    ProspectMaintenanceComponent.prototype.menuOnchange = function (menuOptionValue) {
        switch (menuOptionValue) {
            case 'NatAxJobServiceCover':
                break;
            case 'GoToJob':
                break;
            case 'Diary':
                break;
            case 'WorkOrders':
                break;
            case 'Contacts':
                break;
            case 'TeleSalesOrder':
                break;
        }
    };
    ProspectMaintenanceComponent.prototype.promptConfirm = function (event) {
        var formdData = {};
        for (var c in this.allFormControls[0]['formPremise'].controls) {
            if (this.allFormControls[0]['formPremise'].controls.hasOwnProperty(c)) {
                if (c === 'LOSCodeSelect') {
                    formdData['LOSCode'] = this.allFormControls[0]['formPremise'].controls[c].value;
                }
                else if (c === 'BusinessSourceCodeSelect') {
                    formdData['BusinessSourceCode'] = this.allFormControls[0]['formPremise'].controls[c].value;
                }
                else if (c === 'BusinessOriginCodeSelect') {
                    formdData['BusinessOriginCode'] = this.allFormControls[0]['formPremise'].controls[c].value;
                }
                else if (c === 'BusinessOriginDetailCodeSelect') {
                    if (typeof this.allFormControls[0]['formPremise'].controls[c].value !== 'undefined')
                        formdData['BusinessOriginDetailCode'] = this.allFormControls[0]['formPremise'].controls[c].value;
                }
                else {
                    if (typeof this.allFormControls[0]['formPremise'].controls[c].value !== 'undefined') {
                        if (this.isRequireService(c)) {
                            formdData[c] = this.allFormControls[0]['formPremise'].controls[c].value;
                        }
                    }
                }
                this.allFormControls[0]['formPremise'].controls[c].markAsTouched();
            }
        }
        for (var c in this.allFormControls[1]['formGeneral'].controls) {
            if (this.allFormControls[1]['formGeneral'].controls.hasOwnProperty(c)) {
                if (this.isRequireService(c)) {
                    formdData[c] = this.allFormControls[1]['formGeneral'].controls[c].value;
                    this.allFormControls[1]['formGeneral'].controls[c].markAsTouched();
                }
            }
        }
        for (var c in this.allFormControls[2]['formAccount'].controls) {
            if (this.allFormControls[2]['formAccount'].controls.hasOwnProperty(c)) {
                if (this.isRequireService(c)) {
                    formdData[c] = this.allFormControls[2]['formAccount'].controls[c].value;
                    this.allFormControls[2]['formAccount'].controls[c].markAsTouched();
                }
            }
        }
        if (this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].value)
            formdData['ProspectNumber'] = this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].value;
        else
            formdData['ProspectNumber'] = '';
        formdData['AccountNumber'] = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
        formdData['ContractNumber'] = this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value;
        formdData['PremiseNumber'] = this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].value;
        if (this.systemChars.routeParams) {
            if (this.prospectROWID && this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].value !== '' && this.customBusinessObject.Update) {
                this.updateProspect(formdData);
            }
            else {
                formdData['LoggedInBranchNumber'] = this.systemChars['LoggedInBranchNumber'];
                formdData['ProspectTypeDesc'] = this.systemChars.ProspectTypeDesc;
                this.addProspect(formdData);
            }
        }
    };
    ProspectMaintenanceComponent.prototype.prospectLookUp = function (Obj) {
        if (Obj === void 0) { Obj = {}; }
        this.customBusinessObject.Update = true;
        this.systemChars.customBusinessObject = this.customBusinessObject;
        this.populateProspect();
        this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
    };
    ProspectMaintenanceComponent.prototype.afterFetch = function () {
        var _this = this;
        var currentURL = window.location.href, data = {};
        data['ProspectNumber'] = this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].value;
        data['ProspectTypeDesc'] = this.systemChars.ProspectTypeDesc;
        data['LoggedInBranchNumber'] = this.systemChars['LoggedInBranchNumber'];
        this.queryParam = new URLSearchParams();
        this.queryParam.set(this.serviceConstant.Action, '6');
        this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (currentURL.match(new RegExp('Prospect', 'i'))) {
            this.queryParam.set('Function', 'CheckValidProspect,GetDefaultValues');
        }
        else {
            this.queryParam.set('Function', 'CheckValidProspect');
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam, data)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
                _this.customBusinessObject.Enable = false;
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.messageModal.show({ msg: e['errorMessage'], title: 'Message' }, false);
                    _this.customBusinessObject.Update = false;
                }
                else {
                    _this.customBusinessObject.Enable = true;
                    _this.storeData['methods'] = [];
                    _this.enableAllProspect();
                    _this.storeData['methods'] = ['enableAllPremise', 'enableAllGeneral', 'enableAllAccount', 'beforeUpdate', 'updatePremiseData', 'updateGeneralData', 'updateAccountData', 'updateBusinessOrigin', 'setAccountRelatedInfo'];
                    _this.saveStore(ActionTypes.EXCHANGE_METHOD);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ProspectMaintenanceComponent.prototype.onPremiseDataReceived = function (data, route) {
        this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].setValue(data.PremiseNumber);
        this.populatePremiseAccountdata();
    };
    ProspectMaintenanceComponent.prototype.premiseNumberChange = function () {
        if (this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].value && this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value) {
            this.populatePremiseAccountdata();
        }
    };
    ProspectMaintenanceComponent.prototype.onPremiseAccounSearchDataReceived = function (data) {
        this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].setValue(data.PremiseNumber);
        this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].setValue(data.ContractNumber);
        this.populatePremiseAccountdata();
    };
    ProspectMaintenanceComponent.prototype.populatePremiseAccountdata = function () {
        var _this = this;
        this.queryParam = new URLSearchParams();
        this.queryParam.set(this.serviceConstants.Action, '6');
        this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParam.set('ContractNumber', this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value);
        this.queryParam.set('PremiseNumber', this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].value);
        this.queryParam.set('Function', 'GetPremiseDetails,GetAccountDetails');
        this.httpService.makeGetRequest(this.queryParamsProspect['method'], this.queryParamsProspect['module'], this.queryParamsProspect['operation'], this.queryParam).subscribe(function (data) {
            try {
                if (data.errorMessage) {
                    _this.messageModal.show({ msg: data.errorMessage, title: _this.pageTitle }, false);
                }
                else {
                    for (var cntrl in data) {
                        if (data.hasOwnProperty(cntrl)) {
                            if (_this.allFormControls[0]['formPremise'].controls[cntrl]) {
                                _this.allFormControls[0]['formPremise'].controls[cntrl].setValue(data[cntrl]);
                            }
                            else if (_this.allFormControls[1]['formGeneral'].controls[cntrl]) {
                                _this.allFormControls[1]['formGeneral'].controls[cntrl].setValue(data[cntrl]);
                            }
                            else if (_this.allFormControls[2]['formAccount'].controls[cntrl]) {
                                _this.allFormControls[2]['formAccount'].controls[cntrl].setValue(data[cntrl]);
                            }
                            else if (_this.maintenanceProspectSearchFormGroup.controls[cntrl]) {
                                _this.maintenanceProspectSearchFormGroup.controls[cntrl].setValue(data[cntrl]);
                            }
                            else if (cntrl === 'BusinessSourceCode') {
                                _this.allFormControls[0]['formPremise'].controls['BusinessSourceCodeSelect'].setValue(data[cntrl]);
                            }
                            else if (cntrl === 'BusinessOriginCode') {
                                _this.allFormControls[0]['formPremise'].controls['BusinessOriginCodeSelect'].setValue(data[cntrl]);
                            }
                            else if (cntrl === 'BusinessOriginDetailCode') {
                                _this.allFormControls[0]['formPremise'].controls['BusinessOriginDetailCodeSelect'].setValue(data[cntrl]);
                            }
                            else if (cntrl === 'LOSCode') {
                                _this.allFormControls[0]['formPremise'].controls['LOSCodeSelect'].setValue(data[cntrl]);
                            }
                        }
                    }
                    var currentURL = window.location.href;
                    if (currentURL.match(new RegExp('Prospect', 'i'))) {
                        _this.allFormControls[0]['formPremise'].controls['AssignToEmployeeCode'].setValue(data['ServicingSalesEmployeeCode']);
                        if (data['ServicingSalesEmployeeCode'])
                            _this.getEmployeeName(data['ServicingSalesEmployeeCode'], 'AssignToEmployeeName');
                        if (data['PDALeadEmployeeCode'])
                            _this.getEmployeeName(data['PDALeadEmployeeCode'], 'PDALeadEmployeeSurname');
                        _this.getCustomerTypeDesc();
                        if (_this.systemChars.vSICCodeEnable) {
                            _this.getSICDescription();
                        }
                    }
                    else {
                        _this.getPaymentType();
                        _this.getBranch();
                        if (data['NegotiatingSalesEmployeeCode'])
                            _this.getEmployeeName(data['NegotiatingSalesEmployeeCode'], 'NegotiatingSalesEmployeeSurname');
                        if (data['ServicingSalesEmployeeCode'])
                            _this.getEmployeeName(data['ServicingSalesEmployeeCode'], 'ServicingSalesEmployeeSurname');
                    }
                    _this.getContactMediumDesc();
                    _this.getStatusDesc();
                    _this.getCustomerTypeDesc();
                    _this.postcodePopulate();
                }
                var parentMode = _this.riExchange.ParentMode(_this.systemChars.routeParams);
                if (parentMode === 'CallCentreSearch' || parentMode === 'CallCentreSearchNew' || parentMode === 'CallCentreSearchNewExisting') {
                    _this.allFormControls[0]['formPremise'].controls['PremiseContactName'].setValue(_this.riExchange.GetParentHTMLInputValue(_this.systemChars.routeParams, 'CallContactName'));
                    _this.allFormControls[0]['formPremise'].controls['PremiseContactPosition'].setValue(_this.riExchange.GetParentHTMLInputValue(_this.systemChars.routeParams, 'CallContactPosition'));
                    _this.allFormControls[0]['formPremise'].controls['PremiseContactTelephone'].setValue(_this.riExchange.GetParentHTMLInputValue(_this.systemChars.routeParams, 'CallContactTelephone'));
                    _this.allFormControls[0]['formPremise'].controls['PremiseContactMobile'].setValue(_this.riExchange.GetParentHTMLInputValue(_this.systemChars.routeParams, 'CallContactMobile'));
                    _this.allFormControls[0]['formPremise'].controls['PremiseContactFax'].setValue(_this.riExchange.GetParentHTMLInputValue(_this.systemChars.routeParams, 'CallContactFax'));
                    _this.allFormControls[0]['formPremise'].controls['PremiseContactEmail'].setValue(_this.riExchange.GetParentHTMLInputValue(_this.systemChars.routeParams, 'CallContactEmail'));
                }
            }
            catch (error) {
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ProspectMaintenanceComponent.prototype.isRequireService = function (field) {
        var excludeList = ['ContactMediumDesc', 'AssignToEmployeeCode', 'AssignToEmployeeName',
            'CommenceDate', 'ContractExpiryDate', 'AnnualValue', 'PaymentDesc', 'NegotiatingSalesEmployeeCode',
            'NegotiatingSalesEmployeeSurname', 'ServicingSalesEmployeeSurname', 'CustomerTypeDesc', 'SICDescription',
            'PaymentTypeCode', 'chkAuthorise', 'ProspectStatusDesc', 'chkReject', 'chkBranch'];
        return excludeList.indexOf(field) === -1 ? true : false;
    };
    ProspectMaintenanceComponent.prototype.postcodePopulate = function () {
        var _this = this;
        this.queryParam.set(this.serviceConstants.Action, '6');
        this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParam.set('PremisePostcode', this.allFormControls[0]['formPremise'].controls['PremisePostcode'].value);
        if (this.allFormControls[0]['formPremise'].controls['PremiseAddressLine4'].value)
            this.queryParam.set('PremiseAddressLine4', this.allFormControls[0]['formPremise'].controls['PremiseAddressLine4'].value);
        if (this.allFormControls[0]['formPremise'].controls['PremiseAddressLine5'].value)
            this.queryParam.set('PremiseAddressLine5', this.allFormControls[0]['formPremise'].controls['PremiseAddressLine5'].value);
        if (this.allFormControls[0]['formPremise'].controls['LOSCodeSelect'].value)
            this.queryParam.set('LOSCode', this.allFormControls[0]['formPremise'].controls['LOSCodeSelect'].value);
        this.queryParam.set('Function', 'GetAssignToSalesDetails');
        this.httpService.makeGetRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam).subscribe(function (data) {
            try {
                if (!data.errorMessage) {
                    if (!_this.allFormControls[0]['formPremise'].controls['AssignToEmployeeCode'].value)
                        _this.allFormControls[0]['formPremise'].controls['AssignToEmployeeCode'].setValue(data.ServicingSalesEmployeeCode);
                    if (!_this.allFormControls[0]['formPremise'].controls['AssignToEmployeeName'].value)
                        _this.allFormControls[0]['formPremise'].controls['AssignToEmployeeName'].setValue(data.AssignToEmployeeName);
                    if (!_this.allFormControls[0]['formPremise'].controls['DefaultAssigneeEmployeeDetails'].value)
                        _this.allFormControls[0]['formPremise'].controls['DefaultAssigneeEmployeeDetails'].setValue(data.DefaultAssigneeEmployeeDetails);
                    if (!_this.allFormControls[0]['formPremise'].controls['ServicingSalesEmployeeCode'].value)
                        _this.allFormControls[0]['formPremise'].controls['ServicingSalesEmployeeCode'].setValue(data.ServicingSalesEmployeeCode);
                }
            }
            catch (error) {
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ProspectMaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.translateService.setUpTranslation();
        this.loadSystemChars();
        this.getBusinessSource();
        this.updateStoreControl(ActionTypes.PARENT_FORM);
        this.routeAwayGlobals.setDirtyFlag(true);
        setTimeout(function () {
            _this.cbbService.disableComponent(true);
        }, 400);
    };
    ProspectMaintenanceComponent.prototype.ngAfterViewInit = function () {
        var child = this.container.nativeElement.getElementsByClassName('form-item');
        var count = 0;
        for (var i = 0; i < child.length; i++) {
            if (!child[i].classList.contains('hidden')) {
                count++;
                if (((count) % 3 === 0) && count >= 3) {
                    if ((i + 1) < child.length)
                        child[i + 1].className += ' clear';
                }
            }
        }
        this.setUI();
    };
    ProspectMaintenanceComponent.prototype.ngOnDestroy = function () {
        this.routeAwayGlobals.resetRouteAwayFlags();
        if (this.componentInteractionSubscription)
            this.componentInteractionSubscription.unsubscribe();
    };
    ProspectMaintenanceComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    ProspectMaintenanceComponent.prototype.onSaveFocus = function (e) {
        var nextTab = 0;
        var code = (e.keyCode ? e.keyCode : e.which);
        var elemList = document.querySelectorAll('.tab-container .nav-tabs li a');
        var currentSelectedIndex = Array.prototype.indexOf.call(elemList, document.querySelector('.tab-container .nav-tabs li a.active'));
        if (code === 9 && currentSelectedIndex < (elemList.length - 1)) {
            var click = new MouseEvent('click', { bubbles: true });
            nextTab = currentSelectedIndex + 1;
            this.tabProspect.tabFocusTo(nextTab);
            setTimeout(function () {
                document.querySelector('.tab-pane.active input:not([disabled]), .tab-pane.active select:not([disabled])')['focus']();
            }, 100);
        }
        return;
    };
    ProspectMaintenanceComponent.prototype.onMessageClose = function () {
    };
    ProspectMaintenanceComponent.prototype.cancelClick = function () {
        this.resetData();
    };
    ProspectMaintenanceComponent.prototype.resetData = function () {
        if (this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].value !== '' && this.customBusinessObject.Update) {
            this.populateProspect();
            this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
        }
        else {
            for (var c in this.allFormControls[0]['formPremise'].controls) {
                if (this.allFormControls[0]['formPremise'].controls.hasOwnProperty(c)) {
                    this.allFormControls[0]['formPremise'].controls[c].setValue('');
                    this.allFormControls[0]['formPremise'].controls[c].markAsTouched();
                }
            }
            for (var c in this.allFormControls[1]['formGeneral'].controls) {
                if (this.allFormControls[1]['formGeneral'].controls.hasOwnProperty(c)) {
                    this.allFormControls[1]['formGeneral'].controls[c].setValue('');
                    this.allFormControls[1]['formGeneral'].controls[c].markAsTouched();
                }
            }
            for (var c in this.allFormControls[2]['formAccount'].controls) {
                if (this.allFormControls[2]['formAccount'].controls.hasOwnProperty(c)) {
                    this.allFormControls[2]['formAccount'].controls[c].setValue('');
                    this.allFormControls[2]['formAccount'].controls[c].markAsTouched();
                }
            }
            for (var c in this.maintenanceProspectSearchFormGroup.controls) {
                if (this.maintenanceProspectSearchFormGroup.controls.hasOwnProperty(c)) {
                    this.maintenanceProspectSearchFormGroup.controls[c].setValue('');
                    this.maintenanceProspectSearchFormGroup.controls[c].markAsTouched();
                }
            }
            this.storeData['methods'] = ['resetPremiseData', 'resetGrneralData'];
            this.saveStore(ActionTypes.EXCHANGE_METHOD);
            this.tabProspect.tabFocusTo(0, true);
        }
    };
    ProspectMaintenanceComponent.prototype.disableAllProspect = function () {
        for (var c in this.maintenanceProspectSearchFormGroup.controls) {
            if (this.maintenanceProspectSearchFormGroup.controls.hasOwnProperty(c)) {
                if (c !== 'ProspectNumber')
                    this.maintenanceProspectSearchFormGroup.controls[c].disable();
            }
        }
        for (var p in this.ellipsisDisable) {
            if (this.ellipsisDisable.hasOwnProperty(p)) {
                this.ellipsisDisable[p] = true;
            }
        }
        this.fieldDisable.cancel = true;
        this.fieldDisable.optionDisable = true;
        this.fieldDisable.copy = true;
        this.fieldDisable.save = true;
    };
    ProspectMaintenanceComponent.prototype.enableAllProspect = function () {
        for (var c in this.maintenanceProspectSearchFormGroup.controls) {
            if (this.maintenanceProspectSearchFormGroup.controls.hasOwnProperty(c)) {
                if (c !== 'ProspectNumber')
                    this.maintenanceProspectSearchFormGroup.controls[c].enable();
            }
        }
        for (var p in this.ellipsisDisable) {
            if (this.ellipsisDisable.hasOwnProperty(p)) {
                this.ellipsisDisable[p] = false;
            }
        }
        this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].disable();
        this.fieldDisable.cancel = false;
        this.fieldDisable.optionDisable = false;
        this.fieldDisable.copy = false;
        this.fieldDisable.save = false;
    };
    ProspectMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-prospect-maintenance',
                    templateUrl: 'iCABSCMPipelineProspectMaintenance.html'
                },] },
    ];
    ProspectMaintenanceComponent.ctorParameters = [
        { type: Router, },
        { type: ComponentInteractionService, },
        { type: HttpService, },
        { type: ServiceConstants, },
        { type: ErrorService, },
        { type: Utils, },
        { type: ErrorConstant, },
        { type: AjaxObservableConstant, },
        { type: Store, },
        { type: FormBuilder, },
        { type: SysCharConstants, },
        { type: NgZone, },
        { type: ActivatedRoute, },
        { type: Title, },
        { type: RiExchange, },
        { type: ElementRef, },
        { type: ServiceConstants, },
        { type: MessageService, },
        { type: CBBService, },
        { type: NgZone, },
        { type: LocaleTranslationService, },
        { type: RouteAwayGlobals, },
    ];
    ProspectMaintenanceComponent.propDecorators = {
        'container': [{ type: ViewChild, args: ['topContainer',] },],
        'tabProspect': [{ type: ViewChild, args: ['tabProspect',] },],
        'MenuOptionDropdown': [{ type: ViewChild, args: ['MenuOptionDropdown',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptConfirmModal': [{ type: ViewChild, args: ['promptConfirmModal',] },],
        'contractSearchEllipsis': [{ type: ViewChild, args: ['contractSearchEllipsis',] },],
        'accountPremiseSearchEllipsis': [{ type: ViewChild, args: ['accountPremiseSearchEllipsis',] },],
        'premiseSearchEllipsis': [{ type: ViewChild, args: ['premiseSearchEllipsis',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return ProspectMaintenanceComponent;
}());
