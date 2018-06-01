import { LocaleTranslationService } from './../../../../shared/services/translation.service';
import { Http } from '@angular/http';
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
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AccountSearchComponent } from '../../../../app/internal/search/iCABSASAccountSearch';
import { PostCodeSearchComponent } from '../../../../app/internal/search/iCABSBPostcodeSearch.component';
export var TelesalesComponent = (function () {
    function TelesalesComponent(httpService, serviceConstants, errorService, messageService, authService, ajaxconstant, router, pageData, titleService, zone, store, translate, ls, http, translateService, fb, logger) {
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
        this.inputParams = {
            'parentMode': 'LookUp-CrossReference',
            'ContractTypeCode': '',
            'businessCode': '',
            'showAddNewDisplay': false,
            'groupAccountNumber': '',
            'groupName': '',
            'disableCountry': true,
            'businessCodeListDisabled': true
        };
        this.accountSearchComponent = AccountSearchComponent;
        this.isContractEllipsisDisabled = true;
        this.fieldDisabled = {
            'BtnSendToNAV': false,
            'cmdGetAddress': false,
            'cmdSetInvoiceGroupDefault': false,
            'cmdSetInvoiceGroupEDI': false,
            'selMandateTypeCode': false,
            'cmdGenerateNew': false
        };
        this.fieldVisibility = {
            'ValidationExemptInd': true,
            'NewInvoiceGroupInd': true
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
            'isAccountOwningBranchRequired': true,
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
        this.countrySelected = {
            id: '',
            text: ''
        };
        this.updateMode = false;
        this.addMode = false;
        this.searchMode = false;
        this.autoOpenSearch = false;
        this.method = 'contract-management/maintenance';
        this.module = 'account';
        this.operation = 'Application/iCABSAAccountMaintenance';
        this.contentType = 'application/x-www-form-urlencoded';
        this.telesalesFormGroup = this.fb.group({
            CrossReferenceAccountNumber: [{ value: '', disabled: true }],
            CrossReferenceAccountName: [{ value: '', disabled: true }],
            ValidationExemptInd: [{ value: '', disabled: true }],
            NewInvoiceGroupInd: [{ value: '', disabled: true }]
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
                        _this.initPage();
                        break;
                    case AccountMaintenanceActionTypes.FORM_INIT:
                        break;
                    case AccountMaintenanceActionTypes.SAVE_VIRTUAL_TABLE_DATA:
                        _this.virtualTableField = data['virtualTableData'];
                        _this.telesalesFormGroup.controls['CrossReferenceAccountName'].setValue(_this.virtualTableField.CrossReferenceAccountName);
                        _this.telesalesFormGroup.updateValueAndValidity();
                        break;
                    case AccountMaintenanceActionTypes.VALIDATE_FORMS:
                        if (typeof (data['validate'].teleSales) !== 'undefined') {
                            _this.validateForm();
                        }
                        break;
                    case AccountMaintenanceActionTypes.LOAD_FORM_GROUP:
                        break;
                    case AccountMaintenanceActionTypes.TAB_CHANGE:
                        if (_this.storeData && _this.storeData['formGroup'] && _this.storeData['formGroup'].general && _this.storeData['formGroup'].general !== false) {
                            if (_this.storeData['formGroup']['general'].controls.hasOwnProperty('GroupAccountNumber')) {
                                _this.inputParams.groupAccountNumber = _this.storeData['formGroup'].general.controls['GroupAccountNumber'].value;
                            }
                            if (_this.storeData['formGroup']['general'].controls.hasOwnProperty('GroupName')) {
                                _this.inputParams.groupName = _this.storeData['formGroup'].general.controls['GroupName'].value;
                            }
                        }
                        if (_this.crossReferenceAccountNumberEllipsis && typeof _this.crossReferenceAccountNumberEllipsis !== 'undefined') {
                            _this.crossReferenceAccountNumberEllipsis.configParams = _this.inputParams;
                            _this.crossReferenceAccountNumberEllipsis.updateComponent();
                        }
                        break;
                    default:
                        break;
                }
            }
        });
    }
    TelesalesComponent.prototype.ngOnInit = function () {
        String.prototype['capitalizeFirstLetter'] = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        this.dispathFormGroup();
    };
    TelesalesComponent.prototype.initPage = function () {
        if (this.storeData && this.storeData['formGroup'] && this.storeData['formGroup'].general && this.storeData['formGroup'].general !== false) {
            if (this.storeData['formGroup']['general'].controls.hasOwnProperty('GroupAccountNumber')) {
                this.inputParams.groupAccountNumber = this.storeData['formGroup'].general.controls['GroupAccountNumber'].value;
            }
            if (this.storeData['formGroup']['general'].controls.hasOwnProperty('GroupName')) {
                this.inputParams.groupName = this.storeData['formGroup'].general.controls['GroupName'].value;
            }
        }
    };
    TelesalesComponent.prototype.dispathFormGroup = function () {
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                teleSales: this.telesalesFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                teleSales: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                teleSales: this.fieldVisibility
            }
        });
    };
    TelesalesComponent.prototype.setFormData = function (data) {
        this.telesalesFormGroup.controls['CrossReferenceAccountNumber'].setValue(data['data'].CrossReferenceAccountNumber);
        this.telesalesFormGroup.controls['CrossReferenceAccountName'].setValue(data['data'].CrossReferenceAccountName);
        this.telesalesFormGroup.controls['ValidationExemptInd'].setValue(this.isCheckBoxChecked(data['data'].ValidationExemptInd));
        this.telesalesFormGroup.controls['NewInvoiceGroupInd'].setValue(this.isCheckBoxChecked(data['data'].NewInvoiceGroupInd));
        this.telesalesFormGroup.updateValueAndValidity();
    };
    TelesalesComponent.prototype.validateForm = function () {
        for (var j in this.fieldVisibility) {
            if (j) {
                var key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.telesalesFormGroup.controls[key]) {
                        this.telesalesFormGroup.controls[key].clearValidators();
                    }
                }
            }
        }
        for (var i in this.telesalesFormGroup.controls) {
            if (this.telesalesFormGroup.controls[i].enabled) {
                this.telesalesFormGroup.controls[i].markAsTouched();
            }
            else {
                this.telesalesFormGroup.controls[i].clearValidators();
            }
        }
        this.telesalesFormGroup.updateValueAndValidity();
        var formValid = null;
        if (!this.telesalesFormGroup.enabled) {
            formValid = true;
        }
        else {
            formValid = this.telesalesFormGroup.valid;
        }
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                teleSales: this.telesalesFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                teleSales: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                teleSales: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_VALIDITY, payload: {
                teleSales: formValid
            }
        });
    };
    TelesalesComponent.prototype.isCheckBoxChecked = function (arg) {
        if (typeof arg === 'boolean' || (typeof arg === 'object' && typeof arg.valueOf() === 'boolean'))
            return arg;
        return (arg) ? (((arg.toLowerCase() === 'false') || (arg.toLowerCase() === 'f') || (arg.toLowerCase() === 'no')) ? false : true) : false;
    };
    TelesalesComponent.prototype.processForm = function () {
        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            this.telesalesFormGroup.controls['CrossReferenceAccountNumber'].enable();
            this.telesalesFormGroup.controls['CrossReferenceAccountName'].disable();
            this.telesalesFormGroup.controls['ValidationExemptInd'].enable();
            this.telesalesFormGroup.controls['NewInvoiceGroupInd'].enable();
            this.isContractEllipsisDisabled = false;
        }
        if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
            this.telesalesFormGroup.controls['CrossReferenceAccountNumber'].disable();
            this.telesalesFormGroup.controls['CrossReferenceAccountName'].disable();
            this.telesalesFormGroup.controls['ValidationExemptInd'].disable();
            this.telesalesFormGroup.controls['NewInvoiceGroupInd'].disable();
            this.isContractEllipsisDisabled = true;
        }
        if (this.mode['addMode'] && !this.mode['searchMode'] && !this.mode['updateMode']) {
            this.telesalesFormGroup.controls['CrossReferenceAccountNumber'].enable();
            this.telesalesFormGroup.controls['CrossReferenceAccountName'].disable();
            this.telesalesFormGroup.controls['ValidationExemptInd'].enable();
            this.telesalesFormGroup.controls['NewInvoiceGroupInd'].enable();
            this.telesalesFormGroup.controls['CrossReferenceAccountNumber'].setValue('');
            this.telesalesFormGroup.controls['CrossReferenceAccountName'].setValue('');
            this.telesalesFormGroup.controls['ValidationExemptInd'].setValue('');
            this.telesalesFormGroup.controls['NewInvoiceGroupInd'].setValue('');
            this.isContractEllipsisDisabled = false;
        }
        this.telesalesFormGroup.updateValueAndValidity();
    };
    TelesalesComponent.prototype.onAccountMaintenanceDataReceived = function (data, route) {
        if (data) {
            this.telesalesFormGroup.controls['CrossReferenceAccountNumber'].setValue(data.AccountNumber);
            this.telesalesFormGroup.controls['CrossReferenceAccountName'].setValue(data.AccountName);
            this.telesalesFormGroup.updateValueAndValidity();
        }
    };
    TelesalesComponent.prototype.modalHidden = function () {
    };
    TelesalesComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-account-maintenance-telesales',
                    templateUrl: 'Telesales.html'
                },] },
    ];
    TelesalesComponent.ctorParameters = [
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
    ];
    TelesalesComponent.propDecorators = {
        'crossReferenceAccountNumberEllipsis': [{ type: ViewChild, args: ['crossReferenceAccountNumberEllipsis',] },],
    };
    return TelesalesComponent;
}());
