import { Component, NgZone, ViewChild, Renderer } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../../shared/services/http-service';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { CallCenterActionTypes } from '../../../actions/call-centre-search';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { Utils } from '../../../../shared/services/utility';
import { RiExchange } from '../../../../shared/services/riExchange';
export var CallCenterGridEventHistoryComponent = (function () {
    function CallCenterGridEventHistoryComponent(zone, fb, route, router, store, httpService, utils, serviceConstants, riExchange, renderer) {
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
            EventHistoryForm: false,
            EventHistorySelectedContractPremise: true,
            EventHistoryType: true,
            EventHistoryViewType: true,
            DefaultEventHistoryEmailFrom: true,
            EventHistoryEmailAddress: true,
            FurtherRecords: false
        };
        this.fieldRequired = {
            EventHistoryEmailAddress: false
        };
        this.dateObjectsEnabled = {
            EventHistoryFromDate: true,
            EventHistoryToDate: true
        };
        this.dateObjects = {
            EventHistoryFromDate: new Date(),
            EventHistoryToDate: new Date()
        };
        this.eventHistoryFromDateDisplay = '';
        this.eventHistoryToDateDisplay = '';
        this.search = new URLSearchParams();
        this.queryCallCentre = new URLSearchParams();
        this.queryGrid = {
            operation: 'ContactManagement/iCABSCMCallCentreGrid',
            module: 'call-centre',
            method: 'ccm/maintenance',
            contentType: 'application/x-www-form-urlencoded'
        };
        this.queryParamsCallCentre = {
            action: '0',
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
        this.maxColumns = 5;
        this.gridSortHeaders = [];
        this.headerProperties = [];
        this.currentContractType = '';
        this.currentContractTypeURLParameter = '';
        this.initComplete = false;
        this.formGroup = this.fb.group({
            EventHistorySelectedContractPremise: [{ value: '', disabled: false }],
            EventHistoryType: [{ value: 'all', disabled: false }],
            EventHistoryToDate: [{ disabled: false }],
            EventHistoryFromDate: [{ disabled: false }],
            EventHistoryViewType: [{ value: 'screen', disabled: false }],
            DefaultEventHistoryEmailFrom: [{ value: '', disabled: false }],
            EventHistoryEmailAddress: [{ value: '', disabled: false }]
        });
    }
    CallCenterGridEventHistoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.setGridHeaders();
        this.storeSubscription = this.store.select('callcentresearch').subscribe(function (data) {
            _this.storeData = data;
            if (data && data['action']) {
                switch (data['action']) {
                    case CallCenterActionTypes.BUILD_SPECIFIC_GRID:
                        if (_this.storeData['gridToBuild'].indexOf('EventHistory') > -1) {
                            _this.loadGridView();
                        }
                        break;
                    case CallCenterActionTypes.CLEAR_SPECIFIC_GRID:
                        if (_this.storeData['gridToClear'].indexOf('EventHistory') > -1) {
                            _this.eventHistoryGrid.clearGridData();
                        }
                        break;
                    case CallCenterActionTypes.RESET_ALL_SEARCH_DETAILS:
                        _this.resetDate();
                        break;
                    case CallCenterActionTypes.SET_PAGINATION:
                        if (_this.storeData['storeSavedData']['pagination']) {
                            _this.currentPage = _this.storeData['storeSavedData']['pagination'].tabEventHistory;
                        }
                        break;
                    default:
                        break;
                }
            }
        });
    };
    CallCenterGridEventHistoryComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.store.dispatch({
            type: CallCenterActionTypes.FORM_GROUP, payload: {
                tabEventHistory: this.formGroup
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_DATE_VISIBILITY, payload: {
                tabEventHistory: this.dateObjectsEnabled
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                tabEventHistory: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_DATE_OBJECTS, payload: {
                tabEventHistory: this.dateObjects
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.INITIALIZATION, payload: {
                tabEventHistory: true
            }
        });
        setTimeout(function () {
            _this.initComplete = true;
        }, 100);
    };
    CallCenterGridEventHistoryComponent.prototype.ngOnDestroy = function () {
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    CallCenterGridEventHistoryComponent.prototype.getCurrentPage = function (event) {
        this.currentPage = event.value;
        this.refresh();
    };
    CallCenterGridEventHistoryComponent.prototype.getGridInfo = function (info) {
        var _this = this;
        this.totalRecords = info.totalRows;
        if (info.gridData && info.gridData.body && info.gridData.body.cells.length > 0) {
            this.fieldVisibility.EventHistoryForm = true;
            this.formGroup.controls['EventHistoryViewType'].setValue('screen');
            this.eventHistoryViewTypeOnChange({});
        }
        setTimeout(function () {
            _this.paginationCurrentPage = _this.currentPage;
        }, 0);
    };
    CallCenterGridEventHistoryComponent.prototype.onGridRowClick = function (data) {
        this.onGridCellClick(data);
        if (data.cellIndex === 0) {
            if (this.storeData['otherParams'].otherVariables.CurrentEventHistoryType === 'InvoiceHeader') {
                this.store.dispatch({
                    type: CallCenterActionTypes.SHOW_PRINT_INVOICE, payload: [this.storeData['otherParams'].otherVariables.CurrentEventHistoryRowid]
                });
            }
            if (this.storeData['otherParams'].otherVariables.CurrentEventHistoryType === 'ContactAction') {
                alert('Page not part of current sprint');
            }
            if (this.storeData['otherParams'].otherVariables.CurrentEventHistoryType === 'CustomerContact') {
                alert('Page not part of current sprint');
            }
            if (this.storeData['otherParams'].otherVariables.CurrentEventHistoryType === 'PlanVisit') {
                this.router.navigate(['/maintenance/planvisit'], {
                    queryParams: {
                        parentMode: 'ContactHistory',
                        AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
                        PlanVisitRowId: data.trRowData[0].rowID
                    }
                });
            }
            if (this.storeData['otherParams'].otherVariables.CurrentEventHistoryType === 'ServiceVisit') {
                alert('Page not part of current sprint');
            }
        }
        if (data.cellIndex === 4) {
            if (this.storeData['otherParams'].otherVariables.CurrentEventHistoryType === 'ServiceVisit') {
                if (this.storeData['formGroup'].tabEventHistory.controls['EventHistoryViewType'].value === 'email') {
                    this.showServiceVisitViaEmail(data.cellData.rowID);
                }
                else {
                    this.showServiceVisitToScreen(data.cellData.rowID);
                }
            }
            if (this.storeData['otherParams'].otherVariables.CurrentEventHistoryType === 'InvoiceHeader') {
                if (this.storeData['formGroup'].tabEventHistory.controls['EventHistoryViewType'].value === 'email') {
                    this.storeData['formGroup'].tabInvoices.controls['InvoiceEmailAddress'].setValue(this.storeData['formGroup'].tabEventHistory.controls['EventHistoryEmailAddress'].value);
                    this.storeData['otherParams'].otherVariables.SelectedInvoiceRowID = this.storeData['otherParams'].otherVariables.CurrentEventHistoryRowid;
                    this.store.dispatch({
                        type: CallCenterActionTypes.SHOW_EMAIL_INVOICE, payload: [this.storeData['otherParams'].otherVariables.CurrentEventHistoryRowid]
                    });
                }
                else {
                    this.store.dispatch({
                        type: CallCenterActionTypes.SHOW_PRINT_INVOICE, payload: [this.storeData['otherParams'].otherVariables.CurrentEventHistoryRowid]
                    });
                }
            }
            if (this.storeData['otherParams'].otherVariables.CurrentEventHistoryType === 'ContractRenewal') {
                this.contractRenewalPrint(data.cellData.additionalData);
            }
        }
    };
    CallCenterGridEventHistoryComponent.prototype.getCellDataOnBlur = function (data) {
    };
    CallCenterGridEventHistoryComponent.prototype.onGridCellClick = function (data) {
        this.storeData['otherParams'].otherVariables.CurrentEventHistoryType = data.trRowData[0].additionalData;
        this.storeData['otherParams'].otherVariables.CurrentEventHistoryRowid = data.trRowData[0].rowID;
        this.currentContractType = data.trRowData[3].additionalData;
        switch (this.currentContractType) {
            case 'C':
                this.currentContractTypeURLParameter = '';
                break;
            case 'J':
                this.currentContractTypeURLParameter = '<job>';
                break;
            case 'P':
                this.currentContractTypeURLParameter = '<product>';
                break;
            default:
                break;
        }
    };
    CallCenterGridEventHistoryComponent.prototype.cmdEventHistoryClearSelectedOnClick = function (event) {
        if (this.storeData['otherParams'].otherVariables.EventHistorySelectedContract !== '' && this.storeData['otherParams'].otherVariables.EventHistorySelectedPremise !== '') {
            this.storeData['otherParams'].otherVariables.EventHistorySelectedPremise = '';
            this.formGroup.controls['EventHistorySelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.EventHistorySelectedContract);
            this.loadGridView();
        }
        else if (this.storeData['otherParams'].otherVariables.EventHistorySelectedContract !== '') {
            this.storeData['otherParams'].otherVariables.EventHistorySelectedContract = '';
            this.storeData['otherParams'].otherVariables.EventHistorySelectedPremise = '';
            this.formGroup.controls['EventHistorySelectedContractPremise'].setValue('');
            this.loadGridView();
        }
    };
    CallCenterGridEventHistoryComponent.prototype.eventHistoryViewTypeOnChange = function (event) {
        if (this.formGroup.controls['EventHistoryViewType'].value === 'email') {
            this.fieldVisibility.DefaultEventHistoryEmailFrom = true;
            this.fieldVisibility.EventHistoryEmailAddress = true;
            this.formGroup.controls['EventHistoryEmailAddress'].setValidators(Validators.required);
            this.fieldRequired.EventHistoryEmailAddress = true;
            this.formGroup.controls['DefaultEventHistoryEmailFrom'].setValue('account');
            this.defaultEventHistoryEmailFromOnChange({});
        }
        else {
            this.formGroup.controls['EventHistoryEmailAddress'].clearValidators();
            this.fieldRequired.EventHistoryEmailAddress = false;
            this.fieldVisibility.DefaultEventHistoryEmailFrom = false;
            this.fieldVisibility.EventHistoryEmailAddress = false;
        }
    };
    CallCenterGridEventHistoryComponent.prototype.defaultEventHistoryEmailFromOnChange = function (event) {
        if (this.formGroup.controls['DefaultEventHistoryEmailFrom'].value === 'account') {
            this.formGroup.controls['EventHistoryEmailAddress'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountContactEmail'].value);
        }
        if (this.formGroup.controls['DefaultEventHistoryEmailFrom'].value === 'contract') {
            this.formGroup.controls['EventHistoryEmailAddress'].setValue(this.storeData['otherParams'].otherVariables.ContractContactEmail);
        }
        if (this.formGroup.controls['DefaultEventHistoryEmailFrom'].value === 'premise') {
            this.formGroup.controls['EventHistoryEmailAddress'].setValue(this.storeData['formGroup'].tabPremises.controls['PremiseContactEmail'].value);
        }
    };
    CallCenterGridEventHistoryComponent.prototype.contractRenewalPrint = function (property) {
        var _this = this;
        this.fetchCallCentreDataGet('', { action: 0, ReportNumber: property }).subscribe(function (data) {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                _this.store.dispatch({
                    type: CallCenterActionTypes.DISPLAY_ERROR, payload: data['oResponse']
                });
            }
            else {
                if (!data['errorMessage']) {
                    if (data.url) {
                        window.open(data.url, '_blank');
                    }
                }
            }
        });
    };
    CallCenterGridEventHistoryComponent.prototype.showServiceVisitViaEmail = function (rowId) {
        var _this = this;
        if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '') {
            this.storeData['subject']['CmdNewCallSent'].asObservable().subscribe(function (recieved) {
                if (recieved['type'] === 'Events') {
                    _this.serviceVisitViaEmail(rowId);
                }
                _this.storeData['subject']['CmdNewCallSent'].unsubscribe();
            });
            this.storeData['subject']['CmdNewCallRecieved'].next({
                type: 'Events'
            });
        }
        else {
            this.serviceVisitViaEmail(rowId);
        }
    };
    CallCenterGridEventHistoryComponent.prototype.serviceVisitViaEmail = function (rowId) {
        var _this = this;
        this.fetchCallCentreDataPost('EmailServiceVisit', {}, {
            BusinessCode: this.storeData['code'].business,
            CallLogID: this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value || this.storeData['otherParams'].otherVariables.CurrentCallLogID,
            PremiseVisitROWID: rowId,
            EmailAddress: this.formGroup.controls['EventHistoryEmailAddress'].value
        }).subscribe(function (data) {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                _this.store.dispatch({
                    type: CallCenterActionTypes.DISPLAY_ERROR, payload: data['oResponse']
                });
            }
            else {
                if (!data['errorMessage']) {
                    _this.store.dispatch({
                        type: CallCenterActionTypes.DISPLAY_ERROR, payload: data['ReturnMessage']
                    });
                    _this.storeData['otherParams'].otherVariables.CCMChangesMade = 'Y';
                    var click = new Event('click', { bubbles: true });
                    _this.renderer.invokeElementMethod(document.querySelector('#CmdEndCall'), 'dispatchEvent', [click]);
                }
                else {
                    _this.store.dispatch({
                        type: CallCenterActionTypes.DISPLAY_ERROR, payload: data['errorMessage']
                    });
                }
            }
        });
    };
    CallCenterGridEventHistoryComponent.prototype.showServiceVisitToScreen = function (rowId) {
        var _this = this;
        var strURL;
        var strServiceReceipt;
        this.fetchCallCentreDataPost('GetVisitWork', {}, {
            BusinessCode: this.storeData['code'].business,
            PremiseVisitROWID: rowId
        }).subscribe(function (data) {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                _this.store.dispatch({
                    type: CallCenterActionTypes.DISPLAY_ERROR, payload: data['oResponse']
                });
            }
            else {
                if (!data['errorMessage']) {
                    if (data['ServiceReceipt'] !== null && data['ServiceReceipt'] !== '') {
                        strServiceReceipt = data['ServiceReceipt'];
                        var reportParams = '&riCacheControlMaxAge=0' + '&BusinessCode=' + _this.storeData['code'].business + '&ServiceReceipt=' + strServiceReceipt;
                    }
                    else {
                        _this.fetchCallCentreDataGet('Single', { action: 0, PremiseVisitRowID: rowId, BusinessCode: _this.storeData['code'].business }).subscribe(function (data) {
                            if (data['status'] === GlobalConstant.Configuration.Failure) {
                                _this.store.dispatch({
                                    type: CallCenterActionTypes.DISPLAY_ERROR, payload: data['oResponse']
                                });
                            }
                            else {
                                if (!data['errorMessage']) {
                                    if (data.url) {
                                        window.open(data.url, '_blank');
                                    }
                                }
                            }
                        });
                    }
                }
            }
        });
    };
    CallCenterGridEventHistoryComponent.prototype.refresh = function () {
        this.loadGridView();
    };
    CallCenterGridEventHistoryComponent.prototype.fetchCallCentreDataPost = function (functionName, params, formData) {
        this.queryCallCentre = new URLSearchParams();
        var businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
        var countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();
        this.queryCallCentre.set(this.serviceConstants.BusinessCode, businessCode);
        this.queryCallCentre.set(this.serviceConstants.CountryCode, countryCode);
        if (functionName !== '') {
            this.queryCallCentre.set(this.serviceConstants.Action, '6');
            this.queryCallCentre.set('Function', functionName);
        }
        for (var key in params) {
            if (key) {
                this.queryCallCentre.set(key, params[key]);
            }
        }
        return this.httpService.makePostRequest(this.queryParamsCallCentre.method, this.queryParamsCallCentre.module, this.queryParamsCallCentre.operation, this.queryCallCentre, formData);
    };
    CallCenterGridEventHistoryComponent.prototype.fetchCallCentreDataGet = function (functionName, params) {
        this.queryCallCentre = new URLSearchParams();
        var businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
        var countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();
        this.queryCallCentre.set(this.serviceConstants.BusinessCode, businessCode);
        this.queryCallCentre.set(this.serviceConstants.CountryCode, countryCode);
        if (functionName !== '') {
            this.queryCallCentre.set(this.serviceConstants.Action, '6');
            this.queryCallCentre.set('Function', functionName);
        }
        for (var key in params) {
            if (key) {
                this.queryCallCentre.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.queryParamsCallCentre.method, this.queryParamsCallCentre.module, this.queryParamsCallCentre.operation, this.queryCallCentre);
    };
    CallCenterGridEventHistoryComponent.prototype.setGridHeaders = function () {
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
    CallCenterGridEventHistoryComponent.prototype.sortGrid = function (data) {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.loadGridView();
    };
    CallCenterGridEventHistoryComponent.prototype.loadGridView = function () {
        var urlParams = this.riExchange.getRouterUrlParams();
        this.inputParams.module = this.queryGrid.module;
        this.inputParams.method = this.queryGrid.method;
        this.inputParams.operation = this.queryGrid.operation;
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
        this.search.set('GridName', 'EventHistory');
        this.search.set('AccountNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'AccountNumber'));
        this.search.set('ProspectNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'ProspectNumber'));
        this.search.set('ContractNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'EventHistorySelectedContract'));
        this.search.set('PremiseNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'EventHistorySelectedPremise'));
        this.search.set('EventHistoryType', this.formGroup.controls['EventHistoryType'] ? this.formGroup.controls['EventHistoryType'].value : '');
        this.search.set('EventHistoryFromDate', this.formGroup.controls['EventHistoryFromDate'].value);
        this.search.set('EventHistoryToDate', this.formGroup.controls['EventHistoryToDate'].value);
        this.search.set('riSortOrder', 'Ascending');
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('HeaderClickedColumn', '');
        this.search.set('PageSize', this.pageSize.toString());
        this.search.set('PageCurrent', this.currentPage.toString());
        this.inputParams.search = this.search;
        this.eventHistoryGrid.loadGridData(this.inputParams);
        this.storeData['pagination'].tabEventHistory = this.currentPage;
    };
    CallCenterGridEventHistoryComponent.prototype.eventHistoryFromDateSelectedValue = function (value) {
        if (value && value['value']) {
            this.eventHistoryFromDateDisplay = value['value'];
            this.formGroup.controls['EventHistoryFromDate'].setValue(this.eventHistoryFromDateDisplay);
            if (this.initComplete && this.storeData['allowAjaxOnDateChange'])
                this.loadGridView();
        }
        else {
            this.eventHistoryFromDateDisplay = '';
            this.formGroup.controls['EventHistoryFromDate'].setValue('');
        }
    };
    CallCenterGridEventHistoryComponent.prototype.eventHistoryToDateSelectedValue = function (value) {
        if (value && value['value']) {
            this.eventHistoryToDateDisplay = value['value'];
            this.formGroup.controls['EventHistoryToDate'].setValue(this.eventHistoryToDateDisplay);
            if (this.initComplete && this.storeData['allowAjaxOnDateChange'])
                this.loadGridView();
        }
        else {
            this.eventHistoryToDateDisplay = '';
            this.formGroup.controls['EventHistoryToDate'].setValue('');
        }
    };
    CallCenterGridEventHistoryComponent.prototype.eventHistoryTypeOnKeyDown = function (event) {
        if (event.keyCode === 13) {
            this.loadGridView();
        }
    };
    CallCenterGridEventHistoryComponent.prototype.resetDate = function () {
        var date = new Date();
        this.dateObjects.EventHistoryFromDate = new Date(date.setDate(date.getDate() - this.storeData['otherParams'].registry.giEventHistoryFromDays));
        this.dateObjects.EventHistoryToDate = new Date();
    };
    CallCenterGridEventHistoryComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-call-center-grid-event-history',
                    templateUrl: 'iCABSCMCallCentreGridEventHistory.html'
                },] },
    ];
    CallCenterGridEventHistoryComponent.ctorParameters = [
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
    CallCenterGridEventHistoryComponent.propDecorators = {
        'eventHistoryGrid': [{ type: ViewChild, args: ['eventHistoryGrid',] },],
    };
    return CallCenterGridEventHistoryComponent;
}());
