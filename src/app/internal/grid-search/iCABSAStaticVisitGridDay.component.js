import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { Logger } from '@nsalaun/ng2-logger';
import { Http, URLSearchParams } from '@angular/http';
import { LookUp } from './../../../shared/services/lookup';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { AccountPremiseSearchComponent } from './iCABSAAccountPremiseSearchGrid';
import { ContractSearchComponent } from './../search/iCABSAContractSearch';
import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { Store } from '@ngrx/store';
import { LocalStorageService } from 'ng2-webstorage';
import { TranslateService } from 'ng2-translate';
import { Utils } from '../../../shared/services/utility';
import { SpeedScript } from '../../../shared/services/speedscript';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { Location } from '@angular/common';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
export var StaticVisitGridDayComponent = (function () {
    function StaticVisitGridDayComponent(componentInteractionService, translate, ls, http, httpService, localeTranslateService, sysCharConstants, activatedRoute, ajaxconstant, logger, utils, LookUp, SpeedScript, serviceConstants, store, location, router) {
        var _this = this;
        this.componentInteractionService = componentInteractionService;
        this.translate = translate;
        this.ls = ls;
        this.http = http;
        this.httpService = httpService;
        this.localeTranslateService = localeTranslateService;
        this.sysCharConstants = sysCharConstants;
        this.activatedRoute = activatedRoute;
        this.ajaxconstant = ajaxconstant;
        this.logger = logger;
        this.utils = utils;
        this.LookUp = LookUp;
        this.SpeedScript = SpeedScript;
        this.serviceConstants = serviceConstants;
        this.store = store;
        this.location = location;
        this.router = router;
        this.contractComponent = ContractSearchComponent;
        this.contractComponentParams = {
            'parentMode': 'Contract',
            'pageTitle': 'Customer Contact Search',
            'showBusinessCode': false,
            'showCountryCode': false
        };
        this.accountPremise = AccountPremiseSearchComponent;
        this.inputParamsAccountPremise = {
            'parentMode': 'LookUp',
            'pageTitle': 'Premise Search'
        };
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.totalItems = 1;
        this.ajaxSource = new BehaviorSubject(0);
        this.dueDateDisplay = true;
        this.dueMonthDisplay = true;
        this.dueContractDisplay = true;
        this.duePremisetDisplay = true;
        this.backLinkText = '';
        this.GridPageSize = 20;
        this.query = new URLSearchParams();
        this.inputParams = {
            'parentMode': '',
            'businessCode': '',
            'countryCode': '',
            'operation': 'Application/iCABSAStaticVisitGridDay',
            'module': 'plan-visits',
            'method': 'service-planning/maintenance',
            'action': '2',
            'currentContractType': ''
        };
        this.businessCode = this.utils.getBusinessCode();
        this.countryCode = this.utils.getCountryCode();
        this.inputParams.businessCode = this.businessCode;
        this.inputParams.countryCode = this.countryCode;
        this.componentInteractionService.emitMessage(false);
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            _this.storeData = data;
            _this.setFormData(_this.storeData);
        });
    }
    StaticVisitGridDayComponent.prototype.onPremiseSearchDataReceived = function (data) {
        this.PremiseNumber = data.PremiseNumber;
        this.PremiseName = data.PremiseName;
    };
    StaticVisitGridDayComponent.prototype.onContractDataReceived = function (data, route) {
        this.contractData = data;
        this.ContractNumber = data.ContractNumber;
        this.ContractName = data.ContractName;
        this.dueContractDisplay = true;
        this.duePremisetDisplay = false;
        this.contractLoad();
        this.getUrlParams();
    };
    StaticVisitGridDayComponent.prototype.ngOnInit = function () {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.itemsPerPage = this.GridPageSize;
        this.getSysCharDtetails();
        this.riGrid.PageSize = this.itemsPerPage;
    };
    StaticVisitGridDayComponent.prototype.buildGrid = function () {
        this.riGrid.Clear();
        this.riGrid.AddColumn('BranchServiceAreaCode', 'StaticVisit', 'BranchServiceAreaCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumnAlign('BranchServiceAreaCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('BranchServiceAreaCode', true);
        this.riGrid.AddColumn('EmployeeCode', 'StaticVisit', 'EmployeeCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumnAlign('EmployeeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('BranchServiceAreaSeqNo', 'StaticVisit', 'BranchServiceAreaSeqNo', MntConst.eTypeInteger, 6);
        this.riGrid.AddColumnAlign('BranchServiceAreaSeqNo', MntConst.eAlignmentCenter);
        if (this.DateType === 'Month') {
            this.riGrid.AddColumn('StaticVisitDate', 'StaticVisit', 'StaticVisitDate', MntConst.eTypeDate, 10);
            this.riGrid.AddColumnAlign('StaticVisitDate', MntConst.eAlignmentCenter);
            this.riGrid.AddColumnOrderable('StaticVisitDate', true);
        }
        if (this.inputParams.parentMode === 'Contract') {
            this.riGrid.AddColumn('PremiseNumber', 'StaticVisit', 'PremiseNumber', MntConst.eTypeInteger, 5);
            this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
            this.riGrid.AddColumn('PremiseName', 'StaticVisit', 'PremiseName', MntConst.eTypeText, 20);
            if (this.enablePostcodeDefaulting) {
                this.riGrid.AddColumn('PremisePostcode', 'StaticVisit', 'PremisePostcode', MntConst.eTypeCode, 10);
            }
        }
        this.riGrid.AddColumn('ProductCode', 'StaticVisit', 'ProductCode', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ProductCode', true);
        this.riGrid.AddColumn('ServiceVisitFrequency', 'StaticVisit', 'ServiceVisitFrequency', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumnAlign('ServiceVisitFrequency', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ServiceVisitFrequency', true);
        this.riGrid.AddColumn('ServiceQuantity', 'StaticVisit', 'ServiceQuantity', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumnAlign('ServiceQuantity', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServicMntConst.eTypeCode', 'StaticVisit', 'ServicMntConst.eTypeCode', MntConst.eTypeCode, 2);
        this.riGrid.AddColumnAlign('ServicMntConst.eTypeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ServicMntConst.eTypeCode', true);
        this.riGrid.AddColumn('LastVisitDate', 'StaticVisit', 'LastVisitDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('LastVisitDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('LastVisitTypeCode', 'StaticVisit', 'LastVisitTypeCode', MntConst.eTypeCode, 2);
        this.riGrid.AddColumnAlign('LastVisitTypeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('NextVisitDate', 'StaticVisit', 'NextVisitDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('NextVisitDate', MntConst.eAlignmentCenter);
        this.riGrid.Complete();
        this.riGrid_beforeExecute();
    };
    StaticVisitGridDayComponent.prototype.sortGrid = function (data) {
    };
    ;
    StaticVisitGridDayComponent.prototype.ngAfterViewInit = function () {
        this.backLinkText = GlobalConstant.Configuration.BackText;
    };
    ;
    StaticVisitGridDayComponent.prototype.ngOnDestroy = function () {
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
        if (this.querySubscription)
            this.querySubscription.unsubscribe();
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
    };
    ;
    StaticVisitGridDayComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [this.sysCharConstants.SystemCharEnablePostcodeDefaulting];
        var sysCharIP = {
            module: this.inputParams.module,
            operation: this.inputParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.SpeedScript.sysCharPromise(sysCharIP).then(function (data) {
            _this.enablePostcodeDefaulting = data.records[0].Required;
            _this.getUrlParams();
        });
    };
    StaticVisitGridDayComponent.prototype.getUrlParams = function () {
        var _this = this;
        this.querySubscription = this.activatedRoute.queryParams.subscribe(function (params) {
            if (params['parentMode'] !== undefined)
                _this.inputParams.parentMode = params['parentMode'];
            if (params['rowId'] !== undefined)
                _this.inputParams.rowId = params['rowId'];
            if (params['year'] !== undefined)
                _this.inputParams.year = params['year'];
            if (params['ContractNumber'] !== undefined)
                _this.ContractNumber = params['ContractNumber'];
            if (params['ContractName'] !== undefined)
                _this.ContractName = params['ContractName'];
            if (params['dueDate'] !== undefined) {
                _this.dueDate = params['dueDate'];
            }
            if (params['SelectedMonth'] !== undefined)
                _this.SelectedMonth = params['SelectedMonth'];
            if (params['SelectedYear'] !== undefined)
                _this.SelectedYear = params['SelectedYear'];
            if (params['year'] !== undefined)
                _this.SelectedYear = params['year'];
            if (params['GridPageSize'] !== undefined && params['GridPageSize'] !== '')
                _this.GridPageSize = params['GridPageSize'];
            if (params['PremiseNumber'] !== undefined && params['PremiseNumber'] !== '')
                _this.PremiseNumber = params['PremiseNumber'];
            if (params['PremiseName'] !== undefined)
                _this.PremiseName = params['PremiseName'];
            if (params['DateType'] !== undefined)
                _this.DateType = params['DateType'];
        });
        this.setFormDataFromUrl();
    };
    StaticVisitGridDayComponent.prototype.setFormDataFromUrl = function () {
        switch (this.inputParams.parentMode) {
            case 'Contract':
                this.dueContractDisplay = true;
                this.duePremisetDisplay = false;
                this.contractLoad();
                break;
            case 'Premise':
                this.duePremisetDisplay = false;
                this.premiseLoad();
                break;
            default:
                break;
        }
        this.buildGrid();
    };
    StaticVisitGridDayComponent.prototype.setFormData = function (data) {
        this.ContractNumber = data['data'].ContractNumber;
        this.ContractName = data['data'].ContractName;
        this.PremiseNumber = data['data'].PremiseNumber;
        this.PremiseName = data['data'].PremiseName;
        this.DateType = data['data'].DateType;
        this.PremiseRowID = data['data'].PremiseRowID;
        this.SelectedDate = data['data'].SelectedDate;
        this.SelectedMonth = data['data'].SelectedMonth;
        this.SelectedYear = data['data'].SelectedYear || this.inputParams.year;
        this.RowID = this.inputParams.rowId || this.storeData['data'].Contract;
        this.query.set('SelectedMonth', this.SelectedMonth);
        this.query.set('SelectedYear', this.SelectedYear);
        this.query.set('DateType', this.DateType);
        this.dueDateFormatted = this.formatDateMine(data['data'].SelectedDate);
        this.dueDate = this.utils.formatDate(data['data'].SelectedDate);
        this.query.set('Date', this.dueDate);
        switch (this.DateType) {
            case 'Day':
                this.dueDateDisplay = true;
                break;
            case 'Month':
                this.dueMonthDisplay = false;
                break;
            default:
                break;
        }
        switch (this.inputParams.parentMode) {
            case 'Contract':
                this.dueContractDisplay = false;
                this.contractLoad();
                break;
            case 'Premise':
                this.duePremisetDisplay = false;
                this.premiseLoad();
                break;
            default:
                break;
        }
    };
    StaticVisitGridDayComponent.prototype.contractLoad = function () {
        this.query.set('RowID', this.RowID);
        this.query.set('ContractNumber', this.ContractNumber);
        this.query.set('ContractName', this.ContractName);
        this.query.set('Level', 'ContractDay');
    };
    StaticVisitGridDayComponent.prototype.premiseLoad = function () {
        this.query.set('RowID', this.RowID);
        this.query.set('ContractNumber', this.ContractNumber);
        this.query.set('ContractName', this.ContractName);
        this.query.set('PremiseNumber', this.PremiseNumber);
        this.query.set('PremiseName', this.PremiseName);
        this.query.set('Level', 'PremiseDay');
    };
    StaticVisitGridDayComponent.prototype.formatDate = function (dateString) {
        var dateArr = dateString.split('/');
        var dateVal = '';
        var monthVal = '';
        var yearVal = '';
        var dateMonth = { 'january': 1, 'february': 2, 'march': 3, 'april': 4, 'may': 5, 'june': 6, 'july': 7, 'agust': 8, 'september': 9, 'october': 10, 'november': 11, 'december': 12 };
        dateVal = dateArr[0];
        monthVal = dateMonth[dateArr[1].toLowerCase()].toString();
        if (dateVal.length === 1)
            dateVal = '0' + dateVal;
        if (monthVal.length === 1)
            monthVal = '0' + monthVal;
        yearVal = dateArr[2];
        return dateVal + '/' + monthVal + '/' + yearVal;
    };
    StaticVisitGridDayComponent.prototype.riGrid_beforeExecute = function () {
        var _this = this;
        this.query.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.query.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.query.set('DateType', this.DateType);
        this.query.set('PremiseNumber', this.PremiseNumber);
        this.query.set('ContractNumber', this.ContractNumber);
        this.query.set('PageCurrent', this.currentPage.toString());
        this.query.set('PageSize', this.itemsPerPage.toString());
        this.query.set('Mode', this.inputParams.parentMode);
        this.query.set('action', this.inputParams.action);
        this.query.set('Level', 'ContractDay');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.query).subscribe(function (data) {
            if (data) {
                _this.riGrid.Update = true;
                _this.riGrid.Execute(data);
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    StaticVisitGridDayComponent.prototype.riGrid_afterExecute = function () {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
    };
    StaticVisitGridDayComponent.prototype.getGridInfo = function (value) {
        this.totalItems = value.totalRows;
    };
    StaticVisitGridDayComponent.prototype.getRefreshData = function () {
    };
    StaticVisitGridDayComponent.prototype.getCurrentPage = function (curPage) {
        this.query.set('PageCurrent', curPage.value);
        this.inputParams.search = this.query;
    };
    StaticVisitGridDayComponent.prototype.dblClickGridRow = function (data) {
        var _text = data.cellData['text'];
        var _Value = data.rowData['Value'];
        var _selected_column = '';
        for (var key in data.rowData) {
            if (data.rowData.hasOwnProperty(key)) {
                if (_text === data.rowData[key]) {
                    _selected_column = key;
                }
            }
        }
        if (this.inputParams.parentMode === 'Contract') {
            if (this.DateType === 'Month') {
                this.AddElementNumber = 3;
            }
            else {
                this.AddElementNumber = 2;
            }
        }
        else {
            this.AddElementNumber = 0;
        }
        switch (_selected_column) {
            case 'PremiseNumber':
            case 'ProductCode':
                this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], { queryParams: { parentMode: 'StaticVisit' } });
                break;
            default:
                break;
        }
    };
    StaticVisitGridDayComponent.prototype.onBackLinkClick = function (event) {
        event.preventDefault();
        this.location.back();
    };
    StaticVisitGridDayComponent.prototype.updateNumberOfRecord = function () {
        if (this.GridPageSize === '0' || this.GridPageSize.indexOf('-') !== -1 || this.GridPageSize.indexOf('.') !== -1) {
            this.itemsPerPage = 10;
            this.GridPageSize = 0;
        }
        else {
            this.itemsPerPage = this.GridPageSize;
        }
    };
    StaticVisitGridDayComponent.prototype.formatDateMine = function (date) {
        var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [month, day, year].join('/');
    };
    StaticVisitGridDayComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAStaticVisitGridDay.html'
                },] },
    ];
    StaticVisitGridDayComponent.ctorParameters = [
        { type: ComponentInteractionService, },
        { type: TranslateService, },
        { type: LocalStorageService, },
        { type: Http, },
        { type: HttpService, },
        { type: LocaleTranslationService, },
        { type: SysCharConstants, },
        { type: ActivatedRoute, },
        { type: AjaxObservableConstant, },
        { type: Logger, },
        { type: Utils, },
        { type: LookUp, },
        { type: SpeedScript, },
        { type: ServiceConstants, },
        { type: Store, },
        { type: Location, },
        { type: Router, },
    ];
    StaticVisitGridDayComponent.propDecorators = {
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
    };
    return StaticVisitGridDayComponent;
}());
