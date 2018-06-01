import { Component, NgZone, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ContractActionTypes } from '../../../../app/actions/contract';
import { HttpService } from '../../../../shared/services/http-service';
import { ErrorService } from '../../../../shared/services/error.service';
import { MessageService } from '../../../../shared/services/message.service';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { Utils } from '../../../../shared/services/utility';

@Component({
    selector: 'icabs-maintenance-type-d',
    templateUrl: 'maintenance-type-d.html',
    providers: [ErrorService]
})

export class MaintenanceTypeDComponent implements OnInit, OnDestroy {
    @ViewChild('messageTypeDModal') public messageModal;
    public storeSubscription: Subscription;
    public translateSubscription: Subscription;
    public maintenanceDFormGroup: FormGroup;
    public promptPaymentInd: boolean = false;
    public retrospectiveInd: boolean = false;
    public errorSubscription: Subscription;
    public messageSubscription: Subscription;
    public querySubscription: Subscription;
    public query: URLSearchParams = new URLSearchParams();
    public queryParams: any = {
        action: '6',
        operation: 'Application/iCABSAAccountMaintenance',
        module: 'account',
        method: 'contract-management/maintenance',
        contentType: 'application/x-www-form-urlencoded',
        function: 'GetDefaultDiscountDetails',
        discountTypeCode: ''
    };
    public mode: Object;
    public params: Object;
    public otherParams: Object;
    public sysCharParams: Object;
    public storeData: any;
    public showMessageHeader: boolean = true;
    public parentQueryParams: any;
    public sentFromParent: any;

    constructor(
        private zone: NgZone,
        private fb: FormBuilder,
        private httpService: HttpService,
        private serviceConstants: ServiceConstants,
        private errorService: ErrorService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private utils: Utils,
        private store: Store<any>
        ) {
        this.maintenanceDFormGroup = this.fb.group({
            PromptPaymentInd: [{ value: '', disabled: true }],
            PromptPaymentRate: [{ value: '', disabled: true }],
            PromptPaymentNarrative: [{ value: '', disabled: true }],
            RetrospectiveInd: [{ value: '', disabled: true }],
            RetrospectiveRate: [{ value: '', disabled: true }],
            RetrospectiveNarrative: [{ value: '', disabled: true }]
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
                    break;
                    case ContractActionTypes.SAVE_OTHER_PARAMS:
                    this.otherParams = data['otherParams'];
                    break;
                    case ContractActionTypes.SAVE_CODE:

                    break;
                    case ContractActionTypes.SAVE_FIELD:

                    break;
                    case ContractActionTypes.SAVE_SERVICE:
                    break;
                    case ContractActionTypes.SAVE_SENT_FROM_PARENT:
                    break;
                    case ContractActionTypes.VALIDATE_FORMS:
                    if (data['validate'].typeD) {
                        this.validateForm();
                    }
                    break;
                    case ContractActionTypes.FORM_RESET:
                    for (let i in this.maintenanceDFormGroup.controls) {
                        if (this.maintenanceDFormGroup.controls.hasOwnProperty(i)) {
                          this.maintenanceDFormGroup.controls[i].clearValidators();
                        }
                    }
                    this.maintenanceDFormGroup.reset();
                    break;
                    case ContractActionTypes.PARENT_TO_CHILD_COMPONENT:
                    if (data['parentToChildComponent']) {
                        if (data['parentToChildComponent'].PromptPaymentInd) {
                            if (data['parentToChildComponent'].PromptPaymentInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                                this.maintenanceDFormGroup.controls['PromptPaymentInd'].setValue(true);
                                this.zone.run(() => {
                                    this.promptPaymentInd = true;
                                });
                                this.maintenanceDFormGroup.controls['PromptPaymentRate'].setValue(data['parentToChildComponent'].PromptPaymentRate);
                                this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].setValue(data['parentToChildComponent'].PromptPaymentNarrative);
                            } else {
                                this.maintenanceDFormGroup.controls['PromptPaymentInd'].setValue(false);
                                this.promptPaymentInd = false;
                            }
                        }

                        if (data['parentToChildComponent'].RetrospectiveInd) {
                            if (data['parentToChildComponent'].RetrospectiveInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                                this.maintenanceDFormGroup.controls['RetrospectiveInd'].setValue(true);
                                this.zone.run(() => {
                                    this.retrospectiveInd = true;
                                });
                                this.maintenanceDFormGroup.controls['RetrospectiveRate'].setValue(data['parentToChildComponent'].RetrospectiveRate);
                                this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].setValue(data['parentToChildComponent'].RetrospectiveNarrative);
                            } else {
                                this.maintenanceDFormGroup.controls['RetrospectiveInd'].setValue(false);
                                this.retrospectiveInd = false;
                            }
                        }
                    }
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
            typeD: this.maintenanceDFormGroup
        }
    });
    this.errorService.emitError(0);
    this.errorSubscription = this.errorService.getObservableSource().subscribe(data => {
        if (data !== 0) {
            this.zone.run(() => {

                if (data['errorMessage']) {
                    //this.errorModal.show(data, true);
                }
            });
        }
    });
    this.querySubscription = this.route.queryParams.subscribe(params => {
        this.parentQueryParams = params;
        switch (params['parentMode']) {
            case 'ContractExpiryGrid':
            case 'DailyTransactions':
            case 'BusinessDailyTransactions':
            case 'ContractPOExpiryGrid':

            break;

            case 'AddFromProspect' :
            break;

            case 'AddContractFromAccount':
            case 'AddJobFromAccount':
            case 'AddProductFromAccount':
            if (params['PromptPaymentInd'] && params['PromptPaymentInd'].toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.maintenanceDFormGroup.controls['PromptPaymentInd'].setValue(true);
            } else {
                this.maintenanceDFormGroup.controls['PromptPaymentInd'].setValue(false);
            }

            if (params['RetrospectiveInd'] && params['RetrospectiveInd'].toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.maintenanceDFormGroup.controls['RetrospectiveInd'].setValue(true);
            } else {
                this.maintenanceDFormGroup.controls['RetrospectiveInd'].setValue(false);
            }

            break;

            case 'Prospect' :
            break;

            case 'PipelineGrid':
            case 'ProspectPremises':

            break;

            case 'CallCentreSearch':
            break;

            case 'GeneralSearch':
            case 'GeneralSearch-Con':
            break;

            case 'GeneralSearchProduct':
            break;

            case 'StockUsageSearch':
            case 'TreatmentcardRecall':
            break;

            case 'NatAccContracts':
            break;

            case 'InvoiceHistory':
            break;

        }
    });
    if (this.storeData && this.storeData['data'] && !(Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object)) {
        this.setFormData(this.storeData);
    }

}
ngOnDestroy(): void {
    if (this.errorSubscription)
        this.errorSubscription.unsubscribe();

    if (this.messageSubscription)
        this.messageSubscription.unsubscribe();

    this.storeSubscription.unsubscribe();
    if (this.querySubscription)
        this.querySubscription.unsubscribe();
    if (this.translateSubscription)
        this.translateSubscription.unsubscribe();
}

public fetchTranslationContent(): void {
    // Translation content

}

public getTranslatedValue(key: any, params: any): any {
    if (params) {
        return this.storeData['services'].translate.get(key, { value: params });
    } else {
        return this.storeData['services'].translate.get(key);
    }
}

public processSysChar(): void {
    // statement
}

public setFormData(data: Object): void {
    this.maintenanceDFormGroup.controls['PromptPaymentInd'].setValue(this.storeData['data'].PromptPaymentInd && this.storeData['data'].PromptPaymentInd.toUpperCase() === GlobalConstant.Configuration.Yes ? true : false);
    this.maintenanceDFormGroup.controls['PromptPaymentRate'].setValue(this.storeData['data'].PromptPaymentRate);
    this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].setValue(this.storeData['data'].PromptPaymentNarrative);
    this.maintenanceDFormGroup.controls['RetrospectiveInd'].setValue(this.storeData['data'].RetrospectiveInd && this.storeData['data'].RetrospectiveInd.toUpperCase() === GlobalConstant.Configuration.Yes ? true : false);
    this.maintenanceDFormGroup.controls['RetrospectiveRate'].setValue(this.storeData['data'].RetrospectiveRate);
    this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].setValue(this.storeData['data'].RetrospectiveNarrative);
}

public validateForm(): void {
    for (let i in this.maintenanceDFormGroup.controls) {
        if (this.maintenanceDFormGroup.controls.hasOwnProperty(i)) {
            this.maintenanceDFormGroup.controls[i].markAsTouched();
        }
    }
    this.maintenanceDFormGroup.updateValueAndValidity();
    let formValid = null;
    if (!this.maintenanceDFormGroup.enabled) {
        formValid = true;
    } else {
        formValid = this.maintenanceDFormGroup.valid;
    }
    this.store.dispatch({
        type: ContractActionTypes.FORM_GROUP, payload: {
            typeD: this.maintenanceDFormGroup
        }
    });
    this.store.dispatch({
        type: ContractActionTypes.FORM_VALIDITY, payload: {
            typeD: formValid
        }
    });
}

public onPaymentDiscountChange(event: any): void {
    let postData = {};
    this.queryParams.discountTypeCode = 'PP';
    postData['discountTypeCode'] = this.queryParams.discountTypeCode;
    if (this.promptPaymentInd) {
        this.fetchData(postData).subscribe(
            (e) => {
                if (e.status === GlobalConstant.Configuration.Failure) {
                    this.errorService.emitError(e.oResponse);
                } else {
                    this.zone.run(() => {
                        this.maintenanceDFormGroup.controls['PromptPaymentRate'].enable();
                        if (this.maintenanceDFormGroup.controls['PromptPaymentRate'].value === '' || isNaN(this.maintenanceDFormGroup.controls['PromptPaymentRate'].value)) {
                            this.maintenanceDFormGroup.controls['PromptPaymentRate'].setValue(e.DiscountRate.replace(/,/g, '.'));
                        }
                        this.maintenanceDFormGroup.controls['PromptPaymentRate'].setValidators(Validators.required);
                        this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].enable();
                        if (this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].value === '') {
                            this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].setValue(e.DiscountNarr);
                        }
                        this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].setValidators(Validators.required);
                    });
                }

            },
            (error) => {
                this.errorService.emitError(error);
            }
            );
    } else {
        this.maintenanceDFormGroup.controls['PromptPaymentRate'].clearValidators();
        this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].clearValidators();
    }
}

public onRetrospectiveDiscountChange(event: any): void {
    let postData = {};
    this.queryParams.discountTypeCode = 'RD';
    postData['discountTypeCode'] = this.queryParams.discountTypeCode;
    if (this.retrospectiveInd) {
        this.fetchData(postData).subscribe(
            (e) => {
                if (e.status === GlobalConstant.Configuration.Failure) {
                    this.errorService.emitError(e.oResponse);
                } else {
                    this.zone.run(() => {
                        this.maintenanceDFormGroup.controls['RetrospectiveRate'].enable();
                        if (this.maintenanceDFormGroup.controls['RetrospectiveRate'].value === '' || isNaN(this.maintenanceDFormGroup.controls['RetrospectiveRate'].value)) {
                            this.maintenanceDFormGroup.controls['RetrospectiveRate'].setValue(e.DiscountRate.replace(/,/g, '.'));
                        }
                        this.maintenanceDFormGroup.controls['RetrospectiveRate'].setValidators(Validators.required);
                        this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].enable();
                        if (this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].value === '') {
                            this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].setValue(e.DiscountNarr);
                        }
                        this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].setValidators(Validators.required);
                    });
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
            );
    } else {
        this.maintenanceDFormGroup.controls['RetrospectiveRate'].clearValidators();
        this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].clearValidators();
    }
}

public setTwoNumberDecimal(event: any): void {
    if (!isNaN(parseFloat(this.maintenanceDFormGroup.controls['PromptPaymentRate'].value))) {
        this.maintenanceDFormGroup.controls['PromptPaymentRate'].setValue(parseFloat(this.maintenanceDFormGroup.controls['PromptPaymentRate'].value).toFixed(2));
    } else {
        this.maintenanceDFormGroup.controls['PromptPaymentRate'].setValue('');
    }
    if (!isNaN(parseFloat(this.maintenanceDFormGroup.controls['RetrospectiveRate'].value))) {
        this.maintenanceDFormGroup.controls['RetrospectiveRate'].setValue(parseFloat(this.maintenanceDFormGroup.controls['RetrospectiveRate'].value).toFixed(2));
    } else {
        this.maintenanceDFormGroup.controls['RetrospectiveRate'].setValue('');
    }
}

public processForm(): void {
    if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
        if (this.storeData['data'] && this.storeData['data'].AccountNumber !== '' && this.storeData['data'].AccountNumber !== null) {
            this.maintenanceDFormGroup.controls['PromptPaymentInd'].disable();
            this.maintenanceDFormGroup.controls['RetrospectiveInd'].disable();
        } else {
            this.maintenanceDFormGroup.controls['PromptPaymentInd'].enable();
            this.maintenanceDFormGroup.controls['RetrospectiveInd'].enable();
        }
    }

    if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
        this.maintenanceDFormGroup.controls['PromptPaymentInd'].disable();
        this.maintenanceDFormGroup.controls['RetrospectiveInd'].disable();
    }

    if (this.mode['addMode'] && !this.mode['updateMode'] && !this.mode['searchMode']) {
        if (!this.storeData['fieldValue'] || !this.storeData['fieldValue'].AccountNumber || this.storeData['fieldValue'].AccountNumber === '') {
            this.maintenanceDFormGroup.controls['PromptPaymentInd'].enable();
            this.maintenanceDFormGroup.controls['RetrospectiveInd'].enable();
            this.maintenanceDFormGroup.controls['PromptPaymentRate'].enable();
            this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].enable();
            this.maintenanceDFormGroup.controls['RetrospectiveRate'].enable();
            this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].enable();
            this.maintenanceDFormGroup.controls['PromptPaymentInd'].setValue(false);
            this.maintenanceDFormGroup.controls['RetrospectiveInd'].setValue(false);
            this.maintenanceDFormGroup.controls['PromptPaymentRate'].setValue('');
            this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].setValue('');
            this.maintenanceDFormGroup.controls['RetrospectiveRate'].setValue('');
            this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].setValue('');
        } else {
            this.maintenanceDFormGroup.controls['PromptPaymentInd'].disable();
            this.maintenanceDFormGroup.controls['RetrospectiveInd'].disable();
            this.maintenanceDFormGroup.controls['PromptPaymentRate'].disable();
            this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].disable();
            this.maintenanceDFormGroup.controls['RetrospectiveRate'].disable();
            this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].disable();
            this.maintenanceDFormGroup.controls['PromptPaymentInd'].setValue(false);
            this.maintenanceDFormGroup.controls['RetrospectiveInd'].setValue(false);
            this.maintenanceDFormGroup.controls['PromptPaymentRate'].setValue('');
            this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].setValue('');
            this.maintenanceDFormGroup.controls['RetrospectiveRate'].setValue('');
            this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].setValue('');
        }
        if (this.sysCharParams && this.sysCharParams['vSCAccountDiscounts']) {
            switch (this.parentQueryParams['parent']) {
                case 'AddContractFromAccount':
                case 'AddJobFromAccount':
                case 'AddProductFromAccount':
                this.maintenanceDFormGroup.controls['PromptPaymentInd'].disable();
                this.maintenanceDFormGroup.controls['RetrospectiveInd'].disable();
                this.maintenanceDFormGroup.controls['PromptPaymentRate'].disable();
                this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].disable();
                this.maintenanceDFormGroup.controls['RetrospectiveRate'].disable();
                this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].disable();
                this.maintenanceDFormGroup.controls['PromptPaymentInd'].setValue(false);
                this.maintenanceDFormGroup.controls['RetrospectiveInd'].setValue(false);
                this.maintenanceDFormGroup.controls['PromptPaymentRate'].setValue('');
                this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].setValue('');
                this.maintenanceDFormGroup.controls['RetrospectiveRate'].setValue('');
                this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].setValue('');
                break;
                case 'ServiceCover':
                case 'Premise':
                case 'ServiceVisitWorkIndex':

                break;

                case 'Portfolio General Maintenance':

                break;

                default:
                this.maintenanceDFormGroup.controls['PromptPaymentInd'].enable();
                this.maintenanceDFormGroup.controls['RetrospectiveInd'].enable();
                this.maintenanceDFormGroup.controls['PromptPaymentRate'].enable();
                this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].enable();
                this.maintenanceDFormGroup.controls['RetrospectiveRate'].enable();
                this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].enable();
                this.maintenanceDFormGroup.controls['PromptPaymentInd'].setValue(false);
                this.maintenanceDFormGroup.controls['RetrospectiveInd'].setValue(false);
                this.maintenanceDFormGroup.controls['PromptPaymentRate'].setValue('');
                this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].setValue('');
                this.maintenanceDFormGroup.controls['RetrospectiveRate'].setValue('');
                this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].setValue('');
                break;
            }
        }

        this.store.dispatch({
            type: ContractActionTypes.FORM_GROUP, payload: {
                typeD: this.maintenanceDFormGroup
            }
        });
    }

}

public fetchData(data: any): any {
    this.query.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
    this.query.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
    this.query.set(this.serviceConstants.Action, this.queryParams.action);
    this.query.set('function', this.queryParams.function);
    return this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.query, data);
}
}
