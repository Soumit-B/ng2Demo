var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { SpeedScriptConstants } from './../../shared/constants/speed-script.constant';
import { RiMaintenance } from './../../shared/services/riMaintenancehelper';
import { CBBService } from './../../shared/services/cbb.service';
import { MessageService } from './../../shared/services/message.service';
import { SpeedScript } from '../../shared/services/speedscript';
import { SysCharConstants } from './../../shared/constants/syscharservice.constant';
import { LookUp } from './../../shared/services/lookup';
import { RiExchange } from './../../shared/services/riExchange';
import { NavData } from './../../shared/services/navigationData';
import { URLSearchParams } from '@angular/http';
import { GlobalConstant } from './../../shared/constants/global.constant';
import { FormBuilder } from '@angular/forms';
import { ComponentInteractionService } from './../../shared/services/component-interaction.service';
import { AjaxConstant } from './../../shared/constants/AjaxConstants';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { LocaleTranslationService } from './../../shared/services/translation.service';
import { Utils } from './../../shared/services/utility';
import { AjaxObservableConstant } from './../../shared/constants/ajax-observable.constant';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Logger } from '@nsalaun/ng2-logger';
import { ErrorService } from './../../shared/services/error.service';
import { HttpService } from './../../shared/services/http-service';
import { ServiceConstants } from './../../shared/constants/service.constants';
import { ViewChild, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { RouteAwayGlobals } from '../../shared/services/route-away-global.service';
import { SelectedDataEvent } from '../../shared/events/ellipsis-event-emitter';
import { ContractManagementModuleRoutes } from './PageRoutes';
export var BaseComponent = (function (_super) {
    __extends(BaseComponent, _super);
    function BaseComponent(injector) {
        _super.call(this);
        this.ajaxSource = new BehaviorSubject(0);
        this.isRequesting = false;
        this.showBackLabel = false;
        this.isReturningFlag = false;
        this.pageParams = {};
        this.attributes = {};
        this.formData = {};
        this.storeSavedData = {};
        this.bookmarkParams = new URLSearchParams();
        this.pageTitle = '';
        this.backLinkText = '';
        this.backLinkUrl = '';
        this.pageId = '';
        this.controls = [];
        this.parentMode = '';
        this.navUrl = '';
        this.c_s_MODE_ADD = 'add';
        this.c_s_MODE_UPDATE = 'update';
        this.c_s_MODE_SELECT = 'select';
        this.injectServices(injector);
        this.formMode = this.c_s_MODE_SELECT;
        this.ContractManagementModuleRoutes = ContractManagementModuleRoutes;
    }
    BaseComponent.prototype.injectServices = function (injector) {
        this.errorService = injector.get(ErrorService);
        this.messageService = injector.get(MessageService);
        this.activatedRoute = injector.get(ActivatedRoute);
        this.store = injector.get(Store);
        this.logger = injector.get(Logger);
        this.zone = injector.get(NgZone);
        this.localeTranslateService = injector.get(LocaleTranslationService);
        this.utils = injector.get(Utils);
        this.httpService = injector.get(HttpService);
        this.translate = injector.get(TranslateService);
        this.serviceConstants = injector.get(ServiceConstants);
        this.router = injector.get(Router);
        this.componentInteractionService = injector.get(ComponentInteractionService);
        this.formBuilder = injector.get(FormBuilder);
        this.global = injector.get(GlobalConstant);
        this.riExchange = injector.get(RiExchange);
        this.LookUp = injector.get(LookUp);
        this.sysCharConstants = injector.get(SysCharConstants);
        this.speedScriptConstants = injector.get(SpeedScriptConstants);
        this.speedScript = injector.get(SpeedScript);
        this.ajaxconstant = injector.get(AjaxObservableConstant);
        this.location = injector.get(Location);
        this.cbbService = injector.get(CBBService);
        this.routeAwayGlobals = injector.get(RouteAwayGlobals);
    };
    BaseComponent.prototype.setErrorCallback = function (callback) {
        this.errorCallback = callback;
    };
    BaseComponent.prototype.setURLQueryParameters = function (callback) {
        this.queryParametersCallback = callback;
    };
    BaseComponent.prototype.setMessageCallback = function (callback) {
        this.messageCallback = callback;
    };
    BaseComponent.prototype.handleBackNavigation = function (callback) {
        this.backRouteCallback = callback;
    };
    BaseComponent.prototype.isReturning = function () {
        return this.isReturningFlag;
    };
    BaseComponent.prototype.getURLSearchParamObject = function () {
        var search = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        return search;
    };
    BaseComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.localeTranslateService.setUpTranslation();
        this.uiForm = this.formBuilder.group({});
        this.riMaintenance = new RiMaintenance(this.logger, this.httpService, this.LookUp, this.utils, this.serviceConstants);
        this.riMaintenance.uiForm = this.uiForm;
        this.riMaintenance.riExchange = this.riExchange;
        if (this.pageParams === undefined) {
            this.pageParams = {};
        }
        this.pageParams['vBusinessCode'] = this.utils.getBusinessCode();
        this.pageParams['vCountryCode'] = this.utils.getCountryCode();
        this.pageParams['gUserCode'] = this.utils.getUserCode();
        this.isReturningFlag = false;
        this.riExchange.setRouteCallback(this);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    if (_this.errorCallback) {
                        _this.errorCallback.showErrorModal(data);
                    }
                });
            }
        });
        this.messageSubscription = this.messageService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    if (_this.messageCallback) {
                        _this.messageCallback.showMessageModal(data);
                    }
                });
            }
        });
        this.ajaxSubscription = this.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.zone.run(function () {
                    switch (event) {
                        case AjaxConstant.START:
                            _this.isRequesting = true;
                            break;
                        case AjaxConstant.COMPLETE:
                            _this.isRequesting = false;
                            break;
                    }
                });
            }
        });
        this.activatedRouteSubscription = this.activatedRoute.queryParams.subscribe(function (param) {
            if (param) {
                _this.riExchange.setRouterParams(param);
                if (param.fromMenu === 'true') {
                    _this.bookmarkParams.set('fromMenu', 'true');
                }
            }
            if (_this.queryParametersCallback) {
                _this.queryParametersCallback.getURLQueryParameters(param);
            }
        });
        this.activatedRouteUrlParamsSubscription = this.activatedRoute.params.subscribe(function (param) {
            if (param) {
                _this.riExchange.setRouterUrlParams(param);
            }
        });
        this.routerSubscription = this.router.events.subscribe(function (event) {
            _this.backLinkText = 'Back';
            _this.navUrl = event.url;
            _this.backLinkUrl = '/#' + _this.riExchange.getBackRoute();
        });
        this.setUp();
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.handleBackStack(this.pageId);
    };
    BaseComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    BaseComponent.prototype.setUp = function () {
        this.parentMode = this.riExchange.getParentMode();
        if (this.pageParams) {
            this.pageParams['currentContractType'] = this.riExchange.getCurrentContractType();
            this.pageParams['currentContractTypeLabel'] = this.riExchange.getCurrentContractTypeLabel();
        }
    };
    BaseComponent.prototype.businessCode = function () {
        return this.utils.getBusinessCode();
    };
    BaseComponent.prototype.countryCode = function () {
        return this.utils.getCountryCode();
    };
    BaseComponent.prototype.getControlValue = function (control) {
        return this.riExchange.riInputElement.GetValue(this.uiForm, control);
    };
    BaseComponent.prototype.setControlValue = function (control, value) {
        this.riExchange.riInputElement.SetValue(this.uiForm, control, value);
    };
    BaseComponent.prototype.disableControl = function (control, enable) {
        if (enable) {
            this.riExchange.riInputElement.Disable(this.uiForm, control);
            return;
        }
        this.riExchange.riInputElement.Enable(this.uiForm, control);
    };
    BaseComponent.prototype.hasNoError = function (control) {
        return this.riExchange.riInputElement.isCorrect(this.uiForm, control);
    };
    BaseComponent.prototype.clearControls = function (ignore) {
        for (var control in this.uiForm.controls) {
            if (!control || ignore.indexOf(control) >= 0) {
                continue;
            }
            this.setControlValue(control, '');
            this.uiForm.controls[control].markAsUntouched();
        }
    };
    BaseComponent.prototype.IsNumeric = function (fieldName) {
        try {
            return !isNaN(parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, fieldName), 10));
        }
        catch (e) {
            return false;
        }
    };
    BaseComponent.prototype.cCur = function (fieldName) {
        return this.utils.cCur(this.riExchange.riInputElement.GetValue(this.uiForm, fieldName));
    };
    BaseComponent.prototype.CInt = function (fieldName) {
        return parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, fieldName), 10);
    };
    BaseComponent.prototype.InStr = function (fieldName, sub) {
        return this.riExchange.riInputElement.GetValue(this.uiForm, fieldName).indexOf(sub);
    };
    BaseComponent.prototype.CDate = function (fieldName) {
        return Date.parse(this.riExchange.riInputElement.GetValue(this.uiForm, fieldName));
    };
    BaseComponent.prototype.handleBackStack = function (pageId) {
        var data = this.riExchange.getLastStackData();
        if (data && pageId === data.getPageId()) {
            this.isReturningFlag = true;
            this.riExchange.popNavigationData();
            this.pageParams = data.getPageData();
            this.formData = data.getFormData();
            this.storeSavedData = data.getStoreData();
            this.attributes = data.getPageAttributes();
            if (data.getMode()) {
                this.riMaintenance.CurrentMode = data.getMode();
            }
            if (data.getControls()) {
                this.controls = data.getControls();
            }
            if (this.pageParams)
                this.parentMode = this.pageParams.parentMode;
            this.populateUIFromFormData();
        }
        else {
            return {};
        }
    };
    BaseComponent.prototype.populateUIFromFormData = function () {
        for (var i = 0; i < this.controls.length; i++) {
            if (this.formData[this.controls[i].name]) {
                this.riExchange.riInputElement.SetValue(this.uiForm, this.controls[i].name, this.formData[this.controls[i].name]);
            }
        }
    };
    BaseComponent.prototype.setFormMode = function (mode) {
        var _this = this;
        setTimeout(function () {
            _this.formMode = mode;
            switch (mode) {
                case _this.c_s_MODE_SELECT:
                    _this.cbbService.disableComponent(false);
                    break;
                default:
                    _this.cbbService.disableComponent(true);
            }
        }, 0);
    };
    BaseComponent.prototype.setAttribute = function (field, value) {
        this.attributes[field] = value;
    };
    BaseComponent.prototype.getAttribute = function (field) {
        return this.attributes[field];
    };
    BaseComponent.prototype.CDbl = function (val) {
        return parseFloat(val);
    };
    BaseComponent.prototype.navigate = function (exchangeMode, path, queryParams) {
        var data = new NavData();
        var urlExtraParams = queryParams || {};
        this.pageParams.parentMode = this.parentMode;
        data.setPageData(this.pageParams);
        data.setExchangeMode(exchangeMode);
        data.setBackLabel(this.pageTitle);
        data.setPageId(this.pageId);
        data.setFormData(this.uiForm.getRawValue());
        data.setStoreData(this.storeSavedData);
        data.setPageAttributes(this.attributes);
        data.setBackRoute(this.navUrl);
        data.setControls(this.createControlObjectFromForm());
        if (this.riMaintenance.CurrentMode) {
            data.setMode(this.riMaintenance.CurrentMode);
        }
        this.riExchange.pushInNavigationData(data);
        if (queryParams) {
            queryParams.parentMode = exchangeMode;
        }
        else {
            urlExtraParams.parentMode = exchangeMode;
        }
        this.router.navigate([path], {
            queryParams: urlExtraParams
        });
    };
    BaseComponent.prototype.createControlObjectFromForm = function () {
        var tempControl = [];
        for (var key in this.uiForm.controls) {
            if (key) {
                var type = this.riExchange.getCtrlType(this.controls, key);
                var _validator = this.uiForm.controls[key].validator && this.uiForm.controls[key].validator(this.uiForm.controls[key]);
                var required = false;
                if (_validator) {
                    required = _validator && _validator.required;
                }
                var obj = {
                    name: key,
                    readonly: this.uiForm.controls[key]['readonly'],
                    disabled: this.uiForm.controls[key]['disabled'],
                    required: required,
                    type: type,
                    value: this.uiForm.controls[key]['value']
                };
                tempControl.push(obj);
            }
        }
        return tempControl;
    };
    BaseComponent.prototype.ngOnDestroy = function () {
        this.riExchange.clearRouterParams();
        this.serviceConstants = null;
        this.httpService = null;
        this.errorService = null;
        this.messageService = null;
        this.store = null;
        this.router = null;
        this.zone = null;
        this.logger = null;
        this.utils = null;
        this.sysCharConstants = null;
        this.speedScriptConstants = null;
        this.speedScript = null;
        this.bookmarkParams = null;
        if (this.errorSubscription) {
            this.errorSubscription.unsubscribe();
        }
        if (this.messageSubscription) {
            this.messageSubscription.unsubscribe();
        }
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
        if (this.activatedRouteSubscription) {
            this.activatedRouteSubscription.unsubscribe();
        }
        if (this.activatedRouteUrlParamsSubscription) {
            this.activatedRouteUrlParamsSubscription.unsubscribe();
        }
        if (this.ajaxSubscription) {
            this.ajaxSubscription.unsubscribe();
        }
        this.ajaxSource = null;
        this.routeAwayGlobals.resetRouteAwayFlags();
    };
    BaseComponent.prototype.canDeactivate = function () {
        this.routeAwayGlobals.setSaveEnabledFlag(this.uiForm.dirty);
        if (this.routeAwayComponent) {
            return this.routeAwayComponent.canDeactivate();
        }
    };
    BaseComponent.prototype.handleBookmark = function (field, data) {
    };
    BaseComponent.prototype.displayError = function (error, apiError) {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        this.errorService.emitError(error);
        if (apiError) {
            this.logger.log(apiError);
        }
    };
    BaseComponent.prototype.formPristine = function () {
        this.uiForm.markAsPristine();
    };
    BaseComponent.propDecorators = {
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return BaseComponent;
}(SelectedDataEvent));
