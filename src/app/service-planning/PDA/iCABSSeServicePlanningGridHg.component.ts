import { Component, OnInit, OnDestroy, Injector, ViewChild, Input, ChangeDetectorRef, HostListener, AfterViewInit, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs/Subscription';

import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';
import { AppModuleRoutes, ContractManagementModuleRoutes, InternalGridSearchSalesModuleRoutes } from './../../base/PageRoutes';
import { ICabsModalVO } from '../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { GridAdvancedComponent } from '../../../shared/components/grid-advanced/grid-advanced';
import { BranchServiceAreaSearchComponent } from './../../internal/search/iCABSBBranchServiceAreaSearch';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';

@Component({
    templateUrl: 'iCABSSeServicePlanningGridHg.html'
})

export class SeServicePlanningGridHgComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('statusFilter') statusFilter: DropdownStaticComponent;
    @ViewChild('visitTypeFilter') visitTypeFilter: DropdownStaticComponent;
    @ViewChild('displayFilter') displayFilter: DropdownStaticComponent;
    @ViewChild('contractTypeFilter') contractTypeFilter: DropdownStaticComponent;
    @ViewChild('searchFilter') searchFilter: DropdownStaticComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;

    private subscription: Subscription = new Subscription();
    private currentContractType: string = '';
    private queryParams: any = {
        operation: 'Service/iCABSSeServicePlanningGridHg',
        module: 'planning',
        method: 'service-planning/maintenance'
    };

    public setFocusBranchServiceAreaCode = new EventEmitter<boolean>();
    public pageId: string = '';
    public controls = [
        { name: 'BranchServiceAreaCode', type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', type: MntConst.eTypeText },
        { name: 'StartDate', type: MntConst.eTypeDate },
        { name: 'EndDate', type: MntConst.eTypeDate },
        { name: 'NegBranchNumber', type: MntConst.eTypeInteger },
        { name: 'WeekNumber', type: MntConst.eTypeInteger },
        { name: 'UpToDate', type: MntConst.eTypeDate, required: true },
        { name: 'ProductServiceGroupString', type: MntConst.eTypeText },
        { name: 'ServicePlanNumber', type: MntConst.eTypeInteger },
        { name: 'ContractNumberSearch', type: MntConst.eTypeCode },
        { name: 'ContractDesc', type: MntConst.eTypeText },
        { name: 'ExPlannedDateRange', value: false },
        { name: 'ExPlannedDateFrom', type: MntConst.eTypeDate },
        { name: 'ExPlannedDateTo', type: MntConst.eTypeDate },
        { name: 'Postcode', type: MntConst.eTypeText },
        { name: 'PremiseName', type: MntConst.eTypeText },
        { name: 'GridPageSize', type: MntConst.eTypeInteger, required: true },
        { name: 'UnplannedNoOfCalls', type: MntConst.eTypeInteger },
        { name: 'UnplannedNoOfExchanges', type: MntConst.eTypeInteger },
        { name: 'UnplannedTime', type: MntConst.eTypeText },
        { name: 'UnplannedNettValue', type: MntConst.eTypeCurrency },
        { name: 'SubtotalNoOfCalls', type: MntConst.eTypeInteger },
        { name: 'SubtotalNoOfExchanges', type: MntConst.eTypeInteger },
        { name: 'SubtotalTime', type: MntConst.eTypeText },
        { name: 'SubtotalNettValue', type: MntConst.eTypeCurrency },
        { name: 'TotalNoOfCalls', type: MntConst.eTypeInteger },
        { name: 'TotalNoOfExchanges', type: MntConst.eTypeInteger },
        { name: 'TotalTime', type: MntConst.eTypeText },
        { name: 'TotalNettValue', type: MntConst.eTypeCurrency },
        // Hidden field
        { name: 'GetWarnMessage', type: MntConst.eTypeText },
        { name: 'FirstWeekDay', type: MntConst.eTypeText },
        { name: 'TotalTimeInteger', type: MntConst.eTypeInteger },
        { name: 'PlanningStatusSelected', type: MntConst.eTypeText },
        { name: 'VisitTypeSelected', type: MntConst.eTypeText },
        { name: 'DisplaySelected', type: MntConst.eTypeText },
        { name: 'ContractTypeSelected', type: MntConst.eTypeText },
        { name: 'SearchSelected', type: MntConst.eTypeText }
    ];
    public negBranchInputParams: any = {};
    public productServiceGroupInputParams: any = {
        params: {
            parentMode: 'LookUp',
            ProductServiceGroupString: ''
        }
    };
    public legends: Array<any> = [];
    public ellipsisParams: any = {
        branchServiceArea: {
            isShowCloseButton: true,
            isShowHeader: true,
            isDisabled: false,
            childConfigParams: {
                parentMode: 'LookUp-Emp'
            },
            contentComponent: BranchServiceAreaSearchComponent
        },
        contract: {
            isShowCloseButton: true,
            isShowHeader: true,
            isDisabled: false,
            childConfigParams: {
                parentMode: 'LookUp-ContractNumberSearch'
            },
            contentComponent: ContractSearchComponent
        },
        common: {
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            }
        }
    };
    public staticDropdownParams: any = {
        statusFilter: {
            inputData: [],
            defaultOption: { value: 'All', text: 'All' }
        },
        visitTypeFilter: {
            inputData: [],
            defaultOption: { value: 'All', text: 'All' }
        },
        displayFilter: {
            inputData: [],
            defaultOption: { value: 'All', text: 'All' }
        },
        contractTypeFilter: {
            inputData: [],
            defaultOption: { value: 'All', text: 'All' }
        },
        searchFilter: {
            inputData: [],
            defaultOption: { value: 'Postcode', text: 'Postcode' }
        }
    };

    constructor(injector: Injector, private ref: ChangeDetectorRef) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEPLANNINGGRIDHG;
        this.browserTitle = this.pageTitle = 'Create Service Plan';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.onWindowLoad();
    }

    ngAfterViewInit(): void {
        if (this.isReturning()) {
            this.setSelectedItemToDropdownStatic(this.statusFilter, this.getControlValue('PlanningStatusSelected'));
            this.setSelectedItemToDropdownStatic(this.visitTypeFilter, this.getControlValue('VisitTypeSelected'));
            this.setSelectedItemToDropdownStatic(this.displayFilter, this.getControlValue('DisplaySelected'));
            this.setSelectedItemToDropdownStatic(this.contractTypeFilter, this.getControlValue('ContractTypeSelected'));
            this.setSelectedItemToDropdownStatic(this.searchFilter, this.getControlValue('SearchSelected'));
            switch (this.getControlValue('SearchSelected')) {
                case 'Postcode':
                    this.pageParams.isShowPostcode = true;
                    break;
                case 'Name':
                    this.pageParams.isShowPostcode = false;
                    break;
            }
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    private onWindowLoad(): void {
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.buildMenuOptions();
            this.prepareLegendsData();
            this.buildGrid();
            this.populateGrid();
        } else {
            this.setPageDefaults();
            this.getSysCharDetails();
            setTimeout(() => {
                this.setFocusBranchServiceAreaCode.emit(true);
            }, 0);
        }
        this.disableFormControls();
    }

    private getSysCharDetails(): void {
        //SysChar
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableInstallsRemovals,
            this.sysCharConstants.SystemCharEnablePostcodeDefaulting,
            this.sysCharConstants.SystemCharEnableAddressLine3,
            this.sysCharConstants.SystemCharSingleServicePlanPerBranch,
            this.sysCharConstants.SystemCharBranchServiceAreaEmployees
        ];
        let sysCharIP: any = {
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.isEnableInstallsRemovals = record[0]['Required'];
            this.pageParams.isEnablePostcodeDefaulting = record[1]['Required'];
            this.pageParams.isEnableAddressLine3 = record[2]['Required'];
            this.pageParams.isSingleServicePlanPerBranch = record[3]['Required'];
            this.pageParams.isEnableBSE = record[4]['Required'];
            this.pageParams.isSCRowCount = record[4]['Integer'];

            this.getDataFromlookup();

            // All activity under page load functionality
            if (this.parentMode === 'ServicePlan') {
                this.browserTitle = this.pageTitle = 'Confirmed Service Plan';
                this.utils.setTitle(this.browserTitle);

                this.disableControl('BranchServiceAreaCode', true);
                this.ellipsisParams.branchServiceArea.isDisabled = true;

                let branchServiceAreaCode = this.riExchange.getParentAttributeValue('BranchServiceAreaCode');
                this.onBranchServiceAreaCodeDeactivate(null);
                if (branchServiceAreaCode) {
                    this.setControlValue('BranchServiceAreaCode', branchServiceAreaCode);
                    this.setControlValue('EmployeeSurname', this.riExchange.getParentAttributeValue('EmployeeSurname'));
                } else {
                    this.setControlValue('BranchServiceAreaCode', this.riExchange.getParentHTMLValue('BranchServiceAreaCode'));
                    this.setControlValue('EmployeeSurname', this.riExchange.getParentHTMLValue('EmployeeSurname'));
                }

                this.setControlValue('ServicePlanNumber', this.riExchange.getParentAttributeValue('ServicePlanNumber'));
                this.setControlValue('StartDate', this.riExchange.getParentAttributeValue('ServicePlanStartDate'));
                this.setControlValue('EndDate', this.riExchange.getParentAttributeValue('ServicePlanEndDate'));
                this.setControlValue('UpToDate', this.riExchange.getParentAttributeValue('ServicePlanStartDate'));
                this.setControlValue('SubtotalNoOfCalls', this.riExchange.getParentAttributeValue('ServicePlanNoOfCalls'));
                this.setControlValue('SubtotalNoOfExchanges', this.riExchange.getParentAttributeValue('ServicePlanNoOfExchanges'));
                this.setControlValue('SubtotalTime', this.riExchange.getParentAttributeValue('ServicePlanTime'));
                this.setControlValue('SubtotalNettValue', this.riExchange.getParentAttributeValue('ServicePlanNettValue'));
                this.setControlValue('TotalNoOfCalls', this.riExchange.getParentAttributeValue('ServicePlanNoOfCalls'));
                this.setControlValue('TotalNoOfExchanges', this.riExchange.getParentAttributeValue('ServicePlanNoOfExchanges'));
                this.setControlValue('TotalTime', this.riExchange.getParentAttributeValue('ServicePlanTime'));
                this.setControlValue('TotalNettValue', this.riExchange.getParentAttributeValue('ServicePlanNettValue'));

                if (this.getControlValue('UpToDate')) {
                    this.setControlValue('UpToDate', this.utils.addDays(this.getControlValue('UpToDate'), 6));
                }

                this.pageParams.isShowUpToDate = false;
                this.pageParams.isShowServicePlanNumber = true;
                this.pageParams.isShowNewPlan = false;
                this.pageParams.isShowAdjustPlan = true;
                this.pageParams.isShowUnplannedTotals = false;
                this.pageParams.isShowExcludePlannedRange = false;
                this.pageParams.isShowDisplayLines = false;
                this.pageParams.isShowStatus = false;

                this.buildGrid();
                this.populateGrid();
                this.getLatestWeekNumber();
            } else {
                this.setDefaultDateRanges();

                this.pageParams.isShowNewPlan = true;
                this.pageParams.isShowAdjustPlan = false;

                if (!this.pageParams.isSingleServicePlanPerBranch) {
                    this.pageParams.isSummaryDisabled = true;
                }

                this.buildGrid();
            }

            if (!this.pageParams.isEnableBSE) {
                this.pageParams.isShowCalendar = false;
                this.pageParams.isShowDefaultRoutines = false;
            }

            this.riGrid.RefreshRequired();
            this.prepareLegendsData();
        });
    }

    private prepareLegendsData(): void {
        this.legends = [];
        if (this.pageParams.isShowNewPlan) {
            this.legends.push({ key: 'SP_COLOUR_UP_TO_DATE', label: 'Up To Date', color: '#FFFFFF' });
            this.legends.push({ key: 'SP_COLOUR_UNPLANNED_LATE', label: 'Unplanned (Late)', color: '#CCFFCC' });
            this.legends.push({ key: '', label: 'Appointment Confirmed', color: '#F4A433' });
            this.legends.push({ key: 'SP_COLOUR_PLANNED_NOT_COMPLETED', label: 'Planned', color: '#FFFFCC' });
            this.legends.push({ key: 'SP_COLOUR_INPLANNING_NOT_CURRENT', label: 'In Planning (Not Selected Week)', color: '#87CEFA' });
        }

        if (this.pageParams.isShowAdjustPlan) {
            this.legends.push({ key: 'SP_COLOUR_PLANNED_LATE', label: 'Late', color: '#FFCCCC' });
            this.legends.push({ key: 'SP_COLOUR_PLANNED_NOT_COMPLETED', label: 'Not Completed', color: '#FFFFCC' });
        }
    }

    private getDataFromlookup(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookup_details = [{
            'table': 'PlanVisitStatusLang',
            'query': {
                'LanguageCode': this.riExchange.LanguageCode(),
                'PlanVisitStatusCode': 'U'
            },
            'fields': ['PlanVisitStatusDesc']
        }, {
            'table': 'PlanVisitStatusLang',
            'query': {
                'LanguageCode': this.riExchange.LanguageCode(),
                'PlanVisitStatusCode': 'I'
            },
            'fields': ['PlanVisitStatusDesc']
        }, {
            'table': 'PlanVisitStatusLang',
            'query': {
                'LanguageCode': this.riExchange.LanguageCode(),
                'PlanVisitStatusCode': 'C'
            },
            'fields': ['PlanVisitStatusDesc']
        }, {
            'table': 'PlanVisitStatusLang',
            'query': {
                'LanguageCode': this.riExchange.LanguageCode(),
                'PlanVisitStatusCode': 'P'
            },
            'fields': ['PlanVisitStatusDesc']
        }, {
            'table': 'ContractTypeLang',
            'query': {
                'LanguageCode': this.riExchange.LanguageCode(),
                'ContractTypeCode': 'C'
            },
            'fields': ['ContractTypeDesc']
        }, {
            'table': 'ContractTypeLang',
            'query': {
                'LanguageCode': this.riExchange.LanguageCode(),
                'ContractTypeCode': 'J'
            },
            'fields': ['ContractTypeDesc']
        }, {
            'table': 'ContractTypeLang',
            'query': {
                'LanguageCode': this.riExchange.LanguageCode(),
                'ContractTypeCode': 'P'
            },
            'fields': ['ContractTypeDesc']
        }];

        this.LookUp.lookUpRecord(lookup_details).subscribe(
            (data) => {
                if (data.length > 0) {
                    let planVisitStatusData1: any = data[0];
                    let planVisitStatusData2: any = data[1];
                    let planVisitStatusData3: any = data[2];
                    let planVisitStatusData4: any = data[3];
                    let ContractTypegData1: any = data[4];
                    let ContractTypegData2: any = data[5];
                    let ContractTypegData3: any = data[6];

                    if (planVisitStatusData1 && planVisitStatusData1.length > 0) {
                        this.pageParams.unplannedDesc = planVisitStatusData1[0].PlanVisitStatusDesc;
                    }
                    if (planVisitStatusData2 && planVisitStatusData2.length > 0) {
                        this.pageParams.inPlanningDesc = planVisitStatusData2[0].PlanVisitStatusDesc;
                    }
                    if (planVisitStatusData3 && planVisitStatusData3.length > 0) {
                        this.pageParams.cancelledDesc = planVisitStatusData3[0].PlanVisitStatusDesc;
                    }
                    if (planVisitStatusData4 && planVisitStatusData4.length > 0) {
                        this.pageParams.plannedDesc = planVisitStatusData4[0].PlanVisitStatusDesc;
                    }
                    if (ContractTypegData1 && ContractTypegData1.length > 0) {
                        this.pageParams.contractTypeConDesc = ContractTypegData1[0].ContractTypeDesc;
                    }
                    if (ContractTypegData2 && ContractTypegData2.length > 0) {
                        this.pageParams.contractTypeJobDesc = ContractTypegData2[0].ContractTypeDesc;
                    }
                    if (ContractTypegData3 && ContractTypegData3.length > 0) {
                        this.pageParams.contractTypeProdDesc = ContractTypegData3[0].ContractTypeDesc;
                    }
                    this.buildMenuOptions();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private buildMenuOptions(): void {
        this.staticDropdownParams.statusFilter.inputData = [];
        this.staticDropdownParams.visitTypeFilter.inputData = [];
        this.staticDropdownParams.displayFilter.inputData = [];
        this.staticDropdownParams.contractTypeFilter.inputData = [];
        this.staticDropdownParams.searchFilter.inputData = [];

        this.staticDropdownParams.visitTypeFilter.inputData.push({ value: 'Routine', text: 'Routine' });

        if (this.pageParams.isEnableInstallsRemovals) {
            this.staticDropdownParams.visitTypeFilter.inputData.push({ value: 'Installation', text: 'Installation' });
            this.staticDropdownParams.visitTypeFilter.inputData.push({ value: 'Removal', text: 'Removal' });
        }

        this.staticDropdownParams.visitTypeFilter.inputData.push({ value: 'CancelRemove', text: 'Cancel And Remove' });

        if (this.pageParams.isEnableInstallsRemovals) {
            this.staticDropdownParams.visitTypeFilter.inputData.push({ value: 'Delivery', text: 'Delivery' });
            this.staticDropdownParams.visitTypeFilter.inputData.push({ value: 'Repair', text: 'Repair' });
        }

        this.staticDropdownParams.visitTypeFilter.inputData.push({ value: 'Urgent', text: 'Urgent' });
        this.staticDropdownParams.visitTypeFilter.inputData.push({ value: 'Upgrade', text: 'Upgrade' });

        if (this.pageParams.contractTypeConDesc) { this.staticDropdownParams.contractTypeFilter.inputData.push({ value: 'C', text: this.pageParams.contractTypeConDesc }); }
        if (this.pageParams.contractTypeJobDesc) { this.staticDropdownParams.contractTypeFilter.inputData.push({ value: 'J', text: this.pageParams.contractTypeJobDesc }); }
        if (this.pageParams.contractTypeProdDesc) { this.staticDropdownParams.contractTypeFilter.inputData.push({ value: 'P', text: this.pageParams.contractTypeProdDesc }); }

        this.staticDropdownParams.statusFilter.inputData.push({ value: 'U', text: this.pageParams.unplannedDesc });
        this.staticDropdownParams.statusFilter.inputData.push({ value: 'I', text: this.pageParams.inPlanningDesc });
        this.staticDropdownParams.statusFilter.inputData.push({ value: 'P', text: this.pageParams.plannedDesc });
        this.staticDropdownParams.statusFilter.inputData.push({ value: 'C', text: this.pageParams.cancelledDesc });

        this.staticDropdownParams.displayFilter.inputData.push({ value: 'Current', text: 'Current' });
        this.staticDropdownParams.displayFilter.inputData.push({ value: 'NonCurrent', text: 'Non-Current' });

        this.staticDropdownParams.searchFilter.inputData.push({ value: 'Name', text: 'Name' });
    }

    private setPageDefaults(): void {
        this.pageParams.isSummaryDisabled = false;
        this.pageParams.isShowUpToDate = true;
        this.pageParams.isShowServicePlanNumber = false;
        this.pageParams.isShowNewPlan = false;
        this.pageParams.isShowAdjustPlan = false;
        this.pageParams.isShowUnplannedTotals = true;
        this.pageParams.isShowExcludePlannedRange = true;
        this.pageParams.isShowDisplayLines = true;
        this.pageParams.isShowStatus = true;
        this.pageParams.isShowCalendar = true;
        this.pageParams.isShowDefaultRoutines = true;
        this.pageParams.isShowGrid = true;
        this.pageParams.addElementNumber = 0;
        this.pageParams.isShowPostcode = true;
        this.pageParams.isErrorMessageFlagged = false;
        this.pageParams.negBranchNumberSelected = {
            id: '',
            text: ''
        };
        this.pageParams.productServiceGroupSelected = {
            id: '',
            text: ''
        };
        this.pageParams.currentContractTypeURLParameter = '';
        this.pageParams.gridConfig = {
            pageSize: 250,
            currentPage: 1,
            totalRecords: 1
        };
        this.setControlValue('PlanningStatusSelected', 'All');
        this.setControlValue('VisitTypeSelected', 'All');
        this.setControlValue('DisplaySelected', 'All');
        this.setControlValue('ContractTypeSelected', 'All');
        this.setControlValue('SearchSelected', 'Postcode');
        this.setControlValue('GridPageSize', this.pageParams.gridConfig.pageSize);
    }

    // Builds the structure of the grid
    private buildGrid(): void {
        this.riGrid.Clear();

        if (!this.getControlValue('BranchServiceAreaCode')) {
            this.riGrid.AddColumn('BranchServiceArea', 'ServiceCover', 'BranchServiceArea', MntConst.eTypeCode, 4);
            this.riGrid.AddColumnAlign('BranchServiceArea', MntConst.eAlignmentCenter);
            this.riGrid.AddColumnOrderable('BranchServiceArea', true);
        }

        this.riGrid.AddColumn('ContractNumber', 'ServiceCover', 'ContractNumber', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnOrderable('ContractNumber', true);

        this.riGrid.AddColumn('PremiseNumber', 'ServiceCover', 'PremiseNumber', MntConst.eTypeInteger, 5);

        this.riGrid.AddColumn('PremiseName', 'ServiceCover', 'PremiseNumber', MntConst.eTypeText, 14);
        this.riGrid.AddColumnAlign('PremiseName', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnOrderable('PremiseName', true);

        this.riGrid.AddColumn('PremiseAddressLine1', 'ServiceCover', 'PremiseAddressLine1', MntConst.eTypeText, 20);
        this.riGrid.AddColumnScreen('PremiseAddressLine1', false);

        this.riGrid.AddColumn('PremiseAddressLine2', 'ServiceCover', 'PremiseAddressLine2', MntConst.eTypeText, 20);
        this.riGrid.AddColumnScreen('PremiseAddressLine2', false);

        if (this.pageParams.isEnableAddressLine3) {
            this.riGrid.AddColumn('PremiseAddressLine3', 'ServiceCover', 'PremiseAddressLine3', MntConst.eTypeText, 20);
            this.riGrid.AddColumnScreen('PremiseAddressLine3', false);
        }

        this.riGrid.AddColumn('PremiseAddressLine4', 'ServiceCover', 'PremiseAddressLine4', MntConst.eTypeText, 20);
        this.riGrid.AddColumnScreen('PremiseAddressLine4', false);

        this.riGrid.AddColumn('PremiseAddressLine5', 'ServiceCover', 'PremiseAddressLine5', MntConst.eTypeText, 20);
        this.riGrid.AddColumnScreen('PremiseAddressLine5', false);

        this.riGrid.AddColumn('PremisePostcode', 'ServiceCover', 'PremisePostcode', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('PremisePostcode', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnOrderable('PremisePostcode', true);

        this.riGrid.AddColumn('PremiseContactName', 'ServiceCover', 'PremiseContactName', MntConst.eTypeText, 20);
        this.riGrid.AddColumnScreen('PremiseContactName', false);

        this.riGrid.AddColumn('PremiseContactPosition', 'ServiceCover', 'PremiseContactPosition', MntConst.eTypeText, 20);
        this.riGrid.AddColumnScreen('PremiseContactPosition', false);

        this.riGrid.AddColumn('PremiseContactTelephone', 'ServiceCover', 'PremiseContactTelephone', MntConst.eTypeText, 20);
        this.riGrid.AddColumnScreen('PremiseContactTelephone', false);

        this.riGrid.AddColumn('LastVisitDate', 'ServiceCover', 'LastVisitDate', MntConst.eTypeDate, 10);

        this.riGrid.AddColumn('ProductCode', 'ServiceCover', 'ProductCode', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ProductCode', true);

        this.riGrid.AddColumn('ServiceVisitFrequency', 'ServiceCover', 'ServiceVisitFrequency', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('ServiceVisitFrequency', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ServiceVisitFrequency', true);

        this.riGrid.AddColumn('ProductServiceGroupCode', 'ServiceCover', 'ProductServiceGroupCode', MntConst.eTypeCode, 2);
        this.riGrid.AddColumnAlign('ProductServiceGroupCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ProductServiceGroupCode', true);

        this.riGrid.AddColumn('VisitTypeCode', 'ServiceCover', 'VisitTypeCode', MntConst.eTypeCode, 2);
        this.riGrid.AddColumnAlign('VisitTypeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('VisitTypeCode', true);

        this.riGrid.AddColumn('ServiceVisitText', 'ServiceCover', 'ServiceVisitText', MntConst.eTypeText, 30);
        this.riGrid.AddColumnScreen('ServiceVisitText', false);

        this.riGrid.AddColumn('VisitDuration', 'ServiceCover', 'VisitDuration', MntConst.eTypeText, 5);
        this.riGrid.AddColumnAlign('VisitDuration', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('VisitDuration', true);

        this.riGrid.AddColumn('VisitValue', 'ServiceCover', 'VisitValue', MntConst.eTypeText, 5);
        this.riGrid.AddColumnAlign('VisitValue', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('VisitDate', 'ServiceCover', 'VisitDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnOrderable('VisitDate', true);

        this.riGrid.AddColumn('Status', 'ServiceCover', 'Status', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('Status', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('Status', true);

        this.riGrid.AddColumn('ApptConfirmed', 'ServiceCover', 'ApptConfirmed', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('ApptConfirmed', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ApptConfirmed', true);

        this.riGrid.AddColumn('Info', 'ServiceCover', 'Info', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('Info', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ServiceSpecialInstructions', 'ServiceCover', 'ServiceSpecialInstructions', MntConst.eTypeText, 1);
        this.riGrid.AddColumnScreen('ServiceSpecialInstructions', false);

        this.riGrid.Complete();
    }

    // Populate data into the grid
    private populateGrid(): void {
        this.pageParams.isShowGrid = true;
        let footerData: string = '';
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set('BranchNumber', this.utils.getBranchCode());
        search.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
        search.set('NegBranchNumber', this.getControlValue('NegBranchNumber'));
        search.set('ContractNumber', this.getControlValue('ContractNumberSearch'));
        search.set('StartDate', this.getControlValue('StartDate'));
        search.set('EndDate', this.getControlValue('EndDate'));
        search.set('UpToDate', this.getControlValue('UpToDate'));
        search.set('ExPlannedDateRange', this.getControlValue('ExPlannedDateRange'));
        search.set('ExPlannedDateFrom', this.getControlValue('ExPlannedDateFrom'));
        search.set('ExPlannedDateTo', this.getControlValue('ExPlannedDateTo'));
        search.set('VisitTypeFilter', this.getControlValue('VisitTypeSelected'));
        search.set('DisplayFilter', this.getControlValue('DisplaySelected'));
        search.set('PlanningStatus', this.getControlValue('PlanningStatusSelected'));
        search.set('ContractTypeFilter', this.getControlValue('ContractTypeSelected'));
        search.set('Postcode', this.getControlValue('Postcode'));
        search.set('PremiseName', this.getControlValue('PremiseName'));
        search.set('ServicePlanNumber', this.getControlValue('ServicePlanNumber'));
        search.set('ProductServiceGroupCode', this.getControlValue('ProductServiceGroupString'));

        // set grid building parameters
        search.set(this.serviceConstants.GridMode, '0');
        search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        search.set(this.serviceConstants.PageSize, this.pageParams.gridConfig.pageSize.toString());
        search.set(this.serviceConstants.PageCurrent, this.pageParams.gridConfig.currentPage.toString());
        search.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        search.set(this.serviceConstants.GridSortOrder, this.riGrid.SortOrder);
        search.set(this.serviceConstants.Action, '2');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.riGrid.RefreshRequired();
                    this.pageParams.gridConfig.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.pageParams.gridConfig.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageParams.gridConfig.pageSize : 1;
                    if (data.footer && data.footer.rows && data.footer.rows.length > 0) {
                        footerData = data.footer.rows[0].text;
                        data.footer = null;
                    }
                    this.riGrid.Execute(data);
                    this.setGridAuxiliaryData(footerData);
                    this.ref.detectChanges();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    // Populate Visits/Units/Time/Nett Value data from grid footer
    private setGridAuxiliaryData(data: string): void {
        if (data !== '') {
            let arrData: Array<string> = data.split('|');

            this.setControlValue('UnplannedNoOfCalls', arrData[1]);
            this.setControlValue('UnplannedNoOfExchanges', arrData[2]);
            this.setControlValue('UnplannedTime', arrData[3]);
            this.setControlValue('UnplannedNettValue', arrData[4]);

            this.setControlValue('SubtotalNoOfCalls', arrData[5]);
            this.setControlValue('SubtotalNoOfExchanges', arrData[6]);
            this.setControlValue('SubtotalTime', arrData[7]);
            this.setControlValue('SubtotalNettValue', arrData[8]);

            this.setControlValue('TotalNoOfCalls', arrData[9]);
            this.setControlValue('TotalNoOfExchanges', arrData[10]);
            this.setControlValue('TotalTimeInteger', arrData[11]);
            this.setControlValue('TotalTime', arrData[12]);
            this.setControlValue('TotalNettValue', arrData[13]);
        } else {
            this.setControlValue('UnplannedNoOfCalls', '0');
            this.setControlValue('UnplannedNoOfExchanges', '0');
            this.setControlValue('UnplannedTime', '00:00');
            this.setControlValue('UnplannedNettValue', '0');

            this.setControlValue('SubtotalNoOfCalls', '0');
            this.setControlValue('SubtotalNoOfExchanges', '0');
            this.setControlValue('SubtotalTime', '00:00');
            this.setControlValue('SubtotalNettValue', '0');

            this.setControlValue('TotalNoOfCalls', '0');
            this.setControlValue('TotalNoOfExchanges', '0');
            this.setControlValue('TotalTimeInteger', '0');
            this.setControlValue('TotalTime', '00:00');
            this.setControlValue('TotalNettValue', '0');
        }
    }

    private disableFormControls(): void {
        this.disableControl('StartDate', true);
        this.disableControl('EndDate', true);
        this.disableControl('EmployeeSurname', true);
        this.disableControl('ContractDesc', true);

        this.disableControl('UnplannedNoOfCalls', true);
        this.disableControl('UnplannedNoOfExchanges', true);
        this.disableControl('UnplannedTime', true);
        this.disableControl('UnplannedNettValue', true);
        this.disableControl('SubtotalNoOfCalls', true);
        this.disableControl('SubtotalNoOfExchanges', true);
        this.disableControl('SubtotalTime', true);
        this.disableControl('SubtotalNettValue', true);
        this.disableControl('TotalNoOfCalls', true);
        this.disableControl('TotalNoOfExchanges', true);
        this.disableControl('TotalTime', true);
        this.disableControl('TotalNettValue', true);
        this.disableControl('WeekNumber', true);

        this.disableControl('ServicePlanNumber', true);
    }

    private setDefaultDateRanges(): void {
        //Set the start date to the upcoming Saturday. If it's already a Saturday, then set to next Saturday.
        let formData: any = {};
        let search: URLSearchParams = this.getURLSearchParamObject();

        search.set(this.serviceConstants.Action, '6');

        formData['ActionType'] = 'GetStartDate';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.subscription.add(
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.setControlValue('StartDate', data.StartDate);
                        this.setControlValue('FirstWeekDay', data.FirstWeekDay);
                        this.setControlValue('EndDate', this.utils.addDays(this.getControlValue('StartDate'), 6));

                        this.setUpToDateValue();

                        this.setControlValue('ExPlannedDateRange', true);
                        this.setControlValue('ExPlannedDateTo', this.utils.addDays(this.getControlValue('StartDate'), -1));
                        this.setControlValue('ExPlannedDateFrom', this.utils.addDays(this.getControlValue('StartDate'), -7));

                        this.getLatestWeekNumber();
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                })
        );
    }

    private setUpToDateValue(): void {
        let endDate = new Date(this.getControlValue('EndDate'));
        let lastDay = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
        this.setControlValue('UpToDate', lastDay);
    }

    private getLatestWeekNumber(): void {
        let formData: any = {};
        let search: URLSearchParams = this.getURLSearchParamObject();

        search.set(this.serviceConstants.Action, '6');

        formData['ActionType'] = 'GetLatestWeekNumber';
        formData['BranchNumber'] = this.utils.getBranchCode();
        formData['BranchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');
        formData['StartDate'] = this.getControlValue('StartDate');
        formData['EndDate'] = this.getControlValue('EndDate');
        formData['UpToDate'] = this.getControlValue('UpToDate');
        formData['GetWarnMessage'] = this.getControlValue('GetWarnMessage');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.subscription.add(
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.setControlValue('WeekNumber', data.WeekNumber);

                        if (data.WarningMessageDesc) {
                            this.modalAdvService.emitMessage(new ICabsModalVO(data.WarningMessageDesc));
                        }

                        this.buildGrid();
                        this.riGrid.RefreshRequired();
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                })
        );

        this.setControlValue('GetWarnMessage', '');
    }

    private clearTable(): void {
        this.pageParams.isShowGrid = false;
    }

    private setAttributes(rTR: any): void {
        let servicePlanNumber: string = '';
        // Variable AddElementNumber is used to add to the element numbers below as these numbers can change depending on what columns are being shown
        if (this.getControlValue('BranchServiceAreaCode')) {
            this.pageParams.addElementNumber = 0;
            this.setAttribute('BranchServiceAreaCode', '');
        } else {
            this.pageParams.addElementNumber = 1;
            this.setAttribute('BranchServiceAreaCode', rTR.children[0].children[0].children[0].innerText);
        }

        this.setAttribute('ContractRowID', rTR.children[0 + this.pageParams.addElementNumber].children[0].children[0].getAttribute('AdditionalProperty'));
        let contractNumber: string = rTR.children[0 + this.pageParams.addElementNumber].children[0].children[0].innerText;
        if (contractNumber) {
            let arrObj: Array<string> = contractNumber.split('/');
            if (arrObj.length > 1) {
                this.setAttribute('ContractNumber', arrObj[1]);
            }
        }
        this.setAttribute('PremiseRowID', rTR.children[1 + this.pageParams.addElementNumber].children[0].children[0].getAttribute('AdditionalProperty'));
        this.setAttribute('ServiceCoverRowID', rTR.children[5 + this.pageParams.addElementNumber].children[0].children[0].getAttribute('AdditionalProperty'));
        this.setAttribute('PlanVisitStatusCode', rTR.children[7 + this.pageParams.addElementNumber].children[0].children[0].getAttribute('AdditionalProperty'));
        this.setAttribute('VisitTypeCode', rTR.children[8 + this.pageParams.addElementNumber].children[0].children[0].innerText);
        servicePlanNumber = rTR.children[11 + this.pageParams.addElementNumber].children[0].children[0].getAttribute('AdditionalProperty');
        if (servicePlanNumber) {
            this.setAttribute('ServicePlanNumber', this.utils.CInt(servicePlanNumber));
        } else {
            this.setAttribute('ServicePlanNumber', 0);
        }
        this.setAttribute('VisitDate', this.globalize.parseDateToFixedFormat(rTR.children[11 + this.pageParams.addElementNumber].children[0].children[0].innerText));
        this.setAttribute('PlanVisitRowID', rTR.children[12 + this.pageParams.addElementNumber].children[0].children[0].getAttribute('AdditionalProperty'));
        this.setAttribute('Row', rTR.sectionRowIndex);
    }

    private setSelectedItemToDropdownStatic(dropdownObject: DropdownStaticComponent, value: any): void {
        if (dropdownObject && value) {
            if (dropdownObject.inputData.length > 0) {
                let index: number = dropdownObject.inputData.findIndex(element => element.value === value);
                if (index >= 0) {
                    dropdownObject.updateSelectedItem(index);
                }
            }
        }
    }

    private getLookupData(): void {
        let lookupIP_details = [{
            'table': 'Contract',
            'query': { 'ContractNumber': this.getControlValue('ContractNumberSearch'), 'BusinessCode': this.businessCode },
            'fields': ['ContractName']
        }];

        this.LookUp.lookUpRecord(lookupIP_details).subscribe((data) => {
            if (data && data.length > 0 && data[0].length > 0) {
                let contract: any = data[0][0];

                if (contract) {
                    if (contract.ContractName) {
                        this.setControlValue('ContractDesc', contract.ContractName);
                    }
                }
            }
        });
    }

    // Listener for keydown events
    @HostListener('document:keydown', ['$event']) document_onkeydown(event: any): void {
        if (this.parentMode !== 'ServicePlan') {
            switch (event.keyCode) {
                // GoTo Current WeekEndingDate
                case 106: // * in num pad
                    this.setDefaultDateRanges();
                    this.setControlValue('GetWarnMessage', 'Yes');
                    this.riGrid.RefreshRequired();
                    this.clearTable();
                    break;
                // + 7 Days
                case 107: // + in num pad
                    this.setControlValue('StartDate', this.utils.addDays(this.getControlValue('StartDate'), 7));
                    this.setControlValue('EndDate', this.utils.addDays(this.getControlValue('EndDate'), 7));
                    this.setUpToDateValue();
                    this.setControlValue('GetWarnMessage', 'Yes');
                    this.getLatestWeekNumber();
                    this.riGrid.RefreshRequired();
                    this.clearTable();
                    break;
                // - 7 Days
                case 109: // - in num pad -
                    this.setControlValue('StartDate', this.utils.addDays(this.getControlValue('StartDate'), -7));
                    this.setControlValue('EndDate', this.utils.addDays(this.getControlValue('EndDate'), -7));
                    this.setUpToDateValue();
                    this.setUpToDateValue();
                    this.setControlValue('GetWarnMessage', 'Yes');
                    this.getLatestWeekNumber();
                    this.riGrid.RefreshRequired();
                    this.clearTable();
                    break;
            }
        }
    };

    // Refresh the grid data on user click
    public onRiGridRefresh(event: any): void {
        if (this.pageParams.gridConfig.currentPage <= 0) {
            this.pageParams.gridConfig.currentPage = 1;
        }
        if (event !== null) { this.riGrid.HeaderClickedColumn = ''; }
        this.populateGrid();
    }

    // Callback to retrieve the current page on user clicks
    public getCurrentPage(event: any): void {
        this.pageParams.gridConfig.currentPage = event.value;
        this.onRiGridRefresh(null);
    }

    // Handles grid sort functionality
    public onRiGridSort(): void {
        this.onRiGridRefresh(null);
    }

    public onServicePlanningDblClick(event: any): void {
        let objSrc: any = event.srcElement;
        let objTR: any;
        let mode: string = '';

        switch (this.riGrid.CurrentColumnName) {
            case 'ContractNumber':
            case 'PremiseNumber':
            case 'ProductCode':
            case 'VisitTypeCode':
            case 'Status':
            case 'ApptConfirmed':
            case 'Info':
            case 'BranchServiceAreaSeqNo':
                if (objSrc.tagName === 'TD') {
                    objTR = objSrc.parentElement;
                } else {
                    objTR = objSrc.parentElement.parentElement.parentElement;
                }

                if (this.riGrid.CurrentColumnName === 'Status' ||
                    this.riGrid.CurrentColumnName === 'ApptConfirmed' ||
                    this.riGrid.CurrentColumnName === 'Info') {
                    if (objSrc.tagName === 'IMG') {
                        objTR = objSrc.parentElement.parentElement.parentElement;
                    } else {
                        return;
                    }
                }
                this.setAttributes(objTR);

                switch (objTR.children[4 + this.pageParams.addElementNumber].children[0].children[0].getAttribute('AdditionalProperty')) {
                    case 'C':
                        this.pageParams.currentContractTypeURLParameter = '';
                        break;
                    case 'J':
                        this.pageParams.currentContractTypeURLParameter = '<job>';
                        break;
                    case 'P':
                        this.pageParams.currentContractTypeURLParameter = '<product>';
                        break;
                }

                switch (this.riGrid.CurrentColumnName) {
                    case 'ContractNumber':
                        this.navigate('ServicePlanning', AppModuleRoutes.CONTRACTMANAGEMENT + ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE_SUB,
                            {
                                CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter,
                                ContractNumber: this.getAttribute('ContractNumber')
                            });
                        break;
                    case 'PremiseNumber':
                        this.navigate('ServicePlanning', AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.PREMISESMAINTENANCE + ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE_SUB,
                            {
                                CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter
                            });
                        break;
                    case 'ProductCode':
                        if (this.pageParams.currentContractTypeURLParameter === '<product>') {
                            this.navigate('ServicePlanning', InternalGridSearchSalesModuleRoutes.ICABSAPRODUCTSALESSCDETAILMAINTENANCE,
                                {
                                    CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter
                                });
                        } else {
                            this.navigate('ServicePlanning', AppModuleRoutes.SERVICECOVERMAINTENANCE + ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE_SUB,
                                {
                                    CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter
                                });
                        }
                        break;
                    case 'BranchServiceAreaSeqNo':
                        if (this.parentMode === 'ServicePlan') {
                            // TODO
                            // this.navigate('ConfirmedPlan', Service/iCABSSeServiceVisitMaintenance.htm,
                            //     {
                            //         CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter
                            //     });
                            this.modalAdvService.emitMessage(new ICabsModalVO('iCABSSeServiceVisitMaintenance.htm - This screen is not yet developed!'));
                        }
                        break;
                    case 'VisitTypeCode':
                        mode = '';
                        if (this.parentMode === 'ServicePlan') {
                            mode = 'ServicePlan';
                        } else {
                            mode = 'ServicePlanning';
                        }
                        // TODO
                        // this.navigate(mode, Service/iCABSSeServicePlannedDatesGrid.htm,
                        //     {
                        //         CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter
                        //     });
                        this.modalAdvService.emitMessage(new ICabsModalVO('iCABSSeServicePlannedDatesGrid.htm - This screen is not yet developed!'));
                        break;
                    case 'Status':
                        if (objSrc.getAttribute('AdditionalProperty') !== 'Blank') {
                            mode = '';
                            if (this.parentMode === 'ServicePlan') {
                                mode = 'ServicePlan';
                            } else {
                                mode = 'ServicePlanning';
                            }

                            if (this.getAttribute('PlanVisitStatusCode') === 'C') {
                                let iCabsModalVO: ICabsModalVO = new ICabsModalVO(MessageConstant.PageSpecificMessage.cannotPlanACancelledVisit);
                                iCabsModalVO.title = MessageConstant.Message.WarningTitle;
                                this.modalAdvService.emitMessage(iCabsModalVO);
                            } else {
                                this.setControlValue('PlannedVisitDuration', this.riGrid.Details.GetValue('VisitDuration'));
                                // TODO
                                // this.navigate(mode, Service/iCABSSeServicePlanningDetailHg.htm,
                                //     {
                                //         CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter
                                //     });
                                this.modalAdvService.emitMessage(new ICabsModalVO('iCABSSeServicePlanningDetailHg.htm - This screen is not yet developed!'));
                            }
                        }
                        break;
                    case 'ApptConfirmed':
                        mode = '';
                        if (this.parentMode === 'ServicePlan' || this.getAttribute('ServicePlanNumber') > 0) {
                            mode = 'ServicePlan';
                        } else {
                            mode = 'ServicePlanning';
                        }
                        // TODO
                        // this.navigate(mode, Application/iCABSAVisitAppointmentMaintenance.htm,
                        //     {
                        //         CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter
                        //     });
                        this.modalAdvService.emitMessage(new ICabsModalVO('iCABSAVisitAppointmentMaintenance.htm - This screen is not yet developed!'));
                        break;
                    case 'Info':
                        mode = '';
                        if (this.parentMode === 'ServicePlan') {
                            mode = 'ServicePlan';
                        } else {
                            mode = 'ServicePlanning';
                        }
                        // TODO
                        // this.navigate(mode, Service/iCABSSeServicePlanningInfo.htm,
                        //     {
                        //         CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter
                        //     });
                        this.modalAdvService.emitMessage(new ICabsModalVO('iCABSSeServicePlanningInfo.htm - This screen is not yet developed!'));
                        break;
                }

                break;
        }
    }

    public onGridPageSizeChange(event: any): void {
        if (this.getControlValue('GridPageSize')) {
            this.pageParams.gridConfig.pageSize = this.getControlValue('GridPageSize');
        }
    }

    public onUpToDateChange(event: any): void {
        this.getLatestWeekNumber();
    }

    // Populate data from ellipsis
    public onEllipsisDataReceived(type: string, event: any): void {
        switch (type) {
            case 'BranchServiceArea':
                this.setControlValue('BranchServiceAreaCode', event.BranchServiceAreaCode);
                this.setControlValue('EmployeeSurname', event.EmployeeSurname);
                this.onBranchServiceAreaCodeChange(null);
                this.buildGrid();
                break;
            case 'Contract':
                this.setControlValue('ContractNumberSearch', event.ContractNumber);
                this.setControlValue('ContractDesc', event.ContractName);
                break;
            default:
        }
    }

    public onBranchServiceAreaCodeChange(event: any): void {
        if (this.getControlValue('BranchServiceAreaCode')) {
            let formData: any = {};
            let search: URLSearchParams = this.getURLSearchParamObject();

            search.set(this.serviceConstants.Action, '6');

            formData['ActionType'] = 'GetEmployeeSurname';
            formData['BranchNumber'] = this.utils.getBranchCode();
            formData['BranchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');
            formData['StartDate'] = this.getControlValue('StartDate');

            this.ajaxSource.next(this.ajaxconstant.START);
            this.subscription.add(
                this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
                    .subscribe(
                    (data) => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        if (data.hasError) {
                            this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                        } else {
                            this.setControlValue('EmployeeSurname', data.EmployeeSurname);

                            if (data.ErrorMessageDesc) {
                                this.modalAdvService.emitMessage(new ICabsModalVO(data.ErrorMessageDesc));
                                this.pageParams.isErrorMessageFlagged = true;
                            } else {
                                if (data.WarningMessageDesc) {
                                    this.modalAdvService.emitMessage(new ICabsModalVO(data.WarningMessageDesc));
                                }
                                this.buildGrid();
                                this.riGrid.RefreshRequired();
                                this.pageParams.isErrorMessageFlagged = false;
                            }
                            this.buildGrid();
                        }
                    },
                    (error) => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                    })
            );
            this.onBranchServiceAreaCodeDeactivate(null);
        }

        // Clear out total calls, units, times and nett values
        this.setControlValue('UnplannedNoOfCalls', '0');
        this.setControlValue('UnplannedNoOfExchanges', '0');
        this.setControlValue('UnplannedTime', '00:00');
        this.setControlValue('UnplannedNettValue', '0');

        this.setControlValue('SubtotalNoOfCalls', '0');
        this.setControlValue('SubtotalNoOfExchanges', '0');
        this.setControlValue('SubtotalTime', '00:00');
        this.setControlValue('SubtotalNettValue', '0');

        this.setControlValue('TotalNoOfCalls', '0');
        this.setControlValue('TotalNoOfExchanges', '0');
        this.setControlValue('TotalTime', '00:00');
        this.setControlValue('TotalTimeInteger', '0');
        this.setControlValue('TotalNettValue', '0');

        this.clearTable();
        this.buildGrid();
        this.riGrid.RefreshRequired();
    }

    public onBranchServiceAreaCodeDeactivate(event: any): void {
        if (this.pageParams.isErrorMessageFlagged) {
            this.setControlValue('BranchServiceAreaCode', '');
        }

        if (!this.getControlValue('BranchServiceAreaCode')) {
            this.setControlValue('EmployeeSurname', '');
            if (!this.pageParams.isSingleServicePlanPerBranch) {
                this.pageParams.isSummaryDisabled = true;
            }
        } else {
            this.pageParams.isSummaryDisabled = false;
        }

        this.pageParams.isErrorMessageFlagged = false;
        this.buildGrid();
    }

    public onContractNumberChange(event: any): void {
        if (this.getControlValue('ContractNumberSearch')) {
            this.getLookupData();
        } else {
            this.setControlValue('ContractDesc', '');
        }
    }

    public onNegBranchDataReceived(event: any): void {
        this.setControlValue('NegBranchNumber', event.BranchNumber);
        if (event.BranchNumber === '') {
            this.pageParams.negBranchNumberSelected = {
                id: '',
                text: ''
            };
        } else {
            this.pageParams.negBranchNumberSelected = {
                id: event.BranchNumber,
                text: event.BranchNumber + ' - ' + event.BranchName
            };
        }
    }

    public onProductServiceGroupDataReceived(event: any): void {
        this.setControlValue('ProductServiceGroupString', event.ProductServiceGroupCode);
        if (event.ProductServiceGroupCode === '') {
            this.pageParams.productServiceGroupSelected = {
                id: '',
                text: ''
            };
        } else {
            this.pageParams.productServiceGroupSelected = {
                id: event.ProductServiceGroupCode,
                text: event.ProductServiceGroupCode + ' - ' + event.ProductServiceGroupDesc
            };
        }
    }

    public onDropdownStaticChange(key: string, value: any): void {
        switch (key) {
            case 'StatusFilter':
                this.setControlValue('PlanningStatusSelected', value);
                break;
            case 'VisitTypeFilter':
                this.setControlValue('VisitTypeSelected', value);
                break;
            case 'DisplayFilter':
                this.setControlValue('DisplaySelected', value);
                break;
            case 'ContractTypeFilter':
                this.setControlValue('ContractTypeSelected', value);
                break;
            case 'SearchFilter':
                this.setControlValue('SearchSelected', value);
                switch (value.toString()) {
                    case 'Postcode':
                        this.pageParams.isShowPostcode = true;
                        this.setControlValue('Postcode', '');
                        this.setControlValue('PremiseName', '');
                        break;
                    case 'Name':
                        this.pageParams.isShowPostcode = false;
                        this.setControlValue('Postcode', '');
                        this.setControlValue('PremiseName', '');
                        break;
                }
                break;
        }
    }

    public onSummaryClick(event: any): void {
        this.populateGrid();

        // TODO
        // this.navigate('ServicePlanning', Service/iCABSSeServicePlanningSummaryGrid.htm,
        //     {
        //         CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter
        //     });
        this.modalAdvService.emitMessage(new ICabsModalVO('iCABSSeServicePlanningSummaryGrid.htm - This screen is not yet developed!'));
    }

    public onCalendarClick(event: any): void {
        // this.navigate('ServicePlanning', Service/iCABSServicePlanningCalendar.htm);
        this.modalAdvService.emitMessage(new ICabsModalVO('iCABSServicePlanningCalendar.htm - This screen is not yet developed!'));
    }

    public onDefaultRoutinesClick(event: any): void {
        if (!this.riExchange.riInputElement.isError(this.uiForm, 'BranchServiceAreaCode')) {
            let formData: any = {};
            let search: URLSearchParams = this.getURLSearchParamObject();

            search.set(this.serviceConstants.Action, '6');

            formData['ActionType'] = 'DefaultRoutines';
            formData['BranchNumber'] = this.utils.getBranchCode();
            formData['BranchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');
            formData['StartDate'] = this.getControlValue('StartDate');
            formData['UpToDate'] = this.getControlValue('UpToDate');

            this.ajaxSource.next(this.ajaxconstant.START);
            this.subscription.add(
                this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
                    .subscribe(
                    (data) => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        if (data.hasError) {
                            this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                        }
                        this.populateGrid();
                    },
                    (error) => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                    })
            );
        }
    }
}
