import { Utils } from './../../../../shared/services/utility';
import { ActualVsContractualBranchComponent } from './../../../bill-to-cash/Portfolio/iCABSSeActualVsContractualBranch';
import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';
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
    selector: 'icabs-account-maintenance-telesales',
    templateUrl: 'Telesales.html'
})

export class TelesalesComponent implements OnInit {
    @ViewChild('crossReferenceAccountNumberEllipsis') crossReferenceAccountNumberEllipsis: EllipsisComponent;

    public inputParams: any = {
        'parentMode': 'LookUp-CrossReference',
        'ContractTypeCode': '',
        'businessCode': '',
        'countryCode': '',
        'showAddNewDisplay': false,
        'groupAccountNumber': '',
        'groupName': '',
        'showCountryCode': false,
        'showBusinessCode': false
    };
    public storeSubscription: Subscription;
    public telesalesFormGroup: FormGroup;

    public accountSearchComponent = AccountSearchComponent;
    public isContractEllipsisDisabled: boolean = true;

    public fieldDisabled: any = {
        'BtnSendToNAV': false,
        'cmdGetAddress': false,
        'cmdSetInvoiceGroupDefault': false,
        'cmdSetInvoiceGroupEDI': false,
        'selMandateTypeCode': false,
        'cmdGenerateNew': false
    };

    public fieldVisibility: any = {
        'ValidationExemptInd': true,
        'NewInvoiceGroupInd': true

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
        'isAccountOwningBranchRequired': true,

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

    public zipSearchComponent = PostCodeSearchComponent;
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
    public autoOpenSearch: boolean = false;

    public queryAccount: URLSearchParams;

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
        public utilService: Utils,
        private logger: Logger
    ) {
        this.telesalesFormGroup = this.fb.group({
            CrossReferenceAccountNumber: [{ value: '', disabled: true }],
            CrossReferenceAccountName: [{ value: '', disabled: true }],
            ValidationExemptInd: [{ value: '', disabled: true }],
            NewInvoiceGroupInd: [{ value: '', disabled: true }]
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
                        this.initPage();
                        break;
                    case AccountMaintenanceActionTypes.FORM_INIT:
                        break;
                    case AccountMaintenanceActionTypes.SAVE_VIRTUAL_TABLE_DATA:
                        this.virtualTableField = data['virtualTableData'];
                        this.telesalesFormGroup.controls['CrossReferenceAccountName'].setValue(this.virtualTableField.CrossReferenceAccountName);
                        this.telesalesFormGroup.updateValueAndValidity();
                        break;
                    case AccountMaintenanceActionTypes.VALIDATE_FORMS:
                        //if (data['validate'].teleSales) {
                        if (typeof (data['validate'].teleSales) !== 'undefined') {
                            this.validateForm();
                        }
                        break;
                    case AccountMaintenanceActionTypes.LOAD_FORM_GROUP:
                        break;
                    case AccountMaintenanceActionTypes.TAB_CHANGE:
                        this.inputParams.businessCode = this.utilService.getBusinessCode();
                        this.inputParams.countryCode = this.utilService.getCountryCode();
                        if (this.storeData && this.storeData['formGroup'] && this.storeData['formGroup'].general && this.storeData['formGroup'].general !== false) {
                            if (this.storeData['formGroup']['general'].controls.hasOwnProperty('GroupAccountNumber')) {
                                this.inputParams.groupAccountNumber = this.storeData['formGroup'].general.controls['GroupAccountNumber'].value;
                            }
                            if (this.storeData['formGroup']['general'].controls.hasOwnProperty('GroupName')) {
                                this.inputParams.groupName = this.storeData['formGroup'].general.controls['GroupName'].value;
                            }
                        }

                        if (this.crossReferenceAccountNumberEllipsis && typeof this.crossReferenceAccountNumberEllipsis !== 'undefined') {
                            this.crossReferenceAccountNumberEllipsis.configParams = this.inputParams;
                            this.crossReferenceAccountNumberEllipsis.updateComponent();
                        }
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

        this.dispathFormGroup();
    }

    public initPage(): void {
        if (this.storeData && this.storeData['formGroup'] && this.storeData['formGroup'].general && this.storeData['formGroup'].general !== false) {
            if (this.storeData['formGroup']['general'].controls.hasOwnProperty('GroupAccountNumber')) {
                this.inputParams.groupAccountNumber = this.storeData['formGroup'].general.controls['GroupAccountNumber'].value;
            }
            if (this.storeData['formGroup']['general'].controls.hasOwnProperty('GroupName')) {
                this.inputParams.groupName = this.storeData['formGroup'].general.controls['GroupName'].value;
            }
        }
    }

    public dispathFormGroup(): void {
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                teleSales: this.telesalesFormGroup
            }
        });

        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                teleSales: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                teleSales: this.fieldVisibility
            }
        });
    }

    public setFormData(data: any): void {
        this.telesalesFormGroup.controls['CrossReferenceAccountNumber'].setValue(data['data'].CrossReferenceAccountNumber);
        this.telesalesFormGroup.controls['CrossReferenceAccountName'].setValue(data['data'].CrossReferenceAccountName);
        this.telesalesFormGroup.controls['ValidationExemptInd'].setValue(this.isCheckBoxChecked(data['data'].ValidationExemptInd));
        this.telesalesFormGroup.controls['NewInvoiceGroupInd'].setValue(this.isCheckBoxChecked(data['data'].NewInvoiceGroupInd));
        this.telesalesFormGroup.updateValueAndValidity();
    }

    public validateForm(): void {
        for (let j in this.fieldVisibility) {
            if (j) {
                let key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.telesalesFormGroup.controls[key]) {
                        this.telesalesFormGroup.controls[key].clearValidators();
                    }
                }
            }

        }

        for (let i in this.telesalesFormGroup.controls) {
            if (this.telesalesFormGroup.controls[i].enabled) {
                this.telesalesFormGroup.controls[i].markAsTouched();
            } else {
                this.telesalesFormGroup.controls[i].clearValidators();
            }
        }
        this.telesalesFormGroup.updateValueAndValidity();

        let formValid = null;
        if (!this.telesalesFormGroup.enabled) {
            formValid = true;
        } else {
            formValid = this.telesalesFormGroup.valid;
        }
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                teleSales: this.telesalesFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                teleSales: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                teleSales: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_VALIDITY, payload: {
                teleSales: formValid
            }
        });
    }

    private isCheckBoxChecked(arg: any): boolean {
        if (typeof arg === 'boolean' || (typeof arg === 'object' && typeof arg.valueOf() === 'boolean'))
            return arg;

        return (arg) ? (((arg.toLowerCase() === 'false') || (arg.toLowerCase() === 'f') || (arg.toLowerCase() === 'no')) ? false : true) : false;
    }

    public processForm(): any {
        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            this.telesalesFormGroup.controls['CrossReferenceAccountNumber'].enable();
            this.telesalesFormGroup.controls['CrossReferenceAccountName'].disable();
            this.telesalesFormGroup.controls['ValidationExemptInd'].enable();
            this.telesalesFormGroup.controls['NewInvoiceGroupInd'].enable();
            this.isContractEllipsisDisabled = false;
        }

        if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
            this.telesalesFormGroup.controls['CrossReferenceAccountNumber'].disable();
            this.telesalesFormGroup.controls['CrossReferenceAccountName'].disable();
            this.telesalesFormGroup.controls['ValidationExemptInd'].disable();
            this.telesalesFormGroup.controls['NewInvoiceGroupInd'].disable();
            this.isContractEllipsisDisabled = true;
        }

        if (this.mode['addMode'] && !this.mode['searchMode'] && !this.mode['updateMode']) {
            this.telesalesFormGroup.controls['CrossReferenceAccountNumber'].enable();
            this.telesalesFormGroup.controls['CrossReferenceAccountName'].disable();
            this.telesalesFormGroup.controls['ValidationExemptInd'].enable();
            this.telesalesFormGroup.controls['NewInvoiceGroupInd'].enable();
            this.telesalesFormGroup.controls['CrossReferenceAccountNumber'].setValue('');
            this.telesalesFormGroup.controls['CrossReferenceAccountName'].setValue('');
            this.telesalesFormGroup.controls['ValidationExemptInd'].setValue('');
            this.telesalesFormGroup.controls['NewInvoiceGroupInd'].setValue('');
            this.isContractEllipsisDisabled = false;
        }
        this.telesalesFormGroup.updateValueAndValidity();
    }

    public onAccountMaintenanceDataReceived(data: any, route: any): void {
        if (data) {
            this.telesalesFormGroup.controls['CrossReferenceAccountNumber'].setValue(data.AccountNumber);
            this.telesalesFormGroup.controls['CrossReferenceAccountName'].setValue(data.AccountName);
            this.telesalesFormGroup.updateValueAndValidity();
        }
    }
    public modalHidden(): void {
        //TODO:
    }
}
