import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { TableComponent } from './../../../shared/components/table/table';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Utils } from '../../../shared/services/utility';

@Component({
    selector: 'icabs-invoice-frequency-search',
    templateUrl: 'iCABSBBusinessInvoiceFrequencySearch.html'
})
export class InvoiceFrequencySearchComponent implements OnInit {
    @ViewChild('invoiceTable') invoiceTable: TableComponent;

    public selectedrowdata: any;
    public method: string = 'bill-to-cash/search';
    public module: string = 'invoicing';
    public operation: string = 'Business/iCABSBBusinessInvoiceFrequencySearch';
    public search: URLSearchParams = new URLSearchParams();
    public inputParams: any;
    public tableheader = 'Invoice Frequency Search';

    constructor(
        private serviceConstants: ServiceConstants,
        private ellipsis: EllipsisComponent,
        private utils: Utils,
        private localeTranslateService: LocaleTranslationService) {
    }

    itemsPerPage: number = 10;
    page: number = 1;
    totalItem: number = 11;

    public columns: Array<any> = [
        { title: 'Code', name: 'InvoiceFrequencyCode', sort: 'asc' },
        { title: 'Description', name: 'InvoiceFrequencyDesc' },
        { title: 'Business Default', name: 'InvoiceFrequencyDefaultInd' },
        { title: 'Invoice Charge', name: 'InvoiceChargeInd' }
    ];

    public rowmetadata: Array<any> = [
        { name: 'InvoiceFrequencyDefaultInd', type: 'img' },
        { name: 'InvoiceChargeInd', type: 'img' }
    ];

    public selectedData(event: any): void {
        let returnObj: any;
        if (this.inputParams.parentMode === 'LookUp') {
            returnObj = {
                'InvoiceFrequencyCode': event.row.InvoiceFrequencyCode,
                'InvoiceFrequencyDesc': event.row.InvoiceFrequencyDesc
            };
        } else {
            returnObj = {
                'InvoiceFrequencyCode': event.row.InvoiceFrequencyCode,
                'InvoiceFrequencyDesc': event.row.InvoiceFrequencyDesc,
                'InvoiceFrequencyDefaultInd': event.row.InvoiceFrequencyDefaultInd,
                'InvoiceChargeInd': event.row.InvoiceChargeInd
            };
        }

        this.ellipsis.sendDataToParent(returnObj);
    }

    getCurrentPage(currentPage: number): void {
        this.page = currentPage;
    }

    ngOnInit(): void {
        this.localeTranslateService.setUpTranslation();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
    }

    public updateView(params: any): void {
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
    }
    public refresh(): void {
        this.updateView(this.inputParams);
    }
}
