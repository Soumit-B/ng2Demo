
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { TableComponent } from './../../../shared/components/table/table';
import { URLSearchParams } from '@angular/http';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Injector, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from './../../base/BaseComponent';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown';
@Component({
    selector: 'icabs-languagesearch',
    template: ` 
        <form novalidate [formGroup]="this['uiForm']">
            <icabs-dropdown #proRataChargeStatusLanguageDropDown
  [itemsToDisplay]='displayFields' [disabled]='isDisabled' [isRequired]='isRequired' [active]='active' (selectedValue)='onLangsearchReceived($event)'>
  </icabs-dropdown>
   </form>`
})
export class ProRataChargeStatusLanguageSearchComponent extends BaseComponent implements OnInit {
    @ViewChild('proRataChargeStatusLanguageSearchTable') proRataChargeStatusLanguageSearchTable: TableComponent;
    @ViewChild('proRataChargeStatusLanguageDropDown') proRataChargeStatusLanguageDropDown: DropdownComponent;
    public displayFields: Array<string> = ['ProRataChargeStatusLang.ProRataChargeStatusCode', 'ProRataChargeStatusLang.ProRataChargeStatusDesc'];
    @Input() public inputParams: any;
    @Input() public isDisabled: any;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Output() LangSearchReceived = new EventEmitter();
    public pageId: string = '';
    public controls = [

    ];
    public columns: Array<any> = [
        { title: 'Type Code', name: 'ProRataChargeStatusCode' },
        { title: 'Description', name: 'ProRataChargeStatusDesc' }
    ];
    public queryParams: any = {
        operation: 'System/iCABSSProRataChargeStatusLanguageSearch',
        module: 'charges',
        method: 'bill-to-cash/search'
    };
    public search = new URLSearchParams();
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSPRORATACHARGESTATUSLANGUAGESEARCH;
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.getLanguageCode();
        this.doLookup();
        this.buildTable();
    }
    private getLanguageCode(): any {
        //   this.uiForm.controls['LanguageCode'].setValue(this.riExchange.LanguageCode());
    }
    private doLookup(): any {
        let lookupIPSub = [
            {
                'table': 'Language',
                'query': {
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': [
                    'LanguageDescription'
                ]
            }/*,
            {
                'table': 'ProRataChargeStatus',
                'query': {
                    'LanguageCode': this.riExchange.LanguageCode(), 'UserSelectInd': 'true'
                },
                'fields': [
                    'ProRataChargeStatusCode'
                ]
            }*/
        ];
        this.lookUpRecord(lookupIPSub, 5).subscribe(
            (data) => {
                if (data.results && data.results.length > 0) {
                    let resultLanguageDescription = data.results[0];
                    // if (resultLanguageDescription[0])
                    //     this.uiForm.controls['LanguageDescription'].setValue(resultLanguageDescription[0].LanguageDescription);
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }
    public lookUpRecord(data: any, maxresults: number): any {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        if (maxresults) {
            this.search.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.search, data);
    }

    private buildTable(): void {
        this.localeTranslateService.setUpTranslation();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        //set parameters
        this.search.set('LanguageCode', this.riExchange.LanguageCode());
        if (this.inputParams && this.inputParams['parentMode'] === 'ProRataChargeMaintenance') {
            this.search.set('UserSelectInd', 'true');
            this.search.set('ProRataChargeMaintenance', 'true');
        }
        this.queryParams.search = this.search;
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, this.queryParams.search)
            .subscribe(
            (data) => {
                this.proRataChargeStatusLanguageDropDown.updateComponent(data.records);
            },
            error => {
                //console.log('error11', error);
            }
            );
        // this.proRataChargeStatusLanguageSearchTable.loadTableData(this.queryParams)
    }

    // public tableDataLoaded(data: any): void {
    //     let tableRecords: Array<any> = data.tableData['records'];
    //     if (tableRecords.length === 0) {
    //         this.tableheading = 'No record found';
    //     }
    // }
    public refresh(): void {
        this.proRataChargeStatusLanguageSearchTable.loadTableData(this.queryParams);
    }

    public onLangsearchReceived(obj: any): void {
        this.LangSearchReceived.emit(obj.value);
    }
}

