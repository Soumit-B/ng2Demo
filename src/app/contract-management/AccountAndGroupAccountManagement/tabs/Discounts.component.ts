import { Utils } from './../../../../shared/services/utility';
import { GroupAccountNumberComponent } from './../../../internal/search/iCABSSGroupAccountNumberSearch';
import { LocaleTranslationService } from './../../../../shared/services/translation.service';
import { Http, URLSearchParams } from '@angular/http';
import { TranslateService } from 'ng2-translate';
import { Logger } from '@nsalaun/ng2-logger';
import { Router } from '@angular/router';
import { PageDataService } from './../../../../shared/services/page-data.service';
import { AjaxObservableConstant } from './../../../../shared/constants/ajax-observable.constant';
import { AuthService } from './../../../../shared/services/auth.service';
import { LocalStorageService } from 'ng2-webstorage';
import { Title } from '@angular/platform-browser';
import { ErrorService } from './../../../../shared/services/error.service';
import { MessageService } from './../../../../shared/services/message.service';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { HttpService } from './../../../../shared/services/http-service';
import { AccountMaintenanceActionTypes } from './../../../actions/account-maintenance';
import { Component, NgZone, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { ContractActionTypes } from '../../../../app/actions/contract';
import { AccountSearchComponent } from '../../../../app/internal/search/iCABSASAccountSearch';
import { PostCodeSearchComponent } from '../../../../app/internal/search/iCABSBPostcodeSearch.component';

@Component({
    selector: 'icabs-account-maintenance-general',
    templateUrl: 'Discounts.html'
})

export class DiscountsComponent implements OnInit, OnDestroy {
    public inputParams: any = { 'parentMode': 'Contract-Search', 'ContractTypeCode': 'J', 'businessCode': 'D' };
    public storeSubscription: Subscription;
    public discountsFormGroup: FormGroup;
    public ajaxSubscription: Subscription;
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public isRequesting: boolean = false;

    public internalFieldStatus: any = {
        'fieldDisabled': null,
        'fieldVisibility': null,
        'fieldRequired': null,
        'sysCharParams': null,
        'virtualTableField': null,
        'otherParams': null
    };

    public fieldDisabled: any = {
        'BtnSendToNAV': false,
        'cmdGetAddress': false,
        'cmdSetInvoiceGroupDefault': false,
        'cmdSetInvoiceGroupEDI': false,
        'selMandateTypeCode': false,
        'cmdGenerateNew': false
    };

    public fieldVisibility: any = {

        'BadDebtAccount': false,
        'CustomerInfo': true,

        'MandateDate': true,
        'SEPADirectDebit': true,
        'SEPAMandateRef': true,
        'FinanceMandateRef': true,
        'CurrentInvoiceGroups': true,
        'menuControl': true,

        'PromptPayment1': true,
        'PromptPayment2': true,
        'Retrospective1': true,
        'Retrospective2': true,
        'InvoiceDiscount1': true,
        'InvoiceDiscount2': true,
        'DiscountTextKey': true

    };

    public fieldRequired: any = {
        'isPromptPaymentIndRequired': false,
        'isPromptPaymentRateRequired': false,
        'isPromptPaymentNarrative': false,
        'isRetrospectiveIndRequired': false,
        'isRetrospectiveRateRequired': false,
        'isRetrospectiveNarrative': false,
        'isInvoiceDiscountIndRequired': false,
        'isInvoiceDiscountRateRequired': false,
        'isInvoiceDiscountNarrative': false,
        'isVATExemptRequired': false,
        'isLogoTypeCodeRequired': true,
        'isExcludePDADebtIndRequired': false,
        'isCallLogID': false,
        'isCrossReferenceAccountNumberRequired': false,
        'isValidationExemptIndRequired': false,
        'isNewInvoiceGroupIndRequired': false,
        'isGPSCoordinateXRequired': false,
        'isGPSCoordinateYRequired': false
    };

    public virtualTableField: any = {
        'CrossReferenceAccountName': '',
        'BankAccountTypeDesc': '',
        'GroupName': '',
        'AccountBusinessTypeDesc': '',
        'LogoTypeDesc': '',
        'EmployeeSurname': '',
        'AccountOwnerSurname': '',
        'TierSystemDescription': '',
        'TierDescription': '',
        'CategoryDesc': '',
        'riCountryDescription': ''
    };

    public otherParams: any = {
        'glAllowUserAuthUpdate': false,
        'cEmployeeLimitChildDrillOptions': ''
    };



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

    public defaultCode: any = {
        country: '',
        business: '',
        BranchNumber: ''
    };
    public params: Object;
    public syschars: Object;
    public virtualTableData: Object;
    public mode: Object;
    public storeData: any;
    public sysCharParams: Object;
    public accountData: any;

    public updateMode: boolean = false;
    public addMode: boolean = false;
    public searchMode: boolean = false;

    public queryAccount: URLSearchParams;
    public currentMode: string;

    public method: string = 'contract-management/maintenance';
    public module: string = 'account';
    public operation: string = 'Application/iCABSAAccountMaintenance';
    public contentType: string = 'application/x-www-form-urlencoded';

    constructor(
        private httpService: HttpService,
        private serviceConstants: ServiceConstants,
        private errorService: ErrorService,
        private messageService: MessageService,
        private authService: AuthService,
        private ajaxconstant: AjaxObservableConstant,
        private router: Router,
        private pageData: PageDataService,
        private titleService: Title,
        private zone: NgZone,
        private store: Store<any>,
        private translate: TranslateService,
        private ls: LocalStorageService,
        private http: Http,
        private translateService: LocaleTranslationService,
        private fb: FormBuilder,
        private logger: Logger,
        private utilService: Utils
    ) {
        this.discountsFormGroup = this.fb.group({
            PromptPaymentInd: [{ value: false, disabled: true }],
            PromptPaymentRate: [{ value: '', disabled: true }],
            PromptPaymentNarrative: [{ value: '', disabled: true }],
            RetrospectiveInd: [{ value: false, disabled: true }],
            RetrospectiveRate: [{ value: '', disabled: true }],
            RetrospectiveNarrative: [{ value: '', disabled: true }],
            InvoiceDiscountInd: [{ value: false, disabled: true }],
            InvoiceDiscountRate: [{ value: '', disabled: true }],
            InvoiceDiscountNarrative: [{ value: '', disabled: true }]
        });

        this.storeSubscription = store.select('accountMaintenance').subscribe(data => {
            if (data && data['action']) {
                this.storeData = data;
                switch (data['action']) {
                    case AccountMaintenanceActionTypes.SAVE_DATA:
                        if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                            this.setFormData(data);
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_ACCOUNT:
                        if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                            this.accountData = data['data'];
                            this.setFormData(data);
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_MODE:
                        if (data['mode'] && !(Object.keys(data['mode']).length === 0 && data['mode'].constructor === Object)) {
                            this.mode = data['mode'];
                            this.addMode = data['mode'].addMode;
                            this.updateMode = data['mode'].updateMode;
                            this.searchMode = data['mode'].searchMode;
                            this.processForm();
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_SYSCHAR:
                        this.sysCharParams = data['syschars'];
                        break;
                    case AccountMaintenanceActionTypes.SAVE_PROCESSED_SYSCHAR:
                        this.sysCharParams = data['processedSysChar'];
                        //this.initPage();
                        break;
                    case AccountMaintenanceActionTypes.FORM_INIT:

                        break;
                    case AccountMaintenanceActionTypes.SAVE_VIRTUAL_TABLE_DATA:
                        this.virtualTableField = data['virtualTableData'];
                        break;
                    case AccountMaintenanceActionTypes.VALIDATE_FORMS:
                        //if (data['validate'].discounts) {
                        if (typeof (data['validate'].discounts) !== 'undefined') {
                            this.validateForm();
                        }
                        break;
                    case AccountMaintenanceActionTypes.LOAD_FORM_GROUP:
                        break;
                    case AccountMaintenanceActionTypes.BEFORE_MODE:
                        this.beforeMode();
                        break;
                    default:
                        break;
                }
            }

        });


    }

    ngOnInit(): void {
        String.prototype['capitalizeFirstLetter'] = function (): any {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.defaultCode.country = this.utilService.getCountryCode();
        this.defaultCode.business = this.utilService.getBusinessCode();
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
        this.dispathFormGroup();
    }

    ngOnDestroy(): void {
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
    }

    public initPage(): void {
        if (this.storeData && this.storeData['processedSysChar']) {
            this.sysCharParams = this.storeData['processedSysChar'];
        }
        else {
            return;
        }

        if (this.sysCharParams['vSCAccountDiscounts'] === true) {
            this.fieldRequired.isPromptPaymentIndRequired = false;
            this.discountsFormGroup.controls['PromptPaymentInd'].clearValidators();
            this.fieldRequired.isPromptPaymentRateRequired = false;
            this.discountsFormGroup.controls['PromptPaymentRate'].clearValidators();
            this.fieldRequired.isPromptPaymentNarrativeRequired = false;
            this.discountsFormGroup.controls['PromptPaymentNarrative'].clearValidators();
            this.fieldRequired.isRetrospectiveIndRequired = false;
            this.discountsFormGroup.controls['RetrospectiveInd'].clearValidators();
            this.fieldRequired.isRetrospectiveRateRequired = false;
            this.discountsFormGroup.controls['RetrospectiveRate'].clearValidators();
            this.fieldRequired.isRetrospectiveNarrativeRequired = false;
            this.discountsFormGroup.controls['RetrospectiveNarrative'].clearValidators();
            this.fieldRequired.isInvoiceDiscountIndRequired = false;
            this.discountsFormGroup.controls['InvoiceDiscountInd'].clearValidators();
            this.fieldRequired.isInvoiceDiscountRateRequired = false;
            this.discountsFormGroup.controls['InvoiceDiscountRate'].clearValidators();
            this.fieldRequired.isInvoiceDiscountNarrativeRequired = false;
            this.discountsFormGroup.controls['InvoiceDiscountNarrative'].clearValidators();
            this.loadFormControl();
            this.discountsFormGroup.updateValueAndValidity();
        }

    }

    public dispathFormGroup(): void {
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                discounts: this.discountsFormGroup
            }
        });

        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                discounts: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                discounts: this.fieldVisibility
            }
        });
    }

    public setFormData(data: any): void {
        this.discountsFormGroup.controls['PromptPaymentInd'].setValue(this.isCheckBoxChecked(data['data'].PromptPaymentInd));
        this.discountsFormGroup.controls['PromptPaymentRate'].setValue(this.getFieldValue(data['data'].PromptPaymentRate));
        this.discountsFormGroup.controls['PromptPaymentNarrative'].setValue(this.getFieldValue(data['data'].PromptPaymentNarrative));
        this.discountsFormGroup.controls['RetrospectiveInd'].setValue(this.isCheckBoxChecked(data['data'].RetrospectiveInd));
        this.discountsFormGroup.controls['RetrospectiveRate'].setValue(this.getFieldValue(data['data'].RetrospectiveRate));
        this.discountsFormGroup.controls['RetrospectiveNarrative'].setValue(this.getFieldValue(data['data'].RetrospectiveNarrative));
        this.discountsFormGroup.controls['InvoiceDiscountInd'].setValue(this.isCheckBoxChecked(data['data'].InvoiceDiscountInd));
        this.discountsFormGroup.controls['InvoiceDiscountRate'].setValue(this.getFieldValue(data['data'].InvoiceDiscountRate));
        this.discountsFormGroup.controls['InvoiceDiscountNarrative'].setValue(this.getFieldValue(data['data'].InvoiceDiscountNarrative));
        this.discountsFormGroup.updateValueAndValidity();
        this.loadFormControl();
    }

    public loadFormControl(): void {
        if (this.discountsFormGroup.controls['PromptPaymentInd'].value === true) {
            this.fieldVisibility.PromptPayment1 = true;
            this.fieldVisibility.PromptPayment2 = true;
        }
        else {
            this.fieldVisibility.PromptPayment1 = false;
            this.fieldVisibility.PromptPayment2 = false;
        }

        if (this.discountsFormGroup.controls['RetrospectiveInd'].value === true) {
            this.fieldVisibility.Retrospective1 = true;
            this.fieldVisibility.Retrospective2 = true;
        }
        else {
            this.fieldVisibility.Retrospective1 = false;
            this.fieldVisibility.Retrospective2 = false;
        }

        if (this.discountsFormGroup.controls['InvoiceDiscountInd'].value === true) {
            this.fieldVisibility.InvoiceDiscount1 = true;
            this.fieldVisibility.InvoiceDiscount2 = true;
        }
        else {
            this.fieldVisibility.InvoiceDiscount1 = false;
            this.fieldVisibility.InvoiceDiscount2 = false;
        }
    }

    public validateForm(): void {
        for (let j in this.fieldVisibility) {
            if (j) {
                let key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.discountsFormGroup.controls[key]) {
                        this.discountsFormGroup.controls[key].clearValidators();
                    }
                }
            }

        }
        for (let i in this.discountsFormGroup.controls) {
            if (this.discountsFormGroup.controls[i].enabled) {
                this.discountsFormGroup.controls[i].markAsTouched();
            } else {
                this.discountsFormGroup.controls[i].clearValidators();
            }
        }
        this.discountsFormGroup.updateValueAndValidity();
        let formValid = null;
        if (!this.discountsFormGroup.enabled) {
            formValid = true;
        } else {
            formValid = this.discountsFormGroup.valid;
        }
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                discounts: this.discountsFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                discounts: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                discounts: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_VALIDITY, payload: {
                discounts: formValid
            }
        });
    }

    public processForm(): any {
        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            this.discountsFormGroup.controls['PromptPaymentInd'].enable();
            this.discountsFormGroup.controls['PromptPaymentRate'].enable();
            this.discountsFormGroup.controls['PromptPaymentNarrative'].enable();
            this.discountsFormGroup.controls['RetrospectiveInd'].enable();
            this.discountsFormGroup.controls['RetrospectiveRate'].enable();
            this.discountsFormGroup.controls['RetrospectiveNarrative'].enable();
            this.discountsFormGroup.controls['InvoiceDiscountInd'].enable();
            this.discountsFormGroup.controls['InvoiceDiscountRate'].enable();
            this.discountsFormGroup.controls['InvoiceDiscountNarrative'].enable();

            this.discountsFormGroup.controls['RetrospectiveRate'].setValue('');
            this.discountsFormGroup.controls['PromptPaymentRate'].setValue('');
            this.discountsFormGroup.controls['InvoiceDiscountRate'].setValue('');
        }

        if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
            this.discountsFormGroup.controls['PromptPaymentInd'].disable();
            this.discountsFormGroup.controls['PromptPaymentInd'].disable();
            this.discountsFormGroup.controls['PromptPaymentRate'].disable();
            this.discountsFormGroup.controls['PromptPaymentNarrative'].disable();
            this.discountsFormGroup.controls['RetrospectiveInd'].disable();
            this.discountsFormGroup.controls['RetrospectiveRate'].disable();
            this.discountsFormGroup.controls['RetrospectiveNarrative'].disable();
            this.discountsFormGroup.controls['InvoiceDiscountInd'].disable();
            this.discountsFormGroup.controls['InvoiceDiscountRate'].disable();
            this.discountsFormGroup.controls['InvoiceDiscountNarrative'].disable();

            this.discountsFormGroup.controls['RetrospectiveRate'].setValue('');
            this.discountsFormGroup.controls['PromptPaymentRate'].setValue('');
            this.discountsFormGroup.controls['InvoiceDiscountRate'].setValue('');
        }
        if (this.mode['addMode'] && !this.mode['searchMode'] && !this.mode['updateMode']) {
            this.discountsFormGroup.controls['PromptPaymentInd'].enable();
            this.discountsFormGroup.controls['PromptPaymentRate'].enable();
            this.discountsFormGroup.controls['PromptPaymentNarrative'].enable();
            this.discountsFormGroup.controls['RetrospectiveInd'].enable();
            this.discountsFormGroup.controls['RetrospectiveRate'].enable();
            this.discountsFormGroup.controls['RetrospectiveNarrative'].enable();
            this.discountsFormGroup.controls['InvoiceDiscountInd'].enable();
            this.discountsFormGroup.controls['InvoiceDiscountRate'].enable();
            this.discountsFormGroup.controls['InvoiceDiscountNarrative'].enable();
            this.discountsFormGroup.controls['PromptPaymentInd'].setValue(false);
            this.discountsFormGroup.controls['PromptPaymentRate'].setValue('');
            this.discountsFormGroup.controls['PromptPaymentNarrative'].setValue('');
            this.discountsFormGroup.controls['RetrospectiveInd'].setValue(false);
            this.discountsFormGroup.controls['RetrospectiveRate'].setValue('');
            this.discountsFormGroup.controls['RetrospectiveNarrative'].setValue('');
            this.discountsFormGroup.controls['InvoiceDiscountInd'].setValue(false);
            this.discountsFormGroup.controls['InvoiceDiscountRate'].setValue('');
            this.discountsFormGroup.controls['InvoiceDiscountNarrative'].setValue('');
        }

        this.discountsFormGroup.updateValueAndValidity();
        this.loadFormControl();
    }

    private isCheckBoxChecked(arg: any): boolean {
        if (typeof arg === 'boolean' || (typeof arg === 'object' && typeof arg.valueOf() === 'boolean'))
            return arg;

        return (arg) ? (((arg.toLowerCase() === 'false') || (arg.toLowerCase() === 'f') || (arg.toLowerCase() === 'no')) ? false : true) : false;
    }

    private getFieldValue(value: any): any  {
        return  (value !== undefined && value !== null ) ? value : '' ;
    }


    public beforeMode(): any {
        this.sysCharParams = this.storeData['processedSysChar'];

        if (this.sysCharParams['vSCAccountDiscounts'] === true) {
            this.onPromptPaymentIndClick();
            this.onRetrospectiveIndClick();
            this.onInvoiceDiscountIndClick();
        }

        this.discountsFormGroup.updateValueAndValidity();
    }

    public onPromptPaymentIndClick(): void {
        if (this.recordSelected(false, true) || this.addMode) {
            if (this.discountsFormGroup.controls['PromptPaymentInd'].value === true) {
                this.getDefaultPromptPaymentDetails();
                this.fieldVisibility.PromptPayment1 = true;
                this.fieldVisibility.PromptPayment2 = true;
                this.discountsFormGroup.controls['PromptPaymentRate'].setValidators(Validators.required);
                this.discountsFormGroup.controls['PromptPaymentNarrative'].setValidators(Validators.required);
                this.discountsFormGroup.controls['PromptPaymentRate'].updateValueAndValidity();
                this.discountsFormGroup.controls['PromptPaymentNarrative'].updateValueAndValidity();
                this.fieldRequired.isPromptPaymentRateRequired = true;
                this.fieldRequired.isPromptPaymentNarrativeRequired = true;
            } else {
                this.fieldVisibility.PromptPayment1 = false;
                this.fieldVisibility.PromptPayment2 = false;
                this.discountsFormGroup.controls['PromptPaymentRate'].setErrors(null);
                this.discountsFormGroup.controls['PromptPaymentNarrative'].setErrors(null);
                this.discountsFormGroup.controls['PromptPaymentRate'].setValue('');
                this.discountsFormGroup.controls['PromptPaymentNarrative'].setValue('');
                this.discountsFormGroup.controls['PromptPaymentRate'].clearValidators();
                this.discountsFormGroup.controls['PromptPaymentNarrative'].clearValidators();
                this.discountsFormGroup.controls['PromptPaymentRate'].updateValueAndValidity();
                this.discountsFormGroup.controls['PromptPaymentNarrative'].updateValueAndValidity();
                this.fieldRequired.isPromptPaymentRateRequired = false;
                this.fieldRequired.isPromptPaymentNarrativeRequired = false;
            }
            this.discountsFormGroup.updateValueAndValidity();
        }
    }

    public onRetrospectiveIndClick(): void {
        if (this.recordSelected(false, true) || this.addMode) {
            if (this.discountsFormGroup.controls['RetrospectiveInd'].value === true) {
                this.getDefaultRetrospectiveDetails();
                this.fieldVisibility.Retrospective1 = true;
                this.fieldVisibility.Retrospective2 = true;
                this.discountsFormGroup.controls['RetrospectiveRate'].setValidators(Validators.required);
                this.discountsFormGroup.controls['RetrospectiveRate'].updateValueAndValidity();
                this.discountsFormGroup.controls['RetrospectiveNarrative'].setValidators(Validators.required);
                this.discountsFormGroup.controls['RetrospectiveNarrative'].updateValueAndValidity();
                this.fieldRequired.isRetrospectiveRateRequired = true;
                this.fieldRequired.isRetrospectiveNarrativeRequired = true;
            } else {
                this.fieldVisibility.Retrospective1 = false;
                this.fieldVisibility.Retrospective2 = false;
                this.discountsFormGroup.controls['RetrospectiveRate'].setErrors(null);
                this.discountsFormGroup.controls['RetrospectiveRate'].clearValidators();
                this.discountsFormGroup.controls['RetrospectiveNarrative'].setErrors(null);
                this.discountsFormGroup.controls['RetrospectiveNarrative'].clearValidators();
                this.discountsFormGroup.controls['RetrospectiveRate'].updateValueAndValidity();
                this.discountsFormGroup.controls['RetrospectiveNarrative'].updateValueAndValidity();
                this.fieldRequired.isRetrospectiveRateRequired = false;
                this.fieldRequired.isRetrospectiveNarrativeRequired = false;
            }
            this.discountsFormGroup.updateValueAndValidity();
        }
    }

    public onInvoiceDiscountIndClick(): void {
        if (this.recordSelected(false, true) || this.addMode) {
            if (this.discountsFormGroup.controls['InvoiceDiscountInd'].value === true) {
                this.getDefaultInvoiceDiscountDetails();
                this.fieldVisibility.InvoiceDiscount1 = true;
                this.fieldVisibility.InvoiceDiscount2 = true;
                this.discountsFormGroup.controls['InvoiceDiscountRate'].setValidators(Validators.required);
                this.discountsFormGroup.controls['InvoiceDiscountRate'].updateValueAndValidity();
                this.discountsFormGroup.controls['InvoiceDiscountNarrative'].setValidators(Validators.required);
                this.discountsFormGroup.controls['InvoiceDiscountNarrative'].updateValueAndValidity();
                this.fieldRequired.isInvoiceDiscountRateRequired = true;
                this.fieldRequired.isInvoiceDiscountNarrativeRequired = true;
            } else {
                this.fieldVisibility.InvoiceDiscount1 = false;
                this.fieldVisibility.InvoiceDiscount2 = false;
                this.discountsFormGroup.controls['InvoiceDiscountRate'].setErrors(null);
                this.discountsFormGroup.controls['InvoiceDiscountNarrative'].setErrors(null);
                this.discountsFormGroup.controls['InvoiceDiscountRate'].clearValidators();
                this.discountsFormGroup.controls['InvoiceDiscountNarrative'].clearValidators();
                this.discountsFormGroup.controls['InvoiceDiscountRate'].updateValueAndValidity();
                this.discountsFormGroup.controls['InvoiceDiscountNarrative'].updateValueAndValidity();
                this.fieldRequired.isInvoiceDiscountRateRequired = false;
                this.fieldRequired.isInvoiceDiscountNarrativeRequired = false;
            }
            this.discountsFormGroup.updateValueAndValidity();
        }
    }


    public getDefaultRetrospectiveDetails(): void {
        this.getDefaultDiscountDetails('RD', this.discountsFormGroup.controls['RetrospectiveRate'], this.discountsFormGroup.controls['RetrospectiveNarrative']);
    }

    public getDefaultPromptPaymentDetails(): void {
        this.getDefaultDiscountDetails('PP', this.discountsFormGroup.controls['PromptPaymentRate'], this.discountsFormGroup.controls['PromptPaymentNarrative']);
    }

    public getDefaultInvoiceDiscountDetails(): void {
        this.getDefaultDiscountDetails('IN', this.discountsFormGroup.controls['InvoiceDiscountRate'], this.discountsFormGroup.controls['InvoiceDiscountNarrative']);
    }

    public getDefaultDiscountDetails(cDiscountType: string, ctrRate: any, ctrNarr: any): void {

        let oRate = (ctrRate.value) ? ctrRate.value.trim() : ctrRate.value;
        let oNarr = (ctrNarr.value) ? ctrNarr.value.trim() : ctrNarr.value;

        if ((this.recordSelected(false, true) && this.updateMode) || this.addMode) {
            if (!oRate || !oNarr) {

                this.queryAccount = new URLSearchParams();
                if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
                    this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
                    this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
                } else {
                    this.queryAccount.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
                    this.queryAccount.set(this.serviceConstants.CountryCode, this.defaultCode.country);
                }
                this.queryAccount.set(this.serviceConstants.Action, '6');

                let postObj = {
                    'Function': 'GetDefaultDiscountDetails',
                    'DiscountTypeCode': cDiscountType
                };
                this.ajaxSource.next(this.ajaxconstant.START);
                this.httpService.makePostRequest(this.method, this.module, this.operation, this.queryAccount, postObj).subscribe(
                    (e) => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        if (e.status === 'failure') {
                            this.errorService.emitError(e.oResponse);
                        } else {
                            if (e) {
                                if (!oRate) {
                                    ctrRate.setValue(e.DiscountRate);
                                }
                                if (!oNarr) {
                                    ctrNarr.setValue(e.DiscountNarr);
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

    private recordSelected(arg1: boolean, arg2: boolean = false): Boolean {

        if (this.storeData && this.storeData['data']) {
            return true;
        }
        return false;
    }

    public onFocus(controlName: any): void {

        switch (controlName) {
            case 'PromptPaymentRate':
            case 'RetrospectiveRate':
            case 'InvoiceDiscountRate':
                if (controlName && this.discountsFormGroup.controls.hasOwnProperty(controlName)) {
                    let val = this.discountsFormGroup.controls[controlName].value;
                    if (val) {
                        let data = val ? this.utilService.cCur(val) : val;
                        data = (data.toString() === 'NaN') ? '' : data;
                        this.discountsFormGroup.controls[controlName].setValue(data);
                        this.discountsFormGroup.controls[controlName].updateValueAndValidity();
                    }
                }

                break;
        }
    }
}
