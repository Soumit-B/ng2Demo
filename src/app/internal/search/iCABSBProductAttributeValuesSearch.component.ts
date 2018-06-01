import { Component, OnInit, Injector, ViewChild, Input, Renderer, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { PageIdentifier } from './../../base/PageIdentifier';
import { SelectedDataEvent } from './../../../shared/events/ellipsis-event-emitter';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Utils } from './../../../shared/services/utility';
import { RiExchange } from '../../../shared/services/riExchange';
import { TableComponent } from './../../../shared/components/table/table';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSBProductAttributeValuesSearch.html'
})

export class ProductAttributeValuesSearchComponent extends SelectedDataEvent implements OnInit, OnDestroy {
    @ViewChild('riTable') riTable: TableComponent;
    public pageId: string = '';
    public formBuilder: FormBuilder;
    public utils: Utils;
    public serviceConstants: ServiceConstants;
    public riExchange: RiExchange;
    public uiForm: FormGroup;
    public itemsPerPage: number = 10;
    public page: number = 1;
    public columns: Array<any>;
    public inputParams: Object;
    public ellipsisSetup: Object = {
        disabled: true
    };

    // URL Query Parameters
    public queryParams: any = {
        operation: 'Business/iCABSBProductAttributeValuesSearch',
        module: 'product',
        method: 'service-delivery/search'
    };

    public controls = [
        { name: 'AttributeValue' },
        { name: 'AttributeCodeSearchValue', disabled: true },
        { name: 'AttributeLabelSearchValue', disabled: true }
    ];

    constructor(injector: Injector) {
        super();
        this.injectServices(injector);
        this.pageId = PageIdentifier.ICABSBPRODUCTATTRIBUTEVALUESSEARCH;
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

    public updateView(params?: any): void {
        this.inputParams = params;
        this.initializeContent();
        this.populateTable();
    }

    public injectServices(injector: Injector): void {
        this.formBuilder = injector.get(FormBuilder);
        this.utils = injector.get(Utils);
        this.serviceConstants = injector.get(ServiceConstants);
        this.riExchange = injector.get(RiExchange);
    }

    public initializeContent(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AttributeCodeSearchValue', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AttributeLabelSearchValue', '');
        if (this.inputParams['AttributeCode']) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AttributeCodeSearchValue', this.inputParams['AttributeCode'].trim());
        }
        if (this.inputParams['AttributeLabel']) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AttributeLabelSearchValue', this.inputParams['AttributeLabel'].trim());
        }
    }

    //Method called on selecting a data from table
    public selectedData(event: any): void {
        let vntReturnData: any; let returnObj: Object;
        vntReturnData = event.row;
        if (this.inputParams['parentMode']) {
            switch (this.inputParams['parentMode']) {
                case 'Attribute1':
                    returnObj = {
                        'SelAttributeValue1': vntReturnData.AttributeValue
                    };
                    break;
                case 'Attribute2':
                    returnObj = {
                        'SelAttributeValue2': vntReturnData.AttributeValue
                    };
                    break;
                case 'DisplayEntry':
                    returnObj = {
                        'SelAttributeValue': vntReturnData.AttributeValue
                    };
                    break;
            }
            this.emitSelectedData(returnObj);
        }
    }

    //Method to set filter values for table
    public populateTable(): void {
        let search: URLSearchParams = new URLSearchParams(); let searchParams: any = {};

        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('AttributeCode', this.inputParams['AttributeCode'] ? this.inputParams['AttributeCode'].trim() : '');
        searchParams.search = search;
        searchParams.module = this.queryParams.module;
        searchParams.method = this.queryParams.method;
        searchParams.operation = this.queryParams.operation;
        this.buildTableColumns();
        this.riTable.loadTableData(searchParams);
    }

    //Method to build table columns
    public buildTableColumns(): void {
        this.columns = [];
        this.columns.push({ title: 'Attribute Value', name: 'AttributeValue', type: MntConst.eTypeText, size: 40 });
    }
}
