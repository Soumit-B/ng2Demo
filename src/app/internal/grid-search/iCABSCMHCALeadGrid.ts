import { Data } from '@angular/router';
import * as moment from 'moment';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, OnDestroy, Injector, ViewChild, Input, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { GridComponent } from './../../../shared/components/grid/grid';
import { ErrorCallback } from './../../base/Callback';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';

@Component({
    templateUrl: 'iCABSCMHCALeadGrid.html',
    styles: [`
    :host /deep/ .gridtable.table-bordered>thead>tr>th:nth-child(8)
    {
        width: 30%;
    }`]
})

export class LeadGridComponent extends BaseComponent implements ErrorCallback, AfterViewInit {
    @ViewChild('LeadGrid') LeadGrid: GridComponent;
    @ViewChild('LeadPagination') LeadPagination: PaginationComponent;
    @ViewChild('errorModal') public errorModal;
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMHCALEADGRID;
        this.browserTitle = 'PDA Lead/Alert';
        this.pageTitle = 'PDA Lead/Alert Details';
    }
    public LeadDateFrom: Date | boolean;
    private LeadDateFromString: string;
    public LeadDateTo: Date | boolean;
    private LeadDateToString: string;
    public pageTitle: string;
    public pageId: string = '';
    public currentPage: number = 1;
    public PageSize: number = 10;
    public maxColumn: any = 9;
    public totalItems: number;
    private search: any;
    public griddata: any;
    public controls = [
        { name: 'EmployeeCode', disabled: true },
        { name: 'EmployeeSurname', disabled: true },
        { name: 'ContractNumber' },
        { name: 'ContractName', disabled: true },
        { name: 'PremiseNumber' },
        { name: 'PremiseName', disabled: true },
        { name: 'LeadDateFrom', required: true },
        { name: 'LeadDateTo', required: true },
        { name: 'LeadTypeCode', value: 'All' }
    ];
    public headerParams: any = {
        method: 'prospect-to-contract/maintenance',
        operation: 'ContactManagement/iCABSCMHCALeadGrid',
        module: 'prospect'
    };
    private messages: any = {
        gridNotLoadedError: 'Grid Not Loaded'
    };
    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit(): void {
        super.ngOnInit();
        this.setErrorCallback(this);
        this.window_onload();
        switch (this.parentMode) {
            case 'PremisesPDAVisit':
            case 'Debrief':
                this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCode'));
                this.setControlValue('EmployeeSurname', this.riExchange.getParentHTMLValue('EmployeeSurname'));
                if (this.pageParams.parentMode === 'Debrief') {
                    this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                    this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                    this.setControlValue('ActualVisitDate', this.riExchange.getParentHTMLValue('ActualVisitDate'));
                    if (this.getControlValue('EmployeeCode')) {
                        this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCode'));
                        this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('EmployeeSurname'));
                    }
                    else {
                        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
                        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
                        this.setControlValue('ActualVisitDate', this.riExchange.getParentHTMLValue('ActualVisitDate'));
                    }
                }
                break;
            case 'Debrief-All':
                this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCode'));
                this.setControlValue('EmployeeSurname', this.riExchange.getParentHTMLValue('EmployeeSurname'));
                this.setControlValue('DebriefFromDate', this.riExchange.getParentHTMLValue('DebriefFromDate'));
                this.setControlValue('DebriefToDate', this.riExchange.getParentHTMLValue('DebriefToDate'));

                break;
            default:
                this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCode'));
                this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.setControlValue('LeadDateFrom', this.riExchange.getParentHTMLValue('LeadDateFrom'));
                this.setControlValue('LeadDateTo', this.riExchange.getParentHTMLValue('LeadDateTo'));
                break;
        }
        this.buildGrid();
    }

    ngAfterViewInit(): void {
        this.setControlValue('LeadTypeCode', 'All');
    }

    public refresh(): void {
        this.buildGrid();
    }

    public buildGrid(): void {
        let search: URLSearchParams;
        search = this.getURLSearchParamObject();
        search.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        search.set('ContractNumber', this.getControlValue('ContractNumber'));
        search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        search.set('LeadDateFrom', this.getControlValue('LeadDateFrom'));
        search.set('LeadDateTo', this.getControlValue('LeadDateTo'));
        search.set('LeadTypeCode', this.getControlValue('LeadTypeCode'));
        search.set('ActiveOnly', 'False');
        search.set('riGridHandle', this.getControlValue('riGridHandle'));
        search.set('riCacheRefresh', this.getControlValue('riCacheRefresh'));
        search.set(this.serviceConstants.Action, '2');
        search.set(this.serviceConstants.PageSize, '10');
        search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        search.set(this.serviceConstants.GridMode, '0');
        search.set('riSortOrder', 'Descending');
        this.headerParams.search = search;
        this.LeadGrid.loadGridData(this.headerParams);
    }

    public getCurrentPage(currentPage: any): void {
        this.currentPage = currentPage.value;
        this.buildGrid();
    }

    public window_onload(): void {
        this.getRequest();
        this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCode'));
        this.setControlValue('EmployeeSurname', this.riExchange.getParentHTMLValue('EmployeeSurname'));
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        this.setControlValue('LeadDateFrom', this.riExchange.getParentHTMLValue('LeadDateFrom'));
        this.setControlValue('LeadDateTo', this.riExchange.getParentHTMLValue('LeadDateTo'));
        this.riExchange.getParentHTMLValue('LeadTypeCode');
        this.setDate();
    }
    public getRequest(): void {
        let searchPost: URLSearchParams;
        searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, '6');

        let postParams: any = {};
        postParams.Function = 'GetDescriptions';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchPost, postParams)
            .subscribe(data => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.setControlValue('ContractName', data.EmployeeSurname);
                this.setControlValue('PremiseName', data.EmployeeSurname);
            }, error => {
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
            });
    }
    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data.msg, title: 'Error' }, false);
    }
    private fetchTranslatedContent(): void {
        this.getTranslatedValue(this.messages.gridNotLoadedError, null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.messages.gridNotLoadedError = res;
                }
            });
        });
    }

    public onGridRowDblClick(data: any): void {
        this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
        // ** following page is not developed. Code needs to be uncomented once page developed **
        //this.griddata = data;
        // switch (data.rowData) {
        //     case 'LeadNumber':
        //         // this.navigate('PDAICABSLeadUpdate', 'ContactManagement/iCABSCMHCALeadMaintenance', { //page yet to be developed
        //         //     parentMode: 'PDAICABSLeadUpdate'
        //         this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
        //         break;
        //     case 'CustomerContactNumber':
        //         // this.navigate('PDAICABSLead', 'ContactManagement/iCABSCMCustomerContactMaintenance.htm', { //page yet to be developed
        //         //     parentMode: 'PDAICABSLead'
        //         this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
        //         break;
        // };
    }

    private setDate(): void {
        //dateFrom
        if (this.getControlValue('LeadDateFrom')) {
            let getFromDate: any = this.globalize.parseDateToFixedFormat(this.getControlValue('LeadDateFrom'));
            this.LeadDateFrom = this.globalize.parseDateStringToDate(getFromDate);

        } else {
            this.LeadDateFrom = null;
        }
        //dateTo
        if (this.getControlValue('LeadDateTo')) {
            let getFromDate: any = this.globalize.parseDateToFixedFormat(this.getControlValue('LeadDateTo'));
            this.LeadDateTo = this.globalize.parseDateStringToDate(getFromDate);
        } else {
            this.LeadDateTo = null;
        }
    }

    public LeadDateFromSelectedValue(event: any): void {
        if (event && event.value) {
            this.setControlValue('LeadDateFrom', event.value);
        }
    }
    public LeadDateToSelectedValue(event: any): void {
        if (event && event.value) {
            this.setControlValue('LeadDateTo', event.value);
        }
    }

    public getGridInfo(info: any): void {
        this.totalItems = info.totalRows;
    }
}
