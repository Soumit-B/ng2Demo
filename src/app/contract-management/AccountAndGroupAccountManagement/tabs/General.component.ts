import { AccountBusinessTypeSearchComponent } from './../../../internal/search/iCABSSAccountBusinessTypeSearch/iCABSSAccountBusinessTypeSearch';
import { Utils } from './../../../../shared/services/utility';
import { AccountHistoryGridComponent } from './../../../internal/grid-search/iCABSAAccountHistoryGrid';
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
import { ContractManagementModuleRoutes } from '../../../base/PageRoutes';

@Component({
    selector: 'icabs-account-maintenance-general',
    templateUrl: 'General.html'
})

export class GeneralComponent implements OnInit, AfterViewInit {
    public inputParams: any = { 'parentMode': 'Contract-Search', 'ContractTypeCode': '', 'businessCode': '' };
    public storeSubscription: Subscription;
    public generalComponentFormGroup: FormGroup;
    public inputParamsLogoTypeSearch: any = {};
    public isLogoTypeDisabled: boolean = false;
    public selectedLogoType: any;


    public fieldDisabled: any = {
        'BtnSendToNAV': false,
        'cmdGetAddress': false,
        'cmdSetInvoiceGroupDefault': false,
        'cmdSetInvoiceGroupEDI': false,
        'selMandateTypeCode': false,
        'cmdGenerateNew': false
    };

    public fieldVisibility: any = {
        'NationalAccount': true,
        'DedicatedContactProcedureInd': true,
        'InSightAccountInd': true,
        'InterGroupAccount': true,
        'VATExempt': true,
        'ExcludePDADebtInd': true,
        'AccountBusinessTypeCode': true,
        'AccountBusinessTypeDesc': true,

        'GroupAccountNumber': true,
        'GroupName': true,

        'PriceListInd': true,

        'LogoTypeCode': true,
        'LogoTypeDesc': true,

        'ExternalReference': true,
        'AccountBalance': true,
        'BadDebtAccount': true,
        'BadDebtNarrative': true,
        'LiveAccount': true,
        'IncludeMarketingCampaign': true,

        'trVATExempt': true,
        'trExcludePDADebt': true,
        'trInformation': false,
        'vSCGroupAccount': false
    };


    public fieldRequired: any = {
        'isNationalAccountRequired': false,
        'isDedicatedContactProcedureIndRequired': false,
        'isCommonStatementRequired': false,
        'isInSightAccountIndRequired': false,
        'isCreateNewInvoiceGroupIndRequired': false,
        'isInterGroupAccountRequired': false,
        'isOutsortInvoiceDefaultIndRequired': false,
        'isExternalReferenceRequired': false,
        'isLogoTypeCodeRequired': false
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

    public defaultCode: any = {
        country: '',
        business: '',
        BranchNumber: ''
    };

    public countrySelected: Object = {
        id: '',
        text: ''
    };

    public branchList: Array<any> = [];
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

    public method: string = 'contract-management/maintenance';
    public module: string = 'account';
    public operation: string = 'Application/iCABSAAccountMaintenance';
    public contentType: string = 'application/x-www-form-urlencoded';

    public groupAccountNumberAutoOpen: boolean = false;
    public inputParamsGroupAccountNumber: any = { 'parentMode': 'LookUp', 'showAddNew': true };
    public groupAccountNumberComponent = GroupAccountNumberComponent;
    public isGroupAccountNumberEllipsisDisabled: boolean = false;

    public logoTypeCodeAutoOpen: boolean = false;
    public inputParamsLogoTypeCode: any = { 'parentMode': 'LookUp' };
    public logoTypeCoderComponent = GroupAccountNumberComponent;


    public ellipsis = {
        accountBusinessTypeSearch: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'LookUp-Account',
            component: AccountBusinessTypeSearchComponent
        }
    };


    public currentMode: string;
    public thInformation: string = '';

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
        this.generalComponentFormGroup = this.fb.group({
            NationalAccount: [{ value: true, disabled: true }],
            DedicatedContactProcedureInd: [{ value: false, disabled: true }],
            InSightAccountInd: [{ value: false, disabled: true }],
            InterGroupAccount: [{ value: '', disabled: true }],
            VATExempt: [{ value: '', disabled: true }],
            ExcludePDADebtInd: [{ value: '', disabled: true }],
            AccountBusinessTypeCode: [{ value: '', disabled: true }],
            AccountBusinessTypeDesc: [{ value: '', disabled: true }],
            GroupAccountNumber: [{ value: '', disabled: true }],
            GroupName: [{ value: '', disabled: true }],
            PriceListInd: [{ value: '', disabled: true }],
            LogoTypeCode: [{ value: '', disabled: true }],
            LogoTypeDesc: [{ value: '', disabled: true }],
            ExternalReference: [{ value: '', disabled: true }],
            AccountBalance: [{ value: '', disabled: true }],
            BadDebtAccount: [{ value: '', disabled: true }],
            BadDebtNarrative: [{ value: '', disabled: true }],
            LiveAccount: [{ value: '', disabled: true }],
            IncludeMarketingCampaign: [{ value: '', disabled: true }]
        });


        this.storeSubscription = store.select('accountMaintenance').subscribe(data => {
            if (data && data['action']) {
                this.storeData = data;
                this.params = data['params'];
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
                        if (data['syschars'] && !(Object.keys(data['syschars']).length === 0 && data['syschars'].constructor === Object)) {
                            this.sysCharParams = data['syschars'];
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_PROCESSED_SYSCHAR:
                        if (data['processedSysChar'] && !(Object.keys(data['processedSysChar']).length === 0 && data['processedSysChar'].constructor === Object)) {
                            this.sysCharParams = data['processedSysChar'];
                        }
                        break;
                    case AccountMaintenanceActionTypes.FORM_INIT:
                        break;
                    case AccountMaintenanceActionTypes.SAVE_VIRTUAL_TABLE_DATA:
                        this.virtualTableField = data['virtualTableData'];
                        this.generalComponentFormGroup.controls['GroupName'].setValue(this.virtualTableField.GroupName);
                        this.generalComponentFormGroup.controls['AccountBusinessTypeDesc'].setValue(this.virtualTableField.AccountBusinessTypeDesc);
                        this.generalComponentFormGroup.controls['LogoTypeDesc'].setValue(this.virtualTableField.LogoTypeDesc);
                        if (this.generalComponentFormGroup.controls['LogoTypeCode'].value) {
                            let logoTypeCode = this.generalComponentFormGroup.controls['LogoTypeCode'].value;
                            let logoTypeDesc = this.generalComponentFormGroup.controls['LogoTypeDesc'].value;
                            this.zone.run(() => {
                                this.selectedLogoType = { text: (logoTypeDesc) ? logoTypeCode + ' - ' + logoTypeDesc : logoTypeCode };
                            });
                        }

                        break;
                    case AccountMaintenanceActionTypes.SAVE_RETURN_HTML:
                        let returnHtmlObj = data['returnHtml'];
                        if (returnHtmlObj) {
                            this.zone.run(() => {
                                this.thInformation = returnHtmlObj['ReturnHTML'];
                                this.fieldVisibility.trInformation = returnHtmlObj['trInformation'];
                            });
                        }
                        break;
                    case AccountMaintenanceActionTypes.VALIDATE_FORMS:
                        if (typeof (data['validate'].general) !== 'undefined') {
                            this.validateForm();
                        }
                        break;
                    case AccountMaintenanceActionTypes.LOAD_FORM_GROUP:
                        this.dispathFormGroup();
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

        this.fetchBranchDetails();
        this.dispathFormGroup();

    }

    public ngAfterViewInit(): void {
        //TODO:
    }

    public dispathFormGroup(): void {
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                general: this.generalComponentFormGroup
            }
        });

        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                general: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                general: this.fieldVisibility
            }
        });
    }


    public setFormData(data: any): void {
        if (!data['data']) return;

        this.generalComponentFormGroup.controls['NationalAccount'].setValue(this.isCheckBoxChecked(data['data'].NationalAccount));
        this.generalComponentFormGroup.controls['DedicatedContactProcedureInd'].setValue(this.isCheckBoxChecked(data['data'].DedicatedContactProcedureInd));
        this.generalComponentFormGroup.controls['InSightAccountInd'].setValue(this.isCheckBoxChecked(data['data'].InSightAccountInd));
        this.generalComponentFormGroup.controls['InterGroupAccount'].setValue(this.isCheckBoxChecked(data['data'].InterGroupAccount));
        this.generalComponentFormGroup.controls['VATExempt'].setValue(this.isCheckBoxChecked(data['data'].VATExempt));
        this.generalComponentFormGroup.controls['ExcludePDADebtInd'].setValue(this.isCheckBoxChecked(data['data'].ExcludePDADebtInd));
        this.generalComponentFormGroup.controls['AccountBusinessTypeCode'].setValue(data['data'].AccountBusinessTypeCode);
        this.generalComponentFormGroup.controls['AccountBusinessTypeDesc'].setValue(data['data'].AccountBusinessTypeDesc);

        this.generalComponentFormGroup.controls['GroupAccountNumber'].setValue(data['data'].GroupAccountNumber);
        this.generalComponentFormGroup.controls['GroupName'].setValue(this.virtualTableField.GroupName);

        this.generalComponentFormGroup.controls['PriceListInd'].setValue(this.isCheckBoxChecked(data['data'].PriceListInd));

        this.generalComponentFormGroup.controls['LogoTypeCode'].setValue(data['data'].LogoTypeCode);
        this.generalComponentFormGroup.controls['LogoTypeDesc'].setValue(data['data'].LogoTypeDesc);

        this.zone.run(() => {
            let logoTypeCode = this.generalComponentFormGroup.controls['LogoTypeCode'].value;
            let logoTypeDesc = this.generalComponentFormGroup.controls['LogoTypeDesc'].value;
            logoTypeDesc = logoTypeDesc ? logoTypeDesc : '';
            let text = (logoTypeCode && logoTypeDesc) ? (logoTypeCode + ' - ' + logoTypeDesc) : logoTypeCode;
            this.selectedLogoType = { text: text };
        });

        this.generalComponentFormGroup.controls['ExternalReference'].setValue(data['data'].ExternalReference);
        this.generalComponentFormGroup.controls['AccountBalance'].setValue(data['data'].AccountBalance ? this.utilService.cCur(data['data'].AccountBalance) : data['data'].AccountBalance);
        this.generalComponentFormGroup.controls['BadDebtAccount'].setValue(this.isCheckBoxChecked(data['data'].BadDebtAccount));
        if (this.generalComponentFormGroup.controls['BadDebtAccount'].value === true) {
            this.fieldRequired.isBadDebtNarrativeRequired = true;
            this.generalComponentFormGroup.controls['BadDebtNarrative'].setValidators(Validators.required);
        }
        else {
            this.fieldRequired.isBadDebtNarrativeRequired = false;
            this.generalComponentFormGroup.controls['BadDebtNarrative'].setErrors(null);
            this.generalComponentFormGroup.controls['BadDebtNarrative'].clearValidators();
        }
        this.generalComponentFormGroup.controls['BadDebtNarrative'].setValue(data['data'].BadDebtNarrative);
        this.generalComponentFormGroup.controls['LiveAccount'].setValue(this.isCheckBoxChecked(data['data'].LiveAccount));
        this.generalComponentFormGroup.controls['IncludeMarketingCampaign'].setValue(this.isCheckBoxChecked(data['data'].IncludeMarketingCampaign));
        this.generalComponentFormGroup.updateValueAndValidity();
    }

    private isCheckBoxChecked(arg: any): boolean {
        if (arg == null) return false;
        if (typeof arg === 'boolean' || (typeof arg === 'object' && typeof arg.valueOf() === 'boolean'))
            return arg;

        return (arg) ? (((arg.toLowerCase() === 'false') || (arg.toLowerCase() === 'f') || (arg.toLowerCase() === 'no')) ? false : true) : false;

    }

    public validateForm(): void {
        for (let j in this.fieldVisibility) {
            if (j) {
                let key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.generalComponentFormGroup.controls[key]) {
                        this.generalComponentFormGroup.controls[key].clearValidators();
                    }
                }
            }

        }
        for (let i in this.generalComponentFormGroup.controls) {
            if (this.generalComponentFormGroup.controls[i].enabled) {
                this.generalComponentFormGroup.controls[i].markAsTouched();
            } else {
                this.generalComponentFormGroup.controls[i].clearValidators();
            }
        }
        this.generalComponentFormGroup.updateValueAndValidity();

        let formValid = null;
        if (!this.generalComponentFormGroup.enabled) {
            formValid = true;
        } else {
            formValid = this.generalComponentFormGroup.valid;
        }
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                general: this.generalComponentFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                general: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                general: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_VALIDITY, payload: {
                general: formValid
            }
        });
    }

    public processForm(): void {
        this.isLogoTypeDisabled = true;

        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            this.generalComponentFormGroup.controls['NationalAccount'].enable();
            this.generalComponentFormGroup.controls['DedicatedContactProcedureInd'].enable();
            this.generalComponentFormGroup.controls['InSightAccountInd'].enable();
            this.generalComponentFormGroup.controls['InterGroupAccount'].enable();
            this.generalComponentFormGroup.controls['VATExempt'].enable();
            this.generalComponentFormGroup.controls['ExcludePDADebtInd'].enable();
            this.generalComponentFormGroup.controls['AccountBusinessTypeCode'].enable();
            this.generalComponentFormGroup.controls['AccountBusinessTypeDesc'].disable();

            this.generalComponentFormGroup.controls['GroupAccountNumber'].enable();
            this.generalComponentFormGroup.controls['GroupName'].disable();

            this.generalComponentFormGroup.controls['PriceListInd'].enable();

            this.generalComponentFormGroup.controls['LogoTypeCode'].enable();
            this.generalComponentFormGroup.controls['LogoTypeDesc'].enable();

            this.generalComponentFormGroup.controls['ExternalReference'].enable();
            this.generalComponentFormGroup.controls['AccountBalance'].enable();
            this.generalComponentFormGroup.controls['BadDebtAccount'].enable();
            this.generalComponentFormGroup.controls['BadDebtNarrative'].enable();
            this.generalComponentFormGroup.controls['LiveAccount'].enable();
            this.generalComponentFormGroup.controls['IncludeMarketingCampaign'].enable();

            this.isGroupAccountNumberEllipsisDisabled = false;
            this.isLogoTypeDisabled = false;
        }

        if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
            this.generalComponentFormGroup.controls['NationalAccount'].disable();
            this.generalComponentFormGroup.controls['DedicatedContactProcedureInd'].disable();
            this.generalComponentFormGroup.controls['InSightAccountInd'].disable();
            this.generalComponentFormGroup.controls['InterGroupAccount'].disable();
            this.generalComponentFormGroup.controls['VATExempt'].disable();
            this.generalComponentFormGroup.controls['ExcludePDADebtInd'].disable();
            this.generalComponentFormGroup.controls['AccountBusinessTypeCode'].disable();
            this.generalComponentFormGroup.controls['AccountBusinessTypeDesc'].disable();

            this.generalComponentFormGroup.controls['GroupAccountNumber'].disable();
            this.generalComponentFormGroup.controls['GroupName'].disable();

            this.generalComponentFormGroup.controls['PriceListInd'].disable();

            this.generalComponentFormGroup.controls['LogoTypeCode'].disable();
            this.generalComponentFormGroup.controls['LogoTypeDesc'].disable();

            this.generalComponentFormGroup.controls['ExternalReference'].disable();
            this.generalComponentFormGroup.controls['AccountBalance'].disable();
            this.generalComponentFormGroup.controls['BadDebtAccount'].disable();
            this.generalComponentFormGroup.controls['BadDebtNarrative'].disable();
            this.generalComponentFormGroup.controls['LiveAccount'].disable();
            this.generalComponentFormGroup.controls['IncludeMarketingCampaign'].disable();

            this.isGroupAccountNumberEllipsisDisabled = true;
            this.isLogoTypeDisabled = true;
        }

        if (this.mode['addMode'] && !this.mode['updateMode'] && !this.mode['searchMode']) {
            this.generalComponentFormGroup.controls['NationalAccount'].enable();
            this.generalComponentFormGroup.controls['DedicatedContactProcedureInd'].enable();
            this.generalComponentFormGroup.controls['InSightAccountInd'].enable();
            this.generalComponentFormGroup.controls['InterGroupAccount'].enable();
            this.generalComponentFormGroup.controls['VATExempt'].enable();
            this.generalComponentFormGroup.controls['ExcludePDADebtInd'].enable();
            this.generalComponentFormGroup.controls['AccountBusinessTypeCode'].enable();
            this.generalComponentFormGroup.controls['AccountBusinessTypeDesc'].disable();

            this.generalComponentFormGroup.controls['GroupAccountNumber'].enable();
            this.generalComponentFormGroup.controls['GroupName'].disable();

            this.generalComponentFormGroup.controls['PriceListInd'].enable();

            this.generalComponentFormGroup.controls['LogoTypeCode'].enable();
            this.generalComponentFormGroup.controls['LogoTypeDesc'].enable();

            this.generalComponentFormGroup.controls['ExternalReference'].enable();
            this.generalComponentFormGroup.controls['AccountBalance'].enable();
            this.generalComponentFormGroup.controls['BadDebtAccount'].enable();
            this.generalComponentFormGroup.controls['BadDebtNarrative'].enable();
            this.generalComponentFormGroup.controls['LiveAccount'].enable();
            this.generalComponentFormGroup.controls['IncludeMarketingCampaign'].enable();

            this.generalComponentFormGroup.controls['NationalAccount'].setValue('');
            this.generalComponentFormGroup.controls['DedicatedContactProcedureInd'].setValue('');
            this.generalComponentFormGroup.controls['InSightAccountInd'].setValue('');
            this.generalComponentFormGroup.controls['InterGroupAccount'].setValue('');
            this.generalComponentFormGroup.controls['VATExempt'].setValue('');
            this.generalComponentFormGroup.controls['ExcludePDADebtInd'].setValue('');
            this.generalComponentFormGroup.controls['AccountBusinessTypeCode'].setValue('');
            this.generalComponentFormGroup.controls['AccountBusinessTypeDesc'].setValue('');

            this.generalComponentFormGroup.controls['GroupAccountNumber'].setValue('');
            this.generalComponentFormGroup.controls['GroupName'].setValue('');

            this.generalComponentFormGroup.controls['PriceListInd'].setValue('');

            this.generalComponentFormGroup.controls['LogoTypeCode'].setValue('');
            this.generalComponentFormGroup.controls['LogoTypeDesc'].setValue('');

            this.generalComponentFormGroup.controls['ExternalReference'].setValue('');
            this.generalComponentFormGroup.controls['AccountBalance'].setValue('');
            this.generalComponentFormGroup.controls['BadDebtAccount'].setValue('');
            this.generalComponentFormGroup.controls['BadDebtNarrative'].setValue('');
            this.generalComponentFormGroup.controls['LiveAccount'].setValue('');
            this.generalComponentFormGroup.controls['IncludeMarketingCampaign'].setValue('');

            this.isGroupAccountNumberEllipsisDisabled = false;
            this.isLogoTypeDisabled = false;
        }
        this.generalComponentFormGroup.updateValueAndValidity();
    }

    onZipDataReceived(data: any): void {
        this.generalComponentFormGroup.controls['ContractPostcode'].setValue(data.Postcode);
    }

    onCountryCodeReceived(data: any): void {

        this.generalComponentFormGroup.controls['CountryDesc'].setValue(data.riCountryCode);
    }



    public fetchAccountData(functionName: any, params: any): any {
        this.queryAccount = new URLSearchParams();
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        } else {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }

        if (functionName !== '') {
            this.queryAccount.set(this.serviceConstants.Action, '6');
            this.queryAccount.set('Function', functionName);
        }
        for (let key in params) {
            if (key) {
                this.queryAccount.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.method, this.module, this.operation, this.queryAccount);
    }

    public onGroupAccountNumberDataReceived(data: any): void {
        if (data.GroupName) {
            this.generalComponentFormGroup.controls['GroupName'].setValue(data.GroupName);
        }
        this.generalComponentFormGroup.controls['GroupAccountNumber'].setValue(data.GroupAccountNumber);
        this.generalComponentFormGroup.updateValueAndValidity();
    }

    public onAccountBusinessTypeCodeDataReceived(data: any): void {
        this.generalComponentFormGroup.controls['AccountBusinessTypeCode'].setValue(data.Type);
        this.generalComponentFormGroup.controls['AccountBusinessTypeDesc'].setValue(data.Description);
    }


    public fetchBranchDetails(): void {
        let userCode = this.authService.getSavedUserCode();
        let data = [{
            'table': 'Branch',
            'query': { 'BusinessCode': this.storeData['code'].business ? this.storeData['code'].business : this.defaultCode.business },
            'fields': ['BranchNumber', 'BranchName']
        }];
        this.lookUpRecord(data, 100).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        let arr = [];
                        for (let k = 0; k < e['results'][0].length; k++) {
                            let obj = {
                                item: e['results'][0][k].BranchNumber,
                                desc: e['results'][0][k].BranchName
                            };
                            arr.push(JSON.parse(JSON.stringify(obj)));
                        }
                        this.branchList = arr;
                    }

                }

            },
            (error) => {
                //console.error(error);
            }
        );
    }

    public lookUpRecord(data: any, maxresults: any): any {
        let queryLookUp = new URLSearchParams();
        queryLookUp.set(this.serviceConstants.Action, '0');

        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            queryLookUp.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            queryLookUp.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        } else {
            queryLookUp.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            queryLookUp.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }


        if (maxresults) {
            queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(queryLookUp, data);
    }

    public postAccountEntryData(functionName: any, params: any, postdata: any): any {
        this.queryAccount = new URLSearchParams();
        this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
        this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);


        this.queryAccount.set(this.serviceConstants.Action, '0');
        if (this.storeData['data'] && this.storeData['data'].AccountNumber) {
            this.queryAccount.set('AccountNumber', this.storeData['data'].AccountNumber);
        }
        if (this.storeData['data'] && this.storeData['data'].AccountName) {
            this.queryAccount.set('AccountName', this.storeData['data'].AccountName);
        }

        if (functionName !== '') {
            this.queryAccount.set(this.serviceConstants.Action, '6');
        }
        for (let key in params) {
            if (key) {
                this.queryAccount.set(key, params[key]);
            }
        }
        return this.httpService.makePostRequest(this.method, this.module, this.operation, this.queryAccount, postdata);
    }

    public onNationalAccountClick(): void {
        this.generalComponentFormGroup.controls['ExcludePDADebtInd'].setValue(this.generalComponentFormGroup.controls['NationalAccount'].value);
        this.generalComponentFormGroup.updateValueAndValidity();
    }

    public onBadDebtAccountClick(): void {
        if (this.generalComponentFormGroup.controls['BadDebtAccount'].value === true) {
            this.fieldRequired.isBadDebtNarrativeRequired = true;
            this.generalComponentFormGroup.controls['BadDebtNarrative'].setValidators(Validators.required);
            this.generalComponentFormGroup.controls['BadDebtNarrative'].updateValueAndValidity();
        } else {
            this.fieldRequired.isBadDebtNarrativeRequired = false;
            this.generalComponentFormGroup.controls['BadDebtNarrative'].clearValidators();
            this.generalComponentFormGroup.controls['BadDebtNarrative'].updateValueAndValidity();
        }
    }

    public onLogoTypeSearchReceived(obj: any): any {
        if (obj && obj.LogoTypeCode) {
            let desc = (obj.hasOwnProperty('LogoTypeDesc') ? obj.LogoTypeDesc : obj.Object.LogoTypeDesc);
            this.selectedLogoType = { text: obj.LogoTypeCode + ' - ' + desc };
            this.generalComponentFormGroup.controls['LogoTypeCode'].setValue(obj.LogoTypeCode);
            this.generalComponentFormGroup.controls['LogoTypeDesc'].setValue(desc);
            this.generalComponentFormGroup.updateValueAndValidity();
        }
    }

    public onAccountBalanceFocus(event: any): void {
        let val = this.generalComponentFormGroup.controls['AccountBalance'].value;
        if (val) {
            let data = val ? this.utilService.cCur(val) : val;
            data = (data.toString() === 'NaN') ? '' : data;
            this.generalComponentFormGroup.controls['AccountBalance'].setValue(data);
            this.generalComponentFormGroup.controls['AccountBalance'].updateValueAndValidity();
        }
    }

    public onAddModeGroupAccountNumber(): any {
        this.router.navigate([ContractManagementModuleRoutes.ICABSSGROUPACCOUNTMAINTENANCE], { queryParams: { Mode: 'Add' } });
    }

}
