import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { TableComponent } from './../../../shared/components/table/table';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
    selector: 'icabs-payment-search',
    templateUrl: 'iCABSBPaymentTypeSearch.html'
})
export class PaymentSearchComponent implements OnInit {
    @ViewChild('paymentTable') paymentTable: TableComponent;
    @Input() public inputParams: any;

    public selectedrowdata: any;
    public method: string = 'bill-to-cash/search';
    public module: string = 'payment';
    public operation: string = 'Business/iCABSBPaymentTypeSearch';
    public search: URLSearchParams = new URLSearchParams();

    constructor(
        private serviceConstants: ServiceConstants,
        private ellipsis: EllipsisComponent,
        private localeTranslateService: LocaleTranslationService
        ) { };

    itemsPerPage: number = 10;
    page: number = 1;
    totalItem: number = 11;

    public columns: Array<any> = [
    { title: 'Code', name: 'PaymentTypeCode' },
    { title: 'Description', name: 'PaymentDesc' },
    { title: 'Reference Required', name: 'ReferenceRequired' },
    { title: 'Mandate Required', name: 'MandateRequired' },
    { title: 'Suspend Invoice', name: 'InvoiceSuspendInd' },
    { title: 'Default', name: 'DefaultInd' }
    ];

    public rowmetadata: Array<any> = [
    { name: 'ReferenceRequired', type: 'img' },
    { name: 'MandateRequired', type: 'img' },
    { name: 'InvoiceSuspendInd', type: 'img' },
    { name: 'DefaultInd', type: 'img' }
    ];

    public selectedData(event: any): void {
        let returnObj: any;
        if (this.inputParams.parentMode === 'LookUp') {
            returnObj = {
                'PaymentTypeCode': event.row.PaymentTypeCode,
                'PaymentDesc': event.row.PaymentDesc
            };
        } else if (this.inputParams.parentMode === 'iCABSAPDAReconciliation') {
            returnObj = { 'SelPaymentTypeCode': event.row.PaymentTypeCode };
        } else {
            returnObj = {
                'PaymentTypeCode': event.row.PaymentTypeCode,
                'Object': event.row
            };
        }
        this.ellipsis.sendDataToParent(returnObj);
    }

    public getCurrentPage(currentPage: number): void {
        this.page = currentPage;
    }

    ngOnInit(): void {
        this.search.set(this.serviceConstants.Action, '0');
        this.localeTranslateService.setUpTranslation();
    }

    public updateView(params: any): void {
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
    }
}
