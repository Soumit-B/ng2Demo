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
export var CallCenterGridContractsComponent = (function () {
    function CallCenterGridContractsComponent(zone, fb, route, router, store, httpService, utils, serviceConstants, riExchange, renderer) {
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
            ContractSearchOn: true,
            ContractSearchValue: true,
            ContractCommenceDateFrom: false,
            ContractCommenceDateTo: false,
            ContractStatusCode: true,
            ContractTypeCode: true,
            CmdContractClearSearch: true,
            FurtherRecords: false
        };
        this.dropdownList = {
            ContractSearchOn: [
                { value: 'ClientRef', desc: 'Client Reference' },
                { value: 'ContractNo', desc: 'Contract Number' },
                { value: 'InvoiceNumber', desc: 'Invoice Number' },
                { value: 'Name', desc: 'Name' },
                { value: 'PurchaseOrderNo', desc: 'Purchase Order No' },
                { value: 'CompanyVATNumber', desc: 'Tax Registration No' },
                { value: 'ContractCommenceDate', desc: 'Commence Date' }
            ],
            ContractStatusCode: [
                { value: '', desc: '' }
            ],
            ContractTypeCode: [
                {
                    value: '', desc: ''
                }
            ]
        };
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
        this.maxColumns = 12;
        this.gridSortHeaders = [];
        this.headerProperties = [];
        this.contractCommenceFromDateDisplay = '';
        this.contractCommenceToDateDisplay = '';
        this.dateObjectsEnabled = {
            ContractCommenceDateFrom: true,
            ContractCommenceDateTo: true
        };
        this.dateObjects = {
            ContractCommenceDateFrom: new Date(),
            ContractCommenceDateTo: new Date()
        };
        this.initComplete = false;
        this.formGroup = this.fb.group({
            ContractSearchOn: [{ value: 'all', disabled: false }],
            ContractSearchValue: [{ value: '', disabled: false }],
            ContractCommenceFromDate: [{ value: '', disabled: false }],
            ContractCommenceToDate: [{ value: '', disabled: false }],
            ContractStatusCode: [{ value: '', disabled: false }],
            ContractTypeCode: [{ value: '', disabled: false }],
            CmdContractClearSearch: [{ disabled: false }]
        });
    }
    CallCenterGridContractsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dropdownList.ContractSearchOn.sort(function (a, b) { return (a.desc > b.desc) ? 1 : ((b.desc > a.desc) ? -1 : 0); });
        this.storeSubscription = this.store.select('callcentresearch').subscribe(function (data) {
            _this.storeData = data;
            if (data && data['action']) {
                switch (data['action']) {
                    case CallCenterActionTypes.BUILD_SPECIFIC_GRID:
                        if (_this.storeData['gridToBuild'].indexOf('Contracts') > -1) {
                            if (_this.storeData['gridToBuild'].length === 1) {
                                _this.storeData['gridToBuild'] = [];
                            }
                            _this.loadGridView();
                        }
                        break;
                    case CallCenterActionTypes.CLEAR_SPECIFIC_GRID:
                        if (_this.storeData['gridToClear'].indexOf('Contracts') > -1) {
                            _this.contractsGrid.clearGridData();
                        }
                        _this.contractSearchOnChange({});
                        break;
                    case CallCenterActionTypes.SET_PAGINATION:
                        if (_this.storeData['storeSavedData']['pagination']) {
                            _this.currentPage = _this.storeData['storeSavedData']['pagination'].tabContracts;
                        }
                        break;
                    default:
                        break;
                }
            }
            _this.contractSearchOnChange({});
        });
    };
    CallCenterGridContractsComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.store.dispatch({
            type: CallCenterActionTypes.FORM_GROUP, payload: {
                tabContracts: this.formGroup
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_DROPDOWN_LIST, payload: {
                tabContracts: this.dropdownList
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_DATE_VISIBILITY, payload: {
                tabContracts: this.dateObjectsEnabled
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_DATE_OBJECTS, payload: {
                tabContracts: this.dateObjects
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                tabContracts: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.INITIALIZATION, payload: {
                tabContracts: true
            }
        });
        setTimeout(function () {
            _this.initComplete = true;
        }, 100);
    };
    CallCenterGridContractsComponent.prototype.ngOnDestroy = function () {
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    CallCenterGridContractsComponent.prototype.getCurrentPage = function (event) {
        this.currentPage = event.value;
        this.refresh();
    };
    CallCenterGridContractsComponent.prototype.getGridInfo = function (info) {
        var _this = this;
        this.totalRecords = info.totalRows;
        if (info.gridData && info.gridData.body && info.gridData.body.cells.length > 0) {
        }
        setTimeout(function () {
            _this.paginationCurrentPage = _this.currentPage;
        }, 0);
    };
    CallCenterGridContractsComponent.prototype.onGridRowClick = function (data) {
        var _this = this;
        this.onGridCellClick(data);
        if (data.cellIndex === 0) {
            if (this.storeData['otherParams'].otherVariables.ContractLimitDataView === 'N') {
                if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && (this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '' || this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '0')) {
                    this.storeData['subject']['CmdNewCallSent'].asObservable().subscribe(function (recieved) {
                        if (recieved['type'] === 'Contracts') {
                            if (_this.storeData['otherParams'].otherVariables.ContractType === 'C') {
                                _this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], { queryParams: {
                                        parentMode: 'CallCentreSearch',
                                        ContractNumber: data.trRowData[0].text || _this.storeData['otherParams'].otherVariables.ContractNumber,
                                        CurrentCallLogID: _this.storeData['otherParams'].otherVariables.CurrentCallLogID
                                    } });
                            }
                            else if (_this.storeData['otherParams'].otherVariables.ContractType === 'J') {
                                _this.router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], { queryParams: {
                                        parentMode: 'CallCentreSearch',
                                        ContractNumber: data.trRowData[0].text || _this.storeData['otherParams'].otherVariables.ContractNumber,
                                        CurrentCallLogID: _this.storeData['otherParams'].otherVariables.CurrentCallLogID
                                    } });
                            }
                            else if (_this.storeData['otherParams'].otherVariables.ContractType === 'P') {
                                _this.router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], { queryParams: {
                                        parentMode: 'CallCentreSearch',
                                        ContractNumber: data.trRowData[0].text || _this.storeData['otherParams'].otherVariables.ContractNumber,
                                        CurrentCallLogID: _this.storeData['otherParams'].otherVariables.CurrentCallLogID
                                    } });
                            }
                        }
                        _this.storeData['subject']['CmdNewCallSent'].unsubscribe();
                    });
                    this.storeData['subject']['CmdNewCallRecieved'].next({
                        type: 'Contracts'
                    });
                }
                else {
                    if (this.storeData['otherParams'].otherVariables.ContractType === 'C') {
                        this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], { queryParams: {
                                parentMode: 'CallCentreSearch',
                                ContractNumber: data.trRowData[0].text || this.storeData['otherParams'].otherVariables.ContractNumber
                            } });
                    }
                    else if (this.storeData['otherParams'].otherVariables.ContractType === 'J') {
                        this.router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], { queryParams: {
                                parentMode: 'CallCentreSearch',
                                ContractNumber: data.trRowData[0].text || this.storeData['otherParams'].otherVariables.ContractNumber
                            } });
                    }
                    else if (this.storeData['otherParams'].otherVariables.ContractType === 'P') {
                        this.router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], { queryParams: {
                                parentMode: 'CallCentreSearch',
                                ContractNumber: data.trRowData[0].text || this.storeData['otherParams'].otherVariables.ContractNumber
                            } });
                    }
                }
            }
            else {
                this.store.dispatch({
                    type: CallCenterActionTypes.DISPLAY_ERROR, payload: this.storeData['otherParams'].registry['gcPermissionDeniedMessage']
                });
            }
        }
        if ((this.maxColumns === 12 && data.cellIndex === 10) || (this.maxColumns === 13 && data.cellIndex === 11)) {
            if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && (this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '' || this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === null)) {
                this.fetchCallCentreDataPost('NewCall', {}, { BusinessCode: this.storeData['code'].business }).subscribe(function (e) {
                    if (!e['errorMessage']) {
                        _this.storeData['otherParams'].otherVariables.CurrentCallLogID = e.CallLogID;
                        _this.router.navigate(['/application/telesalesEntry'], { queryParams: {
                                parentMode: 'ContractTeleSalesOrder',
                                ContractNumber: data.trRowData[0].text || _this.storeData['otherParams'].otherVariables.ContractNumber,
                                CurrentCallLogID: e.CallLogID
                            } });
                    }
                });
            }
            else {
                this.router.navigate(['/application/telesalesEntry'], { queryParams: {
                        parentMode: 'ContractTeleSalesOrder',
                        ContractNumber: data.trRowData[0].text || this.storeData['otherParams'].otherVariables.ContractNumber,
                        CurrentCallLogID: this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value
                    } });
            }
        }
        if ((this.maxColumns === 12 && data.cellIndex === 11) || (this.maxColumns === 13 && data.cellIndex === 12)) {
            this.router.navigate(['grid/maintenance/contract/customerinformation'], { queryParams: {
                    parentMode: 'Contract',
                    ContractNumber: data.trRowData[0].text || this.storeData['otherParams'].otherVariables.ContractNumber
                } });
        }
    };
    CallCenterGridContractsComponent.prototype.onGridCellClick = function (data) {
        if ((this.maxColumns === 12 && (data.cellIndex === 0 || data.cellIndex === 10 || data.cellIndex === 11)) || (this.maxColumns === 13 && (data.cellIndex === 0 || data.cellIndex === 11 || data.cellIndex === 12))) {
            if (this.storeData['otherParams']['otherVariables']['currentTab'] !== this.storeData['tabsTranslation'].tabAccounts) {
                this.storeData['formGroup'].main.controls['CmdViewEmployee'].enable();
            }
            this.setTabRefresh();
            this.storeData['formGroup'].main.controls['CmdViewEmployee'].enable();
            var formArray = this.getRowAdditionalData(data.trRowData, 0);
            this.storeData['otherParams'].otherVariables.PremiseNumber = formArray[0];
            this.storeData['formGroup'].tabPremises.controls['PremiseName'].setValue(formArray[1]);
            this.storeData['otherParams'].otherVariables.PremiseNumber = formArray[2];
            this.storeData['otherParams'].otherVariables.ProductCode = formArray[3];
            this.storeData['otherParams'].otherVariables.ProductDesc = formArray[4];
            this.storeData['otherParams'].otherVariables.ServiceCoverNumber = formArray[5];
            this.storeData['otherParams'].otherVariables.ServiceCoverROWID = formArray[6];
            this.storeData['otherParams'].otherVariables.ContractContactEmail = formArray[7];
            this.storeData['otherParams'].otherVariables.ContractLimitDataView = formArray[8];
            this.storeData['otherParams'].otherVariables.ContractNumber = data.trRowData[0].text;
            this.storeData['otherParams'].otherVariables.ContractName = data.trRowData[2].text;
            this.storeData['otherParams'].otherVariables.ContractROWID = data.trRowData[0].rowID;
            this.storeData['otherParams'].otherVariables.ContractType = data.trRowData[1].text;
            this.storeData['formGroup'].tabPremises.controls['PremSelectedContract'].setValue(this.storeData['otherParams'].otherVariables.ContractNumber);
            this.storeData['otherParams'].otherVariables.InvSelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
            this.storeData['otherParams'].otherVariables.InvSelectedPremise = '';
            this.storeData['formGroup'].tabInvoices.controls['InvSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.ContractNumber);
            this.storeData['otherParams'].otherVariables.WOSelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
            this.storeData['otherParams'].otherVariables.WOSelectedPremise = '';
            this.storeData['formGroup'].tabWorkOrders.controls['WOSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.ContractNumber);
            this.storeData['formGroup'].tabPremises.controls['PremiseSearchOn'].setValue('all');
            var change = new Event('change', { bubbles: true });
            var elem = document.querySelector('#PremiseSearchOn');
            if (elem) {
                this.renderer.invokeElementMethod(elem, 'dispatchEvent', [change]);
                elem = null;
            }
            this.storeData['formGroup'].tabPremises.controls['PremiseStatusCode'].setValue(this.formGroup.controls['ContractStatusCode'].value);
            this.storeData['formGroup'].tabPremises.controls['PremiseContractTypeCode'].setValue(this.formGroup.controls['ContractTypeCode'].value);
            this.storeData['otherParams'].otherVariables.HistorySelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
            this.storeData['otherParams'].otherVariables.HistorySelectedPremise = '';
            this.storeData['formGroup'].tabHistory.controls['HistorySelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.ContractNumber);
            this.storeData['otherParams'].otherVariables.EventHistorySelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
            this.storeData['otherParams'].otherVariables.EventHistorySelectedPremise = '';
            this.storeData['formGroup'].tabEventHistory.controls['EventHistorySelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.ContractNumber);
            this.storeData['otherParams'].otherVariables.CallLogSelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
            this.storeData['otherParams'].otherVariables.CallLogSelectedPremise = '';
            this.storeData['formGroup'].tabLogs.controls['CallLogSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.ContractNumber);
            this.storeData['gridToBuild'] = [];
            this.storeData['action'] = '';
        }
    };
    CallCenterGridContractsComponent.prototype.setTabRefresh = function () {
        this.storeData['refresh'].tabLogs = true;
        this.storeData['refresh'].tabDashboard = true;
        this.storeData['refresh'].tabDlContract = true;
        this.storeData['refresh'].tabEventHistory = true;
        this.storeData['refresh'].tabHistory = true;
        this.storeData['refresh'].tabInvoices = true;
        this.storeData['refresh'].tabPremises = true;
        this.storeData['refresh'].tabWorkOrders = true;
    };
    CallCenterGridContractsComponent.prototype.getRowAdditionalData = function (gridData, pos) {
        if (gridData[pos].additionalData) {
            return gridData[pos].additionalData.split('|');
        }
    };
    CallCenterGridContractsComponent.prototype.fetchCallCentreDataPost = function (functionName, params, formData) {
        var queryCallCentre = new URLSearchParams();
        var businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
        var countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();
        queryCallCentre.set(this.serviceConstants.BusinessCode, businessCode);
        queryCallCentre.set(this.serviceConstants.CountryCode, countryCode);
        if (functionName !== '') {
            queryCallCentre.set(this.serviceConstants.Action, '6');
            queryCallCentre.set('Function', functionName);
        }
        for (var key in params) {
            if (key) {
                queryCallCentre.set(key, params[key]);
            }
        }
        return this.httpService.makePostRequest(this.queryGrid.method, this.queryGrid.module, this.queryGrid.operation, queryCallCentre, formData);
    };
    CallCenterGridContractsComponent.prototype.refresh = function () {
        this.fieldVisibility.CallLogsForm = false;
        this.storeData['formGroup'].main.controls['CmdViewEmployee'].disable();
        this.fieldVisibility.FurtherRecords = false;
        this.loadGridView();
    };
    CallCenterGridContractsComponent.prototype.setGridSettings = function () {
        if (this.storeData['otherParams'].webSpeedVariables && this.storeData['otherParams'].webSpeedVariables.cIsPropertyCareBranch === 'Y') {
            this.maxColumns = 13;
        }
        else {
            this.maxColumns = 12;
        }
        this.setGridHeaders();
    };
    CallCenterGridContractsComponent.prototype.setGridHeaders = function () {
        if (this.storeData['otherParams'].webSpeedVariables && this.storeData['otherParams'].webSpeedVariables.cIsPropertyCareBranch === 'Y') {
            this.gridSortHeaders = [
                {
                    'fieldName': 'ConContractNumber',
                    'index': 0,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'ConContractType',
                    'index': 1,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'ConContractName',
                    'index': 2,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'ConCommenceDate',
                    'index': 3,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'ConExpiryDate',
                    'index': 4,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'ConAnnivDate',
                    'index': 5,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'ConInvFreq',
                    'index': 6,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'ConValue',
                    'index': 7,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'ConStatus',
                    'index': 8,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'ConReference',
                    'index': 10,
                    'sortType': 'ASC'
                }
            ];
            this.headerProperties = [
                {
                    'align': 'center',
                    'width': '120px',
                    'index': 0
                }
            ];
            for (var k = 0; k < this.gridSortHeaders.length; k++) {
                if (this.gridSortHeaders[k].fieldName === this.headerClicked) {
                    this.gridSortHeaders[k].sortType = this.sortType === 'Descending' ? 'DESC' : 'ASC';
                }
            }
        }
        else {
            this.gridSortHeaders = [
                {
                    'fieldName': 'ConContractNumber',
                    'index': 0,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'ConContractType',
                    'index': 1,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'ConContractName',
                    'index': 2,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'ConCommenceDate',
                    'index': 3,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'ConExpiryDate',
                    'index': 4,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'ConAnnivDate',
                    'index': 5,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'ConInvFreq',
                    'index': 6,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'ConValue',
                    'index': 7,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'ConStatus',
                    'index': 8,
                    'sortType': 'ASC'
                },
                {
                    'fieldName': 'ConReference',
                    'index': 9,
                    'sortType': 'ASC'
                }
            ];
            this.headerProperties = [
                {
                    'align': 'center',
                    'width': '120px',
                    'index': 0
                }
            ];
        }
    };
    CallCenterGridContractsComponent.prototype.sortGrid = function (data) {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.loadGridView();
    };
    CallCenterGridContractsComponent.prototype.loadGridView = function () {
        this.setGridSettings();
        var urlParams = this.riExchange.getRouterUrlParams();
        this.inputParams.module = this.queryGrid.module;
        this.inputParams.method = this.queryGrid.method;
        this.inputParams.operation = this.queryGrid.operation;
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
        this.search.set('GridName', 'Contract');
        this.search.set('AccountNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'AccountNumber'));
        this.search.set('ProspectNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'ProspectNumber'));
        this.search.set('ContractTypeCode', this.formGroup.controls['ContractTypeCode'].value);
        this.search.set('IsPropertyCareBranch', this.storeData['otherParams'].webSpeedVariables ? this.storeData['otherParams'].webSpeedVariables.cIsPropertyCareBranch : '');
        this.search.set('SearchOn', this.formGroup.controls['ContractSearchOn'].value);
        this.search.set('SearchValue', this.formGroup.controls['ContractSearchValue'].value);
        this.search.set('PortfolioStatus', this.formGroup.controls['ContractStatusCode'].value);
        this.search.set('ContractCommenceDateFrom', this.fieldVisibility.ContractCommenceDateFrom ? this.formGroup.controls['ContractCommenceFromDate'].value : '');
        this.search.set('ContractCommenceDateTo', this.fieldVisibility.ContractCommenceDateTo ? this.formGroup.controls['ContractCommenceToDate'].value : '');
        this.search.set('riSortOrder', this.sortType);
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('HeaderClickedColumn', this.headerClicked);
        this.search.set('PageSize', this.pageSize.toString());
        this.search.set('PageCurrent', this.currentPage.toString());
        this.inputParams.search = this.search;
        this.contractsGrid.loadGridData(this.inputParams);
        this.storeData['pagination'].tabContracts = this.currentPage;
    };
    CallCenterGridContractsComponent.prototype.fetchTranslationContent = function () {
    };
    CallCenterGridContractsComponent.prototype.contractSearchOnChange = function (event) {
        var _this = this;
        if (this.formGroup.controls['ContractSearchOn'].value === 'all') {
            this.fieldVisibility.ContractSearchValue = true;
            this.formGroup.controls['ContractSearchValue'].disable();
            this.formGroup.controls['ContractSearchValue'].setValue('');
            this.fieldVisibility.ContractCommenceDateFrom = false;
            this.fieldVisibility.ContractCommenceDateTo = false;
        }
        else if (this.formGroup.controls['ContractSearchOn'].value === 'ContractCommenceDate') {
            this.fieldVisibility.ContractSearchValue = false;
            this.fieldVisibility.ContractCommenceDateFrom = true;
            this.fieldVisibility.ContractCommenceDateTo = true;
            setTimeout(function () {
                var date = new Date();
                _this.dateObjects.ContractCommenceDateFrom = new Date(date.setDate(date.getDate() - _this.storeData['otherParams'].registry.giContractCommenceFromDays));
                date = new Date();
                _this.dateObjects.ContractCommenceDateTo = new Date(date.setDate(date.getDate() + _this.storeData['otherParams'].registry.giContractCommenceToDays));
            }, 0);
        }
        else {
            this.fieldVisibility.ContractSearchValue = true;
            this.formGroup.controls['ContractSearchValue'].enable();
            this.fieldVisibility.ContractCommenceDateFrom = false;
            this.fieldVisibility.ContractCommenceDateTo = false;
        }
        var tabText = document.querySelector('#tabCont .nav-tabs li.active a span');
        if (tabText) {
            tabText = tabText['innerText'];
            if (tabText === this.storeData['tabsTranslation'].tabContracts) {
                var focus_1 = new Event('focus', { bubbles: false });
                setTimeout(function () {
                    var elem = document.querySelector('#ContractSearchValue');
                    if (elem !== null)
                        _this.renderer.invokeElementMethod(elem, 'focus', [focus_1]);
                    elem = null;
                }, 0);
            }
        }
    };
    CallCenterGridContractsComponent.prototype.contractSearchOnKeyDown = function (event) {
        if (event.keyCode === 13) {
            this.loadGridView();
        }
    };
    CallCenterGridContractsComponent.prototype.contractSearchValueOnKeyDown = function (event) {
        if (event.keyCode === 13) {
            this.loadGridView();
        }
    };
    CallCenterGridContractsComponent.prototype.contractStatusCodeOnKeyDown = function (event) {
        if (event.keyCode === 13) {
            this.loadGridView();
        }
    };
    CallCenterGridContractsComponent.prototype.contractTypeCodeOnKeyDown = function (event) {
        if (event.keyCode === 13) {
            this.loadGridView();
        }
    };
    CallCenterGridContractsComponent.prototype.contractStatusCodeOnChange = function (event) {
        this.storeData['formGroup'].tabPremises.controls['PremiseStatusCode'].setValue(this.formGroup.controls['ContractStatusCode'].value);
    };
    CallCenterGridContractsComponent.prototype.contractTypeCodeOnChange = function (event) {
        this.storeData['formGroup'].tabPremises.controls['PremiseContractTypeCode'].setValue(this.formGroup.controls['ContractTypeCode'].value);
        this.storeData['formGroup'].tabInvoices.controls['InvoiceContractTypeCode'].setValue(this.formGroup.controls['ContractTypeCode'].value);
    };
    CallCenterGridContractsComponent.prototype.cmdContactContractOnClick = function (event) {
        this.store.dispatch({
            type: CallCenterActionTypes.PORTFOLIO_CONTACT_DETAILS, payload: ['CO']
        });
    };
    CallCenterGridContractsComponent.prototype.cmdContractClearSearchOnClick = function (event) {
        if (this.formGroup.controls['ContractSearchOn'].value !== 'all' || this.formGroup.controls['ContractSearchValue'].value !== '' || this.formGroup.controls['ContractStatusCode'].value !== 'all') {
            this.resetContractSearch();
            this.loadGridView();
        }
    };
    CallCenterGridContractsComponent.prototype.resetContractSearch = function () {
        this.fieldVisibility.FurtherRecords = false;
        this.formGroup.controls['ContractSearchOn'].setValue('all');
        this.formGroup.controls['ContractSearchValue'].setValue('');
        this.formGroup.controls['ContractStatusCode'].setValue(this.storeData['storeFormDataClone'].tabContracts.ContractStatusCode);
        this.formGroup.controls['ContractTypeCode'].setValue(this.storeData['storeFormDataClone'].tabContracts.ContractTypeCode);
    };
    CallCenterGridContractsComponent.prototype.contractCommenceFromDateSelectedValue = function (value) {
        if (value && value['value']) {
            this.contractCommenceFromDateDisplay = value['value'];
            this.formGroup.controls['ContractCommenceFromDate'].setValue(this.contractCommenceFromDateDisplay);
            if (this.initComplete && this.storeData['allowAjaxOnDateChange']) {
                this.loadGridView();
            }
        }
        else {
            this.contractCommenceFromDateDisplay = '';
            this.formGroup.controls['ContractCommenceFromDate'].setValue('');
        }
    };
    CallCenterGridContractsComponent.prototype.contractCommenceToDateSelectedValue = function (value) {
        if (value && value['value']) {
            this.contractCommenceToDateDisplay = value['value'];
            this.formGroup.controls['ContractCommenceToDate'].setValue(this.contractCommenceToDateDisplay);
            if (this.initComplete && this.storeData['allowAjaxOnDateChange']) {
                this.loadGridView();
            }
        }
        else {
            this.contractCommenceToDateDisplay = '';
            this.formGroup.controls['ContractCommenceToDate'].setValue('');
        }
    };
    CallCenterGridContractsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-call-center-grid-contracts',
                    templateUrl: 'iCABSCMCallCentreGridContracts.html'
                },] },
    ];
    CallCenterGridContractsComponent.ctorParameters = [
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
    CallCenterGridContractsComponent.propDecorators = {
        'contractsGrid': [{ type: ViewChild, args: ['contractsGrid',] },],
    };
    return CallCenterGridContractsComponent;
}());
