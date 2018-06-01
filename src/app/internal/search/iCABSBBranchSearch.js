import { Utils } from '../../../shared/services/utility';
import { HttpService } from '../../../shared/services/http-service';
import { ServiceConstants } from '../../../shared/constants/service.constants';
import { Logger } from '@nsalaun/ng2-logger';
import { URLSearchParams } from '@angular/http';
import { Component, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
export var BranchSearchComponent = (function () {
    function BranchSearchComponent(serviceConstants, _httpService, utils, _logger, localeTranslateService) {
        this.serviceConstants = serviceConstants;
        this._httpService = _httpService;
        this.utils = utils;
        this._logger = _logger;
        this.localeTranslateService = localeTranslateService;
        this.method = 'it-functions/search';
        this.module = 'structure';
        this.operation = 'Business/iCABSBBranchSearch';
        this.search = new URLSearchParams();
        this.displayFields = ['BranchNumber', 'BranchName'];
        this.receivedbranchsearch = new EventEmitter();
    }
    BranchSearchComponent.prototype.ngOnInit = function () {
        this.fetchBranchData();
    };
    BranchSearchComponent.prototype.ngOnChanges = function (data) {
        if (data.inputParams) {
            this.fetchBranchData();
        }
    };
    BranchSearchComponent.prototype.fetchBranchData = function () {
        var _this = this;
        this.localeTranslateService.setUpTranslation();
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode ? this.inputParams.businessCode : this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode ? this.inputParams.countryCode : this.utils.getCountryCode());
        this.inputParams.search = this.search;
        this._httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.inputParams.search)
            .subscribe(function (data) {
            _this.requestdata = data.records;
            _this.branchsearchDropDown.updateComponent(_this.requestdata);
        }, function (error) {
            _this.errorMessage = error;
        });
    };
    BranchSearchComponent.prototype.onBranchsearchReceived = function (obj) {
        this.receivedbranchsearch.emit(obj.value);
    };
    BranchSearchComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-branchsearch',
                    template: "<icabs-dropdown #branchsearchDropDown\n  [itemsToDisplay]=\"displayFields\" [disabled]=\"isDisabled\" [isRequired]=\"isRequired\" [active]=\"active\" (selectedValue)=\"onBranchsearchReceived($event)\">\n  </icabs-dropdown>"
                },] },
    ];
    BranchSearchComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: HttpService, },
        { type: Utils, },
        { type: Logger, },
        { type: LocaleTranslationService, },
    ];
    BranchSearchComponent.propDecorators = {
        'branchsearchDropDown': [{ type: ViewChild, args: ['branchsearchDropDown',] },],
        'inputParams': [{ type: Input },],
        'isDisabled': [{ type: Input },],
        'active': [{ type: Input },],
        'isRequired': [{ type: Input },],
        'receivedbranchsearch': [{ type: Output },],
    };
    return BranchSearchComponent;
}());
