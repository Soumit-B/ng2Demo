import { Component, OnInit, Input, EventEmitter, ViewChild, Output, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs';

import { RiExchange } from './../../../shared/services/riExchange';
import { Utils } from '../../../shared/services/utility';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown';
import { HttpService } from '../../../shared/services/http-service';
import { ServiceConstants } from '../../../shared/constants/service.constants';

@Component({
    selector: 'icabs-sbinvoice-chargetype-languagesearch',
    templateUrl: 'iCABSBInvoiceChargeTypeLanguageSearch.html'
})

export class InvoiceChargeTypeLanguageSearchComponent implements OnInit, OnDestroy {
    @ViewChild('invoiceDropdown') invoiceDropdown: DropdownComponent;
    @Input() public inputParams: Object;
    @Input() public isDisabled: boolean = false;
    @Input() public active: Object;
    @Input() public isRequired: boolean = true;
    @Output() receivedLanguageSearch: EventEmitter<any> = new EventEmitter();
    private errorMessage: string;
    private subFetchData: Subscription;

    public displayFields: Array<string> = ['SystemInvoiceChargeTypeLang.InvoiceChargeTypeCode', 'SystemInvoiceChargeTypeLang.InvoiceChargeLocalDesc'];

    constructor(private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private utils: Utils,
        private riExchange: RiExchange) {

    }

    ngOnInit(): void {
        this.fetchData();
    }

    ngOnDestroy(): void {
        if (this.subFetchData) {
            this.subFetchData.unsubscribe();
        }
    }

    /*
   *Get Dropdown Data On Load
   */
    public fetchData(): void {

        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        let varLanguageCode: string = this.inputParams['params'].LanguageCode;
        if (!varLanguageCode) {
            varLanguageCode = this.riExchange.LanguageCode();
        }
        search.set('LanguageCode', varLanguageCode);
        search.set('ContractLevelInd', this.inputParams['params'].ContractLevelInd);
        search.set('methodtype', 'maintenance');

        let xhr: any = {
            module: 'charges',
            method: 'bill-to-cash/search',
            operation: 'Business/iCABSBInvoiceChargeTypeLanguageSearch',
            search: search
        };

        this.subFetchData = this.httpService.makeGetRequest(xhr.method, xhr.module, xhr.operation, xhr.search).subscribe(data => {
            if (!data.records) { return; }
            this.invoiceDropdown.updateComponent(data.records);
        }, error => {
            this.errorMessage = error as any;
        });
    }

    /*
    *Return Dropdown Data on Selection
    */
    public onLanguageDataReceived(obj: any): void {
        let InvoiceChargeTypeCode = obj.value['SystemInvoiceChargeTypeLang.InvoiceChargeTypeCode'];
        let InvoiceChargeLocalDesc = obj.value['SystemInvoiceChargeTypeLang.InvoiceChargeLocalDesc'];
        let returnObj: Object = {};
        returnObj['InvoiceChargeTypeCode'] = InvoiceChargeTypeCode;

        switch (this.inputParams['params'].parentMode) {
            case 'LookUp':
            case 'LookUp-Contract':
                returnObj['InvoiceChargeLocalDesc'] = InvoiceChargeLocalDesc;
                break;
        }
        this.receivedLanguageSearch.emit(returnObj);

    }
}
