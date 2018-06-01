var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { Component, Input, EventEmitter, ViewChild, Output, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
export var LogoTypeSearchComponent = (function (_super) {
    __extends(LogoTypeSearchComponent, _super);
    function LogoTypeSearchComponent(injector) {
        _super.call(this, injector);
        this.method = 'bill-to-cash/search';
        this.module = 'invoicing';
        this.operation = 'Business/iCABSBLogoTypeSearch';
        this.search = new URLSearchParams();
        this.displayFields = ['LogoTypeCode', 'LogoTypeDesc'];
        this.receivedlogotypesearch = new EventEmitter();
        this.pageId = '';
        this.controls = [];
        this.pageId = PageIdentifier.ICABSBLOGOTYPESEARCH;
    }
    LogoTypeSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Logo Type Search';
        this.fetchLogoTypeData();
    };
    LogoTypeSearchComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    LogoTypeSearchComponent.prototype.ngOnChanges = function (data) {
        if (data.inputParams) {
            this.fetchLogoTypeData();
        }
    };
    LogoTypeSearchComponent.prototype.fetchLogoTypeData = function () {
        var _this = this;
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode ? this.inputParams.businessCode : this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode ? this.inputParams.countryCode : this.utils.getCountryCode());
        this.inputParams.search = this.search;
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.inputParams.search)
            .subscribe(function (data) {
            _this.requestdata = data.records;
            _this.logoTypeSearchDropDown.updateComponent(_this.requestdata);
        }, function (error) {
            _this.errorMessage = error;
        });
    };
    LogoTypeSearchComponent.prototype.onLogoTypeSearch = function (obj) {
        var code = obj.value.LogoTypeCode;
        var desc = obj.value.LogoTypeDesc;
        var returnObj;
        switch (this.inputParams.parentMode) {
            case 'LookUp-LogoType':
                returnObj = {
                    'LogoTypeCode': code,
                    'LogoTypeDesc': desc
                };
                break;
            default:
                returnObj = {
                    'LogoTypeCode': code,
                    'LogoTypeDesc': desc
                };
        }
        this.receivedlogotypesearch.emit(returnObj);
    };
    LogoTypeSearchComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-logotype-search',
                    template: "<icabs-dropdown #logoTypeSearchDropDown\n  [itemsToDisplay]=\"displayFields\" [disabled]=\"isDisabled\" [isRequired]=\"isRequired\" [active]=\"active\" (selectedValue)=\"onLogoTypeSearch($event)\">\n  </icabs-dropdown>"
                },] },
    ];
    LogoTypeSearchComponent.ctorParameters = [
        { type: Injector, },
    ];
    LogoTypeSearchComponent.propDecorators = {
        'logoTypeSearchDropDown': [{ type: ViewChild, args: ['logoTypeSearchDropDown',] },],
        'inputParams': [{ type: Input },],
        'isDisabled': [{ type: Input },],
        'active': [{ type: Input },],
        'isRequired': [{ type: Input },],
        'receivedlogotypesearch': [{ type: Output },],
    };
    return LogoTypeSearchComponent;
}(BaseComponent));
