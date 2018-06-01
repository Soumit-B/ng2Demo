
import { Component, OnInit, Injector, ViewChild, OnChanges, OnDestroy, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs';

import { HttpService } from '../../../shared/services/http-service';
import { RiExchange } from './../../../shared/services/riExchange';
import { Utils } from '../../../shared/services/utility';
import { ServiceConstants } from '../../../shared/constants/service.constants';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown';


@Component({
    selector: 'icabs-business-origin-language-search',
    template: `<icabs-dropdown #businessOriginLanguageSearchDropdown
  [itemsToDisplay]="displayFields" [disabled]="isDisabled" [isRequired]="isRequired" [triggerValidate]="triggerValidate" [active]="active" (selectedValue)="onBusinessOriginLanguageSearchReceived($event)">
  </icabs-dropdown>`
})
export class BusinessOriginLangSearchComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('businessOriginLanguageSearchDropdown') businessOriginLanguageSearchDropdown: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: boolean;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Input() public triggerValidate: boolean;
    @Output() receivedLostBusinessLangSearch = new EventEmitter();

    public method: string = 'prospect-to-contract/search';
    public module: string = 'segmentation';
    public operation: string = 'Business/iCABSBBusinessOriginLanguageSearch';
    public displayFields: Array<string> = ['BusinessOriginLang.BusinessOriginCode', 'BusinessOriginLang.BusinessOriginDesc'];
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
        this.fetchBusinessOriginLangSearchData();
    }

    ngOnChanges(data: any): void {
        if (data.inputParams) {
            this.fetchBusinessOriginLangSearchData();
        }
    }

    ngOnDestroy(): void {
        if (this.httpSubscription) {
            this.httpSubscription.unsubscribe();
        }
    }

    public fetchBusinessOriginLangSearchData(): void {
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode ? this.inputParams.businessCode : this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode ? this.inputParams.countryCode : this.utils.getCountryCode());
        search.set('ContractTypeCode', this.riExchange.getCurrentContractType());
        search.set('ShowAllTypes', 'True');
        this.inputParams.search = search;
        this.httpSubscription = this.httpService.makeGetRequest(this.method, this.module,
            this.operation, this.inputParams.search)
            .subscribe(
            (data) => {
                this.businessOriginLanguageSearchDropdown.updateComponent(data.records);
            },
            (error) => {
                let errorMessage = error as any;
            }
            );
    }

    public onBusinessOriginLanguageSearchReceived(obj: any): void {
        this.receivedLostBusinessLangSearch.emit(obj.value);
    }

}
