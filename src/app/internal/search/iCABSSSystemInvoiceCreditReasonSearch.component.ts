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
    templateUrl: 'iCABSSSystemInvoiceCreditReasonSearch.html'
})

export class SystemInvoiceCreditReasonSearchComponent extends SelectedDataEvent implements OnDestroy {
    @ViewChild('SystemInvoiceCreditReasonTable') SystemInvoiceCreditReasonTable: TableComponent;
    public itemsPerPage: string = '10';
    public pageId: string;
    public inputParams: any = {
        method: 'bill-to-cash/search',
        operation: 'System/iCABSSSystemInvoiceCreditReasonSearch',
        module: 'invoicing'
    };
    public pageTitle: string = 'System Invoice Credit Reason Search';
    public columns: Array<any> = [
        { title: 'Invoice Credit Reason', name: 'InvoiceCreditReasonCode', type: MntConst.eTypeCode },
        { title: 'Description', name: 'InvoiceCreditReasonSystemDesc', type: MntConst.eTypeText },
        { title: 'Valid For Credit', name: 'ValidForCreditInd', type: MntConst.eTypeCheckBox },
        { title: 'Valid For Invoice', name: 'ValidForInvoiceInd', type: MntConst.eTypeCheckBox },
        { title: 'User Selectable', name: 'UserSelectableInd', type: MntConst.eTypeCheckBox },
        { title: 'Turnover Phased', name: 'PhaseTurnoverInd', type: MntConst.eTypeCheckBox }
    ];

    constructor(
        private serviceConstants: ServiceConstants,
        private utils: Utils
    ) {
        super();
        this.pageId = PageIdentifier.ICABSSSYSTEMINVOICECREDITREASONSEARCH;
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
        this.inputParams.search = search;
        this.SystemInvoiceCreditReasonTable.loadTableData(this.inputParams);
    }

    public updateView(params?: any): void {
        if (params && params.parentMode) {
            this.inputParams.parentMode = params.parentMode;
        }
        this.getTablePageData();
    }

    /* Sends data to parent page ellipsis */
    public selectedData(event: any): void {
        let returnObj: any;
        switch (this.inputParams.parentMode) {
            case 'LookUp':
                returnObj = {
                    'InvoiceCreditReasonCode': event.row.InvoiceCreditReasonCode,
                    'InvoiceCreditReasonDesc': event.row.InvoiceCreditReasonSystemDesc
                };
                break;
            default:
                returnObj = {
                    'InvoiceCreditReasonCode': event.row.InvoiceCreditReasonCode
                };
                break;
        }
        this.emitSelectedData(returnObj);
    }
}
