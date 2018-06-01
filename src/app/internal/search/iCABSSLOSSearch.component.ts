import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs';

import { Utils } from '../../../shared/services/utility';
import { HttpService } from './../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { DropdownComponent } from './../../../shared/components/dropdown/dropdown';


@Component({
    selector: 'icabs-los-search',
    template: `<icabs-dropdown #losSearchDropDown [itemsToDisplay]="displayFields" [disabled]="isDisabled" [isRequired]="isRequired" [active]="active"
    (selectedValue)="onLOSSearchReceived($event)" [isFirstItemSelected]="isFirstItemSelected" [triggerValidate]="isTriggerValidate">
</icabs-dropdown>`
})

export class LOSSearchComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('losSearchDropDown') losSearchDropDown: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: boolean;
    @Input() public isFirstItemSelected: boolean;
    @Input() public active: any;
    @Input() public isRequired: boolean = false;
    @Input() public isTriggerValidate: boolean;
    @Output() getDefaultInfo = new EventEmitter();
    @Output() receivedLOSSearch = new EventEmitter();
    private method: string = 'it-functions/search';
    private module: string = 'structure';
    private operation: string = 'System/iCABSSLOSSearch';
    private errorMessage;
    private httpSubscription: Subscription;
    public displayFields: Array<string> = ['LOSCode', 'LOSName'];
    public requestdata: Array<any>;

    constructor(
        private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private utils: Utils
    ) { }

    ngOnInit(): void {
        this.fetchLOSSearchData();
    }

    ngOnChanges(data: any): void {
        if (data.inputParams) {
            this.fetchLOSSearchData();
        }
    }

    ngOnDestroy(): void {
        if (this.httpSubscription) {
            this.httpSubscription.unsubscribe();
        }
    }

    private fetchLOSSearchData(): void {
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode || this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode || this.utils.getCountryCode());
        this.inputParams.search = search;
        this.httpService.makeGetRequest(this.method, this.module, this.operation, search)
            .subscribe(
            (data) => {
                if (!data.hasError) {
                    this.requestdata = data.records;
                    if (this.isFirstItemSelected) {
                        this.getDefaultInfo.emit({ totalRecords: this.requestdata ? this.requestdata.length : 0, firstRow: (this.requestdata && this.requestdata.length > 0) ? this.requestdata[0] : {} });
                    }
                    this.losSearchDropDown.updateComponent(data.records);
                }
            },
            (error) => {
                this.errorMessage = error as any;
            });
    }

    public onLOSSearchReceived(obj: any): void {
        this.receivedLOSSearch.emit(obj.value);
    }
}
