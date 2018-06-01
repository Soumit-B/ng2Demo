import { Injectable, Injector, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { ErrorService } from './error.service';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { ServiceConstants } from './../constants/service.constants';
import { HttpService } from './http-service';
import { CBBConstants } from '../constants/cbb.constants';
import { OrderBy } from './../pipes/orderBy';
export var CBBService = (function () {
    function CBBService(injector) {
        this.injector = injector;
        this.init();
    }
    CBBService.prototype.init = function () {
        this.errorService = this.injector.get(ErrorService);
        this.serviceConstants = this.injector.get(ServiceConstants);
        this.sessionStorageService = this.injector.get(SessionStorageService);
        this.localStorageService = this.injector.get(LocalStorageService);
        this.orderBy = this.injector.get(OrderBy);
        this.changeEmitter = new EventEmitter();
        this.getFromStore();
    };
    CBBService.prototype.getCountryCode = function () {
        return this.countryCode;
    };
    CBBService.prototype.setCountryCode = function (countryCode, propagate) {
        this.countryCode = countryCode;
        if (propagate) {
            this.emitChange(CBBConstants.c_s_CHANGE_COUNTRY_CODE, this.countryCode);
        }
    };
    CBBService.prototype.getBusinessCode = function () {
        return this.businessCode;
    };
    CBBService.prototype.setBusinessCode = function (businessCode, fetchDefaultBranch, propagate) {
        this.businessCode = businessCode;
        if (fetchDefaultBranch) {
            this.getDefaultBranch();
        }
        if (propagate) {
            this.emitChange(CBBConstants.c_s_CHANGE_BUSINESS_CODE, this.businessCode);
        }
    };
    CBBService.prototype.getBranchCode = function () {
        return this.branchCode;
    };
    CBBService.prototype.setBranchCode = function (branchCode, propagate) {
        this.branchCode = branchCode;
        if (propagate) {
            this.emitChange(CBBConstants.c_s_CHANGE_BRANCH_CODE, this.branchCode);
        }
    };
    CBBService.prototype.getCBBList = function () {
        return this.cbbList;
    };
    CBBService.prototype.setCBBList = function (cbbList) {
        this.cbbList = cbbList;
        this.setInStore();
    };
    CBBService.prototype.disableComponent = function (disable) {
        this.componentDisabled = disable;
        this.emitChange(CBBConstants.c_s_CHANGE_COMPONENT_STATE, this.componentDisabled);
    };
    CBBService.prototype.getCountryList = function () {
        return (this.cbbList ? this.cbbList[CBBConstants.c_s_COUNTRIES] : []);
    };
    CBBService.prototype.getBusinessListByCountry = function (country) {
        var countryIdx = 0;
        var countries;
        var businessList;
        countries = this.getCountryList();
        while (countries.length > countryIdx && country !== countries[countryIdx][CBBConstants.c_s_VALUE]) {
            ++countryIdx;
        }
        if (countries.length === countryIdx) {
            return [];
        }
        businessList = countries[countryIdx][CBBConstants.c_s_BUSINESSES];
        return businessList;
    };
    CBBService.prototype.getBranchListByCountryAndBusiness = function (country, business) {
        var businessIdx = 0;
        var businessList;
        var businesses;
        var branchList;
        businesses = this.getBusinessListByCountry(country);
        while (businesses.length > businessIdx && business !== businesses[businessIdx][CBBConstants.c_s_VALUE]) {
            ++businessIdx;
        }
        if (businesses.length === businessIdx) {
            return [];
        }
        branchList = businesses[businessIdx][CBBConstants.c_s_BRANCHES];
        return branchList;
    };
    CBBService.prototype.getDefaultBranch = function () {
        var _this = this;
        var countryIdx = 0;
        var businessIdx = 0;
        var countryArray = [];
        var businessArray = [];
        var defaultBranchCode;
        if (!this.countryCode || !this.businessCode) {
            return;
        }
        this.httpService = this.injector.get(HttpService);
        this.getFromStore();
        countryArray = this.cbbList[CBBConstants.c_s_COUNTRIES];
        for (countryIdx = 0; countryIdx < countryArray.length;) {
            if (this.countryCode === countryArray[countryIdx][CBBConstants.c_s_VALUE]) {
                break;
            }
            countryIdx++;
        }
        businessArray = countryArray[countryIdx][CBBConstants.c_s_BUSINESSES];
        for (businessIdx = 0; businessIdx < businessArray.length;) {
            if (this.businessCode === businessArray[businessIdx][CBBConstants.c_s_VALUE]) {
                break;
            }
            businessIdx++;
        }
        this.defaultBranchCode
            = this.cbbList[CBBConstants.c_s_COUNTRIES][countryIdx][CBBConstants.c_s_BUSINESSES][businessIdx][CBBConstants.c_s_DEFAULT_BRANCH]
                || '';
        if (this.defaultBranchCode) {
            this.emitChange(CBBConstants.c_s_CHANGE_BRANCH_CODE, this.defaultBranchCode);
            return;
        }
        var lookupParams = [{
                'table': 'UserAuthorityBranch',
                'query': { 'UserCode': this.localStorageService.retrieve('RIUserCode'), 'BusinessCode': this.businessCode, 'DefaultBranchInd': 'true' },
                'fields': ['BranchNumber']
            }];
        this.defaultBranchSearch = new URLSearchParams();
        this.defaultBranchSearch.set(this.serviceConstants.Action, '0');
        this.defaultBranchSearch.set(this.serviceConstants.BusinessCode, this.businessCode);
        this.defaultBranchSearch.set(this.serviceConstants.CountryCode, this.countryCode);
        this.defaultBranchSearch.set(this.serviceConstants.MaxResults, '5');
        this.httpService.lookUpRequest(this.defaultBranchSearch, lookupParams).subscribe(function (data) {
            if (!data.results[0].length) {
                return;
            }
            _this.defaultBranchCode = data.results[0][0].BranchNumber;
            _this.emitChange(CBBConstants.c_s_CHANGE_BRANCH_CODE, _this.defaultBranchCode);
            _this.cbbList[CBBConstants.c_s_COUNTRIES][countryIdx][CBBConstants.c_s_BUSINESSES][businessIdx][CBBConstants.c_s_DEFAULT_BRANCH]
                = _this.defaultBranchCode;
            _this.setInStore();
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    CBBService.prototype.emitChange = function (changedProperty, newData) {
        var emitData = {};
        emitData[CBBConstants.c_s_CHANGED_PROPERTY] = changedProperty;
        emitData[CBBConstants.c_s_NEW_DATA] = newData;
        this.changeEmitter.emit(emitData);
    };
    CBBService.prototype.formatResponsedata = function (response) {
        var responseData;
        var formattedData = {};
        var lastCountry = '';
        var countryObj = {};
        var branchObj = [];
        responseData = this.orderBy.transform(response, CBBConstants.c_s_COUNTRY_CODE);
        formattedData[CBBConstants.c_s_COUNTRIES] = [];
        for (var countryIdx = 0; countryIdx < responseData.length; countryIdx++) {
            var currentCountry = responseData[countryIdx][CBBConstants.c_s_COUNTRY_CODE];
            var businessIdx = 0;
            var businessObj = {};
            var currentBranches = {};
            var branchList = [];
            if (currentCountry !== lastCountry) {
                lastCountry = currentCountry;
                countryObj = {};
                formattedData[CBBConstants.c_s_COUNTRIES].push(countryObj);
                countryObj[CBBConstants.c_s_VALUE] = responseData[countryIdx][CBBConstants.c_s_COUNTRY_CODE];
                countryObj[CBBConstants.c_s_TEXT] = responseData[countryIdx][CBBConstants.c_s_COUNTRY_CODE] + ' - ' + responseData[countryIdx][CBBConstants.c_s_COUNTRY_NAME];
                countryObj[CBBConstants.c_s_BUSINESSES] = [];
                businessIdx = 0;
            }
            currentBranches = responseData[countryIdx][CBBConstants.c_s_BUSINESSES][0][CBBConstants.c_s_BRANCHES];
            for (var branchIdx = 0; branchIdx < currentBranches.length; branchIdx++) {
                var branchObj_1 = {};
                branchObj_1[CBBConstants.c_s_TEXT] = currentBranches[branchIdx][CBBConstants.c_s_BRANCH_CODE] + ' - ' + currentBranches[branchIdx][CBBConstants.c_s_BRANCH_NAME];
                branchObj_1[CBBConstants.c_s_VALUE] = currentBranches[branchIdx][CBBConstants.c_s_BRANCH_CODE];
                branchList.push(branchObj_1);
            }
            businessObj[CBBConstants.c_s_BRANCHES] = branchList;
            businessObj[CBBConstants.c_s_VALUE] = responseData[countryIdx][CBBConstants.c_s_BUSINESSES][0][CBBConstants.c_s_BUSINESS_CODE];
            businessObj[CBBConstants.c_s_TEXT] = responseData[countryIdx][CBBConstants.c_s_BUSINESSES][0][CBBConstants.c_s_BUSINESS_CODE] + ' - ' + responseData[countryIdx][CBBConstants.c_s_BUSINESSES][0][CBBConstants.c_s_BUSINESS_NAME];
            countryObj[CBBConstants.c_s_BUSINESSES].push(businessObj);
        }
        return formattedData;
    };
    CBBService.prototype.setInStore = function () {
        if (this.cbbList) {
            this.sessionStorageService.store(CBBConstants.c_s_CBB_STORAGE_KEY_NAME, JSON.stringify(this.cbbList));
        }
    };
    CBBService.prototype.getFromStore = function () {
        var usercodeResponse;
        usercodeResponse = this.sessionStorageService.retrieve(CBBConstants.c_s_CBB_STORAGE_KEY_NAME);
        if (usercodeResponse) {
            this.cbbList = JSON.parse(this.sessionStorageService.retrieve(CBBConstants.c_s_CBB_STORAGE_KEY_NAME)) || {};
            return;
        }
        usercodeResponse = this.localStorageService.retrieve(CBBConstants.c_s_USERCODE_RESPONSE_STORAGE_KEY_NAME) || [];
        if (usercodeResponse.length) {
            this.setCBBList(this.formatResponsedata(usercodeResponse));
        }
    };
    CBBService.prototype.clearStore = function () {
        this.sessionStorageService.clear();
    };
    CBBService.decorators = [
        { type: Injectable },
    ];
    CBBService.ctorParameters = [
        { type: Injector, },
    ];
    return CBBService;
}());
