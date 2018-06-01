import { URLSearchParams } from '@angular/http';
import { Component, OnInit, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { DropdownComponent } from './../../../shared/components/dropdown/dropdown';
import { HttpService } from './../../../shared/services/http-service';
import { Utils } from './../../../shared/services/utility';
import { ServiceConstants } from './../../../shared/constants/service.constants';

@Component({
    selector: 'icabs-business-search',
    template: `<icabs-dropdown #businessDropDown
  [itemsToDisplay]="displayFields" [disabled]="isDisabled" [isRequired]="isRequired" [active]="active" (selectedValue)="onBusinessCodeReceived($event)">
  </icabs-dropdown>`
})

export class BusinessSearchComponent implements OnInit {
    @ViewChild('businessDropDown') businessDropDown: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: any;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Output() receivedBusinessCode = new EventEmitter();
    public method: string = 'it-functions/search';
    public module: string = 'structure';
    public operation: string = 'System/iCABSSBusinessSearch';
    public search: URLSearchParams = new URLSearchParams();
    public displayFields: Array<string> = ['BusinessCode', 'BusinessDesc'];
    public requestdata: Array<any>;
    private errorMessage;

    constructor(
        private serviceConstants: ServiceConstants,
        private _httpService: HttpService,
        private utils: Utils) {
    }
    ngOnInit(): void {
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
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (this.inputParams && this.inputParams.singleBusiness === true) {
            this.search.set('Mode', 'BU');
        } else {
            this.search.set('Mode', 'All');
        }
        this.inputParams.search = this.search;
        this._httpService.makeGetRequest(this.method, this.module,
            this.operation, this.inputParams.search)
            .subscribe(
            (data) => {
                this.requestdata = data.records;
                this.businessDropDown.updateComponent(this.requestdata);
            },
            error => {
                this.errorMessage = error as any;
            }
            );
    }
    public onBusinessCodeReceived(obj: any): void {
        this.receivedBusinessCode.emit({
            businessCode: obj.value.BusinessCode,
            businessDesc: obj.value.BusinessDesc
        });
    }
}
