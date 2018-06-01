import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { FormGroup, FormBuilder } from '@angular/forms';

import { PageIdentifier } from './../../base/PageIdentifier';
import { Utils } from './../../../shared/services/utility';
import { RiExchange } from './../../../shared/services/riExchange';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { TableComponent } from './../../../shared/components/table/table';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { SelectedDataEvent } from './../../../shared/events/ellipsis-event-emitter';

@Component({
    templateUrl: 'iCABSSContactMediumLanguageSearch.html'
})

export class ContactMediumLanguageSearchComponent extends SelectedDataEvent implements OnInit, OnDestroy {
    @ViewChild('riTable') riTable: TableComponent;

    public pageTitle: string;
    public tableTitle: string;
    public inputParams: any;
    public pageId: string = '';
    public isLanguageDetail: boolean = true;
    public uiForm: FormGroup;
    public formBuilder: FormBuilder;
    public utils: Utils;
    public riExchange: RiExchange;
    public serviceConstants: ServiceConstants;
    public controls = [
        { name: 'LanguageCode', readonly: false, disabled: true, required: false }, //Parent page
        { name: 'LanguageDescription', readonly: false, disabled: true, required: false }//Parent page
    ];

    constructor(injector: Injector) {
        super();
        this.injectServices(injector);
        this.pageId = PageIdentifier.ICABSSCONTACTMEDIUMLANGUAGESEARCH;
    }

    ngOnInit(): void {
        this.uiForm = this.formBuilder.group({});
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.tableTitle = 'Contact Medium Language Search';
        this.pageTitle = 'Contact Medium Language Search';
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

    public updateView(params?: any): void {
        this.inputParams = params;

        let languageCode: string = (this.inputParams && this.inputParams.LanguageCode) ? this.inputParams.LanguageCode : '';
        let description: string = (this.inputParams && this.inputParams.LanguageDescription) ? this.inputParams.LanguageDescription : '';

        this.riExchange.riInputElement.SetValue(this.uiForm, 'LanguageCode', languageCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LanguageDescription', description);

        if (!this.riExchange.riInputElement.GetValue(this.uiForm, 'LanguageCode') || this.inputParams.parentMode === 'ContactManagement') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'LanguageCode', this.riExchange.LanguageCode());
            this.isLanguageDetail = false;
        }
        this.buildTableColumns();
    }

    public buildTableColumns(): void {
        this.riTable.clearTable();
        this.riTable.AddTableField('ContactMediumCode', MntConst.eTypeInteger, 'Key', 'Type Code', 3);
        if (this.isLanguageDetail) {
            this.riTable.AddTableField('ContactMediumSystemDesc', MntConst.eTypeText, 'Required', 'Description', 40);
        }

        this.riTable.AddTableField('ContactMediumDesc', MntConst.eTypeText, 'Required', 'Display Description', 40);

        this.buildTable();
    }

    public buildTable(): void {
        let xhr = {
            module: 'tickets',
            method: 'ccm/search',
            operation: 'System/iCABSSContactMediumLanguageSearch'
        };

        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('LanguageCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'LanguageCode'));

        xhr['search'] = search;
        this.riTable.loadTableData(xhr);
    }

    public selectedData(obj: any): void {
        let returnObj: any;

        switch (this.inputParams.parentMode) {
            case 'LookUp':
            case 'ContactManagement':
                returnObj = {
                    'ContactMediumCode': obj.row.ContactMediumCode,
                    'ContactMediumDesc': obj.row.ContactMediumDesc
                };
                break;

            case 'PipelineProspectMaintenance':
                returnObj = {
                    'ContactMediumCode': obj.row.ContactMediumCode,
                    'ContactMediumDesc': obj.row.ContactMediumDesc,
                    'NextActionRequired': 'ContactMediumSelected'
                };
                break;
        }
        this.emitSelectedData(returnObj);
    }

    public refresh(): void {
        this.buildTableColumns();
    }
}
