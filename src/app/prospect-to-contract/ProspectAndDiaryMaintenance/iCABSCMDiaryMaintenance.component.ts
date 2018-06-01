import { Component, OnInit, OnDestroy, ViewChild, Injector, AfterViewInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { MessageCallback, ErrorCallback } from './../../base/Callback';
import { PageIdentifier } from '../../base/PageIdentifier';
import { InternalMaintenanceServiceModuleRoutes } from './../../base/PageRoutes';
import { GridComponent } from '../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';

@Component({

    templateUrl: 'iCABSCMDiaryMaintenance.html',
    styles: [`
        :host /deep/ .gridtable thead tr th {
            width: 14%;
        }
        :host /deep/ .gridtable tbody tr {
            height: 25px;
        }
    `]
})

export class DiaryMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, MessageCallback, ErrorCallback {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('diaryGrid') diaryGrid: GridComponent;
    @ViewChild('diaryPagination') diaryPagination: PaginationComponent;
    @ViewChild('ticketTypeSelectDropdown') ticketTypeSelectDropdown: DropdownStaticComponent;
    @ViewChild('woTypeCodeSelectDropdown') woTypeCodeSelectDropdown: DropdownStaticComponent;
    @ViewChild('monthSelectDropdown') monthSelectDropdown: DropdownStaticComponent;
    @ViewChild('diaryYearSelectDropdown') diaryYearSelectDropdown: DropdownStaticComponent;
    @ViewChild('diaryGrid') riGrid: GridAdvancedComponent;

    public pageId: string = '';
    public isRequesting: boolean = false;
    public errorMessage: string;
    public ticketTypeCodeList: Array<Object> = [];
    public woTypeCodeList: Array<Object> = [];
    public monthList: Array<any> = [];
    public diaryYearList: Array<Object> = [];
    public highlightList: Array<Object> = [];
    public displayHignlight: boolean = true;
    public displayOpenWOOnly: boolean = true;
    public ticketDataAvailable: boolean = false;
    public controls = [
        { name: 'EmployeeCode', disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'EmployeeSurname', disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'TicketTypeSelect', disabled: true, required: false },
        { name: 'WOTypeCodeSelect', disabled: false, required: false },
        { name: 'MonthSelect', disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'DiaryYearSelect', disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'HighlightSelect', disabled: false, required: false },
        { name: 'OpenWOOnly', disabled: false, required: false },
        // Hidden Fields
        { name: 'Highlightvalue', disabled: false, required: false },
        { name: 'PassWONumber', disabled: false, required: false },
        { name: 'PassWOType', disabled: false, required: false },
        { name: 'PassDiaryDate', disabled: false, required: false },
        { name: 'PassEmployeeCode', disabled: false, required: false },
        { name: 'PassEmployeeName', disabled: false, required: false },
        { name: 'PassProspectNumber', disabled: false, required: false },
        { name: 'PassHighlight', disabled: false, required: false },
        { name: 'PassHighlightWOType', disabled: false, required: false },
        // { name: 'PassHighlightTaskType', disabled: false, required: false }, // Commented out in Old Application code
        { name: 'DiaryProspectNumber', disabled: false, required: false },
        { name: 'AllowFullUpdateRights', disabled: false, required: false },
        { name: 'PassDiaryEntryNumber', disabled: false, required: false },
        { name: 'PassCustomerContactNumber', disabled: false, required: false },
        { name: 'DiaryDate', disabled: false, required: false, type: MntConst.eTypeDate }
    ];
    public muleConfig = {
        method: 'ccm/maintenance',
        module: 'diary',
        operation: 'ContactManagement/iCABSCMDiaryMaintenance'
    };
    public gridParams: any = {
        totalRecords: 0,
        maxColumn: 7,
        itemsPerPage: 20,
        currentPage: 1,
        riGridMode: 0,
        riGridHandle: 66090,
        riSortOrder: 'Descending'
    };

    public ellipsisConfig = {
        employee: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Diary'
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: EmployeeSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };

    public ngOnInit(): void {
        super.ngOnInit();
        this.windowOnload();
    };

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMDIARYMAINTENANCE;
        this.browserTitle = this.pageTitle = 'Diary Monthly View';
    };

    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data.msg, title: 'Error' }, false);
    };

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };

    public windowOnload(): void {
        this.setControlValue('OpenWOOnly', true);
        this.setControlValue('HighlightSelect', 'NONE');
        this.setControlValue('DiaryProspectNumber', this.riExchange.getParentHTMLValue('DiaryProspectNumber'));
        switch (this.parentMode) {
            case 'PipelineGrid':
                this.setControlValue('PassEmployeeCode', this.getControlValue('EmployeeCode'));
                break;
            case 'Employee':
                this.setControlValue('PassEmployeeCode', this.getControlValue('EmployeeCode'));
                this.displayHignlight = false;
                this.displayOpenWOOnly = false;
                break;
            case 'CallCentre':
                this.setControlValue('OpenWOOnly', true);
                this.setControlValue('PassEmployeeCode', this.riExchange.getParentHTMLValue('PassEmployeeCode'));
                this.setControlValue('AllowFullUpdateRights', 'YES');
                break;
            default:
                // LEFT - Code in HTM no longer valid with New UI
                break;

        }
        let queryPost: URLSearchParams = this.getURLSearchParamObject();
        queryPost.set(this.serviceConstants.Action, '6');
        let formdata: any = {
            BusinessCode: this.businessCode(),
            PassEmployeeCode: this.getControlValue('PassEmployeeCode'),
            Function: 'GetDefaults-WeeksByMonth'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.status === 'failure') {
                    this.showErrorModal(data.oResponse);
                } else {
                    if (data.errorMessage && data.errorMessage !== '') {
                        this.showErrorModal(data);
                    } else {
                        this.setControlValue('EmployeeCode', data.EmployeeCode);
                        this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                        this.setControlValue('WOTypeCodeSelect', data.DefaultWOTypeCode);
                        if (data.TicketTypeCodeList && data.TicketTypeDescList) {
                            this.ticketDataAvailable = true;
                            this.dropdownGenerator(data.TicketTypeCodeList, data.TicketTypeDescList, 'ticketTypeSelectDropdown', 'ticketTypeCodeList', null);
                        }
                        if (this.parentMode === 'Employee') {
                            this.setControlValue('MonthSelect', this.riExchange.getParentHTMLValue('GridSelectedMonth'));
                            this.setControlValue('DiaryYearSelect', this.riExchange.getParentHTMLValue('GridSelectedYear'));
                        } else {
                            // LEFT if part - Code in HTM no longer valid with New UI
                            this.setControlValue('MonthSelect', data.CurrentMonth);
                            this.setControlValue('DiaryYearSelect', data.CurrentYear);
                        }
                        this.dropdownGenerator(data.WOTypeCodeList, data.WOTypeDescList, 'woTypeCodeSelectDropdown', 'woTypeCodeList', data.DefaultWOTypeCode);
                        this.dropdownGenerator(data.MonthValueList, data.MonthDescList, 'monthSelectDropdown', 'monthList', data.CurrentMonth);
                        this.dropdownGenerator(data.YearValueList, data.YearDescList, 'diaryYearSelectDropdown', 'diaryYearList', data.CurrentYear);

                        this.buildGrid();
                        this.riGrid_BeforeExecute();
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    };

    // Generic fuction to populate and select default dropdowns
    public dropdownGenerator(key: any, value: any, dropdownComp: string, dropdownList: string, selected: any): void {
        let keyList = key.split('\n'),
            valueList = value.split('\n');
        for (let i = 0; i < keyList.length; i++) {
            this[dropdownList].push({
                value: keyList[i],
                text: valueList[i]
            });
        }
        if (selected)
            this[dropdownComp].selectedItem = selected;
    }

    // Callback for Employee Ellipsis
    public onEmployeeDataReceived(data: any): void {
        this.setControlValue('EmployeeCode', data.EmployeeCode);
        this.setControlValue('EmployeeSurname', data.EmployeeSurName);
    };

    public buildGrid(): void {
        // Advanced Grid Details
        this.riGrid.Clear();
        this.riGrid.AddColumn('grMonday', 'grMonday', 'grMonday', MntConst.eTypeTextFree, 25);
        this.riGrid.AddColumn('grTuesday', 'grTuesday', 'grTuesday', MntConst.eTypeTextFree, 25);
        this.riGrid.AddColumn('grWednesday', 'grWednesday', 'grWednesday', MntConst.eTypeTextFree, 25);
        this.riGrid.AddColumn('grThursday', 'grThursday', 'grThursday', MntConst.eTypeTextFree, 25);
        this.riGrid.AddColumn('grFriday', 'grFriday', 'grFriday', MntConst.eTypeTextFree, 25);
        this.riGrid.AddColumn('grSaturday', 'grSaturday', 'grSaturday', MntConst.eTypeTextFree, 25);
        this.riGrid.AddColumn('grSunday', 'grSunday', 'grSunday', MntConst.eTypeTextFree, 25);
        this.riGrid.Complete();

    };

    public riGrid_BeforeExecute(): void {
        let gridQueryParams: URLSearchParams = new URLSearchParams();
        gridQueryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        gridQueryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        gridQueryParams.set(this.serviceConstants.Action, '2');
        gridQueryParams.set(this.serviceConstants.GridHandle, this.utils.gridHandle);
        gridQueryParams.set(this.serviceConstants.GridMode, '0');
        gridQueryParams.set(this.serviceConstants.GridCacheRefresh, 'True');
        gridQueryParams.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        gridQueryParams.set(this.serviceConstants.GridSortOrder, this.riGrid.SortOrder);
        gridQueryParams.set(this.serviceConstants.GridPageSize, '10');
        gridQueryParams.set(this.serviceConstants.GridPageCurrent, this.gridParams.currentPage.toString());
        let latestOpenWOOnly = this.getControlValue('OpenWOOnly') ? 'True' : 'False';
        gridQueryParams.set('Level', 'WeeksByMonth');
        gridQueryParams.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        gridQueryParams.set('WOTypeCode', this.getControlValue('WOTypeCodeSelect'));
        gridQueryParams.set('TicketTypeCode', this.getControlValue('TicketTypeSelect'));
        gridQueryParams.set('HighlightType', this.getControlValue('HighlightSelect'));
        gridQueryParams.set('HighlightValue', this.getControlValue('HighlightValue')); // Code commented out in VBScript
        gridQueryParams.set('DiaryMonth', this.getControlValue('MonthSelect'));
        gridQueryParams.set('DiaryYear', this.getControlValue('DiaryYearSelect'));
        gridQueryParams.set('OpenWOOnly', latestOpenWOOnly);

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, gridQueryParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    this.gridParams.currentPage = 1;
                    this.gridParams.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.gridParams.itemsPerPage : 1;
                    this.riGrid.RefreshRequired();
                    this.riGrid.Execute(data);
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    };

    public getCurrentPage(curPage: any): void {
        this.gridParams.currentPage = curPage ? curPage.value : this.gridParams.currentPage;
        this.buildGrid();
    };

    public getGridInfo(info: any): void {
        if (info) {
            this.gridParams.totalRecords = info.totalRows;
        }
    };

    public onTicketTypeSelect(data: any): void {
        this.setControlValue('TicketTypeSelect', data);
    };

    public onWOTypeCodeSelect(data: any): void {
        this.setControlValue('WOTypeCodeSelect', data);
    };

    public onMonthSelect(data: any): void {
        this.setControlValue('MonthSelect', data);
    };

    public onDiaryYearSelect(data: any): void {
        this.setControlValue('DiaryYearSelect', data);
    };

    public onGridColumnDbClick(data: any): void {
        let additionalData = this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'AdditionalProperty');
        this.logger.log('Grid additionalData ====>', additionalData);

        this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
        // TODO : Child screen not yet developed
        /*if (additionalData.indexOf('DATE=') !== -1) {
            this.setControlValue('PassDiaryDate', additionalData.replace('DATE=', ''));
            this.setControlValue('PassEmployeeCode', this.getControlValue('EmployeeCode'));
            this.setControlValue('PassEmployeeName', this.getControlValue('EmployeeSurname'));
            this.setControlValue('PassWOType', this.getControlValue('WOTypeCodeSelect'));
            this.setControlValue('PassHighlight', this.getControlValue('HighlightSelect'));
            if (this.parentMode === 'Employee')
                this.navigate('EmployeeDiaryViewDay', 'ContactManagement/iCABSCMDiaryDayMaintenance.htm');
            else
                this.navigate('DiaryViewDay', 'ContactManagement/iCABSCMDiaryDayMaintenance.htm');
        }*/

        if (additionalData.indexOf('WONO=') !== -1) {
            this.setControlValue('PassWONumber', additionalData.replace('WONO=', ''));
            this.setControlValue('PassEmployeeCode', this.getControlValue('EmployeeCode'));
            this.setControlValue('PassEmployeeName', this.getControlValue('EmployeeSurname'));
            if (this.getControlValue('PassWONumber') !== 0)
                this.navigate('DiaryAmendAppointment', InternalMaintenanceServiceModuleRoutes.ICABSCMWORKORDERMAINTENANCE, {
                    PassWONumber: this.getControlValue('PassWONumber')
                });
        }

        /*if (additionalData.indexOf('DINO=') !== -1) {
            let additionalSplit = additionalData.split('|');
            this.setControlValue('PassDiaryEntryNumber', additionalSplit[0].replace('DINO=', ''));
            this.setControlValue('DiaryDate', additionalSplit[1]);
            this.setControlValue('PassEmployeeName', this.getControlValue('EmployeeSurname'));
            if (this.getControlValue('PassDiaryEntryNumber') !== 0)
            this.navigate('DiaryDayAppointment', InternalMaintenanceServiceModuleRoutes.ICABSADIARYENTRY);
        }

        if (additionalData.indexOf('CCNO=') !== -1) {
            this.setControlValue('PassCustomerContactNumber', additionalData.replace('CCNO=', ''));
            if (this.getControlValue('PassCustomerContactNumber') !== 0)
                this.navigate('EmployeeDiary', 'ContactManagement/iCABSCMCustomerContactMaintenance.htm');
        }

        if (additionalData.indexOf('MULT=') !== -1) {
            this.setControlValue('PassProspectNumber', additionalData.substr(5, 9));
            this.setControlValue('PassWONumber', additionalData.replace(15, 9));
            this.setControlValue('PassEmployeeCode', this.getControlValue('EmployeeCode'));
            this.setControlValue('PassEmployeeName', this.getControlValue('EmployeeSurname'));
            if (this.getControlValue('PassWONumber') !== 0)
                this.navigate('DiaryAmendAppointment', 'ContactManagement/iCABSCMWorkOrderGrid.htm');
        }*/
    }

    public riGrid_Sort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

}
