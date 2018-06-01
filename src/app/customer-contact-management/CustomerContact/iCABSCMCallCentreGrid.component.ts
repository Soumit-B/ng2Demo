import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Injector, Renderer } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import { NavigationStart, NavigationEnd } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { GridComponent } from './../../../shared/components/grid/grid';
import { HttpService } from '../../../shared/services/http-service';
import { ErrorService } from '../../../shared/services/error.service';
import { NavData } from '../../../shared/services/navigationData';
import { RiExchange } from '../../../shared/services/riExchange';
import { CBBService } from '../../../shared/services/cbb.service';
import { MessageService } from '../../../shared/services/message.service';
import { VariableService } from '../../../shared/services/variable.service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { SysCharConstants } from '../../../shared/constants/syscharservice.constant';
import { SpeedScriptConstants } from '../../../shared/constants/speed-script.constant';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { CallCenterActionTypes } from '../../actions/call-centre-search';
import { Utils } from '../../../shared/services/utility';
import { Subject } from 'rxjs/Subject';
import { InternalGridSearchModuleRoutes, AppModuleRoutes, CCMModuleRoutes, InternalGridSearchApplicationModuleRoutes, InternalGridSearchServiceModuleRoutes, InternalMaintenanceServiceModuleRoutes, InternalMaintenanceApplicationModuleRoutes } from './../../base/PageRoutes';

// Tabs component import
import { CallCenterGridAccountsComponent } from '../CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridAccounts.component';
import { CallCenterGridCallLogsComponent } from '../CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridCallLogs.component';
import { CallCenterGridContractsComponent } from '../CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridContracts.component';
import { CallCenterGridDashboardComponent } from '../CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridDashboard.component';
import { CallCenterGriddlContractComponent } from '../CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGriddlContract.component';
import { CallCenterGridEventHistoryComponent } from '../CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridEventHistory.component';
import { CallCenterGridHistoryComponent } from '../CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridHistory.component';
import { CallCenterGridInvoicesComponent } from '../CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridInvoices.component';
import { CallCenterGridPremisesComponent } from '../CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridPremises.component';
import { CallCenterGridWorkOrdersComponent } from '../CustomerContact/CallCenterGridComponents/iCABSCMCallCentreGridWorkOrders.component';


@Component({
  selector: 'icabs-call-center-grid',
  templateUrl: 'iCABSCMCallCentreGrid.html',
  styles: [`
    .tabs-cont {
      min-height: 400px;
    }

    /deep/ icabs-grid *:read-only, [readonly],[type='readonly'] {
      -webkit-user-select:none;
      -moz-user-select:none;
      -ms-user-select:none;
      user-select:none;
    }

  `]
})

export class CallCentreGridComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('promptModal') public promptModal;
  @ViewChild('errorModal') public errorModal;
  @ViewChild('messageModal') public messageModal;
  public controls: Array<any> = [];
  public pageId: string = PageIdentifier.ICABSCMCALLCENTREGRID;
  public tabs: Array<any> = [];
  public componentList: Array<any> = [];
  public formGroup: FormGroup;
  public countryCodeList: Array<any>;
  public businessCodeList: Array<any>;
  public fieldVisibility: any = {
    CountryCode: true,
    BusinessCode: true,
    AccountProspectNumber: true,
    AccountProspectName: true,
    VisibleCurrentCallLogID: true,
    AccountProspectContactName: true,
    TdContactManagementWarning: false,
    TdBlankWarning: false,
    CmdEmployee: true,
    CmdNotepad: true,
    CmdNewCall: false,
    CmdEndCall: true,
    CmdUpdateAccount: true,
    CmdUpdateProspect: true,
    CmdNewCContact: true,
    CmdViewEmployee: true
  };
  public list: any = {
    ContractType: '',
    ContractTypeDesc: '',
    ContractStatusCode: '',
    ContractStatusCodeDesc: '',
    PremiseStatusCode: '',
    PremiseStatusCodeDesc: ''
  };
  public queryCallCentre: URLSearchParams = new URLSearchParams();
  public queryParamsCallCenter: any = {
    action: '0',
    operation: 'ContactManagement/iCABSCMCallCentreGrid',
    module: 'call-centre',
    method: 'ccm/maintenance',
    contentType: 'application/x-www-form-urlencoded'
  };
  public promptTitle: string = '';
  public promptContent: string = '';
  public businessData: any = {};
  public showMessageHeader: boolean = true;
  public showErrorHeader: boolean = true;
  private loggedInBranch: string = '';
  private regSection: string = 'Contact Centre Search';
  private registry: any = {
    giLoop: '',
    gcBusinessCode: '',
    gcContractTypeCodes: '',
    gcContractTypeDescs: '',
    gcContractPortfolioStatusCodes: '',
    gcContractPortfolioStatusDescs: '',
    gcPremisePortfolioStatusCodes: '',
    gcPremisePortfolioStatusDescs: '',
    gcPortfolioStatusDesc: '',
    gcDefaultAccountSearch: '',
    gcDefaultAccountContractType: '',
    gcDefaultLiveAccount: '',
    gcDefaultNationalAccount: '',
    gcDefaultNationalAccountWhenInBr: '',
    gcDefaultAccountSearchType: '',
    gcDefaultContractType: '',
    gcDefaultContractPortfolioStatus: '',
    gcAccountPassLiveAccount: '',
    gcAccountPassContractType: '',
    gcAccountPassSearchTypeValue: '',
    gcShowNotepadWhenEndCall: '',
    gcDefaultBusinessOriginCode: '',
    gcDefaultBusinessOriginDesc: '',
    gcDefaultContactMediumCode: '',
    gcDefaultContactMediumDesc: '',
    gcDefaultProspectSourceCode: '',
    gcDefaultProspectTypeCode: '',
    gcDefaultCallSearchType: '',
    gcCallLogStartDateDays: '',
    giCallDateDays: '',
    gcWODateFromDays: '',
    giWOFromDays: '',
    gcWODateToDays: '',
    giWOToDays: '',
    gcDefaultEventHistorySearchType: '',
    gcEventHistoryDateFromDays: '',
    giEventHistoryFromDays: '',
    gcEventHistoryDateToDays: '',
    gcDefaultHistorySearchType: '',
    gcHistoryDateFromDays: '',
    giHistoryFromDays: '',
    gcHistoryDateToDays: '',
    giHistoryToDays: '',
    gcSelectedOption: '',
    gcPermissionDeniedMessage: '',
    glLimitEmployeeDataView: '',
    gcCountryDataList: '',
    gcOccupationCodeList: '',
    gcEmployeeLimitChildDrillOptions: '',
    gcWarnNewSearchAndCurrentLogID: '',
    gcShowAdvantageQuotes: '',
    gcContractPremiseSearchDelim: '',
    glSCEnableAddressLine3: '',
    glSCShowInfestations: '',
    glShowRecommendations: '',
    giContractCommenceFromDays: '',
    giPremiseCommenceFromDays: '',
    gcContractCommenceDateFromDays: '',
    gcPremiseCommenceDateFromDays: '',
    giContractCommenceToDays: '',
    giPremiseCommenceToDays: '',
    gcContractCommenceDateToDays: '',
    gcPremiseCommenceDateToDays: '',
    glShowInvoiceBalance: '',
    giNumBusinesses: '',
    glMultiContactInd: ''
  };
  private syschars: any = {
    glSCEnableAddressLine3: '',
    glSCShowInfestations: '',
    glLimitEmployeeDataView: '',
    gcCountryDataList: '',
    glLimitOccupationEmployeeDataView: '',
    gcOccupationCodeList: ''
  };
  private webSpeedVariables: any = {
    lRefreshAccountGrid: false,
    lRefreshDashboardGrid: true,
    lRefreshContractGrid: true,
    lRefreshPremiseGrid: true,
    lRefreshInvoiceGrid: true,
    lRefreshCallLogGrid: true,
    lRefreshEventHistoryGrid: true,
    lRefreshHistoryGrid: true,
    lRefreshWorkOrderGrid: true,
    lRefreshdlContractGrid: true,
    lClosingLogBeforeProceed: false,
    lRunningFromWOMaintTask: false,
    lForceWindowClose: false,
    cIsPropertyCareBranch: ''
  };
  private otherVariables: any = {
    ConstAccountNoMaxLength: 9,
    ConstContractNoMaxLength: 8,
    ConstAccountSearchValueMaxLength: 40,
    CCMChangesMade: '',
    CurrentCallLogID: '',
    CurrentTabView: 'Initial',
    BusinessCode: '',
    ContractROWID: '',
    PremiseROWID: '',
    AccountNumber: '',
    ProspectNumber: '',
    AccountNumberType: 'A',
    ContractNumber: '',
    ContractName: '',
    ContractType: '',
    PremiseNumber: '',
    SelectedAddressLine4: '',
    SelectedAddressLine5: '',
    SelectedPostcode: '',
    ContractContactEmail: '',
    WONumber: '',
    PassContactRowID: '',
    PassProspectNumber: '',
    SelectedInvoice: '',
    SelectedInvoiceRowID: '',
    InvSelectedContract: '',
    InvSelectedPremise: '',
    CallLogSelectedContract: '',
    CallLogSelectedPremise: '',
    CustomerContactNumber: '',
    SelectedTicketNumber: '',
    ParentTaskTicketNumber: '',
    TicketAddressName: '',
    TicketAddressLine1: '',
    TicketAddressLine2: '',
    TicketAddressLine3: '',
    TicketAddressLine4: '',
    TicketAddressLine5: '',
    TicketProspectNumber: '',
    TicketServiceCoverNumber: '',
    TicketServiceCoverRowID: '',
    TicketShortDescription: '',
    TicketComments: '',
    CustomerContactRowID: '',
    WOSelectedContract: '',
    WOSelectedPremise: '',
    dlContractSelectedContract: '',
    dlContractSelectedPremise: '',
    WORunType: '',
    ProductCode: '',
    ProductDesc: '',
    ServiceCoverNumber: '',
    ServiceCoverROWID: '',
    EventHistorySelectedContract: '',
    EventHistorySelectedPremise: '',
    HistorySelectedContract: '',
    HistorySelectedPremise: '',
    LiveAccount: '',
    CurrentEventHistoryType: '',
    CurrentEventHistoryRowid: '',
    CurrentHistoryType: '',
    CurrentHistoryRowid: '',
    SelectedCallLogID: '',
    TechEmployeeCode: '',
    BusinessOriginCode: '',
    BusinessOriginDesc: '',
    ContactMediumCode: '',
    ContactMediumDesc: '',
    ProspectSourceCode: '',
    ProspectTypeCode: '',
    WindowClosingName: '',
    CallContactName: '',
    CallContactPosition: '',
    CallContactTelephone: '',
    CallContactFax: '',
    CallContactMobile: '',
    CallContactEmail: '',
    CallContactPostcode: '',
    CallTicketReference: '',
    CallNotepadSummary: '',
    NotificationCloseType: '0',
    CallNotepad: '',
    EmployeeLimitChildDrillOptions: '',
    ServiceDateStartFrom: '',
    ServiceDateStartTo: '',
    WORecommendationsExist: '',
    CreateCallLogInCCMInd: '',
    AccountLimitDataView: '',
    ContractLimitDataView: '',
    PremiseLimitDataView: ''
  };
  private queryLookUp: URLSearchParams = new URLSearchParams();
  private querySysChar: URLSearchParams = new URLSearchParams();
  private pageQueryParams: any;
  private storeData: any = {};
  private storeFormDataClone: any = {
    main: {},
    tabAccounts: {},
    tabLogs: {},
    tabContracts: {},
    tabDashboard: {},
    tabDlContract: {},
    tabEventHistory: {},
    tabHistory: {},
    tabInvoices: {},
    tabPremises: {},
    tabWorkOrders: {},
    state: {
      main: {},
      tabAccounts: {},
      tabLogs: {},
      tabContracts: {},
      tabDashboard: {},
      tabDlContract: {},
      tabEventHistory: {},
      tabHistory: {},
      tabInvoices: {},
      tabPremises: {},
      tabWorkOrders: {}
    },
    pagination: {}
  };
  private tabsTranslation: any = {
    tabAccounts: '',
    tabLogs: '',
    tabContracts: '',
    tabDashboard: '',
    tabDlContract: '',
    tabEventHistory: '',
    tabHistory: '',
    tabInvoices: '',
    tabPremises: '',
    tabWorkOrders: '',
    advantage: ''
  };
  private subject: any = {
    CmdNewCallRecieved: '',
    CmdNewCallSent: ''
  };
  private cloneData: any = {
    dropdownList: null,
    fieldVisibility: null
  };
  private registryClone: any;
  private isFreshLoad: boolean = true;
  private isNavAway: boolean = false;
  private routerSubscriptionInternal: Subscription;
  private userCode: string = '';
  constructor(injector: Injector, private titleService: Title, private fb: FormBuilder, private SysCharConstants: SysCharConstants, private SpeedScriptConstants: SpeedScriptConstants, private renderer: Renderer, private variableService: VariableService) {
    super(injector);
    this.storeSubscription = this.store.select('callcentresearch').subscribe(data => {
      this.storeData = data;
      if (this.storeData['fieldVisibility'] && this.storeData['fieldVisibility'].main) {
        this.fieldVisibility = this.storeData['fieldVisibility'].main;
      }
      if (data && data['action']) {
        switch (data['action']) {
          case CallCenterActionTypes.INITIALIZATION:
            if (data && data['initialization']) {
              if (data['initialization'].tabAccounts === true && data['initialization'].tabContracts === true && data['initialization'].tabLogs === true && data['initialization'].tabDashboard === true && data['initialization'].tabEventHistory === true && data['initialization'].tabHistory === true && data['initialization'].tabInvoices === true && data['initialization'].tabPremises === true && data['initialization'].tabWorkOrders === true && data['initialization'].tabDlContract === true) {
                this.postInitialization();
              }
            }
            break;
          case CallCenterActionTypes.PORTFOLIO_CONTACT_DETAILS:
            this.portfolioContactDetails(this.storeData['functionParams']);
            break;
          case CallCenterActionTypes.BUILD_TABS:
            this.buildTabs();
            break;
          case CallCenterActionTypes.DISPLAY_ERROR:
            this.errorService.emitError({
              errorMessage: this.storeData['errorMessage']
            });
            break;

          case CallCenterActionTypes.DISPLAY_MESSAGE:
            this.messageService.emitMessage({
              msg: this.storeData['message'],
              title: 'Message'
            });
            break;
          case CallCenterActionTypes.DISPLAY_PROMPT_ERROR:
            this.promptModal.show();
            break;
          case CallCenterActionTypes.SHOW_PRINT_INVOICE:
            this.showInvoiceToScreen(this.storeData['printInvoice']);
            break;
          case CallCenterActionTypes.SHOW_EMAIL_INVOICE:
            this.showInvoiceViaEmail(this.storeData['emailInvoice']);
            break;
          case CallCenterActionTypes.RESET_ALL_SEARCH_DETAILS:
            this.resetAllSearchDetails();
            break;

          case CallCenterActionTypes.RESET_CALL_DETAILS:
            this.resetCallDetails();
            break;
          default:

            break;
        }
        setTimeout(() => {
          this.storeData['action'] = '';
        }, 100);

      }
    });
    if (this.storeData['code'] && this.storeData['code'].business) {
      this.isFreshLoad = false;
    }
    this.storeData['code'].country = this.utils.getCountryCode();
    this.storeData['code'].business = this.utils.getBusinessCode();
    this.userCode = this.utils.getUserCode();
    this.formGroup = this.fb.group({
      CountryCode: [{ value: '', disabled: false }],
      BusinessCode: [{ value: '', disabled: false }],
      AccountProspectNumber: [{ value: '', disabled: true }],
      AccountProspectName: [{ value: '', disabled: true }],
      VisibleCurrentCallLogID: [{ value: '', disabled: false }],
      AccountProspectContactName: [{ value: '', disabled: true }],
      TdContactManagementWarning: [{ disabled: true }],
      TdBlankWarning: [{ disabled: true }],
      CmdUpdateAccount: [{ disabled: true }],
      CmdUpdateProspect: [{ disabled: true }],
      CmdNewCContact: [{ disabled: false }],
      CmdViewEmployee: [{ disabled: true }],
      CmdNotepad: [{ disabled: false }],
      CmdNewCall: [{ disabled: false }],
      CmdEndCall: [{ disabled: false }],
      CmdEmployee: [{ disabled: false }]
    });
    this.uiForm = this.formGroup;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.ajaxSource.next(this.ajaxconstant.START);
    this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
      this.fetchTranslationContent();
    });
    this.httpService.riGetErrorMessage(2715, this.utils.getCountryCode(), this.utils.getBusinessCode()).subscribe((res: any) => {
      if (res !== 0) {
        if (res === ErrorConstant.Message.ErrorMessageNotFound) {
          this.registry['gcPermissionDeniedMessage'] = MessageConstant.Message.PermissionDenied;
        } else {
          this.registry['gcPermissionDeniedMessage'] = res;
        }
      } else {
        this.registry['gcPermissionDeniedMessage'] = MessageConstant.Message.PermissionDenied;
      }
    });
    this.buildTabs();
    if (!this.userCode) {
      this.userCode = this.utils.getUserCode();
    }

    this.pageQueryParams = this.riExchange.getRouterParams();
    this.storeData['code'].multiBusiness = this.utils.getBusinessCode();
    this.countryCodeList = this.cbbService.getCountryList();
    this.businessCodeList = this.cbbService.getBusinessListByCountry(this.storeData['code'].country);
    this.formGroup.controls['CountryCode'].setValue(this.storeData['code'].country);
    this.formGroup.controls['BusinessCode'].setValue(this.storeData['code'].business);
    this.onInit();
    this.store.dispatch({
      type: CallCenterActionTypes.FORM_GROUP, payload: {
        main: this.formGroup
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_VISIBILITY_FIELD, payload: {
        main: this.fieldVisibility
      }
    });
    this.store.dispatch({
      type: CallCenterActionTypes.TABS_TRANSLATION, payload: this.tabsTranslation
    });

    this.routerSubscriptionInternal = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url.indexOf('fromMenu=true') === -1 && event.url.indexOf('/postlogin') === -1 && event.url !== '/') {
          if (!this.variableService.getBackClick()) {
            let data = new NavData();
            data.setPageId(this.pageId);
            this.formClone();
            data.setStoreData(this.storeFormDataClone);
            data.setPageData(this.storeFormDataClone['otherParams'].otherVariables);
            this.riExchange.pushInNavigationData(data);
            if (this.utils.getCountryCode() !== this.storeData['code'].country || this.utils.getBusinessCode() !== this.storeData['code'].business) {
              this.cbbService.setCountryCode(this.storeData['code'].country, true);
              this.cbbService.setBusinessCode(this.storeData['code'].business, false, true);
            }
            this.cbbService.disableComponent(true);
            this.isNavAway = true;
          }
        }
        this.storeData['action'] = '';
        if (this.storeSubscription)
          this.storeSubscription.unsubscribe();

      }

    });
    this.subject['CmdNewCallRecieved'] = new Subject<any>();
    this.subject['CmdNewCallSent'] = new Subject<any>();
    this.storeData['subject'] = this.subject;
    this.subject['CmdNewCallRecieved'].asObservable().subscribe((recieved) => {
      this.cmdNewCallOnClick({}).subscribe((data) => {
        this.subject['CmdNewCallSent'].next(recieved);
      });
    });
  }

  ngAfterViewInit(): void {
    this.setErrorCallback(this);
    this.setMessageCallback(this);
  }

  ngOnDestroy(): void {
    this.store.dispatch({
      type: CallCenterActionTypes.CLEAR_ALL
    });
    super.ngOnDestroy();
    if (this.routerSubscriptionInternal) {
      this.routerSubscriptionInternal.unsubscribe();
    }
    if (this.subject['CmdNewCallRecieved']) {
      this.subject['CmdNewCallRecieved'].unsubscribe();
    }
    if (this.subject['CmdNewCallSent']) {
      this.subject['CmdNewCallSent'].unsubscribe();
    }
  }

  private onInit(): void {
    this.formGroup.controls['CmdUpdateAccount'].disable();
    this.formGroup.controls['CmdUpdateProspect'].disable();
    this.formGroup.controls['CmdNewCContact'].enable();
    this.formGroup.controls['CmdViewEmployee'].disable();
    this.registry.gcEmployeeLimitChildDrillOptions = 'N';
    this.registry.giNumBusinesses = this.businessCodeList.length;
    this.registry.gcContractPortfolioStatusCodes = 'L,FL,FT,PT,T,C';
    this.registry.gcPremisePortfolioStatusCodes = 'L,FL,FT,FD,PT,PD,T,D,C';
    this.registry.gcContractTypeCodes = 'all';
    this.registry.gcDefaultContractType = this.registry.gcContractTypeCodes;
  }

  private postInitialization(): void {
    if (!this.cloneData['dropdownList'] && !this.cloneData['fieldVisibility']) {
      this.cloneData['dropdownList'] = JSON.parse(JSON.stringify(this.storeData['dropdownList']));
      this.cloneData['fieldVisibility'] = JSON.parse(JSON.stringify(this.storeData['fieldVisibility']));
    }
    this.triggerFetchSysChar();
    setTimeout(() => {
      this.setupDisplayOnlyFields();
    }, 0);
    this.storeData['dropdownList'].tabAccounts.AccountContractType = [{
      value: '',
      desc: ''
    }];
    this.storeData['dropdownList'].tabContracts.ContractTypeCode = [{
      value: '',
      desc: ''
    }];
    this.storeData['dropdownList'].tabPremises.PremiseContractTypeCode = [{
      value: '',
      desc: ''
    }];
    this.storeData['dropdownList'].tabInvoices.InvoiceContractTypeCode = [{
      value: '',
      desc: ''
    }];
  }

  public fetchPortfolioDescription(portfolioStatusCodeList: Array<any>): any {
    let portfolioData = [];
    for (let i = 0; i < portfolioStatusCodeList.length; i++) {
      portfolioData.push({
        'table': 'PortfolioStatusLang',
        'query': { 'PortfolioStatusCode': portfolioStatusCodeList[i] },
        'fields': ['PortfolioStatusCode', 'PortfolioStatusDesc']
      });
    }
    return this.lookUpRecord(portfolioData, 100);
  }

  public fetchRegistry(): any {
    let data = [
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account Default Search' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account Default Live Account' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account Default National Account' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account Default National Account (NatAcctBranch)' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account Default Contract Type' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account Passdown Contract Type' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account Passdown Live Account' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account Passdown Search Type Value' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account Default Search Type' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Contract Default Contract Type' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Contract Default Portfolio Status' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Show Notepad On End Call' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Default BusinessOriginCode' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Default ContactMediumCode' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Default ProspectTypeCode' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Default ProspectSourceCode' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'CallLog Default Search Type' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'CallLog DateFrom (Days)' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'WorkOrder DateFrom (Days)' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'WorkOrder DateTo (Days)' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Event History Default Search Type' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Event History DateFrom (Days)' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'History Default Search Type' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'History DateFrom (Days)' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'History DateTo (Days)' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account WarnWhenNewSearchAndCurrentLogID' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Advantage Show Quotes Tab' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Account Contract/Premise Search Delimiter' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Contract Commence Date From (Days)' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Premise Commence Date From (Days)' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Contract Commence Date To (Days)' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Premise Commence Date To (Days)' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'WorkOrder Show Recommendations' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.regSection, 'RegKey': this.storeData['code'].business + '_' + 'Invoice Show Balance Amount' },
        'fields': ['RegValue']
      },
      {
        'table': 'riRegistry',
        'query': { 'RegSection': this.SpeedScriptConstants.CNFContactPersonRegSection },
        'fields': ['RegSection']
      }
    ];

    return this.lookUpRecord(data, 100);
  }

  private windowInitialize(): void {
    let cTelesalesInd;
    if (this.registry.glSCEnableAddressLine3) {
      this.storeData['fieldVisibility'].tabAccounts.AccountAddressLine3 = true;
      this.storeData['fieldVisibility'].tabPremises.PremiseAddressLine3 = true;
    } else {
      this.storeData['fieldVisibility'].tabAccounts.AccountAddressLine3 = false;
      this.storeData['fieldVisibility'].tabPremises.PremiseAddressLine3 = false;
    }
    cTelesalesInd = this.pageQueryParams['TelesalesInd'];
    if (cTelesalesInd === 'Y') {
      this.otherVariables.WindowClosingName = 'TelesalesAutoUpdateResult';
    }
    if (this.pageQueryParams && this.pageQueryParams['parentMode']) {
      this.formGroup.controls['CountryCode'].disable();
      this.formGroup.controls['BusinessCode'].disable();
      switch (this.pageQueryParams['parentMode']) {
        case 'ContactManagement':
          if (this.pageQueryParams['ContractNumber'] && this.pageQueryParams['ContractNumber'] !== '') {
            this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue('ContractNo');
            if (this.pageQueryParams['PremiseNumber'] && this.pageQueryParams['PremiseNumber'] !== '') {
              this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue(this.pageQueryParams['ContractNumber'] + '/' + this.pageQueryParams['PremiseNumber']);
            } else {
              this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue(this.pageQueryParams['ContractNumber']);
            }
            this.storeData['formGroup'].tabAccounts.controls['AccountStatus'].setValue('all');
            this.storeData['formGroup'].tabAccounts.controls['AccountNational'].setValue('all');
            this.storeData['formGroup'].tabAccounts.controls['AccountContractType'].setValue('all');
            this.storeData['formGroup'].tabAccounts.controls['AccountDataSet'].setValue('all');
          } else if (this.pageQueryParams['AccountNumber'] && this.pageQueryParams['AccountNumber'] !== '') {
            this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue('AccountNo');
            this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue(this.pageQueryParams['AccountNumber']);
            this.storeData['formGroup'].tabAccounts.controls['AccountStatus'].setValue('all');
            this.storeData['formGroup'].tabAccounts.controls['AccountNational'].setValue('all');
            this.storeData['formGroup'].tabAccounts.controls['AccountContractType'].setValue('all');
            this.storeData['formGroup'].tabAccounts.controls['AccountDataSet'].setValue('all');
          }
          break;
        case 'CallCentreReview':
          this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue('CallRef');
          this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue(this.pageQueryParams['SelectedCallLogID']);
          break;
        case 'CampaignEntry':
          this.otherVariables.SelectedTicketNumber = this.pageQueryParams['CustomerContactNumber'];
          this.otherVariables.ParentTaskTicketNumber = this.otherVariables.SelectedTicketNumber;
          this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue('CustomerContactNo');
          this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue(this.pageQueryParams['CustomerContactNumber']);
          this.webSpeedVariables.lRunningFromWOMaintTask = true;
          break;
        case 'WorkOrderMaintenanceAccountTask':
        case 'WorkOrderMaintenanceContractTask':
        case 'WorkOrderMaintenanceProspectTask':
          this.otherVariables.SelectedTicketNumber = this.pageQueryParams['CustomerContactNumber'];
          this.otherVariables.ParentTaskTicketNumber = this.otherVariables.SelectedTicketNumber;
          this.webSpeedVariables.lRunningFromWOMaintTask = true;
          break;
        default:
          break;
      }

      if (this.pageQueryParams['parentMode'] === 'Account' || this.pageQueryParams['parentMode'] === 'WorkOrderMaintenanceAccount' || this.pageQueryParams['parentMode'] === 'WorkOrderMaintenanceAccountTask') {
        this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue('AccountNo');
        this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue(this.pageQueryParams['AccountNumber']);
        if (this.pageQueryParams['parentMode'] === 'Account') {
          this.otherVariables.SelectedTicketNumber = this.pageQueryParams['CustomerContactNumber'];
          this.otherVariables.ParentTaskTicketNumber = this.otherVariables.SelectedTicketNumber;
          this.webSpeedVariables.lRunningFromWOMaintTask = true;
        }
      }

      if (this.pageQueryParams['parentMode'] === 'Contract' || this.pageQueryParams['parentMode'] === 'WorkOrderMaintenanceContract' || this.pageQueryParams['parentMode'] === 'WorkOrderMaintenanceContractTask') {
        this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue('ContractNo');
        this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue('ContractNumber');
        if (this.pageQueryParams['parentMode'] === 'Contract') {
          this.otherVariables.SelectedTicketNumber = this.pageQueryParams['CustomerContactNumber'];
          this.otherVariables.ParentTaskTicketNumber = this.otherVariables.SelectedTicketNumber;
          this.webSpeedVariables.lRunningFromWOMaintTask = true;
        }
      }

      if (this.pageQueryParams['parentMode'] === 'WorkOrderMaintenancePremise') {
        this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue('ContractNo');
        this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue(this.pageQueryParams['ContractNumber'] + '/' + this.pageQueryParams['PremiseNumber']);
        this.otherVariables.SelectedTicketNumber = this.pageQueryParams['CustomerContactNumber'];
        this.otherVariables.ParentTaskTicketNumber = this.otherVariables.SelectedTicketNumber;
        this.webSpeedVariables.lRunningFromWOMaintTask = true;
      }

      if (this.pageQueryParams['parentMode'] === 'Premise' || this.pageQueryParams['parentMode'] === 'ServiceCover') {
        this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue('ContractNo');
        this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue(this.pageQueryParams['ContractNumber'] + '/' + this.pageQueryParams['PremiseNumber']);
      }

      if (this.pageQueryParams['parentMode'] === 'WorkOrderMaintenanceProspect' || this.pageQueryParams['parentMode'] === 'WorkOrderMaintenanceProspectTask') {
        this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue('ProspectNo');
        this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue(this.pageQueryParams['ProspectNumber']);
        this.otherVariables.SelectedTicketNumber = this.pageQueryParams['CustomerContactNumber'];
        this.otherVariables.ParentTaskTicketNumber = this.otherVariables.SelectedTicketNumber;
        this.webSpeedVariables.lRunningFromWOMaintTask = true;
      }
      if (this.webSpeedVariables.lRunningFromWOMaintTask) {
        this.storeData['formGroup'].tabLogs.controls['TicketContractNumber'].setValue(this.pageQueryParams['ContractNumber']);
        this.storeData['formGroup'].tabLogs.controls['TicketContractName'].setValue(this.pageQueryParams['ContractName']);
        this.storeData['formGroup'].tabLogs.controls['TicketPremiseNumber'].setValue(this.pageQueryParams['PremiseNumber']);
        this.storeData['formGroup'].tabLogs.controls['TicketPremiseName'].setValue(this.pageQueryParams['PremiseName']);
        this.storeData['formGroup'].tabLogs.controls['TicketContactPosition'].setValue(this.pageQueryParams['ContactPosition']);
        this.storeData['formGroup'].tabLogs.controls['TicketContactTelephone'].setValue(this.pageQueryParams['ContactTelephone']);
        this.storeData['formGroup'].tabLogs.controls['TicketContactFax'].setValue(this.pageQueryParams['ContactFax']);
        this.storeData['formGroup'].tabLogs.controls['TicketContactMobile'].setValue(this.pageQueryParams['ContactMobile']);
        this.storeData['formGroup'].tabLogs.controls['TicketContactEmail'].setValue(this.pageQueryParams['TicketContactEmail']);
        this.storeData['formGroup'].tabLogs.controls['TicketPostcode'].setValue(this.pageQueryParams['ContactPostcode']);
      }
      this.store.dispatch({
        type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['Accounts']
      });
    } else {
      this.formGroup.controls['CountryCode'].enable();
      this.formGroup.controls['BusinessCode'].enable();
    }
  }

  private buildTabs(): void {
    let tabTextList = [];
    this.tabs = [];
    this.componentList = [];
    this.tabs.push({ title: 'Customer Search', active: true, hidden: false, translated: this.storeData['tabsTranslation'].tabAccounts });
    tabTextList.push(this.storeData['tabsTranslation'].tabAccounts);
    this.componentList.push(CallCenterGridAccountsComponent);
    this.componentList.push(CallCenterGridDashboardComponent);
    this.componentList.push(CallCenterGridContractsComponent);
    this.componentList.push(CallCenterGridPremisesComponent);
    this.componentList.push(CallCenterGridInvoicesComponent);
    this.componentList.push(CallCenterGridCallLogsComponent);
    this.componentList.push(CallCenterGridEventHistoryComponent);
    this.componentList.push(CallCenterGridWorkOrdersComponent);
    this.componentList.push(CallCenterGridHistoryComponent);
    this.componentList.push(CallCenterGriddlContractComponent);

    if (this.otherVariables.AccountNumberType === 'A') {
      this.tabs.push({ title: 'Dashboard', hidden: false, translated: this.storeData['tabsTranslation'].tabDashboard });
      this.tabs.push({ title: 'Contracts/Jobs', hidden: false, translated: this.storeData['tabsTranslation'].tabContracts });
      this.tabs.push({ title: 'Premises', hidden: false, translated: this.storeData['tabsTranslation'].tabPremises });
      this.tabs.push({ title: 'Invoices', hidden: false, translated: this.storeData['tabsTranslation'].tabInvoices });
      tabTextList.push(this.storeData['tabsTranslation'].tabDashboard);
      tabTextList.push(this.storeData['tabsTranslation'].tabContracts);
      tabTextList.push(this.storeData['tabsTranslation'].tabPremises);
      tabTextList.push(this.storeData['tabsTranslation'].tabInvoices);
    } else {
      this.tabs.push({ title: 'Dashboard', hidden: true, translated: this.storeData['tabsTranslation'].tabDashboard });
      this.tabs.push({ title: 'Contracts/Jobs', hidden: true, translated: this.storeData['tabsTranslation'].tabContracts });
      this.tabs.push({ title: 'Premises', hidden: true, translated: this.storeData['tabsTranslation'].tabPremises });
      this.tabs.push({ title: 'Invoices', hidden: true, translated: this.storeData['tabsTranslation'].tabInvoices });
    }
    this.tabs.push({ title: 'Logs', hidden: false, translated: this.storeData['tabsTranslation'].tabLogs });
    tabTextList.push(this.storeData['tabsTranslation'].tabLogs);
    //this.componentList.push(CallCenterGridCallLogsComponent);
    if (this.otherVariables.AccountNumberType === 'A') {
      this.tabs.push({ title: 'Event History', hidden: false, translated: this.storeData['tabsTranslation'].tabEventHistory });
      tabTextList.push(this.storeData['tabsTranslation'].tabEventHistory);
      /*this.componentList.push(CallCenterGridEventHistoryComponent);*/
    } else {
      this.tabs.push({ title: 'Event History', hidden: true, translated: this.storeData['tabsTranslation'].tabEventHistory });
    }
    if (this.otherVariables.AccountNumberType !== 'NA') {
      this.tabs.push({ title: 'Work Orders', hidden: false, translated: this.storeData['tabsTranslation'].tabWorkOrders });
      /*this.componentList.push(CallCenterGridWorkOrdersComponent);*/
      tabTextList.push(this.storeData['tabsTranslation'].tabWorkOrders);
    } else {
      this.tabs.push({ title: 'Work Orders', hidden: true, translated: this.storeData['tabsTranslation'].tabWorkOrders });
    }
    if (this.otherVariables.AccountNumberType === 'A') {
      this.tabs.push({ title: 'History', hidden: false, translated: this.storeData['tabsTranslation'].tabHistory });
      /*this.componentList.push(CallCenterGridHistoryComponent);*/
      tabTextList.push(this.storeData['tabsTranslation'].tabHistory);
    } else {
      this.tabs.push({ title: 'History', hidden: true, translated: this.storeData['tabsTranslation'].tabHistory });
    }
    if (this.otherVariables.AccountNumberType === 'P' && this.registry.gcShowAdvantageQuotes === 'Y') {
      this.tabs.push({ title: 'Advantage Quotes', hidden: false, translated: this.storeData['tabsTranslation'].advantage });
      /*this.componentList.push(CallCenterGriddlContractComponent);*/
      tabTextList.push(this.storeData['tabsTranslation'].advantage);
    } else {
      this.tabs.push({ title: 'Advantage Quotes', hidden: true, translated: this.storeData['tabsTranslation'].advantage });
    }
    setTimeout(() => {
      let tabTextElements = document.querySelectorAll('#tabCont .nav-tabs li a span');
      for (let i = 0; i < tabTextElements.length; i++) {
        tabTextElements[i].parentElement.parentElement['style'].display = 'none';
        for (let j = 0; j < tabTextList.length; j++) {
          if (tabTextElements[i]['innerText'] === tabTextList[j]) {
            tabTextElements[i].parentElement.parentElement['style'].display = 'block';
          }
        }
      }
    }, 100);
  }

  private setUpDefaults(): void {
    this.otherVariables.BusinessOriginCode = this.registry.gcDefaultBusinessOriginCode;
    this.otherVariables.BusinessOriginDesc = this.registry.gcDefaultBusinessOriginDesc;
    this.otherVariables.ContactMediumCode = this.registry.gcDefaultContactMediumCode;
    this.otherVariables.ContactMediumDesc = this.registry.gcDefaultContactMediumDesc;
    this.otherVariables.ProspectSourceCode = this.registry.gcDefaultProspectSourceCode;
    this.otherVariables.ProspectTypeCode = this.registry.gcDefaultProspectTypeCode;
    if (this.registry.gcDefaultLiveAccount === '1') {
      this.storeData['formGroup'].tabAccounts.controls['AccountStatus'].setValue('all');
    }
    if (this.registry.gcDefaultLiveAccount === '2') {
      this.storeData['formGroup'].tabAccounts.controls['AccountStatus'].setValue('liveonly');
    }
    if (this.registry.gcDefaultNationalAccount === '1') {
      this.storeData['formGroup'].tabAccounts.controls['AccountNational'].setValue('all');
    } else if (this.registry.gcDefaultNationalAccount === '2') {
      this.storeData['formGroup'].tabAccounts.controls['AccountNational'].setValue('nationalonly');
    } else if (this.registry.gcDefaultNationalAccount === '3') {
      this.storeData['formGroup'].tabAccounts.controls['AccountNational'].setValue('nonenational');
    }

    if (this.registry.gcDefaultAccountSearchType === '1') {
      this.storeData['formGroup'].tabAccounts.controls['AccountDataSet'].setValue('all');
    }
    if (this.registry.gcDefaultAccountSearchType === '2') {
      this.storeData['formGroup'].tabAccounts.controls['AccountDataSet'].setValue('allnotpublic');
    }
    if (this.registry.gcDefaultAccountSearchType === '3') {
      this.storeData['formGroup'].tabAccounts.controls['AccountDataSet'].setValue('accountspremises');
    }
    if (this.registry.gcDefaultAccountSearchType === '4') {
      this.storeData['formGroup'].tabAccounts.controls['AccountDataSet'].setValue('accounts');
    }
    if (this.registry.gcDefaultAccountSearchType === '5') {
      this.storeData['formGroup'].tabAccounts.controls['AccountDataSet'].setValue('public');
    }
    if (this.registry.gcDefaultAccountSearchType === '6') {
      this.storeData['formGroup'].tabAccounts.controls['AccountDataSet'].setValue('premises');
    }
    if (this.registry.gcDefaultAccountSearchType === '7') {
      this.storeData['formGroup'].tabAccounts.controls['AccountDataSet'].setValue('prospects');
    }
    if (this.registry.gcDefaultContractPortfolioStatus === '1') {
      this.storeData['formGroup'].tabContracts.controls['ContractStatusCode'].setValue('all');
    }
    if (this.registry.gcDefaultContractPortfolioStatus === '2') {
      this.storeData['formGroup'].tabContracts.controls['ContractStatusCode'].setValue('CurrentAll');
    }

    if (this.registry.gcDefaultEventHistorySearchType === '1') {
      this.storeData['formGroup'].tabEventHistory.controls['EventHistoryType'].setValue('all');
    }
    if (this.registry.gcDefaultEventHistorySearchType === '2') {
      this.storeData['formGroup'].tabEventHistory.controls['EventHistoryType'].setValue('visits');
    }
    if (this.registry.gcDefaultEventHistorySearchType === '3') {
      this.storeData['formGroup'].tabEventHistory.controls['EventHistoryType'].setValue('invoices');
    }
    if (this.registry.gcDefaultEventHistorySearchType === '4') {
      this.storeData['formGroup'].tabEventHistory.controls['EventHistoryType'].setValue('contacts');
    }
    if (this.registry.gcDefaultHistorySearchType === '1') {
      this.storeData['formGroup'].tabHistory.controls['HistoryType'].setValue('effective');
    }
    if (this.registry.gcDefaultHistorySearchType === '2') {
      this.storeData['formGroup'].tabHistory.controls['HistoryType'].setValue('processed');
    }
    if (this.registry.gcDefaultCallSearchType === '1') {
      this.storeData['formGroup'].tabLogs.controls['CallLogSearchOn'].setValue('all');
    }
    if (this.registry.gcDefaultCallSearchType === '2') {
      this.storeData['formGroup'].tabLogs.controls['CallLogSearchOn'].setValue('CallRef');
    }
    if (this.registry.gcDefaultCallSearchType === '3') {
      this.storeData['formGroup'].tabLogs.controls['CallLogSearchOn'].setValue('OpenOnly');
    }
    if (this.registry.gcDefaultCallSearchType === '4') {
      this.storeData['formGroup'].tabLogs.controls['CallLogSearchOn'].setValue('ClosedOnly');
    }
    let change = new CustomEvent('change', { bubbles: true });
    this.renderer.invokeElementMethod(document.querySelector('#AccountStatus'), 'dispatchEvent', [change]);
    this.renderer.invokeElementMethod(document.querySelector('#AccountContractType'), 'dispatchEvent', [change]);
    /*if (!(this.storeSavedData && this.storeSavedData.main && !(Object.keys(this.storeSavedData.main).length === 0 && this.storeSavedData.main.constructor === Object))) {
      this.setDefaultDates();
    }*/
    this.setDefaultDates();
    //this.formClone();
  }

  private setDefaultDates(): void {
    let date = new Date();
    this.storeData['dateObjects'].tabLogs.CallLogDate = new Date(date.setDate(date.getDate() - this.registry.giCallDateDays));
    date = new Date();
    this.storeData['dateObjects'].tabWorkOrders.WOFromDate = new Date(date.setDate(date.getDate() - this.registry.giWOFromDays));
    date = new Date();
    this.storeData['dateObjects'].tabWorkOrders.WOToDate = new Date(date.setDate(date.getDate() + this.registry.giWOToDays));
    date = new Date();
    this.storeData['dateObjects'].tabEventHistory.EventHistoryFromDate = new Date(date.setDate(date.getDate() - this.registry.giEventHistoryFromDays));
    date = new Date();
    this.storeData['dateObjects'].tabEventHistory.EventHistoryToDate = new Date(date.setDate(date.getDate()));
    date = new Date();
    this.storeData['dateObjects'].tabHistory.HistoryFromDate = new Date(date.setDate(date.getDate() - this.registry.giHistoryFromDays));
    date = new Date();
    this.storeData['dateObjects'].tabHistory.HistoryToDate = new Date(date.setDate(date.getDate() + this.registry.giHistoryToDays));
    date = new Date();
    this.storeData['dateObjects'].tabContracts.ContractCommenceDateFrom = new Date(date.setDate(date.getDate() - this.registry.gcContractCommenceDateFromDays));
    date = new Date();
    this.storeData['dateObjects'].tabContracts.ContractCommenceDateTo = new Date(date.setDate(date.getDate() + this.registry.gcContractCommenceDateToDays));
    date = new Date();
    this.storeData['dateObjects'].tabPremises.PremiseCommenceDateFrom = new Date(date.setDate(date.getDate() - this.registry.gcPremiseCommenceDateFromDays));
    date = new Date();
    this.storeData['dateObjects'].tabPremises.PremiseCommenceDateTo = new Date(date.setDate(date.getDate() + this.registry.gcPremiseCommenceDateToDays));
  }

  private formClone(): void {
    for (let i in this.storeData['formGroup'].main.controls) {
      if (this.storeData['formGroup'].main.controls.hasOwnProperty(i)) {
        this.storeFormDataClone.main[i] = this.storeData['formGroup'].main.controls[i].value;
        this.storeFormDataClone.state.main[i] = this.storeData['formGroup'].main.controls[i].enabled;
      }
    }
    for (let i in this.storeData['formGroup'].tabAccounts.controls) {
      if (this.storeData['formGroup'].tabAccounts.controls.hasOwnProperty(i)) {
        this.storeFormDataClone.tabAccounts[i] = this.storeData['formGroup'].tabAccounts.controls[i].value;
        this.storeFormDataClone.state.tabAccounts[i] = this.storeData['formGroup'].tabAccounts.controls[i].enabled;
      }
    }
    for (let i in this.storeData['formGroup'].tabLogs.controls) {
      if (this.storeData['formGroup'].tabLogs.controls.hasOwnProperty(i)) {
        this.storeFormDataClone.tabLogs[i] = this.storeData['formGroup'].tabLogs.controls[i].value;
        this.storeFormDataClone.state.tabLogs[i] = this.storeData['formGroup'].tabLogs.controls[i].enabled;
      }
    }
    for (let i in this.storeData['formGroup'].tabContracts.controls) {
      if (this.storeData['formGroup'].tabContracts.controls.hasOwnProperty(i)) {
        this.storeFormDataClone.tabContracts[i] = this.storeData['formGroup'].tabContracts.controls[i].value;
        this.storeFormDataClone.state.tabContracts[i] = this.storeData['formGroup'].tabContracts.controls[i].enabled;
      }
    }
    for (let i in this.storeData['formGroup'].tabDashboard.controls) {
      if (this.storeData['formGroup'].tabDashboard.controls.hasOwnProperty(i)) {
        this.storeFormDataClone.tabDashboard[i] = this.storeData['formGroup'].tabDashboard.controls[i].value;
        this.storeFormDataClone.state.tabDashboard[i] = this.storeData['formGroup'].tabDashboard.controls[i].enabled;
      }
    }
    for (let i in this.storeData['formGroup'].tabEventHistory.controls) {
      if (this.storeData['formGroup'].tabEventHistory.controls.hasOwnProperty(i)) {
        this.storeFormDataClone.tabEventHistory[i] = this.storeData['formGroup'].tabEventHistory.controls[i].value;
        this.storeFormDataClone.state.tabEventHistory[i] = this.storeData['formGroup'].tabEventHistory.controls[i].enabled;
      }
    }
    for (let i in this.storeData['formGroup'].tabHistory.controls) {
      if (this.storeData['formGroup'].tabHistory.controls.hasOwnProperty(i)) {
        this.storeFormDataClone.tabHistory[i] = this.storeData['formGroup'].tabHistory.controls[i].value;
        this.storeFormDataClone.state.tabHistory[i] = this.storeData['formGroup'].tabHistory.controls[i].enabled;
      }
    }
    for (let i in this.storeData['formGroup'].tabInvoices.controls) {
      if (this.storeData['formGroup'].tabInvoices.controls.hasOwnProperty(i)) {
        this.storeFormDataClone.tabInvoices[i] = this.storeData['formGroup'].tabInvoices.controls[i].value;
        this.storeFormDataClone.state.tabInvoices[i] = this.storeData['formGroup'].tabInvoices.controls[i].enabled;
      }
    }
    for (let i in this.storeData['formGroup'].tabPremises.controls) {
      if (this.storeData['formGroup'].tabPremises.controls.hasOwnProperty(i)) {
        this.storeFormDataClone.tabPremises[i] = this.storeData['formGroup'].tabPremises.controls[i].value;
        this.storeFormDataClone.state.tabPremises[i] = this.storeData['formGroup'].tabPremises.controls[i].enabled;
      }
    }
    for (let i in this.storeData['formGroup'].tabWorkOrders.controls) {
      if (this.storeData['formGroup'].tabWorkOrders.controls.hasOwnProperty(i)) {
        this.storeFormDataClone.tabWorkOrders[i] = this.storeData['formGroup'].tabWorkOrders.controls[i].value;
        this.storeFormDataClone.state.tabWorkOrders[i] = this.storeData['formGroup'].tabWorkOrders.controls[i].enabled;
      }
    }
    this.storeFormDataClone['pagination'] = this.storeData['pagination'];
    this.storeFormDataClone['index'] = this.storeData['index'];
    this.storeFormDataClone['otherParams'] = this.storeData['otherParams'];
    this.storeData['storeFormDataClone'] = this.storeFormDataClone;
  }

  private setFormFromBaseComponent(): void {
    //this.storeData['pagination'] = this.storeSavedData['pagination'];
    if (this.storeSavedData && this.storeSavedData.state && !(Object.keys(this.storeSavedData.state).length === 0 && this.storeSavedData.state.constructor === Object)) {
      this.storeData['storeSavedData'] = this.storeSavedData;
      this.storeData['otherParams'] = JSON.parse(JSON.stringify(this.storeSavedData['otherParams']));
      this.otherVariables = this.storeData['otherParams'].otherVariables;
      //this.storeData['otherParams'].other = this.pageParams;
      this.storeData['otherParams']['triggerClear'] = false;
      for (let j in this.storeSavedData['state']) {
        if (this.storeSavedData['state'].hasOwnProperty(j)) {
          for (let k in this.storeSavedData['state'][j]) {
            if (typeof this.storeSavedData['state'][j][k] === 'string') {
              if (this.storeSavedData['state'][j][k]) {
                this.storeData['formGroup'][j].controls[k].enable();
              } else {
                this.storeData['formGroup'][j].controls[k].disable();
              }
            }
          }
        }
      }
    }
    setTimeout(() => {
      if (this.storeSavedData && this.storeSavedData.main && !(Object.keys(this.storeSavedData.main).length === 0 && this.storeSavedData.main.constructor === Object)) {
        this.storeData['storeSavedData'] = this.storeSavedData;
        for (let j in this.storeSavedData) {
          if (this.storeSavedData.hasOwnProperty(j)) {
            for (let k in this.storeSavedData[j]) {
              if (typeof this.storeSavedData[j][k] === 'string') {
                this.storeData['formGroup'][j].controls[k].setValue(this.storeSavedData[j][k]);
              }
            }
          }
        }
        //this.storeData['otherParams'] = JSON.parse(JSON.stringify(this.storeSavedData['otherParams']));
        //this.riExchangeUpdateHTMLDocument();
      } else {
        this.storeData['storeSavedData'] = {};
      }
      this.store.dispatch({
        type: CallCenterActionTypes.SET_PAGINATION
      });
      let elem = document.getElementsByTagName('body');
      if (elem && elem.length > 0) {
        elem[0].classList.remove('modal-open');
      }
      if (this.storeSavedData && this.storeSavedData.main && !(Object.keys(this.storeSavedData.main).length === 0 && this.storeSavedData.main.constructor === Object)) {
        this.riExchangeUpdateHTMLDocument();
      }
    }, 0);
    /*this.store.dispatch({
      type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['Accounts', 'Contracts']
    });*/
  }

  private passLiveAccountStatusToAllSearches(): void {
    if (this.registry.gcAccountPassLiveAccount === 'Y') {
      if (this.storeData['formGroup'].tabAccounts.controls['AccountStatus'].value === 'liveonly') {
        this.storeData['formGroup'].tabContracts.controls['ContractStatusCode'].setValue('CurrentAll');
        this.storeData['formGroup'].tabPremises.controls['PremiseStatusCode'].setValue('CurrentAll');
      } else {
        this.storeData['formGroup'].tabContracts.controls['ContractStatusCode'].setValue('all');
        this.storeData['formGroup'].tabPremises.controls['PremiseStatusCode'].setValue('all');
      }
      this.webSpeedVariables.lRefreshContractGrid = true;
      this.webSpeedVariables.lRefreshPremiseGrid = true;

    }
  }

  private passContractTypeToAllSearches(): void {
    if (this.registry.gcAccountPassContractType === 'Y') {
      this.storeData['formGroup'].tabContracts.controls['ContractTypeCode'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountContractType'].value);
      this.storeData['formGroup'].tabPremises.controls['PremiseContractTypeCode'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountContractType'].value);
      this.storeData['formGroup'].tabInvoices.controls['InvoiceContractTypeCode'].setValue(this.storeData['formGroup'].tabAccounts.controls['AccountContractType'].value);
      this.webSpeedVariables.lRefreshContractGrid = true;
      this.webSpeedVariables.lRefreshPremiseGrid = true;
      this.webSpeedVariables.lRefreshInvoiceGrid = true;
    }
  }

  private getLoggedInBranch(): any {
    let businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
    let countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();
    return this.utils.getLoggedInBranch(businessCode, countryCode);
  }

  private getInitialSettings(): void {
    this.getLoggedInBranch().subscribe((data) => {
      if (data.results && data.results[0] && data.results[0].length > 0) {
        this.loggedInBranch = data.results[0][0].BranchNumber;
      } else if (data.results && data.results[1] && data.results[1].length > 0) {
        this.loggedInBranch = data.results[1][0].BranchNumber;
      } else {
        this.loggedInBranch = '';
      }
      if (this.formGroup.controls['BusinessCode'].value === this.utils.getBusinessCode() && this.formGroup.controls['CountryCode'].value === this.utils.getCountryCode()) {
        this.loggedInBranch = this.utils.getBranchCode();
      }
      this.fetchCallCentreDataPost('GetInitialSettings', {}, { BranchNumber: this.loggedInBranch }).subscribe((data) => {
        if (data['status'] === GlobalConstant.Configuration.Failure) {
          this.errorService.emitError(data['oResponse']);
        } else {
          if (!data['errorMessage']) {
            if (data['isNationalBranch'] === 'Y') {
              this.registry.gcDefaultNationalAccount = this.registry.gcDefaultNationalAccountWhenInBr;
            }
            if (data['isPropertyCareBranch'] === 'Y') {
              this.webSpeedVariables.cIsPropertyCareBranch = 'Y';
            }
            if (data['CreateCallLogInCCMInd'] === 'Y') {
              this.otherVariables.CreateCallLogInCCMInd = 'Y';
            } else {
              this.otherVariables.CreateCallLogInCCMInd = 'N';
              this.fieldVisibility.VisibleCurrentCallLogID = false;
              this.fieldVisibility.CmdNotepad = false;
              this.fieldVisibility.CmdNewCall = false;
              this.fieldVisibility.CmdEndCall = false;
            }
            this.windowInitialize();
            this.setUpDefaults();
            this.storeOperationOnGettingInitialSettings();
            this.setFormFromBaseComponent();
          }
        }
      }, (err) => {
        this.storeOperationOnGettingInitialSettings();
      });
    });
  }

  private storeOperationOnGettingInitialSettings(): void {
    this.store.dispatch({
      type: CallCenterActionTypes.SAVE_OTHER_PARAMS, payload: {
        registry: this.registry,
        webSpeedVariables: this.webSpeedVariables,
        otherVariables: this.otherVariables,
        syschars: this.syschars
      }
    });
    if (this.storeData['otherParams']['otherVariables'])
      this.storeData['otherParams']['otherVariables']['currentTab'] = this.storeData['tabsTranslation'].tabAccounts;

    this.storeData['gridToBuild'] = [];
    this.storeData['action'] = '';
    this.formClone();
    setTimeout(() => {
      this.storeData['allowAjaxOnDateChange'] = true;
    }, 0);
  }

  private setupDisplayOnlyFields(): void {
    this.formGroup.controls['AccountProspectNumber'].disable();
    this.formGroup.controls['AccountProspectName'].disable();
    this.formGroup.controls['AccountProspectContactName'].disable();
    this.storeData['formGroup'].tabAccounts.controls['AccountName'].disable();
    this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine1'].disable();
    this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine2'].disable();
    this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine4'].disable();
    this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine5'].disable();
    this.storeData['formGroup'].tabAccounts.controls['AccountPostcode'].disable();
    this.storeData['formGroup'].tabAccounts.controls['AccountContactName'].disable();
    this.storeData['formGroup'].tabAccounts.controls['AccountContactPosition'].disable();
    this.storeData['formGroup'].tabAccounts.controls['AccountContactTelephone'].disable();
    this.storeData['formGroup'].tabAccounts.controls['AccountContactMobile'].disable();
    this.storeData['formGroup'].tabAccounts.controls['AccountContactFax'].disable();
    this.storeData['formGroup'].tabAccounts.controls['AccountContactEmail'].disable();
    this.storeData['formGroup'].tabPremises.controls['PremiseServiceCoverList'].disable();
    this.storeData['formGroup'].tabPremises.controls['PremiseName'].disable();
    this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine1'].disable();
    this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine2'].disable();
    this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine4'].disable();
    this.storeData['formGroup'].tabPremises.controls['PremiseAddressLine5'].disable();
    this.storeData['formGroup'].tabPremises.controls['PremisePostcode'].disable();
    this.storeData['formGroup'].tabPremises.controls['PremiseContactName'].disable();
    this.storeData['formGroup'].tabPremises.controls['PremiseContactPosition'].disable();
    this.storeData['formGroup'].tabPremises.controls['PremiseContactTelephone'].disable();
    this.storeData['formGroup'].tabPremises.controls['PremiseContactMobile'].disable();
    this.storeData['formGroup'].tabPremises.controls['PremiseContactFax'].disable();
    this.storeData['formGroup'].tabPremises.controls['PremiseContactEmail'].disable();
    this.storeData['formGroup'].tabPremises.controls['PremSelectedContract'].disable();
    this.storeData['formGroup'].tabInvoices.controls['InvSelectedContractPremise'].disable();
    this.storeData['formGroup'].tabEventHistory.controls['EventHistorySelectedContractPremise'].disable();
    this.storeData['formGroup'].tabHistory.controls['HistorySelectedContractPremise'].disable();
    this.storeData['formGroup'].tabLogs.controls['CallLogSelectedContractPremise'].disable();
    this.storeData['formGroup'].tabLogs.controls['CallLogUserName'].disable();
    this.storeData['formGroup'].tabLogs.controls['CallLogCreatedDate'].disable();
    this.storeData['formGroup'].tabLogs.controls['CallLogCreatedTime'].disable();
    this.storeData['formGroup'].tabLogs.controls['TicketContractNumber'].disable();
    this.storeData['formGroup'].tabLogs.controls['TicketContractName'].disable();
    this.storeData['formGroup'].tabLogs.controls['TicketPremiseNumber'].disable();
    this.storeData['formGroup'].tabLogs.controls['TicketPremiseName'].disable();
    this.storeData['formGroup'].tabLogs.controls['TicketProductCode'].disable();
    this.storeData['formGroup'].tabLogs.controls['TicketProductDesc'].disable();
    this.storeData['formGroup'].tabLogs.controls['TicketPremiseNumber'].disable();
    this.storeData['formGroup'].tabLogs.controls['TicketContactName'].disable();
    this.storeData['formGroup'].tabLogs.controls['TicketContactPosition'].disable();
    this.storeData['formGroup'].tabLogs.controls['TicketContactTelephone'].disable();
    this.storeData['formGroup'].tabLogs.controls['TicketContactMobile'].disable();
    this.storeData['formGroup'].tabLogs.controls['TicketContactEmail'].disable();
    this.storeData['formGroup'].tabLogs.controls['TicketContactFax'].disable();
    this.storeData['formGroup'].tabWorkOrders.controls['WOSelectedContractPremise'].disable();
  }

  public fetchCallCentreDataPost(functionName: string, params: Object, formData: Object): any {
    this.queryCallCentre = new URLSearchParams();
    let businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
    let countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();
    this.queryCallCentre.set(this.serviceConstants.BusinessCode, businessCode);
    this.queryCallCentre.set(this.serviceConstants.CountryCode, countryCode);
    if (functionName !== '') {
      this.queryCallCentre.set(this.serviceConstants.Action, '6');
      this.queryCallCentre.set('Function', functionName);
    }
    for (let key in params) {
      if (key) {
        this.queryCallCentre.set(key, params[key]);
      }
    }
    return this.httpService.makePostRequest(this.queryParamsCallCenter.method, this.queryParamsCallCenter.module, this.queryParamsCallCenter.operation, this.queryCallCentre, formData);
  }

  public fetchCallCentreDataGet(functionName: string, params: Object): any {
    this.queryCallCentre = new URLSearchParams();
    let businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
    let countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();
    this.queryCallCentre.set(this.serviceConstants.BusinessCode, businessCode);
    this.queryCallCentre.set(this.serviceConstants.CountryCode, countryCode);
    if (functionName !== '') {
      this.queryCallCentre.set(this.serviceConstants.Action, '6');
      this.queryCallCentre.set('Function', functionName);
    }
    for (let key in params) {
      if (key) {
        this.queryCallCentre.set(key, params[key]);
      }
    }
    return this.httpService.makeGetRequest(this.queryParamsCallCenter.method, this.queryParamsCallCenter.module, this.queryParamsCallCenter.operation, this.queryCallCentre);
  }

  private postFetchRegistry(): void {
    setTimeout(() => {
      this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue(this.storeData['dropdownList'].tabAccounts.AccountSearchOn[parseInt(this.registry.gcDefaultAccountSearch, 10) - 1].value);
      this.storeData['formGroup'].tabContracts.controls['ContractStatusCode'].setValue(document.getElementById('ContractStatusCode')[parseInt(this.registry.gcDefaultContractPortfolioStatus, 10)].value);
      this.storeData['formGroup'].tabPremises.controls['PremiseStatusCode'].setValue(document.getElementById('PremiseStatusCode')[parseInt(this.registry.gcDefaultContractPortfolioStatus, 10)].value);
    }, 0);
    if (this.registry.glMultiContactInd) {
      this.storeData['fieldVisibility']['tabPremises'].CmdContactPremise = true;
      this.storeData['fieldVisibility']['tabAccounts'].CmdContactAccount = true;
    } else {
      this.storeData['fieldVisibility']['tabPremises'].CmdContactPremise = false;
      this.storeData['fieldVisibility']['tabAccounts'].CmdContactAccount = false;
    }
    let data = [{
      'table': 'Employee',
      'query': { 'UserCode': this.userCode, 'BusinessCode': this.storeData['code'] && this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode() },
      'fields': ['OccupationCode', 'EmployeeCode']
    },
    {
      'table': 'ContractType',
      'query': { 'BusinessCode': this.storeData['code'] && this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode() },
      'fields': ['BusinessCode', 'ContractTypeCode', 'ContractTypeDesc']
    },
    {
      'table': 'Business',
      'query': {},
      'fields': ['BusinessCode']
    }];
    this.lookUpRecord(data, 100).subscribe(
      (e) => {
        if (e['results'] && e['results'].length > 0) {
          if (e['results'][0].length > 0) {
            if (this.syschars['glLimitEmployeeDataView']) {
              if (this.syschars['gcCountryDataList'].length > 1 && this.syschars['gcCountryDataList'].indexOf(e['results'][0][0].EmployeeCode) > -1) {
                this.registry.gcEmployeeLimitChildDrillOptions = 'Y';
              }
            } else if (this.syschars['glLimitOccupationEmployeeDataView']) {
              if (this.syschars['gcOccupationCodeList'].length > 0 && this.syschars['gcOccupationCodeList'].indexOf(e['results'][0][0].OccupationCode) > -1) {
                this.registry.gcEmployeeLimitChildDrillOptions = 'Y';
              }
            }
          }
          if (e['results'][1].length > 0) {
            this.list.ContractType = e['results'][1];
            let arr = [];
            for (let i = 0; i < e['results'][1].length; i++) {
              arr.push(e['results'][1][i].ContractTypeCode);
            }
            this.storeData['dropdownList'].tabAccounts.AccountContractType = [{
              value: this.registry.gcContractTypeCodes,
              desc: ''
            }];
            this.storeData['dropdownList'].tabContracts.ContractTypeCode = [{
              value: this.registry.gcContractTypeCodes,
              desc: ''
            }];
            this.storeData['dropdownList'].tabPremises.PremiseContractTypeCode = [{
              value: this.registry.gcContractTypeCodes,
              desc: ''
            }];
            this.storeData['dropdownList'].tabInvoices.InvoiceContractTypeCode = [{
              value: this.registry.gcContractTypeCodes,
              desc: ''
            }];
            this.registry.gcContractTypeCodes = this.registry.gcContractTypeCodes + ',';
            this.registry.gcContractTypeCodes = this.registry.gcContractTypeCodes.concat(arr.join());

            let contractTypeLangQuery = [];
            for (let i = 0; i < this.list.ContractType.length; i++) {
              contractTypeLangQuery.push({
                'table': 'ContractTypeLang',
                'query': { 'ContractTypeCode': this.list.ContractType[i].ContractTypeCode, 'BusinessCode': this.list.ContractType[i].BusinessCode },
                'fields': ['ContractTypeDesc']
              });
            }
            this.lookUpRecord(contractTypeLangQuery, 100).subscribe(
              (e) => {
                if (e['results'] && e['results'].length > 0) {
                  this.list.ContractTypeDesc = e['results'];
                  let arr = [];
                  for (let i = 0; i < e['results'].length; i++) {
                    arr.push(e['results'][i][0].ContractTypeDesc);
                  }
                  this.storeData['dropdownList'].tabAccounts.AccountContractType[0].desc = this.registry.gcContractTypeDescs;
                  this.storeData['dropdownList'].tabContracts.ContractTypeCode[0].desc = this.registry.gcContractTypeDescs;
                  this.storeData['dropdownList'].tabPremises.PremiseContractTypeCode[0].desc = this.registry.gcContractTypeDescs;
                  this.storeData['dropdownList'].tabInvoices.InvoiceContractTypeCode[0].desc = this.registry.gcContractTypeDescs;
                  this.registry.gcContractTypeDescs = this.registry.gcContractTypeDescs + ',';
                  this.registry.gcContractTypeDescs = this.registry.gcContractTypeDescs.concat(arr.join());
                  for (let i = 0; i < this.list.ContractType.length; i++) {
                    this.storeData['dropdownList'].tabAccounts.AccountContractType.push({
                      value: this.list.ContractType[i].ContractTypeCode,
                      desc: this.list.ContractType[i].ContractTypeDesc
                    });
                    this.storeData['dropdownList'].tabContracts.ContractTypeCode.push({
                      value: this.list.ContractType[i].ContractTypeCode,
                      desc: this.list.ContractType[i].ContractTypeDesc
                    });
                    this.storeData['dropdownList'].tabPremises.PremiseContractTypeCode.push({
                      value: this.list.ContractType[i].ContractTypeCode,
                      desc: this.list.ContractType[i].ContractTypeDesc
                    });
                    this.storeData['dropdownList'].tabInvoices.InvoiceContractTypeCode.push({
                      value: this.list.ContractType[i].ContractTypeCode,
                      desc: this.list.ContractType[i].ContractTypeDesc
                    });
                  }
                  this.storeData['formGroup'].tabAccounts.controls['AccountContractType'].setValue(this.storeData['dropdownList'].tabAccounts.AccountContractType[parseInt(this.registry.gcDefaultAccountContractType, 10) - 1].value);
                  this.storeData['formGroup'].tabContracts.controls['ContractTypeCode'].setValue(this.storeData['dropdownList'].tabContracts.ContractTypeCode[parseInt(this.registry.gcDefaultContractType, 10) - 1].value);
                  this.storeData['formGroup'].tabPremises.controls['PremiseContractTypeCode'].setValue(this.storeData['dropdownList'].tabPremises.PremiseContractTypeCode[parseInt(this.registry.gcDefaultContractType, 10) - 1].value);
                  this.storeData['formGroup'].tabInvoices.controls['InvoiceContractTypeCode'].setValue(this.storeData['dropdownList'].tabInvoices.InvoiceContractTypeCode[parseInt(this.registry.gcDefaultContractType, 10) - 1].value);

                }
              },
              (error) => {
                // error statement
              }
            );
          }
          if (e['results'][2].length > 0) {
            this.registry.giNumBusinesses = e['results'][2].length;
          } else {
            this.registry.giNumBusinesses = 0;
          }
        } else {
          // statement
        }
      },
      (error) => {
        // error statement
      }
    );
    this.getInitialSettings();

  }

  public fetchSysChar(sysCharNumbers: any): any {
    this.querySysChar.set(this.serviceConstants.Action, '0');

    if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
      this.querySysChar.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
      this.querySysChar.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
    } else {
      this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
      this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
    }

    this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
    return this.httpService.sysCharRequest(this.querySysChar);
  }

  public sysCharParameters(): string {
    let sysCharList = [
      this.SysCharConstants.SystemCharEnableAddressLine3,
      this.SysCharConstants.SystemCharEnableInfestations,
      this.SysCharConstants.SystemCharEnableEmployeeCountryDataRestrictedView,
      this.SysCharConstants.SystemCharEnableEmployeeOccupationDataRestrictedView
    ];
    return sysCharList.join(',');
  }

  public countryOnChange(event: any): void {
    this.storeData['code'].country = this.formGroup.controls['CountryCode'].value;
    this.businessCodeList = this.cbbService.getBusinessListByCountry(this.storeData['code'].country);
    this.formGroup.controls['BusinessCode'].setValue(this.businessCodeList[0].value);
    if (this.businessCodeList.length > 0) {
      this.storeData['code'].business = this.businessCodeList[0].value;
      this.storeData['code'].multiBusiness = this.businessCodeList[0].value;
    }
    this.fieldVisibility.CmdNotepad = true;
    this.fieldVisibility.CmdNewCall = false;
    this.fieldVisibility.CmdEndCall = true;
    this.store.dispatch({
      type: CallCenterActionTypes.CLEAR_SPECIFIC_GRID, payload: ['Accounts', 'Premises', 'Contracts', 'Logs', 'WorkOrders', 'History', 'EventHistory', 'Invoices']
    });
    let click = new CustomEvent('click', { bubbles: true });
    let elem = document.getElementById('CmdClearSearch');
    if (elem)
      this.renderer.invokeElementMethod(elem, 'dispatchEvent', [click]);
    this.onInit();
    this.fetchTranslationContent();
    if (this.cloneData['dropdownList']) {
      this.storeData['dropdownList'] = JSON.parse(JSON.stringify(this.cloneData['dropdownList']));
    }
    if (this.cloneData['fieldVisibility']) {
      this.storeData['fieldVisibility'] = JSON.parse(JSON.stringify(this.cloneData['fieldVisibility']));
    }
    this.postInitialization();
    this.storeData['gridToClear'] = [];
    this.storeSavedData = {};
  }

  public businessOnChange(event: any): void {
    this.storeData['code'].business = this.formGroup.controls['BusinessCode'].value;
    if (this.storeData['code'].business === 'All') {
      this.storeData['code'].business = this.businessCodeList[0].value;
      this.storeData['code'].numberOfBusiness = this.businessCodeList.length;
    }
    this.storeData['code'].multiBusiness = this.formGroup.controls['BusinessCode'].value;
    this.fieldVisibility.CmdNotepad = true;
    this.fieldVisibility.CmdNewCall = false;
    this.fieldVisibility.CmdEndCall = true;
    this.store.dispatch({
      type: CallCenterActionTypes.CLEAR_SPECIFIC_GRID, payload: ['Accounts', 'Premises', 'Contracts', 'Logs', 'WorkOrders', 'History', 'EventHistory', 'Invoices']
    });
    this.fetchCallCentreDataGet('', { action: 0 }).subscribe((data) => {
      if (data['status'] === GlobalConstant.Configuration.Failure) {
        this.errorService.emitError(data['oResponse']);
      } else {
        if (!data['errorMessage']) {
          // statement
          this.businessData = data;
          let click = new CustomEvent('click', { bubbles: true });
          let elem = document.getElementById('CmdClearSearch');
          if (elem)
            this.renderer.invokeElementMethod(elem, 'dispatchEvent', [click]);
        }
      }
    });
    this.onInit();
    this.fetchTranslationContent();
    if (this.cloneData['dropdownList']) {
      this.storeData['dropdownList'] = JSON.parse(JSON.stringify(this.cloneData['dropdownList']));
    }
    if (this.cloneData['fieldVisibility']) {
      this.storeData['fieldVisibility'] = JSON.parse(JSON.stringify(this.cloneData['fieldVisibility']));
    }
    this.postInitialization();
    this.storeData['gridToClear'] = [];
    this.storeSavedData = {};
  }

  private lookUpRecord(data: Object, maxresults: number): any {
    this.queryLookUp.set(this.serviceConstants.Action, '0');
    if (this.storeData['code'].business) {
      this.queryLookUp.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
    } else {
      this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
    }
    if (this.storeData['code'].country) {
      this.queryLookUp.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
    } else {
      this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
    }

    if (maxresults) {
      this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
    }
    return this.httpService.lookUpRequest(this.queryLookUp, data);
  }

  private triggerFetchSysChar(): void {
    this.fetchSysChar(this.sysCharParameters()).subscribe(
      (e) => {
        if (e.errorMessage) {
          this.errorService.emitError({
            errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
          });
          return false;
        }
        if (e.records && e.records.length > 0) {
          this.syschars['glSCEnableAddressLine3'] = e.records[0].Required;
          this.syschars['glSCShowInfestations'] = e.records[1].Required;
          this.syschars['glLimitEmployeeDataView'] = e.records[2].Required;
          this.syschars['gcCountryDataList'] = e.records[2].Text;
          this.syschars['glLimitOccupationEmployeeDataView'] = e.records[3].Required;
          this.syschars['gcOccupationCodeList'] = e.records[3].Text;

          this.registry.glSCEnableAddressLine3 = e.records[0].Required;
          this.registry.glSCShowInfestations = e.records[1].Required;
          this.registry.glLimitEmployeeDataView = e.records[2].Required;
          this.registry.gcCountryDataList = e.records[2].Text;
          this.registry.gcOccupationCodeList = e.records[3].Text;

        }
        Observable.forkJoin(
          this.fetchPortfolioDescription(this.registry.gcContractPortfolioStatusCodes.split(',')),
          this.fetchPortfolioDescription(this.registry.gcPremisePortfolioStatusCodes.split(',')),
          this.fetchRegistry()
        ).subscribe((data) => {
          if (data[0]['results'] && data[0]['results'].length > 0) {
            let arr = [];
            this.storeData['dropdownList'].tabContracts.ContractStatusCode = [];
            for (let i = 0; i < data[0]['results'].length; i++) {
              arr.push(data[0]['results'][i][0].PortfolioStatusDesc);
              this.storeData['dropdownList'].tabContracts.ContractStatusCode.push({
                value: data[0]['results'][i][0].PortfolioStatusCode,
                desc: data[0]['results'][i][0].PortfolioStatusDesc
              });
            }
            this.list['ContractStatusCodeDesc'] = arr;
            this.registry['gcContractPortfolioStatusDescs'] = arr.join();
          }
          if (data[1]['results'] && data[1]['results'].length > 0) {
            let arr = [];
            this.storeData['dropdownList'].tabPremises.PremiseStatusCode = [];
            for (let i = 0; i < data[1]['results'].length; i++) {
              arr.push(data[1]['results'][i][0].PortfolioStatusDesc);
              this.storeData['dropdownList'].tabPremises.PremiseStatusCode.push({
                value: data[1]['results'][i][0].PortfolioStatusCode,
                desc: data[1]['results'][i][0].PortfolioStatusDesc
              });
            }
            this.list['PremiseStatusCodeDesc'] = arr;
            this.registry['gcPremisePortfolioStatusDescs'] = arr.join();
          }
          this.ajaxSource.next(this.ajaxconstant.COMPLETE);
          // Registry
          if (data[2]['results'] && data[2]['results'].length > 0) {
            if (data[2]['results'][0].length > 0) {
              this.registry.gcDefaultAccountSearch = data[2]['results'][0][0].RegValue;
            }
            if (data[2]['results'][1].length > 0) {
              this.registry.gcDefaultLiveAccount = data[2]['results'][1][0].RegValue;
            }
            if (data[2]['results'][2].length > 0) {
              this.registry.gcDefaultNationalAccount = data[2]['results'][2][0].RegValue;
            }
            if (data[2]['results'][3].length > 0) {
              this.registry.gcDefaultNationalAccountWhenInBr = data[2]['results'][3][0].RegValue;
            }
            if (data[2]['results'][4].length > 0) {
              this.registry.gcDefaultAccountContractType = data[2]['results'][4][0].RegValue;
            }
            if (data[2]['results'][5].length > 0) {
              this.registry.gcAccountPassContractType = (!data[2]['results'][5][0].RegValue) ? 'N' : data[2]['results'][5][0].RegValue;
            }
            if (data[2]['results'][6].length > 0) {
              this.registry.gcAccountPassLiveAccount = (!data[2]['results'][6][0].RegValue) ? 'N' : data[2]['results'][6][0].RegValue;
            }
            if (data[2]['results'][7].length > 0) {
              this.registry.gcAccountPassSearchTypeValue = (!data[2]['results'][7][0].RegValue) ? 'N' : data[2]['results'][7][0].RegValue;
            }
            if (data[2]['results'][8].length > 0) {
              this.registry.gcDefaultAccountSearchType = data[2]['results'][8][0].RegValue;
            }
            if (data[2]['results'][9].length > 0) {
              this.registry.gcDefaultContractType = data[2]['results'][9][0].RegValue;
            }
            if (data[2]['results'][10].length > 0) {
              this.registry.gcDefaultContractPortfolioStatus = data[2]['results'][10][0].RegValue;
            }
            if (data[2]['results'][11].length > 0) {
              this.registry.gcShowNotepadWhenEndCall = (!data[2]['results'][11][0].RegValue) ? 'N' : data[2]['results'][11][0].RegValue;
            }
            if (data[2]['results'][12].length > 0) {
              this.registry.gcDefaultBusinessOriginCode = data[2]['results'][12][0].RegValue;
            }
            if (data[2]['results'][13].length > 0) {
              this.registry.gcDefaultContactMediumCode = data[2]['results'][13][0].RegValue;
            }
            if (data[2]['results'][14].length > 0) {
              this.registry.gcDefaultProspectTypeCode = data[2]['results'][14][0].RegValue;
            }
            if (data[2]['results'][15].length > 0) {
              this.registry.gcDefaultProspectSourceCode = data[2]['results'][15][0].RegValue;
            }
            if (data[2]['results'][16].length > 0) {
              this.registry.gcDefaultCallSearchType = data[2]['results'][16][0].RegValue;
            }
            if (data[2]['results'][17].length > 0) {
              this.registry.gcCallLogStartDateDays = data[2]['results'][17][0].RegValue;
            }
            if (data[2]['results'][18].length > 0) {
              this.registry.gcWODateFromDays = data[2]['results'][18][0].RegValue;
            }
            if (data[2]['results'][19].length > 0) {
              this.registry.gcWODateToDays = data[2]['results'][19][0].RegValue;
            }
            if (data[2]['results'][20].length > 0) {
              this.registry.gcDefaultEventHistorySearchType = data[2]['results'][20][0].RegValue;
            }
            if (data[2]['results'][21].length > 0) {
              this.registry.gcEventHistoryDateFromDays = data[2]['results'][21][0].RegValue;
            }
            if (data[2]['results'][22].length > 0) {
              this.registry.gcDefaultHistorySearchType = data[2]['results'][22][0].RegValue;
            }
            if (data[2]['results'][23].length > 0) {
              this.registry.gcHistoryDateFromDays = data[2]['results'][23][0].RegValue;
            }
            if (data[2]['results'][24].length > 0) {
              this.registry.gcHistoryDateToDays = data[2]['results'][24][0].RegValue;
            }
            if (data[2]['results'][25].length > 0) {
              this.registry.gcWarnNewSearchAndCurrentLogID = data[2]['results'][25][0].RegValue;
            }
            if (data[2]['results'][26].length > 0) {
              this.registry.gcShowAdvantageQuotes = data[2]['results'][26][0].RegValue;
            }
            if (data[2]['results'][27].length > 0) {
              this.registry.gcContractPremiseSearchDelim = data[2]['results'][27][0].RegValue;
            }
            if (data[2]['results'][28].length > 0) {
              this.registry.gcContractCommenceDateFromDays = data[2]['results'][28][0].RegValue;
            }
            if (data[2]['results'][29].length > 0) {
              this.registry.gcPremiseCommenceDateFromDays = data[2]['results'][29][0].RegValue;
            }
            if (data[2]['results'][30].length > 0) {
              this.registry.gcContractCommenceDateToDays = data[2]['results'][30][0].RegValue;
            }
            if (data[2]['results'][31].length > 0) {
              this.registry.gcPremiseCommenceDateToDays = data[2]['results'][31][0].RegValue;
            }
            if (data[2]['results'][32].length > 0) {
              this.registry.glShowRecommendations = data[2]['results'][32][0].RegValue === 'Y' ? true : false;
            }
            if (data[2]['results'][33].length > 0) {
              this.registry.glShowInvoiceBalance = data[2]['results'][33][0].RegValue === 'Y' ? true : false;
            }
            if (data[2]['results'][34].length > 0) {
              this.registry.glMultiContactInd = true;
            } else {
              this.registry.glMultiContactInd = false;
            }

            this.registry.giCallDateDays = parseInt(this.registry.gcCallLogStartDateDays, 10);
            if (this.registry.giCallDateDays === 0 || isNaN(this.registry.giCallDateDays)) {
              this.registry.giCallDateDays = 90;
            }

            this.registry.giWOFromDays = parseInt(this.registry.gcWODateFromDays, 10);
            if (this.registry.giWOFromDays === 0 || isNaN(this.registry.giWOFromDays)) {
              this.registry.giWOFromDays = 180;
            }

            this.registry.giWOFromDays = parseInt(this.registry.gcWODateFromDays, 10);
            if (this.registry.giWOFromDays === 0 || isNaN(this.registry.giWOFromDays)) {
              this.registry.giWOFromDays = 180;
            }

            this.registry.giWOToDays = parseInt(this.registry.gcWODateToDays, 10);
            if (this.registry.giWOToDays === 0 || isNaN(this.registry.giWOToDays)) {
              this.registry.giWOToDays = 180;
            }

            this.registry.giEventHistoryFromDays = parseInt(this.registry.gcEventHistoryDateFromDays, 10);
            if (this.registry.giEventHistoryFromDays === 0 || isNaN(this.registry.giEventHistoryFromDays)) {
              this.registry.giEventHistoryFromDays = 180;
            }

            this.registry.giContractCommenceFromDays = parseInt(this.registry.gcContractCommenceDateFromDays, 10);
            if (this.registry.giContractCommenceFromDays === 0 || isNaN(this.registry.giContractCommenceFromDays)) {
              this.registry.giContractCommenceFromDays = 90;
            }

            this.registry.giPremiseCommenceFromDays = parseInt(this.registry.gcPremiseCommenceDateFromDays, 10);
            if (this.registry.giPremiseCommenceFromDays === 0 || isNaN(this.registry.giPremiseCommenceFromDays)) {
              this.registry.giPremiseCommenceFromDays = 90;
            }

            this.registry.giContractCommenceToDays = parseInt(this.registry.gcContractCommenceDateToDays, 10);
            if (this.registry.giContractCommenceToDays === 0 || isNaN(this.registry.giContractCommenceToDays)) {
              this.registry.giContractCommenceToDays = 30;
            }

            this.registry.giPremiseCommenceToDays = parseInt(this.registry.gcPremiseCommenceDateToDays, 10);
            if (this.registry.giPremiseCommenceToDays === 0 || isNaN(this.registry.giPremiseCommenceToDays)) {
              this.registry.giPremiseCommenceToDays = 30;
            }

            this.registry.giHistoryFromDays = parseInt(this.registry.gcHistoryDateFromDays, 10);
            if (this.registry.giHistoryFromDays === 0 || isNaN(this.registry.giHistoryFromDays)) {
              this.registry.giHistoryFromDays = 180;
            }

            this.registry.giHistoryToDays = parseInt(this.registry.gcHistoryDateToDays, 10);
            if (this.registry.giHistoryToDays === 0 || isNaN(this.registry.giHistoryToDays)) {
              this.registry.giHistoryToDays = 180;
            }
          }

          if (this.registry.gcDefaultContactMediumCode !== '') {
            let data = [
              {
                'table': 'ContactMedium',
                'query': { 'ContactMediumCode': this.registry.gcDefaultContactMediumCode },
                'fields': ['ContactMediumSystemDesc']
              },
              {
                'table': 'ContactMediumLang',
                'query': { 'ContactMediumCode': this.registry.gcDefaultContactMediumCode },
                'fields': ['ContactMediumDesc']
              }
            ];
            this.lookUpRecord(data, 100).subscribe(
              (e) => {
                if (e['results'] && e['results'].length > 0) {
                  if (e['results'][1].length > 0) {
                    this.registry.gcDefaultContactMediumDesc = e['results'][1][0].ContactMediumDesc;
                  } else {
                    this.registry.gcDefaultContactMediumDesc = e['results'][0][0].ContactMediumSystemDesc;
                  }
                }
              },
              (error) => {
                // error statement
              }
            );
          }
          if (this.registry.gcDefaultBusinessOriginCode !== '') {
            let data = [
              {
                'table': 'BusinessOrigin',
                'query': { 'BusinessOriginCode': this.registry.gcDefaultBusinessOriginCode, 'BusinessCode': this.storeData['code'].business },
                'fields': ['BusinessOriginSystemDesc']
              },
              {
                'table': 'BusinessOriginLang',
                'query': { 'BusinessOriginCode': this.registry.gcDefaultBusinessOriginCode, 'BusinessCode': this.storeData['code'].business },
                'fields': ['BusinessOriginDesc']
              }
            ];
            this.lookUpRecord(data, 100).subscribe(
              (e) => {
                if (e['results'] && e['results'].length > 0) {
                  if (e['results'][1].length > 0) {
                    this.registry.gcDefaultBusinessOriginDesc = e['results'][1][0].BusinessOriginDesc;
                  } else {
                    this.registry.gcDefaultBusinessOriginDesc = e['results'][0][0].BusinessOriginSystemDesc;
                  }
                }
              },
              (error) => {
                // error statement
              }
            );
          }
          this.registryClone = JSON.parse(JSON.stringify(this.registry));
          this.store.dispatch({
            type: CallCenterActionTypes.SAVE_OTHER_PARAMS, payload: {
              registry: this.registry,
              webSpeedVariables: this.webSpeedVariables,
              otherVariables: this.otherVariables,
              syschars: this.syschars
            }
          });
          this.postFetchRegistry();
        });
      }, (error) => {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
      }
    );
  }

  public cmdUpdateAccountOnClick(event: any): void {
    if (this.otherVariables.CurrentCallLogID === '' && this.formGroup.controls['VisibleCurrentCallLogID'].value === '') {
      this.cmdNewCallOnClick({}).subscribe((res: any) => {
        this.runAccountMaintenance();
      });
    } else {
      this.runAccountMaintenance();
    }
  }

  public cmdNewCallOnClick(event: any): any {
    let lGoNewCall = 'Y';
    let dataEvent = new Subject<any>();
    if (this.otherVariables.CCMChangesMade === 'Y') {
      if (this.otherVariables.CurrentCallLogID !== '' && this.formGroup.controls['VisibleCurrentCallLogID'].value !== '' && (this.registry.cShowNotepadWhenEndCall === 'Y' || this.otherVariables.CallNotepadSummary === '' || this.otherVariables.CallNotepad === '')) {
        lGoNewCall = 'N';
        this.cmdEndCallOnClick({});
      }
      if (this.otherVariables.CurrentCallLogID !== '' && this.formGroup.controls['VisibleCurrentCallLogID'].value !== '' && (this.registry.cShowNotepadWhenEndCall === 'N' && this.otherVariables.CallNotepadSummary !== '' && this.otherVariables.CallNotepad !== '')) {
        lGoNewCall = 'N';
        this.endCallProcessing();
      }
    }

    if (lGoNewCall === 'Y') {
      this.fetchCallCentreDataPost('NewCall', {}, { BusinessCode: this.storeData['code'].business }).subscribe((data) => {
        if (data['status'] === GlobalConstant.Configuration.Failure) {
          this.errorService.emitError(data['oResponse']);
        } else {
          if (!data['errorMessage']) {
            this.otherVariables.CurrentCallLogID = data.CallLogID;
            this.storeData['otherParams'].otherVariables['CurrentCallLogID'] = data.CallLogID;
            //this.formGroup.controls['VisibleCurrentCallLogID'].setValue(data.CallLogID);
            this.formGroup.controls['CmdUpdateAccount'].disable();
            this.formGroup.controls['CmdNewCContact'].enable();
            dataEvent.next(data);
            dataEvent.unsubscribe();
          }
        }
      });
    } else {
      dataEvent.unsubscribe();
    }
    return dataEvent.asObservable();
  }

  public cmdNotepadOnClick(event: any): void {
    // iCABSCMCallCentreGridNotepad
    this.router.navigate([InternalGridSearchApplicationModuleRoutes.ICABSCMCALLCENTREGRIDNOTEPAD], {
      queryParams: {
        parentMode: 'CallCentreSearch',
        ContractNumber: this.storeData['otherParams'].otherVariables['ContractNumber'],
        PremiseNumber: this.storeData['otherParams'].otherVariables['PremiseNumber'],
        ContractType: this.storeData['otherParams'].otherVariables['ContractType'],
        AccountNumber: this.storeData['otherParams'].otherVariables['AccountNumber'],
        ProspectNumber: this.storeData['otherParams'].otherVariables['ProspectNumber'],
        ProductCode: this.storeData['otherParams'].otherVariables['ProductCode'],
        CallNotepad: this.storeData['otherParams'].otherVariables['CallNotepad'],
        CallNotepadSummary: this.storeData['otherParams'].otherVariables['CallNotepadSummary'],
        CurrentCallLogID: this.otherVariables.CurrentCallLogID
      }
    });
    //this.navigate('CallCentreSearch', '/grid/application/callCentreGridNotepad');
    // this.errorService.emitError({
    //   errorMessage: 'Page is not part of current sprint'
    // });
  }

  public cmdEndCallOnClick(event: any): void {
    if (this.otherVariables.CurrentCallLogID === '') {
      this.cmdNewCallOnClick({}).subscribe((res: any) => {
        this.formGroup.controls['VisibleCurrentCallLogID'].setValue(this.otherVariables.CurrentCallLogID);
        this.endCallTrigger();
      });
    } else {
      this.endCallTrigger();
    }
  }

  public endCallTrigger(): void {
    if (this.otherVariables.CreateCallLogInCCMInd === 'Y' && this.otherVariables.CurrentCallLogID === this.formGroup.controls['VisibleCurrentCallLogID'].value) {
      if (this.registry.cShowNotepadWhenEndCall === 'Y' || this.otherVariables.CallNotepadSummary === '' || this.otherVariables.CallNotepad === '') {
        // iCABSCMCallCentreGridNotepad
        this.router.navigate([InternalGridSearchApplicationModuleRoutes.ICABSCMCALLCENTREGRIDNOTEPAD], {
          queryParams: {
            parentMode: 'CallCentreSearchEndCall',
            ContractNumber: this.storeData['otherParams'].otherVariables['ContractNumber'],
            PremiseNumber: this.storeData['otherParams'].otherVariables['PremiseNumber'],
            ContractType: this.storeData['otherParams'].otherVariables['ContractType'],
            AccountNumber: this.storeData['otherParams'].otherVariables['AccountNumber'],
            ProspectNumber: this.storeData['otherParams'].otherVariables['ProspectNumber'],
            ProductCode: this.storeData['otherParams'].otherVariables['ProductCode'],
            CallNotepad: this.storeData['otherParams'].otherVariables['CallNotepad'],
            CallNotepadSummary: this.storeData['otherParams'].otherVariables['CallNotepadSummary'],
            CurrentCallLogID: this.otherVariables.CurrentCallLogID
          }
        });
        /*this.errorService.emitError({
          errorMessage: 'Page not part of current sprint'
        });*/
      } else {
        this.endCallProcessing();
      }
    }
  }

  public cmdNewCContactOnClick(event: any): void {
    if (this.webSpeedVariables.lRunningFromWOMaintTask) {
      this.otherVariables.SelectedTicketNumber = this.otherVariables.ParentTaskTicketNumber;
    }
    // iCABSCMCallCentreGridNewContact
    /*this.router.navigate(['/billtocash/contract/invoice'], { queryParams: {
      parentMode: 'CallCentreSearch',
      ContractNumber: this.storeData['otherParams'].otherVariables['ContractNumber'],
      PremiseNumber: this.storeData['otherParams'].otherVariables['PremiseNumber'],
      ContractType: this.storeData['otherParams'].otherVariables['ContractType'],
      AccountNumber: this.storeData['otherParams'].otherVariables['AccountNumber'],
      ProspectNumber: this.storeData['otherParams'].otherVariables['ProspectNumber'],
      ProductCode: this.storeData['otherParams'].otherVariables['ProductCode']
    }});*/
    this.errorService.emitError({
      errorMessage: 'Page not part of current sprint'
    });
  }

  public cmdUpdateProspectOnClick(event: any): void {
    if (this.otherVariables.AccountNumberType === 'P') {
      if (this.otherVariables.CurrentCallLogID === '' && this.formGroup.controls['VisibleCurrentCallLogID'].value === '') {
        this.cmdNewCallOnClick({}).subscribe((res: any) => {
          this.runProspectMaintenance(false);
        });
      } else {
        this.runProspectMaintenance(false);
      }
    }
  }

  public cmdViewEmployeeOnClick(event: any): void {
    this.runEmployeeView();
  }

  public runEmployeeView(): void {
    let elem = document.querySelector('#tabCont .nav-tabs li.active a span');
    let tabText = elem ? elem['innerText'] : '';
    let parentMode;
    if (tabText === this.tabsTranslation.tabLogs || tabText === this.tabsTranslation.tabWorkOrders) {
      parentMode = 'PassTechnician';
    } else {
      parentMode = 'CallCentreSearch';
    }
    // iCABSCMCallCentreGridEmployeeView
    this.router.navigate([InternalGridSearchApplicationModuleRoutes.ICABSCMCALLCENTERGRIDEMPLOYEEVIEW], {
      queryParams: {
        parentMode: parentMode,
        AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
        ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
        PremiseNumber: this.storeData['otherParams'].otherVariables.PremiseNumber,
        TechEmployeeCode: this.storeData['otherParams'].otherVariables.TechEmployeeCode,
        AccountProspectNumber: this.storeData['formGroup'].main.controls['AccountProspectNumber'].value,
        AccountProspectName: this.storeData['formGroup'].main.controls['AccountProspectName'].value,
        ContractName: this.storeData['otherParams'].otherVariables.ContractName,
        PremiseName: this.storeData['formGroup'].tabPremises.controls['PremiseName'].value,
        AccountProspectContactName: this.storeData['formGroup'].main.controls['AccountProspectContactName'].value,
        CurrentCallLogID: this.storeData['otherParams'].otherVariables.CurrentCallLogID
      }
    });
    /*this.errorService.emitError({
      errorMessage: 'Page not part of current sprint'
    });*/
  }

  public riExchangeUpdateHTMLDocument(): void {
    if (this.otherVariables.WindowClosingName === 'AmendmentsMade') {
      this.otherVariables.CCMChangesMade = 'Y';
      this.formGroup.controls['VisibleCurrentCallLogID'].setValue(this.otherVariables.CurrentCallLogID);
      this.cmdEndCallOnClick({});
    }

    if (this.otherVariables.WindowClosingName === 'NewContactChanges' || this.otherVariables.WindowClosingName === 'iCABSCMPipelineProspect') {
      this.otherVariables.CCMChangesMade = 'Y';
      this.formGroup.controls['VisibleCurrentCallLogID'].setValue(this.otherVariables.CurrentCallLogID);
      this.cmdEndCallOnClick({});
    }

    if (this.otherVariables.WindowClosingName === 'NotepadEndCallOK') {
      this.endCallProcessing();
    }
  }

  public runAccountMaintenance(): void {
    if (this.otherVariables.CurrentCallLogID === '' && (this.formGroup.controls['VisibleCurrentCallLogID'].value === '' || this.formGroup.controls['VisibleCurrentCallLogID'].value === '0')) {
      this.cmdNewCallOnClick({}).subscribe((res: any) => {
        if (this.storeData['otherParams'].otherVariables.AccountNumber !== '') {
          this.router.navigate([this.ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], {
            queryParams: {
              parentMode: 'CallCentreSearch',
              AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
              CurrentCallLogID: this.formGroup.controls['VisibleCurrentCallLogID'].value || this.otherVariables.CurrentCallLogID
            }
          });
        }
      });
    } else {
      if (this.storeData['otherParams'].otherVariables.AccountNumber !== '') {
        this.router.navigate([this.ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], {
          queryParams: {
            parentMode: 'CallCentreSearch',
            AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
            CurrentCallLogID: this.formGroup.controls['VisibleCurrentCallLogID'].value || this.otherVariables.CurrentCallLogID
          }
        });
      }
    }
  }

  public runCustomerContactMaintenance(): void {
    if (this.otherVariables.CurrentCallLogID === '' && (this.formGroup.controls['VisibleCurrentCallLogID'].value === '' || this.formGroup.controls['VisibleCurrentCallLogID'].value === '0')) {
      this.cmdNewCallOnClick({}).subscribe((res: any) => {
        this.errorService.emitError({
          errorMessage: 'Page not part of current sprint'
        });
        // iCABSCMCustomerContactMaintenance
        /*this.router.navigate([this.ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], { queryParams: {
          parentMode: 'CallCentreSearch',
          accountNumber: this.storeData['otherParams'].otherVariables['AccountNumber']
        }});*/
      });
    }
  }

  public runCustomerContactDetailGrid(): void {
    if (this.otherVariables.CurrentCallLogID === '' && (this.formGroup.controls['VisibleCurrentCallLogID'].value === '' || this.formGroup.controls['VisibleCurrentCallLogID'].value === '0')) {
      this.cmdNewCallOnClick({}).subscribe((res: any) => {
        this.errorService.emitError({
          errorMessage: 'Page not part of current sprint'
        });
        //iCABSCMCustomerContactDetailGrid
        /*this.router.navigate([this.ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], { queryParams: {
          parentMode: 'CallCentreSearch',
          accountNumber: this.storeData['otherParams'].otherVariables['AccountNumber']
        }});*/
      });
    } else {
      this.errorService.emitError({
        errorMessage: 'Page not part of current sprint'
      });
      //iCABSCMCustomerContactDetailGrid
      /*this.router.navigate([this.ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], { queryParams: {
        parentMode: 'CallCentreSearch',
        accountNumber: this.storeData['otherParams'].otherVariables['AccountNumber']
      }});*/
    }
  }

  public runContractMaintenance(): void {
    if (this.otherVariables.ContractLimitDataView === 'N') {
      if (this.otherVariables.CurrentCallLogID === '' && (this.formGroup.controls['VisibleCurrentCallLogID'].value === '' || this.formGroup.controls['VisibleCurrentCallLogID'].value === '0')) {
        this.cmdNewCallOnClick({}).subscribe((res: any) => {
          this.runContractTrigger();
        });
      } else {
        this.runContractTrigger();
      }
    } else {
      this.errorService.emitError({
        errorMessage: this.registry['gcPermissionDeniedMessage']
      });
    }
  }

  public runContractTrigger(): void {
    if (this.otherVariables.ContractType === 'C') {
      this.router.navigate([this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], {
        queryParams: {
          parentMode: 'CallCentreSearch',
          ContractNumber: this.storeData['otherParams'].otherVariables['ContractNumber'],
          CurrentCallLogID: this.formGroup.controls['VisibleCurrentCallLogID'].value || this.otherVariables.CurrentCallLogID
        }
      });
    } else if (this.otherVariables.ContractType === 'J') {
      this.router.navigate([this.ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], {
        queryParams: {
          parentMode: 'CallCentreSearch',
          ContractNumber: this.storeData['otherParams'].otherVariables['ContractNumber'],
          CurrentCallLogID: this.formGroup.controls['VisibleCurrentCallLogID'].value || this.otherVariables.CurrentCallLogID
        }
      });
    } else if (this.otherVariables.ContractType === 'P') {
      this.router.navigate([this.ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], {
        queryParams: {
          parentMode: 'CallCentreSearch',
          ContractNumber: this.storeData['otherParams'].otherVariables['ContractNumber'],
          CurrentCallLogID: this.formGroup.controls['VisibleCurrentCallLogID'].value || this.otherVariables.CurrentCallLogID
        }
      });
    }
  }

  public runPremiseMaintenance(): void {
    if (this.otherVariables.PremiseLimitDataView === 'N') {
      if (this.otherVariables.CurrentCallLogID === '' && (this.formGroup.controls['VisibleCurrentCallLogID'].value === '' || this.formGroup.controls['VisibleCurrentCallLogID'].value === '0')) {
        this.cmdNewCallOnClick({}).subscribe((res: any) => {
          // iCABSAPremiseMaintenance
          this.router.navigate([this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
            queryParams: {
              parentMode: 'CallCentreSearch',
              ContractNumber: this.storeData['otherParams'].otherVariables['ContractNumber'],
              AccountNumber: this.storeData['otherParams'].otherVariables['AccountNumber'],
              PremiseNumber: this.storeData['otherParams'].otherVariables['PremiseNumber'],
              AccountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
              contractTypeCode: this.storeData['otherParams'].otherVariables.ContractType,
              CurrentCallLogID: this.formGroup.controls['VisibleCurrentCallLogID'].value || this.otherVariables.CurrentCallLogID
            }
          });
        });
      } else {
        this.router.navigate([this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
          queryParams: {
            parentMode: 'CallCentreSearch',
            ContractNumber: this.storeData['otherParams'].otherVariables['ContractNumber'],
            AccountNumber: this.storeData['otherParams'].otherVariables['AccountNumber'],
            PremiseNumber: this.storeData['otherParams'].otherVariables['PremiseNumber'],
            AccountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
            contractTypeCode: this.storeData['otherParams'].otherVariables.ContractType,
            CurrentCallLogID: this.formGroup.controls['VisibleCurrentCallLogID'].value || this.otherVariables.CurrentCallLogID
          }
        });
      }
    } else {
      this.errorService.emitError({
        errorMessage: this.registry['gcPermissionDeniedMessage']
      });
    }
  }

  public runProspectMaintenance(prospectAction: any): void {
    if (this.otherVariables.CurrentCallLogID === '' && this.formGroup.controls['VisibleCurrentCallLogID'].value === '') {
      this.fetchCallCentreDataPost('NewCall', {}, { BusinessCode: this.storeData['code'].business }).subscribe((data) => {
        if (data['status'] === GlobalConstant.Configuration.Failure) {
          this.errorService.emitError(data['oResponse']);
        } else {
          if (!data['errorMessage']) {
            this.otherVariables.CurrentCallLogID = data.CallLogID;
            this.storeData['otherParams'].otherVariables.CurrentCallLogID = data.CalllLogID;
            //this.formGroup.controls['VisibleCurrentCallLogID'].setValue(data.CallLogID);
            this.formGroup.controls['CmdUpdateAccount'].disable();
            this.formGroup.controls['CmdNewCContact'].enable();
            let parentMode;
            if (prospectAction) {
              parentMode = 'CallCentreSearchNew';
            } else {
              parentMode = 'CallCentreSearch';
            }
            // PipelineProspect
            this.router.navigate(['/prospecttocontract/maintenance/prospect'], {
              queryParams: {
                parentMode: parentMode,
                AccountNumber: this.storeData['otherParams'].otherVariables['AccountNumber'],
                AccountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
                ProspectNumber: this.storeData['otherParams'].otherVariables['ProspectNumber'],
                CurrentCallLogID: this.formGroup.controls['VisibleCurrentCallLogID'].value || this.otherVariables.CurrentCallLogID
              }
            });
          }
        }
      });
    }
  }

  public runCustomerInformation(runningForm: any): void {
    // iCABSACustomerInformationSummary
    this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSACUSTOMERINFORMATIONSUMMARY.URL_1], {
      queryParams: {
        parentMode: runningForm,
        AccountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
        AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
        ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
        CurrentCallLogID: this.formGroup.controls['VisibleCurrentCallLogID'].value || this.otherVariables.CurrentCallLogID
      }
    });
  }

  public showInvoiceToScreen(params: any): void {
    let rowId = params[0];
    this.fetchCallCentreDataGet('Single', { action: 0, InvoiceNumber: params[0], LayoutNumber: 0 }).subscribe((data) => {
      if (data['status'] === GlobalConstant.Configuration.Failure) {
        this.errorService.emitError(data['oResponse']);
      } else {
        if (!data['errorMessage']) {
          if (data.url) {
            //window.location.href = data.url;
            window.open(data.url, '_blank');
          } else if (data.fullError.indexOf('iCABSAInvoiceReprintMaintenance.htm') >= 0) {
            let tempList = data.fullError.split('?');
            if (tempList && tempList.length > 1) {
              let params = new URLSearchParams(tempList[1]);
              let invoiceNumber = params.get('InvoiceNumber');
              this.router.navigate([InternalMaintenanceApplicationModuleRoutes.ICABSAINVOICEREPRINTMAINTENANCE], { queryParams: { InvoiceNumber: invoiceNumber, InvoiceRowId: rowId } });
            }
          }
        }
      }
    });
  }

  public showInvoiceViaEmail(params: any): void {
    if (this.otherVariables.CurrentCallLogID === '') {
      /*let click = new CustomEvent('click', { bubbles: true });
      let elem = document.querySelector('#CmdNewCall');
      if (elem)
        this.renderer.invokeElementMethod(elem, 'dispatchEvent', [click]);*/
      this.cmdNewCallOnClick({}).subscribe((res: any) => {
        this.emailInvoiceService();
      });
    } else {
      this.emailInvoiceService();
    }
  }

  public emailInvoiceService(): void {
    this.fetchCallCentreDataPost('EmailInvoice', { action: 6 }, {
      CallLogID: this.formGroup.controls['VisibleCurrentCallLogID'].value || this.otherVariables.CurrentCallLogID,
      AccountNumber: this.otherVariables.AccountNumber,
      BusinessCode: this.storeData['code'].business,
      InvoiceROWID: this.otherVariables.SelectedInvoiceRowID,
      EmailAddress: this.storeData['formGroup'].tabInvoices.controls['InvoiceEmailAddress'].value
    }).subscribe((data) => {
      if (data['status'] === GlobalConstant.Configuration.Failure) {
        this.errorService.emitError(data['oResponse']);
      } else {
        if (!data['errorMessage']) {
          this.messageService.emitMessage({
            msg: data['ReturnMessage'],
            title: 'Message'
          });
          this.otherVariables.CCMChangesMade = 'Y';
          this.cmdEndCallOnClick({});
        } else {
          this.errorService.emitError(data);
        }
      }
    });
  }

  public portfolioContactDetails(cLevel: Array<any>): void {
    let cExchangeMode;
    switch (cLevel[0]) {
      case 'AC':
        cExchangeMode = 'CCMSearchAccount';
        break;

      case 'CO':
        cExchangeMode = 'CCMSearchContract';
        break;

      case 'PR':
        cExchangeMode = 'CCMSearchPremise';
        break;

      default:
        // code...
        break;
    }
    if (this.otherVariables.CurrentCallLogID === '' && this.storeData['formGroup'].main.controls['VisibleCurrentCallLogID'].value === '') {
      this.cmdNewCallOnClick({}).subscribe((res: any) => {
        this.router.navigate([InternalMaintenanceServiceModuleRoutes.ICABSCMCONTACTPERSONMAINTENANCE], {
          queryParams: {
            parentMode: cExchangeMode,
            CurrentCallLogID: this.formGroup.controls['VisibleCurrentCallLogID'].value || this.otherVariables.CurrentCallLogID,
            ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
            ContractName: this.storeData['otherParams'].otherVariables.ContractName,
            accountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
            accountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
            PremiseNumber: this.storeData['otherParams'].otherVariables['PremiseNumber'],
            PremiseName: this.storeData['formGroup'].tabPremises.controls['PremiseName'].value
          }
        });
      });
    } else {
      this.router.navigate([InternalMaintenanceServiceModuleRoutes.ICABSCMCONTACTPERSONMAINTENANCE], {
        queryParams: {
          parentMode: cExchangeMode,
          CurrentCallLogID: this.formGroup.controls['VisibleCurrentCallLogID'].value || this.otherVariables.CurrentCallLogID,
          ContractNumber: this.storeData['otherParams'].otherVariables.ContractNumber,
          ContractName: this.storeData['otherParams'].otherVariables.ContractName,
          AccountNumber: this.storeData['otherParams'].otherVariables.AccountNumber,
          AccountName: this.storeData['formGroup'].tabAccounts.controls['AccountName'].value,
          PremiseNumber: this.storeData['otherParams'].otherVariables['PremiseNumber'],
          PremiseName: this.storeData['formGroup'].tabPremises.controls['PremiseName'].value
        }
      });
    }
  }

  public endCallProcessing(): void {
    this.fetchCallCentreDataPost('EndCall', {}, {
      CallLogID: this.otherVariables.CallLogID,
      CallContactName: this.otherVariables.CallContactName,
      CallContactPosition: this.otherVariables.CallContactPosition,
      CallContactTelephone: this.otherVariables.CallContactTelephone,
      CallContactFax: this.otherVariables.CallContactFax,
      CallContactMobile: this.otherVariables.CallContactMobile,
      CallContactEmail: this.otherVariables.CallContactEmail,
      CallContactPostcode: this.otherVariables.CallContactPostcode,
      CallTicketReference: this.otherVariables.CallTicketReference,
      CallSummary: this.otherVariables.CallSummary,
      CallDetails: this.otherVariables.CallDetails,
      NotificationCloseType: this.otherVariables.NotificationCloseType

    }).subscribe((data) => {
      if (data['status'] === GlobalConstant.Configuration.Failure) {
        this.errorService.emitError(data['oResponse']);
      } else {
        if (!data['errorMessage']) {
          // statement
        }
      }
    });

    this.otherVariables.CurrentCallLogID = '';
    this.otherVariables.CCMChangesMade = '';
    this.otherVariables.SelectedTicketNumber = '';
    this.otherVariables.CallContactName = '';
    this.otherVariables.CallContactPosition = '';
    this.otherVariables.CallContactTelephone = '';
    this.otherVariables.CallContactFax = '';
    this.otherVariables.CallContactMobile = '';
    this.otherVariables.CallContactEmail = '';
    this.otherVariables.CallContactPostcode = '';
    this.otherVariables.CallTicketReference = '';
    this.otherVariables.CallNotepadSummary = '';
    this.otherVariables.CallNotepad = '';
    this.otherVariables.NotificationCloseType = '0';
    this.formGroup.controls['VisibleCurrentCallLogID'].setValue('');
    this.formGroup.controls['CmdUpdateAccount'].disable();
    this.formGroup.controls['CmdUpdateProspect'].disable();
    this.formGroup.controls['CmdNewCContact'].enable();
    this.formGroup.controls['CmdViewEmployee'].disable();
  }


  public cmdEmployeeOnClick(event: any): void {
    // iCABSCMCallCentreSearchEmployeeGrid
    this.router.navigate([InternalGridSearchApplicationModuleRoutes.ICABSCMCALLCENTRESEARCHEMPLOYEEGRID], {
      queryParams: {
        parentMode: 'CallCentreSearch'
      }
    });
  }

  public onActionBtnFocus(e: any): void {
    let elemList = document.querySelectorAll('#actionBtnCont input:not([disabled])');
    if (e.target === elemList[elemList.length - 1]) {
      let code = (e.keyCode ? e.keyCode : e.which);
      let elemList = document.querySelectorAll('#tabCont .nav-tabs li a');
      let currentSelectedIndex = Array.prototype.indexOf.call(elemList, document.querySelector('#tabCont .nav-tabs li a.active'));
      if (code === 9 && currentSelectedIndex < (elemList.length - 1)) {
        let click = new CustomEvent('click', { bubbles: true });
        this.renderer.invokeElementMethod(elemList[currentSelectedIndex + 1], 'dispatchEvent', [click]);
        setTimeout(() => {
          document.querySelector('#tabCont .tab-content .tab-pane.active input:not([disabled]), #tabCont .tab-content .tab-pane.active select:not([disabled])')['focus']();
        }, 0);
      }
      return;
    }
  }

  public onNewCCClick(event: any): void {
    //New MVP2 page iCABSCMCallCentreGridNewContact navigation path added below
    this.router.navigate([AppModuleRoutes.CCM + CCMModuleRoutes.ICABSCMCALLCENTREGRIDNEWCONTACT], {
      queryParams: {
        parentMode: 'CallCentreSearch',
        ContractNumber: this.storeData['otherParams'].otherVariables['ContractNumber'],
        PremiseNumber: this.storeData['otherParams'].otherVariables['PremiseNumber'],
        ContractType: this.storeData['otherParams'].otherVariables['ContractType'],
        AccountNumber: this.storeData['otherParams'].otherVariables['AccountNumber'],
        AccountProspectName: this.storeData['formGroup'].main.controls['AccountProspectName'].value,
        ProspectNumber: this.storeData['otherParams'].otherVariables['ProspectNumber'],
        ProductCode: this.storeData['otherParams'].otherVariables['ProductCode'],
        CurrentCallLogID: this.otherVariables.CurrentCallLogID
      }
    });
  }

  public resetCallDetails(): void {
    this.formGroup.controls['CmdUpdateAccount'].disable();
    this.formGroup.controls['CmdUpdateProspect'].disable();
    this.formGroup.controls['CmdNewCContact'].enable();
    this.formGroup.controls['CmdViewEmployee'].disable();
    this.storeData['fieldVisibility'].tabAccounts.FurtherRecords = false;
    this.storeData['fieldVisibility'].tabContracts.FurtherRecords = false;
    this.storeData['fieldVisibility'].tabPremises.FurtherRecords = false;
    this.storeData['fieldVisibility'].tabInvoices.FurtherRecords = false;
    this.storeData['fieldVisibility'].tabHistory.FurtherRecords = false;
    this.storeData['fieldVisibility'].tabEventHistory.FurtherRecords = false;
    this.storeData['fieldVisibility'].tabWorkOrders.FurtherRecords = false;
    //this.storeData['fieldVisibility'].tabDlContract.FurtherRecords = false;

    this.storeData['fieldVisibility'].tabAccounts.AccountForm = false;
    this.storeData['fieldVisibility'].tabPremises.PremiseForm = false;

    this.otherVariables.CCMChangesMade = '';
    this.otherVariables.SelectedTicketNumber = '';
    this.otherVariables.CallContactName = '';
    this.otherVariables.CallContactPosition = '';
    this.otherVariables.CallContactTelephone = '';
    this.otherVariables.CallContactFax = '';
    this.otherVariables.CallContactMobile = '';
    this.otherVariables.CallContactEmail = '';
    this.otherVariables.CallContactPostcode = '';
    this.otherVariables.CallTicketReference = '';

    this.otherVariables.AccountNumber = '';
    this.storeData['formGroup'].main.controls['AccountProspectNumber'].setValue('');
    this.storeData['formGroup'].main.controls['AccountProspectName'].setValue('');
    this.storeData['formGroup'].main.controls['AccountProspectContactName'].setValue('');
    this.storeData['formGroup'].tabAccounts.controls['AccountName'].setValue('');
    this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine1'].setValue('');
    this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine2'].setValue('');
    this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine3'].setValue('');
    this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine4'].setValue('');
    this.storeData['formGroup'].tabAccounts.controls['AccountAddressLine5'].setValue('');
    this.storeData['formGroup'].tabAccounts.controls['AccountPostcode'].setValue('');
    this.storeData['formGroup'].tabAccounts.controls['AccountContactPosition'].setValue('');
    this.storeData['formGroup'].tabAccounts.controls['AccountContactTelephone'].setValue('');

    this.otherVariables.ProspectNumber = '';
    this.otherVariables.TechEmployeeCode = '';
    this.otherVariables.ProductCode = '';
    this.otherVariables.ProductDesc = '';
    this.otherVariables.ContractNumber = '';
    this.otherVariables.ContractName = '';
    this.otherVariables.PremiseNumber = '';
    this.otherVariables.ProductCode = '';
    this.otherVariables.ProductDesc = '';
    this.otherVariables.TicketProspectNumber = '';
    this.storeData['formGroup'].tabAccounts.controls['AccountContactName'].setValue('');
    if (this.storeData['formGroup'].tabPremises.controls['PremiseName']) {
      this.storeData['formGroup'].tabPremises.controls['PremiseName'].setValue('');
    }
    if (!this.webSpeedVariables.lClosingLogBeforeProceed) {
      this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue'].setValue('');
      this.storeData['formGroup'].tabAccounts.controls['AccountSearchValue2'].setValue('');
      this.storeData['formGroup'].tabAccounts.controls['AccountDataSet'].setValue(this.storeFormDataClone.tabAccounts.AccountDataSet);
      this.storeData['formGroup'].tabAccounts.controls['AccountNational'].setValue(this.storeFormDataClone.tabAccounts.AccountNational);
      this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn2'].setValue(this.storeFormDataClone.tabAccounts.AccountSearchOn2);
      this.storeData['formGroup'].tabAccounts.controls['AccountStatus'].setValue(this.storeFormDataClone.tabAccounts.AccountStatus);
      this.storeData['formGroup'].tabAccounts.controls['AccountSearchOn'].setValue(this.storeFormDataClone.tabAccounts.AccountSearchOn);
      this.storeData['formGroup'].tabAccounts.controls['AccountContractType'].setValue(this.storeFormDataClone.tabAccounts.AccountContractType);

    }
    this.webSpeedVariables.lClosingLogBeforeProceed = false;
    this.storeData['formGroup'].tabLogs.controls['CallLogSearchOn'].setValue(this.storeFormDataClone.tabLogs.CallLogSearchOn);
    this.storeData['formGroup'].tabLogs.controls['CallLogSearchValue'].setValue('');
    this.otherVariables.SelectedTicketNumber = '';
    this.otherVariables.SelectedAddressLine4 = '';
    this.otherVariables.SelectedAddressLine5 = '';
    this.otherVariables.SelectedPostcode = '';
    this.otherVariables.AccountNumberType = 'A';
    this.resetAllSearchDetails();
  }

  public resetAllSearchDetails(): void {
    this.storeData['fieldVisibility'].tabContracts.FurtherRecords = false;
    this.storeData['formGroup'].tabContracts.controls['ContractSearchOn'].setValue('all');
    this.storeData['formGroup'].tabContracts.controls['ContractSearchValue'].setValue('');
    this.storeData['formGroup'].tabContracts.controls['ContractStatusCode'].setValue(this.storeFormDataClone.tabContracts.ContractStatusCode);
    this.storeData['formGroup'].tabContracts.controls['ContractTypeCode'].setValue(this.storeFormDataClone.tabContracts.ContractTypeCode);

    this.storeData['fieldVisibility'].tabPremises.FurtherRecords = false;
    this.storeData['formGroup'].tabPremises.controls['PremSelectedContract'].setValue('');
    this.storeData['formGroup'].tabPremises.controls['PremiseSearchOn'].setValue('all');
    this.storeData['formGroup'].tabPremises.controls['PremiseSearchValue'].setValue('');
    this.storeData['formGroup'].tabPremises.controls['PremiseStatusCode'].setValue('all');
    this.storeData['formGroup'].tabPremises.controls['PremiseContractTypeCode'].setValue(this.storeFormDataClone.tabPremises.PremiseContractTypeCode);

    this.storeData['otherParams'].otherVariables.InvSelectedContract = '';
    this.storeData['otherParams'].otherVariables.InvSelectedPremise = '';
    this.storeData['formGroup'].tabInvoices.controls['InvSelectedContractPremise'].setValue();
    this.storeData['formGroup'].tabInvoices.controls['InvoiceSearchOn'].setValue('all');
    this.storeData['formGroup'].tabInvoices.controls['InvoiceSearchValue'].setValue('');
    this.storeData['formGroup'].tabInvoices.controls['InvoiceContractTypeCode'].setValue(this.storeFormDataClone.tabInvoices.InvoiceContractTypeCode);

    this.storeData['otherParams'].otherVariables.EventHistorySelectedContract = '';
    this.storeData['otherParams'].otherVariables.EventHistorySelectedPremise = '';
    this.storeData['otherParams'].otherVariables.EventHistorySelectedContractPremise = '';
    this.storeData['formGroup'].tabEventHistory.controls['EventHistorySelectedContractPremise'].setValue('');
    this.storeData['formGroup'].tabEventHistory.controls['EventHistoryType'].setValue(this.storeFormDataClone.tabEventHistory.EventHistoryType);
    //this.storeData['formGroup'].tabEventHistory.controls['EventHistoryFromDate'].setValue('');
    //this.storeData['formGroup'].tabEventHistory.controls['EventHistoryToDate'].setValue('');

    this.storeData['otherParams'].otherVariables.HistorySelectedContract = '';
    this.storeData['otherParams'].otherVariables.HistorySelectedPremise = '';
    this.storeData['formGroup'].tabHistory.controls['HistorySelectedContractPremise'].setValue('');
    this.storeData['formGroup'].tabHistory.controls['HistoryType'].setValue(this.storeFormDataClone.tabHistory.HistoryType);
    //this.storeData['formGroup'].tabHistory.controls['HistoryFromDate'].setValue('');
    //this.storeData['formGroup'].tabHistory.controls['HistoryToDate'].setValue('');

    this.storeData['otherParams'].otherVariables.SelectedTicketNumber = '';
    this.storeData['otherParams'].otherVariables.CallLogSelectedContract = '';
    this.storeData['otherParams'].otherVariables.CallLogSelectedPremise = '';
    this.storeData['formGroup'].tabLogs.controls['CallLogSelectedContractPremise'].setValue('');
    setTimeout(() => {
      this.storeData['formGroup'].tabLogs.controls['CallLogSearchOn'].setValue(this.storeFormDataClone.tabLogs.CallLogSearchOn);
    }, 0);
    this.storeData['formGroup'].tabLogs.controls['CallLogSearchValue'].setValue('');
    //this.storeData['formGroup'].tabLogs.controls['CallLogDate'].setValue('');
    this.storeData['otherParams'].otherVariables.WOSelectedContract = '';
    this.storeData['otherParams'].otherVariables.WOSelectedPremise = '';
    this.storeData['formGroup'].tabWorkOrders.controls['WOSelectedContractPremise'].setValue('');
    //this.storeData['formGroup'].tabWorkOrders.controls['WOFromDate'].setValue('');
    //this.storeData['formGroup'].tabWorkOrders.controls['WOToDate'].setValue('');

    this.storeData['otherParams'].otherVariables.dlContractSelectedContract = '';
    this.storeData['otherParams'].otherVariables.dlContractSelectedPremise = '';
    this.setDefaultDates();
    this.storeData['fieldVisibility'].tabContracts.ContractSearchValue = true;
    this.storeData['fieldVisibility'].tabContracts.ContractCommenceDateFrom = false;
    this.storeData['fieldVisibility'].tabContracts.ContractCommenceDateTo = false;
    this.storeData['fieldVisibility'].tabPremises.PremiseSearchValue = true;
    this.storeData['fieldVisibility'].tabPremises.PremiseCommenceDateFrom = false;
    this.storeData['fieldVisibility'].tabPremises.PremiseCommenceDateTo = false;

    // Account Status Change
    // Account Contract Type Change
    this.passLiveAccountStatusToAllSearches();
    this.passContractTypeToAllSearches();
  }

  public onTabSelect(event: any): void {
    this.utils.removeSelection();
    if (!this.isNavAway) {
      this.formGroup.controls['CmdViewEmployee'].disable();
      if (event.tabInfo) {
        this.getTranslatedValue('Premises', null).subscribe((res: string) => {
          if (res) {
            if (event.tabInfo.translated === res || event.tabInfo.title === res || event.tabInfo.title === 'Premises') {
              if (this.storeData['otherParams']['otherVariables'])
                this.storeData['otherParams']['otherVariables']['currentTab'] = this.storeData['tabsTranslation'].tabPremises;
              if (this.storeData['refresh'].tabPremises === true) {
                this.store.dispatch({
                  type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['Premises']
                });
                this.storeData['refresh'].tabPremises = false;
              }
            } else {
              if (this.storeData['otherParams']['otherVariables'])
                this.storeData['otherParams']['otherVariables']['currentTab'] = '';
            }
          }
        });

        this.getTranslatedValue('Contracts/Jobs', null).subscribe((res: string) => {
          if (res) {
            if (event.tabInfo.translated === res || event.tabInfo.title === res || event.tabInfo.title === 'Contracts/Jobs') {
              if (this.storeData['otherParams']['otherVariables'])
                this.storeData['otherParams']['otherVariables']['currentTab'] = this.storeData['tabsTranslation'].tabContracts;
              if (this.storeData['refresh'].tabContracts === true) {
                this.store.dispatch({
                  type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['Contracts']
                });
                this.storeData['refresh'].tabContracts = false;
              }
            } else {
              if (this.storeData['otherParams']['otherVariables'])
                this.storeData['otherParams']['otherVariables']['currentTab'] = '';
            }
          }
        });

        this.getTranslatedValue('Invoices', null).subscribe((res: string) => {
          if (res) {
            if (event.tabInfo.translated === res || event.tabInfo.title === res || event.tabInfo.title === 'Invoices') {
              if (this.storeData['otherParams']['otherVariables'])
                this.storeData['otherParams']['otherVariables']['currentTab'] = this.storeData['tabsTranslation'].tabInvoices;
              if (this.storeData['refresh'].tabInvoices === true) {
                this.store.dispatch({
                  type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['Invoices']
                });
                this.storeData['refresh'].tabInvoices = false;
              }
            } else {
              if (this.storeData['otherParams']['otherVariables'])
                this.storeData['otherParams']['otherVariables']['currentTab'] = '';
            }
          }
        });

        this.getTranslatedValue('Work Orders', null).subscribe((res: string) => {
          if (res) {
            if (event.tabInfo.translated === res || event.tabInfo.title === res || event.tabInfo.title === 'Work Orders') {
              if (this.storeData['otherParams']['otherVariables'])
                this.storeData['otherParams']['otherVariables']['currentTab'] = this.storeData['tabsTranslation'].tabWorkOrders;
              if (this.storeData['refresh'].tabWorkOrders === true) {
                this.store.dispatch({
                  type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['WorkOrders']
                });
                this.storeData['refresh'].tabWorkOrders = false;
              }
            } else {
              if (this.storeData['otherParams']['otherVariables'])
                this.storeData['otherParams']['otherVariables']['currentTab'] = '';
            }
          }
        });

        this.getTranslatedValue('Event History', null).subscribe((res: string) => {
          if (res) {
            if (event.tabInfo.translated === res || event.tabInfo.title === res || event.tabInfo.title === 'Event History') {
              if (this.storeData['otherParams']['otherVariables'])
                this.storeData['otherParams']['otherVariables']['currentTab'] = this.storeData['tabsTranslation'].tabEventHistory;
              if (this.storeData['refresh'].tabEventHistory === true) {
                this.store.dispatch({
                  type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['EventHistory']
                });
                this.storeData['refresh'].tabEventHistory = false;
              }
            } else {
              if (this.storeData['otherParams']['otherVariables'])
                this.storeData['otherParams']['otherVariables']['currentTab'] = '';
            }
          }
        });

        this.getTranslatedValue('History', null).subscribe((res: string) => {
          if (res) {
            if (event.tabInfo.translated === res || event.tabInfo.title === res || event.tabInfo.title === 'History') {
              if (this.storeData['otherParams']['otherVariables'])
                this.storeData['otherParams']['otherVariables']['currentTab'] = this.storeData['tabsTranslation'].tabHistory;
              if (this.storeData['refresh'].tabHistory === true) {
                this.store.dispatch({
                  type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['History']
                });
                this.storeData['refresh'].tabHistory = false;
              }
            } else {
              if (this.storeData['otherParams']['otherVariables'])
                this.storeData['otherParams']['otherVariables']['currentTab'] = '';
            }
          }
        });

        this.getTranslatedValue('Logs', null).subscribe((res: string) => {
          if (res) {
            if (event.tabInfo.translated === res || event.tabInfo.title === res || event.tabInfo.title === 'Logs') {
              if (this.storeData['otherParams']['otherVariables'])
                this.storeData['otherParams']['otherVariables']['currentTab'] = this.storeData['tabsTranslation'].tabLogs;
              if (this.storeData['refresh'].tabLogs === true) {
                this.store.dispatch({
                  type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['Logs']
                });
                this.storeData['refresh'].tabLogs = false;
              }
            } else {
              if (this.storeData['otherParams']['otherVariables'])
                this.storeData['otherParams']['otherVariables']['currentTab'] = '';
            }
          }
        });

        this.getTranslatedValue('Dashboard', null).subscribe((res: string) => {
          if (res) {
            if (event.tabInfo.translated === res || event.tabInfo.title === res || event.tabInfo.title === 'Dashboard') {
              if (this.storeData['otherParams']['otherVariables'])
                this.storeData['otherParams']['otherVariables']['currentTab'] = this.storeData['tabsTranslation'].tabDashboard;
              if (this.storeData['refresh'].tabDashboard === true) {
                this.store.dispatch({
                  type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['Dashboard']
                });
                this.storeData['refresh'].tabDashboard = false;
              }
            } else {
              if (this.storeData['otherParams']['otherVariables'])
                this.storeData['otherParams']['otherVariables']['currentTab'] = '';
            }
          }
        });

        this.getTranslatedValue('Advantage Quotes', null).subscribe((res: string) => {
          if (res) {
            if (event.tabInfo.translated === res || event.tabInfo.title === res || event.tabInfo.title === 'Advantage Quotes') {
              if (this.storeData['otherParams']['otherVariables'])
                this.storeData['otherParams']['otherVariables']['currentTab'] = this.storeData['tabsTranslation'].advantage;
              if (this.storeData['refresh'].tabDlContract === true) {
                this.store.dispatch({
                  type: CallCenterActionTypes.BUILD_SPECIFIC_GRID, payload: ['DlContract']
                });
                this.storeData['refresh'].tabDlContract = false;
              }
            } else {
              if (this.storeData['otherParams']['otherVariables'])
                this.storeData['otherParams']['otherVariables']['currentTab'] = '';
            }
          }
        });
      }
    }
  }

  public promptSave(event: any): void {
    this.cmdEndCallOnClick({});
  }

  public showErrorModal(data: any): void {
    try {
      this.errorModal.show(data, true);
    } catch (err) {
      // statement
      console.log(err);
    }
  }

  public showMessageModal(data: any): void {
    this.messageModal.show(data, false);
  }

  private fetchTranslationContent(): void {
    this.getTranslatedValue('Contact Centre - Search', null).subscribe((res: string) => {
      if (res) {
        this.titleService.setTitle(res);
        this.pageTitle = res;
      } else {
        // this.titleService.setTitle('Contact Centre - Search');
      }
    });

    this.getTranslatedValue('All Types', null).subscribe((res: string) => {
      if (res) {
        this.registry.gcContractTypeDescs = res;
      } else {
        this.registry.gcContractTypeDescs = 'All Types';
      }
    });

    Observable.forkJoin(
      this.getTranslatedValue('Customer Search', null),
      this.getTranslatedValue('Logs', null),
      this.getTranslatedValue('Contracts/Jobs', null),
      this.getTranslatedValue('Dashboard', null),
      this.getTranslatedValue('Event History', null),
      this.getTranslatedValue('History', null),
      this.getTranslatedValue('Invoices', null),
      this.getTranslatedValue('Premises', null),
      this.getTranslatedValue('Work Orders', null),
      this.getTranslatedValue('Advantage Quotes', null)
    ).subscribe((data) => {
      this.storeData['tabsTranslation'].tabAccounts = data[0];
      this.storeData['tabsTranslation'].tabLogs = data[1];
      this.storeData['tabsTranslation'].tabContracts = data[2];
      this.storeData['tabsTranslation'].tabDashboard = data[3];
      this.storeData['tabsTranslation'].tabEventHistory = data[4];
      this.storeData['tabsTranslation'].tabHistory = data[5];
      this.storeData['tabsTranslation'].tabInvoices = data[6];
      this.storeData['tabsTranslation'].tabPremises = data[7];
      this.storeData['tabsTranslation'].tabWorkOrders = data[8];
      this.storeData['tabsTranslation'].advantage = data[9];
      this.tabsTranslation = this.storeData['tabsTranslation'];
      if (this.store) {
        this.store.dispatch({
          type: CallCenterActionTypes.TABS_TRANSLATION, payload: this.tabsTranslation
        });
      }
    });

    this.getTranslatedValue('You have a current Log Reference. Do you want to close this before proceeding?', null).subscribe((res: string) => {
      if (res) {
        this.promptTitle = res;
      }
    });
  }

}
