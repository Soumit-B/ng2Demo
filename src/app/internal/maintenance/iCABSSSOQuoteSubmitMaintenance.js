var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { PromptModalComponent } from './../../../shared/components/prompt-modal/prompt-modal';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { PaymentSearchComponent } from './../search/iCABSBPaymentTypeSearch';
import { Component, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
export var QuoteSubmitMaintenanceComponent = (function (_super) {
    __extends(QuoteSubmitMaintenanceComponent, _super);
    function QuoteSubmitMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.CONFIRM_CANCEL = 'CONFIRM_CANCEL';
        this.CONFIRM_SAVE = 'CONFIRM_SAVE';
        this.hasErrorProcessedVADDInd = false;
        this.controls = [
            { name: 'PaymentTypeCode', required: true },
            { name: 'PaymentDesc', disabled: true },
            { name: 'AuthorityCode' },
            { name: 'ProcessedVADDInd', required: true },
            { name: 'MandateRequired' },
            { name: 'ReferenceRequired' },
            { name: 'dlBatchRef' },
            { name: 'dlRecordType' },
            { name: 'dlExtRef' },
            { name: 'dlContractRef' },
            { name: 'QuoteNumber' },
            { name: 'ProspectNumber' },
            { name: 'SubmitMessage' }
        ];
        this.hideControl = {
            AuthorityCode: false,
            ProcessedVADDInd: false
        };
        this.xhrConfig = {
            method: 'prospect-to-contract/maintenance',
            module: 'advantage',
            operation: 'Sales/iCABSSSOQuoteSubmitMaintenance'
        };
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.showPromptHeader = true;
        this.promptTitle = MessageConstant.Message.ConfirmRecord;
        this.promptContent = '';
        this.ellipsConf = {
            paymentTypeCode: {
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'businessCode': '',
                    'countryCode': '',
                    action: 0
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: PaymentSearchComponent,
                showHeader: true
            }
        };
        this.ttPaymentDesc = '';
        this.ttMandateRequired = '';
        this.ttReferenceRequired = '';
        this.pageId = PageIdentifier.ICABSCMPROSPECTCONVERSIONMAINTENANCE;
    }
    QuoteSubmitMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.ellipsConf.paymentTypeCode.childConfigParams.businessCode = this.businessCode();
        this.ellipsConf.paymentTypeCode.childConfigParams.countryCode = this.countryCode();
    };
    QuoteSubmitMaintenanceComponent.prototype.ngAfterViewInit = function () {
        this.setMessageCallback(this);
        this.messageModal.showCloseButton = false;
        this.setErrorCallback(this);
        this.initPage();
    };
    QuoteSubmitMaintenanceComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show(data, true);
    };
    QuoteSubmitMaintenanceComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data, title: 'Message' }, false);
    };
    QuoteSubmitMaintenanceComponent.prototype.onModalClose = function () {
        this.location.back();
    };
    QuoteSubmitMaintenanceComponent.prototype.promptSave = function (e) {
        if (e.value === PromptModalComponent.SAVE) {
            if (e.data.action === this.CONFIRM_SAVE) {
                this.doSave();
            }
        }
    };
    QuoteSubmitMaintenanceComponent.prototype.initPage = function () {
        this.setControlValue('ProspectNumber', this.riExchange.getParentAttributeValue('ProspectNumber'));
        this.setControlValue('QuoteNumber', this.riExchange.getParentAttributeValue('QuoteNumber'));
        this.rowID = this.riExchange.getParentAttributeValue('dlContractRowID');
        if (this.rowID) {
            this.fetchRecord();
        }
    };
    QuoteSubmitMaintenanceComponent.prototype.fetchRecord = function () {
        var _this = this;
        var queryParams;
        queryParams = this.getURLSearchParamObject();
        queryParams.set(this.serviceConstants.Action, '0');
        queryParams.set('dlContractROWID', this.rowID);
        queryParams.set('dlBatchRef', this.getControlValue('dlBatchRef'));
        queryParams.set('dlRecordType', this.getControlValue('dlRecordType'));
        queryParams.set('dlContractRef', this.getControlValue('dlContractRef'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.xhrConfig.method, this.xhrConfig.module, this.xhrConfig.operation, queryParams)
            .subscribe(function (value) {
            if (value.hasError) {
                _this.errorService.emitError(value);
            }
            else {
                _this.populateDataToForm(value);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    QuoteSubmitMaintenanceComponent.prototype.populateDataToForm = function (data) {
        if (data) {
            this.setControlValue('dlBatchRef', data.dlBatchRef);
            this.setControlValue('dlContractRef', data.dlContractRef);
            this.setControlValue('PaymentTypeCode', data.PaymentTypeCode);
            this.setControlValue('PaymentDesc', data.PaymentDesc);
            this.setControlValue('AuthorityCode', data.AuthorityCode);
            this.setControlValue('ReferenceRequired', data.ReferenceRequired);
            this.setControlValue('MandateRequired', data.MandateRequired);
            setTimeout(function () {
                this.doLookup();
                this.populatePaymentCodeFields();
            }.bind(this), 1000);
        }
    };
    QuoteSubmitMaintenanceComponent.prototype.onChangePaymentTypeCode = function (e) {
        this.populatePaymentCodeFields();
    };
    QuoteSubmitMaintenanceComponent.prototype.populatePaymentCodeFields = function () {
        var _this = this;
        var queryParams, formData = {};
        queryParams = this.getURLSearchParamObject();
        queryParams.set(this.serviceConstants.Action, '6');
        formData['Function'] = 'GetPaymentTypeCodeDetails';
        formData['PaymentTypeCode'] = this.getControlValue('PaymentTypeCode');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrConfig.method, this.xhrConfig.module, this.xhrConfig.operation, queryParams, formData)
            .subscribe(function (value) {
            if (value.hasError) {
            }
            else {
                _this.populatePaymentCodeFieldsToForm(value);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    QuoteSubmitMaintenanceComponent.prototype.populatePaymentCodeFieldsToForm = function (data) {
        if (data) {
            this.setControlValue('ReferenceRequired', false);
            this.setControlValue('MandateRequired', false);
            if (data.ReferenceRequired && data.ReferenceRequired.toLowerCase() === 'yes') {
                this.setControlValue('ReferenceRequired', true);
            }
            if (data.MandateRequired && data.MandateRequired.toLowerCase() === 'yes') {
                this.setControlValue('MandateRequired', true);
            }
            this.setControlValue('PaymentDesc', data.PaymentDesc);
            setTimeout(function () {
                this.refreshPaymentCodeFields();
            }.bind(this), 1000);
        }
    };
    QuoteSubmitMaintenanceComponent.prototype.refreshPaymentCodeFields = function () {
        var referenceRequired = this.getControlValue('ReferenceRequired'), mandateRequired = this.getControlValue('MandateRequired');
        if (referenceRequired) {
            this.hideControl.AuthorityCode = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'AuthorityCode', true);
        }
        else {
            this.hideControl.AuthorityCode = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'AuthorityCode', false);
        }
        if (mandateRequired) {
            this.hideControl.ProcessedVADDInd = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ProcessedVADDInd', true);
        }
        else {
            this.hideControl.ProcessedVADDInd = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ProcessedVADDInd', false);
        }
    };
    QuoteSubmitMaintenanceComponent.prototype.doLookup = function () {
        var _this = this;
        var paymentTypeCode = this.getControlValue('PaymentTypeCode');
        var data = [
            {
                'table': 'PaymentType',
                'query': { 'PaymentTypeCode': paymentTypeCode, 'BusinessCode': this.businessCode() },
                'fields': ['PaymentDesc', 'MandateRequired', 'ReferenceRequired']
            }
        ];
        this.lookUpRecord(data, 500).subscribe(function (e) {
            if (e.hasError) {
                _this.errorService.emitError(e);
            }
            else {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'] && e['results'][0].length > 0) {
                        var paymentType = [];
                        if (e['results'].length > 0 && e['results'][0].length > 0) {
                            paymentType = e['results'][0];
                        }
                    }
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    QuoteSubmitMaintenanceComponent.prototype.lookUpRecord = function (data, maxresults) {
        var queryLookUp = this.getURLSearchParamObject();
        queryLookUp.set(this.serviceConstants.Action, '0');
        queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(queryLookUp, data);
    };
    QuoteSubmitMaintenanceComponent.prototype.onPaymentTypeCodeEllipsisDataReceived = function (data) {
        if (data) {
            this.setControlValue('PaymentTypeCode', data.PaymentTypeCode);
            this.setControlValue('PaymentDesc', data.PaymentDesc);
            setTimeout(function () {
                this.populatePaymentCodeFields();
            }.bind(this), 1000);
        }
    };
    QuoteSubmitMaintenanceComponent.prototype.onClickSaveBtn = function () {
        this.riMaintenance_BeforeSave();
    };
    QuoteSubmitMaintenanceComponent.prototype.riMaintenance_BeforeSave = function () {
        var isValid, mandateRequired = this.getControlValue('MandateRequired');
        this.hasErrorProcessedVADDInd = false;
        isValid = this.riExchange.validateForm(this.uiForm);
        if (!this.getControlValue('ProcessedVADDInd')) {
            isValid = false;
            this.hasErrorProcessedVADDInd = true;
        }
        if (isValid) {
            this.promptModal.show({ 'action': this.CONFIRM_SAVE });
        }
    };
    QuoteSubmitMaintenanceComponent.prototype.doSave = function () {
        var _this = this;
        var queryParams, formData = {};
        queryParams = this.getURLSearchParamObject();
        queryParams.set(this.serviceConstants.Action, '2');
        formData['dlContractROWID'] = this.rowID;
        formData['dlBatchRef'] = this.getControlValue('dlBatchRef');
        formData['dlRecordType'] = this.getControlValue('dlRecordType');
        formData['dlContractRef'] = this.getControlValue('dlContractRef');
        formData['PaymentTypeCode'] = this.getControlValue('PaymentTypeCode');
        formData['AuthorityCode'] = this.getControlValue('AuthorityCode');
        formData['SubmitMessage'] = this.getControlValue('SubmitMessage');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrConfig.method, this.xhrConfig.module, this.xhrConfig.operation, queryParams, formData)
            .subscribe(function (value) {
            if (value.hasError) {
                _this.errorService.emitError(value);
            }
            else {
                _this.location.back();
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    QuoteSubmitMaintenanceComponent.prototype.doCancel = function () {
        this.location.back();
    };
    QuoteSubmitMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSSOQuoteSubmitMaintenance.html'
                },] },
    ];
    QuoteSubmitMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    QuoteSubmitMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
    };
    return QuoteSubmitMaintenanceComponent;
}(BaseComponent));
