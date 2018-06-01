var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild, HostListener } from '@angular/core';
import { BaseComponent } from './../../../../app/base/BaseComponent';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { PageIdentifier } from './../../../../app/base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { BranchServiceAreaSearchComponent } from './../../../internal/search/iCABSBBranchServiceAreaSearch';
export var ServiceMoveGridComponent = (function (_super) {
    __extends(ServiceMoveGridComponent, _super);
    function ServiceMoveGridComponent(injector) {
        _super.call(this, injector);
        this.queryParams = {
            operation: 'Service/iCABSSeServiceMoveGrid',
            module: 'bump',
            method: 'service-planning/maintenance',
            ActionSearch: '0',
            Actionupdate: '6',
            ActionEdit: '2',
            ActionDelete: '3'
        };
        this.showMessageHeader = true;
        this.showErrorHeader = true;
        this.showCloseButton = true;
        this.gridReady = false;
        this.ishidden = false;
        this.DateReadOnly = true;
        this.DateDisabledStartDate = true;
        this.DateDisabledEndDate = true;
        this.buttonTitle = 'Hide Filters';
        this.seperator = ' - ';
        this.pageSize = 10;
        this.currentPage = 1;
        this.totalRecords = 1;
        this.headerClicked = '';
        this.sortType = 'ASC';
        this.selectedRow = -1;
        this.postData = {};
        this.search = new URLSearchParams();
        this.ellipsis = {
            branchServiceArea: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                showAddNew: false,
                autoOpenSearch: false,
                parentMode: 'LookUp-Emp',
                component: BranchServiceAreaSearchComponent
            },
            ServiceType: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                showAddNew: false,
                autoOpenSearch: false,
                parentMode: 'LookUpC',
                component: '',
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                }
            }
        };
        this.negBranch = {
            params: {
                'parentMode': 'LookUp-NegBranch'
            },
            active: {
                id: '',
                text: ''
            },
            brnCode: 0,
            brnName: '',
            disabled: false,
            required: false
        };
        this.inputParamsInServiceTypeSearch = {
            parentMode: 'LookUpC'
        };
        this.legend = [
            { label: 'Available to move', color: '#66cccc' },
            { label: 'Can not move', color: '#c8f5f5' },
            { label: 'Late', color: '#ffcbcb' },
            { label: 'Not Completed', color: '#dddddd' }
        ];
        this.controls = [
            { name: 'BranchServiceAreaCode', readonly: true, disabled: false, required: false },
            { name: 'EmployeeSurname', readonly: true, disabled: true, required: false },
            { name: 'StartDate', readonly: true, disabled: false, required: true },
            { name: 'EndDate', readonly: true, disabled: false, required: false },
            { name: 'WeekNumber', readonly: false, disabled: true, required: false },
            { name: 'GridPageSize', readonly: true, disabled: false, required: true },
            { name: 'SequenceNumber', readonly: false, disabled: false, required: false },
            { name: 'ContractNumberSearch', readonly: false, disabled: false, required: false },
            { name: 'InServiceTypeCode', readonly: false, disabled: false, required: false },
            { name: 'ServiceTypeDesc', readonly: false, disabled: true, required: false },
            { name: 'Frequency', readonly: false, disabled: false, required: false },
            { name: 'cmdToDate', readonly: true, disabled: false, required: false },
            { name: 'cmdPlanMove', readonly: false, disabled: false, required: false },
            { name: 'RelatedVisits', readonly: true, disabled: false, required: false },
            { name: 'UnplannedNoOfCalls', readonly: false, disabled: true, required: false },
            { name: 'UnplannedNoOfExchanges', readonly: false, disabled: true, required: false },
            { name: 'UnplannedWED', readonly: false, disabled: true, required: false },
            { name: 'UnplannedTime', readonly: false, disabled: true, required: false }
        ];
        this.routeParams = {};
        this.pageId = PageIdentifier.ICABSSESERVICEMOVEGRID;
        this.setCurrentContractType();
        this.setErrorCallback(this);
        this.setURLQueryParameters(this);
    }
    ServiceMoveGridComponent.prototype.setCurrentContractType = function () {
        this.pageParams.currentContractType =
            this.riExchange.getCurrentContractType();
        this.pageParams.currentContractTypeLabel =
            this.riExchange.getCurrentContractTypeLabel();
    };
    ServiceMoveGridComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show(data, true);
    };
    ServiceMoveGridComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };
    ServiceMoveGridComponent.prototype.getURLQueryParameters = function (param) {
        this.pageParams.ParentMode = param['parentMode'];
        this.pageParams.reroute = param['reroute'];
        this.pageParams.CurrentContractTypeURLParameter = param['currentContractTypeURLParameter'];
        this.pageParams.BackLabel = param['backLabel'];
        this.pageParams.Plan = param['Plan'];
    };
    ServiceMoveGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.setPageTitle();
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.pageParams.StartDate = this.formatDate(this.getControlValue('StartDate').toString());
            this.pageParams.EndDate = this.formatDate(this.getControlValue('EndDate').toString());
            this.BuildGrid();
            this.riGrid_BeforeExecute();
        }
        else {
            this.getSysCharDtetails();
        }
    };
    ServiceMoveGridComponent.prototype.ngOnDestroy = function () {
    };
    ServiceMoveGridComponent.prototype.ngAfterViewInit = function () {
        this.setErrorCallback(this);
        this.setMessageCallback(this);
    };
    ServiceMoveGridComponent.prototype.window_onload = function () {
        this.pageParams.tdUnplannedWEDLab = false;
        this.routeParams = this.riExchange.getRouterParams();
        this.setPageTitle();
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.pageParams.tdButtonsDisplay = false;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'GridPageSize', '11');
        this.pageSize = 11;
        this.pageParams.todayDate = new Date();
        this.pageParams.TodayDate = this.utils.formatDate(this.pageParams.todayDate);
        this.pageParams.StartDate = this.pageParams.todayDate;
        this.pageParams.EndDate = new Date(this.utils.convertDate(this.utils.addDays(this.pageParams.todayDate, 7).toString()));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'StartDate', this.pageParams.TodayDate);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EndDate', this.utils.addDays(this.pageParams.todayDate, 7));
        this.formData.OriginalStartDate = this.pageParams.TodayDate;
        if (this.pageParams.Plan === 'Bump') {
            this.riExchange.riInputElement.Disable(this.uiForm, 'Frequency');
            this.pageParams.Frequency = '26';
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Frequency', this.pageParams.Frequency);
            this.formData.MaxEndDate = this.utils.addDays(this.pageParams.todayDate, 14);
            this.pageParams.tdStartLabel = 'Visits From';
            this.pageParams.tdEndLabel = 'To';
        }
        else {
            this.pageParams.tdStartLabel = 'Move Visits Due On';
            this.pageParams.tdEndLabel = 'To The';
        }
        this.GetLatestWeekNumber();
        this.riGrid.RefreshRequired();
        if (this.pageParams.ParentMode === 'ToGrid') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'StartDate', this.getControlValue('EndDate'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EndDate', this.getControlValue('EndDate'));
            if (this.getControlValue('EndDate'))
                this.pageParams.StartDate = this.formatDate(this.getControlValue('EndDate').toString());
            if (this.getControlValue('EndDate'))
                this.pageParams.EndDate = this.formatDate(this.getControlValue('EndDate').toString());
            this.riExchange.riInputElement.Disable(this.uiForm, 'BranchServiceAreaCode');
            this.riExchange.riInputElement.Disable(this.uiForm, 'NegBranchNumber');
            this.riExchange.riInputElement.Disable(this.uiForm, 'SequenceNumber');
            this.riExchange.riInputElement.Disable(this.uiForm, 'InServiceTypeCode');
            this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumberSearch');
            this.riExchange.riInputElement.Disable(this.uiForm, 'Frequency');
            this.riExchange.riInputElement.Disable(this.uiForm, 'EndDate');
            this.ellipsis.branchServiceArea.disabled = true;
            this.ellipsis.ServiceType.disabled = true;
            this.negBranch.disabled = true;
            this.pageParams.tdButtonsDisplay = true;
            this.BuildGrid();
        }
        else {
            this.pageParams.tdButtonsDisplay = false;
            this.BuildGrid();
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'RelatedVisits', true);
        ;
    };
    ServiceMoveGridComponent.prototype.setPageTitle = function () {
        if (this.pageParams.Plan === 'Bump') {
            this.pageTitle = 'Bump Service Plan';
        }
        else {
            this.pageTitle = 'Move Service Plan';
        }
        this.utils.setTitle(this.pageTitle);
    };
    ServiceMoveGridComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableInstallsRemovals,
            this.sysCharConstants.SystemCharEnablePostcodeDefaulting,
            this.sysCharConstants.SystemCharEnableRouteOptimisationSoftwareIntegration,
            this.sysCharConstants.SystemCharEnableWED
        ];
        var sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records;
            _this.pageParams.vEnableInstallsRemovals = record[0]['Required'];
            _this.pageParams.vEnablePostcodeDefaulting = record[1]['Required'];
            _this.pageParams.vRouteOptimisation = record[2]['Required'];
            _this.pageParams.vEnableWED = record[3]['Required'];
            _this.SetHTMLPageSettings();
            _this.getLookupCallSearchParameter();
            _this.doLookupformData('U');
            _this.doLookupformData('C');
            _this.doLookupformData('I');
            _this.doLookupformData('P');
            _this.window_onload();
        });
    };
    ServiceMoveGridComponent.prototype.doLookupformData = function (ipPlanVisitStatusCode) {
        var _this = this;
        var lookupIP = [
            {
                'table': 'PlanVisitStatusLang',
                'query': {
                    'LanguageCode': this.utils.getDefaultLang(),
                    'PlanVisitStatusCode': ipPlanVisitStatusCode
                },
                'fields': ['PlanVisitStatusDesc']
            },
            {
                'table': 'PlanVisitStatus',
                'query': {
                    'PlanVisitStatusCode': ipPlanVisitStatusCode
                },
                'fields': ['PlanVisitSystemDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (ipPlanVisitStatusCode === 'U') {
                _this.pageParams.vUnplannedDesc = data[1][0];
            }
            if (ipPlanVisitStatusCode === 'I') {
                _this.pageParams.vInPlanningDesc = data[1][0];
            }
            if (ipPlanVisitStatusCode === 'C') {
                _this.pageParams.vCancelledDesc = data[1][0];
            }
            if (ipPlanVisitStatusCode === 'P') {
                _this.pageParams.vPlannedDesc = data[1][0];
            }
        });
    };
    ServiceMoveGridComponent.prototype.getLookupCallSearchParameter = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'SystemParameter',
                'query': {},
                'fields': ['SystemParameterEndOfWeekDay']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data[0][0].SystemParameterEndOfWeekDay < 7) {
                _this.pageParams.vEndofWeekDay = data[0][0].SystemParameterEndOfWeekDay;
            }
            else {
                _this.pageParams.vEndofWeekDay = 1;
            }
            var d = _this.pageParams.StartDate ? _this.pageParams.StartDate : _this.pageParams.todayDate;
            _this.pageParams.vEndofWeekDay = ((6 - d.getDay()) + _this.pageParams.vEndofWeekDay);
            _this.pageParams.vbEndofWeekDate = _this.utils.addDays(d, _this.pageParams.vEndofWeekDay);
        });
    };
    ServiceMoveGridComponent.prototype.formatDate = function (date) {
        var getDate = date;
        if (window['moment'](getDate, 'DD/MM/YYYY', true).isValid()) {
            getDate = this.utils.convertDate(getDate);
        }
        else {
            getDate = this.utils.formatDate(getDate);
        }
        return new Date(getDate);
    };
    ServiceMoveGridComponent.prototype.GetLatestWeekNumber = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
        var todayDate = this.utils.formatDate(new Date());
        query.set('EndDate', this.getControlValue('EndDate'));
        query.set('ActionType', 'GetLatestWeekNumber');
        query.set('GetWarnMessage', this.formData.GetWarnMessage ? this.formData.GetWarnMessage : '');
        this.utils.getLoggedInBranch(this.businessCode(), this.countryCode()).subscribe(function (data) {
            if (data.results && data.results[0] && data.results[0].length > 0) {
                _this.pageParams.loggedInBranch = data.results[0][0].BranchNumber;
            }
            else if (data.results && data.results[1] && data.results[1].length > 0) {
                _this.pageParams.loggedInBranch = data.results[1][0].BranchNumber;
            }
            else {
                _this.pageParams.loggedInBranch = '';
            }
        });
        query.set('BranchNumber', this.utils.getBranchCode());
        query.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query)
            .subscribe(function (data) {
            if (data.hasError) {
                _this.errorService.emitError(data);
            }
            else {
                _this.pageParams.WeekNumber = data.WeekNumber;
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'WeekNumber', _this.pageParams.WeekNumber);
                if (data.WarningMessageDesc) {
                    _this.formData.GetWarnMessage = data.WarningMessageDesc;
                    _this.showMessageModal(_this.formData.GetWarnMessage);
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceMoveGridComponent.prototype.SetHTMLPageSettings = function () {
        if (this.pageParams.vEnableInstallsRemovals) {
            this.pageParams.vbEnableInstallsRemovals = true;
            this.pageParams.tdUnplannedNoOfExchangesLab = true;
        }
        else {
            this.pageParams.vbEnableInstallsRemovals = false;
            this.pageParams.tdUnplannedNoOfExchangesLab = false;
        }
        if (this.pageParams.vEnablePostcodeDefaulting) {
            this.pageParams.vbEnablePostcodeDefaulting = true;
        }
        else {
            this.pageParams.vbEnablePostcodeDefaulting = false;
        }
        if (this.pageParams.vEnableWED) {
            this.pageParams.vbEnableWED = true;
            this.pageParams.tdUnplannedWEDLab = true;
        }
        else {
            this.pageParams.vbEnableWED = false;
            this.pageParams.tdUnplannedWEDLab = false;
        }
    };
    ServiceMoveGridComponent.prototype.BuildGrid = function () {
        this.riGrid.Clear();
        if (this.pageParams.vRouteOptimisation === 'Yes' || this.pageParams.vRouteOptimisation === 'True') {
            this.pageParams.vRouteOptimisation = 'True';
        }
        else {
            this.pageParams.vRouteOptimisation = 'False';
        }
        if (!this.getControlValue('BranchServiceAreaCode')) {
            this.riGrid.AddColumn('ColBranchServiceAreaCode', 'ServiceCover', 'ColBranchServiceAreaCode', MntConst.eTypeCode, 4);
            this.riGrid.AddColumnAlign('ColBranchServiceAreaCode', MntConst.eAlignmentCenter);
        }
        this.riGrid.AddColumn('BranchServiceAreaSeqNo', 'ServiceCover', 'BranchServiceAreaSeqNo', MntConst.eTypeText, 6);
        this.riGrid.AddColumnAlign('BranchServiceAreaSeqNo', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnUpdateSupport('BranchServiceAreaSeqNo', this.pageParams.vRouteOptimisation);
        this.riGrid.AddColumn('ContractNum', 'ServiceCover', 'ContractNum', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnAlign('ContractNum', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PremiseNum', 'ServiceCover', 'PremiseNum', MntConst.eTypeText, 5);
        this.riGrid.AddColumnAlign('PremiseNum', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PremiseName', 'ServiceCover', 'PremiseName', MntConst.eTypeText, 14);
        this.riGrid.AddColumnAlign('PremiseName', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnOrderable('PremiseName', true);
        this.riGrid.AddColumn('Town', 'ServiceCover', 'Town', MntConst.eTypeText, 15);
        this.riGrid.AddColumnAlign('Town', MntConst.eAlignmentLeft);
        if (this.pageParams.vbEnablePostcodeDefaulting) {
            this.riGrid.AddColumn('Postcode', 'ServiceCover', 'Postcode', MntConst.eTypeCode, 10);
            this.riGrid.AddColumnAlign('Postcode', MntConst.eAlignmentLeft);
        }
        this.riGrid.AddColumn('ProdServGrpCode', 'ServiceCover', 'ProdServGrpCode', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnAlign('ProdServGrpCode', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('ProdCode', 'ServiceCover', 'ProdCode', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnAlign('ProdCode', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('ServiceVisitFrequency', 'ServiceCover', 'ServiceVisitFrequency', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('ServiceVisitFrequency', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceQuantity', 'ServiceCover', 'ServiceQuantity', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('ServiceQuantity', MntConst.eAlignmentCenter);
        if (this.pageParams.vbEnableWED) {
            this.riGrid.AddColumn('WEDValue', 'ServiceCover', 'WEDValue', MntConst.eTypeDecimal1, 5);
            this.riGrid.AddColumnAlign('WEDValue', MntConst.eAlignmentCenter);
        }
        this.riGrid.AddColumn('ServiceTypeCode', 'ServiceCover', 'ServiceTypeCode', MntConst.eTypeCode, 2);
        this.riGrid.AddColumnAlign('ServiceTypeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceTime', 'ServiceCover', 'ServiceTime', MntConst.eTypeText, 5);
        this.riGrid.AddColumnAlign('ServiceTime', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('VisitsDueAndCompleted', 'ServiceCover', 'VisitsDueAndCompleted', MntConst.eTypeText, 5);
        this.riGrid.AddColumnAlign('VisitsDueAndCompleted', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('StaticRelatedVisits', 'ServiceCover', 'StaticRelatedVisits', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('StaticRelatedVisits', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('NextServiceVisitDate', 'ServiceCover', 'NextServiceVisitDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('NextServiceVisitDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('VisitTypeCode', 'ServiceCover', 'VisitTypeCode', MntConst.eTypeCode, 3);
        this.riGrid.AddColumnAlign('VisitTypeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('LastVisitDate', 'ServiceCover', 'LastVisitDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('LastVisitDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('LastVisitTypeCode', 'ServiceCover', 'LastVisitTypeCode', MntConst.eTypeCode, 3);
        this.riGrid.AddColumnAlign('LastVisitTypeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('NextVisitDate', 'ServiceCover', 'NextVisitDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('NextVisitDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('NextVisitTypeCode', 'ServiceCover', 'NextVisitTypeCode', MntConst.eTypeCode, 3);
        this.riGrid.AddColumnAlign('NextVisitTypeCode', MntConst.eAlignmentCenter);
        if (this.pageParams.reroute && (this.pageParams.ParentMode !== 'ToGrid')) {
            this.riGrid.AddColumn('PlanMove', 'ServiceCover', 'PlanMove', MntConst.eTypeCheckBox, 1, false, '');
            this.riGrid.AddColumnAlign('PlanMove', MntConst.eAlignmentCenter);
        }
        this.riGrid.AddColumnOrderable('BranchServiceAreaSeqNo', true);
        this.riGrid.AddColumnOrderable('ContractNum', true);
        this.riGrid.AddColumnOrderable('ProdCode', true);
        this.riGrid.AddColumnOrderable('ServiceVisitFrequency', true);
        this.riGrid.AddColumnOrderable('NextServiceVisitDate', true);
        this.riGrid.AddColumnOrderable('VisitsDueAndCompleted', true);
        this.riGrid.AddColumnOrderable('Town', true);
        this.riGrid.AddColumnOrderable('ServiceTypeCode', true);
        this.riGrid.AddColumnOrderable('ServiceTime', true);
        this.riGrid.AddColumnOrderable('StaticRelatedVisits', true);
        if (this.pageParams.vbEnablePostcodeDefaulting) {
            this.riGrid.AddColumnOrderable('Postcode', true);
        }
        this.riGrid.Complete();
        this.gridReady = true;
    };
    ServiceMoveGridComponent.prototype.riGrid_BeforeExecute = function () {
        if (this.riGrid.Update) {
            this.pageParams.blnRefreshRequired = true;
            if (this.getControlValue('BranchServiceAreaCode')) {
                this.pageParams.AreaCode = this.getControlValue('BranchServiceAreaCode');
            }
            else {
                this.pageParams.AreaCode = '';
            }
        }
        else {
            this.pageParams.blnRefreshRequired = false;
            this.pageParams.AreaCode = this.getControlValue('BranchServiceAreaCode');
        }
        if (this.pageParams.Plan === 'Bump') {
            if (this.getControlValue('BranchServiceAreaCode')) {
                this.pageParams.AllAreas = 'No';
            }
            else {
                this.pageParams.AllAreas = 'Yes';
            }
        }
        else {
            if (this.getControlValue('BranchServiceAreaCode')) {
                this.pageParams.AllAreas = 'No';
            }
            else {
                this.pageParams.AllAreas = 'Yes';
            }
        }
        this.GetLatestWeekNumber();
        this.processPOSTOperation();
    };
    ServiceMoveGridComponent.prototype.processPOSTOperation = function () {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
        this.search.set('BranchNumber', this.utils.getBranchCode());
        this.search.set('StartDate', this.getControlValue('StartDate'));
        this.search.set('EndDate', this.getControlValue('EndDate'));
        this.search.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
        this.search.set('AllBranchServiceAreas', this.pageParams.AllAreas);
        this.search.set('NegBranchNumber', this.formData.BranchNumber ? this.formData.BranchNumber : '');
        this.search.set('ServiceTypeCode', this.getControlValue('InServiceTypeCode') ? this.getControlValue('InServiceTypeCode') : '');
        this.search.set('SequenceNumber', this.getControlValue('SequenceNumber') ? this.getControlValue('SequenceNumber') : '');
        this.search.set('ContractNumber', this.getControlValue('ContractNumberSearch') ? this.getControlValue('ContractNumberSearch') : '');
        this.search.set('MoveRowid', this.formData.MoveRowid ? this.formData.MoveRowid : '');
        this.search.set('Frequency', this.getControlValue('Frequency') ? this.getControlValue('Frequency') : '');
        this.search.set('ParentMode', this.pageParams.ParentMode ? this.pageParams.ParentMode : '');
        this.search.set('PlanMoveRowId', this.pageParams.PlanMoveCheck ? this.pageParams.PlanMoveCheck : '');
        this.search.set(this.serviceConstants.PageSize, this.pageSize.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        this.search.set(this.serviceConstants.GridCacheRefresh, 'true');
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        var sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.search.set(this.serviceConstants.GridSortOrder, sortOrder);
        this.queryParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryParams.search).subscribe(function (data) {
            if (data.hasError) {
                _this.showErrorModal(data);
            }
            else {
                var StrPostData = void 0;
                if (_this.riGrid.Update) {
                    if (_this.pageParams.grdServicePlanningRow) {
                        _this.riGrid.StartRow = _this.pageParams.grdServicePlanningRow;
                        _this.riGrid.StartColumn = 0;
                        _this.riGrid.RowID = _this.pageParams.ServiceCoverRowID;
                        StrPostData = StrPostData + '&VisitTypeCode=' + _this.pageParams.VisitTypeCode + '&NextServiceVisitDate=' + _this.riGrid.Details.GetValue('NextServiceVisitDate');
                        _this.riGrid.UpdateHeader = false;
                        _this.riGrid.UpdateBody = true;
                        _this.riGrid.UpdateFooter = true;
                    }
                    else {
                        _this.pageParams.grdServicePlanningRow = 0;
                    }
                }
                _this.pageParams.BusinessObjectPostData = StrPostData;
                _this.pageParams.PlanMoveCheck = '';
                _this.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * _this.pageSize : 1;
                _this.riGrid.Execute(data);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceMoveGridComponent.prototype.getCurrentPage = function (currentPage) {
        this.selectedRow = -1;
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.riGrid_onRefresh();
    };
    ServiceMoveGridComponent.prototype.riGrid_onRefresh = function () {
        if (this.currentPage <= 0) {
            this.currentPage = 1;
        }
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    ServiceMoveGridComponent.prototype.toggleShowHide = function (e) {
        var _this = this;
        if (this.ishidden) {
            this.ishidden = false;
            this.buttonTitle = 'Hide Filters';
        }
        else {
            this.ishidden = true;
            this.buttonTitle = 'Show Filters';
        }
        this.getTranslatedValue(this.buttonTitle, null).subscribe(function (translatedString) {
            if (translatedString) {
                _this.buttonTitle = translatedString;
            }
        });
    };
    ServiceMoveGridComponent.prototype.NegBranchNumber_onchange = function (obj) {
        if (obj.BranchNumber) {
            this.formData.BranchNumber = obj.BranchNumber;
            this.formData.BranchName = obj.BranchName;
            this.pageParams.NegBranchNumber = obj.BranchNumber;
            this.pageParams.vbErrorMessageFlagged = false;
        }
    };
    ServiceMoveGridComponent.prototype.setServiceAreaReturnData = function (data) {
        if (data.BranchServiceAreaCode) {
            this.pageParams.BranchServiceAreaCode = data.BranchServiceAreaCode;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', this.pageParams.BranchServiceAreaCode);
        }
        this.BranchServiceAreaCode_onchange();
    };
    ServiceMoveGridComponent.prototype.BranchServiceAreaCode_onchange = function () {
        var _this = this;
        if (this.getControlValue('BranchServiceAreaCode')) {
            var query = this.getURLSearchParamObject();
            query.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
            query.set(this.serviceConstants.BusinessCode, this.businessCode());
            query.set(this.serviceConstants.CountryCode, this.countryCode());
            query.set('ActionType', 'GetEmployeeSurname');
            query.set('BranchNumber', this.utils.getBranchCode());
            query.set('StartDate', this.getControlValue('StartDate'));
            query.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query)
                .subscribe(function (data) {
                if (data.hasError) {
                    _this.showErrorModal(data);
                }
                else {
                    if (data.EmployeeSurname) {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EmployeeSurname', data.EmployeeSurname);
                    }
                    else {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EmployeeSurname', '');
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaCode', '');
                    }
                    if (data.ErrorMessageDesc) {
                        _this.messageTitle = data.ErrorMessageDesc;
                        _this.showMessageModal(_this.formData.GetWarnMessage);
                        _this.pageParams.vbErrorMessageFlagged = true;
                    }
                    else {
                        if (data.WarningMessageDesc) {
                            _this.messageTitle = data.WarningMessageDesc;
                            _this.messageModal.show();
                        }
                        _this.pageParams.vbErrorMessageFlagged = false;
                        _this.riGrid.RefreshRequired();
                        _this.BuildGrid();
                    }
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', '');
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedNoOfCalls', '0');
        this.riExchange.riInputElement.isError(this.uiForm, 'UnplannedNoOfCalls');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedNoOfExchanges', '0');
        this.riExchange.riInputElement.isError(this.uiForm, 'UnplannedNoOfExchanges');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedTime', '00.00');
        if (this.pageParams.vbEnableWED) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedWED', '0');
            this.riExchange.riInputElement.isError(this.uiForm, 'UnplannedWED');
        }
        this.riGrid.RefreshRequired();
        this.BuildGrid();
    };
    ServiceMoveGridComponent.prototype.InServiceTypeCode_onchange = function (obj) {
        var _this = this;
        if (this.getControlValue('InServiceTypeCode')) {
            var query = this.getURLSearchParamObject();
            query.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
            query.set(this.serviceConstants.BusinessCode, this.businessCode());
            query.set(this.serviceConstants.CountryCode, this.countryCode());
            query.set('ActionType', 'GetServiceTypeDesc');
            query.set('ServiceTypeCode', this.getControlValue('InServiceTypeCode'));
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query)
                .subscribe(function (data) {
                if (data.hasError) {
                    _this.errorService.emitError(data);
                }
                else {
                    if (data.ServiceTypeDesc) {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceTypeDesc', data.ServiceTypeDesc);
                    }
                    else {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InServiceTypeCode', '');
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceTypeDesc', '');
                    }
                    if (data.ErrorMessageDesc) {
                        _this.messageTitle = data.ErrorMessageDesc;
                        _this.messageModal.show();
                        _this.pageParams.vbErrorMessageFlagged = true;
                    }
                    else {
                        _this.pageParams.vbErrorMessageFlagged = false;
                    }
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'InServiceTypeCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeDesc', '');
        }
    };
    ServiceMoveGridComponent.prototype.ContractNumberSearch_onchange = function (event) {
        var paddedValue = this.utils.numberPadding(this.getControlValue('ContractNumberSearch'), 8);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumberSearch', paddedValue);
    };
    ServiceMoveGridComponent.prototype.GridPageSize_onchange = function (event) {
        if (this.getControlValue('GridPageSize')) {
            this.pageSize = Number(this.getControlValue('GridPageSize'));
        }
    };
    ServiceMoveGridComponent.prototype.DateSelectedValue = function (value, fieldName) {
        if (value && value.value) {
            this.setControlValue(fieldName, value.value);
        }
        else {
            this.setControlValue(fieldName, '');
        }
    };
    ServiceMoveGridComponent.prototype.document_onkeydown = function (ev) {
        var vcBeforeStartDate;
        var vcBeforeEndDate;
        vcBeforeStartDate = this.getControlValue('StartDate');
        vcBeforeEndDate = this.getControlValue('EndDate');
        var d1 = vcBeforeStartDate;
        var d2 = new Date(this.utils.convertDate(this.formData.MaxEndDate).toString());
        var d3 = new Date(this.utils.convertDate(this.formData.OriginalStartDate).toString());
        if (this.pageParams.ParentMode !== 'ServicePlan') {
            switch (ev.keyCode) {
                case 106:
                    this.pageParams.StartDate = this.utils.addDays(this.pageParams.vbEndofWeekDate, 1);
                    this.pageParams.EndDate = this.utils.addDays(this.pageParams.vbEndofWeekDate, 7);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'StartDate', this.pageParams.StartDate);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'EndDate', this.pageParams.EndDate);
                    break;
                case 107:
                    this.pageParams.StartDate = this.utils.addDays(vcBeforeStartDate, 1);
                    if (vcBeforeEndDate) {
                        this.pageParams.EndDate = this.utils.addDays(vcBeforeEndDate, 1);
                    }
                    d1 = new Date(this.utils.convertDate(this.pageParams.StartDate));
                    if (d1 >= d2) {
                        this.pageParams.StartDate = vcBeforeStartDate;
                        this.pageParams.EndDate = vcBeforeEndDate;
                    }
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'StartDate', this.pageParams.StartDate);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'EndDate', this.pageParams.EndDate);
                    break;
                case 109:
                    this.pageParams.StartDate = this.utils.addDays(vcBeforeStartDate, -1);
                    if (vcBeforeEndDate) {
                        this.pageParams.EndDate = this.utils.addDays(vcBeforeEndDate, -1);
                    }
                    d1 = new Date(this.utils.convertDate(this.pageParams.StartDate));
                    if (d1 < d3) {
                        this.pageParams.StartDate = vcBeforeStartDate;
                        this.pageParams.EndDate = vcBeforeEndDate;
                    }
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'StartDate', this.pageParams.StartDate);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'EndDate', this.pageParams.EndDate);
                    break;
            }
            this.pageParams.StartDate = new Date(this.utils.convertDate(this.pageParams.StartDate.toString()));
            this.pageParams.EndDate = new Date(this.utils.convertDate(this.pageParams.EndDate.toString()));
            this.formData.GetWarnMessage = 'Yes';
            this.GetLatestWeekNumber();
        }
        this.riExchange_CBORequest();
    };
    ;
    ServiceMoveGridComponent.prototype.riExchange_CBORequest = function () {
        var _this = this;
        this.formData.GetWarnMessage = 'WARNING - You Have Entered A Date Prior To Today For The';
        this.messageTitle = this.formData.GetWarnMessage;
        var p1 = this.formatDate(this.getControlValue('StartDate').toString());
        var p2 = this.formatDate(this.getControlValue('EndDate').toString());
        var p3 = this.formatDate(this.pageParams.TodayDate.toString());
        if (this.pageParams.Move) {
            if (p1 < p3) {
                this.getTranslatedValue(this.messageTitle, null).subscribe(function (translatedString) {
                    if (translatedString) {
                        _this.messageTitle = translatedString;
                    }
                });
                this.getTranslatedValue('Move Visits Due On', null).subscribe(function (translatedString) {
                    if (translatedString) {
                        _this.messageTitle += translatedString;
                    }
                });
                this.messageModal.show();
            }
            if (p2 < p3) {
                this.getTranslatedValue(this.messageTitle, null).subscribe(function (translatedString) {
                    if (translatedString) {
                        _this.messageTitle = translatedString;
                    }
                });
                this.getTranslatedValue('To The', null).subscribe(function (translatedString) {
                    if (translatedString) {
                        _this.messageTitle += translatedString;
                    }
                });
                this.messageModal.show();
            }
        }
    };
    ServiceMoveGridComponent.prototype.SetAttributes = function (data) {
        if (this.getControlValue('BranchServiceAreaCode')) {
            this.attributes.BranchServiceAreaCode = data.children[0].children[0].innerText;
        }
        else {
            this.attributes.BranchServiceAreaCode = '';
        }
        this.attributes.ContractRowID = this.riGrid.Details.GetAttribute('ContractNum', 'AdditionalProperty');
        this.attributes.PremiseRowID = this.riGrid.Details.GetAttribute('PremiseNum', 'AdditionalProperty');
        this.attributes.ServiceCoverRowID = this.riGrid.Details.GetAttribute('ProdCode', 'AdditionalProperty');
        this.attributes.StaticVisitRowID = this.riGrid.Details.GetAttribute('NextServiceVisitDate', 'AdditionalProperty');
        this.attributes.Row = data.sectionRowIndex;
        if (this.getControlValue('BranchServiceAreaCode')) {
            this.pageParams.AddElementNumber = 0;
        }
        else {
            this.pageParams.AddElementNumber = 1;
        }
        if (this.pageParams.vbEnablePostcodeDefaulting) {
            this.pageParams.AddElementNumber2 = 1;
        }
        else {
            this.pageParams.AddElementNumber2 = 0;
        }
    };
    ServiceMoveGridComponent.prototype.riGrid_BodyOnClick = function (event) {
        var objTR = event.srcElement.parentElement.parentElement.parentElement;
        this.SetAttributes(objTR);
        this.pageParams.vPlanMoveId = event.srcElement.parentElement.parentElement.parentElement.children[1 + this.pageParams.AddElementNumber].getAttribute('additionalproperty');
        var vPlanMoveId = this.pageParams.vPlanMoveId;
        var indexOfvPlanMoveId = this.pageParams.PlanMoveCheck.indexOf(vPlanMoveId);
        var length1 = vPlanMoveId.length;
        var length2 = this.pageParams.PlanMoveCheck.length;
        var p1 = indexOfvPlanMoveId + vPlanMoveId.length;
        var p2 = this.pageParams.PlanMoveCheck.length;
        if (this.riGrid.Details.GetValue('PlanMove')) {
            this.pageParams.PlanMoveCheck = this.pageParams.PlanMoveCheck + ';' + vPlanMoveId + '1';
        }
        else {
            if (this.pageParams.PlanMoveCheck === '' || indexOfvPlanMoveId === 0) {
                this.pageParams.PlanMoveCheck = this.pageParams.PlanMoveCheck + ';' + vPlanMoveId + '0';
            }
            else {
                if ((indexOfvPlanMoveId === 2) && (this.pageParams.PlanMoveCheck.length > (length1 + 2))) {
                    this.pageParams.PlanMoveCheck = this.pageParams.PlanMoveCheck.substring(p1, p2);
                }
                else if ((indexOfvPlanMoveId === 2) && (length2 === (length1 + 2))) {
                    this.pageParams.PlanMoveCheck = '';
                }
                else if (indexOfvPlanMoveId > 2) {
                    this.pageParams.PlanMoveCheck = this.pageParams.PlanMoveCheck.substring(1, (indexOfvPlanMoveId - 2)) + this.pageParams.PlanMoveCheck.substring((indexOfvPlanMoveId + length1 + 1), length2);
                }
            }
        }
        this.updateEvents();
    };
    ServiceMoveGridComponent.prototype.riGrid_BodyOnDblClick = function (data) {
        if (this.pageParams.vRouteOptimisation === 'Yes' || this.pageParams.vRouteOptimisation === true) {
            this.pageParams.vRouteOptimisation = true;
        }
        else {
            this.pageParams.vRouteOptimisation = false;
        }
        switch (this.riGrid.CurrentColumnName) {
            case 'StaticRelatedVisits':
                this.attributes.DateType = 'Day';
                this.attributes.SelectedDate = this.getControlValue('StartDate');
                this.showMessageModal('Application/iCABSARelatedVisitGrid.htm - Page not found');
                break;
            case 'ContractNum':
            case 'PremiseNum':
            case 'ProdCode':
            case 'VisitTypeCode':
            case 'PortfolioStatus':
            case 'NextServiceVisitDate':
            case 'BranchServiceAreaSeqNo':
                if (this.riGrid.CurrentColumnName === 'BranchServiceAreaSeqNo' && this.pageParams.vRouteOptimisation === true && this.pageParams.ParentMode !== 'ServicePlan') {
                    break;
                }
                else {
                    var objTR = event.srcElement.parentElement.parentElement;
                    this.SetAttributes(objTR);
                    switch (this.riGrid.Details.GetAttribute('Town', 'additionalProperty')) {
                        case 'C':
                            this.pageParams.CurrentContractTypeURLParameter = '';
                            break;
                        case 'J':
                            this.pageParams.CurrentContractTypeURLParameter = 'job';
                            break;
                        case 'P':
                            this.pageParams.CurrentContractTypeURLParameter = 'product';
                            break;
                        default:
                            break;
                    }
                    switch (this.riGrid.CurrentColumnName) {
                        case 'ContractNum':
                            this.navigate('ServicePlanning', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                                'ContractNumber': this.riGrid.Details.GetValue('ContractNum').split('/')[1]
                            });
                            break;
                        case 'PremiseNum':
                            this.navigate('ServicePlanning', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                                'ContractNumber': this.riGrid.Details.GetValue('ContractNum').split('/')[1],
                                'PremiseNumber': this.riGrid.Details.GetValue('PremiseNum'),
                                'ProductCode': this.riGrid.Details.GetValue('ProdCode')
                            });
                            break;
                        case 'ProdCode':
                            if (this.pageParams.CurrentContractTypeURLParameter === 'product') {
                                this.navigate('ServicePlanning', 'application/productSalesSCDetailsMaintenance', {
                                    'ContractNumber': this.riGrid.Details.GetValue('ContractNum').split('/')[1],
                                    'PremiseNumber': this.riGrid.Details.GetValue('PremiseNum'),
                                    'ProductCode': this.riGrid.Details.GetValue('ProdCode')
                                });
                            }
                            else {
                                this.navigate('ServicePlanning', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                                    'ContractNumber': this.riGrid.Details.GetValue('ContractNum').split('/')[1],
                                    'PremiseNumber': this.riGrid.Details.GetValue('PremiseNum'),
                                    'ProductCode': this.riGrid.Details.GetValue('ProdCode')
                                });
                            }
                            break;
                        default:
                            break;
                    }
                }
                break;
            default:
                break;
        }
    };
    ServiceMoveGridComponent.prototype.getGridInfo = function (info) {
        this.riGridPagination.totalItems = info.totalRows;
        this.totalRecords = info.totalRows;
    };
    ServiceMoveGridComponent.prototype.riGrid_Sort = function (event) {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    ServiceMoveGridComponent.prototype.riGrid_AfterExecute = function () {
        var ArrInfo;
        var RowNumber;
        if (this.riGrid.Update) {
            if (this.riGrid.CurrentColumnName === 'Seq No') {
                ArrInfo = this.riGrid.Details.GetValue(this.riGrid.CurrentColumnName);
                if (ArrInfo) {
                    ArrInfo = ArrInfo.split('|');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedNoOfCalls', ArrInfo[0]);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedNoOfExchanges', ArrInfo[1]);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedTime', ArrInfo[2]);
                    if (this.pageParams.vbEnableWED) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedWED', ArrInfo[3]);
                    }
                }
                else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedNoOfCalls', '0');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedNoOfExchanges', '0');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedTime', '00.00');
                    if (this.pageParams.vbEnableWED) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedWED', '0');
                    }
                }
                this.riExchange.riInputElement.isError(this.uiForm, 'UnplannedNoOfCalls');
                this.riExchange.riInputElement.isError(this.uiForm, 'UnplannedNoOfExchanges');
                if (this.pageParams.vbEnableWED) {
                    this.riExchange.riInputElement.isError(this.uiForm, 'UnplannedWED');
                }
            }
        }
        this.riGrid.Update = false;
    };
    ServiceMoveGridComponent.prototype.updateEvents = function () {
        this.formData.MoveRowid = '';
        var MoveRowid = this.formData.MoveRowid.toString();
        switch (this.riGrid.CurrentColumnName) {
            case 'PlanMove':
                this.pageParams.vRowid = this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'rowID');
                if (this.riGrid.Details.GetValue(this.riGrid.CurrentColumnName) === 'True') {
                    if (MoveRowid.indexOf(this.pageParams.vRowid.toString()) === 0) {
                        if (MoveRowid === '') {
                            this.formData.MoveRowid = this.pageParams.vRowid ? this.pageParams.vRowid : '';
                        }
                        else {
                            this.formData.MoveRowid = this.formData.MoveRowid + ';' + this.pageParams.vRowid;
                        }
                    }
                }
                else {
                    this.formData.MoveRowid = MoveRowid.replace(this.pageParams.vRowid.toString(), '');
                }
                if (MoveRowid.length > 0) {
                    this.formData.MoveRowid = MoveRowid.replace(';;', ';');
                    if (MoveRowid.indexOf(';') === MoveRowid.length) {
                        this.formData.MoveRowid = MoveRowid.subStr(0, (MoveRowid.length - 1));
                    }
                    this.formData.MoveRowid = MoveRowid.replace(';', ',');
                    if (MoveRowid.indexOf(';') === 1) {
                        this.formData.MoveRowid = MoveRowid.replace(';', '', 1, 1);
                    }
                }
                break;
            default:
                break;
        }
    };
    ServiceMoveGridComponent.prototype.cmdPlanMove_onClick = function (event) {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
        this.postData.ActionType = 'Validate';
        this.postData.EndDate = this.getControlValue('EndDate');
        this.postData.MoveRowid = this.formData.MoveRowid;
        this.postData.Frequency = this.getControlValue('Frequency');
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postData)
            .subscribe(function (data) {
            if (data.hasError) {
                _this.errorService.emitError(data);
            }
            else {
                if (data.ValidateError) {
                    _this.messageTitle = data.ValidateReason;
                    _this.messageModal.show();
                    event.preventDefault();
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
        var query1 = this.getURLSearchParamObject();
        query1.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
        if (this.pageParams.Plan === 'Bump') {
            this.postData.ActionType = 'BumpStatic';
        }
        else {
            this.postData.ActionType = 'MoveStatic';
        }
        this.postData.MoveRowid = this.formData.MoveRowid;
        this.postData.EndDate = this.getControlValue('EndDate');
        this.postData.Frequency = this.getControlValue('Frequency');
        this.postData.RelatedVisits = this.getControlValue('RelatedVisits');
        this.postData.BranchServiceAreaCode = this.getControlValue('BranchServiceAreaCode');
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query1, this.postData)
            .subscribe(function (data) {
            if (data.hasError) {
                _this.errorService.emitError(data);
            }
            else {
                _this.pageParams.MoveComplete = data.MoveComplete;
                _this.formData.MoveRowid = '';
                _this.GetLatestWeekNumber();
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceMoveGridComponent.prototype.cmdToDate_onClick = function (event) {
        this.pageParams.NegBranchNumber = this.formData.BranchNumber;
        this.pageParams.ParentMode = 'ToGrid';
        this.DateReadOnly = false;
        this.DateDisabledStartDate = false;
        this.pageParams.Plan = 'Move';
        this.location.replaceState('serviceplanning/ServiceMoveGridSearch', 'Plan=Move');
        this.window_onload();
    };
    ServiceMoveGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSeServiceMoveGrid.html'
                },] },
    ];
    ServiceMoveGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    ServiceMoveGridComponent.propDecorators = {
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
        'riGridPagination': [{ type: ViewChild, args: ['riGridPagination',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'branchServiceArea': [{ type: ViewChild, args: ['branchServiceArea',] },],
        'document_onkeydown': [{ type: HostListener, args: ['document:keydown', ['$event'],] },],
    };
    return ServiceMoveGridComponent;
}(BaseComponent));
