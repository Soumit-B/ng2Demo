import { Utils } from './../../../shared/services/utility';
import { Component, ViewChild, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { HttpService } from './../../../shared/services/http-service';
import { ErrorService } from '../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';
import { AuthService } from '../../../shared/services/auth.service';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
export var ApiGenerationMaintenanceComponent = (function () {
    function ApiGenerationMaintenanceComponent(httpService, fb, serviceConstants, errorService, messageService, zone, ajaxconstant, router, authService, titleService, translate, utils, localeTranslateService, routeAwayGlobals) {
        this.httpService = httpService;
        this.fb = fb;
        this.serviceConstants = serviceConstants;
        this.errorService = errorService;
        this.messageService = messageService;
        this.zone = zone;
        this.ajaxconstant = ajaxconstant;
        this.router = router;
        this.authService = authService;
        this.titleService = titleService;
        this.translate = translate;
        this.utils = utils;
        this.localeTranslateService = localeTranslateService;
        this.routeAwayGlobals = routeAwayGlobals;
        this.search = new URLSearchParams();
        this.ajaxSource = new BehaviorSubject(0);
        this.enableSubmitAPI = false;
        this.enableRefreshAPI = false;
        this.isRequesting = false;
        this.queryPost = new URLSearchParams();
        this.method = 'contract-management/maintenance';
        this.module = 'api';
        this.operation = 'Application/iCABSAApplyAPIGeneration';
        this.contentType = 'application/x-www-form-urlencoded';
        this.showHeader = true;
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.inputParams = {
            'parentMode': '',
            'businessCode': '',
            'pageTitle': 'Apply API'
        };
        this.queryParams = {
            'branchNumber': '',
            'businessCode': '',
            'countryCode': '',
            'methodType': 'maintenance',
            'action': '0',
            'pageTitle': 'Apply API',
            'postDesc': 'APIMonth',
            'calculateAPI': 'CalculateAPI'
        };
        this.isFormEnabled = false;
    }
    ApiGenerationMaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.localeTranslateService.setUpTranslation();
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    if (data.errorMessage) {
                        _this.errorModal.show(data, true);
                    }
                });
            }
        });
        this.messageService.emitMessage(0);
        this.messageSubscription = this.messageService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    _this.messageModal.show({ msg: 'Saved Successfully', title: 'Message' }, false);
                });
            }
        });
        this.ajaxSubscription = this.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.zone.run(function () {
                    switch (event) {
                        case _this.ajaxconstant.START:
                            _this.isRequesting = true;
                            break;
                        case _this.ajaxconstant.COMPLETE:
                            _this.isRequesting = false;
                            break;
                    }
                });
            }
        });
        this.applyAPIFormGroup = this.fb.group({
            businessDesc: [{ value: '', disabled: true }],
            lessThan: [{ value: '', disabled: true }],
            apiMonth: [{ value: '', disabled: true }],
            apiYear: [{ value: '', disabled: true }],
            existingPortfolio: [{ value: '', disabled: true }],
            newPortfolio: [{ value: '', disabled: true }]
        });
        this.titleService.setTitle(this.inputParams.pageTitle);
        this.inputParams.businessCode = this.utils.getBusinessCode();
        this.queryParams['branchNumber'] = this.utils.getBranchCode();
        this.getBusinessDesc();
    };
    ApiGenerationMaintenanceComponent.prototype.ngOnDestroy = function () {
        this.errorSubscription.unsubscribe();
        this.messageSubscription.unsubscribe();
        this.ajaxSubscription.unsubscribe();
        this.routeAwayGlobals.resetRouteAwayFlags();
    };
    ApiGenerationMaintenanceComponent.prototype.getFormData = function () {
        var _this = this;
        this.search.set(this.serviceConstants.Action, this.queryParams.action);
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('PostDesc', this.queryParams.postDesc);
        this.applyAPIFormGroup.controls['existingPortfolio'].setValue('');
        this.applyAPIFormGroup.controls['newPortfolio'].setValue('');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.method, this.module, this.operation, this.search)
            .subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError(e);
            }
            else {
                _this.applyAPIFormGroup.controls['lessThan'].setValue(e.LessThanValue);
                _this.applyAPIFormGroup.controls['apiMonth'].setValue(e.APIMonth);
                _this.applyAPIFormGroup.controls['apiYear'].setValue(e.APIYear);
                _this.enableRefreshAPI = true;
                if (e.Update === 'No') {
                    _this.enableSubmitAPI = false;
                    _this.routeAwayGlobals.setSaveEnabledFlag(false);
                }
                else {
                    _this.enableSubmitAPI = true;
                    _this.routeAwayGlobals.setSaveEnabledFlag(true);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ApiGenerationMaintenanceComponent.prototype.getRefreshData = function () {
        var _this = this;
        this.search.set(this.serviceConstants.Action, this.queryParams.action);
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('PostDesc', this.queryParams.calculateAPI);
        var formdata = {};
        formdata['LessThan'] = this.applyAPIFormGroup.controls['lessThan'].value;
        formdata['Update'] = 'No';
        this.queryParams['branchNumber'] = this.utils.getBranchCode();
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError(e);
            }
            else {
                _this.applyAPIFormGroup.controls['existingPortfolio'].setValue(e.ExistingPortfolio.trim());
                _this.applyAPIFormGroup.controls['newPortfolio'].setValue(e.NewPortfolio.trim());
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
        this.utils.getBusinessDesc(this.utils.getBusinessCode()).subscribe(function (data) {
            _this.applyAPIFormGroup.controls['businessDesc'].setValue(data.BusinessDesc);
        });
    };
    ApiGenerationMaintenanceComponent.prototype.getBusinessDesc = function () {
        var _this = this;
        this.utils.getBusinessDesc(this.utils.getBusinessCode()).subscribe(function (data) {
            _this.applyAPIFormGroup.controls['businessDesc'].setValue(data.BusinessDesc);
            _this.getFormData();
        });
    };
    ApiGenerationMaintenanceComponent.prototype.enableForm = function () {
        this.isFormEnabled = true;
        this.enableSubmitAPI = true;
        this.routeAwayGlobals.setSaveEnabledFlag(true);
    };
    ApiGenerationMaintenanceComponent.prototype.disableForm = function () {
        this.isFormEnabled = false;
        this.enableSubmitAPI = false;
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.applyAPIFormGroup.reset();
    };
    ApiGenerationMaintenanceComponent.prototype.onSubmit = function (data, event) {
        var _this = this;
        event.preventDefault();
        this.search.set(this.serviceConstants.Action, '1');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('PostDesc', this.queryParams.calculateAPI);
        var formdata = {};
        formdata['LessThan'] = this.applyAPIFormGroup.controls['lessThan'].value;
        formdata['Update'] = 'Yes';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError(e);
            }
            else {
                if (e.errorMessage && e.errorMessage !== '') {
                    setTimeout(function () {
                        _this.errorService.emitError(e);
                    }, 200);
                }
                else {
                    _this.messageService.emitMessage(e);
                    _this.enableSubmitAPI = false;
                    _this.enableRefreshAPI = false;
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ApiGenerationMaintenanceComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    ApiGenerationMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAApplyAPIGeneration.html',
                    providers: [ErrorService, MessageService]
                },] },
    ];
    ApiGenerationMaintenanceComponent.ctorParameters = [
        { type: HttpService, },
        { type: FormBuilder, },
        { type: ServiceConstants, },
        { type: ErrorService, },
        { type: MessageService, },
        { type: NgZone, },
        { type: AjaxObservableConstant, },
        { type: Router, },
        { type: AuthService, },
        { type: Title, },
        { type: TranslateService, },
        { type: Utils, },
        { type: LocaleTranslationService, },
        { type: RouteAwayGlobals, },
    ];
    ApiGenerationMaintenanceComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return ApiGenerationMaintenanceComponent;
}());
