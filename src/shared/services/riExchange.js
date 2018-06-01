import { LANGUAGE_MAP } from './languagemap';
import { NavData } from './navigationData';
import { Stack } from './Stack';
import { Injectable } from '@angular/core';
import { Logger } from '@nsalaun/ng2-logger';
import { FormControl, Validators } from '@angular/forms';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { Store } from '@ngrx/store';
import { Utils } from './utility';
export var RiExchange = (function () {
    function RiExchange(logger, utils, ls, _ss, store) {
        this.logger = logger;
        this.utils = utils;
        this.ls = ls;
        this._ss = _ss;
        this.store = store;
        this.storeName = '';
        this.routerParams = {};
        this.routerUrlParams = {};
        this.Busy = false;
        this.riInputElement = {
            Add: function (FormGrp, FieldName) {
                if (!FormGrp.controls.hasOwnProperty(FieldName)) {
                    FormGrp.addControl(FieldName, new FormControl());
                    FormGrp.controls[FieldName].setValue('');
                    FormGrp.controls[FieldName]['readonly'] = false;
                }
            },
            Disable: function (FormGrp, FieldName) {
                if (FormGrp.controls.hasOwnProperty(FieldName)) {
                    FormGrp.controls[FieldName].disable();
                }
            },
            isDisabled: function (FormGrp, FieldName) {
                if (FormGrp.controls.hasOwnProperty(FieldName)) {
                    return FormGrp.controls[FieldName].disabled;
                }
            },
            Enable: function (FormGrp, FieldName) {
                if (FormGrp.controls.hasOwnProperty(FieldName)) {
                    FormGrp.controls[FieldName].enable();
                    FormGrp.controls[FieldName]['readonly'] = false;
                }
            },
            ReadOnly: function (FormGrp, FieldName, readonly) {
                if (FormGrp.controls.hasOwnProperty(FieldName)) {
                    FormGrp.controls[FieldName]['readonly'] = readonly;
                }
            },
            isReadOnly: function (FormGrp, FieldName) {
                if (FormGrp.controls.hasOwnProperty(FieldName)) {
                    return FormGrp.controls[FieldName]['readonly'];
                }
            },
            Status: function (FormGrp, FieldName) {
                if (FormGrp.controls.hasOwnProperty(FieldName)) {
                    return FormGrp.controls[FieldName];
                }
            },
            SetValue: function (FormGrp, FieldName, Value) {
                if (FormGrp.controls.hasOwnProperty(FieldName)) {
                    FormGrp.controls[FieldName].setValue(Value);
                }
            },
            MarkAsDirty: function (FormGrp, FieldName) {
                if (FormGrp.controls.hasOwnProperty(FieldName)) {
                    FormGrp.controls[FieldName].markAsDirty();
                }
            },
            MarkAsPristine: function (FormGrp, FieldName) {
                if (FormGrp.controls.hasOwnProperty(FieldName)) {
                    FormGrp.controls[FieldName].markAsPristine();
                }
            },
            HasChanged: function (FormGrp, FieldName) {
                if (FormGrp.controls.hasOwnProperty(FieldName)) {
                    return FormGrp.controls[FieldName].dirty;
                }
            },
            GetValue: function (FormGrp, FieldName) {
                if (FormGrp.controls.hasOwnProperty(FieldName)) {
                    return (typeof FormGrp.controls[FieldName].value !== 'undefined') ? FormGrp.controls[FieldName].value : '';
                }
                else
                    return '';
            },
            checked: function (FormGrp, FieldName) {
                if (FormGrp.controls.hasOwnProperty(FieldName)) {
                    var val = FormGrp.controls[FieldName].value;
                    if (typeof val === 'boolean') {
                        return val;
                    }
                    else if (typeof val === 'string') {
                        return val.toLowerCase() === 'true';
                    }
                    else {
                        return false;
                    }
                }
                else
                    return false;
            },
            SetLookUpStatus: function (FormGrp, FieldName, Value) {
                if (FormGrp.controls.hasOwnProperty(FieldName)) {
                }
                else
                    return '';
            },
            SetErrorStatus: function (FormGrp, FieldName, Value) {
                if (FormGrp.controls.hasOwnProperty(FieldName)) {
                    if (Value) {
                        FormGrp.controls[FieldName].setValidators(Validators.pattern('https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)'));
                        FormGrp.controls[FieldName].markAsTouched();
                    }
                    else {
                        FormGrp.controls[FieldName].setValidators(null);
                        FormGrp.controls[FieldName].markAsTouched();
                    }
                }
            },
            SetRequiredStatus: function (FormGrp, FieldName, Value) {
                if (FormGrp.controls.hasOwnProperty(FieldName)) {
                    if (Value) {
                        FormGrp.controls[FieldName].setValidators(Validators.required);
                    }
                    else {
                        FormGrp.controls[FieldName].setValidators(null);
                    }
                    FormGrp.controls[FieldName].updateValueAndValidity();
                }
            },
            markAsError: function (FormGrp, FieldName) {
                if (FormGrp.controls.hasOwnProperty(FieldName)) {
                    FormGrp.controls[FieldName].setErrors({ 'incorrect': true });
                }
            },
            isError: function (FormGrp, FieldName) {
                if (FormGrp.controls.hasOwnProperty(FieldName)) {
                    FormGrp.controls[FieldName].markAsTouched();
                    return FormGrp.controls[FieldName].invalid;
                }
                else
                    return true;
            },
            isCorrect: function (FormGrp, FieldName) {
                if (FormGrp.controls.hasOwnProperty(FieldName)) {
                    FormGrp.controls[FieldName].markAsUntouched();
                    return FormGrp.controls[FieldName].valid;
                }
                else
                    return true;
            },
            isNumber: function (FormGrp, FieldName) {
                if (isNaN(parseInt(FormGrp.controls[FieldName].value, 10))) {
                    FormGrp.controls[FieldName].markAsTouched();
                    return FormGrp.controls[FieldName].invalid;
                }
                else
                    return true;
            }
        };
        this.ClientSideValues = {
            Fetch: function (param) {
                var result;
                switch (param) {
                    case 'FullAccess':
                        result = 'Full';
                        break;
                    case 'BranchNumber':
                        result = '3';
                        break;
                }
                return result;
            }
        };
    }
    RiExchange.prototype.ngOnInit = function () {
    };
    RiExchange.prototype.ngOnDestroy = function () {
        this.killStore();
    };
    RiExchange.prototype.releaseReference = function (ref) {
        for (var i in ref) {
            if (i)
                ref[i] = null;
        }
        ref = null;
    };
    RiExchange.prototype.setRouteCallback = function (cbk) {
        this.routeReadCallbk = cbk;
    };
    RiExchange.prototype.killStore = function () {
        if (this.storeSubscription) {
            this.storeName = '';
            this.storeSubscription.unsubscribe();
        }
    };
    RiExchange.prototype.getStore = function (storeName) {
        var _this = this;
        if (this.storeName !== storeName) {
            this.killStore();
            this.storeName = storeName;
            this.storeSubscription = this.store.select(storeName).subscribe(function (data) {
                _this.storeData = data;
            });
        }
    };
    RiExchange.prototype.setStore = function (action, payload, _a) {
        var _b = (_a === void 0 ? {} : _a).append, append = _b === void 0 ? true : _b;
        var newStoreData = this.storeData;
        if (append) {
            for (var key in payload) {
                if (key !== '') {
                    newStoreData.data[key] = payload[key];
                }
            }
        }
        this.store.dispatch({ type: action, payload: newStoreData });
    };
    RiExchange.prototype.getStoreValue = function (key) {
        var ret = '';
        if (typeof this.storeData !== 'undefined') {
            for (var key_1 in this.storeData) {
                if (this.storeData.hasOwnProperty(key_1)) {
                    var obj = this.storeData[key_1];
                    for (var childkey in obj) {
                        if (obj.hasOwnProperty(childkey)) {
                            if (childkey === key_1) {
                                ret = obj[childkey];
                                return ret;
                            }
                        }
                    }
                }
            }
        }
        return ret;
    };
    RiExchange.prototype.GetParentHTMLInputElementAttribute = function (DataObj, AttributeName) {
        return this.GetParentHTMLInputValue(DataObj, AttributeName);
    };
    RiExchange.prototype.GetParentHTMLInputValue = function (DataObj, InputName, useBridgeObj, checkBox) {
        var resp = '';
        if (typeof DataObj !== 'undefined') {
            if (DataObj.hasOwnProperty(InputName)) {
                if (typeof DataObj[InputName] === 'string') {
                    resp = DataObj[InputName].trim();
                }
                else {
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
        return resp;
    };
    RiExchange.prototype.SetParentHTMLInputElementAttribute = function (action, payload) {
        this.SetParentHTMLInputValue(action, payload);
    };
    RiExchange.prototype.SetParentHTMLInputValue = function (action, payload) {
        this.setStore(action, payload);
    };
    RiExchange.prototype.renderParentFields = function (DataObj, FormGrp, FieldName) {
        var value = this.GetParentHTMLInputValue(DataObj, FieldName);
        this.riInputElement.SetValue(FormGrp, FieldName, value);
    };
    RiExchange.prototype.ParentMode = function (DataObj) {
        var resp = '';
        if (DataObj.hasOwnProperty('parentMode')) {
            resp = DataObj.parentMode;
        }
        else if (DataObj.hasOwnProperty('parent')) {
            resp = DataObj.parent;
        }
        if (resp === '') {
            if (typeof this.storeData !== 'undefined') {
                if (this.storeData.data.hasOwnProperty('parentMode')) {
                    resp = this.storeData.data['parentMode'].trim();
                }
                else if (this.storeData.data.hasOwnProperty('parent')) {
                    resp = this.storeData.data['parent'].trim();
                }
                else if (this.storeData.sentFromParent.hasOwnProperty('parentMode')) {
                    resp = this.storeData.sentFromParent['parentMode'].trim();
                }
                else if (this.storeData.sentFromParent.hasOwnProperty('parent')) {
                    resp = this.storeData.sentFromParent['parent'].trim();
                }
            }
        }
        return resp;
    };
    RiExchange.prototype.renderForm = function (FormGrp, ctrlObj) {
        var controls = ctrlObj;
        for (var i = 0; i < controls.length; i++) {
            if (controls[i].name !== '') {
                var ctrl = controls[i];
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
    };
    RiExchange.prototype.updateUiFields = function (data, FormGrp, ctrlObj) {
        for (var i in data) {
            if (i !== '') {
                if (data[i] === 'No' || data[i] === 'NO' || data[i] === 'no' || data[i] === 'N')
                    data[i] = false;
                if (data[i] === 'Yes' || data[i] === 'YES' || data[i] === 'yes' || data[i] === 'Y')
                    data[i] = true;
                this.riInputElement.SetValue(FormGrp, i, data[i]);
                this.updateCtrl(ctrlObj, i, 'value', data[i]);
            }
        }
    };
    RiExchange.prototype.getCtrlType = function (ctrlObj, name) {
        var dataType = '';
        for (var i = 0; i < ctrlObj.length; i++) {
            if (ctrlObj[i].name === name && ctrlObj[i].hasOwnProperty('type')) {
                dataType = ctrlObj[i].type;
                break;
            }
        }
        return dataType;
    };
    RiExchange.prototype.validateForm = function (formGroup) {
        var isValid = true;
        for (var control in formGroup.controls) {
            if (!control) {
                continue;
            }
            if (formGroup.controls[control].invalid) {
                var elem = document.querySelector('#' + control);
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
                isValid = false;
                formGroup.controls[control].markAsTouched();
                this.logger.log('validateForm -- INVALID formControl:', control);
            }
        }
        return isValid;
    };
    RiExchange.prototype.URLParameterContains = function (param) {
        var flag = false;
        if (this.routerParams && this.routerParams.hasOwnProperty(param))
            flag = true;
        return flag;
    };
    ;
    RiExchange.prototype.GetParentRowID = function (DataObj, name) {
        return this.GetParentHTMLInputValue(DataObj, name);
    };
    ;
    RiExchange.prototype.LanguageCode = function () {
        var setUpInfo = this.ls.retrieve('SETUP_INFO');
        if (setUpInfo && setUpInfo.localeCultureCode && setUpInfo.localeCultureCode.localeCode) {
            return this.readLanguageMappingJson(setUpInfo.localeCultureCode.localeCode);
        }
        else {
            return 'ENG';
        }
    };
    RiExchange.prototype.readLanguageMappingJson = function (langCode) {
        var langMap = LANGUAGE_MAP.ttLanguageMapping;
        for (var i = 0; i < langMap.length; i++) {
            var langObj = langMap[i];
            if (langCode === langObj.LocaleCode) {
                return langObj.LanguageCode;
            }
        }
        return 'ENG';
    };
    RiExchange.prototype.enableButton = function (btnsObj, enableBtn) {
        var onButton = enableBtn.toLowerCase();
        for (var btn in btnsObj) {
            if (btn) {
                btnsObj[btn] = false;
                if (btn === onButton)
                    btnsObj[btn] = true;
            }
        }
        return btnsObj;
    };
    RiExchange.prototype.resetCtrl = function (ctrlObj) {
        for (var i = 0; i < ctrlObj.length; i++) {
            ctrlObj[i].value = '';
        }
    };
    RiExchange.prototype.disableFormFields = function (formGroup) {
        for (var control in formGroup.controls) {
            if (control) {
                formGroup.controls[control].disable();
            }
        }
    };
    RiExchange.prototype.updateCtrl = function (ctrlObj, name, key, value, doTranslate) {
        if (doTranslate) {
            this.utils.getTranslatedval(value).then(function (res) {
                if (res) {
                    for (var i = 0; i < ctrlObj.length; i++) {
                        if (ctrlObj[i].name === name && ctrlObj[i].hasOwnProperty(key)) {
                            ctrlObj[i][key] = res;
                            break;
                        }
                    }
                }
            });
        }
        else {
            for (var i = 0; i < ctrlObj.length; i++) {
                if (ctrlObj[i].name === name && ctrlObj[i].hasOwnProperty(key)) {
                    if (typeof value === 'undefined')
                        value = '';
                    ctrlObj[i][key] = value;
                    break;
                }
            }
        }
    };
    RiExchange.prototype.updateCtrlValue = function (valueObj, ctrlObj) {
        for (var i in valueObj) {
            if (i !== '') {
                if (valueObj[i] !== '') {
                    this.updateCtrl(ctrlObj, i, 'value', valueObj[i]);
                }
            }
        }
    };
    RiExchange.prototype.getAllCtrl = function (ctrlObj) {
        var retCtrls = [];
        for (var i = 0; i < ctrlObj.length; i++) {
            retCtrls.push(ctrlObj[i].name);
        }
        return retCtrls;
    };
    RiExchange.prototype.createPageObject = function (FormGrp, control, self, grid) {
        var fb = {};
        if (control) {
            if (control.hasOwnProperty('fromGroup')) {
                var fbctrl = control.fromGroup;
                for (var i in fbctrl) {
                    if (i !== '') {
                        fb[i] = fbctrl[i].value;
                    }
                }
            }
            else {
                for (var i in control) {
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
    };
    RiExchange.prototype.initBridge = function (pageObj) {
        this.bridgeBaseClass = pageObj;
    };
    RiExchange.prototype.getBridgeObjValue = function (inputKey) {
        var ret = '';
        if (typeof this.bridgeBaseClass !== 'undefined') {
            for (var key in this.bridgeBaseClass) {
                if (this.bridgeBaseClass.hasOwnProperty(key)) {
                    if (key === inputKey) {
                        ret = this.bridgeBaseClass[key];
                        return ret;
                    }
                    var obj = this.bridgeBaseClass[key];
                    for (var childkey in obj) {
                        if (obj.hasOwnProperty(childkey)) {
                            if (childkey === inputKey) {
                                ret = obj[childkey];
                                return ret;
                            }
                            else {
                                var subChildObj = obj[childkey];
                                for (var subKey in subChildObj) {
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
    };
    RiExchange.prototype.getNavigationStackInstance = function () {
        if (this.navigationStack) {
            return this.navigationStack;
        }
        else {
            this.navigationStack = new Stack();
            try {
                var navStackObj = JSON.parse(this._ss.retrieve('NAVIGATION_STACK') || '{}');
                if (navStackObj && navStackObj._store) {
                    for (var i = 0; i < navStackObj._store.length; i++) {
                        var obj = navStackObj._store[i];
                        var data = new NavData();
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
            }
            catch (e) {
                this.logger.info('Stack empty');
            }
            return this.navigationStack;
        }
    };
    RiExchange.prototype.pushInNavigationData = function (obj) {
        this.getNavigationStackInstance().push(obj);
        this._ss.store('NAVIGATION_STACK', JSON.stringify(this.navigationStack));
    };
    RiExchange.prototype.popNavigationData = function () {
        this.getNavigationStackInstance().pop();
        this._ss.store('NAVIGATION_STACK', JSON.stringify(this.navigationStack));
    };
    RiExchange.prototype.clearNavigationData = function () {
        this._ss.store('NAVIGATION_STACK', '');
        if (this.navigationStack) {
            this.navigationStack.clear();
        }
    };
    RiExchange.prototype.getLastStackData = function () {
        return this.getNavigationStackInstance().getLast();
    };
    RiExchange.prototype.getParentHTMLValue = function (fieldName) {
        var ret = '';
        if (this.routerParams) {
            ret = this.routerParams[fieldName];
        }
        var data = this.getNavigationStackInstance().getLast();
        if (!ret && data) {
            var formData = data.getFormData();
            if (formData)
                ret = formData[fieldName];
        }
        try {
            this.riInputElement.SetValue(this.currentForm, fieldName, ret);
        }
        catch (e) {
        }
        if (this.routeReadCallbk) {
            this.routeReadCallbk.handleBookmark(fieldName, ret);
        }
        return ret;
    };
    RiExchange.prototype.getParentHTMLValues = function () {
        var data = this.getNavigationStackInstance().getLast();
        if (data) {
            return JSON.parse(JSON.stringify(data.getFormData()));
        }
        else {
            return {};
        }
    };
    RiExchange.prototype.getParentAttributeValue = function (fieldName) {
        var ret = '';
        if (this.routerParams) {
            ret = this.routerParams[fieldName];
        }
        var data = this.getNavigationStackInstance().getLast();
        if (!ret && data) {
            var attributes = data.getPageAttributes();
            if (attributes)
                ret = attributes[fieldName];
        }
        if (this.routeReadCallbk) {
            this.routeReadCallbk.handleBookmark(fieldName, ret);
        }
        return ret;
    };
    RiExchange.prototype.setParentHTMLValue = function (fieldName, value) {
        var data = this.getNavigationStackInstance().getLast();
        if (data) {
            if (value) {
                data.getFormData()[fieldName] = value;
            }
            this.getNavigationStackInstance().push(data);
        }
    };
    RiExchange.prototype.setParentAttributeValue = function (fieldName, value) {
        var data = this.getNavigationStackInstance().getLast();
        if (data) {
            data.getPageAttributes()[fieldName] = value;
            this.getNavigationStackInstance().push(data);
        }
    };
    RiExchange.prototype.getBackLabel = function () {
        var ret = '';
        var data = this.getNavigationStackInstance().getLast();
        if (data) {
            ret = data.getBackLabel();
        }
        if (!ret && this.routerParams) {
            ret = this.routerParams['backLabel'];
        }
        return ret;
    };
    RiExchange.prototype.getBackRoute = function () {
        var ret = '';
        var data = this.getNavigationStackInstance().getLast();
        if (data) {
            ret = data.getBackRoute();
        }
        return ret;
    };
    RiExchange.prototype.getParentMode = function () {
        var ret = '';
        if (this.routerParams) {
            ret = this.routerParams['parentMode'];
        }
        var data = this.getNavigationStackInstance().getLast();
        if (!ret && data) {
            ret = data.getExchangeMode();
        }
        if (this.routeReadCallbk) {
            this.routeReadCallbk.handleBookmark('parentMode', ret);
        }
        return ret;
    };
    RiExchange.prototype.setCurrentContractType = function () {
        var ret = '';
        if (this.routerParams) {
            ret = this.routerParams['currentContractType'];
        }
        if (!ret && this.routerParams['currentContractTypeURLParameter']) {
            ret = this.utils.getCurrentContractType(this.routerParams['currentContractTypeURLParameter']);
        }
        if (!ret) {
            ret = 'C';
        }
        return ret;
    };
    RiExchange.prototype.getCurrentContractType = function () {
        var ret = '';
        if (this.routerParams) {
            ret = this.routerParams['currentContractType'];
        }
        if (!ret && this.routerParams['currentContractTypeURLParameter']) {
            ret = this.utils.getCurrentContractType(this.routerParams['currentContractTypeURLParameter']);
        }
        var data = this.getNavigationStackInstance().getLast();
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
    };
    RiExchange.prototype.getCurrentContractTypeUrlParam = function () {
        var ret = '';
        var urlParam = '';
        if (this.routerParams) {
            ret = this.routerParams['currentContractType'];
        }
        if (!ret && this.routerParams['currentContractTypeURLParameter']) {
            ret = this.utils.getCurrentContractType(this.routerParams['currentContractTypeURLParameter']);
        }
        var data = this.getNavigationStackInstance().getLast();
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
    };
    RiExchange.prototype.getCurrentContractTypeLabel = function () {
        var ret = '';
        if (this.routerParams) {
            ret = this.routerParams['currentContractTypeLabel'];
        }
        if (!ret && this.routerParams['currentContractTypeURLParameter']) {
            var type = this.utils.getCurrentContractType(this.routerParams['currentContractTypeURLParameter']);
            ret = this.utils.getCurrentContractLabel(type);
        }
        if (!ret && this.routerParams['currentContractType']) {
            ret = this.utils.getCurrentContractLabel(this.routerParams['currentContractType']);
        }
        var data = this.getNavigationStackInstance().getLast();
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
    };
    RiExchange.prototype.printNavStack = function () {
        this.logger.log('Navigation stack === ', this.getNavigationStackInstance());
    };
    RiExchange.prototype.setRouterUrlParams = function (param) {
        this.routerUrlParams = param;
    };
    RiExchange.prototype.getRouterUrlParams = function () {
        return this.routerUrlParams;
    };
    RiExchange.prototype.setRouterParams = function (param) {
        this.routerParams = param;
    };
    RiExchange.prototype.getRouterParams = function () {
        return this.routerParams;
    };
    RiExchange.prototype.clearRouterParams = function () {
        this.routerParams = {};
    };
    RiExchange.decorators = [
        { type: Injectable },
    ];
    RiExchange.ctorParameters = [
        { type: Logger, },
        { type: Utils, },
        { type: LocalStorageService, },
        { type: SessionStorageService, },
        { type: Store, },
    ];
    return RiExchange;
}());
