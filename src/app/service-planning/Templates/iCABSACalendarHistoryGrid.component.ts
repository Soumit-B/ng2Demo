import { BaseComponent } from '../../base/BaseComponent';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { URLSearchParams } from '@angular/http';
import { CalendarTemplateSearchComponent } from './../../internal/search/iCABSBCalendarTemplateSearch.component';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSACalendarHistoryGrid.html',
    styles: [`
    :host /deep/ .gridtable thead tr th:nth-child(1) {
        width: 8%;
    }
    :host /deep/ .gridtable thead tr th:nth-child(2) {
        width: 12%;
    }
    :host /deep/ .gridtable tbody tr td:nth-child(3) span {
        text-transform: uppercase;
    }
    :host /deep/ .gridtable tbody tr td:nth-child(1) input {
        text-align: center;
    }
  `]
})

export class CalendarHistoryGridComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('errorModal') public errorModal;
    public maxColumn: number = 6;
    public itemsPerPage: number = 14;
    public pageCurrent: number = 1;
    public totalItems: number = 14;
    public pageId: string = '';
    public method: string = 'service-planning/grid';
    public module: string = 'template';
    public operation: string = 'Application/iCABSACalendarHistoryGrid';
    public search: URLSearchParams;
    public inputParams: any = {};
    public pageTitle: string = '';
    public headerClicked: string = '';
    public sortType: string = '';
    public autoOpen: boolean;
    public calendertemplate: CalendarTemplateSearchComponent;
    public ellipsisConfig = {
        calenderTemplateSelect: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            childParams: {
                'parentMode': 'LookUp-AllAccessCalendar',
                'BranchNumber': ''
            },
            showAddNew: false,
            component: CalendarTemplateSearchComponent
        }
    };
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public gridSortHeaders: Array<any> = [
        {
            'fieldName': 'DateStamp',
            'index': 0,
            'sortType': 'ASC'
        },
        {
            'fieldName': 'CalendarYear',
            'index': 3,
            'sortType': 'ASC'
        }
    ];
    public validateProperties: Array<any> = [
        {
            'type': MntConst.eTypeDate,
            'index': 0
        },
        {
            'type': MntConst.eTypeText,
            'index': 1
        },
        {
            'type': MntConst.eTypeCode,
            'index': 2
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 3
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': 4
        },
        {
            'type': MntConst.eTypeImage,
            'index': 5
        }];

    public controls = [
        { name: 'BranchNumber', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'BranchName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'AnnualCalendarTemplateNumber', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'TemplateName', readonly: false, disabled: true, required: false, type: MntConst.eTypeText }
    ];
    @ViewChild('calenderHistoryCodeGrid') postCodeGrid: GridComponent;
    @ViewChild('calenderHistoryPagination') postCodePagination: PaginationComponent;
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSACALENDARHISTORYGRID;
        this.pageTitle = this.browserTitle = 'Calendar Template History';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.inputParams.method = this.method;
        this.inputParams.module = this.module;
        this.inputParams.operation = this.operation;
        this.windows_onLoad();
    }

    public ngAfterViewInit(): void {
        if (this.parentMode !== 'CalendarTemplate')
            this.autoOpen = true;
    }

    private windows_onLoad(): void {
        this.setControlValue('BranchNumber', this.utils.getBranchCode());
        this.setControlValue('BranchName', this.utils.getBranchText());
        //   this.ellipsisConfig.calenderTemplateSelect.childParams['BranchNumber'] = this.utils.getBranchCode();
        //   this.ellipsisConfig.calenderTemplateSelect.childParams['parentMode'] = 'LookUp';
        switch (this.parentMode) {
            case 'CalendarTemplate':
                this.ellipsisConfig.calenderTemplateSelect.disabled = true;
                this.setControlValue('AnnualCalendarTemplateNumber', this.riExchange.getParentHTMLValue('AnnualCalendarTemplateNumber'));
                this.setControlValue('TemplateName', this.riExchange.getParentHTMLValue('TemplateName'));
                this.setControlValue('BranchNumber', this.riExchange.getParentHTMLValue('OwnerBranchNumber'));
                this.setControlValue('BranchName', this.riExchange.getParentHTMLValue('BranchName'));
                break;
        }
        this.buildGrid();

    }

    public ellipsisData_Select(data: any): void {
        this.setControlValue('AnnualCalendarTemplateNumber', data.AnnualCalendarTemplateNumber);
        this.setControlValue('TemplateName', data.TemplateName);

    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private buildGrid(): void {
        this.loadData(this.inputParams);
    }

    public AnnualCalendarTemplateNumber_onchange(event: any): void {
        if (event.target.value !== '') {
            this.search = this.getURLSearchParamObject();
            this.search.set(this.serviceConstants.Action, '6');
            this.inputParams.search = this.search;
            let formdata: Object = {};
            formdata['Function'] = 'SetDisplayFields';
            formdata['AnnualCalendarTemplateNumber'] = this.getControlValue('AnnualCalendarTemplateNumber');
            this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
                .subscribe(
                (data) => {
                    this.setControlValue('TemplateName', data.TemplateName);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                },
                (error) => {
                    if (error.errorMessage) {
                        this.errorModal.show(error, true);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }

    public onDblClick(data: any): void {
        switch (data.cellIndex) {
            case 5:
                if (data.cellData.additionalData === '<Clickable>') {
                    this.setControlValue('HistoryRowID', data.cellData.rowID);
                    //  this.navigate('','Application/iCABSACalendarHistoryDetail.htm');
                    this.errorModal.show({ msg: MessageConstant.Message.PageNotDeveloped }, false);
                }
                break;
        }
    }

    public loadData(params: any): void {
        this.search = this.getURLSearchParamObject();
        this.search.set('BranchNumber', this.getControlValue('BranchNumber'));
        this.search.set('AnnualCalendarTemplateNumber', this.getControlValue('AnnualCalendarTemplateNumber'));
        this.search.set('PageSize', this.itemsPerPage.toString());
        this.search.set('PageCurrent', this.pageCurrent.toString());
        this.search.set(this.serviceConstants.Action, '1');
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClicked);
        this.search.set(this.serviceConstants.GridSortOrder, this.sortType);
        this.inputParams.search = this.search;
        this.postCodeGrid.loadGridData(this.inputParams);

    }

    public getGridInfo(info: any): void {
        this.postCodePagination.totalItems = info.totalRows;
    }
    public getCurrentPage(event: any): void {
        this.pageCurrent = event.value;
        this.buildGrid();
    }

    public refresh(event: any): void {
        this.loadData(this.inputParams);
    }

    public sortGrid(data: any): void {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort !== 'DESC' ? 'Descending' : 'Ascending';
        this.loadData({});
    }

}
