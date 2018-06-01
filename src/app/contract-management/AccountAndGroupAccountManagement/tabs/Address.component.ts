import { InternalMaintenanceServiceModuleRoutes } from './../../../base/PageRoutes';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { Utils } from './../../../../shared/services/utility';
import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';
import { Router } from '@angular/router';
import { MessageService } from './../../../../shared/services/message.service';
import { ErrorService } from './../../../../shared/services/error.service';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { HttpService } from './../../../../shared/services/http-service';
import { URLSearchParams } from '@angular/http';
import { LocaleTranslationService } from './../../../../shared/services/translation.service';
import { AccountMaintenanceActionTypes } from './../../../actions/account-maintenance';
import { SysCharConstants } from './../../../../shared/constants/syscharservice.constant';
import { Logger } from '@nsalaun/ng2-logger';
import { Component, NgZone, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { ContractActionTypes } from '../../../../app/actions/contract';
import { AccountSearchComponent } from '../../../../app/internal/search/iCABSASAccountSearch';
import { PostCodeSearchComponent } from '../../../../app/internal/search/iCABSBPostcodeSearch.component';
import { ScreenNotReadyComponent } from './../../../../shared/components/screenNotReady';

@Component({
    selector: 'icabs-maintenance-address',
    templateUrl: 'address.html'
})

export class AddressComponent implements OnInit {
    @ViewChild('zipCodeEllipsis') zipCodeEllipsis: EllipsisComponent;
    public inputParams: any = { 'parentMode': 'Account', 'ContractTypeCode': '', 'countryCode': '', 'businessCode': '', 'Town': '', 'State': '', 'Postcode': '' };
    public inputParamsCountryCode: any = { 'parentMode': 'LookUp-Country', 'ContractTypeCode': '', 'countryCode': '', 'businessCode': '' };
    public storeSubscription: Subscription;
    public addressFormGroup: FormGroup;

    public fieldDisabled: any = {
        'BtnSendToNAV': false,
        'cmdGetAddress': false,
        'cmdSetInvoiceGroupDefault': false,
        'cmdSetInvoiceGroupEDI': false,
        'selMandateTypeCode': false,
        'cmdGenerateNew': false
    };

    public fieldVisibility: any = {
        'AccountAddressLine1': true,
        'cmdGetAddress': true,
        'AccountAddressLine2': true,
        'AccountAddressLine3': true,
        'AccountAddressLine4': true,
        'AccountAddressLine5': true,
        'AccountPostcode': true,
        'trAccountPostcode': true,
        'GPSCoordinate': false,
        'GPSCoordinateX': true,
        'GPSCoordinateY': true,
        'CountryCode': true,
        'CountryDesc': true,
        'AccountContactName': true,
        'BtnAmendContact': true,
        'AccountContactPosition': true,
        'AccountContactDepartment': true,
        'AccountContactTelephone': true,
        'AccountContactMobile': true,
        'AccountContactEmail': true,
        'AccountContactFax': true,
        'BtnSendToNAV': true,
        'SentToNAVStatus': false,
        'spanAmendContact': false,
        'spanEmergencyContact': false,
        'tdSentToNAVStatus': false,
        'tdSentToNAVStatusNOTSENT': false,
        'tdSentToNAVStatusOK': false,
        'tdSentToNAVStatusFAIL': false
    };

    public fieldRequired: any = {
        'isAccountAddressLine1Required': true,
        'iscmdGetAddressRequired': false,
        'isAccountAddressLine2Required': false,
        'isAccountAddressLine3Required': false,
        'isAccountAddressLine4Required': true,
        'isAccountAddressLine5Required': false,
        'isAccountPostcodeRequired': true,
        'isCountryCodeRequired': true,
        'isCountryDescRequired': true,
        'isGPSCoordinateRequired': false,
        'isAccountContactNameRequired': true,
        'isBtnAmendContactRequired': false,
        'isAccountContactPositionRequired': true,
        'isAccountContactDepartmentRequired': false,
        'isAccountContactTelephoneRequired': true,
        'isAccountContactMobileRequired': false,
        'isAccountContactEmailRequired': false,
        'isAccountContactFaxRequired': false
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

    public sysCharParams: Object = {
        vSCEnableMaxAddressValue: ''
    };
    public postCodeAutoOpen: boolean = false;
    public zipSearchComponent = PostCodeSearchComponent;
    public autoOpen: boolean = false;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };

    public defaultCode: any = {
        country: '',
        business: '',
        BranchNumber: ''
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
    public mode: Object;

    public storeData: any;
    public accountData: any;

    public updateMode: boolean = false;
    public addMode: boolean = false;
    public searchMode: boolean = false;

    public queryAccount: URLSearchParams;
    public queryLookUp: URLSearchParams = new URLSearchParams();
    public method: string = 'contract-management/maintenance';
    public module: string = 'account';
    public operation: string = 'Application/iCABSAAccountMaintenance';
    public contentType: string = 'application/x-www-form-urlencoded';


    constructor(
        private zone: NgZone,
        private fb: FormBuilder,
        private logger: Logger,
        private store: Store<any>,
        private httpService: HttpService,
        private serviceConstants: ServiceConstants,
        private translateService: LocaleTranslationService,
        private errorService: ErrorService,
        private messageService: MessageService,
        private router: Router,
        private utilService: Utils
    ) {
        this.addressFormGroup = this.fb.group({
            AccountAddressLine1: [{ value: '', disabled: true }, Validators.required],
            AccountAddressLine2: [{ value: '', disabled: true }],
            AccountAddressLine3: [{ value: '', disabled: true }],
            AccountAddressLine4: [{ value: '', disabled: true }, Validators.required],
            AccountAddressLine5: [{ value: '', disabled: true }],
            AccountPostcode: [{ value: '', disabled: true }, Validators.required],
            GPSCoordinateX: [{ value: '', disabled: true }],
            GPSCoordinateY: [{ value: '', disabled: true }],
            cmdGetAddress: [{ value: 'Get Address', disabled: false }],
            CountryCode: [{ value: '', disabled: true }],
            CountryDesc: [{ value: '', disabled: true }],
            AccountContactName: [{ value: '', disabled: true }, Validators.required],
            BtnAmendContact: [{ value: 'Contact Details', disabled: false }],
            AccountContactPosition: [{ value: '', disabled: true }, Validators.required],
            AccountContactDepartment: [{ value: '', disabled: true }],
            AccountContactTelephone: [{ value: '', disabled: true }, Validators.required],
            AccountContactMobile: [{ value: '', disabled: true }],
            AccountContactEmail: [{ value: '', disabled: true }],
            AccountContactFax: [{ value: '', disabled: true }],
            BtnEmergencyContact: [{ value: '', disabled: false }],
            BtnSendToNAV: [{ value: 'Send To NAV', disabled: false }],
            SentToNAVStatus: [{ value: '', disabled: true }]
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
                    case AccountMaintenanceActionTypes.SAVE_VIRTUAL_TABLE_DATA:

                        this.virtualTableField = data['virtualTableData'];
                        this.zone.run(() => {
                            this.countrySelected = {
                                id: data['data'].CountryCode,
                                text: data['data'].CountryCode + ' - ' + this.virtualTableField.riCountryDescription
                            };
                        });
                        break;
                    case AccountMaintenanceActionTypes.VALIDATE_FORMS:
                        if (typeof (data['validate'].address) !== 'undefined') {
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

        this.translateService.setUpTranslation();
    }

    ngOnInit(): void {
        String.prototype['capitalizeFirstLetter'] = function (): any {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };

        this.defaultCode.country = this.utilService.getCountryCode();
        this.defaultCode.business = this.utilService.getBusinessCode();

        if (this.storeData && this.storeData['code']) {
            this.inputParamsCountryCode.businessCode = this.storeData['code'].buseness;
            this.inputParamsCountryCode.countryCode = this.storeData['code'].country;
            this.inputParams.businessCode = this.storeData['code'].buseness;
            this.inputParams.countryCode = this.storeData['code'].country;
        }

        this.dispathFormGroup();
    }


    public dispathFormGroup(): void {
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                address: this.addressFormGroup
            }
        });

        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                address: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                address: this.fieldVisibility
            }
        });

    }


    public setFormData(data: any): void {

        this.addressFormGroup.controls['AccountAddressLine1'].setValue(this.getData(data['data'].AccountAddressLine1));
        this.addressFormGroup.controls['AccountAddressLine2'].setValue(this.getData(data['data'].AccountAddressLine2));
        this.addressFormGroup.controls['AccountAddressLine3'].setValue(this.getData(data['data'].AccountAddressLine3));
        this.addressFormGroup.controls['AccountAddressLine4'].setValue(this.getData(data['data'].AccountAddressLine4));
        this.addressFormGroup.controls['AccountAddressLine5'].setValue(this.getData(data['data'].AccountAddressLine5));
        this.addressFormGroup.controls['AccountPostcode'].setValue(this.getData(data['data'].AccountPostcode));
        this.addressFormGroup.controls['CountryCode'].setValue(this.getData(data['data'].CountryCode));
        this.addressFormGroup.controls['CountryDesc'].setValue(this.getData(data['data'].CountryDesc));
        this.addressFormGroup.controls['GPSCoordinateX'].setValue(this.getData(data['data'].GPSCoordinateX));
        this.addressFormGroup.controls['GPSCoordinateY'].setValue(this.getData(data['data'].GPSCoordinateY));
        this.addressFormGroup.controls['AccountContactName'].setValue(this.getData(data['data'].AccountContactName));
        this.addressFormGroup.controls['AccountContactPosition'].setValue(this.getData(data['data'].AccountContactPosition));
        this.addressFormGroup.controls['AccountContactDepartment'].setValue(this.getData(data['data'].AccountContactDepartment));
        this.addressFormGroup.controls['AccountContactTelephone'].setValue(this.getData(data['data'].AccountContactTelephone));
        this.addressFormGroup.controls['AccountContactMobile'].setValue(this.getData(data['data'].AccountContactMobile));
        this.addressFormGroup.controls['AccountContactEmail'].setValue(this.getData(data['data'].AccountContactEmail));
        this.addressFormGroup.controls['AccountContactFax'].setValue(this.getData(data['data'].AccountContactFax));

        this.countrySelected['id'] = data['data'].CountryCode ? data['data'].CountryCode : '';
        this.countrySelected['text'] = this.virtualTableField.riCountryDescription;
        if (data['data'].CountryCode)
            this.renderCountryCodeDesc(data['data'].CountryCode);

        this.inputParams.AccountAddressLine4 = (this.addressFormGroup.controls['AccountAddressLine4'].value) ? this.addressFormGroup.controls['AccountAddressLine4'].value : '';
        this.inputParams.AccountAddressLine5 = (this.addressFormGroup.controls['AccountAddressLine5'].value) ? this.addressFormGroup.controls['AccountAddressLine5'].value : '';
        this.inputParams.AccountPostCode = (this.addressFormGroup.controls['AccountPostcode'].value) ? this.addressFormGroup.controls['AccountPostcode'].value : '';
        this.addressFormGroup.updateValueAndValidity();
    }

    public validateForm(): void {
        for (let j in this.fieldVisibility) {
            if (this.fieldVisibility.hasOwnProperty(j)) {
                let key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.addressFormGroup.controls[key]) {
                        this.addressFormGroup.controls[key].clearValidators();
                        this.addressFormGroup.controls[key].updateValueAndValidity();
                    }
                    else if (this.addressFormGroup.controls[j]) {
                        this.addressFormGroup.controls[j].clearValidators();
                        this.addressFormGroup.controls[j].updateValueAndValidity();
                    }
                }
            }
        }


        for (let i in this.addressFormGroup.controls) {
            if (this.addressFormGroup.controls[i].enabled) {
                this.addressFormGroup.controls[i].markAsTouched();
            } else {
                this.addressFormGroup.controls[i].clearValidators();
            }
        }
        this.addressFormGroup.updateValueAndValidity();

        let formValid = null;
        if (!this.addressFormGroup.enabled) {
            formValid = true;
        } else {
            formValid = this.addressFormGroup.valid;
        }
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                address: this.addressFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                address: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                address: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_VALIDITY, payload: {
                address: formValid
            }
        });
    }

    public processForm(): void {

        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            this.addressFormGroup.controls['AccountAddressLine1'].enable();
            this.addressFormGroup.controls['AccountAddressLine2'].enable();
            this.addressFormGroup.controls['AccountAddressLine3'].enable();
            this.addressFormGroup.controls['AccountAddressLine4'].enable();
            this.addressFormGroup.controls['AccountAddressLine5'].enable();
            this.addressFormGroup.controls['AccountPostcode'].enable();
            this.addressFormGroup.controls['CountryDesc'].enable();
            this.addressFormGroup.controls['GPSCoordinateX'].enable();
            this.addressFormGroup.controls['GPSCoordinateY'].enable();
            this.addressFormGroup.controls['AccountContactName'].enable();
            this.addressFormGroup.controls['AccountContactPosition'].enable();
            this.addressFormGroup.controls['AccountContactDepartment'].enable();
            this.addressFormGroup.controls['AccountContactTelephone'].enable();
            this.addressFormGroup.controls['AccountContactMobile'].enable();
            this.addressFormGroup.controls['AccountContactEmail'].enable();
            this.addressFormGroup.controls['AccountContactFax'].enable();
            this.isCountryCodeDisabled = false;
            this.isZipCodeEllipsisDisabled = false;
        }

        if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
            this.addressFormGroup.controls['cmdGetAddress'].disable();
            this.addressFormGroup.controls['BtnSendToNAV'].disable();

            this.addressFormGroup.controls['AccountAddressLine1'].disable();
            this.addressFormGroup.controls['AccountAddressLine2'].disable();
            this.addressFormGroup.controls['AccountAddressLine3'].disable();
            this.addressFormGroup.controls['AccountAddressLine4'].disable();
            this.addressFormGroup.controls['AccountAddressLine5'].disable();
            this.addressFormGroup.controls['AccountPostcode'].disable();
            this.addressFormGroup.controls['CountryDesc'].disable();
            this.addressFormGroup.controls['GPSCoordinateX'].disable();
            this.addressFormGroup.controls['GPSCoordinateY'].disable();
            this.addressFormGroup.controls['AccountContactName'].disable();
            this.addressFormGroup.controls['AccountContactPosition'].disable();
            this.addressFormGroup.controls['AccountContactDepartment'].disable();
            this.addressFormGroup.controls['AccountContactTelephone'].disable();
            this.addressFormGroup.controls['AccountContactMobile'].disable();
            this.addressFormGroup.controls['AccountContactEmail'].disable();
            this.addressFormGroup.controls['AccountContactFax'].disable();
            this.isCountryCodeDisabled = true;
            this.isZipCodeEllipsisDisabled = true;

            this.addressFormGroup.controls['AccountAddressLine1'].setValue('');
            this.addressFormGroup.controls['AccountAddressLine2'].setValue('');
            this.addressFormGroup.controls['AccountAddressLine3'].setValue('');
            this.addressFormGroup.controls['AccountAddressLine4'].setValue('');
            this.addressFormGroup.controls['AccountAddressLine5'].setValue('');
            this.addressFormGroup.controls['AccountPostcode'].setValue('');
            this.addressFormGroup.controls['CountryDesc'].setValue('');
            this.addressFormGroup.controls['GPSCoordinateX'].setValue('');
            this.addressFormGroup.controls['GPSCoordinateY'].setValue('');
            this.addressFormGroup.controls['AccountContactName'].setValue('');
            this.addressFormGroup.controls['AccountContactPosition'].setValue('');
            this.addressFormGroup.controls['AccountContactDepartment'].setValue('');
            this.addressFormGroup.controls['AccountContactTelephone'].setValue('');
            this.addressFormGroup.controls['AccountContactMobile'].setValue('');
            this.addressFormGroup.controls['AccountContactEmail'].setValue('');
            this.addressFormGroup.controls['AccountContactFax'].setValue('');
            this.fieldVisibility['BtnSendToNAV'] = false;
        }

        if (this.mode['addMode'] && !this.mode['updateMode'] && !this.mode['searchMode']) {
            this.addressFormGroup.controls['AccountAddressLine1'].enable();
            this.addressFormGroup.controls['cmdGetAddress'].enable();
            this.addressFormGroup.controls['AccountAddressLine2'].enable();
            this.addressFormGroup.controls['AccountAddressLine3'].enable();
            this.addressFormGroup.controls['AccountAddressLine4'].enable();
            this.addressFormGroup.controls['AccountAddressLine5'].enable();
            this.addressFormGroup.controls['AccountPostcode'].enable();
            this.addressFormGroup.controls['CountryDesc'].enable();
            this.addressFormGroup.controls['GPSCoordinateX'].enable();
            this.addressFormGroup.controls['GPSCoordinateY'].enable();
            this.addressFormGroup.controls['AccountContactName'].enable();
            this.addressFormGroup.controls['AccountContactPosition'].enable();
            this.addressFormGroup.controls['AccountContactDepartment'].enable();
            this.addressFormGroup.controls['AccountContactTelephone'].enable();
            this.addressFormGroup.controls['AccountContactMobile'].enable();
            this.addressFormGroup.controls['AccountContactEmail'].enable();
            this.addressFormGroup.controls['AccountContactFax'].enable();

            this.addressFormGroup.controls['AccountAddressLine1'].setValue('');
            this.addressFormGroup.controls['AccountAddressLine2'].setValue('');
            this.addressFormGroup.controls['AccountAddressLine3'].setValue('');
            this.addressFormGroup.controls['AccountAddressLine4'].setValue('');
            this.addressFormGroup.controls['AccountAddressLine5'].setValue('');
            this.addressFormGroup.controls['AccountPostcode'].setValue('');
            this.addressFormGroup.controls['CountryDesc'].setValue('');
            this.addressFormGroup.controls['GPSCoordinateX'].setValue('');
            this.addressFormGroup.controls['GPSCoordinateY'].setValue('');
            this.addressFormGroup.controls['AccountContactName'].setValue('');
            this.addressFormGroup.controls['AccountContactPosition'].setValue('');
            this.addressFormGroup.controls['AccountContactDepartment'].setValue('');
            this.addressFormGroup.controls['AccountContactTelephone'].setValue('');
            this.addressFormGroup.controls['AccountContactMobile'].setValue('');
            this.addressFormGroup.controls['AccountContactEmail'].setValue('');
            this.addressFormGroup.controls['AccountContactFax'].setValue('');
            this.isCountryCodeDisabled = false;
            this.isZipCodeEllipsisDisabled = false;
            this.countrySelected['id'] = this.defaultCode.country ? this.defaultCode.country : '';
            this.countrySelected['text'] = this.virtualTableField.riCountryDescription;
            if (this.defaultCode.country) {
                this.renderCountryCodeDesc(this.defaultCode.country);
            }

            this.zone.run(() => {
                // this.countrySelected = {
                //     id: '',
                //     text: ''
                // };
                this.isCountryCodeDisabled = false;
                this.isZipCodeEllipsisDisabled = false;
            });
        }

        if (this.mode['addMode'] || this.mode['updateMode']) {
            this.inputParamsCountryCode = Object.assign({}, this.inputParamsCountryCode, {
                'countryCode': this.storeData['code'].country ? this.storeData['code'].country : this.defaultCode.country,
                'businessCode': this.storeData['code'].business ? this.storeData['code'].business : this.defaultCode.business
            });
        }

        this.addressFormGroup.updateValueAndValidity();
    }

    onZipDataReceived(data: any): void {
        if (data && data.AccountPostcode) {
            this.addressFormGroup.controls['AccountPostcode'].setValue(data.AccountPostcode);
        }
        if (data && data.AccountAddressLine4) {
            this.addressFormGroup.controls['AccountAddressLine4'].setValue(data.AccountAddressLine4);
        }
        else {
            this.addressFormGroup.controls['AccountAddressLine4'].setValue('');
        }
        if (data && data.AccountAddressLine5) {
            this.addressFormGroup.controls['AccountAddressLine5'].setValue(data.AccountAddressLine5);
        }
        else {
            this.addressFormGroup.controls['AccountAddressLine5'].setValue('');
        }

        this.inputParams.AccountAddressLine4 = (this.addressFormGroup.controls['AccountAddressLine4'].value) ? this.addressFormGroup.controls['AccountAddressLine4'].value : '';
        this.inputParams.AccountAddressLine5 = (this.addressFormGroup.controls['AccountAddressLine5'].value) ? this.addressFormGroup.controls['AccountAddressLine5'].value : '';
        this.inputParams.AccountPostCode = (this.addressFormGroup.controls['AccountPostcode'].value) ? this.addressFormGroup.controls['AccountPostcode'].value : '';

        this.addressFormGroup.updateValueAndValidity();
    }

    onCountryCodeReceived(data: any): void {
        this.addressFormGroup.controls['CountryCode'].setValue(data.CountryCode);
        this.addressFormGroup.controls['CountryDesc'].setValue(data.CountryDesc);
        this.addressFormGroup.updateValueAndValidity();
    }

    public onBtnSendToNAVClick(): void {
        this.sysCharParams = this.storeData['processedSysChar'];
        if (this.sysCharParams['vSCSendOneOffAccntToNAV'] === true) {
            this.fetchAccountData('SendToNAV', {}, { AccountNumber: this.storeData['formGroup'].main.AccountNumber, CategoryCode: this.storeData['formGroup'].accountManagement.CategoryCode }).subscribe(
                (e) => {
                    if (e.status === 'failure') {
                        this.errorService.emitError(e.oResponse);
                    } else {
                        let data = e.SentToNAVStatus;
                        if (data) {
                            this.addressFormGroup.controls['SentToNAVStatus'].setValue(data);

                            if (this.addressFormGroup.controls['SentToNAVStatus'].value() === '') {
                                this.fieldVisibility.tdSentToNAVStatusNOTSENT = true;
                                this.fieldVisibility.tdSentToNAVStatusOK = false;
                                this.fieldVisibility.tdSentToNAVStatusFAIL = false;
                                this.addressFormGroup.controls['BtnSendToNAV'].enable();
                            } else if (this.addressFormGroup.controls['SentToNAVStatus'].value() === 'OK') {
                                this.fieldVisibility.tdSentToNAVStatusNOTSENT = false;
                                this.fieldVisibility.tdSentToNAVStatusOK = true;
                                this.fieldVisibility.tdSentToNAVStatusFAIL = false;
                                this.addressFormGroup.controls['BtnSendToNAV'].disable();
                            } else {
                                this.fieldVisibility.tdSentToNAVStatusNOTSENT = false;
                                this.fieldVisibility.tdSentToNAVStatusOK = false;
                                this.fieldVisibility.tdSentToNAVStatusFAIL = true;
                                this.addressFormGroup.controls['BtnSendToNAV'].enable();
                            }
                            this.addressFormGroup.updateValueAndValidity();
                        }
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                }
            );
        }
    }


    public fetchAccountData(functionName: any, searchParams: any = {}, postParams: any = {}): any {
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
        for (let key in searchParams) {
            if (key) {
                this.queryAccount.set(key, searchParams[key]);
            }
        }

        if (postParams) {
            return this.httpService.makePostRequest(this.method, this.module, this.operation, this.queryAccount, postParams);
        }
        else {
            return this.httpService.makeGetRequest(this.method, this.module, this.operation, this.queryAccount);
        }
    }

    public onCmdGetAddressClick(event: any): void {
        this.sysCharParams = this.storeData['processedSysChar'];
        this.updateInputParamsForPostCodeSearch();
        if (this.sysCharParams['vSCEnableHopewiserPAF'] === true) {
            //TODO alert('TODO: Redirect to riMPAFSearch.htm'); Not yet developed
            if (this.zipCodeEllipsis && typeof this.zipCodeEllipsis !== 'undefined') {
                this.inputParams.parentMode = 'Account';
                this.zipCodeEllipsis.configParams = this.inputParams;
                this.zipCodeEllipsis.contentComponent = ScreenNotReadyComponent;
                this.zipCodeEllipsis.updateComponent();
                setTimeout(() => {
                    this.zipCodeEllipsis.openModal();
                }, 0);
            }
        }
        else if (this.sysCharParams['vSCEnableDatabasePAF'] === true) {
            if (this.zipCodeEllipsis && typeof this.zipCodeEllipsis !== 'undefined') {
                this.inputParams.parentMode = 'Account';
                this.zipCodeEllipsis.contentComponent = PostCodeSearchComponent;
                this.zipCodeEllipsis.configParams = this.inputParams;
                this.zipCodeEllipsis.updateComponent();
                setTimeout(() => {
                    this.zipCodeEllipsis.openModal();
                }, 0);
            }
        }
    }


    public onAccountPostcodeChange(): void {
        this.sysCharParams = this.storeData['processedSysChar'];
        let accountPostcode = this.addressFormGroup.controls['AccountPostcode'].value;
        accountPostcode = accountPostcode ? accountPostcode : '';
        if ((this.sysCharParams['vEnablePostcodeDefaulting'] === true) && (this.sysCharParams['vSCEnableDatabasePAF'] === true) && this.trim(accountPostcode) !== '') {
            //this.ajaxSource.next(this.ajaxconstant.START);
            let postObj = {
                'Function': 'GetPostCodeTownAndState',
                'Postcode': this.addressFormGroup.controls['AccountPostcode'].value ? this.addressFormGroup.controls['AccountPostcode'].value : '',
                'State': this.addressFormGroup.controls['AccountAddressLine5'].value ? this.addressFormGroup.controls['AccountAddressLine5'].value : '',
                'Town': this.addressFormGroup.controls['AccountAddressLine4'].value ? this.addressFormGroup.controls['AccountAddressLine4'].value : ''
            };
            this.postAccountEntryData('GetPostCodeTownAndState', {}, postObj).subscribe(
                (e) => {
                    if (e.status === 'failure') {
                        this.errorService.emitError(e.oResponse);
                    } else {
                        let uniqueRecordFound = e['UniqueRecordFound'];
                        if (uniqueRecordFound) {
                            this.addressFormGroup.controls['AccountPostcode'].setValue(e['Postcode'] ? e['Postcode'] : '');
                            this.addressFormGroup.controls['AccountAddressLine5'].setValue(e['State'] ? e['State'] : '');
                            this.addressFormGroup.controls['AccountAddressLine4'].setValue(e['Town'] ? e['Town'] : '');
                            this.addressFormGroup.updateValueAndValidity();
                        } else {
                            if (this.zipCodeEllipsis && typeof (this.zipCodeEllipsis) !== undefined) {
                                this.updateInputParamsForPostCodeSearch();
                                this.inputParams.parentMode = 'Account';
                                this.zipCodeEllipsis.contentComponent = PostCodeSearchComponent;
                                this.zipCodeEllipsis.configParams = this.inputParams;
                                this.zipCodeEllipsis.updateComponent();
                                setTimeout(() => {
                                    this.zipCodeEllipsis.openModal();
                                }, 0);
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

    public postAccountEntryData(functionName: any, params: any, postdata: any): any {
        this.queryAccount = new URLSearchParams();
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        } else {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }

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


    public onFocusOut(event: any): void {
        this.sysCharParams = this.storeData['processedSysChar'];
        if (event.target) {
            let elementValue = event.target.value;
            let _paddedValue = elementValue;
            //if (elementValue.length > 0) {
            if (event.target.id === 'AccountAddressLine4') {
                if (this.sysCharParams['vSCAddressLine4Required'] === true && this.trim(this.addressFormGroup.controls['AccountAddressLine4'].value) === '' && this.sysCharParams['vbEnableValidatePostcodeSuburb'] === true) {
                    this.onCmdGetAddressClick(event);
                }
            }
            else if (event.target.id === 'AccountAddressLine5') {
                if (this.sysCharParams['vSCAddressLine5Required'] === true && this.trim(this.addressFormGroup.controls['AccountAddressLine5'].value) === '' && this.sysCharParams['vbEnableValidatePostcodeSuburb'] === true) {
                    this.onCmdGetAddressClick(event);
                }
            }
            else if (event.target.id === 'AccountPostcode') {
                let activeElement = document.activeElement;
                let id = activeElement ? (activeElement.getAttribute('id') ? activeElement.getAttribute('id') : '') : '';

                if (this.sysCharParams['vSCPostCodeRequired'] === true && this.trim(this.addressFormGroup.controls['AccountPostcode'].value) === '' && ('AccountPostcode' !== id)) {
                    this.onCmdGetAddressClick(event);
                }
                else if (this.sysCharParams['vSCPostCodeRequired'] === true && this.storeData['otherParams'] && this.storeData['otherParams']['showPostCode']) {
                    if (this.storeData['otherParams']['showPostCode'] === true) {
                        this.storeData['otherParams']['showPostCode'] = false;
                        this.onCmdGetAddressClick(event);
                    }
                }
            }
            //}
        }
    };

    public accountPostcode_onchange(event: any): void {
        if (event.target) {
            if (event.target.id === 'AccountPostcode') {
                this.onAccountPostcodeChange();
            }
        }
    };

    public numberFormatValue(elementValue: string, maxLength: number): string {
        let paddedValue: string = elementValue;
        if (elementValue.length < maxLength) {
            paddedValue = this.numberPadding(elementValue, 9);
        }
        return paddedValue;
    }

    public numberPadding(num: any, size: any): string {
        let s = num + '';
        while (s.length < size) s = '0' + s;
        return s;
    }


    public renderCountryCodeDesc(countryCode: any): any {
        let data = [
            {
                'table': 'riCountry',
                'query': { 'riCountryCode': countryCode },
                'fields': ['riCountryDescription']
            }
        ];

        this.lookUpRecord(data, 1).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {

                    if (e['results'][0] && e['results'][0].length > 0) {
                        let riCountryDescription = e['results'][0][0].riCountryDescription;
                        if (riCountryDescription) {
                            this.zone.run(() => {
                                this.countrySelected = {
                                    id: countryCode,
                                    text: countryCode + ' - ' + riCountryDescription
                                };
                            });
                        }
                    }
                }
            },
            (error) => {
                //console.log(error);
            }
        );
    }

    public lookUpRecord(data: any, maxresults: any): any {
        this.queryLookUp.set(this.serviceConstants.Action, '0');

        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.queryLookUp.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.queryLookUp.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        } else {
            this.queryLookUp.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            this.queryLookUp.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }

        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    }

    public btnAmendContactOnClick(): any {
        this.cmdContactDetails('all');
    }

    public btnEmergencyContactOnClick(): any {
        this.cmdContactDetails('emergency');
    }

    public cmdContactDetails(cWhich: string): any {
        let mode = '';
        if (cWhich === 'all') {
            mode = 'Account';
        }
        else {
            mode = 'AccountEmergency';
        }
        //window.location = "/wsscripts/riHTMLWrapper.p?riFileName=ContactManagement/iCABSCMContactPersonMaintenance.htm<maxwidth>"
        let accNumber = '';
        let accName = '';
        if (this.storeData && this.storeData['formGroup']) {
            accNumber = this.storeData['formGroup'].main.controls['AccountNumber'].value;
            accName = this.storeData['formGroup'].main.controls['AccountName'].value;
        }
        this.router.navigate([InternalMaintenanceServiceModuleRoutes.ICABSCMCONTACTPERSONMAINTENANCE], { queryParams: { parentMode: mode, accountNumber: accNumber, accountName: accName } });
    }

    public getData(data: any, dataType?: MntConst): any {
        return (data) ? data.trim() : '';
    }

    public trim(data: any): any {
        return (data) ? data.trim() : data;
    }

    public updateInputParamsForPostCodeSearch(): any {
        this.inputParams.AccountAddressLine4 = (this.addressFormGroup.controls['AccountAddressLine4'].value) ? this.addressFormGroup.controls['AccountAddressLine4'].value : '';
        this.inputParams.AccountAddressLine5 = (this.addressFormGroup.controls['AccountAddressLine5'].value) ? this.addressFormGroup.controls['AccountAddressLine5'].value : '';
        this.inputParams.AccountPostCode = (this.addressFormGroup.controls['AccountPostcode'].value) ? this.addressFormGroup.controls['AccountPostcode'].value : '';
    }

    public modalHidden(): void {
        this.sysCharParams = this.storeData['processedSysChar'];
        if (this.addMode && this.sysCharParams['vSCRunPAFSearchOn1stAddressLine'] === true && this.storeData['otherParams']['addressLineFocus'] === true) {
            this.storeData['otherParams']['addressLineFocus'] = false;
            this.storeData['otherParams']['showPostCode'] = false;
            setTimeout(() => {
                let el = document.getElementById('AccountAddressLine1');
                if (el) {
                    el['focus']();
                }
            }, 200);
        }
    }

    public setCapitalizeFirstLetterValue(event: any): any {
        if (event && event.target) {
            let elementValue = event.target.value;
            if (elementValue && this.storeData['otherParams'] && this.storeData['otherParams'].capitalizeFirstLetterField && event.target.id && this.storeData['otherParams'].capitalizeFirstLetterField.hasOwnProperty(event.target.id)) {
                event.target.value = elementValue['capitalizeFirstLetter']();
                if (this.addressFormGroup.controls.hasOwnProperty(event.target.id)) {
                    this.addressFormGroup.controls[event.target.id].setValue(event.target.value);
                    this.addressFormGroup.controls[event.target.id].updateValueAndValidity();
                }
            }
        }
    }

    public onBlur(event: any): void {
        if (event && event.target) {
            this.setCapitalizeFirstLetterValue(event);
        }

        if (this.addressFormGroup.controls.hasOwnProperty(event.target.id)) {
            let elementValue = event.target.value;
            let fieldId = 'is' + event.target.id + 'Required';
            if (elementValue && elementValue.trim() === '' && this.fieldRequired[fieldId] && this.fieldRequired[fieldId] === true) {
                this.addressFormGroup.controls[event.target.id].setValue('');
                this.addressFormGroup.controls[event.target.id].setErrors({ remote: true });
                this.addressFormGroup.controls[event.target.id].updateValueAndValidity();
            }
        }
    };

}
