import { InvoiceGroupSearchComponent } from './../search/iCABSAInvoiceGroupSearch.component';
import { RiExchange } from './../../../shared/services/riExchange';
import { LookUp } from './../../../shared/services/lookup';
import { Logger } from '@nsalaun/ng2-logger';
import { Utils } from './../../../shared/services/utility';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { HistoryTypeLanguageSearchComponent } from '../../internal/search/iCABSSHistoryTypeLanguageSearch.component';
import { Component, ViewChild, NgZone, Renderer } from '@angular/core';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { Http, URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { ErrorService } from '../../../shared/services/error.service';
import { HttpService } from '../../../shared/services/http-service';
import { AuthService } from '../../../shared/services/auth.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
export var AccountHistoryGridComponent = (function () {
    function AccountHistoryGridComponent(_router, _activatedRoute, zone, _http, errorService, _httpService, _authService, _ls, _componentInteractionService, serviceConstants, renderer, localeTranslateService, activatedRoute, ajaxconstant, LookUp, riExchange, utils, logger) {
        var _this = this;
        this._router = _router;
        this._activatedRoute = _activatedRoute;
        this.zone = zone;
        this._http = _http;
        this.errorService = errorService;
        this._httpService = _httpService;
        this._authService = _authService;
        this._ls = _ls;
        this._componentInteractionService = _componentInteractionService;
        this.serviceConstants = serviceConstants;
        this.renderer = renderer;
        this.localeTranslateService = localeTranslateService;
        this.activatedRoute = activatedRoute;
        this.ajaxconstant = ajaxconstant;
        this.LookUp = LookUp;
        this.riExchange = riExchange;
        this.utils = utils;
        this.logger = logger;
        this.ajaxSource = new BehaviorSubject(0);
        this.inputParams = {};
        this.autoOpen = false;
        this.InvoiceGroupDisplay = false;
        this.HistoryTypeDisplay = false;
        this.isRequesting = false;
        this.method = 'contract-management/grid';
        this.module = 'account';
        this.operation = 'Application/iCABSAAccountHistoryGrid';
        this.pagination = true;
        this.pagesize = '10';
        this.pagecurrent = '1';
        this.FilterType = '';
        this.AccountHistoryFilter = 'None';
        this.invoiceGroupNumber = '';
        this.invoiceGroupDesc = '';
        this.historyTypeDesc = '';
        this.historyTypeNumber = '';
        this.SortBy = 'EffectiveDate';
        this.historyType = AccountSearchComponent;
        this.invoiceGrp = InvoiceGroupSearchComponent;
        this.inputParamsHistoryCode = {
            'parentMode': 'LookUp-AccountHistory',
            'showAddNew': false
        };
        this.historyTypeSearchComponent = HistoryTypeLanguageSearchComponent;
        this.itemsPerPage = 10;
        this.page = 1;
        this.currentPage = 1;
        this.maxColumn = 6;
        this.parentMode = '';
        this.fieldDisable = {
            'AccountName': true,
            'AccountNumber': true,
            'InvoiceGroup': false,
            'HistoryType': false
        };
        this.showHeader = true;
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.messageTitle = '';
        this.errorTitle = '';
        this.errorContent = '';
        this.messageContent = '';
        this.showCloseButton = true;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.errorSubscription = this.errorService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    if (data.errorMessage) {
                        _this.errorModal.show(data, true);
                    }
                });
            }
        });
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.ajaxSubscription = this.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.zone.run(function () {
                    switch (event) {
                        case _this.ajaxconstant.START:
                            _this.isRequesting = true;
                            break;
                        case _this.ajaxconstant.COMPLETE:
                            _this.isRequesting = false;
                            break;
                    }
                });
            }
        });
    }
    AccountHistoryGridComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.localeTranslateService.setUpTranslation();
        this.activatedRoute.queryParams.subscribe(function (params) {
            if (params['parentMode']) {
                _this.parentMode = params['parentMode'];
                _this.inputParams.parentMode = _this.parentMode;
                _this.inputParams.AccountNumber = params['AccountNumber'] || '';
                _this.inputParams.AccountName = params['AccountName'] || '';
                _this.invoiceGroupSearchParams = { parentMode: 'LookUp-AccountHistory', AccountNumber: params['AccountNumber'], isEllipsis: true };
                switch (_this.parentMode) {
                    case 'Account':
                        break;
                    default:
                    case 'InvoiceGroup':
                        _this.inputParams.InvoiceGroupNumber = params['InvoiceGroupNumber'] || '';
                        _this.inputParams.InvoiceGroupDesc = params['InvoiceGroupDesc'] || '';
                        break;
                }
            }
        });
        this.updateView(this.inputParams);
        this.localeTranslateService.setUpTranslation();
    };
    AccountHistoryGridComponent.prototype.ngOnDestroy = function () {
        if (this.errorSubscription)
            this.errorSubscription.unsubscribe();
        if (this.messageSubscription)
            this.messageSubscription.unsubscribe();
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
        if (this.routerSubscription)
            this.routerSubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    AccountHistoryGridComponent.prototype.getGridInfo = function (value) {
        if (value && value.totalPages) {
            this.totalRecords = parseInt(value.totalPages, 10) * this.itemsPerPage;
        }
        else {
            this.totalRecords = 0;
        }
    };
    AccountHistoryGridComponent.prototype.getCurrentPage = function (data) {
        this.currentPage = data.value;
        this.loadData(this.inputParams);
    };
    AccountHistoryGridComponent.prototype.onGridRowClick = function (data) {
        this.logger.log('A onGridRowClick', data);
    };
    AccountHistoryGridComponent.prototype.onGridInfoClick = function (data) {
        this.logger.log('B onGridInfoClick', data);
        this._router.navigate(['application/accountHistory/detail'], {
            queryParams: {
                accountNumber: this.AccountNumber,
                invoiceGroupNumber: this.invoiceGroupNumber,
                rowID: data.trRowData[0].rowID,
                invoiceGroupDesc: this.invoiceGroupDesc
            }
        });
    };
    AccountHistoryGridComponent.prototype.setInvoiceGroupSearch = function (data) {
        this.invoiceGroupNumber = data.InvoiceGroupNumber;
        this.invoiceGroupDesc = data.InvoiceGroupDesc;
    };
    AccountHistoryGridComponent.prototype.setHistoryTypeSearch = function (data) {
        this.historyTypeNumber = data.HistoryTypeCode;
        this.historyTypeDesc = data.HistoryTypeDesc;
    };
    AccountHistoryGridComponent.prototype.selectedFilter = function (filterVal) {
        var filterValue = filterVal.split(': ').pop();
        this.invoiceGroupNumber = '';
        this.invoiceGroupDesc = '';
        this.historyTypeDesc = '';
        this.historyTypeNumber = '';
        this.logger.log('Filter value ', filterVal, filterValue);
        if (filterValue === 'Invoice Group') {
            this.FilterType = 'Invoice Group';
            this.InvoiceGroupDisplay = true;
            this.HistoryTypeDisplay = false;
        }
        else if (filterValue === 'History Type') {
            this.FilterType = 'History Type';
            this.InvoiceGroupDisplay = false;
            this.HistoryTypeDisplay = true;
        }
        else {
            this.FilterType = '';
            this.InvoiceGroupDisplay = false;
            this.HistoryTypeDisplay = false;
        }
    };
    AccountHistoryGridComponent.prototype.selectedsort = function (sortValue) {
        this.SortBy = sortValue;
    };
    AccountHistoryGridComponent.prototype.searchload = function () {
        this.inputParams.search = this.search;
        this.loadData(this.inputParams);
    };
    AccountHistoryGridComponent.prototype.setUI = function (params) {
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
    };
    AccountHistoryGridComponent.prototype.updateView = function (params) {
        this.inputParams = params;
        this.setUI(this.inputParams);
        this.loadData(this.inputParams);
    };
    AccountHistoryGridComponent.prototype.loadData = function (params) {
        this.historyGrid.clearGridData();
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
    };
    AccountHistoryGridComponent.prototype.setFilterValues = function (params) {
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
    };
    AccountHistoryGridComponent.prototype.fetchInvoiceGroupData = function () {
        var _this = this;
        this.invoiceGroupDesc = '';
        if (this.invoiceGroupNumber === '')
            return;
        this.isRequesting = true;
        var lookupIP = [{
                'table': 'InvoiceGroup',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'AccountNumber': this.AccountNumber, 'InvoiceGroupNumber': this.invoiceGroupNumber },
                'fields': ['InvoiceGroupNumber', 'InvoiceGroupDesc']
            }];
        this.LookUp.lookUpPromise(lookupIP).then(function (data) {
            _this.isRequesting = false;
            var recordSet = data[0][0];
            if (recordSet) {
                _this.invoiceGroupNumber = recordSet.InvoiceGroupNumber;
                _this.invoiceGroupDesc = recordSet.InvoiceGroupDesc;
            }
            else {
                _this.invoiceGroupNumber = '';
                _this.errorModal.show({ errorMessage: 'Record Not Found' }, true);
            }
        });
    };
    AccountHistoryGridComponent.prototype.fetchHistoryTypeData = function () {
        var _this = this;
        this.historyTypeDesc = '';
        if (this.historyTypeNumber === '')
            return;
        this.isRequesting = true;
        var lookupIP = [{
                'table': 'HistoryTypeLang',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'LanguageCode': this.riExchange.LanguageCode(), 'HistoryTypeCode': this.historyTypeNumber },
                'fields': ['HistoryTypeCode', 'HistoryTypeDesc']
            }];
        this.LookUp.lookUpPromise(lookupIP).then(function (data) {
            _this.isRequesting = false;
            var recordSet = data[0][0];
            if (recordSet) {
                _this.historyTypeNumber = recordSet.HistoryTypeCode;
                _this.historyTypeDesc = recordSet.HistoryTypeDesc;
            }
            else {
                _this.historyTypeNumber = '';
                _this.errorModal.show({ errorMessage: 'Record Not Found' }, true);
            }
        });
    };
    AccountHistoryGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAAccountHistoryGrid.html',
                    styles: ["\n    :host /deep/ .gridtable tbody tr td:nth-child(6)  {\n        width:10%;\n    }\n  "]
                },] },
    ];
    AccountHistoryGridComponent.ctorParameters = [
        { type: Router, },
        { type: ActivatedRoute, },
        { type: NgZone, },
        { type: Http, },
        { type: ErrorService, },
        { type: HttpService, },
        { type: AuthService, },
        { type: LocalStorageService, },
        { type: ComponentInteractionService, },
        { type: ServiceConstants, },
        { type: Renderer, },
        { type: LocaleTranslationService, },
        { type: ActivatedRoute, },
        { type: AjaxObservableConstant, },
        { type: LookUp, },
        { type: RiExchange, },
        { type: Utils, },
        { type: Logger, },
    ];
    AccountHistoryGridComponent.propDecorators = {
        'historyGrid': [{ type: ViewChild, args: ['historyGrid',] },],
        'historyGridPagination': [{ type: ViewChild, args: ['historyGridPagination',] },],
        'searchButton': [{ type: ViewChild, args: ['searchButton',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return AccountHistoryGridComponent;
}());
