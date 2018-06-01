import { URLSearchParams } from '@angular/http';
import { Component, OnInit, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { DropdownComponent } from './../../../shared/components/dropdown/dropdown';
import { HttpService } from './../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Utils } from '../../../shared/services/utility';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'icabs-visit-type-search',
    template: `<icabs-dropdown #visitTypeDropDown
  [itemsToDisplay]="displayFields" [uiFormGroup]="uiFormGroup" [controlName]="controlName" [disabled]="isDisabled" [isRequired]="isRequired" [triggerValidate]="triggerValidate" [active]="active" (selectedValue)="onVisitTypeReceived($event)">
  </icabs-dropdown>`
})

export class VisitTypeSearchComponent implements OnInit {
    @ViewChild('visitTypeDropDown') visitTypeDropDown: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: any;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Input() public triggerValidate: boolean;
    @Input() public uiFormGroup: any;
    @Input() public controlName: string;
    @Output() receivedVisitType = new EventEmitter();
    @Output() emitVisitTypeData = new EventEmitter();
    public method: string = 'service-delivery/search';
    public module: string = 'service';
    public operation: string = 'Business/iCABSBVisitTypeSearch';
    public search: URLSearchParams = new URLSearchParams();
    public displayFields: Array<string> = ['VisitType.VisitTypeCode', 'VisitType.VisitTypeDesc'];
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
        if (this.inputParams.businessCode !== undefined &&
            this.inputParams.businessCode !== null) {
            this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        } else {
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        }
        if (this.inputParams.countryCode !== undefined &&
            this.inputParams.countryCode !== null) {
            this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        } else {
            this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        }
        if (this.inputParams.parentMode === 'LookUp-ByVisitAction' || this.inputParams.parentMode === 'LookUp') {
            this.search.set('ActiveInd', 'True');
        } else {
            this.search.set('ActiveInd', '');
        }
        if (this.inputParams.byVisitAction !== undefined &&
            this.inputParams.byVisitAction !== null) {
            this.search.set('ByVisitAction', this.inputParams.byVisitAction);
        }
        if (this.inputParams.systemVisitActionCode !== undefined &&
            this.inputParams.systemVisitActionCode !== null) {
            this.search.set('SystemVisitActionCode', this.inputParams.systemVisitActionCode);
        }
        this.inputParams.search = this.search;
        this._httpService.makeGetRequest(this.method, this.module,
            this.operation, this.inputParams.search)
            .subscribe(
            (data) => {
                this.requestdata = data.records;
                this.visitTypeDropDown.updateComponent(this.requestdata);
                //console.log(this.requestdata);

            },
            error => {
                this.errorMessage = error as any;
            }
            );
    }
    public onVisitTypeReceived(obj: any): void {
        this.receivedVisitType.emit({
            VisitTypeCode: obj.value['VisitType.VisitTypeCode'],
            VisitTypeDesc: obj.value['VisitType.VisitTypeDesc']
        });
    }

    public triggerDataFetch(params: any): void {
        this.inputParams = params;
        if (this.inputParams.byVisitAction !== undefined &&
            this.inputParams.byVisitAction !== null) {
            this.search.set('ByVisitAction', this.inputParams.byVisitAction);
        }
        if (this.inputParams.systemVisitActionCode !== undefined &&
            this.inputParams.systemVisitActionCode !== null) {
            this.search.set('SystemVisitActionCode', this.inputParams.systemVisitActionCode);
        }
        this._httpService.makeGetRequest(this.method, this.module,
            this.operation, this.inputParams.search)
            .subscribe(
            (data) => {
                this.requestdata = data.records;
                this.visitTypeDropDown.updateComponent(this.requestdata);
                //console.log(this.requestdata);
                this.emitVisitTypeData.emit(this.requestdata);
            },
            error => {
                this.errorMessage = error as any;
            }
            );
    }
}
