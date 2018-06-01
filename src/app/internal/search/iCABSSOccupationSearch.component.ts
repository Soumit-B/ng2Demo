import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { TableComponent } from './../../../shared/components/table/table';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { URLSearchParams } from '@angular/http';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';

@Component({
    templateUrl: 'iCABSSOccupationSearch.html'
})

export class OccupationSearchComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('occupationSearchTable') occupationSearchTable: TableComponent;
    @ViewChild('messageModal1') public messageModal1;

    public pageId: string = '';
    public controls = [];
    public search: URLSearchParams = new URLSearchParams();
    public itemsPerPage: number = 10;
    public columns: Array<any> = new Array();
    public rowmetadata: Array<any> = new Array();
    public tableheading: string = 'Occupation Search';
    public showMessageHeader: boolean = true;

    public inputParams: any = {
        operation: 'System/iCABSSOccupationSearch',
        module: 'employee',
        method: 'people/search'
    };
    constructor(injector: Injector, private ellipsis: EllipsisComponent) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSOCCUPATIONSEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Occupation Search';
        this.createPage(this.parentMode);
        this.updateTable();
    }

    private createPage(pageparentmode: any): void {
        this.addTableColumns();
        switch (this.ellipsis.childConfigParams['parentMode']) {
            case 'LookUp-Service':
                this.search.set('ServiceEmployeeInd', 'True');
                break;
            case 'LookUp-Sales':
                this.search.set('SalesEmployeeInd', 'True');
                break;
        }
    }


    private addTableColumns(): void {

        this.getTranslatedValue('Type Code', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'OccupationCode' });
            } else {
                this.columns.push({ title: 'Type Code', name: 'OccupationCode', sort: 'ASC' });
            }
        });
        this.getTranslatedValue('Description', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'OccupationDesc' });
            } else {
                this.columns.push({ title: 'Description', name: 'OccupationDesc', sort: 'ASC' });
            }
        });

        if (this.ellipsis.childConfigParams['parentMode'] !== 'LookUp-Service' && this.ellipsis.childConfigParams['parentMode'] !== 'LookUp-Sales') {
            this.getTranslatedValue('Service Employee', null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'ServiceEmployeeInd' });
                    this.rowmetadata.push({ title: res, name: 'ServiceEmployeeInd', type: 'img' });
                } else {
                    this.columns.push({ title: 'Service Employee', name: 'ServiceEmployeeInd' });
                    this.rowmetadata.push({ title: 'Service Employee', name: 'ServiceEmployeeInd', type: 'img' });
                }
            });

            this.getTranslatedValue('Sales Employee', null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'SalesEmployeeInd' });
                    this.rowmetadata.push({ title: res, name: 'SalesEmployeeInd', type: 'img' });
                } else {
                    this.columns.push({ title: 'Sales Employee', name: 'SalesEmployeeInd' });
                    this.rowmetadata.push({ title: 'Sales Employee', name: 'SalesEmployeeInd', type: 'img' });
                }
            });
            this.inputParams.rowmetadata = [];
            this.inputParams.rowmetadata = this.rowmetadata;
            this.inputParams.columns = [];
            this.inputParams.columns = this.columns;
        }
    }

    public updateTable(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.inputParams.search = this.search;
        this.occupationSearchTable.loadTableData(this.inputParams);
    }

    public selectedData(event: any): void {
        let returnObj: any;
        if (this.ellipsis.childConfigParams['parentMode'] === 'LookUp-String') {
            let strOccupations = this.riExchange.getParentHTMLValue('OccupationCodeString');
            if (strOccupations === null || strOccupations === undefined) {
                strOccupations = event.row.OccupationCode;
            }
            else {
                strOccupations = strOccupations + ',' + event.row.OccupationCode;
            }
            this.riExchange.setParentAttributeValue('OccupationCodeString', strOccupations);
            this.ellipsis.sendDataToParent(strOccupations);
        }
        else if (this.ellipsis.childConfigParams['parentMode'] === 'LookUp' || this.ellipsis.childConfigParams['parentMode'] === 'LookUp-Service' || this.ellipsis.childConfigParams['parentMode'] === 'LookUp-Sales') {
            this.riExchange.setParentAttributeValue('OccupationCode', event.row.OccupationCode);
            this.riExchange.setParentAttributeValue('OccupationDesc', event.row.OccupationDesc);
            returnObj = {
                'OccupationCode': event.row.OccupationCode,
                'OccupationDesc': event.row.OccupationDesc
            };
            this.ellipsis.sendDataToParent(returnObj);
        }
        else if (this.ellipsis.childConfigParams['parentMode'] === 'LookUpMultiple') {
            let strOccupations = this.riExchange.getParentHTMLValue('OccupationFilter');
            if (!strOccupations) {
                strOccupations = event.row.OccupationCode;
            }
            else {
                strOccupations = strOccupations + ',' + event.row.OccupationCode;
            }
            this.riExchange.setParentAttributeValue('OccupationFilter', strOccupations);
            returnObj = {
                'OccupationCode': strOccupations
            };
            this.ellipsis.sendDataToParent(returnObj);
        }
        else {
            this.riExchange.setParentAttributeValue('OccupationCode', event.row.OccupationCode);
            this.ellipsis.sendDataToParent(event.row.OccupationCode);
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public refresh(): void {
        this.updateTable();
    }
}

