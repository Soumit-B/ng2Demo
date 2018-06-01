var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild, EventEmitter } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { URLSearchParams } from '@angular/http';
export var TechnicianSyncSummaryGridComponent = (function (_super) {
    __extends(TechnicianSyncSummaryGridComponent, _super);
    function TechnicianSyncSummaryGridComponent(injector) {
        _super.call(this, injector);
        this.setFocusEmployeeCode = new EventEmitter();
        this.search = new URLSearchParams();
        this.showErrorHeader = true;
        this.pageCurrent = 1;
        this.totalRecords = 1;
        this.pageSize = 10;
        this.DateTo = new Date();
        this.Date = new Date();
        this.selectedRow = -1;
        this.showHeader = false;
        this.dateReadOnly = false;
        this.controls = [
            { name: 'BusinessCode', readonly: true, disabled: true, required: false },
            { name: 'BusinessDesc', readonly: true, disabled: true, required: false },
            { name: 'EmployeeCode', readonly: false, disabled: false, required: false },
            { name: 'EmployeeSurname', readonly: true, disabled: true, required: false },
            { name: 'DateFrom', readonly: true, disabled: false, required: false },
            { name: 'DateTo', readonly: true, disabled: false, required: false }
        ];
        this.queryParams = {
            operation: 'Service/iCABSSeTechnicianSyncSummaryGrid',
            module: 'pda',
            method: 'service-delivery/maintenance'
        };
        this.inputParamsEmployeeSearch = {
            'childConfigParams': {
                'parentMode': 'LookUp',
                'showAddNew': false
            },
            'contentComponent': EmployeeSearchComponent,
            'modalTitle': '',
            'showHeader': true,
            'disabled': false
        };
        this.pageId = PageIdentifier.ICABSSETECHNICIANSYNCSUMMARYGRID;
    }
    TechnicianSyncSummaryGridComponent.prototype.showErrorModal = function (data, title) {
        this.errorModal.show({ msg: data, title: title }, false);
    };
    TechnicianSyncSummaryGridComponent.prototype.onEmployeeDataReturn = function (data) {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EmployeeCode', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode', false);
        this.pageParams.employeeCode = data.EmployeeCode;
        this.pageParams.employeeSurName = data.EmployeeSurName;
        this.setControlValue('EmployeeCode', data.EmployeeCode);
        this.setControlValue('EmployeeSurname', data.EmployeeSurname);
        this.employeeCodeOnChange();
    };
    TechnicianSyncSummaryGridComponent.prototype.employeeCode_Keyup = function () {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EmployeeCode', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode', false);
    };
    TechnicianSyncSummaryGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Technician Synchronisation Summary';
        this.utils.setTitle(this.pageTitle);
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.FunctionUpdateSupport = true;
        this.riGrid.PageSize = this.pageSize;
        this.BuildGrid();
        if (this.isReturning()) {
            this.populateUIFromFormData();
        }
        else {
            this.window_onload();
        }
    };
    TechnicianSyncSummaryGridComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    TechnicianSyncSummaryGridComponent.prototype.window_onload = function () {
        this.DateFrom = new Date(this.dateSeries());
        this.riExchange.riInputElement.Disable(this.uiForm, 'BusinessCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BusinessDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'EmployeeSurname');
        this.pageParams.vBusinessCode = this.businessCode();
        this.doLookup('Business', { 'BusinessCode': this.pageParams.vBusinessCode }, ['BusinessDesc']);
        this.setControlValue('BusinessCode', this.pageParams.vBusinessCode);
        this.pageParams.level = 'Employee';
        var parentMode = this.riExchange.getParentMode();
        if (parentMode === 'TechSyncSummary') {
            this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCodeInput'));
            this.setControlValue('EmployeeSurname', this.riExchange.GetParentHTMLInputElementAttribute('EmployeeCodeInput', 'EmployeeSurname'));
            this.setControlValue('DateFrom', this.riExchange.getParentHTMLValue('DateFrom'));
            this.setControlValue('DateTo', this.riExchange.getParentHTMLValue('DateTo'));
            this.loadData();
        }
        else {
            this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCode'));
            this.setControlValue('EmployeeSurname', this.riExchange.getParentHTMLValue('EmployeeSurname'));
            this.setControlValue('DateFrom', this.utils.formatDate(this.DateFrom));
            this.setControlValue('DateTo', this.utils.formatDate(this.DateTo));
            this.setFocusEmployeeCode.emit(true);
        }
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EmployeeCode', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode', true);
    };
    TechnicianSyncSummaryGridComponent.prototype.doLookup = function (table, query, fields) {
        var _this = this;
        var lookupIP = [{
                'table': table,
                'query': query,
                'fields': fields
            }];
        this.LookUp.lookUpPromise(lookupIP).then(function (data) {
            _this.isRequesting = true;
            var record = data[0];
            switch (table) {
                case 'Business':
                    if (record.length > 0) {
                        _this.pageParams.vBusinessDesc = record[0].hasOwnProperty('BusinessDesc') ? record[0]['BusinessDesc'] : false;
                        _this.setControlValue('BusinessDesc', _this.pageParams.vBusinessDesc);
                        _this.setControlValue('BusinessCode', _this.pageParams.vBusinessCode);
                    }
                    _this.isRequesting = false;
                    break;
                case 'Company':
                    if (record.length > 0) {
                        _this.pageParams.CompanyDesc = record[0].hasOwnProperty('CompanyDesc') ? record[0]['CompanyDesc'] : false;
                        _this.setControlValue('CompanyDesc', _this.pageParams.CompanyDesc);
                        _this.setControlValue('CompanyCode', query['CompanyCode']);
                    }
                    _this.isRequesting = false;
                    break;
            }
        });
    };
    ;
    TechnicianSyncSummaryGridComponent.prototype.dateSeries = function () {
        var month = '' + (this.Date.getMonth() + 1);
        var day = '1';
        var year = this.Date.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        var date = [month, day, year].join('/').toString();
        return date;
    };
    TechnicianSyncSummaryGridComponent.prototype.dateFromSelectedValue = function (value) {
        if (value && value.value) {
            this.setControlValue('DateFrom', value.value);
            this.dateFromOnChange();
        }
    };
    TechnicianSyncSummaryGridComponent.prototype.dateToSelectedValue = function (value) {
        if (value && value.value) {
            this.setControlValue('DateTo', value.value);
            this.dateToOnChange();
        }
    };
    TechnicianSyncSummaryGridComponent.prototype.dateFromOnChange = function () {
        this.riGrid.RefreshRequired();
    };
    TechnicianSyncSummaryGridComponent.prototype.dateToOnChange = function () {
        this.riGrid.RefreshRequired();
    };
    TechnicianSyncSummaryGridComponent.prototype.employeeCodeOnChange = function () {
        if (!this.getControlValue('EmployeeCode')) {
            this.setControlValue('EmployeeSurname', '');
        }
        this.riGrid.RefreshRequired();
    };
    TechnicianSyncSummaryGridComponent.prototype.riExchangeUpDateHTMLDocument = function () {
        this.riGrid.Update = true;
        this.refresh();
    };
    TechnicianSyncSummaryGridComponent.prototype.BuildGrid = function () {
        this.riGrid.Clear();
        this.riGrid.AddColumn('WeekStart', 'SyncSummary', 'WeekStart', MntConst.eTypeText, 15, false, '');
        this.riGrid.AddColumnAlign('WeekStart', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('Monday', 'SyncSummary', 'Monday', MntConst.eTypeInteger, 15, false, '');
        this.riGrid.AddColumnAlign('Monday', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('Tuesday', 'SyncSummary', 'Tuesday', MntConst.eTypeInteger, 15, false, '');
        this.riGrid.AddColumnAlign('Tuesday', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('Wednesday', 'SyncSummary', 'Wednesday', MntConst.eTypeInteger, 15, false, '');
        this.riGrid.AddColumnAlign('Wednesday', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('Thursday', 'SyncSummary', 'Thursday', MntConst.eTypeInteger, 15, false, '');
        this.riGrid.AddColumnAlign('Thursday', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('Friday', 'SyncSummary', 'Friday', MntConst.eTypeInteger, 15, false, '');
        this.riGrid.AddColumnAlign('Friday', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('Saturday', 'SyncSummary', 'Saturday', MntConst.eTypeInteger, 15, false, '');
        this.riGrid.AddColumnAlign('Saturday', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('Sunday', 'SyncSummary', 'Sunday', MntConst.eTypeInteger, 15, false, '');
        this.riGrid.AddColumnAlign('Sunday', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('Qty', 'SyncSummary', 'Qty', MntConst.eTypeInteger, 15, false, '');
        this.riGrid.AddColumnAlign('Qty', MntConst.eAlignmentRight);
        this.riGrid.Complete();
    };
    TechnicianSyncSummaryGridComponent.prototype.loadData = function () {
        var _this = this;
        if (this.riGrid_BeforeExecute()) {
            this.search = this.getURLSearchParamObject();
            this.search.set('DateFrom', this.getControlValue('DateFrom'));
            this.search.set('Level', this.pageParams.level);
            this.search.set('DateTo', this.getControlValue('DateTo'));
            this.search.set(this.serviceConstants.Action, '2');
            this.search.set('EmployeeCode', this.getControlValue('EmployeeCode'));
            this.search.set(this.serviceConstants.BusinessCode, this.getControlValue('BusinessCode'));
            this.search.set(this.serviceConstants.PageSize, this.pageSize.toString());
            this.search.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
            this.search.set(this.serviceConstants.GridMode, '0');
            this.search.set(this.serviceConstants.GridHandle, '3999712');
            this.search.set('PageCurrent', this.pageCurrent.toString());
            this.search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
            var sortOrder = 'Descending';
            if (!this.riGrid.DescendingSort) {
                sortOrder = 'Ascending';
            }
            this.search.set('riSortOrder', sortOrder);
            this.queryParams.search = this.search;
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryParams.search)
                .subscribe(function (data) {
                if (data && data.errorMessage) {
                    _this.showErrorModal(data.errorMessage, 'Error');
                }
                else {
                    _this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                    _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * _this.pageSize : 1;
                    _this.riGrid.Update = true;
                    _this.riGrid.UpdateBody = true;
                    _this.riGrid.UpdateFooter = true;
                    _this.riGrid.UpdateHeader = true;
                    _this.riGrid.Execute(data);
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.totalRecords = 1;
                _this.showErrorModal(error, 'Error');
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    TechnicianSyncSummaryGridComponent.prototype.riExchange_UpdateHTMLDocument = function () {
        this.riGrid.Update = true;
    };
    TechnicianSyncSummaryGridComponent.prototype.ValidateScreenParameters = function () {
        var blnReturn = true;
        var fromDate = this.getControlValue('DateFrom');
        if (!window['moment'](fromDate, 'DD/MM/YYYY', true).isValid()) {
            blnReturn = false;
            this.DateFromDatePicker.validateDateField();
        }
        var toDate = this.getControlValue('DateTo');
        if (!window['moment'](toDate, 'DD/MM/YYYY', true).isValid()) {
            blnReturn = false;
            this.DateToDatePicker.validateDateField();
        }
        return blnReturn;
    };
    TechnicianSyncSummaryGridComponent.prototype.riGrid_BeforeExecute = function () {
        if (this.ValidateScreenParameters()) {
            this.pageParams.BusinessObjectPostData = 'Level=' + this.pageParams.level +
                '&BusinessCode=' + this.businessCode() +
                '&EmployeeCode=' + this.getControlValue('EmployeeCode') +
                '&DateFrom=' + this.getControlValue('DateFrom') +
                '&DateTo=' + this.getControlValue('DateTo');
            return true;
        }
        else {
            return false;
        }
    };
    TechnicianSyncSummaryGridComponent.prototype.riGrid_Sort = function (event) {
    };
    TechnicianSyncSummaryGridComponent.prototype.getCurrentPage = function (event) {
        this.selectedRow = -1;
        this.pageCurrent = event.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.pageCurrent));
        this.refresh();
    };
    TechnicianSyncSummaryGridComponent.prototype.refresh = function () {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EmployeeCode', true);
        this.loadData();
    };
    TechnicianSyncSummaryGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSeTechnicianSyncSummaryGrid.html'
                },] },
    ];
    TechnicianSyncSummaryGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    TechnicianSyncSummaryGridComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
        'riGridPagination': [{ type: ViewChild, args: ['riGridPagination',] },],
        'DateToDatePicker': [{ type: ViewChild, args: ['DateToDatePicker',] },],
        'DateFromDatePicker': [{ type: ViewChild, args: ['DateFromDatePicker',] },],
    };
    return TechnicianSyncSummaryGridComponent;
}(BaseComponent));
