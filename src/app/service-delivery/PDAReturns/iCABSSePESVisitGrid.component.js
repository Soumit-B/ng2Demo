var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, ViewChild, Injector, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
export var SePESVisitGridComponent = (function (_super) {
    __extends(SePESVisitGridComponent, _super);
    function SePESVisitGridComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [
            { name: 'BranchNumber', readonly: false, disabled: false, required: false },
            { name: 'BranchName', readonly: false, disabled: false, required: false },
            { name: 'EmployeeCode', readonly: false, disabled: false, required: false },
            { name: 'EmployeeSurname', readonly: false, disabled: false, required: false },
            { name: 'DateFrom', readonly: true, disabled: false, required: false },
            { name: 'DateTo', readonly: true, disabled: false, required: false },
            { name: 'SupervisorEmployeeCode', readonly: false, disabled: false, required: false },
            { name: 'SupervisorSurname', readonly: false, disabled: false, required: false },
            { name: 'ShowInvalidEmployeeCodes', readonly: false, disabled: false, required: false },
            { name: 'Level', readonly: false, disabled: false, required: false },
            { name: 'BusinessCode', readonly: false, disabled: true, required: false },
            { name: 'BusinessDesc', readonly: false, disabled: true, required: false }
        ];
        this.setFocusDateFrom = new EventEmitter();
        this.tdBranchDisplay = true;
        this.grdPESVisit = {};
        this.DateTo = new Date();
        this.Date = new Date();
        this.dateReadOnly = false;
        this.search = new URLSearchParams();
        this.riGrid = {};
        this.pageSize = 30;
        this.itemsPerPage = 15;
        this.currentPage = 1;
        this.totalItems = 10;
        this.maxColumn = 15;
        this.selectedRow = -1;
        this.ellipseConfig = {
            empSearchComponent: {
                inputParams: {
                    parentMode: 'LookUp-Service-All',
                    businessCode: this.utils.getBusinessCode(),
                    countryCode: this.utils.getCountryCode()
                },
                isDisabled: false,
                isRequired: false,
                showCloseButton: true,
                config: {
                    ignoreBackdropClick: true
                },
                showHeader: true
            },
            empSupervisorSearchComponent: {
                inputParams: {
                    parentMode: 'LookUp-Supervisor',
                    businessCode: this.utils.getBusinessCode(),
                    countryCode: this.utils.getCountryCode()
                },
                isDisabled: false,
                isRequired: false,
                showCloseButton: true,
                config: {
                    ignoreBackdropClick: true
                },
                showHeader: true
            }
        };
        this.empSearchComponent = EmployeeSearchComponent;
        this.pageVariables = {
            savecancelFlag: true,
            isRequesting: false
        };
        this.xhrParams = {
            method: 'service-delivery/grid',
            module: 'pda',
            operation: 'Service/iCABSSePESVisitGrid'
        };
        this.promptConfig = {
            forSave: {
                showPromptMessageHeader: true,
                promptConfirmTitle: '',
                promptConfirmContent: MessageConstant.Message.ConfirmRecord
            },
            promptFlag: 'save',
            config: {
                ignoreBackdropClick: true
            },
            isRequesting: false
        };
        this.messageModalConfig = {
            showMessageHeader: true,
            config: {
                ignoreBackdropClick: true
            },
            title: '',
            content: '',
            showCloseButton: true
        };
        this.pageId = PageIdentifier.ICABSSEPESVISITGRID;
    }
    SePESVisitGridComponent.prototype.empSearchDataReceived = function (eventObj) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', eventObj.EmployeeCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', eventObj.EmployeeSurname);
    };
    SePESVisitGridComponent.prototype.empSupervisorSearchDataReceived = function (eventObj) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SupervisorEmployeeCode', eventObj.SupervisorEmployeeCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SupervisorSurname', eventObj.SupervisorSurname);
    };
    SePESVisitGridComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Unprocessed Sync Visits';
        this.initForm();
        this.uiFormValueChanges = this.uiForm.statusChanges.subscribe(function (value) {
            _this.formChanges(value);
        });
        this.window_onload();
        this.buildGrid();
    };
    SePESVisitGridComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        this.uiFormValueChanges.unsubscribe();
    };
    SePESVisitGridComponent.prototype.formChanges = function (obj) {
        if (obj === 'VALID') {
            this.pageVariables.savecancelFlag = false;
        }
        else {
            this.pageVariables.savecancelFlag = true;
        }
    };
    SePESVisitGridComponent.prototype.initForm = function () {
        this.riExchange.renderForm(this.uiForm, this.controls);
    };
    SePESVisitGridComponent.prototype.myDateFormat = function () {
        var dateFrom = new Date(new Date().setDate(1));
        return dateFrom;
    };
    SePESVisitGridComponent.prototype.promptConfirm = function (eventObj) {
        switch (this.promptConfig.promptFlag) {
            case 'save':
                break;
            default:
                break;
        }
    };
    SePESVisitGridComponent.prototype.promptCancel = function (eventObj) {
        switch (this.promptConfig.promptFlag) {
            case 'save':
                break;
            default:
                break;
        }
    };
    SePESVisitGridComponent.prototype.messageModalClose = function () {
    };
    SePESVisitGridComponent.prototype.window_onload = function () {
        var _this = this;
        this.DateFrom = this.myDateFormat();
        this.riExchange.riInputElement.Disable(this.uiForm, 'BusinessCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BusinessDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BranchNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BranchName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'EmployeeSurname');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SupervisorSurname');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessCode', this.utils.getBusinessCode());
        this.utils.getBusinessDesc(this.utils.getBusinessCode(), this.countryCode()).subscribe(function (data) {
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BusinessDesc', data.BusinessDesc);
        });
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchNumber', this.utils.getBranchCode());
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchName', this.utils.getBranchText());
        if (this.riExchange.URLParameterContains('Business')) {
            this.uiForm.controls['Level'].setValue('Business');
            this.tdBranchDisplay = false;
        }
        else {
            this.uiForm.controls['Level'].setValue('Branch');
            this.tdBranchDisplay = true;
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', this.DateFrom);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', this.DateTo);
        this.setFocusDateFrom.emit(true);
        this.uiForm.controls['BusinessCode'].setValue(this.utils.getBusinessCode());
        this.uiForm.controls['BusinessDesc'].setValue(this.utils.getBusinessDesc(this.utils.getBusinessCode()));
    };
    SePESVisitGridComponent.prototype.validateScreenParameters = function () {
        var blnReturn = true;
        if (!(this.isDate(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom')))) {
            blnReturn = false;
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom', true);
        }
        if (!(this.isDate(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo')))) {
            blnReturn = false;
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo', true);
        }
        return blnReturn;
    };
    SePESVisitGridComponent.prototype.isDate = function (date) {
        var val = new Date(date).toString();
        var isDate;
        if (val !== 'Invalid Date')
            isDate = true;
        else
            isDate = false;
        return isDate;
    };
    SePESVisitGridComponent.prototype.dateFromSelectedValue = function (value) {
        if (value && value.value) {
            try {
                var dateArr = value.value.split('/');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', value.value);
                this.dtNewToDate = value.value;
                this.dateToOnChange();
            }
            catch (errorHandler) {
                var DateFrom = new Date(Date.parse(value.value));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', DateFrom);
            }
        }
    };
    SePESVisitGridComponent.prototype.dateToSelectedValue = function (value) {
        if (value && value.value) {
            try {
                var dateArr = value.value.split('/');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', value.value);
                this.dtNewToDate = value.value;
                this.dateToOnChange();
            }
            catch (errorHandler) {
                var DateTo = new Date(Date.parse(value.value));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', DateTo);
            }
        }
    };
    SePESVisitGridComponent.prototype.dateFromOnChange = function () {
        this.refresh();
    };
    SePESVisitGridComponent.prototype.dateToOnChange = function () {
        this.refresh();
    };
    SePESVisitGridComponent.prototype.buildGrid = function () {
        this.sePESVisitGrid.clearGridData();
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        console.log('**********Level value', this.uiForm.controls['Level'].value);
        this.search.set('Level', this.uiForm.controls['Level'].value);
        this.search.set('BranchNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchNumber'));
        this.search.set('EmployeeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode'));
        this.search.set('SupervisorEmployeeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'SupervisorEmployeeCode'));
        this.search.set('ShowInvalidEmployeeCodes', this.riExchange.riInputElement.GetValue(this.uiForm, 'ShowInvalidEmployeeCodes'));
        this.search.set('DateFrom', this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom'));
        this.search.set('DateTo', this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo'));
        this.search.set(this.serviceConstants.PageSize, (this.itemsPerPage - 1).toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '5309970');
        this.xhrParams.search = this.search;
        this.sePESVisitGrid.loadGridData(this.xhrParams);
    };
    SePESVisitGridComponent.prototype.riExchangeUpDateHTMLDocument = function () {
        this.riGrid.update = true;
        this.refresh();
    };
    SePESVisitGridComponent.prototype.selectedRowFocus = function (rsrcElement) {
        this.grdPESVisit.Row = this.riGrid.rowIndex;
        if (this.riGrid.headerTitle === 'BranchNumber') {
            this.grdPESVisit.PESVisitRowID = this.riGrid.cellData.rowID;
        }
    };
    SePESVisitGridComponent.prototype.branchNumberOnChange = function (obj) {
    };
    SePESVisitGridComponent.prototype.employeeCodeOnChange = function (obj) {
        if ((this.uiForm.controls['EmployeeCode'].value === '') || (this.uiForm.controls['EmployeeCode'].value === null)) {
            this.uiForm.controls['EmployeeSurname'].setValue('');
        }
    };
    SePESVisitGridComponent.prototype.supervisorCodeOnChange = function (obj) {
        if ((this.uiForm.controls['SupervisorEmployeeCode'].value === '') || (this.uiForm.controls['SupervisorEmployeeCode'].value === null)) {
            this.uiForm.controls['SupervisorSurname'].setValue('');
        }
    };
    SePESVisitGridComponent.prototype.gridOnDblClick = function (data) {
    };
    SePESVisitGridComponent.prototype.getGridInfo = function (data) {
        if (data.totalPages > 0) {
            if (data.totalRows === 0) {
                this.totalItems = 0;
            }
            else {
                this.totalItems = data.totalPages * this.pageSize;
                if (this.selectedRow === -1) {
                    this.sePESVisitGrid.onCellClick(0, 0);
                }
                else {
                    this.sePESVisitGrid.onCellClick(this.selectedRow, 0);
                }
            }
        }
    };
    SePESVisitGridComponent.prototype.sortGridInfo = function (data) {
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, data.fieldname);
        this.search.set(this.serviceConstants.GridSortOrder, data.sort === 'DESC' ? 'Descending' : 'Ascending');
        this.refresh();
    };
    SePESVisitGridComponent.prototype.getCurrentPage = function (currentPage) {
        this.selectedRow = -1;
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.refresh();
    };
    SePESVisitGridComponent.prototype.refresh = function () {
        this.sePESVisitGrid.clearGridData();
        this.buildGrid();
    };
    SePESVisitGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSePESVisitGrid.html'
                },] },
    ];
    SePESVisitGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    SePESVisitGridComponent.propDecorators = {
        'sePESVisitGrid': [{ type: ViewChild, args: ['sePESVisitGrid',] },],
        'sePESVisitGridPagination': [{ type: ViewChild, args: ['sePESVisitGridPagination',] },],
        'promptConfirmModal': [{ type: ViewChild, args: ['promptConfirmModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return SePESVisitGridComponent;
}(BaseComponent));
