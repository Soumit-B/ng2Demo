import { Utils } from '../../../shared/services/utility';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown';
import { HttpService } from '../../../shared/services/http-service';
import { ServiceConstants } from '../../../shared/constants/service.constants';
import { Logger } from '@nsalaun/ng2-logger';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, OnChanges, OnDestroy, Input, EventEmitter, ViewChild, Output, Injector } from '@angular/core';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({

    selector: 'icabs-logotype-search',
    template: `<icabs-dropdown #logoTypeSearchDropDown
  [itemsToDisplay]="displayFields" [disabled]="isDisabled" [isRequired]="isRequired" [active]="active" (selectedValue)="onLogoTypeSearch($event)">
  </icabs-dropdown>`
})

export class LogoTypeSearchComponent extends BaseComponent implements OnInit, OnChanges , OnDestroy {

    @ViewChild('logoTypeSearchDropDown') logoTypeSearchDropDown: DropdownComponent;
    public method: string = 'bill-to-cash/search';
    public module: string = 'invoicing';
    public operation: string = 'Business/iCABSBLogoTypeSearch';
    public search: URLSearchParams = new URLSearchParams();
    public displayFields: Array<string> = ['LogoTypeCode', 'LogoTypeDesc'];
    @Input() public inputParams: any;
    @Input() public isDisabled: any;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Output() receivedlogotypesearch = new EventEmitter();

    public requestdata: Array<any>;
    private errorMessage;
    public pageId: string = '';
    public controls = [];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBLOGOTYPESEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Logo Type Search';
        this.fetchLogoTypeData();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    ngOnChanges(data: any): void {
        if (data.inputParams) {
            this.fetchLogoTypeData();
        }
    }

    public fetchLogoTypeData(): void {
        // this.localeTranslateService.setUpTranslation();
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
                this.requestdata = data.records;
                this.logoTypeSearchDropDown.updateComponent(this.requestdata);
            },
            error => {
                this.errorMessage = error as any;
            }
            );
    }

    public onLogoTypeSearch(obj: any): void {
        // this.receivedlogotypesearch.emit(obj.value);
        let code = obj.value.LogoTypeCode;
        let desc = obj.value.LogoTypeDesc;
        let returnObj: any;

        switch (this.inputParams.parentMode) {
            case 'LookUp-LogoType':
                returnObj = {
                    'LogoTypeCode': code,
                    'LogoTypeDesc': desc
                };
                break;

            default:
                returnObj = {
                    'LogoTypeCode': code,
                    'LogoTypeDesc': desc
                };
        }
        this.receivedlogotypesearch.emit(returnObj);
    }
}
