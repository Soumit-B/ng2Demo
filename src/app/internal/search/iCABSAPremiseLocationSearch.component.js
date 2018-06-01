var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { BaseComponent } from '../../../app/base/BaseComponent';
export var PremiseLocationSearchComponent = (function (_super) {
    __extends(PremiseLocationSearchComponent, _super);
    function PremiseLocationSearchComponent(injector, ellipsis) {
        _super.call(this, injector);
        this.ellipsis = ellipsis;
        this.openAddMode = new EventEmitter();
        this.queryParams = {
            operation: 'Application/iCABSAPremiseLocationSearch',
            module: 'locations',
            method: 'service-delivery/search'
        };
        this.controls = [
            { name: 'ContractNumber', readonly: true, disabled: false, required: false },
            { name: 'ContractName', readonly: true, disabled: true, required: false },
            { name: 'PremiseNumber', readonly: false, disabled: false, required: false },
            { name: 'PremiseName', readonly: true, disabled: true, required: false },
            { name: 'menu' },
            { name: 'PassUpPremiseLocation' },
            { name: 'PremiseLocationFilterValue' },
            { name: 'PremiseLocationFilterDesc' },
            { name: 'PremiseLocationNumber' },
            { name: 'PremiseLocationDesc' },
            { name: 'PremiseLocationNumberTo' },
            { name: 'PremiseLocationDescTo' },
            { name: 'LocationDesc' },
            { name: 'SelPremiseLocationNumber' },
            { name: 'SelPremiseLocationDesc' }
        ];
        this.pageId = '';
        this.tdMenuDisplay = true;
        this.routeParams = {};
        this.inputParams = {};
        this.search = new URLSearchParams();
        this.pageSize = 10;
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.totalItems = 10;
        this.maxColumn = 2;
        this.selectedRow = -1;
        this.showMessageHeader = true;
        this.pageId = PageIdentifier.ICABSAPREMISELOCATIONSEARCH;
    }
    PremiseLocationSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Premises Location Details';
        this.window_onload();
        this.setCurrentContractType();
        this.setURLQueryParameters(this);
        if (this.riExchange.getParentMode() === 'LookUp-Allocate') {
            this.tdMenuDisplay = true;
        }
        else {
            this.tdMenuDisplay = false;
        }
    };
    PremiseLocationSearchComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    PremiseLocationSearchComponent.prototype.setCurrentContractType = function () {
        this.currentContractType =
            this.utils.getCurrentContractType(this.pageParams.CurrentContractTypeURLParameter);
        this.currentContractTypeLabel =
            this.utils.getCurrentContractLabel(this.currentContractType);
    };
    PremiseLocationSearchComponent.prototype.getURLQueryParameters = function (param) {
        this.routeParams.ParentMode = param['parentMode'];
        this.routeParams.CurrentContractTypeURLParameter = param['CurrentContractTypeURLParameter'];
    };
    PremiseLocationSearchComponent.prototype.updateView = function (params) {
        this.inputParams = params;
        this.parentMode = params['parentMode'];
        this.showAddNew = this.inputParams.showAddNew;
        this.pageParams.CurrentContractTypeURLParameter = params['currentContractTypeURLParameter'];
        this.window_onload();
        this.refresh();
    };
    PremiseLocationSearchComponent.prototype.onAddNew = function () {
        this.ellipsis.onAddNew(true);
        this.ellipsis.closeModal();
    };
    PremiseLocationSearchComponent.prototype.window_onload = function () {
        this.currentContractType = this.utils.getCurrentContractType(this.pageParams.CurrentContractTypeURLParameter);
        this.currentContractTypeLabel = this.utils.getCurrentContractLabel(this.currentContractType);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber') ? this.riExchange.getParentHTMLValue('ContractNumber') : this.inputParams.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName') ? this.riExchange.getParentHTMLValue('ContractName') : this.inputParams.ContractName);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber') ? this.riExchange.getParentHTMLValue('PremiseNumber') : this.inputParams.PremiseNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName') ? this.riExchange.getParentHTMLValue('PremiseName') : this.inputParams.PremiseName);
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.buildGrid();
    };
    PremiseLocationSearchComponent.prototype.buildGrid = function () {
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        this.search.set(this.serviceConstants.PageSize, (this.itemsPerPage).toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '4785030');
        this.queryParams.search = this.search;
        this.PremiseLocationSearchGrid.loadGridData(this.queryParams);
    };
    PremiseLocationSearchComponent.prototype.gridOnDblClick = function (data) {
        var _PremiseLocationNumber = data.trRowData[0].text;
        var _PremiseLocationDesc = data.trRowData[1].text;
        var returnObj;
        returnObj = {
            'PremiseLocationNumber': _PremiseLocationNumber,
            'PremiseLocationDesc': _PremiseLocationDesc,
            'rowObj': data.rowData
        };
        this.pageParams.CurrentContractTypeURLParameter = this.routeParams.CurrentContractTypeURLParameter;
        if (this.parentMode === 'Premise') {
            this.navigate('Search', 'maintenance/premiseLocationMaintenance');
        }
        else {
            switch (this.parentMode) {
                case 'LookUp-PremiseLocationSummary':
                    this.riExchange.setParentHTMLValue('PremiseLocationFilterValue', _PremiseLocationNumber);
                    this.riExchange.setParentHTMLValue('PremiseLocationFilterDesc', _PremiseLocationDesc);
                    break;
                case 'LookUp' && 'LookUp-Allocate':
                    this.riExchange.setParentHTMLValue('PremiseLocationNumber', _PremiseLocationNumber);
                    this.riExchange.setParentHTMLValue('PremiseLocationDesc', _PremiseLocationDesc);
                    break;
                case 'LookUp-To':
                    this.riExchange.setParentHTMLValue('PremiseLocationNumberTo', _PremiseLocationNumber);
                    this.riExchange.setParentHTMLValue('PremiseLocationDescTo', _PremiseLocationDesc);
                    break;
                case 'BarcodeLocation':
                    this.riExchange.setParentHTMLValue('LocationDesc', _PremiseLocationNumber);
                    break;
                case 'DisplayGrid':
                    this.riExchange.setParentHTMLValue('SelPremiseLocationNumber', _PremiseLocationNumber);
                    this.riExchange.setParentHTMLValue('SelPremiseLocationDesc', _PremiseLocationDesc);
                    break;
                default:
                    this.riExchange.setParentHTMLValue('PremiseLocationNumber', _PremiseLocationNumber);
                    this.riExchange.setParentHTMLValue('PremiseLocationDesc', _PremiseLocationDesc);
                    break;
            }
            var msgContent = { title: '', msg: 'This page iCABSBBarcodeMaintenance.htm is under construction' };
        }
        this.ellipsis.sendDataToParent(returnObj);
    };
    PremiseLocationSearchComponent.prototype.menuOnchange = function () {
        var selectedValue = this.uiForm.controls['menu'].value;
        this.pageParams.CurrentContractTypeURLParameter = this.routeParams.CurrentContractTypeURLParameter;
        var _PassUpPremiseLocationNumber = this.riExchange.riInputElement.SetValue(this.uiForm, 'PassUpPremiseLocation', this.riExchange.getParentAttributeValue('PassUpPremiseLocationNumber'));
        var _PassUpPremiseLocationDesc = this.riExchange.riInputElement.SetValue(this.uiForm, 'PassUpPremiseLocation', this.riExchange.getParentAttributeValue('PassUpPremiseLocationDesc'));
        if (selectedValue === 'Add') {
            var msgContent = { title: '', msg: 'This page iCABSAPremiseLocationMaintenance.htm is under construction' };
            this.messageModal.show(msgContent, false);
            this.riExchange.setParentHTMLValue('PremiseLocationNumber', _PassUpPremiseLocationNumber);
            this.riExchange.setParentHTMLValue('PremiseLocationDesc', _PassUpPremiseLocationDesc);
        }
        else if (selectedValue === 'Maintain') {
            var msgContent = { title: '', msg: 'This page iCABSAPremiseLocationSearchGrid.htm is under construction' };
            this.messageModal.show(msgContent, false);
        }
    };
    PremiseLocationSearchComponent.prototype.getGridInfo = function (info) {
        this.PremiseLocationSearchPagination.totalItems = info.totalRows;
    };
    PremiseLocationSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.selectedRow = -1;
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.buildGrid();
    };
    PremiseLocationSearchComponent.prototype.refresh = function () {
        this.currentPage = 1;
        this.buildGrid();
    };
    PremiseLocationSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAPremiseLocationSearch.html'
                },] },
    ];
    PremiseLocationSearchComponent.ctorParameters = [
        { type: Injector, },
        { type: EllipsisComponent, },
    ];
    PremiseLocationSearchComponent.propDecorators = {
        'PremiseLocationSearchGrid': [{ type: ViewChild, args: ['PremiseLocationSearchGrid',] },],
        'PremiseLocationSearchPagination': [{ type: ViewChild, args: ['PremiseLocationSearchPagination',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'showAddNew': [{ type: Input },],
        'openAddMode': [{ type: Output },],
    };
    return PremiseLocationSearchComponent;
}(BaseComponent));
