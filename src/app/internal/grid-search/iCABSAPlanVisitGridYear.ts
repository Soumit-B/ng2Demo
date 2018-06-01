import * as moment from 'moment';
import { InternalGridSearchApplicationModuleRoutes, InternalMaintenanceApplicationModuleRoutes, InternalGridSearchServiceModuleRoutes } from './../../base/PageRoutes';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpService } from './../../../shared/services/http-service';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Input, NgZone, forwardRef, Inject, Renderer } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, URLSearchParams } from '@angular/http';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Event } from '@angular/router';
import { Logger } from '@nsalaun/ng2-logger';
import { Subscription } from 'rxjs';

import { ServiceConstants } from './../../../shared/constants/service.constants';
import { GridComponent } from './../../../shared/components/grid/grid';
import { LookUp } from './../../../shared/services/lookup';
import { RiExchange } from './../../../shared/services/riExchange';
import { SpeedScript } from './../../../shared/services/speedscript';
import { Utils } from './../../../shared/services/utility';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { ErrorService } from '../../../shared/services/error.service';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { InternalGridSearchSalesModuleRoutes } from './../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSAPlanVisitGridYear.html',
    styles: [`
        :host /deep/ .gridtable thead tr:nth-child(2) th:first-child {
            min-width: 100px;
        }
        :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(n+2):nth-child(-n+32) {
            min-width: 22px;
        }
    `]
})

export class PlanVisitGridYearComponent implements OnInit, OnDestroy {
    @ViewChild('messageModal') public messageModal;
    //@ViewChild('visitGrid') visitGrid: GridComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('gridPagination') gridPagination: PaginationComponent;

    public SelectedDate: any;
    private ajaxSource = new BehaviorSubject<any>(0);
    private errMsg: string;
    public yearList: Array<any> = [];
    public viewTypeList: Array<any> = [];
    public menuList: Array<any> = [];

    public vbEnableInstallsRemovals: any;
    public vbEnableWED: any;
    public vbManualVisitIntervalSetup: any;
    public vbEnableTabularView: Boolean = false;
    public blnFromComplianceReport: Boolean = false;
    public vSCWeeklyVisitPatternLog: any;
    public vSCEnableWeeklyVisitPattern: any;

    public search: URLSearchParams = new URLSearchParams();
    public isRequesting: boolean = false;
    public method: string = 'service-planning/maintenance';
    public module: string = 'plan-visits';
    public operation: string = 'Application/iCABSAPlanVisitGridYear';

    public strGridData: any;
    public strColumn: any;
    public maxColumn: number = 35;
    public itemsPerPage: number = 500;
    public currentPage: number = 1;

    public attrContractNumberServiceCoverRowID: string;
    public PremiseNumberValue: string;
    public PremiseNameValue: string;
    public ContractNumberSelectedDateValue: string;
    private routeParams: any;
    public attributes: any = {
        ProductCode: {}
    };
    public curPage: number = 1;
    public totalRecords: number;
    public pageSize: number = 10;
    public uiForm: FormGroup;

    //public BusinessCode: string = this.utils.getBusinessCode();
    public ContractObject = { type: '', label: '' };
    public inputParams: any = { parentMode: '', ServiceCover: '' };

    private sub: Subscription;
    public subscription: Subscription;
    private subLookup: Subscription;
    private subLookup2: Subscription;

    public controls = [
        { name: 'menu', readonly: false, disabled: false, required: false }, //user input
        { name: 'ContractNumber', readonly: true, disabled: true, required: true, value: '', type: MntConst.eTypeCode }, //Parent page
        { name: 'ContractName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText }, //Returned form Lookup 2
        { name: 'ViewTypeFilter', readonly: true, disabled: false, required: false }, //user input
        { name: 'SelectedYear', readonly: true, disabled: false, required: false, type: MntConst.eTypeInteger }, //user input
        { name: 'PremiseNumber', readonly: true, disabled: true, required: true, value: '', type: MntConst.eTypeInteger }, //Parent page
        { name: 'PremiseName', readonly: true, disabled: true, required: true, type: MntConst.eTypeText }, //Returned form Lookup 2
        { name: 'ProductCode', readonly: true, disabled: true, required: true, value: '', type: MntConst.eTypeCode }, //Parent page
        { name: 'ProductDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText }, //Returned form Lookup 2
        { name: 'VisitCycleInWeeks', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger }, //TODO - Returned form Lookup 1
        { name: 'VisitsPerCycle', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger }, //TODO - Returned form Lookup 1
        { name: 'ServiceVisitFrequency', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger }, //Returned form Lookup 1
        { name: 'TotalVisits', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger }, //Returned from Grid
        { name: 'TotalUnits', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger }, //Returned from Grid
        { name: 'TotalWED', readonly: true, disabled: true, required: false, type: MntConst.eTypeDecimal1 }, //Returned from Grid
        { name: 'TotalTime', readonly: true, disabled: true, required: false, type: MntConst.eTypeText }, //Returned from Grid
        { name: 'TotalNettValue', readonly: true, disabled: true, required: false, type: MntConst.eTypeCurrency }, //Returned from Grid
        { name: 'chkIntervalTooShort', readonly: true, disabled: false, required: false }, //Parent page
        { name: 'IntervalShortFirstDate', readonly: true, disabled: true, required: false, type: MntConst.eTypeDate }, //Parent page
        { name: 'chkIntervalTooLong', readonly: true, disabled: false, required: false }, //Parent page
        { name: 'IntervalLongFirstDate', readonly: true, disabled: true, required: false, type: MntConst.eTypeDate }, //Parent page
        { name: 'chkVisitsTooLow', readonly: true, disabled: false, required: false }, //Parent page
        { name: 'chkVisitsTooHigh', readonly: true, disabled: false, required: false }, //parent page
        { name: 'BusinessCode', readonly: true, disabled: false, required: false, value: this.utils.getBusinessCode(), type: MntConst.eTypeCode },
        { name: 'ServiceCoverNumber', readonly: true, disabled: false, required: false, value: '', type: MntConst.eTypeInteger } //Parent page
    ];

    public uiDisplay = {
        pageHeader: 'Planned Visits',
        trContract: false,
        trPremise: false,
        trProduct: false,
        VisitCycleInWeeks: true,
        VisitsPerCycle: true,
        IntervalShortFirstDate: true,
        IntervalLongFirstDate: true,
        ServiceVisitFrequency: true,
        trCompliance: true,
        cmd_TabularView: false,
        tdTotalWED: false,
        legend: [],
        label: {
            tdVisitCycleInWeeksLabel: 'Weeks Between Visits',
            tdVisitsPerCycleLabel: 'Visits Per Week',
            tdIntervalTooShort: 'Interval too short',
            tdIntervalShortFirstDateLabel: 'First date',
            tdIntervalTooLong: 'Interval too long',
            tdIntervalLongFirstDateLabel: 'First date',
            tdServiceVisitFrequencyLabel: 'Visit Frequency'
        }
    };

    //********** */
    constructor(
        private ajaxconstant: AjaxObservableConstant,
        private httpService: HttpService,
        private logger: Logger,
        private utils: Utils,
        private SpeedScript: SpeedScript,
        private errorService: ErrorService,
        private serviceConstants: ServiceConstants,
        private router: Router,
        private route: ActivatedRoute,
        private translateService: LocaleTranslationService,
        private riExchange: RiExchange,
        private formBuilder: FormBuilder,
        private LookUp: LookUp,
        private SysCharConstants: SysCharConstants,
        private location: Location
    ) {
        //Route Params
        this.sub = this.route.queryParams.subscribe(
            (params: any) => {
                this.routeParams = params;
                this.logger.log(JSON.stringify(params));
                for (let key in params) {
                    if (params.hasOwnProperty('ComplianceReport')) this.blnFromComplianceReport = true;
                }
            }
        );
    }

    ngOnInit(): void {
        // statements
        this.uiForm = this.formBuilder.group({});
        this.renderPage();
        this.translateService.setUpTranslation();

        //Syschar
        let sysCharNumbers = [
            this.SysCharConstants.SystemCharEnableInstallsRemovals,
            this.SysCharConstants.SystemCharEnableWED,
            this.SysCharConstants.SystemCharEnablePlanVisitTabularView,
            this.SysCharConstants.SystemCharEnableWeeklyVisitPattern
        ];
        let sysCharIP = {
            operation: 'iCABSAPlanVisitGridYear',
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharNumbers.toString()
        };
        this.SpeedScript.sysChar(sysCharIP).subscribe((data) => {
            this.logger.log('iCABSAPlanVisitGridYear.htm - init:', data);
            this.vbEnableInstallsRemovals = data['records'][0].Required;
            this.vbEnableWED = data['records'][1].Required;
            this.vbEnableTabularView = data['records'][2].Required;
            this.vSCEnableWeeklyVisitPattern = data['records'][3].Logical;
            this.vSCWeeklyVisitPatternLog = data['records'][3].Required;
            this.vbManualVisitIntervalSetup = this.vSCWeeklyVisitPatternLog;
            this.logger.log('SysChars', this.vbEnableTabularView, data['records'][2]);

            if (this.vbEnableTabularView) {
                this.uiDisplay.cmd_TabularView = true;
            } else {
                this.uiDisplay.cmd_TabularView = false;
            }

            if (this.vbEnableWED) {
                this.riExchange.riInputElement.Disable(this.uiForm, 'TotalWED');
                this.uiDisplay.tdTotalWED = true;
            } else {
                this.uiDisplay.tdTotalWED = false;
            }

            this.window_onload();
        });
    }

    public ngOnDestroy(): void {
        if (this.subscription) { this.subscription.unsubscribe(); }
        if (this.sub) { this.sub.unsubscribe(); }
        if (this.subLookup) { this.subLookup.unsubscribe(); }
        if (this.subLookup2) { this.subLookup2.unsubscribe(); }
    }

    private window_onload(): void {
        this.ContractObject.type = this.utils.getCurrentContractType(this.routeParams.CurrentContractTypeURLParameter);
        this.ContractObject.label = this.utils.getCurrentContractLabel(this.ContractObject.type);
        this.utils.setTitle(this.uiDisplay.pageHeader);
        this.BuildMenuOptions();
        this.riGrid.DefaultBorderColor = 'DDDDDD';
        this.riGrid.FunctionPaging = false;
        this.riGrid.FixedWidth = true;
    }

    public renderPage(): void {
        this.riExchange.renderForm(this.uiForm, this.controls);

        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ContractNumber', true));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'PremiseNumber', true));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ProductCode', true));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverNumber', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ServiceCoverRowID', true));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ViewTypeFilter', 'Visit');

        this.uiDisplay.trContract = true;
        this.uiDisplay.trPremise = true;
        this.uiDisplay.trProduct = true;

        this.BuildYearOptions();
        this.doLookup();

        this.inputParams.parentMode = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'parentMode', true);
        this.inputParams.ServiceCover = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ServiceCoverRowID', true);
        this.updateViewOption(this.inputParams);

        if (this.blnFromComplianceReport) {
            //checkboxes need to be disabled after setting their value
            this.riExchange.riInputElement.Disable(this.uiForm, 'chkVisitsTooLow');
            this.riExchange.riInputElement.Disable(this.uiForm, 'chkVisitsTooHigh');
            this.riExchange.riInputElement.Disable(this.uiForm, 'chkIntervalTooShort');
            this.riExchange.riInputElement.Disable(this.uiForm, 'chkIntervalTooLong');

            if (!this.vbManualVisitIntervalSetup) {
                this.uiDisplay.label.tdVisitCycleInWeeksLabel = '';
                this.uiDisplay.VisitCycleInWeeks = false;
                this.uiDisplay.label.tdVisitsPerCycleLabel = '';
                this.uiDisplay.VisitsPerCycle = false;
                this.uiDisplay.label.tdIntervalTooShort = '';
                this.uiDisplay.label.tdIntervalShortFirstDateLabel = '';
                this.uiDisplay.IntervalShortFirstDate = false;
                this.uiDisplay.label.tdIntervalTooLong = '';
                this.uiDisplay.label.tdIntervalLongFirstDateLabel = '';
                this.uiDisplay.IntervalLongFirstDate = false;
            }
        } else {
            this.uiDisplay.label.tdServiceVisitFrequencyLabel = '';
            this.uiDisplay.label.tdVisitCycleInWeeksLabel = '';
            this.uiDisplay.label.tdVisitsPerCycleLabel = '';
            this.uiDisplay.ServiceVisitFrequency = false;
            this.uiDisplay.VisitCycleInWeeks = false;
            this.uiDisplay.VisitsPerCycle = false;
            this.uiDisplay.trCompliance = false;
        }
        this.riGrid.HidePageNumber = true;
        // this.buildGrid();
        // this.riGrid_beforeExecute();

    }

    public updateViewOption(params: any): void {
        switch (this.inputParams.parentMode) {
            case 'ServiceCover':
            case 'PlanVisitTabular':
            case 'ServiceVisitMaintenance':
            case 'byServiceCoverRowID':
            case 'ServiceCoverAnnualCalendar':
            case 'DespatchGrid':
                this.ServiceCoverLoad();
                break;
            default:
                this.errMsg = 'error invalid parent mode!';
            //this.showAlert(this.errMsg);
        }
    }

    public BuildYearOptions(): void {
        let today = new Date();
        let yyyy = today.getFullYear();
        for (let i = 1; i < 21; i++) {
            this.yearList.push({ 'text': (yyyy - 11 + i), 'value': (yyyy - 11 + i) });
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelectedYear', yyyy);
    }

    private doLookup(): any {
        let lookupIP = [{
            'table': 'ServiceCover',
            'query': {
                'BusinessCode': this.utils.getBusinessCode(),
                'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode')
                //'ServiceCoverNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber')
            },
            'fields': ['ServiceCoverNumber', 'ContractNumber', 'PremiseNumber', 'ProductCode', 'ServiceVisitFrequency', 'VisitCycleInWeeks', 'VisitsPerCycle']
            //Call riMaintenance.RowID("ServiceCover", ContractNumber.getAttribute("ServiceCoverRowID"))
        }];
        let lookupIPSub = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')
                },
                'fields': ['ContractName']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
                },
                'fields': ['PremiseName']
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode')
                },
                'fields': ['ProductDesc']
            }
        ];

        this.subLookup = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            //TODO - Incorrect data -  this API is not correct
            this.logger.log('Lookup 1:', data);
            if (data.length > 0 && data[0].length > 0) {
                let result = data[0][0];
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverNumber', result.ServiceCoverNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', result.ServiceVisitFrequency);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'VisitCycleInWeeks', result.VisitCycleInWeeks);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'VisitsPerCycle', result.VisitsPerCycle);
            }
            //   this.riGrid_beforeExecute();
            this.buildGrid();


        });

        this.subLookup2 = this.LookUp.lookUpRecord(lookupIPSub).subscribe((data) => {
            this.logger.log('Lookup 2:', data);
            if (data.length > 0 && data[0].length > 0) {
                let resultContract = data[0];
                let resultPremise = data[1];
                let resultProduct = data[2];
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', resultContract[0].ContractName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', resultPremise[0].PremiseName);
                if (resultProduct && resultProduct.length > 0) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', resultProduct[0].ProductDesc);
                }
            }

        });
    }

    public ServiceCoverLoad(): void {
        if (this.blnFromComplianceReport) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'chkIntervalTooShort', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'IntervalTooShort', true, true));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'chkIntervalTooLong', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'IntervalTooLong', true, true));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'chkVisitsTooLow', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'VisitsTooLow', true, true));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'chkVisitsTooHigh', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'VisitsTooHigh', true, true));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'IntervalShortFirstDate', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'IntervalShortFirstDate', true));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'IntervalLongFirstDate', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'IntervalLongFirstDate', true));
        }

        this.search.set('level', 'ServiceCoverYear');
        this.search.set('RowID', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ServiceCoverRowID', true));
        if (this.inputParams.parentMode === 'ServiceVisitMaintenance' || this.inputParams.parentMode === 'DespatchGrid') {
            this.attributes['ProductCode']['ServiceCoverRowID'] = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ServiceCoverRowID', true);
        } else if (this.inputParams.parentMode === 'byServiceCoverRowID') {
            this.attributes['BusinessCode']['ServiceCoverRowID'] = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ServiceCoverRowID', true);
        } else if (this.inputParams.parentMode === 'ServiceCoverAnnualCalendar') {
            this.attributes['ProductCode']['ServiceCoverRowID'] = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ServiceCoverRowID', true);
            this.PremiseNumberValue = this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'PremiseNumber');
            this.PremiseNameValue = this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'PremiseName');
        } else {
            this.attributes['ServiceCover'] = this.riExchange.GetParentHTMLInputValue(this.routeParams, 'ServiceCoverRowID', true);
        }
    }

    public BuildMenuAddOption(rstrValue: any, rstrText: any): void {
        this.menuList.push({ 'text': rstrText, 'value': rstrValue });
    }
    public BuildViewTypeOption(strValue: any, strText: any): void {
        this.viewTypeList.push({ 'text': strText, 'value': strValue });
    }
    public BuildMenuOptions(): void {
        this.BuildMenuAddOption('Options', 'Options');
        this.BuildMenuAddOption('AddPlanVisit', 'Add Plan Visit');
        this.BuildMenuAddOption('ViewTelesalesOrderLineGrid', 'Telesales Order Line Grid');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'menu', 'Options');

        if (this.vbEnableInstallsRemovals) {
            this.BuildViewTypeOption('Unit', 'Number Of Units');
        }
        this.BuildViewTypeOption('Visit', 'Visit Type');
        if (this.vbEnableWED) {
            this.BuildViewTypeOption('WED', 'W.E.D.');
        }
        this.BuildViewTypeOption('Time', 'Time');
        this.BuildViewTypeOption('Value', 'Nett Value');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ViewTypeFilter', 'Visit');
    }

    public ViewTypeFilter_onchange(param: any): void {
        this.logger.log('ViewTypeFilter_onchange: ', param);
        //this.visitGrid.clearGridData();
        this.maxColumn = 35;
        if (param === 'Time') { this.maxColumn = 34; }
        if (param === 'Value') { this.maxColumn = 34; }
        this.riGrid.ResetGrid();
        // this.riGrid_beforeExecute();
    }

    public YearFilter_onchange(param: any): void {
        //this.riGrid.ResetGrid();
        // this.riGrid_beforeExecute();
    }

    public menu_onchange(menu_ChangeValue: string): void {
        this.logger.log('menu_ChangeValue: ', menu_ChangeValue);
        this.ContractNumberSelectedDateValue = '';
        switch (menu_ChangeValue) {
            case 'AddPlanVisit':
                alert('Navigate to iCABSSePlanVisitMaintenance2, this page is not developed yet.');
                /*this.router.navigate(['Service/iCABSSePlanVisitMaintenance2.htm'], {
                    queryParams: {
                        parentMode: 'SearchAdd',
                        ServiceCoverRowID: this.inputParams.ServiceCover
                    }
                });*/
                break;
            case 'Premise':
                this.router.navigate([InternalGridSearchApplicationModuleRoutes.ICABSATELESALESORDERLINEGRID], {
                    queryParams: {
                        parentMode: 'PlanVisitGrid'
                    }
                });
                break;
        }
    }

    public cmd_TabularView_onclick(): void {
        if (this.vbEnableTabularView) {
            if (this.inputParams.parentMode === 'PlanVisitTabular') {
                this.location.back(); //TODO - verify
            } else {
                let self = { ServiceCoverRowID: this.inputParams.ServiceCover };
                let pageObj = this.riExchange.createPageObject(this.uiForm, this.controls, self);
                this.riExchange.initBridge(pageObj);
                this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSAPLANVISITTABULAR], {
                    queryParams: {
                        'parentMode': 'PlanVisitGridYear',
                        'currentContractTypeURLParameter': this.routeParams.CurrentContractTypeURLParameter,
                        'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                        'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                        'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
                        'ServiceCoverRowIDattrProdCodeParent': this.attributes['ServiceCover']
                    }
                });
            }
        }
    }

    private showAlert(msgTxt: string, type?: number): void {
        let titleModal = '';
        if (typeof type === 'undefined') type = 0;
        switch (type) {
            default:
            case 0: titleModal = 'Error Message'; break;
            case 1: titleModal = 'Success Message'; break;
            case 2: titleModal = 'Warning Message'; break;
        }
        this.messageModal.show({ msg: msgTxt, title: titleModal }, false);
    }

    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.buildGrid();
    }
    /*
     * New Grid Implementation
     */
    public buildGrid(): any {

        let iLoop = 1;
        this.riGrid.Clear();

        this.riGrid.AddColumn('Month', 'PlanVisit', 'Month', MntConst.eTypeText, 20);

        let type = this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewTypeFilter');
        for (iLoop = 1; iLoop <= 31; iLoop++) {
            this.riGrid.AddColumn(iLoop.toString(), 'PlanVisit', iLoop.toString(), (type === 'Value' ? MntConst.eTypeDecimal2 : MntConst.eTypeText), 4);
            switch (type) {
                case 'Time':
                case 'Value':
                    this.riGrid.AddColumnAlign(iLoop.toString(), MntConst.eAlignmentRight);
                    break;
                default:
                    this.riGrid.AddColumnAlign(iLoop.toString(), MntConst.eAlignmentCenter);
            }
        }

        //'#35225 Do not display the Total Column if the filter is 'Time' or 'Value'
        if (!(this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewTypeFilter') === 'Time'
            || this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewTypeFilter') === 'Value')) {
            this.riGrid.AddColumn('Total', 'PlanVisit', 'Total', MntConst.eTypeText, 18);
            this.riGrid.AddColumnAlign('Total', MntConst.eAlignmentCenter);
        }

        //'#35225 Add 2 new columns for Time and Value
        this.riGrid.AddColumn('TotalMonthTimeValue', 'PlanVisit', 'TotalMonthNettValue', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('TotalMonthTimeValue', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('TotalMonthNettValue', 'PlanVisit', 'TotalMonthNettValue', MntConst.eTypeCurrency, 10);
        this.riGrid.AddColumnAlign('TotalMonthNettValue', MntConst.eAlignmentRight);

        this.riGrid.Complete();
        this.riGrid_beforeExecute();
    }


    public riGrid_beforeExecute(): void {
        let strGridData = true;
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set('riCacheRefresh', 'True');
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', this.utils.gridHandle);

        this.search.set('year', this.riExchange.riInputElement.GetValue(this.uiForm, 'SelectedYear'));
        let filterType = this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewTypeFilter');
        this.search.set('ViewTypeFilter', filterType);

        this.isRequesting = true;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.method, this.module, this.operation, this.search).subscribe(
            (data) => {
                this.isRequesting = false;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data) {
                    if (data && data.errorMessage) {
                        this.messageModal.show(data, true);
                    } else {
                        this.curPage = 1;
                        this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateFooter = true;
                        this.riGrid.UpdateHeader = true;
                        this.riGrid.Execute(data);
                    }
                }
            },
            (error) => {
                this.logger.log('Error', error);
                this.isRequesting = false;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }
    public getCurrentPage(currentPage: any): void {
        this.curPage = currentPage.value;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_beforeExecute();
    }

    public riGrid_AfterExecute(): any {
        let iLoop;
        let oTR, oTD;
        let iBeforeCurrentMonth;
        let iAfterCurrentMonth;

        for (iLoop = 1; iLoop <= 31; iLoop++) {
            //this.riGrid.HTMLGridBody.children[0].children[iLoop].setAttribute('width', '20');
        }

        let obj = this.riGrid.HTMLGridBody.children[0].children[0].getAttribute('additionalproperty');
        if (obj) {
            setTimeout(() => {
                this.uiDisplay.legend = [];
                let legend = obj.split('bgcolor=');
                for (let i = 0; i < legend.length; i++) {
                    let str = legend[i];
                    if (str.indexOf('"#') >= 0) {
                        this.uiDisplay.legend.push({
                            color: str.substr(str.indexOf('"#') + 1, 7),
                            label: str.substr(str.indexOf('<td>') + 4, str.substr(str.indexOf('<td>') + 4).indexOf('&'))
                        });
                    }
                }
            }, 100);
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
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalVisits', TotalString[0]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalUnits', TotalString[1]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalTime', TotalString[2]);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalNettValue', (TotalString[3]) ? this.utils.cCur(TotalString[3]) : '');
        if (this.vbEnableWED) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalWED', TotalString[4]);
        }
    }

    public tbodyPlanVisit_onDblClick(event: any): any {
        let arrSelection;
        let currentCellIndex = this.riGrid.CurrentCell;
        if (currentCellIndex !== 0) {
            if (event.srcElement.getAttribute('additionalproperty') !== 'Month') {
                let currentRowIndex = this.riGrid.CurrentRow;
                //let currentCellIndex = this.riGrid.CurrentCell;
                let cellData = this.riGrid.bodyArray[currentRowIndex][0];
                arrSelection = cellData.rowID.split(' ');
                if (!Array.isArray(arrSelection) || arrSelection.length < 1) {
                    this.messageModal.show({ msg: MessageConstant.PageSpecificMessage.Error_month_year, title: 'Error' }, false);
                }

                let iSelectedDay = (currentCellIndex > 0 && currentCellIndex < 32) ? currentCellIndex : 1;
                let iSelectedMonth = arrSelection[0];
                let iSelectedYear = arrSelection[1];
                this.SelectedDate = new Date(iSelectedYear, iSelectedMonth, iSelectedDay);
                if (event.srcElement.getAttribute('additionalproperty') === 'x') { //Date without visit selected;
                    alert('Navigate to iCABSSePlanVisitMaintenance2 when available');
                } else {
                    //Check that the Additional property is not a date,if( so go straight to the Planning maintenance screen;
                    let addData = event.srcElement.getAttribute('additionalproperty');
                    if (moment(addData, 'DD/MM/YYYY', true).isValid()) {
                        addData = this.utils.convertDate(addData);
                    } else {
                        addData = this.utils.formatDate(addData);
                    }
                    let addDate = new Date(addData);
                    if (addDate.toString() === 'Invalid Date') {
                        this.router.navigate([InternalMaintenanceApplicationModuleRoutes.ICABSAPLANVISITMAINTENANCE], {
                            queryParams: {
                                parentMode: 'Year',
                                PlanVisitRowID: event.srcElement.getAttribute('additionalproperty'),
                                currentContractTypeURLParameter: this.routeParams.CurrentContractTypeURLParameter,
                                ServiceCoverRowID: event.srcElement.getAttribute('additionalproperty')
                            }
                        });
                    } else {
                        this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSAPLANVISITGRIDDAY], {
                            queryParams: {
                                parentMode: 'Year',
                                currentContractTypeURLParameter: this.routeParams.CurrentContractTypeURLParameter,
                                ServiceCoverRowID: this.routeParams.ServiceCoverRowID,
                                PlanVisitRowID: this.routeParams.ServiceCoverRowID,
                                ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                                PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                                ProductCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
                                SelectedDate: event.srcElement.getAttribute('additionalproperty')
                            }
                        });
                    }
                }
            }
        }
        else {
            this.messageModal.show({ msg: MessageConstant.Message.NoData, title: 'Error' }, false);
        }
    }

    //End


}
