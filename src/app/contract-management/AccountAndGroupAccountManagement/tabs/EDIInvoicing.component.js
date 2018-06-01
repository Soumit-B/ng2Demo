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
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { PostCodeSearchComponent } from '../../../../app/internal/search/iCABSBPostcodeSearch.component';
export var EDIInvoicingComponent = (function () {
    function EDIInvoicingComponent(httpService, serviceConstants, errorService, messageService, authService, ajaxconstant, router, pageData, titleService, zone, store, translate, ls, http, translateService, fb, logger, utilService) {
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
        this.internalFieldStatus = {
            'fieldDisabled': null,
            'fieldVisibility': null,
            'fieldRequired': null,
            'sysCharParams': null,
            'virtualTableField': null,
            'otherParams': null
        };
        this.fieldDisabled = {
            'cmdSetInvoiceGroupEDI': false
        };
        this.fieldVisibility = {
            'trInformationEDI': false
        };
        this.fieldRequired = {
            'isEDIPartnerAccountCode': false,
            'isEDIPartnerANANumber': false
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
        this.method = 'contract-management/maintenance';
        this.module = 'account';
        this.operation = 'Application/iCABSAAccountMaintenance';
        this.contentType = 'application/x-www-form-urlencoded';
        this.thInformationEDI = '';
        this.defaultCode = {
            country: 'ZA',
            business: 'D',
            BranchNumber: ''
        };
        this.ediInvoicingFormGroup = this.fb.group({
            EDIPartnerAccountCode: [{ value: '', disabled: true }],
            EDIPartnerANANumber: [{ value: '', disabled: true }],
            cmdSetInvoiceGroupEDI: [{ value: 'Apply to all Invoice Groups', disabled: true }]
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
                        if (typeof (data['validate'].ediInvoicing) !== 'undefined') {
                            _this.validateForm();
                        }
                        break;
                    case AccountMaintenanceActionTypes.LOAD_FORM_GROUP:
                        break;
                    case AccountMaintenanceActionTypes.BEFORE_ADD:
                        _this.ediInvoicingFormGroup.controls['cmdSetInvoiceGroupEDI'].disable();
                        _this.ediInvoicingFormGroup.updateValueAndValidity();
                        break;
                    default:
                        break;
                }
            }
        });
    }
    EDIInvoicingComponent.prototype.ngOnInit = function () {
        String.prototype['capitalizeFirstLetter'] = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        this.defaultCode.country = this.utilService.getCountryCode();
        this.defaultCode.business = this.utilService.getBusinessCode();
        this.dispathFormGroup();
    };
    EDIInvoicingComponent.prototype.setFormData = function (data) {
        this.ediInvoicingFormGroup.controls['EDIPartnerAccountCode'].setValue(data['data'].EDIPartnerAccountCode);
        this.ediInvoicingFormGroup.controls['EDIPartnerANANumber'].setValue(data['data'].EDIPartnerANANumber);
    };
    EDIInvoicingComponent.prototype.dispathFormGroup = function () {
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                ediInvoicing: this.ediInvoicingFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                ediInvoicing: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                ediInvoicing: this.fieldVisibility
            }
        });
    };
    EDIInvoicingComponent.prototype.validateForm = function () {
        for (var j in this.fieldVisibility) {
            if (j) {
                var key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.ediInvoicingFormGroup.controls[key]) {
                        this.ediInvoicingFormGroup.controls[key].clearValidators();
                    }
                }
            }
        }
        for (var i in this.ediInvoicingFormGroup.controls) {
            if (this.ediInvoicingFormGroup.controls[i].enabled) {
                this.ediInvoicingFormGroup.controls[i].markAsTouched();
            }
            else {
                this.ediInvoicingFormGroup.controls[i].clearValidators();
            }
        }
        this.ediInvoicingFormGroup.updateValueAndValidity();
        var formValid = null;
        if (!this.ediInvoicingFormGroup.enabled) {
            formValid = true;
        }
        else {
            formValid = this.ediInvoicingFormGroup.valid;
        }
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                ediInvoicing: this.ediInvoicingFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                ediInvoicing: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                ediInvoicing: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_VALIDITY, payload: {
                ediInvoicing: formValid
            }
        });
    };
    EDIInvoicingComponent.prototype.processForm = function () {
        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            this.ediInvoicingFormGroup.controls['EDIPartnerAccountCode'].enable();
            this.ediInvoicingFormGroup.controls['EDIPartnerANANumber'].enable();
            this.thInformationEDI = '';
        }
        if (this.mode['searchMode'] && !this.mode['addMode'] && !this.mode['updateMode']) {
            this.ediInvoicingFormGroup.controls['EDIPartnerAccountCode'].disable();
            this.ediInvoicingFormGroup.controls['EDIPartnerANANumber'].disable();
            this.ediInvoicingFormGroup.controls['cmdSetInvoiceGroupEDI'].disable();
            this.thInformationEDI = '';
        }
        if (this.mode['addMode'] && !this.mode['updateMode'] && !this.mode['searchMode']) {
            this.ediInvoicingFormGroup.controls['EDIPartnerAccountCode'].enable();
            this.ediInvoicingFormGroup.controls['EDIPartnerANANumber'].enable();
            this.ediInvoicingFormGroup.controls['EDIPartnerAccountCode'].setValue('');
            this.ediInvoicingFormGroup.controls['EDIPartnerANANumber'].setValue('');
            this.ediInvoicingFormGroup.controls['cmdSetInvoiceGroupEDI'].enable();
            this.thInformationEDI = '';
        }
        this.ediInvoicingFormGroup.updateValueAndValidity();
    };
    EDIInvoicingComponent.prototype.onCmdSetInvoiceGroupEDIClick = function () {
        var _this = this;
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
            'AccountNumber': this.storeData['data'].AccountNumber,
            'Function': 'SetInvoiceGroupEDI'
        };
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.queryAccount, postObj).subscribe(function (e) {
            if (e.status === 'failure') {
            }
            else {
                _this.thInformationEDI = e.ReturnHTML;
                _this.fieldVisibility.trInformationEDI = true;
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    EDIInvoicingComponent.prototype.RecordSelected = function (obj) {
        if (this.storeData && this.storeData['data']) {
            return true;
        }
        return false;
    };
    EDIInvoicingComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-account-maintenance-ediinvoicing',
                    templateUrl: 'EDIInvoicing.html'
                },] },
    ];
    EDIInvoicingComponent.ctorParameters = [
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
    return EDIInvoicingComponent;
}());
