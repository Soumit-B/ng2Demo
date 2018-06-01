import { Component, NgZone, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';

import { Store } from '@ngrx/store';
import { LocalStorageService } from 'ng2-webstorage';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { MaintenanceTypeGeneralComponent } from './tabs/maintenanceTypeGeneral';
import { MaintenanceTypePremiseComponent } from './tabs/maintenanceTypePremise';
import { MaintenanceTypeAccountComponent } from './tabs/maintenanceTypeAccount';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { HttpService } from '../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Utils } from '../../../shared/services/utility';
import { ErrorService } from '../../../shared/services/error.service';
import { TabsComponent } from '../../../shared/components/tabs/tabs';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { ActionTypes } from './../../actions/prospect';
import { DropdownStaticComponent } from '../../../shared/components/dropdown-static/dropdownstatic';
import { RiExchange } from './../../../shared/services/riExchange';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { MessageService } from '../../../shared/services/message.service';
import { PromptModalComponent } from '../../../shared/components/prompt-modal/prompt-modal';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { AccountPremiseSearchComponent } from '../../internal/grid-search/iCABSAAccountPremiseSearchGrid';
import { ProspectSearchComponent } from '../../internal/search/iCABSCMProspectSearch.component';
import { CBBService } from './../../../shared/services/cbb.service';
import { ContractManagementModuleRoutes } from './../../base/PageRoutes';
import { GlobalizeService } from './../../../shared/services/globalize.service';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { InternalGridSearchServiceModuleRoutes } from './../../base/PageRoutes';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    selector: 'icabs-prospect-maintenance',
    templateUrl: 'iCABSCMPipelineProspectMaintenance.html'
})

export class ProspectMaintenanceComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('topContainer') container: ElementRef;
    @ViewChild('tabProspect') tabProspect: TabsComponent;
    @ViewChild('MenuOptionDropdown') MenuOptionDropdown: DropdownStaticComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('contractSearchEllipsis') public contractSearchEllipsis: EllipsisComponent;
    @ViewChild('accountPremiseSearchEllipsis') public accountPremiseSearchEllipsis: EllipsisComponent;
    @ViewChild('premiseSearchEllipsis') public premiseSearchEllipsis: EllipsisComponent;
    @ViewChild('prospectSearchEllipsis') public prospectSearchEllipsis: EllipsisComponent;
    @ViewChild('prospectSearchCopyEllipsis') public prospectSearchCopyEllipsis: EllipsisComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('errorModal') public errorModal;

    private ajaxSubscription: Subscription;
    private fromEllipsis: boolean = false;
    private controlType: Object = {
        WOStartTime: MntConst.eTypeTime,
        WOEndTime: MntConst.eTypeTime,
        AnnualValue: MntConst.eTypeCurrency,
        EstimatedContractQuotes: MntConst.eTypeInteger,
        EstimatedJobQuotes: MntConst.eTypeInteger,
        EstimatedProductSaleQuotes: MntConst.eTypeInteger,
        EstimatedTotalQuotes: MntConst.eTypeInteger,
        EstimatedContractValue: MntConst.eTypeDecimal1,
        EstimatedJobValue: MntConst.eTypeDecimal1,
        EstimatedProductSaleValue: MntConst.eTypeDecimal1,
        EstimatedTotalValue: MntConst.eTypeDecimal1,
        ExpectedValue: MntConst.eTypeDecimal1,
        ExpectedJobValue: MntConst.eTypeDecimal1,
        ExpectedProductSaleValue: MntConst.eTypeDecimal1,
        ExpectedTotalValue: MntConst.eTypeDecimal1,
        DaysOld: MntConst.eTypeInteger,
        WODate: MntConst.eTypeDate,
        EstimatedClosedDate: MntConst.eTypeDate,
        ContractExpiryDate: MntConst.eTypeDate,
        CommenceDate: MntConst.eTypeDate,
        PremiseNumber: MntConst.eTypeInteger,
        ProspectNumber: MntConst.eTypeInteger
    };
    private businessSourceData: any;
    private ttBusiness: Array<any> = [{}];
    private prospectROWID: string = '';
    private defaultCode: any = {
        country: '',
        business: ''
    };
    private allFormControls: Array<any> = [];
    private pageId: string = PageIdentifier.ICABSCMPIPELINEPROSPECTMAINTENANCE;

    public pageTitle = 'Prospect Entry';
    public maintenanceProspectSearchFormGroup: FormGroup;
    public isRequesting = false;
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public querySysChar: URLSearchParams = new URLSearchParams();
    public queryLookUp: URLSearchParams = new URLSearchParams();
    public queryParam: URLSearchParams = new URLSearchParams();
    public showMessageHeader: boolean = true;
    public premiseSearchComponent: Component = PremiseSearchComponent;
    public premiseAccountSearchComponent: Component = AccountPremiseSearchComponent;
    public prospectDisabled: boolean = false;
    public inputParamsPremise: any = {
        'parentMode': 'PipelineProspect',
        'pageTitle': 'Premise'
    };
    public inputParamsPremiseAccount: any = {
        'parentMode': 'Prospect',
        'pageTitle': 'Premise'
    };

    public menuOptions: Array<any> = [{}];
    public showHeader: boolean = true;
    public modalTitle: string = '';
    public storeData: any = {};
    public componentInteractionSubscription: Subscription;
    public showPromptMessageHeader: boolean = true;
    public promptConfirmTitle: string = '';
    public promptConfirmContent: any;
    public functionPermission: any = {
        FunctionAdd: false,
        FunctionDelete: false,
        FunctionSnapShot: false,
        DisplayMessages: false,
        FunctionUpdate: false,
        addMode: false,
        fetchMode: true,
        RowID: ''
    };

    public customBusinessObject: any = {
        Select: false,
        Confirm: false,
        Insert: false,
        Update: false,
        Delete: false,
        Enable: false,
        Copy: false
    };
    public fieldVisibility: any = {
        'isHiddenAccountNumber': false,
        'isHiddenContractNumber': false,
        'isHiddenPremiseNumber': false
    };
    public tabs: Array<any> = [
        { title: 'Premises', active: true },
        { title: 'General', disabled: false },
        { title: 'Account', removable: false }

    ];
    public autoOpen: any = '';
    public autoOpenSearch: boolean = false;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public contractSearchParams: any = {
        'parentMode': 'ProspectPipeline',
        'currentContractType': 'C',
        'currentContractTypeURLParameter': '<contract>',
        'showAddNew': false
    };
    public fieldRequired: any = {
        'LOSCodeSelect': true,
        'PremiseName': false,
        'PremiseAddressLine1': false,
        'PremiseAddressLine2': false,
        'PremiseAddressLine3': false
    };
    public searchModalRoute: string = '';
    public searchPageRoute: string = '';
    public showCloseButton: boolean = true;
    public contractSearchComponent = ContractSearchComponent;
    public accountSearchComponent = AccountSearchComponent;
    public prospectSearchComponent = ProspectSearchComponent;
    public inputParamsAccount: any = {
        'parentMode': 'ExistingAccountPipelineSearch',
        'showAddNewDisplay': false
    };
    public autoOpenProspectSearch: boolean = false;
    public inputParamsProspect: any = {
        'parentMode': 'Search',
        'showAddNew': true,
        'countryCode': this.utils.getCountryCode(),
        'businessCode': this.utils.getBusinessCode(),
        'showCountryCode': false,
        'showBusinessCode': false,
        'vAddURLParam': ''
    };
    public inputParamsCopyProspect: any = {
        'parentMode': 'ProspectAddCopy',
        'showAddNew': false,
        'countryCode': this.utils.getCountryCode(),
        'businessCode': this.utils.getBusinessCode(),
        'showCountryCode': false,
        'showBusinessCode': false,
        'vAddURLParam': ''
    };
    public isAccountRequired: boolean = false;
    public isContractNumberRequired: boolean = false;
    public queryParamsProspect: any = {
        action: '0',
        operation: 'ContactManagement/iCABSCMPipelineProspectMaintenance',
        module: 'prospect',
        method: 'prospect-to-contract/maintenance',
        contentType: 'application/x-www-form-urlencoded',
        branchNumber: '',
        branchName: ''
    };

    public systemChars: any = {
        vSCEnableAddressLine3: true,
        vSCEnableAddressLine3Required: false,
        vSCEnableHopewiserPAF: true,
        vSCEnableDatabasePAF: true,
        vSCAddressLine4Required: true,
        vSCAddressLine5Required: true,
        vSCAddressLine5Logical: true,
        vSCPostCodeRequired: true,
        vSCPostCodeMustExistInPAF: true,
        vSCRunPAFSearchOn1stAddressLine: true,
        vSCEnableMaxAddressValue: true,
        vSCDisableQuoteDetsOnAddProspect: true,
        vSCBusinessOriginMandatory: true,
        vSCCustomerTypeMandatory: true,
        vSCHideContactMediumCode: true,
        vSCEnablePostcodeDefaulting: true,
        vSCMaxQuotesNumberInd: true,
        vSCMaxQuotesValueInd: true,
        vSICCodeEnable: true,
        vSCEnableValidatePostcodeSuburb: true,
        cQuoteNumberWarningMessage: '',
        cQuoteValueWarningMessage: '',
        vSCMaxQuotesNumber: 0,
        vSCMaxQuotesValue: 0,
        vDefaultProspectOriginCode: '',
        vProductSaleInUse: '',
        glSalesEmployee: '',
        vEnterWORefsList: '',
        gcDefaultSourceCode: '',
        vLocalSystemInd: false,
        vSCCapitalFirstLtr: false,
        vAddURLParam: '',
        currentURL: window.location.href,
        ErrorMessageDesc: '',
        ProspectTypeDesc: '',
        NegBranchNumber: '',
        ServiceBranchNumber: '',
        SalesBranchNumber: '',
        LoggedInBranchNumber: '',
        ContactTypeCode: '',
        CallLogID: '',
        FromCustomerContactNumber: '',
        ContactTypeDetailCode: '',
        LocalSystemInd: '',
        DefaultAssigneeEmployeeCode: '',
        ContactRedirectionUniqueID: '',
        BusinessSourceCode: '',
        BusinessOriginCode: '',
        BusinessOriginDetailCode: '',
        BusinessOriginDetailRequiredList: '',
        BusinessOriginLeadInd: '',
        WindowClosingName: '',
        CallNotepadSummary: '',
        CallTicketReference: '',
        LOSCode: '',
        routeParams: {},
        sCDisableQuoteDetsOnAddProspect: true,
        saveElement: {},
        modalComp: {},
        customBusinessObject: {},
        updateOrigin: false
    };

    public fieldDisable = {
        cancel: false,
        copy: true,
        optionDisable: false,
        save: false
    };

    public ellipsisDisable: any = {
        accountEllipsisDisabled: false,
        contractNumberEllipsis: false,
        premiseEllipsis: false,
        premiseAccountSearchEllipsis: false
    };

    public storeSubscription: Subscription;
    public vAddURLParam: string = '';
    public componentList: Array<any> = [MaintenanceTypePremiseComponent, MaintenanceTypeGeneralComponent,
        MaintenanceTypeAccountComponent];

    constructor(private _router: Router,
        private ls: LocalStorageService,
        private _componentInteractionService: ComponentInteractionService,
        private httpService: HttpService,
        private serviceConstants: ServiceConstants,
        private errorService: ErrorService,
        private globalize: GlobalizeService,
        private utils: Utils,
        private errorMessage: ErrorConstant,
        private ajaxconstant: AjaxObservableConstant,
        private store: Store<any>,
        private fb: FormBuilder,
        private systemCharacterConstant: SysCharConstants,
        private zone: NgZone,
        private activatedRoute: ActivatedRoute,
        private titleService: Title,
        private riExchange: RiExchange,
        private el: ElementRef,
        private serviceConstant: ServiceConstants,
        private messageService: MessageService,
        public cbbService: CBBService,
        private _zone: NgZone, private translateService: LocaleTranslationService,
        private routeAwayGlobals: RouteAwayGlobals) {

        this.storeData = {
            systemChars: this.systemChars,
            ttBusiness: this.ttBusiness
        };
        this.storeSubscription = store.select('prospect').subscribe((data) => {
            if (data['action']) {
                if (data['action'].toString() === ActionTypes.FORM_CONTROLS) {
                    this.allFormControls.push(data['data']);
                }
            }

        });
        this._componentInteractionService.emitMessage(true);
        activatedRoute.queryParams.subscribe(
            (param: any) => {
                let currentURL = window.location.href;
                if (currentURL.match(new RegExp('Prospect', 'i'))) {
                    this.vAddURLParam = 'ProspectExistAcct';
                }
                if (currentURL.match(new RegExp('NatAxJob', 'i'))) {
                    this.vAddURLParam = 'NatAxJob';
                }
                if (currentURL.match(new RegExp('Confirm', 'i'))) {
                    this.vAddURLParam = 'Confirm';
                }
                this.inputParamsProspect.vAddURLParam = this.vAddURLParam;
                if (param)
                    this.systemChars.routeParams = param;
            });

        this.maintenanceProspectSearchFormGroup = this.fb.group({
            ProspectNumber: [{ value: '', disabled: false }],
            AccountNumber: [{ value: '', disabled: false }],
            ContractNumber: [{ value: '', disabled: false }],
            PremiseNumber: [{ value: '', disabled: false }]
        });
        this.ajaxSource$ = this.ajaxSource.asObservable();
        // Ajax Subscription For Spinner
        this.ajaxSubscription = this.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                switch (event) {
                    case this.ajaxconstant.START:
                        this.isRequesting = true;
                        break;
                    case this.ajaxconstant.COMPLETE:
                        this.isRequesting = false;
                        break;
                }
            }
        });

    }

    ngOnInit(): void {
        this.translateService.setUpTranslation();
        if (this.ls.retrieve(this.pageId + 'isReturningFlag') && this.ls.retrieve(this.pageId + 'isReturningFlag') === 'True') {
            this.systemChars.routeParams = this.ls.retrieve(this.pageId + 'routeParams');
            this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].setValue(this.ls.retrieve(this.pageId + 'ProspectNumber'));
            this.autoOpenProspectSearch = false;
            this.customBusinessObject.Update = true;
            this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
            this.ls.clear(this.pageId + 'routeParams');
            this.ls.clear(this.pageId + 'ProspectNumber');
        } else {
            this.ls.clear(this.pageId + 'routeParams');
            this.ls.clear(this.pageId + 'ProspectNumber');
            this.ls.clear(this.pageId + 'isReturningFlag');
            this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].setValue('');
        }
        this.loadSystemChars();
        this.getBusinessSource();
        this.updateStoreControl(ActionTypes.PARENT_FORM);
        this.routeAwayGlobals.setDirtyFlag(true); //CR implementation
        setTimeout(() => {
            this.cbbService.disableComponent(true);
        }, 400);

    }

    ngAfterViewInit(): void {
        let child = this.container.nativeElement.getElementsByClassName('form-item');
        let count = 0;
        if (!(this.ls.retrieve(this.pageId + 'isReturningFlag') && this.ls.retrieve(this.pageId + 'isReturningFlag') === 'True')) {
            this.autoOpenProspectSearch = true;
        }
        for (let i = 0; i < child.length; i++) {
            if (!child[i].classList.contains('hidden')) {
                count++;
                if (((count) % 3 === 0) && count >= 3) {

                    if ((i + 1) < child.length)
                        child[i + 1].className += ' clear';
                }
            }
        }
        this.setUI();
        this.utils.setTitle(this.pageTitle);
    }

    ngOnDestroy(): void {
        this.routeAwayGlobals.resetRouteAwayFlags(); //CR implementation
        if (this.componentInteractionSubscription)
            this.componentInteractionSubscription.unsubscribe();
    }

    /**
     * Method to get system characters for ProspectMaintenance
     * @params field- systemchars variables looking for  and type- L,R,I
     */
    public fetchSysChar(sysCharNumbers: any): any {
        this.querySysChar.set(this.serviceConstants.Action, '0');

        if (this.utils.getBusinessCode()) {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        } else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
        }
        if (this.utils.getCountryCode()) {
            this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        } else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.defaultCode.country);
        }
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    }
    /**
     * Method loads all systemchars on page load
     */
    public loadSystemChars(): void {
        let sysCharList = [
            this.systemCharacterConstant.SystemCharEnableAddressLine3,
            this.systemCharacterConstant.SystemCharEnableHopewiserPAF,
            this.systemCharacterConstant.SystemCharEnableDatabasePAF,
            this.systemCharacterConstant.SystemCharAddressLine4Required,
            this.systemCharacterConstant.SystemCharAddressLine5Required,
            this.systemCharacterConstant.SystemCharPostCodeRequired,
            this.systemCharacterConstant.SystemCharPostCodeMustExistinPAF,
            this.systemCharacterConstant.SystemCharRunPAFSearchOnFirstAddressLine,
            this.systemCharacterConstant.SystemCharMaximumAddressLength,
            this.systemCharacterConstant.SystemCharDisableQuoteDetailsOnAddProspect,
            this.systemCharacterConstant.SystemCharProspectEntryBusinessOriginMand,
            this.systemCharacterConstant.SystemCharProspectEntryCustomerTypeMand,
            this.systemCharacterConstant.SystemChar_HideContactMediumInProspectEntry,
            this.systemCharacterConstant.SystemCharEnablePostcodeDefaulting,
            this.systemCharacterConstant.SystemCharProspectEntryMaxQuotesBeforeWarning,
            this.systemCharacterConstant.SystemCharProspectEntryMaxValueBeforeWarning,
            this.systemCharacterConstant.SystemCharShowSICCodeOnPremise,
            this.systemCharacterConstant.SystemCharEnableValidatePostcodeSuburb,
            this.systemCharacterConstant.SystemCharDisableFirstCapitalOnAddressContact
        ];
        let sysNumbers = sysCharList.join(',');
        let dataParam = [{
            'table': 'riRegistry',
            'query': { 'regSection': 'Sales Order Processing', 'regKey': 'Central/Local', regValue: 'Local' },
            'fields': ['regValue']
        },
        {
            'table': 'ProductExpense',
            'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ContractTypeCode': 'P' },
            'fields': ['BusinessCode']
        },
        {
            'table': 'riRegistry',
            'query': { 'regSection': 'Prospect Defaults', 'regKey': this.utils.getBusinessCode() + '"_Default ProspectOrigin"' },
            'fields': ['regValue']
        }, {
            'table': 'ContactMedium',
            'query': {},
            'fields': ['WOTypeCode', 'ContactMediumCode']
        }, {
            'table': 'Employee',
            'query': { 'BusinessCode': this.utils.getBusinessCode(), 'UserCode': this.utils.getUserCode() },
            'fields': ['OccupationCode']
        }];
        let observableBatch = [this.lookUpRecord(dataParam, 0), this.fetchSysChar(sysNumbers)];
        Observable.forkJoin(
            observableBatch).subscribe((data) => {
                this.setSystemChars(data[1]);
                this.setAdditionalVariables(data[0]['results']);
                this.systemChars.customBusinessObject = this.customBusinessObject;
                this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
            });
    }

    /**
     * Set all system variables after service call
     */

    private setSystemChars(sysData: any): void {
        if (sysData.records && sysData.records.length > 0) {
            this.systemChars['vSCEnableAddressLine3'] = sysData.records[0].Required;
            this.systemChars['vSCEnableAddressLine3Required'] = sysData.records[0].Logical;
            this.systemChars['vSCEnableHopewiserPAF'] = sysData.records[1].Required;
            this.systemChars['vSCEnableDatabasePAF'] = sysData.records[2].Required;
            this.systemChars['vSCAddressLine4Required'] = sysData.records[3].Required;
            this.systemChars['vSCAddressLine5Required'] = sysData.records[4].Required;
            this.systemChars['vSCAddressLine5Logical'] = sysData.records[4].Logical;
            this.systemChars['vSCPostCodeRequired'] = sysData.records[5].Required;
            this.systemChars['vSCPostCodeMustExistInPAF'] = sysData.records[6].Required;
            this.systemChars['vSCRunPAFSearchOn1stAddressLine'] = sysData.records[7].Required;
            this.systemChars['vSCEnableMaxAddressValue'] = sysData.records[8].Integer;
            this.systemChars['vSCDisableQuoteDetsOnAddProspect'] = sysData.records[9].Required;
            this.systemChars['vSCBusinessOriginMandatory'] = sysData.records[10].Required;
            this.systemChars['vSCCustomerTypeMandatory'] = sysData.records[11].Required;
            this.systemChars['vSCHideContactMediumCode'] = sysData.records[12].Required;
            this.systemChars['vSCEnablePostcodeDefaulting'] = sysData.records[13].Required;
            this.systemChars['vSCMaxQuotesNumberInd'] = sysData.records[14].Required;
            this.systemChars['vSCMaxQuotesValueInd'] = sysData.records[15].Required;
            this.systemChars['vSCMaxQuotesNumber'] = sysData.records[14].Integer;
            this.systemChars['vSCMaxQuotesValue'] = sysData.records[15].Integer;
            this.systemChars['vSICCodeEnable'] = sysData.records[16].Required;
            this.systemChars['vSCEnableValidatePostcodeSuburb'] = sysData.records[17].Logical;
            this.systemChars['vSCCapitalFirstLtr'] = sysData.records[18].Required;
        }

    }

    /**
     * Set some variables after service call
     */

    private setAdditionalVariables(otherData: any): void {
        if (!this.systemChars.vSCMaxQuotesNumberInd) {
            this.systemChars.vSCMaxQuotesNumber = 0;
        }

        if (!this.systemChars.vSCMaxQuotesValueInd) {
            this.systemChars.vSCMaxQuotesValue = 0;
        }

        if ((otherData[4] && otherData[4].length.length > 0)) {
            this.getOccupation(otherData[4][0].OccupationCode);
        }

        if ((otherData[1] && otherData[1].length.length > 0)) {
            this.systemChars.vProductSaleInUse = true;
        }


        if ((otherData[0] && otherData[0].length.length > 0)) {
            this.systemChars['vLocalSystemInd'] = true;
        }
        this.systemChars.vEnterWORefsList = '';
        if ((otherData[3] && otherData[3].length > 0)) {
            for (let ctm of otherData[3]) {
                if (ctm.WOTypeCode) {
                    this.systemChars.vEnterWORefsList += '#' + ctm.ContactMediumCode.toLowerCase() + '#';
                }
            }
        }
        this.systemChars['vDefaultProspectOriginCode'] = '';
        if ((otherData[2] && otherData[2].length.length > 0)) {
            this.systemChars['vDefaultProspectOriginCode'] = otherData[2][0].regValue;
        }
        this.getWarningMessageA();
        this.getWarningMessageB();
    }
    /**
     * Get employee occupation
     */
    public getOccupation(occupation: string): any {
        let data = [{
            'table': 'Employee',
            'query': { 'OccupationCode': occupation },
            'fields': ['SalesEmployeeInd']
        }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe((e) => {
            if (e && e.results.length > 0) {
                this.systemChars['glSalesEmployee'] = true;
                this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
            }
        });
    }

    /**
     * Get WarningMessage
     */
    public getWarningMessageA(): any {
        let data = [{
            'table': 'ErrorMessageLanguage',
            'query': { 'LanguageCode': this.utils.getDefaultLang(), 'ErrorMessageCode': 2822 },
            'fields': ['ErrorMessageDisplayDescription']
        }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe((e) => {
            if (e && e.results[0].length > 0) {
                this.systemChars.cQuoteNumberWarningMessage = e.results[0][0].ErrorMessageDisplayDescription;
                this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
            } else {
                this.getWarningMessage(2822, 'a');
            }
        });
    }

    /**
     * Get WarningMessage
     */
    public getWarningMessageB(): any {
        let data = [{
            'table': 'ErrorMessageLanguage',
            'query': { 'LanguageCode': this.utils.getDefaultLang(), 'ErrorMessageCode': 2823 },
            'fields': ['ErrorMessageDisplayDescription']
        }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe((e) => {
            if (e && e.results[0].length > 0) {
                this.systemChars.cQuoteNumberWarningMessage = e.results[0][0].ErrorMessageDisplayDescription;
                this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
            } else {
                this.getWarningMessage(2823, 'b');
            }
        });
    }

    /**
     * Get WarningMessage
     */
    public getWarningMessage(ecode: any, f: string): any {
        let data = [{
            'table': 'ErrorMessage',
            'query': { 'ErrorMessageCode': ecode },
            'fields': ['ErrorMessageDescription']
        }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe((e) => {
            if (e && e.results.length > 0) {
                if (f === 'a')
                    this.systemChars.cQuoteNumberWarningMessage = e.results[0][0].ErrorMessageDescription;
                else if (f === 'b')
                    this.systemChars.cQuoteValueWarningMessage = e.results[0][0].ErrorMessageDescription;
            }
            this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
        });
    }

    /**
     * Get employee occupation
     */
    public getEmployeeName(empcode: string, empField: string): any {
        let data = [{
            'table': 'Employee',
            'query': { 'EmployeeCode': empcode, 'BusinessCode': this.utils.getBusinessCode() },
            'fields': ['EmployeeSurname']
        }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe((e) => {
            if (e && e.results.length > 0) {
                if (e.results[0][0])
                    this.allFormControls[0]['formPremise'].controls[empField].setValue(e.results[0][0].EmployeeSurname);
            }
        });
    }

    /**
     * Get Prospect status
     */
    public getStatusDesc(): void {
        let data = [{
            'table': 'ProspectStatusLang',
            'query': { 'ProspectStatusCode': this.allFormControls[1]['formGeneral'].controls['ProspectStatusCode'].value },
            'fields': ['ProspectStatusDesc']
        }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe((e) => {
            if (e.results[0][0])
                this.allFormControls[1]['formGeneral'].controls['ProspectStatusDesc'].setValue(e.results[0][0].ProspectStatusDesc);
        });
    }


    public getContactMediumDesc(): void {
        let data = [{
            'table': 'ContactMediumLang',
            'query': { 'ContactMediumCode': this.allFormControls[0]['formPremise'].controls['ContactMediumCode'].value },
            'fields': ['ContactMediumDesc']
        }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe((e) => {
            if (e.results[0][0])
                this.allFormControls[0]['formPremise'].controls['ContactMediumDesc'].setValue(e.results[0][0].ContactMediumDesc);
        });
    }


    public getCustomerTypeDesc(): void {
        let data = [{
            'table': 'CustomerTypeLanguage',
            'query': { 'CustomerTypeCode': this.allFormControls[1]['formGeneral'].controls['CustomerTypeCode'].value },
            'fields': ['CustomerTypeDesc']
        }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe((e) => {
            if (e.results[0][0])
                this.allFormControls[1]['formGeneral'].controls['CustomerTypeDesc'].setValue(e.results[0][0].CustomerTypeDesc);
        });
    }

    /**
     * Get  SICDescription
     */
    public getSICDescription(): void {
        let data = [{
            'table': 'SICCodeLang',
            'query': { 'SICCode': this.allFormControls[1]['formGeneral'].controls['SICCode'].value, 'BusinessCode': this.utils.getBusinessCode() },
            'fields': ['SICDescription']
        }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe((e) => {
            if (e.results[0][0])
                this.allFormControls[1]['formGeneral'].controls['SICDescription'].setValue(e.results[0][0].SICDescription);
        });
    }


    public getPaymentType(): void {
        let data = [{
            'table': 'PaymentType',
            'query': { 'PaymentTypeCode': this.allFormControls[0]['formPremise'].controls['PaymentTypeCode'].value },
            'fields': ['PaymentDesc']
        }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe((e) => {
            if (e.results[0][0])
                this.allFormControls[0]['formPremise'].controls['PaymentDesc'].setValue(e.results[0][0].ContactMediumDesc);
        });
    }

    /**
     * Get  Branch
     */
    public getBranch(): void {
        let data = [{
            'table': 'Branch',
            'query': { 'BranchNumber': this.allFormControls[0]['formPremise'].controls['BranchNumber'].value },
            'fields': ['BranchName']
        }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe((e) => {
            if (e.results[0][0])
                this.allFormControls[0]['formPremise'].controls['BranchName'].setValue(e.results[0][0].BranchName);
        });
    }

    /**
     * Get  BusinessSource data
     */
    public getBusinessSource(): void {
        let data = [{
            'table': 'BusinessSource',
            'query': { 'BusinessCode': this.utils.getBusinessCode() },
            'fields': ['BusinessCode', 'BusinessSourceCode', 'BusinessSourceSystemDesc', 'SalesDefaultInd']
        }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(
            (e) => {
                try {

                    if ((e.results[0].length && e.results[0].length > 0)) {
                        this.ttBusiness = [];
                        this.businessSourceData = e.results[0];
                    }
                    for (let ls of this.businessSourceData) {
                        let newOption = { 'text': ls['BusinessSourceSystemDesc'], 'value': ls['BusinessSourceCode'] };
                        this.ttBusiness.push(newOption);
                    }
                    this.updateStore('ttBusiness', this.ttBusiness);
                    this.saveStore(ActionTypes.CONTROL_DEFAULT_VALUE);
                    this.createttBusiness();

                } catch (err) {
                    //this.errorService.emitError(err);
                }
            });

    }


    /**
     * Get  BusinessSourceLang data
     */
    public getBusinessSourceLang(businessRow: any, index: number): void {
        let data = [{
            'table': 'BusinessSourceLang',
            'query': { 'BusinessCode': businessRow.BusinessCode, 'BusinessSourceCode': businessRow.BusinessSourceCode, 'LanguageCode': this.utils.getDefaultLang() },
            'fields': ['BusinessSourceDesc']
        }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(
            (e) => {
                try {
                    if (e.results[0][0].BusinessSourceDesc) {
                        this.ttBusiness[index].text = e.results[0][0].BusinessSourceDesc;
                        this.updateStore('ttBusiness', this.ttBusiness);
                        this.saveStore(ActionTypes.CONTROL_DEFAULT_VALUE);
                    }
                } catch (err) {
                    //this.errorService.emitError(err);
                }
            });

    }


    /**
     * Generic method to call look up service
     */

    public lookUpRecord(data: any, maxresults: any): any {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    }

    // Create ttBusiness from business data

    private createttBusiness(): void {
        let index = 0;
        this.systemChars['gcDefaultSourceCode'] = '';
        for (let bd of this.businessSourceData) {
            if (bd.SalesDefaultInd) {
                this.systemChars['gcDefaultSourceCode'] = bd.BusinessSourceCode;
            }
            this.getBusinessSourceLang(bd, index);
            index++;
        }
        if (this.systemChars['gcDefaultSourceCode'] === '') {
            this.systemChars['gcDefaultSourceCode'] = this.businessSourceData[0].BusinessSourceCode;
        }
    }

    public onContractDataReceived(data: any, route: boolean): void {
        this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].setValue(data.AccountNumber);
        this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].setValue(data.ContractNumber);
        this.inputParamsPremise.ContractNumber = this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value;
        this.inputParamsPremise.ContractName = data.ContractName;
        this.contractSearchParams['accountNumber'] = data.AccountNumber;
        this.contractSearchParams['accountName'] = data.AccountName;
        this.allFormControls[2]['formAccount'].controls['AddressLine1'].setValue(data.AccountAddressLine1);
        this.allFormControls[0]['formPremise'].controls['PremiseAddressLine1'].setValue(data.AccountAddressLine1);
        this.allFormControls[0]['formPremise'].controls['CommenceDate'].setValue(data.ContractCommenceDate);
        this.allFormControls[0]['formPremise'].controls['ContractExpiryDate'].setValue(data.ContractExpiryDate);
        if (!this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value) {
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].setValidators([Validators.required, this.utils.commonValidate]);
            this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].setValue('');
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].updateValueAndValidity();
            this.isAccountRequired = true;

        } else {
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].clearValidators();
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].updateValueAndValidity();
            this.isAccountRequired = false;
        }
        this.storeData['methods'] = ['updatePremiseData'];
        this.saveStore(ActionTypes.EXCHANGE_METHOD);
        this.updateSearchFeildsRequired();
    }

    public onAccountPremiseDataReceived(data: any): void {
        this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].setValue(data.AccountNumber);
        this.inputParamsPremiseAccount['AccountNumber'] = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
        this.accountPremiseSearchEllipsis.openModal();
    }

    public onProspectDataReceived(data: any, route: boolean): void {
        if (data.AddMode === true) {
            setTimeout(() => {
                this.customBusinessObject.Update = false;
                this.customBusinessObject.Enable = true;
                this.systemChars.customBusinessObject.Copy = false;
                this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
                this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].disable();
                this.contractSearchParams.accountNumber = '';
                this.contractSearchParams['accountNumber'] = '';
                this.contractSearchParams['accountName'] = '';
                this.prospectDisabled = true;
                this.enableAllProspect();
                this.fromEllipsis = true;
                this.resetData();
                this.storeData['methods'] = ['enableAllPremise', 'enableAllGeneral', 'enableAllAccount'];
                this.saveStore(ActionTypes.EXCHANGE_METHOD);
            }, 10);
        } else {
            this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].setValue(data.ProspectNumber);
            this.customBusinessObject.Update = true;
            this.systemChars.updateOrigin = true;
            this.systemChars.customBusinessObject = this.customBusinessObject;
            this.populateProspect();
            this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
        }
    }

    /**
     * Set form data after fetching from account search
     */

    public onAccountDataReceived(data: any, route: boolean): void {
        this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].setValue(data.AccountNumber);
        this.allFormControls[2]['formAccount'].controls['AddressLine1'].setValue(data.AccountAddressLine1);
        this.allFormControls[2]['formAccount'].controls['AddressLine2'].setValue(data.AccountAddressLine2);
        this.allFormControls[2]['formAccount'].controls['AddressLine3'].setValue(data.AccountAddressLine3);
        this.allFormControls[2]['formAccount'].controls['AddressLine4'].setValue(data.AccountAddressLine4);
        this.allFormControls[2]['formAccount'].controls['AddressLine5'].setValue(data.AccountAddressLine5);
        this.allFormControls[2]['formAccount'].controls['Postcode'].setValue(data.AccountPostcode);
        this.allFormControls[2]['formAccount'].controls['ContactName'].setValue(data.AccountContactName);
        this.allFormControls[2]['formAccount'].controls['ContactPosition'].setValue(data.AccountContactPosition);
        this.allFormControls[2]['formAccount'].controls['ContactMobile'].setValue(data.AccountContactMobile);
        this.allFormControls[2]['formAccount'].controls['ContactFax'].setValue(data.AccountContactFax);
        this.allFormControls[2]['formAccount'].controls['ContactEmail'].setValue(data.AccountContactEmail);
        this.allFormControls[2]['formAccount'].controls['ContactTelephone'].setValue(data.AccountContactContactTelephone);
        this.storeData['methods'] = ['setAccountRelatedInfo'];
        this.saveStore(ActionTypes.EXCHANGE_METHOD);
        this.inputParamsPremiseAccount['AccountNumber'] = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
        this.contractSearchParams.accountNumber = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
        this.contractSearchParams.accountName = data.AccountName;
        this.contractSearchEllipsis.updateComponent();
        if (this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value !== '') {
            this.queryParam = new URLSearchParams();
            this.queryParam.set(this.serviceConstants.Action, '6');
            this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.queryParam.set('AccountNumber', this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value);
            this.queryParam.set('Function', 'GetAccountDetails');
            this.httpService.makeGetRequest(this.queryParamsProspect['method'], this.queryParamsProspect['module'], this.queryParamsProspect['operation'], this.queryParam).subscribe(
                (data) => {
                    try {
                        let isDisable: boolean = false;
                        if (data.errorMessage) {
                            this.messageModal.show({ msg: data.errorMessage, title: 'Message' }, false);
                            this.onMessageClose = function (): void {
                                if (!this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].value && this.allFormControls[2]['formAccount'].controls['AddressLine1'].value !== '') {
                                    if (!this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value) {
                                        this.inputParamsPremiseAccount['AccountNumber'] = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
                                        this.inputParamsPremiseAccount['AccountName'] = this.allFormControls[0]['formPremise'].controls['PremiseName'].value;
                                        isDisable = this.accountPremiseSearchEllipsis.disabled;
                                        this.accountPremiseSearchEllipsis.disabled = false;
                                        this.accountPremiseSearchEllipsis.openModal();
                                        this.accountPremiseSearchEllipsis.disabled = isDisable;
                                    } else {
                                        isDisable = this.premiseSearchEllipsis.disabled;
                                        this.premiseSearchEllipsis.disabled = false;
                                        this.premiseSearchEllipsis.openModal();
                                        this.premiseSearchEllipsis.disabled = isDisable;
                                    }
                                    this.onMessageClose = function (): void {
                                        //
                                    };
                                }
                            };
                        } else {
                            for (let cntrl in data) {
                                if (data.hasOwnProperty(cntrl)) {
                                    if (this.allFormControls[0]['formPremise'].controls[cntrl]) {
                                        this.allFormControls[0]['formPremise'].controls[cntrl].setValue(data[cntrl]);
                                    }
                                    else if (this.allFormControls[1]['formGeneral'].controls[cntrl]) {
                                        this.allFormControls[1]['formGeneral'].controls[cntrl].setValue(data[cntrl]);
                                    }
                                    else if (this.allFormControls[2]['formAccount'].controls[cntrl]) {
                                        this.allFormControls[2]['formAccount'].controls[cntrl].setValue(data[cntrl]);
                                    }

                                }
                            }
                            if (!this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].value && this.allFormControls[2]['formAccount'].controls['AddressLine1'].value !== '') {
                                if (!this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value) {
                                    this.inputParamsPremiseAccount['AccountName'] = '';
                                    this.inputParamsPremiseAccount['AccountNumber'] = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
                                    isDisable = this.accountPremiseSearchEllipsis.disabled;
                                    this.accountPremiseSearchEllipsis.disabled = false;
                                    this.accountPremiseSearchEllipsis.openModal();
                                    this.accountPremiseSearchEllipsis.disabled = isDisable;
                                } else {
                                    isDisable = this.premiseSearchEllipsis.disabled;
                                    this.premiseSearchEllipsis.disabled = false;
                                    this.premiseSearchEllipsis.openModal();
                                    this.premiseSearchEllipsis.disabled = isDisable;
                                }
                            }
                        }
                        this.storeData['methods'] = [];
                        this.storeData['methods'] = ['setAccountRelatedInfo'];
                        this.saveStore(ActionTypes.EXCHANGE_METHOD);
                    } catch (error) {
                        //  this.errorService.emitError(error);
                    }//

                },
                (error) => {
                    this.errorService.emitError(error);
                }
            );
        }
        this.updateSearchFeildsRequired();
    }

    /**
     * Method to update data in store after every service call
     */

    private updateStore(storeType: string, data: any): void {
        this.storeData[storeType] = data;
    }

    /**
     * Insert into store to use from child
     */
    private saveStore(action: string): void {
        switch (action) {
            case ActionTypes.SAVE_SYSTEM_PARAMETER:
                this.store.dispatch({
                    type: ActionTypes[action],
                    payload: { systemChars: this.storeData['systemChars'], formParentControl: this.maintenanceProspectSearchFormGroup }
                });
                break;
            case ActionTypes.CONTROL_DEFAULT_VALUE:
                this.store.dispatch({
                    type: ActionTypes[action],
                    payload: this.storeData['ttBusiness']
                });
                break;
            case ActionTypes.EXCHANGE_METHOD:
                this.store.dispatch({
                    type: ActionTypes[action],
                    payload: this.storeData['methods']
                });
                break;
            default:
                break;
        }

    }

    /**
     * Create dropdown menu based on url param
     */
    private buildMenuOptions(): void {
        this.menuOptions = [];
        let currentURL = window.location.href;
        this.menuAddOption('', 'Options');
        if (currentURL.match(new RegExp('Prospect', 'i'))) {
            this.vAddURLParam = 'ProspectExistAcct';
        }
        if (currentURL.match(new RegExp('NatAxJob', 'i'))) {
            this.menuAddOption('NatAxJobServiceCover', 'Service Cover');
            if (currentURL.match(new RegExp('Confirm', 'i'))) {
                this.menuAddOption('GoToJob', 'Job');
            }
        } else {
            this.menuAddOption('Diary', 'Diary');
            this.menuAddOption('WorkOrders', 'WorkOrders');
            this.menuAddOption('TeleSalesOrder', 'Telesales Order');
            //this.menuAddOption('Contacts', 'Contacts');
        }
        this.MenuOptionDropdown.selectedItem = '';
    }

    private menuAddOption(strValue: string, strText: string): void {
        let newOption = { value: strValue, text: strText };
        this.menuOptions.push(newOption);
    }

    /**
     * Require fields service call
     */
    private requireFields(): void {
        this.queryParam = new URLSearchParams();
        this.queryParam.set(this.serviceConstants.Action, '6');
        this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParam.set('Function', 'GetInitialSettings');

        this.httpService.makeGetRequest(this.queryParamsProspect['method'], this.queryParamsProspect['module'], this.queryParamsProspect['operation'], this.queryParam).subscribe(
            (data) => {
                try {
                    this.systemChars.DefaultClosedDate = data.DefaultClosedDate;
                    this.systemChars.DefaultProbability = data.DefaultProbability;
                    this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
                } catch (error) {
                    //this.errorService.emitError(error);
                }

            },
            (error) => {
                this.errorService.emitError(error);
            }
        );

    }

    /**
     * Set UI control on page load
     */

    public setUI(): void {
        this.systemChars.saveElement = this.el.nativeElement.querySelector('#save');
        this.systemChars.modalComp = this.messageModal;
        let parentMode = this.riExchange.ParentMode(this.systemChars.routeParams);
        this.fieldDisable.cancel = false;
        this.buildMenuOptions();
        this.functionPermission['FunctionAdd'] = true;
        this.functionPermission['FunctionDelete'] = false;
        this.functionPermission['FunctionSnapShot'] = false;
        this.functionPermission['DisplayMessages'] = true;
        this.customBusinessObject['select'] = false;
        this.customBusinessObject['Confirm'] = false;
        this.customBusinessObject['Insert'] = true;
        this.customBusinessObject['Update'] = false;
        this.customBusinessObject['Delete'] = true;
        let currentURL = window.location.href;
        if (currentURL.match(new RegExp('Prospect', 'i'))) {
            this.customBusinessObject['Select'] = true;
            this.pageTitle = 'Prospect Entry';
            this.tabProspect.tabFocusTo(0);
            if (this.systemChars.LocalSystemInd) {
                this.functionPermission.FunctionUpdate = true;
                this.functionPermission.FunctionDelete = true;
            }
            this.systemChars.ProspectTypeDesc = 'Prospect';
        } else if (currentURL.match(new RegExp('NatAxJob', 'i'))) {
            this.pageTitle = 'National Account Job Confirmation';
            this.tabProspect.tabFocusTo(0);
            this.systemChars.ProspectTypeDesc = 'NatAxJob';
        } else {
            this.pageTitle = 'National Account Job Confirmation';
            this.tabProspect.tabFocusTo(0);
            this.functionPermission['FunctionAdd'] = false;
            this.functionPermission['FunctionDelete'] = false;
            if (parentMode === 'ConfirmNatAx') {
                this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'ProspectNumber'));
                this.functionPermission.fetchMode = true;
            }
            this.systemChars.ProspectTypeDesc = 'Confirm';
        }
        this.utils.setTitle(this.pageTitle);

        if (parentMode === 'ContactManagement' || parentMode === 'WorkOrderMaintenance') {
            this.systemChars.sCDisableQuoteDetsOnAddProspect = false;
        }
        this.systemChars.CallLogID = '0';
        this.systemChars.ContactTypeCode = '';
        this.systemChars.ContactTypeDetailCode = '';
        this.requireFields();
        if (parentMode === 'ContactManagement' || parentMode === 'WorkOrderMaintenance') {
            this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'ProspectNumber'));
            this.customBusinessObject.Update = true;
            this.autoOpenProspectSearch = false;
            this.prospectLookUp({ type: 'fetch' });
        }
        if (parentMode === 'ContactRelatedTicket') {
            this.systemChars.sCDisableQuoteDetsOnAddProspect = false;
            this.functionPermission.FunctionAdd = false;
            this.functionPermission.FunctionSelect = false;
            this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'RelatedProspectNumber'));
            this.systemChars.CallLogID = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'CurrentCallLogID');
            this.systemChars.FromCustomerContactNumber = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'SelectedTicketNumber');
            this.prospectLookUp({ type: 'fetch' });
        }
        if (parentMode === 'SalesOrder' || parentMode === 'CallCentreSearch') {
            this.systemChars.sCDisableQuoteDetsOnAddProspect = false;
            this.functionPermission.FunctionAdd = false;
            this.functionPermission.FunctionSelect = false;
            this.customBusinessObject.Update = true;
            this.autoOpenProspectSearch = false;
            this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'ProspectNumber'));
            this.systemChars.PassContactRowID = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'ContactRowID');
            if (parentMode === 'CallCentreSearch') {
                this.systemChars.CallLogID = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'CurrentCallLogID');
                this.systemChars.FromCustomerContactNumber = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'SelectedTicketNumber');
            }
            this.prospectLookUp({ type: 'fetch' });
        }
        if (parentMode === 'PipelineGridNew') {
            this.systemChars.sCDisableQuoteDetsOnAddProspect = false;
            this.functionPermission.addMode = true;

        }
        if (parentMode === 'TelesalesSearch') {
            this.functionPermission.RowID = this.riExchange.GetParentHTMLInputElementAttribute(this.systemChars.routeParams, 'RowID');
            this.functionPermission.fetchMode = true;
        }
        if (parentMode === 'CallCentreSearchNew' || parentMode === 'CallCentreSearchNewExisting') {
            this.systemChars.sCDisableQuoteDetsOnAddProspect = false;
            this.functionPermission.addMode = true;
            this.systemChars.CallLogID = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'CurrentCallLogID');
            this.systemChars.FromCustomerContactNumber = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'SelectedTicketNumber');
            this.systemChars.ContactTypeCode = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'ContactTypeCode');
            this.systemChars.ContactTypeDetailCode = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'ContactTypeDetailCode');
            if (parentMode === 'CallCentreSearchNewExisting') {
                this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'AccountNumber'));
                this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'ContractNumber'));
                this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'PremiseNumber'));
                if (this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].value === '0') {
                    this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].setValue('');
                }
                if (this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].value !== '') {
                    this.getPremiseDetails();
                } else {
                    this.getDefaultCustomerTypeCode();
                }
            } else {
                this.fieldVisibility.AccountNumber = true;
                this.fieldVisibility.ContractNumber = true;
                this.fieldVisibility.PremiseNumber = true;
                this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].setValue('');
            }

        }
        this.systemChars.LoggedInBranchNumber = this.utils.getBranchCode();
        if (parentMode === 'LostBusinessRequest') {
            this.functionPermission.addMode = true;
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].disable();
            this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].disable();
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'AccountNumber'));
            this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'ContractNumber'));
            this.systemChars.AssignToEmployeeCode = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'EmployeeCode');
            this.systemChars.AssignToEmployeeName = this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'EmployeeSurName');
            this.getLostBusinessRequestDetails();
        }
        if (this.systemChars.LocalSystemInd) {
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].disable();
            this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].disable();
        }
        if (!parentMode && this.ls.retrieve(this.pageId + 'isReturningFlag') && this.ls.retrieve(this.pageId + 'isReturningFlag') === 'True') {
            this.prospectLookUp({ type: 'fetch' });
            this.ls.clear(this.pageId + 'isReturningFlag');
        }
        this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
        this.disableAllProspect();
        this.updateSearchFeildsRequired();
    }
    /**
     * Get details of Premise
     */
    private getPremiseDetails(): void {
        this.queryParam.set(this.serviceConstants.Action, '6');
        this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParam.set('ContractNumber', this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value);
        this.queryParam.set('PremiseNumber', this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].value);
        this.queryParam.set('Function', 'GetPremiseDetails');

        this.httpService.makeGetRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam).subscribe(
            (data) => {
                try {
                    this.allFormControls[0]['formPremise'].controls['PremiseName'].setValue(data.PremiseName);
                    this.allFormControls[0]['formPremise'].controls['PremiseAddressLine1'].setValue(data.PremiseAddressLine1);
                    this.allFormControls[0]['formPremise'].controls['PremiseAddressLine2'].setValue(data.PremiseAddressLine2);
                    this.allFormControls[0]['formPremise'].controls['PremiseAddressLine3'].setValue(data.PremiseAddressLine3);
                    this.allFormControls[0]['formPremise'].controls['PremiseAddressLine4'].setValue(data.PremiseAddressLine4);
                    this.allFormControls[0]['formPremise'].controls['PremiseAddressLine5'].setValue(data.PremiseAddressLine5);
                    this.allFormControls[0]['formPremise'].controls['PremisePostcode'].setValue(data.PremisePostcode);
                    this.allFormControls[0]['formPremise'].controls['PremiseContactName'].setValue(data.PremiseContactName);
                    this.allFormControls[0]['formPremise'].controls['PremiseContactPosition'].setValue(data.PremiseContactPosition);
                    this.allFormControls[0]['formPremise'].controls['PremiseContactTelephone'].setValue(data.PremiseContactTelephone);
                    this.allFormControls[0]['formPremise'].controls['PremiseContactFax'].setValue(data.PremiseContactFax);
                    this.allFormControls[0]['formPremise'].controls['PremiseContactMobile'].setValue(data.PremiseContactMobile);
                    this.allFormControls[0]['formPremise'].controls['PremiseContactEmail'].setValue(data.PremiseContactEmail);

                } catch (error) {
                    //this.errorService.emitError(error);
                }

            },
            (error) => {
                this.errorService.emitError(error);
            }
        );

    }
    private getLostBusinessRequestDetails(): void {
        this.queryParam.set(this.serviceConstants.Action, '6');
        this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParam.set('ContractNumber', this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value);
        this.queryParam.set('PremiseNumber', this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].value);
        this.queryParam.set('LostBusinessRequestNumber', this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'LostBusinessRequestNumber'));
        this.queryParam.set('Function', 'GetLostBusinessRequestDetails');

        this.httpService.makeGetRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam).subscribe(
            (data) => {
                try {
                    this.allFormControls[2]['formAccount'].controls['ProspectName'].setValue(data.ProspectName);
                    this.allFormControls[2]['formAccount'].controls['AddressLine1'].setValue(data.AddressLine1);
                    this.allFormControls[2]['formAccount'].controls['AddressLine2'].setValue(data.AddressLine2);
                    this.allFormControls[2]['formAccount'].controls['AddressLine3'].setValue(data.AddressLine3);
                    this.allFormControls[2]['formAccount'].controls['AddressLine4'].setValue(data.AddressLine4);
                    this.allFormControls[2]['formAccount'].controls['AddressLine5'].setValue(data.AddressLine5);
                    this.allFormControls[2]['formAccount'].controls['Postcode'].setValue(data.Postcode);
                    this.allFormControls[2]['formAccount'].controls['ContactName'].setValue(data.ContactName);
                    this.allFormControls[2]['formAccount'].controls['ContactPosition'].setValue(data.ContactPosition);
                    this.allFormControls[2]['formAccount'].controls['ContactTelephone'].setValue(data.ContactTelephone);
                    this.allFormControls[2]['formAccount'].controls['ContactFax'].setValue(data.ContactFax);
                    this.allFormControls[2]['formAccount'].controls['ContactMobile'].setValue(data.ContactMobile);
                    this.allFormControls[2]['formAccount'].controls['ContactEmail'].setValue(data.ContactEmail);
                    this.allFormControls[1]['formGeneral'].controls['Narrative'].setValue(data.LBNarrative);
                    this.allFormControls[0]['formPremise'].controls['ContactMediumCode'].setValue(data.ProspectOriginCode);
                    this.allFormControls[0]['formPremise'].controls['ContactMediumDesc'].setValue(data.ProspectOriginDesc);
                } catch (error) {
                    //this.errorService.emitError(error);
                }

            },
            (error) => {
                this.errorService.emitError(error);
            }
        );

    }

    /**
     * Get details of Premise
     */
    private getDefaultCustomerTypeCode(): void {
        this.queryParam.set(this.serviceConstants.Action, '6');
        this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParam.set('ContractNumber', this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value);
        this.queryParam.set('Function', 'GetDefaultCustomerTypeCode');

        this.httpService.makeGetRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam).subscribe(
            (data) => {
                try {
                    this.allFormControls[1]['formGeneral'].controls['CustomerTypeCode'].setValue(data.CustomerTypeCode);
                    this.allFormControls[1]['formGeneral'].controls['CustomerTypeDesc'].setValue(data.CustomerTypeDesc);

                } catch (error) {
                    //this.errorService.emitError(error);
                }

            },
            (error) => {
                this.errorService.emitError(error);
            }
        );

    }

    /**
     * Account number onchange method
     */

    public accountNumberOnchange(obj: any): void {
        if (obj.value)
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].setValue(this.utils.numberPadding(obj.value, 9));
        this.inputParamsPremiseAccount['AccountNumber'] = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
        this.contractSearchParams.accountNumber = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
        this.contractSearchEllipsis.updateComponent();
        this.updateSearchFeildsRequired();
        if (this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value !== '') {
            this.queryParam = new URLSearchParams();
            this.queryParam.set(this.serviceConstants.Action, '6');
            this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.queryParam.set('AccountNumber', this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value);
            this.queryParam.set('Function', 'GetAccountDetails');
            this.httpService.makeGetRequest(this.queryParamsProspect['method'], this.queryParamsProspect['module'], this.queryParamsProspect['operation'], this.queryParam).subscribe(
                (data) => {
                    try {
                        let isDisable: boolean = false;
                        if (data.errorMessage) {
                            this.errorModal.show(data, true);
                            this.onMessageClose = function (): void {
                                if (!this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].value && this.allFormControls[2]['formAccount'].controls['AddressLine1'].value !== '') {
                                    if (!this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value) {
                                        this.inputParamsPremiseAccount['AccountNumber'] = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
                                        this.inputParamsPremiseAccount['AccountName'] = this.allFormControls[0]['formPremise'].controls['PremiseName'].value;
                                        isDisable = this.accountPremiseSearchEllipsis.disabled;
                                        this.accountPremiseSearchEllipsis.disabled = false;
                                        this.accountPremiseSearchEllipsis.openModal();
                                        this.accountPremiseSearchEllipsis.disabled = isDisable;
                                    } else {
                                        isDisable = this.premiseSearchEllipsis.disabled;
                                        this.premiseSearchEllipsis.disabled = false;
                                        this.premiseSearchEllipsis.openModal();
                                        this.premiseSearchEllipsis.disabled = isDisable;
                                    }
                                    this.onMessageClose = function (): void {
                                        //
                                    };
                                }
                            };
                        } else {
                            this.contractSearchParams.accountName = data.ProspectName;
                            this.contractSearchEllipsis.updateComponent();
                            for (let cntrl in data) {
                                if (data.hasOwnProperty(cntrl)) {
                                    if (this.allFormControls[2]['formAccount'].controls[cntrl]) {
                                        this.allFormControls[2]['formAccount'].controls[cntrl].setValue(data[cntrl]);
                                    }
                                }
                            }
                            if (!this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].value && this.allFormControls[2]['formAccount'].controls['AddressLine1'].value !== '') {
                                if (!this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value) {
                                    this.inputParamsPremiseAccount['AccountName'] = '';
                                    this.inputParamsPremiseAccount['AccountNumber'] = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
                                    isDisable = this.accountPremiseSearchEllipsis.disabled;
                                    this.accountPremiseSearchEllipsis.disabled = false;
                                    this.accountPremiseSearchEllipsis.openModal();
                                    this.accountPremiseSearchEllipsis.disabled = isDisable;
                                } else {
                                    isDisable = this.premiseSearchEllipsis.disabled;
                                    this.premiseSearchEllipsis.disabled = false;
                                    this.premiseSearchEllipsis.openModal();
                                    this.premiseSearchEllipsis.disabled = isDisable;
                                }
                            }
                            this.updateSearchFeildsRequired();
                        }

                    } catch (error) {
                        //  this.errorService.emitError(error);
                    }//

                },
                (error) => {
                    this.errorService.emitError(error);
                }
            );
        }
    }
    /**
     * Contract number onchange method
     */
    public contractNumberOnchange(obj: any): void {
        if (obj.value)
            this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].setValue(this.utils.numberPadding(obj.value, 8));
        if (!this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value) {
            this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].setValue('');
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].clearValidators();
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].updateValueAndValidity();
            this.isAccountRequired = false;
        } else {
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].setValidators([Validators.required, this.utils.commonValidate]);
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].updateValueAndValidity();
            this.isAccountRequired = true;
        }
        this.inputParamsPremise.ContractNumber = this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value;
        if (this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value) {
            this.queryParam = new URLSearchParams();
            this.queryParam.set(this.serviceConstants.Action, '6');
            this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.queryParam.set('ContractNumber', this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value);
            this.queryParam.set('Function', 'GetContractDetails,GetAccountDetails');
            this.httpService.makeGetRequest(this.queryParamsProspect['method'], this.queryParamsProspect['module'], this.queryParamsProspect['operation'], this.queryParam).subscribe(
                (data) => {
                    try {
                        if (data.errorMessage) {
                            this.errorModal.show(data, true);
                        } else {
                            for (let cntrl in data) {
                                if (data.hasOwnProperty(cntrl)) {
                                    if (this.allFormControls[2]['formAccount'].controls[cntrl]) {
                                        this.allFormControls[2]['formAccount'].controls[cntrl].setValue(data[cntrl]);
                                    }
                                    else if (this.maintenanceProspectSearchFormGroup.controls[cntrl]) {
                                        this.maintenanceProspectSearchFormGroup.controls[cntrl].setValue(data[cntrl]);
                                    }
                                }
                            }
                            this.inputParamsPremiseAccount['AccountNumber'] = data.AccountNumber;
                            this.contractSearchParams['accountNumber'] = data.AccountNumber;
                            this.contractSearchParams['accountName'] = data.AccountName;
                        }
                    } catch (error) {
                        //  this.errorService.emitError(error);
                    }

                },
                (error) => {
                    this.errorService.emitError(error);
                }
            );
        }
        this.updateSearchFeildsRequired();
    }


    // Copy Prospect details from existing prospect



    public copyPeospectDetails(obj: any): void {
        if (this.systemChars.customBusinessObject.Update === false) {
            this.allFormControls[0]['formPremise'].controls['BusinessSourceCodeSelect'].setValue('E');
            this.allFormControls[0]['formPremise'].controls['BusinessOriginCodeSelect'].setValue(this.systemChars.BusinessOriginCode);
            this.storeData['methods'] = [];
            this.storeData['methods'] = ['businessSourceCodeSelectChange', 'businessOriginCodeSelectChange', 'setAccountRelatedInfo'];
            this.saveStore(ActionTypes.EXCHANGE_METHOD);
            this.inputParamsCopyProspect.parentMode = 'ProspectCopy';
            this.inputParamsCopyProspect.showAddNew = false;
            this.inputParamsCopyProspect.vAddURLParam = this.vAddURLParam;
            this.prospectSearchCopyEllipsis.childConfigParams = this.inputParamsCopyProspect;
            this.prospectSearchCopyEllipsis.openModal();
        } else {
            this.systemChars.customBusinessObject.Update = false;
            this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].setValue('0');
            this.prospectDisabled = true;
            this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].disable();
            this.fieldDisable.optionDisable = true;

        }
    }

    public onProspectCopyDataReceived(data: any, route: boolean): void {
        this.systemChars.customBusinessObject.Copy = true;
        this.systemChars.customBusinessObject.Update = false;
        this.systemChars.customBusinessObject = this.customBusinessObject;
        this.systemChars.updateOrigin = true;
        this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
        for (let cntrl in data) {
            if (data.hasOwnProperty(cntrl)) {
                if (this.allFormControls[0]['formPremise'].controls[cntrl]) {
                    this.allFormControls[0]['formPremise'].controls[cntrl].setValue(data[cntrl]);
                }
                else if (this.allFormControls[1]['formGeneral'].controls[cntrl]) {
                    this.allFormControls[1]['formGeneral'].controls[cntrl].setValue(data[cntrl]);
                }
                else if (this.allFormControls[2]['formAccount'].controls[cntrl]) {
                    this.allFormControls[2]['formAccount'].controls[cntrl].setValue(data[cntrl]);
                } else if (this.maintenanceProspectSearchFormGroup.controls[cntrl]) {
                    this.maintenanceProspectSearchFormGroup.controls[cntrl].setValue(data[cntrl]);
                    if (cntrl === 'ProspectNumber') {
                        this.maintenanceProspectSearchFormGroup.controls[cntrl].setValue('0');
                    }
                } else if (cntrl === 'BusinessSourceCode') {
                    if (data[cntrl])
                        this.allFormControls[0]['formPremise'].controls['BusinessSourceCodeSelect'].setValue(data[cntrl]);
                } else if (cntrl === 'BusinessOriginCode') {
                    if (data[cntrl])
                        this.allFormControls[0]['formPremise'].controls['BusinessOriginCodeSelect'].setValue(data[cntrl]);
                } else if (cntrl === 'BusinessOriginDetailCode') {
                    if (data[cntrl])
                        this.allFormControls[0]['formPremise'].controls['BusinessOriginDetailCodeSelect'].setValue(data[cntrl]);
                } else if (cntrl === 'LOSCode') {
                    if (data[cntrl])
                        this.allFormControls[0]['formPremise'].controls['LOSCodeSelect'].setValue(data[cntrl]);
                }
            }
        }
        this.getContactMediumDesc();
        this.getStatusDesc();
        this.inputParamsPremiseAccount['AccountNumber'] = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
        this.contractSearchParams.accountNumber = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
        this.inputParamsPremise.ContractNumber = this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value;
        this.storeData['methods'] = [];
        this.enableAllProspect();
        this.storeData['methods'] = ['updatePremiseData', 'updateGeneralData', 'updateBusinessOrigin', 'setAccountRelatedInfo'];
        this.saveStore(ActionTypes.EXCHANGE_METHOD);
    }

    /**
     * Validation of contract befor esave
     */

    public beforeSaveData(): void {
        this.routeAwayComponent.resetDirtyFlagAfterSaveUpdate();
        if (this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value && this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value) {
            this.queryParam = new URLSearchParams();
            this.queryParam.set(this.serviceConstants.Action, '6');
            this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.queryParam.set('ContractNumber', this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value);
            this.queryParam.set('AccountNumber', this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value);
            this.queryParam.set('Function', 'CheckContractForAccount');

            this.httpService.makeGetRequest(this.queryParamsProspect['method'], this.queryParamsProspect['module'], this.queryParamsProspect['operation'], this.queryParam).subscribe(
                (data) => {
                    try {
                        if (data.ErrorMessageDesc === '') {
                            this.saveData();
                        } else {
                            this.errorModal.show(data, true);
                            this.el.nativeElement.querySelector('#ContractNumber').focus();
                        }
                    } catch (error) {
                        //  this.errorService.emitError(error);
                    }//

                },
                (error) => {
                    this.errorService.emitError(error);
                }
            );
        } else {
            this.saveData();
        }
    }

    /**
     * Saving data add/update after save button click
     */
    public saveData(): void {
        let formdData: any = {}, errorWarning: boolean = false;
        for (let c in this.allFormControls[0]['formPremise'].controls) {
            if (this.allFormControls[0]['formPremise'].controls.hasOwnProperty(c)) {
                if (typeof this.allFormControls[0]['formPremise'].controls[c].value === 'undefined') {
                    this.allFormControls[0]['formPremise'].controls[c].setValue('');
                }
                this.allFormControls[0]['formPremise'].controls[c].markAsTouched();
            }

        }
        for (let c in this.allFormControls[1]['formGeneral'].controls) {
            if (this.allFormControls[1]['formGeneral'].controls.hasOwnProperty(c)) {
                this.allFormControls[1]['formGeneral'].controls[c].markAsTouched();
            }
        }

        for (let c in this.allFormControls[2]['formAccount'].controls) {
            if (this.allFormControls[2]['formAccount'].controls.hasOwnProperty(c)) {
                this.allFormControls[2]['formAccount'].controls[c].markAsTouched();
            }
        }
        if (this.allFormControls[0]['formPremise'].valid === false) {
            this.tabProspect.tabFocusTo(0, true);
        } else if (this.allFormControls[1]['formGeneral'].valid === false) {
            this.tabProspect.tabFocusTo(1, true);
        } else if (this.allFormControls[2]['formAccount'].valid === false) {
            this.tabProspect.tabFocusTo(2, true);
        }
        if (this.allFormControls[0]['formPremise'].valid && this.allFormControls[1]['formGeneral'].valid && (this.allFormControls[2]['formAccount'].valid || this.allFormControls[2]['formAccount'].status === 'DISABLED') && this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].valid && this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].valid) {
            this.tabProspect.tabFocusTo(0, false);
            if (this.systemChars.vSCMaxQuotesNumber !== 0 && this.allFormControls[1]['formGeneral'].controls['EstimatedTotalQuotes'].value !== '' && this.allFormControls[1]['formGeneral'].controls['EstimatedTotalQuotes'].value > this.systemChars.vSCMaxQuotesNumber) {
                errorWarning = true;
                this.messageModal.show({ msg: this.systemChars.cQuoteNumberWarningMessage, title: this.pageTitle }, false);
                this.onMessageClose = function (): void {
                    this.onMessageClose = function (): void {
                        if (this.systemChars.vSCMaxQuotesValue !== 0 && this.allFormControls[1]['formGeneral'].controls['EstimatedTotalValue'].value !== '' && this.allFormControls[1]['formGeneral'].controls['EstimatedTotalValue'].value > this.systemChars.vSCMaxQuotesValue) {
                            this.messageModal.show({ msg: this.systemChars.cQuoteValueWarningMessage, title: this.pageTitle }, false);
                            this.onMessageClose = function (): void {
                                this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
                                this.promptConfirmModal.show();
                                this.onMessageClose = function (): void {
                                    //
                                };
                            };
                        } else {
                            this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
                            this.promptConfirmModal.show();
                            this.onMessageClose = function (): void {
                                //
                            };
                        }
                    };
                };
            } else if (this.systemChars.vSCMaxQuotesValue !== 0 && this.allFormControls[1]['formGeneral'].controls['EstimatedTotalValue'].value !== '' && this.allFormControls[1]['formGeneral'].controls['EstimatedTotalValue'].value > this.systemChars.vSCMaxQuotesValue) {
                errorWarning = true;
                this.messageModal.show({ msg: this.systemChars.cQuoteValueWarningMessage, title: this.pageTitle }, false);
                this.onMessageClose = function (): void {
                    this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
                    this.promptConfirmModal.show();
                    this.onMessageClose = function (): void {
                        //
                    };
                };
            }
            if (!errorWarning) {
                this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
                this.promptConfirmModal.show();
            }
        } else {
            this.storeData['methods'] = [];
            this.storeData['methods'] = ['addInvalidClass'];
            this.saveStore(ActionTypes.EXCHANGE_METHOD);
        }
    }

    /**
     * Add prospect data after validation
     */

    private addProspect(data: any): void {
        this.queryParam = new URLSearchParams();
        this.queryParam.set(this.serviceConstant.Action, '1');
        this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParam.set('Function', 'ValidateEmplLeft');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam, data)
            .subscribe(
            (e) => {
                if (typeof e['status'] !== 'undefined' && e['status'] === 'failure') {
                    this.errorService.emitError(e.status);
                } else {
                    if ((typeof e !== 'undefined' && e.errorMessage)) {
                        this.errorModal.show(e, true);
                    } else if (typeof e !== 'undefined' && e.Prospect !== '') {
                        this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].setValue(e.ProspectNumber);
                        this.customBusinessObject.Update = true;
                        this.prospectROWID = e.Prospect;
                        this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: MessageConstant.Message.MessageTitle }, false);
                        this.maintenanceProspectSearchFormGroup.markAsPristine();
                        this.allFormControls[0]['formPremise'].markAsPristine();
                        this.allFormControls[1]['formGeneral'].markAsPristine();
                        this.allFormControls[2]['formAccount'].markAsPristine();
                        this.autoOpenProspectSearch = false;
                        this.prospectDisabled = false;
                        this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    /**
     * Update prospect data after validation
     */

    private updateProspect(data: any): void {
        data['ProspectROWID'] = this.prospectROWID;
        this.queryParam = new URLSearchParams();
        this.queryParam.set(this.serviceConstant.Action, '2');
        this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParam.set('Function', 'CheckValidProspect');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam, data)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorModal.show(e, true);
                    } else {
                        this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: 'Message' }, false);
                        this.messageService.emitMessage(e);
                        this.maintenanceProspectSearchFormGroup.markAsPristine();
                        this.allFormControls[0]['formPremise'].markAsPristine();
                        this.allFormControls[1]['formGeneral'].markAsPristine();
                        this.allFormControls[2]['formAccount'].markAsPristine();
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    /**
     * Populate form data in update mode
     */
    private populateProspect(): void {
        if (this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].value !== '' && this.customBusinessObject.Update) {
            this.queryParam = new URLSearchParams();
            this.queryParam.set(this.serviceConstants.Action, '0');
            this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.queryParam.set('Function', 'CheckValidProspect');
            this.queryParam.set('ProspectNumber', this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].value);

            this.httpService.makeGetRequest(this.queryParamsProspect['method'], this.queryParamsProspect['module'], this.queryParamsProspect['operation'], this.queryParam).subscribe(
                (data) => {
                    try {
                        for (let cntrl in data) {
                            if (data.hasOwnProperty(cntrl)) {
                                if (this.allFormControls[0]['formPremise'].controls[cntrl]) {
                                    this.allFormControls[0]['formPremise'].controls[cntrl].setValue(data[cntrl]);
                                }
                                else if (this.allFormControls[1]['formGeneral'].controls[cntrl]) {
                                    this.allFormControls[1]['formGeneral'].controls[cntrl].setValue(data[cntrl]);
                                }
                                else if (this.allFormControls[2]['formAccount'].controls[cntrl]) {
                                    this.allFormControls[2]['formAccount'].controls[cntrl].setValue(data[cntrl]);
                                } else if (this.maintenanceProspectSearchFormGroup.controls[cntrl]) {
                                    this.maintenanceProspectSearchFormGroup.controls[cntrl].setValue(data[cntrl]);
                                } else if (cntrl === 'BusinessSourceCode') {
                                    this.allFormControls[0]['formPremise'].controls['BusinessSourceCodeSelect'].setValue(data[cntrl]);
                                } else if (cntrl === 'BusinessOriginCode') {
                                    this.allFormControls[0]['formPremise'].controls['BusinessOriginCodeSelect'].setValue(data[cntrl]);
                                } else if (cntrl === 'BusinessOriginDetailCode') {
                                    this.allFormControls[0]['formPremise'].controls['BusinessOriginDetailCodeSelect'].setValue(data[cntrl]);
                                } else if (cntrl === 'LOSCode') {
                                    this.allFormControls[0]['formPremise'].controls['LOSCodeSelect'].setValue(data[cntrl]);
                                } else if (cntrl === 'Prospect') {
                                    this.prospectROWID = data[cntrl];
                                }

                            }
                        }
                        let currentURL = window.location.href;
                        if (currentURL.match(new RegExp('Prospect', 'i'))) {
                            this.allFormControls[0]['formPremise'].controls['AssignToEmployeeCode'].setValue(data['ServicingSalesEmployeeCode']);
                            if (data['ServicingSalesEmployeeCode'])
                                this.getEmployeeName(data['ServicingSalesEmployeeCode'], 'AssignToEmployeeName');
                            if (data['PDALeadEmployeeCode'])
                                this.getEmployeeName(data['PDALeadEmployeeCode'], 'PDALeadEmployeeSurname');
                            this.getCustomerTypeDesc();
                            if (this.systemChars.vSICCodeEnable) {
                                this.getSICDescription();
                            }
                        } else {
                            this.getPaymentType();
                            this.getBranch();
                            if (data['NegotiatingSalesEmployeeCode'])
                                this.getEmployeeName(data['NegotiatingSalesEmployeeCode'], 'NegotiatingSalesEmployeeSurname');
                            if (data['ServicingSalesEmployeeCode'])
                                this.getEmployeeName(data['ServicingSalesEmployeeCode'], 'ServicingSalesEmployeeSurname');
                        }
                        this.afterFetch();
                        this.getContactMediumDesc();
                        this.getStatusDesc();
                        this.inputParamsPremiseAccount['AccountNumber'] = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
                        this.contractSearchParams.accountNumber = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
                        this.inputParamsPremise.ContractNumber = this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value;
                    } catch (error) {
                        //this.errorService.emitError(error);
                    }

                },
                (error) => {
                    this.errorService.emitError(error);
                }
            );

        }
    }

    /**
     * Fetch form prospect data from other pages
     */
    private fetchProspect(): void {
        if (this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].value !== '' && this.customBusinessObject.Update) {
            this.queryParam = new URLSearchParams();
            this.queryParam.set(this.serviceConstants.Action, '0');
            this.queryParam.set('Function', '');
            this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.queryParam.set('ProspectNumber', this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].value);

            this.httpService.makeGetRequest(this.queryParamsProspect['method'], this.queryParamsProspect['module'], this.queryParamsProspect['operation'], this.queryParam).subscribe(
                (data) => {
                    try {
                        for (let cntrl in data) {
                            if (data.hasOwnProperty(cntrl)) {
                                if (this.allFormControls[0]['formPremise'].controls[cntrl]) {
                                    this.allFormControls[0]['formPremise'].controls[cntrl].setValue(data[cntrl]);
                                }
                                else if (this.allFormControls[1]['formGeneral'].controls[cntrl]) {
                                    this.allFormControls[1]['formGeneral'].controls[cntrl].setValue(data[cntrl]);
                                }
                                else if (this.allFormControls[2]['formAccount'].controls[cntrl]) {
                                    this.allFormControls[2]['formAccount'].controls[cntrl].setValue(data[cntrl]);
                                } else if (this.maintenanceProspectSearchFormGroup.controls[cntrl]) {
                                    this.maintenanceProspectSearchFormGroup.controls[cntrl].setValue(data[cntrl]);
                                } else if (cntrl === 'BusinessSourceCode') {
                                    this.allFormControls[0]['formPremise'].controls['BusinessSourceCodeSelect'].setValue(data[cntrl]);
                                } else if (cntrl === 'BusinessOriginCode') {
                                    this.allFormControls[0]['formPremise'].controls['BusinessOriginCodeSelect'].setValue(data[cntrl]);
                                } else if (cntrl === 'BusinessOriginDetailCode') {
                                    this.allFormControls[0]['formPremise'].controls['BusinessOriginDetailCodeSelect'].setValue(data[cntrl]);
                                } else if (cntrl === 'LOSCode') {
                                    this.allFormControls[0]['formPremise'].controls['LOSCodeSelect'].setValue(data[cntrl]);
                                } else if (cntrl === 'Prospect') {
                                    this.prospectROWID = data[cntrl];
                                }

                            }
                        }
                        let currentURL = window.location.href;
                        if (currentURL.match(new RegExp('Prospect', 'i'))) {
                            this.allFormControls[0]['formPremise'].controls['AssignToEmployeeCode'].setValue(data['ServicingSalesEmployeeCode']);
                            if (data['ServicingSalesEmployeeCode'])
                                this.getEmployeeName(data['ServicingSalesEmployeeCode'], 'AssignToEmployeeName');
                            if (data['PDALeadEmployeeCode'])
                                this.getEmployeeName(data['PDALeadEmployeeCode'], 'PDALeadEmployeeSurname');
                            this.getCustomerTypeDesc();
                            if (this.systemChars.vSICCodeEnable) {
                                this.getSICDescription();
                            }
                        } else {
                            this.getPaymentType();
                            this.getBranch();
                            if (data['NegotiatingSalesEmployeeCode'])
                                this.getEmployeeName(data['NegotiatingSalesEmployeeCode'], 'NegotiatingSalesEmployeeSurname');
                            if (data['ServicingSalesEmployeeCode'])
                                this.getEmployeeName(data['ServicingSalesEmployeeCode'], 'ServicingSalesEmployeeSurname');
                        }
                        this.getContactMediumDesc();
                        this.getStatusDesc();
                        this.inputParamsPremiseAccount['AccountNumber'] = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
                        this.contractSearchParams.accountNumber = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
                        this.inputParamsPremise.ContractNumber = this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value;
                        setTimeout(() => {
                            this.customBusinessObject.Enable = true;
                            this.pageTitle = 'Prospect Entry';
                            this.utils.setTitle(this.pageTitle);
                            this.storeData['methods'] = [];
                            this.enableAllProspect();
                            this.storeData['methods'] = ['enableAllPremise', 'enableAllGeneral', 'enableAllAccount', 'beforeUpdate', 'updatePremiseData', 'updateGeneralData', 'updateBusinessOrigin', 'setAccountRelatedInfo'];
                            this.saveStore(ActionTypes.EXCHANGE_METHOD);
                        }, 1500);

                    } catch (error) {
                        //this.errorService.emitError(error);
                    }

                },
                (error) => {
                    this.errorService.emitError(error);
                }
            );

        }
    }

    private updateStoreControl(action: string): void {
        this.store.dispatch({
            type: ActionTypes[action],
            payload: { formParent: this.maintenanceProspectSearchFormGroup }
        });
    }
    /**
     * Method calls after changing option values in menu
     */
    public menuOnchange(menuOptionValue: any): void {

        switch (menuOptionValue) {
            case 'NatAxJobServiceCover':
                this._router.navigate(['application/mnAtAxJobServiceCover'], {
                    queryParams: {
                        'parentMode': 'Prospect',
                        'ProspectNumber': this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].value
                    }
                });
                break;
            case 'GoToJob':
                if (this.allFormControls[0]['formGeneral'].controls['ConvertedToNumber'].value !== '') {
                    this._router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE],
                        {
                            queryParams: {
                                parentMode: 'ServiceCover',
                                'AccountNumber': this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value,
                                'CurrentContractTypeURLParameter': this.riExchange.getCurrentContractType(),
                                'ContractNumber': this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value,
                                'ConvertedToNumber': this.maintenanceProspectSearchFormGroup.controls['ConvertedToNumber'].value
                            }
                        });
                }
                break;
            case 'Diary':
                this._router.navigate(['prospecttocontract/maintenance/diary'], {
                    queryParams: {
                        'parentMode': 'ProspectEntry',
                        'DiaryProspectnumber': this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].value
                    }
                });
                break;
            case 'WorkOrders':
                this._router.navigate([InternalGridSearchServiceModuleRoutes.ICABSCMWORKORDERGRID], {
                    queryParams: {
                        'parentMode': 'ProspectEntry',
                        'ProspectNumber': this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].value,
                        'AssignToEmployeeCode': this.allFormControls[0]['formPremise'].controls['AssignToEmployeeCode'].value || '',
                        'AssignToEmployeeName': this.allFormControls[0]['formPremise'].controls['AssignToEmployeeName'].value || ''
                    }
                });
                break;
            case 'Contacts':
                break;
            case 'TeleSalesOrder':
                this._router.navigate(['/ccm/customerContact/telesalesordergrid'], {
                    queryParams: {
                        'parentMode': 'ProspectTeleSalesOrder',
                        'ProspectNumber': this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].value
                    }
                });
                break;
        }
        if (menuOptionValue) {
            this.ls.store(this.pageId + 'routeParams', this.systemChars.routeParams);
            this.ls.store(this.pageId + 'ProspectNumber', this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].value);
            this.ls.store(this.pageId + 'isReturningFlag', 'True');
        }

    }
    /**
     * Confirm prompt before saving record
     */

    public promptConfirm(event: any): void {
        let formdData: any = {};
        for (let c in this.allFormControls[0]['formPremise'].controls) {
            if (this.allFormControls[0]['formPremise'].controls.hasOwnProperty(c)) {
                if (c === 'LOSCodeSelect') {
                    formdData['LOSCode'] = this.allFormControls[0]['formPremise'].controls[c].value;
                } else if (c === 'BusinessSourceCodeSelect') {
                    formdData['BusinessSourceCode'] = this.allFormControls[0]['formPremise'].controls[c].value;

                } else if (c === 'BusinessOriginCodeSelect') {
                    formdData['BusinessOriginCode'] = this.allFormControls[0]['formPremise'].controls[c].value;

                } else if (this.isTypeConvertionRequired(c)) {
                    if (this.allFormControls[0]['formPremise'].controls[c].value !== '0')
                        formdData[c] = this.parseToFixedType(this.allFormControls[0]['formPremise'].controls[c].value, this.controlType[c]);
                    else
                        formdData[c] = 0;

                } else if (c === 'BusinessOriginDetailCodeSelect') {
                    if (this.allFormControls[0]['formPremise'].controls[c].value)
                        formdData['BusinessOriginDetailCode'] = this.allFormControls[0]['formPremise'].controls[c].value;
                    else
                        formdData['BusinessOriginDetailCode'] = '';
                } else if (this.allFormControls[0]['formPremise'].controls[c].value === null) {
                    this.allFormControls[0]['formPremise'].controls[c].setValue('');
                    if (c.match(new RegExp('BranchNumber', 'i'))) {
                        this.allFormControls[0]['formPremise'].controls[c].setValue(0);
                    }
                } else {
                    if (typeof this.allFormControls[0]['formPremise'].controls[c].value !== 'undefined') {
                        if (this.isRequireService(c)) {
                            formdData[c] = this.allFormControls[0]['formPremise'].controls[c].value;
                        }
                    }

                }

                this.allFormControls[0]['formPremise'].controls[c].markAsTouched();
            }

        }

        for (let c in this.allFormControls[1]['formGeneral'].controls) {
            if (this.allFormControls[1]['formGeneral'].controls.hasOwnProperty(c)) {
                if (this.isRequireService(c)) {
                    if (this.isTypeConvertionRequired(c)) {
                        formdData[c] = this.parseToFixedType(this.allFormControls[1]['formGeneral'].controls[c].value, this.controlType[c]);
                    } else {
                        formdData[c] = (this.allFormControls[1]['formGeneral'].controls[c].value) === null ? '' : this.allFormControls[1]['formGeneral'].controls[c].value;
                    }
                    this.allFormControls[1]['formGeneral'].controls[c].markAsTouched();
                }
            }
        }

        for (let c in this.allFormControls[2]['formAccount'].controls) {
            if (this.allFormControls[2]['formAccount'].controls.hasOwnProperty(c)) {
                if (this.isRequireService(c)) {
                    if (this.isTypeConvertionRequired(c)) {
                        formdData[c] = this.parseToFixedType(this.allFormControls[2]['formAccount'].controls[c].value, this.controlType[c]);
                    } else {
                        formdData[c] = (this.allFormControls[2]['formAccount'].controls[c].value) === null ? '' : this.allFormControls[2]['formAccount'].controls[c].value;
                    }
                    this.allFormControls[2]['formAccount'].controls[c].markAsTouched();
                }
            }
        }
        if (this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].value)
            formdData['ProspectNumber'] = this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].value;
        else
            formdData['ProspectNumber'] = '';

        formdData['AccountNumber'] = this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value;
        formdData['ContractNumber'] = this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value;
        formdData['PremiseNumber'] = this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].value;
        if (this.systemChars.routeParams) {
            if (this.prospectROWID && this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].value !== '' && this.customBusinessObject.Update) {
                this.updateProspect(formdData);
            } else {
                formdData['LoggedInBranchNumber'] = this.systemChars['LoggedInBranchNumber'];
                formdData['ProspectTypeDesc'] = this.systemChars.ProspectTypeDesc;
                this.addProspect(formdData);
            }
        }

    }
    private isTypeConvertionRequired(c: string): boolean {
        let returnFlag: boolean = false;
        for (let key in this.controlType) {
            if (this.controlType.hasOwnProperty(key)) {
                if (key === c) {
                    returnFlag = true;
                    break;
                }
            }
        }
        return returnFlag;
    }

    private parseToFixedType(value: any, type: string): any {
        let returnValue: any = value;
        switch (type) {
            case 'eTypeTime':
                returnValue = this.globalize.parseTimeToFixedFormat(value);
                break;
            case 'eTypeCurrency':
                returnValue = this.globalize.parseCurrencyToFixedFormat(value);
                break;
            case 'eTypeInteger':
                returnValue = this.globalize.parseIntegerToFixedFormat(value);
                break;
            case 'eTypeDecimal1':
                returnValue = this.globalize.parseDecimalToFixedFormat(value, 1);
                break;
            case 'eTypeDate':
                returnValue = this.globalize.parseDateToFixedFormat(value);
                break;
            default:
                break;
        }
        return (returnValue === null) ? '' : returnValue;
    }
    /**
     * Prospect number look up to update prospect
     */
    public prospectLookUp(Obj: any = {}): void {
        if (this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].valid || this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].disabled) {
        this.customBusinessObject.Update = true;
        this.systemChars.updateOrigin = true;
        this.systemChars.customBusinessObject = this.customBusinessObject;
        if (Obj.type && Obj.type === 'fetch') {
            this.fetchProspect();
        } else {
            this.populateProspect();
        }
        this.saveStore(ActionTypes.SAVE_SYSTEM_PARAMETER);
        }
    }

    /**
     * After fetch prospect
     */

    public afterFetch(): void {
        let currentURL = window.location.href, data: any = {};
        data['ProspectNumber'] = this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].value;
        data['ProspectTypeDesc'] = this.systemChars.ProspectTypeDesc;
        data['LoggedInBranchNumber'] = this.systemChars['LoggedInBranchNumber'];
        this.queryParam = new URLSearchParams();
        this.queryParam.set(this.serviceConstant.Action, '6');
        this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (currentURL.match(new RegExp('Prospect', 'i'))) {
            this.queryParam.set('Function', 'CheckValidProspect,GetDefaultValues');
        } else {
            this.queryParam.set('Function', 'CheckValidProspect');
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam, data)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                    this.customBusinessObject.Enable = false;
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorModal.show(e, true);
                        this.customBusinessObject.Update = false;
                    } else {
                        this.customBusinessObject.Enable = true;
                        this.storeData['methods'] = [];
                        this.enableAllProspect();
                        this.storeData['methods'] = ['enableAllPremise', 'enableAllGeneral', 'enableAllAccount', 'beforeUpdate', 'updatePremiseData', 'updateGeneralData', 'updateBusinessOrigin', 'setAccountRelatedInfo'];
                        this.saveStore(ActionTypes.EXCHANGE_METHOD);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public onPremiseDataReceived(data: any, route: any): void {
        this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].setValue(data.PremiseNumber);
        this.populatePremiseAccountdata();
    }

    public premiseNumberChange(): void {
        if (this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].value && this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value) {
            this.populatePremiseAccountdata();
        }
    }

    public onPremiseAccounSearchDataReceived(data: any): void {
        this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].setValue(data.PremiseNumber);
        this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].setValue(data.ContractNumber);
        this.populatePremiseAccountdata();
    }


    private populatePremiseAccountdata(): void {
        this.queryParam = new URLSearchParams();
        this.queryParam.set(this.serviceConstants.Action, '6');
        this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParam.set('ContractNumber', this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value);
        this.queryParam.set('PremiseNumber', this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].value);
        this.queryParam.set('Function', 'GetPremiseDetails,GetAccountDetails');
        this.httpService.makeGetRequest(this.queryParamsProspect['method'], this.queryParamsProspect['module'], this.queryParamsProspect['operation'], this.queryParam).subscribe(
            (data) => {
                try {
                    if (data.errorMessage) {
                        this.errorModal.show(data, true);
                    } else {
                        for (let cntrl in data) {
                            if (data.hasOwnProperty(cntrl)) {
                                if (this.allFormControls[0]['formPremise'].controls[cntrl]) {
                                    this.allFormControls[0]['formPremise'].controls[cntrl].setValue(data[cntrl]);
                                }
                                else if (this.allFormControls[1]['formGeneral'].controls[cntrl]) {
                                    this.allFormControls[1]['formGeneral'].controls[cntrl].setValue(data[cntrl]);
                                }
                                else if (this.allFormControls[2]['formAccount'].controls[cntrl]) {
                                    this.allFormControls[2]['formAccount'].controls[cntrl].setValue(data[cntrl]);
                                } else if (this.maintenanceProspectSearchFormGroup.controls[cntrl]) {
                                    this.maintenanceProspectSearchFormGroup.controls[cntrl].setValue(data[cntrl]);
                                } else if (cntrl === 'BusinessSourceCode') {
                                    this.allFormControls[0]['formPremise'].controls['BusinessSourceCodeSelect'].setValue(data[cntrl]);
                                } else if (cntrl === 'BusinessOriginCode') {
                                    this.allFormControls[0]['formPremise'].controls['BusinessOriginCodeSelect'].setValue(data[cntrl]);
                                } else if (cntrl === 'BusinessOriginDetailCode') {
                                    this.allFormControls[0]['formPremise'].controls['BusinessOriginDetailCodeSelect'].setValue(data[cntrl]);
                                } else if (cntrl === 'LOSCode') {
                                    this.allFormControls[0]['formPremise'].controls['LOSCodeSelect'].setValue(data[cntrl]);
                                }

                            }
                        }
                        let currentURL = window.location.href;
                        if (currentURL.match(new RegExp('Prospect', 'i'))) {
                            this.allFormControls[0]['formPremise'].controls['AssignToEmployeeCode'].setValue(data['ServicingSalesEmployeeCode']);
                            if (data['ServicingSalesEmployeeCode'])
                                this.getEmployeeName(data['ServicingSalesEmployeeCode'], 'AssignToEmployeeName');
                            if (data['PDALeadEmployeeCode'])
                                this.getEmployeeName(data['PDALeadEmployeeCode'], 'PDALeadEmployeeSurname');
                            this.getCustomerTypeDesc();
                            if (this.systemChars.vSICCodeEnable) {
                                this.getSICDescription();
                            }
                        } else {
                            this.getPaymentType();
                            this.getBranch();
                            if (data['NegotiatingSalesEmployeeCode'])
                                this.getEmployeeName(data['NegotiatingSalesEmployeeCode'], 'NegotiatingSalesEmployeeSurname');
                            if (data['ServicingSalesEmployeeCode'])
                                this.getEmployeeName(data['ServicingSalesEmployeeCode'], 'ServicingSalesEmployeeSurname');
                        }
                        this.getContactMediumDesc();
                        this.getStatusDesc();
                        this.getCustomerTypeDesc();
                        this.postcodePopulate();
                    }
                    let parentMode = this.riExchange.ParentMode(this.systemChars.routeParams);
                    if (parentMode === 'CallCentreSearch' || parentMode === 'CallCentreSearchNew' || parentMode === 'CallCentreSearchNewExisting') {
                        this.allFormControls[0]['formPremise'].controls['PremiseContactName'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'CallContactName'));
                        this.allFormControls[0]['formPremise'].controls['PremiseContactPosition'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'CallContactPosition'));
                        this.allFormControls[0]['formPremise'].controls['PremiseContactTelephone'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'CallContactTelephone'));
                        this.allFormControls[0]['formPremise'].controls['PremiseContactMobile'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'CallContactMobile'));
                        this.allFormControls[0]['formPremise'].controls['PremiseContactFax'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'CallContactFax'));
                        this.allFormControls[0]['formPremise'].controls['PremiseContactEmail'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemChars.routeParams, 'CallContactEmail'));
                    }
                    this.storeData['methods'] = [];
                    this.storeData['methods'] = ['setAccountRelatedInfo'];
                    this.saveStore(ActionTypes.EXCHANGE_METHOD);
                } catch (error) {
                    //  this.errorService.emitError(error);
                }//

            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }



    private isRequireService(field: string): boolean {
        let excludeList = ['ContactMediumDesc', 'AssignToEmployeeCode', 'AssignToEmployeeName',
            'CommenceDate', 'ContractExpiryDate', 'AnnualValue', 'PaymentDesc', 'NegotiatingSalesEmployeeCode',
            'NegotiatingSalesEmployeeSurname', 'ServicingSalesEmployeeSurname', 'CustomerTypeDesc', 'SICDescription',
            'PaymentTypeCode', 'chkAuthorise', 'ProspectStatusDesc', 'chkReject', 'chkBranch'];
        return excludeList.indexOf(field) === -1 ? true : false;
    }

    public postcodePopulate(): void {
        this.queryParam.set(this.serviceConstants.Action, '6');
        this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParam.set('PremisePostcode', this.allFormControls[0]['formPremise'].controls['PremisePostcode'].value);
        if (this.allFormControls[0]['formPremise'].controls['PremiseAddressLine4'].value)
            this.queryParam.set('PremiseAddressLine4', this.allFormControls[0]['formPremise'].controls['PremiseAddressLine4'].value);
        if (this.allFormControls[0]['formPremise'].controls['PremiseAddressLine5'].value)
            this.queryParam.set('PremiseAddressLine5', this.allFormControls[0]['formPremise'].controls['PremiseAddressLine5'].value);
        if (this.allFormControls[0]['formPremise'].controls['LOSCodeSelect'].value)
            this.queryParam.set('LOSCode', this.allFormControls[0]['formPremise'].controls['LOSCodeSelect'].value);
        this.queryParam.set('Function', 'GetAssignToSalesDetails');

        this.httpService.makeGetRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam).subscribe(
            (data) => {
                try {
                    if (!data.errorMessage) {
                        if (!this.allFormControls[0]['formPremise'].controls['AssignToEmployeeCode'].value)
                            this.allFormControls[0]['formPremise'].controls['AssignToEmployeeCode'].setValue(data.ServicingSalesEmployeeCode);
                        if (!this.allFormControls[0]['formPremise'].controls['AssignToEmployeeName'].value)
                            this.allFormControls[0]['formPremise'].controls['AssignToEmployeeName'].setValue(data.AssignToEmployeeName);
                        if (!this.allFormControls[0]['formPremise'].controls['DefaultAssigneeEmployeeDetails'].value)
                            this.allFormControls[0]['formPremise'].controls['DefaultAssigneeEmployeeDetails'].setValue(data.DefaultAssigneeEmployeeDetails);
                        if (!this.allFormControls[0]['formPremise'].controls['ServicingSalesEmployeeCode'].value)
                            this.allFormControls[0]['formPremise'].controls['ServicingSalesEmployeeCode'].setValue(data.ServicingSalesEmployeeCode);
                        if (data.ServiceBranchNumber)
                            this.allFormControls[0]['formPremise'].controls['ServiceBranchNumber'].setValue(data.ServiceBranchNumber);
                        else
                            this.allFormControls[0]['formPremise'].controls['ServiceBranchNumber'].setValue('0');
                        if (data.SalesBranchNumber)
                            this.allFormControls[0]['formPremise'].controls['SalesBranchNumber'].setValue(data.SalesBranchNumber);
                        else
                            this.allFormControls[0]['formPremise'].controls['SalesBranchNumber'].setValue('0');
                        if (data.BranchNumber)
                            this.allFormControls[0]['formPremise'].controls['BranchNumber'].setValue(data.BranchNumber);
                        else
                            this.allFormControls[0]['formPremise'].controls['BranchNumber'].setValue('0');
                    } else {
                        this.errorModal.show(data, true);
                    }

                } catch (error) {
                    //this.errorService.emitError(error);
                }

            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }

    //CR implementaion
    public canDeactivate(): Observable<boolean> {
        let isDirty: boolean = (this.maintenanceProspectSearchFormGroup && this.maintenanceProspectSearchFormGroup.dirty)
            || (this.allFormControls[0]['formPremise'] && this.allFormControls[0]['formPremise'].dirty)
            || (this.allFormControls[1]['formGeneral'] && this.allFormControls[1]['formGeneral'].dirty)
            || (this.allFormControls[2]['formAccount'] && this.allFormControls[2]['formAccount'].dirty);
        this.routeAwayGlobals.setSaveEnabledFlag(isDirty);
        return this.routeAwayComponent.canDeactivate();
    }

    public onSaveFocus(e: any): void {
        let nextTab: number = 0;
        let code = (e.keyCode ? e.keyCode : e.which);
        let elemList = document.querySelectorAll('.tab-container .nav-tabs li a');
        let currentSelectedIndex = Array.prototype.indexOf.call(elemList, document.querySelector('.tab-container .nav-tabs li a.active'));
        if (code === 9 && currentSelectedIndex < (elemList.length - 1)) {
            let click = new CustomEvent('click', { bubbles: true });
            nextTab = currentSelectedIndex + 1;
            this.tabProspect.tabFocusTo(nextTab);
            setTimeout(() => {
                document.querySelector('.tab-pane.active input:not([disabled]), .tab-pane.active select:not([disabled])')['focus']();
            }, 100);
        }
        return;
    }

    public onMessageClose(): void {
        //
    }

    public cancelClick(): void {
        this.resetData();
    }

    private resetData(): void {
        if (this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].value !== '' && this.customBusinessObject.Update) {
            this.prospectLookUp();
            this.autoOpenProspectSearch = false;
        } else {
            this.allFormControls[0]['formPremise'].reset();
            this.allFormControls[1]['formGeneral'].reset();
            this.allFormControls[2]['formAccount'].reset();
            this.maintenanceProspectSearchFormGroup.reset();
            if (this.fromEllipsis === false) {
                this.autoOpenProspectSearch = true;
                this.prospectSearchEllipsis.openModal();
                this.disableAllProspect();
                this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].enable();
                this.prospectDisabled = false;
                this.storeData['methods'] = ['resetPremiseData', 'resetGrneralData', 'disableAllPremise', 'disableAllGeneral', 'disableAllAccount'];
                this.saveStore(ActionTypes.EXCHANGE_METHOD);
            } else {
                this.storeData['methods'] = ['resetPremiseData', 'resetGrneralData'];
                this.saveStore(ActionTypes.EXCHANGE_METHOD);
            }
            this.fromEllipsis = false;
        }
    }


    public disableAllProspect(): void {
        for (let c in this.maintenanceProspectSearchFormGroup.controls) {
            if (this.maintenanceProspectSearchFormGroup.controls.hasOwnProperty(c)) {
                if (c !== 'ProspectNumber')
                    this.maintenanceProspectSearchFormGroup.controls[c].disable();
            }
        }
        for (let p in this.ellipsisDisable) {
            if (this.ellipsisDisable.hasOwnProperty(p)) {
                this.ellipsisDisable[p] = true;
            }
        }
        this.fieldDisable.cancel = true;
        this.fieldDisable.optionDisable = true;
        this.fieldDisable.copy = true;
        this.fieldDisable.save = true;
    }

    public enableAllProspect(): void {
        for (let c in this.maintenanceProspectSearchFormGroup.controls) {
            if (this.maintenanceProspectSearchFormGroup.controls.hasOwnProperty(c)) {
                if (c !== 'ProspectNumber')
                    this.maintenanceProspectSearchFormGroup.controls[c].enable();
            }
        }
        for (let p in this.ellipsisDisable) {
            if (this.ellipsisDisable.hasOwnProperty(p)) {
                this.ellipsisDisable[p] = false;
            }
        }
        this.maintenanceProspectSearchFormGroup.controls['ProspectNumber'].disable();
        this.fieldDisable.cancel = false;
        this.fieldDisable.optionDisable = false;
        if (this.customBusinessObject.Update === false) {
            this.fieldDisable.optionDisable = true;
            this.ellipsisDisable['premiseEllipsis'] = false;
            this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].enable();
        }
        else {
            this.fieldDisable.optionDisable = false;
        }

        this.fieldDisable.save = false;
        this.fieldDisable.copy = false;
    }

    private updateSearchFeildsRequired(): void {
        if (!this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value && !this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value) {
            this.isAccountRequired = false;
            this.isContractNumberRequired = false;
            this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].clearValidators();
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].clearValidators();
            this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].setValidators(this.utils.commonValidate);
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].setValidators(this.utils.commonValidate);
        }
        else if (this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].value) {
            this.isAccountRequired = true;
            this.isContractNumberRequired = true;
            this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].setValidators([Validators.required, this.utils.commonValidate]);
            this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].setValidators([Validators.required, this.utils.commonValidate]);
        } else if (this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].value) {
            this.isContractNumberRequired = true;
            this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].setValidators([Validators.required, this.utils.commonValidate]);
        }
        this.maintenanceProspectSearchFormGroup.controls['PremiseNumber'].setValidators(this.utils.commonValidate);
        this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].updateValueAndValidity();
        this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].updateValueAndValidity();
        this.maintenanceProspectSearchFormGroup.controls['ContractNumber'].markAsTouched();
        this.maintenanceProspectSearchFormGroup.controls['AccountNumber'].markAsTouched();
    }
}
