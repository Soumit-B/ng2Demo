import { Component, NgZone, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ContractActionTypes } from '../../../../app/actions/contract';
import { AccountSearchComponent } from '../../../../app/internal/search/iCABSASAccountSearch';
import { PostCodeSearchComponent } from '../../../../app/internal/search/iCABSBPostcodeSearch.component';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { GlobalConstant } from './../../../../shared/constants/global.constant';
import { ActionTypes } from './../../../actions/prospect';
import { RiExchange } from './../../../../shared/services/riExchange';
import { Utils } from '../../../../shared/services/utility';
import { ErrorService } from '../../../../shared/services/error.service';
import { LocaleTranslationService } from '../../../../shared/services/translation.service';
import { CustomerTypeSearchComponent } from '../../../../app/internal/search/iCABSSCustomerTypeSearch';
import { PageNotFoundComponent } from './../../../page-not-found/404';
import { HttpService } from './../../../../shared/services/http-service';
import { SICSearchComponent } from '../../../../app/internal/search/iCABSSSICSearch.component';


@Component({
  selector: 'icabs-maintenance-type-a',
  templateUrl: 'maintenanceTabGeneral.html'
})

export class MaintenanceTypeGeneralComponent implements OnInit, OnDestroy {

  private allFormControls: Array<any> = [];

  public inputParams: any = { 'parentMode': 'Contract-Search', 'ContractTypeCode': '', 'countryCode': '', 'businessCode': '' };
  public inputSICSearch: any = { 'parentMode': 'LookUp-SICLang' };
  public sICSearchComponent: any = SICSearchComponent;
  public storeSubscription: Subscription;
  public querySubscription: Subscription;
  public translateSubscription: Subscription;
  public maintenanceGeneralFormGroup: FormGroup;
  public queryLookUp: URLSearchParams = new URLSearchParams();
  public queryParam: URLSearchParams = new URLSearchParams();
  public fieldVisibility: any = {
    'isHiddenCustomerTypeCode': false,
    'isHiddenCustomerTypeDesc': false,
    'isHiddenSICCode': false,
    'isHiddenSICDescription': false,
    'isHiddenNarrative': false,
    'isHiddenEstimatedContractQuotes': false,
    'isHiddenEstimatedProductSaleQuotes': false,
    'isHiddenEstimatedJobQuotes': false,
    'isHiddenEstimatedTotalQuotes': false,
    'isHiddenEstimatedContractValue': false,
    'isHiddenEstimatedJobValue': false,
    'isHiddenEstimatedProductSaleValue': false,
    'isHiddenExpectedTotalValue': false,
    'isHiddenExpectedValue': false,
    'isHiddenEstimatedClosedDate': false,
    'isHiddenDaysOld': false,
    'isHiddenProspectStatusCode': true,
    'isHiddenProspectStatusDesc': false,
    'isHiddenProbability': false,
    'isHiddenConvertedToNumber': false,
    'isHiddenchkAuthorise': false,
    'isHiddenchkReject': false,
    'isHiddenchkBranch': false,
    'isHiddenproductHeading': false

  };

  public fieldDisable: any = {
    'CustomerTypeCode': false,
    'CustomerTypeDesc': true,
    'SICCode': false,
    'SICDescription': true,
    'Narrative': false,
    'EstimatedContractQuotes': false,
    'EstimatedProductSaleQuotes': false,
    'EstimatedJobQuotes': false,
    'EstimatedTotalQuotes': true,
    'EstimatedContractValue': false,
    'EstimatedJobValue': false,
    'EstimatedProductSaleValue': false,
    'EstimatedTotalValue': true,
    'ExpectedTotalValue': true,
    'ExpectedValue': true,
    'ExpectedJobValue': true,
    'ExpectedProductSaleValue': true,
    'EstimatedClosedDate': false,
    'DaysOld': true,
    'ProspectStatusCode': false,
    'ProspectStatusDesc': true,
    'Probability': false,
    'ConvertedToNumber': false,
    'chkAuthorise': false,
    'chkReject': false,
    'chkBranch': false
  };
  public isDisabledCustomerTypeSearch: boolean = false;
  public CustomerTypeSearchComponent = CustomerTypeSearchComponent;
  public inputParamsCustomerTypeSearch: any = { 'parentMode': 'LookUp-PremiseIncSIC', 'CWIExcludeCustomerTypes': '' };
  public disableInitial: Array<string> = [
    'CustomerTypeDesc', 'SICDescription', 'SICDescription', 'EstimatedTotalQuotes', 'EstimatedTotalValue', 'ExpectedTotalValue',
    'ExpectedValue', 'ExpectedJobValue', 'ExpectedProductSaleValue', 'DaysOld', 'ProspectStatusDesc'
  ];

  public fieldRequired: any = {
    'CustomerTypeCode': false,
    'CustomerTypeDesc': false,
    'SICCode': false,
    'SICDescription': false,
    'Narrative': false,
    'EstimatedContractQuotes': false,
    'EstimatedProductSaleQuotes': false,
    'EstimatedJobQuotes': false,
    'EstimatedTotalQuotes': false,
    'EstimatedContractValue': false,
    'EstimatedJobValue': false,
    'EstimatedProductSaleValue': false,
    'EstimatedTotalValue': false,
    'ExpectedTotalValue': false,
    'ExpectedValue': false,
    'ExpectedJobValue': false,
    'ExpectedProductSaleValue': false,
    'EstimatedClosedDate': false,
    'DaysOld': false,
    'ProspectStatusCode': false,
    'ProspectStatusDesc': false,
    'Probability': false,
    'ConvertedToNumber': false,
    'chkAuthorise': false,
    'chkReject': false,
    'chkBranch': false
  };
  public dateDisable: any = {
    estimatedClosedDate: false
  };
  public cmdCancelDisable: boolean = true;
  public parentQueryParams: any;
  public zipSearchComponent = PostCodeSearchComponent;
  public autoOpen: boolean = false;
  public modalConfig: any = {
    backdrop: 'static',
    keyboard: true
  };

  public searchModalRoute: string = '';
  public showHeader: boolean = true;
  public showCloseButton: boolean = true;

  public queryParamsProspect: any = {
    action: '0',
    operation: 'ContactManagement/iCABSCMPipelineProspectMaintenance',
    module: 'prospect',
    method: 'prospect-to-contract/maintenance',
    contentType: 'application/x-www-form-urlencoded'
  };
  public systemParametersFromParent: any = { ttBusiness: [{}], systemChars: {} };
  public queryContract: URLSearchParams = new URLSearchParams();
  public CurrDate: Date = new Date();

  constructor(
    private zone: NgZone,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<any>,
    private utils: Utils,
    private httpService: HttpService,
    private serviceConstants: ServiceConstants,
    private errorService: ErrorService,
    private translateService: LocaleTranslationService,
    private riExchange: RiExchange
  ) {
    this.maintenanceGeneralFormGroup = this.fb.group({
      CustomerTypeCode: [{ value: '', disabled: false }],
      CustomerTypeDesc: [{ value: '', disabled: false }],
      SICCode: [{ value: '', disabled: false }],
      SICDescription: [{ value: '', disabled: false }],
      Narrative: [{ value: '', disabled: false }],
      EstimatedContractQuotes: [{ value: '0', disabled: false }],
      EstimatedJobQuotes: [{ value: '0', disabled: false }],
      EstimatedProductSaleQuotes: [{ value: '0', disabled: false }],
      EstimatedTotalQuotes: [{ value: '0', disabled: false }],
      EstimatedContractValue: [{ value: '0', disabled: false }],
      EstimatedJobValue: [{ value: '0', disabled: false }],
      EstimatedProductSaleValue: [{ value: '0', disabled: false }],
      EstimatedTotalValue: [{ value: '0', disabled: false }],
      ExpectedValue: [{ value: '0', disabled: false }],
      ExpectedJobValue: [{ value: '0', disabled: false }],
      ExpectedProductSaleValue: [{ value: '0', disabled: false }],
      ExpectedTotalValue: [{ value: '0', disabled: false }],
      EstimatedClosedDate: [{ value: '', disabled: false }],
      DaysOld: [{ value: '', disabled: false }],
      ProspectStatusCode: [{ value: '', disabled: false }],
      ProspectStatusDesc: [{ value: '', disabled: false }],
      Probability: [{ value: '', disabled: false }],
      ConvertedToNumber: [{ value: '', disabled: false }],
      chkAuthorise: [{ value: '', disabled: false }],
      chkReject: [{ value: '', disabled: false }],
      chkBranch: [{ value: '', disabled: false }]
    });
    this.storeSubscription = store.select('prospect').subscribe(data => {
      if (data['action']) {
        if (data['action'].toString() === ActionTypes.SAVE_SYSTEM_PARAMETER) {
          this.systemParametersFromParent['systemChars'] = data['data']['systemChars'];
          this.setUI();
        } else if (data['action'].toString() === ActionTypes.EXCHANGE_METHOD) {
          for (let m of data['data']) {
            if (this[m]) {
              this[m]();
            }
          }

        } else if (data['action'].toString() === ActionTypes.FORM_CONTROLS) {
          this.allFormControls.push(data['data']);
        }
      }

    });
  }

  ngOnInit(): void {
    this.translateService.setUpTranslation();
    this.updateStoreControl(ActionTypes.FORM_CONTROLS);
    this.disableAllGeneral();
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
    if (this.querySubscription)
      this.querySubscription.unsubscribe();
    if (this.translateSubscription)
      this.translateSubscription.unsubscribe();
  }

  private updateStoreControl(action: string): void {
    this.store.dispatch({
      type: ActionTypes[action],
      payload: { formGeneral: this.maintenanceGeneralFormGroup }
    });
  }

  /**
   * Total quote calculation
   */

  private calculateTotalQuotes(): void {
    let total = isNaN(parseInt(this.maintenanceGeneralFormGroup.controls['EstimatedContractQuotes'].value, 10) + parseInt(this.maintenanceGeneralFormGroup.controls['EstimatedJobQuotes'].value, 10) + parseInt(this.maintenanceGeneralFormGroup.controls['EstimatedProductSaleQuotes'].value, 10)) ? 0 : parseInt(this.maintenanceGeneralFormGroup.controls['EstimatedContractQuotes'].value, 10) + parseInt(this.maintenanceGeneralFormGroup.controls['EstimatedJobQuotes'].value, 10) + parseInt(this.maintenanceGeneralFormGroup.controls['EstimatedProductSaleQuotes'].value, 10);
    this.maintenanceGeneralFormGroup.controls['EstimatedTotalQuotes'].setValue(total);
  }
  /**
   * Total quote value calculation
   */

  private calculateTotalValues(): void {
    let total = isNaN(parseFloat(this.maintenanceGeneralFormGroup.controls['EstimatedContractValue'].value) + parseFloat(this.maintenanceGeneralFormGroup.controls['EstimatedJobValue'].value) + parseFloat(this.maintenanceGeneralFormGroup.controls['EstimatedProductSaleValue'].value)) ? 0 : parseFloat(this.maintenanceGeneralFormGroup.controls['EstimatedContractValue'].value) + parseFloat(this.maintenanceGeneralFormGroup.controls['EstimatedJobValue'].value) + parseFloat(this.maintenanceGeneralFormGroup.controls['EstimatedProductSaleValue'].value);
    this.maintenanceGeneralFormGroup.controls['EstimatedTotalValue'].setValue(total);
  }

  /***Set fields properties at the time of page load
  */
  public setUI(): void {
    if (this.systemParametersFromParent.systemChars.customBusinessObject.Update === false) {
      this.fieldVisibility.isHiddenProspectStatusCode = true;
      this.maintenanceGeneralFormGroup.controls['EstimatedClosedDate'].setValue(this.systemParametersFromParent.systemChars.DefaultClosedDate);
      this.maintenanceGeneralFormGroup.controls['Probability'].setValue(this.systemParametersFromParent.systemChars.DefaultProbability);
      this.maintenanceGeneralFormGroup.controls['DaysOld'].setValue('0');
      this.maintenanceGeneralFormGroup.controls['EstimatedContractQuotes'].setValue('0');
      this.maintenanceGeneralFormGroup.controls['EstimatedJobQuotes'].setValue('0');
      this.maintenanceGeneralFormGroup.controls['EstimatedProductSaleQuotes'].setValue('0');
      this.maintenanceGeneralFormGroup.controls['EstimatedTotalQuotes'].setValue('0');
      this.maintenanceGeneralFormGroup.controls['EstimatedContractValue'].setValue('0');
      this.maintenanceGeneralFormGroup.controls['EstimatedJobValue'].setValue('0');
      this.maintenanceGeneralFormGroup.controls['EstimatedProductSaleValue'].setValue('0');
      this.maintenanceGeneralFormGroup.controls['EstimatedTotalValue'].setValue('0');
      this.maintenanceGeneralFormGroup.controls['ExpectedValue'].setValue('0');
      this.maintenanceGeneralFormGroup.controls['ExpectedJobValue'].setValue('0');
      this.maintenanceGeneralFormGroup.controls['ExpectedProductSaleValue'].setValue('0');
      this.estimatedContractQuotesOnChange();
      this.estimatedJobQuotesOnChange();
      this.estimatedProductSaleQuotesOnChange();
      this.estimatedContractValueOnChange();
      this.estimatedJobValueOnChange();
      this.estimatedProductSaleValueOnChange();
    }
    if (this.systemParametersFromParent.systemChars.vSICCodeEnable) {
      this.inputParamsCustomerTypeSearch.parentMode = 'LookUp-PremiseIncSIC';
    } else {
      this.inputParamsCustomerTypeSearch.parentMode = 'LookUp';
    }
    if (this.systemParametersFromParent.systemChars.DefaultClosedDate) {
      let dateArr = this.systemParametersFromParent.systemChars.DefaultClosedDate.split('/');
      this.CurrDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
    }

    if (this.systemParametersFromParent.systemChars.vSICCodeEnable) {
      this.fieldVisibility.isHiddenSICCode = false;
      this.fieldRequired.SICCode = true;
    } else {
      this.fieldVisibility.isHiddenSICCode = true;
      this.fieldRequired.SICCode = false;
    }
    if (this.systemParametersFromParent.systemChars.vSCCustomerTypeMandatory) {
      this.fieldRequired.CustomerTypeCode = true;
    } else {
      this.fieldRequired.CustomerTypeCode = false;
    }
    this.fieldRequired['Narrative'] = true;
    if (this.systemParametersFromParent.systemChars.currentURL.match(new RegExp('Prospect', 'i'))) {
      this.fieldRequired.ProspectStatusCode = false;
      this.fieldDisable.ProspectStatusCode = true;
      this.fieldVisibility.isHiddenConvertedToNumber = true;
      this.fieldVisibility.isHiddenchkAuthorise = true;

    } else if (this.systemParametersFromParent.systemChars.currentURL.match(new RegExp('NatAxJob', 'i'))) {
      this.fieldDisable.ProspectStatusCode = false;
      this.fieldRequired.ProspectStatusCode = true;
      this.fieldVisibility.isHiddenConvertedToNumber = false;
      this.fieldVisibility.isHiddenchkAuthorise = true;
    } else {
      this.fieldVisibility.isHiddenConvertedToNumber = false;
      this.fieldVisibility.isHiddenchkAuthorise = false;
    }
    this.fieldDisable.ConvertedToNumber = true;

    if (this.systemParametersFromParent.systemChars.currentURL.match(new RegExp('Confirm', 'i'))) {
      this.fieldRequired.chkAuthorise = true;
      this.fieldRequired.chkReject = true;
      this.fieldRequired.chkBranch = true;
    }

    if (this.systemParametersFromParent.systemCharsvProductSaleInUse) {
      this.fieldVisibility.isHiddenExpectedProductSaleValue = false;
      this.fieldVisibility.productHeading = false;
      this.fieldVisibility.isHiddenEstimatedProductSaleQuotes = false;
      this.fieldVisibility.isHiddenEstimatedProductSaleValue = false;
    }

    let parentMode = this.riExchange.ParentMode(this.systemParametersFromParent.systemChars.routeParams);
    if (parentMode === 'ContactManagement' || parentMode === 'WorkOrderMaintenance' || parentMode === 'ContactRelatedTicket'
      || parentMode === 'SalesOrder' || parentMode === 'CallCentreSearch' || parentMode === 'PipelineGridNew' || parentMode === 'CallCentreSearchNew'
      || parentMode === 'CallCentreSearchNewExisting' || parentMode === 'LostBusinessRequest') {
      this.fieldVisibility.isHiddenProspectStatusCode = false;
    }
    if (this.systemParametersFromParent.systemChars.vSCDisableQuoteDetsOnAddProspect && !parentMode) {
      this.fieldVisibility.isHiddenEstimatedContractQuotes = true;
      this.fieldVisibility.isHiddenEstimatedContractValue = true;
      this.fieldVisibility.isHiddenExpectedValue = true;
      this.fieldVisibility.isHiddenEstimatedClosedDate = true;
    } else {
      this.fieldVisibility.isHiddenEstimatedContractQuotes = false;
      this.fieldVisibility.isHiddenEstimatedContractValue = false;
      this.fieldVisibility.isHiddenExpectedValue = false;
      this.fieldVisibility.isHiddenEstimatedClosedDate = false;
    }
    this.updateValidators();
    this.updateDisable();
  }

  /*** Update validation rules
  */

  public updateValidators(): void {
    for (let f in this.fieldRequired) {
      if (this.fieldRequired.hasOwnProperty(f)) {
        if (this.maintenanceGeneralFormGroup.controls[f]) {
          if (this.fieldRequired[f]) {
            if (f === 'EstimatedContractValue' || f === 'EstimatedJobValue' || f === 'EstimatedProductSaleValue' || f === 'EstimatedContractQuotes' || f === 'EstimatedJobQuotes' || f === 'EstimatedProductSaleQuotes') {
              this.maintenanceGeneralFormGroup.controls[f].setValidators([this.minValidate, this.utils.commonValidate]);
            } else {
              this.maintenanceGeneralFormGroup.controls[f].setValidators([Validators.required, this.utils.commonValidate]);
            }
          } else {
            this.maintenanceGeneralFormGroup.controls[f].clearValidators();
            this.maintenanceGeneralFormGroup.controls[f].setValidators([this.utils.commonValidate]);
            if (f === 'EstimatedContractValue' || f === 'EstimatedJobValue' || f === 'EstimatedProductSaleValue' || f === 'EstimatedContractQuotes' || f === 'EstimatedJobQuotes' || f === 'EstimatedProductSaleQuotes') {
              this.maintenanceGeneralFormGroup.controls[f].setValidators([this.minWithZeroValidate, this.utils.commonValidate]);
            }
          }
          this.maintenanceGeneralFormGroup.controls[f].updateValueAndValidity();
        }
      }
    }

  }

  /*** Update validation rules
  */

  public updateDisable(): void {
    for (let f in this.fieldDisable) {
      if (this.fieldDisable.hasOwnProperty(f)) {
        if (this.fieldDisable[f] && this.maintenanceGeneralFormGroup.controls[f]) {
          this.maintenanceGeneralFormGroup.controls[f].disable();
        }
        else {
          this.maintenanceGeneralFormGroup.controls[f].enable();
        }
        this.maintenanceGeneralFormGroup.controls[f].updateValueAndValidity();
      }
    }
  }

  /**
   * HTML inputs values changes on change of CustomerTypeCode
   */
  public customerTypeCodeOnchange(customerTypeCode: string): void {
    if (customerTypeCode) {
      this.queryParam.set(this.serviceConstants.Action, '0');
      this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
      this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
      this.queryParam.set('CustomerTypeCode', customerTypeCode);
      this.queryParam.set('SICCodeEnable', this.systemParametersFromParent.systemChars.vSICCodeEnable);
      this.queryParam.set('PostDesc', 'CustomerType2');

      this.httpService.makeGetRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam).subscribe(
        (data) => {
          try {
            if (data.CustomerTypeDesc)
              this.maintenanceGeneralFormGroup.controls['CustomerTypeDesc'].setValue(data.CustomerTypeDesc);
            else
              this.maintenanceGeneralFormGroup.controls['CustomerTypeDesc'].setValue('');
            if (data.SICCode)
              this.maintenanceGeneralFormGroup.controls['SICCode'].setValue(data.SICCode);
            else
              this.maintenanceGeneralFormGroup.controls['SICCode'].setValue('');
            if (data.SICDescription)
              this.maintenanceGeneralFormGroup.controls['SICDescription'].setValue(data.SICDescription);
            else
              this.maintenanceGeneralFormGroup.controls['SICDescription'].setValue('');
            this.sICCodeOnchange(this.maintenanceGeneralFormGroup.controls['SICCode'].value);
          } catch (error) {
            this.errorService.emitError(error);
          }

        },
        (error) => {
          this.errorService.emitError(error);
        }
      );
    } else {
      this.maintenanceGeneralFormGroup.controls['CustomerTypeDesc'].setValue('');
    }
  }

  /**
   * Receive CustomerTypeCode details from ellipsis
   */
  public onCustomerTypeSearch(data: any): void {
    if (this.systemParametersFromParent.systemChars.vSICCodeEnable) {
      this.maintenanceGeneralFormGroup.controls['CustomerTypeCode'].setValue(data.CustomerTypeCode);
      this.maintenanceGeneralFormGroup.controls['CustomerTypeDesc'].setValue(data.CustomerTypeDesc);
      this.maintenanceGeneralFormGroup.controls['SICCode'].setValue(data.SICCode);
      this.sICCodeOnchange(data.SICCode);
    } else {
      this.maintenanceGeneralFormGroup.controls['CustomerTypeCode'].setValue(data.CustomerTypeCode);
      this.maintenanceGeneralFormGroup.controls['CustomerTypeDesc'].setValue(data.CustomerTypeDesc);
    }
  }

  public onProspectStatusDataReceived(data: any): void {
    this.maintenanceGeneralFormGroup.controls['ProspectStatusCode'].setValue(data.ProspectStatusCode);
    this.maintenanceGeneralFormGroup.controls['ProspectStatusDesc'].setValue(data.ProspectStatusDesc);
  }
  /*** HTML inputs values changes on change of sICCode
 */
  public sICCodeOnchange(sICCode: string): void {
    if (sICCode) {
      this.queryParam.set(this.serviceConstants.Action, '0');
      this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
      this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
      this.queryParam.set('SICCode', sICCode);
      this.queryParam.set('PostDesc', 'SIC');

      this.httpService.makeGetRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam).subscribe(
        (data) => {
          try {
            this.maintenanceGeneralFormGroup.controls['SICDescription'].setValue(data.SICDesc);
          } catch (error) {
            this.errorService.emitError(error);
          }

        },
        (error) => {
          this.errorService.emitError(error);
        }
      );
    } else {
      this.maintenanceGeneralFormGroup.controls['SICDescription'].setValue('');
    }
  }


  /**
   * Method to call onchange EstimatedContractQuotes value
   */
  public estimatedContractQuotesOnChange(): void {
    this.fieldRequired.EstimatedContractValue = false;
    if (this.maintenanceGeneralFormGroup.controls['EstimatedContractQuotes'].value && this.maintenanceGeneralFormGroup.controls['EstimatedContractQuotes'].value > 0) {
      this.fieldRequired.EstimatedContractValue = true;
      this.updateValidators();
    }
    this.calculateTotalQuotes();
  }

  /**
   * Method to call onchange estimatedJobQuotes value
   */
  public estimatedJobQuotesOnChange(): void {
    this.fieldRequired.EstimatedJobValue = false;
    if (this.maintenanceGeneralFormGroup.controls['EstimatedJobQuotes'].value && this.maintenanceGeneralFormGroup.controls['EstimatedJobQuotes'].value > 0) {
      this.fieldRequired.EstimatedJobValue = true;
    }
    this.updateValidators();
    this.calculateTotalQuotes();
  }

  /**
   * Method to call onchange estimatedProductSale value
   */
  public estimatedProductSaleQuotesOnChange(): void {
    this.fieldRequired.EstimatedProductSaleValue = false;
    if (this.maintenanceGeneralFormGroup.controls['EstimatedProductSaleQuotes'].value && this.maintenanceGeneralFormGroup.controls['EstimatedProductSaleQuotes'].value > 0) {
      this.fieldRequired.EstimatedProductSaleValue = true;
    }
    this.updateValidators();
    this.calculateTotalQuotes();
  }

  /**
   * Method to call onchange estimatedContractValue value
   */
  public estimatedContractValueOnChange(): void {
    this.fieldRequired.EstimatedContractQuotes = false;
    if (this.maintenanceGeneralFormGroup.controls['EstimatedContractValue'].value && this.maintenanceGeneralFormGroup.controls['EstimatedContractValue'].value > 0) {
      this.fieldRequired.EstimatedContractQuotes = true;
    }
    this.updateValidators();
    this.calculateTotalValues();
  }

  /**
   * Method to call onchange estimatedJobValue value
   */
  public estimatedJobValueOnChange(): void {
    this.fieldRequired.EstimatedJobQuotes = false;
    if (this.maintenanceGeneralFormGroup.controls['EstimatedJobValue'].value && this.maintenanceGeneralFormGroup.controls['EstimatedJobValue'].value > 0) {
      this.fieldRequired.EstimatedJobQuotes = true;
    }
    this.calculateTotalValues();
    this.updateValidators();
  }
  /**
   * Method to call onchange estimatedProductSaleValue value
   */
  public estimatedProductSaleValueOnChange(): void {
    this.fieldRequired.EstimatedProductSaleQuotes = false;
    if (this.maintenanceGeneralFormGroup.controls['EstimatedProductSaleValue'].value && this.maintenanceGeneralFormGroup.controls['EstimatedProductSaleValue'].value > 0) {
      this.fieldRequired.EstimatedProductSaleQuotes = true;
    }
    this.updateValidators();
    this.calculateTotalValues();
  }

  /**
   * Set prospect status code
   */
  public setStatuClick(): void {
    this.maintenanceGeneralFormGroup.controls['ProspectStatusCode'].setValue('11');
    this.getStatusDesc();
    this.systemParametersFromParent.systemChars['saveElement'].click();
  }

  /**
   * Get Prospect status
   */
  public getStatusDesc(): void {
    let data = [{
      'table': 'ProspectStatusLang',
      'query': { 'ProspectStatusCode': this.maintenanceGeneralFormGroup.controls['ProspectStatusCode'].value },
      'fields': ['ProspectStatusDesc']
    }];
    this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe((e) => {
      if (e.results[0][0])
        this.maintenanceGeneralFormGroup.controls['ProspectStatusDesc'].setValue(e.results[0][0].ProspectStatusDesc);
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


  /**
   * change date
   */

  public effectiveDateSelectedValue(event: any): void {
    this.maintenanceGeneralFormGroup.controls['EstimatedClosedDate'].setValue(event.value);
  }

  /**
   * Custom validator to validate greater than 0
   */
  public minValidate(field: any): any {
    if (field.value <= 0 || field.value === '') {
      return { 'invalidValue': true };
    }
    return null;
  }

   public minWithZeroValidate(field: any): any {
    if (field.value < 0) {
      return { 'invalidValue': true };
    }
    return null;
  }
  /**
   * Call onchane methods in update mode
   */

  public updateGeneralData(): void {
    this.fieldVisibility.isHiddenProspectStatusCode = false;
    this.fieldRequired.ProspectStatusCode = true;
    let dateArr: Array<number> = this.maintenanceGeneralFormGroup.controls['EstimatedClosedDate'].value.split('/');
    this.CurrDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[1]);
    if (this.maintenanceGeneralFormGroup.controls['ProspectStatusCode'].value === '01' && this.systemParametersFromParent.systemChars.customBusinessObject.Enable === true)
      this.cmdCancelDisable = false;
    else
      this.cmdCancelDisable = true;
    this.estimatedContractQuotesOnChange();
    this.estimatedJobQuotesOnChange();
    this.estimatedProductSaleQuotesOnChange();
    this.estimatedContractValueOnChange();
    this.estimatedJobValueOnChange();
    this.estimatedProductSaleValueOnChange();
    this.updateValidators();
  }


  public disableAllGeneral(): void {
    for (let c in this.maintenanceGeneralFormGroup.controls) {
      if (this.maintenanceGeneralFormGroup.controls.hasOwnProperty(c)) {
        this.maintenanceGeneralFormGroup.controls[c].disable();
      }
    }
    for (let k in this.fieldDisable) {
      if (this.fieldDisable.hasOwnProperty(k)) {
        this.fieldDisable[k] = true;
      }
    }
    this.updateDisable();
    for (let p in this.dateDisable) {
      if (this.dateDisable.hasOwnProperty(p)) {
        this.dateDisable[p] = true;
      }
    }
    this.isDisabledCustomerTypeSearch = true;
  }
  public enableAllGeneral(): void {
    for (let c in this.maintenanceGeneralFormGroup.controls) {
      if (this.maintenanceGeneralFormGroup.controls.hasOwnProperty(c)) {
        this.maintenanceGeneralFormGroup.controls[c].enable();
      }
    }
    for (let k in this.fieldDisable) {
      if (this.fieldDisable.hasOwnProperty(k) && this.disableInitial.indexOf(k) < 0) {
        this.fieldDisable[k] = false;
      }
    }
    this.updateDisable();
    for (let p in this.dateDisable) {
      if (this.dateDisable.hasOwnProperty(p)) {
        this.dateDisable[p] = false;
      }
    }
    this.isDisabledCustomerTypeSearch = false;
    this.setUI();
  }
  public resetGrneralData(): void {
    this.setUI();
  }

  public onSICCodeSearch(data: any): void {
    this.maintenanceGeneralFormGroup.controls['SICCode'].setValue(data.SICCode);
    this.sICCodeOnchange(this.maintenanceGeneralFormGroup.controls['SICCode'].value);
  }

}
