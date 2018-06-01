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
export var CallCenterGridPremisesComponent = (function () {
    function CallCenterGridPremisesComponent(zone, fb, route, router, store, httpService, utils, serviceConstants, riExchange, renderer) {
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
            PremSelectedContract: true,
            CmdPremClearSelected: true,
            PremiseSearchOn: true,
            PremiseSearchValue: true,
            PremiseCommenceDateFrom: false,
            PremiseCommenceDateTo: false,
            PremiseStatusCode: true,
            PremiseContractTypeCode: true,
            CmdPremiseClearSearch: true,
            PremiseName: true,
            PremiseContactName: true,
            CmdContactPremise: false,
            PremiseAddressLine1: true,
            PremiseContactPosition: true,
            PremiseAddressLine2: true,
            PremiseAddressLine3: false,
            PremiseContactTelephone: true,
            PremiseAddressLine4: true,
            PremiseContactMobile: true,
            PremiseAddressLine5: true,
            PremiseContactFax: true,
            PremisePostcode: true,
            PremiseContactEmail: true,
            PremiseServiceCoverList: true,
            CmdGoServiceCover: true,
            FurtherRecords: false,
            PremiseForm: false
        };
        this.dropdownList = {
            PremiseSearchOn: [
                { value: 'Address', desc: 'Address' },
                { value: 'ClientRef', desc: 'Client Reference' },
                { value: 'ContractNo', desc: 'Contract Number' },
                { value: 'InvoiceNumber', desc: 'Invoice Number' },
                { value: 'Name', desc: 'Name' },
                { value: 'PostCode', desc: 'Postcode' },
                { value: 'PurchaseOrderNo', desc: 'Purchase Order No' },
                { value: 'CompanyVATNumber', desc: 'Tax Registration No' },
                { value: 'Telephone', desc: 'Telephone' },
                { value: 'PremiseCommenceDate', desc: 'Commence Date' }
            ],
            PremiseStatusCode: [
                { value: 'All', desc: 'Client Reference' },
                { value: 'ContractNo', desc: 'Contract Number' }
            ],
            PremiseContractTypeCode: [
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
        this.premiseCommenceFromDateDisplay = '';
        this.premiseCommenceToDateDisplay = '';
        this.dateObjectsEnabled = {
            PremiseCommenceDateFrom: true,
            PremiseCommenceDateTo: true
        };
        this.dateObjects = {
            PremiseCommenceDateFrom: new Date(),
            PremiseCommenceDateTo: new Date()
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
            PremSelectedContract: [{ value: '', disabled: false }],
            CmdPremClearSelected: [{ disabled: false }],
            PremiseSearchOn: [{ value: 'all', disabled: false }],
            PremiseSearchValue: [{ value: '', disabled: false }],
            PremiseCommenceDateFrom: [{ value: '', disabled: false }],
            PremiseCommenceDateTo: [{ value: '', disabled: false }],
            PremiseStatusCode: [{ value: 'all', disabled: false }],
            PremiseContractTypeCode: [{ value: '', disabled: false }],
            CmdPremiseClearSearch: [{ disabled: false }],
            PremiseName: [{ value: '', disabled: false }],
            PremiseContactName: [{ value: '', disabled: false }],
            CmdContactPremise: [{ disabled: false }],
            PremiseAddressLine1: [{ value: '', disabled: false }],
            PremiseContactPosition: [{ value: '', disabled: false }],
            PremiseAddressLine2: [{ value: '', disabled: false }],
            PremiseAddressLine3: [{ value: '', disabled: false }],
            PremiseContactTelephone: [{ value: '', disabled: false }],
            PremiseAddressLine4: [{ value: '', disabled: false }],
            PremiseContactMobile: [{ value: '', disabled: false }],
            PremiseAddressLine5: [{ value: '', disabled: false }],
            PremiseContactFax: [{ value: '', disabled: false }],
            PremisePostcode: [{ value: '', disabled: false }],
            PremiseContactEmail: [{ value: '', disabled: false }],
            PremiseServiceCoverList: [{ value: '', disabled: false }],
            CmdGoServiceCover: [{ disabled: false }]
        });
    }
    CallCenterGridPremisesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dropdownList.PremiseSearchOn.sort(function (a, b) { return (a.desc > b.desc) ? 1 : ((b.desc > a.desc) ? -1 : 0); });
        this.storeSubscription = this.store.select('callcentresearch').subscribe(function (data) {
            _this.storeData = data;
            if (data && data['action']) {
                switch (data['action']) {
                    case CallCenterActionTypes.BUILD_SPECIFIC_GRID:
                        if (_this.storeData['gridToBuild'].indexOf('Premises') > -1) {
                            if (_this.storeData['gridToBuild'].length === 1) {
                                _this.storeData['gridToBuild'] = [];
                            }
                            _this.loadGridView();
                        }
                        break;
                    case CallCenterActionTypes.CLEAR_SPECIFIC_GRID:
                        if (_this.storeData['gridToClear'].indexOf('Premises') > -1) {
                            _this.premisesGrid.clearGridData();
                        }
                        break;
                    case CallCenterActionTypes.SET_PAGINATION:
                        if (_this.storeData['storeSavedData']['pagination']) {
                            _this.currentPage = _this.storeData['storeSavedData']['pagination'].tabPremises;
                        }
                        break;
                    default:
                        break;
                }
            }
        });
    };
    CallCenterGridPremisesComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.store.dispatch({
            type: CallCenterActionTypes.FORM_GROUP, payload: {
                tabPremises: this.formGroup
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_DROPDOWN_LIST, payload: {
                tabPremises: this.dropdownList
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                tabPremises: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_DATE_VISIBILITY, payload: {
                tabPremises: this.dateObjectsEnabled
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_DATE_OBJECTS, payload: {
                tabPremises: this.dateObjects
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.INITIALIZATION, payload: {
                tabPremises: true
            }
        });
        setTimeout(function () {
            _this.initComplete = true;
            _this.premiseSearchOnChange({});
        }, 100);
    };
    CallCenterGridPremisesComponent.prototype.ngOnDestroy = function () {
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    CallCenterGridPremisesComponent.prototype.getCurrentPage = function (event) {
        this.currentPage = event.value;
        this.refresh();
    };
    CallCenterGridPremisesComponent.prototype.getGridInfo = function (info) {
        var _this = this;
        this.totalRecords = info.totalRows;
        setTimeout(function () {
            _this.paginationCurrentPage = _this.currentPage;
        }, 0);
        if (info.gridData && info.gridData.body && info.gridData.body.cells.length > 0) {
            var formArray = this.getRowAdditionalData(info.gridData.body.cells.slice(0, this.maxColumns), 0);
            this.onGridCellClick({
                trRowData: info.gridData.body.cells.slice(0, this.maxColumns),
                cellIndex: 0
            });
            this.setTabRefresh();
            this.storeData['gridToBuild'] = [];
            this.storeData['action'] = '';
            if (this.storeData['otherParams']['otherVariables']['currentTab'] !== this.storeData['tabsTranslation'].tabAccounts) {
                this.storeData['formGroup'].main.controls['CmdViewEmployee'].enable();
            }
        }
        else {
            this.fieldVisibility.PremiseForm = false;
        }
    };
    CallCenterGridPremisesComponent.prototype.onGridRowClick = function (data) {
        var _this = this;
        this.onGridCellClick(data);
        if (data.cellIndex === 0) {
            if (this.storeData['otherParams'].otherVariables.ContractLimitDataView === 'N') {
                if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && (this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '' || this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '0')) {
                    this.storeData['subject']['CmdNewCallSent'].asObservable().subscribe(function (recieved) {
                        if (recieved['type'] === 'Premises') {
                            _this.navigateToContract();
                        }
                        _this.storeData['subject']['CmdNewCallSent'].unsubscribe();
                    });
                    this.storeData['subject']['CmdNewCallRecieved'].next({
                        type: 'Premises'
                    });
                }
                else {
                    this.navigateToContract();
                }
            }
            else {
                this.store.dispatch({
                    type: CallCenterActionTypes.DISPLAY_ERROR, payload: this.storeData['otherParams'].registry['gcPermissionDeniedMessage']
                });
            }
        }
        else if (data.cellIndex === 2) {
            if (this.storeData['otherParams'].otherVariables.PremiseLimitDataView === 'N') {
                if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && (this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '' || this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '0')) {
                    this.storeData['subject']['CmdNewCallSent'].asObservable().subscribe(function (recieved) {
                        if (recieved['type'] === 'Premises') {
                            _this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], { queryParams: {
                                    parentMode: 'GridSearch',
                                    PremiseNumber: data.trRowData[2].text,
                                    AccountName: _this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
                                    AccountNumber: _this.storeData['otherParams'].otherVariables.AccountNumber,
                                    ContractNumber: _this.storeData['otherParams'].otherVariables.ContractNumber,
                                    CurrentCallLogID: _this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value || _this.storeData['otherParams'].otherVariables.CurrentCallLogID,
                                    ContractName: _this.storeData['otherParams'].otherVariables.ContractName
                                } });
                        }
                        _this.storeData['subject']['CmdNewCallSent'].unsubscribe();
                    });
                    this.storeData['subject']['CmdNewCallRecieved'].next({
                        type: 'Premises'
                    });
                }
                else {
                    this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], { queryParams: {
                            parentMode: 'GridSearch',
                            PremiseNumber: data.trRowData[2].text,
                            AccountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
                            AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
                            ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
                            CurrentCallLogID: this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value || this.storeData['otherParams'].otherVariables.CurrentCallLogID,
                            ContractName: this.storeData['otherParams'].otherVariables.ContractName
                        } });
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
                                parentMode: 'PremiseTeleSalesOrder',
                                AccountName: _this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
                                AccountNumber: _this.storeData['otherParams'].otherVariables.AccountNumber,
                                CurrentCallLogID: e.CallLogID
                            } });
                    }
                });
            }
            else {
                this.router.navigate(['/application/telesalesEntry'], { queryParams: {
                        parentMode: 'PremiseTeleSalesOrder',
                        AccountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
                        AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
                        CurrentCallLogID: this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value || this.storeData['otherParams'].otherVariables.CurrentCallLogID
                    } });
            }
        }
        if ((this.maxColumns === 12 && data.cellIndex === 11) || (this.maxColumns === 13 && data.cellIndex === 12)) {
            this.router.navigate(['grid/maintenance/contract/customerinformation'], { queryParams: {
                    parentMode: 'Contract',
                    accountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
                    accountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
                    contractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
                    contractName: this.storeData['otherParams'].otherVariables.ContractName
                } });
        }
    };
    CallCenterGridPremisesComponent.prototype.navigateToContract = function () {
        if (this.storeData['otherParams'].otherVariables.ContractType === 'C') {
            this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], { queryParams: {
                    parentMode: 'CallCentreSearch',
                    ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber
                } });
        }
        else if (this.storeData['otherParams'].otherVariables.ContractType === 'J') {
            this.router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], { queryParams: {
                    parentMode: 'CallCentreSearch',
                    ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber
                } });
        }
        else if (this.storeData['otherParams'].otherVariables.ContractType === 'P') {
            this.router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], { queryParams: {
                    parentMode: 'CallCentreSearch',
                    ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber
                } });
        }
    };
    CallCenterGridPremisesComponent.prototype.populateForm = function (formArray, cellIndex, rowIndex, completeRowData) {
        this.fieldVisibility.PremiseForm = true;
        this.storeData['otherParams'].otherVariables.ContractROWID = completeRowData[0].rowID;
        this.storeData['otherParams'].otherVariables.PremiseROWID = completeRowData[2].rowID;
        this.storeData['otherParams'].otherVariables.ContractNumber = completeRowData[0].text;
        this.storeData['otherParams'].otherVariables.ContractType = completeRowData[1].text;
        this.storeData['otherParams'].otherVariables.PremiseNumber = completeRowData[2].text;
        this.storeData['otherParams'].otherVariables.ContractName = formArray[0];
        this.storeData['formGroup'].tabPremises.controls['PremiseName'].setValue(formArray[1]);
        this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine1'].setValue(formArray[2]);
        this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine2'].setValue(formArray[3]);
        this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine3'].setValue(formArray[4]);
        this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine4'].setValue(formArray[5]);
        this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine5'].setValue(formArray[6]);
        this.storeData['formGroup'].tabPremises.controls['PremisePostcode'].setValue(formArray[7]);
        this.storeData['formGroup'].tabPremises.controls['PremiseContactName'].setValue(formArray[8]);
        this.storeData['formGroup'].tabPremises.controls['PremiseContactPosition'].setValue(formArray[9]);
        this.storeData['formGroup'].tabPremises.controls['PremiseContactTelephone'].setValue(formArray[10]);
        this.storeData['formGroup'].tabPremises.controls['PremiseContactMobile'].setValue(formArray[11]);
        this.storeData['formGroup'].tabPremises.controls['PremiseContactFax'].setValue(formArray[12]);
        this.storeData['formGroup'].tabPremises.controls['PremiseContactEmail'].setValue(formArray[13]);
        this.storeData['formGroup'].tabPremises.controls['PremiseServiceCoverList'].setValue(formArray[18]);
        this.storeData['otherParams'].otherVariables.ProductCode = formArray[14];
        this.storeData['otherParams'].otherVariables.ProductDesc = formArray[15];
        this.storeData['otherParams'].otherVariables.ServiceCoverNumber = formArray[16];
        this.storeData['otherParams'].otherVariables.ServiceCoverROWID = formArray[17];
        this.storeData['otherParams'].otherVariables.ContractContactEmail = formArray[19];
        this.storeData['otherParams'].otherVariables.ContractLimitDataView = formArray[20];
        this.storeData['otherParams'].otherVariables.PremiseLimitDataView = formArray[21];
        this.storeData['otherParams'].otherVariables.SelectedPostcode = this.formGroup.controls['PremisePostcode'].value;
        this.storeData['otherParams'].otherVariables.SelectedAddressLine4 = this.formGroup.controls['PremiseAddressLine4'].value;
        this.storeData['otherParams'].otherVariables.SelectedAddressLine5 = this.formGroup.controls['PremiseAddressLine5'].value;
        if (formArray[18] === '') {
            this.formGroup.controls['CmdGoServiceCover'].disable();
        }
        else {
            this.formGroup.controls['CmdGoServiceCover'].enable();
        }
        if (this.storeData['currentTab'] === this.storeData['tabsTranslation'].tabPremises) {
            this.storeData['otherParams'].otherVariables.InvSelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
            this.storeData['otherParams'].otherVariables.InvSelectedPremise = this.storeData['otherParams'].otherVariables.PremiseNumber;
            this.storeData['formGroup'].tabInvoices.controls['InvSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.InvSelectedContract + ' / ' + this.storeData['otherParams'].otherVariables.InvSelectedPremise);
            this.storeData['otherParams'].otherVariables.WOSelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
            this.storeData['otherParams'].otherVariables.WOSelectedPremise = this.storeData['otherParams'].otherVariables.PremiseNumber;
            this.storeData['formGroup'].tabWorkOrders.controls['WOSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.WOSelectedContract + ' / ' + this.storeData['otherParams'].otherVariables.WOSelectedPremise);
            this.storeData['otherParams'].otherVariables.EventHistorySelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
            this.storeData['otherParams'].otherVariables.EventHistorySelectedPremise = this.storeData['otherParams'].otherVariables.PremiseNumber;
            this.storeData['formGroup'].tabEventHistory.controls['EventHistorySelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.EventHistorySelectedContract + ' / ' + this.storeData['otherParams'].otherVariables.EventHistorySelectedPremise);
            this.storeData['otherParams'].otherVariables.HistorySelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
            this.storeData['otherParams'].otherVariables.HistorySelectedPremise = this.storeData['otherParams'].otherVariables.PremiseNumber;
            this.storeData['formGroup'].tabHistory.controls['HistorySelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.HistorySelectedContract + ' / ' + this.storeData['otherParams'].otherVariables.HistorySelectedPremise);
            this.storeData['otherParams'].otherVariables.CallLogSelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
            this.storeData['otherParams'].otherVariables.CallLogSelectedPremise = this.storeData['otherParams'].otherVariables.PremiseNumber;
            this.storeData['formGroup'].tabLogs.controls['CallLogSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.CallLogSelectedContract + ' / ' + this.storeData['otherParams'].otherVariables.CallLogSelectedPremise);
        }
        this.storeData['formGroup'].main.controls['CmdViewEmployee'].disable();
    };
    CallCenterGridPremisesComponent.prototype.onGridCellClick = function (data) {
        if ((this.maxColumns === 12 && (data.cellIndex === 0 || data.cellIndex === 1 || data.cellIndex === 2 || data.cellIndex === 10 || data.cellIndex === 11)) || (this.maxColumns === 13 && (data.cellIndex === 0 || data.cellIndex === 1 || data.cellIndex === 2 || data.cellIndex === 11 || data.cellIndex === 12))) {
            this.setTabRefresh();
            var formArray = this.getRowAdditionalData(data.trRowData, 0);
            this.storeData['otherParams'].otherVariables.ContractROWID = data.trRowData[0].rowID;
            this.storeData['otherParams'].otherVariables.PremiseROWID = data.trRowData[2].rowID;
            this.storeData['otherParams'].otherVariables.ContractNumber = data.trRowData[0].text;
            this.storeData['otherParams'].otherVariables.ContractType = data.trRowData[1].text;
            this.storeData['otherParams'].otherVariables.PremiseNumber = data.trRowData[2].text;
            this.storeData['otherParams'].otherVariables.ContractName = formArray[0];
            this.storeData['formGroup'].tabPremises.controls['PremiseName'].setValue(formArray[1]);
            this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine1'].setValue(formArray[2]);
            this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine2'].setValue(formArray[3]);
            this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine3'].setValue(formArray[4]);
            this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine4'].setValue(formArray[5]);
            this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine5'].setValue(formArray[6]);
            this.storeData['formGroup'].tabPremises.controls['PremisePostcode'].setValue(formArray[7]);
            this.storeData['formGroup'].tabPremises.controls['PremiseContactName'].setValue(formArray[8]);
            this.storeData['formGroup'].tabPremises.controls['PremiseContactPosition'].setValue(formArray[9]);
            this.storeData['formGroup'].tabPremises.controls['PremiseContactTelephone'].setValue(formArray[10]);
            this.storeData['formGroup'].tabPremises.controls['PremiseContactMobile'].setValue(formArray[11]);
            this.storeData['formGroup'].tabPremises.controls['PremiseContactFax'].setValue(formArray[12]);
            this.storeData['formGroup'].tabPremises.controls['PremiseContactEmail'].setValue(formArray[13]);
            this.storeData['formGroup'].tabPremises.controls['PremiseServiceCoverList'].setValue(formArray[18]);
            this.storeData['otherParams'].otherVariables.ProductCode = formArray[14];
            this.storeData['otherParams'].otherVariables.ProductDesc = formArray[15];
            this.storeData['otherParams'].otherVariables.ServiceCoverNumber = formArray[16];
            this.storeData['otherParams'].otherVariables.ServiceCoverROWID = formArray[17];
            this.storeData['otherParams'].otherVariables.ContractContactEmail = formArray[19];
            this.storeData['otherParams'].otherVariables.ContractLimitDataView = formArray[20];
            this.storeData['otherParams'].otherVariables.PremiseLimitDataView = formArray[21];
            this.storeData['otherParams'].otherVariables.SelectedPostcode = this.formGroup.controls['PremisePostcode'].value;
            this.storeData['otherParams'].otherVariables.SelectedAddressLine4 = this.formGroup.controls['PremiseAddressLine4'].value;
            this.storeData['otherParams'].otherVariables.SelectedAddressLine5 = this.formGroup.controls['PremiseAddressLine5'].value;
            if (formArray[18] === '') {
                this.formGroup.controls['CmdGoServiceCover'].disable();
            }
            else {
                this.formGroup.controls['CmdGoServiceCover'].enable();
            }
            this.fieldVisibility.PremiseForm = true;
            this.storeData['otherParams'].otherVariables.InvSelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
            this.storeData['otherParams'].otherVariables.InvSelectedPremise = this.storeData['otherParams'].otherVariables.PremiseNumber;
            this.storeData['formGroup'].tabInvoices.controls['InvSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.InvSelectedContract + ' / ' + this.storeData['otherParams'].otherVariables.InvSelectedPremise);
            this.storeData['otherParams'].otherVariables.WOSelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
            this.storeData['otherParams'].otherVariables.WOSelectedPremise = this.storeData['otherParams'].otherVariables.PremiseNumber;
            this.storeData['formGroup'].tabWorkOrders.controls['WOSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.WOSelectedContract + ' / ' + this.storeData['otherParams'].otherVariables.WOSelectedPremise);
            this.storeData['otherParams'].otherVariables.EventHistorySelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
            this.storeData['otherParams'].otherVariables.EventHistorySelectedPremise = this.storeData['otherParams'].otherVariables.PremiseNumber;
            this.storeData['formGroup'].tabEventHistory.controls['EventHistorySelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.EventHistorySelectedContract + ' / ' + this.storeData['otherParams'].otherVariables.EventHistorySelectedPremise);
            this.storeData['otherParams'].otherVariables.HistorySelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
            this.storeData['otherParams'].otherVariables.HistorySelectedPremise = this.storeData['otherParams'].otherVariables.PremiseNumber;
            this.storeData['formGroup'].tabHistory.controls['HistorySelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.HistorySelectedContract + ' / ' + this.storeData['otherParams'].otherVariables.HistorySelectedPremise);
            this.storeData['otherParams'].otherVariables.CallLogSelectedContract = this.storeData['otherParams'].otherVariables.ContractNumber;
            this.storeData['otherParams'].otherVariables.CallLogSelectedPremise = this.storeData['otherParams'].otherVariables.PremiseNumber;
            this.storeData['formGroup'].tabLogs.controls['CallLogSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.CallLogSelectedContract + ' / ' + this.storeData['otherParams'].otherVariables.CallLogSelectedPremise);
            this.storeData['formGroup'].main.controls['CmdViewEmployee'].disable();
            this.storeData['gridToBuild'] = [];
            this.storeData['action'] = '';
            if (this.storeData['otherParams']['otherVariables']['currentTab'] !== this.storeData['tabsTranslation'].tabAccounts) {
                this.storeData['formGroup'].main.controls['CmdViewEmployee'].enable();
            }
        }
    };
    CallCenterGridPremisesComponent.prototype.setTabRefresh = function () {
        this.storeData['refresh'].tabLogs = true;
        this.storeData['refresh'].tabDashboard = true;
        this.storeData['refresh'].tabDlContract = true;
        this.storeData['refresh'].tabEventHistory = true;
        this.storeData['refresh'].tabHistory = true;
        this.storeData['refresh'].tabInvoices = true;
        this.storeData['refresh'].tabWorkOrders = true;
    };
    CallCenterGridPremisesComponent.prototype.getRowAdditionalData = function (gridData, pos) {
        if (gridData[pos].additionalData) {
            return gridData[pos].additionalData.split('|');
        }
    };
    CallCenterGridPremisesComponent.prototype.refresh = function () {
        this.fieldVisibility.PremiseForm = false;
        this.storeData['formGroup'].main.controls['CmdViewEmployee'].disable();
        this.fieldVisibility.FurtherRecords = false;
        this.loadGridView();
    };
    CallCenterGridPremisesComponent.prototype.setGridSettings = function () {
        if (this.storeData['otherParams'].webSpeedVariables && this.storeData['otherParams'].webSpeedVariables.cIsPropertyCareBranch === 'Y') {
            this.maxColumns = 13;
        }
        else {
            this.maxColumns = 12;
        }
        this.setGridHeaders();
    };
    CallCenterGridPremisesComponent.prototype.setGridHeaders = function () {
        this.gridSortHeaders = [
            {
                'fieldName': 'PremContractNumber',
                'index': 0,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'PremContractTypeCode',
                'index': 1,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'PremCommenceDate',
                'index': 3,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'PremExpiryDate',
                'index': 4,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'PremPremiseName',
                'index': 5,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'PremAddressLine1',
                'index': 6,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'PremPostCode',
                'index': 7,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'PremBranch',
                'index': 8,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'PremStatus',
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
                'width': '60px',
                'index': 1
            },
            {
                'align': 'center',
                'width': '100px',
                'index': 2
            }
        ];
        for (var k = 0; k < this.gridSortHeaders.length; k++) {
            if (this.gridSortHeaders[k].fieldName === this.headerClicked) {
                this.gridSortHeaders[k].sortType = this.sortType === 'Descending' ? 'DESC' : 'ASC';
            }
        }
    };
    CallCenterGridPremisesComponent.prototype.sortGrid = function (data) {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.loadGridView();
    };
    CallCenterGridPremisesComponent.prototype.fetchCallCentreDataPost = function (functionName, params, formData) {
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
    CallCenterGridPremisesComponent.prototype.loadGridView = function () {
        this.setGridSettings();
        var urlParams = this.riExchange.getRouterUrlParams();
        this.inputParams.module = this.queryGrid.module;
        this.inputParams.method = this.queryGrid.method;
        this.inputParams.operation = this.queryGrid.operation;
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
        this.search.set('GridName', 'Premise');
        this.search.set('AccountNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'AccountNumber'));
        this.search.set('ProspectNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'ProspectNumber'));
        this.search.set('ContractNumber', this.formGroup.controls['PremSelectedContract'].value !== '' ? this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'ContractNumber') : '');
        this.search.set('ContractTypeCode', this.formGroup.controls['PremiseContractTypeCode'].value);
        this.search.set('IsPropertyCareBranch', this.storeData['otherParams'].webSpeedVariables ? this.storeData['otherParams'].webSpeedVariables.cIsPropertyCareBranch : '');
        this.search.set('SearchOn', this.formGroup.controls['PremiseSearchOn'].value);
        this.search.set('SearchValue', this.formGroup.controls['PremiseSearchValue'].value);
        this.search.set('PortfolioStatus', this.formGroup.controls['PremiseStatusCode'].value);
        this.search.set('PremiseCommenceDateFrom', this.fieldVisibility.PremiseCommenceDateFrom ? this.formGroup.controls['PremiseCommenceDateFrom'].value : '');
        this.search.set('PremiseCommenceDateTo', this.fieldVisibility.PremiseCommenceDateTo ? this.formGroup.controls['PremiseCommenceDateTo'].value : '');
        this.search.set('riSortOrder', this.sortType);
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('HeaderClickedColumn', this.headerClicked);
        this.search.set('PageSize', this.pageSize.toString());
        this.search.set('PageCurrent', this.currentPage.toString());
        this.inputParams.search = this.search;
        this.premisesGrid.loadGridData(this.inputParams);
        this.storeData['pagination'].tabPremises = this.currentPage;
    };
    CallCenterGridPremisesComponent.prototype.premiseSearchOnChange = function (event) {
        var _this = this;
        if (this.formGroup.controls['PremiseSearchOn'].value === 'all') {
            this.fieldVisibility.PremiseSearchValue = true;
            this.formGroup.controls['PremiseSearchValue'].disable();
            this.formGroup.controls['PremiseSearchValue'].setValue('');
            this.fieldVisibility.PremiseCommenceDateFrom = false;
            this.fieldVisibility.PremiseCommenceDateTo = false;
        }
        else if (this.formGroup.controls['PremiseSearchOn'].value === 'PremiseCommenceDate') {
            this.fieldVisibility.PremiseSearchValue = false;
            this.fieldVisibility.PremiseCommenceDateFrom = true;
            this.fieldVisibility.PremiseCommenceDateTo = true;
            var date = new Date();
            this.dateObjects.PremiseCommenceDateFrom = new Date(date.setDate(date.getDate() - this.storeData['otherParams'].registry.giPremiseCommenceFromDays));
            date = new Date();
            this.dateObjects.PremiseCommenceDateTo = new Date(date.setDate(date.getDate() + this.storeData['otherParams'].registry.giPremiseCommenceToDays));
        }
        else {
            this.fieldVisibility.PremiseSearchValue = true;
            this.formGroup.controls['PremiseSearchValue'].enable();
            this.fieldVisibility.PremiseCommenceDateFrom = false;
            this.fieldVisibility.PremiseCommenceDateTo = false;
        }
        var tabText = document.querySelector('#tabCont .nav-tabs li.active a span')['innerText'];
        if (tabText === this.storeData['tabsTranslation'].tabPremises) {
            var focus_1 = new Event('focus', { bubbles: false });
            setTimeout(function () {
                if (document.querySelector('#PremiseSearchValue') !== null)
                    _this.renderer.invokeElementMethod(document.querySelector('#PremiseSearchValue'), 'focus', [focus_1]);
            }, 0);
        }
    };
    CallCenterGridPremisesComponent.prototype.premiseContractTypeCodeOnChange = function (event) {
        this.storeData['formGroup'].tabInvoices.controls['InvoiceContractTypeCode'].setValue(this.formGroup.controls['PremiseContractTypeCode'].value);
    };
    CallCenterGridPremisesComponent.prototype.premiseSearchOnKeyDown = function (event) {
        if (event.keyCode === 13) {
            this.loadGridView();
        }
    };
    CallCenterGridPremisesComponent.prototype.premiseSearchValueOnKeyDown = function (event) {
        if (event.keyCode === 13) {
            this.loadGridView();
        }
    };
    CallCenterGridPremisesComponent.prototype.premiseStatusCodeOnKeyDown = function (event) {
        if (event.keyCode === 13) {
            this.loadGridView();
        }
    };
    CallCenterGridPremisesComponent.prototype.premiseContractTypeCodeOnKeyDown = function (event) {
        if (event.keyCode === 13) {
            this.loadGridView();
        }
    };
    CallCenterGridPremisesComponent.prototype.cmdContactPremiseOnClick = function (event) {
        this.store.dispatch({
            type: CallCenterActionTypes.PORTFOLIO_CONTACT_DETAILS, payload: ['PR']
        });
    };
    CallCenterGridPremisesComponent.prototype.cmdPremClearSelectedOnClick = function (event) {
        if (this.formGroup.controls['PremSelectedContract'].value !== '') {
            this.formGroup.controls['PremSelectedContract'].setValue('');
            this.loadGridView();
        }
    };
    CallCenterGridPremisesComponent.prototype.cmdPremiseClearSearchOnClick = function (event) {
        if (this.formGroup.controls['PremiseSearchOn'].value !== 'all' || this.formGroup.controls['PremiseSearchValue'].value !== '' || this.formGroup.controls['PremiseStatusCode'].value !== 'all') {
            this.resetPremiseSearch();
            this.loadGridView();
        }
    };
    CallCenterGridPremisesComponent.prototype.cmdGoServiceCoverOnClick = function (event) {
        var _this = this;
        if (this.storeData['otherParams'].otherVariables.ContractLimitDataView === 'N') {
            if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '') {
                this.storeData['subject']['CmdNewCallSent'].asObservable().subscribe(function (recieved) {
                    if (recieved['type'] === 'Premises') {
                        if (_this.storeData['otherParams'].otherVariables.ContractType === 'C' || _this.storeData['otherParams'].otherVariables.ContractType === 'J') {
                            _this.router.navigate(['grid/application/premiseServiceSummary'], { queryParams: {
                                    parentMode: 'CallCentreSearch',
                                    ContractNumber: _this.storeData['otherParams'].otherVariables.ContractNumber,
                                    ContractName: _this.storeData['otherParams'].otherVariables.ContractName,
                                    AccountNumber: _this.storeData['otherParams'].otherVariables.AccountNumber,
                                    PremiseNumber: _this.storeData['otherParams'].otherVariables.PremiseNumber,
                                    PremiseName: _this.storeData['formGroup'].tabPremises.controls['PremiseName'],
                                    CurrentCallLogID: _this.storeData['otherParams'].otherVariables.CurrentCallLogID
                                } });
                        }
                        else if (_this.storeData['otherParams'].otherVariables.ContractType === 'P') {
                            _this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSAPRODUCTSALESSCENTRYGRID.URL_1], { queryParams: {
                                    parentMode: 'CallCentreSearch',
                                    ContractNumber: _this.storeData['otherParams'].otherVariables.ContractNumber,
                                    ContractName: _this.storeData['otherParams'].otherVariables.ContractName,
                                    AccountNumber: _this.storeData['otherParams'].otherVariables.AccountNumber,
                                    PremiseNumber: _this.storeData['otherParams'].otherVariables.PremiseNumber,
                                    PremiseName: _this.storeData['formGroup'].tabPremises.controls['PremiseName'].value,
                                    CurrentCallLogID: _this.storeData['otherParams'].otherVariables.CurrentCallLogID
                                } });
                        }
                    }
                    _this.storeData['subject']['CmdNewCallSent'].unsubscribe();
                });
                this.storeData['subject']['CmdNewCallRecieved'].next({
                    type: 'Premises'
                });
            }
            else {
                if (this.storeData['otherParams'].otherVariables.ContractType === 'C' || this.storeData['otherParams'].otherVariables.ContractType === 'J') {
                    this.router.navigate(['grid/application/premiseServiceSummary'], { queryParams: {
                            parentMode: 'CallCentreSearch',
                            ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
                            ContractName: this.storeData['otherParams'].otherVariables.ContractName,
                            AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
                            PremiseNumber: this.storeData['otherParams'].otherVariables.PremiseNumber,
                            PremiseName: this.storeData['formGroup'].tabPremises.controls['PremiseName'].value,
                            CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID
                        } });
                }
                else if (this.storeData['otherParams'].otherVariables.ContractType === 'P') {
                    this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSAPRODUCTSALESSCENTRYGRID.URL_1], { queryParams: {
                            parentMode: 'CallCentreSearch',
                            ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
                            ContractName: this.storeData['otherParams'].otherVariables.ContractName,
                            AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
                            PremiseNumber: this.storeData['otherParams'].otherVariables.PremiseNumber,
                            PremiseName: this.storeData['formGroup'].tabPremises.controls['PremiseName'].value,
                            CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID
                        } });
                }
            }
        }
        else {
            this.store.dispatch({
                type: CallCenterActionTypes.DISPLAY_ERROR, payload: this.storeData['otherParams'].registry['gcPermissionDeniedMessage']
            });
        }
    };
    CallCenterGridPremisesComponent.prototype.resetPremiseSearch = function () {
        this.fieldVisibility.FurtherRecords = false;
        this.formGroup.controls['PremSelectedContract'].setValue('');
        this.formGroup.controls['PremiseSearchOn'].setValue('all');
        this.formGroup.controls['PremiseSearchValue'].setValue('');
        this.formGroup.controls['PremiseStatusCode'].setValue('all');
        this.formGroup.controls['PremiseContractTypeCode'].setValue(this.storeData['storeFormDataClone'].tabPremises.PremiseContractTypeCode);
    };
    CallCenterGridPremisesComponent.prototype.premiseCommenceDateFromSelectedValue = function (value) {
        if (value && value['value']) {
            this.premiseCommenceFromDateDisplay = value['value'];
            this.formGroup.controls['PremiseCommenceDateFrom'].setValue(this.premiseCommenceFromDateDisplay);
            if (this.initComplete && this.storeData['allowAjaxOnDateChange'])
                this.loadGridView();
        }
        else {
            this.premiseCommenceFromDateDisplay = '';
            this.formGroup.controls['PremiseCommenceDateFrom'].setValue('');
        }
    };
    CallCenterGridPremisesComponent.prototype.premiseCommenceDateToSelectedValue = function (value) {
        if (value && value['value']) {
            this.premiseCommenceToDateDisplay = value['value'];
            this.formGroup.controls['PremiseCommenceDateTo'].setValue(this.premiseCommenceToDateDisplay);
            if (this.initComplete && this.storeData['allowAjaxOnDateChange'])
                this.loadGridView();
        }
        else {
            this.premiseCommenceToDateDisplay = '';
            this.formGroup.controls['PremiseCommenceDateTo'].setValue('');
        }
    };
    CallCenterGridPremisesComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-call-center-grid-premises',
                    templateUrl: 'iCABSCMCallCentreGridPremises.html'
                },] },
    ];
    CallCenterGridPremisesComponent.ctorParameters = [
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
    CallCenterGridPremisesComponent.propDecorators = {
        'premisesGrid': [{ type: ViewChild, args: ['premisesGrid',] },],
    };
    return CallCenterGridPremisesComponent;
}());
