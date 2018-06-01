var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { EmployeeSearchComponent } from './../../../internal/search/iCABSBEmployeeSearch';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
export var TechnicianWorkSummaryComponent = (function (_super) {
    __extends(TechnicianWorkSummaryComponent, _super);
    function TechnicianWorkSummaryComponent(injector) {
        _super.call(this, injector);
        this.queryParams = {
            operation: 'Service/iCABSSeTechnicianWorkSummaryGrid',
            module: 'pda',
            method: 'service-delivery/maintenance'
        };
        this.pageId = '';
        this.itemsPerPage = 10;
        this.DateTo = new Date();
        this.DateFrom = new Date(new Date().setDate(1));
        this.currentPage = 1;
        this.totalItems = 10;
        this.search = this.getURLSearchParamObject();
        this.sCEnableDurations = false;
        this.sCEnableReceiptRequired = false;
        this.vSCEnableReceiptRequired = false;
        this.trBusiness = false;
        this.trBranch = false;
        this.ShowDetailIndCheck = false;
        this.isDateDateFrom = true;
        this.isDateDateTo = true;
        this.showErrorHeader = true;
        this.showHeader = true;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.totalRecords = 1;
        this.pageCurrent = 1;
        this.showCloseButton = true;
        this.controls = [
            { name: 'Level', readonly: false, disabled: false, required: false },
            { name: 'BusinessCode', readonly: true, disabled: false, required: false },
            { name: 'BusinessDesc', readonly: true, disabled: false, required: false },
            { name: 'BranchNumber', readonly: true, disabled: true, required: false },
            { name: 'BranchName', readonly: true, disabled: true, required: false },
            { name: 'EmployeeCode', readonly: false, disabled: false, required: false },
            { name: 'EmployeeSurname', readonly: true, disabled: true, required: false },
            { name: 'SupervisorEmployeeCode', readonly: false, disabled: false, required: false },
            { name: 'SupervisorSurname', readonly: true, disabled: true, required: false },
            { name: 'DateFrom', readonly: false, disabled: false, required: false },
            { name: 'DateTo', readonly: false, disabled: false, required: false },
            { name: 'ShowDetailInd', readonly: false, disabled: false, required: false }
        ];
        this.ellipsis = {
            employeeSearchComponentSuper: {
                disabled: true,
                showCloseButton: true,
                showHeader: true,
                childparams: {
                    'parentMode': 'LookUp-Supervisor'
                },
                component: EmployeeSearchComponent
            },
            employeeSearchComponent: {
                disabled: true,
                showCloseButton: true,
                showHeader: true,
                childparams: {
                    'parentMode': 'LookUp-Service-All'
                },
                component: EmployeeSearchComponent
            }
        };
        this.pageId = PageIdentifier.ICABSSETECHNICIANWORKSUMMARYGRID;
    }
    TechnicianWorkSummaryComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.getSysCharDtetails();
    };
    TechnicianWorkSummaryComponent.prototype.window_onload = function () {
        this.logger.warn('window onload', this.pageParams.vSCEnableReceiptRequired);
        this.sCEnableDurations = true;
        if (this.pageParams.vSCEnableReceiptRequired) {
            this.sCEnableReceiptRequired = true;
        }
        else {
            this.sCEnableReceiptRequired = false;
        }
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.FunctionUpdateSupport = true;
        this.riGrid.PageSize = 10;
        if (this.formData.DateFrom || this.formData.DateTo || this.formData.ShowDetailInd) {
            var getFromDate = this.formData.DateFrom;
            if (window['moment'](getFromDate, 'DD/MM/YYYY', true).isValid()) {
                getFromDate = this.utils.convertDate(getFromDate);
            }
            else {
                getFromDate = this.utils.formatDate(getFromDate);
            }
            this.DateFrom = new Date(getFromDate);
            var getToDate = this.formData.DateTo;
            if (window['moment'](getToDate, 'DD/MM/YYYY', true).isValid()) {
                getToDate = this.utils.convertDate(getToDate);
            }
            else {
                getToDate = this.utils.formatDate(getToDate);
            }
            this.DateTo = new Date(getToDate);
            this.populateUIFromFormData();
            if (this.formData.ShowDetailInd) {
                this.ShowDetailIndCheck = true;
            }
            this.riGrid.ResetGrid();
            this.BuildGrid();
        }
        this.FromdtDisplayed = this.utils.formatDate(this.DateFrom);
        this.setControlValue('DateFrom', this.FromdtDisplayed);
        this.TodtDisplayed = this.utils.formatDate(new Date(this.DateTo));
        this.setControlValue('DateTo', this.TodtDisplayed);
        if (this.FromdtDisplayed === '' || this.FromdtDisplayed === null || this.FromdtDisplayed === undefined) {
            this.isDateDateFrom = false;
        }
        else {
            this.isDateDateFrom = true;
        }
        if (this.TodtDisplayed === '' || this.TodtDisplayed === null || this.TodtDisplayed === undefined) {
            this.isDateDateTo = false;
        }
        else {
            this.isDateDateTo = true;
        }
        this.validateScreenParameters();
        this.pageTitle = 'Servicing Work Summary';
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessCode', this.utils.getBusinessCode());
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessDesc', this.utils.getBusinessDesc(this.utils.getBusinessCode(), this.utils.getCountryCode()));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchNumber', this.utils.getBranchCode());
        if (this.riExchange.URLParameterContains('Business')) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Level', 'Business');
            this.trBusiness = true;
            this.trBranch = false;
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Level', 'Branch');
            this.trBusiness = false;
            this.trBranch = true;
        }
        switch (this.parentMode) {
            case 'Productivity':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', this.riExchange.getParentHTMLValue('EmployeeSurname'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', this.riExchange.getParentHTMLValue('DateFrom'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', this.riExchange.getParentHTMLValue('DateTo'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchNumber', this.riExchange.getParentHTMLValue('BranchNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchName', this.riExchange.getParentHTMLValue('BranchName'));
                this.riExchange.riInputElement.ReadOnly(this.uiForm, 'EmployeeCode', true);
                this.riExchange.riInputElement.ReadOnly(this.uiForm, 'SupervisorEmployeeCode', true);
                this.riExchange.riInputElement.ReadOnly(this.uiForm, 'DateFrom', true);
                this.riExchange.riInputElement.ReadOnly(this.uiForm, 'DateTo', true);
                break;
            case 'OvertimeEmployee':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', this.riExchange.getParentAttributeValue('EmployeeCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', this.riExchange.getParentAttributeValue('EmployeeSurname'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SupervisorEmployeeCode', this.riExchange.getParentAttributeValue('SupervisorEmployeeCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SupervisorSurname', this.riExchange.getParentAttributeValue('SupervisorSurname'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', this.riExchange.getParentAttributeValue('DateFrom'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', this.riExchange.getParentAttributeValue('DateTo'));
                break;
        }
        this.doLookupformDataEmployee();
        this.doLookupformDataEmployeeSuper();
        this.doLookupformDataBranch();
        document.querySelector('.datepicker-input-cont input[type=text]')['focus']();
    };
    TechnicianWorkSummaryComponent.prototype.fromDateSelectedValue = function (value) {
        if (value && value.value) {
            this.FromdtDisplayed = value.value;
            this.setControlValue('DateFrom', this.FromdtDisplayed);
            this.isDateDateFrom = true;
        }
        else {
            this.FromdtDisplayed = '';
            this.setControlValue('DateFrom', this.FromdtDisplayed);
            this.isDateDateFrom = false;
        }
    };
    TechnicianWorkSummaryComponent.prototype.toDateSelectedValue = function (value) {
        if (value && value.value) {
            this.TodtDisplayed = value.value;
            this.setControlValue('DateTo', this.TodtDisplayed);
            this.isDateDateTo = true;
        }
        else {
            this.TodtDisplayed = '';
            this.setControlValue('DateTo', this.TodtDisplayed);
            this.isDateDateTo = false;
        }
    };
    TechnicianWorkSummaryComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableReceiptRequired];
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
            _this.pageParams.vSCEnableReceiptRequired = record[0]['Required'];
            _this.window_onload();
        });
    };
    TechnicianWorkSummaryComponent.prototype.onCheckboxChange = function (event) {
        if (event.target.checked) {
            this.ShowDetailIndCheck = true;
        }
        else {
            this.ShowDetailIndCheck = false;
        }
    };
    TechnicianWorkSummaryComponent.prototype.validateScreenParameters = function () {
        var blnReturn = 'True';
        if (this.isDateDateFrom === false) {
            blnReturn = 'False';
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, this.FromdtDisplayed, true);
        }
        if (this.isDateDateTo === false) {
            blnReturn = 'False';
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, this.TodtDisplayed, true);
        }
        this.ValidateScreenParameters = blnReturn;
        return this.ValidateScreenParameters;
    };
    TechnicianWorkSummaryComponent.prototype.getCurrentPage = function (currentPage) {
        this.pageCurrent = currentPage.value;
        this.loadData();
    };
    TechnicianWorkSummaryComponent.prototype.refresh = function () {
        this.riGrid.ResetGrid();
        this.BuildGrid();
        this.validateScreenParameters();
        this.currentPage = 1;
    };
    TechnicianWorkSummaryComponent.prototype.riGrid_Sort = function (event) {
        this.loadData();
    };
    TechnicianWorkSummaryComponent.prototype.loadData = function () {
        var _this = this;
        this.riGrid.Update = false;
        this.riGrid.UpdateBody = false;
        this.riGrid.UpdateFooter = false;
        this.riGrid.UpdateHeader = false;
        if (this.ValidateScreenParameters === 'True') {
            this.BusinessObjectPostData = {
                Level: this.riExchange.riInputElement.GetValue(this.uiForm, 'Level'),
                BranchNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchNumber'),
                DateFrom: this.FromdtDisplayed,
                DateTo: this.TodtDisplayed,
                EmployeeCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode'),
                SupervisorEmployeeCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'SupervisorEmployeeCode'),
                ShowDetailInd: this.ShowDetailIndCheck
            };
        }
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set('Level', this.riExchange.riInputElement.GetValue(this.uiForm, 'Level'));
        this.search.set('BranchNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchNumber'));
        this.search.set('DateFrom', this.FromdtDisplayed);
        this.search.set('DateTo', this.TodtDisplayed);
        this.search.set('EmployeeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode'));
        this.search.set('SupervisorEmployeeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'SupervisorEmployeeCode'));
        this.search.set('ShowDetailInd', this.ShowDetailIndCheck);
        this.search.set(this.serviceConstants.PageSize, (this.itemsPerPage).toString());
        this.search.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '4195362');
        this.search.set('riSortOrder', 'Descending');
        this.search.set('HeaderClickedColumn', '');
        this.search.set('riCacheRefresh', 'True');
        this.queryParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryParams.search)
            .subscribe(function (data) {
            if (data) {
                try {
                    _this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                    _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    _this.riGrid.Update = true;
                    _this.riGrid.UpdateBody = true;
                    _this.riGrid.UpdateHeader = true;
                    _this.riGrid.UpdateFooter = true;
                    if (data && data.errorMessage) {
                        _this.messageModal.show(data['errorMessage'], true);
                    }
                    else {
                        _this.riGrid.Execute(data);
                    }
                }
                catch (e) {
                    _this.logger.log('Problem in grid load', e);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.isRequesting = false;
        }, function (error) {
            _this.messageModal.show(error, true);
            _this.totalRecords = 1;
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.isRequesting = false;
        });
    };
    TechnicianWorkSummaryComponent.prototype.doLookupformDataEmployee = function () {
        var _this = this;
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode') !== '' || this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode') !== null || this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode') !== undefined) {
            this.searchGet = this.getURLSearchParamObject();
            this.searchGet.set(this.serviceConstants.Action, '0');
            this.searchGet.set('PostDesc', 'Employee');
            this.searchGet.set('EmployeeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode'));
            this.ajaxSource.next(this.ajaxconstant.START);
            this.isRequesting = true;
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.searchGet)
                .subscribe(function (e) {
                if (e.errorMessage) {
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'EmployeeCode')) {
                        _this.showAlert('Employee Data: ' + e.errorMessage);
                    }
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EmployeeCode', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EmployeeSurname', '');
                }
                else {
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'EmployeeCode') && e.EmployeeSurname === '') {
                        _this.showAlert('Employee Data: Record Not Found');
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EmployeeCode', '');
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EmployeeSurname', '');
                    }
                    else {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EmployeeSurname', e.EmployeeSurname);
                    }
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.isRequesting = false;
            }, function (error) {
                _this.showAlert('Employee Data:' + error.errorMessage);
            });
        }
    };
    TechnicianWorkSummaryComponent.prototype.doLookupformDataBranch = function () {
        var _this = this;
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchNumber') !== '' || this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchNumber') !== null || this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchNumber') !== undefined) {
            this.searchGet = this.getURLSearchParamObject();
            this.searchGet.set(this.serviceConstants.Action, '0');
            this.searchGet.set('PostDesc', 'Branch');
            this.searchGet.set('BranchNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchNumber'));
            this.ajaxSource.next(this.ajaxconstant.START);
            this.isRequesting = true;
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.searchGet)
                .subscribe(function (e) {
                if (e.errorMessage) {
                    _this.showAlert('BranchName: ' + e.errorMessage);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchNumber', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchName', '');
                }
                else {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchName', e.BranchName);
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.isRequesting = false;
            }, function (error) {
                _this.showAlert('BranchName:' + error.errorMessage);
            });
        }
    };
    TechnicianWorkSummaryComponent.prototype.showAlert = function (msgTxt, type) {
        var titleModal = '';
        if (typeof type === 'undefined')
            type = 0;
        switch (type) {
            default:
            case 0:
                titleModal = 'Error Message';
                break;
            case 1:
                titleModal = 'Success Message';
                break;
            case 2:
                titleModal = 'Warning Message';
                break;
        }
        this.messageModal.show({ msg: msgTxt, title: titleModal }, false);
    };
    TechnicianWorkSummaryComponent.prototype.doLookupformDataEmployeeSuper = function () {
        var _this = this;
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'SupervisorEmployeeCode') !== '' || this.riExchange.riInputElement.GetValue(this.uiForm, 'SupervisorEmployeeCode') !== null || this.riExchange.riInputElement.GetValue(this.uiForm, 'SupervisorEmployeeCode') !== undefined) {
            this.searchGetSuper = this.getURLSearchParamObject();
            this.searchGetSuper.set(this.serviceConstants.Action, '0');
            this.searchGetSuper.set('PostDesc', 'SupervisorEmployee');
            this.searchGetSuper.set('SupervisorEmployeeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'SupervisorEmployeeCode'));
            this.ajaxSource.next(this.ajaxconstant.START);
            this.isRequesting = true;
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.searchGetSuper)
                .subscribe(function (e) {
                if (e.errorMessage) {
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'SupervisorEmployeeCode')) {
                        _this.showAlert('Supervisor Employee Data: ' + e.errorMessage);
                    }
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SupervisorEmployeeCode', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SupervisorSurname', '');
                }
                else {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SupervisorSurname', e.SupervisorSurname);
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.isRequesting = false;
            }, function (error) {
                _this.showAlert('Supervisor Employee Data: ' + error.errorMessage);
            });
        }
    };
    TechnicianWorkSummaryComponent.prototype.onEmployeeDataReceived = function (data, employeeCode, employeeSurname, occupationDesc) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', data.EmployeeCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', data.EmployeeSurname);
        }
    };
    TechnicianWorkSummaryComponent.prototype.onEmployeeDataReceivedSuper = function (data, employeeCode, employeeSurname, occupationDesc) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SupervisorEmployeeCode', data.SupervisorEmployeeCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SupervisorSurname', data.SupervisorSurname);
        }
    };
    TechnicianWorkSummaryComponent.prototype.setContractType = function (event) {
        if (this.riGrid.CurrentColumnName !== 'PremiseContactSignature') {
            this.attributes.BranchNumberPDAICABSActivityRowID = this.riGrid.Details.GetAttribute('ActivityDesc', 'additionalproperty');
            this.attributes.grdWorkSummaryPDAICABSActivityRowID = this.riGrid.Details.GetAttribute('ActivityDesc', 'additionalproperty');
        }
        switch (this.riGrid.Details.GetAttribute('PremiseName', 'additionalproperty')) {
            case 'C':
                this.pageParams.CurrentContractTypeURLParameter = '';
                this.attributes.CurrentContractTypeURLParameter = '';
                break;
            case 'J':
                this.pageParams.CurrentContractTypeURLParameter = '<job>';
                this.attributes.CurrentContractTypeURLParameter = '<job>';
                break;
            case 'P':
                this.pageParams.CurrentContractTypeURLParameter = '<product>';
                this.attributes.CurrentContractTypeURLParameter = '<product>';
                break;
        }
    };
    TechnicianWorkSummaryComponent.prototype.BuildGrid = function () {
        this.riGrid.Clear();
        this.riGrid.AddColumn('gridEmployeeCode', 'WorkSummary', 'gridEmployeeCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumnAlign('gridEmployeeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceDateStart', 'WorkSummary', 'ServiceDateStart', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServiceDateStart', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ActivityDesc', 'WorkSummary', 'ActivityDesc', MntConst.eTypeText, 15);
        this.riGrid.AddColumn('BranchServiceArea', 'WorkSummary', 'BranchServiceArea', MntConst.eTypeCode, 6);
        this.riGrid.AddColumnAlign('BranchServiceArea', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ContractNumber', 'WorkSummary', 'ContractNumber', MntConst.eTypeCode, 8);
        this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PremiseNumber', 'WorkSummary', 'PremiseNumber', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PremiseName', 'WorkSummary', 'PremiseName', MntConst.eTypeText, 15);
        this.riGrid.AddColumn('PremiseAddressLine1', 'WorkSummary', 'PremiseAddressLine1', MntConst.eTypeText, 40);
        this.riGrid.AddColumnScreen('PremiseAddressLine1', false);
        this.riGrid.AddColumn('PremiseAddressLine2', 'WorkSummary', 'PremiseAddressLine2', MntConst.eTypeText, 40);
        this.riGrid.AddColumnScreen('PremiseAddressLine2', false);
        this.riGrid.AddColumn('PremiseAddressLine3', 'WorkSummary', 'PremiseAddressLine3', MntConst.eTypeText, 40);
        this.riGrid.AddColumnScreen('PremiseAddressLine3', false);
        this.riGrid.AddColumn('PremiseAddressLine4', 'WorkSummary', 'PremiseAddressLine4', MntConst.eTypeText, 40);
        this.riGrid.AddColumnScreen('PremiseAddressLine4', false);
        this.riGrid.AddColumn('PremisePostcode', 'WorkSummary', 'PremisePostcode', MntConst.eTypeText, 15);
        this.riGrid.AddColumnScreen('PremisePostcode', false);
        this.riGrid.AddColumn('ProductCode', 'WorkSummary', 'ProductCode', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);
        if (this.sCEnableDurations) {
            this.riGrid.AddColumn('StandardTreatmentTime', 'WorkSummary', 'StandardTreatmentTime', MntConst.eTypeTime, 6);
            this.riGrid.AddColumnAlign('StandardTreatmentTime', MntConst.eAlignmentCenter);
        }
        if (this.ShowDetailIndCheck) {
            this.riGrid.AddColumn('StandardDuration', 'WorkSummary', 'StandardDuration', MntConst.eTypeTime, 6);
            this.riGrid.AddColumnAlign('StandardDuration', MntConst.eAlignmentCenter);
            this.riGrid.AddColumn('OvertimeDuration', 'WorkSummary', 'OvertimeDuration', MntConst.eTypeTime, 6);
            this.riGrid.AddColumnAlign('OvertimeDuration', MntConst.eAlignmentCenter);
        }
        this.riGrid.AddColumn('Duration', 'WorkSummary', 'Duration', MntConst.eTypeTime, 6);
        this.riGrid.AddColumnAlign('Duration', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('Paused', 'WorkSummary', 'Paused', MntConst.eTypeCode, 4);
        this.riGrid.AddColumnScreen('Paused', false);
        if (this.sCEnableDurations) {
            this.riGrid.AddColumn('DurationPercentage', 'WorkSummary', 'DurationPercentage', MntConst.eTypeInteger, 3);
            this.riGrid.AddColumnAlign('DurationPercentage', MntConst.eAlignmentCenter);
        }
        this.riGrid.AddColumn('ServicedQuantity', 'WorkSummary', 'ServicedQuantity', MntConst.eTypeInteger, 3);
        this.riGrid.AddColumnAlign('ServicedQuantity', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PremiseContactSignature', 'WorkSummary', 'PremiseContactSignature', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('PremiseContactSignature', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('AttemptedPrintCode', 'WorkSummary', 'AttemptedPrintCode', MntConst.eTypeCode, 1);
        this.riGrid.AddColumnAlign('AttemptedPrintCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('VisitTypeCode', 'WorkSummary', 'VisitTypeCode', MntConst.eTypeCode, 2);
        this.riGrid.AddColumnAlign('VisitTypeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ActualStartTime', 'WorkSummary', 'ActualStartTime', MntConst.eTypeTime, 6);
        this.riGrid.AddColumnAlign('ActualStartTime', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ActualEndTime', 'WorkSummary', 'ActualEndTime', MntConst.eTypeTime, 6);
        this.riGrid.AddColumnAlign('ActualEndTime', MntConst.eAlignmentCenter);
        if (this.sCEnableDurations) {
            this.riGrid.AddColumn('KeyedStartTime', 'WorkSummary', 'KeyedStartTime', MntConst.eTypeTime, 6);
            this.riGrid.AddColumnAlign('KeyedStartTime', MntConst.eAlignmentCenter);
            this.riGrid.AddColumn('KeyedEndTime', 'WorkSummary', 'KeyedEndTime', MntConst.eTypeTime, 6);
            this.riGrid.AddColumnAlign('KeyedEndTime', MntConst.eAlignmentCenter);
        }
        this.riGrid.AddColumn('Mileage', 'WorkSummary', 'Mileage', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumn('PrivateWorkMileage', 'WorkSummary', 'PrivateWorkMileage', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('PrivateWorkMileage', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('Recommendation', 'ServiceVisitRecommendation', 'Recommendation', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('Recommendation', MntConst.eAlignmentCenter);
        if (this.sCEnableReceiptRequired) {
            this.riGrid.AddColumn('ReceiptRequired', 'WorkSummary', 'ReceiptRequired', MntConst.eTypeImage, 1);
            this.riGrid.AddColumnAlign('ReceiptRequired', MntConst.eAlignmentCenter);
        }
        this.riGrid.Complete();
        this.loadData();
    };
    TechnicianWorkSummaryComponent.prototype.onGridRowClick = function (event) {
        this.formData.DateFrom = this.FromdtDisplayed;
        this.formData.DateTo = this.TodtDisplayed;
        if ((this.riGrid.CurrentColumnName === 'gridEmployeeCode') ||
            (this.riGrid.CurrentColumnName === 'ActivityDesc') ||
            (this.riGrid.CurrentColumnName === 'ContractNumber') ||
            (this.riGrid.CurrentColumnName === 'PremiseNumber') ||
            (this.riGrid.CurrentColumnName === 'ProductCode') ||
            (this.riGrid.CurrentColumnName === 'Recommendation')) {
            this.attributes.BranchNumberPDAICABSActivityRowID = this.riGrid.Details.GetAttribute('ActivityDesc', 'additionalproperty');
            switch (this.riGrid.CurrentColumnName) {
                case 'gridEmployeeCode':
                    if (this.riExchange.URLParameterContains('Business')) {
                        alert('Service/iCABSSePDAiCABSActivityEmployeeMaintenance is not in scope');
                    }
                    break;
                case 'ActivityDesc':
                    alert('Service/iCABSSePDAiCABSActivityMaintenance is not in scope');
                    break;
                case 'ContractNumber':
                    if (this.riGrid.Details.GetAttribute('ContractNumber', 'additionalproperty') !== 'x') {
                        this.setContractType(event);
                        this.attributes.BusinessCodeContractRowID = this.riGrid.Details.GetAttribute('ContractNumber', 'additionalproperty');
                        if (this.riGrid.Details.GetValue('ContractNumber').charAt(0) === 'J') {
                            this.navigate('TechWorkSummary', this.ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE, {
                                'parentMode': 'TechWorkSummary',
                                'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                                'ContractRowID': this.attributes.BusinessCodeContractRowID,
                                'ContractNumber': this.riGrid.Details.GetValue('ContractNumber').split('/')[1],
                                'ContractTypeCode': this.riGrid.Details.GetValue('ContractNumber').charAt(0)
                            });
                        }
                        if (this.riGrid.Details.GetValue('ContractNumber').charAt(0) === 'C') {
                            this.navigate('TechWorkSummary', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                                'parentMode': 'TechWorkSummary',
                                'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                                'ContractRowID': this.attributes.BusinessCodeContractRowID,
                                'ContractNumber': this.riGrid.Details.GetValue('ContractNumber').split('/')[1],
                                'ContractTypeCode': this.riGrid.Details.GetValue('ContractNumber').charAt(0)
                            });
                        }
                        if (this.riGrid.Details.GetValue('ContractNumber').charAt(0) === 'P') {
                            this.navigate('TechWorkSummary', this.ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE, {
                                'parentMode': 'TechWorkSummary',
                                'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                                'ContractRowID': this.attributes.BusinessCodeContractRowID,
                                'ContractNumber': this.riGrid.Details.GetValue('ContractNumber').split('/')[1],
                                'ContractTypeCode': this.riGrid.Details.GetValue('ContractNumber').charAt(0)
                            });
                        }
                    }
                    break;
                case 'PremiseNumber':
                    if (this.riGrid.Details.GetAttribute('PremiseNumber', 'additionalproperty') !== 'x') {
                        this.setContractType(event);
                        this.attributes.BusinessCodePremiseRowID = this.riGrid.Details.GetAttribute('PremiseNumber', 'additionalproperty');
                        this.navigate('TechWorkSummary', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                            'parentMode': 'TechWorkSummary',
                            'PremiseRowID': this.attributes.BusinessCodePremiseRowID,
                            'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                            'PremiseNumber': this.riGrid.Details.GetValue('PremiseNumber'),
                            'ContractTypeCode': this.riGrid.Details.GetValue('ContractNumber').charAt(0)
                        });
                    }
                    break;
                case 'ProductCode':
                    if (this.riGrid.Details.GetAttribute('PremiseNumber', 'additionalproperty') !== 'x') {
                        this.setContractType(event);
                        this.attributes.BusinessCodeServiceCoverRowID = this.riGrid.Details.GetAttribute('ProductCode', 'additionalproperty');
                        this.navigate('TechWorkSummary', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                            'parentMode': 'TechWorkSummary',
                            'ServiceCoverRowID': this.attributes.BusinessCodeServiceCoverRowID,
                            'currentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                            'currentContractType': this.riGrid.Details.GetValue('ContractNumber').charAt(0)
                        });
                    }
                    break;
                case 'Recommendation':
                    if (this.riGrid.Details.GetValue('Recommendation') !== '') {
                        this.navigate('TechWorkSummary', '/grid/application/service/recommendation', {
                            'parentMode': 'TechWorkSummary',
                            'PremiseRowID': this.attributes.BusinessCodePremiseRowID,
                            'ServiceCoverRowID': this.attributes.BusinessCodeServiceCoverRowID,
                            'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                            'PremiseNumber': this.riGrid.Details.GetValue('PremiseNumber'),
                            'PremiseName': this.riGrid.Details.GetValue('PremiseName'),
                            'currentContractType': this.riGrid.Details.GetValue('ContractNumber').charAt(0),
                            'ContractRowID': this.attributes.BusinessCodeContractRowID,
                            'ContractNumber': this.riGrid.Details.GetValue('ContractNumber'),
                            'ProductCode': this.riGrid.Details.GetValue('ProductCode'),
                            'ServiceDateFrom': this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom'),
                            'ServiceDateTo': this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo')
                        });
                    }
                    break;
            }
        }
    };
    TechnicianWorkSummaryComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSeTechnicianWorkSummaryGrid.html'
                },] },
    ];
    TechnicianWorkSummaryComponent.ctorParameters = [
        { type: Injector, },
    ];
    TechnicianWorkSummaryComponent.propDecorators = {
        'technicianworksummaryPagination': [{ type: ViewChild, args: ['technicianworksummaryPagination',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
    };
    return TechnicianWorkSummaryComponent;
}(BaseComponent));
