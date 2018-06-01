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
export var InvoiceTextComponent = (function () {
    function InvoiceTextComponent(httpService, serviceConstants, errorService, messageService, authService, ajaxconstant, router, pageData, titleService, zone, store, translate, ls, http, translateService, fb, logger, utilService) {
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
        this.fieldDisabled = {
            'BtnSendToNAV': false,
            'cmdGetAddress': false,
            'cmdSetInvoiceGroupDefault': false,
            'cmdSetInvoiceGroupEDI': false,
            'selMandateTypeCode': false,
            'cmdGenerateNew': false
        };
        this.fieldVisibility = {
            'CurrentInvoiceGroups': true,
            'InvoiceNarrativeSL': true,
            'CommonStatement': true,
            'CreateNewInvoiceGroupInd': true,
            'OutsortInvoiceDefaultInd': true
        };
        this.fieldRequired = {
            'isInvoiceNarrativeSLRequired': false,
            'isDedicatedContactProcedureIndRequired': false,
            'isCommonStatementRequired': false,
            'isInSightAccountIndRequired': false,
            'isCreateNewInvoiceGroupIndRequired': false,
            'isInterGroupAccountRequired': false,
            'isOutsortInvoiceDefaultIndRequired': false,
            'isExternalReferenceRequired': false,
            'isAccountInvoiceText1': false,
            'isAccountInvoiceText2': false,
            'isAccountInvoiceText3': false,
            'isAccountInvoiceText4': false,
            'isAccountInvoiceText5': false,
            'isAccountInvoiceText6': false,
            'isGroupAccountNumberRequired': false
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
        this.defaultCode = {
            country: 'ZA',
            business: 'D',
            BranchNumber: ''
        };
        this.updateMode = false;
        this.addMode = false;
        this.searchMode = false;
        this.thInformation = '';
        this.method = 'contract-management/maintenance';
        this.module = 'account';
        this.operation = 'Application/iCABSAAccountMaintenance';
        this.contentType = 'application/x-www-form-urlencoded';
        this.invoiceTextFormGroup = this.fb.group({
            CurrentInvoiceGroups: [{ value: '', disabled: true }],
            InvoiceNarrativeSL: [{ value: '', disabled: true }],
            CommonStatement: [{ value: '', disabled: true }],
            CreateNewInvoiceGroupInd: [{ value: '', disabled: true }],
            OutsortInvoiceDefaultInd: [{ value: '', disabled: true }],
            AccountInvoiceText1: [{ value: '', disabled: true }],
            AccountInvoiceText2: [{ value: '', disabled: true }],
            AccountInvoiceText3: [{ value: '', disabled: true }],
            AccountInvoiceText4: [{ value: '', disabled: true }],
            AccountInvoiceText5: [{ value: '', disabled: true }],
            AccountInvoiceText6: [{ value: '', disabled: true }],
            CrossReferenceAccountNumber: [{ value: '', disabled: true }],
            CrossReferenceAccountName: [{ value: '', disabled: true }],
            ValidationExemptInd: [{ value: '', disabled: true }],
            NewInvoiceGroupInd: [{ value: '', disabled: true }],
            cmdSetInvoiceGroupDefault: [{ value: 'Apply to all Invoice Groups', disabled: true }]
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
                        if (typeof (data['validate'].invoiceText) !== 'undefined') {
                            _this.validateForm();
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
    InvoiceTextComponent.prototype.ngOnInit = function () {
        String.prototype['capitalizeFirstLetter'] = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        this.defaultCode.country = this.utilService.getCountryCode();
        this.defaultCode.business = this.utilService.getBusinessCode();
        this.dispathFormGroup();
    };
    InvoiceTextComponent.prototype.dispathFormGroup = function () {
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                invoiceText: this.invoiceTextFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                invoiceText: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                invoiceText: this.fieldVisibility
            }
        });
    };
    InvoiceTextComponent.prototype.setFormData = function (data) {
        this.invoiceTextFormGroup.controls['CurrentInvoiceGroups'].setValue(data['data'].CurrentInvoiceGroups);
        this.invoiceTextFormGroup.controls['InvoiceNarrativeSL'].setValue(this.isCheckBoxChecked(data['data'].InvoiceNarrativeSL));
        this.invoiceTextFormGroup.controls['CommonStatement'].setValue(this.isCheckBoxChecked(data['data'].CommonStatement));
        this.invoiceTextFormGroup.controls['CreateNewInvoiceGroupInd'].setValue(this.isCheckBoxChecked(data['data'].CreateNewInvoiceGroupInd));
        this.invoiceTextFormGroup.controls['OutsortInvoiceDefaultInd'].setValue(this.isCheckBoxChecked(data['data'].OutsortInvoiceDefaultInd));
        this.invoiceTextFormGroup.controls['AccountInvoiceText1'].setValue(data['data'].AccountInvoiceText1);
        this.invoiceTextFormGroup.controls['AccountInvoiceText2'].setValue(data['data'].AccountInvoiceText2);
        this.invoiceTextFormGroup.controls['AccountInvoiceText3'].setValue(data['data'].AccountInvoiceText3);
        this.invoiceTextFormGroup.controls['AccountInvoiceText4'].setValue(data['data'].AccountInvoiceText4);
        this.invoiceTextFormGroup.controls['AccountInvoiceText5'].setValue(data['data'].AccountInvoiceText5);
        this.invoiceTextFormGroup.controls['AccountInvoiceText6'].setValue(data['data'].AccountInvoiceText6);
        this.invoiceTextFormGroup.updateValueAndValidity();
    };
    InvoiceTextComponent.prototype.isCheckBoxChecked = function (arg) {
        if (typeof arg === 'boolean' || (typeof arg === 'object' && typeof arg.valueOf() === 'boolean'))
            return arg;
        return (arg) ? (((arg.toLowerCase() === 'false') || (arg.toLowerCase() === 'f') || (arg.toLowerCase() === 'no')) ? false : true) : false;
    };
    InvoiceTextComponent.prototype.validateForm = function () {
        for (var j in this.fieldVisibility) {
            if (j) {
                var key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.invoiceTextFormGroup.controls[key]) {
                        this.invoiceTextFormGroup.controls[key].clearValidators();
                    }
                }
            }
        }
        for (var i in this.invoiceTextFormGroup.controls) {
            if (this.invoiceTextFormGroup.controls[i].enabled) {
                this.invoiceTextFormGroup.controls[i].markAsTouched();
            }
            else {
                this.invoiceTextFormGroup.controls[i].clearValidators();
            }
        }
        this.invoiceTextFormGroup.updateValueAndValidity();
        var formValid = null;
        if (!this.invoiceTextFormGroup.enabled) {
            formValid = true;
        }
        else {
            formValid = this.invoiceTextFormGroup.valid;
        }
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                invoiceText: this.invoiceTextFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                invoiceText: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                invoiceText: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_VALIDITY, payload: {
                invoiceText: formValid
            }
        });
    };
    InvoiceTextComponent.prototype.processForm = function () {
        this.invoiceTextFormGroup.controls['cmdSetInvoiceGroupDefault'].disable();
        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            this.invoiceTextFormGroup.controls['CurrentInvoiceGroups'].enable();
            this.invoiceTextFormGroup.controls['InvoiceNarrativeSL'].enable();
            this.invoiceTextFormGroup.controls['CommonStatement'].enable();
            this.invoiceTextFormGroup.controls['CreateNewInvoiceGroupInd'].enable();
            this.invoiceTextFormGroup.controls['OutsortInvoiceDefaultInd'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText1'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText2'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText3'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText4'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText5'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText6'].enable();
            this.fieldVisibility.CurrentInvoiceGroups = false;
        }
        if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
            this.invoiceTextFormGroup.controls['CurrentInvoiceGroups'].disable();
            this.invoiceTextFormGroup.controls['InvoiceNarrativeSL'].disable();
            this.invoiceTextFormGroup.controls['CommonStatement'].disable();
            this.invoiceTextFormGroup.controls['CreateNewInvoiceGroupInd'].disable();
            this.invoiceTextFormGroup.controls['OutsortInvoiceDefaultInd'].disable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText1'].disable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText2'].disable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText3'].disable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText4'].disable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText5'].disable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText6'].disable();
            this.fieldVisibility.CurrentInvoiceGroups = false;
        }
        if (this.mode['addMode'] && !this.mode['searchMode'] && !this.mode['updateMode']) {
            this.invoiceTextFormGroup.controls['CurrentInvoiceGroups'].enable();
            this.invoiceTextFormGroup.controls['InvoiceNarrativeSL'].enable();
            this.invoiceTextFormGroup.controls['CommonStatement'].enable();
            this.invoiceTextFormGroup.controls['CreateNewInvoiceGroupInd'].enable();
            this.invoiceTextFormGroup.controls['OutsortInvoiceDefaultInd'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText1'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText2'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText3'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText4'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText5'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText6'].enable();
            this.invoiceTextFormGroup.controls['CurrentInvoiceGroups'].setValue('');
            this.invoiceTextFormGroup.controls['InvoiceNarrativeSL'].setValue('');
            this.invoiceTextFormGroup.controls['CommonStatement'].setValue('');
            this.invoiceTextFormGroup.controls['CreateNewInvoiceGroupInd'].setValue(false);
            this.invoiceTextFormGroup.controls['OutsortInvoiceDefaultInd'].setValue(false);
            this.invoiceTextFormGroup.controls['AccountInvoiceText1'].setValue('');
            this.invoiceTextFormGroup.controls['AccountInvoiceText2'].setValue('');
            this.invoiceTextFormGroup.controls['AccountInvoiceText3'].setValue('');
            this.invoiceTextFormGroup.controls['AccountInvoiceText4'].setValue('');
            this.invoiceTextFormGroup.controls['AccountInvoiceText5'].setValue('');
            this.invoiceTextFormGroup.controls['AccountInvoiceText6'].setValue('');
            this.fieldVisibility.CurrentInvoiceGroups = true;
        }
        this.invoiceTextFormGroup.updateValueAndValidity();
    };
    InvoiceTextComponent.prototype.onCmdSetInvoiceGroupDefaultClick = function () {
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
            'AccountNumber': (this.storeData['data'] && this.storeData['data'].AccountNumber) ? this.storeData['data'].AccountNumber : '',
            'Function': 'SetInvoiceGroupsToDefault',
            'OutsortInvoice': (this.invoiceTextFormGroup.controls['OutsortInvoiceDefaultInd'].value) ? 'True' : 'False'
        };
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.queryAccount, postObj).subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                var returnObj = { 'ReturnHTML': e.ReturnHTML, 'trInformation': true };
                _this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_RETURN_HTML, payload: JSON.parse(JSON.stringify(returnObj)) });
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    InvoiceTextComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-account-maintenance-invoicetext',
                    templateUrl: 'InvoiceText.html'
                },] },
    ];
    InvoiceTextComponent.ctorParameters = [
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
    return InvoiceTextComponent;
}());
