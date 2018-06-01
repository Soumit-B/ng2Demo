import { Subscription } from 'rxjs';
import { Utils } from '../../../shared/services/utility';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown';
import { HttpService } from '../../../shared/services/http-service';
import { ServiceConstants } from '../../../shared/constants/service.constants';
import { Logger } from '@nsalaun/ng2-logger';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output, OnDestroy } from '@angular/core';
import { LocaleTranslationService } from '../../../shared/services/translation.service';

@Component({
    selector: 'icabs-apicodesearch',
    template: `<icabs-dropdown #apicodesearchDropDown
  [itemsToDisplay]="displayFields" [disabled]="isDisabled" [isRequired]="isRequired" [triggerValidate]="isTriggerValidate" [active]="active" (selectedValue)="onAPICodeSearchReceived($event)">
  </icabs-dropdown>`
})
export class APICodeSearchComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('apicodesearchDropDown') apicodesearchDropDown: DropdownComponent;
    public method: string = 'contract-management/search';
    public module: string = 'api';
    public operation: string = 'Business/iCABSBAPICodeSearch';
    public search: URLSearchParams = new URLSearchParams();
    public displayFields: Array<string> = ['APICode', 'APICodeDesc'];
    public httpSubscription: Subscription;
    @Input() public inputParams: any;
    @Input() public isDisabled: any;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Input() public isTriggerValidate: boolean;
    @Output() receivedAPICodesearch = new EventEmitter();

    public requestdata: Array<any>;
    private errorMessage;

    constructor(
        private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private utils: Utils,
        private logger: Logger,
        private localeTranslateService: LocaleTranslationService) {
    }

    ngOnInit(): void {
        this.fetchAPICodeData();
    }

    ngOnChanges(data: any): void {
        if (data.inputParams) {
            this.fetchAPICodeData();
        }
    }

    ngOnDestroy(): void {
        if (this.httpSubscription) {
            this.httpSubscription.unsubscribe();
        }
    }

    public fetchAPICodeData(): void {
        this.localeTranslateService.setUpTranslation();
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode ? this.inputParams.businessCode : this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode ? this.inputParams.countryCode : this.utils.getCountryCode());
        this.inputParams.search = this.search;
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search)
            .subscribe(
            (data) => {
                let emptyOption = { 'APICode': 'All', 'APICodeDesc': 'All' };
                this.requestdata = data.records;
                this.requestdata.unshift(emptyOption);
                this.apicodesearchDropDown.updateComponent(this.requestdata);
            },
            error => {
                this.errorMessage = error as any;
            }
            );
    }

    public onAPICodeSearchReceived(obj: any): void {
        this.receivedAPICodesearch.emit(obj.value);
    }
}
