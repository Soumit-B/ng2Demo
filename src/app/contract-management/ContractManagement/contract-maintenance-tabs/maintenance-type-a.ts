import { Component, NgZone, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { HttpService } from '../../../../shared/services/http-service';
import { ContractActionTypes } from '../../../actions/contract';
import { AccountSearchComponent } from '../../../internal/search/iCABSASAccountSearch';
import { PostCodeSearchComponent } from '../../../internal/search/iCABSBPostcodeSearch.component';
import { MarktSelectSearchComponent } from '../../../internal/search/iCABSMarktSelectSearch.component';
import { ScreenNotReadyComponent } from '../../../../shared/components/screenNotReady';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { Utils } from '../../../../shared/services/utility';
import { InternalMaintenanceServiceModuleRoutes } from './../../../base/PageRoutes';

@Component({
  selector: 'icabs-maintenance-type-a',
  templateUrl: 'maintenance-type-a.html'
})

export class MaintenanceTypeAComponent implements OnInit, AfterViewInit, OnDestroy {
  public inputParams: any = { 'parentMode': 'Contract-Search', 'ContractTypeCode': '', 'countryCode': '', 'businessCode': '' };
  public inputParamsZipCode: any = { 'parentMode': 'Contract', 'ContractTypeCode': '', 'countryCode': '', 'businessCode': '' };
  public storeSubscription: Subscription;
  public querySubscription: Subscription;
  public translateSubscription: Subscription;
  public maintenanceAFormGroup: FormGroup;
  public fieldVisibility: any = {
    'contractAddressLine1': true,
    'cmdGetAddress': true,
    'contractAddressLine2': true,
    'contractAddressLine3': false,
    'contractAddressLine4': true,
    'contractAddressLine5': true,
    'contractPostcode': true,
    'countryCode': true,
    'countryDesc': true,
    'gpsCoordinateX': false,
    'gpsCoordinateY': false,
    'contractContactName': true,
    'btnAmendContact': false,
    'contractContactPosition': true,
    'contractContactDepartment': true,
    'contractContactTelephone': true,
    'contractContactMobile': true,
    'contractContactEmail': true,
    'contractContactFax': true

  };

  public fieldRequired: any = {
    'contractAddressLine1': true,
    'contractAddressLine2': false,
    'contractAddressLine3': false,
    'contractAddressLine4': true,
    'contractAddressLine5': false,
    'contractPostcode': true,
    'countryCode': true,
    'gpsCoordinateX': true,
    'gpsCoordinateY': true,
    'contractContactName': true,
    'btnAmendContact': false,
    'contractContactPosition': false,
    'contractContactDepartment': false,
    'contractContactTelephone': true,
    'contractContactMobile': false,
    'contractContactEmail': false,
    'contractContactFax': false
  };
  public parentQueryParams: any;
  public zipSearchComponent: any = PostCodeSearchComponent;
  public autoOpen: boolean = false;
  public modalConfig: any = {
    backdrop: 'static',
    keyboard: true
  };

  public searchModalRoute: string = '';
  public showHeader: boolean = true;
  public showCloseButton: boolean = true;
  public isCountryCodeDisabled: boolean = true;
  public isZipCodeEllipsisDisabled: boolean = true;
  public countrySelected: Object = {
    id: '',
    text: ''
  };
  public postCodeAutoOpen: boolean = false;
  public params: Object;
  public otherParams: Object;
  public sysCharParams: Object = {};
  public mode: Object;
  public storeData: any;
  public queryParamsContract: any = {
    action: '0',
    operation: 'Application/iCABSAContractMaintenance',
    module: 'contract',
    method: 'contract-management/maintenance',
    contentType: 'application/x-www-form-urlencoded',
    branchNumber: '',
    branchName: ''
  };
  public queryContract: URLSearchParams = new URLSearchParams();
  public fieldRequiredClone: Object = {};
  public fieldVisibilityClone: Object = {};
  public zipCodeHide: boolean = false;
  public countryValidate: boolean = false;
  public closePostCodeModal: boolean = false;

  constructor(
    private zone: NgZone,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<any>,
    private httpService: HttpService,
    private utils: Utils,
    private serviceConstants: ServiceConstants
  ) {
    this.maintenanceAFormGroup = this.fb.group({
      ContractAddressLine1: [{ value: '', disabled: true }, Validators.required],
      ContractAddressLine2: [{ value: '', disabled: true }],
      ContractAddressLine3: [{ value: '', disabled: true }],
      ContractAddressLine4: [{ value: '', disabled: true }, Validators.required],
      ContractAddressLine5: [{ value: '', disabled: true }],
      ContractPostcode: [{ value: '', disabled: true }, Validators.required],
      GetAddress: [{ disabled: true }],
      CountryCode: [{ value: '', disabled: true }],
      CountryDesc: [{ value: '', disabled: true }],
      GPSCoordinateX: [{ value: '', disabled: true }, Validators.required],
      GPSCoordinateY: [{ value: '', disabled: true }, Validators.required],
      ContractContactName: [{ value: '', disabled: true }, Validators.required],
      BtnAmendContact: [{ value: 'Contact Details', disabled: true }],
      ContractContactPosition: [{ value: '', disabled: true }, Validators.required],
      ContractContactDepartment: [{ value: '', disabled: true }],
      ContractContactTelephone: [{ value: '', disabled: true }, Validators.required],
      ContractContactMobile: [{ value: '', disabled: true }, Validators.required],
      ContractContactEmail: [{ value: '', disabled: true }],
      ContractContactFax: [{ value: '', disabled: true }]
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
            if (data['data'] && (Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
              this.inputParams = Object.assign({}, this.inputParams, {
                'ContractPostcode': this.maintenanceAFormGroup.controls['ContractPostcode'] ? this.maintenanceAFormGroup.controls['ContractPostcode'].value : '',
                'ContractAddressLine4': this.maintenanceAFormGroup.controls['ContractAddressLine4'] ? this.maintenanceAFormGroup.controls['ContractAddressLine4'].value : '',
                'ContractAddressLine5': this.maintenanceAFormGroup.controls['ContractAddressLine5'] ? this.maintenanceAFormGroup.controls['ContractAddressLine5'].value : ''
              });
              this.setZipCodeParams();
            }

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
            this.params = data['params'];
            this.inputParams = data['params'];
            break;
          case ContractActionTypes.SAVE_OTHER_PARAMS:
            this.otherParams = data['otherParams'];
            if (this.otherParams['postCodeAutoOpen'] === true) {
              this.postCodeAutoOpen = true;
              setTimeout(() => {
                this.postCodeAutoOpen = false;
              }, 100);
            } else {
              this.postCodeAutoOpen = false;
            }
            if (this.otherParams['vDisableFields'].indexOf('DisableAddressLine3') > -1) {
              this.fieldVisibility['contractAddressLine3'] = false;
            }
            break;
          case ContractActionTypes.SAVE_CODE:

            break;
          case ContractActionTypes.FORM_RESET:
            this.fieldRequired = JSON.parse(JSON.stringify(this.fieldRequiredClone));
            this.fieldVisibility = JSON.parse(JSON.stringify(this.fieldVisibilityClone));
            this.storeData['fieldRequired'].typeA = this.fieldRequired;
            this.storeData['fieldVisibility'].typeA = this.fieldVisibility;
            for (let i in this.maintenanceAFormGroup.controls) {
              if (this.maintenanceAFormGroup.controls.hasOwnProperty(i)) {
                this.maintenanceAFormGroup.controls[i].clearValidators();
              }
            }
            this.maintenanceAFormGroup.controls['ContractAddressLine1'].setValidators(Validators.required);
            this.maintenanceAFormGroup.controls['ContractAddressLine4'].setValidators(Validators.required);
            this.maintenanceAFormGroup.controls['ContractPostcode'].setValidators(Validators.required);
            this.maintenanceAFormGroup.controls['GPSCoordinateX'].setValidators(Validators.required);
            this.maintenanceAFormGroup.controls['GPSCoordinateY'].setValidators(Validators.required);
            this.maintenanceAFormGroup.controls['ContractContactName'].setValidators(Validators.required);
            this.maintenanceAFormGroup.controls['ContractContactPosition'].setValidators(Validators.required);
            this.maintenanceAFormGroup.controls['ContractContactTelephone'].setValidators(Validators.required);
            this.maintenanceAFormGroup.controls['ContractContactMobile'].setValidators(Validators.required);
            this.fieldRequired.contractAddressLine2 = true;
            this.fieldRequired.contractAddressLine4 = true;
            this.fieldRequired.contractPostcode = true;
            this.fieldRequired.gpsCoordinateX = true;
            this.fieldRequired.gpsCoordinateY = true;
            this.fieldRequired.contractContactName = true;
            this.fieldRequired.contractContactPosition = true;
            this.fieldRequired.contractContactTelephone = true;
            this.fieldRequired.contractContactMobile = true;
            this.maintenanceAFormGroup.reset();
            break;
          case ContractActionTypes.SAVE_FIELD:
            // statement
            break;
          case ContractActionTypes.SAVE_SENT_FROM_PARENT:

            break;
          case ContractActionTypes.SAVE_SERVICE:
            this.storeData['services'].localeTranslateService.setUpTranslation();
            this.translateSubscription = this.storeData['services'].localeTranslateService.ajaxSource$.subscribe(event => {
              if (event !== 0) {
                this.fetchTranslationContent();
              }
            });
            break;
          case ContractActionTypes.VALIDATE_FORMS:
            if (data['validate'].typeA) {
              this.validateForm();
            }
            break;

          case ContractActionTypes.PARENT_TO_CHILD_COMPONENT:
            if (data['parentToChildComponent'] && data['parentToChildComponent']['CountryCode']) {
              this.countrySelected = {
                id: '',
                text: this.utils.getCountryDesc(data['parentToChildComponent']['CountryCode'])
              };
              this.maintenanceAFormGroup.controls['CountryCode'].setValue(data['parentToChildComponent']['CountryCode']);
            }
            break;

          default:
            break;
        }
      }
    });
  }

  ngOnInit(): void {
    // statement
  }

  ngAfterViewInit(): void {
    this.querySubscription = this.route.queryParams.subscribe(params => {
      this.parentQueryParams = params;
      switch (params['parent']) {
        case 'AddContractFromAccount':
        case 'AddJobFromAccount':
        case 'AddProductFromAccount':
          this.maintenanceAFormGroup.controls['ContractAddressLine1'].setValidators(Validators.required);
          this.maintenanceAFormGroup.controls['ContractAddressLine2'].clearValidators();
          this.maintenanceAFormGroup.updateValueAndValidity();
          break;

        case 'ServiceCover':
        case 'Premise':
        case 'ServiceVisitWorkIndex':

          break;

        case 'Portfolio General Maintenance':

          break;

        default:
          break;
      }

    });
    this.store.dispatch({
      type: ContractActionTypes.FORM_GROUP, payload: {
        typeA: this.maintenanceAFormGroup
      }
    });
    this.store.dispatch({
      type: ContractActionTypes.SAVE_REQUIRED_FIELD, payload: {
        typeA: this.fieldRequired
      }
    });
    this.store.dispatch({
      type: ContractActionTypes.SAVE_VISIBILITY_FIELD, payload: {
        typeA: this.fieldVisibility
      }
    });
    this.store.dispatch({
      type: ContractActionTypes.INITIALIZATION, payload: {
        typeA: true
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

  public zipCodeModalHidden(event: any): void {
    if (this.storeData['otherParams'] && this.storeData['otherParams'].zipCodeFromOther) {
      setTimeout(() => {
        let elem = document.querySelector('#Copy');
        if (elem) {
          elem['focus']();
        }
      }, 0);
    }
    this.storeData['otherParams'].zipCodeFromOther = false;
  }

  public fetchTranslationContent(): void {
    // translated content
    this.getTranslatedValue('Get Address', null).subscribe((res: string) => {
      this.zone.run(() => {
        if (res) {
          this.maintenanceAFormGroup.controls['GetAddress'].setValue(res);
        }
      });

    });

    this.getTranslatedValue('Contact Details', null).subscribe((res: string) => {
      this.zone.run(() => {
        if (res) {
          this.maintenanceAFormGroup.controls['BtnAmendContact'].setValue(res);
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

  public processSysChar(): void {
    if (!(this.sysCharParams['vSCEnableHopewiserPAF'] || this.sysCharParams['vSCEnableDatabasePAF'] || this.sysCharParams['vSCEnableMarktSelect'])) {
      this.fieldVisibility.cmdGetAddress = false;
    }
    if (!this.sysCharParams['vSCEnableGPSCoordinates']) {
      this.fieldVisibility.gpsCoordinateX = false;
      this.fieldVisibility.gpsCoordinateY = false;
    } else {
      this.fieldVisibility.gpsCoordinateX = true;
      this.fieldVisibility.gpsCoordinateY = true;
    }

    if (this.sysCharParams['vSCHidePostcode']) {
      this.fieldVisibility.contractPostcode = false;
    } else {
      this.fieldVisibility.contractPostcode = true;
    }

    if (!this.sysCharParams['vSCEnableAddressLine3']) {
      this.fieldVisibility.contractAddressLine3 = false;
    } else {
      this.fieldVisibility.contractAddressLine3 = true;
    }

    if (this.sysCharParams['vSCMultiContactInd']) {
      this.fieldVisibility.btnAmendContact = false;
    }

    this.maintenanceAFormGroup.controls['GetAddress'].disable();
    if (this.parentQueryParams) {
      switch (this.parentQueryParams['parent']) {
        case 'AddContractFromAccount':
        case 'AddJobFromAccount':
        case 'AddProductFromAccount':
          this.maintenanceAFormGroup.controls['ContractAddressLine2'].clearValidators();
          if (this.sysCharParams['vSCAddressLine3Logical'] && this.fieldVisibility.contractAddressLine3) {
            this.maintenanceAFormGroup.controls['ContractAddressLine3'].setValidators(Validators.required);
            this.fieldRequired.contractAddressLine3 = true;
          } else {
            if (this.maintenanceAFormGroup.controls['ContractAddressLine3'])
              this.maintenanceAFormGroup.controls['ContractAddressLine3'].clearValidators();
            this.fieldRequired.contractAddressLine3 = false;
          }

          if (this.sysCharParams['vSCAddressLine4Logical']) {
            this.maintenanceAFormGroup.controls['ContractAddressLine4'].setValidators(Validators.required);
            this.fieldRequired.contractAddressLine4 = true;
          } else {
            if (!this.sysCharParams['vSCEnablePostcodeSuburbLog'] && !this.sysCharParams['vSCEnableValidatePostcodeSuburb']) {
              if (this.maintenanceAFormGroup.controls['ContractAddressLine4'])
                this.maintenanceAFormGroup.controls['ContractAddressLine4'].clearValidators();
              this.fieldRequired.contractAddressLine4 = false;
            } else {
              this.maintenanceAFormGroup.controls['ContractAddressLine4'].setValidators(Validators.required);
              this.fieldRequired.contractAddressLine4 = true;
            }
          }
          if (this.sysCharParams['vSCAddressLine5Logical']) {
            this.maintenanceAFormGroup.controls['ContractAddressLine5'].setValidators(Validators.required);
            this.fieldRequired.contractAddressLine5 = true;
          } else {
            if (this.maintenanceAFormGroup.controls['ContractAddressLine5'])
              this.maintenanceAFormGroup.controls['ContractAddressLine5'].clearValidators();
            this.fieldRequired.contractAddressLine5 = false;
          }

          if (this.sysCharParams['vSCHidePostcode']) {
            this.maintenanceAFormGroup.controls['ContractPostcode'].setValidators(Validators.required);
            this.fieldRequired.contractPostcode = true;
          } else {
            if (this.maintenanceAFormGroup.controls['ContractPostcode'])
              this.maintenanceAFormGroup.controls['ContractPostcode'].clearValidators();
            this.fieldRequired.contractPostcode = false;
          }
          this.maintenanceAFormGroup.updateValueAndValidity();
          break;

        default:
          if (!this.sysCharParams['vSCCapitalFirstLtr']) {
            this.maintenanceAFormGroup.controls['ContractAddressLine1'].setValidators(Validators.required);
            if (this.maintenanceAFormGroup.controls['ContractAddressLine2'])
              this.maintenanceAFormGroup.controls['ContractAddressLine2'].clearValidators();
            this.fieldRequired.contractAddressLine1 = true;
            this.fieldRequired.contractAddressLine2 = false;
            this.fieldRequired.contractContactName = true;
            this.fieldRequired.contractContactPosition = true;
            //this.fieldRequired.contractContactDepartment = true;
            this.maintenanceAFormGroup.controls['ContractContactPosition'].setValidators(Validators.required);
            this.maintenanceAFormGroup.controls['ContractContactName'].setValidators(Validators.required);
            //this.maintenanceAFormGroup.controls['ContractContactDepartment'].setValidators(Validators.required);
            if (this.sysCharParams['vSCAddressLine3Logical'] && this.fieldVisibility.contractAddressLine3) {
              this.maintenanceAFormGroup.controls['ContractAddressLine3'].setValidators(Validators.required);
              this.fieldRequired.contractAddressLine3 = true;
            } else {
              if (this.maintenanceAFormGroup.controls['ContractAddressLine3'])
                this.maintenanceAFormGroup.controls['ContractAddressLine3'].clearValidators();
              this.fieldRequired.contractAddressLine3 = false;
            }

            if (this.sysCharParams['vSCAddressLine4Logical']) {
              this.maintenanceAFormGroup.controls['ContractAddressLine4'].setValidators(Validators.required);
              this.fieldRequired.contractAddressLine4 = true;
            } else {
              if (!this.sysCharParams['vSCEnablePostcodeSuburbLog'] && !this.sysCharParams['vSCEnableValidatePostcodeSuburb']) {
                if (this.maintenanceAFormGroup.controls['ContractAddressLine4'])
                  this.maintenanceAFormGroup.controls['ContractAddressLine4'].clearValidators();
                this.fieldRequired.contractAddressLine4 = false;
              } else {
                this.maintenanceAFormGroup.controls['ContractAddressLine4'].setValidators(Validators.required);
                this.fieldRequired.contractAddressLine4 = true;
              }
            }

            if (this.sysCharParams['vSCAddressLine5Logical']) {
              this.maintenanceAFormGroup.controls['ContractAddressLine5'].setValidators(Validators.required);
              this.fieldRequired.contractAddressLine5 = true;
            } else {
              if (this.maintenanceAFormGroup.controls['ContractAddressLine5'])
                this.maintenanceAFormGroup.controls['ContractAddressLine5'].clearValidators();
              this.fieldRequired.contractAddressLine5 = false;
            }

          } else {
            this.maintenanceAFormGroup.controls['ContractAddressLine1'].setValidators(Validators.required);
            if (this.maintenanceAFormGroup.controls['ContractAddressLine2'])
              this.maintenanceAFormGroup.controls['ContractAddressLine2'].clearValidators();
            this.fieldRequired.contractAddressLine1 = true;
            this.fieldRequired.contractAddressLine2 = false;
            this.fieldRequired.contractContactName = true;
            this.fieldRequired.contractContactPosition = true;
            this.fieldRequired.contractContactDepartment = false;
            if (this.maintenanceAFormGroup.controls['ContractContactName'])
              this.maintenanceAFormGroup.controls['ContractContactName'].setValidators(Validators.required);
            if (this.maintenanceAFormGroup.controls['ContractContactPosition'])
              this.maintenanceAFormGroup.controls['ContractContactPosition'].setValidators(Validators.required);
            if (this.maintenanceAFormGroup.controls['ContractContactDepartment'])
              this.maintenanceAFormGroup.controls['ContractContactDepartment'].clearValidators();

            if (this.sysCharParams['vSCAddressLine3Logical']) {
              this.maintenanceAFormGroup.controls['ContractAddressLine3'].setValidators(Validators.required);
              this.fieldRequired.contractAddressLine3 = true;
            } else {
              if (this.maintenanceAFormGroup.controls['ContractAddressLine3'])
                this.maintenanceAFormGroup.controls['ContractAddressLine3'].clearValidators();
              this.fieldRequired.contractAddressLine3 = false;
            }

            if (this.sysCharParams['vSCAddressLine4Logical']) {
              this.maintenanceAFormGroup.controls['ContractAddressLine4'].setValidators(Validators.required);
              this.fieldRequired.contractAddressLine4 = true;
            } else {
              if (!this.sysCharParams['vSCEnablePostcodeSuburbLog'] && !this.sysCharParams['vSCEnableValidatePostcodeSuburb']) {
                if (this.maintenanceAFormGroup.controls['ContractAddressLine4'])
                  this.maintenanceAFormGroup.controls['ContractAddressLine4'].clearValidators();
                this.fieldRequired.contractAddressLine4 = false;
              } else {
                this.maintenanceAFormGroup.controls['ContractAddressLine4'].setValidators(Validators.required);
                this.fieldRequired.contractAddressLine4 = true;
              }
            }
            if (this.sysCharParams['vSCAddressLine5Logical']) {
              this.maintenanceAFormGroup.controls['ContractAddressLine5'].setValidators(Validators.required);
              this.fieldRequired.contractAddressLine5 = true;
            } else {
              if (this.maintenanceAFormGroup.controls['ContractAddressLine5'])
                this.maintenanceAFormGroup.controls['ContractAddressLine5'].clearValidators();
              this.fieldRequired.contractAddressLine5 = false;
            }
          }

          if (this.sysCharParams['vSCHidePostcode']) {
            if (this.maintenanceAFormGroup.controls['ContractPostcode'])
              this.maintenanceAFormGroup.controls['ContractPostcode'].clearValidators();
            this.fieldRequired.contractPostcode = false;
          } else {
            this.maintenanceAFormGroup.controls['ContractPostcode'].setValidators(Validators.required);
            this.fieldRequired.contractPostcode = true;
          }
          break;
      }
    }

    this.fieldRequired.contractContactTelephone = true;
    this.fieldRequired.contractContactMobile = false;
    this.fieldRequired.contractContactEmail = false;
    this.fieldRequired.contractContactFax = false;
    this.fieldRequired.gpsCoordinateY = false;
    this.fieldRequired.gpsCoordinateX = false;
    this.maintenanceAFormGroup.controls['ContractContactTelephone'].setValidators(Validators.required);
    if (this.maintenanceAFormGroup.controls['ContractContactMobile'])
      this.maintenanceAFormGroup.controls['ContractContactMobile'].clearValidators();
    if (this.maintenanceAFormGroup.controls['ContractContactEmail'])
      this.maintenanceAFormGroup.controls['ContractContactEmail'].clearValidators();
    if (this.maintenanceAFormGroup.controls['ContractContactFax'])
      this.maintenanceAFormGroup.controls['ContractContactFax'].clearValidators();
    if (this.maintenanceAFormGroup.controls['GPSCoordinateY'])
      this.maintenanceAFormGroup.controls['GPSCoordinateY'].clearValidators();
    if (this.maintenanceAFormGroup.controls['GPSCoordinateX'])
      this.maintenanceAFormGroup.controls['GPSCoordinateX'].clearValidators();

    if (this.sysCharParams['vSCEnableHopewiserPAF']) {
      this.zipSearchComponent = ScreenNotReadyComponent;
      this.zipCodeHide = false;
    } else if (this.sysCharParams['vSCEnableMarktSelect']) {
      this.zipSearchComponent = MarktSelectSearchComponent;
      this.zipCodeHide = false;
    } else if (this.sysCharParams['vSCEnableDatabasePAF']) {
      this.zipSearchComponent = PostCodeSearchComponent;
      this.zipCodeHide = false;
    } else {
      this.zipCodeHide = true;
    }
    this.maintenanceAFormGroup.updateValueAndValidity();
  }

  public setFormData(data: any): void {
    if (!this.storeData['data']['isCopyClicked']) {
      this.maintenanceAFormGroup.controls['ContractAddressLine1'].setValue(this.checkFalsy(data['data'].ContractAddressLine1));
      this.maintenanceAFormGroup.controls['ContractAddressLine2'].setValue(this.checkFalsy(data['data'].ContractAddressLine2));
      this.maintenanceAFormGroup.controls['ContractAddressLine3'].setValue(this.checkFalsy(data['data'].ContractAddressLine3));
      this.maintenanceAFormGroup.controls['ContractAddressLine4'].setValue(this.checkFalsy(data['data'].ContractAddressLine4));
      this.maintenanceAFormGroup.controls['ContractAddressLine5'].setValue(this.checkFalsy(data['data'].ContractAddressLine5));
      this.maintenanceAFormGroup.controls['ContractPostcode'].setValue(this.checkFalsy(data['data'].ContractPostcode));
      this.maintenanceAFormGroup.controls['GPSCoordinateX'].setValue(this.checkFalsy(data['data'].GPSCoordinateX));
      this.maintenanceAFormGroup.controls['GPSCoordinateY'].setValue(this.checkFalsy(data['data'].GPSCoordinateY));
      this.maintenanceAFormGroup.controls['ContractContactName'].setValue(this.checkFalsy(data['data'].ContractContactName));
      this.maintenanceAFormGroup.controls['ContractContactPosition'].setValue(this.checkFalsy(data['data'].ContractContactPosition));
      this.maintenanceAFormGroup.controls['ContractContactDepartment'].setValue(this.checkFalsy(data['data'].ContractContactDepartment));
      this.maintenanceAFormGroup.controls['ContractContactTelephone'].setValue(this.checkFalsy(data['data'].ContractContactTelephone));
      this.maintenanceAFormGroup.controls['ContractContactMobile'].setValue(this.checkFalsy(data['data'].ContractContactMobile));
      this.maintenanceAFormGroup.controls['ContractContactEmail'].setValue(this.checkFalsy(data['data'].ContractContactEmail));
      this.maintenanceAFormGroup.controls['ContractContactFax'].setValue(this.checkFalsy(data['data'].ContractContactFax));
    }
    this.countrySelected = {
      id: '',
      text: this.utils.getCountryDesc(this.storeData['code'].country)
    };
    this.maintenanceAFormGroup.controls['CountryCode'].setValue(data['data'].CountryCode);

  }

  public checkFalsy(value: any): string {
    if (value === null || value === undefined) {
      return '';
    } else {
      return value.toString().trim();
    }
  }

  public validateForm(): void {
    if (this.fieldVisibility) {
      for (let j in this.fieldVisibility) {
        if (this.fieldVisibility.hasOwnProperty(j)) {
          let key = j['capitalizeFirstLetter']();
          if (!this.fieldVisibility[j]) {
            if (this.maintenanceAFormGroup.controls[key]) {
              this.maintenanceAFormGroup.controls[key].clearValidators();
            }
          }
        }
      }
    }

    if (this.maintenanceAFormGroup.controls) {
      for (let i in this.maintenanceAFormGroup.controls) {
        if (this.maintenanceAFormGroup.controls.hasOwnProperty(i)) {
          if (this.maintenanceAFormGroup.controls[i].enabled) {
            this.maintenanceAFormGroup.controls[i].markAsTouched();
          } else {
            this.maintenanceAFormGroup.controls[i].clearValidators();
          }
        }
      }
    }

    this.maintenanceAFormGroup.updateValueAndValidity();
    let formValid = null;
    if (!this.maintenanceAFormGroup.enabled) {
      formValid = true;
    } else {
      formValid = this.maintenanceAFormGroup.valid;
    }
    if (this.fieldRequired.countryCode) {
      if (!this.maintenanceAFormGroup.controls['CountryCode'].value) {
        this.countryValidate = true;
        formValid = false;
      }
    }
    this.store.dispatch({
      type: ContractActionTypes.FORM_GROUP, payload: {
        typeA: this.maintenanceAFormGroup
      }
    });
    this.store.dispatch({
      type: ContractActionTypes.SAVE_REQUIRED_FIELD, payload: {
        typeA: this.fieldRequired
      }
    });
    this.store.dispatch({
      type: ContractActionTypes.SAVE_VISIBILITY_FIELD, payload: {
        typeA: this.fieldVisibility
      }
    });
    this.store.dispatch({
      type: ContractActionTypes.FORM_VALIDITY, payload: {
        typeA: formValid
      }
    });
  }

  public onContractContactPositionChange(event: any): void {
    if (!this.sysCharParams['vSCCapitalFirstLtr']) {
      this.maintenanceAFormGroup.controls['ContractContactPosition'].setValue(this.maintenanceAFormGroup.controls['ContractContactPosition'].value.toString().capitalizeFirstLetter());
    }
  }

  public onContractContactDespartmentChange(event: any): void {
    if (!this.sysCharParams['vSCCapitalFirstLtr']) {
      this.maintenanceAFormGroup.controls['ContractContactDepartment'].setValue(this.maintenanceAFormGroup.controls['ContractContactDepartment'].value.toString().capitalizeFirstLetter());
    }
  }

  public onContractContactNameChange(event: any): void {
    if (!this.sysCharParams['vSCCapitalFirstLtr']) {
      this.maintenanceAFormGroup.controls['ContractContactName'].setValue(this.maintenanceAFormGroup.controls['ContractContactName'].value.toString().capitalizeFirstLetter());
    }
  }

  public onCapitalize(control: any): void {
    if (!this.sysCharParams['vSCCapitalFirstLtr']) {
      this.maintenanceAFormGroup.controls[control].setValue(this.maintenanceAFormGroup.controls[control].value.toString().capitalizeFirstLetter());
    }
  }

  public processForm(): void {
    if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
      this.maintenanceAFormGroup.controls['ContractAddressLine1'].enable();
      this.maintenanceAFormGroup.controls['ContractAddressLine2'].enable();
      this.maintenanceAFormGroup.controls['ContractAddressLine3'].enable();
      this.maintenanceAFormGroup.controls['ContractAddressLine4'].enable();
      this.maintenanceAFormGroup.controls['ContractAddressLine5'].enable();
      this.maintenanceAFormGroup.controls['ContractPostcode'].enable();
      //this.maintenanceAFormGroup.controls['CountryDesc'].enable();
      this.maintenanceAFormGroup.controls['GPSCoordinateX'].enable();
      this.maintenanceAFormGroup.controls['GPSCoordinateY'].enable();
      this.maintenanceAFormGroup.controls['ContractContactName'].enable();
      this.maintenanceAFormGroup.controls['ContractContactPosition'].enable();
      this.maintenanceAFormGroup.controls['ContractContactDepartment'].enable();
      this.maintenanceAFormGroup.controls['ContractContactTelephone'].enable();
      this.maintenanceAFormGroup.controls['ContractContactMobile'].enable();
      this.maintenanceAFormGroup.controls['ContractContactEmail'].enable();
      this.maintenanceAFormGroup.controls['ContractContactFax'].enable();
      this.isCountryCodeDisabled = false;
      this.isZipCodeEllipsisDisabled = false;
      if (this.sysCharParams['vSCMultiContactInd']) {
        this.fieldVisibility.btnAmendContact = true;
        this.maintenanceAFormGroup.controls['BtnAmendContact'].enable();
        this.sensitiseContactDetails(false);
      }
      if (!this.sysCharParams['vSCEnableMarktSelect']) {
        this.maintenanceAFormGroup.controls['ContractAddressLine1'].disable();
        this.maintenanceAFormGroup.controls['ContractAddressLine2'].disable();
        this.maintenanceAFormGroup.controls['ContractAddressLine3'].disable();
        this.maintenanceAFormGroup.controls['ContractAddressLine4'].disable();
        this.maintenanceAFormGroup.controls['ContractAddressLine5'].disable();
        this.maintenanceAFormGroup.controls['ContractPostcode'].disable();
        this.isZipCodeEllipsisDisabled = true;
        this.maintenanceAFormGroup.controls['GPSCoordinateX'].disable();
        this.maintenanceAFormGroup.controls['GPSCoordinateY'].disable();
        if (this.countrySelected['text']) {
          this.isCountryCodeDisabled = true;
        }
      }
      if (this.sysCharParams['vSCEnableMarktSelect']) {
        this.maintenanceAFormGroup.controls['GetAddress'].enable();
      } else {
        this.maintenanceAFormGroup.controls['GetAddress'].disable();
      }

      this.fetchContractData('GetContactPersonChanges', { action: '6', ContractNumber: this.storeData['data'].ContractNumber }).subscribe(
        (e) => {
          if (e.status === GlobalConstant.Configuration.Failure) {
            // error statement
          } else {
            if (e && e.ContactPersonFound === 'Y') {
              this.maintenanceAFormGroup.controls['ContractContactName'].setValue(e.ContactPersonName);
              this.maintenanceAFormGroup.controls['ContractContactPosition'].setValue(e.ContactPersonPosition);
              this.maintenanceAFormGroup.controls['ContractContactDepartment'].setValue(e.ContactPersonDepartment);
              this.maintenanceAFormGroup.controls['ContractContactTelephone'].setValue(e.ContactPersonTelephone);
              this.maintenanceAFormGroup.controls['ContractContactMobile'].setValue(e.ContactPersonMobile);
              this.maintenanceAFormGroup.controls['ContractContactEmail'].setValue(e.ContactPersonEmail);
              this.maintenanceAFormGroup.controls['ContractContactFax'].setValue(e.ContactPersonFax);
            }
          }
        },
        (error) => {
          //this.errorService.emitError(error);
        }
      );
    }

    if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
      this.maintenanceAFormGroup.controls['ContractAddressLine1'].disable();
      this.maintenanceAFormGroup.controls['ContractAddressLine2'].disable();
      this.maintenanceAFormGroup.controls['ContractAddressLine3'].disable();
      this.maintenanceAFormGroup.controls['ContractAddressLine4'].disable();
      this.maintenanceAFormGroup.controls['ContractAddressLine5'].disable();
      this.maintenanceAFormGroup.controls['ContractPostcode'].disable();
      //this.maintenanceAFormGroup.controls['CountryDesc'].disable();
      this.maintenanceAFormGroup.controls['GPSCoordinateX'].disable();
      this.maintenanceAFormGroup.controls['GPSCoordinateY'].disable();
      this.maintenanceAFormGroup.controls['ContractContactName'].disable();
      this.maintenanceAFormGroup.controls['ContractContactPosition'].disable();
      this.maintenanceAFormGroup.controls['ContractContactDepartment'].disable();
      this.maintenanceAFormGroup.controls['ContractContactTelephone'].disable();
      this.maintenanceAFormGroup.controls['ContractContactMobile'].disable();
      this.maintenanceAFormGroup.controls['ContractContactEmail'].disable();
      this.maintenanceAFormGroup.controls['ContractContactFax'].disable();
      this.isCountryCodeDisabled = true;
      this.isZipCodeEllipsisDisabled = true;
      if (this.storeData['data'] && (Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object)) {
        this.maintenanceAFormGroup.controls['BtnAmendContact'].disable();
        this.fieldVisibility.btnAmendContact = false;
      } else {
        if (this.sysCharParams['vSCMultiContactInd']) {
          this.fieldVisibility.btnAmendContact = true;
          this.maintenanceAFormGroup.controls['BtnAmendContact'].enable();
        }
      }
      this.maintenanceAFormGroup.controls['GetAddress'].disable();
      //this.maintenanceAFormGroup.controls['BtnAmendContact'].disable();

      if (this.storeData['data'] && (Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object)) {
        this.countrySelected = {
          id: '',
          text: ''
        };
      }
      this.fetchTranslationContent();

    }

    if (this.mode['addMode'] && !this.mode['searchMode'] && !this.mode['updateMode']) {
      this.maintenanceAFormGroup.controls['ContractAddressLine1'].enable();
      this.maintenanceAFormGroup.controls['ContractAddressLine2'].enable();
      this.maintenanceAFormGroup.controls['ContractAddressLine3'].enable();
      this.maintenanceAFormGroup.controls['ContractAddressLine4'].enable();
      this.maintenanceAFormGroup.controls['ContractAddressLine5'].enable();
      this.maintenanceAFormGroup.controls['ContractPostcode'].enable();
      //this.maintenanceAFormGroup.controls['CountryDesc'].enable();
      this.maintenanceAFormGroup.controls['GPSCoordinateX'].enable();
      this.maintenanceAFormGroup.controls['GPSCoordinateY'].enable();
      this.maintenanceAFormGroup.controls['ContractContactName'].enable();
      this.maintenanceAFormGroup.controls['ContractContactPosition'].enable();
      this.maintenanceAFormGroup.controls['ContractContactDepartment'].enable();
      this.maintenanceAFormGroup.controls['ContractContactTelephone'].enable();
      this.maintenanceAFormGroup.controls['ContractContactMobile'].enable();
      this.maintenanceAFormGroup.controls['ContractContactEmail'].enable();
      this.maintenanceAFormGroup.controls['ContractContactFax'].enable();

      this.maintenanceAFormGroup.controls['ContractAddressLine1'].setValue('');
      this.maintenanceAFormGroup.controls['ContractAddressLine2'].setValue('');
      this.maintenanceAFormGroup.controls['ContractAddressLine3'].setValue('');
      this.maintenanceAFormGroup.controls['ContractAddressLine4'].setValue('');
      this.maintenanceAFormGroup.controls['ContractAddressLine5'].setValue('');
      this.maintenanceAFormGroup.controls['ContractPostcode'].setValue('');
      //this.maintenanceAFormGroup.controls['CountryDesc'].setValue('');
      this.maintenanceAFormGroup.controls['GPSCoordinateX'].setValue('');
      this.maintenanceAFormGroup.controls['GPSCoordinateY'].setValue('');
      this.maintenanceAFormGroup.controls['ContractContactName'].setValue('');
      this.maintenanceAFormGroup.controls['ContractContactPosition'].setValue('');
      this.maintenanceAFormGroup.controls['ContractContactDepartment'].setValue('');
      this.maintenanceAFormGroup.controls['ContractContactTelephone'].setValue('');
      this.maintenanceAFormGroup.controls['ContractContactMobile'].setValue('');
      this.maintenanceAFormGroup.controls['ContractContactEmail'].setValue('');
      this.maintenanceAFormGroup.controls['ContractContactFax'].setValue('');
      this.maintenanceAFormGroup.controls['GetAddress'].enable();
      if (this.sysCharParams['vSCMultiContactInd']) {
        this.fieldVisibility.btnAmendContact = false;
        this.maintenanceAFormGroup.controls['BtnAmendContact'].disable();
        this.sensitiseContactDetails(true);
      }
      if (!this.sysCharParams['vSCDisableDefaultCountryCode']) {
        this.countrySelected = {
          id: '',
          text: this.utils.getCountryDesc(this.storeData['code'].country)
        };
        this.maintenanceAFormGroup.controls['CountryCode'].setValue(this.storeData['code'].country);
      }
      this.isCountryCodeDisabled = false;
      this.isZipCodeEllipsisDisabled = false;
      if (this.storeData['sentFromParent']) {
        switch (this.storeData['sentFromParent'].parentMode) {
          case 'AddContractFromAccount':
          case 'AddJobFromAccount':
          case 'AddProductFromAccount':
            this.maintenanceAFormGroup.controls['GetAddress'].disable();
            break;

          default:
            this.maintenanceAFormGroup.controls['GetAddress'].enable();
        }
      }
      this.store.dispatch({
        type: ContractActionTypes.FORM_GROUP, payload: {
          typeA: this.maintenanceAFormGroup
        }
      });
    }

    if (this.mode['addMode'] || this.mode['updateMode']) {
      this.inputParams = Object.assign({}, this.inputParams, {
        'countryCode': this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode(),
        'businessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode(),
        'parentMode': 'Contract',
        'ContractPostcode': this.maintenanceAFormGroup.controls['ContractPostcode'] ? this.maintenanceAFormGroup.controls['ContractPostcode'].value : '',
        'ContractAddressLine4': this.maintenanceAFormGroup.controls['ContractAddressLine4'] ? this.maintenanceAFormGroup.controls['ContractAddressLine4'].value : '',
        'ContractAddressLine5': this.maintenanceAFormGroup.controls['ContractAddressLine5'] ? this.maintenanceAFormGroup.controls['ContractAddressLine5'].value : ''
      });
      this.inputParamsZipCode = Object.assign({}, this.inputParams, {
        'countryCode': this.maintenanceAFormGroup.controls['CountryCode'].value ? this.maintenanceAFormGroup.controls['CountryCode'].value : this.utils.getCountryCode(),
        'businessCode': this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode(),
        'parentMode': 'Contract',
        'ContractPostcode': this.maintenanceAFormGroup.controls['ContractPostcode'] ? this.maintenanceAFormGroup.controls['ContractPostcode'].value : '',
        'ContractAddressLine4': this.maintenanceAFormGroup.controls['ContractAddressLine4'] ? this.maintenanceAFormGroup.controls['ContractAddressLine4'].value : '',
        'ContractAddressLine5': this.maintenanceAFormGroup.controls['ContractAddressLine5'] ? this.maintenanceAFormGroup.controls['ContractAddressLine5'].value : ''
      });
    }
    this.fetchTranslationContent();
  }

  public onBtnAmendClick(event: any): void {
    this.router.navigate([InternalMaintenanceServiceModuleRoutes.ICABSCMCONTACTPERSONMAINTENANCE], { queryParams: { parentMode: 'Contract', contractNumber: this.storeData['data'].ContractNumber } });
  }

  public onGetAddressClick(event: any): void {
    this.setZipCodeParams();
    if (this.sysCharParams['vSCEnableHopewiserPAF']) {
      this.zipSearchComponent = ScreenNotReadyComponent;
      this.zipCodeHide = false;
    } else if (this.sysCharParams['vSCEnableMarktSelect']) {
      this.zipSearchComponent = MarktSelectSearchComponent;
      this.zipCodeHide = false;
    } else if (this.sysCharParams['vSCEnableDatabasePAF']) {
      this.zipSearchComponent = PostCodeSearchComponent;
      this.zipCodeHide = false;
    }
    setTimeout(() => {
      this.postCodeAutoOpen = true;
      setTimeout(() => {
        this.postCodeAutoOpen = false;
      }, 100);
    }, 0);
  }

  public onContractAddressLine4Blur(event: any): void {
    if (this.sysCharParams['vSCAddressLine4Required'] && this.maintenanceAFormGroup.controls['ContractAddressLine4'].value.trim() === '' && this.sysCharParams['vSCEnableValidatePostcodeSuburb']) {
      this.onGetAddressClick({});
    }
  }

  public onContractAddressLine5Blur(event: any): void {
    if (this.sysCharParams['vSCAddressLine5Required'] && this.maintenanceAFormGroup.controls['ContractAddressLine5'].value.trim() === '' && this.sysCharParams['vSCEnableValidatePostcodeSuburb']) {
      this.onGetAddressClick({});
    }
  }

  public onContractPostcodeChange(event: any): void {
    if (this.maintenanceAFormGroup.controls['ContractPostcode'].value !== '' && this.sysCharParams['vEnablePostcodeDefaulting'] && this.sysCharParams['vSCEnableDatabasePAF']) {
      this.fetchContractData('GetPostCodeTownAndState', {
        action: '0',
        Postcode: this.maintenanceAFormGroup.controls['ContractPostcode'] ? this.maintenanceAFormGroup.controls['ContractPostcode'].value : '',
        State: this.maintenanceAFormGroup.controls['ContractAddressLine5'] ? this.maintenanceAFormGroup.controls['ContractAddressLine5'].value : '',
        Town: this.maintenanceAFormGroup.controls['ContractAddressLine4'] ? this.maintenanceAFormGroup.controls['ContractAddressLine4'].value : ''
      }).subscribe(
        (e) => {
          if (e.status === GlobalConstant.Configuration.Failure) {
            // error statement
          } else {
            if (e && (!e.UniqueRecordFound || e.UniqueRecordFound.toString().toUpperCase() === GlobalConstant.Configuration.No)) {
              this.zipSearchComponent = PostCodeSearchComponent;
              setTimeout(() => {
                this.postCodeAutoOpen = true;
                setTimeout(() => {
                  this.postCodeAutoOpen = false;
                }, 100);
              }, 0);
            } else {
              if (this.maintenanceAFormGroup.controls['ContractPostcode']) {
                this.maintenanceAFormGroup.controls['ContractPostcode'].setValue(e.Postcode);
              }
              if (this.maintenanceAFormGroup.controls['ContractAddressLine5']) {
                this.maintenanceAFormGroup.controls['ContractAddressLine5'].setValue(e.State);
              }
              if (this.maintenanceAFormGroup.controls['ContractAddressLine4']) {
                this.maintenanceAFormGroup.controls['ContractAddressLine4'].setValue(e.Town);
              }
            }
          }
        },
        (error) => {
          //this.errorService.emitError(error);
        }
        );
    }
  }

  public setZipCodeParams(): void {
    this.inputParamsZipCode = Object.assign({}, this.inputParams, {
      'countryCode': this.maintenanceAFormGroup.controls['CountryCode'].value ? this.maintenanceAFormGroup.controls['CountryCode'].value : this.utils.getCountryCode(),
      'ContractName': this.storeData['formGroup'].main.controls['ContractName'] ? this.storeData['formGroup'].main.controls['ContractName'].value : '',
      'CompanyRegistrationNumber': this.storeData['formGroup'].typeC.controls['CompanyRegistrationNumber'] ? this.storeData['formGroup'].typeC.controls['CompanyRegistrationNumber'].value : '',
      'ExternalReference': this.storeData['formGroup'].typeC.controls['ExternalReference'] ? this.storeData['formGroup'].typeC.controls['ExternalReference'].value : '',
      'ContractReference': this.storeData['formGroup'].typeC.controls['ContractReference'] ? this.storeData['formGroup'].typeC.controls['ContractReference'].value : '',
      'ContractPostcode': this.maintenanceAFormGroup.controls['ContractPostcode'] ? this.maintenanceAFormGroup.controls['ContractPostcode'].value : '',
      'ContractContactFax': this.maintenanceAFormGroup.controls['ContractContactFax'] ? this.maintenanceAFormGroup.controls['ContractContactFax'].value : '',
      'ContractContactTelephone': this.maintenanceAFormGroup.controls['ContractContactTelephone'] ? this.maintenanceAFormGroup.controls['ContractContactTelephone'].value : '',
      'ContractAddressLine1': this.maintenanceAFormGroup.controls['ContractAddressLine1'] ? this.maintenanceAFormGroup.controls['ContractAddressLine1'].value : '',
      'ContractAddressLine2': this.maintenanceAFormGroup.controls['ContractAddressLine2'] ? this.maintenanceAFormGroup.controls['ContractAddressLine2'].value : '',
      'ContractAddressLine4': this.maintenanceAFormGroup.controls['ContractAddressLine4'] ? this.maintenanceAFormGroup.controls['ContractAddressLine4'].value : '',
      'ContractAddressLine5': this.maintenanceAFormGroup.controls['ContractAddressLine5'] ? this.maintenanceAFormGroup.controls['ContractAddressLine5'].value : ''
    });
  }

  public onContractPostcodeBlur(event: any): void {
    //this.setZipCodeParams();
    let upperCaseVal = this.maintenanceAFormGroup.controls['ContractPostcode'].value.toUpperCase();
    this.maintenanceAFormGroup.controls['ContractPostcode'].setValue(upperCaseVal);
    if (this.sysCharParams['vSCPostCodeRequired'] && this.maintenanceAFormGroup.controls['ContractPostcode'].value.trim() === '') {
      this.onGetAddressClick({});
    }
    if (this.sysCharParams['vSCConnectContrPostcodeNegEmp'] && this.storeData['formGroup'].typeC.controls['SalesEmployee'] && this.storeData['formGroup'].typeC.controls['SalesEmployee'].value === '' && this.mode['addMode']) {
      this.fetchContractData('DefaultFromPostcode', {
        action: '6',
        BranchNumber: this.storeData['formGroup'].main.controls['NegBranchNumber'] ? this.storeData['formGroup'].main.controls['NegBranchNumber'].value : this.otherParams['currentBranchNumber'],
        ContractPostcode: this.maintenanceAFormGroup.controls['ContractPostcode'] ? this.maintenanceAFormGroup.controls['ContractPostcode'].value : '',
        ContractAddressLine5: this.maintenanceAFormGroup.controls['ContractAddressLine5'] ? this.maintenanceAFormGroup.controls['ContractAddressLine5'].value : '',
        ContractAddressLine4: this.maintenanceAFormGroup.controls['ContractAddressLine4'] ? this.maintenanceAFormGroup.controls['ContractAddressLine4'].value : ''

      }).subscribe(
        (e) => {
          if (e.status === GlobalConstant.Configuration.Failure) {
            // error statement
          } else {
            if (e) {
              if (this.storeData['formGroup'].typeC.controls['SalesEmployee']) {
                this.storeData['formGroup'].typeC.controls['SalesEmployee'].setValue(e.ContractSalesEmployee);
              }
              if (this.storeData['formGroup'].typeC.controls['SalesEmployeeSurname']) {
                this.storeData['formGroup'].typeC.controls['SalesEmployeeSurname'].setValue(e.SalesEmployeeSurname);
              }
            }
          }
        },
        (error) => {
          //this.errorService.emitError(error);
        }
        );
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
      if (key && params.hasOwnProperty(key)) {
        this.queryContract.set(key, params[key]);
      }
    }
    return this.httpService.makeGetRequest(this.queryParamsContract.method, this.queryParamsContract.module, this.queryParamsContract.operation, this.queryContract);

  }

  public sensitiseContactDetails(sensitise: boolean): void {
    if (sensitise) {
      this.maintenanceAFormGroup.controls['ContractContactName'].enable();
      this.maintenanceAFormGroup.controls['ContractContactPosition'].enable();
      this.maintenanceAFormGroup.controls['ContractContactDepartment'].enable();
      this.maintenanceAFormGroup.controls['ContractContactTelephone'].enable();
      this.maintenanceAFormGroup.controls['ContractContactMobile'].enable();
      this.maintenanceAFormGroup.controls['ContractContactEmail'].enable();
      this.maintenanceAFormGroup.controls['ContractContactFax'].enable();
      this.fieldRequired.contractContactName = true;
      this.fieldRequired.contractContactPosition = true;
      this.fieldRequired.contractContactTelephone = true;
      this.maintenanceAFormGroup.controls['ContractContactName'].setValidators(Validators.required);
      this.maintenanceAFormGroup.controls['ContractContactPosition'].setValidators(Validators.required);
      this.maintenanceAFormGroup.controls['ContractContactTelephone'].setValidators(Validators.required);
    } else {
      this.maintenanceAFormGroup.controls['ContractContactName'].disable();
      this.maintenanceAFormGroup.controls['ContractContactPosition'].disable();
      this.maintenanceAFormGroup.controls['ContractContactDepartment'].disable();
      this.maintenanceAFormGroup.controls['ContractContactTelephone'].disable();
      this.maintenanceAFormGroup.controls['ContractContactMobile'].disable();
      this.maintenanceAFormGroup.controls['ContractContactEmail'].disable();
      this.maintenanceAFormGroup.controls['ContractContactFax'].disable();
      this.fieldRequired.contractContactName = false;
      this.fieldRequired.contractContactPosition = false;
      this.fieldRequired.contractContactTelephone = false;
      this.maintenanceAFormGroup.controls['ContractContactName'].clearValidators();
      this.maintenanceAFormGroup.controls['ContractContactPosition'].clearValidators();
      this.maintenanceAFormGroup.controls['ContractContactTelephone'].clearValidators();
    }
  }

  public onZipDataReceived(data: any): void {
    if (this.sysCharParams['vSCEnableHopewiserPAF']) {
      // Todo in future sprint
    } else if (this.sysCharParams['vSCEnableMarktSelect']) {
      if (!(data['ContractName'] === undefined))
        this.storeData['formGroup'].main.controls['ContractName'].setValue(data['ContractName']);
      if (!(data['CompanyRegistrationNumber'] === undefined))
        this.storeData['formGroup'].typeC.controls['CompanyRegistrationNumber'].setValue(data['CompanyRegistrationNumber']);
      if (!(data['ExternalReference'] === undefined))
        this.storeData['formGroup'].typeC.controls['ExternalReference'].setValue(data['ExternalReference']);
      if (!(data['ContractReference'] === undefined))
        this.storeData['formGroup'].typeC.controls['ContractReference'].setValue(data['ContractReference']);
      if (!(data['ContractPostcode'] === undefined))
        this.maintenanceAFormGroup.controls['ContractPostcode'].setValue(data['ContractPostcode']);
      if (!(data['ContractContactFax'] === undefined))
        this.maintenanceAFormGroup.controls['ContractContactFax'].setValue(data['ContractContactFax']);
      if (!(data['ContractContactTelephone'] === undefined))
        this.maintenanceAFormGroup.controls['ContractContactTelephone'].setValue(data['ContractContactTelephone']);
      if (!(data['ContractAddressLine1'] === undefined))
        this.maintenanceAFormGroup.controls['ContractAddressLine1'].setValue(data['ContractAddressLine1']);
      if (!(data['ContractAddressLine2'] === undefined))
        this.maintenanceAFormGroup.controls['ContractAddressLine2'].setValue(data['ContractAddressLine2']);
      if (!(data['ContractAddressLine4'] === undefined))
        this.maintenanceAFormGroup.controls['ContractAddressLine4'].setValue(data['ContractAddressLine4']);
      if (data['CountryCode']) {
        this.countrySelected = {
          id: '',
          text: data['CountryCode'] + ' - ' + this.utils.getCountryDescFromSearchAPI(data['CountryCode'])
        };
        this.maintenanceAFormGroup.controls['CountryCode'].setValue(data['CountryCode']);
      }
    } else if (this.sysCharParams['vSCEnableDatabasePAF']) {
      this.maintenanceAFormGroup.controls['ContractPostcode'].setValue(data['ContractPostcode']);
    }
  }

  public onCountryCodeReceived(data: any): void {
    this.maintenanceAFormGroup.controls['CountryCode'].setValue(data.riCountryCode);
    this.maintenanceAFormGroup.controls['CountryCode'].markAsDirty();
    this.countryValidate = false;
  }

}
