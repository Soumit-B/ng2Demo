var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { Component, ViewChild, Injector } from '@angular/core';
import { BatchProgramSearchComponent } from './../../../../app/internal/search/iCABSMGBatchProgramSearch';
import { BaseComponent } from './../../../../app/base/BaseComponent';
import { PageIdentifier } from './../../../../app/base/PageIdentifier';
import { AjaxConstant } from './../../../../shared/constants/AjaxConstants';
import { MessageService } from './../../../../shared/services/message.service';
import { MessageConstant } from './../../../../shared/constants/message.constant';
export var BatchProgramMaintenanceComponent = (function (_super) {
    __extends(BatchProgramMaintenanceComponent, _super);
    function BatchProgramMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.injector = injector;
        this.batchProgramSearchData = {};
        this.pageId = '';
        this.batchProgramAutoOpen = false;
        this.showCloseButton = true;
        this.showHeader = true;
        this.autoOpenSearch = false;
        this.isAddOrUpdateMode = false;
        this.showMessageHeader = true;
        this.search = new URLSearchParams();
        this.currentMode = 'FETCH';
        this.postSearchParams = new URLSearchParams();
        this.showPromptMessageHeader = true;
        this.isDeleteButtonDisabled = true;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.inputParams = {
            'parentMode': 'LookUp-Search',
            'businessCode': 'D',
            'countryCode': 'UK',
            'BranchNumber': '8',
            'lstBranchSelection': 'Service',
            'AccountNumber': '',
            'showAddNew': true
        };
        this.headerParams = {
            method: 'it-functions/ri-model',
            operation: 'Model/riMGBatchProgramMaintenance',
            module: 'batch-process'
        };
        this.controls = [
            { name: 'riBatchProgramName', readonly: true, disabled: true, required: false },
            { name: 'riBatchProgramDescription', readonly: true, disabled: true, required: true },
            { name: 'riBatchProgramParam1Label', readonly: true, disabled: true, required: false },
            { name: 'riBatchProgramParam2Label', readonly: true, disabled: true, required: false },
            { name: 'riBatchProgramParam3Label', readonly: true, disabled: true, required: false },
            { name: 'riBatchProgramParam4Label', readonly: true, disabled: true, required: false },
            { name: 'riBatchProgramParam5Label', readonly: true, disabled: true, required: false },
            { name: 'riBatchProgramParam6Label', readonly: true, disabled: true, required: false },
            { name: 'riBatchProgramParam7Label', readonly: true, disabled: true, required: false },
            { name: 'riBatchProgramParam8Label', readonly: true, disabled: true, required: false },
            { name: 'riBatchProgramParam9Label', readonly: true, disabled: true, required: false },
            { name: 'riBatchProgramParam10Label', readonly: true, disabled: true, required: false },
            { name: 'riBatchProgramParam11Label', readonly: true, disabled: true, required: false },
            { name: 'riBatchProgramParam12Label', readonly: true, disabled: true, required: false },
            { name: 'riBatchProgramReport', readonly: true, disabled: true, required: false }
        ];
        this.emptyFieldData = {
            'riBatchProgramDescription': '',
            'riBatchProgramParam1Label': '',
            'riBatchProgramParam2label': '',
            'riBatchProgramParam3Label': '',
            'riBatchProgramParam4Label': '',
            'riBatchProgramParam5Label': '',
            'riBatchProgramParam6Label': '',
            'riBatchProgramParam7Label': '',
            'riBatchProgramParam8Label': '',
            'riBatchProgramParam9Label': '',
            'riBatchProgramParam10Label': '',
            'riBatchProgramParam11Label': '',
            'riBatchProgramParam12Label': '',
            'riBatchProgramReport': false,
            'riBatchProgramName': ''
        };
        this.crudOperations = {
            'add': 'ADD',
            'delete': 'DELETE',
            'update': 'UPDATE',
            'fetch': 'FETCH'
        };
        this.isProgramDisabled = false;
        this.pageId = PageIdentifier.RIMGBATCHPROGRAMMAINTENANCE;
        this.pageTitle = 'Batch Program Maintenance';
    }
    BatchProgramMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.uiForm = this.formBuilder.group({});
        this.batchProgramSearchComponent = BatchProgramSearchComponent;
        this.riExchange.renderForm(this.uiForm, this.controls);
    };
    BatchProgramMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    BatchProgramMaintenanceComponent.prototype.ngAfterViewInit = function () {
        this.batchProgramAutoOpen = true;
        this.postInitialize();
    };
    BatchProgramMaintenanceComponent.prototype.modalHidden = function () {
        this.batchProgramAutoOpen = false;
    };
    BatchProgramMaintenanceComponent.prototype.onBatchProgramSearchDataReceived = function (data, route) {
        this.isDeleteButtonDisabled = false;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramName', data.riBatchProgramName);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramDescription', data.riBatchProgramDescription);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam1Label', data.riBatchProgramParam1Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam2Label', data.riBatchProgramParam2label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam3Label', data.riBatchProgramParam3Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam4Label', data.riBatchProgramParam4Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam5Label', data.riBatchProgramParam5Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam6Label', data.riBatchProgramParam6Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam7Label', data.riBatchProgramParam7Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam8Label', data.riBatchProgramParam8Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam9Label', data.riBatchProgramParam9Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam10Label', data.riBatchProgramParam10Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam11Label', data.riBatchProgramParam11Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam12Label', data.riBatchProgramParam12Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramReport', data.riBatchProgramReport);
        if (route) {
            this.onUpdateClicked();
        }
    };
    BatchProgramMaintenanceComponent.prototype.onAddClicked = function () {
        this.isProgramDisabled = true;
        this.isAddOrUpdateMode = true;
        this.currentMode = this.crudOperations.add;
        this.setUIFieldsEditablity('Enable');
        this.onBatchProgramSearchDataReceived(this.emptyFieldData, null);
        this.setFormMode(this.c_s_MODE_ADD);
    };
    BatchProgramMaintenanceComponent.prototype.onUpdateClicked = function () {
        this.isProgramDisabled = true;
        this.isAddOrUpdateMode = true;
        this.currentMode = this.crudOperations.update;
        this.setUIFieldsEditablity('Enable');
        this.setFormMode(this.c_s_MODE_UPDATE);
    };
    BatchProgramMaintenanceComponent.prototype.onSaveClicked = function () {
        var programName = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramName');
        var programDesc = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramDescription');
        if (programName === '' || programDesc === '') {
            this.messageModal.show({ msg: MessageConstant.Message.programNameAndDescRequired, title: 'Message' }, false);
            return;
        }
        this.isAddOrUpdateMode = false;
        if (this.currentMode === this.crudOperations.update) {
            this.fetchAndUpdateBatchProgramData(this.currentMode);
        }
        else if (this.currentMode === this.crudOperations.add) {
            this.saveAndDelete(this.currentMode);
        }
        this.setUIFieldsEditablity('Disable');
        this.isProgramDisabled = false;
    };
    BatchProgramMaintenanceComponent.prototype.onCancelClicked = function () {
        this.isProgramDisabled = false;
        var programName = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramName');
        this.isAddOrUpdateMode = false;
        this.setUIFieldsEditablity('Disable');
        if (this.currentMode === this.crudOperations.update) {
            this.currentMode = this.crudOperations.fetch;
            this.fetchAndUpdateBatchProgramData(this.crudOperations.fetch);
        }
        else if (this.currentMode === this.crudOperations.add) {
            this.onBatchProgramSearchDataReceived(this.emptyFieldData, null);
            console.log('ELLISPSIS OPEN');
            this.programMaintenanceEllipsis.openModal();
            console.log('ELLISPSIS OPEN AFTER');
        }
        this.setFormMode(this.c_s_MODE_SELECT);
        if (programName === '') {
            this.isDeleteButtonDisabled = true;
        }
        else {
            this.isDeleteButtonDisabled = false;
        }
    };
    BatchProgramMaintenanceComponent.prototype.onDeleteClicked = function () {
        this.promptConfirmContent = MessageConstant.Message.DeleteRecord;
        this.promptConfirmModal.show();
        this.setFormMode(this.c_s_MODE_UPDATE);
    };
    BatchProgramMaintenanceComponent.prototype.fetchAndUpdateBatchProgramData = function (operation) {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        if (operation === this.crudOperations.fetch) {
            this.search.set(this.serviceConstants.Action, '0');
            this.search.set('riBatchProgramName', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramName'));
        }
        else if (operation === this.crudOperations.update) {
            this.search.set(this.serviceConstants.Action, '2');
            this.search.set('riBatchProgramName', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramName'));
            this.search.set('riBatchProgramDescription', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramDescription'));
            this.search.set('riBatchProgramParam1Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam1Label'));
            this.search.set('riBatchProgramParam2Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam2Label'));
            this.search.set('riBatchProgramParam3Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam3Label'));
            this.search.set('riBatchProgramParam4Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam4Label'));
            this.search.set('riBatchProgramParam5Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam5Label'));
            this.search.set('riBatchProgramParam6Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam6Label'));
            this.search.set('riBatchProgramParam7Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam7Label'));
            this.search.set('riBatchProgramParam8Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam8Label'));
            this.search.set('riBatchProgramParam9Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam9Label'));
            this.search.set('riBatchProgramParam10Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam10Label'));
            this.search.set('riBatchProgramParam11Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam11Label'));
            this.search.set('riBatchProgramParam12Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam12Label'));
            this.search.set('riBatchProgramReport', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramReport'));
        }
        this.ajaxSource.next(AjaxConstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.search)
            .subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError(e);
            }
            else {
                if (operation === _this.crudOperations.update) {
                    _this.messageModal.show({ msg: MessageConstant.Message.SavedSuccessfully, title: 'Message' }, false);
                }
                _this.onBatchProgramSearchDataReceived(e, null);
            }
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
        });
    };
    BatchProgramMaintenanceComponent.prototype.setUIFieldsEditablity = function (editability) {
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramName');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramDescription');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam1Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam2Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam3Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam4Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam5Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam6Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam7Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam8Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam9Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam10Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam11Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam12Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramReport');
    };
    BatchProgramMaintenanceComponent.prototype.saveAndDelete = function (mode) {
        var _this = this;
        var _formData = {};
        var _confirmMessage = '';
        _formData['riBatchProgramName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramName');
        if (mode === this.crudOperations.add) {
            _formData['riBatchProgramDescription'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramDescription');
            _formData['riBatchProgramParam1Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam1Label');
            _formData['riBatchProgramParam2Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam2Label');
            _formData['riBatchProgramParam3Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam3Label');
            _formData['riBatchProgramParam4Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam4Label');
            _formData['riBatchProgramParam5Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam5Label');
            _formData['riBatchProgramParam6Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam6Label');
            _formData['riBatchProgramParam7Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam7Label');
            _formData['riBatchProgramParam8Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam8Label');
            _formData['riBatchProgramParam9Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam9Label');
            _formData['riBatchProgramParam10Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam10Label');
            _formData['riBatchProgramParam11Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam11Label');
            _formData['riBatchProgramParam12Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam12Label');
            _formData['riBatchProgramReport'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramReport');
            this.postSearchParams.set(this.serviceConstants.Action, '1');
            _confirmMessage = MessageConstant.Message.SavedSuccessfully;
        }
        else {
            this.postSearchParams.set(this.serviceConstants.Action, '3');
            _confirmMessage = MessageConstant.Message.RecordDeleted;
        }
        this.postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.postSearchParams, _formData)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                    _this.errorService.emitError(e.oResponse['errorMessage']);
                    _confirmMessage = e.oResponse['errorMessage'];
                }
                else if (e['errorMessage']) {
                    _confirmMessage = e['errorMessage'];
                    _this.messageModal.show({ msg: _confirmMessage, title: 'Error' }, false);
                }
                else {
                    _this.messageModal.show({ msg: _confirmMessage, title: 'Message' }, false);
                    e['msg'] = _confirmMessage;
                    _this.messageService.emitMessage(e);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    BatchProgramMaintenanceComponent.prototype.promptConfirm = function (event) {
        if (event) {
            this.currentMode = this.crudOperations.delete;
            this.saveAndDelete(this.currentMode);
            this.onBatchProgramSearchDataReceived(this.emptyFieldData, null);
            this.isDeleteButtonDisabled = true;
        }
    };
    BatchProgramMaintenanceComponent.prototype.promptCancel = function (event) {
        this.setFormMode(this.c_s_MODE_SELECT);
    };
    BatchProgramMaintenanceComponent.prototype.onMessageClose = function () {
    };
    BatchProgramMaintenanceComponent.prototype.postInitialize = function () {
        var _this = this;
        this.messageService.emitMessage(0);
        this.messageSubscription = this.messageService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                if (data && data.addMode) {
                    _this.onAddClicked();
                }
            }
        });
    };
    BatchProgramMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'riMGBatchProgramMaintenance.html',
                    providers: [MessageService]
                },] },
    ];
    BatchProgramMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    BatchProgramMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptConfirmModal': [{ type: ViewChild, args: ['promptConfirmModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
        'programMaintenanceEllipsis': [{ type: ViewChild, args: ['programMaintenanceEllipsis',] },],
    };
    return BatchProgramMaintenanceComponent;
}(BaseComponent));
