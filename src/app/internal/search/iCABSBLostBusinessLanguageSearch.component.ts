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
    selector: 'icabs-lostbusinesslanguagesearch',
    template: `<icabs-dropdown #lostbusinesslanguagesearchDropDown
  [itemsToDisplay]="displayFields" [triggerValidate]="isTriggerValidate" [disabled]="isDisabled" [isRequired]="isRequired" [active]="active" (selectedValue)="onLostBusinessLanguageSearchReceived($event)">
  </icabs-dropdown>`
})

export class LostBusinessLanguageSearchComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('lostbusinesslanguagesearchDropDown') lostbusinesslanguagesearchDropDown: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: boolean;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Input() public isTriggerValidate: boolean;
    @Output() receivedlostbusinesslangsearch = new EventEmitter();

    public method: string = 'ccm/search';
    public module: string = 'retention';
    public operation: string = 'Business/iCABSBLostBusinessLanguageSearch';
    public displayFields: Array<string> = ['LostBusinessLang.LostBusinessCode', 'LostBusinessLang.LostBusinessDesc'];
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
        this.fetchLostBusinessLangSearchData();
    }

    ngOnChanges(data: any): void {
        if (data.inputParams) {
            this.fetchLostBusinessLangSearchData();
        }
    }

    ngOnDestroy(): void {
        if (this.httpSubscription) {
            this.httpSubscription.unsubscribe();
        }
    }

    public fetchLostBusinessLangSearchData(): void {
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
                this.lostbusinesslanguagesearchDropDown.updateComponent(data.records);
            },
            (error) => {
                let errorMessage = error as any;
            }
            );
    }

    public onLostBusinessLanguageSearchReceived(obj: any): void {
        this.receivedlostbusinesslangsearch.emit(obj.value);
    }
}
