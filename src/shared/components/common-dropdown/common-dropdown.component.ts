import { URLSearchParams } from '@angular/http';
import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { Utils } from '../../../shared/services/utility';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown';
import { HttpService } from '../../../shared/services/http-service';
import { ServiceConstants } from '../../../shared/constants/service.constants';

@Component({
    selector: 'icabs-common-dropdown',
    templateUrl: 'common-dropdown.html'
})

export class CommonDropdownComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('commonDropDown') commonDropDown: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: boolean;
    @Input() public isFirstItemSelected: boolean;
    @Input() public isActive: any;
    @Input() public isRequired: boolean;
    @Input() public displayFields: Array<string>;
    @Input() public isTriggerValidate: boolean;
    @Output() getDefaultInfo = new EventEmitter();
    @Output() onDataReceived: EventEmitter<any>;
    @Output() onError: EventEmitter<any>;

    private httpSubscription: Subscription;

    public requestdata: Array<any>;

    constructor(
        private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private utils: Utils) {
        this.onDataReceived = new EventEmitter();
        this.onError = new EventEmitter();
    }

    ngOnInit(): void {
        this.fetchData();
    }

    ngOnChanges(data: any): void {
        if (data.inputParams) {
            this.fetchData();
        }
    }

    ngOnDestroy(): void {
        if (this.httpSubscription) {
            this.httpSubscription.unsubscribe();
        }
        this.httpSubscription = null;
        this.onDataReceived = null;
        this.onError = null;
        this.requestdata = null;
    }

    private fetchData(): void {
        let search: URLSearchParams;
        search = this.inputParams.search || new URLSearchParams();
        search.set(this.serviceConstants.Action, this.inputParams.action || '0');
        search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode || this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode || this.utils.getCountryCode());
        this.httpSubscription = this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, search)
            .subscribe((data) => {
                if (data) {
                    this.requestdata = data.records;
                    if (this.isFirstItemSelected) {
                        this.getDefaultInfo.emit({ totalRecords: this.requestdata ? this.requestdata.length : 0, firstRow: (this.requestdata && this.requestdata.length > 0) ? this.requestdata[0] : {} });
                    }
                }
                this.commonDropDown.updateComponent(this.requestdata);
            }, (error) => {
                this.onError.emit(error);
            });
    }

    public onDropDownDataReceived(obj: any): void {
        this.onDataReceived.emit(obj.value);
    }
}
