import { Component, NgZone, ViewChild, Renderer } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../../shared/services/http-service';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { CallCenterActionTypes } from '../../../actions/call-centre-search';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { Utils } from '../../../../shared/services/utility';
import { RiExchange } from '../../../../shared/services/riExchange';
export var CallCenterGridCallLogsComponent = (function () {
    function CallCenterGridCallLogsComponent(zone, fb, route, router, store, httpService, utils, serviceConstants, riExchange, renderer) {
        this.zone = zone;
        this.fb = fb;
        this.route = route;
        this.router = router;
        this.store = store;
        this.httpService = httpService;
        this.utils = utils;
        this.serviceConstants = serviceConstants;
        this.riExchange = riExchange;
        this.renderer = renderer;
        this.fieldVisibility = {
            CallLogsForm: false,
            CallLogSelectedContractPremise: true,
            CmdCallLogClearSelected: true,
            CallLogSearchOn: true,
            RiBPSUniqueNumber: true,
            CallLogUserName: true,
            CallLogCreatedDate: true,
            CallLogCreatedTime: true,
            TicketContractNumber: true,
            TicketContractName: true,
            TicketPremiseNumber: true,
            TicketPremiseName: true,
            TicketProductCode: true,
            TicketProductDesc: true,
            TicketPostcode: true,
            TicketContactName: true,
            TicketContactPosition: true,
            TicketContactTelephone: true,
            TicketContactMobile: true,
            TicketContactEmail: true,
            TicketContactFax: true,
            FurtherRecords: false
        };
        this.dateObjectsEnabled = {
            CallLogDate: true
        };
        this.dateObjects = {
            CallLogDate: new Date()
        };
        this.callLogDateDisplay = '';
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
        this.initComplete = false;
        this.initComplete = false;
        this.formGroup = this.fb.group({
            CallLogSelectedContractPremise: [{ value: '', disabled: false }],
            CmdCallLogClearSelected: [{ value: 'Clear', disabled: false }],
            CallLogSearchOn: [{ value: 'all', disabled: false }],
            CallLogSearchValue: [{ value: '', disabled: false }],
            CallLogDate: [{ value: '', disabled: false }],
            CallLogUserName: [{ value: '', disabled: false }],
            CallLogCreatedDate: [{ value: '', disabled: false }],
            CallLogCreatedTime: [{ value: '', disabled: false }],
            TicketContractNumber: [{ value: '', disabled: false }],
            TicketContractName: [{ value: '', disabled: false }],
            TicketPremiseNumber: [{ value: '', disabled: false }],
            TicketPremiseName: [{ value: '', disabled: false }],
            TicketProductCode: [{ value: '', disabled: false }],
            TicketProductDesc: [{ value: '', disabled: false }],
            TicketPostcode: [{ value: '', disabled: false }],
            TicketContactName: [{ value: '', disabled: false }],
            TicketContactPosition: [{ value: '', disabled: false }],
            TicketContactTelephone: [{ value: '', disabled: false }],
            TicketContactMobile: [{ value: '', disabled: false }],
            TicketContactEmail: [{ value: '', disabled: false }],
            TicketContactFax: [{ value: '', disabled: false }]
        });
    }
    CallCenterGridCallLogsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.setGridHeaders();
        this.storeSubscription = this.store.select('callcentresearch').subscribe(function (data) {
            _this.storeData = data;
            if (data && data['action']) {
                switch (data['action']) {
                    case CallCenterActionTypes.BUILD_SPECIFIC_GRID:
                        if (_this.storeData['gridToBuild'].indexOf('Logs') > -1) {
                            _this.loadGridView();
                        }
                        break;
                    case CallCenterActionTypes.CLEAR_SPECIFIC_GRID:
                        if (_this.storeData['gridToClear'].indexOf('Logs') > -1) {
                            _this.logsGrid.clearGridData();
                        }
                        break;
                    case CallCenterActionTypes.RESET_ALL_SEARCH_DETAILS:
                        _this.resetDate();
                        break;
                    case CallCenterActionTypes.SET_PAGINATION:
                        if (_this.storeData['storeSavedData']['pagination']) {
                            _this.currentPage = _this.storeData['storeSavedData']['pagination'].tabLogs;
                        }
                        break;
                    default:
                        break;
                }
            }
        });
    };
    CallCenterGridCallLogsComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.store.dispatch({
            type: CallCenterActionTypes.FORM_GROUP, payload: {
                tabLogs: this.formGroup
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                tabLogs: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_DATE_VISIBILITY, payload: {
                tabLogs: this.dateObjectsEnabled
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_DATE_OBJECTS, payload: {
                tabLogs: this.dateObjects
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.INITIALIZATION, payload: {
                tabLogs: true
            }
        });
        setTimeout(function () {
            _this.initComplete = true;
        }, 100);
    };
    CallCenterGridCallLogsComponent.prototype.ngOnDestroy = function () {
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    CallCenterGridCallLogsComponent.prototype.getCurrentPage = function (event) {
        this.currentPage = event.value;
        this.refresh();
    };
    CallCenterGridCallLogsComponent.prototype.getGridInfo = function (info) {
        var _this = this;
        this.totalRecords = info.totalRows;
        if (info.gridData && info.gridData.body && info.gridData.body.cells.length > 0) {
            this.onGridCellClick({
                trRowData: info.gridData.body.cells.slice(0, this.maxColumns),
                cellIndex: 0
            });
        }
        else {
            this.fieldVisibility.CallLogsForm = false;
        }
        setTimeout(function () {
            _this.paginationCurrentPage = _this.currentPage;
        }, 0);
    };
    CallCenterGridCallLogsComponent.prototype.onGridRowClick = function (data) {
        var _this = this;
        this.onGridCellClick(data);
        if (data.cellIndex === 0) {
            alert('Screen part of MVP 2');
        }
        else if (data.cellIndex === 1) {
            if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && (this.storeData['formGroup'].controls['VisibleCurrentCallLogID'].value === '' || this.storeData['formGroup'].controls['VisibleCurrentCallLogID'].value === '0')) {
                this.storeData['subject']['CmdNewCallSent'].asObservable().subscribe(function (recieved) {
                    if (recieved['type'] === 'Logs') {
                        alert('Screen part of MVP 2');
                    }
                    _this.storeData['subject']['CmdNewCallSent'].unsubscribe();
                });
                this.storeData['subject']['CmdNewCallRecieved'].next({
                    type: 'Logs'
                });
            }
            else {
                alert('Screen part of MVP 2');
            }
        }
        else if (data.cellIndex === 5) {
            if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && (this.storeData['formGroup'].controls['VisibleCurrentCallLogID'].value === '' || this.storeData['formGroup'].controls['VisibleCurrentCallLogID'].value === '0')) {
                this.storeData['subject']['CmdNewCallSent'].asObservable().subscribe(function (recieved) {
                    if (recieved['type'] === 'Logs') {
                        alert('Screen part of MVP 2');
                    }
                    _this.storeData['subject']['CmdNewCallSent'].unsubscribe();
                });
                this.storeData['subject']['CmdNewCallRecieved'].next({
                    type: 'Logs'
                });
            }
            else {
                alert('Screen part of MVP 2');
            }
        }
        else if (data.cellIndex === 6) {
            var tabText = document.querySelector('#tabCont .nav-tabs li.active a span')['innerText'];
            var parentMode = void 0;
            if (tabText === this.storeData['tabsTranslation'].tabLogs || tabText === this.storeData['tabsTranslation'].tabWorkOrders) {
                parentMode = 'PassTechnician';
            }
            else {
                parentMode = 'CallCentreSearch';
            }
            alert('Screen part of MVP 2');
        }
    };
    CallCenterGridCallLogsComponent.prototype.onGridCellClick = function (data) {
        var formArray = this.getRowAdditionalData(data.trRowData, 0);
        this.storeData['otherParams'].otherVariables.CustomerContactNumber = data.trRowData[1].text;
        this.storeData['otherParams'].otherVariables.CustomerContactRowID = data.trRowData[1].rowID;
        this.storeData['otherParams'].otherVariables.TechEmployeeCode = data.trRowData[6].text;
        this.storeData['otherParams'].otherVariables.SelectedCallLogID = data.trRowData[0].text;
        this.storeData['formGroup'].tabLogs.controls['CallLogUserName'].setValue(formArray[0]);
        this.storeData['formGroup'].tabLogs.controls['CallLogCreatedDate'].setValue(formArray[1]);
        this.storeData['formGroup'].tabLogs.controls['CallLogCreatedTime'].setValue(formArray[2]);
        this.storeData['otherParams'].otherVariables.SelectedTicketNumber = formArray[3];
        this.storeData['formGroup'].tabLogs.controls['TicketContractNumber'].setValue(formArray[4]);
        this.storeData['formGroup'].tabLogs.controls['TicketContractName'].setValue(formArray[5]);
        this.storeData['formGroup'].tabLogs.controls['TicketPremiseNumber'].setValue(formArray[6]);
        this.storeData['formGroup'].tabLogs.controls['TicketPremiseName'].setValue(formArray[7]);
        this.storeData['formGroup'].tabLogs.controls['TicketProductCode'].setValue(formArray[8]);
        this.storeData['formGroup'].tabLogs.controls['TicketProductDesc'].setValue(formArray[9]);
        this.storeData['otherParams'].otherVariables.TicketServiceCoverNumber = formArray[10];
        this.storeData['otherParams'].otherVariables.TicketServiceCoverRowID = formArray[11];
        this.storeData['formGroup'].tabLogs.controls['TicketPostcode'].setValue(formArray[12]);
        this.storeData['formGroup'].tabLogs.controls['TicketContactName'].setValue(formArray[13]);
        this.storeData['formGroup'].tabLogs.controls['TicketContactPosition'].setValue(formArray[14]);
        this.storeData['formGroup'].tabLogs.controls['TicketContactTelephone'].setValue(formArray[15]);
        this.storeData['formGroup'].tabLogs.controls['TicketContactMobile'].setValue(formArray[16]);
        this.storeData['formGroup'].tabLogs.controls['TicketContactEmail'].setValue(formArray[17]);
        this.storeData['otherParams'].otherVariables.TicketAddressName = formArray[18];
        this.storeData['otherParams'].otherVariables.TicketAddressLine1 = formArray[19];
        this.storeData['otherParams'].otherVariables.TicketAddressLine2 = formArray[20];
        this.storeData['otherParams'].otherVariables.TicketAddressLine3 = formArray[21];
        this.storeData['otherParams'].otherVariables.TicketAddressLine4 = formArray[22];
        this.storeData['otherParams'].otherVariables.TicketAddressLine5 = formArray[23];
        this.storeData['otherParams'].otherVariables.TicketProspectNumber = formArray[24];
        this.storeData['otherParams'].otherVariables.TicketShortDescription = formArray[25];
        this.storeData['otherParams'].otherVariables.TicketComments = formArray[26];
        this.storeData['formGroup'].tabLogs.controls['TicketContactFax'].setValue(formArray[27]);
        this.storeData['formGroup'].main.controls['CmdViewEmployee'].disable();
        if (this.storeData['formGroup'].tabLogs.controls['CallLogUserName'].value !== '') {
            this.fieldVisibility.CallLogsForm = true;
        }
        if (data.cellIndex === 0 || data.cellIndex === 1 || data.cellIndex === 5 || data.cellIndex === 6) {
            if (this.storeData['otherParams']['otherVariables']['currentTab'] !== this.storeData['tabsTranslation'].tabAccounts) {
                this.storeData['formGroup'].main.controls['CmdViewEmployee'].enable();
            }
        }
    };
    CallCenterGridCallLogsComponent.prototype.getRowAdditionalData = function (gridData, pos) {
        if (gridData[pos].additionalData) {
            return gridData[pos].additionalData.split('|');
        }
    };
    CallCenterGridCallLogsComponent.prototype.cmdCallLogClearSelectedOnClick = function (event) {
        if (this.storeData['otherParams'].otherVariables.CallLogSelectedContract !== '' && this.storeData['otherParams'].otherVariables.CallLogSelectedPremise !== '') {
            this.storeData['otherParams'].otherVariables.CallLogSelectedPremise = '';
            this.formGroup.controls['CallLogSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.CallLogSelectedContract);
            this.loadGridView();
        }
        else {
            this.storeData['otherParams'].otherVariables.CallLogSelectedContract = '';
            this.storeData['otherParams'].otherVariables.CallLogSelectedPremise = '';
            this.formGroup.controls['CallLogSelectedContractPremise'].setValue('');
            this.loadGridView();
        }
    };
    CallCenterGridCallLogsComponent.prototype.refresh = function () {
        this.fieldVisibility.CallLogsForm = false;
        this.storeData['formGroup'].main.controls['CmdViewEmployee'].disable();
        this.storeData['otherParams'].otherVariables.TechEmployeeCode = '';
        this.storeData['otherParams'].otherVariables.SelectedTicketNumber = '';
        this.loadGridView();
    };
    CallCenterGridCallLogsComponent.prototype.setGridHeaders = function () {
        this.gridSortHeaders = [
            {
                'fieldName': 'CallDCallLogID',
                'index': 0,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'CallDContactNumber',
                'index': 1,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'CallDOpen',
                'index': 2,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'CallDCreatedDateTime',
                'index': 3,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'CallDContactTypeDesc',
                'index': 4,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'CallDActionByDate',
                'index': 7,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'CallDStatusCode',
                'index': 9,
                'sortType': 'ASC'
            }
        ];
        for (var k = 0; k < this.gridSortHeaders.length; k++) {
            if (this.gridSortHeaders[k].fieldName === this.headerClicked) {
                this.gridSortHeaders[k].sortType = this.sortType === 'Descending' ? 'DESC' : 'ASC';
            }
        }
    };
    CallCenterGridCallLogsComponent.prototype.sortGrid = function (data) {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.loadGridView();
    };
    CallCenterGridCallLogsComponent.prototype.loadGridView = function () {
        var urlParams = this.riExchange.getRouterUrlParams();
        this.inputParams.module = this.queryGrid.module;
        this.inputParams.method = this.queryGrid.method;
        this.inputParams.operation = this.queryGrid.operation;
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
        this.search.set('GridName', 'CallLogDetail');
        this.search.set('AccountNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'AccountNumber'));
        this.search.set('ProspectNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'ProspectNumber'));
        this.search.set('ContractNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'CallLogSelectedContract'));
        this.search.set('PremiseNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'CallLogSelectedPremise'));
        this.search.set('SearchOn', this.formGroup.controls['CallLogSearchOn'].value);
        this.search.set('SearchValue', this.formGroup.controls['CallLogSearchValue'].value);
        this.search.set('CallLogDate', this.formGroup.controls['CallLogDate'].value);
        this.search.set('riSortOrder', this.sortType);
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('HeaderClickedColumn', this.headerClicked);
        this.search.set('PageSize', this.pageSize.toString());
        this.search.set('PageCurrent', this.currentPage.toString());
        this.inputParams.search = this.search;
        this.logsGrid.loadGridData(this.inputParams);
        this.storeData['pagination'].tabLogs = this.currentPage;
    };
    CallCenterGridCallLogsComponent.prototype.callLogSearchOnChange = function (event) {
        var _this = this;
        if (this.formGroup.controls['CallLogSearchOn'].value === 'all' || this.formGroup.controls['CallLogSearchOn'].value === 'OpenOnly' || this.formGroup.controls['CallLogSearchOn'].value === 'ClosedOnly') {
            this.formGroup.controls['CallLogSearchValue'].setValue('');
            this.formGroup.controls['CallLogSearchValue'].disable();
        }
        else {
            this.formGroup.controls['CallLogSearchValue'].enable();
            var tabText = document.querySelector('#tabCont .nav-tabs li.active a span')['innerText'];
            if (tabText === this.storeData['tabsTranslation'].tabLogs) {
                var focus_1 = new Event('focus', { bubbles: false });
                setTimeout(function () {
                    _this.renderer.invokeElementMethod(document.querySelector('#CallLogSearchValue'), 'focus', [focus_1]);
                }, 0);
            }
        }
        this.formGroup.controls['CallLogSearchValue'].setValue('');
    };
    CallCenterGridCallLogsComponent.prototype.callLogSearchOnKeyDown = function (event) {
        if (event.keyCode === 13) {
            this.loadGridView();
        }
    };
    CallCenterGridCallLogsComponent.prototype.callLogSearchValueOnKeyDown = function (event) {
        if (event.keyCode === 13) {
            this.loadGridView();
        }
    };
    CallCenterGridCallLogsComponent.prototype.callLogDateSelectedValue = function (value) {
        if (value && value['value']) {
            this.callLogDateDisplay = value['value'];
            this.formGroup.controls['CallLogDate'].setValue(this.callLogDateDisplay);
            if (this.initComplete && this.storeData['allowAjaxOnDateChange']) {
                this.loadGridView();
            }
        }
        else {
            this.callLogDateDisplay = '';
            this.formGroup.controls['CallLogDate'].setValue('');
        }
    };
    CallCenterGridCallLogsComponent.prototype.resetDate = function () {
        var date = new Date();
        this.dateObjects.CallLogDate = new Date(date.setDate(date.getDate() - this.storeData['otherParams'].registry.giCallDateDays));
    };
    CallCenterGridCallLogsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-call-center-grid-calllogs',
                    templateUrl: 'iCABSCMCallCentreGridCallLogs.html'
                },] },
    ];
    CallCenterGridCallLogsComponent.ctorParameters = [
        { type: NgZone, },
        { type: FormBuilder, },
        { type: ActivatedRoute, },
        { type: Router, },
        { type: Store, },
        { type: HttpService, },
        { type: Utils, },
        { type: ServiceConstants, },
        { type: RiExchange, },
        { type: Renderer, },
    ];
    CallCenterGridCallLogsComponent.propDecorators = {
        'logsGrid': [{ type: ViewChild, args: ['logsGrid',] },],
    };
    return CallCenterGridCallLogsComponent;
}());
