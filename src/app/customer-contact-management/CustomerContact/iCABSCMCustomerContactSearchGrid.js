import { Component, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { HttpService } from '../../../shared/services/http-service';
import { ErrorService } from '../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { SysCharConstants } from '../../../shared/constants/syscharservice.constant';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { Utils } from '../../../shared/services/utility';
import { EmployeeSearchComponent } from '../../internal/search/iCABSBEmployeeSearch';
export var ContactSearchGridComponent = (function () {
    function ContactSearchGridComponent(fb, router, httpService, serviceConstants, zone, global, ajaxconstant, errorService, messageService, titleService, translate, localeTranslateService, componentInteractionService, store, route, SysCharConstants, utils) {
        var _this = this;
        this.fb = fb;
        this.router = router;
        this.httpService = httpService;
        this.serviceConstants = serviceConstants;
        this.zone = zone;
        this.global = global;
        this.ajaxconstant = ajaxconstant;
        this.errorService = errorService;
        this.messageService = messageService;
        this.titleService = titleService;
        this.translate = translate;
        this.localeTranslateService = localeTranslateService;
        this.componentInteractionService = componentInteractionService;
        this.store = store;
        this.route = route;
        this.SysCharConstants = SysCharConstants;
        this.utils = utils;
        this.url = process.env.INVOICE_HISTORY;
        this.maxColumn = 11;
        this.infoDataColumnReference = -1;
        this.currentPage = 1;
        this.inputParams = {
            'parentMode': 'Contract',
            'pageTitle': 'Customer Contact Search',
            'showBusinessCode': false,
            'showCountryCode': false
        };
        this.employeeSearchParams = {
            'parentMode': 'MyFilter',
            'showBusinessCode': false,
            'showCountryCode': false
        };
        this.isRequesting = false;
        this.customerContactTypeList = [{
                code: 'all',
                value: 'All'
            }
        ];
        this.optionsList = [];
        this.filterList = [];
        this.filterPassedList = [];
        this.filterLevelList = [];
        this.filterValueList = [];
        this.options = 'Options';
        this.toDate = new Date();
        this.fromDate = new Date(new Date().setDate(new Date().getDate() - 14));
        this.showEmployeeCode = false;
        this.showCloseButton = true;
        this.showHeader = true;
        this.showMessageHeader = true;
        this.showErrorHeader = true;
        this.showOSCallOuts = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.query = new URLSearchParams();
        this.queryLookUp = new URLSearchParams();
        this.querySysChar = new URLSearchParams();
        this.queryParams = {
            action: '0',
            operation: 'ContactManagement/iCABSCMCustomerContactSearchGrid',
            module: 'tickets',
            method: 'ccm/maintenance',
            contentType: 'application/x-www-form-urlencoded'
        };
        this.inputParamsEmployeeSearch = { 'parentMode': 'MyFilter', 'countryCode': '', 'businessCode': '', 'negativeBranchNumber': '' };
        this.ajaxSource = new BehaviorSubject(0);
        this.viewingByTopLevel = false;
        this.myContactType = '';
        this.backLinkText = '';
        this.backLinkUrl = '';
        this.serviceCover = {
            ServiceCoverNumber: '',
            ServiceCoverRowID: '',
            ServiceTypeCode: '',
            ServiceTypeDesc: ''
        };
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            _this.contractData = data['data'];
            _this.storeData = data;
        });
    }
    ContactSearchGridComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.filterList = [
            {
                code: 'all',
                value: 'All'
            },
            {
                code: 'open',
                value: 'Open'
            },
            {
                code: 'closed',
                value: 'Closed'
            }
        ];
        this.filterPassedList = [
            {
                code: 'all',
                value: 'All'
            },
            {
                code: 'passed',
                value: 'Passed'
            },
            {
                code: 'notpassed',
                value: 'Not Passed'
            }
        ];
        this.filterLevelList = [
            {
                code: 'all',
                value: 'All'
            },
            {
                code: 'currentowner',
                value: 'Current Owner is'
            },
            {
                code: 'currentactioner',
                value: 'Current Actioner is'
            },
            {
                code: 'anyaction',
                value: 'Any Action by'
            },
            {
                code: 'createdby',
                value: 'Created by'
            }
        ];
        this.filterValueList = [
            {
                code: 'all',
                value: 'All'
            },
            {
                code: 'me',
                value: 'Me'
            },
            {
                code: 'myemployees',
                value: 'My Employees'
            },
            {
                code: 'thisbranch',
                value: 'This Branch'
            },
            {
                code: 'thisemployee',
                value: 'This Employee'
            }
        ];
        this.optionsList = [
            {
                code: '',
                value: 'Options'
            },
            {
                code: 'New Contact',
                value: 'New Contact'
            },
            {
                code: 'Contact History',
                value: 'Event History'
            }
        ];
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    if (data['errorMessage']) {
                        _this.errorModal.show(data, true);
                    }
                });
            }
        });
        this.messageService.emitMessage(0);
        this.messageSubscription = this.messageService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    _this.messageModal.show({ msg: data.msg, title: data.title }, false);
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
        this.querySubscription = this.route.queryParams.subscribe(function (params) {
            _this.pageQueryParams = params;
            if (params['parentMode'])
                _this.inputParams.parentMode = params['parentMode'];
            if (!(_this.contractData && !(Object.keys(_this.contractData).length === 0 && _this.contractData.constructor === Object))) {
                _this.contractData = params;
                _this.storeData['code'] = {
                    country: _this.utils.getCountryCode(),
                    business: _this.utils.getBusinessCode()
                };
            }
        });
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
            }
        });
        this.localeTranslateService.setUpTranslation();
        this.contactSearchFormGroup = this.fb.group({
            ReferenceNumber: [{ value: '', disabled: false }],
            CustomerContactType: [{ value: 'all', disabled: false }],
            EmployeeCode: [{ value: '', disabled: false }, Validators.required],
            AccountNumber: [{ value: '', disabled: false }],
            AccountName: [{ value: '', disabled: true }],
            ContractNumber: [{ value: '', disabled: false }],
            ContractName: [{ value: '', disabled: true }],
            PremiseNumber: [{ value: '', disabled: false }],
            PremiseName: [{ value: '', disabled: true }],
            ProductCode: [{ value: '', disabled: false }],
            ProductDesc: [{ value: '', disabled: true }],
            ContactName: [{ value: '', disabled: false }],
            ZipCode: [{ value: '', disabled: false }],
            ProspectNumber: [{ value: '', disabled: false }],
            OSCallOuts: [{ value: 'all', disabled: false }],
            Filter: [{ value: 'open', disabled: false }],
            FilterPassed: [{ value: 'all', disabled: false }],
            FilterLevel: [{ value: 'currentowner', disabled: false }],
            FilterValue: [{ value: 'thisbranch', disabled: false }],
            Options: [{ value: '', disabled: false }]
        });
        this.fetchSysChar(this.sysCharParameters()).subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError({
                    errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
                });
                return false;
            }
            if (e.records && e.records.length > 0) {
                _this.viewingByTopLevel = e.records[0].Required;
                switch (_this.inputParams.parentMode) {
                    case 'Contract':
                    case 'Premise':
                    case 'Account':
                        if (!_this.viewingByTopLevel) {
                            _this.contactSearchFormGroup.controls['ContractNumber'].setValue(_this.contractData.ContractNumber);
                            _this.contactSearchFormGroup.controls['ContractName'].setValue(_this.contractData.ContractName);
                            _this.contactSearchFormGroup.controls['PremiseNumber'].setValue(_this.contractData.PremiseNumber);
                            _this.contactSearchFormGroup.controls['PremiseName'].setValue(_this.contractData.PremiseName);
                            _this.contactSearchFormGroup.controls['AccountNumber'].setValue(_this.contractData.AccountNumber);
                            _this.contactSearchFormGroup.controls['AccountName'].setValue(_this.contractData.AccountContactName);
                            _this.contactSearchFormGroup.controls['ProductCode'].setValue(_this.contractData.ProductCode);
                            _this.contactSearchFormGroup.controls['ProductDesc'].setValue(_this.contractData.ProductDesc);
                            _this.serviceCover.ServiceCoverNumber = _this.contractData.ServiceCoverNumber ? _this.contractData.ServiceCoverNumber : '';
                            _this.serviceCover.ServiceCoverRowID = _this.contractData.ServiceCoverRowID ? _this.contractData.ServiceCoverRowID : '';
                        }
                        else {
                            _this.contactSearchFormGroup.controls['AccountNumber'].setValue(_this.contractData.AccountNumber);
                            _this.contactSearchFormGroup.controls['AccountName'].setValue(_this.contractData.AccountContactName);
                        }
                        break;
                    case 'Service Cover':
                        if (!_this.viewingByTopLevel) {
                            _this.contactSearchFormGroup.controls['ContractNumber'].setValue(_this.contractData.ContractNumber);
                            _this.contactSearchFormGroup.controls['ContractName'].setValue(_this.contractData.ContractName);
                            _this.contactSearchFormGroup.controls['PremiseNumber'].setValue(_this.contractData.PremiseNumber);
                            _this.contactSearchFormGroup.controls['PremiseName'].setValue(_this.contractData.PremiseName);
                            _this.contactSearchFormGroup.controls['AccountNumber'].setValue(_this.contractData.AccountNumber);
                            _this.contactSearchFormGroup.controls['AccountName'].setValue(_this.contractData.AccountContactName);
                            _this.contactSearchFormGroup.controls['ProductCode'].setValue(_this.contractData.ProductCode);
                            _this.contactSearchFormGroup.controls['ProductDesc'].setValue(_this.contractData.ProductDesc);
                            _this.serviceCover.ServiceCoverNumber = _this.contractData.ServiceCoverNumber;
                            _this.serviceCover.ServiceCoverRowID = _this.contractData.ServiceCoverRowID;
                            if (_this.serviceCover.ServiceCoverRowID !== '') {
                                _this.getServiceCoverNumberFromRowID();
                            }
                            else {
                                _this.getServiceCoverNumberFromRecord();
                            }
                        }
                        else {
                            _this.contactSearchFormGroup.controls['AccountNumber'].setValue(_this.contractData.AccountNumber);
                            _this.contactSearchFormGroup.controls['AccountName'].setValue(_this.contractData.AccountContactName);
                        }
                        break;
                    case 'Dashboard':
                        if (_this.pageQueryParams['FromDate']) {
                            if (window['moment'](_this.pageQueryParams['FromDate'], 'DD/MM/YYYY', true).isValid()) {
                                _this.fromDateDisplay = _this.utils.convertDate(_this.pageQueryParams['FromDate']);
                            }
                            else {
                                _this.fromDateDisplay = _this.pageQueryParams['FromDate'];
                            }
                        }
                        else {
                            _this.fromDateDisplay = '';
                        }
                        if (_this.fromDateDisplay) {
                            _this.fromDate = new Date(_this.fromDateDisplay);
                            if (!window['moment'](_this.fromDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                                _this.fromDateDisplay = _this.utils.formatDate(new Date(_this.fromDateDisplay));
                            }
                        }
                        if (_this.pageQueryParams['ToDate']) {
                            if (window['moment'](_this.pageQueryParams['ToDate'], 'DD/MM/YYYY', true).isValid()) {
                                _this.toDateDisplay = _this.utils.convertDate(_this.pageQueryParams['ToDate']);
                            }
                            else {
                                _this.toDateDisplay = _this.pageQueryParams['ToDate'];
                            }
                        }
                        else {
                            _this.toDateDisplay = '';
                        }
                        if (_this.toDateDisplay) {
                            _this.toDate = new Date(_this.toDateDisplay);
                            if (!window['moment'](_this.toDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                                _this.toDateDisplay = _this.utils.formatDate(new Date(_this.toDateDisplay));
                            }
                        }
                        break;
                    default:
                        break;
                }
                _this.fetchContractTypeDetails();
                _this.onAccountBlur({});
                _this.loadSearchDefaults();
            }
        });
        this.accountComponent = AccountSearchComponent;
        this.productComponent = AccountSearchComponent;
        this.premiseComponent = AccountSearchComponent;
        this.contractComponent = ContractSearchComponent;
        this.employeeComponent = EmployeeSearchComponent;
        this.titleService.setTitle(this.inputParams.pageTitle);
        this.itemsPerPage = this.global.AppConstants().tableConfig.itemsPerPage;
        this.inputParamsEmployeeSearch = Object.assign({}, this.inputParamsEmployeeSearch, {
            'countryCode': this.utils.getCountryCode(),
            'businessCode': this.utils.getBusinessCode(),
            'negotiatingBranchNumber': this.utils.getBranchCode()
        });
    };
    ContactSearchGridComponent.prototype.fetchGridData = function () {
        this.query.set(this.serviceConstants.Action, '2');
        this.query.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.query.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.query.set('PageSize', this.itemsPerPage.toString());
        this.query.set('PageCurrent', this.currentPage.toString());
        this.query.set('ContractNumber', this.contactSearchFormGroup.controls['ContractNumber'].value);
        this.query.set('PremiseNumber', this.contactSearchFormGroup.controls['PremiseNumber'].value);
        this.query.set('AccountNumber', this.contactSearchFormGroup.controls['AccountNumber'].value);
        this.query.set('ProductCode', this.contactSearchFormGroup.controls['ProductCode'].value);
        this.query.set('ContactName', this.contactSearchFormGroup.controls['ContactName'].value);
        this.query.set('Postcode', this.contactSearchFormGroup.controls['ZipCode'].value);
        this.query.set('ProspectNumber', this.contactSearchFormGroup.controls['ProspectNumber'].value);
        this.query.set('ServiceCoverNumber', '');
        this.query.set('Filter', this.contactSearchFormGroup.controls['Filter'].value);
        this.query.set('FilterPassed', this.contactSearchFormGroup.controls['FilterPassed'].value);
        this.query.set('FilterLevel', this.contactSearchFormGroup.controls['FilterLevel'].value);
        this.query.set('FilterValue', this.contactSearchFormGroup.controls['FilterValue'].value);
        this.query.set('FilterEmployeeCode', this.contactSearchFormGroup.controls['EmployeeCode'].value);
        this.query.set('CustomerContactNumber', this.contactSearchFormGroup.controls['ReferenceNumber'].value);
        this.query.set('BranchNumber', this.contractData.NegBranchNumber);
        this.query.set('BranchServiceAreaCode', '');
        this.query.set('LanguageCode', '');
        this.query.set('MyContactType', this.contactSearchFormGroup.controls['CustomerContactType'].value);
        this.query.set('OSCallOuts', this.contactSearchFormGroup.controls['OSCallOuts'] ? this.contactSearchFormGroup.controls['OSCallOuts'].value : 'all');
        this.query.set('HeaderClickedColumn', '');
        this.query.set('riSortOrder', this.queryParams.sortOrder);
        this.query.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.query.set('DateTo', this.toDateDisplay);
        this.query.set('DateFrom', this.fromDateDisplay);
        this.queryParams.search = this.query;
        this.contactSearchGrid.loadGridData(this.queryParams);
    };
    ContactSearchGridComponent.prototype.fetchSysChar = function (sysCharNumbers) {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    };
    ContactSearchGridComponent.prototype.sysCharParameters = function () {
        var sysCharList = [
            this.SysCharConstants.SystemCharContactManagementViewingByTopLevel
        ];
        return sysCharList.join(',');
    };
    ContactSearchGridComponent.prototype.loadSearchDefaults = function () {
        var _this = this;
        this.fetchCustomerContactDataPost('GetSearchDefaults', {}, { BusinessCode: this.utils.getBusinessCode(), BranchNumber: this.utils.getBranchCode() }).subscribe(function (data) {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                _this.errorService.emitError(data['oResponse']);
            }
            else {
                if (data['errorMessage']) {
                    _this.errorService.emitError({
                        errorMessage: data['errorMessage'] || ErrorConstant.Message.UnexpectedError
                    });
                }
                else {
                    _this.contactSearchFormGroup.controls['CustomerContactType'].setValue(_this.customerContactTypeList[parseInt(data.cmbContactType, 10)].code);
                    _this.contactSearchFormGroup.controls['Filter'].setValue(_this.filterList[parseInt(data.cmbStatus, 10)].code);
                    _this.contactSearchFormGroup.controls['FilterPassed'].setValue(_this.filterPassedList[parseInt(data.cmbPassed, 10)].code);
                    _this.contactSearchFormGroup.controls['FilterLevel'].setValue(_this.filterLevelList[parseInt(data.cmbLevel, 10)].code);
                    _this.contactSearchFormGroup.controls['FilterValue'].setValue(_this.filterValueList[parseInt(data.cmbValue, 10)].code);
                }
            }
        }, function (error) {
        });
    };
    ContactSearchGridComponent.prototype.fetchCustomerContactDataPost = function (functionName, params, formData) {
        var queryContact = new URLSearchParams();
        var businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
        var countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();
        queryContact.set(this.serviceConstants.BusinessCode, businessCode);
        queryContact.set(this.serviceConstants.CountryCode, countryCode);
        queryContact.set(this.serviceConstants.Action, this.queryParams.action);
        if (functionName !== '') {
            queryContact.set(this.serviceConstants.Action, '6');
            queryContact.set('Function', functionName);
        }
        for (var key in params) {
            if (key) {
                queryContact.set(key, params[key]);
            }
        }
        return this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, queryContact, formData);
    };
    ContactSearchGridComponent.prototype.getServiceCoverNumber = function (functionName, params) {
        var queryServiceCover = new URLSearchParams();
        var businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
        var countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();
        queryServiceCover.set(this.serviceConstants.BusinessCode, businessCode);
        queryServiceCover.set(this.serviceConstants.CountryCode, countryCode);
        queryServiceCover.set(this.serviceConstants.Action, this.queryParams.action);
        if (functionName !== '') {
            queryServiceCover.set(this.serviceConstants.Action, '6');
            queryServiceCover.set('Function', functionName);
        }
        for (var key in params) {
            if (key) {
                queryServiceCover.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, queryServiceCover);
    };
    ContactSearchGridComponent.prototype.getServiceCoverNumberTop = function () {
        if (this.serviceCover.ServiceCoverRowID !== '') {
            this.getServiceCoverNumberFromRowID();
        }
        else {
            this.getServiceCoverNumberFromRecord();
        }
    };
    ContactSearchGridComponent.prototype.getServiceCoverNumberFromRowID = function () {
        var _this = this;
        this.getServiceCoverNumber('GetServiceCoverFromRowID', { SCRowID: this.serviceCover.ServiceCoverRowID }).subscribe(function (data) {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                _this.errorService.emitError(data['oResponse']);
            }
            else {
                if (data['errorMessage']) {
                    _this.errorService.emitError({
                        errorMessage: data['errorMessage'] || ErrorConstant.Message.UnexpectedError
                    });
                }
                else {
                    _this.serviceCover.ServiceCoverNumber = data['ServiceCoverNumber'];
                    _this.serviceCover.ServiceTypeCode = data['ServiceTypeCode'];
                    _this.serviceCover.ServiceTypeDesc = data['ServiceTypeDesc'];
                    _this.contactSearchFormGroup.controls['ProductDesc'].setValue(data['ProductDesc']);
                }
            }
        }, function (error) {
        });
    };
    ContactSearchGridComponent.prototype.getServiceCoverNumberFromRecord = function () {
        var _this = this;
        var functionName = 'GetServiceCoverFromRecord';
        var parameters = {
            ContractNumber: this.contactSearchFormGroup.controls['ContractNumber'].value,
            PremiseNumber: this.contactSearchFormGroup.controls['PremiseNumber'].value,
            ProductCode: this.contactSearchFormGroup.controls['ProductCode'].value
        };
        this.getServiceCoverNumber(functionName, parameters).subscribe(function (data) {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                _this.errorService.emitError(data['oResponse']);
            }
            else {
                if (data['errorMessage']) {
                    _this.errorService.emitError({
                        errorMessage: data['errorMessage'] || ErrorConstant.Message.UnexpectedError
                    });
                }
                else {
                    _this.serviceCover.ServiceCoverRowID = data['ServiceCoverRowID'];
                    _this.serviceCover.ServiceCoverNumber = data['ServiceCoverNumber'];
                    _this.serviceCover.ServiceTypeCode = data['ServiceTypeCode'];
                    _this.serviceCover.ServiceTypeDesc = data['ServiceTypeDesc'];
                    if (_this.serviceCover.ServiceCoverNumber === '-1') {
                        _this.getServiceCoverNumberFromRowID();
                    }
                    else if (_this.serviceCover.ServiceCoverNumber === '0') {
                        _this.contactSearchFormGroup.controls['ProductCode'].setErrors({});
                    }
                    else {
                        _this.contactSearchFormGroup.controls['ProductDesc'].setValue(data['ProductDesc']);
                    }
                }
            }
        }, function (error) {
        });
    };
    ContactSearchGridComponent.prototype.gridInfo = function (value) {
        if (value && value.totalPages) {
            this.gridTotalItems = parseInt(value.totalPages, 10) * this.itemsPerPage;
        }
        else {
            this.gridTotalItems = 0;
        }
    };
    ContactSearchGridComponent.prototype.fetchContractTypeDetails = function () {
        var _this = this;
        var data = [{
                'table': 'ContactType',
                'query': {},
                'fields': ['ContactTypeCode', 'ContactTypeSystemDesc']
            }];
        this.lookUpRecord(data, 100).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                for (var i = 0; i < e['results'][0].length; i++) {
                    var obj = {
                        code: e['results'][0][i].ContactTypeCode,
                        value: e['results'][0][i].ContactTypeSystemDesc
                    };
                    _this.customerContactTypeList.push(JSON.parse(JSON.stringify(obj)));
                }
            }
            else {
            }
            _this.fetchGridData();
        }, function (error) {
            _this.fetchGridData();
        });
    };
    ContactSearchGridComponent.prototype.onAccountBlur = function (event) {
        var _this = this;
        if (this.contactSearchFormGroup.controls['AccountNumber'].value && this.contactSearchFormGroup.controls['AccountNumber'].value !== '') {
            var data = [{
                    'table': 'Account',
                    'query': { 'AccountNumber': this.contactSearchFormGroup.controls['AccountNumber'].value, 'BusinessCode': this.storeData['code'].business, 'CountryCode': this.storeData['code'].country },
                    'fields': ['AccountNumber', 'AccountName']
                }];
            this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                    _this.contactSearchFormGroup.controls['AccountName'].setValue(e['results'][0][0].AccountName);
                }
                else {
                    _this.contactSearchFormGroup.controls['AccountName'].setValue('');
                    e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                    _this.errorService.emitError(e);
                }
            }, function (error) {
                _this.contactSearchFormGroup.controls['AccountName'].setValue('');
                error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
            });
        }
        else {
            this.contactSearchFormGroup.controls['AccountName'].setValue('');
        }
    };
    ContactSearchGridComponent.prototype.onContractBlur = function (event) {
        var _this = this;
        if (this.contactSearchFormGroup.controls['ContractNumber'].value && this.contactSearchFormGroup.controls['ContractNumber'].value !== '') {
            var data = [{
                    'table': 'Contract',
                    'query': { 'ContractNumber': this.contactSearchFormGroup.controls['ContractNumber'].value, 'BusinessCode': this.storeData['code'].business, 'CountryCode': this.storeData['code'].country },
                    'fields': ['ContractNumber', 'ContractName']
                }];
            this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                    _this.contactSearchFormGroup.controls['ContractName'].setValue(e['results'][0][0].ContractName);
                }
                else {
                    _this.contactSearchFormGroup.controls['ContractName'].setValue('');
                    e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                    _this.errorService.emitError(e);
                }
            }, function (error) {
                _this.contactSearchFormGroup.controls['ContractName'].setValue('');
                error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
            });
        }
        else {
            this.contactSearchFormGroup.controls['ContractName'].setValue('');
        }
    };
    ContactSearchGridComponent.prototype.onPremiseBlur = function (event) {
        var _this = this;
        if (this.contactSearchFormGroup.controls['PremiseNumber'].value && this.contactSearchFormGroup.controls['PremiseNumber'].value !== '') {
            var isValid = this.isValid(this.contactSearchFormGroup.controls['PremiseNumber'].value);
            if (isValid) {
                this.contactSearchFormGroup.controls['PremiseNumber'].clearValidators();
                var data = [{
                        'table': 'Premise',
                        'query': { 'ContractNumber': this.contactSearchFormGroup.controls['ContractNumber'].value, 'PremiseNumber': this.contactSearchFormGroup.controls['PremiseNumber'].value, 'BusinessCode': this.storeData['code'].business },
                        'fields': ['BusinessCode', 'PremiseNumber', 'PremiseName']
                    }];
                this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
                    if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                        _this.contactSearchFormGroup.controls['PremiseName'].setValue(e['results'][0][0].PremiseName);
                    }
                    else {
                        _this.contactSearchFormGroup.controls['PremiseName'].setValue('');
                        e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                        _this.errorService.emitError(e);
                    }
                }, function (error) {
                    _this.contactSearchFormGroup.controls['PremiseName'].setValue('');
                    error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                });
            }
            else {
                this.contactSearchFormGroup.controls['PremiseNumber'].setErrors({});
            }
        }
        else {
            this.contactSearchFormGroup.controls['PremiseName'].setValue('');
        }
    };
    ContactSearchGridComponent.prototype.onProductBlur = function (event) {
        if (this.contactSearchFormGroup.controls['ProductCode'].value && this.contactSearchFormGroup.controls['ProductCode'].value !== '') {
            this.getServiceCoverNumberTop();
        }
        else {
            this.contactSearchFormGroup.controls['ProductDesc'].setValue('');
        }
    };
    ContactSearchGridComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.storeData['code'] && this.storeData['code'].business ? this.storeData['code'].business : this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.storeData['code'] && this.storeData['code'].country ? this.storeData['code'].country : this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    };
    ContactSearchGridComponent.prototype.isValid = function (str) {
        return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
    };
    ContactSearchGridComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    ContactSearchGridComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('Customer Contact Search', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.titleService.setTitle(res);
                }
                else {
                    _this.titleService.setTitle(_this.inputParams.pageTitle);
                }
            });
        });
        this.getTranslatedValue('Customer Contact Search', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.inputParams.pageHeader = res;
                }
            });
        });
    };
    ContactSearchGridComponent.prototype.onChange = function (event) {
    };
    ContactSearchGridComponent.prototype.osCallOutOnChange = function (event) {
    };
    ContactSearchGridComponent.prototype.ngAfterViewInit = function () {
        this.arrangeElements();
    };
    ContactSearchGridComponent.prototype.ngOnDestroy = function () {
        if (this.routeSubscription)
            this.routeSubscription.unsubscribe();
        if (this.messageSubscription)
            this.messageSubscription.unsubscribe();
        if (this.errorSubscription)
            this.errorSubscription.unsubscribe();
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
        if (this.querySubscription)
            this.querySubscription.unsubscribe();
    };
    ContactSearchGridComponent.prototype.arrangeElements = function () {
    };
    ContactSearchGridComponent.prototype.removeClass = function () {
        HTMLElement.prototype['removeClass'] = function (remove) {
            var newClassName = '';
            var i;
            var classes = this.className.split(' ');
            for (i = 0; i < classes.length; i++) {
                if (classes[i] !== remove) {
                    newClassName += classes[i] + ' ';
                }
            }
            this.className = newClassName;
        };
    };
    ContactSearchGridComponent.prototype.getCurrentPage = function (event) {
        this.currentPage = event.value;
        this.fetchGridData();
    };
    ContactSearchGridComponent.prototype.optionsChange = function (data) {
        if (this.contactSearchFormGroup.controls['Options'].value === 'Contact History') {
            this.router.navigate(['grid/contactmanagement/customercontactHistorygrid'], {
                queryParams: {
                    parentMode: 'Contract',
                    currentContractTypeURLParameter: this.inputParams.currentContractTypeURLParameter,
                    ContractNumber: this.contactSearchFormGroup.controls['ContractNumber'].value,
                    ContractName: this.contactSearchFormGroup.controls['ContractName'].value,
                    AccountNumber: this.contactSearchFormGroup.controls['AccountNumber'].value,
                    AccountName: this.contactSearchFormGroup.controls['AccountName'].value,
                    PremiseNumber: this.contactSearchFormGroup.controls['PremiseNumber'].value,
                    PremiseName: this.contactSearchFormGroup.controls['PremiseName'].value,
                    ProductCode: this.contactSearchFormGroup.controls['ProductCode'].value,
                    ProductDesc: this.contactSearchFormGroup.controls['ProductDesc'].value
                }
            });
        }
        else if (this.contactSearchFormGroup.controls['Options'].value === 'New Contact') {
        }
    };
    ContactSearchGridComponent.prototype.customerContactTypeChange = function (data) {
        var refVal = this.contactSearchFormGroup.controls['CustomerContactType'].value;
        for (var i = 0; i < this.customerContactTypeList.length; i++) {
            if (refVal === this.customerContactTypeList[i].value) {
                this.myContactType = this.customerContactTypeList[i].code;
            }
        }
    };
    ContactSearchGridComponent.prototype.filterChange = function (data) {
    };
    ContactSearchGridComponent.prototype.passedChange = function (data) {
    };
    ContactSearchGridComponent.prototype.levelChange = function (data) {
    };
    ContactSearchGridComponent.prototype.valueChange = function (data) {
        if (this.contactSearchFormGroup.controls['FilterValue'].value === 'thisemployee') {
            this.showEmployeeCode = true;
            setTimeout(function () {
                document.getElementById('EmployeeCode').focus();
            }, 0);
        }
        else {
            this.showEmployeeCode = false;
            this.contactSearchFormGroup.controls['EmployeeCode'].setValue('');
        }
    };
    ContactSearchGridComponent.prototype.onRefresh = function () {
        this.currentPage = 1;
        this.fetchGridData();
    };
    ContactSearchGridComponent.prototype.onGridRowDblClick = function (data) {
        if (data.cellIndex === 0) {
        }
        else if (data.cellIndex === 10) {
            if (data.trRowData[data.cellIndex].rowID !== '1') {
            }
        }
    };
    ContactSearchGridComponent.prototype.onContractDataReceived = function (data, route) {
        this.contractData = data;
        this.contactSearchFormGroup.controls['ContractNumber'].setValue(data.ContractNumber);
        this.contactSearchFormGroup.controls['ContractName'].setValue(data.ContractName);
    };
    ContactSearchGridComponent.prototype.onProductDataReceived = function (data, route) {
        this.productData = data;
        this.contactSearchFormGroup.controls['ProductCode'].setValue(data.ProductCode);
        this.contactSearchFormGroup.controls['ProductDesc'].setValue(data.ProductDesc);
    };
    ContactSearchGridComponent.prototype.onAccountDataReceived = function (data, route) {
        this.accountData = data;
        this.contactSearchFormGroup.controls['AccountNumber'].setValue(data.AccountNumber);
        this.contactSearchFormGroup.controls['AccountName'].setValue(data.AccountName);
    };
    ContactSearchGridComponent.prototype.onPremiseDataReceived = function (data, route) {
        this.premiseData = data;
        this.contactSearchFormGroup.controls['PremiseNumber'].setValue(data.PremiseNumber);
        this.contactSearchFormGroup.controls['PremisesName'].setValue(data.PremiseDesc);
    };
    ContactSearchGridComponent.prototype.onEmployeeDataReceived = function (data, route) {
        this.employeeData = data;
        this.contactSearchFormGroup.controls['EmployeeCode'].setValue(data.EmployeeCode);
    };
    ContactSearchGridComponent.prototype.isNumber = function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    };
    ContactSearchGridComponent.prototype.toUpperCase = function (event) {
        var target = event.target.getAttribute('formControlName');
        var elementValue = event.target.value;
        if (elementValue !== null && elementValue !== undefined) {
            this.contactSearchFormGroup.controls[target].setValue(elementValue.toUpperCase());
        }
    };
    ContactSearchGridComponent.prototype.toDateSelectedValue = function (value) {
        if (value) {
            this.toDateDisplay = value.value;
        }
        else {
            this.toDateDisplay = '';
        }
    };
    ContactSearchGridComponent.prototype.fromDateSelectedValue = function (value) {
        if (value) {
            this.fromDateDisplay = value.value;
        }
        else {
            this.fromDateDisplay = '';
        }
    };
    ContactSearchGridComponent.prototype.formatDate = function (date) {
        var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [day, month, year].join('/');
    };
    ContactSearchGridComponent.prototype.infoData = function (data) {
        this.messageService.emitMessage({
            title: data.data.text,
            msg: data.data.toolTip
        });
    };
    ContactSearchGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSCMCustomerContactSearchGrid.html',
                    styles: ["\n        .custom-container .right-container {\n            width: 100%;\n            padding: 0;\n        }\n        .custom-container {\n            margin-top: 0;\n        }\n    "],
                    providers: [ErrorService, MessageService]
                },] },
    ];
    ContactSearchGridComponent.ctorParameters = [
        { type: FormBuilder, },
        { type: Router, },
        { type: HttpService, },
        { type: ServiceConstants, },
        { type: NgZone, },
        { type: GlobalConstant, },
        { type: AjaxObservableConstant, },
        { type: ErrorService, },
        { type: MessageService, },
        { type: Title, },
        { type: TranslateService, },
        { type: LocaleTranslationService, },
        { type: ComponentInteractionService, },
        { type: Store, },
        { type: ActivatedRoute, },
        { type: SysCharConstants, },
        { type: Utils, },
    ];
    ContactSearchGridComponent.propDecorators = {
        'container': [{ type: ViewChild, args: ['topContainer',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'contactSearchGrid': [{ type: ViewChild, args: ['contactSearchGrid',] },],
    };
    return ContactSearchGridComponent;
}());
