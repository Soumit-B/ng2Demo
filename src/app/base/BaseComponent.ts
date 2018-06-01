import { SpeedScriptConstants } from './../../shared/constants/speed-script.constant';
import { MntConst, RiMaintenance } from './../../shared/services/riMaintenancehelper';
import { CBBService } from './../../shared/services/cbb.service';
import { MessageService } from './../../shared/services/message.service';
import { SpeedScript } from '../../shared/services/speedscript';
import { SysCharConstants } from './../../shared/constants/syscharservice.constant';
import { LookUp } from './../../shared/services/lookup';
import { RiExchange } from './../../shared/services/riExchange';
import { NavData } from './../../shared/services/navigationData';
import { URLSearchParams } from '@angular/http';
import { GlobalConstant } from './../../shared/constants/global.constant';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ComponentInteractionService } from './../../shared/services/component-interaction.service';
import { AjaxConstant } from './../../shared/constants/AjaxConstants';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { LocaleTranslationService } from './../../shared/services/translation.service';
import { Utils } from './../../shared/services/utility';
import { AjaxObservableConstant } from './../../shared/constants/ajax-observable.constant';
import { Route, ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { Logger, Level } from '@nsalaun/ng2-logger';
import { ErrorService } from './../../shared/services/error.service';
import { HttpService } from './../../shared/services/http-service';
import { ServiceConstants } from './../../shared/constants/service.constants';
import { Component, OnInit, ViewChild, OnDestroy, NgZone, Inject, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Injector } from '@angular/core';
import { Location } from '@angular/common';
import { QueryParametersCallback, MessageCallback, ErrorCallback, BackRouteCallback, RouteCallback } from './Callback';
import { RouteAwayComponent } from '../../shared/components/route-away/route-away';
import { RouteAwayGlobals } from '../../shared/services/route-away-global.service';
import { Observable } from 'rxjs';
import { SelectedDataEvent } from '../../shared/events/ellipsis-event-emitter';
import { ContractManagementModuleRoutes } from './PageRoutes';
import { ModalAdvService } from './../../shared/components/modal-adv/modal-adv.service';
import { GlobalizeService } from './../../shared/services/globalize.service';

export abstract class BaseComponent extends SelectedDataEvent implements OnInit, OnDestroy, RouteCallback {

    // Subscription variable
    public errorSubscription: Subscription;
    public messageSubscription: Subscription;
    public storeSubscription: Subscription;
    public routerSubscription: Subscription;
    public translateSubscription: Subscription;
    public activatedRouteSubscription: Subscription;
    public activatedRouteUrlParamsSubscription: Subscription;
    public httpSubscription: Subscription;
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public ajaxSubscription: Subscription;
    public isRequesting: boolean = false;
    public showBackLabel: boolean = false;
    public isReturningFlag: boolean = false;

    //Inject classes
    public logger: Logger;
    public errorService: ErrorService;
    public messageService: MessageService;
    public zone: NgZone;
    public localeTranslateService: LocaleTranslationService;
    public utils: Utils;
    public store;
    public httpService: HttpService;
    public translate: TranslateService;
    public serviceConstants: ServiceConstants;
    public router: Router;
    public activatedRoute: ActivatedRoute;
    public componentInteractionService: ComponentInteractionService;
    public formBuilder: FormBuilder;
    public global: GlobalConstant;
    public riExchange: RiExchange;
    public LookUp: LookUp;
    public sysCharConstants: SysCharConstants;
    public speedScriptConstants: SpeedScriptConstants;
    public speedScript: SpeedScript;
    public ajaxconstant: AjaxObservableConstant;
    public location: Location;
    public cbbService: CBBService;
    public riMaintenance: RiMaintenance;
    public modalAdvService: ModalAdvService;
    public globalize: GlobalizeService;

    //Parametrs to be saved
    public pageParams: any = {};
    public attributes: any = {};
    public formData: any = {};
    public storeSavedData: any = {};

    //All the callback methods for subscription
    private errorCallback: ErrorCallback;
    private queryParametersCallback: QueryParametersCallback;
    private messageCallback: MessageCallback;
    private backRouteCallback: BackRouteCallback;
    private bookmarkParams: URLSearchParams = new URLSearchParams();

    //Variables to be used all classes
    public pageTitle: string = '';
    public backLinkText: string = '';
    public backLinkUrl: string = '';
    public abstract pageId: string = '';
    public uiForm: FormGroup;
    public abstract controls = [];
    public controlsMap: Object = {};
    public parentMode = '';
    public browserTitle: string = '';

    public navUrl: string = '';

    // Form Mode Constants
    public formMode: string;
    public readonly c_s_MODE_ADD = 'add';
    public readonly c_s_MODE_UPDATE = 'update';
    public readonly c_s_MODE_SELECT = 'select';
    public readonly c_s_MODE_DELETE = 'delete';

    //canDeactivateRoute service
    public routeAwayGlobals: RouteAwayGlobals;

    //pageRoutes
    public ContractManagementModuleRoutes: any;

    //Regional Settings control types
    public controlDataTypes = {};

    constructor(injector: Injector) {
        super();
        this.injectServices(injector);
        this.formMode = this.c_s_MODE_SELECT;
        this.ContractManagementModuleRoutes = ContractManagementModuleRoutes;
    }

    private injectServices(injector: Injector): void {
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
        this.modalAdvService = injector.get(ModalAdvService);
        this.globalize = injector.get(GlobalizeService);
    }

    /**
     * Setter method to set listeners for page
     */

    /** Set the error callback for ErrorService */
    public setErrorCallback(callback: any): void {
        this.errorCallback = callback;
    }

    /** Set the callback for URLQueryParameters */
    public setURLQueryParameters(callback: any): void {
        this.queryParametersCallback = callback;
    }

    /** Set the callback for MessageService */
    public setMessageCallback(callback: any): void {
        this.messageCallback = callback;
    }

    /** Set the callback for BackNavigation */
    public handleBackNavigation(callback: any): void {
        this.backRouteCallback = callback;
    }

    public isReturning(): boolean {
        return this.isReturningFlag;
    }

    /**
     * Return URLSearchParams with business code and country code
     */

    public getURLSearchParamObject(): URLSearchParams {
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        return search;
    }

    /**
     * Initialize
     *
     */
    public ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.localeTranslateService.setUpTranslation();
        this.uiForm = this.formBuilder.group({});
        this.riMaintenance = new RiMaintenance(this.logger, this.httpService, this.LookUp, this.utils, this.serviceConstants, this.globalize);
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

        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.zone.run(() => {
                    if (this.errorCallback) {
                        this.errorCallback.showErrorModal(data);
                    }
                });
            }
        });

        this.messageService.emitMessage(0);
        this.messageSubscription = this.messageService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.zone.run(() => {
                    if (this.messageCallback) {
                        this.messageCallback.showMessageModal(data);
                    }
                });
            }
        });

        this.ajaxSubscription = this.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.zone.run(() => {
                    switch (event) {
                        case AjaxConstant.START:
                            this.isRequesting = true;
                            break;
                        case AjaxConstant.COMPLETE:
                            this.isRequesting = false;
                            break;
                    }
                });
            }
        });

        this.activatedRouteSubscription = this.activatedRoute.queryParams.subscribe(
            (param: any) => {
                if (param) {
                    this.riExchange.setRouterParams(param);
                    if (param.fromMenu === 'true') {
                        this.bookmarkParams.set('fromMenu', 'true');
                    }
                }
                if (this.queryParametersCallback) {
                    this.queryParametersCallback.getURLQueryParameters(param);
                }
            });

        this.activatedRouteUrlParamsSubscription = this.activatedRoute.params.subscribe(
            (param: any) => {
                if (param) {
                    this.riExchange.setRouterUrlParams(param);
                }
            });

        this.routerSubscription = this.router.events.subscribe(event => {
            this.backLinkText = 'Back';
            this.navUrl = event.url;
            this.backLinkUrl = '/#' + this.riExchange.getBackRoute();
        });
        this.setUp();
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.handleBackStack(this.pageId);
        if (this.browserTitle) {
            this.utils.setTitle(this.browserTitle);
        }
        this.setCommonAttributes();
    }

    public getTranslatedValue(key: any, params?: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }

    }

    public getTranslatedValuesBatch(callBack: (n: any) => any, ...args: any[]): any {
        let obs: any = [];
        for (let arg of args) {
            obs.push(this.getTranslatedValue.apply(this, arg));
        }
        Observable.forkJoin(...obs).subscribe((data: any) => {
            this.zone.run(() => {
                if (data) {
                    callBack(data);
                }
            });
        });
    }

    private setUp(): void {
        this.parentMode = this.riExchange.getParentMode();
        if (this.pageParams) {
            this.pageParams['currentContractType'] = this.riExchange.getCurrentContractType();
            this.pageParams['currentContractTypeLabel'] = this.riExchange.getCurrentContractTypeLabel();
        }
    }

    public businessCode(): string {
        return this.utils.getBusinessCode();
    }

    public countryCode(): string {
        return this.utils.getCountryCode();
    }

    /************ Wrappers For riExchange.riInputElement - Start ************/
    /**
     * Wrapper to riExchange.riInputElement.GetValue; Don't need to pass the form name
     * @method getControlValue
     * @param control - Control name to get value
     * @return string
     */
    public getControlValue(control: string, doTypeCheck?: boolean): any {
        let type: string = this.controlDataTypes[control] || '';
        let value: any = this.riExchange.riInputElement.GetValue(this.uiForm, control, type);
        if (doTypeCheck) {
            if (type === MntConst.eTypeCheckBox) {
                value = this.utils.convertResponseValueToCheckboxInput(value);
            }
        }
        return value;
    }
    /**
     * Wrapper to riExchange.riInputElement.SetValue; Don't need to pass the form name
     * @method setControlValue
     * @param control - Control name to get value
     * @param value - Value to set
     * @return void
     */
    public setControlValue(control: string, value: any): void {
        let type: string = this.controlDataTypes[control] || '';
        if (type === MntConst.eTypeCheckBox) {
            value = this.utils.convertResponseValueToCheckboxInput(value);
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, control, value, type);
    }
    /**
     * Wrapper to riExchange.riInputElement.SetRequiredStatus; Don't need to pass the form name
     * @method setRequiredStatus
     * @param control - Control name to get value
     * @param status - Boolean Value to set
     * @return void
     */
    public setRequiredStatus(control: string, status: boolean): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, control, status);
        this.riExchange.updateCtrl(this.controls, control, 'required', status);
    }
    /**
     * Wrapper to riExchange.riInputElement.Enable/this.riExchange.riInputElement.Disable; Don't need to pass the form name
     * @method disableControl
     * @param control - Control name to get value
     * @param enable - Flag to enable/disable
     * @return void
     */
    public disableControl(control: string, enable: boolean): void {
        if (enable) {
            this.riExchange.riInputElement.Disable(this.uiForm, control);
            return;
        }
        this.riExchange.riInputElement.Enable(this.uiForm, control);
    }
    /**
     * disable controls in the form except the controls in ignore Array
     * @method disableControls
     * @param ignore - Array of controls not to be disabled
     * @return void
     */
    public disableControls(ignore: Array<string>): void {
        for (let control in this.uiForm.controls) {
            if (!control || ignore.indexOf(control) >= 0) {
                continue;
            } else {
                this.riExchange.riInputElement.Disable(this.uiForm, control);
            }
        }
    }
    /**
     * enable controls in the form except the controls in ignore Array
     * @method enableControls
     * @param ignore - Array of controls not to be enabled
     * @return void
     */
    public enableControls(ignore: Array<string>): void {
        for (let control in this.uiForm.controls) {
            if (!control || ignore.indexOf(control) >= 0) {
                continue;
            } else {
                this.riExchange.riInputElement.Enable(this.uiForm, control);
            }
        }
    }
    /**
     * Wrapper to riExchange.riInputElement.SetMarkedAsTouched; Don't need to pass the form name
     * @method markControlAsTouched
     * @param control - Control name to get value
     * @return void
     */
    public markControlAsTouched(control: string): void {
        this.riExchange.riInputElement.SetMarkedAsTouched(this.uiForm, control, true);
        return;
    }
    public markControlAsUnTouched(control: string): void {
        this.riExchange.riInputElement.SetMarkedAsTouched(this.uiForm, control, false);
        return;
    }

    /**
     * Wrapper to riExchange.riInputElement.isCorrect; Don't need to pass the form name
     * Checks if form control has any validation errors
     * @method hasNoError
     * @param control - Control name to check error
     * @return Boolean
     */
    public hasNoError(control: string): Boolean {
        return this.riExchange.riInputElement.isCorrect(this.uiForm, control);
    }
    /************ Wrappers For riExchange.riInputElement - End ************/

    /**
     * Clears controls in the form except the controls in ignore Array
     * @method clearControls
     * @param ignore - Array of controls not to be cleared
     * @return void
     */
    public clearControls(ignore: Array<string>): void {
        for (let control in this.uiForm.controls) {
            if (!control || ignore.indexOf(control) >= 0) {
                continue;
            }
            this.setControlValue(control, '');
            this.uiForm.controls[control].markAsUntouched();
        }
    }

    /**
     * Method to check numeric value
     */
    public IsNumeric(fieldName: string): boolean {
        try {
            return !isNaN(parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, fieldName), 10));
        } catch (e) {
            return false;
        }
    }
    /**
     * Method to concert currency
     */
    public cCur(fieldName: string): any {
        return this.utils.cCur(this.riExchange.riInputElement.GetValue(this.uiForm, fieldName));
    }

    /**
     * Method to parse int
     */
    public CInt(fieldName: string): any {
        return parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, fieldName), 10);
    }

    /**
     * Method for InStr
     */
    public InStr(fieldName: string, sub: string): number {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, fieldName)) {
            return this.riExchange.riInputElement.GetValue(this.uiForm, fieldName).indexOf(sub);
        } else {
            return -1;
        }
    }

    /**
     * Method for LCase
     */
    public LCase(sub: any): string {
        if (sub === null || sub === undefined || sub === '') {
            return '';
        }
        return sub.toString().toLowerCase();
    }

    /**
     * Method for UCase
     */
    public UCase(sub: any): string {
        if (sub === null || sub === undefined || sub === '') {
            return '';
        }
        return sub.toString().toUpperCase();
    }

    /**
     * Method for CDate
     */
    public CDate(fieldName: string): number {
        return Date.parse(this.riExchange.riInputElement.GetValue(this.uiForm, fieldName));
    }

    /**
     * Method to return field value as string
     */
    public getControlValueAsString(field: string): string {
        let getFieldValue = this.getControlValue(field);
        return getFieldValue ? getFieldValue.toString() : '';
    }

    /**
     * Check back stack and handle stack data
     */
    public handleBackStack(pageId: string): any {
        let data: NavData = this.riExchange.getLastStackData();
        if (data && pageId === data.getPageId()) { //Back stack has data for the page
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
            if (this.pageParams) {
                this.parentMode = this.pageParams.parentMode;
            }
            this.populateUIFromFormData();
        } else {
            return {};
        }
    }

    public populateUIFromFormData(): void {
        for (let i = 0; i < this.controls.length; i++) {
            if (this.formData[this.controls[i].name]) {
                this.riExchange.riInputElement.SetValue(this.uiForm,
                    this.controls[i].name, this.formData[this.controls[i].name]);
            }
        }
    }

    /**
     * Generates a map for the Controls array
     */
    public genCtrlMap(): void {
        let len = this.controls.length;
        for (let i = 0; i < len; i++) {
            this.controlsMap[this.controls[i].name] = i;
        }
    }

    /**
     * Sets form mode; Enables/Disables CBB component
     * - Possible parameter values
     *  - add
     *  - update
     *  - select
     * - Parameter values must be used from BaseComponent Properties
     *  - c_s_MODE_SELECT
     *  - c_s_MODE_ADD
     *  - c_s_MODE_UPDATE
     * @method setFormMode
     * @param mode - Form mode
     * @return void
     */
    public setFormMode(mode: string): void {
        this.formMode = mode;
        switch (mode) {
            case this.c_s_MODE_SELECT:
                this.cbbService.disableComponent(false);
                //this.routeAwayGlobals.setSaveEnabledFlag(false);
                break;
            default:
                //this.routeAwayGlobals.setSaveEnabledFlag(true);
                this.cbbService.disableComponent(true);
        }
    }

    public setAttribute(field: string, value: any): void {
        this.attributes[field] = value;
    }

    public getAttribute(field: string): any {
        return this.attributes[field];
    }

    public CDbl(val: string): any {
        return parseFloat(val);
    }

    /**
     * Method to navigate to a new page
     */
    public navigate(exchangeMode: string, path: string, queryParams?: any): void {
        let data = new NavData();
        let urlExtraParams: any = queryParams || {};
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
        } else {
            urlExtraParams.parentMode = exchangeMode;
        }
        this.riExchange.clearRouterParams();
        this.router.navigate([path], {
            queryParams: urlExtraParams
        });
    }

    public createControlObjectFromForm(): any[] {
        let tempControl: any[] = [];
        for (let key in this.uiForm.controls) {
            if (key) {
                let type = this.riExchange.getCtrlType(this.controls, key);
                let _validator: any = this.uiForm.controls[key].validator && this.uiForm.controls[key].validator(this.uiForm.controls[key]);
                let required = false;
                if (_validator) {
                    required = _validator && _validator.required;
                }
                let obj = {
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
    }
    /**
     * Clean up
     */
    public ngOnDestroy(): void {
        //Release memory
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

        //Unsubscribe
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
        if (this.httpSubscription) {
            this.httpSubscription.unsubscribe();
        }
        this.ajaxSource = null;
        this.routeAwayGlobals.resetRouteAwayFlags();
    }

    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public canDeactivate(): Observable<boolean> {
        this.routeAwayGlobals.setSaveEnabledFlag(this.uiForm.dirty);
        if (this.routeAwayComponent) {
            return this.routeAwayComponent.canDeactivate();
        }
    }

    public handleBookmark(field: string, data: string): void {
        //to do--to be implemenetd in another CR
        // let urlStr = this.location.path().split('?')[0];
        // if (this.bookmarkParams) {
        //     let existingParams = this.location.path().split('?').pop().split('&');
        //     let params = {};
        //     for (let i = 0; i < existingParams.length; i++) {
        //         let qP = existingParams[i].split('=');
        //         if (qP[0].toLowerCase() !== 'frommenu') {
        //             params[qP[0]] = qP[1];
        //         }
        //     }

        //     if (data) {
        //         for (let i in params) {
        //             if (i) {
        //                 this.bookmarkParams.set(i, decodeURI(params[i])); //Keeps the existing parameters
        //                 if (i === field) {
        //                     params[i] = decodeURI(data);
        //                     this.bookmarkParams.set(i, decodeURI(data)); //Updates the existing parameters
        //                 } else {
        //                     params[field] = decodeURI(data);
        //                     this.bookmarkParams.set(field, decodeURI(data)); //Adds new parameters
        //                 }
        //             }
        //         }
        //         this.location.replaceState(urlStr, this.bookmarkParams.toString());
        //     }
        // }
    }

    /**
     * Emits error and displays error message
     * If apiError parameters are passed prints error in console; Only for Dev/Support purpose
     * @param error - Error message to be disaplayed
     * @param apiError - Raw error message received from API response
     * @return void
     */
    public displayError(error: any, apiError?: any): void {
        if (this.ajaxSource) {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        }
        this.errorService.emitError(error);
        if (apiError) {
            this.logger.log(apiError);
        }
    }

    public formPristine(): void {
        this.uiForm.markAsPristine();
    }

    public nullValidate(field: any): any {
        let nullValidator: any = new RegExp('[^null |$]');
        if (!nullValidator.test(field.value)) {
            return { 'invalidValue': true };
        }
        return null;
    }

    public setCommonAttributes(field: string = ''): void {
        if (field) {
            if (this.uiForm.controls[field])
                this.uiForm.controls[field].setValidators([this.utils.commonValidate]);
        } else {
            for (let c of this.controls) {
                if (c['commonValidator'] && c['commonValidator'] === true) {
                    this.uiForm.controls[c.name].setValidators([this.utils.commonValidate]);
                }
                if (c['commonValidator'] && c['commonValidator'] === true && c['required']) {
                    this.uiForm.controls[c.name].setValidators([this.utils.commonValidate, this.nullValidate]);
                }
                if (c['type'] && c['type'] !== '') {
                    this.controlDataTypes[c['name']] = c['type'];
                }
            }
        }

    }

    public hasValue(val: any): boolean {
        return ((val !== null) && (val !== undefined) && (val !== ''));
    }

    public fieldHasValue(field: string): boolean {
        return this.hasValue(this.getControlValue(field));
    }

    /*
    check for dirty controls in the form except the controls in ignore Array
    @method checkDirtyControls
    @param ignore - Array of controls not to be checked
    @return void
    */
    public checkDirtyControls(ignore: Array<string>): boolean {
        for (let control in this.uiForm.controls) {
            if (ignore.indexOf(control) < 0) {
                if (this.uiForm.controls[control].dirty)
                    return true;
            }
        }
    }
}
