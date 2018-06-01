var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { URLSearchParams } from '@angular/http';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';
import { CBBService } from './../../../shared/services/cbb.service';
export var MultiPremisePurchaseOrderAmendComponent = (function (_super) {
    __extends(MultiPremisePurchaseOrderAmendComponent, _super);
    function MultiPremisePurchaseOrderAmendComponent(injector, cbb) {
        _super.call(this, injector);
        this.cbb = cbb;
        this.search = new URLSearchParams();
        this.pageId = '';
        this.promptTitleSave = '';
        this.promptContentSave = MessageConstant.Message.ConfirmRecord;
        this.messageContentSave = MessageConstant.Message.SavedSuccessfully;
        this.messageContentError = MessageConstant.Message.SaveError;
        this.autoOpen = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.chkChangeAllFlag = false;
        this.fromPurchaseOrderNoRequired = true;
        this.contractRowId = '';
        this.contractSearchComponent = ContractSearchComponent;
        this.inputParamsContractSearch = {
            'parentMode': 'LookUp-AccountMove'
        };
        this.controls = [
            { name: 'ContractROWID' },
            { name: 'ContractNumber', disabled: false, required: true },
            { name: 'ContractName', disabled: true, required: true },
            { name: 'AccountNumber', disabled: true, required: true },
            { name: 'chkChangeAll', disabled: false },
            { name: 'FromPurchaseOrderNo', disabled: false, required: true },
            { name: 'ToPurchaseOrderNo', disabled: false, required: true }
        ];
        this.muleConfig = {
            method: 'bill-to-cash/maintenance',
            module: 'payment',
            operation: 'Application/iCABSAMultiPremisePurchaseOrderAmend',
            action: '2'
        };
        this.formModel = {};
        this.pageId = PageIdentifier.ICABSAMULTIPREMISEPURCHASEORDERAMEND;
    }
    ;
    MultiPremisePurchaseOrderAmendComponent.prototype.ngAfterViewInit = function () {
        this.setMessageCallback(this);
        this.setErrorCallback(this);
        this.setControlValue('chkChangeAll', false);
        this.autoOpen = true;
    };
    ;
    MultiPremisePurchaseOrderAmendComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show({ msg: data.msg, title: 'Error' }, false);
    };
    ;
    MultiPremisePurchaseOrderAmendComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };
    ;
    MultiPremisePurchaseOrderAmendComponent.prototype.setContractNameAndAccountNumber = function (data) {
        this.clearControlsOnContractNumberChange();
        this.setControlValue('ContractROWID', data.ttContract);
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.setControlValue('AccountNumber', data.AccountNumber);
        this.setControlValue('ContractName', data.ContractName);
        this.disableCBB(true);
    };
    MultiPremisePurchaseOrderAmendComponent.prototype.disableCBB = function (disable) {
        var _this = this;
        setTimeout(function () {
            _this.cbb.disableComponent(disable);
        }, 0);
    };
    MultiPremisePurchaseOrderAmendComponent.prototype.onContractNumberChange = function (event) {
        this.clearControlsOnContractNumberChange();
        if (!this.getControlValue('ContractNumber')) {
            this.disableCBB(false);
            return;
        }
        this.lookupContractNameAndAccountNumber();
    };
    MultiPremisePurchaseOrderAmendComponent.prototype.toggleChangeAll = function (event) {
        if (this.getControlValue('chkChangeAll')) {
            this.fromPurchaseOrderNoRequired = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'FromPurchaseOrderNo', true);
            this.riExchange.riInputElement.Enable(this.uiForm, 'FromPurchaseOrderNo');
        }
        else {
            this.fromPurchaseOrderNoRequired = false;
            this.setControlValue('FromPurchaseOrderNo', '');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'FromPurchaseOrderNo', false);
            this.riExchange.riInputElement.Disable(this.uiForm, 'FromPurchaseOrderNo');
        }
    };
    MultiPremisePurchaseOrderAmendComponent.prototype.lookupContractNameAndAccountNumber = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookup_details = [{
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber')
                },
                'fields': ['ContractName', 'AccountNumber']
            }];
        this.LookUp.lookUpRecord(lookup_details).subscribe(function (data) {
            if (data.length > 0) {
                var contractData = data[0];
                if (contractData.length > 0) {
                    _this.setControlValue('ContractROWID', contractData[0].ttContract);
                    _this.setControlValue('ContractName', contractData[0].ContractName);
                    _this.setControlValue('AccountNumber', contractData[0].AccountNumber);
                    _this.disableCBB(true);
                }
                else {
                    _this.disableCBB(false);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ;
    MultiPremisePurchaseOrderAmendComponent.prototype.savePurchaseOrder = function () {
        if (this.riExchange.validateForm(this.uiForm))
            this.promptModalForSave.show();
    };
    MultiPremisePurchaseOrderAmendComponent.prototype.cancelPurchaseOrder = function () {
        this.clearControls([
            'ContractNumber',
            'ContractName',
            'AccountNumber'
        ]);
        this.fromPurchaseOrderNoRequired = true;
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'FromPurchaseOrderNo', true);
        this.riExchange.riInputElement.Enable(this.uiForm, 'FromPurchaseOrderNo');
    };
    MultiPremisePurchaseOrderAmendComponent.prototype.clearControlsOnContractNumberChange = function () {
        this.clearControls([
            'ContractNumber'
        ]);
        this.fromPurchaseOrderNoRequired = true;
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'FromPurchaseOrderNo', true);
        this.riExchange.riInputElement.Enable(this.uiForm, 'FromPurchaseOrderNo');
    };
    MultiPremisePurchaseOrderAmendComponent.prototype.promptContentSaveData = function (eventObj) {
        var _this = this;
        var queryPost = this.getURLSearchParamObject();
        queryPost.set(this.serviceConstants.Action, '2');
        var formdata = this.uiForm.getRawValue();
        formdata.chkChangeAll ? formdata.chkChangeAll = 'yes' : formdata.chkChangeAll = 'no';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, queryPost, formdata)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.showErrorModal(data.oResponse);
            }
            else {
                if (data.errorMessage && data.errorMessage !== '') {
                    _this.showErrorModal(data);
                }
                else {
                    _this.showMessageModal(data);
                    _this.clearControlsOnContractNumberChange();
                    _this.cancelPurchaseOrder();
                    _this.disableCBB(false);
                    _this.uiForm.reset();
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    MultiPremisePurchaseOrderAmendComponent.prototype.trimInputField = function (control) {
        this.setControlValue(control, this.getControlValue(control).trim());
    };
    MultiPremisePurchaseOrderAmendComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAMultiPremisePurchaseOrderAmend.html'
                },] },
    ];
    MultiPremisePurchaseOrderAmendComponent.ctorParameters = [
        { type: Injector, },
        { type: CBBService, },
    ];
    MultiPremisePurchaseOrderAmendComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'promptModalForSave': [{ type: ViewChild, args: ['promptModalForSave',] },],
    };
    return MultiPremisePurchaseOrderAmendComponent;
}(BaseComponent));
