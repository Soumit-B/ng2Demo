import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { Utils } from './../../../shared/services/utility';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { SelectedDataEvent } from './../../../shared/events/ellipsis-event-emitter';
import { RiExchange } from '../../../shared/services/riExchange';
import { TableComponent } from './../../../shared/components/table/table';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSBLostBusinessDetailSearch.html'
})

export class LostBusinessDetailSearchComponent extends SelectedDataEvent implements OnInit, OnDestroy {
    @ViewChild('riTable') riTable: TableComponent;

    public pageId: string = '';
    public controls: Array<any> = [
        { name: 'LostBusinessDetailSearchType', required: false, disabled: false },
        { name: 'LostBusinessDetailSearchValue', required: false, disabled: false }
    ];
    public lostBusinessCode: string;
    // URL Query Parameters
    public queryParams: any = {
        operation: 'Business/iCABSBLostBusinessDetailSearch',
        module: 'retention',
        method: 'ccm/search'
    };

    public riExchange: RiExchange;
    public utils: Utils;
    public serviceConstants: ServiceConstants;
    public formBuilder: FormBuilder;
    public uiForm: FormGroup;
    public parentMode: string;
    public inputParams: any = {};
    public itemsPerPage: number = 10;
    public page: number = 1;
    public columns: Array<any>;
    public filterOption: string = 'Code';
    public pageTitle: string = 'Lost Business Detail Code/Description Search';

    constructor(injector: Injector) {
        super();
        this.injectServices(injector);
        this.pageId = PageIdentifier.ICABSBLOSTBUSINESSDETAILSEARCH;
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

    public injectServices(injector: Injector): void {
        this.formBuilder = injector.get(FormBuilder);
        this.utils = injector.get(Utils);
        this.serviceConstants = injector.get(ServiceConstants);
        this.riExchange = injector.get(RiExchange);
    }

    //Called during ellipsis search
    public updateView(params?: any): void {
        this.lostBusinessCode = params.lostBusinessCode;
        this.parentMode = params.parentMode;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessDetailSearchType', 'Code');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessDetailSearchValue', '');
        this.buildTable();
    }

    //Method to set filter values for table
    public buildTable(): void {
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        if (this.lostBusinessCode !== '')
            search.set('LostBusinessCode', this.lostBusinessCode);
        if (this.parentMode === 'LookUp-Detail' || this.parentMode === 'LookUp-LostBusinessDetail')
            search.set('InvalidForNew', 'false');
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessDetailSearchValue') !== '') {
            switch (this.filterOption) {
                case 'Description':
                    search.set('search.op.LostBusinessDetailDesc', 'GE');
                    search.set('LostBusinessDetailDesc', this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessDetailSearchValue'));
                    break;
                case 'Code':
                    search.set('search.op.LostBusinessDetailCode', 'GE');
                    search.set('LostBusinessDetailCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessDetailSearchValue'));
                    break;
            }
        }
        search.set('search.sortby', 'LostBusinessDetailCode');
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
        this.columns.push({ title: 'Code', name: 'LostBusinessDetailCode', type: MntConst.eTypeCode, size: 8 });
        this.columns.push({ title: 'Description', name: 'LostBusinessDetailDesc', type: MntConst.eTypeText, size: 40 });
        this.columns.push({ title: 'Lost Business Code', name: 'LostBusinessCode', type: MntConst.eTypeCode, size: 2 });
        this.columns.push({ title: 'Invalid for New', name: 'InvalidForNew', type: MntConst.eTypeInteger, size: 2 });
    }

    //Method called on selecting a data from table
    public selectedData(event: any): void {
        let returnObj: any;
        switch (this.parentMode) {
            case 'LookUp':
            case 'Search':
            case 'LookUp-LostBusinessDetail':
                returnObj = {
                    'LostBusinessCode': event.row.LostBusinessCode,
                    'LostBusinessDetailCode': event.row.LostBusinessDetailCode
                };
                break;
            case 'LookUp-Active':
            case 'LookUp-Language':
            case 'LookUp-Detail':
                returnObj = {
                    'LostBusinessDetailCode': event.row.LostBusinessDetailCode,
                    'LostBusinessDetailDesc': event.row.LostBusinessDetailDesc
                };
        }
        this.emitSelectedData(returnObj);
    }

    public menuOptionsChange(event: any): void {
        this.filterOption = event;
    }
}
