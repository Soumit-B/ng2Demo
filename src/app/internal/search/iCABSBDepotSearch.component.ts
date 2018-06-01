import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Utils } from './../../../shared/services/utility';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RiExchange } from './../../../shared/services/riExchange';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { HttpService } from '../../../shared/services/http-service';
import { TableComponent } from './../../../shared/components/table/table';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSBDepotSearch.html'
})

export class DeportSearchComponent implements OnInit, OnDestroy {
    public uiForm: FormGroup;
    public pageId: string = '';
    public controls = [];
    public method: string = 'service-delivery/search';
    public module: string = 'depot';
    public operation: string = 'Business/iCABSBDepotSearch';
    public inputParams: any = {};
    public search: URLSearchParams;
    public itemsPerPage: number = 13;
    public page: number = 1;
    public pageTitle: string = 'Depot Search';
    public columns: Array<any> = [
        { title: 'Depot Number', name: 'DepotNumber', className: ['col4', 'center'], type: MntConst.eTypeInteger },
        { title: 'Depot Name', name: 'DepotName', className: ['col12', 'center'], type: MntConst.eTypeText }
    ];
    public tableheading: string = 'Depot Search';
    @ViewChild('DepotTable') DepotTable: TableComponent;
    constructor(injector: Injector, private _httpService: HttpService, private formBuilder: FormBuilder,
        private utils: Utils, private serviceConstants: ServiceConstants,
        private ellipsis: EllipsisComponent, private riExchange: RiExchange) {
        this.pageId = PageIdentifier.ICABSBDEPOTSEARCH;
    }

    ngOnInit(): void {
        this.pageTitle = 'Depot Search';
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;
        this.uiForm = this.formBuilder.group({});
        this.riExchange.renderForm(this.uiForm, this.controls);
    }

    private getTableDepot(): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '0');
        //    this.search.set('table', 'Depot');
        //   this.search.set('usercode', this.utils.getUserCode());
        this.inputParams.search = this.search;
        this.DepotTable.loadTableData(this.inputParams);
    }

    public getCurrentPage(currentPage: number): void {
        this.page = currentPage;
    }

    public selectedData(event: any): void {
        let returnObj: any;
        let DepotNumber = event.row.DepotNumber;
        let Depotname = event.row.DepotName;
        switch (this.ellipsis.childConfigParams['parentMode']) {
            case 'LookUp':
                returnObj = {
                    'DepotNumber': event.row.DepotNumber,
                    'DepotName': event.row.DepotName
                };
                break;
            default:
                returnObj = {
                    'DepotNumber': event.row.DepotNumber
                };
                break;
        }
        this.ellipsis.sendDataToParent(returnObj);
    }


    public onSearchClick(): void {
        this.getTableDepot();

    }

    ngOnDestroy(): void {
        //todo
    }

    public updateView(params: any): void {
        this.getTableDepot();
    }
}
