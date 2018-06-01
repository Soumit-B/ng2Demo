import { Utils } from './../../../shared/services/utility';
import { LookUp } from './../../../shared/services/lookup';
import { ErrorConstant } from './../../../shared/constants/error.constant';
import { ErrorService } from './../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { HttpService } from './../../../shared/services/http-service';
import { FormBuilder } from '@angular/forms';
import { Logger } from '@nsalaun/ng2-logger';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { Component, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
export var ApiDateMaintenanceComponent = (function () {
    function ApiDateMaintenanceComponent(serviceConstants, httpService, errorService, messageService, ajaxconstant, zone, LookUp, router, fb, logger, utils, localeTranslateService, routeAwayGlobals) {
        this.serviceConstants = serviceConstants;
        this.httpService = httpService;
        this.errorService = errorService;
        this.messageService = messageService;
        this.ajaxconstant = ajaxconstant;
        this.zone = zone;
        this.LookUp = LookUp;
        this.router = router;
        this.fb = fb;
        this.logger = logger;
        this.utils = utils;
        this.localeTranslateService = localeTranslateService;
        this.routeAwayGlobals = routeAwayGlobals;
        this.contractSearchComponent = ContractSearchComponent;
        this.autoOpen = false;
        this.showCloseButton = true;
        this.inputParams = {};
        this.ajaxSource = new BehaviorSubject(0);
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.isDateReadOnly = false;
        this.apiParams = {};
        this.searchParams = new URLSearchParams();
        this.postSearchParams = new URLSearchParams();
        this.isRequesting = false;
        this.contractDetails = {};
        this.promptTitle = 'Confirm Record?';
        this.promptContent = '';
        this.formData = {};
        this.setFocusNextAPI = false;
        this.disableSearch = false;
        this.headerParams = {
            method: 'contract-management/maintenance',
            operation: 'Application/iCABSAAPIDateMaintenance',
            module: 'api'
        };
    }
    ApiDateMaintenanceComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    ;
    ApiDateMaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.routeAwayGlobals.setEllipseOpenFlag(false);
        this.routeAwayGlobals.setDirtyFlag(true);
        this.localeTranslateService.setUpTranslation();
        this.businessCode = this.utils.getBusinessCode();
        this.countryCode = this.utils.getCountryCode();
        this.routerSubscription = this.router.events.subscribe(function (event) {
            _this.inputParams.parentMode = 'Search';
            _this.inputParams.currentContractType = 'C';
            _this.inputParams.ContractTypeCode = 'C';
            _this.autoOpen = true;
        });
        this.formDateMaintenance = this.fb.group({
            contractNumber: [''],
            contractName: [''],
            contractStatus: [''],
            accountNumber: [''],
            accountName: [''],
            address1: [''],
            address2: [''],
            address3: [''],
            address4: [''],
            address5: [''],
            postcode: [''],
            negBranchNumber: [''],
            branchName: [''],
            invoiceFrequencyCode: [''],
            invoiceFrequencyDesc: [''],
            annualValue: [''],
            commenceDate: [''],
            anniversaryDate: [''],
            statusCode: ['']
        });
        this.ajaxSource$ = this.ajaxSource.asObservable();
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
                    _this.messageModal.show(data, false);
                });
            }
        });
    };
    ApiDateMaintenanceComponent.prototype.updateView = function () {
        this.inputParams.parentMode = 'LookUp';
        this.inputParams.currentContractType = 'C';
    };
    ApiDateMaintenanceComponent.prototype.ngOnDestroy = function () {
        this.errorSubscription.unsubscribe();
        this.ajaxSubscription.unsubscribe();
        this.routeAwayGlobals.resetRouteAwayFlags();
    };
    ApiDateMaintenanceComponent.prototype.onBlur = function () {
        var _contractNumber = this.formDateMaintenance.controls['contractNumber'].value;
        var paddedContractNumber = this.numberPadding(_contractNumber, 8);
        this.fetchContractDetails(paddedContractNumber);
    };
    ApiDateMaintenanceComponent.prototype.fetchContractDetails = function (contractNumber) {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.searchParams.set(this.serviceConstants.BusinessCode, this.businessCode);
        this.searchParams.set(this.serviceConstants.CountryCode, this.countryCode);
        this.searchParams.set(this.serviceConstants.Action, '0');
        this.searchParams.set('ContractNumber', contractNumber);
        var _module = this.headerParams.module;
        var _method = this.headerParams.method;
        var _operation = this.headerParams.operation;
        var _search = this.searchParams;
        this.httpService.makeGetRequest(_method, _module, _operation, _search)
            .subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            data['ContractNumber'] = contractNumber;
            _this.contractDetails = data;
            _this.fetchOtherDetails(data);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
            _this.errorService.emitError(error);
            _this.formDateMaintenance.controls['contractNumber'].setValue('');
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ApiDateMaintenanceComponent.prototype.fetchOtherDetails = function (contractDetails) {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookupIP_details = [{
                'table': 'Account',
                'query': { 'AccountNumber': contractDetails['AccountNumber'], 'BusinessCode': this.businessCode },
                'fields': [
                    'AccountName',
                    'AccountAddressLine1',
                    'AccountAddressLine2',
                    'AccountAddressLine3',
                    'AccountAddressLine4',
                    'AccountAddressLine5',
                    'AccountPostcode']
            },
            {
                'table': 'SystemInvoiceFrequency',
                'query': { 'InvoiceFrequencyCode': contractDetails['InvoiceFrequencyCode'] },
                'fields': ['InvoiceFrequencyDesc']
            },
            {
                'table': 'Branch',
                'query': { 'BranchNumber': contractDetails['NegBranchNumber'] },
                'fields': ['BranchName']
            },
            {
                'table': 'PortfolioStatusLang',
                'query': { 'PortfolioStatusCode': contractDetails['PortfolioStatusCode'] },
                'fields': ['PortfolioStatusDesc']
            }];
        this.subLookupContract = this.LookUp.lookUpRecord(lookupIP_details).subscribe(function (e) {
            if (e && e.length > 0 && e[0].length > 0) {
                _this.populateDataFields(_this.contractDetails);
                _this.populateOtherDataFields(e);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
            _this.errorService.emitError(error);
            _this.formDateMaintenance.controls['contractNumber'].setValue('');
        });
    };
    ApiDateMaintenanceComponent.prototype.onDataReceived = function (data) {
        this.formDateMaintenance.controls['contractNumber'].setValue(data.ContractNumber);
        this.formDateMaintenance.controls['contractName'].setValue(data.ContractName);
        this.formDateMaintenance.controls['accountNumber'].setValue(data.AccountNumber);
        this.contractDetails = data;
        this.fetchContractDetails(data.ContractNumber);
        return;
    };
    ApiDateMaintenanceComponent.prototype.populateDataFields = function (data) {
        this.formDateMaintenance.controls['negBranchNumber'].setValue(data.NegBranchNumber);
        this.formDateMaintenance.controls['invoiceFrequencyCode'].setValue(data.InvoiceFrequencyCode);
        this.formDateMaintenance.controls['statusCode'].setValue(data.PortfolioStatusCode);
        this.formDateMaintenance.controls['annualValue'].setValue(data.ContractAnnualValue);
        this.formDateMaintenance.controls['commenceDate'].setValue(data.ContractCommenceDate);
        this.formDateMaintenance.controls['anniversaryDate'].setValue(data.InvoiceAnnivDate);
        this.dtNextAPIDate = data.NextAPIDate;
        if (window['moment'](data.NextAPIDate, 'DD/MM/YYYY', true).isValid()) {
            this.dtNextAPIDate = this.utils.convertDate(data.NextAPIDate);
        }
        else {
            this.dtNextAPIDate = this.utils.formatDate(data.NextAPIDate);
        }
        if (!this.dtNextAPIDate) {
            this.ServiceDateFrom = null;
        }
        else {
            this.ServiceDateFrom = new Date(this.dtNextAPIDate);
            if (!window['moment'](this.dtNextAPIDate, 'DD/MM/YYYY', true).isValid()) {
                this.dtNextAPIDate = this.utils.formatDate(this.dtNextAPIDate);
            }
        }
    };
    ApiDateMaintenanceComponent.prototype.populateOtherDataFields = function (data) {
        this.disableSearch = true;
        this.formDateMaintenance.controls['accountName'].setValue((data[0])[0].AccountName);
        this.formDateMaintenance.controls['address1'].setValue((data[0])[0].AccountAddressLine1);
        this.formDateMaintenance.controls['address2'].setValue((data[0])[0].AccountAddressLine2);
        this.formDateMaintenance.controls['address3'].setValue((data[0])[0].AccountAddressLine3);
        this.formDateMaintenance.controls['address4'].setValue((data[0])[0].AccountAddressLine4);
        this.formDateMaintenance.controls['address5'].setValue((data[0])[0].AccountAddressLine5);
        this.formDateMaintenance.controls['postcode'].setValue((data[0])[0].AccountPostcode);
        this.formDateMaintenance.controls['invoiceFrequencyDesc'].setValue((data[1])[0].InvoiceFrequencyDesc);
        this.formDateMaintenance.controls['branchName'].setValue((data[2])[0].BranchName);
        this.formDateMaintenance.controls['contractStatus'].setValue((data[3])[0].PortfolioStatusDesc);
    };
    ApiDateMaintenanceComponent.prototype.updateDate = function () {
        var ContractNumber = this.formDateMaintenance.controls['contractNumber'].value;
        if (ContractNumber) {
            this.isDateReadOnly = false;
        }
        else {
            var _error = {};
            _error['errorMessage'] = 'No record selected';
            this.errorService.emitError(_error);
        }
    };
    ApiDateMaintenanceComponent.prototype.resetDate = function () {
        this.isDateReadOnly = false;
        this.populateDataFields(this.contractDetails);
    };
    ApiDateMaintenanceComponent.prototype.updateDatePickerValue = function (value) {
        if (value && value.value) {
            this.dtNextAPIDate = value.value;
        }
        else {
            this.dtNextAPIDate = '';
        }
    };
    ;
    ApiDateMaintenanceComponent.prototype.serviceDateFromSelectedValue = function (value) {
        if (value && value.value)
            this.dtNextAPIDate = value.value;
    };
    ApiDateMaintenanceComponent.prototype.resetForm = function () {
        this.disableSearch = false;
        this.formDateMaintenance.controls['contractNumber'].setValue('');
        this.formDateMaintenance.controls['contractName'].setValue('');
        this.formDateMaintenance.controls['statusCode'].setValue('');
        this.formDateMaintenance.controls['contractStatus'].setValue('');
        this.formDateMaintenance.controls['accountNumber'].setValue('');
        this.formDateMaintenance.controls['accountName'].setValue('');
        this.formDateMaintenance.controls['address1'].setValue('');
        this.formDateMaintenance.controls['address2'].setValue('');
        this.formDateMaintenance.controls['address3'].setValue('');
        this.formDateMaintenance.controls['address4'].setValue('');
        this.formDateMaintenance.controls['address5'].setValue('');
        this.formDateMaintenance.controls['postcode'].setValue('');
        this.formDateMaintenance.controls['negBranchNumber'].setValue('');
        this.formDateMaintenance.controls['branchName'].setValue('');
        this.formDateMaintenance.controls['invoiceFrequencyCode'].setValue('');
        this.formDateMaintenance.controls['invoiceFrequencyDesc'].setValue('');
        this.formDateMaintenance.controls['annualValue'].setValue('');
        this.formDateMaintenance.controls['commenceDate'].setValue('');
        this.formDateMaintenance.controls['anniversaryDate'].setValue('');
        this.dtNextAPIDate = null;
        this.ServiceDateFrom = null;
    };
    ApiDateMaintenanceComponent.prototype.onSubmit = function (data, event) {
        this.routeAwayComponent.resetDirtyFlagAfterSaveUpdate();
        event.preventDefault();
        this.formData = data;
        var ContractNumber = this.formDateMaintenance.controls['contractNumber'].value;
        if (ContractNumber) {
            this.promptModal.show();
        }
        else {
            var _error = {};
            _error['errorMessage'] = 'No record selected';
            this.errorService.emitError(_error);
        }
    };
    ApiDateMaintenanceComponent.prototype.promptSave = function (event) {
        var _this = this;
        var _formData = {};
        _formData['ContractNumber'] = this.formData['contractNumber'];
        _formData['ContractName'] = this.formData['contractName'];
        _formData['PortfolioStatusCode'] = this.formData['statusCode'];
        _formData['AccountNumber'] = this.formData['accountNumber'];
        _formData['NegBranchNumber'] = this.formData['negBranchNumber'];
        _formData['ContractAnnualValue'] = this.formData['annualValue'];
        _formData['InvoiceAnnivDate'] = this.formData['anniversaryDate'];
        _formData['InvoiceFrequencyCode'] = this.formData['invoiceFrequencyCode'];
        _formData['ContractCommenceDate'] = this.formData['commenceDate'];
        _formData['NextAPIDate'] = this.dtNextAPIDate;
        this.postSearchParams.set(this.serviceConstants.Action, '2');
        this.postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode);
        this.postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode);
        this.postSearchParams.set('Function', 'CheckContractType');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.postSearchParams, _formData)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                    _this.errorService.emitError(e['oResponse']);
                }
                else if (e['errorMessage']) {
                    _this.errorService.emitError(e);
                }
                else {
                    e['msg'] = 'Data saved successfully';
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ApiDateMaintenanceComponent.prototype.numberPadding = function (num, size) {
        var s = num + '';
        while (s.length < size)
            s = '0' + s;
        return s;
    };
    ApiDateMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAAPIDateMaintenance.html',
                    providers: [ErrorService, MessageService]
                },] },
    ];
    ApiDateMaintenanceComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: HttpService, },
        { type: ErrorService, },
        { type: MessageService, },
        { type: AjaxObservableConstant, },
        { type: NgZone, },
        { type: LookUp, },
        { type: Router, },
        { type: FormBuilder, },
        { type: Logger, },
        { type: Utils, },
        { type: LocaleTranslationService, },
        { type: RouteAwayGlobals, },
    ];
    ApiDateMaintenanceComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return ApiDateMaintenanceComponent;
}());
