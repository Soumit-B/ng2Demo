import * as moment from 'moment';
import { Component, Injector, ViewChild, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { DatepickerComponent } from './../../../shared/components/datepicker/datepicker';
import { Http, URLSearchParams } from '@angular/http';

@Component({
    templateUrl: 'iCABSSeTechnicianSyncSummaryGrid.html'
})



export class TechnicianSyncSummaryGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riGridPagination') riGridPagination: PaginationComponent;
    @ViewChild('DateToDatePicker') DateToDatePicker: DatepickerComponent;
    @ViewChild('DateFromDatePicker') DateFromDatePicker: DatepickerComponent;

    public setFocusEmployeeCode = new EventEmitter<boolean>();
    public search: URLSearchParams = new URLSearchParams();
    public pageId: string;

    // message Modal popup
    public errorTitle: string;
    public errorContent: string;
    public showErrorHeader: boolean = true;

    public pageCurrent: number = 1;
    public totalRecords: number = 1;
    public pageSize: number = 10;

    public DateTo: Date = new Date();
    public DateFrom: Date;
    public Date: Date = new Date();
    private selectedRow: any = -1;

    public showHeader: boolean = false;
    public dateReadOnly: boolean = false;

    public controls = [
        { name: 'BusinessCode', readonly: true, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'BusinessDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'EmployeeCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'DateFrom', readonly: true, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'DateTo', readonly: true, disabled: false, required: false, type: MntConst.eTypeDate }

    ];

    public queryParams: any = {
        operation: 'Service/iCABSSeTechnicianSyncSummaryGrid',
        module: 'pda',
        method: 'service-delivery/maintenance'
    };

    public inputParamsEmployeeSearch: any = {
        'childConfigParams': {
            'parentMode': 'LookUp',
            'showAddNew': false
        },
        'contentComponent': EmployeeSearchComponent,
        'modalTitle': '',
        'showHeader': true,
        'disabled': false
    };

    public showErrorModal(data: any, title: any): void {
        this.errorModal.show({ msg: data, title: title }, false);
    }


    public onEmployeeDataReturn(data: any): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EmployeeCode', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode', false);
        this.pageParams.employeeCode = data.EmployeeCode;
        this.pageParams.employeeSurName = data.EmployeeSurName;
        this.setControlValue('EmployeeCode', data.EmployeeCode);
        this.setControlValue('EmployeeSurname', data.EmployeeSurname);
        this.employeeCodeOnChange();
    }

    public employeeCode_Keyup(): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EmployeeCode', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode', false);
    }

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSETECHNICIANSYNCSUMMARYGRID;
    }


    ngOnInit(): void {
        super.ngOnInit();

        this.pageTitle = 'Technician Synchronisation Summary';
        this.utils.setTitle(this.pageTitle);

        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.FunctionUpdateSupport = true;
        this.riGrid.PageSize = this.pageSize;

        this.BuildGrid();
        // this.riGrid.RefreshInterval = 0; // ------* Not Present in riGridAdvanced component * -----
        // this.riGrid.Report = true;
        // this.riGrid.ExportExcel = true;  this.getSysCharAndValues();
        if (this.isReturning()) {
            this.populateUIFromFormData();
        } else {
            this.window_onload();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }


    public window_onload(): void {
        this.DateFrom = new Date(this.dateSeries());
        this.riExchange.riInputElement.Disable(this.uiForm, 'BusinessCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BusinessDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'EmployeeSurname');
        this.pageParams.vBusinessCode = this.businessCode();
        this.doLookup('Business', { 'BusinessCode': this.pageParams.vBusinessCode }, ['BusinessDesc']);
        this.setControlValue('BusinessCode', this.pageParams.vBusinessCode);

        this.pageParams.level = 'Employee';
        let parentMode = this.riExchange.getParentMode();

        if (parentMode === 'TechSyncSummary') {
            this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCodeInput'));
            this.setControlValue('EmployeeSurname', this.riExchange.GetParentHTMLInputElementAttribute('EmployeeCodeInput', 'EmployeeSurname'));
            this.setControlValue('DateFrom', this.riExchange.getParentHTMLValue('DateFrom'));
            this.setControlValue('DateTo', this.riExchange.getParentHTMLValue('DateTo'));
            this.loadData();
        } else {
            this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCode'));//To do in future for Employee code
            this.setControlValue('EmployeeSurname', this.riExchange.getParentHTMLValue('EmployeeSurname'));//To do in future for Employee Surname
            this.setControlValue('DateFrom', this.utils.formatDate(this.DateFrom));
            this.setControlValue('DateTo', this.utils.formatDate(this.DateTo));
            this.setFocusEmployeeCode.emit(true);
        }
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EmployeeCode', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode', true);
    }

    private doLookup(table: any, query: any, fields: any): any {
        let lookupIP = [{
            'table': table,
            'query': query,
            'fields': fields
        }];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            this.isRequesting = true;
            let record = data[0];
            switch (table) {
                case 'Business':
                    if (record.length > 0) {
                        this.pageParams.vBusinessDesc = record[0].hasOwnProperty('BusinessDesc') ? record[0]['BusinessDesc'] : false;
                        this.setControlValue('BusinessDesc', this.pageParams.vBusinessDesc);
                        this.setControlValue('BusinessCode', this.pageParams.vBusinessCode);
                    }
                    this.isRequesting = false;
                    break;
                case 'Company':
                    if (record.length > 0) {
                        this.pageParams.CompanyDesc = record[0].hasOwnProperty('CompanyDesc') ? record[0]['CompanyDesc'] : false;
                        this.setControlValue('CompanyDesc', this.pageParams.CompanyDesc);
                        this.setControlValue('CompanyCode', query['CompanyCode']);
                    }
                    this.isRequesting = false;
                    break;
            }
        });
    };

    public dateSeries(): string {
        let month = '' + (this.Date.getMonth() + 1);
        let day = '1';
        let year = this.Date.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        let date = [month, day, year].join('/').toString();
        return date;
    }

    /*
    * To check whether the from and to date is in correct format
    */

    /*
    * To check whether the date is  a valid date
    */

    /*
    * To Set the date selected from the datepicker to the date from input element
    */

    public dateFromSelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('DateFrom', value.value);
            this.dateFromOnChange();
        }
    }

    /*
    * To Set the date selected from the datepicker to the date to input element
    */

    public dateToSelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('DateTo', value.value);
            this.dateToOnChange();
        }
    }

    public dateFromOnChange(): void {
        this.riGrid.RefreshRequired();
    }
    public dateToOnChange(): void {
        this.riGrid.RefreshRequired();
    }
    public employeeCodeOnChange(): void {
        if (!this.getControlValue('EmployeeCode')) {
            this.setControlValue('EmployeeSurname', '');
        }
        this.riGrid.RefreshRequired();
    }
    public riExchangeUpDateHTMLDocument(): void {
        this.refresh();
    }

    /*
    * To build the grid
    */

    public BuildGrid(): void {
        this.riGrid.Clear();

        this.riGrid.AddColumn('WeekStart', 'SyncSummary', 'WeekStart', MntConst.eTypeText, 15, false, '');
        this.riGrid.AddColumnAlign('WeekStart', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('Monday', 'SyncSummary', 'Monday', MntConst.eTypeInteger, 15, false, '');
        this.riGrid.AddColumnAlign('Monday', MntConst.eAlignmentRight);

        this.riGrid.AddColumn('Tuesday', 'SyncSummary', 'Tuesday', MntConst.eTypeInteger, 15, false, '');
        this.riGrid.AddColumnAlign('Tuesday', MntConst.eAlignmentRight);

        this.riGrid.AddColumn('Wednesday', 'SyncSummary', 'Wednesday', MntConst.eTypeInteger, 15, false, '');
        this.riGrid.AddColumnAlign('Wednesday', MntConst.eAlignmentRight);

        this.riGrid.AddColumn('Thursday', 'SyncSummary', 'Thursday', MntConst.eTypeInteger, 15, false, '');
        this.riGrid.AddColumnAlign('Thursday', MntConst.eAlignmentRight);

        this.riGrid.AddColumn('Friday', 'SyncSummary', 'Friday', MntConst.eTypeInteger, 15, false, '');
        this.riGrid.AddColumnAlign('Friday', MntConst.eAlignmentRight);

        this.riGrid.AddColumn('Saturday', 'SyncSummary', 'Saturday', MntConst.eTypeInteger, 15, false, '');
        this.riGrid.AddColumnAlign('Saturday', MntConst.eAlignmentRight);

        this.riGrid.AddColumn('Sunday', 'SyncSummary', 'Sunday', MntConst.eTypeInteger, 15, false, '');
        this.riGrid.AddColumnAlign('Sunday', MntConst.eAlignmentRight);

        this.riGrid.AddColumn('Qty', 'SyncSummary', 'Qty', MntConst.eTypeInteger, 15, false, '');
        this.riGrid.AddColumnAlign('Qty', MntConst.eAlignmentRight);

        this.riGrid.Complete();
    }

    private loadData(): void {
        if (this.riGrid_BeforeExecute()) {
            this.search = this.getURLSearchParamObject();
            this.search.set('DateFrom', this.getControlValue('DateFrom'));
            this.search.set('Level', this.pageParams.level);
            this.search.set('DateTo', this.getControlValue('DateTo'));
            this.search.set(this.serviceConstants.Action, '2');
            this.search.set('EmployeeCode', this.getControlValue('EmployeeCode'));
            this.search.set(this.serviceConstants.BusinessCode, this.getControlValue('BusinessCode'));
            this.search.set(this.serviceConstants.PageSize, this.pageSize.toString());
            this.search.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
            this.search.set(this.serviceConstants.GridMode, '0');
            this.search.set(this.serviceConstants.GridHandle, '3999712');
            // this.search.set(this.serviceConstants.GridCacheRefresh, 'true');
            this.search.set('PageCurrent', this.pageCurrent.toString());
            this.search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
            let sortOrder = 'Descending';
            if (!this.riGrid.DescendingSort) {
                sortOrder = 'Ascending';
            }
            this.search.set('riSortOrder', sortOrder);
            this.queryParams.search = this.search;

            // this.riGrid.loadGridData(this.queryParams);
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
                this.queryParams.operation, this.queryParams.search)
                .subscribe(
                (data) => {
                    if (data && data.errorMessage) {
                        this.showErrorModal(data.errorMessage, 'Error');
                    } else {
                        this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                        this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateFooter = true;
                        this.riGrid.UpdateHeader = true;
                        this.riGrid.Execute(data);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.totalRecords = 1;
                    this.showErrorModal(error, 'Error');
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }

    // *--------------Handle Grid Data-----------*
    /*----------------comment the below for regional setting changes--------------*/
    // public ValidateScreenParameters(): boolean {

    //     let blnReturn = true;
    //     let fromDate = this.getControlValue('DateFrom');
    //     if (!moment(fromDate, 'DD/MM/YYYY', true).isValid()) {
    //         blnReturn = false;
    //         this.DateFromDatePicker.validateDateField();
    //     }

    //     let toDate = this.getControlValue('DateTo');
    //     if (!moment(toDate, 'DD/MM/YYYY', true).isValid()) {
    //         blnReturn = false;
    //         this.DateToDatePicker.validateDateField();
    //     }

    //     return blnReturn;
    // }
    /*----------------comment the above for regional setting changes--------------*/
    public riGrid_BeforeExecute(): boolean {
        this.pageParams.BusinessObjectPostData = 'Level=' + this.pageParams.level +
            '&BusinessCode=' + this.businessCode() +
            '&EmployeeCode=' + this.getControlValue('EmployeeCode') +
            '&DateFrom=' + this.getControlValue('DateFrom') +
            '&DateTo=' + this.getControlValue('DateTo');
        return true;
    }

    public riGrid_Sort(event: any): void {
        // this.loadData();
    }

    public getCurrentPage(event: any): void {
        this.selectedRow = -1;
        this.pageCurrent = event.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.pageCurrent));
        this.refresh();
    }

    public refresh(): void {
        // this.pageCurrent = 1;

        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EmployeeCode', true);
        this.loadData();
    }
}

