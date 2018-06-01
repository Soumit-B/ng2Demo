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
    selector: 'icabs-rmm-category-language-search',
    templateUrl: 'iCABSARMMCategoryLanguageSearch.html'
})

export class RMMCategoryLanguageSearchComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('rmmCategoryLanguageSearchDropDown') public rmmCategoryLanguageSearchDropDown: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: boolean;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Input() public isTriggerValidate: boolean;
    @Output() receivedRMMCategoryLanguageSearchDropDown = new EventEmitter();
    @Output() onError = new EventEmitter();

    private method: string = 'service-planning/search';
    private module: string = 'service';
    private operation: string = 'Application/iCABSARMMCategoryLanguageSearch';
    private httpSubscription: Subscription;

    public displayFields: Array<string> = ['RMMCategoryLang.RMMCategoryCode', 'RMMCategoryLang.RMMCategoryDesc'];

    constructor(
        private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private utils: Utils,
        private localeTranslateService: LocaleTranslationService,
        private riExchange: RiExchange) {
    }

    ngOnInit(): void {
        this.localeTranslateService.setUpTranslation();
        this.fetchRMMCategoryLanguageSearchDropDown();
    }

    ngOnChanges(data: any): void {
        if (data.inputParams) {
            this.fetchRMMCategoryLanguageSearchDropDown();
        }
    }

    ngOnDestroy(): void {
        if (this.httpSubscription) this.httpSubscription.unsubscribe();
        if (this.receivedRMMCategoryLanguageSearchDropDown) this.receivedRMMCategoryLanguageSearchDropDown.unsubscribe();
        if (this.onError) this.onError.unsubscribe();
    }

    public fetchRMMCategoryLanguageSearchDropDown(): void {
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
                this.rmmCategoryLanguageSearchDropDown.updateComponent(data.records);
            },
            (error) => {
                this.onError.emit(true);
            }
            );
    }

    public rmmCategoryLanguageSearchOnReceived(obj: any): void {
        this.receivedRMMCategoryLanguageSearchDropDown.emit(obj.value);
    }
}
