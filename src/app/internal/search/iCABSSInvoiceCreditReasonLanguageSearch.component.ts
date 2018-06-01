import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Utils } from '../../../shared/services/utility';
import { Subscription } from 'rxjs';
import { DropdownComponent } from './../../../shared/components/dropdown/dropdown';
import { HttpService } from './../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';

@Component({
    selector: 'icabs-invoice-credit-language-search',
    templateUrl: 'iCABSSInvoiceCreditReasonLanguageSearch.html'
})

export class InvoiceCreditReasonLanguageSearchComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('invoiceCreditReasonLanguageDropDown') invoiceCreditReasonLanguageDropDown: DropdownComponent;
    @Input() public inputParams: Object;
    @Input() public isDisabled: boolean;
    @Input() public isFirstItemSelected: boolean;
    @Input() public active: Object;
    @Input() public isRequired: boolean = false;
    @Input() public isTriggerValidate: boolean;
    @Output() getDefaultInfo = new EventEmitter();
    @Output() invoiceReasonCodeEmitter = new EventEmitter();
    public pageId: string = '';
    public displayFields: Array<string> = ['InvoiceCreditReasonLang.InvoiceCreditReasonCode', 'InvoiceCreditReasonLang.InvoiceCreditReasonDesc'];
    public requestdata: Array<any>;
    private method: string = 'bill-to-cash/search';
    private module: string = 'invoicing';
    private operation: string = 'System/iCABSSInvoiceCreditReasonLanguageSearch';
    private errorMessage;
    private httpSubscription: Subscription;

    constructor(
        private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private utils: Utils
    ) { }

    ngOnInit(): void {
        this.fetchInvoiceReasonCodeData();
    }

    ngOnChanges(data: any): void {
        if (data.inputParams) {
            this.fetchInvoiceReasonCodeData();
        }
    }

    ngOnDestroy(): void {
        if (this.httpSubscription) {
            this.httpSubscription.unsubscribe();
        }
    }

    private fetchInvoiceReasonCodeData(): void {
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.inputParams['businessCode'] || this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.inputParams['countryCode'] || this.utils.getCountryCode());
        this.inputParams['search'] = search;
        if (this.inputParams['parentMode'] === 'LookUp-ProRata' || this.inputParams['parentMode'] === 'LookUp-Credit' || this.inputParams['parentMode'] === 'LookUp-Invoice') {
            search.set('UserSelectableInd', 'true');
        } else {
            search.set('UserSelectableInd', '');
        }
        this.httpService.makeGetRequest(this.method, this.module, this.operation, search)
            .subscribe(
            (data) => {
                if (data.records) {
                    this.requestdata = data.records;
                    if (this.isFirstItemSelected) {
                        this.getDefaultInfo.emit({ totalRecords: this.requestdata ? this.requestdata.length : 0, firstRow: (this.requestdata && this.requestdata.length > 0) ? this.requestdata[0] : {} });
                    }
                    this.invoiceCreditReasonLanguageDropDown.updateComponent(data.records);
                }
            },
            error => {
                this.errorMessage = error as any;
            }
            );
    }

    public onInvoiceCreditReasonLanguageReceived(obj: any): void {
        this.invoiceReasonCodeEmitter.emit(obj.value);
    }
}

