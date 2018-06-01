import { errorHandler } from '@angular/platform-browser/src/browser';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { CBBService } from './../../../shared/services/cbb.service';
import { BranchSearchComponent } from './../../internal/search/iCABSBBranchSearch';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import * as querystring from 'querystring';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { GroupAccountNumberComponent } from '../../internal/search/iCABSSGroupAccountNumberSearch';
import { Store } from '@ngrx/store';
import { LocalStorageService } from 'ng2-webstorage';
import { TranslateService } from 'ng2-translate';
import { Title } from '@angular/platform-browser';
import { PageDataService } from './../../../shared/services/page-data.service';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { AuthService } from './../../../shared/services/auth.service';
import { MessageService } from './../../../shared/services/message.service';
import { ErrorService } from './../../../shared/services/error.service';
import { HttpService } from './../../../shared/services/http-service';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { GridComponent } from './../../../shared/components/grid/grid';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { AccountPremiseSearchComponent } from '../../internal/grid-search/iCABSAAccountPremiseSearchGrid';
import { URLSearchParams, Http } from '@angular/http';
import { Component, OnInit, ViewChild, OnDestroy, NgZone, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { LookUp } from '../../../shared/services/lookup';
import { Utils } from '../../../shared/services/utility';
import { RiExchange } from '../../../shared/services/riExchange';
import { SpeedScript } from '../../../shared/services/speedscript';
import { Subscription } from 'rxjs';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { CallCentreReviewGridMultiComponent } from '../../internal/search/iCABSCMCallCentreReviewGridMulti';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { GlobalizeService } from '../../../shared/services/globalize.service';
@Component({
    templateUrl: 'iCABSCMCallCentreReviewGrid.html',
    styles: [`
    :host /deep/ .gridtable tbody tr td:nth-child(1) input,
    :host /deep/ .gridtable tbody tr td:nth-child(2) input,
    :host /deep/ .gridtable tbody tr td:nth-child(7) input {
        text-align: center;
    }
    :host /deep/ .gridtable tbody tr td:nth-child(1) div,
    :host /deep/ .gridtable tbody tr td:nth-child(2) div,
    :host /deep/ .gridtable tbody tr td:nth-child(7) div {
        background: #FFF;
    }
    :host /deep/ .gridtable tbody tr td:nth-child(3),
    :host /deep/ .gridtable tbody tr td:nth-child(4),
    :host /deep/ .gridtable tbody tr td:nth-child(6),
    :host /deep/ .gridtable tbody tr td:nth-child(8),
    :host /deep/ .gridtable tbody tr td:nth-child(9),
    :host /deep/ .gridtable tbody tr td:nth-child(10) {
        text-align: left;
    }
  `]
})
export class CentreReviewGridComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('callCentreReviewGrid') callCentreReviewGrid: GridComponent;
    @ViewChild('callCentreReviewPagination') callCentreReviewPagination: PaginationComponent;
    @ViewChild('GroupNameEllipsis') groupNameEllipsis: EllipsisComponent;
    @ViewChild('PremiseNumberEllipsis') premiseNumberEllipsis: EllipsisComponent;
    @ViewChild('employeeSearchComponentEllipse') employeeSearchComponentEllipse: EllipsisComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('BranchNumberDropdwon') BranchNumberDropdwon: BranchSearchComponent;
    @ViewChild('reviewGridMultiEllispsis') reviewGridMultiEllispsis: EllipsisComponent;

    public title: string = 'Contact Centre - Review';
    public employeeSearchComponent = EmployeeSearchComponent;
    public callCentreReviewGridMultiComponent = CallCentreReviewGridMultiComponent;
    public inputParamsEmployeeSearch: any = {
        'parentMode': 'MyFilter'
    };
    public setEmployee(data: any): void {
        this.MyFilterEmployeeCode = data.MyFilterEmployeeCode;
    }
    public setEmployeeReassign(data: any): void {
        this.EmployeeCode = data.MyFilterEmployeeCode;
    }

    public branchSearchComponent = BranchSearchComponent;
    public inputParamsBranchSearch: any = {
        'parentMode': 'LookUp-CCMReview'
    };
    public setBranch(data: any): void {
        this.FilterBranchNumber = data.BranchNumber;
    }

    public groupAccountNumberComponent = GroupAccountNumberComponent;
    public GroupAccountNumber: string;
    public GroupName: string;
    public inputParamsGrpAccNumber: any = {
        'parentMode': 'LookUp',
        'businessCode': this.utils.getBusinessCode(),
        'countryCode': this.utils.getCountryCode(),
        'Action': '2'
    };
    public inputParamsreviewGridMulti: any = {
        'parentMode': 'ContactCentreReview',
        'ComplexTicketTypeList': '',
        'windowClosingName': ''
    };
    public onGroupAccount(data: any): void {
        if (data.GroupName) {
            this.GroupAccountNumber = data.GroupAccountNumber;
            this.GroupName = data.GroupName;
        }
        else {
            this.GroupAccountNumber = data.GroupAccountNumber;
        }
    }

    public accountSearchComponent = AccountSearchComponent;
    public AccountNumber: string;
    public AccountName: string;
    public inputParamsAccountNumber: any = {
        'parentMode': 'ContactCentreReview',
        'accountName': 'JET'
    };
    public setAccountNumber(data: any): void {
        this.AccountNumber = data.AccountNumber;
        this.AccountName = data.AccountName;
        this.inputParamsContract.accountNumber = this.AccountNumber;
        this.inputParamsContract.accountName = this.AccountName;
        this.inputParamsAccountPremise['AccountNumber'] = this.AccountNumber;
        this.inputParamsAccountPremise['AccountName'] = this.AccountName;
    }

    @ViewChild('contractSearchEllipse') contractSearchEllipse: EllipsisComponent;
    public ContractNumber: string;
    public ContractName: string;
    public contractSearchComponent = ContractSearchComponent;
    public inputParamsContract: any = {
        'parentMode': 'LookUp-All',
        'pageTitle': 'Contract Entry',
        'currentContractType': 'C',
        'showAddNew': true
    };
    public onContractDataReceived(data: any): void {
        this.ContractNumber = data.ContractNumber;
        this.ContractName = data.ContractName;
        this.AccountNumber = data.AccountNumber;
        this.inputParamsAccountPremise['ContractNumber'] = data.ContractNumber;
        this.inputParamsAccountPremise['ContractName'] = data.ContractName;
        this.inputParamsAccountPremise['AccountNumber'] = data.AccountNumber;
        this.GetAccountName();
    }

    public PremiseNumber: string;
    public PremiseName: string;
    public accountPremise = PremiseSearchComponent;
    public inputParamsAccountPremise: any = {
        'parentMode': 'LookUp',
        'pageTitle': 'Premise Search'
    };
    public onPremiseSearchDataReceived(data: any): void {
        this.PremiseNumber = data.PremiseNumber;
        this.PremiseName = data.PremiseName;
    }
    public onPremiseSearchDataReceivedFor(data: any): void {
        this.ProductCode = data.PremiseNumber;
        this.ProductDesc = data.PremiseName;
    }

    public showCloseButton: Boolean = true;
    public dynamicComponent: any;
    public storeSubscription: Subscription;
    public businessDropdown: any;
    public businessDropdownDisabled: boolean = true;

    public CallLogID: string = '';
    public CustomerContactNumber: string = '';
    public ServiceCoverNumber: string = '';
    public ProductCode: string = '';
    public ProductDesc: string = '';
    public PostCode: string = '';
    public SearchContactName: string = '';
    public MyFilter: string = '';
    public MyFilterPassed: string = '';
    public MyFilterDisputed: string = '';
    public MyFilterLevel: any;
    public MyFilterValue: any;
    public MyFilterEmployeeCode: string = '';
    public TeamID: string = '';
    public LanguageCode: string = '';
    public BranchNumber: string = '';
    public BranchServiceAreaCode: string = '';
    public FilterBranchNumber: string = '';
    public ProspectNumber: string = '';
    public MyContactType: string = '';
    public DateFilter: any;
    public DateFrom: string = '';
    public DateTo: string = '';
    public TicketReference: string = '';
    public CompanyInvoiceNumber: string = '';
    public OnDisputeReference: string = '';
    public ContactTypeCodeSelectValue1: string = '';
    public ContactTypeDetailCodeSelectValue1: string = '';
    public ContactStatusCodeSelectValue1: string = '';
    public ContactTypeCodeSelectValue2: string = '';
    public ContactTypeDetailCodeSelectValue2: string = '';
    public ContactStatusCodeSelectValue2: string = '';
    public ContactTypeCodeSelectValue3: string = '';
    public ContactTypeDetailCodeSelectValue3: string = '';
    public ContactStatusCodeSelectValue3: string = '';
    public ContactTypeCodeSelectValue4: string = '';
    public ContactTypeDetailCodeSelectValue4: string = '';
    public ContactStatusCodeSelectValue4: string = '';
    public ContactTypeCodeSelectValue5: string = '';
    public ContactTypeDetailCodeSelectValue5: string = '';
    public ContactStatusCodeSelectValue5: string = '';
    public ContactTypeCodeSelectValue6: string = '';
    public ContactTypeDetailCodeSelectValue6: string = '';
    public ContactStatusCodeSelectValue6: string = '';
    public ContactTypeCodeSelectValue7: string = '';
    public ContactTypeDetailCodeSelectValue7: string = '';
    public ContactStatusCodeSelectValue7: string = '';
    public ContactTypeCodeSelectValue8: string = '';
    public ContactTypeDetailCodeSelectValue8: string = '';
    public ContactStatusCodeSelectValue8: string = '';
    public ContactTypeCodeSelectValue9: string = '';
    public ContactTypeDetailCodeSelectValue9: string = '';
    public ContactStatusCodeSelectValue9: string = '';
    public ContactTypeCodeSelectValue10: string = '';
    public ContactTypeDetailCodeSelectValue10: string = '';
    public ContactStatusCodeSelectValue10: string = '';
    public EmployeeCode: string = '';
    public ReassignSelect: any;
    public ServiceCoverRowID: string = '';
    public collapsediv: boolean = true;
    public showHeader: boolean = true;
    public modalConfig = {
        backdrop: 'static',
        keyboard: true
    };


    public attrProductCodeSCRowID: string;
    public attrProductCodeServiceCoverRowID: string;
    public attrServiceCoverNumberSCRowID: string;
    public attrServiceCoverNumberServiceCoverRowID: string;

    itemsPerPage: number = 10;
    currentPage: number = 1;
    page: number = 1;
    totalItems: number = 1;
    maxColumn: number = 12;

    filterDisputedList: any = [];
    ReassignList: any = [];

    public gridTotalItems: number;
    //dropdown static values
    //public contactTypeList: Array<any> = [{ text: 'All', value: '1' }, { text: 'Account Review', value: '1' }, { text: 'Admin & General', value: '1' }, { text: 'Call Out', value: '1' }, { text: 'Client Retention', value: '1' }, { text: 'Collection', value: '1' }, { text: 'Complaints', value: '1' }, { text: 'Customer Integration', value: '1' }, { text: 'Entitlement', value: '1' }, { text: 'First Alert', value: '1' }, { text: 'Internal Message', value: '1' }, { text: 'Multiple Search', value: '1' }, { text: 'New Account Created', value: '1' }, { text: 'PDA Alert', value: '1' }, { text: 'PDA Lead', value: '1' }, { text: 'Prospect', value: '1' }, { text: 'Sales Activity', value: '1' }, { text: 'Service Receipt', value: '1' }, { text: 'Service Receipt Issues', value: '1' }, { text: 'Service Related', value: '1' }, { text: 'Service Suspended', value: '1' }, { text: 'Telesales Related', value: '1' }, { text: 'Web Query', value: '1' }];
    public contactTypeList = [];

    public MyfilterList: Array<any> = [{ text: 'All Open', value: 'allopen' }, { text: 'All Open & Closed', value: 'allopenclosed' }, { text: 'All Closed', value: 'allclosed' }, { text: 'Closed', value: 'closed' }, { text: 'Open', value: 'open' }];

    public filterPassedList1 = [{ text: 'All', value: 'all' }, { text: 'Passed', value: 'passed' }, { text: 'Not Passed', value: 'notpassed' }];

    public filterPassedList = [{ text: 'All', value: 'all' }, { text: 'Any Action by', value: 'anyaction' }, { text: 'Current Owner is', value: 'currentowner' }, { text: 'Current Actioner is', value: 'currentactioner' }, { text: 'Created By', value: 'createdby' }];

    public filterPassedList2 = [{ text: 'All', value: 'all' }, { text: 'Me', value: 'me' }, { text: 'My Employees', value: 'myemployees' }, { text: 'This Branch (Employee)', value: 'thisbranch' }, { text: 'This Branch (Service)', value: 'thisservbranch' }, { text: 'This Employee', value: 'thisemployee' }];
    public ReassignSelectList = [{ text: 'All', value: 'All' }, { text: 'All Reassigned', value: 'AllReassigned' }, { text: 'Reassigned To', value: 'ReassignedTo' }, { text: 'Reassigned From', value: 'ReassignedFrom' }];

    public myFilterDisputedList = [{ text: 'All Tickets', value: 'all' }, { text: 'With Invoices Currently On Dispute', value: 'ondispute' }, { text: 'With Invoices No Longer On Dispute', value: 'offdispute' }, { text: 'With Any Associated Invoices', value: 'onoffdispute' }];

    public businessList = [];

    public DateFilterList: any = [{ text: 'Action By Date', value: 'actionby' }, { text: 'Created date', value: 'created' }];

    public toDate: any = new Date(new Date().setMonth(new Date().getMonth() + 1));
    public fromDate: any = new Date(new Date().setMonth(new Date().getMonth() - 3));
    //public toDate: any = this.myDateFormat(+1);
    //public fromDate: any = this.myDateFormat(-3);
    public toDateDisplay: string;
    public fromDateDisplay: string;

    public query: URLSearchParams = new URLSearchParams();
    public inputParams: any = {
        'parentMode': '',
        'businessCode': this.utils.getBusinessCode(),
        'countryCode': this.utils.getCountryCode()
    };

    public inputParamsContractNumberr: any = {
        'parentMode': 'LookUp-All',
        'Action': '2'
    };
    public inputParamsPremiseNumber: any = {
        'parentMode': 'LookUp-All',
        'Action': '2'
    };

    public urlParams: any = {
        action: '0',
        operation: 'ContactManagement/iCABSCMCallCentreReviewGrid',
        module: 'call-centre',
        method: 'ccm/maintenance'
    };
    public xhrParams = this.urlParams;

    public storeData: any;
    public contactTypeDropdown: any;
    public spanSOPGridDisplay: boolean = true;

    //Speedscript
    public vBusinessCode: string;
    public countryCode: string;
    public vSCEnableServiceCoverDetail: boolean;
    public ReqDetail: boolean;
    public glAllowUserAuthView: boolean;
    public glAllowUserAuthUpdate: boolean;
    public glCompositesInUse: boolean;
    public CompositesInUse: boolean;
    public LineOfService: any;
    public gUserCode: any;
    public vPipelineVSProspectGrid: any;

    public myFilterDisputedEnable = false;
    public gridHeaderClickedColumn: any = 'Ticket';
    public gridSortOrder: any = 'Ascending';
    public gridSortHeaders: Array<any>;
    public displayObj = {
        spanComplexSearch: false,
        spanStandardSearch: true
    };
    public branchDefault = { id: '', text: '' };

    public displayFlag = {
        'FilterBranchNumber': false,
        'MyFilterEmployeeCode': false,
        'TeamID': false,
        'EmployeeCode': false
    };

    public errorClass = 'ng-invalid';
    public formControlErrorFlag: any = {
        businessDropdown: false,
        contactTypeDropdown: false,
        MyFilter: false,
        MyFilterPassed: false,
        MyFilterDisputed: false,
        MyFilterLevel: false,
        MyFilterValue: false,
        MyFilterEmployeeCode: false,
        FilterBranchNumber: false,
        CallLogID: false,
        CustomerContactNumber: false,
        GroupAccountNumber: false,
        GroupName: false,
        SearchContactName: false,
        AccountNumber: false,
        AccountName: false,
        TicketReference: false,
        ContractName: false,
        PostCode: false,
        ProspectNumber: false,
        PremiseNumber: false,
        PremiseName: false,
        CompanyInvoiceNumber: false,
        OnDisputeReference: false,
        ProductCode: false,
        ReassignSelect: false,
        EmployeeCode: false,
        DateFilter: false,
        ProductDesc: false
    };
    //Added for multi search parameters
    public ComplexTicketTypeList: string = '';
    public windowClosingName: string = '';

    public validateProperties: Array<any> = [];

    constructor(private httpService: HttpService,
        private serviceConstants: ServiceConstants,
        private errorService: ErrorService,
        private messageService: MessageService,
        /* private authService: AuthService,*/
        private ajaxconstant: AjaxObservableConstant,
        private router: Router,
        private pageData: PageDataService,
        private titleService: Title,
        private zone: NgZone,
        private store: Store<any>,
        private translate: TranslateService,
        private ls: LocalStorageService,
        private http: Http,
        private localeTranslateService: LocaleTranslationService,
        private sysCharConstants: SysCharConstants,
        private activatedRoute: ActivatedRoute,
        private utils: Utils,
        private LookUp: LookUp,
        private SpeedScript: SpeedScript,
        private cbbService: CBBService,
        private globalizeService: GlobalizeService
    ) {
        this.storeSubscription = store.select('contract').subscribe(data => {
            this.storeData = data;
            if (this.storeData['data'] && !(Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object)) {
                this.setFormData(this.storeData);
            }
        });
        this.DateFrom = this.utils.formatDate(this.fromDate);
        this.DateTo = this.utils.formatDate(this.toDate);
        //this.toDate = this.myDateFormat(+1);
        //this.fromDate = this.myDateFormat(-3);
        //this.contactTypeDropdown = this.contactTypeList[0].text;
        this.contactTypeDropdown = 'all';
        this.MyFilter = this.MyfilterList[0].value;
        this.MyFilterPassed = this.filterPassedList1[0].value;
        this.MyFilterLevel = this.filterPassedList[3].value;
        this.MyFilterValue = this.filterPassedList2[1].value;
        this.ReassignSelect = this.ReassignSelectList[0].value;
        this.DateFilter = this.DateFilterList[0].value;

        this.vBusinessCode = this.utils.getBusinessCode();
        this.gUserCode = this.utils.getUserCode();
        this.countryCode = this.utils.getCountryCode();
        this.doLookup();
        this.getSysCharDtetails();
    }
    private window_onload(): void {
        this.vBusinessCode = this.utils.getBusinessCode();
    }
    public myDateFormat(incriMonth: any): any {
        let DateNew = new Date();
        let month = '' + (DateNew.getMonth() + (incriMonth));
        let day = '' + DateNew.getDate();
        let year = DateNew.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [month, day, year].join('/');
    }
    private doLookup(): any {
        //LookUp
        let vUserCode: any;
        let vUserName: any;
        // working user id 'query': { 'UserCode': 'cit.cogad' },
        let lookupIP = [
            {
                'table': 'UserAuthority',
                'query': { 'UserCode': this.gUserCode },
                'fields': ['UserCode', 'CurrentBusiness', 'BusinessCode']
            },
            {
                'table': 'Business',
                'query': {},
                'fields': ['BusinessCode', 'BusinessDesc']
            },
            {
                'table': 'UserAuthorityBranch',
                'query': {},
                'fields': ['UserCode', 'BusinessCode', 'DefaultBranchInd']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let userAuthorityDataset: any = data[0];
            let businessDataset: any = data[1];
            let userAuthorityBranchDataset = data[2];
            if (userAuthorityDataset.length > 0) {
                if (businessDataset.length > 0) {
                    userAuthorityDataset.forEach(item => {
                        let filterDataBusiness = businessDataset.find(Obj => (Obj.BusinessCode === item.BusinessCode));
                        let filterDataUserAuthorityBranch = userAuthorityBranchDataset.find(Obj => ((Obj.BusinessCode === item.BusinessCode) && (Obj.UserCode === item.UserCode)));
                        this.businessList.push({
                            value: filterDataBusiness.BusinessCode || item.BusinessCode,
                            text: filterDataBusiness.BusinessDesc || ''
                        });
                    });
                    this.businessDropdown = this.utils.getBusinessCode();
                }
            }
        });
        let lookupRegistryIP = [{
            'table': 'riRegistry',
            'query': { 'RegSection': 'CCM Disputed Invoices', 'RegKey': this.utils.getBusinessCode() + '_Enable CCM Dispute Processing' },
            'fields': ['RegValue']
        }];
        this.LookUp.lookUpRecord(lookupRegistryIP).subscribe((data) => {
            let dataReturned = data[0];
            if (dataReturned.length > 0) {
                this.myFilterDisputedEnable = dataReturned[0].RegValue === 'N' ? false : true;
            }
        });
        let lookUpUserInformation = [{
            'table': 'UserInformation',
            'query': { 'UserCode': this.utils.getUserCode() },
            'fields': ['LanguageCode', 'UserCode', 'UserName']
        }];
        this.LookUp.lookUpRecord(lookUpUserInformation).subscribe((data) => {
            let languageCode;
            let vUserCode;
            let vUserName;
            if (data[0].length > 0) {
                languageCode = data[0][0]['LanguageCode'];
                vUserCode = data[0][0]['UserCode'];
                vUserName = data[0][0]['UserName'];
            }
            let lookupContactType = [{
                'table': 'ContactType',
                'query': {},
                'fields': ['ContactTypeCode', 'ContactTypeDesc']
            },
            {
                'table': 'ContactTypeLang',
                'query': {
                    'LanguageCode': languageCode
                },
                'fields': ['ContactTypeCode', 'ContactTypeDesc']
            }
            ];
            this.LookUp.lookUpRecord(lookupContactType).subscribe((data) => {
                let contactTypeDataset: any = data[0];
                let contactTypeLangDataset: any = data[1];
                if (data[0].length > 0) {
                    contactTypeDataset.forEach(i => {
                        let filterData = contactTypeLangDataset.find(detailObj => (detailObj.ContactTypeCode === i.ContactTypeCode));
                        if (filterData) {
                            this.contactTypeList.push({
                                text: filterData.ContactTypeDesc ? filterData.ContactTypeDesc : i.ContactTypeDesc,
                                value: filterData.ContactTypeCode ? filterData.ContactTypeCode : i.ContactTypeCode
                            });
                        }
                    });
                    this.utils.sortByKey(this.contactTypeList, 'text');
                }
            });
        });
    }
    private getSysCharDtetails(): any {
        //SysChar
        let sysCharList: number[] = [this.sysCharConstants.SystemCharCCMCallPipelineVsProspectGrid];
        let sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.vBusinessCode,
            countryCode: this.countryCode,
            SysCharList: sysCharList.toString()
        };
        this.SpeedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records[0];
            this.vPipelineVSProspectGrid = record.Required;
        });
    }
    public cmdSOPGrid_OnClick(): any {
        if (this.vPipelineVSProspectGrid) {
            this.router.navigate(['/prospecttocontract/SalesOrderProcessing/PipelineGrid'], { queryParams: { parentMode: 'ContactCentreReview' } });
        } else {
            this.messageModal.show({ msg: 'iCABSSSOProspectGrid - screen is not yet developed', title: 'Message' }, false);
            // TODO: this.router.navigate(['/iCABSSSOProspectGrid'], { queryParams: { parentMode: 'ContactCentreReview' } });
        }
    }
    ngOnInit(): void {
        this.localeTranslateService.setUpTranslation();
        this.utils.setTitle(this.title);
        this.getUrlParams();
        this.initPage();
        this.setSortOrder();
        this.MyFilterDisputed = 'all';
        this.getBranchDetails();
        this.BuildGrid(this.inputParams);
        this.validateProperties = [{
            'type': MntConst.eTypeInteger,
            'index': 0,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 1,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 2,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 3,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 5,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 6,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 7,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 8,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 9,
            'align': 'center'
        }];
    }

    public ngAfterViewInit(): void {
        this.utils.setTitle(this.title);
    }

    ngOnDestroy(): void {
        if (this.storeSubscription)
        this.storeSubscription.unsubscribe();
    }

    public getBranchDetails(): void {
        let branchCode = this.utils.getBranchCode();
        this.FilterBranchNumber = branchCode;
        this.BranchNumber = branchCode;
        this.branchDefault.text = this.utils.getBranchText(branchCode);
        this.branchDefault.id = branchCode;
    }

    public setSortOrder(): void {
        this.gridSortHeaders = [{
            'fieldName': 'grCallLogID',
            'colName': 'Log',
            'sortType': 'ASC'
        },
        {
            'fieldName': 'ContactActionNumber',
            'colName': 'Ticket',
            'sortType': 'ASC'
        },
        {
            'fieldName': 'ContactType',
            'colName': 'Type',
            'sortType': 'ASC'
        },
        {
            'fieldName': 'ContactName',
            'colName': 'Details',
            'sortType': 'ASC'
        },
        {
            'fieldName': 'Actions',
            'colName': 'Act',
            'sortType': 'ASC'
        },
        {
            'fieldName': 'CurrentActionEmployeeCode',
            'colName': 'Employee',
            'sortType': 'ASC'
        },
        /*{
            'fieldName': 'Status',
            'colName': 'Status',
            'sortType': 'ASC'
        },*/
        {
            'fieldName': 'ActionByDateTime',
            'colName': 'Action by',
            'sortType': 'ASC'
        },
        {
            'fieldName': 'CreatedDateTime',
            'colName': 'Created',
            'sortType': 'ASC'
        }];
    }

    public getUrlParams(): void {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            if (params['parentMode'] !== undefined) {
                this.inputParams.parentMode = params['parentMode'];
                if (this.inputParams.parentMode === 'PipelineProspectGrid' || this.inputParams.parentMode === 'ProspectGrid') {
                    this.spanSOPGridDisplay = false;
                }
                if (!this.storeData['data'] || (Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object)) {
                    this.setFormData({
                        data: params,
                        sentFromParent: params
                    });
                }
            }
            if (params['businessCode'] !== undefined)
                this.inputParams.businessCode = params['businessCode'];
            if (params['countryCode'] !== undefined)
                this.inputParams.countryCode = params['countryCode'];
        });
    }

    public setFormData(data: any): void {
        if (data['sentFromParent'] || this.inputParams.parentMode) {
            this.businessDropdownDisabled = false;
            switch (data['sentFromParent'].parentMode) {
                case 'Account':
                case 'Contract':
                case 'Premise':
                case 'InvoiceHistory':
                case 'WorkOrderMaintenanceContract':
                case 'WorkOrderMaintenanceAccount':
                    this.AccountNumber = data['data'].AccountNumber;
                    this.AccountName = data['data'].AccountName;
                    this.ContractNumber = data['data'].ContractNumber;
                    this.ContractName = data['data'].ContractName;
                    this.PremiseNumber = data['data'].PremiseNumber;
                    this.PremiseName = data['data'].PremiseName;
                    this.ProductCode = data['data'].ProductCode;
                    this.ProductDesc = data['data'].ProductDesc;
                    this.ServiceCoverNumber = data['data'].ServiceCoverNumber;
                    this.SetAllSCRowID(data['data'].ServiceCoverRowID);
                    if ((data['sentFromParent'].parentMode !== 'WorkOrderMaintenanceContract') || (data['sentFromParent'].parentMode !== 'WorkOrderMaintenanceAccount')) {
                        this.MyFilterLevel = 'currentactioner';
                        this.MyFilter = 'thisbranch';
                    }
                    if (data['sentFromParent'].parentMode === 'InvoiceHistory') {
                        this.MyFilterLevel = 'all';
                        this.MyFilter = 'allopenclosed';
                        this.CompanyInvoiceNumber = data['data'].ServiceCoverRowIDInvoiceNumber;
                    }
                    break;
                case 'ServiceCover':
                    this.AccountNumber = data['data'].AccountNumber;
                    this.AccountName = data['data'].AccountName;
                    this.ContractNumber = data['data'].ContractNumber;
                    this.ContractName = data['data'].ContractName;
                    this.PremiseNumber = data['data'].PremiseNumber;
                    this.PremiseName = data['data'].PremiseName;
                    this.ProductCode = data['data'].ProductCode;
                    this.ProductDesc = data['data'].ProductDesc;
                    this.ServiceCoverNumber = data['data'].ServiceCoverNumber;
                    this.SetAllSCRowID(data['data'].CurrentServiceCoverRowID);
                    this.MyFilterLevel = 'currentactioner';
                    this.MyFilter = 'thisbranch';
                    break;
                case 'PipelineProspectGrid':
                case 'ProspectGrid':
                    this.MyFilterLevel = 'currentactioner';
                    this.MyFilter = 'me';
                    this.spanSOPGridDisplay = false;
                    break;
                case 'WorkOrderMaintenanceProspect':
                    this.ProspectNumber = data['data'].ProspectNumber;
                    break;
                case 'WorkOrderMaintenanceCustomerContact':
                    this.CustomerContactNumber = data['data'].CustomerContactNumber;
                    break;
                default:

            }
        }
    }

    public SetAllSCRowID(ipRowID: any): void {
        this.attrServiceCoverNumberSCRowID = ipRowID;
        this.attrProductCodeServiceCoverRowID = ipRowID;
        this.ServiceCoverNumber = ipRowID;
        this.ServiceCoverRowID = ipRowID;
    }

    initPage(): void {

        let strGridData;
        let blnUpdate;
        let intMonthsAgo;
        let intMonthsAhead;
        let IntPeriodMonths;
        let cUserCode;
        let cUserName;
        let cLimitUserBranch;
        let lEnableDisputeInvoices;

        if (this.inputParams.parentMode === 'WorkOrderMaintenanceContract' ||
            this.inputParams.parentMode === 'WorkOrderMaintenanceAccount' ||
            this.inputParams.parentMode === 'WorkOrderMaintenanceProspect' ||
            this.inputParams.parentMode === 'WorkOrderMaintenanceCustomerContact') {
            this.MyFilterLevel = 'all';
            //this.MyFiltervalue = 'thisbranch';
        }

        //only allow business code to be changed when enter screen from main menu
        if (this.inputParams.parentMode !== '') {
            //SelectBusiness.disabled = true
        }

        switch (this.inputParams.parentMode) {
            case 'Account':
            case 'Contract':
            case 'Premise':
            case 'InvoiceHistory':
                break;
            case 'WorkOrderMaintenanceContract':
            case 'WorkOrderMaintenanceAccount':
                break;
            case 'ServiceCover':
                break;
            case 'PipelineProspectGrid':
            case 'ProspectGrid':
                break;
            case 'WorkOrderMaintenanceProspect':
                break;
            case 'WorkOrderMaintenanceCustomerContact':
                break;
            default:

        }

        /**
         * Adding parameters to inputParamsreviewGridMulti
         */
        for (let i = 1; i <= 10; i++) {
            this.inputParamsreviewGridMulti['ContactTypeCodeSelectValue' + i] = '';
            this.inputParamsreviewGridMulti['ContactTypeDetailCodeSelectValue' + i] = '';
            this.inputParamsreviewGridMulti['ContactStatusCodeSelectValue' + i] = '';
        }
    }

    public BuildGrid(params: any): void {
        //this.query = new URLSearchParams();
        if (params) {
            this.inputParams = params;
        }
        this.inputParams.module = this.urlParams.module;
        this.inputParams.method = this.urlParams.method;
        this.inputParams.operation = this.urlParams.operation;
        this.query.set('businessCode', this.utils.getBusinessCode());
        this.query.set('countryCode', this.utils.getCountryCode());
        this.query.set('RunningAs', 'Review');
        this.query.set('CallLogID', this.CallLogID);
        this.query.set('CustomerContactNumber', this.CustomerContactNumber);
        this.query.set('GroupAccountNumber', this.GroupAccountNumber);
        this.query.set('AccountNumber', this.AccountNumber);
        this.query.set('ContractNumber', this.ContractNumber);
        this.query.set('PremiseNumber', this.PremiseNumber);
        this.query.set('ServiceCoverNumber', this.ServiceCoverNumber);
        this.query.set('ProductCode', this.ProductCode);
        this.query.set('Postcode', this.PostCode);
        this.query.set('ContactName', this.SearchContactName);
        this.query.set('Filter', this.MyFilter);
        this.query.set('FilterPassed', this.MyFilterPassed);
        this.query.set('FilterDisputed', this.MyFilterDisputed);
        this.query.set('FilterLevel', this.MyFilterLevel);
        this.query.set('FilterValue', this.MyFilterValue);
        this.query.set('FilterEmployeeCode', this.MyFilterEmployeeCode);
        this.query.set('FilterTeamID', this.TeamID);
        this.query.set('LanguageCode', this.LanguageCode);
        this.query.set('BranchNumber', this.utils.getBranchCode());
        this.query.set('BranchServiceAreaCode', this.BranchServiceAreaCode);
        this.query.set('FilterBranchNumber', this.FilterBranchNumber);
        this.query.set('ProspectNumber', this.ProspectNumber);
        this.query.set('MyContactType', this.contactTypeDropdown);
        this.query.set('DateFilter', this.DateFilter);
        this.query.set('DateFrom', this.DateFrom);
        this.query.set('DateTo', this.DateTo);
        this.query.set('TicketReference', this.TicketReference);
        this.query.set('CompanyInvoiceNumber', this.CompanyInvoiceNumber);
        this.query.set('OnDisputeReference', this.OnDisputeReference);
        this.query.set('ContactTypeCodeValue1', this.ContactTypeCodeSelectValue1);
        this.query.set('ContactTypeDetailCodeValue1', this.ContactTypeDetailCodeSelectValue1);
        this.query.set('ContactStatusCodeValue1', this.ContactStatusCodeSelectValue1);
        this.query.set('ContactTypeCodeValue2', this.ContactTypeCodeSelectValue2);
        this.query.set('ContactTypeDetailCodeValue2', this.ContactTypeDetailCodeSelectValue2);
        this.query.set('ContactStatusCodeValue2', this.ContactStatusCodeSelectValue2);
        this.query.set('ContactTypeCodeValue3', this.ContactTypeCodeSelectValue3);
        this.query.set('ContactTypeDetailCodeValue3', this.ContactTypeDetailCodeSelectValue3);
        this.query.set('ContactStatusCodeValue3', this.ContactStatusCodeSelectValue3);
        this.query.set('ContactTypeCodeValue4', this.ContactTypeCodeSelectValue4);
        this.query.set('ContactTypeDetailCodeValue4', this.ContactTypeDetailCodeSelectValue4);
        this.query.set('ContactStatusCodeValue4', this.ContactStatusCodeSelectValue4);
        this.query.set('ContactTypeCodeValue5', this.ContactTypeCodeSelectValue5);
        this.query.set('ContactTypeDetailCodeValue5', this.ContactTypeDetailCodeSelectValue5);
        this.query.set('ContactStatusCodeValue5', this.ContactStatusCodeSelectValue5);
        this.query.set('ContactTypeCodeValue6', this.ContactTypeCodeSelectValue6);
        this.query.set('ContactTypeDetailCodeValue6', this.ContactTypeDetailCodeSelectValue6);
        this.query.set('ContactStatusCodeValue6', this.ContactStatusCodeSelectValue6);
        this.query.set('ContactTypeCodeValue7', this.ContactTypeCodeSelectValue7);
        this.query.set('ContactTypeDetailCodeValue7', this.ContactTypeDetailCodeSelectValue7);
        this.query.set('ContactStatusCodeValue7', this.ContactStatusCodeSelectValue7);
        this.query.set('ContactTypeCodeValue8', this.ContactTypeCodeSelectValue8);
        this.query.set('ContactTypeDetailCodeValue8', this.ContactTypeDetailCodeSelectValue8);
        this.query.set('ContactStatusCodeValue8', this.ContactStatusCodeSelectValue8);
        this.query.set('ContactTypeCodeValue9', this.ContactTypeCodeSelectValue9);
        this.query.set('ContactTypeDetailCodeValue9', this.ContactTypeDetailCodeSelectValue9);
        this.query.set('ContactStatusCodeValue9', this.ContactStatusCodeSelectValue9);
        this.query.set('ContactTypeCodeValue10', this.ContactTypeCodeSelectValue10);
        this.query.set('ContactTypeDetailCodeValue10', this.ContactTypeDetailCodeSelectValue10);
        this.query.set('ContactStatusCodeValue10', this.ContactStatusCodeSelectValue10);
        this.query.set('ReassignEmployeeCode', this.EmployeeCode);
        this.query.set('ReassignSelect', this.ReassignSelect);
        this.query.set('PageCurrent', this.currentPage.toString());
        this.query.set('PageSize', this.itemsPerPage.toString());
        this.query.set('Mode', this.inputParams.parentMode);
        this.query.set('riGridHandle', '1444390');
        this.query.set('action', '2');
        this.query.set(this.serviceConstants.GridHeaderClickedColumn, this.gridHeaderClickedColumn);
        this.query.set(this.serviceConstants.GridSortOrder, this.gridSortOrder);
        this.inputParams.search = this.query;
        this.callCentreReviewGrid.loadGridData(this.inputParams);
    }

    public getGridInfo(value: any): void {
        this.totalItems = value.totalRows;
    }
    public dblClickGridRow(data: any): void {
        let rowData = data.rowData;
        let cellIndex = data.cellIndex;
        let columnSected = data.columnClicked.text;
        if (cellIndex === 4) {
            let eventObj: any;
            eventObj = {
                data: {
                    rowID: ''
                }
            };
            eventObj.data.rowID = data.rowIndex;
            this.informationModal(eventObj);
        } else {
            switch (cellIndex) {
                case 0:
                    if (data.cellData.text !== '' && data.cellData.text !== '0')
                        this.router.navigate(['/ccm/callcentersearch'], { queryParams: { parentMode: 'CallCentreReview', SelectedCallLogID: data.cellData.text } });
                    break;
                case 1:
                    alert('Screen not available: iCABSCMCustomerContactMaintenance');
                    break;
                case 6:
                    alert('Screen not available: iCABSCMCustomerContactDetailGrid');
                    break;
                default:
                    if (columnSected.indexOf('O/S↵COs') > -1) { //CallOuts
                        if (data.cellData['rowID'] !== '1') {
                            alert('Screen not available: iCABSCMCallOutMaintenance');
                        }
                    }
                    break;
            }
        }
    }

    public informationModal(eventObj: any): void {
        let cellData: any;
        cellData = this.callCentreReviewGrid.getCellInfoForSelectedRow(eventObj.data.rowID, 2);
        let tooltipText = '<div class="raw-wrap">' + cellData.text + '</div>';
        if (cellData.toolTip) {
            tooltipText = '<div class="raw-wrap">' + cellData.text + '\n' + cellData.toolTip + '</div>';
        }
        this.showAlert(tooltipText);
    }

    public getCurrentPage(curPage: any): void {
        this.query.set('PageCurrent', curPage.value);
        this.inputParams.search = this.query;
        this.callCentreReviewGrid.loadGridData(this.inputParams);
    }

    public toDateSelectedValue(value: any): void {
        if (value)
            this.DateTo = value.value;
    }

    public fromDateSelectedValue(value: any): void {
        if (value) {
            this.DateFrom = value.value;
            this.toDate = this.globalizeService.parseDateToFixedFormat(value.value);
            this.toDate = new Date(new Date().setMonth(new Date(this.toDate).getMonth() + 4));
        }
    }

    public onSubmit(formdata: any, valid: any, event: any): void {
        event.preventDefault();
    }

    public resetFieldsAfterMultiSearch(): void {
        for (let i = 1; i <= 10; i++) {
            this['ContactTypeCodeSelectValue' + i] = '';
            this['ContactTypeDetailCodeSelectValue' + i] = '';
            this['ContactStatusCodeSelectValue' + i] = '';
        }
    }

    public onChange(eventobject: any, value: any): void {
        let selectedValue = '';
        switch (value) {
            case 'businessDropdown':
                selectedValue = this.businessDropdown;
                break;
            case 'contactType':
                selectedValue = this.contactTypeDropdown;
                if (selectedValue === 'complex') {
                    this.displayObj = {
                        spanComplexSearch: true,
                        spanStandardSearch: false
                    };
                    this.cmdComplexOnClick();
                } else {
                    this.displayObj = {
                        spanComplexSearch: false,
                        spanStandardSearch: true
                    };
                    this.resetFieldsAfterMultiSearch();
                    this.getContactStatusCodes(selectedValue);
                }
                break;
            case 'Myfilter':
                selectedValue = this.MyFilter;
                break;
            case 'MyFilterPassed':
                selectedValue = this.MyFilterPassed;
                break;
            case 'MyFilterDisputed':
                selectedValue = this.MyFilterDisputed;
                break;
            case 'MyFilterDisputed':
                selectedValue = this.MyFilterDisputed;
                break;
            case 'MyFilterLevel':
                selectedValue = this.MyFilterLevel;
                break;
            case 'MyFilterValue':
                selectedValue = this.MyFilterValue;
                this.getBranchDetails();
                switch (selectedValue) {
                    case 'me':
                    case 'myemployees':
                        this.displayFlag['FilterBranchNumber'] = false;
                        this.displayFlag['MyFilterEmployeeCode'] = false;
                        this.displayFlag['TeamID'] = false;
                        break;
                    case 'thisservbranch':
                    case 'thisbranch':
                        this.displayFlag['FilterBranchNumber'] = true;
                        this.displayFlag['MyFilterEmployeeCode'] = false;
                        this.displayFlag['TeamID'] = false;
                        break;
                    case 'thisemployee':
                        this.displayFlag['FilterBranchNumber'] = false;
                        this.displayFlag['MyFilterEmployeeCode'] = true;
                        this.displayFlag['TeamID'] = false;
                        break;
                    case 'thisteam':
                        this.displayFlag['FilterBranchNumber'] = false;
                        this.displayFlag['MyFilterEmployeeCode'] = false;
                        this.displayFlag['TeamID'] = true;
                        break;
                    default:
                        this.displayFlag['FilterBranchNumber'] = false;
                        this.displayFlag['MyFilterEmployeeCode'] = false;
                        this.displayFlag['TeamID'] = false;
                        break;
                }
                break;
            case 'ReassignSelect':
                selectedValue = this.ReassignSelect;
                switch (selectedValue) {
                    case 'All':
                    case 'AllReassigned':
                        this.displayFlag['EmployeeCode'] = false;
                        this.EmployeeCode = '';
                        break;
                    case 'ReassignedTo':
                    case 'ReassignedFrom':
                        this.displayFlag['EmployeeCode'] = true;
                        break;
                    default:
                        break;
                }
                break;
            case 'DateFilter':
                selectedValue = this.DateFilter;
                break;
            default:
                break;
        }
    }
    getRefreshData(): any {
        this.BuildGrid(this.inputParams);
    }

    public getContactStatusCodes(value: any): void {
        let search = new URLSearchParams();
        let formdata: Object = {};
        search.set('businessCode', this.utils.getBusinessCode());
        search.set('countryCode', this.utils.getCountryCode());
        search.set('action', '6');

        formdata['Function'] = 'GetContactStatusCodes';
        formdata['ContactTypeCode'] = value;
        this.httpService.xhrPost(
            this.urlParams.method,
            this.urlParams.module,
            this.urlParams.operation,
            search,
            formdata
        ).then((data) => {
            if (data.hasError) {
                this.errorService.emitError(data.errorMessage || data.fullError);
            } else {
                this.MyfilterList = [];
                let valArray = data.ContactStatusCodes ? data.ContactStatusCodes.split('^') : '';
                let descArray = data.ContactStatusDescs ? data.ContactStatusDescs.split('^') : '';
                if (valArray.length > 0) {
                    for (let i = 0; i < valArray.length; i++) {
                        this.MyfilterList.push({
                            value: valArray[i],
                            text: descArray[i]
                        });
                    }
                }
            }
        }).catch((error) => {
            this.errorService.emitError(error);
        });
    }

    public closeSection(newValue: boolean): void {
        if (this.collapsediv === newValue) {
            this.collapsediv = false;
        }
        else {
            this.collapsediv = newValue;
        }
    }

    private showAlert(msgTxt: string): void {
        this.messageModal.show({ msg: msgTxt, title: 'Contact Information' }, false);
    }


    public cmdComplexOnClick(): void {
        this.reviewGridMultiEllispsis.openModal();
    }
    public sortGrid(data: any): void {
        this.query.set(this.serviceConstants.GridHeaderClickedColumn, data.fieldname);
        this.gridHeaderClickedColumn = data.fieldname;
        this.query.set(this.serviceConstants.GridSortOrder, data.sort === 'DESC' ? 'Descending' : 'Ascending');
        this.gridSortOrder = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.BuildGrid(this.inputParams);
    }

    public clearDescription(name: any): void {
        switch (name) {
            case 'GroupAccountNumber':
                if (this.GroupAccountNumber.length === 0 || this.GroupAccountNumber === '')
                    this.GroupName = '';
                else this.GetGroupAccountName();
                break;
            case 'AccountNumber':
                if (this.AccountNumber.length === 0 || this.AccountNumber === '') {
                    this.zone.run(() => {
                        this.AccountNumber = '';
                        this.AccountName = '';
                        this.inputParamsContract = {
                            'parentMode': 'LookUp-All',
                            'pageTitle': 'Contract Entry',
                            'currentContractType': 'C',
                            'showAddNew': true,
                            'accountNumber': '',
                            'accountName': ''
                        };
                        if (this.contractSearchEllipse && this.contractSearchEllipse !== undefined)
                            this.contractSearchEllipse.updateComponent();
                    });
                }
                else {
                    this.AccountNumber = this.utils.numberPadding(this.AccountNumber, 9);
                    this.GetAccountName();
                }
                break;
            case 'ContractNumber':
                if (this.ContractNumber.length === 0 || this.ContractNumber === '')
                    this.ContractName = '';
                else {
                    this.ContractNumber = this.utils.numberPadding(this.ContractNumber, 8);
                    this.GetContractName();
                }
                break;
            case 'PremiseNumber':
                if (this.PremiseNumber.length === 0 || this.PremiseNumber === '')
                    this.PremiseName = '';
                else this.GetPremiseName();
                break;
            case 'ProductCode':
                if (this.ProductCode.length === 0 || this.ProductCode === '')
                    this.ProductDesc = '';
                else this.GetServiceCoverNumberFromRecord();
                break;
            default:
                break;
        }
    }

    public GetGroupAccountName(): void {
        let search = new URLSearchParams();
        search.set('businessCode', this.utils.getBusinessCode());
        search.set('countryCode', this.utils.getCountryCode());
        search.set('action', '0');
        search.set('Function', 'GetGroupName');
        search.set('groupAccountNumber', this.GroupAccountNumber);

        this.httpService.xhrGet(
            this.urlParams.method,
            this.urlParams.module,
            this.urlParams.operation,
            search
        ).then((data) => {
            if (data.hasOwnProperty('errorMessage') && data.errorMessage !== '') {
                this.GroupAccountNumber = '';
                this.GroupName = '';
                this.showAlert(data.errorMessage);
                this.formControlErrorFlag.GroupAccountNumber = true;
            } else {
                this.GroupName = data.GroupName;
                this.formControlErrorFlag.GroupAccountNumber = false;
            }
        });
    }

    public GetAccountName(): void {
        let search = new URLSearchParams();
        search.set('businessCode', this.utils.getBusinessCode());
        search.set('countryCode', this.utils.getCountryCode());
        search.set('action', '0');
        search.set('Function', 'GetAccountNameAndGroupAccountDetails');
        search.set('AccountNumber', this.AccountNumber);

        this.httpService.xhrGet(
            this.urlParams.method,
            this.urlParams.module,
            this.urlParams.operation,
            search
        ).then((data) => {
            if (data.hasOwnProperty('errorMessage') && data.errorMessage !== '') {
                this.AccountName = '';
                this.GroupAccountNumber = '';
                this.GroupName = '';
                this.showAlert(data.errorMessage);
                this.formControlErrorFlag.AccountNumber = true;
            } else {
                this.AccountName = data.AccountName;
                this.GroupAccountNumber = data.GroupAccountNumber;
                this.GroupName = data.GroupName;
                this.formControlErrorFlag.AccountNumber = false;
            }
        });
    }

    public GetContractName(): void {
        let lookupIP = [{
            'table': 'Contract',
            'query': {
                'BusinessCode': this.utils.getBusinessCode(),
                'ContractNumber': this.ContractNumber
            },
            'fields': ['ContractNumber', 'ContractName']
        }];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            let record = data[0];
            if (record.length > 0) {
                record = record[0];
                this.ContractName = record.ContractName;
                this.formControlErrorFlag.ContractNumber = false;
            } else {
                this.ContractNumber = '';
                this.ContractName = '';
                this.showAlert('Record Not Found');
                this.formControlErrorFlag.ContractNumber = true;
            };
        });
    }

    public GetPremiseName(): void {
        if (this.ContractNumber === '' || typeof this.ContractNumber === 'undefined') {
            this.showAlert('Record Not Found');
            return;
        };
        let lookupIP = [{
            'table': 'Premise',
            'query': {
                'BusinessCode': this.utils.getBusinessCode(),
                'ContractNumber': this.ContractNumber,
                'PremiseNumber': this.PremiseNumber
            },
            'fields': ['PremiseNumber', 'PremiseName']
        }];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            let record = data[0];
            if (record.length > 0) {
                record = record[0];
                this.PremiseName = record.PremiseName;
                this.formControlErrorFlag.PremiseNumber = false;
            } else {
                this.PremiseNumber = '';
                this.PremiseName = '';
                this.showAlert('Record Not Found');
                this.formControlErrorFlag.PremiseNumber = true;
            };
        });
    }

    public GetServiceCoverNumberFromRecord(): void {
        let search = new URLSearchParams();
        search.set('businessCode', this.utils.getBusinessCode());
        search.set('countryCode', this.utils.getCountryCode());
        search.set('action', '6');
        search.set('Function', 'GetServiceCoverFromRecord');
        search.set('ContractNumber', this.ContractNumber);
        search.set('PremiseNumber', this.PremiseNumber);
        search.set('ProductCode', this.ProductCode);

        this.httpService.xhrGet(
            this.urlParams.method,
            this.urlParams.module,
            this.urlParams.operation,
            search
        ).then((data) => {
            switch (data.ServiceCoverNumber) {
                case '-1':
                    //TODO
                    //this.ProductCode_search();
                    this.formControlErrorFlag.ProductCode = false;
                    this.GetServiceCoverNumberFromRowID();
                    break;
                case '0':
                    this.formControlErrorFlag.ProductCode = true;
                    break;
                default:
                    this.formControlErrorFlag.ProductCode = false;
                    this.ProductDesc = data.ProductDesc;
                    this.SetAllSCRowID(data.ServiceCoverRowID);
            }
        });
    }

    //TODO
    // Sub ProductCode_search
    //     If trim(ContractNumber.value) = "" Or PremiseNumber.value = "" Then
    //         riExchange.Mode = "": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=ContactManagement/iCABSCMPremiseSearch.htm"
    //         Call riExchange.ProcessDoEvents()   ' RT0096
    //         While riExchange.Busy
    //             Call riExchange.ProcessDoEvents()
    //         Wend
    //     End If
    //     riExchange.Mode = "LookUp": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAServiceCoverSearch.htm"
    // End Sub

    public GetServiceCoverNumberFromRowID(): void {
        let search = new URLSearchParams();
        search.set('businessCode', this.utils.getBusinessCode());
        search.set('countryCode', this.utils.getCountryCode());
        search.set('action', '6');
        search.set('Function', 'GetServiceCoverFromRowID');
        search.set('SCRowID', this.attrProductCodeSCRowID);

        this.httpService.xhrGet(
            this.urlParams.method,
            this.urlParams.module,
            this.urlParams.operation,
            search
        ).then((data) => {
            if (data.hasOwnProperty('errorMessage') && data.errorMessage !== '') {
                this.showAlert(data.errorMessage);
            } else {
                this.ServiceCoverNumber = data.ServiceCoverNumber;
                this.ProductDesc = data.ProductDesc;
                this.SetAllSCRowID(this.attrProductCodeSCRowID);
            }
        });
    }

    public onReviewGridMultiDataReceived(data: any): void {
        if (!data.isCancel) {
            for (let prop in data) {
                if (data.hasOwnProperty(prop)) {
                    if (this[prop] !== undefined) {
                        this[prop] = data[prop];
                    }
                    if (this.inputParamsreviewGridMulti[prop] !== undefined) {
                        this.inputParamsreviewGridMulti[prop] = data[prop];
                    }
                }
            }
        }
    }
}
