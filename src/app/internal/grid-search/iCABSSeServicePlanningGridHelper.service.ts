import { MessageConstant } from './../../../shared/constants/message.constant';
import { Injectable } from '@angular/core';

import { GlobalizeService } from './../../../shared/services/globalize.service';
import { RiExchange } from './../../../shared/services/riExchange';
import { Utils } from './../../../shared/services/utility';

@Injectable()
export class ServicePlanningGridHelper {
    public static readonly PLAN_VISIT_STATUS_DESC: number = 1;
    public static readonly SERVICE_PLAN: string = 'ServicePlan';
    public static readonly SERVICE_PLANNING: string = 'ServicePlanning';
    public static readonly PRODUCTIVITY_REVIEW: string = 'ProductivityReview';

    public gLanguageCode: any;

    constructor(private utils: Utils, private riExchange: RiExchange, private globalize: GlobalizeService) {
        this.gLanguageCode = this.riExchange.LanguageCode();
    }

    /**
     * Add day/month/year with the provided Date value and return a updated date.
     * @param dt Date value
     * @param addValue Value to add with date
     * @param type Type of Date value. e.g: d=day, m=monty, y=year. default: string
     * @param returnType Return type. e.g: s=string, d=Date. default: Date
     * @returns Return updated date value.
     */
    public dateAdd(dt: any, addValue: any, type?: string, returnType?: string): any {
        let tempDate: any, returnValue: any;
        if (dt) {
            type = type || 'd';
            returnType = returnType || 'd';
            if (typeof dt === 'string') {
                tempDate = this.globalize.parseDateStringToDate(dt);
            } else if (Object.prototype.toString.call(dt) === '[object Date]') {
                tempDate = dt;
            }
            switch (type) {
                case 'd':
                    returnValue = this.utils.addDays(tempDate, addValue);
                    break;
            }
            switch (returnType) {
                case 's':
                    returnValue = this.globalize.parseDateToFixedFormat(returnValue);
                    break;
                case 'd':
                    returnValue = this.globalize.parseDateToFixedFormat(returnValue);
                    returnValue = this.globalize.parseDateStringToDate(returnValue);
                    break;
            }
        }
        return returnValue;
    }

    public init(pageParams: any): void {
        //Show/Hide
        pageParams.isFromDate = true;
        pageParams.isUpToDate = true;
        pageParams.isServicePlanNumber = false;
        pageParams.isTrNewPlan = false;
        pageParams.isTrAdjustPlan = false;
        pageParams.isUnplannedTotals = true;
        pageParams.isConfApptOnly = true;
        pageParams.isDefaultRoutines = true;
        pageParams.isAllocate = false;
        pageParams.isPlusMinus = false;
        pageParams.isTdGotoDiary = false;
        pageParams.isTrNPClosed = false;
        pageParams.isTrAPClosed = false;
        pageParams.isTrSuspend = false;
        pageParams.isDivHidden = false;
        //Disable Fields
        pageParams.isUndoSelection = false;
        pageParams.isCmdSummaryDisabled = false;
        //BusinessLogic
        pageParams.isBlnRefreshRequired = false;
        pageParams.isBlnPlanFunction = false;
        pageParams.isBlnUpdateNotification = false;
        pageParams.vbPlanDate = '';
        pageParams.isVbErrorMessageFlagged = false;
        pageParams.isVbErrorGrid = false;
        pageParams.isBlnClosedCalendar = false;
        pageParams.cmdShowFilterLbl = MessageConstant.PageSpecificMessage.seServicePlanningGrid.hideFilters;
        pageParams.cmdDefaultRoutinesLbl = MessageConstant.PageSpecificMessage.seServicePlanningGrid.defaultRoutines;

    }

    public getLogicalStringValue(data: boolean): string {
        return data ? 'True' : 'False';
    }

    //Start: Syschar functionality
    public getSysCharReqParam(sysCharConstants: any, queryParams: any): any {
        let sysCharList: number[], sysCharIP: any;
        sysCharList = [
            sysCharConstants.SystemCharEnableInstallsRemovals, //190
            sysCharConstants.SystemCharEnablePostcodeDefaulting, //120
            sysCharConstants.SystemCharEnableRouteOptimisationSoftwareIntegration, //2260
            sysCharConstants.SystemCharEnableWED, //3370
            sysCharConstants.SystemCharEnableServiceCoverDisplayLevel, //3360
            sysCharConstants.SystemCharEnableTechDiary //4120
        ];
        sysCharIP = {
            module: queryParams.module,
            operation: queryParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        return sysCharIP;
    }
    public processSysCharRes(record: any, pageParams: any): void {
        pageParams.vEnableInstallsRemovals = record[0].Required;
        pageParams.vEnablePostcodeDefaulting = record[1].Required;
        pageParams.vRouteOptimisation = record[2].Required;
        pageParams.vEnableWED = record[3].Required;
        pageParams.vEnableServiceCoverDispLev = record[4].Required;
        pageParams.vEnableTechDiary = record[5].Required;
    }
    //End: Syschar functionality

    //Start: Loockup functionality
    public getLoockupReq(): any {
        let reqData: any[] = [
            {
                'table': 'PlanVisitStatusLang',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'LanguageCode': this.gLanguageCode },
                'fields': ['PlanVisitStatusCode', 'PlanVisitStatusDesc']
            }, {
                'table': 'PlanVisitStatus',
                'query': { 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['PlanVisitStatusCode', 'PlanVisitSystemDesc']
            }, {
                'table': 'ContractType',
                'query': { 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['ContractTypeCode', 'ContractTypeDesc']
            }, {
                'table': 'SystemParameter',
                'query': { 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['SystemParameterEndOfWeekDay']
            }, {
                'table': 'SAreaSeqGroup',
                'query': { 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['SequenceGroupNo', 'SequenceGroupDesc', 'FromSeqNo', 'ToSeqNo']
            }
        ];
        return reqData;
    }

    public processPlanVisitStatusDescLookupRes(data: any, pageParams: any): void {
        let pvsLang: any[], pvs: any[], codeList: any[] = ['U', 'I', 'C', 'P', 'V'];

        pageParams.vUnplannedDesc = '';
        pageParams.vInPlanningDesc = '';
        pageParams.vCancelledDesc = '';
        pageParams.vPlannedDesc = '';
        pageParams.vVisitedDesc = '';

        if (data && data.length > 0) {
            if (data[0] && data[0].length > 0) {
                pvsLang = data[0];
            }
            if (data[1] && data[1].length > 0) {
                pvs = data[1];
            }

            codeList.forEach(code => {
                let filterData = pvsLang.find(e => ((e.PlanVisitStatusCode === code)));
                if (filterData) {
                    this.setPlanVisitStatusDescInVariables(code, filterData.PlanVisitStatusDesc, pageParams);
                } else {
                    filterData = pvs.find(e => ((e.PlanVisitSystemDesc === code)));
                    if (filterData) {
                        this.setPlanVisitStatusDescInVariables(code, filterData.PlanVisitSystemDesc, pageParams);
                    }
                }

            });
        }
    }
    public setPlanVisitStatusDescInVariables(code: any, data: any, pageParams: any): void {
        switch (code) {
            case 'U':
                pageParams.vUnplannedDesc = data;
                break;
            case 'I':
                pageParams.vInPlanningDesc = data;
                break;
            case 'C':
                pageParams.vCancelledDesc = data;
                break;
            case 'P':
                pageParams.vPlannedDesc = data;
                break;
            case 'V':
                pageParams.vVisitedDesc = data;
                break;
        }
    }
    public processContractTypeLookupRes(data: any, pageParams: any): void {
        let list: any[], codeList: any[] = ['C', 'J', 'P'];

        pageParams.vContractTypeConDesc = '';
        pageParams.vContractTypeJobDesc = '';
        pageParams.vContractTypeProdDesc = '';

        if (data && data.length > 0) {
            if (data[2] && data[2].length > 0) {
                list = data[2];
            }
            codeList.forEach(code => {
                let filterData = list.find(e => ((e.ContractTypeCode === code)));
                if (filterData) {
                    switch (code) {
                        case 'C':
                            pageParams.vContractTypeConDesc = filterData.ContractTypeDesc;
                            break;
                        case 'J':
                            pageParams.vContractTypeJobDesc = filterData.ContractTypeDesc;
                            break;
                        case 'P':
                            pageParams.vContractTypeProdDesc = filterData.ContractTypeDesc;
                            break;
                    }
                }
            });
        }
    }
    public processSystemParameterLookupRes(data: any, pageParams: any): void {
        let value: any;

        pageParams.vEndofWeekDay = 1;
        if (data && data.length > 0 && data[3] && data[3].length > 0) {
            value = data[3][0];
            if (value.SystemParameterEndOfWeekDay < 7) {
                pageParams.vEndofWeekDay = value.SystemParameterEndOfWeekDay;
            }
        }
        pageParams.vEndofWeekDate = this.utils.getEndofWeekDate(pageParams.vEndofWeekDay);
    }
    public processSAreaSeqGroupLookupRes(data: any, pageParams: any): void {
        pageParams.vSAreaSeqGroupAvail = false;
        if (data && data.length > 0 && data[4] && data[4].length > 0) {
            pageParams.vSAreaSeqGroupAvail = true;
        }
    }
    //End: Loockup functionality

    public buildMenuOptions(pageParams: any, dropdown: any): void {
        //Add options to the visit type filter
        dropdown.listVisitTypeFilter = [];
        dropdown.listVisitTypeFilter.push({ value: 'All', text: 'All' });
        dropdown.listVisitTypeFilter.push({ value: 'Routine', text: 'Routine' });
        if (pageParams.vEnableInstallsRemovals) {
            dropdown.listVisitTypeFilter.push({ value: 'Installation', text: 'Installation' });
            dropdown.listVisitTypeFilter.push({ value: 'Removal', text: 'Removal' });
        }
        dropdown.listVisitTypeFilter.push({ value: 'CancelRemove', text: 'Cancel And Remove' });
        if (pageParams.vEnableInstallsRemovals) {
            dropdown.listVisitTypeFilter.push({ value: 'Delivery', text: 'Delivery' });
            dropdown.listVisitTypeFilter.push({ value: 'Repair', text: 'Repair' });
        }
        dropdown.listVisitTypeFilter.push({ value: 'Urgent', text: 'Urgent' });
        dropdown.listVisitTypeFilter.push({ value: 'Upgrade', text: 'Upgrade' });
        dropdown.listVisitTypeFilter.push({ value: 'FollowUp', text: 'Follow Up' });
        if (pageParams.vEnableServiceCoverDispLev) {
            dropdown.listVisitTypeFilter.push({ value: 'ComponentExchange', text: 'Component Exchange' });
        }

        //Add options to planning status filter
        dropdown.listPlanningStatus = [];
        if (this.riExchange.getParentMode() === ServicePlanningGridHelper.SERVICE_PLAN) {
            dropdown.listPlanningStatus.push({ value: 'AllStatus', text: 'All' });
            dropdown.listPlanningStatus.push({ value: 'P', text: pageParams.vPlannedDesc });
            dropdown.listPlanningStatus.push({ value: 'V', text: pageParams.vVisitedDesc });
        } else {
            dropdown.listPlanningStatus.push({ value: 'All', text: 'All' });
            dropdown.listPlanningStatus.push({ value: 'U', text: pageParams.vUnplannedDesc });
            dropdown.listPlanningStatus.push({ value: 'I', text: pageParams.vInPlanningDesc });
            dropdown.listPlanningStatus.push({ value: 'C', text: pageParams.vCancelledDesc });
        }

        //Add options to view days filter
        dropdown.listViewDays = [];
        if (this.riExchange.getParentMode() === ServicePlanningGridHelper.SERVICE_PLAN) {
            dropdown.listViewDays.push({ value: 'AllThisWeek', text: 'All This Week' });
        } else {
            dropdown.listViewDays.push({ value: 'All', text: 'All' });
            dropdown.listViewDays.push({ value: 'AllThisWeek', text: 'All This Week' });
        }
        dropdown.listViewDays.push({ value: '0', text: 'Monday' });
        dropdown.listViewDays.push({ value: '1', text: 'Tuesday' });
        dropdown.listViewDays.push({ value: '2', text: 'Wednesday' });
        dropdown.listViewDays.push({ value: '3', text: 'Thursday' });
        dropdown.listViewDays.push({ value: '4', text: 'Friday' });
        dropdown.listViewDays.push({ value: '5', text: 'Saturday' });
        dropdown.listViewDays.push({ value: '6', text: 'Sunday' });

        //Add options to contract types  filter
        dropdown.listContractTypeFilter = [];
        dropdown.listContractTypeFilter.push({ value: 'All', text: 'All' });
        if (pageParams.vContractTypeConDesc) {
            dropdown.listContractTypeFilter.push({ value: 'C', text: pageParams.vContractTypeConDesc });
        }
        if (pageParams.vContractTypeJobDesc) {
            dropdown.listContractTypeFilter.push({ value: 'J', text: pageParams.vContractTypeJobDesc });
        }
        if (pageParams.vContractTypeProdDesc) {
            dropdown.listContractTypeFilter.push({ value: 'P', text: pageParams.vContractTypeProdDesc });
        }


    }

    public getLegend(pageParams: any, riGrid: any): void {
        if (pageParams.isBlnClosedCalendar) {
            (pageParams.isTrNewPlan) ? pageParams.isTrNPClosed = true : pageParams.isTrAPClosed = true;
        } else {
            (!pageParams.isTrNewPlan) ? pageParams.isTrNPClosed = false : pageParams.isTrAPClosed = false;
        }
        pageParams.isTrSuspend = false;
        if (riGrid.Details.GetAttribute('ServiceQuantity', 'AdditionalProperty') === 'yes') {
            pageParams.isTrSuspend = true;
        }
    }
}
