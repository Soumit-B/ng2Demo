import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Utils } from '../../../shared/services/utility';
import { Subscription } from 'rxjs';
import { DropdownComponent } from './../../../shared/components/dropdown/dropdown';
import { HttpService } from './../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';

@Component({
    selector: 'icabs-contact-type-search',
    templateUrl: 'iCABSSContactTypeSearch.html'
})

export class ContactTypeSearchComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('contactTypeDropDown') contactTypeDropDown: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: boolean;
    @Input() public isFirstItemSelected: boolean;
    @Input() public active: any;
    @Input() public isRequired: boolean = false;
    @Input() public isTriggerValidate: boolean;
    @Output() getDefaultInfo = new EventEmitter();
    @Output() receivedContactType = new EventEmitter();
    private method: string = 'ccm/search';
    private module: string = 'tickets';
    private operation: string = 'System/iCABSSContactTypeSearch';
    private errorMessage;
    private httpSubscription: Subscription;
    public displayFields: Array<string> = ['ContactTypeCode', 'ContactTypeSystemDesc'];
    public requestdata: Array<any>;

    constructor(
        private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private utils: Utils
    ) { }

    ngOnInit(): void {
        this.fetchContactTypeData();
    }

    ngOnChanges(data: any): void {
        if (data.inputParams) {
            this.fetchContactTypeData();
        }
    }

    ngOnDestroy(): void {
        if (this.httpSubscription) {
            this.httpSubscription.unsubscribe();
        }
    }

    private fetchContactTypeData(): void {
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode || this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode || this.utils.getCountryCode());
        this.inputParams.search = search;
        this.httpService.makeGetRequest(this.method, this.module, this.operation, search)
            .subscribe(
            (data) => {
                this.requestdata = data.records;
                if (this.isFirstItemSelected) {
                    this.getDefaultInfo.emit({ totalRecords: this.requestdata ? this.requestdata.length : 0, firstRow: (this.requestdata && this.requestdata.length > 0) ? this.requestdata[0] : {} });
                }
                this.contactTypeDropDown.updateComponent(data.records);
            },
            error => {
                this.errorMessage = error as any;
            }
            );
    }

    public onContactTypeSearchReceived(obj: any): void {
        this.receivedContactType.emit(obj.value);
    }

}
