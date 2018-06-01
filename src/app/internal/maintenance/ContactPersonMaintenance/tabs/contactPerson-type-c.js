import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { ContactActionTypes } from './../../../../actions/contact';
import { LocaleTranslationService } from './../../../../../shared/services/translation.service';
import { SpeedScriptConstants } from './../../../../../shared/constants/speed-script.constant';
import { ServiceConstants } from './../../../../../shared/constants/service.constants';
import { AjaxObservableConstant } from './../../../../../shared/constants/ajax-observable.constant';
import { HttpService } from './../../../../../shared/services/http-service';
import { RiExchange } from './../../../../../shared/services/riExchange';
import { Utils } from './../../../../../shared/services/utility';
import { BehaviorSubject } from 'rxjs/Rx';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, ViewChild, NgZone } from '@angular/core';
export var ContactPersonTypeCComponent = (function () {
    function ContactPersonTypeCComponent(utils, fb, store, zone, riExchange, httpService, ajaxconstant, serviceConstants, speedScriptConstants, localeTranslateService) {
        this.utils = utils;
        this.fb = fb;
        this.store = store;
        this.zone = zone;
        this.riExchange = riExchange;
        this.httpService = httpService;
        this.ajaxconstant = ajaxconstant;
        this.serviceConstants = serviceConstants;
        this.speedScriptConstants = speedScriptConstants;
        this.localeTranslateService = localeTranslateService;
        this.contactRolesFormGroup = new FormGroup({});
        this.inputParams = {};
        this.ajaxSource = new BehaviorSubject(0);
        this.headerParams = {
            method: 'ccm/maintenance',
            module: 'customer',
            operation: 'ContactManagement/iCABSCMContactPersonMaintenance'
        };
        this.pageParams = {};
        this.storeFieldValues = {};
        this.showContactRoleGrid = false;
        this.portfolioLevelValue = '';
        this.portfolioRoles = [];
        this.dropdownFlag = false;
        this.selectedRow = -1;
        this.countryCode = this.utils.getCountryCode();
        this.businessCode = this.utils.getBusinessCode();
    }
    ContactPersonTypeCComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.pageSizeContactRole = 6;
        this.currentPageContactRole = 1;
        this.storeSubscription = this.store.select('contact').subscribe(function (data) {
            switch (data['action']) {
                case ContactActionTypes.SAVE_PARAMS:
                    if (data !== null && data['params'] && !(Object.keys(data['params']).length === 0 && data['params'].constructor === Object)) {
                        _this.pageParams = data['params'];
                        _this.cUpdateMode = data['params'].cUpdateMode;
                        if (_this.pageParams.riContactRole_Execute) {
                            _this.buildGridContactRole();
                        }
                        else {
                            _this.riExchange.riInputElement.SetValue(_this.contactRolesFormGroup, 'RolesContactPersonID', _this.storeFieldValues.RolesContactPersonID);
                            _this.riExchange.riInputElement.SetValue(_this.contactRolesFormGroup, 'RolesContactPersonName', _this.storeFieldValues.RolesContactPersonName);
                        }
                    }
                    break;
                case ContactActionTypes.SAVE_FIELD:
                    if (data !== null && data['fieldValue'] && !(Object.keys(data['fieldValue']).length === 0 && data['fieldValue'].constructor === Object)) {
                        _this.storeFieldValues = data['fieldValue'];
                        _this.updateFieldValues(data['fieldValue']);
                    }
                    break;
            }
        });
        this.initForm();
    };
    ContactPersonTypeCComponent.prototype.ngOnDestroy = function () {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    };
    ContactPersonTypeCComponent.prototype.initForm = function () {
        this.contactRolesFormGroup = this.fb.group({});
        this.riExchange.riInputElement.Add(this.contactRolesFormGroup, 'RolesContactPersonID');
        this.riExchange.riInputElement.Add(this.contactRolesFormGroup, 'RolesContactPersonName');
        this.riExchange.riInputElement.Add(this.contactRolesFormGroup, 'RolesPrimaryContactPersonID');
        this.riExchange.riInputElement.Add(this.contactRolesFormGroup, 'RolesPrimaryContactPersonName');
        this.riExchange.riInputElement.Disable(this.contactRolesFormGroup, 'RolesContactPersonID');
        this.riExchange.riInputElement.Disable(this.contactRolesFormGroup, 'RolesContactPersonName');
        this.riExchange.riInputElement.Disable(this.contactRolesFormGroup, 'RolesPrimaryContactPersonID');
        this.riExchange.riInputElement.Disable(this.contactRolesFormGroup, 'RolesPrimaryContactPersonName');
        this.loadDropDown();
    };
    ContactPersonTypeCComponent.prototype.loadDropDown = function () {
        this.portfolioRoles = [
            {
                value: this.speedScriptConstants.CNFPortfolioLevelGroupAccount,
                text: 'The Entered Group Account'
            }, {
                value: this.speedScriptConstants.CNFPortfolioLevelAccount,
                text: 'The Entered Account'
            }, {
                value: this.speedScriptConstants.CNFPortfolioLevelIGInvoice,
                text: 'The Entered Invoice Group (Invoice)'
            }, {
                value: this.speedScriptConstants.CNFPortfolioLevelIGStatement,
                text: 'The Entered Invoice Group (Statement)'
            }, {
                value: this.speedScriptConstants.CNFPortfolioLevelContract,
                text: 'The Entered Contract'
            }, {
                value: this.speedScriptConstants.CNFPortfolioLevelPremise,
                text: 'The Entered Premise'
            }, {
                value: 'ThisContact',
                text: 'This Contact ( Across The System )'
            }];
    };
    ContactPersonTypeCComponent.prototype.updateFieldValues = function (storeData) {
        if (storeData.PortfolioRoleLevelSelect) {
            this.portfolioRoleLevelDropdown.selectedItem = storeData.PortfolioRoleLevelSelect;
            this.riExchange.riInputElement.SetValue(this.contactRolesFormGroup, 'RolesContactPersonID', storeData.RolesContactPersonID);
            this.riExchange.riInputElement.SetValue(this.contactRolesFormGroup, 'RolesContactPersonName', storeData.RolesContactPersonName);
            this.riExchange.riInputElement.SetValue(this.contactRolesFormGroup, 'RolesPrimaryContactPersonID', storeData.RolesPrimaryContactPersonID);
            this.riExchange.riInputElement.SetValue(this.contactRolesFormGroup, 'RolesPrimaryContactPersonName', storeData.RolesPrimaryContactPersonName);
        }
    };
    ContactPersonTypeCComponent.prototype.buildGridContactRole = function () {
        this.pageParams.riContactRole_Execute = false;
        this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: this.pageParams });
        this.gridTotalItemsContactRole = 0;
        if (this.portfolioRoleLevelDropdown.selectedItem === 'ThisContact') {
            this.maxColumnsContactRole = 9;
        }
        else {
            this.maxColumnsContactRole = 6;
        }
        this.riGridContactRole.clearGridData();
        var rolesContactPersonID = this.riExchange.riInputElement.GetValue(this.contactRolesFormGroup, 'RolesContactPersonID');
        this.inputParams.method = this.headerParams.method;
        this.inputParams.module = this.headerParams.module;
        this.inputParams.operation = this.headerParams.operation;
        var searchContactRole = new URLSearchParams();
        searchContactRole.set(this.serviceConstants.BusinessCode, this.businessCode);
        searchContactRole.set(this.serviceConstants.CountryCode, this.countryCode);
        searchContactRole.set(this.serviceConstants.Action, '2');
        this.inputParams.search = searchContactRole;
        var bodyParams = {};
        bodyParams[this.serviceConstants.GridName] = 'ContactPersonPortfolioRole';
        bodyParams['PortfolioLevelKey'] = this.portfolioRoleLevelDropdown.selectedItem;
        bodyParams['PortfolioLevelValue'] = this.portfolioLevelValue;
        bodyParams['UpdateMode'] = 'UPDATE';
        bodyParams['CacheKey'] = '';
        bodyParams['ContactPersonID'] = rolesContactPersonID;
        if (this.storeFieldValues.GroupAccountNumber) {
            bodyParams['GroupAccountNumber'] = this.storeFieldValues.GroupAccountNumber;
        }
        if (this.storeFieldValues.AccountNumber) {
            bodyParams['AccountNumber'] = this.storeFieldValues.AccountNumber;
        }
        if (this.storeFieldValues.ContractNumber) {
            bodyParams['ContractNumber'] = this.storeFieldValues.ContractNumber;
        }
        if (this.storeFieldValues.PremiseNumber) {
            bodyParams['PremiseNumber'] = this.storeFieldValues.PremiseNumber;
        }
        if (this.storeFieldValues.InvoiceGroupNumber) {
            bodyParams['InvoiceGroupNumber'] = this.storeFieldValues.InvoiceGroupNumber;
        }
        if (this.storeFieldValues.CurrentCallLogID) {
            bodyParams['CurrentCallLogID'] = this.storeFieldValues.CurrentCallLogID;
        }
        bodyParams[this.serviceConstants.GridHandle] = '1050668';
        bodyParams[this.serviceConstants.GridMode] = '0';
        bodyParams[this.serviceConstants.GridCacheRefresh] = 'True';
        bodyParams[this.serviceConstants.GridPageSize] = this.pageSizeContactRole.toString();
        bodyParams[this.serviceConstants.GridPageCurrent] = this.currentPageContactRole.toString();
        bodyParams[this.serviceConstants.GridSortOrder] = 'Descending';
        this.inputParams.body = bodyParams;
        this.riGridContactRole.updateGridData(this.inputParams, this.rowId);
    };
    ContactPersonTypeCComponent.prototype.portfolioRoleLevelSelect_OnChange = function (selectedItem) {
        if (this.dropdownFlag) {
            this.store.dispatch({
                type: ContactActionTypes.SAVE_FIELD_PARAMS, payload: {
                    'cSelectValue': selectedItem
                }
            });
            this.buildGridContactRole();
        }
        this.dropdownFlag = true;
    };
    ContactPersonTypeCComponent.prototype.onRefresh = function () {
        this.buildGridContactRole();
    };
    ContactPersonTypeCComponent.prototype.selectedRowFocusContactRole = function (data) {
        var cellData = {};
        var cAdditionalInfo = new Array();
        cellData = this.riGridContactRole.getCellInfoForSelectedRow(data.rowIndex, 5);
        cAdditionalInfo = cellData.additionalData.split('^');
        this.riExchange.riInputElement.SetValue(this.contactRolesFormGroup, 'RolesPrimaryContactPersonID', cAdditionalInfo[0]);
        this.riExchange.riInputElement.SetValue(this.contactRolesFormGroup, 'RolesPrimaryContactPersonName', cAdditionalInfo[1]);
        if (this.portfolioRoleLevelDropdown.selectedItem === 'ThisContact') {
            cellData = this.riGridContactRole.getCellInfoForSelectedRow(data.rowIndex, 0);
            cAdditionalInfo = cellData.additionalData.split('|');
            this.savePortfolioLevelKey = cAdditionalInfo[0];
            this.portfolioLevelValue = cAdditionalInfo[1];
        }
    };
    ContactPersonTypeCComponent.prototype.contactRoleGrid_onDblclick = function (data) {
        if (this.cUpdateMode === 'NEUTRAL') {
            if (data.cellIndex === 0 || data.cellIndex === 1) {
                this.selectedRow = data.rowIndex;
                var cellData = this.riGridContactRole.getCellInfoForSelectedRow(data.rowIndex, 0);
                var contactPersonRoleID = cellData.additionalData;
                this.rowId = cellData.additionalData;
                this.onContactRoleToggle(contactPersonRoleID);
            }
        }
        else {
            this.pageParams.hasError = true;
            this.pageParams.errorMessage = 'SaveBeforeSelectMessage';
            this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: this.pageParams });
        }
    };
    ContactPersonTypeCComponent.prototype.gridInfoContactRole = function (data) {
        if (data.totalPages > 0) {
            if (data.totalRows === 0) {
                this.gridTotalItemsContactRole = 0;
            }
            else {
                this.gridTotalItemsContactRole = data.totalPages * this.pageSizeContactRole;
                if (this.selectedRow === -1) {
                    this.riGridContactRole.onCellClick(0, 0);
                }
                else {
                    this.riGridContactRole.onCellClick(this.selectedRow, 0);
                }
            }
        }
    };
    ContactPersonTypeCComponent.prototype.getCurrentPageContactRole = function (event) {
        this.currentPageContactRole = event.value;
        this.buildGridContactRole();
    };
    ContactPersonTypeCComponent.prototype.onContactRoleToggle = function (contactPersonRoleID) {
        var _this = this;
        var currentDate = encodeURI(this.utils.formatDate(new Date()).toString());
        var contactRoleToggleParams = new URLSearchParams();
        contactRoleToggleParams.set(this.serviceConstants.BusinessCode, this.businessCode);
        contactRoleToggleParams.set(this.serviceConstants.CountryCode, this.countryCode);
        contactRoleToggleParams.set(this.serviceConstants.Action, '0');
        var bodyParams = {};
        bodyParams['Function'] = 'ContactPersonRoleToggle';
        bodyParams['ContactPersonID'] = this.storeFieldValues.ContactPersonID;
        bodyParams['ContactPersonRoleID'] = contactPersonRoleID;
        bodyParams['CacheKey'] = '';
        if (this.portfolioRoleLevelDropdown.selectedItem === 'ThisContact') {
            bodyParams['ViewingAllRolesForContact'] = 'Y';
            bodyParams['PortfolioLevelKey'] = this.savePortfolioLevelKey;
        }
        else {
            bodyParams['ViewingAllRolesForContact'] = 'N';
            bodyParams['PortfolioLevelKey'] = this.portfolioRoleLevelDropdown.selectedItem;
        }
        bodyParams['PortfolioLevelValue'] = this.portfolioLevelValue;
        bodyParams['GroupAccountNumber'] = this.storeFieldValues.GroupAccountNumber;
        bodyParams['AccountNumber'] = this.storeFieldValues.AccountNumber;
        bodyParams['ContractNumber'] = this.storeFieldValues.ContractNumber;
        bodyParams['PremiseNumber'] = this.storeFieldValues.PremiseNumber;
        bodyParams['InvoiceGroupNumber'] = this.storeFieldValues.InvoiceGroupNumber;
        bodyParams['EffectiveFromDate'] = this.storeFieldValues.EffectiveFromDate;
        bodyParams['CurrentCallLogID'] = this.storeFieldValues.CurrentCallLogID ? this.storeFieldValues.CurrentCallLogID : '';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, contactRoleToggleParams, bodyParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.ErrorMessage) {
                _this.pageParams.hasError = true;
                _this.pageParams.errorMessage = data.ErrorMessage;
                _this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: _this.pageParams });
                return;
            }
            _this.buildGridContactRole();
            _this.pageParams.closedWithChanges = 'Y';
            _this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: _this.pageParams });
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ContactPersonTypeCComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-contact-person-type-c',
                    templateUrl: 'contactPerson-type-c.html'
                },] },
    ];
    ContactPersonTypeCComponent.ctorParameters = [
        { type: Utils, },
        { type: FormBuilder, },
        { type: Store, },
        { type: NgZone, },
        { type: RiExchange, },
        { type: HttpService, },
        { type: AjaxObservableConstant, },
        { type: ServiceConstants, },
        { type: SpeedScriptConstants, },
        { type: LocaleTranslationService, },
    ];
    ContactPersonTypeCComponent.propDecorators = {
        'riGridContactRole': [{ type: ViewChild, args: ['riGridContactRole',] },],
        'riGridContactRolePagination': [{ type: ViewChild, args: ['riGridContactRolePagination',] },],
        'portfolioRoleLevelDropdown': [{ type: ViewChild, args: ['PortfolioRoleLevelSelect',] },],
    };
    return ContactPersonTypeCComponent;
}());
