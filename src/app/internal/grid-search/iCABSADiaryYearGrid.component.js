var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { InternalMaintenanceModuleRoutes } from '../../base/PageRoutes';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
export var DiaryYearGridComponent = (function (_super) {
    __extends(DiaryYearGridComponent, _super);
    function DiaryYearGridComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.method = 'service-planning/maintenance';
        this.module = 'diary';
        this.operation = 'Application/iCABSADiaryYearGrid';
        this.inputParams = {};
        this.maxColumn = 32;
        this.itemsPerPage = 12;
        this.pageCurrent = 1;
        this.curPage = 1;
        this.pageSize = 10;
        this.viewByOption = 'All';
        this.legend = [];
        this.showMessageHeader = true;
        this.showHideGrid = false;
        this.showGrid = true;
        this.controls = [
            { name: 'EmployeeCode', readonly: true, disabled: true, required: false },
            { name: 'EmployeeName', readonly: true, disabled: true, required: false },
            { name: 'SelectedYear', readonly: true, disabled: false, required: false },
            { name: 'TotalEntries', readonly: true, disabled: true, required: false },
            { name: 'TotalHolidays', readonly: true, disabled: true, required: false },
            { name: 'TotalSickness', readonly: true, disabled: true, required: false },
            { name: 'TotalTickets', readonly: true, disabled: true, required: false },
            { name: 'TotalWorkOrders', readonly: true, disabled: true, required: false },
            { name: 'TotalBranchHolidays', readonly: true, disabled: true, required: false },
            { name: 'TotalOther', readonly: true, disabled: true, required: false },
            { name: 'PassEmployeeCode', readonly: true, disabled: true, required: false },
            { name: 'PassEmployeeName', readonly: true, disabled: true, required: false },
            { name: 'PassMonth', readonly: true, disabled: true, required: false },
            { name: 'PassYear', readonly: true, disabled: true, required: false },
            { name: 'DiaryDate', readonly: true, disabled: true, required: false },
            { name: 'SelectedDate' },
            { name: 'GridSelectedYear' },
            { name: 'GridSelectedDay' },
            { name: 'GridSelectedMonth' },
            { name: 'PassDiaryDate' }
        ];
        this.pageId = PageIdentifier.ICABSADIARYYEARGRID;
    }
    DiaryYearGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Diary';
        this.windowOnload();
        this.setupPage();
    };
    DiaryYearGridComponent.prototype.windowOnload = function () {
        var _this = this;
        var date = new Date();
        this.errorMsg = 'Error - Unable to calculate month and year';
        this.getTranslatedValue(this.errorMsg, null).subscribe(function (res) {
            if (res) {
                _this.errorMsg = res;
            }
        });
        this.riGrid.HidePageNumber = true;
        this.riGrid.HighlightBar = false;
        this.SelectedYear = date.getFullYear();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelectedYear', this.SelectedYear);
        this.riGrid.DefaultBorderColor = 'DDDDDD';
        this.riGrid.FunctionPaging = false;
        this.riGrid.PageSize = this.pageSize;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateBody = true;
    };
    DiaryYearGridComponent.prototype.setupPage = function () {
        switch (this.parentMode) {
            case 'Employee':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeName', this.riExchange.getParentHTMLValue('EmployeeSurname'));
                break;
            case 'ServiceVisitCalendar':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCode'));
                break;
            case 'ServiceCover':
            case 'ServiceVisitMaintenance':
            case 'byServiceCoverRowID':
                break;
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PassEmployeeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PassEmployeeName', this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeName'));
        this.buildGrid();
        this.riGrid_BeforeExecute();
    };
    DiaryYearGridComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    DiaryYearGridComponent.prototype.buildGrid = function () {
        this.riGrid.Clear();
        var iLoop;
        this.riGrid.AddColumn('Month', 'Diary', 'Month', MntConst.eTypeText, 20, true);
        for (iLoop = 1; iLoop <= 31; iLoop++) {
            this.riGrid.AddColumn(iLoop.toString(), 'Diary', iLoop.toString(), MntConst.eTypeText, 1, true);
            switch (this.viewByOption) {
                case 'Time':
                case 'Value':
                    this.riGrid.AddColumnAlign(iLoop.toString(), MntConst.eAlignmentRight);
                    break;
                default:
                    this.riGrid.AddColumnAlign(iLoop.toString(), MntConst.eAlignmentCenter);
                    break;
            }
        }
        this.riGrid.Complete();
    };
    DiaryYearGridComponent.prototype.riGrid_BeforeExecute = function () {
        var _this = this;
        var gridParams = new URLSearchParams();
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.countryCode());
        gridParams.set('EmployeeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode'));
        gridParams.set('year', this.SelectedYear.toString());
        gridParams.set('ViewTypeFilter', this.viewByOption);
        gridParams.set('riSortOrder', 'Descending');
        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.GridHandle, '1246324');
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        gridParams.set('HeaderClickedColumn', '');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.method, this.module, this.operation, gridParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                return;
            }
            _this.curPage = data.pageData ? data.pageData.pageNumber : 1;
            _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * _this.pageSize : 1;
            _this.riGrid.Update = true;
            _this.riGrid.UpdateBody = true;
            _this.riGrid.UpdateHeader = true;
            _this.riGrid.Execute(data);
        }, function (error) {
            _this.logger.log('Error', error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    DiaryYearGridComponent.prototype.selectedAllDiary = function (value) {
        this.riExchange.setParentAttributeValue('ProductCodeServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCover'));
        this.riExchange.setParentAttributeValue('ContractNumberSelectedDate', '');
        this.riExchange.setParentAttributeValue('ProductCodeServiceCoverRowID', this.riExchange.getParentAttributeValue('ServiceCoverRowID'));
        if (value === 'Add Diary Entry') {
            this.navigate('YearGrid', InternalMaintenanceModuleRoutes.ICABSADIARYENTRY);
        }
    };
    DiaryYearGridComponent.prototype.selectedViewBy = function (value) {
        this.viewByOption = value;
        this.showGrid = false;
    };
    DiaryYearGridComponent.prototype.refresh = function () {
        this.showGrid = true;
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    DiaryYearGridComponent.prototype.getCurrentPage = function (currentPage) {
        this.curPage = currentPage.value;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    };
    DiaryYearGridComponent.prototype.tbodyDiary_onDblClick = function (ev) {
        var iSelectedDay, iSelectedMonth, iSelectedYear, arrSelection;
        if (ev.srcElement.value) {
            if (ev.srcElement.parentElement.children[0].getAttribute('rowid')) {
                arrSelection = ev.srcElement.parentElement.children[0].getAttribute('rowid').split(' ');
                if (!Array.isArray(arrSelection) || arrSelection.length < 2) {
                    this.errorModal.show({ msg: this.errorMsg, title: '' }, false);
                    return;
                }
                iSelectedDay = 1;
                iSelectedMonth = arrSelection[0];
                iSelectedYear = arrSelection[1];
                var dateNum = this.utils.numberPadding(iSelectedDay, 2);
                var monthNum = this.utils.numberPadding(iSelectedMonth, 2);
                this.setControlValue('SelectedDate', new Date(iSelectedYear + '/' + monthNum + '/' + dateNum));
                this.setControlValue('GridSelectedYear', iSelectedYear);
                this.setControlValue('GridSelectedMonth', iSelectedMonth);
                this.setControlValue('GridSelectedDay', iSelectedDay);
                this.errorModal.show({ msg: 'iCABSCMDiaryMaintenance - Page not developed', title: '' }, false);
            }
        }
        else {
            if (ev.srcElement.getAttribute('additionalproperty')) {
                arrSelection = ev.srcElement.getAttribute('additionalproperty').split('/');
                if (!Array.isArray(arrSelection) || arrSelection.length < 3) {
                    this.errorModal.show({ msg: this.errorMsg, title: '' }, false);
                    return;
                }
                iSelectedDay = arrSelection[0];
                iSelectedMonth = arrSelection[1];
                iSelectedYear = arrSelection[2];
                var dateNum = this.utils.numberPadding(iSelectedDay, 2);
                var monthNum = this.utils.numberPadding(iSelectedMonth, 2);
                this.setControlValue('PassDiaryDate', new Date(iSelectedYear + '/' + monthNum + '/' + dateNum));
                this.errorModal.show({ msg: 'iCABSCMDiaryDayMaintenance - Page not developed', title: '' }, false);
            }
        }
    };
    DiaryYearGridComponent.prototype.riGrid_AfterExecute = function () {
        var iLoop;
        var oTR, oTD;
        var iBeforeCurrentMonth;
        var iAfterCurrentMonth;
        for (iLoop = 1; iLoop <= 31; iLoop++) {
        }
        var obj = this.riGrid.HTMLGridBody.children[0].children[0].getAttribute('additionalproperty');
        if (obj) {
            this.legend = [];
            var legend = obj.split('bgcolor=');
            for (var i = 0; i < legend.length; i++) {
                var str = legend[i];
                if (str.indexOf('"#') >= 0) {
                    this.legend.push({
                        color: str.substr(str.indexOf('"#') + 1, 7),
                        label: str.substr(str.indexOf('<td>') + 4, str.substr(str.indexOf('<td>') + 4).indexOf('&'))
                    });
                }
            }
        }
        var currentMonth = new Date().getMonth();
        iBeforeCurrentMonth = new Date().getMonth();
        iAfterCurrentMonth = new Date().getMonth() + 1;
        var objList = document.querySelectorAll('.gridtable tbody > tr');
        if (objList && objList.length >= currentMonth) {
            var tr = objList[currentMonth];
            if (tr) {
                tr.setAttribute('class', 'currentMonth');
            }
        }
        var TotalString;
        TotalString = this.riGrid.HTMLGridBody.children[1].children[0].getAttribute('additionalproperty').split('|');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalEntries', TotalString[0]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalHolidays', TotalString[1]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalSickness', TotalString[2]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalTickets', TotalString[3]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalWorkOrders', TotalString[4]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalBranchHolidays', TotalString[5]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalOther', TotalString[6]);
    };
    DiaryYearGridComponent.prototype.onPlusClick = function (event) {
        this.SelectedYear++;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelectedYear', this.SelectedYear);
    };
    DiaryYearGridComponent.prototype.onMinusClick = function (event) {
        this.SelectedYear--;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelectedYear', this.SelectedYear);
    };
    DiaryYearGridComponent.prototype.keyboardInput = function (event) {
        switch (event.keyCode) {
            case 45:
                this.SelectedYear--;
                break;
            case 43:
                this.SelectedYear++;
                break;
            default:
                break;
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelectedYear', this.SelectedYear);
    };
    DiaryYearGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSADiaryYearGrid.html'
                },] },
    ];
    DiaryYearGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    DiaryYearGridComponent.propDecorators = {
        'diaryYearGrid': [{ type: ViewChild, args: ['diaryYearGrid',] },],
        'diaryGridPagination': [{ type: ViewChild, args: ['diaryGridPagination',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return DiaryYearGridComponent;
}(BaseComponent));
