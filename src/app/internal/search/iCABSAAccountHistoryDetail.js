import { ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Logger } from '@nsalaun/ng2-logger';
import { HttpService } from './../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Component } from '@angular/core';
import { Utils } from '../../../shared/services/utility';
export var AccountHistoryDetailComponent = (function () {
    function AccountHistoryDetailComponent(route, serviceConstants, _httpService, utils, _logger) {
        this.route = route;
        this.serviceConstants = serviceConstants;
        this._httpService = _httpService;
        this.utils = utils;
        this._logger = _logger;
        this.search = new URLSearchParams();
        this.accountHistoryNarrative = '';
        this.accountName = '';
        this.invoiceGroupDesc = '';
        this.invoiceGroupNumber = '';
        this.queryLookUp = new URLSearchParams();
        this.rowID = '';
        this.isRequesting = false;
    }
    AccountHistoryDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._logger.log('Inside: AccountHistoryDetail');
        this.sub = this.route.queryParams.subscribe(function (params) {
            _this.routeParams = params;
            _this.accountNumber = _this.routeParams.accountNumber;
            _this.accountHistoryNumber = '';
            _this.invoiceGroupNumber = _this.routeParams.invoiceGroupNumber;
            _this.rowID = _this.routeParams.rowID;
            _this.invoiceGroupDesc = _this.routeParams.invoiceGroupDesc;
            _this.updateView();
        });
    };
    AccountHistoryDetailComponent.prototype.ngOnDestroy = function () {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    };
    AccountHistoryDetailComponent.prototype.updateView = function () {
        var xhrParams = {};
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('AccountNumber', this.accountNumber);
        this.search.set('rowID', this.rowID);
        xhrParams = {
            module: 'account',
            method: 'contract-management/maintenance',
            operation: 'Application/iCABSAAccountHistoryDetail',
            search: this.search
        };
        this.getData(xhrParams);
    };
    AccountHistoryDetailComponent.prototype.getData = function (xhrParams) {
        var _this = this;
        this.isRequesting = true;
        this._httpService.makeGetRequest(xhrParams.method, xhrParams.module, xhrParams.operation, xhrParams.search).subscribe(function (data) {
            _this.isRequesting = false;
            _this.accountHistoryNarrative = data.AccountHistoryNarrative;
            _this.accountNumber = data.AccountNumber;
            _this.accountHistoryNumber = data.AccountHistoryNumber;
            _this.invoiceGroupNumber = data.InvoiceGroupNumber;
            if (data.InvoiceGroupDesc)
                _this.invoiceGroupDesc = data.InvoiceGroupDesc;
            else
                _this.invoiceGroupDesc = '';
            var dataLookup = [{
                    'table': 'Account',
                    'query': { 'AccountNumber': _this.accountNumber, 'BusinessCode': _this.utils.getBusinessCode() },
                    'fields': ['AccountNumber', 'AccountName']
                }];
            _this.lookUpRecord(JSON.parse(JSON.stringify(dataLookup)), 5).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                    _this.accountName = e['results'][0][0].AccountName;
                }
                else {
                    _this.accountName = '';
                }
            }, function (error) {
                _this.accountName = '';
            });
        }, function (error) {
            _this.errorMessage = error;
        });
    };
    AccountHistoryDetailComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this._httpService.lookUpRequest(this.queryLookUp, data);
    };
    AccountHistoryDetailComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAAccountHistoryDetail.html'
                },] },
    ];
    AccountHistoryDetailComponent.ctorParameters = [
        { type: ActivatedRoute, },
        { type: ServiceConstants, },
        { type: HttpService, },
        { type: Utils, },
        { type: Logger, },
    ];
    return AccountHistoryDetailComponent;
}());
