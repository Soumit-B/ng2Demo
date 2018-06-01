var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
export var InvoiceRunDateSelectPrintComponent = (function (_super) {
    __extends(InvoiceRunDateSelectPrintComponent, _super);
    function InvoiceRunDateSelectPrintComponent(injector, _router, route) {
        _super.call(this, injector);
        this._router = _router;
        this.route = route;
        this.pageId = '';
        this.controls = [];
        this.searchParams = {
            'InvoiceNumberFirst': '',
            'InvoiceNumberLast': ''
        };
        this.pageTitle = 'Invoice Print';
        this.queryParams = {
            operation: 'Business/iCABSBInvoiceRunDateSelectPrint',
            module: 'invoicing',
            method: 'bill-to-cash/maintenance'
        };
        this.tableheading = 'Invoice Run Date';
        this.pageCurrent = 1;
        this.itemsPerPage = 15;
        this.search = new URLSearchParams();
        this.pageSize = '25';
        this.inputParams = {};
        this.maxColumn = 5;
        this.pageId = PageIdentifier.ICABSBINVOICERUNDATESELECTPRINT;
    }
    InvoiceRunDateSelectPrintComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Invoice Print';
        this.querySubscription = this.route.queryParams.subscribe(function (params) {
            _this.queryParamValues = params;
            if (params['InvoiceNumberFirst']) {
                _this.searchParams['InvoiceNumberFirst'] = params['InvoiceNumberFirst'];
            }
            if (params['InvoiceNumberLast']) {
                _this.searchParams['InvoiceNumberLast'] = params['InvoiceNumberLast'];
            }
            _this.loadData();
        });
    };
    InvoiceRunDateSelectPrintComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    InvoiceRunDateSelectPrintComponent.prototype.loadData = function () {
        this.setFilterValues();
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.inputParams.module = this.queryParams.module;
        this.inputParams.search = this.search;
        this.InvoiceRunDateSelectPrintGrid.itemsPerPage = this.itemsPerPage;
        this.InvoiceRunDateSelectPrintGrid.loadGridData(this.inputParams);
    };
    InvoiceRunDateSelectPrintComponent.prototype.setFilterValues = function () {
        this.search = this.getURLSearchParamObject();
        this.search.set('Function', 'Company');
        this.search.set('FirstInvoice', this.searchParams['InvoiceNumberFirst']);
        this.search.set('LastInvoice', this.searchParams['InvoiceNumberLast']);
        this.search.set('SCSortInvoicesByCompanyCode', 'FALSE');
        this.search.set('SCSortInvoicesByInvoiceRange', 'FALSE');
        this.search.set('IRCompanyLevel', 'FALSE');
        this.search.set('IRBranchLevel', 'FALSE');
        this.search.set('IRTaxCodeLevel', 'FALSE');
        this.search.set('IRInvoiceCreditLevel', 'FALSE');
        this.search.set('IRContractTypeLevel', 'FALSE');
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', '985138');
        this.search.set('PageSize', this.pageSize);
        this.search.set('PageCurrent', '1');
        this.search.set('HeaderClickedColumn', '');
        this.search.set('riSortOrder', 'Ascending');
        this.search.set('action', '2');
    };
    InvoiceRunDateSelectPrintComponent.prototype.getCurrentPage = function (event) {
        this.pageCurrent = event.value;
    };
    InvoiceRunDateSelectPrintComponent.prototype.getGridInfo = function (info) {
        this.invoiceRunDatPagination.totalItems = info.totalRows;
        this.totalRecords = info.totalRows;
    };
    InvoiceRunDateSelectPrintComponent.prototype.refresh = function () {
        this.loadData();
    };
    InvoiceRunDateSelectPrintComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBInvoiceRunDateSelectPrint.html'
                },] },
    ];
    InvoiceRunDateSelectPrintComponent.ctorParameters = [
        { type: Injector, },
        { type: Router, },
        { type: ActivatedRoute, },
    ];
    InvoiceRunDateSelectPrintComponent.propDecorators = {
        'InvoiceRunDateSelectPrintGrid': [{ type: ViewChild, args: ['InvoiceRunDateSelectPrintGrid',] },],
        'invoiceRunDatPagination': [{ type: ViewChild, args: ['invoiceRunDatPagination',] },],
    };
    return InvoiceRunDateSelectPrintComponent;
}(BaseComponent));
