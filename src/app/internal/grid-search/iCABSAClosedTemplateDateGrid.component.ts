import { Subscription } from 'rxjs/Rx';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, ViewChild, Injector, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { HttpService } from '../../../shared/services/http-service';
import { ServiceConstants } from '../../../shared/constants/service.constants';
import { AjaxConstant } from '../../../shared/constants/AjaxConstants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { MessageService } from '../../../shared/services/message.service';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { GridComponent } from '../../../shared/components/grid/grid';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { GridAdvancedComponent } from '../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from '../../../shared/services/riMaintenancehelper';


@Component({
    templateUrl: 'iCABSAClosedTemplateDateGrid.html'
})
export class ClosedTemplateDateGridComponent extends BaseComponent implements OnInit, OnDestroy {
    //  @ViewChild('closedTemplateDateGrid') closedTemplateDateGrid: GridComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('grdclosedtemplatePagination') grdclosedtemplatePagination: PaginationComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    public pageId: string = '';
    public pageTitle: string = '';

    public controls = [
        { name: 'AnnualCalendarTemplateNumber', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'TemplateName', readonly: true, disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'SelectedYear', readonly: true, disabled: false, required: false }
    ];

    public search: URLSearchParams = new URLSearchParams();
    public headerParams: any = {
        method: 'service-planning/maintenance',
        operation: 'Application/iCABSAClosedTemplateDateGrid',
        module: 'template'
    };
    public showHeader: boolean = true;
    public pageSize: number = 10;
    public curPage: number = 1;
    //public totalItems: number = 10;
    public totalRecords: number = 10;
    public itemsPerPage: number = 12;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public maxColumn: number = 32;
    public legendStr: string = '';
    public selectedYears: any = [];
    public selectedYear: string = new Date().getFullYear().toString();
    public postSearchParams: URLSearchParams = new URLSearchParams();
    public actRowId: string = '0x000000000b1dfb55';
    private lookUpSubscription: Subscription;
    private sub: Subscription;
    private routeParams: any;
    public promptConfirmContent: string;
    public showPromptMessageHeader: boolean = true;
    public showMessageHeader: boolean = true;
    public promptConfirmTitle: string = '';
    public trTemplate: boolean = false;
    public selectedDay: string = '';
    public selectedMonth: string = '';
    public updateCalendar: string = 'false';

    constructor(injector: Injector, public router: Router, private route: ActivatedRoute) {
        super(injector);
        this.pageId = PageIdentifier.ICABSACLOSEDTEMPLATEDATEGRID;
        this.browserTitle = 'Template Calendar';
    }
    ngOnInit(): void {
        this.parentMode = 'URLLINK';
        super.ngOnInit();
        this.pageTitle = 'Closed Template Calendar';
        this.sub = this.route.queryParams.subscribe(
            (params: any) => {
                this.routeParams = params;
            }
        );
        this.window_onload();
        this.buildYears();
    }

    private window_onload(): void {
        //  this.riGrid.HighlightBar = true;
        //this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.FunctionPaging = true;
        /*  if (this.parentMode === 'URLLINK') {
              this.riExchange.riInputElement.SetValue(this.uiForm, 'AnnualCalendarTemplateNumber', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'TemplateNumber'));
          }
          else { */
        this.setControlValue('AnnualCalendarTemplateNumber', this.riExchange.getParentHTMLValue('ClosedCalendarTemplateNumber'));
        this.setControlValue('TemplateName', this.riExchange.getParentHTMLValue('TemplateName'));
        //  }
        this.lookupDetailsFromTemplateNumber();
        // this.initGrid();
    }

    //=Start: Grid functionality
    public initGrid(): void {
        this.riGrid.DefaultBorderColor = 'DDDDDD';
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.riGrid.FixedWidth = true;
        this.buildGrid();
        this.riGrid_BeforeExecute();
        this.riGrid.HidePageNumber = true;
    }
    public buildGrid(): void {
        let iLoop: number = 1;
        this.riGrid.Clear();
        this.riGrid.AddColumn('Month', 'Visit', 'Month', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('Month', MntConst.eAlignmentLeft);
        for (iLoop = 1; iLoop <= 31; iLoop++) {
            this.riGrid.AddColumn(iLoop.toString(), 'Visit', iLoop.toString(), MntConst.eTypeText, 1);
            this.riGrid.AddColumnAlign(iLoop.toString(), MntConst.eAlignmentCenter);
        }
        this.riGrid.Complete();
    }

    public riGrid_BeforeExecute(): void {
        let search: URLSearchParams = this.getURLSearchParamObject(), sortOrder: any = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        search.set(this.serviceConstants.Action, '2');
        search.set(this.serviceConstants.GridMode, '0');
        search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        search.set(this.serviceConstants.GridPageSize, this.pageSize.toString());
        search.set(this.serviceConstants.GridPageCurrent, this.curPage.toString());
        search.set('riSortOrder', sortOrder);
        search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        search.set('LanguageCode', this.riExchange.LanguageCode());
        search.set('riCacheRefresh', 'True');

        search.set('ACTRowID', this.actRowId);
        search.set('SelectedDay', this.selectedDay);
        search.set('SelectedMonth', this.selectedMonth);
        search.set('SelectedYear', this.selectedYear);
        search.set('UpdateCalendar', this.updateCalendar);

        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.messageModal.show(data, true);
                } else {
                    this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.ResetGrid();
                    this.riGrid.Execute(data);
                    this.legendStr = data.body.cells[0].additionalData;

                }
                this.isRequesting = false;
            },
            (error) => {
                this.messageModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public onGridSuccess(): void {
        let currentMonth: number = (new Date()).getMonth() + 1;
        document.querySelector('.gridtable tbody > tr:nth-child(' + currentMonth.toString() + ')').setAttribute('class', 'currentMonth');
    }
    public riGrid_BodyOnKeyDown(evt: any): void {
        //toto
    }

    public getCurrentPage(data: any): void {
        this.curPage = data.value;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    }


    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }
    public riGrid_Sort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public tbody_onDblClick(event: any): void {
        let currentRowIndex = this.riGrid.CurrentRow;
        let currentCellIndex = this.riGrid.CurrentCell;
        let cellData = this.riGrid.bodyArray[currentRowIndex][currentCellIndex];
        let date: any = null;
        if (event.srcElement.getAttribute('type') !== 'text') {
            if (event.srcElement.innerHTML === 'X') {
                date = event.srcElement.parentElement.getAttribute('name');
            } else {
                date = event.srcElement.getAttribute('name');
            }
            let month = event.srcElement.getAttribute('additionalproperty');
            if (month <= 0) {
                month = event.srcElement.parentElement.getElementsByTagName('td')[0].getAttribute('rowid').split(' ')[0];
            }
            this.selectedDay = date;
            this.selectedMonth = month;
            this.updateCalendar = 'true';
            this.riGrid_BeforeExecute();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        this.lookUpSubscription.unsubscribe();
    }

    private buildYears(): void {
        let startYear: number = new Date().getFullYear() - 5;
        let yearStr: string = '';
        for (let i = 1; i <= 7; i++) {
            yearStr = (startYear + i).toString();
            this.selectedYears.push({ value: yearStr });
        }
    }

    public getCurrentPage1(currentPage: any): void {
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.buildGrid();
    }

    public getGridInfo(gridData: any): void {
        try {
            this.legendStr = gridData.gridData.body.cells[0].additionalData;
        } catch (e) { return; }


    }

    public saveTemplate(isAbandon?: boolean): void {
        let _formData: Object = {};
        let _confirmMessage = '';

        _formData['ClosedCalendarTemplateNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'AnnualCalendarTemplateNumber');
        if (isAbandon) {
            _formData['Function'] = 'Abandon';
        } else {
            _formData['Function'] = 'Save';
        }
        _formData['SelectedYear'] = this.selectedYear;
        _formData['ACTRowID'] = this.actRowId;
        this.postSearchParams.set(this.serviceConstants.Action, '6');
        _confirmMessage = MessageConstant.Message.SavedSuccessfully;
        this.postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());


        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.postSearchParams, _formData)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                        this.errorService.emitError(e['oResponse']);
                    } else if (e['errorMessage']) {
                        this.errorService.emitError(e);
                    } else {
                        //  if (!isAbandon) {
                        this.messageModal.show({ msg: _confirmMessage, title: 'Message' }, false);
                        e['msg'] = _confirmMessage;
                        this.location.back();
                        // }
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private lookupDetailsFromTemplateNumber(): void {
        let lookupIP = [
            {
                'table': 'ClosedCalendarTemplate',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ClosedCalendarTemplateNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'AnnualCalendarTemplateNumber')
                },
                'fields': ['TemplateName', 'OwnerBranchNumber', 'PremiseSpecificInd', 'PremiseSpecificText']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            this.actRowId = data[0][0].ttClosedCalendarTemplate;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'TemplateName', data[0][0].TemplateName);
            // this.buildGrid();
            this.initGrid();
        });
    }

    public onSave(): void {
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        this.promptConfirmModal.show();
    }

    public onCancel(): void {
        this.saveTemplate(true);
    }

    public promptConfirm(event: any): void {
        if (event) {
            this.saveTemplate();
        }
    }

    public promptCancel(event: any): void {
        //todo
    }

    public onGridRowDblClick(event: any): void {
        //todo
    }

    public onGridRowClick(event: any): void {
        //todo
    }
    public onMessageClose(): void {
        //todo
    }

}
