var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from './../../base/BaseComponent';
export var ApiRateSearchComponent = (function (_super) {
    __extends(ApiRateSearchComponent, _super);
    function ApiRateSearchComponent(injector) {
        _super.call(this, injector);
        this.queryParams = {
            operation: 'Business/iCABSBAPIRateSearch',
            module: 'api',
            method: 'contract-management/search'
        };
        this.pageId = '';
        this.search = this.getURLSearchParamObject();
        this.controls = [
            { name: 'APICode', readonly: true, disabled: true, required: false },
            { name: 'APICodeDesc', readonly: true, disabled: true, required: false },
            { name: 'APIRateEffectDate', readonly: false, disabled: false, required: false },
            { name: 'APIRate', readonly: false, disabled: false, required: false },
            { name: 'ttAPIRate', readonly: false, disabled: false, required: false },
            { name: 'BusinessCode', readonly: false, disabled: false, required: false }
        ];
        this.effectDate = 'Effective Date';
        this.apIRate = 'API Rate';
        this.columns = [];
        this.tableheader = 'API Rate Search';
        this.pageId = PageIdentifier.ICABSBAPIRATESEARCH;
    }
    ApiRateSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'APICode', this.riExchange.getParentHTMLValue('APICode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'APICodeDesc', this.riExchange.getParentHTMLValue('APICodeDesc'));
        this.buildTableColumns();
        this.buildTable();
    };
    ApiRateSearchComponent.prototype.buildTableColumns = function () {
        var _this = this;
        this.columns = [];
        this.getTranslatedValue(this.effectDate, null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'APIRateEffectDate' });
            }
            else {
                _this.columns.push({ title: _this.effectDate, name: 'APIRateEffectDate' });
            }
        });
        this.getTranslatedValue(this.apIRate, null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'APIRate' });
            }
            else {
                _this.columns.push({ title: _this.apIRate, name: 'APIRate' });
            }
        });
    };
    ApiRateSearchComponent.prototype.buildTable = function () {
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('APICode', this.riExchange.getParentHTMLValue('APICode'));
        this.search.set('search.sortby', 'APIRateEffectDate DESC');
        this.queryParams.search = this.search;
        this.apiRateSearchTable.loadTableData(this.queryParams);
    };
    ApiRateSearchComponent.prototype.onSelect = function (event) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'APIRateEffectDate', event.row.APIRateEffectDate);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'APIRate', event.row.APIRate);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ttAPIRate', event.row.ttAPIRate);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessCode', event.row.BusinessCode);
        this.navigate('RowSelected', 'maintenance/apiRateMaintenance');
    };
    ApiRateSearchComponent.prototype.onButtonClick = function () {
        this.navigate('SearchAdd', 'maintenance/apiRateMaintenance');
    };
    ApiRateSearchComponent.prototype.tableDataLoaded = function (data) {
        var tableRecords = data.tableData['records'];
        if (tableRecords.length === 0) {
            this.tableheader = 'No record found';
        }
    };
    ApiRateSearchComponent.prototype.refresh = function () {
        this.buildTable();
    };
    ApiRateSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBApiRateSearch.html'
                },] },
    ];
    ApiRateSearchComponent.ctorParameters = [
        { type: Injector, },
    ];
    ApiRateSearchComponent.propDecorators = {
        'apiRateSearchTable': [{ type: ViewChild, args: ['apiRateSearchTable',] },],
    };
    return ApiRateSearchComponent;
}(BaseComponent));
