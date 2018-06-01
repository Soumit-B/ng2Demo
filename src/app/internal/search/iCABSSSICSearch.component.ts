import { Component, OnDestroy, Injector, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Utils } from './../../../shared/services/utility';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { PageIdentifier } from './../../base/PageIdentifier';
import { TableComponent } from './../../../shared/components/table/table';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { HttpService } from '../../../shared/services/http-service';
import { SelectedDataEvent } from './../../../shared/events/ellipsis-event-emitter';


@Component({
    templateUrl: 'iCABSSSICSearch.html'
})

export class SICSearchComponent extends SelectedDataEvent implements OnDestroy {
    @ViewChild('SICsearchTable') SICsearchTable: TableComponent;
    public itemsPerPage: string = '10';
    public pageId: string;
    public inputParams: any = {
        method: 'service-delivery/search',
        operation: 'System/iCABSSSICSearch',
        module: 'sra'
    };

    public columns: Array<any> = [
        { title: 'Code', name: 'SICCode', type: MntConst.eTypeCode },
        { title: 'Description', name: 'SICDescription', type: MntConst.eTypeText }
    ];

    constructor(
        private serviceConstants: ServiceConstants,
        private utils: Utils
    ) {
        super();
        this.pageId = PageIdentifier.ICABSSSICSEARCH;
    }

    ngOnDestroy(): void {
        this.serviceConstants = null;
        this.utils = null;
    }

    private getTablePageData(): void {
        let search: any = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '0');
        search.set('SICCodeLang', '');
        if (this.inputParams.parentMode !== 'Search' && this.inputParams.parentMode !== 'LookUp' && this.inputParams.parentMode !== 'LookUp-SICLang') {
            search.set('SICCodeLang', 'TRUE');
        }
        this.inputParams.search = search;
        this.SICsearchTable.loadTableData(this.inputParams);
    }

    public updateView(params?: any): void {
        if (params && params.parentMode) {
            this.inputParams.parentMode = params.parentMode;
        }
        this.getTablePageData();
    }

    /* Sends data to parent page ellipsis */
    public selectedData(event: any): void {
        let returnObj = {
            'SICCode': event.row.SICCode
        };
        switch (this.inputParams.parentMode) {
            case 'Search':
            case 'LookUp':
            case 'LookUp-CustomerType':
            case 'LookUp-Premise':
                returnObj['SICDescription'] = event.row['SICDescription'];
                break;
            case 'LookUp-SICLang':
                returnObj['OriSICDescription'] = event.row['SICDescription'];
                break;
        }
        this.emitSelectedData(returnObj);
    }
}
