var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from './../../base/BaseComponent';
import { URLSearchParams } from '@angular/http';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
export var CustomerTypeSearchComponent = (function (_super) {
    __extends(CustomerTypeSearchComponent, _super);
    function CustomerTypeSearchComponent(injector, ellipsis) {
        _super.call(this, injector);
        this.ellipsis = ellipsis;
        this.queryParams = {
            operation: 'System/iCABSSCustomerTypeSearch',
            module: 'segmentation',
            method: 'ccm/search'
        };
        this.pageId = '';
        this.drpCustomerTypeSearchType = '';
        this.txtCustomerTypeSearchValue = '';
        this.search = new URLSearchParams();
        this.inputFieldSize = 30;
        this.controls = [
            { name: 'CustomerTypeSearchValue', readonly: false, disabled: false, required: false },
            { name: 'CustomerTypeSearchType', readonly: false, disabled: false, required: false, value: 'Description' }
        ];
        this.columns = [
            { title: 'Type', name: 'CustomerTypeCode' },
            { title: 'Description', name: 'CustomerTypeDesc' },
            { title: 'Market Segment Code', name: 'MarketSegmentCode' },
            { title: 'SIC Code', name: 'SICCode' },
            { title: 'Narrative', name: 'InvoiceNarrative' }
        ];
        this.tableheading = 'Customer Type Search';
        this.pageId = PageIdentifier.ICABSSCUSTOMERTYPESEARCH;
    }
    CustomerTypeSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.buildTable();
    };
    CustomerTypeSearchComponent.prototype.buildTable = function () {
        var Parent = this.ellipsis.childConfigParams['parentMode'];
        console.log('parent mode page', Parent);
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.drpCustomerTypeSearchType = this.riExchange.riInputElement.GetValue(this.uiForm, 'CustomerTypeSearchType');
        this.txtCustomerTypeSearchValue = this.riExchange.riInputElement.GetValue(this.uiForm, 'CustomerTypeSearchValue');
        if (this.txtCustomerTypeSearchValue !== '') {
            switch (this.drpCustomerTypeSearchType) {
                case 'Code':
                    this.search.set('CustomerTypeCode', this.txtCustomerTypeSearchValue);
                    break;
                case 'Description':
                    this.search.set('CustomerTypeDesc', this.txtCustomerTypeSearchValue);
                    this.search.set('search.op.CustomerTypeDesc', 'BEGINS');
                    break;
            }
        }
        if (Parent === 'LookUp-ProductCustomerTypeGrid' || Parent === 'LookUp-ProductCustomerType') {
            this.search.set('ActiveInd', 'True');
            this.search.set('CustomerTypeLang', 'False');
        }
        else if (Parent === 'LookUp' || Parent === 'LookUp-Premise' || Parent === 'LookUp-PremiseIncSIC') {
            this.search.set('ActiveInd', 'True');
            this.search.set('CustomerTypeLang', 'True');
        }
        else if (Parent === 'LookUp-Maint' || Parent === 'Search-Maint') {
            this.search.set('CustomerTypeLang', 'False');
            this.search.set('ActiveInd', '');
        }
        this.search.set('CustomerTypeLang', 'True');
        this.search.set('ActiveInd', '');
        this.queryParams.search = this.search;
        this.customerTypeSearch.loadTableData(this.queryParams);
    };
    CustomerTypeSearchComponent.prototype.selectedData = function (event) {
        var strCustomerTypes;
        var returnObj = {};
        var Parent = this.ellipsis.childConfigParams['parentMode'];
        switch (Parent) {
            case 'ContractJobReport':
                strCustomerTypes = this.riExchange.getParentHTMLValue('CustomerTypes');
                this.logger.log('strCustomerTypes', strCustomerTypes);
                if (strCustomerTypes === null) {
                    strCustomerTypes = event.row.CustomerTypeCode;
                }
                else {
                    strCustomerTypes = strCustomerTypes + ',' + event.row.CustomerTypeCode;
                }
                returnObj = {
                    'CustomerTypeCode': strCustomerTypes
                };
                break;
            case 'PCIncludeCustomerTypes':
            case 'PPUIncludeCustomerTypes':
            case 'CWIIncludeCustomerTypes':
                if (Parent === 'PCIncludeCustomerTypes')
                    strCustomerTypes = this.riExchange.getParentHTMLValue('PCIncludeCustomerTypes');
                if (Parent === 'PPUIncludeCustomerTypes')
                    strCustomerTypes = this.riExchange.getParentHTMLValue('PPUIncludeCustomerTypes');
                if (Parent === 'CWIIncludeCustomerTypes')
                    strCustomerTypes = this.riExchange.getParentHTMLValue('CWIIncludeCustomerTypes');
                if (strCustomerTypes === null) {
                    strCustomerTypes = event.row.CustomerTypeCode;
                }
                else {
                    strCustomerTypes = strCustomerTypes + ',' + event.row.CustomerTypeCode;
                }
                returnObj = {
                    'CustomerTypeCode': strCustomerTypes
                };
                break;
            case 'PCExcludeCustomerTypes':
            case 'PPUExcludeCustomerTypes':
            case 'CWIExcludeCustomerTypes':
                if (Parent === 'PCExcludeCustomerTypes')
                    strCustomerTypes = this.riExchange.getParentHTMLValue('PCExcludeCustomerTypes');
                if (Parent === 'PPUExcludeCustomerTypes')
                    strCustomerTypes = this.riExchange.getParentHTMLValue('PPUExcludeCustomerTypes');
                if (Parent === 'CWIExcludeCustomerTypes')
                    strCustomerTypes = this.riExchange.getParentHTMLValue('CWIExcludeCustomerTypes');
                if (strCustomerTypes === null || strCustomerTypes === undefined) {
                    strCustomerTypes = event.row.CustomerTypeCode;
                }
                else {
                    strCustomerTypes = strCustomerTypes + ',' + event.row.CustomerTypeCode;
                }
                returnObj = {
                    'CustomerTypeCode': strCustomerTypes
                };
                break;
            case 'LookUp-PremiseIncSIC':
                returnObj = {
                    'CustomerTypeCode': event.row.CustomerTypeCode,
                    'CustomerTypeDesc': event.row.CustomerTypeDesc,
                    'SICCode': event.row.SICCode
                };
                break;
            case 'LookUp-Premise':
                returnObj = {
                    'CustomerTypeCode': event.row.CustomerTypeCode,
                    'CustomerTypeDesc': event.row.CustomerTypeDesc
                };
                break;
            default:
                returnObj = {
                    'CustomerTypeCode': event.row.CustomerTypeCode,
                    'CustomerTypeDesc': event.row.CustomerTypeDesc
                };
                if (Parent === 'LookUp' || Parent === 'LookUp-Maint' || Parent === 'LookUp-ProductCustomerType') {
                    returnObj = {
                        'CustomerTypeCode': event.row.CustomerTypeDesc
                    };
                }
                else if (Parent === 'LookUp-ProductCustomerTypeGrid')
                    returnObj = {
                        'CustomerTypeCode': event.row.CustomerTypeCode,
                        'CustomerTypeDesc': event.row.CustomerTypeDesc
                    };
        }
        this.ellipsis.sendDataToParent(returnObj);
    };
    CustomerTypeSearchComponent.prototype.UpdateHTML = function () {
        this.setControlValue('CustomerTypeSearchValue', '');
        this.inputField.nativeElement.focus();
        var CustomerTypeSearchType = this.getControlValue('CustomerTypeSearchType');
        switch (CustomerTypeSearchType) {
            case 'Code':
                this.inputFieldSize = 10;
                break;
            case 'Description':
                this.inputFieldSize = 30;
                break;
        }
    };
    CustomerTypeSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSCustomerTypeSearch.html'
                },] },
    ];
    CustomerTypeSearchComponent.ctorParameters = [
        { type: Injector, },
        { type: EllipsisComponent, },
    ];
    CustomerTypeSearchComponent.propDecorators = {
        'customerTypeSearch': [{ type: ViewChild, args: ['customerTypeSearch',] },],
        'inputField': [{ type: ViewChild, args: ['inputField',] },],
    };
    return CustomerTypeSearchComponent;
}(BaseComponent));
