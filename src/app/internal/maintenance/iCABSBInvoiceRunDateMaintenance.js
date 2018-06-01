var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';
import { ContractSearchComponent } from '../search/iCABSAContractSearch';
import { MessageConstant } from './../../../shared/constants/message.constant';
export var InvoiceRunDateMaintenanceComponent = (function (_super) {
    __extends(InvoiceRunDateMaintenanceComponent, _super);
    function InvoiceRunDateMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [
            { name: 'IncludeContractsAdvance', readonly: true, disabled: true, required: false },
            { name: 'ExtractDate', readonly: true, disabled: false, required: true },
            { name: 'ExtractRunNumber', readonly: true, disabled: true, required: false },
            { name: 'ProcessDate', readonly: false, disabled: true, required: false },
            { name: 'IncludeContractsArrears', readonly: true, disabled: true, required: false },
            { name: 'InvoiceTotalExclTAX', readonly: true, disabled: true, required: false },
            { name: 'InvoiceTAXTotal', readonly: true, disabled: true, required: false },
            { name: 'IncludeJobs', readonly: true, disabled: true, required: false },
            { name: 'CreditTotalExclTAX', readonly: true, disabled: true, required: false },
            { name: 'CreditTAXTotal', readonly: true, disabled: true, required: false },
            { name: 'IncludeCredits', readonly: true, disabled: true, required: false },
            { name: 'ContractNumberString', readonly: true, disabled: true, required: false },
            { name: 'WarningMessage', readonly: true, disabled: false, required: false },
            { name: 'ExtractDateVal', readonly: true, disabled: false, required: false }
        ];
        this.storeDataTemp = {};
        this.contractNumberStringDisplayed = false;
        this.contractArray = [];
        this.ExtractDate = new Date();
        this.dateReadOnly = true;
        this.isRequesting = false;
        this.promptTitle = MessageConstant.Message.DeleteRecord;
        this.showMessageHeader = true;
        this.promptContent = '';
        this.extractDateValidate = false;
        this.queryParams = {
            operation: 'Business/iCABSBInvoiceRunDateMaintenance',
            module: 'invoicing',
            method: 'bill-to-cash/admin'
        };
        this.ellipsis = {
            contractSearch: {
                disabled: false,
                showCloseButton: true,
                childConfigParams: {
                    parentMode: 'LookUp-String',
                    currentContractType: '',
                    currentContractTypeURLParameter: '',
                    showAddNew: true,
                    contractNumber: ''
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                showHeader: true,
                showAddNew: false,
                autoOpenSearch: false,
                setFocus: false,
                component: ContractSearchComponent
            },
            date: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'ContractNumber': '',
                    'ContractName': '',
                    'currentContractType': 'C',
                    'currentContractTypeURLParameter': '<contract>',
                    'showAddNew': true
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: '',
                showHeader: true,
                searchModalRoute: '',
                disabled: true
            }
        };
        this.pageId = PageIdentifier.ICABSBINVOICERUNDATEMAINTENANCE;
    }
    InvoiceRunDateMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Invoice Run Date Maintenance';
        this.windowOnLoad();
    };
    InvoiceRunDateMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    InvoiceRunDateMaintenanceComponent.prototype.windowOnLoad = function () {
        this.extractDateDisplayed = this.utils.formatDate(this.ExtractDate);
        if (this.parentMode) {
            switch (this.parentMode) {
                case 'InvoiceRunDates':
                    this.invoiceRunDateRowID = this.riExchange.getParentHTMLValue('RowID');
                    this.fetchRecord();
                    this.operationMode = 'ADD';
                    if (this.uiForm.controls['ContractNumberString'].value) {
                        this.contractNumberStringDisplayed = true;
                    }
                    if (this.riExchange.getParentHTMLValue('StrSingleDesc') === 'Single') {
                        this.contractNumberStringDisplayed = true;
                        if (this.uiForm.controls['ContractNumberString'].value) {
                            this.operationMode = 'ADD/DELETE';
                        }
                    }
                    break;
                case 'InvoiceRunDatesAdd':
                    this.operationMode = 'SAVE/CANCEL';
                    this.modifyEditMode();
                    this.beforeAdd();
                    break;
                case 'InvoiceRunDatesAddSingle':
                    this.operationMode = 'SAVE/CANCEL';
                    this.contractNumberStringDisplayed = true;
                    this.modifyEditMode();
                    this.beforeAdd();
                    break;
                default:
            }
        }
    };
    InvoiceRunDateMaintenanceComponent.prototype.modifyEditMode = function () {
        this.riExchange.riInputElement.Enable(this.uiForm, 'IncludeContractsAdvance');
        this.riExchange.riInputElement.Enable(this.uiForm, 'IncludeContractsArrears');
        this.riExchange.riInputElement.Enable(this.uiForm, 'IncludeJobs');
        this.riExchange.riInputElement.Enable(this.uiForm, 'IncludeCredits');
        this.riExchange.riInputElement.Enable(this.uiForm, 'ContractNumberString');
        this.dateReadOnly = false;
        this.uiForm.reset();
        this.ExtractDate = null;
        this.extractDateDisplayed = '';
    };
    InvoiceRunDateMaintenanceComponent.prototype.fetchRecord = function () {
        var _this = this;
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '0');
        var postParams = {};
        postParams.ROWID = this.invoiceRunDateRowID;
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
                    _this.ExtractDate = new Date(e.ExtractDate);
                    _this.extractDateDisplayed = _this.utils.formatDate(_this.ExtractDate);
                    if (e.ProcessDate) {
                        var processDateTemp = new Date(e.ProcessDate);
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProcessDate', _this.utils.formatDate(processDateTemp));
                    }
                    _this.setControlValue('ExtractDateVal', e.ExtractDate);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceTotalExclTAX', e.InvoiceTotalExclTAX);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ExtractRunNumber', e.ExtractRunNumber);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceTAXTotal', e.InvoiceTAXTotal);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'CreditTotalExclTAX', e.CreditTotalExclTAX);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'CreditTAXTotal', e.CreditTAXTotal);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'IncludeContractsAdvance', e.IncludeContractsAdvance);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'IncludeContractsArrears', e.IncludeContractsArrears);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'IncludeJobs', e.IncludeJobs);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'IncludeCredits', e.IncludeCredits);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractNumberString', e.ContractNumberString);
                    if (_this.uiForm.controls['ContractNumberString'].value) {
                        _this.contractNumberStringDisplayed = true;
                    }
                    if (_this.riExchange.getParentHTMLValue('StrSingleDesc') === 'Single') {
                        _this.contractNumberStringDisplayed = true;
                        if (_this.uiForm.controls['ContractNumberString'].value) {
                            _this.operationMode = 'ADD/DELETE';
                        }
                    }
                    _this.setValuesInstoreDataTemp();
                    _this.afterFetch();
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoiceRunDateMaintenanceComponent.prototype.dateFromSelectedValue = function (value) {
        if (value && value.value) {
            this.extractDateDisplayed = value.value;
            this.setControlValue('ExtractDateVal', value.value);
        }
        else {
            this.extractDateDisplayed = '';
            this.setControlValue('ExtractDate', '');
        }
    };
    InvoiceRunDateMaintenanceComponent.prototype.afterFetch = function () {
        this.resetEditMode();
        if (!this.uiForm.controls['ProcessDate'].value) {
            this.operationMode = 'ADD/DELETE';
        }
        else {
            this.operationMode = 'ADD';
        }
    };
    InvoiceRunDateMaintenanceComponent.prototype.setValuesInstoreDataTemp = function () {
        this.storeDataTemp = this.uiForm.getRawValue();
    };
    InvoiceRunDateMaintenanceComponent.prototype.resetEditMode = function () {
        this.contractArray = [];
        this.extractDateDisplayed = '';
        this.riExchange.riInputElement.Disable(this.uiForm, 'IncludeContractsAdvance');
        this.riExchange.riInputElement.Disable(this.uiForm, 'IncludeContractsArrears');
        this.riExchange.riInputElement.Disable(this.uiForm, 'IncludeJobs');
        this.riExchange.riInputElement.Disable(this.uiForm, 'IncludeCredits');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumberString');
        this.dateReadOnly = true;
    };
    InvoiceRunDateMaintenanceComponent.prototype.restoreFieldsOnCancel = function () {
        for (var key in this.uiForm.controls) {
            if (key && this.uiForm.controls.hasOwnProperty(key)) {
                this.uiForm.controls[key].markAsPristine();
                this.setControlValue(key, this.storeDataTemp[key]);
            }
        }
        this.ExtractDate = new Date(this.utils.convertDate(this.getControlValue('ExtractDateVal')));
    };
    InvoiceRunDateMaintenanceComponent.prototype.addClicked = function () {
        this.operationMode = 'SAVE/CANCEL';
        this.modifyEditMode();
        this.beforeAdd();
    };
    InvoiceRunDateMaintenanceComponent.prototype.afterSave = function () {
        this.location.back();
    };
    InvoiceRunDateMaintenanceComponent.prototype.afterDelete = function () {
        this.location.back();
    };
    InvoiceRunDateMaintenanceComponent.prototype.beforeAdd = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'IncludeContractsAdvance', true);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'IncludeContractsArrears', true);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'IncludeJobs', true);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'IncludeCredits', true);
        if (this.riExchange.getParentHTMLValue('StrSingleDesc') === 'Single') {
            this.contractNumberStringDisplayed = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractNumberString', true);
        }
    };
    InvoiceRunDateMaintenanceComponent.prototype.saveClicked = function () {
        this.datepck.validateDateField();
        this.beforeSave();
    };
    InvoiceRunDateMaintenanceComponent.prototype.beforeSave = function () {
        var _this = this;
        if (this.operationMode === 'SAVE/CANCEL') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'WarningMessage', '');
            var postSearchParams = this.getURLSearchParamObject();
            postSearchParams.set(this.serviceConstants.Action, '6');
            var postParams = {};
            postParams.Function = 'CheckEnoughInvoiceNumbersWarning';
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
                .subscribe(function (e) {
                if (e['status'] === 'failure') {
                    _this.errorService.emitError(e['oResponse']);
                }
                else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        _this.errorModal.show({ msg: e, title: '' }, false);
                    }
                    else {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'WarningMessage', e.WarningMessage);
                        if (_this.uiForm.controls['WarningMessage'].value !== '') {
                            _this.errorModal.show({ msg: e['WarningMessage'], title: '' }, false);
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'WarningMessage', '');
                        }
                        else {
                            _this.saveNewRecord();
                        }
                    }
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.errorService.emitError(error);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    InvoiceRunDateMaintenanceComponent.prototype.onContractDataReceived = function (data) {
        this.contractArray.push(data.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumberString', this.contractArray.join(','));
    };
    InvoiceRunDateMaintenanceComponent.prototype.contractNumberString_onkeydown = function (obj) {
        if (obj.keyCode === 34) {
            this.ellipsis.contractSearch.autoOpenSearch = true;
        }
    };
    InvoiceRunDateMaintenanceComponent.prototype.modalHiddenForContract = function (e) {
        this.ellipsis.contractSearch.autoOpenSearch = false;
    };
    InvoiceRunDateMaintenanceComponent.prototype.saveNewRecord = function () {
        var _this = this;
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '1');
        var postParams = {};
        postParams.Function = 'CheckEnoughInvoiceNumbersWarning';
        postParams.ExtractDate = this.extractDateDisplayed;
        postParams.IncludeContractsAdvance = this.riExchange.riInputElement.GetValue(this.uiForm, 'IncludeContractsAdvance') ? 'yes' : 'no';
        postParams.IncludeContractsArrears = this.riExchange.riInputElement.GetValue(this.uiForm, 'IncludeContractsArrears') ? 'yes' : 'no';
        postParams.IncludeJobs = this.riExchange.riInputElement.GetValue(this.uiForm, 'IncludeJobs') ? 'yes' : 'no';
        postParams.IncludeCredits = this.riExchange.riInputElement.GetValue(this.uiForm, 'IncludeCredits') ? 'yes' : 'no';
        postParams.ExtractRunNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ExtractRunNumber');
        postParams.ProcessDate = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProcessDate');
        postParams.InvoiceTotalExclTAX = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceTotalExclTAX');
        postParams.InvoiceTAXTotal = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceTAXTotal');
        postParams.CreditTotalExclTAX = this.riExchange.riInputElement.GetValue(this.uiForm, 'CreditTotalExclTAX');
        postParams.CreditTAXTotal = this.riExchange.riInputElement.GetValue(this.uiForm, 'CreditTAXTotal');
        postParams.ContractNumberString = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumberString') ? this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumberString') : '';
        this.ajaxSource.next(this.ajaxconstant.START);
        if (this.extractDateDisplayed === '' || !this.extractDateDisplayed || !(window['moment'](this.extractDateDisplayed, 'DD/MM/YYYY', true).isValid())) {
        }
        else {
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
                        _this.afterSave();
                    }
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.errorService.emitError(error);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    InvoiceRunDateMaintenanceComponent.prototype.cancleClicked = function () {
        this.datepck.resetDateField();
        if (this.parentMode === 'InvoiceRunDatesAdd' || this.parentMode === 'InvoiceRunDatesAddSingle') {
            this.location.back();
        }
        else {
            this.restoreFieldsOnCancel();
            this.afterFetch();
        }
    };
    InvoiceRunDateMaintenanceComponent.prototype.deleteClicked = function () {
        this.promptModal.show();
    };
    InvoiceRunDateMaintenanceComponent.prototype.promptDeleteConfirmed = function (event) {
        var _this = this;
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '3');
        var postParams = {};
        postParams.InvoiceRunDateROWID = this.invoiceRunDateRowID;
        postParams.ExtractDate = this.extractDateDisplayed;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorModal.show({ msg: e, title: '' }, false);
                }
                else {
                    _this.afterDelete();
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoiceRunDateMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBInvoiceRunDateMaintenance.html'
                },] },
    ];
    InvoiceRunDateMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    InvoiceRunDateMaintenanceComponent.propDecorators = {
        'ContractSearchComponent': [{ type: ViewChild, args: ['ContractSearchComponent',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'datepck': [{ type: ViewChild, args: ['datepck',] },],
    };
    return InvoiceRunDateMaintenanceComponent;
}(BaseComponent));
