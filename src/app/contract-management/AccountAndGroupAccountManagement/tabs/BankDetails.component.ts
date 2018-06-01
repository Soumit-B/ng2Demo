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
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { GlobalizeService } from './../../../../shared/services/globalize.service';
import { CommonDropdownComponent } from './../../../../shared/components/common-dropdown/common-dropdown.component';

@Component({
    selector: 'icabs-account-maintenance-bankdetails',
    templateUrl: 'BankDetails.html',
    providers: [ErrorService, MessageService]
})

export class BankDetailsComponent implements OnInit {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptModalBankDetail') public promptModal;
    @ViewChild('bankAccountTypeCodeCommonDropDown') bankAccountTypeCodeCommonDropDown: CommonDropdownComponent;

    public storeSubscription: Subscription;
    public bankDetailsFormGroup: FormGroup;
    public showErrorHeader: any = true;
    public ajaxSource = new BehaviorSubject<any>(0);
    public translateSubscription: Subscription;
    public isRequesting: boolean = false;
    public ajaxSource$;
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
        'cmdGenerateNew': false,
        'BankAccountTypeCode': false
    };

    public fieldVisibility: any = {
        'SEPAMandateRef': true,
        'FinanceMandateRef': true,
        'MandateDate': true,
        'CurrentInvoiceGroups': true,
        'SEPADirectDebit': true
    };

    public fieldRequired: any = {
        'isBankAccountSortCodeRequired': false,
        'isBankAccountNumberRequired': false,
        'isVirtualBankAccountNumberRequired': false,
        'isBankAccountTypeCodeRequired': false,
        'isBankAccountInfoRequired': false,
        'isMandateNumberSEPARequired': false,
        'isMandateNumberFinanceRequired': false,
        'isMandateDateRequired': false,
        'isMandateTypeCodeRequired': false
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

    public iBANFlag: boolean = false;

    public zipSearchComponent = PostCodeSearchComponent;
    public inputParamsBankAccountTypeSearch: any = {
        method: 'bill-to-cash/search',
        module: 'payment',
        operation: 'System/iCABSSSystemBankAccountTypeSearch'
    };
    public bankAccountTypeActiveItem: Object = {
        id: '',
        text: ''
    };
    public bankAccountTypeSearchDisplayFields: Array<string> = ['BankAccountTypeCode', 'BankAccountTypeDesc'];

    public dtMandateDate: any;
    public idMandateDateDisabled: any = true;
    public isMandateDateRequired: any = false;
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
    public ttMandateType: any[] = [];

    public queryAccount: URLSearchParams;
    public translatedMessageList: any =
    {
        message_1: '',
        message_2: ''
    };

    public showMessageHeader: boolean = true;
    public promptTitle: string = '';
    public promptContent: string = '';

    public method: string = 'contract-management/maintenance';
    public module: string = 'account';
    public operation: string = 'Application/iCABSAAccountMaintenance';
    public contentType: string = 'application/x-www-form-urlencoded';

    constructor(
        public httpService: HttpService,
        public serviceConstants: ServiceConstants,
        public errorService: ErrorService,
        public messageService: MessageService,
        public authService: AuthService,
        public ajaxconstant: AjaxObservableConstant,
        public router: Router,
        public pageData: PageDataService,
        public titleService: Title,
        public zone: NgZone,
        public store: Store<any>,
        public translate: TranslateService,
        public ls: LocalStorageService,
        public http: Http,
        public translateService: LocaleTranslationService,
        public fb: FormBuilder,
        public logger: Logger,
        public utilService: Utils,
        private globalize: GlobalizeService
    ) {
        this.bankDetailsFormGroup = this.fb.group({
            BankAccountTypeCode: [{ value: '', disabled: true }],
            BankAccountTypeDesc: [{ value: '', disabled: true }],
            BankAccountSortCode: [{ value: '', disabled: true }],
            BankAccountNumber: [{ value: '', disabled: true }],
            VirtualBankAccountNumber: [{ value: '', disabled: true }],
            BankAccountInfo: [{ value: '', disabled: true }],
            MandateNumberSEPA: [{ value: '', disabled: true }],
            cmdGenerateNew: [{ value: 'Generate New', disabled: false }],
            MandateNumberFinance: [{ value: '', disabled: true }],
            MandateDate: [{ value: '', disabled: true }],
            selMandateTypeCode: [{ value: '', disabled: false }]

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
                        if (this.sysCharParams && this.sysCharParams['ttMandateType']) {
                            this.ttMandateType = this.sysCharParams['ttMandateType'];
                        }
                        if (this.sysCharParams['vBankAccountFormatCode'] === 'iBAN') {
                            this.iBANFlag = true;
                        }
                        else {
                            this.iBANFlag = false;
                        }
                        break;
                    case AccountMaintenanceActionTypes.FORM_INIT:

                        break;
                    case AccountMaintenanceActionTypes.SAVE_VIRTUAL_TABLE_DATA:
                        if (data['virtualTableData']) {
                            this.virtualTableField = data['virtualTableData'];
                        }
                        this.bankDetailsFormGroup.controls['BankAccountTypeDesc'].setValue(this.virtualTableField.BankAccountTypeDesc);

                        if (this.utilService.customTruthyCheck(data['data'].BankAccountTypeCode)) {
                            let desc: string = this.bankDetailsFormGroup.controls['BankAccountTypeDesc'].value;
                            let text: string = desc ? data['data'].BankAccountTypeCode + ' - ' + desc : data['data'].BankAccountTypeCode;
                            this.bankAccountTypeActiveItem = {
                                id: data['data'].BankAccountTypeCode,
                                text: text
                            };
                        }
                        else {
                            this.bankAccountTypeActiveItem = {
                                id: '',
                                text: ''
                            };
                        }
                        break;

                    case AccountMaintenanceActionTypes.VALIDATE_FORMS:
                        if (typeof (data['validate'].bankDetails) !== 'undefined') {
                            this.validateForm();
                        }
                        break;
                    case AccountMaintenanceActionTypes.BEFORE_MODE:
                        this.sysCharParams = data['processedSysChar'];
                        break;
                    case AccountMaintenanceActionTypes.TAB_CHANGE:
                        this.sysCharParams = data['processedSysChar'];
                        if (this.sysCharParams && this.sysCharParams['ttMandateType']) {
                            this.ttMandateType = this.sysCharParams['ttMandateType'];
                        }
                        if (this.sysCharParams['vBankAccountFormatCode'] === 'iBAN') {
                            this.iBANFlag = true;
                        }
                        else {
                            this.iBANFlag = false;
                        }
                        break;

                    case AccountMaintenanceActionTypes.BEFORE_ADD:
                        this.sysCharParams = data['processedSysChar'];
                        if (this.sysCharParams['vSCEnableSEPAFinanceMandate'] || this.sysCharParams['vSCEnableSEPAFinanceMandateLog']) {
                            this.fieldDisabled.selMandateTypeCode = false;
                            this.bankDetailsFormGroup.controls['selMandateTypeCode'].enable();
                            this.bankDetailsFormGroup.controls['selMandateTypeCode'].setValue(this.sysCharParams['vDefaultMandateType']);
                            this.bankDetailsFormGroup.controls['selMandateTypeCode'].updateValueAndValidity();
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

        this.translateSubscription = this.translateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.fetchTranslationContent();
            }
        });
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.dispathFormGroup();

    }

    public dispathFormGroup(): void {
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                bankDetails: this.bankDetailsFormGroup
            }
        });

        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                bankDetails: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                bankDetails: this.fieldVisibility
            }
        });
    }

    public setFormData(data: any): void {
        this.bankDetailsFormGroup.controls['BankAccountTypeCode'].setValue(data['data'].BankAccountTypeCode);
        this.bankDetailsFormGroup.controls['BankAccountTypeDesc'].setValue(this.virtualTableField.BankAccountTypeDesc);

        if (this.utilService.customTruthyCheck(data['data'].BankAccountTypeCode)) {
            let desc: string = this.bankDetailsFormGroup.controls['BankAccountTypeDesc'].value;
            let text: string = desc ? data['data'].BankAccountTypeCode + ' - ' + desc : data['data'].BankAccountTypeCode;
            this.bankAccountTypeActiveItem = {
                id: data['data'].BankAccountTypeCode,
                text: text
            };
        }

        this.bankDetailsFormGroup.controls['BankAccountSortCode'].setValue(data['data'].BankAccountSortCode);
        this.bankDetailsFormGroup.controls['BankAccountNumber'].setValue(data['data'].BankAccountNumber);
        this.bankDetailsFormGroup.controls['VirtualBankAccountNumber'].setValue(data['data'].VirtualBankAccountNumber);
        this.bankDetailsFormGroup.controls['BankAccountInfo'].setValue(data['data'].BankAccountInfo);
        this.bankDetailsFormGroup.controls['MandateNumberSEPA'].setValue(data['data'].MandateNumberSEPA);
        this.bankDetailsFormGroup.controls['MandateNumberFinance'].setValue(data['data'].MandateNumberFinance);
        let dt = data['data'].MandateDate ? this.globalize.parseDateToFixedFormat(data['data'].MandateDate) : '';
        this.dtMandateDate = data['data'].MandateDate ? this.globalize.parseDateStringToDate(data['data'].MandateDate) : null;
        this.bankDetailsFormGroup.controls['MandateDate'].setValue(data['data'].MandateDate ? data['data'].MandateDate : '');
        this.bankDetailsFormGroup.controls['selMandateTypeCode'].setValue(data['data'].selMandateTypeCode || '');
        this.bankDetailsFormGroup.updateValueAndValidity();
    }


    public validateForm(): void {
        for (let j in this.fieldVisibility) {
            if (j) {
                let key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.bankDetailsFormGroup.controls[key]) {
                        this.bankDetailsFormGroup.controls[key].clearValidators();
                    }
                }
            }

        }
        for (let i in this.bankDetailsFormGroup.controls) {
            if (this.bankDetailsFormGroup.controls.hasOwnProperty(i)) {
                if (this.bankDetailsFormGroup.controls[i].enabled) {
                    this.bankDetailsFormGroup.controls[i].markAsTouched();
                } else {
                    this.bankDetailsFormGroup.controls[i].clearValidators();
                }
            }
        }
        this.bankDetailsFormGroup.updateValueAndValidity();

        let formValid = null;
        if (!this.bankDetailsFormGroup.enabled) {
            formValid = true;
        } else {
            formValid = this.bankDetailsFormGroup.valid;
        }

        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                bankDetails: this.bankDetailsFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                bankDetails: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                bankDetails: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_VALIDITY, payload: {
                bankDetails: formValid
            }
        });
    }

    public processForm(): void {
        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            this.bankDetailsFormGroup.controls['BankAccountTypeCode'].enable();
            this.bankDetailsFormGroup.controls['BankAccountTypeDesc'].disable();
            this.fieldDisabled.BankAccountTypeCode = false;
            this.bankDetailsFormGroup.controls['BankAccountSortCode'].enable();
            this.bankDetailsFormGroup.controls['BankAccountNumber'].enable();
            this.bankDetailsFormGroup.controls['VirtualBankAccountNumber'].enable();
            this.bankDetailsFormGroup.controls['BankAccountInfo'].enable();
            this.bankDetailsFormGroup.controls['MandateNumberSEPA'].enable();
            this.bankDetailsFormGroup.controls['MandateNumberFinance'].enable();
            this.bankDetailsFormGroup.controls['MandateDate'].enable();
            this.idMandateDateDisabled = false;
            this.bankDetailsFormGroup.controls['selMandateTypeCode'].enable();
        }

        if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
            this.bankDetailsFormGroup.controls['BankAccountTypeCode'].disable();
            this.fieldDisabled.BankAccountTypeCode = true;
            this.bankDetailsFormGroup.controls['BankAccountTypeDesc'].disable();
            this.bankDetailsFormGroup.controls['BankAccountSortCode'].disable();
            this.bankDetailsFormGroup.controls['BankAccountNumber'].disable();
            this.bankDetailsFormGroup.controls['VirtualBankAccountNumber'].disable();
            this.bankDetailsFormGroup.controls['BankAccountInfo'].disable();
            this.bankDetailsFormGroup.controls['MandateNumberSEPA'].disable();
            this.bankDetailsFormGroup.controls['MandateNumberFinance'].disable();
            this.bankDetailsFormGroup.controls['MandateDate'].disable();
            this.idMandateDateDisabled = true;
            this.bankDetailsFormGroup.controls['selMandateTypeCode'].disable();
            this.bankDetailsFormGroup.controls['cmdGenerateNew'].disable();
        }

        if (this.mode['addMode'] && !this.mode['updateMode'] && !this.mode['searchMode']) {
            this.bankDetailsFormGroup.controls['BankAccountTypeCode'].enable();
            this.fieldDisabled.BankAccountTypeCode = false;
            this.bankDetailsFormGroup.controls['BankAccountTypeDesc'].disable();
            this.bankDetailsFormGroup.controls['BankAccountSortCode'].enable();
            this.bankDetailsFormGroup.controls['BankAccountNumber'].enable();
            this.bankDetailsFormGroup.controls['VirtualBankAccountNumber'].enable();
            this.bankDetailsFormGroup.controls['BankAccountInfo'].enable();
            this.bankDetailsFormGroup.controls['MandateNumberSEPA'].enable();
            this.bankDetailsFormGroup.controls['MandateNumberFinance'].enable();
            this.bankDetailsFormGroup.controls['MandateDate'].enable();
            this.idMandateDateDisabled = false;
            this.bankDetailsFormGroup.controls['selMandateTypeCode'].enable();
            this.bankDetailsFormGroup.controls['BankAccountTypeCode'].setValue('');
            this.bankDetailsFormGroup.controls['BankAccountTypeDesc'].setValue('');
            this.bankDetailsFormGroup.controls['BankAccountTypeDesc'].setValue('');
            this.bankDetailsFormGroup.controls['BankAccountSortCode'].setValue('');
            this.bankDetailsFormGroup.controls['BankAccountNumber'].setValue('');
            this.bankDetailsFormGroup.controls['VirtualBankAccountNumber'].setValue('');
            this.bankDetailsFormGroup.controls['BankAccountInfo'].setValue('');
            this.bankDetailsFormGroup.controls['MandateNumberSEPA'].setValue('');
            this.bankDetailsFormGroup.controls['MandateNumberFinance'].setValue('');
            this.bankDetailsFormGroup.controls['MandateDate'].setValue('');
            this.bankDetailsFormGroup.controls['selMandateTypeCode'].setValue('');
        }
        this.bankDetailsFormGroup.updateValueAndValidity();

    }

    onZipDataReceived(data: any): void {
        this.bankDetailsFormGroup.controls['ContractPostcode'].setValue(data.Postcode);
    }

    onCountryCodeReceived(data: any): void {
        this.bankDetailsFormGroup.controls['CountryDesc'].setValue(data.riCountryCode);
    }

    public onBankAccountTypeCodeSearchDataReceived(data: any): void {
        if (data) {
            this.bankDetailsFormGroup.controls['BankAccountTypeCode'].setValue(data.BankAccountTypeCode);
            this.bankDetailsFormGroup.controls['BankAccountTypeDesc'].setValue(data.BankAccountTypeDesc);
        }
    }

    public fetchTranslationContent(): void {
        this.translatedMessageList.message_1 = MessageConstant.PageSpecificMessage.This_will_update_the_existing_SEPA_Mandate_Reference;
        this.translatedMessageList.message_2 = MessageConstant.PageSpecificMessage.Confirm_Generate_New;
        this.getTranslatedValue(MessageConstant.PageSpecificMessage.This_will_update_the_existing_SEPA_Mandate_Reference, null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.translatedMessageList.message_1 = res;
                }
            });
        });

        this.getTranslatedValue(MessageConstant.PageSpecificMessage.Confirm_Generate_New, null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.translatedMessageList.message_2 = res;
                }
            });
        });
    }

    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }

    }

    public onCmdGenerateNewClick(): void {
        if (this.bankDetailsFormGroup.controls['MandateNumberSEPA'].value) {
            let msg1 = this.translatedMessageList.message_1 ? this.translatedMessageList.message_1 : MessageConstant.PageSpecificMessage.This_will_update_the_existing_SEPA_Mandate_Reference;
            let msg2 = this.translatedMessageList.message_2 ? this.translatedMessageList.message_2 : MessageConstant.PageSpecificMessage.Confirm_Generate_New;
            let confirmText = msg1 + ' ' + msg2;
            this.promptModal.Title = confirmText;
            this.promptModal.show();
        } else {
            this.generateNewRef();
        }

    }

    public promptSave(event: any): void {
        this.generateNewRef();
    }

    public generateNewRef(): void {
        this.queryAccount = new URLSearchParams();
        this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
        this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        this.queryAccount.set(this.serviceConstants.Action, '6');

        let postData = {
            'Function': 'GenerateNewRef',
            'AccountNumber': this.storeData['formGroup'].main.controls['AccountNumber'].value ? this.storeData['formGroup'].main.controls['AccountNumber'].value : '',
            'AccountName': this.storeData['formGroup'].main.controls['AccountName'].value ? this.storeData['formGroup'].main.controls['AccountName'].value.trim() : ''
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.queryAccount, postData).subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.status === 'failure') {
                    //this.errorService.emitError(e.oResponse);
                    this.errorModal.show({ msg: e.oResponse, title: 'Error' }, false);
                } else if (e['errorMessage']) {
                    //this.errorService.emitError(e['errorMessage']);
                    this.errorModal.show({ msg: e.errorMessage, title: 'Error' }, false);
                } else {
                    if (e['NewMandateNumberSEPA']) {
                        this.bankDetailsFormGroup.controls['MandateNumberSEPA'].setValue(e['NewMandateNumberSEPA']);
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError(error);
            }
        );

    }

    public riMaintenanceBeforeSelect(): void {

        if (!this.sysCharParams['vSCMultiContactInd'] === true) {

            if (this.sysCharParams['vSCEnableSEPAFinanceMandate'] === true || this.sysCharParams['vSCEnableSEPAFinanceMandateLog'] === true) {
                this.bankDetailsFormGroup.controls['selMandateTypeCode'].disable();
            }
        }
    }


    public onMandateDateSelectedValue(value: Object): void {
        if (value && value['value']) {
            this.bankDetailsFormGroup.controls['MandateDate'].setValue(value['value']);
        }
        else {
            this.bankDetailsFormGroup.controls['MandateDate'].setValue('');
        }
    }

}
