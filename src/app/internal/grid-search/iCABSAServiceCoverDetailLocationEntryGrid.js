var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { ServiceCoverDetailsComponent } from '../search/iCABSAServiceCoverDetailSearch.component';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
export var ServiceCoverDetailLocationEntryGridComponent = (function (_super) {
    __extends(ServiceCoverDetailLocationEntryGridComponent, _super);
    function ServiceCoverDetailLocationEntryGridComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [
            { name: 'ContractNumber', readonly: true, disabled: true, required: false },
            { name: 'ContractName', readonly: true, disabled: true, required: false },
            { name: 'PremiseNumber', readonly: true, disabled: true, required: false },
            { name: 'PremiseName', readonly: true, disabled: true, required: false },
            { name: 'ProductCode', readonly: true, disabled: true, required: false },
            { name: 'ProductDesc', readonly: true, disabled: true, required: false },
            { name: 'ProductDetailCode', readonly: true, disabled: false, required: false },
            { name: 'ServiceCoverRowID', readonly: true, disabled: true, required: false },
            { name: 'ServiceCoverNumber', readonly: true, disabled: true, required: false },
            { name: 'CurrentServiceCoverRowID', readonly: true, disabled: true, required: false },
            { name: 'PremiseLocationNumber', readonly: true, disabled: true, required: false },
            { name: 'PremiseLocationDesc', readonly: true, disabled: true, required: false },
            { name: 'ProductDetailDesc', readonly: true, disabled: true, required: false }
        ];
        this.queryParams = {
            operation: 'Application/iCABSAServiceCoverDetailLocationEntryGrid',
            module: 'locations',
            method: 'service-delivery/grid'
        };
        this.vSCEnableDetailLocations = false;
        this.legend = [
            { label: 'Empty Locations', color: '#CCFFCE' },
            { label: 'UNALLOCATED', color: '#FFCFCE' },
            { label: 'In Hold', color: '#FFFFCE' },
            { label: 'Located', color: '#DDDDDD' }
        ];
        this.gridOperation = {
            vbUpdateRecord: '',
            vbPremiseLocationNumber: '',
            vbPremiseLocationSequence: '',
            vbPremiseLocationDesc: '',
            vbQuantityAtLocation: '',
            vbGridMode: '',
            vbUnallocQty: '',
            vbPremiseLocationSequenceRowID: '',
            vbPremiseLocationRowID: '',
            ServiceCoverDetailLocationRowID: '',
            vbComments: '',
            Update: false
        };
        this.inputParamsSearchExt = { 'parentMode': 'SearchExt', ServiceCoverRowID: '' };
        this.dynamicComponent1 = ServiceCoverDetailsComponent;
        this.showHeader = true;
        this.search = new URLSearchParams();
        this.pageSize = 11;
        this.itemsPerPage = 10;
        this.inputParams = {};
        this.pageCurrent = 1;
        this.totalRecords = 1;
        this.pageId = PageIdentifier.ICABSASERVICECOVERDETAILLOCATIONENTRYGRID;
        this.pageTitle = '';
    }
    ServiceCoverDetailLocationEntryGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.getSysCharDtetails();
    };
    ServiceCoverDetailLocationEntryGridComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    ServiceCoverDetailLocationEntryGridComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show(data, true);
    };
    ServiceCoverDetailLocationEntryGridComponent.prototype.window_onload = function () {
        this.riGrid.FunctionUpdateSupport = true;
        this.pageParams.parentMode = this.riExchange.getParentMode();
        switch (this.pageParams.parentMode) {
            case 'ProductDetail':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCoverRowID'));
                this.inputParamsSearchExt.ServiceCoverRowID = this.riExchange.getParentHTMLValue('ServiceCoverRowID');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDetailCode', this.riExchange.getParentHTMLValue('ProductDetailCode1'));
                break;
            case 'ProductDetailSC':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'CurrentServiceCoverRowID', this.riExchange.getParentHTMLValue('CurrentServiceCoverRowID'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', this.riExchange.getParentHTMLValue('CurrentServiceCoverRowID'));
                break;
        }
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.DefaultTextColor = '0000FF';
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.fetchAllDetails();
    };
    ServiceCoverDetailLocationEntryGridComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableLocations];
        var sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records;
            _this.pageParams.vSCEnableDetailLocations = record[0]['Logical'];
            _this.vSCEnableDetailLocations = _this.pageParams.vSCEnableDetailLocations;
            _this.window_onload();
        });
    };
    ServiceCoverDetailLocationEntryGridComponent.prototype.fetchAllDetails = function () {
        var _this = this;
        var searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        searchParams.set('ServiceCoverRowID', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverRowID'));
        searchParams.set('Function', 'GetScDetails');
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams)
            .subscribe(function (data) {
            _this.parentServiceCoverNumber = data.ServiceCoverNumber;
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceCoverNumber', _this.parentServiceCoverNumber);
            _this.fetchDetails();
        });
    };
    ServiceCoverDetailLocationEntryGridComponent.prototype.fetchDetails = function () {
        var _this = this;
        var searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        searchParams.set('ProductDetailCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductDetailCode'));
        searchParams.set('Function', 'GetProductDetailDesc');
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams)
            .subscribe(function (data) {
            _this.parentProductDetailDesc = data.ProductDetailDesc;
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDetailDesc', _this.parentProductDetailDesc);
        });
        this.buildGrid();
    };
    ServiceCoverDetailLocationEntryGridComponent.prototype.buildGrid = function () {
        this.riGrid.PageSize = 10;
        this.riGrid.AddColumn('PremiseLocationNumber', 'ServiceCoverDetailLocEntry', 'PremiseLocationNumber', MntConst.eTypeInteger, 6);
        this.riGrid.AddColumnAlign('PremiseLocationNumber', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('PremiseLocationSequence', 'ServiceCoverDetailLocEntry', 'PremiseLocationSequence', MntConst.eTypeInteger, 6);
        this.riGrid.AddColumnAlign('PremiseLocationSequence', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('PremiseLocationDesc', 'ServiceCoverDetailLocEntry', 'PremiseLocationDesc', MntConst.eTypeText, 40);
        this.riGrid.AddColumnAlign('PremiseLocationDesc', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('QuantityAtLocation', 'ServiceCoverDetailLocEntry', 'QuantityAtLocation', MntConst.eTypeInteger, 6);
        this.riGrid.AddColumnAlign('QuantityAtLocation', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('UnallocQty', 'ServiceCoverDetailLocEntry', 'UnallocQty', MntConst.eTypeInteger, 6);
        this.riGrid.AddColumnAlign('UnallocQty', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('Comments', 'ServiceCoverDetailLocEntry', 'Comments', MntConst.eTypeText, 50);
        this.riGrid.AddColumnAlign('Comments', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('Allocated', 'ServiceCoverDetailLocEntry', 'Allocated', MntConst.eTypeImage, 1, false);
        this.riGrid.AddColumnAlign('Allocated', MntConst.eAlignmentRight);
        this.riGrid.AddColumnUpdateSupport('PremiseLocationSequence', true);
        this.riGrid.AddColumnUpdateSupport('QuantityAtLocation', false);
        this.riGrid.AddColumnUpdateSupport('Comments', false);
        this.riGrid.Complete();
        this.loadData();
    };
    ServiceCoverDetailLocationEntryGridComponent.prototype.loadData = function () {
        var _this = this;
        this.riGrid.Update = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateHeader = true;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('ContractTypeCode', this.riExchange.getCurrentContractType());
        this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        this.search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        this.search.set('ServiceCoverNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber'));
        this.search.set('ServiceCoverRowID', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverRowID'));
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
        this.search.set('riCacheRefresh', 'True');
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set(this.serviceConstants.GridSortOrder, 'Descending');
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, '');
        this.inputParams.search = this.search;
        this.isRequesting = true;
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.search)
            .subscribe(function (data) {
            if (data.hasError) {
                _this.showErrorModal(data);
            }
            else {
                try {
                    _this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                    _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    _this.riGrid.Update = true;
                    _this.riGrid.Execute(data);
                }
                catch (e) {
                    _this.logger.log(' Problem in grid load', e);
                }
                _this.setFormMode(_this.c_s_MODE_UPDATE);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.isRequesting = false;
        }, function (error) {
            _this.showErrorModal(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverDetailLocationEntryGridComponent.prototype.riGrid_BodyColumnFocus = function (event) {
    };
    ServiceCoverDetailLocationEntryGridComponent.prototype.riGrid_onGridRowClick = function (data) {
        this.riExchange.setParentAttributeValue('PremiseLocationNumber', this.riGrid.Details.GetAttribute('QuantityAtLocation', 'AdditionalProperty'));
        this.riExchange.setParentAttributeValue('PremiseLocationDesc', this.riGrid.Details.GetAttribute('PremiseLocationDesc', 'InnerText'));
    };
    ServiceCoverDetailLocationEntryGridComponent.prototype.onCellClickBlur = function (event) {
        var oTR = this.riGrid.CurrentHTMLRow;
        this.gridOperation.vbPremiseLocationNumber = this.riGrid.Details.GetValue('PremiseLocationNumber');
        this.gridOperation.vbPremiseLocationSequenceRowID = this.riGrid.Details.GetAttribute('PremiseLocationSequence', 'Rowid');
        this.gridOperation.vbPremiseLocationSequence = this.riGrid.Details.GetValue('PremiseLocationSequence');
        this.gridOperation.vbPremiseLocationDesc = this.riGrid.Details.GetValue('PremiseLocationDesc');
        this.gridOperation.vbQuantityAtLocation = this.riGrid.Details.GetValue('QuantityAtLocation');
        this.gridOperation.vbUnallocQty = this.riGrid.Details.GetValue('UnallocQty');
        this.gridOperation.vbComments = this.riGrid.Details.GetValue('Comments');
        this.gridOperation.vbPremiseLocationRowID = this.riGrid.Details.GetAttribute('UnallocQty', 'AdditionalProperty');
        this.gridOperation.ServiceCoverDetailLocationRowID = this.riGrid.Details.GetAttribute('PremiseLocationSequence', 'AdditionalProperty');
        this.postRequest();
    };
    ServiceCoverDetailLocationEntryGridComponent.prototype.postRequest = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var searchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.Action, '2');
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        var postData = {};
        postData['PremiseLocationNumber'] = this.gridOperation.vbPremiseLocationNumber;
        postData['PremiseLocationSequenceRowID'] = this.gridOperation.vbPremiseLocationSequenceRowID;
        postData['PremiseLocationSequence'] = this.gridOperation.vbPremiseLocationSequence;
        postData['PremiseLocationDesc'] = this.gridOperation.vbPremiseLocationDesc;
        postData['QuantityAtLocation'] = this.gridOperation.vbQuantityAtLocation;
        postData['UnallocQty'] = this.gridOperation.vbUnallocQty;
        postData['Comments'] = this.gridOperation.vbComments;
        postData['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') ? this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') : '';
        postData['ContractTypeCode'] = this.riExchange.getCurrentContractType() ? this.riExchange.getCurrentContractType() : '';
        postData['PremiseNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') ? this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') : '';
        postData['ProductCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode') ? this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode') : '';
        postData['ProductDetailCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductDetailCode') ? this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductDetailCode') : '';
        postData['ServiceCoverNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber') ? this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber') : '';
        postData['ServiceCoverRowID'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverRowID') ? this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverRowID') : '';
        postData['ServiceCoverDetailLocationRowID'] = this.gridOperation.ServiceCoverDetailLocationRowID;
        postData['PremiseLocationRowID'] = this.gridOperation.vbPremiseLocationRowID;
        postData['riGridMode'] = '3';
        postData['riGridHandle'] = this.utils.randomSixDigitString();
        postData['HeaderClickedColumn'] = this.riGrid.HeaderClickedColumn;
        postData['riSortOrder'] = this.riGrid.SortOrder;
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, postData).subscribe(function (e) {
            _this.riGrid.Mode = MntConst.eModeNormal;
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverDetailLocationEntryGridComponent.prototype.ellipsisData = function (data) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDetailCode', data.ProductDetailCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDetailDesc', data.ProductDetailDesc);
    };
    ServiceCoverDetailLocationEntryGridComponent.prototype.cmdAddLocation_onclick = function () {
        this.navigate(this.pageParams.parentMode, 'maintenance/premiseLocationMaintenance');
    };
    ServiceCoverDetailLocationEntryGridComponent.prototype.cmdMoveLocation_onclick = function () {
    };
    ServiceCoverDetailLocationEntryGridComponent.prototype.cmdEmptyLocation_onclick = function () {
        this.navigate(this.pageParams.parentMode, 'grid/application/EmptyPremiseLocationSearchGrid');
    };
    ServiceCoverDetailLocationEntryGridComponent.prototype.optionsChange = function (event) {
        switch (event) {
            case 'AddLocation':
                this.cmdAddLocation_onclick();
                break;
            case 'Empty':
                this.cmdEmptyLocation_onclick();
                break;
            default:
                break;
        }
    };
    ServiceCoverDetailLocationEntryGridComponent.prototype.getCurrentPage = function (currentPage) {
        this.pageCurrent = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.pageCurrent));
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.loadData();
    };
    ServiceCoverDetailLocationEntryGridComponent.prototype.refresh = function () {
        this.loadData();
    };
    ServiceCoverDetailLocationEntryGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverDetailLocationEntryGrid.html'
                },] },
    ];
    ServiceCoverDetailLocationEntryGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    ServiceCoverDetailLocationEntryGridComponent.propDecorators = {
        'ServiceCoverDetailLocationEntryGrid': [{ type: ViewChild, args: ['ServiceCoverDetailLocationEntryGrid',] },],
        'ServiceCoverDetailLocationEntryGridPagination': [{ type: ViewChild, args: ['ServiceCoverDetailLocationEntryGridPagination',] },],
        'ServiceCoverDetailEllipsis': [{ type: ViewChild, args: ['ServiceCoverDetailEllipsis',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return ServiceCoverDetailLocationEntryGridComponent;
}(BaseComponent));
