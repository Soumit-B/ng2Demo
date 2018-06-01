import { Component, ViewChild } from '@angular/core';
import { CBBService } from '../../services/cbb.service';
import { AjaxObservableConstant } from './../../constants/ajax-observable.constant';
import { CBBConstants } from '../../constants/cbb.constants';
import { Utils } from './../../services/utility';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NgZone } from '@angular/core';
import { LocaleTranslationService } from './../../services/translation.service';
import { Router, NavigationEnd } from '@angular/router';
export var CBBComponent = (function () {
    function CBBComponent(cbbService, ajaxconstant, utils, zone, localeTranslateService, router) {
        this.cbbService = cbbService;
        this.ajaxconstant = ajaxconstant;
        this.utils = utils;
        this.zone = zone;
        this.localeTranslateService = localeTranslateService;
        this.router = router;
        this.cbbDataCountries = CBBConstants.c_o_BLANK_DROPDOWN_LIST;
        this.cbbDataBusinesses = CBBConstants.c_o_BLANK_DROPDOWN_LIST;
        this.cbbDataBranches = CBBConstants.c_o_BLANK_DROPDOWN_LIST;
        this.branchDropdownMapKeys = ['BranchName', 'BranchNumber'];
        this.ajaxSource = new BehaviorSubject(0);
        this.currentUrl = '';
        this.cbbDataCountries = this.cbbService.getCBBList() ? this.cbbService.getCBBList()[CBBConstants.c_s_COUNTRIES] : CBBConstants.c_o_BLANK_DROPDOWN_LIST;
    }
    CBBComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.localeTranslateService.setUpTranslation();
        this.ajaxSubscription = this.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                switch (event) {
                    case _this.ajaxconstant.START:
                        _this.isRequesting = true;
                        break;
                    case _this.ajaxconstant.COMPLETE:
                        _this.isRequesting = false;
                        break;
                }
            }
        });
        if (!this.cbbService.changeEmitter.observers.length) {
            this.cbbService.changeEmitter.subscribe(function (data) {
                var dropdownToChange;
                switch (data[CBBConstants.c_s_CHANGED_PROPERTY]) {
                    case CBBConstants.c_s_CHANGE_BRANCH_CODE:
                        _this.cbbBranchDropdown.selectedItem = data[CBBConstants.c_s_NEW_DATA];
                        _this.onBranchSelect(data[CBBConstants.c_s_NEW_DATA]);
                        break;
                    case CBBConstants.c_s_CHANGE_BUSINESS_CODE:
                        _this.cbbBusinessDropdown.selectedItem = data[CBBConstants.c_s_NEW_DATA];
                        _this.onBusinessSelect(data[CBBConstants.c_s_NEW_DATA]);
                        break;
                    case CBBConstants.c_s_CHANGE_COUNTRY_CODE:
                        _this.cbbCountryDropdown.selectedItem = data[CBBConstants.c_s_NEW_DATA];
                        _this.onCountrySelect(data[CBBConstants.c_s_NEW_DATA]);
                        break;
                    case CBBConstants.c_s_CHANGE_COMPONENT_STATE:
                        break;
                }
            });
        }
        this.routeSubscription = this.router.events.filter(function (event) { return event instanceof NavigationEnd; }).subscribe(function (event) {
            _this.modifyComponentState(event);
            _this.currentUrl = event.url;
        });
    };
    CBBComponent.prototype.ngAfterViewInit = function () {
        var loginCountryCode = this.utils.getLogInCountryCode();
        this.cbbCountryDropdown.selectedItem = loginCountryCode;
        this.onCountrySelect(loginCountryCode);
    };
    CBBComponent.prototype.ngOnDestroy = function () {
        this.ajaxSource = null;
        this.ajaxSource$ = null;
        if (this.ajaxSubscription) {
            this.ajaxSubscription.unsubscribe();
        }
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
    };
    CBBComponent.prototype.onCountrySelect = function (data) {
        var idx = -1;
        if (!data) {
            return;
        }
        this.cbbService.setCountryCode(data);
        for (idx = 0; idx < this.cbbDataCountries.length; idx++) {
            if (this.cbbDataCountries[idx][CBBConstants.c_s_VALUE] === data) {
                break;
            }
        }
        if (this.cbbDataCountries[idx]) {
            this.cbbDataBusinesses = this.cbbDataCountries[idx][CBBConstants.c_s_BUSINESSES];
        }
        if (this.cbbBusinessDropdown) {
            this.onBusinessSelect(this.cbbDataBusinesses[0][CBBConstants.c_s_VALUE]);
        }
    };
    CBBComponent.prototype.onBusinessSelect = function (data) {
        var idx = -1;
        if (!data) {
            return;
        }
        this.cbbService.setBusinessCode(data);
        this.cbbBusinessDropdown.selectedItem = data;
        for (idx = 0; idx < this.cbbDataBusinesses.length; idx++) {
            if (this.cbbDataBusinesses[idx][CBBConstants.c_s_VALUE] === data) {
                break;
            }
        }
        this.cbbDataBranches = this.cbbDataBusinesses[idx] ? this.cbbDataBusinesses[idx][CBBConstants.c_s_BRANCHES] : [];
        if (!this.cbbDataBranches.length) {
            this.cbbDataBranches = CBBConstants.c_o_BLANK_DROPDOWN_LIST;
        }
        if (this.cbbBusinessDropdown) {
            this.onBranchSelect(this.cbbDataBranches[0][CBBConstants.c_s_VALUE]);
        }
    };
    CBBComponent.prototype.onBranchSelect = function (data) {
        this.cbbBranchDropdown.selectedItem = data;
        this.cbbService.setBranchCode(data);
    };
    CBBComponent.prototype.modifyComponentState = function (event) {
        if (event.url === '/postlogin') {
            this.isDisabled = false;
            return;
        }
        else {
            var elemList = document.querySelectorAll('.cbb-cont select');
            for (var i = 0; i < elemList.length; i++) {
                this.utils.removeClass(elemList[i], 'ng-dirty');
            }
            this.isDisabled = true;
        }
    };
    CBBComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-cbb',
                    templateUrl: 'cbb.html'
                },] },
    ];
    CBBComponent.ctorParameters = [
        { type: CBBService, },
        { type: AjaxObservableConstant, },
        { type: Utils, },
        { type: NgZone, },
        { type: LocaleTranslationService, },
        { type: Router, },
    ];
    CBBComponent.propDecorators = {
        'cbbCountryDropdown': [{ type: ViewChild, args: ['CBBCountryDropdown',] },],
        'cbbBusinessDropdown': [{ type: ViewChild, args: ['CBBBusinessDropdown',] },],
        'cbbBranchDropdown': [{ type: ViewChild, args: ['CBBBranchDropdown',] },],
    };
    return CBBComponent;
}());
