import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, OnChanges, OnDestroy, Input, EventEmitter, ViewChild, Output, Injector } from '@angular/core';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown';
import { BaseComponent } from '../../../app/base/BaseComponent';

@Component({
    selector: 'icabs-marital-search',
    template: `<icabs-dropdown #MaritalStatusSearchDropDown [itemsToDisplay]="displayFields" [disabled]="isDisabled" [isRequired]="isRequired" [active]="active" (selectedValue)="onMaritalSearch($event)">
  </icabs-dropdown>`
})

export class MaritalStatusSearchComponent extends BaseComponent implements OnInit, OnChanges, OnDestroy {

    @ViewChild('MaritalStatusSearchDropDown') MaritalStatusSearchDropDown: DropdownComponent;
    @Input() public inputParams: any;
    @Input() public isDisabled: any;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Output() receivedMaritalSearch = new EventEmitter();

    //queryParams
    public queryParams: any = {
        operation: 'System/iCABSSMaritalStatusSearch',
        module: 'employee',
        method: 'people/search'
    };

    //local variables
    public displayFields: Array<string> = ['MaritalStatusCode', 'MaritalStatusDesc'];
    public requestdata: Array<any>;
    public errorMessage: string;
    public pageId: string = '';
    public controls = [];
    public search = new URLSearchParams();

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSMARITALSTATUSSEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Marital Status Search';
        this.fetchMaritalStatusData();
    }

    ngOnChanges(data: any): void {
        if (data.queryParams) {
            this.fetchMaritalStatusData();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public fetchMaritalStatusData(): void {

        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.queryParams.search = this.search;

        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, this.queryParams.search)
            .subscribe(
            (data) => {
                this.requestdata = data.records;
                this.MaritalStatusSearchDropDown.updateComponent(this.requestdata);
            },
            error => {
                this.errorMessage = error as any;
            }
            );
    }

    public onMaritalSearch(obj: any): void {

        let maritalCode = obj.value.MaritalStatusCode;
        let maritalDesc = obj.value.MaritalStatusDesc;
        let returnObj: any;

        if (this.queryParams.parentMode === 'LookUp') {
            returnObj = {
                'MaritalStatusCode': maritalCode,
                'MaritalStatusDesc': maritalDesc
            };
        }
        else {
            returnObj = {
                'MaritalStatusCode': maritalCode,
                'Object': obj.value
            };
        }
        this.receivedMaritalSearch.emit(returnObj);
    }
}
