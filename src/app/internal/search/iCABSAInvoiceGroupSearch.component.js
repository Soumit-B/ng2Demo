var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Router } from '@angular/router';
export var InvoiceGroupSearchComponent = (function (_super) {
    __extends(InvoiceGroupSearchComponent, _super);
    function InvoiceGroupSearchComponent(injector, _router) {
        _super.call(this, injector);
        this._router = _router;
        this.pageId = '';
        this.inputParams = {};
        this.method = 'contract-management/search';
        this.module = 'invoice-group';
        this.operation = 'Application/iCABSAInvoiceGroupSearch';
        this.AddRecordDisabled = false;
        this.tableheading = 'Invoice Group Search';
        this.page = 1;
        this.itemsPerPage = 10;
        this.LiveInvoiceGroupIndText = 'true';
        this.addButton = true;
        this.controls = [
            { name: 'AccountNumber', readonly: true, disabled: true, required: false },
            { name: 'AccountName', readonly: true, disabled: true, required: false },
            { name: 'LiveInvoiceGroupInd', readonly: false, disabled: false, required: false, value: true }
        ];
        this.columns = [
            { title: 'Invoice Group Number', name: 'InvoiceGroupNumber' },
            { title: 'Invoice Group Description', name: 'InvoiceGroupDesc' },
            { title: 'Invoice Name', name: 'InvoiceName' },
            { title: 'Invoice Address 1', name: 'InvoiceAddressLine1' },
            { title: 'Mandate Reference', name: 'ExOAMandateReference' },
            { title: 'Live', name: 'LiveInvoiceGroup' }
        ];
        this.rowmetadata = [
            { title: 'Live', name: 'LiveInvoiceGroup', type: 'img' }
        ];
        this.isEllipsis = false;
        this.pageId = PageIdentifier.ICABSAINVOICEGROUPSEARCH;
        this.DI = injector;
    }
    InvoiceGroupSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Invoice Group Search';
        this.inputParams.method = this.method;
        this.inputParams.module = this.module;
        this.inputParams.operation = this.operation;
        this.inputParams.columns = [];
        this.inputParams.columns = this.columns;
        this.inputParams.rowmetadata = [];
        this.inputParams.rowmetadata = this.rowmetadata;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', this.riExchange.getParentHTMLValue('AccountNumber'));
        this.addButton = true;
        this.callSetUp();
    };
    InvoiceGroupSearchComponent.prototype.updateView = function (params) {
        if (!params) {
            params = this.inputParams;
        }
        this.ellipsis = this.DI.get(EllipsisComponent);
        this.ellipsis.childConfigParams = params;
        this.isEllipsis = this.ellipsis.childConfigParams['isEllipsis'];
        this.parentMode = '';
        this.parentMode = this.ellipsis.childConfigParams['parentMode'];
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', this.ellipsis.childConfigParams['AccountNumber']);
        this.addButton = false;
        this.callSetUp();
    };
    InvoiceGroupSearchComponent.prototype.callSetUp = function () {
        this.lookupCallforAccountname();
        switch (this.parentMode) {
            case 'Account':
            case 'LookUp-AccountHistory':
                this.AddRecordDisabled = false;
                this.addButton = true;
                break;
            case 'ContactManagement':
                this.AddRecordDisabled = false;
                this.PremiseName = this.riExchange.getParentHTMLValue('Name');
                this.PremiseAddressLine1 = this.riExchange.getParentHTMLValue('AddressLine1');
                this.PremiseAddressLine2 = this.riExchange.getParentHTMLValue('AddressLine2');
                this.PremiseAddressLine3 = this.riExchange.getParentHTMLValue('AddressLine3');
                this.PremiseAddressLine4 = this.riExchange.getParentHTMLValue('AddressLine4');
                this.PremiseAddressLine5 = this.riExchange.getParentHTMLValue('AddressLine5');
                this.PremisePostCode = this.riExchange.getParentHTMLValue('PostCode');
                this.addButton = true;
                break;
            case 'Premise':
                this.AddRecordDisabled = false;
                this.PremiseName = this.riExchange.getParentHTMLValue('Name');
                this.PremiseAddressLine1 = this.riExchange.getParentHTMLValue('AddressLine1');
                this.PremiseAddressLine2 = this.riExchange.getParentHTMLValue('AddressLine2');
                this.PremiseAddressLine3 = this.riExchange.getParentHTMLValue('AddressLine3');
                this.PremiseAddressLine4 = this.riExchange.getParentHTMLValue('AddressLine4');
                this.PremiseAddressLine5 = this.riExchange.getParentHTMLValue('AddressLine5');
                this.PremisePostCode = this.riExchange.getParentHTMLValue('PostCode');
                this.addButton = true;
                break;
            default:
                this.AddRecordDisabled = true;
                this.addButton = false;
                break;
        }
        this.dovalueInvoiceGroup();
    };
    InvoiceGroupSearchComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    InvoiceGroupSearchComponent.prototype.onSearchClick = function () {
        this.dovalueInvoiceGroup();
    };
    InvoiceGroupSearchComponent.prototype.lookupCallforAccountname = function () {
        var _this = this;
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber')) {
            var lookupIP = [
                {
                    'table': 'Account',
                    'query': {
                        'BusinessCode': this.businessCode(),
                        'AccountNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber')
                    },
                    'fields': ['AccountName']
                }];
            this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
                var Account = data[0][0];
                if (Account) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AccountName', Account.AccountName);
                }
            });
        }
    };
    InvoiceGroupSearchComponent.prototype.dovalueInvoiceGroup = function () {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('AccountNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber'));
        this.search.set('LiveInvoiceGroupInd', this.LiveInvoiceGroupIndText);
        this.inputParams.search = this.search;
        this.InvoiceGroupTable.loadTableData(this.inputParams);
    };
    InvoiceGroupSearchComponent.prototype.selectedData = function (event) {
        var InvoiceGroupNumber = event.row.InvoiceGroupNumber;
        var InvoiceGroupDesc = event.row.InvoiceGroupDesc;
        var parentMode = '';
        if (this.isEllipsis === true) {
            parentMode = this.ellipsis.childConfigParams['parentMode'];
        }
        else {
            parentMode = this.parentMode;
        }
        switch (parentMode) {
            case 'Account':
                if (this.isEllipsis !== true) {
                    this._router.navigate(['/billtocash/maintenance/invoicegroup/search'], { queryParams: { parentMode: 'AccountSearch', InvoiceGroupNumber: InvoiceGroupNumber, InvoiceGroupDesc: InvoiceGroupDesc, AccountNumber: this.getControlValue('AccountNumber'), AccountName: this.getControlValue('AccountName') } });
                }
                else {
                    this.ellipsis.sendDataToParent(event.row);
                }
                break;
            case 'LookUp':
            case 'Premise':
            case 'ContactManagement':
                if (this.isEllipsis !== true) {
                    this._router.navigate(['/billtocash/maintenance/invoicegroup/search'], { queryParams: { InvoiceGroupNumber: InvoiceGroupNumber, InvoiceGroupDesc: InvoiceGroupDesc, AccountNumber: this.getControlValue('AccountNumber'), AccountName: this.getControlValue('AccountName') } });
                }
                else {
                    this.ellipsis.sendDataToParent(event.row);
                }
                break;
            case 'LookUp-AccountHistory':
                if (this.isEllipsis !== true) {
                    this._router.navigate(['/billtocash/maintenance/invoicegroup/search'], { queryParams: { AccountHistoryFilterValue: InvoiceGroupNumber, AccountHistoryFilterDesc: InvoiceGroupDesc, AccountNumber: this.getControlValue('AccountNumber'), AccountName: this.getControlValue('AccountName') } });
                }
                else {
                    this.ellipsis.sendDataToParent(event.row);
                }
                break;
            case 'LookUp-AccountDiary':
                if (this.isEllipsis !== true) {
                    this._router.navigate(['/billtocash/maintenance/invoicegroup/search'], { queryParams: { AccountDiaryFilterValue: InvoiceGroupNumber, AccountDiaryFilterDesc: InvoiceGroupDesc, AccountNumber: this.getControlValue('AccountNumber'), AccountName: this.getControlValue('AccountName') } });
                }
                else {
                    this.ellipsis.sendDataToParent(event.row);
                }
                break;
            default:
                if (this.isEllipsis !== true) {
                    this._router.navigate(['/billtocash/maintenance/invoicegroup/search'], { queryParams: { InvoiceGroupNumber: event.row.InvoiceGroupNumber, AccountNumber: this.getControlValue('AccountNumber'), AccountName: this.getControlValue('AccountName') } });
                }
                else {
                    this.ellipsis.sendDataToParent(event.row);
                }
                break;
        }
    };
    InvoiceGroupSearchComponent.prototype.LiveInvoiceGroupInd = function (event) {
        if (event.target.checked) {
            this.LiveInvoiceGroupIndText = 'true';
        }
        else {
            this.LiveInvoiceGroupIndText = '';
        }
        this.dovalueInvoiceGroup();
    };
    InvoiceGroupSearchComponent.prototype.cmdAddRecord_onclick = function (event) {
        switch (this.parentMode) {
            case 'Premise':
                this._router.navigate(['/billtocash/maintenance/invoicegroup/search'], { queryParams: { parentMode: 'PremiseSearchAdd', AccountNumber: this.getControlValue('AccountNumber'), AccountName: this.getControlValue('AccountName') } });
                break;
            case 'ContactManagement':
                this._router.navigate(['/billtocash/maintenance/invoicegroup/search'], { queryParams: { parentMode: 'ContactManagement', AccountNumber: this.getControlValue('AccountNumber'), AccountName: this.getControlValue('AccountName') } });
                break;
            default:
                this._router.navigate(['/billtocash/maintenance/invoicegroup/search'], { queryParams: { parentMode: 'AccountAdd', AccountNumber: this.getControlValue('AccountNumber'), AccountName: this.getControlValue('AccountName') } });
                break;
        }
    };
    InvoiceGroupSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAInvoiceGroupSearch.html'
                },] },
    ];
    InvoiceGroupSearchComponent.ctorParameters = [
        { type: Injector, },
        { type: Router, },
    ];
    InvoiceGroupSearchComponent.propDecorators = {
        'InvoiceGroupTable': [{ type: ViewChild, args: ['InvoiceGroupTable',] },],
    };
    return InvoiceGroupSearchComponent;
}(BaseComponent));
