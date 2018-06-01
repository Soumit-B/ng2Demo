import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { InternalMaintenanceApplicationModuleRoutes } from './../../base/PageRoutes';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from './../../../shared/services/message.service';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { Logger } from '@nsalaun/ng2-logger';
import { HttpService } from './../../../shared/services/http-service';
import { ContractActionTypes } from './../../actions/contract';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { GridComponent } from './../../../shared/components/grid/grid';
import { URLSearchParams } from '@angular/http';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { Component, ViewChild, OnInit, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { RiExchange } from './../../../shared/services/riExchange';
import { Utils } from '../../../shared/services/utility';
import { ErrorService } from '../../../shared/services/error.service';

@Component({
    selector: 'icabs-customer-info',
    templateUrl: 'iCABSACustomerInformationSummary.html'
})

export class CustomerInformationSummaryComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('customerInfoGrid') customerInfoGrid: GridComponent;
    @ViewChild('customerInfoPagination') customerInfoPagination: PaginationComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptConfirmModal') public promptConfirmModal;

    public method: string = 'contract-management/grid';
    public module: string = 'customer';
    public operation: string = 'Application/iCABSACustomerInformationSummary';
    public search: URLSearchParams = new URLSearchParams();
    public deleteParams: URLSearchParams = new URLSearchParams();
    public dataFromParent: Object = {
        col11: {}
    };
    public totalItems: number;
    public backLinkText: string = '';
    public currentPage: any = 1;
    public maxColumn: number = 11;
    public itemsPerPage: number = 10;
    public inputParams: any;
    public storeSubscription: Subscription;
    public messageSubscription: Subscription;
    public errorSubscription: Subscription;
    public activatedRouteSubscription: Subscription;
    public codeData: any = {};
    public storeData: any;
    public parentData: any;
    public searchConstants: any;
    public selectedRowData: any;
    public selectedCompleteRowData: any;
    public showMessageHeader = true;
    public showPromptMessageHeader: boolean = true;
    public promptConfirmTitle: string;
    public promptConfirmContent: string;
    public gridData: any;

    // Model Variables
    public pageModel: Object;

    public validateProperties: Array<any> = [{
        'type': MntConst.eTypeCode,
        'index': 0
    }, {
        'type': MntConst.eTypeCode,
        'index': 1
    }, {
        'type': MntConst.eTypeCode,
        'index': 2
    }, {
        'type': MntConst.eTypeInteger,
        'index': 3
    }, {
        'type': MntConst.eTypeInteger,
        'index': 4
    }, {
        'type': MntConst.eTypeInteger,
        'index': 5
    }, {
        'type': MntConst.eTypeText,
        'index': 6
    }, {
        'type': MntConst.eTypeInteger,
        'index': 7
    }, {
        'type': MntConst.eTypeCode,
        'index': 8
    }, {
        'type': MntConst.eTypeDate,
        'index': 9
    }, {
        'type': MntConst.eTypeTime,
        'index': 10
    }];

    // Object Constructor
    constructor(public serviceConstants: ServiceConstants,
        public store: Store<any>,
        private _router: Router,
        public riExchange: RiExchange,
        public zone: NgZone,
        public location: Location,
        public _componentInteractionService: ComponentInteractionService,
        public http: HttpService,
        public logger: Logger,
        public utils: Utils,
        public messageService: MessageService,
        public errorService: ErrorService,
        private activatedRoute: ActivatedRoute) {
        this.pageModel = {
            parentMode: 'Contract',
            GroupAccountNumber: '',
            GroupName: '',
            accountNumber: '',
            AccountName: '',
            contractNumber: '',
            contractName: '',
            hasWriteAccess: false,
            recordSelected: false,
            enableDetails: false,
            Mode: ''
        };

        this.storeSubscription = store.select('contract').subscribe(data => {
            // @TODO
            this.codeData = data['code'];
            this.storeData = data['data'];
            this.parentData = data['params'];
        });

        // Set Page Model
        this.pageModel['parentMode'] = this.parentData['parentMode'];

        this.activatedRouteSubscription = this.activatedRoute.queryParams.subscribe((param: any) => {
            if (param['parentMode']) {
                this.pageModel['parentMode'] = param['parentMode'];
            }
            if (param['contractNumber'] || param['ContractNumber']) {
                this.pageModel['contractNumber'] = param['contractNumber'] || param['ContractNumber'];
            }
            if (param['contractName'] || param['ContractName']) {
                this.pageModel['contractName'] = param['contractName'] || param['ContractName'];
            }
            if (param['accountNumber'] || param['AccountNumber']) {
                this.pageModel['accountNumber'] = param['accountNumber'] || param['AccountNumber'];
            }
            if (param['accountName'] || param['AccountName']) {
                this.pageModel['accountName'] = param['accountName'] || param['AccountName'];
            }
            if (param['groupAccountNumber'] || param['GroupAccountNumber']) {
                this.pageModel['groupAccountNumber'] = param['groupAccountNumber'] || param['GroupAccountNumber'];
            }
            if (param['groupName'] || param['GroupName']) {
                this.pageModel['groupName'] = param['groupName'] || param['GroupName'];
            }
            if (param['Mode'] === 'Existing') {
                this.pageModel['Mode'] = 'New';
                this.pageModel['CustomerInfoNumber'] = param['CustomerPassNumber'];
                this.pageModel['InfoLevel'] = param['CustomerPassLevel'];
            }
        });
        this.inputParams = {};
        this.searchConstants = {
            action: 2,
            riGridMode: 0,
            riGridHandle: 657854,
            pageSize: 10,
            callingProg: this.pageModel['parentMode']
        };
    }

    // Lifecycle Methods
    // Method - ngOnInit
    public ngOnInit(): void {
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this._componentInteractionService.emitMessage(false);
        this.codeData['business'] = this.utils.getBusinessCode();
        this.codeData['country'] = this.utils.getCountryCode();
        //setting data to be sent to grid
        this.dataFromParent['col11'] = {
            colNumber: this.maxColumn,
            colFormat: GlobalConstant.Configuration.Format['Time']
        };
        // Check And Set Control Values
        if (this.storeData['ContractNumber']) {
            this.pageModel['contractNumber'] = this.storeData['ContractNumber'];
        }
        if (this.storeData['ContractName']) {
            this.pageModel['contractName'] = this.storeData['ContractName'];
        }
        if (this.storeData['AccountNumber']) {
            this.pageModel['accountNumber'] = this.storeData['AccountNumber'];
        }
        if (this.storeData['AccountName']) {
            this.pageModel['accountName'] = this.storeData['AccountName'];
        }
        if (this.storeData['GroupAccountNumber']) {
            this.pageModel['groupAccountNumber'] = this.storeData['GroupAccountNumber'];
        }
        if (this.storeData['GroupName']) {
            this.pageModel['groupName'] = this.storeData['GroupName'];
        }
        // Call Update View
        this.updateView();
    }

    public ngAfterViewInit(): void {
        // Message Subscription
        this.messageSubscription = this.messageService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
            }
        });

        this.errorSubscription = this.errorService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.zone.run(() => {
                    this.errorModal.show(data, true);
                });
            }
        });
        if (this.pageModel['Mode'] === 'New') {
            this.pageModel['Mode'] = '';
            this._router.navigate([InternalMaintenanceApplicationModuleRoutes.ICABSACUSTOMERINFORMATIONMAINTENANCE], {
                queryParams: {
                    parentMode: 'Update',
                    ContractNumber: this.pageModel['contractNumber'],
                    ContractName: this.pageModel['contractName'],
                    AccountNumber: this.pageModel['accountNumber'],
                    AccountName: this.pageModel['AccountName'],
                    CallingProg: this.pageModel['parentMode'],
                    Mode: 'New',
                    GroupAccountNumber: this.pageModel['groupAccountNumber'],
                    GroupName: this.pageModel['groupName'],
                    'CustomerInfoNumber': this.pageModel['CustomerInfoNumber'],
                    'InfoLevel': this.pageModel['InfoLevel']
                }
            });
        }
    }

    public ngOnDestroy(): void {
        this.errorSubscription.unsubscribe();
        this.messageSubscription.unsubscribe();
        if (this.activatedRouteSubscription) {
            this.activatedRouteSubscription.unsubscribe();
        }
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }

    /**
     * Method: updateView
     * Initializes the view with grid
     * Access: Public - Can be called from other components if  required
     */
    public updateView(): void {
        // Set Request Header Values
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;

        if (this.pageModel['parentMode'] === 'Account') {
            this.searchConstants['callingProg'] = 'Account';
        } else if (this.pageModel['parentMode'] === 'GroupAccount') {
            this.searchConstants['callingProg'] = 'GroupAccount';
        }

        // Add Request Parameters For Grid
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, this.searchConstants['action']);
        this.search.set(this.serviceConstants.GridHandle, this.searchConstants['riGridHandle']);
        this.search.set(this.serviceConstants.GridMode, this.searchConstants['riGridMode']);
        this.search.set(this.serviceConstants.PageSize, this.searchConstants['pageSize']);
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage);
        this.search.set('CallingProg', this.searchConstants['callingProg']);
        this.search.set('contractNumber', this.pageModel['contractNumber']);
        this.search.set('accountNumber', this.pageModel['accountNumber']);
        this.search.set('groupAccountNumber', this.pageModel['groupAccountNumber']);

        // Set Parameters To Be Passed To Grid
        this.inputParams.search = this.search;
        this.customerInfoGrid.loadGridData(this.inputParams);

        // Check if user has write access
        this.checkUserWriteAccess();
    }

    /**
     * Method: checkUserWriteAccess
     * Sets class property to true if User Has Write Access
     */
    public checkUserWriteAccess(): void {
        if (this.riExchange.ClientSideValues.Fetch('FullAccess') === 'Full') {
            this.pageModel['hasWriteAccess'] = true;
        }
    }

    // Events
    /**
     * Method - getGridInfo
     * Gets invoked with grid initialization
     * Emits grid information and sets pagination state
     */
    public getGridInfo(info: any): void {
        let gridTotalItems = this.itemsPerPage;
        if (info) {
            gridTotalItems = info.totalRows;
        }
        this.gridData = info.gridData;
        this.zone.run(() => {
            this.customerInfoPagination.totalItems = gridTotalItems;
        });
    }

    /**
     * Method - getCurrentPage
     * Gets invoked with page traversal
     * Sets the current page number in pagination control
     */
    public getCurrentPage(curPage: any): void {
        this.currentPage = curPage ? curPage.value : this.currentPage;
        this.inputParams.method = 'contract-management/grid';
        this.updateView();
        //this.customerInfoGrid.loadGridData(this.inputParams);
    }

    /**
     * Method - onGridRowClick
     * Gets invoked by double click on grid row
     * Naviagtes to customer information details
     */
    public onGridRowClick(clickedRow: any): void {
        this.store.dispatch({
            type: ContractActionTypes.SAVE_SENT_FROM_PARENT, payload:
            {
                updateMode: false,
                addMode: false,
                searchMode: true
            }
        });
        // @TODO - Navigate To Detail Page
    }

    /**
     * Method - onCellSelection
     * Gets invoked by click on grid row
     * Enables delete or detail buttons
     */
    public onCellSelection(data: any): void {
        this.selectedRowData = data.rowData;
        this.selectedCompleteRowData = data.trRowData;
        this.pageModel['enableDetails'] = true;
        this.pageModel['recordSelected'] = false;
        if (data.trRowData[5]['additionalData'] === this.pageModel['parentMode']) {
            this.pageModel['recordSelected'] = true;
        }
    }

    public onGridRowDblClick(data: any): void {
        this.onCellSelection(data);
        if (data.cellIndex === 3) {
            this._router.navigate([InternalMaintenanceApplicationModuleRoutes.ICABSACUSTOMERINFORMATIONMAINTENANCE], {
                queryParams: {
                    parentMode: 'Update',
                    ContractNumber: this.pageModel['contractNumber'],
                    ContractName: this.pageModel['contractName'],
                    AccountNumber: this.pageModel['accountNumber'],
                    AccountName: this.pageModel['AccountName'],
                    CallingProg: this.pageModel['parentMode'],
                    Mode: 'Update',
                    GroupAccountNumber: data.trRowData[0].text || this.pageModel['groupAccountNumber'],
                    GroupName: data.trRowData[0].additionalData || this.pageModel['groupName'],
                    InfoLevel: data.trRowData[6].additionalData,
                    CustomerInfoNumber: data.trRowData[3].text
                }
            });
        }
    }

    /**
     * Method - addNewRecord
     * Gets invoked by Add New button click
     * Navigates to Add New Record page
     */
    public addNewRecord(event: any): void {
        this.store.dispatch({
            type: ContractActionTypes.SAVE_SENT_FROM_PARENT, payload:
            {
                updateMode: false,
                addMode: false,
                searchMode: true
            }
        });
        this._router.navigate([InternalMaintenanceApplicationModuleRoutes.ICABSACUSTOMERINFORMATIONMAINTENANCE], {
            queryParams: {
                parentMode: 'New',
                ContractNumber: this.pageModel['contractNumber'],
                ContractName: this.pageModel['contractName'],
                AccountNumber: this.pageModel['accountNumber'],
                AccountName: this.pageModel['AccountName'],
                CallingProg: this.pageModel['parentMode'],
                CustomerInfoName: this.gridData.body && this.gridData.body.cells.length > 0 ? this.gridData.body.cells[2].additionalData : '',
                Mode: 'New',
                InfoLevel: '',
                GroupAccountNumber: this.pageModel['groupAccountNumber'],
                GroupName: this.pageModel['groupName']
            }
        });
        // @TODO - Navigate To Add New Record Page

    }

    /**
     * Method - addExistingRecord
     * Gets invoked by Add Existing Record button click
     * Navigates to Add Existing Record page
     */
    public addExistingRecord(event: any): void {
        this.store.dispatch({
            type: ContractActionTypes.SAVE_SENT_FROM_PARENT, payload:
            {
                updateMode: false,
                addMode: false,
                searchMode: true
            }
        });
        // @TODO - Navigate To Add Existing Record Page

        this._router.navigate([InternalMaintenanceApplicationModuleRoutes.ICABSACUSTOMERINFORMATIONACCOUNTMAINTENANCE], {
            queryParams: {
                AccountNumber: this.pageModel['accountNumber'],
                AccountName: this.pageModel['accountName'],
                ContractNumber: this.pageModel['contractNumber'],
                ContractName: this.pageModel['contractName'],
                GroupAccountNumber: this.pageModel['groupAccountNumber'],
                GroupName: this.pageModel['groupName'],
                CallingProg: this.pageModel['parentMode']
            }
        });
    }

    /**
     * Method - deleteRecord
     * Gets invoked by Delete Record button click
     * Navigates to Delete Record page
     */
    public deleteRecord(): void {
        let formData: Object = {};
        if (!this.selectedRowData) {
            return;
        }
        this.deleteParams = new URLSearchParams();

        this.deleteParams.set(this.serviceConstants.BusinessCode, this.codeData['business']);
        this.deleteParams.set(this.serviceConstants.CountryCode, this.codeData['country']);
        this.deleteParams.set('CustomerInfoNumber', this.selectedRowData['Information ID.'] || this.selectedCompleteRowData[3].text);
        this.deleteParams.set(this.serviceConstants.AccountNumber, this.storeData[this.serviceConstants.AccountNumber]);
        this.deleteParams.set(this.serviceConstants.ContractNumber, this.selectedRowData['Contract Number'] || this.selectedCompleteRowData[2].text);
        this.deleteParams.set('GroupAccountNumber', this.selectedRowData['Group Account Number'] || this.selectedCompleteRowData[0].text);
        this.deleteParams.set('Mode', 'Delete');
        this.deleteParams.set('CallingProg', this.pageModel['parentMode']);
        this.deleteParams.set(this.serviceConstants.Action, '0');

        this.http.makeGetRequest(this.method, this.module, this.operation, this.deleteParams).subscribe(
            (data) => {
                this.updateView();
            },
            (error) => {
                this.messageService.emitMessage({
                    msg: error.errorMessage
                });
                this.logger.log(error);
            }
        );
    }

    /**
     * Method - viewRecordDetail
     * Gets invoked by Details button click
     * Navigates to
     */
    public viewRecordDetail(event: any): void {
        this.store.dispatch({
            type: ContractActionTypes.SAVE_SENT_FROM_PARENT, payload:
            {
                updateMode: false,
                addMode: false,
                searchMode: true
            }
        });
        // @TODO - Navigate To Record Detail Page
        this._router.navigate([InternalMaintenanceApplicationModuleRoutes.ICABSACUSTOMERINFORMATIONMAINTENANCE], {
            queryParams: {
                parentMode: 'Update',
                ContractNumber: this.pageModel['contractNumber'],
                ContractName: this.pageModel['contractName'],
                AccountNumber: this.pageModel['accountNumber'],
                AccountName: this.pageModel['AccountName'],
                CallingProg: this.pageModel['parentMode'],
                Mode: 'Update',
                GroupAccountNumber: this.selectedCompleteRowData[0].text || this.pageModel['groupAccountNumber'],
                GroupName: this.selectedCompleteRowData[0].additionalData || this.pageModel['groupName'],
                InfoLevel: this.selectedCompleteRowData[6].additionalData,
                CustomerInfoNumber: this.selectedCompleteRowData[3].text
            }
        });
    }

    /**
     * Method - refresh
     * Gets invoked by the refresh component click
     * Sets current page to 1 and loads the grid data
     */
    public refresh(): void {
        this.updateView();
    }

    public onBackLinkClick(event: any): void {
        event.preventDefault();
        this.location.back();
    }

    public deleteRecordClick(): void {
        this.promptConfirmContent = MessageConstant.Message.DeleteRecord;
        this.pageModel['enableDetails'] = false;
        this.pageModel['recordSelected'] = false;
        this.promptConfirmModal.show();
    }

    public promptConfirm(): void {
        this.deleteRecord();
    }
}
