var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
export var ServiceCoverLocationEffectDateSearchComponent = (function (_super) {
    __extends(ServiceCoverLocationEffectDateSearchComponent, _super);
    function ServiceCoverLocationEffectDateSearchComponent(injector) {
        _super.call(this, injector);
        this.queryParams = {
            operation: 'Application/iCABSAServiceCoverLocationEffectDateSearch',
            module: 'locations',
            method: 'service-delivery/search'
        };
        this.controls = [
            { name: 'ContractNumber', readonly: true, disabled: true, required: false },
            { name: 'ContractName', readonly: true, disabled: true, required: false },
            { name: 'PremiseNumber', readonly: true, disabled: true, required: false },
            { name: 'PremiseName', readonly: true, disabled: true, required: false },
            { name: 'ProductCode', readonly: true, disabled: true, required: false },
            { name: 'ProductDesc', readonly: true, disabled: true, required: false },
            { name: 'PremiseLocationNumber', readonly: true, disabled: true, required: false },
            { name: 'PremiseLocationDesc', readonly: true, disabled: true, required: false },
            { name: 'ServiceVisitFrequency', readonly: true, disabled: true, required: false },
            { name: 'ServiceCoverRowID', readonly: true, disabled: true, required: false },
            { name: 'EffectiveDateFrom', readonly: true, disabled: true, required: false }
        ];
        this.pageId = '';
        this.search = new URLSearchParams();
        this.riGrid = {};
        this.itemsPerPage = 11;
        this.currentPage = 1;
        this.totalItems = 10;
        this.maxColumn = 2;
        this.grdEffectiveDateSearch = {};
        this.pageId = PageIdentifier.ICABSASERVICECOVERLOCATIONEFFECTDATESEARCH;
    }
    ServiceCoverLocationEffectDateSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.window_onload();
    };
    ServiceCoverLocationEffectDateSearchComponent.prototype.window_onload = function () {
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
        this.setControlValue('ServiceVisitFrequency', this.riExchange.getParentHTMLValue('ServiceVisitFrequency'));
        this.setControlValue('PremiseLocationNumber', this.riExchange.getParentHTMLValue('PremiseLocationNumber'));
        this.setControlValue('PremiseLocationDesc', this.riExchange.getParentHTMLValue('PremiseLocationDesc'));
        this.setControlValue('ServiceCoverRowID', this.riExchange.getParentAttributeValue('ServiceCoverRowID'));
    };
    ServiceCoverLocationEffectDateSearchComponent.prototype.buildGrid = function () {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('ContractNumber', this.getControlValue('ContractNumber'));
        this.search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        this.search.set('ProductCode', this.getControlValue('ProductCode'));
        this.search.set('PremiseLocationNumber', this.getControlValue('PremiseLocationNumber'));
        this.search.set('ServiceCoverROWID', this.getControlValue('ServiceCoverRowID'));
        this.search.set(this.serviceConstants.PageSize, (this.itemsPerPage - 1).toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '1509660');
        this.queryParams.search = this.search;
        this.EffectiveDateSearchGrid.loadGridData(this.queryParams);
    };
    ServiceCoverLocationEffectDateSearchComponent.prototype.gridOnClick = function (data) {
        this.riGrid.rowIndex = data.rowIndex;
        this.riGrid.cellIndex = data.cellIndex;
        this.riGrid.rowData = data.rowData;
        this.riGrid.rowID = data.cellData.rowID;
        this.riGrid.cellData = this.EffectiveDateSearchGrid.getCellInfoForSelectedRow(this.riGrid.rowIndex, this.riGrid.cellIndex);
        var headerColumnData = this.EffectiveDateSearchGrid.getHeaderInfoForSelectedCell(this.riGrid.rowIndex, this.riGrid.cellIndex);
        this.riGrid.headerTitle = headerColumnData.text;
        this.EffectDateFocus(data);
    };
    ServiceCoverLocationEffectDateSearchComponent.prototype.gridOnDblClick = function (data) {
        var returnObj = {};
        this.riExchange.setParentHTMLValue('EffectiveDateFrom', this.riExchange.getParentAttributeValue('ContractNumberEffectiveDate'));
        returnObj['EffectiveDateFrom'] = data.trRowData[0].text;
        this.emitSelectedData(returnObj);
    };
    ServiceCoverLocationEffectDateSearchComponent.prototype.EffectDateFocus = function (data) {
        this.grdEffectiveDateSearch.Row = this.riGrid.rowIndex;
        if (this.riGrid.headerTitle === 'Effective Date') {
            this.grdEffectiveDateSearch.EffectiveDate = this.riGrid.rowID;
        }
    };
    ServiceCoverLocationEffectDateSearchComponent.prototype.getGridInfo = function (info) {
        this.EffectiveDateSearchPagination.totalItems = info.totalRows;
    };
    ServiceCoverLocationEffectDateSearchComponent.prototype.sortGridInfo = function (data) {
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, data.fieldname);
        this.search.set(this.serviceConstants.GridSortOrder, data.sort === 'DESC' ? 'Descending' : 'Ascending');
        this.refresh();
    };
    ServiceCoverLocationEffectDateSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.currentPage = currentPage.value;
        this.refresh();
    };
    ServiceCoverLocationEffectDateSearchComponent.prototype.refresh = function () {
        this.buildGrid();
    };
    ServiceCoverLocationEffectDateSearchComponent.prototype.updateView = function (params) {
        if (params.ContractNumber)
            this.setControlValue('ContractNumber', params.ContractNumber);
        if (params.ContractName)
            this.setControlValue('ContractName', params.ContractName);
        if (params.PremiseNumber)
            this.setControlValue('PremiseNumber', params.PremiseNumber);
        if (params.PremiseName)
            this.setControlValue('PremiseName', params.PremiseName);
        if (params.ProductCode)
            this.setControlValue('ProductCode', params.ProductCode);
        if (params.ProductDesc)
            this.setControlValue('ProductDesc', params.ProductDesc);
        if (params.PremiseLocationNumber)
            this.setControlValue('PremiseLocationNumber', params.PremiseLocationNumber);
        if (params.PremiseLocationDesc)
            this.setControlValue('PremiseLocationDesc', params.PremiseLocationDesc);
        if (params.ServiceVisitFrequency)
            this.setControlValue('ServiceVisitFrequency', params.ServiceVisitFrequency);
        if (params.ServiceCoverRowID)
            this.setControlValue('ServiceCoverRowID', params.ServiceCoverRowID);
        this.buildGrid();
    };
    ServiceCoverLocationEffectDateSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverLocationEffectDateSearch.html'
                },] },
    ];
    ServiceCoverLocationEffectDateSearchComponent.ctorParameters = [
        { type: Injector, },
    ];
    ServiceCoverLocationEffectDateSearchComponent.propDecorators = {
        'EffectiveDateSearchGrid': [{ type: ViewChild, args: ['EffectiveDateSearchGrid',] },],
        'EffectiveDateSearchPagination': [{ type: ViewChild, args: ['EffectiveDateSearchPagination',] },],
    };
    return ServiceCoverLocationEffectDateSearchComponent;
}(BaseComponent));
