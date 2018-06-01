var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Input, EventEmitter, ViewChild, Output, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
export var MaritalStatusSearchComponent = (function (_super) {
    __extends(MaritalStatusSearchComponent, _super);
    function MaritalStatusSearchComponent(injector) {
        _super.call(this, injector);
        this.receivedMaritalSearch = new EventEmitter();
        this.queryParams = {
            operation: 'System/iCABSSMaritalStatusSearch',
            module: 'employee',
            method: 'people/search'
        };
        this.displayFields = ['MaritalStatusCode', 'MaritalStatusDesc'];
        this.pageId = '';
        this.controls = [];
        this.search = new URLSearchParams();
        this.pageId = PageIdentifier.ICABSSMARITALSTATUSSEARCH;
    }
    MaritalStatusSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Marital Status Search';
        this.fetchMaritalStatusData();
    };
    MaritalStatusSearchComponent.prototype.ngOnChanges = function (data) {
        if (data.queryParams) {
            this.fetchMaritalStatusData();
        }
    };
    MaritalStatusSearchComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    MaritalStatusSearchComponent.prototype.fetchMaritalStatusData = function () {
        var _this = this;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.queryParams.search = this.search;
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryParams.search)
            .subscribe(function (data) {
            _this.requestdata = data.records;
            _this.MaritalStatusSearchDropDown.updateComponent(_this.requestdata);
        }, function (error) {
            _this.errorMessage = error;
        });
    };
    MaritalStatusSearchComponent.prototype.onMaritalSearch = function (obj) {
        var maritalCode = obj.value.MaritalStatusCode;
        var maritalDesc = obj.value.MaritalStatusDesc;
        var returnObj;
        if (this.queryParams.parentMode === 'LookUp') {
            returnObj = {
                'MaritalStatusCode': maritalCode,
                'MaritalStatusDesc': maritalDesc
            };
        }
        else {
            returnObj = {
                'MaritalStatusCode': maritalCode,
                'Object': obj.value
            };
        }
        this.receivedMaritalSearch.emit(returnObj);
    };
    MaritalStatusSearchComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-marital-search',
                    template: "<icabs-dropdown #MaritalStatusSearchDropDown [itemsToDisplay]=\"displayFields\" [disabled]=\"isDisabled\" [isRequired]=\"isRequired\" [active]=\"active\" (selectedValue)=\"onMaritalSearch($event)\">\n  </icabs-dropdown>"
                },] },
    ];
    MaritalStatusSearchComponent.ctorParameters = [
        { type: Injector, },
    ];
    MaritalStatusSearchComponent.propDecorators = {
        'MaritalStatusSearchDropDown': [{ type: ViewChild, args: ['MaritalStatusSearchDropDown',] },],
        'inputParams': [{ type: Input },],
        'isDisabled': [{ type: Input },],
        'active': [{ type: Input },],
        'isRequired': [{ type: Input },],
        'receivedMaritalSearch': [{ type: Output },],
    };
    return MaritalStatusSearchComponent;
}(BaseComponent));
