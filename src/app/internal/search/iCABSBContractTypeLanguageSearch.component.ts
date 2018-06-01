import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs';

import { HttpService } from '../../../shared/services/http-service';
import { RiExchange } from './../../../shared/services/riExchange';
import { Utils } from '../../../shared/services/utility';
import { ServiceConstants } from '../../../shared/constants/service.constants';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown';

@Component({
    selector: 'icabs-contract-type-language-search',
    template: `<icabs-dropdown #contractTypeLanguageSearchDropDown
  [itemsToDisplay]="displayFields" [disabled]="isDisabled" [isRequired]="isRequired" [triggerValidate]="triggerValidate" [active]="active" (selectedValue)="contractTypeLanguageSearchOnReceived($event)">
  </icabs-dropdown>`
})

export class ContractTypeLanguageSearchComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('contractTypeLanguageSearchDropDown') public contractTypeLanguageSearchDropDown: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: boolean;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Input() public triggerValidate: boolean;
    @Output() receivedContractTypeLanguageSearch = new EventEmitter();

    public method: string = 'contract-management/search';
    public module: string = 'contract';
    public operation: string = 'Business/iCABSBContractTypeLanguageSearch';
    public displayFields: Array<string> = ['ContractTypeLang.ContractTypeCode', 'ContractTypeLang.ContractTypeDesc'];
    public httpSubscription: Subscription;

    constructor(
        private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private utils: Utils,
        private localeTranslateService: LocaleTranslationService,
        private riExchange: RiExchange) {
    }

    ngOnInit(): void {
        this.localeTranslateService.setUpTranslation();
        this.fetchContractTypeLanguageSearchData();
    }

    ngOnChanges(data: any): void {
        if (data.inputParams) {
            this.fetchContractTypeLanguageSearchData();
        }
    }

    ngOnDestroy(): void {
        if (this.httpSubscription) {
            this.httpSubscription.unsubscribe();
        }
    }

    public fetchContractTypeLanguageSearchData(): void {
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.LanguageCode, this.inputParams.languageCode ? this.inputParams.languageCode : this.riExchange.LanguageCode());
        this.inputParams.search = search;
        this.httpSubscription = this.httpService.makeGetRequest(this.method, this.module,
            this.operation, this.inputParams.search)
            .subscribe(
            (data) => {
                this.contractTypeLanguageSearchDropDown.updateComponent(data.records);
            },
            (error) => {
                let errorMessage = error as any;
            }
            );
    }

    public contractTypeLanguageSearchOnReceived(obj: any): void {
        this.receivedContractTypeLanguageSearch.emit(obj.value);
    }
}
