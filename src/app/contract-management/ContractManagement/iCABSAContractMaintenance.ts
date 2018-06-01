import { Component, NgZone, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef, Renderer } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';
import { Observable } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { GroupAccountNumberComponent } from '../../internal/search/iCABSSGroupAccountNumberSearch';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { MaintenanceTypeAComponent } from './contract-maintenance-tabs/maintenance-type-a';
import { MaintenanceTypeBComponent } from './contract-maintenance-tabs/maintenance-type-b';
import { MaintenanceTypeCComponent } from './contract-maintenance-tabs/maintenance-type-c';
import { MaintenanceTypeDComponent } from './contract-maintenance-tabs/maintenance-type-d';
import { MaintenanceTypeEComponent } from './contract-maintenance-tabs/maintenance-type-e';

import { GlobalizeService } from '../../../shared/services/globalize.service';
import { HttpService } from '../../../shared/services/http-service';
import { CBBService } from '../../../shared/services/cbb.service';
import { ErrorService } from '../../../shared/services/error.service';
import { AuthService } from '../../../shared/services/auth.service';
import { RiExchange } from '../../../shared/services/riExchange';
import { MessageService } from '../../../shared/services/message.service';
import { VariableService } from '../../../shared/services/variable.service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { SysCharConstants } from '../../../shared/constants/syscharservice.constant';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { ContractActionTypes } from '../../actions/contract';
import { Utils } from '../../../shared/services/utility';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { NavData } from '../../../shared/services/navigationData';
import { PageIdentifier } from '../../base/PageIdentifier';
import { InternalGridSearchServiceModuleRoutes, InternalGridSearchSalesModuleRoutes, InternalMaintenanceServiceModuleRoutes, InternalMaintenanceSalesModuleRoutes, ContractManagementModuleRoutes } from './../../base/PageRoutes';

@Component({
  selector: 'icabs-contract-maintenance',
  templateUrl: 'iCABSAContractMaintenance.html',
  providers: [ErrorService, MessageService],
  styles: [`

  .back-red {
    background-color: #EB2A1E;
    padding-bottom: 0.5em;
  }

  .back-green {
    background-color: #33FF33;
    padding-bottom: 0.5em;
  }

  .back-orange {
    background-color: #EBA31E;
    padding-bottom: 0.5em;
  }

  .tabs-cont {
    -webkit-transition: opacity 0.2s;
    transition: opacity 0.2s;
    opacity: 1;
    min-height: 400px;
  }
  .no-opacity {
    opacity: 0;
  }
  `]
})

export class ContractMaintenanceComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('topContainer') public container: ElementRef;
  @ViewChild('errorModal') public errorModal;
  @ViewChild('messageModal') public messageModal;
  @ViewChild('promptModal') public promptModal;
  @ViewChild('promptConfirmModal') public promptConfirmModal;
  @ViewChild('tabCont') public tabCont: ElementRef;

  public tabs: Array<any> = [
    { title: 'Address', active: true, hidden: false },
    { title: 'Invoice', disabled: false, hidden: false },
    { title: 'General', removable: false, hidden: false }
    /* { title: 'Discounts', customClass: '', hidden: false },
    { title: 'Customer Integration', customClass: '', hidden: false }*/
  ];

  public ajaxSource = new BehaviorSubject<any>(0);
  public ajaxSource$;
  public componentInteractionSubscription: Subscription;
  public ajaxSubscription: Subscription;
  public routerSubscription: Subscription;
  public storeSubscription: Subscription;
  public querySubscription: Subscription;
  public errorSubscription: Subscription;
  public messageSubscription: Subscription;
  public translateSubscription: Subscription;
  public contractFormGroup: FormGroup;
  public contractSearchComponent = ContractSearchComponent;
  public accountSearchComponent = AccountSearchComponent;
  public groupAccountSearchComponent = GroupAccountNumberComponent;
  public isNegBranchDropdownsDisabled: boolean = true;
  public negBranchNumberSelected: Object = {
    id: '',
    text: ''
  };
  public errorMessage: string;
  public isRequesting: boolean = false;
  public hideEllipsis: boolean = false;
  public autoOpen: any = '';
  public autoOpenSearch: boolean = false;
  public autoOpenAccount: boolean = false;
  public modalConfig: any = {
    backdrop: 'static',
    keyboard: true
  };

  public method: string = 'contract-management/maintenance';
  public module: string = 'contract';
  public operation: string = 'Application/iCABSAContractMaintenance';
  public contentType: string = 'application/x-www-form-urlencoded';
  public addNew: boolean = true;
  public commenceDateDisplay: string;
  public inactiveEffectDateDisplay: string;
  public getContractDetails: any = {
    method: 'contract-management/search',
    module: 'service-cover',
    operation: 'Application/iCABSAServiceCoverSearch'
  };

  public query: URLSearchParams = new URLSearchParams();
  public queryLookUp: URLSearchParams = new URLSearchParams();
  public querySysChar: URLSearchParams = new URLSearchParams();
  public queryContract: URLSearchParams = new URLSearchParams();
  public searchModalRoute: string = '';
  public searchPageRoute: string = '';
  public showHeader: boolean = true;
  public showCloseButton: boolean = true;
  public showErrorHeader: boolean = true;
  public showMessageHeader: boolean = true;
  public promptTitle: string = '';
  public promptConfirmTitle: string = '';
  public promptContent: string = '';
  public promptConfirmContent: string = '';

  public inputParams: any = {
    'parentMode': 'AddContractFromAccount',
    'pageTitle': 'Contract Entry',
    'pageHeader': 'Contract Maintenance',
    'currentContractType': 'C',
    'currentContractTypeURLParameter': '<contract>',
    'showAddNew': true
  };

  public contractSearchParams: any = {
    'parentMode': 'ContractSearch',
    'currentContractType': 'C',
    'currentContractTypeURLParameter': '<contract>',
    'showAddNew': true
  };
  public inputParamsAccount: any = {
    'parentMode': 'LookUp',
    'showAddNew': false,
    'showAddNewDisplay': false,
    'countryCode': '',
    'businessCode': '',
    'showCountryCode': false,
    'showBusinessCode': false,
    'searchValue': '',
    'triggerCBBChange': false,
    'groupAccountNumber': '',
    'groupName': ''
  };

  public inputParamsGroupAccount: any = {
    'parentMode': 'LookUp',
    'showAddNew': false,
    'countryCode': '',
    'businessCode': '',
    'showCountryCode': false,
    'showBusinessCode': false,
    'searchValue': ''
  };

  public queryParams: any = {
    action: '0',
    operation: 'Application/iCABSAAccountMaintenance',
    module: 'account',
    method: 'contract-management/maintenance',
    contentType: 'application/x-www-form-urlencoded',
    branchNumber: '',
    branchName: ''
  };

  public queryParamsContract: any = {
    action: '0',
    operation: 'Application/iCABSAContractMaintenance',
    module: 'contract',
    method: 'contract-management/maintenance',
    contentType: 'application/x-www-form-urlencoded',
    branchNumber: '',
    branchName: ''
  };

  public labelFields: Object = {
    contractNumber: 'Contract Number',
    lostBusinessDesc1: 'Lost Business Reason',
    lostBusinessDesc2: 'Lost Business Desc 2',
    lostBusinessDesc3: 'Lost Business Desc 3'
  };

  public tabsError: Object = {
    tabA: false,
    tabB: false,
    tabC: false,
    tabD: false,
    tabE: false
  };

  public tabsToCheck: Object = {
    tabA: true,
    tabB: true,
    tabC: true,
    tabD: false,
    tabE: false
  };

  public componentList: Array<any> = [MaintenanceTypeAComponent, MaintenanceTypeBComponent, MaintenanceTypeCComponent/*, MaintenanceTypeDComponent, MaintenanceTypeEComponent*/];
  public optionsList: Array<any> = [
    { title: '', list: ['Options'] },
    { title: 'Portfolio', list: ['Premises Details', 'Service Covers', 'Account Information', 'Telesales Order'] },
    { title: 'History', list: ['History', 'Event History'] },
    { title: 'Invoicing', list: ['Pro Rata Charge', 'Invoice Narrative', 'Invoice Charge', 'Invoice History'] },
    { title: 'Service', list: ['Product Summary', 'Static Visits (SOS)', 'Visit Summary', 'Service Recommendations', 'State of Service', 'Visit Tolerances', 'Infestation Tolerances', 'Waste Consignment Note History'] },
    { title: 'Customer Relations', list: ['Contact Management', 'Contact Centre Search', 'Customer Information', 'Prospect Conversion'] }
  ];
  public branchList: Array<any> = [];
  public contractCommenceDate: Date = void 0;
  public inactiveEffectDate: Date = void 0;

  public dateObjectsEnabled: Object = {
    contractCommenceDate: false,
    inactiveEffectDate: false
  };
  public dateObjectsValidate: Object = {
    contractCommenceDate: false,
    inactiveEffectDate: false
  };
  public clearDate: Object = {
    contractCommenceDate: false,
    inactiveEffectDate: false
  };
  public contractNameReadOnly: boolean = true;
  public options = 'Options';
  public updateMode: boolean = false;
  public addMode: boolean = false;
  public searchMode: boolean = true;
  public showControlBtn: boolean = true;

  public displayList: any = {
    'contractAnnualValue': false,
    'future': false,
    'pnol': false,
    'nationalAccount': false,
    'expired': false,
    'badDebtAccount': false,
    'badDebtAccountCheckbox': false,
    'trialPeriodInd': false,
    'anyPendingBelow': false,
    'inactiveEffectDate': false,
    'lostBusinessDesc1': false,
    'lostBusinessDesc2': false,
    'lostBusinessDesc3': false,
    'customerInformation': false,
    'copy': true,
    'moreThanOneContract': false,
    'groupAccount': true,
    'options': true

  };

  public fieldRequired: any = {
    'invoiceAnnivDate': true,
    'negBranchNumber': true,
    'contractNumber': true
  };

  public sysCharParams: Object = {
    vDisableFields: '',
    vSCEnableAutoNumber: '',
    vSCNationalAccountChecked: '',
    vSCEnableAddressLine3: '',
    vSCAddressLine3Logical: '',
    vSCEnableMaxAddress: '',
    vSCEnableMaxAddressValue: '',
    vSCEnableInvoiceFee: '',
    vSCEnableDefaultJobExpiry: '',
    vSCEnableCompanyCode: '',
    vSCEnableMinimumDuration: '',
    vSCEnableMarktSelect: '',
    vSCEnableHopewiserPAF: '',
    vSCEnableDatabasePAF: '',
    vSCAddressLine4Required: '',
    vSCAddressLine4Logical: '',
    vSCAddressLine5Required: '',
    vSCAddressLine5Logical: '',
    vSCPostCodeRequired: '',
    vSCPostCodeMustExistInPAF: '',
    vSCEnablePostcodeDefaulting: '',
    vSCRunPAFSearchOn1stAddressLine: '',
    vSCEnableLtdCompanyAndReg: '',
    vSCTaxRegNumber: '',
    vSCAccountDiscounts: '',
    vSCMonthsNotice: '',
    vSCEnableMonthsNotice: '',
    vSCEnableMonthsNoticeNotUsed: '',
    vSCEnableExternalReference: '',
    vSCEnableExternalRefNotUsed: '',
    vSCEnableBankDetailEntry: '',
    vSCEnableLegacyMandate: '',
    vSCEnableSubsequentDuration: '',
    vSCSubsequentDuration: '',
    vSCAutoCreateRenewalProspect: '',
    vDefaultCountryCode: '',
    vDefaultCompanyCode: '',
    vDefaultCompanyDesc: '',
    vSCEnableTaxCodeDefaultingText: '',
    vSCEnableTaxCodeDefaulting: '',
    vRequired: '',
    vSCMinimumDuration: '',
    glAllowUserAuthView: '',
    glAllowUserAuthUpdate: '',
    vSCEnableTrialPeriodServices: '',
    vSCEnableTaxRegistrationNumber2: '',
    vSCEnableGPSCoordinates: '',
    vSCHidePostcode: '',
    vSCEnableHPRLExempt: '',
    vSCDisplayContractOwner: '',
    vSCContractOwnerRequired: '',
    vSCMultiContactInd: '',
    vSCDisplayContractPaymentDueDay: '',
    vSCEnableSEPAFinanceMandate: '',
    vSCEnableSEPAFinanceMandateLog: '',
    vSCDisableDefaultCountryCode: '',
    vSCHideBankDetailsTab: '',
    vCompanyVATNumberLabel: '',
    vSCGroupAccount: '',
    vSCNoticePeriod: '',
    vSCNoticePeriodNotused: '',
    vSCCapitalFirstLtr: '',
    vSCVisitTolerances: '',
    vSCInfestationTolerance: '',
    vCIEnabled: '',
    vSCConnectContrPostcodeNegEmp: '',
    vEnablePostcodeDefaulting: '',
    vShowWasteConsignmentNoteHistory: '',
    vSCEnableValidatePostcodeSuburb: '',
    vSCEnablePostcodeSuburbLog: '',
    gcREGContactCentreReview: '',
    vSCEnablePayTypeAtInvGroupLevel: '',
    vSCEnableRenewals: '',
    vExcludedBranches: []
  };
  public otherParams: Object = {
    disableNameSearch: '',
    blnCIEnabled: '',
    vbEnablePayTypeAtInvGroupLevel: '',
    ReqAutoInvoiceFee: '',
    vbPaymentTypeCodeInd: '',
    vbCompanyCodeInd: '',
    SepaConfigInd: '',
    vDisableFields: '',
    lREGContactCentreReview: '',
    vTrialPeriodInd: '',
    vSaveUpdate: '',
    blnContractNameJustSet: false,
    currentBranchNumber: ''
  };
  public isAccountEllipsisDisabled: boolean = true;
  public isContractEllipsisDisabled: boolean = false;
  public isGroupAccountEllipsisDisabled: boolean = true;
  public isCommenceDateDisabled: boolean = true;
  public prospectNumber: string = '';
  public validateCounter: number = 0;
  public displayListClone: Object = {};
  public shiftTop: boolean = false;
  public tabsHide: boolean = false;
  public isCollapsibleOpen: boolean = false;
  public storeData: any = {};
  public contractNumberRegex: any;
  public parentMode: string = '';
  private sysCharObservable: any;
  private sysCharSubscription: any;
  private sysCharStorage: any;
  private currentRouteUrl: any;
  private currentRouteParams: any;
  private contractStoreData: any = {};
  private accountStoreData: any = {};
  private contractData: any;
  private premiseData: any;
  private productData: any;
  private isFormEnabled: boolean = false;
  private isCopyClicked: boolean = false;
  private formValidityCounter: number = 0;
  private beforeSave: boolean = false;
  private isNationalAccount: boolean = false;
  private isChild: boolean = false;
  private navigateToPremise: boolean = false;
  private accountFound: boolean = false;
  private dataEventCheckPostcodeNegBranch: Subject<any>;
  private dataEventCheckPostcode: Subject<any>;
  private dataEventWarnPostcode: Subject<any>;
  private dataEventCheckNatAcc: Subject<any>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private componentInteractionService: ComponentInteractionService,
    private zone: NgZone,
    private httpService: HttpService,
    private renderer: Renderer,
    private fb: FormBuilder,
    private serviceConstants: ServiceConstants,
    private errorService: ErrorService,
    private messageService: MessageService,
    private riExchange: RiExchange,
    private authService: AuthService,
    private ajaxconstant: AjaxObservableConstant,
    private titleService: Title,
    private SysCharConstants: SysCharConstants,
    private store: Store<any>,
    private translate: TranslateService,
    private localeTranslateService: LocaleTranslationService,
    private utils: Utils,
    private routeAwayGlobals: RouteAwayGlobals,
    private location: Location,
    private cbb: CBBService,
    private variableService: VariableService,
    private globalize: GlobalizeService
  ) {
    this.contractFormGroup = this.fb.group({
      ContractNumber: [{ value: '', disabled: false }, [Validators.required, Validators.pattern('^[0-9]+')]],
      ContractName: [{ value: '', disabled: true }, Validators.required],
      CurrentPremises: [{ value: '', disabled: true }],
      Copy: [{ value: 'Copy', disabled: true }],
      NegBranchNumber: [{ value: '', disabled: true }],
      BranchName: [{ value: '', disabled: true }],
      ContractAnnualValue: [{ value: '', disabled: true }],
      Future: [{ value: '', disabled: true }],
      ContractCommenceDate: [{ value: '', disabled: true }, Validators.required],
      Status: [{ value: '', disabled: true }],
      InactiveEffectDate: [{ value: '', disabled: true }],
      AnyPendingBelow: [{ value: '', disabled: true }],
      LostBusinessDesc: [{ value: '', disabled: true }],
      LostBusinessDesc2: [{ value: '', disabled: true }],
      LostBusinessDesc3: [{ value: '', disabled: true }],
      TrialPeriodInd: [{ value: '', disabled: true }],
      AccountNumber: [{ value: '', disabled: true }],
      AccountName: [{ value: '', disabled: true }],
      MoreThanOneContract: [{ value: '', disabled: true }],
      BadDebtAccount: [{ value: '', disabled: true }],
      GroupAccountNumber: [{ value: '', disabled: true }],
      GroupName: [{ value: '', disabled: true }],
      AccountBalance: [{ value: '', disabled: true }],
      ShowValueButton: [{ value: '', disabled: true }],
      NationalAccount: [{ value: '', disabled: true }],
      IsNationalAccount: [{ value: '', disabled: true }],
      NationalAccountchecked: [{ value: '', disabled: true }],
      DisableList: [{ value: '', disabled: true }],
      MandateRequired: [{ value: '', disabled: true }],
      ReqAutoNumber: [{ value: '', disabled: true }],
      PaymentTypeWarning: [{ value: '', disabled: true }],
      ProspectNumber: [{ value: '', disabled: true }],
      ErrorMessageDesc: [{ value: '', disabled: true }],
      CustomerInfoAvailable: [{ value: '', disabled: true }],
      ContractHasExpired: [{ value: '', disabled: true }],
      RunningReadOnly: [{ value: '', disabled: true }],
      CallLogID: [{ value: '', disabled: true }],
      CurrentCallLogID: [{ value: '', disabled: true }],
      WindowClosingName: [{ value: '', disabled: true }],
      ClosedWithChanges: [{ value: '', disabled: true }],
      PNOL: [{ value: '', disabled: true }],
      CICustRefReq: [{ value: '', disabled: true }],
      CIRWOReq: [{ value: '', disabled: true }],
      CICFWOReq: [{ value: '', disabled: true }],
      CICFWOSep: [{ value: '', disabled: true }],
      OrigCICustRefReq: [{ value: '', disabled: true }],
      OrigCIRWOReq: [{ value: '', disabled: true }],
      OrigCICFWOReq: [{ value: '', disabled: true }],
      OrigCICFWOSep: [{ value: '', disabled: true }],
      OrigCICResponseSLA: [{ value: '', disabled: true }],
      OrigCIFirstSLAEscDays: [{ value: '', disabled: true }],
      OrigCISubSLAEscDays: [{ value: '', disabled: true }]
    });
    this.ajaxSource$ = this.ajaxSource.asObservable();
    this.storeSubscription = store.select('contract').subscribe(data => {
      this.storeData = data;
      if (data && data['action']) {
        switch (data['action']) {
          case ContractActionTypes.SAVE_DATA:
            if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
              this.contractStoreData = data['data'];
              this.setFormData(data);
            }
            break;
          case ContractActionTypes.SAVE_ACCOUNT:
            if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
              this.contractStoreData = data['data'];
              this.setFormData(data);
            }
            break;
          case ContractActionTypes.SAVE_MODE:
            if (data['mode'] && !(Object.keys(data['mode']).length === 0 && data['mode'].constructor === Object)) {
              this.addMode = data['mode'].addMode;
              this.updateMode = data['mode'].updateMode;
              this.searchMode = data['mode'].searchMode;
              this.processForm();
            }
            break;
          case ContractActionTypes.SAVE_SYSCHAR:
            if (data['syschars']) {
              this.sysCharParams = data['syschars'];
              this.processSysChar();
            }
            break;
          case ContractActionTypes.INITIALIZATION:
            if (data && data['initialization']) {
              if (!data['initialization'].initialLoadComplete && data['initialization'].typeA && data['initialization'].typeB && data['initialization'].typeC) {
                setTimeout(() => {
                  this.postInitialization();
                }, 0);
                setTimeout(() => {
                  this.store.dispatch({
                    type: ContractActionTypes.INITIALIZATION, payload: {
                      initialLoadComplete: true
                    }
                  });
                }, 100);
              }
            }
            break;
          case ContractActionTypes.FORM_VALIDITY:
            if (data && data['formValidity']) {
              this.tabsError = {
                tabA: !data['formValidity'].typeA,
                tabB: !data['formValidity'].typeB,
                tabC: !data['formValidity'].typeC,
                tabD: !data['formValidity'].typeD,
                tabE: !data['formValidity'].typeE
              };
              this.formValidityCounter++;
              if (this.tabsToCheck['typeD'] === true && this.tabsToCheck['typeE'] === true) {
                if (this.formValidityCounter >= 6 && data['formValidity'].main && data['formValidity'].typeA && data['formValidity'].typeB && data['formValidity'].typeC && data['formValidity'].typeD && data['formValidity'].typeE) {
                  this.formValidityCounter = 0;
                  if (this.updateMode) {
                    this.riMaintenanceBeforeSaveUpdate();
                  } else if (this.addMode) {
                    this.riMaintenanceBeforeSaveAdd();
                  }
                } else {
                  window.scrollTo(0, 0);
                }
              }
              else if (this.tabsToCheck['typeD'] === true && this.tabsToCheck['typeE'] === false) {
                if (this.formValidityCounter >= 5 && data['formValidity'].main && data['formValidity'].typeA && data['formValidity'].typeB && data['formValidity'].typeC && data['formValidity'].typeD) {
                  this.formValidityCounter = 0;
                  if (this.updateMode) {
                    this.riMaintenanceBeforeSaveUpdate();
                  } else if (this.addMode) {
                    this.riMaintenanceBeforeSaveAdd();
                  }
                } else {
                  window.scrollTo(0, 0);
                }
              }
              else if (this.tabsToCheck['typeD'] === false && this.tabsToCheck['typeE'] === true) {
                this.tabsError['typeD'] = this.tabsError['typeE'];
                if (this.formValidityCounter >= 5 && data['formValidity'].main && data['formValidity'].typeA && data['formValidity'].typeB && data['formValidity'].typeC && data['formValidity'].typeE) {
                  this.formValidityCounter = 0;
                  if (this.updateMode) {
                    this.riMaintenanceBeforeSaveUpdate();
                  } else if (this.addMode) {
                    this.riMaintenanceBeforeSaveAdd();
                  }
                } else {
                  window.scrollTo(0, 0);
                }
              } else {
                if (this.formValidityCounter >= 4 && data['formValidity'].main && data['formValidity'].typeA && data['formValidity'].typeB && data['formValidity'].typeC) {
                  this.formValidityCounter = 0;
                  if (this.updateMode) {
                    this.riMaintenanceBeforeSaveUpdate();
                  } else if (this.addMode) {
                    this.riMaintenanceBeforeSaveAdd();
                  }
                } else {
                  window.scrollTo(0, 0);
                }
              }

            }
            break;
          default:
            break;
        }
      }

    });

    this.routerSubscription = this.router.events.subscribe(event => {
      this.store.dispatch({
        type: ContractActionTypes.INITIALIZATION, payload: {
          initialLoadComplete: false,
          typeA: false,
          typeB: false,
          typeC: false
        }
      });
      this.currentRouteUrl = event.url;
      this.setContractType(event.url);
    });

    this.querySubscription = this.route.queryParams.subscribe(params => {
      if (params && !(Object.keys(params).length === 0 && params.constructor === Object)) {
        if (params['parentMode']) {
          this.store.dispatch({ type: ContractActionTypes.CLEAR_ALL });
        } else {
          let storeData = this.variableService.getContractStoreData();
          if (storeData && !(Object.keys(storeData).length === 0 && storeData.constructor === Object) && !this.variableService.getMenuClick()) {
            this.storeData['data'] = storeData['data'];
          } else {
            this.storeData['data'] = {};
          }
          this.variableService.setContractStoreData({});
        }
      }
      this.currentRouteParams = params;
      if (this.currentRouteParams && (this.currentRouteParams.CurrentContractType || this.currentRouteParams.currentContractType || this.currentRouteParams.CurrentContractTypeURLParameter)) {
        this.checkQueryParams();
      }
    });
  }

  ngOnInit(): void {
    this.localeTranslateService.setUpTranslation();
    this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
      if (event !== 0) {
        setTimeout(() => {
          this.fetchTranslationContent();
        }, 0);
      }
    });
  }

  ngAfterViewInit(): void {
    this.setTabAttribute();
  }

  ngOnDestroy(): void {
    if (this.storeData['sentFromParent'] && !(Object.keys(this.storeData['sentFromParent']).length === 0 && this.storeData['sentFromParent'].constructor === Object)) {
      if (!this.storeData['sentFromParent'].parentMode) {
        this.variableService.setContractStoreData(this.storeData);
      }
    }
    if (this.componentInteractionSubscription)
      this.componentInteractionSubscription.unsubscribe();
    if (this.errorSubscription)
      this.errorSubscription.unsubscribe();
    if (this.messageSubscription)
      this.messageSubscription.unsubscribe();
    if (this.ajaxSubscription)
      this.ajaxSubscription.unsubscribe();
    if (this.routerSubscription)
      this.routerSubscription.unsubscribe();
    if (this.storeSubscription)
      this.storeSubscription.unsubscribe();
    if (this.querySubscription)
      this.querySubscription.unsubscribe();
    if (this.translateSubscription)
      this.translateSubscription.unsubscribe();
    if (this.sysCharObservable)
      this.sysCharObservable.unsubscribe();
    this.routeAwayGlobals.resetRouteAwayFlags();
  }

  private checkQueryParams(): void {
    if (this.currentRouteParams && (this.currentRouteParams.CurrentContractType || this.currentRouteParams.currentContractType)) {
      switch (this.currentRouteParams.CurrentContractType || this.currentRouteParams.currentContractType) {
        case 'C':
          this.setPageParams('C');
          break;
        case 'P':
          this.setPageParams('P');
          break;
        case 'J':
          this.setPageParams('J');
          break;
      }
    } else {
      if (this.currentRouteParams['CurrentContractTypeURLParameter']) {
        this.setPageParams(this.utils.getCurrentContractType(this.currentRouteParams['CurrentContractTypeURLParameter']));
      }
    }
  }

  private setContractType(val: string, onlyContractType?: boolean): void {
    switch (val) {
      case '/contractmanagement/maintenance/contract':
        if (!(this.storeData && this.storeData['data'] && !(Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object))) {
          this.autoOpenSearch = true;
        }
        this.setPageParams('C', onlyContractType);
        break;
      case '/contractmanagement/maintenance/product':
        if (!(this.storeData && this.storeData['data'] && !(Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object))) {
          this.autoOpenSearch = true;
        }
        this.setPageParams('P', onlyContractType);
        break;
      case '/contractmanagement/maintenance/job':
        if (!(this.storeData && this.storeData['data'] && !(Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object))) {
          this.autoOpenSearch = true;
        }
        this.setPageParams('J', onlyContractType);
        break;
      default:
        if (val.indexOf('/maintenance/contract') !== -1) {
          this.setPageParams('C', onlyContractType);
        } else if (val.indexOf('/maintenance/job') !== -1) {
          this.setPageParams('J', onlyContractType);
        } else if (val.indexOf('/maintenance/product') !== -1) {
          this.setPageParams('P', onlyContractType);
        }
        break;
    }
  }

  private postInitialization(): void {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
    this.querySubscription = this.route.queryParams.subscribe(params => {
      this.currentRouteParams = params;
      switch (params['parentMode']) {
        case 'AddContractFromAccount':
          this.inputParams.currentContractType = 'C';
          this.inputParams.currentContractTypeURLParameter = '<contract>';
          break;
        case 'AddJobFromAccount':
          this.inputParams.currentContractType = 'J';
          this.inputParams.currentContractTypeURLParameter = '<job>';
          break;
        case 'AddProductFromAccount':
          this.inputParams.currentContractType = 'P';
          this.inputParams.currentContractTypeURLParameter = '<product>';
          break;
        case 'PipelineGrid':
          this.inputParams.parentMode = 'PipelineGrid';

          break;
        case 'ProspectPremises':
          this.inputParams.parentMode = 'ProspectPremises';

          break;
        default:
      }
      if (this.currentRouteParams && (this.currentRouteParams.CurrentContractType || this.currentRouteParams.currentContractType || this.currentRouteParams.CurrentContractTypeURLParameter)) {
        this.checkQueryParams();
      }
      switch (this.inputParams.currentContractType) {
        case 'C':
          this.inputParams.pageTitle = 'Contract Entry';
          this.inputParams.pageHeader = 'Contract Maintenance';
          break;
        case 'P':
          this.inputParams.pageTitle = 'Product Sale Entry';
          this.inputParams.pageHeader = 'Product Sale Maintenance';
          break;
        case 'J':
          this.inputParams.pageTitle = 'Job Entry';
          this.inputParams.pageHeader = 'Job Maintenance';
          break;
      }
      this.storeData['sentFromParent'] = {};
      for (let x in params) {
        if (params.hasOwnProperty(x))
          this.storeData['sentFromParent'][x] = params[x];
      }
      this.store.dispatch({ type: ContractActionTypes.SAVE_PARAMS, payload: this.inputParams });
    });

    String.prototype['capitalizeFirstLetter'] = function (): any {
      return this.replace(/\w\S*/g, (txt: string) => { return txt.charAt(0).toUpperCase() + txt.substr(1); });
    };
    this.displayList.anyPendingBelow = false;
    this.displayList.lostBusinessDesc1 = false;
    this.displayList.lostBusinessDesc2 = false;
    this.displayList.lostBusinessDesc3 = false;
    this.displayList.anyPendingBelow = false;
    this.displayList.moreThanOneContract = false;
    this.displayList.inactiveEffectDate = false;
    this.displayList.customerInformation = false;
    this.displayList.trialPeriodInd = false;
    this.displayList.contractAnnualValue = false;
    this.displayList.future = false;
    this.storeData['code'].country = this.utils.getCountryCode();
    this.storeData['code'].business = this.utils.getBusinessCode();
    this.promptConfirmTitle = MessageConstant.Message.ConfirmRecord;
    this.store.dispatch({
      type: ContractActionTypes.FORM_GROUP, payload: {
        main: this.contractFormGroup
      }
    });
    this.contractSearchComponent = ContractSearchComponent;
    this.accountSearchComponent = AccountSearchComponent;
    this.titleService.setTitle(this.inputParams.pageTitle);
    this.displayListClone = JSON.parse(JSON.stringify(this.displayList));
    if (this.storeData && this.storeData['data'] && !(Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object)) {
      if (this.storeData['sentFromParent'] && this.storeData['sentFromParent']['isChild'] === true) {
        this.checkParentModeFromData(this.storeData);
      } else {
        this.contractStoreData = this.storeData['data'];
        this.setFormData(this.storeData);
        this.searchMode = false;
        this.updateMode = true;
        this.addMode = false;
        this.autoOpen = false;
        this.onContractNumberBlur({}, {
          addMode: this.addMode,
          updateMode: this.updateMode,
          searchMode: this.searchMode
        });
      }
    } else {
      this.checkParentModeFromData(this.storeData);
    }
    if ((this.autoOpen === true)) {
      this.autoOpenSearch = true;
    }
    this.errorService.emitError(0);
    this.errorSubscription = this.errorService.getObservableSource().subscribe(data => {
      if (data !== 0) {
        this.zone.run(() => {
          if (data.errorMessage || data.fullError) {
            if (data.fullError) {
              if (data.errorMessage instanceof Array) {
                //data.errorMessage.push(data.fullError);
              } else {
                //data.errorMessage = data.errorMessage;
                if (data.errorMessage === '') {
                  data.errorMessage = data.errorMessage + ' ' + data.fullError;
                }
              }
            }
            this.errorModal.show(data, true);
          } else {
            this.errorModal.show(data, false);
          }

        });
      }
    });
    this.messageService.emitComponentMessage(0);
    this.messageSubscription = this.messageService.getComponentObservableSource().subscribe(data => {
      if (data !== 0) {
        if (data && data.addMode) {
          if (this.updateMode === true) {
            this.store.dispatch({
              type: ContractActionTypes.SAVE_MODE, payload:
              {
                updateMode: false,
                addMode: false,
                searchMode: true
              }
            });
            this.processForm();
          }
          this.store.dispatch({
            type: ContractActionTypes.CLEAR_DATA, payload: {}
          });
          this.tabsError = {
            tabA: false,
            tabB: false,
            tabC: false,
            tabD: false,
            tabE: false
          };
          this.setDefaultFormState();
          this.contractStoreData = null;
          this.triggerFetchSysChar(data, false);
        }
      }
    });

    this.store.dispatch({
      type: ContractActionTypes.SAVE_SERVICE, payload: {
        localeTranslateService: this.localeTranslateService,
        translate: this.translate,
        errorService: this.errorService
      }
    });
    this.ajaxSubscription = this.ajaxSource$.subscribe(event => {
      if (event !== 0) {
        this.zone.run(() => {
          switch (event) {
            case this.ajaxconstant.START:
              this.isRequesting = true;
              break;
            case this.ajaxconstant.COMPLETE:
              this.isRequesting = false;
              break;
          }
        });
      }
    });
  }

  public setPageParams(type: string, onlyContractType?: boolean): void {
    switch (type) {
      case 'C':
        if (onlyContractType === true) {
          this.inputParams.currentContractType = 'C';
          this.inputParams.currentContractTypeURLParameter = 'contract';
          this.contractSearchParams.currentContractType = 'C';
          return;
        }
        this.inputParams.parentMode = 'Contract';
        this.inputParams.pageTitle = 'Contract Entry';
        this.inputParams.pageHeader = 'Contract Maintenance';
        this.labelFields['contractNumber'] = 'Contract Number';
        this.inputParams.currentContractType = 'C';
        this.inputParams.currentContractTypeURLParameter = 'contract';
        this.contractSearchParams.currentContractType = 'C';
        break;
      case 'J':
        if (onlyContractType === true) {
          this.inputParams.currentContractType = 'J';
          this.inputParams.currentContractTypeURLParameter = 'job';
          this.contractSearchParams.currentContractType = 'J';
          return;
        }
        this.inputParams.parentMode = 'Job';
        this.inputParams.pageTitle = 'Job Entry';
        this.inputParams.pageHeader = 'Job Maintenance';
        this.labelFields['contractNumber'] = 'Job Number';
        this.inputParams.currentContractType = 'J';
        this.inputParams.currentContractTypeURLParameter = 'job';
        this.contractSearchParams.currentContractType = 'J';
        break;
      case 'P':
        if (onlyContractType === true) {
          this.inputParams.currentContractType = 'P';
          this.inputParams.currentContractTypeURLParameter = 'product';
          this.contractSearchParams.currentContractType = 'P';
          return;
        }
        this.inputParams.parentMode = 'Product';
        this.inputParams.pageTitle = 'Product Sale Entry';
        this.inputParams.pageHeader = 'Product Sale Maintenance';
        this.labelFields['contractNumber'] = 'Product Sale Number';
        this.inputParams.currentContractType = 'P';
        this.inputParams.currentContractTypeURLParameter = 'product';
        this.contractSearchParams.currentContractType = 'P';
        break;
      default:
        break;
    }
  }

  public checkParentModeFromData(data: any): void {
    if (data['sentFromParent']) {
      if (data['sentFromParent'].parentMode) {
        this.isChild = true;
        data['sentFromParent']['isChild'] = true;
      } else {
        this.isChild = false;
        data['sentFromParent']['isChild'] = false;
      }
      this.store.dispatch({ type: ContractActionTypes.SAVE_SENT_FROM_PARENT, payload: data['sentFromParent'] });
      if (data && data['sentFromParent'].parentMode) {
        this.parentMode = data['sentFromParent'].parentMode;
      }
      switch (data && data['sentFromParent'].parentMode) {
        case 'SearchAdd':
        case 'Account':
        case 'AddContractFromAccount':
        case 'AddJobFromAccount':
        case 'AddProductFromAccount':
        case 'AddFromProspect':
          this.triggerAddModeFromAccount();
          break;

        case 'ServiceCover':
          this.triggerUpdateMode();
          break;
        case 'Search':
          this.triggerUpdateMode();
          break;
        case 'Premise':
          this.triggerUpdateMode();
          break;
        case 'WorkOrderMaintenance':
        case 'WorkOrderMaintenanceTask':
          this.triggerUpdateMode();
          break;
        case 'ServiceVisitWorkIndex':
          this.triggerSearchMode();
          break;
        case 'ProspectPremises':
          this.triggerSearchMode();
          break;
        case 'LostBusinessRequestsOutcomeBusiness':
          this.triggerSearchMode();
          break;
        case 'Portfolio General Maintenance':
        case 'pgm':
          this.triggerSearchMode();
          break;
        case 'LoadByKeyFields':
          this.triggerUpdateMode();
          break;
        case 'Request':
          this.triggerSearchMode();
          this.showControlBtn = false;
          this.autoOpen = false;
          break;
        default:
        //this.isAccountEllipsisDisabled = false;

      }
      switch (data['sentFromParent'].parentMode) {
        case 'ContractExpiryGrid':
        case 'Portfolio':
        case 'DailyTransactions':
        case 'ContractPOExpiryGrid':
        case 'PDAReconciliation':
        case 'RepeatSales':
          this.triggerSearchMode();
          break;
        case 'Release':
        case 'ProRataCharge':
        case 'ServiceVisitEntryGrid':
        case 'FlatRateIncrease':
        case 'ServiceValueEntryGrid':
        case 'Accept':
        case 'PremiseMatch':
          this.triggerUpdateMode();
          break;

        case 'SalesCallExtractDetail':

          break;
        case 'RenewalExtractContract':
        case 'CancelledVisit':
        case 'VisitRejection':
        case 'TechServiceVisit':
        case 'SuspendServiceandInvoice':
        case 'DOWSentricon':
          this.triggerUpdateMode();
          break;
        case 'Bonus':
          this.triggerUpdateMode();
          break;
        case 'LostBusinessAnalysis':
        case 'InvoiceReleased':
        case 'StaticVisit':
        case 'PortfolioReports':
        case 'ServiceVisitWorkIndex':
        case 'Inter-CompanyPortfolio':
        case 'RetainedServiceCovers':
        case 'TechWorkSummary':
        case 'ClientRetention':
        case 'ComReqPlan':
        case 'CustomerCCOReport':
          this.triggerUpdateMode();
          break;
        case 'Entitlement':
          this.triggerUpdateMode();
          break;
        case 'ServicePlanning':
        case 'ExchangesDue':
        case 'InstallationsCommence':
        case 'TimeVerification':
          this.triggerUpdateMode();
          break;
        case 'InvoiceDetail':
          this.triggerUpdateMode();
          break;
        case 'ContactMedium':
          this.triggerUpdateMode();
          break;
        case 'DespatchGrid':
          this.triggerUpdateMode();
          break;
        case 'ScheduleSearch':
          this.triggerUpdateMode();
          break;
        default:
        //this.triggerUpdateMode();
      }

      switch (data['sentFromParent'].parentMode) {
        case 'ContractExpiryGrid':
        case 'DailyTransactions':
        case 'BusinessDailyTransactions':
        case 'ContractPOExpiryGrid':
          this.showControlBtn = false;
          this.inputParams.showAddNew = false;
          this.autoOpen = false;
          break;

        case 'AddFromProspect':

          break;

        case 'AddContractFromAccount':
        case 'AddJobFromAccount':
        case 'AddProductFromAccount':
          //this.contractFormGroup.controls['AccountNumber'].setValue(data['sentFromParent'].AccountNumber);
          //this.onAccountBlur({});
          break;
        case 'Prospect':
          this.triggerSearchMode();
          break;
        case 'PipelineGrid':
          this.triggerSearchMode();
          break;
        case 'ProspectPremises':
          this.showControlBtn = false;
          this.inputParams.showAddNew = false;
          break;

        case 'CallCentreSearch':
          this.triggerUpdateMode();
          this.disableAddInSearch();
          break;

        case 'GeneralSearch':
        case 'GeneralSearch-Con':
          this.triggerUpdateMode();
          break;

        case 'GeneralSearchProduct':
          this.triggerUpdateMode();
          break;

        case 'StockUsageSearch':
        case 'TreatmentcardRecall':
          this.triggerUpdateMode();
          break;

        case 'NatAccContracts':
          this.triggerUpdateMode();
          break;

        case 'InvoiceHistory':
          this.triggerUpdateMode();
          break;
      }
      if (this.autoOpen === '') {
        this.autoOpen = true;
      }
    }
  }

  public disableAddInSearch(): void {
    if (this.parentMode === 'CallCentreSearch') {
      this.inputParams.showAddNew = false;
      this.contractSearchParams['showAddNew'] = false;
    }
  }

  public triggerSearchMode(): void {
    this.contractFormGroup.controls['ContractNumber'].setValue(this.storeData['sentFromParent'].ContractNumber);
    this.contractFormGroup.controls['ContractNumber'].disable();
    this.isContractEllipsisDisabled = true;
    this.autoOpen = false;
    this.onContractNumberBlur({}, {
      addMode: false,
      updateMode: false,
      searchMode: true
    });
  }

  public triggerUpdateMode(): void {
    if (this.storeData['sentFromParent'].ContractNumber) {
      this.contractFormGroup.controls['ContractNumber'].setValue(this.storeData['sentFromParent'].ContractNumber);
    }
    this.isContractEllipsisDisabled = false;
    this.autoOpen = false;
    this.onContractNumberBlur({}, {
      addMode: false,
      updateMode: true,
      searchMode: false
    });
  }

  public triggerAddModeFromAccount(): void {
    this.isContractEllipsisDisabled = true;
    this.autoOpen = false;
    this.triggerFetchSysChar(
      {
        updateMode: false,
        addMode: true,
        searchMode: false
      }, false, () => {
        this.contractFormGroup.controls['AccountNumber'].setValue(this.storeData['sentFromParent'].AccountNumber || this.storeData['sentFromParent'].accountNumber);
        this.onAccountBlur({});
      });
  }

  public fetchTranslationContent(): void {
    Observable.forkJoin(
      this.getTranslatedValue('Copy', null),
      this.getTranslatedValue('Future Change', null),
      this.getTranslatedValue(this.inputParams.pageTitle.toString(), null),
      this.getTranslatedValue(this.inputParams.pageHeader, null),
      this.getTranslatedValue(this.labelFields['lostBusinessDesc1'], null),
      this.getTranslatedValue(this.labelFields['lostBusinessDesc2'], null),
      this.getTranslatedValue(this.labelFields['lostBusinessDesc3'], null),
      this.getTranslatedValue('Contact Details', null)
    ).subscribe((data) => {
      if (data[0]) {
        this.contractFormGroup.controls['Copy'].setValue(data[0]);
      }
      if (data[1]) {
        this.contractFormGroup.controls['Future'].setValue(data[1]);
      }
      if (data[2]) {
        this.titleService.setTitle(data[2].toString());
      } else {
        this.titleService.setTitle(this.inputParams.pageTitle.toString());
      }
      if (data[3]) {
        this.inputParams.pageHeader = data[3];
      }
      if (data[4]) {
        this.labelFields['lostBusinessDesc1'] = data[4];
      }
      if (data[5]) {
        this.labelFields['lostBusinessDesc2'] = data[5];
      }
      if (data[6]) {
        this.labelFields['lostBusinessDesc3'] = data[6];
      }
      if (data[7]) {
        if (this.storeData['formGroup'].typeA) {
          this.storeData['formGroup'].typeA.controls['BtnAmendContact'].setValue(data[7]);
        }
      }
    });
  }

  public getTranslatedValue(key: any, params: any): any {
    if (params) {
      return this.translate.get(key, { value: params });
    } else {
      return this.translate.get(key);
    }

  }

  public fetchBranchDetails(addMode: boolean, returnSubscription: boolean): any {
    this.queryParams.branchNumber = this.cbb.getBranchCode();
    this.otherParams['currentBranchNumber'] = this.cbb.getBranchCode();
    let userCode = this.authService.getSavedUserCode();
    let data = [{
      'table': 'Branch',
      'query': { 'BusinessCode': this.storeData['code'].business },
      'fields': ['BranchNumber', 'BranchName', 'EnablePostCodeDefaulting']
    },
    {
      'table': 'UserAuthorityBranch',
      'query': { 'UserCode': userCode.UserCode, 'BusinessCode': this.storeData['code'].business },
      'fields': ['BranchNumber', 'DefaultBranchInd', 'CurrentBranchInd']
    }];
    if (returnSubscription) {
      return this.lookUpRecord(data, 100);
    }
    this.lookUpRecord(data, 100).subscribe(
      (e) => {
        if (e['results'] && e['results'].length > 0) {
          if (e['results'][1].length > 0) {
            if (!this.queryParams.branchNumber) {
              for (let i = 0; i < e['results'][1].length; i++) {
                if (e['results'][1][i].DefaultBranchInd) {
                  this.queryParams.branchNumber = e['results'][1][i].BranchNumber;
                  this.otherParams['currentBranchNumber'] = e['results'][1][i].BranchNumber;
                }
              }
            }

            if (e['results'][0].length > 0) {
              for (let k = 0; k < e['results'][0].length; k++) {
                this.branchList.push(JSON.parse(JSON.stringify({
                  branchNumber: e['results'][0][k].BranchNumber,
                  branchName: e['results'][0][k].BranchName
                })));
                if (!e['results'][0][k].EnablePostCodeDefaulting) {
                  this.sysCharParams['vExcludedBranches'].push(e['results'][0][k].BranchNumber);
                }
                if (e['results'][0][k].BranchNumber === this.queryParams.branchNumber) {
                  this.queryParams.branchName = e['results'][0][k].BranchName;
                }
              }
            }
            // Set default data
            if (addMode) {
              this.contractFormGroup.controls['NegBranchNumber'].setValue(this.queryParams.branchNumber);
              this.contractFormGroup.controls['BranchName'].setValue(this.queryParams.branchName);
              this.negBranchNumberSelected = {
                id: '',
                text: this.queryParams.branchNumber + ' - ' + this.queryParams.branchName
              };
            }

          }
        }

      },
      (error) => {
        // error statement
      }
    );
  }

  public fetchCompanyDetails(addMode: boolean): Observable<any> {
    let userCode = this.authService.getSavedUserCode();
    let data = [{
      'table': 'Company',
      'query': { 'BusinessCode': this.storeData['code'].business, 'UserCode': userCode.UserCode },
      'fields': ['DefaultCompanyInd', 'CompanyCode', 'CompanyDesc']
    }];
    return this.lookUpRecord(data, 5);
  }

  public fetchUserAuthority(): void {
    let userCode = this.authService.getSavedUserCode();
    let data = [{
      'table': 'UserAuthority',
      'query': { 'BusinessCode': this.storeData['code'].business, 'UserCode': userCode.UserCode },
      'fields': ['BusinessCode', 'AllowViewOfSensitiveInfoInd', 'UserCode', 'AllowUpdateOfContractInfoInd']
    }];
    this.lookUpRecord(data, 5).subscribe(
      (e) => {
        if (e['results'] && e['results'].length > 0) {
          if (e['results'][0].length > 0) {
            this.sysCharParams['glAllowUserAuthView'] = e['results'][0][0].AllowViewOfSensitiveInfoInd;
            this.sysCharParams['glAllowUserAuthUpdate'] = e['results'][0][0].AllowUpdateOfContractInfoInd;
            if (!this.sysCharParams['glAllowUserAuthUpdate']) {
              this.displayList.options = false;
              this.displayList.contractAnnualValue = false;
            }
          }
        }
      },
      (error) => {
        // error statement
      }
    );
  }

  public fetchCIParams(): void {
    let data = [{
      'table': 'CIParams',
      'query': { 'BusinessCode': this.storeData['code'].business },
      'fields': ['BusinessCode', 'CIEnabled']
    }];
    this.lookUpRecord(JSON.parse(JSON.stringify(data)), 5).subscribe(
      (e) => {
        if (e['results'] && e['results'].length > 0) {
          if (e['results'][0].length > 0) {
            let tabs, componentList;
            tabs = [
              { title: 'Address', active: true },
              { title: 'Invoice', disabled: false },
              { title: 'General', removable: false }
            ];
            componentList = [MaintenanceTypeAComponent, MaintenanceTypeBComponent, MaintenanceTypeCComponent];
            this.otherParams['blnCIEnabled'] = e['results'][0][0].CIEnabled;
            if (this.sysCharParams['vSCAccountDiscounts'] === true) {
              tabs.push({ title: 'Discounts', customClass: '' });
              componentList.push(MaintenanceTypeDComponent);
            }
            if (this.otherParams['blnCIEnabled'] === true) {
              tabs.push({ title: 'Customer Integration', customClass: '' });
              componentList.push(MaintenanceTypeEComponent);
            }
            this.tabsHide = true;
            setTimeout(() => {
              this.tabsHide = false;
            }, 400);
            if (tabs.length !== this.tabs.length || (tabs.length === this.tabs.length && tabs.length === 4 && tabs[3].title !== this.tabs[3].title)) {
              this.zone.run(() => {
                this.tabs = tabs;
                this.componentList = componentList;
              });
            }
          }
        }
      },
      (error) => {
        // error statement
      }
    );
  }

  public sysCharParameters(): string {
    let sysCharList = [
      this.SysCharConstants.SystemCharMaximumAddressLength,
      this.SysCharConstants.SystemCharEnableAutoGenerationOfContractNumbers,
      this.SysCharConstants.SystemCharEnableNationalAccountWarning,
      this.SysCharConstants.SystemCharEnableAddressLine3,
      this.SysCharConstants.SystemCharEnableInvoiceFee,
      this.SysCharConstants.SystemCharEnableDefaultOfJobExpiry,
      this.SysCharConstants.SystemCharEnableMinimumDuration,
      this.SysCharConstants.SystemCharEnableCompanyCode,
      this.SysCharConstants.SystemCharEnableMarktSelect,
      this.SysCharConstants.SystemCharEnableHopewiserPAF,
      this.SysCharConstants.SystemCharEnableDatabasePAF,
      this.SysCharConstants.SystemCharAddressLine4Required,
      this.SysCharConstants.SystemCharAddressLine5Required,
      this.SysCharConstants.SystemCharPostCodeRequired,
      this.SysCharConstants.SystemCharPostCodeMustExistinPAF,
      this.SysCharConstants.SystemCharEnablePostcodeDefaulting,
      this.SysCharConstants.SystemCharRunPAFSearchOnFirstAddressLine,
      this.SysCharConstants.SystemCharEnableLtdCompanyAndRegistrationNumber,
      this.SysCharConstants.SystemCharMandatoryTaxRegistrationNumber,
      this.SysCharConstants.SystemCharEnableAccountDiscounts,
      this.SysCharConstants.SystemCharDaysFromRequestToTermOrDel,
      this.SysCharConstants.SystemCharEnableExternalReferenceInContractMaint,
      this.SysCharConstants.SystemCharEnableBankDetailEntry,
      this.SysCharConstants.SystemCharSubsequentDurationPeriod,
      this.SysCharConstants.SystemCharAutoCreateProspectRenewalDays,
      this.SysCharConstants.SystemCharEnableContractTaxRegistrationNumber2,
      this.SysCharConstants.SystemCharDefaultTaxCodeOnServiceCoverMaint,
      this.SysCharConstants.SystemCharEnableMinimumDuration,
      this.SysCharConstants.SystemCharEnableTrialPeriodServices,
      this.SysCharConstants.SystemCharEnableGPSCoordinates,
      this.SysCharConstants.SystemCharHidePostcode,
      this.SysCharConstants.SystemCharEnableHazardousPesticideLevy,
      this.SysCharConstants.SystemCharContractOwner,
      this.SysCharConstants.SystemCharDisplayContractPaymentDueDay,
      this.SysCharConstants.SystemCharEnableSEPAFinanceMandate,
      this.SysCharConstants.SystemCharDisableDefaultCountryCode,
      this.SysCharConstants.SystemCharHideBankDetailsTab,
      this.SysCharConstants.SystemCharEnableGroupAccounts,
      this.SysCharConstants.SystemCharUseVisitTolerances,
      this.SysCharConstants.SystemCharUseInfestationTolerances,
      this.SysCharConstants.SystemCharDisableFirstCapitalOnAddressContact,
      this.SysCharConstants.SystemCharConnectContractPostcodeNegEmployee,
      this.SysCharConstants.SystemCharEnablePayTypeAtInvoiceGroupLevel,
      this.SysCharConstants.SystemCharEnableValidatePostcodeSuburb,
      this.SysCharConstants.SystemCharShowWasteConsignmentNoteHistory,
      this.SysCharConstants.SystemCharEnableRecordingOfRenewalSalesStats
    ];
    return sysCharList.join(',');
  }

  public triggerFetchSysChar(saveModeData: any, returnSubscription: boolean, callback?: any): any {
    let sysCharNumbers = this.sysCharParameters();
    if (returnSubscription) {
      return this.fetchSysChar(sysCharNumbers);
    }
    this.ajaxSource.next(this.ajaxconstant.START);
    this.fetchSysChar(sysCharNumbers).subscribe(
      (e) => {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        if (e.errorMessage) {
          this.errorService.emitError({
            errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
          });
          return false;
        }
        if (e.records && e.records.length > 0) {
          this.onSysCharDataReceive(e);
          let data = [{
            'table': 'riRegistry',
            'query': { 'RegSection': 'Contact Person' },
            'fields': ['RegSection']
          },
          {
            'table': 'riRegistry',
            'query': { 'RegSection': 'Contact Centre Review', 'RegKey': this.storeData['code'].business + '_' + 'System Default Review From Drill Option' },
            'fields': ['RegSection', 'RegValue']
          },
          {
            'table': 'CIParams',
            'query': { 'BusinessCode': this.storeData['code'].business },
            'fields': ['BusinessCode', 'CIEnabled']
          }];
          this.ajaxSource.next(this.ajaxconstant.START);
          Observable.forkJoin(
            this.lookUpRecord(data, 5)
          ).subscribe((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data[0]['results'] && data[0]['results'].length > 0) {
              if (data[0]['results'][0].length > 0 && data[0]['results'][0][0]) {
                this.sysCharParams['vSCMultiContactInd'] = true;
              } else {
                this.sysCharParams['vSCMultiContactInd'] = false;
              }
              this.buildMenuOptions();
              if (data[0]['results'][1].length > 0 && data[0]['results'][1][0]) {
                this.sysCharParams['gcREGContactCentreReview'] = data[0]['results'][1][0].RegValue;
                if (this.sysCharParams['gcREGContactCentreReview'] === 'Y') {
                  this.otherParams['lREGContactCentreReview'] = true;
                } else {
                  this.otherParams['lREGContactCentreReview'] = false;
                }
              }

              if (data[0]['results'][2].length > 0) {
                let tabs, componentList;
                tabs = [
                  { title: 'Address', active: true },
                  { title: 'Invoice', disabled: false },
                  { title: 'General', removable: false }
                ];
                componentList = [MaintenanceTypeAComponent, MaintenanceTypeBComponent, MaintenanceTypeCComponent];
                this.otherParams['blnCIEnabled'] = data[0]['results'][2][0].CIEnabled;
                //this.otherParams['blnCIEnabled'] = true;
                if (this.sysCharParams['vSCAccountDiscounts']) {
                  tabs.push({ title: 'Discounts', customClass: '' });
                  componentList.push(MaintenanceTypeDComponent);
                  this.tabsToCheck['typeD'] = true;
                } else {
                  this.tabsToCheck['typeD'] = false;
                }
                if (this.otherParams['blnCIEnabled']) {
                  tabs.push({ title: 'Customer Integration', customClass: '' });
                  componentList.push(MaintenanceTypeEComponent);
                  this.tabsToCheck['typeE'] = true;
                } else {
                  this.tabsToCheck['typeE'] = false;
                }

                if (tabs.length !== this.tabs.length || (tabs.length === this.tabs.length && tabs.length === 4 && tabs[3].title !== this.tabs[3].title)) {
                  this.zone.run(() => {
                    this.tabs = tabs;
                    this.componentList = componentList;
                  });

                }
              }
            } else {
              this.sysCharParams['vSCMultiContactInd'] = false;
            }

            let userCode = this.authService.getSavedUserCode();
            this.ajaxSource.next(this.ajaxconstant.START);
            Observable.forkJoin(
              this.lookUpRecord([
                {
                  'table': 'Company',
                  'query': { 'BusinessCode': this.storeData['code'].business },
                  'fields': ['DefaultCompanyInd', 'CompanyCode', 'CompanyDesc']
                },
                {
                  'table': 'UserAuthority',
                  'query': { 'BusinessCode': this.storeData['code'].business, 'UserCode': userCode.UserCode },
                  'fields': ['AllowViewOfSensitiveInfoInd', 'AllowUpdateOfContractInfoInd']
                },
                {
                  'table': 'Branch',
                  'query': { 'BusinessCode': this.storeData['code'].business },
                  'fields': ['BranchNumber', 'BranchName', 'EnablePostCodeDefaulting']
                },
                {
                  'table': 'UserAuthorityBranch',
                  'query': { 'UserCode': userCode.UserCode, 'BusinessCode': this.storeData['code'].business },
                  'fields': ['BranchNumber', 'DefaultBranchInd', 'CurrentBranchInd']
                }
              ], 100),
              this.fetchContractData('GetDefaultInvoiceFrequency,GetDefaultInvoiceFeeCode,GetDefaultPaymentType,GetPaymentTypeDetails', { action: '6' })
            ).subscribe((data) => {
              this.ajaxSource.next(this.ajaxconstant.COMPLETE);
              if (data[0]['results'] && data[0]['results'].length > 0) {
                if (data[0]['results'][0].length > 0) {
                  let defaultCompanyCode = '', defaultCompanyDesc = '', obj = {};
                  this.otherParams['companyList'] = [];
                  this.storeData.otherParams['companyList'] = [];
                  for (let i = 0; i < data[0]['results'][0].length; i++) {
                    if (data[0]['results'][0][i].DefaultCompanyInd) {
                      this.sysCharParams['vDefaultCompanyCode'] = data[0]['results'][0][i].CompanyCode;
                      this.sysCharParams['vDefaultCompanyDesc'] = data[0]['results'][0][i].CompanyDesc;
                      this.otherParams['defaultCompanyCode'] = data[0]['results'][0][i].CompanyCode;
                      this.otherParams['defaultCompanyDesc'] = data[0]['results'][0][i].CompanyDesc;
                    }
                    obj = {
                      code: data[0]['results'][0][i].CompanyCode,
                      desc: data[0]['results'][0][i].CompanyDesc
                    };
                    this.otherParams['companyList'].push(obj);
                    this.storeData.otherParams['companyList'].push(obj);
                  }
                }

                if (data[0]['results'][1].length > 0) {
                  this.sysCharParams['glAllowUserAuthView'] = data[0]['results'][1][0].AllowViewOfSensitiveInfoInd;
                  this.sysCharParams['glAllowUserAuthUpdate'] = data[0]['results'][1][0].AllowUpdateOfContractInfoInd;
                  if (!this.sysCharParams['glAllowUserAuthUpdate']) {
                    this.displayList.options = false;
                  } else {
                    this.displayList.options = true;
                  }
                  if (!this.sysCharParams['glAllowUserAuthView']) {
                    this.displayList.contractAnnualValue = false;
                  } else {
                    this.displayList.contractAnnualValue = true;
                  }
                }
              }
              this.queryParams.branchNumber = this.cbb.getBranchCode();
              this.otherParams['currentBranchNumber'] = this.cbb.getBranchCode();
              if (data[0]['results'][3].length > 0) {
                if (!this.queryParams.branchNumber) {
                  for (let i = 0; i < data[0]['results'][3].length; i++) {
                    if (data[0]['results'][3][i].DefaultBranchInd) {
                      this.queryParams.branchNumber = data[0]['results'][3][i].BranchNumber;
                      this.otherParams['currentBranchNumber'] = data[0]['results'][3][i].BranchNumber;
                    }
                  }
                }
                if (data[0]['results'][2].length > 0) {
                  for (let k = 0; k < data[0]['results'][2].length; k++) {
                    this.branchList.push(JSON.parse(JSON.stringify({
                      branchNumber: data[0]['results'][2][k].BranchNumber,
                      branchName: data[0]['results'][2][k].BranchName
                    })));
                    if (!data[0]['results'][2][k].EnablePostCodeDefaulting) {
                      this.sysCharParams['vExcludedBranches'].push(data[0]['results'][2][k].BranchNumber);
                    }
                    if (data[0]['results'][2][k].BranchNumber === this.queryParams.branchNumber) {
                      this.queryParams.branchName = data[0]['results'][2][k].BranchName;
                    }
                  }
                }
                // Set default data
                if (saveModeData) {
                  this.contractFormGroup.controls['NegBranchNumber'].setValue(this.queryParams.branchNumber);
                  this.contractFormGroup.controls['BranchName'].setValue(this.queryParams.branchName);
                  this.negBranchNumberSelected = {
                    id: '',
                    text: this.queryParams.branchNumber + ' - ' + this.queryParams.branchName
                  };
                }

              }
              if (saveModeData) {
                if (data[1]['status'] === GlobalConstant.Configuration.Failure) {
                  this.errorService.emitError(data[1]['oResponse']);
                } else {
                  this.otherParams['InvoiceFeeCode'] = data[1]['InvoiceFeeCode'] ? data[1]['InvoiceFeeCode'] : '';
                  this.otherParams['InvoiceFeeDesc'] = data[1]['InvoiceFeeDesc'] ? data[1]['InvoiceFeeDesc'] : '';
                  this.otherParams['InvoiceFrequencyCode'] = data[1]['InvoiceFrequencyCode'] ? data[1]['InvoiceFrequencyCode'] : '';
                  this.otherParams['InvoiceFrequencyDesc'] = data[1]['InvoiceFrequencyDesc'] ? data[1]['InvoiceFrequencyDesc'] : '';
                  this.otherParams['PaymentDesc'] = data[1]['PaymentDesc'] ? data[1]['PaymentDesc'] : '';
                  this.otherParams['PaymentTypeCode'] = data[1]['PaymentTypeCode'] ? data[1]['PaymentTypeCode'] : '';
                  this.otherParams['MandateRequired'] = data[1]['MandateRequired'] ? data[1]['MandateRequired'] : '';
                }
                this.storeData['mode'] = saveModeData;
                this.sysCharParams['storage'] = this.sysCharParams['storage'] || {};
                this.sysCharParams['storage'][this.storeData['code'].country + this.storeData['code'].business] = JSON.parse(JSON.stringify(this.sysCharParams));
                this.store.dispatch({ type: ContractActionTypes.SAVE_SYSCHAR, payload: this.sysCharParams });
                this.store.dispatch({ type: ContractActionTypes.SAVE_OTHER_PARAMS, payload: this.otherParams });
                setTimeout(() => {
                  document.getElementsByTagName('body')[0].classList.remove('modal-open');
                }, 0);
                setTimeout(() => {
                  this.store.dispatch({
                    type: ContractActionTypes.SAVE_MODE,
                    payload: saveModeData
                  });
                  if (saveModeData && saveModeData.addMode === true)
                    this.riMaintenanceBeforeAdd();
                  if (callback) {
                    callback();
                  }
                  this.formPristine();
                }, 100);
              } else {
                setTimeout(() => {
                  this.sysCharParams['storage'] = this.sysCharParams['storage'] || {};
                  this.sysCharParams['storage'][this.storeData['code'].country + this.storeData['code'].business] = JSON.parse(JSON.stringify(this.sysCharParams));
                  this.store.dispatch({ type: ContractActionTypes.SAVE_SYSCHAR, payload: this.sysCharParams });
                  this.store.dispatch({ type: ContractActionTypes.SAVE_OTHER_PARAMS, payload: this.otherParams });
                  this.formPristine();
                }, 100);
              }

            }, (error) => {
              this.ajaxSource.next(this.ajaxconstant.COMPLETE);
              this.errorService.emitError({
                errorMessage: error['errorMessage'] || ErrorConstant.Message.UnexpectedError,
                fullError: error['fullError']
              });
              return;
            });
          });
        } else {
          this.ajaxSource.next(this.ajaxconstant.COMPLETE);
          this.errorService.emitError({
            errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
          });
        }

      },
      (error) => {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        // error statement
      }
    );
  }

  public onSysCharDataReceive(e: any): void {
    if (e.records && e.records.length > 0) {
      if (typeof e.records[0].Required !== 'undefined') {
        this.sysCharParams['vSCEnableMaxAddress'] = e.records[0].Required;
        this.sysCharParams['vSCEnableMaxAddressValue'] = e.records[0].Integer;
        this.sysCharParams['vSCEnableAutoNumber'] = e.records[1].Required;
        this.sysCharParams['vSCNationalAccountChecked'] = e.records[2].Required;
        this.sysCharParams['vSCEnableAddressLine3'] = e.records[3].Required;
        this.sysCharParams['vSCAddressLine3Logical'] = e.records[3].Logical;
        this.sysCharParams['vSCEnableInvoiceFee'] = e.records[4].Required;
        this.sysCharParams['vSCEnableDefaultJobExpiry'] = e.records[5].Required;
        this.sysCharParams['vSCEnableMinimumDuration'] = e.records[6].Required;
        this.sysCharParams['vSCEnableCompanyCode'] = e.records[7].Required;
        this.sysCharParams['vSCEnableMarktSelect'] = e.records[8].Required;
        this.sysCharParams['vSCEnableHopewiserPAF'] = e.records[9].Required;
        this.sysCharParams['vSCEnableDatabasePAF'] = e.records[10].Required;
        this.sysCharParams['vSCAddressLine4Required'] = e.records[11].Required;
        this.sysCharParams['vSCAddressLine4Logical'] = e.records[11].Logical;
        this.sysCharParams['vSCAddressLine5Required'] = e.records[12].Required;
        this.sysCharParams['vSCAddressLine5Logical'] = e.records[12].Logical;
        this.sysCharParams['vSCPostCodeRequired'] = e.records[13].Required;
        this.sysCharParams['vSCPostCodeMustExistInPAF'] = e.records[14].Required;
        this.sysCharParams['vEnablePostcodeDefaulting'] = e.records[15].Required;
        this.sysCharParams['vSCEnablePostcodeDefaulting'] = e.records[15].Required;
        this.sysCharParams['vSCRunPAFSearchOn1stAddressLine'] = e.records[16].Required;
        this.sysCharParams['vSCEnableLtdCompanyAndReg'] = e.records[17].Required;
        this.sysCharParams['vSCTaxRegNumber'] = e.records[18].Required;
        this.sysCharParams['vSCAccountDiscounts'] = e.records[19].Required;
        this.sysCharParams['vSCEnableMonthsNoticeNotUsed'] = e.records[20].Required;
        this.sysCharParams['vSCNoticePeriodNotused'] = e.records[20].Required;
        this.sysCharParams['vSCMonthsNotice'] = e.records[20].Integer;
        this.sysCharParams['vSCNoticePeriod'] = e.records[20].Logical;
        if (this.sysCharParams['vSCEnableMonthsNoticeNotUsed']) {
          this.sysCharParams['vSCEnableMonthsNotice'] = e.records[20].Logical;
        } else {
          this.sysCharParams['vSCEnableMonthsNotice'] = false;
        }
        this.sysCharParams['vSCEnableExternalRefNotUsed'] = e.records[21].Required;
        this.sysCharParams['vSCEnableExternalReference'] = e.records[21].Logical;
        this.sysCharParams['vSCEnableBankDetailEntry'] = e.records[22].Required;
        this.sysCharParams['vSCEnableLegacyMandate'] = e.records[22].Logical;
        this.sysCharParams['vSCEnableSubsequentDuration'] = e.records[23].Required;
        this.sysCharParams['vSCSubsequentDuration'] = e.records[23].Integer;
        this.sysCharParams['vSCAutoCreateRenewalProspect'] = e.records[24].Required;
        this.sysCharParams['vSCEnableTaxRegistrationNumber2'] = e.records[25].Required;
        this.sysCharParams['vRequired'] = e.records[26].Required;
        this.sysCharParams['vSCEnableTaxCodeDefaultingText'] = e.records[26].Text;
        this.sysCharParams['vSCEnableMinimumDuration'] = e.records[27].Required;
        this.sysCharParams['vSCMinimumDuration'] = e.records[27].Integer;
        this.sysCharParams['vSCEnableTrialPeriodServices'] = e.records[28].Required;
        this.sysCharParams['vSCEnableGPSCoordinates'] = e.records[29].Required;
        this.sysCharParams['vSCHidePostcode'] = e.records[30].Required;
        this.sysCharParams['vSCEnableHPRLExempt'] = e.records[31].Required;
        this.sysCharParams['vSCDisplayContractOwner'] = e.records[32].Required;
        this.sysCharParams['vSCContractOwnerRequired'] = e.records[32].Logical;
        this.sysCharParams['vSCDisplayContractPaymentDueDay'] = e.records[33].Required;
        this.sysCharParams['vSCEnableSEPAFinanceMandate'] = e.records[34].Required;
        this.sysCharParams['vSCEnableSEPAFinanceMandateLog'] = e.records[34].Logical;
        this.sysCharParams['vSCDisableDefaultCountryCode'] = e.records[35].Required;
        this.sysCharParams['vSCHideBankDetailsTab'] = e.records[36].Required;
        this.sysCharParams['vSCGroupAccount'] = e.records[37].Required;
        this.sysCharParams['vSCVisitTolerances'] = e.records[38].Required;
        this.sysCharParams['vSCInfestationTolerance'] = e.records[39].Required;
        this.sysCharParams['vSCCapitalFirstLtr'] = e.records[40].Required;
        this.sysCharParams['vSCConnectContrPostcodeNegEmp'] = e.records[41].Required;
        this.sysCharParams['vSCEnablePayTypeAtInvGroupLevel'] = e.records[42].Required;
        this.sysCharParams['vSCEnableValidatePostcodeSuburb'] = e.records[43].Logical;
        this.sysCharParams['vSCEnablePostcodeSuburbLog'] = e.records[43].Logical;
        this.sysCharParams['vShowWasteConsignmentNoteHistory'] = e.records[44].Required;
        this.sysCharParams['vSCEnableRenewals'] = e.records[45].Required;
        if (this.sysCharParams['vSCEnablePostcodeDefaulting']) {
          this.utils.determinePostCodeDefaulting(this.sysCharParams['vSCEnablePostcodeDefaulting']).subscribe((res) => {
            this.sysCharParams['vSCEnablePostcodeDefaulting'] = res;
            this.sysCharParams['vEnablePostcodeDefaulting'] = res;
          });
        }
      } else {
        this.sysCharParams = e.records[0];
      }

      this.otherParams['vDisableFields'] = '';
      if (!this.sysCharParams['vSCEnableCompanyCode']) {
        if (this.otherParams['vDisableFields'] !== '') {
          this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + ',' + 'CompanyCode';
        } else {
          this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + 'CompanyCode';
        }
      }

      if (!this.sysCharParams['vSCEnableMinimumDuration']) {
        if (this.otherParams['vDisableFields'] !== '') {
          this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + ',' + 'MinimumDurationCode';
        } else {
          this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + 'MinimumDurationCode';
        }
      }

      if (!this.sysCharParams['vSCEnableSubsequentDuration'] || !this.sysCharParams['vSCEnableMinimumDuration']) {
        if (this.otherParams['vDisableFields'] !== '') {
          this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + ',' + 'SubsequentDurationCode';
        } else {
          this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + 'SubsequentDurationCode';
        }
      }

      if (!this.sysCharParams['vSCEnableAddressLine3']) {
        if (this.otherParams['vDisableFields'] !== '') {
          this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + ',' + 'DisableAddressLine3';
        } else {
          this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + 'DisableAddressLine3';
        }
      }

      if (!this.sysCharParams['vSCEnableLtdCompanyAndReg']) {
        if (this.otherParams['vDisableFields'] !== '') {
          this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + ',' + 'DisableLtdCompanyAndReg';
        } else {
          this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + 'DisableLtdCompanyAndReg';
        }
      }

      if (!this.sysCharParams['vSCEnableMonthsNotice'] || !this.sysCharParams['vSCEnableMonthsNoticeNotUsed']) {
        if (this.otherParams['vDisableFields'] !== '') {
          this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + ',' + 'DisableMonthsNotice';
        } else {
          this.otherParams['vDisableFields'] = this.otherParams['vDisableFields'] + 'DisableMonthsNotice';
        }
      }

      this.otherParams['ReqAutoInvoiceFee'] = this.sysCharParams['vSCEnableInvoiceFee'];
      if ((this.sysCharParams['vSCEnableBankDetailEntry'] === true && this.sysCharParams['vSCEnableSEPAFinanceMandate'] === true && this.sysCharParams['vSCEnableSEPAFinanceMandateLog'] === false) || (this.sysCharParams['vSCEnableBankDetailEntry'] === false && this.sysCharParams['vSCEnableSEPAFinanceMandate'] === false && this.sysCharParams['vSCEnableSEPAFinanceMandateLog'] === true)) {
        this.otherParams['SepaConfigInd'] = true;
      } else {
        this.otherParams['SepaConfigInd'] = false;
      }
      this.buildMenuOptions();
    }
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

  public setDefaultFormState(): void {
    this.displayList = JSON.parse(JSON.stringify(this.displayListClone));
    for (let i in this.contractFormGroup.controls) {
      if (this.contractFormGroup.controls.hasOwnProperty(i)) {
        this.contractFormGroup.controls[i].clearValidators();
      }
    }
    this.isNationalAccount = false;
    this.contractFormGroup.controls['ContractNumber'].setValidators(Validators.required);
    this.contractFormGroup.controls['ContractName'].setValidators(Validators.required);
    this.contractFormGroup.controls['ContractCommenceDate'].setValidators(Validators.required);
    this.contractFormGroup.reset();
    this.store.dispatch({ type: ContractActionTypes.FORM_RESET, payload: {} });
    this.fetchTranslationContent();
  }

  public lookUpRecord(data: Object, maxresults: number): any {
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

  public fetchAccountData(params: Object, headers: any): any {
    this.query.set(this.serviceConstants.BusinessCode, this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
    this.query.set(this.serviceConstants.CountryCode, this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
    this.query.set(this.serviceConstants.Action, this.queryParams.action);
    //this.query.set('AccountNumber', this.contractStoreData.AccountNumber);
    for (let key in params) {
      if (key) {
        this.query.set(key, params[key]);
      }
    }
    if (!headers) {
      headers = this.queryParams;
    }
    return this.httpService.makeGetRequest(headers.method, headers.module, headers.operation, this.query);
  }

  public fetchPremiseData(): any {
    let data = [{
      'table': 'Premise',
      'query': { 'BusinessCode': this.storeData['code'].business, 'ContractNumber': this.contractStoreData.ContractNumber, 'AccountNumber': this.contractStoreData.AccountNumber, 'ContractTypeCode': this.contractStoreData.ContractTypePrefix },
      'fields': ['BusinessCode', 'PNOL', 'PortfolioStatusCode', 'PremiseNumber', 'AccountNumber', 'ContractNumber', 'PNOLEffectiveDate']
    }];
    this.lookUpRecord(data, 5).subscribe(
      (e) => {
        if (e['results'] && e['results'].length > 0) {
          if (e['results'][0].length > 0) {
            if (e['results'][0][0].PNOL) {
              this.displayList.pnol = true;
            } else {
              this.displayList.pnol = false;
            }

          }
        }
      },
      (error) => {
        // error statement
      }
    );
  }

  public getContractCopyData(params: Object): any {
    let queryContract = new URLSearchParams();

    queryContract.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
    queryContract.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

    for (let key in params) {
      if (key) {
        queryContract.set(key, params[key]);
      }
    }
    return this.httpService.makeGetRequest(this.getContractDetails.method, this.getContractDetails.module, this.getContractDetails.operation, queryContract);
  }

  public fetchContractData(functionName: string, params: Object): any {
    if (functionName === 'CheckPostcodeNegBranch') {
      if (!((this.sysCharParams['vEnablePostcodeDefaulting'] && this.storeData['mode'].addMode === true && this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value && this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value && this.storeData['formGroup'].typeA.controls['ContractPostcode'].value) || (this.sysCharParams['vEnablePostcodeDefaulting'] && this.storeData['mode'].updateMode === true && this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value && this.storeData['formGroup'].typeA.controls['ContractPostcode'].value))) {
        this.dataEventCheckPostcodeNegBranch = new Subject<any>();
        setTimeout(() => {
          this.dataEventCheckPostcodeNegBranch.next({
            ErrorMessageDesc: ''
          });
          this.dataEventCheckPostcodeNegBranch.complete();
        }, 0);
        return this.dataEventCheckPostcodeNegBranch.asObservable();
      }
    } else if (functionName === 'CheckPostcode') {
      if (!(this.sysCharParams['vSCPostCodeMustExistInPAF'] && (this.sysCharParams['vSCEnableHopewiserPAF'] || this.sysCharParams['vSCEnableDatabasePAF']))) {
        this.dataEventCheckPostcode = new Subject<any>();
        setTimeout(() => {
          this.dataEventCheckPostcode.next({
            ErrorMessageDesc: ''
          });
          this.dataEventCheckPostcode.complete();
        }, 0);
        return this.dataEventCheckPostcode.asObservable();
      }
    } else if (functionName === 'WarnPostcode') {
      if (this.contractFormGroup.controls['AccountNumber'].value === '') {
        this.dataEventWarnPostcode = new Subject<any>();
        setTimeout(() => {
          this.dataEventWarnPostcode.next({
            ErrorMessageDesc: ''
          });
          this.dataEventWarnPostcode.complete();
        }, 0);
        return this.dataEventWarnPostcode.asObservable();
      }
    } else if (functionName === 'CheckNatAcc') {
      if (this.contractFormGroup.controls['AccountNumber'].value === '') {
        this.dataEventCheckNatAcc = new Subject<any>();
        setTimeout(() => {
          this.dataEventCheckNatAcc.next({
            ErrorMessageDesc: ''
          });
          this.dataEventCheckNatAcc.complete();
        }, 0);
        return this.dataEventCheckNatAcc.asObservable();
      }
    }
    this.queryContract = new URLSearchParams();

    let businessCode = this.utils.getBusinessCode();
    let countryCode = this.utils.getCountryCode();
    this.queryContract.set(this.serviceConstants.BusinessCode, businessCode);
    this.queryContract.set(this.serviceConstants.CountryCode, countryCode);
    this.queryContract.set(this.serviceConstants.Action, this.queryParamsContract.action);
    if (this.contractStoreData && this.contractStoreData.ContractNumber) {
      this.queryContract.set('ContractNumber', this.contractStoreData.ContractNumber);
    }
    if (this.inputParams && this.inputParams.currentContractType) {
      this.queryContract.set('ContractTypeCode', this.inputParams.currentContractType);
    }
    if (this.contractStoreData && this.contractStoreData.ContractTypePrefix) {
      this.queryContract.set('ContractTypeCode', this.contractStoreData.ContractTypePrefix);
    }

    if (functionName !== '') {
      this.queryContract.set(this.serviceConstants.Action, '6');
      this.queryContract.set('Function', functionName);
    }
    for (let key in params) {
      if (key) {
        this.queryContract.set(key, params[key]);
      }
    }
    return this.httpService.makeGetRequest(this.queryParamsContract.method, this.queryParamsContract.module, this.queryParamsContract.operation, this.queryContract);
  }

  public fetchContractDataPost(functionName: string, params: Object, formData: Object): any {
    let queryContract = new URLSearchParams();
    let businessCode = this.utils.getBusinessCode();
    let countryCode = this.utils.getCountryCode();
    queryContract.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
    queryContract.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
    queryContract.set(this.serviceConstants.Action, this.queryParamsContract.action);

    if (this.inputParams && this.inputParams.currentContractType) {
      queryContract.set('ContractTypeCode', this.inputParams.currentContractType);
    }
    if (this.contractStoreData && this.contractStoreData.ContractTypePrefix) {
      queryContract.set('ContractTypeCode', this.contractStoreData.ContractTypePrefix);
    }

    if (functionName !== '') {
      queryContract.set(this.serviceConstants.Action, '6');
      queryContract.set('Function', functionName);
    }
    for (let key in params) {
      if (key) {
        queryContract.set(key, params[key]);
      }
    }
    return this.httpService.makePostRequest(this.queryParamsContract.method, this.queryParamsContract.module, this.queryParamsContract.operation, queryContract, formData);
  }

  public updateContract(): any {
    let formdata: Object = {};
    this.queryContract = new URLSearchParams();
    this.queryContract.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
    this.queryContract.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
    this.queryContract.set(this.serviceConstants.Action, '2');
    formdata['ContractNumber'] = this.contractFormGroup.controls['ContractNumber'].value;
    formdata = this.buildFormData(formdata);
    this.ajaxSource.next(this.ajaxconstant.START);
    this.httpService.makePostRequest(this.queryParamsContract.method, this.queryParamsContract.module, this.queryParamsContract.operation, this.queryContract, formdata).subscribe(
      (e) => {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        if (e.status === GlobalConstant.Configuration.Failure) {
          this.errorService.emitError(e.oResponse);
        } else {
          if (e['errorMessage'] || e['fullError']) {
            this.errorService.emitError(e);
          } else {
            this.errorService.emitError({
              title: 'Message',
              msg: MessageConstant.Message.RecordSavedSuccessfully
            });
            this.riMaintenanceAfterSave();
            this.formPristine();
          }
          this.tabsError = {
            tabA: false,
            tabB: false,
            tabC: false,
            tabD: false,
            tabE: false
          };
        }

      },
      (error) => {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        this.errorService.emitError(error);
      }
    );
  }

  public addContract(): any {
    let formdata: Object = {};
    this.queryContract = new URLSearchParams();
    this.queryContract.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
    this.queryContract.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
    this.queryContract.set(this.serviceConstants.Action, '1');

    formdata['ContractNumber'] = this.sysCharParams['vSCEnableAutoNumber'] ? '' : this.contractFormGroup.controls['ContractNumber'].value;
    formdata = this.buildFormData(formdata);
    this.ajaxSource.next(this.ajaxconstant.START);
    this.httpService.makePostRequest(this.queryParamsContract.method, this.queryParamsContract.module, this.queryParamsContract.operation, this.queryContract, formdata).subscribe(
      (e) => {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        if (e.status === GlobalConstant.Configuration.Failure) {
          this.errorService.emitError(e.oResponse);
        } else {
          if (e.errorMessage) {
            this.errorService.emitError(e);
          } else {
            if (e && (Object.keys(e).length === 0 && e.constructor === Object)) {
              return false;
            }
            this.contractFormGroup.controls['ContractNumber'].setValue(e.ContractNumber);
            this.contractFormGroup.controls['AccountNumber'].setValue(e.AccountNumber);
            this.contractFormGroup.controls['AccountName'].setValue(e.AccountName);
            this.contractFormGroup.controls['Status'].setValue(e.Status);
            this.storeData['data'].ContractNumber = e.ContractNumber;
            this.storeData['data'].AccountNumber = e.AccountNumber;
            this.storeData['data'].Status = e.Status;
            this.formPristine();
            if (e.ContractNumber) {
              this.fetchContractData('', { ContractNumber: e.ContractNumber }).subscribe((data) => {
                if (data['status'] === GlobalConstant.Configuration.Failure) {
                  this.errorService.emitError(data['oResponse']);
                } else {
                  if (!data['errorMessage']) {
                    this.store.dispatch({ type: ContractActionTypes.SAVE_DATA, payload: data });
                    if (this.sysCharParams['vSCEnableMarktSelect']) {
                      this.promptTitle = MessageConstant.Message.SaveContractAddressAsAccountAddress;
                      this.promptModal.show();
                    } else {
                      this.navigateToPremise = true;
                      this.setDataForPremise();
                      this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
                        queryParams: {
                          parentMode: 'Contract-Add',
                          ContractNumber: this.contractFormGroup.controls['ContractNumber'].value,
                          AccountNumber: this.contractFormGroup.controls['AccountNumber'].value,
                          AccountName: this.contractFormGroup.controls['AccountName'].value,
                          contractTypeCode: this.inputParams.currentContractType
                        }
                      });
                    }
                  }
                  this.lookUpFields();
                }
              }, (error) => {
                this.errorService.emitError({
                  errorMessage: error['errorMessage'] || ErrorConstant.Message.UnexpectedError,
                  fullError: error['fullError']
                });
              }
              );
            }
          }
          this.tabsError = {
            tabA: false,
            tabB: false,
            tabC: false,
            tabD: false,
            tabE: false
          };

        }

      },
      (error) => {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        this.errorService.emitError(error);
      }
    );
  }

  public buildFormData(formdata: Object): Object {
    formdata['ContractName'] = this.contractFormGroup.controls['ContractName'] && this.contractFormGroup.controls['ContractName'].value ? this.contractFormGroup.controls['ContractName'].value : '';
    formdata['NegBranchNumber'] = this.contractFormGroup.controls['NegBranchNumber'] && this.contractFormGroup.controls['NegBranchNumber'].value ? this.contractFormGroup.controls['NegBranchNumber'].value : '';
    formdata['AccountNumber'] = this.contractFormGroup.controls['AccountNumber'] && this.contractFormGroup.controls['AccountNumber'].value ? this.contractFormGroup.controls['AccountNumber'].value : '';
    formdata['CurrentPremises'] = this.contractFormGroup.controls['CurrentPremises'] && this.contractFormGroup.controls['CurrentPremises'].value ? this.contractFormGroup.controls['CurrentPremises'].value : '';
    formdata['ContractHasExpired'] = this.contractFormGroup.controls['ContractHasExpired'] && this.contractFormGroup.controls['ContractHasExpired'].value ? this.contractFormGroup.controls['ContractHasExpired'].value : GlobalConstant.Configuration.No;
    formdata['ExternalReference'] = this.storeData['formGroup'].typeC.controls['ExternalReference'] && this.storeData['formGroup'].typeC.controls['ExternalReference'].value ? this.storeData['formGroup'].typeC.controls['ExternalReference'].value : '';
    formdata['ContractAddressLine1'] = this.storeData['formGroup'].typeA.controls['ContractAddressLine1'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine1'].value ? this.storeData['formGroup'].typeA.controls['ContractAddressLine1'].value : '';
    formdata['ContractAddressLine2'] = this.storeData['formGroup'].typeA.controls['ContractAddressLine2'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine2'].value ? this.storeData['formGroup'].typeA.controls['ContractAddressLine2'].value : '';
    formdata['ContractAddressLine3'] = this.storeData['formGroup'].typeA.controls['ContractAddressLine3'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine3'].value ? this.storeData['formGroup'].typeA.controls['ContractAddressLine3'].value : '';
    formdata['ContractAddressLine4'] = this.storeData['formGroup'].typeA.controls['ContractAddressLine4'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value ? this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value : '';
    formdata['ContractAddressLine5'] = this.storeData['formGroup'].typeA.controls['ContractAddressLine5'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value ? this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value : '';
    formdata['ContractPostcode'] = this.storeData['formGroup'].typeA.controls['ContractPostcode'] && this.storeData['formGroup'].typeA.controls['ContractPostcode'].value ? this.storeData['formGroup'].typeA.controls['ContractPostcode'].value : '';
    formdata['CountryCode'] = this.storeData['formGroup'].typeA.controls['CountryCode'] && this.storeData['formGroup'].typeA.controls['CountryCode'].value ? this.storeData['formGroup'].typeA.controls['CountryCode'].value : '';
    formdata['ContractContactName'] = this.storeData['formGroup'].typeA.controls['ContractContactName'] && this.storeData['formGroup'].typeA.controls['ContractContactName'].value ? this.storeData['formGroup'].typeA.controls['ContractContactName'].value : '';
    formdata['ContractContactPosition'] = this.storeData['formGroup'].typeA.controls['ContractContactPosition'] && this.storeData['formGroup'].typeA.controls['ContractContactPosition'] ? this.storeData['formGroup'].typeA.controls['ContractContactPosition'].value : '';
    formdata['ContractContactDepartment'] = this.storeData['formGroup'].typeA.controls['ContractContactDepartment'] && this.storeData['formGroup'].typeA.controls['ContractContactDepartment'].value ? this.storeData['formGroup'].typeA.controls['ContractContactDepartment'].value : '';
    formdata['ContractContactTelephone'] = this.storeData['formGroup'].typeA.controls['ContractContactTelephone'] && this.storeData['formGroup'].typeA.controls['ContractContactTelephone'].value ? this.storeData['formGroup'].typeA.controls['ContractContactTelephone'].value : '';
    formdata['ContractContactMobile'] = this.storeData['formGroup'].typeA.controls['ContractContactMobile'] && this.storeData['formGroup'].typeA.controls['ContractContactMobile'].value ? this.storeData['formGroup'].typeA.controls['ContractContactMobile'].value : '';
    formdata['ContractContactFax'] = this.storeData['formGroup'].typeA.controls['ContractContactFax'] && this.storeData['formGroup'].typeA.controls['ContractContactFax'].value ? this.storeData['formGroup'].typeA.controls['ContractContactFax'].value : '';
    formdata['ContractContactEmail'] = this.storeData['formGroup'].typeA.controls['ContractContactEmail'] && this.storeData['formGroup'].typeA.controls['ContractContactEmail'].value ? this.storeData['formGroup'].typeA.controls['ContractContactEmail'].value : '';
    formdata['GPSCoordinateX'] = this.storeData['formGroup'].typeA.controls['GPSCoordinateX'] && this.storeData['formGroup'].typeA.controls['GPSCoordinateX'].value ? this.storeData['formGroup'].typeA.controls['GPSCoordinateX'].value : '';
    formdata['GPSCoordinateY'] = this.storeData['formGroup'].typeA.controls['GPSCoordinateY'] && this.storeData['formGroup'].typeA.controls['GPSCoordinateY'].value ? this.storeData['formGroup'].typeA.controls['GPSCoordinateY'].value : '';
    formdata['TelesalesInd'] = this.storeData['formGroup'].typeC.controls['Telesales'] && this.storeData['formGroup'].typeC.controls['Telesales'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
    formdata['InvoiceAnnivDate'] = this.storeData['formGroup'].typeB.controls['InvoiceAnnivDate'] && this.storeData['formGroup'].typeB.controls['InvoiceAnnivDate'].value ? this.storeData['formGroup'].typeB.controls['InvoiceAnnivDate'].value : '';
    formdata['ContractResignDate'] = this.storeData['formGroup'].typeC.controls['ContractResignDate'] && this.storeData['formGroup'].typeC.controls['ContractResignDate'].value ? this.storeData['formGroup'].typeC.controls['ContractResignDate'].value : '';
    formdata['InvoiceFrequencyCode'] = this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'] && this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].value ? this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].value : '';
    formdata['InvoiceFrequencyChargeInd'] = this.contractFormGroup.controls['InvoiceFrequencyChargeInd'] && this.contractFormGroup.controls['InvoiceFrequencyChargeInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
    formdata['InvoiceFrequencyChargeValue'] = this.storeData['formGroup'].typeB.controls['InvoiceFrequencyChargeValue'] && this.storeData['formGroup'].typeB.controls['InvoiceFrequencyChargeValue'].value ? this.globalize.parseCurrencyToFixedFormat(this.storeData['formGroup'].typeB.controls['InvoiceFrequencyChargeValue'].value) : '';
    formdata['LostBusinessNoticePeriod'] = this.storeData['formGroup'].typeC.controls['NoticePeriod'] && this.storeData['formGroup'].typeC.controls['NoticePeriod'].value ? this.storeData['formGroup'].typeC.controls['NoticePeriod'].value : '';
    formdata['AdvanceInvoiceInd'] = this.storeData['formGroup'].typeB.controls['AdvanceInvoiceInd'] && this.storeData['formGroup'].typeB.controls['AdvanceInvoiceInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
    formdata['ContractDurationCode'] = this.storeData['formGroup'].typeB.controls['ContractDurationCode'] && this.storeData['formGroup'].typeB.controls['ContractDurationCode'].value ? this.storeData['formGroup'].typeB.controls['ContractDurationCode'].value : '';
    formdata['SubsequentDurationCode'] = this.storeData['formGroup'].typeB.controls['SubsequentDurationCode'] && this.storeData['formGroup'].typeB.controls['SubsequentDurationCode'].value ? this.storeData['formGroup'].typeB.controls['SubsequentDurationCode'].value : '';
    formdata['APIExemptInd'] = this.storeData['formGroup'].typeB.controls['APIExemptInd'] && this.storeData['formGroup'].typeB.controls['APIExemptInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
    formdata['APIExemptText'] = this.storeData['formGroup'].typeB.controls['APIExemptText'] && this.storeData['formGroup'].typeB.controls['APIExemptText'].value ? this.storeData['formGroup'].typeB.controls['APIExemptText'].value : '';
    formdata['NextAPIDate'] = this.storeData['formGroup'].typeB.controls['NextAPIDate'] && this.storeData['formGroup'].typeB.controls['NextAPIDate'].value ? this.storeData['formGroup'].typeB.controls['NextAPIDate'].value : '';
    formdata['ContractReference'] = this.storeData['formGroup'].typeC.controls['ContractReference'] && this.storeData['formGroup'].typeC.controls['ContractReference'].value ? this.storeData['formGroup'].typeC.controls['ContractReference'].value : '';

    formdata['AgreementNumber'] = this.storeData['formGroup'].typeC.controls['AgreementNumber'] && this.storeData['formGroup'].typeC.controls['AgreementNumber'].value ? this.storeData['formGroup'].typeC.controls['AgreementNumber'].value : '';
    formdata['RenewalAgreementNumber'] = this.storeData['formGroup'].typeC.controls['RenewalAgreementNumber'] && this.storeData['formGroup'].typeC.controls['RenewalAgreementNumber'] ? this.storeData['formGroup'].typeC.controls['RenewalAgreementNumber'].value : '';
    formdata['AuthorityCode'] = this.storeData['formGroup'].typeB.controls['AuthorityCode'] && this.storeData['formGroup'].typeB.controls['AuthorityCode'].value ? this.storeData['formGroup'].typeB.controls['AuthorityCode'].value : '';
    formdata['ContractExpiryDate'] = this.storeData['formGroup'].typeB.controls['ContractExpiryDate'] && this.storeData['formGroup'].typeB.controls['ContractExpiryDate'].value ? this.storeData['formGroup'].typeB.controls['ContractExpiryDate'].value : '';
    formdata['ContractRenewalDate'] = this.storeData['formGroup'].typeB.controls['ContractRenewalDate'] && this.storeData['formGroup'].typeB.controls['ContractRenewalDate'].value ? this.storeData['formGroup'].typeB.controls['ContractRenewalDate'].value : '';
    formdata['CreateRenewalInd'] = this.storeData['formGroup'].typeB.controls['CreateRenewalInd'] && this.storeData['formGroup'].typeB.controls['CreateRenewalInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
    formdata['PaymentTypeCode'] = this.storeData['formGroup'].typeB.controls['PaymentTypeCode'] && this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].value ? this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].value : '';
    formdata['VADDBranchNumber'] = this.storeData['formGroup'].typeB.controls['VADDBranchNumber'] && this.storeData['formGroup'].typeB.controls['VADDBranchNumber'].value ? this.storeData['formGroup'].typeB.controls['VADDBranchNumber'].value : '';
    formdata['VADDMandateNumber'] = this.storeData['formGroup'].typeB.controls['VADDMandateNumber'] && this.storeData['formGroup'].typeB.controls['VADDMandateNumber'].value ? this.storeData['formGroup'].typeB.controls['VADDMandateNumber'].value : '';
    formdata['MandateNumberAccount'] = this.storeData['formGroup'].typeB.controls['MandateNumberAccount'] && this.storeData['formGroup'].typeB.controls['MandateNumberAccount'].value ? this.storeData['formGroup'].typeB.controls['MandateNumberAccount'].value : '';
    formdata['MandateDate'] = this.storeData['formGroup'].typeB.controls['MandateDate'] && this.storeData['formGroup'].typeB.controls['MandateDate'].value ? this.storeData['formGroup'].typeB.controls['MandateDate'].value : '';
    formdata['CompanyCode'] = this.storeData['formGroup'].typeC.controls['CompanyCode'] && this.storeData['formGroup'].typeC.controls['CompanyCode'].value ? this.storeData['formGroup'].typeC.controls['CompanyCode'].value : '';
    formdata['MinimumDurationCode'] = this.storeData['formGroup'].typeB.controls['MinimumDurationCode'] && this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].value ? this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].value : '';
    formdata['MinimumExpiryDate'] = this.storeData['formGroup'].typeB.controls['MinimumExpiryDate'] && this.storeData['formGroup'].typeB.controls['MinimumExpiryDate'].value ? this.storeData['formGroup'].typeB.controls['MinimumExpiryDate'].value : '';
    formdata['ContractSalesEmployee'] = this.storeData['formGroup'].typeC.controls['SalesEmployee'] && this.storeData['formGroup'].typeC.controls['SalesEmployee'].value ? this.storeData['formGroup'].typeC.controls['SalesEmployee'].value : '';
    formdata['ContractOwner'] = this.storeData['formGroup'].typeC.controls['ContractOwner'] && this.storeData['formGroup'].typeC.controls['ContractOwner'].value ? this.storeData['formGroup'].typeC.controls['ContractOwner'].value : '';
    formdata['CompanyVATNumber'] = this.storeData['formGroup'].typeC.controls['CompanyVatNumber'] && this.storeData['formGroup'].typeC.controls['CompanyVatNumber'].value ? this.storeData['formGroup'].typeC.controls['CompanyVatNumber'].value : '';
    formdata['CompanyVATNumber2'] = this.storeData['formGroup'].typeC.controls['CompanyVatNumber2'] && this.storeData['formGroup'].typeC.controls['CompanyVatNumber2'].value ? this.storeData['formGroup'].typeC.controls['CompanyVatNumber2'].value : '';
    formdata['CompanyRegistrationNumber'] = this.storeData['formGroup'].typeC.controls['CompanyRegistrationNumber'] && this.storeData['formGroup'].typeC.controls['CompanyRegistrationNumber'].value ? this.storeData['formGroup'].typeC.controls['CompanyRegistrationNumber'].value : '';
    formdata['InterCompanyPortfolioInd'] = this.storeData['formGroup'].typeC.controls['InterCompanyPortfolio'] && this.storeData['formGroup'].typeC.controls['InterCompanyPortfolio'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
    formdata['LimitedCompanyInd'] = this.storeData['formGroup'].typeC.controls['LimitedCompany'] && this.storeData['formGroup'].typeC.controls['LimitedCompany'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
    formdata['CallLogID'] = this.currentRouteParams && this.currentRouteParams['CurrentCallLogID'] ? this.currentRouteParams['CurrentCallLogID'] : '';
    formdata['TrialPeriodInd'] = this.contractFormGroup.controls['TrialPeriodInd'] && this.contractFormGroup.controls['TrialPeriodInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
    formdata['GroupAccountPriceGroupID'] = this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'] && this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value ? this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value : '';
    formdata['ContinuousInd'] = this.storeData['formGroup'].typeB.controls['ContinuousInd'] && this.storeData['formGroup'].typeB.controls['ContinuousInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
    formdata['DisableList'] = this.otherParams['vDisableFields'];
    formdata['ReqAutoNumber'] = this.sysCharParams['vSCEnableAutoNumber'] ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;;
    formdata['MandateRequired'] = this.otherParams['MandateRequired'] ? this.otherParams['MandateRequired'] : '';
    formdata['PaymentTypeWarning'] = this.contractFormGroup.controls['PaymentTypeWarning'] && this.contractFormGroup.controls['PaymentTypeWarning'].value ? this.contractFormGroup.controls['PaymentTypeWarning'].value : '';
    formdata['ProspectNumber'] = this.prospectNumber ? this.prospectNumber : '';
    formdata['BadDebtAccount'] = this.contractFormGroup.controls['BadDebtAccount'] && this.contractFormGroup.controls['BadDebtAccount'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
    formdata['PaymentDueDay'] = this.storeData['formGroup'].typeB.controls['PaymentDueDay'] && this.storeData['formGroup'].typeB.controls['PaymentDueDay'].value ? this.storeData['formGroup'].typeB.controls['PaymentDueDay'].value : '';
    formdata['GroupAccountNumber'] = this.contractFormGroup.controls['GroupAccountNumber'] && this.contractFormGroup.controls['GroupAccountNumber'].value ? this.contractFormGroup.controls['GroupAccountNumber'].value : '';
    formdata['BankAccountNumber'] = this.storeData['formGroup'].typeB.controls['BankAccountNumber'] && this.storeData['formGroup'].typeB.controls['BankAccountNumber'].value ? this.storeData['formGroup'].typeB.controls['BankAccountNumber'].value : '';
    formdata['BankAccountSortCode'] = this.storeData['formGroup'].typeB.controls['BankAccountSortCode'] && this.storeData['formGroup'].typeB.controls['BankAccountSortCode'].value ? this.storeData['formGroup'].typeB.controls['BankAccountSortCode'].value : '';
    formdata['ContractTypeCode'] = this.inputParams.currentContractType;

    formdata['ContractAnnualValue'] = this.contractFormGroup.controls['ContractAnnualValue'] && this.contractFormGroup.controls['ContractAnnualValue'].value ? this.globalize.parseCurrencyToFixedFormat(this.contractFormGroup.controls['ContractAnnualValue'].value) : '';
    formdata['ContractCommenceDate'] = this.contractFormGroup.controls['ContractCommenceDate'] && this.contractFormGroup.controls['ContractCommenceDate'].value ? this.contractFormGroup.controls['ContractCommenceDate'].value : '';
    formdata['PortfolioStatusCode'] = this.contractFormGroup.controls['Status'] && this.contractFormGroup.controls['Status'].value ? this.contractFormGroup.controls['Status'].value : '';
    formdata['InactiveEffectDate'] = this.contractFormGroup.controls['InactiveEffectDate'] && this.contractFormGroup.controls['InactiveEffectDate'].value ? this.contractFormGroup.controls['InactiveEffectDate'].value : '';
    formdata['AnyPendingBelow'] = this.contractFormGroup.controls['AnyPendingBelow'] && this.contractFormGroup.controls['AnyPendingBelow'].value ? this.contractFormGroup.controls['AnyPendingBelow'].value : '';
    formdata['LostBusinessDesc'] = this.contractFormGroup.controls['LostBusinessDesc'] && this.contractFormGroup.controls['LostBusinessDesc'].value ? this.contractFormGroup.controls['LostBusinessDesc'].value : '';
    formdata['LostBusinessDesc2'] = this.contractFormGroup.controls['LostBusinessDesc2'] && this.contractFormGroup.controls['LostBusinessDesc2'].value ? this.contractFormGroup.controls['LostBusinessDesc2'].value : '';
    formdata['LostBusinessDesc3'] = this.contractFormGroup.controls['LostBusinessDesc3'] && this.contractFormGroup.controls['LostBusinessDesc3'].value ? this.contractFormGroup.controls['LostBusinessDesc3'].value : '';
    formdata['MoreThanOneContract'] = this.contractFormGroup.controls['MoreThanOneContract'] && this.contractFormGroup.controls['MoreThanOneContract'].value ? this.contractFormGroup.controls['MoreThanOneContract'].value : '';
    formdata['AccountBalance'] = this.contractFormGroup.controls['AccountBalance'] && this.contractFormGroup.controls['AccountBalance'].value ? this.globalize.parseCurrencyToFixedFormat(this.contractFormGroup.controls['AccountBalance'].value) : '';
    formdata['InvoiceFeeCode'] = this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'] && this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].value ? this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].value : '';
    formdata['VATExempt'] = this.storeData['formGroup'].typeB.controls['VATExempt'] && this.storeData['formGroup'].typeB.controls['VATExempt'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
    formdata['InvoiceSuspendInd'] = this.storeData['formGroup'].typeB.controls['InvoiceSuspendInd'] && this.storeData['formGroup'].typeB.controls['InvoiceSuspendInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
    formdata['InvoiceSuspendText'] = this.storeData['formGroup'].typeB.controls['InvoiceSuspendText'] && this.storeData['formGroup'].typeB.controls['InvoiceSuspendText'].value ? this.storeData['formGroup'].typeB.controls['InvoiceSuspendText'].value : '';
    formdata['HPRLExemptInd'] = this.storeData['formGroup'].typeB.controls['HPRLExemptInd'] && this.storeData['formGroup'].typeB.controls['HPRLExemptInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
    formdata['VADDApproved'] = this.storeData['formGroup'].typeB.controls['VADDApproved'] && this.storeData['formGroup'].typeB.controls['VADDApproved'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
    formdata['ContractOwnerSurname'] = this.storeData['formGroup'].typeC.controls['ContractOwnerSurname'] && this.storeData['formGroup'].typeC.controls['ContractOwnerSurname'].value ? this.storeData['formGroup'].typeC.controls['ContractOwnerSurname'].value : '';
    if (this.storeData['formGroup'].typeD) {
      formdata['PromptPaymentInd'] = this.storeData['formGroup'].typeD.controls['PromptPaymentInd'] && this.storeData['formGroup'].typeD.controls['PromptPaymentInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
      formdata['PromptPaymentRate'] = this.storeData['formGroup'].typeD.controls['PromptPaymentRate'] && this.storeData['formGroup'].typeD.controls['PromptPaymentRate'].value ? this.globalize.parseDecimalToFixedFormat(this.storeData['formGroup'].typeD.controls['PromptPaymentRate'].value, 2) : '';
      formdata['PromptPaymentNarrative'] = this.storeData['formGroup'].typeD.controls['PromptPaymentNarrative'] && this.storeData['formGroup'].typeD.controls['PromptPaymentNarrative'].value ? this.storeData['formGroup'].typeD.controls['PromptPaymentNarrative'].value : '';
      formdata['RetrospectiveInd'] = this.storeData['formGroup'].typeD.controls['RetrospectiveInd'] && this.storeData['formGroup'].typeD.controls['RetrospectiveInd'].value ? GlobalConstant.Configuration.Yes : GlobalConstant.Configuration.No;
      formdata['RetrospectiveRate'] = this.storeData['formGroup'].typeD.controls['RetrospectiveRate'] && this.storeData['formGroup'].typeD.controls['RetrospectiveRate'].value ? this.globalize.parseDecimalToFixedFormat(this.storeData['formGroup'].typeD.controls['RetrospectiveRate'].value, 2) : '';
      formdata['RetrospectiveNarrative'] = this.storeData['formGroup'].typeD.controls['RetrospectiveNarrative'] && this.storeData['formGroup'].typeD.controls['RetrospectiveNarrative'].value ? this.storeData['formGroup'].typeD.controls['RetrospectiveNarrative'].value : '';
    }
    if (this.storeData['formGroup'].typeE) {
      formdata['CICResponseSLA'] = this.storeData['formGroup'].typeE.controls['CICResponseSLA'] && this.storeData['formGroup'].typeE.controls['CICResponseSLA'].value ? this.storeData['formGroup'].typeE.controls['CICResponseSLA'].value : '';
      formdata['CIFirstSLAEscDays'] = this.storeData['formGroup'].typeE.controls['CIFirstSLAEscDays'] && this.storeData['formGroup'].typeE.controls['CIFirstSLAEscDays'].value ? this.storeData['formGroup'].typeE.controls['CIFirstSLAEscDays'].value : '';
      formdata['CISubSLAEscDays'] = this.storeData['formGroup'].typeE.controls['CISubSLAEscDays'] && this.storeData['formGroup'].typeE.controls['CISubSLAEscDays'].value ? this.storeData['formGroup'].typeE.controls['CISubSLAEscDays'].value : '';
    }
    return formdata;
  }

  public lookUpFields(): void {
    let dataReg = [
      {
        'table': 'Account',
        'query': { 'BusinessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode(), 'AccountNumber': this.contractFormGroup.controls['AccountNumber'] ? this.contractFormGroup.controls['AccountNumber'].value : '' },
        'fields': ['AccountName', 'AccountNumber', 'NationalAccount', 'AccountBalance']
      },
      {
        'table': 'SystemInvoiceFrequency',
        'query': { 'InvoiceFrequencyCode': this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'] ? this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].value : '' },
        'fields': ['InvoiceFrequencyCode', 'InvoiceFrequencyDesc']
      },
      {
        'table': 'InvoiceFee',
        'query': { 'InvoiceFeeCode': this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'] ? this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].value : '' },
        'fields': ['InvoiceFeeDesc']
      },
      {
        'table': 'PaymentType',
        'query': { 'PaymentTypeCode': this.storeData['formGroup'].typeB.controls['PaymentTypeCode'] ? this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].value : '' },
        'fields': ['PaymentDesc']
      },
      {
        'table': 'Employee',
        'query': { 'EmployeeCode': this.storeData['formGroup'].typeC.controls['SalesEmployee'] ? this.storeData['formGroup'].typeC.controls['SalesEmployee'].value : '' },
        'fields': ['EmployeeSurname']
      },
      {
        'table': 'GroupAccountPriceGroup',
        'query': {
          'GroupAccountPriceGroupID': this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'] ? this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value : '',
          'GroupAccountNumber': this.storeData['formGroup'].main.controls['GroupAccountNumber'].value
        },
        'fields': ['GroupAccountPriceGroupDesc']
      }];

    Observable.forkJoin(
      this.lookUpRecord(dataReg, 100)
    ).subscribe((data) => {
      if (data[0] && !data[0]['errorMessage']) {
        if (data[0]['results'] && data[0]['results'][0].length > 0) {
          if (data[0]['results'][0][0].NationalAccount) {
            if (data[0]['results'][0][0].NationalAccount === true || data[0]['results'][0][0].NationalAccount.toString().toUpperCase() === GlobalConstant.Configuration.Yes) {
              this.isNationalAccount = true;
            } else {
              this.isNationalAccount = false;
            }
          } else {
            this.isNationalAccount = false;
          }
          this.contractFormGroup.controls['AccountBalance'].setValue(data[0]['results'][0][0].AccountBalance);
          this.contractFormGroup.controls['AccountName'].setValue(data[0]['results'][0][0].AccountName);
        }
        if (data[0]['results'] && data[0]['results'][1].length > 0) {

          if (data[0]['results'][1][0]) {
            this.storeData['formGroup'].typeB.controls['InvoiceFrequencyDesc'].setValue(data[0]['results'][1][0]['InvoiceFrequencyDesc']);
          }
        }

        if (data[0]['results'] && data[0]['results'][2].length > 0) {
          if (data[0]['results'][2][0]) {
            this.storeData['formGroup'].typeB.controls['InvoiceFeeDesc'].setValue(data[0]['results'][2][0]['InvoiceFeeDesc']);
          }
        }

        if (data[0]['results'] && data[0]['results'][3].length > 0) {
          if (data[0]['results'][3][0]) {
            this.storeData['formGroup'].typeB.controls['PaymentDesc'].setValue(data[0]['results'][3][0]['PaymentDesc']);
          }
        }

        if (data[0]['results'] && data[0]['results'][4].length > 0) {
          if (data[0]['results'][4][0]) {
            this.storeData['formGroup'].typeC.controls['SalesEmployeeSurname'].setValue(data[0]['results'][4][0]['EmployeeSurname']);
          }
        }

        if (data[0]['results'] && data[0]['results'][5].length > 0) {
          if (data[0]['results'][5][0]) {
            this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupDesc'].setValue(data[0]['results'][5][0]['GroupAccountPriceGroupDesc']);
          }
        }
      }
    });
  }

  public setDataForPremise(): void {
    let data = new NavData();
    data.setPageId(PageIdentifier.ICABSACONTRACTMAINTENANCE);
    data.setBackRoute(this.currentRouteUrl);
    data.setFormData(Object.assign({}, this.storeData['formGroup'].main.getRawValue(), this.storeData['formGroup'].typeA.getRawValue(), this.storeData['formGroup'].typeB.getRawValue(), this.storeData['formGroup'].typeC.getRawValue(), this.storeData['formGroup'].typeD ? this.storeData['formGroup'].typeD.getRawValue() : {}, this.storeData['formGroup'].typeE ? this.storeData['formGroup'].typeE.getRawValue() : {}));
    this.riExchange.pushInNavigationData(data);
  }

  public riMaintenanceBeforeAdd(): void {
    if (this.sysCharParams['vSCMultiContactInd']) {
      this.storeData['fieldVisibility'].typeA.btnAmendContact = false;
    }
    if (this.sysCharParams['vSCEnableTrialPeriodServices'] === true) {
      //this.displayList.trialPeriodInd = true; Commenting because Trial period is always off in existing app
    } else {
      this.displayList.trialPeriodInd = false;
    }
    this.storeData['fieldRequired'].typeA.countryCode = true;
    this.storeData['fieldRequired'].typeB.invoiceFrequencyCode = true;
    this.storeData['fieldRequired'].typeB.advanceInvoiceInd = true;
    this.storeData['fieldRequired'].typeB.advanceInvoiceInd = true;
    if (this.storeData['params']['currentContractType'] === 'C') {
      this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].setValidators(Validators.required);
      this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].setValidators(Validators.required);
    }
    this.storeData['fieldRequired'].typeB.minimumDurationCode = true;
    this.storeData['fieldRequired'].typeB.minimumExpiryDate = true;
    this.storeData['fieldRequired'].typeB.paymentTypeCode = true;
  }

  public riMaintenanceBeforeSaveAdd(): void {
    if (this.contractFormGroup.controls['TrialPeriodInd'] && this.contractFormGroup.controls['TrialPeriodInd'].value === true) {
      this.storeData['fieldRequired'].typeA.countryCode = false;
      this.storeData['fieldRequired'].typeB.advanceInvoiceInd = false;
      this.storeData['fieldRequired'].typeB.invoiceFrequencyCode = false;
      this.storeData['fieldRequired'].typeB.minimumDurationCode = false;
      this.storeData['fieldRequired'].typeB.minimumExpiryDate = false;
      this.storeData['fieldRequired'].typeB.paymentTypeCode = false;
      this.storeData['fieldRequired'].typeC.noticePeriod = false;
      this.storeData['formGroup'].typeB.controls['AdvanceInvoiceInd'].clearValidators();
      this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].clearValidators();
      this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].clearValidators();
      this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].clearValidators();
      this.storeData['formGroup'].typeC.controls['NoticePeriod'].clearValidators();
      this.storeData['formGroup'].typeB.updateValueAndValidity();
      this.storeData['formGroup'].typeC.updateValueAndValidity();
    } else {
      this.storeData['fieldRequired'].typeA.countryCode = true;
      this.storeData['fieldRequired'].typeB.advanceInvoiceInd = true;
      this.storeData['fieldRequired'].typeB.invoiceFrequencyCode = true;
      this.storeData['fieldRequired'].typeB.minimumDurationCode = true;
      this.storeData['fieldRequired'].typeB.minimumExpiryDate = true;
      if (this.sysCharParams['vSCEnablePayTypeAtInvGroupLevel']) {
        if (this.contractFormGroup.controls['AccountNumber'] && (this.contractFormGroup.controls['AccountNumber'].value === '' || this.contractFormGroup.controls['AccountNumber'].value === null || this.contractFormGroup.controls['AccountNumber'].value === undefined)) {
          this.storeData['fieldRequired'].typeB.paymentTypeCode = true;
          this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].setValidators(Validators.required);
        } else {
          this.storeData['fieldRequired'].typeB.paymentTypeCode = false;
          this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].clearValidators();
        }
      } else {
        this.storeData['fieldRequired'].typeB.paymentTypeCode = true;
        this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].setValidators(Validators.required);
      }
      this.storeData['fieldRequired'].typeC.noticePeriod = false;
      this.storeData['formGroup'].typeB.controls['AdvanceInvoiceInd'].setValidators(Validators.required);
      this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].setValidators(Validators.required);
      this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].setValidators(Validators.required);
      this.storeData['formGroup'].typeB.updateValueAndValidity();
      this.storeData['formGroup'].typeC.updateValueAndValidity();
    }
    this.ajaxSource.next(this.ajaxconstant.START);
    Observable.forkJoin(
      this.fetchContractData('WarnCommenceDate', {
        action: '6',
        ContractCommenceDate: this.commenceDateDisplay
      }),
      this.fetchContractData('CheckPostcode', {
        action: '6',
        ContractName: this.contractFormGroup.controls['ContractName'] && this.contractFormGroup.controls['ContractName'] !== undefined ? this.contractFormGroup.controls['ContractName'].value : '',
        ContractAddressLine1: this.storeData['formGroup'].typeA.controls['ContractAddressLine1'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine1'].value !== undefined && this.storeData['formGroup'].typeA.controls['ContractAddressLine1'].value !== '' ? this.storeData['formGroup'].typeA.controls['ContractAddressLine1'].value : null,
        ContractAddressLine2: this.storeData['formGroup'].typeA.controls['ContractAddressLine2'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine2'].value !== undefined && this.storeData['formGroup'].typeA.controls['ContractAddressLine2'].value !== '' ? this.storeData['formGroup'].typeA.controls['ContractAddressLine2'].value : null,
        ContractAddressLine3: this.storeData['formGroup'].typeA.controls['ContractAddressLine3'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine3'].value !== undefined && this.storeData['formGroup'].typeA.controls['ContractAddressLine3'].value !== '' ? this.storeData['formGroup'].typeA.controls['ContractAddressLine3'].value : null,
        ContractAddressLine4: this.storeData['formGroup'].typeA.controls['ContractAddressLine4'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== undefined && this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== '' ? this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value : null,
        ContractAddressLine5: this.storeData['formGroup'].typeA.controls['ContractAddressLine5'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== undefined && this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== '' ? this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value : null,
        ContractPostcode: this.storeData['formGroup'].typeA.controls['ContractPostcode'] && this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== undefined && this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== '' ? this.storeData['formGroup'].typeA.controls['ContractPostcode'].value : null
      }),
      this.fetchContractData('CheckPostcodeNegBranch', {
        action: '6',
        NegBranchNumber: this.contractFormGroup.controls['NegBranchNumber'] && this.contractFormGroup.controls['NegBranchNumber'].value !== undefined ? this.contractFormGroup.controls['NegBranchNumber'].value : '',
        ContractAddressLine4: this.storeData['formGroup'].typeA.controls['ContractAddressLine4'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value : '',
        ContractAddressLine5: this.storeData['formGroup'].typeA.controls['ContractAddressLine5'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value : '',
        ContractPostcode: this.storeData['formGroup'].typeA.controls['ContractPostcode'] && this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractPostcode'].value : ''
      }),
      this.fetchContractData('WarnPostcode', {
        action: '6',
        NegBranchNumber: this.contractFormGroup.controls['NegBranchNumber'] && this.contractFormGroup.controls['NegBranchNumber'].value !== undefined ? this.contractFormGroup.controls['NegBranchNumber'].value : '',
        AccountNumber: this.contractFormGroup.controls['AccountNumber'] && this.contractFormGroup.controls['AccountNumber'].value !== undefined ? this.contractFormGroup.controls['AccountNumber'].value : '',
        ContractTypeCode: this.storeData['params'] && this.storeData['params']['currentContractType'] !== undefined ? this.storeData['params']['currentContractType'] : ''
      }),
      this.fetchContractData('CheckNatAcc', {
        action: '6',
        NegBranchNumber: this.contractFormGroup.controls['NegBranchNumber'] && this.contractFormGroup.controls['NegBranchNumber'].value !== undefined ? this.contractFormGroup.controls['NegBranchNumber'].value : '',
        AccountNumber: this.contractFormGroup.controls['AccountNumber'] && this.contractFormGroup.controls['AccountNumber'].value !== undefined ? this.contractFormGroup.controls['AccountNumber'].value : '',
        ContractTypeCode: this.storeData['params'] && this.storeData['params']['currentContractType'] !== undefined ? this.storeData['params']['currentContractType'] : ''
      })
    ).subscribe((data) => {
      this.ajaxSource.next(this.ajaxconstant.COMPLETE);
      let errorDesc = [];
      let fullError = [];
      let errorInAjax: Object = {
        ajax1: false,
        ajax2: false,
        ajax3: false,
        ajax4: false,
        ajax5: false
      };
      if (data[0]['status'] && data[0]['status'].toUpperCase() === ErrorConstant.Message.Failure) {
        this.errorService.emitError(data[0]['oResponse']);
        return;
      }
      if (data[1]['status'] && data[1]['status'].toUpperCase() === ErrorConstant.Message.Failure) {
        this.errorService.emitError(data[1]['oResponse']);
        return;
      }
      if (data[2]['status'] && data[2]['status'].toUpperCase() === ErrorConstant.Message.Failure) {
        this.errorService.emitError(data[2]['oResponse']);
        return;
      }
      if (data[3]['status'] && data[3]['status'].toUpperCase() === ErrorConstant.Message.Failure) {
        this.errorService.emitError(data[3]['oResponse']);
        return;
      }
      if (data[4]['status'] && data[4]['status'].toUpperCase() === ErrorConstant.Message.Failure) {
        this.errorService.emitError(data[4]['oResponse']);
        return;
      }
      if (data[0]['ErrorMessageDesc'] && data[0]['ErrorMessageDesc'] !== '') {
        errorDesc.push(data[0]['ErrorMessageDesc']);
        errorInAjax['ajax1'] = true;
      } else if (data[0]['fullError'] && data[0]['fullError'] !== '') {
        errorDesc.push(data[0]['errorMessage']);
        fullError.push(data[0]['fullError']);
      }
      if (this.contractFormGroup.controls['AccountNumber'].value !== '') {
        if (data[1]['ErrorMessageDesc'] && data[1]['ErrorMessageDesc'] !== '') {
          if (this.sysCharParams['vSCPostCodeMustExistInPAF'] && (this.sysCharParams['vSCEnableHopewiserPAF'] || this.sysCharParams['vSCEnableDatabasePAF'])) {
            errorDesc.push(data[1]['ErrorMessageDesc']);
            errorInAjax['ajax2'] = true;
          }
        } else if (data[1]['fullError'] && data[1]['fullError'] !== '') {
          if (this.sysCharParams['vSCPostCodeMustExistInPAF'] && (this.sysCharParams['vSCEnableHopewiserPAF'] || this.sysCharParams['vSCEnableDatabasePAF'])) {
            errorDesc.push(data[1]['errorMessage']);
            fullError.push(data[1]['fullError']);
            //errorInAjax['ajax2'] = true;
          }
        }
        if (data[2]['ErrorMessageDesc'] && data[2]['ErrorMessageDesc'] !== '') {
          if (this.sysCharParams['vEnablePostcodeDefaulting'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== '' && this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== '' && this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== '') {
            errorDesc.push(data[2]['ErrorMessageDesc']);
            errorInAjax['ajax3'] = true;

          }
        } else if (data[2]['fullError'] && data[2]['fullError'] !== '') {
          if (this.sysCharParams['vEnablePostcodeDefaulting'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== '' && this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== '' && this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== '') {
            errorDesc.push(data[2]['errorMessage']);
            fullError.push(data[2]['fullError']);
            //errorInAjax['ajax3'] = true;

          }
        }
        if (data[3]['ErrorMessageDesc'] && data[3]['ErrorMessageDesc'] !== '') {
          errorDesc.push(data[3]['ErrorMessageDesc']);
          //errorInAjax['ajax4'] = true;

        } else if (data[3]['fullError'] && data[3]['fullError'] !== '') {
          errorDesc.push(data[3]['errorMessage']);
          fullError.push(data[3]['fullError']);
          errorInAjax['ajax4'] = true;

        }
        if (data[4]['ErrorMessageDesc'] && data[4]['ErrorMessageDesc'] !== '') {
          errorDesc.push(data[4]['ErrorMessageDesc']);
          //errorInAjax['ajax5'] = true;
        } else if (data[4]['fullError'] && data[4]['fullError'] !== '') {
          errorDesc.push(data[4]['errorMessage']);
          fullError.push(data[4]['fullError']);
          errorInAjax['ajax5'] = true;
        }
      } else {
        if (data[1]['ErrorMessageDesc'] && data[1]['ErrorMessageDesc'] !== '') {
          if (this.sysCharParams['vSCPostCodeMustExistInPAF'] && (this.sysCharParams['vSCEnableHopewiserPAF'] || this.sysCharParams['vSCEnableDatabasePAF'])) {
            errorDesc.push(data[1]['ErrorMessageDesc']);
            errorInAjax['ajax2'] = true;
          }
        } else if (data[1]['fullError'] && data[1]['fullError'] !== '') {
          if (this.sysCharParams['vSCPostCodeMustExistInPAF'] && (this.sysCharParams['vSCEnableHopewiserPAF'] || this.sysCharParams['vSCEnableDatabasePAF'])) {
            errorDesc.push(data[1]['errorMessage']);
            fullError.push(data[1]['fullError']);
            errorInAjax['ajax2'] = true;
          }
        }
        if (data[2]['ErrorMessageDesc'] && data[2]['ErrorMessageDesc'] !== '') {
          if (this.sysCharParams['vEnablePostcodeDefaulting'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== '' && this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== '' && this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== '') {
            errorDesc.push(data[2]['ErrorMessageDesc']);
            errorInAjax['ajax3'] = true;

          }
        } else if (data[2]['fullError'] && data[2]['fullError'] !== '') {
          if (this.sysCharParams['vEnablePostcodeDefaulting'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== '' && this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== '' && this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== '') {
            errorDesc.push(data[2]['errorMessage']);
            fullError.push(data[2]['fullError']);
            errorInAjax['ajax3'] = true;

          }
        }
      }
      if (this.dataEventCheckPostcodeNegBranch) {
        this.dataEventCheckPostcodeNegBranch.unsubscribe();
      }
      if (this.dataEventCheckPostcode) {
        this.dataEventCheckPostcode.unsubscribe();
      }
      if (this.dataEventWarnPostcode) {
        this.dataEventWarnPostcode.unsubscribe();
      }
      if (this.dataEventCheckNatAcc) {
        this.dataEventCheckNatAcc.unsubscribe();
      }
      if (errorDesc && errorDesc.length > 0) {
        if (fullError.length > 0) {
          this.errorService.emitError({
            errorMessage: errorDesc,
            fullError: fullError
          });
        } else {
          this.errorService.emitError({
            errorMessage: errorDesc
          });
        }

        this.beforeSave = true;
        this.shiftTop = true;
        if (errorInAjax['ajax2'] === true && errorInAjax['ajax3'] === true) {
          return;
        }
        if (errorInAjax['ajax4'] === true || errorInAjax['ajax5'] === true) {
          return;
        }
        //return;
      } else {
        this.shiftTop = false;
      }
      this.promptConfirmModal.show();

    }, (error) => {
      this.ajaxSource.next(this.ajaxconstant.COMPLETE);
      this.errorService.emitError({
        errorMessage: error['errorMessage'] || ErrorConstant.Message.UnexpectedError,
        fullError: error['fullError']
      });
      return;
    });
  }

  public errorModalClose(): void {
    this.beforeSave = false;
  }

  public riMaintenanceBeforeSaveUpdate(): void {
    if (this.contractFormGroup.controls['TrialPeriodInd'] && this.contractFormGroup.controls['TrialPeriodInd'].value) {
      this.otherParams['vSaveUpdate'] = true;
    }
    this.onTrialPeriodIndChange({});
    let errorDesc = [];
    this.ajaxSource.next(this.ajaxconstant.START);
    Observable.forkJoin(this.fetchContractData('CheckPostcodeNegBranch', {
      action: '6',
      NegBranchNumber: this.contractFormGroup.controls['NegBranchNumber'] && this.contractFormGroup.controls['NegBranchNumber'].value !== undefined ? this.contractFormGroup.controls['NegBranchNumber'].value : '',
      ContractAddressLine4: this.storeData['formGroup'].typeA.controls['ContractAddressLine4'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value : '',
      ContractAddressLine5: this.storeData['formGroup'].typeA.controls['ContractAddressLine5'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value : '',
      ContractPostcode: this.storeData['formGroup'].typeA.controls['ContractPostcode'] && this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractPostcode'].value : ''
    }),
      this.fetchContractData('WarnMandateRef', {
        action: '6',
        ContractNumber: this.contractFormGroup.controls['ContractNumber'] && this.contractFormGroup.controls['ContractNumber'].value !== undefined ? this.contractFormGroup.controls['ContractNumber'].value : '',
        CompanyCode: this.storeData['formGroup'].typeC.controls['CompanyCode'] && this.storeData['formGroup'].typeC.controls['CompanyCode'].value !== undefined ? this.storeData['formGroup'].typeC.controls['CompanyCode'].value : ''
      })).subscribe((data) => {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        if (this.sysCharParams['vEnablePostcodeDefaulting']) {
          if (data[0]['status'] && data[0]['status'].toUpperCase() === ErrorConstant.Message.Failure) {
            this.errorService.emitError(data[0]['oResponse']);
            return;
          }
          if (data[0]['ErrorMessageDesc'] && data[0]['ErrorMessageDesc'] !== '') {
            if (this.sysCharParams['vEnablePostcodeDefaulting']) {
              errorDesc.push(data[0]['ErrorMessageDesc']);
            }
          }
        }
        if (this.sysCharParams['vSCEnableBankDetailEntry'] && this.sysCharParams['vSCEnableSEPAFinanceMandate'] && !this.sysCharParams['vSCEnableSEPAFinanceMandateLog']) {
          if (data[1]['status'] && data[1]['status'].toUpperCase() === ErrorConstant.Message.Failure) {
            this.errorService.emitError(data[1]['oResponse']);
            return;
          }
          if (data[1]['ErrorMessageDesc'] && data[1]['ErrorMessageDesc'] !== '') {
            if (this.sysCharParams['vSCEnableBankDetailEntry'] && this.sysCharParams['vSCEnableSEPAFinanceMandate'] && !this.sysCharParams['vSCEnableSEPAFinanceMandateLog']) {
              errorDesc.push(data[1]['ErrorMessageDesc']);
            }
          } else if (data[1]['fullError'] && data[1]['fullError'] !== '') {
            if (this.sysCharParams['vSCEnableBankDetailEntry'] && this.sysCharParams['vSCEnableSEPAFinanceMandate'] && !this.sysCharParams['vSCEnableSEPAFinanceMandateLog']) {
              errorDesc.push(data[1]['errorMessage'] || data[1]['fullError']);
            }
          }
        }
        if (errorDesc && errorDesc.length > 0) {
          this.errorService.emitError({
            errorMessage: errorDesc
          });
          this.beforeSave = true;
          this.shiftTop = true;
          //return;
        } else {
          this.shiftTop = false;
        }
        this.promptConfirmModal.show();
        if (this.dataEventCheckPostcodeNegBranch) {
          this.dataEventCheckPostcodeNegBranch.unsubscribe();
        }
      }, (error) => {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        this.errorService.emitError({
          errorMessage: error['errorMessage'] || ErrorConstant.Message.UnexpectedError,
          fullError: error['fullError']
        });

        return;
      });
  }

  public riMaintenanceAfterSaveAdd(): void {
    // to be added
  }

  public riMaintenanceAfterSave(): void {
    if (this.sysCharParams['vSCMultiContactInd']) {
      this.storeData['fieldVisibility'].typeA.btnAmendContact = false;
    }
    if (this.sysCharParams['vSCEnableMarktSelect']) {
      this.promptTitle = MessageConstant.Message.SaveContractAddressAsAccountAddress;
      this.promptModal.show();
    }
    if (this.otherParams['blnCIEnabled']) {
      this.store.dispatch({
        type: ContractActionTypes.AFTER_SAVE, payload: {

        }
      });
    }
    //this.afterFetch();
  }

  public afterFetch(): void {
    if (this.sysCharParams['vSCMultiContactInd']) {
      this.storeData['fieldVisibility'].typeA.btnAmendContact = true;
    }
    if (this.contractFormGroup.controls['ContractNumber'].value) {
      if (this.inactiveEffectDateDisplay) {
        this.displayList.inactiveEffectDate = true;
        if (this.contractFormGroup.controls['LostBusinessDesc'] && this.contractFormGroup.controls['LostBusinessDesc'].value !== '') {
          this.displayList.lostBusinessDesc1 = true;
          //this.contractFormGroup.controls['LostBusinessDesc'].setValue(this.contractFormGroup.controls['LostBusinessDesc2'].value + ' ' + this.contractFormGroup.controls['LostBusinessDesc3'].value);
        }
      } else {
        this.displayList.inactiveEffectDate = false;
      }

      if (this.contractFormGroup.controls['AnyPendingBelow'] && this.contractFormGroup.controls['AnyPendingBelow'].value !== '') {
        this.displayList.anyPendingBelow = true;
      } else {
        this.displayList.anyPendingBelow = false;
      }
    } else {
      this.storeData['fieldVisibility'].typeB.apiExemptInd = false;
    }
    if (!this.sysCharParams['glAllowUserAuthView']) {
      this.displayList.contractAnnualValue = false;
    } else {
      this.displayList.contractAnnualValue = true;
    }

    if (this.otherParams['ReqAutoInvoiceFee'] && this.storeData['params']['currentContractType'] === 'C' && this.storeData['mode'].addMode) {
      this.storeData['fieldVisibility'].typeB.invoiceFeeCode = true;
      this.storeData['fieldRequired'].typeB.invoiceFeeCode = true;
      if (this.storeData['formGroup'].typeB.controls['InvoiceFeeCode']) {
        this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].setValidators(Validators.required);
      }
    } else {
      this.storeData['fieldVisibility'].typeB.invoiceFeeCode = false;
      this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].clearValidators();
    }
    this.storeData['formGroup'].typeB.updateValueAndValidity();
    if (this.contractFormGroup.controls['ContractHasExpired'] && this.contractFormGroup.controls['ContractHasExpired'].value === true) {
      this.displayList.expired = true;
    } else {
      this.displayList.expired = false;
    }
    if (this.sysCharParams['vSCEnablePayTypeAtInvGroupLevel']) {
      this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].clearValidators();
      this.storeData['fieldVisibility'].typeB.paymentTypeCode = false;
      this.storeData['fieldRequired'].typeB.paymentTypeCode = false;
    }

  }

  public promptCancel(event: any): void {
    if (this.addMode)
      this.navigateToPremiseMaintenance();
  }

  public promptSave(event: any): void {
    let formdata = {
      AccountNumber: this.contractFormGroup.controls['AccountNumber'] ? this.contractFormGroup.controls['AccountNumber'].value : '',
      ContractAddressLine1: this.storeData['formGroup'].typeA.controls['ContractAddressLine1'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine1'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractAddressLine1'].value : '',
      ContractAddressLine2: this.storeData['formGroup'].typeA.controls['ContractAddressLine2'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine2'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractAddressLine2'].value : '',
      ContractAddressLine3: this.storeData['formGroup'].typeA.controls['ContractAddressLine3'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine3'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractAddressLine3'].value : '',
      ContractAddressLine4: this.storeData['formGroup'].typeA.controls['ContractAddressLine4'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value : '',
      ContractAddressLine5: this.storeData['formGroup'].typeA.controls['ContractAddressLine5'] && this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value : '',
      ContractPostcode: this.storeData['formGroup'].typeA.controls['ContractPostcode'] && this.storeData['formGroup'].typeA.controls['ContractPostcode'].value !== undefined ? this.storeData['formGroup'].typeA.controls['ContractPostcode'].value : '',
      CountryCode: this.storeData['formGroup'].typeA.controls['CountryCode'] && this.storeData['formGroup'].typeA.controls['CountryCode'].value !== undefined ? this.storeData['formGroup'].typeA.controls['CountryCode'].value : '',
      Function: 'UpdateAccountAddress'
    };

    this.queryContract = new URLSearchParams();
    this.queryContract.set(this.serviceConstants.BusinessCode, this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
    this.queryContract.set(this.serviceConstants.CountryCode, this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
    this.queryContract.set(this.serviceConstants.Action, '6');
    this.httpService.makePostRequest(this.queryParamsContract.method, this.queryParamsContract.module, this.queryParamsContract.operation, this.queryContract, formdata).subscribe(
      (e) => {
        if (e.status === GlobalConstant.Configuration.Failure) {
          this.errorService.emitError(e.oResponse);
          if (this.addMode)
            this.navigateToPremiseMaintenance();
        } else {
          if (e['errorMessage']) {
            this.errorService.emitError(e);
            if (this.addMode)
              this.navigateToPremiseMaintenance();
            return;
          } else {
            if (this.addMode)
              this.navigateToPremiseMaintenance();
          }
        }

      },
      (error) => {
        this.errorService.emitError(error);
        if (this.addMode)
          this.navigateToPremiseMaintenance();
      }
    );
  }

  public navigateToPremiseMaintenance(): void {
    this.navigateToPremise = true;
    this.setDataForPremise();
    this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
      queryParams: {
        parentMode: 'Contract-Add',
        ContractNumber: this.contractFormGroup.controls['ContractNumber'].value,
        // ContractName: this.contractFormGroup.controls['ContractName'].value,
        AccountNumber: this.contractFormGroup.controls['AccountNumber'].value,
        AccountName: this.contractFormGroup.controls['AccountName'].value,
        contractTypeCode: this.inputParams.currentContractType
      }
    });
  }

  public promptConfirmSave(event: any): void {
    if (this.addMode) {
      this.addContract();
    } else if (this.updateMode) {
      this.updateContract();
    }
  }

  public onContractDataReceived(data: any, route: boolean, mode?: any): void {
    let dataObj = {
      data: data
    };
    if (this.isCopyClicked) {
      //this.fetchContractCopy(dataObj['data'].ContractNumber);
      this.updateMode = false;
      this.addMode = true;
      this.searchMode = false;
      this.autoOpenSearch = false;
      this.store.dispatch({
        type: ContractActionTypes.FORM_GROUP, payload: {
          main: this.contractFormGroup
        }
      });
      data['isCopyClicked'] = true;
      this.setFormData(dataObj);
      this.store.dispatch({ type: ContractActionTypes.SAVE_DATA, payload: data });
      this.contractSearchParams['business'] = '';
      this.contractSearchParams['country'] = '';
      this.ajaxSource.next(this.ajaxconstant.START);
      this.fetchContractData('', { ContractNumber: dataObj['data'].ContractNumber }).subscribe((data) => {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        if (data['status'] === GlobalConstant.Configuration.Failure) {
          this.errorService.emitError(data['oResponse']);
        } else {
          if (data['errorMessage']) {
            this.errorService.emitError({
              errorMessage: data['errorMessage'] || ErrorConstant.Message.UnexpectedError,
              fullError: data['fullError']
            });
          } else {
            data['isCopyClicked'] = true;
            this.onAccountBlur({});
            this.store.dispatch({ type: ContractActionTypes.SAVE_DATA, payload: data });
            this.contractFormGroup.controls['ContractNumber'].setValue('');
            this.store.dispatch({ type: ContractActionTypes.LOOKUP, payload: data });
          }
        }
        setTimeout(() => {
          this.isCopyClicked = false;
        }, 0);
      }, (error) => {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        this.errorService.emitError({
          errorMessage: error['errorMessage'] || ErrorConstant.Message.UnexpectedError,
          fullError: error['fullError']
        });
        setTimeout(() => {
          this.isCopyClicked = false;
        }, 0);
      }
      );
      return;
    }
    this.updateMode = true;
    this.addMode = false;
    this.searchMode = false;
    this.autoOpenSearch = false;
    this.store.dispatch({
      type: ContractActionTypes.FORM_GROUP, payload: {
        main: this.contractFormGroup
      }
    });
    this.contractSearchParams['business'] = '';
    this.contractSearchParams['country'] = '';
    this.setDefaultFormState();
    this.setFormData(dataObj);
    this.store.dispatch({ type: ContractActionTypes.SAVE_DATA, payload: data });
    let userCode = this.authService.getSavedUserCode();
    let dataReg = [{
      'table': 'riRegistry',
      'query': { 'RegSection': 'Contact Person' },
      'fields': ['RegSection']
    },
    {
      'table': 'riRegistry',
      'query': { 'RegSection': 'Contact Centre Review', 'RegKey': this.storeData['code'].business + '_' + 'System Default Review From Drill Option' },
      'fields': ['RegSection', 'RegValue']
    },
    {
      'table': 'CIParams',
      'query': { 'BusinessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode() },
      'fields': ['BusinessCode', 'CIEnabled']
    },
    {
      'table': 'Account',
      'query': { 'BusinessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode(), 'AccountNumber': this.contractFormGroup.controls['AccountNumber'] ? this.contractFormGroup.controls['AccountNumber'].value : '' },
      'fields': ['AccountName', 'AccountNumber', 'NationalAccount', 'AccountBalance']
    },
    {
      'table': 'Branch',
      'query': { 'BusinessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode() },
      'fields': ['BranchNumber', 'BranchName', 'EnablePostCodeDefaulting']
    },
    {
      'table': 'UserAuthorityBranch',
      'query': { 'UserCode': userCode.UserCode, 'BusinessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode(), 'DefaultBranchInd': 'true' },
      'fields': ['BranchNumber', 'DefaultBranchInd', 'CurrentBranchInd']
    }];
    this.ajaxSource.next(this.ajaxconstant.START);
    Observable.forkJoin(
      this.triggerFetchSysChar(false, true),
      this.lookUpRecord(dataReg, 100),
      this.fetchContractData('', { ContractNumber: dataObj['data'].ContractNumber })
    ).subscribe((data) => {
      this.ajaxSource.next(this.ajaxconstant.COMPLETE);
      if (data[0]['errorMessage']) {
        this.errorService.emitError({
          errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
        });
        //return false;
      }
      if (!data[0]['records']) {
        this.errorService.emitError({
          errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
        });
        return;
      }
      this.onSysCharDataReceive(data[0]);
      if (data[1]['results'] && data[1]['results'].length > 0) {
        if (data[1]['results'][0].length > 0 && data[1]['results'][0][0]) {
          this.sysCharParams['vSCMultiContactInd'] = true;
        } else {
          this.sysCharParams['vSCMultiContactInd'] = false;
        }
        this.buildMenuOptions();
        if (data[1]['results'][1].length > 0 && data[1]['results'][1][0]) {
          this.sysCharParams['gcREGContactCentreReview'] = data[1]['results'][1][0].RegValue;
          if (this.sysCharParams['gcREGContactCentreReview'] === 'Y') {
            this.otherParams['lREGContactCentreReview'] = true;
          } else {
            this.otherParams['lREGContactCentreReview'] = false;
          }
        }
        if (data[1]['results'][2].length > 0) {
          let tabs, componentList;
          tabs = [
            { title: 'Address', active: true },
            { title: 'Invoice', disabled: false },
            { title: 'General', removable: false }
          ];
          componentList = [MaintenanceTypeAComponent, MaintenanceTypeBComponent, MaintenanceTypeCComponent];
          this.otherParams['blnCIEnabled'] = data[1]['results'][2][0].CIEnabled;
          if (this.sysCharParams['vSCAccountDiscounts']) {
            tabs.push({ title: 'Discounts', customClass: '' });
            componentList.push(MaintenanceTypeDComponent);
            this.tabsToCheck['tabD'] = true;
          } else {
            this.tabsToCheck['tabD'] = false;
          }
          if (this.otherParams['blnCIEnabled']) {
            tabs.push({ title: 'Customer Integration', customClass: '' });
            componentList.push(MaintenanceTypeEComponent);
            this.tabsToCheck['tabE'] = true;
          } else {
            this.tabsToCheck['tabE'] = false;
          }

          if (tabs.length !== this.tabs.length || (tabs.length === this.tabs.length && tabs.length === 4 && tabs[3].title !== this.tabs[3].title)) {
            this.tabs = tabs;
            this.componentList = componentList;

          }
        }

        if (data[1]['results'][3].length > 0) {
          if (data[1]['results'][3][0].NationalAccount) {
            if (data[1]['results'][3][0].NationalAccount === true || data[1]['results'][3][0].NationalAccount.toString().toUpperCase() === GlobalConstant.Configuration.Yes) {
              this.isNationalAccount = true;
            } else {
              this.isNationalAccount = false;
            }
          } else {
            this.isNationalAccount = false;
          }
          this.contractFormGroup.controls['AccountBalance'].setValue(data[1]['results'][3][0].AccountBalance);
        }

        if (data[1]['results'][4].length > 0 && data[1]['results'][4][0]) {
          for (let k = 0; k < data[1]['results'][4].length; k++) {
            this.branchList.push(JSON.parse(JSON.stringify({
              branchNumber: data[1]['results'][4][k].BranchNumber,
              branchName: data[1]['results'][4][k].BranchName
            })));
            if (!data[1]['results'][4][k].EnablePostCodeDefaulting) {
              this.sysCharParams['vExcludedBranches'].push(data[1]['results'][4][k].BranchNumber);
            }
            if (data[1]['results'][4][k].BranchNumber === this.queryParams.branchNumber) {
              this.queryParams.branchName = data[1]['results'][4][k].BranchName;
            }
          }
        }
        this.queryParams.branchNumber = this.cbb.getBranchCode();
        this.otherParams['currentBranchNumber'] = this.cbb.getBranchCode();
        if (data[1]['results'][5].length > 0 && data[1]['results'][5][0] && !this.queryParams.branchNumber) {
          for (let i = 0; i < data[1]['results'][5].length; i++) {
            if (data[1]['results'][5][i].DefaultBranchInd) {
              this.queryParams.branchNumber = data[1]['results'][5][i].BranchNumber;
              this.otherParams['currentBranchNumber'] = data[1]['results'][5][i].BranchNumber;
            }
          }
        }
      } else {
        this.sysCharParams['vSCMultiContactInd'] = false;
      }

      setTimeout(() => {
        if (data[2]['status'] === GlobalConstant.Configuration.Failure) {
          this.errorService.emitError(data[2]['oResponse']);
        } else {
          data['isCopyClicked'] = false;
          this.store.dispatch({ type: ContractActionTypes.SAVE_DATA, payload: data[2] });
        }

        if (data[1]['results'] && data[1]['results'].length > 0) {
          if (data[1]['results'][3].length > 0) {
            this.contractFormGroup.controls['AccountName'].setValue(data[1]['results'][3][0].AccountName);
          }
        }
        for (let k = 0; k < this.branchList.length; k++) {
          if (this.branchList[k].branchNumber.toString() === this.contractFormGroup.controls['NegBranchNumber'].value) {
            this.contractFormGroup.controls['BranchName'].setValue(this.branchList[k].branchName);

          }
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        Observable.forkJoin(
          this.lookUpRecord([
            {
              'table': 'Company',
              'query': { 'BusinessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode() },
              'fields': ['DefaultCompanyInd', 'CompanyCode', 'CompanyDesc']
            },
            {
              'table': 'UserAuthority',
              'query': { 'BusinessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode(), 'UserCode': userCode.UserCode },
              'fields': ['AllowViewOfSensitiveInfoInd', 'AllowUpdateOfContractInfoInd']
            },
            {
              'table': 'GroupAccount',
              'query': { 'GroupAccountNumber': this.contractFormGroup.controls['GroupAccountNumber'].value },
              'fields': ['GroupAccountNumber', 'GroupName']
            },
            {
              'table': 'Employee',
              'query': { 'EmployeeCode': this.storeData['formGroup'].typeC.controls['SalesEmployee'] && this.storeData['formGroup'].typeC.controls['SalesEmployee'].value ? this.storeData['formGroup'].typeC.controls['SalesEmployee'].value : '' },
              'fields': ['EmployeeCode', 'EmployeeSurname']
            },
            {
              'table': 'SystemInvoiceFrequency',
              'query': { 'InvoiceFrequencyCode': this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'] && this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].value ? this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].value : '' },
              'fields': ['InvoiceFrequencyCode', 'InvoiceFrequencyDesc']
            },
            {
              'table': 'InvoiceFee',
              'query': { 'InvoiceFeeCode': this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'] && this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].value ? this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].value : '' },
              'fields': ['InvoiceFeeCode', 'InvoiceFeeDesc']
            },
            {
              'table': 'PaymentType',
              'query': { 'PaymentTypeCode': this.storeData['formGroup'].typeB.controls['PaymentTypeCode'] && this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].value ? this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].value : '' },
              'fields': ['PaymentTypeCode', 'PaymentDesc']
            },
            {
              'table': 'GroupAccountPriceGroup',
              'query': { 'GroupAccountPriceGroupID': this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'] && this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value ? this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value : '' },
              'fields': ['GroupAccountPriceGroupID', 'GroupAccountPriceGroupDesc']
            },
            {
              'table': 'Employee',
              'query': { 'EmployeeCode': this.storeData['formGroup'].typeC.controls['ContractOwner'] && this.storeData['formGroup'].typeC.controls['ContractOwner'].value ? this.storeData['formGroup'].typeC.controls['ContractOwner'].value : '' },
              'fields': ['EmployeeCode', 'EmployeeSurname']
            }
          ], 100)).subscribe((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data[0]['results'] && data[0]['results'].length > 0) {
              if (data[0]['results'][0].length > 0) {
                let defaultCompanyCode = '', defaultCompanyDesc = '', obj = {};
                this.otherParams['companyList'] = [];
                this.storeData.otherParams['companyList'] = [];
                for (let i = 0; i < data[0]['results'][0].length; i++) {
                  if (data[0]['results'][0][i].DefaultCompanyInd) {
                    this.sysCharParams['vDefaultCompanyCode'] = data[0]['results'][0][i].CompanyCode;
                    this.sysCharParams['vDefaultCompanyDesc'] = data[0]['results'][0][i].CompanyDesc;
                    this.otherParams['defaultCompanyCode'] = data[0]['results'][0][i].CompanyCode;
                    this.otherParams['defaultCompanyDesc'] = data[0]['results'][0][i].CompanyDesc;
                  }
                  obj = {
                    code: data[0]['results'][0][i].CompanyCode,
                    desc: data[0]['results'][0][i].CompanyDesc
                  };
                  this.otherParams['companyList'].push(obj);
                  this.storeData.otherParams['companyList'].push(obj);
                }
              }

              if (data[0]['results'][1].length > 0) {
                this.sysCharParams['glAllowUserAuthView'] = data[0]['results'][1][0].AllowViewOfSensitiveInfoInd;
                this.sysCharParams['glAllowUserAuthUpdate'] = data[0]['results'][1][0].AllowUpdateOfContractInfoInd;
                if (!this.sysCharParams['glAllowUserAuthUpdate']) {
                  this.displayList.options = false;
                } else {
                  this.displayList.options = true;
                }
                if (!this.sysCharParams['glAllowUserAuthView']) {
                  this.displayList.contractAnnualValue = false;
                } else {
                  this.displayList.contractAnnualValue = true;
                }
              }

              if (data[0]['results'][2].length > 0) {
                this.contractFormGroup.controls['GroupName'].setValue(data[0]['results'][2][0]['GroupName']);
              } else {
                this.contractFormGroup.controls['GroupName'].setValue('');
              }

              if (data[0]['results'][3].length > 0 && this.storeData['formGroup'].typeC.controls['SalesEmployee'].value !== '') {
                this.storeData['formGroup'].typeC.controls['SalesEmployeeSurname'].setValue(data[0]['results'][3][0]['EmployeeSurname']);
              } else {
                this.storeData['formGroup'].typeC.controls['SalesEmployeeSurname'].setValue('');
              }

              if (data[0]['results'][4].length > 0) {
                this.storeData['formGroup'].typeB.controls['InvoiceFrequencyDesc'].setValue(data[0]['results'][4][0]['InvoiceFrequencyDesc']);
              } else {
                this.storeData['formGroup'].typeB.controls['InvoiceFrequencyDesc'].setValue('');
              }

              if (data[0]['results'][5].length > 0) {
                this.storeData['formGroup'].typeB.controls['InvoiceFeeDesc'].setValue(data[0]['results'][5][0]['InvoiceFeeDesc']);
              } else {
                this.storeData['formGroup'].typeB.controls['InvoiceFeeDesc'].setValue('');
              }

              if (data[0]['results'][6].length > 0) {
                this.storeData['formGroup'].typeB.controls['PaymentDesc'].setValue(data[0]['results'][6][0]['PaymentDesc']);
              } else {
                this.storeData['formGroup'].typeB.controls['PaymentDesc'].setValue('');
              }

              if (data[0]['results'][7].length > 0) {
                this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupDesc'].setValue(data[0]['results'][7][0]['GroupAccountPriceGroupDesc']);
              } else {
                this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupDesc'].setValue('');
              }

              if (data[0]['results'][8].length > 0 && this.storeData['formGroup'].typeC.controls['ContractOwner'].value !== '') {
                this.storeData['formGroup'].typeC.controls['ContractOwnerSurname'].setValue(data[0]['results'][8][0]['EmployeeSurname']);
              } else {
                this.storeData['formGroup'].typeC.controls['ContractOwnerSurname'].setValue('');
              }
              setTimeout(() => {
                this.sysCharParams['storage'] = this.sysCharParams['storage'] || {};
                this.sysCharParams['storage'][this.storeData['code'].country + this.storeData['code'].business] = JSON.parse(JSON.stringify(this.sysCharParams));
                this.store.dispatch({ type: ContractActionTypes.SAVE_SYSCHAR, payload: this.sysCharParams });
                this.store.dispatch({ type: ContractActionTypes.SAVE_OTHER_PARAMS, payload: this.otherParams });
                if (mode) {
                  this.updateMode = mode.updateMode;
                  this.addMode = mode.addMode;
                  this.searchMode = mode.searchMode;
                  this.store.dispatch({
                    type: ContractActionTypes.SAVE_MODE, payload: mode
                  });
                  if (mode.searchMode === true) {
                    this.contractFormGroup.controls['ContractNumber'].disable();
                  }
                } else {
                  this.store.dispatch({
                    type: ContractActionTypes.SAVE_MODE, payload:
                    {
                      updateMode: this.updateMode,
                      addMode: this.addMode,
                      searchMode: this.searchMode
                    }
                  });
                }
                this.commenceDateService();
                this.formPristine();
              }, 100);

            }
          }, (error) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.errorService.emitError({
              errorMessage: error['errorMessage'] || ErrorConstant.Message.UnexpectedError,
              fullError: error['fullError']
            });
            return;
          });
      }, 200);


    }, err => {
      this.ajaxSource.next(this.ajaxconstant.COMPLETE);
      // error statement
    });

    //this.fetchPremiseData();
    if (route === true) {
      this.routeOnData();
    }
  }


  public processSysChar(): void {
    this.contractFormGroup.controls['Copy'].disable();
    this.contractFormGroup.controls['Status'].disable();
    this.contractFormGroup.controls['LostBusinessDesc'].disable();
    this.contractFormGroup.controls['LostBusinessDesc2'].disable();
    this.contractFormGroup.controls['LostBusinessDesc3'].disable();
    this.contractFormGroup.controls['ContractAnnualValue'].disable();
    this.contractFormGroup.controls['AnyPendingBelow'].disable();
    this.contractFormGroup.controls['MoreThanOneContract'].disable();
    this.contractFormGroup.controls['ErrorMessageDesc'].setValue(false);
    this.contractFormGroup.controls['PNOL'].setValue(false);
    this.dateObjectsEnabled['inactiveEffectDate'] = false;

    if (this.sysCharParams['vSCGroupAccount']) {
      this.displayList.groupAccount = true;
    } else {
      this.displayList.groupAccount = false;
    }
    if (this.sysCharParams['vRequired'] === true && this.sysCharParams['vSCEnableTaxCodeDefaultingText'].indexOf('5') > -1) {
      this.sysCharParams['vSCEnableTaxCodeDefaulting'] = true;
    } else {
      this.sysCharParams['vSCEnableTaxCodeDefaulting'] = false;
    }
    if (!this.sysCharParams['vSCDisableDefaultCountryCode']) {
      this.sysCharParams['vDefaultCountryCode'] = this.storeData['code'].country;
    }

    if (this.sysCharParams['vSCEnableTaxRegistrationNumber2']) {
      this.sysCharParams['vCompanyVATNumberLabel'] = 'Tax Registration Number 1';
    } else {
      this.sysCharParams['vCompanyVATNumberLabel'] = 'Tax Registration Number';
    }

  }
  public routeOnData(): void {
    //this.router.navigate(['/contractmanagement/maintenance/contract']);
  }
  public modalHidden(data: any): void {
    this.fetchTranslationContent();
    this.contractSearchParams['accountNumber'] = '';
    this.contractSearchParams['accountName'] = '';
    this.contractSearchParams['isCopy'] = false;
    this.contractSearchParams['showAddNew'] = true;
    this.disableAddInSearch();
    if (this.isCopyClicked) {
      this.setContractType(this.currentRouteUrl, true);
      this.contractSearchParams['initEmpty'] = true;
      //this.isCopyClicked = false;
      return;
    } else {
      this.contractSearchParams['initEmpty'] = false;
    }
    if (this.updateMode === false && this.addMode === false) {
      this.searchMode = true;
      this.updateMode = false;
      this.addMode = false;
      this.store.dispatch({
        type: ContractActionTypes.SAVE_MODE, payload:
        {
          updateMode: this.updateMode,
          addMode: this.addMode,
          searchMode: this.searchMode
        }
      });
      this.autoOpenSearch = false;
      this.autoOpenAccount = false;
      this.processForm();
    }
  }
  public setFormData(data: Object): void {
    this.contractFormGroup.controls['ContractNumber'].setValue(data['data'].ContractNumber);
    this.contractFormGroup.controls['ContractName'].setValue(this.checkFalsy(data['data'].ContractName));
    if (!this.isCopyClicked)
      this.contractFormGroup.controls['ContractAnnualValue'].setValue(data['data'].ContractAnnualValue);

    if (this.contractFormGroup.controls['AnyPendingBelow']) {
      this.contractFormGroup.controls['AnyPendingBelow'].setValue(data['data'].AnyPendingBelow);
    }
    if (this.contractFormGroup.controls['LostBusinessDesc']) {
      this.contractFormGroup.controls['LostBusinessDesc'].setValue(data['data'].LostBusinessDesc);
    }
    if (this.contractFormGroup.controls['LostBusinessDesc2']) {
      this.contractFormGroup.controls['LostBusinessDesc2'].setValue(data['data'].LostBusinessDesc2);
    }
    if (this.contractFormGroup.controls['LostBusinessDesc3']) {
      this.contractFormGroup.controls['LostBusinessDesc3'].setValue(data['data'].LostBusinessDesc3);
    }
    if (this.contractFormGroup.controls['TrialPeriodInd']) {
      if (data['data'] && data['data'].TrialPeriodInd) {
        if (data['data'].TrialPeriodInd.toUpperCase() === 'YES') {
          this.contractFormGroup.controls['TrialPeriodInd'].setValue(true);
        } else {
          this.contractFormGroup.controls['TrialPeriodInd'].setValue(false);
        }
      } else {
        this.contractFormGroup.controls['TrialPeriodInd'].setValue(false);
      }
    }
    if (this.contractFormGroup.controls['AccountNumber']) {
      this.contractFormGroup.controls['AccountNumber'].setValue(data['data'].AccountNumber);
    }
    if (this.contractFormGroup.controls['AccountName']) {
      this.contractFormGroup.controls['AccountName'].setValue((typeof data['data'] !== 'undefined') ? this.checkFalsy(data['data'].AccountName) : '');
    }
    if (this.contractFormGroup.controls['MoreThanOneContract']) {
      this.contractFormGroup.controls['MoreThanOneContract'].setValue(data['data'].MoreThanOneContract);
    }
    if (this.inputParams.currentContractType === 'C' && data['data'].MoreThanOneContract !== '' && !this.isCopyClicked) {
      this.displayList.moreThanOneContract = true;
    } else {
      this.displayList.moreThanOneContract = false;
    }
    if (this.contractFormGroup.controls['GroupAccountNumber']) {
      this.contractFormGroup.controls['GroupAccountNumber'].setValue(data['data'].GroupAccountNumber);
      if (data['data'].GroupAccountNumber === '') {
        this.storeData['fieldVisibility'].typeC.groupAccountPriceGroupID = false;
      } else {
        this.storeData['fieldVisibility'].typeC.groupAccountPriceGroupID = true;
      }
    }
    if (this.contractFormGroup.controls['GroupName']) {
      this.contractFormGroup.controls['GroupName'].setValue('');
    }
    /*if (this.contractFormGroup.controls['AccountBalance']) {
      this.contractFormGroup.controls['AccountBalance'].setValue((typeof data['data'] !== 'undefined') && data['data'].AccountBalance ? data['data'].AccountBalance : '0.00');
    }*/
    if (this.contractFormGroup.controls['ShowValueButton'] && !this.isCopyClicked) {
      this.contractFormGroup.controls['ShowValueButton'].setValue(data['data'].ShowValueButton);
      if (data['data'].ShowValueButton) {
        if (data['data'].ShowValueButton.toUpperCase() === GlobalConstant.Configuration.Yes) {
          this.displayList.future = true;
        } else {
          this.displayList.future = false;
        }
      } else {
        this.displayList.future = false;
      }
    }
    if (this.contractFormGroup.controls['BadDebtAccount']) {
      if (data['data'].BadDebtAccount) {
        if (data['data'].BadDebtAccount.toUpperCase() === GlobalConstant.Configuration.Yes) {
          this.contractFormGroup.controls['BadDebtAccount'].setValue(true);
          this.displayList.badDebtAccount = true;
          //this.displayList.badDebtAccountCheckbox = true;
        } else {
          this.contractFormGroup.controls['BadDebtAccount'].setValue(false);
          this.displayList.badDebtAccount = false;
          this.displayList.badDebtAccountCheckbox = false;
        }
      } else {
        this.contractFormGroup.controls['BadDebtAccount'].setValue(false);
        this.displayList.badDebtAccount = false;
        this.displayList.badDebtAccountCheckbox = false;
      }
    }

    if (this.contractFormGroup.controls['NationalAccountchecked']) {
      if (data['data'].NationalAccountchecked) {
        if (this.isNationalAccount && data['data'].NationalAccountchecked.toUpperCase() === GlobalConstant.Configuration.Yes) {
          this.contractFormGroup.controls['NationalAccountchecked'].setValue(true);
          this.displayList.nationalAccount = true;
        } else {
          this.contractFormGroup.controls['NationalAccountchecked'].setValue(false);
          this.displayList.nationalAccount = false;
        }
      } else {
        this.contractFormGroup.controls['NationalAccountchecked'].setValue(false);
        this.displayList.nationalAccount = false;
      }
    }
    if (this.contractFormGroup.controls['DisableList']) {
      this.contractFormGroup.controls['DisableList'].setValue('');
    }
    if (this.contractFormGroup.controls['MandateRequired']) {
      this.contractFormGroup.controls['MandateRequired'].setValue(data['data'].MandateRequired);
      if (data['data'].MandateRequired) {
        if (data['data'].MandateRequired.toUpperCase() === GlobalConstant.Configuration.Yes) {
          this.contractFormGroup.controls['MandateRequired'].setValue(true);

        } else {
          this.contractFormGroup.controls['MandateRequired'].setValue(false);

        }
      } else {
        this.contractFormGroup.controls['MandateRequired'].setValue(false);

      }
    }
    if (data['data'].PNOL) {
      if (data['data'].PNOL.toUpperCase() === GlobalConstant.Configuration.Yes) {
        this.contractFormGroup.controls['PNOL'].setValue(true);
        this.displayList.pnol = true;
      } else {
        this.contractFormGroup.controls['PNOL'].setValue(false);
        this.displayList.pnol = false;
      }
    } else {
      this.contractFormGroup.controls['PNOL'].setValue(false);
      this.displayList.pnol = false;
    }

    if (data['data'].CustomerInfoAvailable) {
      if (data['data'].CustomerInfoAvailable.toUpperCase() === GlobalConstant.Configuration.Yes) {
        this.contractFormGroup.controls['CustomerInfoAvailable'].setValue(true);
        this.displayList.customerInformation = true;
      } else {
        this.contractFormGroup.controls['CustomerInfoAvailable'].setValue(false);
        this.displayList.customerInformation = false;
      }
    } else {
      this.contractFormGroup.controls['CustomerInfoAvailable'].setValue(false);
      this.displayList.customerInformation = false;
    }

    if (data['data'].ContractHasExpired) {
      if (data['data'].ContractHasExpired.toUpperCase() === GlobalConstant.Configuration.Yes) {
        this.contractFormGroup.controls['ContractHasExpired'].setValue(true);
        this.displayList.expired = true;
      } else {
        this.contractFormGroup.controls['ContractHasExpired'].setValue(false);
        this.displayList.expired = false;
      }
    } else {
      this.contractFormGroup.controls['ContractHasExpired'].setValue(false);
      this.displayList.expired = false;
    }

    if (this.contractFormGroup.controls['ReqAutoNumber']) {
      this.contractFormGroup.controls['ReqAutoNumber'].setValue('');
    }
    if (this.contractFormGroup.controls['PaymentTypeWarning']) {
      this.contractFormGroup.controls['PaymentTypeWarning'].setValue('');
    }
    if (this.contractFormGroup.controls['ProspectNumber']) {
      this.contractFormGroup.controls['ProspectNumber'].setValue(data['data'].ProspectNumber);
      this.prospectNumber = data['data'].ProspectNumber;
    }
    this.contractFormGroup.controls['ErrorMessageDesc'].setValue('');
    this.contractFormGroup.controls['RunningReadOnly'].setValue('');
    this.contractFormGroup.controls['CallLogID'].setValue('');
    this.contractFormGroup.controls['CurrentCallLogID'].setValue('');
    this.contractFormGroup.controls['WindowClosingName'].setValue('');

    this.contractFormGroup.controls['ClosedWithChanges'].setValue('');
    if (!this.isCopyClicked) {
      this.contractFormGroup.controls['CurrentPremises'].setValue(data['data'].CurrentPremises);
      this.contractFormGroup.controls['NegBranchNumber'].setValue(data['data'].NegBranchNumber);
      this.contractFormGroup.controls['BranchName'].setValue('');
      this.onNegBranchNumberBlur({});
      this.contractFormGroup.controls['Status'].setValue(data['data'].Status);
      if (data['data'].ContractCommenceDate) {
        this.clearDate['contractCommenceDate'] = false;
        let parsedDate: any = this.globalize.parseDateStringToDate(data['data'].ContractCommenceDate);
        if (parsedDate instanceof Date) {
          this.contractCommenceDate = parsedDate;
        } else {
          this.contractCommenceDate = null;
        }
        this.commenceDateDisplay = this.globalize.parseDateToFixedFormat(data['data'].ContractCommenceDate) as string;
        this.contractFormGroup.controls['ContractCommenceDate'].setValue(this.commenceDateDisplay);
      }

      if (data['data'].InactiveEffectDate) {
        this.clearDate['inactiveEffectDate'] = false;
        let parsedDate: any = this.globalize.parseDateStringToDate(data['data'].InactiveEffectDate);
        if (parsedDate instanceof Date) {
          this.inactiveEffectDate = parsedDate;
        } else {
          this.inactiveEffectDate = null;
        }
        this.inactiveEffectDateDisplay = this.globalize.parseDateToFixedFormat(data['data'].InactiveEffectDate) as string;
        this.contractFormGroup.controls['InactiveEffectDate'].setValue(this.inactiveEffectDateDisplay);
      }
    }
  }

  public onAccountDataReceived(data: any): void {
    if (data) {
      this.contractFormGroup.controls['AccountName'].setValue(data.AccountName);
      this.contractFormGroup.controls['ContractName'].setValue(data.AccountName);
      this.contractFormGroup.controls['AccountNumber'].setValue(data.AccountNumber);
      this.contractFormGroup.controls['AccountBalance'].setValue(data.AccountBalance);
      this.contractFormGroup.controls['GroupAccountNumber'].setValue(data.GroupAccountNumber);
      this.onAccountBlur({});
    }
  }

  public onGroupAccountDataReceived(data: any): void {
    if (data) {
      this.contractFormGroup.controls['GroupAccountNumber'].setValue(data.GroupAccountNumber);
      this.contractFormGroup.controls['GroupName'].setValue(data.GroupName || data.Object.GroupName);
      this.inputParamsAccount['groupAccountNumber'] = data.GroupAccountNumber;
      this.inputParamsAccount['groupName'] = data.GroupName || data.Object.GroupName;
    } else {
      this.inputParamsAccount['groupAccountNumber'] = '';
      this.inputParamsAccount['groupName'] = '';
    }
  }

  public onUpdateButtonClick(event: any): void {
    this.searchMode = false;
    this.updateMode = true;
    this.addMode = false;
    this.store.dispatch({
      type: ContractActionTypes.SAVE_MODE, payload:
      {
        updateMode: this.updateMode,
        addMode: this.addMode,
        searchMode: this.searchMode
      }
    });
    this.processForm();
  }

  public onCancel(event: any): void {
    event.preventDefault();
    if (this.addMode) {
      this.contractSearchParams['accountNumber'] = '';
      this.contractSearchParams['accountName'] = '';
      this.contractFormGroup.reset();
      this.storeData['formGroup'].typeA.reset();
      this.storeData['formGroup'].typeB.reset();
      this.storeData['formGroup'].typeC.reset();
      if (this.storeData['formGroup'].typeD) {
        this.storeData['formGroup'].typeD.reset();
      }
      if (this.storeData['formGroup'].typeE) {
        this.storeData['formGroup'].typeE.reset();
      }
      for (let key in this.contractFormGroup.controls) {
        if (this.contractFormGroup.controls[key]) {
          this.contractFormGroup.controls[key].disable();
        }
      }
      for (let key in this.storeData['formGroup'].typeA.controls) {
        if (this.storeData['formGroup'].typeA.controls[key]) {
          this.storeData['formGroup'].typeA.controls[key].disable();
        }
      }
      for (let key in this.storeData['formGroup'].typeB.controls) {
        if (this.storeData['formGroup'].typeB.controls[key]) {
          this.storeData['formGroup'].typeB.controls[key].disable();
        }
      }
      for (let key in this.storeData['formGroup'].typeC.controls) {
        if (this.storeData['formGroup'].typeC.controls[key]) {
          this.storeData['formGroup'].typeC.controls[key].disable();
        }
      }
      if (this.storeData['formGroup'].typeD) {
        for (let key in this.storeData['formGroup'].typeD.controls) {
          if (this.storeData['formGroup'].typeD.controls[key]) {
            this.storeData['formGroup'].typeD.controls[key].disable();
          }
        }
      }
      if (this.storeData['formGroup'].typeE) {
        for (let key in this.storeData['formGroup'].typeE.controls) {
          if (this.storeData['formGroup'].typeE.controls[key]) {
            this.storeData['formGroup'].typeE.controls[key].disable();
          }
        }
      }
      this.contractCommenceDate = void 0;
      this.inactiveEffectDate = void 0;
      this.searchMode = true;
      this.updateMode = false;
      this.addMode = false;
      this.store.dispatch({
        type: ContractActionTypes.SAVE_MODE, payload:
        {
          updateMode: this.updateMode,
          addMode: this.addMode,
          searchMode: this.searchMode,
          prevMode: 'Add'
        }
      });
      this.autoOpenSearch = true;
      setTimeout(() => {
        this.autoOpenSearch = false;
      }, 100);
    } else if (this.updateMode) {
      let dataReg = [
        {
          'table': 'Account',
          'query': { 'BusinessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode(), 'AccountNumber': this.contractFormGroup.controls['AccountNumber'] ? this.contractFormGroup.controls['AccountNumber'].value : '' },
          'fields': ['AccountName', 'AccountNumber', 'NationalAccount', 'AccountBalance']
        },
        {
          'table': 'SystemInvoiceFrequency',
          'query': { 'InvoiceFrequencyCode': this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'] ? this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].value : '' },
          'fields': ['InvoiceFrequencyCode', 'InvoiceFrequencyDesc']
        },
        {
          'table': 'InvoiceFee',
          'query': { 'InvoiceFeeCode': this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'] ? this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].value : '' },
          'fields': ['InvoiceFeeDesc']
        },
        {
          'table': 'PaymentType',
          'query': { 'PaymentTypeCode': this.storeData['formGroup'].typeB.controls['PaymentTypeCode'] ? this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].value : '' },
          'fields': ['PaymentDesc']
        },
        {
          'table': 'Employee',
          'query': { 'EmployeeCode': this.storeData['formGroup'].typeC.controls['SalesEmployee'] ? this.storeData['formGroup'].typeC.controls['SalesEmployee'].value : '' },
          'fields': ['EmployeeSurname']
        },
        {
          'table': 'GroupAccountPriceGroup',
          'query': {
            'GroupAccountPriceGroupID': this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'] ? this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value : '',
            'GroupAccountNumber': this.storeData['formGroup'].main.controls['GroupAccountNumber'].value
          },
          'fields': ['GroupAccountPriceGroupDesc']
        },
        {
          'table': 'GroupAccount',
          'query': { 'GroupAccountNumber': this.contractFormGroup.controls['GroupAccountNumber'].value },
          'fields': ['GroupAccountNumber', 'GroupName']
        }];

      Observable.forkJoin(
        this.lookUpRecord(dataReg, 100),
        this.fetchContractData('', { ContractNumber: this.contractFormGroup.controls['ContractNumber'].value, ContractTypeCode: this.inputParams.currentContractType })
      ).subscribe((data) => {
        if (data[1]['status'] === GlobalConstant.Configuration.Failure) {
          this.errorService.emitError(data[1]['oResponse']);
        } else {
          if (!data[1]['errorMessage'] && !data[1]['error']) {
            this.store.dispatch({ type: ContractActionTypes.SAVE_DATA, payload: data[1] });
          }
        }
        if (data[0] && !data[0]['errorMessage'] && data[0]['results']) {
          if (data[0]['results'][0].length > 0) {
            if (data[0]['results'][0][0].NationalAccount) {
              if (data[0]['results'][0][0].NationalAccount === true || data[0]['results'][0][0].NationalAccount.toString().toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.isNationalAccount = true;
              } else {
                this.isNationalAccount = false;
              }
            } else {
              this.isNationalAccount = false;
            }
            this.contractFormGroup.controls['AccountBalance'].setValue(data[0]['results'][0][0].AccountBalance);
            this.contractFormGroup.controls['AccountName'].setValue(data[0]['results'][0][0].AccountName);
          }
          if (data[0]['results'][1].length > 0) {

            if (data[0]['results'][1][0]) {
              this.storeData['formGroup'].typeB.controls['InvoiceFrequencyDesc'].setValue(data[0]['results'][1][0]['InvoiceFrequencyDesc']);
            }
          }

          if (data[0]['results'][2].length > 0) {
            if (data[0]['results'][2][0]) {
              this.storeData['formGroup'].typeB.controls['InvoiceFeeDesc'].setValue(data[0]['results'][2][0]['InvoiceFeeDesc']);
            }
          }

          if (data[0]['results'][3].length > 0) {
            if (data[0]['results'][3][0]) {
              this.storeData['formGroup'].typeB.controls['PaymentDesc'].setValue(data[0]['results'][3][0]['PaymentDesc']);
            }
          }

          if (data[0]['results'][4].length > 0) {
            if (data[0]['results'][4][0]) {
              this.storeData['formGroup'].typeC.controls['SalesEmployeeSurname'].setValue(data[0]['results'][4][0]['EmployeeSurname']);
            }
          }

          if (data[0]['results'][5].length > 0) {
            if (data[0]['results'][5][0]) {
              this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupDesc'].setValue(data[0]['results'][5][0]['GroupAccountPriceGroupDesc']);
            }
          }

          if (data[0]['results'][6].length > 0) {
            if (data[0]['results'][6][0]) {
              this.contractFormGroup.controls['GroupName'].setValue(data[0]['results'][6][0]['GroupName']);
            }
          }
        }
        this.store.dispatch({ type: ContractActionTypes.LOOKUP });
      });
    }
    this.tabsError = {
      tabA: false,
      tabB: false,
      tabC: false,
      tabD: false,
      tabE: false
    };
    this.formPristine();
    if (this.currentRouteParams && typeof this.currentRouteParams['ReDirectOnCancel'] !== 'undefined' && this.currentRouteParams['ReDirectOnCancel'] === 'true') {
      this.location.back();
    }
  }

  public optionsChange(event: any): void {
    switch (this.options.trim()) {
      case 'contacts':
        this.router.navigate([InternalMaintenanceServiceModuleRoutes.ICABSCMCONTACTPERSONMAINTENANCE], { queryParams: { parentMode: 'Contract', contractNumber: this.storeData['data'].ContractNumber } });
        break;
      case 'Premises Details':
        this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSAPREMISESEARCHGRID.URL_2], {
          queryParams: {
            parentMode: 'Contract',
            ContractNumber: this.contractFormGroup.controls['ContractNumber'].value,
            ContractName: this.contractFormGroup.controls['ContractName'].value,
            AccountNumber: this.contractFormGroup.controls['AccountNumber'].value,
            AccountName: this.contractFormGroup.controls['AccountName'].value,
            ContractTypeCode: this.inputParams.currentContractType
          }
        });
        break;

      case 'Invoice History':
        this.router.navigate(['/billtocash/contract/invoice'], {
          queryParams: {
            parentMode: 'Contract',
            ContractNumber: this.contractFormGroup.controls['ContractNumber'].value,
            ContractName: this.contractFormGroup.controls['ContractName'].value
          }
        });
        break;

      case 'Contact Management':
        if (this.otherParams['lREGContactCentreReview']) {
          this.router.navigate(['/ccm/centreReview'], {
            queryParams: {
              parentMode: 'Contract',
              ContractNumber: this.contractFormGroup.controls['ContractNumber'].value,
              ContractName: this.contractFormGroup.controls['ContractName'].value,
              AccountNumber: this.contractFormGroup.controls['AccountNumber'].value,
              AccountName: this.contractFormGroup.controls['AccountName'].value
            }
          });
        } else {
          this.router.navigate(['/ccm/contact/search'], {
            queryParams: {
              parentMode: 'Contract',
              ContractNumber: this.contractFormGroup.controls['ContractNumber'].value,
              ContractName: this.contractFormGroup.controls['ContractName'].value,
              AccountNumber: this.contractFormGroup.controls['AccountNumber'].value,
              AccountName: this.contractFormGroup.controls['AccountName'].value
            }
          });
        }

        break;

      case 'Pro Rata Charge':

        this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSAPRORATACHARGESUMMARY], {
          queryParams: {
            parentMode: 'Contract',
            ContractNumber: this.contractFormGroup.controls['ContractNumber'].value,
            ContractName: this.contractFormGroup.controls['ContractName'].value,
            AccountNumber: this.contractFormGroup.controls['AccountNumber'].value,
            AccountName: this.contractFormGroup.controls['AccountName'].value,
            currentContractType: this.inputParams.currentContractType
          }
        });
        break;

      case 'Invoice Narrative':
        this.router.navigate([InternalMaintenanceSalesModuleRoutes.ICABSAINVOICENARRATIVEMAINTENANCE], {
          queryParams: {
            parentMode: 'Contract',
            currentContractTypeURLParameter: this.inputParams.currentContractTypeURLParameter,
            ContractNumber: this.contractFormGroup.controls['ContractNumber'].value,
            AccountNumber: this.contractFormGroup.controls['AccountNumber'].value,
            PremiseNumber: '',
            InvoiceGroupNumber: '',
            InvoiceNarrativeText: '',
            backLabel: 'Contract Maintenance',
            backRoute: '#/contractmanagement/maintenance/contract'
          }
        });
        break;

      case 'Prospect Conversion':
        this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSCMPROSPECTCONVGRID], {
          queryParams: {
            parentMode: 'Contract',
            currentContractTypefetchContURLParameter: this.inputParams.currentContractTypeURLParameter
          }
        });
        break;
      case 'History':
        this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSACONTRACTHISTORYGRID], {
          queryParams: {
            parentMode: 'Contract',
            currentContractTypeURLParameter: this.inputParams.currentContractTypeURLParameter
          }
        });
        break;

      case 'Account Information':
        this.router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], {
          queryParams: {
            parentMode: 'CallCentreSearch',
            AccountNumber: this.contractFormGroup.controls['AccountNumber'].value,
            AccountName: this.contractFormGroup.controls['AccountName'].value
          }
        });
        break;
      case 'Event History':
        this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSCMCUSTOMERCONTACTHISTORYGRID], {
          queryParams: {
            parentMode: 'Contract',
            currentContractTypeURLParameter: this.inputParams.currentContractTypeURLParameter,
            ContractNumber: this.contractFormGroup.controls['ContractNumber'].value,
            ContractName: this.contractFormGroup.controls['ContractName'].value,
            AccountNumber: this.contractFormGroup.controls['AccountNumber'].value,
            AccountName: this.contractFormGroup.controls['AccountName'].value,
            backLabel: 'Contract Maintenance',
            backRoute: '#/contractmanagement/maintenance/contract'
          }
        });
        break;
      case 'Infestation Tolerances':
        this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSSINFESTATIONTOLERANCEGRID], { queryParams: { parentMode: 'ContractInfestationTolerance', ContractNumber: this.contractFormGroup.controls['ContractNumber'].value, CurrentContractTypeURLParameter: this.inputParams.currentContractTypeURLParameter } });
        break;
      case 'Waste Consignment Note History':
        //this.router.navigate(['grid/contractmanagement/account/infestationToleranceGrid'], { queryParams: { parentMode: 'ContractInfestationTolerance', ContractNumber: this.contractFormGroup.controls['ContractNumber'].value, CurrentContractTypeURLParameter: this.inputParams.currentContractTypeURLParameter } });
        alert('Screen not part of MVP 1');
        break;
      case 'ServiceCover':
        if (this.inputParams.currentContractType === 'P') { //TODO - Check for TelesalesInd & redirect to contract service summary
          this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSAPRODUCTSALESSCENTRYGRID.URL_1], {
            queryParams: {
              parentMode: 'Contract',
              currentContractTypeURLParameter: this.inputParams.currentContractTypeURLParameter,
              'ContractNumber': this.contractFormGroup.controls['ContractNumber'].value,
              'ContractName': this.contractFormGroup.controls['ContractName'].value,
              'backLabel': 'Contract Maintenance'
            }
          });
        } else {
          this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSACONTRACTSERVICESUMMARY], {
            queryParams: {
              parentMode: 'Contract',
              currentContractType: this.inputParams.currentContractType,
              'ContractNumber': this.contractFormGroup.controls['ContractNumber'].value,
              'ContractName': this.contractFormGroup.controls['ContractName'].value,
              'ContractAnnualValue': this.contractFormGroup.controls['ContractAnnualValue'].value,
              'RunningReadOnly': this.contractFormGroup.controls['RunningReadOnly'].value,
              'CallLogID': this.contractFormGroup.controls['CallLogID'].value,
              'CurrentCallLogID': this.contractFormGroup.controls['CurrentCallLogID'].value,
              'IsNationalAccount': this.isNationalAccount,
              'backLabel': 'Contract Maintenance'
            }
          });
        }
        break;
      case 'Visit Summary':
        this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSASERVICEVISITSUMMARY], {
          queryParams: {
            'parentMode': 'Contract',
            'currentContractTypeURLParameter': this.inputParams.currentContractTypeURLParameter,
            'isNationalAccount': this.isNationalAccount,
            'ContractNumber': this.contractFormGroup.controls['ContractNumber'].value,
            'ContractName': this.contractFormGroup.controls['ContractName'].value
          }
        });
        break;
      case 'StaticVisits':
        this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSASTATICVISITGRIDYEAR], {
          queryParams: {
            parentMode: 'Contract',
            currentContractType: this.inputParams.currentContractType
          }
        });
        break;

      case 'Service Recommendations':
        this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSARECOMMENDATIONGRID.URL_1], {

          queryParams: {
            parentMode: 'Contract',
            'ContractNumber': this.contractFormGroup.controls['ContractNumber'].value,
            'ContractName': this.contractFormGroup.controls['ContractName'].value,
            'backLabel': 'Contract Maintenance',
            currentContractType: this.inputParams.currentContractType
          }
        });
        break;
      case 'Customer Information':
        this.router.navigate(
          [InternalGridSearchServiceModuleRoutes.ICABSACUSTOMERINFORMATIONSUMMARY.URL_1],
          {
            queryParams: {
              parent: 'contract-maintenance',
              groupAccountNumber: this.contractFormGroup.controls['GroupAccountNumber'].value,
              groupName: this.contractFormGroup.controls['GroupName'].value
            }
          }
        );
        break;
      case 'Visit Tolerances':
        this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSSVISITTOLERANCEGRID], {
          queryParams: {
            parentMode: 'ContractVisitTolerance',
            currentContractTypeURLParameter: this.inputParams.currentContractTypeURLParameter
          }
        });
        break;

      case 'Contact Management Search':
        this.router.navigate(['ccm/callcentersearch'], {
          queryParams: {
            'parentMode': 'ContactManagement',
            'AccountNumber': this.contractFormGroup.controls['AccountNumber'].value,
            'ContractNumber': this.contractFormGroup.controls['ContractNumber'].value,
            'CurrentContractTypeURLParameter': this.inputParams.currentContractTypeURLParameter
          }
        });
        break;
      case 'Telesales Order':
        this.router.navigate([InternalMaintenanceServiceModuleRoutes.ICABSCMTELESALESENTRY], {
          queryParams: {
            'parentMode': 'ContractTeleSalesOrder',
            'currentContractTypeURLParameter': this.inputParams.currentContractTypeURLParameter,
            'AccountNumber': this.contractFormGroup.controls['AccountNumber'].value,
            'ContractNumber': this.contractFormGroup.controls['ContractNumber'].value,
            'ProspectNumber': this.contractFormGroup.controls['ProspectNumber'].value,
            'CurrentCallLogID': this.contractFormGroup.controls['CurrentCallLogID'].value
          }
        });
        break;
      case 'Invoice Charge':
        this.router.navigate(['contractmanagement/account/invoiceCharge'], {
          queryParams: {
            'parentMode': 'Contract',
            'AccountNumber': this.contractFormGroup.controls['AccountNumber'].value,
            'ContractNumber': this.contractFormGroup.controls['ContractNumber'].value,
            'ContractName': this.contractFormGroup.controls['ContractName'].value,
            'currentContractTypeURLParameter': this.inputParams.currentContractTypeURLParameter
          }
        });
        break;
      default:
        // code...
        break;
    }
  }

  public processForm(): void {
    if (this.updateMode && !this.searchMode && !this.addMode) {
      this.contractFormGroup.controls['ContractNumber'].disable();
      this.contractFormGroup.controls['ContractName'].enable();
      this.contractFormGroup.controls['AccountNumber'].disable();
      this.contractFormGroup.controls['GroupAccountNumber'].disable();
      this.contractFormGroup.controls['Future'].enable();
      this.contractFormGroup.controls['Copy'].disable();
      this.dateObjectsEnabled['contractCommenceDate'] = false;
      //this.contractNameReadOnly = false;
      this.isAccountEllipsisDisabled = true;
      this.isContractEllipsisDisabled = false;
      this.otherParams['disableNameSearch'] = true;
      this.fieldRequired.contractNumber = true;
      if (this.sysCharParams['vSCEnableTrialPeriodServices']) {
        this.onTrialPeriodIndChange({});
        if (this.contractFormGroup.controls['TrialPeriodInd'].value) {
          this.displayList.trialPeriodInd = true;
        } else {
          this.displayList.trialPeriodInd = false;
        }
      }
      this.afterFetch();

      if (this.isNationalAccount && this.storeData['data'] && this.storeData['data'].NationalAccountchecked && this.storeData['data'].NationalAccountchecked.toUpperCase() === GlobalConstant.Configuration.Yes) {
        this.displayList.nationalAccount = true;
      } else {
        this.displayList.nationalAccount = false;
      }
      this.isNegBranchDropdownsDisabled = false;
      let focus = new CustomEvent('focus', { bubbles: true });
      setTimeout(() => {
        this.renderer.invokeElementMethod(document.getElementById('ContractName'), 'focus', [focus]);
      }, 0);

      this.cbb.disableComponent(true);
    }

    if (this.searchMode && !this.updateMode && !this.addMode) {
      this.contractFormGroup.controls['ContractNumber'].enable();
      this.contractFormGroup.controls['ContractName'].disable();
      this.isAccountEllipsisDisabled = true;
      if (this.isChild) {
        this.isContractEllipsisDisabled = true;
      } else {
        this.isContractEllipsisDisabled = false;
      }
      this.isNegBranchDropdownsDisabled = true;
      this.isGroupAccountEllipsisDisabled = true;
      this.dateObjectsEnabled['contractCommenceDate'] = false;
      this.dateObjectsEnabled['inactiveEffectDate'] = false;
      this.contractFormGroup.controls['Future'].enable();
      this.contractFormGroup.controls['Copy'].disable();
      this.fieldRequired.contractNumber = true;
      this.fetchTranslationContent();
    }
    if (this.addMode && !this.updateMode && !this.searchMode) {
      this.otherParams['disableNameSearch'] = false;
      if (this.sysCharParams['vSCEnableAutoNumber']) {
        this.fieldRequired.contractNumber = false;
      } else {
        this.fieldRequired.contractNumber = true;
      }
      this.fetchContractData('GetPaymentTypeDetails,GetNoticePeriod', {}).subscribe(
        (e) => {
          if (e.status === GlobalConstant.Configuration.Failure) {
            this.errorService.emitError(e.oResponse);
          } else {
            this.contractFormGroup.controls['PaymentTypeWarning'].setValue(e.PaymentTypeWarning);
            if (e.PaymentTypeWarning !== '') {
              this.errorService.emitError({
                errorMessage: e.PaymentTypeWarning
              });
            }
          }
        },
        (error) => {
          // error statement
        }
      );
      this.contractFormGroup.controls['ContractName'].enable();
      this.contractFormGroup.controls['ContractName'].setValue('');
      this.contractFormGroup.controls['ContractNumber'].disable();
      this.contractFormGroup.controls['ContractNumber'].setValue('');
      this.contractFormGroup.controls['CurrentPremises'].disable();
      this.contractFormGroup.controls['CurrentPremises'].setValue('');
      this.contractFormGroup.controls['NegBranchNumber'].enable();
      this.contractFormGroup.controls['BranchName'].disable();
      this.isNegBranchDropdownsDisabled = false;
      this.contractFormGroup.controls['ContractAnnualValue'].disable();
      this.contractFormGroup.controls['ContractAnnualValue'].setValue('');
      this.contractFormGroup.controls['AccountNumber'].enable();
      this.contractFormGroup.controls['AccountNumber'].setValue('');
      this.contractFormGroup.controls['AccountName'].disable();
      this.contractFormGroup.controls['AccountName'].setValue('');
      this.contractFormGroup.controls['GroupAccountNumber'].enable();
      this.contractFormGroup.controls['GroupAccountNumber'].setValue('');
      this.contractFormGroup.controls['GroupName'].disable();
      this.contractFormGroup.controls['GroupName'].setValue('');
      this.contractFormGroup.controls['AccountBalance'].disable();
      this.contractFormGroup.controls['AccountBalance'].setValue('');
      this.contractFormGroup.controls['Status'].disable();
      this.contractFormGroup.controls['Status'].setValue('');

      this.contractCommenceDate = null;
      this.commenceDateDisplay = '';
      this.clearDate['contractCommenceDate'] = true;
      this.contractFormGroup.controls['ContractCommenceDate'].setValue(this.commenceDateDisplay);
      this.inactiveEffectDate = null;
      this.inactiveEffectDateDisplay = '';
      this.clearDate['inactiveEffectDate'] = true;
      this.contractFormGroup.controls['InactiveEffectDate'].setValue(this.inactiveEffectDateDisplay);
      this.zone.run(() => {
        this.dateObjectsEnabled['contractCommenceDate'] = true;
        //this.contractNameReadOnly = false;
        this.isAccountEllipsisDisabled = false;
        if (!this.contractStoreData) {
          this.isContractEllipsisDisabled = true;
        }

      });
      if (this.sysCharParams['vSCEnableAutoNumber']) {
        this.contractFormGroup.controls['ContractNumber'].disable();
        this.contractFormGroup.controls['ContractNumber'].setValue('');
      } else {
        this.contractFormGroup.controls['ContractNumber'].enable();
        this.contractFormGroup.controls['ContractNumber'].setValue('');
      }
      if (this.isNationalAccount && this.storeData['data'] && this.storeData['data'].NationalAccountchecked && this.storeData['data'].NationalAccountchecked.toUpperCase() === GlobalConstant.Configuration.Yes) {
        this.displayList.nationalAccount = true;
      } else {
        this.displayList.nationalAccount = false;
      }

      this.displayList.anyPendingBelow = false;
      this.displayList.lostBusinessDesc1 = false;
      this.displayList.lostBusinessDesc2 = false;
      this.displayList.lostBusinessDesc3 = false;
      this.displayList.expired = false;
      this.displayList.future = false;
      this.isGroupAccountEllipsisDisabled = false;
      this.contractFormGroup.controls['Copy'].enable();

      let focus = new CustomEvent('focus', { bubbles: true });
      setTimeout(() => {
        this.renderer.invokeElementMethod(document.getElementById('ContractName'), 'focus', [focus]);
      }, 0);

    }

    if (this.addMode || this.updateMode) {
      this.inputParamsAccount = Object.assign({}, this.inputParamsAccount, {
        'countryCode': this.storeData['code'].country,
        'businessCode': this.storeData['code'].business
      });
      this.inputParamsGroupAccount = Object.assign({}, this.inputParamsGroupAccount, {
        'countryCode': this.storeData['code'].country,
        'businessCode': this.storeData['code'].business
      });
      this.inputParams = Object.assign({}, this.inputParams, {
        'countryCode': this.storeData['code'].country,
        'businessCode': this.storeData['code'].business
      });
    }
    this.formPristine();
  }

  public buildMenuOptions(): void {
    let optionsList: Array<any> = [
      {
        title: '', list: [{
          value: 'options',
          text: 'Options'
        }]
      },
      { title: 'Portfolio', list: [] },
      { title: 'History', list: [] },
      { title: 'Invoicing', list: [] },
      { title: 'Service', list: [] },
      { title: 'Customer Relations', list: [] }
    ];
    if (this.sysCharParams['vSCMultiContactInd']) {
      optionsList[1].list.push({
        value: 'contacts',
        text: 'Contact Details'
      });
    }
    optionsList[1].list.push({
      value: 'Premises Details',
      text: 'Premises Details'
    });
    optionsList[1].list.push({
      value: 'ServiceCover',
      text: 'Service Covers'
    });

    if (!(this.storeData['params'].parentMode === 'PipelineGrid' || this.storeData['params'].parentMode === 'ProspectPremises')) {
      optionsList[1].list.push({
        value: 'Account Information',
        text: 'Account Information'
      });
      optionsList[1].list.push({
        value: 'Telesales Order',
        text: 'Telesales Order'
      });
      optionsList[2].list.push({
        value: 'History',
        text: 'History'
      });
      optionsList[2].list.push({
        value: 'Event History',
        text: 'Event History'
      });

      optionsList[3].list.push({
        value: 'Pro Rata Charge',
        text: 'Pro Rata Charge'
      });
      optionsList[3].list.push({
        value: 'Invoice Narrative',
        text: 'Invoice Narrative'
      });
      optionsList[3].list.push({
        value: 'Invoice Charge',
        text: 'Invoice Charge'
      });
      optionsList[3].list.push({
        value: 'Invoice History',
        text: 'Invoice History'
      });

      optionsList[4].list.push({
        value: 'Product Summary',
        text: 'Product Summary'
      });
      optionsList[4].list.push({
        value: 'StaticVisits',
        text: 'Static Visits (SOS)'
      });
      optionsList[4].list.push({
        value: 'Visit Summary',
        text: 'Visit Summary'
      });
      optionsList[4].list.push({
        value: 'Service Recommendations',
        text: 'Service Recommendations'
      });
      optionsList[4].list.push({
        value: 'State Of Service',
        text: 'State of Service'
      });

      if (this.sysCharParams['vSCVisitTolerances']) {
        optionsList[4].list.push({
          value: 'Visit Tolerances',
          text: 'Visit Tolerances'
        });
      }
      if (this.sysCharParams['vSCInfestationTolerance']) {
        optionsList[4].list.push({
          value: 'Infestation Tolerances',
          text: 'Infestation Tolerances'
        });
      }
      if (this.sysCharParams['vShowWasteConsignmentNoteHistory']) {
        optionsList[4].list.push({
          value: 'Waste Consignment Note History',
          text: 'Waste Consignment Note History'
        });
      }
      optionsList[5].list.push({
        value: 'Contact Management',
        text: 'Contact Management'
      });
      optionsList[5].list.push({
        value: 'Contact Management Search',
        text: 'Contact Centre Search'
      });
      optionsList[5].list.push({
        value: 'Customer Information',
        text: 'Customer Information'
      });
      optionsList[5].list.push({
        value: 'Prospect Conversion',
        text: 'Prospect Conversion'
      });
    }
    this.options = this.optionsList[0].list[0].value;
    this.optionsList = JSON.parse(JSON.stringify(optionsList));
  }

  public onCustomerInformationClick(event: any): void {
    this.router.navigate(
      [InternalGridSearchServiceModuleRoutes.ICABSACUSTOMERINFORMATIONSUMMARY.URL_1],
      {
        queryParams: {
          parent: 'contract-maintenance',
          groupAccountNumber: this.contractFormGroup.controls['GroupAccountNumber'].value,
          groupName: this.contractFormGroup.controls['GroupName'].value
        }
      }
    );
  }

  public onCmdValueClick(event: any): void {
    this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSASERVICEVALUEGRID], {
      queryParams: {
        parentMode: 'Contract',
        ContractNumber: this.contractFormGroup.controls['ContractNumber'].value,
        ContractName: this.contractFormGroup.controls['ContractName'].value,
        AccountNumber: this.contractFormGroup.controls['AccountNumber'].value,
        AccountName: this.contractFormGroup.controls['AccountName'].value,
        ContractTypeCode: this.inputParams.currentContractType,
        CurrentContractTypeURLParameter: this.inputParams.currentContractTypeURLParameter
      }
    });
  }

  public onCopyClick(event: any): void {
    let isContractEllipsisDisabled = this.isContractEllipsisDisabled;
    this.isCopyClicked = true;
    this.zone.run(() => {
      this.autoOpenSearch = true;
      this.isContractEllipsisDisabled = false;
      this.contractSearchParams['initEmpty'] = false;
      this.contractSearchParams['parentMode'] = 'ContractCopy';
      this.contractSearchParams['showCountry'] = false;
      this.contractSearchParams['showBusiness'] = false;
      this.contractSearchParams['business'] = this.storeData['code'].business;
      this.contractSearchParams['country'] = this.storeData['code'].country;
      this.contractSearchParams.currentContractType = '';
      this.contractSearchParams['accountNumber'] = this.contractFormGroup.controls['AccountNumber'].value;
      this.contractSearchParams['accountName'] = this.contractFormGroup.controls['AccountName'].value;
      this.contractSearchParams['isCopy'] = true;
      this.contractSearchParams['showAddNew'] = false;
    });
    setTimeout(() => {
      this.isContractEllipsisDisabled = isContractEllipsisDisabled;
      this.contractSearchParams['showCountry'] = true;
      this.contractSearchParams['showBusiness'] = true;
      this.contractSearchParams['parentMode'] = 'ContractSearch';
    }, 100);
  }

  public onSubmit(formdata: Object, valid: boolean, event: any): void {
    event.preventDefault();
    for (let j in this.displayList) {
      if (this.displayList.hasOwnProperty(j)) {
        let key = j['capitalizeFirstLetter']();
        if (!this.displayList[j]) {
          if (this.contractFormGroup.controls[key]) {
            this.contractFormGroup.controls[key].clearValidators();
          }
        }
      }
    }
    for (let i in this.contractFormGroup.controls) {
      if (this.contractFormGroup.controls.hasOwnProperty(i)) {
        this.contractFormGroup.controls[i].markAsTouched();
        if (this.contractFormGroup.controls[i].errors && this.contractFormGroup.controls[i].value !== '') {
          this.contractFormGroup.controls[i].clearValidators();
        }
      }
    }
    this.dateObjectsValidate['inactiveEffectDate'] = true;
    this.dateObjectsValidate['contractCommenceDate'] = true;
    setTimeout(() => {
      this.dateObjectsValidate['inactiveEffectDate'] = false;
      this.dateObjectsValidate['contractCommenceDate'] = false;
    }, 100);
    this.contractFormGroup.updateValueAndValidity();
    this.store.dispatch({
      type: ContractActionTypes.VALIDATE_FORMS, payload: {
        main: true,
        typeA: true,
        typeB: true,
        typeC: true,
        typeD: true,
        typeE: true
      }
    });
    this.store.dispatch({
      type: ContractActionTypes.FORM_VALIDITY, payload: {
        main: this.contractFormGroup.valid
      }
    });

  }

  public onSaveFocus(e: any): void {
    try {
      let code = (e.keyCode ? e.keyCode : e.which);
      let elemList = document.querySelectorAll('#tabCont .nav-tabs li a');
      let currentSelectedIndex = Array.prototype.indexOf.call(elemList, document.querySelector('#tabCont .nav-tabs li a.active'));
      if (code === 9 && currentSelectedIndex < (elemList.length - 1)) {
        let click = new CustomEvent('click', { bubbles: true });
        this.renderer.invokeElementMethod(elemList[currentSelectedIndex + 1], 'dispatchEvent', [click]);
        setTimeout(() => {
          let elem = document.querySelector('#tabCont .tab-content .tab-pane.active .ui-select-toggle, #tabCont .tab-content .tab-pane.active input:not([disabled]), #tabCont .tab-content .tab-pane.active select:not([disabled])');
          if (elem) {
            elem['focus']();
          }
        }, 0);
      }
      return;
    } catch (err) {
      // statement
    }
  }

  public onTabSelect(event: any): void {
    setTimeout(() => {
      this.setTabAttribute();
    }, 400);
    let tabsElemList = document.querySelectorAll('#tabCont .tab-content .tab-pane');
    for (let i = 0; i < tabsElemList.length; i++) {
      if (tabsElemList[i].querySelectorAll('input.ng-invalid.ng-touched, textarea.ng-invalid.ng-touched').length > 0) {
        if (i === 0) {
          this.tabsError['tabA'] = true;
        } else if (i === 1) {
          this.tabsError['tabB'] = true;
        } else if (i === 2) {
          this.tabsError['tabC'] = true;
        } else if (i === 3) {
          this.tabsError['tabD'] = true;
        } else if (i === 4) {
          this.tabsError['tabE'] = true;
        }
      } else {
        if (i === 0) {
          this.tabsError['tabA'] = false;
        } else if (i === 1) {
          this.tabsError['tabB'] = false;
        } else if (i === 2) {
          this.tabsError['tabC'] = false;
        } else if (i === 3) {
          this.tabsError['tabD'] = false;
        } else if (i === 4) {
          this.tabsError['tabE'] = false;
        }
      }
    }
  }

  public onContractNameBlur(): void {
    if (this.addMode && !this.updateMode && !this.searchMode) {
      this.contractFormGroup.controls['Copy'].disable();
      setTimeout(() => {
        this.contractFormGroup.controls['Copy'].enable();
      }, 0);
    }
  }

  public onContractNameChange(event: any): void {
    if (!this.sysCharParams['vSCCapitalFirstLtr']) {
      this.contractFormGroup.controls['ContractName'].setValue(this.contractFormGroup.controls['ContractName'].value.toString().capitalizeFirstLetter());
    }
    if (!this.otherParams['disableNameSearch']) {
      if (this.contractFormGroup.controls['ContractName'] && this.contractFormGroup.controls['ContractName'].value !== '') {
        if (this.storeData['params'].parentMode !== 'AddContractFromAccount') {
          this.fetchContractData('', { action: '0', SearchName: this.contractFormGroup.controls['ContractName'].value }).subscribe(
            (e) => {
              if (e && e.status === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(e.oResponse);
              } else {
                if (e.errorMessage) {
                  this.errorService.emitError(e);
                  return;
                }
                this.otherParams['blnContractNameJustSet'] = true;
                if (e.strFoundAccount.toUpperCase() === GlobalConstant.Configuration.Yes) {
                  this.accountFound = true;
                  this.inputParamsAccount.parentMode = 'ContractSearch';
                  this.inputParamsAccount.searchValue = this.contractFormGroup.controls['ContractName'].value;
                  this.autoOpenAccount = true;
                  setTimeout(() => {
                    this.autoOpenAccount = false;
                    this.inputParamsAccount.parentMode = 'LookUp';
                    this.inputParamsAccount.searchValue = '';
                  }, 100);
                } else {
                  if (this.contractFormGroup.controls['AccountNumber'] && this.contractFormGroup.controls['AccountNumber'].value !== '') {
                    this.otherParams['disableNameSearch'] = false;
                  } else {
                    if (this.sysCharParams['vSCRunPAFSearchOn1stAddressLine']) {
                      let elemList = document.querySelectorAll('#tabCont .nav-tabs li a');
                      elemList[0]['click']();
                      this.storeData['otherParams']['zipCodeFromOther'] = true;
                      this.onGetAddressClick({});
                    }
                  }
                }
              }
            },
            (error) => {
              this.errorService.emitError(error);
            }
          );

        }
      }
    }
  }

  public accountModalHidden(event: any): void {
    setTimeout(() => {
      if (this.accountFound) {
        if (this.contractFormGroup.controls['AccountNumber'] && this.contractFormGroup.controls['AccountNumber'].value !== '') {
          this.otherParams['disableNameSearch'] = false;
        } else {
          if (this.sysCharParams['vSCRunPAFSearchOn1stAddressLine']) {
            let elemList = document.querySelectorAll('#tabCont .nav-tabs li a');
            elemList[0]['click']();
            this.storeData['otherParams']['zipCodeFromOther'] = true;
            this.onGetAddressClick({});
          }
        }
      }
      this.accountFound = false;
    }, 500);
  }

  public onGetAddressClick(event: any): void {
    if (this.storeData['formGroup'] && !this.storeData['formGroup'].typeA.controls['GetAddress'].disabled) {
      if (this.sysCharParams['vSCEnableHopewiserPAF']) {
        // statement
      } else if (this.sysCharParams['vSCEnableMarktSelect']) {
        // statement
      } else if (this.sysCharParams['vSCEnableDatabasePAF']) {
        //this.otherParams['postCodeAutoOpen'] = true;
        //this.store.dispatch({ type: ContractActionTypes.SAVE_OTHER_PARAMS, payload: this.otherParams });
      }
      this.otherParams['postCodeAutoOpen'] = true;
      this.store.dispatch({ type: ContractActionTypes.SAVE_OTHER_PARAMS, payload: this.otherParams });
    }
  }

  public onTrialPeriodIndChange(event: any): void {
    if (this.sysCharParams['vSCEnableTrialPeriodServices']) {
      if (this.contractFormGroup.controls['TrialPeriodInd'] && this.contractFormGroup.controls['TrialPeriodInd'].value) {
        this.otherParams['vTrialPeriodInd'] = true;
        this.storeData['fieldRequired'].typeA.countryCode = false;
        this.storeData['fieldRequired'].typeB.advanceInvoiceInd = false;
        this.storeData['fieldRequired'].typeB.invoiceFrequencyCode = false;
        this.storeData['fieldRequired'].typeB.minimumDurationCode = false;
        this.storeData['fieldRequired'].typeB.minimumExpiryDate = false;
        this.storeData['fieldRequired'].typeB.paymentTypeCode = false;
        this.storeData['fieldRequired'].typeB.invoiceFeeCode = false;
        this.storeData['fieldRequired'].typeC.companyVATNumber = false;
        this.storeData['fieldRequired'].typeC.noticePeriod = false;

        if (this.storeData['formGroup'].typeB.controls['AdvanceInvoiceInd']) {
          this.storeData['formGroup'].typeB.controls['AdvanceInvoiceInd'].clearValidators();
        }
        if (this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode']) {
          this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].clearValidators();
        }
        if (this.storeData['formGroup'].typeB.controls['MinimumDurationCode']) {
          this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].clearValidators();
        }
        if (this.storeData['formGroup'].typeB.controls['PaymentTypeCode']) {
          this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].clearValidators();
        }
        if (this.storeData['formGroup'].typeB.controls['InvoiceFeeCode']) {
          this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].clearValidators();
        }
        if (this.storeData['formGroup'].typeC.controls['NoticePeriod']) {
          this.storeData['formGroup'].typeC.controls['NoticePeriod'].clearValidators();
        }
        if (this.storeData['formGroup'].typeC.controls['CompanyVATNumber']) {
          this.storeData['formGroup'].typeC.controls['CompanyVATNumber'].clearValidators();
        }
        this.storeData['formGroup'].typeB.updateValueAndValidity();
        this.storeData['formGroup'].typeC.updateValueAndValidity();
      } else {
        this.otherParams['vTrialPeriodInd'] = false;
        this.storeData['fieldRequired'].typeA.countryCode = true;
        this.storeData['fieldRequired'].typeB.advanceInvoiceInd = true;
        this.storeData['fieldRequired'].typeB.invoiceFrequencyCode = true;
        this.storeData['fieldRequired'].typeB.minimumDurationCode = true;
        this.storeData['fieldRequired'].typeB.minimumExpiryDate = true;
        this.storeData['fieldRequired'].typeB.paymentTypeCode = true;
        this.storeData['fieldRequired'].typeC.companyVATNumber = true;

        if (this.storeData['formGroup'].typeB.controls['PaymentTypeCode']) {
          this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].setValidators(Validators.required);
        }
        if (this.storeData['formGroup'].typeB.controls['AdvanceInvoiceInd']) {
          this.storeData['formGroup'].typeB.controls['AdvanceInvoiceInd'].setValidators(Validators.required);
        }
        if (this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode']) {
          this.storeData['formGroup'].typeB.controls['InvoiceFrequencyCode'].setValidators(Validators.required);
        }
        if (this.storeData['formGroup'].typeB.controls['MinimumDurationCode']) {
          this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].setValidators(Validators.required);
        }
        if (this.storeData['formGroup'].typeC.controls['CompanyVATNumber']) {
          this.storeData['formGroup'].typeC.controls['CompanyVATNumber'].setValidators(Validators.required);
        }
        this.storeData['formGroup'].typeB.updateValueAndValidity();
        this.storeData['formGroup'].typeC.updateValueAndValidity();
      }

      if (this.otherParams['vTrialPeriodInd'] && !this.contractFormGroup.controls['TrialPeriodInd'].value && this.otherParams['vSaveUpdate'] === true) {
        this.errorService.emitError({
          errorMessage: MessageConstant.Message.TrialSwitchedOff
        });
      } else {
        this.displayList.trialPeriodInd = false;
        this.storeData['formGroup'].typeB.controls['InvoiceAnnivDate'].enable();
        this.fetchContractDataPost('UpdateContractTrialInd', { action: '7' }, { ContractNumber: this.contractFormGroup.controls['ContractNumber'].value }).subscribe(
          (e) => {
            if (e.status === GlobalConstant.Configuration.Failure) {
              this.errorService.emitError(e.oResponse);
            }
          },
          (error) => {
            this.errorService.emitError(error);
          }
        );
      }

    }
  }

  public onContractNumberBlur(event: any, mode?: any): void {
    if (event.target && this.addMode === true) {
      return;
    }
    if (this.contractFormGroup.controls['ContractNumber'].value !== '') {
      if (this.storeData['data'] && !(Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object)) {
        if (event.target && this.contractFormGroup.controls['ContractNumber'].value === this.storeData['data'].ContractNumber) {
          return;
        } else if (!event.target) {
          if (this.storeData['sentFromParent'].ContractNumber && this.storeData['data'].ContractNumber !== this.storeData['sentFromParent'].ContractNumber) {
            this.storeData['data'].ContractNumber = this.storeData['sentFromParent'].ContractNumber;
          }
          if (mode) {
            this.onContractDataReceived(this.storeData['data'], false, mode);
          } else {
            this.onContractDataReceived(this.storeData['data'], false);
          }
          return;
        }
      }
      let paddedValue = this.numberPadding(this.contractFormGroup.controls['ContractNumber'].value, 8);
      this.contractFormGroup.controls['ContractNumber'].setValue(paddedValue);
      this.fetchContractData('', { ContractNumber: paddedValue, ContractTypeCode: this.inputParams.currentContractType }).subscribe((e) => {
        if (e.status === GlobalConstant.Configuration.Failure) {
          this.errorService.emitError(e.oResponse);
        } else {
          if (!e['errorMessage'] && !e['error']) {
            if (mode) {
              this.onContractDataReceived(e, false, mode);
            } else {
              this.onContractDataReceived(e, false);
            }
          } else {
            this.errorService.emitError(e);
            return;
          }
        }
      });

    } else if (this.storeData['sentFromParent'] && this.storeData['sentFromParent'].ContractRowID) {
      this.fetchContractData('', { ContractRowID: this.storeData['sentFromParent'].ContractRowID, ContractTypeCode: this.inputParams.currentContractType }).subscribe((e) => {
        if (e.status === GlobalConstant.Configuration.Failure) {
          this.errorService.emitError(e.oResponse);
        } else {
          if (!e['errorMessage'] && !e['error']) {
            if (mode) {
              this.onContractDataReceived(e, false, mode);
            } else {
              this.onContractDataReceived(e, false);
            }
          } else {
            this.errorService.emitError(e);
            return;
          }
        }
      });
    }
  }

  public setValueInControls(control: any, value: any): void {
    if (control) {
      control.setValue(value);
    }
  }

  public checkFalsy(value: any): string {
    if (value === null || value === undefined) {
      return '';
    } else {
      return value.toString().trim();
    }
  }

  public onAccountBlur(event: any): void {
    this.store.dispatch({
      type: ContractActionTypes.SAVE_FIELD, payload: {
        AccountNumber: this.contractFormGroup.controls['AccountNumber'].value
      }
    });
    if (this.contractFormGroup.controls['AccountNumber'].value) {
      let paddedValue = this.numberPadding(this.contractFormGroup.controls['AccountNumber'].value, 9);
      this.contractFormGroup.controls['AccountNumber'].setValue(paddedValue);
      let params = {
        'AccountNumber': this.contractFormGroup.controls['AccountNumber'].value,
        'Function': 'GetAccountDetails,GetExistingMandate,GetDefaults,GetPaymentTypeDetails,GetNoticePeriod,GetAccountDiscounts',
        'CompanyCode': this.storeData['formGroup'].typeC.controls['CompanyCode'] ? this.storeData['formGroup'].typeC.controls['CompanyCode'].value : '',
        'ContractTypeCode': this.inputParams.currentContractType,
        'PaymentTypeCode': this.storeData['formGroup'].typeB.controls['PaymentTypeCode'] ? this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].value : '',
        'ContractNumber': this.contractFormGroup.controls['ContractNumber'] ? this.contractFormGroup.controls['ContractNumber'].value : '',
        'BranchNumber': this.contractFormGroup.controls['NegBranchNumber'] ? this.contractFormGroup.controls['NegBranchNumber'].value : '',
        'action': '6'
      };
      this.ajaxSource.next(this.ajaxconstant.START);
      this.fetchAccountData(params, this.queryParamsContract).subscribe(
        (e) => {
          this.ajaxSource.next(this.ajaxconstant.COMPLETE);
          if (e && !e.errorNumber) {
            this.contractFormGroup.controls['ContractName'].setValue(this.checkFalsy(e.ContractName));
            this.contractFormGroup.controls['AccountName'].setValue(this.checkFalsy(e.ContractName));
            this.setValueInControls(this.storeData['formGroup'].typeA.controls['ContractAddressLine1'], this.checkFalsy(e.ContractAddressLine1));
            this.setValueInControls(this.storeData['formGroup'].typeA.controls['ContractAddressLine2'], this.checkFalsy(e.ContractAddressLine2));
            this.setValueInControls(this.storeData['formGroup'].typeA.controls['ContractAddressLine3'], this.checkFalsy(e.ContractAddressLine3));
            this.setValueInControls(this.storeData['formGroup'].typeA.controls['ContractAddressLine4'], this.checkFalsy(e.ContractAddressLine4));
            this.setValueInControls(this.storeData['formGroup'].typeA.controls['ContractAddressLine5'], this.checkFalsy(e.ContractAddressLine5));
            this.setValueInControls(this.storeData['formGroup'].typeA.controls['ContractPostcode'], this.checkFalsy(e.ContractPostcode));
            this.setValueInControls(this.storeData['formGroup'].typeA.controls['GPSCoordinateX'], this.checkFalsy(e.GPSCoordinateX));
            this.setValueInControls(this.storeData['formGroup'].typeA.controls['GPSCoordinateY'], this.checkFalsy(e.GPSCoordinateY));
            this.setValueInControls(this.storeData['formGroup'].typeA.controls['ContractContactName'], this.checkFalsy(e.ContractContactName));
            this.setValueInControls(this.storeData['formGroup'].typeA.controls['ContractContactPosition'], this.checkFalsy(e.ContractContactPosition));
            this.setValueInControls(this.storeData['formGroup'].typeA.controls['ContractContactDepartment'], this.checkFalsy(e.ContractContactDepartment));
            this.setValueInControls(this.storeData['formGroup'].typeA.controls['ContractContactTelephone'], this.checkFalsy(e.ContractContactTelephone));
            this.setValueInControls(this.storeData['formGroup'].typeA.controls['ContractContactFax'], this.checkFalsy(e.ContractContactFax));
            this.setValueInControls(this.storeData['formGroup'].typeA.controls['ContractContactEmail'], this.checkFalsy(e.ContractContactEmail));
            this.setValueInControls(this.storeData['formGroup'].typeA.controls['ContractContactMobile'], this.checkFalsy(e.ContractContactMobile));

            this.setValueInControls(this.storeData['formGroup'].typeC.controls['SalesEmployee'], this.checkFalsy(e.ContractSalesEmployee));
            this.setValueInControls(this.storeData['formGroup'].typeC.controls['SalesEmployeeSurname'], this.checkFalsy(e.SalesEmployeeSurname));
            this.setValueInControls(this.storeData['formGroup'].typeC.controls['ContractOwner'], this.checkFalsy(e.ContractOwner));
            this.setValueInControls(this.storeData['formGroup'].typeC.controls['ContractOwnerSurname'], this.checkFalsy(e.ContractOwnerSurname));
            this.setValueInControls(this.storeData['formGroup'].typeC.controls['CompanyVatNumber'], this.checkFalsy(e.CompanyVATNumber));
            this.setValueInControls(this.storeData['formGroup'].typeC.controls['CompanyRegistrationNumber'], this.checkFalsy(e.CompanyRegistrationNumber));
            let dataReg = [
              {
                'table': 'Account',
                'query': { 'BusinessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode(), 'AccountNumber': this.contractFormGroup.controls['AccountNumber'] ? this.contractFormGroup.controls['AccountNumber'].value : '' },
                'fields': ['AccountName', 'AccountNumber', 'NationalAccount', 'AccountBalance']
              }];

            Observable.forkJoin(
              this.lookUpRecord(dataReg, 100)
            ).subscribe((data) => {
              if (data[0] && !data[0]['errorMessage']) {
                if (data[0]['results'] && data[0]['results'][0].length > 0) {
                  if (data[0]['results'][0][0].NationalAccount) {
                    if (data[0]['results'][0][0].NationalAccount === true || data[0]['results'][0][0].NationalAccount.toString().toUpperCase() === GlobalConstant.Configuration.Yes) {
                      this.isNationalAccount = true;
                      if (this.sysCharParams['vSCNationalAccountChecked'] && (e.NationalAccountchecked && e.NationalAccountchecked.toUpperCase() === GlobalConstant.Configuration.Yes)) {
                        this.displayList.nationalAccount = true;
                      } else {
                        this.displayList.nationalAccount = false;
                      }
                    } else {
                      this.isNationalAccount = false;
                    }
                  } else {
                    this.isNationalAccount = false;
                  }
                }
              }
            });

            if (e.ContractHasExpired && e.ContractHasExpired.toUpperCase() === GlobalConstant.Configuration.Yes) {
              this.displayList.expired = true;
            } else {
              this.displayList.expired = false;
            }
            this.setValueInControls(this.contractFormGroup.controls['NationalAccountchecked'], e.NationalAccountchecked);
            if (e.GroupAccountNumber !== '') {
              this.setValueInControls(this.contractFormGroup.controls['GroupAccountNumber'], e.GroupAccountNumber);
              this.setValueInControls(this.contractFormGroup.controls['GroupName'], e.GroupName);
              this.inputParamsAccount['groupAccountNumber'] = e.GroupAccountNumber;
              this.inputParamsAccount['groupName'] = e.GroupName;
            } else {
              this.setValueInControls(this.contractFormGroup.controls['GroupAccountNumber'], '');
              this.setValueInControls(this.contractFormGroup.controls['GroupName'], '');
              this.inputParamsAccount['groupAccountNumber'] = '';
              this.inputParamsAccount['groupName'] = '';
            }

            this.setValueInControls(this.storeData['formGroup'].typeB.controls['BankAccountSortCode'], e.BankAccountSortCode);
            this.setValueInControls(this.storeData['formGroup'].typeB.controls['BankAccountNumber'], e.BankAccountNumber);
            this.setValueInControls(this.storeData['formGroup'].typeC.controls['ExternalReference'], e.ExternalReference);

            if (e.VATExempt && e.VATExempt.toUpperCase() === GlobalConstant.Configuration.Yes) {
              this.setValueInControls(this.storeData['formGroup'].typeB.controls['VATExempt'], true);
            } else {
              this.setValueInControls(this.storeData['formGroup'].typeB.controls['VATExempt'], false);
            }

            this.setValueInControls(this.storeData['formGroup'].typeB.controls['PaymentTypeCode'], e.PaymentTypeCode);
            this.setValueInControls(this.storeData['formGroup'].typeB.controls['PaymentDesc'], e.PaymentDesc);
            this.otherParams['PaymentDesc'] = e.PaymentDesc;

            this.setValueInControls(this.storeData['formGroup'].typeB.controls['VADDMandateNumber'], e.VADDMandateNumber);
            this.setValueInControls(this.storeData['formGroup'].typeB.controls['VADDBranchNumber'], e.VADDBranchNumber);
            this.setValueInControls(this.storeData['formGroup'].typeC.controls['CompanyRegistrationNumber'], e.CompanyRegistrationNumber);
            if (e.LimitedCompanyInd && e.LimitedCompanyInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
              this.setValueInControls(this.storeData['formGroup'].typeC.controls['LimitedCompany'], true);
            } else {
              this.setValueInControls(this.storeData['formGroup'].typeC.controls['LimitedCompany'], false);
            }
            this.storeData['fieldVisibility'].typeB.invoiceFeeCode = false;
            this.storeData['fieldRequired'].typeB.invoiceFeeCode = false;
            this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].clearValidators();
            this.storeData['formGroup'].typeA.controls['GetAddress'].disable();
            //if (this.sysCharParams['vSCEnablePostcodeDefaulting'])
            this.fetchDefaultEmployee();
            this.store.dispatch({
              type: ContractActionTypes.PARENT_TO_CHILD_COMPONENT, payload: e
            });

          } else {
            this.storeData['fieldVisibility'].typeB.invoiceFeeCode = false;
            this.storeData['fieldRequired'].typeB.invoiceFeeCode = false;
            this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].clearValidators();
            this.storeData['formGroup'].typeA.controls['GetAddress'].disable();
            this.errorService.emitError(e);
          }
        },
        (error) => {
          this.ajaxSource.next(this.ajaxconstant.COMPLETE);
          this.errorService.emitError(error);
        }
      );

      let data = [{
        'table': 'Account',
        'query': { 'BusinessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode(), 'AccountNumber': this.contractFormGroup.controls['AccountNumber'] ? this.contractFormGroup.controls['AccountNumber'].value : '' },
        'fields': ['NationalAccount', 'AccountBalance']
      }];
      this.lookUpRecord(data, 5).subscribe(
        (e) => {
          if (e['results'] && e['results'].length > 0) {
            if (e['results'][0].length > 0) {
              this.contractFormGroup.controls['AccountBalance'].setValue(e['results'][0][0]['AccountBalance']);
            }
          }
        },
        (error) => {
          // error statement
        }
      );
    } else {
      this.contractFormGroup.controls['AccountName'].setValue('');
      this.contractSearchParams['accountNumber'] = '';
      this.contractSearchParams['accountName'] = '';
      this.storeData['fieldVisibility'].typeB.invoiceFeeCode = true;
      this.storeData['fieldRequired'].typeB.invoiceFeeCode = true;
      this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].setValidators(Validators.required);
      if (this.sysCharParams['vSCEnableInvoiceFee'] && this.storeData['params']['currentContractType'] === 'C') {
        this.storeData['fieldVisibility'].typeB.invoiceFeeCode = true;
        this.storeData['fieldRequired'].typeB.invoiceFeeCode = true;
        this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].setValidators(Validators.required);
      } else {
        this.storeData['fieldVisibility'].typeB.invoiceFeeCode = false;
        this.storeData['fieldRequired'].typeB.invoiceFeeCode = false;
        this.storeData['formGroup'].typeB.controls['InvoiceFeeCode'].clearValidators();
      }
      this.storeData['formGroup'].typeA.controls['GetAddress'].enable();
    }
  }

  public fetchDefaultEmployee(): void {
    this.fetchContractData('DefaultFromPostcode', {
      action: '6',
      BranchNumber: this.contractFormGroup.controls['NegBranchNumber'] ? this.contractFormGroup.controls['NegBranchNumber'].value : this.otherParams['currentBranchNumber'],
      ContractPostcode: this.storeData['formGroup'].typeA.controls['ContractPostcode'] ? this.storeData['formGroup'].typeA.controls['ContractPostcode'].value : '',
      ContractAddressLine4: this.storeData['formGroup'].typeA.controls['ContractAddressLine4'] ? this.storeData['formGroup'].typeA.controls['ContractAddressLine4'].value : '',
      ContractAddressLine5: this.storeData['formGroup'].typeA.controls['ContractAddressLine5'] ? this.storeData['formGroup'].typeA.controls['ContractAddressLine5'].value : ''
    }).subscribe(
      (data) => {
        if (data.status === GlobalConstant.Configuration.Failure) {
          // error statement
        } else {
          if (!data.errorMessage) {
            if (this.storeData['formGroup'].typeC.controls['SalesEmployee']) {
              this.storeData['formGroup'].typeC.controls['SalesEmployee'].setValue(data.ContractSalesEmployee);
            }
            if (this.storeData['formGroup'].typeC.controls['SalesEmployeeSurname']) {
              this.storeData['formGroup'].typeC.controls['SalesEmployeeSurname'].setValue(data.SalesEmployeeSurname);
            }
          }
        }
      },
      (error) => {
        //this.errorService.emitError(error);
      }
      );
  }

  public fetchContractCopy(contractNumer: any): void {
    this.getContractCopyData({
      Function: 'ContractCopy',
      FunctionName: 'ContractCopy',
      action: '0',
      ContractNumber: contractNumer ? contractNumer : this.contractFormGroup.controls['ContractNumber'].value
    }).subscribe(
      (data) => {
        if (data.status === GlobalConstant.Configuration.Failure) {
          // error statement
        } else {
          console.log(data);
        }
      },
      (error) => {
        //this.errorService.emitError(error);
      }
      );
  }

  public onGroupAccountBlur(event: any): void {
    if (this.contractFormGroup.controls['GroupAccountNumber'].value && this.contractFormGroup.controls['GroupAccountNumber'].value !== '') {
      let data = [{
        'table': 'GroupAccount',
        'query': { 'GroupAccountNumber': this.contractFormGroup.controls['GroupAccountNumber'].value },
        'fields': ['GroupAccountNumber', 'GroupName']
      },
      {
        'table': 'GroupAccountPriceGroup',
        'query': {
          'GroupAccountPriceGroupID': this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'] ? this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value : '',
          'GroupAccountNumber': this.contractFormGroup.controls['GroupAccountNumber'].value
        },
        'fields': ['GroupAccountPriceGroupID', 'GroupAccountPriceGroupDesc']
      }];
      this.lookUpRecord(data, 5).subscribe(
        (e) => {
          if (e['results'] && e['results'].length > 0) {
            if (e['results'][0].length > 0) {
              this.contractFormGroup.controls['GroupName'].setValue(e['results'][0][0]['GroupName']);
              this.inputParamsAccount['groupAccountNumber'] = this.contractFormGroup.controls['GroupAccountNumber'].value;
              this.inputParamsAccount['groupName'] = e['results'][0][0]['GroupName'];
              if (e['results'][1].length > 0) {
                if (this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value !== '') {
                  this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupDesc'].setValue(e['results'][1][0]['GroupAccountPriceGroupDesc']);
                }
              } else {
                if (this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value !== '') {
                  this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupDesc'].setValue('');
                  this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].setErrors({});
                }
              }
            } else {
              this.contractFormGroup.controls['GroupName'].setValue('');
              this.contractFormGroup.controls['GroupAccountNumber'].setErrors({});
              this.inputParamsAccount['groupAccountNumber'] = '';
              this.inputParamsAccount['groupName'] = '';
              if (this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].value !== '') {
                this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupID'].setErrors({});
                this.storeData['formGroup'].typeC.controls['GroupAccountPriceGroupDesc'].setValue('');
              }
            }

          } else {
            this.contractFormGroup.controls['GroupAccountNumber'].setErrors({});
            this.contractFormGroup.controls['GroupName'].setValue('');
            this.inputParamsAccount['groupAccountNumber'] = '';
            this.inputParamsAccount['groupName'] = '';
          }
        },
        (error) => {
          // error statement
          this.contractFormGroup.controls['GroupAccountNumber'].setErrors({});
          this.contractFormGroup.controls['GroupName'].setValue('');
          this.inputParamsAccount['groupAccountNumber'] = '';
          this.inputParamsAccount['groupName'] = '';
        }
      );
    } else {
      this.contractFormGroup.controls['GroupName'].setValue('');
      this.inputParamsAccount['groupAccountNumber'] = '';
      this.inputParamsAccount['groupName'] = '';
    }
  }

  public onNegBranchNumberBlur(event: any): void {
    let found: boolean = false;
    for (let i = 0; i < this.branchList.length; i++) {
      if (this.contractFormGroup.controls['NegBranchNumber'].value === this.branchList[i].branchNumber.toString()) {
        this.contractFormGroup.controls['BranchName'].setValue(this.branchList[i].branchName);
        this.negBranchNumberSelected = {
          id: '',
          text: this.contractFormGroup.controls['NegBranchNumber'].value + ' - ' + this.contractFormGroup.controls['BranchName'].value
        };
        found = true;
      }
    }
    if (!found) {
      this.contractFormGroup.controls['NegBranchNumber'].setValue('');
      this.contractFormGroup.controls['BranchName'].setValue('');
    }
  }

  public onBranchDataReceived(data: any): void {
    this.contractFormGroup.controls['NegBranchNumber'].setValue(data.BranchNumber);
    this.contractFormGroup.controls['BranchName'].setValue(data.BranchName);
    this.contractFormGroup.controls['NegBranchNumber'].markAsDirty();
    if (this.addMode)
      this.fetchDefaultEmployee();
    this.store.dispatch({
      type: ContractActionTypes.SET_EMPLOYEE_ON_BRANCH_CHANGE
    });
  }

  public numberPadding(num: any, size: any): string {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  }

  public setTabAttribute(): void {
    let elements = document.querySelectorAll('#tabCont ul.nav-tabs li:not(.active) a');
    let activeElem = document.querySelector('#tabCont ul.nav-tabs li.active a');
    for (let i = 0; i < elements.length; i++) {
      elements[i].setAttribute('tabindex', '-1');
    }
    if (activeElem)
      activeElem.removeAttribute('tabindex');
  }

  public commenceDateService(): void {
    if (this.commenceDateDisplay && (this.addMode)) {
      let functionName = '';
      let params = {};
      let obj = {};
      let serviceObj = {};
      if (this.storeData['params']['currentContractType'] === 'C') {
        functionName = 'GetAnniversaryDate,GetMinimumExpiryDate,GetExpiryDate';
      } else if (this.storeData['params']['currentContractType'] === 'J') {
        functionName = 'GetAnniversaryDate,GetJobExpiryDate';
      } else if (this.storeData['params']['currentContractType'] === 'P') {
        functionName = 'GetAnniversaryDate,GetPaymentTypeDetails,GetNoticePeriod';
      }
      obj = {
        action: '6',
        ContractCommenceDate: this.contractFormGroup.controls['ContractCommenceDate'].value ? this.contractFormGroup.controls['ContractCommenceDate'].value : '',
        MinimumDurationCode: this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].value ? this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].value : '',
        ContractDurationCode: this.storeData['formGroup'].typeB.controls['ContractDurationCode'].value ? this.storeData['formGroup'].typeB.controls['ContractDurationCode'].value : '',
        CompanyCode: this.storeData['formGroup'].typeC.controls['CompanyCode'].value ? this.storeData['formGroup'].typeC.controls['CompanyCode'].value : ''
      };
      for (let o in obj) {
        if (obj[o] !== '') {
          serviceObj[o] = obj[o];
        }
      }
      this.fetchContractData(functionName, serviceObj).subscribe(
        (e) => {
          if (e.status === GlobalConstant.Configuration.Failure) {
            this.errorService.emitError(e.oResponse);
          } else {
            if (!e['errorMessage']) {
              this.store.dispatch({
                type: ContractActionTypes.PARENT_TO_CHILD_COMPONENT, payload: e
              });
            }
          }
        },
        (error) => {
          this.errorService.emitError(error);
        }
      );
    }
  }

  public commenceDateSelectedValue(value: Object): void {
    if (value && value['value']) {
      if (value['value'] !== this.commenceDateDisplay) {
        this.commenceDateDisplay = value['value'];
        this.contractFormGroup.controls['ContractCommenceDate'].setValue(this.commenceDateDisplay);
        this.contractFormGroup.controls['ContractCommenceDate'].markAsDirty();
        this.commenceDateService();
      }
    } else {
      this.commenceDateDisplay = '';
      this.contractFormGroup.controls['ContractCommenceDate'].setValue('');
      if (value['value'] !== this.commenceDateDisplay) {
        this.commenceDateService();
      }
    }
  }

  public inactiveEffectDateSelectedValue(value: Object): void {
    if (value && value['value']) {
      this.inactiveEffectDateDisplay = value['value'];

    } else {
      this.inactiveEffectDateDisplay = '';
    }
  }
  public formPristine(): void {
    if (this.storeData['formGroup'].main)
      this.storeData['formGroup'].main.markAsPristine();
    if (this.storeData['formGroup'].typeA)
      this.storeData['formGroup'].typeA.markAsPristine();
    if (this.storeData['formGroup'].typeB)
      this.storeData['formGroup'].typeB.markAsPristine();
    if (this.storeData['formGroup'].typeC)
      this.storeData['formGroup'].typeC.markAsPristine();
    if (this.storeData['formGroup'].typeD)
      this.storeData['formGroup'].typeD.markAsPristine();
    if (this.storeData['formGroup'].typeE)
      this.storeData['formGroup'].typeE.markAsPristine();
  }
  public checkFormDirty(): boolean {
    if (this.storeData['formGroup'].main && this.storeData['formGroup'].main.dirty)
      return true;
    if (this.storeData['formGroup'].typeA && this.storeData['formGroup'].typeA.dirty)
      return true;
    if (this.storeData['formGroup'].typeB && this.storeData['formGroup'].typeB.dirty)
      return true;
    if (this.storeData['formGroup'].typeC && this.storeData['formGroup'].typeC.dirty)
      return true;
    if (this.storeData['formGroup'].typeD && this.storeData['formGroup'].typeD.dirty)
      return true;
    if (this.storeData['formGroup'].typeE && this.storeData['formGroup'].typeE.dirty)
      return true;

    return false;
  }
  /*
  *   Alerts user when user is moving away without saving the changes. //CR implementation
  */
  @ViewChild('routeAwayComponent') public routeAwayComponent;
  public canDeactivate(): Observable<boolean> {
    if (this.navigateToPremise) {
      this.routeAwayGlobals.resetRouteAwayFlags();
      this.navigateToPremise = false;
    } else {
      this.routeAwayGlobals.setSaveEnabledFlag(this.checkFormDirty());
    }
    return this.routeAwayComponent.canDeactivate();
  }
  public routeAwayUpdateSaveFlag(): void {
    this.routeAwayGlobals.setDirtyFlag(true);
  }
}
