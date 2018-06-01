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
import { ContractManagementModuleRoutes } from '../../../base/PageRoutes';
export var CallCenterGridWorkOrdersComponent = (function () {
    function CallCenterGridWorkOrdersComponent(zone, fb, route, router, store, httpService, utils, serviceConstants, riExchange, renderer) {
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
            WorkOrderType: true,
            WOSelectedContractPremise: true,
            CmdWOClearSelected: true,
            FurtherRecords: false
        };
        this.dateObjectsEnabled = {
            WOFromDate: true,
            WOToDate: true
        };
        this.dateObjects = {
            WOFromDate: new Date(),
            WOToDate: new Date()
        };
        this.wOFromDateDisplay = '';
        this.wOToDateDisplay = '';
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
        this.maxColumns = 15;
        this.gridSortHeaders = [];
        this.headerProperties = [];
        this.initComplete = false;
        this.formGroup = this.fb.group({
            WorkOrderType: [{ value: 'all', disabled: false }],
            WOFromDate: [{ value: 'all', disabled: false }],
            WOToDate: [{ value: 'all', disabled: false }],
            WOSelectedContractPremise: [{ value: '', disabled: false }],
            CmdWOClearSelected: [{ disabled: false }]
        });
    }
    CallCenterGridWorkOrdersComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.storeSubscription = this.store.select('callcentresearch').subscribe(function (data) {
            _this.storeData = data;
            if (data && data['action']) {
                switch (data['action']) {
                    case CallCenterActionTypes.SAVE_OTHER_PARAMS:
                        _this.setGridSettings();
                        break;
                    case CallCenterActionTypes.BUILD_SPECIFIC_GRID:
                        if (_this.storeData['gridToBuild'].indexOf('WorkOrders') > -1) {
                            _this.loadGridView();
                        }
                        break;
                    case CallCenterActionTypes.RESET_ALL_SEARCH_DETAILS:
                        _this.resetDate();
                        break;
                    case CallCenterActionTypes.CLEAR_SPECIFIC_GRID:
                        if (_this.storeData['gridToClear'].indexOf('WorkOrders') > -1) {
                            _this.workGrid.clearGridData();
                        }
                        break;
                    case CallCenterActionTypes.SET_PAGINATION:
                        if (_this.storeData['storeSavedData']['pagination']) {
                            _this.currentPage = _this.storeData['storeSavedData']['pagination'].tabWorkOrders;
                        }
                        break;
                    default:
                        break;
                }
            }
        });
    };
    CallCenterGridWorkOrdersComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.store.dispatch({
            type: CallCenterActionTypes.FORM_GROUP, payload: {
                tabWorkOrders: this.formGroup
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                tabWorkOrders: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_DATE_VISIBILITY, payload: {
                tabWorkOrders: this.dateObjectsEnabled
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_DATE_OBJECTS, payload: {
                tabWorkOrders: this.dateObjects
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.INITIALIZATION, payload: {
                tabWorkOrders: true
            }
        });
        setTimeout(function () {
            _this.initComplete = true;
        }, 100);
    };
    CallCenterGridWorkOrdersComponent.prototype.ngOnDestroy = function () {
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    CallCenterGridWorkOrdersComponent.prototype.getCurrentPage = function (event) {
        this.currentPage = event.value;
        this.refresh();
    };
    CallCenterGridWorkOrdersComponent.prototype.getGridInfo = function (info) {
        var _this = this;
        this.totalRecords = info.totalRows;
        setTimeout(function () {
            _this.paginationCurrentPage = _this.currentPage;
        }, 0);
        if (info.gridData && info.gridData.body && info.gridData.body.cells.length > 0) {
        }
    };
    CallCenterGridWorkOrdersComponent.prototype.onGridRowClick = function (data) {
        this.onGridCellClick(data);
        var formArray = this.getRowAdditionalData(data.trRowData, 0);
        if (data.cellIndex === 0) {
            if (this.storeData['otherParams'].otherVariables.WORunType === 'SOWO') {
            }
            else if (this.storeData['otherParams'].otherVariables.WORunType === 'PLVC') {
                this.router.navigate(['/grid/application/contract/planVisitGridYear'], { queryParams: {
                        parentMode: 'ServiceVisitMaintenance',
                        AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
                        AccountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
                        ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
                        ContractName: this.storeData['otherParams'].otherVariables.ContractName,
                        IntervalShortFirstDate: formArray[7],
                        IntervalLongFirstDate: formArray[8],
                        PlanVisitRowId: formArray[2],
                        ProductCode: this.storeData['otherParams'].otherVariables.ProductCode,
                        ProductDesc: this.storeData['otherParams'].otherVariables.ProductDesc,
                        ServiceCoverRowID: this.storeData['otherParams'].otherVariables.ServiceCoverRowID,
                        PremiseNumber: this.storeData['otherParams'].otherVariables.PremiseNumber
                    } });
            }
        }
        else if (data.cellIndex === 2) {
            var tabText = document.querySelector('#tabCont .nav-tabs li.active a span')['innerText'];
            var parentMode = void 0;
            if (tabText === this.storeData['tabsTranslation'].tabLogs || tabText === this.storeData['tabsTranslation'].tabWorkOrders) {
                parentMode = 'PassTechnician';
            }
            else {
                parentMode = 'CallCentreSearch';
            }
        }
        if (this.maxColumns === 10) {
            if (data.cellIndex === 5) {
                this.runContractMaintenance(data.cellData.text);
            }
            else if (data.cellIndex === 7) {
                this.runPremiseMaintenance(data.cellData.text);
            }
        }
        else if (this.maxColumns === 11) {
            if (data.cellIndex === 6) {
                this.runContractMaintenance(data.cellData.text);
            }
            else if (data.cellIndex === 8) {
                this.runPremiseMaintenance(data.cellData.text);
            }
            if (this.storeData['otherParams'].registry.glShowRecommendations) {
                if (this.storeData['otherParams'].otherVariables.WORecommendationsExist === 'Y') {
                    this.router.navigate(['grid/application/service/recommendation'], { queryParams: {
                            parentMode: 'CallCentreSearch',
                            AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
                            ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
                            ContractName: this.storeData['otherParams'].otherVariables.ContractName
                        } });
                }
            }
        }
        else if (this.maxColumns === 12) {
            if (data.cellIndex === 7) {
                this.runContractMaintenance(data.cellData.text);
            }
            else if (data.cellIndex === 9) {
                this.runPremiseMaintenance(data.cellData.text);
            }
            else if (data.cellIndex === 6) {
                if (this.storeData['otherParams'].otherVariables.WORecommendationsExist === 'Y') {
                    this.router.navigate(['grid/application/service/recommendation'], { queryParams: {
                            parentMode: 'CallCentreSearch',
                            AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
                            ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
                            ContractName: this.storeData['otherParams'].otherVariables.ContractName
                        } });
                }
            }
        }
    };
    CallCenterGridWorkOrdersComponent.prototype.onGridCellClick = function (data) {
        if (this.maxColumns === 10) {
            if (data.cellIndex === 0 || data.cellIndex === 1 || data.cellIndex === 5 || data.cellIndex === 7) {
                if (this.storeData['otherParams']['otherVariables']['currentTab'] !== this.storeData['tabsTranslation'].tabAccounts) {
                    this.storeData['formGroup'].main.controls['CmdViewEmployee'].enable();
                }
            }
        }
        else if (this.maxColumns === 11) {
            if (data.cellIndex === 0 || data.cellIndex === 1 || data.cellIndex === 6 || data.cellIndex === 8) {
                if (this.storeData['otherParams']['otherVariables']['currentTab'] !== this.storeData['tabsTranslation'].tabAccounts) {
                    this.storeData['formGroup'].main.controls['CmdViewEmployee'].enable();
                }
            }
        }
        else if (this.maxColumns === 12) {
            if (data.cellIndex === 0 || data.cellIndex === 1 || data.cellIndex === 7 || data.cellIndex === 9) {
                if (this.storeData['otherParams']['otherVariables']['currentTab'] !== this.storeData['tabsTranslation'].tabAccounts) {
                    this.storeData['formGroup'].main.controls['CmdViewEmployee'].enable();
                }
            }
        }
        var formArray = this.getRowAdditionalData(data.trRowData, 0);
        this.storeData['otherParams'].otherVariables.WORunType = formArray[0];
        if (this.storeData['otherParams'].otherVariables.WORunType === 'SOWO') {
            this.storeData['otherParams'].otherVariables.WONumber = formArray[1];
        }
        if (this.storeData['otherParams'].otherVariables.WORunType === 'PLVC') {
            this.storeData['otherParams'].otherVariables.ProductCode = formArray[1];
            this.storeData['otherParams'].otherVariables.ServiceCoverRowID = formArray[2];
            this.storeData['otherParams'].otherVariables.ContractName = formArray[3];
            this.storeData['formGroup'].tabPremises.controls['PremiseName'] = formArray[4];
            this.storeData['otherParams'].otherVariables.ProductCode = formArray[5];
            this.storeData['otherParams'].otherVariables.ProductDesc = formArray[6];
            this.storeData['otherParams'].otherVariables.ServiceDateStartFrom = formArray[7];
            this.storeData['otherParams'].otherVariables.ServiceDateStartTo = formArray[8];
            this.storeData['otherParams'].otherVariables.WORecommendationsExist = formArray[9];
        }
        if (this.maxColumns === 10) {
            this.storeData['otherParams'].otherVariables.ContractNumber = data.trRowData[5].text;
            this.storeData['otherParams'].otherVariables.ContractROWID = data.trRowData[5].rowID;
            this.storeData['otherParams'].otherVariables.ContractType = data.trRowData[6].text;
            this.storeData['otherParams'].otherVariables.PremiseROWID = data.trRowData[7].rowID;
            this.storeData['otherParams'].otherVariables.PremiseNumber = data.trRowData[7].text;
            this.storeData['otherParams'].otherVariables.TechEmployeeCode = data.trRowData[2].additionalData;
        }
        else if (this.maxColumns === 11) {
            this.storeData['otherParams'].otherVariables.ContractNumber = data.trRowData[6].text;
            this.storeData['otherParams'].otherVariables.ContractROWID = data.trRowData[6].rowID;
            this.storeData['otherParams'].otherVariables.ContractType = data.trRowData[7].text;
            this.storeData['otherParams'].otherVariables.PremiseROWID = data.trRowData[8].rowID;
            this.storeData['otherParams'].otherVariables.PremiseNumber = data.trRowData[8].text;
            this.storeData['otherParams'].otherVariables.TechEmployeeCode = data.trRowData[2].additionalData;
        }
        else if (this.maxColumns === 12) {
            this.storeData['otherParams'].otherVariables.ContractNumber = data.trRowData[7].text;
            this.storeData['otherParams'].otherVariables.ContractROWID = data.trRowData[7].rowID;
            this.storeData['otherParams'].otherVariables.ContractType = data.trRowData[8].text;
            this.storeData['otherParams'].otherVariables.PremiseROWID = data.trRowData[9].rowID;
            this.storeData['otherParams'].otherVariables.PremiseNumber = data.trRowData[9].text;
            this.storeData['otherParams'].otherVariables.TechEmployeeCode = data.trRowData[2].additionalData;
        }
    };
    CallCenterGridWorkOrdersComponent.prototype.getRowAdditionalData = function (gridData, pos) {
        if (gridData[pos].additionalData) {
            return gridData[pos].additionalData.split('|');
        }
    };
    CallCenterGridWorkOrdersComponent.prototype.runContractMaintenance = function (contractNumber) {
        var _this = this;
        if (this.storeData['otherParams'].otherVariables.ContractLimitDataView === 'N') {
            if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && (this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '' || this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '0')) {
                this.storeData['subject']['CmdNewCallSent'].asObservable().subscribe(function (recieved) {
                    if (recieved['type'] === 'WorkOrders') {
                        _this.navigateToContract(contractNumber);
                    }
                    _this.storeData['subject']['CmdNewCallSent'].unsubscribe();
                });
                this.storeData['subject']['CmdNewCallRecieved'].next({
                    type: 'WorkOrders'
                });
            }
            else {
                this.navigateToContract(contractNumber);
            }
        }
        else {
            this.store.dispatch({
                type: CallCenterActionTypes.DISPLAY_ERROR, payload: this.storeData['otherParams'].registry['gcPermissionDeniedMessage']
            });
        }
    };
    CallCenterGridWorkOrdersComponent.prototype.navigateToContract = function (contractNumber) {
        if (this.storeData['otherParams'].otherVariables.ContractType === 'C') {
            this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], { queryParams: {
                    parentMode: 'CallCentreSearch',
                    ContractNumber: contractNumber
                } });
        }
        else if (this.storeData['otherParams'].otherVariables.ContractType === 'J') {
            this.router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], { queryParams: {
                    parentMode: 'CallCentreSearch',
                    ContractNumber: contractNumber
                } });
        }
        else if (this.storeData['otherParams'].otherVariables.ContractType === 'P') {
            this.router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], { queryParams: {
                    parentMode: 'CallCentreSearch',
                    ContractNumber: contractNumber
                } });
        }
    };
    CallCenterGridWorkOrdersComponent.prototype.runPremiseMaintenance = function (premiseNumber) {
        var _this = this;
        if (this.storeData['otherParams'].otherVariables.PremiseLimitDataView === 'N') {
            if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && (this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '' || this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '0')) {
                this.storeData['subject']['CmdNewCallSent'].asObservable().subscribe(function (recieved) {
                    if (recieved['type'] === 'WorkOrders') {
                        _this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
                            queryParams: {
                                parentMode: 'CallCentreSearch',
                                ContractNumber: _this.storeData['otherParams'].otherVariables['ContractNumber'],
                                AccountNumber: _this.storeData['otherParams'].otherVariables['AccountNumber'],
                                AccountName: _this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
                                contractTypeCode: _this.storeData['otherParams'].otherVariables.ContractType,
                                CurrentCallLogID: _this.formGroup.controls['VisibleCurrentCallLogID'].value || _this.storeData['otherParams'].otherVariables.CurrentCallLogID
                            }
                        });
                    }
                    _this.storeData['subject']['CmdNewCallSent'].unsubscribe();
                });
                this.storeData['subject']['CmdNewCallRecieved'].next({
                    type: 'WorkOrders'
                });
            }
            else {
                this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
                    queryParams: {
                        parentMode: 'CallCentreSearch',
                        ContractNumber: this.storeData['otherParams'].otherVariables['ContractNumber'],
                        AccountNumber: this.storeData['otherParams'].otherVariables['AccountNumber'],
                        AccountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
                        contractTypeCode: this.storeData['otherParams'].otherVariables.ContractType,
                        CurrentCallLogID: this.formGroup.controls['VisibleCurrentCallLogID'].value || this.storeData['otherParams'].otherVariables.CurrentCallLogID
                    }
                });
            }
        }
        else {
            this.store.dispatch({
                type: CallCenterActionTypes.DISPLAY_ERROR, payload: this.storeData['otherParams'].registry['gcPermissionDeniedMessage']
            });
        }
    };
    CallCenterGridWorkOrdersComponent.prototype.refresh = function () {
        this.storeData['formGroup'].main.controls['CmdViewEmployee'].disable();
        this.storeData['otherParams'].otherVariables.TechEmployeeCode = '';
        this.storeData['otherParams'].otherVariables.WORunType = '';
        this.fieldVisibility.FurtherRecords = false;
        this.loadGridView();
    };
    CallCenterGridWorkOrdersComponent.prototype.setGridSettings = function () {
        this.maxColumns = 10;
        if (this.storeData['otherParams'].registry && (this.storeData['otherParams'].registry.glSCShowInfestations || this.storeData['otherParams'].registry.giNumBusinesses)) {
            this.maxColumns++;
        }
        if (this.storeData['otherParams'].registry && this.storeData['otherParams'].registry.glShowRecommendations) {
            this.maxColumns++;
        }
        this.setGridHeaders();
    };
    CallCenterGridWorkOrdersComponent.prototype.setGridHeaders = function () {
        if (this.maxColumns === 10) {
            this.gridSortHeaders = [
                {
                    'fieldName': 'WOWODate',
                    'index': 0,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'WOVisitTimes',
                    'index': 1,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'WOEmployeeName',
                    'index': 2,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'WOWOActualDate',
                    'index': 3,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'WOContractNumber',
                    'index': 5,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'WOContractTypeCode',
                    'index': 6,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'WOPremiseNumber',
                    'index': 7,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'WOWOTypeDesc',
                    'index': 8,
                    'sortType': 'ASC'
                }
            ];
            this.headerProperties = [
                {
                    'align': 'center',
                    'width': '120px',
                    'index': 0
                },
                {
                    'align': 'center',
                    'width': '120px',
                    'index': 1
                },
                {
                    'align': 'center',
                    'width': '250px',
                    'index': 2
                },
                {
                    'align': 'center',
                    'width': '120px',
                    'index': 5
                },
                {
                    'align': 'center',
                    'width': '60px',
                    'index': 7
                }
            ];
        }
        else if (this.maxColumns === 11) {
            this.gridSortHeaders = [
                {
                    'fieldName': 'WOWODate',
                    'index': 0,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'WOVisitTimes',
                    'index': 1,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'WOEmployeeName',
                    'index': 2,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'WOWOActualDate',
                    'index': 3,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'WOContractNumber',
                    'index': 6,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'WOContractTypeCode',
                    'index': 7,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'WOPremiseNumber',
                    'index': 8,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'WOWOTypeDesc',
                    'index': 9,
                    'sortType': 'ASC'
                }
            ];
            this.headerProperties = [
                {
                    'align': 'center',
                    'width': '120px',
                    'index': 0
                },
                {
                    'align': 'center',
                    'width': '120px',
                    'index': 1
                },
                {
                    'align': 'center',
                    'width': '250px',
                    'index': 2
                },
                {
                    'align': 'center',
                    'width': '120px',
                    'index': 6
                },
                {
                    'align': 'center',
                    'width': '60px',
                    'index': 8
                }
            ];
        }
        else if (this.maxColumns === 12) {
            this.gridSortHeaders = [
                {
                    'fieldName': 'WOWODate',
                    'index': 0,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'WOVisitTimes',
                    'index': 1,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'WOEmployeeName',
                    'index': 2,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'WOWOActualDate',
                    'index': 3,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'WOContractNumber',
                    'index': 7,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'WOContractTypeCode',
                    'index': 8,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'WOPremiseNumber',
                    'index': 9,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'WOWOTypeDesc',
                    'index': 10,
                    'sortType': 'ASC'
                }
            ];
        }
        for (var k = 0; k < this.gridSortHeaders.length; k++) {
            if (this.gridSortHeaders[k].fieldName === this.headerClicked) {
                this.gridSortHeaders[k].sortType = this.sortType === 'Descending' ? 'DESC' : 'ASC';
            }
        }
    };
    CallCenterGridWorkOrdersComponent.prototype.sortGrid = function (data) {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.loadGridView();
    };
    CallCenterGridWorkOrdersComponent.prototype.loadGridView = function () {
        this.setGridSettings();
        var urlParams = this.riExchange.getRouterUrlParams();
        this.inputParams.module = this.queryGrid.module;
        this.inputParams.method = this.queryGrid.method;
        this.inputParams.operation = this.queryGrid.operation;
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
        this.search.set('GridName', 'WorkOrder');
        this.search.set('AccountNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'AccountNumber'));
        this.search.set('ProspectNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'ProspectNumber'));
        this.search.set('ContractNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'WOSelectedContract'));
        this.search.set('PremiseNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'WOSelectedPremise'));
        this.search.set('WorkOrderType', this.formGroup.controls['WorkOrderType'] ? this.formGroup.controls['WorkOrderType'].value : '');
        this.search.set('WOFromDate', this.formGroup.controls['WOFromDate'].value);
        this.search.set('WOToDate', this.formGroup.controls['WOToDate'].value);
        this.search.set('riSortOrder', this.sortType);
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('HeaderClickedColumn', this.headerClicked);
        this.search.set('PageSize', this.pageSize.toString());
        this.search.set('PageCurrent', this.currentPage.toString());
        this.inputParams.search = this.search;
        this.workGrid.loadGridData(this.inputParams);
        this.storeData['pagination'].tabWorkOrders = this.currentPage;
    };
    CallCenterGridWorkOrdersComponent.prototype.cmdWOClearSelectedOnClick = function (event) {
        if (this.storeData['otherParams'].otherVariables.WOSelectedContract !== '' && this.storeData['otherParams'].otherVariables.WOSelectedPremise !== '') {
            this.storeData['otherParams'].otherVariables.WOSelectedPremise = '';
            this.formGroup.controls['WOSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.WOSelectedContract);
            this.loadGridView();
            this.store.dispatch({
                type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['DlContract']
            });
        }
        else if (this.storeData['otherParams'].otherVariables.WOSelectedContract !== '') {
            this.storeData['otherParams'].otherVariables.WOSelectedPremise = '';
            this.storeData['otherParams'].otherVariables.WOSelectedContract = '';
            this.formGroup.controls['WOSelectedContractPremise'].setValue('');
            this.loadGridView();
            this.store.dispatch({
                type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['DlContract']
            });
        }
    };
    CallCenterGridWorkOrdersComponent.prototype.wOFromDateSelectedValue = function (value) {
        if (value && value['value']) {
            this.wOFromDateDisplay = value['value'];
            this.formGroup.controls['WOFromDate'].setValue(this.wOFromDateDisplay);
            if (this.initComplete && this.storeData['allowAjaxOnDateChange'])
                this.loadGridView();
        }
        else {
            this.wOFromDateDisplay = '';
            this.formGroup.controls['WOFromDate'].setValue('');
        }
    };
    CallCenterGridWorkOrdersComponent.prototype.wOToDateSelectedValue = function (value) {
        if (value && value['value']) {
            this.wOToDateDisplay = value['value'];
            this.formGroup.controls['WOToDate'].setValue(this.wOToDateDisplay);
            if (this.initComplete && this.storeData['allowAjaxOnDateChange'])
                this.loadGridView();
        }
        else {
            this.wOToDateDisplay = '';
            this.formGroup.controls['WOToDate'].setValue('');
        }
    };
    CallCenterGridWorkOrdersComponent.prototype.resetDate = function () {
        var date = new Date();
        this.dateObjects.WOFromDate = new Date(date.setDate(date.getDate() - this.storeData['otherParams'].registry.giWOFromDays));
        date = new Date();
        this.dateObjects.WOToDate = new Date(date.setDate(date.getDate() + this.storeData['otherParams'].registry.giWOToDays));
    };
    CallCenterGridWorkOrdersComponent.prototype.fetchTranslationContent = function () {
    };
    CallCenterGridWorkOrdersComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-call-center-grid-work-orders',
                    templateUrl: 'iCABSCMCallCentreGridWorkOrders.html'
                },] },
    ];
    CallCenterGridWorkOrdersComponent.ctorParameters = [
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
    CallCenterGridWorkOrdersComponent.propDecorators = {
        'workGrid': [{ type: ViewChild, args: ['workGrid',] },],
    };
    return CallCenterGridWorkOrdersComponent;
}());
