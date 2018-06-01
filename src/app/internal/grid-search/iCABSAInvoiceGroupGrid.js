import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { InvoiceActionTypes } from './../../actions/invoice';
import { FormBuilder, Validators } from '@angular/forms';
import { RiExchange } from './../../../shared/services/riExchange';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { BillToCashConstants } from './../../bill-to-cash/bill-to-cash-constants';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { Utils } from './../../../shared/services/utility';
import { Router } from '@angular/router';
import { AppModuleRoutes, BillToCashModuleRoutes } from './../../base/PageRoutes';
export var InvoiceGroupGridComponent = (function () {
    function InvoiceGroupGridComponent(store, formBuilder, riExchange, serviceConstants, ellipsis, localeTranslateService, utils, router) {
        this.store = store;
        this.formBuilder = formBuilder;
        this.riExchange = riExchange;
        this.serviceConstants = serviceConstants;
        this.ellipsis = ellipsis;
        this.localeTranslateService = localeTranslateService;
        this.utils = utils;
        this.router = router;
        this.gridInputParams = {
            module: '',
            method: '',
            operation: '',
            search: null
        };
        this.searchConstants = {
            action: 2,
            riGridMode: 0,
            riGridHandle: 67334,
            pageSize: 10,
            HeaderClickedColumn: '',
            riSortOrder: 'Descending'
        };
        this.isAddNew = false;
        this.elementStatus = {
            addNew: true
        };
        this.riExchange.getStore('invoice');
        this.maxColumn = 9;
        this.itemsPerPage = this.searchConstants.pageSize;
        this.currentPage = 1;
        this.storeMode = {
            searchMode: false,
            addMode: true,
            updateMode: false
        };
    }
    InvoiceGroupGridComponent.prototype.ngOnInit = function () {
        this.buildForm();
        this.storeSubscription = this.store.select('invoice').subscribe(this.utils.noop);
    };
    InvoiceGroupGridComponent.prototype.ngAfterViewInit = function () {
        if (this.parentMode === 'AddInvoiceGroup') {
            this.elementStatus.addNew = false;
        }
        else {
            this.elementStatus.addNew = true;
        }
        this.store.dispatch({
            type: ''
        });
        this.localeTranslateService.setUpTranslation();
    };
    InvoiceGroupGridComponent.prototype.ngOnDestroy = function () {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    };
    InvoiceGroupGridComponent.prototype.buildForm = function () {
        this.invoiceSearchFormGroup = this.formBuilder.group({
            AccountNumber: [{ value: '', disabled: true }, Validators.required],
            AccountName: [{ value: '', disabled: true }],
            LiveInvoiceGroupInd: [{ value: '' }]
        });
    };
    InvoiceGroupGridComponent.prototype.updateView = function (params) {
        this.inputParams = params;
        this.elementStatus.addNew = this.parentMode === 'AddInvoiceGroup' ? false : true;
        if (this.inputParams) {
            this.parentMode = this.inputParams.parentMode;
        }
        this.setControlValue(this.serviceConstants.AccountNumber, this.inputParams.AccountNumber);
        this.setControlValue('AccountName', this.inputParams.AccountName);
        this.loadGrid(params);
    };
    InvoiceGroupGridComponent.prototype.loadGrid = function (params) {
        var isLiveInvoice = this.getControlValue('LiveInvoiceGroupInd');
        isLiveInvoice = isLiveInvoice ? 'True' : 'False';
        this.gridInputParams.module = BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupGrid']['module'];
        this.gridInputParams.method = BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupGrid']['method'];
        this.gridInputParams.operation = BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupGrid']['operation'];
        this.searchQuery = new URLSearchParams();
        this.searchQuery.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.searchQuery.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.searchQuery.set(this.serviceConstants.Action, '2');
        this.searchQuery.set(this.serviceConstants.AccountNumber, this.getControlValue(this.serviceConstants.AccountNumber));
        this.searchQuery.set('LiveInvoiceGroupInd', isLiveInvoice);
        this.searchQuery.set('pageCurrent', this.currentPage);
        for (var key in this.searchConstants) {
            if (key) {
                this.searchQuery.set(key, this.searchConstants[key]);
            }
        }
        this.gridInputParams.search = this.searchQuery;
        this.invoiceGroupGrid.loadGridData(this.gridInputParams);
    };
    InvoiceGroupGridComponent.prototype.setControlValue = function (control, value) {
        this.invoiceSearchFormGroup.controls[control].setValue(value);
    };
    InvoiceGroupGridComponent.prototype.getControlValue = function (control) {
        return this.invoiceSearchFormGroup.controls[control].value;
    };
    InvoiceGroupGridComponent.prototype.getCurrentPage = function (curPage) {
        this.currentPage = curPage ? curPage.value : this.currentPage;
        this.loadGrid(this.inputParams);
    };
    InvoiceGroupGridComponent.prototype.getGridInfo = function (info) {
        var gridTotalItems = this.itemsPerPage;
        if (info) {
            this.totalRecords = info.totalRows;
        }
    };
    InvoiceGroupGridComponent.prototype.refresh = function () {
        this.loadGrid(this.inputParams);
    };
    InvoiceGroupGridComponent.prototype.onRowSelect = function (row) {
        row.rowData['InvoiceGroupROWID'] = row.cellData.rowID;
        row.rowData['trRowData'] = row.trRowData;
        this.ellipsis.sendDataToParent(row.rowData);
    };
    InvoiceGroupGridComponent.prototype.onAddNew = function ($event) {
        if (this.parentMode !== 'InvoiceGroupMaintenance') {
            this.router.navigate([AppModuleRoutes.BILLTOCASH + BillToCashModuleRoutes.ICABSAINVOICEGROUPMAINTENANCE], {
                queryParams: {
                    parentMode: 'IGSearchAdd',
                    AccountNumber: this.riExchange.riInputElement.GetValue(this.invoiceSearchFormGroup, 'AccountNumber'),
                    AccountName: this.riExchange.riInputElement.GetValue(this.invoiceSearchFormGroup, 'AccountName'),
                    IGParentMode: this.parentMode,
                    ContractNumber: this.inputParams['ContractNumber'],
                    PremiseNumber: this.inputParams['PremiseNumber']
                }
            });
            return;
        }
        this.store.dispatch({
            type: InvoiceActionTypes.SAVE_MODE,
            payload: this.storeMode
        });
        this.ellipsis.closeModal();
    };
    InvoiceGroupGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAInvoiceGroupGrid.html'
                },] },
    ];
    InvoiceGroupGridComponent.ctorParameters = [
        { type: Store, },
        { type: FormBuilder, },
        { type: RiExchange, },
        { type: ServiceConstants, },
        { type: EllipsisComponent, },
        { type: LocaleTranslationService, },
        { type: Utils, },
        { type: Router, },
    ];
    InvoiceGroupGridComponent.propDecorators = {
        'invoiceGroupGrid': [{ type: ViewChild, args: ['invoiceGroupGrid',] },],
        'invoiceGroupGridPagination': [{ type: ViewChild, args: ['invoiceGroupGridPagination',] },],
    };
    return InvoiceGroupGridComponent;
}());
