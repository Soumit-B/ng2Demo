import { Component, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpService } from '../../../../shared/services/http-service';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { ContractActionTypes } from '../../../../app/actions/contract';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { Utils } from '../../../../shared/services/utility';
export var MaintenanceTypeEComponent = (function () {
    function MaintenanceTypeEComponent(zone, fb, route, store, httpService, utils, serviceConstants) {
        var _this = this;
        this.zone = zone;
        this.fb = fb;
        this.route = route;
        this.store = store;
        this.httpService = httpService;
        this.utils = utils;
        this.serviceConstants = serviceConstants;
        this.inputParams = { 'parentMode': 'Contract-Search', 'ContractTypeCode': '', 'countryCode': '', 'businessCode': '' };
        this.promptPaymentInd = false;
        this.retrospectiveInd = true;
        this.radioList = {
            radioRow1: [
                { value: 'YES', display: 'Yes', enable: false },
                { value: 'NO', display: 'No', enable: false },
                { value: 'MIXED', display: 'Mixed', enable: false }
            ],
            radioRow2: [
                { value: 'YES', display: 'Yes', enable: false },
                { value: 'NO', display: 'No', enable: false },
                { value: 'MIXED', display: 'Mixed', enable: false }
            ],
            radioRow3: [
                { value: 'YES', display: 'Yes', enable: false },
                { value: 'NO', display: 'No', enable: false },
                { value: 'MIXED', display: 'Mixed', enable: false }
            ],
            radioRow4: [
                { value: 'YES', display: 'Yes', enable: false },
                { value: 'NO', display: 'No', enable: false },
                { value: 'MIXED', display: 'Mixed', enable: false }
            ]
        };
        this.radioModel = {
            radioRow1: '',
            radioRow2: '',
            radioRow3: '',
            radioRow4: ''
        };
        this.radioVisibility = {
            visibleRow1: true,
            visibleRow2: true,
            visibleRow3: true,
            visibleRow4: true
        };
        this.radioEnable = {
            radioRow1: false,
            radioRow2: false,
            radioRow3: false,
            radioRow4: false
        };
        this.translatedRadioDisplayValues = {
            yes: 'Yes',
            no: 'No',
            mixed: 'Mixed'
        };
        this.queryParamsContract = {
            action: '0',
            operation: 'Application/iCABSAContractMaintenance',
            module: 'contract',
            method: 'contract-management/maintenance',
            contentType: 'application/x-www-form-urlencoded',
            branchNumber: '',
            branchName: ''
        };
        this.queryContract = new URLSearchParams();
        this.maintenanceEFormGroup = this.fb.group({
            CICResponseSLA: [{ value: '', disabled: true }],
            CIFirstSLAEscDays: [{ value: '', disabled: true }],
            CISubSLAEscDays: [{ value: '', disabled: true }]
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
                        break;
                    case ContractActionTypes.SAVE_MODE:
                        _this.mode = data['mode'];
                        _this.processForm();
                        break;
                    case ContractActionTypes.SAVE_SYSCHAR:
                        if (data['syschars']) {
                            _this.sysCharParams = data['syschars'];
                        }
                        break;
                    case ContractActionTypes.SAVE_PARAMS:
                        _this.params = data['params'];
                        _this.inputParams = data['params'];
                        break;
                    case ContractActionTypes.SAVE_OTHER_PARAMS:
                        _this.otherParams = data['otherParams'];
                        break;
                    case ContractActionTypes.SAVE_CODE:
                        break;
                    case ContractActionTypes.SAVE_FIELD:
                        break;
                    case ContractActionTypes.SAVE_SENT_FROM_PARENT:
                        break;
                    case ContractActionTypes.BEFORE_SAVE:
                        break;
                    case ContractActionTypes.SAVE_SERVICE:
                        _this.translateSubscription = _this.storeData['services'].localeTranslateService.ajaxSource$.subscribe(function (event) {
                            if (event !== 0) {
                                _this.fetchTranslationContent();
                            }
                        });
                        break;
                    case ContractActionTypes.AFTER_SAVE:
                        _this.disableCIRSFields(true);
                        break;
                    case ContractActionTypes.AFTER_FETCH:
                        _this.afterFetch();
                        break;
                    case ContractActionTypes.VALIDATE_FORMS:
                        if (data['validate'].typeE) {
                            _this.validateForm();
                        }
                        break;
                    case ContractActionTypes.FORM_RESET:
                        for (var i in _this.maintenanceEFormGroup.controls) {
                            if (_this.maintenanceEFormGroup.controls.hasOwnProperty(i)) {
                                _this.maintenanceEFormGroup.controls[i].clearValidators();
                            }
                        }
                        _this.maintenanceEFormGroup.reset();
                        break;
                    default:
                        break;
                }
            }
        });
    }
    MaintenanceTypeEComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.store.dispatch({
            type: ContractActionTypes.FORM_GROUP, payload: {
                typeE: this.maintenanceEFormGroup
            }
        });
        this.querySubscription = this.route.queryParams.subscribe(function (params) {
            _this.parentQueryParams = params;
            switch (params['parent']) {
                case 'AddContractFromAccount':
                case 'AddJobFromAccount':
                case 'AddProductFromAccount':
                    break;
                case 'ServiceCover':
                case 'Premise':
                case 'ServiceVisitWorkIndex':
                    break;
                case 'Portfolio General Maintenance':
                    break;
                default:
                    break;
            }
        });
        if (this.storeData && this.storeData['data'] && !(Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object)) {
            this.setFormData(this.storeData);
        }
    };
    MaintenanceTypeEComponent.prototype.ngOnDestroy = function () {
        this.storeSubscription.unsubscribe();
        if (this.querySubscription)
            this.querySubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    MaintenanceTypeEComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('No', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.translatedRadioDisplayValues['no'] = res;
                }
            });
        });
    };
    MaintenanceTypeEComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.storeData['services'].translate.get(key, { value: params });
        }
        else {
            return this.storeData['services'].translate.get(key);
        }
    };
    MaintenanceTypeEComponent.prototype.processSysChar = function () {
    };
    MaintenanceTypeEComponent.prototype.setFormData = function (data) {
        this.maintenanceEFormGroup.controls['CICResponseSLA'].setValue(this.storeData['data'].CICResponseSLA);
        this.maintenanceEFormGroup.controls['CIFirstSLAEscDays'].setValue(this.storeData['data'].CIFirstSLAEscDays);
        this.maintenanceEFormGroup.controls['CISubSLAEscDays'].setValue(this.storeData['data'].CISubSLAEscDays);
        this.radioModel['radioRow1'] = this.storeData['data'].CICustRefReq ? this.storeData['data'].CICustRefReq.toUpperCase() : '';
        this.radioModel['radioRow2'] = this.storeData['data'].CIRWOReq ? this.storeData['data'].CIRWOReq.toUpperCase() : '';
        this.radioModel['radioRow3'] = this.storeData['data'].CICFWOReq ? this.storeData['data'].CICFWOReq.toUpperCase() : '';
        this.radioModel['radioRow4'] = this.storeData['data'].CICFWOSep ? this.storeData['data'].CICFWOSep.toUpperCase() : '';
    };
    MaintenanceTypeEComponent.prototype.processForm = function () {
        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            this.maintenanceEFormGroup.controls['CICResponseSLA'].enable();
            this.maintenanceEFormGroup.controls['CIFirstSLAEscDays'].enable();
            this.maintenanceEFormGroup.controls['CISubSLAEscDays'].enable();
            if (this.otherParams['blnCIEnabled']) {
                this.disableCIRSFields(false);
            }
        }
        if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
            this.maintenanceEFormGroup.controls['CICResponseSLA'].disable();
            this.maintenanceEFormGroup.controls['CIFirstSLAEscDays'].disable();
            this.maintenanceEFormGroup.controls['CISubSLAEscDays'].disable();
            this.disableCIRSFields(true);
        }
        if (this.mode['addMode'] && !this.mode['updateMode'] && !this.mode['searchMode']) {
            this.maintenanceEFormGroup.controls['CICResponseSLA'].enable();
            this.maintenanceEFormGroup.controls['CIFirstSLAEscDays'].enable();
            this.maintenanceEFormGroup.controls['CISubSLAEscDays'].enable();
            if (this.otherParams && this.otherParams['blnCIEnabled'] === true) {
                this.radioModel['radioRow1'] = this.translatedRadioDisplayValues['no'];
                this.radioModel['radioRow2'] = this.translatedRadioDisplayValues['no'];
                this.radioModel['radioRow3'] = this.translatedRadioDisplayValues['no'];
                ;
                this.radioModel['radioRow4'] = this.translatedRadioDisplayValues['no'];
                this.maintenanceEFormGroup.controls['CICResponseSLA'].disable();
                this.maintenanceEFormGroup.controls['CIFirstSLAEscDays'].disable();
                this.maintenanceEFormGroup.controls['CISubSLAEscDays'].disable();
            }
            this.store.dispatch({
                type: ContractActionTypes.FORM_GROUP, payload: {
                    typeE: this.maintenanceEFormGroup
                }
            });
        }
        if (this.mode['addMode'] || this.mode['updateMode']) {
            this.inputParams = Object.assign({}, this.inputParams, {
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business
            });
        }
    };
    MaintenanceTypeEComponent.prototype.disableCIRSFields = function (val) {
        this.radioList['radioRow1'][0].enable = !val;
        this.radioList['radioRow1'][1].enable = !val;
        this.radioList['radioRow2'][0].enable = !val;
        this.radioList['radioRow2'][1].enable = !val;
        this.radioList['radioRow3'][0].enable = !val;
        this.radioList['radioRow3'][1].enable = !val;
        this.radioList['radioRow4'][0].enable = !val;
        this.radioList['radioRow4'][1].enable = !val;
    };
    MaintenanceTypeEComponent.prototype.afterFetch = function () {
        if (this.storeData['otherParams'].blnCIEnabled) {
            if (this.storeData['data']) {
                this.maintenanceEFormGroup.controls['CICResponseSLA'].setValue(this.storeData['data'].CICResponseSLA);
                this.maintenanceEFormGroup.controls['CIFirstSLAEscDays'].setValue(this.storeData['data'].CIFirstSLAEscDays);
                this.maintenanceEFormGroup.controls['CISubSLAEscDays'].setValue(this.storeData['data'].CISubSLAEscDays);
                this.radioModel['radioRow1'] = this.storeData['data'].CICustRefReq ? this.storeData['data'].CICustRefReq.toUpperCase() : '';
                this.radioModel['radioRow2'] = this.storeData['data'].CIRWOReq ? this.storeData['data'].CIRWOReq.toUpperCase() : '';
                this.radioModel['radioRow3'] = this.storeData['data'].CICFWOReq ? this.storeData['data'].CICFWOReq.toUpperCase() : '';
                this.radioModel['radioRow4'] = this.storeData['data'].CICFWOSep ? this.storeData['data'].CICFWOSep.toUpperCase() : '';
            }
        }
    };
    MaintenanceTypeEComponent.prototype.fetchContractData = function (functionName, params) {
        var businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
        var countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();
        this.queryContract.set(this.serviceConstants.BusinessCode, businessCode);
        this.queryContract.set(this.serviceConstants.CountryCode, countryCode);
        this.queryContract.set(this.serviceConstants.Action, this.queryParamsContract.action);
        if (functionName !== '') {
            this.queryContract.set(this.serviceConstants.Action, '6');
            this.queryContract.set('Function', functionName);
        }
        for (var key in params) {
            if (key) {
                this.queryContract.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.queryParamsContract.method, this.queryParamsContract.module, this.queryParamsContract.operation, this.queryContract);
    };
    MaintenanceTypeEComponent.prototype.validateForm = function () {
        for (var i in this.maintenanceEFormGroup.controls) {
            if (this.maintenanceEFormGroup.controls.hasOwnProperty(i)) {
                this.maintenanceEFormGroup.controls[i].markAsTouched();
            }
        }
        this.maintenanceEFormGroup.updateValueAndValidity();
        var formValid = null;
        if (!this.maintenanceEFormGroup.enabled) {
            formValid = true;
        }
        else {
            formValid = this.maintenanceEFormGroup.valid;
        }
        this.store.dispatch({
            type: ContractActionTypes.FORM_GROUP, payload: {
                typeE: this.maintenanceEFormGroup
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.FORM_VALIDITY, payload: {
                typeE: formValid
            }
        });
    };
    MaintenanceTypeEComponent.prototype.checkNumeric = function (event) {
        if (isNaN(event.target.value)) {
            event.target.value = '';
        }
    };
    MaintenanceTypeEComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-maintenance-type-e',
                    templateUrl: 'maintenance-type-e.html',
                    styles: ["\n    .radio-cont span {\n        vertical-align: text-bottom;\n    }\n    [type=\"radio\"]:not(:checked), [type=\"radio\"]:checked {\n        opacity: 1;\n        position: static;\n    }\n    "]
                },] },
    ];
    MaintenanceTypeEComponent.ctorParameters = [
        { type: NgZone, },
        { type: FormBuilder, },
        { type: ActivatedRoute, },
        { type: Store, },
        { type: HttpService, },
        { type: Utils, },
        { type: ServiceConstants, },
    ];
    return MaintenanceTypeEComponent;
}());
