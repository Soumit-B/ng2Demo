var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
export var InvoiceReprintMaintenanceComponent = (function (_super) {
    __extends(InvoiceReprintMaintenanceComponent, _super);
    function InvoiceReprintMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.pageTitle = '';
        this.parentMode = '';
        this.branchName = '';
        this.backLinkText = '';
        this.invoiceReprintModel = {
            'InvoiceNumber': '',
            'AccountNumber': '',
            'AccountName': '',
            'InvoiceContactEmail': '',
            'InvoiceContactName': '',
            'ttInvoiceHeader': ''
        };
        this.muleConfig = {
            method: 'contract-management/maintenance',
            module: 'contract-admin',
            operation: 'Application/iCABSAInvoiceReprintMaintenance',
            contentType: 'application/x-www-form-urlencoded',
            action: '0'
        };
        this.controls = [
            { name: 'AccountNumber', readonly: false, disabled: true, required: false },
            { name: 'AccountName', readonly: false, disabled: true, required: false },
            { name: 'InvoiceNumber', readonly: false, disabled: true, required: false },
            { name: 'dInvoiceContactName', readonly: false, disabled: false, required: false },
            { name: 'dInvoiceContactEmail', readonly: false, disabled: false, required: false }
        ];
        this.pageId = PageIdentifier.ICABSAINVOICEREPRINTMAINTENANCE;
        this.pageTitle = 'Invoice Reprint Maintenance';
        this.search = this.getURLSearchParamObject();
    }
    InvoiceReprintMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.invoiceReprintModel.InvoiceNumber = this.getFieldValue(this.riExchange.getParentHTMLValue('InvoiceNumber'));
        this.invoiceReprintModel.InvoiceRowId = this.getFieldValue(this.riExchange.getParentHTMLValue('InvoiceRowId'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNumber', this.invoiceReprintModel.InvoiceNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceRowId', this.invoiceReprintModel.InvoiceRowId);
        this.fetchAcountNumber();
    };
    InvoiceReprintMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    InvoiceReprintMaintenanceComponent.prototype.fetchAcountNumber = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'InvoiceHeader',
                'query': {
                    'InvoiceNumber': this.invoiceReprintModel.InvoiceNumber
                },
                'fields': ['AccountNumber']
            }
        ];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data[0][0] && data[0][0].AccountNumber) {
                _this.invoiceReprintModel.AccountNumber = data[0][0].AccountNumber;
                _this.invoiceReprintModel.ttInvoiceHeader = data[0][0].ttInvoiceHeader || '';
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AccountNumber', _this.invoiceReprintModel.AccountNumber);
                _this.fetchLookupParams(_this.invoiceReprintModel.AccountNumber);
            }
        });
    };
    InvoiceReprintMaintenanceComponent.prototype.fetchLookupParams = function (acountNumber) {
        var _this = this;
        var lookupIP = [
            {
                'table': 'InvoiceGroup',
                'query': {
                    'AccountNumber': acountNumber, 'BusinessCode': this.businessCode()
                },
                'fields': ['InvoiceContactEmail', 'InvoiceContactName']
            },
            {
                'table': 'Account',
                'query': {
                    'AccountNumber': acountNumber, 'BusinessCode': this.businessCode()
                },
                'fields': ['AccountName']
            }
        ];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data[0][0]) {
                if (data[0][0].InvoiceContactEMail) {
                    _this.invoiceReprintModel.InvoiceContactEmail = data[0][0].InvoiceContactEMail;
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'dInvoiceContactEmail', _this.invoiceReprintModel.InvoiceContactEmail);
                }
                if (data[0][0].InvoiceContactName) {
                    _this.invoiceReprintModel.InvoiceContactName = data[0][0].InvoiceContactName;
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'dInvoiceContactName', _this.invoiceReprintModel.InvoiceContactName);
                }
            }
            if (data[1][0] && data[1][0].AccountName) {
                _this.invoiceReprintModel.AccountName = data[1][0].AccountName;
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AccountName', _this.invoiceReprintModel.AccountName);
            }
        });
    };
    InvoiceReprintMaintenanceComponent.prototype.onCmdEmail = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '0');
        query.set('countryCode', this.countryCode());
        query.set('businessCode', this.businessCode());
        var postData = {
            'ModuleName': 'EMail',
            'InvoiceNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNumber'),
            'ContactName': this.riExchange.riInputElement.GetValue(this.uiForm, 'dInvoiceContactName'),
            'ContactEmail': this.riExchange.riInputElement.GetValue(this.uiForm, 'dInvoiceContactEmail')
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, query, postData)
            .subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.status === 'failure') {
                _this.errorService.emitError(data.oResponse);
            }
            else {
                if (data.ErrorMessage) {
                    _this.messageModal.show({ msg: data.ErrorMessage }, false);
                }
            }
        });
    };
    InvoiceReprintMaintenanceComponent.prototype.onCmdView = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '0');
        query.set('countryCode', this.countryCode());
        query.set('businessCode', this.businessCode());
        query.set('Function', 'Single');
        query.set('ViewPrintSelected', 'RePrint');
        query.set('InvoiceNumber', this.invoiceReprintModel.InvoiceRowId ? this.invoiceReprintModel.InvoiceRowId : this.invoiceReprintModel.ttInvoiceHeader);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, query)
            .subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.status === 'failure') {
                _this.errorService.emitError(data.oResponse);
            }
            else {
                if (data.url) {
                    window.open(data.url, '_blank');
                }
                else if (data.errorMessage) {
                    _this.messageModal.show({ msg: data.errorMessage }, false);
                }
            }
        });
    };
    InvoiceReprintMaintenanceComponent.prototype.getFieldValue = function (value) {
        return (value) ? value : '';
    };
    InvoiceReprintMaintenanceComponent.prototype.onBackLinkClick = function (event) {
        event.preventDefault();
        this.location.back();
    };
    InvoiceReprintMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAInvoiceReprintMaintenance.html'
                },] },
    ];
    InvoiceReprintMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    InvoiceReprintMaintenanceComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return InvoiceReprintMaintenanceComponent;
}(BaseComponent));
