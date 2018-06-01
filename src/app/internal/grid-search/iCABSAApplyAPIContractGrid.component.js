var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from './../../base/BaseComponent';
import { URLSearchParams } from '@angular/http';
import { Component, ViewChild, Injector } from '@angular/core';
export var ApplyAPIContractGridComponent = (function (_super) {
    __extends(ApplyAPIContractGridComponent, _super);
    function ApplyAPIContractGridComponent(injector) {
        _super.call(this, injector);
        this.trBranch = true;
        this.trRegion = true;
        this.search = new URLSearchParams();
        this.pageId = '';
        this.queryParams = {
            action: '2',
            operation: 'Application/iCABSAApplyAPIContractGrid',
            module: 'api',
            method: 'contract-management/maintenance'
        };
        this.pageTitle = 'Preview API Contract';
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.totalItems = 10;
        this.maxColumn = 14;
        this.controls = [
            { name: 'BusinessCode', readonly: false, disabled: false, required: false },
            { name: 'BusinessDesc', readonly: true, disabled: true, required: false },
            { name: 'MonthName', readonly: true, disabled: false, required: true },
            { name: 'BranchNumber', readonly: false, disabled: false, required: false },
            { name: 'BranchName', readonly: true, disabled: false, required: false },
            { name: 'LessThan', readonly: true, disabled: false, required: false },
            { name: 'RegionCode', readonly: false, disabled: false, required: false },
            { name: 'RegionDescription', readonly: false, disabled: false, required: false }
        ];
        this.pageId = PageIdentifier.ICABSAAPPLYAPICONTRACTGRID;
    }
    ApplyAPIContractGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.initPage();
        this.loadGridData();
    };
    ApplyAPIContractGridComponent.prototype.getCurrentPage = function (currentPage) {
        this.currentPage = currentPage.value;
        this.loadGridData();
    };
    ApplyAPIContractGridComponent.prototype.getGridInfo = function (info) {
        this.apiContractPagination.totalItems = info.totalRows;
    };
    ApplyAPIContractGridComponent.prototype.getRefreshData = function () {
        this.currentPage = 1;
        this.loadGridData();
    };
    ApplyAPIContractGridComponent.prototype.loadGridData = function () {
        var inputParams = {};
        inputParams.module = this.queryParams.module;
        inputParams.method = this.queryParams.method;
        inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.Action, this.queryParams.action);
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set('PageCurrent', this.currentPage.toString());
        this.search.set('PageSize', this.itemsPerPage.toString());
        this.search.set('Level', this.formData.ViewBy);
        this.search.set('ViewBy', 'Contract');
        this.search.set('LessThan', this.formData.LessThan);
        this.search.set('MonthNo', this.formData.MonthNo);
        this.search.set('YearNo', this.formData.YearNo);
        if (this.trRegion) {
            this.search.set('RegionCode', this.formData.RegionCode);
        }
        else {
            this.search.set('BranchNumber', this.formData.BranchNumber);
        }
        this.search.set('riGridHandle', '1180828');
        this.search.set('riGridMode', '0');
        inputParams.search = this.search;
        this.apiContractGrid.loadGridData(inputParams);
    };
    ApplyAPIContractGridComponent.prototype.getSelectedRowInfo = function (event) {
        console.log('getSelectedRowInfo', event);
        if (event.rowData && event.rowData['Contract Number'] !== 'TOTAL') {
            console.log('Contract Number', event.cellData.text);
            this.router.navigate([this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], {
                queryParams: {
                    parentMode: 'ContractExpiryGrid',
                    ContractNumber: event.cellData.text
                }
            });
        }
    };
    ApplyAPIContractGridComponent.prototype.initPage = function () {
        this.formData.BusinessDesc = this.riExchange.getParentHTMLValue('BusinessDesc');
        this.formData.BranchNumber = this.riExchange.getParentAttributeValue('BranchNumber');
        this.formData.BranchName = this.riExchange.getParentAttributeValue('BranchName');
        this.formData.RegionCode = this.riExchange.getParentAttributeValue('RegionCode');
        this.formData.RegionDescription = this.riExchange.getParentAttributeValue('RegionDescription');
        this.formData.ViewBy = this.riExchange.getParentAttributeValue('ViewBy');
        this.formData.MonthName = this.riExchange.getParentAttributeValue('MonthName');
        this.formData.YearNo = this.riExchange.getParentAttributeValue('YearNo');
        this.formData.LessThan = this.riExchange.getParentHTMLValue('LessThan');
        this.formData.MonthNo = this.riExchange.getParentAttributeValue('MonthNo');
        this.populateUIFromFormData();
        this.riExchange.riInputElement.Disable(this.uiForm, 'MonthName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BusinessCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BusinessDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BranchNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BranchName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'RegionCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'RegionDescription');
        this.riExchange.riInputElement.Disable(this.uiForm, 'LessThan');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PreviewYear');
        if (this.formData.ViewBy === 'Region') {
            this.trBranch = false;
            this.trRegion = true;
        }
        else {
            this.trBranch = true;
            this.trRegion = false;
        }
    };
    ApplyAPIContractGridComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-apply-contract-grid',
                    templateUrl: 'iCABSAApplyAPIContractGrid.html'
                },] },
    ];
    ApplyAPIContractGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    ApplyAPIContractGridComponent.propDecorators = {
        'apiContractGrid': [{ type: ViewChild, args: ['apiContractGrid',] },],
        'apiContractPagination': [{ type: ViewChild, args: ['apiContractPagination',] },],
    };
    return ApplyAPIContractGridComponent;
}(BaseComponent));
