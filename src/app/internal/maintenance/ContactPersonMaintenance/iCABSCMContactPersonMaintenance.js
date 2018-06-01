import { URLSearchParams } from '@angular/http';
import { ContactPersonTypeBComponent } from './../../maintenance/ContactPersonMaintenance/tabs/contactPerson-type-b';
import { ContactPersonTypeCComponent } from './../../maintenance/ContactPersonMaintenance/tabs/contactPerson-type-c';
import { ContactPersonTypeAComponent } from './../../maintenance/ContactPersonMaintenance/tabs/contactPerson-type-a';
import { ContactActionTypes } from './../../../actions/contact';
import { GlobalConstant } from './../../../../shared/constants/global.constant';
import { LocaleTranslationService } from './../../../../shared/services/translation.service';
import { RouteAwayGlobals } from './../../../../shared/services/route-away-global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RiExchange } from './../../../../shared/services/riExchange';
import { Store } from '@ngrx/store';
import { ErrorService } from './../../../../shared/services/error.service';
import { MessageService } from './../../../../shared/services/message.service';
import { SpeedScriptConstants } from './../../../../shared/constants/speed-script.constant';
import { SysCharConstants } from './../../../../shared/constants/syscharservice.constant';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { AjaxObservableConstant } from './../../../../shared/constants/ajax-observable.constant';
import { HttpService } from './../../../../shared/services/http-service';
import { Utils } from './../../../../shared/services/utility';
import { Logger } from '@nsalaun/ng2-logger';
import { GroupAccountNumberComponent } from './../../search/iCABSSGroupAccountNumberSearch';
import { InvoiceGroupGridComponent } from './../../grid-search/iCABSAInvoiceGroupGrid';
import { AccountSearchComponent } from './../../search/iCABSASAccountSearch';
import { ContractSearchComponent } from './../../search/iCABSAContractSearch';
import { PremiseSearchComponent } from './../../search/iCABSAPremiseSearch';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, ViewChild, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { Location } from '@angular/common';
export var ContactPersonMaintenanceComponent = (function () {
    function ContactPersonMaintenanceComponent(fb, logger, utils, httpService, ajaxconstant, serviceConstants, SysCharConstants, speedScriptConstants, _zone, messageService, errorService, store, riExchange, route, router, routeAwayGlobals, localeTranslateService, location) {
        var _this = this;
        this.fb = fb;
        this.logger = logger;
        this.utils = utils;
        this.httpService = httpService;
        this.ajaxconstant = ajaxconstant;
        this.serviceConstants = serviceConstants;
        this.SysCharConstants = SysCharConstants;
        this.speedScriptConstants = speedScriptConstants;
        this._zone = _zone;
        this.messageService = messageService;
        this.errorService = errorService;
        this.store = store;
        this.riExchange = riExchange;
        this.route = route;
        this.router = router;
        this.routeAwayGlobals = routeAwayGlobals;
        this.localeTranslateService = localeTranslateService;
        this.location = location;
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.dropdownFlag = true;
        this.contactPersonFormGroup = new FormGroup({});
        this.tabs = [];
        this.tabComponentList = [];
        this.querySysChar = new URLSearchParams();
        this.pageSearchParams = new URLSearchParams();
        this.storeParams = {};
        this.storeFormGroup = {};
        this.ajaxSource = new BehaviorSubject(0);
        this.riContact_Execute = false;
        this.riContactRole_Execute = false;
        this.routeParams = {};
        this.inputParams = {};
        this.headerParams = {
            method: 'ccm/maintenance',
            module: 'customer',
            operation: 'ContactManagement/iCABSCMContactPersonMaintenance'
        };
        this.groupNumberRequired = false;
        this.accountNumberRequired = false;
        this.contractNumberRequired = false;
        this.premiseNumberRequired = false;
        this.invoiceGroupNumberRequired = false;
        this.tabContactDetailSelected = false;
        this.cacheKey = '';
        this.viewLevels = [];
        this.menuItems = [];
        this.contactPersonRoles = [{}];
        this.backLinkText = '';
        this.parentDataPopulated = false;
        this.pageParams = {};
        this.fieldParams = {};
        this.storeFieldValues = {};
        this.tabInit = false;
        this.ellipsis = {
            groupAccount: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                showAddNew: false,
                parentMode: 'Lookup',
                component: GroupAccountNumberComponent
            },
            account: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'Lookup',
                showAddNew: false,
                component: AccountSearchComponent
            },
            contract: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'LookUp-All',
                showAddNew: false,
                component: ContractSearchComponent
            },
            premise: {
                disabled: true,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'ContactPerson',
                showAddNew: false,
                component: PremiseSearchComponent
            },
            invoice: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'ContactPerson',
                showAddNew: false,
                component: InvoiceGroupGridComponent
            }
        };
        this.countryCode = this.utils.getCountryCode();
        this.businessCode = this.utils.getBusinessCode();
        this.messageService.emitMessage(0);
        this.messageSubscription = this.messageService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.messageModal.show({ msg: data.message, title: data.title ? data.title : 'Message' }, false);
            }
            ;
        });
        this.route.queryParams.subscribe(function (params) {
            _this.routeParams = params;
        });
    }
    ContactPersonMaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.localeTranslateService.setUpTranslation();
        this.executeSpeedScript();
        this.lInitiating = true;
        this.lUpdateMode = false;
        this.iContactPersonAddCount = 0;
        this.cUpdateMode = 'NEUTRAL';
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.cacheKey = '';
        this.lRefreshContact = true;
        this.lRefreshContactRole = true;
        this.lAllowChooseContact = false;
        this.currentDate = encodeURI(this.utils.formatDate(new Date()).toString());
        this.initForm();
        this.updatePageAsParentMode(this.routeParams);
        this.storeSubscription = this.store.select('contact').subscribe(function (data) {
            _this.storeData = data;
            switch (data['action']) {
                case ContactActionTypes.SAVE_FIELD_PARAMS:
                    if (data !== null && data['fieldParams'] && !(Object.keys(data['fieldParams']).length === 0 && data['fieldParams'].constructor === Object)) {
                        _this.setFilterFieldsMandatory(data['fieldParams'].cSelectValue);
                    }
                    break;
                case ContactActionTypes.SAVE_FIELD:
                    if (data !== null && data['fieldValue'] && !(Object.keys(data['fieldValue']).length === 0 && data['fieldValue'].constructor === Object)) {
                        _this.storeFieldValues = data['fieldValue'];
                    }
                    break;
                case ContactActionTypes.SET_FORM_GROUPS:
                    if (data !== null && data['formGroup'] && !(Object.keys(data['formGroup']).length === 0 && data['formGroup'].constructor === Object)) {
                        _this.storeFormGroup = data['formGroup'];
                    }
                    break;
                case ContactActionTypes.SAVE_PARAMS:
                    if (data !== null && data['params'] && !(Object.keys(data['params']).length === 0 && data['params'].constructor === Object)) {
                        _this.pageParams = data['params'];
                        _this.lInitiating = data['params'].lInitiating;
                        _this.lRefreshContactRole = data['params'].lRefreshContactRole;
                        _this.riContact_Execute = data['params'].riContact_Execute;
                        _this.riContactRole_Execute = data['params'].riContactRole_Execute;
                        if (_this.pageParams.hasError) {
                            var data_1 = {
                                message: '',
                                title: ''
                            };
                            if (_this.pageParams.errorMessage === 'SaveBeforeSelectMessage') {
                                data_1['message'] = _this.saveBeforeSelectMessage;
                            }
                            else if (_this.pageParams.errorMessage === 'SaveAbandonMessage') {
                                data_1['message'] = _this.saveAbandonMessage;
                            }
                            else {
                                data_1['title'] = 'Error';
                                data_1['message'] = _this.pageParams.errorMessage;
                            }
                            _this.messageService.emitMessage(data_1);
                            _this.pageParams.hasError = false;
                            _this.updateStore();
                        }
                        if (_this.lInitiating) {
                            _this.riTab.tabFocusTo(0);
                        }
                    }
                    break;
            }
        });
    };
    ContactPersonMaintenanceComponent.prototype.executeSpeedScript = function () {
        var _this = this;
        var sysCharNumbers = this.SysCharConstants.SystemCharDisableFirstCapitalOnAddressContact;
        this.fetchSysChar(sysCharNumbers).subscribe(function (e) {
            if (e.records && e.records.length > 0) {
                var glSCCapitalFirstLtr = e.records[0].Logical;
                _this.store.dispatch({
                    type: ContactActionTypes.SAVE_SYSCHAR, payload: {
                        'glSCCapitalFirstLtr': glSCCapitalFirstLtr
                    }
                });
            }
        }, function (error) {
        });
    };
    ContactPersonMaintenanceComponent.prototype.fetchSysChar = function (sysCharNumbers) {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        this.querySysChar.set(this.serviceConstants.BusinessCode, this.businessCode);
        this.querySysChar.set(this.serviceConstants.CountryCode, this.countryCode);
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    };
    ContactPersonMaintenanceComponent.prototype.initForm = function () {
        this.contactPersonFormGroup = this.fb.group({});
        this.riExchange.riInputElement.Add(this.contactPersonFormGroup, 'GroupAccountNumber');
        this.riExchange.riInputElement.Add(this.contactPersonFormGroup, 'GroupName');
        this.riExchange.riInputElement.Add(this.contactPersonFormGroup, 'AccountNumber');
        this.riExchange.riInputElement.Add(this.contactPersonFormGroup, 'AccountName');
        this.riExchange.riInputElement.Add(this.contactPersonFormGroup, 'ContractNumber');
        this.riExchange.riInputElement.Add(this.contactPersonFormGroup, 'ContractName');
        this.riExchange.riInputElement.Add(this.contactPersonFormGroup, 'PremiseNumber');
        this.riExchange.riInputElement.Add(this.contactPersonFormGroup, 'PremiseName');
        this.riExchange.riInputElement.Add(this.contactPersonFormGroup, 'InvoiceGroupNumber');
        this.riExchange.riInputElement.Add(this.contactPersonFormGroup, 'InvoiceGroupDesc');
        this.riExchange.riInputElement.Disable(this.contactPersonFormGroup, 'GroupName');
        this.riExchange.riInputElement.Disable(this.contactPersonFormGroup, 'AccountName');
        this.riExchange.riInputElement.Disable(this.contactPersonFormGroup, 'ContractName');
        this.riExchange.riInputElement.Disable(this.contactPersonFormGroup, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.contactPersonFormGroup, 'InvoiceGroupDesc');
        this.loadDropDown();
        this.store.dispatch({
            type: ContactActionTypes.SET_FORM_GROUPS, payload: {
                name: 'contactPerson',
                form: this.contactPersonFormGroup
            }
        });
    };
    ContactPersonMaintenanceComponent.prototype.loadDropDown = function () {
        this.viewLevels = [{
                value: '0',
                text: 'Contacts From Here And Above'
            }, {
                value: '2',
                text: 'All Contacts For The Entered Account'
            }, {
                value: '3',
                text: 'All Contacts For The Entered Contract/Job'
            }];
        this.menuItems = [{
                value: '',
                text: 'Options'
            }, {
                value: 'audit',
                text: 'Contact Change History'
            }];
    };
    ContactPersonMaintenanceComponent.prototype.updatePageAsParentMode = function (parentData) {
        this.parentMode = this.routeParams.parentMode;
        switch (this.parentMode) {
            case 'GroupAccount':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'GroupAccountNumber', parentData.groupAccountNumber);
                this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelGroupAccount;
                this.lRefresh = true;
                break;
            case 'Account':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountNumber', parentData.accountNumber);
                this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelAccount;
                this.lRefresh = true;
                break;
            case 'AccountEmergency':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountNumber', parentData.accountNumber);
                this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelAccount;
                this.lRefresh = true;
                break;
            case 'CCMSearchAccount':
            case 'CCMSearchAccountNew':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountNumber', parentData.accountNumber);
                this.lAllowChooseContact = (this.parentMode === 'CCMSearchAccountNew') ? true : false;
                this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelAccount;
                this.lRefresh = true;
                break;
            case 'Contract':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractNumber', parentData.contractNumber);
                this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelContract;
                this.lRefresh = true;
                break;
            case 'CCMSearchContract':
            case 'CCMSearchContractNew':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractNumber', parentData.contractNumber);
                this.lAllowChooseContact = (this.parentMode === 'CCMSearchContractNew') ? true : false;
                this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelContract;
                this.lRefresh = true;
                break;
            case 'Premise':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractNumber', parentData.contractNumber);
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseNumber', parentData.premiseNumber);
                this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelPremise;
                this.lRefresh = true;
                break;
            case 'CCMSearchPremise':
            case 'CCMSearchPremiseNew':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractNumber', parentData.contractNumber);
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseNumber', parentData.premiseNumber);
                this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelPremise;
                this.lAllowChooseContact = (this.parentMode === 'CCMSearchPremiseNew') ? true : false;
                this.lRefresh = true;
                break;
            case 'CCMEntry':
            case 'CCMEntryMenu':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountNumber', parentData.accountNumber);
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractNumber', parentData.contractNumber);
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseNumber', parentData.premiseNumber);
                this.lAllowChooseContact = (this.parentMode === 'CCMEntry') ? true : false;
                this.lRefresh = true;
                this.cInitialLevel = '';
                var _fieldValues = this.getFieldValues();
                if (_fieldValues.AccountNumber) {
                    this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelAccount;
                }
                if (_fieldValues.ContractNumber) {
                    this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelContract;
                }
                if (_fieldValues.PremiseNumber) {
                    this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelPremise;
                }
                break;
            case 'InvoiceGroupInv':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountNumber', parentData.accountNumber);
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber', parentData.invoiceGroupNumber);
                this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelIGInvoice;
                this.lRefresh = true;
                this.invoiceGroupStatInv = 'I';
                break;
            case 'InvoiceGroupStat':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountNumber', parentData.accountNumber);
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber', parentData.invoiceGroupNumber);
                this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelIGStatement;
                this.lRefresh = true;
                this.invoiceGroupStatInv = 'S';
                break;
        }
        this.buildTabs();
        this.getInitialValues();
        this.lInitiating = false;
    };
    ContactPersonMaintenanceComponent.prototype.setFilterFieldsMandatory = function (cSelectValue) {
        switch (cSelectValue) {
            case 'ThisContact':
                this.groupNumberRequired = false;
                this.accountNumberRequired = false;
                this.contractNumberRequired = false;
                this.premiseNumberRequired = false;
                this.invoiceGroupNumberRequired = false;
                break;
            case this.speedScriptConstants.CNFPortfolioLevelGroupAccount:
                this.groupNumberRequired = true;
                this.accountNumberRequired = false;
                this.contractNumberRequired = false;
                this.premiseNumberRequired = false;
                this.invoiceGroupNumberRequired = false;
                break;
            case this.speedScriptConstants.CNFPortfolioLevelAccount:
                this.groupNumberRequired = false;
                this.accountNumberRequired = true;
                this.contractNumberRequired = false;
                this.premiseNumberRequired = false;
                this.invoiceGroupNumberRequired = false;
                break;
            case this.speedScriptConstants.CNFPortfolioLevelIGAll:
            case this.speedScriptConstants.CNFPortfolioLevelIGInvoice:
            case this.speedScriptConstants.CNFPortfolioLevelIGStatement:
                this.groupNumberRequired = false;
                this.accountNumberRequired = true;
                this.contractNumberRequired = false;
                this.premiseNumberRequired = false;
                this.invoiceGroupNumberRequired = true;
                break;
            case this.speedScriptConstants.CNFPortfolioLevelContract:
                this.groupNumberRequired = false;
                this.accountNumberRequired = false;
                this.contractNumberRequired = true;
                this.premiseNumberRequired = false;
                this.invoiceGroupNumberRequired = false;
                break;
            case this.speedScriptConstants.CNFPortfolioLevelPremise:
                this.groupNumberRequired = false;
                this.accountNumberRequired = false;
                this.contractNumberRequired = true;
                this.premiseNumberRequired = true;
                this.invoiceGroupNumberRequired = false;
                break;
        }
        this.riExchange.riInputElement.SetRequiredStatus(this.contactPersonFormGroup, 'GroupAccountNumber', this.groupNumberRequired);
        this.riExchange.riInputElement.SetRequiredStatus(this.contactPersonFormGroup, 'AccountNumber', this.accountNumberRequired);
        this.riExchange.riInputElement.SetRequiredStatus(this.contactPersonFormGroup, 'ContractNumber', this.contractNumberRequired);
        this.riExchange.riInputElement.SetRequiredStatus(this.contactPersonFormGroup, 'PremiseNumber', this.premiseNumberRequired);
        this.riExchange.riInputElement.SetRequiredStatus(this.contactPersonFormGroup, 'InvoiceGroupNumber', this.invoiceGroupNumberRequired);
    };
    ContactPersonMaintenanceComponent.prototype.inputField_OnChange = function (e, name) {
        if (e.type === 'blur') {
            var updateValue = void 0;
            if (name === 'Account' && e.target.value.length > 0) {
                updateValue = this.utils.numberPadding(e.target.value, 9);
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountNumber', updateValue);
            }
            else if (name === 'Contract' && e.target.value.length > 0) {
                updateValue = this.utils.numberPadding(e.target.value, 8);
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractNumber', updateValue);
            }
        }
        else {
            if (name === 'GroupAccount') {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'GroupAccountNumber', e.GroupAccountNumber);
            }
            else if (name === 'Account') {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountNumber', e.AccountNumber);
            }
            else if (name === 'Contract') {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractNumber', e.ContractNumber);
            }
            else if (name === 'Premise') {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseNumber', e.PremiseNumber);
            }
            else if (name === 'InvoiceGroupInv') {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber', e.InvoiceGroupNumber);
            }
        }
        this.getPortfolioDescriptions(name);
        this.autoSetViewLevel();
    };
    ContactPersonMaintenanceComponent.prototype.autoSetViewLevel = function () {
        if (this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'AccountNumber') !== '') {
            this.viewLevelDropdown.selectedItem = '2';
        }
        if (this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'ContractNumber') !== '') {
            this.viewLevelDropdown.selectedItem = '3';
        }
        if (this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'AccountNumber') === '' &&
            this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'ContractNumber') === '') {
            this.viewLevelDropdown.selectedItem = '0';
        }
        if (this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'PremiseNumber') !== '') {
            this.viewLevelDropdown.selectedItem = '0';
        }
        if (this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber') !== '') {
            this.viewLevelDropdown.selectedItem = '0';
        }
        this.viewLevelSelect_OnChange();
    };
    ContactPersonMaintenanceComponent.prototype.viewLevelSelect_OnChange = function () {
        if (this.parentDataPopulated) {
            if (this.cInitialLevel === 'ACCOUNT') {
                if (this.viewLevelDropdown.selectedItem === '2') {
                    this.accountNumberRequired = true;
                    this.riExchange.riInputElement.SetRequiredStatus(this.contactPersonFormGroup, 'AccountNumber', true);
                }
                else {
                    this.accountNumberRequired = false;
                    this.riExchange.riInputElement.SetRequiredStatus(this.contactPersonFormGroup, 'AccountNumber', false);
                }
            }
            else if (this.cInitialLevel === 'CONTRACT') {
                if (this.viewLevelDropdown.selectedItem === '3') {
                    this.contractNumberRequired = true;
                    this.riExchange.riInputElement.SetRequiredStatus(this.contactPersonFormGroup, 'ContractNumber', true);
                }
                else {
                    this.contractNumberRequired = false;
                    this.riExchange.riInputElement.SetRequiredStatus(this.contactPersonFormGroup, 'ContractNumber', true);
                }
            }
            this.storeFieldValues.ViewLevel = this.viewLevelDropdown.selectedItem;
            this.store.dispatch({ type: ContactActionTypes.SAVE_FIELD, payload: this.storeFieldValues });
        }
    };
    ContactPersonMaintenanceComponent.prototype.buildTabs = function () {
        this.tabs = [
            { title: 'Contact Search', active: true },
            { title: 'Contact Details', active: false },
            { title: 'Contact Roles', active: false }
        ];
        this.tabComponentList = [ContactPersonTypeAComponent, ContactPersonTypeBComponent, ContactPersonTypeCComponent];
    };
    ContactPersonMaintenanceComponent.prototype.getInitialValues = function () {
        var _this = this;
        var ValArray, DescArray;
        this.pageSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode);
        this.pageSearchParams.set(this.serviceConstants.CountryCode, this.countryCode);
        this.pageSearchParams.set(this.serviceConstants.Action, '6');
        this.pageSearchParams.set('Function', 'GetInitialValues');
        var _fieldValues = this.getFieldValues();
        this.pageSearchParams.set('GroupAccountNumber', _fieldValues.GroupAccountNumber);
        this.pageSearchParams.set('AccountNumber', _fieldValues.AccountNumber);
        this.pageSearchParams.set('ContractNumber', _fieldValues.ContractNumber);
        this.pageSearchParams.set('PremiseNumber', _fieldValues.PremiseNumber);
        this.pageSearchParams.set('InvoiceGroupNumber', _fieldValues.InvoiceGroupNumber);
        this.pageSearchParams.set('InvoiceGroupStatInv', _fieldValues.InvoiceGroupStatInv);
        this.pageSearchParams.set('TME', '61980');
        this.pageSearchParams.set('DTE', this.currentDate);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.pageSearchParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.ErrorMessage) {
                _this.pageParams.hasError = true;
                _this.pageParams.errorMessage = data.ErrorMessage;
                _this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: _this.pageParams });
                return;
            }
            _this.iNumberOfRoles = data.NumberOfRoles;
            _this.saveAbandonMessage = data.SaveAbandonMessage;
            _this.saveBeforeSelectMessage = data.SaveBeforeSelectMessage;
            _this.multipleContacts = data.MultipleContacts;
            _this.telephoneMandatory = data.TelephoneMandatory;
            _this.positionMandatory = data.PositionMandatory;
            _this.positionDefault = data.PositionDefault;
            _this.emergencyContactExists = data.EmergencyContactExists;
            if (_this.multipleContacts === 'N') {
                _this.riTab.tabFocusTo(1);
            }
            _this.updateInputFieldsValue(data);
            var _roleIDList = data.RoleIDList;
            ValArray = _roleIDList.split('^');
            var _roleDescList = data.RoleDescList;
            DescArray = _roleDescList.split('^');
            for (var i = 0; i < ValArray.length; i++) {
                var obj = {
                    value: ValArray[i],
                    text: DescArray[i]
                };
                _this.contactPersonRoles[i] = obj;
            }
            _this.contactPersonRoleDropdown.selectedItem = '0';
            _this.parentDataPopulated = true;
            if (_this.lRefresh) {
                _this.autoSetViewLevel();
                if (_this.parentMode === 'AccountEmergency') {
                    if (_this.emergencyContactExists === 'Y') {
                        _this.contactPersonRoleDropdown.selectedItem = '2';
                    }
                    else {
                        _this.contactPersonRoleDropdown.selectedItem = '1';
                    }
                }
                _this.storeFieldValues.ViewLevel = _this.viewLevelDropdown.selectedItem;
                _this.storeFieldValues.ContactPersonRoleID = _this.contactPersonRoleDropdown.selectedItem;
                _this.setupGridContact();
            }
            else {
                _this.updateStore();
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ContactPersonMaintenanceComponent.prototype.getFieldValues = function () {
        return {
            'MultipleContacts': this.multipleContacts,
            'TelephoneMandatory': this.telephoneMandatory,
            'PositionMandatory': this.positionMandatory,
            'PositionDefault': this.positionDefault,
            'EmergencyContactExists': this.emergencyContactExists,
            'GroupAccountNumber': this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'GroupAccountNumber'),
            'GroupName': this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'GroupName'),
            'AccountNumber': this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'AccountNumber'),
            'AccountName': this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'AccountName'),
            'ContractNumber': this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'ContractNumber'),
            'ContractName': this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'ContractName'),
            'PremiseNumber': this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'PremiseNumber'),
            'PremiseName': this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'PremiseName'),
            'InvoiceGroupNumber': this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber'),
            'InvoiceGroupDesc': this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'InvoiceGroupDesc'),
            'ContactPersonRoleID': this.contactPersonRoleDropdown.selectedItem,
            'ViewLevel': this.viewLevelDropdown.selectedItem
        };
    };
    ContactPersonMaintenanceComponent.prototype.btnAdd_OnClick = function () {
        this.riTab.tabFocusTo(1);
        this.cUpdateMode = 'ADD';
        this.routeAwayGlobals.setSaveEnabledFlag(true);
        this.lRefreshContactRole = true;
        this.updateStore();
        this.storeFieldValues.AddPortfolioLevelSelect = this.cInitialLevel;
        this.storeFieldValues.PortfolioRoleLeveLSelect = this.cInitialLevel;
        this.store.dispatch({ type: ContactActionTypes.SAVE_FIELD, payload: this.storeFieldValues });
    };
    ContactPersonMaintenanceComponent.prototype.btnUpdate_OnClick = function () {
        this.riTab.tabFocusTo(1);
        this.routeAwayGlobals.setSaveEnabledFlag(true);
        this.cUpdateMode = 'UPDATE';
        this.updateStore();
    };
    ContactPersonMaintenanceComponent.prototype.btnSave_OnClick = function () {
        this.iFieldError = 0;
        var lCanSave = true;
        var effectiveFromDate_isError = this.riExchange.riInputElement.isError(this.storeFormGroup.contactDetails, 'EffectiveFromDate');
        var contactPersonName_isError = this.riExchange.riInputElement.isError(this.storeFormGroup.contactDetails, 'ContactPersonName');
        var contactPersonPosition_isError = this.riExchange.riInputElement.isError(this.storeFormGroup.contactDetails, 'ContactPersonPosition');
        var contactPersonTelephone_isError = this.riExchange.riInputElement.isError(this.storeFormGroup.contactDetails, 'ContactPersonTelephone');
        var groupAccountNumber_isError = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'GroupAccountNumber');
        var accountNumber_isError = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'AccountNumber');
        var contractNumber_isError = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'ContractNumber');
        var premiseNumber_isError = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'PremiseNumber');
        var invoiceGroupNumber_isError = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'InvoiceGroupNumber');
        if (effectiveFromDate_isError) {
            if (this.iFieldError === 0) {
                this.iFieldError = 1;
            }
        }
        if (contactPersonName_isError) {
            if (this.iFieldError === 0) {
                this.iFieldError = 2;
            }
        }
        if (contactPersonPosition_isError) {
            if (this.iFieldError === 0) {
                this.iFieldError = 3;
            }
        }
        if (contactPersonTelephone_isError) {
            if (this.iFieldError === 0) {
                this.iFieldError = 4;
            }
        }
        if (this.cUpdateMode === 'ADD') {
            if (groupAccountNumber_isError) {
                if (this.iFieldError === 0) {
                    this.iFieldError = 5;
                }
            }
            if (accountNumber_isError) {
                if (this.iFieldError === 0) {
                    this.iFieldError = 6;
                }
            }
            if (contractNumber_isError) {
                if (this.iFieldError === 0) {
                    this.iFieldError = 7;
                }
            }
            if (premiseNumber_isError) {
                if (this.iFieldError === 0) {
                    this.iFieldError = 8;
                }
            }
            if (invoiceGroupNumber_isError) {
                if (this.iFieldError === 0) {
                    this.iFieldError = 9;
                }
            }
        }
        if (this.iFieldError !== 0) {
            this.riTab.tabFocusTo(1);
        }
        if (this.iFieldError === 0) {
            this.saveAdd_beforeExecute();
        }
    };
    ContactPersonMaintenanceComponent.prototype.saveAdd_beforeExecute = function () {
        var _this = this;
        var _fieldValues = this.getFieldValues();
        var updateSearchParams = new URLSearchParams();
        updateSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode);
        updateSearchParams.set(this.serviceConstants.CountryCode, this.countryCode);
        updateSearchParams.set(this.serviceConstants.Action, '6');
        updateSearchParams.set('Function', 'ContactPersonUpdate');
        updateSearchParams.set('CacheKey', this.cacheKey);
        updateSearchParams.set('ContactPersonID', this.storeFieldValues.ContactPersonID);
        updateSearchParams.set('GroupAccountNumber', _fieldValues.GroupAccountNumber);
        updateSearchParams.set('AccountNumber', _fieldValues.AccountNumber);
        updateSearchParams.set('ContractNumber', _fieldValues.ContractNumber);
        updateSearchParams.set('PremiseNumber', _fieldValues.PremiseNumber);
        updateSearchParams.set('InvoiceGroupNumber', _fieldValues.InvoiceGroupNumber);
        updateSearchParams.set('PortfolioLevelKey', this.storeFieldValues.AddPortfolioLevelSelect);
        updateSearchParams.set('EffectiveFromDate', encodeURI(this.storeFieldValues.EffectiveFromDate));
        updateSearchParams.set('ContactPersonName', this.storeFieldValues.ContactPersonName);
        updateSearchParams.set('ContactPersonPosition', this.storeFieldValues.ContactPersonPosition);
        updateSearchParams.set('ContactPersonDepartment', this.storeFieldValues.ContactPersonDepartment);
        updateSearchParams.set('ContactPersonNotes', this.storeFieldValues.ContactPersonNotes);
        updateSearchParams.set('ContactPersonTelephone', this.storeFieldValues.ContactPersonTelephone);
        updateSearchParams.set('ContactPersonMobile', this.storeFieldValues.ContactPersonMobile);
        updateSearchParams.set('ContactPersonEmail', this.storeFieldValues.ContactPersonEmail);
        updateSearchParams.set('ContactPersonFax', this.storeFieldValues.ContactPersonFax);
        updateSearchParams.set('DTE', this.currentDate);
        updateSearchParams.set('TME', '61980');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, updateSearchParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.ErrorMessage) {
                _this.riTab.tabFocusTo(1);
                _this.pageParams.hasError = true;
                _this.pageParams.errorMessage = data.ErrorMessage;
                _this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: _this.pageParams });
                return;
            }
            _this.lRefreshContact = true;
            _this.lRefreshContactRole = true;
            _this.storeFieldValues.ContactPersonID = data.ContactPersonID;
            _this.store.dispatch({ type: ContactActionTypes.SAVE_FIELD, payload: _this.storeFieldValues });
            if (_this.cUpdateMode === 'ADD') {
                _this.cUpdateMode = 'UPDATE';
                _this.routeAwayGlobals.setSaveEnabledFlag(true);
                _this.storeFieldValues.RolesContactPersonID = _this.storeFieldValues.ContactPersonID;
                _this.storeFieldValues.RolesContactPersonName = _this.storeFieldValues.ContactPersonName;
                _this.storeFieldValues.PortfolioRoleLevelSelect = _this.storeFieldValues.AddPortfolioLevelSelect;
                _this.store.dispatch({ type: ContactActionTypes.SAVE_FIELD, payload: _this.storeFieldValues });
                _this.updateStore();
                _this.riTab.tabFocusTo(2);
            }
            else {
                _this.riTab.tabFocusTo(1);
            }
            _this.cUpdateMode = 'NEUTRAL';
            _this.routeAwayGlobals.setSaveEnabledFlag(false);
            _this.pageParams.closedWithChanges = 'Y';
            _this.updateStore();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ContactPersonMaintenanceComponent.prototype.contactPersonRoles_OnChange = function (data) {
        this.storeFieldValues.ContactPersonRoleID = this.contactPersonRoleDropdown.selectedItem;
        this.store.dispatch({ type: ContactActionTypes.SAVE_FIELD, payload: this.storeFieldValues });
    };
    ContactPersonMaintenanceComponent.prototype.getPortfolioDescriptions = function (cPortfolioLevel) {
        var _this = this;
        switch (cPortfolioLevel) {
            case 'GroupAccount':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountNumber', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountName', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractNumber', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractName', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseNumber', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseName', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupDesc', '');
                break;
            case 'Account':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractNumber', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractName', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseNumber', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseName', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupDesc', '');
                break;
            case 'Contract':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseNumber', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseName', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupDesc', '');
                break;
            case 'Premise':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupDesc', '');
                break;
        }
        var _fieldValues = this.getFieldValues();
        this.pageSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode);
        this.pageSearchParams.set(this.serviceConstants.CountryCode, this.countryCode);
        this.pageSearchParams.set(this.serviceConstants.Action, '6');
        this.pageSearchParams.set('Function', 'GetPortfolioDescriptions');
        this.pageSearchParams.set('GroupAccountNumber', _fieldValues.GroupAccountNumber);
        this.pageSearchParams.set('AccountNumber', _fieldValues.AccountNumber);
        this.pageSearchParams.set('ContractNumber', _fieldValues.ContractNumber);
        this.pageSearchParams.set('PremiseNumber', _fieldValues.PremiseNumber);
        this.pageSearchParams.set('InvoiceGroupNumber', _fieldValues.InvoiceGroupNumber);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.pageSearchParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.ErrorMessage) {
                _this.pageParams.hasError = true;
                _this.pageParams.errorMessage = data.ErrorMessage;
                _this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: _this.pageParams });
                return;
            }
            for (var key in data) {
                if (key) {
                    _this.storeFieldValues[key] = data[key];
                }
            }
            _this.autoSetViewLevel();
            _this.updateInputFieldsValue(data);
        }, function (error) {
            _this.logger.log('Error');
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ContactPersonMaintenanceComponent.prototype.updateInputFieldsValue = function (data) {
        if (data.GroupAccountNumber === '0') {
            if (data.GroupName === '') {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'GroupAccountNumber', '');
            }
            else {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'GroupAccountNumber', 0);
            }
        }
        else {
            this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'GroupAccountNumber', data.GroupAccountNumber);
        }
        this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'GroupName', data.GroupName);
        this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountNumber', data.AccountNumber);
        this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountName', data.AccountName);
        this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractNumber', data.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractName', data.ContractName);
        if (data.PremiseNumber === '0') {
            if (data.PremiseName === '') {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseNumber', '');
            }
            else {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseNumber', 0);
            }
        }
        else {
            this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseNumber', data.PremiseNumber);
        }
        this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseName', data.PremiseName);
        if (data.InvoiceGroupNumber === '0') {
            if (data.InvoiceGroupDesc === '') {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber', '');
            }
            else {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber', 0);
            }
        }
        else {
            this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber', data.InvoiceGroupNumber);
        }
        this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupDesc', data.InvoiceGroupDesc);
        for (var key in data) {
            if (key) {
                this.storeFieldValues[key] = data[key];
            }
        }
        this.store.dispatch({ type: ContactActionTypes.SAVE_FIELD, payload: this.storeFieldValues });
        if (this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'GroupAccountNumber')) {
            this.ellipsis.account['groupAccountNumber'] = this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'GroupAccountNumber');
            this.ellipsis.account['groupName'] = this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'GroupName');
        }
        if (this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'AccountNumber')) {
            this.ellipsis.contract['accountNumber'] = this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'AccountNumber');
            this.ellipsis.contract['accountName'] = this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'AccountName');
        }
        if (this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'ContractNumber')) {
            this.ellipsis.premise['contractNumber'] = this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'ContractNumber');
            this.ellipsis.premise['contractName'] = this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'ContractName');
        }
    };
    ContactPersonMaintenanceComponent.prototype.onSelectTab = function (data) {
        this.tabContactDetailSelected = false;
        switch (data.tabIndex) {
            case 0:
                if (this.lRefreshContact) {
                    this.setupGridContact();
                }
                this.viewLevelSelect_OnChange();
                break;
            case 1:
                this.tabContactDetailSelected = true;
                break;
            case 2:
                if (this.lRefreshContactRole) {
                    this.setupGridContactRole();
                }
                break;
        }
    };
    ContactPersonMaintenanceComponent.prototype.backButton_OnClick = function (event) {
        event.preventDefault();
        if (this.cUpdateMode === 'ADD' || this.cUpdateMode === 'UPDATE') {
            var data = {};
            data['message'] = this.saveAbandonMessage;
            this.messageService.emitMessage(data);
        }
        if (this.closedWithChanges === 'Y') {
            this.windowClosingName = 'AmendmentsMade';
        }
        else {
            this.windowClosingName = '';
        }
        var saveData = {};
        saveData.windowClosingName = this.windowClosingName;
        saveData.closedWithChanges = this.closedWithChanges;
        this.store.dispatch({ type: ContactActionTypes.SAVE_DATA, payload: saveData });
        this.location.back();
    };
    ContactPersonMaintenanceComponent.prototype.btnChoose_OnClick = function () {
        var saveData = {};
        if (this.parentMode === 'CCMEntry') {
            saveData.ContactName = this.storeFieldValues.ContactPersonName;
            saveData.ContactPosition = this.storeFieldValues.ContactPersonPosition;
            saveData.ContactTelephone = this.storeFieldValues.ContactPersonTelephone;
            saveData.ContactMobileNumber = this.storeFieldValues.ContactPersonMobile;
            saveData.ContactEmailAddress = this.storeFieldValues.ContactPersonEmail;
        }
        else {
            saveData.CallContactName = this.storeFieldValues.ContactPersonName;
            saveData.CallContactPosition = this.storeFieldValues.ContactPersonPosition;
            saveData.CallContactTelephone = this.storeFieldValues.ContactPersonTelephone;
            saveData.CallContactMobile = this.storeFieldValues.ContactPersonMobile;
            saveData.CallContactEmail = this.storeFieldValues.ContactPersonEmail;
        }
        this.store.dispatch({ type: ContactActionTypes.SAVE_DATA, payload: saveData });
    };
    ContactPersonMaintenanceComponent.prototype.btnAbandon_OnClick = function () {
        this.cUpdateMode = 'NEUTRAL';
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.iFieldError = 0;
        this.lRefreshContactRole = true;
        this.updateStore();
    };
    ContactPersonMaintenanceComponent.prototype.btnDelete_OnClick = function () {
        var _this = this;
        var deleteSearchParams = new URLSearchParams();
        deleteSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode);
        deleteSearchParams.set(this.serviceConstants.CountryCode, this.countryCode);
        deleteSearchParams.set(this.serviceConstants.Action, '6');
        var bodyParams = {};
        bodyParams['Function'] = 'ContactPersonDelete';
        bodyParams['ContactPersonID'] = this.storeFieldValues.ContactPersonID;
        bodyParams['GroupAccountNumber'] = this.storeFieldValues.GroupAccountNumber;
        bodyParams['AccountNumber'] = this.storeFieldValues.AccountNumber;
        bodyParams['ContractNumber'] = this.storeFieldValues.ContractNumber;
        bodyParams['PremiseNumber'] = this.storeFieldValues.PremiseNumber;
        bodyParams['InvoiceGroupNumber'] = this.storeFieldValues.InvoiceGroupNumber;
        bodyParams['DTE'] = '61980';
        bodyParams['TME'] = this.currentDate;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, deleteSearchParams, bodyParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.ErrorMessage) {
                _this.pageParams.hasError = true;
                _this.pageParams.errorMessage = data.ErrorMessage;
                _this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: _this.pageParams });
                return;
            }
            _this.riTab.tabFocusTo(0);
            _this.pageParams.closedWithChanges = 'Y';
            _this.lRefreshContact = true;
            _this.riContact_Execute = true;
            _this.updateStore();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ContactPersonMaintenanceComponent.prototype.setupGridContact = function () {
        var lCanRefresh = true;
        var accountNumberInvalid = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'AccountNumber');
        var contractNumberInvalid = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'ContractNumber');
        if (accountNumberInvalid || contractNumberInvalid) {
            lCanRefresh = false;
        }
        this.lRefreshContact = false;
        this.riContact_Execute = lCanRefresh;
        this.updateStore();
    };
    ContactPersonMaintenanceComponent.prototype.setupGridContactRole = function () {
        var lCanRefreshRole = true;
        var groupAccountNumberInvalid = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'GroupAccountNumber');
        var accountNumberInvalid = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'AccountNumber');
        var contractNumberInvalid = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'ContractNumber');
        var premiseNumberInvalid = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'PremiseNumber');
        var invoiceGroupNumberInvalid = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'InvoiceGroupNumber');
        if (groupAccountNumberInvalid || accountNumberInvalid || contractNumberInvalid || premiseNumberInvalid || invoiceGroupNumberInvalid) {
            lCanRefreshRole = false;
        }
        if (this.contactPersonID === '0' && !this.contactPersonID) {
            lCanRefreshRole = false;
        }
        if (this.cUpdateMode === 'ADD') {
            lCanRefreshRole = false;
        }
        this.lRefreshContactRole = false;
        this.riContactRole_Execute = lCanRefreshRole;
        this.updateStore();
    };
    ContactPersonMaintenanceComponent.prototype.calculateCacheKey = function () {
        var time = new Date();
        var iContactPersonID = this.storeFieldValues.ContactPersonID;
        if (iContactPersonID === '0' || iContactPersonID === '' || !iContactPersonID) {
            this.iContactPersonAddCount = this.iContactPersonAddCount - 1;
            iContactPersonID = this.iContactPersonAddCount;
        }
        else {
            iContactPersonID = parseFloat(iContactPersonID);
        }
        this.cacheKey = 'contactpersonupdate-' + time.toString() + '-' + parseFloat(iContactPersonID);
        this.storeFieldValues.CacheKey = this.cacheKey;
        return this.cacheKey;
    };
    ContactPersonMaintenanceComponent.prototype.menu_OnChange = function () {
        if (this.menu.selectedItem === 'audit') {
            this.router.navigate(['/application/ContactPersonHistory'], { queryParams: { parentMode: 'contactperson' } });
        }
    };
    ContactPersonMaintenanceComponent.prototype.updateStore = function () {
        this.pageParams.cUpdateMode = this.cUpdateMode;
        this.pageParams.lInitiating = this.lInitiating;
        this.pageParams.iFieldError = this.iFieldError;
        this.pageParams.lRefreshContactRole = this.lRefreshContactRole;
        this.pageParams.riContact_Execute = this.riContact_Execute;
        this.pageParams.riContactRole_Execute = this.riContactRole_Execute;
        this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: this.pageParams });
    };
    ContactPersonMaintenanceComponent.prototype.ngOnDestroy = function () {
        if (this.messageSubscription) {
            this.messageSubscription.unsubscribe();
        }
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    };
    ContactPersonMaintenanceComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    ContactPersonMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSCMContactPersonMaintenance.html'
                },] },
    ];
    ContactPersonMaintenanceComponent.ctorParameters = [
        { type: FormBuilder, },
        { type: Logger, },
        { type: Utils, },
        { type: HttpService, },
        { type: AjaxObservableConstant, },
        { type: ServiceConstants, },
        { type: SysCharConstants, },
        { type: SpeedScriptConstants, },
        { type: NgZone, },
        { type: MessageService, },
        { type: ErrorService, },
        { type: Store, },
        { type: RiExchange, },
        { type: ActivatedRoute, },
        { type: Router, },
        { type: RouteAwayGlobals, },
        { type: LocaleTranslationService, },
        { type: Location, },
    ];
    ContactPersonMaintenanceComponent.propDecorators = {
        'viewLevelDropdown': [{ type: ViewChild, args: ['ViewLevelSelect',] },],
        'contactPersonRoleDropdown': [{ type: ViewChild, args: ['ContactPersonRoleSelect',] },],
        'menu': [{ type: ViewChild, args: ['Menu',] },],
        'riTab': [{ type: ViewChild, args: ['ContactPersonTabs',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return ContactPersonMaintenanceComponent;
}());
