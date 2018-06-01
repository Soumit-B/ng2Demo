import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs';

import { RiExchange } from './../../../shared/services/riExchange';
import { Utils } from '../../../shared/services/utility';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown';
import { HttpService } from '../../../shared/services/http-service';
import { ServiceConstants } from '../../../shared/constants/service.constants';

@Component({
    selector: 'icabs-sbproductservice-groupsearch',
    templateUrl: 'iCABSBProductServiceGroupSearch.html'
})

export class ProductServiceGroupSearchComponent implements OnInit, OnDestroy {
    @ViewChild('productServiceDropDown') public productServiceDropDown: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: boolean = false;
    @Input() public active: any;
    @Input() public isRequired: boolean = true;
    @Input() public isTriggerValidate: boolean;
    @Output() receivedProductServiceGroupSearch: EventEmitter<any> = new EventEmitter();
    @Output() getDefaultInfo = new EventEmitter();

    private errorMessage: any;
    private subFetchData: Subscription;

    public displayFields: Array<string> = ['ProductServiceGroupCode', 'ProductServiceGroupDesc'];

    constructor(
        private serviceConstants: ServiceConstants,
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

        let xhr: any = {
            module: 'product',
            method: 'service-delivery/search',
            operation: 'Business/iCABSBProductServiceGroupSearch',
            search: search
        };

        this.subFetchData = this.httpService.makeGetRequest(xhr.method, xhr.module, xhr.operation, xhr.search).subscribe(data => {
            if (!data.records) { return; }
            let requestdata: Array<any> = data.records;
            this.getDefaultInfo.emit({ totalRecords: requestdata ? requestdata.length : 0, firstRow: (requestdata && requestdata.length > 0) ? requestdata[0] : {} });
            this.productServiceDropDown.updateComponent(data.records);
        }, error => {
            this.errorMessage = error as any;
        });
    }

    /*
   *Return Dropdown Data on Selection
   */
    public onDataReceived(obj: any): void {
        let selectedRecords = obj.value;
        let returnString: string = '';
        let returnObj: any;
        switch (this.inputParams.params.parentMode) {
            case 'LookUp':
                returnObj = {
                    'ProductServiceGroupCode': selectedRecords.ProductServiceGroupCode,
                    'ProductServiceGroupDesc': selectedRecords.ProductServiceGroupDesc
                };
                break;
            case 'LookUp-String':
                returnString = this.inputParams.params.ProductServiceGroupString.trim();
                if (returnString) {
                    returnString = returnString + ',' + selectedRecords.ProductServiceGroupCode;
                }
                else {
                    returnString = selectedRecords.ProductServiceGroupCode;
                }
                returnObj = {
                    'ProductServiceGroupString': returnString
                };
                break;
            case 'GeneralSearch-Lookup3':
                returnString = this.inputParams.params.SearchValue3.trim();
                if (returnString) {
                    returnString = returnString + ',' + selectedRecords.ProductServiceGroupCode;
                }
                else {
                    returnString = selectedRecords.ProductServiceGroupCode;
                }
                returnObj = {
                    'SearchValue3': returnString
                };
                break;
            case 'LookUpMultiple':
                let strServiceTypes = this.inputParams.params.ProductServiceGroupCode.trim();
                if (strServiceTypes) {
                    strServiceTypes = strServiceTypes + ',' + selectedRecords.ProductServiceGroupCode;
                }
                else {
                    strServiceTypes = selectedRecords.ProductServiceGroupCode;
                }
                returnObj = {
                    'ProductServiceGroupCode': strServiceTypes
                };
                break;
            default:
                returnObj = {
                    'ProductServiceGroupCode': selectedRecords.ProductServiceGroupCode
                };
        }
        this.receivedProductServiceGroupSearch.emit(returnObj);
    }
}
