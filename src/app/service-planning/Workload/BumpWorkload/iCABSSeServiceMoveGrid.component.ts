import * as moment from 'moment';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { RiExchange } from './../../../../shared/services/riExchange';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { GridAdvancedComponent } from './../../../../shared/components/grid-advanced/grid-advanced';
import { BaseComponent } from './../../../../app/base/BaseComponent';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { PageIdentifier } from './../../../../app/base/PageIdentifier';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';
import { QueryParametersCallback, ErrorCallback, MessageCallback } from '../../../../app/base/Callback';
import { InternalGridSearchSalesModuleRoutes } from '../../../base/PageRoutes';
import { BranchServiceAreaSearchComponent } from './../../../internal/search/iCABSBBranchServiceAreaSearch';

@Component({
    templateUrl: 'iCABSSeServiceMoveGrid.html'
})

export class ServiceMoveGridComponent extends BaseComponent implements OnInit, OnDestroy, QueryParametersCallback, AfterViewInit, ErrorCallback, MessageCallback {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riGridPagination') riGridPagination: PaginationComponent;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('branchServiceArea') branchServiceArea;

    public queryParams: any = {
        operation: 'Service/iCABSSeServiceMoveGrid',
        module: 'bump',
        method: 'service-planning/maintenance',
        ActionSearch: '0',
        Actionupdate: '6',
        ActionEdit: '2',
        ActionDelete: '3'
    };

    // Prompt Modal popup
    public errorTitle: string;
    public errorContent: string;
    public messageTitle: string;
    public messageContent: string;
    public showMessageHeader: boolean = true;
    public showErrorHeader: boolean = true;
    public showCloseButton: boolean = true;
    private gridReady: boolean = false;
    // local variables

    public ishidden: boolean = false;
    public DateReadOnly: boolean = true;
    public DateDisabledStartDate: boolean = true;
    public DateDisabledEndDate: boolean = true;
    public buttonTitle: string = 'Hide Filters';
    public seperator: string = ' - ';

    // Grid Component Variables
    public pageId: string;
    public pageSize: number = 10;
    public currentPage: number = 1;
    public totalRecords: number = 1;
    private headerClicked: string = '';
    private sortType: string = 'ASC';
    private selectedRow: any = -1;
    public postData: any = {};

    public search = new URLSearchParams();
    private lookUpSubscription: Subscription;

    // inputParams for BranchServiceAreaCode_onkeydown
    public ellipsis = {
        branchServiceArea: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            showAddNew: false,
            autoOpenSearch: false,
            parentMode: 'LookUp-Emp',
            component: BranchServiceAreaSearchComponent
        },
        ServiceType: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            showAddNew: false,
            autoOpenSearch: false,
            parentMode: 'LookUpC',
            component: '', // TODO: Convert into Dropdown; render page Business/iCABSBServiceTypeSearch.htm
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            }
        }
    };
    // inputParams for NegBranchNumber_onkeydown
    public negBranch = {
        params: {
            'parentMode': 'LookUp-NegBranch'
        },
        active: {
            id: '',
            text: ''
        },
        brnCode: 0,
        brnName: '',
        disabled: false,
        required: false
    };

    // inputParams for InServiceTypeCode_onkeydown
    public inputParamsInServiceTypeSearch: any = {
        parentMode: 'LookUpC'
    };

    // Legend
    public legend = [
        { label: 'Available to move', color: '#66cccc' },
        { label: 'Can not move', color: '#c8f5f5' },
        { label: 'Late', color: '#ffcbcb' },
        { label: 'Not Completed', color: '#dddddd' }
    ];

    public controls = [
        { name: 'BranchServiceAreaCode', readonly: true, disabled: false, required: false },
        { name: 'EmployeeSurname', readonly: true, disabled: true, required: false },
        { name: 'StartDate', readonly: true, disabled: false, required: true },
        { name: 'EndDate', readonly: true, disabled: false, required: false },
        { name: 'WeekNumber', readonly: false, disabled: true, required: false },
        { name: 'GridPageSize', readonly: true, disabled: false, required: true },
        { name: 'SequenceNumber', readonly: false, disabled: false, required: false },
        { name: 'ContractNumberSearch', readonly: false, disabled: false, required: false },
        { name: 'InServiceTypeCode', readonly: false, disabled: false, required: false },
        { name: 'ServiceTypeDesc', readonly: false, disabled: true, required: false },
        { name: 'Frequency', readonly: false, disabled: false, required: false },
        { name: 'cmdToDate', readonly: true, disabled: false, required: false },
        { name: 'cmdPlanMove', readonly: false, disabled: false, required: false },
        { name: 'RelatedVisits', readonly: true, disabled: false, required: false },
        { name: 'UnplannedNoOfCalls', readonly: false, disabled: true, required: false },
        { name: 'UnplannedNoOfExchanges', readonly: false, disabled: true, required: false },
        { name: 'UnplannedWED', readonly: false, disabled: true, required: false },
        { name: 'UnplannedTime', readonly: false, disabled: true, required: false }
    ];

    // public routePageParams: any = {
    //     'parentMode': '',
    //     'currentContractType': '',
    //     'CurrentContractTypeURLParameter': ''
    // };
    public routeParams: any = {};

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEMOVEGRID;
        this.setCurrentContractType();
        this.setErrorCallback(this);
        this.setURLQueryParameters(this);
    }

    public setCurrentContractType(): void {
        this.pageParams.currentContractType =
            this.riExchange.getCurrentContractType();
        this.pageParams.currentContractTypeLabel =
            this.riExchange.getCurrentContractTypeLabel();
    }

    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    }

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    }

    public getURLQueryParameters(param: any): void {
        this.pageParams.ParentMode = param['parentMode'];
        this.pageParams.reroute = param['reroute'];
        this.pageParams.CurrentContractTypeURLParameter = param['currentContractTypeURLParameter'];
        this.pageParams.BackLabel = param['backLabel'];
        this.pageParams.Plan = param['Plan'];
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.setPageTitle();
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.pageParams.StartDate = this.formatDate(this.getControlValue('StartDate').toString());
            this.pageParams.EndDate = this.formatDate(this.getControlValue('EndDate').toString());
            this.BuildGrid();
            this.riGrid_BeforeExecute();
        } else {
            this.getSysCharDtetails(); // set System Charecters - SPEED SCRIPT
        }
        // set Grid OderableColumn
    }

    ngOnDestroy(): void {
        // this.lookUpSubscription.unsubscribe();
        //super.ngOnDestroy();
    }

    ngAfterViewInit(): void {
        this.setErrorCallback(this);
        this.setMessageCallback(this);
    }

    private window_onload(): void {
        this.pageParams.tdUnplannedWEDLab = false;

        this.routeParams = this.riExchange.getRouterParams();
        this.setPageTitle();

        this.riExchange.renderForm(this.uiForm, this.controls);

        this.pageParams.tdButtonsDisplay = false;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'GridPageSize', '11');
        this.pageSize = 11;

        this.pageParams.todayDate = new Date();
        this.pageParams.TodayDate = this.utils.formatDate(this.pageParams.todayDate);
        this.pageParams.StartDate = this.pageParams.todayDate;
        this.pageParams.EndDate = new Date(this.utils.convertDate(this.utils.addDays(this.pageParams.todayDate, 7).toString()));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'StartDate', this.pageParams.TodayDate);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EndDate', this.utils.addDays(this.pageParams.todayDate, 7));
        this.formData.OriginalStartDate = this.pageParams.TodayDate;

        if (this.pageParams.Plan === 'Bump') {
            this.riExchange.riInputElement.Disable(this.uiForm, 'Frequency');
            this.pageParams.Frequency = '26';
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Frequency', this.pageParams.Frequency);
            this.formData.MaxEndDate = this.utils.addDays(this.pageParams.todayDate, 14);
            this.pageParams.tdStartLabel = 'Visits From';
            this.pageParams.tdEndLabel = 'To';
        } else {
            this.pageParams.tdStartLabel = 'Move Visits Due On';
            this.pageParams.tdEndLabel = 'To The';
        }

        this.GetLatestWeekNumber();
        this.riGrid.RefreshRequired();
        if (this.pageParams.ParentMode === 'ToGrid') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'StartDate', this.getControlValue('EndDate'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EndDate', this.getControlValue('EndDate'));
            if (this.getControlValue('EndDate'))
                this.pageParams.StartDate = this.formatDate(this.getControlValue('EndDate').toString());
            if (this.getControlValue('EndDate'))
                this.pageParams.EndDate = this.formatDate(this.getControlValue('EndDate').toString());
            // this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', this.riExchange.getParentHTMLValue('BranchServiceAreaCode'));
            // this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', this.riExchange.getParentHTMLValue('EmployeeSurname'));
            // this.pageParams.NegBranchNumber = this.riExchange.getParentHTMLValue('NegBranchNumber');
            // this.riExchange.riInputElement.SetValue(this.uiForm, 'InServiceTypeCode', this.riExchange.getParentHTMLValue('InServiceTypeCode'));
            // this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeDesc', this.riExchange.getParentHTMLValue('ServiceTypeDesc'));
            // this.formData.InServiceTypeCode = this.riExchange.getParentHTMLValue('InServiceTypeCode');
            // this.riExchange.riInputElement.SetValue(this.uiForm, 'SequenceNumber', this.riExchange.getParentHTMLValue('SequenceNumber'));
            // this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumberSearch', this.riExchange.getParentHTMLValue('ContractNumberSearch'));
            // this.riExchange.riInputElement.SetValue(this.uiForm, 'Frequency', this.riExchange.getParentHTMLValue('Frequency'));

            this.riExchange.riInputElement.Disable(this.uiForm, 'BranchServiceAreaCode');
            this.riExchange.riInputElement.Disable(this.uiForm, 'NegBranchNumber');
            this.riExchange.riInputElement.Disable(this.uiForm, 'SequenceNumber');
            this.riExchange.riInputElement.Disable(this.uiForm, 'InServiceTypeCode');
            this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumberSearch');
            this.riExchange.riInputElement.Disable(this.uiForm, 'Frequency');
            this.riExchange.riInputElement.Disable(this.uiForm, 'EndDate');
            this.ellipsis.branchServiceArea.disabled = true;
            this.ellipsis.ServiceType.disabled = true;
            this.negBranch.disabled = true;

            this.pageParams.tdButtonsDisplay = true;
            this.BuildGrid();
        } else {
            this.pageParams.tdButtonsDisplay = false;
            this.BuildGrid();
        }

        this.riExchange.riInputElement.SetValue(this.uiForm, 'RelatedVisits', true);;
    } // end of window_onload()

    public setPageTitle(): void {
        if (this.pageParams.Plan === 'Bump') {
            this.pageTitle = 'Bump Service Plan';
        } else {
            this.pageTitle = 'Move Service Plan';
        }
        this.utils.setTitle(this.pageTitle);
    }

    private getSysCharDtetails(): any {
        //SysChar
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableInstallsRemovals,
            this.sysCharConstants.SystemCharEnablePostcodeDefaulting,
            this.sysCharConstants.SystemCharEnableRouteOptimisationSoftwareIntegration,
            this.sysCharConstants.SystemCharEnableWED
        ];
        let sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vEnableInstallsRemovals = record[0]['Required'];
            this.pageParams.vEnablePostcodeDefaulting = record[1]['Required'];
            this.pageParams.vRouteOptimisation = record[2]['Required'];
            this.pageParams.vEnableWED = record[3]['Required'];
            this.SetHTMLPageSettings(); // Set Page Settings - depending on SysCharDtetails
            this.getLookupCallSearchParameter(); // Set value of vEndofWeekDate

            this.doLookupformData('U'); // set value of vUnplannedDesc
            this.doLookupformData('C'); // set value of vCancelledDesc
            this.doLookupformData('I'); // set value of vInPlanningDesc
            this.doLookupformData('P'); // set value of vPlannedDesc

            this.window_onload();
        });
    }

    public doLookupformData(ipPlanVisitStatusCode: string): void {
        let lookupIP = [
            {
                'table': 'PlanVisitStatusLang',
                'query': {
                    'LanguageCode': this.utils.getDefaultLang(),
                    'PlanVisitStatusCode': ipPlanVisitStatusCode
                },
                'fields': ['PlanVisitStatusDesc']
            },
            {
                'table': 'PlanVisitStatus',
                'query': {
                    'PlanVisitStatusCode': ipPlanVisitStatusCode
                },
                'fields': ['PlanVisitSystemDesc']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (ipPlanVisitStatusCode === 'U') {
                this.pageParams.vUnplannedDesc = data[1][0];
            }
            if (ipPlanVisitStatusCode === 'I') {
                this.pageParams.vInPlanningDesc = data[1][0];
            }
            if (ipPlanVisitStatusCode === 'C') {
                this.pageParams.vCancelledDesc = data[1][0];
            }
            if (ipPlanVisitStatusCode === 'P') {
                this.pageParams.vPlannedDesc = data[1][0];
            }
        });
    }

    private getLookupCallSearchParameter(): void {
        let lookupIP = [
            {
                'table': 'SystemParameter',
                'query': {},
                'fields': ['SystemParameterEndOfWeekDay']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data[0][0].SystemParameterEndOfWeekDay < 7) {
                this.pageParams.vEndofWeekDay = data[0][0].SystemParameterEndOfWeekDay;
            } else {
                this.pageParams.vEndofWeekDay = 1;
            }
            // this.pageParams.StartDate = this.getControlValue('StartDate');
            let d = this.pageParams.StartDate ? this.pageParams.StartDate : this.pageParams.todayDate;
            this.pageParams.vEndofWeekDay = ((6 - d.getDay()) + this.pageParams.vEndofWeekDay);
            this.pageParams.vbEndofWeekDate = this.utils.addDays(d, this.pageParams.vEndofWeekDay);
        });
    }

    private formatDate(date: string): Date {
        let getDate = date;
        if (moment(getDate, 'DD/MM/YYYY', true).isValid()) {
            getDate = this.utils.convertDate(getDate);
        } else {
            getDate = this.utils.formatDate(getDate);
        }
        return new Date(getDate);
    }


    private GetLatestWeekNumber(): void {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
        let todayDate = this.utils.formatDate(new Date());

        query.set('EndDate', this.getControlValue('EndDate'));
        query.set('ActionType', 'GetLatestWeekNumber');
        query.set('GetWarnMessage', this.formData.GetWarnMessage ? this.formData.GetWarnMessage : '');
        this.utils.getLoggedInBranch(this.businessCode(), this.countryCode()).subscribe((data) => {
            if (data.results && data.results[0] && data.results[0].length > 0) {
                this.pageParams.loggedInBranch = data.results[0][0].BranchNumber;
            } else if (data.results && data.results[1] && data.results[1].length > 0) {
                this.pageParams.loggedInBranch = data.results[1][0].BranchNumber;
            } else {
                this.pageParams.loggedInBranch = '';
            }
        });
        query.set('BranchNumber', this.utils.getBranchCode());
        query.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.errorService.emitError(data);
                } else {
                    this.pageParams.WeekNumber = data.WeekNumber;
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'WeekNumber', this.pageParams.WeekNumber);
                    if (data.WarningMessageDesc) {
                        this.formData.GetWarnMessage = data.WarningMessageDesc;
                        this.showMessageModal(this.formData.GetWarnMessage);
                    }
                    // if (this.gridReady) {
                    //     this.processPOSTOperation();
                    // }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
            );
        //  this.riGrid_onRefresh();
    }

    private SetHTMLPageSettings(): void {
        // Hide/Show fields and set variables depending on whether System Chars are required or not
        if (this.pageParams.vEnableInstallsRemovals) {
            this.pageParams.vbEnableInstallsRemovals = true;
            this.pageParams.tdUnplannedNoOfExchangesLab = true;
        } else {
            this.pageParams.vbEnableInstallsRemovals = false;
            this.pageParams.tdUnplannedNoOfExchangesLab = false;
        }

        if (this.pageParams.vEnablePostcodeDefaulting) {
            this.pageParams.vbEnablePostcodeDefaulting = true;
        } else {
            this.pageParams.vbEnablePostcodeDefaulting = false;
        }

        if (this.pageParams.vEnableWED) {
            this.pageParams.vbEnableWED = true;
            this.pageParams.tdUnplannedWEDLab = true;
        } else {
            this.pageParams.vbEnableWED = false;
            this.pageParams.tdUnplannedWEDLab = false;
        }
    }


    public BuildGrid(): void {

        this.riGrid.Clear();
        if (this.pageParams.vRouteOptimisation === 'Yes' || this.pageParams.vRouteOptimisation === 'True') {
            this.pageParams.vRouteOptimisation = 'True';
        } else {
            this.pageParams.vRouteOptimisation = 'False';
        }

        if (!this.getControlValue('BranchServiceAreaCode')) {
            this.riGrid.AddColumn('ColBranchServiceAreaCode', 'ServiceCover', 'ColBranchServiceAreaCode', MntConst.eTypeCode, 4);
            this.riGrid.AddColumnAlign('ColBranchServiceAreaCode', MntConst.eAlignmentCenter);
        }

        this.riGrid.AddColumn('BranchServiceAreaSeqNo', 'ServiceCover', 'BranchServiceAreaSeqNo', MntConst.eTypeText, 6);
        this.riGrid.AddColumnAlign('BranchServiceAreaSeqNo', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnUpdateSupport('BranchServiceAreaSeqNo', this.pageParams.vRouteOptimisation);

        this.riGrid.AddColumn('ContractNum', 'ServiceCover', 'ContractNum', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnAlign('ContractNum', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('PremiseNum', 'ServiceCover', 'PremiseNum', MntConst.eTypeText, 5);
        this.riGrid.AddColumnAlign('PremiseNum', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('PremiseName', 'ServiceCover', 'PremiseName', MntConst.eTypeText, 14);
        this.riGrid.AddColumnAlign('PremiseName', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnOrderable('PremiseName', true); //'19/08/2009 - Kelvin #39744

        this.riGrid.AddColumn('Town', 'ServiceCover', 'Town', MntConst.eTypeText, 15);
        this.riGrid.AddColumnAlign('Town', MntConst.eAlignmentLeft);

        if (this.pageParams.vbEnablePostcodeDefaulting) {
            this.riGrid.AddColumn('Postcode', 'ServiceCover', 'Postcode', MntConst.eTypeCode, 10);
            this.riGrid.AddColumnAlign('Postcode', MntConst.eAlignmentLeft);
        }

        this.riGrid.AddColumn('ProdServGrpCode', 'ServiceCover', 'ProdServGrpCode', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnAlign('ProdServGrpCode', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('ProdCode', 'ServiceCover', 'ProdCode', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnAlign('ProdCode', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('ServiceVisitFrequency', 'ServiceCover', 'ServiceVisitFrequency', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('ServiceVisitFrequency', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ServiceQuantity', 'ServiceCover', 'ServiceQuantity', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('ServiceQuantity', MntConst.eAlignmentCenter);

        if (this.pageParams.vbEnableWED) {
            this.riGrid.AddColumn('WEDValue', 'ServiceCover', 'WEDValue', MntConst.eTypeDecimal1, 5);
            this.riGrid.AddColumnAlign('WEDValue', MntConst.eAlignmentCenter);
        }

        this.riGrid.AddColumn('ServiceTypeCode', 'ServiceCover', 'ServiceTypeCode', MntConst.eTypeCode, 2);
        this.riGrid.AddColumnAlign('ServiceTypeCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ServiceTime', 'ServiceCover', 'ServiceTime', MntConst.eTypeText, 5);
        this.riGrid.AddColumnAlign('ServiceTime', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('VisitsDueAndCompleted', 'ServiceCover', 'VisitsDueAndCompleted', MntConst.eTypeText, 5);
        this.riGrid.AddColumnAlign('VisitsDueAndCompleted', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('StaticRelatedVisits', 'ServiceCover', 'StaticRelatedVisits', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('StaticRelatedVisits', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('NextServiceVisitDate', 'ServiceCover', 'NextServiceVisitDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('NextServiceVisitDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('VisitTypeCode', 'ServiceCover', 'VisitTypeCode', MntConst.eTypeCode, 3);
        this.riGrid.AddColumnAlign('VisitTypeCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('LastVisitDate', 'ServiceCover', 'LastVisitDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('LastVisitDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('LastVisitTypeCode', 'ServiceCover', 'LastVisitTypeCode', MntConst.eTypeCode, 3);
        this.riGrid.AddColumnAlign('LastVisitTypeCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('NextVisitDate', 'ServiceCover', 'NextVisitDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('NextVisitDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('NextVisitTypeCode', 'ServiceCover', 'NextVisitTypeCode', MntConst.eTypeCode, 3);
        this.riGrid.AddColumnAlign('NextVisitTypeCode', MntConst.eAlignmentCenter);

        if (this.pageParams.reroute && (this.pageParams.ParentMode !== 'ToGrid')) {
            this.riGrid.AddColumn('PlanMove', 'ServiceCover', 'PlanMove', MntConst.eTypeCheckBox, 1, false, '');
            this.riGrid.AddColumnAlign('PlanMove', MntConst.eAlignmentCenter);
        }

        this.riGrid.AddColumnOrderable('BranchServiceAreaSeqNo', true);
        this.riGrid.AddColumnOrderable('ContractNum', true);
        this.riGrid.AddColumnOrderable('ProdCode', true);
        this.riGrid.AddColumnOrderable('ServiceVisitFrequency', true);
        this.riGrid.AddColumnOrderable('NextServiceVisitDate', true);
        this.riGrid.AddColumnOrderable('VisitsDueAndCompleted', true);
        this.riGrid.AddColumnOrderable('Town', true);
        this.riGrid.AddColumnOrderable('ServiceTypeCode', true);
        this.riGrid.AddColumnOrderable('ServiceTime', true);
        this.riGrid.AddColumnOrderable('StaticRelatedVisits', true);

        if (this.pageParams.vbEnablePostcodeDefaulting) {
            this.riGrid.AddColumnOrderable('Postcode', true);
        }

        this.riGrid.Complete();
        this.gridReady = true;
    }

    public riGrid_BeforeExecute(): void {
        if (this.riGrid.Update) {
            this.pageParams.blnRefreshRequired = true;
            if (this.getControlValue('BranchServiceAreaCode')) {
                this.pageParams.AreaCode = this.getControlValue('BranchServiceAreaCode');
            } else {
                this.pageParams.AreaCode = '';
            }
        } else {
            this.pageParams.blnRefreshRequired = false;
            this.pageParams.AreaCode = this.getControlValue('BranchServiceAreaCode');
        }

        if (this.pageParams.Plan === 'Bump') {
            if (this.getControlValue('BranchServiceAreaCode')) {
                this.pageParams.AllAreas = 'No';
            } else {
                this.pageParams.AllAreas = 'Yes';
            }
        } else {
            if (this.getControlValue('BranchServiceAreaCode')) {
                this.pageParams.AllAreas = 'No';
            } else {
                this.pageParams.AllAreas = 'Yes';
            }
        }
        this.GetLatestWeekNumber();
        this.processPOSTOperation();
    }

    private processPOSTOperation(): void {

        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
        //set parameters
        this.search.set('BranchNumber', this.utils.getBranchCode());
        this.search.set('StartDate', this.getControlValue('StartDate'));
        this.search.set('EndDate', this.getControlValue('EndDate'));
        this.search.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
        this.search.set('AllBranchServiceAreas', this.pageParams.AllAreas);
        this.search.set('NegBranchNumber', this.formData.BranchNumber ? this.formData.BranchNumber : '');
        this.search.set('ServiceTypeCode', this.getControlValue('InServiceTypeCode') ? this.getControlValue('InServiceTypeCode') : '');
        this.search.set('SequenceNumber', this.getControlValue('SequenceNumber') ? this.getControlValue('SequenceNumber') : '');
        this.search.set('ContractNumber', this.getControlValue('ContractNumberSearch') ? this.getControlValue('ContractNumberSearch') : '');
        this.search.set('MoveRowid', this.formData.MoveRowid ? this.formData.MoveRowid : '');
        this.search.set('Frequency', this.getControlValue('Frequency') ? this.getControlValue('Frequency') : '');
        this.search.set('ParentMode', this.pageParams.ParentMode ? this.pageParams.ParentMode : '');
        this.search.set('PlanMoveRowId', this.pageParams.PlanMoveCheck ? this.pageParams.PlanMoveCheck : '');

        // set grid building parameters
        this.search.set(this.serviceConstants.PageSize, this.pageSize.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        this.search.set(this.serviceConstants.GridCacheRefresh, 'true');
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.search.set(this.serviceConstants.GridSortOrder, sortOrder);

        this.queryParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryParams.search).subscribe(
            (data) => {
                if (data.hasError) {
                    this.showErrorModal(data);
                } else {
                    let StrPostData;
                    if (this.riGrid.Update) {
                        //    Call SeqNoUpdate
                        if (this.pageParams.grdServicePlanningRow) {
                            this.riGrid.StartRow = this.pageParams.grdServicePlanningRow;
                            this.riGrid.StartColumn = 0;
                            this.riGrid.RowID = this.pageParams.ServiceCoverRowID;
                            StrPostData = StrPostData + '&VisitTypeCode=' + this.pageParams.VisitTypeCode + '&NextServiceVisitDate=' + this.riGrid.Details.GetValue('NextServiceVisitDate');

                            this.riGrid.UpdateHeader = false;
                            this.riGrid.UpdateBody = true;
                            this.riGrid.UpdateFooter = true;
                        } else {
                            this.pageParams.grdServicePlanningRow = 0;
                        }
                    }

                    this.pageParams.BusinessObjectPostData = StrPostData;
                    this.pageParams.PlanMoveCheck = '';
                    // this.totalRecords = data.pageData.pageNumber;
                    this.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                    this.riGrid.Execute(data);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public getCurrentPage(currentPage: any): void {
        this.selectedRow = -1;
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.riGrid_onRefresh();
    }

    public riGrid_onRefresh(): void {
        if (this.currentPage <= 0) {
            this.currentPage = 1;
        }
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public toggleShowHide(e: any): void {
        if (this.ishidden) {
            this.ishidden = false;
            this.buttonTitle = 'Hide Filters';
        } else {
            this.ishidden = true;
            this.buttonTitle = 'Show Filters';
        }
        this.getTranslatedValue(this.buttonTitle, null).subscribe((translatedString: string) => {
            if (translatedString) {
                this.buttonTitle = translatedString;
            }
        });
    }

    public NegBranchNumber_onchange(obj: any): void {
        if (obj.BranchNumber) {
            this.formData.BranchNumber = obj.BranchNumber;
            this.formData.BranchName = obj.BranchName;
            this.pageParams.NegBranchNumber = obj.BranchNumber;
            this.pageParams.vbErrorMessageFlagged = false;
        }
    }

    public setServiceAreaReturnData(data: any): void {
        if (data.BranchServiceAreaCode) {
            this.pageParams.BranchServiceAreaCode = data.BranchServiceAreaCode;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', this.pageParams.BranchServiceAreaCode);
        }
        this.BranchServiceAreaCode_onchange();
    }

    public BranchServiceAreaCode_onchange(): void {
        if (this.getControlValue('BranchServiceAreaCode')) {
            let query = this.getURLSearchParamObject();
            query.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
            query.set(this.serviceConstants.BusinessCode, this.businessCode());
            query.set(this.serviceConstants.CountryCode, this.countryCode());
            //set parameters
            query.set('ActionType', 'GetEmployeeSurname');
            query.set('BranchNumber', this.utils.getBranchCode());
            query.set('StartDate', this.getControlValue('StartDate'));
            query.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));

            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
                this.queryParams.operation, query)
                .subscribe(
                (data) => {
                    if (data.hasError) {
                        this.showErrorModal(data);
                    } else {
                        if (data.EmployeeSurname) {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', data.EmployeeSurname);
                        } else {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', '');
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', '');
                        }
                        if (data.ErrorMessageDesc) {
                            this.messageTitle = data.ErrorMessageDesc;
                            this.showMessageModal(this.formData.GetWarnMessage);
                            this.pageParams.vbErrorMessageFlagged = true;
                        } else {
                            if (data.WarningMessageDesc) {
                                this.messageTitle = data.WarningMessageDesc;
                                this.messageModal.show();
                            }
                            this.pageParams.vbErrorMessageFlagged = false;
                            this.riGrid.RefreshRequired();
                            this.BuildGrid();
                        }
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                }
                );
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', '');
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedNoOfCalls', '0');
        this.riExchange.riInputElement.isError(this.uiForm, 'UnplannedNoOfCalls');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedNoOfExchanges', '0');
        this.riExchange.riInputElement.isError(this.uiForm, 'UnplannedNoOfExchanges');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedTime', '00.00');
        if (this.pageParams.vbEnableWED) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedWED', '0');
            this.riExchange.riInputElement.isError(this.uiForm, 'UnplannedWED');
        }
        this.riGrid.RefreshRequired();
        this.BuildGrid();
    }

    // TODO: Change it to iCABSBServiceTypeSearch - Dropdown Component
    public InServiceTypeCode_onchange(obj: any): void {
        if (this.getControlValue('InServiceTypeCode')) {
            let query = this.getURLSearchParamObject();
            query.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
            query.set(this.serviceConstants.BusinessCode, this.businessCode());
            query.set(this.serviceConstants.CountryCode, this.countryCode());
            //set parameters
            query.set('ActionType', 'GetServiceTypeDesc');
            query.set('ServiceTypeCode', this.getControlValue('InServiceTypeCode'));
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
                this.queryParams.operation, query)
                .subscribe(
                (data) => {
                    if (data.hasError) {
                        this.errorService.emitError(data);
                    } else {
                        if (data.ServiceTypeDesc) {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeDesc', data.ServiceTypeDesc);
                        } else {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'InServiceTypeCode', '');
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeDesc', '');
                        }
                        if (data.ErrorMessageDesc) {
                            this.messageTitle = data.ErrorMessageDesc;
                            this.messageModal.show();
                            this.pageParams.vbErrorMessageFlagged = true;
                        } else {
                            this.pageParams.vbErrorMessageFlagged = false;
                        }
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                }
                );
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'InServiceTypeCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeDesc', '');
        }
    }

    public ContractNumberSearch_onchange(event: any): void {
        let paddedValue = this.utils.numberPadding(this.getControlValue('ContractNumberSearch'), 8);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumberSearch', paddedValue);
    }

    public GridPageSize_onchange(event: any): void {
        if (this.getControlValue('GridPageSize')) {
            this.pageSize = Number(this.getControlValue('GridPageSize'));
        }
    }

    public DateSelectedValue(value: any, fieldName: any): void {
        if (value && value.value) {
            this.setControlValue(fieldName, value.value);
        } else {
            this.setControlValue(fieldName, '');
        }
    }

    @HostListener('document:keydown', ['$event']) document_onkeydown(ev: any): void {
        // let StartDate = this.utils.convertDate(this.getControlValue('StartDate').toString());
        // let EndDate = this.utils.convertDate(this.getControlValue('EndDate').toString());
        let vcBeforeStartDate;
        let vcBeforeEndDate;
        vcBeforeStartDate = this.getControlValue('StartDate');
        vcBeforeEndDate = this.getControlValue('EndDate');
        let d1 = vcBeforeStartDate;
        let d2 = new Date(this.utils.convertDate(this.formData.MaxEndDate).toString());
        let d3 = new Date(this.utils.convertDate(this.formData.OriginalStartDate).toString());

        if (this.pageParams.ParentMode !== 'ServicePlan') {
            switch (ev.keyCode) {
                case 106: // * in num pad
                    this.pageParams.StartDate = this.utils.addDays(this.pageParams.vbEndofWeekDate, 1);
                    this.pageParams.EndDate = this.utils.addDays(this.pageParams.vbEndofWeekDate, 7);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'StartDate', this.pageParams.StartDate);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'EndDate', this.pageParams.EndDate);
                    // this.getLookupCallSearchParameter();
                    break;
                case 107: // + in num pad
                    this.pageParams.StartDate = this.utils.addDays(vcBeforeStartDate, 1);
                    if (vcBeforeEndDate) {
                        this.pageParams.EndDate = this.utils.addDays(vcBeforeEndDate, 1);
                    }
                    d1 = new Date(this.utils.convertDate(this.pageParams.StartDate));
                    if (d1 >= d2) {
                        this.pageParams.StartDate = vcBeforeStartDate;
                        this.pageParams.EndDate = vcBeforeEndDate;
                    }
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'StartDate', this.pageParams.StartDate);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'EndDate', this.pageParams.EndDate);
                    break;
                case 109: // - in num pad
                    this.pageParams.StartDate = this.utils.addDays(vcBeforeStartDate, -1);
                    if (vcBeforeEndDate) {
                        this.pageParams.EndDate = this.utils.addDays(vcBeforeEndDate, -1);
                    }
                    d1 = new Date(this.utils.convertDate(this.pageParams.StartDate));
                    if (d1 < d3) {
                        this.pageParams.StartDate = vcBeforeStartDate;
                        this.pageParams.EndDate = vcBeforeEndDate;
                    }
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'StartDate', this.pageParams.StartDate);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'EndDate', this.pageParams.EndDate);
                    break;
            }
            this.pageParams.StartDate = new Date(this.utils.convertDate(this.pageParams.StartDate.toString()));
            this.pageParams.EndDate = new Date(this.utils.convertDate(this.pageParams.EndDate.toString()));
            this.formData.GetWarnMessage = 'Yes';
            this.GetLatestWeekNumber();
        }

        this.riExchange_CBORequest();
    };

    private riExchange_CBORequest(): void {
        this.formData.GetWarnMessage = 'WARNING - You Have Entered A Date Prior To Today For The';
        this.messageTitle = this.formData.GetWarnMessage;
        let p1 = this.formatDate(this.getControlValue('StartDate').toString());
        let p2 = this.formatDate(this.getControlValue('EndDate').toString());
        let p3 = this.formatDate(this.pageParams.TodayDate.toString());
        if (this.pageParams.Move) {
            if (p1 < p3) {
                this.getTranslatedValue(this.messageTitle, null).subscribe((translatedString: string) => {
                    if (translatedString) { this.messageTitle = translatedString; }
                });
                this.getTranslatedValue('Move Visits Due On', null).subscribe((translatedString: string) => {
                    if (translatedString) { this.messageTitle += translatedString; }
                });
                this.messageModal.show();
            }
            if (p2 < p3) {
                this.getTranslatedValue(this.messageTitle, null).subscribe((translatedString: string) => {
                    if (translatedString) { this.messageTitle = translatedString; }
                });
                this.getTranslatedValue('To The', null).subscribe((translatedString: string) => {
                    if (translatedString) { this.messageTitle += translatedString; }
                });
                this.messageModal.show();
            }
        }
    }

    private SetAttributes(data: any): void {
        if (this.getControlValue('BranchServiceAreaCode')) {
            this.attributes.BranchServiceAreaCode = data.children[0].children[0].innerText;
        } else {
            this.attributes.BranchServiceAreaCode = '';
        }
        this.attributes.ContractRowID = this.riGrid.Details.GetAttribute('ContractNum', 'AdditionalProperty');
        this.attributes.PremiseRowID = this.riGrid.Details.GetAttribute('PremiseNum', 'AdditionalProperty');
        this.attributes.ServiceCoverRowID = this.riGrid.Details.GetAttribute('ProdCode', 'AdditionalProperty');
        this.attributes.StaticVisitRowID = this.riGrid.Details.GetAttribute('NextServiceVisitDate', 'AdditionalProperty');
        this.attributes.Row = data.sectionRowIndex;

        if (this.getControlValue('BranchServiceAreaCode')) {
            this.pageParams.AddElementNumber = 0;
        } else {
            this.pageParams.AddElementNumber = 1;
        }

        if (this.pageParams.vbEnablePostcodeDefaulting) {
            this.pageParams.AddElementNumber2 = 1;
        } else {
            this.pageParams.AddElementNumber2 = 0;
        }
    }

    public riGrid_BodyOnClick(event: any): void {
        let objTR = event.srcElement.parentElement.parentElement.parentElement;
        this.SetAttributes(objTR);

        this.pageParams.vPlanMoveId = event.srcElement.parentElement.parentElement.parentElement.children[1 + this.pageParams.AddElementNumber].getAttribute('additionalproperty');
        // this.pageParams.PlanMoveCheck = '';
        let vPlanMoveId = this.pageParams.vPlanMoveId;
        let indexOfvPlanMoveId = this.pageParams.PlanMoveCheck.indexOf(vPlanMoveId);
        let length1 = vPlanMoveId.length;
        let length2 = this.pageParams.PlanMoveCheck.length;
        let p1 = indexOfvPlanMoveId + vPlanMoveId.length;
        let p2 = this.pageParams.PlanMoveCheck.length;

        if (this.riGrid.Details.GetValue('PlanMove')) {
            this.pageParams.PlanMoveCheck = this.pageParams.PlanMoveCheck + ';' + vPlanMoveId + '1';
        } else {
            if (this.pageParams.PlanMoveCheck === '' || indexOfvPlanMoveId === 0) {
                this.pageParams.PlanMoveCheck = this.pageParams.PlanMoveCheck + ';' + vPlanMoveId + '0';
            } else {
                if ((indexOfvPlanMoveId === 2) && (this.pageParams.PlanMoveCheck.length > (length1 + 2))) {
                    this.pageParams.PlanMoveCheck = this.pageParams.PlanMoveCheck.substring(p1, p2);
                } else if ((indexOfvPlanMoveId === 2) && (length2 === (length1 + 2))) {
                    this.pageParams.PlanMoveCheck = '';
                } else if (indexOfvPlanMoveId > 2) {
                    this.pageParams.PlanMoveCheck = this.pageParams.PlanMoveCheck.substring(1, (indexOfvPlanMoveId - 2)) + this.pageParams.PlanMoveCheck.substring((indexOfvPlanMoveId + length1 + 1), length2);
                }
            }
        }

        this.updateEvents();
    }

    public riGrid_BodyOnDblClick(data: any): void {
        if (this.pageParams.vRouteOptimisation === 'Yes' || this.pageParams.vRouteOptimisation === true) {
            this.pageParams.vRouteOptimisation = true;
        } else {
            this.pageParams.vRouteOptimisation = false;
        }
        switch (this.riGrid.CurrentColumnName) {
            case 'StaticRelatedVisits':
                this.attributes.DateType = 'Day';
                this.attributes.SelectedDate = this.getControlValue('StartDate');
                // this.navigate('Premise', 'grid/application/relatedVisitGrid'); // iCABSARelatedVisitGrid.htm
                this.showMessageModal('Application/iCABSARelatedVisitGrid.htm - Page not found');
                break;
            case 'ContractNum':
            case 'PremiseNum':
            case 'ProdCode':
            case 'VisitTypeCode':
            case 'PortfolioStatus':
            case 'NextServiceVisitDate':
            case 'BranchServiceAreaSeqNo':
                if (this.riGrid.CurrentColumnName === 'BranchServiceAreaSeqNo' && this.pageParams.vRouteOptimisation === true && this.pageParams.ParentMode !== 'ServicePlan') {
                    break;
                } else {
                    let objTR = event.srcElement.parentElement.parentElement;
                    this.SetAttributes(objTR);
                    switch (this.riGrid.Details.GetAttribute('Town', 'additionalProperty')) {
                        case 'C':
                            this.pageParams.CurrentContractTypeURLParameter = '';
                            break;
                        case 'J':
                            this.pageParams.CurrentContractTypeURLParameter = 'job';
                            break;
                        case 'P':
                            this.pageParams.CurrentContractTypeURLParameter = 'product';
                            break;
                        default:
                            break;
                    }
                    // this.riExchange.setRouterParams(this.routePageParams);
                    switch (this.riGrid.CurrentColumnName) {
                        case 'ContractNum':
                            this.navigate('ServicePlanning', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                                'ContractNumber': this.riGrid.Details.GetValue('ContractNum').split('/')[1]
                            }); // iCABSAContractMaintenance.htm
                            break;
                        case 'PremiseNum':
                            this.navigate('ServicePlanning', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                                'ContractNumber': this.riGrid.Details.GetValue('ContractNum').split('/')[1],
                                'PremiseNumber': this.riGrid.Details.GetValue('PremiseNum'),
                                'ProductCode': this.riGrid.Details.GetValue('ProdCode')
                            }); // iCABSAPremiseMaintenance.htm
                            break;
                        case 'ProdCode':
                            if (this.pageParams.CurrentContractTypeURLParameter === 'product') {
                                this.navigate('ServicePlanning', InternalGridSearchSalesModuleRoutes.ICABSAPRODUCTSALESSCDETAILMAINTENANCE, {
                                    'ContractNumber': this.riGrid.Details.GetValue('ContractNum').split('/')[1],
                                    'PremiseNumber': this.riGrid.Details.GetValue('PremiseNum'),
                                    'ProductCode': this.riGrid.Details.GetValue('ProdCode')
                                }); // iCABSAProductSalesSCDetailMaintenance.htm
                            } else {
                                this.navigate('ServicePlanning', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                                    'ContractNumber': this.riGrid.Details.GetValue('ContractNum').split('/')[1],
                                    'PremiseNumber': this.riGrid.Details.GetValue('PremiseNum'),
                                    'ProductCode': this.riGrid.Details.GetValue('ProdCode')
                                }); // iCABSAServiceCoverMaintenance.htm
                            }
                            break;
                        default:
                            break;
                    }
                }
                break;
            default:
                break;
        }
    } // End of getGridOnDblClick

    public getGridInfo(info: any): void {
        this.riGridPagination.totalItems = info.totalRows;
        this.totalRecords = info.totalRows;
    }

    public riGrid_Sort(event: any): void {
        // this.currentPage = 1;
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public riGrid_AfterExecute(): void {
        let ArrInfo;
        let RowNumber;

        if (this.riGrid.Update) {
            if (this.riGrid.CurrentColumnName === 'Seq No') {
                ArrInfo = this.riGrid.Details.GetValue(this.riGrid.CurrentColumnName);
                if (ArrInfo) {
                    ArrInfo = ArrInfo.split('|');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedNoOfCalls', ArrInfo[0]);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedNoOfExchanges', ArrInfo[1]);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedTime', ArrInfo[2]);
                    if (this.pageParams.vbEnableWED) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedWED', ArrInfo[3]);
                    }
                } else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedNoOfCalls', '0');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedNoOfExchanges', '0');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedTime', '00.00');
                    if (this.pageParams.vbEnableWED) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'UnplannedWED', '0');
                    }
                }

                this.riExchange.riInputElement.isError(this.uiForm, 'UnplannedNoOfCalls');
                this.riExchange.riInputElement.isError(this.uiForm, 'UnplannedNoOfExchanges');
                if (this.pageParams.vbEnableWED) {
                    this.riExchange.riInputElement.isError(this.uiForm, 'UnplannedWED');
                }
            }
        }
        this.riGrid.Update = false;
    }

    private updateEvents(): void {
        this.formData.MoveRowid = '';
        let MoveRowid = this.formData.MoveRowid.toString();
        switch (this.riGrid.CurrentColumnName) {
            case 'PlanMove':
                this.pageParams.vRowid = this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'rowID');
                if (this.riGrid.Details.GetValue(this.riGrid.CurrentColumnName) === 'True') {
                    if (MoveRowid.indexOf(this.pageParams.vRowid.toString()) === 0) {
                        if (MoveRowid === '') {
                            this.formData.MoveRowid = this.pageParams.vRowid ? this.pageParams.vRowid : '';
                        } else {
                            this.formData.MoveRowid = this.formData.MoveRowid + ';' + this.pageParams.vRowid;
                        }
                    }
                } else {
                    this.formData.MoveRowid = MoveRowid.replace(this.pageParams.vRowid.toString(), '');
                }
                if (MoveRowid.length > 0) {
                    this.formData.MoveRowid = MoveRowid.replace(';;', ';');
                    if (MoveRowid.indexOf(';') === MoveRowid.length) {
                        this.formData.MoveRowid = MoveRowid.subStr(0, (MoveRowid.length - 1));
                    }
                    this.formData.MoveRowid = MoveRowid.replace(';', ',');
                    if (MoveRowid.indexOf(';') === 1) {
                        this.formData.MoveRowid = MoveRowid.replace(';', '', 1, 1);
                    }
                }
                break;
            default:
                break;
        }
    }


    public cmdPlanMove_onClick(event: any): void {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
        this.postData.ActionType = 'Validate';
        this.postData.EndDate = this.getControlValue('EndDate');
        this.postData.MoveRowid = this.formData.MoveRowid;
        this.postData.Frequency = this.getControlValue('Frequency');

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query, this.postData)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.errorService.emitError(data);
                } else {
                    if (data.ValidateError) {
                        this.messageTitle = data.ValidateReason;
                        this.messageModal.show();
                        event.preventDefault();
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
            );

        let query1 = this.getURLSearchParamObject();
        query1.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
        if (this.pageParams.Plan === 'Bump') {
            this.postData.ActionType = 'BumpStatic';
        } else {
            this.postData.ActionType = 'MoveStatic';
        }
        this.postData.MoveRowid = this.formData.MoveRowid;
        this.postData.EndDate = this.getControlValue('EndDate');
        this.postData.Frequency = this.getControlValue('Frequency');
        this.postData.RelatedVisits = this.getControlValue('RelatedVisits');
        this.postData.BranchServiceAreaCode = this.getControlValue('BranchServiceAreaCode');

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query1, this.postData)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.errorService.emitError(data);
                } else {
                    this.pageParams.MoveComplete = data.MoveComplete;
                    this.formData.MoveRowid = '';
                    this.GetLatestWeekNumber();
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
            );
    }


    public cmdToDate_onClick(event: any): void {
        this.pageParams.NegBranchNumber = this.formData.BranchNumber;
        this.pageParams.ParentMode = 'ToGrid';
        this.DateReadOnly = false;
        this.DateDisabledStartDate = false;
        this.pageParams.Plan = 'Move';// iCABSSeServiceMoveGrid.htm
        this.location.replaceState('serviceplanning/ServiceMoveGridSearch', 'Plan=Move');
        this.window_onload();
    }

}
