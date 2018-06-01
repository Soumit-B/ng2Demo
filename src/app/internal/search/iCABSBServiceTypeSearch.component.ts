import { Component, OnInit, OnDestroy, EventEmitter, ViewChild, Input, Output } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs';

import { HttpService } from './../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Utils } from '../../../shared/services/utility';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from './../../base/BaseComponent';
import { DropdownComponent } from './../../../shared/components/dropdown/dropdown';

@Component({
    selector: 'icabs-servicetype-search',
    templateUrl: 'iCABSBServiceTypeSearch.html'
})

export class ServiceTypeSearchComponent implements OnInit, OnDestroy {

    @ViewChild('serviceTypeSearch') serviceTypeSearch: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: boolean;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Input() public isTriggerValidate: boolean;
    @Output() receivedServiceTypeData = new EventEmitter();

    private errorMessage: any;
    private subFetchData: Subscription;
    public displayFields: Array<string> = ['ServiceTypeCode', 'ServiceTypeDesc'];

    public queryParams: any = {
        module: 'service',
        method: 'service-delivery/search',
        operation: 'Business/iCABSBServiceTypeSearch'
    };

    constructor(private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private utils: Utils) {
    }

    ngOnInit(): void {
        this.fetchServiceType();
    }

    ngOnDestroy(): void {
        if (this.subFetchData) {
            this.subFetchData.unsubscribe();
        }
    }

    /*
    Get Dropdown Data On Load
   */
    public fetchServiceType(): void {
        let search: URLSearchParams = new URLSearchParams();
        let formData: any = {};
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (this.inputParams.params.parentMode === 'LookUp-SC') {
            formData['ActiveStatus'] = 'A';
        }
        else {
            formData['search.op.ActiveStatus'] = 'NE';
            formData['ActiveStatus'] = 'L';
        }
        this.subFetchData = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData).subscribe(data => {
            if (!data.records) { return; }
            this.serviceTypeSearch.updateComponent(data.records);
        });
    }

    /*
     Method invoked on selecting data from dropdown
    */
    public onServiceTypeReceived(obj: any): void {
        let strServiceTypes: string;
        let returnObj: any;
        if (this.inputParams.params) {
            if (this.inputParams.params.parentMode) {
                switch (this.inputParams.params.parentMode) {
                    case 'ContractJobReport':
                        strServiceTypes = this.inputParams.params.ServiceTypes;
                        if (!strServiceTypes) {
                            strServiceTypes = obj.value.ServiceTypeCode;
                        }
                        else {
                            strServiceTypes = strServiceTypes + ',' + obj.value.ServiceTypeCode;
                        }
                        returnObj = {
                            'ServiceTypes': strServiceTypes
                        };
                        break;
                    case 'PCIncludeServiceTypes':
                    case 'PPUIncludeServiceTypes':
                    case 'CWIIncludeServiceTypes':
                        if (this.inputParams.params.parentMode === 'PCIncludeServiceTypes') {
                            strServiceTypes = this.inputParams.params.PCIncludeServiceTypes;
                        }
                        else if (this.inputParams.params.parentMode === 'PPUIncludeServiceTypes') {
                            strServiceTypes = this.inputParams.params.PPUIncludeServiceTypes;
                        }
                        else if (this.inputParams.params.parentMode === 'CWIIncludeServiceTypes') {
                            strServiceTypes = this.inputParams.params.CWIIncludeServiceTypes;
                        }
                        if (!strServiceTypes) {
                            strServiceTypes = obj.value.ServiceTypeCode;
                        }
                        else {
                            strServiceTypes = strServiceTypes + ',' + obj.value.ServiceTypeCode;
                        }
                        if (this.inputParams.params.parentMode === 'PCIncludeServiceTypes') {
                            returnObj = {
                                'PCIncludeServiceTypes': strServiceTypes
                            };
                        }
                        else if (this.inputParams.params.parentMode === 'PPUIncludeServiceTypes') {
                            returnObj = {
                                'PPUIncludeServiceTypes': strServiceTypes
                            };
                        }
                        else if (this.inputParams.params.parentMode === 'CWIIncludeServiceTypes') {
                            returnObj = {
                                'CWIIncludeServiceTypes': strServiceTypes
                            };
                        }
                        break;
                    case 'PCExcludeServiceTypes':
                    case 'PPUExcludeServiceTypes':
                    case 'CWIExcludeServiceTypes':
                        if (this.inputParams.params.parentMode === 'PCExcludeServiceTypes') {
                            strServiceTypes = this.inputParams.params.PCExcludeServiceTypes;
                        }
                        else if (this.inputParams.params.parentMode === 'PPUExcludeServiceTypes') {
                            strServiceTypes = this.inputParams.params.PPUExcludeServiceTypes;
                        }
                        else if (this.inputParams.params.parentMode === 'CWIExcludeServiceTypes') {
                            strServiceTypes = this.inputParams.params.CWIExcludeServiceTypes;
                        }
                        if (!strServiceTypes) {
                            strServiceTypes = obj.value.ServiceTypeCode;
                        }
                        else {
                            strServiceTypes = strServiceTypes + ',' + obj.value.ServiceTypeCode;
                        }
                        if (this.inputParams.params.parentMode === 'PCExcludeServiceTypes') {
                            returnObj = {
                                'PCExcludeServiceTypes': strServiceTypes
                            };
                        }
                        else if (this.inputParams.params.parentMode === 'PPUExcludeServiceTypes') {
                            returnObj = {
                                'PPUExcludeServiceTypes': strServiceTypes
                            };
                        }
                        else if (this.inputParams.params.parentMode === 'CWIExcludeServiceTypes') {
                            returnObj = {
                                'CWIExcludeServiceTypes': strServiceTypes
                            };
                        }
                        break;
                    case 'SVBCTServiceTypeCode':
                        returnObj = {
                            'SVBCTServiceTypeCode': obj.value.ServiceTypeCode,
                            'SVBCTServiceTypeDesc': obj.value.ServiceTypeDesc
                        };
                        break;
                    case 'LookUp-SC':
                        returnObj = {
                            'ServiceTypeCode': obj.value.ServiceTypeCode,
                            'ServiceTypeDesc': obj.value.ServiceTypeDesc
                        };
                        break;
                    default:
                        if (this.inputParams.params.parentMode === 'LookUp') {
                            returnObj = {
                                'ServiceTypeCode': obj.value.ServiceTypeCode,
                                'ServiceTypeDesc': obj.value.ServiceTypeDesc
                            };
                        }
                        else if (this.inputParams.params.parentMode === 'LookUpA') {
                            returnObj = {
                                'NewServiceType': obj.value.ServiceTypeCode,
                                'NewServiceTypeDesc': obj.value.ServiceTypeDesc
                            };
                        }
                        else if (this.inputParams.params.parentMode === 'LookUpB') {
                            returnObj = {
                                'OldServiceType': obj.value.ServiceTypeCode,
                                'OldServiceTypeDesc': obj.value.ServiceTypeDesc
                            };
                        }
                        else if (this.inputParams.params.parentMode === 'LookUpC') {
                            returnObj = {
                                'inServiceTypeCode': obj.value.ServiceTypeCode,
                                'ServiceTypeDesc': obj.value.ServiceTypeDesc
                            };
                        }
                        else if (this.inputParams.params.parentMode === 'LookUpMultiple') {
                            strServiceTypes = this.inputParams.params.ServiceTypeCode;
                            if (!strServiceTypes) {
                                strServiceTypes = obj.value.ServiceTypeCode;
                            }
                            else {
                                strServiceTypes = strServiceTypes + ',' + obj.value.ServiceTypeCode;
                            }
                            returnObj = {
                                'ServiceTypeCode': strServiceTypes
                            };
                        }
                        else {
                            returnObj = {
                                'ServiceTypeCode': obj.value.ServiceTypeCode
                            };
                        }
                }
            }
        }
        this.receivedServiceTypeData.emit(returnObj);
    }
}

