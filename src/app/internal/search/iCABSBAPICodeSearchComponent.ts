import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { TableComponent } from './../../../shared/components/table/table';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';

@Component({
    templateUrl: 'iCABSBAPICodeSearchComponent.html'
})
export class ICABSBAPICodeSearchComponent extends BaseComponent implements OnInit {
    @ViewChild('apiCodeSearchTable') apiCodeSearchTable: TableComponent;
    public pageId: string = '';
    public selectedrowdata: any;
    public method: string = 'contract-management/search';
    public module: string = 'api';
    public operation: string = 'Business/iCABSBAPICodeSearch';
    public search: URLSearchParams = new URLSearchParams();
    public itemsPerPage: string = '10';
    public showAddNew: boolean = false;
    public page: string = '1';
    public totalItem: string = '11';
    public inputParams: any = {};
    public columns: Array<any> = new Array();
    public rowmetadata: Array<any> = new Array();
    private routeParams: any;
    public controls: any = [];
    constructor(injector: Injector, private ellipsis: EllipsisComponent) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBAPICODESEARCH;
    }

    ngOnInit(): void {
        this.localeTranslateService.setUpTranslation();
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
        this.getTranslatedValue('Code', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'APICode' });
            } else {
                this.columns.push({ title: 'Code', name: 'APICode', sort: 'ASC' });
            }
        });
        this.getTranslatedValue('Description', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'APICodeDesc' });
            } else {
                this.columns.push({ title: 'Description', name: 'APICodeDesc' });
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
    public updateView(params: any = {}): void {
        if (params.showAddNew) {
            this.showAddNew = params.showAddNew;
        } else {
            this.showAddNew = false;
        }
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.PageCurrent, this.page);
        this.inputParams.search = this.search;
        this.apiCodeSearchTable.loadTableData(this.inputParams);

    }
    public refresh(): void {
        this.updateView();
    }
}
