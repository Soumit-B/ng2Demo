var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, ViewChild, Injector } from '@angular/core';
import { AccountSearchComponent } from '../search/iCABSASAccountSearch';
import { InvoiceGroupGridComponent } from '../grid-search/iCABSAInvoiceGroupGrid';
import { PaymentTermSearchComponent } from '../search/iCABSBPaymentTermSearch.component';
import { Validators } from '@angular/forms';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from './../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
export var InvoiceGroupPaymentMaintenanceComponent = (function (_super) {
    __extends(InvoiceGroupPaymentMaintenanceComponent, _super);
    function InvoiceGroupPaymentMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.showErrorHeader = true;
        this.queryPost = new URLSearchParams();
        this.showMessageHeader = true;
        this.showMessageHeaderSave = true;
        this.showPromptCloseButtonSave = true;
        this.promptTitleSave = '';
        this.promptContentSave = MessageConstant.Message.ConfirmRecord;
        this.showHeader = true;
        this.showCloseButton = true;
        this.controls = [];
        this.autoOpenSearch = false;
        this.promptModalConfigSave = {
            ignoreBackdropClick: true
        };
        this.inputParams = {
            Operation: 'Application/iCABSAInvoiceGroupPaymentMaintenance',
            method: 'bill-to-cash/maintenance',
            module: 'payment',
            action: '',
            parentMode: '',
            businessCode: '',
            countryCode: ''
        };
        this.invoiceGroupGridComponent = InvoiceGroupGridComponent;
        this.PaymentTermSearchComponent = PaymentTermSearchComponent;
        this.accountSearchComponent = AccountSearchComponent;
        this.ellipsisQueryParams = {
            inputParamsAccountNumber: {
                parentMode: 'AccountSearch',
                showAddNewDisplay: false
            },
            inputParamsInvoiceGroupNumber: {
                parentMode: 'Lookup'
            },
            inputParamsPaymentTermSearch: {
                parentMode: 'Lookup'
            }
        };
        this.ellipsis = {
            account: {
                disable: false
            },
            invoice: {
                disable: true
            },
            payment: {
                disable: true
            }
        };
        this.pageId = PageIdentifier.ICABSAINVOICEGROUPPAYMENTMAINTENANCE;
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        this.messageContentSave = MessageConstant.Message.SavedSuccessfully;
        this.messageContentError = MessageConstant.Message.SaveError;
    }
    InvoiceGroupPaymentMaintenanceComponent.prototype.ngAfterViewInit = function () {
        this.autoOpenSearch = true;
        this.setMessageCallback(this);
        this.setErrorCallback(this);
    };
    InvoiceGroupPaymentMaintenanceComponent.prototype.ngOnInit = function () {
        this.inputParams.businessCode = this.utils.getBusinessCode();
        this.inputParams.countryCode = this.utils.getCountryCode();
        this.buildForm();
        this.disableControl('Save', true);
        this.disableControl('Cancel', true);
    };
    InvoiceGroupPaymentMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    InvoiceGroupPaymentMaintenanceComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show({ msg: data.msg, title: 'Error' }, false);
    };
    InvoiceGroupPaymentMaintenanceComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };
    InvoiceGroupPaymentMaintenanceComponent.prototype.buildForm = function () {
        this.uiForm = this.formBuilder.group({
            AccountNumber: [{ value: '', disabled: false }, Validators.required],
            AccountName: [{ value: '', disabled: true }],
            InvoiceGroupNumber: [{ value: '', disabled: true }, Validators.required],
            InvoiceGroupName: [{ value: '', disabled: true }],
            PaymentTermNumber: [{ value: '', disabled: true }, Validators.required],
            PaymentTermDesc: [{ value: '', disabled: true }],
            Save: [{ disabled: true }],
            Cancel: [{ disabled: true }]
        });
    };
    InvoiceGroupPaymentMaintenanceComponent.prototype.onAccountNumberReceived = function (data) {
        var accountNumber = data[this.serviceConstants.AccountNumber];
        var accountName = data['AccountName'];
        this.setControlValue(this.serviceConstants.AccountNumber, accountNumber);
        this.setControlValue('AccountName', accountName);
        this.setControlValue('InvoiceGroupNumber', '');
        this.setControlValue('PaymentTermNumber', '');
        this.setControlValue('PaymentTermDesc', '');
        this.disableControl('InvoiceGroupNumber', false);
        this.disableControl('PaymentTermNumber', true);
        this.ellipsis.invoice.disable = false;
        this.ellipsis.payment.disable = true;
        this.formClone = this.uiForm.getRawValue();
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber[this.serviceConstants.AccountNumber] = accountNumber;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountName'] = accountName;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountNumberChanged'] = true;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['parentMode'] = 'InvoiceGroupPaymentMaintenance';
        this.invoiceGroupEllipsis.childConfigParams = this.ellipsisQueryParams.inputParamsInvoiceGroupNumber;
        this.setFormMode(this.c_s_MODE_UPDATE);
    };
    InvoiceGroupPaymentMaintenanceComponent.prototype.onInvoiceGroupNumberReceived = function (data) {
        var invoiceGroupNumber = data['Number'];
        var invoiceGroupName = data['Description'];
        this.setControlValue('InvoiceGroupNumber', invoiceGroupNumber);
        this.setControlValue('InvoiceGroupName', invoiceGroupName);
        this.disableControl('PaymentTermNumber', false);
        this.disableControl('Save', false);
        this.disableControl('Cancel', false);
        this.ellipsis.payment.disable = false;
        this.formClone = this.uiForm.getRawValue();
        this.onPaymentTermNumberReceived();
        this.setFormMode(this.c_s_MODE_UPDATE);
    };
    InvoiceGroupPaymentMaintenanceComponent.prototype.onPaymentTermReceived = function (data) {
        var PaymentTermNumber = data['PaymentTermNumber'];
        var PaymentTermDesc = data['PaymentTermDesc'];
        this.setControlValue('PaymentTermNumber', PaymentTermNumber);
        this.setControlValue('PaymentTermDesc', PaymentTermDesc);
        this.setFormMode(this.c_s_MODE_UPDATE);
    };
    InvoiceGroupPaymentMaintenanceComponent.prototype.onAccountNumberChange = function (event) {
        this.setControlValue('AccountName', '');
        this.setControlValue('InvoiceGroupNumber', '');
        this.setControlValue('PaymentTermNumber', '');
        this.setControlValue('PaymentTermDesc', '');
        this.disableControl('PaymentTermNumber', true);
        this.disableControl('Save', true);
        this.disableControl('Cancel', true);
        this.setFormMode(this.c_s_MODE_SELECT);
        this.formClone = this.uiForm.getRawValue();
        this.ellipsis.payment.disable = true;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber[this.serviceConstants.AccountNumber] = this.getControlValue(this.serviceConstants.AccountNumber);
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountName'] = this.getControlValue('AccountName');
    };
    InvoiceGroupPaymentMaintenanceComponent.prototype.onInvoiceNumberChange = function (event) {
        this.setControlValue('PaymentTermNumber', '');
        this.setControlValue('PaymentTermDesc', '');
        this.disableControl('PaymentTermNumber', true);
        this.disableControl('Save', true);
        this.disableControl('Cancel', true);
        this.ellipsis.payment.disable = true;
        this.formClone = this.uiForm.getRawValue();
    };
    InvoiceGroupPaymentMaintenanceComponent.prototype.saveInvoiceGroupData = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'InvoiceGroup',
                'query': {
                    'AccountNumber': this.getControlValue('AccountNumber'),
                    'BusinessCode': this.utils.getBusinessCode(),
                    'InvoiceGroupNumber': this.getControlValue('InvoiceGroupNumber'),
                    'PaymentTermCode': this.getControlValue('PaymentTermNumber')
                },
                'fields': ['PaymentTermCode']
            },
            {
                'table': 'Account',
                'query': { 'AccountNumber': this.getControlValue('AccountNumber'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['AccountName']
            },
            {
                'table': 'PaymentTerm',
                'query': {
                    'PaymentTermCode': this.getControlValue('PaymentTermNumber'),
                    'BusinessCode': this.utils.getBusinessCode()
                },
                'fields': ['PaymentTermDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data[2].length > 0) {
                _this.promptModalForSave.show();
                _this.setControlValue('PaymentTermDesc', data[2][0].PaymentTermDesc);
            }
            else {
                _this.setControlValue('PaymentTermNumber', '');
                _this.setControlValue('PaymentTermDesc', '');
                _this.uiForm.controls['PaymentTermNumber'].setErrors({});
            }
        });
    };
    InvoiceGroupPaymentMaintenanceComponent.prototype.resetForm = function () {
        this.uiForm.setValue(this.formClone);
        this.fetchTranslationContent();
    };
    InvoiceGroupPaymentMaintenanceComponent.prototype.promptContentSaveData = function (eventObj) {
        var _this = this;
        var formdata = {};
        this.queryPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryPost.set(this.serviceConstants.Action, '2');
        formdata[this.serviceConstants.AccountNumber] = this.getControlValue(this.serviceConstants.AccountNumber);
        formdata['InvoiceGroupNumber'] = this.getControlValue('InvoiceGroupNumber');
        formdata['PaymentTermNumber'] = this.getControlValue('PaymentTermNumber');
        formdata['PaymentTermCode'] = this.getControlValue('PaymentTermNumber');
        this.inputParams.search = this.queryPost;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.Operation, this.queryPost, formdata)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.showErrorModal(data.oResponse);
            }
            else {
                if (data.errorMessage && data.errorMessage !== '') {
                    _this.showErrorModal({
                        msg: data.errorMessage
                    });
                }
                else {
                    _this.showMessageModal({
                        msg: MessageConstant.Message.RecordSavedSuccessfully
                    });
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
        this.disableControl('InvoiceGroupNumber', false);
        this.disableControl('AccountNumber', false);
    };
    InvoiceGroupPaymentMaintenanceComponent.prototype.onPaymentTermNumberReceived = function () {
        if (this.getControlValue('AccountNumber') && this.getControlValue('InvoiceGroupNumber')) {
            this.doLookupforPaymentTermNumber();
        }
    };
    InvoiceGroupPaymentMaintenanceComponent.prototype.doLookupforPaymentTermNumber = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'InvoiceGroup',
                'query': {
                    'AccountNumber': this.getControlValue('AccountNumber'),
                    'BusinessCode': this.utils.getBusinessCode(),
                    'InvoiceGroupNumber': this.getControlValue('InvoiceGroupNumber')
                },
                'fields': ['PaymentTermCode']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var PaymentTermData = data[0][0];
            _this.setControlValue('PaymentTermNumber', PaymentTermData.PaymentTermCode);
            _this.onPaymentTermDescReceived();
            _this.disableControl('Save', false);
            _this.disableControl('Cancel', false);
            _this.formClone = _this.uiForm.getRawValue();
        });
    };
    InvoiceGroupPaymentMaintenanceComponent.prototype.onPaymentTermDescReceived = function () {
        if (this.getControlValue('PaymentTermNumber')) {
            this.doLookupforPaymentTermDesc();
        }
    };
    InvoiceGroupPaymentMaintenanceComponent.prototype.doLookupforPaymentTermDesc = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'PaymentTerm',
                'query': {
                    'PaymentTermCode': this.getControlValue('PaymentTermNumber'),
                    'BusinessCode': this.utils.getBusinessCode()
                },
                'fields': ['PaymentTermDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var PaymentTermData = data[0][0];
            _this.setControlValue('PaymentTermDesc', PaymentTermData.PaymentTermDesc);
            _this.formClone = _this.uiForm.getRawValue();
        });
    };
    InvoiceGroupPaymentMaintenanceComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('Save', null).subscribe(function (res) {
            if (res) {
                _this.setControlValue('Save', res);
            }
        });
        this.getTranslatedValue('Cancel', null).subscribe(function (res) {
            if (res) {
                _this.setControlValue('Cancel', res);
            }
        });
    };
    InvoiceGroupPaymentMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAInvoiceGroupPaymentMaintenance.html'
                },] },
    ];
    InvoiceGroupPaymentMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    InvoiceGroupPaymentMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'promptModalForSave': [{ type: ViewChild, args: ['promptModalForSave',] },],
        'invoiceGroupEllipsis': [{ type: ViewChild, args: ['invoiceGroupEllipsis',] },],
        'paymentTermEllipsis': [{ type: ViewChild, args: ['paymentTermEllipsis',] },],
    };
    return InvoiceGroupPaymentMaintenanceComponent;
}(BaseComponent));
