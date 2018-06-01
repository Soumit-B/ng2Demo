import { MessageService } from './../../../shared/services/message.service';
import { AccountMaintenanceActionTypes } from './../../actions/account-maintenance';
import { Component, ViewChild, Input, NgZone, Renderer } from '@angular/core';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { Http, URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';
import { TranslateService } from 'ng2-translate';
import { Store } from '@ngrx/store';
import { Utils } from '../../../shared/services/utility';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ErrorService } from '../../../shared/services/error.service';
import { HttpService } from '../../../shared/services/http-service';
import { AuthService } from '../../../shared/services/auth.service';
import { CBBService } from '../../../shared/services/cbb.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
export var AccountSearchComponent = (function () {
    function AccountSearchComponent(_router, _activatedRoute, zone, http, store, errorService, _httpService, _authService, _ls, serviceConstants, renderer, translate, localeTranslateService, ls, messageService, util, cbbService, ellipsis) {
        var _this = this;
        this._router = _router;
        this._activatedRoute = _activatedRoute;
        this.zone = zone;
        this.http = http;
        this.store = store;
        this.errorService = errorService;
        this._httpService = _httpService;
        this._authService = _authService;
        this._ls = _ls;
        this.serviceConstants = serviceConstants;
        this.renderer = renderer;
        this.translate = translate;
        this.localeTranslateService = localeTranslateService;
        this.ls = ls;
        this.messageService = messageService;
        this.util = util;
        this.cbbService = cbbService;
        this.ellipsis = ellipsis;
        this.isRequesting = false;
        this.method = 'contract-management/search';
        this.module = 'account';
        this.operation = 'Application/iCABSAAccountSearch';
        this.pagination = true;
        this.pagesize = '10';
        this.pagecurrent = '1';
        this.showAddNew = false;
        this.showAddNewDisplay = true;
        this.showBusinessCode = true;
        this.showCountryCode = true;
        this.maxlength = '20';
        this.isSearchDisabled = false;
        this.grdSearchName = false;
        this.grdAccountSearch = false;
        this.grdPostcodeSearch = false;
        this.grdGroupAccountDetail = false;
        this.title = 'Account Search';
        this.businessCodeListDisabled = false;
        this.disableCountry = null;
        this.itemsPerPage = 10;
        this.page = 1;
        this.dropdownSelectedIndex = {
            businessCode: 0,
            countryCode: 0
        };
        this.columns = [];
        this.rowmetadata = [
            { name: 'LiveAccount', type: 'img' },
            { name: 'NationalAccount', type: 'img' }
        ];
        this.rows = [];
        this.buttonTranslatedText = {
            'search': 'Search',
            'cancel': 'Cancel',
            'addNew': 'Add New',
            'all': 'All'
        };
        this.filter = {
            select: '',
            nameBegins: '',
            nameMatches: '',
            postCode: '',
            number: ''
        };
        this.resetRowId = false;
        this.triggerCBBChange = true;
        this.storeSubscription = store.select('account').subscribe(function (data) {
            _this.storeData = data['data'];
        });
    }
    AccountSearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.countryCodeList = [];
        this.businessCodeList = [];
        this.setDefaultCountryBusinessCode();
        this.countryCodeList = this.cbbService.getCountryList();
        this.businessCodeList = this.cbbService.getBusinessListByCountry(this.countryCode);
        var pageTitle = '';
        this.pageTitle = 'Account Name/Number Search';
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
            }
            _this.buildTableColumns();
        });
    };
    AccountSearchComponent.prototype.ngAfterViewInit = function () {
        this.fetchTranslationContent();
    };
    AccountSearchComponent.prototype.ngOnDestroy = function () {
        this.searchValue = '';
        this.groupName = '';
        this.groupNumber = '';
        this.rows = [];
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    AccountSearchComponent.prototype.onAddNew = function () {
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_CODE, payload: {
                business: (this.businessCode === 'All') ? this.util.getBusinessCode() : this.businessCode,
                country: (this.countryCode === 'All') ? this.util.getCountryCode() : this.countryCode
            }
        });
        this.messageService.emitMessage({
            updateMode: false,
            addMode: true,
            searchMode: false
        });
        this.ellipsis.closeModal();
        this.updateCBB(this.countryCode, this.businessCode);
    };
    AccountSearchComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('All', null).subscribe(function (res) {
            if (res) {
            }
        });
        this.getTranslatedValue('Search', null).subscribe(function (res) {
            if (res) {
                _this.buttonTranslatedText.search = res;
            }
        });
        this.getTranslatedValue('Add New', null).subscribe(function (res) {
            if (res) {
                _this.buttonTranslatedText.addNew = res;
            }
        });
        this.getTranslatedValue('Select', null).subscribe(function (res) {
            if (res) {
                _this.filter['select'] = res.toString().trim();
            }
        });
        this.getTranslatedValue('Name begins', null).subscribe(function (res) {
            if (res) {
                _this.filter['nameBegins'] = res.toString().trim();
                _this.searchFilter = res.toString().trim();
            }
        });
        this.getTranslatedValue('Name matches', null).subscribe(function (res) {
            if (res) {
                _this.filter['nameMatches'] = res.toString().trim();
            }
        });
        this.getTranslatedValue('Number', null).subscribe(function (res) {
            if (res) {
                _this.filter['number'] = res.toString().trim();
            }
        });
        this.getTranslatedValue('Post Code', null).subscribe(function (res) {
            if (res) {
                _this.filter['postCode'] = res.toString().trim();
            }
        });
    };
    AccountSearchComponent.prototype.buildTableColumns = function () {
        var _this = this;
        this.columns = [];
        this.getTranslatedValue('Country', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'CountryCode' });
            }
            else {
                _this.columns.push({ title: 'Country', name: 'CountryCode' });
            }
        });
        this.getTranslatedValue('Business', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'BusinessCode' });
            }
            else {
                _this.columns.push({ title: 'Bus.', name: 'BusinessCode' });
            }
        });
        this.getTranslatedValue('Account Number', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'AccountNumber' });
            }
            else {
                _this.columns.push({ title: 'Account Number', name: 'AccountNumber' });
            }
        });
        this.getTranslatedValue('Account Name', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'AccountName' });
            }
            else {
                _this.columns.push({ title: 'Account Name', name: 'AccountName' });
            }
        });
        this.getTranslatedValue('Address 1', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'AccountAddressLine1' });
            }
            else {
                _this.columns.push({ title: 'Address 1', name: 'AccountAddressLine1' });
            }
        });
        this.getTranslatedValue('Address 4', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'AccountAddressLine4' });
            }
            else {
                _this.columns.push({ title: 'Address 4', name: 'AccountAddressLine4' });
            }
        });
        this.getTranslatedValue('Postcode', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'AccountPostcode' });
            }
            else {
                _this.columns.push({ title: 'Postcode', name: 'AccountPostcode' });
            }
        });
        this.getTranslatedValue('Live', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'LiveAccount' });
            }
            else {
                _this.columns.push({ title: 'Live', name: 'LiveAccount' });
            }
        });
        this.getTranslatedValue('Nat Acc', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'NationalAccount' });
            }
            else {
                _this.columns.push({ title: 'Nat Acc', name: 'NationalAccount' });
            }
        });
        if (this.inputParams && (this.inputParams.parentMode === 'ContractSearch' || this.inputParams.parentMode === 'AccountSearch' || this.inputParams.parentMode === 'SOPPostcodeSearch')) {
            this.getTranslatedValue('Address 2', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'AccountAddressLine2' });
                }
            });
        }
    };
    AccountSearchComponent.prototype.setUI = function (parentMode) {
        var _this = this;
        switch (parentMode) {
            case 'ContractSearch':
                this.title = 'Account Search';
                this.pageTitle = 'Select Existing Account To Add To';
                this.searchValue = this.inputParams.contractName;
                this.grdSearchName = false;
                this.grdAccountSearch = true;
                this.grdPostcodeSearch = false;
                setTimeout(function () {
                    _this.loadData();
                }, 0);
                break;
            case 'SOPPostcodeSearch':
                this.title = 'Potential Renegotiations';
                this.pageTitle = 'Accounts Matching Postcode For Potential Renegotiations';
                this.searchValue = this.inputParams.contractPostcode;
                this.grdSearchName = false;
                this.grdAccountSearch = false;
                this.grdPostcodeSearch = true;
                break;
            case 'AccountSearch':
                this.title = 'Account Search';
                this.pageTitle = 'Account Name/Number Search';
                this.searchValue = this.inputParams.accountName;
                this.grdSearchName = false;
                this.grdAccountSearch = true;
                this.grdPostcodeSearch = false;
                setTimeout(function () {
                    _this.loadData();
                }, 0);
                break;
            case 'ContractManagement':
            case 'BusinessRuleMaintenance':
            case 'LookUp-Search':
                this.title = 'Account Search';
                this.grdSearchName = false;
                this.pageTitle = 'Accounts Matching Name';
                this.grdAccountSearch = true;
                this.grdPostcodeSearch = false;
                this.showAddNew = true;
                break;
            case 'LookUp-NatAx':
                this.title = 'National Account Search';
                this.pageTitle = 'Account Name/Number Search';
                this.grdSearchName = false;
                this.grdAccountSearch = true;
                this.grdPostcodeSearch = false;
                break;
            case 'ExistingAccountSearch':
                this.title = 'Existing Account Search';
                this.pageTitle = 'Account Name/Number Search';
                this.grdSearchName = false;
                this.grdAccountSearch = true;
                this.grdPostcodeSearch = false;
                break;
            case 'ExistingAccountPipelineSearch':
                this.title = 'Existing Account Search';
                this.pageTitle = 'Account Name/Number Search';
                this.grdSearchName = false;
                this.grdAccountSearch = true;
                this.grdPostcodeSearch = false;
                break;
            case 'LookUp-InterGroup':
                this.title = 'InterGroup Account Search';
                this.pageTitle = 'Account Name/Number Search';
                this.grdSearchName = false;
                this.grdAccountSearch = true;
                this.grdPostcodeSearch = false;
                break;
            case 'InvoiceGroupMaintenanceSearch':
                this.title = 'Account Search';
                this.pageTitle = 'Account Name/Number Search';
                this.searchValue = this.inputParams.accountName;
                this.grdSearchName = false;
                this.grdAccountSearch = true;
                this.grdPostcodeSearch = false;
                this.showAddNewDisplay = false;
                break;
            default:
                this.title = 'Account Search';
                this.pageTitle = 'Account Name/Number Search';
                this.grdSearchName = false;
                this.grdAccountSearch = true;
                this.grdPostcodeSearch = false;
        }
        if (this.inputParams.groupAccountNumber) {
            this.grdGroupAccountDetail = true;
            this.groupName = this.inputParams.groupName;
            this.groupNumber = this.inputParams.groupAccountNumber;
        }
        this.filterOnChange();
    };
    AccountSearchComponent.prototype.updateView = function (params) {
        this.inputParams = params;
        if (this.inputParams['showAddNewDisplay'] !== null &&
            this.inputParams['showAddNewDisplay'] !== '' &&
            this.inputParams['showAddNewDisplay'] !== undefined) {
            this.showAddNewDisplay = this.inputParams['showAddNewDisplay'];
        }
        if (this.inputParams['triggerCBBChange'] !== null &&
            this.inputParams['triggerCBBChange'] !== '' &&
            this.inputParams['triggerCBBChange'] !== undefined) {
            this.triggerCBBChange = this.inputParams['triggerCBBChange'];
        }
        this.setUI(this.inputParams.parentMode);
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        if (this.inputParams && typeof this.inputParams.showCountryCode !== 'undefined') {
            this.showCountryCode = this.inputParams.showCountryCode;
        }
        if (this.inputParams && typeof this.inputParams.showBusinessCode !== 'undefined') {
            this.showBusinessCode = this.inputParams.showBusinessCode;
        }
        this.countryCode = this.util.getCountryCode();
        this.countryOnChangeEffect(this.countryCode);
        this.businessCode = this.util.getBusinessCode();
        this.searchValue = this.inputParams.searchValue ? this.inputParams.searchValue : this.searchValue;
    };
    AccountSearchComponent.prototype.loadData = function () {
        this.buildTableColumns();
        this.setFilterValues();
        this.inputParams.search = this.search;
        this.isSearchDisabled = true;
        this.accountTable.loadTableData(this.inputParams);
    };
    AccountSearchComponent.prototype.tableDataLoaded = function (data) {
        this.isSearchDisabled = false;
    };
    AccountSearchComponent.prototype.search_onkeydown = function (event) {
        if (event.keyCode === 13) {
            if (this.filter['number'] === this.searchFilter && this.searchValue.length > 0 && this.searchValue.length < 9) {
                this.searchValue = this.util.numberPadding(this.searchValue, 9);
            }
            this.loadData();
        }
    };
    AccountSearchComponent.prototype.selectedData = function (event) {
        var returnObj;
        this.updateCBB(event.row.CountryCode, event.row.BusinessCode);
        switch (this.inputParams.parentMode) {
            case 'ContractSearch':
            case 'ContractManagement':
            case 'LookUp-NatAx':
            case 'ExistingAccountSearch':
            case 'AccountSearch':
            case 'HistorySearch':
            case 'LookUp':
            case 'Lookup-UpdateParent':
            case 'LookUp-InterGroup':
                returnObj = {
                    'AccountNumber': event.row.AccountNumber,
                    'AccountName': event.row.AccountName
                };
                break;
            case 'ExistingAccountPipelineSearch':
                returnObj = {
                    'AccountNumber': event.row.AccountNumber,
                    'AccountName': event.row.AccountName,
                    'NextActionRequired': 'AccountSelected'
                };
                break;
            case 'LookUp-MergeFrom':
                returnObj = {
                    'FromAccountNumber': event.row.AccountNumber,
                    'FromAccountName': event.row.AccountName
                };
                break;
            case 'LookUp-MergeTo':
                returnObj = {
                    'ToAccountNumber': event.row.AccountNumber,
                    'ToAccountName': event.row.AccountName
                };
                break;
            case 'SOPPostcodeSearch':
                returnObj = {
                    'AccountNumber': event.row.AccountNumber,
                    'AccountName': event.row.AccountName,
                    'AccountAddressLine1': event.row.AccountAddressLine1,
                    'AccountAddressLine2': event.row.AccountAddressLine2,
                    'AccountAddressLine3': event.row.AccountAddressLine3,
                    'AccountAddressLine4': event.row.AccountAddressLine4,
                    'AccountAddressLine5': event.row.AccountAddressLine5,
                    'AccountPostcode': event.row.AccountPostcode,
                    'RenegInd': true
                };
                break;
            case 'LookUp-Search':
                returnObj = {
                    'SearchId': event.row.AccountNumber,
                    'SearchDesc': event.row.AccountName
                };
                break;
            case 'LookUp-CollectFrom':
                returnObj = {
                    'CollectFrom': event.row.AccountNumber,
                    'CollectFromName': event.row.AccountName
                };
                break;
            case 'GeneralSearch-Lookup':
                returnObj = {
                    'SearchValue': event.row.AccountNumber
                };
                break;
            case 'LookUp-CopyAccountNumber':
                returnObj = {
                    'CopyAccountNumber': event.row.AccountNumber
                };
                break;
            case 'CallCentreAnalysis':
                returnObj = {
                    'ViewByValue': event.row.AccountNumber,
                    'ViewByValueDesc': event.row.AccountName
                };
                break;
            case 'LookUp-CrossReference':
                returnObj = {
                    'CrossReferenceAccountNumber': event.row.AccountNumber,
                    'CrossReferenceAccountName': event.row.AccountName
                };
                break;
            default:
                returnObj = {
                    'AccountNumber': event.row.PaymentTypeCode,
                    'Object': event.row
                };
        }
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_CODE, payload: {
                business: event.row.BusinessCode,
                country: event.row.CountryCode
            }
        });
        this.ellipsis.sendDataToParent(event.row);
    };
    AccountSearchComponent.prototype.getCodeData = function () {
        var businessCode = '';
        var countryCode = '';
        if (parseInt(this.dropdownSelectedIndex['businessCode'], 10) === 0) {
            businessCode = this.util.getLogInBusinessCode();
        }
        else {
            businessCode = this.businessCode;
        }
        if (parseInt(this.dropdownSelectedIndex['countryCode'], 10) === 0) {
            countryCode = this.util.getLogInCountryCode();
        }
        else {
            countryCode = this.countryCode;
        }
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_CODE, payload: {
                business: businessCode,
                country: countryCode
            }
        });
    };
    AccountSearchComponent.prototype.businessOnChange = function (event) {
        if (event.target.selectedIndex === 0) {
            this.businessCode = 'All';
        }
        else {
            this.dropdownSelectedIndex['businessCode'] = event.target.selectedIndex;
            this.businessCode = this.businessCodeList[event.target.selectedIndex - 1].value;
        }
        if (this.countryCode !== 'All' && this.businessCode !== 'All') {
            this.showAddNew = true;
        }
        else {
            this.showAddNew = false;
        }
    };
    AccountSearchComponent.prototype.countryOnChange = function (event) {
        if (event.target.selectedIndex === 0) {
            this.countryCode = 'All';
            this.countryOnChangeEffect(this.countryCode);
            return;
        }
        this.dropdownSelectedIndex['countryCode'] = event.target.selectedIndex;
        this.countryCode = this.countryCodeList[event.target.selectedIndex - 1].value;
        this.countryOnChangeEffect(this.countryCode);
    };
    AccountSearchComponent.prototype.filterOnChange = function () {
        switch (this.searchFilter) {
            case this.filter['nameBegins']:
            case this.filter['nameMatches']:
                this.maxlength = '30';
                break;
            case this.filter['number']:
                this.maxlength = '9';
                break;
            case this.filter['postCode']:
                this.maxlength = '10';
                break;
        }
        this.searchValue = '';
    };
    AccountSearchComponent.prototype.clearRowId = function () {
        var _this = this;
        this.resetRowId = true;
        setTimeout(function () {
            _this.resetRowId = false;
        });
    };
    AccountSearchComponent.prototype.onAccountNumberBlur = function (event) {
        var elementValue = event.target['value'] || this.searchValue;
        if (this.filter['number'] === this.searchFilter && elementValue.length > 0 && elementValue.length < 9) {
            this.searchValue = this.util.numberPadding(elementValue, 9);
        }
    };
    AccountSearchComponent.prototype.setFilterValues = function () {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        if (this.inputParams.businessCode) {
            this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        }
        if (this.inputParams.countryCode) {
            this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        }
        if (this.showBusinessCode) {
            this.search.set(this.serviceConstants.BusinessCode, this.businessCode);
        }
        if (this.showCountryCode) {
            this.search.set(this.serviceConstants.CountryCode, this.countryCode);
        }
        this.search.set('NegBranchNumber', this.util.getBranchCode());
        this.search.set('sortPreference', 'true');
        this.search.set('sort', 'true');
        switch (this.inputParams.parentMode) {
            case 'ContractSearch':
            case 'AccountSearch':
                switch (this.searchFilter) {
                    case this.filter['nameBegins']:
                        this.search.set('AccountName', this.searchValue);
                        this.search.set('search.op.AccountName', 'BEGINS');
                        this.search.set('search.sortby', 'AccountName');
                        this.search.set('jsonSortField', 'AccountName');
                        break;
                    case this.filter['nameMatches']:
                        this.search.set('AccountName', this.searchValue);
                        this.search.set('search.op.AccountName', 'CONTAINS');
                        this.search.set('search.sortby', 'AccountName');
                        this.search.set('jsonSortField', 'AccountName');
                        break;
                    case this.filter['number']:
                        this.search.set('AccountNumber', this.searchValue);
                        this.search.set('search.op.AccountNumber', 'GE');
                        this.search.set('search.sortby', 'AccountNumber');
                        this.search.set('jsonSortField', 'AccountNumber');
                        break;
                    case this.filter['postCode']:
                        this.search.set('AccountPostCode', this.searchValue);
                        this.search.set('search.op.AccountPostCode', 'BEGINS');
                        this.search.set('search.sortby', 'AccountPostCode');
                        this.search.set('jsonSortField', 'AccountPostCode');
                        break;
                }
                break;
            case 'SOPPostcodeSearch':
                this.search.set('AccountPostcode', this.searchValue);
                this.search.set('search.op.AccountPostcode', 'BEGINS');
                break;
            default:
                switch (this.searchFilter) {
                    case this.filter['nameBegins']:
                        this.search.set('AccountName', this.searchValue);
                        this.search.set('search.op.AccountName', 'BEGINS');
                        this.search.set('search.sortby', 'AccountName');
                        this.search.set('jsonSortField', 'AccountName');
                        break;
                    case this.filter['nameMatches']:
                        this.search.set('AccountName', this.searchValue);
                        this.search.set('search.op.AccountName', 'CONTAINS');
                        this.search.set('search.sortby', 'AccountName');
                        this.search.set('jsonSortField', 'AccountName');
                        break;
                    case this.filter['number']:
                        this.search.set('AccountNumber', this.searchValue);
                        this.search.set('search.op.AccountNumber', 'GE');
                        this.search.set('search.sortby', 'AccountNumber');
                        this.search.set('jsonSortField', 'AccountNumber');
                        break;
                    case this.filter['postCode']:
                        this.search.set('AccountPostCode', this.searchValue);
                        this.search.set('search.op.AccountPostCode', 'BEGINS');
                        this.search.set('search.sortby', 'AccountPostCode');
                        this.search.set('jsonSortField', 'AccountPostCode');
                        break;
                }
                if (this.inputParams.parentMode === 'LookUp-NatAx') {
                    this.search.set('NationalAccount', 'true');
                }
                if (this.inputParams.parentMode === 'LookUp-InterGroup') {
                    this.search.set('InterGroupAccount', 'true');
                }
        }
        if (this.countryCode === 'All' || this.businessCode === 'All') {
            this.search.set('jsonSortField', 'AccountName');
        }
        if (this.inputParams.groupAccountNumber) {
            this.search.set('GroupAccountNumber', this.inputParams.groupAccountNumber);
        }
    };
    AccountSearchComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    AccountSearchComponent.prototype.setDefaultCountryBusinessCode = function () {
        var defaultCountryCode = '', defaultBusinessCode = '';
        defaultCountryCode = this.util.getLogInCountryCode();
        this.countryCode = defaultCountryCode;
        this.countryOnChangeEffect(this.countryCode);
    };
    AccountSearchComponent.prototype.countryOnChangeEffect = function (selectedCountryCode) {
        this.businessCodeListDisabled = false;
        if (selectedCountryCode === 'All') {
            this.businessCodeList = [];
            this.businessCode = 'All';
            this.businessCodeListDisabled = true;
            this.showAddNew = false;
        }
        else {
            this.showAddNew = true;
            this.businessCodeList = this.cbbService.getBusinessListByCountry(selectedCountryCode);
            this.businessCode = this.businessCodeList[0].value;
        }
    };
    AccountSearchComponent.prototype.updateCBB = function (countryCode, businessCode) {
        var _this = this;
        var country = this.util.getCountryCode();
        var business = this.util.getBusinessCode();
        var branch = this.util.getBranchCode();
        if (countryCode !== 'All' && businessCode !== 'All') {
            if (this.triggerCBBChange) {
                this.cbbService.setCountryCode(countryCode, true);
                this.cbbService.setBusinessCode(businessCode, true, true);
                if (country === countryCode && business === businessCode) {
                    setTimeout(function () {
                        _this.cbbService.setBusinessCode(businessCode, false, true);
                        _this.cbbService.setBranchCode(branch, true);
                    }, 0);
                }
                else {
                    this.cbbService.setBranchCode(branch, true);
                }
            }
        }
    };
    AccountSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSASAccountSearch.html'
                },] },
    ];
    AccountSearchComponent.ctorParameters = [
        { type: Router, },
        { type: ActivatedRoute, },
        { type: NgZone, },
        { type: Http, },
        { type: Store, },
        { type: ErrorService, },
        { type: HttpService, },
        { type: AuthService, },
        { type: LocalStorageService, },
        { type: ServiceConstants, },
        { type: Renderer, },
        { type: TranslateService, },
        { type: LocaleTranslationService, },
        { type: LocalStorageService, },
        { type: MessageService, },
        { type: Utils, },
        { type: CBBService, },
        { type: EllipsisComponent, },
    ];
    AccountSearchComponent.propDecorators = {
        'accountTable': [{ type: ViewChild, args: ['accountTable',] },],
        'searchButton': [{ type: ViewChild, args: ['searchButton',] },],
        'inputParams': [{ type: Input },],
    };
    return AccountSearchComponent;
}());
