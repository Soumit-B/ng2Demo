var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { HttpService } from '../../../shared/services/http-service';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
export var DeportSearchComponent = (function (_super) {
    __extends(DeportSearchComponent, _super);
    function DeportSearchComponent(injector, _httpService, ellipsis) {
        _super.call(this, injector);
        this._httpService = _httpService;
        this.ellipsis = ellipsis;
        this.pageId = '';
        this.controls = [];
        this.method = 'service-delivery/search';
        this.module = 'depot';
        this.operation = 'Business/iCABSBDepotSearch';
        this.inputParams = {};
        this.itemsPerPage = 13;
        this.page = 1;
        this.pageTitle = 'Depot Search';
        this.columns = [
            { title: 'Depot Number', name: 'DepotNumber', className: ['col4', 'center'] },
            { title: 'Depot Name', name: 'DepotName', className: ['col12', 'center'] }
        ];
        this.tableheading = 'Depot Search';
        this.pageId = PageIdentifier.ICABSBDEPOTSEARCH;
    }
    DeportSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Depot Search';
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;
    };
    DeportSearchComponent.prototype.getTableDepot = function () {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.inputParams.search = this.search;
        this.DepotTable.loadTableData(this.inputParams);
    };
    DeportSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
    };
    DeportSearchComponent.prototype.selectedData = function (event) {
        var returnObj;
        var DepotNumber = event.row.DepotNumber;
        var Depotname = event.row.DepotName;
        switch (this.ellipsis.childConfigParams['parentMode']) {
            case 'LookUp':
                returnObj = {
                    'DepotNumber': event.row.DepotNumber,
                    'DepotName': event.row.DepotName
                };
                break;
            default:
                returnObj = {
                    'DepotNumber': event.row.DepotNumber
                };
                break;
        }
        this.ellipsis.sendDataToParent(returnObj);
    };
    DeportSearchComponent.prototype.onSearchClick = function () {
        this.getTableDepot();
    };
    DeportSearchComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    DeportSearchComponent.prototype.updateView = function (params) {
        this.getTableDepot();
    };
    DeportSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBDepotSearch.html'
                },] },
    ];
    DeportSearchComponent.ctorParameters = [
        { type: Injector, },
        { type: HttpService, },
        { type: EllipsisComponent, },
    ];
    DeportSearchComponent.propDecorators = {
        'DepotTable': [{ type: ViewChild, args: ['DepotTable',] },],
    };
    return DeportSearchComponent;
}(BaseComponent));
