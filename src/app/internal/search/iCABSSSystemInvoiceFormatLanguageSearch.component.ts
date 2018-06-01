import { Component, OnInit, OnDestroy, Injector, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Utils } from './../../../shared/services/utility';
import { RiExchange } from './../../../shared/services/riExchange';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { PageIdentifier } from './../../base/PageIdentifier';
import { TableComponent } from './../../../shared/components/table/table';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { HttpService } from '../../../shared/services/http-service';
import { SelectedDataEvent } from './../../../shared/events/ellipsis-event-emitter';

@Component({
    templateUrl: 'iCABSSSystemInvoiceFormatLanguageSearch.html'
})

export class SystemInvoiceFormatLanguageSearchComponent extends SelectedDataEvent implements OnInit, OnDestroy {
    @ViewChild('SystemInvoiceFormatLanguageTable') SystemInvoiceFormatLanguageTable: TableComponent;
    private formBuilder: FormBuilder;
    private utils: Utils;
    private riExchange: RiExchange;
    private serviceConstants: ServiceConstants;
    public itemsPerPage: string = '10';
    public isVisibleInputs: boolean = false;
    public pageTitle: string;
    public pageId: string;
    public uiForm: FormGroup;
    public inputParams: any = {
        method: 'bill-to-cash/search',
        operation: 'System/iCABSSSystemInvoiceFormatLanguageSearch',
        module: 'invoicing'
    };

    public columns: Array<any> = [];

    constructor(injector: Injector) {
        super();
        this.injectServices(injector);
        this.pageId = PageIdentifier.ICABSSSYSTEMINVOICEFORMATLANGUAGESEARCH;
    }

    public controls: any = [
        { name: 'LanguageCode' },
        { name: 'LanguageDescription' }
    ];

    ngOnInit(): void {
        this.uiForm = this.formBuilder.group({});
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.pageTitle = 'System Invoice Issue Type Language Search';
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
        this.SystemInvoiceFormatLanguageTable.loadTableData(this.inputParams);
    }

    public injectServices(injector: Injector): void {
        this.formBuilder = injector.get(FormBuilder);
        this.utils = injector.get(Utils);
        this.serviceConstants = injector.get(ServiceConstants);
        this.riExchange = injector.get(RiExchange);
    }

    public updateView(params?: any): void {
        this.columns = [{ title: 'Type Code', name: 'SystemInvoiceFormatCode', type: MntConst.eTypeText }];
        if (params) {
            if (params.parentMode)
                this.inputParams.parentMode = params.parentMode;
            if (params.languageCode) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'LanguageCode', params.languageCode);
                this.columns.push({ title: 'Description', name: 'InvoiceFormatSystemDesc', type: MntConst.eTypeText });
                this.isVisibleInputs = true;
            }
                this.columns.push({ title: 'Display Description', name: 'SystemInvoiceFormatDesc', type: MntConst.eTypeText });
        }
        this.getTablePageData();
    }

    /* Sends data to parent page ellipsis */
    public selectedData(event: any): void {
        let returnObj: any;
        returnObj = {
        'SystemInvoiceFormatCode': event.row.SystemInvoiceFormatCode
        };
        if (this.inputParams.parentMode === 'LookUp') {
            returnObj['SystemInvoiceFormatDesc'] = event.row.SystemInvoiceFormatDesc;
        }
        this.emitSelectedData(returnObj);
    }
}
