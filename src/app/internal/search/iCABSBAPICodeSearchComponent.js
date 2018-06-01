var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
export var ICABSBAPICodeSearchComponent = (function (_super) {
    __extends(ICABSBAPICodeSearchComponent, _super);
    function ICABSBAPICodeSearchComponent(injector, ellipsis) {
        _super.call(this, injector);
        this.ellipsis = ellipsis;
        this.pageId = '';
        this.method = 'contract-management/search';
        this.module = 'api';
        this.operation = 'Business/iCABSBAPICodeSearch';
        this.search = new URLSearchParams();
        this.itemsPerPage = '10';
        this.page = '1';
        this.totalItem = '11';
        this.inputParams = {};
        this.columns = new Array();
        this.rowmetadata = new Array();
        this.controls = [];
        this.pageId = PageIdentifier.ICABSBAPICODESEARCH;
    }
    ICABSBAPICodeSearchComponent.prototype.ngOnInit = function () {
        this.localeTranslateService.setUpTranslation();
        this.buildTableColumns();
        ;
        this.updateView();
    };
    ICABSBAPICodeSearchComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    ICABSBAPICodeSearchComponent.prototype.buildTableColumns = function () {
        var _this = this;
        this.getTranslatedValue('Code', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'APICode' });
            }
            else {
                _this.columns.push({ title: 'Code', name: 'APICode', sort: 'ASC' });
            }
        });
        this.getTranslatedValue('Description', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'APICodeDesc' });
            }
            else {
                _this.columns.push({ title: 'Description', name: 'APICodeDesc' });
            }
        });
        this.inputParams.columns = [];
        this.inputParams.columns = this.columns;
    };
    ICABSBAPICodeSearchComponent.prototype.onAddNew = function () {
        var addData = { mode: 'add' };
        this.ellipsis.sendDataToParent(addData);
    };
    ICABSBAPICodeSearchComponent.prototype.selectedData = function (event) {
        var returnObj;
        returnObj = event.row;
        this.ellipsis.sendDataToParent(returnObj);
    };
    ICABSBAPICodeSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
    };
    ICABSBAPICodeSearchComponent.prototype.updateView = function () {
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.PageCurrent, this.page);
        this.inputParams.search = this.search;
        this.apiCodeSearchTable.loadTableData(this.inputParams);
    };
    ICABSBAPICodeSearchComponent.prototype.refresh = function () {
        this.updateView();
    };
    ICABSBAPICodeSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBAPICodeSearchComponent.html'
                },] },
    ];
    ICABSBAPICodeSearchComponent.ctorParameters = [
        { type: Injector, },
        { type: EllipsisComponent, },
    ];
    ICABSBAPICodeSearchComponent.propDecorators = {
        'apiCodeSearchTable': [{ type: ViewChild, args: ['apiCodeSearchTable',] },],
    };
    return ICABSBAPICodeSearchComponent;
}(BaseComponent));
