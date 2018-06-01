import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { Component, Input, ViewChild } from '@angular/core';
export var PaymentSearchComponent = (function () {
    function PaymentSearchComponent(serviceConstants, ellipsis, localeTranslateService) {
        this.serviceConstants = serviceConstants;
        this.ellipsis = ellipsis;
        this.localeTranslateService = localeTranslateService;
        this.method = 'bill-to-cash/search';
        this.module = 'payment';
        this.operation = 'Business/iCABSBPaymentTypeSearch';
        this.search = new URLSearchParams();
        this.itemsPerPage = 10;
        this.page = 1;
        this.totalItem = 11;
        this.columns = [
            { title: 'Code', name: 'PaymentTypeCode' },
            { title: 'Description', name: 'PaymentDesc' },
            { title: 'Reference Required', name: 'ReferenceRequired' },
            { title: 'Mandate Required', name: 'MandateRequired' },
            { title: 'Suspend Invoice', name: 'InvoiceSuspendInd' },
            { title: 'Default', name: 'DefaultInd' }
        ];
        this.rowmetadata = [
            { name: 'ReferenceRequired', type: 'img' },
            { name: 'MandateRequired', type: 'img' },
            { name: 'InvoiceSuspendInd', type: 'img' },
            { name: 'DefaultInd', type: 'img' }
        ];
    }
    ;
    PaymentSearchComponent.prototype.selectedData = function (event) {
        var returnObj;
        if (this.inputParams.parentMode === 'LookUp') {
            returnObj = {
                'PaymentTypeCode': event.row.PaymentTypeCode,
                'PaymentDesc': event.row.PaymentDesc
            };
        }
        else if (this.inputParams.parentMode === 'iCABSAPDAReconciliation') {
            returnObj = { 'SelPaymentTypeCode': event.row.PaymentTypeCode };
        }
        else {
            returnObj = {
                'PaymentTypeCode': event.row.PaymentTypeCode,
                'Object': event.row
            };
        }
        this.ellipsis.sendDataToParent(returnObj);
    };
    PaymentSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
    };
    PaymentSearchComponent.prototype.ngOnInit = function () {
        this.search.set(this.serviceConstants.Action, '0');
        this.localeTranslateService.setUpTranslation();
    };
    PaymentSearchComponent.prototype.updateView = function (params) {
        this.inputParams = params || this.inputParams;
        if (!params) {
            params = this.inputParams;
        }
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
        this.search.set('search.sortby', 'PaymentTypeCode');
        this.inputParams.search = this.search;
        this.paymentTable.loadTableData(this.inputParams);
    };
    PaymentSearchComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-payment-search',
                    templateUrl: 'iCABSBPaymentTypeSearch.html'
                },] },
    ];
    PaymentSearchComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: EllipsisComponent, },
        { type: LocaleTranslationService, },
    ];
    PaymentSearchComponent.propDecorators = {
        'paymentTable': [{ type: ViewChild, args: ['paymentTable',] },],
        'inputParams': [{ type: Input },],
    };
    return PaymentSearchComponent;
}());
