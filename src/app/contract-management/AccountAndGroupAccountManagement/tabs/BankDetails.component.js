import { Utils } from './../../../../shared/services/utility';
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
import { Component, NgZone, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { PostCodeSearchComponent } from '../../../../app/internal/search/iCABSBPostcodeSearch.component';
import { MessageConstant } from './../../../../shared/constants/message.constant';
export var BankDetailsComponent = (function () {
    function BankDetailsComponent(httpService, serviceConstants, errorService, messageService, authService, ajaxconstant, router, pageData, titleService, zone, store, translate, ls, http, translateService, fb, logger, utilService) {
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
        this.ajaxSource = new BehaviorSubject(0);
        this.isRequesting = false;
        this.internalFieldStatus = {
            'fieldDisabled': null,
            'fieldVisibility': null,
            'fieldRequired': null,
            'sysCharParams': null,
            'virtualTableField': null,
            'otherParams': null
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
            'SEPAMandateRef': true,
            'FinanceMandateRef': true,
            'MandateDate': true,
            'CurrentInvoiceGroups': true,
            'SEPADirectDebit': true
        };
        this.fieldRequired = {
            'isBankAccountSortCodeRequired': false,
            'isBankAccountNumberRequired': false,
            'isVirtualBankAccountNumberRequired': false,
            'isBankAccountTypeCodeRequired': false,
            'isBankAccountInfoRequired': false,
            'isMandateNumberSEPARequired': false,
            'isMandateNumberFinanceRequired': false,
            'isMandateDateRequired': false,
            'isMandateTypeCodeRequired': false
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
        this.iBANFlag = false;
        this.zipSearchComponent = PostCodeSearchComponent;
        this.bankAccountTypeCode = PostCodeSearchComponent;
        this.isbankAccountTypeCodeEllipsisDisabled = true;
        this.idMandateDateDisabled = true;
        this.isMandateDateRequired = false;
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
        this.countrySelected = {
            id: '',
            text: ''
        };
        this.updateMode = false;
        this.addMode = false;
        this.searchMode = false;
        this.ttMandateType = [];
        this.translatedMessageList = {
            message_1: '',
            message_2: ''
        };
        this.showMessageHeader = true;
        this.promptTitle = '';
        this.promptContent = '';
        this.method = 'contract-management/maintenance';
        this.module = 'account';
        this.operation = 'Application/iCABSAAccountMaintenance';
        this.contentType = 'application/x-www-form-urlencoded';
        this.bankDetailsFormGroup = this.fb.group({
            BankAccountTypeCode: [{ value: '', disabled: true }],
            BankAccountTypeDesc: [{ value: '', disabled: true }],
            BankAccountSortCode: [{ value: '', disabled: true }],
            BankAccountNumber: [{ value: '', disabled: true }],
            VirtualBankAccountNumber: [{ value: '', disabled: true }],
            BankAccountInfo: [{ value: '', disabled: true }],
            MandateNumberSEPA: [{ value: '', disabled: true }],
            cmdGenerateNew: [{ value: 'Generate New', disabled: false }],
            MandateNumberFinance: [{ value: '', disabled: true }],
            MandateDate: [{ value: '', disabled: true }],
            selMandateTypeCode: [{ value: '', disabled: false }]
        });
        this.storeSubscription = store.select('accountMaintenance').subscribe(function (data) {
            if (data && data['action']) {
                _this.storeData = data;
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
                        _this.sysCharParams = data['syschars'];
                        break;
                    case AccountMaintenanceActionTypes.SAVE_PROCESSED_SYSCHAR:
                        _this.sysCharParams = data['processedSysChar'];
                        if (_this.sysCharParams && _this.sysCharParams['ttMandateType']) {
                            _this.ttMandateType = _this.sysCharParams['ttMandateType'];
                        }
                        if (_this.sysCharParams['vBankAccountFormatCode'] === 'iBAN') {
                            _this.iBANFlag = true;
                        }
                        else {
                            _this.iBANFlag = false;
                        }
                        break;
                    case AccountMaintenanceActionTypes.FORM_INIT:
                        break;
                    case AccountMaintenanceActionTypes.SAVE_VIRTUAL_TABLE_DATA:
                        if (data['virtualTableData']) {
                            _this.virtualTableField = data['virtualTableData'];
                        }
                        _this.bankDetailsFormGroup.controls['BankAccountTypeDesc'].setValue(_this.virtualTableField.BankAccountTypeDesc);
                        break;
                    case AccountMaintenanceActionTypes.VALIDATE_FORMS:
                        if (typeof (data['validate'].bankDetails) !== 'undefined') {
                            _this.validateForm();
                        }
                        break;
                    case AccountMaintenanceActionTypes.BEFORE_MODE:
                        _this.sysCharParams = data['processedSysChar'];
                        break;
                    case AccountMaintenanceActionTypes.TAB_CHANGE:
                        _this.sysCharParams = data['processedSysChar'];
                        if (_this.sysCharParams && _this.sysCharParams['ttMandateType']) {
                            _this.ttMandateType = _this.sysCharParams['ttMandateType'];
                        }
                        if (_this.sysCharParams['vBankAccountFormatCode'] === 'iBAN') {
                            _this.iBANFlag = true;
                        }
                        else {
                            _this.iBANFlag = false;
                        }
                        break;
                    case AccountMaintenanceActionTypes.BEFORE_ADD:
                        _this.sysCharParams = data['processedSysChar'];
                        if (_this.sysCharParams['vSCEnableSEPAFinanceMandate'] || _this.sysCharParams['vSCEnableSEPAFinanceMandateLog']) {
                            _this.fieldDisabled.selMandateTypeCode = false;
                            _this.bankDetailsFormGroup.controls['selMandateTypeCode'].enable();
                            _this.bankDetailsFormGroup.controls['selMandateTypeCode'].setValue(_this.sysCharParams['vDefaultMandateType']);
                            _this.bankDetailsFormGroup.controls['selMandateTypeCode'].updateValueAndValidity();
                        }
                        break;
                    case AccountMaintenanceActionTypes.LOAD_FORM_GROUP:
                        break;
                    default:
                        break;
                }
            }
        });
    }
    BankDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        String.prototype['capitalizeFirstLetter'] = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        this.translateSubscription = this.translateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
            }
        });
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.dispathFormGroup();
    };
    BankDetailsComponent.prototype.dispathFormGroup = function () {
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                bankDetails: this.bankDetailsFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                bankDetails: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                bankDetails: this.fieldVisibility
            }
        });
    };
    BankDetailsComponent.prototype.setFormData = function (data) {
        this.bankDetailsFormGroup.controls['BankAccountTypeCode'].setValue(data['data'].BankAccountTypeCode);
        this.bankDetailsFormGroup.controls['BankAccountTypeDesc'].setValue(this.virtualTableField.BankAccountTypeDesc);
        this.bankDetailsFormGroup.controls['BankAccountTypeCode'].setValue(data['data'].BankAccountTypeCode);
        this.bankDetailsFormGroup.controls['BankAccountSortCode'].setValue(data['data'].BankAccountSortCode);
        this.bankDetailsFormGroup.controls['BankAccountNumber'].setValue(data['data'].BankAccountNumber);
        this.bankDetailsFormGroup.controls['VirtualBankAccountNumber'].setValue(data['data'].VirtualBankAccountNumber);
        this.bankDetailsFormGroup.controls['BankAccountInfo'].setValue(data['data'].BankAccountInfo);
        this.bankDetailsFormGroup.controls['MandateNumberSEPA'].setValue(data['data'].MandateNumberSEPA);
        this.bankDetailsFormGroup.controls['MandateNumberFinance'].setValue(data['data'].MandateNumberFinance);
        var dt = data['data'].MandateDate ? this.utilService.convertDate(data['data'].MandateDate) : '';
        this.dtMandateDate = data['data'].MandateDate ? dt : null;
        this.bankDetailsFormGroup.controls['MandateDate'].setValue(data['data'].MandateDate ? data['data'].MandateDate : '');
        this.bankDetailsFormGroup.controls['selMandateTypeCode'].setValue(data['data'].selMandateTypeCode);
        this.bankDetailsFormGroup.updateValueAndValidity();
    };
    BankDetailsComponent.prototype.validateForm = function () {
        for (var j in this.fieldVisibility) {
            if (j) {
                var key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.bankDetailsFormGroup.controls[key]) {
                        this.bankDetailsFormGroup.controls[key].clearValidators();
                    }
                }
            }
        }
        for (var i in this.bankDetailsFormGroup.controls) {
            if (this.bankDetailsFormGroup.controls.hasOwnProperty(i)) {
                if (this.bankDetailsFormGroup.controls[i].enabled) {
                    this.bankDetailsFormGroup.controls[i].markAsTouched();
                }
                else {
                    this.bankDetailsFormGroup.controls[i].clearValidators();
                }
            }
        }
        this.bankDetailsFormGroup.updateValueAndValidity();
        var formValid = null;
        if (!this.bankDetailsFormGroup.enabled) {
            formValid = true;
        }
        else {
            formValid = this.bankDetailsFormGroup.valid;
        }
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                bankDetails: this.bankDetailsFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                bankDetails: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                bankDetails: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_VALIDITY, payload: {
                bankDetails: formValid
            }
        });
    };
    BankDetailsComponent.prototype.processForm = function () {
        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            this.bankDetailsFormGroup.controls['BankAccountTypeCode'].enable();
            this.bankDetailsFormGroup.controls['BankAccountTypeDesc'].disable();
            this.bankDetailsFormGroup.controls['BankAccountSortCode'].enable();
            this.bankDetailsFormGroup.controls['BankAccountNumber'].enable();
            this.bankDetailsFormGroup.controls['VirtualBankAccountNumber'].enable();
            this.bankDetailsFormGroup.controls['BankAccountInfo'].enable();
            this.bankDetailsFormGroup.controls['MandateNumberSEPA'].enable();
            this.bankDetailsFormGroup.controls['MandateNumberFinance'].enable();
            this.bankDetailsFormGroup.controls['MandateDate'].enable();
            this.idMandateDateDisabled = false;
            this.bankDetailsFormGroup.controls['selMandateTypeCode'].enable();
        }
        if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
            this.bankDetailsFormGroup.controls['BankAccountTypeCode'].disable();
            this.bankDetailsFormGroup.controls['BankAccountTypeDesc'].disable();
            this.bankDetailsFormGroup.controls['BankAccountSortCode'].disable();
            this.bankDetailsFormGroup.controls['BankAccountNumber'].disable();
            this.bankDetailsFormGroup.controls['VirtualBankAccountNumber'].disable();
            this.bankDetailsFormGroup.controls['BankAccountInfo'].disable();
            this.bankDetailsFormGroup.controls['MandateNumberSEPA'].disable();
            this.bankDetailsFormGroup.controls['MandateNumberFinance'].disable();
            this.bankDetailsFormGroup.controls['MandateDate'].disable();
            this.idMandateDateDisabled = true;
            this.bankDetailsFormGroup.controls['selMandateTypeCode'].disable();
        }
        if (this.mode['addMode'] && !this.mode['updateMode'] && !this.mode['searchMode']) {
            this.bankDetailsFormGroup.controls['BankAccountTypeCode'].enable();
            this.bankDetailsFormGroup.controls['BankAccountTypeDesc'].disable();
            this.bankDetailsFormGroup.controls['BankAccountSortCode'].enable();
            this.bankDetailsFormGroup.controls['BankAccountNumber'].enable();
            this.bankDetailsFormGroup.controls['VirtualBankAccountNumber'].enable();
            this.bankDetailsFormGroup.controls['BankAccountInfo'].enable();
            this.bankDetailsFormGroup.controls['MandateNumberSEPA'].enable();
            this.bankDetailsFormGroup.controls['MandateNumberFinance'].enable();
            this.bankDetailsFormGroup.controls['MandateDate'].enable();
            this.idMandateDateDisabled = false;
            this.bankDetailsFormGroup.controls['selMandateTypeCode'].enable();
            this.bankDetailsFormGroup.controls['BankAccountTypeCode'].setValue('');
            this.bankDetailsFormGroup.controls['BankAccountTypeDesc'].setValue('');
            this.bankDetailsFormGroup.controls['BankAccountTypeCode'].setValue('');
            this.bankDetailsFormGroup.controls['BankAccountTypeDesc'].setValue('');
            this.bankDetailsFormGroup.controls['BankAccountSortCode'].setValue('');
            this.bankDetailsFormGroup.controls['BankAccountNumber'].setValue('');
            this.bankDetailsFormGroup.controls['VirtualBankAccountNumber'].setValue('');
            this.bankDetailsFormGroup.controls['BankAccountInfo'].setValue('');
            this.bankDetailsFormGroup.controls['MandateNumberSEPA'].setValue('');
            this.bankDetailsFormGroup.controls['MandateNumberFinance'].setValue('');
            this.bankDetailsFormGroup.controls['MandateDate'].setValue('');
            this.bankDetailsFormGroup.controls['selMandateTypeCode'].setValue('');
        }
        this.bankDetailsFormGroup.updateValueAndValidity();
    };
    BankDetailsComponent.prototype.onZipDataReceived = function (data) {
        this.bankDetailsFormGroup.controls['ContractPostcode'].setValue(data.Postcode);
    };
    BankDetailsComponent.prototype.onCountryCodeReceived = function (data) {
        this.bankDetailsFormGroup.controls['CountryDesc'].setValue(data.riCountryCode);
    };
    BankDetailsComponent.prototype.onBankAccountTypeCodeDataReceived = function (data) {
        this.bankDetailsFormGroup.controls['BankAccountTypeCode'].setValue(data.BankAccountTypeCode);
        this.bankDetailsFormGroup.controls['BankAccountTypeDesc'].setValue(data.BankAccountTypeDesc);
    };
    BankDetailsComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.translatedMessageList.message_1 = MessageConstant.PageSpecificMessage.This_will_update_the_existing_SEPA_Mandate_Reference;
        this.translatedMessageList.message_2 = MessageConstant.PageSpecificMessage.Confirm_Generate_New;
        this.getTranslatedValue(MessageConstant.PageSpecificMessage.This_will_update_the_existing_SEPA_Mandate_Reference, null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.translatedMessageList.message_1 = res;
                }
            });
        });
        this.getTranslatedValue(MessageConstant.PageSpecificMessage.Confirm_Generate_New, null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.translatedMessageList.message_2 = res;
                }
            });
        });
    };
    BankDetailsComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    BankDetailsComponent.prototype.onCmdGenerateNewClick = function () {
        var val = this.bankDetailsFormGroup.controls['MandateNumberSEPA'].value;
        if (val !== '' || val !== 'undefined') {
            var confirmText = this.translatedMessageList.message_1 + ' ' + this.translatedMessageList.message_2;
            this.promptModal.Title = confirmText;
            this.promptModal.show();
        }
        else {
            this.generateNewRef();
        }
    };
    BankDetailsComponent.prototype.promptSave = function (event) {
        this.generateNewRef();
    };
    BankDetailsComponent.prototype.generateNewRef = function () {
        var _this = this;
        this.queryAccount = new URLSearchParams();
        this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
        this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        this.queryAccount.set(this.serviceConstants.Action, '6');
        var postData = {
            'Function': 'GenerateNewRef',
            'AccountNumber': this.storeData['formGroup'].main.controls['AccountNumber'].value ? this.storeData['formGroup'].main.controls['AccountNumber'].value : '',
            'AccountName': this.storeData['formGroup'].main.controls['AccountName'].value ? this.storeData['formGroup'].main.controls['AccountName'].value.trim() : ''
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.queryAccount, postData).subscribe(function (e) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else if (e['errorMessage']) {
                _this.errorService.emitError(e['errorMessage']);
            }
            else {
                if (e['NewMandateNumberSEPA']) {
                    _this.bankDetailsFormGroup.controls['MandateNumberSEPA'].setValue(e['NewMandateNumberSEPA']);
                }
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    BankDetailsComponent.prototype.riMaintenanceBeforeSelect = function () {
        if (!this.sysCharParams['vSCMultiContactInd'] === true) {
            if (this.sysCharParams['vSCEnableSEPAFinanceMandate'] === true || this.sysCharParams['vSCEnableSEPAFinanceMandateLog'] === true) {
                this.bankDetailsFormGroup.controls['selMandateTypeCode'].disable();
            }
        }
    };
    BankDetailsComponent.prototype.onAccountMaintenanceDataReceived = function () {
    };
    BankDetailsComponent.prototype.modalHidden = function () {
    };
    BankDetailsComponent.prototype.onMandateDateSelectedValue = function (value) {
        if (value && value['value']) {
            this.bankDetailsFormGroup.controls['MandateDate'].setValue(value['value']);
        }
        else {
            this.bankDetailsFormGroup.controls['MandateDate'].setValue('');
        }
    };
    BankDetailsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-account-maintenance-bankdetails',
                    templateUrl: 'BankDetails.html',
                    providers: [ErrorService, MessageService]
                },] },
    ];
    BankDetailsComponent.ctorParameters = [
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
    BankDetailsComponent.propDecorators = {
        'promptModal': [{ type: ViewChild, args: ['promptModalBankDetail',] },],
    };
    return BankDetailsComponent;
}());
