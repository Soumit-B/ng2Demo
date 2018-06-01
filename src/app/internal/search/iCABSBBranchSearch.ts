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
    selector: 'icabs-branchsearch',
    template: `<icabs-dropdown #branchsearchDropDown
  [itemsToDisplay]="displayFields" [disabled]="isDisabled" [isRequired]="isRequired" [triggerValidate]="isTriggerValidate" [active]="active" (selectedValue)="onBranchsearchReceived($event)">
  </icabs-dropdown>`
})
export class BranchSearchComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('branchsearchDropDown') branchsearchDropDown: DropdownComponent;
    public method: string = 'it-functions/search';
    public module: string = 'structure';
    public operation: string = 'Business/iCABSBBranchSearch';
    public search: URLSearchParams = new URLSearchParams();
    public displayFields: Array<string> = ['BranchNumber', 'BranchName'];
    public httpSubscription: Subscription;
    public timeout: any;
    @Input() public inputParams: any;
    @Input() public isDisabled: any;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Input() public isTriggerValidate: boolean;
    @Output() receivedbranchsearch = new EventEmitter();

    public requestdata: Array<any>;
    private errorMessage;

    constructor(
        private serviceConstants: ServiceConstants,
        private _httpService: HttpService,
        private utils: Utils,
        private _logger: Logger,
        private localeTranslateService: LocaleTranslationService) {
    }

    ngOnInit(): void {
        this.localeTranslateService.setUpTranslation();
        this.fetchBranchData();
    }

    ngOnChanges(data: any): void {
        if (data.inputParams) {
            this.fetchBranchData();
        }
    }

    ngOnDestroy(): void {
        if (this.httpSubscription) {
            this.httpSubscription.unsubscribe();
        }
    }

    public fetchBranchData(): void {
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode ? this.inputParams.businessCode : this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode ? this.inputParams.countryCode : this.utils.getCountryCode());
        this.inputParams.search = this.search;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.httpSubscription = this._httpService.makeGetRequest(this.inputParams.method, this.inputParams.module,
                this.inputParams.operation, this.inputParams.search)
                .subscribe(
                (data) => {
                    this.requestdata = data.records;
                    this.branchsearchDropDown.updateComponent(this.requestdata);
                },
                error => {
                    this.errorMessage = error as any;
                }
                );
        }, 250);
    }

    public onBranchsearchReceived(obj: any): void {
        this.receivedbranchsearch.emit(obj.value);
    }
}
