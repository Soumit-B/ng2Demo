import { Component, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from './../../../../shared/services/http-service';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { PostCodeSearchComponent } from '../../../../app/internal/search/iCABSBPostcodeSearch.component';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { ActionTypes } from './../../../actions/prospect';
import { RiExchange } from './../../../../shared/services/riExchange';
import { Utils } from '../../../../shared/services/utility';
import { ErrorService } from '../../../../shared/services/error.service';
import { LocaleTranslationService } from '../../../../shared/services/translation.service';
import { CustomerTypeSearchComponent } from '../../../../app/internal/search/iCABSSCustomerTypeSearch';
export var MaintenanceTypeGeneralComponent = (function () {
    function MaintenanceTypeGeneralComponent(zone, fb, route, router, store, utils, httpService, serviceConstants, errorService, translateService, riExchange) {
        var _this = this;
        this.zone = zone;
        this.fb = fb;
        this.route = route;
        this.router = router;
        this.store = store;
        this.utils = utils;
        this.httpService = httpService;
        this.serviceConstants = serviceConstants;
        this.errorService = errorService;
        this.translateService = translateService;
        this.riExchange = riExchange;
        this.inputParams = { 'parentMode': 'Contract-Search', 'ContractTypeCode': '', 'countryCode': '', 'businessCode': '' };
        this.allFormControls = [];
        this.queryLookUp = new URLSearchParams();
        this.queryParam = new URLSearchParams();
        this.fieldVisibility = {
            'isHiddenCustomerTypeCode': false,
            'isHiddenCustomerTypeDesc': false,
            'isHiddenSICCode': false,
            'isHiddenSICDescription': false,
            'isHiddenNarrative': false,
            'isHiddenEstimatedContractQuotes': false,
            'isHiddenEstimatedProductSaleQuotes': false,
            'isHiddenEstimatedJobQuotes': false,
            'isHiddenEstimatedTotalQuotes': false,
            'isHiddenEstimatedContractValue': false,
            'isHiddenEstimatedJobValue': false,
            'isHiddenEstimatedProductSaleValue': false,
            'isHiddenExpectedTotalValue': false,
            'isHiddenExpectedValue': false,
            'isHiddenEstimatedClosedDate': false,
            'isHiddenDaysOld': false,
            'isHiddenProspectStatusCode': true,
            'isHiddenProspectStatusDesc': false,
            'isHiddenProbability': false,
            'isHiddenConvertedToNumber': false,
            'isHiddenchkAuthorise': false,
            'isHiddenchkReject': false,
            'isHiddenchkBranch': false,
            'isHiddenproductHeading': false
        };
        this.fieldDisable = {
            'CustomerTypeCode': false,
            'CustomerTypeDesc': true,
            'SICCode': false,
            'SICDescription': true,
            'Narrative': false,
            'EstimatedContractQuotes': false,
            'EstimatedProductSaleQuotes': false,
            'EstimatedJobQuotes': false,
            'EstimatedTotalQuotes': true,
            'EstimatedContractValue': false,
            'EstimatedJobValue': false,
            'EstimatedProductSaleValue': false,
            'EstimatedTotalValue': true,
            'ExpectedTotalValue': true,
            'ExpectedValue': true,
            'ExpectedJobValue': true,
            'ExpectedProductSaleValue': true,
            'EstimatedClosedDate': false,
            'DaysOld': true,
            'ProspectStatusCode': false,
            'ProspectStatusDesc': true,
            'Probability': false,
            'ConvertedToNumber': false,
            'chkAuthorise': false,
            'chkReject': false,
            'chkBranch': false
        };
        this.isDisabledCustomerTypeSearch = false;
        this.CustomerTypeSearchComponent = CustomerTypeSearchComponent;
        this.inputParamsCustomerTypeSearch = { 'parentMode': 'LookUp-PremiseIncSIC', 'CWIExcludeCustomerTypes': '' };
        this.disableInitial = [
            'CustomerTypeDesc', 'SICDescription', 'SICDescription', 'EstimatedTotalQuotes', 'EstimatedTotalValue', 'ExpectedTotalValue',
            'ExpectedValue', 'ExpectedJobValue', 'ExpectedProductSaleValue', 'DaysOld', 'ProspectStatusDesc'
        ];
        this.fieldRequired = {
            'CustomerTypeCode': false,
            'CustomerTypeDesc': false,
            'SICCode': false,
            'SICDescription': false,
            'Narrative': false,
            'EstimatedContractQuotes': false,
            'EstimatedProductSaleQuotes': false,
            'EstimatedJobQuotes': false,
            'EstimatedTotalQuotes': false,
            'EstimatedContractValue': false,
            'EstimatedJobValue': false,
            'EstimatedProductSaleValue': false,
            'EstimatedTotalValue': false,
            'ExpectedTotalValue': false,
            'ExpectedValue': false,
            'ExpectedJobValue': false,
            'ExpectedProductSaleValue': false,
            'EstimatedClosedDate': false,
            'DaysOld': false,
            'ProspectStatusCode': false,
            'ProspectStatusDesc': false,
            'Probability': false,
            'ConvertedToNumber': false,
            'chkAuthorise': false,
            'chkReject': false,
            'chkBranch': false
        };
        this.dateDisable = {
            estimatedClosedDate: false
        };
        this.cmdCancelDisable = true;
        this.zipSearchComponent = PostCodeSearchComponent;
        this.autoOpen = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.searchModalRoute = '';
        this.showHeader = true;
        this.showCloseButton = true;
        this.queryParamsProspect = {
            action: '0',
            operation: 'ContactManagement/iCABSCMPipelineProspectMaintenance',
            module: 'prospect',
            method: 'prospect-to-contract/maintenance',
            contentType: 'application/x-www-form-urlencoded'
        };
        this.systemParametersFromParent = { ttBusiness: [{}], systemChars: {} };
        this.queryContract = new URLSearchParams();
        this.CurrDate = new Date();
        this.maintenanceGeneralFormGroup = this.fb.group({
            CustomerTypeCode: [{ value: '', disabled: false }],
            CustomerTypeDesc: [{ value: '', disabled: false }],
            SICCode: [{ value: '', disabled: false }],
            SICDescription: [{ value: '', disabled: false }],
            Narrative: [{ value: '', disabled: false }],
            EstimatedContractQuotes: [{ value: '0', disabled: false }],
            EstimatedJobQuotes: [{ value: '0', disabled: false }],
            EstimatedProductSaleQuotes: [{ value: '0', disabled: false }],
            EstimatedTotalQuotes: [{ value: '0', disabled: false }],
            EstimatedContractValue: [{ value: '0', disabled: false }],
            EstimatedJobValue: [{ value: '0', disabled: false }],
            EstimatedProductSaleValue: [{ value: '0', disabled: false }],
            EstimatedTotalValue: [{ value: '0', disabled: false }],
            ExpectedValue: [{ value: '0', disabled: false }],
            ExpectedJobValue: [{ value: '0', disabled: false }],
            ExpectedProductSaleValue: [{ value: '0', disabled: false }],
            ExpectedTotalValue: [{ value: '0', disabled: false }],
            EstimatedClosedDate: [{ value: '', disabled: false }],
            DaysOld: [{ value: '', disabled: false }],
            ProspectStatusCode: [{ value: '', disabled: false }],
            ProspectStatusDesc: [{ value: '', disabled: false }],
            Probability: [{ value: '', disabled: false }],
            ConvertedToNumber: [{ value: '', disabled: false }],
            chkAuthorise: [{ value: '', disabled: false }],
            chkReject: [{ value: '', disabled: false }],
            chkBranch: [{ value: '', disabled: false }]
        });
        this.storeSubscription = store.select('prospect').subscribe(function (data) {
            if (data['action']) {
                if (data['action'].toString() === ActionTypes.SAVE_SYSTEM_PARAMETER) {
                    _this.systemParametersFromParent['systemChars'] = data['data']['systemChars'];
                    _this.setUI();
                }
                else if (data['action'].toString() === ActionTypes.EXCHANGE_METHOD) {
                    for (var _i = 0, _a = data['data']; _i < _a.length; _i++) {
                        var m = _a[_i];
                        if (_this[m]) {
                            _this[m]();
                        }
                    }
                }
                else if (data['action'].toString() === ActionTypes.FORM_CONTROLS) {
                    _this.allFormControls.push(data['data']);
                }
            }
        });
    }
    MaintenanceTypeGeneralComponent.prototype.setUI = function () {
        this.maintenanceGeneralFormGroup.controls['EstimatedClosedDate'].setValue(this.systemParametersFromParent.systemChars.DefaultClosedDate);
        this.maintenanceGeneralFormGroup.controls['Probability'].setValue(this.systemParametersFromParent.systemChars.DefaultProbability);
        this.maintenanceGeneralFormGroup.controls['DaysOld'].setValue('0');
        if (this.systemParametersFromParent.systemChars.vSICCodeEnable) {
            this.inputParamsCustomerTypeSearch.parentMode = 'LookUp-PremiseIncSIC';
        }
        else {
            this.inputParamsCustomerTypeSearch.parentMode = 'LookUp';
        }
        if (this.systemParametersFromParent.systemChars.DefaultClosedDate) {
            var dateArr = this.systemParametersFromParent.systemChars.DefaultClosedDate.split('/');
            this.CurrDate = new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);
        }
        if (this.systemParametersFromParent.systemChars.vSICCodeEnable) {
            this.fieldVisibility.isHiddenSICCode = false;
            this.fieldRequired.SICCode = true;
        }
        else {
            this.fieldVisibility.isHiddenSICCode = true;
            this.fieldRequired.SICCode = false;
        }
        if (this.systemParametersFromParent.systemChars.vSCCustomerTypeMandatory) {
            this.fieldRequired.CustomerTypeCode = true;
        }
        else {
            this.fieldRequired.CustomerTypeCode = false;
        }
        this.fieldRequired['Narrative'] = true;
        if (this.systemParametersFromParent.systemChars.currentURL.match(new RegExp('Prospect', 'i'))) {
            this.fieldRequired.ProspectStatusCode = false;
            this.fieldDisable.ProspectStatusCode = true;
            this.fieldVisibility.isHiddenConvertedToNumber = true;
            this.fieldVisibility.isHiddenchkAuthorise = true;
        }
        else if (this.systemParametersFromParent.systemChars.currentURL.match(new RegExp('NatAxJob', 'i'))) {
            this.fieldDisable.ProspectStatusCode = false;
            this.fieldRequired.ProspectStatusCode = true;
            this.fieldVisibility.isHiddenConvertedToNumber = false;
            this.fieldVisibility.isHiddenchkAuthorise = true;
        }
        else {
            this.fieldVisibility.isHiddenConvertedToNumber = false;
            this.fieldVisibility.isHiddenchkAuthorise = false;
        }
        this.fieldDisable.ConvertedToNumber = true;
        if (this.systemParametersFromParent.systemChars.currentURL.match(new RegExp('Confirm', 'i'))) {
            this.fieldRequired.chkAuthorise = true;
            this.fieldRequired.chkReject = true;
            this.fieldRequired.chkBranch = true;
        }
        if (this.systemParametersFromParent.systemCharsvProductSaleInUse) {
            this.fieldVisibility.isHiddenExpectedProductSaleValue = false;
            this.fieldVisibility.productHeading = false;
            this.fieldVisibility.isHiddenEstimatedProductSaleQuotes = false;
            this.fieldVisibility.isHiddenEstimatedProductSaleValue = false;
        }
        var parentMode = this.riExchange.ParentMode(this.systemParametersFromParent.systemChars.routeParams);
        if (parentMode === 'ContactManagement' || parentMode === 'WorkOrderMaintenance' || parentMode === 'ContactRelatedTicket'
            || parentMode === 'SalesOrder' || parentMode === 'CallCentreSearch' || parentMode === 'PipelineGridNew' || parentMode === 'CallCentreSearchNew'
            || parentMode === 'CallCentreSearchNewExisting' || parentMode === 'LostBusinessRequest') {
            this.fieldVisibility.isHiddenProspectStatusCode = false;
        }
        if (this.systemParametersFromParent.systemChars.vSCDisableQuoteDetsOnAddProspect) {
            this.fieldVisibility.isHiddenEstimatedContractQuotes = true;
            this.fieldVisibility.isHiddenEstimatedContractValue = true;
            this.fieldVisibility.isHiddenExpectedValue = true;
            this.fieldVisibility.isHiddenEstimatedClosedDate = true;
        }
        else {
            this.fieldVisibility.isHiddenEstimatedContractQuotes = false;
            this.fieldVisibility.isHiddenEstimatedContractValue = false;
            this.fieldVisibility.isHiddenExpectedValue = false;
            this.fieldVisibility.isHiddenEstimatedClosedDate = false;
        }
        this.updateValidators();
        this.updateDisable();
    };
    MaintenanceTypeGeneralComponent.prototype.updateValidators = function () {
        for (var f in this.fieldRequired) {
            if (this.fieldRequired.hasOwnProperty(f)) {
                if (this.maintenanceGeneralFormGroup.controls[f]) {
                    if (this.fieldRequired[f]) {
                        if (f === 'EstimatedContractValue' || f === 'EstimatedJobValue' || f === 'EstimatedProductSaleValue' || f === 'EstimatedContractQuotes' || f === 'EstimatedJobQuotes' || f === 'EstimatedProductSaleQuotes') {
                            this.maintenanceGeneralFormGroup.controls[f].setValidators([this.minValidate]);
                        }
                        else {
                            this.maintenanceGeneralFormGroup.controls[f].setValidators([Validators.required]);
                        }
                    }
                    else {
                        this.maintenanceGeneralFormGroup.controls[f].clearValidators();
                    }
                    this.maintenanceGeneralFormGroup.controls[f].updateValueAndValidity();
                }
            }
        }
    };
    MaintenanceTypeGeneralComponent.prototype.updateDisable = function () {
        for (var f in this.fieldDisable) {
            if (this.fieldDisable.hasOwnProperty(f)) {
                if (this.fieldDisable[f] && this.maintenanceGeneralFormGroup.controls[f]) {
                    this.maintenanceGeneralFormGroup.controls[f].disable();
                }
                else {
                    this.maintenanceGeneralFormGroup.controls[f].enable();
                }
                this.maintenanceGeneralFormGroup.controls[f].updateValueAndValidity();
            }
        }
    };
    MaintenanceTypeGeneralComponent.prototype.updateStoreControl = function (action) {
        this.store.dispatch({
            type: ActionTypes[action],
            payload: { formGeneral: this.maintenanceGeneralFormGroup }
        });
    };
    MaintenanceTypeGeneralComponent.prototype.customerTypeCodeOnchange = function (customerTypeCode) {
        var _this = this;
        if (customerTypeCode) {
            this.queryParam.set(this.serviceConstants.Action, '0');
            this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.queryParam.set('CustomerTypeCode', customerTypeCode);
            this.queryParam.set('SICCodeEnable', this.systemParametersFromParent.systemChars.vSICCodeEnable);
            this.queryParam.set('PostDesc', 'CustomerType2');
            this.httpService.makeGetRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam).subscribe(function (data) {
                try {
                    if (data.CustomerTypeDesc)
                        _this.maintenanceGeneralFormGroup.controls['CustomerTypeDesc'].setValue(data.CustomerTypeDesc);
                    else
                        _this.maintenanceGeneralFormGroup.controls['CustomerTypeDesc'].setValue('');
                    if (data.SICCode)
                        _this.maintenanceGeneralFormGroup.controls['SICCode'].setValue(data.SICCode);
                    else
                        _this.maintenanceGeneralFormGroup.controls['SICCode'].setValue('');
                    if (data.SICDescription)
                        _this.maintenanceGeneralFormGroup.controls['SICDescription'].setValue(data.SICDescription);
                    else
                        _this.maintenanceGeneralFormGroup.controls['SICDescription'].setValue('');
                    _this.sICCodeOnchange(_this.maintenanceGeneralFormGroup.controls['SICCode'].value);
                }
                catch (error) {
                    _this.errorService.emitError(error);
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
        else {
            this.maintenanceGeneralFormGroup.controls['CustomerTypeDesc'].setValue('');
        }
    };
    MaintenanceTypeGeneralComponent.prototype.onCustomerTypeSearch = function (data) {
        if (this.systemParametersFromParent.systemChars.vSICCodeEnable) {
            this.maintenanceGeneralFormGroup.controls['CustomerTypeCode'].setValue(data.CustomerTypeCode);
            this.maintenanceGeneralFormGroup.controls['CustomerTypeDesc'].setValue(data.CustomerTypeDesc);
            this.maintenanceGeneralFormGroup.controls['SICCode'].setValue(data.SICCode);
            this.sICCodeOnchange(data.SICCode);
        }
        else {
            this.maintenanceGeneralFormGroup.controls['CustomerTypeCode'].setValue(data.CustomerTypeCode);
            this.maintenanceGeneralFormGroup.controls['CustomerTypeDesc'].setValue(data.CustomerTypeDesc);
        }
    };
    MaintenanceTypeGeneralComponent.prototype.sICCodeOnchange = function (sICCode) {
        var _this = this;
        if (sICCode) {
            this.queryParam.set(this.serviceConstants.Action, '0');
            this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.queryParam.set('SICCode', sICCode);
            this.queryParam.set('PostDesc', 'SIC');
            this.httpService.makeGetRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam).subscribe(function (data) {
                try {
                    _this.maintenanceGeneralFormGroup.controls['SICDescription'].setValue(data.SICDesc);
                }
                catch (error) {
                    _this.errorService.emitError(error);
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    MaintenanceTypeGeneralComponent.prototype.estimatedContractQuotesOnChange = function () {
        this.fieldRequired.EstimatedContractValue = false;
        if (this.maintenanceGeneralFormGroup.controls['EstimatedContractQuotes'].value && this.maintenanceGeneralFormGroup.controls['EstimatedContractQuotes'].value > 0) {
            this.fieldRequired.EstimatedContractValue = true;
            this.updateValidators();
        }
        this.calculateTotalQuotes();
    };
    MaintenanceTypeGeneralComponent.prototype.estimatedJobQuotesOnChange = function () {
        this.fieldRequired.EstimatedJobValue = false;
        if (this.maintenanceGeneralFormGroup.controls['EstimatedJobQuotes'].value && this.maintenanceGeneralFormGroup.controls['EstimatedJobQuotes'].value > 0) {
            this.fieldRequired.EstimatedJobValue = true;
        }
        this.updateValidators();
        this.calculateTotalQuotes();
    };
    MaintenanceTypeGeneralComponent.prototype.estimatedProductSaleQuotesOnChange = function () {
        this.fieldRequired.EstimatedProductSaleValue = false;
        if (this.maintenanceGeneralFormGroup.controls['EstimatedProductSaleQuotes'].value && this.maintenanceGeneralFormGroup.controls['EstimatedProductSaleQuotes'].value > 0) {
            this.fieldRequired.EstimatedProductSaleValue = true;
        }
        this.updateValidators();
        this.calculateTotalQuotes();
    };
    MaintenanceTypeGeneralComponent.prototype.estimatedContractValueOnChange = function () {
        this.fieldRequired.EstimatedContractQuotes = false;
        if (this.maintenanceGeneralFormGroup.controls['EstimatedContractValue'].value && this.maintenanceGeneralFormGroup.controls['EstimatedContractValue'].value > 0) {
            this.fieldRequired.EstimatedContractQuotes = true;
        }
        this.updateValidators();
        this.calculateTotalValues();
    };
    MaintenanceTypeGeneralComponent.prototype.estimatedJobValueOnChange = function () {
        this.fieldRequired.EstimatedJobQuotes = false;
        if (this.maintenanceGeneralFormGroup.controls['EstimatedJobValue'].value && this.maintenanceGeneralFormGroup.controls['EstimatedJobValue'].value > 0) {
            this.fieldRequired.EstimatedJobQuotes = true;
        }
        this.calculateTotalValues();
        this.updateValidators();
    };
    MaintenanceTypeGeneralComponent.prototype.estimatedProductSaleValueOnChange = function () {
        this.fieldRequired.EstimatedProductSaleQuotes = false;
        if (this.maintenanceGeneralFormGroup.controls['EstimatedProductSaleValue'].value && this.maintenanceGeneralFormGroup.controls['EstimatedProductSaleValue'].value > 0) {
            this.fieldRequired.EstimatedProductSaleQuotes = true;
        }
        this.updateValidators();
        this.calculateTotalValues();
    };
    MaintenanceTypeGeneralComponent.prototype.calculateTotalQuotes = function () {
        var total = isNaN(parseInt(this.maintenanceGeneralFormGroup.controls['EstimatedContractQuotes'].value, 10) + parseInt(this.maintenanceGeneralFormGroup.controls['EstimatedJobQuotes'].value, 10) + parseInt(this.maintenanceGeneralFormGroup.controls['EstimatedProductSaleQuotes'].value, 10)) ? 0 : parseInt(this.maintenanceGeneralFormGroup.controls['EstimatedContractQuotes'].value, 10) + parseInt(this.maintenanceGeneralFormGroup.controls['EstimatedJobQuotes'].value, 10) + parseInt(this.maintenanceGeneralFormGroup.controls['EstimatedProductSaleQuotes'].value, 10);
        this.maintenanceGeneralFormGroup.controls['EstimatedTotalQuotes'].setValue(total);
    };
    MaintenanceTypeGeneralComponent.prototype.calculateTotalValues = function () {
        var total = isNaN(parseInt(this.maintenanceGeneralFormGroup.controls['EstimatedContractValue'].value, 10) + parseInt(this.maintenanceGeneralFormGroup.controls['EstimatedJobValue'].value, 10) + parseInt(this.maintenanceGeneralFormGroup.controls['EstimatedProductSaleValue'].value, 10)) ? 0 : parseInt(this.maintenanceGeneralFormGroup.controls['EstimatedContractValue'].value, 10) + parseInt(this.maintenanceGeneralFormGroup.controls['EstimatedJobValue'].value, 10) + parseInt(this.maintenanceGeneralFormGroup.controls['EstimatedProductSaleValue'].value, 10);
        this.maintenanceGeneralFormGroup.controls['EstimatedTotalValue'].setValue(total);
    };
    MaintenanceTypeGeneralComponent.prototype.setStatuClick = function () {
        this.maintenanceGeneralFormGroup.controls['ProspectStatusCode'].setValue('11');
        this.getStatusDesc();
        this.systemParametersFromParent.systemChars['saveElement'].click();
    };
    MaintenanceTypeGeneralComponent.prototype.getStatusDesc = function () {
        var _this = this;
        var data = [{
                'table': 'ProspectStatusLang',
                'query': { 'ProspectStatusCode': this.maintenanceGeneralFormGroup.controls['ProspectStatusCode'].value },
                'fields': ['ProspectStatusDesc']
            }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
            if (e.results[0][0])
                _this.maintenanceGeneralFormGroup.controls['ProspectStatusDesc'].setValue(e.results[0][0].ProspectStatusDesc);
        });
    };
    MaintenanceTypeGeneralComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    };
    MaintenanceTypeGeneralComponent.prototype.effectiveDateSelectedValue = function (event) {
        this.maintenanceGeneralFormGroup.controls['EstimatedClosedDate'].setValue(event.value);
    };
    MaintenanceTypeGeneralComponent.prototype.minValidate = function (field) {
        if (field.value <= 0 || field.value === '') {
            return { 'invalidValue': true };
        }
        return null;
    };
    MaintenanceTypeGeneralComponent.prototype.updateGeneralData = function () {
        this.fieldVisibility.isHiddenProspectStatusCode = false;
        this.fieldRequired.ProspectStatusCode = true;
        var dateArr = this.maintenanceGeneralFormGroup.controls['EstimatedClosedDate'].value.split('/');
        this.CurrDate = new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);
        if (this.maintenanceGeneralFormGroup.controls['ProspectStatusCode'].value === '01' && this.systemParametersFromParent.systemChars.customBusinessObject.Enable === true)
            this.cmdCancelDisable = false;
        else
            this.cmdCancelDisable = true;
        this.estimatedContractQuotesOnChange();
        this.estimatedJobQuotesOnChange();
        this.estimatedProductSaleQuotesOnChange();
        this.estimatedContractValueOnChange();
        this.estimatedJobValueOnChange();
        this.estimatedProductSaleValueOnChange();
        this.updateValidators();
    };
    MaintenanceTypeGeneralComponent.prototype.ngOnInit = function () {
        this.translateService.setUpTranslation();
        this.updateStoreControl(ActionTypes.FORM_CONTROLS);
        this.disableAllGeneral();
    };
    MaintenanceTypeGeneralComponent.prototype.ngOnDestroy = function () {
        this.storeSubscription.unsubscribe();
        if (this.querySubscription)
            this.querySubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    MaintenanceTypeGeneralComponent.prototype.disableAllGeneral = function () {
        for (var c in this.maintenanceGeneralFormGroup.controls) {
            if (this.maintenanceGeneralFormGroup.controls.hasOwnProperty(c)) {
                this.maintenanceGeneralFormGroup.controls[c].disable();
            }
        }
        for (var k in this.fieldDisable) {
            if (this.fieldDisable.hasOwnProperty(k)) {
                this.fieldDisable[k] = true;
            }
        }
        this.updateDisable();
        for (var p in this.dateDisable) {
            if (this.dateDisable.hasOwnProperty(p)) {
                this.dateDisable[p] = true;
            }
        }
        this.isDisabledCustomerTypeSearch = true;
    };
    MaintenanceTypeGeneralComponent.prototype.enableAllGeneral = function () {
        for (var c in this.maintenanceGeneralFormGroup.controls) {
            if (this.maintenanceGeneralFormGroup.controls.hasOwnProperty(c)) {
                this.maintenanceGeneralFormGroup.controls[c].enable();
            }
        }
        for (var k in this.fieldDisable) {
            if (this.fieldDisable.hasOwnProperty(k) && this.disableInitial.indexOf(k) < 0) {
                this.fieldDisable[k] = false;
            }
        }
        this.updateDisable();
        for (var p in this.dateDisable) {
            if (this.dateDisable.hasOwnProperty(p)) {
                this.dateDisable[p] = false;
            }
        }
        this.isDisabledCustomerTypeSearch = false;
        this.setUI();
    };
    MaintenanceTypeGeneralComponent.prototype.resetGrneralData = function () {
        this.setUI();
    };
    MaintenanceTypeGeneralComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-maintenance-type-a',
                    templateUrl: 'maintenanceTabGeneral.html'
                },] },
    ];
    MaintenanceTypeGeneralComponent.ctorParameters = [
        { type: NgZone, },
        { type: FormBuilder, },
        { type: ActivatedRoute, },
        { type: Router, },
        { type: Store, },
        { type: Utils, },
        { type: HttpService, },
        { type: ServiceConstants, },
        { type: ErrorService, },
        { type: LocaleTranslationService, },
        { type: RiExchange, },
    ];
    return MaintenanceTypeGeneralComponent;
}());
