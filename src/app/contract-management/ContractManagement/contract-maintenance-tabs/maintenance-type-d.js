import { Component, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { ContractActionTypes } from '../../../../app/actions/contract';
import { HttpService } from '../../../../shared/services/http-service';
import { ErrorService } from '../../../../shared/services/error.service';
import { MessageService } from '../../../../shared/services/message.service';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { Utils } from '../../../../shared/services/utility';
export var MaintenanceTypeDComponent = (function () {
    function MaintenanceTypeDComponent(zone, fb, httpService, serviceConstants, errorService, messageService, route, utils, store) {
        var _this = this;
        this.zone = zone;
        this.fb = fb;
        this.httpService = httpService;
        this.serviceConstants = serviceConstants;
        this.errorService = errorService;
        this.messageService = messageService;
        this.route = route;
        this.utils = utils;
        this.store = store;
        this.promptPaymentInd = false;
        this.retrospectiveInd = false;
        this.query = new URLSearchParams();
        this.queryParams = {
            action: '6',
            operation: 'Application/iCABSAAccountMaintenance',
            module: 'account',
            method: 'contract-management/maintenance',
            contentType: 'application/x-www-form-urlencoded',
            function: 'GetDefaultDiscountDetails',
            discountTypeCode: ''
        };
        this.showMessageHeader = true;
        this.maintenanceDFormGroup = this.fb.group({
            PromptPaymentInd: [{ value: '', disabled: true }],
            PromptPaymentRate: [{ value: '', disabled: true }],
            PromptPaymentNarrative: [{ value: '', disabled: true }],
            RetrospectiveInd: [{ value: '', disabled: true }],
            RetrospectiveRate: [{ value: '', disabled: true }],
            RetrospectiveNarrative: [{ value: '', disabled: true }]
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
                        break;
                    case ContractActionTypes.SAVE_OTHER_PARAMS:
                        _this.otherParams = data['otherParams'];
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
                    case ContractActionTypes.VALIDATE_FORMS:
                        if (data['validate'].typeD) {
                            _this.validateForm();
                        }
                        break;
                    case ContractActionTypes.FORM_RESET:
                        for (var i in _this.maintenanceDFormGroup.controls) {
                            if (_this.maintenanceDFormGroup.controls.hasOwnProperty(i)) {
                                _this.maintenanceDFormGroup.controls[i].clearValidators();
                            }
                        }
                        _this.maintenanceDFormGroup.reset();
                        break;
                    case ContractActionTypes.PARENT_TO_CHILD_COMPONENT:
                        if (data['parentToChildComponent']) {
                            if (data['parentToChildComponent'].PromptPaymentInd) {
                                if (data['parentToChildComponent'].PromptPaymentInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                                    _this.maintenanceDFormGroup.controls['PromptPaymentInd'].setValue(true);
                                    _this.zone.run(function () {
                                        _this.promptPaymentInd = true;
                                    });
                                    _this.maintenanceDFormGroup.controls['PromptPaymentRate'].setValue(data['parentToChildComponent'].PromptPaymentRate);
                                    _this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].setValue(data['parentToChildComponent'].PromptPaymentNarrative);
                                }
                                else {
                                    _this.maintenanceDFormGroup.controls['PromptPaymentInd'].setValue(false);
                                    _this.promptPaymentInd = false;
                                }
                            }
                            if (data['parentToChildComponent'].RetrospectiveInd) {
                                if (data['parentToChildComponent'].RetrospectiveInd.toUpperCase() === GlobalConstant.Configuration.Yes) {
                                    _this.maintenanceDFormGroup.controls['RetrospectiveInd'].setValue(true);
                                    _this.zone.run(function () {
                                        _this.retrospectiveInd = true;
                                    });
                                    _this.maintenanceDFormGroup.controls['RetrospectiveRate'].setValue(data['parentToChildComponent'].RetrospectiveRate);
                                    _this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].setValue(data['parentToChildComponent'].RetrospectiveNarrative);
                                }
                                else {
                                    _this.maintenanceDFormGroup.controls['RetrospectiveInd'].setValue(false);
                                    _this.retrospectiveInd = false;
                                }
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        });
    }
    MaintenanceTypeDComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.store.dispatch({
            type: ContractActionTypes.FORM_GROUP, payload: {
                typeD: this.maintenanceDFormGroup
            }
        });
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    if (data['errorMessage']) {
                    }
                });
            }
        });
        this.messageService.emitMessage(0);
        this.messageSubscription = this.messageService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                });
            }
        });
        this.querySubscription = this.route.queryParams.subscribe(function (params) {
            _this.parentQueryParams = params;
            switch (params['parentMode']) {
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
            switch (params['parentMode']) {
                case 'ContractExpiryGrid':
                case 'DailyTransactions':
                case 'BusinessDailyTransactions':
                case 'ContractPOExpiryGrid':
                    break;
                case 'AddFromProspect':
                    break;
                case 'AddContractFromAccount':
                case 'AddJobFromAccount':
                case 'AddProductFromAccount':
                    if (params['PromptPaymentInd'] && params['PromptPaymentInd'].toUpperCase() === GlobalConstant.Configuration.Yes) {
                        _this.maintenanceDFormGroup.controls['PromptPaymentInd'].setValue(true);
                    }
                    else {
                        _this.maintenanceDFormGroup.controls['PromptPaymentInd'].setValue(false);
                    }
                    if (params['RetrospectiveInd'] && params['RetrospectiveInd'].toUpperCase() === GlobalConstant.Configuration.Yes) {
                        _this.maintenanceDFormGroup.controls['RetrospectiveInd'].setValue(true);
                    }
                    else {
                        _this.maintenanceDFormGroup.controls['RetrospectiveInd'].setValue(false);
                    }
                    break;
                case 'Prospect':
                    break;
                case 'PipelineGrid':
                case 'ProspectPremises':
                    break;
                case 'CallCentreSearch':
                    break;
                case 'GeneralSearch':
                case 'GeneralSearch-Con':
                    break;
                case 'GeneralSearchProduct':
                    break;
                case 'StockUsageSearch':
                case 'TreatmentcardRecall':
                    break;
                case 'NatAccContracts':
                    break;
                case 'InvoiceHistory':
                    break;
            }
        });
        if (this.storeData && this.storeData['data'] && !(Object.keys(this.storeData['data']).length === 0 && this.storeData['data'].constructor === Object)) {
            this.setFormData(this.storeData);
        }
    };
    MaintenanceTypeDComponent.prototype.ngOnDestroy = function () {
        if (this.errorSubscription)
            this.errorSubscription.unsubscribe();
        if (this.messageSubscription)
            this.messageSubscription.unsubscribe();
        this.storeSubscription.unsubscribe();
        if (this.querySubscription)
            this.querySubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    MaintenanceTypeDComponent.prototype.fetchTranslationContent = function () {
    };
    MaintenanceTypeDComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.storeData['services'].translate.get(key, { value: params });
        }
        else {
            return this.storeData['services'].translate.get(key);
        }
    };
    MaintenanceTypeDComponent.prototype.processSysChar = function () {
    };
    MaintenanceTypeDComponent.prototype.setFormData = function (data) {
        this.maintenanceDFormGroup.controls['PromptPaymentInd'].setValue(this.storeData['data'].PromptPaymentInd && this.storeData['data'].PromptPaymentInd.toUpperCase() === GlobalConstant.Configuration.Yes ? true : false);
        this.maintenanceDFormGroup.controls['PromptPaymentRate'].setValue(this.storeData['data'].PromptPaymentRate);
        this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].setValue(this.storeData['data'].PromptPaymentNarrative);
        this.maintenanceDFormGroup.controls['RetrospectiveInd'].setValue(this.storeData['data'].RetrospectiveInd && this.storeData['data'].RetrospectiveInd.toUpperCase() === GlobalConstant.Configuration.Yes ? true : false);
        this.maintenanceDFormGroup.controls['RetrospectiveRate'].setValue(this.storeData['data'].RetrospectiveRate);
        this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].setValue(this.storeData['data'].RetrospectiveNarrative);
    };
    MaintenanceTypeDComponent.prototype.validateForm = function () {
        for (var i in this.maintenanceDFormGroup.controls) {
            if (this.maintenanceDFormGroup.controls.hasOwnProperty(i)) {
                this.maintenanceDFormGroup.controls[i].markAsTouched();
            }
        }
        this.maintenanceDFormGroup.updateValueAndValidity();
        var formValid = null;
        if (!this.maintenanceDFormGroup.enabled) {
            formValid = true;
        }
        else {
            formValid = this.maintenanceDFormGroup.valid;
        }
        this.store.dispatch({
            type: ContractActionTypes.FORM_GROUP, payload: {
                typeD: this.maintenanceDFormGroup
            }
        });
        this.store.dispatch({
            type: ContractActionTypes.FORM_VALIDITY, payload: {
                typeD: formValid
            }
        });
    };
    MaintenanceTypeDComponent.prototype.onPaymentDiscountChange = function (event) {
        var _this = this;
        var postData = {};
        this.queryParams.discountTypeCode = 'PP';
        postData['discountTypeCode'] = this.queryParams.discountTypeCode;
        if (this.promptPaymentInd) {
            this.fetchData(postData).subscribe(function (e) {
                if (e.status === GlobalConstant.Configuration.Failure) {
                    _this.errorService.emitError(e.oResponse);
                }
                else {
                    _this.zone.run(function () {
                        _this.maintenanceDFormGroup.controls['PromptPaymentRate'].enable();
                        if (_this.maintenanceDFormGroup.controls['PromptPaymentRate'].value === '' || isNaN(_this.maintenanceDFormGroup.controls['PromptPaymentRate'].value)) {
                            _this.maintenanceDFormGroup.controls['PromptPaymentRate'].setValue(e.DiscountRate.replace(/,/g, '.'));
                        }
                        _this.maintenanceDFormGroup.controls['PromptPaymentRate'].setValidators(Validators.required);
                        _this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].enable();
                        if (_this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].value === '') {
                            _this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].setValue(e.DiscountNarr);
                        }
                        _this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].setValidators(Validators.required);
                    });
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
        else {
            this.maintenanceDFormGroup.controls['PromptPaymentRate'].clearValidators();
            this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].clearValidators();
        }
    };
    MaintenanceTypeDComponent.prototype.onRetrospectiveDiscountChange = function (event) {
        var _this = this;
        var postData = {};
        this.queryParams.discountTypeCode = 'RD';
        postData['discountTypeCode'] = this.queryParams.discountTypeCode;
        if (this.retrospectiveInd) {
            this.fetchData(postData).subscribe(function (e) {
                if (e.status === GlobalConstant.Configuration.Failure) {
                    _this.errorService.emitError(e.oResponse);
                }
                else {
                    _this.zone.run(function () {
                        _this.maintenanceDFormGroup.controls['RetrospectiveRate'].enable();
                        if (_this.maintenanceDFormGroup.controls['RetrospectiveRate'].value === '' || isNaN(_this.maintenanceDFormGroup.controls['RetrospectiveRate'].value)) {
                            _this.maintenanceDFormGroup.controls['RetrospectiveRate'].setValue(e.DiscountRate.replace(/,/g, '.'));
                        }
                        _this.maintenanceDFormGroup.controls['RetrospectiveRate'].setValidators(Validators.required);
                        _this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].enable();
                        if (_this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].value === '') {
                            _this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].setValue(e.DiscountNarr);
                        }
                        _this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].setValidators(Validators.required);
                    });
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
        else {
            this.maintenanceDFormGroup.controls['RetrospectiveRate'].clearValidators();
            this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].clearValidators();
        }
    };
    MaintenanceTypeDComponent.prototype.setTwoNumberDecimal = function (event) {
        if (!isNaN(parseFloat(this.maintenanceDFormGroup.controls['PromptPaymentRate'].value))) {
            this.maintenanceDFormGroup.controls['PromptPaymentRate'].setValue(parseFloat(this.maintenanceDFormGroup.controls['PromptPaymentRate'].value).toFixed(2));
        }
        else {
            this.maintenanceDFormGroup.controls['PromptPaymentRate'].setValue('');
        }
        if (!isNaN(parseFloat(this.maintenanceDFormGroup.controls['RetrospectiveRate'].value))) {
            this.maintenanceDFormGroup.controls['RetrospectiveRate'].setValue(parseFloat(this.maintenanceDFormGroup.controls['RetrospectiveRate'].value).toFixed(2));
        }
        else {
            this.maintenanceDFormGroup.controls['RetrospectiveRate'].setValue('');
        }
    };
    MaintenanceTypeDComponent.prototype.processForm = function () {
        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            if (this.storeData['data'] && this.storeData['data'].AccountNumber !== '' && this.storeData['data'].AccountNumber !== null) {
                this.maintenanceDFormGroup.controls['PromptPaymentInd'].disable();
                this.maintenanceDFormGroup.controls['RetrospectiveInd'].disable();
            }
            else {
                this.maintenanceDFormGroup.controls['PromptPaymentInd'].enable();
                this.maintenanceDFormGroup.controls['RetrospectiveInd'].enable();
            }
        }
        if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
            this.maintenanceDFormGroup.controls['PromptPaymentInd'].disable();
            this.maintenanceDFormGroup.controls['RetrospectiveInd'].disable();
        }
        if (this.mode['addMode'] && !this.mode['updateMode'] && !this.mode['searchMode']) {
            if (!this.storeData['fieldValue'] || !this.storeData['fieldValue'].AccountNumber || this.storeData['fieldValue'].AccountNumber === '') {
                this.maintenanceDFormGroup.controls['PromptPaymentInd'].enable();
                this.maintenanceDFormGroup.controls['RetrospectiveInd'].enable();
                this.maintenanceDFormGroup.controls['PromptPaymentRate'].enable();
                this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].enable();
                this.maintenanceDFormGroup.controls['RetrospectiveRate'].enable();
                this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].enable();
                this.maintenanceDFormGroup.controls['PromptPaymentInd'].setValue(false);
                this.maintenanceDFormGroup.controls['RetrospectiveInd'].setValue(false);
                this.maintenanceDFormGroup.controls['PromptPaymentRate'].setValue('');
                this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].setValue('');
                this.maintenanceDFormGroup.controls['RetrospectiveRate'].setValue('');
                this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].setValue('');
            }
            else {
                this.maintenanceDFormGroup.controls['PromptPaymentInd'].disable();
                this.maintenanceDFormGroup.controls['RetrospectiveInd'].disable();
                this.maintenanceDFormGroup.controls['PromptPaymentRate'].disable();
                this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].disable();
                this.maintenanceDFormGroup.controls['RetrospectiveRate'].disable();
                this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].disable();
                this.maintenanceDFormGroup.controls['PromptPaymentInd'].setValue(false);
                this.maintenanceDFormGroup.controls['RetrospectiveInd'].setValue(false);
                this.maintenanceDFormGroup.controls['PromptPaymentRate'].setValue('');
                this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].setValue('');
                this.maintenanceDFormGroup.controls['RetrospectiveRate'].setValue('');
                this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].setValue('');
            }
            if (this.sysCharParams && this.sysCharParams['vSCAccountDiscounts']) {
                switch (this.parentQueryParams['parent']) {
                    case 'AddContractFromAccount':
                    case 'AddJobFromAccount':
                    case 'AddProductFromAccount':
                        this.maintenanceDFormGroup.controls['PromptPaymentInd'].disable();
                        this.maintenanceDFormGroup.controls['RetrospectiveInd'].disable();
                        this.maintenanceDFormGroup.controls['PromptPaymentRate'].disable();
                        this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].disable();
                        this.maintenanceDFormGroup.controls['RetrospectiveRate'].disable();
                        this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].disable();
                        this.maintenanceDFormGroup.controls['PromptPaymentInd'].setValue(false);
                        this.maintenanceDFormGroup.controls['RetrospectiveInd'].setValue(false);
                        this.maintenanceDFormGroup.controls['PromptPaymentRate'].setValue('');
                        this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].setValue('');
                        this.maintenanceDFormGroup.controls['RetrospectiveRate'].setValue('');
                        this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].setValue('');
                        break;
                    case 'ServiceCover':
                    case 'Premise':
                    case 'ServiceVisitWorkIndex':
                        break;
                    case 'Portfolio General Maintenance':
                        break;
                    default:
                        this.maintenanceDFormGroup.controls['PromptPaymentInd'].enable();
                        this.maintenanceDFormGroup.controls['RetrospectiveInd'].enable();
                        this.maintenanceDFormGroup.controls['PromptPaymentRate'].enable();
                        this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].enable();
                        this.maintenanceDFormGroup.controls['RetrospectiveRate'].enable();
                        this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].enable();
                        this.maintenanceDFormGroup.controls['PromptPaymentInd'].setValue(false);
                        this.maintenanceDFormGroup.controls['RetrospectiveInd'].setValue(false);
                        this.maintenanceDFormGroup.controls['PromptPaymentRate'].setValue('');
                        this.maintenanceDFormGroup.controls['PromptPaymentNarrative'].setValue('');
                        this.maintenanceDFormGroup.controls['RetrospectiveRate'].setValue('');
                        this.maintenanceDFormGroup.controls['RetrospectiveNarrative'].setValue('');
                        break;
                }
            }
            this.store.dispatch({
                type: ContractActionTypes.FORM_GROUP, payload: {
                    typeD: this.maintenanceDFormGroup
                }
            });
        }
    };
    MaintenanceTypeDComponent.prototype.fetchData = function (data) {
        this.query.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
        this.query.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        this.query.set(this.serviceConstants.Action, this.queryParams.action);
        this.query.set('function', this.queryParams.function);
        return this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.query, data);
    };
    MaintenanceTypeDComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-maintenance-type-d',
                    templateUrl: 'maintenance-type-d.html',
                    providers: [ErrorService, MessageService]
                },] },
    ];
    MaintenanceTypeDComponent.ctorParameters = [
        { type: NgZone, },
        { type: FormBuilder, },
        { type: HttpService, },
        { type: ServiceConstants, },
        { type: ErrorService, },
        { type: MessageService, },
        { type: ActivatedRoute, },
        { type: Utils, },
        { type: Store, },
    ];
    MaintenanceTypeDComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageTypeDModal',] },],
    };
    return MaintenanceTypeDComponent;
}());
