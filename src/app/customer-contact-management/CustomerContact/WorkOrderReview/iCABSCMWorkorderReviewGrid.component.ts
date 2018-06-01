import * as moment from 'moment';
import { Component, OnInit, OnDestroy, Injector, ViewChild, Input, EventEmitter, HostListener } from '@angular/core';
import { QueryParametersCallback } from './../../../base/Callback';
import { BaseComponent } from './../../../base/BaseComponent';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { RiMaintenance, MntConst, RiTab } from './../../../../shared/services/riMaintenancehelper';
import { Subscription } from 'rxjs/Subscription';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';
import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';
import { GridAdvancedComponent } from './../../../../shared/components/grid-advanced/grid-advanced';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';

// Import child component
import { ScreenNotReadyComponent } from './../../../../shared/components/screenNotReady';
import { AccountSearchComponent } from './../../../internal/search/iCABSASAccountSearch';
import { ContractSearchComponent } from './../../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from './../../../internal/search/iCABSAPremiseSearch';
import { EmployeeSearchComponent } from './../../../internal/search/iCABSBEmployeeSearch';
import { ServiceCoverSearchComponent } from './../../../internal/search/iCABSAServiceCoverSearch';
import { BranchServiceAreaSearchComponent } from './../../../internal/search/iCABSBBranchServiceAreaSearch';
import { InternalMaintenanceServiceModuleRoutes } from '../../../base/PageRoutes';


@Component({
    templateUrl: 'iCABSCMWorkorderReviewGrid.html'
})

export class WorkorderReviewGridComponent extends BaseComponent implements OnInit, OnDestroy, QueryParametersCallback {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riGridPagination') riGridPagination: PaginationComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptModal') public promptModal;

    @ViewChild('accountNumberEllipsis') accountNumberEllipsis: EllipsisComponent;
    @ViewChild('contractNumberEllipsis') contractNumberEllipsis: EllipsisComponent;
    @ViewChild('premisesNumberEllipsis') premisesNumberEllipsis: EllipsisComponent;
    @ViewChild('productcodeEllipsis') productcodeEllipsis: EllipsisComponent;
    @ViewChild('employeeSearchEllipsis') employeeSearchEllipsis: EllipsisComponent;

    public pageId: string = '';
    public controls = [
        { name: 'MyContactType', type: MntConst.eTypeText },
        { name: 'WOTypeSelect', type: MntConst.eTypeText },
        { name: 'MyFilter', type: MntConst.eTypeText },
        { name: 'MyFilterLevel', type: MntConst.eTypeText },
        { name: 'MyFilterValue', type: MntConst.eTypeText },
        { name: 'MyFilterEmployeeCode', type: MntConst.eTypeText },
        { name: 'TeamID', type: MntConst.eTypeTextFree },
        { name: 'CallLogID', type: MntConst.eTypeInteger },
        { name: 'CustomerContactNumber', type: MntConst.eTypeInteger },
        { name: 'AccountNumber', type: MntConst.eTypeText },
        { name: 'AccountName', type: MntConst.eTypeText },
        { name: 'SearchContactName', type: MntConst.eTypeText },
        { name: 'ContractNumber', type: MntConst.eTypeCode },
        { name: 'ContractName', type: MntConst.eTypeText },
        { name: 'PostCode', type: MntConst.eTypeText },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger },
        { name: 'PremiseName', type: MntConst.eTypeText },
        { name: 'ProspectNumber', type: MntConst.eTypeCode },
        { name: 'ProductCode', type: MntConst.eTypeCode },
        { name: 'ProductDesc', type: MntConst.eTypeText },
        { name: 'ReassignSelect', type: MntConst.eTypeText },
        { name: 'EmployeeCode', type: MntConst.eTypeCode },
        { name: 'DateFilter', type: MntConst.eTypeText },
        { name: 'DateFrom', type: MntConst.eTypeDate },
        { name: 'DateTo', type: MntConst.eTypeDate },
        // hidden fields
        { name: 'Row' },
        { name: 'BranchNumber', type: MntConst.eTypeInteger },
        { name: 'BranchServiceAreaCode', type: MntConst.eTypeInteger },
        { name: 'RelatedWONumber', type: MntConst.eTypeCode },
        { name: 'CallOutRowID', type: MntConst.eTypeInteger },
        { name: 'ServiceCoverNumber', type: MntConst.eTypeInteger },
        { name: 'ServiceCoverRowID', type: MntConst.eTypeText },
        { name: 'SelectedCallLogID', type: MntConst.eTypeText }
    ];

    /* ========================Message Modal Popup ===================================*/
    // message Modal popup
    public errorTitle: string;
    public errorContent: string;
    public showErrorHeader: boolean = true;
    // message Modal popup
    public messageTitle: string;
    public messageContent: string;
    public showMessageHeader: boolean = true;
    // Prompt Modal popup
    public promptTitle: string = 'Confirm';
    public promptContent: string = MessageConstant.Message.ConfirmRecord;
    public showPromptHeader: boolean = true;

    /* ========== Set Focus On =============== */
    public MyFilterEmployeeCodefocus = new EventEmitter<boolean>();
    public TeamIDfocus = new EventEmitter<boolean>();
    public EmployeeCodefocus = new EventEmitter<boolean>();

    /* ========== ellipsis field config =============== */
    public ellipsis = {
        employeeSearch: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'MyFilter',
                'showAddNew': false
            },
            contentComponent: EmployeeSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        account: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'ContractManagement',
                'showAddNewDisplay': false
            },
            contentComponent: AccountSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: true
        },
        contract: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp-All',
                'showAddNew': false
            },
            contentComponent: ContractSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: true
        },
        premises: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'ContractNumber': '',
                'showAddNew': false
            },
            contentComponent: PremiseSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: true
        },
        product: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'ContractNumber': '',
                'PremiseNumber': '',
                'showAddNew': false
            },
            contentComponent: ServiceCoverSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: true
        },
        teamID: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp-Add',
                'showAddNew': false
            },
            contentComponent: ScreenNotReadyComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };
    /* ========== dropdown field config =============== */
    public dropdown = {
        componentName: {
            params: {
                'parentMode': ''
            },
            active: {
                id: '',
                text: ''
            },
            disabled: true,
            required: true,
            isError: true
        }
    };
    /* ========== datePicker field config =============== */
    public datePicker = {
        disabled: false,
        required: false,
        dateReadOnly: false
    };

    /* ========== lookUpSubscription property =============== */
    public lookUpSubscription: Subscription;

    /* ========== xhr API service this.property =============== */
    public xhr: any;
    public xhrParams = {
        module: 'work-order',
        method: 'ccm/maintenance',
        operation: 'ContactManagement/iCABSCMWorkorderReviewGrid'
    };

    /* ========== Constructor property =============== */
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMWORKORDERREVIEWGRID;

        this.setCurrentContractType();
        this.setURLQueryParameters(this);
    }

    public setCurrentContractType(): void {
        this.pageParams.currentContractType =
            this.riExchange.getCurrentContractType();
        this.pageParams.currentContractTypeLabel =
            this.riExchange.getCurrentContractTypeLabel();
    }

    public getURLQueryParameters(param: any): void {
        this.pageParams.ParentMode = param['parentMode'] ? param['parentMode'] : this.riExchange.getParentMode();
        this.pageParams.CurrentContractTypeURLParameter = param['CurrentContractTypeURLParameter'];
    }

    /* ========== formatNewFormDate method =============== */
    public formatNewFormDate(date: any): any {
        date = this.globalize.parseDateToFixedFormat(date);
        return this.globalize.parseDateStringToDate(date);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageParams.pageTitle = 'Work Order - Review';
        this.utils.setTitle(this.pageParams.pageTitle);

        this.getSysCharDtetails();

        if (this.isReturning()) {
            this.populateUIFromFormData();
            if (this.getControlValue('DateFrom')) {
                this.pageParams.dtNewFromDate = this.formatNewFormDate(this.getControlValue('DateFrom'));
            }
            if (this.getControlValue('DateTo')) {
                this.pageParams.dtNewToDate = this.formatNewFormDate(this.getControlValue('DateTo'));
            }
            this.BuildGrid();
        } else {
            this.window_onload();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public getSysCharDtetails(noInit?: boolean): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharCCMCallPipelineVsProspectGrid
        ];
        let sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vPipelineVSProspectGrid = record[0].Required;
        }, (error) => {
            this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
        });
    }

    public callLookupData(): void {
        let bttContactTypeDetail = [];
        let ttContactTypeDetail = [];
        let ttContactTypeLang = [];
        let ttContactTypeDetailBusiness = [];
        let ttContactType = [];
        let ttContactStatus = [];
        let ttWOType = [];

        this.pageParams.vContactStatusList = [
            { ContactStatusCode: 'allopen', ContactStatusDesc: 'All Open' },
            { ContactStatusCode: 'allclosed', ContactStatusDesc: 'All Closed' }
        ];

        // Set array
        this.pageParams.ReassignSelect = [
            { value: 'All', text: 'All' },
            { value: 'AllReassigned', text: 'All Reassigned' },
            { value: 'ReassignedTo', text: 'Reassigned To' },
            { value: 'ReassignedFrom', text: 'Reassigned From' }
        ];

        let lookupIP = [
            {
                'table': 'ContactType',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['Prospect', 'ContactTypeCode', 'ContactTypeSystemDesc']
            },
            {
                'table': 'ContactTypeDetail',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['ContactTypeCode', 'ContactTypeDetailCode', 'ContactTypeDetailSystemDesc']
            },
            {
                'table': 'ContactTypeDetailLang',
                'query': {
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['ContactTypeCode', 'ContactTypeDetailCode', 'ContactTypeDetailDesc']
            },
            {
                'table': 'ContactTypeDetailBusiness',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['WOTypeCode', 'ContactTypeCode', 'ContactTypeDetailCode']
            },
            {
                'table': 'ContactTypeLang',
                'query': {
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['ContactTypeCode', 'ContactTypeDesc']
            },
            {
                'table': 'ContactStatus',
                'query': {},
                'fields': ['ContactStatuSCode', 'ContactStatusSystemDesc']
            },
            {
                'table': 'ContactStatusLang',
                'query': {
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['ContactStatusCode', 'ContactStatusDesc']
            },
            {
                'table': 'TeamUser',
                'query': {},
                'fields': ['UserCode']
            },
            {
                'table': 'riRegistry',
                'query': {
                    'RegSection': 'Work Order Review',
                    'RegKey': this.businessCode() + '_FromDate (NumberOfMonthsInThePast)'
                },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': {
                    'RegSection': 'Work Order Review',
                    'RegKey': this.businessCode() + '_ToDate (NumberOfMonthsInTheFuture)'
                },
                'fields': ['RegValue']
            },
            {
                'table': 'WOType',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProspectInd': true
                },
                'fields': ['WOTypeCode', 'WOTypeSystemDesc']
            },
            {
                'table': 'WOTypeLang',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['WOTypeCode', 'WOTypeDesc']
            }
        ];


        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let ContactTypeData = data[0];
            let ContactTypeDetailData = data[1];
            let ContactTypeDetailLangData = data[2];
            let ContactTypeDetailBusinessData = data[3];
            let ContactTypeLangData = data[4];
            let ContactStatusData = data[5];
            let ContactStatusLangData = data[6];
            let TeamUserData = data[7];
            let riRegistryData_FromDate = data[8];
            let riRegistryData_ToDate = data[9];
            let bWOTypeData = data[10];
            let bWOTypeLangData = data[11];

            let getMonth: number = new Date().getMonth();
            this.pageParams.matchValue = [
                { ContactStatusDesc: '' }
            ];
            if (ContactStatusData && ContactStatusData.length) {
                ContactStatusData.forEach(i => {
                    let filterData = ContactStatusLangData.find(detailObj => (detailObj.ContactStatusCode === i.ContactStatusCode));
                    if (filterData) {
                        this.pageParams.vContactStatusList.push({
                            ContactStatusCode: i.ContactStatusCode,
                            ContactStatusDesc: filterData.ContactStatusDesc ? filterData.ContactStatusDesc : i.ContactStatusSystemDesc
                        });
                    }
                });
            }
            if (ContactTypeDetailData && ContactTypeDetailData.length) {

                ContactTypeDetailData.forEach(item => {
                    if (item) {
                        let filterData = ContactTypeDetailBusinessData.find(detailObj => ((detailObj.ContactTypeCode === item.ContactTypeCode) && (detailObj.ContactTypeDetailCode === item.ContactTypeDetailCode)));

                        if (filterData && filterData.WOTypeCode) {
                            let matchValue = ContactTypeDetailLangData.find(detailObj => ((detailObj.ContactTypeCode === item.ContactTypeCode) && (detailObj.ContactTypeDetailCode === item.ContactTypeDetailCode)));
                            if (matchValue) {
                                bttContactTypeDetail.push({
                                    ContactTypeCode: item.ContactTypeCode,
                                    ContactTypeDetailCode: item.ContactTypeDetailCode,
                                    ContactTypeDetailDesc: matchValue.ContactTypeDetailDesc ? matchValue.ContactTypeDetailDesc : item.ContactTypeDetailSystemDesc
                                });
                            }
                        }
                    }
                });
            }

            if (ContactTypeData && ContactTypeData.length) {
                ContactTypeData.forEach(item => {
                    let lValidType = false;
                    if (item.Prospect) {
                        lValidType = true;
                    } else {
                        /* if This Type Has At Least One Setting Which Will Create A WO { Include */
                        // checkWOTypeSettings:
                        let filterData = ContactTypeDetailBusinessData.find(detailObj => (detailObj.ContactTypeCode === item.ContactTypeCode));
                        if (filterData) {
                            if (filterData.WOTypeCode) {
                                lValidType = true;
                                // LEAVE checkWOTypeSettings.
                            }
                        }
                    }

                    if (lValidType) {
                        let filterData = ContactTypeLangData.find(detailObj => (detailObj.ContactTypeCode === item.ContactTypeCode));

                        if (filterData) {
                            ttContactTypeDetail.push({
                                ContactTypeCode: item.ContactTypeCode,
                                ContactTypeDetailCode: '*',
                                ContactTypeDetailDesc: filterData.ContactTypeDesc ? filterData.ContactTypeDesc : item.ContactTypeSystemDesc
                            });
                            this.utils.sortByKey(ttContactTypeDetail, 'ContactTypeDetailDesc');
                        }
                    }
                });
            }

            /* Build Up A List Of ALL Applicable WOTypes */
            // RUN expandWOType.
            if (TeamUserData.find(element => (element.UserCode === this.utils.getUserCode()))) {
                this.pageParams.vFilterValueList.push(
                    { value: 'myteam', text: 'My Team' }
                );
                this.pageParams.vFilterValueList.push(
                    { value: 'thisteam', text: 'This Team' }
                );
            }

            this.pageParams.vFilterLevelList = [
                { value: 'all', text: 'All' },
                { value: 'currentowner', text: 'Current Owner is' },
                { value: 'currentactioner', text: 'Current Actioner is' },
                { value: 'anyaction', text: 'Any Action by' },
                { value: 'createdby', text: 'Created By' }
            ];

            this.pageParams.vFilterValueList = [
                { value: 'me', text: 'Me' },
                { value: 'myemployees', text: 'My Employees' },
                { value: 'thisbranch', text: 'This Branch' },
                { value: 'thisemployee', text: 'This Employee' }
            ];

            this.pageParams.vMyContactType = ttContactTypeDetail;

            if (riRegistryData_FromDate && riRegistryData_FromDate.length) {
                let RegValueFrom: number = riRegistryData_FromDate[0]['RegValue'] ? parseInt(riRegistryData_FromDate[0]['RegValue'], 10) : null;
                this.pageParams.vMonthsAgo = RegValueFrom ? RegValueFrom : 3;
                this.pageParams.intMonthsAgo = getMonth - this.pageParams.vMonthsAgo;
                // -----Set DateFrom to x months ago-----
                let getFromDate: Date = new Date(new Date().setMonth(this.pageParams.intMonthsAgo));
                this.pageParams.dtNewFromDate = this.formatNewFormDate(getFromDate);
                this.setControlValue('DateFrom', this.pageParams.dtNewFromDate);
            }
            if (riRegistryData_ToDate && riRegistryData_ToDate.length) {
                let RegValueTo: number = riRegistryData_ToDate[0]['RegValue'] ? parseInt(riRegistryData_ToDate[0]['RegValue'], 10) : null;
                this.pageParams.vMonthsAhead = RegValueTo ? RegValueTo : 1;
                this.pageParams.intMonthsAhead = getMonth + this.pageParams.vMonthsAhead;
                //   ----Set DateTo to x months ahead----
                let getToDate: Date = new Date(new Date().setMonth(this.pageParams.intMonthsAhead));
                this.pageParams.dtNewToDate = this.formatNewFormDate(getToDate);
                this.setControlValue('DateTo', this.pageParams.dtNewToDate);
            }

            if (bWOTypeData && bWOTypeData.length) {
                bWOTypeData.forEach(element => {
                    let filterData = bWOTypeLangData.find(matchItem => (matchItem.WOTypeCode === element.WOTypeCode));
                    ttWOType.push({
                        WOTypeCode: element.WOTypeCode,
                        WOTypeSystemDesc: filterData ? filterData.WOTypeDesc : element.WOTypeSystemDesc
                    });
                    this.utils.sortByKey(ttWOType, 'WOTypeSystemDesc');
                });
                this.pageParams.vWOTypeSelect = ttWOType;
            }

            this.pageParams.IntMonthsAgo = this.pageParams.vMonthsAgo;
            this.pageParams.IntMonthsAhead = this.pageParams.vMonthsAhead;

            this.LoadSearchDefaults(); // set dropdown fields default options
        });
    }

    public window_onload(): void {
        this.callLookupData();
        this.AddFields();
        this.setControlValue('BranchNumber', this.utils.getBusinessCode());

        // ############ ----- Initialize Grid properties ---- ######
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;

        this.pageParams.pageSize = 10;
        this.pageParams.curPage = 1;
        this.BuildGrid();
        this.riGrid.RefreshRequired();
    }

    // '##############################################################
    // '# Initialisation Routines
    // '##############################################################

    private AddFields(): void {

        this.riExchange.riInputElement.Add(this.uiForm, 'CallLogID');
        // this.riExchange.riInputElement.align('CallLogID', eAlignRight);

        this.riExchange.riInputElement.Add(this.uiForm, 'CustomerContactNumber');
        // this.riExchange.riInputElement.align('CustomerContactNumber', eAlignRight);

        this.riExchange.riInputElement.Add(this.uiForm, 'AccountNumber');
        this.riExchange.riInputElement.Add(this.uiForm, 'AccountName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountName');;

        this.riExchange.riInputElement.Add(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Add(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');

        this.riExchange.riInputElement.Add(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Add(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');

        this.riExchange.riInputElement.Add(this.uiForm, 'ProductCode');
        this.riExchange.riInputElement.Add(this.uiForm, 'ProductDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductDesc');

        this.riExchange.riInputElement.Add(this.uiForm, 'ContactName');

        this.riExchange.riInputElement.Add(this.uiForm, 'BranchNumber');
        this.riExchange.riInputElement.Add(this.uiForm, 'BranchServiceAreaCode');

        this.riExchange.riInputElement.Add(this.uiForm, 'MyFilterEmployeeCode');
        this.riExchange.riInputElement.Add(this.uiForm, 'EmployeeCode');
        this.riExchange.riInputElement.Add(this.uiForm, 'TeamID');

        this.riExchange.riInputElement.Add(this.uiForm, 'DateFrom');
        this.riExchange.riInputElement.Add(this.uiForm, 'DateTo');

        this.riExchange.riInputElement.Add(this.uiForm, 'ServiceCoverNumber');
        this.riExchange.riInputElement.Add(this.uiForm, 'ServiceCoverRowID');
        this.riExchange.riInputElement.Add(this.uiForm, 'CallOutID');

        // set default hidden fields
        this.pageParams.MyFilterEmployeeCodestyledisplay = false;
        this.pageParams.TeamIDstyledisplay = false;
        this.pageParams.MyFilterstyledisplay = false;
        this.pageParams.EmployeeCodestyledisplay = false;
        this.pageParams.ReassignSelectstyledisplay = false;
        this.pageParams.Referencestyledisplay = false;
    }

    public routeParams: any = {};
    public postData: any = {};
    private LoadSearchDefaults(): void {
        let strReturn;
        let Arr;
        let iLoop;
        let Elle;
        let CT;

        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSCallCentreReviewGrid.p';

        let strFunction = 'GetSearchDefaults';
        this.riMaintenance.PostDataAdd('Function', strFunction, MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BranchNumber', this.utils.getBranchCode(), MntConst.eTypeCode);

        this.riMaintenance.ReturnDataAdd('cmbContactType', MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('cmbStatus', MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('cmbPassed', MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('cmbLevel', MntConst.eTypeTextFree);
        this.riMaintenance.ReturnDataAdd('cmbValue', MntConst.eTypeTextFree);

        // 'Process returned results
        this.riMaintenance.Execute(this, function (data: any): any {
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                //   'Process Default values for selections
                let vMyContactType = this.pageParams.vMyContactType[data.cmbContactType - 1];
                this.setControlValue('MyContactType', vMyContactType.ContactTypeCode + '^' + vMyContactType.ContactTypeDetailCode);
                this.setControlValue('MyFilter', this.pageParams.vContactStatusList[data.cmbStatus].ContactStatusCode);
                this.setControlValue('MyFilterLevel', data.cmbLevel);
                this.setControlValue('MyFilterValue', data.cmbValue);

                this.myContactTypeOnChange();
                this.myFilterOnChange();
                this.myFilterLevelOnChange();
                this.myFilterValueOnChange();
            }
        }, 'POST', 6);

        this.setControlValue('WOTypeSelect', '');
        this.setControlValue('DateFilter', 'actionby');
        this.setControlValue('ReassignSelect', 'All');
    }

    // '##############################################################
    // '# Grid Routines
    // '##############################################################

    private BuildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('WONumber', 'WorkOrder', 'WONumber', MntConst.eTypeInteger, 8, true);
        this.riGrid.AddColumn('ContactTypeDetailDesc', 'WorkOrder', 'ContactTypeDetailDesc', MntConst.eTypeTextFree, 20, true);
        this.riGrid.AddColumn('WOTypeDesc', 'WorkOrder', 'WOTypeDesc', MntConst.eTypeTextFree, 20, true);
        this.riGrid.AddColumn('ContactMediumDesc', 'WorkOrder', 'ContactMediumDesc', MntConst.eTypeText, 15);
        this.riGrid.AddColumn('CustomerName', 'WorkOrder', 'CustomerName', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('ContactName', 'WorkOrder', 'ContactName', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('Actions', 'WorkOrder', 'Actions', MntConst.eTypeInteger, 3);
        this.riGrid.AddColumn('CurrentActionEmployeeCode', 'WorkOrder', 'CustomerName', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('WODateTime', 'WorkOrder', 'WODateTime', MntConst.eTypeText, 10, true);
        this.riGrid.AddColumn('WOCreateDateTime', 'WorkOrder', 'WOCreateDateTime', MntConst.eTypeText, 10, true);

        this.riGrid.AddColumnAlign('WONumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('Actions', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('CurrentActionEmployeeCode', MntConst.eAlignmentCenter);

        this.riGrid.Complete();
    }

    private riExchange_UpdateHTMLDocument(): void {
        if (this.riExchange.getParentAttributeValue('RowID') && this.pageParams.blnUpdate) {
            this.riGrid.Update = true;
        } else {
            this.riGrid.Update = false;
        }
        // this.riGrid.Execute();
        this.riGrid_BeforeExecute();
    }

    private riGrid_BeforeExecute(): void {

        this.pageParams.strGridData = this.getURLSearchParamObject();
        this.pageParams.strGridData.set(this.serviceConstants.Action, '2');
        this.pageParams.strGridData.set('RunningAs', 'WOReview');
        this.pageParams.strGridData.set('CallLogID', this.getControlValue('CallLogID'));
        this.pageParams.strGridData.set('CustomerContactNumber', this.getControlValue('CustomerContactNumber'));
        this.pageParams.strGridData.set('AccountNumber', this.getControlValue('AccountNumber'));
        this.pageParams.strGridData.set('ContractNumber', this.getControlValue('ContractNumber'));
        this.pageParams.strGridData.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        this.pageParams.strGridData.set('ServiceCoverNumber', this.getControlValue('ServiceCoverNumber'));
        this.pageParams.strGridData.set('ProductCode', this.getControlValue('ProductCode'));
        this.pageParams.strGridData.set('Postcode', this.getControlValue('PostCode'));
        this.pageParams.strGridData.set('ContactName', this.getControlValue('SearchContactName'));
        this.pageParams.strGridData.set('Filter', this.getControlValue('MyFilter'));
        this.pageParams.strGridData.set('FilterLevel', this.getControlValue('MyFilterLevel'));
        this.pageParams.strGridData.set('FilterValue', this.getControlValue('MyFilterValue'));
        this.pageParams.strGridData.set('FilterEmployeeCode', this.getControlValue('MyFilterEmployeeCode'));
        this.pageParams.strGridData.set('FilterTeamID', this.getControlValue('TeamID'));
        this.pageParams.strGridData.set('LanguageCode', this.riExchange.LanguageCode());
        this.pageParams.strGridData.set('BranchNumber', this.utils.getBranchCode());
        this.pageParams.strGridData.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
        this.pageParams.strGridData.set('ProspectNumber', this.getControlValue('ProspectNumber'));
        this.pageParams.strGridData.set('MyContactType', this.getControlValue('MyContactType'));
        this.pageParams.strGridData.set('DateFilter', this.getControlValue('DateFilter'));
        this.pageParams.strGridData.set('DateFrom', this.getControlValue('DateFrom'));
        this.pageParams.strGridData.set('DateTo', this.getControlValue('DateTo'));
        this.pageParams.strGridData.set('ReassignEmployeeCode', this.getControlValue('EmployeeCode'));
        this.pageParams.strGridData.set('WOTypeCode', this.getControlValue('WOTypeSelect'));
        this.pageParams.strGridData.set('ReassignSelect', this.getControlValue('ReassignSelect'));

        this.pageParams.strGridData.set(this.serviceConstants.PageSize, this.pageParams.pageSize.toString());
        this.pageParams.strGridData.set(this.serviceConstants.PageCurrent, this.pageParams.curPage.toString());
        this.pageParams.strGridData.set(this.serviceConstants.GridMode, '0');
        this.pageParams.strGridData.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        this.pageParams.strGridData.set(this.serviceConstants.GridCacheRefresh, 'true');
        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.pageParams.strGridData.set('riSortOrder', sortOrder);

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, this.pageParams.strGridData).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.pageParams.curPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.pageParams.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageParams.pageSize : 1;
                    this.riGrid.RefreshRequired();
                    if (this.riGrid.Update) {
                        this.riGrid.StartRow = this.getAttribute('Row');
                        this.riGrid.StartColumn = 0;
                        this.riGrid.RowID = this.getAttribute('RowID');
                        this.riGrid.UpdateHeader = false;
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateFooter = false;
                    }
                    this.riGrid.Execute(data);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
        // this.riGrid.BusinessObjectPostData = this.pageParams.strGridData;
    }

    public riGrid_AfterExecute(): void {
        if (!this.riGrid.Update && this.riGrid.HTMLGridBody) {
            let setFocusElement = this.riGrid.HTMLGridBody.children[0].children[0].children[0].children[0];
            if (setFocusElement) {
                this.SelectedRowFocus(setFocusElement);
            }
        }
    }

    public SelectedRowFocus(rsrcElement: any): void {
        this.setControlValue('RelatedWONumber', this.riGrid.Details.GetValue('WONumber'));
        this.setControlValue('Row', this.riGrid.CurrentRow);
    }

    public riGrid_BodyOnKeyDown(event: any): void {
        let cellindex = this.riGrid.CurrentCell;
        // 'MSA - 25/10/2004 - Add code to detect if shift key was pressed to go back up results list
        if (!event.shiftKey) {
            switch (event.keyCode) {
                case 13: //'Enter
                    this.Detail(event);
                    break;
                case 38: //'Up Arror
                    if ((this.getControlValue('Row') > 0) && (this.getControlValue('Row') < 10))
                        this.SelectedRowFocus(this.riGrid.CurrentHTMLRow.previousSibling.children[0].children[0].children[0]);
                    break;
                case 40:
                case 9: // 'Down Arror Or Tab
                    if ((this.getControlValue('Row') >= 0) && (this.getControlValue('Row') < 9))
                        this.SelectedRowFocus(this.riGrid.CurrentHTMLRow.nextSibling.children[0].children[0].children[0]);
                    break;
                default:
                    break;
            }
        } else {
            switch (event.keyCode) {
                case 9: //'Tab
                    if ((this.getControlValue('Row') > 0) && (this.getControlValue('Row') < 10))
                        this.SelectedRowFocus(this.riGrid.CurrentHTMLRow.previousSibling.children[0].children[0].children[0]);
                    break;
            }
        }
    }

    public riGrid_BodyOnDblClick(event: any): void {
        this.Detail(event);
    }

    public riGrid_BodyOnClick(event: any): void {
        this.SelectedRowFocus(event.srcElement);
    }

    public getCurrentPage(event: any): void {
        this.pageParams.curPage = event.value;
        this.riExchange_UpdateHTMLDocument();
    }

    public riGrid_OnRefresh(): void {
        if (this.pageParams.curPage <= 0) {
            this.pageParams.curPage = 1;
        }
        this.riExchange_UpdateHTMLDocument();
    }

    public riGrid_Sort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public Detail(event: any): void {
        switch (this.riGrid.CurrentColumnName) {
            case 'WONumber':
                this.riExchange.Mode = 'WorkOrderReview';
                this.navigate('WorkOrderReview', InternalMaintenanceServiceModuleRoutes.ICABSCMWORKORDERMAINTENANCE, {
                    PassWONumber: this.getControlValue('RelatedWONumber')
                });
                break;
            case 'Actions':
                this.riExchange.Mode = 'WorkOrderReviewActions';
                this.navigate('WorkOrderReviewActions', InternalMaintenanceServiceModuleRoutes.ICABSCMWORKORDERMAINTENANCE, {
                    PassWONumber: this.getControlValue('RelatedWONumber')
                });
                break;
            default:
                break;
        }
    }

    // '##############################################################
    // '# riExchange Events
    // '##############################################################
    public riExchange_CBORequest(): void {
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ProductCode')) {
            // this.GetServiceCoverNumber();
        }

        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ContractNumber')
            && this.getControlValue('ContractName')) {
            this.GetContractName();
        }

        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'AccountNumber')
            && this.getControlValue('AccountName')) {
            this.GetAccountName();
        }
    }

    // '##############################################################
    // '# Input box OnKeyDown Events
    // '##############################################################

    // this.Ellipsis and Ser parentMode for following fiels -----:
    // accountNumberOnKeydown
    public accountNumberOnKeydown(data: any): void {
        if (data) {
            if (data.AccountNumber) {
                this.setControlValue('AccountNumber', data.AccountNumber || '');
            }
            if (data.AccountName) {
                this.setControlValue('AccountName', data.AccountName || '');
            }
        }
    }
    // contractNumberOnKeydown
    public contractNumberOnKeydown(data: any): void {
        if (data) {
            if (data.ContractNumber) {
                this.setControlValue('ContractNumber', data.ContractNumber || '');
                this.GetContractName();
            }
            if (data.ContractName) {
                this.setControlValue('ContractName', data.ContractName || '');
            }
        }
    }
    // premiseNumberOnKeydown
    public premiseNumberOnKeydown(data: any): void {
        if (data) {
            if (data.PremiseNumber) {
                this.setControlValue('PremiseNumber', data.PremiseNumber || '');
                this.GetPremiseName();
            }
            if (data.PremiseName) {
                this.setControlValue('PremiseName', data.PremiseName || '');
            }
        }
    }
    // productCodeOnKeydown
    public productCodeOnKeydown(data: any): void {
        if (data) {
            if (data.ProductCode) {
                this.setControlValue('ProductCode', data.ProductCode || '');
            }
            if (data.ProductDesc) {
                this.setControlValue('ProductDesc', data.ProductDesc || '');
            }
        }
    }

    public branchServiceAreaCodeOnKeydown(data: any): void {
        if (data) {
            if (data.BranchServiceAreaCode) {
                this.setControlValue('BranchServiceAreaCode', data.BranchServiceAreaCode || '');
            }
        }
    }

    public myFilterEmployeeCodeOnKeydown(data: any): void {
        if (data) {
            if (data.MyFilterEmployeeCode) {
                this.setControlValue('MyFilterEmployeeCode', data.MyFilterEmployeeCode || '');
            }
        }
    }

    public employeeCodeOnKeydown(data: any): void {
        if (data) {
            if (data.EmployeeCode) {
                this.setControlValue('EmployeeCode', data.EmployeeCode || '');
            }
        }
    }

    public teamIDOnKeydown(data: any): void {
        if (data) {
            if (data.TeamID) {
                this.setControlValue('TeamID', data.TeamID || '');
            }
        }
    }

    // '##############################################################
    // '# Input box OnDeactivate Events
    // '##############################################################

    public branchServiceAreaCodeOnDeactivate(): void {
        if (this.getControlValue('BranchServiceAreaCode')) {
            if (this.getControlValue('MyFilterValue') === 'all') {
                this.setControlValue('MyFilterValue', 'thisbranch');
            }
        }
    }

    // '##############################################################
    // '# Input box OnChange Events
    // '##############################################################

    public productCodeOnChange(): void {

        if (!this.riExchange.riInputElement.isNumber(this.uiForm, 'ProductCode')) {
            this.riExchange.riInputElement.markAsError(this.uiForm, 'ProductCode');
            this.setControlValue('ProductDesc', '');
            this.SetAllSCRowID('');
        } else {
            // this.GetServiceCoverNumber();
        }

        this.riGrid.Update = true;
    }

    public customerContactNumberOnChange(): void {
        this.riGrid.RefreshRequired();
    }

    public accountNumberOnChange(): void {
        this.riGrid.RefreshRequired();

        if (!this.riExchange.riInputElement.isNumber(this.uiForm, 'AccountNumber')) {
            this.setControlValue('AccountName', '');
        } else {
            this.AccountNumberFormatOnChange();
        }
        this.GetAccountName();
    }

    public contractNumberOnChange(): void {
        this.riGrid.RefreshRequired();

        if (!this.riExchange.riInputElement.isNumber(this.uiForm, 'ContractNumber')) {
            this.setControlValue('ContractName', '');
        } else {
            this.ContractNumberFormatOnChange();
        }
        this.GetContractName();
    }

    public premiseNumberOnChange(data: any): void {
        this.riGrid.RefreshRequired();
        if (!this.riExchange.riInputElement.isNumber(this.uiForm, 'PremiseNumber')) {
            this.riExchange.riInputElement.markAsError(this.uiForm, 'PremiseNumber');
            this.setControlValue('PremiseName', '');
        } else {
            this.GetPremiseName();
        }
    }

    public searchContactNameOnChange(): void {
        this.riGrid.RefreshRequired();
    }

    public prospectNumberOnChange(): void {
        this.riGrid.RefreshRequired();
    }

    public postCodeOnChange(): void {
        this.riGrid.RefreshRequired();
    }

    public myFilterEmployeeCodeOnChange(data: any): void {
        this.riGrid.RefreshRequired();
    }

    public teamIDOnChange(): void {
        this.riGrid.RefreshRequired();
    }

    // '##############################################################
    // '# Combo box OnChange Events
    // '##############################################################

    public myFilterOnChange(): void {
        this.riGrid.RefreshRequired();
    }

    public myFilterLevelOnChange(): void {
        this.riGrid.RefreshRequired();
    }

    public myFilterValueOnChange(): void {
        this.riGrid.RefreshRequired();

        switch (this.getControlValue('MyFilterValue')) {
            case 'me':
            case 'myemployees':
            case 'thisbranch':
                this.pageParams.MyFilterEmployeeCodestyledisplay = false;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'MyFilterEmployeeCode', false);
                this.pageParams.TeamIDstyledisplay = false;
                this.setControlValue('TeamID', '');
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TeamID', false);
                break;
            case 'thisemployee':
                this.pageParams.TeamIDstyledisplay = false;
                this.setControlValue('TeamID', '');
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TeamID', false);
                this.pageParams.MyFilterEmployeeCodestyledisplay = true;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'MyFilterEmployeeCode', true);
                this.MyFilterEmployeeCodefocus.emit(true);
                break;
            case 'thisteam':
                this.pageParams.TeamIDstyledisplay = true;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TeamID', true);
                this.pageParams.MyFilterEmployeeCodestyledisplay = false;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'MyFilterEmployeeCode', false);
                this.TeamIDfocus.emit(true);
                break;
            default:
                this.setControlValue('BranchServiceAreaCode', '');
                this.pageParams.MyFilterEmployeeCodestyledisplay = false;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'MyFilterEmployeeCode', false);
                this.pageParams.TeamIDstyledisplay = false;
                this.setControlValue('TeamID', '');
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TeamID', false);
                break;
        }

    }

    public reassignSelectOnChange(): void {
        this.riGrid.RefreshRequired();

        switch (this.getControlValue('ReassignSelect')) {
            case 'All':
            case 'AllReassigned':
                this.pageParams.EmployeeCodestyledisplay = false;
                this.setControlValue('EmployeeCode', '');
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EmployeeCode', false);
                break;
            case 'ReassignedTo':
            case 'ReassignedFrom':
                this.pageParams.EmployeeCodestyledisplay = true;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EmployeeCode', true);
                this.EmployeeCodefocus.emit();
                break;
            default:
                break;
        }
    }

    public myContactTypeOnChange(): void {
        this.riGrid.RefreshRequired();
    }

    // '##############################################################
    // '# Other routines
    // '##############################################################

    public ProductCode_search(): void {
        if (this.getControlValue('ContractNumber') || this.getControlValue('PremiseNumber')) {
            this.riExchange.Mode = '';
            this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotCovered));
            // window.location = "/wsscripts/riHTMLWrapper.p?riFileName=ContactManagement/iCABSCMPremiseSearch.htm"
        }
        this.riExchange.Mode = 'LookUp';
        this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotCovered));
        // : window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAServiceCoverSearch.htm"
    }

    public SetAllSCRowID(ipRowID: string): void {
        this.attributes['SCRowID'] = ipRowID;
        this.attributes['ServiceCoverRowID'] = ipRowID;

        this.setControlValue('ServiceCoverRowID', ipRowID);
    }

    public GetAccountName(): void {
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSContactManagementFunctions.p';

        this.riMaintenance.PostDataAdd('Function', 'GetAccountName', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('AccountNumber', this.getControlValue('AccountNumber'), MntConst.eTypeCode);

        this.riMaintenance.ReturnDataAdd('AccountName', MntConst.eTypeText);

        // 'Process returned results
        this.riMaintenance.Execute(this, function (data: any): any {
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                this.setControlValue('AccountName', data.AccountName);
            }
        }, 'POST', 6);
    }

    public GetContractName(): void {
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSContactManagementFunctions.p';

        this.riMaintenance.PostDataAdd('Function', 'GetContractName', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('ContractNumber', this.getControlValue('ContractNumber'), MntConst.eTypeCode);

        this.riMaintenance.ReturnDataAdd('ContractName', MntConst.eTypeText);

        // 'Process returned results
        this.riMaintenance.Execute(this, function (data: any): any {
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                this.setControlValue('ContractName', data.ContractName);
                this.ellipsis.premises.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
                this.ellipsis.product.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
            }
        }, 'POST', 6);
    }

    public GetPremiseName(): void {
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSContactManagementFunctions.p';

        this.riMaintenance.PostDataAdd('Function', 'GetPremiseName', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('ContractNumber', this.getControlValue('ContractNumber'), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('PremiseNumber', this.getControlValue('PremiseNumber'), MntConst.eTypeCode);

        this.riMaintenance.ReturnDataAdd('PremiseName', MntConst.eTypeText);

        // 'Process returned results
        this.riMaintenance.Execute(this, function (data: any): any {
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                this.setControlValue('PremiseName', data.PremiseName);
                this.ellipsis.product.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber');
            }
        }, 'POST', 6);
    }

    public AccountNumberFormatOnChange(): void {
        let paddedValue = this.utils.numberPadding(this.getControlValue('AccountNumber'), 9);
        this.setControlValue('AccountNumber', paddedValue);
    }

    public ContractNumberFormatOnChange(): void {
        let paddedValue = this.utils.numberPadding(this.getControlValue('ContractNumber'), 8);
        this.setControlValue('ContractNumber', paddedValue);
    }

    @HostListener('document:keydown', ['$event']) document_onkeydown(ev: any): void {
        switch (ev.keyCode) {
            case 13:
                this.riGrid_BeforeExecute();
                break;
            default:
                break;
        }
    };

    public dateFromSelectedValue(value: any): void {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', value.value);
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', '');
        }
    }

    public dateToSelectedValue(value: any): void {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', value.value);
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', '');
        }
    }

}

