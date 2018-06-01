var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MessageConstant } from './../../../shared/constants/message.constant';
import { Component, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
export var ServiceCoverSeasonGridComponent = (function (_super) {
    __extends(ServiceCoverSeasonGridComponent, _super);
    function ServiceCoverSeasonGridComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [
            { name: 'ContractNumber', disabled: true },
            { name: 'ContractName', disabled: true },
            { name: 'PremiseNumber', disabled: true },
            { name: 'PremiseName', disabled: true },
            { name: 'ProductCode', disabled: true },
            { name: 'ProductDesc', disabled: true },
            { name: 'UpdateBranchInd', disabled: true },
            { name: 'ServiceCoverRowID' },
            { name: 'ServiceCoverNumber' },
            { name: 'ShowType' }
        ];
        this.muleConfig = {
            method: 'service-planning/maintenance',
            module: 'template',
            operation: 'Application/iCABSAServiceCoverSeasonGrid'
        };
        this.pageData = {};
        this.gridParams = {
            totalRecords: 0,
            maxColumn: 6,
            itemsPerPage: 10,
            currentPage: 1,
            riGridMode: 0,
            riGridHandle: 14287856,
            riSortOrder: 'Descending',
            HeaderClickedColumn: ''
        };
        this.gridSortHeaders = [];
        this.types = [
            { text: 'All', value: 'All' },
            { text: 'Past Seasons', value: 'Past' },
            { text: 'From Current', value: 'Current' },
            { text: 'Future', value: 'Future' }
        ];
        this.options = [
            { text: 'Options', value: '' },
            { text: 'Add Season', value: 'AddSeason' },
            { text: 'Duplicate Seasons', value: 'Duplicate' }
        ];
        this.pageId = PageIdentifier.ICABSASERVICECOVERSEASONGRID;
        this.pageTitle = 'Service Cover Seasons';
    }
    ServiceCoverSeasonGridComponent.prototype.ngAfterViewInit = function () {
        this.typesDropdown.selectedItem = 'Current';
        this.onTypeChange('Current');
        this.parentMode = this.riExchange.getParentMode();
        this.setErrorCallback(this);
        this.disableControl('ContractName', true);
        this.disableControl('PremiseName', true);
        this.disableControl('ProductDesc', true);
        if (this.parentMode === 'ServiceCover') {
            this.riExchange.getParentHTMLValue('ContractNumber');
            this.riExchange.getParentHTMLValue('PremiseNumber');
            this.riExchange.getParentHTMLValue('ProductCode');
            this.riExchange.getParentHTMLValue('ServiceCoverRowID');
            this.disableControl('ContractNumber', true);
            this.disableControl('PremiseNumber', true);
            this.disableControl('ProductCode', true);
        }
        this.fetchData();
        var sortAnnualSeasonCode = {
            'fieldName': 'AnnualSeasonCode',
            'colName': 'Annual Season Code',
            'sortType': 'ASC'
        };
        var fromDate = {
            'fieldName': 'FromDate',
            'colName': 'From Date',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(sortAnnualSeasonCode);
        this.gridSortHeaders.push(fromDate);
    };
    ServiceCoverSeasonGridComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show({ msg: data.msg, title: 'Error' }, false);
    };
    ServiceCoverSeasonGridComponent.prototype.fetchData = function () {
        var _this = this;
        var searchParams = this.getURLSearchParamObject();
        var formData = {};
        searchParams.set(this.serviceConstants.Action, '0');
        formData['ContractNumber'] = this.getControlValue('ContractNumber');
        formData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formData['ProductCode'] = this.getControlValue('ProductCode');
        formData['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
        formData[this.serviceConstants.Function] = 'SetDisplayFields';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, searchParams, formData).subscribe(function (data) {
            _this.pageData = data;
            _this.populateForm();
            _this.loadGrid();
        }, function (error) {
            _this.logger.log(error);
            _this.errorService.emitError({
                msg: MessageConstant.Message.GeneralError
            });
        });
    };
    ServiceCoverSeasonGridComponent.prototype.populateForm = function () {
        for (var key in this.pageData) {
            if (!key) {
                continue;
            }
            var value = this.pageData[key] ? this.pageData[key].trim() : this.pageData[key];
            this.setControlValue(key, value);
        }
    };
    ServiceCoverSeasonGridComponent.prototype.loadGrid = function () {
        var gridQuery = this.getURLSearchParamObject();
        var gridInputParams;
        var bodyParams = {};
        gridInputParams = this.muleConfig;
        gridQuery.set(this.serviceConstants.Action, '2');
        gridQuery.set(this.serviceConstants.GridMode, this.gridParams.riGridMode);
        gridQuery.set(this.serviceConstants.GridHandle, this.gridParams.riGridHandle);
        gridQuery.set(this.serviceConstants.GridSortOrder, this.gridParams.riSortOrder);
        gridQuery.set(this.serviceConstants.PageSize, this.gridParams.itemsPerPage);
        gridQuery.set(this.serviceConstants.PageCurrent, this.gridParams.currentPage);
        gridQuery.set(this.serviceConstants.GridHeaderClickedColumn, this.gridParams.HeaderClickedColumn);
        gridQuery.set(this.serviceConstants.GridSortOrder, this.gridParams.riSortOrder);
        gridQuery.set(this.serviceConstants.ContractNumber, this.getControlValue('ContractNumber'));
        gridQuery.set(this.serviceConstants.PremiseNumber, this.getControlValue('PremiseNumber'));
        gridQuery.set('ProductCode', this.getControlValue('ProductCode'));
        gridQuery.set('ServiceCoverNumber', this.getControlValue('ServiceCoverNumber'));
        gridQuery.set('ServiceCoverRowID', this.getControlValue('ServiceCoverRowID'));
        gridQuery.set('ShowType', this.getControlValue('ShowType'));
        gridInputParams.search = gridQuery;
        this.serviceCoverSeasonGrid.loadGridData(gridInputParams);
    };
    ServiceCoverSeasonGridComponent.prototype.onTypeChange = function (data) {
        this.setControlValue('ShowType', data);
    };
    ServiceCoverSeasonGridComponent.prototype.onMenuChange = function (data) {
        if (!data) {
            return;
        }
        switch (data) {
            case 'AddSeason':
                this.addSeason();
                break;
            case 'Duplicate':
                this.duplicateSeason();
                break;
        }
    };
    ServiceCoverSeasonGridComponent.prototype.addSeason = function () {
        this.errorService.emitError({
            msg: 'Page iCABSAServiceCoverSeasonMaintenance Is Not Developed Yet'
        });
    };
    ServiceCoverSeasonGridComponent.prototype.duplicateSeason = function () {
        var _this = this;
        var duplicateSeasonParams = this.getURLSearchParamObject();
        var bodyParams = {};
        duplicateSeasonParams.set(this.serviceConstants.Action, '0');
        bodyParams[this.serviceConstants.Function] = 'DuplicateSeasons';
        bodyParams['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, duplicateSeasonParams, bodyParams).subscribe(function (data) {
            if (data.errorMessage) {
                _this.errorService.emitError({
                    msg: data.errorMessage
                });
                return;
            }
            _this.loadGrid();
        }, function (error) {
            _this.logger.log(error);
            _this.errorService.emitError({
                msg: MessageConstant.Message.GeneralError
            });
        });
    };
    ServiceCoverSeasonGridComponent.prototype.refresh = function () {
        this.gridParams.currentPage = 1;
        this.loadGrid();
    };
    ServiceCoverSeasonGridComponent.prototype.getCurrentPage = function (curPage) {
        this.gridParams.currentPage = curPage ? curPage.value : this.gridParams.currentPage;
        this.loadGrid();
    };
    ServiceCoverSeasonGridComponent.prototype.getGridInfo = function (info) {
        var gridTotalItems = this.gridParams.itemsPerPage;
        if (info) {
            this.gridParams.totalRecords = info.totalRows;
        }
    };
    ServiceCoverSeasonGridComponent.prototype.onRowSelect = function (data) {
        var cellData = data.cellData;
        switch (cellData.additionalData) {
            case 'TRUE':
                this.mode = 'GridSeasonUpdate';
                break;
            case 'FALSE':
                this.mode = 'GridSeasonView';
                if (this.getControlValue('UpdateBranchInd')) {
                    this.mode = 'GridSeasonViewFollowsTemplate';
                }
                break;
        }
        this.errorService.emitError({
            msg: 'Page iCABSAServiceCoverSeasonMaintenance Is Not Developed Yet'
        });
    };
    ServiceCoverSeasonGridComponent.prototype.sortGrid = function (data) {
        this.gridParams.HeaderClickedColumn = data.fieldname;
        this.gridParams.riSortOrder = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.loadGrid();
    };
    ServiceCoverSeasonGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverSeasonGrid.html'
                },] },
    ];
    ServiceCoverSeasonGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    ServiceCoverSeasonGridComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'serviceCoverSeasonGrid': [{ type: ViewChild, args: ['serviceCoverSeasonGrid',] },],
        'typesDropdown': [{ type: ViewChild, args: ['typesDropdown',] },],
    };
    return ServiceCoverSeasonGridComponent;
}(BaseComponent));
