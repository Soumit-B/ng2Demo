import { URLSearchParams } from '@angular/http';
import { ContactActionTypes } from './../../../../actions/contact';
import { RiExchange } from './../../../../../shared/services/riExchange';
import { Utils } from './../../../../../shared/services/utility';
import { HttpService } from './../../../../../shared/services/http-service';
import { AjaxObservableConstant } from './../../../../../shared/constants/ajax-observable.constant';
import { ServiceConstants } from './../../../../../shared/constants/service.constants';
import { SpeedScriptConstants } from './../../../../../shared/constants/speed-script.constant';
import { LocaleTranslationService } from './../../../../../shared/services/translation.service';
import { BehaviorSubject } from 'rxjs/Rx';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Component, ViewChild } from '@angular/core';
export var ContactPersonTypeBComponent = (function () {
    function ContactPersonTypeBComponent(fb, store, riExchange, utils, httpService, ajaxconstant, serviceConstants, speedScriptConstants, localeTranslateService) {
        this.fb = fb;
        this.store = store;
        this.riExchange = riExchange;
        this.utils = utils;
        this.httpService = httpService;
        this.ajaxconstant = ajaxconstant;
        this.serviceConstants = serviceConstants;
        this.speedScriptConstants = speedScriptConstants;
        this.localeTranslateService = localeTranslateService;
        this.contactDetailsFormGroup = new FormGroup({});
        this.ajaxSource = new BehaviorSubject(0);
        this.headerParams = {
            method: 'ccm/maintenance',
            module: 'customer',
            operation: 'ContactManagement/iCABSCMContactPersonMaintenance'
        };
        this.dropdownFlag = false;
        this.effectiveFromDateRequired = false;
        this.contactPersonNameRequired = false;
        this.contactPersonPositionRequired = false;
        this.contactPersonTelephoneRequired = false;
        this.changeTypeIDArray = [];
        this.portfolioRoles = [];
        this.changeTypeIDSelectDisabled = true;
        this.showAddPortfolioLevel = false;
        this.pageParams = {};
        this.storeFieldValues = {};
    }
    ContactPersonTypeBComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.localeTranslateService.setUpTranslation();
        this.iContactPersonAddCount = 0;
        this.storeSubscription = this.store.select('contact').subscribe(function (data) {
            switch (data['action']) {
                case ContactActionTypes.SAVE_SYSCHAR:
                    if (data !== null && data['sysChar'] && !(Object.keys(data['sysChar']).length === 0 && data['sysChar'].constructor === Object)) {
                        _this.glSCCapitalFirstLtr = data['sysChar'].glSCCapitalFirstLtr;
                    }
                    break;
                case ContactActionTypes.SAVE_FIELD:
                    if (data !== null && data['fieldValue'] && !(Object.keys(data['fieldValue']).length === 0 && data['fieldValue'].constructor === Object)) {
                        _this.storeFieldValues = data['fieldValue'];
                        if (_this.cUpdateMode !== 'ADD') {
                            _this.updateFieldValues(data['fieldValue']);
                        }
                        else {
                            _this.addPortfolioLevelDropdown.selectedItem = _this.storeFieldValues.AddPortfolioLevelSelect;
                        }
                    }
                    break;
                case ContactActionTypes.SAVE_PARAMS:
                    if (data !== null && data['params'] && !(Object.keys(data['params']).length === 0 && data['params'].constructor === Object)) {
                        _this.pageParams = data['params'];
                        _this.prevMode = _this.cUpdateMode;
                        _this.cUpdateMode = data['params'].cUpdateMode;
                        _this.setUpdateMode();
                    }
                    break;
            }
        });
        this.initForm();
        this.loadDropDown();
    };
    ContactPersonTypeBComponent.prototype.ngOnDestroy = function () {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    };
    ContactPersonTypeBComponent.prototype.initForm = function () {
        this.contactDetailsFormGroup = this.fb.group({});
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonID');
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'EffectiveFromDate');
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'LastUpdateDate');
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'LastUpdateTime');
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'LastUpdateUserName');
        if (this.glSCCapitalFirstLtr) {
            this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonName');
            this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonPosition');
            this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonDepartment');
        }
        else {
            this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonName');
            this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonPosition');
            this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonDepartment');
        }
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonNotes');
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonTelephone');
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonMobile');
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonEmail');
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonFax');
        this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ContactPersonID');
        this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'EffectiveFromDate');
        this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'LastUpdateDate');
        this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'LastUpdateTime');
        this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'LastUpdateUserName');
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ChangeContactPersonID');
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ChangeTypeEffectiveDate');
        this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ChangeContactPersonID');
        this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ChangeTypeEffectiveDate');
        this.store.dispatch({
            type: ContactActionTypes.SET_FORM_GROUPS, payload: {
                name: 'contactDetails',
                form: this.contactDetailsFormGroup
            }
        });
    };
    ContactPersonTypeBComponent.prototype.loadDropDown = function () {
        this.portfolioRoles = [{
                value: this.speedScriptConstants.CNFPortfolioLevelGroupAccount,
                text: 'This Group Account'
            }, {
                value: this.speedScriptConstants.CNFPortfolioLevelAccount,
                text: 'This Account'
            }, {
                value: this.speedScriptConstants.CNFPortfolioLevelIGInvoice,
                text: 'This Invoice Group (Invoice)'
            }, {
                value: this.speedScriptConstants.CNFPortfolioLevelIGStatement,
                text: 'This Invoice Group (Statement)'
            }, {
                value: this.speedScriptConstants.CNFPortfolioLevelContract,
                text: 'This Contract'
            }, {
                value: this.speedScriptConstants.CNFPortfolioLevelPremise,
                text: 'This Premise'
            }];
        this.changeTypeIDArray = [{
                value: '0',
                text: 'Contact Details'
            }, {
                value: '1',
                text: 'Replaces This Contact'
            }];
    };
    ContactPersonTypeBComponent.prototype.getFieldValues = function () {
        return {
            'ContactPersonID': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'ContactPersonID'),
            'LastUpdateDate': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'LastUpdateDate'),
            'LastUpdateTime': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'LastUpdateTime'),
            'LastUpdateUserName': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'LastUpdateUserName'),
            'EffectiveFromDate': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'EffectiveFromDate'),
            'ContactPersonName': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'ContactPersonName'),
            'ContactPersonPosition': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'ContactPersonPosition'),
            'ContactPersonDepartment': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'ContactPersonDepartment'),
            'ContactPersonNotes': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'ContactPersonNotes'),
            'ContactPersonTelephone': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'ContactPersonTelephone'),
            'ContactPersonMobile': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'ContactPersonMobile'),
            'ContactPersonEmail': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'ContactPersonEmail'),
            'ContactPersonFax': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'ContactPersonFax')
        };
    };
    ContactPersonTypeBComponent.prototype.setUpdateMode = function () {
        var fieldParams = {};
        switch (this.cUpdateMode) {
            case 'NEUTRAL':
                this.effectiveFromDateRequired = false;
                this.contactPersonNameRequired = false;
                this.contactPersonPositionRequired = false;
                this.contactPersonTelephoneRequired = false;
                this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ContactPersonID');
                this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'EffectiveFromDate');
                this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ContactPersonName');
                this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ContactPersonPosition');
                this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ContactPersonDepartment');
                this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ContactPersonNotes');
                this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ContactPersonTelephone');
                this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ContactPersonMobile');
                this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ContactPersonEmail');
                this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ContactPersonFax');
                if (this.prevMode !== 'NEUTRAL') {
                    this.restoreCurrentContactFields();
                }
                break;
            case 'ADD':
                this.lRefreshContactRole = true;
                this.storeCurrentContactFields();
                if (this.cUpdateMode === 'ADD') {
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonID', 0);
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'LastUpdateDate', '');
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'LastUpdateTime', '');
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'LastUpdateUserName', '');
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'EffectiveFromDate', '');
                    var d = new Date();
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'EffectiveFromDate', this.utils.formatDate(d));
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonName', '');
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonPosition', '');
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonNotes', '');
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonNotes', '');
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonTelephone', '');
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonMobile', '');
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonEmail', '');
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonFax', '');
                }
                this.effectiveFromDateRequired = true;
                this.contactPersonNameRequired = true;
                if (this.storeFieldValues['PositionMandatory'] === 'Y') {
                    this.contactPersonPositionRequired = true;
                }
                else {
                    this.contactPersonPositionRequired = false;
                }
                if (this.storeFieldValues['TelephoneMandatory'] === 'Y') {
                    this.contactPersonTelephoneRequired = true;
                }
                else {
                    this.contactPersonTelephoneRequired = false;
                }
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonName');
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonPosition');
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonDepartment');
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonNotes');
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonTelephone');
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonMobile');
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonEmail');
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonFax');
                break;
            case 'UPDATE':
                this.lRefreshContactRole = true;
                this.storeCurrentContactFields();
                this.effectiveFromDateRequired = true;
                this.contactPersonNameRequired = true;
                if (this.storeFieldValues.PositionMandatory === 'Y') {
                    this.contactPersonPositionRequired = true;
                }
                else {
                    this.contactPersonPositionRequired = false;
                }
                if (this.storeFieldValues.TelephoneMandatory === 'Y') {
                    this.contactPersonTelephoneRequired = true;
                }
                else {
                    this.contactPersonTelephoneRequired = false;
                }
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonName');
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonPosition');
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonDepartment');
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonNotes');
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonTelephone');
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonMobile');
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonEmail');
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonFax');
                this.selectContactPerson();
                break;
        }
        this.riExchange.riInputElement.SetRequiredStatus(this.contactDetailsFormGroup, 'EffectiveFromDate', this.effectiveFromDateRequired);
        this.riExchange.riInputElement.SetRequiredStatus(this.contactDetailsFormGroup, 'ContactPersonName', this.contactPersonNameRequired);
        this.riExchange.riInputElement.SetRequiredStatus(this.contactDetailsFormGroup, 'ContactPersonPosition', this.contactPersonPositionRequired);
        this.riExchange.riInputElement.SetRequiredStatus(this.contactDetailsFormGroup, 'ContactPersonTelephone', this.contactPersonTelephoneRequired);
    };
    ContactPersonTypeBComponent.prototype.updateFieldValues = function (storeData) {
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonID', storeData.ContactPersonID);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'LastUpdateDate', storeData.LastUpdateDate);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'LastUpdateTime', storeData.LastUpdateTime);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'LastUpdateUserName', storeData.LastUpdateUserName);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'EffectiveFromDate', storeData.EffectiveFromDate);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonName', storeData.ContactPersonName);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonPosition', storeData.ContactPersonPosition);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonDepartment', storeData.ContactPersonDepartment);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonNotes', storeData.ContactPersonNotes);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonTelephone', storeData.ContactPersonTelephone);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonMobile', storeData.ContactPersonMobile);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonEmail', storeData.ContactPersonEmail);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonFax', storeData.ContactPersonFax);
    };
    ContactPersonTypeBComponent.prototype.storeCurrentContactFields = function () {
        var _fieldValues = this.getFieldValues();
        this.saveContactPersonID = _fieldValues.ContactPersonID;
        this.saveLastUpdateDate = _fieldValues.LastUpdateDate;
        this.saveLastUpdateTime = _fieldValues.LastUpdateTime;
        this.saveLastUpdateUserName = _fieldValues.LastUpdateUserName;
        this.saveEffectiveFromDate = _fieldValues.EffectiveFromDate;
        this.saveContactPersonName = _fieldValues.ContactPersonName;
        this.saveContactPersonPosition = _fieldValues.ContactPersonPosition;
        this.saveContactPersonDepartment = _fieldValues.ContactPersonDepartment;
        this.saveContactPersonNotes = _fieldValues.ContactPersonNotes;
        this.saveContactPersonTelephone = _fieldValues.ContactPersonTelephone;
        this.saveContactPersonMobile = _fieldValues.ContactPersonMobile;
        this.saveContactPersonEmail = _fieldValues.ContactPersonEmail;
        this.saveContactPersonFax = _fieldValues.ContactPersonFax;
        this.saveContactPersonHighPortfolioLevel = this.contactPersonHighPortfolioLevel;
    };
    ContactPersonTypeBComponent.prototype.restoreCurrentContactFields = function () {
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonID', this.saveContactPersonID);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'LastUpdateDate', this.saveLastUpdateDate);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'LastUpdateTime', this.saveLastUpdateTime);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'LastUpdateUserName', this.saveLastUpdateUserName);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'EffectiveFromDate', this.saveEffectiveFromDate);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonName', this.saveContactPersonName);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonPosition', this.saveContactPersonPosition);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonDepartment', this.saveContactPersonDepartment);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonNotes', this.saveContactPersonNotes);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonTelephone', this.saveContactPersonTelephone);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonMobile', this.saveContactPersonMobile);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonEmail', this.saveContactPersonEmail);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonFax', this.saveContactPersonFax);
        this.contactPersonHighPortfolioLevel = this.saveContactPersonHighPortfolioLevel;
    };
    ContactPersonTypeBComponent.prototype.updateStoreValue = function (e) {
        for (var key in this.contactDetailsFormGroup.controls) {
            if (key) {
                var targetValue = this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, key);
                this.storeFieldValues[key] = targetValue;
            }
        }
        this.store.dispatch({ type: ContactActionTypes.SAVE_FIELD, payload: this.storeFieldValues });
    };
    ContactPersonTypeBComponent.prototype.selectContactPerson = function () {
        var _this = this;
        var _fieldValue = this.getFieldValues();
        var searchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, 'D');
        searchParams.set(this.serviceConstants.CountryCode, 'UK');
        searchParams.set(this.serviceConstants.Action, '6');
        var bodyParams = {};
        bodyParams['Function'] = 'ContactPersonSelect';
        bodyParams['ContactPersonID'] = _fieldValue.ContactPersonID;
        bodyParams['DTE'] = '25%2F01%2F2017';
        bodyParams['Time'] = '63600';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams, bodyParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.ErrorMessage) {
                _this.pageParams.hasError = true;
                _this.pageParams.errorMessage = data.ErrorMessage;
                _this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: _this.pageParams });
                return;
            }
            _this.updateFieldValues(data);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ContactPersonTypeBComponent.prototype.addPortfolioLevelSelect_OnChange = function (selectedItem) {
        if (this.dropdownFlag) {
            this.store.dispatch({
                type: ContactActionTypes.SAVE_FIELD_PARAMS, payload: {
                    'cSelectValue': selectedItem
                }
            });
        }
        this.dropdownFlag = true;
    };
    ContactPersonTypeBComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-contact-person-type-b',
                    templateUrl: 'contactPerson-type-b.html'
                },] },
    ];
    ContactPersonTypeBComponent.ctorParameters = [
        { type: FormBuilder, },
        { type: Store, },
        { type: RiExchange, },
        { type: Utils, },
        { type: HttpService, },
        { type: AjaxObservableConstant, },
        { type: ServiceConstants, },
        { type: SpeedScriptConstants, },
        { type: LocaleTranslationService, },
    ];
    ContactPersonTypeBComponent.propDecorators = {
        'addPortfolioLevelDropdown': [{ type: ViewChild, args: ['AddPortfolioRoleLevelSelect',] },],
        'changeTypeIDDropdown': [{ type: ViewChild, args: ['ChangeTypeIDSelect',] },],
        'contactPerson': [{ type: ViewChild, args: ['ContactPerson',] },],
    };
    return ContactPersonTypeBComponent;
}());
