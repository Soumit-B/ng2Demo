var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { PageIdentifier } from './../../base/PageIdentifier';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { Component, Input, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
export var BusinessOriginDetailLanguageSearchComponent = (function (_super) {
    __extends(BusinessOriginDetailLanguageSearchComponent, _super);
    function BusinessOriginDetailLanguageSearchComponent(injector, ellipsis) {
        _super.call(this, injector);
        this.ellipsis = ellipsis;
        this.pageId = '';
        this.pageTitle = '';
        this.parentMode = '';
        this.defaultLang = 'ENG';
        this.itemsPerPage = 10;
        this.page = 1;
        this.grdLanguageDetail = true;
        this.controls = [
            { name: 'LanguageCode', readonly: false, disabled: false, required: true },
            { name: 'LanguageDescription', readonly: false, disabled: false, required: false },
            { name: 'BusinessOriginCode', readonly: false, disabled: false, required: true },
            { name: 'BusinessOriginSystemDesc', readonly: false, disabled: false, required: false }
        ];
        this.muleConfig = {
            method: 'contract-management/search',
            module: 'contract-admin',
            operation: 'Business/iCABSBBusinessOriginDetailLanguageSearch',
            contentType: 'application/x-www-form-urlencoded'
        };
        this.model = {};
        this.columns = [];
        this.defaultLang = this.riExchange.LanguageCode();
        this.pageId = PageIdentifier.ICABSBBUSINESSORIGINDETAILLANGUAGESEARCH;
        this.pageTitle = 'Business Origin Search';
        this.search = this.getURLSearchParamObject();
    }
    BusinessOriginDetailLanguageSearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
            }
        });
        this.riExchange.riInputElement.Disable(this.uiForm, 'LanguageDescription');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BusinessOriginSystemDesc');
        this.populateUIFromFormData();
    };
    BusinessOriginDetailLanguageSearchComponent.prototype.ngOnDestroy = function () {
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
        _super.prototype.ngOnDestroy.call(this);
    };
    BusinessOriginDetailLanguageSearchComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('Type Code', null).subscribe(function (res) {
            _this.zone.run(function () {
                _this.columns.push({ title: res, name: 'BusinessOriginDetailCode' });
            });
        });
        if (this.grdLanguageDetail === true) {
            this.getTranslatedValue('Description', null).subscribe(function (res) {
                _this.zone.run(function () {
                    _this.columns.push({ title: res, name: 'BusinessOriginDetailSystemDesc' });
                });
            });
        }
        this.getTranslatedValue('Display Description', null).subscribe(function (res) {
            _this.zone.run(function () {
                _this.columns.push({ title: res, name: 'BusinessOriginDetailDesc' });
            });
        });
    };
    BusinessOriginDetailLanguageSearchComponent.prototype.setDefaultValues = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LanguageCode', this.inputParams.LanguageCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LanguageDescription', this.inputParams.LanguageDescription);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginCode', this.inputParams.BusinessOriginCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginSystemDesc', this.inputParams.BusinessOriginSystemDesc);
        if (!this.riExchange.riInputElement.GetValue(this.uiForm, 'LanguageCode')) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'LanguageCode', this.riExchange.LanguageCode());
            this.grdLanguageDetail = false;
        }
    };
    BusinessOriginDetailLanguageSearchComponent.prototype.selectedData = function (event) {
        var returnObj;
        returnObj = {
            BusinessOriginCode: '',
            BusinessOriginSystemDesc: '',
            BusinessOriginDetailCode: '',
            BusinessOriginDetailDesc: '',
            BusinessOriginDetailSystemDesc: '',
            row: event.row
        };
        returnObj.BusinessOriginCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode');
        returnObj.BusinessOriginSystemDesc = this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginSystemDesc');
        returnObj.BusinessOriginDetailCode = event.row.BusinessOriginDetailCode;
        switch (this.parentMode) {
            case 'LookUp':
            case 'LookUp-Active':
                returnObj.BusinessOriginDetailDesc = event.row.BusinessOriginDetailDesc;
                if (this.grdLanguageDetail) {
                    returnObj.BusinessOriginDetailSystemDesc = event.row.BusinessOriginDetailSystemDesc;
                }
                break;
            default:
        }
        this.ellipsis.sendDataToParent(returnObj);
    };
    BusinessOriginDetailLanguageSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
    };
    BusinessOriginDetailLanguageSearchComponent.prototype.updateView = function (params) {
        this.inputParams = params || this.inputParams;
        if (params) {
            this.setDefaultValues();
        }
        if (!params) {
            params = this.inputParams;
        }
        this.inputParams.module = this.muleConfig.module;
        this.inputParams.method = this.muleConfig.method;
        this.inputParams.operation = this.muleConfig.operation;
        if (params.businessCode !== undefined && params.businessCode !== null) {
            this.search.set(this.serviceConstants.BusinessCode, params.businessCode);
        }
        else {
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        }
        if (params.countryCode !== undefined && params.countryCode !== null) {
            this.search.set(this.serviceConstants.CountryCode, params.countryCode);
        }
        else {
            this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        }
        this.search.set('BusinessOriginCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode'));
        this.search.set('LanguageCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'LanguageCode'));
        this.inputParams.search = this.search;
        this.languageSearchTable.loadTableData(this.inputParams);
    };
    BusinessOriginDetailLanguageSearchComponent.prototype.onChangeCode = function () {
        if (!this.uiForm.valid) {
            return;
        }
        this.loadTable();
    };
    BusinessOriginDetailLanguageSearchComponent.prototype.onRefresh = function () {
        this.loadTable();
    };
    BusinessOriginDetailLanguageSearchComponent.prototype.loadTable = function () {
        this.search.set('BusinessOriginCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode'));
        this.search.set('LanguageCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'LanguageCode'));
        this.inputParams.search = this.search;
        this.languageSearchTable.loadTableData(this.inputParams);
    };
    BusinessOriginDetailLanguageSearchComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-business-origin-detail-lang-search',
                    templateUrl: 'iCABSBBusinessOriginDetailLanguageSearch.html'
                },] },
    ];
    BusinessOriginDetailLanguageSearchComponent.ctorParameters = [
        { type: Injector, },
        { type: EllipsisComponent, },
    ];
    BusinessOriginDetailLanguageSearchComponent.propDecorators = {
        'languageSearchTable': [{ type: ViewChild, args: ['languageSearchTable',] },],
        'inputParams': [{ type: Input },],
    };
    return BusinessOriginDetailLanguageSearchComponent;
}(BaseComponent));
