import { URLSearchParams } from '@angular/http';
import { Component, OnInit, OnDestroy, Injector, ViewChild, Input, AfterViewInit } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { CalendarTemplateSearchComponent } from './../../internal/search/iCABSBCalendarTemplateSearch.component';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
@Component({
    templateUrl: 'iCABSACalendarTemplateBranchAccessGrid.html',
    styles: [`
    :host /deep/ .gridtable tbody tr td:nth-child(1){
        width: 30%;
    }
    :host /deep/ .gridtable tbody tr td:nth-child(1) div {
        display: inline-block;
        width: 50%;
        text-align: center;
    }
    :host /deep/ .gridtable tbody tr td:nth-child(1) input,
    :host /deep/ .gridtable tbody tr td:nth-child(3){
        text-align: center;
    }
    :host /deep/ .gridtable tbody tr td:nth-child(2){
        text-align: left;
    }
    :host /deep/ .gridtable tbody tr td:nth-child(1) span{
        background-color: #fff;
        display: inline-block;
        text-align: center;
        height: 27px;
        font-size: 16px;
        line-height: 26px;
        padding: 0 0.5em;
        border-radius: 2px; 
        border: 1px solid #999;
        box-shadow: inset 0 1px 1px rgba(0,0,0,0.05);
        width:100%
    }
  `]
})

export class CalendarTemplateBranchAccessGridComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('calendarTemplateBranchAccessGrid') calendarTemplateBranchAccessGrid: GridComponent;
    @ViewChild('calendarTemplateBranchAccessGridPagination') calendarTemplateBranchAccessGridPagination: PaginationComponent;
    @ViewChild('CalendarTemplateEllipsis') CalendarTemplateEllipsis: EllipsisComponent;
    public CalendarTemplateSearchComponent = CalendarTemplateSearchComponent;
    public search: URLSearchParams;
    public inputParams: any = {};
    public pageId: string = '';
    public pageTitle: string = '';
    public itemsPerPage: number = 10;
    public totalRecords: number = 10;
    public currentPage: number = 1;
    public maxColumn: number = 3;
    public gridSortHeaders: Array<any> = [];
    public ellipsisDiable: boolean = false;
    public autoOpenSearch: boolean = false;
    public headerClickedColumn: string = '';
    public riSortOrder: string = '';
    public method: string = 'service-planning/maintenance';
    public module: string = 'template';
    public operation: string = 'Application/iCABSACalendarTemplateBranchAccessGrid';
    public controls = [
        { name: 'AnnualCalendarTemplateNumber', required: true, type: MntConst.eTypeInteger },
        { name: 'TemplateName', disabled: true, type: MntConst.eTypeText },
        { name: 'OwnerBranchNumber', disabled: true, type: MntConst.eTypeInteger },
        { name: 'BranchName', disabled: true, type: MntConst.eTypeText }
    ];
    public validateProperties: Array<any> = [
        {
            'type': MntConst.eTypeInteger,
            'index': 0
        }, {
            'type': MntConst.eTypeText,
            'index': 1
        }, {
            'type': MntConst.eTypeImage,
            'index': 2
        }
    ];
    public inputParamsCalendarTemplate: any = {
        'parentMode': 'LookUp-AllAccessCalendar'
    };
    public formModel: any = {};

    constructor(injector: Injector) {
        super(injector);
        this.pageTitle = 'Branch Calendar Template';
        this.browserTitle = 'Branch Calendar Access';
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.pageId = PageIdentifier.ICABSACALENDARTEMPLATEBRANCHACCESSGRID;
        this.checkParent();
    }
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public checkParent(): void {
        switch (this.parentMode) {
            case 'CalendarTemplate':
                this.setControlValue('AnnualCalendarTemplateNumber', this.riExchange.getParentHTMLValue('AnnualCalendarTemplateNumber'));
                this.fetchData(this.riExchange.getParentHTMLValue('AnnualCalendarTemplateNumber'));
                this.riExchange.riInputElement.Disable(this.uiForm, 'AnnualCalendarTemplateNumber');
                this.ellipsisDiable = true;
                this.buildGrid();
                break;
            default:
                document.getElementById('AnnualCalendarTemplateNumber').focus();
                break;
        };
    };
    public ngAfterViewInit(): void {
        this.autoOpenSearch = true;
        let branchNumber: any = {
            'fieldName': 'BranchNumber',
            'index': 0,
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(branchNumber);
    }
    public refresh(): void {
        // this.currentPage = this.currentPage;
        this.buildGrid();
    }
    public buildGrid(): void {
        let date: any = new Date();
        this.search = this.getURLSearchParamObject();
        this.search.set('AnnualCalendarTemplateNumber', this.getControlValue('AnnualCalendarTemplateNumber'));
        this.search.set(this.serviceConstants.GridPageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.GridPageCurrent, this.currentPage.toString());
        this.search.set('maxColumn', this.maxColumn.toString());
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, this.utils.gridHandle);
        this.search.set(this.serviceConstants.GridCacheRefresh, 'true');
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClickedColumn);
        this.search.set(this.serviceConstants.GridSortOrder, this.riSortOrder);
        this.search.set('DTE', this.utils.formatDate(date));
        this.search.set('TME', date.getTime());
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;
        this.inputParams.search = this.search;
        this.calendarTemplateBranchAccessGrid.loadGridData(this.inputParams);
    }

    public gridOnDblClick(event: any): void {
        if (event.cellIndex === 2) {
            this.search = this.getURLSearchParamObject();
            this.search.set('AnnualCalendarTemplateNumber', this.getControlValue('AnnualCalendarTemplateNumber'));
            this.search.set('BranchNumber', event.trRowData[0].text);
            this.search.set(this.serviceConstants.Action, '6');
            let postObj: any = {};
            postObj.Function = 'ToggleAccess';
            postObj.BranchCalendarTemplateRowID = event.trRowData[0].rowID;
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, postObj)
                .subscribe(
                (e) => {
                    if (e.hasError) {
                        this.errorService.emitError(e);
                    } else {
                        this.buildGrid();
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.errorService.emitError(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }
    public getGridInfo(info: any): void {
        this.calendarTemplateBranchAccessGridPagination.totalItems = info.totalRows;
    }
    public sortGrid(data: any): void {
        this.headerClickedColumn = data.fieldname;
        this.riSortOrder = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGrid();
    }
    public getCurrentPage(currentPage: any): void {
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.buildGrid();
    }

    public onCalendarTemplateDataReturn(data: any): void {
        if (data) {
            this.setControlValue('AnnualCalendarTemplateNumber', data['AnnualCalendarTemplateNumber']);
            this.fetchData(data['AnnualCalendarTemplateNumber']);
        }
    }
    public templateNumberChange(value: any): void {
        this.fetchData(value);
    }
    public fetchData(num: any): void {
        this.search = this.getURLSearchParamObject();
        this.search.set('AnnualCalendarTemplateNumber', num);
        this.search.set(this.serviceConstants.Action, '6');

        let postObj: any = {};
        postObj.Function = 'SetDisplayFields';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, postObj)
            .subscribe(
            (e) => {
                if (e.hasError) {
                    this.errorService.emitError(e);
                } else {
                    this.setControlValue('TemplateName', e['TemplateName']);
                    this.setControlValue('OwnerBranchNumber', e['OwnerBranchNumber']);
                    this.setControlValue('BranchName', e['BranchName']);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }
}
