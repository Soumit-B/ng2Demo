var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Observable } from 'rxjs';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from './../../base/BaseComponent';
export var ServiceCoverCalendarDateComponent = (function (_super) {
    __extends(ServiceCoverCalendarDateComponent, _super);
    function ServiceCoverCalendarDateComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [
            { name: 'ContractNumber', readonly: false, disabled: true, required: true },
            { name: 'ContractName', readonly: true, disabled: true, required: false },
            { name: 'PremiseNumber', readonly: true, disabled: true, required: true },
            { name: 'PremiseName', readonly: false, disabled: true, required: false },
            { name: 'ProductCode', readonly: true, disabled: true, required: true },
            { name: 'ProductDesc', readonly: true, disabled: true, required: false },
            { name: 'ServiceVisitFrequency', readonly: true, disabled: true, required: false },
            { name: 'SelectedYear', readonly: false, disabled: false, required: false },
            { name: 'UpdateCalendar', readonly: false, disabled: false, required: false },
            { name: 'SelectedDay', readonly: false, disabled: false, required: false },
            { name: 'SelectedMonth', readonly: false, disabled: false, required: false },
            { name: 'SCRowID', readonly: false, disabled: false, required: false },
            { name: 'CalendarUpdateAllowed', readonly: false, disabled: false, required: false },
            { name: 'TotalVisits', readonly: true, disabled: true, required: false }
        ];
        this.legend = [
            { label: 'Empty', color: '#DDDDDD' },
            { label: 'Weekend', color: '#AAAAAA' },
            { label: 'Due', color: '#CCFFCC' },
            { label: 'Weekend Due', color: '#6D926D' }
        ];
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.headerParams = {
            operation: 'Application/iCABSAServiceCoverCalendarDateGrid',
            module: 'contract-admin',
            method: 'contract-management/maintenance'
        };
        this.pageCurrent = '1';
        this.totalRecords = 0;
        this.hasMoreEntered = false;
        this.initialRecords = -1;
        this.promptTitle = '';
        this.promptContent = MessageConstant.Message.RouteAway;
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.errorMessages = {
            earlierYear: 'Calendar updates cannot be earlier than the current year'
        };
        this.promptModalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.pageId = PageIdentifier.ICABSASERVICECOVERCALENDARDATEGRID;
    }
    ServiceCoverCalendarDateComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        if (!this.isReturning()) {
            this.window_onload();
        }
    };
    ServiceCoverCalendarDateComponent.prototype.BuildYearOptions = function () {
        var today = new Date();
        var yyyy = today.getFullYear();
        this.pageParams.yearList = [];
        for (var i = 1; i < 8; i++) {
            this.pageParams.yearList.push({ 'text': (yyyy - 5 + i), 'value': (yyyy - 5 + i) });
        }
        this.setControlValue('SelectedYear', yyyy);
    };
    ServiceCoverCalendarDateComponent.prototype.window_onload = function () {
        this.pageTitle = 'Service Cover Calendar';
        this.setErrorCallback(this);
        this.pageParams.blnChangesMade = false;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.BuildYearOptions();
        this.riExchange.getParentHTMLValue('ContractNumber');
        this.riExchange.getParentHTMLValue('ContractName');
        this.riExchange.getParentHTMLValue('PremiseNumber');
        this.riExchange.getParentHTMLValue('PremiseName');
        this.riExchange.getParentHTMLValue('ProductCode');
        this.riExchange.getParentHTMLValue('ProductDesc');
        this.riExchange.getParentHTMLValue('ServiceVisitFrequency');
        this.riExchange.getParentHTMLValue('CalendarUpdateAllowed');
        if (this.getControlValue('CalendarUpdateAllowed') === 'True') {
            this.pageParams['isUpdatable'] = true;
        }
        this.setControlValue('SCRowID', this.riExchange.getParentHTMLValue('ServiceCover'));
        this.BuildGrid();
    };
    ServiceCoverCalendarDateComponent.prototype.BuildGrid = function () {
        var iLoop = 1;
        this.riGrid.Clear();
        this.riGrid.AddColumn('Month', 'Visit', 'Month', MntConst.eTypeText, 20);
        for (iLoop = 1; iLoop < 32; iLoop++) {
            this.riGrid.AddColumn(iLoop.toString(), 'Visit', iLoop.toString(), MntConst.eTypeText, 1);
            this.riGrid.AddColumnAlign(iLoop.toString(), MntConst.eAlignmentCenter);
        }
        this.riGrid.AddColumn('Total', 'Visit', 'Total', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('Total', MntConst.eAlignmentCenter);
        this.riGrid.Complete();
        this.loadGridData();
    };
    ServiceCoverCalendarDateComponent.prototype.loadGridData = function () {
        var _this = this;
        var search = this.getURLSearchParamObject();
        this.ajaxSource.next(this.ajaxconstant.START);
        search.set(this.serviceConstants.Action, '2');
        search.set('SelectedDay', this.getControlValue('SelectedDay'));
        search.set('SelectedMonth', this.getControlValue('SelectedMonth'));
        search.set('SelectedYear', this.getControlValue('SelectedYear'));
        search.set('UpdateCalendar', this.getControlValue('UpdateCalendar'));
        search.set('SCRowID', this.getControlValue('SCRowID'));
        search.set(this.serviceConstants.PageSize, '10');
        search.set(this.serviceConstants.PageCurrent, this.pageCurrent);
        search.set(this.serviceConstants.GridMode, '0');
        search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        search.set(this.serviceConstants.GridCacheRefresh, 'True');
        search.set(this.serviceConstants.GridCacheRefresh, 'True');
        search.set(this.serviceConstants.GridHeaderClickedColumn, '');
        search.set(this.serviceConstants.GridSortOrder, '');
        search.set(this.serviceConstants.GridSortOrder, 'Descending');
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, search).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.displayError(data.errorMessage);
                return;
            }
            _this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
            _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
            _this.riGrid.Execute(data);
            _this.setControlValue('UpdateCalendar', '');
            _this.hasMoreEntered = false;
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.displayError(MessageConstant.Message.GeneralError, error);
        });
    };
    ServiceCoverCalendarDateComponent.prototype.showErrorModal = function (msg) {
        this.errorModal.show({ msg: msg, title: 'Error' }, false);
    };
    ServiceCoverCalendarDateComponent.prototype.onGridSuccess = function () {
        var currentMonth = (new Date()).getMonth() + 1;
        var additionalProperty = this.riGrid.HTMLGridBody.children[1].children[0].children[0].children[0].getAttribute('additionalProperty').split('|');
        document.querySelector('.gridtable tbody > tr:nth-child(' + currentMonth.toString() + ')').setAttribute('class', 'currentMonth');
        this.setControlValue('TotalVisits', additionalProperty[0]);
    };
    ServiceCoverCalendarDateComponent.prototype.onGridDoubleClick = function (data) {
        var selectedDay = this.riGrid.CurrentColumnName;
        var selectedMonth = this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'AdditionalProperty');
        var isClickable = selectedDay !== 'Total' && selectedDay !== 'Month';
        if (!isClickable || !this.pageParams['isUpdatable']) {
            return;
        }
        if (selectedMonth === '0') {
            this.displayError(this.errorMessages.earlierYear);
            return;
        }
        this.setControlValue('SelectedDay', selectedDay);
        this.setControlValue('SelectedMonth', selectedMonth);
        this.setControlValue('UpdateCalendar', 'True');
        this.pageParams.blnChangesMade = true;
        this.refresh();
    };
    ServiceCoverCalendarDateComponent.prototype.refresh = function () {
        this.riGrid.RefreshRequired();
        this.loadGridData();
    };
    ServiceCoverCalendarDateComponent.prototype.onSave = function () {
        var _this = this;
        var search = this.getURLSearchParamObject();
        var formData = {};
        if (this.getControlValue('ServiceVisitFrequency') === this.riExchange.riInputElement.GetValue(this.uiForm, 'TotalVisits')) {
            search.set(this.serviceConstants.Action, '6');
            formData['SelectedYear'] = this.getControlValue('SelectedYear');
            formData['Function'] = 'Save';
            formData['SCRowID'] = this.getControlValue('SCRowID');
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, search, formData).subscribe(function (data) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    _this.displayError(data.errorMessage);
                    return;
                }
                _this.location.back();
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.displayError(MessageConstant.Message.GeneralError, error);
            });
        }
        else {
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'TotalVisits', true);
            this.hasMoreEntered = true;
        }
    };
    ServiceCoverCalendarDateComponent.prototype.onCancel = function (routeAway, observer) {
        var _this = this;
        var search = this.getURLSearchParamObject();
        var formData = {};
        search.set(this.serviceConstants.Action, '6');
        formData['Function'] = 'Abandon';
        formData['SCRowID'] = this.getControlValue('SCRowID');
        this.setControlValue('TotalVisits', this.getControlValue('ServiceVisitFrequency'));
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, search, formData).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
            if (data.errorMessage) {
                _this.displayError(data.errorMessage);
                return;
            }
            if (!routeAway) {
                _this.location.back();
            }
            else {
                observer.next(true);
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
            observer.next(false);
            _this.displayError(MessageConstant.Message.GeneralError, error);
        });
    };
    ServiceCoverCalendarDateComponent.prototype.canDeactivate = function () {
        var _this = this;
        var isUpdated = this.getControlValue('ServiceVisitFrequency') === this.getControlValue('TotalVisits');
        this.routeAwayGlobals.setSaveEnabledFlag(!isUpdated);
        this.canDeactivateObservable = new Observable(function (observer) {
            _this.promptModal.saveEmit.subscribe(function (event) {
                _this.onCancel(true, observer);
            });
            _this.promptModal.cancelEmit.subscribe(function (event) {
                document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
                observer.next(false);
                setTimeout(function () {
                    _this.router.navigate([], { skipLocationChange: true, preserveQueryParams: true });
                }, 0);
            });
            if (!isUpdated) {
                _this.promptModal.show();
                return;
            }
            observer.next(true);
        });
        return this.canDeactivateObservable;
    };
    ServiceCoverCalendarDateComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverCalendarDateGrid.html'
                },] },
    ];
    ServiceCoverCalendarDateComponent.ctorParameters = [
        { type: Injector, },
    ];
    ServiceCoverCalendarDateComponent.propDecorators = {
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
    };
    return ServiceCoverCalendarDateComponent;
}(BaseComponent));
