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

    selector: 'icabs-gender-search',
    template: `<icabs-dropdown #GenderSearchDropDown [itemsToDisplay]="displayFields" [disabled]="isDisabled" [isRequired]="isRequired" [active]="active" (selectedValue)="onGenderSearch($event)">
  </icabs-dropdown>`
})

export class GenderSearchComponent extends BaseComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('GenderSearchDropDown') GenderSearchDropDown: DropdownComponent;
    public method: string = 'people/search';
    public module: string = 'employee';
    public operation: string = 'System/iCABSSGenderSearch';
    public search: URLSearchParams = new URLSearchParams();
    public displayFields: Array<string> = ['GenderCode', 'GenderDesc'];
    @Input() public inputParams: any;
    @Input() public isDisabled: any;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Output() receivedgendersearch = new EventEmitter();

    public requestdata: Array<any>;
    private errorMessage;
    public pageId: string = '';
    public controls = [];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSGENDERSEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Gender Search';
        this.fetchGenderData();
    }
    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
    ngOnChanges(data: any): void {
        if (data.inputParams) {
            this.fetchGenderData();
        }
    }

    public fetchGenderData(): void {
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
                this.GenderSearchDropDown.updateComponent(this.requestdata);
            },
            error => {
                this.errorMessage = error as any;
            }
            );
    }

    public onGenderSearch(obj: any): void {
        let Gcode = obj.value.GenderCode;
        let Gdesc = obj.value.GenderDesc;
        let returnObj: any;
        if (this.inputParams.parentMode === 'LookUp') {
            returnObj = {
                'GenderCode': Gcode,
                'GenderDesc': Gdesc
            };
        }
        else {
            returnObj = {
                'GenderCode': Gcode,
                'Object': obj.value
            };
        }
        this.receivedgendersearch.emit(returnObj);
    }
}
