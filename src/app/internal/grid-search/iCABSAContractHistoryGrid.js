import { Logger } from '@nsalaun/ng2-logger';
import { FormBuilder } from '@angular/forms';
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
import { Location } from '@angular/common';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { Store } from '@ngrx/store';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Utils } from './../../../shared/services/utility';
import { Title } from '@angular/platform-browser';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { HistoryTypeLanguageSearchComponent } from '../../internal/search/iCABSSHistoryTypeLanguageSearch.component';
export var ContractHistoryGridComponent = (function () {
    function ContractHistoryGridComponent(_logger, _fb, _router, _activatedRoute, zone, _http, errorService, _httpService, _authService, _ls, _componentInteractionService, serviceConstants, renderer, store, router, activatedRoute, titleService, utils, location, translateService) {
        var _this = this;
        this._logger = _logger;
        this._fb = _fb;
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
        this.store = store;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.titleService = titleService;
        this.utils = utils;
        this.location = location;
        this.translateService = translateService;
        this.inputParams = {};
        this.InvoiceGroupDisplay = false;
        this.InvoiceTypeDisplay = false;
        this.historyTypeSearchComponent = HistoryTypeLanguageSearchComponent;
        this.premiseSearchComponent = PremiseSearchComponent;
        this.inputParamsPremise = {
            'parentMode': 'Search',
            'showAddNew': false
        };
        this.inputParamsHistoryCode = {
            'parentMode': 'Contract',
            'showAddNew': false
        };
        this.showCloseButton = true;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.isRequesting = false;
        this.method = 'contract-management/grid';
        this.module = 'contract';
        this.operation = 'Application/iCABSAContractHistoryGrid';
        this.countryCode = 'ZA';
        this.pagination = true;
        this.pageSize = '10';
        this.pageCurrent = '1';
        this.queryLookUp = new URLSearchParams();
        this.dynamicComponent1 = AccountSearchComponent;
        this.itemsPerPage = 10;
        this.page = 1;
        this.maxColumn = 13;
        this.totalItems = 1;
        this.currentPage = 1;
        this.showHeader = true;
        this.pageTitleMain = 'Contract History';
        this.dt = new Date();
        this.CurrDate = new Date(this.dt.setMonth(this.dt.getMonth() - 6)).setDate(this.dt.getDate());
        this.CurrDate2 = '';
        this.isPremiseEllipsisDisabled = true;
        this.currentContractType = '';
        this.accountHide = true;
        this.storeData = {};
        this.backLinkText = '';
        this.backLinkUrl = '';
        this.inputParams.ContractType = '';
        this.inputParams.ContractNumber = '';
        this.inputParams.ContractName = '';
        this.inputParams.AccountNumber = '';
        this.inputParams.AccountName = '';
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            _this.storeData = data;
            if (data !== null && data['data'] &&
                !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                _this.contractStoreData = data['data'];
                if (data['params']['currentContractType'])
                    _this.inputParams.ContractType = data['params']['currentContractType'];
                if (_this.contractStoreData['ContractNumber'])
                    _this.inputParams.ContractNumber = _this.contractStoreData['ContractNumber'];
                if (_this.contractStoreData['ContractName'])
                    _this.inputParams.ContractName = _this.contractStoreData['ContractName'];
                if (_this.contractStoreData['AccountNumber'])
                    _this.inputParams.AccountNumber = _this.contractStoreData['AccountNumber'];
                if (data['formGroup']['main']) {
                    _this.inputParams.AccountName = data['formGroup']['main'].controls['AccountName'].value;
                }
                if (_this.contractStoreData['countryCode'])
                    _this.countryCode = _this.contractStoreData['countryCode'];
                if (_this.contractStoreData['Contract'])
                    _this.inputParams.ContractRowID = _this.contractStoreData['Contract'];
            }
        });
        this.subscription = activatedRoute.queryParams.subscribe(function (param) {
            _this.inputParams.parentMode = param['parentMode'];
            if (_this.inputParams.parentMode === 'Contract') {
                _this.maxColumn += 2;
            }
            else if (_this.inputParams.parentMode === 'Premise') {
                _this.maxColumn++;
            }
            if (param['currentContractTypeURLParameter']) {
                if (param['currentContractTypeURLParameter'].length > 1)
                    _this.currentContractType = _this.utils.getCurrentContractType(param['currentContractTypeURLParameter']);
                else
                    _this.currentContractType = param['currentContractTypeURLParameter'];
            }
            else {
                _this.currentContractType = 'C';
            }
            _this.contractLabel = _this.utils.getCurrentContractLabel(_this.currentContractType);
            if (param['ContractNumber'])
                _this.inputParams.ContractNumber = param['ContractNumber'];
            if (param['ContractName'])
                _this.inputParams.ContractName = param['ContractName'];
            if (param['AccountNumber'])
                _this.inputParams.AccountNumber = param['AccountNumber'];
            if (param['AccountName'])
                _this.inputParams.AccountName = param['AccountName'];
            if (param['PremiseNumber'])
                _this.inputParams.PremiseNumber = param['PremiseNumber'];
            if (param['PremiseName'])
                _this.inputParams.PremiseName = param['PremiseName'];
            if (param['PremiseRowID'])
                _this.inputParams.PremiseRowID = param['PremiseRowID'];
            if (param['ProductCode'])
                _this.inputParams.ProductCode = param['ProductCode'];
            if (param['ProductDesc'])
                _this.inputParams.ProductDesc = param['ProductDesc'];
            if (param['ServiceCoverNumber'])
                _this.inputParams.ServiceCoverNumber = param['ServiceCoverNumber'];
            if (param['ServiceCoverRowID'])
                _this.inputParams.ServiceCoverRowID = param['ServiceCoverRowID'];
            _this.setUI(_this.inputParams);
        });
    }
    ContractHistoryGridComponent.prototype.onPremiseDataReceived = function (data, route) {
        this.PremisesNumber = data.PremiseNumber;
        this.PremisesName = data.PremiseName;
    };
    ContractHistoryGridComponent.prototype.onHistoryDataReceived = function (data, route) {
        this.HistoryTypeCode = data.HistoryTypeCode;
        this.HistoryTypeCodeDesc = data.HistoryTypeDesc;
    };
    ContractHistoryGridComponent.prototype.ngOnInit = function () {
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.translateService.setUpTranslation();
        this.AccountNumberReadonly = true;
        this.AccountNameReadonly = true;
        this.ContractNumberReadonly = true;
        this.ContractNameReadonly = true;
        this.PremisesNumberReadonly = false;
        this.PremisesNameReadonly = true;
        this.ProductCodeReadonly = false;
        this.ProductDescReadonly = true;
        this.HistoryTypeReadonly = true;
        this.effectiveDate = this.utils.formatDate(this.CurrDate);
        this.effectiveDateTo = '';
        this.CreateHistoryType();
        this.updateView(this.inputParams);
        this.viewList = [{
                'text': 'All',
                'value': 'All'
            }];
        this.updateViewOption(this.inputParams);
    };
    ContractHistoryGridComponent.prototype.ngOnDestroy = function () {
        if (this.subscription)
            this.subscription.unsubscribe();
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
    };
    ContractHistoryGridComponent.prototype.effectiveDateSelectedValue = function (value) {
        if (value && value.value) {
            this.effectiveDate = value.value;
        }
        else {
            this.effectiveDate = '';
        }
    };
    ContractHistoryGridComponent.prototype.toDateSelectedValue = function (value) {
        if (value && value.value) {
            this.effectiveDateTo = value.value;
        }
        else {
            this.effectiveDateTo = '';
        }
    };
    ContractHistoryGridComponent.prototype.getGridInfo = function (info) {
        this.historyGridPagination.totalItems = info.totalRows;
    };
    ContractHistoryGridComponent.prototype.selectedOptionsBy = function (OptionsValue) {
        this.OptionSelected = OptionsValue;
        switch (this.OptionSelected.trim()) {
            case 'Value':
                this.router.navigate(['/grid/contractmanagement/account/serviceValue'], {
                    queryParams: {
                        ParentMode: this.inputParams.parentMode + 'History-All',
                        CurrentContractTypeURLParameter: this.inputParams.ContractType,
                        ContractNumber: this.ContractNumber,
                        ContractName: this.ContractName
                    }
                });
                break;
            case 'Invoice':
                this.router.navigate(['/billtocash/contract/invoice'], {
                    queryParams: {
                        CurrentContractTypeURLParameter: this.inputParams.ContractType,
                        ContractNumber: this.ContractNumber,
                        ContractName: this.ContractName
                    }
                });
                break;
            case 'LostBusiness':
                break;
        }
    };
    ContractHistoryGridComponent.prototype.selectedView = function (viewValue) {
        this.ViewSelected = viewValue;
    };
    ContractHistoryGridComponent.prototype.selectedSortBy = function (sortValue) {
        this.SortBySelected = sortValue;
    };
    ContractHistoryGridComponent.prototype.getCurrentDate = function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        var _date = dd + '/' + mm + '/' + yyyy;
        return _date;
    };
    ContractHistoryGridComponent.prototype.updateViewOption = function (params) {
        this.viewList = [{}];
        this.viewList = [{
                'text': 'All',
                'value': 'All'
            }];
        switch (params.parentMode) {
            case 'Contract':
                if ((this.PremisesNumber) && (!this.ProductCode)) {
                    this.viewList.push({
                        'text': 'Premises Only',
                        'value': 'Premise'
                    });
                }
                else if (!this.PremisesNumber) {
                    this.viewList.push({
                        'text': 'Contract Only',
                        'value': 'Contract'
                    }, {
                        'text': 'Contract and Premises',
                        'value': 'ContractPremise'
                    });
                }
                break;
            case 'Premise':
                if (this.ProductCode === '') {
                    this.viewList.push({
                        'text': 'Premises Only',
                        'value': 'Premise'
                    });
                }
                break;
            case 'ServiceCover':
                this.viewList.push({
                    'text': 'Premises Only',
                    'value': 'PremisesOnly'
                });
                break;
        }
    };
    ContractHistoryGridComponent.prototype.CreateHistoryType = function () {
        var _this = this;
        var data = [{
                'table': 'HistoryType',
                'query': {},
                'fields': ['HistoryTypeCode', 'HistoryTypeSystemDesc']
            }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 5000).subscribe(function (e) {
            _this.HistoryType = [{ 'text': 'All', 'value': '' }];
            try {
                for (var _i = 0, _a = e.results[0]; _i < _a.length; _i++) {
                    var hc = _a[_i];
                    var newOption = { 'text': hc['HistoryTypeSystemDesc'], 'value': hc['HistoryTypeCode'] };
                    _this.HistoryType.push(newOption);
                }
            }
            catch (e) {
                _this._logger.warn(e);
            }
        });
    };
    ContractHistoryGridComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.storeData['code'] && this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.storeData['code'] && this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this._httpService.lookUpRequest(this.queryLookUp, data);
    };
    ContractHistoryGridComponent.prototype.PremiseNumber_onchange = function () {
        if (!this.PremisesNumber) {
            this.PremisesNumber = '';
            this.PremisesName = '';
            this.ProductCode = '';
            this.ProductDesc = '';
        }
        else if (this.PremisesNumberReadonly === false) {
            this.PopulateDescriptions('Premise');
        }
        this.updateViewOption(this.inputParams);
    };
    ContractHistoryGridComponent.prototype.ProductCode_onchange = function () {
        if (!this.ProductCode) {
            this.ProductCode = '';
            this.ProductDesc = '';
        }
        else if (this.ProductCodeReadonly === false) {
            this.PopulateDescriptions('Product');
        }
        this.updateViewOption(this.inputParams);
    };
    ContractHistoryGridComponent.prototype.History_onchange = function () {
        this.PopulateDescriptions('History');
    };
    ContractHistoryGridComponent.prototype.onGridRowDblClick = function (event) {
        var data = this.historyGrid.getCellInfoForSelectedRow(event.rowIndex, 0);
        if (event.cellData.text.toLowerCase() === 'info') {
            this.router.navigate(['maintenance/contractHistoryDetail'], {
                queryParams: {
                    parentMode: 'ContractHistory',
                    ContractNumber: this.ContractNumber,
                    currentContractType: this.currentContractType,
                    AccountNumber: this.AccountNumber,
                    ContractHistoryRowID: data['rowID']
                }
            });
        }
        switch (this.historyGrid.headerColumns[event.cellIndex].text.trim().replace(/[^a-zA-Z ]/g, '').replace(/\s/g, '')) {
            case 'ProRata':
                if (event.cellData.text === 'Yes') {
                    this.router.navigate(['grid/application/proRatacharge/summary'], {
                        queryParams: {
                            parentMode: 'ContractHistory',
                            ContractHistoryRowID: data['rowID'],
                            currentContractType: this.inputParams.ContractType,
                            ContractNumber: this.ContractNumber,
                            ContractName: this.ContractName,
                            PremiseNumber: this.PremisesNumber,
                            PremiseName: this.PremisesName,
                            ProductCode: this.ProductCode,
                            ProductDesc: this.ProductDesc
                        }
                    });
                }
                break;
            default:
                break;
        }
    };
    ContractHistoryGridComponent.prototype.PopulateDescriptions = function (type) {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.storeData['code'] && this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.storeData['code'] && this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
        this.search.set('ContractNumber', this.ContractNumber);
        this.search.set('methodtype', 'Maintenance');
        switch (type) {
            case 'Product':
                this.search.set('PremiseNumber', this.ProductCode);
                this.search.set('Function', 'GetServiceCover');
                this._httpService.makeGetRequest(this.method, this.module, this.operation, this.search).subscribe(function (data) {
                    try {
                        _this.ProductDesc = data.ProductDesc;
                    }
                    catch (error) {
                        _this.errorService.emitError(error);
                    }
                }, function (error) {
                    _this.errorService.emitError(error);
                });
                break;
            case 'Premise':
                this.search.set('PremiseNumber', this.PremisesNumber);
                this.search.set('Function', 'GetPremiseName');
                this._httpService.makeGetRequest(this.method, this.module, this.operation, this.search).subscribe(function (data) {
                    try {
                        _this.PremisesName = data.PremiseName;
                    }
                    catch (error) {
                        _this.errorService.emitError(error);
                    }
                }, function (error) {
                    _this.errorService.emitError(error);
                });
                break;
            case 'History':
                this.search.set('HistoryTypeCode', this.HistoryTypeCode);
                this.search.set('Function', 'GetHistoryTypeDesc');
                this._httpService.makeGetRequest(this.method, this.module, this.operation, this.search).subscribe(function (data) {
                    try {
                        if (data.HistoryTypeDesc)
                            _this.HistoryTypeCodeDesc = data.HistoryTypeDesc;
                        else
                            _this.HistoryTypeCodeDesc = '';
                    }
                    catch (error) {
                        _this.errorService.emitError(error);
                    }
                }, function (error) {
                    _this.errorService.emitError(error);
                });
                break;
        }
    };
    ContractHistoryGridComponent.prototype.setUI = function (params) {
        this.sortList = [{
                'text': 'Effective Date',
                'value': 'EffectiveDate'
            }, {
                'text': 'Processed Date',
                'value': 'ProcessedDate'
            }
        ];
        this.options = [{
                'text': 'Options',
                'value': ' '
            }, {
                'text': 'Value',
                'value': 'Value'
            }, {
                'text': 'Invoice',
                'value': 'Invoice'
            }
        ];
        if (this.currentContractType === 'C') {
            this.options.push({
                'text': 'Client Retention',
                'value': 'LostBusiness'
            });
        }
        this.pageTitleSub = '';
        switch (params.parentMode) {
            case 'Contract':
                this.pageTitleSub = this.contractLabel;
                this.pageTitleSub = params.parentMode;
                this.AccountNumber = params.AccountNumber;
                this.AccountName = params.AccountName;
                this.ContractRowID = params.ContractRowID;
                this.ContractNumber = params.ContractNumber;
                this.ContractName = params.ContractName;
                this.PremisesNumberReadonly = false;
                this.ProductCodeReadonly = false;
                this.HistoryTypeReadonly = false;
                this.accountHide = false;
                break;
            case 'Premise':
                this.pageTitleSub = 'Premises';
                this.pageTitleSub = params.parentMode;
                this.ContractNumber = params.ContractNumber;
                this.ContractName = params.ContractName;
                this.PremisesNumber = params.PremiseNumber;
                this.PremisesName = params.PremiseName;
                this.ProductCode = params.ProductCode;
                this.PremiseRowID = params.PremiseRowID;
                this.PopulateDescriptions('Premise');
                break;
            case 'ServiceCover':
                this.pageTitleSub = 'Service Cover';
                this.pageTitleSub = params.parentMode;
                this.PremisesNumber = params.PremiseNumber;
                this.PremisesName = params.PremiseName;
                this.ProductCode = params.ProductCode;
                this.ProductDesc = params.ProductDesc;
                this.ServiceCoverNumber = params.ServiceCoverNumber;
                this.ServiceCoverRowID = params.ServiceCoverRowID;
                this.ContractNumber = params.ContractNumber;
                this.ContractName = params.ContractName;
                this.PremisesNumberReadonly = true;
                this.ProductCodeReadonly = true;
                break;
        }
        this.titleService.setTitle(this.pageTitleMain + '-' + this.pageTitleSub);
    };
    ContractHistoryGridComponent.prototype.getCurrentPage = function (event) {
        this.pageCurrent = event.value;
        this.updateView(this.inputParams);
    };
    ContractHistoryGridComponent.prototype.refresh = function (event) {
        this.loadData(this.inputParams);
    };
    ContractHistoryGridComponent.prototype.onGridRowClick = function (event) {
    };
    ContractHistoryGridComponent.prototype.updateView = function (params) {
        this.inputParams = params;
        this.setUI(this.inputParams);
        this.loadData(this.inputParams);
    };
    ContractHistoryGridComponent.prototype.loadData = function (params) {
        this.setFilterValues(params);
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;
        this.inputParams.search = this.search;
        this.historyGrid.loadGridData(this.inputParams);
    };
    ContractHistoryGridComponent.prototype.setFilterValues = function (params) {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set('ContractNumber', this.ContractNumber);
        this.search.set('PremiseNumber', this.PremisesNumber);
        this.search.set('ProductCode', this.ProductCode);
        this.search.set('ServiceCoverNumber', this.ServiceCoverNumber);
        this.search.set('ContractRowID', this.ContractRowID);
        this.search.set('PremiseRowID', this.PremiseRowID);
        this.search.set('ServiceCoverRowID', this.ServiceCoverRowID);
        this.search.set('HistoryTypeCode', this.HistoryTypeCode);
        if (!this.SortBySelected) {
            this.SortBySelected = 'EffectiveDate';
        }
        this.search.set('SortBy', this.SortBySelected);
        this.search.set('DateFrom', this.effectiveDate);
        this.search.set('DateTo', this.effectiveDateTo);
        this.search.set('ViewType', this.ViewSelected);
        this.search.set('Level', this.inputParams.parentMode);
        this.search.set('PageSize', this.pageSize);
        this.search.set('PageCurrent', this.pageCurrent);
        this.search.set('HeaderClickedColumn', '');
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
    };
    ContractHistoryGridComponent.prototype.onBackLinkClick = function (event) {
        event.preventDefault();
        this.location.back();
    };
    ContractHistoryGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAContractHistoryGrid.html'
                },] },
    ];
    ContractHistoryGridComponent.ctorParameters = [
        { type: Logger, },
        { type: FormBuilder, },
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
        { type: Store, },
        { type: Router, },
        { type: ActivatedRoute, },
        { type: Title, },
        { type: Utils, },
        { type: Location, },
        { type: LocaleTranslationService, },
    ];
    ContractHistoryGridComponent.propDecorators = {
        'historyGrid': [{ type: ViewChild, args: ['historyGrid',] },],
        'historyGridPagination': [{ type: ViewChild, args: ['historyGridPagination',] },],
        'searchButton': [{ type: ViewChild, args: ['searchButton',] },],
    };
    return ContractHistoryGridComponent;
}());
