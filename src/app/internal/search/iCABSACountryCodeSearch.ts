import { URLSearchParams } from '@angular/http';
import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { DropdownComponent } from './../../../shared/components/dropdown/dropdown';
import { HttpService } from './../../../shared/services/http-service';
import { Utils } from './../../../shared/services/utility';
import { ServiceConstants } from './../../../shared/constants/service.constants';

@Component({
    selector: 'icabs-countrycode',
    template: `<icabs-dropdown #countryDropDown
  [itemsToDisplay]="displayFields" [triggerValidate]="triggerValidate" [disabled]="isDisabled" [isRequired]="isRequired" [active]="active" (selectedValue)="onCountryCodeReceived($event)">
  </icabs-dropdown>`
})
export class CountryCodeComponent implements OnInit, OnChanges {
    @ViewChild('countryDropDown') countryDropDown: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: any;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Input() public triggerValidate: boolean;
    @Output() receivedCountryCode = new EventEmitter();
    public method: string = 'contract-management/search';
    public module: string = 'contract-admin';
    public operation: string = 'Application/iCABSACountryCodeSearch';
    public search: URLSearchParams = new URLSearchParams();
    public displayFields: Array<string> = ['riCountryCode', 'riCountryDescription'];
    public requestdata: Array<any>;
    private errorMessage;

    constructor(
        private serviceConstants: ServiceConstants,
        private _httpService: HttpService,
        private utils: Utils) {
    }

    ngOnInit(): void {
        this.fetchCountryData();
    }

    ngOnChanges(data: any): void {
        if (data.inputParams) {
            this.fetchCountryData();
        }
    }

    public fetchCountryData(): void {
        if (!this.inputParams.countryCode || !this.inputParams.businessCode) {
            return;
        }
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;

        if (this.active === null || this.active === undefined) {
            this.active = {
                id: '',
                text: ''
            };
        }
        if (this.isDisabled === null || this.isDisabled === undefined) {
            this.isDisabled = false;
        }
        if (this.isRequired === null || this.isRequired === undefined) {
            this.isRequired = false;
        }
        this.search.set(this.serviceConstants.Action, '0');
        if (this.inputParams.businessCode !== undefined &&
            this.inputParams.businessCode !== null) {
            this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        }
        if (this.inputParams.countryCode !== undefined &&
            this.inputParams.countryCode !== null) {
            this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        }
        this.inputParams.search = this.search;
        this._httpService.makeGetRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search)
            .subscribe(
            (data) => {
                this.requestdata = data.records;
                this.utils.setCountryListFromSearchAPI(this.requestdata);
                this.countryDropDown.updateComponent(this.requestdata);
            },
            error => {
                this.errorMessage = error as any;
            }
            );
    }

    public onCountryCodeReceived(obj: any): void {
        let countryCode = obj.value.riCountryCode;
        let countryDesc = obj.value.riCountryDescription;
        let returnObj: any;
        if (this.inputParams.parentMode === 'LookUp' ||
            this.inputParams.parentMode === 'LookUp-riCountry') {
            returnObj = {
                'riCountryCode': countryCode,
                'riCountryDescription': countryDesc
            };
        } else if (this.inputParams.parentMode === 'LookUp-Country') {
            returnObj = {
                'CountryCode': countryCode,
                'CountryDesc': countryDesc
            };
        } else {
            returnObj = {
                'riCountryCode': countryCode,
                'Object': obj.value
            };
        }
        this.receivedCountryCode.emit(returnObj);
    }
}



