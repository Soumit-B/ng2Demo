import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { URLSearchParams } from '@angular/http';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { Subscription } from 'rxjs';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../shared/components/grid/grid';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { DatepickerComponent } from './../../../shared/components/datepicker/datepicker';
import { EmployeeSearchComponent } from './../../../app/internal/search/iCABSBEmployeeSearch';
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';
import { OrderBy } from './../../../shared/pipes/orderBy';
import { InternalGridSearchModuleRoutes, AppModuleRoutes, InternalGridSearchSalesModuleRoutes, InternalMaintenanceServiceModuleRoutes, ProspectToContractModuleRoutes } from './../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSSPipelineGrid.html'
})

export class PipelineGridComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    /*
    * Initialize Variables
    */
    public pageId: string = '';
    public inputParams: any = {
        method: 'prospect-to-contract/maintenance',
        module: 'advantage',
        operation: 'Sales/iCABSSPipelineGrid',
        ActionUpdate: '6'
    };

    private search: any;
    private orderBy: OrderBy;
    public errorMessage: string;
    public isFormEnabled: boolean = false;
    public isFormValid: boolean = false;
    public cmdSelectReview: boolean = true;
    //public MenuOptionListInclusionType: Array<any> = [{}];
    public MenuOptionListMenu: Array<any> = [{}];
    public SelectFilterOptionListMenu: Array<any> = [{}];
    public lOldApptExists: boolean;
    public lClosingAppt: boolean;
    public promptAppointmentContent: string;
    public promptAppointmentTitle: string;
    public promptDiaryAppointmentContent: string;
    public promptDiaryAppointmentTitle: string;
    public showAppointmentHeader: boolean = true;
    private toDay: Date = new Date();
    public fromDate: Date;
    public toDate: Date;
    public dtDiaryDate: Date;
    public viewBySelected: string = '';

    private iNumQuotes: number;
    private iNumOpenQuotes: number;
    private lClosingWO: boolean;
    private iOpenWONumber: number = 0;

    public pageCurrent: number = 1;
    public pageSize: number = 10;
    public totalRecords: number = 0;
    public currentPage: number = 1;

    public lookUpSubscription: Subscription;
    public dateDisable: boolean = false;
    public isReturningStatus: boolean = false;

    // prompt Modal variables
    public promptTitle: string = '';
    public promptContent: string = '';
    public promptCallback: any;
    public promptNoCallback: any;

    /*public ProspectStatus = [
        {
            text: 'All',
            value: 'all'
        }
    ];*/
    /*public ProspectOrigin = [
        {
            text: 'All',
            value: '$$all$$'
        }
    ];*/
    public allOption = [
        {
            text: 'All',
            value: '$$all$$'
        }
    ];
    public allOption2 = [
        {
            text: 'All',
            value: ''
        }
    ];
    /*public Marketselect = [];*/
    public fieldHidden: any = {
        fromToDate: true,
        tdDiaryDate: true
    };
    public fieldDisable: any = {
        CompanyCode: true
    };
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public ellipsisConfig = {
        employee: {
            autoOpen: true,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp'
            },
            modalConfig: this.modalConfig,
            contentComponent: EmployeeSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };
    /*
    * Initialize Form Fields for The Page (Visible/Hidden)
    */
    public controls = [
        { name: 'EmployeeCode', readonly: true, disabled: false, required: false },
        { name: 'EmployeeSurname', readonly: true, disabled: true, required: false },
        { name: 'InclusionTypeSelect', readonly: false, disabled: false, required: false },
        { name: 'FromDate', readonly: true, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'ToDate', readonly: true, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'StatusSelect', readonly: false, disabled: false, required: false },
        { name: 'OriginSelect', readonly: true, disabled: false, required: false },
        { name: 'SelectFilter', readonly: true, disabled: false, required: false },
        { name: 'DiaryDate', readonly: true, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'SelectMarketFilter', readonly: true, disabled: false, required: false },
        { name: 'PassProspectNumber', readonly: true, disabled: true, required: false },
        { name: 'PassProspectName', readonly: true, disabled: true, required: false },
        { name: 'menu', readonly: true, disabled: false, required: false },
        { name: 'ProspectContactName', readonly: true, disabled: true, required: false },
        { name: 'ProspectContactPhone', readonly: true, disabled: true, required: false },
        { name: 'ProspectContactMobile', readonly: true, disabled: true, required: false },
        { name: 'ProspectTypeDesc', readonly: true, disabled: true, required: false },
        { name: 'ProspectSourceDesc', readonly: true, disabled: true, required: false },
        { name: 'ProspectAppointmentDetails', readonly: true, disabled: true, required: false },
        { name: 'ProspectNotes', readonly: true, disabled: true, required: false },
        { name: 'RunFrom', readonly: true, disabled: false, required: false },
        { name: 'DiaryProspectNumber', readonly: true, disabled: true, required: false },
        { name: 'PassProspectROWID', readonly: true, disabled: true, required: false },
        { name: 'PassContractROWID', readonly: true, disabled: true, required: false },
        { name: 'PassContactROWID', readonly: true, disabled: true, required: false },
        { name: 'ProspectType', readonly: true, disabled: true, required: false },
        { name: 'PipelineGridProspectNumber', readonly: true, disabled: true, required: false },
        { name: 'ForceApptEntry', readonly: true, disabled: true, required: false },
        { name: 'WarnOldOpenAppt', readonly: true, disabled: true, required: false },
        { name: 'PassWONumber', readonly: true, disabled: true, required: false },
        { name: 'SOPReportQuoteStatus', readonly: true, disabled: true, required: false },
        { name: 'SOPReportBranch', readonly: true, disabled: true, required: false },
        { name: 'SOPReportRegion', readonly: true, disabled: true, required: false },
        { name: 'GridUserCode', readonly: true, disabled: true, required: false },
        { name: 'RowType', readonly: true, disabled: true, required: false },
        { name: 'WarnOpenWOrders' },
        { name: 'QuotePassAction' },
        { name: 'QuotePassWONumber' },
        { name: 'SubSystem', value: 'SalesOrder' },
        { name: 'OwnSubmissionsInd' }

    ];
    /*
    * Initialize Constructor for The Component
    */
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSPIPELINEGRID;
        this.orderBy = injector.get(OrderBy);
    }
    /*
    * Initialize Directive Attribute for HTML Element
    */
    @ViewChild('postCodeGrid') postCodeGrid: GridComponent;
    @ViewChild('postCodePagination') postCodePagination: PaginationComponent;
    @ViewChild('InclusionTypeSelectDropdown') InclusionTypeSelectDropdown: DropdownStaticComponent;
    @ViewChild('menuSelectDropdown') menuSelectDropdown: DropdownStaticComponent;
    @ViewChild('SelectFilterDropdown') SelectFilterDropdown: DropdownStaticComponent;
    @ViewChild('StatusSelectDropdown') StatusSelectDropdown: DropdownStaticComponent;
    @ViewChild('originSelectDropdown') originSelectDropdown: DropdownStaticComponent;
    @ViewChild('marketSelectDropdown') marketSelectDropdown: DropdownStaticComponent;
    @ViewChild('promptAppointmentModal') public promptAppointmentModal;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('promptDiaryAppointmentModal') public promptDiaryAppointmentModal;
    @ViewChild('pipelineFromDatePicker') pipelineFromDatePicker: DatepickerComponent;
    @ViewChild('pipelineToDatePicker') pipelineToDatePicker: DatepickerComponent;
    @ViewChild('DiaryDatePicker') DiaryDatePicker: DatepickerComponent;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    /*
    * Bootstrap Component or Start Compoment Execution
    */
    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Pipeline Prospects';
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionUpdateSupport = true;
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.isReturningStatus = true;

            this.InclusionTypeSelectDropdown.selectedItem = this.pageParams.InclusionTypeSelectedItem;
            this.StatusSelectDropdown.selectedItem = this.pageParams.ProspectStatusSelected;
            this.originSelectDropdown.selectedItem = this.pageParams.originDropdownSelected;
            this.SelectFilterDropdown.selectedItem = this.pageParams.diaryFilterSelected;
            this.marketSelectDropdown.selectedItem = this.pageParams.marketSelectDropdownSelected;

            this.fromDate = this.pageParams.FromDate;
            this.toDate = this.pageParams.ToDate;
            this.dtDiaryDate = this.pageParams.DiaryDate;

            if (this.pageParams.childPage === 'PipelineQuoteGrid') {
                this.pageParams.childPage = '';
                this.onUnLoad_PipelineQuoteGrid();
            }
        } else {
            this.window_onload();
        }
        this.buildGrid();
        this.riGrid_BeforeExecute();
    }
    ngAfterViewInit(): void {
        this.utils.setTitle(this.pageTitle);
        if (this.parentMode === 'DiaryDay')
            this.SelectFilterChange('WITHAPPTON');

    }
    /*
    * Remove All Subscription
    */
    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
    /*
    *On Page Load/Reload Functionality
    */
    private window_onload(): void {
        this.pageParams.mode = 'load';
        this.pageParams.fieldHidden = {
            fromToDate: true,
            tdDiaryDate: true
        };
        this.viewBySelected = 'employee';
        this.parentMode = this.riExchange.getParentMode();
        this.setControlValue('RunFrom', this.parentMode);
        switch (this.parentMode) {
            case 'ContactCentreReview':
                this.cmdSelectReview = false;
                break;
            default:
                break;
        }
        switch (this.pageParams.mode) {
            case 'load':
                this.loadUserForm();
                break;
            default:
                break;
        }

        if (this.parentMode === 'SOPReportGrid' || this.parentMode === 'SOPReportGridProspect' || this.parentMode === 'SOPReportGridQuotesInput') {
            this.setControlValue('FromDate', this.riExchange.getParentHTMLValue('DateFrom'));
            this.fromDate = this.utils.convertDate(this.riExchange.getParentHTMLValue('DateFrom'));
            this.setControlValue('ToDate', this.riExchange.getParentHTMLValue('DateTo'));
            this.toDate = this.utils.convertDate(this.riExchange.getParentHTMLValue('DateTo'));

            if (this.parentMode === 'SOPReportGrid') {
                this.setControlValue('SOPReportBranch', this.riExchange.getParentHTMLValue('SOPReportBranch'));
                this.setControlValue('SOPReportRegion', this.riExchange.getParentHTMLValue('SOPReportRegion'));
                this.setControlValue('InclusionTypeSelect', 'OpenAndClosed');
            }

            if (this.parentMode === 'SOPReportGridProspect' || this.parentMode === 'SOPReportGridQuotesInput') {
                if (this.parentMode === 'SOPReportGridQuotesInput') {
                    this.setControlValue('SOPReportQuoteStatus', 'Input');
                }
                this.setControlValue('SOPReportBranch', this.riExchange.getParentHTMLValue('SOPReportBranch'));
                this.setControlValue('SOPReportRegion', this.riExchange.getParentHTMLValue('SOPReportRegion'));
                this.setControlValue('InclusionTypeSelect', 'OpenAndClosed');
            }

            this.InclusionTypeSelectChange('OpenAndClosed');
            this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('GroupDesc'));
            this.setControlValue('EmployeeSurname', this.riExchange.getParentAttributeValue('GroupCode'));

        }
        else {
            if (this.parentMode === 'DiaryDay') {
                this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('PassEmployeeCode'));
                this.setControlValue('EmployeeSurname', this.riExchange.getParentHTMLValue('PassEmployeeCode'));
                this.setControlValue('DiaryDate', this.riExchange.getParentHTMLValue('PassDiaryDate'));
                this.dtDiaryDate = this.utils.convertDate(this.riExchange.getParentHTMLValue('PassDiaryDate'));
                this.setControlValue('SelectFilter', 'WITHAPPTON');
                this.setControlValue('FromDate', this.utils.formatDate(this.utils.removeDays(this.toDay, 90)));
                this.fromDate = this.utils.removeDays(this.toDay, 90);
                this.setControlValue('ToDate', this.utils.TodayAsDDMMYYYY());
                this.toDate = this.utils.convertDate(this.utils.TodayAsDDMMYYYY());
                let diaryDate = this.utils.convertDate(this.getControlValue('DiaryDate'));
                if (diaryDate < this.toDay) {
                    this.setControlValue('InclusionTypeSelect', 'OpenAndClosed');
                    this.InclusionTypeSelectChange('OpenAndClosed');
                }
            }
            this.setControlValue('GridUserCode', this.utils.getUserCode());
            if (this.pageParams.FromDate) {
                this.setControlValue('FromDate', this.utils.formatDate(this.pageParams.FromDate));
                this.fromDate = this.pageParams.FromDate;
            } else {
                this.setControlValue('FromDate', this.utils.formatDate(this.utils.removeDays(this.toDay, 90)));
                this.fromDate = this.utils.removeDays(this.toDay, 90);
            }
            if (this.pageParams.ToDate) {
                this.setControlValue('ToDate', this.pageParams.ToDate);
                this.toDate = this.utils.convertDate(this.pageParams.ToDate);
            } else {
                this.setControlValue('ToDate', this.utils.TodayAsDDMMYYYY());
                this.toDate = this.utils.convertDate(this.utils.TodayAsDDMMYYYY());
            }
            if (this.pageParams.DiaryDate) {
                this.setControlValue('DiaryDate', this.utils.formatDate(this.pageParams.DiaryDate));
                this.dtDiaryDate = this.pageParams.DiaryDate;
            } else {
                this.setControlValue('DiaryDate', this.utils.formatDate(this.toDay));
                this.dtDiaryDate = this.toDay;
            }
        }


        this.pageParams.ProspectStatus = [
            {
                text: 'All',
                value: 'all'
            }
        ];
        this.pageParams.ProspectOrigin = [];
        this.pageParams.Marketselect = [];
        this.pageParams.SelectFilterOptionListMenu = [];
        this.pageParams.MenuOptionListMenu = [];
        this.loadListInclusionType();
        this.loadSelectFilterMenu();
        this.buildStatusList();
        this.buildOriginCodes();
        this.buildMarketSegment();
        this.loadListMenu();
        this.pageParams.FromDate = this.fromDate;
        this.pageParams.ToDate = this.toDate;
        this.pageParams.DiaryDate = this.dtDiaryDate;
        this.buildGrid();
    }
    /*
    *Load/Populate Status Select Drop Down
    */
    public buildStatusList(): void {
        let lookupIP = [
            {
                'table': 'ProspectStatusLang',
                'query': {
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['ProspectStatusCode', 'ProspectStatusDesc']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let j = 0;
            let lIncludedConverted = false;
            //this.pageParams.ProspectStatus = [];
            for (let i = 0; i < data[0].length; i++) {
                if (data[0][i].ProspectStatusDesc === 'Converted To Contract' || data[0][i].ProspectStatusDesc === 'Converted To Product Sale' || data[0][i].ProspectStatusDesc === 'Converted To Job') {
                    if (!(lIncludedConverted)) {
                        lIncludedConverted = true;
                        let obj = {
                            text: 'Converted',
                            value: '-99'
                        };
                        this.pageParams.ProspectStatus.push(obj);
                        j++;
                    }
                } else {
                    let obj = {
                        text: data[0][i].ProspectStatusDesc,
                        value: data[0][i].ProspectStatusCode
                    };
                    this.pageParams.ProspectStatus.push(obj);
                    j++;
                }
            }
        });
    }
    /*
    *On Change of Status Select Drop Down
    */
    public StatusSelectChange(obj: any): void {
        if (this.isReturningStatus && obj === 'all') {
            this.StatusSelectDropdown.selectedItem = this.pageParams.ProspectStatusSelected;
            this.uiForm.controls['StatusSelect'].setValue(this.pageParams.ProspectStatusSelected);
        } else {
            this.uiForm.controls['StatusSelect'].setValue(obj);
            this.pageParams.ProspectStatusSelected = obj;
        }
        //this.loadPipeLineGrid(this.inputParams);
    }
    /*
    *Load/Populate Origin Select Drop Down
    */
    public buildOriginCodes(): void {
        //this.pageParams.ProspectOrigin = [];
        let BusinessSourceList = [];
        let BusinessSourceLangList = [];
        let BusinessOriginList = [];
        let BusinessOriginLangList = [];
        let BusinessOriginDetailList = [];
        let BusinessOriginDetailLangList = [];
        let lookupBusinessSource = [
            {
                'table': 'BusinessSource',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['BusinessCode', 'BusinessSourceCode', 'BusinessSourceSystemDesc', 'SalesDefaultInd']
            },
            {
                'table': 'BusinessSourceLang',
                'query': {
                    'BusinessCode': this.businessCode(),
                    // 'BusinessSourceCode':
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['BusinessCode', 'BusinessSourceCode', 'BusinessSourceDesc']
            },
            {
                'table': 'BusinessOrigin',
                'query': {
                    'BusinessCode': this.businessCode()
                    //  'BusinessSourceCode': this.businessCode()
                },
                'fields': ['BusinessCode', 'BusinessSourceCode', 'BusinessOriginCode', 'BusinessOriginSystemDesc', 'DetailRequiredInd', 'ActiveInd']
            },
            {
                'table': 'BusinessOriginLang',
                'query': {
                    'BusinessCode': this.businessCode(),
                    //  'BusinessOriginCode': this.businessCode(),
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['BusinessCode', 'BusinessOriginCode', 'BusinessOriginDesc']
            },
            {
                'table': 'BusinessOriginDetail',
                'query': {
                    'BusinessCode': this.businessCode()
                    //'BusinessOriginCode': this.businessCode()
                },
                'fields': ['BusinessCode', 'BusinessOriginCode', 'BusinessOriginDetailCode', 'BusinessOriginDetailSystemDesc', 'ValidForNewInd']
            },
            {
                'table': 'BusinessOriginDetailLang',
                'query': {
                    'BusinessCode': this.businessCode(),
                    //  'BusinessOriginCode': this.businessCode(),
                    // 'BusinessOriginDetailCode': this.businessCode(),
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['BusinessCode', 'BusinessOriginCode', 'BusinessOriginDetailCode', 'BusinessOriginDetailDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupBusinessSource).subscribe((data) => {
            BusinessSourceList = data[0];
            BusinessSourceLangList = data[1];
            BusinessOriginList = data[2];
            BusinessOriginLangList = data[3];
            BusinessOriginDetailList = data[4];
            BusinessOriginDetailLangList = data[5];
            if (BusinessSourceList) {
                BusinessSourceList.forEach(i => {
                    let BusinessSource_BusinessCode = i.BusinessCode;
                    let BusinessSource_BusinessSourceCode = i.BusinessSourceCode;
                    let BusinessSource_BusinessSourceSystemDesc = i.BusinessSourceSystemDesc;
                    let filterData = BusinessSourceLangList.find(detailObj => (detailObj.BusinessSourceCode === i.BusinessSourceCode));
                    let BusinessSourceLang_desc;
                    if (filterData) {
                        this.pageParams.ProspectOrigin.push({
                            text: filterData.BusinessSourceDesc ? filterData.BusinessSourceDesc.substring(0, 7) : i.BusinessSourceSystemDesc.substring(0, 7),
                            value: filterData.BusinessSourceCode ? filterData.BusinessSourceCode : i.BusinessSourceCode
                        });
                        BusinessSourceLang_desc = filterData.BusinessSourceDesc.substring(0, 7);
                    } else {
                        BusinessSourceLang_desc = BusinessSource_BusinessSourceSystemDesc.substring(0, 7);
                    }
                    let intermediateprospectorigincode;
                    let filterData1 = BusinessOriginList.filter(detailObj => (detailObj.BusinessSourceCode === i.BusinessSourceCode));
                    if (filterData1.length > 0) {
                        filterData1.forEach(i => {
                            if (!i.ActiveInd) {
                                return;
                            }
                            else {
                                let BusinessOrigin_BusinessCode = i.BusinessCode;
                                let BusinessOrigin_BusinessOriginCode = i.BusinessOriginCode;
                                let BusinessOrigin_BusinessOriginSystemDesc = i.BusinessOriginSystemDesc.substring(0, 20);
                                let DetailRequiredInd = i.DetailRequiredInd;

                                let filterData2 = BusinessOriginLangList.find(detailObj => (detailObj.BusinessOriginCode === BusinessOrigin_BusinessOriginCode));
                                if (filterData2) {

                                    let BusinessOriginLang_BusinessOriginDesc;
                                    if (filterData2.BusinessOriginDesc) {
                                        BusinessOriginLang_BusinessOriginDesc = filterData2.BusinessOriginDesc.substring(0, 20);
                                        let obj1 = {
                                            text: BusinessSourceLang_desc + '/' + BusinessOriginLang_BusinessOriginDesc,
                                            value: BusinessSource_BusinessSourceCode + '^' + BusinessOrigin_BusinessOriginCode
                                        };
                                        intermediateprospectorigincode = BusinessSourceLang_desc + '/' + BusinessOriginLang_BusinessOriginDesc;
                                        this.pageParams.ProspectOrigin.push(obj1);
                                    }
                                }
                                else {
                                    let obj1 = {
                                        text: BusinessSourceLang_desc + '/' + BusinessOrigin_BusinessOriginSystemDesc,
                                        value: BusinessSource_BusinessSourceCode + '^' + BusinessOrigin_BusinessOriginCode
                                    };
                                    intermediateprospectorigincode = BusinessSourceLang_desc + '/' + BusinessOrigin_BusinessOriginSystemDesc;
                                    this.pageParams.ProspectOrigin.push(obj1);
                                }
                                if (DetailRequiredInd) {
                                    let filterData3 = BusinessOriginDetailList.filter(detailObj => (detailObj.BusinessOriginCode === i.BusinessOriginCode));
                                    if (filterData3.length > 0) {
                                        filterData3.forEach(i => {

                                            if (!i.ValidForNewInd) {
                                                return;
                                            }
                                            else {
                                                let BusinessOriginDetail_BusinessCode = i.BusinessCode;
                                                let BusinessOriginDetail_BusinessOriginCode = i.BusinessOriginCode;
                                                let BusinessOriginDetail_BusinessOriginDetailCode = i.BusinessOriginDetailCode;
                                                let BusinessOriginDetail_BusinessOriginDetailSystemDesc = i.BusinessOriginDetailSystemDesc.substring(0, 20);

                                                let filterData4 = BusinessOriginDetailLangList.find(detailObj => (detailObj.BusinessOriginCode === BusinessOriginDetail_BusinessOriginCode, detailObj.BusinessOriginDetailCode === BusinessOriginDetail_BusinessOriginDetailCode));
                                                if (filterData4) {
                                                    let BusinessOriginDetailLang_BusinessOriginDetailDesc = filterData4.BusinessOriginDetailDesc.substring(0, 20);
                                                    let obj1 = {
                                                        text: intermediateprospectorigincode + '/' + BusinessOriginDetailLang_BusinessOriginDetailDesc,
                                                        value: BusinessSource_BusinessSourceCode + '^' + BusinessOrigin_BusinessOriginCode + '^' + BusinessOriginDetail_BusinessOriginDetailCode
                                                    };
                                                    this.pageParams.ProspectOrigin.push(obj1);

                                                }
                                                else {
                                                    let obj1 = {
                                                        text: intermediateprospectorigincode + '/' + BusinessOriginDetail_BusinessOriginDetailSystemDesc,
                                                        value: BusinessSource_BusinessSourceCode + '^' + BusinessOrigin_BusinessOriginCode + '^' + BusinessOriginDetail_BusinessOriginDetailCode
                                                    };
                                                    this.pageParams.ProspectOrigin.push(obj1);
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        });

                    }
                });
            }
            this.pageParams.ProspectOrigin = this.orderBy.transform(this.pageParams.ProspectOrigin, 'text');
            this.pageParams.ProspectOrigin = this.allOption.concat(this.pageParams.ProspectOrigin);
            this.setControlValue('OriginSelect', this.allOption[0].value);
            //this.buildGrid();
            this.riGrid_BeforeExecute();
        });
    }


    /*
    *On Change of Origin Select Drop Down
    */
    public OriginSelectChange(obj: any): void {
        if (this.isReturningStatus && obj === '$$all$$') {
            this.originSelectDropdown.selectedItem = this.pageParams.originDropdownSelected;
            this.uiForm.controls['OriginSelect'].setValue(this.pageParams.originDropdownSelected);
        } else {
            this.uiForm.controls['OriginSelect'].setValue(obj);
            this.pageParams.originDropdownSelected = obj;
        }
        //this.uiForm.controls['OriginSelect'].setValue(obj);
        //this.loadPipeLineGrid(this.inputParams);
    }
    /*
    *Load/Populate Market Segment Select Drop Down
    */
    public buildMarketSegment(): void {
        let marketSegmentList = [];
        let marketSegmentLangList = [];
        let lookupMarketSegment = [
            {
                'table': 'MarketSegment ',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['BusinessCode', 'MarketSegmentCode', 'MarketSegmentDesc']
            },
            {
                'table': 'MarketSegmentLang ',
                'query': {
                    'BusinessCode': this.businessCode(),
                    // 'MarketSegmentCode': MarketSegment_MarketSegmentCode,
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['BusinessCode', 'MarketSegmentCode', 'MarketSegmentDesc']
            }

        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupMarketSegment).subscribe((data) => {
            marketSegmentList = data[0];
            marketSegmentLangList = data[1];
            if (marketSegmentList.length > 0) {
                marketSegmentList.forEach(i => {
                    let MarketSegment_BusinessCode = i.BusinessCode;
                    let MarketSegment_MarketSegmentCode = i.MarketSegmentCode;
                    let MarketSegment_MarketSegmentDesc = i.MarketSegmentDesc;
                    let filterData = marketSegmentLangList.find(detailObj => (detailObj.MarketSegmentCode === i.MarketSegmentCode));
                    if (filterData) {
                        this.pageParams.Marketselect.push({
                            text: filterData.MarketSegmentDesc ? filterData.MarketSegmentDesc : MarketSegment_MarketSegmentDesc,
                            value: MarketSegment_MarketSegmentCode
                        });
                    } else {
                        this.pageParams.Marketselect.push({
                            text: MarketSegment_MarketSegmentDesc,
                            value: MarketSegment_MarketSegmentCode
                        });
                    }
                });
            }
            this.pageParams.Marketselect = this.orderBy.transform(this.pageParams.Marketselect, 'text');
            this.pageParams.Marketselect = this.allOption2.concat(this.pageParams.Marketselect);

        });
    }
    /*
    *On Change of Market Segment Select Drop Down
    */
    public marketSelectChange(obj: any): void {
        if (this.isReturningStatus && obj === '') {
            this.marketSelectDropdown.selectedItem = this.pageParams.marketSelectDropdownSelected;
            this.uiForm.controls['SelectMarketFilter'].setValue(this.pageParams.marketSelectDropdownSelected);
        } else {
            this.uiForm.controls['SelectMarketFilter'].setValue(obj);
            this.pageParams.marketSelectDropdownSelected = obj;
        }
        //this.uiForm.controls['SelectMarketFilter'].setValue(obj);
        //this.loadPipeLineGrid(this.inputParams);
    }
    /*
    *Load/Populate Diary Select Drop Down
    */
    public loadSelectFilterMenu(): void {
        this.pageParams.SelectFilterOptionListMenu.push({ value: 'NONE', text: 'No Filter' });
        this.pageParams.SelectFilterOptionListMenu.push({ value: 'WITHAPPT', text: 'With An Appointment' });
        this.pageParams.SelectFilterOptionListMenu.push({ value: 'WITHAPPTON', text: 'With An Appointment On' });
        this.pageParams.SelectFilterOptionListMenu.push({ value: 'NOAPPT', text: 'Without An Appointment' });
        this.pageParams.SelectFilterOptionListMenu.splice(0, 1);
        this.SelectFilterDropdown.defaultOption = { value: 'NONE', text: 'No Filter' };
        this.SelectFilterDropdown.selectedItem = this.SelectFilterDropdown.defaultOption;
    }
    /*
    *On Change of Diary Select Drop Down
    */
    public SelectFilterChange(obj: any): void {
        if (this.isReturningStatus && obj === 'NONE') {
            this.SelectFilterDropdown.selectedItem = this.pageParams.diaryFilterSelected;
            this.uiForm.controls['SelectFilter'].setValue(this.pageParams.diaryFilterSelected);
        } else {
            this.uiForm.controls['SelectFilter'].setValue(obj);
            this.pageParams.diaryFilterSelected = obj;
            this.SelectFilterDropdown.selectedItem = this.pageParams.diaryFilterSelected;
            switch (obj) {
                case 'WITHAPPT':
                    this.pageParams.fieldHidden.tdDiaryDate = true;
                    break;
                case 'WITHAPPTON':
                    this.pageParams.fieldHidden.tdDiaryDate = false;
                    break;
                case 'NOAPPT':
                    this.pageParams.fieldHidden.tdDiaryDate = true;
                    break;
                default:
                    this.pageParams.fieldHidden.tdDiaryDate = true;
                    break;
            }
        }
        //this.uiForm.controls['SelectFilter'].setValue(obj);
        /*switch (obj) {
            case 'WITHAPPT':
                this.pageParams.fieldHidden.tdDiaryDate = true;
                break;
            case 'WITHAPPTON':
                this.pageParams.fieldHidden.tdDiaryDate = false;
                break;
            case 'NOAPPT':
                this.pageParams.fieldHidden.tdDiaryDate = true;
                break;
            default:
                this.pageParams.fieldHidden.tdDiaryDate = true;
                break;
        }*/
        //this.loadPipeLineGrid(this.inputParams);
    }
    /*
    *Load/Populate Menu Select Drop Down
    */
    public loadListMenu(): void {
        this.pageParams.MenuOptionListMenu.push({ value: 'None', text: 'Options' });
        this.pageParams.MenuOptionListMenu.push({ value: 'Contacts', text: 'Contacts' });
        this.pageParams.MenuOptionListMenu.push({ value: 'ApprovalGrid', text: 'Contract Approval' });
        this.pageParams.MenuOptionListMenu.push({ value: 'Diary', text: 'Diary' });
        this.pageParams.MenuOptionListMenu.push({ value: 'DiaryDay', text: 'Diary Day' });
        this.pageParams.MenuOptionListMenu.push({ value: 'Prospect', text: 'Prospect' });
        this.pageParams.MenuOptionListMenu.push({ value: 'NewProspect', text: 'Prospect (New)' });
        this.pageParams.MenuOptionListMenu.push({ value: 'WorkOrders', text: 'Work Orders' });
        this.pageParams.MenuOptionListMenu.splice(0, 1);
        this.menuSelectDropdown.defaultOption = { value: 'None', text: 'Options' };
        this.pageParams.MenuOptionListMenuselected = this.menuSelectDropdown.defaultOption;
    }
    /*
    *On Change of Menu Select Drop Down
    */
    public menuSelectChange(obj: any): void {
        this.uiForm.controls['menu'].setValue(obj);
        this.pageParams.MenuOptionListMenuselected = obj;
        switch (obj) {
            case 'Diary':
                this.setControlValue('DiaryProspectNumber', this.getControlValue('PassProspectNumber'));
                alert('Cannot navigate as iCABSCMDiaryMaintenance.htm page is not ready!!');
                /*Child page not ready need to change navigation later*/
                //this.navigate('PipelineGrid', 'ContactManagement/iCABSCMDiaryMaintenance.htm');
                break;
            case 'DiaryDay':
                if (this.getControlValue('SelectFilter') !== 'WITHAPPTON') {
                    this.setControlValue('DiaryDate', this.utils.TodayAsDDMMYYYY());
                    this.dtDiaryDate = this.utils.convertDate(this.utils.TodayAsDDMMYYYY());
                    this.pageParams.DiaryDate = this.dtDiaryDate;
                }
                this.setControlValue('DiaryProspectNumber', this.getControlValue('PassProspectNumber'));
                alert('Cannot navigate as iCABSCMDiaryMaintenance.htm page is not ready!!');
                /*Child page not ready need to change navigation later*/
                //this.navigate('PipelineGrid', 'ContactManagement/iCABSCMDiaryDayMaintenance.htm');
                break;
            case 'WorkOrders':
                alert('Cannot navigate as iCABSCMWorkOrderGrid.htm page is not ready!!');
                /*Child page not ready need to change navigation later*/
                //this.navigate('PipelineGrid', 'ContactManagement/iCABSCMWorkOrderGrid.htm');
                break;
            case 'Contacts':
                alert('Cannot navigate as iCABSCMCustomerContactMaintenance.htm page is not ready!!');
                /*Child page not ready need to change navigation later*/
                //this.navigate('SalesOrderCMSearch', 'ContactManagement/iCABSCMCustomerContactMaintenance.htm');
                //this.loadPipeLineGrid(this.inputParams);
                break;
            case 'Prospect':
                this.runProspectMaintenance();
                break;
            case 'NewProspect':
                //this.navigate('PipelineGridNew', '/prospecttocontract/maintenance/prospect');
                this.navigate('PipelineGridNew', '/prospecttocontract/maintenance/prospect', {
                    'ContactRowID': this.getControlValue('PassContactROWID'),
                    'ProspectNumber': this.getControlValue('PassProspectNumber')
                });
                break;
            case 'ApprovalGrid':
                this.navigate('ApprovalGrid', '/grid/sales/contractapprovalgrid');
                break;
            default:
                break;
        }
        this.menuSelectDropdown.selectedItem = this.pageParams.MenuOptionListMenuselected;
    }
    /*
    *Load/Populate Show Select Drop Down
    */
    public loadListInclusionType(): void {
        this.pageParams.MenuOptionListInclusionType = [];
        this.pageParams.MenuOptionListInclusionType.push({ value: 'OpenOnly', text: 'Open Prospects' });
        this.pageParams.MenuOptionListInclusionType.push({ value: 'OpenOnlyWithDateRange', text: 'Open Prospects In Date Range' });
        this.pageParams.MenuOptionListInclusionType.push({ value: 'OpenAndClosed', text: 'Open And Closed Prospects' });
        this.pageParams.MenuOptionListInclusionType.push({ value: 'ClosedOnly', text: 'Closed Prospects' });
        this.pageParams.MenuOptionListInclusionType.splice(0, 1);
        this.InclusionTypeSelectDropdown.defaultOption = { value: 'OpenOnly', text: 'Open Prospects' };
        this.pageParams.InclusionTypeSelectedItem = this.InclusionTypeSelectDropdown.defaultOption;
    }
    /*
    *On Change of show Select Drop Down
    */
    public InclusionTypeSelectChange(obj: any): void {
        if (this.isReturningStatus && obj === 'OpenOnly') {
            this.uiForm.controls['InclusionTypeSelect'].setValue(this.pageParams.MenuOptionSelected);
            this.InclusionTypeSelectDropdown.selectedItem = this.pageParams.MenuOptionSelected;
        } else {
            this.uiForm.controls['InclusionTypeSelect'].setValue(obj);
            switch (obj) {
                case 'OpenOnly':
                    this.pageParams.fieldHidden.fromToDate = true;
                    this.pageParams.MenuOptionSelected = 'OpenOnly';
                    break;
                case 'OpenOnlyWithDateRange':
                    this.pageParams.fieldHidden.fromToDate = false;
                    this.pageParams.MenuOptionSelected = 'OpenOnlyWithDateRange';
                    break;
                case 'OpenAndClosed':
                    this.pageParams.fieldHidden.fromToDate = false;
                    this.pageParams.MenuOptionSelected = 'OpenAndClosed';
                    break;
                case 'ClosedOnly':
                    this.pageParams.fieldHidden.fromToDate = false;
                    this.pageParams.MenuOptionSelected = 'ClosedOnly';
                    break;
                default:
                    this.pageParams.fieldHidden.fromToDate = true;
                    break;
            }
        }
        //this.uiForm.controls['InclusionTypeSelect'].setValue(obj);
        /*switch (obj) {
            case 'OpenOnly':
                this.pageParams.fieldHidden.fromToDate = true;
                this.pageParams.MenuOptionSelected = 'OpenOnly';
                break;
            case 'OpenOnlyWithDateRange':
                this.pageParams.fieldHidden.fromToDate = false;
                this.pageParams.MenuOptionSelected = 'OpenOnlyWithDateRange';
                break;
            case 'OpenAndClosed':
                this.pageParams.fieldHidden.fromToDate = false;
                this.pageParams.MenuOptionSelected = 'OpenAndClosed';
                break;
            case 'ClosedOnly':
                this.pageParams.fieldHidden.fromToDate = false;
                this.pageParams.MenuOptionSelected = 'ClosedOnly';
                break;
            default:
                this.pageParams.fieldHidden.fromToDate = true;
                break;
        }*/
        //this.loadPipeLineGrid(this.inputParams);
        this.pageParams.InclusionTypeSelectedItem = this.InclusionTypeSelectDropdown.selectedItem;
    }
    /*
    *Populate Form With Selected Employee Data
    */
    public loadUserForm(): void {
        let formdata: Object = {};
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        formdata['USERCODE'] = this.pageParams['gUserCode'].toLowerCase();
        formdata['GridUserCode'] = this.pageParams['gUserCode'].toUpperCase();
        formdata['Function'] = 'GetEmployeeFromUserCode';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.search, formdata)
            .subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    if (e.errorMessage && e.errorMessage !== '') {
                        setTimeout(() => {
                            this.errorService.emitError(e);
                        }, 200);
                    } else {
                        this.setControlValue('EmployeeCode', e.EmployeeCode);
                        this.setControlValue('EmployeeSurname', e.EmployeeSurname);
                        this.setControlValue('OwnSubmissionsInd', e.OwnSubmissionsInd);
                        if (e.OwnSubmissionsInd && e.OwnSubmissionsInd.toLowerCase() === 'yes') {
                            this.disableControl('EmployeeCode', true);
                            this.ellipsisConfig.employee.disabled = true;
                        }
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                //this.loadPipeLineGrid(this.inputParams);
            },
            (error) => {
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );

    }
    /*
    * On Contact Centre Row Button Click
    */
    public cmdSelectReviewOnClick(): void {
        this.navigate('PipelineProspectGrid', '/ccm/centreReview');
    }
    /*
    * On Call of runProspectMaintenance Function
    */
    public runProspectMaintenance(): void {
        this.checkOldAppointmentExists();
        if (!this.lOldApptExists) {
            this.navigate('SalesOrder', '/prospecttocontract/maintenance/prospect', {
                'ContactRowID': this.getControlValue('PassContactROWID'),
                'ProspectNumber': this.getControlValue('PassProspectNumber')
            });
            //this.loadPipeLineGrid(this.inputParams);
        }

    }
    /*
    * Check if Old Appointment Exist
    */
    public checkOldAppointmentExists(): void {
        this.lOldApptExists = false;
        this.lClosingAppt = false;
        if (this.getControlValue('WarnOldOpenAppt') !== '0') {
            this.lOldApptExists = true;
            this.promptAppointmentContent = MessageConstant.Message.OldAppointmentExistsQues;
            this.promptAppointmentTitle = MessageConstant.Message.OldAppointmentExistsTitle;
            this.promptAppointmentModal.show();
        }
    }
    /*
    * Open Modal Confirm and Excute As Per Selection
    */
    public promptConfirm(type: any): void {
        switch (type) {
            case 'close':
                this.lClosingAppt = true;
                this.setControlValue('PassWONumber', this.uiForm.controls['WarnOldOpenAppt'].value);
                //alert('Cannot navigate as iCABSCMWorkOrderMaintenance.htm page is not ready!!');
                this.navigate('PipelineGrid', InternalMaintenanceServiceModuleRoutes.ICABSCMWORKORDERMAINTENANCE, {
                    PassWONumber: this.getControlValue('PassWONumber')
                });
                break;
            case 'diary':
                this.menuSelectChange('Diary');
                break;
            default:
                break;
        }
    }
    /*
    *On FromDate Picker Change Update Value on Hidden Date Field
    *And Refresh Grid For New FromDate Value
    */
    public FromDateSelectedValue(value: any): any {
        if (value) {
            this.pageParams.FromDate = value.value;
            this.uiForm.controls['FromDate'].setValue(value.value);
            //this.loadPipeLineGrid(this.inputParams);
        }
    };
    /*
    *On FromDate Picker Change Update Value on Hidden Date Field
    *And Refresh Grid For New FromDate Value
    */
    public ToDateSelectedValue(value: any): any {
        if (value) {
            this.pageParams.ToDate = value.value;
            this.uiForm.controls['ToDate'].setValue(value.value);
            //this.loadPipeLineGrid(this.inputParams);
        }
    };
    /*
    *On FromDate Picker Change Update Value on Hidden Date Field
    *And Refresh Grid For New FromDate Value
    */
    public DiaryDateSelectedValue(value: any): any {
        if (value) {
            this.pageParams.DiaryDate = value.value;
            this.uiForm.controls['DiaryDate'].setValue(value.value);
            //this.dtDiaryDate = this.utils.convertDate(value.value);
            //this.loadPipeLineGrid(this.inputParams);
        }
    };
    /*
     *Get Selection Employee Number From Ellipsis
    */
    public onEllipsisDataReceived(data: any, handle: any): void {
        this.setControlValue('EmployeeCode', data.EmployeeCode);
        this.setControlValue('EmployeeSurname', data.EmployeeSurname);
        //this.loadPipeLineGrid(this.inputParams);
    };

    /**
     * Get Employee Surname
     */
    public getEmployeeName(): any {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.inputParams.ActionUpdate);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        //set parameters
        this.inputParams.Function = 'GetEmployeeName';
        this.inputParams.EmployeeCode = this.getControlValue('EmployeeCode') ? this.getControlValue('EmployeeCode') : '';

        if (this.inputParams.EmployeeCode) {
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module,
                this.inputParams.operation, query, this.inputParams)
                .subscribe(
                (data) => {
                    if (data.status === 'failure') {
                        this.errorService.emitError(data.info['error']);
                        this.setControlValue('EmployeeSurname', '');
                    } else {
                        if ((typeof data !== 'undefined' && data['errorMessage'])) {
                            this.showErrorModal(data.errorMessage);
                            this.setControlValue('EmployeeSurname', '');
                        } else {
                            this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                            //this.loadPipeLineGrid(this.inputParams);
                            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode', false);
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.errorService.emitError(error);
                    this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode', true);
                    this.setControlValue('EmployeeSurname', '');
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        } else {
            this.setControlValue('EmployeeSurname', '');
        }
    }
    /**
     * Show Error Modal Popup
     */
    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data, title: 'Error' }, false);
    }
    /*
  *
  *Build Grid Structure
  */
    public buildGrid(): void {
        this.riGrid.Clear();

        this.riGrid.AddColumn('ProspectNumber', 'Prospect', 'ProspectNumber', MntConst.eTypeCodeNumeric, 4);
        this.riGrid.AddColumn('ContractNumber', 'Prospect', 'ContractNumber', MntConst.eTypeTextFree, 10);
        this.riGrid.AddColumn('ProspectName', 'Prospect', 'ProspectName', MntConst.eTypeTextFree, 20);
        this.riGrid.AddColumn('ProspectPostcode', 'Prospect', 'ProspectPostcode', MntConst.eTypeTextFree, 15);
        this.riGrid.AddColumn('ProspectDaysOld', 'Prospect', 'ProspectDaysOld', MntConst.eTypeInteger, 3);
        this.riGrid.AddColumn('ProspectClosedDate', 'Prospect', 'ProspectClosedDate', MntConst.eTypeDate, 8);
        this.riGrid.AddColumn('ProspectEstimated', 'Prospect', 'ProspectEstimated', MntConst.eTypeCurrency, 10);
        this.riGrid.AddColumn('ProspectActual', 'Prospect', 'ProspectActual', MntConst.eTypeCurrency, 10);
        this.riGrid.AddColumn('Probability', 'Prospect', 'Probability', MntConst.eTypeDecimal2, 3);
        this.riGrid.AddColumn('PipelineValue', 'Prospect', 'PipelineValue', MntConst.eTypeCurrency, 10);
        this.riGrid.AddColumn('Quotes', 'Prospect', 'Quotes', MntConst.eTypeInteger, 3);
        this.riGrid.AddColumn('C1', 'Prospect', 'C1', MntConst.eTypeInteger, 2);
        this.riGrid.AddColumn('C2', 'Prospect', 'C2', MntConst.eTypeInteger, 2);
        this.riGrid.AddColumn('C3', 'Prospect', 'C3', MntConst.eTypeInteger, 2);
        this.riGrid.AddColumn('C4', 'Prospect', 'C4', MntConst.eTypeInteger, 2);
        this.riGrid.AddColumn('C5', 'Prospect', 'C5', MntConst.eTypeInteger, 2);
        this.riGrid.AddColumn('C6', 'Prospect', 'C6', MntConst.eTypeInteger, 2);
        this.riGrid.AddColumn('C7', 'Prospect', 'C7', MntConst.eTypeInteger, 2);
        this.riGrid.AddColumn('ProspectStatus', 'Prospect', 'ProspectStatus', MntConst.eTypeTextFree, 12);
        this.riGrid.AddColumn('WOStatus', 'Prospect', 'WOStatus', MntConst.eTypeTextFree, 12);

        this.riGrid.AddColumnAlign('ProspectNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ProspectStatus', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ProspectClosedDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('Probability', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('Quotes', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('WOStatus', MntConst.eAlignmentCenter);

        this.riGrid.AddColumnUpdateSupport('Probability', true);
        this.riGrid.AddColumnUpdateSupport('ProspectClosedDate', true);

        this.riGrid.AddColumnOrderable('ProspectNumber', true);
        this.riGrid.AddColumnOrderable('ProspectStatus', true);
        this.riGrid.AddColumnOrderable('ProspectName', true);
        this.riGrid.AddColumnOrderable('ContractNumber', true);
        this.riGrid.AddColumnOrderable('ProspectPostcode', true);
        this.riGrid.AddColumnOrderable('ProspectDaysOld', true);
        this.riGrid.AddColumnOrderable('ProspectClosedDate', true);
        this.riGrid.AddColumnOrderable('ProspectEstimated', true);
        this.riGrid.AddColumnOrderable('ProspectActual', true);
        this.riGrid.AddColumnOrderable('PipelineValue', true);
        this.riGrid.AddColumnOrderable('WOStatus', true);

        this.riGrid.Complete();
    }
    /*
  *Populate Grid Based On Selected Employee and
  *Drop Down Filters, Make API Call
  */
    private riGrid_BeforeExecute(): void {
        /*Blank Out Prospect Details - Just In Case No Records Exist Within The Grid
         Without This - These Details Would Remain From The Last Prospect*/
        this.setControlValue('PassProspectNumber', '');
        this.setControlValue('PassProspectName', '');
        this.setControlValue('ProspectContactName', '');
        this.setControlValue('ProspectContactPhone', '');
        this.setControlValue('ProspectContactMobile', '');
        this.setControlValue('ProspectSourceDesc', '');
        this.setControlValue('ProspectAppointmentDetails', '');
        this.setControlValue('ProspectTypeDesc', '');
        this.setControlValue('ProspectNotes', '');

        //Set API Parameter for Grid Load Call
        let gridParams: URLSearchParams = new URLSearchParams();
        gridParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        gridParams.set('EmployeeCode', this.uiForm.controls['EmployeeCode'].value);
        gridParams.set('Status', this.uiForm.controls['StatusSelect'].value);
        gridParams.set('OriginCode', this.uiForm.controls['OriginSelect'].value);
        gridParams.set('LanguageCode', this.riExchange.LanguageCode());
        gridParams.set('InclusionType', this.uiForm.controls['InclusionTypeSelect'].value);
        gridParams.set('SOPReportQuoteStatus', '');
        gridParams.set('SOPReportBranch', '');
        gridParams.set('SOPReportRegion', '');
        gridParams.set('RunFrom', this.uiForm.controls['RunFrom'].value);
        gridParams.set('DiaryDate', this.pageParams.DiaryDate);
        gridParams.set('Filter', this.uiForm.controls['SelectFilter'].value);
        gridParams.set('MarketSegment', this.uiForm.controls['SelectMarketFilter'].value);
        gridParams.set('FromDate', this.pageParams.FromDate);
        gridParams.set('ToDate', this.pageParams.ToDate);
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.GridHandle, this.utils.gridHandle);
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        gridParams.set('riSortOrder', sortOrder);
        gridParams.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, gridParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    return;
                }
                this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                this.riGrid.RefreshRequired();

                this.riGrid.Execute(data);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }
    /*
    *On Pagination Refresh Button click
    */
    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }
    /*
    *Sort Grid Column On Click
    */
    public riGrid_Sort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }
    /*
    *Provide Data for Pagination
    */
    public getCurrentPage(event: any): void {
        this.pageCurrent = event.value;
        //this.riGrid.Update = true;
        // this.riGrid.UpdateHeader = true;
        // this.riGrid.UpdateRow = true;
        // this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    }
    /*
    *load Grid on Pagination Change
    */
    public updateView(): void {
        //this.loadPipeLineGrid(this.inputParams);
    }
    /*
    * On Double Clicking Grid Row Functionality
    */
    public riGrid_BodyOnDblClick(eventObj: any): void {
        this.riGrid.Update = false;
        this.Detail();
    }
    /*
    *Process Grid Double Click Functionality
    */
    public Detail(): void {
        let strContractTypeCode: any;
        if (this.riGrid.Details.GetAttribute('ContractNumber', 'AdditionalProperty') !== 'DIARYDATE') {
            this.setControlValue('PassProspectNumber', this.riGrid.Details.GetValue('ProspectNumber'));
            this.setControlValue('PassProspectName', this.riGrid.Details.GetValue('ProspectName'));
            this.setControlValue('PassProspectROWID', this.riGrid.Details.GetAttribute('ProspectNumber', 'RowID'));
        }
        switch (this.riGrid.CurrentColumnName) {
            case 'ProspectNumber':
                this.runProspectMaintenance();
                break;
            case 'ContractNumber':
                if (this.riGrid.Details.GetAttribute('ContractNumber', 'AdditionalProperty') === 'DIARYDATE') {
                    this.navigate('PipelineGrid', AppModuleRoutes.PROSPECTTOCONTRACT + ProspectToContractModuleRoutes.ICABSCMDIARYDAYMAINTENANCE);
                } else {
                    switch (this.riGrid.Details.GetAttribute('ContractNumber', 'AdditionalProperty')) {
                        case 'C':
                            strContractTypeCode = 'contract';
                            break;
                        case 'J':
                            strContractTypeCode = 'job';
                            break;
                        case 'P':
                            strContractTypeCode = 'product';
                            break;
                        default:
                            break;
                    }
                    this.navigate('PipelineGrid', '/contractmanagement/maintenance/' + strContractTypeCode, {
                        'ContractNumber': this.riGrid.Details.GetValue('ContractNumber')
                    });
                }
                break;
            case 'Quotes':
                if (this.uiForm.controls['ForceApptEntry'].value === 'Y') {
                    this.promptDiaryAppointmentContent = MessageConstant.Message.DiaryAppointmentRequiredQues;
                    this.promptDiaryAppointmentTitle = MessageConstant.Message.DiaryAppointmentRequiredTitle;
                    this.promptDiaryAppointmentModal.show();
                } else {
                    this.checkOldAppointmentExists();
                    if (!this.lClosingAppt) {
                        this.pageParams.childPage = 'PipelineQuoteGrid';
                        this.navigate('', InternalGridSearchSalesModuleRoutes.ICABSSPIPELINEQUOTEGRID);
                        //this.loadPipeLineGrid(this.inputParams);
                    }
                }
                break;
            case 'ProspectStatus':
                this.checkOldAppointmentExists();
                if (!this.lOldApptExists) {
                    alert('Cannot navigate as iCABSSProspectStatusChange.htm page is not ready!!');
                    /*Child page not ready need to change navigation later*/
                    //this.navigate('PipelineGrid', 'Sales/iCABSSProspectStatusChange.htm');
                    //this.loadPipeLineGrid(this.inputParams);
                }
                break;
            default:
                break;
        }
    }
    /*
    * On Selection of Grid Row Populate
    * Selected Form With Selected Row Data
    */
    public riGrid_BodyOnClick(eventObj: any): void {
        this.SelectedRowFocus(eventObj.srcElement);
    }
    /*
    * Populate Selected Form With Selected Row Data
    */
    public SelectedRowFocus(rsrcElement: any): void {
        let ProspectDetails: Array<any> = [{}];
        this.setControlValue('RowType', this.riGrid.Details.GetAttribute('ContractNumber', 'AdditionalProperty'));
        //let RowTypevalue = eventObj.trRowData[1].additionalData;
        if (this.riGrid.Details.GetAttribute('ContractNumber', 'AdditionalProperty') === 'DIARYDATE') {
            this.setControlValue('DiaryDate', this.riGrid.Details.GetValue('ContractNumber')); // eventObj.trRowData[1].text);
            this.dtDiaryDate = this.utils.convertDate(this.riGrid.Details.GetValue('ContractNumber'));
            this.pageParams.DiaryDate = this.dtDiaryDate;
            this.setControlValue('PassProspectName', '');
        } else {
            this.setControlValue('PassProspectNumber', this.riGrid.Details.GetValue('ProspectNumber'));
            this.setControlValue('PassProspectName', this.riGrid.Details.GetValue('ProspectName'));
            this.setControlValue('PassProspectROWID', this.riGrid.Details.GetAttribute('ProspectNumber', 'RowID'));
            this.setControlValue('PassContractROWID', this.riGrid.Details.GetAttribute('ContractNumber', 'RowID'));
            this.setControlValue('PassContactROWID', this.riGrid.Details.GetAttribute('C1', 'AdditionalProperty'));
            this.setControlValue('ProspectType', this.riGrid.Details.GetAttribute('ProspectName', 'AdditionalProperty'));
            this.setControlValue('ProspectTypeDesc', this.riGrid.Details.GetAttribute('ProspectPostcode', 'AdditionalProperty'));
            this.setControlValue('PipelineGridProspectNumber', this.riGrid.Details.GetValue('ProspectNumber'));
            this.setControlValue('ForceApptEntry', this.riGrid.Details.GetAttribute('ProspectClosedDate', 'AdditionalProperty'));
            this.setControlValue('WarnOldOpenAppt', this.riGrid.Details.GetAttribute('ProspectDaysOld', 'AdditionalProperty'));
            this.setControlValue('ProspectNotes', this.riGrid.Details.GetAttribute('ProspectEstimated', 'AdditionalProperty'));
            ProspectDetails = this.riGrid.Details.GetAttribute('ProspectActual', 'AdditionalProperty').split('|');
            this.setControlValue('ProspectContactName', ProspectDetails[0]);
            this.setControlValue('ProspectContactPhone', ProspectDetails[1]);
            this.setControlValue('ProspectContactMobile', ProspectDetails[2]);
            this.setControlValue('ProspectSourceDesc', ProspectDetails[3]);
            this.setControlValue('ProspectAppointmentDetails', ProspectDetails[4]);
        }
    }
    /*
    * After Grid Processed Populate Grid
    */
    public riGrid_AfterExecute(): void {
        if (this.riGrid.HTMLGridBody) {
            if (this.riGrid.HTMLGridBody.children[0]) {
                if (this.riGrid.HTMLGridBody.children[0].children[0]) {
                    if (this.riGrid.HTMLGridBody.children[0].children[0].children[0]) {
                        if (this.riGrid.HTMLGridBody.children[0].children[0].children[0].children[0]) {
                            if (this.riGrid.HTMLGridBody.rows.length > 1) {
                                this.SelectedRowFocus(this.riGrid.HTMLGridBody.children[0].children[0].children[0].children[0]);
                            }
                        }
                    }
                }
            }
        }
    }
    /*
    * On Grid B'ody Keydown Functioanlity'
    */
    public riGrid_BodyOnKeyDown(event: any): void {
        switch (event.keyCode) {
            case 13:
                this.Detail();
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
    /*
    * Grid Update Probability Field On Blur Event
    */
    public riGrid_OnBlur(): void {
        this.riGrid.Mode = MntConst.eModeUpdate;
        let formdata: Object = {};
        let gridParams: URLSearchParams = new URLSearchParams();

        gridParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        gridParams.set('ProspectNumberRowID', this.riGrid.Details.GetAttribute('ProspectNumber', 'RowID'));
        gridParams.set('ProspectNumber', this.riGrid.Details.GetValue('ProspectNumber'));
        gridParams.set('ContractNumber', this.riGrid.Details.GetValue('ContractNumber'));
        gridParams.set('ProspectName', this.riGrid.Details.GetValue('ProspectName'));
        gridParams.set('ProspectPostcode', this.riGrid.Details.GetValue('ProspectPostcode'));
        gridParams.set('ProspectDaysOld', this.riGrid.Details.GetValue('ProspectDaysOld'));
        gridParams.set('ProspectClosedDate', this.globalize.parseDateToFixedFormat(this.riGrid.Details.GetValue('ProspectClosedDate')) as string);
        gridParams.set('ProspectEstimated', this.riGrid.Details.GetValue('ProspectEstimated'));
        gridParams.set('ProspectActual', this.riGrid.Details.GetValue('ProspectActual'));
        gridParams.set('ProbabilityRowID', this.riGrid.Details.GetAttribute('Probability', 'rowid'));
        gridParams.set('Probability', this.riGrid.Details.GetValue('Probability'));
        gridParams.set('PipelineValue', this.riGrid.Details.GetValue('PipelineValue'));
        gridParams.set('QuotesRowID', this.riGrid.Details.GetAttribute('QuotesRowID', 'rowid'));
        gridParams.set('Quotes', this.riGrid.Details.GetValue('Quotes'));
        gridParams.set('C1', this.riGrid.Details.GetValue('C1'));
        gridParams.set('C2', this.riGrid.Details.GetValue('C2'));
        gridParams.set('C3', this.riGrid.Details.GetValue('C3'));
        gridParams.set('C4', this.riGrid.Details.GetValue('C4'));
        gridParams.set('C5', this.riGrid.Details.GetValue('C5'));
        gridParams.set('C6', this.riGrid.Details.GetValue('C6'));
        gridParams.set('C7', this.riGrid.Details.GetValue('C7'));
        gridParams.set('ProspectStatusRowID', this.riGrid.Details.GetAttribute('ProspectStatusRowID', 'rowid'));
        gridParams.set('ProspectStatus', this.riGrid.Details.GetValue('ProspectStatus'));
        gridParams.set('WOStatus', this.riGrid.Details.GetValue('WOStatus'));
        gridParams.set('EmployeeCode', this.uiForm.controls['EmployeeCode'].value);
        gridParams.set('Status', this.uiForm.controls['StatusSelect'].value);
        gridParams.set('OriginCode', this.uiForm.controls['OriginSelect'].value);
        gridParams.set('LanguageCode', 'ZNG');
        gridParams.set('InclusionType', this.uiForm.controls['InclusionTypeSelect'].value);
        gridParams.set('SOPReportQuoteStatus', this.getControlValue('SOPReportQuoteStatus'));
        gridParams.set('SOPReportBranch', this.getControlValue('SOPReportBranch'));
        gridParams.set('SOPReportRegion', this.getControlValue('SOPReportRegion'));
        gridParams.set('RunFrom', this.uiForm.controls['RunFrom'].value);
        gridParams.set('DiaryDate', this.pageParams.DiaryDate);
        gridParams.set('Filter', this.uiForm.controls['SelectFilter'].value);
        gridParams.set('MarketSegment', this.uiForm.controls['SelectMarketFilter'].value);
        gridParams.set('FromDate', this.pageParams.FromDate);
        gridParams.set('ToDate', this.pageParams.ToDate);
        gridParams.set('riGridMode', '3');
        gridParams.set('riGridHandle', this.utils.gridHandle);
        gridParams.set('HeaderClickedColumn', '');
        gridParams.set('riSortOrder', 'Ascending');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, gridParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    return;
                }

                this.riGrid.Mode = MntConst.eModeNormal;
                if (this.riGrid.Update) {
                    this.riGrid.StartRow = this.riGrid.CurrentRow;
                    this.riGrid.StartColumn = 0;
                    this.riGrid.RowID = this.getControlValue('PassProspectROWID');
                    this.riGrid.UpdateHeader = false;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateFooter = false;
                }
                this.riGrid.Execute(data);
                // this.riGrid_BeforeExecute();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    /**
     * On Destroy of HTML
     */
    private onUnLoad_PipelineQuoteGrid(): void {
        // Check for any open workorders to nudge the user to close these off
        if (this.getControlValue('WarnOpenWOrders')) {
            this.checkForOpenWO('Exit');
        }
    }

    /**
     * Checks for Open Work Orders
     */
    private checkForOpenWO(RunningFrom: string): void {
        let headerParams: any = {
            method: 'prospect-to-contract/maintenance',
            module: 'advantage',
            operation: 'Sales/iCABSSPipelineQuoteGrid'
        };

        this.lClosingWO = false;
        this.iOpenWONumber = 0;

        let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.Action, '6');
        queryParams.set(this.serviceConstants.Function, 'CheckForOpenWO');
        queryParams.set('ProspectNumber', this.getControlValue('PassProspectNumber'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(headerParams.method, headerParams.module, headerParams.operation, queryParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    this.iOpenWONumber = Number(data.OpenWONumber);
                    this.iNumQuotes = Number(data.NumQuotes);
                    this.iNumOpenQuotes = Number(data.NumOpenQuotes);

                    this.setControlValue('PassWONumber', this.iOpenWONumber.toString());

                    if (this.iOpenWONumber !== 0) {
                        this.showDialog();
                    }
                    if (this.iNumQuotes === 0) {
                        this.setControlValue('QuotePassAction', 'NoQuotes');
                    }
                    if (this.getControlValue('QuotePassAction') === 'UnSet' && this.iNumQuotes > 0) {
                        this.setControlValue('QuotePassAction', 'New');
                    }

                    this.setControlValue('PassWONumber', '0');
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public showDialog(): void {
        this.lClosingWO = true;
        this.setControlValue('QuotePassWONumber', this.getControlValue('PassWONumber'));
        this.promptTitle = 'Open WorkOrder Exists';
        this.promptContent = MessageConstant.Message.AnopenWorkOrderexists;
        this.promptModal.show();
    }

    private riExchange_UpdateHTMLDocument(): void {
        // QuoteGrid Passes Down A WONumber - there is an open WorkOrder and the user has decided to close the WorkOrder
        if (this.getControlValue('QuotePassWONumber') !== '0' && this.getControlValue('QuotePassWONumber') !== '') {
            this.setControlValue('PassWONumber', this.getControlValue('QuotePassWONumber'));
            let pMode: string;
            if (this.getControlValue('QuotePassAction') === 'Submit') {
                pMode = 'PipelineQuoteGridSubmit';
            }
            else if (this.getControlValue('QuotePassAction') === 'NoQuotes') {
                pMode = 'PipelineQuoteGridNoQuotes';
            }
            else {
                pMode = 'PipelineQuoteGrid';
            }
            this.navigate(pMode, InternalMaintenanceServiceModuleRoutes.ICABSCMWORKORDERMAINTENANCE, {
                PassWONumber: this.getControlValue('PassWONumber')
            });
        }
        else {
            this.riGrid.Update = false;
            this.riGrid_BeforeExecute();
        }
        this.setControlValue('QuotePassWONumber', '0');
    }

}
