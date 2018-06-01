var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, ViewChild } from '@angular/core';
export var DLHistoryGridComponent = (function (_super) {
    __extends(DLHistoryGridComponent, _super);
    function DLHistoryGridComponent(injector) {
        _super.call(this, injector);
        this.inputParams = {};
        this.pageId = '';
        this.pageTitle = '';
        this.pageSize = 10;
        this.curPage = 1;
        this.maxColumn = 10;
        this.showMessageHeader = true;
        this.controls = [
            { name: 'dlContractRef', disabled: true },
            { name: 'ContractName', disabled: true },
            { name: 'ContractTypeCode', disabled: true }
        ];
        this.queryParams = {
            method: 'prospect-to-contract/maintenance',
            action: '2',
            module: 'advantage',
            operation: 'Sales/iCABSSdlHistoryGrid'
        };
        this.historyModel = {
            'dlContractRef': '',
            'ContractName': '',
            'ContractTypeCode': ''
        };
        this.pageId = PageIdentifier.ICABSSDLHISTORYGRID;
        this.pageTitle = 'Advantage Quote History';
    }
    DLHistoryGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.windowOnload();
    };
    DLHistoryGridComponent.prototype.showAlert = function (msgTxt) {
        this.messageModal.show({ msg: msgTxt, title: 'Message' }, false);
    };
    DLHistoryGridComponent.prototype.windowOnload = function () {
        this.getParentFields();
        this.riGrid.FunctionPaging = false;
        this.riGrid.HighlightBar = true;
        this.riGrid.PageSize = 10;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateBody = true;
        this.buildGrid();
        this.riGrid_BeforeExecute();
    };
    DLHistoryGridComponent.prototype.getParentFields = function () {
        this.historyModel.dlBatchRef = this.getNodeValue(this.riExchange.getParentHTMLValue('dlBatchRef'));
        this.historyModel.dlContractRef = this.getNodeValue(this.riExchange.getParentHTMLValue('dlContractRef'));
        this.historyModel.ContractTypeCode = this.getNodeValue(this.riExchange.getParentHTMLValue('ContractTypeCode'));
        this.historyModel.SubSystem = this.getNodeValue(this.riExchange.getParentHTMLValue('SubSystem'));
        if (this.parentMode === 'SOQuote') {
            this.historyModel.ContractName = this.getNodeValue(this.riExchange.getParentHTMLValue('ProspectName'));
        }
        else if (this.parentMode === 'Approval') {
            this.historyModel.ContractName = this.getNodeValue(this.riExchange.getParentHTMLValue('ContractName'));
        }
        this.setControlValue('dlContractRef', this.historyModel.dlContractRef);
        this.setControlValue('ContractName', this.historyModel.ContractName);
        this.setControlValue('ContractTypeCode', this.historyModel.ContractTypeCode);
    };
    DLHistoryGridComponent.prototype.getNodeValue = function (value) {
        return (value) ? value : '';
    };
    DLHistoryGridComponent.prototype.buildGrid = function () {
        this.riGrid.Clear();
        this.riGrid.AddColumn('HistoryNumber', 'dlHistory', 'HistoryNumber', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('dlStatusDesc', 'dlHistory', 'dlStatusDesc', MntConst.eTypeTextFree, 20);
        this.riGrid.AddColumn('EffectiveDate', 'dlHistory', 'EffectiveDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('ProcessedDate', 'dlHistory', 'ProcessedDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('UserCode', 'dlHistory', 'UserCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumn('AnnualValue', 'dlHistory', 'AnnualValue', MntConst.eTypeCurrency, 10);
        this.riGrid.AddColumn('dlRejectionDesc', 'dlHistory', 'dlRejectionDesc', MntConst.eTypeTextFree, 12);
        this.riGrid.AddColumn('LostBusinessDesc', 'dlHistory', 'LostBusinessDesc', MntConst.eTypeTextFree, 12);
        this.riGrid.AddColumn('LostBusinessDetailDesc', 'dlHistory', 'LostBusinessDetailDesc', MntConst.eTypeTextFree, 12);
        this.riGrid.AddColumn('Info', 'dlHistory', 'Info', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('HistoryNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('EffectiveDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ProcessedDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('HistoryNumber', true);
        this.riGrid.Complete();
    };
    DLHistoryGridComponent.prototype.riGrid_BeforeExecute = function () {
        var _this = this;
        var search = this.getURLSearchParamObject(), sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        search.set(this.serviceConstants.Action, this.queryParams.action);
        search.set(this.serviceConstants.GridMode, '0');
        search.set(this.serviceConstants.GridHandle, '1246498');
        search.set(this.serviceConstants.GridPageSize, this.pageSize.toString());
        search.set(this.serviceConstants.GridPageCurrent, this.curPage.toString());
        search.set('riSortOrder', sortOrder);
        search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        search.set('LanguageCode', this.riExchange.LanguageCode());
        search.set('riCacheRefresh', 'True');
        search.set('dlBatchRef', this.historyModel.dlBatchRef);
        search.set('dlContractRef', this.getControlValue('dlContractRef'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.hasError) {
                _this.messageModal.show(data, true);
            }
            else {
                _this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * _this.pageSize : 1;
                _this.riGrid.Update = true;
                _this.riGrid.UpdateBody = true;
                _this.riGrid.UpdateHeader = true;
                _this.riGrid.Execute(data);
            }
        }, function (error) {
            _this.messageModal.show(error, true);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    DLHistoryGridComponent.prototype.getCurrentPage = function (data) {
        this.curPage = data.value;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    };
    DLHistoryGridComponent.prototype.refresh = function () {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    DLHistoryGridComponent.prototype.riGrid_Sort = function (event) {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    DLHistoryGridComponent.prototype.riGrid_BodyOnDblClick = function (ev) {
    };
    DLHistoryGridComponent.prototype.riGrid_BodyOnClick = function (ev) {
        this.dlHistoryFocus(ev.srcElement);
    };
    DLHistoryGridComponent.prototype.riGrid_BodyOnKeyDown = function (ev) {
        this.dlHistoryFocus(ev);
    };
    DLHistoryGridComponent.prototype.dlHistoryFocus = function (data) {
        var msg = this.riGrid.Details.GetAttribute('Info', 'AdditionalProperty');
        if (msg) {
            this.showAlert(msg);
        }
        else {
            this.showAlert(MessageConstant.Message.noSpecialInstructions);
        }
    };
    DLHistoryGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSdlHistoryGrid.html'
                },] },
    ];
    DLHistoryGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    DLHistoryGridComponent.propDecorators = {
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
        'riGridPagination': [{ type: ViewChild, args: ['riGridPagination',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return DLHistoryGridComponent;
}(BaseComponent));
