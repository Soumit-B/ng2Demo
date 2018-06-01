import { AccountBusinessTypeSearchComponent } from './../../../internal/search/iCABSSAccountBusinessTypeSearch/iCABSSAccountBusinessTypeSearch';
import { Utils } from './../../../../shared/services/utility';
import { GroupAccountNumberComponent } from './../../../internal/search/iCABSSGroupAccountNumberSearch';
import { LocaleTranslationService } from './../../../../shared/services/translation.service';
import { Http, URLSearchParams } from '@angular/http';
import { TranslateService } from 'ng2-translate';
import { Logger } from '@nsalaun/ng2-logger';
import { Router } from '@angular/router';
import { PageDataService } from './../../../../shared/services/page-data.service';
import { AjaxObservableConstant } from './../../../../shared/constants/ajax-observable.constant';
import { AuthService } from './../../../../shared/services/auth.service';
import { LocalStorageService } from 'ng2-webstorage';
import { Title } from '@angular/platform-browser';
import { ErrorService } from './../../../../shared/services/error.service';
import { MessageService } from './../../../../shared/services/message.service';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { HttpService } from './../../../../shared/services/http-service';
import { AccountMaintenanceActionTypes } from './../../../actions/account-maintenance';
import { Component, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { PostCodeSearchComponent } from '../../../../app/internal/search/iCABSBPostcodeSearch.component';
export var GeneralComponent = (function () {
    function GeneralComponent(httpService, serviceConstants, errorService, messageService, authService, ajaxconstant, router, pageData, titleService, zone, store, translate, ls, http, translateService, fb, logger, utilService) {
        var _this = this;
        this.httpService = httpService;
        this.serviceConstants = serviceConstants;
        this.errorService = errorService;
        this.messageService = messageService;
        this.authService = authService;
        this.ajaxconstant = ajaxconstant;
        this.router = router;
        this.pageData = pageData;
        this.titleService = titleService;
        this.zone = zone;
        this.store = store;
        this.translate = translate;
        this.ls = ls;
        this.http = http;
        this.translateService = translateService;
        this.fb = fb;
        this.logger = logger;
        this.utilService = utilService;
        this.inputParams = { 'parentMode': 'Contract-Search', 'ContractTypeCode': 'J', 'businessCode': 'D' };
        this.inputParamsLogoTypeSearch = {};
        this.isLogoTypeDisabled = false;
        this.fieldDisabled = {
            'BtnSendToNAV': false,
            'cmdGetAddress': false,
            'cmdSetInvoiceGroupDefault': false,
            'cmdSetInvoiceGroupEDI': false,
            'selMandateTypeCode': false,
            'cmdGenerateNew': false
        };
        this.fieldVisibility = {
            'NationalAccount': true,
            'DedicatedContactProcedureInd': true,
            'InSightAccountInd': true,
            'InterGroupAccount': true,
            'VATExempt': true,
            'ExcludePDADebtInd': true,
            'AccountBusinessTypeCode': true,
            'AccountBusinessTypeDesc': true,
            'GroupAccountNumber': true,
            'GroupName': true,
            'PriceListInd': true,
            'LogoTypeCode': true,
            'LogoTypeDesc': true,
            'ExternalReference': true,
            'AccountBalance': true,
            'BadDebtAccount': true,
            'BadDebtNarrative': true,
            'LiveAccount': true,
            'IncludeMarketingCampaign': true,
            'trVATExempt': true,
            'trExcludePDADebt': true,
            'trInformation': false,
            'vSCGroupAccount': false
        };
        this.fieldRequired = {
            'isNationalAccountRequired': false,
            'isDedicatedContactProcedureIndRequired': false,
            'isCommonStatementRequired': false,
            'isInSightAccountIndRequired': false,
            'isCreateNewInvoiceGroupIndRequired': false,
            'isInterGroupAccountRequired': false,
            'isOutsortInvoiceDefaultIndRequired': false,
            'isExternalReferenceRequired': false,
            'isLogoTypeCodeRequired': false
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
        this.zipSearchComponent = PostCodeSearchComponent;
        this.autoOpen = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.searchModalRoute = '';
        this.showHeader = true;
        this.showCloseButton = true;
        this.isCountryCodeDisabled = true;
        this.isZipCodeEllipsisDisabled = true;
        this.defaultCode = {
            country: 'ZA',
            business: 'D',
            BranchNumber: ''
        };
        this.countrySelected = {
            id: '',
            text: ''
        };
        this.branchList = [];
        this.updateMode = false;
        this.addMode = false;
        this.searchMode = false;
        this.method = 'contract-management/maintenance';
        this.module = 'account';
        this.operation = 'Application/iCABSAAccountMaintenance';
        this.contentType = 'application/x-www-form-urlencoded';
        this.groupAccountNumberAutoOpen = false;
        this.inputParamsGroupAccountNumber = { 'parentMode': 'LookUp' };
        this.groupAccountNumberComponent = GroupAccountNumberComponent;
        this.isGroupAccountNumberEllipsisDisabled = false;
        this.logoTypeCodeAutoOpen = false;
        this.inputParamsLogoTypeCode = { 'parentMode': 'LookUp' };
        this.logoTypeCoderComponent = GroupAccountNumberComponent;
        this.ellipsis = {
            accountBusinessTypeSearch: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'LookUp-Account',
                component: AccountBusinessTypeSearchComponent
            }
        };
        this.thInformation = '';
        this.generalComponentFormGroup = this.fb.group({
            NationalAccount: [{ value: true, disabled: true }],
            DedicatedContactProcedureInd: [{ value: false, disabled: true }],
            InSightAccountInd: [{ value: false, disabled: true }],
            InterGroupAccount: [{ value: '', disabled: true }],
            VATExempt: [{ value: '', disabled: true }],
            ExcludePDADebtInd: [{ value: '', disabled: true }],
            AccountBusinessTypeCode: [{ value: '', disabled: true }],
            AccountBusinessTypeDesc: [{ value: '', disabled: true }],
            GroupAccountNumber: [{ value: '', disabled: true }],
            GroupName: [{ value: '', disabled: true }],
            PriceListInd: [{ value: '', disabled: true }],
            LogoTypeCode: [{ value: '', disabled: true }],
            LogoTypeDesc: [{ value: '', disabled: true }],
            ExternalReference: [{ value: '', disabled: true }],
            AccountBalance: [{ value: '', disabled: true }],
            BadDebtAccount: [{ value: '', disabled: true }],
            BadDebtNarrative: [{ value: '', disabled: true }],
            LiveAccount: [{ value: '', disabled: true }],
            IncludeMarketingCampaign: [{ value: '', disabled: true }]
        });
        this.storeSubscription = store.select('accountMaintenance').subscribe(function (data) {
            if (data && data['action']) {
                _this.storeData = data;
                _this.params = data['params'];
                switch (data['action']) {
                    case AccountMaintenanceActionTypes.SAVE_DATA:
                        if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
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
                            _this.mode = data['mode'];
                            _this.addMode = data['mode'].addMode;
                            _this.updateMode = data['mode'].updateMode;
                            _this.searchMode = data['mode'].searchMode;
                            _this.processForm();
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_SYSCHAR:
                        if (data['syschars'] && !(Object.keys(data['syschars']).length === 0 && data['syschars'].constructor === Object)) {
                            _this.sysCharParams = data['syschars'];
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_PROCESSED_SYSCHAR:
                        if (data['processedSysChar'] && !(Object.keys(data['processedSysChar']).length === 0 && data['processedSysChar'].constructor === Object)) {
                            _this.sysCharParams = data['processedSysChar'];
                        }
                        break;
                    case AccountMaintenanceActionTypes.FORM_INIT:
                        break;
                    case AccountMaintenanceActionTypes.SAVE_VIRTUAL_TABLE_DATA:
                        _this.virtualTableField = data['virtualTableData'];
                        _this.generalComponentFormGroup.controls['GroupName'].setValue(_this.virtualTableField.GroupName);
                        _this.generalComponentFormGroup.controls['AccountBusinessTypeDesc'].setValue(_this.virtualTableField.AccountBusinessTypeDesc);
                        _this.generalComponentFormGroup.controls['LogoTypeDesc'].setValue(_this.virtualTableField.LogoTypeDesc);
                        if (_this.generalComponentFormGroup.controls['LogoTypeCode'].value) {
                            var logoTypeCode_1 = _this.generalComponentFormGroup.controls['LogoTypeCode'].value;
                            var logoTypeDesc_1 = _this.generalComponentFormGroup.controls['LogoTypeDesc'].value;
                            _this.zone.run(function () {
                                _this.selectedLogoType = { text: (logoTypeDesc_1) ? logoTypeCode_1 + ' - ' + logoTypeDesc_1 : logoTypeCode_1 };
                            });
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_RETURN_HTML:
                        var returnHtmlObj_1 = data['returnHtml'];
                        if (returnHtmlObj_1) {
                            _this.zone.run(function () {
                                _this.thInformation = returnHtmlObj_1['ReturnHTML'];
                                _this.fieldVisibility.trInformation = returnHtmlObj_1['trInformation'];
                            });
                        }
                        break;
                    case AccountMaintenanceActionTypes.VALIDATE_FORMS:
                        if (typeof (data['validate'].general) !== 'undefined') {
                            _this.validateForm();
                        }
                        break;
                    case AccountMaintenanceActionTypes.LOAD_FORM_GROUP:
                        _this.dispathFormGroup();
                        break;
                    default:
                        break;
                }
            }
        });
    }
    GeneralComponent.prototype.ngOnInit = function () {
        String.prototype['capitalizeFirstLetter'] = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        this.defaultCode.country = this.utilService.getCountryCode();
        this.defaultCode.business = this.utilService.getBusinessCode();
        this.fetchBranchDetails();
        this.dispathFormGroup();
    };
    GeneralComponent.prototype.ngAfterViewInit = function () {
    };
    GeneralComponent.prototype.dispathFormGroup = function () {
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                general: this.generalComponentFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                general: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                general: this.fieldVisibility
            }
        });
    };
    GeneralComponent.prototype.setFormData = function (data) {
        var _this = this;
        if (!data['data'])
            return;
        this.generalComponentFormGroup.controls['NationalAccount'].setValue(this.isCheckBoxChecked(data['data'].NationalAccount));
        this.generalComponentFormGroup.controls['DedicatedContactProcedureInd'].setValue(this.isCheckBoxChecked(data['data'].DedicatedContactProcedureInd));
        this.generalComponentFormGroup.controls['InSightAccountInd'].setValue(this.isCheckBoxChecked(data['data'].InSightAccountInd));
        this.generalComponentFormGroup.controls['InterGroupAccount'].setValue(this.isCheckBoxChecked(data['data'].InterGroupAccount));
        this.generalComponentFormGroup.controls['VATExempt'].setValue(this.isCheckBoxChecked(data['data'].VATExempt));
        this.generalComponentFormGroup.controls['ExcludePDADebtInd'].setValue(this.isCheckBoxChecked(data['data'].ExcludePDADebtInd));
        this.generalComponentFormGroup.controls['AccountBusinessTypeCode'].setValue(data['data'].AccountBusinessTypeCode);
        this.generalComponentFormGroup.controls['AccountBusinessTypeDesc'].setValue(data['data'].AccountBusinessTypeDesc);
        this.generalComponentFormGroup.controls['GroupAccountNumber'].setValue(data['data'].GroupAccountNumber);
        this.generalComponentFormGroup.controls['GroupName'].setValue(this.virtualTableField.GroupName);
        this.generalComponentFormGroup.controls['PriceListInd'].setValue(this.isCheckBoxChecked(data['data'].PriceListInd));
        this.generalComponentFormGroup.controls['LogoTypeCode'].setValue(data['data'].LogoTypeCode);
        this.generalComponentFormGroup.controls['LogoTypeDesc'].setValue(data['data'].LogoTypeDesc);
        this.zone.run(function () {
            var logoTypeCode = _this.generalComponentFormGroup.controls['LogoTypeCode'].value;
            var logoTypeDesc = _this.generalComponentFormGroup.controls['LogoTypeDesc'].value;
            logoTypeDesc = logoTypeDesc ? logoTypeDesc : '';
            var text = (logoTypeCode && logoTypeDesc) ? (logoTypeCode + ' - ' + logoTypeDesc) : logoTypeCode;
            _this.selectedLogoType = { text: text };
        });
        this.generalComponentFormGroup.controls['ExternalReference'].setValue(data['data'].ExternalReference);
        this.generalComponentFormGroup.controls['AccountBalance'].setValue(data['data'].AccountBalance ? this.utilService.cCur(data['data'].AccountBalance) : data['data'].AccountBalance);
        this.generalComponentFormGroup.controls['BadDebtAccount'].setValue(this.isCheckBoxChecked(data['data'].BadDebtAccount));
        if (this.generalComponentFormGroup.controls['BadDebtAccount'].value === true) {
            this.fieldRequired.isBadDebtNarrativeRequired = true;
            this.generalComponentFormGroup.controls['BadDebtNarrative'].setValidators(Validators.required);
        }
        else {
            this.fieldRequired.isBadDebtNarrativeRequired = false;
            this.generalComponentFormGroup.controls['BadDebtNarrative'].setErrors(null);
            this.generalComponentFormGroup.controls['BadDebtNarrative'].clearValidators();
        }
        this.generalComponentFormGroup.controls['BadDebtNarrative'].setValue(data['data'].BadDebtNarrative);
        this.generalComponentFormGroup.controls['LiveAccount'].setValue(this.isCheckBoxChecked(data['data'].LiveAccount));
        this.generalComponentFormGroup.controls['IncludeMarketingCampaign'].setValue(this.isCheckBoxChecked(data['data'].IncludeMarketingCampaign));
        this.generalComponentFormGroup.updateValueAndValidity();
    };
    GeneralComponent.prototype.isCheckBoxChecked = function (arg) {
        if (arg == null)
            return false;
        if (typeof arg === 'boolean' || (typeof arg === 'object' && typeof arg.valueOf() === 'boolean'))
            return arg;
        return (arg) ? (((arg.toLowerCase() === 'false') || (arg.toLowerCase() === 'f') || (arg.toLowerCase() === 'no')) ? false : true) : false;
    };
    GeneralComponent.prototype.validateForm = function () {
        for (var j in this.fieldVisibility) {
            if (j) {
                var key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.generalComponentFormGroup.controls[key]) {
                        this.generalComponentFormGroup.controls[key].clearValidators();
                    }
                }
            }
        }
        for (var i in this.generalComponentFormGroup.controls) {
            if (this.generalComponentFormGroup.controls[i].enabled) {
                this.generalComponentFormGroup.controls[i].markAsTouched();
            }
            else {
                this.generalComponentFormGroup.controls[i].clearValidators();
            }
        }
        this.generalComponentFormGroup.updateValueAndValidity();
        var formValid = null;
        if (!this.generalComponentFormGroup.enabled) {
            formValid = true;
        }
        else {
            formValid = this.generalComponentFormGroup.valid;
        }
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                general: this.generalComponentFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                general: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                general: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_VALIDITY, payload: {
                general: formValid
            }
        });
    };
    GeneralComponent.prototype.processForm = function () {
        this.isLogoTypeDisabled = true;
        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            this.generalComponentFormGroup.controls['NationalAccount'].enable();
            this.generalComponentFormGroup.controls['DedicatedContactProcedureInd'].enable();
            this.generalComponentFormGroup.controls['InSightAccountInd'].enable();
            this.generalComponentFormGroup.controls['InterGroupAccount'].enable();
            this.generalComponentFormGroup.controls['VATExempt'].enable();
            this.generalComponentFormGroup.controls['ExcludePDADebtInd'].enable();
            this.generalComponentFormGroup.controls['AccountBusinessTypeCode'].enable();
            this.generalComponentFormGroup.controls['AccountBusinessTypeDesc'].disable();
            this.generalComponentFormGroup.controls['GroupAccountNumber'].enable();
            this.generalComponentFormGroup.controls['GroupName'].disable();
            this.generalComponentFormGroup.controls['PriceListInd'].enable();
            this.generalComponentFormGroup.controls['LogoTypeCode'].enable();
            this.generalComponentFormGroup.controls['LogoTypeDesc'].enable();
            this.generalComponentFormGroup.controls['ExternalReference'].enable();
            this.generalComponentFormGroup.controls['AccountBalance'].enable();
            this.generalComponentFormGroup.controls['BadDebtAccount'].enable();
            this.generalComponentFormGroup.controls['BadDebtNarrative'].enable();
            this.generalComponentFormGroup.controls['LiveAccount'].enable();
            this.generalComponentFormGroup.controls['IncludeMarketingCampaign'].enable();
            this.isGroupAccountNumberEllipsisDisabled = false;
            this.isLogoTypeDisabled = false;
        }
        if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
            this.generalComponentFormGroup.controls['NationalAccount'].disable();
            this.generalComponentFormGroup.controls['DedicatedContactProcedureInd'].disable();
            this.generalComponentFormGroup.controls['InSightAccountInd'].disable();
            this.generalComponentFormGroup.controls['InterGroupAccount'].disable();
            this.generalComponentFormGroup.controls['VATExempt'].disable();
            this.generalComponentFormGroup.controls['ExcludePDADebtInd'].disable();
            this.generalComponentFormGroup.controls['AccountBusinessTypeCode'].disable();
            this.generalComponentFormGroup.controls['AccountBusinessTypeDesc'].disable();
            this.generalComponentFormGroup.controls['GroupAccountNumber'].disable();
            this.generalComponentFormGroup.controls['GroupName'].disable();
            this.generalComponentFormGroup.controls['PriceListInd'].disable();
            this.generalComponentFormGroup.controls['LogoTypeCode'].disable();
            this.generalComponentFormGroup.controls['LogoTypeDesc'].disable();
            this.generalComponentFormGroup.controls['ExternalReference'].disable();
            this.generalComponentFormGroup.controls['AccountBalance'].disable();
            this.generalComponentFormGroup.controls['BadDebtAccount'].disable();
            this.generalComponentFormGroup.controls['BadDebtNarrative'].disable();
            this.generalComponentFormGroup.controls['LiveAccount'].disable();
            this.generalComponentFormGroup.controls['IncludeMarketingCampaign'].disable();
            this.isGroupAccountNumberEllipsisDisabled = true;
            this.isLogoTypeDisabled = true;
        }
        if (this.mode['addMode'] && !this.mode['updateMode'] && !this.mode['searchMode']) {
            this.generalComponentFormGroup.controls['NationalAccount'].enable();
            this.generalComponentFormGroup.controls['DedicatedContactProcedureInd'].enable();
            this.generalComponentFormGroup.controls['InSightAccountInd'].enable();
            this.generalComponentFormGroup.controls['InterGroupAccount'].enable();
            this.generalComponentFormGroup.controls['VATExempt'].enable();
            this.generalComponentFormGroup.controls['ExcludePDADebtInd'].enable();
            this.generalComponentFormGroup.controls['AccountBusinessTypeCode'].enable();
            this.generalComponentFormGroup.controls['AccountBusinessTypeDesc'].disable();
            this.generalComponentFormGroup.controls['GroupAccountNumber'].enable();
            this.generalComponentFormGroup.controls['GroupName'].disable();
            this.generalComponentFormGroup.controls['PriceListInd'].enable();
            this.generalComponentFormGroup.controls['LogoTypeCode'].enable();
            this.generalComponentFormGroup.controls['LogoTypeDesc'].enable();
            this.generalComponentFormGroup.controls['ExternalReference'].enable();
            this.generalComponentFormGroup.controls['AccountBalance'].enable();
            this.generalComponentFormGroup.controls['BadDebtAccount'].enable();
            this.generalComponentFormGroup.controls['BadDebtNarrative'].enable();
            this.generalComponentFormGroup.controls['LiveAccount'].enable();
            this.generalComponentFormGroup.controls['IncludeMarketingCampaign'].enable();
            this.generalComponentFormGroup.controls['NationalAccount'].setValue('');
            this.generalComponentFormGroup.controls['DedicatedContactProcedureInd'].setValue('');
            this.generalComponentFormGroup.controls['InSightAccountInd'].setValue('');
            this.generalComponentFormGroup.controls['InterGroupAccount'].setValue('');
            this.generalComponentFormGroup.controls['VATExempt'].setValue('');
            this.generalComponentFormGroup.controls['ExcludePDADebtInd'].setValue('');
            this.generalComponentFormGroup.controls['AccountBusinessTypeCode'].setValue('');
            this.generalComponentFormGroup.controls['AccountBusinessTypeDesc'].setValue('');
            this.generalComponentFormGroup.controls['GroupAccountNumber'].setValue('');
            this.generalComponentFormGroup.controls['GroupName'].setValue('');
            this.generalComponentFormGroup.controls['PriceListInd'].setValue('');
            this.generalComponentFormGroup.controls['LogoTypeCode'].setValue('');
            this.generalComponentFormGroup.controls['LogoTypeDesc'].setValue('');
            this.generalComponentFormGroup.controls['ExternalReference'].setValue('');
            this.generalComponentFormGroup.controls['AccountBalance'].setValue('');
            this.generalComponentFormGroup.controls['BadDebtAccount'].setValue('');
            this.generalComponentFormGroup.controls['BadDebtNarrative'].setValue('');
            this.generalComponentFormGroup.controls['LiveAccount'].setValue('');
            this.generalComponentFormGroup.controls['IncludeMarketingCampaign'].setValue('');
            this.isGroupAccountNumberEllipsisDisabled = false;
            this.isLogoTypeDisabled = false;
        }
        this.generalComponentFormGroup.updateValueAndValidity();
    };
    GeneralComponent.prototype.onZipDataReceived = function (data) {
        this.generalComponentFormGroup.controls['ContractPostcode'].setValue(data.Postcode);
    };
    GeneralComponent.prototype.onCountryCodeReceived = function (data) {
        this.generalComponentFormGroup.controls['CountryDesc'].setValue(data.riCountryCode);
    };
    GeneralComponent.prototype.fetchAccountData = function (functionName, params) {
        this.queryAccount = new URLSearchParams();
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        }
        else {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.defaultCode.country);
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
    GeneralComponent.prototype.onGroupAccountNumberDataReceived = function (data) {
        if (data.GroupName) {
            this.generalComponentFormGroup.controls['GroupName'].setValue(data.GroupName);
        }
        this.generalComponentFormGroup.controls['GroupAccountNumber'].setValue(data.GroupAccountNumber);
        this.generalComponentFormGroup.updateValueAndValidity();
    };
    GeneralComponent.prototype.onAccountBusinessTypeCodeDataReceived = function (data) {
        this.generalComponentFormGroup.controls['AccountBusinessTypeCode'].setValue(data.Type);
        this.generalComponentFormGroup.controls['AccountBusinessTypeDesc'].setValue(data.Description);
    };
    GeneralComponent.prototype.fetchBranchDetails = function () {
        var _this = this;
        var userCode = this.authService.getSavedUserCode();
        var data = [{
                'table': 'Branch',
                'query': { 'BusinessCode': this.storeData['code'].business ? this.storeData['code'].business : this.defaultCode.business },
                'fields': ['BranchNumber', 'BranchName']
            }];
        this.lookUpRecord(data, 100).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    var arr = [];
                    for (var k = 0; k < e['results'][0].length; k++) {
                        var obj = {
                            item: e['results'][0][k].BranchNumber,
                            desc: e['results'][0][k].BranchName
                        };
                        arr.push(JSON.parse(JSON.stringify(obj)));
                    }
                    _this.branchList = arr;
                }
            }
        }, function (error) {
        });
    };
    GeneralComponent.prototype.lookUpRecord = function (data, maxresults) {
        var queryLookUp = new URLSearchParams();
        queryLookUp.set(this.serviceConstants.Action, '0');
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            queryLookUp.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            queryLookUp.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        }
        else {
            queryLookUp.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            queryLookUp.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }
        if (maxresults) {
            queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(queryLookUp, data);
    };
    GeneralComponent.prototype.postAccountEntryData = function (functionName, params, postdata) {
        this.queryAccount = new URLSearchParams();
        this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
        this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        this.queryAccount.set(this.serviceConstants.Action, '0');
        if (this.storeData['data'] && this.storeData['data'].AccountNumber) {
            this.queryAccount.set('AccountNumber', this.storeData['data'].AccountNumber);
        }
        if (this.storeData['data'] && this.storeData['data'].AccountName) {
            this.queryAccount.set('AccountName', this.storeData['data'].AccountName);
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
    GeneralComponent.prototype.onNationalAccountClick = function () {
        this.generalComponentFormGroup.controls['ExcludePDADebtInd'].setValue(this.generalComponentFormGroup.controls['NationalAccount'].value);
        this.generalComponentFormGroup.updateValueAndValidity();
    };
    GeneralComponent.prototype.onBadDebtAccountClick = function () {
        if (this.generalComponentFormGroup.controls['BadDebtAccount'].value === true) {
            this.fieldRequired.isBadDebtNarrativeRequired = true;
            this.generalComponentFormGroup.controls['BadDebtNarrative'].setValidators(Validators.required);
            this.generalComponentFormGroup.controls['BadDebtNarrative'].updateValueAndValidity();
        }
        else {
            this.fieldRequired.isBadDebtNarrativeRequired = false;
            this.generalComponentFormGroup.controls['BadDebtNarrative'].clearValidators();
            this.generalComponentFormGroup.controls['BadDebtNarrative'].updateValueAndValidity();
        }
    };
    GeneralComponent.prototype.onLogoTypeSearchReceived = function (obj) {
        if (obj && obj.LogoTypeCode) {
            var desc = (obj.hasOwnProperty('LogoTypeDesc') ? obj.LogoTypeDesc : obj.Object.LogoTypeDesc);
            this.selectedLogoType = { text: obj.LogoTypeCode + ' - ' + desc };
            this.generalComponentFormGroup.controls['LogoTypeCode'].setValue(obj.LogoTypeCode);
            this.generalComponentFormGroup.controls['LogoTypeDesc'].setValue(desc);
            this.generalComponentFormGroup.updateValueAndValidity();
        }
    };
    GeneralComponent.prototype.onAccountBalanceFocus = function (event) {
        var val = this.generalComponentFormGroup.controls['AccountBalance'].value;
        if (val) {
            var data = val ? this.utilService.cCur(val) : val;
            data = (data.toString() === 'NaN') ? '' : data;
            this.generalComponentFormGroup.controls['AccountBalance'].setValue(data);
            this.generalComponentFormGroup.controls['AccountBalance'].updateValueAndValidity();
        }
    };
    GeneralComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-account-maintenance-general',
                    templateUrl: 'General.html'
                },] },
    ];
    GeneralComponent.ctorParameters = [
        { type: HttpService, },
        { type: ServiceConstants, },
        { type: ErrorService, },
        { type: MessageService, },
        { type: AuthService, },
        { type: AjaxObservableConstant, },
        { type: Router, },
        { type: PageDataService, },
        { type: Title, },
        { type: NgZone, },
        { type: Store, },
        { type: TranslateService, },
        { type: LocalStorageService, },
        { type: Http, },
        { type: LocaleTranslationService, },
        { type: FormBuilder, },
        { type: Logger, },
        { type: Utils, },
    ];
    return GeneralComponent;
}());
