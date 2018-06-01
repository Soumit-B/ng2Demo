import { URLSearchParams } from '@angular/http';
import { Component, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { HttpService } from './../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
export var CountryCodeComponent = (function () {
    function CountryCodeComponent(serviceConstants, _httpService) {
        this.serviceConstants = serviceConstants;
        this._httpService = _httpService;
        this.receivedCountryCode = new EventEmitter();
        this.method = 'contract-management/search';
        this.module = 'contract-admin';
        this.operation = 'Application/iCABSACountryCodeSearch';
        this.search = new URLSearchParams();
        this.displayFields = ['riCountryCode', 'riCountryDescription'];
    }
    CountryCodeComponent.prototype.ngOnInit = function () {
        this.fetchCountryData();
    };
    CountryCodeComponent.prototype.ngOnChanges = function (data) {
        if (data.inputParams) {
            this.fetchCountryData();
        }
    };
    CountryCodeComponent.prototype.fetchCountryData = function () {
        var _this = this;
        if (!this.inputParams.countryCode || !this.inputParams.businessCode) {
            return;
        }
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        if (this.active === null || this.active === undefined) {
            this.active = {
                id: '',
                text: ''
            };
        }
        if (this.isDisabled === null || this.isDisabled === undefined) {
            this.isDisabled = false;
        }
        if (this.isRequired === null || this.isRequired === undefined) {
            this.isRequired = false;
        }
        this.search.set(this.serviceConstants.Action, '0');
        if (this.inputParams.businessCode !== undefined &&
            this.inputParams.businessCode !== null) {
            this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        }
        if (this.inputParams.countryCode !== undefined &&
            this.inputParams.countryCode !== null) {
            this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        }
        this.inputParams.search = this.search;
        this._httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.inputParams.search)
            .subscribe(function (data) {
            _this.requestdata = data.records;
            _this.countryDropDown.updateComponent(_this.requestdata);
        }, function (error) {
            _this.errorMessage = error;
        });
    };
    CountryCodeComponent.prototype.onCountryCodeReceived = function (obj) {
        var countryCode = obj.value.riCountryCode;
        var countryDesc = obj.value.riCountryDescription;
        var returnObj;
        if (this.inputParams.parentMode === 'LookUp' ||
            this.inputParams.parentMode === 'LookUp-riCountry') {
            returnObj = {
                'riCountryCode': countryCode,
                'riCountryDescription': countryDesc
            };
        }
        else if (this.inputParams.parentMode === 'LookUp-Country') {
            returnObj = {
                'CountryCode': countryCode,
                'CountryDesc': countryDesc
            };
        }
        else {
            returnObj = {
                'riCountryCode': countryCode,
                'Object': obj.value
            };
        }
        this.receivedCountryCode.emit(returnObj);
    };
    CountryCodeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-countrycode',
                    template: "<icabs-dropdown #countryDropDown\n  [itemsToDisplay]=\"displayFields\" [triggerValidate]=\"triggerValidate\" [disabled]=\"isDisabled\" [isRequired]=\"isRequired\" [active]=\"active\" (selectedValue)=\"onCountryCodeReceived($event)\">\n  </icabs-dropdown>"
                },] },
    ];
    CountryCodeComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: HttpService, },
    ];
    CountryCodeComponent.propDecorators = {
        'countryDropDown': [{ type: ViewChild, args: ['countryDropDown',] },],
        'inputParams': [{ type: Input },],
        'isDisabled': [{ type: Input },],
        'active': [{ type: Input },],
        'isRequired': [{ type: Input },],
        'triggerValidate': [{ type: Input },],
        'receivedCountryCode': [{ type: Output },],
    };
    return CountryCodeComponent;
}());
