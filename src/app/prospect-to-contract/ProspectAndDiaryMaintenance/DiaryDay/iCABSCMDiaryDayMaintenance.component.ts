import { Component, OnInit, OnDestroy, Injector, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { EmployeeSearchComponent } from '../../../internal/search/iCABSBEmployeeSearch';
import { GridAdvancedComponent } from './../../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { ICabsModalVO } from '../../../../shared/components/modal-adv/modal-adv-vo';
import { InternalMaintenanceModuleRoutes, InternalMaintenanceServiceModuleRoutes } from './../../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSCMDiaryDayMaintenance.html'
})

export class DiaryDayMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    private inputParams: any = {};
    private method: string = 'ccm/maintenance';
    private module: string = 'diary';
    private operation: string = 'ContactManagement/iCABSCMDiaryDayMaintenance';
    private monthArray: Array<any> = [];
    private yearArray: Array<any> = [];
    public pageId: string = '';
    public pageTitle: string;
    public controls = [
        { name: 'EmployeeCode', disabled: false },
        { name: 'EmployeeSurname', disabled: true },
        { name: 'TicketTypeSelect', disabled: false },
        { name: 'WOTypeCodeSelect', disabled: false, required: false },
        { name: 'HighlightSelect', disabled: false, required: false, value: 'None' },
        { name: 'OpenWOOnly', disabled: false, required: false },
        { name: 'menu', disabled: false },
        { name: 'transtype', disabled: false, value: 'workorder' },
        { name: 'BusinessCode' },
        { name: 'AllowFullUpdateRights' },
        { name: 'DiaryProspectNumber' },
        { name: 'CurrentMonth' },
        { name: 'CurrentYear' },
        { name: 'DiaryDate', required: true, type: MntConst.eTypeDate },
        { name: 'HighlightValue', value: '' },
        { name: 'WOResultDate' },
        { name: 'WOResultStartTime' },
        { name: 'WOResultEndTime' },
        { name: 'PassDiaryDate', type: MntConst.eTypeDate },
        { name: 'PassDiaryStartTime' },
        { name: 'PassEmployeeCode' },
        { name: 'PassEmployeeName' },
        { name: 'PassDiaryEntryNumber' },
        { name: 'PassWONumber' },
        { name: 'PassCustomerContactNumber' },
        { name: 'PassProspectNumber' }
    ];
    public woTypeArray: Array<any> = [];
    public ticketTypeArray: Array<any> = [];
    public pageSize: number = 10;
    public curPage: number = 1;
    public empSearchComponent = EmployeeSearchComponent;
    public istdTicketTypeSelectLabel: boolean = true;
    public totalRecords: number;
    public inputParamsEmployeeSearch: any = {
        parentMode: 'Diary',
        branchNumber: '',
        action: 0
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMDIARYDAYMAINTENANCE;
        this.browserTitle = this.pageTitle = 'Diary Day View';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.inputParams.method = this.method;
        this.inputParams.module = this.module;
        this.inputParams.operation = this.operation;
        this.setControlValue('menu', '');
        this.inputParamsEmployeeSearch['branchNumber'] = this.utils.getBranchCode();
        this.inputParamsEmployeeSearch['businessCode'] = this.businessCode();
        this.inputParamsEmployeeSearch['countryCode'] = this.countryCode();
        this.setControlValue('DiaryDate', this.globalize.parseDateToFixedFormat(new Date()));
        this.riGrid.PageSize = this.pageSize;
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.FunctionPaging = true;
        this.setControlValue('BusinessCode', this.businessCode());
        this.setControlValue('OpenWOOnly', true);
        this.riExchange.getParentHTMLValue('AllowFullUpdateRights');
        this.loadDefaults();
        this.setControlValue('PassDiaryDate', this.utils.formatDate(new Date()));
        this.setUIonParentMode();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private setUIonParentMode(): void {
        this.setControlValue('HighlightSelect', 'None');
        switch (this.parentMode) {
            case 'DiaryViewDay':
                this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('PassEmployeeCode'));
                this.setControlValue('EmployeeSurname', this.riExchange.getParentHTMLValue('PassEmployeeName'));
                this.setControlValue('DiaryDate', this.riExchange.getParentHTMLValue('PassDiaryDate'));
                this.riExchange.getParentHTMLValue('PassDiaryDate');
                this.setControlValue('WOTypeCodeSelect', this.riExchange.getParentHTMLValue('PassWOType'));
                this.setControlValue('HighlightSelect', this.riExchange.getParentHTMLValue('PassHighlight'));
                this.riExchange.getParentHTMLValue('DiaryProspectNumber');
                break;
            case 'EmployeeDiaryViewDay':
                this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('PassEmployeeCode'));
                this.setControlValue('EmployeeSurname', this.riExchange.getParentHTMLValue('PassEmployeeName'));
                this.setControlValue('DiaryDate', this.riExchange.getParentHTMLValue('PassDiaryDate'));
                this.riExchange.getParentHTMLValue('PassDiaryDate');
                this.setControlValue('transtype', 'diaryentry');
                this.riExchange.getParentHTMLValue('DiaryProspectNumber');
                break;
            case 'PipelineGrid':
                this.riExchange.getParentHTMLValue('EmployeeCode');
                this.riExchange.getParentHTMLValue('EmployeeSurname');
                this.riExchange.getParentHTMLValue('DiaryDate');
                this.setControlValue('PassDiaryDate', this.riExchange.getParentHTMLValue('DiaryDate'));
                this.riExchange.getParentHTMLValue('DiaryProspectNumber');
                break;
            case 'WorkOrderMaintenance':
                this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('PassEmployeeCode'));
                this.setControlValue('EmployeeSurname', this.riExchange.getParentHTMLValue('EmployeeName'));
                this.riExchange.getParentHTMLValue('DiaryDate');
                this.setControlValue('PassDiaryDate', this.riExchange.getParentHTMLValue('DiaryDate'));
                this.riExchange.getParentHTMLValue('DiaryProspectNumber');
                break;
            case 'WorkOrderAvailability':
            case 'WorkOrderAvailability-PassBack':
                this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('AvailEmployeeCode'));
                this.setControlValue('EmployeeSurname', this.riExchange.getParentHTMLValue('AvailEmployeeName'));
                this.setControlValue('DiaryDate', this.riExchange.getParentHTMLValue('AvailDiaryDate'));
                this.setControlValue('PassDiaryDate', this.riExchange.getParentHTMLValue('AvailDiaryDate'));
                break;
            case 'ServicePlanningEmployee':
                this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('DiaryEmployeeCode'));
                this.setControlValue('EmployeeSurname', this.riExchange.getParentHTMLValue('DiaryEmployeeSurname'));
                this.riExchange.getParentHTMLValue('DiaryDate');
                this.setControlValue('PassDiaryDate', this.riExchange.getParentHTMLValue('DiaryDate'));
                break;
        }
        if (!this.getControlValue('WOTypeCodeSelect')) {
            this.setControlValue('WOTypeCodeSelect', 'All');
        }
    }

    private buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('grTime', 'grTime', 'grTime', MntConst.eTypeTextFree, 3, false, '');
        this.riGrid.AddColumn('grDetails1', 'grDetails1', 'grDetails1', MntConst.eTypeTextFree, 130, false, '');
        this.riGrid.Complete();
        this.riGridBeforeExecute();
    }

    private riGridBeforeExecute(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        search.set(this.serviceConstants.Action, '2');
        search.set('Level', 'DiaryDay');
        search.set('WOTypeCode', this.getControlValue('WOTypeCodeSelect'));
        search.set('TicketTypeCode', this.getControlValue('TicketTypeCode'));
        search.set('HighlightType', this.getControlValue('HighlightSelect'));
        search.set('HighlightValue', '');
        search.set('DiaryDate', this.getControlValue('PassDiaryDate'));
        search.set('OpenWOOnly', this.getControlValue('OpenWOOnly') ? 'True' : 'False');
        search.set(this.serviceConstants.GridMode, '0');
        search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        search.set(this.serviceConstants.PageSize, this.pageSize.toString());
        search.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        search.set('riSortOrder', this.riGrid.SortOrder);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.method, this.module, this.operation, search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateFooter = true;
                    this.riGrid.Execute(data);
                }

            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private getPassBackEndTime(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '6');
        this.inputParams.search = search;
        let formdata: Object = {};
        formdata['BusinessCode'] = this.utils.getBusinessCode();
        formdata['Function'] = 'GetPassBackEndTime';
        formdata['StartTime'] = this.riGrid.Details.GetValue('grTime');
        formdata['EndTime'] = '';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search, formdata)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('WOResultEndTime', data.EndTime);
                }
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private loadDefaults(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '6');
        this.inputParams.search = search;
        let formdata: Object = {};
        formdata['Function'] = 'GetDefaults-WeeksByMonth';
        formdata['BusinessCode'] = this.utils.getBusinessCode();
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search, formdata)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    let monthValList = data.MonthValueList;
                    let monthdesList = data.MonthDescList;
                    let yearvalList = data.YearValueList;
                    let yearDesList = data.YearDescList;
                    let wotypeCodeList = data.WOTypeCodeList;
                    let wotypeDescList = data.WOTypeDescList;
                    let ticketTypeCodeList = data.TicketTypeCodeList;
                    let ticketTypeDescList = data.TicketTypeDescList;
                    this.setDropdown(monthValList, monthdesList, this.monthArray);
                    this.setDropdown(yearvalList, yearDesList, this.yearArray);
                    this.setDropdown(wotypeCodeList, wotypeDescList, this.woTypeArray);
                    this.setDropdown(ticketTypeCodeList, ticketTypeDescList, this.ticketTypeArray);
                    if (this.ticketTypeArray.length) {
                        this.setControlValue('TicketTypeSelect', this.ticketTypeArray[0]['value']);
                    }
                    // Check added for undefined
                    this.istdTicketTypeSelectLabel = data.TicketTypeCodeList ? true : false;
                    if (this.parentMode !== 'DiaryViewDay') {
                        this.setControlValue('EmployeeCode', data.EmployeeCode);
                        this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                        this.setControlValue('WOTypeCodeSelect', data.DefaultWOTypeCode);
                    }
                    this.setUIonParentMode();
                }
                this.buildGrid();
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private pipeLineMethod(): void {
        this.setControlValue('PassDiaryDate', this.getControlValue('DiaryDate'));
        this.setControlValue('PassEmployeeCode', this.getControlValue('EmployeeCode'));
        this.setControlValue('PassEmployeeName', this.getControlValue('EmployeeSurname'));
        this.navigate('DiaryDay', 'prospecttocontract/SalesOrderProcessing/PipelineGrid');
    }

    private setDropdown(valList: string, descList: string, arrayList: Array<any>): void {
        let valueList: Array<any> = [];
        let descriptionList: Array<any> = [];
        if (descList.length > 0) {
            descriptionList = descList.split('\n');
            valueList = valList.split('\n');
            const valueLen = valueList.length;
            for (let i = 0; i < valueLen; i++) {
                arrayList.push({
                    'text': descriptionList[i],
                    'value': valueList[i]
                });
            }
        }
    }

    public getCurrentPage(currentPage: any): void {
        this.curPage = currentPage.value;
        this.riGridBeforeExecute();
    }

    public doLookUpCall(event: any): void {
        let value = event.target.value;
        let lookupIP = [
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'EmployeeCode': value
                },
                'fields': ['EmployeeSurname']
            }
        ];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            let record = data[0];
            if (record.length > 0) {
                record = record[0];
                this.setControlValue('EmployeeCode', value);
                this.setControlValue('EmployeeSurname', record.EmployeeSurname);
            } else {
                this.setControlValue('EmployeeSurname', '');
                this.setControlValue('EmployeeCode', '');
            };
        });

    }

    public onEmployeeDataReturn(event: any): void {
        this.setControlValue('EmployeeCode', event.EmployeeCode);
        this.setControlValue('EmployeeSurname', event.EmployeeSurName);
    }

    public refresh(): void {
        if (this['uiForm'].valid)
            this.riGridBeforeExecute();
    }

    public DiaryDatePickerSelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('PassDiaryDate', value.value);
            this.setControlValue('DiaryDate', value.value);
            this.riGridBeforeExecute();
        }
    }

    public onGridRowDblClick(event: any): void {
        switch (this.riGrid.Details.GetAttribute('grTime', 'additionalproperty').substr(0, 5)) {
            case 'DATE=':
                if (this.parentMode === 'WorkOrderAvailability-PassBack') {
                    this.setControlValue('WOResultDate', this.getControlValue('PassDiaryDate'));
                    this.setControlValue('WOResultStartTime', this.riGrid.Details.GetValue('grTime'));
                    this.setControlValue('WOResultEndTime', this.riGrid.Details.GetValue('grTime'));
                    this.getPassBackEndTime();
                } else {
                    this.setControlValue('PassDiaryDate', this.getControlValue('PassDiaryDate'));
                    this.setControlValue('PassDiaryStartTime', this.riGrid.Details.GetValue('grTime'));
                    this.setControlValue('PassEmployeeCode', this.getControlValue('EmployeeCode'));
                    this.setControlValue('PassEmployeeName', this.getControlValue('EmployeeSurname'));
                    this.setControlValue('PassDiaryEntryNumber', '');
                    switch (this.getControlValue('transtype')) {
                        case 'workorder':
                            //alert('Page ContactManagement/iCABSCMWorkOrderMaintenance.htm is not ready');
                            this.navigate('DiaryDayNewAppointment', InternalMaintenanceServiceModuleRoutes.ICABSCMWORKORDERMAINTENANCE, {
                                PassDiaryDate: this.getControlValue('PassDiaryDate', true),
                                PassDiaryStartTime: this.getControlValue('PassDiaryStartTime'),
                                PassEmployeeCode: this.getControlValue('PassEmployeeCode'),
                                PassEmployeeName: this.getControlValue('PassEmployeeName'),
                                PassDiaryEntryNumber: this.getControlValue('PassDiaryEntryNumber'),
                                DiaryProspectNumber: this.getControlValue('DiaryProspectNumber') || this.riExchange.getParentHTMLValue('DiaryProspectNumber')
                            });
                            break;
                        case 'diaryentry':
                            alert('Page Application/iCABSADiaryEntry.htm is not ready');
                            //TODO   this.navigate('DiaryDayNewAppointment', InternalMaintenanceServiceModuleRoutes.ICABSADIARYENTRY);
                            break;
                        case 'ticket':
                            alert('Page ContactManagement/iCABSCMCustomerContactMaintenance.htm is not ready');
                            //TODO this.navigate('DiaryDayNewAppointment', 'ContactManagement/iCABSCMCustomerContactMaintenance.htm');
                            break;
                    }
                }
                break;
            case 'WONO=':
                this.setControlValue('PassWONumber', this.riGrid.Details.GetAttribute('grTime', 'additionalproperty').replace('WONO=', ''));
                this.setControlValue('PassEmployeeCode', this.getControlValue('EmployeeCode'));
                this.setControlValue('PassEmployeeName', this.getControlValue('EmployeeSurname'));
                if (this.getControlValue('PassWONumber') !== '0') {
                    //this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                    this.navigate('DiaryAmendAppointment', InternalMaintenanceServiceModuleRoutes.ICABSCMWORKORDERMAINTENANCE, {
                        PassWONumber: this.getControlValue('PassWONumber'),
                        PassEmployeeCode: this.getControlValue('PassEmployeeCode'),
                        PassEmployeeName: this.getControlValue('PassEmployeeName')
                    });
                }
                break;
            case 'CCNO=':
                this.setControlValue('PassCustomerContactNumber', this.riGrid.Details.GetAttribute('grTime', 'additionalproperty').replace('CCNO=', ''));
                if (this.getControlValue('PassCustomerContactNumber')) {
                    this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                    alert('Page ContactManagement/iCABSCMCustomerContactMaintenance is not ready');
                    //TODO  this.navigate('EmployeeDiary', 'ContactManagement/iCABSCMCustomerContactMaintenance');
                }
                break;
            case 'DINO=':
                this.setControlValue('PassDiaryEntryNumber', this.riGrid.Details.GetAttribute('grTime', 'additionalproperty').replace('DINO=', ''));
                this.setControlValue('PassEmployeeCode', this.getControlValue('EmployeeCode'));
                this.setControlValue('PassEmployeeName', this.getControlValue('EmployeeSurname'));
                if (this.getControlValue('PassDiaryEntryNumber') !== '0') {
                    this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                    alert('Page Application/iCABSADiaryEntry is not ready');
                    //TODO  this.navigate('DiaryDayAppointment', 'ContactManagement/iCABSADiaryEntry');
                }
                break;
            case 'MULT=':
                this.setControlValue('PassProspectNumber', this.riGrid.Details.GetAttribute('grTime', 'additionalproperty').substr(5, 9));
                this.setControlValue('PassWONumber', this.riGrid.Details.GetAttribute('grTime', 'additionalproperty').substr(15, 9));
                this.setControlValue('PassEmployeeCode', this.getControlValue('EmployeeCode'));
                this.setControlValue('PassEmployeeName', this.getControlValue('EmployeeSurname'));
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                alert('Page ContactManagement/iCABSCMWorkOrderGrid is not ready');
                //TODO  this.navigate('DiaryAmendAppointment', 'ContactManagement/iCABSCMWorkOrderGrid');
                break;
        }
    }

    public onMenuChange(event: any): void {
        if (event.target.value === 'PipelineGrid') {
            this.pipeLineMethod();
        }
    }

    public onOPenWOOnlyChange(): void {
        this.setControlValue('OpenWOOnly', this.getControlValue('OpenWOOnly') ? true : false);
        this.riGridBeforeExecute();
    }
}
