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
    selector: 'icabs-account-maintenance-invoicetext',
    templateUrl: 'InvoiceText.html'
})

export class InvoiceTextComponent implements OnInit {
    public inputParams: any = { 'parentMode': 'Contract-Search', 'ContractTypeCode': 'J', 'businessCode': 'D' };
    public storeSubscription: Subscription;
    public invoiceTextFormGroup: FormGroup;


    public fieldDisabled: any = {
        'BtnSendToNAV': false,
        'cmdGetAddress': false,
        'cmdSetInvoiceGroupDefault': false,
        'cmdSetInvoiceGroupEDI': false,
        'selMandateTypeCode': false,
        'cmdGenerateNew': false
    };

    public fieldVisibility: any = {
        'CurrentInvoiceGroups': true,
        'InvoiceNarrativeSL': true,
        'CommonStatement': true,
        'CreateNewInvoiceGroupInd': true,
        'OutsortInvoiceDefaultInd': true
    };

    public fieldRequired: any = {
        'isInvoiceNarrativeSLRequired': false,
        'isDedicatedContactProcedureIndRequired': false,
        'isCommonStatementRequired': false,
        'isInSightAccountIndRequired': false,
        'isCreateNewInvoiceGroupIndRequired': false,
        'isInterGroupAccountRequired': false,
        'isOutsortInvoiceDefaultIndRequired': false,
        'isExternalReferenceRequired': false,
        'isAccountInvoiceText1': false,
        'isAccountInvoiceText2': false,
        'isAccountInvoiceText3': false,
        'isAccountInvoiceText4': false,
        'isAccountInvoiceText5': false,
        'isAccountInvoiceText6': false,
        'isGroupAccountNumberRequired': false
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

    private thInformation: string = '';

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
        private logger: Logger,
        private utilService: Utils
    ) {
        this.invoiceTextFormGroup = this.fb.group({
            CurrentInvoiceGroups: [{ value: '', disabled: true }],
            InvoiceNarrativeSL: [{ value: '', disabled: true }],
            CommonStatement: [{ value: '', disabled: true }],
            CreateNewInvoiceGroupInd: [{ value: '', disabled: true }],
            OutsortInvoiceDefaultInd: [{ value: '', disabled: true }],
            AccountInvoiceText1: [{ value: '', disabled: true }],
            AccountInvoiceText2: [{ value: '', disabled: true }],
            AccountInvoiceText3: [{ value: '', disabled: true }],
            AccountInvoiceText4: [{ value: '', disabled: true }],
            AccountInvoiceText5: [{ value: '', disabled: true }],
            AccountInvoiceText6: [{ value: '', disabled: true }],
            CrossReferenceAccountNumber: [{ value: '', disabled: true }],
            CrossReferenceAccountName: [{ value: '', disabled: true }],
            ValidationExemptInd: [{ value: '', disabled: true }],
            NewInvoiceGroupInd: [{ value: '', disabled: true }],
            cmdSetInvoiceGroupDefault: [{ value: 'Apply to all Invoice Groups', disabled: true }]
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
                        if (typeof (data['validate'].invoiceText) !== 'undefined') {
                            this.validateForm();
                        }
                        break;
                    case AccountMaintenanceActionTypes.LOAD_FORM_GROUP:
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
        this.defaultCode.country = this.utilService.getCountryCode();
        this.defaultCode.business = this.utilService.getBusinessCode();

        this.dispathFormGroup();
    }

    public dispathFormGroup(): void {
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                invoiceText: this.invoiceTextFormGroup
            }
        });

        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                invoiceText: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                invoiceText: this.fieldVisibility
            }
        });
    }

    public setFormData(data: any): void {
        this.invoiceTextFormGroup.controls['CurrentInvoiceGroups'].setValue(data['data'].CurrentInvoiceGroups);
        this.invoiceTextFormGroup.controls['InvoiceNarrativeSL'].setValue(this.isCheckBoxChecked(data['data'].InvoiceNarrativeSL));
        this.invoiceTextFormGroup.controls['CommonStatement'].setValue(this.isCheckBoxChecked(data['data'].CommonStatement));
        this.invoiceTextFormGroup.controls['CreateNewInvoiceGroupInd'].setValue(this.isCheckBoxChecked(data['data'].CreateNewInvoiceGroupInd));
        this.invoiceTextFormGroup.controls['OutsortInvoiceDefaultInd'].setValue(this.isCheckBoxChecked(data['data'].OutsortInvoiceDefaultInd));
        this.invoiceTextFormGroup.controls['AccountInvoiceText1'].setValue(data['data'].AccountInvoiceText1);
        this.invoiceTextFormGroup.controls['AccountInvoiceText2'].setValue(data['data'].AccountInvoiceText2);
        this.invoiceTextFormGroup.controls['AccountInvoiceText3'].setValue(data['data'].AccountInvoiceText3);
        this.invoiceTextFormGroup.controls['AccountInvoiceText4'].setValue(data['data'].AccountInvoiceText4);
        this.invoiceTextFormGroup.controls['AccountInvoiceText5'].setValue(data['data'].AccountInvoiceText5);
        this.invoiceTextFormGroup.controls['AccountInvoiceText6'].setValue(data['data'].AccountInvoiceText6);
        this.invoiceTextFormGroup.updateValueAndValidity();
    }

    private isCheckBoxChecked(arg: any): boolean {
        if (typeof arg === 'boolean' || (typeof arg === 'object' && typeof arg.valueOf() === 'boolean'))
            return arg;

        return (arg) ? (((arg.toLowerCase() === 'false') || (arg.toLowerCase() === 'f') || (arg.toLowerCase() === 'no')) ? false : true) : false;
    }

    public validateForm(): void {
        for (let j in this.fieldVisibility) {
            if (j) {
                let key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.invoiceTextFormGroup.controls[key]) {
                        this.invoiceTextFormGroup.controls[key].clearValidators();
                    }
                }
            }

        }
        for (let i in this.invoiceTextFormGroup.controls) {
            if (this.invoiceTextFormGroup.controls[i].enabled) {
                this.invoiceTextFormGroup.controls[i].markAsTouched();
            } else {
                this.invoiceTextFormGroup.controls[i].clearValidators();
            }
        }
        this.invoiceTextFormGroup.updateValueAndValidity();

        let formValid = null;
        if (!this.invoiceTextFormGroup.enabled) {
            formValid = true;
        } else {
            formValid = this.invoiceTextFormGroup.valid;
        }
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                invoiceText: this.invoiceTextFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                invoiceText: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                invoiceText: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_VALIDITY, payload: {
                invoiceText: formValid
            }
        });
    }

    public processForm(): any {

        this.invoiceTextFormGroup.controls['cmdSetInvoiceGroupDefault'].disable();

        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            this.invoiceTextFormGroup.controls['CurrentInvoiceGroups'].enable();
            this.invoiceTextFormGroup.controls['InvoiceNarrativeSL'].enable();
            this.invoiceTextFormGroup.controls['CommonStatement'].enable();
            this.invoiceTextFormGroup.controls['CreateNewInvoiceGroupInd'].enable();
            this.invoiceTextFormGroup.controls['OutsortInvoiceDefaultInd'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText1'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText2'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText3'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText4'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText5'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText6'].enable();

            this.fieldVisibility.CurrentInvoiceGroups = false;
        }

        if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
            this.invoiceTextFormGroup.controls['CurrentInvoiceGroups'].disable();
            this.invoiceTextFormGroup.controls['InvoiceNarrativeSL'].disable();
            this.invoiceTextFormGroup.controls['CommonStatement'].disable();
            this.invoiceTextFormGroup.controls['CreateNewInvoiceGroupInd'].disable();
            this.invoiceTextFormGroup.controls['OutsortInvoiceDefaultInd'].disable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText1'].disable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText2'].disable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText3'].disable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText4'].disable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText5'].disable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText6'].disable();

            this.fieldVisibility.CurrentInvoiceGroups = false;
        }

        if (this.mode['addMode'] && !this.mode['searchMode'] && !this.mode['updateMode']) {
            this.invoiceTextFormGroup.controls['CurrentInvoiceGroups'].enable();
            this.invoiceTextFormGroup.controls['InvoiceNarrativeSL'].enable();
            this.invoiceTextFormGroup.controls['CommonStatement'].enable();
            this.invoiceTextFormGroup.controls['CreateNewInvoiceGroupInd'].enable();
            this.invoiceTextFormGroup.controls['OutsortInvoiceDefaultInd'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText1'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText2'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText3'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText4'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText5'].enable();
            this.invoiceTextFormGroup.controls['AccountInvoiceText6'].enable();
            this.invoiceTextFormGroup.controls['CurrentInvoiceGroups'].setValue('');
            this.invoiceTextFormGroup.controls['InvoiceNarrativeSL'].setValue('');
            this.invoiceTextFormGroup.controls['CommonStatement'].setValue('');
            this.invoiceTextFormGroup.controls['CreateNewInvoiceGroupInd'].setValue(false);
            this.invoiceTextFormGroup.controls['OutsortInvoiceDefaultInd'].setValue(false);
            this.invoiceTextFormGroup.controls['AccountInvoiceText1'].setValue('');
            this.invoiceTextFormGroup.controls['AccountInvoiceText2'].setValue('');
            this.invoiceTextFormGroup.controls['AccountInvoiceText3'].setValue('');
            this.invoiceTextFormGroup.controls['AccountInvoiceText4'].setValue('');
            this.invoiceTextFormGroup.controls['AccountInvoiceText5'].setValue('');
            this.invoiceTextFormGroup.controls['AccountInvoiceText6'].setValue('');

            this.fieldVisibility.CurrentInvoiceGroups = true;
        }
        this.invoiceTextFormGroup.updateValueAndValidity();
    }

    public onCmdSetInvoiceGroupDefaultClick(): any {
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
            'AccountNumber': (this.storeData['data'] && this.storeData['data'].AccountNumber) ? this.storeData['data'].AccountNumber : '',
            'Function': 'SetInvoiceGroupsToDefault',
            'OutsortInvoice': (this.invoiceTextFormGroup.controls['OutsortInvoiceDefaultInd'].value) ? 'True' : 'False'
        };

        this.httpService.makePostRequest(this.method, this.module, this.operation, this.queryAccount, postObj).subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    let returnObj = { 'ReturnHTML': e.ReturnHTML, 'trInformation': true };
                    this.store.dispatch({ type: AccountMaintenanceActionTypes.SAVE_RETURN_HTML, payload: JSON.parse(JSON.stringify(returnObj)) });
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }

}
