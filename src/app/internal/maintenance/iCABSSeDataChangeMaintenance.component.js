var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, ViewChild, Injector, EventEmitter } from '@angular/core';
import { BaseComponent } from './../../base/BaseComponent';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
export var DataChangeMaintenanceComponent = (function (_super) {
    __extends(DataChangeMaintenanceComponent, _super);
    function DataChangeMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.pageTitle = '';
        this.search = new URLSearchParams();
        this.showCloseButton = true;
        this.hiddenField = false;
        this.messageContentError = MessageConstant.Message.SaveError;
        this.messageContentSave = MessageConstant.Message.SavedSuccessfully;
        this.showMessageHeaderSave = true;
        this.showPromptCloseButtonSave = true;
        this.AmendedValueMode = false;
        this.originalValueMode = false;
        this.promptTitleSave = '';
        this.promptContentSave = MessageConstant.Message.ConfirmRecord;
        this.currentContractType = '';
        this.amendedValue = '';
        this.showStar = true;
        this.setFocusAmendedValue = new EventEmitter();
        this.promptModalConfigSave = {
            ignoreBackdropClick: true
        };
        this.queryParams = {
            module: 'pda',
            operation: 'Service/iCABSSeDataChangeMaintenance',
            method: 'contract-management/maintenance'
        };
        this.controls = [
            { name: 'ContractNumber', readonly: true, disabled: false, required: false },
            { name: 'ContractName', readonly: true, disabled: false, required: false },
            { name: 'PremiseNumber', readonly: true, disabled: false, required: false },
            { name: 'PremiseName', readonly: true, disabled: false, required: false },
            { name: 'ProductCode', readonly: true, disabled: false, required: false },
            { name: 'ProductDesc', readonly: true, disabled: false, required: false },
            { name: 'FieldName', readonly: true, disabled: false, required: false },
            { name: 'OriginalValue', readonly: true, disabled: false, required: false },
            { name: 'AmendedValue' }
        ];
        this.pageId = PageIdentifier.ICABSSEDATACHANGEMAINTENANCE;
    }
    ;
    DataChangeMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        if (this.parentMode === 'UpdatedValue') {
            this.hiddenField = true;
            this.AmendedValueMode = true;
            this.originalValueMode = false;
            this.showStar = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractNumber', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseNumber', true);
        }
        else {
            this.AmendedValueMode = false;
            this.originalValueMode = true;
        }
        this.window_onload();
        this.pageTitle = 'Customer Data Change';
    };
    ;
    DataChangeMaintenanceComponent.prototype.ngAfterViewInit = function () {
        this.setFormMode(this.c_s_MODE_UPDATE);
    };
    ;
    DataChangeMaintenanceComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };
    DataChangeMaintenanceComponent.prototype.window_onload = function () {
        var _this = this;
        var formdata = {};
        this.currentContractType = this.riExchange.getParentAttributeValue('CurrentContractType');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.Function, 'Fetch');
        this.search.set('PDAICABSDataChangeRowID', this.currentContractType);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search)
            .subscribe(function (data) {
            if (data.hasError) {
                _this.messageModal.show(data, true);
            }
            else {
                _this.setControlValue('ContractNumber', data.ContractNumber);
                _this.setControlValue('ContractName', data.ContractName);
                _this.setControlValue('PremiseNumber', data.PremiseNumber);
                _this.setControlValue('PremiseName', data.PremiseName);
                _this.setControlValue('ProductCode', data.ProductCode);
                _this.setControlValue('ProductDesc', data.ProductDesc);
                _this.setControlValue('FieldName', _this.riExchange.getParentAttributeValue('FieldName'));
                _this.setControlValue('OriginalValue', data.OriginalValue);
                _this.setControlValue('AmendedValue', data.AmendedValue);
                _this.amendedValue = data.AmendedValue;
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.messageModal.show(error, true);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ;
    DataChangeMaintenanceComponent.prototype.dataChangeSave = function () {
        this.promptModalForSave.show();
    };
    ;
    DataChangeMaintenanceComponent.prototype.promptContentSaveData = function (eventObj) {
        var _this = this;
        var formdata = {};
        var queryPost = this.getURLSearchParamObject();
        queryPost.set(this.serviceConstants.Action, '2');
        formdata['RowID'] = this.currentContractType;
        formdata['UpdatedValue'] = this.getControlValue('AmendedValue');
        this.amendedValue = this.getControlValue('AmendedValue');
        formdata[this.serviceConstants.ContractNumber] = this.getControlValue('ContractNumber');
        formdata[this.serviceConstants.PremiseNumber] = this.getControlValue('PremiseNumber');
        this.queryParams.search = queryPost;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, queryPost, formdata)
            .subscribe(function (data) {
            if (data.hasError) {
                _this.messageModal.show(data, true);
            }
            else {
                _this.showMessageModal({ msg: _this.messageContentSave });
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.formPristine();
        }, function (error) {
            _this.messageModal.show(error, true);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ;
    DataChangeMaintenanceComponent.prototype.resetForm = function () {
        this.setControlValue('AmendedValue', this.amendedValue);
    };
    ;
    DataChangeMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSeDataChangeMaintenance.html'
                },] },
    ];
    DataChangeMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    DataChangeMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'promptModalForSave': [{ type: ViewChild, args: ['promptModalForSave',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return DataChangeMaintenanceComponent;
}(BaseComponent));
