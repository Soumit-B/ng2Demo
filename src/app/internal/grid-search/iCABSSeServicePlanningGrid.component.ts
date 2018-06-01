import { Footer } from './../../../shared/components/grid/grid-structure';
import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild, EventEmitter, HostListener } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { ContractManagementModuleRoutes, InternalGridSearchSalesModuleRoutes, InternalMaintenanceServiceModuleRoutes, InternalGridSearchServiceModuleRoutes, InternalMaintenanceApplicationModuleRoutes } from './../../base/PageRoutes';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { BranchServiceAreaSearchComponent } from './../search/iCABSBBranchServiceAreaSearch';
import { ContractSearchComponent } from './../search/iCABSAContractSearch';
import { ServicePlanningGridHelper } from './iCABSSeServicePlanningGridHelper.service';

@Component({
    templateUrl: 'iCABSSeServicePlanningGrid.html',
    providers: [ServicePlanningGridHelper]
})
export class ServicePlanningGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riGridPagination') riGridPagination: PaginationComponent;

    private isSysCharReady: boolean = false;
    private isLookupReady: boolean = false;
    private isPlanningDairyOptionReady: boolean = false;
    private currentContractTypeURLParameter: string = '';
    private addElementNumber: number = 0;
    private addElementNumber2: number = 0;
    //API variables
    private queryParams = {
        method: 'service-planning/maintenance',
        module: 'planning',
        operation: 'Service/iCABSSeServicePlanningGrid'
    };
    //Subscriptions
    private dateCheckObservable: ReplaySubject<any> = new ReplaySubject(1);
    private compareWeekNumberObservable: ReplaySubject<any>;
    private getLatestWeekNumberObservable: ReplaySubject<any>;

    public pageId: string;
    //Form variables
    public controls: Array<any> = [
        //Search Fields block 1
        { name: 'BranchServiceAreaCode', type: MntConst.eAlignmentLeft },
        { name: 'EmployeeSurname', disabled: true, type: MntConst.eTypeText },
        { name: 'StartDate', required: true, disabled: true, type: MntConst.eTypeDate },
        { name: 'EndDate', required: true, disabled: true, type: MntConst.eTypeDate },
        { name: 'WeekNumber', disabled: true, type: MntConst.eTypeInteger },
        { name: 'GridPageSize', type: MntConst.eTypeInteger },
        { name: 'CManualDates' },
        //Search Fields block 2
        { name: 'NegBranchNumber' },
        { name: 'BranchName' },
        { name: 'FromDate', type: MntConst.eTypeDate },
        { name: 'UpToDate', required: true, type: MntConst.eTypeDate },
        { name: 'ServicePlanNumber', disabled: true, type: MntConst.eTypeInteger },
        { name: 'VisitTypeFilter' },
        { name: 'InServiceTypeCode' },
        { name: 'ServiceTypeDesc' },
        { name: 'SequenceNumber', type: MntConst.eTypeInteger },
        { name: 'SequenceGroupNo' },
        { name: 'SeqNoTo', type: MntConst.eTypeInteger },
        { name: 'DisplayTimes' },
        { name: 'ViewDays' },
        { name: 'ContractTypeFilter' },
        { name: 'ContractNumberSearch', type: MntConst.eAlignmentLeft },
        { name: 'DisplayAverageWeight' },
        { name: 'PlanningStatus' },
        { name: 'ContractNameSearch', type: MntConst.eTypeText },
        { name: 'DisplayServiceType' },
        { name: 'DisplayFilter', value: 'All' },
        { name: 'TownSearch', type: MntConst.eTypeText },
        { name: 'ConfApptOnly' },
        //Grid Top block fields
        { name: 'UnplannedNoOfCalls', disabled: true, type: MntConst.eTypeInteger },
        { name: 'UnplannedNoOfExchanges', disabled: true, type: MntConst.eTypeInteger },
        { name: 'UnplannedWED', type: MntConst.eTypeDecimal1 },
        { name: 'UnplannedTime', disabled: true, type: MntConst.eTypeText },
        { name: 'UnplannedNettValue', disabled: true, type: MntConst.eTypeCurrency },
        //Grid Bottom block fields - Filter Visits
        { name: 'SubtotalNoOfCalls', disabled: true, type: MntConst.eTypeInteger },
        { name: 'SubtotalNoOfExchanges', disabled: true, type: MntConst.eTypeInteger },
        { name: 'SubtotalWED', type: MntConst.eTypeDecimal1 },
        { name: 'SubtotalTime', disabled: true, type: MntConst.eTypeText },
        { name: 'SubtotalNettValue', disabled: true, type: MntConst.eTypeCurrency },
        //Grid Bottom block fields - Total Visits
        { name: 'TotalNoOfCalls', disabled: true, type: MntConst.eTypeInteger },
        { name: 'TotalNoOfExchanges', disabled: true, type: MntConst.eTypeInteger },
        { name: 'TotalWED', type: MntConst.eTypeDecimal1 },
        { name: 'TotalTime', disabled: true, type: MntConst.eTypeText },
        { name: 'TotalNettValue', disabled: true, type: MntConst.eTypeCurrency },
        //Last block fields
        { name: 'SeqNumberFrom', type: MntConst.eTypeInteger },
        { name: 'SeqNumberTo', type: MntConst.eTypeInteger },
        { name: 'PlanDays', value: '0' },
        //Hidden fields
        { name: 'BranchNumber' },
        { name: 'CancelRowid' },
        { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'PremiseNumber' },
        { name: 'PremiseName' },
        { name: 'ProductCode' },
        { name: 'ProductDesc' },
        { name: 'GetWarnMessage' },
        { name: 'RefreshGrid' },
        { name: 'ODateFrom' },
        { name: 'ODateTo' },
        { name: 'BranchServiceAreaCount' },
        { name: 'EmployeeCode' },
        { name: 'EmployeeCode1' },
        { name: 'EmployeeCode2' },
        { name: 'EmployeeSurname0' },
        { name: 'EmployeeSurname1' },
        { name: 'EmployeeSurname2' }
    ];

    //Grid Component variables
    public pageSize: number = 11;
    public curPage: number = 1;
    public totalRecords: number = 10;
    public maxColumn: number = 8;
    public isHidePagination: boolean = true;

    //Ellipsis variables
    public ellipsConf: Object = {
        serviceArea: {
            childConfigParams: {
                'parentMode': 'LookUpSendForename1'
            },
            contentComponent: BranchServiceAreaSearchComponent
        },
        contractNumber: {
            childConfigParams: {
                'parentMode': 'LookUp-ContractNumberSearch'
            },
            contentComponent: ContractSearchComponent
        }
    };
    public modalConfig: Object = {
        backdrop: 'static',
        keyboard: true
    };
    public isShowHeader: boolean = true;
    public isShowCloseButton: boolean = true;

    //Dropdown
    public dropdown: any = {
        negBranch: {
            params: {
                'parentMode': 'LookUp-NegBranch'
            },
            active: { id: '', text: '' },
            isDisabled: false,
            isRequired: false,
            isError: false,
            type: 'NegBranchNumber',
            isFocus: false
        },
        serviceType: {
            params: {
                'parentMode': 'LookUpC'
            },
            active: { id: '', text: '' },
            isDisabled: false,
            isRequired: false,
            isError: false,
            type: 'InServiceTypeCode',
            isFocus: false
        },
        planningStatus: {
            type: 'PlanningStatus'
        },
        viewDays: {
            type: 'ViewDays'
        },
        listVisitTypeFilter: [],
        listPlanningStatus: [],
        listViewDays: [],
        listContractTypeFilter: []
    };

    //Datepicker
    public datepickerType: Object = {
        startDate: 'StartDate',
        endDate: 'EndDate'
    };

    //Page Business logis
    public setFocus: any = {
        branchServiceAreaCode: new EventEmitter<boolean>(),
        startDate: new EventEmitter<boolean>(false),
        endDate: new EventEmitter<boolean>(false)
    };
    public cmdPlanCancel: String = MessageConstant.Message.Cancel;


    constructor(injector: Injector, public helper: ServicePlanningGridHelper) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEPLANNINGGRID;
        this.browserTitle = 'Create Service Plan';
        this.pageTitle = 'Service Planning';
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.helper.buildMenuOptions(this.pageParams, this.dropdown);
            this.populateUIFromFormData();
            this.applyStateRetation();
        } else {
            this.helper.init(this.pageParams);
            this.getSysCharDtetails();
            this.doLookup();
            this.setPlanningDiaryOptions();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.dateCheckObservable) {
            this.dateCheckObservable.unsubscribe();
        }
        if (this.compareWeekNumberObservable) {
            this.compareWeekNumberObservable.unsubscribe();
        }
        this.dateCheckObservable = null;
        this.compareWeekNumberObservable = null;
    }

    @HostListener('window:keydown', ['$event'])
    keyboardInput(e: KeyboardEvent): void {
        this.onKeyDownDocumnt(e);
    }

    //Start: State retaintion functionality
    private applyStateRetation(): void {
        this.dropdown.negBranch.active = { id: this.getControlValue('NegBranchNumber'), text: this.getControlValue('NegBranchNumber') + ' - ' + this.getControlValue('BranchName') };
        this.dropdown.serviceType.active = { id: this.getControlValue('InServiceTypeCode'), text: this.getControlValue('InServiceTypeCode') + ' - ' + this.getControlValue('ServiceTypeDesc') };

        //Fields
        if (this.pageParams.vEnableWED) {
            this.disableControl('UnplannedWED', true);
            this.disableControl('SubtotalWED', true);
            this.disableControl('TotalWED', true);
        }
    }
    //End: State retaintion functionality

    //Start: Syschar functionality
    private getSysCharDtetails(): void {
        let sysCharIP: any = this.helper.getSysCharReqParam(this.sysCharConstants, this.queryParams);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.speedScript.sysCharPromise(sysCharIP).then((data) => {
            if (!this.handleSuccessError(data) && data.records && data.records.length > 0) {
                this.helper.processSysCharRes(data.records, this.pageParams);
            }
            this.isSysCharReady = true;
            this.windowOnload();
        }).catch((error) => this.handleError(error));
    }
    //End: Syschar functionality

    //Start: Loockup functionality
    private doLookup(): void {
        let reqData: any = this.helper.getLoockupReq();
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(reqData).then((data) => {
            if (!this.handleSuccessError(data)) {
                this.helper.processPlanVisitStatusDescLookupRes(data, this.pageParams);
                this.helper.processContractTypeLookupRes(data, this.pageParams);
                this.helper.processSystemParameterLookupRes(data, this.pageParams);
                this.helper.processSAreaSeqGroupLookupRes(data, this.pageParams);
            }
            this.isLookupReady = true;
            this.windowOnload();
        }
        ).catch((error) => this.handleError(error));
    }
    //End: Loockup functionality

    private windowOnload(): void {
        let upToDate: any;

        if (this.isSysCharReady && this.isLookupReady && this.isPlanningDairyOptionReady) {
            this.helper.buildMenuOptions(this.pageParams, this.dropdown);
            this.setInitialSelectedValueOfDD();

            this.setControlValue('DisplayTimes', this.pageParams.vDisplayTimes);
            this.setControlValue('DisplayAverageWeight', this.pageParams.vDisplayAverageWeight);
            this.setControlValue('DisplayServiceType', this.pageParams.vDisplayServiceType);

            //Grid
            this.riGrid.FunctionUpdateSupport = true;
            this.riGrid.PageSize = 11;
            this.setControlValue('GridPageSize', 11);
            this.riGrid.UpdateHeader = true;
            this.riGrid.UpdateFooter = true;
            this.riGrid.UpdateBody = true;

            //Fields
            if (this.pageParams.vEnableWED) {
                this.disableControl('UnplannedWED', true);
                this.disableControl('SubtotalWED', true);
                this.disableControl('TotalWED', true);
            }
            this.setControlValue('BranchNumber', this.utils.getBranchCode());

            //Apply Parent Mode
            switch (this.parentMode) {
                case ServicePlanningGridHelper.SERVICE_PLAN:
                    this.cmdPlanCancel = 'Remove From Plan';
                    this.browserTitle = 'Confirmed Service Plan';
                    this.dropdown.negBranch.isFocus = true;
                    this.disableControl('BranchServiceAreaCode', true);
                    if (this.riExchange.getParentAttributeValue('BranchServiceAreaCode')) {
                        this.setControlValue('BranchServiceAreaCode', this.riExchange.getParentAttributeValue('BranchServiceAreaCode'));
                        this.setControlValue('EmployeeSurname', this.riExchange.getParentAttributeValue('EmployeeSurname'));
                    } else {
                        this.setControlValue('BranchServiceAreaCode', this.riExchange.getParentHTMLValue('BranchServiceAreaCode'));
                        this.setControlValue('EmployeeSurname', this.riExchange.getParentHTMLValue('EmployeeSurname'));
                    }
                    this.setControlValue('ServicePlanNumber', this.riExchange.getParentAttributeValue('ServicePlanNumber'));
                    this.setControlValue('StartDate', this.riExchange.getParentAttributeValue('ServicePlanStartDate'));
                    this.setControlValue('EndDate', this.riExchange.getParentAttributeValue('ServicePlanEndDate'));
                    upToDate = this.riExchange.getParentAttributeValue('ServicePlanStartDate');
                    this.setControlValue('SubtotalNoOfCalls', this.riExchange.getParentAttributeValue('ServicePlanNoOfCalls'));
                    this.setControlValue('SubtotalNoOfExchanges', this.riExchange.getParentAttributeValue('ServicePlanNoOfExchanges'));
                    this.setControlValue('SubtotalTime', this.riExchange.getParentAttributeValue('ServicePlanTime'));
                    this.setControlValue('SubtotalNettValue', this.riExchange.getParentAttributeValue('ServicePlanNettValue'));
                    this.setControlValue('TotalNoOfCalls', this.riExchange.getParentAttributeValue('ServicePlanNoOfCalls'));
                    this.setControlValue('TotalNoOfExchanges', this.riExchange.getParentAttributeValue('ServicePlanNoOfExchanges'));
                    this.setControlValue('TotalTime', this.riExchange.getParentAttributeValue('ServicePlanTime'));
                    this.setControlValue('TotalNettValue', this.riExchange.getParentAttributeValue('ServicePlanNettValue'));
                    this.setControlValue('UpToDate', this.helper.dateAdd(upToDate, 6));
                    //Show/Hide
                    this.pageParams.isFromDate = false;
                    this.pageParams.isUpToDate = false;
                    this.pageParams.isServicePlanNumber = true;
                    this.pageParams.isTrNewPlan = false;
                    this.pageParams.isTrAdjustPlan = true;
                    this.pageParams.isUnplannedTotals = false;
                    this.pageParams.isConfApptOnly = false;
                    this.pageParams.isDefaultRoutines = false;
                    //Disable Fields
                    this.pageParams.isUndoSelection = true;
                    this.buildGrid();
                    break;
                case ServicePlanningGridHelper.PRODUCTIVITY_REVIEW:
                    this.setControlValue('BranchServiceAreaCode', this.riExchange.getParentHTMLValue('BranchServiceAreaCode'));
                    this.setControlValue('StartDate', this.helper.dateAdd(this.pageParams.vEndofWeekDate, 1));
                    this.setControlValue('EndDate', this.helper.dateAdd(this.pageParams.vEndofWeekDate, 7));
                    this.setControlValue('UpToDate', this.riExchange.getParentAttributeValue('StartDate'));
                    this.onChangeBranchServiceAreaCode();
                    this.buildGrid();
                    break;
                default:
                    this.pageParams.isPlusMinus = true;
                    this.setFocus.branchServiceAreaCode.emit(true);
                    this.setControlValue('StartDate', this.helper.dateAdd(this.pageParams.vEndofWeekDate, 1));
                    this.setControlValue('EndDate', this.helper.dateAdd(this.pageParams.vEndofWeekDate, 7));
                    this.setControlValue('UpToDate', this.helper.dateAdd(this.pageParams.vEndofWeekDate, 7));
                    this.setControlValue('ServicePlanNumber', '0');
                    this.pageParams.isTrNewPlan = true;
                    this.pageParams.isTrAdjustPlan = false;
                    this.pageParams.isCmdSummaryDisabled = true;
                    this.buildGrid();
                    break;
            }
            this.getLatestWeekNumber();
            this.riGrid.RefreshRequired();
        }
    }
    private setInitialSelectedValueOfDD(): void {
        //Set dropdown default value
        this.setControlValue('VisitTypeFilter', 'All');
        if (this.riExchange.getParentMode() === ServicePlanningGridHelper.SERVICE_PLAN) {
            this.setControlValue('PlanningStatus', 'AllStatus');
        } else {
            this.setControlValue('PlanningStatus', 'All');
        }
        if (this.riExchange.getParentMode() === ServicePlanningGridHelper.SERVICE_PLAN) {
            this.setControlValue('ViewDays', 'AllThisWeek');
        } else {
            this.setControlValue('ViewDays', 'All');
        }
        this.setControlValue('ContractTypeFilter', 'All');
    }

    //Start: API call functionality
    private handleError(error: any): void {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
    }

    private handleSuccessError(data: any): boolean {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        if (data.hasError) {
            this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
        }
        return data.hasError;
    }

    private setPlanningDiaryOptions(): void {
        let search: URLSearchParams = this.getURLSearchParamObject(), formData: any = {};
        search.set(this.serviceConstants.Action, '6');

        formData.methodtype = 'maintenance';
        formData.ActionType = 'GetPlanningDiaryOptions';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe((data) => {
                if (!this.handleSuccessError(data) && data.ErrorMessageDesc) {
                    this.modalAdvService.emitMessage(new ICabsModalVO(data.ErrorMessageDesc));
                } else {
                    this.pageParams.vDisplayTimes = (data.DisplayTimes === GlobalConstant.Configuration.Yes.toLowerCase());
                    this.pageParams.vDisplayAverageWeight = (data.DisplayAverageWeight === GlobalConstant.Configuration.Yes.toLowerCase());
                    this.pageParams.vDisplayServiceType = (data.DisplayServiceType === GlobalConstant.Configuration.Yes.toLowerCase());
                }
                this.isPlanningDairyOptionReady = true;
                this.windowOnload();
            }, (error) => this.handleError(error));
    }

    private compareWeekNumber(): Observable<any> {
        let search: URLSearchParams = this.getURLSearchParamObject(), formData: Object = {}, returnData: any = false;

        if (this.compareWeekNumberObservable) {
            this.compareWeekNumberObservable.unsubscribe();
        }
        this.compareWeekNumberObservable = null;
        this.compareWeekNumberObservable = new ReplaySubject();

        search.set(this.serviceConstants.Action, '6');

        formData['ActionType'] = 'GetCompareWeekNumber';
        formData['BranchNumber'] = this.getControlValue('BranchNumber');
        formData['BranchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');
        formData['StartDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('StartDate'));
        formData['EndDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('EndDate'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData).subscribe((data) => {
            if (!this.handleSuccessError(data)) {
                returnData = this.utils.stringToBoolean(data.CompareWeekNumber);
                if (returnData) {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.PageSpecificMessage.seServicePlanningGrid.iui7808CompareWeekNumber));
                    this.setFocus.startDate.emit(true);
                }
            }
            this.compareWeekNumberObservable.next(returnData);
        }, (error) => this.handleError(error));
        this.setControlValue('GetWarnMessage', '');
        return this.compareWeekNumberObservable;
    }

    private getLatestWeekNumber(): Observable<any> {
        let search: URLSearchParams = this.getURLSearchParamObject(), formData: Object = {};

        if (this.getLatestWeekNumberObservable) {
            this.getLatestWeekNumberObservable.unsubscribe();
        }
        this.getLatestWeekNumberObservable = null;
        this.getLatestWeekNumberObservable = new ReplaySubject();

        search.set(this.serviceConstants.Action, '6');

        formData['ActionType'] = 'GetLatestWeekNumber';
        formData['BranchNumber'] = this.getControlValue('BranchNumber');
        formData['BranchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');
        formData['StartDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('StartDate'));
        formData['EndDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('EndDate'));
        formData['UpToDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('UpToDate'));
        formData['GetWarnMessage'] = this.getControlValue('GetWarnMessage');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.xhrPost(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData).then((data) => {
            if (!this.handleSuccessError(data)) {
                this.setControlValue('WeekNumber', data.WeekNumber);
                if (data.WarningMessageDesc) {
                    this.modalAdvService.emitMessage(new ICabsModalVO(data.WarningMessageDesc));
                }
            }
            this.setControlValue('GetWarnMessage', '');
            this.getLatestWeekNumberObservable.next(true);
        }).catch((error) => {
            this.handleError(error);
            this.getLatestWeekNumberObservable.next(false);
        });
        return this.getLatestWeekNumberObservable;
    }

    private fetchGridData(areaCode: any, allAreas: string): void {
        let search: URLSearchParams = this.getURLSearchParamObject(), sortOrder: any = 'Descending', formData: Object = {};
        search.set(this.serviceConstants.Action, '2');
        //grid parameters
        formData[this.serviceConstants.GridMode] = '0';
        formData[this.serviceConstants.GridHandle] = this.utils.randomSixDigitString();
        formData[this.serviceConstants.GridPageSize] = this.pageSize.toString();
        formData[this.serviceConstants.GridPageCurrent] = this.curPage.toString();
        formData['riSortOrder'] = this.riGrid.SortOrder;
        formData['HeaderClickedColumn'] = this.riGrid.HeaderClickedColumn;
        formData['riCacheRefresh'] = 'true';

        // set parameters
        formData['BranchNumber'] = this.getControlValue('BranchNumber');
        formData['StartDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('StartDate'));
        formData['EndDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('EndDate'));
        formData['FromDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('FromDate'));
        formData['UpToDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('UpToDate'));
        formData['VisitTypeFilter'] = this.getControlValue('VisitTypeFilter');
        formData['BranchServiceAreaCode'] = areaCode;
        formData['AllBranchServiceAreas'] = allAreas;
        formData['ViewDays'] = this.getControlValue('ViewDays');
        formData['PlanningStatus'] = this.getControlValue('PlanningStatus');
        formData['NegBranchNumber'] = this.getControlValue('NegBranchNumber');
        formData['ServiceTypeCode'] = this.getControlValue('InServiceTypeCode');
        formData['SequenceNumber'] = this.getControlValue('SequenceNumber');
        formData['ContractNumber'] = this.getControlValue('ContractNumberSearch');
        formData['ContractName'] = this.getControlValue('ContractNameSearch');
        formData['TownName'] = this.getControlValue('TownSearch');
        formData['ServicePlanNumber'] = this.getControlValue('ServicePlanNumber');
        formData['ContractTypeFilter'] = this.getControlValue('ContractTypeFilter');
        formData['DisplayFilter'] = this.getControlValue('DisplayFilter');
        formData['CancelRowid'] = this.getControlValue('CancelRowid');
        formData['PlanFunction'] = this.utils.booleanToString(this.pageParams.isBlnPlanFunction);
        formData['UpdateNotification'] = this.utils.booleanToString(this.pageParams.isBlnUpdateNotification);
        formData['DisplayTimes'] = this.utils.booleanToString(this.getControlValue('DisplayTimes'));
        formData['DisplayAverageWeight'] = this.utils.booleanToString(this.getControlValue('DisplayAverageWeight'));
        formData['DisplayServiceType'] = this.utils.booleanToString(this.getControlValue('DisplayServiceType'));

        if (this.pageParams.vSAreaSeqGroupAvail) {
            formData['SeqNoTo'] = this.getControlValue('SeqNoTo');
        }
        if (this.getControlValue('ConfApptOnly')) {
            formData['ConfApptOnly'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('ConfApptOnly'));
        }
        if (this.pageParams.isBlnPlanFunction) {
            formData['PlanDate'] = this.pageParams.vbPlanDate;
        }

        if (this.riGrid.Update) {
            if (this.getAttribute('Row') !== '') {
                formData['ROWID'] = this.getAttribute('ServiceCoverRowID');
                formData['VisitTypeCode'] = this.getAttribute('VisitTypeCode');
                formData['NextServiceVisitDate'] = this.riGrid.Details.GetValue('NextServiceVisitDate');
                formData['RowCount'] = this.getAttribute('Row');
                formData['PlanVisitRowID'] = this.getAttribute('PlanVisitRowID');
            } else {
                this.setAttribute('Row', '0');
            }
        }

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData).subscribe(
            (data) => {
                if (!this.handleSuccessError(data)) {
                    this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                    if (this.riGrid.Update) {
                        if (this.getAttribute('Row') !== '') {
                            this.riGrid.StartRow = this.getAttribute('Row');
                            this.riGrid.StartColumn = 0;
                            this.riGrid.UpdateHeader = false;
                            this.riGrid.UpdateBody = true;
                            this.riGrid.UpdateFooter = true;
                        }
                    }
                    this.riGrid.RefreshRequired();
                    this.riGrid.Execute(data);

                    if (data.pageData && (data.pageData.lastPageNumber * this.pageSize) > 0) {
                        this.isHidePagination = false;
                    } else {
                        this.isHidePagination = true;
                    }
                }
            },
            (error) => this.handleError(error));
    }

    private fetchUndoSelection(): void {
        let search: URLSearchParams = this.getURLSearchParamObject(), formData: Object = {};
        search.set(this.serviceConstants.Action, '6');

        formData['ActionType'] = 'UndoSelection';
        formData['BranchNumber'] = this.getControlValue('BranchNumber');
        formData['BranchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');
        formData['StartDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('StartDate'));
        formData['EndDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('EndDate'));
        formData['FromDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('FromDate'));
        formData['UpToDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('UpToDate'));
        formData['ServiceTypeCode'] = this.getControlValue('InServiceTypeCode');
        formData['NegBranchNumber'] = this.getControlValue('NegBranchNumber');
        formData['ContractNumberSearch'] = this.getControlValue('ContractNumberSearch');
        formData['ContractNameSearch'] = this.getControlValue('ContractNameSearch');
        formData['TownSearch'] = this.getControlValue('TownSearch');
        formData['SequenceNumber'] = this.getControlValue('SequenceNumber');
        formData['ContractTypeFilter'] = this.getControlValue('ContractTypeFilter');
        formData['DisplayFilter'] = this.getControlValue('DisplayFilter');
        formData['ConfApptOnly'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('ConfApptOnly'));
        formData['VisitTypeFilter'] = this.getControlValue('VisitTypeFilter');
        formData['ViewDays'] = this.getControlValue('ViewDays');
        formData['PlanningStatusFilter'] = this.getControlValue('PlanningStatus');
        if (this.pageParams.vSAreaSeqGroupAvail) {
            formData['SeqNoTo'] = this.getControlValue('SeqNoTo');
        }

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.xhrPost(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData).then((data) => {
            this.handleSuccessError(data);
            this.riGrid.RefreshRequired();
            this.riGridBeforeExecute();
        }).catch((error) => this.handleError(error));
    }
    //End: API call functionality

    //Start: Grid Private functionality
    private buildGrid(): void {
        let branchServiceAreaCode: string = this.getControlValue('BranchServiceAreaCode');
        this.riGrid.Clear();
        this.isHidePagination = true;
        if (!branchServiceAreaCode) {
            this.riGrid.AddColumn('GBranchServiceAreaCode', 'ServiceCover', 'GBranchServiceAreaCode', MntConst.eAlignmentLeft, 4);
            this.riGrid.AddColumnAlign('GBranchServiceAreaCode', MntConst.eAlignmentCenter);
        }

        this.riGrid.AddColumn('BranchServiceAreaSeqNo', 'ServiceCover', 'BranchServiceAreaSeqNo', MntConst.eTypeText, 6, (this.parentMode === ServicePlanningGridHelper.SERVICE_PLAN));
        this.riGrid.AddColumnAlign('BranchServiceAreaSeqNo', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnUpdateSupport('BranchServiceAreaSeqNo', this.pageParams.vRouteOptimisation);

        this.riGrid.AddColumn('NextServiceVisitDate', 'ServiceCover', 'NextServiceVisitDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('NextServiceVisitDate', MntConst.eAlignmentLeft);

        if (this.getControlValue('DisplayTimes')) {
            this.riGrid.AddColumn('GRoutingVisitStartTime', 'ServiceCover', 'GRoutingVisitStartTime', MntConst.eTypeText, 5);
            this.riGrid.AddColumnAlign('GRoutingVisitStartTime', MntConst.eAlignmentCenter);
        }

        this.riGrid.AddColumn('ServiceTime', 'ServiceCover', 'ServiceTime', MntConst.eTypeText, 5);
        this.riGrid.AddColumnAlign('ServiceTime', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ContractNum', 'ServiceCover', 'ContractNum', MntConst.eAlignmentLeft, 10);
        this.riGrid.AddColumnAlign('ContractNum', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('PremiseNum', 'ServiceCover', 'PremiseNum', MntConst.eTypeText, 5);
        this.riGrid.AddColumnAlign('PremiseNum', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('GPremiseName', 'ServiceCover', 'GPremiseName', MntConst.eTypeText, 14);
        this.riGrid.AddColumnAlign('GPremiseName', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnOrderable('GPremiseName', true);

        this.riGrid.AddColumn('Address', 'ServiceCover', 'Address', MntConst.eTypeText, 40);
        this.riGrid.AddColumnScreen('Address', false);
        //this.riGrid.AddColumnExport('Address', true);

        this.riGrid.AddColumn('Town', 'ServiceCover', 'Town', MntConst.eTypeText, 15);
        this.riGrid.AddColumnAlign('Town', MntConst.eAlignmentLeft);

        if (this.pageParams.vEnablePostcodeDefaulting) {
            this.riGrid.AddColumn('Postcode', 'ServiceCover', 'Postcode', MntConst.eAlignmentLeft, 10);
            this.riGrid.AddColumnAlign('Postcode', MntConst.eAlignmentLeft);
        }

        this.riGrid.AddColumn('ProdCode', 'ServiceCover', 'ProdCode', MntConst.eAlignmentLeft, 10);
        this.riGrid.AddColumnAlign('ProdCode', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('ServiceVisitFrequency', 'ServiceCover', 'ServiceVisitFrequency', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('ServiceVisitFrequency', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('ServiceQuantity', 'ServiceCover', 'ServiceQuantity', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('ServiceQuantity', MntConst.eAlignmentLeft);

        if (this.getControlValue('DisplayAverageWeight')) {
            this.riGrid.AddColumn('AverageWeight', 'ServiceCover', 'AverageWeight', MntConst.eTypeDecimal2, 5);
            this.riGrid.AddColumnAlign('AverageWeight', MntConst.eAlignmentLeft);
        }

        if (this.pageParams.vEnableWED) {
            this.riGrid.AddColumn('WEDValue', 'ServiceCover', 'WEDValue', MntConst.eTypeDecimal1, 5);
            this.riGrid.AddColumnAlign('WEDValue', MntConst.eAlignmentLeft);
        }
        if (!this.pageParams.vEnableWED && this.getControlValue('DisplayServiceType')) {
            this.riGrid.AddColumn('ServiceTypeCode', 'ServiceCover', 'ServiceTypeCode', MntConst.eAlignmentLeft, 2);
            this.riGrid.AddColumnAlign('ServiceTypeCode', MntConst.eAlignmentLeft);
        }

        this.riGrid.AddColumn('VisitsDueAndCompleted', 'ServiceCover', 'VisitsDueAndCompleted', MntConst.eTypeText, 5);
        this.riGrid.AddColumnAlign('VisitsDueAndCompleted', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('LastRoutineVisitDate', 'ServiceCover', 'LastRoutineVisitDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('LastRoutineVisitDate', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('VisitTypeCode', 'ServiceCover', 'VisitTypeCode', MntConst.eAlignmentLeft, 2);
        this.riGrid.AddColumnAlign('VisitTypeCode', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('NotificationStatus', 'ServiceCover', 'NotificationStatus', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('NotificationStatus', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('M', 'ServiceCover', 'M', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('M', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('T', 'ServiceCover', 'T', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('T', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('W', 'ServiceCover', 'W', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('W', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('Th', 'ServiceCover', 'Th', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('Th', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('F', 'ServiceCover', 'F', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('F', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('Sa', 'ServiceCover', 'Sa', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('Sa', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('Su', 'ServiceCover', 'Su', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('Su', MntConst.eAlignmentLeft);

        if (this.parentMode !== ServicePlanningGridHelper.SERVICE_PLAN) {
            this.riGrid.AddColumn('Planned', 'ServiceCover', 'Planned', MntConst.eTypeImage, 1);
            this.riGrid.AddColumnAlign('Planned', MntConst.eAlignmentLeft);
        }

        this.riGrid.AddColumn('PlanCancel', 'ServiceCover', 'PlanCancel', MntConst.eTypeCheckBox, 1, false, '');
        this.riGrid.AddColumnAlign('PlanCancel', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('PortfolioStatus', 'ServiceCover', 'PortfolioStatus', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('PortfolioStatus', MntConst.eAlignmentLeft);


        this.riGrid.AddColumnOrderable('BranchServiceAreaSeqNo', true);
        if (this.getControlValue('DisplayTimes')) {
            this.riGrid.AddColumnOrderable('GRoutingVisitStartTime', true);
        }
        this.riGrid.AddColumnOrderable('ContractNum', true);
        this.riGrid.AddColumnOrderable('ProdCode', true);
        this.riGrid.AddColumnOrderable('ServiceVisitFrequency', true);
        this.riGrid.AddColumnOrderable('NextServiceVisitDate', true, true);
        this.riGrid.AddColumnOrderable('VisitsDueAndCompleted', true);
        this.riGrid.AddColumnOrderable('PortfolioStatus', true);
        this.riGrid.AddColumnOrderable('Town', true);
        if (!this.pageParams.vEnableWED && this.getControlValue('DisplayServiceType')) {
            this.riGrid.AddColumnOrderable('ServiceTypeCode', true);
        }

        this.riGrid.AddColumnOrderable('ServiceTime', true);
        this.riGrid.AddColumnOrderable('VisitTypeCode', true);

        if (this.pageParams.vEnablePostcodeDefaulting) {
            this.riGrid.AddColumnOrderable('Postcode', true);
        }

        this.riGrid.Complete();
    }

    private riGridValidationError(): void {
        this.riGrid.RefreshRequired();
        this.riGrid.ResetGrid();
        this.setFocus.startDate.emit(true);
    }

    private riGridBeforeExecute(): void {
        this.riGridBeforeExecuteValidation1();
    }

    private riGridBeforeExecuteValidation1(): void {
        let dateCheckValidation: any;

        dateCheckValidation = this.dateCheck();
        if (dateCheckValidation instanceof Observable) {
            dateCheckValidation.subscribe((data) => {
                if (!data) {
                    this.riGridBeforeExecuteValidation2();
                }
            });
        } else if (!dateCheckValidation) {
            this.riGridBeforeExecuteValidation2();
        }
    }

    private riGridBeforeExecuteValidation2(): void {
        let search: URLSearchParams = this.getURLSearchParamObject(), sortOrder: any = 'Descending', sDate: any, eDate: any, today: Date = new Date(), areaCode: any, allAreas: string;

        eDate = this.getControlValue('EndDate');
        if (this.getControlValue('CManualDates') && eDate) {
            eDate = this.globalize.parseDateStringToDate(eDate);
            if (eDate < today) {
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.PageSpecificMessage.seServicePlanningGrid.iui7808Msg1));
                if (this.getControlValue('FromDate')) {
                    this.setControlValue('StartDate', this.globalize.parseDateStringToDate(this.getControlValue('FromDate')));
                    return;
                }
            }
            sDate = this.getControlValue('StartDate');
            if (sDate) {
                sDate = this.globalize.parseDateStringToDate(sDate);
                if (eDate < sDate) {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.PageSpecificMessage.seServicePlanningGrid.iui7808Msg2));
                    if (eDate) {
                        this.setControlValue('EndDate', sDate);
                    }
                    return;
                }
            }
        }

        this.pageParams.blnRefreshRequired = false;
        areaCode = this.getControlValue('BranchServiceAreaCode');
        if (this.riGrid.Update) {
            this.pageParams.blnRefreshRequired = true;
            if (!areaCode) {
                areaCode = this.getAttribute('BranchServiceAreaCode');
            }
        }

        allAreas = this.getControlValue('BranchServiceAreaCode') ? GlobalConstant.Configuration.No : GlobalConstant.Configuration.Yes;

        this.getLatestWeekNumber().subscribe((data) => {
            this.fetchGridData(areaCode, allAreas);
        });
    }

    //End: Grid Private functionality

    private onChangeNegBranchNumber(data?: any): void {
        if (data) {
            this.setControlValue('NegBranchNumber', data.BranchNumber);
            this.setControlValue('BranchName', data.BranchName);
        }
        this.pageParams.isVbErrorMessageFlagged = false;
    }

    private onChangeInServiceTypeCode(data?: any): void {
        if (data) {
            this.setControlValue('InServiceTypeCode', data.inServiceTypeCode);
            this.setControlValue('ServiceTypeDesc', data.ServiceTypeDesc);
        }
        this.pageParams.isVbErrorMessageFlagged = false;
    }

    private onChangeViewDays(data: any): void {
        if (this.parentMode === ServicePlanningGridHelper.SERVICE_PLAN) {
            if (this.getControlValue('ViewDays') !== 'All') {
                this.setControlValue('PlanningStatus', 'I');
            } else {
                this.setControlValue('PlanningStatus', 'All');
            }
        }
    }

    private onChangePlanningStatus(data: any): void {
        if (this.parentMode === ServicePlanningGridHelper.SERVICE_PLAN) {
            if (this.getControlValue('PlanningStatus') === 'I') {
                this.setControlValue('ViewDays', 'All');
            } else {
                this.setControlValue('ViewDays', 'AllThisWeek');
            }
        }
    }
    private onDeactivateBranchServiceAreaCode(): void {
        if (this.pageParams.isVbErrorMessageFlagged) {
            this.setControlValue('BranchServiceAreaCode', '');
        }
        this.pageParams.isAllocate = false;
        this.pageParams.isCmdSummaryDisabled = true;
        if (this.getControlValue('BranchServiceAreaCode')) {
            this.pageParams.isAllocate = true;
            this.pageParams.isCmdSummaryDisabled = false;
            if (this.pageParams.vEnableTechDiary) {
                this.checkTechVisitDiary();
            }
        }
        this.pageParams.isVbErrorMessageFlagged = false;
    }

    private onDeactivateNegBranchNumber(): void {
        if (this.pageParams.isVbErrorMessageFlagged) {
            this.setControlValue('NegBranchNumber', '');
        }
        this.pageParams.isAllocate = false;
        this.pageParams.isCmdSummaryDisabled = true;
        if (this.getControlValue('BranchServiceAreaCode')) {
            this.pageParams.isAllocate = true;
            this.pageParams.isCmdSummaryDisabled = false;
            if (this.pageParams.vEnableTechDiary) {
                this.checkTechVisitDiary();
            }
        }
        this.pageParams.isVbErrorMessageFlagged = false;
    }

    private onDeactivateInServiceTypeCode(): void {
        this.pageParams.isVbErrorMessageFlagged = false;
    }

    private onDeactivateUpToDate(): void {
        if (this.getControlValue('UpToDate')) { this.riGrid.RefreshRequired(); }
    }

    private checkTechVisitDiary(): void {
        let branchServiceAreaCode: any = this.getControlValue('BranchServiceAreaCode'), count: number = 0;
        if (branchServiceAreaCode) {
            count = branchServiceAreaCode.split(',').length;
        }
        this.setControlValue('BranchServiceAreaCount', count);
        this.pageParams.isTdGotoDiary = (count > 3) ? false : true;
    }

    private setTotalCallsUnitsTimesNettValues(arrInfo?: Array<any>): void {
        arrInfo = (arrInfo) ? arrInfo : ['0', '0', '0', '00:00', '0', '0', '0', '00:00', '0', '0', '0', '00:00', '0', '0', '0', '0', '0'];
        this.setControlValue('UnplannedNoOfCalls', arrInfo[1]);
        this.setControlValue('UnplannedNoOfExchanges', arrInfo[2]);
        this.setControlValue('UnplannedTime', arrInfo[3]);
        this.setControlValue('UnplannedNettValue', arrInfo[4]);
        this.setControlValue('SubtotalNoOfCalls', arrInfo[5]);
        this.setControlValue('SubtotalNoOfExchanges', arrInfo[6]);
        this.setControlValue('SubtotalTime', arrInfo[7]);
        this.setControlValue('SubtotalNettValue', arrInfo[8]);
        this.setControlValue('TotalNoOfCalls', arrInfo[9]);
        this.setControlValue('TotalNoOfExchanges', arrInfo[10]);
        this.setControlValue('TotalTimeInteger', arrInfo[11]);
        this.setControlValue('TotalTime', arrInfo[12]);
        this.setControlValue('TotalNettValue', arrInfo[13]);
        if (this.pageParams.vEnableWED) {
            this.setControlValue('UnplannedWED  ', arrInfo[14]);
            this.setControlValue('SubtotalWED', arrInfo[15]);
            this.setControlValue('TotalWED', arrInfo[16]);
        }
    }

    private setAttributes(rTR: any): Array<any> {
        let cProp: any;
        this.addElementNumber = 0;
        this.setAttribute('BranchServiceAreaCode', '');
        if (!this.getControlValue('BranchServiceAreaCode')) {
            this.addElementNumber = 1;
            if (rTR.children && rTR.children.length > 0)
                this.setAttribute('BranchServiceAreaCode', this.riGrid.Details.GetValue('GBranchServiceAreaCode'));
        }
        (this.pageParams.vEnablePostcodeDefaulting) ? this.addElementNumber2 = 1 : this.addElementNumber = 0;
        // All values now passed in the following AdditionalProperty
        cProp = this.riGrid.Details.GetAttribute('ContractNum', 'AdditionalProperty');
        cProp = (cProp) ? cProp.split('^') : '';
        if (cProp) {
            this.setAttribute('ContractRowID', cProp[1]);
            this.setAttribute('PremiseRowID', cProp[2]);
            this.setAttribute('ServiceCoverRowID', cProp[3]);
            this.setAttribute('VisitTypeCode', this.riGrid.Details.GetValue('VisitTypeCode'));
            this.setAttribute('PlanVisitRowID', cProp[0]);
            this.setAttribute('Row', cProp[4]);
            this.setAttribute('ContractTypeCode', cProp[5]);
        }
        return cProp;
    }

    private updateEvents(e: Event): void {
        let objSrc: any, objTR: any, objSrcName: string, vRowid: any, cancelRowid: string;

        objSrc = e.srcElement;
        objTR = objSrc.parentElement;
        objSrcName = this.riGrid.CurrentColumnName;
        cancelRowid = this.getControlValue('CancelRowid');
        switch (objSrcName) {
            case 'PlanCancel':
                //Add the rows rowid to a variable so we only need to run the function once
                vRowid = this.riGrid.Details.GetAttribute('PlanCancel', 'RowID');
                //Chceck to see if the rowid can be added to our string holding variable
                if (this.riGrid.CurrentColumnName) {
                    if (cancelRowid.search(vRowid) === -1 && !cancelRowid) {
                        cancelRowid = vRowid;
                    } else {
                        cancelRowid = cancelRowid + ';' + vRowid;
                    }
                }
                this.setControlValue('CancelRowid', cancelRowid);
                //Tidy up the text string, a tidy string is a happy string
                if (cancelRowid) {
                    cancelRowid = cancelRowid.replace(/;;/g, ';');
                    cancelRowid = cancelRowid.replace(/;$s/g, '');
                    if (cancelRowid.startsWith(';')) { cancelRowid.replace(';', ''); }
                }
                break;
            case 'NotificationStatus':
                if (this.parentMode !== ServicePlanningGridHelper.SERVICE_PLAN) {
                    this.setAttributes(objTR.parentElement);
                    this.pageParams.isBlnUpdateNotification = true;
                    this.riGrid.Update = true;
                    this.riGridBeforeExecute();
                }
                break;
            case 'M':
            case 'T':
            case 'W':
            case 'Th':
            case 'F':
            case 'Sa':
            case 'Su':
                if (this.parentMode !== ServicePlanningGridHelper.SERVICE_PLAN) {
                    if (this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'RowID') !== 1) {
                        this.setAttributes(objTR.parentElement.parentElement);
                        this.pageParams.isBlnPlanFunction = true;
                        this.pageParams.vbPlanDate = this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'RowID');
                        this.pageParams.isVbErrorGrid = true; //assume there is an error and set to false if updated correctly
                        this.riGrid.Update = true;
                        this.riGridBeforeExecute();
                    }
                }
                break;
        }

    }

    /**
     * keyCode == 107 : Numpad + button
     * keyCode == 109 : Numpad - button
     * keyCode == 106 : Numpad * button
     * @param e
     */
    private onKeyDownDocumnt(e: any): void {
        let vcBeforeStartDate: any, vcBeforeEndDate: any, eDate: any, today: Date = new Date(), isValidKey: boolean = false;
        if (this.parentMode !== ServicePlanningGridHelper.SERVICE_PLAN && !this.getControlValue('CManualDates')) {
            switch (e.keyCode) {
                case 106:
                    //* GoTo Current WeekEndingDate
                    this.setControlValue('StartDate', this.helper.dateAdd(this.pageParams.vEndofWeekDate, 1));
                    this.setControlValue('EndDate', this.helper.dateAdd(this.pageParams.vEndofWeekDate, 7));
                    this.setControlValue('UpToDate', this.getControlValue('EndDate'));
                    if (this.getControlValue('FromDate'))
                        this.setControlValue('FromDate', this.globalize.parseDateStringToDate(this.getControlValue('StartDate')));
                    isValidKey = true;
                    break;
                case 107:
                    //+ 7 Days
                    this.setControlValue('StartDate', this.helper.dateAdd(this.getControlValue('StartDate'), 7));
                    this.setControlValue('EndDate', this.helper.dateAdd(this.getControlValue('EndDate'), 7));
                    this.setControlValue('UpToDate', this.getControlValue('EndDate'));
                    if (this.getControlValue('FromDate'))
                        this.setControlValue('FromDate', this.globalize.parseDateStringToDate(this.getControlValue('StartDate')));
                    isValidKey = true;
                    break;
                case 109:
                    //- 7 Days
                    this.setControlValue('StartDate', this.helper.dateAdd(this.getControlValue('StartDate'), -7));
                    this.setControlValue('EndDate', this.helper.dateAdd(this.getControlValue('EndDate'), -7));
                    this.setControlValue('UpToDate', this.getControlValue('EndDate'));
                    if (this.getControlValue('FromDate'))
                        this.setControlValue('FromDate', this.globalize.parseDateStringToDate(this.getControlValue('StartDate')));
                    eDate = this.globalize.parseDateStringToDate(this.getControlValue('EndDate'));
                    if (eDate < today) {
                        // #37671 AIH Removed logic to stop users going back
                        this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.PageSpecificMessage.seServicePlanningGrid.planWeekPassed));
                    }
                    isValidKey = true;
                    break;
            }
            if (isValidKey === true) {
                this.setControlValue('GetWarnMessage', GlobalConstant.Configuration.Yes);
                this.getLatestWeekNumber();
                this.riGrid.RefreshRequired();
                this.riGrid.ResetGrid();
                this.isHidePagination = true;
            }
        }
    }

    //Start: Ellipsis functionality
    public onServiceAreaEllipsisDataReceived(data: any): void {
        if (data) {
            this.setControlValue('BranchServiceAreaCode', data.BranchServiceAreaCode);
            this.onChangeBranchServiceAreaCode();
        }
    }

    public onContractNumberEllipsisDataReceived(data: any): void {
        if (data) {
            this.setControlValue('ContractNumberSearch', data.ContractNumber);
        }
    }
    //End: Ellipsis functionality

    //Start: Date picker functionality
    public onSelecteDatePicker(evt: any, type: string): void {
        switch (type) {
            case this.datepickerType['startDate']:
                this.setFocus.endDate.emit(true);
                this.buildGrid();
                this.riGrid.RefreshRequired();
                break;
            case this.datepickerType['endDate']:
                this.dateCheck();
                break;
        }
    }
    //End: Date picker functionality

    //Start: Dropdown functionality
    public onChangeDD(e: any, type: any): void {
        switch (type) {
            case this.dropdown.negBranch.type:
                this.onChangeNegBranchNumber(e);
                break;
            case this.dropdown.serviceType.type:
                this.onChangeInServiceTypeCode(e);
                break;
            case this.dropdown.planningStatus.type:
                this.onChangePlanningStatus(e);
                break;
            case this.dropdown.viewDays.type:
                this.onChangeViewDays(e);
                break;
        }
    }
    //Start: Dropdown functionality

    //Start: Grid functionality
    public riGridAfterExecute(): void {
        let gridFooterData: String = '', arrInfo: any[], arrInfoValue: string, errorMessageArr: any[];
        if (!this.riGrid.Update && this.riGrid.Mode !== '3' && !this.pageParams.isVbErrorGrid) {
            //Todo: Grid Footer not yet rady till now. So, need to implement later.
            if (this.riGrid.HTMLGridFooter && this.riGrid.HTMLGridFooter.children && this.riGrid.HTMLGridFooter.children.length > 0) {
                gridFooterData = this.riGrid.HTMLGridFooter.children[0].children[0].children[0].innerHTML;
                if (gridFooterData) {
                    arrInfo = gridFooterData.split('|');
                    this.setTotalCallsUnitsTimesNettValues(arrInfo);
                    arrInfoValue = arrInfo[14];
                    if (this.pageParams.vEnableWED) {
                        arrInfoValue = arrInfo[17];
                    }
                    this.pageParams.isBlnClosedCalendar = (arrInfoValue && arrInfoValue.toLowerCase() === GlobalConstant.Configuration.Yes.toLowerCase()) ? true : false;
                    this.helper.getLegend(this.pageParams, this.riGrid);
                } else {
                    this.setTotalCallsUnitsTimesNettValues();
                }
            }
        }
        if (this.pageParams.isBlnPlanFunction) {
            //Todo: Grid Footer not yet rady till now. So, need to implement later.
            if (gridFooterData) {
                arrInfo = gridFooterData.split('|');
                errorMessageArr = arrInfo[arrInfo.length - 1].split(';');
                this.modalAdvService.emitError(errorMessageArr);
            }
            this.pageParams.isVbErrorGrid = false;
        }
        this.riGrid.Update = false;
        this.riGridAfterExecuteEx();
    }

    public riGridAfterExecuteEx(): void {
        if (this.pageParams.isBlnRefreshRequired) {
            this.riGrid.RefreshRequired();
        }
    }

    public getCurrentPage(data: any): void {
        this.curPage = data.value;
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

    public riGridSort(e: Event): void {
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

    public riGridBodyOnClick(e: Event): void {
        this.updateEvents(e);
    }

    public riGridBodyDblClick(e: Event): void {
        let addDisplayTime: number = 0, objSrc: any, objTR: any, objSrcName: string, contractTypeCode: any, val: any, cProp: any;

        objSrc = e.srcElement;
        objTR = objSrc.parentElement;
        objSrcName = this.riGrid.CurrentColumnName;
        if (this.getControlValue('DisplayTimes')) {
            addDisplayTime = 1;
        }
        switch (objSrcName) {
            case 'ContractNum':
            case 'PremiseNum':
            case 'ProdCode':
            case 'VisitTypeCode':
            case 'PortfolioStatus':
            case 'NextServiceVisitDate':
            case 'BranchServiceAreaSeqNo':
                if (objSrcName === 'BranchServiceAreaSeqNo' && this.pageParams.vRouteOptimisation && this.parentMode === ServicePlanningGridHelper.SERVICE_PLAN) {
                    return;
                }
                if (objSrcName === 'PortfolioStatus' && !objSrc.AdditionalProperty) {
                    //'The source object PortfolioStatus is an image so needs to go up two levels to the TR
                    objTR = objSrc.parentElement.parentElement;
                }
                cProp = this.setAttributes(objTR);
                contractTypeCode = this.getAttribute('ContractTypeCode');
                if (contractTypeCode === 'C') { this.currentContractTypeURLParameter = ''; }
                else if (contractTypeCode === 'J') { this.currentContractTypeURLParameter = '<job>'; }
                else if (contractTypeCode === 'P') { this.currentContractTypeURLParameter = '<product>'; }
                switch (objSrcName) {
                    case 'ContractNum':
                        this.navigate(ServicePlanningGridHelper.SERVICE_PLANNING, ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                            CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter,
                            ContractRowID: cProp[1]
                        });
                        break;
                    case 'PremiseNum':
                        this.navigate(ServicePlanningGridHelper.SERVICE_PLANNING, ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, { CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter });
                        break;
                    case 'ProdCode':
                        if (this.currentContractTypeURLParameter === '<product>') {
                            this.navigate(ServicePlanningGridHelper.SERVICE_PLANNING, InternalGridSearchSalesModuleRoutes.ICABSAPRODUCTSALESSCDETAILMAINTENANCE, { CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter });
                        } else {
                            this.navigate(ServicePlanningGridHelper.SERVICE_PLANNING, ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, { CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter });
                        }
                        break;
                    case 'BranchServiceAreaSeqNo':
                        if (this.parentMode === ServicePlanningGridHelper.SERVICE_PLAN) {
                            this.navigate('ConfirmedPlan', InternalMaintenanceServiceModuleRoutes.ICABSSESERVICEVISITMAINTENANCE, { CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter });
                        }
                        break;
                    case 'VisitTypeCode':
                        //this.navigate((this.parentMode === ServicePlanningGridHelper.SERVICE_PLAN) ? ServicePlanningGridHelper.SERVICE_PLAN : ServicePlanningGridHelper.SERVICE_PLANNING, ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE + this.currentContractTypeURLParameter);
                        this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                        break;
                    case 'NextServiceVisitDate':
                        this.navigate((this.parentMode === ServicePlanningGridHelper.SERVICE_PLAN) ? ServicePlanningGridHelper.SERVICE_PLAN : ServicePlanningGridHelper.SERVICE_PLANNING, InternalMaintenanceApplicationModuleRoutes.ICABSAVISITAPPOINTMENTMAINTENANCE, {
                            CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter,
                            PlanVisitRowID: cProp[0]
                        });
                        break;
                    case 'PortfolioStatus':
                        if (objSrc.AdditionalProperty) {
                            //Contract Number
                            val = objTR.children(3 + this.addElementNumber + addDisplayTime);
                            if (val && val.getValue()) {
                                val = val.getValue().splice(-8);
                                if (val) { this.setControlValue('ContractNumber', val); }
                            }

                            //Contract Name
                            val = objTR.children(5 + this.addElementNumber + addDisplayTime);
                            if (val) { this.setControlValue('ContractName', val.AdditionalProperty); }

                            //Premice Number
                            val = objTR.children(4 + this.addElementNumber + addDisplayTime);
                            if (val) { this.setControlValue('PremiseNumber', val.getValue()); }

                            //Premice Name
                            val = objTR.children(5 + this.addElementNumber + addDisplayTime);
                            if (val) { this.setControlValue('PremiseName', val.getValue()); }

                            //Product Code
                            val = objTR.children(7 + this.addElementNumber + addDisplayTime + this.addElementNumber2);
                            if (val) { this.setControlValue('ProductCode', val.getValue()); }

                            //Product Desc
                            val = objTR.children(7 + this.addElementNumber + addDisplayTime + this.addElementNumber2);
                            if (val) { this.setControlValue('ProductDesc', val.AdditionalProperty); }

                            switch (objSrc.RowID) {
                                case 'Contract':
                                    this.setControlValue('PremiseNumber', '');
                                    this.setControlValue('PremiseName', '');
                                    this.setControlValue('ProductCode', '');
                                    this.setControlValue('ProductDesc', '');
                                    break;
                                case 'Premise':
                                    this.setControlValue('ProductCode', '');
                                    this.setControlValue('ProductDesc', '');
                                    break;
                            }

                            this.navigate(ServicePlanningGridHelper.SERVICE_PLANNING, InternalGridSearchServiceModuleRoutes.ICABSCMCUSTOMERCONTACTHISTORYGRID,
                                {
                                    CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter
                                });
                        }
                        break;
                }
                break;
        }
    }
    //End: Grid functionality

    //Start: REST API Call functionality
    public onChangeBranchServiceAreaCode(): void {
        let search: URLSearchParams = this.getURLSearchParamObject(), formData: Object = {}, dt: Date = new Date();
        if (this.getControlValue('BranchServiceAreaCode')) {
            this.setControlValue('EmployeeCode', '');
            this.setControlValue('EmployeeCode1', '');
            this.setControlValue('EmployeeCode2', '');
            this.setControlValue('EmployeeSurname0', '');
            this.setControlValue('EmployeeSurname1', '');
            this.setControlValue('EmployeeSurname2', '');

            search.set(this.serviceConstants.Action, '6');

            formData['ActionType'] = 'GetEmployeeSurname';
            formData['BranchNumber'] = this.getControlValue('BranchNumber');
            formData['BranchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');
            formData['StartDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('StartDate'));
            formData['DTE'] = this.globalize.parseDateToFixedFormat(dt);
            formData['TME'] = dt.getTime();

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.xhrPost(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData).then((data) => {
                let vEmployeeCodes: any[] = [], vEmployeeSurnames: any[] = [], len: number;
                this.pageParams.isVbErrorMessageFlagged = false;
                if (this.handleSuccessError(data) || data.ErrorMessageDesc) {
                    this.setControlValue('BranchServiceAreaCode', '');
                    this.modalAdvService.emitError(new ICabsModalVO(data.ErrorMessageDesc));
                    this.pageParams.isVbErrorMessageFlagged = true;
                } else if (data.WarningMessageDesc) {
                    this.modalAdvService.emitMessage(new ICabsModalVO(data.WarningMessageDesc));
                }
                this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                if (data.EmployeeCodes && data.EmployeeSurname) {
                    vEmployeeCodes = data.EmployeeCodes.split(',');
                    vEmployeeSurnames = data.EmployeeSurname.split(',');
                    len = vEmployeeCodes.length;
                    for (let index = 0; index < len; index++) {
                        switch (index) {
                            case 0:
                                this.setControlValue('EmployeeCode', vEmployeeCodes[0]);
                                this.setControlValue('EmployeeSurname0', vEmployeeSurnames[0]);
                                break;
                            case 1:
                                this.setControlValue('EmployeeCode1', vEmployeeCodes[1]);
                                this.setControlValue('EmployeeSurname1', vEmployeeSurnames[1]);
                                break;
                            case 2:
                                this.setControlValue('EmployeeCode2', vEmployeeCodes[2]);
                                this.setControlValue('EmployeeSurname2', vEmployeeSurnames[2]);
                                break;

                        }

                    }
                }
                this.onDeactivateBranchServiceAreaCode();
            }).catch((error) => this.handleError(error));
        }

        this.pageParams.isTdGotoDiary = false;
        if (this.pageParams.vEnableTechDiary && this.getControlValue('BranchServiceAreaCode')) {
            this.pageParams.isTdGotoDiary = true;
        }
        //Clear out total calls, units, times and nett values
        this.setTotalCallsUnitsTimesNettValues();
        this.riGrid.ResetGrid();
        this.buildGrid();
        this.riGrid.RefreshRequired();
        this.isHidePagination = true;
    }

    public onChangeSequenceGroupNo(): void {
        let search: URLSearchParams = this.getURLSearchParamObject(), formData: Object = {}, dt: Date = new Date();
        if (this.getControlValue('SequenceGroupNo')) {
            search.set(this.serviceConstants.Action, '6');

            formData['ActionType'] = 'GetSeqNoRange';
            formData['SequenceGroupNo'] = this.getControlValue('SequenceGroupNo');
            formData['SeqNoFrom'] = this.getControlValue('SeqNoFrom');
            formData['SeqNoTo'] = this.getControlValue('SeqNoTo');

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.xhrPost(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData).then((data) => {
                this.pageParams.isVbErrorMessageFlagged = false;
                if (this.handleSuccessError(data)) {
                    this.setControlValue('SequenceNumber', '');
                    this.setControlValue('SeqNoTo', '');
                    this.modalAdvService.emitError(new ICabsModalVO(data.ErrorMessageDesc));
                    this.pageParams.isVbErrorMessageFlagged = true;
                } else {
                    this.setControlValue('SequenceNumber', data.SeqNoFrom);
                    this.setControlValue('SeqNoTo', data.SeqNoTo);
                    this.buildGrid();
                    this.riGrid.RefreshRequired();
                }

            }).catch((error) => this.handleError(error));
        } else {
            this.setControlValue('SequenceNumber', '');
            this.setControlValue('SeqNoTo', '');
        }
    }

    public onClickCmdDefaultRoutines(): void {
        let search: URLSearchParams = this.getURLSearchParamObject(), formData: Object = {};
        search.set(this.serviceConstants.Action, '6');

        formData['ActionType'] = 'DefaultRoutines';
        formData['BranchNumber'] = this.getControlValue('BranchNumber');
        formData['StartDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('StartDate'));
        formData['EndDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('EndDate'));
        formData['FromDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('FromDate'));
        formData['UpToDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('UpToDate'));
        formData['VisitTypeFilter'] = this.getControlValue('VisitTypeFilter');
        formData['BranchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');
        formData['ViewDays'] = this.getControlValue('ViewDays');
        formData['NegBranchNumber'] = this.getControlValue('NegBranchNumber');
        formData['ServiceTypeCode'] = this.getControlValue('InServiceTypeCode');
        formData['SequenceNumber'] = this.getControlValue('SequenceNumber');
        formData['ContractTypeFilter'] = this.getControlValue('ContractTypeFilter');
        formData['DisplayFilter'] = this.getControlValue('DisplayFilter');
        formData['ContractNumberSearch'] = this.getControlValue('ContractNumberSearch');
        formData['ContractNameSearch'] = this.getControlValue('ContractNameSearch');
        formData['TownSearch'] = this.getControlValue('TownSearch');
        formData['ConfApptOnly'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('ConfApptOnly'));
        formData['PlanningStatusFilter'] = this.getControlValue('PlanningStatus');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.xhrPost(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData).then((data) => {
            this.handleSuccessError(data);
            this.riGrid.RefreshRequired();
            this.riGridBeforeExecute();
        }).catch((error) => this.handleError(error));
    }

    public onClickCmdPlanSubmit(): void {
        let isValid: boolean = true, search: URLSearchParams, formData: Object;
        this.uiForm.controls['SeqNumberFrom'].markAsTouched();
        this.uiForm.controls['SeqNumberTo'].markAsTouched();
        if (this.getControlValue('SeqNumberFrom') !== 0 && this.getControlValue('SeqNumberFrom')) {
            this.riExchange.riInputElement.markAsError(this.uiForm, 'SeqNumberFrom');
            isValid = false;
        }
        if (this.getControlValue('SeqNumberTo') !== 0 && this.getControlValue('SeqNumberTo')) {
            this.riExchange.riInputElement.markAsError(this.uiForm, 'SeqNumberTo');
            isValid = false;
        }
        if (isValid) {
            search = this.getURLSearchParamObject();
            formData = {};

            search.set(this.serviceConstants.Action, '6');

            formData['ActionType'] = 'PlanSubmit';
            formData['BranchNumber'] = this.getControlValue('BranchNumber');
            formData['BranchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');
            formData['StartDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('StartDate'));
            formData['EndDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('EndDate'));
            formData['FromDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('FromDate'));
            formData['UpToDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('UpToDate'));
            formData['ServiceTypeCode'] = this.getControlValue('InServiceTypeCode');
            formData['NegBranchNumber'] = this.getControlValue('NegBranchNumber');
            formData['ContractNumberSearch'] = this.getControlValue('ContractNumberSearch');
            formData['ContractNameSearch'] = this.getControlValue('ContractNameSearch');
            formData['TownSearch'] = this.getControlValue('TownSearch');
            formData['SequenceNumber'] = this.getControlValue('SequenceNumber');
            formData['SeqNumberFrom'] = this.getControlValue('SeqNumberFrom');
            formData['SeqNumberTo'] = this.getControlValue('SeqNumberTo');
            formData['PlanDays'] = this.getControlValue('PlanDays');
            formData['ContractTypeFilter'] = this.getControlValue('ContractTypeFilter');
            formData['DisplayFilter'] = this.getControlValue('DisplayFilter');
            formData['ConfApptOnly'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('ConfApptOnly'));
            formData['VisitTypeFilter'] = this.getControlValue('VisitTypeFilter');
            formData['ViewDays'] = this.getControlValue('ViewDays');
            formData['PlanningStatusFilter'] = this.getControlValue('PlanningStatus');

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.xhrPost(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData).then((data) => {
                let errorList: Array<string> = [];
                if (data.ErrorMessageDesc) { errorList.push(data.ErrorMessageDesc); }
                if (data.TimeWarningMessage) { errorList.push(data.TimeWarningMessage); }
                if (errorList.length > 0) {
                    this.modalAdvService.emitError(new ICabsModalVO(errorList));
                }
                this.riGrid.RefreshRequired();
                this.riGridBeforeExecute();
            }).catch((error) => this.handleError(error));
        }
    }

    public onClickCmdUndoSelection(): void {
        this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.PageSpecificMessage.seServicePlanningGrid.undoSelectionConfirm, null, this.fetchUndoSelection.bind(this)));
    }

    public onClickCmdGotoDiary(): void {
        let iCount: any = this.getControlValue('BranchServiceAreaCount');
        iCount = this.utils.CInt(iCount);
        if (iCount === 1) {
            //this.navigate(ServicePlanningGridHelper.SERVICE_PLANNING, ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE + this.currentContractTypeURLParameter);
            this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
        }
    }
    //End: REST API Call functionality

    public dateCheck(): boolean | Observable<any> {
        let returnData: any = false, sDate: any, eDate: any, diff: number;
        sDate = this.getControlValue('StartDate');
        eDate = this.getControlValue('EndDate');
        if (sDate && eDate) {
            sDate = this.globalize.parseDateStringToDate(sDate);
            eDate = this.globalize.parseDateStringToDate(eDate);
            diff = this.utils.dateDiffInDays(sDate, eDate) + 1;
            if (diff > 7) {
                returnData = true;
                this.setControlValue('EndDate', this.utils.addDays(eDate, 6));
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.PageSpecificMessage.seServicePlanningGrid.iui7808DateCheckError));
                this.setFocus.startDate.emit(true);
                this.riGrid.ResetGrid();
                this.buildGrid();
                this.riGrid.RefreshRequired();
            } else {
                return this.compareWeekNumber();
            }
        }
        //false: no error, true: error
        return returnData;
    }

    public onChangeGridPageSize(): void {
        if (this.getControlValue('GridPageSize')) {
            this.riGrid.PageSize = this.utils.CInt(this.getControlValue('GridPageSize'));
            this.pageSize = this.riGrid.PageSize;
        }
    }

    //Start: Checkbox functionality
    public onClickCheckBox(data?: boolean): void {
        if (data) {
            this.buildGrid();
            this.riGrid.RefreshRequired();
        }
    }

    public onClickConfApptOnly(e: any): void {
        this.pageParams.cmdDefaultRoutinesLbl = (e.target.checked) ? MessageConstant.PageSpecificMessage.seServicePlanningGrid.defaultAppointments : MessageConstant.PageSpecificMessage.seServicePlanningGrid.defaultRoutines;
    }

    public onClickCManualDates(e: any): void {
        if (e.target.checked) {
            this.riGrid.Clear();
            this.riGrid.RefreshRequired();
            this.riGrid.ResetGrid();
            this.isHidePagination = true;
            this.riExchange.riInputElement.Enable(this.uiForm, 'StartDate');
            this.riExchange.riInputElement.Enable(this.uiForm, 'EndDate');
            this.setControlValue('ODateFrom', this.getControlValue('StartDate'));
            this.setControlValue('ODateTo', this.getControlValue('EndDate'));
            this.setControlValue('StartDate', '');
            this.setControlValue('EndDate', '');
        } else {
            this.riGrid.Clear();
            this.riGrid.RefreshRequired();
            this.riGrid.ResetGrid();
            this.setControlValue('StartDate', this.getControlValue('ODateFrom'));
            this.setControlValue('EndDate', this.getControlValue('ODateTo'));
            this.riExchange.riInputElement.Disable(this.uiForm, 'StartDate');
            this.riExchange.riInputElement.Disable(this.uiForm, 'EndDate');
            this.setControlValue('ODateFrom', '');
            this.setControlValue('ODateTo', '');
            this.setFocus.branchServiceAreaCode.emit(true);
            this.setControlValue('StartDate', this.helper.dateAdd(this.pageParams.vEndofWeekDate, 1));
            this.setControlValue('EndDate', this.helper.dateAdd(this.pageParams.vEndofWeekDate, 7));
            this.setControlValue('UpToDate', this.helper.dateAdd(this.pageParams.vEndofWeekDate, 7));
            this.setControlValue('ServicePlanNumber', '0');
            this.pageParams.isTrNewPlan = true;
            this.pageParams.isTrAdjustPlan = false;
            this.pageParams.isCmdSummaryDisabled = true;
            this.buildGrid();
            this.getLatestWeekNumber();
            this.riGrid.RefreshRequired();
        }
    }
    //End: Checkbox functionality

    public onClickCmdShowFilter(): void {
        this.pageParams.isDivHidden = !this.pageParams.isDivHidden;
        this.pageParams.cmdShowFilterLbl = (this.pageParams.isDivHidden) ? MessageConstant.PageSpecificMessage.seServicePlanningGrid.showFilters : MessageConstant.PageSpecificMessage.seServicePlanningGrid.hideFilters;
    }

    public onClickCmdSummary(): void {
        if (this.pageParams.blnRefreshRequired) {
            this.riGrid.RefreshRequired();
            this.riGridBeforeExecute();
        }
        if (this.getControlValue('BranchServiceAreaCode')) {
            //this.navigate(ServicePlanningGridHelper.SERVICE_PLANNING, ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE + this.currentContractTypeURLParameter);//iCABSSeServicePlanningSummaryGrid
            this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
        }
    }

    public onClickCancel(): void {
        let mode: string;
        mode = (this.parentMode === ServicePlanningGridHelper.SERVICE_PLAN) ? 'Confirm' : 'Plan';
        //this.navigate(mode, ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE + this.currentContractTypeURLParameter);//iCABSAVisitCancellationMaintenance
        //this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));

        this.navigate(ServicePlanningGridHelper.SERVICE_PLANNING, ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE);
    }
}
