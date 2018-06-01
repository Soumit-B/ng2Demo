var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from './../../../base/BaseComponent';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { EmployeeSearchComponent } from '../../../internal/search/iCABSBEmployeeSearch';
export var EmailGridComponent = (function (_super) {
    __extends(EmailGridComponent, _super);
    function EmailGridComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.pageTitle = '';
        this.search = new URLSearchParams();
        this.queryParams = {
            operation: 'Business/iCABSBEmailGrid',
            module: 'notification',
            method: 'it-functions/maintenance'
        };
        this.inputParams = {};
        this.isFormValid = false;
        this.serviceCoverRowID = '';
        this.DateTo = new Date();
        this.controls = [
            { name: 'EmployeeCode', readonly: false, disabled: false, required: false },
            { name: 'EmployeeSurname', readonly: true, disabled: true, required: false },
            { name: 'DateFrom', readonly: false, disabled: false, required: true },
            { name: 'DateTo', readonly: false, disabled: false, required: true },
            { name: 'selectStatus', readonly: false, disabled: false, required: true, value: 'Created' },
            { name: 'selectDestination', readonly: false, disabled: false, required: true, value: 'I' }
        ];
        this.showErrorHeader = true;
        this.showHeader = true;
        this.itemsPerPage = 11;
        this.currentPage = 1;
        this.totalItems = 10;
        this.maxColumn = 5;
        this.dateObjects = {};
        this.fromDateDisplay = '';
        this.toDateDisplay = '';
        this.employeeSearchComponent = EmployeeSearchComponent;
        this.ellipsisQueryParams = {
            inputParamsemployee: {
                parentMode: 'LookUp'
            }
        };
        this.gridSearch = new URLSearchParams();
        this.pageId = PageIdentifier.ICABSBEMAILGRID;
    }
    EmailGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.visiblePagination = true;
        this.pageTitle = 'Email Notification Message Grid';
        this.DateTo = new Date();
        this.toDateDisplay = this.utils.formatDate(this.DateTo);
        var today = new Date();
        var subtractdate = today.getDate() - 28;
        this.DateFrom = new Date(new Date().setDate(subtractdate));
        this.fromDateDisplay = this.utils.formatDate(this.DateFrom);
        this.buildGrid();
    };
    EmailGridComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    EmailGridComponent.prototype.onEmployeeDataReceived = function (data) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', data['EmployeeCode']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', data['EmployeeSurname']);
        this.setFormMode(this.c_s_MODE_UPDATE);
    };
    EmailGridComponent.prototype.fetchAPIDetails = function (event) {
        var _this = this;
        if (!this.getControlValue('EmployeeCode')) {
            this.setControlValue('EmployeeSurname', '');
            this.setFormMode(this.c_s_MODE_SELECT);
        }
        else {
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set('EmployeeCode', this.getControlValue('EmployeeCode'));
            this.search.set('Function', 'GetEmployeeName');
            this.queryParams.search = this.search;
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search)
                .subscribe(function (e) {
                if (e.status === 'failure') {
                    _this.errorService.emitError(e.oResponse);
                }
                else {
                    if (e.errorMessage && e.errorMessage !== '') {
                        _this.errorService.emitError(e);
                    }
                    else {
                        _this.messageService.emitMessage(e);
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EmployeeSurname', e.EmployeeSurname);
                        if (_this.getControlValue('EmployeeCode'))
                            _this.setFormMode(_this.c_s_MODE_UPDATE);
                    }
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.errorMessage = error;
                _this.errorService.emitError(error);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    EmailGridComponent.prototype.dateFromSelectedValue = function (value) {
        if (value && value.value) {
            this.fromDateDisplay = value.value;
        }
        else {
            this.fromDateDisplay = '';
        }
    };
    EmailGridComponent.prototype.dateToSelectedValue = function (value) {
        if (value && value.value) {
            this.toDateDisplay = value.value;
        }
        else {
            this.toDateDisplay = '';
        }
    };
    EmailGridComponent.prototype.buildGrid = function () {
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.gridSearch.set(this.serviceConstants.Action, '2');
        this.gridSearch.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.gridSearch.set(this.serviceConstants.CountryCode, this.countryCode());
        this.gridSearch.set('BranchNumber', '3');
        this.gridSearch.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        this.gridSearch.set('Status', this.getControlValue('selectStatus'));
        this.gridSearch.set('DateFrom', this.fromDateDisplay);
        this.gridSearch.set('DateTo', this.toDateDisplay);
        this.gridSearch.set('EmailDestinationType', this.getControlValue('selectDestination'));
        this.gridSearch.set('riGridMode', '0');
        this.gridSearch.set('riGridHandle', '30606786');
        this.gridSearch.set('riCacheRefresh', 'True');
        this.gridSearch.set('PageSize', this.itemsPerPage.toString());
        this.gridSearch.set('PageCurrent', this.currentPage.toString());
        this.gridSearch.set('riSortOrder', 'Descending');
        this.gridSearch.set('HeaderClickedColumn', '');
        this.inputParams.search = this.gridSearch;
        this.emailGrid.loadGridData(this.inputParams);
    };
    EmailGridComponent.prototype.getGridInfo = function (value) {
        if (value.totalRows !== undefined) {
            if (value.totalRows === 0)
                this.visiblePagination = false;
            else
                this.visiblePagination = true;
            this.emailPagination.totalItems = value.totalRows;
        }
    };
    EmailGridComponent.prototype.getCurrentPage = function (data) {
        this.currentPage = data.value;
        this.buildGrid();
    };
    EmailGridComponent.prototype.refresh = function () {
        this.currentPage = 1;
        if (this.utils.convertDate(this.fromDateDisplay).getTime() > this.utils.convertDate(this.toDateDisplay).getTime()) {
            this.messageModal.show({ msg: this.fromDateDisplay + '>' + this.toDateDisplay }, false);
        }
        else {
            this.buildGrid();
        }
    };
    EmailGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBEmailGrid.html'
                },] },
    ];
    EmailGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    EmailGridComponent.propDecorators = {
        'emailGrid': [{ type: ViewChild, args: ['emailGrid',] },],
        'emailPagination': [{ type: ViewChild, args: ['emailPagination',] },],
        'emailEllipsis': [{ type: ViewChild, args: ['emailEllipsis',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return EmailGridComponent;
}(BaseComponent));
