import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { InvoiceGroupSearchComponent } from './../search/iCABSAInvoiceGroupSearch.component';
import { RiExchange } from './../../../shared/services/riExchange';
import { LookUp } from './../../../shared/services/lookup';
import { Logger } from '@nsalaun/ng2-logger';
import { Utils } from './../../../shared/services/utility';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../shared/components/grid/grid';
import { HistoryTypeLanguageSearchComponent } from '../../internal/search/iCABSSHistoryTypeLanguageSearch.component';

import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Input, NgZone, forwardRef, Inject, Renderer } from '@angular/core';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { Http, URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';
import { Subscription } from 'rxjs/Subscription';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';

import { ErrorService } from '../../../shared/services/error.service';
import { HttpService } from '../../../shared/services/http-service';
import { AuthService } from '../../../shared/services/auth.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Component({
    templateUrl: 'iCABSAAccountHistoryGrid.html',
    styles: [`
    :host /deep/ .gridtable tbody tr td:nth-child(6)  {
        width:10%;
    }
  `]
})

export class AccountHistoryGridComponent implements OnInit, OnDestroy {

    @ViewChild('historyGrid') historyGrid: GridComponent;
    @ViewChild('historyGridPagination') historyGridPagination: PaginationComponent;
    @ViewChild('searchButton') searchButton: any;
    @ViewChild('errorModal') public errorModal;

    public errorSubscription: Subscription;
    public messageSubscription: Subscription;
    public routerSubscription: Subscription;
    public translateSubscription: Subscription;
    public subscription: Subscription;
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public ajaxSubscription: Subscription;
    public inputParams: any = {};

    public selectedrowdata: any;

    public filterList: Array<any>;
    public sortList: Array<any>;
    public autoOpen: boolean = false;

    public InvoiceGroupDisplay: boolean = false;
    public HistoryTypeDisplay: boolean = false;

    public isRequesting: boolean = false;
    public method: string = 'contract-management/grid';
    public module: string = 'account';
    public operation: string = 'Application/iCABSAAccountHistoryGrid';
    public search: URLSearchParams;
    public pagination: boolean = true;
    public pagesize: string = '10';
    public pagecurrent: string = '1';
    public countryCode: any;
    public AccountNumber: string;
    public AccountName: string;

    //Filter
    public FilterType: string = '';
    public AccountHistoryFilter: string = 'None'; //Dropdown default value
    public invoiceGroupNumber: string = '';
    public invoiceGroupDesc: string = '';
    public historyTypeDesc: string = '';
    public historyTypeNumber: string = '';

    public SortBy: string = 'EffectiveDate';

    public historyType = AccountSearchComponent; //TODO - page not ready yet
    public invoiceGrp = InvoiceGroupSearchComponent;
    public invoiceGroupSearchParams: any;
    // public typeLanguageSearchParams: any = { parentMode: 'Ellipsis' /*'LookUp-AccountHistory'*/ }; //TODO - Page not ready yet
    public inputParamsHistoryCode: any = {
        'parentMode': 'LookUp-AccountHistory',
        'showAddNew': false
    };
    public historyTypeSearchComponent: Component = HistoryTypeLanguageSearchComponent;

    public itemsPerPage: number = 10;
    public page: number = 1;
    public currentPage: number = 1;
    public maxColumn: number = 6;
    public totalRecords: Number;
    public parentMode: string = '';
    private error: any;
    public fieldDisable: any = {
        'AccountName': true,
        'AccountNumber': true,
        'InvoiceGroup': false,
        'HistoryType': false
    };

    public showHeader: boolean = true;
    public showErrorHeader: boolean = true;
    public showMessageHeader: boolean = true;
    public messageTitle: string = '';
    public errorTitle: string = '';
    public errorContent: string = '';
    public messageContent: string = '';

    public validateProperties: Array<any> = [{}, {}, {}, {}, {}, {}];

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private zone: NgZone,
        private _http: Http,
        private errorService: ErrorService,
        private _httpService: HttpService,
        private _authService: AuthService,
        private _ls: LocalStorageService,
        private _componentInteractionService: ComponentInteractionService,
        private serviceConstants: ServiceConstants,
        private renderer: Renderer,
        private localeTranslateService: LocaleTranslationService,
        private activatedRoute: ActivatedRoute,
        private ajaxconstant: AjaxObservableConstant,
        private LookUp: LookUp,
        private riExchange: RiExchange,
        private utils: Utils,
        private logger: Logger
    ) {
        this.errorSubscription = this.errorService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.zone.run(() => {
                    if (data.errorMessage) {
                        this.errorModal.show(data, true);
                    }
                });
            }
        });
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.ajaxSubscription = this.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.zone.run(() => {
                    switch (event) {
                        case this.ajaxconstant.START:
                            this.isRequesting = true;
                            break;
                        case this.ajaxconstant.COMPLETE:
                            this.isRequesting = false;
                            break;
                    }
                });
            }
        });
    }

    ngOnInit(): void {
        this.localeTranslateService.setUpTranslation();
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            if (params['parentMode']) {
                this.parentMode = params['parentMode'];
                this.inputParams.parentMode = this.parentMode;
                this.inputParams.AccountNumber = params['AccountNumber'] || '';
                this.inputParams.AccountName = params['AccountName'] || '';
                this.invoiceGroupSearchParams = { parentMode: 'LookUp-AccountHistory', AccountNumber: params['AccountNumber'], isEllipsis: true };
                switch (this.parentMode) {
                    case 'Account':

                        break;
                    default:
                    case 'InvoiceGroup':
                        this.inputParams.InvoiceGroupNumber = params['InvoiceGroupNumber'] || '';
                        this.inputParams.InvoiceGroupDesc = params['InvoiceGroupDesc'] || '';
                        break;
                }
            }
        });

        this.updateView(this.inputParams);
        this.localeTranslateService.setUpTranslation();
    }

    ngOnDestroy(): void {
        if (this.errorSubscription) this.errorSubscription.unsubscribe();
        if (this.messageSubscription) this.messageSubscription.unsubscribe();
        if (this.ajaxSubscription) this.ajaxSubscription.unsubscribe();
        if (this.routerSubscription) this.routerSubscription.unsubscribe();
        if (this.translateSubscription) this.translateSubscription.unsubscribe();
    }

    public buildGrid(): void {
        let index = 0;
        this.validateProperties = [];
        switch (this.SortBy) {
            case 'EffectiveDate':
                this.validateProperties[index] = new Object();
                this.validateProperties[index].type = MntConst.eTypeDate;
                this.validateProperties[index].index = index;
                index++;
                break;

            case 'ProcessedDate':
                this.validateProperties[index] = new Object();
                this.validateProperties[index].type = MntConst.eTypeText;
                this.validateProperties[index].index = index;
                index++;
                break;
        }

        if (this.FilterType !== 'History Type') {
            this.validateProperties[index] = new Object();
            this.validateProperties[index].type = MntConst.eTypeText;
            this.validateProperties[index].index = index;
            index++;
        }

        if (this.FilterType !== 'Invoice Group' && this.parentMode === 'Account') {
            this.validateProperties[index] = new Object();
            this.validateProperties[index].type = MntConst.eTypeInteger;
            this.validateProperties[index].index = index;
            index++;
        }

        switch (this.SortBy) {
            case 'EffectiveDate':
                this.validateProperties[index] = new Object();
                this.validateProperties[index].type = MntConst.eTypeText;
                this.validateProperties[index].index = index;
                index++;
                break;

            case 'ProcessedDate':
                this.validateProperties[index] = new Object();
                this.validateProperties[index].type = MntConst.eTypeDate;
                this.validateProperties[index].index = index;
                index++;
                break;
        }
        this.validateProperties[index] = new Object();
        this.validateProperties[index].type = MntConst.eTypeText;
        this.validateProperties[index].index = index;
        index++;

        this.validateProperties[index] = new Object();
        this.validateProperties[index].type = MntConst.eTypeImage;
        this.validateProperties[index].index = index;
    }

    public getGridInfo(value: any): void {
        if (value && value.totalPages) {
            this.totalRecords = parseInt(value.totalPages, 10) * this.itemsPerPage;
        } else {
            this.totalRecords = 0;
        }
    }
    public getCurrentPage(data: any): void {
        this.currentPage = data.value;
        this.loadData(this.inputParams);
    }
    public onGridRowClick(data: any): void {
        this.logger.log('A onGridRowClick', data);
    }
    public onGridInfoClick(data: any): void {
        this.logger.log('B onGridInfoClick', data);
        this._router.navigate(['application/accountHistory/detail'], {
            queryParams: {
                accountNumber: this.AccountNumber,
                invoiceGroupNumber: this.invoiceGroupNumber,
                rowID: data.trRowData[0].rowID,
                invoiceGroupDesc: this.invoiceGroupDesc
            }
        });
    }
    public setInvoiceGroupSearch(data: any): void {
        this.invoiceGroupNumber = data.InvoiceGroupNumber;
        this.invoiceGroupDesc = data.InvoiceGroupDesc;
    }
    public setHistoryTypeSearch(data: any): void {
        this.historyTypeNumber = data.HistoryTypeCode;
        this.historyTypeDesc = data.HistoryTypeDesc;
    }

    public selectedFilter(filterVal: string): void {
        let filterValue = filterVal.split(': ').pop();

        this.invoiceGroupNumber = '';
        this.invoiceGroupDesc = '';
        this.historyTypeDesc = '';
        this.historyTypeNumber = '';

        this.logger.log('Filter value ', filterVal, filterValue);
        if (filterValue === 'Invoice Group') {
            this.FilterType = 'Invoice Group';
            this.InvoiceGroupDisplay = true;
            this.HistoryTypeDisplay = false;
        } else if (filterValue === 'History Type') {
            this.FilterType = 'History Type';
            this.InvoiceGroupDisplay = false;
            this.HistoryTypeDisplay = true;
        } else {
            this.FilterType = '';
            this.InvoiceGroupDisplay = false;
            this.HistoryTypeDisplay = false;
        }
    }
    public selectedsort(sortValue: string): void {
        this.SortBy = sortValue;
    }

    public searchload(): void {
        this.inputParams.search = this.search;
        this.loadData(this.inputParams);
    }

    public setUI(params: any): void {
        this.filterList = [];
        switch (params.parentMode) {
            case 'Account':
                this.filterList.push('None');
                this.filterList.push('Invoice Group');
                this.filterList.push('History Type');
                break;
            case 'Invoice Group':
                this.filterList.push('History Type');
                break;
        }
        this.AccountNumber = params.AccountNumber;
        this.AccountName = params.AccountName;
    }

    public updateView(params: any): void {
        this.inputParams = params;
        this.setUI(this.inputParams);
        this.loadData(this.inputParams);
    }

    public loadData(params: any): void {
        //this.historyGrid.clearGridData();
        this.buildGrid();

        this.setFilterValues(params);
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;
        this.inputParams.search = this.search;

        this.search.set(this.serviceConstants.Action, '2');
        if (this.inputParams.businessCode) {
            this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        }
        else {
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        }
        if (this.inputParams.countryCode) {
            this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        }
        else {
            this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        }
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('PageSize', this.itemsPerPage.toString());
        this.search.set('PageCurrent', this.currentPage.toString());
        this.historyGrid.loadGridData(this.inputParams);
    }

    public setFilterValues(params: any): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set('AccountNumber', params.AccountNumber);
        this.search.set('InvoiceGroupNumber', this.invoiceGroupNumber);
        this.search.set('HistoryTypeCode', this.historyTypeNumber);
        this.search.set('FilterType', this.FilterType);
        this.search.set('SortBy', this.SortBy);
        this.search.set('Source', 'Account');
        this.search.set('PageSize', this.itemsPerPage.toString());
        this.search.set('PageCurrent', this.currentPage.toString());
        this.search.set('HeaderClickedColumn', '');
        this.search.set('riSortOrder', 'Ascending');

        this.maxColumn = 4;
        if (this.FilterType !== 'History Type') {
            this.maxColumn++;
        }
        if (this.FilterType !== 'Invoice Group' && this.parentMode === 'Account') {
            this.maxColumn++;
        }
    }

    public showCloseButton = true;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public fetchInvoiceGroupData(): void {
        this.invoiceGroupDesc = '';
        if (this.invoiceGroupNumber === '') return;
        this.isRequesting = true;
        let lookupIP = [{
            'table': 'InvoiceGroup',
            'query': { 'BusinessCode': this.utils.getBusinessCode(), 'AccountNumber': this.AccountNumber, 'InvoiceGroupNumber': this.invoiceGroupNumber },
            'fields': ['InvoiceGroupNumber', 'InvoiceGroupDesc']
        }];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            this.isRequesting = false;
            let recordSet = data[0][0];
            if (recordSet) {
                this.invoiceGroupNumber = recordSet.InvoiceGroupNumber;
                this.invoiceGroupDesc = recordSet.InvoiceGroupDesc;
            } else {
                this.invoiceGroupNumber = '';
                this.errorModal.show({ errorMessage: 'Record Not Found' }, true);
            }
        });
    }
    public fetchHistoryTypeData(): void {
        this.historyTypeDesc = '';
        if (this.historyTypeNumber === '') return;
        this.isRequesting = true;
        let lookupIP = [{
            'table': 'HistoryTypeLang',
            'query': { 'BusinessCode': this.utils.getBusinessCode(), 'LanguageCode': this.riExchange.LanguageCode(), 'HistoryTypeCode': this.historyTypeNumber },
            'fields': ['HistoryTypeCode', 'HistoryTypeDesc']
        }];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            this.isRequesting = false;
            let recordSet = data[0][0];
            if (recordSet) {
                this.historyTypeNumber = recordSet.HistoryTypeCode;
                this.historyTypeDesc = recordSet.HistoryTypeDesc;
            } else {
                this.historyTypeNumber = '';
                this.errorModal.show({ errorMessage: 'Record Not Found' }, true);
            }
        });
    }
}
