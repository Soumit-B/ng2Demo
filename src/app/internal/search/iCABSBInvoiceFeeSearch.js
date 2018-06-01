import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { Logger } from '@nsalaun/ng2-logger';
import { Component, ViewChild, NgZone } from '@angular/core';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpService } from './../../../shared/services/http-service';
import { AuthService } from '../../../shared/services/auth.service';
import { Utils } from '../../../shared/services/utility';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ErrorService } from '../../../shared/services/error.service';
import { Store } from '@ngrx/store';
export var InvoiceFeeSearchComponent = (function () {
    function InvoiceFeeSearchComponent(httpService, serviceConstants, authService, ajaxconstant, ellipsis, zone, store, errorService, utils, logger, sysCharConstants) {
        var _this = this;
        this.httpService = httpService;
        this.serviceConstants = serviceConstants;
        this.authService = authService;
        this.ajaxconstant = ajaxconstant;
        this.ellipsis = ellipsis;
        this.zone = zone;
        this.store = store;
        this.errorService = errorService;
        this.utils = utils;
        this.logger = logger;
        this.sysCharConstants = sysCharConstants;
        this.inputParamsInvoiceFees = {
            method: 'bill-to-cash/search',
            module: 'charges',
            operation: 'Business/iCABSBInvoiceFeeSearch',
            parentMode: '',
            search: {}
        };
        this.search = new URLSearchParams();
        this.ajaxSource = new BehaviorSubject(0);
        this.isRequesting = false;
        this.pageParams = {};
        this.columns = [];
        this.inputParams = {};
        this.itemsPerPage = 10;
        this.page = 1;
        this.rowmetadata = [{ name: 'InvoiceFeeDefaultInd', type: 'img' }];
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            if (data !== null && data['data'] &&
                !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                _this.contractStoreData = data['data'];
            }
        });
    }
    InvoiceFeeSearchComponent.prototype.GetInvoiceFeeIsPercentage = function () {
        var _this = this;
        var sysCharInvoiceFeeIsPercentage = this.sysCharConstants.SystemCharInvoiceFeeIsPercentage;
        var syscharMethod = 'settings/data';
        var search = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set('systemCharNumber', JSON.stringify(sysCharInvoiceFeeIsPercentage));
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        console.log(search);
        this.httpService.sysCharRequest(search)
            .subscribe(function (e) {
            if (e) {
                if (e.records) {
                    if (e.records.length > 0) {
                        _this.vSCInvoiceFeeIsPercentage = e.records[0].Required;
                        _this.pageParams['speedscript'] = _this.vSCInvoiceFeeIsPercentage;
                        _this.columns = [
                            { title: 'Code', name: 'InvoiceFeeCode', sort: 'asc' },
                            { title: 'Description', name: 'InvoiceFeeDesc' },
                            { title: _this.vSCInvoiceFeeIsPercentage ? 'Percentage' : 'Value', name: _this.vSCInvoiceFeeIsPercentage ? 'InvoiceFeePercentage' : 'InvoiceFeeValue' },
                            { title: 'Default', name: 'InvoiceFeeDefaultInd' }];
                        _this.refreshPage();
                    }
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    InvoiceFeeSearchComponent.prototype.selectedData = function (event) {
        var returnObj;
        if (this.inputParamsInvoiceFees.parentMode === 'LookUp') {
            returnObj = {
                'InvoiceFeeCode': event.row.InvoiceFeeCode,
                'InvoiceFeeDesc': event.row.InvoiceFeeDesc
            };
        }
        else {
            returnObj = {
                'InvoiceFeeCode': event.row.InvoiceFeeCode,
                'InvoiceFeeDesc': event.row.InvoiceFeeDesc
            };
        }
        this.ellipsis.sendDataToParent(returnObj);
    };
    InvoiceFeeSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
    };
    InvoiceFeeSearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.search.set(this.serviceConstants.Action, '0');
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
        this.GetInvoiceFeeIsPercentage();
        this.updateView();
    };
    InvoiceFeeSearchComponent.prototype.updateView = function () {
        this.refreshPage();
    };
    InvoiceFeeSearchComponent.prototype.refreshPage = function () {
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.inputParamsInvoiceFees.search = this.search;
        this.invoiceFee.loadTableData(this.inputParamsInvoiceFees);
    };
    InvoiceFeeSearchComponent.prototype.refresh = function () {
        this.refreshPage();
    };
    InvoiceFeeSearchComponent.prototype.ngOnDestroy = function () {
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
    };
    InvoiceFeeSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBInvoiceFeeSearch.html'
                },] },
    ];
    InvoiceFeeSearchComponent.ctorParameters = [
        { type: HttpService, },
        { type: ServiceConstants, },
        { type: AuthService, },
        { type: AjaxObservableConstant, },
        { type: EllipsisComponent, },
        { type: NgZone, },
        { type: Store, },
        { type: ErrorService, },
        { type: Utils, },
        { type: Logger, },
        { type: SysCharConstants, },
    ];
    InvoiceFeeSearchComponent.propDecorators = {
        'invoiceFee': [{ type: ViewChild, args: ['invoiceFee',] },],
    };
    return InvoiceFeeSearchComponent;
}());
