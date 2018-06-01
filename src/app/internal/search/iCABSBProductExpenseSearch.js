var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
export var ProductExpenseSearchComponent = (function (_super) {
    __extends(ProductExpenseSearchComponent, _super);
    function ProductExpenseSearchComponent(injector, ellipsis) {
        _super.call(this, injector);
        this.ellipsis = ellipsis;
        this.pageId = '';
        this.method = 'bill-to-cash/search';
        this.module = 'charges';
        this.operation = 'Business/iCABSBProductExpenseSearch';
        this.search = new URLSearchParams();
        this.itemsPerPage = '10';
        this.page = '1';
        this.totalItem = '11';
        this.inputParams = {};
        this.columns = new Array();
        this.rowmetadata = new Array();
        this.productDisplay = true;
        this.controls = [
            { name: 'ProductCode', readonly: true, disabled: true, required: false },
            { name: 'ProductDesc', readonly: true, disabled: true, required: false }
        ];
        this.pageId = PageIdentifier.ICABSBPRODUCTEXPENSESEARCH;
    }
    ProductExpenseSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        if (this.ellipsis.childConfigParams['productCode'] !== '') {
            this.productDisplay = false;
            this.uiForm.controls['ProductCode'].setValue(this.ellipsis.childConfigParams['productCode']);
        }
        if (this.ellipsis.childConfigParams['productCode'] !== '') {
            this.uiForm.controls['ProductDesc'].setValue(this.ellipsis.childConfigParams['productDesc']);
        }
        this.localeTranslateService.setUpTranslation();
        this.buildTableColumns();
        ;
        this.updateView();
    };
    ProductExpenseSearchComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    ProductExpenseSearchComponent.prototype.buildTableColumns = function () {
        var _this = this;
        if (this.uiForm.controls['ProductCode'].value === '') {
            this.getTranslatedValue('Product Code', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'ProductCode', sort: 'ASC' });
                }
                else {
                    _this.columns.push({ title: 'Product Code', name: 'ProductCode', sort: 'ASC' });
                }
            });
        }
        this.getTranslatedValue('Contract Type', null).subscribe(function (res) {
            if (_this.uiForm.controls['ProductCode'].value !== '') {
                if (res) {
                    _this.columns.push({ title: res, name: 'ContractTypeCode' });
                }
                else {
                    _this.columns.push({ title: 'Contract Type', name: 'ContractTypeCode', sort: 'ASC' });
                }
            }
            else {
                if (res) {
                    _this.columns.push({ title: res, name: 'ContractTypeCode' });
                }
                else {
                    _this.columns.push({ title: 'Contract Type', name: 'ContractTypeCode' });
                }
            }
        });
        this.getTranslatedValue('Description', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'ContractTypeDesc' });
            }
            else {
                _this.columns.push({ title: 'Description', name: 'ContractTypeDesc' });
            }
        });
        this.getTranslatedValue('Expense Code', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'ExpenseCode' });
            }
            else {
                _this.columns.push({ title: 'Expense Code', name: 'ExpenseCode' });
            }
        });
        this.inputParams.columns = [];
        this.inputParams.columns = this.columns;
    };
    ProductExpenseSearchComponent.prototype.onAddNew = function () {
        var addData = { mode: 'add' };
        this.ellipsis.sendDataToParent(addData);
    };
    ProductExpenseSearchComponent.prototype.selectedData = function (event) {
        var returnObj;
        returnObj = event.row;
        this.ellipsis.sendDataToParent(returnObj);
    };
    ProductExpenseSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
    };
    ProductExpenseSearchComponent.prototype.updateView = function () {
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (this.uiForm.controls['ProductCode'].value !== '') {
            this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
        }
        this.search.set(this.serviceConstants.PageCurrent, this.page);
        this.inputParams.search = this.search;
        this.productExpenseSearchTable.loadTableData(this.inputParams);
    };
    ProductExpenseSearchComponent.prototype.refresh = function () {
        this.updateView();
    };
    ProductExpenseSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBProductExpenseSearch.html'
                },] },
    ];
    ProductExpenseSearchComponent.ctorParameters = [
        { type: Injector, },
        { type: EllipsisComponent, },
    ];
    ProductExpenseSearchComponent.propDecorators = {
        'productExpenseSearchTable': [{ type: ViewChild, args: ['productExpenseSearchTable',] },],
        'routeParams': [{ type: Input },],
    };
    return ProductExpenseSearchComponent;
}(BaseComponent));
