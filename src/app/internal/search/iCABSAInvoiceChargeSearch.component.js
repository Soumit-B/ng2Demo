import { Logger } from '@nsalaun/ng2-logger';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Utils } from './../../../shared/services/utility';
import { URLSearchParams } from '@angular/http';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { TranslateService } from 'ng2-translate';
export var InvoiceChargeSearchComponent = (function () {
    function InvoiceChargeSearchComponent(serviceConstants, fb, _router, localeTranslateService, utils, logger, route, translate) {
        var _this = this;
        this.serviceConstants = serviceConstants;
        this.fb = fb;
        this._router = _router;
        this.localeTranslateService = localeTranslateService;
        this.utils = utils;
        this.logger = logger;
        this.route = route;
        this.translate = translate;
        this.method = 'contract-management/search';
        this.module = 'contract-admin';
        this.operation = 'Application/iCABSAInvoiceChargeSearch';
        this.search = new URLSearchParams();
        this.ContractTypeDescription = 'Contract';
        this.ExchangeMode = this.ContractTypeDescription + '-Add';
        this.itemsPerPage = 10;
        this.page = 1;
        this.totalItem = 11;
        this.ContractNumber = '';
        this.ContractName = '';
        this.PremiseNumber = '';
        this.PremiseName = '';
        this.inputParams = { 'parentMode': '', action: 0 };
        this.columns = [
            { title: 'Invoice Charge', name: 'InvoiceChargeLocalDesc', sort: 'ASC' },
            { title: 'Description', name: 'InvoiceChargeDesc' },
            { title: 'Value', name: 'InvoiceChargeValue' }
        ];
        this.querySubscription = this.route.queryParams.subscribe(function (params) {
            _this.currentRouteParams = params;
            if (params['ContractNumber']) {
                _this.ContractNumber = params['ContractNumber'];
            }
            if (params['ContractName']) {
                _this.ContractName = params['ContractName'];
            }
            if (params['parentMode']) {
                _this.ContractTypeDescription = params['parentMode'];
                _this.inputParams['parentMode'] = params['parentMode'];
            }
            if (params['PremiseNumber']) {
                _this.PremiseNumber = params['PremiseNumber'];
            }
            if (params['PremiseName']) {
                _this.PremiseName = params['PremiseName'];
            }
        });
    }
    ;
    InvoiceChargeSearchComponent.prototype.ngOnInit = function () {
        this.localeTranslateService.setUpTranslation();
        this.createPage(this.ContractTypeDescription);
        this.updateView(this.inputParams);
        if (this.columns) {
            var _loop_1 = function(column) {
                if (column) {
                    var obj_1 = this_1.columns[column];
                    this_1.getTranslatedValue(obj_1.title, null).then(function (res) {
                        if (res) {
                            obj_1.title = res;
                        }
                    });
                }
            };
            var this_1 = this;
            for (var column in this.columns) {
                _loop_1(column);
            }
        }
    };
    InvoiceChargeSearchComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params }).toPromise();
        }
        else {
            return this.translate.get(key).toPromise();
        }
    };
    InvoiceChargeSearchComponent.prototype.selectedData = function (event) {
        var returnObj;
        this.ContractTypeCode = this.utils.getCurrentContractType(this.currentRouteParams['currentContractTypeURLParameter'] || '');
        this.ContractInvoiceChargeRowId = event.rowid;
        console.log('row', event);
        this.logger.warn(this.ContractTypeDescription + '`' + this.ContractTypeCode);
        if (this.ContractTypeDescription === 'Contract' || this.ContractTypeDescription === 'Contract-Search') {
            if (this.ContractTypeCode === 'C') {
                returnObj = {
                    'CurrentContractTypeURLParameter': ''
                };
            }
            if (this.ContractTypeCode === 'P') {
                returnObj = {
                    'CurrentContractTypeURLParameter': 'product'
                };
            }
            if (this.ContractTypeCode === 'J') {
                returnObj = {
                    'CurrentContractTypeURLParameter': 'Job'
                };
            }
        }
        else if (this.ContractTypeDescription === 'Premise' || this.ContractTypeDescription === 'Premise-Search') {
            if (this.ContractTypeCode === 'C') {
                returnObj = {
                    'CurrentContractTypeURLParameter': ' '
                };
            }
            if (this.ContractTypeCode === 'P') {
                returnObj = {
                    'CurrentContractTypeURLParameter': 'product'
                };
            }
            if (this.ContractTypeCode === 'J') {
                returnObj = {
                    'CurrentContractTypeURLParameter': 'Job'
                };
            }
        }
        else {
            this.ContractInvoiceChargeRowId = event.rowid;
            returnObj = {
                'CurrentContractTypeURLParameter': event.row
            };
        }
        this._router.navigate(['maintenance/invoiceChargeMaintenance'], {
            queryParams: {
                parentMode: this.inputParams['parentMode'],
                ContractNumber: this.ContractNumber,
                ContractName: this.ContractName,
                PremiseNumber: this.PremiseNumber,
                PremiseName: this.PremiseName,
                CurrentContractTypeURLParameter: returnObj.currentContractTypeURLParameter,
                ContractInvoiceCharge: event.row.ttContractInvoiceCharge,
                ContractInvoiceChargeNumber: event.row.ContractInvoiceChargeNumber
            }
        });
    };
    InvoiceChargeSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
    };
    InvoiceChargeSearchComponent.prototype.createPage = function (pageparentmode) {
        this.ContractTypeCode = this.utils.getCurrentContractType(this.currentRouteParams['currentContractTypeURLParameter'] || '');
        switch (pageparentmode) {
            case 'Premise':
            case 'Premise-Search':
                this.invoiceChargeFormGroup = this.fb.group({
                    ContractNumber: [this.ContractNumber],
                    ContractName: [this.ContractName],
                    PremiseNumber: [this.PremiseNumber],
                    PremiseName: [this.PremiseName]
                });
                this.search.set('PremiseNumber', this.PremiseNumber);
                break;
            case 'Contract':
            case 'Contract-Search':
                this.invoiceChargeFormGroup = this.fb.group({
                    ContractNumber: [this.ContractNumber],
                    ContractName: [this.ContractName],
                    PremiseNumber: [this.PremiseNumber],
                    PremiseName: [this.PremiseName]
                });
                this.search.set('ContractNumber', this.ContractNumber);
                break;
            default:
                this.invoiceChargeFormGroup = this.fb.group({
                    ContractNumber: [''],
                    ContractName: [''],
                    PremiseNumber: [''],
                    PremiseName: ['']
                });
        }
    };
    InvoiceChargeSearchComponent.prototype.updateView = function (params) {
        this.inputParams = params;
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('ContractNumber', this.ContractNumber);
        this.search.set('PremiseNumber', this.PremiseNumber);
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.inputParams.search = this.search;
        this.searchTable.loadTableData(this.inputParams);
    };
    InvoiceChargeSearchComponent.prototype.onChangeEvent = function (event) {
        this._router.navigate(['maintenance/invoiceChargeMaintenance'], {
            queryParams: {
                parentMode: this.inputParams['parentMode'] + '-Add',
                ContractNumber: this.ContractNumber,
                ContractName: this.ContractName,
                PremiseNumber: this.PremiseNumber,
                PremiseName: this.PremiseName,
                CurrentContractTypeURLParameter: this.currentRouteParams['currentContractTypeURLParameter']
            }
        });
    };
    InvoiceChargeSearchComponent.prototype.refresh = function () {
        this.searchTable.loadTableData(this.inputParams);
    };
    InvoiceChargeSearchComponent.prototype.ngOnDestroy = function () {
        if (this.querySubscription)
            this.querySubscription.unsubscribe();
    };
    InvoiceChargeSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAInvoiceChargeSearch.html'
                },] },
    ];
    InvoiceChargeSearchComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: FormBuilder, },
        { type: Router, },
        { type: LocaleTranslationService, },
        { type: Utils, },
        { type: Logger, },
        { type: ActivatedRoute, },
        { type: TranslateService, },
    ];
    InvoiceChargeSearchComponent.propDecorators = {
        'searchTable': [{ type: ViewChild, args: ['chargeSearchTable',] },],
    };
    return InvoiceChargeSearchComponent;
}());
