import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';
import { URLSearchParams } from '@angular/http';
import { Component, forwardRef, Inject, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TableComponent } from './../../../../shared/components/table/table';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { BaseComponent } from '../../../base/BaseComponent';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
    templateUrl: 'iCABSSAccountBusinessTypeSearch.html'
})

export class AccountBusinessTypeSearchComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('resultTable') resultTable: TableComponent;
    @ViewChild('inputField') inputField;
    @Input() inputParams: any;
    public busOptions = ['Description', 'Code'];
    public inputFieldSize = 30;

    //BaseComponents
    public controls = [
        { name: 'AccountBusinessTypeSearchType', readonly: false, disabled: false, required: false, value: this.busOptions[0] },
        { name: 'AccountBusinessTypeSearchValue', readonly: false, disabled: false, required: false, value: '' }
    ];
    public pageId: string;
    public uiForm: any;

    constructor(
        injector: Injector,
        private ellipsis: EllipsisComponent,
        private fb: FormBuilder
    ) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSACCOUNTBUSINESSTYPESEARCH;
        this.uiForm = this.fb.group({
          AccountBusinessTypeSearchType: [{ value: this.busOptions[0], disabled: false }],
          AccountBusinessTypeSearchValue: [{ value: '', disabled: false }]
        });
    }

    public isSearchDisabled: boolean = true;
    public itemsPerPage: number = 10;
    public page: number = 1;
    public columns: Array<any> = [];
    public rows: Array<any> = [];
    public rowmetadata: Array<any> = [];

    ngOnInit(): void {
        // statement
    }

    ngOnDestroy(): void {
        // statement
    }

    public tableDataLoaded(obj: any): void {
        this.isSearchDisabled = false;
    }

    public selectedData(obj: any): void {
        let returnObj = {
            'Type': obj.row.AccountBusinessTypeCode,
            'Description': obj.row.AccountBusinessTypeDesc
        };
        this.ellipsis.sendDataToParent(returnObj);
    }

    public updateView(params: any): void {
        this.inputParams = params;
    }

    public loadData(obj: any): void {
        this.isSearchDisabled = true;
        let search = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.businessCode());
        search.set(this.serviceConstants.CountryCode, this.countryCode());

        let AccountBusinessTypeSearchType = this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountBusinessTypeSearchType');
        let AccountBusinessTypeSearchValue = this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountBusinessTypeSearchValue');
        let parentMode = this.inputParams.parentMode;

        switch (parentMode) {
            case 'LookUp-Account':
                search.set('ValidForNewBusiness', 'True');
                break;
        }

        switch (AccountBusinessTypeSearchType) {
            case 'Code':
                search.set('AccountBusinessTypeCode', AccountBusinessTypeSearchValue);
                search.set('search.op.AccountBusinessTypeCode', 'GE');
                break;
            case 'Description':
                search.set('AccountBusinessTypeDesc', AccountBusinessTypeSearchValue);
                search.set('search.op.AccountBusinessTypeDesc', 'CONTAINS');
                break;
        }
        search.set('search.sortby', 'AccountBusinessTypeCode');

        let xhr = {
            module: 'account',
            method: 'contract-management/search',
            operation: 'System/iCABSSAccountBusinessTypeSearch',
            search: search
        };
        this.columns = [];
        this.columns.push({ title: 'Type', name: 'AccountBusinessTypeCode' });
        this.columns.push({ title: 'Description', name: 'AccountBusinessTypeDesc' });

        this.resultTable.loadTableData(xhr);
    }

    public UpdateHTML(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountBusinessTypeSearchValue', '');
        this.inputField.nativeElement.focus();

        let AccountBusinessTypeSearchType = this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountBusinessTypeSearchType');
        switch (AccountBusinessTypeSearchType) {
            case 'Code': this.inputFieldSize = 10; break;
            case 'Description': this.inputFieldSize = 30; break;
        }
    }
}
