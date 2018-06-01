import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs';

import { DropdownComponent } from '../../../shared/components/dropdown/dropdown';
import { HttpService } from '../../../shared/services/http-service';
import { ServiceConstants } from '../../../shared/constants/service.constants';
import { Utils } from '../../../shared/services/utility';
import { RiExchange } from '../../../shared/services/riExchange';

@Component({
    selector: 'icabs-lostbusinessdetails',
    templateUrl: 'iCABSBLostBusinessDetailLanguageSearch.html'
})

export class LostBusinessDetailLanguageSearchComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('lostbusinessdetailsDropdown') lostbusinessdetailsDropdown: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: any;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Input() public isTriggerValidate: boolean;
    @Input() public displayFields: Array<string> = ['LostBusinessDetailLang.LostBusinessDetailCode'];
    @Output() receivedbranchsearch = new EventEmitter();
    private errorMessage;
    private method: string = 'ccm/search';
    private module: string = 'retention';
    private operation: string = 'Business/iCABSBLostBusinessDetailLanguageSearch';
    public search: URLSearchParams = new URLSearchParams();
    public httpSubscription: Subscription;

    constructor(private httpService: HttpService, private serviceConstants: ServiceConstants,
        private utils: Utils, private riExchange: RiExchange) { }

    ngOnInit(): void {
        this.riExchange.LanguageCode() === 'ZNG' ? this.displayFields.push('LostBusinessDetailLang.LostBusinessDetailDesc') : this.displayFields.push('LostBusinessDetail.LostBusinessDetailDesc');
        this.fetchDropDownData();
    }

    ngOnChanges(data: any): void {
        if (data.inputParams && this.inputParams.search) {
            this.fetchDropDownData();
        }
    }

    ngOnDestroy(): void {
        if (this.httpSubscription) {
            this.httpSubscription.unsubscribe();
        }
    }

    public fetchDropDownData(): void {
        if (this.inputParams.LostBusinessCode) {
            let search: URLSearchParams = new URLSearchParams();
            search.set(this.serviceConstants.Action, '0');
            search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode ? this.inputParams.businessCode : this.utils.getBusinessCode());
            search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode ? this.inputParams.countryCode : this.utils.getCountryCode());
            search.set('InvalidForNew', 'FALSE');
            search.set('LostBusinessCode', this.inputParams.LostBusinessCode);
            this.inputParams.search = search;
            this.httpSubscription = this.httpService.makeGetRequest(this.method, this.module,
                this.operation, this.inputParams.search).subscribe(data => {
                    this.lostbusinessdetailsDropdown.updateComponent(data.records);
                }, error => {
                    this.errorMessage = error as any;
                });
        }
    }

    public onDropDownReceived(obj: any): void {
        this.receivedbranchsearch.emit(obj.value);
    }
}
