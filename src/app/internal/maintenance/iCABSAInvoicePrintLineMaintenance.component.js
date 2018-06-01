var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MessageConstant } from '../../../shared/constants/message.constant';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { RiMaintenance } from './../../../shared/services/riMaintenancehelper';
export var InvoicePrintLineComponent = (function (_super) {
    __extends(InvoicePrintLineComponent, _super);
    function InvoicePrintLineComponent(injector) {
        _super.call(this, injector);
        this.queryParams = {
            operation: 'Application/iCABSAInvoicePrintLineMaintenance',
            module: 'invoicing',
            method: 'bill-to-cash/maintenance',
            search: ''
        };
        this.pageId = '';
        this.showHeader = true;
        this.promptTitle = MessageConstant.Message.ConfirmRecord;
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.controls = [
            { name: 'CompanyCode', readonly: false, disabled: true, required: false },
            { name: 'CompanyInvoiceNumber', readonly: false, disabled: true, required: false },
            { name: 'InvoicePrintLineNumber', readonly: false, disabled: true, required: false },
            { name: 'InvoicePrintLineDesc', readonly: false, disabled: false, required: false },
            { name: 'InvoiceNumber', readonly: false, disabled: true, required: false },
            { name: 'CompanyDesc', readonly: false, disabled: true, required: false }
        ];
        this.columns = [
            { title: 'InvoicePrintLineDesc', name: 'InvoicePrintLineDesc' }
        ];
        this.tableheading = 'InvoicePrintLine';
        this.pageId = PageIdentifier.ICABSAINVOICEPRINTLINEMAINTENANCE;
        this.xhr = this.httpService;
        this.riMaintenance = new RiMaintenance(this.logger, this.xhr, this.LookUp, this.utils, this.serviceConstants);
    }
    InvoicePrintLineComponent.prototype.savePost = function () {
        var _this = this;
        var searchPost;
        searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, this.actionParameter);
        var postParams = {};
        postParams.table = 'InvoicePrintLine';
        postParams.InvoiceNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNumber');
        postParams.InvoicePrintLineNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoicePrintLineNumber');
        postParams.InvoicePrintLineDesc = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoicePrintLineDesc');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchPost, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                    _this.errorService.emitError(e['oResponse']);
                }
                else if (e['errorMessage']) {
                    _this.messageModal.show({ msg: e['errorMessage'], title: _this.pageTitle }, false);
                    _this.errorService.emitError(e['errorMessage']);
                }
                else {
                    _this.location.back();
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoicePrintLineComponent.prototype.cancelPage = function () {
        this.location.back();
    };
    InvoicePrintLineComponent.prototype.GetNextInvoicePrintLineNumber = function () {
        var _this = this;
        var searchPost;
        searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, '6');
        var postParams = {};
        postParams.Function = 'GetNextInvoicePrintLineNumber';
        postParams.InvoiceNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNumber');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchPost, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                    _this.errorService.emitError(e['oResponse']);
                }
                else if (e['errorMessage']) {
                    _this.errorService.emitError(e);
                }
                else {
                    _this.setControlValue('InvoicePrintLineNumber', e.InvoicePrintLineNumber);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoicePrintLineComponent.prototype.doLookupformData = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'InvoicePrintLine',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'InvoiceNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNumber'),
                    'InvoicePrintLineNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoicePrintLineNumber')
                },
                'fields': ['InvoicePrintLineDesc']
            },
            {
                'table': 'InvoiceHeader',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'InvoiceNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNumber')
                },
                'fields': ['CompanyCode', 'CompanyInvoiceNumber']
            },
            {
                'table': 'Company',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'CompanyCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'CompanyCode')
                },
                'fields': ['CompanyDesc']
            }
        ];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var invoicePrintLine = data[0][0];
            if (invoicePrintLine) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoicePrintLineDesc', invoicePrintLine.InvoicePrintLineDesc);
            }
            var companyData = data[1][0];
            var companyOther = data[2][0];
            if (companyOther) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'CompanyDesc', companyOther.CompanyDesc);
            }
        });
    };
    InvoicePrintLineComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Invoice Print Line Maintenance';
        this.window_onload();
    };
    InvoicePrintLineComponent.prototype.ngOnDestroy = function () {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        _super.prototype.ngOnDestroy.call(this);
    };
    InvoicePrintLineComponent.prototype.onClickPostCode = function () {
        this.childModal.show();
    };
    InvoicePrintLineComponent.prototype.postCodeMessageClose = function () {
        this.childModal.hide();
    };
    InvoicePrintLineComponent.prototype.window_onload = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNumber', this.riExchange.getParentHTMLValue('InvoiceNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyCode', this.riExchange.getParentHTMLValue('CompanyCode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyInvoiceNumber', this.riExchange.getParentHTMLValue('CompanyInvoiceNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoicePrintLineNumber', this.riExchange.getParentHTMLValue('PrintLineNumber'));
        this.businessCode();
        switch (this.parentMode) {
            case 'InvoicePrintLineUpdate':
                this.doLookupformData();
                this.riMaintenance.FetchRecord();
                this.riMaintenance.UpdateMode();
                this.actionParameter = '2';
                break;
            case 'InvoicePrintLineAdd':
                this.riMaintenance.FunctionUpdate = false;
                this.riMaintenance.FunctionAdd = true;
                this.riMaintenance.AddMode();
                this.disableControl('InvoicePrintLineNumber', false);
                this.GetNextInvoicePrintLineNumber();
                this.actionParameter = '1';
                break;
            case 'InvoicePrintLineDel':
                this.doLookupformData();
                this.riMaintenance.FunctionDelete = true;
                this.riMaintenance.FunctionSelect = false;
                this.riMaintenance.FunctionUpdate = false;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoicePrintLineNumber', this.riExchange.getParentHTMLValue('PrintLineNumber'));
                this.riMaintenance.FetchRecord();
                this.riMaintenance.UpdateMode();
                break;
        }
    };
    InvoicePrintLineComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAInvoicePrintLineMaintenance.html'
                },] },
    ];
    InvoicePrintLineComponent.ctorParameters = [
        { type: Injector, },
    ];
    InvoicePrintLineComponent.propDecorators = {
        'childModal': [{ type: ViewChild, args: ['promptModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return InvoicePrintLineComponent;
}(BaseComponent));
