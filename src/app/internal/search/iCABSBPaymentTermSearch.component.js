var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
export var PaymentTermSearchComponent = (function (_super) {
    __extends(PaymentTermSearchComponent, _super);
    function PaymentTermSearchComponent(injector, ellipsis) {
        _super.call(this, injector);
        this.ellipsis = ellipsis;
        this.pageId = '';
        this.search = new URLSearchParams();
        this.controls = [];
        this.columns = [
            { title: 'Code', name: 'PaymentTermCode', className: 'col2' },
            { title: 'Description', name: 'PaymentTermDesc', className: 'col21' },
            { title: 'Default For Business', name: 'DefaultPaymentTermInd', className: 'col1' }
        ];
        this.queryParams = {
            operation: 'Business/iCABSBPaymentTermSearch',
            module: 'payment',
            method: 'bill-to-cash/search'
        };
        this.tableheading = 'List Group Search';
        this.page = '1';
        this.itemsPerPage = '10';
        this.totalItem = 10;
        this.rowmetadata = [
            { name: 'DefaultPaymentTermInd', type: 'img' }
        ];
        this.pageId = PageIdentifier.ICABSBLISTGROUPSEARCH;
    }
    PaymentTermSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Payment Term Search';
    };
    PaymentTermSearchComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    PaymentTermSearchComponent.prototype.updateView = function (params) {
        this.inputParams = params;
        this.buildTable();
    };
    ;
    PaymentTermSearchComponent.prototype.onSelect = function (data) {
        var returnObj;
        switch (this.inputParams.parentMode) {
            case 'Lookup':
                returnObj = {
                    'PaymentTermNumber': data.row['PaymentTermCode'],
                    'PaymentTermDesc': data.row['PaymentTermDesc']
                };
                break;
            default:
                returnObj = {
                    'PaymentTermNumber': '',
                    'PaymentTermDesc': ''
                };
                break;
        }
        this.ellipsis.sendDataToParent(returnObj);
    };
    PaymentTermSearchComponent.prototype.onRefresh = function () {
        this.buildTable();
    };
    PaymentTermSearchComponent.prototype.buildTable = function () {
        this.queryParams.rowmetadata = this.rowmetadata;
        this.localeTranslateService.setUpTranslation();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParams.search = this.search;
        this.paymentTermSearch.loadTableData(this.queryParams);
    };
    PaymentTermSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBPaymentTermSearch.html'
                },] },
    ];
    PaymentTermSearchComponent.ctorParameters = [
        { type: Injector, },
        { type: EllipsisComponent, },
    ];
    PaymentTermSearchComponent.propDecorators = {
        'paymentTermSearch': [{ type: ViewChild, args: ['paymentTermSearch',] },],
    };
    return PaymentTermSearchComponent;
}(BaseComponent));
