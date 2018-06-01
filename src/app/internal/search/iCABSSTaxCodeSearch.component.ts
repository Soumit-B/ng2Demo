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
    templateUrl: 'iCABSSTaxCodeSearch.html'
})
export class TaxCodeSearchComponent extends SelectedDataEvent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('riTable') riTable: TableComponent;

    public pageTitle: string;
    public pageId: string = '';
    public controls: any = [];
    public tableParams: any = {
        columns: [],
        itemsPerPage: '10',
        page: '1'
    };
    public queryParams: any = {
        operation: 'System/iCABSSTaxCodeSearch',
        module: 'tax',
        method: 'bill-to-cash/search'
    };

    constructor( private utils: Utils, private serviceConstants: ServiceConstants) {
        super();
        this.pageId = PageIdentifier.ICABSSTAXCODESEARCH;
    }

    ngOnInit(): void {
        this.pageTitle = 'Tax Code Search';
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
        this.riTable.AddTableField('TaxCode', MntConst.eTypeCode, 'Key', 'Tax Code', 10);
        this.riTable.AddTableField('TaxCodeDesc', MntConst.eTypeText, 'Required', 'Description', 40);
        this.riTable.AddTableField('TaxCodeDefaultInd', MntConst.eTypeCheckBox, 'Required', 'System Default', 15);
        this.buildTable();
    }

    public buildTable(): void {
        let search: URLSearchParams = new URLSearchParams();

        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '0');
        this.queryParams.search = search;
        this.riTable.loadTableData(this.queryParams);
    }

    public tableRowClick(event: any): void {
        let vntReturnData: any, returnObj: any;

        vntReturnData = event.row;
        returnObj = {
            'TaxCode': vntReturnData.TaxCode,
            'TaxCodeDesc': vntReturnData.TaxCodeDesc
        };
        this.emitSelectedData(returnObj);
    }

    public updateView(params: any): void {
        this.buildTableColumns();
    }

}
