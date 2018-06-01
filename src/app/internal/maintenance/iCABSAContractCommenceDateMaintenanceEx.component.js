import { Component, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { HttpService } from './../../../shared/services/http-service';
import { URLSearchParams } from '@angular/http';
import { AuthService } from '../../../shared/services/auth.service';
import { Title } from '@angular/platform-browser';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ErrorService } from '../../../shared/services/error.service';
import { Utils } from '../../../shared/services/utility';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { ServiceConstants } from './../../../shared/constants/service.constants';
export var ContractCommenceDateMaintenanceComponentExComponent = (function () {
    function ContractCommenceDateMaintenanceComponentExComponent(zone, fb, store, serviceConstants, httpService, authService, errorService, translate, localeTranslateService, titleService, router, route, utils, location) {
        var _this = this;
        this.zone = zone;
        this.fb = fb;
        this.store = store;
        this.serviceConstants = serviceConstants;
        this.httpService = httpService;
        this.authService = authService;
        this.errorService = errorService;
        this.translate = translate;
        this.localeTranslateService = localeTranslateService;
        this.titleService = titleService;
        this.router = router;
        this.route = route;
        this.utils = utils;
        this.location = location;
        this.inputParams = { 'parentMode': 'Contract-Search', 'ContractTypeCode': 'C', 'businessCode': 'D' };
        this.contractSearchComponent = ContractSearchComponent;
        this.fieldVisibility = {};
        this.fieldRequired = {
            contractCommenceDate: true,
            annivDate: true
        };
        this.defaultCode = {
            country: 'ZA',
            business: 'D'
        };
        this.dateObjectsEnabled = {
            contractCommenceDate: true,
            annivDate: true
        };
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
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
        this.queryParamsContractCommenceDate = {
            action: '0',
            operation: 'Application/iCABSAContractCommenceDateMaintenance',
            module: 'contract',
            method: 'contract-management/maintenance',
            contentType: 'application/x-www-form-urlencoded'
        };
        this.storeData = {};
        this.autoOpenSearch = false;
        this.showCloseButton = true;
        this.showHeader = true;
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.isContractEllipsisDisabled = true;
        this.serviceVisitRowID = '';
        this.queryLookUp = new URLSearchParams();
        this.queryContract = new URLSearchParams();
        this.contractCommenceDate = new Date();
        this.annivDate = new Date();
        this.parentRoute = '';
        this.contractSearchParams = {
            'parentMode': 'ContractSearch',
            'currentContractType': 'C',
            'currentContractTypeURLParameter': '<contract>',
            'showAddNew': true,
            'contractNumber': ''
        };
        this.promptTitle = 'Confirm Record?';
        this.promptContent = '';
        this.isRequesting = false;
        this.defaultCode = {
            country: this.utils.getCountryCode(),
            business: this.utils.getBusinessCode()
        };
        this.commenceDateFormGroup = this.fb.group({
            ContractNumber: [{ value: '', disabled: true }, Validators.required],
            ContractName: [{ value: '', disabled: true }],
            Status: [{ value: '', disabled: true }],
            AccountNumber: [{ value: '', disabled: true }],
            AccountName: [{ value: '', disabled: true }],
            ContractAddressLine1: [{ value: '', disabled: true }],
            ContractAddressLine2: [{ value: '', disabled: true }],
            ContractAddressLine3: [{ value: '', disabled: true }],
            ContractAddressLine4: [{ value: '', disabled: true }],
            ContractAddressLine5: [{ value: '', disabled: true }],
            ContractPostcode: [{ value: '', disabled: true }],
            ContractAnnualValue: [{ value: '', disabled: true }]
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
                case 'Release':
                    _this.serviceVisitRowID = params['ServiceVisitRowID'];
                    break;
                default:
                    break;
            }
            switch (params['contractType']) {
                case 'C':
                    _this.contractSearchParams.currentContractType = 'C';
                    _this.isContractEllipsisDisabled = true;
                    break;
                case 'J':
                    _this.contractSearchParams.currentContractType = 'J';
                    _this.isContractEllipsisDisabled = true;
                    break;
                case 'P':
                    _this.contractSearchParams.currentContractType = 'P';
                    _this.isContractEllipsisDisabled = true;
                    break;
                default:
                    break;
            }
            _this.parentRoute = params['parentRoute'];
            if (params['contractNumber'] || params['ContractNumber']) {
                _this.contractSearchParams.contractNumber = params['contractNumber'];
            }
        });
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            if (data && data['data'] && data['data'].ContractNumber) {
                _this.storeData = data;
                _this.commenceDateFormGroup.controls['ContractNumber'].setValue(_this.storeData['data'].ContractNumber);
                _this.commenceDateFormGroup.controls['ContractName'].setValue(_this.storeData['data'].ContractName);
                _this.commenceDateFormGroup.controls['Status'].setValue(_this.storeData['data'].Status);
                _this.commenceDateFormGroup.controls['AccountNumber'].setValue(_this.storeData['data'].AccountNumber);
                _this.commenceDateFormGroup.controls['ContractAddressLine1'].setValue(_this.storeData['data'].ContractAddressLine1);
                _this.commenceDateFormGroup.controls['ContractAddressLine2'].setValue(_this.storeData['data'].ContractAddressLine2);
                _this.commenceDateFormGroup.controls['ContractAddressLine3'].setValue(_this.storeData['data'].ContractAddressLine3);
                _this.commenceDateFormGroup.controls['ContractAddressLine4'].setValue(_this.storeData['data'].ContractAddressLine4);
                _this.commenceDateFormGroup.controls['ContractAddressLine5'].setValue(_this.storeData['data'].ContractAddressLine5);
                _this.commenceDateFormGroup.controls['ContractPostcode'].setValue(_this.storeData['data'].ContractPostcode);
                _this.commenceDateFormGroup.controls['ContractAnnualValue'].setValue(_this.storeData['data'].ContractAnnualValue);
                if (_this.storeData['data'].ContractCommenceDate) {
                    if (window['moment'](_this.storeData['data'].ContractCommenceDate, 'DD/MM/YYYY', true).isValid()) {
                        _this.commenceDateDisplay = _this.utils.convertDateString(_this.storeData['data'].ContractCommenceDate);
                    }
                    else {
                        _this.commenceDateDisplay = _this.utils.formatDate(new Date(_this.storeData['data'].ContractCommenceDate));
                    }
                }
                else {
                    _this.commenceDateDisplay = null;
                }
                if (!_this.commenceDateDisplay) {
                    _this.contractCommenceDate = null;
                }
                else {
                    _this.contractCommenceDate = new Date(_this.commenceDateDisplay);
                    if (!window['moment'](_this.commenceDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                        _this.commenceDateDisplay = _this.utils.formatDate(new Date(_this.commenceDateDisplay));
                    }
                }
                if (_this.storeData['data'].InvoiceAnnivDate) {
                    if (window['moment'](_this.storeData['data'].InvoiceAnnivDate, 'DD/MM/YYYY', true).isValid()) {
                        _this.annivDateDisplay = _this.utils.convertDateString(_this.storeData['data'].InvoiceAnnivDate);
                    }
                    else {
                        _this.annivDateDisplay = _this.utils.formatDate(new Date(_this.storeData['data'].InvoiceAnnivDate));
                    }
                }
                else {
                    _this.annivDateDisplay = null;
                }
                if (!_this.annivDateDisplay) {
                    _this.annivDate = null;
                }
                else {
                    _this.annivDate = new Date(_this.annivDateDisplay);
                    if (!window['moment'](_this.annivDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                        _this.annivDateDisplay = _this.utils.formatDate(new Date(_this.annivDateDisplay));
                    }
                }
                _this.fetchAccountData();
                _this.getStatus(_this.storeData['data'].ContractNumber);
            }
            else {
                _this.getContractData();
                _this.getStatus(_this.parentQueryParams['contractNumber'] || _this.parentQueryParams['ContractNumber']);
            }
            for (var i in _this.commenceDateFormGroup.controls) {
                if (_this.commenceDateFormGroup.controls.hasOwnProperty(i))
                    _this.commenceDateFormGroup.controls[i].markAsTouched();
            }
            _this.commenceDateFormGroup.updateValueAndValidity();
        });
    }
    ContractCommenceDateMaintenanceComponentExComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.localeTranslateService.setUpTranslation();
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
            }
        });
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    if (data.errorMessage || data.ErrorMessage) {
                        data.errorMessage = data.errorMessage || data.ErrorMessage;
                        _this.errorModal.show(data, true);
                    }
                });
            }
        });
        this.promptTitle = MessageConstant.Message.ConfirmRecord;
    };
    ContractCommenceDateMaintenanceComponentExComponent.prototype.ngOnDestroy = function () {
        this.storeSubscription.unsubscribe();
        if (this.querySubscription)
            this.querySubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    ContractCommenceDateMaintenanceComponentExComponent.prototype.getContractData = function () {
        var _this = this;
        this.fetchContractData('', { action: '0', ContractNumber: this.parentQueryParams['contractNumber'] || this.parentQueryParams['ContractNumber'], ContractTypeCode: this.parentQueryParams['contractType'] || this.parentQueryParams['ContractType'] || this.parentQueryParams['CurrentContractType'] }).subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                _this.commenceDateFormGroup.controls['ContractNumber'].setValue(e.ContractNumber);
                _this.commenceDateFormGroup.controls['ContractName'].setValue(e.ContractName);
                _this.commenceDateFormGroup.controls['Status'].setValue(e.Status);
                _this.commenceDateFormGroup.controls['AccountNumber'].setValue(e.AccountNumber);
                _this.commenceDateFormGroup.controls['ContractAddressLine1'].setValue(e.ContractAddressLine1);
                _this.commenceDateFormGroup.controls['ContractAddressLine2'].setValue(e.ContractAddressLine2);
                _this.commenceDateFormGroup.controls['ContractAddressLine3'].setValue(e.ContractAddressLine3);
                _this.commenceDateFormGroup.controls['ContractAddressLine4'].setValue(e.ContractAddressLine4);
                _this.commenceDateFormGroup.controls['ContractAddressLine5'].setValue(e.ContractAddressLine5);
                _this.commenceDateFormGroup.controls['ContractPostcode'].setValue(e.ContractPostcode);
                _this.commenceDateFormGroup.controls['ContractAnnualValue'].setValue(e.ContractAnnualValue);
                _this.storeData = {
                    data: e
                };
                if (_this.storeData['data'].ContractCommenceDate) {
                    if (window['moment'](_this.storeData['data'].ContractCommenceDate, 'DD/MM/YYYY', true).isValid()) {
                        _this.commenceDateDisplay = _this.utils.convertDateString(_this.storeData['data'].ContractCommenceDate);
                    }
                    else {
                        _this.commenceDateDisplay = _this.utils.formatDate(new Date(_this.storeData['data'].ContractCommenceDate));
                    }
                }
                else {
                    _this.commenceDateDisplay = null;
                }
                if (!_this.commenceDateDisplay) {
                    _this.contractCommenceDate = null;
                }
                else {
                    _this.contractCommenceDate = new Date(_this.commenceDateDisplay);
                    if (!window['moment'](_this.commenceDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                        _this.commenceDateDisplay = _this.utils.formatDate(new Date(_this.commenceDateDisplay));
                    }
                }
                if (_this.storeData['data'].InvoiceAnnivDate) {
                    if (window['moment'](_this.storeData['data'].InvoiceAnnivDate, 'DD/MM/YYYY', true).isValid()) {
                        _this.annivDateDisplay = _this.utils.convertDateString(_this.storeData['data'].InvoiceAnnivDate);
                    }
                    else {
                        _this.annivDateDisplay = _this.utils.formatDate(new Date(_this.storeData['data'].InvoiceAnnivDate));
                    }
                }
                else {
                    _this.annivDateDisplay = null;
                }
                if (!_this.annivDateDisplay) {
                    _this.annivDate = null;
                }
                else {
                    _this.annivDate = new Date(_this.annivDateDisplay);
                    if (!window['moment'](_this.annivDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                        _this.annivDateDisplay = _this.utils.formatDate(new Date(_this.annivDateDisplay));
                    }
                }
                _this.fetchAccountData();
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ContractCommenceDateMaintenanceComponentExComponent.prototype.getStatus = function (contractNumber) {
        var _this = this;
        this.fetchContractCommenceData('GetStatus', { action: '6', ContractNumber: contractNumber }).subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                _this.commenceDateFormGroup.controls['Status'].setValue(e.Status);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ContractCommenceDateMaintenanceComponentExComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('Contract Commence Date Maintenance', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.titleService.setTitle(res);
                }
            });
        });
    };
    ContractCommenceDateMaintenanceComponentExComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    ContractCommenceDateMaintenanceComponentExComponent.prototype.modalHidden = function () {
        this.fetchTranslationContent();
    };
    ContractCommenceDateMaintenanceComponentExComponent.prototype.onContractDataReceived = function (data) {
    };
    ContractCommenceDateMaintenanceComponentExComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    };
    ContractCommenceDateMaintenanceComponentExComponent.prototype.fetchOtherData = function () {
        var _this = this;
        var data = [{
                'table': 'Account',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'AccountNumber': this.storeData['data'].AccountNumber },
                'fields': ['AccountNumber', 'AccountName']
            },
            {
                'table': 'Product',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ProductCode': this.commenceDateFormGroup.controls['ProductCode'].value },
                'fields': ['BusinessCode', 'ProductDesc']
            },
            {
                'table': 'Premise',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ContractNumber': this.commenceDateFormGroup.controls['ContractNumber'].value, 'PremiseNumber': this.commenceDateFormGroup.controls['PremiseNumber'].value },
                'fields': ['BusinessCode', 'PremiseName']
            }];
        this.lookUpRecord(data, 5).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    if (e['results'][0][0].length > 0) {
                        _this.commenceDateFormGroup.controls['AccountName'].setValue(e['results'][0][0].AccountName);
                    }
                    if (e['results'][0][1].length > 0) {
                        _this.commenceDateFormGroup.controls['ProductDesc'].setValue(e['results'][0][0].ProductDesc);
                    }
                    if (e['results'][0][2].length > 0) {
                        _this.commenceDateFormGroup.controls['PremiseName'].setValue(e['results'][0][0].PremiseName);
                    }
                }
            }
        }, function (error) {
        });
    };
    ContractCommenceDateMaintenanceComponentExComponent.prototype.fetchContractData = function (functionName, params) {
        this.queryContract = new URLSearchParams();
        this.queryContract.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryContract.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
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
    ContractCommenceDateMaintenanceComponentExComponent.prototype.fetchContractCommenceData = function (functionName, params) {
        this.queryContract = new URLSearchParams();
        this.queryContract.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryContract.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (functionName !== '') {
            this.queryContract.set(this.serviceConstants.Action, '6');
            this.queryContract.set('Function', functionName);
        }
        for (var key in params) {
            if (key) {
                this.queryContract.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.queryParamsContractCommenceDate.method, this.queryParamsContractCommenceDate.module, this.queryParamsContractCommenceDate.operation, this.queryContract);
    };
    ContractCommenceDateMaintenanceComponentExComponent.prototype.fetchAccountData = function () {
        var _this = this;
        if (this.commenceDateFormGroup.controls['AccountNumber'].value && this.commenceDateFormGroup.controls['AccountNumber'].value !== '') {
            var data = [{
                    'table': 'Account',
                    'query': { 'AccountNumber': this.commenceDateFormGroup.controls['AccountNumber'].value },
                    'fields': ['AccountNumber', 'AccountName']
                }];
            this.lookUpRecord(data, 5).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        _this.commenceDateFormGroup.controls['AccountName'].setValue(e['results'][0][0]['AccountName']);
                    }
                    else {
                        _this.commenceDateFormGroup.controls['AccountName'].setValue('');
                    }
                }
            }, function (error) {
            });
        }
        else {
            this.commenceDateFormGroup.controls['AccountName'].setValue('');
        }
    };
    ContractCommenceDateMaintenanceComponentExComponent.prototype.postContractCommenceData = function (functionName, params) {
        var formdata = {};
        this.queryContract = new URLSearchParams();
        this.queryContract.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryContract.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        for (var key in params) {
            if (key) {
                this.queryContract.set(key, params[key]);
            }
        }
        formdata['ContractNumber'] = this.commenceDateFormGroup.controls['ContractNumber'].value;
        formdata['ContractName'] = this.commenceDateFormGroup.controls['ContractName'].value;
        formdata['AccountNumber'] = this.commenceDateFormGroup.controls['AccountNumber'].value;
        formdata['ContractAnnualValue'] = this.commenceDateFormGroup.controls['ContractAnnualValue'].value;
        formdata['ContractCommenceDate'] = this.commenceDateDisplay;
        formdata['InvoiceAnnivDate'] = this.annivDateDisplay;
        formdata['ServiceVisitRowID'] = this.serviceVisitRowID;
        formdata['ContractROWID'] = this.storeData['data'] && this.storeData['data'].Contract ? this.storeData['data'].Contract : '';
        return this.httpService.makePostRequest(this.queryParamsContractCommenceDate.method, this.queryParamsContractCommenceDate.module, this.queryParamsContractCommenceDate.operation, this.queryContract, formdata);
    };
    ContractCommenceDateMaintenanceComponentExComponent.prototype.commenceDateSelectedValue = function (value) {
        var _this = this;
        console.log(value);
        if (value && value.value && typeof value.value === 'string') {
            this.commenceDateDisplay = value.value;
            if (this.storeData['data'] && this.storeData['data'].ContractCommenceDate && this.storeData['data'].ContractCommenceDate !== this.commenceDateDisplay) {
                this.fetchContractCommenceData('GetAnniversaryDate,WarnCommenceDate', {
                    action: '6',
                    ContractNumber: this.commenceDateFormGroup.controls['ContractNumber'].value,
                    ContractCommenceDate: this.commenceDateDisplay,
                    ServiceVisitRowID: this.serviceVisitRowID ? this.serviceVisitRowID : ''
                }).subscribe(function (e) {
                    if (e.status === 'failure') {
                        if (e['errorNumber'] !== 2072) {
                            _this.annivDateDisplay = e.InvoiceAnnivDate || _this.commenceDateDisplay;
                            _this.setAnnivDate(_this.annivDateDisplay);
                        }
                        _this.errorService.emitError(e.oResponse);
                        return;
                    }
                    else {
                        if (e.errorMessage || e.ErrorMessage !== '') {
                            if (e['errorNumber'] !== 2072) {
                                _this.annivDateDisplay = e.InvoiceAnnivDate || _this.commenceDateDisplay;
                                _this.setAnnivDate(_this.annivDateDisplay);
                            }
                            _this.errorService.emitError(e);
                            return;
                        }
                        _this.setAnnivDate(_this.commenceDateDisplay);
                    }
                }, function (error) {
                    _this.errorService.emitError(error);
                });
            }
        }
    };
    ContractCommenceDateMaintenanceComponentExComponent.prototype.setAnnivDate = function (commenceDateDisplay) {
        if (window['moment'](commenceDateDisplay, 'DD/MM/YYYY', true).isValid()) {
            this.annivDateDisplay = this.utils.convertDateString(commenceDateDisplay);
        }
        else {
            this.annivDateDisplay = this.utils.formatDate(new Date(commenceDateDisplay));
        }
        if (!this.annivDateDisplay) {
            this.annivDate = null;
        }
        else {
            this.annivDate = new Date(this.annivDateDisplay);
            if (!window['moment'](this.annivDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                this.annivDateDisplay = this.utils.formatDate(new Date(this.annivDateDisplay));
            }
        }
    };
    ContractCommenceDateMaintenanceComponentExComponent.prototype.annivDateSelectedValue = function (value) {
        console.log(value);
        if (value && value.value) {
            this.annivDateDisplay = value.value;
        }
    };
    ContractCommenceDateMaintenanceComponentExComponent.prototype.onSubmit = function (data, valid, event) {
        event.preventDefault();
        this.promptModal.show();
    };
    ContractCommenceDateMaintenanceComponentExComponent.prototype.promptSave = function (event) {
        var _this = this;
        this.postContractCommenceData('GetStatus', { action: '2' }).subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e.errorMessage) {
                    _this.errorService.emitError(e);
                }
                else {
                    _this.storeData['data'].ContractCommenceDate = _this.commenceDateDisplay;
                    _this.storeData['data'].InvoiceAnnivDate = _this.annivDateDisplay;
                    _this.location.back();
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ContractCommenceDateMaintenanceComponentExComponent.prototype.onCancelClick = function (event) {
        if (this.parentQueryParams && this.parentQueryParams['parentRoute'] !== '') {
            this.location.back();
        }
    };
    ContractCommenceDateMaintenanceComponentExComponent.prototype.onContractNumberBlur = function (event) {
        if (this.commenceDateFormGroup.controls['ContractNumber'].value !== '') {
            var paddedValue = this.utils.numberPadding(event.target.value, 8);
            this.commenceDateFormGroup.controls['ContractNumber'].setValue(paddedValue);
        }
    };
    ContractCommenceDateMaintenanceComponentExComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-contract-commence-date-maintenance-ex',
                    templateUrl: 'iCABSAContractCommenceDateMaintenanceEx.html',
                    providers: [ErrorService]
                },] },
    ];
    ContractCommenceDateMaintenanceComponentExComponent.ctorParameters = [
        { type: NgZone, },
        { type: FormBuilder, },
        { type: Store, },
        { type: ServiceConstants, },
        { type: HttpService, },
        { type: AuthService, },
        { type: ErrorService, },
        { type: TranslateService, },
        { type: LocaleTranslationService, },
        { type: Title, },
        { type: Router, },
        { type: ActivatedRoute, },
        { type: Utils, },
        { type: Location, },
    ];
    ContractCommenceDateMaintenanceComponentExComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'commencedate': [{ type: ViewChild, args: ['commencedate',] },],
    };
    return ContractCommenceDateMaintenanceComponentExComponent;
}());
