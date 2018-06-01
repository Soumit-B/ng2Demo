/**
 * Component - iCABSAInvoiceGroupGrid
 * Ellipsis Page
 * Functionality - Invoice Group Search Based On The Account Number Passed
 */
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { InvoiceActionTypes } from './../../actions/invoice';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RiExchange } from './../../../shared/services/riExchange';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../shared/components/grid/grid';
import { URLSearchParams } from '@angular/http';
import { BillToCashConstants } from './../../bill-to-cash/bill-to-cash-constants';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { Utils } from './../../../shared/services/utility';
import { Router } from '@angular/router';
import { AppModuleRoutes, BillToCashModuleRoutes } from './../../base/PageRoutes';
import { CBBConstants } from './../../../shared/constants/cbb.constants';

@Component({
    templateUrl: 'iCABSAInvoiceGroupGrid.html'
})

export class InvoiceGroupGridComponent implements OnInit, AfterViewInit, OnDestroy {
    private parentMode: string;
    private gridInputParams = {
        module: '',
        method: '',
        operation: '',
        search: null
    };
    private searchQuery: URLSearchParams;
    private searchConstants = {
        action: 2,
        riGridMode: 0,
        riGridHandle: 67334,
        pageSize: 10,
        HeaderClickedColumn: '',
        riSortOrder: 'Descending'
    };
    private isAddNew = false;

    // Dynamic Components
    @ViewChild('invoiceGroupGrid') invoiceGroupGrid: GridComponent;
    @ViewChild('invoiceGroupGridPagination') invoiceGroupGridPagination: PaginationComponent;

    // Input Params
    private inputParams: any;

    // Model Propeties
    public maxColumn;
    public itemsPerPage;
    public currentPage;
    public totalRecords;

    // Store Variables
    private storeMode: Object;

    // Subscriptions
    private storeSubscription: Subscription;

    // Object Form Properties
    public invoiceSearchFormGroup: FormGroup;

    // Object Propoerties For Elements
    public elementStatus: any = {
        addNew: true
    };

    constructor(
        private store: Store<any>,
        private formBuilder: FormBuilder,
        private riExchange: RiExchange,
        private serviceConstants: ServiceConstants,
        private ellipsis: EllipsisComponent,
        private localeTranslateService: LocaleTranslationService,
        private utils: Utils,
        public router: Router
    ) {
        this.riExchange.getStore('invoice');

        // Set Model Parameters
        this.maxColumn = 9;
        this.itemsPerPage = this.searchConstants.pageSize;
        this.currentPage = 1;

        // Set Form Mode
        this.storeMode = {
            searchMode: false,
            addMode: true,
            updateMode: false
        };
    }

    // Lifecycle Methods
    public ngOnInit(): void {
        // Call Method To Build Form
        this.buildForm();

        // Subscribe To Store
        this.storeSubscription = this.store.select('invoice').subscribe(this.utils.noop);
    }

    public ngAfterViewInit(): void {
        if (this.parentMode === 'AddInvoiceGroup') {
            this.elementStatus.addNew = false;
        } else {
            this.elementStatus.addNew = true;
        }
        this.store.dispatch({
            type: ''
        });

        // Initialize Translate Service
        this.localeTranslateService.setUpTranslation();
    }

    public ngOnDestroy(): void {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }

    /**
     * Method - buildForm
     * Builds the form in the page
     */
    private buildForm(): void {
        this.invoiceSearchFormGroup = this.formBuilder.group({
            AccountNumber: [{ value: '', disabled: true }, Validators.required],
            AccountName: [{ value: '', disabled: true }],
            LiveInvoiceGroupInd: [{ value: '' }]
        });
    }

    /**
     * Method - updateForms
     * Update forms with values from invoice key of store
     */
    /*private updateForms(): void {
        this.setControlValue(this.serviceConstants.AccountNumber, this.storeInvoice[this.serviceConstants.AccountNumber]);
        this.setControlValue('AccountName', this.storeInvoice['AccountName']);

        this.loadGrid({});
    }*/

    public updateView(params: any): void {
        this.inputParams = params;
        this.elementStatus.addNew = (this.inputParams.parentMode === 'AddInvoiceGroup' || this.inputParams.parentMode === 'InvoiceGroupMaintenance' || this.inputParams.parentMode === 'PremiseMaintenanceSearch');

        // Get Parent Mode
        if (this.inputParams) {
            this.parentMode = this.inputParams.parentMode;
        }

        this.setControlValue(this.serviceConstants.AccountNumber, this.inputParams.AccountNumber);
        this.setControlValue('AccountName', this.inputParams.AccountName);

        this.loadGrid(params);
    }

    /**
     * Method - loadGrid
     * Load grid data
     */
    private loadGrid(params: any): void {
        let isLiveInvoice = this.getControlValue('LiveInvoiceGroupInd');

        // Modify For Request Parameter
        isLiveInvoice = isLiveInvoice ? 'True' : 'False';

        // Set Request Header Values
        this.gridInputParams.module = BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupGrid']['module'];
        this.gridInputParams.method = BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupGrid']['method'];
        this.gridInputParams.operation = BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupGrid']['operation'];

        this.searchQuery = new URLSearchParams();

        // Set Search Query Parameters
        this.searchQuery.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.searchQuery.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.searchQuery.set(this.serviceConstants.Action, '2');
        this.searchQuery.set(this.serviceConstants.AccountNumber, this.getControlValue(this.serviceConstants.AccountNumber));
        this.searchQuery.set('LiveInvoiceGroupInd', isLiveInvoice);
        this.searchQuery.set('pageCurrent', this.currentPage);

        // Add Constants To Query
        for (let key in this.searchConstants) {
            if (key) {
                this.searchQuery.set(key, this.searchConstants[key]);
            }
        }
        this.gridInputParams.search = this.searchQuery;

        this.invoiceGroupGrid.loadGridData(this.gridInputParams);
    }

    /**
     * Method - setControlValue
     * Set Control Value
     */
    private setControlValue(control: string, value: string): void {
        this.invoiceSearchFormGroup.controls[control].setValue(value);
    }

    /**
     * Method - getControlValue
     * get Control Value
     */
    private getControlValue(control: string): string {
        return this.invoiceSearchFormGroup.controls[control].value;
    }

    // Events
    /**
     * Method - getCurrentPage
     * Gets invoked with page traversal
     * Sets the current page number in pagination control
     */
    public getCurrentPage(curPage: any): void {
        this.currentPage = curPage ? curPage.value : this.currentPage;
        this.loadGrid(this.inputParams);
    }

    /**
     * Method - getGridInfo
     * Gets invoked with grid initialization
     * Emits grid information and sets pagination state
     */
    public getGridInfo(info: any): void {
        let gridTotalItems = this.itemsPerPage;
        if (info) {
            this.totalRecords = info.totalRows;
        }
    }

    /**
     * Method - refresh
     * Gets invoked by the refresh component click
     * Sets current page to 1 and loads the grid data
     */
    public refresh(): void {
        //this.currentPage = 1;
        this.loadGrid(this.inputParams);
    }

    /**
     * Mehtod - onRowSelect
     * Gets the selected row on double click of grid row
     */
    public onRowSelect(row: any): void {
        // Close Ellipsis And Send Data
        row.rowData['Number'] = row.trRowData[0].text;
        row.rowData['Description'] = row.trRowData[1].text;
        row.rowData['InvoiceGroupROWID'] = row.cellData.rowID;
        row.rowData['trRowData'] = row.trRowData;
        this.ellipsis.sendDataToParent(row.rowData);
    }

    /**
     * Method - onAddNew
     * Executes on 'Add New' button click
     * Sets parent mode and navigates to InvoiceGroupMaintenance page
     */
    public onAddNew($event: any): void {
        if (this.parentMode !== 'InvoiceGroupMaintenance') {
            let url: string = '#' + AppModuleRoutes.BILLTOCASH + BillToCashModuleRoutes.ICABSAINVOICEGROUPMAINTENANCE;

            url += '?parentMode=IGSearchAdd';
            url += '&AccountNumber=' + this.riExchange.riInputElement.GetValue(this.invoiceSearchFormGroup, 'AccountNumber');
            url += '&AccountName=' + this.riExchange.riInputElement.GetValue(this.invoiceSearchFormGroup, 'AccountName') || '';
            url += '&IGParentMode=' + this.parentMode;
            url += '&ContractNumber=' + this.riExchange.riInputElement.GetValue(this.invoiceSearchFormGroup, 'ContractNumber');
            url += '&PremiseNumber=' + this.riExchange.riInputElement.GetValue(this.invoiceSearchFormGroup, 'PremiseNumber');
            url += '&' + CBBConstants.c_s_URL_PARAM_COUNTRYCODE + '=' + this.utils.getCountryCode();
            url += '&' + CBBConstants.c_s_URL_PARAM_BUSINESSCODE + '=' + this.utils.getBusinessCode();
            url += '&' + CBBConstants.c_s_URL_PARAM_BRANCHCODE + '=' + this.utils.getBranchCode();

            window.open(url,
                '_blank',
                'fullscreen=yes,menubar=no,resizable=no,status=no,titlebar=no,toolbar=no');
            return;
        }
        // Set Mode
        this.store.dispatch({
            type: InvoiceActionTypes.SAVE_MODE,
            payload: this.storeMode
        });

        // Close Modal
        this.ellipsis.closeModal();
    }
}
