
import { Component, NgZone, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { LocaleTranslationService } from './../../../../shared/services/translation.service';
import { ContractActionTypes } from '../../../../app/actions/contract';

@Component({
  selector: 'icabs-proratamaintenance-type-b',
  templateUrl: 'proRatamaintenance-type-b.html'
})

export class ProRataMaintenanceTypeBComponent implements OnInit, AfterViewInit, OnDestroy {

  public translateSubscription: Subscription;
  public contractNarrativeFormGroup: FormGroup;
  public ProRataNarrative: string;
  public AdditionalCreditInfo: string;
  public isAdditionalCreditInfo: boolean = true;
  public storeSubscription: Subscription;
  public vSCEnableUseProRataNarrative: boolean = false;
  public isPrintCredit: boolean = false;
  public sysCharParams: any = {};
  constructor(
    private zone: NgZone,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<any>,
    private _formBuilder: FormBuilder,
    private localeTranslateService: LocaleTranslationService
  ) {
    this.storeSubscription = store.select('contract').subscribe((data) => {
      switch (data['action']) {
        case ContractActionTypes.FORM_GROUP_PRORATA:
          let formGroup = data['formGroup'];
          this.isAdditionalCreditInfo = formGroup['isAdditionalCreditInfo'];
          this.isPrintCredit = formGroup['isPrintCredit'];
          break;
        case ContractActionTypes.SAVE_SYSCHAR:
          if (data['syschars']) {
            this.sysCharParams = data['syschars'];
            this.vSCEnableUseProRataNarrative = this.sysCharParams['vSCEnableUseProRataNarrative'];
          }
          break;
        default:
          break;
      }
    });
  };

  ngOnInit(): void {
    this.localeTranslateService.setUpTranslation();
    this.contractNarrativeFormGroup = this._formBuilder.group({
      PrintCreditInd: [{ value: '', disabled: false }],
      ProRataNarrative: [{ value: '', disabled: false }],
      AdditionalCreditInfo: [{ value: '', disabled: false }],
      UseProRataNarrative: [{ value: '', disabled: false }]
    });
    // this.setValuesToFormGroup();
    // this.setupGridContactRole();
    this.contractNarrativeFormGroup.controls['ProRataNarrative'].setValidators(Validators.required);
  };
  ngAfterViewInit(): void {
    this.setFormGroupToStore();
  }
  //set from group to store
  private setFormGroupToStore(): void {
    this.store.dispatch({
      type: ContractActionTypes.FORM_GROUP_PRORATA,
      payload: {
        typeB: this.contractNarrativeFormGroup,
        isAdditionalCreditInfo: this.isAdditionalCreditInfo,
        isPrintCredit: this.isPrintCredit
      }
    });
  }
  ngOnDestroy(): void {
    if (this.translateSubscription)
      this.translateSubscription.unsubscribe();
    if (this.storeSubscription)
      this.storeSubscription.unsubscribe();
  }
}
