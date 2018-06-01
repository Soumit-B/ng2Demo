import { Utils } from '../../../shared/services/utility';
import { HttpService } from '../../../shared/services/http-service';
import { ServiceConstants } from '../../../shared/constants/service.constants';
import { Logger } from '@nsalaun/ng2-logger';
import { URLSearchParams } from '@angular/http';
import { Component, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
export var APICodeSearchComponent = (function () {
    function APICodeSearchComponent(serviceConstants, httpService, utils, logger, localeTranslateService) {
        this.serviceConstants = serviceConstants;
        this.httpService = httpService;
        this.utils = utils;
        this.logger = logger;
        this.localeTranslateService = localeTranslateService;
        this.method = 'contract-management/search';
        this.module = 'api';
        this.operation = 'Business/iCABSBAPICodeSearch';
        this.search = new URLSearchParams();
        this.displayFields = ['APICode', 'APICodeDesc'];
        this.receivedAPICodesearch = new EventEmitter();
    }
    APICodeSearchComponent.prototype.ngOnInit = function () {
        this.fetchAPICodeData();
    };
    APICodeSearchComponent.prototype.ngOnChanges = function (data) {
        if (data.inputParams) {
            this.fetchAPICodeData();
        }
    };
    APICodeSearchComponent.prototype.fetchAPICodeData = function () {
        var _this = this;
        this.localeTranslateService.setUpTranslation();
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode ? this.inputParams.businessCode : this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode ? this.inputParams.countryCode : this.utils.getCountryCode());
        this.inputParams.search = this.search;
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.inputParams.search)
            .subscribe(function (data) {
            var emptyOption = { 'APICode': 'All', 'APICodeDesc': 'All' };
            _this.requestdata = data.records;
            _this.requestdata.unshift(emptyOption);
            _this.apicodesearchDropDown.updateComponent(_this.requestdata);
        }, function (error) {
            _this.errorMessage = error;
        });
    };
    APICodeSearchComponent.prototype.onAPICodeSearchReceived = function (obj) {
        this.receivedAPICodesearch.emit(obj.value);
    };
    APICodeSearchComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-apicodesearch',
                    template: "<icabs-dropdown #apicodesearchDropDown\n  [itemsToDisplay]=\"displayFields\" [disabled]=\"isDisabled\" [isRequired]=\"isRequired\" [active]=\"active\" (selectedValue)=\"onAPICodeSearchReceived($event)\">\n  </icabs-dropdown>"
                },] },
    ];
    APICodeSearchComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: HttpService, },
        { type: Utils, },
        { type: Logger, },
        { type: LocaleTranslationService, },
    ];
    APICodeSearchComponent.propDecorators = {
        'apicodesearchDropDown': [{ type: ViewChild, args: ['apicodesearchDropDown',] },],
        'inputParams': [{ type: Input },],
        'isDisabled': [{ type: Input },],
        'active': [{ type: Input },],
        'isRequired': [{ type: Input },],
        'receivedAPICodesearch': [{ type: Output },],
    };
    return APICodeSearchComponent;
}());
