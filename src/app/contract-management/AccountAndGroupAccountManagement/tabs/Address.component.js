import { Utils } from './../../../../shared/services/utility';
import { Router } from '@angular/router';
import { MessageService } from './../../../../shared/services/message.service';
import { ErrorService } from './../../../../shared/services/error.service';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { HttpService } from './../../../../shared/services/http-service';
import { URLSearchParams } from '@angular/http';
import { LocaleTranslationService } from './../../../../shared/services/translation.service';
import { AccountMaintenanceActionTypes } from './../../../actions/account-maintenance';
import { Logger } from '@nsalaun/ng2-logger';
import { Component, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { PostCodeSearchComponent } from '../../../../app/internal/search/iCABSBPostcodeSearch.component';
import { ScreenNotReadyComponent } from './../../../../shared/components/screenNotReady';
export var AddressComponent = (function () {
    function AddressComponent(zone, fb, logger, store, httpService, serviceConstants, translateService, errorService, messageService, router, utilService) {
        var _this = this;
        this.zone = zone;
        this.fb = fb;
        this.logger = logger;
        this.store = store;
        this.httpService = httpService;
        this.serviceConstants = serviceConstants;
        this.translateService = translateService;
        this.errorService = errorService;
        this.messageService = messageService;
        this.router = router;
        this.utilService = utilService;
        this.inputParams = { 'parentMode': 'Account', 'ContractTypeCode': '', 'countryCode': '', 'businessCode': '', 'Town': '', 'State': '', 'Postcode': '' };
        this.inputParamsCountryCode = { 'parentMode': 'LookUp-Country', 'ContractTypeCode': '', 'countryCode': '', 'businessCode': '' };
        this.fieldDisabled = {
            'BtnSendToNAV': false,
            'cmdGetAddress': false,
            'cmdSetInvoiceGroupDefault': false,
            'cmdSetInvoiceGroupEDI': false,
            'selMandateTypeCode': false,
            'cmdGenerateNew': false
        };
        this.fieldVisibility = {
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
            'tdSentToNAVStatusOK': true,
            'tdSentToNAVStatusFAIL': false
        };
        this.fieldRequired = {
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
        this.virtualTableField = {
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
        this.otherParams = {
            'glAllowUserAuthUpdate': false,
            'cEmployeeLimitChildDrillOptions': ''
        };
        this.sysCharParams = {
            vSCEnableMaxAddressValue: ''
        };
        this.postCodeAutoOpen = false;
        this.zipSearchComponent = PostCodeSearchComponent;
        this.autoOpen = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.defaultCode = {
            country: 'ZA',
            business: 'D',
            BranchNumber: ''
        };
        this.searchModalRoute = '';
        this.showHeader = true;
        this.showCloseButton = true;
        this.isCountryCodeDisabled = true;
        this.isZipCodeEllipsisDisabled = true;
        this.countrySelected = {
            id: '',
            text: ''
        };
        this.updateMode = false;
        this.addMode = false;
        this.searchMode = false;
        this.queryLookUp = new URLSearchParams();
        this.method = 'contract-management/maintenance';
        this.module = 'account';
        this.operation = 'Application/iCABSAAccountMaintenance';
        this.contentType = 'application/x-www-form-urlencoded';
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
        this.storeSubscription = store.select('accountMaintenance').subscribe(function (data) {
            if (data && data['action']) {
                _this.storeData = data;
                switch (data['action']) {
                    case AccountMaintenanceActionTypes.SAVE_DATA:
                        if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                            _this.setFormData(data);
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_ACCOUNT:
                        if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                            _this.accountData = data['data'];
                            _this.setFormData(data);
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_MODE:
                        if (data['mode'] && !(Object.keys(data['mode']).length === 0 && data['mode'].constructor === Object)) {
                            _this.mode = data['mode'];
                            _this.addMode = data['mode'].addMode;
                            _this.updateMode = data['mode'].updateMode;
                            _this.searchMode = data['mode'].searchMode;
                            _this.processForm();
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_SYSCHAR:
                        _this.sysCharParams = data['syschars'];
                        break;
                    case AccountMaintenanceActionTypes.SAVE_PROCESSED_SYSCHAR:
                        _this.sysCharParams = data['processedSysChar'];
                        break;
                    case AccountMaintenanceActionTypes.SAVE_VIRTUAL_TABLE_DATA:
                        _this.virtualTableField = data['virtualTableData'];
                        _this.zone.run(function () {
                            _this.countrySelected = {
                                id: data['data'].CountryCode,
                                text: data['data'].CountryCode + ' - ' + _this.virtualTableField.riCountryDescription
                            };
                        });
                        break;
                    case AccountMaintenanceActionTypes.VALIDATE_FORMS:
                        if (typeof (data['validate'].address) !== 'undefined') {
                            _this.validateForm();
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
    AddressComponent.prototype.ngOnInit = function () {
        String.prototype['capitalizeFirstLetter'] = function () {
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
    };
    AddressComponent.prototype.dispathFormGroup = function () {
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
    };
    AddressComponent.prototype.setFormData = function (data) {
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
    };
    AddressComponent.prototype.validateForm = function () {
        for (var j in this.fieldVisibility) {
            if (this.fieldVisibility.hasOwnProperty(j)) {
                var key = j['capitalizeFirstLetter']();
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
        for (var i in this.addressFormGroup.controls) {
            if (this.addressFormGroup.controls[i].enabled) {
                this.addressFormGroup.controls[i].markAsTouched();
            }
            else {
                this.addressFormGroup.controls[i].clearValidators();
            }
        }
        this.addressFormGroup.updateValueAndValidity();
        var formValid = null;
        if (!this.addressFormGroup.enabled) {
            formValid = true;
        }
        else {
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
    };
    AddressComponent.prototype.processForm = function () {
        var _this = this;
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
            this.zone.run(function () {
                _this.isCountryCodeDisabled = false;
                _this.isZipCodeEllipsisDisabled = false;
            });
        }
        if (this.mode['addMode'] || this.mode['updateMode']) {
            this.inputParamsCountryCode = Object.assign({}, this.inputParamsCountryCode, {
                'countryCode': this.storeData['code'].country ? this.storeData['code'].country : this.defaultCode.country,
                'businessCode': this.storeData['code'].business ? this.storeData['code'].business : this.defaultCode.business
            });
        }
        this.addressFormGroup.updateValueAndValidity();
    };
    AddressComponent.prototype.onZipDataReceived = function (data) {
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
    };
    AddressComponent.prototype.onCountryCodeReceived = function (data) {
        this.addressFormGroup.controls['CountryCode'].setValue(data.CountryCode);
        this.addressFormGroup.controls['CountryDesc'].setValue(data.CountryDesc);
        this.addressFormGroup.updateValueAndValidity();
    };
    AddressComponent.prototype.onBtnSendToNAVClick = function () {
        var _this = this;
        this.sysCharParams = this.storeData['processedSysChar'];
        if (this.sysCharParams['vSCSendOneOffAccntToNAV'] === true) {
            this.fetchAccountData('SendToNAV', {}, { AccountNumber: this.storeData['formGroup'].main.AccountNumber, CategoryCode: this.storeData['formGroup'].accountManagement.CategoryCode }).subscribe(function (e) {
                if (e.status === 'failure') {
                    _this.errorService.emitError(e.oResponse);
                }
                else {
                    var data = e.SentToNAVStatus;
                    if (data) {
                        _this.addressFormGroup.controls['SentToNAVStatus'].setValue(data);
                        if (_this.addressFormGroup.controls['SentToNAVStatus'].value() === '') {
                            _this.fieldVisibility.tdSentToNAVStatusNOTSENT = true;
                            _this.fieldVisibility.tdSentToNAVStatusOK = false;
                            _this.fieldVisibility.tdSentToNAVStatusFAIL = false;
                            _this.addressFormGroup.controls['BtnSendToNAV'].enable();
                        }
                        else if (_this.addressFormGroup.controls['SentToNAVStatus'].value() === 'OK') {
                            _this.fieldVisibility.tdSentToNAVStatusNOTSENT = false;
                            _this.fieldVisibility.tdSentToNAVStatusOK = true;
                            _this.fieldVisibility.tdSentToNAVStatusFAIL = false;
                            _this.addressFormGroup.controls['BtnSendToNAV'].disable();
                        }
                        else {
                            _this.fieldVisibility.tdSentToNAVStatusNOTSENT = false;
                            _this.fieldVisibility.tdSentToNAVStatusOK = false;
                            _this.fieldVisibility.tdSentToNAVStatusFAIL = true;
                            _this.addressFormGroup.controls['BtnSendToNAV'].enable();
                        }
                        _this.addressFormGroup.updateValueAndValidity();
                    }
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    AddressComponent.prototype.fetchAccountData = function (functionName, searchParams, postParams) {
        if (searchParams === void 0) { searchParams = {}; }
        if (postParams === void 0) { postParams = {}; }
        this.queryAccount = new URLSearchParams();
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        }
        else {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }
        if (functionName !== '') {
            this.queryAccount.set(this.serviceConstants.Action, '6');
            this.queryAccount.set('Function', functionName);
        }
        for (var key in searchParams) {
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
    };
    AddressComponent.prototype.onCmdGetAddressClick = function (event) {
        var _this = this;
        this.sysCharParams = this.storeData['processedSysChar'];
        this.updateInputParamsForPostCodeSearch();
        if (this.sysCharParams['vSCEnableHopewiserPAF'] === true) {
            if (this.zipCodeEllipsis && typeof this.zipCodeEllipsis !== 'undefined') {
                this.inputParams.parentMode = 'Account';
                this.zipCodeEllipsis.configParams = this.inputParams;
                this.zipCodeEllipsis.contentComponent = ScreenNotReadyComponent;
                this.zipCodeEllipsis.updateComponent();
                setTimeout(function () {
                    _this.zipCodeEllipsis.openModal();
                }, 0);
            }
        }
        else if (this.sysCharParams['vSCEnableDatabasePAF'] === true) {
            if (this.zipCodeEllipsis && typeof this.zipCodeEllipsis !== 'undefined') {
                this.inputParams.parentMode = 'Account';
                this.zipCodeEllipsis.contentComponent = PostCodeSearchComponent;
                this.zipCodeEllipsis.configParams = this.inputParams;
                this.zipCodeEllipsis.updateComponent();
                setTimeout(function () {
                    _this.zipCodeEllipsis.openModal();
                }, 0);
            }
        }
    };
    AddressComponent.prototype.onAccountPostcodeChange = function () {
        var _this = this;
        this.sysCharParams = this.storeData['processedSysChar'];
        var accountPostcode = this.addressFormGroup.controls['AccountPostcode'].value;
        accountPostcode = accountPostcode ? accountPostcode : '';
        if ((this.sysCharParams['vEnablePostcodeDefaulting'] === true) && (this.sysCharParams['vSCEnableDatabasePAF'] === true) && this.trim(accountPostcode) !== '') {
            var postObj = {
                'Function': 'GetPostCodeTownAndState',
                'Postcode': this.addressFormGroup.controls['AccountPostcode'].value ? this.addressFormGroup.controls['AccountPostcode'].value : '',
                'State': this.addressFormGroup.controls['AccountAddressLine5'].value ? this.addressFormGroup.controls['AccountAddressLine5'].value : '',
                'Town': this.addressFormGroup.controls['AccountAddressLine4'].value ? this.addressFormGroup.controls['AccountAddressLine4'].value : ''
            };
            this.postAccountEntryData('GetPostCodeTownAndState', {}, postObj).subscribe(function (e) {
                if (e.status === 'failure') {
                    _this.errorService.emitError(e.oResponse);
                }
                else {
                    var uniqueRecordFound = e['UniqueRecordFound'];
                    if (uniqueRecordFound) {
                        _this.addressFormGroup.controls['AccountPostcode'].setValue(e['Postcode'] ? e['Postcode'] : '');
                        _this.addressFormGroup.controls['AccountAddressLine5'].setValue(e['State'] ? e['State'] : '');
                        _this.addressFormGroup.controls['AccountAddressLine4'].setValue(e['Town'] ? e['Town'] : '');
                        _this.addressFormGroup.updateValueAndValidity();
                    }
                    else {
                        if (_this.zipCodeEllipsis && typeof (_this.zipCodeEllipsis) !== undefined) {
                            _this.updateInputParamsForPostCodeSearch();
                            _this.inputParams.parentMode = 'Account';
                            _this.zipCodeEllipsis.contentComponent = PostCodeSearchComponent;
                            _this.zipCodeEllipsis.configParams = _this.inputParams;
                            _this.zipCodeEllipsis.updateComponent();
                            setTimeout(function () {
                                _this.zipCodeEllipsis.openModal();
                            }, 0);
                        }
                    }
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    AddressComponent.prototype.postAccountEntryData = function (functionName, params, postdata) {
        this.queryAccount = new URLSearchParams();
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.queryAccount.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.queryAccount.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        }
        else {
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
        for (var key in params) {
            if (key) {
                this.queryAccount.set(key, params[key]);
            }
        }
        return this.httpService.makePostRequest(this.method, this.module, this.operation, this.queryAccount, postdata);
    };
    AddressComponent.prototype.onFocusOut = function (event) {
        this.sysCharParams = this.storeData['processedSysChar'];
        if (event.target) {
            var elementValue = event.target.value;
            var _paddedValue = elementValue;
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
                var activeElement = document.activeElement;
                var id = activeElement ? (activeElement.getAttribute('id') ? activeElement.getAttribute('id') : '') : '';
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
        }
    };
    ;
    AddressComponent.prototype.accountPostcode_onchange = function (event) {
        if (event.target) {
            if (event.target.id === 'AccountPostcode') {
                this.onAccountPostcodeChange();
            }
        }
    };
    ;
    AddressComponent.prototype.numberFormatValue = function (elementValue, maxLength) {
        var paddedValue = elementValue;
        if (elementValue.length < maxLength) {
            paddedValue = this.numberPadding(elementValue, 9);
        }
        return paddedValue;
    };
    AddressComponent.prototype.numberPadding = function (num, size) {
        var s = num + '';
        while (s.length < size)
            s = '0' + s;
        return s;
    };
    AddressComponent.prototype.renderCountryCodeDesc = function (countryCode) {
        var _this = this;
        var data = [
            {
                'table': 'riCountry',
                'query': { 'riCountryCode': countryCode },
                'fields': ['riCountryDescription']
            }
        ];
        this.lookUpRecord(data, 1).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0] && e['results'][0].length > 0) {
                    var riCountryDescription_1 = e['results'][0][0].riCountryDescription;
                    if (riCountryDescription_1) {
                        _this.zone.run(function () {
                            _this.countrySelected = {
                                id: countryCode,
                                text: countryCode + ' - ' + riCountryDescription_1
                            };
                        });
                    }
                }
            }
        }, function (error) {
        });
    };
    AddressComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.queryLookUp.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.queryLookUp.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        }
        else {
            this.queryLookUp.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            this.queryLookUp.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    };
    AddressComponent.prototype.btnAmendContactOnClick = function () {
        this.cmdContactDetails('all');
    };
    AddressComponent.prototype.btnEmergencyContactOnClick = function () {
        this.cmdContactDetails('emergency');
    };
    AddressComponent.prototype.cmdContactDetails = function (cWhich) {
        var mode = '';
        if (cWhich === 'all') {
            mode = 'Account';
        }
        else {
            mode = 'AccountEmergency';
        }
        var accNumber = '';
        var accName = '';
        if (this.storeData && this.storeData['formGroup']) {
            accNumber = this.storeData['formGroup'].main.controls['AccountNumber'].value;
            accName = this.storeData['formGroup'].main.controls['AccountName'].value;
        }
        this.router.navigate(['/application/ContactPersonMaintenance'], { queryParams: { parentMode: mode, accountNumber: accNumber, accountName: accName } });
    };
    AddressComponent.prototype.getData = function (data, dataType) {
        return (data) ? data.trim() : '';
    };
    AddressComponent.prototype.trim = function (data) {
        return (data) ? data.trim() : data;
    };
    AddressComponent.prototype.updateInputParamsForPostCodeSearch = function () {
        this.inputParams.AccountAddressLine4 = (this.addressFormGroup.controls['AccountAddressLine4'].value) ? this.addressFormGroup.controls['AccountAddressLine4'].value : '';
        this.inputParams.AccountAddressLine5 = (this.addressFormGroup.controls['AccountAddressLine5'].value) ? this.addressFormGroup.controls['AccountAddressLine5'].value : '';
        this.inputParams.AccountPostCode = (this.addressFormGroup.controls['AccountPostcode'].value) ? this.addressFormGroup.controls['AccountPostcode'].value : '';
    };
    AddressComponent.prototype.modalHidden = function () {
    };
    AddressComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-maintenance-address',
                    templateUrl: 'address.html'
                },] },
    ];
    AddressComponent.ctorParameters = [
        { type: NgZone, },
        { type: FormBuilder, },
        { type: Logger, },
        { type: Store, },
        { type: HttpService, },
        { type: ServiceConstants, },
        { type: LocaleTranslationService, },
        { type: ErrorService, },
        { type: MessageService, },
        { type: Router, },
        { type: Utils, },
    ];
    AddressComponent.propDecorators = {
        'zipCodeEllipsis': [{ type: ViewChild, args: ['zipCodeEllipsis',] },],
    };
    return AddressComponent;
}());
