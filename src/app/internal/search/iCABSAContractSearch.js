import { Logger } from '@nsalaun/ng2-logger';
import { Component, ViewChild, Input, NgZone, Renderer } from '@angular/core';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { Http, URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { Store } from '@ngrx/store';
import { MessageService } from '../../../shared/services/message.service';
import { ErrorService } from '../../../shared/services/error.service';
import { HttpService } from '../../../shared/services/http-service';
import { AuthService } from '../../../shared/services/auth.service';
import { Utils } from '../../../shared/services/utility';
import { ContractActionTypes } from '../../../app/actions/contract';
import { CBBService } from '../../../shared/services/cbb.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
export var ContractSearchComponent = (function () {
    function ContractSearchComponent(_router, _activatedRoute, zone, _http, errorService, _httpService, _authService, _ls, _componentInteractionService, serviceConstants, messageService, store, renderer, titleService, _logger, translate, localeTranslateService, util, cbbService, ellipsis) {
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
        this.messageService = messageService;
        this.store = store;
        this.renderer = renderer;
        this.titleService = titleService;
        this._logger = _logger;
        this.translate = translate;
        this.localeTranslateService = localeTranslateService;
        this.util = util;
        this.cbbService = cbbService;
        this.ellipsis = ellipsis;
        this.grdAccountDetail = false;
        this.grdContractSearch = true;
        this.grdPostcodeDetail = false;
        this.statusSearchType = false;
        this.expirySearchType = false;
        this.specificBranch = false;
        this.isRequesting = false;
        this.method = 'contract-management/search';
        this.module = 'contract';
        this.operation = 'Application/iCABSAContractSearch';
        this.pagination = true;
        this.pagesize = '10';
        this.pagecurrent = '1';
        this.status = 'All';
        this.expiry = 'All';
        this.showAddNew = false;
        this.showBranch = true;
        this.showBusiness = true;
        this.showCountry = true;
        this.enableAddNew = false;
        this.searchFilter = '';
        this.loggedInBranch = '';
        this.maxlength = '20';
        this.inputParamsForBranchSearch = {
            'parentMode': 'Contract-Search'
        };
        this.title = 'Contract Search';
        this.statusList = [];
        this.businessCodeListDisabled = false;
        this.branchCodeListDisabled = false;
        this.contractSearchType = [];
        this.filter = [
            { 'Name Begins': '' },
            { 'Name Match': '' },
            { 'Number': '' }
        ];
        this.isSearchDisabled = false;
        this.dropdownSelectedIndex = {
            businessCode: 0,
            countryCode: 0
        };
        this.itemsPerPage = 10;
        this.page = 1;
        this.rows = [];
        this.rowmetadata = [];
        this.buttonTranslatedText = {
            'search': 'Search',
            'cancel': 'Cancel',
            'addNew': 'Add New',
            'all': 'All'
        };
        this.disableCountry = null;
        this.disableBusinessCode = null;
        this.resetRowId = false;
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            if (data !== null && data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                _this.contractStoreData = data['data'];
            }
        });
    }
    ContractSearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getLoggedInBranch();
        this.searchValue = '';
        this.branchValue = '';
        this.status = 'All';
        this.expiry = 'all';
        this.dropdownSelectedIndex['branchCode'] = 0;
        this.dropdownSelectedIndex['businessCode'] = 0;
        this.dropdownSelectedIndex['countryCode'] = 0;
        this.enableAddNew = false;
        this.setDefaultCountryBusinessCode();
        this.countryCodeList = this.cbbService.getCountryList();
        this.businessCodeList = this.cbbService.getBusinessListByCountry(this.countryCode);
        this.branchCodeList = this.cbbService.getBranchListByCountryAndBusiness(this.countryCode, this.businessCode);
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.statusList = [];
                _this.contractSearchType = [];
                _this.buildStatusOptions();
                _this.buildSearchOptions();
                _this.fetchTranslationContent();
                if (_this.translateSubscription) {
                    _this.translateSubscription.unsubscribe();
                }
            }
        });
        this.localeTranslateService.setUpTranslation();
    };
    ContractSearchComponent.prototype.ngAfterViewInit = function () {
    };
    ContractSearchComponent.prototype.ngOnDestroy = function () {
        this.storeSubscription.unsubscribe();
        if (this.translateSubscription) {
            this.translateSubscription.unsubscribe();
        }
    };
    ContractSearchComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('All', null).subscribe(function (res) {
            if (res) {
                _this.buttonTranslatedText.all = res;
            }
        });
        this.getTranslatedValue('Add New', null).subscribe(function (res) {
            if (res) {
                _this.buttonTranslatedText.addNew = res;
            }
        });
        this.getTranslatedValue('Contract/Job/Product Sales Search', null).subscribe(function (res) {
            if (res) {
                _this.titleService.setTitle(res);
            }
            else {
                _this.titleService.setTitle(_this.inputParams.pageTitle);
            }
        });
        this.getTranslatedValue('Own Branch', null).subscribe(function (res) {
            if (res) {
                _this.filter['Own Branch'] = res;
                _this.branchSelection = res;
            }
        });
        this.getTranslatedValue('All Branches', null).subscribe(function (res) {
            if (res) {
                _this.filter['All Branches'] = res;
            }
        });
        this.getTranslatedValue('Name begins', null).subscribe(function (res) {
            if (res) {
                _this.filter['Name Begins'] = res;
                _this.contractSearchType.push(res);
                _this.searchFilter = res;
            }
        });
        this.getTranslatedValue('Name matches', null).subscribe(function (res) {
            if (res) {
                _this.filter['Name Matches'] = res;
                _this.contractSearchType.push(res);
            }
        });
        this.getTranslatedValue('Number', null).subscribe(function (res) {
            if (res) {
                _this.filter['Number'] = res;
                _this.contractSearchType.push(res);
            }
        });
    };
    ContractSearchComponent.prototype.onBranchDataReceived = function (obj) {
        this.branchValue = obj.BranchNumber;
    };
    ContractSearchComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    ContractSearchComponent.prototype.getInstantTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.instant(key, { value: params });
        }
        else {
            return this.translate.instant(key);
        }
    };
    ContractSearchComponent.prototype.buildStatusOptions = function () {
        if (this.inputParams && this.inputParams.parentMode === 'Search-Inactive') {
            this.statusList = [
                {
                    value: 'T',
                    text: 'Terminated'
                },
                {
                    value: 'FT',
                    text: 'Forward Terminated'
                }
            ];
        }
        else {
            this.statusList = [
                {
                    value: 'All',
                    text: 'All'
                },
                {
                    value: 'AllCurrent',
                    text: 'Current (All)'
                },
                {
                    value: 'L',
                    text: 'Current'
                },
                {
                    value: 'FL',
                    text: 'Forward Current'
                },
                {
                    value: 'T',
                    text: 'Terminated'
                },
                {
                    value: 'FT',
                    text: 'Forward Terminated'
                },
                {
                    value: 'PT',
                    text: 'Pending Termination'
                },
                {
                    value: 'C',
                    text: 'Cancelled'
                }
            ];
        }
    };
    ContractSearchComponent.prototype.buildSearchOptions = function () {
        var _this = this;
        if (this.inputParams && this.inputParams.parentMode === 'ProspectPipeline') {
            this.getTranslatedValue('Postcode Begins', null).subscribe(function (res) {
                if (res) {
                    _this.contractSearchType.push(res);
                }
            });
            this.getTranslatedValue('Postcode Matches', null).subscribe(function (res) {
                if (res) {
                    _this.contractSearchType.push(res);
                }
            });
        }
    };
    ContractSearchComponent.prototype.clearRowId = function () {
        var _this = this;
        this.resetRowId = true;
        setTimeout(function () {
            _this.resetRowId = false;
        });
    };
    ContractSearchComponent.prototype.setUI = function (parentMode) {
        this.setPageTitle();
        this.setTableTitle();
        if (!this.inputParams.contractPostcode) {
            this.grdPostcodeDetail = false;
        }
        else {
            this.grdContractSearch = false;
        }
        if (this.inputParams.accountNumber) {
            this.accountNumber = this.inputParams.accountNumber;
            this.accountName = this.inputParams.accountName;
            this.grdAccountDetail = true;
        }
        else {
            this.accountNumber = '';
            this.accountName = '';
            this.grdAccountDetail = false;
        }
    };
    ContractSearchComponent.prototype.setTableTitle = function () {
        var _this = this;
        var searchTitle = 'Search';
        this.getTranslatedValue('Search', null).subscribe(function (res) {
            if (res) {
                searchTitle = res;
            }
        });
        switch (this.inputParams.currentContractType) {
            case 'J':
                this.title = 'Job ' + searchTitle;
                break;
            case 'P':
                this.title = 'Product Sales ' + searchTitle;
                break;
            default:
            case 'C':
                this.title = 'Contract ' + searchTitle;
        }
        switch (this.inputParams.parentMode) {
            case 'PostcodeSearch':
                this.getTranslatedValue('Contracts Matching Postcode', null).subscribe(function (res) {
                    if (res) {
                        _this.title = res;
                    }
                    else {
                        _this.title = 'Contracts Matching Postcode';
                    }
                });
                break;
            case 'Account':
            case 'LookUp-All':
            case 'Prospect':
            case 'LookUp-String':
            case 'ContractCopy':
            case 'LookUp-ProspectConversion':
                this.getTranslatedValue('Contract/Job/Product Sales Search', null).subscribe(function (res) {
                    if (res) {
                        _this.title = res;
                    }
                    else {
                        _this.title = 'Contract/Job/Product Sales Search';
                    }
                });
                this.getTranslatedValue('Contract/Job/Product Sales Search', null).subscribe(function (res) {
                    if (res) {
                        _this.pageTitle = res;
                    }
                    else {
                        _this.pageTitle = 'Contract/Job/Product Sales Search';
                    }
                });
                break;
        }
    };
    ContractSearchComponent.prototype.setPageTitle = function () {
        var _this = this;
        var searchTitle = 'Search';
        this.getTranslatedValue('Search', null).subscribe(function (res) {
            if (res) {
                searchTitle = res;
            }
            switch (_this.inputParams.currentContractType) {
                case 'J':
                    _this.pageTitle = 'Job ' + searchTitle;
                    _this.statusSearchType = false;
                    _this.expirySearchType = true;
                    break;
                case 'P':
                    _this.pageTitle = 'Product Sales ' + searchTitle;
                    _this.statusSearchType = false;
                    _this.expirySearchType = false;
                    break;
                default:
                case 'C':
                    _this.pageTitle = 'Contract ' + searchTitle;
                    _this.statusSearchType = true;
                    _this.expirySearchType = false;
            }
        });
    };
    ContractSearchComponent.prototype.updateView = function (params) {
        var _this = this;
        this.zone.run(function () {
            _this.inputParams = params;
            if (_this.inputParams && _this.inputParams.showAddNew !== undefined) {
                _this.showAddNew = true;
            }
            _this.setUI(_this.inputParams.parentMode);
            _this.inputParams.module = _this.module;
            _this.inputParams.method = _this.method;
            _this.inputParams.operation = _this.operation;
            _this.showCountry = true;
            _this.showBusiness = true;
            _this.showBranch = true;
            _this.countryCode = _this.util.getCountryCode();
            _this.countryOnChangeEffect(_this.countryCode);
            _this.businessCode = _this.util.getBusinessCode();
            _this.businessOnChangeEffect(_this.countryCode, _this.businessCode);
            _this.branchCode = parseInt(_this.util.getBranchCode(), 10);
            if (typeof params.showAddNew !== 'undefined') {
                _this.showAddNew = params.showAddNew;
            }
            if (typeof params.showCountry !== 'undefined' && params.showCountry === false) {
                _this.showCountry = params.showCountry;
                _this.enableAddNew = false;
            }
            else {
                _this.enableAddNew = false;
                if (_this.countryCode !== 'All' && _this.businessCode !== 'All' && _this.branchCode !== 'All') {
                    _this.enableAddNew = true;
                }
            }
            if (typeof params.showBusiness !== 'undefined' && params.showBusiness === false) {
                _this.showBusiness = params.showBusiness;
                _this.enableAddNew = false;
            }
            else {
                _this.enableAddNew = false;
                if (_this.countryCode !== 'All' && _this.businessCode !== 'All' && _this.branchCode !== 'All') {
                    _this.enableAddNew = true;
                }
            }
            if (_this.inputParams.hasOwnProperty('initEmpty')) {
                if (_this.inputParams.initEmpty)
                    _this.clearTable();
            }
            if (_this.contractStoreData && !(Object.keys(_this.contractStoreData).length === 0 && _this.contractStoreData.constructor === Object)) {
                _this.setFilterValues();
                _this.search.set('ContractNumber', _this.contractStoreData['ContractNumber']);
                _this.inputParams.search = _this.search;
                _this.isSearchDisabled = true;
                _this.contractTable.loadTableData(_this.inputParams);
            }
            if (params['parentMode'] === 'InvGrpPremiseMaintenance') {
                _this.disableCountry = true;
                _this.disableBusinessCode = true;
            }
        });
    };
    ContractSearchComponent.prototype.loadData = function () {
        this.onBlur({ target: '' });
        this.setFilterValues();
        this.columns = new Array();
        this.buildTableColumns();
        this.inputParams.search = this.search;
        this.isSearchDisabled = true;
        this.contractTable.loadTableData(this.inputParams);
    };
    ContractSearchComponent.prototype.filterOnChange = function () {
        switch (this.searchFilter) {
            case this.filter['Name Begins']:
            case this.filter['Name Matches']:
                this.maxlength = '30';
                break;
            case this.filter['Number']:
                this.maxlength = '9';
                break;
        }
    };
    ContractSearchComponent.prototype.onBlur = function (event) {
        var elementValue = event.target['value'] || this.searchValue;
        if (this.filter['Number'] === this.searchFilter && elementValue.length > 0 && elementValue.length < 8) {
            this.searchValue = this.util.numberPadding(elementValue, 8);
        }
    };
    ;
    ContractSearchComponent.prototype.buildTableColumns = function () {
        var _this = this;
        if (this.branchSelection === this.filter['All Branches']) {
            this.columns.push({ title: this.getInstantTranslatedValue('Neg Branch', null), name: 'NegBranchNumber' });
        }
        this.getTranslatedValue('Country', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'CountryCode' });
            }
            else {
                _this.columns.push({ title: 'Country', name: 'CountryCode' });
            }
        });
        this.getTranslatedValue('Bus.', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'BusinessCode' });
            }
            else {
                _this.columns.push({ title: 'Bus.', name: 'BusinessCode' });
            }
        });
        this.getTranslatedValue('branch', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'NegBranchNumber' });
            }
            else {
                _this.columns.push({ title: 'Branch', name: 'NegBranchNumber' });
            }
        });
        this.getTranslatedValue('Prefix', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'ContractTypePrefix' });
            }
            else {
                _this.columns.push({ title: 'Prefix', name: 'ContractTypePrefix' });
            }
        });
        this.getTranslatedValue('Number', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'ContractNumber' });
            }
            else {
                _this.columns.push({ title: 'Number', name: 'ContractNumber' });
            }
        });
        this.getTranslatedValue('Name', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'ContractName' });
            }
            else {
                _this.columns.push({ title: 'Name', name: 'ContractName' });
            }
        });
        this.getTranslatedValue('Commence Date', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'ContractCommenceDate' });
            }
            else {
                _this.columns.push({ title: 'Commence Date', name: 'ContractCommenceDate' });
            }
        });
        this.getTranslatedValue('Anniv Date', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'InvoiceAnnivDate' });
            }
            else {
                _this.columns.push({ title: 'Anniv Date', name: 'InvoiceAnnivDate' });
            }
        });
        this.getTranslatedValue('Inv Freq', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'InvoiceFrequencyCode' });
            }
            else {
                _this.columns.push({ title: 'Inv Freq', name: 'InvoiceFrequencyCode' });
            }
        });
        if (this.inputParams.parentMode !== 'Search-Inactive') {
            this.getTranslatedValue('Status', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'PortfolioStatusDesc' });
                }
                else {
                    _this.columns.push({ title: 'Status', name: 'PortfolioStatusDesc' });
                }
            });
        }
        this.getTranslatedValue('Expiry Date', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'ContractExpiryDate' });
            }
            else {
                _this.columns.push({ title: 'Expiry Date', name: 'ContractExpiryDate' });
            }
        });
        if (this.postCode || this.accountNumber) {
            this.getTranslatedValue('Account Number', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'AccountNumber' });
                }
                else {
                    _this.columns.push({ title: 'Account Number', name: 'AccountNumber' });
                }
            });
        }
        else {
            this.getTranslatedValue('Account', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'AccountNumber' });
                }
                else {
                    _this.columns.push({ title: 'Account', name: 'AccountNumber' });
                }
            });
        }
        this.getTranslatedValue('Account Address Line 1', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'AccountAddressLine1' });
            }
            else {
                _this.columns.push({ title: 'Account Address Line 1', name: 'AccountAddressLine1' });
            }
        });
        this.getTranslatedValue('Account Postcode', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'AccountPostCode' });
            }
            else {
                _this.columns.push({ title: 'Account Postcode', name: 'AccountPostCode' });
            }
        });
        this.inputParams.columns = [];
        this.inputParams.columns = this.columns;
    };
    ContractSearchComponent.prototype.branchCodeOnChange = function (event) {
        if (this.countryCode !== 'All' && this.businessCode !== 'All' && this.branchCode !== 'All') {
            if (!(this.inputParams && this.inputParams.isCopy === true)) {
                this.enableAddNew = true;
            }
        }
        else {
            this.enableAddNew = false;
        }
        this.dropdownSelectedIndex['branchCode'] = event.target.selectedIndex;
        this.getLoggedInBranch();
    };
    ContractSearchComponent.prototype.businessOnChange = function (event) {
        if (this.countryCode !== 'All' && this.businessCode !== 'All' && this.branchCode !== 'All') {
            this.enableAddNew = true;
        }
        else {
            this.enableAddNew = false;
        }
        this.dropdownSelectedIndex['businessCode'] = event.target.selectedIndex;
        this.businessOnChangeEffect(this.countryCode, this.businessCode);
    };
    ContractSearchComponent.prototype.countryOnChange = function (event) {
        if (this.countryCode !== 'All' && this.businessCode !== 'All' && this.branchCode !== 'All') {
            this.enableAddNew = true;
        }
        else {
            this.enableAddNew = false;
        }
        this.dropdownSelectedIndex['countryCode'] = event.target.selectedIndex;
        this.countryOnChangeEffect(this.countryCode);
    };
    ContractSearchComponent.prototype.search_onkeydown = function (event) {
        if (event.keyCode === 13) {
            this.loadData();
        }
    };
    ContractSearchComponent.prototype.branchOnChange = function (event) {
        if (this.branchSelection === 'Specific Branch') {
            this.specificBranch = true;
        }
        else {
            this.specificBranch = false;
        }
    };
    ContractSearchComponent.prototype.onAddNew = function () {
        var _this = this;
        this.updateCBB(this.countryCode, this.businessCode, this.branchCode);
        this.store.dispatch({
            type: ContractActionTypes.SAVE_CODE, payload: {
                business: this.businessCode,
                country: this.countryCode
            }
        });
        this.ellipsis.closeModal();
        setTimeout(function () {
            _this.messageService.emitMessage({
                updateMode: false,
                addMode: true,
                searchMode: false
            });
        }, 0);
    };
    ContractSearchComponent.prototype.setFilterValues = function () {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode);
        if (parseInt(this.dropdownSelectedIndex['businessCode'], 10) === 0) {
            this.search.set(this.serviceConstants.BusinessCode, this.util.getBusinessCode());
        }
        else {
            this.search.set(this.serviceConstants.BusinessCode, this.businessCode);
        }
        if (!this.showBusiness && this.inputParams.businessCode) {
            this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        }
        if (parseInt(this.dropdownSelectedIndex['countryCode'], 10) === 0) {
            this.search.set(this.serviceConstants.CountryCode, this.util.getCountryCode());
        }
        else {
            this.search.set(this.serviceConstants.CountryCode, this.countryCode);
        }
        if (!this.showCountry && this.inputParams.countryCode) {
            this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        }
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode);
        this.search.set(this.serviceConstants.CountryCode, this.countryCode);
        if (this.branchCode !== 'All') {
            this.search.set('NegBranchNumber', this.branchCode);
        }
        this.search.set('sort', 'true');
        if (this.inputParams.parentMode !== 'Account' &&
            this.inputParams.parentMode !== 'Prospect' &&
            this.inputParams.parentMode !== 'LookUp-All' &&
            this.inputParams.parentMode !== 'LookUp-String' &&
            this.inputParams.parentMode !== 'ContractCopy' &&
            this.inputParams.parentMode !== 'CallCentreSearch' &&
            this.inputParams.parentMode !== 'LookUp-ProspectConversion') {
            this.search.set('ContractTypeCode', this.inputParams.currentContractType);
        }
        this.search.set('PortfolioStatusCode', this.status);
        if (this.expirySearchType && this.expiry !== 'all') {
            switch (this.expiry) {
                case 'expired':
                    this.search.set('Expiry', 'Expired');
                    break;
                case 'unexpired':
                    this.search.set('Expiry', 'Unexpired');
                    break;
            }
        }
        if (this.grdPostcodeDetail) {
            this.search.set('ContractPostcode', this.searchValue);
            this.search.set('jsonSortField', 'Contract.ContractNumber');
        }
        else if (this.grdAccountDetail) {
            this.search.set('AccountNumber', this.inputParams.accountNumber);
            this.search.set('jsonSortField', 'Contract.ContractNumber');
        }
        else {
            if (this.searchFilter !== this.filter['Select']) {
                switch (this.searchFilter) {
                    case this.filter['Name Begins']:
                        this.search.set('ContractName', this.searchValue);
                        this.search.set('search.op.ContractName', 'BEGINS');
                        this.search.set('jsonSortField', 'Contract.ContractName');
                        break;
                    case this.filter['Name Matches']:
                        this.search.set('ContractName', this.searchValue);
                        this.search.set('search.op.ContractName', 'CONTAINS');
                        this.search.set('jsonSortField', 'Contract.ContractName');
                        break;
                    case this.filter['Number']:
                        this.search.set('ContractNumber', this.searchValue);
                        this.search.set('search.op.ContractNumber', 'GE');
                        this.search.set('jsonSortField', 'Contract.ContractNumber');
                        break;
                    case 'POSTCODE BEGINS':
                        this.search.set('Account.AccountPostcode', this.searchValue);
                        this.search.set('search.op.Account.AccountPostcode', 'BEGINS');
                        this.search.set('jsonSortField', 'Contract.ContractNumber');
                        break;
                    case 'POSTCODE MATCHES':
                        this.search.set('Account.AccountPostcode', this.searchValue);
                        this.search.set('jsonSortField', 'Contract.ContractNumber');
                        break;
                }
            }
        }
        if (this.countryCode === 'All' || this.businessCode === 'All') {
            this.search.set('jsonSortField', 'Contract.ContractName');
        }
        if (this.inputParams.parentMode === 'LookUp-NatAx') {
            this.search.set('Account.NationalAccount', 'true');
        }
    };
    ContractSearchComponent.prototype.getLoggedInBranch = function () {
        var _this = this;
        var businessCode = '', countryCode = '';
        if (parseInt(this.dropdownSelectedIndex['businessCode'], 10) === 0) {
            businessCode = this.util.getBusinessCode();
        }
        else {
            businessCode = this.businessCode;
        }
        if (!this.showBusiness && this.inputParams.businessCode) {
            businessCode = this.inputParams.businessCode;
        }
        if (parseInt(this.dropdownSelectedIndex['countryCode'], 10) === 0) {
            countryCode = this.util.getCountryCode();
        }
        else {
            countryCode = this.countryCode;
        }
        this.util.getLoggedInBranch(businessCode, countryCode).subscribe(function (data) {
            if (data.results && data.results[0] && data.results[0].length > 0) {
                _this.loggedInBranch = data.results[0][0].BranchNumber;
            }
            else if (data.results && data.results[1] && data.results[1].length > 0) {
                _this.loggedInBranch = data.results[1][0].BranchNumber;
            }
            else {
                _this.loggedInBranch = '';
            }
        });
    };
    ContractSearchComponent.prototype.tableDataLoaded = function (data) {
        this.isSearchDisabled = false;
    };
    ContractSearchComponent.prototype.selectedData = function (event) {
        var businessCode = '', countryCode = '', branchCode = '';
        if (parseInt(this.dropdownSelectedIndex['businessCode'], 10) === 0) {
            businessCode = this.util.getBusinessCode();
        }
        else {
            businessCode = this.businessCode;
        }
        if (!this.showBusiness && this.inputParams.business) {
            businessCode = this.inputParams.business;
        }
        if (parseInt(this.dropdownSelectedIndex['countryCode'], 10) === 0) {
            countryCode = this.util.getCountryCode();
        }
        else {
            countryCode = this.countryCode;
        }
        if (!this.showCountry && this.inputParams.countryCode) {
            countryCode = this.inputParams.countryCode;
        }
        if (!(this.inputParams && this.inputParams.isCopy === true)) {
            this.updateCBB(event.row.CountryCode, event.row.BusinessCode, event.row.NegBranchNumber);
        }
        this.store.dispatch({
            type: ContractActionTypes.SAVE_CODE, payload: {
                business: event.row.BusinessCode,
                country: event.row.CountryCode
            }
        });
        this.ellipsis.sendDataToParent(event.row);
    };
    ContractSearchComponent.prototype.setDefaultCountryBusinessCode = function () {
        var defaultCountryCode = '', defaultBusinessCode = '';
        defaultCountryCode = this.util.getLogInCountryCode();
        this.countryCode = defaultCountryCode;
        this.countryOnChangeEffect(this.countryCode);
    };
    ContractSearchComponent.prototype.countryOnChangeEffect = function (selectedCountryCode) {
        this.businessCodeListDisabled = false;
        if (selectedCountryCode === 'All') {
            this.businessCodeList = [];
            this.businessCode = 'All';
            this.businessCodeListDisabled = true;
            this.businessOnChangeEffect(selectedCountryCode, this.businessCode);
        }
        else {
            this.businessCodeList = this.cbbService.getBusinessListByCountry(selectedCountryCode);
            this.businessCode = this.businessCodeList[0].value;
            this.businessOnChangeEffect(selectedCountryCode, this.businessCode);
        }
    };
    ContractSearchComponent.prototype.businessOnChangeEffect = function (selectedCountryCode, selectedBusinessCode) {
        this.branchCodeListDisabled = false;
        if (selectedBusinessCode === 'All') {
            this.branchCodeList = [];
            this.branchCode = 'All';
            this.branchCodeListDisabled = true;
            this.enableAddNew = false;
        }
        else {
            this.enableAddNew = true;
            this.branchCodeList = this.cbbService.getBranchListByCountryAndBusiness(selectedCountryCode, selectedBusinessCode);
            this.branchCode = this.branchCodeList[0] ? this.branchCodeList[0].value : '';
        }
    };
    ContractSearchComponent.prototype.updateCBB = function (countryCode, businessCode, branchCode) {
        var _this = this;
        if (countryCode !== 'All' && businessCode !== 'All' && branchCode !== 'All') {
            this.cbbService.setCountryCode(countryCode, true);
            this.cbbService.setBusinessCode(businessCode, false, true);
            this.cbbService.setBranchCode(branchCode, true);
            setTimeout(function () {
                _this.cbbService.setBusinessCode(businessCode, false, true);
                _this.cbbService.setBranchCode(branchCode, true);
            }, 0);
        }
    };
    ContractSearchComponent.prototype.clearTable = function () {
        this.contractTable.clearTable();
    };
    ContractSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAContractSearch.html'
                },] },
    ];
    ContractSearchComponent.ctorParameters = [
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
        { type: MessageService, },
        { type: Store, },
        { type: Renderer, },
        { type: Title, },
        { type: Logger, },
        { type: TranslateService, },
        { type: LocaleTranslationService, },
        { type: Utils, },
        { type: CBBService, },
        { type: EllipsisComponent, },
    ];
    ContractSearchComponent.propDecorators = {
        'contractTable': [{ type: ViewChild, args: ['contractTable',] },],
        'searchButton': [{ type: ViewChild, args: ['searchButton',] },],
        'inputParams': [{ type: Input },],
    };
    return ContractSearchComponent;
}());
