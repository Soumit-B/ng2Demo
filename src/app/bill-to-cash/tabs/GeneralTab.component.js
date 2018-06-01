import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, Validators } from '@angular/forms';
import { InvoiceActionTypes } from './../../actions/invoice';
import { Utils } from './../../../shared/services/utility';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { BillToCashConstants } from './../bill-to-cash-constants';
import { InvoiceFeeSearchComponent } from './../../internal/search/iCABSBInvoiceFeeSearch';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { URLSearchParams } from '@angular/http';
import { HttpService } from './../../../shared/services/http-service';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { PaymentSearchComponent } from './../../internal/search/iCABSBPaymentTypeSearch';
import { PaymentTermSearchComponent } from './../../internal/search/iCABSBPaymentTermSearch.component';
import { AccountSearchComponent } from './../../internal/search/iCABSASAccountSearch';
import { RiExchange } from './../../../shared/services/riExchange';
export var GeneralTabComponent = (function () {
    function GeneralTabComponent(store, formBuilder, util, serviceConstants, globalConstant, httpService, localeTranslateService, utils, riExchange) {
        var _this = this;
        this.store = store;
        this.formBuilder = formBuilder;
        this.util = util;
        this.serviceConstants = serviceConstants;
        this.globalConstant = globalConstant;
        this.httpService = httpService;
        this.localeTranslateService = localeTranslateService;
        this.utils = utils;
        this.riExchange = riExchange;
        this.invoiceFeeSearchComponent = InvoiceFeeSearchComponent;
        this.paymentMethodSearchComponent = PaymentSearchComponent;
        this.showHeader = true;
        this.showCloseButton = true;
        this.elementShowHide = {
            PaymentType: false,
            InvoiceFee: true,
            HideProductDetailOnInvoice: true,
            InvoiceFeeEllipsisCloseButton: true,
            InvoiceFeeEllipsisHeader: true,
            GroupByVisits: true,
            OverridePrintOption: false
        };
        this.elementStates = {
            InvoiceFeeEllipsis: false,
            InvoiceFee: false
        };
        this.storeFormValidKey = 'General';
        this.PaymentTermSearchComponent = PaymentTermSearchComponent;
        this.accountSearchComponent = AccountSearchComponent;
        this.ellipsisQueryParams = {
            invoiceFee: {
                parentMode: 'Lookup'
            },
            paymentTerm: {
                parentMode: 'Lookup'
            },
            inputParamsPaymentTermSearch: {
                parentMode: 'Lookup'
            },
            inputParamsCollectForm: {
                parentMode: 'LookUp-CollectFrom'
            }
        };
        this.isExOAMandateReferenceEnabled = false;
        this.invoiceIssueTypeCodeList = [
            { text: 'Options', value: '' },
            { text: 'Hard Copy', value: '01' },
            { text: 'Direct Debit', value: '02' },
            { text: 'Elctronic Data Interchange', value: '03' },
            { text: 'Fascimile', value: '04' },
            { text: 'Email', value: '05' },
            { text: 'Do Not Print', value: '06' }
        ];
        this.invoiceFormatCodeList = [
            { text: 'Options', value: '' },
            { text: 'Contract', value: 'CO' },
            { text: 'Invoice Group', value: 'IG' },
            { text: 'Premise', value: 'PM' },
            { text: 'Product', value: 'PR' }
        ];
        this.disableForm = true;
        this.storeSubscription = this.store.select('invoice').subscribe(function (data) {
            _this.storeUpdateHandler(data);
        });
        this.modalConfig = BillToCashConstants.c_o_ELLIPSIS_MODAL_CONFIG;
        this.ellipsisQueryParams['paymentTerm'][this.serviceConstants.CountryCode] = this.util.getCountryCode();
        this.ellipsisQueryParams['paymentTerm'][this.serviceConstants.BusinessCode] = this.util.getBusinessCode();
    }
    GeneralTabComponent.prototype.ngOnInit = function () {
        this.buidForm();
        this.store.dispatch({
            type: InvoiceActionTypes.SET_FORM_GROUPS,
            payload: {
                name: BillToCashConstants.c_o_STORE_KEY_NAMES['Dropdown'],
                form: {
                    InvoiceIssueTypeCode: this.invoiceIssueTypeCodeDropdown,
                    InvoiceFormatCode: this.invoiceFormatCodeDropdown
                }
            }
        });
        this.localeTranslateService.setUpTranslation();
    };
    GeneralTabComponent.prototype.ngOnDestroy = function () {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    };
    GeneralTabComponent.prototype.storeUpdateHandler = function (data) {
        if (data && data['code']) {
            this.storeCode = data['code'];
        }
        if (data && data['formGroup']) {
            this.storeFormGroup = data['formGroup'];
        }
        if (data && data['mode']) {
            this.storeMode = data['mode'];
        }
        switch (data['action']) {
            case InvoiceActionTypes.SAVE_DATA:
                this.storeData = data['data'];
                this.setFormData();
                break;
            case InvoiceActionTypes.SAVE_CODE:
                this.storeCode = data['code'];
                this.setEllipsisParams();
                break;
            case InvoiceActionTypes.SAVE_SYSCHAR:
                this.storeSysChars = data['syschars'];
                this.updateViewFromSysChar();
                break;
            case InvoiceActionTypes.SAVE_OTHER_DETAILS:
                this.storeOtherDetails = data['otherDetails'];
                this.setDetailsInForms();
                break;
            case InvoiceActionTypes.UPDATE_LIVE_INVOICE:
                this.generalFormGroup.controls['LiveInvoiceGroup'].setValue(data['isLiveInvoice']);
                break;
            case InvoiceActionTypes.RESET_FORMS:
                this.setFormData();
                this.setDetailsInForms();
                break;
            case InvoiceActionTypes.SAVE_MODE:
                if (this.generalFormGroup) {
                    this.riExchange.riInputElement.Enable(this.generalFormGroup, 'PaymentTermCode');
                    if (this.storeMode['updateMode']) {
                        this.riExchange.riInputElement.Disable(this.generalFormGroup, 'PaymentTermCode');
                    }
                }
                break;
        }
    };
    GeneralTabComponent.prototype.buidForm = function () {
        this.generalFormGroup = this.formBuilder.group({
            InvoiceGroupDesc: [{ value: '', disabled: false }, Validators.required],
            InvoiceFeeCode: [{ value: '', disabled: false }, Validators.required],
            InvoiceFeeDesc: [{ value: '', disabled: true }],
            PaymentTypeCode: [{ value: '', disabled: false }],
            OverridePrintOption: [{ value: '' }],
            PaymentDesc: [{ value: '', disabled: false }],
            InvoiceLanguageCode: [{ value: '', disabled: false }, Validators.required],
            LanguageDescription: [{ value: '', disabled: true }],
            CurrencyCode: [{ value: '', disabled: false }, Validators.required],
            CurrencyDesc: [{ value: '', disabled: true }],
            InvoiceCopies: [{ value: '', disabled: false }, Validators.required],
            PaymentTermCode: [{ value: '', disabled: false }, Validators.required],
            PaymentTermDesc: [{ value: '', disabled: true }],
            CollectFrom: [{ value: '', disabled: false }],
            CollectFromName: [{ value: '', disabled: true }],
            ExOAMandateReference: [{ value: '', disabled: false }],
            TaxRegistrationNumber: [{ value: '', disabled: false }],
            PrintClientReference: [{ value: '', disabled: false }],
            PrintPurchaseOrderNo: [{ value: '', disabled: false }],
            PrintPremiseAddress: [{ value: '', disabled: false }],
            PrintProductDesc: [{ value: '', disabled: false }],
            OutsortInvoice: [{ value: '', disabled: false }],
            OutsortInvoiceSequence: [{ value: '', disabled: false }],
            ScheduleRequired: [{ value: '', disabled: false }],
            HideProductDetailOnInvoice: [{ value: '', disabled: false }],
            LiveInvoiceGroup: [{ value: '', disabled: false }],
            GroupByVisits: [{ value: '', disabled: false }],
            CombineInvoiceValueInd: [{ value: '', disabled: false }],
            CombineInvoiceValueDesc: [{ value: '', disabled: true }]
        });
        this.store.dispatch({
            type: InvoiceActionTypes.SET_FORM_GROUPS,
            payload: {
                name: this.storeFormValidKey,
                form: this.generalFormGroup
            }
        });
        this.generalFormGroup.disable();
        this.invoiceIssueTypeCodeDropdown.disabled = true;
        this.invoiceFormatCodeDropdown.disabled = true;
    };
    GeneralTabComponent.prototype.setFormData = function () {
        this.generalFormGroup.reset();
        this.generalFormGroup.controls['InvoiceGroupDesc'].setValue(this.storeData['InvoiceGroupDesc']);
        this.generalFormGroup.controls['PaymentTypeCode'].setValue(this.storeData['PaymentTypeCode']);
        this.invoiceIssueTypeCodeDropdown.selectedItem = this.storeData['InvoiceIssueTypeCode'];
        this.invoiceFormatCodeDropdown.selectedItem = this.storeData['SystemInvoiceFormatCode'];
        this.generalFormGroup.controls['OverridePrintOption'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['OverridePrintOption']));
        this.generalFormGroup.controls['CurrencyCode'].setValue(this.storeData['CurrencyCode']);
        this.generalFormGroup.controls['CurrencyDesc'].setValue(this.storeData['CurrencyDesc']);
        this.generalFormGroup.controls['InvoiceLanguageCode'].setValue(this.storeData['LanguageCode']);
        this.generalFormGroup.controls['InvoiceFeeCode'].setValue(this.storeData['InvoiceFeeCode']);
        this.generalFormGroup.controls['LanguageDescription'].setValue(this.storeData['LanguageDescription']);
        this.generalFormGroup.controls['InvoiceCopies'].setValue(this.storeData['InvoiceCopies']);
        this.generalFormGroup.controls['PaymentTermCode'].setValue(this.storeData['PaymentTermCode']);
        this.generalFormGroup.controls['PaymentTermDesc'].setValue(this.storeData['PaymentTermDesc']);
        this.generalFormGroup.controls['ExOAMandateReference'].setValue(this.storeData['ExOAMandateReference']);
        this.generalFormGroup.controls['TaxRegistrationNumber'].setValue(this.storeData['TaxRegistrationNumber']);
        this.generalFormGroup.controls['PrintClientReference'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['PrintClientReference']));
        this.generalFormGroup.controls['PrintPurchaseOrderNo'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['PrintPurchaseOrderNo']));
        this.generalFormGroup.controls['PrintPremiseAddress'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['PrintPremiseAddress']));
        this.generalFormGroup.controls['PrintProductDesc'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['PrintProductDesc']));
        this.generalFormGroup.controls['OutsortInvoice'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['OutsortInvoice']));
        this.generalFormGroup.controls['OutsortInvoiceSequence'].setValue(this.storeData['OutsortInvoiceSequence']);
        this.generalFormGroup.controls['ScheduleRequired'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['ScheduleRequired']));
        this.generalFormGroup.controls['HideProductDetailOnInvoice'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['HideProductDetailOnInvoice']));
        if (!this.storeMode['addMode']) {
            this.generalFormGroup.controls['LiveInvoiceGroup'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['LiveInvoiceGroup']));
        }
        this.generalFormGroup.controls['GroupByVisits'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['GroupByVisits']));
        this.generalFormGroup.controls['CombineInvoiceValueInd'].setValue(this.util.convertResponseValueToCheckboxInput(this.storeData['CombineInvoiceValueInd']));
        this.generalFormGroup.controls['CombineInvoiceValueDesc'].setValue(this.storeData['CombineInvoiceValueDesc']);
        this.showGroupByVisits();
        this.disableForm = false;
        this.enableForm();
    };
    GeneralTabComponent.prototype.enableForm = function () {
        this.generalFormGroup.enable();
        if (this.storeMode['updateMode']) {
            this.riExchange.riInputElement.Disable(this.generalFormGroup, 'PaymentTermCode');
        }
        this.riExchange.riInputElement.Disable(this.generalFormGroup, 'InvoiceFeeDesc');
        this.riExchange.riInputElement.Disable(this.generalFormGroup, 'PaymentDesc');
        this.riExchange.riInputElement.Disable(this.generalFormGroup, 'CurrencyDesc');
        this.riExchange.riInputElement.Disable(this.generalFormGroup, 'LanguageDescription');
        this.riExchange.riInputElement.Disable(this.generalFormGroup, 'PaymentTermDesc');
        this.riExchange.riInputElement.Disable(this.generalFormGroup, 'CollectFromName');
        this.invoiceIssueTypeCodeDropdown.disabled = false;
        this.invoiceFormatCodeDropdown.disabled = false;
    };
    GeneralTabComponent.prototype.updateViewFromSysChar = function () {
        var sysCharsValue = this.storeSysChars;
        if (sysCharsValue['vSCEnablePayTypeAtInvGroupLev']) {
            this.generalFormGroup.controls['PaymentTypeCode'].setValidators(Validators.required);
        }
        this.elementShowHide.PaymentType = sysCharsValue['vSCEnablePayTypeAtInvGroupLev'];
        this.elementShowHide.InvoiceFee = true;
        this.riExchange.riInputElement.SetRequiredStatus(this.generalFormGroup, 'InvoiceFeeCode', true);
        if (!sysCharsValue['vSCEnableInvoiceFee']) {
            this.riExchange.riInputElement.SetRequiredStatus(this.generalFormGroup, 'InvoiceFeeCode', false);
            this.elementShowHide.InvoiceFee = false;
        }
        this.elementShowHide.HideProductDetailOnInvoice = sysCharsValue['vSCInvoiceShowProductDetail'];
    };
    GeneralTabComponent.prototype.setDetailsInForms = function () {
        if (this.storeMode['addMode']) {
            this.generalFormGroup.controls['LiveInvoiceGroup'].setValue(true);
        }
        this.generalFormGroup.controls['CurrencyDesc'].setValue(this.storeOtherDetails['CurrencyDesc'] || '');
        this.generalFormGroup.controls['PaymentTermDesc'].setValue(this.storeOtherDetails['PaymentTermDesc'] || '');
        this.generalFormGroup.controls['LanguageDescription'].setValue(this.storeOtherDetails['LanguageDescription'] || '');
        if (this.generalFormGroup.controls['InvoiceFeeCode'].value) {
            this.generalFormGroup.controls['InvoiceFeeDesc'].setValue(this.storeOtherDetails['InvoiceFeeDesc'] || '');
        }
    };
    GeneralTabComponent.prototype.setEllipsisParams = function () {
        for (var key in this.ellipsisQueryParams) {
            if (!key) {
                continue;
            }
            this.ellipsisQueryParams[key]['parentMode'] = this.ellipsisQueryParams[key].parentMode;
            this.ellipsisQueryParams[key][this.serviceConstants.BusinessCode] = this.storeCode[this.serviceConstants.BusinessCode];
            this.ellipsisQueryParams[key][this.serviceConstants.CountryCode] = this.storeCode[this.serviceConstants.CountryCode];
        }
    };
    GeneralTabComponent.prototype.showGroupByVisits = function () {
        var invoiceFormatCode = this.invoiceFormatCodeDropdown.selectedItem;
        this.elementShowHide.GroupByVisits = (BillToCashConstants.c_arr_GROUPBYVISITS_FORMAT_CODES.indexOf(invoiceFormatCode) > -1);
    };
    GeneralTabComponent.prototype.dispatchError = function (error) {
        this.store.dispatch({
            type: InvoiceActionTypes.DISPATCH_ERROR,
            payload: error
        });
    };
    GeneralTabComponent.prototype.dispatchGeneralError = function (error) {
        var errorObject = {};
        errorObject[BillToCashConstants.c_o_ERROROBJECT_KEYS.isLogRequired] = true;
        errorObject[BillToCashConstants.c_o_ERROROBJECT_KEYS.error] = error;
        this.dispatchError(errorObject);
    };
    GeneralTabComponent.prototype.onInvoiceFeeDataReceived = function (data) {
        this.generalFormGroup.controls['InvoiceFeeCode'].setValue(data.InvoiceFeeCode);
        if (data.InvoiceFeeDesc) {
            this.generalFormGroup.controls['InvoiceFeeDesc'].setValue(data.InvoiceFeeDesc);
        }
    };
    GeneralTabComponent.prototype.onPaymentMethodDataReceived = function (data) {
        this.generalFormGroup.controls['PaymentTypeCode'].setValue(data.PaymentTypeCode);
        if (data.Object.PaymentDesc) {
            this.generalFormGroup.controls['PaymentDesc'].setValue(data.Object.PaymentDesc);
        }
    };
    GeneralTabComponent.prototype.onInvoiceIssueTypeChange = function (data) {
        if (!this.storeSysChars) {
            return;
        }
        var sysChars = this.storeSysChars;
        var issueType = this.invoiceIssueTypeCodeDropdown.selectedItem;
        this.elementShowHide.OverridePrintOption = (sysChars['vSCPrintEDIInvoices'] && sysChars['vSCEnablePayTypeAtInvGroupLev'] && issueType === '03');
    };
    GeneralTabComponent.prototype.onInvoiceFormatChange = function (data) {
        this.showGroupByVisits();
    };
    GeneralTabComponent.prototype.onExOAMandateReferenceChange = function (event) {
        var inputValue = this.generalFormGroup.controls['ExOAMandateReference'].value;
        this.isExOAMandateReferenceEnabled = false;
        if (inputValue) {
            this.isExOAMandateReferenceEnabled = true;
        }
    };
    GeneralTabComponent.prototype.onCollectFormChange = function (event) {
        var collectFrom = this.generalFormGroup.controls['CollectFrom'].value;
        if (collectFrom.length === this.globalConstant.AppConstants['defaultFormatSize']) {
            return;
        }
        collectFrom = this.util.fillLeadingZeros(collectFrom);
        this.generalFormGroup.controls['CollectFrom'].setValue(collectFrom);
        var code = this.generalFormGroup.controls['CollectFrom'].value;
        var lookupQuery = [{
                'table': 'Account',
                'query': { 'AccountNumber': code },
                'fields': ['AccountName']
            }];
        this.getDescriptions(lookupQuery, 'CollectFromName', 'AccountName');
    };
    GeneralTabComponent.prototype.onLiveInvoiceGroupChange = function () {
        var liveInvoiceGroup = this.generalFormGroup.controls['LiveInvoiceGroup'].value;
        if (liveInvoiceGroup) {
            return;
        }
        this.store.dispatch({
            type: InvoiceActionTypes.CHECK_LIVE_INVOICE
        });
    };
    GeneralTabComponent.prototype.onCombineInvoiceValueIndChange = function () {
        if (!this.generalFormGroup.controls['CombineInvoiceValueInd'].value) {
            this.generalFormGroup.controls['CombineInvoiceValueDesc'].disable();
            this.generalFormGroup.controls['CombineInvoiceValueDesc'].setValue('');
        }
        else {
            this.generalFormGroup.controls['CombineInvoiceValueDesc'].enable();
        }
    };
    GeneralTabComponent.prototype.onPaymentTypeCodeChange = function () {
        var _this = this;
        var paymentType = this.generalFormGroup.controls['PaymentTypeCode'].value;
        if (!paymentType) {
            return;
        }
        this.issueTypeQuery = new URLSearchParams();
        var formData = {};
        this.issueTypeQuery.set(this.serviceConstants.BusinessCode, this.storeCode[BillToCashConstants.c_o_STORE_KEY_NAMES['CodeBusiness']]);
        this.issueTypeQuery.set(this.serviceConstants.CountryCode, this.storeCode[BillToCashConstants.c_o_STORE_KEY_NAMES['CodeCountry']]);
        this.issueTypeQuery.set(this.serviceConstants.Action, '6');
        formData[this.serviceConstants.AccountNumber] = this.storeFormGroup['main'].controls['AccountNumber'].value;
        formData[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['PaymentTypeCode']] = paymentType;
        formData[this.serviceConstants.Function] = 'GetDefaultIssueType';
        this.httpService.makePostRequest(BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'], this.issueTypeQuery, formData).subscribe(function (data) {
            if (data['errorMessage'] !== undefined) {
                _this.dispatchError({
                    msg: data.errorMessage
                });
                return;
            }
            if (data.InvoiceIssueTypeCode) {
                _this.invoiceIssueTypeCodeDropdown.selectedItem = data.InvoiceIssueTypeCode;
            }
        }, function (error) {
            _this.dispatchGeneralError(error);
        });
    };
    GeneralTabComponent.prototype.onOutsortInvoiceChange = function () {
        var _this = this;
        var formData = {};
        if (!this.storeMode['updateMode']) {
            return;
        }
        this.outsortInvoiceQuery = new URLSearchParams();
        this.outsortInvoiceQuery.set(this.serviceConstants.BusinessCode, this.storeCode[BillToCashConstants.c_o_STORE_KEY_NAMES['CodeBusiness']]);
        this.outsortInvoiceQuery.set(this.serviceConstants.CountryCode, this.storeCode[BillToCashConstants.c_o_STORE_KEY_NAMES['CodeCountry']]);
        this.outsortInvoiceQuery.set(this.serviceConstants.Action, '6');
        formData[this.serviceConstants.AccountNumber] = this.storeFormGroup['main'].controls['AccountNumber'].value;
        formData[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['OutsortInvoice']] = this.storeFormGroup['General'].controls['OutsortInvoice'].value;
        formData[this.serviceConstants.Function] = 'UpdateOutsortInvoice';
        this.httpService.makePostRequest(BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'], this.outsortInvoiceQuery, formData).subscribe(function (data) {
            if (!data) {
                return;
            }
            if (data['errorMessage'] !== undefined) {
                _this.dispatchError({
                    msg: data.errorMessage
                });
                return;
            }
        }, function (error) {
            _this.dispatchGeneralError(error);
        });
    };
    GeneralTabComponent.prototype.onPaymentTermReceived = function (data) {
        var PaymentTermNumber = data['PaymentTermNumber'];
        var PaymentTermDesc = data['PaymentTermDesc'];
        this.generalFormGroup.controls['PaymentTermCode'].setValue(PaymentTermNumber);
        this.generalFormGroup.controls['PaymentTermDesc'].setValue(PaymentTermDesc);
    };
    GeneralTabComponent.prototype.onAccountNumberReceived = function (data) {
        this.generalFormGroup.controls['CollectFrom'].setValue(data['AccountNumber']);
        this.generalFormGroup.controls['CollectFromName'].setValue(data['AccountName']);
    };
    GeneralTabComponent.prototype.onInvoiceFeeChange = function (event) {
        var invoiceFeeCode = this.generalFormGroup.controls['InvoiceFeeCode'].value;
        var lookupQuery = [{
                'table': 'InvoiceFee',
                'query': { 'InvoiceFeeCode': invoiceFeeCode },
                'fields': ['InvoiceFeeDesc']
            }];
        this.getDescriptions(lookupQuery, 'InvoiceFeeDesc', 'InvoiceFeeDesc');
    };
    GeneralTabComponent.prototype.onLanguageChange = function (event) {
        var code = this.generalFormGroup.controls['InvoiceLanguageCode'].value;
        var lookupQuery = [{
                'table': 'Language',
                'query': { 'LanguageCode': code },
                'fields': ['LanguageDescription']
            }];
        this.getDescriptions(lookupQuery, 'LanguageDescription', 'LanguageDescription');
    };
    GeneralTabComponent.prototype.onCurrencyChange = function (event) {
        var code = this.generalFormGroup.controls['CurrencyCode'].value;
        var lookupQuery = [{
                'table': 'Currency',
                'query': { 'CurrencyCode': code },
                'fields': ['CurrencyDesc']
            }];
        this.getDescriptions(lookupQuery, 'CurrencyDesc', 'CurrencyDesc');
    };
    GeneralTabComponent.prototype.onPaymentTermChange = function (event) {
        var code = this.generalFormGroup.controls['PaymentTermCode'].value;
        var lookupQuery = [{
                'table': 'PaymentTerm',
                'query': { 'PaymentTermCode': code },
                'fields': ['PaymentTermDesc']
            }];
        this.getDescriptions(lookupQuery, 'PaymentTermDesc', 'PaymentTermDesc');
    };
    GeneralTabComponent.prototype.getDescriptions = function (lookupQuery, controlName, fieldName) {
        var _this = this;
        var query = new URLSearchParams();
        query.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        query.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        query.set(this.serviceConstants.Action, '0');
        query.set(this.serviceConstants.MaxResults, '1');
        this.httpService.lookUpRequest(query, lookupQuery).subscribe(function (data) {
            var desc = '';
            if (data.results[0].length) {
                desc = data.results[0][0][fieldName];
            }
            _this.generalFormGroup.controls[controlName].setValue(desc);
        }, function (error) {
            _this.dispatchGeneralError(error);
        });
    };
    GeneralTabComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-general-tab',
                    templateUrl: 'GeneralTab.html'
                },] },
    ];
    GeneralTabComponent.ctorParameters = [
        { type: Store, },
        { type: FormBuilder, },
        { type: Utils, },
        { type: ServiceConstants, },
        { type: GlobalConstant, },
        { type: HttpService, },
        { type: LocaleTranslationService, },
        { type: Utils, },
        { type: RiExchange, },
    ];
    GeneralTabComponent.propDecorators = {
        'invoiceIssueTypeCodeDropdown': [{ type: ViewChild, args: ['InvoiceIssueTypeCodeDropdown',] },],
        'invoiceFormatCodeDropdown': [{ type: ViewChild, args: ['InvoiceFormatCodeDropdown',] },],
        'paymentTermEllipsis': [{ type: ViewChild, args: ['paymentTermEllipsis',] },],
    };
    return GeneralTabComponent;
}());
