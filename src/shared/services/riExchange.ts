import { RouteCallback } from './../../app/base/Callback';
import { LANGUAGE_MAP } from './languagemap';
import { NavData } from './navigationData';
import { Stack } from './Stack';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Logger } from '@nsalaun/ng2-logger';
import { Title } from '@angular/platform-browser';
import { URLSearchParams } from '@angular/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { ServiceConstants } from './../constants/service.constants';
import { HttpService } from './http-service';
import { Utils } from './utility';
import { AuthService } from './auth.service';
import { GlobalizeService } from './globalize.service';

@Injectable()
export class RiExchange implements OnInit, OnDestroy {
    public storeSubscription: Subscription;
    public storeData: any;
    public bridgeBaseClass: any;
    public storeName: string = '';
    private navigationStack: Stack<NavData>;
    public routerParams: any = {};
    private routerUrlParams: any = {};
    private currentForm: FormGroup;
    public Busy: boolean = false;
    public routeReadCallbk: RouteCallback;
    public Mode: string;
    constructor(
        private logger: Logger,
        private utils: Utils,
        private ls: LocalStorageService,
        private _ss: SessionStorageService,
        private store: Store<any>,
        public globalize: GlobalizeService
    ) {
        this.riInputElement.globalize = this.globalize;
    }

    ngOnInit(): void {
        // this.logger.log('RiExchange - Init');
    }

    ngOnDestroy(): void {
        // this.logger.log('RiExchange - Destroyed');
        this.killStore();
    }

    public releaseReference(ref: any): void {
        for (let i in ref) {
            if (i) ref[i] = null;
        }
        ref = null;
    }

    public setRouteCallback(cbk: RouteCallback): void {
        this.routeReadCallbk = cbk;
    }

    public killStore(): void {
        if (this.storeSubscription) {
            this.storeName = '';
            this.storeSubscription.unsubscribe();
        }
    }

    public getStore(storeName: string): any {
        if (this.storeName !== storeName) {
            this.killStore();
            this.storeName = storeName;
            this.storeSubscription = this.store.select(storeName).subscribe(data => {
                this.storeData = data;
                //this.logger.log('riExchange - getStore ', storeName, data);
            });
        }
    }

    public setStore(action: string, payload: any, { append = true }: { append?: boolean } = {}): void {
        let newStoreData = this.storeData;
        if (append) {
            for (let key in payload) {
                if (key !== '') {
                    //if (data.hasOwnProperty(key)) {}
                    newStoreData.data[key] = payload[key];
                }
            }
        }
        this.store.dispatch({ type: action, payload: newStoreData });
    }

    public getStoreValue(key: string): any {
        let ret = '';
        if (typeof this.storeData !== 'undefined') {
            for (let key in this.storeData) {
                if (this.storeData.hasOwnProperty(key)) {
                    let obj = this.storeData[key];
                    for (let childkey in obj) {
                        if (obj.hasOwnProperty(childkey)) {
                            if (childkey === key) {
                                ret = obj[childkey];
                                return ret;
                            }
                        }
                    }
                }
            }
        }
        return ret;
    }

    public GetParentHTMLInputElementAttribute(DataObj: any, AttributeName: string): any {
        return this.GetParentHTMLInputValue(DataObj, AttributeName);
    }
    public GetParentHTMLInputValue(DataObj: any, InputName: string, useBridgeObj?: boolean, checkBox?: boolean): any {
        let resp: any = '';
        if (typeof DataObj !== 'undefined') {
            if (DataObj.hasOwnProperty(InputName)) {
                if (typeof DataObj[InputName] === 'string') {
                    resp = DataObj[InputName].trim();
                } else {
                    resp = DataObj[InputName];
                }
            }
        }

        if (resp === '') {
            if (typeof this.storeData !== 'undefined') {
                if (this.storeData.data.hasOwnProperty(InputName)) {
                    resp = this.storeData.data[InputName].trim();
                }
            }
        }

        if (typeof useBridgeObj !== 'undefined' && useBridgeObj) {
            if (resp === '') {
                if (typeof this.bridgeBaseClass !== 'undefined' && useBridgeObj) {
                    resp = this.getBridgeObjValue(InputName);
                }
            }
        }

        if (typeof checkBox !== 'undefined' && checkBox) {
            resp = this.utils.convertResponseValueToCheckboxInput(resp);
        }

        //this.logger.log(InputName + ': ' + resp);
        return resp;
    }

    public SetParentHTMLInputElementAttribute(action: string, payload: any): void {
        this.SetParentHTMLInputValue(action, payload);
    }
    public SetParentHTMLInputValue(action: string, payload: any): void {
        this.setStore(action, payload);
    }

    public renderParentFields(DataObj: any, FormGrp: FormGroup, FieldName: string): void {
        let value = this.GetParentHTMLInputValue(DataObj, FieldName);
        this.riInputElement.SetValue(FormGrp, FieldName, value);
    }

    public ParentMode(DataObj: any): string {
        let resp = '';
        if (DataObj) {
            if (DataObj.hasOwnProperty('parentMode')) {
                resp = DataObj.parentMode;
            } else if (DataObj.hasOwnProperty('parent')) {
                resp = DataObj.parent;
            }
        }
        if (resp === '') {
            if (typeof this.storeData !== 'undefined' && this.storeData.data) {
                if (this.storeData.data.hasOwnProperty('parentMode')) {
                    resp = this.storeData.data['parentMode'].trim();
                } else if (this.storeData.data.hasOwnProperty('parent')) {
                    resp = this.storeData.data['parent'].trim();
                } else if (this.storeData.sentFromParent.hasOwnProperty('parentMode')) {
                    resp = this.storeData.sentFromParent['parentMode'].trim();
                } else if (this.storeData.sentFromParent.hasOwnProperty('parent')) {
                    resp = this.storeData.sentFromParent['parent'].trim();
                }
            }
        }
        return resp;
    }

    public renderForm(FormGrp: FormGroup, ctrlObj: Array<any>): void {
        let controls = ctrlObj;
        for (let i = 0; i < controls.length; i++) {
            if (controls[i].name !== '') {
                let ctrl = controls[i];
                this.riInputElement.Add(FormGrp, ctrl.name);
                if (ctrl.hasOwnProperty('value')) {
                    this.riInputElement.SetValue(FormGrp, ctrl.name, ctrl.value);
                }
                if (ctrl.hasOwnProperty('readonly')) {
                    this.riInputElement.ReadOnly(FormGrp, ctrl.name, ctrl.readonly);
                }
                if (ctrl.hasOwnProperty('disabled')) {
                    if (ctrl.disabled) {
                        this.riInputElement.Disable(FormGrp, ctrl.name);
                    }
                }
                if (ctrl.hasOwnProperty('required')) {
                    this.riInputElement.SetRequiredStatus(FormGrp, ctrl.name, ctrl.required);
                }
            }
        }
        this.currentForm = FormGrp;

    }

    public updateUiFields(data: any, FormGrp: FormGroup, ctrlObj: Array<any>): void {
        for (let i in data) {
            if (i !== '') {
                //this.logger.log('updateUiFields', i, data[i], this.getCtrlType(ctrlObj, i));

                //TODO - Checkbox
                if (data[i] === 'No' || data[i] === 'NO' || data[i] === 'no' || data[i] === 'N') data[i] = false;
                if (data[i] === 'Yes' || data[i] === 'YES' || data[i] === 'yes' || data[i] === 'Y') data[i] = true;

                //TODO - TimeConversion

                this.riInputElement.SetValue(FormGrp, i, data[i]);
                this.updateCtrl(ctrlObj, i, 'value', data[i]);
            }
        }
    }

    public getCtrlType(ctrlObj: Array<any>, name: string): any {
        let dataType = '';
        for (let i = 0; i < ctrlObj.length; i++) {
            if (ctrlObj[i].name === name && ctrlObj[i].hasOwnProperty('type')) {
                dataType = ctrlObj[i].type;
                break;
            }
        }
        return dataType;
    }

    public validateForm(formGroup: FormGroup): boolean {
        let isValid: boolean = true;

        for (let control in formGroup.controls) {
            if (!control) {
                continue;
            }
            //look for parent - 2 levels - if hidden ignore
            if (formGroup.controls[control].invalid) {
                let elem = document.querySelector('#' + control);
                if (elem && elem.tagName) {
                    if (elem.tagName === 'ICABS-DATEPICKER') {
                        let inputElement = elem.getElementsByTagName('input')[0];
                        this.utils.addClass(inputElement, 'ng-touched');
                        this.utils.removeClass(inputElement, 'ng-untouched');
                    }

                    if (elem && elem.parentElement) {
                        if (this.utils.hasClass(elem.parentElement, 'hidden')) {
                            continue;
                        }
                    }
                    if (elem && elem.parentElement && elem.parentElement.parentElement) {
                        if (this.utils.hasClass(elem.parentElement.parentElement, 'hidden')) {
                            continue;
                        }
                    }
                    if (elem && elem.parentElement && elem.parentElement.parentElement && elem.parentElement.parentElement.parentElement) {
                        if (this.utils.hasClass(elem.parentElement.parentElement.parentElement, 'hidden')) {
                            continue;
                        }
                    }
                    isValid = false;
                    formGroup.controls[control].markAsTouched();
                } else {
                    continue;
                }
            }
            this.logger.log('validateForm -- INVALID formControl:', control);
        }
        return isValid;
    }

    public riInputElement = {
        globalize: null,
        Add: function (FormGrp: FormGroup, FieldName: string): void {
            if (!FormGrp.controls.hasOwnProperty(FieldName)) {
                FormGrp.addControl(FieldName, new FormControl());
                FormGrp.controls[FieldName].setValue('');
                FormGrp.controls[FieldName]['readonly'] = false;
            }
        },
        Disable: function (FormGrp: FormGroup, FieldName: string): void {
            if (FormGrp.controls.hasOwnProperty(FieldName)) {
                FormGrp.controls[FieldName].disable();
            }
        },
        isDisabled: function (FormGrp: FormGroup, FieldName: string): boolean {
            if (FormGrp.controls.hasOwnProperty(FieldName)) {
                return FormGrp.controls[FieldName].disabled;
            }
        },
        Enable: function (FormGrp: FormGroup, FieldName: string): void {
            if (FormGrp.controls.hasOwnProperty(FieldName)) {
                FormGrp.controls[FieldName].enable();
                FormGrp.controls[FieldName]['readonly'] = false;
            }
        },
        ReadOnly: function (FormGrp: FormGroup, FieldName: string, readonly: boolean): void {
            if (FormGrp.controls.hasOwnProperty(FieldName)) {
                FormGrp.controls[FieldName]['readonly'] = readonly;
            }
        },
        isReadOnly: function (FormGrp: FormGroup, FieldName: string): boolean {
            if (FormGrp.controls.hasOwnProperty(FieldName)) {
                return FormGrp.controls[FieldName]['readonly'];
            }
        },
        Status: function (FormGrp: FormGroup, FieldName: string): any {
            if (FormGrp.controls.hasOwnProperty(FieldName)) {
                return FormGrp.controls[FieldName];
            }
        },
        SetValue: function (FormGrp: FormGroup, FieldName: string, Value: any, controlDataType?: string): void {
            if (FormGrp.controls.hasOwnProperty(FieldName)) {
                FormGrp.controls[FieldName].setValue(Value);
            }
        },
        MarkAsDirty: function (FormGrp: FormGroup, FieldName: string): void {
            if (FormGrp.controls.hasOwnProperty(FieldName)) {
                FormGrp.controls[FieldName].markAsDirty();
            }
        },
        MarkAsPristine: function (FormGrp: FormGroup, FieldName: string): void {
            if (FormGrp.controls.hasOwnProperty(FieldName)) {
                FormGrp.controls[FieldName].markAsPristine();
            }
        },
        HasChanged: function (FormGrp: FormGroup, FieldName: string): boolean {
            if (FormGrp.controls.hasOwnProperty(FieldName)) {
                return FormGrp.controls[FieldName].dirty;
            }
        },
        GetValue: function (FormGrp: FormGroup, FieldName: string, controlDataType?: string): string {
            let methodName: string = '';
            let controlValue: any = FormGrp.controls.hasOwnProperty(FieldName) ? FormGrp.controls[FieldName].value : '';

            if (controlValue && controlDataType) {
                methodName = 'parse' + controlDataType.replace('eType', '') + 'ToFixedFormat';
                if (this.globalize[methodName]) {
                    controlValue = this.globalize[methodName](controlValue);
                }
            }

            return controlValue;
        },
        checked: function (FormGrp: FormGroup, FieldName: string): boolean {
            if (FormGrp.controls.hasOwnProperty(FieldName)) {
                let val = FormGrp.controls[FieldName].value;
                if (typeof val === 'boolean') {
                    return val;
                } else if (typeof val === 'string') {
                    return val.toLowerCase() === 'true';
                } else {
                    return false;
                }
            } else return false;
        },
        SetLookUpStatus: function (FormGrp: FormGroup, FieldName: string, Value: any): any {
            if (FormGrp.controls.hasOwnProperty(FieldName)) {
                //return FormGrp.controls[FieldName].value;
                //TODO
            } else return '';
        },
        SetErrorStatus: function (FormGrp: FormGroup, FieldName: string, Value: boolean): void {
            if (FormGrp.controls.hasOwnProperty(FieldName)) {
                if (Value) {
                    FormGrp.controls[FieldName].setValidators(Validators.pattern('https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)'));
                    FormGrp.controls[FieldName].markAsTouched();
                } else {
                    FormGrp.controls[FieldName].setValidators(null);
                    FormGrp.controls[FieldName].markAsUntouched();
                }
            }
        },
        SetRequiredStatus: function (FormGrp: FormGroup, FieldName: string, Value: boolean): void {
            if (FormGrp.controls.hasOwnProperty(FieldName)) {
                if (Value) {
                    FormGrp.controls[FieldName].setValidators(Validators.required);
                } else {
                    FormGrp.controls[FieldName].setValidators(null);
                }
                FormGrp.controls[FieldName].updateValueAndValidity();
            }
        },
        markAsError: function (FormGrp: FormGroup, FieldName: string): void {
            if (FormGrp.controls.hasOwnProperty(FieldName)) {
                FormGrp.controls[FieldName].setErrors({ 'incorrect': true });
            }
        },
        isError: function (FormGrp: FormGroup, FieldName: string): boolean {
            if (FormGrp.controls.hasOwnProperty(FieldName)) {
                if (FormGrp.controls[FieldName].invalid) {
                    FormGrp.controls[FieldName].markAsTouched();
                }
                return FormGrp.controls[FieldName].invalid;
            } else return true;
        },
        isCorrect: function (FormGrp: FormGroup, FieldName: string): boolean {
            if (FormGrp.controls.hasOwnProperty(FieldName)) {
                if (FormGrp.controls[FieldName].valid) {
                    FormGrp.controls[FieldName].markAsUntouched();
                }
                return FormGrp.controls[FieldName].valid;
            } else return true;
        },
        isNumber: function (FormGrp: FormGroup, FieldName: string): boolean {
            if (isNaN(parseInt(FormGrp.controls[FieldName].value, 10))) {
                FormGrp.controls[FieldName].markAsTouched();
                return FormGrp.controls[FieldName].invalid;
            } else return true;
        },
        SetMarkedAsTouched: function (FormGrp: FormGroup, FieldName: string, Value: boolean): void {
            if (FormGrp.controls.hasOwnProperty(FieldName)) {
                if (Value) {
                    FormGrp.controls[FieldName].markAsTouched();
                } else {
                    FormGrp.controls[FieldName].markAsUntouched();
                }
            }
        },
        isEmpty: function (FormGrp: FormGroup, FieldName: string): boolean {
            let str = FormGrp.controls[FieldName].value;
            if (!str.replace(/^\s+/g, '').length)
                return true;
            else
                return false;
        }
    };

    public URLParameterContains(param: string): boolean {
        let flag = false;
        if (this.routerParams && this.routerParams.hasOwnProperty(param)) flag = true;
        // this.logger.log('URLParameterContains: ', param, this.routerParams, flag);
        return flag;
    };

    public GetParentRowID(DataObj: any, name: string): any {
        //TODO - RowId constant?
        return this.GetParentHTMLInputValue(DataObj, name);
    };

    public LanguageCode(): string {
        let languageCode = this.ls.retrieve('LanguageCode');
        if (languageCode) {
            //return this.readLanguageMappingJson(setUpInfo.localeCultureCode.localeCode);
            return languageCode;
        } else {
            return 'ENG';
        }
    }

    private readLanguageMappingJson(langCode: string): string {
        let langMap = LANGUAGE_MAP.ttLanguageMapping;
        for (let i = 0; i < langMap.length; i++) {
            let langObj = langMap[i];
            if (langCode === langObj.LocaleCode) {
                return langObj.LanguageCode;
            }
        }
        return 'ENG';
    }

    public ClientSideValues = {
        Fetch: function (param: string): any {
            let result: any;
            //TODO
            switch (param) {
                case 'FullAccess':
                    result = 'Full';
                    break;
                case 'BranchNumber': //Refer utils class getLoggedInBranch()
                    result = '3';
                    break;
            }
            return result;
        }
    };

    public enableButton(btnsObj: any, enableBtn: string): any {
        let onButton = enableBtn.toLowerCase();
        for (let btn in btnsObj) {
            if (btn) {
                btnsObj[btn] = false;
                if (btn === onButton) btnsObj[btn] = true;
            }
        }
        return btnsObj;
    }

    public resetCtrl(ctrlObj: any[]): void {
        for (let i = 0; i < ctrlObj.length; i++) {
            ctrlObj[i].value = '';
        }
    }

    public disableFormFields(formGroup: FormGroup): void {
        for (let control in formGroup.controls) {
            if (control) {
                formGroup.controls[control].disable();
            }
        }
    }

    public updateCtrl(ctrlObj: any[], name: string, key: string, value: any, doTranslate?: boolean): void {
        if (doTranslate) {
            this.utils.getTranslatedval(value).then((res: string) => {
                // this.logger.log('UpdateCtrl - doTranslate', key, value, res);
                if (res) {
                    for (let i = 0; i < ctrlObj.length; i++) {
                        if (ctrlObj[i].name === name && ctrlObj[i].hasOwnProperty(key)) {
                            ctrlObj[i][key] = res;
                            break;
                        }
                    }
                }
            });
        } else {
            for (let i = 0; i < ctrlObj.length; i++) {
                if (ctrlObj[i].name === name && ctrlObj[i].hasOwnProperty(key)) {
                    if (typeof value === 'undefined') value = '';
                    ctrlObj[i][key] = value;
                    //this.logger.log('VALUE SET', i, name, key, value);
                    break;
                }
            }
        }
    }

    public updateCtrlValue(valueObj: any, ctrlObj: any): void {
        for (let i in valueObj) {
            if (i !== '') {
                if (valueObj[i] !== '') {
                    this.updateCtrl(ctrlObj, i, 'value', valueObj[i]);
                }
            }
        }
    }

    public getAllCtrl(ctrlObj: any[]): any[] {
        let retCtrls = [];
        for (let i = 0; i < ctrlObj.length; i++) {
            retCtrls.push(ctrlObj[i].name);
        }
        return retCtrls;
    }

    /** Bridge Base Class Imlpementation  - Start */
    public createPageObject(FormGrp: FormGroup, control: any, self?: any, grid?: any): any {
        let fb = {};
        if (control) {
            if (control.hasOwnProperty('fromGroup')) {
                let fbctrl = control.fromGroup;
                for (let i in fbctrl) {
                    if (i !== '') {
                        fb[i] = fbctrl[i].value;
                    }
                }
            } else {
                for (let i in control) {
                    if (control[i].hasOwnProperty('name')) {
                        fb[control[i].name] = this.riInputElement.GetValue(FormGrp, control[i].name);
                    }
                }
            }
        }
        return {
            self: (typeof self !== 'undefined') ? self : {},
            grid: (typeof grid !== 'undefined') ? grid : {},
            fb: fb
        };
    }
    public initBridge(pageObj: any): void {
        // this.logger.log('RiExchange - initBridge', pageObj);
        this.bridgeBaseClass = pageObj;
    }
    public getBridgeObjValue(inputKey: string): any {
        let ret = '';
        if (typeof this.bridgeBaseClass !== 'undefined') {
            //1st Level
            for (let key in this.bridgeBaseClass) {
                if (this.bridgeBaseClass.hasOwnProperty(key)) {
                    if (key === inputKey) {
                        ret = this.bridgeBaseClass[key];
                        return ret;
                    }
                    //2nd level
                    let obj = this.bridgeBaseClass[key];
                    for (let childkey in obj) {
                        if (obj.hasOwnProperty(childkey)) {
                            if (childkey === inputKey) {
                                ret = obj[childkey];
                                return ret;
                            }
                            else {
                                //3rd level
                                let subChildObj = obj[childkey];
                                for (let subKey in subChildObj) {
                                    if (subKey === inputKey) {
                                        ret = subChildObj[subKey];
                                        return ret;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return ret;
    }
    /** Bridge Base Class Imlpementation  - End */

    /**
     * New Implementation
     * ===========================================================================================
     */



    public getNavigationStackInstance(): Stack<NavData> {
        if (this.navigationStack) {
            return this.navigationStack;
        } else {
            this.navigationStack = new Stack<NavData>();
            try {
                let navStackObj = JSON.parse(this._ss.retrieve('NAVIGATION_STACK') || '{}');
                if (navStackObj && navStackObj._store) {
                    for (let i = 0; i < navStackObj._store.length; i++) {
                        let obj = navStackObj._store[i];
                        let data = new NavData();
                        data.setPageData(obj['pageData']);
                        data.setExchangeMode(obj['exchangeMode']);
                        data.setBackLabel(obj['backLabel']);
                        data.setPageId(obj['pageId']);
                        data.setFormData(obj['formData']);
                        data.setPageAttributes(obj['pageAttributes']);
                        data.setBackRoute(obj['backroute']);
                        this.navigationStack.push(data);
                    }
                }
            } catch (e) {
                this.logger.info('Stack empty');
            }
            return this.navigationStack;
        }
    }

    /**
     * Push the page data into the stack
     */
    public pushInNavigationData(obj: NavData): void {
        this.getNavigationStackInstance().push(obj);
        this._ss.store('NAVIGATION_STACK', JSON.stringify(this.navigationStack));
    }

    /**
     * Pop the page data from the stack
     */
    public popNavigationData(): void {
        this.getNavigationStackInstance().pop();
        this._ss.store('NAVIGATION_STACK', JSON.stringify(this.navigationStack));
    }

    /**
     * Clear the page data from the stack
     */
    public clearNavigationData(): void {
        this._ss.store('NAVIGATION_STACK', '');
        if (this.navigationStack) {
            this.navigationStack.clear();
        }
    }

    /**
     * Get the last page data from the stack
     */
    public getLastStackData(): NavData {
        return this.getNavigationStackInstance().getLast();
    }

    public getParentHTMLValue(fieldName: string): string {
        let ret: string = '';
        if (this.routerParams) {
            ret = this.routerParams[fieldName];
        }
        let data: NavData = this.getNavigationStackInstance().getLast();
        if (!ret && data) {
            let formData = data.getFormData();
            if (formData) {
                ret = formData[fieldName];
            }
            if (!ret) {
                let params: any = data.getPageData();
                if (params) {
                    if (typeof params[fieldName] !== 'undefined') {
                        ret = params[fieldName];
                    }
                }
            }
        }
        try {
            this.riInputElement.SetValue(this.currentForm, fieldName, ret);
        } catch (e) {
            //Ignore, the field does not exist
        }
        if (this.routeReadCallbk) {
            this.routeReadCallbk.handleBookmark(fieldName, ret);
        }
        return ret;
    }
    public getParentHTMLValues(): any {
        let data: NavData = this.getNavigationStackInstance().getLast();
        if (data) {
            return JSON.parse(JSON.stringify(data.getFormData()));
        } else {
            return {};
        }
    }

    public getParentAttributeValue(fieldName: string): string {
        let ret: string = '';
        if (this.routerParams) {
            ret = this.routerParams[fieldName];
        }
        let data: NavData = this.getNavigationStackInstance().getLast();
        if (!ret && data) {
            let attributes = data.getPageAttributes();
            if (attributes)
                ret = attributes[fieldName];
        }
        if (this.routeReadCallbk) {
            this.routeReadCallbk.handleBookmark(fieldName, ret);
        }
        return ret;
    }

    public setParentHTMLValue(fieldName: string, value?: any): void {
        let data: NavData = this.getNavigationStackInstance().getLast();
        if (data) {
            this.getNavigationStackInstance().pop();
            if (value !== null && value !== undefined) {
                let params: any = data.getPageData();
                if (data.getFormData()) {
                    data.getFormData()[fieldName] = value;
                }
                if (params) {
                    if (typeof params[fieldName] !== 'undefined') {
                        params[fieldName] = value;
                    }
                    data.setPageData(params);
                }
            }
            this.getNavigationStackInstance().push(data);
        }
    }

    public setParentAttributeValue(fieldName: string, value: any): void {
        let data: NavData = this.getNavigationStackInstance().getLast();
        if (data) {
            this.getNavigationStackInstance().pop();
            data.getPageAttributes()[fieldName] = value;
            this.getNavigationStackInstance().push(data);
        }
    }

    public getBackLabel(): string {
        let ret: string = '';
        let data: NavData = this.getNavigationStackInstance().getLast();
        if (data) {
            ret = data.getBackLabel();
        }
        if (!ret && this.routerParams) {
            ret = this.routerParams['backLabel'];
        }
        return ret;
    }

    public getBackRoute(): string {
        let ret: string = '';
        let data: NavData = this.getNavigationStackInstance().getLast();
        if (data) {
            ret = data.getBackRoute();
        }
        return ret;
    }

    public getParentMode(): string {
        let ret: string = '';
        if (this.routerParams) {
            ret = this.routerParams['parentMode'];
        }
        let data: NavData = this.getNavigationStackInstance().getLast();
        if (!ret && data) {
            ret = data.getExchangeMode();
        }
        if (this.routeReadCallbk) {
            this.routeReadCallbk.handleBookmark('parentMode', ret);
        }
        return ret;
    }

    public setCurrentContractType(): string {
        let ret: string = '';
        if (this.routerParams) {
            ret = this.routerParams['currentContractType'] || this.routerParams['CurrentContractType'];
        }
        if (!ret && this.routerParams['currentContractTypeURLParameter']) {
            ret = this.utils.getCurrentContractType(this.routerParams['currentContractTypeURLParameter']);
        }
        if (!ret) {
            ret = 'C';
        }
        return ret;
    }

    public getCurrentContractType(): string {
        let ret: string = '';
        if (this.routerParams) {
            ret = this.routerParams['currentContractType'];
        }
        if (!ret && this.routerParams['contractTypeCode']) {
            ret = this.routerParams['contractTypeCode'];
        }
        if (!ret && this.routerParams['currentContractTypeURLParameter']) {
            ret = this.utils.getCurrentContractType(this.routerParams['currentContractTypeURLParameter']);
        }
        let data: NavData = this.getNavigationStackInstance().getLast();
        if (!ret && data && data.getPageData()) {
            ret = data.getPageData()['currentContractType'];
        }
        if (!ret) {
            ret = 'C';
        }
        if (this.routeReadCallbk) {
            this.routeReadCallbk.handleBookmark('currentContractType', ret);
        }
        return ret;
    }

    public getCurrentContractTypeUrlParam(): string {
        let ret: string = '';
        let urlParam = '';
        if (this.routerParams) {
            ret = this.routerParams['currentContractType'];
        }
        if (!ret && this.routerParams['currentContractTypeURLParameter']) {
            ret = this.utils.getCurrentContractType(this.routerParams['currentContractTypeURLParameter']);
        }
        let data: NavData = this.getNavigationStackInstance().getLast();
        if (!ret && data && data.getPageData()) {
            ret = data.getPageData()['currentContractType'];
        }
        if (!ret) {
            ret = 'C';
        }
        switch (ret) {
            case 'J':
                urlParam = '<job>';
                break;
            case 'P':
                urlParam = '<product>';
                break;
            default:
            case 'C':
                urlParam = '<contract';

        }
        if (this.routeReadCallbk) {
            this.routeReadCallbk.handleBookmark('currentContractTypeURLParameter', urlParam);
        }
        return urlParam;
    }

    public getCurrentContractTypeLabel(): string {
        let ret: string = '';
        if (this.routerParams) {
            ret = this.routerParams['currentContractTypeLabel'];
        }
        if (!ret && this.routerParams['currentContractTypeURLParameter']) {
            let type = this.utils.getCurrentContractType(this.routerParams['currentContractTypeURLParameter']);
            ret = this.utils.getCurrentContractLabel(type);
        }
        if (!ret && this.routerParams['currentContractType']) {
            ret = this.utils.getCurrentContractLabel(this.routerParams['currentContractType']);
        }
        let data: NavData = this.getNavigationStackInstance().getLast();
        if (!ret && data && data.getPageData()) {
            ret = data.getPageData()['currentContractTypeLabel'];
        }
        if (!ret) {
            ret = 'Contract';
        }
        if (this.routeReadCallbk) {
            this.routeReadCallbk.handleBookmark('currentContractTypeLabel', ret);
        }
        return ret;
    }

    public printNavStack(): void {
        this.logger.log('Navigation stack === ', this.getNavigationStackInstance());
    }

    //===================================== For backward compatibility ==========================================/
    public setRouterUrlParams(param: any): void {
        this.routerUrlParams = param;
    }

    public getRouterUrlParams(): void {
        return this.routerUrlParams;
    }

    public setRouterParams(param: any): void {
        this.routerParams = param;
    }

    public getRouterParams(): void {
        return this.routerParams;
    }

    public clearRouterParams(): void {
        this.routerParams = {};
    }
}
