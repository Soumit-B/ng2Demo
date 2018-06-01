import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output, NgZone } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown';
import { HttpService } from '../../../shared/services/http-service';
import { ServiceConstants } from '../../../shared/constants/service.constants';

@Component({
    selector: 'icabs-contractduration',
    template: `<icabs-dropdown #contractDurationDropDown
  [itemsToDisplay]="displayFields" [disabled]="isDisabled" [isRequired]="isRequired" [active]="active" (selectedValue)="onContractDurationReceived($event)">
  </icabs-dropdown>`
})
export class ContractDurationComponent implements OnInit, OnChanges {
    @ViewChild('contractDurationDropDown') contractDurationDropDown: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public durationData: any;
    @Input() public isDisabled: any;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Input() public validForNewContract: boolean;
    @Output() receivedcontractDuration = new EventEmitter();
    public method: string = 'contract-management/search';
    public module: string = 'duration';
    public operation: string = 'Business/iCABSBContractDurationSearch';
    public search: URLSearchParams = new URLSearchParams();
    public displayFields: Array<string> = ['ContractDurationCode', 'ContractDurationDesc'];
    public requestdata: Array<any>;
    private errorMessage;

    constructor(
        private serviceConstants: ServiceConstants,
        private _httpService: HttpService,
        private zone: NgZone) {
    }

    ngOnInit(): void {
        if (!this.durationData) {
            this.fetchDurationData();
        } else {
            this.contractDurationDropDown.updateComponent(this.durationData);
        }
    }

    ngOnChanges(data: any): void {
        /*if (data.inputParams && !this.durationData) {
            this.fetchDurationData();
        } else {
            this.contractDurationDropDown.updateComponent(this.durationData);
        }*/
        this.fetchDurationData();
    }

    public fetchDurationData(): void {
        if (!this.inputParams.countryCode || !this.inputParams.businessCode) {
            return;
        }
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '0');
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
        if (this.inputParams.businessCode !== undefined &&
            this.inputParams.businessCode !== null) {
            this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        }
        if (this.inputParams.countryCode !== undefined &&
            this.inputParams.countryCode !== null) {
            this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        }

        this.search.set('ValidForNewContract', this.validForNewContract ? 'Yes' : null);
        this.inputParams.search = this.search;
        this._httpService.makeGetRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search)
            .subscribe(
            (data) => {
                this.requestdata = data.records;
                let activeLocal = {};
                if (data.records) {
                    for (let i in data.records) {
                        if (data.records[i].ContractDurationCode) {
                            if (data.records[i].ContractDurationCode.toString() === this.active.id) {
                                this.active.text = data.records[i].ContractDurationDesc.split(' ').join(' - ');
                                activeLocal = {
                                    id: this.active.id,
                                    text: this.active.id + ' - ' + data.records[i].ContractDurationDesc
                                };
                                this.zone.run(() => {
                                    this.contractDurationDropDown.active = activeLocal;
                                });
                            }
                        }
                    }
                }
                this.contractDurationDropDown.updateComponent(this.requestdata);
            },
            error => {
                this.errorMessage = error as any;
            }
            );
    }

    public onContractDurationReceived(obj: any): void {
        let code = obj.value.ContractDurationCode;
        let desc = obj.value.ContractDurationDesc;
        let returnObj: any;

        switch (this.inputParams.parentMode) {
            case 'LookUp':
            case 'LookUp-Contract':
            case 'SOPProspectStatusChange':
                returnObj = {
                    'ContractDurationCode': code,
                    'ContractDurationDesc': desc
                };
                break;

            case 'LookUp-NewContract':
                returnObj = {
                    'NewContractDurationCode': code,
                    'ContractDurationDesc': desc
                };
                break;

            case 'LookUp-ContractMinDuration':
                returnObj = {
                    'MinimumDurationCode': code,
                    'MinimumDurationDesc': desc
                };
                break;

            case 'LookUp-SubsequentDuration':
                returnObj = {
                    'SubsequentDurationCode': code,
                    'SubsequentDurationDesc': desc
                };
                break;

            default:
                returnObj = {
                    'ContractDurationCode': code,
                    'Object': obj.value
                };
        }
        this.receivedcontractDuration.emit(returnObj);
    }
}
