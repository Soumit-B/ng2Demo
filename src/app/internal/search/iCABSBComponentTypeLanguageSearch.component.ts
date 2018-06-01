import { URLSearchParams } from '@angular/http';
import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { Utils } from '../../../shared/services/utility';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown';
import { HttpService } from '../../../shared/services/http-service';
import { RiExchange } from './../../../shared/services/riExchange';
import { ServiceConstants } from '../../../shared/constants/service.constants';

@Component({
    selector: 'icabs-component-type-lang-dd',
    template: `<icabs-dropdown #icabsDD [itemsToDisplay]="itemsToDisplay" [disabled]="isDisabled" [isRequired]="isRequired" [triggerValidate]="triggerValidate" [active]="active"
    (selectedValue)="onSelectedValue($event)"></icabs-dropdown>`
})
export class ComponentTypeLanguageSearchComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('icabsDD') icabsDD: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: boolean;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Input() public triggerValidate: boolean;
    @Input() public itemsToDisplay: Array<string>;
    @Output() selectedValue: EventEmitter<any>;
    @Output() onError: EventEmitter<any>;

    private httpSubscription: Subscription;
    private queryParams: any = {
        method: 'service-delivery/search',
        module: 'product',
        operation: 'Business/iCABSBComponentTypeLanguageSearch'
    };

    public requestdata: Array<any>;

    constructor(
        private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private utils: Utils,
        private riExchange: RiExchange) {
        this.selectedValue = new EventEmitter();
        this.onError = new EventEmitter();
    }

    ngOnInit(): void {
        if (this.inputParams) {
            this.fetchData();
        }
    }

    ngOnChanges(data: any): void {
        if (data.inputParams) {
            this.fetchData();
        }
    }

    ngOnDestroy(): void {
        if (this.httpSubscription) {
            this.httpSubscription.unsubscribe();
        }
        this.httpSubscription = null;
        this.selectedValue = null;
        this.onError = null;
        this.requestdata = null;
    }

    public fetchData(params?: any): void {
        let search: URLSearchParams = new URLSearchParams();
        this.inputParams = params || this.inputParams;
        if (this.inputParams) {
            search.set(this.serviceConstants.Action, '0');
            search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            search.set('LanguageCode', this.riExchange.LanguageCode());
            search.set('ProductCode', this.inputParams.ProductCode || '');

            this.httpSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
                this.queryParams.operation, search)
                .subscribe((data) => {
                    if (data) {
                        this.requestdata = data.records;
                    }
                    this.icabsDD.updateComponent(this.requestdata);
                }, (error) => {
                    this.onError.emit(error);
                });
        }
    }

    public onSelectedValue(obj: any): void {
        this.selectedValue.emit(obj.value);
    }
}
