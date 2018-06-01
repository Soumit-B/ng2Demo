import * as moment from 'moment';
import { InternalGridSearchServiceModuleRoutes } from './../../../base/PageRoutes';
import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';
import { ScreenNotReadyComponent } from './../../../../shared/components/screenNotReady';
import { ModalModule } from 'ng2-bootstrap/ng2-bootstrap';
import { PremiseSearchComponent } from '../../search/iCABSAPremiseSearch';
import { Component, OnInit, ViewChild, OnDestroy, ErrorHandler } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Event, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Logger } from '@nsalaun/ng2-logger';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { ComponentInteractionService } from '../../../../shared/services/component-interaction.service';
import { HttpService } from './../../../../shared/services/http-service';
import { CCMRouteDefinitions } from './../../../customer-contact-management/ccm.route';
import { LocaleTranslationService } from './../../../../shared/services/translation.service';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { Utils } from '../../../../shared/services/utility';
import { LookUp } from './../../../../shared/services/lookup';
import { SysCharConstants } from './../../../../shared/constants/syscharservice.constant';
import { SpeedScript } from '../../../../shared/services/speedscript';
import { RiExchange } from '../../../../shared/services/riExchange';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../../shared/components/grid/grid';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { ContractManagementModuleRoutes } from '../../../base/PageRoutes';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSAContractServiceSummary.html'
})

export class ContractServiceSummaryComponent implements OnInit, OnDestroy {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('Grid') Grid: GridComponent;
    @ViewChild('GridPagination') GridPagination: PaginationComponent;
    @ViewChild('PremiseNumber') PremiseNumber;

    @ViewChild('premiseEllipsis') premiseEllipsis: EllipsisComponent;
    @ViewChild('telesalesEllipsis') telesalesEllipsis: EllipsisComponent;

    public premiseSearchComponent = PremiseSearchComponent;
    public telesalesOrderSearchComponent = ScreenNotReadyComponent;
    public inputParamsPremise = {};
    public inputParamsTelesalesOrderNumber = {};

    public currentPage: number = 1;
    public maxColumn: number = 14;
    public gridSortHeaders: Array<any> = [];
    public itemsPerPage: number = 10;
    public page: number = 1;
    public totalRecords: number = 0;
    public headerClicked: string = '';
    public sortType: string = 'ASC';
    public storeData: any;
    public backLinkText: string = '';
    public backLinkUrl: string = '';
    public queryLookUp: URLSearchParams = new URLSearchParams();

    private sub: Subscription;
    private subLookup: Subscription;
    private subSysChar: Subscription;
    private subXhr: Subscription;
    private subLookupContract: Subscription;
    private subLookupDetails: Subscription;
    private subXhrDesc: Subscription;
    public translateSub: Subscription;
    public storeSubscription: Subscription;

    private routeParams: any;

    constructor(
        private route: ActivatedRoute,
        private serviceConstants: ServiceConstants,
        private router: Router,
        private translate: LocaleTranslationService,
        private fb: FormBuilder,
        private utils: Utils,
        private logger: Logger,
        private LookUp: LookUp,
        private xhr: HttpService,
        private store: Store<any>,
        private sysCharConstants: SysCharConstants,
        private SpeedScript: SpeedScript,
        private riExchange: RiExchange,
        private location: Location,
        private componentInteractionService: ComponentInteractionService,
        private global: GlobalConstant
    ) {
        this.componentInteractionService.emitMessage(false);
        this.storeSubscription = store.select('contract').subscribe(data => {
            if (data) {
                this.storeData = data;
            }
        });
    }

    //Speedscript
    public vSCEnableServiceCoverDetail: boolean;
    public ReqDetail: boolean;
    public glAllowUserAuthView: boolean;
    public glAllowUserAuthUpdate: boolean;
    public glCompositesInUse: boolean;
    public CompositesInUse: boolean;
    public LineOfService: any;

    //Page Variables
    public xhrParams = {
        module: 'report',
        method: 'service-delivery/grid',
        operation: 'Application/iCABSAContractServiceSummary'
    };

    //Ui Fields
    public uiDisplay = {
        tdServiceDetail: true,
        tdAnnualValue: true,
        tdAnnualValueLab: true,
        tdTelesalesOrderLab: false,
        tdTelesalesOrder: false,
        ServiceCoverRowID: false,
        RunningReadOnly: false,
        vAllowUserAuthView: false,
        CallLogID: false,
        CurrentCallLogID: false
    };

    public negBranch = {
        params: {
            'parentMode': 'AddContractFromAccount',
            'pageTitle': 'Contract Entry',
            'pageHeader': 'Contract Maintenance',
            'currentContractType': 'C',
            'currentContractTypeURLParameter': '<contract>',
            'showAddNew': true
        },
        active: {
            id: '',
            text: ''
        },
        brnCode: 0,
        brnName: '',
        disabled: false,
        required: true
    };

    public StatusSearchTypeList = [];
    public uiForm: FormGroup;

    ngOnInit(): void {
        this.sub = this.route.queryParams.subscribe(
            (params: any) => {
                this.routeParams = params;
            }
        );
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.uiForm = this.fb.group({});
        this.initForm();
        this.riExchange.getStore('contract');
        this.translate.setUpTranslation();
        this.getSysCharDtetails();
    }

    ngOnDestroy(): void {
        if (this.sub) { this.sub.unsubscribe(); }
        if (this.subLookup) { this.subLookup.unsubscribe(); }
        if (this.subSysChar) { this.subSysChar.unsubscribe(); }
        if (this.subXhr) { this.subXhr.unsubscribe(); }
        if (this.subLookupContract) { this.subLookupContract.unsubscribe(); }
        if (this.subLookupDetails) { this.subLookupDetails.unsubscribe(); }
        if (this.subXhrDesc) { this.subXhrDesc.unsubscribe(); }
        if (this.storeSubscription) { this.storeSubscription.unsubscribe(); }
        this.riExchange.killStore();
    }

    ///////////////////////////////////////////////////////////////
    public validateProperties: Array<any> = [];
    public controls = [
        { name: 'ContractNumber', type: MntConst.eTypeCode },
        { name: 'ContractName', type: MntConst.eTypeText },
        { name: 'AccountNumber', type: MntConst.eTypeCode },
        { name: 'AccountName', type: MntConst.eTypeText },
        { name: 'ContractAnnualValue', type: MntConst.eTypeCurrency },
        { name: 'InvoiceFrequencyCode', type: MntConst.eTypeInteger },
        { name: 'InvoiceAnnivDate', type: MntConst.eTypeDate },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger },
        { name: 'PremiseName', type: MntConst.eTypeText },
        { name: 'TelesalesOrderNumber' },
        { name: 'StatusSearchType' },
        { name: 'LOSCodeSel' },
        { name: 'DetailInd' },
        { name: 'menu' },
        { name: 'ServiceCoverRowID' },
        { name: 'RunningReadOnly' },
        { name: 'vAllowUserAuthView' },
        { name: 'CallLogID' },
        { name: 'CurrentCallLogID' }
    ];

    private initForm(): void {
        for (let i = 0; i < this.controls.length; i++) {
            this.riExchange.riInputElement.Add(this.uiForm, this.controls[i].name);
        }
    }

    private window_onload(): void {
        //Load Business Code
        this.doLookup();

        let ContractObject = {
            type: this.routeParams.currentContractType,
            label: this.utils.getCurrentContractLabel(this.routeParams.currentContractType)
        };
        this.utils.setTitle(ContractObject.label + ' Contract Service Summary');

        this.riExchange.riInputElement.SetValue(this.uiForm, 'CallLogID', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'CurrentCallLogID'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CurrentCallLogID', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'CurrentCallLogID'));

        let ParentMode = this.riExchange.ParentMode(this.routeParams);
        switch (ParentMode) {
            case 'Inter-CompanyPortfolio':
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractNumber');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractName');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractAnnualValue');
                break;
            default:
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractNumber');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractName');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractAnnualValue');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'RunningReadOnly');
        }

        this.inputParamsPremise['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        this.inputParamsPremise['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
        this.inputParamsPremise['parentMode'] = 'LookUp';
        this.inputParamsPremise['CurrentContractTypeURLParameter'] = this.routeParams.currentContractType;

        this.GetContractFields();

        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractAnnualValue');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceFrequencyCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceAnnivDate');
        this.negBranch.disabled = true;
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'menu', 'Options');

        // If user does not have Full Access, Annual Values are hidden
        if (this.riExchange.ClientSideValues.Fetch('FullAccess') === 'Restricted' &&
            parseInt(this.riExchange.ClientSideValues.Fetch('BranchNumber'), 0) !== this.negBranch.brnCode) {
            this.uiDisplay.tdAnnualValue = false;
            this.uiDisplay.tdAnnualValueLab = false;
        } else {
            this.uiDisplay.tdAnnualValue = true;
            this.uiDisplay.tdAnnualValueLab = true;
        }

        this.riExchange.riInputElement.SetValue(this.uiForm, 'TelesalesOrderNumber', 0);
        this.iCABSTelesalesEntry();

        this.StatusSearchTypeList = [
            { value: '', label: 'All' },
            { value: 'L', label: 'Current' },
            { value: 'FL', label: 'Forward Current' },
            { value: 'D', label: 'Deleted' },
            { value: 'FD', label: 'Forward Deleted' },
            { value: 'PD', label: 'Pending Deletion' },
            { value: 'T', label: 'Terminated' },
            { value: 'FT', label: 'Forward Terminated' },
            { value: 'PT', label: 'Pending Termination' },
            { value: 'C', label: 'Cancelled' }
        ];
        this.uiForm.controls['StatusSearchType'].setValue(this.StatusSearchTypeList[0].value);

        this.applyGridFilter();
    }

    private doLookup(): any {
        //LookUp
        let lookupIP = [{
            'table': 'UserAuthority',
            'query': { 'BusinessCode': this.utils.getBusinessCode(), 'UserCode': this.utils.getUserCode() },
            'fields': ['AllowViewOfSensitiveInfoInd', 'AllowUpdateOfContractInfoInd']
        },
        {
            'table': 'ProductComponent',
            'query': { 'BusinessCode': this.utils.getBusinessCode() },
            'fields': ['ProductCode']
        },
        {
            'table': 'LineOfService',
            'query': { 'ValidForBusiness': this.utils.getBusinessCode() },
            'fields': ['LOSCode', 'LOSName']
        }];
        this.subLookup = this.LookUp.lookUpRecord(lookupIP, 100, this.storeData ? this.storeData['code'] : null).subscribe((data) => {
            //UserAuthority
            this.glAllowUserAuthView = false;
            this.glAllowUserAuthUpdate = false;
            let recordSet_UserAuthority = data[0];
            if (recordSet_UserAuthority.length > 0) {
                let record = recordSet_UserAuthority[0];
                this.glAllowUserAuthView = record.hasOwnProperty('AllowViewOfSensitiveInfoInd') ? record['AllowViewOfSensitiveInfoInd'] : false;
                this.glAllowUserAuthUpdate = record.hasOwnProperty('AllowUpdateOfContractInfoInd') ? record['AllowUpdateOfContractInfoInd'] : false;
            }
            //ProductComponent
            this.glCompositesInUse = false;
            let recordSet_ProductComponent = data[1];
            if (recordSet_ProductComponent.length > 0) {
                let record = recordSet_ProductComponent[0];
                this.glCompositesInUse = record.hasOwnProperty('ProductCode') ? true : false;
            }
            this.CompositesInUse = this.glCompositesInUse;

            //LineOfService
            this.LineOfService = [];
            let recordSet_LineOfService = data[2];
            if (recordSet_LineOfService.length > 0) {
                for (let j = 0; j < recordSet_LineOfService.length; j++) {
                    let record = recordSet_LineOfService[j];
                    //LOSCode & LOSName
                    if (record.hasOwnProperty('LOSCode')) {
                        this.LineOfService.push({ 'LOSCode': record['LOSCode'], 'LOSName': record['LOSName'] });
                    }
                }
            }

            this.riExchange.riInputElement.SetValue(this.uiForm, 'vAllowUserAuthView', this.glAllowUserAuthView);
            /*Load Grid Data*/
            this.loadGrid();
            if (this.glAllowUserAuthView) {
                this.uiDisplay.tdAnnualValueLab = true;
                this.uiDisplay.tdAnnualValue = true;
            }
            else {
                this.uiDisplay.tdAnnualValueLab = false;
                this.uiDisplay.tdAnnualValue = false;
            }
        });
    }

    private getSysCharDtetails(): any {
        //SysChar
        let sysCharList: number[] = [this.sysCharConstants.SystemCharEnableServiceCoverDetail];
        let sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.subSysChar = this.SpeedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records[0];
            this.vSCEnableServiceCoverDetail = record.Required;
            this.ReqDetail = record.Required;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DetailInd', this.ReqDetail);
            this.uiDisplay.tdServiceDetail = this.ReqDetail;
            this.window_onload();
        });
    }

    private iCABSTelesalesEntry(): any {
        let xhrParams = {};
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '6');
        search.set('Function', 'CheckIsTelesalesPSale');
        search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));

        this.subXhr = this.xhr.makeGetRequest(
            this.xhrParams.method,
            this.xhrParams.module,
            this.xhrParams.operation,
            search
        ).subscribe(
            (data) => {
                if (data.hasOwnProperty('TelesalesInd')) {
                    if (data.TelesalesInd === 'Y') {
                        this.uiDisplay.tdTelesalesOrder = true;
                        this.uiDisplay.tdTelesalesOrder = true;
                    }
                    else {
                        this.uiDisplay.tdTelesalesOrder = false;
                        this.uiDisplay.tdTelesalesOrder = false;
                    }
                }
            });
    }

    private GetContractFields(): void {
        let AccountNumber = '';
        let BusinessCode = '';
        let ContractNumber = '';
        let InvoiceAnnivDate = '';
        let InvoiceFrequencyCode = '';
        let NegBranchNumber = '';
        let AccountName = '';
        let BranchName = '';

        let lookupIP_contract = [{
            'table': 'Contract',
            'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') },
            'fields': ['BusinessCode', 'ContractNumber', 'AccountNumber', 'NegBranchNumber', 'InvoiceAnnivDate', 'InvoiceFrequencyCode']
        }];
        this.subLookupContract = this.LookUp.lookUpRecord(lookupIP_contract, 100, this.storeData ? this.storeData['code'] : null).subscribe((data) => {
            if (data.length > 0) {
                let resp = data[0];
                if (resp.length > 0) {
                    let record = resp[0];

                    AccountNumber = record.AccountNumber;
                    BusinessCode = record.BusinessCode;
                    ContractNumber = record.ContractNumber;
                    InvoiceAnnivDate = record.InvoiceAnnivDate;
                    InvoiceFrequencyCode = record.InvoiceFrequencyCode;
                    NegBranchNumber = record.NegBranchNumber;

                    if (InvoiceAnnivDate) {
                        if (moment(InvoiceAnnivDate, 'YYYY-MM-DD', true).isValid()) {
                            InvoiceAnnivDate = this.utils.formatDate(InvoiceAnnivDate);
                        }
                    }

                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceFrequencyCode', InvoiceFrequencyCode);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceAnnivDate', InvoiceAnnivDate);
                    this.negBranch.brnCode = parseInt(NegBranchNumber, 0);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', AccountNumber);

                    let lookupIP_details = [{
                        'table': 'Account',
                        'query': { 'AccountNumber': AccountNumber },
                        'fields': ['AccountNumber', 'AccountName']
                    },
                    {
                        'table': 'Branch',
                        'query': { 'BranchNumber': NegBranchNumber },
                        'fields': ['BranchNumber', 'BusinessCode', 'BranchName']
                    }];

                    this.subLookupDetails = this.LookUp.lookUpRecord(lookupIP_details, 100, this.storeData ? this.storeData['code'] : null).subscribe((data) => {
                        if (data.length > 0) {
                            let AcctDtls = data[0];
                            if (AcctDtls.length > 0) {
                                let acctRecord = AcctDtls[0];
                                AccountName = acctRecord.AccountName;
                            }

                            let BranchDtls = data[1];
                            if (BranchDtls.length > 0) {
                                let brnRecord = BranchDtls[0];
                                BranchName = brnRecord.BranchName;
                            }

                            this.riExchange.riInputElement.SetValue(this.uiForm, 'NegBranchName', BranchName);
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountName', AccountName);

                            this.negBranch.brnCode = parseInt(NegBranchNumber, 0);
                            this.negBranch.brnName = BranchName;
                            this.negBranch.active = {
                                id: '',
                                text: this.negBranch.brnCode + ' - ' + this.negBranch.brnName
                            };
                        }
                    });
                }
            }
        });
    }

    public loadGrid(): void {
        this.Grid.clearGridData();
        let search = new URLSearchParams();
        search.set(this.serviceConstants.Action, '2');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('FullAccess', this.riExchange.ClientSideValues.Fetch('FullAccess'));
        search.set('LoggedInBranch', this.riExchange.ClientSideValues.Fetch('BranchNumber'));
        search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        search.set('PortfolioStatusCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'StatusSearchType'));
        search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        search.set('DetailInd', (this.riExchange.riInputElement.GetValue(this.uiForm, 'DetailInd') ? 'True' : 'False'));
        search.set('Level', 'Contract');
        search.set('AllowUserAuthView', (this.riExchange.riInputElement.GetValue(this.uiForm, 'vAllowUserAuthView') ? 'True' : 'False'));
        search.set('LOSCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'LOSCodeSel'));
        search.set('TelesalesOrderNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'TelesalesOrderNumber'));
        search.set('LanguageCode', this.riExchange.LanguageCode());
        search.set('riGridMode', '0');
        search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        search.set('PageSize', this.global.AppConstants().tableConfig.itemsPerPage);
        search.set('PageCurrent', this.page.toString());
        search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClicked);
        search.set(this.serviceConstants.GridSortOrder, this.sortType);

        this.setMaxColCount();

        let gridIP = {
            method: this.xhrParams.method,
            operation: this.xhrParams.operation,
            module: this.xhrParams.module,
            search: search
        };
        this.Grid.loadGridData(gridIP);
        this.hideInputFields();
        this.fixGridWidth();
    }

    private colIndexProductCode = 1;
    private colIndexServiceCommenceDate = 4;
    private applyGridFilter(): void {
        let objProdCode = {
            'fieldName': 'ProductCode',
            'index': this.colIndexProductCode,
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objProdCode);
        let objCommenceDt = {
            'fieldName': 'ServiceCommenceDate',
            'index': this.colIndexServiceCommenceDate,
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objCommenceDt);
    }

    private constPremiseNumber = -1;
    private constProductCode = -1;
    private constServiceAnnualValue = -1;
    private constInformation = -1;
    private count = 0;

    private columsDetails: any[] = [];
    private AddColumn(parm1: any, parm2: any, parm3: any, parm4: any, parm5?: any, parm6?: any): void {
        switch (parm1) {
            case 'PremiseNumber':
                this.constPremiseNumber = this.count;
                break;
            case 'ProductCode':
                this.constProductCode = this.count;
                this.colIndexProductCode = this.count;
                break;
            case 'ServiceCommenceDate':
                this.colIndexServiceCommenceDate = this.count;
                break;
            case 'ServiceAnnualValue':
                this.constServiceAnnualValue = this.count;
                break;
            case 'Information':
                this.constInformation = this.count;
                break;
        }
        this.columsDetails.push({ p1: parm1, p2: parm2, p3: parm3, p4: parm4, p5: (parm5) ? parm5 : '', p6: (parm6) ? parm6 : '' });
        this.validateProperties.push({ name: parm1, type: MntConst[parm4], index: this.count });
        this.count++;
    }

    private setMaxColCount(): void {
        this.count = 0;
        let ParentMode = this.riExchange.ParentMode(this.routeParams);

        if (ParentMode === 'Contract' || ParentMode === 'Inter-CompanyPortfolio') {
            this.AddColumn('PremiseNumber', 'ContractServiceSummary', 'PremiseNumber', 'eTypeText', 5, true);
        }
        this.AddColumn('ProductCode', 'ContractServiceSummary', 'ProductCode', 'eTypeCode', 10, true);
        this.AddColumn('ProductDesc', 'ContractServiceSummary', 'ProductDesc', 'eTypeText', 40);
        if (this.CompositesInUse) {
            this.AddColumn('CompositeCode', 'PremiseServiceSummary', 'CompositeCode', 'eTypeText', 10);
        }
        this.AddColumn('ServiceCommenceDate', 'ContractServiceSummary', 'ServiceCommenceDate', 'eTypeDate', 10);
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'DetailInd')) {
            this.AddColumn('ProductDetailCode', 'ContractServiceSummary', 'ProductDetailCode', 'eTypeText', 5);
        }
        this.AddColumn('ServiceBranchNumber', 'ContractServiceSummary', 'ServiceBranchNumber', 'eTypeText', 1); //eTypeInteger
        this.AddColumn('ServiceAreaCode', 'ContractServiceSummary', 'ServiceAreaCode', 'eTypeCode', 1);
        this.AddColumn('ServiceQuantity', 'ContractServiceSummary', 'ServiceQuantity', 'eTypeText', 10); //eTypeInteger
        this.AddColumn('ServiceVisitFrequency', 'ContractServiceSummary', 'ServiceVisitFrequency', 'eTypeText', 3); //eTypeInteger
        this.AddColumn('ServiceAnnualValue', 'PremiseServiceSummary', 'ServiceAnnualValue', 'eTypeCurrency', 20, true);
        this.AddColumn('NextInvoiceStartDate', 'ContractServiceSummary', 'NextInvoiceStartDate', 'eTypeDate', 10);
        this.AddColumn('NextInvoiceEndDate', 'ContractServiceSummary', 'NextInvoiceEndDate', 'eTypeDate', 10);
        this.AddColumn('ServiceVisitAnnivDate', 'PremiseServiceSummary', 'ServiceVisitAnnivDate', 'eTypeDate', 10);
        this.AddColumn('TaxCode', 'ContractServiceSummary', 'TaxCode', 'eTypeCode', 5);
        if (!this.riExchange.riInputElement.GetValue(this.uiForm, 'StatusSearchType')) {
            this.AddColumn('Status', 'ContractServiceSummary', 'Status', 'eTypeText', 20);
        }
        this.AddColumn('Information', 'ContractServiceSummary', 'Information', 'eTypeImage', 2, true);
        this.AddColumn('LOSCode', 'ContractServiceSummary', 'LOSCode', 'eTypeCode', 2, false);

        this.maxColumn = this.count;
    }

    public onGridRowClick(data: any): void {
        let mode = '';
        mode = (data.cellIndex === this.constPremiseNumber) ? 'PremiseNumber' : mode;
        mode = (data.cellIndex === this.constProductCode) ? 'ProductCode' : mode;
        mode = (data.cellIndex === this.constServiceAnnualValue) ? 'ServiceAnnualValue' : mode;
        mode = (data.cellIndex === this.constInformation) ? 'Information' : mode;
        this.openPage(mode, data);
    }

    public refreshGrid(): void {
        this.currentPage = 1;
        this.headerClicked = '';
        this.loadGrid();
    }

    public sortGrid(obj: any): void {
        this.headerClicked = obj.fieldname;
        this.sortType = obj.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.loadGrid();
    }

    public menu_onchange(e: any): void {
        let selectedVal = this.riExchange.riInputElement.GetValue(this.uiForm, 'menu');
        switch (selectedVal) {
            case 'AddRecord':
                this.cmdAddRecord_onclick(e);
                break;
        }
    }

    /*## Clear Table Grid On Show Details Checkbox Click ##*/
    public showDetails_onclick(e: any): void {
        this.Grid.clearGridData();
    }

    public cmdAddRecord_onclick(e: any): void {
        let PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');

        if (PremiseNumber === '' || PremiseNumber === null) {
            this.PremiseNumber.nativeElement.focus();
        } else {
            this.openPage('ServiceCoverAdd');
        }
    }

    public PremiseNumber_onchange(event: any): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')) {
            this.PopulateDescriptions();
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
        }
    }

    public PopulateDescriptions(): void {
        let PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        let ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        if (PremiseNumber !== null && ContractNumber !== null) {
            let xhrParams = {};
            let search: URLSearchParams = new URLSearchParams();
            search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            search.set(this.serviceConstants.Action, '0');
            search.set('PostDesc', 'Premise');
            search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
            search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));

            this.subXhrDesc = this.xhr.makeGetRequest(
                this.xhrParams.method,
                this.xhrParams.module,
                this.xhrParams.operation,
                search
            ).subscribe(
                (data) => {
                    if (data.hasOwnProperty('PremiseName')) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data['PremiseName']);
                    }
                    /*Show error for invalid and non-integer PremiseNumber*/
                    else {
                        this.showAlert(data.errorMessage);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
                    }
                });
        } else {
            this.showAlert('Invalid PremiseNumber');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
        }
    }

    public onkeydown(event: any): void {
        event.preventDefault();
        if (event.keyCode === 34) {
            let pageID = event.target.id;
            switch (pageID) {
                case 'PremiseNumber':
                    this.openPage('PremiseNumberLookup');
                    break;
                case 'TelesalesOrderNumber':
                    this.openPage('TelesalesOrderNumber');
                    break;
            }
        }
    }

    private openPage(mode: string, data?: any): void {
        switch (mode) {
            case 'PremiseNumberLookup':
                this.premiseEllipsis.openModal();
                break;
            case 'TelesalesOrderNumber':
                this.telesalesEllipsis.openModal();
                break;
            case 'ProductCode':
                this.router.navigate([ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE], {
                    queryParams: {
                        parentMode: 'Search',
                        currentContractType: this.routeParams.currentContractType,
                        ServiceCoverRowID: data.cellData.additionalData
                    }
                });
                break;
            case 'ServiceCoverAdd':
                this.router.navigate([ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE], {
                    queryParams: {
                        parentMode: 'SearchAdd',
                        currentContractType: this.routeParams.currentContractType,
                        ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                        ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
                        PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                        PremiseName: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName'),
                        AccountNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber')
                    }
                });
                break;
            case 'Information':
                if (data.cellData.text) {
                    this.router.navigate(['/application/serviceSummaryDetail'], {
                        queryParams: {
                            parentMode: 'Contract',
                            currentContractType: this.routeParams.currentContractType,
                            ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                            PremiseNumber: data.trRowData[0].text,
                            ProductCode: data.trRowData[1].text,
                            ServiceCoverRowID: data.trRowData[1].additionalData
                        }
                    });
                }
                break;
            case 'PremiseNumber':
                this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
                    queryParams: {
                        parentMode: 'GridSearch',
                        currentContractType: this.routeParams.currentContractType,
                        ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                        // ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
                        PremiseNumber: (data.trRowData[0].text) ? data.trRowData[0].text : this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
                    }
                });
                break;
            case 'ServiceAnnualValue':
                this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSASERVICEVALUEGRID], {
                    queryParams: {
                        parentMode: 'Contract-ServiceSummary',
                        currentContractType: this.routeParams.currentContractType,
                        ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                        ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
                        PremiseNumber: data.trRowData[0].text,
                        ProductCode: data.trRowData[1].text,
                        ServiceCoverRowID: data.trRowData[1].additionalData
                    }
                });
                break;
        }
    }

    public onBackLinkClick(event: any): void {
        event.preventDefault();
        this.location.back();
    }

    public onSubmit(formObj: any, e: any): void {
        //No functionality required
    }

    public onBranchDataReceived(obj: any): void {
        //No functionality required as this field is always disabled
    }

    public getGridInfo(info: any): void {
        //this.totalRecords = info.totalPages;
        if (info.totalRows) {
            this.totalRecords = info.totalRows;
        }
    }

    public onPremiseDataReturn(obj: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', obj.PremiseNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', obj.PremiseName);
    }
    public onTelesalesOrderSearchDataReturn(obj: any): void {
        this.logger.log('Page not Ready yet', obj);
    }

    public getCurrentPage(obj: any): void {
        this.page = obj.value;
        this.loadGrid();
    }

    private showAlert(msgTxt: string): void {
        this.translateSub = this.translate.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                let translation = this.translate.getTranslatedValue(msgTxt, null);
                let translatedText = msgTxt;
                if (translation.value !== '') { translatedText = translation.value; }
                this.messageModal.show({ msg: translatedText, title: 'Error Message' }, false);
            }
        });
    }

    private hideInputFields(): void {
        setTimeout(() => {
            let elems = document.querySelectorAll(".form-control[drilldown|='false']");
            for (let i = 0; i < elems.length; i++) {
                if (!this.utils.hasClass(elems[i], 'hideinput')) {
                    this.utils.addClass(elems[i], 'hideinput');
                }
            }
        }, 2000);
    }

    private fixGridWidth(): void {
        setTimeout(() => {
            let elem = document.querySelectorAll('.gridtable  tr')[1];
            if (elem) {
                elem.children[this.constProductCode]['style']['width'] = '85px';
                elem.children[this.constInformation]['style']['width'] = '50px';
            }
        }, 1000);
    }
}


