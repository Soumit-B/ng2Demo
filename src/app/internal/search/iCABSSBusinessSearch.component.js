import { URLSearchParams } from '@angular/http';
import { Component, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { HttpService } from './../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
export var BusinessSearchComponent = (function () {
    function BusinessSearchComponent(serviceConstants, _httpService) {
        this.serviceConstants = serviceConstants;
        this._httpService = _httpService;
        this.receivedBusinessCode = new EventEmitter();
        this.method = 'it-functions/search';
        this.module = 'structure';
        this.operation = 'System/iCABSSBusinessSearch';
        this.search = new URLSearchParams();
        this.displayFields = ['BusinessCode', 'BusinessDesc'];
    }
    BusinessSearchComponent.prototype.ngOnInit = function () {
        var _this = this;
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
        this._httpService.makeGetRequest(this.method, this.module, this.operation, this.inputParams.search)
            .subscribe(function (data) {
            _this.requestdata = data.records;
            _this.businessDropDown.updateComponent(_this.requestdata);
        }, function (error) {
            _this.errorMessage = error;
        });
    };
    BusinessSearchComponent.prototype.onBusinessCodeReceived = function (obj) {
        this.receivedBusinessCode.emit({
            businessCode: obj.value.BusinessCode,
            businessDesc: obj.value.BusinessDesc
        });
    };
    BusinessSearchComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-business-search',
                    template: "<icabs-dropdown #businessDropDown\n  [itemsToDisplay]=\"displayFields\" [disabled]=\"isDisabled\" [isRequired]=\"isRequired\" [active]=\"active\" (selectedValue)=\"onBusinessCodeReceived($event)\">\n  </icabs-dropdown>"
                },] },
    ];
    BusinessSearchComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: HttpService, },
    ];
    BusinessSearchComponent.propDecorators = {
        'businessDropDown': [{ type: ViewChild, args: ['businessDropDown',] },],
        'inputParams': [{ type: Input },],
        'isDisabled': [{ type: Input },],
        'active': [{ type: Input },],
        'isRequired': [{ type: Input },],
        'receivedBusinessCode': [{ type: Output },],
    };
    return BusinessSearchComponent;
}());
