import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { InvoiceActionTypes } from './../../actions/invoice';
import { HttpService } from './../../../shared/services/http-service';
import { URLSearchParams } from '@angular/http';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { BillToCashConstants } from './../bill-to-cash-constants';
import { Utils } from './../../../shared/services/utility';
import { Router } from '@angular/router';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { PostCodeSearchComponent } from './../../internal/search/iCABSBPostcodeSearch.component';
import { Logger } from '@nsalaun/ng2-logger';
export var AddressStatementTabComponent = (function () {
    function AddressStatementTabComponent(store, formBuilder, httpService, serviceConstants, utils, router, localeTranslateService, ajaxconstant, logger) {
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
            InvoiceAddress: true
        };
        this.elementShowHide = {
            GetAddress: true,
            AddressLine3: true,
            AddressLine3Required: false,
            StatementAddressLine4Required: false,
            StatementAddressLine5Required: false,
            PostCode: true,
            GPSCoordinates: false,
            ContactDetails: false
        };
        this.inputParamsPremise = {};
        this.storeFormKey = 'AddressStatement';
        this.maxLen = 40;
        this.inputParamsPostcode = {};
        this.showPremiseSearchEllipsis = true;
        this.premiseSearchComponent = PremiseSearchComponent;
        this.postcodeSearchComponent = PostCodeSearchComponent;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: false
        };
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
    AddressStatementTabComponent.prototype.ngOnInit = function () {
        this.buidForm();
        if (!this.storeMode['searchMode']) {
            this.buttonStates.PremisesAddress = false;
            this.buttonStates.AccountAddress = false;
            this.buttonStates.InvoiceAddress = false;
        }
        this.localeTranslateService.setUpTranslation();
    };
    AddressStatementTabComponent.prototype.ngOnDestroy = function () {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
        if (this.ajaxSubscription) {
            this.ajaxSubscription.unsubscribe();
        }
    };
    AddressStatementTabComponent.prototype.storeUpdateHandler = function (data) {
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
            if (data['invoice']) {
                this.storeInvoice = data['invoice'];
            }
            if (data['params']) {
                this.storeParams = data['params'];
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
            case InvoiceActionTypes.SET_FORM_GROUPS:
                this.storeFormGroup = data['formGroup'];
                break;
            case InvoiceActionTypes.ADDRESS_DATA_RECEIVED:
                this.onAddressDataReceived();
                break;
            case InvoiceActionTypes.RESET_FORMS:
                this.setFormData();
                break;
            case InvoiceActionTypes.DISABLE_FORMS:
                this.disableForm = true;
                break;
        }
    };
    AddressStatementTabComponent.prototype.buidForm = function () {
        this.addressStatementFormGroup = this.formBuilder.group({
            StatementName: [{ value: '', disabled: false }, Validators.required],
            StatementAddressLine1: [{ value: '', disabled: false }, Validators.required],
            StatementAddressLine2: [{ value: '', disabled: false }],
            StatementAddressLine3: [{ value: '', disabled: false }],
            StatementAddressLine4: [{ value: '', disabled: false }],
            StatementAddressLine5: [{ value: '', disabled: false }],
            StatementPostcode: [{ value: '', disabled: false }, Validators.required],
            StatementContactName: [{ value: '', disabled: true }],
            StatementContactDepartment: [{ value: '', disabled: true }],
            StatementContactPosition: [{ value: '', disabled: true }],
            StatementContactMobile: [{ value: '', disabled: true }],
            StatementContactTelephone: [{ value: '', disabled: true }],
            StatementContactFax: [{ value: '', disabled: true }],
            StatementContactEmail: [{ value: '', disabled: true }],
            StatementGPSCoordinateX: [{ value: '', disabled: true }],
            StatementGPSCoordinateY: [{ value: '', disabled: true }]
        });
        this.store.dispatch({
            type: InvoiceActionTypes.SET_FORM_GROUPS,
            payload: {
                name: this.storeFormKey,
                form: this.addressStatementFormGroup
            }
        });
        this.addressStatementFormGroup.disable();
    };
    AddressStatementTabComponent.prototype.setFormData = function () {
        this.addressStatementFormGroup.reset();
        try {
            this.addressStatementFormGroup.controls['StatementName'].setValue(this.storeData['StatementName'].trim());
            this.addressStatementFormGroup.controls['StatementAddressLine1'].setValue(this.storeData['StatementAddressLine1'].trim());
            this.addressStatementFormGroup.controls['StatementAddressLine2'].setValue(this.storeData['StatementAddressLine2'].trim());
            this.addressStatementFormGroup.controls['StatementAddressLine3'].setValue(this.storeData['StatementAddressLine3'].trim());
            this.addressStatementFormGroup.controls['StatementAddressLine4'].setValue(this.storeData['StatementAddressLine4'].trim());
            this.addressStatementFormGroup.controls['StatementAddressLine5'].setValue(this.storeData['StatementAddressLine5'].trim());
            this.addressStatementFormGroup.controls['StatementPostcode'].setValue(this.storeData['StatementPostcode'].trim());
            this.addressStatementFormGroup.controls['StatementContactName'].setValue(this.storeData['StatementContactName'].trim());
            this.addressStatementFormGroup.controls['StatementContactDepartment'].setValue(this.storeData['StatementContactDepartment'].trim());
            this.addressStatementFormGroup.controls['StatementContactPosition'].setValue(this.storeData['StatementContactPosition'].trim());
            this.addressStatementFormGroup.controls['StatementContactMobile'].setValue(this.storeData['StatementContactMobile'].trim());
            this.addressStatementFormGroup.controls['StatementContactTelephone'].setValue(this.storeData['StatementContactTelephone'].trim());
            this.addressStatementFormGroup.controls['StatementContactFax'].setValue(this.storeData['StatementContactFax'].trim());
            this.addressStatementFormGroup.controls['StatementContactEmail'].setValue(this.storeData['StatementContactEmail'].trim());
            this.addressStatementFormGroup.controls['StatementGPSCoordinateX'].setValue(this.storeData['StatementGPSCoordinateX'].trim());
            this.addressStatementFormGroup.controls['StatementGPSCoordinateY'].setValue(this.storeData['StatementGPSCoordinateY'].trim());
        }
        catch (ignore) {
        }
        this.addressStatementFormGroup.enable();
        this.disableForm = false;
        this.sensitiseContactDetails(!this.storeSysChars['vSCMultiContactInd']);
    };
    AddressStatementTabComponent.prototype.updateViewFromSysChar = function () {
        var sysCharsValue = this.storeSysChars;
        this.elementShowHide.GetAddress = true;
        if (!(sysCharsValue['vSCEnableHopewiserPAF'] || sysCharsValue['vSCEnableDatabasePAF'])) {
            this.elementShowHide.GetAddress = false;
        }
        if (sysCharsValue['vDisableFieldList'].indexOf('AddressLine3') >= 0) {
            this.elementShowHide.AddressLine3 = false;
        }
        else if (sysCharsValue['vSCEnableAddressLine3'] && sysCharsValue['vSCAddressLine3Logical']) {
            this.addressStatementFormGroup.controls['StatementAddressLine3'].setValidators(Validators.required);
            this.elementShowHide.AddressLine3Required = true;
        }
        if (sysCharsValue['vSCAddressLine4Logical'] ||
            !(!sysCharsValue['vSCEnablePostcodeSuburbLog'] && sysCharsValue['vSCEnableValidatePostcodeSuburb'])) {
            this.addressStatementFormGroup.controls['StatementAddressLine4'].setValidators(Validators.required);
            this.elementShowHide.StatementAddressLine4Required = true;
        }
        if (sysCharsValue['vSCAddressLine5Logical']) {
            this.addressStatementFormGroup.controls['StatementAddressLine5'].setValidators(Validators.required);
            this.elementShowHide.StatementAddressLine4Required = true;
        }
        if (sysCharsValue['vSCHidePostcode']) {
            this.addressStatementFormGroup.controls['StatementPostcode'].clearValidators();
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
    AddressStatementTabComponent.prototype.onAddressDataReceived = function () {
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
    AddressStatementTabComponent.prototype.navigateToGetAddress = function (page) {
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
    AddressStatementTabComponent.prototype.getStatementTabPremisesAddress = function () {
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
    AddressStatementTabComponent.prototype.onPremisesAddressDataReceived = function (data) {
        var premiseNumber = data[this.serviceConstants.PremiseNumber];
        var contractNumber = data[this.serviceConstants.ContractNumber];
        var formData = {};
        if (!premiseNumber) {
            return;
        }
        if (!contractNumber) {
            this.getAddressFromAccountNumber();
            return;
        }
        formData[this.serviceConstants.PremiseNumber] = premiseNumber;
        formData[this.serviceConstants.ContractNumber] = contractNumber;
        formData[this.serviceConstants.Function] = 'GetStatAddressFromPremise';
        this.updateAddressInForm(formData);
    };
    AddressStatementTabComponent.prototype.getStatementTabAccountAddress = function () {
        var accountNumber = this.storeFormGroup['main'].controls[this.serviceConstants.AccountNumber].value;
        var formData = {};
        formData[this.serviceConstants.AccountNumber] = accountNumber;
        formData[this.serviceConstants.Function] = 'GetStatAddressFromAccount';
        this.updateAddressInForm(formData);
    };
    AddressStatementTabComponent.prototype.getStatementTabInvoiceAddress = function () {
        this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['RequestedAddressType']] = BillToCashConstants.c_o_ADDRESS_TYPES['Invoice'];
        this.navigateToGetAddress('GetInvoiceAddress');
    };
    AddressStatementTabComponent.prototype.onInvoiceAddressDataReceived = function () {
        var accountNumber = this.storeInvoice[this.serviceConstants.AccountNumber];
        var invoiceGroupNumber = this.storeSentFromParent[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['InvoiceGroupNumber']];
        var formData = {};
        formData[this.serviceConstants.AccountNumber] = accountNumber;
        formData[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['InvoiceGroupNumber']] = invoiceGroupNumber;
        formData[this.serviceConstants.Function] = 'GetStatAddressFromInv';
        this.updateAddressInForm(formData);
    };
    AddressStatementTabComponent.prototype.getAddressFromAccountNumber = function () {
        var premiseNumber = this.storeParams[this.serviceConstants.PremiseNumber];
        var accountNumber = this.storeInvoice[this.serviceConstants.AccountNumber];
        var formData = {};
        formData[this.serviceConstants.PremiseNumber] = premiseNumber;
        formData[this.serviceConstants.AccountNumber] = accountNumber;
        formData[BillToCashConstants.c_o_REQUEST_PARAM_NAMES['Detail']] = BillToCashConstants.c_o_REQUEST_PARAM_VALUES['Statement'];
        formData[this.serviceConstants.Function] = 'GetStatAddressFromAccount';
        this.updateAddressInForm(formData);
    };
    AddressStatementTabComponent.prototype.prepareAddressQuery = function () {
        var query = new URLSearchParams();
        query.set(this.serviceConstants.BusinessCode, this.storeCode[BillToCashConstants.c_o_STORE_KEY_NAMES['CodeBusiness']]);
        query.set(this.serviceConstants.CountryCode, this.storeCode[BillToCashConstants.c_o_STORE_KEY_NAMES['CodeCountry']]);
        query.set(this.serviceConstants.Action, '6');
        return query;
    };
    AddressStatementTabComponent.prototype.updateAddressInForm = function (formData) {
        var _this = this;
        this.addressQuery = new URLSearchParams();
        this.addressQuery = this.prepareAddressQuery();
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['method'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['module'], BillToCashConstants.c_o_REQUEST_HEADERS['InvoiceGroupMaintenance']['operation'], this.addressQuery, formData).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (!data['StatementName']) {
                return;
            }
            _this.addressStatementFormGroup.controls['StatementName'].setValue(data['StatementName']);
            _this.addressStatementFormGroup.controls['StatementAddressLine1'].setValue(data['StatementAddressLine1']);
            _this.addressStatementFormGroup.controls['StatementAddressLine2'].setValue(data['StatementAddressLine2']);
            _this.addressStatementFormGroup.controls['StatementAddressLine3'].setValue(data['StatementAddressLine3']);
            _this.addressStatementFormGroup.controls['StatementAddressLine4'].setValue(data['StatementAddressLine4']);
            _this.addressStatementFormGroup.controls['StatementAddressLine5'].setValue(data['StatementAddressLine5']);
            _this.addressStatementFormGroup.controls['StatementPostcode'].setValue(data['StatementPostcode']);
            _this.addressStatementFormGroup.controls['StatementContactName'].setValue(data['StatementContactName']);
            _this.addressStatementFormGroup.controls['StatementContactDepartment'].setValue(data['StatementContactDepartment']);
            _this.addressStatementFormGroup.controls['StatementContactPosition'].setValue(data['StatementContactPosition']);
            _this.addressStatementFormGroup.controls['StatementContactMobile'].setValue(data['StatementContactMobile']);
            _this.addressStatementFormGroup.controls['StatementContactTelephone'].setValue(data['StatementContactTelephone']);
            _this.addressStatementFormGroup.controls['StatementContactFax'].setValue(data['StatementContactFax']);
            _this.addressStatementFormGroup.controls['StatementContactEmail'].setValue(data['StatementContactEmail']);
            _this.addressStatementFormGroup.controls['StatementGPSCoordinateX'].setValue(data['StatementGPSCoordinateX']);
            _this.addressStatementFormGroup.controls['StatementGPSCoordinateY'].setValue(data['StatementGPSCoordinateY']);
        }, function (error) {
            _this.dispatchGeneralError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    AddressStatementTabComponent.prototype.onGeneralAddressDataReceived = function () {
        this.addressStatementFormGroup.controls['StatementAddressLine5'].setValue(this.storeOtherDetails['StatementAddressLine5']);
        this.addressStatementFormGroup.controls['StatementPostcode'].setValue(this.storeOtherDetails['StatementPostcode']);
    };
    AddressStatementTabComponent.prototype.onContactDetailsReceived = function () {
        var data = this.storeSentFromParent;
        this.addressStatementFormGroup.controls['InvoiceContactName'].setValue(data['ContactName']);
        this.addressStatementFormGroup.controls['InvoiceContactDepartment'].setValue(data['ContactDepartment']);
        this.addressStatementFormGroup.controls['InvoiceContactPosition'].setValue(data['ContactPosition']);
        this.addressStatementFormGroup.controls['InvoiceContactMobile'].setValue(data['ContactMobileNumber']);
        this.addressStatementFormGroup.controls['InvoiceContactTelephone'].setValue(data['ContactTelephone']);
        this.addressStatementFormGroup.controls['InvoiceContactFax'].setValue(data['ContactFax']);
        this.addressStatementFormGroup.controls['InvoiceContactEmail'].setValue(data['ContactEmailAddress']);
    };
    AddressStatementTabComponent.prototype.dispatchError = function (error) {
        this.store.dispatch({
            type: InvoiceActionTypes.DISPATCH_ERROR,
            payload: error
        });
    };
    AddressStatementTabComponent.prototype.dispatchGeneralError = function (error) {
        var errorObject = {};
        errorObject[BillToCashConstants.c_o_ERROROBJECT_KEYS.isLogRequired] = true;
        errorObject[BillToCashConstants.c_o_ERROROBJECT_KEYS.error] = error;
        this.dispatchError(errorObject);
    };
    AddressStatementTabComponent.prototype.sensitiseContactDetails = function (enable) {
        if (!this.addressStatementFormGroup) {
            return;
        }
        if (enable) {
            this.addressStatementFormGroup.controls['StatementContactName'].enable();
            this.addressStatementFormGroup.controls['StatementContactPosition'].enable();
            this.addressStatementFormGroup.controls['StatementContactDepartment'].enable();
            this.addressStatementFormGroup.controls['StatementContactMobile'].enable();
            this.addressStatementFormGroup.controls['StatementContactPosition'].enable();
            this.addressStatementFormGroup.controls['StatementContactTelephone'].enable();
            this.addressStatementFormGroup.controls['StatementContactFax'].enable();
            this.addressStatementFormGroup.controls['StatementContactEmail'].enable();
        }
        else {
            this.addressStatementFormGroup.controls['StatementContactName'].disable();
            this.addressStatementFormGroup.controls['StatementContactPosition'].disable();
            this.addressStatementFormGroup.controls['StatementContactDepartment'].disable();
            this.addressStatementFormGroup.controls['StatementContactMobile'].disable();
            this.addressStatementFormGroup.controls['StatementContactPosition'].disable();
            this.addressStatementFormGroup.controls['StatementContactTelephone'].disable();
            this.addressStatementFormGroup.controls['StatementContactFax'].disable();
            this.addressStatementFormGroup.controls['StatementContactEmail'].disable();
        }
    };
    AddressStatementTabComponent.prototype.getAddress = function () {
        this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['Tab']] = this.storeFormKey;
        this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['RequestedAddressType']] = BillToCashConstants.c_o_ADDRESS_TYPES['General'];
        this.store.dispatch({
            type: InvoiceActionTypes.NAVIGATE,
            payload: 'GetAddress'
        });
    };
    AddressStatementTabComponent.prototype.getAddressClick = function () {
        var sysCharsValue = this.storeSysChars;
        if (sysCharsValue['vSCEnableHopewiserPAF']) {
            this.logger.log('To open riMPAFSearch.htm');
        }
        else if (sysCharsValue['vEnablePostcodeDefaulting']) {
            this.inputParamsPostcode = {
                parentMode: 'Statement',
                StatementPostcode: this.addressStatementFormGroup.controls['StatementPostcode'].value,
                StatementAddressLine5: this.addressStatementFormGroup.controls['StatementAddressLine5'].value,
                StatementAddressLine4: this.addressStatementFormGroup.controls['StatementAddressLine4'].value
            };
            this.postcodeSearchEllipsis.childConfigParams = this.inputParamsPostcode;
            this.postcodeSearchEllipsis.openModal();
        }
    };
    AddressStatementTabComponent.prototype.onPostcodeDataReturn = function (data) {
        this.addressStatementFormGroup.controls['StatementAddressLine4'].setValue(data['StatementAddressLine4']);
        this.addressStatementFormGroup.controls['StatementAddressLine5'].setValue(data['StatementAddressLine5']);
        this.addressStatementFormGroup.controls['StatementPostcode'].setValue(data['StatementPostcode']);
    };
    AddressStatementTabComponent.prototype.getContactDetails = function () {
        this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['Tab']] = this.storeFormKey;
        this.storeParams[BillToCashConstants.c_o_STORE_KEY_NAMES['RequestedAddressType']] = 'contactdetails';
        this.store.dispatch({
            type: InvoiceActionTypes.NAVIGATE,
            payload: 'ContactDetailsStat'
        });
    };
    AddressStatementTabComponent.prototype.onInvoiceNameChange = function () {
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
    AddressStatementTabComponent.prototype.onStatementAddressLine4Blur = function () {
        var sysChars = this.storeSysChars;
        var inputValue = this.addressStatementFormGroup.controls['StatementAddressLine4'].value;
        if (sysChars['vSCAddressLine4Required'] && inputValue === '' && sysChars['vSCEnableValidatePostcodeSuburb']) {
            this.getAddressClick();
        }
    };
    AddressStatementTabComponent.prototype.onStatementAddressLine5Blur = function () {
        var sysChars = this.storeSysChars;
        var inputValue = this.addressStatementFormGroup.controls['StatementAddressLine5'].value;
        if (sysChars['vSCAddressLine5Required'] && inputValue === '' && sysChars['vSCEnableValidatePostcodeSuburb']) {
            this.getAddressClick();
        }
    };
    AddressStatementTabComponent.prototype.onPostCodeBlur = function () {
        var inputValue = this.addressStatementFormGroup.controls['StatementPostcode'].value;
        if (this.storeSysChars['vSCPostCodeRequired'] && inputValue === '') {
            this.getAddressClick();
        }
    };
    AddressStatementTabComponent.prototype.onPostCodeChange = function () {
        var _this = this;
        var inputPostCode = this.addressStatementFormGroup.controls['StatementPostcode'].value;
        var inputStatementAddressLine4 = this.addressStatementFormGroup.controls['StatementAddressLine4'].value;
        var inputState = this.addressStatementFormGroup.controls['StatementAddressLine5'].value;
        this.postcodeQuery = new URLSearchParams();
        if (!this.storeSysChars['vEnablePostcodeDefaulting'] || !this.storeSysChars['vSCEnableDatabasePAF'] || !inputPostCode) {
            return;
        }
        this.postcodeQuery.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.postcodeQuery.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.postcodeQuery.set(BillToCashConstants.c_o_REQUEST_PARAM_NAMES['Function'], 'GetPostCodeTownAndState');
        this.postcodeQuery.set(this.serviceConstants.Action, '0');
        this.postcodeQuery.set(BillToCashConstants.c_o_REQUEST_PARAM_NAMES['State'], inputState);
        this.postcodeQuery.set(BillToCashConstants.c_o_REQUEST_PARAM_NAMES['StatementAddressLine4'], inputStatementAddressLine4);
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
                    parentMode: 'Statement',
                    InvoicePostCode: _this.addressStatementFormGroup.controls['StatementPostcode'].value,
                    InvoiceAddressLine5: _this.addressStatementFormGroup.controls['StatementAddressLine5'].value,
                    InvoiceAddressLine4: _this.addressStatementFormGroup.controls['StatementAddressLine4'].value
                };
                _this.postcodeSearchEllipsis.openModal();
                return;
            }
            _this.addressStatementFormGroup.controls['StatementPostcode'].setValue(data.Postcode);
            _this.addressStatementFormGroup.controls['StatementAddressLine4'].setValue(data.Town);
            _this.addressStatementFormGroup.controls['StatementAddressLine5'].setValue(data.State);
        }, function (error) {
            _this.dispatchGeneralError(error);
        });
    };
    AddressStatementTabComponent.prototype.onPremiseDataReturn = function (data) {
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
        formData[this.serviceConstants.Function] = 'GetStatAddressFromPremise';
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
                    _this.addressStatementFormGroup.controls[key].setValue(data[key]);
                }
            }
        }, function (error) {
            _this.dispatchGeneralError(error);
        });
    };
    AddressStatementTabComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-address-statement-tab',
                    templateUrl: 'AddressStatementTab.html'
                },] },
    ];
    AddressStatementTabComponent.ctorParameters = [
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
    AddressStatementTabComponent.propDecorators = {
        'premiseSearchEllipsis': [{ type: ViewChild, args: ['premiseSearchEllipsis',] },],
        'postcodeSearchEllipsis': [{ type: ViewChild, args: ['postcodeSearchEllipsis',] },],
    };
    return AddressStatementTabComponent;
}());
