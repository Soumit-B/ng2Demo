import { Component, OnInit, AfterViewInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { TableComponent } from './../../../shared/components/table/table';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';

@Component({
    templateUrl: 'iCABSBdlRejectionSearch.html'
})

export class DlRejectionSearchComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('rejectionSearch') rejectionSearch: TableComponent;
    public queryParams: any = {
        operation: 'Business/iCABSBdlRejectionSearch',
        module: 'advantage',
        method: 'prospect-to-contract/search'
    };

    public pageId: string = '';
    public search = new URLSearchParams();
    public controls = [
    ];
    public columns: Array<any> = [
        { title: 'Rejection Code', name: 'dlRejectionCode' },
        { title: 'Description', name: 'dlRejectionDesc' }
    ];
    public pageTitle: string = 'Data Load Approval Level Search';
    constructor(injector: Injector, public ellipsis: EllipsisComponent) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBDLREJECTIONSEARCH;
    }

    public buildTable(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.queryParams.search = this.search;
        this.rejectionSearch.loadTableData(this.queryParams);
    }

    public selectedData(event: any): void {
        let strCustomerTypes: any;
        let returnObj: any;
        returnObj = {
            'dlRejectionCode': event.row.dlRejectionCode,
            'dlRejectionDesc': event.row.dlRejectionDesc
        };
        this.ellipsis.sendDataToParent(returnObj);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngAfterViewInit(): void {
        this.buildTable();
    }
}
