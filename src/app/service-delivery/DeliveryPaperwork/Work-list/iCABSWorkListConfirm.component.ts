import * as moment from 'moment';
import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { ICabsModalVO } from '../../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from '../../../../shared/services/riMaintenancehelper';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';
import { GridAdvancedComponent } from '../../../../shared/components/grid-advanced/grid-advanced';
import { URLSearchParams } from '@angular/http';
import { AjaxConstant } from '../../../../shared/constants/AjaxConstants';
import { InternalMaintenanceServiceModuleRoutes } from './../../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSWorkListConfirm.html'
})

export class WorkListConfirmComponent extends BaseComponent implements OnInit {

    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riGridPagination') riGridPagination: PaginationComponent;
    public pageId: string = '';
    public controls = [
        { name: 'BranchNumber', readonly: false, disabled: true, required: true },
        { name: 'DateFrom', readonly: true, disabled: true, required: false, type: MntConst.eTypeDate },
        { name: 'DateTo', readonly: true, disabled: true, required: false, type: MntConst.eTypeDate }
    ];
    public isRequesting: boolean = false;
    public formData: any = {};
    public searchParams: URLSearchParams = new URLSearchParams();
    public vEndofWeekDay: number;
    public vEndofWeekDate: Date;
    public vReportName: string = 'iCABSServiceDocket.rep';
    public vPrintDocket: number;
    public queryParams: any = {
        operation: 'Service/iCABSWorkListConfirm',
        module: 'manual-service',
        method: 'service-delivery/maintenance'
    };
    public gridSearch: URLSearchParams = new URLSearchParams();

    public gridConfig = {
        pageSize: 10,
        currentPage: 1,
        totalRecords: 1,
        action: '2'
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSWORKLISTCONFIRM;
        this.browserTitle = 'Generate Service Listing';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.getSystemParameters();
    }

    public getSystemParameters(): void {
        let lookUpSys = [{
            'table': 'SystemParameter',
            'query': {},
            'fields': ['SystemParameterEndOfWeekDay']
        }];
        this.isRequesting = true;
        this.LookUp.lookUpRecord(lookUpSys).subscribe((data) => {
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                this.isRequesting = false;
            } else {
                if (data[0][0].SystemParameterEndOfWeekDay < 7) {
                    this.vEndofWeekDay = data[0][0].SystemParameterEndOfWeekDay;
                } else {
                    this.vEndofWeekDay = 1;
                }
                let today = new Date();
                this.vEndofWeekDate = this.utils.addDays(today, ((7 - today.getDay()) + this.vEndofWeekDay - 1));
                let tempDate = this.vEndofWeekDate.toString();
                tempDate = (this.globalize.parseDateStringToDate(tempDate)).toString();
                this.vEndofWeekDate = new Date(tempDate);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
                if (this.isReturning()) {
                    this.populateUIFromFormData();
                    this.BuildGrid();
                } else {
                    this.window_onload();
                }
            }
        });
    }

    public window_onload(): void {
        this.setControlValue('BranchNumber', this.utils.getBranchText());
        if (this.parentMode === 'ServicePlanning') {
            this.setControlValue('BranchNumber', this.riExchange.getParentHTMLValue('BranchNumber'));
            this.setControlValue('DateFrom', this.riExchange.getParentHTMLValue('DateFrom'));
            this.setControlValue('DateTo', this.riExchange.getParentHTMLValue('DateTo'));
        } else {
            let tempDtFrom: Date = this.utils.addDays(this.vEndofWeekDate, 1);
            this.setControlValue('DateFrom', tempDtFrom);
            let tempDtTo = this.utils.addDays(tempDtFrom, 6);
            this.setControlValue('DateTo', tempDtTo);
        }
        this.BuildGrid();
    }

    public BuildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.riGrid.HighlightBar = true;

        this.riGrid.AddColumn('EmployeeCode', 'PlanVisit', 'EmployeeCode', MntConst.eTypeText, 6);
        this.riGrid.AddColumnAlign('EmployeeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('EmployeeSurname', 'PlanVisit', 'EmployeeSurname', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('EmployeeSurname', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServicePlanNumbers', 'PlanVisit', 'ServicePlanNumbers', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('FromDate', 'PlanVisit', 'FromDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('FromDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ToDate', 'PlanVisit', 'ToDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ToDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('NumberOfPremises', 'PlanVisit', 'NumberOfPremises', MntConst.eTypeInteger, 8);
        this.riGrid.AddColumnAlign('NumberOfPremises', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('NumberOfServiceCovers', 'PlanVisit', 'NumberOfServiceCovers', MntConst.eTypeInteger, 8);
        this.riGrid.AddColumnAlign('NumberOfServiceCovers', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('WorkDuration', 'PlanVisit', 'WorkDuration', MntConst.eTypeTime, 5);
        this.riGrid.AddColumnAlign('WorkDuration', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('WorkCost', 'PlanVisit', 'WorkCost', MntConst.eTypeCurrency, 10);
        this.riGrid.AddColumnAlign('WorkCost', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('PrintImage', 'PlanVisit', 'PrintImage', MntConst.eTypeImage, 1, true);
        this.riGrid.AddColumnAlign('PrintImage', MntConst.eAlignmentCenter);
        if (this.vPrintDocket > 22) {
            this.riGrid.AddColumn('PrintImage1', 'PlanVisit', 'PrintImage1', MntConst.eTypeImage, 1, true);
            this.riGrid.AddColumnAlign('PrintImage1', MntConst.eAlignmentCenter);
        }
        this.riGrid.Complete();
    }

    public populateGrid(): void {
        this.gridSearch = this.getURLSearchParamObject();
        this.gridSearch.set('BranchNumber', this.utils.getBranchCode());
        this.gridSearch.set('DateFrom', this.globalize.parseDateToFixedFormat(this.getControlValue('DateFrom')).toString());
        this.gridSearch.set('DateTo', this.globalize.parseDateToFixedFormat(this.getControlValue('DateTo')).toString());
        this.gridSearch.set('LanguageCode', this.riExchange.LanguageCode());
        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.gridSearch.set(this.serviceConstants.GridMode, '0');
        this.gridSearch.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        this.gridSearch.set(this.serviceConstants.PageSize, this.gridConfig.pageSize.toString());
        this.gridSearch.set(this.serviceConstants.PageCurrent, this.gridConfig.currentPage.toString());
        this.gridSearch.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        this.gridSearch.set(this.serviceConstants.GridSortOrder, sortOrder);
        this.gridSearch.set(this.serviceConstants.Action, this.gridConfig.action.toString());
        this.gridSearch.set(this.serviceConstants.GridCacheRefresh, 'True');
        if (this.riGrid.Update) {
            this.gridSearch.set('EmployeeCode', this.getAttribute('EmployeeCode'));
            this.riGrid.StartRow = this.getAttribute('Row');
            this.riGrid.StartColumn = 0;
            this.riGrid.RowID = this.getAttribute('UniqueNumber');
            this.riGrid.UpdateHeader = false;
            this.riGrid.UpdateBody = true;
            this.riGrid.UpdateFooter = false;
        }
        this.ajaxSource.next(AjaxConstant.START);
        this.isRequesting = true;
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.gridSearch)
            .subscribe(
            (e) => {
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage));
                    this.isRequesting = false;
                } else {
                    this.isRequesting = false;
                    this.riGrid.RefreshRequired();
                    this.riGridPagination.currentPage = this.gridConfig.currentPage = e.pageData ? e.pageData.pageNumber : 1;
                    this.riGridPagination.totalItems = this.gridConfig.totalRecords = e.pageData ? e.pageData.lastPageNumber * this.gridConfig.pageSize : 1;
                    this.riGrid.Execute(e);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            });
    }

    public riGrid_BodyOnClick(event: Event): void {
        this.SelectedRowFocus(event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
    }

    public SelectedRowFocus(rsrcElement: any): void {
        this.setAttribute('Row', rsrcElement.parentElement.parentElement.parentElement.sectionRowIndex);
        this.setAttribute('Cell', rsrcElement.parentElement.parentElement.cellIndex);
        this.setAttribute('RowID', rsrcElement.getAttribute('RowID'));
        rsrcElement.focus();
        let oTR = rsrcElement.parentElement.parentElement.parentElement;
        this.setAttribute('EmployeeCode', oTR.children[0].children[0].children[0].value);
        this.setAttribute('EmployeeSurname', oTR.children[1].children[0].children[0].value);
    }

    public riGrid_BodyOnDblClick(event: any): void {
        switch (this.riGrid.CurrentColumnName) {
            case 'EmployeeCode':
                this.SelectedRowFocus(event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
                this.setAttribute('UniqueNumber', event.srcElement.RowID);
                this.navigate('WorkListConfirm', InternalMaintenanceServiceModuleRoutes.ICABSWORKLISTCONFIRMSUBMIT);
                break;
            case 'PrintImage':
                if (this.riGrid.Details.GetValue('PrintImage') !== '') {
                    this.populateFormData();
                    this.formData['Function'] = 'PrintReport';
                    this.ajaxSource.next(AjaxConstant.START);
                    this.isRequesting = true;
                    this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.searchParams, this.formData).subscribe(
                        (e) => {
                            this.ajaxSource.next(AjaxConstant.COMPLETE);
                            if (e.status === 'failure') {
                                this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage));
                                this.isRequesting = false;
                            } else {
                                this.isRequesting = false;
                                window.open(e.fullError, '_blank');
                            }
                            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        },
                        (error) => {
                            this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage));
                            this.ajaxSource.next(AjaxConstant.COMPLETE);
                            this.isRequesting = false;
                        });
                }
                break;
            case 'PrintImage1':
                if (this.riGrid.Details.GetValue('PrintImage1') !== '') {
                    this.populateFormData();
                    this.formData['Function'] = 'PrintReport1';
                    this.ajaxSource.next(AjaxConstant.START);
                    this.isRequesting = true;
                    this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.searchParams, this.formData).subscribe(
                        (e) => {
                            this.ajaxSource.next(AjaxConstant.COMPLETE);
                            if (e.status === 'failure') {
                                this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage));
                                this.isRequesting = false;
                            } else {
                                this.isRequesting = false;
                                window.open(e.fullError, '_blank');
                            }
                            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        },
                        (error) => {
                            this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage));
                            this.ajaxSource.next(AjaxConstant.COMPLETE);
                            this.isRequesting = false;
                        });
                    break;
                }
        }
    }

    public populateFormData(): void {
        this.formData['BranchNumber'] = this.utils.getBranchCode();
        this.formData['DateFrom'] = this.getControlValue('DateFrom');
        this.formData['DateTo'] = this.getControlValue('DateTo');
        this.formData['EmployeeCode'] = this.riGrid.Details.GetValue('EmployeeCode');
        this.formData['ReportNumber'] = this.getAttribute('RowID');
        this.searchParams = this.getURLSearchParamObject();
        this.searchParams.set(this.serviceConstants.Action, '6');
    }

    public riGrid_BodyOnKeyDown(event: any): void {
        switch (event.keyCode) {
            case 13:
                this.detail();
                break;
            case 38:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.previousSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.SelectedRowFocus(event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }

                }
                break;
            case 40:
            case 9:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.nextSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.SelectedRowFocus(event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }
                }
                break;
        }
    }

    public detail(): void {
        if (this.riGrid.CurrentColumnName === 'EmployeeCode') {
            this.navigate('Detail', '/contractmanagement/maintenance/contract', {
                CurrentContractType: this.pageParams.CurrentContractType,
                parentMode: 'Detail'
            });//Application/iCABSAContractMaintenance.htm
        }
    }

    @HostListener('document:keydown', ['$event']) document_onkeydown(ev: any): void {
        //let dtFrom = new Date(this.getControlValue('DateFrom'));
        let dtFrom = this.getControlValue('DateFrom');
        let dtTo = this.getControlValue('DateTo');
        switch (ev.keyCode) {

            case 106:
                let datetFrom: Date = this.addDays(this.vEndofWeekDate, 1);
                let dateTo: Date = this.addDays(this.vEndofWeekDate, 7);
                this.setControlValue('DateFrom', datetFrom);
                this.setControlValue('DateTo', dateTo);
                this.riGrid.RefreshRequired();
                break;
            case 107:
                dtFrom = this.addDays(dtFrom, 7);
                dtTo = this.addDays(dtTo, 7);
                this.setControlValue('DateFrom', dtFrom);
                this.setControlValue('DateTo', dtTo);
                this.riGrid.RefreshRequired();
                break;
            case 109:
                dtFrom = this.addDays(dtFrom, -7);
                dtTo = this.addDays(dtTo, -7);
                this.setControlValue('DateFrom', dtFrom);
                this.setControlValue('DateTo', dtTo);
                this.riGrid.RefreshRequired();
                break;
        }
    }

    public DateFrom_onchange(): void {
        this.riGrid.RefreshRequired();
    }

    public DateTo_onchange(): void {
        this.riGrid.RefreshRequired();
    }

    public refresh(): void {
        if (this.riGrid.currentPage <= 0) {
            this.riGrid.currentPage = 1;
        }
        this.riGrid.RefreshRequired();
        this.populateGrid();
    }

    public getCurrentPage(currentPage: any): void {
        this.gridConfig.currentPage = currentPage.value;
        this.refresh();
    }

    public addDays(date: Date, days: number): any {
        let d = this.globalize.parseDateToFixedFormat(date.toString());
        let newDate: Date = new Date(d.toString());
        newDate.setDate(newDate.getDate() + days);
        let adddate = this.globalize.parseDateToFixedFormat(newDate);
        return adddate;
    }
}

