var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { BaseComponent } from './../../../base/BaseComponent';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { EmployeeSearchComponent } from './../../../internal/search/iCABSBEmployeeSearch';
export var SMSMessagesGridComponent = (function (_super) {
    __extends(SMSMessagesGridComponent, _super);
    function SMSMessagesGridComponent(injector) {
        _super.call(this, injector);
        this.queryParams = {
            operation: 'ContactManagement/iCABSCMSMSMessagesGrid',
            module: 'notification',
            method: 'ccm/maintenance',
            ActionSearch: '0',
            ActionInsert: '1',
            ActionUpdate: '6',
            ActionEdit: '2',
            ActionDelete: '3'
        };
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.showPromptHeader = true;
        this.routeParams = {};
        this.search = {};
        this.postData = {};
        this.backLinkText = '';
        this.buttonTitle = 'Hide Filters';
        this.showBackLabel = false;
        this.ishidden = false;
        this.todayDate = new Date();
        this.pageSize = 10;
        this.curPage = 1;
        this.totalRecords = 1;
        this.selectedRow = -1;
        this.grdServiceCover = {};
        this.dateReadOnly = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.ellipsis = {
            supervisor: {
                autoOpen: false,
                showCloseButton: true,
                showAddNew: false,
                childConfigParams: {
                    'parentMode': 'LookUp-Supervisor'
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: EmployeeSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            employee: {
                autoOpen: false,
                showCloseButton: true,
                showAddNew: false,
                childConfigParams: {
                    'parentMode': 'LookUp'
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: EmployeeSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            }
        };
        this.controls = [
            { name: 'SearchType', readonly: false, disabled: false, required: false },
            { name: 'SupervisorEmployeeCode', readonly: false, disabled: false, required: false },
            { name: 'SupervisorSurname', readonly: true, disabled: false, required: false },
            { name: 'EmployeeCode', readonly: false, disabled: false, required: false },
            { name: 'EmployeeSurname', readonly: true, disabled: false, required: false },
            { name: 'selectStatus', readonly: false, disabled: false, required: false },
            { name: 'DateFrom', readonly: false, disabled: false, required: true },
            { name: 'DateTo', readonly: false, disabled: false, required: true }
        ];
        this.legend = [
            { label: 'Received by Intranet and Sent', color: 'rgb(236, 176, 104)' },
            { label: 'Received by Intranet, Sent, Received on Phone', color: 'rgb(204, 255, 204)' },
            { label: 'Sent, Read Receipt not yet Received From Phone', color: 'rgb(221, 221, 221)' }
        ];
        this.imglabel = [
            { label: 'Awaiting Release', img: 'http://10.117.192.160:9090/Images/Smile.gif' },
            { label: 'Sent', img: 'http://10.117.192.160:9090/Images/SmileUp.gif' },
            { label: 'Unsent - Error', img: 'http://10.117.192.160:9090/Images/SmileDown.gif' }
        ];
        this.pageId = PageIdentifier.ICABSCMSMSMESSAGESGRID;
        this.setCurrentContractType();
        this.setErrorCallback(this);
        this.setURLQueryParameters(this);
    }
    SMSMessagesGridComponent.prototype.setCurrentContractType = function () {
        this.currentContractType =
            this.riExchange.getCurrentContractType();
        this.currentContractTypeLabel =
            this.riExchange.getCurrentContractTypeLabel();
    };
    SMSMessagesGridComponent.prototype.getURLQueryParameters = function (param) {
        this.pageParams.ParentMode = param['parentMode'] ? param['parentMode'] : this.riExchange.getParentMode();
        this.pageParams.CurrentContractTypeURLParameter = param['CurrentContractTypeURLParameter'];
    };
    SMSMessagesGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'SMS Message Search';
        this.utils.setTitle(this.pageTitle);
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.pageParams.DateFrom = new Date(this.getControlValue('DateFrom'));
            this.pageParams.DateTo = new Date(this.getControlValue('DateTo'));
        }
        else {
            var toDate = new Date().toString();
            this.pageParams.DateTo = new Date();
            if (window['moment'](toDate, 'DD/MM/YYYY', true).isValid()) {
                toDate = this.utils.convertDate(toDate);
            }
            else {
                toDate = this.utils.formatDate(toDate);
            }
            this.setControlValue('DateTo', toDate);
            var fromDate = this.utils.removeDays(new Date(this.myDateFormat(new Date())), 28);
            this.pageParams.DateFrom = fromDate;
            if (window['moment'](fromDate, 'DD/MM/YYYY', true).isValid()) {
                fromDate = this.utils.convertDate(fromDate.toString());
            }
            else {
                fromDate = this.utils.formatDate(fromDate);
            }
            this.setControlValue('DateFrom', fromDate);
            this.window_onload();
        }
    };
    SMSMessagesGridComponent.prototype.ngAfterViewInit = function () {
        this.setErrorCallback(this);
        this.setMessageCallback(this);
    };
    SMSMessagesGridComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    SMSMessagesGridComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show({ msg: data, title: 'Error' }, false);
    };
    SMSMessagesGridComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };
    SMSMessagesGridComponent.prototype.window_onload = function () {
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.renderPage();
    };
    SMSMessagesGridComponent.prototype.renderPage = function () {
        this.setControlValue('SearchType', 'Employee');
        this.setControlValue('selectStatus', 'unsent');
        this.disableControl('EmployeeSurname', true);
        this.disableControl('SupervisorSurname', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'DateFrom', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'DateTo', true);
        if (this.pageParams.parentMode === 'SMSMessagesEmployee') {
            this.setControlValue('EmployeeCode', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'EmployeeCode'));
            this.setControlValue('EmployeeSurname', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'EmployeeSurname'));
        }
        this.searchTypeonchange('Employee', true);
    };
    SMSMessagesGridComponent.prototype.myDateFormat = function (date) {
        var month = '' + (date.getMonth() + 1);
        var day = '' + date.getDate();
        var year = date.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [month, day, year].join('/');
    };
    SMSMessagesGridComponent.prototype.BuildGrid = function () {
        this.riGrid.Clear();
        if (!this.getControlValue('EmployeeCode')) {
            this.riGrid.AddColumn('EmployeeCode', 'SMSMessage', 'EmployeeCode', MntConst.eTypeCode, 6, false);
            this.riGrid.AddColumnAlign('EmployeeCode', MntConst.eAlignmentCenter);
            this.riGrid.AddColumn('EmployeeSurname', 'SMSMessage', 'EmployeeSurname', MntConst.eTypeText, 10, false);
            this.riGrid.AddColumnOrderable('EmployeeCode', true);
            this.riGrid.AddColumnOrderable('EmployeeSurname', true);
        }
        this.riGrid.AddColumn('InternalExternal', 'SMSMessage', 'InternalExternal', MntConst.eTypeText, 6, false);
        this.riGrid.AddColumn('DateCreated', 'SMSMessage', 'DateCreated', MntConst.eTypeText, 16, false);
        this.riGrid.AddColumnAlign('DateCreated', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('DateCreated', true);
        if (this.getControlValue('selectStatus') !== 'unsent') {
            this.riGrid.AddColumn('DateSent', 'SMSMessage', 'DateSent', MntConst.eTypeText, 16, false);
            this.riGrid.AddColumnAlign('DateSent', MntConst.eAlignmentCenter);
            this.riGrid.AddColumnOrderable('DateSent', true);
        }
        this.riGrid.AddColumn('MobileNumber', 'SMSMessage', 'MobileNumber', MntConst.eTypeText, 10, false);
        this.riGrid.AddColumn('MessageText', 'SMSMessage', 'MessageText', MntConst.eTypeText, 150, false);
        this.riGrid.AddColumn('StatusImg', 'SMSMessage', 'StatusImg', MntConst.eTypeImage, 2, false);
        this.riGrid.AddColumn('SMSResentInd', 'SMSResentInd', 'SMSResentInd', MntConst.eTypeImage, 1, true);
        this.riGrid.AddColumn('SMSSendOn', 'SMSSendOn', 'SMSSendOn', MntConst.eTypeTextFree, 14, true);
        this.riGrid.AddColumn('SMSRedirect', 'SMSRedirect', 'SMSRedirect', MntConst.eTypeImage, 8, true);
        this.riGrid.Complete();
        this.riGrid_BeforeExecute();
    };
    SMSMessagesGridComponent.prototype.riGrid_BeforeExecute = function () {
        var _this = this;
        var haserror_DateFrom = this.riExchange.riInputElement.isError(this.uiForm, 'DateFrom');
        var haserror_DateTo = this.riExchange.riInputElement.isError(this.uiForm, 'DateTo');
        var haserror_EmployeeCode = this.riExchange.riInputElement.isError(this.uiForm, 'EmployeeCode');
        if (!haserror_DateFrom
            && !haserror_DateTo
            && !haserror_EmployeeCode) {
            this.search = this.getURLSearchParamObject();
            this.search.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
            this.search.set('DateFrom', this.getControlValue('DateFrom') ? this.getControlValue('DateFrom') : '');
            this.search.set('DateTo', this.getControlValue('DateTo') ? this.getControlValue('DateTo') : '');
            this.search.set('BranchNumber', this.utils.getBranchCode());
            this.search.set('SupervisorEmployeeCode', this.getControlValue('SupervisorEmployeeCode') ? this.getControlValue('SupervisorEmployeeCode') : '');
            this.search.set('EmployeeCode', this.getControlValue('EmployeeCode') ? this.getControlValue('EmployeeCode') : '');
            this.search.set('Status', this.getControlValue('selectStatus') ? this.getControlValue('selectStatus') : 'All');
            this.search.set(this.serviceConstants.PageSize, this.pageSize.toString());
            this.search.set(this.serviceConstants.PageCurrent, this.curPage.toString());
            this.search.set(this.serviceConstants.GridMode, '0');
            this.search.set(this.serviceConstants.GridHandle, '6489328');
            this.search.set(this.serviceConstants.GridCacheRefresh, 'true');
            var sortOrder = 'Descending';
            if (!this.riGrid.DescendingSort) {
                sortOrder = 'Ascending';
            }
            this.search.set(this.serviceConstants.GridSortOrder, sortOrder);
            this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
            this.queryParams.search = this.search;
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryParams.search).subscribe(function (data) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    return;
                }
                _this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * _this.pageSize : 1;
                _this.riGrid.Update = true;
                _this.riGrid.Execute(data);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.errorService.emitError(error);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    SMSMessagesGridComponent.prototype.riExchange_UpdateHTMLDocument = function () {
        this.riGrid.Update = false;
        this.riGrid_BeforeExecute();
    };
    SMSMessagesGridComponent.prototype.riGrid_Sort = function (event) {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    SMSMessagesGridComponent.prototype.riGrid_BodyOnDblClick = function (event) {
        var strElementID = event.srcElement.parentElement.parentElement.getAttribute('id');
        switch (strElementID) {
            case 'SMSResentInd':
                this.resendDetails();
                break;
            case 'SMSRedirect':
                this.redirectSMS();
                break;
            default:
                break;
        }
    };
    SMSMessagesGridComponent.prototype.getCurrentPage = function (event) {
        this.selectedRow = -1;
        this.curPage = event.value;
        this.onRefresh();
    };
    SMSMessagesGridComponent.prototype.onRefresh = function () {
        if (this.curPage <= 0) {
            this.curPage = 1;
        }
        this.riGrid.RefreshRequired();
        this.BuildGrid();
    };
    SMSMessagesGridComponent.prototype.promptSave = function (event) {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
        this.postData.Function = 'ResendMessage';
        this.postData.RowID = this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'rowID');
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postData)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e.info['error']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.showErrorModal(e.errorMessage);
                }
                else {
                    _this.onRefresh();
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    SMSMessagesGridComponent.prototype.resendDetails = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        this.postData.Function = 'CheckMessage';
        this.postData.RowID = this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'rowID');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postData)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.errorService.emitError(data.info['error']);
            }
            else {
                if ((typeof data !== 'undefined' && data['errorMessage'])) {
                    _this.showErrorModal(data.errorMessage);
                }
                else {
                    _this.promptTitle = _this.getTranslatedValue('Are you sure you want to resend this Message').value;
                    _this.promptModal.show();
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    SMSMessagesGridComponent.prototype.redirectSMS = function () {
        this.pageParams.SMSMessageRowID = this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'rowID');
        var riExchangeMode = 'Redirect';
        this.showErrorModal('ContactManagement/iCABSCMSMSRedirect.htm - this page is not yet covered');
    };
    SMSMessagesGridComponent.prototype.selectStatusOnchange = function (data) {
        if (data) {
        }
    };
    SMSMessagesGridComponent.prototype.dateFromSelectedValue = function (value) {
        if (value && value.value) {
            this.setControlValue('DateFrom', value.value);
        }
        else {
            this.setControlValue('DateFrom', '');
        }
        this.riGrid.RefreshRequired();
    };
    SMSMessagesGridComponent.prototype.dateToSelectedValue = function (value) {
        if (value && value.value) {
            this.setControlValue('DateTo', value.value);
        }
        else {
            this.setControlValue('DateTo', '');
        }
        this.riGrid.RefreshRequired();
    };
    SMSMessagesGridComponent.prototype.searchTypeonchange = function (data, call) {
        switch (data) {
            case 'Supervisor':
                this.trSupervisor = true;
                this.trEmployee = false;
                this.setControlValue('EmployeeCode', '');
                this.setControlValue('EmployeeSurname', '');
                break;
            default:
                this.trSupervisor = false;
                this.trEmployee = true;
                this.setControlValue('SupervisorEmployeeCode', '');
                this.setControlValue('SupervisorSurname', '');
                break;
        }
    };
    SMSMessagesGridComponent.prototype.supervisoronchange = function (obj, call) {
        if (call) {
            if (obj.SupervisorEmployeeCode) {
                this.setControlValue('SupervisorEmployeeCode', obj.SupervisorEmployeeCode);
            }
            if (obj.SupervisorSurname) {
                this.setControlValue('SupervisorSurname', obj.SupervisorSurname);
            }
        }
    };
    SMSMessagesGridComponent.prototype.employeeonchange = function (obj, call) {
        if (call) {
            if (obj.EmployeeCode) {
                this.setControlValue('EmployeeCode', obj.EmployeeCode);
            }
            if (obj.EmployeeSurname) {
                this.setControlValue('EmployeeSurname', obj.EmployeeSurname);
            }
        }
    };
    SMSMessagesGridComponent.prototype.employeeCodeonkeydown = function (event, byval) {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionUpdate);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        this.postData.Function = 'GetEmployeeName';
        this.postData.EmployeeCode = this.getControlValue('EmployeeCode') ? this.getControlValue('EmployeeCode') : '';
        if (this.postData.EmployeeCode) {
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postData)
                .subscribe(function (data) {
                if (data.status === 'failure') {
                    _this.errorService.emitError(data.info['error']);
                    _this.setControlValue('EmployeeSurname', '');
                }
                else {
                    if ((typeof data !== 'undefined' && data['errorMessage'])) {
                        _this.showErrorModal(data.errorMessage);
                        _this.setControlValue('EmployeeSurname', '');
                    }
                    else {
                        _this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                        _this.riExchange.riInputElement.SetErrorStatus(_this.uiForm, 'EmployeeCode', false);
                    }
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.errorService.emitError(error);
                _this.riExchange.riInputElement.SetErrorStatus(_this.uiForm, 'EmployeeCode', true);
                _this.setControlValue('EmployeeSurname', '');
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
        else {
            this.setControlValue('EmployeeSurname', '');
        }
    };
    SMSMessagesGridComponent.prototype.supervisorEmployeeCodeonkeydown = function (event, byval) {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionUpdate);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        this.postData.Function = 'GetEmployeeName';
        this.postData.EmployeeCode = this.getControlValue('SupervisorEmployeeCode') ? this.getControlValue('SupervisorEmployeeCode') : '';
        if (this.postData.EmployeeCode) {
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postData)
                .subscribe(function (data) {
                if (data.status === 'failure') {
                    _this.riExchange.riInputElement.SetErrorStatus(_this.uiForm, 'SupervisorEmployeeCode', true);
                    _this.showErrorModal(data.info['error']);
                    _this.setControlValue('SupervisorSurname', '');
                }
                else {
                    if ((typeof data !== 'undefined' && data['errorMessage'])) {
                        _this.showErrorModal(data.errorMessage);
                        _this.setControlValue('SupervisorSurname', '');
                    }
                    else {
                        _this.setControlValue('SupervisorSurname', data.EmployeeSurname);
                        _this.riExchange.riInputElement.SetErrorStatus(_this.uiForm, 'SupervisorEmployeeCode', false);
                    }
                }
            }, function (error) {
                _this.errorService.emitError(error);
                _this.riExchange.riInputElement.SetErrorStatus(_this.uiForm, 'SupervisorEmployeeCode', true);
                _this.setControlValue('SupervisorSurname', '');
            });
        }
        else {
            this.setControlValue('SupervisorSurname', '');
        }
    };
    SMSMessagesGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSCMSMSMessagesGrid.html'
                },] },
    ];
    SMSMessagesGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    SMSMessagesGridComponent.propDecorators = {
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
        'riGridPagination': [{ type: ViewChild, args: ['riGridPagination',] },],
        'employeeSearchEllipsis': [{ type: ViewChild, args: ['employeeSearchEllipsis',] },],
        'supervisorSearchEllipsis': [{ type: ViewChild, args: ['supervisorSearchEllipsis',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
    };
    return SMSMessagesGridComponent;
}(BaseComponent));
