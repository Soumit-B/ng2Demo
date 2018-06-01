import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { Component, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { URLSearchParams } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TranslateService } from 'ng2-translate';
import { LocalStorageService } from 'ng2-webstorage';
import { Http } from '@angular/http';
import { Store } from '@ngrx/store';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { HttpService } from './../../../shared/services/http-service';
import { ErrorService } from '../../../shared/services/error.service';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { PageDataService } from '../../../shared/services/page-data.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MessageService } from '../../../shared/services/message.service';
import { CBBService } from '../../../shared/services/cbb.service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { Utils } from '../../../shared/services/utility';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
export var ApiReverseMaintenanceComponent = (function () {
    function ApiReverseMaintenanceComponent(httpService, fb, serviceConstants, errorService, messageService, authService, ajaxconstant, router, pageData, titleService, store, zone, ls, translate, http, localeTranslateService, componentInteractionService, utils, routeAwayGlobals, cbb) {
        this.httpService = httpService;
        this.fb = fb;
        this.serviceConstants = serviceConstants;
        this.errorService = errorService;
        this.messageService = messageService;
        this.authService = authService;
        this.ajaxconstant = ajaxconstant;
        this.router = router;
        this.pageData = pageData;
        this.titleService = titleService;
        this.store = store;
        this.zone = zone;
        this.ls = ls;
        this.translate = translate;
        this.http = http;
        this.localeTranslateService = localeTranslateService;
        this.componentInteractionService = componentInteractionService;
        this.utils = utils;
        this.routeAwayGlobals = routeAwayGlobals;
        this.cbb = cbb;
        this.query = new URLSearchParams();
        this.queryPost = new URLSearchParams();
        this.queryForBranch = new URLSearchParams();
        this.queryLookUp = new URLSearchParams();
        this.method = 'contract-management/maintenance';
        this.module = 'api';
        this.operation = 'Application/iCABSAAPIReverse';
        this.contentType = 'application/x-www-form-urlencoded';
        this.ajaxSource = new BehaviorSubject(0);
        this.isRequesting = false;
        this.contractAutoOpen = false;
        this.showHeader = true;
        this.showCloseButton = true;
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.inputParams = {
            'parentMode': 'API Reverse',
            'businessCode': '',
            'countryCode': '',
            'methodType': 'maintenance',
            'action': '',
            'pageTitle': 'API Reverse',
            'showAddNew': false
        };
        this.inputParamsServiceCoverSearch = {
            'parentMode': 'Search',
            'businessCode': '',
            'countryCode': '',
            'ContractNumber': '',
            'ContractName': '',
            'PremiseNumber': '',
            'PremiseName': '',
            'showAddNew': false
        };
        this.inputParamsPremise = {
            'parentMode': 'Search',
            'ContractNumber': '',
            'ContractName': '',
            'showAddNew': false
        };
        this.queryParams = {
            'level': '',
            'branchNumber': ''
        };
        this.queryParamsForBranch = {
            module: 'structure',
            operation: 'Business/iCABSBBranchSearch',
            method: 'it-functions/search',
            table: 'userauthoritybranch',
            action: 0
        };
        this.buttonTranslatedText = {
            'update': 'Update',
            'cancel': 'Cancel'
        };
        this.serviceCoverRowID = '';
        this.isContractDisabled = false;
        this.contractData = {};
        this.premiseData = {};
        this.productData = {};
        this.isFormEnabled = false;
        this.isFormValid = false;
    }
    ApiReverseMaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.apiReverseFormGroup = this.fb.group({
            contractNumber: [{ value: '', disabled: false }, Validators.required],
            contractDesc: [{ value: '', disabled: true }],
            premiseNumber: [{ value: '', disabled: false }, Validators.required],
            premiseDesc: [{ value: '', disabled: true }],
            productCode: [{ value: '', disabled: false }, Validators.required],
            productDesc: [{ value: '', disabled: true }],
            visitFrequency: [{ value: '', disabled: true }],
            effectiveDate: [{ value: '', disabled: true }],
            currentValue: [{ value: '', disabled: true }],
            effectiveValue: [{ value: '', disabled: true }],
            lastValue: [{ value: '', disabled: true }],
            lastRemovalValue: [{ value: '', disabled: true }]
        });
        this.router.events.subscribe(function (event) {
            if (event.url.indexOf('/billtocash/contract/apireverse') !== -1) {
                _this.mode = 'Contract';
                _this.queryParams.level = 'Contract';
                _this.apiReverseFormGroup.controls['premiseNumber'].clearValidators();
                _this.apiReverseFormGroup.controls['productCode'].clearValidators();
                _this.apiReverseFormGroup.controls['premiseNumber'].updateValueAndValidity();
                _this.apiReverseFormGroup.controls['productCode'].updateValueAndValidity();
            }
            else if (event.url.indexOf('/billtocash/premise/apireverse') !== -1) {
                _this.mode = 'Premise';
                _this.queryParams.level = 'Premise';
                _this.apiReverseFormGroup.controls['productCode'].clearValidators();
                _this.apiReverseFormGroup.controls['productCode'].updateValueAndValidity();
            }
            else if (event.url.indexOf('/billtocash/servicecover/apireverse') !== -1) {
                _this.mode = 'Service';
                _this.queryParams.level = 'Service';
            }
        });
        if (this.mode === 'Premise') {
            this.inputParamsPremise.parentMode = 'Search';
        }
        else {
            this.inputParamsPremise.parentMode = 'LookUp';
        }
        this.contractSearchComponent = ContractSearchComponent;
        this.premiseSearchComponent = PremiseSearchComponent;
        this.productSearchComponent = ServiceCoverSearchComponent;
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    if (data.errorMessage) {
                        _this.errorModal.show(data, true);
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
        this.ajaxSubscription = this.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.zone.run(function () {
                    switch (event) {
                        case _this.ajaxconstant.START:
                            _this.isRequesting = true;
                            break;
                        case _this.ajaxconstant.COMPLETE:
                            _this.isRequesting = false;
                            break;
                    }
                });
            }
        });
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
            }
        });
        this.titleService.setTitle(this.inputParams.pageTitle);
        this.localeTranslateService.setUpTranslation();
        this.routeAwayUpdateSaveFlag();
        this.routeAwayGlobals.setEllipseOpenFlag(false);
    };
    ApiReverseMaintenanceComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.contractAutoOpen = true;
        setTimeout(function () {
            _this.contractAutoOpen = false;
        });
    };
    ApiReverseMaintenanceComponent.prototype.ngOnDestroy = function () {
        this.errorSubscription.unsubscribe();
        this.messageSubscription.unsubscribe();
        this.ajaxSubscription.unsubscribe();
        this.translateSubscription.unsubscribe();
        this.routeAwayGlobals.resetRouteAwayFlags();
    };
    ApiReverseMaintenanceComponent.prototype.onSubmit = function (data, valid, event) {
        var _this = this;
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        event.preventDefault();
        var formdata = {};
        this.queryPost.set(this.serviceConstants.BusinessCode, this.contractData.BusinessCode ? this.contractData.BusinessCode : this.utils.getBusinessCode());
        this.queryPost.set(this.serviceConstants.CountryCode, this.contractData.CountryCode ? this.contractData.CountryCode : this.utils.getCountryCode());
        this.queryPost.set('Level', this.queryParams.level);
        this.queryPost.set(this.serviceConstants.Action, '2');
        this.queryPost.set('BranchNumber', this.queryParams.branchNumber ? this.queryParams.branchNumber : this.cbb.getBranchCode());
        if (this.mode === 'Contract') {
            formdata['ContractNumber'] = this.apiReverseFormGroup.controls['contractNumber'].value;
            formdata['ContractName'] = this.apiReverseFormGroup.controls['contractDesc'].value;
        }
        else if (this.mode === 'Premise') {
            formdata['ContractNumber'] = this.apiReverseFormGroup.controls['contractNumber'].value;
            formdata['PremiseNumber'] = this.apiReverseFormGroup.controls['premiseNumber'].value;
            formdata['PremiseName'] = this.apiReverseFormGroup.controls['premiseDesc'].value;
        }
        else if (this.mode === 'Service') {
            formdata['ContractNumber'] = this.apiReverseFormGroup.controls['contractNumber'].value;
            formdata['PremiseNumber'] = this.apiReverseFormGroup.controls['premiseNumber'].value;
            formdata['ProductCode'] = this.apiReverseFormGroup.controls['productCode'].value;
            formdata['ServiceVisitFrequency'] = this.apiReverseFormGroup.controls['visitFrequency'].value;
            formdata['ServiceCoverROWID'] = this.serviceCoverRowID;
        }
        this.inputParams.search = this.queryPost;
        if (valid) {
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.method, this.module, this.operation, this.queryPost, formdata)
                .subscribe(function (e) {
                if (e.status === 'failure') {
                    _this.errorService.emitError(e.oResponse);
                }
                else {
                    if (e.errorMessage && e.errorMessage !== '') {
                        setTimeout(function () {
                            _this.errorService.emitError(e);
                        }, 200);
                    }
                    else {
                        _this.messageService.emitMessage(e);
                        _this.disableForm();
                    }
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.errorMessage = error;
                _this.errorService.emitError(error);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    ApiReverseMaintenanceComponent.prototype.fetchAPIDetails = function () {
        var _this = this;
        this.query.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.query.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.query.set('Level', this.queryParams.level);
        this.query.set(this.serviceConstants.Action, '0');
        this.query.set('BranchNumber', this.queryParams.branchNumber ? this.queryParams.branchNumber : this.cbb.getBranchCode());
        this.query.set('ContractNumber', this.apiReverseFormGroup.controls['contractNumber'].value);
        this.query.set('ContractName', this.apiReverseFormGroup.controls['contractDesc'].value);
        if (this.mode === 'Premise') {
            this.query.set('PremiseNumber', this.apiReverseFormGroup.controls['premiseNumber'].value);
            this.query.set('PremiseDesc', this.apiReverseFormGroup.controls['premiseDesc'].value);
        }
        else if (this.mode === 'Service') {
            this.query.set('PremiseNumber', this.apiReverseFormGroup.controls['premiseNumber'].value);
            this.query.set('PremiseDesc', this.apiReverseFormGroup.controls['premiseDesc'].value);
            this.query.set('ProductCode', this.apiReverseFormGroup.controls['productCode'].value);
            this.query.set('ProductDesc', this.apiReverseFormGroup.controls['productDesc'].value);
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.method, this.module, this.operation, this.query)
            .subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e.errorMessage && e.errorMessage !== '') {
                    setTimeout(function () {
                        _this.errorService.emitError(e);
                    }, 200);
                    _this.isFormValid = false;
                }
                else {
                    _this.isFormValid = true;
                    _this.apiReverseFormGroup.controls['visitFrequency'].setValue(e.ServiceVisitFrequency);
                    _this.apiReverseFormGroup.controls['effectiveDate'].setValue(e.APIEffectiveDate);
                    _this.apiReverseFormGroup.controls['currentValue'].setValue(e.CurrentValue);
                    _this.apiReverseFormGroup.controls['effectiveValue'].setValue(e.ValueAtEffectDate);
                    _this.apiReverseFormGroup.controls['lastValue'].setValue(e.APIValue);
                    _this.apiReverseFormGroup.controls['lastRemovalValue'].setValue(e.NewAPIValue);
                    if (e.ServiceCover) {
                        _this.serviceCoverRowID = e.ServiceCover;
                    }
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.isFormValid = false;
        });
    };
    ApiReverseMaintenanceComponent.prototype.fetchBranchDetails = function (contractData, triggerAPI) {
        var _this = this;
        this.queryParams.branchNumber = this.cbb.getBranchCode();
        if (!this.queryParams.branchNumber) {
            var userCode = this.authService.getSavedUserCode();
            var data = [{
                    'table': 'UserAuthorityBranch',
                    'query': { 'UserCode': userCode.UserCode, 'BusinessCode': this.utils.getBusinessCode() },
                    'fields': ['BusinessCode', 'BranchNumber', 'DefaultBranchInd', 'CurrentBranchInd', 'UserCode']
                }];
            this.contractData = contractData;
            this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0 && !_this.queryParams.branchNumber) {
                    var found = false;
                    for (var i = 0; i < e['results'][0].length; i++) {
                        if (e['results'][0][i].CurrentBranchInd) {
                            _this.queryParams.branchNumber = e['results'][0][i].BranchNumber;
                            found = true;
                        }
                    }
                    if (!found) {
                        for (var i = 0; i < e['results'][0].length; i++) {
                            if (e['results'][0][i].DefaultBranchInd) {
                                _this.queryParams.branchNumber = e['results'][0][i].BranchNumber;
                                break;
                            }
                        }
                    }
                    if (triggerAPI) {
                        _this.fetchAPIDetails();
                    }
                }
                else {
                    if (triggerAPI) {
                        _this.fetchAPIDetails();
                    }
                }
            }, function (error) {
            });
        }
        else {
            if (triggerAPI) {
                this.fetchAPIDetails();
            }
        }
    };
    ApiReverseMaintenanceComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    };
    ApiReverseMaintenanceComponent.prototype.fetchTranslationContent = function () {
    };
    ApiReverseMaintenanceComponent.prototype.onContractDataReceived = function (data, route) {
        this.contractData = data;
        this.apiReverseFormGroup.controls['contractNumber'].setValue(data.ContractNumber);
        this.apiReverseFormGroup.controls['contractDesc'].setValue(data.ContractName);
        this.inputParamsServiceCoverSearch.ContractNumber = data.ContractNumber;
        this.inputParamsServiceCoverSearch.ContractName = data['ContractName'] ? data['ContractName'] : '';
        this.inputParamsPremise.ContractNumber = data.ContractNumber;
        this.inputParamsPremise.ContractName = data['ContractName'] ? data['ContractName'] : '';
        this.cbb.disableComponent(true);
        if (this.mode === 'Contract') {
            this.fetchBranchDetails(this.contractData, true);
        }
        else {
            if (this.mode === 'Premise') {
                if (this.apiReverseFormGroup.controls['premiseNumber'].value !== '') {
                    this.fetchBranchDetails(this.contractData, true);
                }
                else {
                    this.fetchBranchDetails(this.contractData, false);
                }
            }
            if (this.mode === 'Service') {
                if (this.apiReverseFormGroup.controls['premiseNumber'].value !== '' && this.apiReverseFormGroup.controls['productCode'].value !== '') {
                    this.fetchBranchDetails(this.contractData, true);
                }
                else {
                    this.fetchBranchDetails(this.contractData, false);
                }
            }
        }
    };
    ApiReverseMaintenanceComponent.prototype.onProductDataReceived = function (data, route) {
        this.productData = data;
        this.apiReverseFormGroup.controls['productCode'].setValue(data.ProductCode);
        this.apiReverseFormGroup.controls['productDesc'].setValue(data.ProductDesc);
        if (this.mode === 'Service' && this.apiReverseFormGroup.controls['contractNumber'].value !== '' && this.apiReverseFormGroup.controls['premiseNumber'].value !== '') {
            this.fetchAPIDetails();
        }
    };
    ApiReverseMaintenanceComponent.prototype.onPremiseDataReceived = function (data, route) {
        this.premiseData = data;
        this.apiReverseFormGroup.controls['premiseNumber'].setValue(data.PremiseNumber);
        this.apiReverseFormGroup.controls['premiseDesc'].setValue(data.PremiseDesc);
        this.inputParamsServiceCoverSearch.PremiseNumber = data.PremiseNumber;
        this.inputParamsServiceCoverSearch.PremiseDesc = data['PremiseDesc'] ? data['PremiseDesc'] : '';
        if (this.mode === 'Premise' && this.apiReverseFormGroup.controls['contractNumber'].value !== '') {
            this.fetchAPIDetails();
        }
    };
    ApiReverseMaintenanceComponent.prototype.onBlur = function (event) {
        var _this = this;
        this.isContractDisabled = true;
        this.contractAutoOpen = false;
        var elementValue = event.target.value;
        if (elementValue.length > 0 && elementValue.length < 8) {
            var _paddedValue = this.numberPadding(elementValue, 8);
            if (event.target.id === 'contractNumber') {
                this.apiReverseFormGroup.controls['contractNumber'].setValue(_paddedValue.toUpperCase());
            }
        }
        if (this.apiReverseFormGroup.controls['contractNumber'].value.trim() !== '') {
            if (this.contractData && this.contractData.ContractNumber === elementValue) {
                this.isContractDisabled = false;
                return;
            }
            var data = [{
                    'table': 'contract',
                    'query': { 'ContractNumber': this.apiReverseFormGroup.controls['contractNumber'].value },
                    'fields': ['BusinessCode', 'ContractNumber', 'ContractName', 'CountryCode']
                }];
            this.ajaxSource.next(this.ajaxconstant.START);
            this.lookUpRecord(JSON.parse(JSON.stringify(data)), 5).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                    _this.apiReverseFormGroup.controls['contractDesc'].setValue(e['results'][0][0].ContractName);
                    if (_this.mode === 'Contract') {
                        _this.fetchBranchDetails(e['results'][0][0], true);
                    }
                    else if (_this.mode === 'Premise') {
                        _this.onPremiseBlur();
                    }
                    else if (_this.mode === 'Service') {
                        _this.onProductBlur();
                    }
                    _this.cbb.disableComponent(true);
                }
                else {
                    e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                    _this.errorService.emitError(e);
                    _this.apiReverseFormGroup.controls['contractNumber'].setValue('');
                    _this.apiReverseFormGroup.controls['contractDesc'].setValue('');
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.isContractDisabled = false;
            }, function (error) {
                error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                _this.errorService.emitError(error);
                _this.apiReverseFormGroup.controls['contractNumber'].setValue('');
                _this.apiReverseFormGroup.controls['contractDesc'].setValue('');
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.isContractDisabled = false;
            });
        }
        else {
            this.isContractDisabled = false;
        }
    };
    ;
    ApiReverseMaintenanceComponent.prototype.onPremiseBlur = function () {
        var _this = this;
        if (this.apiReverseFormGroup.controls['premiseNumber'].value.trim() !== '' && this.apiReverseFormGroup.controls['contractNumber'].value.trim() !== '') {
            this.isContractDisabled = true;
            var data = [{
                    'table': 'Premise',
                    'query': { 'ContractNumber': this.apiReverseFormGroup.controls['contractNumber'].value, 'PremiseNumber': this.apiReverseFormGroup.controls['premiseNumber'].value },
                    'fields': ['BusinessCode', 'PremiseNumber', 'PremiseName']
                }];
            this.ajaxSource.next(this.ajaxconstant.START);
            this.lookUpRecord(data, 5).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                    if (_this.mode === 'Premise') {
                        _this.fetchAPIDetails();
                    }
                    else if (_this.mode === 'Service') {
                    }
                    _this.apiReverseFormGroup.controls['premiseDesc'].setValue(e['results'][0][0].PremiseName);
                }
                else {
                    e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                    _this.errorService.emitError(e);
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.isContractDisabled = false;
            }, function (error) {
                error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                _this.errorService.emitError(error);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.isContractDisabled = false;
            });
        }
    };
    ApiReverseMaintenanceComponent.prototype.onProductBlur = function () {
        var _this = this;
        if (this.apiReverseFormGroup.controls['productCode'].value.trim() !== '' && this.apiReverseFormGroup.controls['contractNumber'].value.trim() !== '' && this.apiReverseFormGroup.controls['premiseNumber'].value.trim() !== '') {
            this.isContractDisabled = true;
            var productData = [{
                    'table': 'Product',
                    'query': { 'ProductCode': this.apiReverseFormGroup.controls['productCode'].value },
                    'fields': ['BusinessCode', 'ProductDesc']
                }];
            this.ajaxSource.next(this.ajaxconstant.START);
            this.lookUpRecord(productData, 100).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                    _this.apiReverseFormGroup.controls['productDesc'].setValue(e['results'][0][0].ProductDesc);
                    var data = [{
                            'table': 'ServiceCover',
                            'query': { 'ContractNumber': _this.apiReverseFormGroup.controls['contractNumber'].value, 'PremiseNumber': _this.apiReverseFormGroup.controls['premiseNumber'].value, 'ProductCode': _this.apiReverseFormGroup.controls['productCode'].value },
                            'fields': ['BusinessCode', 'ContractNumber', 'PremiseNumber', 'PremiseName', 'ProductCode', 'ServiceVisitFrequency']
                        }];
                    _this.lookUpRecord(data, 5).subscribe(function (e) {
                        if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                            if (_this.mode === 'Service') {
                                _this.fetchAPIDetails();
                            }
                        }
                        else {
                            e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                            _this.errorService.emitError(e);
                        }
                        _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                        _this.isContractDisabled = false;
                    }, function (error) {
                        error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                        _this.errorService.emitError(error);
                        _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                        _this.isContractDisabled = false;
                    });
                }
                else {
                    e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                    _this.errorService.emitError(e);
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    _this.isContractDisabled = false;
                }
            }, function (error) {
                error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                _this.errorService.emitError(error);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    ApiReverseMaintenanceComponent.prototype.enableForm = function () {
        this.isFormEnabled = true;
    };
    ApiReverseMaintenanceComponent.prototype.disableForm = function () {
        this.isFormEnabled = false;
        this.apiReverseFormGroup.reset();
        this.cbb.disableComponent(false);
    };
    ApiReverseMaintenanceComponent.prototype.toUpperCase = function (event) {
        var target = event.target.getAttribute('formControlName');
        var elementValue = event.target.value;
        this.apiReverseFormGroup.controls[target].setValue(elementValue.toUpperCase());
    };
    ApiReverseMaintenanceComponent.prototype.numberPadding = function (num, size) {
        var s = num + '';
        while (s.length < size)
            s = '0' + s;
        return s;
    };
    ApiReverseMaintenanceComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    ApiReverseMaintenanceComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    ApiReverseMaintenanceComponent.prototype.routeAwayUpdateSaveFlag = function () {
        var _this = this;
        this.apiReverseFormGroup.statusChanges.subscribe(function (value) {
            if (_this.apiReverseFormGroup.valid === true || _this.isFormValid === true) {
                _this.routeAwayGlobals.setSaveEnabledFlag(true);
            }
        });
    };
    ApiReverseMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAAPIReverse.html',
                    providers: [ErrorService, MessageService]
                },] },
    ];
    ApiReverseMaintenanceComponent.ctorParameters = [
        { type: HttpService, },
        { type: FormBuilder, },
        { type: ServiceConstants, },
        { type: ErrorService, },
        { type: MessageService, },
        { type: AuthService, },
        { type: AjaxObservableConstant, },
        { type: Router, },
        { type: PageDataService, },
        { type: Title, },
        { type: Store, },
        { type: NgZone, },
        { type: LocalStorageService, },
        { type: TranslateService, },
        { type: Http, },
        { type: LocaleTranslationService, },
        { type: ComponentInteractionService, },
        { type: Utils, },
        { type: RouteAwayGlobals, },
        { type: CBBService, },
    ];
    ApiReverseMaintenanceComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return ApiReverseMaintenanceComponent;
}());
