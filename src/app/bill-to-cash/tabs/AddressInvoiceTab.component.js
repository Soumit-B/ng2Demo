import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { InvoiceActionTypes } from './../../actions/invoice';
import { Utils } from './../../../shared/services/utility';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { HttpService } from './../../../shared/services/http-service';
import { URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { BillToCashConstants } from './../bill-to-cash-constants';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { PostCodeSearchComponent } from './../../internal/search/iCABSBPostcodeSearch.component';
import { Logger } from '@nsalaun/ng2-logger';
export var AddressInvoiceTabComponent = (function () {
    function AddressInvoiceTabComponent(store, formBuilder, httpService, serviceConstants, utils, router, localeTranslateService, ajaxconstant, logger) {
        var _this = this;
        this.store = store;
        this.formBuilder = formBuilder;
        this.httpService = httpService;
        this.serviceConstants = serviceConstants;
        this.utils = utils;
        this.router = router;
        this.localeTranslateService = localeTranslateService;
        this.ajaxconstant = ajaxconstant;
        this.logger = logger;
        this.buttonStates = {
            GetAddress: true,
            PremisesAddress: true,
            AccountAddress: true,
            InvoiceAddress: true,
            CopyInvoice: true
        };
        this.elementShowHide = {
            GetAddress: true,
            AddressLine3: true,
            AddressLine3Required: false,
            InvoiceAddressLine4Required: false,
            InvoiceAddressLine5Required: false,
            PostCode: true,
            GPSCoordinates: false,
            ContactDetails: false
        };
        this.storeFormKey = 'AddressInvoice';
        this.maxLen = 40;
        this.showPremiseSearchEllipsis = true;
        this.premiseSearchComponent = PremiseSearchComponent;
        this.postcodeSearchComponent = PostCodeSearchComponent;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: false
        };
        this.inputParamsPremise = {};
        this.inputParamsPostcode = {};
        this.ajaxSource = new BehaviorSubject(0);
        this.isRequesting = false;
        this.disableForm = true;
        this.storeSubscription = this.store.select('invoice').subscribe(function (data) {
            _this.storeUpdateHandler(data);
        });
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.ajaxSubscription = this.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                switch (event) {
                    case _this.ajaxconstant.START:
                        _this.isRequesting = true;
                        break;
                    case _this.ajaxconstant.COMPLETE:
                        _this.isRequesting = false;
                        break;
                }
            }
        });
    }
    AddressInvoiceTabComponent.prototype.ngOnInit = function () {
        this.buidForm();
        if (!this.storeMode['searchMode']) {
            this.buttonStates.PremisesAddress = false;
            this.buttonStates.AccountAddress = false;
            this.buttonStates.InvoiceAddress = false;
            this.buttonStates.CopyInvoice = false;
        }
        this.localeTranslateService.setUpTranslation();
    };
    AddressInvoiceTabComponent.prototype.ngOnDestroy = function () {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
        if (this.ajaxSubscription) {
            this.ajaxSubscription.unsubscribe();
        }
    };
    AddressInvoiceTabComponent.prototype.storeUpdateHandler = function (data) {
        this.storeMode = {};
        this.storeCode = {};
        this.storeParams = {};
        this.storeInvoice = {};
        this.storeOtherDetails = {};
        this.storeSentFromParent = {};
        if (data) {
            if (data['mode']) {
                this.storeMode = data['mode'];
            }
            if (data['code']) {
                this.storeCode = data['code'];
            }
            if (data['params']) {
                this.storeParams = data['params'];
            }
            if (data['invoice']) {
                this.storeInvoice = data['invoice'];
            }
            if (data['otherDetails']) {
                this.storeOtherDetails = data['otherDetails'];
            }
            if (data['sentFromParent']) {
                this.storeSentFromParent = data['sentFromParent'];
            }
            if (data['syschars']) {
                this.storeSysChars = data['syschars'];
            }
        }
        switch (data && data['action']) {
            case InvoiceActionTypes.SAVE_DATA:
                this.storeData = data['data'];
                this.setFormData();
                break;
            case InvoiceActionTypes.SAVE_MODE:
                if (this.storeSysChars['vSCMultiContactInd']) {
                    this.elementShowHide.ContactDetails = true;
                }
                if (this.storeMode['addMode']) {
                    this.elementShowHide.ContactDetails = false;
                }
                break;
            case InvoiceActionTypes.SAVE_SYSCHAR:
                this.storeSysChars = data['syschars'];
                if (this.storeSysChars['vSCMultiContactInd']) {
                    this.elementShowHide.ContactDetails = true;
                }
                this.updateViewFromSysChar();
                break;
            case InvoiceActionTypes.SAVE_PARAMS:
                this.storeParams = data['params'];
                break;
            case InvoiceActionTypes.ADDRESS_DATA_RECEIVED:
                this.onAddressDataReceived();
                break;
            case InvoiceActionTypes.SET_FORM_GROUPS:
                this.storeFormGroup = data['formGroup'];
                break;
            case InvoiceActionTypes.SET_FORM_GROUPS:
                this.storeFormGroup = data['formGroup'];
                break;
            case InvoiceActionTypes.RESET_FORMS:
                this.setFormData();
                break;
            case InvoiceActionTypes.DISABLE_FORMS:
                this.disableForm = true;
                break;
        }
    };
    AddressInvoiceTabComponent.prototype.buidForm = function () {
        this.addressInvoiceFormGroup = this.formBuilder.group({
            InvoiceName: [{ value: '', disabled: false }, Validators.required],
            InvoiceAddressLine1: [{ value: '', disabled: false }, Validators.required],
            InvoiceAddressLine2: [{ value: '', disabled: false }],
            InvoiceAddressLine3: [{ value: '', disabled: false }],
            InvoiceAddressLine4: [{ value: '', disabled: false }],
            InvoiceAddressLine5: [{ value: '', disabled: false }],
            InvoicePostcode: [{ value: '', disabled: false }, Validators.required],
            InvoiceContactName: [{ value: '', disabled: true }],
            InvoiceContactDepartment: [{ value: '', disabled: true }],
            InvoiceContactPosition: [{ value: '', disabled: true }],
            InvoiceContactMobile: [{ value: '', disabled: true }],
            InvoiceContactTelephone: [{ value: '', disabled: true }],
            InvoiceContactFax: [{ value: '', disabled: true }],
            InvoiceContactEmail: [{ value: '', disabled: true }],
            InvoiceGPSCoordinateX: [{ value: '', disabled: true }],
            InvoiceGPSCoordinateY: [{ value: '', disabled: true }]
        });
        this.store.dispatch({
            type: InvoiceActionTypes.SET_FORM_GROUPS,
            payload: {
                name: this.storeFormKey,
                form: this.addressInvoiceFormGroup
            }
        });
        this.addressInvoiceFormGroup.disable();
    };
    AddressInvoiceTabComponent.prototype.setFormData = function () {
        this.addressInvoiceFormGroup.reset();
        try {
            this.addressInvoiceFormGroup.controls['InvoiceName'].setValue(this.storeData['InvoiceName'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceAddressLine1'].setValue(this.storeData['InvoiceAddressLine1'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceAddressLine2'].setValue(this.storeData['InvoiceAddressLine2'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceAddressLine3'].setValue(this.storeData['InvoiceAddressLine3'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceAddressLine4'].setValue(this.storeData['InvoiceAddressLine4'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceAddressLine5'].setValue(this.storeData['InvoiceAddressLine5'].trim());
            this.addressInvoiceFormGroup.controls['InvoicePostcode'].setValue(this.storeData['InvoicePostcode'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceContactName'].setValue(this.storeData['InvoiceContactName'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceContactDepartment'].setValue(this.storeData['InvoiceContactDepartment'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceContactPosition'].setValue(this.storeData['InvoiceContactPosition'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceContactMobile'].setValue(this.storeData['InvoiceContactMobile'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceContactTelephone'].setValue(this.storeData['InvoiceContactTelephone'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceContactFax'].setValue(this.storeData['InvoiceContactFax'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceContactEmail'].setValue(this.storeData['InvoiceContactEmail'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceGPSCoordinateX'].setValue(this.storeData['InvoiceGPSCoordinateX'].trim());
            this.addressInvoiceFormGroup.controls['InvoiceGPSCoordinateY'].setValue(this.storeData['InvoiceGPSCoordinateY'].trim());
        }
        catch (ignore) {
        }
        this.disableForm = false;
        this.addressInvoiceFormGroup.enable();
        this.sensitiseContactDetails(!this.storeSysChars['vSCMultiContactInd']);
    };
    AddressInvoiceTabComponent.prototype.updateViewFromSysChar = function () {
        var sysCharsValue = this.storeSysChars;
        this.elementShowHide.GetAddress = true;
        if (!sysCharsValue['vSCEnableHopewiserPAF'] && !sysCharsValue['vSCEnableDatabasePAF']) {
            this.elementShowHide.GetAddress = false;
        }
        if (sysCharsValue['vDisableFieldList'].indexOf('AddressLine3') >= 0) {
            this.elementShowHide.AddressLine3 = false;
        }
        else if (sysCharsValue['vSCAddressLine3Logical']) {
            this.addressInvoiceFormGroup.controls['InvoiceAddressLine3'].setValidators(Validators.required);
            this.elementShowHide.AddressLine3Required = true;
        }
        if (sysCharsValue['vSCAddressLine4Logical'] ||
            !(!sysCharsValue['vSCEnablePostcodeSuburbLog'] && sysCharsValue['vSCEnableValidatePostcodeSuburb'])) {
            this.addressInvoiceFormGroup.controls['InvoiceAddressLine4'].setValidators(Validators.required);
            this.elementShowHide.InvoiceAddressLine4Required = true;
        }
        if (sysCharsValue['vSCAddressLine5Logical']) {
            this.addressInvoiceFormGroup.controls['InvoiceAddressLine5'].setValidators(Validators.required);
            this.elementShowHide.InvoiceAddressLine5Required = true;
        }
        if (sysCharsValue['vSCHidePostcode']) {
            this.addressInvoiceFormGroup.controls['InvoicePostcode'].clearValidators();
            this.elementShowHide.PostCode = false;
        }
        if (sysCharsValue['vSCEnableGPSCoordinates']) {
            this.elementShowHide.GPSCoordinates = true;
        }
        this.elementShowHide.ContactDetails = true;
        if (!sysCharsValue['vSCMultiContactInd'] || this.storeMode['addMode']) {
            this.elementShowHide.ContactDetails = false;
        }
        if (sysCharsValue['vSCEnableMaxAddress']) {
            this.maxLen = sysCharsValue['vSCEnableMaxAddressValue'];
        }
        this.sensitiseContactDetails(!sysCharsValue['vSCMultiContactInd']);
    };
    AddressInvoiceTabComponent.prototype.onAddressDataReceived = function () {
        var addressForTab = this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['Tab']];
        var addressType = this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['RequestedAddressType']];
        if (addressForTab !== this.storeFormKey) {
            return;
        }
        switch (addressType) {
            case BillToCashConstants.c_o_ADDRESS_TYPES['Invoice']:
                this.onInvoiceAddressDataReceived();
                break;
            case BillToCashConstants.c_o_ADDRESS_TYPES['General']:
                this.onInvoiceAddressDataReceived();
                break;
        }
    };
    AddressInvoiceTabComponent.prototype.navigateToGetAddress = function (page) {
        this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['Tab']] = this.storeFormKey;
        this.store.dispatch({
            type: InvoiceActionTypes.SAVE_PARAMS,
            payload: this.storeParams
        });
        if (page === 'GetPremisesAddress') {
            this.store.dispatch({
                type: InvoiceActionTypes.NAVIGATE,
                payload: page
            });
        }
    };
    AddressInvoiceTabComponent.prototype.getInvoiceTabPremisesAddress = function () {
        var mode = 'AddInvoiceGroup';
        this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['RequestedAddressType']] = BillToCashConstants.c_o_ADDRESS_TYPES['Premises'];
        this.showPremiseSearchEllipsis = false;
        mode = 'AddInvoiceGroup';
        if (this.storeFormGroup['main'].controls['InvoiceGroupNumber'].value) {
            mode = 'InvoiceGroupGetAddress';
        }
        this.inputParamsPremise = {
            parentMode: mode,
            AccountNumber: this.storeInvoice[this.serviceConstants.AccountNumber],
            AccountName: this.storeInvoice['AccountName'],
            InvoiceGroupNumber: this.storeInvoice['InvoiceGroupNumber']
        };
        this.premiseSearchEllipsis.childConfigParams = this.inputParamsPremise;
        this.premiseSearchEllipsis.openModal();
    };
    AddressInvoiceTabComponent.prototype.onPremisesAddressDataReceived = function (data) {
        var premiseNumber = data[this.serviceConstants.PremiseNumber];
        var contractNumber = data[this.serviceConstants.ContractNumber];
        var formData = {};
        if (!premiseNumber) {
            return;
        }
        if (!contractNumber) {
            this.getInvoiceAddressFromAccountNumber();
            return;
        }
        formData[this.serviceConstants.PremiseNumber] = premiseNumber;
        formData[this.serviceConstants.ContractNumber] = contractNumber;
        formData[this.serviceConstants.Function] = 'GetInvAddressFromPremise';
        this.updateAddressInForm(formData);
    };
    AddressInvoiceTabComponent.prototype.getInvoiceTabAccountAddress = function () {
        var accountNumber = this.storeFormGroup['main'].controls[this.serviceConstants.AccountNumber].value;
        var formData = {};
        formData[this.serviceConstants.AccountNumber] = accountNumber;
        formData[this.serviceConstants.Function] = 'GetInvAddressFromAccount';
        this.updateAddressInForm(formData);
    };
    AddressInvoiceTabComponent.prototype.getInvoiceTabInvoiceAddress = function () {
        this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['RequestedAddressType']] = BillToCashConstants.c_o_ADDRESS_TYPES['Invoice'];
        this.navigateToGetAddress('GetInvoiceAddress');
    };
    AddressInvoiceTabComponent.prototype.onInvoiceAddressDataReceived = function () {
        var accountNumber = this.storeFormGroup['main'].controls[this.serviceConstants.AccountNumber].value;
        var invoiceGroupNumber = this.storeSentFromParent[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['InvoiceGroupNumber']];
        var formData = {};
        formData[this.serviceConstants.AccountNumber] = accountNumber;
        formData[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['InvoiceGroupNumber']] = invoiceGroupNumber;
        formData[this.serviceConstants.Function] = 'GetInvAddressFromInv';
        this.updateAddressInForm(formData);
    };
    AddressInvoiceTabComponent.prototype.getInvoiceAddressFromAccountNumber = function () {
        var premiseNumber = this.storeParams[this.serviceConstants.PremiseNumber];
        var accountNumber = this.storeInvoice[this.serviceConstants.AccountNumber];
        var formData = {};
        formData[this.serviceConstants.PremiseNumber] = premiseNumber;
        formData[this.serviceConstants.AccountNumber] = accountNumber;
        formData[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['Detail']] = BillToCashConstants.c_o_REQUEST_PARAM_VALUES['Invoice'];
        formData[this.serviceConstants.Function] = 'GetAddressFromAccountNumber';
        this.updateAddressInForm(formData);
    };
    AddressInvoiceTabComponent.prototype.prepareAddressQuery = function () {
        var query = new URLSearchParams();
        query.set(this.serviceConstants.BusinessCode, this.storeCode[BillToCashConstants.c_o_STORE_KEY_NAMES['CodeBusiness']]);
        query.set(this.serviceConstants.CountryCode, this.storeCode[BillToCashConstants.c_o_STORE_KEY_NAMES['CodeCountry']]);
        query.set(this.serviceConstants.Action, '6');
        return query;
    };
    AddressInvoiceTabComponent.prototype.updateAddressInForm = function (formData) {
        var _this = this;
        this.addressQuery = new URLSearchParams();
        this.addressQuery = this.prepareAddressQuery();
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'], this.addressQuery, formData).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                var errorObject = {};
                errorObject[BillToCashConstants.c_o_ERROROBJECT_KEYS.message] = data.errorMessage;
                _this.dispatchError(errorObject);
                return;
            }
            if (!data['InvoiceName']) {
                return;
            }
            _this.addressInvoiceFormGroup.controls['InvoiceName'].setValue(data['InvoiceName']);
            _this.addressInvoiceFormGroup.controls['InvoiceAddressLine1'].setValue(data['InvoiceAddressLine1']);
            _this.addressInvoiceFormGroup.controls['InvoiceAddressLine2'].setValue(data['InvoiceAddressLine2']);
            _this.addressInvoiceFormGroup.controls['InvoiceAddressLine3'].setValue(data['InvoiceAddressLine3']);
            _this.addressInvoiceFormGroup.controls['InvoiceAddressLine4'].setValue(data['InvoiceAddressLine4']);
            _this.addressInvoiceFormGroup.controls['InvoiceAddressLine5'].setValue(data['InvoiceAddressLine5']);
            _this.addressInvoiceFormGroup.controls['InvoicePostcode'].setValue(data['InvoicePostcode']);
            _this.addressInvoiceFormGroup.controls['InvoiceContactName'].setValue(data['InvoiceContactName']);
            _this.addressInvoiceFormGroup.controls['InvoiceContactDepartment'].setValue(data['InvoiceContactDepartment']);
            _this.addressInvoiceFormGroup.controls['InvoiceContactPosition'].setValue(data['InvoiceContactPosition']);
            _this.addressInvoiceFormGroup.controls['InvoiceContactMobile'].setValue(data['InvoiceContactMobile']);
            _this.addressInvoiceFormGroup.controls['InvoiceContactTelephone'].setValue(data['InvoiceContactTelephone']);
            _this.addressInvoiceFormGroup.controls['InvoiceContactFax'].setValue(data['InvoiceContactFax']);
            _this.addressInvoiceFormGroup.controls['InvoiceContactEmail'].setValue(data['InvoiceContactEmail']);
            _this.addressInvoiceFormGroup.controls['InvoiceGPSCoordinateX'].setValue(data['InvoiceGPSCoordinateX']);
            _this.addressInvoiceFormGroup.controls['InvoiceGPSCoordinateY'].setValue(data['InvoiceGPSCoordinateY']);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.dispatchGeneralError(error);
        });
    };
    AddressInvoiceTabComponent.prototype.onGeneralAddressDataReceived = function () {
        this.addressInvoiceFormGroup.controls['InvoiceAddressLine5'].setValue(this.storeOtherDetails['InvoiceAddressLine5']);
        this.addressInvoiceFormGroup.controls['InvoicePostcode'].setValue(this.storeOtherDetails['InvoicePostcode']);
    };
    AddressInvoiceTabComponent.prototype.onContactDetailsReceived = function () {
        var data = this.storeSentFromParent;
        this.addressInvoiceFormGroup.controls['InvoiceContactName'].setValue(data['ContactName']);
        this.addressInvoiceFormGroup.controls['InvoiceContactDepartment'].setValue(data['ContactDepartment']);
        this.addressInvoiceFormGroup.controls['InvoiceContactPosition'].setValue(data['ContactPosition']);
        this.addressInvoiceFormGroup.controls['InvoiceContactMobile'].setValue(data['ContactMobileNumber']);
        this.addressInvoiceFormGroup.controls['InvoiceContactTelephone'].setValue(data['ContactTelephone']);
        this.addressInvoiceFormGroup.controls['InvoiceContactFax'].setValue(data['ContactFax']);
        this.addressInvoiceFormGroup.controls['InvoiceContactEmail'].setValue(data['ContactEmailAddress']);
    };
    AddressInvoiceTabComponent.prototype.dispatchError = function (error) {
        this.store.dispatch({
            type: InvoiceActionTypes.DISPATCH_ERROR,
            payload: error
        });
    };
    AddressInvoiceTabComponent.prototype.dispatchGeneralError = function (error) {
        var errorObject = {};
        errorObject[BillToCashConstants.c_o_ERROROBJECT_KEYS.isLogRequired] = true;
        errorObject[BillToCashConstants.c_o_ERROROBJECT_KEYS.error] = error;
        this.dispatchError(errorObject);
    };
    AddressInvoiceTabComponent.prototype.sensitiseContactDetails = function (enable) {
        if (!this.addressInvoiceFormGroup) {
            return;
        }
        if (enable) {
            this.addressInvoiceFormGroup.controls['InvoiceContactName'].enable();
            this.addressInvoiceFormGroup.controls['InvoiceContactPosition'].enable();
            this.addressInvoiceFormGroup.controls['InvoiceContactDepartment'].enable();
            this.addressInvoiceFormGroup.controls['InvoiceContactMobile'].enable();
            this.addressInvoiceFormGroup.controls['InvoiceContactPosition'].enable();
            this.addressInvoiceFormGroup.controls['InvoiceContactTelephone'].enable();
            this.addressInvoiceFormGroup.controls['InvoiceContactFax'].enable();
            this.addressInvoiceFormGroup.controls['InvoiceContactEmail'].enable();
        }
        else {
            this.addressInvoiceFormGroup.controls['InvoiceContactName'].disable();
            this.addressInvoiceFormGroup.controls['InvoiceContactPosition'].disable();
            this.addressInvoiceFormGroup.controls['InvoiceContactDepartment'].disable();
            this.addressInvoiceFormGroup.controls['InvoiceContactMobile'].disable();
            this.addressInvoiceFormGroup.controls['InvoiceContactPosition'].disable();
            this.addressInvoiceFormGroup.controls['InvoiceContactTelephone'].disable();
            this.addressInvoiceFormGroup.controls['InvoiceContactFax'].disable();
            this.addressInvoiceFormGroup.controls['InvoiceContactEmail'].disable();
        }
    };
    AddressInvoiceTabComponent.prototype.getAddress = function () {
        this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['Tab']] = this.storeFormKey;
        this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['RequestedAddressType']] = BillToCashConstants.c_o_ADDRESS_TYPES['General'];
        this.store.dispatch({
            type: InvoiceActionTypes.NAVIGATE,
            payload: 'GetAddress'
        });
    };
    AddressInvoiceTabComponent.prototype.getAddressClick = function () {
        var sysCharsValue = this.storeSysChars;
        if (sysCharsValue['vSCEnableHopewiserPAF']) {
            this.logger.log('To open riMPAFSearch.htm');
        }
        else if (sysCharsValue['vEnablePostcodeDefaulting']) {
            this.inputParamsPostcode = {
                parentMode: 'Invoice',
                InvoicePostCode: this.addressInvoiceFormGroup.controls['InvoicePostcode'].value,
                InvoiceAddressLine5: this.addressInvoiceFormGroup.controls['InvoiceAddressLine5'].value,
                InvoiceAddressLine4: this.addressInvoiceFormGroup.controls['InvoiceAddressLine4'].value
            };
            this.postcodeSearchEllipsis.childConfigParams = this.inputParamsPostcode;
            this.postcodeSearchEllipsis.openModal();
        }
    };
    AddressInvoiceTabComponent.prototype.onPostcodeDataReturn = function (data) {
        this.addressInvoiceFormGroup.controls['InvoiceAddressLine4'].setValue(data['InvoiceAddressLine4']);
        this.addressInvoiceFormGroup.controls['InvoiceAddressLine5'].setValue(data['InvoiceAddressLine5']);
        this.addressInvoiceFormGroup.controls['InvoicePostcode'].setValue(data['InvoicePostcode']);
    };
    AddressInvoiceTabComponent.prototype.getContactDetails = function () {
        this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['Tab']] = this.storeFormKey;
        this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['RequestedAddressType']] = 'contactdetails';
        this.store.dispatch({
            type: InvoiceActionTypes.NAVIGATE,
            payload: 'ContactDetailsInv'
        });
    };
    AddressInvoiceTabComponent.prototype.onInvoiceNameChange = function () {
        var sysChars = this.storeSysChars;
        if (this.storeMode && !this.storeMode['addMode']) {
            return;
        }
        if (sysChars['vSCRunPAFSearchOn1stAddressLine']) {
            return;
        }
        if ((sysChars['vSCEnableHopewiserPAF'] || sysChars['vSCEnableDatabasePAF'])) {
            this.getAddress();
        }
    };
    AddressInvoiceTabComponent.prototype.onInvoiceAddressLine4Blur = function () {
        var sysChars = this.storeSysChars;
        var inputValue = this.addressInvoiceFormGroup.controls['InvoiceAddressLine4'].value;
        if (sysChars['vSCAddressLine4Required'] && inputValue === '' && sysChars['vSCEnableValidatePostcodeSuburb']) {
            this.getAddressClick();
        }
    };
    AddressInvoiceTabComponent.prototype.onInvoiceAddressLine5Blur = function () {
        var sysChars = this.storeSysChars;
        var inputValue = this.addressInvoiceFormGroup.controls['InvoiceAddressLine5'].value;
        if (sysChars['vSCAddressLine5Required'] && inputValue === '' && sysChars['vSCEnableValidatePostcodeSuburb']) {
            this.getAddressClick();
        }
    };
    AddressInvoiceTabComponent.prototype.onPostCodeBlur = function () {
        var inputValue = this.addressInvoiceFormGroup.controls['InvoicePostcode'].value;
        if (this.storeSysChars['vSCPostCodeRequired'] && inputValue === '') {
            this.getAddressClick();
        }
    };
    AddressInvoiceTabComponent.prototype.onPostCodeChange = function () {
        var _this = this;
        var inputPostCode = this.addressInvoiceFormGroup.controls['InvoicePostcode'].value;
        var inputInvoiceAddressLine4 = this.addressInvoiceFormGroup.controls['InvoiceAddressLine4'].value;
        var inputState = this.addressInvoiceFormGroup.controls['InvoiceAddressLine5'].value;
        this.postcodeQuery = new URLSearchParams();
        if (!this.storeSysChars['vEnablePostcodeDefaulting'] || !this.storeSysChars['vSCEnableDatabasePAF'] || !inputPostCode) {
            return;
        }
        this.postcodeQuery.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.postcodeQuery.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.postcodeQuery.set(BillToCashConstants.c_o_REQUEST_PARAM_NAMES['Function'], 'GetPostCodeTownAndState');
        this.postcodeQuery.set(this.serviceConstants.Action, '0');
        this.postcodeQuery.set(BillToCashConstants.c_o_REQUEST_PARAM_NAMES['State'], inputState);
        this.postcodeQuery.set(BillToCashConstants.c_o_REQUEST_PARAM_NAMES['Town'], inputInvoiceAddressLine4);
        this.postcodeQuery.set(BillToCashConstants.c_o_REQUEST_PARAM_NAMES['PostCode'], inputPostCode);
        this.httpService.makeGetRequest(BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'], this.postcodeQuery).subscribe(function (data) {
            if (data.errorMessage) {
                _this.dispatchError({
                    msg: data.errorMessage
                });
                return;
            }
            if (!_this.utils.convertResponseValueToCheckboxInput(data.UniqueRecordFound)) {
                _this.postcodeSearchEllipsis.childConfigParams = {
                    parentMode: 'Invoice',
                    InvoicePostCode: _this.addressInvoiceFormGroup.controls['InvoicePostcode'].value,
                    InvoiceAddressLine5: _this.addressInvoiceFormGroup.controls['InvoiceAddressLine5'].value,
                    InvoiceAddressLine4: _this.addressInvoiceFormGroup.controls['InvoiceAddressLine4'].value
                };
                _this.postcodeSearchEllipsis.openModal();
                return;
            }
            _this.addressInvoiceFormGroup.controls['InvoicePostcode'].setValue(data.Postcode);
            _this.addressInvoiceFormGroup.controls['InvoiceAddressLine4'].setValue(data.Town);
            _this.addressInvoiceFormGroup.controls['InvoiceAddressLine5'].setValue(data.State);
        }, function (error) {
            _this.dispatchGeneralError(error);
        });
    };
    AddressInvoiceTabComponent.prototype.copyInvoice = function () {
        var invFormGroup = this.addressInvoiceFormGroup;
        var statFormGroup = this.storeFormGroup['AddressStatement'];
        for (var control in invFormGroup['controls']) {
            if (!control) {
                continue;
            }
            var statementControlName = control.replace('Invoice', 'Statement');
            if (statFormGroup['controls'][statementControlName] && invFormGroup['controls'][control]) {
                statFormGroup['controls'][statementControlName].setValue(invFormGroup['controls'][control].value);
            }
        }
    };
    AddressInvoiceTabComponent.prototype.onPremiseDataReturn = function (data) {
        var _this = this;
        this.showPremiseSearchEllipsis = true;
        if (!data || !data.PremiseNumber || !data.ContractNumber) {
            return;
        }
        var getAddressQuery = new URLSearchParams();
        var formData = {};
        getAddressQuery.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        getAddressQuery.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        getAddressQuery.set(this.serviceConstants.Action, '6');
        formData[this.serviceConstants.ContractNumber] = data.ContractNumber;
        formData[this.serviceConstants.PremiseNumber] = data.PremiseNumber;
        formData[this.serviceConstants.Function] = 'GetInvAddressFromPremise';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'], getAddressQuery, formData).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                var errorObject = {};
                errorObject[BillToCashConstants.c_o_ERROROBJECT_KEYS.message] = data.errorMessage;
                _this.dispatchError(errorObject);
                return;
            }
            for (var key in data) {
                if (key) {
                    _this.addressInvoiceFormGroup.controls[key].setValue(data[key]);
                }
            }
        }, function (error) {
            _this.dispatchGeneralError(error);
        });
    };
    AddressInvoiceTabComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-address-invoice-tab',
                    templateUrl: 'AddressInvoiceTab.html'
                },] },
    ];
    AddressInvoiceTabComponent.ctorParameters = [
        { type: Store, },
        { type: FormBuilder, },
        { type: HttpService, },
        { type: ServiceConstants, },
        { type: Utils, },
        { type: Router, },
        { type: LocaleTranslationService, },
        { type: AjaxObservableConstant, },
        { type: Logger, },
    ];
    AddressInvoiceTabComponent.propDecorators = {
        'premiseSearchEllipsis': [{ type: ViewChild, args: ['premiseSearchEllipsis',] },],
        'postcodeSearchEllipsis': [{ type: ViewChild, args: ['postcodeSearchEllipsis',] },],
    };
    return AddressInvoiceTabComponent;
}());
