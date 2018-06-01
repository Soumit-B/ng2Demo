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
    templateUrl: 'iCABSBInfestationLevelSearch.html'
})

export class InfestationLevelSearchComponent extends SelectedDataEvent implements OnInit, OnDestroy {
    @ViewChild('riTable') riTable: TableComponent;
    private riExchange: RiExchange;
    private utils: Utils;
    private serviceConstants: ServiceConstants;
    private formBuilder: FormBuilder;
    private infestationGroupCode: string = '';
    private infestationGroupDesc: string = '';
    private parentMode: string;
    private queryParams: any = {
        operation: 'Business/iCABSBInfestationLevelSearch',
        module: 'service',
        method: 'service-delivery/search'
    };
    private inputParams: any = {};
    public pageId: string = '';
    public controls: Array<any> = [
        { name: 'InfestationGroupCode', required: false, disabled: false },
        { name: 'InfestationGroupDesc', required: false, disabled: false }
    ];
    public itemsPerPage: number = 10;
    public page: number = 1;
    public uiForm: FormGroup;
    public isInfestationGroupPresent: boolean = true;
    public pageTitle: string = 'Infestation Level Search';

    constructor(injector: Injector) {
        super();
        this.injectService(injector);
        this.pageId = PageIdentifier.ICABSBINFESTATIONLEVELSEARCH;
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

    private injectService(injector: Injector): void {
        this.formBuilder = injector.get(FormBuilder);
        this.utils = injector.get(Utils);
        this.serviceConstants = injector.get(ServiceConstants);
        this.riExchange = injector.get(RiExchange);
    }

    //Called during ellipsis search
    public updateView(params?: any): void {
        if (params) {
            this.parentMode = params.parentMode;
            this.infestationGroupCode = params.InfestationGroupCode ? params.InfestationGroupCode : '';
            this.infestationGroupDesc = params.InfestationGroupDesc ? params.InfestationGroupDesc : '';
            this.riExchange.riInputElement.SetValue(this.uiForm, 'InfestationGroupCode', params.InfestationGroupCode ? params.InfestationGroupCode : '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'InfestationGroupDesc', params.InfestationGroupDesc ? params.InfestationGroupDesc : '');
            if (!this.infestationGroupCode) {
                this.isInfestationGroupPresent = false;
            } else {
                this.isInfestationGroupPresent = true;
            }
            this.buildTable();
        }
    }

    //Method to set filter values for table
    public buildTable(): void {
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (this.infestationGroupCode) {
            search.set('InfestationGroupCode', this.infestationGroupCode);
            search.set('search.sortby', 'InfestationLevelCode');
        } else {
            search.set('search.sortby', 'InfestationGroupCode');
        }
        this.inputParams.parentMode = this.parentMode;
        this.inputParams.search = search;
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.buildTableColumns();
        this.riTable.loadTableData(this.inputParams);
    }

    //Method to build table columns
    public buildTableColumns(): void {
        this.riTable.clearTable();
        if (!this.infestationGroupCode) {
            this.riTable.AddTableField('InfestationGroupCode', MntConst.eTypeCode, 'Key', 'Group Code', 15);
            this.riTable.AddTableField('InfestationGroupDesc', MntConst.eTypeText, 'Virtual', 'Group Description', 30);
        }
        this.riTable.AddTableField('InfestationLevelCode', MntConst.eTypeCode, 'Key', 'Level Code', 15);
        this.riTable.AddTableField('InfestationLevelDesc', MntConst.eTypeText, 'Required', 'Level Description', 30);
    }

    //Method called on selecting a data from table
    public selectedData(event: any): void {
        let returnObj: any;
        switch (this.parentMode) {
            case 'InfestationGroup':
                //navigation to Business/iCABSBInfestationLevelMaintenance
                break;
            case 'CWILookUp':
                if (this.infestationGroupCode) {
                    returnObj = {
                        'CWIInfestationLevelCode': event.row.InfestationLevelCode,
                        'CWIInfestationLevelDesc': event.row.InfestationLevelDesc
                    };
                } else {
                    returnObj = {
                        'CWIInfestationLevelCode': event.row.InfestationLevelCode,
                        'CWIInfestationLevelDesc': event.row.InfestationLevelDesc,
                        'CWIInfestationGroupCode': event.row.InfestationGroupCode
                    };
                }
                break;
            default:
                if (this.parentMode === 'LookUp') {
                    if (this.infestationGroupCode) {
                        returnObj = {
                            'InfestationLevelCode': event.row.InfestationLevelCode,
                            'InfestationLevelDesc': event.row.InfestationLevelDesc
                        };
                    } else {
                        returnObj = {
                            'InfestationLevelCode': event.row.InfestationLevelCode,
                            'InfestationLevelDesc': event.row.InfestationLevelDesc,
                            'InfestationGroupCode': event.row.InfestationGroupCode,
                            'InfestationGroupDesc': event.row.InfestationGroupDesc
                        };
                    }
                } else {
                    if (this.infestationGroupCode) {
                        returnObj = {
                            'InfestationLevelCode': event.row.InfestationLevelCode
                        };
                    } else {
                        returnObj = {
                            'InfestationLevelCode': event.row.InfestationLevelCode,
                            'InfestationGroupCode': event.row.InfestationGroupCode
                        };
                    }
                }
        }
        this.emitSelectedData(returnObj);
    }
}
