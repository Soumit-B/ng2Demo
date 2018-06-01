var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { Component, Input, EventEmitter, ViewChild, Output, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
export var GenderSearchComponent = (function (_super) {
    __extends(GenderSearchComponent, _super);
    function GenderSearchComponent(injector) {
        _super.call(this, injector);
        this.method = 'people/search';
        this.module = 'employee';
        this.operation = 'System/iCABSSGenderSearch';
        this.search = new URLSearchParams();
        this.displayFields = ['GenderCode', 'GenderDesc'];
        this.receivedgendersearch = new EventEmitter();
        this.pageId = '';
        this.controls = [];
        this.pageId = PageIdentifier.ICABSSGENDERSEARCH;
    }
    GenderSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Gender Search';
        this.fetchGenderData();
    };
    GenderSearchComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    GenderSearchComponent.prototype.ngOnChanges = function (data) {
        if (data.inputParams) {
            this.fetchGenderData();
        }
    };
    GenderSearchComponent.prototype.fetchGenderData = function () {
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
            _this.GenderSearchDropDown.updateComponent(_this.requestdata);
        }, function (error) {
            _this.errorMessage = error;
        });
    };
    GenderSearchComponent.prototype.onGenderSearch = function (obj) {
        var Gcode = obj.value.GenderCode;
        var Gdesc = obj.value.GenderDesc;
        var returnObj;
        if (this.inputParams.parentMode === 'LookUp') {
            returnObj = {
                'GenderCode': Gcode,
                'GenderDesc': Gdesc
            };
        }
        else {
            returnObj = {
                'GenderCode': Gcode,
                'Object': obj.value
            };
        }
        this.receivedgendersearch.emit(returnObj);
    };
    GenderSearchComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-gender-search',
                    template: "<icabs-dropdown #GenderSearchDropDown [itemsToDisplay]=\"displayFields\" [disabled]=\"isDisabled\" [isRequired]=\"isRequired\" [active]=\"active\" (selectedValue)=\"onGenderSearch($event)\">\n  </icabs-dropdown>"
                },] },
    ];
    GenderSearchComponent.ctorParameters = [
        { type: Injector, },
    ];
    GenderSearchComponent.propDecorators = {
        'GenderSearchDropDown': [{ type: ViewChild, args: ['GenderSearchDropDown',] },],
        'inputParams': [{ type: Input },],
        'isDisabled': [{ type: Input },],
        'active': [{ type: Input },],
        'isRequired': [{ type: Input },],
        'receivedgendersearch': [{ type: Output },],
    };
    return GenderSearchComponent;
}(BaseComponent));
