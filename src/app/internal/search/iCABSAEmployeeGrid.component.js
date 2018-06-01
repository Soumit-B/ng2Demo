var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
export var EmployeeGridComponent = (function (_super) {
    __extends(EmployeeGridComponent, _super);
    function EmployeeGridComponent(injector) {
        _super.call(this, injector);
        this.injector = injector;
        this.controls = [
            { name: 'BranchNumber' },
            { name: 'SelEmployeeSurname' },
            { name: 'SelStatus' },
            { name: 'Branch' }
        ];
        this.curPage = 1;
        this.search = new URLSearchParams();
        this.pageSize = 10;
        this.isShowBranch = false;
        this.showHeader = true;
        this.modalTitle = '';
        this.status = '';
        this.employeeArray = [];
        this.RetEmployeeCodes = '';
        this.inputParamsBranchSearch = {
            'parentMode': ''
        };
        this.negBranchNumberSelected = {
            id: '',
            text: ''
        };
        this.queryParams = {
            operation: 'Application/iCABSAEmployeeGrid',
            module: 'employee',
            method: 'people/grid'
        };
        this.pageId = PageIdentifier.ICABSAEMPLOYEEGRID;
    }
    EmployeeGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.windowOnload();
    };
    EmployeeGridComponent.prototype.windowOnload = function () {
        this.setControlValue('SelEmployeeSurname', '');
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.FunctionPaging = false;
        this.riGrid.HighlightBar = true;
        this.riGrid.PageSize = 10;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.FunctionPaging = true;
        this.buildGrid();
        this.riGrid_BeforeExecute();
    };
    EmployeeGridComponent.prototype.lookupBranchName = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode,
                    'BranchNumber': this.utils.getBranchCode()
                },
                'fields': ['BranchName']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var Branch = data[0][0];
            if (Branch) {
                _this.negBranchNumberSelected = {
                    id: _this.branchSearch,
                    text: _this.branchSearch + ' - ' + Branch.BranchName
                };
            }
        });
    };
    EmployeeGridComponent.prototype.selStatusOnChange = function (data) {
        this.status = data;
        this.isShowBranch = false;
        this.branchSearch = this.utils.getBranchCode();
        this.lookupBranchName();
        if (data === 'SpecBra') {
            this.isShowBranch = true;
        }
    };
    EmployeeGridComponent.prototype.onBranchDataReturn = function (data) {
        this.branchSearch = data.BranchNumber;
    };
    EmployeeGridComponent.prototype.buildGrid = function () {
        this.riGrid.Clear();
        this.riGrid.AddColumn('EmployeeCode', 'Employee', 'EmployeCode', MntConst.eTypeText, 8, true);
        this.riGrid.AddColumn('EmployeeSurname', 'Employee', 'EmployeeSurname', MntConst.eTypeText, 20, true);
        this.riGrid.AddColumn('OccupationDesc', 'Employee', 'OccupationDesc', MntConst.eTypeText, 20, true);
        this.riGrid.AddColumn('DateLeft', 'Employee', 'DateLeft', MntConst.eTypeText, 20, true);
        this.riGrid.AddColumn('EmployeeSelect', 'Employee', 'EmployeeSelect', MntConst.eTypeCheckBox, 1, true);
        this.riGrid.AddColumnOrderable('EmployeeCode', true);
        this.riGrid.AddColumnOrderable('EmployeeSurname', true);
        this.riGrid.AddColumnOrderable('OccupationDesc', true);
        this.riGrid.AddColumnOrderable('DateLeft', true);
        this.riGrid.AddColumnOrderable('EmployeeSelect', true);
        this.riGrid.Complete();
    };
    EmployeeGridComponent.prototype.riGrid_BeforeExecute = function () {
        var _this = this;
        var gridParams = new URLSearchParams();
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.countryCode());
        gridParams.set('Status', this.status ? this.status : 'AllEmp');
        gridParams.set('BranchNumber', this.branchSearch ? this.branchSearch : this.utils.getBranchCode());
        gridParams.set('EmployeeSurname', this.getControlValue('SelEmployeeSurname'));
        gridParams.set('RetEmployeeCodes', this.RetEmployeeCodes ? this.RetEmployeeCodes : '');
        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.GridHandle, '1246324');
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        var sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        gridParams.set('riSortOrder', sortOrder);
        gridParams.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(function (data) {
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
    EmployeeGridComponent.prototype.getCurrentPage = function (currentPage) {
        this.curPage = currentPage.value;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    };
    EmployeeGridComponent.prototype.refresh = function () {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    EmployeeGridComponent.prototype.riGrid_Sort = function (event) {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    EmployeeGridComponent.prototype.riGrid_BodyOnDblClick = function (ev) {
        if (this.parentMode === 'EmployeeMaintenanceSearch') {
        }
    };
    EmployeeGridComponent.prototype.tbodyEmployeeSearchGrid_onClick = function (ev) {
        this.updateEvents(ev);
    };
    EmployeeGridComponent.prototype.updateEvents = function (ev) {
        var selectedEmployeeCode = '';
        switch (this.riGrid.CurrentColumnName) {
            case 'EmployeeSelect':
                var vEmployeeSelect = this.riGrid.Details.GetValue('EmployeeCode');
                if (this.employeeArray.indexOf(vEmployeeSelect) === -1) {
                    this.employeeArray.push(vEmployeeSelect);
                }
                else {
                    this.employeeArray.splice(this.employeeArray.indexOf(vEmployeeSelect), 1);
                }
                this.RetEmployeeCodes = this.employeeArray.join(';');
                break;
        }
    };
    EmployeeGridComponent.prototype.selectedEmployeeCode = function (data) {
        this.riExchange.setParentAttributeValue('LinkedEmployees', this.RetEmployeeCodes);
        if (this.ellipsis) {
            this.ellipsis.sendDataToParent(this.RetEmployeeCodes);
        }
    };
    EmployeeGridComponent.prototype.employeeSurNameOnChange = function (data) {
        this.setControlValue('SelEmployeeSurname', data);
    };
    EmployeeGridComponent.prototype.updateView = function (data) {
        this.employeeArray = [];
        this.employeeGridPagination.setPage(1);
        this.riGrid.RefreshRequired();
        this.curPage = 1;
        this.riGrid_BeforeExecute();
        this.ellipsis = this.injector.get(EllipsisComponent);
    };
    EmployeeGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAEmployeeGrid.html'
                },] },
    ];
    EmployeeGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    EmployeeGridComponent.propDecorators = {
        'employeeGrid': [{ type: ViewChild, args: ['employeeGrid',] },],
        'employeeGridPagination': [{ type: ViewChild, args: ['employeeGridPagination',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
    };
    return EmployeeGridComponent;
}(BaseComponent));
