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
    selector: 'icabs-account-maintenance-ediinvoicing',
    templateUrl: 'EDIInvoicing.html'
})

export class EDIInvoicingComponent implements OnInit {
    public inputParams: any = { 'parentMode': 'Contract-Search', 'ContractTypeCode': 'J', 'businessCode': 'D' };
    public storeSubscription: Subscription;
    public ediInvoicingFormGroup: FormGroup;



    public internalFieldStatus: any = {
        'fieldDisabled': null,
        'fieldVisibility': null,
        'fieldRequired': null,
        'sysCharParams': null,
        'virtualTableField': null,
        'otherParams': null
    };

    public fieldDisabled: any = {
        'cmdSetInvoiceGroupEDI': false
    };

    public fieldVisibility: any = {
        'trInformationEDI': false
    };

    public fieldRequired: any = {

        'isEDIPartnerAccountCode': false,
        'isEDIPartnerANANumber': false
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

    public queryAccount: URLSearchParams;
    public currentMode: string;

    public method: string = 'contract-management/maintenance';
    public module: string = 'account';
    public operation: string = 'Application/iCABSAAccountMaintenance';
    public contentType: string = 'application/x-www-form-urlencoded';
    public thInformationEDI: string = '';

    public defaultCode: any = {
        country: '',
        business: '',
        BranchNumber: ''
    };

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
        this.ediInvoicingFormGroup = this.fb.group({
            EDIPartnerAccountCode: [{ value: '', disabled: true }],
            EDIPartnerANANumber: [{ value: '', disabled: true }],
            cmdSetInvoiceGroupEDI: [{ value: 'Apply to all Invoice Groups', disabled: true }]
            //thInformationEDI: [{ value: '', disabled: true }]
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
                        break;
                    case AccountMaintenanceActionTypes.FORM_INIT:
                        break;
                    case AccountMaintenanceActionTypes.SAVE_VIRTUAL_TABLE_DATA:
                        this.virtualTableField = data['virtualTableData'];

                        break;
                    case AccountMaintenanceActionTypes.VALIDATE_FORMS:
                        if (typeof (data['validate'].ediInvoicing) !== 'undefined') {
                            this.validateForm();
                        }
                        break;
                    case AccountMaintenanceActionTypes.LOAD_FORM_GROUP:

                        break;
                    case AccountMaintenanceActionTypes.BEFORE_ADD:
                        this.ediInvoicingFormGroup.controls['cmdSetInvoiceGroupEDI'].disable();
                        this.ediInvoicingFormGroup.updateValueAndValidity();
                        break;
                    default:
                        break;
                }
            }

        });

    }

    ngOnInit(): void {
        String.prototype['capitalizeFirstLetter'] = function (): string {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };

        this.defaultCode.country = this.utilService.getCountryCode();
        this.defaultCode.business = this.utilService.getBusinessCode();
        this.dispathFormGroup();
    }

    public setFormData(data: any): void {

        this.ediInvoicingFormGroup.controls['EDIPartnerAccountCode'].setValue(data['data'].EDIPartnerAccountCode);
        this.ediInvoicingFormGroup.controls['EDIPartnerANANumber'].setValue(data['data'].EDIPartnerANANumber);
    }

    public dispathFormGroup(): void {
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                ediInvoicing: this.ediInvoicingFormGroup
            }
        });

        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                ediInvoicing: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                ediInvoicing: this.fieldVisibility
            }
        });
    }

    public validateForm(): void {
        for (let j in this.fieldVisibility) {
            if (j) {
                let key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.ediInvoicingFormGroup.controls[key]) {
                        this.ediInvoicingFormGroup.controls[key].clearValidators();
                    }
                }
            }

        }
        for (let i in this.ediInvoicingFormGroup.controls) {
            if (this.ediInvoicingFormGroup.controls[i].enabled) {
                this.ediInvoicingFormGroup.controls[i].markAsTouched();
            } else {
                this.ediInvoicingFormGroup.controls[i].clearValidators();
            }
        }
        this.ediInvoicingFormGroup.updateValueAndValidity();

        let formValid = null;
        if (!this.ediInvoicingFormGroup.enabled) {
            formValid = true;
        } else {
            formValid = this.ediInvoicingFormGroup.valid;
        }
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                ediInvoicing: this.ediInvoicingFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                ediInvoicing: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                ediInvoicing: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_VALIDITY, payload: {
                ediInvoicing: formValid
            }
        });
    }


    public processForm(): void {
        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            this.ediInvoicingFormGroup.controls['EDIPartnerAccountCode'].enable();
            this.ediInvoicingFormGroup.controls['EDIPartnerANANumber'].enable();
            this.thInformationEDI = '';
        }

        if (this.mode['searchMode'] && !this.mode['addMode'] && !this.mode['updateMode']) {
            this.ediInvoicingFormGroup.controls['EDIPartnerAccountCode'].disable();
            this.ediInvoicingFormGroup.controls['EDIPartnerANANumber'].disable();
            this.ediInvoicingFormGroup.controls['cmdSetInvoiceGroupEDI'].disable();
            this.thInformationEDI = '';
            //this.fieldDisabled.cmdSetInvoiceGroupEDI = true;
        }

        if (this.mode['addMode'] && !this.mode['updateMode'] && !this.mode['searchMode']) {
            this.ediInvoicingFormGroup.controls['EDIPartnerAccountCode'].enable();
            this.ediInvoicingFormGroup.controls['EDIPartnerANANumber'].enable();
            this.ediInvoicingFormGroup.controls['EDIPartnerAccountCode'].setValue('');
            this.ediInvoicingFormGroup.controls['EDIPartnerANANumber'].setValue('');
            this.ediInvoicingFormGroup.controls['cmdSetInvoiceGroupEDI'].enable();
            this.thInformationEDI = '';
        }

        this.ediInvoicingFormGroup.updateValueAndValidity();
    }

    public onCmdSetInvoiceGroupEDIClick(): any {
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
            'AccountNumber': this.storeData['data'].AccountNumber,
            'Function': 'SetInvoiceGroupEDI'
        };

        this.httpService.makePostRequest(this.method, this.module, this.operation, this.queryAccount, postObj).subscribe(
            (e) => {
                if (e.status === 'failure') {
                    //this.errorService.emitError(e.oResponse);
                } else {
                    this.thInformationEDI = e.ReturnHTML;
                    this.fieldVisibility.trInformationEDI = true;
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );

    }

    public RecordSelected(obj: any): boolean {
        if (this.storeData && this.storeData['data']) {
            return true;
        }
        return false;
    }

}
