var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from '../../base/BaseComponent';
import { Observable } from 'rxjs/Rx';
import { Component, Injector, ViewChild } from '@angular/core';
export var ListGroupSearchComponent = (function (_super) {
    __extends(ListGroupSearchComponent, _super);
    function ListGroupSearchComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.search = new URLSearchParams();
        this.controls = [
            { name: 'APICode', readonly: false, disabled: true, required: false },
            { name: 'APICodeDesc', readonly: false, disabled: true, required: false }
        ];
        this.columns = [
            { title: 'List Group', name: 'ListGroupCode' },
            { title: 'Description', name: 'ListGroupDesc' },
            { title: 'List Details', name: 'ListDetails' },
            { title: 'Display Order', name: 'DisplayOrder' }
        ];
        this.queryParams = {
            operation: 'Business/iCABSBListGroupSearch',
            module: 'advantage',
            method: 'prospect-to-contract/search'
        };
        this.tableheading = 'List Group Search';
        this.page = '1';
        this.itemsPerPage = '10';
        this.pageId = PageIdentifier.ICABSBLISTGROUPSEARCH;
    }
    ListGroupSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.buildTable();
    };
    ListGroupSearchComponent.prototype.buildTable = function () {
        var _this = this;
        this.localeTranslateService.setUpTranslation();
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
            }
        });
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (this.riExchange.getParentHTMLValue('LGListTypeCodeVal'))
            this.search.set('ListTypeCode', this.riExchange.getParentHTMLValue('LGListTypeCodeVal'));
        else if (this.riExchange.getParentHTMLValue('ListTypeCode'))
            this.search.set('ListTypeCode', this.riExchange.getParentHTMLValue('ListTypeCode'));
        else
            this.search.set('ListTypeCode', '');
        this.queryParams.search = this.search;
        this.listGroupSearchTable.loadTableData(this.queryParams);
    };
    ListGroupSearchComponent.prototype.onSelect = function (event) {
        var vntReturnData;
        vntReturnData = event.row;
        if (this.parentMode) {
            switch (this.parentMode) {
                case 'LookUp':
                case 'LookUp-Maint':
                    if (vntReturnData.ListGroupCode)
                        this.riExchange.SetParentHTMLInputValue('vbLGListGroupCodeFld', vntReturnData.ListGroupCode);
                    if (vntReturnData.ListGroupDesc)
                        this.riExchange.SetParentHTMLInputValue('vbLGListGroupDescFld', vntReturnData.ListGroupDesc);
                    if (vntReturnData.ListDetails)
                        this.riExchange.SetParentHTMLInputValue('vbLGListDetailsFld', vntReturnData.ListDetails);
                    break;
                default:
                    if (vntReturnData.ListGroupCode)
                        this.riExchange.SetParentHTMLInputValue('vbLGListGroupCodeFld', vntReturnData.ListGroupCode);
                    break;
            }
        }
    };
    ListGroupSearchComponent.prototype.tableDataLoaded = function (data) {
        var tableRecords = data.tableData['records'];
        if (tableRecords.length === 0) {
            this.tableheading = 'No record found';
        }
    };
    ListGroupSearchComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        Observable.forkJoin(this.getTranslatedValue('List Group', null), this.getTranslatedValue('Description', null), this.getTranslatedValue('List Details', null), this.getTranslatedValue('Display Order', null)).subscribe(function (data) {
            _this.columns = [
                { title: data[0], name: 'ListGroupCode' },
                { title: data[1], name: 'ListGroupDesc' },
                { title: data[2], name: 'ListDetails' },
                { title: data[3], name: 'DisplayOrder' }
            ];
        });
    };
    ListGroupSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBListGroupSearch.html'
                },] },
    ];
    ListGroupSearchComponent.ctorParameters = [
        { type: Injector, },
    ];
    ListGroupSearchComponent.propDecorators = {
        'listGroupSearchTable': [{ type: ViewChild, args: ['listGroupSearchTable',] },],
    };
    return ListGroupSearchComponent;
}(BaseComponent));
