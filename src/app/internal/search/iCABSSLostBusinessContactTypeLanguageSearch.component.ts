import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { URLSearchParams } from '@angular/http';

import { RiExchange } from './../../../shared/services/riExchange';
import { Utils } from '../../../shared/services/utility';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown';
import { HttpService } from '../../../shared/services/http-service';
import { ServiceConstants } from '../../../shared/constants/service.constants';

@Component({
    selector: 'icabs-contactype-languagesearch',
    templateUrl: 'iCABSSLostBusinessContactTypeLanguageSearch.html'
})

export class LostBusinessContactTypeLanguageSearchComponent implements OnInit, OnDestroy, OnChanges {
    @ViewChild('apiLanguageSearchDropDown') apiLanguageSearchDropDown: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: boolean = false;
    @Input() public active: any;
    @Input() public isRequired: boolean = true;
    @Output() receivedLanguageSearch = new EventEmitter();

    private errorMessage;
    private method: string = 'ccm/search';
    private module: string = 'retention';
    private operation: string = 'System/iCABSSLostBusinessContactTypeLanguageSearch';
    private fetchLanguageSearch: Subscription;
    private requestdata: Array<any>;
    private search: URLSearchParams = new URLSearchParams();

    public displayFields: Array<string> = ['LBContactTypeLang.ContactTypeCode', 'LBContactTypeLang.LBContactTypeDesc'];

    constructor(
        private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private utils: Utils,
        private riExchange: RiExchange) {
    }

    ngOnInit(): void {
        this.fetchLanguageSearchData();
    }

    ngOnChanges(data: any): void {
        if (data.inputParams) {
            this.fetchLanguageSearchData();
        }
    }

    ngOnDestroy(): void {
        if (this.fetchLanguageSearch) {
            this.fetchLanguageSearch.unsubscribe();
        }
    }

    /*
    *Get Dropdown Data On Load
    */
    public fetchLanguageSearchData(): void {
        this.search.set(this.serviceConstants.LanguageCode, this.riExchange.LanguageCode());
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode ? this.inputParams.businessCode : this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode ? this.inputParams.countryCode : this.utils.getCountryCode());
        this.fetchLanguageSearch = this.httpService.makeGetRequest(this.method, this.module,
            this.operation, this.search).subscribe(data => {
                if (!data.records) {
                    return;
                }
                this.requestdata = data.records;
                this.apiLanguageSearchDropDown.updateComponent(this.requestdata);
            }, error => {
                this.errorMessage = error as any;
            });
    }
    /*
    *Return Dropdown Data on Selection
    */
    public onLanguageDataReceived(obj: any): void {
        this.receivedLanguageSearch.emit(obj.value);
    }
}
