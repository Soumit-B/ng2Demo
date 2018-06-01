import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs/Rx';

import { PageIdentifier } from './../../base/PageIdentifier';
import { Utils } from '../../../shared/services/utility';
import { HttpService } from '../../../shared/services/http-service';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown';
import { ServiceConstants } from '../../../shared/constants/service.constants';

@Component({
    selector: 'icabs-customer-categorysearch',
    templateUrl: 'iCABSBCustomerCategorySearch.html'
})
export class CustomerCategorySearchComponent implements OnInit, OnDestroy, OnChanges {
    @ViewChild('custCategorySearchDropDown') public custCategorySearchDropDown: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public active: any;
    @Input() public isDisabled: boolean;
    @Input() public isFirstItemSelected: boolean;
    @Input() public isRequired: boolean;
    @Input() public isTriggerValidate: boolean;
    @Output() public getDefaultInfo = new EventEmitter();
    @Output() public receivedCategorySearch = new EventEmitter();
    private errorMessage: any;
    private requestData: Array<any>;
    private queryParams: any = {
        module: 'contract-admin',
        operation: 'Business/iCABSBCustomerCategorySearch',
        method: 'contract-management/search'
    };
    private httpSubscription: Subscription;
    public pageId: string = '';
    public displayFields: Array<string> = ['CategoryCode', 'CategoryDesc'];

    constructor(
        private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private utils: Utils) {
        this.pageId = PageIdentifier.ICABSBCUSTOMERCATEGORYSEARCH;
    }

    ngOnInit(): void {
        this.fetchCustCategorySearchData();
    }

    ngOnChanges(data: any): void {
        if (data.inputParams) {
            this.fetchCustCategorySearchData();
        }
    }

    ngOnDestroy(): void {
        if (this.httpSubscription) {
            this.httpSubscription.unsubscribe();
        }
    }

    //function to get dropdown records
    private fetchCustCategorySearchData(): void {
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.inputParams['businessCode'] || this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.inputParams['countryCode'] || this.utils.getCountryCode());
        this.httpSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search).subscribe
            (data => {
                if (data && data['records']) {
                    this.requestData = data.records;
                    if (this.isFirstItemSelected) {
                        this.getDefaultInfo.emit({ totalRecords: this.requestData ? this.requestData.length : 0, firstRow: (this.requestData && this.requestData.length > 0) ? this.requestData[0] : {} });
                    }
                    this.custCategorySearchDropDown.updateComponent(this.requestData);
                }
            }, error => {
                this.errorMessage = error as any;
            });
    }

    //Output emitter
    public onCategoryDataReceived(obj: any): void {
        this.receivedCategorySearch.emit(obj.value);
    }
}
