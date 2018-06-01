/**
 * Component: DropdownStaticGroupedComponent
 * Functionality:
 * Generates dropdown with grouped values
 */
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { LocaleTranslationService } from './../../services/translation.service';
import { TranslateService } from 'ng2-translate';
import { Subscription } from 'rxjs/Subscription';
import { RiExchange } from '../../../shared/services/riExchange';

@Component({
    selector: 'icabs-dropdown-static-grouped',
    templateUrl: 'dropdown-static-grouped.html'
})

export class DropdownStaticGroupedComponent implements OnInit, OnDestroy {
    @Input() public inputData: Array<any>;
    @Input() public defaultSelected: boolean = true;
    @Input() public defaultOption: any;
    @Input() public disabled: Boolean = false;
    @Output() onSelect = new EventEmitter();

    public translateSubscription: Subscription;

    public selectedItem: string;

    constructor(
        private translate: TranslateService,
        private localeTranslateService: LocaleTranslationService,
        private riExchange: RiExchange
    ) {
    }

    public ngOnInit(): void {
        let option: Object = {};
        this.localeTranslateService.setUpTranslation();

        this.selectedItem = this.defaultOption || 'Options';
        this.onSelect.emit(this.selectedItem);

        if (this.inputData) {
            this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
                if (event !== 0) {
                    this.fetchTranslationContent(this.inputData);
                }
            });
        }
    }

    public ngOnDestroy(): void {
        if (this.translateSubscription) {
            this.translateSubscription.unsubscribe();
        }
        //this.riExchange.releaseReference(this);
        //delete this;
    }

     public fetchTranslationContent(data: any): void {
         for (let i = 0; i < data.length; i++) {
            if (data[i].text) {
                this.localeTranslateService.getTranslatedValue(data[i].text, null).subscribe((res: string) => {
                    if (res) {
                        data[i].text = res;
                    }
                });
            }
        }
     }

    public onChange(): void {
        this.onSelect.emit(this.selectedItem);
    }
}
