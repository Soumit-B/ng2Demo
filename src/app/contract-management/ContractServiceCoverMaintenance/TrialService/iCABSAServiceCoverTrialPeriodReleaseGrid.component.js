var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { BaseComponent } from './../../../base/BaseComponent';
import { PremiseSearchComponent } from './../../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from './../../../internal/search/iCABSAServiceCoverSearch';
import { ContractSearchComponent } from './../../../internal/search/iCABSAContractSearch';
import { SalesAreaSearchComponent } from './../../../internal/search/iCABSBSalesAreaSearch.component';
import { BranchServiceAreaSearchComponent } from './../../../internal/search/iCABSBBranchServiceAreaSearch';
export var TrialPeriodReleaseGridComponent = (function (_super) {
    __extends(TrialPeriodReleaseGridComponent, _super);
    function TrialPeriodReleaseGridComponent(injector) {
        _super.call(this, injector);
        this.queryParams = {
            operation: 'Application/iCABSAServiceCoverTrialPeriodReleaseGrid',
            module: 'contract-admin',
            method: 'contract-management/maintenance',
            ActionSearch: '0',
            Actionupdate: '6',
            ActionEdit: '2',
            ActionDelete: '3'
        };
        this.showMessageHeader = true;
        this.promptTitle = '';
        this.promptContent = '';
        this.contractData = {};
        this.backLinkText = '';
        this.showBackLabel = false;
        this.tdButtonsDisplay = false;
        this.blnRefreshRequired = true;
        this.ishidden = false;
        this.buttonTitle = 'Hide Filters';
        this.todayDate = new Date();
        this.routeParams = {};
        this.postData = {};
        this.Date = new Date();
        this.ToDate = new Date();
        this.FromDate = new Date();
        this.pageSize = 19;
        this.currentPage = 1;
        this.totalItems = 10;
        this.headerClicked = '';
        this.sortType = 'ASC';
        this.selectedRow = -1;
        this.riGrid = {};
        this.grdServiceCover = {};
        this.dateReadOnly = false;
        this.showErrorHeader = true;
        this.search = new URLSearchParams();
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.ellipsis = {};
        this.ShowTypeList = [
            { title: 'All', value: 'All', selected: 'selected' },
            { title: 'Outstanding', value: 'Outstanding' },
            { title: 'Accepted', value: 'Accepted' },
            { title: 'Rejected', value: 'Rejected' },
            { title: 'Action Required', value: 'Pending' }
        ];
        this.legend = [
            { label: 'Accepted', color: '#CCFFCC' },
            { label: 'Rejected', color: '#FFCCCC' },
            { label: 'Action Required', color: '#FDFDCD' }
        ];
        this.controls = [
            { name: 'ContractNumber', readonly: false, disabled: false, required: false },
            { name: 'ContractName', readonly: true, disabled: true, required: false, type: 'virtual' },
            { name: 'ShowType', readonly: false, disabled: false, required: false },
            { name: 'PremiseNumber', readonly: false, disabled: false, required: false },
            { name: 'PremiseName', readonly: true, disabled: true, required: false, type: 'virtual' },
            { name: 'SalesAreaCode', readonly: false, disabled: false, required: false },
            { name: 'SalesAreaDesc', readonly: true, disabled: true, required: false, type: 'virtual' },
            { name: 'BranchServiceAreaCode', readonly: false, disabled: false, required: false },
            { name: 'BranchServiceAreaDesc', readonly: true, disabled: true, required: false, type: 'virtual' },
            { name: 'ProductCode', readonly: false, disabled: false, required: false },
            { name: 'ProductDesc', readonly: true, disabled: true, required: false, type: 'virtual' },
            { name: 'DateFrom', readonly: true, disabled: false, required: true },
            { name: 'DateTo', readonly: true, disabled: false, required: true },
            { name: 'ServiceCover', readonly: true, disabled: false, required: false },
            { name: 'ServiceCoverRowID', readonly: true, disabled: false, required: false },
            { name: 'TrialEnd', readonly: true, disabled: false, required: false }
        ];
        this.pageId = PageIdentifier.ICABSASERVICECOVERTRIALPERIODRELEASEGRID;
        this.setCurrentContractType();
        this.setErrorCallback(this);
        this.setURLQueryParameters(this);
    }
    TrialPeriodReleaseGridComponent.prototype.setCurrentContractType = function () {
        this.pageParams.currentContractType =
            this.utils.getCurrentContractType(this.pageParams.CurrentContractTypeURLParameter);
        this.pageParams.currentContractTypeLabel =
            this.utils.getCurrentContractLabel(this.pageParams.currentContractType);
    };
    TrialPeriodReleaseGridComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show(data, true);
    };
    TrialPeriodReleaseGridComponent.prototype.getURLQueryParameters = function (param) {
        this.routeParams.ParentMode = param['parentMode'];
        this.routeParams.CurrentContractTypeURLParameter = param['CurrentContractTypeURLParameter'];
    };
    TrialPeriodReleaseGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Trial Period Confirmation';
        this.ellipsis = {
            contract: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'currentContractType': this.riExchange.getCurrentContractType(),
                    'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeLabel(),
                    'showAddNew': false
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: ContractSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            premises: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'ContractName': this.getControlValue('ContractName'),
                    'currentContractType': this.riExchange.getCurrentContractType(),
                    'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeLabel(),
                    'showAddNew': true
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: PremiseSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            product: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp-Freq',
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'ContractName': this.getControlValue('ContractName'),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'PremiseName': this.getControlValue('PremiseName'),
                    'currentContractType': this.riExchange.getCurrentContractType(),
                    'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeLabel(),
                    'showAddNew': true
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: ServiceCoverSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            branchServiceAreaCode: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'currentContractType': this.riExchange.getCurrentContractType(),
                    'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeLabel(),
                    'showAddNew': true
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: BranchServiceAreaSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            salesAreaCode: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'currentContractType': this.riExchange.getCurrentContractType(),
                    'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeLabel(),
                    'showAddNew': true
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: SalesAreaSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            }
        };
        this.ToDate = new Date();
        this.FromDate = new Date(new Date().getFullYear(), 0, 1);
        if (this.formData.DateFrom) {
            var getFromDate = this.formData.DateFrom;
            if (window['moment'](getFromDate, 'DD/MM/YYYY', true).isValid()) {
                getFromDate = this.utils.convertDate(getFromDate);
            }
            else {
                getFromDate = this.utils.formatDate(getFromDate);
            }
            this.dtNewFromDate = new Date(getFromDate);
            var getToDate = this.formData.DateTo;
            if (window['moment'](getToDate, 'DD/MM/YYYY', true).isValid()) {
                getToDate = this.utils.convertDate(getToDate);
            }
            else {
                getToDate = this.utils.formatDate(getToDate);
            }
            this.dtNewToDate = new Date(getToDate);
            this.populateUIFromFormData();
            this.buildGrid();
        }
        else {
            this.window_onload();
        }
        this.gridSortHeaders = [{
                'fieldName': 'ContractNumber',
                'colName': 'Contract Number',
                'sortType': 'ASC'
            }, {
                'fieldName': 'PremiseName',
                'colName': 'Premises Name',
                'sortType': 'ASC'
            }, {
                'fieldName': 'SalesAreaCode',
                'colName': 'Sales Area',
                'sortType': 'ASC'
            }, {
                'fieldName': 'BranchServiceAreaCode',
                'colName': 'Service Area',
                'sortType': 'ASC'
            }, {
                'fieldName': 'ProductCode',
                'colName': 'Prod Code',
                'sortType': 'ASC'
            }, {
                'fieldName': 'TrialCommenceDate',
                'colName': 'Trial Commence Date',
                'sortType': 'ASC'
            }, {
                'fieldName': 'TrialChargeValue',
                'colName': 'Trial Charge Value',
                'sortType': 'ASC'
            }, {
                'fieldName': 'TrialEndDate',
                'colName': 'Trial End Date',
                'sortType': 'ASC'
            }];
    };
    TrialPeriodReleaseGridComponent.prototype.ngOnDestroy = function () {
    };
    TrialPeriodReleaseGridComponent.prototype.window_onload = function () {
        this.pageParams.currentContractType = this.riExchange.getCurrentContractType();
        this.pageParams.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
        this.utils.setTitle(this.pageTitle);
        this.renderPage();
        this.GetDateMessageStrings();
        this.buildGrid();
    };
    TrialPeriodReleaseGridComponent.prototype.renderPage = function () {
        this.Date = new Date();
        var toDate = this.myDateFormat();
        this.dtNewToDate = new Date(toDate);
        this.setControlValue('DateTo', this.utils.formatDate(this.dtNewToDate));
        this.Date = this.FromDate;
        var fromDate = this.myDateFormat();
        this.dtNewFromDate = new Date(fromDate);
        this.setControlValue('DateFrom', this.utils.formatDate(this.dtNewFromDate));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ShowType', 'All');
        this.formData.ServiceCover = '';
        this.formData.ServiceCoverRowID = '';
        this.formData.TrialEnd = '';
        this.setControlValue('ServiceCover', this.formData.ServiceCover);
        this.setControlValue('ServiceCoverRowID', this.formData.ServiceCoverRowID);
        this.setControlValue('TrialEnd', this.formData.TrialEnd);
    };
    TrialPeriodReleaseGridComponent.prototype.myDateFormat = function () {
        var month = '' + (this.Date.getMonth() + 1);
        var day = '' + this.Date.getDate();
        var year = this.Date.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [month, day, year].join('/');
    };
    TrialPeriodReleaseGridComponent.prototype.buildGrid = function () {
        this.riGridComponent.clearGridData();
        this.maxColumn = 15;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom')) {
            this.search.set('DateFrom', this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom'));
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo')) {
            this.search.set('DateTo', this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo'));
        }
        this.search.set('BranchNumber', this.utils.getBranchCode());
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')) {
            this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        }
        else {
            this.search.set('ContractNumber', '');
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')) {
            this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        }
        else {
            this.search.set('PremiseNumber', '');
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'SalesAreaCode')) {
            this.search.set('SalesAreaCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'SalesAreaCode'));
        }
        else {
            this.search.set('SalesAreaCode', '');
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode')) {
            this.search.set('BranchServiceAreaCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode'));
        }
        else {
            this.search.set('BranchServiceAreaCode', '');
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode')) {
            this.search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        }
        else {
            this.search.set('ProductCode', '');
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ShowType')) {
            this.search.set('ShowType', this.riExchange.riInputElement.GetValue(this.uiForm, 'ShowType'));
        }
        else {
            this.search.set('ShowType', 'All');
        }
        if (this.formData.ServiceCoverRowID) {
            this.search.set('ServiceCoverRowID', this.formData.ServiceCoverRowID);
        }
        else {
            this.search.set('ServiceCoverRowID', this.getControlValue('ServiceCoverRowID'));
        }
        this.search.set(this.serviceConstants.PageSize, this.pageSize.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '1245482');
        this.search.set(this.serviceConstants.GridCacheRefresh, 'true');
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClicked);
        this.search.set(this.serviceConstants.GridSortOrder, this.sortType);
        this.queryParams.search = this.search;
        this.riGridComponent.loadGridData(this.queryParams);
    };
    TrialPeriodReleaseGridComponent.prototype.sortGridInfo = function (data) {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.riGrid_onRefresh();
    };
    TrialPeriodReleaseGridComponent.prototype.bodyOnClick = function (data) {
        this.riGrid.rowIndex = data.rowIndex;
        this.riGrid.cellIndex = data.cellIndex;
        this.riGrid.rowData = data.rowData;
        this.riGrid.cellData = this.riGridComponent.getCellInfoForSelectedRow(this.riGrid.rowIndex, this.riGrid.cellIndex);
        var headerColumnData = this.riGridComponent.getHeaderInfoForSelectedCell(this.riGrid.rowIndex, this.riGrid.cellIndex);
        this.riGrid.headerTitle = headerColumnData.text;
        this.ServiceCoverFocus(data);
        this.riGrid_BodyOnClick();
    };
    TrialPeriodReleaseGridComponent.prototype.getGridOnDblClick = function (data) {
        this.riGrid.rowIndex = data.rowIndex;
        this.riGrid.cellIndex = data.cellIndex;
        this.riGrid.rowData = data.rowData;
        this.riGrid.cellData = this.riGridComponent.getCellInfoForSelectedRow(this.riGrid.rowIndex, this.riGrid.cellIndex);
        var headerColumnData = this.riGridComponent.getHeaderInfoForSelectedCell(this.riGrid.rowIndex, this.riGrid.cellIndex);
        this.riGrid.headerTitle = headerColumnData.text;
        this.ServiceCoverFocus(data);
        this.messageTitle = 'Can not navigate - This page is not in Scope';
        this.pageParams.CurrentContractTypeURLParameter = this.routeParams.CurrentContractTypeURLParameter;
        switch (this.riGrid.cellIndex) {
            case 0:
                this.navigate('Release', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                    'parentMode': 'Release',
                    'ContractNumber': this.formData.ContractNumber,
                    'ContractRowID': this.formData.ContractRowID,
                    'ContractTypeCode': this.pageParams.currentContractType
                });
                break;
            case 1:
                this.navigate('Release', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                    'parentMode': 'Release',
                    'PremiseNumber': this.formData.PremiseNumber,
                    'PremiseRowID': this.formData.PremiseRowID,
                    'ContractTypeCode': this.pageParams.currentContractType
                });
                break;
            case 6:
                this.navigate('Release', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                    'parentMode': 'Release',
                    'ProductCode': this.formData.ProductCode,
                    'ServiceCoverRowID': this.formData.ServiceCoverRowID,
                    'currentContractType': this.pageParams.currentContractType
                });
                break;
            case 7:
                this.messageModal.show();
                this.navigate('Release', '/application/service/visit/maintenance', {
                    'parentMode': 'Release',
                    'ServiceVisitRowID': this.formData.ServiceCoverRowID,
                    'currentContractType': this.pageParams.currentContractType
                });
                break;
            case 8:
                this.navigate('Release', '/maintenance/servicecover/commencedate', {
                    'parentMode': 'Release',
                    'ServiceVisitRowID': this.formData.ServiceCoverRowID,
                    'currentContractType': this.pageParams.currentContractType
                });
                break;
            case 9:
                this.navigate('Release', '/contractmanagement/maintenance/commencedate', {
                    'parentMode': 'Release',
                    'ServiceVisitRowID': this.formData.ServiceCoverRowID,
                    'currentContractType': this.pageParams.currentContractType
                });
                break;
            case 12:
                this.navigate('TrialPeriod', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                    'parentMode': 'TrialPeriod',
                    'ServiceCoverRowID': this.formData.ServiceCoverRowID,
                    'currentContractType': this.pageParams.currentContractType,
                    'TrialEnd': this.formData.TrialEnd
                });
                break;
            case 13:
                var rowData = data.rowData;
                this.navigate('Release', '/maintenance/trialperiodrelease', {
                    'parentMode': 'Release',
                    'ProductCode': rowData[Object.keys(rowData)[6]],
                    'ServiceCoverRowID': this.formData.ServiceCoverRowID,
                    'currentContractType': this.pageParams.currentContractType,
                    'ContractNumber': rowData[Object.keys(rowData)[0]],
                    'PremiseNumber': rowData[Object.keys(rowData)[1]]
                });
                break;
            case 14:
                this.GetLostBusinessRequestRowID();
                break;
            default:
                break;
        }
    };
    TrialPeriodReleaseGridComponent.prototype.getGridRowInfoOnDblClick = function (data) {
        this.riGrid.columnClicked = data.columnClicked;
    };
    TrialPeriodReleaseGridComponent.prototype.getGridInfo = function (data) {
        if (data.totalPages > 0) {
            if (data.totalRows === 0) {
                this.totalItems = 0;
            }
            else {
                this.totalItems = data.totalPages * this.pageSize;
                if (this.selectedRow === -1) {
                    this.riGridComponent.onCellClick(0, 0);
                }
                else {
                    this.riGridComponent.onCellClick(this.selectedRow, 0);
                }
            }
        }
    };
    TrialPeriodReleaseGridComponent.prototype.getCurrentPage = function (event) {
        this.selectedRow = -1;
        this.currentPage = event.value;
        this.riGridComponent.clearGridData();
        this.riGrid_onRefresh();
    };
    TrialPeriodReleaseGridComponent.prototype.riGrid_onRefresh = function () {
        this.riGridComponent.clearGridData();
        this.buildGrid();
        this.riGrid.Update = true;
    };
    TrialPeriodReleaseGridComponent.prototype.riGridUpdate = function () {
        if (this.riGrid.Update) {
            this.riGrid.StartRow = this.formData.Row;
            this.riGrid.StartColumn = 0;
            this.riGrid.RowID = this.formData.ServiceCoverRowID;
            this.riGrid.UpdateHeader = false;
            this.riGrid.UpdateBody = true;
            this.riGrid.UpdateFooter = false;
        }
    };
    TrialPeriodReleaseGridComponent.prototype.ServiceCoverFocus = function (data) {
        this.formData.Row = this.riGrid.rowIndex;
        this.formData.ServiceCoverRowID = data.cellData.rowID;
        switch (data.columnClicked.text) {
            case 'Contract Number':
                this.formData.ContractNumber = data.cellData.text;
                this.formData.ContractRowID = data.cellData.rowID;
                this.formData.ServiceCoverRowID = data.cellData.rowID;
                break;
            case 'Premises Number':
                this.formData.PremiseNumber = data.cellData.text;
                this.formData.PremiseRowID = data.cellData.rowID;
                this.formData.ServiceCoverRowID = data.cellData.rowID;
                break;
            case 'Prod Code':
                this.formData.ProductCode = data.cellData.text;
                this.formData.ServiceCoverRowID = data.cellData.rowID;
                break;
            case 'Visit Freq':
                this.formData.ServiceCoverRowID = data.cellData.rowID;
                break;
            case 'Accept':
                this.formData.ServiceCoverRowID = data.cellData.rowID;
                break;
            case 'Reject':
                this.formData.ServiceCoverRowID = data.cellData.rowID;
                break;
            case 'Trial End Date':
                this.formData.TrialEnd = data.cellData.additionalData ? data.cellData.additionalData : data.cellData.text;
                break;
        }
        this.setControlValue('ServiceCover', this.formData.ServiceCover);
        this.setControlValue('ServiceCoverRowID', this.formData.ServiceCoverRowID);
        this.setControlValue('TrialEnd', this.formData.TrialEnd);
    };
    TrialPeriodReleaseGridComponent.prototype.riGrid_BodyOnClick = function () {
        this.pageParams.MsgResult = '';
        if (this.riGrid.headerTitle === 'Trial Commence Date') {
            this.formData.TrialCommenceDate = this.riGrid.cellData.text;
        }
        if (this.riGrid.headerTitle === 'Service Date Start') {
            this.formData.ServiceDateStart = this.riGrid.cellData.text;
        }
        if (this.riGrid.headerTitle === 'Unsuspend') {
            if (this.formData.TrialCommenceDate !== this.formData.ServiceDateStart) {
                this.promptTitle = this.pageParams.MsgDateTitle;
                this.promptContent = this.pageParams.MsgDateText;
                this.promptModal.show();
            }
        }
    };
    TrialPeriodReleaseGridComponent.prototype.promptSave = function (event) {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        this.postData.Function = 'Unsuspend';
        this.postData.ServiceVisitRowID = this.formData.ServiceCoverRowID;
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postData)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorService.emitError(e['errorMessage']);
                }
                else {
                    _this.riGrid_onRefresh();
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    TrialPeriodReleaseGridComponent.prototype.GetDateMessageStrings = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        query.set('Function', 'GetDateString');
        query.set('DTE', '');
        query.set('TME', '');
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.errorService.emitError(data.oResponse);
            }
            else {
                _this.pageParams.MsgDateText = data.MessageText;
                _this.pageParams.MsgDateTitle = data.MessageTitle;
            }
        }, function (error) {
            _this.errorService.emitError('Record not found');
        });
    };
    TrialPeriodReleaseGridComponent.prototype.GetLostBusinessRequestRowID = function () {
        var _this = this;
        this.messageTitle = 'Can not navigate - This page is not in Scope';
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
        this.postData.Function = 'GetLostBusinessRequestRowID';
        this.postData.ServiceCoverRowID = this.formData.ServiceCoverRowID;
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postData)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.errorService.emitError(data.oResponse);
            }
            else {
                _this.formData.LostBusinessRequestRowID = data.LostBusinessRequestRowID;
                _this.navigate('TrialPeriod', '', {
                    'parentMode': 'TrialPeriod',
                    'ContractNumber': _this.getControlValue('ContractNumber'),
                    'ServiceCoverRowID': _this.formData.ServiceCoverRowID,
                    'currentContractType': _this.pageParams.currentContractType
                });
                _this.messageModal.show();
            }
        }, function (error) {
            _this.errorService.emitError('Record not found');
        });
    };
    TrialPeriodReleaseGridComponent.prototype.dateFromSelectedValue = function (value) {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', value.value);
        }
    };
    TrialPeriodReleaseGridComponent.prototype.dateToSelectedValue = function (value) {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', value.value);
        }
    };
    TrialPeriodReleaseGridComponent.prototype.ContractNumber_onchange = function (obj, call) {
        if (call) {
            if (obj.ContractNumber) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', obj.ContractNumber);
            }
            if (obj.ContractName) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', obj.ContractName);
            }
        }
        var paddedValue = this.utils.numberPadding(this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'), 8);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', paddedValue);
        this.ellipsis.premises.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.premises.childConfigParams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.product.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.product.childConfigParams.ContractName = this.getControlValue('ContractName');
    };
    TrialPeriodReleaseGridComponent.prototype.PremiseNumber_onchange = function (obj, call) {
        if (call) {
            if (obj.PremiseNumber) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', obj.PremiseNumber);
            }
            if (obj.PremiseName) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', obj.PremiseName);
            }
            this.ellipsis.product.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber');
            this.ellipsis.product.childConfigParams.PremiseName = this.getControlValue('PremiseName');
        }
    };
    TrialPeriodReleaseGridComponent.prototype.SalesAreaCode_onchange = function (obj, call) {
        if (call) {
            if (obj.SalesAreaCode) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesAreaCode', obj.SalesAreaCode);
            }
            if (obj.SalesAreaDesc) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesAreaDesc', obj.SalesAreaDesc);
            }
        }
    };
    TrialPeriodReleaseGridComponent.prototype.BranchServiceAreaCode_onchange = function (obj, call) {
        if (call) {
            if (obj.BranchServiceAreaCode) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', obj.BranchServiceAreaCode);
            }
            if (obj.BranchServiceAreaDesc) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDesc', obj.BranchServiceAreaDesc);
            }
        }
    };
    TrialPeriodReleaseGridComponent.prototype.ProductCode_onchange = function (obj, call) {
        if (call) {
            if (obj.ProductCode) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', obj.ProductCode);
            }
            if (obj.ProductDesc) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', obj.ProductDesc);
            }
        }
    };
    TrialPeriodReleaseGridComponent.prototype.populateData_onkeydown = function (event, byval) {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        this.postData.Function = 'GetDescriptions';
        this.postData.BranchNumber = this.utils.getBranchCode();
        if (byval === 1) {
            var paddedValue = this.utils.numberPadding(this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'), 8);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', paddedValue);
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')) {
            this.postData.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')) {
            this.postData.PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'SalesAreaCode')) {
            this.postData.SalesAreaCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'SalesAreaCode');
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode')) {
            this.postData.BranchServiceAreaCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode');
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode')) {
            this.postData.ProductCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
        }
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postData)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.errorService.emitError(data.oResponse);
            }
            else {
                if (byval === 1) {
                    if (data.ContractName) {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', data.ContractName);
                    }
                    else {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractNumber', '');
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', '');
                        _this.messageTitle = data.errorMessage;
                        _this.messageModal.show();
                    }
                }
                if (byval === 2) {
                    if (data.PremiseName) {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', data.PremiseName);
                    }
                    else {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseNumber', '');
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', '');
                        _this.messageTitle = data.errorMessage;
                        _this.messageModal.show();
                    }
                }
                if (byval === 3) {
                    if (data.SalesAreaDesc) {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SalesAreaDesc', data.SalesAreaDesc);
                    }
                    else {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SalesAreaCode', '');
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SalesAreaDesc', '');
                        _this.messageTitle = data.errorMessage;
                        _this.messageModal.show();
                    }
                }
                if (byval === 4) {
                    if (data.BranchServiceAreaDesc) {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaDesc', data.BranchServiceAreaDesc);
                    }
                    else {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaCode', '');
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaDesc', '');
                        _this.messageTitle = data.errorMessage;
                        _this.messageModal.show();
                    }
                }
                if (byval === 5) {
                    if (data.ProductDesc) {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', data.ProductDesc);
                    }
                    else {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductCode', '');
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', '');
                        _this.messageTitle = data.errorMessage;
                        _this.messageModal.show();
                    }
                }
                _this.ellipsis.premises.childConfigParams.ContractNumber = _this.getControlValue('ContractNumber');
                _this.ellipsis.premises.childConfigParams.ContractName = _this.getControlValue('ContractName');
                _this.ellipsis.product.childConfigParams.ContractNumber = _this.getControlValue('ContractNumber');
                _this.ellipsis.product.childConfigParams.ContractName = _this.getControlValue('ContractName');
                _this.ellipsis.product.childConfigParams.PremiseNumber = _this.getControlValue('PremiseNumber');
                _this.ellipsis.product.childConfigParams.PremiseName = _this.getControlValue('PremiseName');
            }
        }, function (error) {
            _this.errorService.emitError('Record not found');
        });
    };
    TrialPeriodReleaseGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverTrialPeriodReleaseGrid.html'
                },] },
    ];
    TrialPeriodReleaseGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    TrialPeriodReleaseGridComponent.propDecorators = {
        'riGridComponent': [{ type: ViewChild, args: ['riGridComponent',] },],
        'riGridPagination': [{ type: ViewChild, args: ['riGridPagination',] },],
        'contractNumberEllipsis': [{ type: ViewChild, args: ['contractNumberEllipsis',] },],
        'premisesNumberEllipsis': [{ type: ViewChild, args: ['premisesNumberEllipsis',] },],
        'productcodeEllipsis': [{ type: ViewChild, args: ['productcodeEllipsis',] },],
        'salesarecodeEllipsis': [{ type: ViewChild, args: ['salesarecodeEllipsis',] },],
        'branchserviceareacodeEllipsis': [{ type: ViewChild, args: ['branchserviceareacodeEllipsis',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
    };
    return TrialPeriodReleaseGridComponent;
}(BaseComponent));
