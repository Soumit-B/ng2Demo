import { Component, NgZone, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../../shared/services/http-service';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { CallCenterActionTypes } from '../../../actions/call-centre-search';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { Utils } from '../../../../shared/services/utility';
import { RiExchange } from '../../../../shared/services/riExchange';
export var CallCenterGridHistoryComponent = (function () {
    function CallCenterGridHistoryComponent(zone, fb, route, router, store, httpService, utils, serviceConstants, riExchange) {
        this.zone = zone;
        this.fb = fb;
        this.route = route;
        this.router = router;
        this.store = store;
        this.httpService = httpService;
        this.utils = utils;
        this.serviceConstants = serviceConstants;
        this.riExchange = riExchange;
        this.fieldVisibility = {
            HistorySelectedContractPremise: true,
            CmdHistoryClearSelected: true,
            HistoryType: true,
            FurtherRecords: false
        };
        this.dateObjectsEnabled = {
            HistoryFromDate: true,
            HistoryToDate: true
        };
        this.dateObjects = {
            HistoryToDate: new Date(),
            HistoryFromDate: new Date()
        };
        this.historyToDateDisplay = '';
        this.historyFromDateDisplay = '';
        this.search = new URLSearchParams();
        this.queryGrid = {
            operation: 'ContactManagement/iCABSCMCallCentreGrid',
            module: 'call-centre',
            method: 'ccm/maintenance',
            contentType: 'application/x-www-form-urlencoded'
        };
        this.itemsPerPage = 10;
        this.pageSize = 10;
        this.currentPage = 1;
        this.paginationCurrentPage = 1;
        this.inputParams = {};
        this.maxColumns = 10;
        this.gridSortHeaders = [];
        this.headerProperties = [];
        this.initComplete = false;
        this.formGroup = this.fb.group({
            HistorySelectedContractPremise: [{ value: '', disabled: false }],
            CmdHistoryClearSelected: [{ value: '', disabled: false }],
            HistoryType: [{ value: 'effective', disabled: false }],
            HistoryFromDate: [{ value: '', disabled: false }],
            HistoryToDate: [{ value: '', disabled: false }]
        });
    }
    CallCenterGridHistoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.storeSubscription = this.store.select('callcentresearch').subscribe(function (data) {
            _this.storeData = data;
            if (data && data['action']) {
                switch (data['action']) {
                    case CallCenterActionTypes.BUILD_SPECIFIC_GRID:
                        if (_this.storeData['gridToBuild'].indexOf('History') > -1) {
                            _this.loadGridView();
                        }
                        break;
                    case CallCenterActionTypes.CLEAR_SPECIFIC_GRID:
                        if (_this.storeData['gridToClear'].indexOf('History') > -1) {
                            _this.historyGrid.clearGridData();
                        }
                        break;
                    case CallCenterActionTypes.RESET_ALL_SEARCH_DETAILS:
                        _this.resetDate();
                        break;
                    case CallCenterActionTypes.SET_PAGINATION:
                        if (_this.storeData['storeSavedData']['pagination']) {
                            _this.currentPage = _this.storeData['storeSavedData']['pagination'].tabHistory;
                        }
                        break;
                    default:
                        break;
                }
            }
        });
    };
    CallCenterGridHistoryComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.store.dispatch({
            type: CallCenterActionTypes.FORM_GROUP, payload: {
                tabHistory: this.formGroup
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                tabHistory: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_DATE_VISIBILITY, payload: {
                tabHistory: this.dateObjectsEnabled
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_DATE_OBJECTS, payload: {
                tabHistory: this.dateObjects
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.INITIALIZATION, payload: {
                tabHistory: true
            }
        });
        setTimeout(function () {
            _this.initComplete = true;
        }, 100);
    };
    CallCenterGridHistoryComponent.prototype.ngOnDestroy = function () {
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    CallCenterGridHistoryComponent.prototype.getCurrentPage = function (event) {
        this.currentPage = event.value;
        this.refresh();
    };
    CallCenterGridHistoryComponent.prototype.getGridInfo = function (info) {
        var _this = this;
        this.totalRecords = info.totalRows;
        setTimeout(function () {
            _this.paginationCurrentPage = _this.currentPage;
        }, 0);
    };
    CallCenterGridHistoryComponent.prototype.onGridRowClick = function (data) {
        this.onGridCellClick(data);
        if (data.cellIndex === (this.maxColumns - 1)) {
            if (this.storeData['otherParams'].otherVariables.CurrentHistoryRowid !== '') {
                this.router.navigate(['/maintenance/contractHistoryDetail'], { queryParams: {
                        parentMode: 'CallCentreSearch',
                        AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
                        ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
                        PremiseNumber: this.storeData['otherParams'].otherVariables.PremiseNumber,
                        ProductCode: this.storeData['otherParams'].otherVariables.ProductCode,
                        ProductDesc: this.storeData['otherParams'].otherVariables.ProductDesc,
                        CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID,
                        ContractHistoryRowID: this.storeData['otherParams'].otherVariables.CurrentHistoryRowid
                    } });
            }
        }
    };
    CallCenterGridHistoryComponent.prototype.onGridCellClick = function (data) {
        this.storeData['otherParams'].otherVariables.CurrentHistoryRowid = data.trRowData[0].rowID;
    };
    CallCenterGridHistoryComponent.prototype.refresh = function () {
        this.loadGridView();
    };
    CallCenterGridHistoryComponent.prototype.setGridSettings = function () {
        var lAccountLevel;
        if (!this.formGroup.controls['HistorySelectedContractPremise'].value) {
            this.maxColumns = 6;
        }
        else {
            this.maxColumns = 15;
        }
        this.setGridHeaders();
    };
    CallCenterGridHistoryComponent.prototype.setGridHeaders = function () {
        var obj = [];
        this.gridSortHeaders = obj;
        this.headerProperties = [
            {
                'align': 'center',
                'width': '120px',
                'index': 0
            }
        ];
    };
    CallCenterGridHistoryComponent.prototype.sortGrid = function (data) {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.loadGridView();
    };
    CallCenterGridHistoryComponent.prototype.loadGridView = function () {
        this.setGridSettings();
        var urlParams = this.riExchange.getRouterUrlParams();
        this.inputParams.module = this.queryGrid.module;
        this.inputParams.method = this.queryGrid.method;
        this.inputParams.operation = this.queryGrid.operation;
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
        this.search.set('GridName', 'History');
        this.search.set('AccountNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'AccountNumber'));
        this.search.set('ProspectNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'ProspectNumber'));
        this.search.set('ContractNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'HistorySelectedContract'));
        this.search.set('PremiseNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'HistorySelectedPremise'));
        this.search.set('HistoryType', this.formGroup.controls['HistoryType'] ? this.formGroup.controls['HistoryType'].value : '');
        this.search.set('HistoryFromDate', this.formGroup.controls['HistoryFromDate'].value);
        this.search.set('HistoryToDate', this.formGroup.controls['HistoryToDate'].value);
        this.search.set('riSortOrder', 'Ascending');
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('HeaderClickedColumn', '');
        this.search.set('PageSize', this.pageSize.toString());
        this.search.set('PageCurrent', this.currentPage.toString());
        this.inputParams.search = this.search;
        this.historyGrid.loadGridData(this.inputParams);
        this.storeData['pagination'].tabHistory = this.currentPage;
    };
    CallCenterGridHistoryComponent.prototype.historyFromDateSelectedValue = function (value) {
        if (value && value['value']) {
            this.historyFromDateDisplay = value['value'];
            this.formGroup.controls['HistoryFromDate'].setValue(this.historyFromDateDisplay);
            if (this.initComplete && this.storeData['allowAjaxOnDateChange'])
                this.loadGridView();
        }
        else {
            this.historyFromDateDisplay = '';
            this.formGroup.controls['HistoryFromDate'].setValue('');
        }
    };
    CallCenterGridHistoryComponent.prototype.historyToDateSelectedValue = function (value) {
        if (value && value['value']) {
            this.historyToDateDisplay = value['value'];
            this.formGroup.controls['HistoryToDate'].setValue(this.historyToDateDisplay);
            if (this.initComplete && this.storeData['allowAjaxOnDateChange'])
                this.loadGridView();
        }
        else {
            this.historyToDateDisplay = '';
            this.formGroup.controls['HistoryToDate'].setValue('');
        }
    };
    CallCenterGridHistoryComponent.prototype.cmdHistoryClearSelectedOnClick = function (event) {
        if (this.storeData['otherParams'].otherVariables.HistorySelectedContract !== '' && this.storeData['otherParams'].otherVariables.HistorySelectedPremise !== '') {
            this.storeData['otherParams'].otherVariables.HistorySelectedPremise = '';
            this.formGroup.controls['HistorySelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.HistorySelectedContract);
            this.loadGridView();
        }
        else if (this.storeData['otherParams'].otherVariables.HistorySelectedContract !== '') {
            this.storeData['otherParams'].otherVariables.HistorySelectedContract = '';
            this.storeData['otherParams'].otherVariables.HistorySelectedPremise = '';
            this.formGroup.controls['HistorySelectedContractPremise'].setValue('');
            this.loadGridView();
        }
    };
    CallCenterGridHistoryComponent.prototype.resetDate = function () {
        var date = new Date();
        this.dateObjects.HistoryFromDate = new Date(date.setDate(date.getDate() - this.storeData['otherParams'].registry.giHistoryFromDays));
        date = new Date();
        this.dateObjects.HistoryToDate = new Date(date.setDate(date.getDate() + this.storeData['otherParams'].registry.giHistoryFromDays));
    };
    CallCenterGridHistoryComponent.prototype.fetchTranslationContent = function () {
    };
    CallCenterGridHistoryComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-call-center-grid-history',
                    templateUrl: 'iCABSCMCallCentreGridHistory.html'
                },] },
    ];
    CallCenterGridHistoryComponent.ctorParameters = [
        { type: NgZone, },
        { type: FormBuilder, },
        { type: ActivatedRoute, },
        { type: Router, },
        { type: Store, },
        { type: HttpService, },
        { type: Utils, },
        { type: ServiceConstants, },
        { type: RiExchange, },
    ];
    CallCenterGridHistoryComponent.propDecorators = {
        'historyGrid': [{ type: ViewChild, args: ['historyGrid',] },],
    };
    return CallCenterGridHistoryComponent;
}());
