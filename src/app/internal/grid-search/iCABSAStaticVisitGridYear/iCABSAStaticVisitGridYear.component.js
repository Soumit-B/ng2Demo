import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { FormBuilder } from '@angular/forms';
import { Component, ViewChild, NgZone } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Logger } from '@nsalaun/ng2-logger';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Location } from '@angular/common';
import { LocaleTranslationService } from './../../../../shared/services/translation.service';
import { ErrorService } from '../../../../shared/services/error.service';
import { HttpService } from '../../../../shared/services/http-service';
import { AjaxObservableConstant } from '../../../../shared/constants/ajax-observable.constant';
import { MessageService } from '../../../../shared/services/message.service';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { RiExchange } from '../../../../shared/services/riExchange';
import { Utils } from '../../../../shared/services/utility';
import { SpeedScript } from '../../../../shared/services/speedscript';
import { SysCharConstants } from '../../../../shared/constants/syscharservice.constant';
import { ContractActionTypes } from './../../../actions/contract';
export var StaticVisitGridYearComponent = (function () {
    function StaticVisitGridYearComponent(ajaxconstant, route, router, serviceConstants, translate, fb, sysCharConstants, utils, logger, httpService, messageService, zone, SpeedScript, riExchange, store, location) {
        this.ajaxconstant = ajaxconstant;
        this.route = route;
        this.router = router;
        this.serviceConstants = serviceConstants;
        this.translate = translate;
        this.fb = fb;
        this.sysCharConstants = sysCharConstants;
        this.utils = utils;
        this.logger = logger;
        this.httpService = httpService;
        this.messageService = messageService;
        this.zone = zone;
        this.SpeedScript = SpeedScript;
        this.riExchange = riExchange;
        this.store = store;
        this.location = location;
        this.xhrParams = {
            module: 'plan-visits',
            method: 'service-planning/maintenance',
            operation: 'Application/iCABSAStaticVisitGridYear'
        };
        this.uiDisplay = {
            pageHeader: 'Static Visits',
            showContract: true,
            showPremise: true,
            showProduct: true,
            showtdTotalUnits: true,
            showtdTotalWED: true,
            readOnly: {
                ContractNumber: false,
                ContractName: false,
                PremiseNumber: false,
                PremiseName: false,
                ProductNumber: false,
                ProductName: false,
                TotalPremises: false,
                TotalUnits: false,
                tdTotalWED: false,
                TotalTime: false,
                TotalNettValue: false
            },
            legend: []
        };
        this.ContractObject = { type: '', label: '' };
        this.page = 1;
        this.search = new URLSearchParams();
        this.ajaxSource = new BehaviorSubject(0);
        this.totalRecords = 0;
        this.totalPageCount = 0;
        this.isRequesting = false;
        this.invalidParentMode = false;
        this.vEnableInstallsRemovals = false;
        this.vEnableWED = false;
        this.menuOptions = [];
        this.years = [];
        this.maxColumn = 35;
        this.itemsPerPage = 500;
        this.currentPage = 1;
        this.backLinkUrl = '';
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
    }
    StaticVisitGridYearComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.riExchange.getStore('contract');
        this.ajaxSubscription = this.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.zone.run(function () {
                    switch (event) {
                        case _this.ajaxconstant.START:
                            _this.isRequesting = true;
                            break;
                        case _this.ajaxconstant.COMPLETE:
                            _this.isRequesting = false;
                            break;
                    }
                });
            }
        });
        this.subRoute = this.route.queryParams.subscribe(function (params) {
            _this.routeParams = params;
        });
        this.utils.setTitle(this.uiDisplay.pageHeader);
        this.uiForm = this.fb.group({});
        this.initForm();
        this.translate.setUpTranslation();
        this.window_onload();
    };
    StaticVisitGridYearComponent.prototype.ngOnDestroy = function () {
        if (this.ajaxSource) {
            this.ajaxSource.unsubscribe();
        }
        if (this.ajaxSubscription) {
            this.ajaxSubscription.unsubscribe();
        }
        if (this.subSysChar) {
            this.subSysChar.unsubscribe();
        }
        if (this.translateSub) {
            this.translateSub.unsubscribe();
        }
        if (this.subRoute) {
            this.subRoute.unsubscribe();
        }
        this.riExchange.killStore();
    };
    StaticVisitGridYearComponent.prototype.ngAfterViewInit = function () {
        if (this.invalidParentMode) {
            this.invalidParentMode = false;
            this.showAlert('Invalid parent mode!');
        }
    };
    StaticVisitGridYearComponent.prototype.ngAfterViewChecked = function () {
    };
    StaticVisitGridYearComponent.prototype.initForm = function () {
        var controls = [
            'ContractNumber',
            'ContractName',
            'PremiseNumber',
            'PremiseName',
            'ProductNumber',
            'ProductName',
            'TotalPremises',
            'TotalUnits',
            'tdTotalWED',
            'TotalTime',
            'TotalNettValue',
            'ViewTypeFilter',
            'SelectedYear'
        ];
        for (var i = 0; i < controls.length; i++) {
            this.riExchange.riInputElement.Add(this.uiForm, controls[i]);
        }
    };
    StaticVisitGridYearComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [this.sysCharConstants.SystemCharEnableInstallsRemovals, this.sysCharConstants.SystemCharEnableWED];
        var sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.subSysChar = this.SpeedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records;
            _this.vEnableInstallsRemovals = record[0].Required;
            _this.vEnableWED = record[1].Required;
            _this.uiDisplay.showtdTotalUnits = _this.vEnableInstallsRemovals;
            _this.uiDisplay.showtdTotalWED = _this.vEnableWED;
            if (_this.vEnableWED) {
                _this.riExchange.riInputElement.Disable(_this.uiForm, 'tdTotalWED');
            }
            _this.BuildMenuOptions();
        });
    };
    StaticVisitGridYearComponent.prototype.window_onload = function () {
        this.getSysCharDtetails();
        this.ContractObject.type = this.routeParams.currentContractType;
        this.ContractObject.label = this.utils.getCurrentContractLabel(this.ContractObject.type);
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'TotalPremises');
        this.riExchange.riInputElement.Disable(this.uiForm, 'TotalUnits');
        this.riExchange.riInputElement.Disable(this.uiForm, 'TotalTime');
        this.riExchange.riInputElement.Disable(this.uiForm, 'TotalNettValue');
        this.BuildYearOptions();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelectedYear', this.years[this.years.length - 11]);
        var ParentMode = this.riExchange.ParentMode(this.routeParams);
        switch (ParentMode) {
            case 'Contract':
                this.uiDisplay.showContract = true;
                this.uiDisplay.showPremise = false;
                this.uiDisplay.showProduct = false;
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractNumber');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractName');
                var ContractRowID = this.riExchange.GetParentRowID(this.routeParams, 'Contract');
                if (ContractRowID === '') {
                    ContractRowID = this.riExchange.GetParentRowID(this.routeParams, 'ContractRowID');
                }
                this.search.set('RowID', ContractRowID);
                this.search.set('Level', 'Contract');
                break;
            case 'Premise':
                this.uiDisplay.showContract = true;
                this.uiDisplay.showPremise = true;
                this.uiDisplay.showProduct = false;
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractNumber');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractName');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'PremiseNumber');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'PremiseName');
                var PremiseRowID = this.riExchange.GetParentRowID(this.routeParams, 'Premise');
                if (PremiseRowID === '') {
                    PremiseRowID = this.riExchange.GetParentRowID(this.routeParams, 'PremiseRowID');
                }
                this.search.set('RowID', PremiseRowID);
                this.search.set('Level', 'Premise');
                break;
            case 'ServiceCover':
                this.uiDisplay.showContract = true;
                this.uiDisplay.showPremise = true;
                this.uiDisplay.showProduct = true;
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractNumber');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractName');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'PremiseNumber');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'PremiseName');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ProductCode');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ProductDesc');
                var ServiceCoverRowID = this.riExchange.GetParentRowID(this.routeParams, 'ServiceCover');
                if (ServiceCoverRowID === '') {
                    ServiceCoverRowID = this.riExchange.GetParentRowID(this.routeParams, 'ServiceCoverRowID');
                }
                this.search.set('RowID', ServiceCoverRowID);
                this.search.set('Level', 'ServiceCover');
                break;
            default:
                this.invalidParentMode = true;
        }
        if (ParentMode !== 'ServiceCover') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ViewTypeFilter', 'Premise');
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ViewTypeFilter', 'Visit');
        }
        this.riGrid.HidePageNumber = true;
        this.riGrid.ResetGrid();
        this.buildGrid();
    };
    StaticVisitGridYearComponent.prototype.BuildMenuOptions = function () {
        var ParentMode = this.riExchange.ParentMode(this.routeParams);
        if (this.vEnableInstallsRemovals) {
            this.menuOptions.push({ value: 'Unit', label: 'Number of Units' });
        }
        if (ParentMode !== 'ServiceCover') {
            this.menuOptions.push({ value: 'Premise', label: 'Number of Premises' });
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ViewTypeFilter', 'Premise');
            this.menuOptions.push({ value: 'Visit', label: 'Number of Visits' });
        }
        else {
            this.menuOptions.push({ value: 'Visit', label: 'Number of Visits' });
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ViewTypeFilter', 'Visit');
        }
        if (this.vEnableWED) {
            this.menuOptions.push({ value: 'WED', label: 'W.E.D.' });
        }
        this.menuOptions.push({ value: 'Time', label: 'Time' });
        this.menuOptions.push({ value: 'Value', label: 'Nett Value' });
    };
    StaticVisitGridYearComponent.prototype.onChangeEvent = function (e) {
        var mode = e.target.id;
        var selectedVal = e.target.value;
        this.riGrid.ResetGrid();
        this.buildGrid();
    };
    StaticVisitGridYearComponent.prototype.onSubmit = function () {
    };
    StaticVisitGridYearComponent.prototype.BuildYearOptions = function () {
        var start = (new Date()).getFullYear() - 10;
        for (var i = 0; i <= 20; i++) {
            this.years.push(start + i);
        }
    };
    StaticVisitGridYearComponent.prototype.showAlert = function (msgTxt, type) {
        var _this = this;
        var translation = this.translate.getTranslatedValue(msgTxt, null).toPromise();
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
        translation.then(function (resp) {
            try {
                _this.messageModal.show({ msg: resp, title: titleModal }, false);
            }
            catch (e) {
                console.log('Error', e);
            }
        });
    };
    StaticVisitGridYearComponent.prototype.getCurrentPage = function (data) {
        this.gridCurPage = data.value;
        this.riGrid_beforeExecute();
    };
    StaticVisitGridYearComponent.prototype.updateGridTitle = function () {
        var objList = document.querySelectorAll('.gridtable thead > tr:first-child > th span');
        if (objList) {
            for (var i = 0; i < objList.length; i++) {
                if (objList[i]) {
                    var txt = objList[i].innerHTML;
                    if (i > 0) {
                        objList[i].innerHTML = '';
                    }
                }
            }
        }
    };
    StaticVisitGridYearComponent.prototype.buildGrid = function () {
        var iLoop = 1;
        this.riGrid.Clear();
        this.riGrid.AddColumn('Month', 'StaticVisit', 'Month', MntConst.eTypeText, 20);
        for (iLoop = 1; iLoop <= 31; iLoop++) {
            this.riGrid.AddColumn(iLoop.toString(), 'StaticVisit', iLoop.toString(), MntConst.eTypeText, 1);
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
            this.riGrid.AddColumn('Total', 'StaticVisit', 'Total', MntConst.eTypeText, 20);
            this.riGrid.AddColumnAlign('Total', MntConst.eAlignmentRight);
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewTypeFilter') === 'Unit') {
            this.riGrid.AddColumn('TotalYTD', 'StaticVisit', 'TotalYTD', MntConst.eTypeText, 10);
            this.riGrid.AddColumnAlign('TotalYTD', MntConst.eAlignmentRight);
        }
        this.riGrid.AddColumn('TotalMonthTimeValue', 'StaticVisit', 'TotalMonthNettValue', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('TotalMonthTimeValue', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('TotalMonthNettValue', 'StaticVisit', 'TotalMonthNettValue', MntConst.eTypeCurrency, 10);
        this.riGrid.AddColumnAlign('TotalMonthNettValue', MntConst.eAlignmentRight);
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewTypeFilter') === 'Value') {
            this.riGrid.AddColumn('TotalYTDNetValue', 'StaticVisit', 'TotalYTDNetValue', MntConst.eTypeCurrency, 10);
            this.riGrid.AddColumnAlign('TotalYTDNetValue', MntConst.eAlignmentRight);
        }
        this.riGrid.Complete();
        this.riGrid_beforeExecute();
    };
    StaticVisitGridYearComponent.prototype.riGrid_beforeExecute = function () {
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
        this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, this.search).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data) {
                if (data && data.errorMessage) {
                    _this.messageModal.show(data, true);
                }
                else {
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
    StaticVisitGridYearComponent.prototype.riGrid_AfterExecute = function () {
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
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalPremises', TotalString[0]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalUnits', TotalString[1]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalTime', TotalString[2]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalNettValue', (TotalString[3]) ? this.utils.cCur(TotalString[3]) : '');
        if (this.vEnableWED) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'tdTotalWED', TotalString[4]);
        }
    };
    StaticVisitGridYearComponent.prototype.riGrid_BodyOnDblClick = function (ev) {
        var currentRowIndex = this.riGrid.CurrentRow;
        var currentCellIndex = this.riGrid.CurrentCell;
        var cellData = this.riGrid.bodyArray[currentRowIndex][currentCellIndex];
        var ParentMode = this.riExchange.ParentMode(this.routeParams);
        if (ParentMode !== 'ServiceCover') {
            var date = (currentCellIndex > 0 && currentCellIndex < 32) ? currentCellIndex : 1;
            var month = cellData.rowID.split(' ')[0];
            var year = cellData.rowID.split(' ')[1];
            var mode = (cellData.additionalData === 'Day' || cellData.additionalData === 'Month') ? cellData.additionalData : '';
            var payload = {};
            var ContractRowID = this.riExchange.GetParentRowID(this.routeParams, 'Contract');
            if (ContractRowID === '') {
                ContractRowID = this.riExchange.GetParentRowID(this.routeParams, 'ContractRowID');
            }
            var dateNum = this.utils.numberPadding(date, 2);
            var monthNum = this.utils.numberPadding(currentRowIndex + 1, 2);
            switch (mode) {
                case 'Day':
                    payload = {
                        ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                        ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
                        PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                        PremiseName: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName'),
                        DateType: mode,
                        SelectedDate: monthNum + '/' + dateNum + '/' + this.uiForm.controls['SelectedYear'].value,
                        RowID: ContractRowID,
                        PremiseRowID: this.riExchange.GetParentRowID(this.routeParams, 'PremiseRowID'),
                        ServiceRowID: this.riExchange.GetParentRowID(this.routeParams, 'ServiceCoverRowID')
                    };
                    this.riExchange.setStore(ContractActionTypes.SAVE_MODE, payload, false);
                    this.router.navigate(['grid/application/service/staticVisitGridDay'], {
                        queryParams: {
                            parentMode: ParentMode,
                            rowId: ContractRowID,
                            year: year,
                            currentContractType: this.ContractObject.type
                        }
                    });
                    break;
                case 'Month':
                    payload = {
                        ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                        ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
                        PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                        PremiseName: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName'),
                        DateType: mode,
                        SelectedDate: monthNum + '/' + dateNum + '/' + year,
                        SelectedMonth: month,
                        SelectedYear: year,
                        RowID: ContractRowID,
                        PremiseRowID: this.riExchange.GetParentRowID(this.routeParams, 'PremiseRowID'),
                        ServiceRowID: this.riExchange.GetParentRowID(this.routeParams, 'ServiceCoverRowID')
                    };
                    this.riExchange.setStore(ContractActionTypes.SAVE_MODE, payload, false);
                    this.router.navigate(['grid/application/service/staticVisitGridDay'], {
                        queryParams: {
                            parentMode: ParentMode,
                            rowId: ContractRowID,
                            year: year,
                            currentContractType: this.ContractObject.type
                        }
                    });
                    break;
                default:
                    this.showAlert('No data to show!');
            }
        }
    };
    StaticVisitGridYearComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAStaticVisitGridYear.html',
                    providers: [ErrorService, MessageService]
                },] },
    ];
    StaticVisitGridYearComponent.ctorParameters = [
        { type: AjaxObservableConstant, },
        { type: ActivatedRoute, },
        { type: Router, },
        { type: ServiceConstants, },
        { type: LocaleTranslationService, },
        { type: FormBuilder, },
        { type: SysCharConstants, },
        { type: Utils, },
        { type: Logger, },
        { type: HttpService, },
        { type: MessageService, },
        { type: NgZone, },
        { type: SpeedScript, },
        { type: RiExchange, },
        { type: Store, },
        { type: Location, },
    ];
    StaticVisitGridYearComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
        'staticVisitGridYearPagination': [{ type: ViewChild, args: ['staticVisitGridYearPagination',] },],
    };
    return StaticVisitGridYearComponent;
}());
