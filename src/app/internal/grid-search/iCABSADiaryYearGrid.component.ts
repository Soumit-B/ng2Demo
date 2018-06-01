import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { URLSearchParams } from '@angular/http';
import { InternalMaintenanceModuleRoutes, InternalMaintenanceServiceModuleRoutes } from '../../base/PageRoutes';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSADiaryYearGrid.html'
})

export class DiaryYearGridComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    private method: string = 'service-planning/maintenance';
    private module: string = 'diary';
    private operation: string = 'Application/iCABSADiaryYearGrid';
    public inputParams: any = {};
    public search: URLSearchParams;
    public totalRecords: number;
    public maxColumn: number = 32;
    public itemsPerPage: number = 12;
    public pageCurrent: number = 1;
    public curPage: number = 1;
    public pageSize: number = 10;
    private viewByOption: string = 'All';
    public legend: Array<any> = [];
    private SelectedYear: number;
    public showMessageHeader: boolean = true;
    public showHideGrid: boolean = false;
    public errorMsg: any;
    public showGrid: any = true;
    @ViewChild('diaryYearGrid') diaryYearGrid: GridComponent;
    @ViewChild('diaryGridPagination') diaryGridPagination: PaginationComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('errorModal') public errorModal;
    public controls = [
        { name: 'EmployeeCode', readonly: true, disabled: true, required: false },
        { name: 'EmployeeName', readonly: true, disabled: true, required: false },
        { name: 'SelectedYear', readonly: true, disabled: false, required: false },
        { name: 'TotalEntries', readonly: true, disabled: true, required: false },
        { name: 'TotalHolidays', readonly: true, disabled: true, required: false },
        { name: 'TotalSickness', readonly: true, disabled: true, required: false },
        { name: 'TotalTickets', readonly: true, disabled: true, required: false },
        { name: 'TotalWorkOrders', readonly: true, disabled: true, required: false },
        { name: 'TotalBranchHolidays', readonly: true, disabled: true, required: false },
        { name: 'TotalOther', readonly: true, disabled: true, required: false },
        { name: 'PassEmployeeCode', readonly: true, disabled: true, required: false },
        { name: 'PassEmployeeName', readonly: true, disabled: true, required: false },
        { name: 'PassMonth', readonly: true, disabled: true, required: false },
        { name: 'PassYear', readonly: true, disabled: true, required: false },
        { name: 'DiaryDate', readonly: true, disabled: true, required: false },
        { name: 'SelectedDate' },
        { name: 'GridSelectedYear' },
        { name: 'GridSelectedDay' },
        { name: 'GridSelectedMonth' },
        { name: 'PassDiaryDate' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSADIARYYEARGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Diary';
        this.windowOnload();
        this.setupPage();
    }

    private windowOnload(): void {
        let date = new Date();
        this.errorMsg = 'Error - Unable to calculate month and year';
        this.getTranslatedValue(this.errorMsg, null).subscribe((res: string) => {
            if (res) { this.errorMsg = res; }
        });
        this.utils.setTitle('Diary');
        this.riGrid.HidePageNumber = true;
        this.riGrid.HighlightBar = false;
        this.SelectedYear = date.getFullYear();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelectedYear', this.SelectedYear);
        this.riGrid.DefaultBorderColor = 'DDDDDD';
        this.riGrid.FunctionPaging = false;
        this.riGrid.PageSize = this.pageSize;
        this.riGrid.FixedWidth = true;
    }

    private setupPage(): void {
        switch (this.parentMode) {
            case 'Employee':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeName', this.riExchange.getParentHTMLValue('EmployeeSurname'));
                break;
            case 'ServiceVisitCalendar':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCode'));
                break;
            case 'ServiceCover':
            case 'ServiceVisitMaintenance':
            case 'byServiceCoverRowID':
                break;

        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PassEmployeeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PassEmployeeName', this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeName'));
        this.buildGrid();
        this.riGrid_BeforeExecute();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public buildGrid(): void {
        this.riGrid.Clear();
        let iLoop: any;
        this.riGrid.AddColumn('Month', 'Diary', 'Month', MntConst.eTypeText, 20, true);
        for (iLoop = 1; iLoop <= 31; iLoop++) {
            this.riGrid.AddColumn(iLoop.toString(), 'Diary', iLoop.toString(), MntConst.eTypeText, 4, true);
            switch (this.viewByOption) {
                case 'Time':
                case 'Value':
                    this.riGrid.AddColumnAlign(iLoop.toString(), MntConst.eAlignmentRight);
                    break;
                default:
                    this.riGrid.AddColumnAlign(iLoop.toString(), MntConst.eAlignmentCenter);
                    break;
            }
        }
        this.riGrid.Complete();
    }

    private riGrid_BeforeExecute(): void {

        let gridParams: URLSearchParams = new URLSearchParams();
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.countryCode());
        gridParams.set('EmployeeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode'));
        gridParams.set('year', this.SelectedYear.toString());
        gridParams.set('ViewTypeFilter', this.viewByOption);
        gridParams.set('riSortOrder', 'Descending');
        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.GridHandle, '1246324');
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        gridParams.set('HeaderClickedColumn', '');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.method, this.module, this.operation, gridParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    return;
                }
                this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                this.riGrid.UpdateBody = true;
                this.riGrid.UpdateHeader = true;
                this.riGrid.Execute(data);
            },
            (error) => {
                this.logger.log('Error', error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public selectedAllDiary(value: string): void {
        // Redirect to iCABSADiaryEntry page.
        this.riExchange.setParentAttributeValue('ProductCodeServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCover'));
        this.riExchange.setParentAttributeValue('ContractNumberSelectedDate', '');
        this.riExchange.setParentAttributeValue('ProductCodeServiceCoverRowID', this.riExchange.getParentAttributeValue('ServiceCoverRowID'));
        if (value === 'Add Diary Entry') {
            this.navigate('YearGrid', InternalMaintenanceServiceModuleRoutes.ICABSADIARYENTRY);
            //TODO: Navigate to iCABSADiaryEntry page.
        }
    }

    public selectedViewBy(value: string): void {
        this.viewByOption = value;
        this.showGrid = false;
    }

    public refresh(): void {
        this.showGrid = true;
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public getCurrentPage(currentPage: any): void {
        this.curPage = currentPage.value;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    }

    public tbodyDiary_onDblClick(ev: any): void {
        let iSelectedDay, iSelectedMonth, iSelectedYear, arrSelection;
        if (ev.srcElement.value) {
            if (ev.srcElement.parentElement.children[0].getAttribute('rowid')) {
                arrSelection = ev.srcElement.parentElement.children[0].getAttribute('rowid').split(' ');
                if (!Array.isArray(arrSelection) || arrSelection.length < 2) {
                    //show modal -- Error - Unable to calculate month and year
                    this.errorModal.show({ msg: this.errorMsg, title: '' }, false);
                    return;
                }
                iSelectedDay = 1;
                iSelectedMonth = arrSelection[0];
                iSelectedYear = arrSelection[1];
                let dateNum = this.utils.numberPadding(iSelectedDay, 2);
                let monthNum = this.utils.numberPadding(iSelectedMonth, 2);
                this.setControlValue('SelectedDate', new Date(iSelectedYear + '/' + monthNum + '/' + dateNum));
                this.setControlValue('GridSelectedYear', iSelectedYear);
                this.setControlValue('GridSelectedMonth', iSelectedMonth);
                this.setControlValue('GridSelectedDay', iSelectedDay);
                this.errorModal.show({ msg: 'iCABSCMDiaryMaintenance - Page not developed', title: '' }, false);
                // this.navigate('Employee', 'application/iCABSCMDiaryMaintenance');
            }
        } else {
            if (ev.srcElement.getAttribute('additionalproperty')) {
                arrSelection = ev.srcElement.getAttribute('additionalproperty').split('/');
                if (!Array.isArray(arrSelection) || arrSelection.length < 3) {
                    //show modal -- Error - Unable to calculate month and year
                    this.errorModal.show({ msg: this.errorMsg, title: '' }, false);
                    return;
                }
                iSelectedDay = arrSelection[0];
                iSelectedMonth = arrSelection[1];
                iSelectedYear = arrSelection[2];
                let dateNum = this.utils.numberPadding(iSelectedDay, 2);
                let monthNum = this.utils.numberPadding(iSelectedMonth, 2);
                this.setControlValue('PassDiaryDate', new Date(iSelectedYear + '/' + monthNum + '/' + dateNum));
                this.errorModal.show({ msg: 'iCABSCMDiaryDayMaintenance - Page not developed', title: '' }, false);
                // this.navigate('EmployeeDiaryViewDay', 'application/iCABSCMDiaryDayMaintenance');
            }
        }
    }

    public riGrid_AfterExecute(): void {
        let iLoop;
        let oTR, oTD;
        let iBeforeCurrentMonth;
        let iAfterCurrentMonth;
        for (iLoop = 1; iLoop <= 31; iLoop++) {
            //this.riGrid.HTMLGridBody.children[0].children[iLoop].setAttribute('width', '20');
        }
        let obj = this.riGrid.HTMLGridBody.children[0].children[0].getAttribute('additionalproperty');
        if (obj) {
            this.legend = [];
            let legend = obj.split('bgcolor=');
            for (let i = 0; i < legend.length; i++) {
                let str = legend[i];
                if (str.indexOf('"#') >= 0) {
                    this.legend.push({
                        color: str.substr(str.indexOf('"#') + 1, 7),
                        label: str.substr(str.indexOf('<td>') + 4, str.substr(str.indexOf('<td>') + 4).indexOf('&'))
                    });
                }
            }
        }

        //this.riGrid.SetDefaultFocus();
        let currentMonth = new Date().getMonth();
        iBeforeCurrentMonth = new Date().getMonth();
        iAfterCurrentMonth = new Date().getMonth() + 1;

        //'SH 18/01/2005 - QRSAUS1620 Bug:  If in January, cannot create marker line for previous month.
        let objList = document.querySelectorAll('.gridtable tbody > tr');
        if (objList && objList.length >= currentMonth) {
            let tr = objList[currentMonth];
            if (tr) {
                tr.setAttribute('class', 'currentMonth');
            }
        }

        //'Set Total value fields

        let TotalString;
        TotalString = this.riGrid.HTMLGridBody.children[1].children[0].getAttribute('additionalproperty').split('|');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalEntries', TotalString[0]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalHolidays', TotalString[1]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalSickness', TotalString[2]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalTickets', TotalString[3]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalWorkOrders', TotalString[4]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalBranchHolidays', TotalString[5]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalOther', TotalString[6]);
    }

    public onPlusClick(event: any): void {
        this.SelectedYear++;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelectedYear', this.SelectedYear);
    }

    public onMinusClick(event: any): void {
        this.SelectedYear--;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelectedYear', this.SelectedYear);
    }

    public keyboardInput(event: any): void {
        switch (event.keyCode) {
            case 45:
                this.SelectedYear--;
                break;
            case 43:
                this.SelectedYear++;
                break;
            default:
                break;
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelectedYear', this.SelectedYear);
    }
}

