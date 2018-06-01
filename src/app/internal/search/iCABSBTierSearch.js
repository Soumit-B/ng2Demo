import { Utils } from '../../../shared/services/utility';
import { HttpService } from '../../../shared/services/http-service';
import { ServiceConstants } from '../../../shared/constants/service.constants';
import { Logger } from '@nsalaun/ng2-logger';
import { URLSearchParams } from '@angular/http';
import { Component, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { RiExchange } from '../../../shared/services/riExchange';
export var TierSearchComponent = (function () {
    function TierSearchComponent(serviceConstants, httpService, utils, logger, localeTranslateService, riExchange) {
        this.serviceConstants = serviceConstants;
        this.httpService = httpService;
        this.utils = utils;
        this.logger = logger;
        this.localeTranslateService = localeTranslateService;
        this.riExchange = riExchange;
        this.method = 'contract-management/search';
        this.module = 'contract-admin';
        this.operation = 'Business/iCABSBTierSearch';
        this.search = new URLSearchParams();
        this.displayFields = ['TierCode', 'TierSystemDescription'];
        this.receivedtiersearch = new EventEmitter();
    }
    TierSearchComponent.prototype.ngOnInit = function () {
        this.fetchtierData();
    };
    TierSearchComponent.prototype.ngOnChanges = function (data) {
        if (data.inputParams) {
            this.fetchtierData();
        }
    };
    TierSearchComponent.prototype.fetchtierData = function () {
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
            if (data.records && _this.tiersearchDropDown) {
                _this.requestdata = data.records;
                _this.tiersearchDropDown.updateComponent(_this.requestdata);
            }
        }, function (error) {
            _this.errorMessage = error;
        });
    };
    TierSearchComponent.prototype.onTierSearchReceived = function (obj) {
        this.receivedtiersearch.emit(obj.value);
    };
    TierSearchComponent.prototype.ngOnDestroy = function () {
        this.riExchange.releaseReference(this);
        delete this;
    };
    TierSearchComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-tiersearch',
                    template: "<icabs-dropdown #tiersearchDropDown\n  [itemsToDisplay]=\"displayFields\" [disabled]=\"isDisabled\" [isRequired]=\"isRequired\" [active]=\"active\" (selectedValue)=\"onTierSearchReceived($event)\">\n  </icabs-dropdown>"
                },] },
    ];
    TierSearchComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: HttpService, },
        { type: Utils, },
        { type: Logger, },
        { type: LocaleTranslationService, },
        { type: RiExchange, },
    ];
    TierSearchComponent.propDecorators = {
        'tiersearchDropDown': [{ type: ViewChild, args: ['tiersearchDropDown',] },],
        'inputParams': [{ type: Input },],
        'isDisabled': [{ type: Input },],
        'active': [{ type: Input },],
        'isRequired': [{ type: Input },],
        'receivedtiersearch': [{ type: Output },],
    };
    return TierSearchComponent;
}());
