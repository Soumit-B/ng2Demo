import { InvoiceGroupSearchComponent } from './../../search/iCABSAInvoiceGroupSearch.component';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RiExchange } from './../../../../shared/services/riExchange';
import { ProRataChargeStatusLanguageSearchComponent } from './../../search/iCABSSProRataChargeStatusLanguageSearch';
import { AuthService } from './../../../../shared/services/auth.service';
import { HttpService } from './../../../../shared/services/http-service';
import { ErrorService } from './../../../../shared/services/error.service';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { Utils } from './../../../../shared/services/utility';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ContractActionTypes } from '../../../../app/actions/contract';
import { EmployeeSearchComponent } from '../../../../app/internal/search/iCABSBEmployeeSearch';
import { InvoiceSearchComponent } from './../../../internal/search/iCABSInvoiceSearch.component';
import { ActivatedRoute } from '@angular/router';
export var ProRataMaintenanceTypeAComponent = (function () {
    function ProRataMaintenanceTypeAComponent(store, _formBuilder, utils, errorService, httpService, authService, serviceConstants, riExchange, activatedRoute) {
        var _this = this;
        this.store = store;
        this._formBuilder = _formBuilder;
        this.utils = utils;
        this.errorService = errorService;
        this.httpService = httpService;
        this.authService = authService;
        this.serviceConstants = serviceConstants;
        this.riExchange = riExchange;
        this.activatedRoute = activatedRoute;
        this.invoiceSearchComponent = InvoiceSearchComponent;
        this.ellipseConfig = {
            bCompanySearchComponent: {
                inputParamsCompanySearch: {
                    parentMode: 'LookUp',
                    businessCode: this.utils.getBusinessCode(),
                    countryCode: this.utils.getCountryCode()
                },
                isDisabled: false,
                isRequired: false,
                active: { id: '', text: '' }
            },
            invoiceSearchComponent: {
                inputParams: {
                    parentMode: 'CreditReInvoice',
                    businessCode: this.utils.getBusinessCode(),
                    countryCode: this.utils.getCountryCode(),
                    companyCode: '',
                    CompanyInvoiceNumber: ''
                },
                showCloseButton: true,
                config: {
                    ignoreBackdropClick: true
                },
                showHeader: true,
                disabled: false
            }
        };
        this.messageModalConfig = {
            showMessageHeader: true,
            config: {
                ignoreBackdropClick: true
            },
            title: '',
            content: '',
            showCloseButton: true
        };
        this.ajaxSource = new BehaviorSubject(0);
        this.pageVariables = {
            isRequesting: false
        };
        this.invoiceGrp = InvoiceGroupSearchComponent;
        this.inputParams = {};
        this.search = new URLSearchParams();
        this.isProducedInvoiceNumber = false;
        this.headerParams = {
            method: 'ccm/maintenance',
            module: 'customer',
            operation: 'ContactManagement/iCABSCMContactPersonMaintenance'
        };
        this.negBranchNumberSelected = {
            id: '',
            text: ''
        };
        this.statusSelected = {
            id: '',
            text: ''
        };
        this.negCompanyNumberSelected = {
            id: '',
            text: ''
        };
        this.childConfigParamsCommissionEmployee = {
            'mode': 'LookUp-ServiceCoverCommissionEmployee'
        };
        this.childConfigParamsOriginalCompanyCode = {
            'mode': 'LookUp-ProRata-Original'
        };
        this.employeeSearchComponent = EmployeeSearchComponent;
        this.inputParamsBranch = { 'parentMode': 'Contract-Search', 'ContractTypeCode': 'J', 'businessCode': this.utils.getBusinessCode(), 'countryCode': this.utils.getCountryCode() };
        this.languageSearchInputParams = { 'parentMode': 'ProRataChargeMaintenance' };
        this.viewLevels = [];
        this.bcompanyInputParams = {
            'parentMode': 'LookUp-ProRata-Original',
            'countryCode': this.utils.getCountryCode(),
            'businessCode': this.utils.getBusinessCode()
        };
        this.addMode = false;
        this.startDate = '';
        this.endDate = '';
        this.extractDate = '';
        this.taxPointDate = '';
        this.paidDate = '';
        this.branchNumber = '';
        this.originalCompanyCode = '';
        this.action = '2';
        this.isCreditMissedServiceInd = false;
        this.isCreditNumberOfVisits = false;
        this.isDisableTaxPointDate = false;
        this.isTaxPointDate = false;
        this.isInvoiceCreditDesc = true;
        this.isDisableProRataChargeStatusCode = false;
        this.proRataChargeStatusCode = '';
        this.showEndDate = true;
        this.isServiceSalesEmployee = true;
        this.isRequiredOriginalCompanyCode = false;
        this.isDiscountCode = true;
        this.isProducedInvoiveCompany = false;
        this.vSCEnableTaxInvoiceRanges = false;
        this.vSCEnableUseProRataNarrative = false;
        this.vSCEnableCompanyCode = false;
        this.showHeader = true;
        this.showCloseButton = true;
        this.isShownInContractMode = true;
        this.sysCharParams = {};
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            switch (data['action']) {
                case ContractActionTypes.PARENT_TO_CHILD_COMPONENT:
                    _this.parentToChildComponent = data['parentToChildComponent'];
                    _this.setValuesToFormGroup();
                    if (_this.parentToChildComponent['ProRataChargeStatusCode'] && _this.parentToChildComponent['ProRataChargeStatusCode'] !== '') {
                        _this.proRataChargeStatusCode = _this.parentToChildComponent['ProRataChargeStatusCode'];
                        _this.fetchStatusData(_this.proRataChargeStatusCode);
                    }
                    if (_this.parentToChildComponent['Mode'] && _this.parentToChildComponent['Mode'] === 'AdditionalCredit')
                        _this.setDefaultExtractDate();
                    break;
                case ContractActionTypes.SAVE_SYSCHAR:
                    if (data['syschars']) {
                        _this.sysCharParams = data['syschars'];
                        _this.isDiscountCode = _this.sysCharParams['vEnableDiscountCode'];
                        _this.isProducedInvoiveCompany = _this.sysCharParams['vSCEnableCompanyCode'];
                        _this.vSCEnableTaxInvoiceRanges = _this.sysCharParams['vSCEnableTaxInvoiceRanges'];
                        _this.vSCEnableUseProRataNarrative = _this.sysCharParams['vSCEnableUseProRataNarrative'];
                        _this.vSCEnableCompanyCode = _this.sysCharParams['vSCEnableCompanyCode'];
                    }
                    break;
                case ContractActionTypes.FORM_GROUP_PRORATA:
                    var formGroup = data['formGroup'];
                    _this.isCreditNumberOfVisits = formGroup['isCreditNumberOfVisits'] ? formGroup['isCreditNumberOfVisits'] : false;
                    _this.isCreditMissedServiceInd = formGroup['isCreditMissedServiceInd'] ? formGroup['isCreditMissedServiceInd'] : false;
                    _this.isDisableTaxPointDate = formGroup['isDisableTaxPointDate'] ? formGroup['isDisableTaxPointDate'] : false;
                    _this.isTaxPointDate = formGroup['isTaxPointDate'] ? formGroup['isTaxPointDate'] : false;
                    _this.showEndDate = formGroup['showEndDate'] ? formGroup['showEndDate'] : true;
                    _this.isServiceSalesEmployee = formGroup['isServiceSalesEmployee'] !== null && formGroup['isServiceSalesEmployee'] !== undefined ? formGroup['isServiceSalesEmployee'] : true;
                    _this.branchNumber = formGroup['branchNumber'] ? formGroup['branchNumber'] : _this.branchNumber;
                    _this.companyCode = formGroup['companyCode'] ? formGroup['companyCode'] : _this.companyCode;
                    _this.originalCompanyCode = formGroup['originalCompanyCode'] ? formGroup['originalCompanyCode'] : _this.originalCompanyCode;
                    _this.addMode = formGroup['addMode'];
                    if (_this.branchNumber && _this.branchNumber !== '')
                        _this.fetchBranchData(_this.branchNumber);
                    else if (_this.addMode)
                        _this.fetchBranchData(_this.utils.getBranchCode());
                    if (_this.companyCode && _this.companyCode !== '')
                        _this.fetchCompanyData(_this.companyCode);
                    if (formGroup['proRataChargeStatusCode'] && formGroup['proRataChargeStatusCode'] !== '') {
                        _this.proRataChargeStatusCode = formGroup['proRataChargeStatusCode'];
                        _this.fetchStatusData(_this.proRataChargeStatusCode);
                    }
                    break;
                default:
                    _this.storeData = data;
            }
        });
        this.proRataChargeStatusLanguageSearchComponent = ProRataChargeStatusLanguageSearchComponent;
        this.storeSubscription = activatedRoute.queryParams.subscribe(function (param) {
            _this.routeParams = param;
        });
    }
    ProRataMaintenanceTypeAComponent.prototype.ngOnInit = function () {
        this.contractGeneralFormGroup = this._formBuilder.group({
            InvoiceGroupNumber: [{ value: '', disabled: false }],
            InvoiceGroupDesc: [{ value: '', disabled: true }],
            InvoiceCreditCode: [{ value: '', disabled: true }],
            InvoiceCreditDesc: [{ value: '', disabled: true }],
            ProRataChargeStatusCode: [{ value: '', disabled: this.isDisableProRataChargeStatusCode }],
            ProRataChargeStatusDesc: [{ value: '', disabled: false }],
            ServiceQuantity: [{ value: '', disabled: false }],
            ProRataChargeValue: [{ value: '', disabled: false }],
            ProducedCompanyCode: [{ value: '', disabled: true }],
            ProducedCompanyDesc: [{ value: '', disabled: true }],
            CostValue: [{ value: '', disabled: false }],
            ProducedCompanyInvoiceNumber: [{ value: '', disabled: true }],
            ProducedInvoiceNumber: [{ value: '', disabled: true }],
            ServiceSalesEmployee: [{ value: '', disabled: true }],
            EmployeeSurname: [{ value: '', disabled: true }],
            ProducedInvoiceRun: [{ value: '', disabled: true }],
            OriginalInvoiceNumber: [{ value: '', disabled: false }],
            TaxCode: [{ value: '', disabled: false }],
            TaxCodeDesc: [{ value: '', disabled: true }],
            OriginalInvoiceItemNumber: [{ value: '', disabled: false }],
            InvoiceCreditReasonCode: [{ value: '', disabled: false }],
            InvoiceCreditReasonDesc: [{ value: '', disabled: true }],
            PurchaseOrderNo: [{ value: '', disabled: false }],
            TaxInvoiceNumber: [{ value: '', disabled: false }],
            DiscountCode: [{ value: '', disabled: false }],
            DiscountDesc: [{ value: '', disabled: true }],
            CreditMissedServiceInd: [{ value: '', disabled: false }],
            OutsortInvoice: [{ value: '', disabled: false }],
            CreditNumberOfVisits: [{ value: '', disabled: false }]
        });
        this.invoiceGroupSearchParams = { parentMode: this.ellipseConfig.invoiceSearchComponent.inputParams.parentMode, AccountNumber: this.routeParams.AccountNumber, isEllipsis: true };
        this.proRataExtractDatePicker.isRequired = true;
        this.proRataStartDatePicker.isRequired = true;
        this.setValuesToFormGroup();
        this.setupGridContactRole();
        if (this.inputParamsBranch.parentMode === 'Contract-Search') {
            this.isShownInContractMode = false;
        }
        this.setFormGroupToStore();
    };
    ProRataMaintenanceTypeAComponent.prototype.setDefaultExtractDate = function () {
        if ((!this.extractDate || this.extractDate === '') && this.parentToChildComponent.AddMode) {
            this.extractDateDt = new Date();
            this.extractDate = this.extractDateDt.toString();
        }
    };
    ProRataMaintenanceTypeAComponent.prototype.setValuesToFormGroup = function () {
        if (this.parentToChildComponent) {
            if (this.parentToChildComponent['StartDate'] !== null) {
                if (window['moment'](this.storeData.sentFromParent['Start Date'], 'DD/MM/YYYY', true).isValid()) {
                    this.startDate = this.parentToChildComponent['StartDate'];
                }
                else {
                    this.startDate = this.parentToChildComponent['StartDate'];
                }
            }
            if (this.parentToChildComponent['EndDate'] !== null) {
                if (window['moment'](this.storeData.sentFromParent['End Date'], 'DD/MM/YYYY', true).isValid()) {
                    this.endDate = this.parentToChildComponent['EndDate'];
                }
                else {
                    this.endDate = this.parentToChildComponent['EndDate'];
                }
            }
            if (this.parentToChildComponent['ExtractDate'] !== null) {
                if (window['moment'](this.storeData.sentFromParent['Extract Date'], 'DD/MM/YYYY', true).isValid()) {
                    this.extractDate = this.parentToChildComponent['ExtractDate'];
                }
                else {
                    this.extractDate = this.parentToChildComponent['ExtractDate'];
                }
            }
            if (this.parentToChildComponent['PaidDate'] !== null) {
                if (window['moment'](this.storeData.sentFromParent['Paid Date'], 'DD/MM/YYYY', true).isValid()) {
                    this.paidDate = this.parentToChildComponent['PaidDate'];
                }
                else {
                    this.paidDate = this.parentToChildComponent['PaidDate'];
                }
            }
            if (this.parentToChildComponent['TaxPointDate'] !== null) {
                if (window['moment'](this.storeData.sentFromParent['Tax Point Date'], 'DD/MM/YYYY', true).isValid()) {
                    this.taxPointDate = this.parentToChildComponent['TaxPointDate'];
                }
                else {
                    this.taxPointDate = this.parentToChildComponent['TaxPointDate'];
                }
            }
            this.contractGeneralFormGroup.controls['InvoiceGroupNumber'].setValidators(Validators.required);
            this.contractGeneralFormGroup.controls['TaxCode'].setValidators(Validators.required);
            this.contractGeneralFormGroup.controls['InvoiceCreditReasonCode'].setValidators(Validators.required);
        }
        this.setFormGroupToStore();
    };
    ProRataMaintenanceTypeAComponent.prototype.setFormGroupToStore = function () {
        this.store.dispatch({
            type: ContractActionTypes.FORM_GROUP_PRORATA,
            payload: {
                typeA: this.contractGeneralFormGroup,
                isCreditNumberOfVisits: this.isCreditNumberOfVisits,
                isCreditMissedServiceInd: this.isCreditMissedServiceInd,
                isDisableTaxPointDate: this.isDisableTaxPointDate,
                isTaxPointDate: this.isTaxPointDate,
                isInvoiceCreditDesc: this.isInvoiceCreditDesc,
                isDisableProRataChargeStatusCode: this.isDisableProRataChargeStatusCode,
                showEndDate: this.showEndDate,
                isServiceSalesEmployee: this.isServiceSalesEmployee,
                isRequiredOriginalCompanyCode: this.isRequiredOriginalCompanyCode,
                isDiscountCode: this.isDiscountCode,
                branchNumber: this.branchNumber,
                originalCompanyCode: this.originalCompanyCode,
                negBranchNumberSelected: this.negBranchNumberSelected,
                negCompanyNumberSelected: this.negCompanyNumberSelected,
                proRataChargeStatusCode: this.proRataChargeStatusCode,
                addMode: this.addMode,
                proRataStartDatePicker: this.proRataStartDatePicker,
                proRataExtractDatePicker: this.proRataExtractDatePicker,
                allDate: {
                    startDate: this.startDate,
                    endDate: this.endDate,
                    extractDate: this.extractDate,
                    taxPointDate: this.taxPointDate,
                    paidDate: this.paidDate
                }
            }
        });
    };
    ProRataMaintenanceTypeAComponent.prototype.setupGridContactRole = function () {
        this.pageSizeContactRole = 6;
        this.currentPageContactRole = 1;
        this.maxColumnsContactRole = 10;
    };
    ProRataMaintenanceTypeAComponent.prototype.onReceivingEmployeeResult = function (event) {
        this.contractGeneralFormGroup.controls['ServiceSalesEmployee'].setValue(event['EmployeeCode']);
        this.contractGeneralFormGroup.controls['EmployeeSurname'].setValue(event['EmployeeSurName']);
    };
    ProRataMaintenanceTypeAComponent.prototype.onBCompanySearchReceived = function (obj) {
        if (obj) {
            this.originalCompanyCode = obj.OriginalCompanyCode;
            this.bcompanyResp = obj.CompanyCode + ' : ' + (obj.hasOwnProperty('CompanyDesc') ? obj.CompanyDesc : obj.CompanyDesc);
            this.ellipseConfig.invoiceSearchComponent.inputParams.companyCode = obj.OriginalCompanyCode;
            this.setFormGroupToStore();
        }
    };
    ProRataMaintenanceTypeAComponent.prototype.onBranchDataReceived = function (obj) {
        if (obj) {
            this.branchNumber = obj.BranchNumber;
            this.BranchSearch = obj.BranchNumber + ' : ' + (obj.hasOwnProperty('BranchName') ? obj.BranchName : obj.Object.BranchName);
            this.setFormGroupToStore();
        }
    };
    ProRataMaintenanceTypeAComponent.prototype.startDateSelectedValue = function (value) {
        if (this.parentToChildComponent && this.parentToChildComponent.UpdateMode) {
            if (window['moment'](value['value'], 'DD/MM/YYYY', true).isValid()) {
                this.startDate = this.utils.convertDate(value['value']);
                if (this.extractDate === '')
                    this.extractDate = this.utils.convertDate(value['value']);
            }
            else {
                this.startDate = value['value'];
                if (this.extractDate === '')
                    this.extractDate = value['value'];
            }
        }
        else {
            if (window['moment'](value['value'], 'DD/MM/YYYY', true).isValid()) {
                this.startDate = this.utils.convertDate(value['value']);
            }
            else {
                this.startDate = value['value'];
            }
        }
        this.setFormGroupToStore();
    };
    ProRataMaintenanceTypeAComponent.prototype.endDateSelectedValue = function (value) {
        if (window['moment'](value['value'], 'DD/MM/YYYY', true).isValid()) {
            this.endDate = this.utils.convertDate(value['value']);
        }
        else {
            this.endDate = value['value'];
        }
        this.setFormGroupToStore();
    };
    ProRataMaintenanceTypeAComponent.prototype.extractDateSelectedValue = function (value) {
        if (window['moment'](value['value'], 'DD/MM/YYYY', true).isValid()) {
            this.extractDate = this.utils.convertDate(value['value']);
        }
        else {
            this.extractDate = value['value'];
        }
        this.setFormGroupToStore();
    };
    ProRataMaintenanceTypeAComponent.prototype.taxPointDateSelectedValue = function (value) {
        if (window['moment'](value['value'], 'DD/MM/YYYY', true).isValid()) {
            this.taxPointDate = this.utils.convertDate(value['value']);
        }
        else {
            this.taxPointDate = value['value'];
        }
        this.setFormGroupToStore();
    };
    ProRataMaintenanceTypeAComponent.prototype.paidDateSelectedValue = function (value) {
        if (window['moment'](value['value'], 'DD/MM/YYYY', true).isValid()) {
            this.paidDate = this.utils.convertDate(value['value']);
        }
        else {
            this.paidDate = value['value'];
        }
        this.setFormGroupToStore();
    };
    ProRataMaintenanceTypeAComponent.prototype.fetchBranchData = function (branchCode) {
        var _this = this;
        var data = [{
                'table': 'Branch',
                'query': { 'BusinessCode': this.businessCode, 'BranchNumber': branchCode },
                'fields': ['BranchNumber', 'BranchName']
            }];
        this.lookUpRecord(data, 5).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    _this.negBranchNumberSelected = {
                        id: e['results'][0][0].BranchNumber,
                        text: e['results'][0][0].BranchNumber + ' - ' + e['results'][0][0].BranchName
                    };
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ProRataMaintenanceTypeAComponent.prototype.fetchCompanyData = function (companyCode) {
        var _this = this;
        var data = [
            {
                'table': 'Company',
                'query': { 'BusinessCode': this.storeData['code'].business, 'CompanyCode': companyCode },
                'fields': ['CompanyCode', 'CompanyDesc']
            }];
        this.lookUpRecord(data, 5).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    _this.negCompanyNumberSelected = {
                        id: e['results'][0][0].CompanyCode,
                        text: e['results'][0][0].CompanyCode + ' - ' + e['results'][0][0].CompanyDesc
                    };
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ProRataMaintenanceTypeAComponent.prototype.fetchDiscountData = function () {
        var _this = this;
        var data = [
            {
                'table': 'Discount',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'DiscountCode': this.contractGeneralFormGroup.controls['DiscountCode'].value
                },
                'fields': ['DiscountDesc']
            }];
        this.lookUpRecord(data, 5).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                var resultDiscount = e.results[0] ? e.results[0] : '';
                if (resultDiscount[0])
                    _this.contractGeneralFormGroup.controls['DiscountDesc'].setValue(resultDiscount[0].DiscountDesc);
                else
                    _this.contractGeneralFormGroup.controls['DiscountDesc'].setValue('');
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ProRataMaintenanceTypeAComponent.prototype.fetchVatData = function () {
        var _this = this;
        var data = [
            {
                'table': 'TaxCode',
                'query': {
                    'TaxCode': this.contractGeneralFormGroup.controls['TaxCode'].value
                },
                'fields': ['TaxCodeDesc']
            }];
        this.lookUpRecord(data, 5).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                var result = e.results[0] ? e.results[0] : '';
                if (result.length === 0) {
                    _this.contractGeneralFormGroup.controls['TaxCode'].setErrors({ 'incorrect': true });
                }
                if (result[0]) {
                    _this.riExchange.riInputElement.isCorrect(_this.contractGeneralFormGroup, 'TaxCode');
                    _this.contractGeneralFormGroup.controls['TaxCodeDesc'].setValue(result[0].TaxCodeDesc);
                }
                else {
                    _this.contractGeneralFormGroup.controls['TaxCode'].setErrors({ 'incorrect': true });
                    _this.contractGeneralFormGroup.controls['TaxCodeDesc'].setValue('');
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ProRataMaintenanceTypeAComponent.prototype.fetchInvoiceGroupData = function () {
        var _this = this;
        var data = [
            {
                'table': 'InvoiceGroup',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'AccountNumber': this.parentToChildComponent.AccountNumber,
                    'InvoiceGroupNumber': this.contractGeneralFormGroup.controls['InvoiceGroupNumber'].value
                },
                'fields': ['InvoiceGroupDesc']
            }];
        this.lookUpRecord(data, 5).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                var result = e.results[0] ? e.results[0] : '';
                if (result.length === 0) {
                    _this.contractGeneralFormGroup.controls['InvoiceGroupNumber'].setErrors({ 'incorrect': true });
                }
                if (result[0]) {
                    _this.riExchange.riInputElement.isCorrect(_this.contractGeneralFormGroup, 'InvoiceGroupNumber');
                    _this.contractGeneralFormGroup.controls['InvoiceGroupDesc'].setValue(result[0].InvoiceGroupDesc);
                }
                else {
                    _this.contractGeneralFormGroup.controls['InvoiceGroupNumber'].setErrors({ 'incorrect': true });
                    _this.contractGeneralFormGroup.controls['InvoiceGroupDesc'].setValue('');
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ProRataMaintenanceTypeAComponent.prototype.fetchReasonData = function () {
        var _this = this;
        var data = [
            {
                'table': 'InvoiceCreditReasonLang',
                'query': {
                    'LanguageCode': this.riExchange.LanguageCode(),
                    'InvoiceCreditReasonCode': this.contractGeneralFormGroup.controls['InvoiceCreditReasonCode'].value
                },
                'fields': ['InvoiceCreditReasonDesc']
            }];
        this.lookUpRecord(data, 5).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                var result = e.results[0] ? e.results[0] : '';
                if (result.length === 0) {
                    _this.contractGeneralFormGroup.controls['InvoiceCreditReasonCode'].setErrors({ 'incorrect': true });
                }
                if (result[0]) {
                    _this.riExchange.riInputElement.isCorrect(_this.contractGeneralFormGroup, 'InvoiceCreditReasonCode');
                    ;
                    _this.contractGeneralFormGroup.controls['InvoiceCreditReasonDesc'].setValue(result[0].InvoiceCreditReasonDesc);
                }
                else {
                    _this.contractGeneralFormGroup.controls['InvoiceCreditReasonCode'].setErrors({ 'incorrect': true });
                    _this.contractGeneralFormGroup.controls['InvoiceCreditReasonDesc'].setValue('');
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ProRataMaintenanceTypeAComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.search.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.search, data);
    };
    ProRataMaintenanceTypeAComponent.prototype.lookupSearch = function (key) {
        var _this = this;
        switch (key) {
            case 'CompanyInvoiceNumber':
                var queryParams = new URLSearchParams();
                queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                queryParams.set(this.serviceConstants.MethodType, 'maintenance');
                var lookupQuery = void 0;
                queryParams.set(this.serviceConstants.Action, '5');
                lookupQuery = [{
                        'table': 'InvoiceHeader',
                        'query': { 'BusinessCode': this.utils.getBusinessCode(), 'Companycode': this.ellipseConfig.invoiceSearchComponent.inputParams.companyCode, 'CompanyInvoiceNumber': this.riExchange.riInputElement.GetValue(this.contractGeneralFormGroup, 'OriginalInvoiceNumber') },
                        'fields': ['InvoiceNumber']
                    }];
                this.pageVariables.isRequesting = true;
                this.invokeLookupSearch(queryParams, lookupQuery).subscribe(function (value) {
                    _this.pageVariables.isRequesting = false;
                    var returnDataLength = value.results[0].length;
                    if (returnDataLength === 0) {
                        _this.messageModalConfig.content = MessageConstant.Message.RecordNotFound;
                        _this.messageModal.show();
                    }
                    else if (returnDataLength > 1) {
                        _this.ellipseConfig.invoiceSearchComponent.inputParams.CompanyInvoiceNumber = _this.contractGeneralFormGroup.controls['OriginalInvoiceNumber'].value;
                        _this.InvoiceSearchEllipsis.openModal();
                    }
                    else {
                        _this.pageVariables.isRequesting = false;
                    }
                }, function (error) {
                    _this.pageVariables.isRequesting = false;
                }, function () {
                    _this.pageVariables.isRequesting = false;
                });
                break;
            default:
                break;
        }
    };
    ProRataMaintenanceTypeAComponent.prototype.invokeLookupSearch = function (queryParams, data) {
        return this.httpService.lookUpRequest(queryParams, data);
    };
    ProRataMaintenanceTypeAComponent.prototype.invoiceSearchComponentDataReceived = function (eventObj) {
        this.lookupSearch('InvoiceNumberReceived');
    };
    ProRataMaintenanceTypeAComponent.prototype.fetchStatusData = function (statusCode) {
        if (statusCode === 'W')
            this.contractGeneralFormGroup.controls['ProRataChargeStatusDesc'].setValue('Waiting');
        else if (statusCode === 'C')
            this.contractGeneralFormGroup.controls['ProRataChargeStatusDesc'].setValue('Cancelled');
        else if (statusCode === 'P')
            this.contractGeneralFormGroup.controls['ProRataChargeStatusDesc'].setValue('Produced');
        else if (statusCode === 'A')
            this.contractGeneralFormGroup.controls['ProRataChargeStatusDesc'].setValue('Awaiting Approval');
        this.statusSelected = {
            id: statusCode,
            text: statusCode + ' - ' + this.contractGeneralFormGroup.controls['ProRataChargeStatusDesc'].value
        };
    };
    ProRataMaintenanceTypeAComponent.prototype.onStatusChange = function (data) {
        this.contractGeneralFormGroup.controls['ProRataChargeStatusCode'].setValue(data['ProRataChargeStatusLang.ProRataChargeStatusCode']);
        this.contractGeneralFormGroup.controls['ProRataChargeStatusDesc'].setValue(data['ProRataChargeStatusLang.ProRataChargeStatusDesc']);
    };
    ProRataMaintenanceTypeAComponent.prototype.setInvoiceGroupSearch = function (data) {
        this.contractGeneralFormGroup.controls['InvoiceGroupNumber'].setValue(data.InvoiceGroupNumber);
        this.contractGeneralFormGroup.controls['InvoiceGroupDesc'].setValue(data.InvoiceGroupDesc);
    };
    ProRataMaintenanceTypeAComponent.prototype.ngOnDestroy = function () {
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
    };
    ProRataMaintenanceTypeAComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-proratamaintenance-type-a',
                    templateUrl: 'proRatamaintenance-type-a.html'
                },] },
    ];
    ProRataMaintenanceTypeAComponent.ctorParameters = [
        { type: Store, },
        { type: FormBuilder, },
        { type: Utils, },
        { type: ErrorService, },
        { type: HttpService, },
        { type: AuthService, },
        { type: ServiceConstants, },
        { type: RiExchange, },
        { type: ActivatedRoute, },
    ];
    ProRataMaintenanceTypeAComponent.propDecorators = {
        'riGridContactRole': [{ type: ViewChild, args: ['riGridContactRole',] },],
        'riGridContactRolePagination': [{ type: ViewChild, args: ['riGridContactRolePagination',] },],
        'proRataChargeStatusLanguageSearchEllipsis': [{ type: ViewChild, args: ['proRataChargeStatusLanguageSearchEllipsis',] },],
        'proRataExtractDatePicker': [{ type: ViewChild, args: ['proRataExtractDatePicker',] },],
        'proRataStartDatePicker': [{ type: ViewChild, args: ['proRataStartDatePicker',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'InvoiceSearchEllipsis': [{ type: ViewChild, args: ['InvoiceSearchEllipsis',] },],
    };
    return ProRataMaintenanceTypeAComponent;
}());
