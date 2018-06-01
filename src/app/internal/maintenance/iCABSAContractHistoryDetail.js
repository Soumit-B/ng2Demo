var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { URLSearchParams } from '@angular/http';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { PageIdentifier } from './../../base/PageIdentifier';
export var ContractHistoryDetailComponent = (function (_super) {
    __extends(ContractHistoryDetailComponent, _super);
    function ContractHistoryDetailComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.search = new URLSearchParams();
        this.queryPost = new URLSearchParams();
        this.inputParams = {};
        this.cExchangeParentMode = '';
        this.contractnumberDetails = {};
        this.messageContentError = MessageConstant.Message.noRecordFound;
        this.contractTypeTexts = {
            title: 'Contract History Detail',
            label: 'Contract Number'
        };
        this.fieldsVisibility = {
            account: false,
            premise: false,
            product: false
        };
        this.controls = [
            { name: 'ContractNumber', disabled: true },
            { name: 'ContractName', disabled: true },
            { name: 'AccountNumber', disabled: true },
            { name: 'AccountName', disabled: true },
            { name: 'PremiseNumber', disabled: true },
            { name: 'PremiseName', disabled: true },
            { name: 'ProductCode', disabled: true },
            { name: 'ProductDesc', disabled: true },
            { name: 'ContractHistoryNarrative', disabled: true }
        ];
        this.muleConfig = {
            method: 'contract-management/grid',
            module: 'contract',
            operation: 'Application/iCABSAContractHistoryDetail'
        };
        this.pageId = PageIdentifier.ICABSACONTRACTHISTORYDETAIL;
    }
    ContractHistoryDetailComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.windowOnload();
    };
    ContractHistoryDetailComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    ContractHistoryDetailComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show({ msg: data.msg, title: 'Error' }, false);
    };
    ;
    ContractHistoryDetailComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };
    ;
    ContractHistoryDetailComponent.prototype.windowOnload = function () {
        this.cExchangeParentMode = this.parentMode;
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        switch (this.riExchange.getCurrentContractType()) {
            case 'C':
                this.contractTypeTexts.title = 'Contract History Detail';
                this.contractTypeTexts.label = 'Contract Number';
                break;
            case 'J':
                this.contractTypeTexts.title = 'Job History Detail';
                this.contractTypeTexts.label = 'Job Number';
                break;
            case 'P':
                this.contractTypeTexts.title = 'Product Sales History Detail';
                this.contractTypeTexts.label = 'Product Sales Number';
                break;
        }
        ;
        this.setControlValue('ContractNumber', this.riExchange.getParentAttributeValue('ContractNumber'));
        if (this.riExchange.getParentAttributeValue('AccountNumber')) {
            this.setControlValue('AccountNumber', this.riExchange.getParentAttributeValue('AccountNumber'));
            this.fieldsVisibility.account = true;
        }
        this.getContractHistoryDetails(this.riExchange.getParentAttributeValue('ContractHistoryRowID'));
    };
    ;
    ContractHistoryDetailComponent.prototype.getContractHistoryDetails = function (rowId) {
        var _this = this;
        var queryPost = this.getURLSearchParamObject();
        queryPost.set(this.serviceConstants.Action, '0');
        queryPost.set(this.serviceConstants.BusinessCode, this.businessCode());
        queryPost.set(this.serviceConstants.ContractNumber, this.getControlValue('ContractNumber'));
        queryPost.set('ROWID', rowId);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, queryPost)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.showErrorModal(data.oResponse);
            }
            else {
                if (data.errorMessage && data.errorMessage !== '') {
                    _this.showErrorModal(data);
                }
                else {
                    _this.setControlValue('ContractNumber', data.ContractNumber);
                    _this.setControlValue('ContractHistoryNumber', data.ContractHistoryNumber);
                    _this.setControlValue('PremiseNumber', data.PremiseNumber);
                    _this.setControlValue('ProductCode', data.ProductCode);
                    _this.setControlValue('ContractHistoryNarrative', data.ContractHistoryNarrative);
                    if (data.PremiseNumber)
                        _this.fieldsVisibility.premise = true;
                    if (data.ProductCode)
                        _this.fieldsVisibility.product = true;
                    _this.lookupRest();
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ;
    ContractHistoryDetailComponent.prototype.lookupRest = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookup_details = [{
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber')
                },
                'fields': ['ContractName']
            }, {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber')
                },
                'fields': ['PremiseName']
            }, {
                'table': 'Account',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'AccountNumber': this.getControlValue('AccountNumber')
                },
                'fields': ['AccountName']
            }, {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductCode': this.getControlValue('ProductCode')
                },
                'fields': ['ProductDesc']
            }];
        this.LookUp.lookUpRecord(lookup_details).subscribe(function (data) {
            if (data.length > 0) {
                var contractData = data[0];
                var premiseData = data[1];
                var accountData = data[2];
                var productData = data[3];
                if (contractData.length > 0) {
                    _this.setControlValue('ContractName', contractData[0].ContractName);
                }
                if (premiseData.length > 0) {
                    _this.setControlValue('PremiseName', premiseData[0].PremiseName);
                }
                if (accountData.length > 0) {
                    _this.setControlValue('AccountName', accountData[0].AccountName);
                }
                if (productData.length > 0) {
                    _this.setControlValue('ProductDesc', productData[0].ProductDesc);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ;
    ContractHistoryDetailComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAContractHistoryDetail.html'
                },] },
    ];
    ContractHistoryDetailComponent.ctorParameters = [
        { type: Injector, },
    ];
    ContractHistoryDetailComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return ContractHistoryDetailComponent;
}(BaseComponent));
