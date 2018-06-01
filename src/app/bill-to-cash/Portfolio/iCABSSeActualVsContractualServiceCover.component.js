var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
export var ActualVsContractualServiceCoverComponent = (function (_super) {
    __extends(ActualVsContractualServiceCoverComponent, _super);
    function ActualVsContractualServiceCoverComponent(injector) {
        _super.call(this, injector);
        this.queryParams = {
            operation: 'ApplicationReport/iCABSSeActualVsContractualServiceCover',
            module: 'charges',
            method: 'bill-to-cash/grid'
        };
        this.pageId = '';
        this.itemsPerPage = 14;
        this.currentPage = 1;
        this.totalItems = 10;
        this.maxColumn = 11;
        this.search = new URLSearchParams();
        this.controls = [
            { name: 'BusinessCode', readonly: true, disabled: false, required: false },
            { name: 'BusinessDesc', readonly: true, disabled: false, required: false },
            { name: 'ContractNumber', readonly: false, disabled: false, required: false },
            { name: 'ContractName', readonly: false, disabled: false, required: false },
            { name: 'PremiseNumber', readonly: false, disabled: false, required: false },
            { name: 'PremiseName', readonly: false, disabled: false, required: false },
            { name: 'ViewBy', readonly: false, disabled: false, required: false, value: 'branch' },
            { name: 'ServiceFilter', readonly: false, disabled: false, required: false, value: 'all' },
            { name: 'PercTolerance', readonly: true, disabled: false, required: false },
            { name: 'FromDate', readonly: true, disabled: false, required: false },
            { name: 'ToDate', readonly: false, disabled: false, required: false },
            { name: 'WasteTransferTypeCode', readonly: false, disabled: false, required: false },
            { name: 'WasteTransferTypeDesc', readonly: false, disabled: false, required: false },
            { name: 'EWCCode', readonly: false, disabled: false, required: false },
            { name: 'EWCDescription', readonly: false, disabled: false, required: false }
        ];
        this.pageId = PageIdentifier.ICABSSEACTUALVSCONTRACTUALSERVICECOVER;
    }
    ActualVsContractualServiceCoverComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Actual vs Contractual - Service Cover';
        if (this.formData.BusinessDesc) {
            this.populateUIFromFormData();
            this.buildGrid();
        }
        else {
            this.window_onload();
        }
    };
    ActualVsContractualServiceCoverComponent.prototype.ngOnDestroy = function () {
        this.lookUpSubscription.unsubscribe();
        _super.prototype.ngOnDestroy.call(this);
    };
    ActualVsContractualServiceCoverComponent.prototype.window_onload = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PercTolerance', this.riExchange.getParentHTMLValue('PercTolerance'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'FromDate', this.riExchange.getParentHTMLValue('FromDate'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ToDate', this.riExchange.getParentHTMLValue('ToDate'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'WasteTransferTypeCode', this.riExchange.getParentHTMLValue('WasteTransferTypeCode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EWCCode', this.riExchange.getParentHTMLValue('EWCCode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceFilter', this.riExchange.getParentHTMLValue('ServiceFilter'));
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceFilter');
        this.doLookupformData();
        this.ServiceFilter_onChange({});
        this.buildGrid();
    };
    ActualVsContractualServiceCoverComponent.prototype.doLookupformData = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
                },
                'fields': ['PremiseName']
            },
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')
                },
                'fields': ['ContractName']
            },
            {
                'table': 'WasteTransferType',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'WasteTransferTypeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'WasteTransferTypeCode')
                },
                'fields': ['WasteTransferTypeDesc']
            },
            {
                'table': 'EWCCode',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'EWCCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'EWCCode')
                },
                'fields': ['EWCDescription']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var Premise = data[0][0];
            if (Premise) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', Premise.PremiseName);
            }
            var Contract = data[1][0];
            if (Contract) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', Contract.ContractName);
            }
            var WasteTransferType = data[2][0];
            if (WasteTransferType) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'WasteTransferTypeDesc', WasteTransferType.WasteTransferTypeDesc);
            }
            var EWCCode = data[3][0];
            if (EWCCode) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EWCDescription', EWCCode.EWCDescription);
            }
        });
    };
    ActualVsContractualServiceCoverComponent.prototype.ServiceFilter_onChange = function (event) {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceFilter') === 'over') {
            this.pageParams.vPercTolerance = false;
        }
        else {
            this.pageParams.vPercTolerance = true;
        }
    };
    ActualVsContractualServiceCoverComponent.prototype.buildGrid = function () {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set('Level', 'ServiceCover');
        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        this.search.set('ViewBy', 'ServiceCover');
        this.search.set('ServiceFilter', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceFilter'));
        this.search.set('PercTolerance', this.riExchange.riInputElement.GetValue(this.uiForm, 'PercTolerance'));
        this.search.set('FromDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'FromDate'));
        this.search.set('ToDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'ToDate'));
        this.search.set('EWCCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'EWCCode'));
        this.search.set('WasteTransCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'WasteTransCode'));
        this.search.set('riCacheRefresh', 'true');
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '656396');
        this.queryParams.search = this.search;
        this.actVsContServiceCoverGrid.loadGridData(this.queryParams);
    };
    ActualVsContractualServiceCoverComponent.prototype.onGridRowClick = function (event) {
        if (event.cellIndex === 0 && event.rowData['Product Code'] !== 'TOTAL') {
            this.attributes.ServiceCoverRowID = event.cellData['rowID'];
            this.pageParams.currentContractType = event.cellData['additionalData'];
            alert('Navigate to iCABSAServiceCoverMaintenance when available');
        }
    };
    ActualVsContractualServiceCoverComponent.prototype.getGridInfo = function (info) {
        this.actVsContServiceCoverPagination.totalItems = info.totalRows;
    };
    ActualVsContractualServiceCoverComponent.prototype.getCurrentPage = function (currentPage) {
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.buildGrid();
    };
    ActualVsContractualServiceCoverComponent.prototype.refresh = function () {
        this.currentPage = 1;
        this.buildGrid();
    };
    ActualVsContractualServiceCoverComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSeActualVsContractualServiceCover.html'
                },] },
    ];
    ActualVsContractualServiceCoverComponent.ctorParameters = [
        { type: Injector, },
    ];
    ActualVsContractualServiceCoverComponent.propDecorators = {
        'actVsContServiceCoverGrid': [{ type: ViewChild, args: ['actVsContServiceCoverGrid',] },],
        'actVsContServiceCoverPagination': [{ type: ViewChild, args: ['actVsContServiceCoverPagination',] },],
    };
    return ActualVsContractualServiceCoverComponent;
}(BaseComponent));
