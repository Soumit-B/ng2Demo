var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { ContractSearchComponent } from './../../search/iCABSAContractSearch';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { BaseComponent } from '../../../base/BaseComponent';
import { Component, Injector, ViewChild } from '@angular/core';
export var GridTestComponent = (function (_super) {
    __extends(GridTestComponent, _super);
    function GridTestComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.pageSize = 10;
        this.curPage = 1;
        this.controls = [];
        this.contractEllipsis = {
            disabled: false,
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Search',
                'currentContractTypeURLParameter': 'C',
                'showAddNew': false
            },
            component: ContractSearchComponent
        };
        this.vbUpdateRecord = '';
        this.vbUpdateQty = '';
        this.vbUpdateVisitNarrative = '';
        this.pageId = PageIdentifier.GRIDTEST;
    }
    GridTestComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Grid Demo';
        this.buildGrid();
    };
    GridTestComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    GridTestComponent.prototype.buildGrid = function () {
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.DefaultTextColor = '0000FF';
        this.riGrid.PageSize = 4;
        this.riGrid.FunctionPaging = true;
        this.riGrid.HighlightBar = true;
        var DisplayLabelsIcons = 'No';
        var vbEnableWED = false;
        this.riGrid.Clear();
        this.riGrid.AddColumn('PlanDate', 'PlanVisit', 'PlanDate', MntConst.eTypeInteger, 10);
        this.riGrid.AddColumn('PlanVisitType', 'PlanVisit', 'PlanVisitType', MntConst.eTypeText, 10);
        this.riGrid.AddColumn('PlanStatus', 'PlanVisit', 'PlanStatus', MntConst.eTypeText, 10);
        this.riGrid.AddColumn('PlanQuantity', 'PlanVisit', 'PlanQuantity', MntConst.eTypeInteger, 4);
        if (vbEnableWED) {
            this.riGrid.AddColumn('WED', 'PlanVisit', 'WED', MntConst.eTypeDecimal1, 4);
        }
        this.riGrid.AddColumn('PlanEmployee', 'PlanVisit', 'PlanEmployee', MntConst.eTypeText, 15);
        this.riGrid.AddColumn('ActualVisitDate', 'PlanVisit', 'ActualVisitDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('ActualQty', 'PlanVisit', 'ActualQty', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('ActualEmployee', 'PlanVisit', 'ActualEmployee', MntConst.eTypeText, 15);
        this.riGrid.AddColumn('ServiceCoverItemNumberDesc', 'PlanVisit', 'ServiceCoverItemNumberDesc', MntConst.eTypeText, 15);
        this.riGrid.AddColumn('PremiseLocNo', 'PlanVisit', 'PremiseLocNo', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('ProductComponent', 'PlanVisit', 'ProductComponent', MntConst.eTypeText, 6);
        this.riGrid.AddColumn('ProductComponentRem', 'PlanVisit', 'ProductComponentRem', MntConst.eTypeText, 6);
        this.riGrid.AddColumn('VisitNarrativeCd', 'PlanVisit', 'VisitNarrativeCd', MntConst.eTypeEllipsis, 10);
        this.riGrid.AddColumn('ServiceVisitText', 'PlanVisit', 'ServiceVisitText', MntConst.eTypeText, 100);
        this.riGrid.AddColumn('PlanVisitCancel', 'PlanVisit', 'PlanVisitCancel', MntConst.eTypeCheckBox, 1, false, '');
        if (DisplayLabelsIcons === 'Yes') {
            this.riGrid.AddColumn('NoOfLabels', 'PlanVisit', 'NoOfLabels', MntConst.eTypeInteger, 4, true);
            this.riGrid.AddColumn('PlanVisitGenLabels', 'PlanVisit', 'PlanVisitGenLabels', MntConst.eTypeCheckBox, 1, false, '');
        }
        this.riGrid.AddColumnAlign('PlanQuantity', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ActualQty', MntConst.eAlignmentRight);
        this.riGrid.AddColumnAlign('PremiseLocNo', MntConst.eAlignmentRight);
        this.riGrid.AddColumnAlign('PlanVisitCancel', MntConst.eAlignmentCenter);
        if (DisplayLabelsIcons === 'Yes') {
            this.riGrid.AddColumnAlign('NoOfLabels', MntConst.eAlignmentCenter);
            this.riGrid.AddColumnAlign('PlanVisitGenLabels', MntConst.eAlignmentCenter);
        }
        this.riGrid.AddEllipsisControl('VisitNarrativeCd', this.contractEllipsis, 'ContractTypePrefix');
        this.riGrid.AddColumnUpdateSupport('PlanQuantity', true);
        this.riGrid.AddColumnUpdateSupport('VisitNarrativeCd', true);
        this.riGrid.AddColumnOrderable('PlanDate', true);
        this.riGrid.Complete();
        this.riGrid_beforeExecute();
    };
    GridTestComponent.prototype.fetchLogoTypeData = function () {
        var _this = this;
        var Method = 'bill-to-cash/search';
        var Module = 'invoicing';
        var Operation = 'Business/iCABSBLogoTypeSearch';
        var logoSearchQueryParams = new URLSearchParams();
        logoSearchQueryParams.set(this.serviceConstants.Action, '0');
        logoSearchQueryParams.set(this.serviceConstants.BusinessCode, 'D');
        logoSearchQueryParams.set(this.serviceConstants.CountryCode, 'ZA');
        this.httpService.makeGetRequest(Method, Module, Operation, logoSearchQueryParams)
            .subscribe(function (data) {
            _this.riGrid.AddDropDownData('VisitNarrativeCd', data, 'LogoTypeCode', 'LogoTypeDesc');
            _this.riGrid.Complete();
        }, function (error) {
            console.log('Error');
        });
    };
    GridTestComponent.prototype.riGrid_beforeExecute = function () {
        var _this = this;
        var gridHandle = (Math.floor(Math.random() * 900000) + 100000).toString();
        var gridQueryParams = new URLSearchParams();
        var headerParams = {
            method: 'service-planning/maintenance',
            operation: 'Application/iCABSAPlanVisitTabular',
            module: 'plan-visits'
        };
        var strGridData = true;
        gridQueryParams.set(this.serviceConstants.BusinessCode, 'D');
        gridQueryParams.set(this.serviceConstants.CountryCode, 'ZA');
        gridQueryParams.set(this.serviceConstants.GridPageSize, '4');
        gridQueryParams.set(this.serviceConstants.Action, '2');
        if (strGridData) {
            gridQueryParams.set('level', 'ServiceCoverYear');
            gridQueryParams.set('RowID', '0x000000000003d284');
        }
        gridQueryParams.set('PlanVisitFrom', '25/05/2017');
        gridQueryParams.set('PlanVisitTo', '');
        gridQueryParams.set('ProductCode', '1');
        gridQueryParams.set('PremiseLocationNumber', '');
        gridQueryParams.set('VisitNarrativeCode', '');
        gridQueryParams.set('UpdateRecord', '');
        gridQueryParams.set('UpdateVisitNarrative', '');
        gridQueryParams.set('UpdateQty', '');
        gridQueryParams.set('riSortOrder', 'Descending');
        gridQueryParams.set('riCacheRefresh', 'true');
        gridQueryParams.set('riGridMode', '0');
        gridQueryParams.set('riGridHandle', '545416');
        gridQueryParams.set('HeaderClickedColumn', '');
        gridQueryParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(headerParams.method, headerParams.module, headerParams.operation, gridQueryParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            console.log('Plant Visit Tabular - Grid Data', data);
            if (!data.errorMessage) {
                _this.totalRecords = data.pageData.pageNumber;
                _this.riGrid.Execute(data);
                setTimeout(function () {
                    _this.riGrid.SetDefaultFocus();
                }, 1000);
            }
        }, function (error) {
            _this.logger.log('Error', error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    GridTestComponent.prototype.riGrid_Sort = function (event) {
        this.riGrid.RefreshRequired();
        this.riGrid_beforeExecute();
    };
    GridTestComponent.prototype.getCurrentPage = function (currentPage) {
        this.curPage = currentPage.value;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_beforeExecute();
    };
    GridTestComponent.prototype.refresh = function () {
        this.curPage = 1;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_beforeExecute();
    };
    GridTestComponent.prototype.onbodyDblClick = function (ev) {
        console.log('onbodyDblClick', ev);
    };
    GridTestComponent.prototype.tbodyPlanVisit_onkeydown = function (ev) {
        this.riGrid.Update = true;
        this.vbUpdateRecord = 'Update';
        console.log('srcElement', ev.srcElement);
        if (ev.srcElement.name === 'PlanQuantity') {
            this.vbUpdateQty = 'Update';
        }
        if (ev.srcElement.name === 'VisitNarrativeCd') {
            this.vbUpdateQty = 'Update';
        }
    };
    GridTestComponent.prototype.updateRowData = function (e) {
        var _this = this;
        var gridQueryParams = new URLSearchParams();
        this.riGrid.UpdateHeader = false;
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        var headerParams = {
            method: 'service-planning/maintenance',
            module: 'plan-visits',
            operation: 'Application/iCABSAPlanVisitTabular'
        };
        gridQueryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        gridQueryParams.set(this.serviceConstants.CountryCode, 'ZA');
        gridQueryParams.set(this.serviceConstants.Action, '2');
        var postParams = {};
        postParams.PlanDate = this.riGrid.Details.GetValue('PlanDate');
        postParams.PlanVisitType = this.riGrid.Details.GetValue('PlanVisitType');
        postParams.PlanStatus = this.riGrid.Details.GetValue('PlanStatus');
        postParams.PlanQuantity = this.riGrid.Details.GetValue('PlanQuantity');
        postParams.PlanEmployee = this.riGrid.Details.GetValue('PlanEmployee');
        postParams.ActualVisitDate = this.riGrid.Details.GetValue('ActualVisitDate');
        postParams.ActualQty = this.riGrid.Details.GetValue('ActualQty');
        postParams.ActualEmployee = this.riGrid.Details.GetValue('ActualEmployee');
        postParams.ServiceCoverItemNumberDesc = this.riGrid.Details.GetValue('ServiceCoverItemNumberDesc');
        postParams.PremiseLocNo = this.riGrid.Details.GetValue('PremiseLocNo');
        postParams.ProductComponent = this.riGrid.Details.GetValue('ProductComponent');
        postParams.ProductComponentRem = this.riGrid.Details.GetValue('ProductComponentRem');
        postParams.ServiceVisitText = this.riGrid.Details.GetValue('ServiceVisitText');
        postParams.PlanVisitCancel = this.riGrid.Details.GetValue('PlanVisitCancel');
        postParams.level = 'ServiceCoverYear';
        postParams.PlanVisitRowid = '0x000000000003d284';
        postParams.PlanVisitFrom = '25/05/2017';
        postParams.PlanVisitTo = '';
        postParams.ProductCode = '1';
        postParams.PremiseLocationNumber = '';
        postParams.VisitNarrativeCode = '';
        postParams.UpdateRecord = this.vbUpdateRecord;
        postParams.UpdateVisitNarrative = this.vbUpdateVisitNarrative;
        postParams.UpdateQty = this.vbUpdateQty;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(headerParams.method, headerParams.module, headerParams.operation, gridQueryParams, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                _this.riGrid.Update = false;
                console.log('Data', e);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    GridTestComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'gridTest.html'
                },] },
    ];
    GridTestComponent.ctorParameters = [
        { type: Injector, },
    ];
    GridTestComponent.propDecorators = {
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
    };
    return GridTestComponent;
}(BaseComponent));
