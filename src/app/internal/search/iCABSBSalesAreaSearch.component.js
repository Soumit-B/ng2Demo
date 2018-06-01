import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { Component, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Utils } from '../../../shared/services/utility';
import { TranslateService } from 'ng2-translate';
import { Logger } from '@nsalaun/ng2-logger';
export var SalesAreaSearchComponent = (function () {
    function SalesAreaSearchComponent(serviceConstants, ellipsis, router, localeTranslateService, route, utils, translate, logger) {
        this.serviceConstants = serviceConstants;
        this.ellipsis = ellipsis;
        this.router = router;
        this.localeTranslateService = localeTranslateService;
        this.route = route;
        this.utils = utils;
        this.translate = translate;
        this.logger = logger;
        this.method = 'contract-management/search';
        this.module = 'contract-admin';
        this.operation = 'Business/iCABSBSalesAreaSearch';
        this.search = new URLSearchParams();
        this.itemsPerPage = 10;
        this.page = 1;
        this.totalItem = 11;
        this.columns = new Array();
        this.rowmetadata = new Array();
    }
    SalesAreaSearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.queryParams.subscribe(function (params) {
            _this.routeParams = params;
        });
        this.inputParams = {
            'parentMode': 'Search',
            'ServiceBranchNumber': this.utils.getBranchCode(),
            'SalesBranchNumber': this.utils.getBranchCode()
        };
        this.localeTranslateService.setUpTranslation();
    };
    SalesAreaSearchComponent.prototype.createPage = function (pageparentmode) {
        this.buildTableColumns();
        switch (pageparentmode) {
            case 'LookUp-Premise':
            case 'LookUp-Postcode':
                this.search.set('BranchNumber', this.inputParams.ServiceBranchNumber);
                break;
            case 'ContractJobReport':
                this.search.set('BranchNumber', this.inputParams.SalesBranchNumber);
                break;
            default:
                this.search.set('BranchNumber', this.utils.getBranchCode());
                break;
        }
    };
    SalesAreaSearchComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    SalesAreaSearchComponent.prototype.buildTableColumns = function () {
        var _this = this;
        this.getTranslatedValue('Code', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'SalesAreaCode' });
            }
            else {
                _this.columns.push({ title: 'Code', name: 'SalesAreaCode', sort: 'ASC' });
            }
        });
        this.getTranslatedValue('Description', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'SalesAreaDesc' });
            }
            else {
                _this.columns.push({ title: 'Description', name: 'SalesAreaDesc' });
            }
        });
        if (this.inputParams.parentMode !== 'LookUp-All' && this.inputParams.parentMode !== 'Search') {
            this.search.set('LiveSalesArea', 'True');
        }
        if (this.inputParams.parentMode === 'LookUp-All' || this.inputParams.parentMode === 'Search') {
            this.getTranslatedValue('Live Area', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'LiveSalesArea' });
                    _this.rowmetadata.push({ title: res, name: 'LiveSalesArea', type: 'img' });
                }
                else {
                    _this.columns.push({ title: 'Live Area', name: 'LiveSalesArea' });
                    _this.rowmetadata.push({ title: 'Live Area', name: 'LiveSalesArea', type: 'img' });
                }
            });
        }
        if (this.inputParams.parentMode === 'LookUp-Premise') {
            this.getTranslatedValue('Employee', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'EmployeeCode' });
                }
                else {
                    _this.columns.push({ title: 'Employee', name: 'EmployeeCode' });
                }
            });
            this.getTranslatedValue('Surname', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'EmployeeSurname' });
                }
                else {
                    _this.columns.push({ title: 'Surname', name: 'EmployeeSurname' });
                }
            });
        }
        this.inputParams.columns = [];
        this.inputParams.columns = this.columns;
        this.inputParams.rowmetadata = [];
        this.inputParams.rowmetadata = this.rowmetadata;
    };
    SalesAreaSearchComponent.prototype.selectedData = function (event) {
        var returnObj;
        if (this.inputParams.parentMode === 'LookUp-Premise') {
            returnObj = {
                'EmployeeCode': event.row.EmployeeCode,
                'EmployeeSurname': event.row.EmployeeSurname
            };
        }
        if (this.inputParams.parentMode === 'LookUp' || this.inputParams.parentMode === 'LookUp-Postcode') {
            returnObj = {
                'SalesAreaCode': event.row.SalesAreaCode,
                'SalesAreaDesc': event.row.SalesAreaDesc
            };
        }
        if (this.inputParams.parentMode === 'LookUp-To') {
            returnObj = {
                'SalesAreaCodeTo': event.row.SalesAreaCode,
                'SalesAreaDescTo': event.row.SalesAreaDesc
            };
        }
        if (this.inputParams.parentMode === 'LookUp-Premise') {
            returnObj = {
                'SalesAreaCode': event.row.SalesAreaCode,
                'SalesAreaDesc': event.row.SalesAreaDesc,
                'PremiseSalesEmployee': event.row.EmployeeCode,
                'SalesEmployeeSurname': event.row.EmployeeSurname
            };
        }
        else {
            returnObj = {
                'SalesAreaCode': event.row.SalesAreaCode,
                'SalesAreaDesc': event.row.SalesAreaDesc
            };
        }
        this.ellipsis.sendDataToParent(returnObj);
    };
    SalesAreaSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
    };
    SalesAreaSearchComponent.prototype.updateView = function (params) {
        this.inputParams = params || this.inputParams;
        if (!params) {
            params = this.inputParams;
        }
        this.createPage(this.inputParams.parentMode);
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.inputParams.search = this.search;
        this.salesAreaSearchTable.loadTableData(this.inputParams);
    };
    SalesAreaSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBSalesAreaSearch.html'
                },] },
    ];
    SalesAreaSearchComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: EllipsisComponent, },
        { type: Router, },
        { type: LocaleTranslationService, },
        { type: ActivatedRoute, },
        { type: Utils, },
        { type: TranslateService, },
        { type: Logger, },
    ];
    SalesAreaSearchComponent.propDecorators = {
        'salesAreaSearchTable': [{ type: ViewChild, args: ['salesAreaSearchTable',] },],
        'inputParams': [{ type: Input },],
    };
    return SalesAreaSearchComponent;
}());
