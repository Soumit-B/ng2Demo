var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { Component, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
export var SalesAreaPostCodeComponent = (function (_super) {
    __extends(SalesAreaPostCodeComponent, _super);
    function SalesAreaPostCodeComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.pageTitle = '';
        this.parentMode = '';
        this.inputParams = {};
        this.itemsPerPage = 10;
        this.totalRecords = 10;
        this.currentPage = 1;
        this.branchName = '';
        this.maxColumn = 3;
        this.showErrorHeader = false;
        this.showMessageHeader = false;
        this.promptTitle = '';
        this.promptContent = '';
        this.muleConfig = {
            method: 'contract-management/maintenance',
            module: 'contract-admin',
            operation: 'Business/iCABSBSalesAreaPostCodeGrid',
            contentType: 'application/x-www-form-urlencoded',
            action: '2'
        };
        this.controls = [
            { name: 'SalesAreaCode', readonly: false, disabled: true, required: false },
            { name: 'SalesAreaDesc', readonly: false, disabled: true, required: false }
        ];
        this.pageId = PageIdentifier.ICABSBSALESAREAPOSTCODEGRID;
        this.pageTitle = 'Sales Area Postcode Grid';
        this.search = this.getURLSearchParamObject();
    }
    SalesAreaPostCodeComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageInIt();
        this.buildGrid();
    };
    SalesAreaPostCodeComponent.prototype.pageInIt = function () {
        var salesAreaCode = this.riExchange.getParentHTMLValue('SalesAreaCode');
        var salesAreaDesc = this.riExchange.getParentHTMLValue('SalesAreaDesc');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesAreaCode', salesAreaCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesAreaDesc', salesAreaDesc);
    };
    SalesAreaPostCodeComponent.prototype.getLoggedInBranch = function () {
        var _this = this;
        this.utils.getLoggedInBranch(this.businessCode(), this.countryCode()).subscribe(function (data) {
            if (data.results) {
                data.results.forEach(function (node) {
                    if (node && node.length > 0 && node[0].BusinessCode === _this.businessCode) {
                        _this.branchName = node[0].BranchNumber;
                        _this.buildGrid();
                    }
                });
            }
        });
    };
    SalesAreaPostCodeComponent.prototype.buildGrid = function () {
        this.search = new URLSearchParams();
        this.inputParams.module = this.muleConfig.module;
        this.inputParams.method = this.muleConfig.method;
        this.inputParams.operation = this.muleConfig.operation;
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('Function', 'SalesArea');
        this.search.set('SalesAreaCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'SalesAreaCode'));
        this.search.set('BranchNumber', this.utils.getBranchCode());
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('HeaderClickedColumn', '');
        this.search.set(this.serviceConstants.GridPageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.GridPageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.Action, this.muleConfig.action);
        this.inputParams.search = this.search;
        this.salesAreaPostCodeGrid.loadGridData(this.inputParams);
    };
    SalesAreaPostCodeComponent.prototype.getGridInfo = function (info) {
        this.totalRecords = info.totalRows;
    };
    SalesAreaPostCodeComponent.prototype.getCurrentPage = function (data) {
        this.currentPage = data.value;
        this.buildGrid();
    };
    SalesAreaPostCodeComponent.prototype.refresh = function () {
        this.currentPage = (this.currentPage) ? this.currentPage : 1;
        this.buildGrid();
    };
    SalesAreaPostCodeComponent.prototype.onBackLinkClick = function (event) {
        event.preventDefault();
        this.location.back();
    };
    SalesAreaPostCodeComponent.prototype.promptSave = function (event) {
        console.log(event);
    };
    SalesAreaPostCodeComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBSalesAreaPostCodeGrid.html'
                },] },
    ];
    SalesAreaPostCodeComponent.ctorParameters = [
        { type: Injector, },
    ];
    SalesAreaPostCodeComponent.propDecorators = {
        'salesAreaPostCodeGrid': [{ type: ViewChild, args: ['salesAreaPostCodeGrid',] },],
        'salesAreaPostCodePagination': [{ type: ViewChild, args: ['salesAreaPostCodePagination',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return SalesAreaPostCodeComponent;
}(BaseComponent));
