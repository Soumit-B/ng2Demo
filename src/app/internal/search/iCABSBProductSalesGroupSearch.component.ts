import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { PageIdentifier } from './../../base/PageIdentifier';
import { RiExchange } from './../../../shared/services/riExchange';
import { Utils } from './../../../shared/services/utility';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { TableComponent } from './../../../shared/components/table/table';
import { SelectedDataEvent } from './../../../shared/events/ellipsis-event-emitter';

@Component({
    templateUrl: 'iCABSBProductSalesGroupSearch.html'
})
export class ProductSalesGroupSearchComponent extends SelectedDataEvent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('riTable') riTable: TableComponent;

    private inputParams: any = {
        operation: 'Business/iCABSBProductSalesGroupSearch',
        module: 'contract-admin',
        method: 'contract-management/search'
    };
    public pageTitle: string;
    public pageId: string = '';
    public controls: Array<Object> = [];
    public tableParams: Object = {
        columns: [],
        itemsPerPage: '10',
        page: '1'
    };

    constructor(private utils: Utils, private serviceConstants: ServiceConstants) {
        super();
        this.pageId = PageIdentifier.ICABSBPRODUCTSALESGROUPSEARCH;
    }

    ngOnInit(): void {
        this.pageTitle = 'Product Sales Group Search';
    }

    ngAfterViewInit(): void {
        this.buildTableColumns();
    }

    ngOnDestroy(): void {
        this.utils = null;
        this.serviceConstants = null;
    }

    public buildTableColumns(): void {
        this.riTable.clearTable();
        this.riTable.AddTableField('ProductSaleGroupCode', MntConst.eTypeCode, 'Key', 'Code', 10);
        this.riTable.AddTableField('ProductSaleGroupDesc', MntConst.eTypeText, 'Required', 'Description', 40);
        this.buildTable();
    }

    public buildTable(): void {
        let search: URLSearchParams = new URLSearchParams();

        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '0');
        this.inputParams.search = search;
        this.riTable.loadTableData(this.inputParams);
    }

    public tableRowClick(event: any): void {
        let returnObj: Object;

        if (this.inputParams.parentMode === 'LookUp') {
            returnObj = {
                ProductSaleGroupCode: event.row['ProductSaleGroupCode'],
                ProductSaleGroupDesc: event.row['ProductSaleGroupDesc']
            };
        } else {
            returnObj = {
                ProductSaleGroupDesc: event.row['ProductSaleGroupDesc']
            };
        }
        this.emitSelectedData(returnObj);
    }

    public updateView(params: any): void {
        if (params.parentMode)
            this.inputParams.parentMode = params.parentMode;
        this.buildTableColumns();
    }
}
