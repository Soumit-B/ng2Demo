import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpService } from './../../../shared/services/http-service';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Logger } from '@nsalaun/ng2-logger';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { LookUp } from './../../../shared/services/lookup';
import { RiExchange } from './../../../shared/services/riExchange';
import { SpeedScript } from './../../../shared/services/speedscript';
import { Utils } from './../../../shared/services/utility';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { ErrorService } from '../../../shared/services/error.service';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
export var PlanVisitGridYearComponent = (function () {
    function PlanVisitGridYearComponent(ajaxconstant, httpService, logger, utils, SpeedScript, errorService, serviceConstants, router, route, translateService, riExchange, formBuilder, LookUp, SysCharConstants, location) {
        var _this = this;
        this.ajaxconstant = ajaxconstant;
        this.httpService = httpService;
        this.logger = logger;
        this.utils = utils;
        this.SpeedScript = SpeedScript;
        this.errorService = errorService;
        this.serviceConstants = serviceConstants;
        this.router = router;
        this.route = route;
        this.translateService = translateService;
        this.riExchange = riExchange;
        this.formBuilder = formBuilder;
        this.LookUp = LookUp;
        this.SysCharConstants = SysCharConstants;
        this.location = location;
        this.ajaxSource = new BehaviorSubject(0);
        this.yearList = [];
        this.viewTypeList = [];
        this.menuList = [];
        this.vbEnableTabularView = false;
        this.blnFromComplianceReport = false;
        this.search = new URLSearchParams();
        this.isRequesting = false;
        this.method = 'service-planning/maintenance';
        this.module = 'plan-visits';
        this.operation = 'Application/iCABSAPlanVisitGridYear';
        this.maxColumn = 35;
        this.itemsPerPage = 500;
        this.currentPage = 1;
        this.attributes = {
            ProductCode: {}
        };
        this.curPage = 1;
        this.pageSize = 10;
        this.ContractObject = { type: '', label: '' };
        this.inputParams = { parentMode: '', ServiceCover: '' };
        this.controls = [
            { name: 'menu', readonly: false, disabled: false, required: false },
            { name: 'ContractNumber', readonly: true, disabled: true, required: true, value: '' },
            { name: 'ContractName', readonly: true, disabled: true, required: false, type: 'virtual' },
            { name: 'ViewTypeFilter', readonly: true, disabled: false, required: false },
            { name: 'SelectedYear', readonly: true, disabled: false, required: false },
            { name: 'PremiseNumber', readonly: true, disabled: true, required: true, value: '' },
            { name: 'PremiseName', readonly: true, disabled: true, required: true, type: 'virtual' },
            { name: 'ProductCode', readonly: true, disabled: true, required: true, value: '' },
            { name: 'ProductDesc', readonly: true, disabled: true, required: false, type: 'virtual' },
            { name: 'VisitCycleInWeeks', readonly: true, disabled: true, required: false },
            { name: 'VisitsPerCycle', readonly: true, disabled: true, required: false },
            { name: 'ServiceVisitFrequency', readonly: true, disabled: true, required: false },
            { name: 'TotalVisits', readonly: true, disabled: true, required: false, type: 'virtual' },
            { name: 'TotalUnits', readonly: true, disabled: true, required: false, type: 'virtual' },
            { name: 'TotalWED', readonly: true, disabled: true, required: false, typr: 'virtual' },
            { name: 'TotalTime', readonly: true, disabled: true, required: false },
            { name: 'TotalNettValue', readonly: true, disabled: true, required: false },
            { name: 'chkIntervalTooShort', readonly: true, disabled: false, required: false },
            { name: 'IntervalShortFirstDate', readonly: true, disabled: true, required: false },
            { name: 'chkIntervalTooLong', readonly: true, disabled: false, required: false },
            { name: 'IntervalLongFirstDate', readonly: true, disabled: true, required: false },
            { name: 'chkVisitsTooLow', readonly: true, disabled: false, required: false },
            { name: 'chkVisitsTooHigh', readonly: true, disabled: false, required: false },
            { name: 'BusinessCode', readonly: true, disabled: false, required: false, value: this.utils.getBusinessCode() },
            { name: 'ServiceCoverNumber', readonly: true, disabled: false, required: false, value: '' }
        ];
        this.uiDisplay = {
            pageHeader: 'Planned Visits',
            trContract: false,
            trPremise: false,
            trProduct: false,
            VisitCycleInWeeks: true,
            VisitsPerCycle: true,
            IntervalShortFirstDate: true,
            IntervalLongFirstDate: true,
            ServiceVisitFrequency: true,
            trCompliance: true,
            cmd_TabularView: false,
            tdTotalWED: false,
            legend: [],
            label: {
                tdVisitCycleInWeeksLabel: 'Weeks Between Visits',
                tdVisitsPerCycleLabel: 'Visits Per Week',
                tdIntervalTooShort: 'Interval too short',
                tdIntervalShortFirstDateLabel: 'First date',
                tdIntervalTooLong: 'Interval too long',
                tdIntervalLongFirstDateLabel: 'First date',
                tdServiceVisitFrequencyLabel: 'Visit Frequency'
            }
        };
        this.sub = this.route.queryParams.subscribe(function (params) {
            _this.routeParams = params;
            _this.logger.log(JSON.stringify(params));
            for (var key in params) {
                if (params.hasOwnProperty('ComplianceReport'))
                    _this.blnFromComplianceReport = true;
            }
        });
    }
    PlanVisitGridYearComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.uiForm = this.formBuilder.group({});
        this.renderPage();
        this.translateService.setUpTranslation();
        var sysCharNumbers = [
            this.SysCharConstants.SystemCharEnableInstallsRemovals,
            this.SysCharConstants.SystemCharEnableWED,
            this.SysCharConstants.SystemCharEnablePlanVisitTabularView,
            this.SysCharConstants.SystemCharEnableWeeklyVisitPattern
        ];
        var sysCharIP = {
            operation: 'iCABSAPlanVisitGridYear',
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharNumbers.toString()
        };
        this.SpeedScript.sysChar(sysCharIP).subscribe(function (data) {
            _this.logger.log('iCABSAPlanVisitGridYear.htm - init:', data);
            _this.vbEnableInstallsRemovals = data['records'][0].Required;
            _this.vbEnableWED = data['records'][1].Required;
            _this.vbEnableTabularView = data['records'][2].Required;
            _this.vSCEnableWeeklyVisitPattern = data['records'][3].Logical;
            _this.vSCWeeklyVisitPatternLog = data['records'][3].Required;
            _this.vbManualVisitIntervalSetup = _this.vSCWeeklyVisitPatternLog;
            _this.logger.log('SysChars', _this.vbEnableTabularView, data['records'][2]);
            if (_this.vbEnableTabularView) {
                _this.uiDisplay.cmd_TabularView = true;
            }
            else {
                _this.uiDisplay.cmd_TabularView = false;
            }
            if (_this.vbEnableWED) {
                _this.riExchange.riInputElement.Disable(_this.uiForm, 'TotalWED');
                _this.uiDisplay.tdTotalWED = true;
            }
            else {
                _this.uiDisplay.tdTotalWED = false;
            }
            _this.window_onload();
        });
    };
    PlanVisitGridYearComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.sub) {
            this.sub.unsubscribe();
        }
        if (this.subLookup) {
            this.subLookup.unsubscribe();
        }
        if (this.subLookup2) {
            this.subLookup2.unsubscribe();
        }
    };
    PlanVisitGridYearComponent.prototype.window_onload = function () {
        this.ContractObject.type = this.utils.getCurrentContractType(this.routeParams.CurrentContractTypeURLParameter);
        this.ContractObject.label = this.utils.getCurrentContractLabel(this.ContractObject.type);
        this.utils.setTitle(this.uiDisplay.pageHeader);
        this.BuildMenuOptions();
        this.riGrid.DefaultBorderColor = 'DDDDDD';
        this.riGrid.FunctionPaging = false;
    };
    PlanVisitGridYearComponent.prototype.renderPage = function () {
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ContractNumber', true));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'PremiseNumber', true));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ProductCode', true));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverNumber', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ServiceCoverRowID', true));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ViewTypeFilter', 'Visit');
        this.uiDisplay.trContract = true;
        this.uiDisplay.trPremise = true;
        this.uiDisplay.trProduct = true;
        this.BuildYearOptions();
        this.doLookup();
        this.inputParams.parentMode = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'parentMode', true);
        this.inputParams.ServiceCover = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ServiceCoverRowID', true);
        this.updateViewOption(this.inputParams);
        if (this.blnFromComplianceReport) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'chkVisitsTooLow');
            this.riExchange.riInputElement.Disable(this.uiForm, 'chkVisitsTooHigh');
            this.riExchange.riInputElement.Disable(this.uiForm, 'chkIntervalTooShort');
            this.riExchange.riInputElement.Disable(this.uiForm, 'chkIntervalTooLong');
            if (!this.vbManualVisitIntervalSetup) {
                this.uiDisplay.label.tdVisitCycleInWeeksLabel = '';
                this.uiDisplay.VisitCycleInWeeks = false;
                this.uiDisplay.label.tdVisitsPerCycleLabel = '';
                this.uiDisplay.VisitsPerCycle = false;
                this.uiDisplay.label.tdIntervalTooShort = '';
                this.uiDisplay.label.tdIntervalShortFirstDateLabel = '';
                this.uiDisplay.IntervalShortFirstDate = false;
                this.uiDisplay.label.tdIntervalTooLong = '';
                this.uiDisplay.label.tdIntervalLongFirstDateLabel = '';
                this.uiDisplay.IntervalLongFirstDate = false;
            }
        }
        else {
            this.uiDisplay.label.tdServiceVisitFrequencyLabel = '';
            this.uiDisplay.label.tdVisitCycleInWeeksLabel = '';
            this.uiDisplay.label.tdVisitsPerCycleLabel = '';
            this.uiDisplay.ServiceVisitFrequency = false;
            this.uiDisplay.VisitCycleInWeeks = false;
            this.uiDisplay.VisitsPerCycle = false;
            this.uiDisplay.trCompliance = false;
        }
        this.riGrid.HidePageNumber = true;
    };
    PlanVisitGridYearComponent.prototype.updateViewOption = function (params) {
        switch (this.inputParams.parentMode) {
            case 'ServiceCover':
            case 'PlanVisitTabular':
            case 'ServiceVisitMaintenance':
            case 'byServiceCoverRowID':
            case 'ServiceCoverAnnualCalendar':
            case 'DespatchGrid':
                this.ServiceCoverLoad();
                break;
            default:
                this.errMsg = 'error invalid parent mode!';
        }
    };
    PlanVisitGridYearComponent.prototype.BuildYearOptions = function () {
        var today = new Date();
        var yyyy = today.getFullYear();
        for (var i = 1; i < 21; i++) {
            this.yearList.push({ 'text': (yyyy - 11 + i), 'value': (yyyy - 11 + i) });
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelectedYear', yyyy);
    };
    PlanVisitGridYearComponent.prototype.doLookup = function () {
        var _this = this;
        var lookupIP = [{
                'table': 'ServiceCover',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                    'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode')
                },
                'fields': ['ServiceCoverNumber', 'ContractNumber', 'PremiseNumber', 'ProductCode', 'ServiceVisitFrequency', 'VisitCycleInWeeks', 'VisitsPerCycle']
            }];
        var lookupIPSub = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')
                },
                'fields': ['ContractName']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
                },
                'fields': ['PremiseName']
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode')
                },
                'fields': ['ProductDesc']
            }
        ];
        this.subLookup = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            _this.logger.log('Lookup 1:', data);
            if (data.length > 0 && data[0].length > 0) {
                var result = data[0][0];
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceCoverNumber', result.ServiceCoverNumber);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceVisitFrequency', result.ServiceVisitFrequency);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'VisitCycleInWeeks', result.VisitCycleInWeeks);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'VisitsPerCycle', result.VisitsPerCycle);
            }
            _this.buildGrid();
        });
        this.subLookup2 = this.LookUp.lookUpRecord(lookupIPSub).subscribe(function (data) {
            _this.logger.log('Lookup 2:', data);
            if (data.length > 0 && data[0].length > 0) {
                var resultContract = data[0];
                var resultPremise = data[1];
                var resultProduct = data[2];
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', resultContract[0].ContractName);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', resultPremise[0].PremiseName);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', resultProduct[0].ProductDesc);
            }
        });
    };
    PlanVisitGridYearComponent.prototype.ServiceCoverLoad = function () {
        if (this.blnFromComplianceReport) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'chkIntervalTooShort', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'IntervalTooShort', true, true));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'chkIntervalTooLong', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'IntervalTooLong', true, true));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'chkVisitsTooLow', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'VisitsTooLow', true, true));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'chkVisitsTooHigh', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'VisitsTooHigh', true, true));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'IntervalShortFirstDate', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'IntervalShortFirstDate', true));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'IntervalLongFirstDate', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'IntervalLongFirstDate', true));
        }
        this.search.set('level', 'ServiceCoverYear');
        this.search.set('RowID', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ServiceCoverRowID', true));
        if (this.inputParams.parentMode === 'ServiceVisitMaintenance' || this.inputParams.parentMode === 'DespatchGrid') {
            this.attributes['ProductCode']['ServiceCoverRowID'] = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ServiceCoverRowID', true);
        }
        else if (this.inputParams.parentMode === 'byServiceCoverRowID') {
            this.attributes['BusinessCode']['ServiceCoverRowID'] = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ServiceCoverRowID', true);
        }
        else if (this.inputParams.parentMode === 'ServiceCoverAnnualCalendar') {
            this.attributes['ProductCode']['ServiceCoverRowID'] = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ServiceCoverRowID', true);
            this.PremiseNumberValue = this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'PremiseNumber');
            this.PremiseNameValue = this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'PremiseName');
        }
        else {
            this.attributes['ServiceCover'] = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ServiceCoverRowID', true);
        }
    };
    PlanVisitGridYearComponent.prototype.BuildMenuAddOption = function (rstrValue, rstrText) {
        this.menuList.push({ 'text': rstrText, 'value': rstrValue });
    };
    PlanVisitGridYearComponent.prototype.BuildViewTypeOption = function (strValue, strText) {
        this.viewTypeList.push({ 'text': strText, 'value': strValue });
    };
    PlanVisitGridYearComponent.prototype.BuildMenuOptions = function () {
        this.BuildMenuAddOption('Options', 'Options');
        this.BuildMenuAddOption('AddPlanVisit', 'Add Plan Visit');
        this.BuildMenuAddOption('ViewTelesalesOrderLineGrid', 'Telesales Order Line Grid');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'menu', 'Options');
        if (this.vbEnableInstallsRemovals) {
            this.BuildViewTypeOption('Unit', 'Number Of Units');
        }
        this.BuildViewTypeOption('Visit', 'Visit Type');
        if (this.vbEnableWED) {
            this.BuildViewTypeOption('WED', 'W.E.D.');
        }
        this.BuildViewTypeOption('Time', 'Time');
        this.BuildViewTypeOption('Value', 'Nett Value');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ViewTypeFilter', 'Visit');
    };
    PlanVisitGridYearComponent.prototype.ViewTypeFilter_onchange = function (param) {
        this.logger.log('ViewTypeFilter_onchange: ', param);
        this.maxColumn = 35;
        if (param === 'Time') {
            this.maxColumn = 34;
        }
        if (param === 'Value') {
            this.maxColumn = 34;
        }
        this.riGrid.ResetGrid();
    };
    PlanVisitGridYearComponent.prototype.YearFilter_onchange = function (param) {
    };
    PlanVisitGridYearComponent.prototype.menu_onchange = function (menu_ChangeValue) {
        this.logger.log('menu_ChangeValue: ', menu_ChangeValue);
        this.ContractNumberSelectedDateValue = '';
        switch (menu_ChangeValue) {
            case 'AddPlanVisit':
                alert('Navigate to iCABSSePlanVisitMaintenance2, this page is not developed yet.');
                break;
            case 'Premise':
                this.showAlert('Page under construction');
                break;
        }
    };
    PlanVisitGridYearComponent.prototype.cmd_TabularView_onclick = function () {
        if (this.vbEnableTabularView) {
            if (this.inputParams.parentMode === 'PlanVisitTabular') {
                this.location.back();
            }
            else {
                var self_1 = { ServiceCoverRowID: this.inputParams.ServiceCover };
                var pageObj = this.riExchange.createPageObject(this.uiForm, this.controls, self_1);
                this.riExchange.initBridge(pageObj);
                this.router.navigate(['grid/application/premise/planVisit'], {
                    queryParams: {
                        'parentMode': 'PlanVisitGridYear',
                        'CurrentContractTypeURLParameter': this.routeParams.CurrentContractTypeURLParameter,
                        'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                        'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                        'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
                        'ServiceCoverRowIDattrProdCodeParent': this.attributes['ServiceCover']
                    }
                });
            }
        }
    };
    PlanVisitGridYearComponent.prototype.showAlert = function (msgTxt, type) {
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
    PlanVisitGridYearComponent.prototype.refresh = function () {
        this.riGrid.RefreshRequired();
        this.buildGrid();
    };
    PlanVisitGridYearComponent.prototype.buildGrid = function () {
        var iLoop = 1;
        this.riGrid.Clear();
        this.riGrid.AddColumn('Month', 'PlanVisit', 'Month', MntConst.eTypeText, 20);
        for (iLoop = 1; iLoop <= 31; iLoop++) {
            this.riGrid.AddColumn(iLoop.toString(), 'PlanVisit', iLoop.toString(), MntConst.eTypeText, 1);
            switch (this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewTypeFilter')) {
                case 'Time':
                case 'Value':
                    this.riGrid.AddColumnAlign(iLoop.toString(), MntConst.eAlignmentRight);
                    break;
                default:
                    this.riGrid.AddColumnAlign(iLoop.toString(), MntConst.eAlignmentCenter);
            }
        }
        if (!(this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewTypeFilter') === 'Time' || this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewTypeFilter') === 'Value')) {
            this.riGrid.AddColumn('Total', 'PlanVisit', 'Total', MntConst.eTypeText, 20);
            this.riGrid.AddColumnAlign('Total', MntConst.eAlignmentCenter);
        }
        this.riGrid.AddColumn('TotalMonthTimeValue', 'PlanVisit', 'TotalMonthNettValue', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('TotalMonthTimeValue', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('TotalMonthNettValue', 'PlanVisit', 'TotalMonthNettValue', MntConst.eTypeCurrency, 10);
        this.riGrid.AddColumnAlign('TotalMonthNettValue', MntConst.eAlignmentRight);
        this.riGrid.Complete();
        this.riGrid_beforeExecute();
    };
    PlanVisitGridYearComponent.prototype.riGrid_beforeExecute = function () {
        var _this = this;
        this.riGrid.Update = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateHeader = true;
        var gridHandle = (Math.floor(Math.random() * 900000) + 100000).toString();
        var strGridData = true;
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set('riCacheRefresh', 'True');
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', gridHandle);
        this.search.set('year', this.riExchange.riInputElement.GetValue(this.uiForm, 'SelectedYear'));
        var filterType = this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewTypeFilter');
        this.search.set('ViewTypeFilter', filterType);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.method, this.module, this.operation, this.search).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data) {
                if (data && data.errorMessage) {
                    _this.messageModal.show(data, true);
                }
                else {
                    _this.curPage = 1;
                    _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    _this.riGrid.Update = true;
                    _this.riGrid.UpdateBody = true;
                    _this.riGrid.UpdateFooter = true;
                    _this.riGrid.UpdateHeader = true;
                    _this.riGrid.Execute(data);
                }
            }
        }, function (error) {
            _this.logger.log('Error', error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PlanVisitGridYearComponent.prototype.getCurrentPage = function (currentPage) {
        this.curPage = currentPage.value;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_beforeExecute();
    };
    PlanVisitGridYearComponent.prototype.riGrid_AfterExecute = function () {
        var _this = this;
        var iLoop;
        var oTR, oTD;
        var iBeforeCurrentMonth;
        var iAfterCurrentMonth;
        for (iLoop = 1; iLoop <= 31; iLoop++) {
        }
        var obj = this.riGrid.HTMLGridBody.children[0].children[0].getAttribute('additionalproperty');
        if (obj) {
            setTimeout(function () {
                _this.uiDisplay.legend = [];
                var legend = obj.split('bgcolor=');
                for (var i = 0; i < legend.length; i++) {
                    var str = legend[i];
                    if (str.indexOf('"#') >= 0) {
                        _this.uiDisplay.legend.push({
                            color: str.substr(str.indexOf('"#') + 1, 7),
                            label: str.substr(str.indexOf('<td>') + 4, str.substr(str.indexOf('<td>') + 4).indexOf('&'))
                        });
                    }
                }
            }, 100);
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
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalVisits', TotalString[0]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalUnits', TotalString[1]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalTime', TotalString[2]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalNettValue', (TotalString[3]) ? this.utils.cCur(TotalString[3]) : '');
        if (this.vbEnableWED) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalWED', TotalString[4]);
        }
    };
    PlanVisitGridYearComponent.prototype.tbodyPlanVisit_onDblClick = function (event) {
        var arrSelection;
        var currentCellIndex = this.riGrid.CurrentCell;
        if (currentCellIndex !== 0) {
            if (event.srcElement.getAttribute('additionalproperty') !== 'Month') {
                var currentRowIndex = this.riGrid.CurrentRow;
                var cellData = this.riGrid.bodyArray[currentRowIndex][0];
                arrSelection = cellData.rowID.split(' ');
                if (!Array.isArray(arrSelection) || arrSelection.length < 1) {
                    this.messageModal.show({ msg: MessageConstant.PageSpecificMessage.Error_month_year, title: 'Error' }, false);
                }
                var iSelectedDay = (currentCellIndex > 0 && currentCellIndex < 32) ? currentCellIndex : 1;
                var iSelectedMonth = arrSelection[0];
                var iSelectedYear = arrSelection[1];
                this.SelectedDate = new Date(iSelectedYear, iSelectedMonth, iSelectedDay);
                if (event.srcElement.getAttribute('additionalproperty') === 'x') {
                    alert('Navigate to iCABSSePlanVisitMaintenance2 when available');
                }
                else {
                    var addData = event.srcElement.getAttribute('additionalproperty');
                    if (window['moment'](addData, 'DD/MM/YYYY', true).isValid()) {
                        addData = this.utils.convertDate(addData);
                    }
                    else {
                        addData = this.utils.formatDate(addData);
                    }
                    var addDate = new Date(addData);
                    if (addDate.toString() === 'Invalid Date') {
                        this.router.navigate(['maintenance/planvisit'], {
                            queryParams: {
                                parentMode: 'Year',
                                PlanVisitRowID: event.srcElement.getAttribute('additionalproperty'),
                                CurrentContractTypeURLParameter: this.routeParams.CurrentContractTypeURLParameter,
                                ServiceCoverRowID: event.srcElement.getAttribute('additionalproperty')
                            }
                        });
                    }
                    else {
                        this.router.navigate(['grid/application/contract/planVisitGridDay'], {
                            queryParams: {
                                parentMode: 'Year',
                                CurrentContractTypeURLParameter: this.routeParams.CurrentContractTypeURLParameter,
                                ServiceCoverRowID: this.routeParams.ServiceCoverRowID,
                                PlanVisitRowID: this.routeParams.ServiceCoverRowID,
                                ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                                PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                                ProductCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
                                SelectedDate: event.srcElement.getAttribute('additionalproperty')
                            }
                        });
                    }
                }
            }
        }
        else {
            this.messageModal.show({ msg: MessageConstant.Message.NoData, title: 'Error' }, false);
        }
    };
    PlanVisitGridYearComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAPlanVisitGridYear.html'
                },] },
    ];
    PlanVisitGridYearComponent.ctorParameters = [
        { type: AjaxObservableConstant, },
        { type: HttpService, },
        { type: Logger, },
        { type: Utils, },
        { type: SpeedScript, },
        { type: ErrorService, },
        { type: ServiceConstants, },
        { type: Router, },
        { type: ActivatedRoute, },
        { type: LocaleTranslationService, },
        { type: RiExchange, },
        { type: FormBuilder, },
        { type: LookUp, },
        { type: SysCharConstants, },
        { type: Location, },
    ];
    PlanVisitGridYearComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
        'gridPagination': [{ type: ViewChild, args: ['gridPagination',] },],
    };
    return PlanVisitGridYearComponent;
}());
