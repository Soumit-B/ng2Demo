var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, ViewChild, Injector } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { GlobalConstant } from './../../../shared/constants/global.constant';
export var RiRegistryComponent = (function (_super) {
    __extends(RiRegistryComponent, _super);
    function RiRegistryComponent(injector, titleService) {
        _super.call(this, injector);
        this.titleService = titleService;
        this.method = 'it-functions/ri-model';
        this.module = 'configuration';
        this.operation = 'Model/riRegistry';
        this.search = new URLSearchParams();
        this.queryPost = {
            operation: 'Model/riRegistry',
            module: 'configuration',
            method: 'it-functions/ri-model',
            contentType: 'application/x-www-form-urlencoded'
        };
        this.itemsPerPage = 10;
        this.pageSize = 10;
        this.currentPage = 1;
        this.paginationCurrentPage = 1;
        this.maxColumns = 2;
        this.controls = [];
        this.pageId = PageIdentifier.RIREGISTRY;
        this.dataToGrid = [
            {
                colNumber: 0,
                type: 'text',
                editable: false
            },
            {
                colNumber: 1,
                type: 'text',
                editable: true
            }
        ];
    }
    RiRegistryComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.inputParams = {
            'parentMode': 'LookUp'
        };
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
            }
        });
        this.activatedRoute.params.subscribe(function (param) {
            if (param) {
                _this.currentPage = 1;
                _this.paginationCurrentPage = 1;
                _this.riExchange.setRouterUrlParams(param);
                _this.updateView();
            }
        });
    };
    RiRegistryComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    RiRegistryComponent.prototype.getCurrentPage = function (event) {
        this.currentPage = event.value;
        this.refresh();
    };
    RiRegistryComponent.prototype.getGridInfo = function (info) {
        var _this = this;
        this.totalRecords = info.totalRows;
        setTimeout(function () {
            _this.paginationCurrentPage = _this.currentPage;
        }, 0);
    };
    RiRegistryComponent.prototype.onGridRowClick = function (data) {
    };
    RiRegistryComponent.prototype.updateView = function () {
        var urlParams = this.riExchange.getRouterUrlParams();
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set('RegSection', urlParams['section']);
        this.search.set('riSortOrder', 'Descending');
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('PageSize', this.pageSize.toString());
        this.search.set('PageCurrent', this.currentPage.toString());
        this.inputParams.search = this.search;
        this.riRegistryGrid.loadGridData(this.inputParams);
    };
    RiRegistryComponent.prototype.postData = function (data) {
        var _this = this;
        var urlParams = this.riExchange.getRouterUrlParams();
        var queryPost = new URLSearchParams();
        queryPost.set(this.serviceConstants.BusinessCode, this.businessCode());
        queryPost.set(this.serviceConstants.CountryCode, this.countryCode());
        queryPost.set(this.serviceConstants.Action, '2');
        queryPost.set('riSortOrder', 'Descending');
        queryPost.set('riGridMode', '3');
        queryPost.set('RegSection', urlParams['section']);
        queryPost.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        queryPost.set('HeaderClickedColumn', 'Descending');
        this.httpService.makePostRequest(this.queryPost.method, this.queryPost.module, this.queryPost.operation, queryPost, data).subscribe(function (e) {
            if (e.status === GlobalConstant.Configuration.Failure) {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e['errorMessage']) {
                    _this.errorService.emitError(e);
                    return;
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    RiRegistryComponent.prototype.getCellDataonBlur = function (event) {
        var defaultData = {
            RegKeyRowID: event.completeRowData[0].rowID,
            RegKey: event.completeRowData[0].text,
            RegValueRowID: event.completeRowData[1].rowID,
            RegValue: event.completeRowData[1].text
        };
        if (event.cellIndex === 0) {
            defaultData.RegKey = event.keyCode.target.value;
        }
        else {
            defaultData.RegValue = event.keyCode.target.value;
        }
        this.postData(defaultData);
    };
    RiRegistryComponent.prototype.refresh = function () {
        this.updateView();
    };
    RiRegistryComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('Registry', null).subscribe(function (res) {
            if (res) {
                _this.titleService.setTitle(res);
            }
            else {
                _this.titleService.setTitle('Registry');
            }
        });
    };
    RiRegistryComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'riRegistry.html'
                },] },
    ];
    RiRegistryComponent.ctorParameters = [
        { type: Injector, },
        { type: Title, },
    ];
    RiRegistryComponent.propDecorators = {
        'riRegistryGrid': [{ type: ViewChild, args: ['riRegistryGrid',] },],
    };
    return RiRegistryComponent;
}(BaseComponent));
