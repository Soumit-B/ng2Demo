var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';
import { URLSearchParams } from '@angular/http';
import { Component, Injector, Input, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { BaseComponent } from '../../../base/BaseComponent';
import { FormBuilder } from '@angular/forms';
export var AccountBusinessTypeSearchComponent = (function (_super) {
    __extends(AccountBusinessTypeSearchComponent, _super);
    function AccountBusinessTypeSearchComponent(injector, ellipsis, fb) {
        _super.call(this, injector);
        this.ellipsis = ellipsis;
        this.fb = fb;
        this.busOptions = ['Description', 'Code'];
        this.inputFieldSize = 30;
        this.controls = [
            { name: 'AccountBusinessTypeSearchType', readonly: false, disabled: false, required: false, value: this.busOptions[0] },
            { name: 'AccountBusinessTypeSearchValue', readonly: false, disabled: false, required: false, value: '' }
        ];
        this.isSearchDisabled = true;
        this.itemsPerPage = 10;
        this.page = 1;
        this.columns = [];
        this.rows = [];
        this.rowmetadata = [];
        this.pageId = PageIdentifier.ICABSSACCOUNTBUSINESSTYPESEARCH;
        this.uiForm = this.fb.group({
            AccountBusinessTypeSearchType: [{ value: this.busOptions[0], disabled: false }],
            AccountBusinessTypeSearchValue: [{ value: '', disabled: false }]
        });
    }
    AccountBusinessTypeSearchComponent.prototype.ngOnInit = function () {
    };
    AccountBusinessTypeSearchComponent.prototype.ngOnDestroy = function () {
    };
    AccountBusinessTypeSearchComponent.prototype.tableDataLoaded = function (obj) {
        this.isSearchDisabled = false;
    };
    AccountBusinessTypeSearchComponent.prototype.selectedData = function (obj) {
        var returnObj = {
            'Type': obj.row.AccountBusinessTypeCode,
            'Description': obj.row.AccountBusinessTypeDesc
        };
        this.ellipsis.sendDataToParent(returnObj);
    };
    AccountBusinessTypeSearchComponent.prototype.updateView = function (params) {
        this.inputParams = params;
    };
    AccountBusinessTypeSearchComponent.prototype.loadData = function (obj) {
        this.isSearchDisabled = true;
        var search = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.businessCode());
        search.set(this.serviceConstants.CountryCode, this.countryCode());
        var AccountBusinessTypeSearchType = this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountBusinessTypeSearchType');
        var AccountBusinessTypeSearchValue = this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountBusinessTypeSearchValue');
        var parentMode = this.inputParams.parentMode;
        switch (parentMode) {
            case 'LookUp-Account':
                search.set('ValidForNewBusiness', 'True');
                break;
        }
        switch (AccountBusinessTypeSearchType) {
            case 'Code':
                search.set('AccountBusinessTypeCode', AccountBusinessTypeSearchValue);
                search.set('search.op.AccountBusinessTypeCode', 'GE');
                break;
            case 'Description':
                search.set('AccountBusinessTypeDesc', AccountBusinessTypeSearchValue);
                search.set('search.op.AccountBusinessTypeDesc', 'CONTAINS');
                break;
        }
        search.set('search.sortby', 'AccountBusinessTypeCode');
        var xhr = {
            module: 'account',
            method: 'contract-management/search',
            operation: 'System/iCABSSAccountBusinessTypeSearch',
            search: search
        };
        this.columns.push({ title: 'Type', name: 'AccountBusinessTypeCode' });
        this.columns.push({ title: 'Description', name: 'AccountBusinessTypeDesc' });
        this.resultTable.loadTableData(xhr);
    };
    AccountBusinessTypeSearchComponent.prototype.UpdateHTML = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountBusinessTypeSearchValue', '');
        this.inputField.nativeElement.focus();
        var AccountBusinessTypeSearchType = this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountBusinessTypeSearchType');
        switch (AccountBusinessTypeSearchType) {
            case 'Code':
                this.inputFieldSize = 10;
                break;
            case 'Description':
                this.inputFieldSize = 30;
                break;
        }
    };
    AccountBusinessTypeSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSAccountBusinessTypeSearch.html'
                },] },
    ];
    AccountBusinessTypeSearchComponent.ctorParameters = [
        { type: Injector, },
        { type: EllipsisComponent, },
        { type: FormBuilder, },
    ];
    AccountBusinessTypeSearchComponent.propDecorators = {
        'resultTable': [{ type: ViewChild, args: ['resultTable',] },],
        'inputField': [{ type: ViewChild, args: ['inputField',] },],
        'inputParams': [{ type: Input },],
    };
    return AccountBusinessTypeSearchComponent;
}(BaseComponent));
