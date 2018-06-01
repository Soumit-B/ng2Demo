var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, ViewChild, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseComponent } from './../../base/BaseComponent';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { TaxcodeSearchComponent } from './../../internal/search/iCABSSTaxCodeSearch';
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';
export var InvoiceRangeMaintenanceComponent = (function (_super) {
    __extends(InvoiceRangeMaintenanceComponent, _super);
    function InvoiceRangeMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.hideDeleteButton = true;
        this.hiddenTaxRange = false;
        this.pageTitle = '';
        this.showErrorHeader = true;
        this.inputParams = {};
        this.contractTypeinputParams = {};
        this.inputParamsBranch = {};
        this.inputParamsCompanySearch = {};
        this.search = new URLSearchParams();
        this.promptTitleSave = '';
        this.promptTitleDelete = '';
        this.promptContentSave = MessageConstant.Message.ConfirmRecord;
        this.promptContentDelete = MessageConstant.Message.DeleteRecord;
        this.TaxcodeSearchComponent = TaxcodeSearchComponent;
        this.ScreenNotReadyComponent = ScreenNotReadyComponent;
        this.vSCEnableTaxInvoiceRange = false;
        this.isRequesting = false;
        this.cancelholdingData = {};
        this.promptModalConfigSave = {
            ignoreBackdropClick: true
        };
        this.promptModalConfigDelete = {
            ignoreBackdropClick: true
        };
        this.companyDefault = {
            id: '',
            text: ''
        };
        this.negBranchNumberSelected = {
            id: '',
            text: ''
        };
        this.InvoiceCreditSelectList = [
            { text: '', value: '' },
            { text: 'Invoice', value: 'I' },
            { text: 'Credit', value: 'C' }
        ];
        this.queryParams = {
            module: 'invoicing',
            operation: 'Business/iCABSBInvoiceRangeMaintenance',
            method: 'bill-to-cash/admin'
        };
        this.controls = [
            { name: 'InvoiceRangeNumber', disabled: true, required: false },
            { name: 'ActiveRangeInd', disabled: false, required: false },
            { name: 'InvoiceRangeDesc', disabled: false, required: false },
            { name: 'CompanyCode', disabled: false, required: false },
            { name: 'CompanyDesc', disabled: false, required: false },
            { name: 'BranchNumber', disabled: false, required: false },
            { name: 'BranchName', disabled: false, required: false },
            { name: 'TaxCode', disabled: false, required: false },
            { name: 'TaxCodeDesc', disabled: true, required: false },
            { name: 'InvoiceCreditSelect', disabled: false, required: false },
            { name: 'InvoiceCreditCode', disabled: false, required: false },
            { name: 'ContractTypeCode', disabled: false, required: false },
            { name: 'TransContractTypeDesc', disabled: true, required: false },
            { name: 'InvoiceRangePrefix', disabled: false, required: false },
            { name: 'InvoiceRangeSuffix', disabled: false, required: false },
            { name: 'MinimumInvoiceNumber', disabled: false, required: true },
            { name: 'MaximumInvoiceNumber', disabled: false, required: false },
            { name: 'NextInvoiceNumber', disabled: false, required: false },
            { name: 'RowID', disabled: false, required: false },
            { name: 'TaxRange', disabled: false, required: false }
        ];
        this.pageId = PageIdentifier.ICABSBINVOICERANGEMAINTENANCE;
        this.inputParamsCompanySearch[this.serviceConstants.CountryCode] = this.countryCode();
        this.inputParamsCompanySearch[this.serviceConstants.BusinessCode] = this.businessCode();
        this.inputParamsCompanySearch['parentMode'] = 'LookUp';
    }
    InvoiceRangeMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Invoice Range Maintenance';
        switch (this.parentMode) {
            case 'InvoiceRangeAdd':
                this.disableControl('NextInvoiceNumber', true);
                this.setControlValue('ActiveRangeInd', true);
                this.hideDeleteButton = false;
                break;
            case 'InvoiceRangeUpdate':
                this.setControlValue('ActiveRangeInd', true);
                this.setControlValue('RowID', this.riExchange.getParentHTMLValue('RowID'));
                this.setControlValue('InvoiceRangeNumber', this.riExchange.getParentHTMLValue('InvoiceRangeNumber'));
        }
        this.getSysCharDtetails();
    };
    InvoiceRangeMaintenanceComponent.prototype.ngAfterViewInit = function () {
        this.setMessageCallback(this);
        this.setErrorCallback(this);
        this.uiForm.controls['MaximumInvoiceNumber'].setValidators([this.validateRange, Validators.pattern('^[0-9]*$')]);
        this.uiForm.controls['MinimumInvoiceNumber'].setValidators([this.validateRange, Validators.required, Validators.pattern('^[0-9]*$')]);
        this.uiForm.controls['NextInvoiceNumber'].setValidators([this.validateRange, Validators.pattern('^[0-9]*$')]);
    };
    ;
    InvoiceRangeMaintenanceComponent.prototype.validateRange = function (control) {
        if (control.value < 0 || control.value > 2147483647) {
            return { 'invalidValue': true };
        }
        return null;
    };
    InvoiceRangeMaintenanceComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show({ msg: data.msg, title: 'Error' }, false);
    };
    ;
    InvoiceRangeMaintenanceComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };
    ;
    InvoiceRangeMaintenanceComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableTaxInvoiceRanges];
        var sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records;
            _this.vSCEnableTaxInvoiceRange = record[0]['Required'];
            if (_this.vSCEnableTaxInvoiceRange) {
                _this.hiddenTaxRange = true;
            }
            if (_this.parentMode === 'InvoiceRangeUpdate') {
                _this.window_onload();
            }
        });
    };
    InvoiceRangeMaintenanceComponent.prototype.window_onload = function () {
        var _this = this;
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('ROWID', this.getControlValue('RowID'));
        this.search.set('InvoiceRangeNumber', this.getControlValue('InvoiceRangeNumber'));
        this.queryParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search)
            .subscribe(function (data) {
            _this.cancelholdingData = data;
            if (data.hasError) {
                if (_this.parentMode === 'InvoiceRangeUpdate') {
                    _this.messageModal.show(data, true);
                }
            }
            else {
                _this.setFormData(data);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.isRequesting = false;
        }, function (error) {
            _this.messageModal.show(error, true);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoiceRangeMaintenanceComponent.prototype.setFormData = function (data) {
        this.setControlValue('InvoiceRangeNumber', data.InvoiceRangeNumber);
        this.setControlValue('ActiveRangeInd', data.ActiveRangeInd ? true : false);
        this.setControlValue('InvoiceRangeDesc', data.InvoiceRangeDesc);
        this.companyNumber = data.CompanyCode ? data.CompanyCode : '?';
        this.lookupCompanyName();
        this.brunchNumber = data.BranchNumber ? data.BranchNumber : '?';
        this.lookupBranchName();
        this.InvoiceCreditSelectDropdown.selectedItem = data.InvoiceCreditCode;
        this.taxCode = data.TaxCode ? data.TaxCode : '?';
        this.lookupvatCodeName();
        this.setControlValue('InvoiceRangePrefix', data.InvoiceRangePrefix);
        this.contractCode = data.ContractTypeCode ? data.ContractTypeCode : '?';
        this.lookupcontractCodeName();
        this.setControlValue('InvoiceRangeSuffix', data.InvoiceRangeSuffix);
        this.setControlValue('MinimumInvoiceNumber', data.MinimumInvoiceNumber);
        this.setControlValue('MaximumInvoiceNumber', data.MaximumInvoiceNumber);
        this.setControlValue('NextInvoiceNumber', data.NextInvoiceNumber);
        this.setControlValue('TaxRange', data.TaxRange ? true : false);
        this.setControlValue('InvoiceCreditSelect', '');
        this.setControlValue('RowID', data.ttInvoiceRange);
    };
    InvoiceRangeMaintenanceComponent.prototype.numberOf = function (data) {
        if (!(isNaN(data.target.value)) && data.target.value) {
            this.setControlValue(data.target.id, Number(data.target.value));
        }
    };
    InvoiceRangeMaintenanceComponent.prototype.lookupBranchName = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode,
                    'BranchNumber': this.brunchNumber
                },
                'fields': ['BranchName']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var Branch = data[0][0];
            if (Branch) {
                _this.negBranchNumberSelected = {
                    id: _this.brunchNumber,
                    text: _this.brunchNumber + ' - ' + Branch.BranchName
                };
                _this.setControlValue('BranchNumber', _this.brunchNumber);
                _this.setControlValue('BranchName', Branch.BranchName);
            }
        });
    };
    InvoiceRangeMaintenanceComponent.prototype.lookupCompanyName = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Company',
                'query': {
                    'BusinessCode': this.businessCode,
                    'CompanyCode': this.companyNumber
                },
                'fields': ['CompanyDesc']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var compData = data[0][0];
            if (compData) {
                _this.companyDefault = {
                    id: _this.companyNumber,
                    text: _this.companyNumber + ' - ' + compData.CompanyDesc
                };
                _this.setControlValue('CompanyCode', _this.companyNumber);
                _this.setControlValue('CompanyDesc', compData.CompanyDesc);
            }
        });
    };
    InvoiceRangeMaintenanceComponent.prototype.lookupvatCodeName = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'TaxCode',
                'query': {
                    'TaxCode': this.taxCode
                },
                'fields': ['TaxCodeDesc']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var taxData = data[0][0];
            if (taxData) {
                _this.setControlValue('TaxCode', _this.taxCode);
                _this.setControlValue('TaxCodeDesc', taxData.TaxCodeDesc);
            }
        });
    };
    InvoiceRangeMaintenanceComponent.prototype.lookupcontractCodeName = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'ContractTypeLang',
                'query': {
                    'BusinessCode': this.businessCode,
                    'ContractTypeCode': this.contractCode,
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['ContractTypeDesc']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var contractData = data[0][0];
            if (contractData) {
                _this.setControlValue('ContractTypeCode', _this.contractCode);
                _this.setControlValue('TransContractTypeDesc', contractData.ContractTypeDesc);
            }
        });
    };
    InvoiceRangeMaintenanceComponent.prototype.OntaxCodetapout = function (data) {
        this.taxCode = data.target.value;
        this.lookupvatCodeName();
        this.uiForm.controls['TaxCode'].markAsDirty();
    };
    InvoiceRangeMaintenanceComponent.prototype.OncontractTypetapout = function (data) {
        this.contractCode = data.target.value;
        this.lookupcontractCodeName();
        this.uiForm.controls['ContractTypeCode'].markAsDirty();
    };
    InvoiceRangeMaintenanceComponent.prototype.companySearchdataReceived = function (eventObj) {
        this.setControlValue('CompanyCode', eventObj.CompanyCode);
        this.setControlValue('CompanyDesc', eventObj.CompanyDesc);
        this.uiForm.controls['CompanyCode'].markAsDirty();
    };
    InvoiceRangeMaintenanceComponent.prototype.onBranchDataReceived = function (obj) {
        if (obj && obj.BranchNumber !== null && obj.BranchNumber !== undefined) {
            var branchname = (obj.hasOwnProperty('BranchName') ? obj.BranchName : obj.Object.BranchName);
            if (obj.BranchNumber !== '')
                this.negBranchNumberSelected = { text: obj.BranchNumber + ' - ' + branchname };
            this.setControlValue('BranchNumber', obj.BranchNumber);
            this.setControlValue('BranchName', branchname);
            this.uiForm.controls['BranchNumber'].markAsDirty();
        }
    };
    InvoiceRangeMaintenanceComponent.prototype.onTaxCodeDataReceived = function (data) {
    };
    InvoiceRangeMaintenanceComponent.prototype.onContractTypeReceived = function (data) {
    };
    InvoiceRangeMaintenanceComponent.prototype.CreditSelectListchange = function (data) {
        this.uiForm.controls['InvoiceCreditSelect'].markAsDirty();
    };
    InvoiceRangeMaintenanceComponent.prototype.saveInvoiceRangemaintenance = function () {
        if (this.riExchange.validateForm(this.uiForm)) {
            if ((!this.getControlValue('ContractTypeCode'))) {
                this.setControlValue('TransContractTypeDesc', '');
            }
            if ((!this.getControlValue('TaxCode'))) {
                this.setControlValue('TaxCodeDesc', '');
            }
            this.promptModalForSave.show();
        }
        else {
            if ((this.uiForm.controls['ContractTypeCode'].invalid)) {
                this.setControlValue('TransContractTypeDesc', '');
            }
            if ((this.uiForm.controls['TaxCode'].invalid)) {
                this.setControlValue('TaxCodeDesc', '');
            }
        }
    };
    InvoiceRangeMaintenanceComponent.prototype.resetForm = function () {
        this.uiForm.reset();
        this.companyDefault = {
            text: ''
        };
        this.negBranchNumberSelected = {
            text: ''
        };
        if (this.parentMode === 'InvoiceRangeUpdate') {
            this.setFormData(this.cancelholdingData);
        }
        if (this.parentMode === 'InvoiceRangeAdd') {
            this.InvoiceCreditSelectDropdown.selectedItem = '';
            alert('iCABSBInvoiceRangeUpdateGrid not yet ready');
        }
        this.uiForm.controls['ContractTypeCode'].markAsPristine();
        this.uiForm.controls['TaxCode'].markAsPristine();
        this.uiForm.controls['BranchNumber'].markAsPristine();
        this.uiForm.controls['CompanyCode'].markAsPristine();
        this.uiForm.controls['InvoiceCreditSelect'].markAsPristine();
    };
    InvoiceRangeMaintenanceComponent.prototype.deleteInvoiceRangemaintenance = function () {
        this.promptModalDelete.show();
    };
    InvoiceRangeMaintenanceComponent.prototype.promptContentSaveData = function (eventObj) {
        if (this.parentMode === 'InvoiceRangeUpdate') {
            this.updateModeSaveData(eventObj);
        }
        else if (this.parentMode === 'InvoiceRangeAdd') {
            this.addModeSaveData(eventObj);
        }
    };
    InvoiceRangeMaintenanceComponent.prototype.updateModeSaveData = function (data) {
        var _this = this;
        var queryPost = this.getURLSearchParamObject();
        queryPost.set(this.serviceConstants.Action, '2');
        var formdata = {};
        formdata['RowID'] = this.getControlValue('RowID');
        formdata['InvoiceRangeNumber'] = (this.getControlValue('InvoiceRangeNumber')) ? this.getControlValue('InvoiceRangeNumber') : '?';
        formdata['ActiveRangeInd'] = (this.getControlValue('ActiveRangeInd') ? true : false);
        formdata['InvoiceRangeDesc'] = (this.getControlValue('InvoiceRangeDesc')) ? this.getControlValue('InvoiceRangeDesc') : '?';
        formdata['CompanyCode'] = (this.getControlValue('CompanyCode')) ? this.getControlValue('CompanyCode') : '?';
        formdata['BranchNumber'] = (this.getControlValue('BranchNumber')) ? this.getControlValue('BranchNumber') : '?';
        formdata['TaxCode'] = (this.getControlValue('TaxCode')) ? this.getControlValue('TaxCode') : '?';
        formdata['InvoiceCreditCode'] = (this.InvoiceCreditSelectDropdown.selectedItem) ? this.InvoiceCreditSelectDropdown.selectedItem : '?';
        formdata['ContractTypeCode'] = (this.getControlValue('ContractTypeCode')) ? this.getControlValue('ContractTypeCode') : '?';
        formdata['InvoiceRangePrefix'] = (this.getControlValue('InvoiceRangePrefix')) ? this.getControlValue('InvoiceRangePrefix') : '?';
        formdata['InvoiceRangeSuffix'] = (this.getControlValue('InvoiceRangeSuffix')) ? this.getControlValue('InvoiceRangeSuffix') : '?';
        formdata['MinimumInvoiceNumber'] = (this.getControlValue('MinimumInvoiceNumber'));
        var maxInvoiceNumber = this.getControlValue('MaximumInvoiceNumber');
        formdata['MaximumInvoiceNumber'] = (maxInvoiceNumber) ? (maxInvoiceNumber) : (maxInvoiceNumber === 0) ? 0 : '?';
        var nextInvoiceNumber = this.getControlValue('NextInvoiceNumber');
        formdata['NextInvoiceNumber'] = (nextInvoiceNumber) ? (nextInvoiceNumber) : (nextInvoiceNumber === 0) ? 0 : '?';
        formdata['TaxRange'] = (this.getControlValue('TaxRange') ? true : false);
        this.queryParams.search = queryPost;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, queryPost, formdata)
            .subscribe(function (data) {
            if (data.hasError) {
                _this.messageModal.show(data, true);
            }
            else {
                alert('iCABSBInvoiceRangeUpdateGrid not yet ready');
                _this.formPristine();
                _this.uiForm.controls['ContractTypeCode'].markAsPristine();
                _this.uiForm.controls['TaxCode'].markAsPristine();
                _this.uiForm.controls['BranchNumber'].markAsPristine();
                _this.uiForm.controls['CompanyCode'].markAsPristine();
                _this.uiForm.controls['InvoiceCreditSelect'].markAsPristine();
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.messageModal.show(error, true);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoiceRangeMaintenanceComponent.prototype.addModeSaveData = function (data) {
        var _this = this;
        var queryPost = this.getURLSearchParamObject();
        queryPost.set(this.serviceConstants.Action, '1');
        var formdata = {};
        formdata['InvoiceRangeNumber'] = (this.getControlValue('InvoiceRangeNumber')) ? this.getControlValue('InvoiceRangeNumber') : '?';
        formdata['ActiveRangeInd'] = (this.getControlValue('ActiveRangeInd') ? true : false);
        formdata['InvoiceRangeDesc'] = (this.getControlValue('InvoiceRangeDesc')) ? this.getControlValue('InvoiceRangeDesc') : '?';
        formdata['CompanyCode'] = (this.getControlValue('CompanyCode')) ? this.getControlValue('CompanyCode') : '?';
        formdata['BranchNumber'] = (this.getControlValue('BranchNumber')) ? this.getControlValue('BranchNumber') : '?';
        formdata['TaxCode'] = (this.getControlValue('TaxCode')) ? this.getControlValue('TaxCode') : '?';
        formdata['InvoiceCreditCode'] = (this.InvoiceCreditSelectDropdown.selectedItem) ? this.InvoiceCreditSelectDropdown.selectedItem : '?';
        formdata['ContractTypeCode'] = (this.getControlValue('ContractTypeCode')) ? this.getControlValue('ContractTypeCode') : '?';
        formdata['InvoiceRangePrefix'] = (this.getControlValue('InvoiceRangePrefix')) ? this.getControlValue('InvoiceRangePrefix') : '?';
        formdata['InvoiceRangeSuffix'] = (this.getControlValue('InvoiceRangeSuffix')) ? this.getControlValue('InvoiceRangeSuffix') : '?';
        formdata['MinimumInvoiceNumber'] = (this.getControlValue('MinimumInvoiceNumber'));
        var maxInvoiceNumber = this.getControlValue('MaximumInvoiceNumber');
        formdata['MaximumInvoiceNumber'] = (maxInvoiceNumber) ? (maxInvoiceNumber) : (maxInvoiceNumber === 0) ? 0 : '?';
        var nextInvoiceNumber = this.getControlValue('NextInvoiceNumber');
        formdata['NextInvoiceNumber'] = (nextInvoiceNumber) ? (nextInvoiceNumber) : (nextInvoiceNumber === 0) ? 0 : '?';
        formdata['TaxRange'] = (this.getControlValue('TaxRange') ? true : false);
        this.queryParams.search = queryPost;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, queryPost, formdata)
            .subscribe(function (data) {
            if (data.hasError) {
                _this.messageModal.show(data, true);
            }
            else {
                alert('iCABSBInvoiceRangeUpdateGrid not yet ready');
                _this.formPristine();
                _this.uiForm.controls['ContractTypeCode'].markAsPristine();
                _this.uiForm.controls['TaxCode'].markAsPristine();
                _this.uiForm.controls['BranchNumber'].markAsPristine();
                _this.uiForm.controls['CompanyCode'].markAsPristine();
                _this.uiForm.controls['InvoiceCreditSelect'].markAsPristine();
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.messageModal.show(error, true);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoiceRangeMaintenanceComponent.prototype.promptContentDeleteData = function (eventObj) {
        var _this = this;
        var formdata = {};
        var queryPost = this.getURLSearchParamObject();
        queryPost.set(this.serviceConstants.Action, '3');
        formdata['RowID'] = this.getControlValue('RowID');
        formdata['InvoiceRangeNumber'] = this.getControlValue('InvoiceRangeNumber');
        this.queryParams.search = queryPost;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, queryPost, formdata)
            .subscribe(function (data) {
            if (data.hasError) {
                _this.messageModal.show(data, true);
            }
            else {
                alert('iCABSBInvoiceRangeUpdateGrid not yet ready');
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.messageModal.show(error, true);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoiceRangeMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBInvoiceRangeMaintenance.html'
                },] },
    ];
    InvoiceRangeMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    InvoiceRangeMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'promptModalForSave': [{ type: ViewChild, args: ['promptModalForSave',] },],
        'promptModalDelete': [{ type: ViewChild, args: ['promptModalDelete',] },],
        'InvoiceCreditSelectDropdown': [{ type: ViewChild, args: ['InvoiceCreditSelectDropdown',] },],
        'bCompanySearchComponent': [{ type: ViewChild, args: ['bCompanySearchComponent',] },],
        'BranchNumberDropdown': [{ type: ViewChild, args: ['BranchNumberDropdown',] },],
        'TaxCodeEllipsis': [{ type: ViewChild, args: ['TaxCodeEllipsis',] },],
        'screenNotReadyEllipsis': [{ type: ViewChild, args: ['screenNotReadyEllipsis',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return InvoiceRangeMaintenanceComponent;
}(BaseComponent));
