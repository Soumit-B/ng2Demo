import { Component, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../../shared/services/http-service';
import { ContractActionTypes } from '../../../actions/contract';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { InvoiceFeeSearchComponent } from '../../../../app/internal/search/iCABSBInvoiceFeeSearch';
import { InvoiceFrequencySearchComponent } from '../../../internal/search/iCABSBBusinessInvoiceFrequencySearch';
import { PaymentSearchComponent } from '../../../internal/search/iCABSBPaymentTypeSearch';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { Utils } from '../../../../shared/services/utility';
export var MaintenanceTypeBComponent = (function () {
    function MaintenanceTypeBComponent(zone, fb, route, store, serviceConstants, httpService, utils) {
        var _this = this;
        this.zone = zone;
        this.fb = fb;
        this.route = route;
        this.store = store;
        this.serviceConstants = serviceConstants;
        this.httpService = httpService;
        this.utils = utils;
        this.inputParams = { 'parentMode': 'Contract-Search', 'ContractTypeCode': '', 'countryCode': '', 'businessCode': '' };
        this.inputParamsInvoiceFee = { 'parentMode': 'LookUp', 'countryCode': '', 'businessCode': '' };
        this.inputParamsInvoiceFrequency = { 'parentMode': 'LookUp', 'countryCode': '', 'businessCode': '' };
        this.inputParamsPaymentType = { 'parentMode': 'LookUp', 'countryCode': '', 'businessCode': '' };
        this.inputParamsContractDuration = { 'parentMode': 'LookUp-Contract', 'countryCode': '', 'businessCode': '' };
        this.inputParamsMinimumDuration = { 'parentMode': 'LookUp-ContractMinDuration', 'countryCode': '', 'businessCode': '' };
        this.inputParamsSubsequentDuration = { 'parentMode': 'LookUp-SubsequentDuration', 'countryCode': '', 'businessCode': '' };
        this.fieldVisibility = {
            'invoiceAnnivDate': true,
            'nextAPIDate': true,
            'invoiceFrequencyCode': true,
            'invoiceFrequencyDesc': true,
            'invoiceFrequencyChargeInd': false,
            'invoiceFrequencyChargeValue': false,
            'invoiceFeeCode': false,
            'invoiceFeeDesc': false,
            'vatExempt': true,
            'advanceInvoiceInd': true,
            'createRenewalInd': true,
            'continuousInd': true,
            'contractRenewalDate': false,
            'contractDurationCode': true,
            'contractDurationDesc': true,
            'contractExpiryDate': true,
            'minimumDurationCode': true,
            'minimumDurationDesc': true,
            'minimumExpiryDate': true,
            'subsequentDurationCode': true,
            'subsequentDurationDesc': true,
            'apiExemptInd': true,
            'apiExemptText': true,
            'invoiceSuspendInd': true,
            'invoiceSuspendText': true,
            'hprlExemptInd': true,
            'paymentTypeCode': true,
            'paymentDesc': true,
            'authorityCode': true,
            'vaddMandateNumber': true,
            'vaddBranchNumber': true,
            'vaddApproved': true,
            'mandateNumberAccount': false,
            'generate': false,
            'mandateDate': false,
            'bankAccountNumber': true,
            'bankAccountSortCode': true,
            'paymentDueDay': true,
            'mandateNumberGenerate': true
        };
        this.fieldRequired = {
            'invoiceAnnivDate': true,
            'nextAPIDate': false,
            'invoiceFrequencyCode': false,
            'invoiceFrequencyDesc': false,
            'invoiceFrequencyChargeInd': false,
            'invoiceFrequencyChargeValue': false,
            'invoiceFeeCode': false,
            'invoiceFeeDesc': false,
            'vatExempt': false,
            'advanceInvoiceInd': false,
            'createRenewalInd': false,
            'continuousInd': false,
            'contractRenewalDate': false,
            'contractDurationCode': false,
            'contractDurationDesc': false,
            'contractExpiryDate': false,
            'minimumDurationCode': false,
            'minimumDurationDesc': false,
            'minimumExpiryDate': false,
            'subsequentDurationCode': false,
            'subsequentDurationDesc': false,
            'apiExemptInd': false,
            'apiExemptText': false,
            'invoiceSuspendInd': false,
            'invoiceSuspendText': false,
            'hprlExemptInd': false,
            'paymentTypeCode': true,
            'paymentDesc': false,
            'authorityCode': false,
            'vaddMandateNumber': false,
            'vaddBranchNumber': false,
            'vaddApproved': false,
            'mandateNumberAccount': false,
            'generate': false,
            'mandateDate': false,
            'bankAccountNumber': false,
            'bankAccountSortCode': false,
            'paymentDueDay': false
        };
        this.invoiceAnnivDate = void 0;
        this.nextAPIDate = void 0;
        this.contractRenewalDate = void 0;
        this.contractExpiryDate = void 0;
        this.minimumExpiryDate = void 0;
        this.mandateDate = void 0;
        this.invoiceAnnivDateDisplay = '';
        this.nextAPIDateDisplay = '';
        this.contractRenewalDateDisplay = '';
        this.contractExpiryDateDisplay = '';
        this.minimumExpiryDateDisplay = '';
        this.mandateDateDisplay = '';
        this.blnMandateNumberReq = false;
        this.dateObjectsEnabled = {
            invoiceAnnivDate: false,
            nextAPIDate: false,
            contractRenewalDate: false,
            contractExpiryDate: false,
            minimumExpiryDate: false,
            mandateDate: false
        };
        this.dateObjectsValidate = {
            invoiceAnnivDate: false,
            nextAPIDate: false,
            contractRenewalDate: false,
            contractExpiryDate: false,
            minimumExpiryDate: false,
            mandateDate: false
        };
        this.clearDate = {
            invoiceAnnivDate: false,
            nextAPIDate: false,
            contractRenewalDate: false,
            contractExpiryDate: false,
            minimumExpiryDate: false,
            mandateDate: false
        };
        this.invoiceFrequencySearchComponent = InvoiceFrequencySearchComponent;
        this.invoiceFeeSearchComponent = InvoiceFeeSearchComponent;
        this.paymentTypeCodeComponent = PaymentSearchComponent;
        this.autoOpen = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.searchModalRoute = '';
        this.showHeader = true;
        this.showCloseButton = true;
        this.isInvoiceFrequencyEllipsisDisabled = true;
        this.isInvoiceFeeEllipsisDisabled = true;
        this.isPaymentTypeEllipsisDisabled = true;
        this.isDurationCodeDropdownDisabled = false;
        this.isMinimumDurationCodeDropdownsDisabled = false;
        this.isSubsequentDurationCodeDropdownDisabled = false;
        this.durationData = {};
        this.queryParamsContract = {
            action: '0',
            operation: 'Application/iCABSAContractMaintenance',
            module: 'contract',
            method: 'contract-management/maintenance',
            contentType: 'application/x-www-form-urlencoded',
            branchNumber: '',
            branchName: ''
        };
        this.contractDurationSelected = {
            id: '',
            text: ''
        };
        this.minimumDurationSelected = {
            id: '',
            text: ''
        };
        this.subsequentDurationSelected = {
            id: '',
            text: ''
        };
        this.queryContract = new URLSearchParams();
        this.queryLookUp = new URLSearchParams();
        this.fieldRequiredClone = {};
        this.fieldVisibilityClone = {};
        this.maintenanceBFormGroup = this.fb.group({
            InvoiceAnnivDate: [{ value: '', disabled: false }, Validators.required],
            NextAPIDate: [{ value: '', disabled: false }],
            InvoiceFrequencyCode: [{ value: '', disabled: true }],
            InvoiceFrequencyDesc: [{ value: '', disabled: true }],
            InvoiceFrequencyChargeInd: [{ value: '', disabled: true }],
            InvoiceFrequencyChargeValue: [{ value: '', disabled: true }],
            InvoiceFeeCode: [{ value: '', disabled: true }],
            InvoiceFeeDesc: [{ value: '', disabled: true }],
            VATExempt: [{ value: '', disabled: true }],
            AdvanceInvoiceInd: [{ value: '', disabled: true }],
            CreateRenewalInd: [{ value: '', disabled: true }],
            ContinuousInd: [{ value: '', disabled: true }],
            ContractRenewalDate: [{ value: '', disabled: true }],
            ContractDurationCode: [{ value: '', disabled: true }],
            ContractDurationDesc: [{ value: '', disabled: true }],
            ContractExpiryDate: [{ value: '', disabled: true }],
            MinimumDurationCode: [{ value: '', disabled: true }],
            MinimumDurationDesc: [{ value: '', disabled: true }],
            MinimumExpiryDate: [{ value: '', disabled: true }],
            SubsequentDurationCode: [{ value: '', disabled: true }],
            SubsequentDurationDesc: [{ value: '', disabled: true }],
            APIExemptInd: [{ value: '', disabled: true }],
            APIExemptText: [{ value: '', disabled: true }],
            InvoiceSuspendInd: [{ value: '', disabled: true }],
            InvoiceSuspendText: [{ value: '', disabled: true }],
            HPRLExemptInd: [{ value: '', disabled: true }],
            PaymentTypeCode: [{ value: '', disabled: true }],
            PaymentDesc: [{ value: '', disabled: true }],
            AuthorityCode: [{ value: '', disabled: true }],
            VADDMandateNumber: [{ value: '', disabled: true }],
            VADDBranchNumber: [{ value: '', disabled: true }],
            VADDApproved: [{ value: '', disabled: true }],
            MandateNumberAccount: [{ value: '', disabled: true }],
            Generate: [{ value: 'Generate', disabled: true }],
            MandateDate: [{ value: '', disabled: true }],
            BankAccountNumber: [{ value: '', disabled: true }],
            BankAccountSortCode: [{ value: '', disabled: true }],
            PaymentDueDay: [{ value: '', disabled: true }]
        });
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            if (data && data['action']) {
                _this.storeData = data;
                _this.sysCharParams = data['syschars'];
                switch (data['action']) {
                    case ContractActionTypes.SAVE_DATA:
                        if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                            _this.setFormData(data);
                        }
                        break;
                    case ContractActionTypes.SAVE_ACCOUNT:
                        break;
                    case ContractActionTypes.SAVE_MODE:
                        _this.mode = data['mode'];
                        _this.processForm();
                        break;
                    case ContractActionTypes.SAVE_SYSCHAR:
                        if (data['syschars']) {
                            _this.sysCharParams = data['syschars'];
                            _this.processSysChar();
                        }
                        break;
                    case ContractActionTypes.SAVE_PARAMS:
                        if (data && data['params']) {
                            _this.params = data['params'];
                            _this.inputParams = data['params'];
                        }
                        break;
                    case ContractActionTypes.SAVE_OTHER_PARAMS:
                        _this.otherParams = data['otherParams'];
                        if (_this.otherParams['SepaConfigInd'] === true) {
                            _this.fieldVisibility['vaddMandateNumber'] = false;
                            if (_this.sysCharParams['vSCEnableBankDetailEntry']) {
                                _this.fieldVisibility['bankAccountNumber'] = true;
                                _this.fieldVisibility['bankAccountSortCode'] = true;
                            }
                            else {
                                _this.fieldVisibility['bankAccountNumber'] = false;
                                _this.fieldVisibility['bankAccountSortCode'] = false;
                            }
                        }
                        else {
                            if (_this.sysCharParams && !_this.sysCharParams['vSCEnableLegacyMandate']) {
                                _this.fieldVisibility['vaddMandateNumber'] = false;
                            }
                            else {
                                _this.fieldVisibility['vaddMandateNumber'] = true;
                            }
                            _this.fieldVisibility['mandateNumberAccount'] = false;
                        }
                        _this.hideBankDetailsTab();
                        if (_this.otherParams['vDisableFields'].indexOf('MinimumDurationCode') > -1 && _this.storeData['params']['currentContractType'] === 'C') {
                            _this.fieldVisibility['minimumDurationCode'] = false;
                            _this.fieldVisibility['minimumExpiryDate'] = false;
                        }
                        if (_this.otherParams['vDisableFields'].indexOf('SubsequentDurationCode') > -1) {
                            _this.fieldVisibility['SubsequentDurationCode'] = false;
                            _this.fieldVisibility['SubsequentDurationDesc'] = false;
                        }
                        if (_this.otherParams['ReqAutoInvoiceFee'] && _this.storeData['params']['currentContractType'] === 'C') {
                            _this.fieldVisibility['invoiceFeeCode'] = false;
                        }
                        break;
                    case ContractActionTypes.SAVE_CODE:
                        break;
                    case ContractActionTypes.SAVE_SERVICE:
                        _this.translateSubscription = _this.storeData['services'].localeTranslateService.ajaxSource$.subscribe(function (event) {
                            if (event !== 0) {
                                _this.fetchTranslationContent();
                            }
                        });
                        break;
                    case ContractActionTypes.SAVE_FIELD:
                        _this.clearContractAddress();
                        if (_this.sysCharParams['vSCEnablePayTypeAtInvGroupLevel']) {
                            if (_this.storeData['fieldValue'].AccountNumber) {
                                _this.fieldVisibility.paymentTypeCode = false;
                                _this.fieldRequired.paymentTypeCode = false;
                                _this.isPaymentTypeEllipsisDisabled = true;
                            }
                            else {
                                _this.fieldVisibility.paymentTypeCode = true;
                                _this.fieldRequired.paymentTypeCode = true;
                                _this.isPaymentTypeEllipsisDisabled = false;
                            }
                        }
                        if (_this.storeData['fieldValue'].AccountNumber) {
                            _this.maintenanceBFormGroup.controls['VATExempt'].disable();
                        }
                        break;
                    case ContractActionTypes.SAVE_SENT_FROM_PARENT:
                        break;
                    case ContractActionTypes.LOOKUP:
                        _this.onInvoiceFrequecyBlur({});
                        _this.onPaymentTypeBlur({});
                        break;
                    case ContractActionTypes.PARENT_TO_CHILD_COMPONENT:
                        if (data['parentToChildComponent']) {
                            var contractExpiryDate = data['parentToChildComponent'].ContractExpiryDate;
                            if (contractExpiryDate) {
                                if (window['moment'](contractExpiryDate, 'DD/MM/YYYY', true).isValid()) {
                                    _this.contractExpiryDateDisplay = _this.utils.convertDateString(contractExpiryDate);
                                }
                                else {
                                    _this.contractExpiryDateDisplay = contractExpiryDate;
                                }
                                if (!_this.contractExpiryDateDisplay) {
                                    _this.contractExpiryDate = null;
                                }
                                else {
                                    _this.contractExpiryDate = new Date(_this.contractExpiryDateDisplay);
                                    if (!window['moment'](_this.contractExpiryDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                                        _this.contractExpiryDateDisplay = _this.utils.formatDate(new Date(_this.contractExpiryDateDisplay));
                                    }
                                }
                                _this.maintenanceBFormGroup.controls['ContractExpiryDate'].setValue(_this.contractExpiryDateDisplay);
                            }
                            var invoiceAnnivDate = data['parentToChildComponent'].InvoiceAnnivDate;
                            if (invoiceAnnivDate && !_this.storeData['mode'].updateMode) {
                                if (window['moment'](invoiceAnnivDate, 'DD/MM/YYYY', true).isValid()) {
                                    _this.invoiceAnnivDateDisplay = _this.utils.convertDateString(invoiceAnnivDate);
                                }
                                else {
                                    _this.invoiceAnnivDateDisplay = invoiceAnnivDate;
                                }
                                if (!_this.invoiceAnnivDateDisplay) {
                                    _this.invoiceAnnivDate = null;
                                }
                                else {
                                    _this.invoiceAnnivDate = new Date(_this.invoiceAnnivDateDisplay);
                                    if (!window['moment'](_this.invoiceAnnivDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                                        _this.invoiceAnnivDateDisplay = _this.utils.formatDate(new Date(_this.invoiceAnnivDateDisplay));
                                    }
                                }
                                _this.maintenanceBFormGroup.controls['InvoiceAnnivDate'].setValue(_this.invoiceAnnivDateDisplay);
                            }
                            var minimumExpiryDate = data['parentToChildComponent'].MinimumExpiryDate;
                            if (minimumExpiryDate) {
                                if (window['moment'](minimumExpiryDate, 'DD/MM/YYYY', true).isValid()) {
                                    _this.minimumExpiryDateDisplay = _this.utils.convertDateString(minimumExpiryDate);
                                }
                                else {
                                    _this.minimumExpiryDateDisplay = minimumExpiryDate;
                                }
                                if (!_this.minimumExpiryDateDisplay) {
                                    _this.minimumExpiryDate = null;
                                }
                                else {
                                    _this.minimumExpiryDate = new Date(_this.minimumExpiryDateDisplay);
                                    if (!window['moment'](_this.minimumExpiryDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                                        _this.minimumExpiryDateDisplay = _this.utils.formatDate(new Date(_this.minimumExpiryDateDisplay));
                                    }
                                }
                                _this.maintenanceBFormGroup.controls['MinimumExpiryDate'].setValue(_this.minimumExpiryDateDisplay);
                            }
                        }
                        if (_this.storeData['mode'].addMode && _this.otherParams && _this.storeData['formGroup'].main.controls['AccountNumber'].value !== '') {
                            _this.otherParams['MandateRequired'] = data['parentToChildComponent'] ? data['parentToChildComponent'].MandateRequired : false;
                            _this.mandateRequiredChange();
                        }
                        break;
                    case ContractActionTypes.VALIDATE_FORMS:
                        if (data['validate'].typeB) {
                            _this.validateForm();
                        }
                        break;
                    case ContractActionTypes.FORM_RESET:
                        _this.fieldRequired = JSON.parse(JSON.stringify(_this.fieldRequiredClone));
                        _this.fieldVisibility = JSON.parse(JSON.stringify(_this.fieldVisibilityClone));
                        _this.storeData['fieldRequired'].typeB = _this.fieldRequired;
                        _this.storeData['fieldVisibility'].typeB = _this.fieldVisibility;
                        for (var i in _this.maintenanceBFormGroup.controls) {
                            if (_this.maintenanceBFormGroup.controls.hasOwnProperty(i)) {
                                _this.maintenanceBFormGroup.controls[i].clearValidators();
                            }
                        }
                        _this.maintenanceBFormGroup.controls['InvoiceAnnivDate'].setValidators(Validators.required);
                        _this.maintenanceBFormGroup.reset();
                        break;
                    default:
                        break;
                }
            }
        });
    }
    MaintenanceTypeBComponent.prototype.ngOnInit = function () {
    };
    MaintenanceTypeBComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.store.dispatch({
            type: ContractActionTypes.FORM_GROUP, payload: {
                typeB: this.maintenanceBFormGroup
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.SAVE_REQUIRED_FIELD, payload: {
                typeB: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                typeB: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.INITIALIZATION, payload: {
                typeB: true
            }
        });
        setTimeout(function () {
            if (_this.storeData && _this.storeData['data'] && !(Object.keys(_this.storeData['data']).length === 0 && _this.storeData['data'].constructor === Object)) {
                _this.setFormData(_this.storeData);
            }
        }, 0);
        this.fieldRequiredClone = JSON.parse(JSON.stringify(this.fieldRequired));
        this.fieldVisibilityClone = JSON.parse(JSON.stringify(this.fieldVisibility));
    };
    MaintenanceTypeBComponent.prototype.ngOnDestroy = function () {
        this.storeSubscription.unsubscribe();
        if (this.querySubscription)
            this.querySubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    MaintenanceTypeBComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('Generate', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    if (_this.maintenanceBFormGroup.controls['Generate'])
                        _this.maintenanceBFormGroup.controls['Generate'].setValue(res);
                }
            });
        });
    };
    MaintenanceTypeBComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.storeData['services'].translate.get(key, { value: params });
        }
        else {
            return this.storeData['services'].translate.get(key);
        }
    };
    MaintenanceTypeBComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    };
    MaintenanceTypeBComponent.prototype.onInvoiceFrequecyBlur = function (event) {
        var _this = this;
        if (this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'] && this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].value !== '') {
            var data = [{
                    'table': 'SystemInvoiceFrequency',
                    'query': { 'InvoiceFrequencyCode': this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'] ? this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].value : '' },
                    'fields': ['InvoiceFrequencyCode', 'InvoiceFrequencyDesc']
                }];
            this.lookUpRecord(data, 5).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        _this.maintenanceBFormGroup.controls['InvoiceFrequencyDesc'].setValue(e['results'][0][0]['InvoiceFrequencyDesc']);
                    }
                    else {
                        _this.maintenanceBFormGroup.controls['InvoiceFrequencyDesc'].setValue('');
                        _this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].setErrors({});
                    }
                }
                else {
                    _this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].setErrors({});
                }
            }, function (error) {
            });
            var functionName = '';
            var params = {};
            if (this.storeData['params']['currentContractType'] === 'C') {
                functionName = 'GetInvoiceFrequencyCharge';
            }
            this.fetchContractData(functionName, { action: '6', InvoiceFrequencyCode: this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].value }).subscribe(function (e) {
                if (e.status === GlobalConstant.Configuration.Failure) {
                }
                else {
                    if (e.InvoiceFrequencyChargeInd) {
                        if (e.InvoiceFrequencyChargeInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                            _this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeInd'].setValue(true);
                            _this.fieldVisibility.invoiceFrequencyChargeValue = true;
                        }
                        else {
                            _this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeInd'].setValue(false);
                            _this.fieldVisibility.invoiceFrequencyChargeValue = false;
                        }
                    }
                    else {
                        _this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeInd'].setValue(false);
                        _this.fieldVisibility.invoiceFrequencyChargeValue = false;
                    }
                    _this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeValue'].setValue(e.InvoiceFrequencyChargeValue ? e.InvoiceFrequencyChargeValue : '');
                }
            }, function (error) {
            });
        }
    };
    MaintenanceTypeBComponent.prototype.onInvoiceFeeBlur = function (event) {
        var _this = this;
        if (this.maintenanceBFormGroup.controls['InvoiceFeeCode'] && this.maintenanceBFormGroup.controls['InvoiceFeeCode'].value !== '') {
            var data = [{
                    'table': 'InvoiceFee',
                    'query': { 'InvoiceFeeCode': this.maintenanceBFormGroup.controls['InvoiceFeeCode'] ? this.maintenanceBFormGroup.controls['InvoiceFeeCode'].value : '' },
                    'fields': ['InvoiceFeeCode', 'InvoiceFeeDesc']
                }];
            this.lookUpRecord(data, 5).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        _this.maintenanceBFormGroup.controls['InvoiceFeeDesc'].setValue(e['results'][0][0]['InvoiceFeeDesc']);
                    }
                    else {
                        _this.maintenanceBFormGroup.controls['InvoiceFeeDesc'].setValue('');
                        _this.maintenanceBFormGroup.controls['InvoiceFeeCode'].setErrors({});
                    }
                }
                else {
                    _this.maintenanceBFormGroup.controls['InvoiceFeeCode'].setErrors({});
                }
            }, function (error) {
            });
        }
    };
    MaintenanceTypeBComponent.prototype.onPaymentTypeBlur = function (event) {
        var _this = this;
        if (this.maintenanceBFormGroup.controls['PaymentTypeCode'] && this.maintenanceBFormGroup.controls['PaymentTypeCode'].value !== null) {
            var upperCaseVal = this.maintenanceBFormGroup.controls['PaymentTypeCode'].value.toUpperCase();
            this.maintenanceBFormGroup.controls['PaymentTypeCode'].setValue(upperCaseVal);
            if (this.maintenanceBFormGroup.controls['PaymentTypeCode'] && this.maintenanceBFormGroup.controls['PaymentTypeCode'].value !== '') {
                var data = [{
                        'table': 'PaymentType',
                        'query': { 'PaymentTypeCode': this.maintenanceBFormGroup.controls['PaymentTypeCode'] ? this.maintenanceBFormGroup.controls['PaymentTypeCode'].value : '' },
                        'fields': ['PaymentTypeCode', 'PaymentDesc']
                    }];
                this.lookUpRecord(data, 5).subscribe(function (e) {
                    if (e['results'] && e['results'].length > 0) {
                        if (e['results'][0].length > 0) {
                            _this.maintenanceBFormGroup.controls['PaymentDesc'].setValue(e['results'][0][0]['PaymentDesc']);
                            _this.fetchMandatePaymentTypeDetails(_this.maintenanceBFormGroup.controls['PaymentTypeCode'].value);
                        }
                        else {
                            _this.maintenanceBFormGroup.controls['PaymentDesc'].setValue('');
                            _this.maintenanceBFormGroup.controls['PaymentTypeCode'].setErrors({});
                        }
                    }
                    else {
                        _this.maintenanceBFormGroup.controls['PaymentTypeCode'].setErrors({});
                    }
                }, function (error) {
                });
            }
        }
    };
    MaintenanceTypeBComponent.prototype.onMinimumDurationBlur = function (event) {
        var _this = this;
        if (this.maintenanceBFormGroup.controls['MinimumDurationCode'] && this.maintenanceBFormGroup.controls['MinimumDurationCode'].value !== '') {
            var data = [{
                    'table': 'ContractDuration',
                    'query': { 'ContractDurationCode': this.maintenanceBFormGroup.controls['MinimumDurationCode'] ? this.maintenanceBFormGroup.controls['MinimumDurationCode'].value : '' },
                    'fields': ['ContractDurationCode', 'ContractDurationDesc']
                }];
            this.lookUpRecord(data, 5).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        _this.maintenanceBFormGroup.controls['MinimumDurationDesc'].setValue(e['results'][0][0]['ContractDurationDesc']);
                    }
                    else {
                        _this.maintenanceBFormGroup.controls['MinimumDurationDesc'].setValue('');
                        _this.maintenanceBFormGroup.controls['MinimumDurationCode'].setErrors({});
                    }
                }
                else {
                    _this.maintenanceBFormGroup.controls['MinimumDurationCode'].setErrors({});
                }
            }, function (error) {
            });
        }
    };
    MaintenanceTypeBComponent.prototype.onContractDurationBlur = function (event) {
        var _this = this;
        if (this.maintenanceBFormGroup.controls['ContractDurationCode'] && this.maintenanceBFormGroup.controls['ContractDurationCode'].value !== '') {
            var data = [{
                    'table': 'ContractDuration',
                    'query': { 'ContractDurationCode': this.maintenanceBFormGroup.controls['ContractDurationCode'] ? this.maintenanceBFormGroup.controls['ContractDurationCode'].value : '' },
                    'fields': ['ContractDurationCode', 'ContractDurationDesc']
                }];
            this.lookUpRecord(data, 5).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        _this.maintenanceBFormGroup.controls['ContractDurationDesc'].setValue(e['results'][0][0]['ContractDurationDesc']);
                    }
                    else {
                        _this.maintenanceBFormGroup.controls['ContractDurationDesc'].setValue('');
                        _this.maintenanceBFormGroup.controls['MinimumDurationCode'].setErrors({});
                    }
                }
                else {
                    _this.maintenanceBFormGroup.controls['ContractDurationCode'].setErrors({});
                }
            }, function (error) {
            });
        }
    };
    MaintenanceTypeBComponent.prototype.onSubsequentDurationBlur = function (event) {
        var _this = this;
        if (this.maintenanceBFormGroup.controls['SubsequentDurationCode'] && this.maintenanceBFormGroup.controls['SubsequentDurationCode'].value !== '') {
            var data = [{
                    'table': 'ContractDuration',
                    'query': { 'ContractDurationCode': this.maintenanceBFormGroup.controls['SubsequentDurationCode'] ? this.maintenanceBFormGroup.controls['SubsequentDurationCode'].value : '' },
                    'fields': ['ContractDurationCode', 'ContractDurationDesc']
                }];
            this.lookUpRecord(data, 5).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        _this.maintenanceBFormGroup.controls['SubsequentDurationDesc'].setValue(e['results'][0][0]['ContractDurationDesc']);
                    }
                    else {
                        _this.maintenanceBFormGroup.controls['SubsequentDurationDesc'].setValue('');
                        _this.maintenanceBFormGroup.controls['MinimumDurationCode'].setErrors({});
                    }
                }
                else {
                    _this.maintenanceBFormGroup.controls['SubsequentDurationCode'].setErrors({});
                }
            }, function (error) {
            });
        }
    };
    MaintenanceTypeBComponent.prototype.fetchDurationData = function (returnSubscription) {
        var _this = this;
        var method = 'contract-management/search';
        var module = 'duration';
        var operation = 'Business/iCABSBContractDurationSearch';
        var search = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
        if (returnSubscription === true) {
            return this.httpService.makeGetRequest(method, module, operation, search);
        }
        else {
            this.httpService.makeGetRequest(method, module, operation, search).subscribe(function (data) {
                _this.durationData = data.records;
                if (_this.mode['addMode']) {
                    _this.setDefaultMinimumDuration();
                    _this.setDefaultSubsequentDuration();
                }
            });
        }
    };
    MaintenanceTypeBComponent.prototype.setDefaultMinimumDuration = function () {
        if (this.sysCharParams['vSCEnableMinimumDuration'] && this.storeData['params']['currentContractType'] === 'C') {
            this.maintenanceBFormGroup.controls['MinimumDurationCode'].setValue(this.sysCharParams['vSCMinimumDuration']);
            for (var i = 0; i < this.durationData.length; i++) {
                if (this.sysCharParams['vSCMinimumDuration'] === this.durationData[i].ContractDurationCode) {
                    this.minimumDurationSelected = {
                        id: this.sysCharParams['vSCMinimumDuration'],
                        text: this.sysCharParams['vSCMinimumDuration'] + ' - ' + this.durationData[i].ContractDurationDesc
                    };
                    break;
                }
            }
            this.isMinimumDurationCodeDropdownsDisabled = false;
        }
    };
    MaintenanceTypeBComponent.prototype.setDefaultSubsequentDuration = function () {
        for (var i = 0; i < this.durationData.length; i++) {
            if (this.sysCharParams['vSCSubsequentDuration'] === this.durationData[i].ContractDurationCode) {
                this.subsequentDurationSelected = {
                    id: this.sysCharParams['vSCSubsequentDuration'],
                    text: this.sysCharParams['vSCSubsequentDuration'] + ' - ' + this.durationData[i].ContractDurationDesc
                };
                break;
            }
        }
    };
    MaintenanceTypeBComponent.prototype.onInvoiceFrequencyChargeChange = function (event) {
        if (event.target.checked) {
            this.fieldVisibility.invoiceFrequencyChargeValue = true;
        }
        else {
            this.fieldVisibility.invoiceFrequencyChargeValue = false;
        }
    };
    MaintenanceTypeBComponent.prototype.validateForm = function () {
        var _this = this;
        for (var j in this.fieldVisibility) {
            if (this.fieldVisibility.hasOwnProperty(j)) {
                var key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.maintenanceBFormGroup.controls[key]) {
                        this.maintenanceBFormGroup.controls[key].clearValidators();
                    }
                }
            }
        }
        for (var i in this.maintenanceBFormGroup.controls) {
            if (this.maintenanceBFormGroup.controls.hasOwnProperty(i)) {
                this.maintenanceBFormGroup.controls[i].markAsTouched();
            }
        }
        var formValid = null;
        if (this.fieldRequired.invoiceAnnivDate && this.fieldVisibility.invoiceAnnivDate && this.invoiceAnnivDateDisplay === '') {
            formValid = false;
        }
        if (this.fieldRequired.contractExpiryDate && this.fieldVisibility.contractExpiryDate && this.contractExpiryDateDisplay === '') {
            formValid = false;
        }
        if (this.fieldRequired.contractRenewalDate && this.fieldVisibility.contractRenewalDate && this.contractRenewalDateDisplay === '') {
            formValid = false;
        }
        if (this.fieldRequired.minimumExpiryDate && this.fieldVisibility.minimumExpiryDate && this.minimumExpiryDateDisplay === '') {
            formValid = false;
        }
        if (this.fieldRequired.mandateDate && this.fieldVisibility.mandateDate && this.mandateDateDisplay === '') {
            formValid = false;
        }
        if (!this.maintenanceBFormGroup.enabled) {
            formValid = true;
        }
        this.dateObjectsValidate['invoiceAnnivDate'] = true;
        this.dateObjectsValidate['nextAPIDate'] = true;
        this.dateObjectsValidate['contractRenewalDate'] = true;
        this.dateObjectsValidate['contractExpiryDate'] = true;
        this.dateObjectsValidate['minimumExpiryDate'] = true;
        this.dateObjectsValidate['mandateDate'] = true;
        setTimeout(function () {
            _this.setDefaultDateValidate();
        }, 100);
        if (!this.fieldVisibility.invoiceAnnivDate) {
            this.invoiceAnnivDateDisplay = '';
            this.maintenanceBFormGroup.controls['InvoiceAnnivDate'].setValue('');
            this.maintenanceBFormGroup.controls['InvoiceAnnivDate'].clearValidators();
        }
        if (!this.fieldVisibility.contractExpiryDate) {
            this.contractExpiryDateDisplay = '';
            this.maintenanceBFormGroup.controls['ContractExpiryDate'].setValue('');
            this.maintenanceBFormGroup.controls['ContractExpiryDate'].clearValidators();
        }
        if (!this.fieldVisibility.contractRenewalDate) {
            this.contractRenewalDateDisplay = '';
            this.maintenanceBFormGroup.controls['ContractRenewalDate'].setValue('');
            this.maintenanceBFormGroup.controls['ContractRenewalDate'].clearValidators();
        }
        if (!this.fieldVisibility.minimumExpiryDate) {
            this.minimumExpiryDateDisplay = '';
            this.maintenanceBFormGroup.controls['MinimumExpiryDate'].setValue('');
            this.maintenanceBFormGroup.controls['MinimumExpiryDate'].clearValidators();
        }
        if (!this.fieldVisibility.mandateDate) {
            this.mandateDateDisplay = '';
            this.maintenanceBFormGroup.controls['MandateDate'].setValue('');
            this.maintenanceBFormGroup.controls['MandateDate'].clearValidators();
        }
        this.maintenanceBFormGroup.updateValueAndValidity();
        if (formValid === null) {
            formValid = this.maintenanceBFormGroup.valid;
        }
        this.store.dispatch({
            type: ContractActionTypes.FORM_GROUP, payload: {
                typeB: this.maintenanceBFormGroup
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.SAVE_REQUIRED_FIELD, payload: {
                typeB: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                typeB: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.FORM_VALIDITY, payload: {
                typeB: formValid
            }
        });
    };
    MaintenanceTypeBComponent.prototype.setDefaultDateValidate = function () {
        this.dateObjectsValidate['invoiceAnnivDate'] = false;
        this.dateObjectsValidate['nextAPIDate'] = false;
        this.dateObjectsValidate['contractRenewalDate'] = false;
        this.dateObjectsValidate['contractExpiryDate'] = false;
        this.dateObjectsValidate['minimumExpiryDate'] = false;
        this.dateObjectsValidate['mandateDate'] = false;
    };
    MaintenanceTypeBComponent.prototype.processSysChar = function () {
        this.maintenanceBFormGroup.controls['Generate'].disable();
        this.maintenanceBFormGroup.controls['AuthorityCode'].enable();
        this.fieldRequired.continuousInd = true;
        this.maintenanceBFormGroup.controls['InvoiceSuspendInd'].disable();
        this.maintenanceBFormGroup.controls['InvoiceSuspendInd'].setValue(false);
        this.maintenanceBFormGroup.controls['InvoiceSuspendText'].disable();
        this.maintenanceBFormGroup.controls['PaymentDueDay'].disable();
        if (this.sysCharParams['vSCAutoCreateRenewalProspect']) {
            this.fieldVisibility.createRenewalInd = true;
        }
        else {
            this.fieldVisibility.createRenewalInd = false;
        }
        if (this.sysCharParams['vSCEnableHPRLExempt']) {
            this.fieldVisibility.hprlExemptInd = true;
        }
        else {
            this.fieldVisibility.hprlExemptInd = false;
        }
        if (this.sysCharParams['vSCDisplayContractPaymentDueDay']) {
            this.fieldVisibility.paymentDueDay = true;
        }
        else {
            this.fieldVisibility.paymentDueDay = false;
        }
        if (this.sysCharParams['vSCEnableTaxCodeDefaulting']) {
            this.fieldVisibility.vatExempt = true;
        }
        else {
            this.fieldVisibility.vatExempt = false;
        }
        if (this.sysCharParams['vSCEnableTaxCodeDefaulting']) {
            if (this.storeData['mode']['addMode']) {
                this.maintenanceBFormGroup.controls['VATExempt'].disable();
            }
            else {
                this.maintenanceBFormGroup.controls['VATExempt'].enable();
            }
        }
        if (this.sysCharParams['vSCEnableInvoiceFee']) {
            this.maintenanceBFormGroup.controls['InvoiceFeeCode'].enable();
        }
        else {
            this.maintenanceBFormGroup.controls['InvoiceFeeCode'].disable();
        }
        if (this.params && this.params['currentContractType'] === 'C') {
            if (this.sysCharParams['vSCEnableInvoiceFee']) {
                this.isInvoiceFeeEllipsisDisabled = false;
            }
            else {
                this.isInvoiceFeeEllipsisDisabled = true;
            }
            if (this.sysCharParams['vSCEnableMinimumDuration']) {
                this.isMinimumDurationCodeDropdownsDisabled = false;
                this.fieldVisibility['minimumDurationCode'] = false;
                this.fieldVisibility['minimumExpiryDate'] = false;
            }
            else {
                this.isMinimumDurationCodeDropdownsDisabled = true;
                this.fieldVisibility['minimumDurationCode'] = true;
                this.fieldVisibility['minimumExpiryDate'] = true;
            }
            this.fieldVisibility.contractDurationCode = true;
            this.fieldVisibility.minimumDurationCode = true;
        }
        else {
            this.fieldVisibility.contractDurationCode = false;
            this.fieldVisibility.minimumDurationCode = false;
        }
        this.hideBankDetailsTab();
        this.fieldVisibility.mandateNumberAccount = false;
        this.maintenanceBFormGroup.controls['MandateNumberAccount'].clearValidators();
        this.checkJobProductSalesParams();
    };
    MaintenanceTypeBComponent.prototype.checkJobProductSalesParams = function () {
        if (this.storeData['params']) {
            if (this.storeData['params']['currentContractType'] === 'J' || this.storeData['params']['currentContractType'] === 'P' || !this.sysCharParams['vSCEnableMinimumDuration']) {
                this.fieldVisibility['minimumDurationCode'] = false;
                this.fieldVisibility['minimumExpiryDate'] = false;
            }
            else {
                this.fieldVisibility['minimumDurationCode'] = true;
                this.fieldVisibility['minimumExpiryDate'] = true;
            }
            if (this.storeData['params']['currentContractType'] === 'J' || this.storeData['params']['currentContractType'] === 'P' || !this.sysCharParams['vSCEnableSubsequentDuration']) {
                this.fieldVisibility['subsequentDurationCode'] = false;
            }
            else {
                this.fieldVisibility['subsequentDurationCode'] = true;
            }
            if (this.storeData['params']['currentContractType'] === 'J' || this.storeData['params']['currentContractType'] === 'P') {
                this.fieldVisibility['continuousInd'] = false;
                this.fieldVisibility['invoiceAnnivDate'] = false;
                this.fieldVisibility['advanceInvoiceInd'] = false;
                this.fieldVisibility['contractDurationCode'] = false;
                this.fieldVisibility['invoiceFrequencyCode'] = false;
                this.fieldVisibility['invoiceFrequencyChargeInd'] = false;
                this.fieldVisibility['contractRenewalDate'] = false;
                this.fieldVisibility['createRenewalInd'] = false;
                this.fieldVisibility['nextAPIDate'] = false;
                this.fieldVisibility['contractRenewalDate'] = false;
                this.fieldVisibility['createRenewalInd'] = false;
                this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].setValue(1);
                this.maintenanceBFormGroup.controls['ContinuousInd'].setValue(false);
                this.maintenanceBFormGroup.controls['AdvanceInvoiceInd'].setValue(false);
            }
            if (this.storeData['params']['currentContractType'] === 'P') {
                this.fieldVisibility['contractExpiryDate'] = false;
                this.fieldVisibility['subsequentDurationCode'] = false;
            }
            else {
                if (this.storeData['params']['currentContractType'] === 'J') {
                    this.fieldVisibility['contractExpiryDate'] = true;
                    this.fieldRequired.contractExpiryDate = true;
                }
            }
            if (this.storeData['params']['currentContractType'] === 'C') {
                this.fieldRequired.invoiceAnnivDate = true;
                this.fieldRequired.advanceInvoiceInd = true;
                this.fieldRequired.InvoiceFrequencyChargeInd = false;
                this.fieldRequired.InvoiceFrequencyChargeValue = false;
                if (this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeValue'])
                    this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeValue'].clearValidators();
                this.maintenanceBFormGroup.controls['APIExemptInd'].disable();
                this.maintenanceBFormGroup.controls['APIExemptText'].disable();
                this.dateObjectsEnabled['nextAPIDate'] = false;
            }
        }
    };
    MaintenanceTypeBComponent.prototype.setFormData = function (data) {
        var _this = this;
        if (data['data'].ContractRenewalDate) {
            this.clearDate['contractRenewalDate'] = false;
            if (window['moment'](data['data'].ContractRenewalDate, 'DD/MM/YYYY', true).isValid()) {
                this.contractRenewalDateDisplay = this.utils.convertDateString(data['data'].ContractRenewalDate);
            }
            else {
                this.contractRenewalDateDisplay = data['data'].ContractRenewalDate;
            }
        }
        else {
            this.contractRenewalDateDisplay = null;
        }
        if (!this.contractRenewalDateDisplay) {
            if (data['data'].ContractRenewalDate === '') {
                setTimeout(function () {
                    _this.clearDate['contractRenewalDate'] = true;
                }, 400);
            }
            this.contractRenewalDate = null;
        }
        else {
            this.clearDate['contractRenewalDate'] = false;
            this.contractRenewalDate = new Date(this.contractRenewalDateDisplay);
            if (!window['moment'](this.contractRenewalDateDisplay, 'DD/MM/YYYY', true).isValid()) {
            }
        }
        this.maintenanceBFormGroup.controls['ContractRenewalDate'].setValue(data['data'].ContractRenewalDate);
        if (!this.storeData['data']['isCopyClicked']) {
            this.clearDate['invoiceAnnivDate'] = false;
            if (data['data'].InvoiceAnnivDate) {
                if (window['moment'](data['data'].InvoiceAnnivDate, 'DD/MM/YYYY', true).isValid()) {
                    this.invoiceAnnivDateDisplay = this.utils.convertDateString(data['data'].InvoiceAnnivDate);
                }
                else {
                    this.invoiceAnnivDateDisplay = data['data'].InvoiceAnnivDate;
                }
            }
            else {
                this.invoiceAnnivDateDisplay = null;
            }
            if (!this.invoiceAnnivDateDisplay) {
                if (data['data'].InvoiceAnnivDate === '') {
                    setTimeout(function () {
                        _this.clearDate['invoiceAnnivDate'] = true;
                    }, 400);
                }
                this.invoiceAnnivDate = null;
            }
            else {
                this.clearDate['invoiceAnnivDate'] = false;
                this.invoiceAnnivDate = new Date(this.invoiceAnnivDateDisplay);
                if (!window['moment'](this.invoiceAnnivDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                    this.invoiceAnnivDateDisplay = this.utils.formatDate(new Date(this.invoiceAnnivDateDisplay));
                }
            }
            this.maintenanceBFormGroup.controls['InvoiceAnnivDate'].setValue(data['data'].InvoiceAnnivDate);
            this.clearDate['nextAPIDate'] = false;
            if (data['data'].NextAPIDate) {
                if (window['moment'](data['data'].NextAPIDate, 'DD/MM/YYYY', true).isValid()) {
                    this.nextAPIDateDisplay = this.utils.convertDateString(data['data'].NextAPIDate);
                }
                else {
                    this.nextAPIDateDisplay = data['data'].NextAPIDate;
                }
            }
            else {
                this.nextAPIDateDisplay = null;
            }
            if (!this.nextAPIDateDisplay) {
                if (data['data'].NextAPIDate === '') {
                    setTimeout(function () {
                        _this.clearDate['nextAPIDate'] = true;
                    }, 400);
                }
                this.nextAPIDate = null;
            }
            else {
                this.clearDate['nextAPIDate'] = false;
                this.nextAPIDate = new Date(this.nextAPIDateDisplay);
                if (!window['moment'](this.nextAPIDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                    this.nextAPIDateDisplay = this.utils.formatDate(new Date(this.nextAPIDateDisplay));
                }
            }
            this.maintenanceBFormGroup.controls['NextAPIDate'].setValue(data['data'].NextAPIDate);
            this.clearDate['contractExpiryDate'] = false;
            if (data['data'].ContractExpiryDate) {
                if (window['moment'](data['data'].ContractExpiryDate, 'DD/MM/YYYY', true).isValid()) {
                    this.contractExpiryDateDisplay = this.utils.convertDateString(data['data'].ContractExpiryDate);
                }
                else {
                    this.contractExpiryDateDisplay = data['data'].ContractExpiryDate;
                }
            }
            else {
                this.contractExpiryDateDisplay = null;
            }
            if (!this.contractExpiryDateDisplay) {
                if (data['data'].ContractExpiryDate === '') {
                    setTimeout(function () {
                        _this.clearDate['contractExpiryDate'] = true;
                    }, 400);
                }
                this.contractExpiryDate = null;
            }
            else {
                this.clearDate['contractExpiryDate'] = false;
                this.contractExpiryDate = new Date(this.contractExpiryDateDisplay);
                if (!window['moment'](this.contractExpiryDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                    this.contractExpiryDateDisplay = this.utils.formatDate(new Date(this.contractExpiryDateDisplay));
                }
            }
            this.maintenanceBFormGroup.controls['ContractExpiryDate'].setValue(data['data'].ContractExpiryDate);
            this.clearDate['minimumExpiryDate'] = false;
            if (data['data'].MinimumExpiryDate) {
                if (window['moment'](data['data'].MinimumExpiryDate, 'DD/MM/YYYY', true).isValid()) {
                    this.minimumExpiryDateDisplay = this.utils.convertDateString(data['data'].MinimumExpiryDate);
                }
                else {
                    this.minimumExpiryDateDisplay = data['data'].MinimumExpiryDate;
                }
            }
            else {
                this.minimumExpiryDateDisplay = null;
            }
            if (!this.minimumExpiryDateDisplay) {
                if (data['data'].MinimumExpiryDate === '') {
                    setTimeout(function () {
                        _this.clearDate['minimumExpiryDate'] = true;
                    }, 400);
                }
                this.minimumExpiryDate = null;
            }
            else {
                this.clearDate['minimumExpiryDate'] = false;
                this.minimumExpiryDate = new Date(this.minimumExpiryDateDisplay);
                if (!window['moment'](this.minimumExpiryDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                    this.minimumExpiryDateDisplay = this.utils.formatDate(new Date(this.minimumExpiryDateDisplay));
                }
            }
            this.maintenanceBFormGroup.controls['MinimumExpiryDate'].setValue(data['data'].MinimumExpiryDate);
            this.maintenanceBFormGroup.controls['PaymentTypeCode'].setValue(data['data'].PaymentTypeCode);
            this.maintenanceBFormGroup.controls['PaymentDesc'].setValue('');
            if (data['data'].ContinuousInd) {
                if (data['data'].ContinuousInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                    this.maintenanceBFormGroup.controls['ContinuousInd'].setValue(true);
                }
                else {
                    this.maintenanceBFormGroup.controls['ContinuousInd'].setValue(false);
                }
            }
            else {
                this.maintenanceBFormGroup.controls['ContinuousInd'].setValue(false);
            }
        }
        this.clearDate['mandateDate'] = false;
        if (data['data'].MandateDate) {
            if (window['moment'](data['data'].MandateDate, 'DD/MM/YYYY', true).isValid()) {
                this.mandateDateDisplay = this.utils.convertDateString(data['data'].MandateDate);
            }
            else {
                this.mandateDateDisplay = data['data'].MandateDate;
            }
        }
        else {
            this.mandateDateDisplay = null;
        }
        if (!this.mandateDateDisplay) {
            this.mandateDate = null;
        }
        else {
            this.clearDate['mandateDate'] = false;
            this.mandateDate = new Date(this.mandateDateDisplay);
            if (!window['moment'](this.mandateDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                this.mandateDateDisplay = this.utils.formatDate(new Date(this.mandateDateDisplay));
            }
        }
        this.maintenanceBFormGroup.controls['MandateDate'].setValue(data['data'].MandateDate);
        this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].setValue(data['data'].InvoiceFrequencyCode);
        this.maintenanceBFormGroup.controls['InvoiceFrequencyDesc'].setValue(data['data'].InvoiceFrequencyDesc);
        if (data['data'].InvoiceFrequencyChargeInd) {
            if (data['data'].InvoiceFrequencyChargeInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeInd'].setValue(true);
            }
            else {
                this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeInd'].setValue(false);
            }
        }
        else {
            this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeInd'].setValue(false);
        }
        this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeValue'].setValue(data['data'].InvoiceFrequencyChargeValue);
        this.maintenanceBFormGroup.controls['InvoiceFeeCode'].setValue(data['data'].InvoiceFeeCode);
        this.maintenanceBFormGroup.controls['InvoiceFeeDesc'].setValue('');
        if (data['data'].VATExempt) {
            if (data['data'].VATExempt.toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.maintenanceBFormGroup.controls['VATExempt'].setValue(true);
            }
            else {
                this.maintenanceBFormGroup.controls['VATExempt'].setValue(false);
            }
        }
        else {
            this.maintenanceBFormGroup.controls['VATExempt'].setValue(false);
        }
        if (data['data'].AdvanceInvoiceInd) {
            if (data['data'].AdvanceInvoiceInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.maintenanceBFormGroup.controls['AdvanceInvoiceInd'].setValue(true);
            }
            else {
                this.maintenanceBFormGroup.controls['AdvanceInvoiceInd'].setValue(false);
            }
        }
        else {
            this.maintenanceBFormGroup.controls['AdvanceInvoiceInd'].setValue(false);
        }
        if (data['data'].CreateRenewalInd) {
            if (data['data'].CreateRenewalInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.maintenanceBFormGroup.controls['CreateRenewalInd'].setValue(true);
            }
            else {
                this.maintenanceBFormGroup.controls['CreateRenewalInd'].setValue(false);
            }
        }
        else {
            this.maintenanceBFormGroup.controls['CreateRenewalInd'].setValue(false);
        }
        if (data['data'].APIExemptInd) {
            if (data['data'].APIExemptInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.maintenanceBFormGroup.controls['APIExemptInd'].setValue(true);
                this.fieldVisibility.apiExemptInd = true;
            }
            else {
                this.maintenanceBFormGroup.controls['APIExemptInd'].setValue(false);
                this.fieldVisibility.apiExemptInd = false;
            }
        }
        else {
            this.maintenanceBFormGroup.controls['APIExemptInd'].setValue(false);
        }
        if (data['data'].InvoiceSuspendInd) {
            if (data['data'].InvoiceSuspendInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.maintenanceBFormGroup.controls['InvoiceSuspendInd'].setValue(true);
            }
            else {
                this.maintenanceBFormGroup.controls['InvoiceSuspendInd'].setValue(false);
            }
        }
        else {
            this.maintenanceBFormGroup.controls['InvoiceSuspendInd'].setValue(false);
        }
        if (data['data'].HPRLExemptInd) {
            if (data['data'].HPRLExemptInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.maintenanceBFormGroup.controls['HPRLExemptInd'].setValue(true);
            }
            else {
                this.maintenanceBFormGroup.controls['HPRLExemptInd'].setValue(false);
            }
        }
        else {
            this.maintenanceBFormGroup.controls['HPRLExemptInd'].setValue(false);
        }
        this.fetchDurationData(true).subscribe(function (records) {
            _this.durationData = records.records;
            _this.maintenanceBFormGroup.controls['ContractDurationCode'].setValue(data['data'].ContractDurationCode);
            _this.maintenanceBFormGroup.controls['ContractDurationDesc'].setValue('');
            _this.contractDurationSelected = {
                id: '',
                text: data['data'].ContractDurationCode + ' - ' + _this.fetchDurationDesc(data['data'].ContractDurationCode)
            };
            _this.maintenanceBFormGroup.controls['MinimumDurationCode'].setValue(data['data'].MinimumDurationCode);
            _this.maintenanceBFormGroup.controls['MinimumDurationDesc'].setValue('');
            _this.minimumDurationSelected = {
                id: '',
                text: data['data'].MinimumDurationCode + ' - ' + _this.fetchDurationDesc(data['data'].MinimumDurationCode)
            };
            _this.maintenanceBFormGroup.controls['SubsequentDurationCode'].setValue(data['data'].SubsequentDurationCode);
            _this.maintenanceBFormGroup.controls['SubsequentDurationDesc'].setValue('');
            _this.subsequentDurationSelected = {
                id: '',
                text: data['data'].SubsequentDurationCode + ' - ' + _this.fetchDurationDesc(data['data'].SubsequentDurationCode)
            };
        });
        this.maintenanceBFormGroup.controls['BankAccountNumber'].setValue(data['data'].BankAccountNumber !== 0 ? data['data'].BankAccountNumber : '');
        this.maintenanceBFormGroup.controls['BankAccountSortCode'].setValue(data['data'].BankAccountSortCode !== 0 ? data['data'].BankAccountSortCode : '');
        this.maintenanceBFormGroup.controls['InvoiceSuspendText'].setValue(data['data'].InvoiceSuspendText);
        this.maintenanceBFormGroup.controls['AuthorityCode'].setValue(data['data'].AuthorityCode);
        this.maintenanceBFormGroup.controls['VADDMandateNumber'].setValue(data['data'].VADDMandateNumber);
        this.maintenanceBFormGroup.controls['VADDBranchNumber'].setValue(data['data'].VADDBranchNumber);
        this.maintenanceBFormGroup.controls['VADDApproved'].setValue(false);
        this.maintenanceBFormGroup.controls['MandateNumberAccount'].setValue(data['data'].MandateNumberAccount);
        this.maintenanceBFormGroup.controls['PaymentDueDay'].setValue(data['data'].PaymentDueDay);
        this.maintenanceBFormGroup.controls['APIExemptText'].setValue(data['data'].APIExemptText);
    };
    MaintenanceTypeBComponent.prototype.fetchDurationDesc = function (val) {
        if (val !== null && val !== undefined) {
            var returnVal = '';
            for (var i = 0; i < this.durationData.length; i++) {
                if (val.trim() === this.durationData[i].ContractDurationCode.toString()) {
                    returnVal = this.durationData[i].ContractDurationDesc;
                }
            }
            return returnVal;
        }
        else {
            return '';
        }
    };
    MaintenanceTypeBComponent.prototype.processForm = function () {
        var _this = this;
        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            this.maintenanceBFormGroup.controls['AuthorityCode'].enable();
            this.maintenanceBFormGroup.controls['BankAccountNumber'].enable();
            this.maintenanceBFormGroup.controls['BankAccountSortCode'].enable();
            this.maintenanceBFormGroup.controls['PaymentTypeCode'].enable();
            this.dateObjectsEnabled['invoiceAnnivDate'] = false;
            if (this.storeData && this.storeData['formGroup'].main.controls['TrialPeriodInd'] && !this.storeData['formGroup'].main.controls['TrialPeriodInd'].value) {
                this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].disable();
            }
            this.maintenanceBFormGroup.controls['AdvanceInvoiceInd'].disable();
            this.maintenanceBFormGroup.controls['ContinuousInd'].disable();
            this.maintenanceBFormGroup.controls['ContractDurationCode'].disable();
            this.dateObjectsEnabled['contractExpiryDate'] = false;
            this.dateObjectsEnabled['minimumExpiryDate'] = true;
            this.maintenanceBFormGroup.controls['VATExempt'].disable();
            this.fieldVisibility.invoiceFrequencyChargeInd = false;
            this.fieldVisibility.invoiceFrequencyChargeValue = false;
            this.fieldVisibility.invoiceFeeCode = false;
            if (this.sysCharParams['vSCEnableInvoiceFee']) {
                this.isInvoiceFeeEllipsisDisabled = false;
            }
            else {
                this.isInvoiceFeeEllipsisDisabled = true;
            }
            this.fetchMandatePaymentTypeDetails(this.maintenanceBFormGroup.controls['PaymentTypeCode'].value);
            this.onContractDurationBlur({});
            this.onSubsequentDurationBlur({});
            if (this.storeData['params']['currentContractType'] === 'C') {
                this.hideShowDurationFields();
            }
            if (this.sysCharParams['vSCEnablePayTypeAtInvGroupLevel']) {
                this.maintenanceBFormGroup.controls['PaymentTypeCode'].clearValidators();
                this.fieldRequired.paymentTypeCode = false;
            }
            this.isPaymentTypeEllipsisDisabled = false;
            if (this.sysCharParams['vSCEnableMinimumDuration']) {
                this.isMinimumDurationCodeDropdownsDisabled = false;
            }
            else {
                this.isMinimumDurationCodeDropdownsDisabled = true;
            }
        }
        if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
            this.maintenanceBFormGroup.controls['AuthorityCode'].disable();
            this.maintenanceBFormGroup.controls['BankAccountNumber'].disable();
            this.maintenanceBFormGroup.controls['BankAccountSortCode'].disable();
            this.maintenanceBFormGroup.controls['PaymentTypeCode'].disable();
            this.fieldVisibility.invoiceFeeCode = false;
            if (this.mode && this.mode['prevMode'] === 'Add') {
                this.resetDate();
            }
            this.isPaymentTypeEllipsisDisabled = true;
            this.dateObjectsEnabled['nextAPIDate'] = false;
            this.dateObjectsEnabled['invoiceAnnivDate'] = false;
            this.dateObjectsEnabled['contractExpiryDate'] = false;
            this.dateObjectsEnabled['minimumExpiryDate'] = false;
            this.isDurationCodeDropdownDisabled = true;
            this.isMinimumDurationCodeDropdownsDisabled = true;
            this.isSubsequentDurationCodeDropdownDisabled = true;
            this.isInvoiceFeeEllipsisDisabled = true;
            this.isInvoiceFrequencyEllipsisDisabled = true;
            this.fieldVisibility.apiExemptInd = false;
            this.fieldVisibility.apiExemptText = false;
            if (this.storeData['data'] && (Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object)) {
                this.contractDurationSelected = {
                    id: '',
                    text: ''
                };
                this.subsequentDurationSelected = {
                    id: '',
                    text: ''
                };
                this.minimumDurationSelected = {
                    id: '',
                    text: ''
                };
            }
        }
        if (this.mode['addMode'] && !this.mode['updateMode'] && !this.mode['searchMode']) {
            this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].setValue('');
            this.maintenanceBFormGroup.controls['InvoiceFrequencyDesc'].setValue('');
            this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeInd'].setValue('');
            this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeValue'].setValue('');
            this.maintenanceBFormGroup.controls['InvoiceFeeCode'].setValue('');
            this.maintenanceBFormGroup.controls['InvoiceFeeDesc'].setValue('');
            this.maintenanceBFormGroup.controls['VATExempt'].setValue('');
            this.maintenanceBFormGroup.controls['AdvanceInvoiceInd'].setValue(true);
            this.maintenanceBFormGroup.controls['CreateRenewalInd'].setValue('');
            this.maintenanceBFormGroup.controls['ContinuousInd'].setValue(true);
            this.maintenanceBFormGroup.controls['ContractDurationCode'].setValue('');
            this.maintenanceBFormGroup.controls['ContractDurationDesc'].setValue('');
            this.contractDurationSelected = {
                id: '',
                text: ''
            };
            this.maintenanceBFormGroup.controls['MinimumDurationCode'].setValue('');
            this.maintenanceBFormGroup.controls['MinimumDurationDesc'].setValue('');
            this.minimumDurationSelected = {
                id: '',
                text: ''
            };
            this.maintenanceBFormGroup.controls['SubsequentDurationCode'].setValue('');
            this.maintenanceBFormGroup.controls['SubsequentDurationDesc'].setValue('');
            this.subsequentDurationSelected = {
                id: '',
                text: ''
            };
            this.maintenanceBFormGroup.controls['APIExemptInd'].setValue('');
            this.maintenanceBFormGroup.controls['APIExemptText'].setValue('');
            this.maintenanceBFormGroup.controls['InvoiceSuspendInd'].setValue('');
            this.maintenanceBFormGroup.controls['InvoiceSuspendText'].setValue('');
            this.maintenanceBFormGroup.controls['HPRLExemptInd'].setValue('');
            this.maintenanceBFormGroup.controls['PaymentTypeCode'].setValue('');
            this.maintenanceBFormGroup.controls['PaymentDesc'].setValue('');
            this.maintenanceBFormGroup.controls['AuthorityCode'].setValue('');
            this.maintenanceBFormGroup.controls['VADDMandateNumber'].setValue('');
            this.maintenanceBFormGroup.controls['VADDBranchNumber'].setValue('');
            this.maintenanceBFormGroup.controls['VADDApproved'].setValue('');
            this.maintenanceBFormGroup.controls['MandateNumberAccount'].setValue('');
            this.maintenanceBFormGroup.controls['BankAccountNumber'].setValue('');
            this.maintenanceBFormGroup.controls['BankAccountSortCode'].setValue('');
            this.maintenanceBFormGroup.controls['PaymentDueDay'].setValue('');
            if (this.sysCharParams['vSCEnableInvoiceFee']) {
                this.isInvoiceFeeEllipsisDisabled = false;
            }
            else {
                this.isInvoiceFeeEllipsisDisabled = true;
            }
            this.resetDate();
            this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].enable();
            this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeInd'].enable();
            this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeValue'].enable();
            this.maintenanceBFormGroup.controls['InvoiceFeeCode'].enable();
            this.maintenanceBFormGroup.controls['VATExempt'].enable();
            this.maintenanceBFormGroup.controls['AdvanceInvoiceInd'].enable();
            this.maintenanceBFormGroup.controls['CreateRenewalInd'].enable();
            this.maintenanceBFormGroup.controls['ContinuousInd'].enable();
            this.maintenanceBFormGroup.controls['ContractDurationCode'].enable();
            this.isMinimumDurationCodeDropdownsDisabled = false;
            this.maintenanceBFormGroup.controls['MinimumDurationCode'].enable();
            this.isMinimumDurationCodeDropdownsDisabled = false;
            this.maintenanceBFormGroup.controls['SubsequentDurationCode'].enable();
            this.maintenanceBFormGroup.controls['APIExemptInd'].enable();
            this.maintenanceBFormGroup.controls['APIExemptText'].enable();
            this.maintenanceBFormGroup.controls['HPRLExemptInd'].enable();
            this.maintenanceBFormGroup.controls['PaymentTypeCode'].enable();
            this.isPaymentTypeEllipsisDisabled = false;
            this.maintenanceBFormGroup.controls['AuthorityCode'].enable();
            this.maintenanceBFormGroup.controls['VADDMandateNumber'].enable();
            this.maintenanceBFormGroup.controls['VADDBranchNumber'].enable();
            this.maintenanceBFormGroup.controls['VADDApproved'].enable();
            this.maintenanceBFormGroup.controls['MandateNumberAccount'].enable();
            this.maintenanceBFormGroup.controls['BankAccountNumber'].enable();
            this.maintenanceBFormGroup.controls['BankAccountSortCode'].enable();
            this.fetchContractData('GetDefaultInvoiceFrequency,GetDefaultInvoiceFeeCode,GetDefaultPaymentType,GetPaymentTypeDetails', { action: '6' }).subscribe(function (e) {
                if (e.status === GlobalConstant.Configuration.Failure) {
                }
                else {
                    _this.otherParams['InvoiceFeeCode'] = e['InvoiceFeeCode'] ? e['InvoiceFeeCode'] : '';
                    _this.otherParams['InvoiceFeeDesc'] = e['InvoiceFeeDesc'] ? e['InvoiceFeeDesc'] : '';
                    _this.otherParams['InvoiceFrequencyCode'] = e['InvoiceFrequencyCode'] ? e['InvoiceFrequencyCode'] : '';
                    _this.otherParams['InvoiceFrequencyDesc'] = e['InvoiceFrequencyDesc'] ? e['InvoiceFrequencyDesc'] : '';
                    _this.otherParams['PaymentDesc'] = e['PaymentDesc'] ? e['PaymentDesc'] : '';
                    _this.otherParams['PaymentTypeCode'] = e['PaymentTypeCode'] ? e['PaymentTypeCode'] : '';
                    _this.otherParams['MandateRequired'] = e['MandateRequired'] ? e['MandateRequired'] : '';
                    _this.maintenanceBFormGroup.controls['InvoiceFeeCode'].setValue(_this.otherParams['InvoiceFeeCode']);
                    _this.maintenanceBFormGroup.controls['InvoiceFeeDesc'].setValue(_this.otherParams['InvoiceFeeDesc']);
                    _this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].setValue(_this.otherParams['InvoiceFrequencyCode']);
                    _this.maintenanceBFormGroup.controls['InvoiceFrequencyDesc'].setValue(_this.otherParams['InvoiceFrequencyDesc']);
                    _this.maintenanceBFormGroup.controls['PaymentDesc'].setValue(_this.otherParams['PaymentDesc']);
                    _this.maintenanceBFormGroup.controls['PaymentTypeCode'].setValue(_this.otherParams['PaymentTypeCode']);
                    if (_this.otherParams && _this.otherParams['MandateRequired'] && _this.otherParams['MandateRequired'].toUpperCase() !== GlobalConstant.Configuration.No) {
                        _this.fieldVisibility.mandateNumberAccount = true;
                        _this.fieldVisibility.mandateDate = true;
                        _this.mandateDate = null;
                    }
                    else {
                        _this.fieldVisibility.mandateNumberAccount = false;
                        _this.fieldVisibility.mandateDate = false;
                        _this.maintenanceBFormGroup.controls['MandateNumberAccount'].clearValidators();
                    }
                    _this.fetchMandatePaymentTypeDetails(_this.maintenanceBFormGroup.controls['PaymentTypeCode'].value);
                }
            }, function (error) {
                _this.mandateRequiredChange();
            });
            this.dateObjectsEnabled = {
                invoiceAnnivDate: true,
                nextAPIDate: false,
                contractRenewalDate: false,
                contractExpiryDate: true,
                minimumExpiryDate: true,
                mandateDate: true
            };
            this.isInvoiceFrequencyEllipsisDisabled = false;
            this.isPaymentTypeEllipsisDisabled = false;
            this.fieldVisibility.paymentTypeCode = true;
            this.fieldVisibility.invoiceFrequencyCode = true;
            this.fieldVisibility.minimumDurationCode = true;
            this.fieldVisibility.minimumExpiryDate = true;
            this.fieldVisibility.paymentTypeCode = true;
            this.maintenanceBFormGroup.controls['PaymentTypeCode'].setValidators(Validators.required);
            this.fieldVisibility.contractDurationCode = false;
            this.fieldVisibility.contractExpiryDate = false;
            this.setDefaultMinimumDuration();
            this.maintenanceBFormGroup.controls['ContractDurationCode'].disable();
            if (this.storeData['params'] && this.storeData['params']['currentContractType'] === 'C') {
                this.maintenanceBFormGroup.controls['ContractExpiryDate'].disable();
                this.dateObjectsEnabled['contractExpiryDate'] = false;
            }
            this.fieldVisibility.apiExemptInd = false;
            this.fieldVisibility.apiExemptText = false;
            if (this.sysCharParams['vSCEnableInvoiceFee'] && this.storeData['params']['currentContractType'] === 'C') {
                this.fieldVisibility.invoiceFeeCode = true;
                this.fieldRequired.invoiceFeeCode = true;
                this.maintenanceBFormGroup.controls['InvoiceFeeCode'].setValidators(Validators.required);
            }
            else {
                this.fieldVisibility.invoiceFeeCode = false;
                this.fieldRequired.invoiceFeeCode = false;
                this.maintenanceBFormGroup.controls['InvoiceFeeCode'].clearValidators();
            }
            if (this.sysCharParams['vSCEnableSubsequentDuration'] && this.sysCharParams['vSCSubsequentDuration']) {
                this.fieldVisibility.subsequentDurationCode = true;
                this.maintenanceBFormGroup.controls['SubsequentDurationCode'].setValue(this.sysCharParams['vSCSubsequentDuration']);
                this.subsequentDurationSelected = {
                    id: '',
                    text: this.sysCharParams['vSCSubsequentDuration']
                };
                this.isSubsequentDurationCodeDropdownDisabled = false;
            }
            else {
                this.fieldVisibility.subsequentDurationCode = false;
                this.isSubsequentDurationCodeDropdownDisabled = true;
            }
            if (this.sysCharParams['vSCEnableMinimumDuration']) {
                this.isMinimumDurationCodeDropdownsDisabled = false;
            }
            else {
                this.isMinimumDurationCodeDropdownsDisabled = true;
            }
            if (this.sysCharParams['vSCEnableTaxCodeDefaulting']) {
                this.maintenanceBFormGroup.controls['VATExempt'].enable();
            }
            else {
                this.maintenanceBFormGroup.controls['VATExempt'].disable();
            }
            this.maintenanceBFormGroup.controls['AdvanceInvoiceInd'].setValue(true);
            this.maintenanceBFormGroup.controls['ContinuousInd'].setValue(true);
            this.hideShowDurationFields();
            this.store.dispatch({
                type: ContractActionTypes.FORM_GROUP, payload: {
                    typeB: this.maintenanceBFormGroup
                }
            });
        }
        this.checkJobProductSalesParams();
        this.maintenanceBFormGroup.updateValueAndValidity();
        if (this.mode['addMode'] || this.mode['updateMode']) {
            this.inputParamsContractDuration = {
                'parentMode': 'LookUp-Contract',
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business
            };
            this.inputParamsMinimumDuration = {
                'parentMode': 'LookUp-ContractMinDuration',
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business
            };
            this.inputParamsSubsequentDuration = {
                'parentMode': 'LookUp-SubsequentDuration',
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business
            };
            this.inputParamsPaymentType = {
                'parentMode': 'LookUp',
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business
            };
            this.inputParamsInvoiceFrequency = {
                'parentMode': 'LookUp',
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business
            };
            this.inputParamsInvoiceFee = {
                'parentMode': 'LookUp',
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business
            };
            this.inputParams = Object.assign({}, this.inputParams, {
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business
            });
            this.fetchDurationData();
        }
        setTimeout(function () {
            _this.fetchTranslationContent();
        }, 0);
    };
    MaintenanceTypeBComponent.prototype.resetDate = function () {
        var _this = this;
        this.zone.run(function () {
            _this.invoiceAnnivDate = _this.invoiceAnnivDate === null ? void 0 : null;
            _this.invoiceAnnivDateDisplay = '';
            _this.maintenanceBFormGroup.controls['InvoiceAnnivDate'].setValue(_this.invoiceAnnivDateDisplay);
            _this.nextAPIDate = _this.nextAPIDate === null ? void 0 : null;
            ;
            _this.nextAPIDateDisplay = '';
            _this.maintenanceBFormGroup.controls['NextAPIDate'].setValue(_this.nextAPIDateDisplay);
            _this.contractRenewalDate = _this.contractRenewalDate === null ? void 0 : null;
            ;
            _this.contractRenewalDateDisplay = '';
            _this.maintenanceBFormGroup.controls['ContractRenewalDate'].setValue(_this.contractRenewalDateDisplay);
            _this.contractExpiryDate = _this.contractExpiryDate === null ? void 0 : null;
            ;
            _this.contractExpiryDateDisplay = '';
            _this.maintenanceBFormGroup.controls['ContractExpiryDate'].setValue(_this.contractExpiryDateDisplay);
            _this.minimumExpiryDate = _this.minimumExpiryDate === null ? void 0 : null;
            ;
            _this.minimumExpiryDateDisplay = '';
            _this.maintenanceBFormGroup.controls['MinimumExpiryDate'].setValue(_this.minimumExpiryDateDisplay);
            _this.mandateDate = _this.mandateDate === null ? void 0 : null;
            ;
            _this.mandateDateDisplay = '';
            _this.maintenanceBFormGroup.controls['MandateDate'].setValue(_this.mandateDateDisplay);
        });
    };
    MaintenanceTypeBComponent.prototype.fetchDurationDates = function (type) {
        var _this = this;
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
        if (type === 'M') {
            functionName = 'GetMinimumExpiryDate';
        }
        else if (type === 'C') {
            functionName = 'GetExpiryDate';
        }
        else if (type === 'S') {
            functionName = 'GetSubsequentExpiryDate';
        }
        obj = { action: '6',
            ContractCommenceDate: this.storeData['formGroup'].main.controls['ContractCommenceDate'].value ? this.storeData['formGroup'].main.controls['ContractCommenceDate'].value : '',
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
            }
            else {
                _this.store.dispatch({
                    type: ContractActionTypes.PARENT_TO_CHILD_COMPONENT, payload: e
                });
            }
        }, function (error) {
        });
    };
    MaintenanceTypeBComponent.prototype.fetchMinimumDurationMandateRequired = function () {
        var _this = this;
        var functionName = '';
        var params = {};
        var obj = {};
        var serviceObj = {};
        functionName = 'GetMinimumExpiryDate,GetPaymentTypeDetails,GetNoticePeriod';
        obj = { action: '6',
            ContractCommenceDate: this.storeData['formGroup'].main.controls['ContractCommenceDate'].value ? this.storeData['formGroup'].main.controls['ContractCommenceDate'].value : '',
            MinimumDurationCode: this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].value ? this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].value : '',
            InvoiceAnnivDate: this.storeData['formGroup'].typeB.controls['InvoiceAnnivDate'].value ? this.storeData['formGroup'].typeB.controls['InvoiceAnnivDate'].value : '',
            CompanyCode: this.storeData['formGroup'].typeC.controls['CompanyCode'].value ? this.storeData['formGroup'].typeC.controls['CompanyCode'].value : ''
        };
        for (var o in obj) {
            if (obj[o] !== '') {
                serviceObj[o] = obj[o];
            }
        }
        this.fetchContractData(functionName, serviceObj).subscribe(function (e) {
            if (e.status === GlobalConstant.Configuration.Failure) {
            }
            else {
                if (e.MinimumExpiryDate) {
                    if (window['moment'](e.MinimumExpiryDate, 'DD/MM/YYYY', true).isValid()) {
                        _this.minimumExpiryDateDisplay = _this.utils.convertDateString(e.MinimumExpiryDate);
                    }
                    else {
                    }
                    if (!_this.minimumExpiryDateDisplay) {
                        _this.minimumExpiryDate = null;
                    }
                    else {
                        _this.minimumExpiryDate = new Date(_this.minimumExpiryDateDisplay);
                        if (!window['moment'](_this.minimumExpiryDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                            _this.minimumExpiryDateDisplay = _this.utils.formatDate(new Date(_this.minimumExpiryDateDisplay));
                        }
                    }
                    _this.maintenanceBFormGroup.controls['MinimumExpiryDate'].setValue(_this.minimumExpiryDateDisplay);
                    if (e.MandateRequired && _this.otherParams) {
                        _this.otherParams['MandateRequired'] = e.MandateRequired;
                        _this.storeData['otherParams']['MandateRequired'] = e.MandateRequired;
                        _this.setRequiredStatusInBankFields();
                    }
                }
            }
        }, function (error) {
        });
    };
    MaintenanceTypeBComponent.prototype.hideShowDurationFields = function () {
        if (this.maintenanceBFormGroup.controls['ContinuousInd'] && this.maintenanceBFormGroup.controls['ContinuousInd'].value === true) {
            this.maintenanceBFormGroup.controls['ContractDurationCode'].disable();
            this.maintenanceBFormGroup.controls['ContractExpiryDate'].disable();
            this.maintenanceBFormGroup.controls['CreateRenewalInd'].disable();
            if (this.maintenanceBFormGroup.controls['ContractDurationCode']) {
                this.maintenanceBFormGroup.controls['ContractDurationCode'].clearValidators();
            }
            this.fieldRequired['contractDurationCode'] = false;
            this.fieldVisibility['contractExpiryDate'] = false;
            this.fieldVisibility['contractDurationCode'] = false;
            this.fieldVisibility['contractRenewalDate'] = false;
            this.fieldVisibility['createRenewalInd'] = false;
            this.contractExpiryDate = null;
            this.maintenanceBFormGroup.controls['ContractDurationCode'].setValue('');
            this.maintenanceBFormGroup.controls['ContractDurationDesc'].setValue('');
        }
        else {
            this.fieldVisibility['contractExpiryDate'] = true;
            this.fieldVisibility['contractDurationCode'] = true;
            if (this.sysCharParams['vSCEnableRenewals']) {
                this.fieldVisibility['contractRenewalDate'] = true;
            }
            else {
                this.fieldVisibility['contractRenewalDate'] = false;
            }
            this.contractExpiryDate = null;
            this.maintenanceBFormGroup.controls['ContractDurationCode'].enable();
            this.isDurationCodeDropdownDisabled = false;
            this.fieldRequired['contractDurationCode'] = true;
            this.maintenanceBFormGroup.controls['ContractDurationCode'].setValidators(Validators.required);
            if (!this.sysCharParams['vSCAutoCreateRenewalProspect']) {
                this.maintenanceBFormGroup.controls['CreateRenewalInd'].disable();
                this.maintenanceBFormGroup.controls['CreateRenewalInd'].setValue(false);
                this.fieldVisibility['createRenewalInd'] = false;
            }
            else {
                this.fieldVisibility['createRenewalInd'] = true;
                this.maintenanceBFormGroup.controls['CreateRenewalInd'].enable();
                this.maintenanceBFormGroup.controls['CreateRenewalInd'].setValue(true);
            }
            if (this.storeData['params']['currentContractType'] === 'C') {
                this.maintenanceBFormGroup.controls['ContractExpiryDate'].enable();
            }
        }
        this.maintenanceBFormGroup.updateValueAndValidity();
        if (this.storeData['mode'].addMode) {
            this.fetchDurationDates('C');
        }
    };
    MaintenanceTypeBComponent.prototype.clearContractAddress = function () {
        if (this.storeData && this.storeData['formGroup'].main.controls['AccountName']) {
            this.storeData['formGroup'].main.controls['AccountName'].setValue('');
        }
        if (this.sysCharParams['vSCEnableInvoiceFee'] && this.storeData['params']['currentContractType'] === 'C' && this.storeData['fieldValue'].AccountNumber && this.mode['addMode']) {
            this.fieldVisibility.invoiceFeeCode = true;
            this.fieldRequired.invoiceFeeCode = true;
            this.maintenanceBFormGroup.controls['InvoiceFeeCode'].setValidators(Validators.required);
        }
        else {
            this.fieldVisibility.invoiceFeeCode = false;
            this.fieldRequired.invoiceFeeCode = false;
            this.maintenanceBFormGroup.controls['InvoiceFeeCode'].clearValidators();
        }
    };
    MaintenanceTypeBComponent.prototype.hideBankDetailsTab = function () {
        if (this.sysCharParams['vSCHideBankDetailsTab']) {
            this.fieldVisibility.bankAccountNumber = false;
            this.fieldVisibility.bankAccountSortCode = false;
        }
        else {
            this.fieldVisibility.bankAccountNumber = true;
            this.fieldVisibility.bankAccountSortCode = true;
        }
    };
    MaintenanceTypeBComponent.prototype.mandateRequiredChange = function () {
        var _this = this;
        if (this.sysCharParams['vSCEnableBankDetailEntry']) {
            this.fieldVisibility.bankAccountNumber = true;
            this.fieldVisibility.bankAccountSortCode = true;
            if (this.mode['addMode'] && !this.mode['updateMode'] && !this.mode['searchMode']) {
                this.maintenanceBFormGroup.controls['BankAccountNumber'].enable();
                this.maintenanceBFormGroup.controls['BankAccountSortCode'].enable();
            }
            else {
                this.maintenanceBFormGroup.controls['BankAccountNumber'].disable();
                this.maintenanceBFormGroup.controls['BankAccountSortCode'].disable();
            }
        }
        else {
            this.fieldVisibility.bankAccountNumber = false;
            this.fieldVisibility.bankAccountSortCode = false;
        }
        this.hideBankDetailsTab();
        this.fieldRequired.mandateNumberAccount = false;
        this.maintenanceBFormGroup.controls['MandateNumberAccount'].clearValidators();
        this.fieldRequired.mandateDate = false;
        this.blnMandateNumberReq = false;
        if (this.otherParams && this.otherParams['SepaConfigInd'] === true) {
            if (this.otherParams && this.otherParams['MandateRequired'] && this.otherParams['MandateRequired'].toUpperCase() !== GlobalConstant.Configuration.No) {
                this.fieldVisibility.mandateNumberAccount = true;
                this.fieldVisibility.mandateDate = true;
                this.mandateDate = null;
                this.clearDate['mandateDate'] = false;
                setTimeout(function () {
                    _this.clearDate['mandateDate'] = true;
                }, 400);
                this.maintenanceBFormGroup.controls['MandateNumberAccount'].setValue('');
                if (this.sysCharParams['vSCEnableBankDetailEntry'] && this.sysCharParams['vSCEnableSEPAFinanceMandate'] && !this.sysCharParams['vSCEnableSEPAFinanceMandateLog']) {
                    this.fieldRequired.mandateNumberAccount = true;
                    this.fieldRequired.mandateDate = true;
                    this.maintenanceBFormGroup.controls['MandateNumberAccount'].setValidators(Validators.required);
                    this.fieldVisibility.mandateNumberGenerate = true;
                    this.blnMandateNumberReq = true;
                    if (this.mode['addMode'] || this.mode['updateMode']) {
                        this.maintenanceBFormGroup.controls['Generate'].enable();
                    }
                    else {
                        this.maintenanceBFormGroup.controls['Generate'].disable();
                    }
                }
                else {
                    this.fieldVisibility.mandateNumberGenerate = false;
                }
                if (!this.storeData['formGroup'].main.controls['AccountNumber'].value || this.storeData['formGroup'].main.controls['AccountNumber'].value === '') {
                    this.maintenanceBFormGroup.controls['MandateNumberAccount'].enable();
                    this.maintenanceBFormGroup.controls['MandateDate'].enable();
                    this.maintenanceBFormGroup.controls['Generate'].enable();
                    this.dateObjectsEnabled['mandateDate'] = true;
                }
                else {
                    this.fetchContractData('GetAccountMandateNumber', { action: '6', AccountNumber: this.storeData['formGroup'].main.controls['AccountNumber'].value }).subscribe(function (e) {
                        if (e.status === GlobalConstant.Configuration.Failure) {
                        }
                        else {
                            if (e) {
                                if (e.AccountMandate) {
                                    _this.maintenanceBFormGroup.controls['MandateNumberAccount'].setValue(e.AccountMandate);
                                    _this.maintenanceBFormGroup.controls['MandateNumberAccount'].disable();
                                    _this.clearDate['mandateDate'] = false;
                                    if (e.MandateDate) {
                                        if (window['moment'](e.MandateDate, 'DD/MM/YYYY', true).isValid()) {
                                            _this.mandateDateDisplay = _this.utils.convertDateString(e.MandateDate);
                                        }
                                        else {
                                            _this.mandateDateDisplay = e.MandateDate;
                                        }
                                    }
                                    else {
                                        _this.mandateDateDisplay = null;
                                    }
                                    if (!_this.mandateDateDisplay) {
                                        if (e.MandateDate === '') {
                                            setTimeout(function () {
                                                _this.clearDate['mandateDate'] = true;
                                            }, 400);
                                        }
                                        _this.mandateDate = null;
                                    }
                                    else {
                                        _this.clearDate['mandateDate'] = false;
                                        _this.mandateDate = new Date(_this.mandateDateDisplay);
                                        if (!window['moment'](_this.mandateDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                                            _this.mandateDateDisplay = _this.utils.formatDate(new Date(_this.mandateDateDisplay));
                                        }
                                    }
                                    _this.maintenanceBFormGroup.controls['MandateDate'].setValue(e.MandateDate);
                                    _this.dateObjectsEnabled['mandateDate'] = false;
                                    _this.maintenanceBFormGroup.controls['Generate'].disable();
                                }
                                else {
                                    if (_this.storeData['mode']['addMode'] || _this.storeData['mode']['updateMode']) {
                                        _this.maintenanceBFormGroup.controls['MandateNumberAccount'].enable();
                                        _this.maintenanceBFormGroup.controls['MandateDate'].enable();
                                        _this.maintenanceBFormGroup.controls['Generate'].enable();
                                        _this.dateObjectsEnabled['mandateDate'] = true;
                                    }
                                }
                            }
                            else {
                                _this.maintenanceBFormGroup.controls['MandateNumberAccount'].disable();
                                _this.maintenanceBFormGroup.controls['MandateDate'].disable();
                                _this.maintenanceBFormGroup.controls['Generate'].disable();
                            }
                        }
                    }, function (error) {
                    });
                }
            }
            else {
                this.fieldVisibility.mandateNumberAccount = false;
                this.fieldVisibility.mandateDate = false;
                this.maintenanceBFormGroup.controls['MandateNumberAccount'].clearValidators();
            }
        }
        else {
            this.fieldVisibility.mandateNumberAccount = false;
            this.fieldVisibility.mandateDate = false;
            this.maintenanceBFormGroup.controls['MandateNumberAccount'].clearValidators();
            if (!this.storeData['mode']['addMode'] && this.otherParams && this.otherParams['MandateRequired'] && this.otherParams['MandateRequired'].toUpperCase() !== GlobalConstant.Configuration.No && this.sysCharParams['vSCEnableLegacyMandate']) {
                this.fieldVisibility.vaddMandateNumber = true;
            }
            else {
                this.fieldVisibility.vaddMandateNumber = false;
            }
        }
        this.setRequiredStatusInBankFields();
        this.maintenanceBFormGroup.controls['BankAccountNumber'].updateValueAndValidity();
        this.maintenanceBFormGroup.controls['BankAccountSortCode'].updateValueAndValidity();
        this.maintenanceBFormGroup.controls['MandateNumberAccount'].updateValueAndValidity();
        this.maintenanceBFormGroup.updateValueAndValidity();
    };
    MaintenanceTypeBComponent.prototype.onGenerateClick = function (event) {
        var _this = this;
        this.fetchContractData('GenerateNewRef', { action: '6', AccountNumber: this.storeData['fieldValue'].AccountNumber }).subscribe(function (e) {
            if (e.status === GlobalConstant.Configuration.Failure) {
            }
            else {
                if (e && e.MandateNumberAccount) {
                    _this.maintenanceBFormGroup.controls['MandateNumberAccount'].setValue(e.MandateNumberAccount);
                    if (!_this.blnMandateNumberReq) {
                        _this.fieldRequired.mandateDate = false;
                    }
                    else {
                        _this.fieldRequired.mandateDate = true;
                    }
                }
            }
        }, function (error) {
        });
    };
    MaintenanceTypeBComponent.prototype.setRequiredStatusInBankFields = function () {
        if (this.otherParams && this.otherParams['MandateRequired'] && this.otherParams['MandateRequired'].toUpperCase() === GlobalConstant.Configuration.Yes && this.sysCharParams['vSCEnableBankDetailEntry']) {
            if (this.storeData['mode']['addMode']) {
                this.fieldRequired.bankAccountSortCode = true;
                this.maintenanceBFormGroup.controls['BankAccountSortCode'].setValidators(Validators.required);
                this.fieldRequired.bankAccountNumber = true;
                this.maintenanceBFormGroup.controls['BankAccountNumber'].setValidators(Validators.required);
            }
        }
        else {
            this.fieldRequired.bankAccountSortCode = false;
            this.fieldRequired.bankAccountNumber = false;
            this.maintenanceBFormGroup.controls['BankAccountNumber'].clearValidators();
            this.maintenanceBFormGroup.controls['BankAccountSortCode'].clearValidators();
            this.maintenanceBFormGroup.controls['BankAccountNumber'].updateValueAndValidity();
            this.maintenanceBFormGroup.controls['BankAccountSortCode'].updateValueAndValidity();
        }
    };
    MaintenanceTypeBComponent.prototype.onMandateNumberAccountBlur = function (event) {
        if (!event.target.value && !this.blnMandateNumberReq) {
            this.fieldRequired.mandateDate = false;
        }
        else {
            this.fieldRequired.mandateDate = true;
        }
    };
    MaintenanceTypeBComponent.prototype.fetchContractData = function (functionName, params) {
        var businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
        var countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();
        this.queryContract.set(this.serviceConstants.BusinessCode, businessCode);
        this.queryContract.set(this.serviceConstants.CountryCode, countryCode);
        this.queryContract.set(this.serviceConstants.Action, this.queryParamsContract.action);
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
    MaintenanceTypeBComponent.prototype.onContractDurationCodeDataReceived = function (data) {
        this.maintenanceBFormGroup.controls['ContractDurationCode'].setValue(data.ContractDurationCode);
        this.maintenanceBFormGroup.controls['ContractDurationDesc'].setValue(data.ContractDurationDesc);
        this.fetchDurationDates('C');
    };
    MaintenanceTypeBComponent.prototype.onMinimumDurationCodeDataReceived = function (data) {
        this.maintenanceBFormGroup.controls['MinimumDurationCode'].setValue(data.MinimumDurationCode);
        this.maintenanceBFormGroup.controls['MinimumDurationDesc'].setValue(data.MinimumDurationDesc);
        this.fetchDurationDates('M');
    };
    MaintenanceTypeBComponent.prototype.onSubsequentDurationCodeDataReceived = function (data) {
        this.maintenanceBFormGroup.controls['SubsequentDurationCode'].setValue(data.SubsequentDurationCode);
        this.maintenanceBFormGroup.controls['SubsequentDurationDesc'].setValue(data.SubsequentDurationDesc);
        this.fetchDurationDates('S');
    };
    MaintenanceTypeBComponent.prototype.onPaymentTypeDataReceived = function (data) {
        if (data) {
            this.maintenanceBFormGroup.controls['PaymentTypeCode'].setValue(data.PaymentTypeCode);
            this.maintenanceBFormGroup.controls['PaymentDesc'].setValue(data.PaymentDesc);
            this.fetchMandatePaymentTypeDetails(data.PaymentTypeCode);
        }
    };
    MaintenanceTypeBComponent.prototype.fetchMandatePaymentTypeDetails = function (code) {
        var _this = this;
        this.fetchContractData('GetPaymentTypeDetails,GetNoticePeriod', { 'PaymentTypeCode': code, 'BranchNumber': this.utils.getBranchCode() }).subscribe(function (e) {
            if (e.status === GlobalConstant.Configuration.Failure) {
            }
            else {
                if (_this.otherParams && _this.storeData['otherParams']) {
                    _this.otherParams['MandateRequired'] = e.MandateRequired;
                    _this.storeData['otherParams']['MandateRequired'] = e.MandateRequired;
                }
                _this.mandateRequiredChange();
                _this.setRequiredStatusInBankFields();
            }
        }, function (error) {
        });
    };
    MaintenanceTypeBComponent.prototype.onCapitalize = function (control) {
        if (!this.sysCharParams['vSCCapitalFirstLtr']) {
            this.maintenanceBFormGroup.controls[control].setValue(this.maintenanceBFormGroup.controls[control].value.toString().capitalizeFirstLetter());
        }
    };
    MaintenanceTypeBComponent.prototype.onInvoiceFrequencyDataReceived = function (data) {
        if (data) {
            if (this.maintenanceBFormGroup.controls['InvoiceFrequencyCode']) {
                this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].setValue(data.InvoiceFrequencyCode);
            }
            if (this.maintenanceBFormGroup.controls['InvoiceFrequencyDesc']) {
                this.maintenanceBFormGroup.controls['InvoiceFrequencyDesc'].setValue(data.InvoiceFrequencyDesc);
            }
        }
    };
    MaintenanceTypeBComponent.prototype.onInvoiceFeeDataReceived = function (data) {
        if (data.InvoiceFeeDesc) {
            this.maintenanceBFormGroup.controls['InvoiceFeeCode'].setValue(data.InvoiceFeeCode);
            this.maintenanceBFormGroup.controls['InvoiceFeeDesc'].setValue(data.InvoiceFeeDesc);
        }
        else {
            this.maintenanceBFormGroup.controls['InvoiceFeeCode'].setValue(data.InvoiceFeeCode);
        }
    };
    MaintenanceTypeBComponent.prototype.invoiceAnnivDateSelectedValue = function (value) {
        if (value && value.value) {
            this.invoiceAnnivDateDisplay = value.value;
            this.maintenanceBFormGroup.controls['InvoiceAnnivDate'].setValue(this.invoiceAnnivDateDisplay);
            this.maintenanceBFormGroup.controls['InvoiceAnnivDate'].markAsDirty();
            this.fetchMinimumDurationMandateRequired();
        }
        else {
            this.invoiceAnnivDateDisplay = '';
            this.maintenanceBFormGroup.controls['InvoiceAnnivDate'].setValue('');
        }
    };
    MaintenanceTypeBComponent.prototype.nextAPIDateSelectedValue = function (value) {
        if (value && value.value) {
            this.nextAPIDateDisplay = value.value;
            this.maintenanceBFormGroup.controls['NextAPIDate'].setValue(this.nextAPIDateDisplay);
            this.maintenanceBFormGroup.controls['NextAPIDate'].markAsDirty();
        }
        else {
            this.nextAPIDateDisplay = '';
            this.maintenanceBFormGroup.controls['NextAPIDate'].setValue('');
        }
    };
    MaintenanceTypeBComponent.prototype.contractRenewalDateSelectedValue = function (value) {
        if (value && value.value) {
            this.contractRenewalDateDisplay = value.value;
            this.maintenanceBFormGroup.controls['ContractRenewalDate'].setValue(this.contractRenewalDateDisplay);
            this.maintenanceBFormGroup.controls['ContractRenewalDate'].markAsDirty();
        }
        else {
            this.contractRenewalDateDisplay = '';
            this.maintenanceBFormGroup.controls['ContractRenewalDate'].setValue('');
        }
    };
    MaintenanceTypeBComponent.prototype.contractExpiryDateSelectedValue = function (value) {
        if (value && value.value) {
            this.contractExpiryDateDisplay = value.value;
            this.maintenanceBFormGroup.controls['ContractExpiryDate'].setValue(this.contractExpiryDateDisplay);
            this.maintenanceBFormGroup.controls['ContractExpiryDate'].markAsDirty();
        }
        else {
            this.contractExpiryDateDisplay = '';
            this.maintenanceBFormGroup.controls['ContractExpiryDate'].setValue('');
        }
    };
    MaintenanceTypeBComponent.prototype.minimumExpiryDateSelectedValue = function (value) {
        if (value && value.value) {
            this.minimumExpiryDateDisplay = value.value;
            this.maintenanceBFormGroup.controls['MinimumExpiryDate'].setValue(this.minimumExpiryDateDisplay);
            this.maintenanceBFormGroup.controls['MinimumExpiryDate'].markAsDirty();
        }
        else {
            this.minimumExpiryDateDisplay = '';
            this.maintenanceBFormGroup.controls['MinimumExpiryDate'].setValue('');
        }
    };
    MaintenanceTypeBComponent.prototype.mandateDateSelectedValue = function (value) {
        if (value && value.value) {
            this.mandateDateDisplay = value.value;
            this.maintenanceBFormGroup.controls['MandateDate'].setValue(this.mandateDateDisplay);
            this.maintenanceBFormGroup.controls['MandateDate'].markAsDirty();
        }
        else {
            this.mandateDateDisplay = '';
            this.maintenanceBFormGroup.controls['MandateDate'].setValue('');
        }
    };
    MaintenanceTypeBComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-maintenance-type-b',
                    templateUrl: 'maintenance-type-b.html'
                },] },
    ];
    MaintenanceTypeBComponent.ctorParameters = [
        { type: NgZone, },
        { type: FormBuilder, },
        { type: ActivatedRoute, },
        { type: Store, },
        { type: ServiceConstants, },
        { type: HttpService, },
        { type: Utils, },
    ];
    return MaintenanceTypeBComponent;
}());
