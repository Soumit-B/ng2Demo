import { Component, NgZone, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { HttpService } from './../../../../shared/services/http-service';
import { ContractActionTypes } from '../../../../app/actions/contract';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { ErrorService } from '../../../../shared/services/error.service';
import { GlobalConstant } from './../../../../shared/constants/global.constant';
import { DropdownStaticComponent } from './../../../../shared/components/dropdown-static/dropdownstatic';
import { Utils } from '../../../../shared/services/utility';
import { LocaleTranslationService } from '../../../../shared/services/translation.service';
import { ActionTypes } from './../../../actions/prospect';
import { RiExchange } from './../../../../shared/services/riExchange';
import { PaymentSearchComponent } from '../../../../app/internal/search/iCABSBPaymentTypeSearch';
import { BranchSearchComponent } from '../../../../app/internal/search/iCABSBBranchSearch';
import { EmployeeSearchComponent } from '../../../../app/internal/search/iCABSBEmployeeSearch';
import { EllipsisComponent } from '../../../../shared/components/ellipsis/ellipsis';
import { AUPostcodeSearchComponent } from '../../../../app/internal/grid-search/iCABSAAUPostcodeSearch';
import { ContactMediumLanguageSearchComponent } from '../../../../app/internal/search/iCABSSContactMediumLanguageSearch.component';
import { PostCodeSearchComponent } from '../../../../app/internal/search/iCABSBPostcodeSearch.component';


@Component({
  selector: 'icabs-maintenance-type-b',
  templateUrl: 'maintenanceTabPremise.html'
})

export class MaintenanceTypePremiseComponent implements OnInit, OnDestroy {
  /**
   * Create ViewChild for  dropdown component
   */
  @ViewChild('LOSCodeSelectDropdown') LOSCodeSelectDropdown: DropdownStaticComponent;
  @ViewChild('BusinessOriginCodeSelectDropdown') BusinessOriginCodeSelectDropdown: DropdownStaticComponent;
  @ViewChild('BusinessSourceCodeSelectDropdown') BusinessSourceCodeSelectDropdown: DropdownStaticComponent;
  @ViewChild('BusinessOriginDetailCodeSelectDropdown') BusinessOriginDetailCodeSelectDropdown: DropdownStaticComponent;
  @ViewChild('BranchNumberDropdwon') BranchNumberDropdwon: BranchSearchComponent;
  @ViewChild('premiseContainer') premiseContainer: ElementRef;
  @ViewChild('messageModal') public messageModal;
  @ViewChild('employeeSearchEllipsis') employeeSearchEllipsis: EllipsisComponent;
  @ViewChild('postcodeSearchEllipsis') public postcodeSearchEllipsis: EllipsisComponent;
  @ViewChild('postcodeSearchSBEllipsis') public postcodeSearchSBEllipsis: EllipsisComponent;
  @ViewChild('errorModal') public errorModal;

  private isBuisinessSourceUpdated: boolean = false;
  private requiredList: string = '';
  private parentFormData: any;
  private storeFormData: Array<any> = [];

  public showMessageHeader: boolean = true;
  public queryParamsProspect: any = {
    action: '0',
    operation: 'ContactManagement/iCABSCMPipelineProspectMaintenance',
    module: 'prospect',
    method: 'prospect-to-contract/maintenance',
    contentType: 'application/x-www-form-urlencoded',
    branchNumber: '',
    branchName: ''
  };
  public inputParamsForBranchSearch: any = {
    'parentMode': 'ProspectPipeline'
  };
  public inputParamsContactMediumLanguageSearch: any = {
    'parentMode': 'PipelineProspectMaintenance'
  };
  public contactMediumLanguageSearchComponent: any = ContactMediumLanguageSearchComponent;
  public postcodeSearchComponent = AUPostcodeSearchComponent;
  public inputParams: any = { 'parentMode': 'Contract-Search', 'ContractTypeCode': 'J', 'businessCode': '', 'countryCode': '' };
  public storeSubscription: Subscription;
  public querySubscription: Subscription;
  public translateSubscription: Subscription;
  public maintenancePremiseFormGroup: FormGroup;
  public defaultlineOfServiceOptions: string = '';
  public systemParametersFromParent: any = { ttBusiness: [{}], systemChars: {} };
  public defaultContractExpiryDate = new Date();
  public defaultCommenceDate = new Date();
  public defaultWODate = new Date();
  public isCheckedDecisionMakerInd: boolean = false;
  public isCheckedPDALeadInd: boolean = false;
  public showCloseButton = true;
  public inputParamsPaymentType: any = { 'parentMode': 'LookUp', 'countryCode': '', 'businessCode': '' };
  public modalConfig: any = {
    backdrop: 'static',
    keyboard: true
  };
  public poscodeSearchHide: boolean = false;

  public ellipsisDisable: any = {
    poscodeSearchDisable: false,
    isEmployeeSearchEllipsisDisabled: false,
    isPaymentTypeEllipsisDisabled: false,
    isPDAEmployeeSearchEllipsisDisabled: true
  };
  public paymentTypeCodeComponent: any = PaymentSearchComponent;
  public postcodeSearchSBComponent = PostCodeSearchComponent;
  public showHeader = true;
  public inputParamsEmployeeSearch: any = { 'parentMode': 'LookUp-ProspectAssignTo', 'salesBranchNumber': 0 };
  public inputParamsPDAEmployeeSearch: any = { 'parentMode': 'LookUp-PDALead' };
  public inputParamsNegotiatingSalesEmployeeSearch: any = { 'parentMode': 'LookUp-NegSales' };
  public inputParamsServiceEmployeeSearch: any = { 'parentMode': 'LookUp-ServiceSales' };
  public employeeSearchComponent = EmployeeSearchComponent;
  public inputParamsPostcode: any = { parentMode: 'PremiseProspect', PremisePostCode: '', PremiseAddressLine5: '', PremiseAddressLine4: '' };
  public isSubmitClick: boolean = false;

  public fieldVisibility: any = {
    'isHiddenLOSCodeSelect': false,
    'isHiddenPremiseName': false,
    'isHiddenPremiseAddressLine1': false,
    'isHiddenPremiseAddressLine2': false,
    'isHiddenPremiseAddressLine3': false,
    'isHiddenPremiseAddressLine4': false,
    'isHiddenPremiseAddressLine5': false,
    'isHiddenPremisePostcode': false,
    'isHiddenPremiseContactName': false,
    'isHiddenPremiseContactPosition': false,
    'isHiddenPremiseContactMobile': false,
    'isHiddenPremiseContactFax': false,
    'isHiddenPremiseContactEmail': false,
    'isHiddenDecisionMakerInd': false,
    'isHiddenBusinessSourceCodeSelect': false,
    'isHiddenBusinessOriginCodeSelect': false,
    'isHiddenBusinessOriginDetailCodeSelect': false,
    'isHiddenContactMediumCode': true,
    'isHiddenContactMediumDesc': false,
    'isHiddenWOStartTime': true,
    'isHiddenAssignToEmployeeCode': false,
    'isHiddenAssignToEmployeeName': false,
    'isHiddenDefaultAssigneeEmployeeDetails': false,
    'isHiddenPDALeadEmployeeCode': false,
    'isHiddenPDALeadEmployeeSurname': false,
    'isHiddenSMSMessage': true,
    'isHiddenNatAccountDetails': true,
    'isHiddencmdGetPremiseAddress': false,
    'isHiddenPremiseContactTelephone': false
  };

  public fieldDisable: any = {
    BusinessSourceCodeSelect: false,
    BusinessOriginCodeSelect: false,
    BusinessOriginDetailCodeSelect: false,
    LOSCodeSelect: false,
    cmdGetPremiseAddress: true,
    isCheckedDecisionMakerInd: false,
    isDisablePDALeadInd: false
  };

  public formfieldDisable: any = {
    ContactMediumDesc: true,
    AssignToEmployeeName: true,
    DefaultAssigneeEmployeeDetails: true
  };

  public fieldReadOnly: any = {
    PDALeadEmployeeCode: true,
    BranchNumber: false,
    AnnualValue: false

  };

  public fieldRequired: any = {
    'LOSCodeSelect': true,
    'PremiseName': false,
    'PremiseAddressLine1': false,
    'PremiseAddressLine2': false,
    'PremiseAddressLine3': false,
    'PremiseAddressLine4': false,
    'PremiseAddressLine5': false,
    'PremisePostcode': false,
    'PremiseContactName': false,
    'PremiseContactPosition': false,
    'PremiseContactMobile': false,
    'PremiseContactFax': false,
    'PremiseContactEmail': false,
    'DecisionMakerInd': false,
    'BusinessSourceCodeSelect': false,
    'BusinessOriginCodeSelect': false,
    'BusinessOriginDetailCodeSelect': false,
    'ContactMediumCode': false,
    'ContactMediumDesc': false,
    'WODate': false,
    'WOStartTime': false,
    'WOEndTime': false,
    'AssignToEmployeeCode': false,
    'AssignToEmployeeName': false,
    'DefaultAssigneeEmployeeDetails': false,
    'PDALeadEmployeeCode': false,
    'PDALeadEmployeeSurname': false,
    'SMSMessage': false,
    'CommenceDate': false,
    'ContractExpiryDate': false,
    'AnnualValue': false,
    'PaymentTypeCode': false,
    'PaymentDesc': false,
    'NegotiatingSalesEmployeeCode': false,
    'NegotiatingSalesEmployeeSurname': false,
    'BranchNumber': false,
    'BranchName': false,
    'ServicingSalesEmployeeCode': false,
    'ServicingSalesEmployeeSurname': false,
    'PremiseContactTelephone': false
  };


  public params: any;
  public otherParams: Object;
  public sysCharParams: Object;
  public mode: Object;
  public searchModalRoute: string = '';
  public parentQueryParams: any;

  /** Initialize options array for dropdowns */
  public lineOfServiceOptions: Array<any> = [{}];
  public businessSourceCodeOptions: Array<any> = [{}];
  public businessOriginDetailCodeOptions: Array<any> = [{}];
  public businessOriginCodeOptions: Array<any> = [{}];
  public lineOfServiceOptionsValue: string = '';
  public businessSourceCodeOptionsValue: string = '';
  public businessOriginCodeOptionsValue: string = '';
  public businessOriginDetailCodeOptionsValue: string = '';

  public queryParam: URLSearchParams = new URLSearchParams();
  public queryLookUp: URLSearchParams = new URLSearchParams();
  public PremiseName = 'PremiseName';

  constructor(
    private zone: NgZone,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<any>,
    private serviceConstants: ServiceConstants,
    private httpService: HttpService,
    private errorService: ErrorService,
    private riExchange: RiExchange,
    private translateService: LocaleTranslationService,
    private utils: Utils
  ) {
    this.maintenancePremiseFormGroup = this.fb.group({
      LOSCodeSelect: [{ value: '', disabled: false }],
      PremiseName: [{ value: '', disabled: false }],
      PremiseAddressLine1: [{ value: '', disabled: false }],
      PremiseAddressLine2: [{ value: '', disabled: false }],
      PremiseAddressLine3: [{ value: '', disabled: false }],
      PremiseAddressLine4: [{ value: '', disabled: false }],
      PremiseAddressLine5: [{ value: '', disabled: false }],
      PremisePostcode: [{ value: '', disabled: false }],
      PremiseContactName: [{ value: '', disabled: false }],
      PremiseContactPosition: [{ value: '', disabled: false }],
      PremiseContactMobile: [{ value: '', disabled: false }],
      PremiseContactFax: [{ value: '', disabled: false }],
      PremiseContactTelephone: [{ value: '', disabled: false }],
      PremiseContactEmail: [{ value: '', disabled: false }],
      DecisionMakerInd: [{ value: 'no', disabled: false }],
      BusinessSourceCodeSelect: [{ value: '', disabled: this.fieldDisable.BusinessSourceCodeSelect }],
      BusinessOriginCodeSelect: [{ value: '', disabled: this.fieldDisable.BusinessOriginCodeSelect }],
      BusinessOriginDetailCodeSelect: [{ value: '', disabled: this.fieldDisable.BusinessOriginDetailCodeSelect }],
      ContactMediumCode: [{ value: '', disabled: false }],
      ContactMediumDesc: [{ value: '', disabled: true }],
      WOStartTime: [{ value: '0', disabled: false }],
      WODate: [{ value: '', disabled: false }],
      WOEndTime: [{ value: '0', disabled: false }],
      AssignToEmployeeCode: [{ value: '', disabled: false }],
      AssignToEmployeeName: [{ value: '', disabled: true }],
      DefaultAssigneeEmployeeDetails: [{ value: '', disabled: true }],
      PDALeadEmployeeCode: [{ value: '', disabled: true }],
      PDALeadEmployeeSurname: [{ value: '', disabled: true }],
      SMSMessage: [{ value: '', disabled: false }],
      CommenceDate: [{ value: '', disabled: false }],
      ContractExpiryDate: [{ value: '', disabled: false }],
      AnnualValue: [{ value: '', disabled: false }],
      PaymentTypeCode: [{ value: '', disabled: false }],
      PaymentDesc: [{ value: '', disabled: false }],
      NegotiatingSalesEmployeeCode: [{ value: '', disabled: false }],
      NegotiatingSalesEmployeeSurname: [{ value: '', disabled: false }],
      BranchNumber: [{ value: '', disabled: false }],
      BranchName: [{ value: '', disabled: false }],
      ServicingSalesEmployeeCode: [{ value: '', disabled: false }],
      ServicingSalesEmployeeSurname: [{ value: '', disabled: false }],
      PDALeadInd: [{ value: '', disabled: false }],
      ServiceBranchNumber: [{ value: '', disabled: false }],
      SalesBranchNumber: [{ value: '', disabled: false }]
    });
    this.storeSubscription = store.select('prospect').subscribe((data) => {
      if (data['action']) {
        if (data['action'].toString() === ActionTypes.SAVE_SYSTEM_PARAMETER) {
          this.systemParametersFromParent['systemChars'] = data['data']['systemChars'];
          this.setUI();
        } else if (data['action'].toString() === ActionTypes.CONTROL_DEFAULT_VALUE) {
          this.systemParametersFromParent['ttBusiness'] = data['data'];
          for (let opt of this.systemParametersFromParent['ttBusiness']) {
            if (opt['value']) {
              if (opt['text'] && opt['value'] && opt['value'] === this.systemParametersFromParent.systemChars['gcDefaultSourceCode']) {
                this.BusinessSourceCodeSelectDropdown.selectedItem = opt['value'];
                this.maintenancePremiseFormGroup.controls['BusinessSourceCodeSelect'].setValue(opt['value']);
                if (this.isBuisinessSourceUpdated === false) {
                  this.updateBusinessOrigin();
                  this.isBuisinessSourceUpdated = true;
                }
              }

            }
          }

        } else if (data['action'].toString() === ActionTypes.EXCHANGE_METHOD) {
          for (let m of data['data']) {
            if (this[m]) {
              this[m]();
            }
          }

        } else if (data['action'].toString() === ActionTypes.PARENT_FORM) {
          this.parentFormData = data['data'];
        }
      }

    });

  }


  ngOnInit(): void {
    this.translateService.setUpTranslation();
    this.createLineOfService();
    this.storeFormData.push({ formP: this.maintenancePremiseFormGroup });
    this.updateStoreControl(ActionTypes.FORM_CONTROLS);
    this.inputParamsPaymentType.countryCode = this.utils.getCountryCode();
    this.inputParamsPaymentType.businessCode = this.utils.getBusinessCode();
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
    if (this.querySubscription)
      this.querySubscription.unsubscribe();
    if (this.translateSubscription)
      this.translateSubscription.unsubscribe();
  }

  /**
   * Method to create line of service using look  up
   */
  public createLineOfService(): void {
    let data = [{
      'table': 'LineOfService',
      'query': { 'ValidForBusiness': this.utils.getBusinessCode(), 'countryCode': this.utils.getCountryCode() },
      'fields': ['LOSCode', 'LOSName']
    }];
    this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(
      (e) => {
        this.lineOfServiceOptions = [];
        try {
          for (let ls of e.results[0]) {
            let newOption = { 'text': ls['LOSName'], 'value': ls['LOSCode'] };
            this.lineOfServiceOptions.push(newOption);
            if (this.maintenancePremiseFormGroup.controls['LOSCodeSelect'].value === ls['LOSCode']) {
              this.LOSCodeSelectDropdown.selectedItem = ls['LOSCode'];
            }
          }
          this.LOSCodeSelectDropdown.selectedItem = this.lineOfServiceOptions[0].value;
          this.maintenancePremiseFormGroup.controls['LOSCodeSelect'].setValue(this.lineOfServiceOptions[0].value);
        } catch (err) {
          //this.errorService.emitError(err);
        }
      });

  }
  /**
   * LineOfService onchange method
   */
  public lineOfServiceChange(lsObj: any): void {
    this.lineOfServiceOptionsValue = (lsObj) ? lsObj : '';
    if (this.lineOfServiceOptionsValue)
      this.maintenancePremiseFormGroup.controls['LOSCodeSelect'].setValue(this.lineOfServiceOptionsValue);
  }


  /**
   * businessSourceCodeSelect onchange method
   */
  public businessSourceCodeSelectChange(lsObj: any): void {
    this.businessSourceCodeOptionsValue = (typeof lsObj !== 'undefined') ? lsObj : this.maintenancePremiseFormGroup.controls['BusinessSourceCodeSelect'].value;
    this.maintenancePremiseFormGroup.controls['BusinessSourceCodeSelect'].setValue(this.businessSourceCodeOptionsValue);
    if (this.businessSourceCodeOptionsValue) {
      this.queryParam.set(this.serviceConstants.Action, '6');
      this.queryParam.set('Function', 'BusinessSourceHasChanged');
      this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
      this.queryParam.set('BusinessSourceCode', this.businessSourceCodeOptionsValue);
      this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

      this.httpService.makeGetRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam).subscribe(
        (data) => {
          try {
            this.businessOriginCodeOptions = [];
            let optionValue = data.BusinessOriginCodeList.split('\n');
            let optionText = data.BusinessOriginDescList.split('\n');
            let selectedIndex = 0, selectedOptionValue = '';
            for (let i = 0; i < optionValue.length; i++) {
              let newOption = { 'text': optionText[i], 'value': optionValue[i] };
              this.businessOriginCodeOptions.push(newOption);
              if (this.maintenancePremiseFormGroup.controls['BusinessOriginCodeSelect'].value && this.maintenancePremiseFormGroup.controls['BusinessOriginCodeSelect'].value === optionValue[i]) {
                selectedIndex = i;
                selectedOptionValue = this.maintenancePremiseFormGroup.controls['BusinessOriginCodeSelect'].value;
              }
            }
            this.maintenancePremiseFormGroup.controls['BusinessOriginCodeSelect'].setValue(selectedOptionValue);
            this.requiredList = data.BusinessOriginDetailRequiredList;
            if (selectedIndex !== 0) {
              let self = this;
              setTimeout(() => {
                self.BusinessOriginCodeSelectDropdown.selectedItem = optionValue[selectedIndex];
                this.businessOriginCodeSelectChange(this.maintenancePremiseFormGroup.controls['BusinessOriginCodeSelect'].value);
              }, 10);
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
  }

  /**
   *  businessOriginCode onchange method
   */
  public businessOriginCodeSelectChange(lsObj: any, type: string = ''): void {
    if (typeof lsObj !== 'undefined' && type === 'cntrl' && this.systemParametersFromParent.systemChars.updateOrigin === false) {
      this.maintenancePremiseFormGroup.controls['BusinessOriginCodeSelect'].setValue(lsObj);
      this.businessOriginCodeOptionsValue = this.maintenancePremiseFormGroup.controls['BusinessOriginCodeSelect'].value;
    }
    if (this.systemParametersFromParent.systemChars.updateOrigin === true) {
      if (lsObj !== '' && typeof lsObj !== 'undefined') {
        this.maintenancePremiseFormGroup.controls['BusinessOriginCodeSelect'].setValue(lsObj);
        this.businessOriginCodeOptionsValue = this.maintenancePremiseFormGroup.controls['BusinessOriginCodeSelect'].value;
        this.systemParametersFromParent.systemChars.updateOrigin = false;
      }
    }
    if (this.businessOriginCodeOptionsValue && this.requiredList.match(new RegExp(this.businessOriginCodeOptionsValue, 'i'))) {
      this.fieldVisibility.isHiddenBusinessOriginDetailCodeSelect = false;

    } else {
      this.fieldVisibility.isHiddenBusinessOriginDetailCodeSelect = true;
    }
    if (!this.businessOriginCodeOptionsValue && this.systemParametersFromParent.systemChars.vSCBusinessOriginMandatory && this.isSubmitClick === true) {
      this.BusinessOriginCodeSelectDropdown.isValid = false;
    } else {
      this.BusinessOriginCodeSelectDropdown.isValid = true;
    }
    if (this.businessOriginCodeOptionsValue) {
      this.queryParam.set(this.serviceConstants.Action, '6');
      this.queryParam.set('Function', 'BusinessOriginHasChanged');
      this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
      this.queryParam.set('BusinessOriginCode', this.businessOriginCodeOptionsValue);
      this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
      this.httpService.makeGetRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam).subscribe(
        (data) => {
          try {
            if (data) {
              if (data.BusinessOriginDetailCodeList !== 'undefined') {
                this.businessOriginDetailCodeOptions = [];
                let optionValue = data.BusinessOriginDetailCodeList.split('\n');
                let optionText = data.BusinessOriginDetailDescList.split('\n');
                let selectedIndex = 0;
                for (let i = 0; i < optionValue.length; i++) {
                  let newOption = { 'text': optionText[i], 'value': optionValue[i] };
                  this.businessOriginDetailCodeOptions.push(newOption);
                }

                if (this.maintenancePremiseFormGroup.controls['BusinessOriginDetailCodeSelect'].value) {
                  this.BusinessOriginDetailCodeSelectDropdown.selectedItem = this.maintenancePremiseFormGroup.controls['BusinessOriginDetailCodeSelect'].value;
                } else {
                  setTimeout(() => {
                    this.BusinessOriginDetailCodeSelectDropdown.selectedItem = optionValue[0];
                  }, 20);
                }
                if (this.systemParametersFromParent.systemChars.routeParams) {
                  if (this.systemParametersFromParent.systemChars.customBusinessObject.Update === false && this.systemParametersFromParent.systemChars.customBusinessObject.Copy === false && data.ContactMediumCode) {
                    this.maintenancePremiseFormGroup.controls['ContactMediumCode'].setValue(data.ContactMediumCode);
                    this.populateContactDesc();
                    this.contactMediumCodeOnchange();
                  }
                }
                if (data.LeadInd === 'Y') {
                  this.fieldVisibility.isHiddenPDALeadEmployeeCode = false;
                  if (this.maintenancePremiseFormGroup.controls['PDALeadInd'].value === 'yes') {
                    this.maintenancePremiseFormGroup.controls['PDALeadEmployeeCode'].enable();
                    this.ellipsisDisable.isPDAEmployeeSearchEllipsisDisabled = false;
                  } else {
                    this.maintenancePremiseFormGroup.controls['PDALeadEmployeeCode'].disable();
                    this.ellipsisDisable.isPDAEmployeeSearchEllipsisDisabled = true;
                  }
                } else {
                  this.fieldVisibility.isHiddenPDALeadEmployeeCode = true;
                  this.fieldRequired.PDALeadEmployeeCode = false;
                }
              } else {
                //this.errorService.emitError(data.errorMessage);
              }
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
  }

  /**
   * Update business origin
   */
  public updateBusinessOrigin(): void {
    this.businessSourceCodeSelectChange(this.maintenancePremiseFormGroup.controls['BusinessSourceCodeSelect'].value);
  }

  /**
   * businessOriginDetailCode onchange method
   */
  public businessOriginDetailCodeSelectChange(lsObj: any): void {
    this.businessOriginDetailCodeOptionsValue = '';
    if (lsObj)
      this.businessOriginDetailCodeOptionsValue = (lsObj.replace(/[\n\r\s]+/g, '') !== '') ? lsObj : this.maintenancePremiseFormGroup.controls['BusinessOriginDetailCodeSelect'].value;
    this.maintenancePremiseFormGroup.controls['BusinessOriginDetailCodeSelect'].setValue(this.businessOriginDetailCodeOptionsValue);
    this.BusinessOriginDetailCodeSelectDropdown.selectedItem = this.businessOriginDetailCodeOptionsValue;
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
  /**
   * Set fields properties at the time of page load
   */

  public setUI(): void {
    this.poscodeSearchHide = !((this.systemParametersFromParent.systemChars.vSCEnableHopewiserPAF || this.systemParametersFromParent.systemChars.vSCEnableDatabasePAF));
    if (this.systemParametersFromParent.systemChars.customBusinessObject.Enable === true) {
      this.fieldDisable.BusinessSourceCodeSelect = false;
      this.fieldDisable.BusinessOriginCodeSelect = false;
      this.fieldDisable.BusinessOriginDetailCodeSelect = false;
      this.fieldDisable.LOSCodeSelect = false;
    }
    this.fieldDisable.cmdGetPremiseAddress = true;
    if (!this.systemParametersFromParent.systemChars.vSCEnableHopewiserPAF && !this.systemParametersFromParent.systemChars.vSCEnableDatabasePAF) {
      this.fieldVisibility.isHiddencmdGetPremiseAddress = true;
    }
    if (this.systemParametersFromParent.systemChars.vSCEnableAddressLine3) {
      this.fieldVisibility.isHiddenPremiseAddressLine3 = false;
    } else {
      this.fieldVisibility.isHiddenPremiseAddressLine3 = true;
      this.fieldRequired['PremiseAddressLine3'] = false;
    }
    this.fieldRequired['PremiseName'] = true;
    this.fieldRequired['PremiseAddressLine1'] = true;
    this.fieldRequired['PremiseAddressLine4'] = true;
    if (this.systemParametersFromParent.systemChars.vSCEnableAddressLine3Required) {
      this.fieldRequired['PremiseAddressLine3'] = true;
    } else {
      this.fieldRequired['PremiseAddressLine3'] = false;
    }
    if (this.systemParametersFromParent.systemChars.vSCAddressLine5Logical) {
      this.fieldRequired['PremiseAddressLine5'] = true;
    } else {
      this.fieldRequired['PremiseAddressLine5'] = false;
    }
    this.fieldRequired['PremisePostcode'] = true;
    this.fieldRequired['PremiseContactName'] = true;
    this.fieldRequired['PremiseContactPosition'] = true;
    this.fieldRequired['PremiseContactTelephone'] = true;
    if (this.systemParametersFromParent.systemChars.vSCBusinessOriginMandatory) {
      this.fieldRequired['BusinessOriginCodeSelect'] = true;
    } else {
      this.fieldRequired['BusinessOriginCodeSelect'] = false;
    }
    if (this.systemParametersFromParent.systemChars.vSCHideContactMediumCode) {
      this.fieldRequired['ContactMediumCode'] = false;
      this.fieldVisibility.isHiddenContactMediumCode = true;
    } else {
      this.fieldRequired['ContactMediumCode'] = true;
      this.fieldVisibility.isHiddenContactMediumCode = false;
    }
    if (this.systemParametersFromParent.systemChars.currentURL.match(new RegExp('Prospect', 'i'))) {
      this.fieldRequired.ServicingSalesEmployeeCode = true;
      this.fieldRequired.AssignToEmployeeCode = true;
      this.fieldReadOnly.AnnualValue = true;
      this.fieldVisibility.isHiddenAssignToEmployeeCode = false;
      this.fieldVisibility.isHiddenPDALeadEmployeeCode = true;
    } else if (this.systemParametersFromParent.systemChars.currentURL.match(new RegExp('NatAxJob', 'i'))) {
      this.fieldVisibility.isHiddenAssignToEmployeeCode = true;
      this.fieldVisibility.isHiddenPDALeadEmployeeCode = true;
      this.fieldRequired.PDALeadEmployeeCode = false;
      this.fieldRequired.AssignToEmployeeCode = false;
    }
    else {
      this.fieldReadOnly.BranchNumber = true;
      this.fieldVisibility.isHiddenAssignToEmployeeCode = true;
      this.fieldVisibility.isHiddenPDALeadEmployeeCode = true;
    }
    let parentMode = this.riExchange.ParentMode(this.systemParametersFromParent.systemChars.routeParams);
    if (parentMode === 'CallCentreSearchNew') {
      this.maintenancePremiseFormGroup.controls['PremiseName'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallAddressName'));
      if (!this.maintenancePremiseFormGroup.controls['PremiseName'].value) {
        this.maintenancePremiseFormGroup.controls['PremiseName'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallContactName'));
      }
      this.maintenancePremiseFormGroup.controls['PremiseAddressLine1'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallAddressLine1'));
      this.maintenancePremiseFormGroup.controls['PremiseAddressLine2'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallAddressLine2'));
      this.maintenancePremiseFormGroup.controls['PremiseAddressLine3'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallAddressLine3'));
      this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallAddressLine4'));
      this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallAddressLine5'));
      this.maintenancePremiseFormGroup.controls['PremisePostcode'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallContactPostcode'));
      this.premiseContainer.nativeElement.querySelector('#PremiseName').focus();
    } else if (parentMode === 'CallCentreSearchNewExisting') {
      this.maintenancePremiseFormGroup.controls['PremiseContactName'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallContactName'));
      this.maintenancePremiseFormGroup.controls['PremiseContactPosition'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallContactPosition'));
      this.maintenancePremiseFormGroup.controls['PremiseContactTelephone'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallContactTelephone'));
      this.maintenancePremiseFormGroup.controls['PremiseContactMobile'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallContactMobile'));
      this.maintenancePremiseFormGroup.controls['PremiseContactFax'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallContactFax'));
      this.maintenancePremiseFormGroup.controls['PremiseContactEmail'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallContactEmail'));
      this.maintenancePremiseFormGroup.controls['Narrative'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallNotepad'));
      this.maintenancePremiseFormGroup.controls['BusinessOriginCode'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'BusinessOriginCode'));
      this.maintenancePremiseFormGroup.controls['ContactMediumCode'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'ContactMediumCode'));
      this.maintenancePremiseFormGroup.controls['ContactMediumDesc'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'ContactMediumDesc'));
      this.contactMediumCodeOnchange();
    }
    if (parentMode === 'CallCentreSearchNew' || parentMode === 'CallCentreSearchNewExisting') {
      if (this.parentFormData.controls['PremiseNumber'].value === '') {
        this.maintenancePremiseFormGroup.controls['PremiseName'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallAddressName'));

        if (!this.maintenancePremiseFormGroup.controls['PremiseName'].value) {
          this.maintenancePremiseFormGroup.controls['PremiseName'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallContactName'));
        }
        this.maintenancePremiseFormGroup.controls['PremisePostcode'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallContactPostcode'));

      }
      if (!this.maintenancePremiseFormGroup.controls['PremisePostcode'].value) {
        this.postcodeValidate();
      }
    }
    this.updateValidators();
    if (!this.systemParametersFromParent.systemChars.customBusinessObject.Enable) {
      this.disableAllPremise();
    }
  }

  /**
   * Postcode validator method
   */


  public postcodeValidate(): void {
    this.queryParam.set(this.serviceConstants.Action, '6');
    this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
    this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
    this.queryParam.set('PremisePostcode', this.maintenancePremiseFormGroup.controls['PremisePostcode'].value);
    if (this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].value)
      this.queryParam.set('PremiseAddressLine4', this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].value);
    if (this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].value)
      this.queryParam.set('PremiseAddressLine5', this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].value);
    if (this.maintenancePremiseFormGroup.controls['LOSCodeSelect'].value)
      this.queryParam.set('LOSCode', this.maintenancePremiseFormGroup.controls['LOSCodeSelect'].value);
    this.queryParam.set('Function', 'GetAssignToSalesDetails');
    this.BusinessOriginDetailCodeSelectDropdown.selectedItem = this.maintenancePremiseFormGroup.controls['BusinessOriginDetailCodeSelect'].value;
    this.httpService.makeGetRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam).subscribe(
      (data) => {
        try {
          if (!data.errorMessage) {
            if (this.maintenancePremiseFormGroup.controls['AssignToEmployeeCode'].value === '')
              this.maintenancePremiseFormGroup.controls['AssignToEmployeeCode'].setValue(data.ServicingSalesEmployeeCode);
            if (this.maintenancePremiseFormGroup.controls['AssignToEmployeeName'].value === '')
              this.maintenancePremiseFormGroup.controls['AssignToEmployeeName'].setValue(data.AssignToEmployeeName);
            if (this.maintenancePremiseFormGroup.controls['DefaultAssigneeEmployeeDetails'].value === '')
              this.maintenancePremiseFormGroup.controls['DefaultAssigneeEmployeeDetails'].setValue(data.DefaultAssigneeEmployeeDetails);
            if (this.maintenancePremiseFormGroup.controls['ServicingSalesEmployeeCode'].value === '')
              this.maintenancePremiseFormGroup.controls['ServicingSalesEmployeeCode'].setValue(data.ServicingSalesEmployeeCode);
            this.systemParametersFromParent.systemChars.SalesBranchNumber = data.SalesBranchNumber;
            if (data.SalesBranchNumber)
              this.inputParamsEmployeeSearch.salesBranchNumber = data.SalesBranchNumber;
            else
              this.inputParamsEmployeeSearch.salesBranchNumber = 0;
            this.employeeSearchEllipsis.updateComponent();
            this.systemParametersFromParent.systemChars.ContactRedirectionUniqueID = data.ContactRedirectionUniqueID;
            this.systemParametersFromParent.systemChars.DefaultAssigneeEmployeeCode = data.DefaultAssigneeEmployeeCode;
            this.maintenancePremiseFormGroup.controls['BranchNumber'].setValue(data.BranchNumber);

          } else if (this.maintenancePremiseFormGroup.controls['PremisePostcode'].value) {
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

  /**
   * Premise postcode change service call
   */
  public premisePostcodeOnchange(premisePostCode: string): void {
    this.inputParamsPostcode = {
      parentMode: 'PremiseProspect',
      PremisePostCode: this.maintenancePremiseFormGroup.controls['PremisePostcode'].value,
      PremiseAddressLine5: this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].value,
      PremiseAddressLine4: this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].value
    };
    this.postcodeSearchEllipsis.childConfigParams = this.inputParamsPostcode;
    this.postcodeSearchEllipsis.updateComponent();
    if (premisePostCode && this.systemParametersFromParent.systemChars.vSCEnableDatabasePAF && this.systemParametersFromParent.systemChars.vSCEnablePostcodeDefaulting) {
      this.queryParam.set(this.serviceConstants.Action, '0');
      this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
      this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
      this.queryParam.set('Postcode', premisePostCode);
      this.queryParam.set('Town', this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].value);
      this.queryParam.set('State', this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].value);
      this.queryParam.set('Function', 'GetPostCodeTownAndState');

      this.httpService.makeGetRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam).subscribe(
        (data) => {
          try {
            if (data.UniqueRecordFound !== 'yes') {
              this.postcodeSearchSBEllipsis.childConfigParams = this.inputParamsPostcode;
              this.postcodeSearchSBEllipsis.openModal();
            } else {
              this.maintenancePremiseFormGroup.controls['PremisePostcode'].setValue(data.Postcode);
              this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].setValue(data.Town);
              this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].setValue(data.State);
            }
          } catch (error) {
            //this.errorService.emitError(error);
          }

        },
        (error) => {
          this.errorService.emitError(error);
        }
      );
    } else {
      this.postcodeValidate();
    }

  }

  public premiseNameOnchange(): void {
    if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
      this.maintenancePremiseFormGroup.controls['PremiseName'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseName'].value));
    }
    if (this.systemParametersFromParent.systemChars.customBusinessObject.Update === false) {
      if (this.systemParametersFromParent.systemChars.vSCRunPAFSearchOn1stAddressLine && (this.systemParametersFromParent.systemChars.vSCEnableHopewiserPAF || this.systemParametersFromParent.systemChars.vSCEnableDatabasePAF)) {
        this.onGetPremiseAddressClick();
      }
    }
  }

  public premiseAddressLine4Onfocusout(): void {
    if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
      this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].value));
    }
    if (this.systemParametersFromParent.systemChars.vSCAddressLine4Required && this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].value === '' && this.systemParametersFromParent.systemChars.SystemCharEnableValidatePostcodeSuburb)
      this.onGetPremiseAddressClick();
  }

  public premiseAddressLine5onfocusout(): void {
    if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
      this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].value));
    }
    if (this.systemParametersFromParent.systemChars.vSCAddressLine5Required && this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].value === '' && this.systemParametersFromParent.systemChars.SystemCharEnableValidatePostcodeSuburb)
      this.onGetPremiseAddressClick();
  }

  public premisePostcodeOnfocusout(): void {
    if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
      this.maintenancePremiseFormGroup.controls['PremisePostcode'].setValue(this.maintenancePremiseFormGroup.controls['PremisePostcode'].value ? this.maintenancePremiseFormGroup.controls['PremisePostcode'].value.toUpperCase() : '');
    }

    if (this.systemParametersFromParent.systemChars.vSCPostCodeRequired && this.maintenancePremiseFormGroup.controls['PremisePostcode'].value === '')
      this.onGetPremiseAddressClick();
  }

  public premiseAddressLine2Onfocusout(): void {
    if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
      this.maintenancePremiseFormGroup.controls['PremiseAddressLine2'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseAddressLine2'].value));
    }

  }

  public premiseAddressLine1Onfocusout(): void {
    if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
      this.maintenancePremiseFormGroup.controls['PremiseAddressLine1'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseAddressLine1'].value));
    }

  }
  public premiseAddressLine3Onfocusout(): void {
    if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
      this.maintenancePremiseFormGroup.controls['PremiseAddressLine3'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseAddressLine3'].value));
    }

  }

  public premiseContactPositiononfocusout(): void {
    if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
      this.maintenancePremiseFormGroup.controls['PremiseContactName'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseContactName'].value));
      this.maintenancePremiseFormGroup.controls['PremiseContactPosition'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseContactPosition'].value));
      this.maintenancePremiseFormGroup.controls['PremiseContactTelephone'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseContactTelephone'].value));
      this.maintenancePremiseFormGroup.controls['PremiseContactMobile'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseContactMobile'].value));
      this.maintenancePremiseFormGroup.controls['PremiseContactFax'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseContactFax'].value));
      this.maintenancePremiseFormGroup.controls['PremiseContactEmail'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseContactEmail'].value));
    }

  }

  /**
   * Update validation rules
   */

  public updateValidators(): void {
    for (let f in this.fieldRequired) {
      if (this.fieldRequired.hasOwnProperty(f)) {
        if (this.maintenancePremiseFormGroup.controls[f]) {
          if (this.fieldRequired[f]) {
            this.maintenancePremiseFormGroup.controls[f].setValidators([Validators.required, this.utils.commonValidate]);
          } else {
            this.maintenancePremiseFormGroup.controls[f].clearValidators();
            this.maintenancePremiseFormGroup.controls[f].setValidators([this.utils.commonValidate]);
          }
          this.maintenancePremiseFormGroup.controls[f].updateValueAndValidity();
        }
      }
    }

  }
  /**
   * contactMediumCode method to set other values Onchange of contactMediumCode
   */

  public contactMediumCodeOnchange(): void {
    if (this.systemParametersFromParent.systemChars.customBusinessObject.Update === false) {

      if (this.maintenancePremiseFormGroup.controls['ContactMediumCode'].value && this.systemParametersFromParent.systemChars.vEnterWORefsList.indexOf('#' + this.maintenancePremiseFormGroup.controls['ContactMediumCode'].value.toLowerCase() + '#') >= 0) {
        this.defaultWODate = new Date();
        this.maintenancePremiseFormGroup.controls['WODate'].setValue(this.defaultWODate.getDay() + '/' + (this.defaultWODate.getMonth() + 1) + '/' + this.defaultWODate.getFullYear());
        this.maintenancePremiseFormGroup.controls['WOStartTime'].setValue('00:00');
        this.maintenancePremiseFormGroup.controls['WOEndTime'].setValue('00:00');
        this.fieldVisibility.isHiddenWOStartTime = false;
        this.fieldRequired.WODate = true;
        this.fieldRequired.WOStartTime = true;
        this.fieldRequired.WOEndTime = true;
      } else {
        this.maintenancePremiseFormGroup.controls['WOStartTime'].setValue('0');
        this.maintenancePremiseFormGroup.controls['WOEndTime'].setValue('0');
        this.fieldVisibility.isHiddenWOStartTime = true;
        this.fieldRequired.WODate = false;
        this.fieldRequired.WOStartTime = false;
        this.fieldRequired.WOEndTime = false;
      }
      this.updateValidators();
    }
  }

  /** Get address click functionality  */

  public onGetPremiseAddressClick(): void {
    //this.riExchange.setStore(ActionTypes.RI_EXCHANGE, { 'Mode': 'PremiseProspect' });
    if (this.systemParametersFromParent.systemChars.vSCEnableDatabasePAF) {
      this.inputParamsPostcode = {
        parentMode: 'PremiseProspect',
        PremisePostCode: this.maintenancePremiseFormGroup.controls['PremisePostcode'].value,
        PremiseAddressLine5: this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].value,
        PremiseAddressLine4: this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].value
      };
      this.postcodeSearchEllipsis.childConfigParams = this.inputParamsPostcode;
      this.postcodeSearchEllipsis.openModal();
    } else if (this.systemParametersFromParent.systemChars.vSCEnableHopewiserPAF) {
      /*this.router.navigate(['riMPAFSearch.htm'], {
         queryParams: {
         }
     });*/
      this.messageModal.show({ msg: 'Screen is yet not developed', title: 'Message' }, false);
    }
  }

  public onPremisePostcodeDataReturn(data: any): void {
    this.maintenancePremiseFormGroup.controls['PremisePostcode'].setValue(data.PremisePostcode);
    this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].setValue(data.PremiseAddressLine4);
    this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].setValue(data.PremiseAddressLine5);
    this.premisePostcodeOnchange(data.PremisePostcode);
  }
  /**
   * DecisionMakerInd onchange setting value
   */
  public decisionMakerIndOnChange(checkedValue: any): void {
    if (checkedValue) {
      this.maintenancePremiseFormGroup.controls['DecisionMakerInd'].setValue('yes');
    } else {
      this.maintenancePremiseFormGroup.controls['DecisionMakerInd'].setValue('no');
    }
  }
  /**
   * PDALeadInd onchange setting value
   */
  public pdaLeadIndOnChange(checkedValue: any): void {
    if (checkedValue) {
      this.maintenancePremiseFormGroup.controls['PDALeadInd'].setValue('yes');
      this.isCheckedPDALeadInd = true;
      this.maintenancePremiseFormGroup.controls['PDALeadEmployeeCode'].enable();
      this.fieldRequired.PDALeadEmployeeCode = true;
      this.ellipsisDisable.isPDAEmployeeSearchEllipsisDisabled = false;
    } else {
      this.maintenancePremiseFormGroup.controls['PDALeadInd'].setValue('no');
      this.isCheckedPDALeadInd = true;
      this.maintenancePremiseFormGroup.controls['PDALeadEmployeeCode'].disable();
      this.ellipsisDisable.isPDAEmployeeSearchEllipsisDisabled = true;
      this.fieldRequired.PDALeadEmployeeCode = false;
    }
    this.updateValidators();
  }
  /**
   * Update after fetching record
   */

  public updatePremiseData(): void {
    if (this.systemParametersFromParent.systemChars.customBusinessObject.Enable === true) {
      if (this.systemParametersFromParent.systemChars.customBusinessObject.Update === true)
        this.beforeUpdate();
      this.defaultCommenceDate = this.maintenancePremiseFormGroup.controls['CommenceDate'].value;
      this.defaultCommenceDate = (this.maintenancePremiseFormGroup.controls['CommenceDate'].value) ? new Date(this.maintenancePremiseFormGroup.controls['CommenceDate'].value) : new Date();
      this.defaultContractExpiryDate = (this.maintenancePremiseFormGroup.controls['ContractExpiryDate'].value) ? new Date(this.maintenancePremiseFormGroup.controls['ContractExpiryDate'].value) : new Date();
      this.BusinessSourceCodeSelectDropdown.selectedItem = (this.maintenancePremiseFormGroup.controls['BusinessSourceCodeSelect'].value !== '') ? this.maintenancePremiseFormGroup.controls['BusinessSourceCodeSelect'].value : this.systemParametersFromParent.systemChars['gcDefaultSourceCode'];
      if (this.maintenancePremiseFormGroup.controls['LOSCodeSelect'].value)
        this.LOSCodeSelectDropdown.selectedItem = this.maintenancePremiseFormGroup.controls['LOSCodeSelect'].value;
      this.fieldDisable.cmdGetPremiseAddress = false;
      if (this.maintenancePremiseFormGroup.controls['BusinessSourceCodeSelect'].value === '') {
        this.businessSourceCodeSelectChange(this.systemParametersFromParent.systemChars['gcDefaultSourceCode']);
      }
      if (this.maintenancePremiseFormGroup.controls['DecisionMakerInd'].value === 'yes') {
        this.isCheckedDecisionMakerInd = true;
      } else {
        this.isCheckedDecisionMakerInd = null;
      }
      if (this.maintenancePremiseFormGroup.controls['PDALeadEmployeeCode'].value === '') {
        this.isCheckedPDALeadInd = false;
      } else {
        this.isCheckedPDALeadInd = true;
      }
    }
  }

  public commenceDateSelectedValue(Obj: any): void {
    if (Obj && Obj.value)
      this.maintenancePremiseFormGroup.controls['CommenceDate'].setValue(Obj.value);
  }

  public exppiryDateSelectedValue(Obj: any): void {
    if (Obj && Obj.value)
      this.maintenancePremiseFormGroup.controls['ContractExpiryDate'].setValue(Obj.value);
  }

  public wODateSelectedValue(Obj: any): void {
    if (Obj && Obj.value)
      this.maintenancePremiseFormGroup.controls['WODate'].setValue(Obj.value);
  }

  private updateStoreControl(action: string): void {
    this.store.dispatch({
      type: ActionTypes[action],
      payload: { formPremise: this.maintenancePremiseFormGroup }
    });
  }

  /**
   * Branchcode setting from dropdown
   */
  public onBranchDataReceived(data: any): void {
    this.maintenancePremiseFormGroup.controls['BranchNumber'].setValue(data.BranchNumber);
    this.maintenancePremiseFormGroup.controls['BranchName'].setValue(data.BranchName);
    this.inputParamsEmployeeSearch.branchNumber = this.maintenancePremiseFormGroup.controls['BranchNumber'].value;
    this.employeeSearchEllipsis.updateComponent();
  }
  /**
   * Populate Payment type search data
   */
  public onPaymentTypeDataReceived(data: any): void {
    this.maintenancePremiseFormGroup.controls['PaymentTypeCode'].setValue(data.PaymentTypeCode);
    this.maintenancePremiseFormGroup.controls['PaymentDesc'].setValue(data.PaymentDesc);
  }
  /**
   * Employee selection from ellipsis
   */
  public onAssignEmployeeDataReceived(data: any): void {
    this.maintenancePremiseFormGroup.controls['AssignToEmployeeCode'].setValue(data.AssignToEmployeeCode);
    this.maintenancePremiseFormGroup.controls['AssignToEmployeeName'].setValue(data.AssignToEmployeeName);
    this.maintenancePremiseFormGroup.controls['ServicingSalesEmployeeCode'].setValue(data.AssignToEmployeeCode);
    this.maintenancePremiseFormGroup.controls['ServicingSalesEmployeeSurname'].setValue(data.AssignToEmployeeName);
  }
  public setServicingEmployee(): void {
    this.maintenancePremiseFormGroup.controls['ServicingSalesEmployeeCode'].setValue(this.maintenancePremiseFormGroup.controls['AssignToEmployeeCode'].value);
  }
  public onServicePDAEmployeeDataReceived(data: any): void {
    this.maintenancePremiseFormGroup.controls['PDALeadEmployeeCode'].setValue(data.PDALeadEmployeeCode);
    this.maintenancePremiseFormGroup.controls['PDALeadEmployeeSurname'].setValue(data.PDALeadEmployeeSurname);
  }

  public onEmployeeNegotiatingSalesDataReceived(data: any): void {
    this.maintenancePremiseFormGroup.controls['NegotiatingSalesEmployeeCode'].setValue(data.NegotiatingSalesEmployeeCode);
    this.maintenancePremiseFormGroup.controls['NegotiatingSalesEmployeeSurname'].setValue(data.NegotiatingSalesEmployeeSurname);
  }

  public onServiceEmployeeDataReceived(data: any): void {
    this.maintenancePremiseFormGroup.controls['ServicingSalesEmployeeCode'].setValue(data.ContractOwner);
    this.maintenancePremiseFormGroup.controls['ServicingSalesEmployeeSurname'].setValue(data.ContractOwnerSurname);
  }

  public populateContactDesc(): void {
    let data = [{
      'table': 'ContactMediumLang',
      'query': { 'ContactMediumCode': this.maintenancePremiseFormGroup.controls['ContactMediumCode'].value },
      'fields': ['ContactMediumDesc']
    }];
    this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe((e) => {
      if (e.results[0][0])
        this.maintenancePremiseFormGroup.controls['ContactMediumDesc'].setValue(e.results[0][0].ContactMediumDesc);
    });
    this.contactMediumCodeOnchange();
  }


  public resetPremiseData(): void {
    this.LOSCodeSelectDropdown.selectedItem = this.lineOfServiceOptions[0].value;
    this.BusinessSourceCodeSelectDropdown.selectedItem = this.systemParametersFromParent.systemChars['gcDefaultSourceCode'];
    this.isCheckedDecisionMakerInd = null;
    this.maintenancePremiseFormGroup.controls['LOSCodeSelect'].setValue(this.lineOfServiceOptions[0].value);
    this.maintenancePremiseFormGroup.controls['BusinessSourceCodeSelect'].setValue(this.systemParametersFromParent.systemChars['gcDefaultSourceCode']);
    this.maintenancePremiseFormGroup.controls['DecisionMakerInd'].setValue('no');
    if (this.systemParametersFromParent.systemChars.customBusinessObject.Update === false) {
      this.contactMediumCodeOnchange();
    }
    this.updateBusinessOrigin();

  }

  public disableAllPremise(): void {
    for (let c in this.maintenancePremiseFormGroup.controls) {
      if (this.maintenancePremiseFormGroup.controls.hasOwnProperty(c)) {
        this.maintenancePremiseFormGroup.controls[c].disable();
      }
    }
    for (let k in this.fieldDisable) {
      if (this.fieldDisable.hasOwnProperty(k)) {
        this.fieldDisable[k] = true;
      }
    }
    for (let p in this.ellipsisDisable) {
      if (this.ellipsisDisable.hasOwnProperty(p)) {
        this.ellipsisDisable[p] = true;
      }
    }
  }

  public enableAllPremise(): void {
    for (let c in this.maintenancePremiseFormGroup.controls) {
      if (this.maintenancePremiseFormGroup.controls.hasOwnProperty(c)) {
        if (c !== 'ContactMediumDesc' && c !== 'AssignToEmployeeName' && c !== 'DefaultAssigneeEmployeeDetails')
          this.maintenancePremiseFormGroup.controls[c].enable();
      }
    }
    for (let k in this.fieldDisable) {
      if (this.fieldDisable.hasOwnProperty(k)) {
        this.fieldDisable[k] = false;
      }
    }
    for (let p in this.ellipsisDisable) {
      if (this.ellipsisDisable.hasOwnProperty(p)) {
        this.ellipsisDisable[p] = false;
      }
    }
    //Before add functionality
    if (this.systemParametersFromParent.systemChars.customBusinessObject.Update === false) {
      let currentURL = window.location.href;
      if (currentURL.match(new RegExp('Prospect', 'i'))) {
        this.isCheckedPDALeadInd = false;
        this.fieldDisable.isDisablePDALeadInd = false;
        this.maintenancePremiseFormGroup.controls['PDALeadInd'].setValue(false);
        let parentMode = this.riExchange.ParentMode(this.systemParametersFromParent.systemChars.routeParams);
        if (parentMode === 'GeneralSearch' && this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.systemChars.routeParams, 'SearchOn') === 'PostCode') {
          this.maintenancePremiseFormGroup.controls['PremisePostcode'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.systemChars.routeParams, 'PostCode'));
        }
        this.postcodeValidate();
      } else {
        this.maintenancePremiseFormGroup.controls['BranchNumber'].setValue(this.riExchange.ClientSideValues.Fetch('BranchNumber'));
        this.maintenancePremiseFormGroup.controls['ServiceBranchNumber'].setValue(this.riExchange.ClientSideValues.Fetch('BranchNumber'));
        this.maintenancePremiseFormGroup.controls['BranchName'].setValue(this.riExchange.ClientSideValues.Fetch('BranchName'));
      }
      this.maintenancePremiseFormGroup.controls['WODate'].setValue(this.defaultWODate.getDay() + '/' + (this.defaultWODate.getMonth() + 1) + '/' + this.defaultWODate.getFullYear());
      this.maintenancePremiseFormGroup.controls['WOStartTime'].setValue('00:00');
      this.maintenancePremiseFormGroup.controls['WOEndTime'].setValue('00:00');
    }
  }

  public beforeUpdate(): void {
    if (this.systemParametersFromParent.systemChars.customBusinessObject.Enable === true) {
      let currentURL = window.location.href;
      if (currentURL.match(new RegExp('Prospect', 'i'))) {
        //As per Alec S&T comment
        //this.maintenancePremiseFormGroup.controls['AssignToEmployeeCode'].disable();
        this.fieldDisable.isDisablePDALeadInd = false;
        if (this.isCheckedPDALeadInd) {
          this.fieldDisable.isDisablePDALeadInd = true;
          this.maintenancePremiseFormGroup.controls['PDALeadEmployeeCode'].enable();
          this.fieldRequired.PDALeadEmployeeCode = true;
        }
      } else {
        this.maintenancePremiseFormGroup.controls['AssignToEmployeeCode'].enable();
      }
      this.fieldDisable.LOSCodeSelect = true;
      this.updateValidators();
    }
  }

  public addInvalidClass(): void {
    this.isSubmitClick = true;
    if (!this.maintenancePremiseFormGroup.controls['BusinessOriginCodeSelect'].value && this.systemParametersFromParent.systemChars.vSCBusinessOriginMandatory && this.isSubmitClick === true) {
      this.BusinessOriginCodeSelectDropdown.isValid = false;
    } else {
      this.BusinessOriginCodeSelectDropdown.isValid = true;
    }
    this.isSubmitClick = false;
  }

  public onContactMediumCodeDataReceived(data: any): void {
    this.maintenancePremiseFormGroup.controls['ContactMediumCode'].setValue(data.ContactMediumCode);
    this.maintenancePremiseFormGroup.controls['ContactMediumDesc'].setValue(data.ContactMediumDesc);
  }

}
