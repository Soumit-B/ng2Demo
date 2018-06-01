import { Component, NgZone, ViewChild, Renderer } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../../shared/services/http-service';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { CallCenterActionTypes } from '../../../actions/call-centre-search';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { Utils } from '../../../../shared/services/utility';
import { RiExchange } from '../../../../shared/services/riExchange';
import { ContractManagementModuleRoutes } from '../../../base/PageRoutes';
export var CallCenterGridInvoicesComponent = (function () {
    function CallCenterGridInvoicesComponent(zone, fb, route, router, store, httpService, utils, serviceConstants, riExchange, renderer) {
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
            InvSelectedContractPremise: true,
            CmdInvClearSelected: true,
            InvoiceSearchOn: true,
            InvoiceSearchValue: true,
            InvoiceViewType: false,
            DefaultEmailFrom: false,
            InvoiceEmailAddress: false,
            InvoiceContractTypeCode: false,
            FurtherRecords: false
        };
        this.dropdownList = {
            InvoiceContractTypeCode: [
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
        this.formGroup = this.fb.group({
            InvSelectedContractPremise: [{ value: '', disabled: false }],
            CmdInvClearSelected: [{ disabled: false }],
            InvoiceSearchOn: [{ value: 'all', disabled: false }],
            InvoiceSearchValue: [{ value: '', disabled: false }],
            InvoiceViewType: [{ value: 'screen', disabled: false }],
            DefaultEmailFrom: [{ value: '', disabled: false }],
            InvoiceEmailAddress: [{ value: '', disabled: false }],
            InvoiceContractTypeCode: [{ value: '', disabled: false }]
        });
    }
    CallCenterGridInvoicesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.storeSubscription = this.store.select('callcentresearch').subscribe(function (data) {
            _this.storeData = data;
            if (data && data['action']) {
                switch (data['action']) {
                    case CallCenterActionTypes.BUILD_SPECIFIC_GRID:
                        if (_this.storeData['gridToBuild'].indexOf('Invoices') > -1) {
                            _this.loadGridView();
                        }
                        break;
                    case CallCenterActionTypes.CLEAR_SPECIFIC_GRID:
                        if (_this.storeData['gridToClear'].indexOf('Invoices') > -1) {
                            _this.invoicesGrid.clearGridData();
                            _this.invoiceSearchOnOnChange({});
                        }
                        break;
                    case CallCenterActionTypes.SET_PAGINATION:
                        if (_this.storeData['storeSavedData']['pagination']) {
                            _this.currentPage = _this.storeData['storeSavedData']['pagination'].tabInvoices;
                        }
                        break;
                    default:
                        break;
                }
            }
        });
        this.invoiceSearchOnOnChange({});
    };
    CallCenterGridInvoicesComponent.prototype.ngAfterViewInit = function () {
        this.store.dispatch({
            type: CallCenterActionTypes.FORM_GROUP, payload: {
                tabInvoices: this.formGroup
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_DROPDOWN_LIST, payload: {
                tabInvoices: this.dropdownList
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                tabInvoices: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.INITIALIZATION, payload: {
                tabInvoices: true
            }
        });
    };
    CallCenterGridInvoicesComponent.prototype.ngOnDestroy = function () {
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    CallCenterGridInvoicesComponent.prototype.getCurrentPage = function (event) {
        this.currentPage = event.value;
        this.refresh();
    };
    CallCenterGridInvoicesComponent.prototype.getGridInfo = function (info) {
        var _this = this;
        this.totalRecords = info.totalRows;
        if (info.gridData && info.gridData.body && info.gridData.body.cells.length > 0) {
            this.fieldVisibility.InvoiceViewType = true;
            this.formGroup.controls['InvoiceViewType'].setValue('screen');
            this.invoiceViewTypeOnChange({});
        }
        else {
            this.fieldVisibility.InvoiceViewType = false;
        }
        setTimeout(function () {
            _this.paginationCurrentPage = _this.currentPage;
        }, 0);
    };
    CallCenterGridInvoicesComponent.prototype.onGridRowClick = function (data) {
        var _this = this;
        this.onGridCellClick(data);
        if (data.cellIndex === 0) {
            if (this.storeData['otherParams'].otherVariables.ContractLimitDataView === 'N') {
                if (this.storeData['otherParams'].otherVariables.CurrentCallLogID === '' && (this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '' || this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '0')) {
                    this.storeData['subject']['CmdNewCallSent'].asObservable().subscribe(function (recieved) {
                        if (recieved['type'] === 'Invoices') {
                            _this.navigateToContract();
                        }
                        _this.storeData['subject']['CmdNewCallSent'].unsubscribe();
                    });
                    this.storeData['subject']['CmdNewCallRecieved'].next({
                        type: 'Invoices'
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
            this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTINVOICEDETAILGRID], { queryParams: {
                    parentMode: 'Account',
                    AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
                    ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
                    PremiseNumber: this.storeData['otherParams'].otherVariables.PremiseNumber,
                    ProductCode: this.storeData['otherParams'].otherVariables.ProductCode,
                    ProductDesc: this.storeData['otherParams'].otherVariables.ProductDesc,
                    CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID,
                    SelectedInvoice: this.storeData['otherParams'].otherVariables.SelectedInvoice.trim(),
                    InvoiceNumber: this.storeData['otherParams'].otherVariables.SelectedInvoice.trim(),
                    InvoiceName: '',
                    SystemInvoiceNumber: data.trRowData[2].additionalData,
                    CompanyCode: data.trRowData[1].additionalData,
                    ContractName: data.trRowData[3].additionalData,
                    CompanyDesc: data.trRowData[4].additionalData
                } });
        }
    };
    CallCenterGridInvoicesComponent.prototype.navigateToContract = function () {
        if (this.storeData['otherParams'].otherVariables.ContractType === 'C') {
            this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], { queryParams: {
                    parentMode: 'CallCentreSearch',
                    ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
                    CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID
                } });
        }
        else if (this.storeData['otherParams'].otherVariables.ContractType === 'J') {
            this.router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], { queryParams: {
                    parentMode: 'CallCentreSearch',
                    ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
                    CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID
                } });
        }
        else if (this.storeData['otherParams'].otherVariables.ContractType === 'P') {
            this.router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], { queryParams: {
                    parentMode: 'CallCentreSearch',
                    ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
                    CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID
                } });
        }
    };
    CallCenterGridInvoicesComponent.prototype.onGridCellClick = function (data) {
        this.storeData['otherParams'].otherVariables.ContractROWID = data.trRowData[0].rowID;
        this.storeData['otherParams'].otherVariables.ContractType = data.trRowData[1].text;
        this.storeData['otherParams'].otherVariables.SelectedInvoice = data.trRowData[2].text;
        this.storeData['otherParams'].otherVariables.SelectedInvoiceRowID = data.trRowData[2].rowID;
        if ((this.maxColumns === 13 && data.cellIndex === 12) || (this.maxColumns === 12 && data.cellIndex === 11)) {
            if (this.formGroup.controls['InvoiceViewType'].value === 'email') {
                this.store.dispatch({
                    type: CallCenterActionTypes.SHOW_EMAIL_INVOICE, payload: [this.storeData['otherParams'].otherVariables.SelectedInvoiceRowID]
                });
            }
            else {
                this.store.dispatch({
                    type: CallCenterActionTypes.SHOW_PRINT_INVOICE, payload: [this.storeData['otherParams'].otherVariables.SelectedInvoiceRowID]
                });
            }
        }
    };
    CallCenterGridInvoicesComponent.prototype.refresh = function () {
        this.fieldVisibility.InvoiceViewType = false;
        this.fieldVisibility.DefaultEmailFrom = false;
        this.fieldVisibility.InvoiceEmailAddress = false;
        this.fieldVisibility.FurtherRecords = false;
        this.loadGridView();
    };
    CallCenterGridInvoicesComponent.prototype.setGridSettings = function () {
        if (this.storeData['otherParams'].registry && this.storeData['otherParams'].registry.glShowInvoiceBalance) {
            this.maxColumns = 13;
        }
        else {
            this.maxColumns = 12;
        }
        this.setGridHeaders();
    };
    CallCenterGridInvoicesComponent.prototype.setGridHeaders = function () {
        this.gridSortHeaders = [
            {
                'fieldName': 'InvContractNumber',
                'index': 0,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'InvContractTypeCode',
                'index': 1,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'InvInvoiceNumber',
                'index': 2,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'InvInvoiceGroupNumber',
                'index': 3,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'InvExtractDate',
                'index': 4,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'InvPeriodStart',
                'index': 5,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'InvTaxPointDate',
                'index': 6,
                'sortType': 'ASC'
            },
            {
                'fieldName': 'InvInvoiceValue',
                'index': 10,
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
                'index': 2
            }
        ];
        for (var k = 0; k < this.gridSortHeaders.length; k++) {
            if (this.gridSortHeaders[k].fieldName === this.headerClicked) {
                this.gridSortHeaders[k].sortType = this.sortType === 'Descending' ? 'DESC' : 'ASC';
            }
        }
    };
    CallCenterGridInvoicesComponent.prototype.sortGrid = function (data) {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.loadGridView();
    };
    CallCenterGridInvoicesComponent.prototype.loadGridView = function () {
        this.setGridSettings();
        var urlParams = this.riExchange.getRouterUrlParams();
        this.inputParams.module = this.queryGrid.module;
        this.inputParams.method = this.queryGrid.method;
        this.inputParams.operation = this.queryGrid.operation;
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
        this.search.set('GridName', 'Invoice');
        this.search.set('AccountNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'AccountNumber'));
        this.search.set('ProspectNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'ProspectNumber'));
        this.search.set('ContractNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'InvSelectedContract'));
        this.search.set('PremiseNumber', this.utils.checkIfValueExistAndReturn(this.storeData['otherParams'].otherVariables, 'InvSelectedPremise'));
        this.search.set('ContractTypeCode', this.formGroup.controls['InvoiceContractTypeCode'] ? this.formGroup.controls['InvoiceContractTypeCode'].value : '');
        this.search.set('SearchOn', this.formGroup.controls['InvoiceSearchOn'].value);
        this.search.set('SearchValue', this.formGroup.controls['InvoiceSearchValue'].value);
        this.search.set('riSortOrder', this.sortType);
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('HeaderClickedColumn', this.headerClicked);
        this.search.set('PageSize', this.pageSize.toString());
        this.search.set('PageCurrent', this.currentPage.toString());
        this.inputParams.search = this.search;
        this.invoicesGrid.loadGridData(this.inputParams);
        this.storeData['pagination'].tabInvoices = this.currentPage;
    };
    CallCenterGridInvoicesComponent.prototype.invoiceViewTypeOnChange = function (event) {
        if (this.formGroup.controls['InvoiceViewType'].value === 'email') {
            this.fieldVisibility.DefaultEmailFrom = true;
            this.fieldVisibility.InvoiceEmailAddress = true;
            this.formGroup.controls['InvoiceEmailAddress'].setValidators(Validators.required);
            this.formGroup.controls['InvoiceEmailAddress'].updateValueAndValidity();
            this.formGroup.controls['DefaultEmailFrom'].setValue('account');
            this.defaultEmailFromOnChange({});
        }
        else {
            this.formGroup.controls['InvoiceEmailAddress'].clearValidators();
            this.formGroup.controls['InvoiceEmailAddress'].updateValueAndValidity();
            this.fieldVisibility.DefaultEmailFrom = false;
            this.fieldVisibility.InvoiceEmailAddress = false;
        }
    };
    CallCenterGridInvoicesComponent.prototype.defaultEmailFromOnChange = function (event) {
        if (this.formGroup.controls['DefaultEmailFrom'].value === 'account') {
            this.formGroup.controls['InvoiceEmailAddress'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountContactEmail'].value);
        }
        else if (this.formGroup.controls['DefaultEmailFrom'].value === 'contract') {
            this.formGroup.controls['InvoiceEmailAddress'].setValue(this.storeData['otherParams'].otherVariables.ContractContactEmail);
        }
        else if (this.formGroup.controls['DefaultEmailFrom'].value === 'premise') {
            this.formGroup.controls['InvoiceEmailAddress'].setValue(this.storeData['formGroup'].tabPremises.controls['PremiseContactEmail'].value);
        }
    };
    CallCenterGridInvoicesComponent.prototype.cmdInvClearSelectedOnClick = function (event) {
        if (this.storeData['otherParams'].otherVariables.InvSelectedContract !== '' && this.storeData['otherParams'].otherVariables.InvSelectedPremise !== '') {
            this.storeData['otherParams'].otherVariables.InvSelectedPremise = '';
            this.formGroup.controls['InvSelectedContractPremise'].setValue(this.storeData['otherParams'].otherVariables.InvSelectedContract);
            this.loadGridView();
        }
        else if (this.storeData['otherParams'].otherVariables.InvSelectedContract !== '') {
            this.storeData['otherParams'].otherVariables.InvSelectedContract = '';
            this.storeData['otherParams'].otherVariables.InvSelectedPremise = '';
            this.formGroup.controls['InvSelectedContractPremise'].setValue('');
            this.loadGridView();
        }
    };
    CallCenterGridInvoicesComponent.prototype.invoiceSearchOnOnChange = function (event) {
        var _this = this;
        if (this.formGroup.controls['InvoiceSearchOn'].value === 'all') {
            this.formGroup.controls['InvoiceSearchValue'].setValue('');
            this.formGroup.controls['InvoiceSearchValue'].disable();
        }
        else {
            this.formGroup.controls['InvoiceSearchValue'].setValue('');
            this.formGroup.controls['InvoiceSearchValue'].enable();
            var tabText = document.querySelector('#tabCont .nav-tabs li.active a span')['innerText'];
            if (tabText === this.storeData['tabsTranslation'].tabInvoices) {
                var focus_1 = new Event('focus', { bubbles: false });
                setTimeout(function () {
                    _this.renderer.invokeElementMethod(document.querySelector('#InvoiceSearchValue'), 'focus', [focus_1]);
                }, 0);
            }
        }
        this.formGroup.controls['InvoiceSearchValue'].setValue('');
    };
    CallCenterGridInvoicesComponent.prototype.invoiceSearchOnOnKeyDown = function (event) {
        if (event.keyCode === 13) {
            this.loadGridView();
        }
    };
    CallCenterGridInvoicesComponent.prototype.invoiceSearchValueOnKeyDown = function (event) {
        if (event.keyCode === 13) {
            this.loadGridView();
        }
    };
    CallCenterGridInvoicesComponent.prototype.invoiceContractTypeCodeOnKeyDown = function (event) {
        if (event.keyCode === 13) {
            this.loadGridView();
        }
    };
    CallCenterGridInvoicesComponent.prototype.fetchTranslationContent = function () {
    };
    CallCenterGridInvoicesComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-call-center-grid-invoices',
                    templateUrl: 'iCABSCMCallCentreGridInvoices.html'
                },] },
    ];
    CallCenterGridInvoicesComponent.ctorParameters = [
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
    CallCenterGridInvoicesComponent.propDecorators = {
        'invoicesGrid': [{ type: ViewChild, args: ['invoicesGrid',] },],
    };
    return CallCenterGridInvoicesComponent;
}());
