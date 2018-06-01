var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
export var PremiseAccessTimesGridComponent = (function (_super) {
    __extends(PremiseAccessTimesGridComponent, _super);
    function PremiseAccessTimesGridComponent(injector) {
        _super.call(this, injector);
        this.queryParams = {
            operation: 'Application/iCABSPremiseAccessTimesGrid',
            module: 'template',
            method: 'service-planning/maintenance'
        };
        this.controls = [
            { name: 'ContractNumber', readonly: true, disabled: false, required: false },
            { name: 'ContractName', readonly: true, disabled: false, required: false },
            { name: 'PremiseNumber', readonly: true, disabled: false, required: false },
            { name: 'PremiseName', readonly: true, disabled: false, required: false },
            { name: 'ContractRowID' },
            { name: 'PremiseRowID' },
            { name: 'ServiceCoverRowID' },
            { name: 'ServiceCoverNumber' },
            { name: 'RowID' }
        ];
        this.pageId = '';
        this.routeParams = {};
        this.search = new URLSearchParams();
        this.pageSize = 13;
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.totalItems = 10;
        this.maxColumn = 15;
        this.selectedRow = -1;
        this.riGrid = {};
        this.headerProperties = [];
        this.pageId = PageIdentifier.ICABSPREMISEACCESSTIMESGRID;
    }
    PremiseAccessTimesGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Contract History';
        this.riExchange.setCurrentContractType();
        this.window_onload();
    };
    PremiseAccessTimesGridComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    PremiseAccessTimesGridComponent.prototype.window_onload = function () {
        this.currentContractType = this.riExchange.getCurrentContractType();
        this.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.parentMode = this.riExchange.getParentMode();
        switch (this.parentMode) {
            case 'Premise':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseRowID', this.riExchange.GetParentRowID(this.uiForm, 'Premise'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
                break;
            default:
                break;
        }
        this.headerProperties = [
            {
                'align': 'center',
                'width': '120px',
                'index': 0
            }
        ];
        this.buildGrid();
        this.buildFields();
        this.riGrid.Update = false;
    };
    PremiseAccessTimesGridComponent.prototype.buildGrid = function () {
        this.PremiseAccessTimesGrid.clearGridData();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        this.search.set('Level', 'Premise');
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, (Math.floor(Math.random() * 900000) + 100000).toString());
        this.queryParams.search = this.search;
        this.PremiseAccessTimesGrid.loadGridData(this.queryParams);
    };
    PremiseAccessTimesGridComponent.prototype.buildFields = function () {
        this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseName');
        this.parentMode = this.riExchange.getParentMode();
        switch (this.parentMode) {
            case 'Premise':
                this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
                break;
            default:
                break;
        }
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceCoverNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractRowID');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseRowID');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceCoverRowID');
    };
    PremiseAccessTimesGridComponent.prototype.gridOnClick = function (data) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractRowID', this.riExchange.getParentAttributeValue('RowID'));
    };
    PremiseAccessTimesGridComponent.prototype.getGridInfo = function (info) {
        if (info && info.totalPages) {
            this.totalItems = parseInt(info.totalPages, 10) * this.itemsPerPage;
        }
        else {
            this.totalItems = 0;
        }
    };
    PremiseAccessTimesGridComponent.prototype.sortGridInfo = function (data) {
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, data.fieldname);
        this.search.set(this.serviceConstants.GridSortOrder, data.sort === 'DESC' ? 'Descending' : 'Ascending');
        this.refresh();
    };
    PremiseAccessTimesGridComponent.prototype.getCurrentPage = function (currentPage) {
        this.selectedRow = -1;
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.PremiseAccessTimesGrid.loadGridData(this.queryParams);
    };
    PremiseAccessTimesGridComponent.prototype.refresh = function () {
        this.buildGrid();
    };
    PremiseAccessTimesGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSPremiseAccessTimesGrid.html'
                },] },
    ];
    PremiseAccessTimesGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    PremiseAccessTimesGridComponent.propDecorators = {
        'PremiseAccessTimesGrid': [{ type: ViewChild, args: ['PremiseAccessTimesGrid',] },],
        'PremiseAccessTimesPagination': [{ type: ViewChild, args: ['PremiseAccessTimesPagination',] },],
    };
    return PremiseAccessTimesGridComponent;
}(BaseComponent));
