import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { TableComponent } from './../../../shared/components/table/table';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';

@Component({
    templateUrl: 'iCABSBProductExpenseSearch.html'
})

export class ProductExpenseSearchComponent extends BaseComponent implements OnInit {
    @ViewChild('productExpenseSearchTable') productExpenseSearchTable: TableComponent;
    @Input() public routeParams: any;
    public pageId: string = '';
    public selectedrowdata: any;
    public method: string = 'bill-to-cash/search';
    public module: string = 'charges';
    public operation: string = 'Business/iCABSBProductExpenseSearch';
    public search: URLSearchParams = new URLSearchParams();
    public itemsPerPage: string = '10';
    public page: string = '1';
    public totalItem: string = '11';
    public inputParams: any = {};
    public columns: Array<any> = new Array();
    public rowmetadata: Array<any> = new Array();
    public productDisplay: boolean = true;
    public controls = [
        { name: 'ProductCode', readonly: true, disabled: true, required: false },
        { name: 'ProductDesc', readonly: true, disabled: true, required: false }
    ];
    constructor(injector: Injector, private ellipsis: EllipsisComponent) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBPRODUCTEXPENSESEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
        //productCode/productDesc need to be sent in childConfigParams from ellipsis parameters
        if (this.ellipsis.childConfigParams['productCode']) {
            this.productDisplay = false;
            this.uiForm.controls['ProductCode'].setValue(this.ellipsis.childConfigParams['productCode']);
        }

        if (this.ellipsis.childConfigParams['productCode']) {
            this.uiForm.controls['ProductDesc'].setValue(this.ellipsis.childConfigParams['productDesc']);
        } this.localeTranslateService.setUpTranslation();
        this.buildTableColumns();;
        this.updateView();
    }
    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }

    }
    public buildTableColumns(): void {
        if (this.uiForm.controls['ProductCode'].value) {
            this.getTranslatedValue('Product Code', null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'ProductCode', sort: 'ASC' });
                } else {
                    this.columns.push({ title: 'Product Code', name: 'ProductCode', sort: 'ASC' });
                }
            });
        }
        this.getTranslatedValue('Contract Type', null).subscribe((res: string) => {
            if (this.uiForm.controls['ProductCode'].value !== '') {
                if (res) {
                    this.columns.push({ title: res, name: 'ContractTypeCode' });
                } else {
                    this.columns.push({ title: 'Contract Type', name: 'ContractTypeCode', sort: 'ASC' });
                }
            } else {
                if (res) {
                    this.columns.push({ title: res, name: 'ContractTypeCode' });
                } else {
                    this.columns.push({ title: 'Contract Type', name: 'ContractTypeCode' });
                }
            }
        });
        this.getTranslatedValue('Description', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'ContractTypeDesc' });
            } else {
                this.columns.push({ title: 'Description', name: 'ContractTypeDesc' });
            }
        });
        this.getTranslatedValue('Expense Code', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'ExpenseCode' });
            } else {
                this.columns.push({ title: 'Expense Code', name: 'ExpenseCode' });
            }
        });
        this.inputParams.columns = [];
        this.inputParams.columns = this.columns;

    }

    public onAddNew(): void {
        let addData = { mode: 'add' };
        this.ellipsis.sendDataToParent(addData);
    }

    public selectedData(event: any): void {
        let returnObj: any;
        returnObj = event.row;
        this.ellipsis.sendDataToParent(returnObj);
    }
    public getCurrentPage(currentPage: string): void {
        this.page = currentPage;
    }
    public updateView(): void {
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (this.uiForm.controls['ProductCode'].value !== '') {
            this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
        }
        this.search.set(this.serviceConstants.PageCurrent, this.page);
        this.inputParams.search = this.search;
        this.productExpenseSearchTable.loadTableData(this.inputParams);

    }
    public refresh(): void {
        this.updateView();
    }
}
