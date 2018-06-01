import { Component, OnInit, Injector, ViewChild, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { Utils } from './../../../shared/services/utility';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { TableComponent } from './../../../shared/components/table/table';
import { SelectedDataEvent } from './../../../shared/events/ellipsis-event-emitter';
import { RiExchange } from '../../../shared/services/riExchange';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSBPestNetOnLineLevelSearch.html'
})

export class PestNetOnLineLevelSearchComponent extends SelectedDataEvent implements OnInit, OnDestroy {
    @ViewChild('riTable') riTable: TableComponent;
    public pageId: string = '';
    public parentMode: string;
    public controls = [];
    public inputParams: any = {};
    public itemsPerPage: number = 10;
    public page: number = 1;
    public columns: Array<any>;
    public rows: Array<any> = [];
    public riExchange: RiExchange;
    public utils: Utils;
    public serviceConstants: ServiceConstants;
    public formBuilder: FormBuilder;
    public uiForm: FormGroup;


    public queryParams: any = {
        operation: 'Business/iCABSBPestNetOnLineLevelSearch',
        module: 'pnol',
        method: 'extranets-connect/search'
    };

    constructor(injector: Injector) {
        super();
        this.injectService(injector);
        this.pageId = PageIdentifier.ICABSBPESTNETONLINELEVELSEARCH;
    }

    ngOnInit(): void {
        this.uiForm = this.formBuilder.group({});
        this.riExchange.renderForm(this.uiForm, this.controls);
    }

    ngOnDestroy(): void {
        this.serviceConstants = null;
        this.utils = null;
        this.formBuilder = null;
        this.riExchange = null;
    }

    public injectService(injector: Injector): void {
        this.formBuilder = injector.get(FormBuilder);
        this.utils = injector.get(Utils);
        this.serviceConstants = injector.get(ServiceConstants);
        this.riExchange = injector.get(RiExchange);
    }

    //Called during ellipsis search
    public updateView(params?: any): void {
        this.parentMode = params.parentMode;
        this.buildTable();
    }

    //Method to set filter values for table
    public buildTable(): void {
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.inputParams.parentMode = this.parentMode;
        this.inputParams.search = search;
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.columns = new Array();
        this.buildTableColumns();
        this.riTable.loadTableData(this.inputParams);
    }

    //Method to build table columns
    public buildTableColumns(): void {
        this.columns.push({ title: 'Level', name: 'PNOLiCABSLevel', type: MntConst.eTypeCode });
        this.columns.push({ title: 'Description', name: 'PNOLDescription', type: MntConst.eTypeTextFree });
        this.columns.push({ title: 'PNOL Level', name: 'PNOLLevel', type: MntConst.eTypeInteger });
        this.columns.push({ title: 'Min Contract Value', name: 'MinimumContractValue', type: MntConst.eTypeDecimal2 });
        this.columns.push({ title: 'Uplift Perc', name: 'UpliftPercentage', type: MntConst.eTypeDecimal2 });
        this.columns.push({ title: 'ProRata Std Visits', name: 'ProRataStandardVisits', type: MntConst.eTypeDecimal2 });
        if (this.parentMode === 'PNOLiCABSLevelLookUp') {
            this.columns.push({ title: 'InActive', name: 'InActiveInd', type: MntConst.eTypeCheckBox });
        }
    }

    //Method called on selecting a data from table
    public selectedData(event: any): void {
        let returnObj: any;
        switch (this.parentMode) {
            case 'LookUp':
            case 'Search':
                returnObj = {
                    'PNOLiCABSLevel': event.row.PNOLiCABSLevel,
                    'PNOLDescription': event.row.PNOLDescription
                };
                break;
            default:
                returnObj = {
                    'PNOLiCABSLevel': event.row.PNOLiCABSLevel
                };
        }
        this.emitSelectedData(returnObj);
    }
}
