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
import { Component, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
export var DiscountsComponent = (function () {
    function DiscountsComponent(httpService, serviceConstants, errorService, messageService, authService, ajaxconstant, router, pageData, titleService, zone, store, translate, ls, http, translateService, fb, logger, utilService) {
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
            'BadDebtAccount': false,
            'CustomerInfo': true,
            'MandateDate': true,
            'SEPADirectDebit': true,
            'SEPAMandateRef': true,
            'FinanceMandateRef': true,
            'CurrentInvoiceGroups': true,
            'menuControl': true,
            'PromptPayment1': true,
            'PromptPayment2': true,
            'Retrospective1': true,
            'Retrospective2': true,
            'InvoiceDiscount1': true,
            'InvoiceDiscount2': true,
            'DiscountTextKey': true
        };
        this.fieldRequired = {
            'isPromptPaymentIndRequired': false,
            'isPromptPaymentRateRequired': false,
            'isPromptPaymentNarrative': false,
            'isRetrospectiveIndRequired': false,
            'isRetrospectiveRateRequired': false,
            'isRetrospectiveNarrative': false,
            'isInvoiceDiscountIndRequired': false,
            'isInvoiceDiscountRateRequired': false,
            'isInvoiceDiscountNarrative': false,
            'isVATExemptRequired': false,
            'isLogoTypeCodeRequired': true,
            'isExcludePDADebtIndRequired': false,
            'isCallLogID': false,
            'isCrossReferenceAccountNumberRequired': false,
            'isValidationExemptIndRequired': false,
            'isNewInvoiceGroupIndRequired': false,
            'isGPSCoordinateXRequired': false,
            'isGPSCoordinateYRequired': false
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
        this.defaultCode = {
            country: '',
            business: '',
            BranchNumber: ''
        };
        this.updateMode = false;
        this.addMode = false;
        this.searchMode = false;
        this.method = 'contract-management/maintenance';
        this.module = 'account';
        this.operation = 'Application/iCABSAAccountMaintenance';
        this.contentType = 'application/x-www-form-urlencoded';
        this.discountsFormGroup = this.fb.group({
            PromptPaymentInd: [{ value: false, disabled: true }],
            PromptPaymentRate: [{ value: '', disabled: true }],
            PromptPaymentNarrative: [{ value: '', disabled: true }],
            RetrospectiveInd: [{ value: false, disabled: true }],
            RetrospectiveRate: [{ value: false, disabled: true }],
            RetrospectiveNarrative: [{ value: '', disabled: true }],
            InvoiceDiscountInd: [{ value: false, disabled: true }],
            InvoiceDiscountRate: [{ value: '', disabled: true }],
            InvoiceDiscountNarrative: [{ value: '', disabled: true }]
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
                        break;
                    case AccountMaintenanceActionTypes.FORM_INIT:
                        break;
                    case AccountMaintenanceActionTypes.SAVE_VIRTUAL_TABLE_DATA:
                        _this.virtualTableField = data['virtualTableData'];
                        break;
                    case AccountMaintenanceActionTypes.VALIDATE_FORMS:
                        if (typeof (data['validate'].discounts) !== 'undefined') {
                            _this.validateForm();
                        }
                        break;
                    case AccountMaintenanceActionTypes.LOAD_FORM_GROUP:
                        break;
                    case AccountMaintenanceActionTypes.BEFORE_MODE:
                        _this.beforeMode();
                        break;
                    default:
                        break;
                }
            }
        });
    }
    DiscountsComponent.prototype.ngOnInit = function () {
        var _this = this;
        String.prototype['capitalizeFirstLetter'] = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.defaultCode.country = this.utilService.getCountryCode();
        this.defaultCode.business = this.utilService.getBusinessCode();
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
        this.dispathFormGroup();
    };
    DiscountsComponent.prototype.ngOnDestroy = function () {
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
    };
    DiscountsComponent.prototype.initPage = function () {
        if (this.storeData && this.storeData['processedSysChar']) {
            this.sysCharParams = this.storeData['processedSysChar'];
        }
        else {
            return;
        }
        if (this.sysCharParams['vSCAccountDiscounts'] === true) {
            this.fieldRequired.isPromptPaymentIndRequired = false;
            this.discountsFormGroup.controls['PromptPaymentInd'].clearValidators();
            this.fieldRequired.isPromptPaymentRateRequired = false;
            this.discountsFormGroup.controls['PromptPaymentRate'].clearValidators();
            this.fieldRequired.isPromptPaymentNarrativeRequired = false;
            this.discountsFormGroup.controls['PromptPaymentNarrative'].clearValidators();
            this.fieldRequired.isRetrospectiveIndRequired = false;
            this.discountsFormGroup.controls['RetrospectiveInd'].clearValidators();
            this.fieldRequired.isRetrospectiveRateRequired = false;
            this.discountsFormGroup.controls['RetrospectiveRate'].clearValidators();
            this.fieldRequired.isRetrospectiveNarrativeRequired = false;
            this.discountsFormGroup.controls['RetrospectiveNarrative'].clearValidators();
            this.fieldRequired.isInvoiceDiscountIndRequired = false;
            this.discountsFormGroup.controls['InvoiceDiscountInd'].clearValidators();
            this.fieldRequired.isInvoiceDiscountRateRequired = false;
            this.discountsFormGroup.controls['InvoiceDiscountRate'].clearValidators();
            this.fieldRequired.isInvoiceDiscountNarrativeRequired = false;
            this.discountsFormGroup.controls['InvoiceDiscountNarrative'].clearValidators();
            this.loadFormControl();
            this.discountsFormGroup.updateValueAndValidity();
        }
    };
    DiscountsComponent.prototype.dispathFormGroup = function () {
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                discounts: this.discountsFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                discounts: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                discounts: this.fieldVisibility
            }
        });
    };
    DiscountsComponent.prototype.setFormData = function (data) {
        this.discountsFormGroup.controls['PromptPaymentInd'].setValue(this.isCheckBoxChecked(data['data'].PromptPaymentInd));
        this.discountsFormGroup.controls['PromptPaymentRate'].setValue(data['data'].PromptPaymentRate);
        this.discountsFormGroup.controls['PromptPaymentNarrative'].setValue(data['data'].PromptPaymentNarrative);
        this.discountsFormGroup.controls['RetrospectiveInd'].setValue(this.isCheckBoxChecked(data['data'].RetrospectiveInd));
        this.discountsFormGroup.controls['RetrospectiveRate'].setValue(data['data'].RetrospectiveRate);
        this.discountsFormGroup.controls['RetrospectiveNarrative'].setValue(data['data'].RetrospectiveNarrative);
        this.discountsFormGroup.controls['InvoiceDiscountInd'].setValue(this.isCheckBoxChecked(data['data'].InvoiceDiscountInd));
        this.discountsFormGroup.controls['InvoiceDiscountRate'].setValue(data['data'].InvoiceDiscountRate);
        this.discountsFormGroup.controls['InvoiceDiscountNarrative'].setValue(data['data'].InvoiceDiscountNarrative);
        this.discountsFormGroup.updateValueAndValidity();
        this.loadFormControl();
    };
    DiscountsComponent.prototype.loadFormControl = function () {
        if (this.discountsFormGroup.controls['PromptPaymentInd'].value === true) {
            this.fieldVisibility.PromptPayment1 = true;
            this.fieldVisibility.PromptPayment2 = true;
        }
        else {
            this.fieldVisibility.PromptPayment1 = false;
            this.fieldVisibility.PromptPayment2 = false;
        }
        if (this.discountsFormGroup.controls['RetrospectiveInd'].value === true) {
            this.fieldVisibility.Retrospective1 = true;
            this.fieldVisibility.Retrospective2 = true;
        }
        else {
            this.fieldVisibility.Retrospective1 = false;
            this.fieldVisibility.Retrospective2 = false;
        }
        if (this.discountsFormGroup.controls['InvoiceDiscountInd'].value === true) {
            this.fieldVisibility.InvoiceDiscount1 = true;
            this.fieldVisibility.InvoiceDiscount2 = true;
        }
        else {
            this.fieldVisibility.InvoiceDiscount1 = false;
            this.fieldVisibility.InvoiceDiscount2 = false;
        }
    };
    DiscountsComponent.prototype.validateForm = function () {
        for (var j in this.fieldVisibility) {
            if (j) {
                var key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.discountsFormGroup.controls[key]) {
                        this.discountsFormGroup.controls[key].clearValidators();
                    }
                }
            }
        }
        for (var i in this.discountsFormGroup.controls) {
            if (this.discountsFormGroup.controls[i].enabled) {
                this.discountsFormGroup.controls[i].markAsTouched();
            }
            else {
                this.discountsFormGroup.controls[i].clearValidators();
            }
        }
        this.discountsFormGroup.updateValueAndValidity();
        var formValid = null;
        if (!this.discountsFormGroup.enabled) {
            formValid = true;
        }
        else {
            formValid = this.discountsFormGroup.valid;
        }
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                discounts: this.discountsFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                discounts: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                discounts: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_VALIDITY, payload: {
                discounts: formValid
            }
        });
    };
    DiscountsComponent.prototype.processForm = function () {
        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            this.discountsFormGroup.controls['PromptPaymentInd'].enable();
            this.discountsFormGroup.controls['PromptPaymentRate'].enable();
            this.discountsFormGroup.controls['PromptPaymentNarrative'].enable();
            this.discountsFormGroup.controls['RetrospectiveInd'].enable();
            this.discountsFormGroup.controls['RetrospectiveRate'].enable();
            this.discountsFormGroup.controls['RetrospectiveNarrative'].enable();
            this.discountsFormGroup.controls['InvoiceDiscountInd'].enable();
            this.discountsFormGroup.controls['InvoiceDiscountRate'].enable();
            this.discountsFormGroup.controls['InvoiceDiscountNarrative'].enable();
        }
        if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
            this.discountsFormGroup.controls['PromptPaymentInd'].disable();
            this.discountsFormGroup.controls['PromptPaymentInd'].disable();
            this.discountsFormGroup.controls['PromptPaymentRate'].disable();
            this.discountsFormGroup.controls['PromptPaymentNarrative'].disable();
            this.discountsFormGroup.controls['RetrospectiveInd'].disable();
            this.discountsFormGroup.controls['RetrospectiveRate'].disable();
            this.discountsFormGroup.controls['RetrospectiveNarrative'].disable();
            this.discountsFormGroup.controls['InvoiceDiscountInd'].disable();
            this.discountsFormGroup.controls['InvoiceDiscountRate'].disable();
            this.discountsFormGroup.controls['InvoiceDiscountNarrative'].disable();
        }
        if (this.mode['addMode'] && !this.mode['searchMode'] && !this.mode['updateMode']) {
            this.discountsFormGroup.controls['PromptPaymentInd'].enable();
            this.discountsFormGroup.controls['PromptPaymentRate'].enable();
            this.discountsFormGroup.controls['PromptPaymentNarrative'].enable();
            this.discountsFormGroup.controls['RetrospectiveInd'].enable();
            this.discountsFormGroup.controls['RetrospectiveRate'].enable();
            this.discountsFormGroup.controls['RetrospectiveNarrative'].enable();
            this.discountsFormGroup.controls['InvoiceDiscountInd'].enable();
            this.discountsFormGroup.controls['InvoiceDiscountRate'].enable();
            this.discountsFormGroup.controls['InvoiceDiscountNarrative'].enable();
            this.discountsFormGroup.controls['PromptPaymentInd'].setValue(false);
            this.discountsFormGroup.controls['PromptPaymentRate'].setValue('');
            this.discountsFormGroup.controls['PromptPaymentNarrative'].setValue('');
            this.discountsFormGroup.controls['RetrospectiveInd'].setValue(false);
            this.discountsFormGroup.controls['RetrospectiveRate'].setValue('');
            this.discountsFormGroup.controls['RetrospectiveNarrative'].setValue('');
            this.discountsFormGroup.controls['InvoiceDiscountInd'].setValue(false);
            this.discountsFormGroup.controls['InvoiceDiscountRate'].setValue('');
            this.discountsFormGroup.controls['InvoiceDiscountNarrative'].setValue('');
        }
        this.discountsFormGroup.updateValueAndValidity();
        this.loadFormControl();
    };
    DiscountsComponent.prototype.isCheckBoxChecked = function (arg) {
        if (typeof arg === 'boolean' || (typeof arg === 'object' && typeof arg.valueOf() === 'boolean'))
            return arg;
        return (arg) ? (((arg.toLowerCase() === 'false') || (arg.toLowerCase() === 'f') || (arg.toLowerCase() === 'no')) ? false : true) : false;
    };
    DiscountsComponent.prototype.beforeMode = function () {
        this.sysCharParams = this.storeData['processedSysChar'];
        if (this.sysCharParams['vSCAccountDiscounts'] === true) {
            this.onPromptPaymentIndClick();
            this.onRetrospectiveIndClick();
            this.onInvoiceDiscountIndClick();
        }
        this.discountsFormGroup.updateValueAndValidity();
    };
    DiscountsComponent.prototype.onPromptPaymentIndClick = function () {
        if (this.recordSelected(false, true) || this.addMode) {
            if (this.discountsFormGroup.controls['PromptPaymentInd'].value === true) {
                this.getDefaultPromptPaymentDetails();
                this.fieldVisibility.PromptPayment1 = true;
                this.fieldVisibility.PromptPayment2 = true;
                this.discountsFormGroup.controls['PromptPaymentRate'].setValidators(Validators.required);
                this.discountsFormGroup.controls['PromptPaymentNarrative'].setValidators(Validators.required);
                this.discountsFormGroup.controls['PromptPaymentRate'].updateValueAndValidity();
                this.discountsFormGroup.controls['PromptPaymentNarrative'].updateValueAndValidity();
                this.fieldRequired.isPromptPaymentRateRequired = true;
                this.fieldRequired.isPromptPaymentNarrativeRequired = true;
            }
            else {
                this.fieldVisibility.PromptPayment1 = false;
                this.fieldVisibility.PromptPayment2 = false;
                this.discountsFormGroup.controls['PromptPaymentRate'].setErrors(null);
                this.discountsFormGroup.controls['PromptPaymentNarrative'].setErrors(null);
                this.discountsFormGroup.controls['PromptPaymentRate'].setValue('');
                this.discountsFormGroup.controls['PromptPaymentNarrative'].setValue('');
                this.discountsFormGroup.controls['PromptPaymentRate'].clearValidators();
                this.discountsFormGroup.controls['PromptPaymentNarrative'].clearValidators();
                this.discountsFormGroup.controls['PromptPaymentRate'].updateValueAndValidity();
                this.discountsFormGroup.controls['PromptPaymentNarrative'].updateValueAndValidity();
                this.fieldRequired.isPromptPaymentRateRequired = false;
                this.fieldRequired.isPromptPaymentNarrativeRequired = false;
            }
            this.discountsFormGroup.updateValueAndValidity();
        }
    };
    DiscountsComponent.prototype.onRetrospectiveIndClick = function () {
        if (this.recordSelected(false, true) || this.addMode) {
            if (this.discountsFormGroup.controls['RetrospectiveInd'].value === true) {
                this.getDefaultRetrospectiveDetails();
                this.fieldVisibility.Retrospective1 = true;
                this.fieldVisibility.Retrospective2 = true;
                this.discountsFormGroup.controls['RetrospectiveRate'].setValidators(Validators.required);
                this.discountsFormGroup.controls['RetrospectiveRate'].updateValueAndValidity();
                this.discountsFormGroup.controls['RetrospectiveNarrative'].setValidators(Validators.required);
                this.discountsFormGroup.controls['RetrospectiveNarrative'].updateValueAndValidity();
                this.fieldRequired.isRetrospectiveRateRequired = true;
                this.fieldRequired.isRetrospectiveNarrativeRequired = true;
            }
            else {
                this.fieldVisibility.Retrospective1 = false;
                this.fieldVisibility.Retrospective2 = false;
                this.discountsFormGroup.controls['RetrospectiveRate'].setErrors(null);
                this.discountsFormGroup.controls['RetrospectiveRate'].clearValidators();
                this.discountsFormGroup.controls['RetrospectiveNarrative'].setErrors(null);
                this.discountsFormGroup.controls['RetrospectiveNarrative'].clearValidators();
                this.discountsFormGroup.controls['RetrospectiveRate'].updateValueAndValidity();
                this.discountsFormGroup.controls['RetrospectiveNarrative'].updateValueAndValidity();
                this.fieldRequired.isRetrospectiveRateRequired = false;
                this.fieldRequired.isRetrospectiveNarrativeRequired = false;
            }
            this.discountsFormGroup.updateValueAndValidity();
        }
    };
    DiscountsComponent.prototype.onInvoiceDiscountIndClick = function () {
        if (this.recordSelected(false, true) || this.addMode) {
            if (this.discountsFormGroup.controls['InvoiceDiscountInd'].value === true) {
                this.getDefaultInvoiceDiscountDetails();
                this.fieldVisibility.InvoiceDiscount1 = true;
                this.fieldVisibility.InvoiceDiscount2 = true;
                this.discountsFormGroup.controls['InvoiceDiscountRate'].setValidators(Validators.required);
                this.discountsFormGroup.controls['InvoiceDiscountRate'].updateValueAndValidity();
                this.discountsFormGroup.controls['InvoiceDiscountNarrative'].setValidators(Validators.required);
                this.discountsFormGroup.controls['InvoiceDiscountNarrative'].updateValueAndValidity();
                this.fieldRequired.isInvoiceDiscountRateRequired = true;
                this.fieldRequired.isInvoiceDiscountNarrativeRequired = true;
            }
            else {
                this.fieldVisibility.InvoiceDiscount1 = false;
                this.fieldVisibility.InvoiceDiscount2 = false;
                this.discountsFormGroup.controls['InvoiceDiscountRate'].setErrors(null);
                this.discountsFormGroup.controls['InvoiceDiscountNarrative'].setErrors(null);
                this.discountsFormGroup.controls['InvoiceDiscountRate'].clearValidators();
                this.discountsFormGroup.controls['InvoiceDiscountNarrative'].clearValidators();
                this.discountsFormGroup.controls['InvoiceDiscountRate'].updateValueAndValidity();
                this.discountsFormGroup.controls['InvoiceDiscountNarrative'].updateValueAndValidity();
                this.fieldRequired.isInvoiceDiscountRateRequired = false;
                this.fieldRequired.isInvoiceDiscountNarrativeRequired = false;
            }
            this.discountsFormGroup.updateValueAndValidity();
        }
    };
    DiscountsComponent.prototype.getDefaultRetrospectiveDetails = function () {
        this.getDefaultDiscountDetails('RD', this.discountsFormGroup.controls['RetrospectiveRate'], this.discountsFormGroup.controls['RetrospectiveNarrative']);
    };
    DiscountsComponent.prototype.getDefaultPromptPaymentDetails = function () {
        this.getDefaultDiscountDetails('PP', this.discountsFormGroup.controls['PromptPaymentRate'], this.discountsFormGroup.controls['PromptPaymentNarrative']);
    };
    DiscountsComponent.prototype.getDefaultInvoiceDiscountDetails = function () {
        this.getDefaultDiscountDetails('IN', this.discountsFormGroup.controls['InvoiceDiscountRate'], this.discountsFormGroup.controls['InvoiceDiscountNarrative']);
    };
    DiscountsComponent.prototype.getDefaultDiscountDetails = function (cDiscountType, ctrRate, ctrNarr) {
        var _this = this;
        var oRate = (ctrRate.value) ? ctrRate.value.trim() : ctrRate.value;
        var oNarr = (ctrNarr.value) ? ctrNarr.value.trim() : ctrNarr.value;
        if ((this.recordSelected(false, true) && this.updateMode) || this.addMode) {
            if (!oRate || !oNarr) {
                this.queryAccount = new URLSearchParams();
                if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
                    this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
                    this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
                }
                else {
                    this.queryAccount.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
                    this.queryAccount.set(this.serviceConstants.CountryCode, this.defaultCode.country);
                }
                this.queryAccount.set(this.serviceConstants.Action, '6');
                var postObj = {
                    'Function': 'GetDefaultDiscountDetails',
                    'DiscountTypeCode': cDiscountType
                };
                this.ajaxSource.next(this.ajaxconstant.START);
                this.httpService.makePostRequest(this.method, this.module, this.operation, this.queryAccount, postObj).subscribe(function (e) {
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    if (e.status === 'failure') {
                        _this.errorService.emitError(e.oResponse);
                    }
                    else {
                        if (e) {
                            if (!oRate) {
                                ctrRate.setValue(e.DiscountRate);
                            }
                            if (!oNarr) {
                                ctrNarr.setValue(e.DiscountNarr);
                            }
                        }
                    }
                }, function (error) {
                    _this.errorService.emitError(error);
                });
            }
        }
    };
    DiscountsComponent.prototype.recordSelected = function (arg1, arg2) {
        if (arg2 === void 0) { arg2 = false; }
        if (this.storeData && this.storeData['data']) {
            return true;
        }
        return false;
    };
    DiscountsComponent.prototype.onFocus = function (controlName) {
        switch (controlName) {
            case 'PromptPaymentRate':
            case 'RetrospectiveRate':
            case 'InvoiceDiscountRate':
                if (controlName && this.discountsFormGroup.controls.hasOwnProperty(controlName)) {
                    var val = this.discountsFormGroup.controls[controlName].value;
                    if (val) {
                        var data = val ? this.utilService.cCur(val) : val;
                        data = (data.toString() === 'NaN') ? '' : data;
                        this.discountsFormGroup.controls[controlName].setValue(data);
                        this.discountsFormGroup.controls[controlName].updateValueAndValidity();
                    }
                }
                break;
        }
    };
    DiscountsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-account-maintenance-general',
                    templateUrl: 'Discounts.html'
                },] },
    ];
    DiscountsComponent.ctorParameters = [
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
    return DiscountsComponent;
}());
