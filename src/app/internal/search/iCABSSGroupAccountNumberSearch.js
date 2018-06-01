import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { FormBuilder } from '@angular/forms';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { Component, Input, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/services/utility';
export var GroupAccountNumberComponent = (function () {
    function GroupAccountNumberComponent(serviceConstants, ellipsis, _router, zone, utils, _formBuilder, localeTranslateService) {
        this.serviceConstants = serviceConstants;
        this.ellipsis = ellipsis;
        this._router = _router;
        this.zone = zone;
        this.utils = utils;
        this._formBuilder = _formBuilder;
        this.localeTranslateService = localeTranslateService;
        this.showAddNew = false;
        this.method = 'contract-management/search';
        this.module = 'group-account';
        this.operation = 'System/iCABSSGroupAccountNumberSearch';
        this.search = new URLSearchParams();
        this.showHeader = true;
        this.itemsPerPage = 10;
        this.page = 1;
        this.totalItem = 11;
        this.tableheader = 'Group Account Search';
        this.columns = [
            { title: 'Group Account Number', name: 'GroupAccountNumber' },
            { title: 'Group Name', name: 'GroupName' },
            { title: 'Agreement Date', name: 'GroupAgreementDate' }
        ];
    }
    GroupAccountNumberComponent.prototype.selectedData = function (event) {
        var returnGrpObj;
        var parentMode = this.inputParamsGrpAccNumber.parentMode;
        switch (parentMode) {
            case 'LookUp':
            case 'Lookup-UpdateParent':
            case 'LookUp-NoMenu':
                returnGrpObj = {
                    'GroupAccountNumber': event.row.GroupAccountNumber,
                    'GroupName': event.row.GroupName
                };
                break;
            case 'LookUp-Search':
                returnGrpObj = {
                    'SearchID': event.row.GroupAccountNumber,
                    'GroupName': event.row.GroupName
                };
                break;
            case 'LookUp1':
                returnGrpObj = {
                    'GroupAccountNumber': event.row.GroupAccountNumber,
                    'GroupAccountNumber1': event.row.GroupAccountNumber,
                    'GroupName1': event.row.GroupName
                };
                break;
            case 'LookUp2':
                returnGrpObj = {
                    'GroupAccountNumber': event.row.GroupAccountNumber,
                    'GroupAccountNumber2': event.row.GroupAccountNumber,
                    'GroupName2': event.row.GroupName
                };
                break;
            case 'GeneralSearch-Lookup':
                returnGrpObj = {
                    'SearchValue': event.row.GroupAccountNumber
                };
                break;
            case 'Search':
                returnGrpObj = {
                    'GroupAccountNumber': event.row.GroupAccountNumber,
                    'GroupName': event.row.GroupName
                };
                break;
            default:
                returnGrpObj = {
                    'GroupAccountNumber': event.row.GroupAccountNumber,
                    'Object': event.row
                };
        }
        this.ellipsis.sendDataToParent(returnGrpObj);
    };
    GroupAccountNumberComponent.prototype.ngOnInit = function () {
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.localeTranslateService.setUpTranslation();
    };
    GroupAccountNumberComponent.prototype.updateView = function (params) {
        var _this = this;
        this.zone.run(function () {
            _this.inputParams = params;
            if (_this.inputParams && _this.inputParams.showAddNew !== undefined) {
                _this.showAddNew = true;
            }
            if (typeof params.showAddNew !== 'undefined') {
                _this.showAddNew = params.showAddNew;
            }
        });
        this.inputParamsGrpAccNumber = params;
        this.inputParamsGrpAccNumber.module = this.module;
        this.inputParamsGrpAccNumber.method = this.method;
        this.inputParamsGrpAccNumber.operation = this.operation;
        if (params.businessCode) {
            this.search.set(this.serviceConstants.BusinessCode, params.businessCode);
        }
        else {
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        }
        if (params.countryCode) {
            this.search.set(this.serviceConstants.CountryCode, params.countryCode);
        }
        else {
            this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        }
        this.inputParamsGrpAccNumber.search = this.search;
        this.GroupAccountTable.loadTableData(this.inputParamsGrpAccNumber);
    };
    GroupAccountNumberComponent.prototype.getFiterValue = function (e) {
        this.filterValue = e;
    };
    GroupAccountNumberComponent.prototype.onChange = function (event) {
    };
    GroupAccountNumberComponent.prototype.refresh = function () {
        this.loadTableData();
    };
    GroupAccountNumberComponent.prototype.loadTableData = function () {
        this.page = 1;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (this.filterValue === 'GroupName') {
            this.search.set('GroupName', this.FilterInputCheck);
            this.search.set('search.op.GroupName', 'GE');
            this.search.set('search.sortby', 'GroupName');
        }
        if (this.filterValue === 'GroupAccountNumber') {
            this.search.set('GroupAccountNumber', this.FilterInput);
            this.search.set('search.op.GroupAccountNumber', 'GE');
            this.search.set('search.sortby', 'GroupAccountNumber');
        }
        this.inputParamsGrpAccNumber.search = this.search;
        this.GroupAccountTable.loadTableData(this.inputParamsGrpAccNumber);
    };
    GroupAccountNumberComponent.prototype.onAddNew = function () {
        this.ellipsis.onAddNew(true);
        this.ellipsis.closeModal();
    };
    GroupAccountNumberComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSGroupAccountNumberSearch.html'
                },] },
    ];
    GroupAccountNumberComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: EllipsisComponent, },
        { type: Router, },
        { type: NgZone, },
        { type: Utils, },
        { type: FormBuilder, },
        { type: LocaleTranslationService, },
    ];
    GroupAccountNumberComponent.propDecorators = {
        'GroupAccountTable': [{ type: ViewChild, args: ['GroupAccountTable',] },],
        'showAddNew': [{ type: Input },],
        'inputParams': [{ type: Input },],
    };
    return GroupAccountNumberComponent;
}());
