import { Store } from '@ngrx/store';
import { Logger } from '@nsalaun/ng2-logger';
import { RiExchange } from '../../../shared/services/riExchange';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { Component, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { Utils } from './../../../shared/services/utility';
import { ActionTypes } from '../../../app/actions/account';
import { TranslateService } from 'ng2-translate';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
export var AccountGroupSearchComponent = (function () {
    function AccountGroupSearchComponent(logger, serviceConstants, fb, _router, utils, store, activatedRoute, riExchange, translate, zone, localeTranslateService) {
        var _this = this;
        this.logger = logger;
        this.serviceConstants = serviceConstants;
        this.fb = fb;
        this._router = _router;
        this.utils = utils;
        this.store = store;
        this.activatedRoute = activatedRoute;
        this.riExchange = riExchange;
        this.translate = translate;
        this.zone = zone;
        this.localeTranslateService = localeTranslateService;
        this.method = 'contract-management/search';
        this.module = 'account';
        this.operation = 'Application/iCABSAAccountGroupSearch';
        this.search = new URLSearchParams();
        this.inputParams = {
            'FilterBranch': 'All',
            'PortfolioStatus': 'Current',
            'Action': '2',
            'riSortOrder': 'Descending',
            'countryCode': '',
            'businessCode': '',
            'BranchNumber': ' '
        };
        this.CurrentColumnName = '';
        this.translatedMessageList = {
            'BranchNumber': 'Branch Number',
            'AccountNumber': 'Account Number',
            'Type': 'Type',
            'ContractNumber': 'Contract Number',
            'CustomerName': 'Customer Name',
            'CommenceDate': 'Commence Date',
            'Status': 'Status',
            'ExpiryDate': 'Expiry Date',
            'AddressLine1': 'Address Line 1'
        };
        this.CheckboxName = ['Accounts', 'Contracts', 'Jobs', 'Product Sales'];
        this.cbChecked = [];
        this.activatedRouteSubscription = this.activatedRoute.queryParams.subscribe(function (param) {
            _this.DatafromParent = param;
        });
    }
    AccountGroupSearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.itemsPerPage = '10';
        this.currentPage = '1';
        this.maxColumn = 9;
        this.inputParams.businessCode = this.utils.getBusinessCode();
        this.inputParams.countryCode = this.utils.getCountryCode();
        this.localeTranslateService.setUpTranslation();
        if (this.DatafromParent !== null && this.DatafromParent !== undefined) {
            this.inputParams.GroupName = this.DatafromParent.GroupName;
            this.inputParams.GroupAccountNumber = this.DatafromParent.GroupAccountNumber;
        }
        this.search.set(this.serviceConstants.Action, '0');
        this.AccSearchGroup = this.fb.group({
            GroupAccountNumber: ['', Validators.required],
            BranchNumber: ['', Validators.required],
            GroupName: [this.inputParams.GroupName]
        });
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
            }
        });
        this.AccSearchGroup.controls['BranchNumber'].disable();
        this.EnterFormFields();
        this.refresh();
    };
    AccountGroupSearchComponent.prototype.ngAfterViewInit = function () {
    };
    AccountGroupSearchComponent.prototype.ngAfterViewChecked = function () {
        this.setDefaultToolTipValueInGrid();
    };
    AccountGroupSearchComponent.prototype.ngOnDestroy = function () {
        if (this.activatedRouteSubscription) {
            this.activatedRouteSubscription.unsubscribe();
        }
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
        this.riExchange.releaseReference(this);
        delete this;
    };
    AccountGroupSearchComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('Branch Number', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.translatedMessageList.BranchNumber = res;
                }
            });
        });
        this.getTranslatedValue('Account Number', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.translatedMessageList.AccountNumber = res;
                }
            });
        });
        this.getTranslatedValue('Type', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.translatedMessageList.Type = res;
                }
            });
        });
        this.getTranslatedValue('Contract Number', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.translatedMessageList.ContractNumber = res;
                }
            });
        });
        this.getTranslatedValue('Customer Name', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.translatedMessageList.CustomerName = res;
                }
            });
        });
        this.getTranslatedValue('CommenceDate', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.translatedMessageList.CommenceDate = res;
                }
            });
        });
        this.getTranslatedValue('Status', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.translatedMessageList.Status = res;
                }
            });
        });
        this.getTranslatedValue('Expiry Date', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.translatedMessageList.ExpiryDate = res;
                }
            });
        });
        this.getTranslatedValue('Address Line 1', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.translatedMessageList.AddressLine1 = res;
                }
            });
        });
    };
    AccountGroupSearchComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    AccountGroupSearchComponent.prototype.EnterFormFields = function () {
        this.AccSearchGroup.controls['GroupAccountNumber'].setValue(this.inputParams.GroupAccountNumber);
        this.AccSearchGroup.controls['GroupName'].setValue(this.inputParams.GroupName);
    };
    AccountGroupSearchComponent.prototype.updateCheckedOptions = function (chBox, event) {
        var cbIdx = this.cbChecked.indexOf(chBox);
        if (event.target.checked) {
            if (cbIdx < 0)
                this.cbChecked.push(chBox);
        }
        else {
            if (cbIdx >= 0)
                this.cbChecked.splice(cbIdx, 1);
        }
        var key = this.cbChecked;
        if (key.indexOf('Accounts') > -1) {
            this.strParams = '&ExcludeAccounts=True';
            this.search.set('ExcludeAccounts', 'True');
        }
        else if (key.indexOf('Accounts') === -1) {
            this.search.delete('ExcludeAccounts');
        }
        if (key.indexOf('Contracts') > -1) {
            this.strParams = '&ExcludeContracts=True';
            this.search.set('ExcludeContracts', 'True');
        }
        else if (key.indexOf('Contracts') === -1) {
            this.search.delete('ExcludeContracts');
        }
        if (key.indexOf('Jobs') > -1) {
            this.strParams = '&ExcludeJobs=True';
            this.search.set('ExcludeJobs', 'True');
        }
        else if (key.indexOf('Jobs') === -1) {
            this.search.delete('ExcludeJobs');
        }
        if (key.indexOf('Product Sales') > -1) {
            this.strParams = '&ExcludeSales=True';
            this.search.set('ExcludeSales', 'True');
        }
        else if (key.indexOf('Product Sales') === -1) {
            this.search.delete('ExcludeSales');
        }
    };
    AccountGroupSearchComponent.prototype.getGridInfo = function (info) {
        this.invoicePagination.totalItems = info.totalRows;
    };
    AccountGroupSearchComponent.prototype.getCurrentPage = function (curPage) {
        this.search.set('PageCurrent', curPage.value);
        this.currentPage = curPage.value;
        this.inputParams.search = this.search;
        this.invoiceGrid.loadGridData(this.inputParams);
    };
    AccountGroupSearchComponent.prototype.onChangeFilter = function (filterOption) {
        this.filterOption = filterOption;
        this.inputParams.FilterBranch = this.filterOption;
        if (this.inputParams.FilterBranch === 'Servicing' || this.inputParams.FilterBranch === 'Negotiating') {
            this.AccSearchGroup.controls['BranchNumber'].enable();
        }
        else {
            this.AccSearchGroup.controls['BranchNumber'].disable();
        }
    };
    AccountGroupSearchComponent.prototype.onChangePortfolio = function (PortfolioOption) {
        this.PortfolioOption = PortfolioOption;
        this.inputParams.PortfolioStatus = this.PortfolioOption;
    };
    AccountGroupSearchComponent.prototype.onkeyupBranch = function (BranchOption) {
        this.BranchOption = BranchOption;
        this.inputParams.BranchNumber = this.BranchOption;
    };
    AccountGroupSearchComponent.prototype.onkeyupgrpAcc = function (grpOption) {
        this.grpOption = grpOption;
        this.inputParams.GroupAccountNumber = this.grpOption;
        this.search.set('GroupAccountNumber', this.inputParams.GroupAccountNumber);
    };
    AccountGroupSearchComponent.prototype.onGridRowClick = function (data) {
        if (data.cellIndex === 1) {
            this.store.dispatch({
                type: ActionTypes.SAVE_ACCOUNT_ROW_DATA, payload: {
                    rowData: {
                        name: data.trRowData[4].text,
                        number: data.trRowData[1].text
                    }
                }
            });
            this._router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], { queryParams: { Mode: 'GeneralSearch', AccountRowID: data.cellData['rowID'] } });
        }
        else if (data.cellIndex === 3) {
            if (data.trRowData[2].text === 'C') {
                this._router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], {
                    queryParams: {
                        strMode: 'InvoiceDetail',
                        parentMode: 'InvoiceDetail',
                        ContractNumber: data.trRowData[3].text
                    }
                });
            }
            else if (data.trRowData[2].text === 'P') {
                this._router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], {
                    queryParams: {
                        strMode: 'InvoiceDetail',
                        parentMode: 'InvoiceDetail',
                        ContractNumber: data.trRowData[3].text
                    }
                });
            }
            else if (data.trRowData[2].text === 'J') {
                this._router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], {
                    queryParams: {
                        strMode: 'InvoiceDetail',
                        parentMode: 'InvoiceDetail',
                        ContractNumber: data.trRowData[3].text
                    }
                });
            }
        }
    };
    AccountGroupSearchComponent.prototype.updateView = function () {
        this.setInputParams();
        this.invoiceGrid.loadGridData(this.inputParams);
        this.AccSearchGroup.controls['GroupAccountNumber'].setValue(this.inputParams.GroupAccountNumber);
        this.AccSearchGroup.controls['GroupName'].setValue(this.inputParams.GroupName);
    };
    AccountGroupSearchComponent.prototype.setInputParams = function () {
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        this.search.set('action', this.inputParams.Action);
        this.search.set('GroupAccountNumber', this.inputParams.GroupAccountNumber);
        this.search.set('FilterBranch', this.inputParams.FilterBranch);
        this.search.set('PortfolioStatus', this.inputParams.PortfolioStatus);
        this.search.set('BranchNumber', '');
        if (this.inputParams.FilterBranch === 'Servicing' || this.inputParams.FilterBranch === 'Negotiating') {
            this.search.set('BranchNumber', this.inputParams.BranchNumber);
        }
        this.search.set('PageSize', this.itemsPerPage);
        this.search.set('PageCurrent', this.currentPage);
        this.search.set('HeaderClickedColumn', this.CurrentColumnName);
        this.search.set('riSortOrder', this.inputParams.riSortOrder);
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('riCacheRefresh', 'True');
        this.inputParams.search = this.search;
    };
    AccountGroupSearchComponent.prototype.refresh = function () {
        if (this.AccSearchGroup.valid === true) {
            this.setInputParams();
            this.AccSearchGroup.controls['GroupAccountNumber'].setValue(this.inputParams.GroupAccountNumber);
            this.invoiceGrid.loadGridData(this.inputParams);
        }
    };
    AccountGroupSearchComponent.prototype.setDefaultToolTipValueInGrid = function () {
        this.setTooltipInColumn(1, this.translatedMessageList.BranchNumber);
        this.setTooltipInColumn(2, this.translatedMessageList.AccountNumber);
        this.setTooltipInColumn(3, this.translatedMessageList.Type);
        this.setTooltipInColumn(4, this.translatedMessageList.ContractNumber);
        this.setTooltipInColumn(5, this.translatedMessageList.CustomerName);
        this.setTooltipInColumn(6, this.translatedMessageList.CommenceDate);
        this.setTooltipInColumn(7, this.translatedMessageList.Status);
        this.setTooltipInColumn(8, this.translatedMessageList.ExpiryDate);
        this.setTooltipInColumn(9, this.translatedMessageList.AddressLine1);
    };
    AccountGroupSearchComponent.prototype.setTooltipInColumn = function (colIndex, toolTipText) {
        if (colIndex) {
            var query = '.gridtable tbody > tr > td:nth-child(' + colIndex + ')';
            var objList = document.querySelectorAll(query);
            if (objList) {
                for (var i = 0; i < objList.length; i++) {
                    if (objList[i]) {
                        var tooltip = objList[i].getAttribute('title');
                        if (typeof (tooltip) === 'undefined' || tooltip === '' && toolTipText) {
                            objList[i].setAttribute('title', toolTipText);
                        }
                    }
                }
            }
        }
    };
    AccountGroupSearchComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-account-group-search',
                    templateUrl: 'iCABSAAccountGroupSearch.html'
                },] },
    ];
    AccountGroupSearchComponent.ctorParameters = [
        { type: Logger, },
        { type: ServiceConstants, },
        { type: FormBuilder, },
        { type: Router, },
        { type: Utils, },
        { type: Store, },
        { type: ActivatedRoute, },
        { type: RiExchange, },
        { type: TranslateService, },
        { type: NgZone, },
        { type: LocaleTranslationService, },
    ];
    AccountGroupSearchComponent.propDecorators = {
        'invoiceGrid': [{ type: ViewChild, args: ['invoiceGrid',] },],
        'invoicePagination': [{ type: ViewChild, args: ['invoicePagination',] },],
    };
    return AccountGroupSearchComponent;
}());
