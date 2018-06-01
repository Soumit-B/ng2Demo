import { ContactActionTypes } from './../../../../actions/contact';
import { HttpService } from './../../../../../shared/services/http-service';
import { Utils } from './../../../../../shared/services/utility';
import { Store } from '@ngrx/store';
import { ServiceConstants } from './../../../../../shared/constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { Component, ViewChild } from '@angular/core';
export var ContactPersonTypeAComponent = (function () {
    function ContactPersonTypeAComponent(utils, store, serviceConstants, httpService) {
        this.utils = utils;
        this.store = store;
        this.serviceConstants = serviceConstants;
        this.httpService = httpService;
        this.inputParams = {};
        this.search = new URLSearchParams();
        this.headerParams = {
            method: 'ccm/maintenance',
            module: 'customer',
            operation: 'ContactManagement/iCABSCMContactPersonMaintenance'
        };
        this.action = '2';
        this.headerClicked = '';
        this.sortType = 'ASC';
        this.pageParams = {};
        this.storeFieldValues = {};
        this.cUpdateMode = false;
        this.selectedRow = -1;
        this.countryCode = this.utils.getCountryCode();
        this.businessCode = this.utils.getBusinessCode();
    }
    ContactPersonTypeAComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.pageSize = 4;
        this.currentPageContact = 1;
        this.maxColumnsContact = 10;
        this.currentPageContactGlobalRole = 1;
        this.storeSubscription = this.store.select('contact').subscribe(function (data) {
            switch (data['action']) {
                case ContactActionTypes.SAVE_PARAMS:
                    if (data !== null && data['params'] && !(Object.keys(data['params']).length === 0 && data['params'].constructor === Object)) {
                        _this.pageParams = data['params'];
                        _this.cUpdateMode = data['params'].cUpdateMode;
                        if (_this.pageParams.riContact_Execute) {
                            _this.buildGridContact();
                        }
                    }
                    break;
                case ContactActionTypes.SAVE_FIELD:
                    if (data !== null && data['fieldValue'] && !(Object.keys(data['fieldValue']).length === 0 && data['fieldValue'].constructor === Object)) {
                        _this.storeFieldValues = data['fieldValue'];
                    }
                    break;
            }
        });
        this.gridSortHeaders = [{
                'fieldName': 'SrchContactPersonName',
                'index': 0,
                'sortType': 'ASC'
            }, {
                'fieldName': 'SrchContactPosition',
                'index': 1,
                'sortType': 'ASC'
            }, {
                'fieldName': 'SrchContactTelephone',
                'index': 2,
                'sortType': 'ASC'
            }, {
                'fieldName': 'SrchContactMobile',
                'index': 3,
                'sortType': 'ASC'
            }, {
                'fieldName': 'SrchGroupAcct',
                'index': 4,
                'sortType': 'ASC'
            }, {
                'fieldName': 'SrchAccount',
                'index': 5,
                'sortType': 'ASC'
            }, {
                'fieldName': 'SrchInvGroup',
                'index': 6,
                'sortType': 'ASC'
            }, {
                'fieldName': 'SrchContract',
                'index': 7,
                'sortType': 'ASC'
            }, {
                'fieldName': 'SrchPremise',
                'index': 8,
                'sortType': 'ASC'
            }];
        for (var k = 0; k < this.gridSortHeaders.length; k++) {
            if (this.gridSortHeaders[k].fieldName === this.headerClicked) {
                this.gridSortHeaders[k].sortType = this.sortType === 'Descending' ? 'DESC' : 'ASC';
            }
        }
    };
    ContactPersonTypeAComponent.prototype.ngOnDestroy = function () {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    };
    ContactPersonTypeAComponent.prototype.buildGridContact = function () {
        this.pageParams.riContact_Execute = false;
        this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: this.pageParams });
        var gridHandle = (Math.floor(Math.random() * 900000) + 100000).toString();
        var contactGridParams = {};
        contactGridParams.method = this.headerParams.method;
        contactGridParams.module = this.headerParams.module;
        contactGridParams.operation = this.headerParams.operation;
        var contactSearchParams = new URLSearchParams();
        contactSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode);
        contactSearchParams.set(this.serviceConstants.CountryCode, this.countryCode);
        contactSearchParams.set(this.serviceConstants.GridName, 'ContactPersonPortfolio');
        contactSearchParams.set('ContactPersonRoleID', this.storeFieldValues.ContactPersonRoleID);
        contactSearchParams.set('ViewLevel', this.storeFieldValues.ViewLevel);
        if (this.storeFieldValues.GroupAccountNumber) {
            contactSearchParams.set('GroupAccountNumber', this.storeFieldValues.GroupAccountNumber);
        }
        else {
            contactSearchParams.delete('GroupAccountNumber');
        }
        if (this.storeFieldValues.AccountNumber) {
            contactSearchParams.set('AccountNumber', this.storeFieldValues.AccountNumber);
        }
        else {
            contactSearchParams.delete('AccountNumber');
        }
        if (this.storeFieldValues.ContractNumber) {
            contactSearchParams.set('ContractNumber', this.storeFieldValues.ContractNumber);
        }
        else {
            contactSearchParams.delete('ContractNumber');
        }
        if (this.storeFieldValues.PremiseNumber) {
            contactSearchParams.set('PremiseNumber', this.storeFieldValues.PremiseNumber);
        }
        else {
            contactSearchParams.delete('PremiseNumber');
        }
        if (this.storeFieldValues.InvoiceGroupNumber) {
            contactSearchParams.set('InvoiceGroupNumber', this.storeFieldValues.InvoiceGroupNumber);
        }
        else {
            contactSearchParams.delete('InvoiceGroupNumber');
        }
        contactSearchParams.set(this.serviceConstants.GridHandle, gridHandle);
        contactSearchParams.set(this.serviceConstants.GridMode, '0');
        contactSearchParams.set(this.serviceConstants.GridCacheRefresh, 'True');
        contactSearchParams.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClicked);
        contactSearchParams.set(this.serviceConstants.GridSortOrder, this.sortType);
        contactSearchParams.set(this.serviceConstants.GridPageSize, this.pageSize.toString());
        contactSearchParams.set(this.serviceConstants.GridPageCurrent, this.currentPageContact.toString());
        contactSearchParams.set(this.serviceConstants.Action, this.action);
        contactGridParams.search = contactSearchParams;
        this.riGridContact.loadGridData(contactGridParams);
    };
    ContactPersonTypeAComponent.prototype.sortGridContact = function (data) {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGridContact();
    };
    ContactPersonTypeAComponent.prototype.selectedRowFocusContact = function (data) {
        var rowIndex = data.rowIndex;
        var cellData = this.riGridContact.getCellInfoForSelectedRow(rowIndex, 0);
        var cAdditionalInfo = cellData.additionalData.split('^');
        this.storeFieldValues.ContactPersonID = cAdditionalInfo[0];
        this.storeFieldValues.LastUpdateDate = cAdditionalInfo[1];
        this.storeFieldValues.LastUpdateTime = cAdditionalInfo[2];
        this.storeFieldValues.LastUpdateUserName = cAdditionalInfo[3];
        this.storeFieldValues.EffectiveFromDate = cAdditionalInfo[4];
        this.storeFieldValues.ContactPersonName = cAdditionalInfo[5];
        this.storeFieldValues.ContactPersonPosition = cAdditionalInfo[6];
        this.storeFieldValues.ContactPersonDepartment = cAdditionalInfo[7];
        this.storeFieldValues.ContactPersonNotes = cAdditionalInfo[8];
        this.storeFieldValues.ContactPersonTelephone = cAdditionalInfo[9];
        this.storeFieldValues.ContactPersonMobile = cAdditionalInfo[10];
        this.storeFieldValues.ContactPersonEmail = cAdditionalInfo[11];
        this.storeFieldValues.ContactPersonFax = cAdditionalInfo[12];
        this.storeFieldValues.ContactPersonHighPortfolioLevel = cAdditionalInfo[13];
        this.storeFieldValues.RolesContactPersonID = this.storeFieldValues.ContactPersonID;
        this.storeFieldValues.RolesContactPersonName = this.storeFieldValues.ContactPersonName;
        this.storeFieldValues.PortfolioRoleLevelSelect = this.storeFieldValues.ContactPersonHighPortfolioLevel;
        this.store.dispatch({ type: ContactActionTypes.SAVE_FIELD, payload: this.storeFieldValues });
        this.selectedRow = data.rowIndex;
        this.pageParams.lRefreshContactRole = true;
        this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: this.pageParams });
        this.buildGridContactGlobalRole(this.storeFieldValues.PortfolioRoleLevelSelect);
    };
    ContactPersonTypeAComponent.prototype.buildGridContactGlobalRole = function (portfolioRoleLevelSelect) {
        var gridHandle = (Math.floor(Math.random() * 900000) + 100000).toString();
        if (portfolioRoleLevelSelect === 'ThisContact') {
            this.maxColumnsContactGlobalRole = 9;
        }
        else {
            this.maxColumnsContactGlobalRole = 6;
        }
        var riGridContactGlobalRoleParams = {};
        riGridContactGlobalRoleParams.method = this.headerParams.method;
        riGridContactGlobalRoleParams.module = this.headerParams.module;
        riGridContactGlobalRoleParams.operation = this.headerParams.operation;
        var contactGlobalRoleSearchParams = new URLSearchParams();
        contactGlobalRoleSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode);
        contactGlobalRoleSearchParams.set(this.serviceConstants.CountryCode, this.countryCode);
        contactGlobalRoleSearchParams.set(this.serviceConstants.GridName, 'ContactPersonGlobalRole');
        contactGlobalRoleSearchParams.set('ContactPersonID', this.storeFieldValues.ContactPersonID);
        contactGlobalRoleSearchParams.set('ContactPersonRoleID', this.storeFieldValues.ContactPersonRoleID);
        contactGlobalRoleSearchParams.set('GroupAccountNumber', this.storeFieldValues.GroupAccountNumber);
        contactGlobalRoleSearchParams.set('AccountNumber', this.storeFieldValues.AccountNumber);
        contactGlobalRoleSearchParams.set('ContractNumber', this.storeFieldValues.ContractNumber);
        contactGlobalRoleSearchParams.set('PremiseNumber', this.storeFieldValues.PremiseNumber);
        contactGlobalRoleSearchParams.set('InvoiceGroupNumber', this.storeFieldValues.InvoiceGroupNumber);
        contactGlobalRoleSearchParams.set('ViewLevel', this.storeFieldValues.ViewLevel);
        contactGlobalRoleSearchParams.set(this.serviceConstants.GridHandle, gridHandle);
        contactGlobalRoleSearchParams.set(this.serviceConstants.GridCacheRefresh, 'True');
        contactGlobalRoleSearchParams.set(this.serviceConstants.GridPageSize, this.pageSize.toString());
        contactGlobalRoleSearchParams.set(this.serviceConstants.GridPageCurrent, this.currentPageContactGlobalRole.toString());
        contactGlobalRoleSearchParams.set(this.serviceConstants.GridMode, '0');
        contactGlobalRoleSearchParams.set(this.serviceConstants.Action, this.action);
        riGridContactGlobalRoleParams.search = contactGlobalRoleSearchParams;
        this.riGridContactGlobalRole.loadGridData(riGridContactGlobalRoleParams);
    };
    ContactPersonTypeAComponent.prototype.gridInfoContact = function (data) {
        if (data.totalPages > 0) {
            if (data.totalRows === 0) {
                this.gridTotalItemsContact = 0;
                this.noContactsFound();
            }
            else {
                this.gridTotalItemsContact = data.totalRows;
                if (this.selectedRow === -1) {
                    this.riGridContact.onCellClick(0, 0);
                }
                else {
                    this.riGridContact.onCellClick(this.selectedRow, 0);
                }
            }
        }
    };
    ContactPersonTypeAComponent.prototype.getCurrentContactPage = function (event) {
        this.selectedRow = -1;
        this.currentPageContact = event.value;
        this.buildGridContact();
    };
    ContactPersonTypeAComponent.prototype.getCurrentPageContactRole = function (event) {
        this.currentPageContactGlobalRole = event.value;
        this.buildGridContactGlobalRole(this.storeFieldValues.PortfolioRoleLevelSelect);
    };
    ContactPersonTypeAComponent.prototype.noContactsFound = function () {
        var fieldParams = {};
        fieldParams['ContactPersonID'] = '';
        fieldParams['LastUpdateDate'] = '';
        fieldParams['LastUpdateTime'] = '';
        fieldParams['LastUpdateUserName'] = '';
        fieldParams['EffectiveFromDate'] = '';
        fieldParams['ContactPersonName'] = '';
        fieldParams['ContactPersonPosition'] = '';
        fieldParams['ContactPersonDepartment'] = '';
        fieldParams['ContactPersonNotes'] = '';
        fieldParams['ContactPersonTelephone'] = '';
        fieldParams['ContactPersonMobile'] = '';
        fieldParams['ContactPersonEmail'] = '';
        fieldParams['ContactPersonFax'] = '';
        fieldParams['RolesContactPersonID'] = '';
        fieldParams['RolesContactPersonName'] = '';
        fieldParams['RolesPrimaryContactPersonID'] = '';
        fieldParams['RolesPrimaryContactPersonName'] = '';
        this.riGridContactGlobalRole.clearGridData();
        this.pageParams.lRefreshContactRole = true;
        this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: this.pageParams });
    };
    ContactPersonTypeAComponent.prototype.gridInfoContactGlobalRole = function (data) {
        if (data.totalPages) {
            if (data.totalRows === 0) {
                this.gridTotalItemsGlobalRole = 0;
            }
            else {
                this.gridTotalItemsGlobalRole = data.totalRows;
            }
        }
    };
    ContactPersonTypeAComponent.prototype.riGridContact_onRefresh = function () {
        this.currentPageContact = 1;
        this.riGridContact.clearGridData();
        this.riGridContactGlobalRole.clearGridData();
        this.buildGridContact();
    };
    ContactPersonTypeAComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-contact-person-type-a',
                    templateUrl: 'contactPerson-type-a.html'
                },] },
    ];
    ContactPersonTypeAComponent.ctorParameters = [
        { type: Utils, },
        { type: Store, },
        { type: ServiceConstants, },
        { type: HttpService, },
    ];
    ContactPersonTypeAComponent.propDecorators = {
        'riGridContact': [{ type: ViewChild, args: ['riGridContact',] },],
        'riGridContactGlobalRole': [{ type: ViewChild, args: ['riGridContactGlobalRole',] },],
        'riGridContactPagination': [{ type: ViewChild, args: ['riGridContactPagination',] },],
        'riGridContactGlobalRolePagination': [{ type: ViewChild, args: ['riGridContactGlobalRolePagination',] },],
    };
    return ContactPersonTypeAComponent;
}());
