import { ServiceConstants } from './../../../shared/constants/service.constants';
import { SelectedDataEvent } from './../../../shared/events/ellipsis-event-emitter';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Utils } from './../../../shared/services/utility';
import { PageIdentifier } from './../../base/PageIdentifier';
import { TableComponent } from './../../../shared/components/table/table';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSCMProspectStatusSearch.html'
})
export class ProspectStatusSearchComponent extends SelectedDataEvent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('riTable') riTable: TableComponent;

    public queryParams: any = {
        operation: 'ContactManagement/iCABSCMProspectStatusSearch',
        module: 'prospect',
        method: 'prospect-to-contract/search'
    };

    public controls = [];
    public pageId: string;;
    public search = new URLSearchParams();
    public columns: Array<any>;
    public itemsPerPage: string = '10';
    public page: string = '1';
    public pageSize: string = '10';
    public utils: Utils;
    public serviceConstants: ServiceConstants;

    constructor(injector: Injector) {
        super();
        this.injectServices(injector);
        this.pageId = PageIdentifier.ICABSCMPROSPECTSTATUSSEARCH;
    }

    private injectServices(injector: Injector): void {
        this.utils = injector.get(Utils);
        this.serviceConstants = injector.get(ServiceConstants);
    }

    ngOnInit(): void {
        this.utils.setTitle('Prospect Status Search');
    }

    ngAfterViewInit(): void {
        this.buildTableColumns();
    }

    ngOnDestroy(): void {
        this.serviceConstants = null;
        this.utils = null;
    }

    public buildTableColumns(): void {
        this.riTable.clearTable();
        this.riTable.AddTableField('ProspectStatusCode', MntConst.eTypeCode, 'Key', 'Code', 10);
        this.riTable.AddTableField('ProspectStatusDesc', MntConst.eTypeText, 'Required', 'Description', 40);
        this.riTable.AddTableField('ProspectConvertedInd', MntConst.eTypeCheckBox, 'Required', 'Converted', 15);
        this.riTable.AddTableField('UserSelectableInd', MntConst.eTypeCheckBox, 'Required', 'User Selectable', 15);
        this.buildTable();
    }

    public buildTable(): void {
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParams.search = this.search;
        this.riTable.loadTableData(this.queryParams);
    }

    public tableRowClick(event: any): void {
        let vntReturnData = event.row;
        let retObj: any;
        retObj = {
            'ProspectStatusCode': vntReturnData.ProspectStatusCode,
            'ProspectStatusDesc': vntReturnData.ProspectStatusDesc,
            'ProspectConvertedInd': vntReturnData.ProspectConvertedInd
        };
        this.emitSelectedData(retObj);
    }

    public updateView(params: any): void {
        this.buildTableColumns();
    }

}
