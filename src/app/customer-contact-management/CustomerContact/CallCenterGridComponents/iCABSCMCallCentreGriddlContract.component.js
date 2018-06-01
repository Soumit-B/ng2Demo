import { Component, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../../shared/services/http-service';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { CallCenterActionTypes } from '../../../actions/call-centre-search';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { Utils } from '../../../../shared/services/utility';
import { RiExchange } from '../../../../shared/services/riExchange';
export var CallCenterGriddlContractComponent = (function () {
    function CallCenterGriddlContractComponent(zone, fb, route, router, store, httpService, utils, serviceConstants, riExchange) {
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
            DlContractViewType: false,
            DlContractEmailAddress: false,
            DlContractDocumentType: true,
            DlContractOutputType: true,
            FurtherRecords: false
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
        this.maxColumns = 9;
        this.gridSortHeaders = [];
        this.headerProperties = [];
        this.formGroup = this.fb.group({
            DlContractViewType: [{ value: 'view', disabled: false }],
            DlContractEmailAddress: [{ value: '', disabled: false }],
            DlContractDocumentType: [{ value: 'quote', disabled: false }],
            DlContractOutputType: [{ value: 'pdf', disabled: false }]
        });
    }
    CallCenterGriddlContractComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.setGridHeaders();
        this.storeSubscription = this.store.select('callcentresearch').subscribe(function (data) {
            _this.storeData = data;
            if (data && data['action']) {
                switch (data['action']) {
                    case CallCenterActionTypes.BUILD_SPECIFIC_GRID:
                        if (_this.storeData['gridToBuild'].indexOf('DlContract') > -1) {
                            _this.loadGridView();
                        }
                        break;
                    case CallCenterActionTypes.CLEAR_SPECIFIC_GRID:
                        if (_this.storeData['gridToClear'].indexOf('History') > -1) {
                            _this.dlContractGrid.clearGridData();
                        }
                        break;
                    case CallCenterActionTypes.SET_PAGINATION:
                        if (_this.storeData['storeSavedData']['pagination']) {
                            _this.currentPage = _this.storeData['storeSavedData']['pagination'].tabDlContract;
                        }
                        break;
                    default:
                        break;
                }
            }
        });
    };
    CallCenterGriddlContractComponent.prototype.ngAfterViewInit = function () {
        this.store.dispatch({
            type: CallCenterActionTypes.FORM_GROUP, payload: {
                tabDlContract: this.formGroup
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.INITIALIZATION, payload: {
                tabDlContract: true
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                tabDlContract: this.fieldVisibility
            }
        });
    };
    CallCenterGriddlContractComponent.prototype.ngOnDestroy = function () {
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    CallCenterGriddlContractComponent.prototype.getCurrentPage = function (event) {
        this.currentPage = event.value;
        this.refresh();
    };
    CallCenterGriddlContractComponent.prototype.getGridInfo = function (info) {
        var _this = this;
        this.totalRecords = info.totalRows;
        setTimeout(function () {
            _this.paginationCurrentPage = _this.currentPage;
        }, 0);
        if (info.gridData && info.gridData.body && info.gridData.body.cells.length > 0) {
        }
    };
    CallCenterGriddlContractComponent.prototype.onGridRowClick = function (data) {
        this.onGridCellClick(data);
    };
    CallCenterGriddlContractComponent.prototype.onGridCellClick = function (data) {
    };
    CallCenterGriddlContractComponent.prototype.refresh = function () {
        this.loadGridView();
    };
    CallCenterGriddlContractComponent.prototype.setGridHeaders = function () {
        var obj = [
            {
                'fieldName': 'QuoteRef',
                'index': 0,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'QuoteDate',
                'index': 1,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'ContractValue',
                'index': 2,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'JobValue',
                'index': 3,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'TotalPrem',
                'index': 4,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'TotalSCover',
                'index': 5,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'ServiceDetails',
                'index': 6,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'QuoteStage',
                'index': 7,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'PrintSendQuote',
                'index': 8,
                'sortType': 'ASC'
            }
        ];
        this.headerProperties = [];
        this.gridSortHeaders = obj;
        for (var k = 0; k < this.gridSortHeaders.length; k++) {
            if (this.gridSortHeaders[k].fieldName === this.headerClicked) {
                this.gridSortHeaders[k].sortType = this.sortType === 'Descending' ? 'DESC' : 'ASC';
            }
        }
    };
    CallCenterGriddlContractComponent.prototype.sortGrid = function (data) {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.loadGridView();
    };
    CallCenterGriddlContractComponent.prototype.loadGridView = function () {
        this.setGridHeaders();
        var urlParams = this.riExchange.getRouterUrlParams();
        this.inputParams.module = this.queryGrid.module;
        this.inputParams.method = this.queryGrid.method;
        this.inputParams.operation = this.queryGrid.operation;
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
        this.search.set('GridName', 'dlContract');
        this.search.set('AccountNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'AccountNumber'));
        this.search.set('ProspectNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'ProspectNumber'));
        this.search.set('ContractNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'WOSelectedContract'));
        this.search.set('PremiseNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'WOSelectedPremise'));
        this.search.set('DlContractViewType', this.formGroup.controls['DlContractViewType'].value);
        this.search.set('DlContractEmailAddress', this.formGroup.controls['DlContractEmailAddress'].value);
        this.search.set('DlContractDocumentType', this.formGroup.controls['DlContractDocumentType'].value);
        this.search.set('DlContractOutputType', this.formGroup.controls['DlContractOutputType'].value);
        this.search.set('riSortOrder', this.sortType);
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('HeaderClickedColumn', this.headerClicked);
        this.search.set('PageSize', this.pageSize.toString());
        this.search.set('PageCurrent', this.currentPage.toString());
        this.inputParams.search = this.search;
        this.dlContractGrid.loadGridData(this.inputParams);
        this.storeData['pagination'].tabDlContract = this.currentPage;
    };
    CallCenterGriddlContractComponent.prototype.dlContractViewTypeOnChange = function (event) {
        if (this.formGroup.controls['DlContractViewType'].value === 'email') {
            this.fieldVisibility.DlContractEmailAddress = true;
            this.formGroup.controls['DlContractEmailAddress'].setValidators(Validators.required);
            this.formGroup.controls['DlContractEmailAddress'].updateValueAndValidity();
            this.defaultEmailFromOnChange({});
        }
        else {
            this.formGroup.controls['DlContractEmailAddress'].clearValidators();
            this.formGroup.controls['DlContractEmailAddress'].updateValueAndValidity();
            this.fieldVisibility.DlContractEmailAddress = false;
        }
    };
    CallCenterGriddlContractComponent.prototype.defaultEmailFromOnChange = function (event) {
        this.formGroup.controls['DlContractEmailAddress'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountContactEmail'].value);
    };
    CallCenterGriddlContractComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-call-center-grid-dlcontract',
                    templateUrl: 'iCABSCMCallCentreGriddlContract.html'
                },] },
    ];
    CallCenterGriddlContractComponent.ctorParameters = [
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
    CallCenterGriddlContractComponent.propDecorators = {
        'dlContractGrid': [{ type: ViewChild, args: ['dlContractGrid',] },],
    };
    return CallCenterGriddlContractComponent;
}());
