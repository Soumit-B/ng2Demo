import { Utils } from '../../../shared/services/utility';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown';
import { HttpService } from '../../../shared/services/http-service';
import { ServiceConstants } from '../../../shared/constants/service.constants';
import { Logger } from '@nsalaun/ng2-logger';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output, OnDestroy } from '@angular/core';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { RiExchange } from '../../../shared/services/riExchange';
@Component({
    selector: 'icabs-tiersearch',
    template: `<icabs-dropdown #tiersearchDropDown
  [itemsToDisplay]="displayFields" [disabled]="isDisabled" [isRequired]="isRequired" [active]="active" (selectedValue)="onTierSearchReceived($event)">
  </icabs-dropdown>`
})
export class TierSearchComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('tiersearchDropDown') tiersearchDropDown: DropdownComponent;
    public method: string = 'contract-management/search';
    public module: string = 'contract-admin';
    public operation: string = 'Business/iCABSBTierSearch';
    public search: URLSearchParams = new URLSearchParams();
    public displayFields: Array<string> = ['TierCode', 'TierSystemDescription'];
    @Input() public inputParams: any;
    @Input() public isDisabled: any;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Output() receivedtiersearch = new EventEmitter();

    public requestdata: Array<any>;
    private errorMessage;

    constructor(
        private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private utils: Utils,
        private logger: Logger,
        private localeTranslateService: LocaleTranslationService,
        private riExchange: RiExchange) {
    }

    ngOnInit(): void {
        this.fetchtierData();
    }

    ngOnChanges(data: any): void {
        if (data.inputParams) {
            this.fetchtierData();
        }
    }

    public fetchtierData(): void {
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
                if (data.records && this.tiersearchDropDown) {
                    this.requestdata = data.records;
                    this.tiersearchDropDown.updateComponent(this.requestdata);
                }
            },
            error => {
                this.errorMessage = error as any;
            }
            );
    }

    public onTierSearchReceived(obj: any): void {
        this.receivedtiersearch.emit(obj.value);
    }

    public ngOnDestroy(): void {
        this.riExchange.releaseReference(this);
        delete this;
    }
}
