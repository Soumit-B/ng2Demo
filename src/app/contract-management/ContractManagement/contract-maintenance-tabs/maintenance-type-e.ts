import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { HttpService } from '../../../../shared/services/http-service';
import { ContractActionTypes } from '../../../../app/actions/contract';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { Utils } from '../../../../shared/services/utility';


@Component({
    selector: 'icabs-maintenance-type-e',
    templateUrl: 'maintenance-type-e.html',
    styles: [`
    .radio-cont span {
        vertical-align: text-bottom;
    }
    [type="radio"]:not(:checked), [type="radio"]:checked {
        opacity: 1;
        position: static;
    }
    `]
})

export class MaintenanceTypeEComponent implements OnInit, OnDestroy {
    public inputParams: any = { 'parentMode': 'Contract-Search', 'ContractTypeCode': '', 'countryCode': '', 'businessCode': '' };
    public storeSubscription: Subscription;
    public querySubscription: Subscription;
    public translateSubscription: Subscription;
    public maintenanceEFormGroup: FormGroup;
    public promptPaymentInd: boolean = false;
    public retrospectiveInd: boolean = true;
    public radioList: Object = {
        radioRow1: [
        { value: 'YES', display: 'Yes', enable: false },
        { value: 'NO', display: 'No', enable: false },
        { value: 'MIXED', display: 'Mixed', enable: false }
        ],
        radioRow2: [
        { value: 'YES', display: 'Yes', enable: false },
        { value: 'NO', display: 'No', enable: false },
        { value: 'MIXED', display: 'Mixed', enable: false }
        ],
        radioRow3: [
        { value: 'YES', display: 'Yes', enable: false },
        { value: 'NO', display: 'No', enable: false },
        { value: 'MIXED', display: 'Mixed', enable: false }
        ],
        radioRow4: [
        { value: 'YES', display: 'Yes', enable: false },
        { value: 'NO', display: 'No', enable: false },
        { value: 'MIXED', display: 'Mixed', enable: false }
        ]
    };
    public radioModel: Object = {
        radioRow1: '',
        radioRow2: '',
        radioRow3: '',
        radioRow4: ''
    };
    public radioVisibility: Object = {
        visibleRow1: true,
        visibleRow2: true,
        visibleRow3: true,
        visibleRow4: true
    };
    public radioEnable: Object = {
        radioRow1: false,
        radioRow2: false,
        radioRow3: false,
        radioRow4: false
    };
    public translatedRadioDisplayValues: Object = {
        yes: 'YES',
        no: 'NO',
        mixed: 'MIXED'
    };
    public mode: Object;
    public params: Object;
    public otherParams: Object;
    public sysCharParams: Object;
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
    public queryContract: URLSearchParams = new URLSearchParams();
    public storeData: any;
    constructor(
        private zone: NgZone,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private store: Store<any>,
        private httpService: HttpService,
        private utils: Utils,
        private serviceConstants: ServiceConstants
        ) {
        this.maintenanceEFormGroup = this.fb.group({
            CICResponseSLA: [{ value: '', disabled: true }],
            CIFirstSLAEscDays: [{ value: '', disabled: true }],
            CISubSLAEscDays: [{ value: '', disabled: true }]
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
                    }
                    break;
                    case ContractActionTypes.SAVE_PARAMS:
                    this.params = data['params'];
                    this.inputParams = data['params'];
                    break;
                    case ContractActionTypes.SAVE_OTHER_PARAMS:
                    this.otherParams = data['otherParams'];
                    break;
                    case ContractActionTypes.SAVE_CODE:

                    break;
                    case ContractActionTypes.SAVE_FIELD:

                    break;
                    case ContractActionTypes.SAVE_SENT_FROM_PARENT:

                    break;
                    case ContractActionTypes.BEFORE_SAVE:

                    break;
                    case ContractActionTypes.SAVE_SERVICE:
                    this.translateSubscription = this.storeData['services'].localeTranslateService.ajaxSource$.subscribe(event => {
                        if (event !== 0) {
                            this.fetchTranslationContent();
                        }
                    });
                    break;
                    case ContractActionTypes.AFTER_SAVE:
                    this.disableCIRSFields(true);
                    break;
                    case ContractActionTypes.AFTER_FETCH:
                    this.afterFetch();
                    break;
                    case ContractActionTypes.VALIDATE_FORMS:
                    if (data['validate'].typeE) {
                        this.validateForm();
                    }
                    break;
                    case ContractActionTypes.FORM_RESET:
                    for (let i in this.maintenanceEFormGroup.controls) {
                        if (this.maintenanceEFormGroup.controls.hasOwnProperty(i)) {
                          this.maintenanceEFormGroup.controls[i].clearValidators();
                        }
                    }
                    this.maintenanceEFormGroup.reset();
                    break;

                    default:
                    break;
                }
            }
        });
    }

    ngOnInit(): void {
        this.store.dispatch({
          type: ContractActionTypes.FORM_GROUP, payload: {
            typeE: this.maintenanceEFormGroup
          }
        });
        this.querySubscription = this.route.queryParams.subscribe(params => {
            this.parentQueryParams = params;
            switch (params['parent']) {
                case 'AddContractFromAccount':
                case 'AddJobFromAccount':
                case 'AddProductFromAccount':
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
        if (this.storeData && this.storeData['data'] && !(Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object)) {
            this.setFormData(this.storeData);
        }
    }

    ngOnDestroy(): void {
        this.storeSubscription.unsubscribe();
        if (this.querySubscription)
            this.querySubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    }

    public fetchTranslationContent(): void {
        this.getTranslatedValue('No', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.translatedRadioDisplayValues['no'] = res;
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
        // process syschar object
    }
    public setFormData(data: any): void {
        this.maintenanceEFormGroup.controls['CICResponseSLA'].setValue(this.storeData['data'].CICResponseSLA);
        this.maintenanceEFormGroup.controls['CIFirstSLAEscDays'].setValue(this.storeData['data'].CIFirstSLAEscDays);
        this.maintenanceEFormGroup.controls['CISubSLAEscDays'].setValue(this.storeData['data'].CISubSLAEscDays);
        this.radioModel['radioRow1'] = this.storeData['data'].CICustRefReq ? this.storeData['data'].CICustRefReq.toUpperCase() : '';
        this.radioModel['radioRow2'] = this.storeData['data'].CIRWOReq ? this.storeData['data'].CIRWOReq.toUpperCase() : '';
        this.radioModel['radioRow3'] = this.storeData['data'].CICFWOReq ? this.storeData['data'].CICFWOReq.toUpperCase() : '';
        this.radioModel['radioRow4'] = this.storeData['data'].CICFWOSep ? this.storeData['data'].CICFWOSep.toUpperCase() : '';
    }

    public processForm(): void {
        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            this.maintenanceEFormGroup.controls['CICResponseSLA'].enable();
            this.maintenanceEFormGroup.controls['CIFirstSLAEscDays'].enable();
            this.maintenanceEFormGroup.controls['CISubSLAEscDays'].enable();
            if (this.otherParams['blnCIEnabled']) {
                this.disableCIRSFields(false);
            }
        }
        if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
            this.maintenanceEFormGroup.controls['CICResponseSLA'].disable();
            this.maintenanceEFormGroup.controls['CIFirstSLAEscDays'].disable();
            this.maintenanceEFormGroup.controls['CISubSLAEscDays'].disable();
            this.disableCIRSFields(true);
        }
        if (this.mode['addMode'] && !this.mode['updateMode'] && !this.mode['searchMode']) {
            this.maintenanceEFormGroup.controls['CICResponseSLA'].enable();
            this.maintenanceEFormGroup.controls['CIFirstSLAEscDays'].enable();
            this.maintenanceEFormGroup.controls['CISubSLAEscDays'].enable();
            if (this.otherParams && this.otherParams['blnCIEnabled'] === true) {
                this.radioModel['radioRow1'] = this.translatedRadioDisplayValues['no'];
                this.radioModel['radioRow2'] = this.translatedRadioDisplayValues['no'];
                this.radioModel['radioRow3'] = this.translatedRadioDisplayValues['no'];;
                this.radioModel['radioRow4'] = this.translatedRadioDisplayValues['no'];
                this.maintenanceEFormGroup.controls['CICResponseSLA'].disable();
                this.maintenanceEFormGroup.controls['CIFirstSLAEscDays'].disable();
                this.maintenanceEFormGroup.controls['CISubSLAEscDays'].disable();
            }
            this.store.dispatch({
                type: ContractActionTypes.FORM_GROUP, payload: {
                    typeE: this.maintenanceEFormGroup
                }
            });
        }
        if (this.mode['addMode'] || this.mode['updateMode']) {
            this.inputParams = Object.assign({}, this.inputParams, {
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business
            });
        }
    }

    public disableCIRSFields(val: boolean): void {
        this.radioList['radioRow1'][0].enable = !val;
        this.radioList['radioRow1'][1].enable = !val;
        this.radioList['radioRow2'][0].enable = !val;
        this.radioList['radioRow2'][1].enable = !val;
        this.radioList['radioRow3'][0].enable = !val;
        this.radioList['radioRow3'][1].enable = !val;
        this.radioList['radioRow4'][0].enable = !val;
        this.radioList['radioRow4'][1].enable = !val;
    }

    public afterFetch(): void {
        if (this.storeData['otherParams'].blnCIEnabled) {
            if (this.storeData['data']) {
                this.maintenanceEFormGroup.controls['CICResponseSLA'].setValue(this.storeData['data'].CICResponseSLA);
                this.maintenanceEFormGroup.controls['CIFirstSLAEscDays'].setValue(this.storeData['data'].CIFirstSLAEscDays);
                this.maintenanceEFormGroup.controls['CISubSLAEscDays'].setValue(this.storeData['data'].CISubSLAEscDays);
                this.radioModel['radioRow1'] = this.storeData['data'].CICustRefReq ? this.storeData['data'].CICustRefReq.toUpperCase() : '';
                this.radioModel['radioRow2'] = this.storeData['data'].CIRWOReq ? this.storeData['data'].CIRWOReq.toUpperCase() : '';
                this.radioModel['radioRow3'] = this.storeData['data'].CICFWOReq ? this.storeData['data'].CICFWOReq.toUpperCase() : '';
                this.radioModel['radioRow4'] = this.storeData['data'].CICFWOSep ? this.storeData['data'].CICFWOSep.toUpperCase() : '';
            }
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

    public validateForm(): void {
        for (let i in this.maintenanceEFormGroup.controls) {
            if (this.maintenanceEFormGroup.controls.hasOwnProperty(i)) {
                this.maintenanceEFormGroup.controls[i].markAsTouched();
            }
        }
        this.maintenanceEFormGroup.updateValueAndValidity();
        let formValid = null;
        if (!this.maintenanceEFormGroup.enabled) {
            formValid = true;
        } else {
            formValid = this.maintenanceEFormGroup.valid;
        }
        this.store.dispatch({
            type: ContractActionTypes.FORM_GROUP, payload: {
                typeE: this.maintenanceEFormGroup
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.FORM_VALIDITY, payload: {
                typeE: formValid
            }
        });
    }

    public checkNumeric(event: any): void {
        if (isNaN(event.target.value)) {
            event.target.value = '';
        }
    }
}
