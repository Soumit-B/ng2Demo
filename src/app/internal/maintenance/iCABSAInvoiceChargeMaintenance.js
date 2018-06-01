var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Router } from '@angular/router';
import { MessageConstant } from './../../../shared/constants/message.constant';
export var InvoiceChargeMaintenanceComponent = (function (_super) {
    __extends(InvoiceChargeMaintenanceComponent, _super);
    function InvoiceChargeMaintenanceComponent(injector, _router, el) {
        _super.call(this, injector);
        this._router = _router;
        this.el = el;
        this.showMessageHeader = true;
        this.pageId = '';
        this.controls = [
            { name: 'ContractNumber', readonly: false, disabled: true, required: false },
            { name: 'ContractName', readonly: false, disabled: false, required: false },
            { name: 'PremiseNumber', readonly: false, disabled: true, required: false },
            { name: 'PremiseName', readonly: false, disabled: false, required: false },
            { name: 'ContractInvoiceChargeNumber', readonly: false, disabled: false, required: false },
            { name: 'InvoiceChargeValue', readonly: false, disabled: false, required: true },
            { name: 'InvoiceChargeDesc', readonly: false, disabled: false, required: true },
            { name: 'InvoiceChargeDesc', readonly: false, disabled: false, required: true },
            { name: 'InvoiceChargeType' },
            { name: 'TaxCodeType' },
            { name: 'EffectiveDate', required: true }
        ];
        this.showHeader = true;
        this.isRequesting = false;
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        this.promptConfirmModalDeleteContent = MessageConstant.Message.DeleteRecord;
        this.dateObjectsValidate = {
            effectiveDate: false,
            inactiveEffectDate: false
        };
        this.clearDate = {
            effectiveDate: false,
            inactiveEffectDate: false
        };
        this.taxCodeInputParams = {
            'parentMode': 'LookUp',
            'businessCode': this.utils.getLogInBusinessCode(),
            'countryCode': this.utils.getCountryCode(),
            'action': 0
        };
        this.invoiceChargeTypeInputParams = {
            'parentMode': 'LookUp',
            'businessCode': this.utils.getLogInBusinessCode(),
            'countryCode': this.utils.getCountryCode(),
            'action': 0
        };
        this.queryParams = {
            operation: 'Application/iCABSAInvoiceChargeMaintenance',
            module: 'invoicing',
            method: 'bill-to-cash/maintenance'
        };
        this.pageId = PageIdentifier.ICABSAINVOICECHARGEMAINTENANCE;
    }
    ;
    InvoiceChargeMaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        var strDocTitle = 'Invoice Charge Maintenance';
        this.getTranslatedValue(strDocTitle, null).subscribe(function (res) {
            if (res) {
                strDocTitle = res;
            }
            _this.utils.setTitle(strDocTitle);
        });
        this.window_onload();
    };
    InvoiceChargeMaintenanceComponent.prototype.window_onload = function () {
        var _this = this;
        if (this.formData['ContractNumber']) {
            this.populateUIFromFormData();
        }
        this.noRecordSelected = 'No record is selected.';
        this.getTranslatedValue(this.noRecordSelected, null).subscribe(function (res) {
            if (res) {
                _this.noRecordSelected = res;
            }
        });
        var businessCode = this.utils.getBusinessCode(), countryCode = this.utils.getCountryCode();
        this.parentMode = this.riExchange.routerParams['parentMode'];
        this.CurrentContractType = this.utils.getCurrentContractType(this.riExchange.routerParams['CurrentContractTypeURLParameter']);
        this.setControlValue('ContractInvoiceChargeNumber', this.riExchange.routerParams['ContractInvoiceChargeNumber']);
        this.CurrentContractTypeLabel = this.utils.getCurrentContractLabel(this.CurrentContractType);
        this.NumberLab = this.CurrentContractTypeLabel + 'Number';
        this.trPremiseNumber = false;
        switch (this.parentMode) {
            case 'Contract':
            case 'Contract-Add':
                this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
                break;
            case 'Premise':
            case 'Premise-Add':
                this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
                this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
                this.trPremiseNumber = true;
                break;
        }
        if (this.parentMode === 'Contract' || this.parentMode === 'Premise') {
            setTimeout(function () {
                _this.setFormMode(_this.c_s_MODE_UPDATE);
            }, 200);
            this.contractInvoiceChargeROWID = this.riExchange.routerParams['ContractInvoiceCharge'];
            this.callContractInvoiceChargeNumberLookupData();
        }
        switch (this.parentMode) {
            case 'Contract':
                this.callContractNumberLookupData();
                break;
            case 'Premise':
                this.callContractNumberLookupData();
                this.callPremiseNumberLookupData();
                break;
        }
        if (this.parentMode === 'Contract-Add' || this.parentMode === 'Premise-Add') {
            setTimeout(function () {
                _this.setFormMode(_this.c_s_MODE_ADD);
            }, 200);
            this.crudMode = 'ADD';
            this.callSystemInvoiceChargeTypeLangLookupData();
            this.callTaxCodeLookupData();
        }
        else {
            this.crudMode = 'UPDATE/DELETE';
        }
        this.disableControl('ContractName', true);
        this.disableControl('PremiseName', true);
    };
    InvoiceChargeMaintenanceComponent.prototype.callContractInvoiceChargeNumberLookupData = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookupIP = [
            {
                'table': 'ContractInvoiceCharge',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractInvoiceChargeROWID': this.contractInvoiceChargeROWID,
                    'ContractInvoiceChargeNumber': this.getControlValue('ContractInvoiceChargeNumber')
                },
                'fields': ['InvoiceChargeTypeCode', 'InvoiceChargeValue', 'InvoiceChargeDesc', 'TaxCode', 'ChargeEffectDate']
            }
        ];
        switch (this.parentMode) {
            case 'Contract':
            case 'Contract-Add':
                lookupIP[0]['query']['ContractNumber'] = this.getControlValue('ContractNumber');
                break;
            case 'Premise':
            case 'Premise-Add':
                lookupIP[0]['query']['ContractNumber'] = this.getControlValue('ContractNumber');
                lookupIP[0]['query']['PremiseNumber'] = this.getControlValue('PremiseNumber');
                break;
        }
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data[0][0]) {
                _this.InvoiceChargeTypeCode = data[0][0].InvoiceChargeTypeCode;
                _this.TaxCode = data[0][0].TaxCode;
                _this.setControlValue('InvoiceChargeValue', data[0][0].InvoiceChargeValue);
                _this.setControlValue('InvoiceChargeDesc', data[0][0].InvoiceChargeDesc);
                _this.setControlValue('EffectiveDate', data[0][0].ChargeEffectDate);
                if (window['moment'](data[0][0].ChargeEffectDate, 'DD/MM/YYYY', true).isValid()) {
                    _this.effectiveDate = new Date(_this.utils.convertDate(data[0][0].ChargeEffectDate));
                }
                else {
                    _this.effectiveDate = new Date(data[0][0].ChargeEffectDate);
                }
                _this.callSystemInvoiceChargeTypeLangLookupData();
                _this.callTaxCodeLookupData();
                _this.setValuesInstoreDataTemp();
            }
            else {
                _this.InvoiceChargeTypeCode = '';
                _this.setControlValue('InvoiceChargeValue', '');
                _this.setControlValue('InvoiceChargeDesc', '');
                _this.TaxCode = '';
                _this.setControlValue('ChargeEffectDate', '');
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoiceChargeMaintenanceComponent.prototype.callContractNumberLookupData = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber')
                },
                'fields': ['ContractNumber', 'ContractName']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data[0][0] && data[0][0].ContractName) {
                _this.setControlValue('ContractName', data[0][0].ContractName);
            }
            else {
                _this.setControlValue('ContractName', '');
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoiceChargeMaintenanceComponent.prototype.callPremiseNumberLookupData = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookupIP = [
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber')
                },
                'fields': ['PremiseNumber', 'PremiseName']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data[0][0] && data[0][0].PremiseName) {
                _this.setControlValue('PremiseName', data[0][0].PremiseName);
            }
            else {
                _this.setControlValue('PremiseName', '');
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoiceChargeMaintenanceComponent.prototype.callSystemInvoiceChargeTypeLangLookupData = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookupIP = [
            {
                'table': 'SystemInvoiceChargeTypeLang',
                'query': {
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['InvoiceChargeTypeCode', 'LanguageCode', 'InvoiceChargeLocalDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data) {
                _this.chargeTypeList = data[0].slice(0, 5);
                if (_this.parentMode === 'Contract-Add' || _this.parentMode === 'Premise-Add') {
                    _this.setControlValue('InvoiceChargeType', _this.chargeTypeList[0]);
                    _this.selectedChargeType('val');
                }
                for (var i in _this.chargeTypeList) {
                    if (_this.chargeTypeList[i]['InvoiceChargeTypeCode'] === _this.InvoiceChargeTypeCode) {
                        _this.setControlValue('InvoiceChargeType', _this.chargeTypeList[i]);
                    }
                }
                _this.setValuesInstoreDataTemp();
            }
            else {
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoiceChargeMaintenanceComponent.prototype.callTaxCodeLookupData = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookupIP = [
            {
                'table': 'TaxCode',
                'query': {},
                'fields': ['TaxCode', 'TaxCodeDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data) {
                _this.taxCodeList = data[0];
                if (_this.parentMode === 'Contract-Add' || _this.parentMode === 'Premise-Add') {
                    _this.setControlValue('TaxCodeType', _this.taxCodeList[0]);
                    _this.TaxCode = _this.getControlValue('TaxCodeType').TaxCode;
                }
                for (var i in _this.taxCodeList) {
                    if (_this.taxCodeList[i]['TaxCode'] === _this.TaxCode) {
                        _this.setControlValue('TaxCodeType', _this.taxCodeList[i]);
                    }
                }
                _this.setValuesInstoreDataTemp();
            }
            else {
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoiceChargeMaintenanceComponent.prototype.riMaintenance_Search = function () {
        switch (this.parentMode) {
            case 'Contract':
            case 'Contract-Add':
                this.navigate('Contract-Search', 'Application/iCABSAInvoiceChargeSearch.htm', {
                    CurrentContractTypeURLParameter: this.CurrentContractType
                });
                break;
            default:
                this.navigate('Premise-Search', 'Application/iCABSAInvoiceChargeSearch.htm', {
                    CurrentContractTypeURLParameter: this.CurrentContractType
                });
                break;
        }
    };
    InvoiceChargeMaintenanceComponent.prototype.selectedChargeType = function (val) {
        this.InvoiceChargeTypeCode = this.getControlValue('InvoiceChargeType').InvoiceChargeTypeCode;
        this.fetchDefaultInvoiceChargeValue();
    };
    InvoiceChargeMaintenanceComponent.prototype.selectedTaxCode = function (val) {
        this.TaxCode = this.getControlValue('TaxCodeType').TaxCode;
    };
    InvoiceChargeMaintenanceComponent.prototype.InvoiceChargeTypeCode_onkeydown = function () {
    };
    InvoiceChargeMaintenanceComponent.prototype.TaxCode_onkeydown = function () {
    };
    InvoiceChargeMaintenanceComponent.prototype.riExchange_CBORequest = function () {
    };
    InvoiceChargeMaintenanceComponent.prototype.effectiveDateSelectedValue = function (value) {
        if (value && value['value']) {
            this.setControlValue('EffectiveDate', value['value']);
        }
        else {
            this.setControlValue('EffectiveDate', '');
        }
    };
    InvoiceChargeMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    InvoiceChargeMaintenanceComponent.prototype.isValidationCheck = function () {
        if (!this.getControlValue('InvoiceChargeType') || this.getControlValue('InvoiceChargeType') !== '' || !this.getControlValue('InvoiceChargeValue') || this.getControlValue('InvoiceChargeValue') !== '' || !this.getControlValue('InvoiceChargeDesc') || this.getControlValue('InvoiceChargeDesc') !== '' || !this.getControlValue('TaxCodeType') || this.getControlValue('TaxCodeType') !== '') {
            if (!this.getControlValue('InvoiceChargeType') || this.getControlValue('InvoiceChargeType') !== '') {
            }
            if (!this.getControlValue('InvoiceChargeValue') || this.getControlValue('InvoiceChargeValue') !== '') {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceChargeValue', true);
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'InvoiceChargeValue', true);
            }
            if (!this.getControlValue('InvoiceChargeDesc') || this.getControlValue('InvoiceChargeDesc') !== '') {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceChargeDesc', true);
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'InvoiceChargeDesc', true);
            }
            if (!this.getControlValue('TaxCodeType') || this.getControlValue('TaxCodeType') !== '') {
            }
            return false;
        }
        else {
            return true;
        }
    };
    InvoiceChargeMaintenanceComponent.prototype.invoiceChargeDescChange = function () {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceChargeDesc', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'InvoiceChargeDesc', false);
    };
    InvoiceChargeMaintenanceComponent.prototype.invoiceChargeValueChange = function () {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceChargeValue', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'InvoiceChargeValue', false);
    };
    InvoiceChargeMaintenanceComponent.prototype.saveClicked = function () {
        this.isValidationCheck();
        this.datepck.validateDateField();
        if (this.riExchange.validateForm(this.uiForm)) {
            if (!this.contractInvoiceChargeROWID && this.crudMode === 'UPDATE/DELETE') {
                this.errorModal.show({ msg: this.noRecordSelected, title: '' }, false);
            }
            else {
                this.promptConfirmModal.show();
            }
        }
    };
    InvoiceChargeMaintenanceComponent.prototype.deleteClicked = function () {
        if (!this.contractInvoiceChargeROWID && this.crudMode === 'UPDATE/DELETE') {
            this.errorModal.show({ msg: this.noRecordSelected, title: '' }, false);
        }
        else {
            this.promptConfirmModalDelete.show();
        }
    };
    InvoiceChargeMaintenanceComponent.prototype.addClicked = function () {
        this.crudMode = 'ADD';
        this.clearFields();
    };
    InvoiceChargeMaintenanceComponent.prototype.cancelClicked = function () {
        var _this = this;
        if (this.crudMode === 'ADD') {
            this.clearFields();
            setTimeout(function () {
                _this.setFormMode(_this.c_s_MODE_UPDATE);
            }, 200);
        }
        else {
            this.restoreFieldsOnCancel();
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceChargeValue', true);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'InvoiceChargeValue', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceChargeDesc', true);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'InvoiceChargeDesc', false);
        }
    };
    InvoiceChargeMaintenanceComponent.prototype.clearFields = function () {
        var _this = this;
        this.datepck.resetDateField();
        this.setControlValue('InvoiceChargeType', '');
        this.setControlValue('TaxCodeType', '');
        this.setControlValue('InvoiceChargeDesc', '');
        this.setControlValue('InvoiceChargeValue', '');
        this.setControlValue('EffectiveDate', '');
        this.effectiveDate = null;
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceChargeValue', false);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'InvoiceChargeValue', false);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceChargeDesc', false);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'InvoiceChargeDesc', false);
        setTimeout(function () {
            _this.effectiveDate = void 0;
        }, 200);
        this.TaxCode = '';
        this.InvoiceChargeTypeCode = '';
        this.setControlValue('InvoiceChargeType', this.chargeTypeList[0]);
        this.selectedChargeType('val');
        this.setControlValue('TaxCodeType', this.taxCodeList[0]);
        this.TaxCode = this.getControlValue('TaxCodeType').TaxCode;
    };
    InvoiceChargeMaintenanceComponent.prototype.promptConfirm = function (type) {
        switch (this.crudMode) {
            case 'UPDATE/DELETE':
                if (type === 'update') {
                    this.updateRecord();
                }
                else {
                    this.deleteRecord();
                }
                break;
            case 'ADD':
                this.saveNewRecord();
                break;
        }
    };
    InvoiceChargeMaintenanceComponent.prototype.saveNewRecord = function () {
        var _this = this;
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '1');
        var postParams = {};
        postParams.ContractNumber = this.getControlValue('ContractNumber');
        postParams.ContractInvoiceChargeNumber = '';
        postParams.InvoiceChargeTypeCode = this.InvoiceChargeTypeCode;
        postParams.InvoiceChargeValue = this.getControlValue('InvoiceChargeValue');
        postParams.InvoiceChargeDesc = this.getControlValue('InvoiceChargeDesc');
        postParams.TaxCode = this.TaxCode;
        postParams.ChargeEffectDate = this.getControlValue('EffectiveDate');
        postParams.Function = 'GetDefaultChargeValue';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorModal.show({ msg: e['errorMessage'], title: '' }, false);
                }
                else {
                    _this.errorModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: '' }, false);
                    _this.contractInvoiceChargeROWID = e.ContractInvoiceCharge;
                    _this.setControlValue('ContractInvoiceChargeNumber', e.ContractInvoiceChargeNumber);
                    _this.crudMode = 'UPDATE/DELETE';
                    setTimeout(function () {
                        _this.setFormMode(_this.c_s_MODE_UPDATE);
                    }, 200);
                    _this.setValuesInstoreDataTemp();
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoiceChargeMaintenanceComponent.prototype.updateRecord = function () {
        var _this = this;
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '2');
        var postParams = {};
        postParams.ContractInvoiceChargeROWID = this.contractInvoiceChargeROWID;
        postParams.ContractNumber = this.getControlValue('ContractNumber');
        postParams.ContractInvoiceChargeNumber = this.getControlValue('ContractInvoiceChargeNumber');
        postParams.InvoiceChargeTypeCode = this.InvoiceChargeTypeCode;
        postParams.InvoiceChargeValue = this.getControlValue('InvoiceChargeValue');
        postParams.InvoiceChargeDesc = this.getControlValue('InvoiceChargeDesc');
        postParams.TaxCode = this.TaxCode;
        postParams.ChargeEffectDate = this.getControlValue('EffectiveDate');
        postParams.Function = 'GetDefaultChargeValue';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorModal.show({ msg: e['errorMessage'], title: '' }, false);
                }
                else {
                    _this.errorModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: '' }, false);
                    _this.setValuesInstoreDataTemp();
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoiceChargeMaintenanceComponent.prototype.deleteRecord = function () {
        var _this = this;
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '3');
        var postParams = {};
        postParams.ContractInvoiceChargeROWID = this.contractInvoiceChargeROWID;
        postParams.ContractNumber = this.getControlValue('ContractNumber');
        postParams.ContractInvoiceChargeNumber = this.getControlValue('ContractInvoiceChargeNumber');
        postParams.Function = 'GetDefaultChargeValue';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorModal.show({ msg: e['errorMessage'], title: '' }, false);
                }
                else {
                    _this.errorModal.show({ msg: MessageConstant.Message.RecordDeletedSuccessfully, title: '' }, false);
                    _this.crudMode = 'ADD';
                    _this.clearFields();
                    _this.contractInvoiceChargeROWID = null;
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoiceChargeMaintenanceComponent.prototype.fetchDefaultInvoiceChargeValue = function () {
        var _this = this;
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        var postParams = {};
        postParams.InvoiceChargeTypeCode = this.InvoiceChargeTypeCode;
        postParams.Function = 'GetDefaultChargeValue';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorModal.show({ msg: e['errorMessage'], title: '' }, false);
                }
                else {
                    _this.setControlValue('InvoiceChargeValue', e.InvoiceChargeValue);
                    _this.riExchange.riInputElement.SetRequiredStatus(_this.uiForm, 'InvoiceChargeValue', false);
                    _this.riExchange.riInputElement.SetErrorStatus(_this.uiForm, 'InvoiceChargeValue', false);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoiceChargeMaintenanceComponent.prototype.setValuesInstoreDataTemp = function () {
        this.storeDataTemp = this.uiForm.getRawValue();
        this.storeDataTemp['TaxCode'] = this.TaxCode;
        this.storeDataTemp['InvoiceChargeTypeCode'] = this.InvoiceChargeTypeCode;
        this.storeDataTemp['ContractInvoiceChargeROWID'] = this.contractInvoiceChargeROWID;
    };
    InvoiceChargeMaintenanceComponent.prototype.restoreFieldsOnCancel = function () {
        for (var key in this.uiForm.controls) {
            if (key && this.uiForm.controls.hasOwnProperty(key)) {
                this.uiForm.controls[key].markAsPristine();
                this.setControlValue(key, this.storeDataTemp[key]);
            }
        }
        this.TaxCode = this.storeDataTemp['TaxCode'];
        this.InvoiceChargeTypeCode = this.storeDataTemp['InvoiceChargeTypeCode'];
        this.contractInvoiceChargeROWID = this.storeDataTemp['ContractInvoiceChargeROWID'];
        this.effectiveDate = new Date(this.utils.convertDate(this.getControlValue('EffectiveDate')));
    };
    InvoiceChargeMaintenanceComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    InvoiceChargeMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAInvoiceChargeMaintenance.html'
                },] },
    ];
    InvoiceChargeMaintenanceComponent.ctorParameters = [
        { type: Injector, },
        { type: Router, },
        { type: ElementRef, },
    ];
    InvoiceChargeMaintenanceComponent.propDecorators = {
        'promptConfirmModal': [{ type: ViewChild, args: ['promptConfirmModal',] },],
        'promptConfirmModalDelete': [{ type: ViewChild, args: ['promptConfirmModalDelete',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
        'datepck': [{ type: ViewChild, args: ['datepck',] },],
    };
    return InvoiceChargeMaintenanceComponent;
}(BaseComponent));
