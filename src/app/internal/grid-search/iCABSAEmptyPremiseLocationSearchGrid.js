var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from '../../../app/base/PageIdentifier';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { Location } from '@angular/common';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
export var EmptyPremiseLocationSearchGridComponent = (function (_super) {
    __extends(EmptyPremiseLocationSearchGridComponent, _super);
    function EmptyPremiseLocationSearchGridComponent(injector, location) {
        _super.call(this, injector);
        this.showHeader = true;
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.totalItems = 10;
        this.maxColumn = 3;
        this.pageId = '';
        this.search = new URLSearchParams();
        this.inputParams = {};
        this.contractnumberDetails = {};
        this.UpdateParent = false;
        this.backLinkText = '';
        this.totalRecords = 1;
        this.vEnableServiceCoverDispLev = false;
        this.tdMenuDisplay = true;
        this.queryParams = {
            action: '2',
            operation: 'Application/iCABSAEmptyPremiseLocationSearchGrid',
            module: 'locations',
            method: 'service-delivery/search'
        };
        this.controls = [
            { name: 'ContractNumber', disabled: true },
            { name: 'ContractName', disabled: true },
            { name: 'PremiseNumber', disabled: true },
            { name: 'PremiseName', disabled: true }
        ];
        this.pageId = PageIdentifier.ICABSAEMPTYPREMISELOCATIONSEARCHGRID;
        this.search = this.getURLSearchParamObject();
    }
    EmptyPremiseLocationSearchGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Premises Details';
        this.getSysCharDtetails();
        this.window_onload();
        this.buildGrid();
    };
    EmptyPremiseLocationSearchGridComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    EmptyPremiseLocationSearchGridComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharNumbers = [this.sysCharConstants.SystemCharEnableServiceCoverDisplayLevel];
        var sysCharIp = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharNumbers.toString()
        };
        this.speedScript.sysChar(sysCharIp).subscribe(function (data) {
            _this.pageParams.vEnableServiceCoverDispLev = data.records[0].Required;
            if (!(_this.pageParams.vEnableServiceCoverDispLev)) {
                _this.tdMenuDisplay = false;
            }
        });
    };
    EmptyPremiseLocationSearchGridComponent.prototype.window_onload = function () {
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        this.disableControl('ContractNumber', true);
        this.disableControl('ContractName', true);
        this.disableControl('PremiseNumber', true);
        this.disableControl('PremiseName', true);
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.DefaultTextColor = '0000FF';
        this.riGrid.PageSize = 10;
        this.riGrid.FunctionPaging = true;
    };
    EmptyPremiseLocationSearchGridComponent.prototype.buildGrid = function () {
        if (this.riExchange.riInputElement.isError(this.uiForm, 'PremiseNumber') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'ContractNumber')) {
            return;
        }
        else {
            this.riGrid.Clear();
            this.riGrid.AddColumn('PremiseLocationNumber', 'PremiseLocationSummary', 'PremiseLocationNumber', MntConst.eTypeInteger, 10);
            this.riGrid.AddColumnAlign('PremiseLocationNumber', MntConst.eAlignmentCenter);
            this.riGrid.AddColumn('PremiseLocationDesc', 'PremiseLocationSummary', 'PremiseLocationDesc', MntConst.eTypeText, 40);
            this.riGrid.AddColumnAlign('PremiseLocationDesc', MntConst.eAlignmentLeft);
            this.riGrid.AddColumn('QuantityAtLocation', 'PremiseLocationSummary', 'QuantityAtLocation', MntConst.eTypeInteger, 6);
            this.riGrid.Complete();
            this.loadData();
        }
    };
    EmptyPremiseLocationSearchGridComponent.prototype.loadData = function () {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        var formdata = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.Action, this.queryParams.action);
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', '13305230');
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set('GridSortOrder', 'Descending');
        this.search.set('HeaderClickedColumn', '');
        this.search.set('ContractNumber', this.getControlValue('ContractNumber'));
        this.search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        this.inputParams.search = this.search;
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.inputParams.search)
            .subscribe(function (data) {
            if (data.hasError) {
                _this.messageModal.show(data, true);
            }
            else {
                _this.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                _this.riGrid.Execute(data);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.totalRecords = 1;
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    EmptyPremiseLocationSearchGridComponent.prototype.getGridInfo = function (value) {
        this.emptyPremiseLocationSearchPagination.totalItems = value.totalRows;
    };
    EmptyPremiseLocationSearchGridComponent.prototype.getCurrentPage = function (data) {
        this.currentPage = data.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.loadData();
    };
    EmptyPremiseLocationSearchGridComponent.prototype.optionsChange = function (event) {
        switch (event) {
            case 'AddLocation':
                this.navigate('PremiseAllocateAdd', '/maintenance/premiseLocationMaintenance');
                break;
            default:
                break;
        }
    };
    EmptyPremiseLocationSearchGridComponent.prototype.onGridRowClick = function (data) {
        this.emptyLocationFocus(data);
    };
    EmptyPremiseLocationSearchGridComponent.prototype.emptyLocationFocus = function (data) {
        this.contractnumberDetails = {
            'row': data.rowIndex,
            'rowID': data.target.attributes['rowid'].value,
            'premiseLocationRowID': this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'rowid'),
            'quantityAtLocation': this.riGrid.Details.GetValue('QuantityAtLocation')
        };
    };
    EmptyPremiseLocationSearchGridComponent.prototype.getGridOnDblClick = function (data) {
        this.navigate('EmptySearch', '/maintenance/premiseLocationMaintenance', {
            'premiseLocationRowID': this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'rowid'),
            'PremiseLocationNumber': this.riGrid.Details.GetValue(this.riGrid.CurrentColumnName),
            'PremiseLocationDesc': this.riGrid.Details.GetValue('PremiseLocationDesc'),
            'QuantityAtLocation': this.riGrid.Details.GetValue('QuantityAtLocation')
        });
    };
    EmptyPremiseLocationSearchGridComponent.prototype.refresh = function () {
        this.riGrid.RefreshRequired();
        this.loadData();
    };
    EmptyPremiseLocationSearchGridComponent.prototype.riExchange_UpdateHTMLDocument = function () {
        this.UpdateParent = true;
        this.buildGrid();
    };
    EmptyPremiseLocationSearchGridComponent.prototype.riExchange_UnLoadHTMLDocument = function () {
        this.riExchange_UpdateHTMLDocument();
    };
    EmptyPremiseLocationSearchGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAEmptyPremiseLocationSearchGrid.html'
                },] },
    ];
    EmptyPremiseLocationSearchGridComponent.ctorParameters = [
        { type: Injector, },
        { type: Location, },
    ];
    EmptyPremiseLocationSearchGridComponent.propDecorators = {
        'emptyPremiseLocationSearchGrid': [{ type: ViewChild, args: ['emptyPremiseLocationSearchGrid',] },],
        'emptyPremiseLocationSearchPagination': [{ type: ViewChild, args: ['emptyPremiseLocationSearchPagination',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
    };
    return EmptyPremiseLocationSearchGridComponent;
}(BaseComponent));
