import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { Component, ViewChild } from '@angular/core';
import { Utils } from '../../../shared/services/utility';
export var InvoiceFrequencySearchComponent = (function () {
    function InvoiceFrequencySearchComponent(serviceConstants, ellipsis, utils, localeTranslateService) {
        this.serviceConstants = serviceConstants;
        this.ellipsis = ellipsis;
        this.utils = utils;
        this.localeTranslateService = localeTranslateService;
        this.method = 'bill-to-cash/search';
        this.module = 'invoicing';
        this.operation = 'Business/iCABSBBusinessInvoiceFrequencySearch';
        this.search = new URLSearchParams();
        this.tableheader = 'Invoice Frequency Search';
        this.itemsPerPage = 10;
        this.page = 1;
        this.totalItem = 11;
        this.columns = [
            { title: 'Code', name: 'InvoiceFrequencyCode', sort: 'asc' },
            { title: 'Description', name: 'InvoiceFrequencyDesc' },
            { title: 'Business default', name: 'InvoiceFrequencyDefaultInd' },
            { title: 'Invoice Charge', name: 'InvoiceChargeInd' }
        ];
        this.rowmetadata = [
            { name: 'InvoiceFrequencyDefaultInd', type: 'img' },
            { name: 'InvoiceChargeInd', type: 'img' }
        ];
    }
    InvoiceFrequencySearchComponent.prototype.selectedData = function (event) {
        var returnObj;
        if (this.inputParams.parentMode === 'LookUp') {
            returnObj = {
                'InvoiceFrequencyCode': event.row.InvoiceFrequencyCode,
                'InvoiceFrequencyDesc': event.row.InvoiceFrequencyDesc
            };
        }
        else {
            returnObj = {
                'InvoiceFrequencyCode': event.row.InvoiceFrequencyCode,
                'InvoiceFrequencyDesc': event.row.InvoiceFrequencyDesc,
                'InvoiceFrequencyDefaultInd': event.row.InvoiceFrequencyDefaultInd,
                'InvoiceChargeInd': event.row.InvoiceChargeInd
            };
        }
        this.ellipsis.sendDataToParent(returnObj);
    };
    InvoiceFrequencySearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
    };
    InvoiceFrequencySearchComponent.prototype.ngOnInit = function () {
        this.localeTranslateService.setUpTranslation();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
    };
    InvoiceFrequencySearchComponent.prototype.updateView = function (params) {
        this.inputParams = params;
        if (!this.inputParams.countryCode || !this.inputParams.businessCode) {
            return;
        }
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        if (params.businessCode !== undefined && params.businessCode !== null) {
            this.search.set(this.serviceConstants.BusinessCode, params.businessCode);
        }
        if (params.countryCode !== undefined && params.countryCode !== null) {
            this.search.set(this.serviceConstants.CountryCode, params.countryCode);
        }
        this.inputParams.search = this.search;
        this.invoiceTable.loadTableData(this.inputParams);
    };
    InvoiceFrequencySearchComponent.prototype.refresh = function () {
        this.updateView(this.inputParams);
    };
    InvoiceFrequencySearchComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-invoice-frequency-search',
                    templateUrl: 'iCABSBBusinessInvoiceFrequencySearch.html'
                },] },
    ];
    InvoiceFrequencySearchComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: EllipsisComponent, },
        { type: Utils, },
        { type: LocaleTranslationService, },
    ];
    InvoiceFrequencySearchComponent.propDecorators = {
        'invoiceTable': [{ type: ViewChild, args: ['invoiceTable',] },],
    };
    return InvoiceFrequencySearchComponent;
}());
