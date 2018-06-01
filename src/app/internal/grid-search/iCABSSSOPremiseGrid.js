var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { Router } from '@angular/router';
export var SOPremiseGridComponent = (function (_super) {
    __extends(SOPremiseGridComponent, _super);
    function SOPremiseGridComponent(injector, _router) {
        _super.call(this, injector);
        this._router = _router;
        this.queryParams = {
            operation: 'Sales/iCABSSSOPremiseGrid',
            module: 'advantage',
            method: 'prospect-to-contract/maintenance',
            search: ''
        };
        this.pageId = '';
        this.gridSortHeaders = [];
        this.maxColumn = 5;
        this.itemsPerPage = 15;
        this.currentPage = 1;
        this.totalItems = 10;
        this.headerClickedColumn = '';
        this.riSortOrder = '';
        this.headerProperties = [];
        this.controls = [
            { name: 'dlContractRef', readonly: true, disabled: false, required: false },
            { name: 'ContractTypeCode', readonly: true, disabled: false, required: false },
            { name: 'dlBatchRef', readonly: true, disabled: false, required: false },
            { name: 'dlPremiseROWID', readonly: true, disabled: false, required: false }
        ];
        this.pageId = PageIdentifier.ICABSSSOPREMISEGRID;
    }
    SOPremiseGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Advantage Premises';
        this.window_onload();
    };
    SOPremiseGridComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    SOPremiseGridComponent.prototype.getRequest = function () {
        var _this = this;
        var searchPost;
        searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, '6');
        var postParams = {};
        postParams.Function = 'Updateable';
        postParams.dlBatchRef = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlBatchRef');
        postParams.dlContractRef = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlContractRef');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchPost, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                    _this.errorService.emitError(e['oResponse']);
                }
                else if (e['errorMessage']) {
                    _this.errorService.emitError(e);
                }
                else {
                    _this.UpdateableInd = e.UpdateableInd;
                    console.log(_this.UpdateableInd);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    SOPremiseGridComponent.prototype.buildGrid = function () {
        this.SOPremiseGrid.clearGridData();
        var search;
        search = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '2');
        search.set('LanguageCode', this.riExchange.LanguageCode());
        search.set('dlBatchRef', this.riExchange.riInputElement.GetValue(this.uiForm, 'dlBatchRef'));
        search.set('dlContractRef', this.riExchange.riInputElement.GetValue(this.uiForm, 'dlContractRef'));
        search.set(this.serviceConstants.PageSize, (this.itemsPerPage).toString());
        search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        search.set(this.serviceConstants.GridMode, '0');
        search.set(this.serviceConstants.GridHandle, '11798034');
        search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClickedColumn);
        search.set(this.serviceConstants.GridSortOrder, this.riSortOrder);
        this.queryParams.search = search;
        this.SOPremiseGrid.loadGridData(this.queryParams);
    };
    SOPremiseGridComponent.prototype.ngAfterViewInit = function () {
        var PremiseNumber = {
            'fieldName': 'PremiseNumber',
            'index': 0,
            'sortType': 'ASC'
        };
        var PremisePostCode = {
            'fieldName': 'PremisePostCode',
            'index': 3,
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(PremiseNumber);
        this.gridSortHeaders.push(PremisePostCode);
        var premiseAdjustObj = {
            'align': 'center',
            'width': '150px',
            'index': 0
        };
        var nameObj = {
            'align': 'center',
            'width': '400px',
            'index': 1
        };
        var serviceCovertObj = {
            'align': 'center',
            'width': '140px',
            'index': 4
        };
        var postCodetObj = {
            'align': 'center',
            'width': '100px',
            'index': 3
        };
        this.headerProperties.push(premiseAdjustObj);
        this.headerProperties.push(nameObj);
        this.headerProperties.push(serviceCovertObj);
        this.headerProperties.push(postCodetObj);
    };
    SOPremiseGridComponent.prototype.getCurrentPage = function (currentPage) {
        var search;
        this.currentPage = currentPage.value;
        search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.buildGrid();
    };
    SOPremiseGridComponent.prototype.getGridInfo = function (info) {
        this.SOPremisePagination.totalItems = info.totalRows;
    };
    SOPremiseGridComponent.prototype.window_onload = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'dlBatchRef', this.riExchange.getParentHTMLValue('dlBatchRef'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'dlContractRef', this.riExchange.getParentHTMLValue('dlContractRef'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SubSystem', this.riExchange.getParentHTMLValue('SubSystem'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.riExchange.getParentHTMLValue('ContractTypeCode'));
        this.pageParams.currentContractType = this.riExchange.getParentHTMLValue('ContractTypeCode');
        this.buildGrid();
        this.getRequest();
    };
    SOPremiseGridComponent.prototype.refresh = function () {
        this.currentPage = 1;
        this.buildGrid();
    };
    SOPremiseGridComponent.prototype.gridBodyOnSingleClick = function (event) {
        if (event.cellData !== null) {
            this.SOPremiseGridSingleClick(event);
        }
    };
    SOPremiseGridComponent.prototype.SOPremiseGridSingleClick = function (event) {
        if (event && event.cellData && event.cellData.additionalData !== null) {
            this.premiseGridCellData = this.SOPremiseGrid.getCellInfoForSelectedRow(event.rowIndex, '0');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'dlPremiseROWID', this.premiseGridCellData.rowID);
            this.attributes.dlPremiseRowID = this.premiseGridCellData.rowID;
            this.attributes.dlPremiseRef = this.premiseGridCellData.additionalData;
        }
    };
    SOPremiseGridComponent.prototype.sortGrid = function (data) {
        this.headerClickedColumn = data.fieldname;
        this.riSortOrder = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGrid();
    };
    SOPremiseGridComponent.prototype.gridBodyOnDoubleClick = function (data) {
        this.griddata = data;
        this.SOPremiseGridSingleClick(data);
        if (data.cellIndex === 0) {
            this.navigate('SOPremise', 'maintenance/sdlpremisemaintenance', {
                parentMode: 'SOPremise',
                dlExtRef: this.getControlValue('dlContractRef')
            });
        }
        if (data.cellIndex === 4) {
            this.navigate('SOPremise', 'grid/Sales/SOServiceCoverGrid');
        }
    };
    SOPremiseGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSSOPremiseGrid.html'
                },] },
    ];
    SOPremiseGridComponent.ctorParameters = [
        { type: Injector, },
        { type: Router, },
    ];
    SOPremiseGridComponent.propDecorators = {
        'SOPremiseGrid': [{ type: ViewChild, args: ['SOPremiseGrid',] },],
        'SOPremisePagination': [{ type: ViewChild, args: ['SOPremisePagination',] },],
    };
    return SOPremiseGridComponent;
}(BaseComponent));
