import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSCMAccountReviewGrid.html'
})
export class AccountReviewGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riGridPagination') riGridPagination: PaginationComponent;

    public controls: any[] = [
        { name: 'FromDateSelect', required: true, type: MntConst.eTypeDate },
        { name: 'ToDateSelect', required: true, type: MntConst.eTypeDate }
    ];

    public queryParams: any = {
        operation: 'ContactManagement/iCABSCMAccountReviewGrid',
        module: 'account-review',
        method: 'ccm/maintenance'
    };

    public gridParams: any = {
        totalRecords: 0,
        itemsPerPage: 10,
        currentPage: 1,
        pageCurrent: 1,
        riGridMode: 0
    };

    public pageId: string = '';
    public batchProcessInformation: string = '';
    public isHidePagination: boolean = true;

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMACCOUNTREVIEWGRID;
        this.browserTitle = this.pageTitle = 'Account Review';
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.pageParams.fromDate = this.globalize.parseDateStringToDate(this.getControlValue('FromDateSelect'));
            this.pageParams.toDate = this.globalize.parseDateStringToDate(this.getControlValue('ToDateSelect'));
        } else {
            this.windowOnload();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public windowOnload(): void {
        let getDateFrom: any, getDateTo: any;

        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.pageParams.isReportDisabled = false;
        this.pageParams.isBatchProcessInformation = false;
        getDateFrom = this.globalize.parseDateToFixedFormat(new Date(new Date().getFullYear(), 0, 1)).toString();
        this.pageParams.fromDate = this.globalize.parseDateStringToDate(getDateFrom);
        getDateTo = this.globalize.parseDateToFixedFormat(new Date()).toString();
        this.pageParams.toDate = this.globalize.parseDateStringToDate(getDateTo);
        this.setControlValue('FromDateSelect', this.globalize.parseDateToFixedFormat(this.pageParams.fromDate));
        this.setControlValue('ToDateSelect', this.globalize.parseDateToFixedFormat(this.pageParams.toDate));
        this.buildGrid();
    }

    public buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('ReportNumber', 'AccountReview', 'ReportNumber', MntConst.eTypeInteger, 15, true, 'Report Number');
        this.riGrid.AddColumn('ReportDate', 'AccountReview', 'ReportDate', MntConst.eTypeDate, 10, false, 'Generated Date');
        this.riGrid.AddColumn('FromDateCol', 'AccountReview', 'FromDateCol', MntConst.eTypeDate, 10, false, 'From Date');
        this.riGrid.AddColumn('ToDateCol', 'AccountReview', 'ToDateCol', MntConst.eTypeDate, 10, false, 'To Date');
        this.riGrid.AddColumnAlign('ReportNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ReportDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('FromDateCol', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ToDateCol', MntConst.eAlignmentCenter);
        this.riGrid.Complete();
        this.riGrid.RefreshRequired();
        this.loadGridData();
    }

    public loadGridData(): void {
        let search: URLSearchParams;

        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateHeader = true;
        search = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '2');
        search.set('FromDateSelect', this.getControlValue('FromDateSelect'));
        search.set('ToDateSelect', this.getControlValue('ToDateSelect'));
        search.set('ReportType', 'ACCOUNTREVIEW');
        search.set('SubmitBatchProcess', 'No');
        search.set(this.serviceConstants.GridMode, this.gridParams.riGridMode);
        search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        search.set(this.serviceConstants.PageSize, this.gridParams.itemsPerPage);
        search.set(this.serviceConstants.PageCurrent, this.gridParams.pageCurrent);
        search.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        search.set(this.serviceConstants.GridSortOrder, this.riGrid.SortOrder);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.gridParams.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                    this.gridParams.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.gridParams.itemsPerPage : 1;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateFooter = true;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.Execute(data);
                    if (data.pageData && (data.pageData.lastPageNumber * 10) > 0)
                        this.isHidePagination = false;
                    else
                        this.isHidePagination = true;
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public submitReport(): void {
        let formdata: Object = {}, search: URLSearchParams;

        if (!this.riExchange.riInputElement.isError(this.uiForm, 'FromDateSelect') && !this.riExchange.riInputElement.isError(this.uiForm, 'ToDateSelect')) {
            search = this.getURLSearchParamObject();
            search.set(this.serviceConstants.Action, '0');
            search.set('ReportType', 'ACCOUNTREVIEW');
            search.set('SubmitBatchProcess', 'Yes');
            formdata['FromDateSelect'] = this.getControlValue('FromDateSelect');
            formdata['ToDateSelect'] = this.getControlValue('ToDateSelect');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formdata)
                .subscribe(
                (res) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (res.hasError)
                        this.modalAdvService.emitError(new ICabsModalVO(res.errorMessage, res.fullError));
                    else {
                        this.pageParams.isSubmitDisabled = true;
                        this.pageParams.isReportDisabled = true;
                        this.pageParams.isBatchProcessInformation = true;
                        this.batchProcessInformation = res.BatchProcessInformation;
                        this.refresh();
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        }
    }

    public onGridDblClick(data: any): void {
        this.reportNumberFocus(data.srcElement);
        if (this.riGrid.CurrentColumnName === 'ReportNumber')
            this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
    }

    public reportNumberFocus(rsrcElement: any): void {
        let oTR: any = rsrcElement.parentElement.parentElement;
        this.setAttribute('ROWID', oTR.children[0].children[0].getAttribute('rowid'));
        this.setAttribute('DateFrom', this.riGrid.Details.GetValue('FromDateCol'));
        this.setAttribute('DateTo', this.riGrid.Details.GetValue('ToDateCol'));
        oTR.focus();
    }

    public getCurrentPage(currentPage: any): void {
        this.gridParams.pageCurrent = currentPage.value;
        this.riGrid.RefreshRequired();
        this.buildGrid();
    }

    public refresh(): void {
        this.buildGrid();
        this.riGrid.RefreshRequired();
    }

    public dateToSelectedValue(value: any): void {
        if (value && value.value)
            this.setControlValue('ToDateSelect', value.value);
        else
            this.setControlValue('ToDateSelect', '');
    }

    public dateFromSelectedValue(value: any): void {
        if (value && value.value)
            this.setControlValue('FromDateSelect', value.value);
        else
            this.setControlValue('FromDateSelect', '');
    }
}
