import { Component, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { HttpService } from '../../../../shared/services/http-service';
import { URLSearchParams } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { ContractActionTypes } from '../../../actions/contract';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { EmployeeSearchComponent } from '../../../internal/search/iCABSBEmployeeSearch';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { ErrorConstant } from '../../../../shared/constants/error.constant';
import { AuthService } from '../../../../shared/services/auth.service';
import { Utils } from '../../../../shared/services/utility';
export var MaintenanceTypeCComponent = (function () {
    function MaintenanceTypeCComponent(zone, fb, route, store, serviceConstants, httpService, utils, authService) {
        var _this = this;
        this.zone = zone;
        this.fb = fb;
        this.route = route;
        this.store = store;
        this.serviceConstants = serviceConstants;
        this.httpService = httpService;
        this.utils = utils;
        this.authService = authService;
        this.inputParams = { 'parentMode': 'Contract-Search', 'ContractTypeCode': '', 'countryCode': '', 'businessCode': '' };
        this.inputParamsEmployeeSearch = { 'parentMode': 'LookUp-ContractSalesEmployeeReturn', 'countryCode': '', 'businessCode': '', 'negativeBranchNumber': '' };
        this.inputParamsContractOwner = { 'parentMode': 'LookUp-ContractOwner1', 'countryCode': '', 'businessCode': '' };
        this.fieldVisibility = {
            'companyCode': true,
            'companyDesc': true,
            'salesEmployee': true,
            'salesEmploeeSurname': true,
            'contractOwner': true,
            'contractOwnerSurname': true,
            'companyVatNumber': true,
            'companyVatNumber2': true,
            'limitedCompany': true,
            'companyRegistrationNumber': true,
            'noticePeriod': true,
            'externalReference': true,
            'interCompanyPortfolio': true,
            'contractReference': true,
            'agreementNumber': true,
            'renewalAgreementNumber': true,
            'contractResignDate': true,
            'telesales': true,
            'groupAccountPriceGroupID': true,
            'groupAccountPriceGroupDesc': true
        };
        this.fieldRequired = {
            'companyCode': true,
            'companyDesc': false,
            'salesEmployee': true,
            'salesEmploeeSurname': false,
            'contractOwner': false,
            'contractOwnerSurname': false,
            'companyVatNumber': false,
            'companyVatNumber2': false,
            'limitedCompany': false,
            'companyRegistrationNumber': false,
            'noticePeriod': false,
            'externalReference': false,
            'interCompanyPortfolio': false,
            'contractReference': false,
            'agreementNumber': false,
            'renewalAgreementNumber': false,
            'contractResignDate': false,
            'telesales': false,
            'groupAccountPriceGroupID': false,
            'groupAccountPriceGroupDesc': false
        };
        this.companyList = [];
        this.isCompanyDropdownDisabled = true;
        this.contractResignDateDisplay = '';
        this.companyItemsToDisplay = ['code', 'desc'];
        this.contractResignDate = void 0;
        this.dateObjectsEnabled = {
            contractResignDate: false
        };
        this.dateObjectsValidate = {
            contractResignDate: false
        };
        this.clearDate = {
            contractResignDate: false
        };
        this.employeeSearchComponent = '';
        this.contractOwnerComponent = EmployeeSearchComponent;
        this.groupAccountPriceComponent = '';
        this.autoOpen = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.searchModalRoute = '';
        this.showHeader = true;
        this.showCloseButton = true;
        this.isEmployeeSearchEllipsisDisabled = true;
        this.isContractOwnerEllipsisDisabled = true;
        this.isGroupAccountPriceSearchEllipsisDisabled = true;
        this.companySelected = {
            id: '',
            text: ''
        };
        this.queryLookUp = new URLSearchParams();
        this.vCompanyVATNumberLabel = '';
        this.fieldRequiredClone = {};
        this.fieldVisibilityClone = {};
        this.queryParamsContract = {
            action: '0',
            operation: 'Application/iCABSAContractMaintenance',
            module: 'contract',
            method: 'contract-management/maintenance',
            contentType: 'application/x-www-form-urlencoded',
            branchNumber: '',
            branchName: ''
        };
        this.maintenanceCFormGroup = this.fb.group({
            CompanyCode: [{ value: '', disabled: true }, Validators.required],
            CompanyDesc: [{ value: '', disabled: true }],
            SalesEmployee: [{ value: '', disabled: true }, Validators.required],
            SalesEmployeeSurname: [{ value: '', disabled: true }],
            ContractOwner: [{ value: '', disabled: true }],
            ContractOwnerSurname: [{ value: '', disabled: true }],
            CompanyVatNumber: [{ value: '', disabled: true }],
            CompanyVatNumber2: [{ value: '', disabled: true }],
            LimitedCompany: [{ value: false, disabled: true }],
            CompanyRegistrationNumber: [{ value: '', disabled: true }],
            NoticePeriod: [{ value: '', disabled: true }],
            ContractReference: [{ value: '', disabled: true }],
            ExternalReference: [{ value: '', disabled: true }],
            InterCompanyPortfolio: [{ value: '', disabled: true }],
            AgreementNumber: [{ value: '', disabled: true }],
            RenewalAgreementNumber: [{ value: '', disabled: true }],
            ContractResignDate: [{ value: '', disabled: true }],
            Telesales: [{ value: '', disabled: true }],
            GroupAccountPriceGroupID: [{ value: '', disabled: true }],
            GroupAccountPriceGroupDesc: [{ value: '', disabled: true }]
        });
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            if (data && data['action']) {
                _this.storeData = data;
                _this.sysCharParams = data['syschars'];
                switch (data['action']) {
                    case ContractActionTypes.SAVE_DATA:
                        if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                            _this.setFormData(data);
                        }
                        break;
                    case ContractActionTypes.SAVE_ACCOUNT:
                        if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                            if (data['data'].GroupAccountNumber) {
                                _this.fieldVisibility.groupAccountPriceGroupID = true;
                                _this.isGroupAccountPriceSearchEllipsisDisabled = false;
                            }
                            else {
                                _this.fieldVisibility.groupAccountPriceGroupID = false;
                                _this.isGroupAccountPriceSearchEllipsisDisabled = true;
                            }
                        }
                        break;
                    case ContractActionTypes.SAVE_MODE:
                        _this.mode = data['mode'];
                        _this.processForm();
                        break;
                    case ContractActionTypes.SAVE_SYSCHAR:
                        if (data['syschars']) {
                            _this.sysCharParams = data['syschars'];
                            _this.processSysChar();
                        }
                        break;
                    case ContractActionTypes.SAVE_PARAMS:
                        _this.params = data['params'];
                        _this.inputParams = data['params'];
                        break;
                    case ContractActionTypes.SAVE_OTHER_PARAMS:
                        _this.otherParams = data['otherParams'];
                        _this.companyList = _this.otherParams['companyList'] ? _this.otherParams['companyList'] : [];
                        if (_this.otherParams['vDisableFields'].indexOf('CompanyCode') > -1) {
                            _this.fieldVisibility.companyCode = false;
                        }
                        else {
                            _this.fieldVisibility.companyCode = true;
                        }
                        if (data['otherParams']['defaultCompanyCode']) {
                            _this.companySelected = {
                                id: '',
                                text: _this.otherParams['defaultCompanyCode'] + ' - ' + _this.otherParams['defaultCompanyDesc']
                            };
                            _this.maintenanceCFormGroup.controls['CompanyCode'].setValue(_this.otherParams['defaultCompanyCode']);
                        }
                        else {
                            if (data['data'].CompanyCode) {
                                _this.companySelected = JSON.parse(JSON.stringify({
                                    id: '',
                                    text: data['data'].CompanyCode + ' - ' + _this.fetchCompanyDesc(data['data'].CompanyCode)
                                }));
                                _this.maintenanceCFormGroup.controls['CompanyCode'].setValue(data['data'].CompanyCode);
                            }
                        }
                        break;
                    case ContractActionTypes.SAVE_CODE:
                        break;
                    case ContractActionTypes.SAVE_FIELD:
                        break;
                    case ContractActionTypes.SAVE_SERVICE:
                        _this.translateSubscription = _this.storeData['services'].localeTranslateService.ajaxSource$.subscribe(function (event) {
                            if (event !== 0) {
                                _this.fetchTranslationContent();
                            }
                        });
                        break;
                    case ContractActionTypes.SAVE_SENT_FROM_PARENT:
                        break;
                    case ContractActionTypes.LOOKUP:
                        break;
                    case ContractActionTypes.FORM_RESET:
                        _this.fieldRequired = JSON.parse(JSON.stringify(_this.fieldRequiredClone));
                        _this.fieldVisibility = JSON.parse(JSON.stringify(_this.fieldVisibilityClone));
                        _this.storeData['fieldRequired'].typeC = _this.fieldRequired;
                        _this.storeData['fieldVisibility'].typeC = _this.fieldVisibility;
                        for (var i in _this.maintenanceCFormGroup.controls) {
                            if (_this.maintenanceCFormGroup.controls.hasOwnProperty(i)) {
                                _this.maintenanceCFormGroup.controls[i].clearValidators();
                            }
                        }
                        _this.maintenanceCFormGroup.controls['CompanyCode'].setValidators(Validators.required);
                        _this.maintenanceCFormGroup.controls['SalesEmployee'].setValidators(Validators.required);
                        _this.maintenanceCFormGroup.reset();
                        break;
                    case ContractActionTypes.VALIDATE_FORMS:
                        if (data['validate'].typeC) {
                            _this.validateForm();
                        }
                        break;
                    case ContractActionTypes.SET_EMPLOYEE_ON_BRANCH_CHANGE:
                        _this.setEmployeeOnBranchChange({});
                        break;
                    default:
                        break;
                }
            }
        });
    }
    MaintenanceTypeCComponent.prototype.ngOnInit = function () {
        this.fieldRequiredClone = JSON.parse(JSON.stringify(this.fieldRequired));
        this.fieldVisibilityClone = JSON.parse(JSON.stringify(this.fieldVisibility));
        this.employeeSearchComponent = EmployeeSearchComponent;
    };
    MaintenanceTypeCComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.store.dispatch({
            type: ContractActionTypes.FORM_GROUP, payload: {
                typeC: this.maintenanceCFormGroup
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.SAVE_REQUIRED_FIELD, payload: {
                typeC: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                typeC: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.INITIALIZATION, payload: {
                typeC: true
            }
        });
        setTimeout(function () {
            if (_this.storeData && _this.storeData['data'] && !(Object.keys(_this.storeData['data']).length === 0 && _this.storeData['data'].constructor === Object)) {
                _this.setFormData(_this.storeData);
            }
        }, 0);
    };
    MaintenanceTypeCComponent.prototype.ngOnDestroy = function () {
        this.storeSubscription.unsubscribe();
        if (this.querySubscription)
            this.querySubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    MaintenanceTypeCComponent.prototype.fetchTranslationContent = function () {
    };
    MaintenanceTypeCComponent.prototype.toUpperCase = function (control) {
        this.maintenanceCFormGroup.controls[control].setValue(this.maintenanceCFormGroup.controls[control].value.toUpperCase());
    };
    MaintenanceTypeCComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.storeData['services'].translate.get(key, { value: params });
        }
        else {
            return this.storeData['services'].translate.get(key);
        }
    };
    MaintenanceTypeCComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    };
    MaintenanceTypeCComponent.prototype.onSalesEmployeeBlur = function (event) {
        var _this = this;
        if (this.maintenanceCFormGroup.controls['SalesEmployee'] && this.maintenanceCFormGroup.controls['SalesEmployee'].value !== '') {
            var data = [{
                    'table': 'Employee',
                    'query': { 'EmployeeCode': this.maintenanceCFormGroup.controls['SalesEmployee'] ? this.maintenanceCFormGroup.controls['SalesEmployee'].value : '', BusinessCode: this.utils.getBusinessCode() },
                    'fields': ['EmployeeCode', 'EmployeeSurname']
                }];
            this.lookUpRecord(data, 5).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        _this.maintenanceCFormGroup.controls['SalesEmployeeSurname'].setValue(e['results'][0][0]['EmployeeSurname']);
                    }
                    else {
                        _this.maintenanceCFormGroup.controls['SalesEmployeeSurname'].setValue('');
                        _this.maintenanceCFormGroup.controls['SalesEmployee'].setErrors({});
                    }
                }
                else {
                }
            }, function (error) {
            });
        }
    };
    MaintenanceTypeCComponent.prototype.onContractOwnerBlur = function (event) {
        var _this = this;
        if (this.maintenanceCFormGroup.controls['ContractOwner'] && this.maintenanceCFormGroup.controls['ContractOwner'].value !== '') {
            var data = [{
                    'table': 'Employee',
                    'query': { 'EmployeeCode': this.maintenanceCFormGroup.controls['ContractOwner'] ? this.maintenanceCFormGroup.controls['ContractOwner'].value : '', BusinessCode: this.utils.getBusinessCode() },
                    'fields': ['EmployeeCode', 'EmployeeSurname']
                }];
            this.lookUpRecord(data, 5).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        _this.maintenanceCFormGroup.controls['ContractOwnerSurname'].setValue(e['results'][0][0]['EmployeeSurname']);
                    }
                    else {
                        _this.maintenanceCFormGroup.controls['ContractOwnerSurname'].setValue('');
                        _this.maintenanceCFormGroup.controls['ContractOwner'].setErrors({});
                    }
                }
                else {
                }
            }, function (error) {
            });
        }
    };
    MaintenanceTypeCComponent.prototype.onGroupAccountPriceBlur = function (event) {
        var _this = this;
        if (this.storeData['formGroup'].main.controls['GroupAccountNumber'].value !== '') {
            if (this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'] && this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].value !== '') {
                var data = [{
                        'table': 'GroupAccountPriceGroup',
                        'query': {
                            'GroupAccountPriceGroupID': this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'] ? this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].value : '',
                            'GroupAccountNumber': this.storeData['formGroup'].main.controls['GroupAccountNumber'].value
                        },
                        'fields': ['GroupAccountPriceGroupID', 'GroupAccountPriceGroupDesc']
                    }];
                this.lookUpRecord(data, 5).subscribe(function (e) {
                    if (e['results'] && e['results'].length > 0) {
                        if (e['results'][0].length > 0) {
                            _this.maintenanceCFormGroup.controls['GroupAccountPriceGroupDesc'].setValue(e['results'][0][0]['GroupAccountPriceGroupDesc']);
                        }
                        else {
                            _this.maintenanceCFormGroup.controls['GroupAccountPriceGroupDesc'].setValue('');
                            _this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].setErrors({});
                        }
                    }
                    else {
                        _this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].setErrors({});
                    }
                }, function (error) {
                });
            }
            else {
                this.maintenanceCFormGroup.controls['GroupAccountPriceGroupDesc'].setValue('');
            }
        }
        else if (this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'] && this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].value !== '') {
            var data = [{
                    'table': 'GroupAccountPriceGroup',
                    'query': {
                        'GroupAccountPriceGroupID': this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'] ? this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].value : '',
                        'GroupAccountNumber': this.storeData['formGroup'].main.controls['GroupAccountNumber'].value
                    },
                    'fields': ['GroupAccountPriceGroupID', 'GroupAccountPriceGroupDesc']
                }];
            this.lookUpRecord(data, 5).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        _this.maintenanceCFormGroup.controls['GroupAccountPriceGroupDesc'].setValue(e['results'][0][0]['GroupAccountPriceGroupDesc']);
                    }
                    else {
                        _this.maintenanceCFormGroup.controls['GroupAccountPriceGroupDesc'].setValue('');
                    }
                }
            }, function (error) {
            });
        }
        else {
            this.maintenanceCFormGroup.controls['GroupAccountPriceGroupDesc'].setValue('');
        }
    };
    MaintenanceTypeCComponent.prototype.processSysChar = function () {
        if (this.storeData['params']) {
            if (this.storeData['params']['currentContractType'] === 'P' || this.storeData['params']['currentContractType'] === 'J') {
                this.fieldVisibility['contractResignDate'] = false;
                this.fieldVisibility['noticePeriod'] = false;
            }
        }
        if (!this.sysCharParams['vSCEnableExternalRefNotUsed']) {
            this.fieldVisibility.externalReference = false;
        }
        else {
            this.fieldVisibility.externalReference = true;
        }
        if (this.sysCharParams['vSCDisplayContractOwner']) {
            this.fieldVisibility.contractOwnerSurname = true;
        }
        else {
            this.fieldVisibility.contractOwnerSurname = false;
        }
        if (!this.sysCharParams['vSCGroupAccount']) {
            this.fieldVisibility.groupAccountPriceGroupID = false;
        }
        if (this.sysCharParams['vSCEnableMonthsNotice'] && this.storeData['params']['currentContractType'] === 'C') {
            this.fieldVisibility.noticePeriod = true;
        }
        else {
            this.fieldVisibility.noticePeriod = false;
        }
        if (this.sysCharParams['vSCEnableLtdCompanyAndReg']) {
            this.fieldVisibility.limitedCompany = true;
            this.fieldVisibility.companyRegistrationNumber = true;
        }
        else {
            this.fieldVisibility.limitedCompany = false;
            this.fieldVisibility.companyRegistrationNumber = false;
        }
        if (this.sysCharParams['vSCEnableTaxRegistrationNumber2']) {
            this.fieldVisibility.companyVatNumber2 = true;
            this.vCompanyVATNumberLabel = 'Tax Registration Number 1';
        }
        else {
            this.fieldVisibility.companyVatNumber2 = false;
            this.vCompanyVATNumberLabel = 'Tax Registration Number';
        }
        if (this.sysCharParams['vSCEnableExternalReference']) {
            this.maintenanceCFormGroup.controls['ExternalReference'].enable();
        }
        else {
            this.maintenanceCFormGroup.controls['ExternalReference'].disable();
        }
        if (this.sysCharParams['vSCDisplayContractOwner'] === true && this.sysCharParams['vSCContractOwnerRequired'] === true) {
            this.fieldRequired.contractOwnerSurname = true;
            this.maintenanceCFormGroup.controls['ContractOwner'].setValidators(Validators.required);
            this.isContractOwnerEllipsisDisabled = false;
        }
        else {
            this.fieldRequired.contractOwnerSurname = false;
            if (this.maintenanceCFormGroup.controls['ContractOwner'])
                this.maintenanceCFormGroup.controls['ContractOwner'].clearValidators();
            this.isContractOwnerEllipsisDisabled = true;
        }
        if (this.sysCharParams['vSCTaxRegNumber'] === true) {
            this.fieldRequired.companyVatNumber = true;
            this.maintenanceCFormGroup.controls['CompanyVatNumber'].setValidators(Validators.required);
        }
        else {
            this.fieldRequired.companyVatNumber = false;
            if (this.maintenanceCFormGroup.controls['CompanyVatNumber'])
                this.maintenanceCFormGroup.controls['CompanyVatNumber'].clearValidators();
        }
        this.maintenanceCFormGroup.controls['Telesales'].disable();
        if (this.storeData && this.storeData['params']['currentContractType'] === 'C') {
            if (this.sysCharParams['vSCNoticePeriod'] === true) {
                this.fieldRequired.noticePeriod = true;
                this.maintenanceCFormGroup.controls['NoticePeriod'].setValidators(Validators.required);
            }
            else {
                this.fieldRequired.noticePeriod = false;
                if (this.maintenanceCFormGroup.controls['NoticePeriod'])
                    this.maintenanceCFormGroup.controls['NoticePeriod'].clearValidators();
            }
        }
        if (this.sysCharParams['vSCEnableCompanyCode'] === true) {
            this.isCompanyDropdownDisabled = false;
        }
        else {
            this.isCompanyDropdownDisabled = true;
        }
        this.maintenanceCFormGroup.controls['ContractReference'].enable();
        this.maintenanceCFormGroup.controls['AgreementNumber'].enable();
        this.maintenanceCFormGroup.controls['RenewalAgreementNumber'].enable();
        this.maintenanceCFormGroup.updateValueAndValidity();
    };
    MaintenanceTypeCComponent.prototype.setFormData = function (data) {
        var _this = this;
        if (!this.storeData['data']['isCopyClicked']) {
            this.clearDate['contractResignDate'] = false;
            if (data['data'].ContractResignDate) {
                if (window['moment'](data['data'].ContractResignDate, 'DD/MM/YYYY', true).isValid()) {
                    this.contractResignDateDisplay = this.utils.convertDateString(data['data'].ContractResignDate);
                }
                else {
                    this.contractResignDateDisplay = data['data'].ContractResignDate;
                }
            }
            else {
                this.contractResignDateDisplay = null;
            }
            if (!this.contractResignDateDisplay) {
                if (data['data'].ContractResignDate === '') {
                    setTimeout(function () {
                        _this.clearDate['contractResignDate'] = true;
                    }, 400);
                }
                this.contractResignDate = null;
            }
            else {
                this.clearDate['contractResignDate'] = false;
                this.contractResignDate = new Date(this.contractResignDateDisplay);
                if (!window['moment'](this.contractResignDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                    this.contractResignDateDisplay = this.utils.formatDate(new Date(this.contractResignDateDisplay));
                }
            }
            this.maintenanceCFormGroup.controls['ContractResignDate'].setValue(data['data'].ContractResignDate);
            this.maintenanceCFormGroup.controls['SalesEmployee'].setValue(data['data'].ContractSalesEmployee);
            this.maintenanceCFormGroup.controls['SalesEmployeeSurname'].setValue('');
            this.maintenanceCFormGroup.controls['ContractOwner'].setValue(data['data'].ContractOwner);
            this.maintenanceCFormGroup.controls['ContractOwnerSurname'].setValue('');
        }
        if (data['data'].CompanyCode) {
            this.companySelected = JSON.parse(JSON.stringify({
                id: '',
                text: data['data'].CompanyCode + ' - ' + this.fetchCompanyDesc(data['data'].CompanyCode)
            }));
            this.maintenanceCFormGroup.controls['CompanyCode'].setValue(data['data'].CompanyCode);
        }
        this.maintenanceCFormGroup.controls['CompanyVatNumber'].setValue(data['data'].CompanyVATNumber);
        this.maintenanceCFormGroup.controls['CompanyVatNumber2'].setValue(data['data'].CompanyVATNumber2);
        if (data['data'].LimitedCompanyInd) {
            if (data['data'].LimitedCompanyInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.maintenanceCFormGroup.controls['LimitedCompany'].setValue(true);
            }
            else {
                this.maintenanceCFormGroup.controls['LimitedCompany'].setValue(false);
            }
        }
        else {
            this.maintenanceCFormGroup.controls['LimitedCompany'].setValue(false);
        }
        this.maintenanceCFormGroup.controls['CompanyRegistrationNumber'].setValue(data['data'].CompanyRegistrationNumber);
        this.maintenanceCFormGroup.controls['NoticePeriod'].setValue(data['data'].LostBusinessNoticePeriod);
        this.maintenanceCFormGroup.controls['ContractReference'].setValue(data['data'].ContractReference);
        this.maintenanceCFormGroup.controls['ExternalReference'].setValue(data['data'].ExternalReference);
        if (data['data'].InterCompanyPortfolioInd) {
            if (data['data'].InterCompanyPortfolioInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.maintenanceCFormGroup.controls['InterCompanyPortfolio'].setValue(true);
            }
            else {
                this.maintenanceCFormGroup.controls['InterCompanyPortfolio'].setValue(false);
            }
        }
        else {
            this.maintenanceCFormGroup.controls['InterCompanyPortfolio'].setValue(false);
        }
        this.maintenanceCFormGroup.controls['AgreementNumber'].setValue(data['data'].AgreementNumber);
        this.maintenanceCFormGroup.controls['RenewalAgreementNumber'].setValue(data['data'].RenewalAgreementNumber);
        if (data['data'].TelesalesInd) {
            if (data['data'].TelesalesInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                this.maintenanceCFormGroup.controls['Telesales'].setValue(true);
            }
            else {
                this.maintenanceCFormGroup.controls['Telesales'].setValue(false);
            }
        }
        else {
            this.maintenanceCFormGroup.controls['Telesales'].setValue(false);
        }
        if (data['data'].GroupAccountPriceGroupID && data['data'].GroupAccountPriceGroupID !== '') {
            this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].setValue(data['data'].GroupAccountPriceGroupID);
            this.maintenanceCFormGroup.controls['GroupAccountPriceGroupDesc'].setValue('');
        }
        else {
            this.fieldVisibility.groupAccountPriceGroupID = false;
        }
    };
    MaintenanceTypeCComponent.prototype.fetchCompanyDesc = function (val) {
        var found = false;
        if (this.companyList === null || this.companyList === undefined) {
            this.companyList = [];
        }
        this.companyList = this.storeData['otherParams'] ? this.storeData['otherParams'].companyList : [];
        if (this.companyList) {
            if (val !== null && val !== undefined) {
                for (var i = 0; i < this.companyList.length; i++) {
                    if (val.trim() === this.companyList[i].code.toString()) {
                        return this.companyList[i].desc;
                    }
                }
                if (!found) {
                    return '';
                }
            }
        }
    };
    MaintenanceTypeCComponent.prototype.fetchCompanyDetails = function (companyCode) {
        var _this = this;
        var userCode = this.authService.getSavedUserCode();
        var data = [{
                'table': 'Company',
                'query': { 'BusinessCode': this.storeData['code'].business, 'UserCode': userCode.UserCode, 'CompanyCode': companyCode },
                'fields': ['CompanyCode', 'CompanyDesc']
            }];
        this.lookUpRecord(data, 5).subscribe(function (e) {
            if (e.status === GlobalConstant.Configuration.Failure) {
            }
            else {
                if (!e.errorMessage) {
                    if (e['results'] && e['results'].length > 0) {
                        _this.companySelected = JSON.parse(JSON.stringify({
                            id: '',
                            text: companyCode
                        }));
                        _this.maintenanceCFormGroup.controls['CompanyCode'].setValue(companyCode);
                    }
                    else {
                        _this.companySelected = JSON.parse(JSON.stringify({
                            id: '',
                            text: companyCode
                        }));
                        _this.maintenanceCFormGroup.controls['CompanyCode'].setValue(companyCode);
                    }
                }
            }
        }, function (error) {
        });
    };
    MaintenanceTypeCComponent.prototype.onEmployeeDataReceived = function (data) {
        if (data) {
            this.maintenanceCFormGroup.controls['SalesEmployee'].setValue(data.ContractSalesEmployee || data.EmployeeCode);
            this.onSalesEmployeeBlur({});
        }
    };
    MaintenanceTypeCComponent.prototype.onContractOwnerDataReceived = function (data) {
        if (data) {
            this.maintenanceCFormGroup.controls['ContractOwner'].setValue(data.ContractSalesEmployee || data.EmployeeCode);
            this.onContractOwnerBlur({});
        }
    };
    MaintenanceTypeCComponent.prototype.onGroupAccountPriceDataReceived = function (data) {
    };
    MaintenanceTypeCComponent.prototype.onCompanySelected = function (data) {
        var _this = this;
        if (this.sysCharParams['vSCEnableBankDetailEntry'] && this.sysCharParams['vSCEnableSEPAFinanceMandate'] && !this.sysCharParams['vSCEnableSEPAFinanceMandateLog']) {
            this.httpService.riGetErrorMessage(3201, this.utils.getCountryCode(), this.utils.getBusinessCode()).subscribe(function (res) {
                if (res !== 0) {
                    if (res === ErrorConstant.Message.ErrorMessageNotFound) {
                        _this.getTranslatedValue(res, null).subscribe(function (msg) {
                            if (msg) {
                                _this.storeData['services'].errorService.emitError({
                                    errorMessage: msg
                                });
                            }
                            else {
                                _this.storeData['services'].errorService.emitError({
                                    errorMessage: res
                                });
                            }
                        });
                    }
                    else {
                        _this.storeData['services'].errorService.emitError({
                            errorMessage: res
                        });
                    }
                    _this.maintenanceCFormGroup.controls['CompanyCode'].setValue(data.companyCode);
                    _this.validateCompanyCode();
                }
                else {
                    _this.maintenanceCFormGroup.controls['CompanyCode'].setValue(data.companyCode);
                }
            });
        }
        else {
            this.maintenanceCFormGroup.controls['CompanyCode'].setValue(data.companyCode);
            this.validateCompanyCode();
        }
        this.maintenanceCFormGroup.controls['CompanyCode'].markAsDirty();
    };
    MaintenanceTypeCComponent.prototype.validateCompanyCode = function () {
        var _this = this;
        if (this.storeData['formGroup'].main.controls['AccountNumber'].value !== '') {
            this.fetchContractData('CompanyCodeChange,GetPaymentTypeDetails,GetNoticePeriod', {
                'AccountNumber': this.storeData['formGroup'].main.controls['AccountNumber'].value,
                'CompanyCode': this.storeData['formGroup'].typeC.controls['CompanyCode'] ? this.storeData['formGroup'].typeC.controls['CompanyCode'].value : '',
                'ContractTypeCode': this.inputParams.currentContractType,
                'PaymentTypeCode': this.storeData['formGroup'].typeB.controls['PaymentTypeCode'] ? this.storeData['formGroup'].typeB.controls['PaymentTypeCode'].value : '',
                'ContractNumber': this.storeData['formGroup'].main.controls['ContractNumber'] ? this.storeData['formGroup'].main.controls['ContractNumber'].value : '',
                'BranchNumber': this.storeData['formGroup'].main.controls['NegBranchNumber'] ? this.storeData['formGroup'].main.controls['NegBranchNumber'].value : '',
                'action': '6'
            }).subscribe(function (data) {
                if (data && !data.fullError) {
                    _this.storeData['formGroup'].main.controls['AccountNumber'].clearValidators();
                    _this.storeData['formGroup'].main.controls['AccountNumber'].updateValueAndValidity();
                    _this.lookUpRecord([{
                            'table': 'Account',
                            'query': { 'BusinessCode': _this.storeData['code'].business ? _this.storeData['code'].business : _this.utils.getBusinessCode(), 'AccountNumber': _this.storeData['formGroup'].main.controls['AccountNumber'] ? _this.storeData['formGroup'].main.controls['AccountNumber'].value : '' },
                            'fields': ['AccountName', 'AccountNumber', 'AccountBalance']
                        }], 5).subscribe(function (account) {
                        if (account['results'] && account['results'].length > 0) {
                            if (account['results'][0].length > 0) {
                                _this.storeData['formGroup'].main.controls['AccountName'].setValue(account['results'][0][0]['AccountName']);
                                _this.storeData['formGroup'].main.controls['AccountBalance'].setValue(account['results'][0][0]['AccountBalance']);
                            }
                        }
                    });
                }
                else {
                    _this.storeData['services'].errorService.emitError(data);
                }
            }, function (error) {
            });
        }
    };
    MaintenanceTypeCComponent.prototype.validateForm = function () {
        var _this = this;
        for (var j in this.fieldVisibility) {
            if (this.fieldVisibility.hasOwnProperty(j)) {
                var key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.maintenanceCFormGroup.controls[key]) {
                        this.maintenanceCFormGroup.controls[key].clearValidators();
                    }
                }
            }
        }
        for (var i in this.maintenanceCFormGroup.controls) {
            if (this.maintenanceCFormGroup.controls.hasOwnProperty(i)) {
                this.maintenanceCFormGroup.controls[i].markAsTouched();
            }
        }
        this.dateObjectsValidate['contractResignDate'] = true;
        setTimeout(function () {
            _this.dateObjectsValidate['contractResignDate'] = false;
        }, 100);
        this.maintenanceCFormGroup.updateValueAndValidity();
        var formValid = null;
        if (!this.maintenanceCFormGroup.enabled) {
            formValid = true;
        }
        else {
            formValid = this.maintenanceCFormGroup.valid;
        }
        this.store.dispatch({
            type: ContractActionTypes.FORM_GROUP, payload: {
                typeC: this.maintenanceCFormGroup
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.SAVE_REQUIRED_FIELD, payload: {
                typeC: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                typeC: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.FORM_VALIDITY, payload: {
                typeC: formValid
            }
        });
    };
    MaintenanceTypeCComponent.prototype.processForm = function () {
        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            this.maintenanceCFormGroup.controls['SalesEmployee'].enable();
            this.maintenanceCFormGroup.controls['ContractOwner'].enable();
            this.maintenanceCFormGroup.controls['CompanyVatNumber'].enable();
            this.maintenanceCFormGroup.controls['CompanyVatNumber2'].enable();
            this.maintenanceCFormGroup.controls['LimitedCompany'].enable();
            this.maintenanceCFormGroup.controls['CompanyRegistrationNumber'].enable();
            this.maintenanceCFormGroup.controls['NoticePeriod'].enable();
            this.maintenanceCFormGroup.controls['ContractReference'].enable();
            this.maintenanceCFormGroup.controls['InterCompanyPortfolio'].enable();
            this.maintenanceCFormGroup.controls['AgreementNumber'].enable();
            this.maintenanceCFormGroup.controls['RenewalAgreementNumber'].enable();
            this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].enable();
            this.dateObjectsEnabled['contractResignDate'] = true;
            this.isEmployeeSearchEllipsisDisabled = false;
            this.isCompanyDropdownDisabled = false;
        }
        if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
            this.maintenanceCFormGroup.controls['SalesEmployee'].disable();
            this.maintenanceCFormGroup.controls['ContractOwner'].disable();
            this.maintenanceCFormGroup.controls['CompanyVatNumber'].disable();
            this.maintenanceCFormGroup.controls['CompanyVatNumber2'].disable();
            this.maintenanceCFormGroup.controls['LimitedCompany'].disable();
            this.maintenanceCFormGroup.controls['CompanyRegistrationNumber'].disable();
            this.maintenanceCFormGroup.controls['NoticePeriod'].disable();
            this.maintenanceCFormGroup.controls['ContractReference'].disable();
            this.maintenanceCFormGroup.controls['InterCompanyPortfolio'].disable();
            this.maintenanceCFormGroup.controls['AgreementNumber'].disable();
            this.maintenanceCFormGroup.controls['RenewalAgreementNumber'].disable();
            this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].disable();
            if (this.mode && this.mode['prevMode'] === 'Add') {
                this.contractResignDate = void 0;
                this.contractResignDateDisplay = '';
                this.maintenanceCFormGroup.controls['ContractResignDate'].setValue(this.contractResignDateDisplay);
            }
            this.dateObjectsEnabled['contractResignDate'] = false;
            this.isEmployeeSearchEllipsisDisabled = true;
            this.isCompanyDropdownDisabled = true;
            if (this.storeData['data'] && (Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object)) {
                this.companySelected = {
                    id: '',
                    text: ''
                };
            }
        }
        if (this.mode['addMode'] && !this.mode['updateMode'] && !this.mode['searchMode']) {
            this.maintenanceCFormGroup.controls['SalesEmployee'].enable();
            this.maintenanceCFormGroup.controls['ContractOwner'].enable();
            this.maintenanceCFormGroup.controls['CompanyVatNumber'].enable();
            this.maintenanceCFormGroup.controls['CompanyVatNumber2'].enable();
            this.maintenanceCFormGroup.controls['LimitedCompany'].enable();
            this.maintenanceCFormGroup.controls['CompanyRegistrationNumber'].enable();
            this.maintenanceCFormGroup.controls['NoticePeriod'].enable();
            this.maintenanceCFormGroup.controls['ContractReference'].enable();
            this.maintenanceCFormGroup.controls['InterCompanyPortfolio'].enable();
            this.maintenanceCFormGroup.controls['AgreementNumber'].enable();
            this.maintenanceCFormGroup.controls['RenewalAgreementNumber'].enable();
            this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].enable();
            this.maintenanceCFormGroup.controls['SalesEmployee'].setValue('');
            this.maintenanceCFormGroup.controls['SalesEmployeeSurname'].setValue('');
            this.maintenanceCFormGroup.controls['ContractOwner'].setValue('');
            this.maintenanceCFormGroup.controls['CompanyVatNumber'].setValue('');
            this.maintenanceCFormGroup.controls['CompanyVatNumber2'].setValue('');
            this.maintenanceCFormGroup.controls['LimitedCompany'].setValue(false);
            this.maintenanceCFormGroup.controls['CompanyRegistrationNumber'].setValue('');
            this.maintenanceCFormGroup.controls['NoticePeriod'].setValue('');
            this.maintenanceCFormGroup.controls['ContractReference'].setValue('');
            this.maintenanceCFormGroup.controls['ExternalReference'].setValue('');
            this.maintenanceCFormGroup.controls['InterCompanyPortfolio'].setValue('');
            this.maintenanceCFormGroup.controls['AgreementNumber'].setValue('');
            this.maintenanceCFormGroup.controls['RenewalAgreementNumber'].setValue('');
            this.maintenanceCFormGroup.controls['GroupAccountPriceGroupID'].setValue('');
            this.maintenanceCFormGroup.controls['Telesales'].setValue(false);
            this.dateObjectsEnabled['contractResignDate'] = true;
            this.isEmployeeSearchEllipsisDisabled = false;
            this.isCompanyDropdownDisabled = false;
            if (this.sysCharParams['vSCEnableMonthsNotice'] && this.storeData['params']['currentContractType'] === 'C') {
                this.fieldVisibility.noticePeriod = true;
                this.fieldRequired.noticePeriod = true;
                this.maintenanceCFormGroup.controls['NoticePeriod'].setValidators(Validators.required);
                this.maintenanceCFormGroup.controls['NoticePeriod'].setValue(this.sysCharParams['vSCMonthsNotice']);
            }
            else {
                this.maintenanceCFormGroup.controls['NoticePeriod'].clearValidators();
                this.maintenanceCFormGroup.controls['NoticePeriod'].setValue('');
                this.fieldVisibility.noticePeriod = false;
                this.fieldRequired.noticePeriod = false;
            }
            this.contractResignDate = null;
            this.contractResignDateDisplay = '';
            this.maintenanceCFormGroup.controls['ContractResignDate'].setValue(this.contractResignDateDisplay);
            this.store.dispatch({
                type: ContractActionTypes.FORM_GROUP, payload: {
                    typeC: this.maintenanceCFormGroup
                }
            });
        }
        this.maintenanceCFormGroup.updateValueAndValidity();
        if (this.mode['addMode'] || this.mode['updateMode']) {
            this.inputParams = Object.assign({}, this.inputParams, {
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business
            });
            this.inputParamsEmployeeSearch = Object.assign({}, this.inputParamsEmployeeSearch, {
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business,
                'negativeBranchNumber': this.storeData['formGroup'].main.controls['NegBranchNumber'].value
            });
            this.inputParamsContractOwner = Object.assign({}, this.inputParamsContractOwner, {
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business
            });
            if (this.sysCharParams['vSCDisplayContractOwner'] === true) {
                this.isContractOwnerEllipsisDisabled = false;
            }
            else {
                this.isContractOwnerEllipsisDisabled = true;
            }
        }
    };
    MaintenanceTypeCComponent.prototype.setEmployeeOnBranchChange = function (event) {
        this.inputParamsEmployeeSearch = Object.assign({}, this.inputParamsEmployeeSearch, {
            'countryCode': this.storeData['code'].country,
            'businessCode': this.storeData['code'].business,
            'negativeBranchNumber': this.storeData['formGroup'].main.controls['NegBranchNumber'].value
        });
    };
    MaintenanceTypeCComponent.prototype.onLimitedIndClick = function (event) {
        if (this.maintenanceCFormGroup.controls['LimitedCompany'] && this.maintenanceCFormGroup.controls['LimitedCompany'].value) {
            this.fieldRequired.companyRegistrationNumber = true;
            this.maintenanceCFormGroup.controls['CompanyRegistrationNumber'].setValidators(Validators.required);
        }
        else {
            this.fieldRequired.companyRegistrationNumber = false;
            this.maintenanceCFormGroup.controls['CompanyRegistrationNumber'].clearValidators();
        }
        this.maintenanceCFormGroup.controls['CompanyRegistrationNumber'].updateValueAndValidity();
        this.maintenanceCFormGroup.updateValueAndValidity();
    };
    MaintenanceTypeCComponent.prototype.contractResignDateSelectedValue = function (value) {
        if (value && value.value) {
            this.contractResignDateDisplay = value.value;
            this.maintenanceCFormGroup.controls['ContractResignDate'].setValue(this.contractResignDateDisplay);
            this.maintenanceCFormGroup.controls['ContractResignDate'].markAsDirty();
        }
        else {
            this.contractResignDateDisplay = '';
            this.maintenanceCFormGroup.controls['ContractResignDate'].setValue('');
        }
    };
    MaintenanceTypeCComponent.prototype.fetchContractData = function (functionName, params) {
        var queryContract = new URLSearchParams();
        queryContract.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryContract.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryContract.set(this.serviceConstants.Action, this.queryParamsContract.action);
        if (functionName !== '') {
            queryContract.set(this.serviceConstants.Action, '6');
            queryContract.set('Function', functionName);
        }
        for (var key in params) {
            if (key) {
                queryContract.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.queryParamsContract.method, this.queryParamsContract.module, this.queryParamsContract.operation, queryContract);
    };
    MaintenanceTypeCComponent.prototype.onCapitalize = function (control) {
        if (!this.sysCharParams['vSCCapitalFirstLtr']) {
            this.maintenanceCFormGroup.controls[control].setValue(this.maintenanceCFormGroup.controls[control].value.toString().capitalizeFirstLetter());
        }
    };
    MaintenanceTypeCComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-maintenance-type-c',
                    templateUrl: 'maintenance-type-c.html'
                },] },
    ];
    MaintenanceTypeCComponent.ctorParameters = [
        { type: NgZone, },
        { type: FormBuilder, },
        { type: ActivatedRoute, },
        { type: Store, },
        { type: ServiceConstants, },
        { type: HttpService, },
        { type: Utils, },
        { type: AuthService, },
    ];
    return MaintenanceTypeCComponent;
}());
