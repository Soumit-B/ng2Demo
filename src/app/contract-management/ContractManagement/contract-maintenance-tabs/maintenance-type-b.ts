import { Component, NgZone, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { HttpService } from '../../../../shared/services/http-service';
import { Subscription } from 'rxjs/Subscription';
import { ContractActionTypes } from '../../../actions/contract';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { AccountSearchComponent } from '../../../internal/search/iCABSASAccountSearch';
import { InvoiceFeeSearchComponent } from '../../../../app/internal/search/iCABSBInvoiceFeeSearch';
import { InvoiceFrequencySearchComponent } from '../../../internal/search/iCABSBBusinessInvoiceFrequencySearch';
import { PaymentSearchComponent } from '../../../internal/search/iCABSBPaymentTypeSearch';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { Utils } from '../../../../shared/services/utility';
import { GlobalizeService } from '../../../../shared/services/globalize.service';

@Component({
  selector: 'icabs-maintenance-type-b',
  templateUrl: 'maintenance-type-b.html'
})

export class MaintenanceTypeBComponent implements OnInit, AfterViewInit, OnDestroy {
  public inputParams: any = { 'parentMode': 'Contract-Search', 'ContractTypeCode': '', 'countryCode': '', 'businessCode': '' };
  public inputParamsInvoiceFee: any = { 'parentMode': 'LookUp', 'countryCode': '', 'businessCode': '' };
  public inputParamsInvoiceFrequency: any = { 'parentMode': 'LookUp', 'countryCode': '', 'businessCode': '' };
  public inputParamsPaymentType: any = { 'parentMode': 'LookUp', 'countryCode': '', 'businessCode': '' };
  public inputParamsContractDuration: any = { 'parentMode': 'LookUp-Contract', 'countryCode': '', 'businessCode': '' };
  public inputParamsMinimumDuration: any = { 'parentMode': 'LookUp-ContractMinDuration', 'countryCode': '', 'businessCode': '' };
  public inputParamsSubsequentDuration: any = { 'parentMode': 'LookUp-SubsequentDuration', 'countryCode': '', 'businessCode': '' };
  public storeSubscription: Subscription;
  public querySubscription: Subscription;
  public translateSubscription: Subscription;
  public maintenanceBFormGroup: FormGroup;
  public fieldVisibility: any = {
    'invoiceAnnivDate' : true,
    'nextAPIDate' : true,
    'invoiceFrequencyCode' : true,
    'invoiceFrequencyDesc' : true,
    'invoiceFrequencyChargeInd' : false,
    'invoiceFrequencyChargeValue' : false,
    'invoiceFeeCode' : false,
    'invoiceFeeDesc' : false,
    'vatExempt': true,
    'advanceInvoiceInd' : true,
    'createRenewalInd' : true,
    'continuousInd' : true,
    'contractRenewalDate' : false,
    'contractDurationCode' : true,
    'contractDurationDesc' : true,
    'contractExpiryDate' : true,
    'minimumDurationCode' : true,
    'minimumDurationDesc' : true,
    'minimumExpiryDate' : true,
    'subsequentDurationCode' : true,
    'subsequentDurationDesc' : true,
    'apiExemptInd' : true,
    'apiExemptText' : true,
    'invoiceSuspendInd' : true,
    'invoiceSuspendText' : true,
    'hprlExemptInd' : true,
    'paymentTypeCode' : true,
    'paymentDesc' : true,
    'authorityCode' : true,
    'vaddMandateNumber' : true,
    'vaddBranchNumber' : true,
    'vaddApproved' : true,
    'mandateNumberAccount' : false,
    'generate' : false,
    'mandateDate' : false,
    'bankAccountNumber' : true,
    'bankAccountSortCode' : true,
    'paymentDueDay' : true,
    'mandateNumberGenerate': true
  };
  public fieldRequired: any = {
    'invoiceAnnivDate' : true,
    'nextAPIDate' : false,
    'invoiceFrequencyCode' : false,
    'invoiceFrequencyDesc' : false,
    'invoiceFrequencyChargeInd' : false,
    'invoiceFrequencyChargeValue' : false,
    'invoiceFeeCode' : false,
    'invoiceFeeDesc' : false,
    'vatExempt': false,
    'advanceInvoiceInd' : false,
    'createRenewalInd' : false,
    'continuousInd' : false,
    'contractRenewalDate' : false,
    'contractDurationCode' : false,
    'contractDurationDesc' : false,
    'contractExpiryDate' : false,
    'minimumDurationCode' : false,
    'minimumDurationDesc' : false,
    'minimumExpiryDate' : false,
    'subsequentDurationCode' : false,
    'subsequentDurationDesc' : false,
    'apiExemptInd' : false,
    'apiExemptText' : false,
    'invoiceSuspendInd' : false,
    'invoiceSuspendText' : false,
    'hprlExemptInd' : false,
    'paymentTypeCode' : true,
    'paymentDesc' : false,
    'authorityCode' : false,
    'vaddMandateNumber' : false,
    'vaddBranchNumber' : false,
    'vaddApproved' : false,
    'mandateNumberAccount' : false,
    'generate' : false,
    'mandateDate' : false,
    'bankAccountNumber' : false,
    'bankAccountSortCode' : false,
    'paymentDueDay' : false
  };
  public invoiceAnnivDate: Date = void 0;
  public nextAPIDate: Date = void 0;
  public contractRenewalDate: Date = void 0;
  public contractExpiryDate: Date = void 0;
  public minimumExpiryDate: Date = void 0;
  public mandateDate: Date = void 0;

  public invoiceAnnivDateDisplay: string = '';
  public nextAPIDateDisplay: string = '';
  public contractRenewalDateDisplay: string = '';
  public contractExpiryDateDisplay: string = '';
  public minimumExpiryDateDisplay: string = '';
  public mandateDateDisplay: string = '';
  public blnMandateNumberReq: boolean = false;

  public dateObjectsEnabled: Object = {
    invoiceAnnivDate: false,
    nextAPIDate: false,
    contractRenewalDate: false,
    contractExpiryDate: false,
    minimumExpiryDate: false,
    mandateDate: false
  };

  public dateObjectsValidate: Object = {
    invoiceAnnivDate: false,
    nextAPIDate: false,
    contractRenewalDate: false,
    contractExpiryDate: false,
    minimumExpiryDate: false,
    mandateDate: false
  };

  public clearDate: Object = {
    invoiceAnnivDate: false,
    nextAPIDate: false,
    contractRenewalDate: false,
    contractExpiryDate: false,
    minimumExpiryDate: false,
    mandateDate: false
  };

  public invoiceFrequencySearchComponent = InvoiceFrequencySearchComponent;
  public invoiceFeeSearchComponent = InvoiceFeeSearchComponent;
  public paymentTypeCodeComponent = PaymentSearchComponent;
  public autoOpen: boolean = false;
  public modalConfig: any = {
    backdrop: 'static',
    keyboard: true
  };
  public storeData;
  public params: any;
  public otherParams: Object;
  public sysCharParams: Object;
  public mode: Object;
  public searchModalRoute: string = '';
  public showHeader: boolean = true;
  public showCloseButton: boolean = true;
  public isInvoiceFrequencyEllipsisDisabled: boolean = true;
  public isInvoiceFeeEllipsisDisabled: boolean = true;
  public isPaymentTypeEllipsisDisabled: boolean = true;
  public isDurationCodeDropdownDisabled: boolean = false;
  public isMinimumDurationCodeDropdownsDisabled: boolean = false;
  public isSubsequentDurationCodeDropdownDisabled: boolean = false;
  public durationData: any = {};
  public parentQueryParams: any;
  public queryParamsContract: any = {
    action: '0',
    operation: 'Application/iCABSAContractMaintenance',
    module: 'contract',
    method: 'contract-management/maintenance',
    contentType: 'application/x-www-form-urlencoded',
    branchNumber: '',
    branchName: ''
  };
  public contractDurationSelected: Object = {
    id: '',
    text: ''
  };
  public minimumDurationSelected: Object = {
    id: '',
    text: ''
  };
  public subsequentDurationSelected: Object = {
    id: '',
    text: ''
  };

  public queryContract: URLSearchParams = new URLSearchParams();
  public queryLookUp: URLSearchParams = new URLSearchParams();
  public fieldRequiredClone: Object = {};
  public fieldVisibilityClone: Object = {};

  constructor(
    private zone: NgZone,
    private fb: FormBuilder,
    private store: Store<any>,
    private serviceConstants: ServiceConstants,
    private httpService: HttpService,
    private utils: Utils,
    private globalize: GlobalizeService
    ) {
    this.maintenanceBFormGroup = this.fb.group({
      InvoiceAnnivDate: [{ value: '', disabled: false }, Validators.required],
      NextAPIDate: [{ value: '', disabled: false }],
      InvoiceFrequencyCode: [{ value: '', disabled: true }],
      InvoiceFrequencyDesc:     [{ value: '', disabled: true }],
      InvoiceFrequencyChargeInd: [{ value: '', disabled: true }],
      InvoiceFrequencyChargeValue: [{ value: '', disabled: true }],
      InvoiceFeeCode: [{ value: '', disabled: true }],
      InvoiceFeeDesc: [{ value: '', disabled: true }],
      VATExempt: [{ value: '', disabled: true }],
      AdvanceInvoiceInd: [{ value: '', disabled: true }],
      CreateRenewalInd: [{ value: '', disabled: true }],
      ContinuousInd: [{ value: '', disabled: true }],
      ContractRenewalDate: [{ value: '', disabled: true }],
      ContractDurationCode: [{ value: '', disabled: true }],
      ContractDurationDesc: [{ value: '', disabled: true }],
      ContractExpiryDate: [{ value: '', disabled: true }],
      MinimumDurationCode: [{ value: '', disabled: true }],
      MinimumDurationDesc: [{ value: '', disabled: true }],
      MinimumExpiryDate: [{ value: '', disabled: true }],
      SubsequentDurationCode: [{ value: '', disabled: true }],
      SubsequentDurationDesc: [{ value: '', disabled: true }],
      APIExemptInd: [{ value: '', disabled: true }],
      APIExemptText: [{ value: '', disabled: true }],
      InvoiceSuspendInd: [{ value: '', disabled: true }],
      InvoiceSuspendText: [{ value: '', disabled: true }],
      HPRLExemptInd: [{ value: '', disabled: true }],
      PaymentTypeCode: [{ value: '', disabled: true }],
      PaymentDesc: [{ value: '', disabled: true }],
      AuthorityCode: [{ value: '', disabled: true }],
      VADDMandateNumber: [{ value: '', disabled: true }],
      VADDBranchNumber: [{ value: '', disabled: true }],
      VADDApproved: [{ value: '', disabled: true }],
      MandateNumberAccount: [{ value: '', disabled: true }],
      Generate: [{ value: 'Generate', disabled: true }],
      MandateDate: [{ value: '', disabled: true }],
      BankAccountNumber: [{ value: '', disabled: true }],
      BankAccountSortCode: [{ value: '', disabled: true }],
      PaymentDueDay: [{ value: '', disabled: true }]
    });
    this.storeSubscription = store.select('contract').subscribe(data => {
      if (data && data['action']) {
        this.storeData = data;
        this.sysCharParams = data['syschars'];
        switch (data['action']) {
          case ContractActionTypes.SAVE_DATA:
          if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
            this.setFormData(data);
          }
          break;
          case ContractActionTypes.SAVE_ACCOUNT:
          break;
          case ContractActionTypes.SAVE_MODE:
          this.mode = data['mode'];
          this.processForm();
          break;
          case ContractActionTypes.SAVE_SYSCHAR:
          if (data['syschars']) {
            this.sysCharParams = data['syschars'];
            this.processSysChar();
          }
          break;
          case ContractActionTypes.SAVE_PARAMS:
          if (data && data['params']) {
            this.params = data['params'];
            this.inputParams = data['params'];
          }

          break;
          case ContractActionTypes.SAVE_OTHER_PARAMS:
          this.otherParams = data['otherParams'];
          if (this.otherParams['SepaConfigInd'] === true) {
            this.fieldVisibility['vaddMandateNumber'] = false;
            //this.fieldVisibility['mandateNumberAccount'] = true;
            if (this.sysCharParams['vSCEnableBankDetailEntry']) {
              this.fieldVisibility['bankAccountNumber'] = true;
              this.fieldVisibility['bankAccountSortCode'] = true;
            } else {
              this.fieldVisibility['bankAccountNumber'] = false;
              this.fieldVisibility['bankAccountSortCode'] = false;
            }
          } else {
            if (this.sysCharParams && !this.sysCharParams['vSCEnableLegacyMandate']) {
              this.fieldVisibility['vaddMandateNumber'] = false;
            } else {
              this.fieldVisibility['vaddMandateNumber'] = true;
            }
            this.fieldVisibility['mandateNumberAccount'] = false;
          }
          this.hideBankDetailsTab();
          if (this.otherParams['vDisableFields'].indexOf('MinimumDurationCode') > -1 && this.storeData['params']['currentContractType'] === 'C') {
            this.fieldVisibility['minimumDurationCode'] = false;
            this.fieldVisibility['minimumExpiryDate'] = false;
          }
          if (this.otherParams['vDisableFields'].indexOf('SubsequentDurationCode') > -1) {
            this.fieldVisibility['SubsequentDurationCode'] = false;
            this.fieldVisibility['SubsequentDurationDesc'] = false;
          }
          if (this.otherParams['ReqAutoInvoiceFee'] && this.storeData['params']['currentContractType'] === 'C') {
            this.fieldVisibility['invoiceFeeCode'] = false;
          }

          break;
          case ContractActionTypes.SAVE_CODE:

          break;
          case ContractActionTypes.SAVE_SERVICE:
          //this.storeData['services'].localeTranslateService.setUpTranslation();
          this.translateSubscription = this.storeData['services'].localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
              this.fetchTranslationContent();
            }
          });
          break;
          case ContractActionTypes.SAVE_FIELD:
          this.clearContractAddress();
          if (this.sysCharParams['vSCEnablePayTypeAtInvGroupLevel']) {
            if (this.storeData['fieldValue'].AccountNumber) {
              this.fieldVisibility.paymentTypeCode = false;
              this.fieldRequired.paymentTypeCode = false;
              this.isPaymentTypeEllipsisDisabled = true;
            } else {
              this.fieldVisibility.paymentTypeCode = true;
              this.fieldRequired.paymentTypeCode = true;
              this.isPaymentTypeEllipsisDisabled = false;
            }
          }

          if (this.storeData['fieldValue'].AccountNumber) {
            this.maintenanceBFormGroup.controls['VATExempt'].disable();
          }
          break;
          case ContractActionTypes.SAVE_SENT_FROM_PARENT:

          break;
          case ContractActionTypes.LOOKUP:
          this.onInvoiceFrequecyBlur({});
          this.onPaymentTypeBlur({});
          break;
          case ContractActionTypes.PARENT_TO_CHILD_COMPONENT:
          if (data['parentToChildComponent']) {
            let contractExpiryDate = data['parentToChildComponent'].ContractExpiryDate;
            if (contractExpiryDate) {
              let parsedDate: any = this.globalize.parseDateStringToDate(contractExpiryDate);
              if (parsedDate instanceof Date) {
                this.contractExpiryDate = parsedDate;
              } else {
                this.contractExpiryDate = null;
              }
              this.contractExpiryDateDisplay = this.globalize.parseDateToFixedFormat(contractExpiryDate) as string;
              this.maintenanceBFormGroup.controls['ContractExpiryDate'].setValue(this.contractExpiryDateDisplay);
            }

            let invoiceAnnivDate = data['parentToChildComponent'].InvoiceAnnivDate;
            if (invoiceAnnivDate && !this.storeData['mode'].updateMode) {
              let parsedDate: any = this.globalize.parseDateStringToDate(invoiceAnnivDate);
              if (parsedDate instanceof Date) {
                this.invoiceAnnivDate = parsedDate;
              } else {
                this.invoiceAnnivDate = null;
              }
              this.invoiceAnnivDateDisplay = this.globalize.parseDateToFixedFormat(invoiceAnnivDate) as string;
              this.maintenanceBFormGroup.controls['InvoiceAnnivDate'].setValue(this.invoiceAnnivDateDisplay);
            }

            let minimumExpiryDate = data['parentToChildComponent'].MinimumExpiryDate;
            if (minimumExpiryDate) {
              let parsedDate: any = this.globalize.parseDateStringToDate(minimumExpiryDate);
              if (parsedDate instanceof Date) {
                this.minimumExpiryDate = parsedDate;
              } else {
                this.minimumExpiryDate = null;
              }
              this.minimumExpiryDateDisplay = this.globalize.parseDateToFixedFormat(minimumExpiryDate) as string;
              this.maintenanceBFormGroup.controls['MinimumExpiryDate'].setValue(this.minimumExpiryDateDisplay);
            }
          }
          if (this.storeData['mode'].addMode && this.otherParams && this.storeData['formGroup'].main.controls['AccountNumber'].value !== '') {
            this.otherParams['MandateRequired'] = data['parentToChildComponent'] ? data['parentToChildComponent'].MandateRequired : false;
            this.fetchMandatePaymentTypeDetails(this.maintenanceBFormGroup.controls['PaymentTypeCode'] ? this.maintenanceBFormGroup.controls['PaymentTypeCode'].value.toString().trim() : '');
          }
          break;
          case ContractActionTypes.VALIDATE_FORMS:
          if (data['validate'].typeB) {
            this.validateForm();
          }
          break;
          case ContractActionTypes.FORM_RESET:
          this.fieldRequired = JSON.parse(JSON.stringify(this.fieldRequiredClone));
          this.fieldVisibility = JSON.parse(JSON.stringify(this.fieldVisibilityClone));
          this.storeData['fieldRequired'].typeB = this.fieldRequired;
          this.storeData['fieldVisibility'].typeB = this.fieldVisibility;
          for (let i in this.maintenanceBFormGroup.controls) {
              if (this.maintenanceBFormGroup.controls.hasOwnProperty(i)) {
                this.maintenanceBFormGroup.controls[i].clearValidators();
              }
          }
          this.maintenanceBFormGroup.controls['InvoiceAnnivDate'].setValidators(Validators.required);
          this.maintenanceBFormGroup.reset();
          break;

          default:
          break;
        }
      }
    });
}

ngOnInit(): void {
  // content
}

ngAfterViewInit(): void {
  this.store.dispatch({
    type: ContractActionTypes.FORM_GROUP, payload: {
      typeB: this.maintenanceBFormGroup
    }
  });
  this.store.dispatch({
    type: ContractActionTypes.SAVE_REQUIRED_FIELD, payload: {
      typeB: this.fieldRequired
    }
  });
  this.store.dispatch({
    type: ContractActionTypes.SAVE_VISIBILITY_FIELD, payload: {
      typeB: this.fieldVisibility
    }
  });
  this.store.dispatch({
    type: ContractActionTypes.INITIALIZATION, payload: {
      typeB: true
    }
  });
  setTimeout(() => {
    if (this.storeData && this.storeData['data'] && !(Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object)) {
      this.setFormData(this.storeData);
    }
  }, 0);
  this.fieldRequiredClone = JSON.parse(JSON.stringify(this.fieldRequired));
  this.fieldVisibilityClone = JSON.parse(JSON.stringify(this.fieldVisibility));
}

ngOnDestroy(): void {
  this.storeSubscription.unsubscribe();
  if (this.querySubscription)
    this.querySubscription.unsubscribe();
  if (this.translateSubscription)
    this.translateSubscription.unsubscribe();
}

public fetchTranslationContent(): void {
  // translated content
  this.getTranslatedValue('Generate', null).subscribe((res: string) => {
    this.zone.run(() => {
      if (res) {
        if (this.maintenanceBFormGroup.controls['Generate'])
        this.maintenanceBFormGroup.controls['Generate'].setValue(res);
      }
    });
  });
}

public getTranslatedValue(key: any, params: any): any {
  if (params) {
    return this.storeData['services'].translate.get(key, { value: params });
  } else {
    return this.storeData['services'].translate.get(key);
  }
}

public lookUpRecord(data: Object, maxresults: number): any {
  this.queryLookUp.set(this.serviceConstants.Action, '0');
  this.queryLookUp.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
  this.queryLookUp.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
  if (maxresults) {
    this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
  }
  return this.httpService.lookUpRequest(this.queryLookUp, data);
}

public onInvoiceFrequecyBlur(event: any): void {
  if (this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'] && this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].value !== '') {
    let data = [{
      'table': 'SystemInvoiceFrequency',
      'query': { 'InvoiceFrequencyCode': this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'] ? this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].value : '' },
      'fields': ['InvoiceFrequencyCode', 'InvoiceFrequencyDesc']
    }];
    this.lookUpRecord(data, 5).subscribe(
      (e) => {
        if (e['results'] && e['results'].length > 0) {
          if (e['results'][0].length > 0) {
            this.maintenanceBFormGroup.controls['InvoiceFrequencyDesc'].setValue(e['results'][0][0]['InvoiceFrequencyDesc']);
          } else {
            this.maintenanceBFormGroup.controls['InvoiceFrequencyDesc'].setValue('');
            this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].setErrors({});
          }
        } else {
          this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].setErrors({});
        }
      },
      (error) => {
        // error statement
      }
      );

    let functionName = '';
    let params = {};
    if (this.storeData['params']['currentContractType'] === 'C') {
      functionName = 'GetInvoiceFrequencyCharge';
    }
    this.fetchContractData(functionName, { action: '6', InvoiceFrequencyCode: this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].value}).subscribe(
      (e) => {
        if (e.status === GlobalConstant.Configuration.Failure) {
          // statement
        } else {
          if (e.InvoiceFrequencyChargeInd) {
            if (e.InvoiceFrequencyChargeInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
              this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeInd'].setValue(true);
              this.fieldVisibility.invoiceFrequencyChargeValue = true;
            } else {
              this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeInd'].setValue(false);
              this.fieldVisibility.invoiceFrequencyChargeValue = false;
            }
          } else {
            this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeInd'].setValue(false);
            this.fieldVisibility.invoiceFrequencyChargeValue = false;
          }
          this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeValue'].setValue(e.InvoiceFrequencyChargeValue ? e.InvoiceFrequencyChargeValue : '');
        }
      },
      (error) => {
        // error statement
      }
      );
  }
}

public onInvoiceFeeBlur(event: any): void {
  if (this.maintenanceBFormGroup.controls['InvoiceFeeCode'] && this.maintenanceBFormGroup.controls['InvoiceFeeCode'].value !== '') {
    let data = [{
      'table': 'InvoiceFee',
      'query': { 'InvoiceFeeCode': this.maintenanceBFormGroup.controls['InvoiceFeeCode'] ? this.maintenanceBFormGroup.controls['InvoiceFeeCode'].value : '' },
      'fields': ['InvoiceFeeCode', 'InvoiceFeeDesc']
    }];
    this.lookUpRecord(data, 5).subscribe(
      (e) => {
        if (e['results'] && e['results'].length > 0) {
          if (e['results'][0].length > 0) {
            this.maintenanceBFormGroup.controls['InvoiceFeeDesc'].setValue(e['results'][0][0]['InvoiceFeeDesc']);
          } else {
            this.maintenanceBFormGroup.controls['InvoiceFeeDesc'].setValue('');
            this.maintenanceBFormGroup.controls['InvoiceFeeCode'].setErrors({});
          }
        } else {
          this.maintenanceBFormGroup.controls['InvoiceFeeCode'].setErrors({});
        }
      },
      (error) => {
        // error statement
      }
      );
  }
}

public onPaymentTypeBlur(event: any): void {
  if (this.maintenanceBFormGroup.controls['PaymentTypeCode'] && this.maintenanceBFormGroup.controls['PaymentTypeCode'].value !== null) {
    let upperCaseVal = this.maintenanceBFormGroup.controls['PaymentTypeCode'].value.toUpperCase();
    this.maintenanceBFormGroup.controls['PaymentTypeCode'].setValue(upperCaseVal);
    if (this.maintenanceBFormGroup.controls['PaymentTypeCode'] && this.maintenanceBFormGroup.controls['PaymentTypeCode'].value !== '') {
      let data = [{
        'table': 'PaymentType',
        'query': { 'PaymentTypeCode': this.maintenanceBFormGroup.controls['PaymentTypeCode'] ? this.maintenanceBFormGroup.controls['PaymentTypeCode'].value : '' },
        'fields': ['PaymentTypeCode', 'PaymentDesc']
      }];
      this.lookUpRecord(data, 5).subscribe(
        (e) => {
          if (e['results'] && e['results'].length > 0) {
            if (e['results'][0].length > 0) {
              this.maintenanceBFormGroup.controls['PaymentDesc'].setValue(e['results'][0][0]['PaymentDesc']);
              this.fetchMandatePaymentTypeDetails(this.maintenanceBFormGroup.controls['PaymentTypeCode'].value);
            } else {
              this.maintenanceBFormGroup.controls['PaymentDesc'].setValue('');
              this.maintenanceBFormGroup.controls['PaymentTypeCode'].setErrors({});
            }
          } else {
            this.maintenanceBFormGroup.controls['PaymentTypeCode'].setErrors({});
          }
        },
        (error) => {
          // error statement
        }
        );
    }
  }
}

public onMinimumDurationBlur(event: any): void {
  if (this.maintenanceBFormGroup.controls['MinimumDurationCode'] && this.maintenanceBFormGroup.controls['MinimumDurationCode'].value !== '') {
    let data = [{
      'table': 'ContractDuration',
      'query': { 'ContractDurationCode': this.maintenanceBFormGroup.controls['MinimumDurationCode'] ? this.maintenanceBFormGroup.controls['MinimumDurationCode'].value : '' },
      'fields': ['ContractDurationCode', 'ContractDurationDesc']
    }];
    this.lookUpRecord(data, 5).subscribe(
      (e) => {
        if (e['results'] && e['results'].length > 0) {
          if (e['results'][0].length > 0) {
            this.maintenanceBFormGroup.controls['MinimumDurationDesc'].setValue(e['results'][0][0]['ContractDurationDesc']);
          } else {
            this.maintenanceBFormGroup.controls['MinimumDurationDesc'].setValue('');
            this.maintenanceBFormGroup.controls['MinimumDurationCode'].setErrors({});
          }
        } else {
          this.maintenanceBFormGroup.controls['MinimumDurationCode'].setErrors({});
        }
      },
      (error) => {
        // error statement
      }
      );
  }
}

public onContractDurationBlur(event: any): void {
  if (this.maintenanceBFormGroup.controls['ContractDurationCode'] && this.maintenanceBFormGroup.controls['ContractDurationCode'].value !== '') {
    let data = [{
      'table': 'ContractDuration',
      'query': { 'ContractDurationCode': this.maintenanceBFormGroup.controls['ContractDurationCode'] ? this.maintenanceBFormGroup.controls['ContractDurationCode'].value : '' },
      'fields': ['ContractDurationCode', 'ContractDurationDesc']
    }];
    this.lookUpRecord(data, 5).subscribe(
      (e) => {
        if (e['results'] && e['results'].length > 0) {
          if (e['results'][0].length > 0) {
            this.maintenanceBFormGroup.controls['ContractDurationDesc'].setValue(e['results'][0][0]['ContractDurationDesc']);
          } else {
            this.maintenanceBFormGroup.controls['ContractDurationDesc'].setValue('');
            this.maintenanceBFormGroup.controls['MinimumDurationCode'].setErrors({});
          }
        } else {
          this.maintenanceBFormGroup.controls['ContractDurationCode'].setErrors({});
        }
      },
      (error) => {
        // error statement
      }
      );
  }
}

public onSubsequentDurationBlur(event: any): void {
  if (this.maintenanceBFormGroup.controls['SubsequentDurationCode'] && this.maintenanceBFormGroup.controls['SubsequentDurationCode'].value !== '') {
    let data = [{
      'table': 'ContractDuration',
      'query': { 'ContractDurationCode': this.maintenanceBFormGroup.controls['SubsequentDurationCode'] ? this.maintenanceBFormGroup.controls['SubsequentDurationCode'].value : '' },
      'fields': ['ContractDurationCode', 'ContractDurationDesc']
    }];
    this.lookUpRecord(data, 5).subscribe(
      (e) => {
        if (e['results'] && e['results'].length > 0) {
          if (e['results'][0].length > 0) {
            this.maintenanceBFormGroup.controls['SubsequentDurationDesc'].setValue(e['results'][0][0]['ContractDurationDesc']);
          } else {
            this.maintenanceBFormGroup.controls['SubsequentDurationDesc'].setValue('');
            this.maintenanceBFormGroup.controls['MinimumDurationCode'].setErrors({});
          }
        } else {
          this.maintenanceBFormGroup.controls['SubsequentDurationCode'].setErrors({});
        }
      },
      (error) => {
        // error statement
      }
      );
  }
}

public fetchDurationData(returnSubscription?: any): any {
  let method: string = 'contract-management/search';
  let module: string = 'duration';
  let operation: string = 'Business/iCABSBContractDurationSearch';
  let search: URLSearchParams = new URLSearchParams();
  search.set(this.serviceConstants.Action, '0');
  search.set(this.serviceConstants.BusinessCode, this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
  search.set(this.serviceConstants.CountryCode, this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
  if (returnSubscription === true) {
    return this.httpService.makeGetRequest(method, module, operation, search);
  } else {
    this.httpService.makeGetRequest(method, module, operation, search).subscribe(
      (data) => {
        this.durationData = data.records;
        if (this.mode['addMode']) {
          this.setDefaultMinimumDuration();
          this.setDefaultSubsequentDuration();
        }
        }
      );
  }
}

public setDefaultMinimumDuration(): void {
  if (this.sysCharParams['vSCEnableMinimumDuration'] && this.storeData['params']['currentContractType'] === 'C') {
      this.maintenanceBFormGroup.controls['MinimumDurationCode'].setValue(this.sysCharParams['vSCMinimumDuration']);
      for (let i = 0; i < this.durationData.length; i++) {
        if (this.sysCharParams['vSCMinimumDuration'] === this.durationData[i].ContractDurationCode) {
          this.minimumDurationSelected = {
            id: this.sysCharParams['vSCMinimumDuration'],
            text: this.sysCharParams['vSCMinimumDuration'] + ' - ' + this.durationData[i].ContractDurationDesc
          };
          break;
        }
      }
      this.isMinimumDurationCodeDropdownsDisabled = false;
  }
}

public setDefaultSubsequentDuration(): void {
  for (let i = 0; i < this.durationData.length; i++) {
    if (this.sysCharParams['vSCSubsequentDuration'] === this.durationData[i].ContractDurationCode) {
      this.subsequentDurationSelected = {
        id: this.sysCharParams['vSCSubsequentDuration'],
        text: this.sysCharParams['vSCSubsequentDuration'] + ' - ' + this.durationData[i].ContractDurationDesc
      };
      break;
    }
  }
}

public onInvoiceFrequencyChargeChange(event: any): void {
  if (event.target.checked) {
    this.fieldVisibility.invoiceFrequencyChargeValue = true;
  } else {
    this.fieldVisibility.invoiceFrequencyChargeValue = false;
  }
}

public validateForm(): void {
  for (let j in this.fieldVisibility) {
    if (this.fieldVisibility.hasOwnProperty(j)) {
      let key = j['capitalizeFirstLetter']();
      if (!this.fieldVisibility[j]) {
        if (this.maintenanceBFormGroup.controls[key]) {
          this.maintenanceBFormGroup.controls[key].clearValidators();
        }
      }
    }
  }
  for (let i in this.maintenanceBFormGroup.controls) {
    if (this.maintenanceBFormGroup.controls.hasOwnProperty(i)) {
      this.maintenanceBFormGroup.controls[i].markAsTouched();
    }
  }
  let formValid = null;
  if (this.fieldRequired.invoiceAnnivDate && this.fieldVisibility.invoiceAnnivDate && this.invoiceAnnivDateDisplay === '') {
    formValid = false;
  }
  if (this.fieldRequired.contractExpiryDate && this.fieldVisibility.contractExpiryDate && this.contractExpiryDateDisplay === '') {
    formValid = false;
  }
  if (this.fieldRequired.contractRenewalDate && this.fieldVisibility.contractRenewalDate && this.contractRenewalDateDisplay === '') {
    formValid = false;
  }
  if (this.fieldRequired.minimumExpiryDate && this.fieldVisibility.minimumExpiryDate && this.minimumExpiryDateDisplay === '') {
    formValid = false;
  }
  if (this.fieldRequired.mandateDate && this.fieldVisibility.mandateDate && this.mandateDateDisplay === '') {
    formValid = false;
  }
  if (!this.maintenanceBFormGroup.enabled) {
    formValid = true;
  }

  this.dateObjectsValidate['invoiceAnnivDate'] = true;
  this.dateObjectsValidate['nextAPIDate'] = true;
  this.dateObjectsValidate['contractRenewalDate'] = true;
  this.dateObjectsValidate['contractExpiryDate'] = true;
  this.dateObjectsValidate['minimumExpiryDate'] = true;
  this.dateObjectsValidate['mandateDate'] = true;
  setTimeout(() => {
    this.setDefaultDateValidate();
  }, 100);
  if (!this.fieldVisibility.invoiceAnnivDate) {
    this.invoiceAnnivDateDisplay = '';
    this.maintenanceBFormGroup.controls['InvoiceAnnivDate'].setValue('');
    this.maintenanceBFormGroup.controls['InvoiceAnnivDate'].clearValidators();
  }
  if (!this.fieldVisibility.contractExpiryDate) {
    this.contractExpiryDateDisplay = '';
    this.maintenanceBFormGroup.controls['ContractExpiryDate'].setValue('');
    this.maintenanceBFormGroup.controls['ContractExpiryDate'].clearValidators();
  }
  if (!this.fieldVisibility.contractRenewalDate) {
    this.contractRenewalDateDisplay = '';
    this.maintenanceBFormGroup.controls['ContractRenewalDate'].setValue('');
    this.maintenanceBFormGroup.controls['ContractRenewalDate'].clearValidators();
  }
  if (!this.fieldVisibility.minimumExpiryDate) {
    this.minimumExpiryDateDisplay = '';
    this.maintenanceBFormGroup.controls['MinimumExpiryDate'].setValue('');
    this.maintenanceBFormGroup.controls['MinimumExpiryDate'].clearValidators();
  }
  if (!this.fieldVisibility.mandateDate) {
    this.mandateDateDisplay = '';
    this.maintenanceBFormGroup.controls['MandateDate'].setValue('');
    this.maintenanceBFormGroup.controls['MandateDate'].clearValidators();
  }
  this.maintenanceBFormGroup.updateValueAndValidity();
  if (formValid === null) {
    formValid = this.maintenanceBFormGroup.valid;
  }
  //this.maintenanceBFormGroup.enable();
  this.store.dispatch({
    type: ContractActionTypes.FORM_GROUP, payload: {
      typeB: this.maintenanceBFormGroup
    }
  });
  this.store.dispatch({
    type: ContractActionTypes.SAVE_REQUIRED_FIELD, payload: {
      typeB: this.fieldRequired
    }
  });
  this.store.dispatch({
    type: ContractActionTypes.SAVE_VISIBILITY_FIELD, payload: {
      typeB: this.fieldVisibility
    }
  });
  this.store.dispatch({
    type: ContractActionTypes.FORM_VALIDITY, payload: {
      typeB: formValid
    }
  });
}

public setDefaultDateValidate(): void {
  this.dateObjectsValidate['invoiceAnnivDate'] = false;
  this.dateObjectsValidate['nextAPIDate'] = false;
  this.dateObjectsValidate['contractRenewalDate'] = false;
  this.dateObjectsValidate['contractExpiryDate'] = false;
  this.dateObjectsValidate['minimumExpiryDate'] = false;
  this.dateObjectsValidate['mandateDate'] = false;
}

public processSysChar(): void {
  this.maintenanceBFormGroup.controls['Generate'].disable();
  this.maintenanceBFormGroup.controls['AuthorityCode'].enable();
  this.fieldRequired.continuousInd = true;
  this.maintenanceBFormGroup.controls['InvoiceSuspendInd'].disable();
  this.maintenanceBFormGroup.controls['InvoiceSuspendInd'].setValue(false);
  this.maintenanceBFormGroup.controls['InvoiceSuspendText'].disable();
  this.maintenanceBFormGroup.controls['PaymentDueDay'].disable();

  if (this.sysCharParams['vSCAutoCreateRenewalProspect']) {
    this.fieldVisibility.createRenewalInd = true;
  } else {
    this.fieldVisibility.createRenewalInd = false;
  }

  if (this.sysCharParams['vSCEnableHPRLExempt']) {
    this.fieldVisibility.hprlExemptInd = true;
  } else {
    this.fieldVisibility.hprlExemptInd = false;
  }
  if (this.sysCharParams['vSCDisplayContractPaymentDueDay']) {
    this.fieldVisibility.paymentDueDay = true;
  } else {
    this.fieldVisibility.paymentDueDay = false;
  }

  if (this.sysCharParams['vSCEnableTaxCodeDefaulting']) {
    this.fieldVisibility.vatExempt = true;
  } else {
    this.fieldVisibility.vatExempt = false;
  }

  if (this.sysCharParams['vSCEnableTaxCodeDefaulting']) {
    if (this.storeData['mode']['addMode']) {
      this.maintenanceBFormGroup.controls['VATExempt'].disable();
    } else {
      this.maintenanceBFormGroup.controls['VATExempt'].enable();
    }
  }

  if (this.sysCharParams['vSCEnableInvoiceFee']) {
    this.maintenanceBFormGroup.controls['InvoiceFeeCode'].enable();
  } else {
    this.maintenanceBFormGroup.controls['InvoiceFeeCode'].disable();
  }
  if (this.params && this.params['currentContractType'] === 'C') {
    if (this.sysCharParams['vSCEnableInvoiceFee']) {
      this.isInvoiceFeeEllipsisDisabled = false;
    } else {
      this.isInvoiceFeeEllipsisDisabled = true;
    }
    if (this.sysCharParams['vSCEnableMinimumDuration']) {
      this.isMinimumDurationCodeDropdownsDisabled = false;
      this.fieldVisibility['minimumDurationCode'] = false;
      this.fieldVisibility['minimumExpiryDate'] = false;
    } else {
      this.isMinimumDurationCodeDropdownsDisabled = true;
      this.fieldVisibility['minimumDurationCode'] = true;
      this.fieldVisibility['minimumExpiryDate'] = true;
    }
    this.fieldVisibility.contractDurationCode = true;
    this.fieldVisibility.minimumDurationCode = true;
  } else {
    this.fieldVisibility.contractDurationCode = false;
    this.fieldVisibility.minimumDurationCode = false;
  }

  this.hideBankDetailsTab();

  this.fieldVisibility.mandateNumberAccount = false;
  this.maintenanceBFormGroup.controls['MandateNumberAccount'].clearValidators();
  this.checkJobProductSalesParams();
}

public checkJobProductSalesParams(): void {
  if (this.storeData['params']) {
    if (this.storeData['params']['currentContractType'] === 'J' || this.storeData['params']['currentContractType'] === 'P' || !this.sysCharParams['vSCEnableMinimumDuration']) {
      this.fieldVisibility['minimumDurationCode'] = false;
      this.fieldVisibility['minimumExpiryDate'] = false;
    } else {
      this.fieldVisibility['minimumDurationCode'] = true;
      this.fieldVisibility['minimumExpiryDate'] = true;
    }

    if (this.storeData['params']['currentContractType'] === 'J' || this.storeData['params']['currentContractType'] === 'P' || !this.sysCharParams['vSCEnableSubsequentDuration'] ) {
      this.fieldVisibility['subsequentDurationCode'] = false;
    } else {
      this.fieldVisibility['subsequentDurationCode'] = true;
    }

    if (this.storeData['params']['currentContractType'] === 'J' || this.storeData['params']['currentContractType'] === 'P') {
      this.fieldVisibility['continuousInd'] = false;
      this.fieldVisibility['invoiceAnnivDate'] = false;
      this.fieldVisibility['advanceInvoiceInd'] = false;
      this.fieldVisibility['contractDurationCode'] = false;
      this.fieldVisibility['invoiceFrequencyCode'] = false;
      this.fieldVisibility['invoiceFrequencyChargeInd'] = false;
      this.fieldVisibility['contractRenewalDate'] = false;
      this.fieldVisibility['createRenewalInd'] = false;
      this.fieldVisibility['nextAPIDate'] = false;
      this.fieldVisibility['contractRenewalDate'] = false;
      this.fieldVisibility['createRenewalInd'] = false;
      this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].setValue(1);
      this.maintenanceBFormGroup.controls['ContinuousInd'].setValue(false);
      this.maintenanceBFormGroup.controls['AdvanceInvoiceInd'].setValue(false);
    }
    if (this.storeData['params']['currentContractType'] === 'P') {
      this.fieldVisibility['contractExpiryDate'] = false;
      this.fieldVisibility['subsequentDurationCode'] = false;
    } else {
      if (this.storeData['params']['currentContractType'] === 'J') {
        this.fieldVisibility['contractExpiryDate'] = true;
        this.fieldRequired.contractExpiryDate = true;
      }
    }
    if (this.storeData['params']['currentContractType'] === 'C') {
      this.fieldRequired.invoiceAnnivDate = true;
      this.fieldRequired.advanceInvoiceInd = true;
      this.fieldRequired.InvoiceFrequencyChargeInd = false;
      this.fieldRequired.InvoiceFrequencyChargeValue = false;
      if (this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeValue'])
        this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeValue'].clearValidators();
      this.maintenanceBFormGroup.controls['APIExemptInd'].disable();
      this.maintenanceBFormGroup.controls['APIExemptText'].disable();
      this.dateObjectsEnabled['nextAPIDate'] = false;
    }
  }
}

public setFormData(data: any): void {
  if (data['data'].ContractRenewalDate) {
    this.clearDate['contractRenewalDate'] = false;
    let parsedDate: any = this.globalize.parseDateStringToDate(data['data'].ContractRenewalDate);
    if (parsedDate instanceof Date) {
      this.contractRenewalDate = parsedDate;
    } else {
      this.contractRenewalDate = null;
    }
    this.contractRenewalDateDisplay = this.globalize.parseDateToFixedFormat(data['data'].ContractRenewalDate) as string;
    this.maintenanceBFormGroup.controls['ContractRenewalDate'].setValue(this.contractRenewalDateDisplay);
  }
  if (!this.storeData['data']['isCopyClicked']) {
    if (data['data'].InvoiceAnnivDate) {
      this.clearDate['invoiceAnnivDate'] = false;
      let parsedDate: any = this.globalize.parseDateStringToDate(data['data'].InvoiceAnnivDate);
      if (parsedDate instanceof Date) {
        this.invoiceAnnivDate = parsedDate;
      } else {
        this.invoiceAnnivDate = null;
      }
      this.invoiceAnnivDateDisplay = this.globalize.parseDateToFixedFormat(data['data'].InvoiceAnnivDate) as string;
      this.maintenanceBFormGroup.controls['InvoiceAnnivDate'].setValue(this.invoiceAnnivDateDisplay);
    }

    if (data['data'].NextAPIDate) {
      this.clearDate['nextAPIDate'] = false;
      let parsedDate: any = this.globalize.parseDateStringToDate(data['data'].NextAPIDate);
      if (parsedDate instanceof Date) {
        this.nextAPIDate = parsedDate;
      } else {
        this.nextAPIDate = null;
      }
      this.nextAPIDateDisplay = this.globalize.parseDateToFixedFormat(data['data'].NextAPIDate) as string;
      this.maintenanceBFormGroup.controls['NextAPIDate'].setValue(this.nextAPIDateDisplay);
    }

    if (data['data'].ContractExpiryDate) {
      this.clearDate['contractExpiryDate'] = false;
      let parsedDate: any = this.globalize.parseDateStringToDate(data['data'].ContractExpiryDate);
      if (parsedDate instanceof Date) {
        this.contractExpiryDate = parsedDate;
      } else {
        this.contractExpiryDate = null;
      }
      this.contractExpiryDateDisplay = this.globalize.parseDateToFixedFormat(data['data'].ContractExpiryDate) as string;
      this.maintenanceBFormGroup.controls['ContractExpiryDate'].setValue(this.contractExpiryDateDisplay);
    }

    if (data['data'].MinimumExpiryDate) {
      this.clearDate['minimumExpiryDate'] = false;
      let parsedDate: any = this.globalize.parseDateStringToDate(data['data'].MinimumExpiryDate);
      if (parsedDate instanceof Date) {
        this.minimumExpiryDate = parsedDate;
      } else {
        this.minimumExpiryDate = null;
      }
      this.minimumExpiryDateDisplay = this.globalize.parseDateToFixedFormat(data['data'].MinimumExpiryDate) as string;
      this.maintenanceBFormGroup.controls['MinimumExpiryDate'].setValue(this.minimumExpiryDateDisplay);
    }

    if (data['data'].ContinuousInd) {
      if (data['data'].ContinuousInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
        this.maintenanceBFormGroup.controls['ContinuousInd'].setValue(true);
      } else {
        this.maintenanceBFormGroup.controls['ContinuousInd'].setValue(false);
      }
    } else {
      this.maintenanceBFormGroup.controls['ContinuousInd'].setValue(false);
    }
    //this.hideShowDurationFields();
  }

  if (data['data'].MandateDate) {
    this.clearDate['mandateDate'] = false;
    let parsedDate: any = this.globalize.parseDateStringToDate(data['data'].MandateDate);
    if (parsedDate instanceof Date) {
      this.mandateDate = parsedDate;
    } else {
      this.mandateDate = null;
    }
    this.mandateDateDisplay = this.globalize.parseDateToFixedFormat(data['data'].MandateDate) as string;
    this.maintenanceBFormGroup.controls['MandateDate'].setValue(this.mandateDateDisplay);
  }
  this.maintenanceBFormGroup.controls['PaymentTypeCode'].setValue(data['data'].PaymentTypeCode);
  this.maintenanceBFormGroup.controls['PaymentDesc'].setValue('');

  this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].setValue(data['data'].InvoiceFrequencyCode);
  this.maintenanceBFormGroup.controls['InvoiceFrequencyDesc'].setValue(data['data'].InvoiceFrequencyDesc);
  if (data['data'].InvoiceFrequencyChargeInd) {
    if (data['data'].InvoiceFrequencyChargeInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
      this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeInd'].setValue(true);
    } else {
      this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeInd'].setValue(false);
    }
  } else {
    this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeInd'].setValue(false);
  }

  this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeValue'].setValue(data['data'].InvoiceFrequencyChargeValue);
  this.maintenanceBFormGroup.controls['InvoiceFeeCode'].setValue(data['data'].InvoiceFeeCode);
  this.maintenanceBFormGroup.controls['InvoiceFeeDesc'].setValue('');
  if (data['data'].VATExempt) {
    if (data['data'].VATExempt.toUpperCase() === GlobalConstant.Configuration.Yes) {
      this.maintenanceBFormGroup.controls['VATExempt'].setValue(true);
    } else {
      this.maintenanceBFormGroup.controls['VATExempt'].setValue(false);
    }
  } else {
    this.maintenanceBFormGroup.controls['VATExempt'].setValue(false);
  }
  if (data['data'].AdvanceInvoiceInd) {
    if (data['data'].AdvanceInvoiceInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
      this.maintenanceBFormGroup.controls['AdvanceInvoiceInd'].setValue(true);
    } else {
      this.maintenanceBFormGroup.controls['AdvanceInvoiceInd'].setValue(false);
    }
  } else {
    this.maintenanceBFormGroup.controls['AdvanceInvoiceInd'].setValue(false);
  }
  if (data['data'].CreateRenewalInd) {
    if (data['data'].CreateRenewalInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
      this.maintenanceBFormGroup.controls['CreateRenewalInd'].setValue(true);
    } else {
      this.maintenanceBFormGroup.controls['CreateRenewalInd'].setValue(false);
    }
  } else {
    this.maintenanceBFormGroup.controls['CreateRenewalInd'].setValue(false);
  }
  if (data['data'].APIExemptInd) {
    if (data['data'].APIExemptInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
      this.maintenanceBFormGroup.controls['APIExemptInd'].setValue(true);
      this.fieldVisibility.apiExemptInd = true;
    } else {
      this.maintenanceBFormGroup.controls['APIExemptInd'].setValue(false);
      this.fieldVisibility.apiExemptInd = false;
    }
  } else {
    this.maintenanceBFormGroup.controls['APIExemptInd'].setValue(false);
  }
  if (data['data'].InvoiceSuspendInd) {
    if (data['data'].InvoiceSuspendInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
      this.maintenanceBFormGroup.controls['InvoiceSuspendInd'].setValue(true);
    } else {
      this.maintenanceBFormGroup.controls['InvoiceSuspendInd'].setValue(false);
    }
  } else {
    this.maintenanceBFormGroup.controls['InvoiceSuspendInd'].setValue(false);
  }
  if (data['data'].HPRLExemptInd) {
    if (data['data'].HPRLExemptInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
      this.maintenanceBFormGroup.controls['HPRLExemptInd'].setValue(true);
    } else {
      this.maintenanceBFormGroup.controls['HPRLExemptInd'].setValue(false);
    }
  } else {
    this.maintenanceBFormGroup.controls['HPRLExemptInd'].setValue(false);
  }
  if (!this.storeData['data']['isCopyClicked']) {
    this.fetchDurationData(true).subscribe((records) => {
      this.durationData = records.records;
      this.maintenanceBFormGroup.controls['ContractDurationCode'].setValue(data['data'].ContractDurationCode);
      this.maintenanceBFormGroup.controls['ContractDurationDesc'].setValue('');
      this.contractDurationSelected = {
        id: '',
        text: data['data'].ContractDurationCode + ' - ' + this.fetchDurationDesc(data['data'].ContractDurationCode)
      };
      this.maintenanceBFormGroup.controls['MinimumDurationCode'].setValue(data['data'].MinimumDurationCode);
      this.maintenanceBFormGroup.controls['MinimumDurationDesc'].setValue('');
      this.minimumDurationSelected = {
        id: '',
        text: data['data'].MinimumDurationCode + ' - ' + this.fetchDurationDesc(data['data'].MinimumDurationCode)
      };
      this.maintenanceBFormGroup.controls['SubsequentDurationCode'].setValue(data['data'].SubsequentDurationCode);
      this.maintenanceBFormGroup.controls['SubsequentDurationDesc'].setValue('');
      this.subsequentDurationSelected = {
        id: '',
        text: data['data'].SubsequentDurationCode + ' - ' + this.fetchDurationDesc(data['data'].SubsequentDurationCode)
      };
      }
    );
  }
  this.maintenanceBFormGroup.controls['BankAccountNumber'].setValue(data['data'].BankAccountNumber !== 0 ? data['data'].BankAccountNumber : '');
  this.maintenanceBFormGroup.controls['BankAccountSortCode'].setValue(data['data'].BankAccountSortCode !== 0 ? data['data'].BankAccountSortCode : '');
  this.maintenanceBFormGroup.controls['InvoiceSuspendText'].setValue(data['data'].InvoiceSuspendText);
  this.maintenanceBFormGroup.controls['AuthorityCode'].setValue(data['data'].AuthorityCode);
  this.maintenanceBFormGroup.controls['VADDMandateNumber'].setValue(data['data'].VADDMandateNumber);
  this.maintenanceBFormGroup.controls['VADDBranchNumber'].setValue(data['data'].VADDBranchNumber);
  this.maintenanceBFormGroup.controls['VADDApproved'].setValue(false);
  this.maintenanceBFormGroup.controls['MandateNumberAccount'].setValue(data['data'].MandateNumberAccount);
  this.maintenanceBFormGroup.controls['PaymentDueDay'].setValue(data['data'].PaymentDueDay);
  this.maintenanceBFormGroup.controls['APIExemptText'].setValue(data['data'].APIExemptText);

}

public fetchDurationDesc(val: any): string {
  if (val !== null && val !== undefined) {
    let returnVal: string = '';
    for (let i = 0; i < this.durationData.length; i++) {
      if (val.trim() === this.durationData[i].ContractDurationCode.toString()) {
        returnVal = this.durationData[i].ContractDurationDesc;
      }
    }
    return returnVal;
  } else {
    return '';
  }
}

public processForm(): void {
  if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
    this.maintenanceBFormGroup.controls['AuthorityCode'].enable();
    this.maintenanceBFormGroup.controls['BankAccountNumber'].enable();
    this.maintenanceBFormGroup.controls['BankAccountSortCode'].enable();
    this.maintenanceBFormGroup.controls['PaymentTypeCode'].enable();
    this.dateObjectsEnabled['invoiceAnnivDate'] = false;
    if (this.storeData && this.storeData['formGroup'].main.controls['TrialPeriodInd'] && !this.storeData['formGroup'].main.controls['TrialPeriodInd'].value) {
      this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].disable();
    }
    this.maintenanceBFormGroup.controls['AdvanceInvoiceInd'].disable();
    this.maintenanceBFormGroup.controls['ContinuousInd'].disable();
    this.maintenanceBFormGroup.controls['ContractDurationCode'].disable();
    this.dateObjectsEnabled['contractExpiryDate'] = false;
    this.dateObjectsEnabled['minimumExpiryDate'] = true;
    this.maintenanceBFormGroup.controls['VATExempt'].disable();
    this.fieldVisibility.invoiceFrequencyChargeInd = false;
    this.fieldVisibility.invoiceFrequencyChargeValue = false;
    this.fieldVisibility.invoiceFeeCode = false;
    if (this.sysCharParams['vSCEnableInvoiceFee']) {
      this.isInvoiceFeeEllipsisDisabled = false;
    } else {
      this.isInvoiceFeeEllipsisDisabled = true;
    }
    this.fetchMandatePaymentTypeDetails(this.maintenanceBFormGroup.controls['PaymentTypeCode'].value);
    this.onContractDurationBlur({});
    this.onSubsequentDurationBlur({});
    if (this.storeData['params']['currentContractType'] === 'C') {
      this.hideShowDurationFields({});
    }
    if (this.sysCharParams['vSCEnablePayTypeAtInvGroupLevel']) {
      this.maintenanceBFormGroup.controls['PaymentTypeCode'].clearValidators();
      this.fieldRequired.paymentTypeCode = false;
    }
    this.isPaymentTypeEllipsisDisabled = false;
    if (this.sysCharParams['vSCEnableMinimumDuration']) {
      this.isMinimumDurationCodeDropdownsDisabled = false;
    } else {
      this.isMinimumDurationCodeDropdownsDisabled = true;
    }
  }
  if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
    this.maintenanceBFormGroup.controls['AuthorityCode'].disable();
    this.maintenanceBFormGroup.controls['BankAccountNumber'].disable();
    this.maintenanceBFormGroup.controls['BankAccountSortCode'].disable();
    this.maintenanceBFormGroup.controls['PaymentTypeCode'].disable();
    this.fieldVisibility.invoiceFeeCode = false;
    //this.mandateRequiredChange();
    if (this.mode && this.mode['prevMode'] === 'Add') {
      this.resetDate();
    }
    this.isPaymentTypeEllipsisDisabled = true;
    this.dateObjectsEnabled['nextAPIDate'] = false;
    this.dateObjectsEnabled['invoiceAnnivDate'] = false;
    this.dateObjectsEnabled['contractExpiryDate'] = false;
    this.dateObjectsEnabled['minimumExpiryDate'] = false;
    this.isDurationCodeDropdownDisabled = true;
    this.isMinimumDurationCodeDropdownsDisabled = true;
    this.isSubsequentDurationCodeDropdownDisabled = true;
    this.isInvoiceFeeEllipsisDisabled = true;
    this.isInvoiceFrequencyEllipsisDisabled = true;
    this.fieldVisibility.apiExemptInd = false;
    this.fieldVisibility.apiExemptText = false;
    if (this.storeData['data'] && (Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object)) {
      this.contractDurationSelected = {
        id: '',
        text: ''
      };
      this.subsequentDurationSelected = {
        id: '',
        text: ''
      };
      this.minimumDurationSelected = {
        id: '',
        text: ''
      };
    }
  }
  if (this.mode['addMode'] && !this.mode['updateMode'] && !this.mode['searchMode']) {
    this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].setValue('');
    this.maintenanceBFormGroup.controls['InvoiceFrequencyDesc'].setValue('');
    this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeInd'].setValue('');
    this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeValue'].setValue('');
    this.maintenanceBFormGroup.controls['InvoiceFeeCode'].setValue('');
    this.maintenanceBFormGroup.controls['InvoiceFeeDesc'].setValue('');
    this.maintenanceBFormGroup.controls['VATExempt'].setValue('');
    this.maintenanceBFormGroup.controls['AdvanceInvoiceInd'].setValue(true);
    this.maintenanceBFormGroup.controls['CreateRenewalInd'].setValue('');
    this.maintenanceBFormGroup.controls['ContinuousInd'].setValue(true);
    this.maintenanceBFormGroup.controls['ContractDurationCode'].setValue('');
    this.maintenanceBFormGroup.controls['ContractDurationDesc'].setValue('');
    this.contractDurationSelected = {
      id: '',
      text: ''
    };
    this.maintenanceBFormGroup.controls['MinimumDurationCode'].setValue('');
    this.maintenanceBFormGroup.controls['MinimumDurationDesc'].setValue('');
    this.minimumDurationSelected = {
      id: '',
      text: ''
    };
    this.maintenanceBFormGroup.controls['SubsequentDurationCode'].setValue('');
    this.maintenanceBFormGroup.controls['SubsequentDurationDesc'].setValue('');
    this.subsequentDurationSelected = {
      id: '',
      text: ''
    };
    this.maintenanceBFormGroup.controls['APIExemptInd'].setValue('');
    this.maintenanceBFormGroup.controls['APIExemptText'].setValue('');
    this.maintenanceBFormGroup.controls['InvoiceSuspendInd'].setValue('');
    this.maintenanceBFormGroup.controls['InvoiceSuspendText'].setValue('');
    this.maintenanceBFormGroup.controls['HPRLExemptInd'].setValue('');
    this.maintenanceBFormGroup.controls['PaymentTypeCode'].setValue('');
    this.maintenanceBFormGroup.controls['PaymentDesc'].setValue('');
    this.maintenanceBFormGroup.controls['AuthorityCode'].setValue('');
    this.maintenanceBFormGroup.controls['VADDMandateNumber'].setValue('');
    this.maintenanceBFormGroup.controls['VADDBranchNumber'].setValue('');
    this.maintenanceBFormGroup.controls['VADDApproved'].setValue('');
    this.maintenanceBFormGroup.controls['MandateNumberAccount'].setValue('');
    this.maintenanceBFormGroup.controls['BankAccountNumber'].setValue('');
    this.maintenanceBFormGroup.controls['BankAccountSortCode'].setValue('');
    this.maintenanceBFormGroup.controls['PaymentDueDay'].setValue('');
    if (this.sysCharParams['vSCEnableInvoiceFee']) {
      this.isInvoiceFeeEllipsisDisabled = false;
    } else {
      this.isInvoiceFeeEllipsisDisabled = true;
    }

    this.resetDate();

    this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].enable();
    this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeInd'].enable();
    this.maintenanceBFormGroup.controls['InvoiceFrequencyChargeValue'].enable();
    this.maintenanceBFormGroup.controls['InvoiceFeeCode'].enable();
    this.maintenanceBFormGroup.controls['VATExempt'].enable();
    this.maintenanceBFormGroup.controls['AdvanceInvoiceInd'].enable();
    this.maintenanceBFormGroup.controls['CreateRenewalInd'].enable();
    this.maintenanceBFormGroup.controls['ContinuousInd'].enable();
    this.maintenanceBFormGroup.controls['ContractDurationCode'].enable();
    this.isMinimumDurationCodeDropdownsDisabled = false;
    this.maintenanceBFormGroup.controls['MinimumDurationCode'].enable();
    this.isMinimumDurationCodeDropdownsDisabled = false;
    this.maintenanceBFormGroup.controls['SubsequentDurationCode'].enable();
    this.maintenanceBFormGroup.controls['APIExemptInd'].enable();
    this.maintenanceBFormGroup.controls['APIExemptText'].enable();
    this.maintenanceBFormGroup.controls['HPRLExemptInd'].enable();
    this.maintenanceBFormGroup.controls['PaymentTypeCode'].enable();
    this.isPaymentTypeEllipsisDisabled = false;
    this.maintenanceBFormGroup.controls['AuthorityCode'].enable();
    this.maintenanceBFormGroup.controls['VADDMandateNumber'].enable();
    this.maintenanceBFormGroup.controls['VADDBranchNumber'].enable();
    this.maintenanceBFormGroup.controls['VADDApproved'].enable();
    this.maintenanceBFormGroup.controls['MandateNumberAccount'].enable();
    this.maintenanceBFormGroup.controls['BankAccountNumber'].enable();
    this.maintenanceBFormGroup.controls['BankAccountSortCode'].enable();

    this.fetchContractData('GetDefaultInvoiceFrequency,GetDefaultInvoiceFeeCode,GetDefaultPaymentType,GetPaymentTypeDetails', { action: '6'}).subscribe(
      (e) => {
          if (e.status === GlobalConstant.Configuration.Failure) {
              //this.errorService.emitError(e.oResponse);
          } else {
              this.otherParams['InvoiceFeeCode'] = e['InvoiceFeeCode'] ? e['InvoiceFeeCode'] : '';
              this.otherParams['InvoiceFeeDesc'] = e['InvoiceFeeDesc'] ? e['InvoiceFeeDesc'] : '';
              this.otherParams['InvoiceFrequencyCode'] = e['InvoiceFrequencyCode'] ? e['InvoiceFrequencyCode'] : '';
              this.otherParams['InvoiceFrequencyDesc'] = e['InvoiceFrequencyDesc'] ? e['InvoiceFrequencyDesc'] : '';
              this.otherParams['PaymentDesc'] = e['PaymentDesc'] ? e['PaymentDesc'] : '';
              this.otherParams['PaymentTypeCode'] = e['PaymentTypeCode'] ? e['PaymentTypeCode'] : '';
              this.otherParams['MandateRequired'] = e['MandateRequired'] ? e['MandateRequired'] : '';
              this.maintenanceBFormGroup.controls['InvoiceFeeCode'].setValue(this.otherParams['InvoiceFeeCode']);
              this.maintenanceBFormGroup.controls['InvoiceFeeDesc'].setValue(this.otherParams['InvoiceFeeDesc']);
              this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].setValue(this.otherParams['InvoiceFrequencyCode']);
              this.maintenanceBFormGroup.controls['InvoiceFrequencyDesc'].setValue(this.otherParams['InvoiceFrequencyDesc']);
              this.maintenanceBFormGroup.controls['PaymentDesc'].setValue(this.otherParams['PaymentDesc']);
              this.maintenanceBFormGroup.controls['PaymentTypeCode'].setValue(this.otherParams['PaymentTypeCode']);
              if (this.otherParams && this.otherParams['MandateRequired'] && this.otherParams['MandateRequired'].toUpperCase() !== GlobalConstant.Configuration.No) {
                this.fieldVisibility.mandateNumberAccount = true;
                this.fieldVisibility.mandateDate = true;
                this.mandateDate = null;
              } else {
                this.fieldVisibility.mandateNumberAccount = false;
                this.fieldVisibility.mandateDate = false;
                this.maintenanceBFormGroup.controls['MandateNumberAccount'].clearValidators();
              }
              //this.mandateRequiredChange();
              this.fetchMandatePaymentTypeDetails(this.maintenanceBFormGroup.controls['PaymentTypeCode'].value);
          }
      },
      (error) => {
          this.mandateRequiredChange();
          //this.errorService.emitError(error);
      }
      );

    this.dateObjectsEnabled = {
      invoiceAnnivDate: true,
      nextAPIDate: false,
      contractRenewalDate: false,
      contractExpiryDate: true,
      minimumExpiryDate: true,
      mandateDate: true
    };
    this.isInvoiceFrequencyEllipsisDisabled = false;
    this.isPaymentTypeEllipsisDisabled = false;
    this.fieldVisibility.paymentTypeCode = true;
    this.fieldVisibility.invoiceFrequencyCode = true;
    this.fieldVisibility.minimumDurationCode = true;
    this.fieldVisibility.minimumExpiryDate = true;
    this.fieldVisibility.paymentTypeCode = true;

    this.maintenanceBFormGroup.controls['PaymentTypeCode'].setValidators(Validators.required);
    this.fieldVisibility.contractDurationCode = false;
    this.fieldVisibility.contractExpiryDate = false;
    this.setDefaultMinimumDuration();

    this.maintenanceBFormGroup.controls['ContractDurationCode'].disable();
    if (this.storeData['params'] && this.storeData['params']['currentContractType'] === 'C') {
      this.maintenanceBFormGroup.controls['ContractExpiryDate'].disable();
      this.dateObjectsEnabled['contractExpiryDate'] = false;
    }
    this.fieldVisibility.apiExemptInd = false;
    this.fieldVisibility.apiExemptText = false;

    if (this.sysCharParams['vSCEnableInvoiceFee'] && this.storeData['params']['currentContractType'] === 'C') {
      this.fieldVisibility.invoiceFeeCode = true;
      this.fieldRequired.invoiceFeeCode = true;
      this.maintenanceBFormGroup.controls['InvoiceFeeCode'].setValidators(Validators.required);
    } else {
      this.fieldVisibility.invoiceFeeCode = false;
      this.fieldRequired.invoiceFeeCode = false;
      this.maintenanceBFormGroup.controls['InvoiceFeeCode'].clearValidators();
    }

    if (this.sysCharParams['vSCEnableSubsequentDuration'] && this.sysCharParams['vSCSubsequentDuration']) {
      this.fieldVisibility.subsequentDurationCode = true;
      this.maintenanceBFormGroup.controls['SubsequentDurationCode'].setValue(this.sysCharParams['vSCSubsequentDuration']);
      this.subsequentDurationSelected = {
        id: '',
        text: this.sysCharParams['vSCSubsequentDuration']
      };
      this.isSubsequentDurationCodeDropdownDisabled = false;
    } else {
      this.fieldVisibility.subsequentDurationCode = false;
      this.isSubsequentDurationCodeDropdownDisabled = true;
    }

    if (this.sysCharParams['vSCEnableMinimumDuration']) {
      this.isMinimumDurationCodeDropdownsDisabled = false;
    } else {
      this.isMinimumDurationCodeDropdownsDisabled = true;
    }

    if (this.sysCharParams['vSCEnableTaxCodeDefaulting']) {
      this.maintenanceBFormGroup.controls['VATExempt'].enable();
    } else {
      this.maintenanceBFormGroup.controls['VATExempt'].disable();
    }

    this.maintenanceBFormGroup.controls['AdvanceInvoiceInd'].setValue(true);
    this.maintenanceBFormGroup.controls['ContinuousInd'].setValue(true);
    this.hideShowDurationFields({});
    this.store.dispatch({
      type: ContractActionTypes.FORM_GROUP, payload: {
        typeB: this.maintenanceBFormGroup
      }
    });
  }
  this.checkJobProductSalesParams();
  this.maintenanceBFormGroup.updateValueAndValidity();
  if (this.mode['addMode'] || this.mode['updateMode']) {
    this.inputParamsContractDuration = {
      'parentMode': 'LookUp-Contract',
      'countryCode': this.storeData['code'].country,
      'businessCode': this.storeData['code'].business
    };
    this.inputParamsMinimumDuration = {
      'parentMode': 'LookUp-ContractMinDuration',
      'countryCode': this.storeData['code'].country,
      'businessCode': this.storeData['code'].business
    };
    this.inputParamsSubsequentDuration = {
      'parentMode': 'LookUp-SubsequentDuration',
      'countryCode': this.storeData['code'].country,
      'businessCode': this.storeData['code'].business
    };
    this.inputParamsPaymentType = {
      'parentMode': 'LookUp',
      'countryCode': this.storeData['code'].country,
      'businessCode': this.storeData['code'].business
    };
    this.inputParamsInvoiceFrequency = {
      'parentMode': 'LookUp',
      'countryCode': this.storeData['code'].country,
      'businessCode': this.storeData['code'].business
    };
    this.inputParamsInvoiceFee = {
      'parentMode': 'LookUp',
      'countryCode': this.storeData['code'].country,
      'businessCode': this.storeData['code'].business
    };
    this.inputParams = Object.assign({}, this.inputParams, {
      'countryCode': this.storeData['code'].country,
      'businessCode': this.storeData['code'].business
    });
    this.fetchDurationData();

  }
  setTimeout(() => {
    this.fetchTranslationContent();
  }, 0);
}

  public resetDate(): void {
    this.zone.run(() => {
      this.invoiceAnnivDate = this.invoiceAnnivDate === null ? void 0 : null;
      this.invoiceAnnivDateDisplay = '';
      this.maintenanceBFormGroup.controls['InvoiceAnnivDate'].setValue(this.invoiceAnnivDateDisplay);

      this.nextAPIDate = this.nextAPIDate === null ? void 0 : null;;
      this.nextAPIDateDisplay = '';
      this.maintenanceBFormGroup.controls['NextAPIDate'].setValue(this.nextAPIDateDisplay);

      this.contractRenewalDate = this.contractRenewalDate === null ? void 0 : null;;
      this.contractRenewalDateDisplay = '';
      this.maintenanceBFormGroup.controls['ContractRenewalDate'].setValue(this.contractRenewalDateDisplay);

      this.contractExpiryDate = this.contractExpiryDate === null ? void 0 : null;;
      this.contractExpiryDateDisplay = '';
      this.maintenanceBFormGroup.controls['ContractExpiryDate'].setValue(this.contractExpiryDateDisplay);

      this.minimumExpiryDate = this.minimumExpiryDate === null ? void 0 : null;;
      this.minimumExpiryDateDisplay = '';
      this.maintenanceBFormGroup.controls['MinimumExpiryDate'].setValue(this.minimumExpiryDateDisplay);

      this.mandateDate = this.mandateDate === null ? void 0 : null;;
      this.mandateDateDisplay = '';
      this.maintenanceBFormGroup.controls['MandateDate'].setValue(this.mandateDateDisplay);
    });
  }

  public fetchDurationDates(type: string): void {
    let functionName = '';
    let params = {};
    let obj = {};
    let serviceObj = {};
    if (this.storeData['params']['currentContractType'] === 'C') {
        functionName = 'GetAnniversaryDate,GetMinimumExpiryDate,GetExpiryDate';
    } else if (this.storeData['params']['currentContractType'] === 'J') {
        functionName = 'GetAnniversaryDate,GetJobExpiryDate';
    }
    obj = { action: '6',
      ContractCommenceDate: this.storeData['formGroup'].main.controls['ContractCommenceDate'].value ? this.storeData['formGroup'].main.controls['ContractCommenceDate'].value : '',
      MinimumDurationCode: this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].value ? this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].value : '',
      ContractDurationCode: this.storeData['formGroup'].typeB.controls['ContractDurationCode'].value ? this.storeData['formGroup'].typeB.controls['ContractDurationCode'].value : '',
      CompanyCode: this.storeData['formGroup'].typeC.controls['CompanyCode'].value ? this.storeData['formGroup'].typeC.controls['CompanyCode'].value : ''
    };
    if (type === 'M') {
      functionName = 'GetMinimumExpiryDate';
      obj = Object.assign({}, obj, {
          InvoiceAnnivDate: this.storeData['formGroup'].typeB.controls['InvoiceAnnivDate'].value ? this.storeData['formGroup'].typeB.controls['InvoiceAnnivDate'].value : ''
      });
    } else if (type === 'C') {
      functionName = 'GetExpiryDate';
      obj = Object.assign({}, obj, {
          InvoiceAnnivDate: this.storeData['formGroup'].typeB.controls['InvoiceAnnivDate'].value ? this.storeData['formGroup'].typeB.controls['InvoiceAnnivDate'].value : ''
      });
    } else if (type === 'S') {
      functionName = 'GetSubsequentExpiryDate';
      obj = Object.assign({}, obj, {
          InvoiceAnnivDate: this.storeData['formGroup'].typeB.controls['InvoiceAnnivDate'].value ? this.storeData['formGroup'].typeB.controls['InvoiceAnnivDate'].value : ''
      });
    }

    for (let o in obj) {
      if (obj[o] !== '') {
        serviceObj[o] = obj[o];
      }
    }
    this.fetchContractData(functionName, serviceObj).subscribe(
      (e) => {
          if (e.status === GlobalConstant.Configuration.Failure) {
              // error statement
          } else {
              this.store.dispatch({
                  type: ContractActionTypes.PARENT_TO_CHILD_COMPONENT, payload: e
              });
          }
      },
      (error) => {
          //this.errorService.emitError(error);
      }
      );
  }

  public fetchMinimumDurationMandateRequired(): void {
    let functionName = '';
    let params = {};
    let obj = {};
    let serviceObj = {};
    functionName = 'GetMinimumExpiryDate,GetPaymentTypeDetails,GetNoticePeriod';
    obj = { action: '6',
      ContractCommenceDate: this.storeData['formGroup'].main.controls['ContractCommenceDate'].value ? this.storeData['formGroup'].main.controls['ContractCommenceDate'].value : '',
      MinimumDurationCode: this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].value ? this.storeData['formGroup'].typeB.controls['MinimumDurationCode'].value : '',
      InvoiceAnnivDate: this.storeData['formGroup'].typeB.controls['InvoiceAnnivDate'].value ? this.storeData['formGroup'].typeB.controls['InvoiceAnnivDate'].value : '',
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
              // error statement
          } else {
              if (e.MinimumExpiryDate) {
                let parsedDate: any = this.globalize.parseDateStringToDate(e.MinimumExpiryDate);
              if (parsedDate instanceof Date) {
                this.minimumExpiryDate = parsedDate;
              } else {
                this.minimumExpiryDate = null;
              }
              this.minimumExpiryDateDisplay = this.globalize.parseDateToFixedFormat(e.MinimumExpiryDate) as string;
              this.maintenanceBFormGroup.controls['MinimumExpiryDate'].setValue(this.minimumExpiryDateDisplay);
              if (e.MandateRequired && this.otherParams) {
                  this.otherParams['MandateRequired'] = e.MandateRequired;
                  this.storeData['otherParams']['MandateRequired'] = e.MandateRequired;
                  this.setRequiredStatusInBankFields();
                }
              }
          }
      },
      (error) => {
          //this.errorService.emitError(error);
      }
      );
  }

  public hideShowDurationFields(event: any): void {
    if (this.maintenanceBFormGroup.controls['ContinuousInd'] && this.maintenanceBFormGroup.controls['ContinuousInd'].value === true) {
      this.maintenanceBFormGroup.controls['ContractDurationCode'].disable();
      this.maintenanceBFormGroup.controls['ContractExpiryDate'].disable();
      this.maintenanceBFormGroup.controls['CreateRenewalInd'].disable();
      if (this.maintenanceBFormGroup.controls['ContractDurationCode']) {
        this.maintenanceBFormGroup.controls['ContractDurationCode'].clearValidators();
      }
      this.fieldRequired['contractDurationCode'] = false;
      this.fieldVisibility['contractExpiryDate'] = false;
      this.fieldVisibility['contractDurationCode'] = false;
      this.fieldVisibility['contractRenewalDate'] = false;
      this.fieldVisibility['createRenewalInd'] = false;
      this.contractExpiryDate = null;
      this.maintenanceBFormGroup.controls['ContractDurationCode'].setValue('');
      this.maintenanceBFormGroup.controls['ContractDurationDesc'].setValue('');
    } else {
      this.fieldVisibility['contractExpiryDate'] = true;
      this.fieldVisibility['contractDurationCode'] = true;
      if (this.sysCharParams['vSCEnableRenewals']) {
        this.fieldVisibility['contractRenewalDate'] = true;
      } else {
        this.fieldVisibility['contractRenewalDate'] = false;
      }
      if (event.target) {
        this.contractExpiryDate = null;
      }
      this.maintenanceBFormGroup.controls['ContractDurationCode'].enable();
      this.isDurationCodeDropdownDisabled = false;
      this.fieldRequired['contractDurationCode'] = true;
      this.maintenanceBFormGroup.controls['ContractDurationCode'].setValidators(Validators.required);

      if (!this.sysCharParams['vSCAutoCreateRenewalProspect']) {
        this.maintenanceBFormGroup.controls['CreateRenewalInd'].disable();
        this.maintenanceBFormGroup.controls['CreateRenewalInd'].setValue(false);
        this.fieldVisibility['createRenewalInd'] = false;
      } else {
        this.fieldVisibility['createRenewalInd'] = true;
        this.maintenanceBFormGroup.controls['CreateRenewalInd'].enable();
        this.maintenanceBFormGroup.controls['CreateRenewalInd'].setValue(true);
      }
      if (this.storeData['params']['currentContractType'] === 'C') {
        this.maintenanceBFormGroup.controls['ContractExpiryDate'].enable();

      }
    }
    this.maintenanceBFormGroup.updateValueAndValidity();
    if (this.storeData['mode'].addMode) {
      this.fetchDurationDates('C');
    }

  }

  public clearContractAddress(): void {
    if (this.storeData && this.storeData['formGroup'].main.controls['AccountName']) {
      this.storeData['formGroup'].main.controls['AccountName'].setValue('');
    }
    if (this.sysCharParams['vSCEnableInvoiceFee'] && this.storeData['params']['currentContractType'] === 'C' && this.storeData['fieldValue'].AccountNumber && this.mode['addMode']) {
      this.fieldVisibility.invoiceFeeCode = true;
      this.fieldRequired.invoiceFeeCode = true;
      this.maintenanceBFormGroup.controls['InvoiceFeeCode'].setValidators(Validators.required);
    } else {
      this.fieldVisibility.invoiceFeeCode = false;
      this.fieldRequired.invoiceFeeCode = false;
      this.maintenanceBFormGroup.controls['InvoiceFeeCode'].clearValidators();
    }
  }

  public hideBankDetailsTab(): void {
    if (this.sysCharParams['vSCHideBankDetailsTab']) {
        this.fieldVisibility.bankAccountNumber = false;
        this.fieldVisibility.bankAccountSortCode = false;
      } else {
        this.fieldVisibility.bankAccountNumber = true;
        this.fieldVisibility.bankAccountSortCode = true;
      }
  }

  public mandateRequiredChange(): void {
    if (this.sysCharParams['vSCEnableBankDetailEntry']) {
      this.fieldVisibility.bankAccountNumber = true;
      this.fieldVisibility.bankAccountSortCode = true;
      if (this.mode['addMode'] && !this.mode['updateMode'] && !this.mode['searchMode']) {
        this.maintenanceBFormGroup.controls['BankAccountNumber'].enable();
        this.maintenanceBFormGroup.controls['BankAccountSortCode'].enable();
      } else {
        this.maintenanceBFormGroup.controls['BankAccountNumber'].disable();
        this.maintenanceBFormGroup.controls['BankAccountSortCode'].disable();
      }
    } else {
      this.fieldVisibility.bankAccountNumber = false;
      this.fieldVisibility.bankAccountSortCode = false;
    }
    this.hideBankDetailsTab();
    this.fieldRequired.mandateNumberAccount = false;
    this.maintenanceBFormGroup.controls['MandateNumberAccount'].clearValidators();
    this.fieldRequired.mandateDate = false;
    this.blnMandateNumberReq = false;
    if (this.otherParams && this.otherParams['SepaConfigInd'] === true) {
      if (this.otherParams && this.otherParams['MandateRequired'] && this.otherParams['MandateRequired'].toUpperCase() !== GlobalConstant.Configuration.No) {
        this.fieldVisibility.mandateNumberAccount = true;
        this.fieldVisibility.mandateDate = true;
        this.mandateDate = null;
        this.clearDate['mandateDate'] = false;
        setTimeout(() => {
            this.clearDate['mandateDate'] = true;
        }, 400);
        this.maintenanceBFormGroup.controls['MandateNumberAccount'].setValue('');
        if (this.sysCharParams['vSCEnableBankDetailEntry'] && this.sysCharParams['vSCEnableSEPAFinanceMandate'] && !this.sysCharParams['vSCEnableSEPAFinanceMandateLog']) {
          this.fieldRequired.mandateNumberAccount = true;
          this.fieldRequired.mandateDate = true;
          this.maintenanceBFormGroup.controls['MandateNumberAccount'].setValidators(Validators.required);
          this.fieldVisibility.mandateNumberGenerate = true;
          this.blnMandateNumberReq = true;
          if (this.mode['addMode'] || this.mode['updateMode']) {
            this.maintenanceBFormGroup.controls['Generate'].enable();
          } else {
            this.maintenanceBFormGroup.controls['Generate'].disable();
          }

        } else {
          this.fieldVisibility.mandateNumberGenerate = false;
        }

        if (!this.storeData['formGroup'].main.controls['AccountNumber'].value || this.storeData['formGroup'].main.controls['AccountNumber'].value === '') {
          this.maintenanceBFormGroup.controls['MandateNumberAccount'].enable();
          this.maintenanceBFormGroup.controls['MandateDate'].enable();
          this.maintenanceBFormGroup.controls['Generate'].enable();
          this.dateObjectsEnabled['mandateDate'] = true;
        } else {
          this.fetchContractData('GetAccountMandateNumber', { action: '6', AccountNumber: this.storeData['formGroup'].main.controls['AccountNumber'].value }).subscribe(
            (e) => {
              if (e.status === GlobalConstant.Configuration.Failure) {
                // error statement
              } else {
                if (e) {
                  if (e.AccountMandate) {
                    this.maintenanceBFormGroup.controls['MandateNumberAccount'].setValue(e.AccountMandate);
                    this.maintenanceBFormGroup.controls['MandateNumberAccount'].disable();
                    if (e.MandateDate) {
                      this.clearDate['mandateDate'] = false;
                      let parsedDate: any = this.globalize.parseDateStringToDate(e.MandateDate);
                      if (parsedDate instanceof Date) {
                        this.mandateDate = parsedDate;
                      } else {
                        this.mandateDate = null;
                      }
                      this.mandateDateDisplay = this.globalize.parseDateToFixedFormat(e.MandateDate) as string;
                      this.maintenanceBFormGroup.controls['MandateDate'].setValue(this.mandateDateDisplay);
                    }
                    this.dateObjectsEnabled['mandateDate'] = false;
                    this.maintenanceBFormGroup.controls['Generate'].disable();
                  } else {
                    if (this.storeData['mode']['addMode'] || this.storeData['mode']['updateMode']) {
                      this.maintenanceBFormGroup.controls['MandateNumberAccount'].enable();
                      this.maintenanceBFormGroup.controls['MandateDate'].enable();
                      this.maintenanceBFormGroup.controls['Generate'].enable();
                      this.dateObjectsEnabled['mandateDate'] = true;
                    }
                  }
                } else {
                  this.maintenanceBFormGroup.controls['MandateNumberAccount'].disable();
                  this.maintenanceBFormGroup.controls['MandateDate'].disable();
                  this.maintenanceBFormGroup.controls['Generate'].disable();
                }

              }
            },
            (error) => {
              //this.errorService.emitError(error);
            }
            );
        }
      } else {
        this.fieldVisibility.mandateNumberAccount = false;
        this.fieldVisibility.mandateDate = false;
        this.maintenanceBFormGroup.controls['MandateNumberAccount'].clearValidators();
      }

    } else {
      this.fieldVisibility.mandateNumberAccount = false;
      this.fieldVisibility.mandateDate = false;
      this.maintenanceBFormGroup.controls['MandateNumberAccount'].clearValidators();
      if (!this.storeData['mode']['addMode'] && this.otherParams && this.otherParams['MandateRequired'] && this.otherParams['MandateRequired'].toUpperCase() !== GlobalConstant.Configuration.No && this.sysCharParams['vSCEnableLegacyMandate']) {
        this.fieldVisibility.vaddMandateNumber = true;
      } else {
        this.fieldVisibility.vaddMandateNumber = false;
      }
    }
    this.maintenanceBFormGroup.controls['BankAccountNumber'].updateValueAndValidity();
    this.maintenanceBFormGroup.controls['BankAccountSortCode'].updateValueAndValidity();
    this.maintenanceBFormGroup.controls['MandateNumberAccount'].updateValueAndValidity();
    this.maintenanceBFormGroup.updateValueAndValidity();
  }

  public onGenerateClick(event: any): void {
    this.fetchContractData('GenerateNewRef', { action: '6', AccountNumber: this.storeData['fieldValue'].AccountNumber }).subscribe(
      (e) => {
        if (e.status === GlobalConstant.Configuration.Failure) {
          // statement
        } else {
          if (e && e.MandateNumberAccount) {
            this.maintenanceBFormGroup.controls['MandateNumberAccount'].setValue(e.MandateNumberAccount);
            if (!this.blnMandateNumberReq) {
              this.fieldRequired.mandateDate = false;
            } else {
              this.fieldRequired.mandateDate = true;
            }
          }
        }
      },
      (error) => {
        //this.errorService.emitError(error);
      }
      );
  }

  public setRequiredStatusInBankFields(): void {
    if (this.otherParams && this.otherParams['MandateRequired'] && this.otherParams['MandateRequired'].toUpperCase() === GlobalConstant.Configuration.Yes && this.sysCharParams['vSCEnableBankDetailEntry']) {
      if (this.storeData['mode']['addMode']) {
        this.fieldRequired.bankAccountSortCode = true;
        this.maintenanceBFormGroup.controls['BankAccountSortCode'].setValidators(Validators.required);
        this.fieldRequired.bankAccountNumber = true;
        this.maintenanceBFormGroup.controls['BankAccountNumber'].setValidators(Validators.required);
        this.maintenanceBFormGroup.controls['BankAccountNumber'].updateValueAndValidity();
        this.maintenanceBFormGroup.controls['BankAccountSortCode'].updateValueAndValidity();
      }
    } else {
      this.fieldRequired.bankAccountSortCode = false;
      this.fieldRequired.bankAccountNumber = false;
      this.maintenanceBFormGroup.controls['BankAccountNumber'].clearValidators();
      this.maintenanceBFormGroup.controls['BankAccountSortCode'].clearValidators();
      this.maintenanceBFormGroup.controls['BankAccountNumber'].updateValueAndValidity();
      this.maintenanceBFormGroup.controls['BankAccountSortCode'].updateValueAndValidity();
    }

  }

  public onMandateNumberAccountBlur(event: any): void {
    if (!event.target.value && !this.blnMandateNumberReq) {
      this.fieldRequired.mandateDate = false;
    } else {
      this.fieldRequired.mandateDate = true;
    }
  }

  public fetchContractData(functionName: string, params: Object): any {
    let businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
    let countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();

    this.queryContract.set(this.serviceConstants.BusinessCode, businessCode);
    this.queryContract.set(this.serviceConstants.CountryCode, countryCode);
    this.queryContract.set(this.serviceConstants.Action, this.queryParamsContract.action);
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

  public onContractDurationCodeDataReceived(data: any): void {
    this.maintenanceBFormGroup.controls['ContractDurationCode'].setValue(data.ContractDurationCode);
    this.maintenanceBFormGroup.controls['ContractDurationDesc'].setValue(data.ContractDurationDesc);
    this.fetchDurationDates('C');
  }
  public onMinimumDurationCodeDataReceived(data: any): void {
    this.maintenanceBFormGroup.controls['MinimumDurationCode'].setValue(data.MinimumDurationCode);
    this.maintenanceBFormGroup.controls['MinimumDurationDesc'].setValue(data.MinimumDurationDesc);
    this.fetchDurationDates('M');
  }
  public onSubsequentDurationCodeDataReceived(data: any): void {
    this.maintenanceBFormGroup.controls['SubsequentDurationCode'].setValue(data.SubsequentDurationCode);
    this.maintenanceBFormGroup.controls['SubsequentDurationDesc'].setValue(data.SubsequentDurationDesc);
    this.fetchDurationDates('S');
  }

  public onPaymentTypeDataReceived(data: any): void {
    if (data) {
      this.maintenanceBFormGroup.controls['PaymentTypeCode'].setValue(data.PaymentTypeCode);
      this.maintenanceBFormGroup.controls['PaymentDesc'].setValue(data.PaymentDesc);
      this.fetchMandatePaymentTypeDetails(data.PaymentTypeCode);
    }
  }

  public fetchMandatePaymentTypeDetails(code: any): void {
    this.fetchContractData('GetPaymentTypeDetails,GetNoticePeriod', { 'PaymentTypeCode' : code, 'BranchNumber': this.utils.getBranchCode() }).subscribe(
        (e) => {
          if (e.status === GlobalConstant.Configuration.Failure) {
            //this.errorService.emitError(e.oResponse);
          } else {
            if (this.otherParams && this.storeData['otherParams']) {
              this.otherParams['MandateRequired'] = e.MandateRequired;
              this.storeData['otherParams']['MandateRequired'] = e.MandateRequired;
            }
            this.mandateRequiredChange();
            this.setRequiredStatusInBankFields();
          }
        },
        (error) => {
          // error statement
        }
      );
  }

  public onCapitalize(control: any): void {
      if (!this.sysCharParams['vSCCapitalFirstLtr']) {
        this.maintenanceBFormGroup.controls[control].setValue(this.maintenanceBFormGroup.controls[control].value.toString().capitalizeFirstLetter());
      }
  }

  public onInvoiceFrequencyDataReceived(data: any): void {
    if (data) {
      if (this.maintenanceBFormGroup.controls['InvoiceFrequencyCode']) {
         this.maintenanceBFormGroup.controls['InvoiceFrequencyCode'].setValue(data.InvoiceFrequencyCode);
      }
      if (this.maintenanceBFormGroup.controls['InvoiceFrequencyDesc']) {
         this.maintenanceBFormGroup.controls['InvoiceFrequencyDesc'].setValue(data.InvoiceFrequencyDesc);
      }
    }
  }

  public onInvoiceFeeDataReceived(data: any): void {
    if (data.InvoiceFeeDesc) {
      this.maintenanceBFormGroup.controls['InvoiceFeeCode'].setValue(data.InvoiceFeeCode);
      this.maintenanceBFormGroup.controls['InvoiceFeeDesc'].setValue(data.InvoiceFeeDesc);
    }
    else {
      this.maintenanceBFormGroup.controls['InvoiceFeeCode'].setValue(data.InvoiceFeeCode);
    }
  }

  public invoiceAnnivDateSelectedValue(value: any): void {
    if (value && value.value) {
      if (value.value !== this.invoiceAnnivDateDisplay) {
        this.invoiceAnnivDateDisplay = value.value;
        this.maintenanceBFormGroup.controls['InvoiceAnnivDate'].setValue(this.invoiceAnnivDateDisplay);
        this.maintenanceBFormGroup.controls['InvoiceAnnivDate'].markAsDirty();
        this.fetchMinimumDurationMandateRequired();
      }
    } else {
      this.invoiceAnnivDateDisplay = '';
      this.maintenanceBFormGroup.controls['InvoiceAnnivDate'].setValue('');
    }
  }

  public nextAPIDateSelectedValue(value: any): void {
    if (value && value.value) {
      if (value.value !== this.nextAPIDateDisplay) {
        this.nextAPIDateDisplay = value.value;
        this.maintenanceBFormGroup.controls['NextAPIDate'].setValue(this.nextAPIDateDisplay);
        this.maintenanceBFormGroup.controls['NextAPIDate'].markAsDirty();
      }
    } else {
      this.nextAPIDateDisplay = '';
      this.maintenanceBFormGroup.controls['NextAPIDate'].setValue('');
    }
  }

  public contractRenewalDateSelectedValue(value: any): void {
    if (value && value.value) {
      if (value.value !== this.contractRenewalDateDisplay) {
        this.contractRenewalDateDisplay = value.value;
        this.maintenanceBFormGroup.controls['ContractRenewalDate'].setValue(this.contractRenewalDateDisplay);
        this.maintenanceBFormGroup.controls['ContractRenewalDate'].markAsDirty();
      }
    } else {
      this.contractRenewalDateDisplay = '';
      this.maintenanceBFormGroup.controls['ContractRenewalDate'].setValue('');

    }
  }

  public contractExpiryDateSelectedValue(value: any): void {
    if (value && value.value) {
      if (value.value !== this.contractExpiryDateDisplay) {
        this.contractExpiryDateDisplay = value.value;
        this.maintenanceBFormGroup.controls['ContractExpiryDate'].setValue(this.contractExpiryDateDisplay);
        this.maintenanceBFormGroup.controls['ContractExpiryDate'].markAsDirty();
      }
    } else {
      this.contractExpiryDateDisplay = '';
      this.maintenanceBFormGroup.controls['ContractExpiryDate'].setValue('');
    }
  }

  public minimumExpiryDateSelectedValue(value: any): void {
    if (value && value.value) {
      if (value.value !== this.minimumExpiryDateDisplay) {
        this.minimumExpiryDateDisplay = value.value;
        this.maintenanceBFormGroup.controls['MinimumExpiryDate'].setValue(this.minimumExpiryDateDisplay);
        this.maintenanceBFormGroup.controls['MinimumExpiryDate'].markAsDirty();
      }
    } else {
      this.minimumExpiryDateDisplay = '';
      this.maintenanceBFormGroup.controls['MinimumExpiryDate'].setValue('');
    }
  }

  public mandateDateSelectedValue(value: any): void {
    if (value && value.value) {
      if (value.value !== this.mandateDateDisplay) {
        this.mandateDateDisplay = value.value;
        this.maintenanceBFormGroup.controls['MandateDate'].setValue(this.mandateDateDisplay);
        this.maintenanceBFormGroup.controls['MandateDate'].markAsDirty();
      }
    } else {
      this.mandateDateDisplay = '';
      this.maintenanceBFormGroup.controls['MandateDate'].setValue('');
    }
  }
}
