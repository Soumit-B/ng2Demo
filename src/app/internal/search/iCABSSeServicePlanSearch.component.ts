import { Component, ViewChild, Input, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';
import { TableComponent } from './../../../shared/components/table/table';
import { Observable } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSSeServicePlanSearch.html'
})

export class ServicePlanSearchComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('servicePlanTable') servicePlanTable: TableComponent;
    public pageId: string = '';
    public controls = [
        { name: 'BranchServiceAreaCode' },
        { name: 'EmployeeSurname' }
    ];
    public method: string = 'service-planning/search';
    public module: string = 'planning';
    public operation: string = 'Service/iCABSSeServicePlanSearch';
    public search: any;
    public tableheading: string;
    public txtReadonly: boolean = true;
    public inputParams: any = {};
    public itemsPerPage: number = 10;
    public page: number = 1;
    public columns: Array<any>;
    public rows: Array<any> = [];
    public isTableRefreshDisabled: boolean = false;

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEPLANSEARCH;
        this.browserTitle = 'Service Plan Search';
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public updateView(params: any): void {
        this.setControlValue('BranchServiceAreaCode', this.UCase(params.branchServiceAreaCode));
        this.setControlValue('EmployeeSurname', params.employeeSurname);
        if (!params.branchServiceAreaCode) {
            this.txtReadonly = false;
            this.servicePlanTable.clearTable();
            this.isTableRefreshDisabled = true;
            return;
        }
        this.isTableRefreshDisabled = false;
        this.buildTable(params);
    }

    public buildTable(params: any): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('BranchNumber', this.utils.getBranchCode());
        this.search.set('BranchServiceAreaCode', params.branchServiceAreaCode || this.getControlValue('BranchServiceAreaCode'));
        this.inputParams.parentMode = params.parentMode;
        this.inputParams.search = this.search;
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.columns = new Array();
        this.buildTableColumns();
        this.servicePlanTable.loadTableData(this.inputParams);
    }
    public buildTableColumns(): void {
        this.columns.push({ title: 'Service Plan Number', name: 'ServicePlanNumber', type: MntConst.eTypeInteger });
        this.columns.push({ title: 'Service Plan Description', name: 'ServicePlanDescription', type: MntConst.eTypeText });
        this.columns.push({ title: 'Start Date', name: 'ServicePlanStartDate', type: MntConst.eTypeDate });
        this.columns.push({ title: 'Premises', name: 'ServicePlanNoOfCalls', type: MntConst.eTypeInteger });
        this.columns.push({ title: 'Units', name: 'ServicePlanNoOfExchanges', type: MntConst.eTypeInteger });
        this.columns.push({ title: 'Status', name: 'ServicePlanStatusDesc', type: MntConst.eTypeText });
    }

    public selectedData(event: any): void {
        let returnObj: any;
        if (this.inputParams.parentMode === 'LookUp') {
            returnObj = {
                'ServicePlanNumber': event.row.ServicePlanNumber
            };
        }
        else {
            returnObj = {
                'ServicePlanNumber': event.row.ServicePlanNumber,
                'Object': event.row
            };
        }
        this.emitSelectedData(returnObj);
    }
}
