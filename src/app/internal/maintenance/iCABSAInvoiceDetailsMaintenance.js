var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { InvoiceFrequencySearchComponent } from '../../internal/search/iCABSBBusinessInvoiceFrequencySearch';
import { MessageConstant } from './../../../shared/constants/message.constant';
export var InvoiceDetailsMaintainanceComponent = (function (_super) {
    __extends(InvoiceDetailsMaintainanceComponent, _super);
    function InvoiceDetailsMaintainanceComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.modalTitle = '';
        this.autoOpen = false;
        this.autoOpenSearch = false;
        this.invoiceFreqValidation = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.contractSearchParams = {
            'parentMode': 'LookUp',
            'showAddNew': false,
            'currentContractType': 'C'
        };
        this.inputParamsfreqSearch = { 'parentMode': 'LookUp', action: 0, 'countryCode': this.utils.getCountryCode(), 'businessCode': this.utils.getBusinessCode() };
        this.showHeader = true;
        this.contractSearchComponent = ContractSearchComponent;
        this.invoiceFreqComponent = InvoiceFrequencySearchComponent;
        this.showCloseButton = true;
        this.method = 'contract-management/maintenance';
        this.module = 'contract-admin';
        this.operation = 'Application/iCABSAInvoiceDetailsMaintenance';
        this.inputParams = {};
        this.BranchOption = [];
        this.invoiceFreqValue = false;
        this.invoiceFreqValueHide = false;
        this.contractDurationHide = false;
        this.annumalValuehide = true;
        this.showMessageHeader = true;
        this.showErrorHeader = true;
        this.promptTitle = 'Confirm Record?';
        this.promptContent = '';
        this.backUpObject = {};
        this.controls = [
            { name: 'ContractNumber', readonly: true, disabled: false, required: true },
            { name: 'ContractName', readonly: true, disabled: true, required: false },
            { name: 'Status', readonly: true, disabled: true, required: true },
            { name: 'AccountNumber', readonly: true, disabled: true, required: true },
            { name: 'AccountName', readonly: true, disabled: true, required: true },
            { name: 'ContractAddressLine1', readonly: true, disabled: true, required: false },
            { name: 'ContractAddressLine2', readonly: true, disabled: true, required: false },
            { name: 'ContractAnnualValue', readonly: true, disabled: true, required: false },
            { name: 'ContractAddressLine3', readonly: true, disabled: true, required: false },
            { name: 'ContractCommenceDate', readonly: true, disabled: true, required: false },
            { name: 'ContractAddressLine4', readonly: true, disabled: true, required: false },
            { name: 'ContractDurationCode', readonly: true, disabled: true, required: false },
            { name: 'ContractAddressLine5', readonly: true, disabled: true, required: false },
            { name: 'ContractPostcode', readonly: true, disabled: true, required: false },
            { name: 'InvoiceFrequencyCode', readonly: true, disabled: false, required: true },
            { name: 'InvoiceFrequencyDesc', readonly: true, disabled: true, required: false },
            { name: 'InvoiceFrequencyChargeInd', readonly: false, disabled: false, required: false },
            { name: 'AdvanceInvoiceInd', readonly: true, disabled: false, required: false },
            { name: 'InvoiceFrequencyChargeValue', readonly: false, disabled: false, required: false },
            { name: 'BranchOption', readonly: true, disabled: true, required: false },
            { name: 'LastChangeEffectiveDate', readonly: false, disabled: false, required: true }
        ];
        this.pageId = PageIdentifier.ICABSAINVOICEDETAILSMAINTENANCE;
        this.contractSearchComponent = ContractSearchComponent;
        this.invoiceFreqComponent = InvoiceFrequencySearchComponent;
    }
    InvoiceDetailsMaintainanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;
        this.riMaintenance.FunctionAdd = false;
        this.riMaintenance.FunctionDelete = false;
        switch (this.parentMode) {
            case 'InvoiceTypeChange':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.setupDetails(this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
                break;
        }
    };
    ;
    InvoiceDetailsMaintainanceComponent.prototype.ngAfterViewInit = function () {
        this.autoOpen = true;
    };
    InvoiceDetailsMaintainanceComponent.prototype.checkContractType = function () {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.inputParams.search = this.search;
        var formdata = {};
        formdata['Function'] = 'CheckContractType';
        formdata['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            if (error.errorMessage) {
                _this.errorService.emitError({
                    msg: error.errorMessage
                });
                return;
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoiceDetailsMaintainanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    InvoiceDetailsMaintainanceComponent.prototype.onContractDataReceived = function (data) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', data.AccountNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceFrequencyCode', data.InvoiceFrequencyCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractCommenceDate', this.changeDateFormat(data.ContractCommenceDate));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'Status', data.PortfolioStatusDesc);
        this.backUpObject.InvoiceFrequencyCode = data.InvoiceFrequencyCode;
        this.backUpObject.InvoiceAnnivarsaryDate = data.InvoiceAnnivDate;
        this.InvoiceAnnivarsaryDate = data.InvoiceAnnivDate;
        this.NegBranchNumber = data.NegBranchNumber;
        this.ContractExpiryDate = data.ContractExpiryDate;
        this.ContractROWID = data.ttContract;
        this.checkContractType();
        this.invoiceFreqValue = false;
        this.dollokupForAccount();
    };
    InvoiceDetailsMaintainanceComponent.prototype.setupDetails = function (contractNumber) {
        var _this = this;
        var loopUpIpContract = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode,
                    'ContractNumber': contractNumber
                },
                'fields': ['InvoiceFrequencyChargeInd', 'AdvanceInvoiceInd', 'ContractAnnualValue', 'InvoiceFrequencyChargeValue', 'ContractDurationCode', 'ContractNumber', 'ContractName', 'AccountNumber', 'InvoiceFrequencyCode', 'ContractCommenceDate', 'Status', 'NegBranchNumber', 'PortfolioStatusDesc', 'InvoiceAnnivDate', 'ContractExpiryDate', 'ttContract']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(loopUpIpContract).subscribe(function (data) {
            var Contract = data[0][0];
            if (Contract) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractNumber', Contract.ContractNumber);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', Contract.ContractName);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AccountNumber', Contract.AccountNumber);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceFrequencyCode', Contract.InvoiceFrequencyCode);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractCommenceDate', _this.changeDateFormat(Contract.ContractCommenceDate));
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'Status', Contract.PortfolioStatusDesc);
                _this.NegBranchNumber = Contract.NegBranchNumber;
                _this.InvoiceAnnivarsaryDate = data.InvoiceAnnivDate;
                _this.ContractExpiryDate = data.ContractExpiryDate;
                _this.ContractROWID = Contract.ttContract;
                _this.checkContractType();
                _this.invoiceFreqValue = false;
                _this.dollokupForAccount();
            }
        });
    };
    InvoiceDetailsMaintainanceComponent.prototype.dollokupForAccount = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Account',
                'query': {
                    'BusinessCode': this.businessCode,
                    'AccountNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber')
                },
                'fields': ['AccountName', 'AccountAddressLine1', 'AccountAddressLine2', 'AccountAddressLine3', 'AccountAddressLine4', 'AccountAddressLine5', 'AccountPOstCode']
            },
            {
                'table': 'SystemInvoiceFrequency',
                'query': {
                    'BusinessCode': this.businessCode,
                    'InvoiceFrequencyCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceFrequencyCode')
                },
                'fields': ['InvoiceFrequencyDesc']
            },
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode,
                    'BranchNumber': this.NegBranchNumber
                },
                'fields': ['BranchName']
            },
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode,
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')
                },
                'fields': ['InvoiceFrequencyChargeInd', 'AdvanceInvoiceInd', 'ContractAnnualValue', 'InvoiceFrequencyChargeValue', 'ContractDurationCode', 'ContractNumber', 'ContractName', 'AccountNumber', 'InvoiceFrequencyCode', 'ContractCommenceDate', 'Status', 'LastChangeEffectDate']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var Account = data[0][0];
            if (Account) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AccountName', Account.AccountName);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractAddressLine1', Account.AccountAddressLine1);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractAddressLine2', Account.AccountAddressLine2);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractAddressLine3', Account.AccountAddressLine3);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractAddressLine4', Account.AccountAddressLine4);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractPostcode', Account.AccountPostcode);
            }
            var SystemInvoiceFrequency = data[1][0];
            if (SystemInvoiceFrequency) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceFrequencyDesc', SystemInvoiceFrequency.InvoiceFrequencyDesc);
                _this.backUpObject.InvoiceFrequencyDesc = SystemInvoiceFrequency.InvoiceFrequencyDesc;
            }
            var Branch = data[2][0];
            if (Branch) {
                _this.BranchOption.push({ 'text': _this.NegBranchNumber + '-' + Branch.BranchName, 'value': _this.NegBranchNumber });
            }
            var Contract = data[3][0];
            if (Contract) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AdvanceInvoiceInd', Contract.AdvanceInvoiceInd);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceFrequencyChargeInd', Contract.InvoiceFrequencyChargeInd);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractAnnualValue', Contract.ContractAnnualValue);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceFrequencyChargeValue', Contract.InvoiceFrequencyChargeValue);
                _this.backUpObject.AdvanceInvoiceInd = Contract.AdvanceInvoiceInd;
                _this.LastChangeEffectDate = Contract.LastChangeEffectDate;
                _this.contractDurationCode = Contract.ContractDurationCode;
                if (_this.contractDurationCode == null) {
                    _this.contractDurationHide = false;
                }
                else {
                    _this.contractDurationHide = true;
                }
                _this.setDate();
            }
        });
    };
    InvoiceDetailsMaintainanceComponent.prototype.setDate = function () {
        if (this.InvoiceAnnivarsaryDate) {
            if (window['moment'](this.InvoiceAnnivarsaryDate, 'DD/MM/YYYY', true).isValid()) {
                this.InvoiceAnnivarsaryDateDisplay = this.utils.convertDate(this.InvoiceAnnivarsaryDate);
            }
            else {
                this.InvoiceAnnivarsaryDateDisplay = this.utils.convertDate(this.changeDateFormat(this.InvoiceAnnivarsaryDate));
            }
        }
        else {
            this.InvoiceAnnivarsaryDateDisplay = null;
        }
        if (!this.InvoiceAnnivarsaryDateDisplay) {
            this.InvoiceAnnivDate = null;
        }
        else {
            this.InvoiceAnnivDate = new Date(this.InvoiceAnnivarsaryDateDisplay);
            if (!window['moment'](this.InvoiceAnnivarsaryDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                this.InvoiceAnnivarsaryDateDisplay = this.utils.formatDate(new Date(this.InvoiceAnnivarsaryDateDisplay));
            }
        }
        if (this.ContractExpiryDate) {
            if (window['moment'](this.ContractExpiryDate, 'DD/MM/YYYY', true).isValid()) {
                this.ContractExpiryDateDisplay = this.utils.convertDate(this.ContractExpiryDate);
            }
            else {
                this.ContractExpiryDateDisplay = this.utils.formatDate(new Date(this.ContractExpiryDate));
            }
        }
        else {
            this.ContractExpiryDateDisplay = null;
        }
        if (!this.ContractExpiryDateDisplay) {
            this.ContractExpiryDatePicker = null;
        }
        else {
            this.ContractExpiryDatePicker = new Date(this.ContractExpiryDateDisplay);
            if (!window['moment'](this.ContractExpiryDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                this.ContractExpiryDateDisplay = this.utils.formatDate(new Date(this.ContractExpiryDateDisplay));
            }
        }
        if (this.LastChangeEffectDate) {
            if (window['moment'](this.LastChangeEffectDate, 'DD/MM/YYYY', true).isValid()) {
                this.LastChangeEffectDateDisplay = this.utils.convertDate(this.LastChangeEffectDate);
            }
            else {
                this.LastChangeEffectDateDisplay = this.utils.formatDate(new Date(this.LastChangeEffectDate));
            }
        }
        else {
            this.LastChangeEffectDateDisplay = null;
        }
        if (!this.LastChangeEffectDateDisplay) {
            this.LastChangeEffectDatePicker = null;
        }
        else {
            this.LastChangeEffectDatePicker = new Date(this.LastChangeEffectDateDisplay);
            if (!window['moment'](this.LastChangeEffectDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                this.LastChangeEffectDateDisplay = this.utils.formatDate(new Date(this.LastChangeEffectDateDisplay));
            }
        }
    };
    InvoiceDetailsMaintainanceComponent.prototype.hideShoWvalue = function () {
        if (this.riExchange.ClientSideValues.Fetch('FullAccess') === 'Full' || this.riExchange.ClientSideValues.Fetch('BranchNumber') === this.NegBranchNumber) {
            this.annumalValuehide = true;
        }
        else {
            this.annumalValuehide = false;
        }
    };
    InvoiceDetailsMaintainanceComponent.prototype.onInvoiceFreq = function (data) {
        this.riExchange_CBORequest(data);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceFrequencyCode', data.InvoiceFrequencyCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceFrequencyDesc', data.InvoiceFrequencyDesc);
    };
    InvoiceDetailsMaintainanceComponent.prototype.riExchange_CBORequest = function (data) {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.inputParams.search = this.search;
        var formdata = {};
        formdata['Function'] = 'GetInvoiceFrequencyCharge';
        formdata['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        formdata['InvoiceFrequencyCode'] = data.InvoiceFrequencyCode;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.hasOwnProperty('errorMessage')) {
                _this.errorModal.show(data, true);
            }
            else {
                if (data.InvoiceFrequencyChargeInd === 'no') {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceFrequencyChargeInd', false);
                    _this.invoiceFreqValueHide = false;
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceFrequencyChargeValue', data.InvoiceFrequencyChargeValue);
                    _this.invoiceFreqValue = false;
                }
                else {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceFrequencyChargeInd', true);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceFrequencyChargeValue', data.InvoiceFrequencyChargeValue);
                    _this.invoiceFreqValueHide = true;
                    _this.invoiceFreqValue = true;
                }
            }
        }, function (error) {
            if (error.errorMessage) {
                _this.errorService.emitError({
                    msg: error.errorMessage
                });
                return;
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoiceDetailsMaintainanceComponent.prototype.AdvanceInvoiceIndChange = function (event) {
        if (event.target.checked) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AdvanceInvoiceInd', true);
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AdvanceInvoiceInd', false);
        }
    };
    InvoiceDetailsMaintainanceComponent.prototype.InvoiceAnnivDateSelectedValue = function (value) {
        this.InvoiceAnnivarsaryDate = value.value;
        if (this.InvoiceAnnivarsaryDate) {
            if (window['moment'](this.InvoiceAnnivarsaryDate, 'DD/MM/YYYY', true).isValid()) {
                this.InvoiceAnnivarsaryDateDisplay = this.utils.convertDate(this.InvoiceAnnivarsaryDate);
            }
            else {
                this.InvoiceAnnivarsaryDateDisplay = this.utils.formatDate(new Date(this.InvoiceAnnivarsaryDate));
            }
        }
        else {
            this.InvoiceAnnivarsaryDateDisplay = null;
        }
        if (!this.InvoiceAnnivarsaryDateDisplay) {
            this.InvoiceAnnivDate = null;
        }
        else {
            this.InvoiceAnnivDate = new Date(this.InvoiceAnnivarsaryDateDisplay);
            if (!window['moment'](this.InvoiceAnnivarsaryDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                this.InvoiceAnnivarsaryDateDisplay = this.utils.formatDate(new Date(this.InvoiceAnnivarsaryDateDisplay));
            }
        }
    };
    InvoiceDetailsMaintainanceComponent.prototype.ContractExpiryDateSelectedValue = function (value) {
        this.ContractExpiryDate = value.value;
        if (this.ContractExpiryDate) {
            if (window['moment'](this.ContractExpiryDate, 'DD/MM/YYYY', true).isValid()) {
                this.ContractExpiryDateDisplay = this.utils.convertDate(this.ContractExpiryDate);
            }
            else {
                this.ContractExpiryDateDisplay = this.utils.formatDate(new Date(this.ContractExpiryDate));
            }
        }
        else {
            this.ContractExpiryDateDisplay = null;
        }
        if (!this.ContractExpiryDateDisplay) {
            this.ContractExpiryDatePicker = null;
        }
        else {
            this.ContractExpiryDatePicker = new Date(this.ContractExpiryDateDisplay);
            if (!window['moment'](this.ContractExpiryDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                this.ContractExpiryDateDisplay = this.utils.formatDate(new Date(this.ContractExpiryDateDisplay));
            }
        }
    };
    InvoiceDetailsMaintainanceComponent.prototype.LastChangeEffectDateSelectedValue = function (value) {
        if (value && value.value) {
            this.LastChangeEffectDate = value.value;
            this.uiForm.controls['LastChangeEffectiveDate'].setValue(value.value);
            if (this.LastChangeEffectDate) {
                if (window['moment'](this.LastChangeEffectDate, 'DD/MM/YYYY', true).isValid()) {
                    this.LastChangeEffectDateDisplay = this.utils.convertDate(this.LastChangeEffectDate);
                }
                else {
                    this.LastChangeEffectDateDisplay = this.utils.formatDate(new Date(this.LastChangeEffectDate));
                }
            }
            else {
                this.LastChangeEffectDateDisplay = null;
            }
            if (!this.LastChangeEffectDateDisplay) {
                this.LastChangeEffectDatePicker = null;
            }
            else {
                this.LastChangeEffectDatePicker = new Date(this.LastChangeEffectDateDisplay);
                if (!window['moment'](this.LastChangeEffectDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                    this.LastChangeEffectDateDisplay = this.utils.formatDate(new Date(this.LastChangeEffectDateDisplay));
                }
            }
        }
    };
    InvoiceDetailsMaintainanceComponent.prototype.InvoiceFrequencyChargeIndChange = function (event) {
        if (event.target.checked) {
            this.invoiceFreqValueHide = true;
        }
        else {
            this.invoiceFreqValueHide = false;
        }
    };
    InvoiceDetailsMaintainanceComponent.prototype.onCancelClick = function (event) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceFrequencyCode', this.backUpObject.InvoiceFrequencyCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceFrequencyDesc', this.backUpObject.InvoiceFrequencyDesc);
        this.InvoiceAnnivarsaryDate = this.backUpObject.InvoiceAnnivarsaryDate;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AdvanceInvoiceInd', this.backUpObject.AdvanceInvoiceInd);
        this.LastChangeEffectDate = null;
        this.lastChangeEffectiveDate.resetDateField();
        this.setDate();
    };
    InvoiceDetailsMaintainanceComponent.prototype.onSaveValue = function () {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        this.inputParams.search = this.search;
        var formdata = {};
        formdata['ContractROWID'] = this.ContractROWID;
        formdata['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        formdata['InvoiceFrequencyCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceFrequencyCode');
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceFrequencyChargeInd')) {
            formdata['InvoiceFrequencyChargeInd'] = 'yes';
        }
        else {
            formdata['InvoiceFrequencyChargeInd'] = 'no';
        }
        formdata['InvoiceFrequencyChargeValue'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceFrequencyChargeValue');
        formdata['InvoiceAnnivDate'] = this.InvoiceAnnivarsaryDate;
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AdvanceInvoiceInd')) {
            formdata['AdvanceInvoiceInd'] = 'yes';
        }
        else {
            formdata['AdvanceInvoiceInd'] = 'no';
        }
        formdata['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
        formdata['AccountNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber');
        formdata['ContractAnnualValue'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractAnnualValue');
        formdata['ContractCommenceDate'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractCommenceDate');
        formdata['LastChangeEffectDate'] = this.LastChangeEffectDate;
        formdata['ContractDurationCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractDurationCode');
        if (this.ContractExpiryDate === null) {
            formdata['ContractExpiryDate'] = '';
        }
        else {
            formdata['ContractExpiryDate'] = this.ContractExpiryDate;
        }
        formdata['NegBranchNumber'] = this.NegBranchNumber;
        formdata['Function'] = 'GetStatus';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(function (data) {
            if (data.hasOwnProperty('errorMessage')) {
                _this.errorModal.show({ msg: data.errorMessage, title: 'Error' }, false);
            }
            else {
                _this.errorModal.show({
                    msg: MessageConstant.Message.RecordSavedSuccessfully
                }, false);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            if (error.errorMessage) {
                _this.errorService.emitError({
                    msg: error.errorMessage
                });
                return;
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoiceDetailsMaintainanceComponent.prototype.onSubmit = function (formObj, e) {
        event.preventDefault();
        this.uiForm.controls['LastChangeEffectiveDate'].markAsTouched();
        this.uiForm.controls['InvoiceFrequencyCode'].markAsTouched();
        this.lastChangeEffectiveDate.validateDateField();
        if (this.uiForm.valid) {
            this.lookUpSystemInvoiceFrequency();
        }
    };
    InvoiceDetailsMaintainanceComponent.prototype.promptSave = function (event) {
        this.onSaveValue();
    };
    InvoiceDetailsMaintainanceComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show({ msg: data.msg, title: 'Error' }, false);
    };
    InvoiceDetailsMaintainanceComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };
    InvoiceDetailsMaintainanceComponent.prototype.onContractNumberTabOut = function (event) {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': event.target.value
                },
                'fields': ['ContractNumber', 'ContractName', 'AccountNumber', 'InvoiceFrequencyCode', 'ContractCommenceDate', 'Status', 'InvoiceFrequencyCode', 'InvoiceAnnivDate', 'NegBranchNumber', 'ContractExpiryDate', 'ttContract', 'PortfolioStatusCode']
            }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var Contract = data[0][0];
            if (Contract) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractNumber', Contract.ContractNumber);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', Contract.ContractName);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AccountNumber', Contract.AccountNumber);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceFrequencyCode', Contract.InvoiceFrequencyCode);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractCommenceDate', _this.changeDateFormat(Contract.ContractCommenceDate));
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'Status', Contract.PortfolioStatusDesc);
                _this.backUpObject.InvoiceFrequencyCode = Contract.InvoiceFrequencyCode;
                _this.backUpObject.InvoiceAnnivarsaryDate = Contract.InvoiceAnnivDate;
                _this.InvoiceAnnivarsaryDate = Contract.InvoiceAnnivDate;
                _this.NegBranchNumber = Contract.NegBranchNumber;
                _this.ContractExpiryDate = Contract.ContractExpiryDate;
                _this.ContractROWID = Contract.ttContract;
                _this.invoiceFreqValue = false;
                _this.lookUpPortfolioStatus(Contract.PortfolioStatusCode);
            }
        });
    };
    InvoiceDetailsMaintainanceComponent.prototype.lookUpPortfolioStatus = function (code) {
        var _this = this;
        var lookupIP = [
            {
                'table': 'PortfolioStatus',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'PortfolioStatusCode': code
                },
                'fields': ['PortfolioStatusSystemDesc']
            }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var PortfolioStatus = data[0][0];
            if (PortfolioStatus) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'Status', PortfolioStatus.PortfolioStatusSystemDesc);
                _this.checkContractType();
                _this.dollokupForAccount();
            }
        });
    };
    InvoiceDetailsMaintainanceComponent.prototype.lookUpSystemInvoiceFrequency = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'SystemInvoiceFrequency',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'InvoiceFrequencyCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceFrequencyCode')
                },
                'fields': ['InvoiceFrequencyDesc']
            }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var SystemInvoiceFrequency = data[0][0];
            if (SystemInvoiceFrequency) {
                _this.promptModal.show();
            }
            else {
                _this.invoiceFreqValidation = true;
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceFrequencyDesc', '');
            }
        });
    };
    InvoiceDetailsMaintainanceComponent.prototype.lookUpSystemInvoiceFrequency1 = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'SystemInvoiceFrequency',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'InvoiceFrequencyCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceFrequencyCode')
                },
                'fields': ['InvoiceFrequencyDesc']
            }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var SystemInvoiceFrequency = data[0][0];
            if (SystemInvoiceFrequency) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceFrequencyDesc', SystemInvoiceFrequency.InvoiceFrequencyDesc);
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceFrequencyDesc', '');
            }
        });
    };
    InvoiceDetailsMaintainanceComponent.prototype.changeDateFormat = function (inputDate) {
        if (inputDate.indexOf('-') > -1) {
            var splitDate = inputDate.split('-');
            var year = splitDate[0];
            var month = splitDate[1];
            var day = splitDate[2];
            inputDate = day + '/' + month + '/' + year;
        }
        return inputDate;
    };
    InvoiceDetailsMaintainanceComponent.prototype.onInvoiceFrequencyCodeTabOut = function (event) {
        var data = {};
        data['InvoiceFrequencyCode'] = event.target.value;
        this.lookUpSystemInvoiceFrequency1();
        this.riExchange_CBORequest(data);
    };
    InvoiceDetailsMaintainanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAInvoiceDetailsMaintenance.html',
                    styles: [
                        ".red-bdr span {border-color: transparent !important;}\n        .btn-secondary {\n            background: #fff;\n            border-radius: 0px;\n            border: 1px solid #ffffff !important;\n            color: #007dc5;\n        }\n    "]
                },] },
    ];
    InvoiceDetailsMaintainanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    InvoiceDetailsMaintainanceComponent.propDecorators = {
        'invoiceAnniDate': [{ type: ViewChild, args: ['invoiceAnniDate',] },],
        'lastChangeEffectiveDate': [{ type: ViewChild, args: ['lastChangeEffectiveDate',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return InvoiceDetailsMaintainanceComponent;
}(BaseComponent));
