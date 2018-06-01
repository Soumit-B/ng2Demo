import { Component, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from './../../../../shared/services/http-service';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { ErrorService } from '../../../../shared/services/error.service';
import { Utils } from '../../../../shared/services/utility';
import { LocaleTranslationService } from '../../../../shared/services/translation.service';
import { ActionTypes } from './../../../actions/prospect';
import { RiExchange } from './../../../../shared/services/riExchange';
import { PaymentSearchComponent } from '../../../../app/internal/search/iCABSBPaymentTypeSearch';
import { EmployeeSearchComponent } from '../../../../app/internal/search/iCABSBEmployeeSearch';
import { AUPostcodeSearchComponent } from '../../../../app/internal/grid-search/iCABSAAUPostcodeSearch';
export var MaintenanceTypePremiseComponent = (function () {
    function MaintenanceTypePremiseComponent(zone, fb, route, store, serviceConstants, httpService, errorService, riExchange, translateService, utils) {
        var _this = this;
        this.zone = zone;
        this.fb = fb;
        this.route = route;
        this.store = store;
        this.serviceConstants = serviceConstants;
        this.httpService = httpService;
        this.errorService = errorService;
        this.riExchange = riExchange;
        this.translateService = translateService;
        this.utils = utils;
        this.showMessageHeader = true;
        this.queryParamsProspect = {
            action: '0',
            operation: 'ContactManagement/iCABSCMPipelineProspectMaintenance',
            module: 'prospect',
            method: 'prospect-to-contract/maintenance',
            contentType: 'application/x-www-form-urlencoded',
            branchNumber: '',
            branchName: ''
        };
        this.inputParamsForBranchSearch = {
            'parentMode': 'ProspectPipeline'
        };
        this.isBuisinessSourceUpdated = false;
        this.postcodeSearchComponent = AUPostcodeSearchComponent;
        this.inputParams = { 'parentMode': 'Contract-Search', 'ContractTypeCode': 'J', 'businessCode': 'D', 'countryCode': 'ZA' };
        this.defaultlineOfServiceOptions = '';
        this.systemParametersFromParent = { ttBusiness: [{}], systemChars: {} };
        this.defaultContractExpiryDate = new Date();
        this.defaultCommenceDate = new Date();
        this.defaultWODate = new Date();
        this.requiredList = '';
        this.isCheckedDecisionMakerInd = false;
        this.isCheckedPDALeadInd = false;
        this.showCloseButton = true;
        this.inputParamsPaymentType = { 'parentMode': 'LookUp', 'countryCode': 'ZA', 'businessCode': 'D' };
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.poscodeSearchHide = false;
        this.ellipsisDisable = {
            poscodeSearchDisable: false,
            isEmployeeSearchEllipsisDisabled: false,
            isPaymentTypeEllipsisDisabled: false
        };
        this.paymentTypeCodeComponent = PaymentSearchComponent;
        this.showHeader = true;
        this.inputParamsEmployeeSearch = { 'parentMode': 'LookUp-ProspectAssignTo', 'salesBranchNumber': 0 };
        this.inputParamsPDAEmployeeSearch = { 'parentMode': 'LookUp-PDALead' };
        this.inputParamsNegotiatingSalesEmployeeSearch = { 'parentMode': 'LookUp-NegSales' };
        this.inputParamsServiceEmployeeSearch = { 'parentMode': 'LookUp-ServiceSales' };
        this.employeeSearchComponent = EmployeeSearchComponent;
        this.inputParamsPostcode = { parentMode: 'PremiseProspect', PremisePostCode: '', PremiseAddressLine5: '', PremiseAddressLine4: '' };
        this.isSubmitClick = false;
        this.fieldVisibility = {
            'isHiddenLOSCodeSelect': false,
            'isHiddenPremiseName': false,
            'isHiddenPremiseAddressLine1': false,
            'isHiddenPremiseAddressLine2': false,
            'isHiddenPremiseAddressLine3': false,
            'isHiddenPremiseAddressLine4': false,
            'isHiddenPremiseAddressLine5': false,
            'isHiddenPremisePostcode': false,
            'isHiddenPremiseContactName': false,
            'isHiddenPremiseContactPosition': false,
            'isHiddenPremiseContactMobile': false,
            'isHiddenPremiseContactFax': false,
            'isHiddenPremiseContactEmail': false,
            'isHiddenDecisionMakerInd': false,
            'isHiddenBusinessSourceCodeSelect': false,
            'isHiddenBusinessOriginCodeSelect': false,
            'isHiddenBusinessOriginDetailCodeSelect': false,
            'isHiddenContactMediumCode': true,
            'isHiddenContactMediumDesc': false,
            'isHiddenWOStartTime': true,
            'isHiddenAssignToEmployeeCode': false,
            'isHiddenAssignToEmployeeName': false,
            'isHiddenDefaultAssigneeEmployeeDetails': false,
            'isHiddenPDALeadEmployeeCode': false,
            'isHiddenPDALeadEmployeeSurname': false,
            'isHiddenSMSMessage': true,
            'isHiddenNatAccountDetails': true,
            'isHiddencmdGetPremiseAddress': false,
            'isHiddenPremiseContactTelephone': false
        };
        this.fieldDisable = {
            BusinessSourceCodeSelect: false,
            BusinessOriginCodeSelect: false,
            BusinessOriginDetailCodeSelect: false,
            LOSCodeSelect: false,
            cmdGetPremiseAddress: true,
            isCheckedDecisionMakerInd: false,
            isDisablePDALeadInd: false
        };
        this.formfieldDisable = {
            ContactMediumDesc: true,
            AssignToEmployeeName: true,
            DefaultAssigneeEmployeeDetails: true
        };
        this.fieldReadOnly = {
            PDALeadEmployeeCode: true,
            BranchNumber: false,
            AnnualValue: false
        };
        this.fieldRequired = {
            'LOSCodeSelect': true,
            'PremiseName': false,
            'PremiseAddressLine1': false,
            'PremiseAddressLine2': false,
            'PremiseAddressLine3': false,
            'PremiseAddressLine4': false,
            'PremiseAddressLine5': false,
            'PremisePostcode': false,
            'PremiseContactName': false,
            'PremiseContactPosition': false,
            'PremiseContactMobile': false,
            'PremiseContactFax': false,
            'PremiseContactEmail': false,
            'DecisionMakerInd': false,
            'BusinessSourceCodeSelect': false,
            'BusinessOriginCodeSelect': false,
            'BusinessOriginDetailCodeSelect': false,
            'ContactMediumCode': false,
            'ContactMediumDesc': false,
            'WODate': false,
            'WOStartTime': false,
            'WOEndTime': false,
            'AssignToEmployeeCode': false,
            'AssignToEmployeeName': false,
            'DefaultAssigneeEmployeeDetails': false,
            'PDALeadEmployeeCode': false,
            'PDALeadEmployeeSurname': false,
            'SMSMessage': false,
            'CommenceDate': false,
            'ContractExpiryDate': false,
            'AnnualValue': false,
            'PaymentTypeCode': false,
            'PaymentDesc': false,
            'NegotiatingSalesEmployeeCode': false,
            'NegotiatingSalesEmployeeSurname': false,
            'BranchNumber': false,
            'BranchName': false,
            'ServicingSalesEmployeeCode': false,
            'ServicingSalesEmployeeSurname': false,
            'PremiseContactTelephone': false
        };
        this.searchModalRoute = '';
        this.storeFormData = [];
        this.lineOfServiceOptions = [{}];
        this.businessSourceCodeOptions = [{}];
        this.businessOriginDetailCodeOptions = [{}];
        this.businessOriginCodeOptions = [{}];
        this.lineOfServiceOptionsValue = '';
        this.businessSourceCodeOptionsValue = '';
        this.businessOriginCodeOptionsValue = '';
        this.businessOriginDetailCodeOptionsValue = '';
        this.queryParam = new URLSearchParams();
        this.queryLookUp = new URLSearchParams();
        this.PremiseName = 'PremiseName';
        this.maintenancePremiseFormGroup = this.fb.group({
            LOSCodeSelect: [{ value: '', disabled: false }],
            PremiseName: [{ value: '', disabled: false }],
            PremiseAddressLine1: [{ value: '', disabled: false }],
            PremiseAddressLine2: [{ value: '', disabled: false }],
            PremiseAddressLine3: [{ value: '', disabled: false }],
            PremiseAddressLine4: [{ value: '', disabled: false }],
            PremiseAddressLine5: [{ value: '', disabled: false }],
            PremisePostcode: [{ value: '', disabled: false }],
            PremiseContactName: [{ value: '', disabled: false }],
            PremiseContactPosition: [{ value: '', disabled: false }],
            PremiseContactMobile: [{ value: '', disabled: false }],
            PremiseContactFax: [{ value: '', disabled: false }],
            PremiseContactTelephone: [{ value: '', disabled: false }],
            PremiseContactEmail: [{ value: '', disabled: false }],
            DecisionMakerInd: [{ value: 'no', disabled: false }],
            BusinessSourceCodeSelect: [{ value: '', disabled: this.fieldDisable.BusinessSourceCodeSelect }],
            BusinessOriginCodeSelect: [{ value: '', disabled: this.fieldDisable.BusinessOriginCodeSelect }],
            BusinessOriginDetailCodeSelect: [{ value: '', disabled: this.fieldDisable.BusinessOriginDetailCodeSelect }],
            ContactMediumCode: [{ value: '', disabled: false }],
            ContactMediumDesc: [{ value: '', disabled: true }],
            WOStartTime: [{ value: '0', disabled: false }],
            WODate: [{ value: '', disabled: false }],
            WOEndTime: [{ value: '0', disabled: false }],
            AssignToEmployeeCode: [{ value: '', disabled: false }],
            AssignToEmployeeName: [{ value: '', disabled: true }],
            DefaultAssigneeEmployeeDetails: [{ value: '', disabled: true }],
            PDALeadEmployeeCode: [{ value: '', disabled: false }],
            PDALeadEmployeeSurname: [{ value: '', disabled: false }],
            SMSMessage: [{ value: '', disabled: false }],
            CommenceDate: [{ value: '', disabled: false }],
            ContractExpiryDate: [{ value: '', disabled: false }],
            AnnualValue: [{ value: '', disabled: false }],
            PaymentTypeCode: [{ value: '', disabled: false }],
            PaymentDesc: [{ value: '', disabled: false }],
            NegotiatingSalesEmployeeCode: [{ value: '', disabled: false }],
            NegotiatingSalesEmployeeSurname: [{ value: '', disabled: false }],
            BranchNumber: [{ value: '', disabled: false }],
            BranchName: [{ value: '', disabled: false }],
            ServicingSalesEmployeeCode: [{ value: '', disabled: false }],
            ServicingSalesEmployeeSurname: [{ value: '', disabled: false }],
            PDALeadInd: [{ value: '', disabled: false }]
        });
        this.storeSubscription = store.select('prospect').subscribe(function (data) {
            if (data['action']) {
                if (data['action'].toString() === ActionTypes.SAVE_SYSTEM_PARAMETER) {
                    _this.systemParametersFromParent['systemChars'] = data['data']['systemChars'];
                    _this.setUI();
                }
                else if (data['action'].toString() === ActionTypes.CONTROL_DEFAULT_VALUE) {
                    _this.systemParametersFromParent['ttBusiness'] = data['data'];
                    for (var _i = 0, _a = _this.systemParametersFromParent['ttBusiness']; _i < _a.length; _i++) {
                        var opt = _a[_i];
                        if (opt['value']) {
                            if (opt['text'] && opt['value'] && opt['value'] === _this.systemParametersFromParent.systemChars['gcDefaultSourceCode']) {
                                _this.BusinessSourceCodeSelectDropdown.selectedItem = opt['value'];
                                _this.maintenancePremiseFormGroup.controls['BusinessSourceCodeSelect'].setValue(opt['value']);
                                if (_this.isBuisinessSourceUpdated === false) {
                                    _this.updateBusinessOrigin();
                                    _this.isBuisinessSourceUpdated = true;
                                }
                            }
                        }
                    }
                }
                else if (data['action'].toString() === ActionTypes.EXCHANGE_METHOD) {
                    for (var _b = 0, _c = data['data']; _b < _c.length; _b++) {
                        var m = _c[_b];
                        if (_this[m]) {
                            _this[m]();
                        }
                    }
                }
                else if (data['action'].toString() === ActionTypes.PARENT_FORM) {
                    _this.parentFormData = data['data'];
                }
            }
        });
    }
    MaintenanceTypePremiseComponent.prototype.createLineOfService = function () {
        var _this = this;
        var data = [{
                'table': 'LineOfService',
                'query': { 'ValidForBusiness': this.utils.getBusinessCode(), 'countryCode': this.utils.getCountryCode() },
                'fields': ['LOSCode', 'LOSName']
            }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
            _this.lineOfServiceOptions = [];
            try {
                for (var _i = 0, _a = e.results[0]; _i < _a.length; _i++) {
                    var ls = _a[_i];
                    var newOption = { 'text': ls['LOSName'], 'value': ls['LOSCode'] };
                    _this.lineOfServiceOptions.push(newOption);
                    if (_this.maintenancePremiseFormGroup.controls['LOSCodeSelect'].value === ls['LOSCode']) {
                        _this.LOSCodeSelectDropdown.selectedItem = ls['LOSCode'];
                    }
                }
            }
            catch (err) {
            }
        });
    };
    MaintenanceTypePremiseComponent.prototype.lineOfServiceChange = function (lsObj) {
        this.lineOfServiceOptionsValue = (lsObj) ? lsObj : '';
        this.maintenancePremiseFormGroup.controls['LOSCodeSelect'].setValue(lsObj);
    };
    MaintenanceTypePremiseComponent.prototype.businessSourceCodeSelectChange = function (lsObj) {
        var _this = this;
        this.businessSourceCodeOptionsValue = (typeof lsObj !== 'undefined') ? lsObj : this.maintenancePremiseFormGroup.controls['BusinessSourceCodeSelect'].value;
        this.maintenancePremiseFormGroup.controls['BusinessSourceCodeSelect'].setValue(this.businessSourceCodeOptionsValue);
        if (this.businessSourceCodeOptionsValue) {
            this.queryParam.set(this.serviceConstants.Action, '6');
            this.queryParam.set('Function', 'BusinessSourceHasChanged');
            this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.queryParam.set('BusinessSourceCode', this.businessSourceCodeOptionsValue);
            this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.httpService.makeGetRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam).subscribe(function (data) {
                try {
                    _this.businessOriginCodeOptions = [];
                    var optionValue = data.BusinessOriginCodeList.split('\n');
                    var optionText = data.BusinessOriginDescList.split('\n');
                    var selectedIndex = 0;
                    for (var i = 0; i < optionValue.length; i++) {
                        var newOption = { 'text': optionText[i], 'value': optionValue[i] };
                        _this.businessOriginCodeOptions.push(newOption);
                        if (_this.maintenancePremiseFormGroup.controls['BusinessOriginCodeSelect'].value && _this.maintenancePremiseFormGroup.controls['BusinessOriginCodeSelect'].value === optionValue[i]) {
                            selectedIndex = i;
                        }
                    }
                    if (selectedIndex !== 0)
                        _this.BusinessOriginCodeSelectDropdown.defaultOption = { value: optionValue[selectedIndex], text: optionText[selectedIndex] };
                    _this.requiredList = data.BusinessOriginDetailRequiredList;
                    _this.businessOriginCodeSelectChange(_this.maintenancePremiseFormGroup.controls['BusinessOriginCodeSelect'].value);
                }
                catch (error) {
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    MaintenanceTypePremiseComponent.prototype.businessOriginCodeSelectChange = function (lsObj) {
        var _this = this;
        this.businessOriginCodeOptionsValue = (typeof lsObj !== 'undefined') ? lsObj : this.maintenancePremiseFormGroup.controls['BusinessOriginCodeSelect'].value;
        this.maintenancePremiseFormGroup.controls['BusinessOriginCodeSelect'].setValue(this.businessOriginCodeOptionsValue);
        if (this.businessOriginCodeOptionsValue && this.requiredList.match(new RegExp(this.businessOriginCodeOptionsValue, 'i'))) {
            this.fieldVisibility.isHiddenBusinessOriginDetailCodeSelect = false;
        }
        else {
            this.fieldVisibility.isHiddenBusinessOriginDetailCodeSelect = true;
        }
        if (!this.businessOriginCodeOptionsValue && this.systemParametersFromParent.systemChars.vSCBusinessOriginMandatory && this.isSubmitClick === true) {
            this.BusinessOriginCodeSelectDropdown.isValid = false;
        }
        else {
            this.BusinessOriginCodeSelectDropdown.isValid = true;
        }
        if (this.businessOriginCodeOptionsValue) {
            this.queryParam.set(this.serviceConstants.Action, '6');
            this.queryParam.set('Function', 'BusinessOriginHasChanged');
            this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.queryParam.set('BusinessOriginCode', this.businessOriginCodeOptionsValue);
            this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.httpService.makeGetRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam).subscribe(function (data) {
                try {
                    if (data) {
                        if (data.BusinessOriginDetailCodeList !== 'undefined') {
                            _this.businessOriginDetailCodeOptions = [];
                            var optionValue = data.BusinessOriginDetailCodeList.split('\n');
                            var optionText = data.BusinessOriginDetailDescList.split('\n');
                            var selectedIndex = 0;
                            for (var i = 0; i < optionValue.length; i++) {
                                var newOption = { 'text': optionText[i], 'value': optionValue[i] };
                                _this.businessOriginDetailCodeOptions.push(newOption);
                            }
                            _this.BusinessOriginDetailCodeSelectDropdown.selectedItem = _this.maintenancePremiseFormGroup.controls['BusinessOriginDetailCodeSelect'].value;
                            if (_this.systemParametersFromParent.systemChars.routeParams) {
                                if (_this.systemParametersFromParent.systemChars.customBusinessObject.Update === false) {
                                    _this.maintenancePremiseFormGroup.controls['ContactMediumCode'].setValue(data.ContactMediumCode);
                                    _this.populateContactDesc();
                                    _this.contactMediumCodeOnchange();
                                }
                            }
                            if (data.LeadInd === 'Y') {
                                _this.fieldVisibility.isHiddenPDALeadEmployeeCode = false;
                            }
                            else {
                                _this.fieldVisibility.isHiddenPDALeadEmployeeCode = true;
                            }
                        }
                        else {
                        }
                    }
                }
                catch (error) {
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    MaintenanceTypePremiseComponent.prototype.updateBusinessOrigin = function () {
        this.businessSourceCodeSelectChange(this.maintenancePremiseFormGroup.controls['BusinessSourceCodeSelect'].value);
    };
    MaintenanceTypePremiseComponent.prototype.businessOriginDetailCodeSelectChange = function (lsObj) {
        this.businessOriginDetailCodeOptionsValue = '';
        if (lsObj)
            this.businessOriginDetailCodeOptionsValue = (lsObj.replace(/[\n\r\s]+/g, '') !== '') ? lsObj : this.maintenancePremiseFormGroup.controls['BusinessOriginDetailCodeSelect'].value;
        this.maintenancePremiseFormGroup.controls['BusinessOriginDetailCodeSelect'].setValue(this.businessOriginDetailCodeOptionsValue);
        this.BusinessOriginDetailCodeSelectDropdown.selectedItem = this.businessOriginDetailCodeOptionsValue;
    };
    MaintenanceTypePremiseComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    };
    MaintenanceTypePremiseComponent.prototype.setUI = function () {
        this.poscodeSearchHide = !((this.systemParametersFromParent.systemChars.vSCEnableHopewiserPAF || this.systemParametersFromParent.systemChars.vSCEnableDatabasePAF));
        this.fieldDisable.BusinessSourceCodeSelect = false;
        this.fieldDisable.BusinessOriginCodeSelect = false;
        this.fieldDisable.BusinessOriginDetailCodeSelect = false;
        this.fieldDisable.LOSCodeSelect = false;
        this.fieldDisable.cmdGetPremiseAddress = true;
        if (!this.systemParametersFromParent.systemChars.vSCEnableHopewiserPAF && !this.systemParametersFromParent.systemChars.vSCEnableDatabasePAF) {
            this.fieldVisibility.isHiddencmdGetPremiseAddress = true;
        }
        if (this.systemParametersFromParent.systemChars.vSCEnableAddressLine3) {
            this.fieldVisibility.isHiddenPremiseAddressLine3 = false;
        }
        else {
            this.fieldVisibility.isHiddenPremiseAddressLine3 = true;
        }
        this.fieldRequired['PremiseName'] = true;
        this.fieldRequired['PremiseAddressLine1'] = true;
        this.fieldRequired['PremiseAddressLine4'] = true;
        if (this.systemParametersFromParent.systemChars.vSCEnableAddressLine3) {
            this.fieldRequired['PremiseAddressLine3'] = true;
        }
        else {
            this.fieldRequired['PremiseAddressLine3'] = false;
        }
        if (this.systemParametersFromParent.systemChars.vSCAddressLine5Required) {
            this.fieldRequired['PremiseAddressLine5'] = true;
        }
        else {
            this.fieldRequired['PremiseAddressLine5'] = false;
        }
        this.fieldRequired['PremisePostcode'] = true;
        this.fieldRequired['PremiseContactName'] = true;
        this.fieldRequired['PremiseContactPosition'] = true;
        this.fieldRequired['PremiseContactTelephone'] = true;
        if (this.systemParametersFromParent.systemChars.vSCBusinessOriginMandatory) {
            this.fieldRequired['BusinessOriginCodeSelect'] = true;
        }
        else {
            this.fieldRequired['BusinessOriginCodeSelect'] = false;
        }
        if (this.systemParametersFromParent.systemChars.vSCHideContactMediumCode) {
            this.fieldRequired['ContactMediumCode'] = false;
            this.fieldVisibility.isHiddenContactMediumCode = true;
        }
        else {
            this.fieldRequired['ContactMediumCode'] = true;
            this.fieldVisibility.isHiddenContactMediumCode = false;
        }
        if (this.systemParametersFromParent.systemChars.currentURL.match(new RegExp('Prospect', 'i'))) {
            this.fieldRequired.ServicingSalesEmployeeCode = true;
            this.fieldRequired.AssignToEmployeeCode = true;
            this.fieldReadOnly.AnnualValue = true;
            this.fieldVisibility.isHiddenAssignToEmployeeCode = false;
            this.fieldVisibility.isHiddenPDALeadEmployeeCode = true;
        }
        else if (this.systemParametersFromParent.systemChars.currentURL.match(new RegExp('NatAxJob', 'i'))) {
            this.fieldVisibility.isHiddenAssignToEmployeeCode = true;
            this.fieldVisibility.isHiddenPDALeadEmployeeCode = true;
        }
        else {
            this.fieldReadOnly.BranchNumber = true;
            this.fieldVisibility.isHiddenAssignToEmployeeCode = true;
            this.fieldVisibility.isHiddenPDALeadEmployeeCode = true;
        }
        var parentMode = this.riExchange.ParentMode(this.systemParametersFromParent.systemChars.routeParams);
        if (parentMode === 'CallCentreSearchNew') {
            this.maintenancePremiseFormGroup.controls['PremiseName'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallAddressName'));
            if (!this.maintenancePremiseFormGroup.controls['PremiseName'].value) {
                this.maintenancePremiseFormGroup.controls['PremiseName'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallContactName'));
            }
            this.maintenancePremiseFormGroup.controls['PremiseAddressLine1'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallAddressLine1'));
            this.maintenancePremiseFormGroup.controls['PremiseAddressLine2'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallAddressLine2'));
            this.maintenancePremiseFormGroup.controls['PremiseAddressLine3'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallAddressLine3'));
            this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallAddressLine4'));
            this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallAddressLine5'));
            this.maintenancePremiseFormGroup.controls['PremisePostcode'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallContactPostcode'));
            this.premiseContainer.nativeElement.querySelector('#PremiseName').focus();
        }
        else if (parentMode === 'CallCentreSearchNewExisting') {
            this.maintenancePremiseFormGroup.controls['PremiseContactName'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallContactName'));
            this.maintenancePremiseFormGroup.controls['PremiseContactPosition'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallContactPosition'));
            this.maintenancePremiseFormGroup.controls['PremiseContactTelephone'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallContactTelephone'));
            this.maintenancePremiseFormGroup.controls['PremiseContactMobile'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallContactMobile'));
            this.maintenancePremiseFormGroup.controls['PremiseContactFax'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallContactFax'));
            this.maintenancePremiseFormGroup.controls['PremiseContactEmail'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallContactEmail'));
            this.maintenancePremiseFormGroup.controls['Narrative'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallNotepad'));
            this.maintenancePremiseFormGroup.controls['BusinessOriginCode'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'BusinessOriginCode'));
            this.maintenancePremiseFormGroup.controls['ContactMediumCode'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'ContactMediumCode'));
            this.maintenancePremiseFormGroup.controls['ContactMediumDesc'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'ContactMediumDesc'));
            this.contactMediumCodeOnchange();
        }
        if (parentMode === 'CallCentreSearchNew' || parentMode === 'CallCentreSearchNewExisting') {
            if (this.parentFormData.controls['PremiseNumber'].value === '') {
                this.maintenancePremiseFormGroup.controls['PremiseName'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallAddressName'));
                if (!this.maintenancePremiseFormGroup.controls['PremiseName'].value) {
                    this.maintenancePremiseFormGroup.controls['PremiseName'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallContactName'));
                }
                this.maintenancePremiseFormGroup.controls['PremisePostcode'].setValue(this.riExchange.GetParentHTMLInputValue(this.systemParametersFromParent.ystemChars.routeParams, 'CallContactPostcode'));
            }
            if (!this.maintenancePremiseFormGroup.controls['PremisePostcode'].value) {
                this.postcodeValidate();
            }
        }
        this.updateValidators();
        this.disableAllPremise();
    };
    MaintenanceTypePremiseComponent.prototype.postcodeValidate = function () {
        var _this = this;
        this.queryParam.set(this.serviceConstants.Action, '6');
        this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParam.set('PremisePostcode', this.maintenancePremiseFormGroup.controls['PremisePostcode'].value);
        if (this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].value)
            this.queryParam.set('PremiseAddressLine4', this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].value);
        if (this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].value)
            this.queryParam.set('PremiseAddressLine5', this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].value);
        if (this.maintenancePremiseFormGroup.controls['LOSCodeSelect'].value)
            this.queryParam.set('LOSCode', this.maintenancePremiseFormGroup.controls['LOSCodeSelect'].value);
        this.queryParam.set('Function', 'GetAssignToSalesDetails');
        this.BusinessOriginDetailCodeSelectDropdown.selectedItem = this.maintenancePremiseFormGroup.controls['BusinessOriginDetailCodeSelect'].value;
        this.httpService.makeGetRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam).subscribe(function (data) {
            try {
                if (!data.errorMessage) {
                    if (_this.maintenancePremiseFormGroup.controls['AssignToEmployeeCode'].value === '')
                        _this.maintenancePremiseFormGroup.controls['AssignToEmployeeCode'].setValue(data.ServicingSalesEmployeeCode);
                    if (_this.maintenancePremiseFormGroup.controls['AssignToEmployeeName'].value === '')
                        _this.maintenancePremiseFormGroup.controls['AssignToEmployeeName'].setValue(data.AssignToEmployeeName);
                    if (_this.maintenancePremiseFormGroup.controls['DefaultAssigneeEmployeeDetails'].value === '')
                        _this.maintenancePremiseFormGroup.controls['DefaultAssigneeEmployeeDetails'].setValue(data.DefaultAssigneeEmployeeDetails);
                    if (_this.maintenancePremiseFormGroup.controls['ServicingSalesEmployeeCode'].value === '')
                        _this.maintenancePremiseFormGroup.controls['ServicingSalesEmployeeCode'].setValue(data.ServicingSalesEmployeeCode);
                    _this.systemParametersFromParent.systemChars.SalesBranchNumber = data.SalesBranchNumber;
                    if (data.SalesBranchNumber)
                        _this.inputParamsEmployeeSearch.salesBranchNumber = data.SalesBranchNumber;
                    else
                        _this.inputParamsEmployeeSearch.salesBranchNumber = 0;
                    _this.employeeSearchEllipsis.updateComponent();
                    _this.systemParametersFromParent.systemChars.ContactRedirectionUniqueID = data.ContactRedirectionUniqueID;
                    _this.systemParametersFromParent.systemChars.DefaultAssigneeEmployeeCode = data.DefaultAssigneeEmployeeCode;
                    _this.maintenancePremiseFormGroup.controls['BranchNumber'].setValue(data.BranchNumber);
                }
            }
            catch (error) {
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    MaintenanceTypePremiseComponent.prototype.premisePostcodeOnchange = function (premisePostCode) {
        var _this = this;
        this.inputParamsPostcode = {
            parentMode: 'PremiseProspect',
            PremisePostCode: this.maintenancePremiseFormGroup.controls['PremisePostcode'].value,
            PremiseAddressLine5: this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].value,
            PremiseAddressLine4: this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].value
        };
        this.postcodeSearchEllipsis.childConfigParams = this.inputParamsPostcode;
        this.postcodeSearchEllipsis.updateComponent();
        if (premisePostCode && this.systemParametersFromParent.systemChars.vSCEnableDatabasePAF && this.systemParametersFromParent.systemChars.vSCEnablePostcodeDefaulting) {
            this.queryParam.set(this.serviceConstants.Action, '0');
            this.queryParam.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.queryParam.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.queryParam.set('Postcode', premisePostCode);
            this.queryParam.set('Town', this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].value);
            this.queryParam.set('State', this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].value);
            this.queryParam.set('Function', 'GetPostCodeTownAndState');
            this.httpService.makeGetRequest(this.queryParamsProspect.method, this.queryParamsProspect.module, this.queryParamsProspect.operation, this.queryParam).subscribe(function (data) {
                try {
                    if (data.UniqueRecordFound === 'yes') {
                        _this.postcodeSearchEllipsis.childConfigParams = _this.inputParamsPostcode;
                        _this.postcodeSearchEllipsis.openModal();
                    }
                    else {
                        _this.maintenancePremiseFormGroup.controls['PremisePostcode'].setValue(data.Postcode);
                        _this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].setValue(data.Town);
                        _this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].setValue(data.State);
                    }
                    _this.postcodeValidate();
                }
                catch (error) {
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    MaintenanceTypePremiseComponent.prototype.premiseNameOnchange = function () {
        if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
            this.maintenancePremiseFormGroup.controls['PremiseName'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseName'].value));
        }
        if (this.systemParametersFromParent.systemChars.customBusinessObject.Update === false) {
            if (this.systemParametersFromParent.systemChars.vSCRunPAFSearchOn1stAddressLine && (this.systemParametersFromParent.systemChars.vSCEnableHopewiserPAF || this.systemParametersFromParent.systemChars.vSCEnableDatabasePAF)) {
                this.onGetPremiseAddressClick();
            }
        }
    };
    MaintenanceTypePremiseComponent.prototype.premiseAddressLine4Onfocusout = function () {
        if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
            this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].value));
        }
        if (this.systemParametersFromParent.systemChars.vSCAddressLine4Required && this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].value === '' && this.systemParametersFromParent.systemChars.SystemCharEnableValidatePostcodeSuburb)
            this.onGetPremiseAddressClick();
    };
    MaintenanceTypePremiseComponent.prototype.premiseAddressLine5onfocusout = function () {
        if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
            this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].value));
        }
        if (this.systemParametersFromParent.systemChars.vSCAddressLine5Required && this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].value === '' && this.systemParametersFromParent.systemChars.SystemCharEnableValidatePostcodeSuburb)
            this.onGetPremiseAddressClick();
    };
    MaintenanceTypePremiseComponent.prototype.premisePostcodeOnfocusout = function () {
        if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
            this.maintenancePremiseFormGroup.controls['PremisePostcode'].setValue(this.maintenancePremiseFormGroup.controls['PremisePostcode'].value.toUpperCase());
        }
        if (this.systemParametersFromParent.systemChars.vSCPostCodeRequired && this.maintenancePremiseFormGroup.controls['PremisePostcode'].value === '')
            this.onGetPremiseAddressClick();
    };
    MaintenanceTypePremiseComponent.prototype.premiseAddressLine2Onfocusout = function () {
        if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
            this.maintenancePremiseFormGroup.controls['PremiseAddressLine2'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseAddressLine2'].value));
        }
    };
    MaintenanceTypePremiseComponent.prototype.premiseAddressLine1Onfocusout = function () {
        if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
            this.maintenancePremiseFormGroup.controls['PremiseAddressLine1'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseAddressLine1'].value));
        }
    };
    MaintenanceTypePremiseComponent.prototype.premiseAddressLine3Onfocusout = function () {
        if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
            this.maintenancePremiseFormGroup.controls['PremiseAddressLine3'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseAddressLine3'].value));
        }
    };
    MaintenanceTypePremiseComponent.prototype.premiseContactPositiononfocusout = function () {
        if (!this.systemParametersFromParent.systemChars.vSCCapitalFirstLtr) {
            this.maintenancePremiseFormGroup.controls['PremiseContactName'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseContactName'].value));
            this.maintenancePremiseFormGroup.controls['PremiseContactPosition'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseContactPosition'].value));
            this.maintenancePremiseFormGroup.controls['PremiseContactTelephone'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseContactTelephone'].value));
            this.maintenancePremiseFormGroup.controls['PremiseContactMobile'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseContactMobile'].value));
            this.maintenancePremiseFormGroup.controls['PremiseContactFax'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseContactFax'].value));
            this.maintenancePremiseFormGroup.controls['PremiseContactEmail'].setValue(this.utils.capitalizeFirstLetter(this.maintenancePremiseFormGroup.controls['PremiseContactEmail'].value));
        }
    };
    MaintenanceTypePremiseComponent.prototype.updateValidators = function () {
        for (var f in this.fieldRequired) {
            if (this.fieldRequired.hasOwnProperty(f)) {
                if (this.maintenancePremiseFormGroup.controls[f]) {
                    if (this.fieldRequired[f])
                        this.maintenancePremiseFormGroup.controls[f].setValidators([Validators.required]);
                    else
                        this.maintenancePremiseFormGroup.controls[f].clearValidators();
                    this.maintenancePremiseFormGroup.controls[f].updateValueAndValidity();
                }
            }
        }
    };
    MaintenanceTypePremiseComponent.prototype.contactMediumCodeOnchange = function () {
        if (this.systemParametersFromParent.systemChars.customBusinessObject.Update === false) {
            if (this.maintenancePremiseFormGroup.controls['ContactMediumCode'].value !== '' && this.systemParametersFromParent.systemChars.vEnterWORefsList.indexOf('#' + this.maintenancePremiseFormGroup.controls['ContactMediumCode'].value.toLowerCase() + '#') >= 0) {
                this.maintenancePremiseFormGroup.controls['WODate'].setValue(new Date());
                this.defaultWODate = new Date();
                this.maintenancePremiseFormGroup.controls['WOStartTime'].setValue('00:00');
                this.maintenancePremiseFormGroup.controls['WOEndTime'].setValue('00:00');
                this.fieldVisibility.isHiddenWOStartTime = false;
                this.fieldRequired.WODate = true;
                this.fieldRequired.WOStartTime = true;
                this.fieldRequired.WOStartTime = true;
            }
            else {
                this.fieldVisibility.isHiddenWOStartTime = true;
                this.fieldRequired.WODate = false;
                this.fieldRequired.WOStartTime = false;
                this.fieldRequired.WOStartTime = false;
            }
            this.updateValidators();
        }
    };
    MaintenanceTypePremiseComponent.prototype.onGetPremiseAddressClick = function () {
        if (this.systemParametersFromParent.systemChars.vSCEnableDatabasePAF) {
            this.inputParamsPostcode = {
                parentMode: 'PremiseProspect',
                PremisePostCode: this.maintenancePremiseFormGroup.controls['PremisePostcode'].value,
                PremiseAddressLine5: this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].value,
                PremiseAddressLine4: this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].value
            };
            this.postcodeSearchEllipsis.childConfigParams = this.inputParamsPostcode;
            this.postcodeSearchEllipsis.openModal();
        }
        else if (this.systemParametersFromParent.systemChars.vSCEnableHopewiserPAF) {
            this.messageModal.show({ msg: 'Screen is yet not developed', title: 'Message' }, false);
        }
    };
    MaintenanceTypePremiseComponent.prototype.onPremisePostcodeDataReturn = function (data) {
        this.maintenancePremiseFormGroup.controls['PremisePostcode'].setValue(data.PremisePostcode);
        this.maintenancePremiseFormGroup.controls['PremiseAddressLine4'].setValue(data.PremiseAddressLine4);
        this.maintenancePremiseFormGroup.controls['PremiseAddressLine5'].setValue(data.PremiseAddressLine5);
        this.premisePostcodeOnchange(data.PremisePostcode);
    };
    MaintenanceTypePremiseComponent.prototype.decisionMakerIndOnChange = function (checkedValue) {
        if (checkedValue) {
            this.maintenancePremiseFormGroup.controls['DecisionMakerInd'].setValue('yes');
        }
        else {
            this.maintenancePremiseFormGroup.controls['DecisionMakerInd'].setValue('no');
        }
    };
    MaintenanceTypePremiseComponent.prototype.updatePremiseData = function () {
        if (this.systemParametersFromParent.systemChars.customBusinessObject.Enable === true) {
            this.beforeUpdate();
            this.defaultCommenceDate = this.maintenancePremiseFormGroup.controls['CommenceDate'].value;
            this.defaultCommenceDate = (this.maintenancePremiseFormGroup.controls['CommenceDate'].value) ? new Date(this.maintenancePremiseFormGroup.controls['CommenceDate'].value) : new Date();
            this.defaultContractExpiryDate = (this.maintenancePremiseFormGroup.controls['ContractExpiryDate'].value) ? new Date(this.maintenancePremiseFormGroup.controls['ContractExpiryDate'].value) : new Date();
            this.BusinessSourceCodeSelectDropdown.selectedItem = (this.maintenancePremiseFormGroup.controls['BusinessSourceCodeSelect'].value !== '') ? this.maintenancePremiseFormGroup.controls['BusinessSourceCodeSelect'].value : this.systemParametersFromParent.systemChars['gcDefaultSourceCode'];
            this.BusinessOriginCodeSelectDropdown.selectedItem = this.maintenancePremiseFormGroup.controls['BusinessOriginCodeSelect'].value;
            this.BusinessOriginDetailCodeSelectDropdown.selectedItem = this.maintenancePremiseFormGroup.controls['BusinessOriginDetailCodeSelect'].value;
            this.LOSCodeSelectDropdown.selectedItem = this.maintenancePremiseFormGroup.controls['LOSCodeSelect'].value;
            this.fieldDisable.cmdGetPremiseAddress = false;
            if (this.maintenancePremiseFormGroup.controls['BusinessSourceCodeSelect'].value === '') {
                this.businessSourceCodeSelectChange(this.systemParametersFromParent.systemChars['gcDefaultSourceCode']);
            }
            if (this.maintenancePremiseFormGroup.controls['DecisionMakerInd'].value === 'yes') {
                this.isCheckedDecisionMakerInd = true;
            }
            else {
                this.isCheckedDecisionMakerInd = null;
            }
            if (this.maintenancePremiseFormGroup.controls['PDALeadEmployeeCode'].value === '') {
                this.isCheckedPDALeadInd = false;
            }
            else {
                this.isCheckedPDALeadInd = true;
            }
            this.premisePostcodeOnchange(this.maintenancePremiseFormGroup.controls['PremisePostcode'].value);
        }
    };
    MaintenanceTypePremiseComponent.prototype.commenceDateSelectedValue = function (Obj) {
        if (Obj && Obj.value)
            this.maintenancePremiseFormGroup.controls['CommenceDate'].setValue(Obj.value);
    };
    MaintenanceTypePremiseComponent.prototype.exppiryDateSelectedValue = function (Obj) {
        if (Obj && Obj.value)
            this.maintenancePremiseFormGroup.controls['ContractExpiryDate'].setValue(Obj.value);
    };
    MaintenanceTypePremiseComponent.prototype.wODateSelectedValue = function (Obj) {
        if (Obj && Obj.value)
            this.maintenancePremiseFormGroup.controls['WODate'].setValue(Obj.value);
    };
    MaintenanceTypePremiseComponent.prototype.updateStoreControl = function (action) {
        this.store.dispatch({
            type: ActionTypes[action],
            payload: { formPremise: this.maintenancePremiseFormGroup }
        });
    };
    MaintenanceTypePremiseComponent.prototype.onBranchDataReceived = function (data) {
        this.maintenancePremiseFormGroup.controls['BranchNumber'].setValue(data.BranchNumber);
        this.maintenancePremiseFormGroup.controls['BranchName'].setValue(data.BranchName);
        this.inputParamsEmployeeSearch.branchNumber = this.maintenancePremiseFormGroup.controls['BranchNumber'].value;
        this.employeeSearchEllipsis.updateComponent();
    };
    MaintenanceTypePremiseComponent.prototype.onPaymentTypeDataReceived = function (data) {
        this.maintenancePremiseFormGroup.controls['PaymentTypeCode'].setValue(data.PaymentTypeCode);
        this.maintenancePremiseFormGroup.controls['PaymentDesc'].setValue(data.PaymentDesc);
    };
    MaintenanceTypePremiseComponent.prototype.onAssignEmployeeDataReceived = function (data) {
        this.maintenancePremiseFormGroup.controls['AssignToEmployeeCode'].setValue(data.AssignToEmployeeCode);
        this.maintenancePremiseFormGroup.controls['AssignToEmployeeName'].setValue(data.AssignToEmployeeName);
        this.maintenancePremiseFormGroup.controls['ServicingSalesEmployeeCode'].setValue(data.AssignToEmployeeCode);
        this.maintenancePremiseFormGroup.controls['ServicingSalesEmployeeSurname'].setValue(data.AssignToEmployeeName);
    };
    MaintenanceTypePremiseComponent.prototype.setServicingEmployee = function () {
        this.maintenancePremiseFormGroup.controls['ServicingSalesEmployeeCode'].setValue(this.maintenancePremiseFormGroup.controls['AssignToEmployeeCode'].value);
    };
    MaintenanceTypePremiseComponent.prototype.onServicePDAEmployeeDataReceived = function (data) {
        this.maintenancePremiseFormGroup.controls['PDALeadEmployeeCode'].setValue(data.PDALeadEmployeeCode);
        this.maintenancePremiseFormGroup.controls['PDALeadEmployeeSurname'].setValue(data.PDALeadEmployeeSurname);
    };
    MaintenanceTypePremiseComponent.prototype.onEmployeeNegotiatingSalesDataReceived = function (data) {
        this.maintenancePremiseFormGroup.controls['NegotiatingSalesEmployeeCode'].setValue(data.NegotiatingSalesEmployeeCode);
        this.maintenancePremiseFormGroup.controls['NegotiatingSalesEmployeeSurname'].setValue(data.NegotiatingSalesEmployeeSurname);
    };
    MaintenanceTypePremiseComponent.prototype.onServiceEmployeeDataReceived = function (data) {
        this.maintenancePremiseFormGroup.controls['ServicingSalesEmployeeCode'].setValue(data.ContractOwner);
        this.maintenancePremiseFormGroup.controls['ServicingSalesEmployeeSurname'].setValue(data.ContractOwnerSurname);
    };
    MaintenanceTypePremiseComponent.prototype.populateContactDesc = function () {
        var _this = this;
        var data = [{
                'table': 'ContactMediumLang',
                'query': { 'ContactMediumCode': this.maintenancePremiseFormGroup.controls['ContactMediumCode'].value },
                'fields': ['ContactMediumDesc']
            }];
        this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
            if (e.results[0][0])
                _this.maintenancePremiseFormGroup.controls['ContactMediumDesc'].setValue(e.results[0][0].ContactMediumDesc);
        });
        this.contactMediumCodeOnchange();
    };
    MaintenanceTypePremiseComponent.prototype.ngOnInit = function () {
        this.translateService.setUpTranslation();
        this.createLineOfService();
        this.storeFormData.push({ formP: this.maintenancePremiseFormGroup });
        this.updateStoreControl(ActionTypes.FORM_CONTROLS);
        this.inputParamsPaymentType.countryCode = this.utils.getCountryCode();
        this.inputParamsPaymentType.businessCode = this.utils.getBusinessCode();
    };
    MaintenanceTypePremiseComponent.prototype.ngAfterViewInit = function () {
    };
    MaintenanceTypePremiseComponent.prototype.ngOnDestroy = function () {
        this.storeSubscription.unsubscribe();
        if (this.querySubscription)
            this.querySubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    MaintenanceTypePremiseComponent.prototype.resetPremiseData = function () {
        this.LOSCodeSelectDropdown.selectedItem = this.lineOfServiceOptions[0].value;
        this.BusinessSourceCodeSelectDropdown.selectedItem = this.systemParametersFromParent.systemChars['gcDefaultSourceCode'];
        this.isCheckedDecisionMakerInd = null;
        this.maintenancePremiseFormGroup.controls['LOSCodeSelect'].setValue(this.lineOfServiceOptions[0].value);
        this.maintenancePremiseFormGroup.controls['BusinessSourceCodeSelect'].setValue(this.systemParametersFromParent.systemChars['gcDefaultSourceCode']);
        this.maintenancePremiseFormGroup.controls['DecisionMakerInd'].setValue('no');
        this.updateBusinessOrigin();
    };
    MaintenanceTypePremiseComponent.prototype.disableAllPremise = function () {
        for (var c in this.maintenancePremiseFormGroup.controls) {
            if (this.maintenancePremiseFormGroup.controls.hasOwnProperty(c)) {
                this.maintenancePremiseFormGroup.controls[c].disable();
            }
        }
        for (var k in this.fieldDisable) {
            if (this.fieldDisable.hasOwnProperty(k)) {
                this.fieldDisable[k] = true;
            }
        }
        for (var p in this.ellipsisDisable) {
            if (this.ellipsisDisable.hasOwnProperty(p)) {
                this.ellipsisDisable[p] = true;
            }
        }
    };
    MaintenanceTypePremiseComponent.prototype.enableAllPremise = function () {
        for (var c in this.maintenancePremiseFormGroup.controls) {
            if (this.maintenancePremiseFormGroup.controls.hasOwnProperty(c)) {
                if (c !== 'ContactMediumDesc' && c !== 'AssignToEmployeeName' && c !== 'DefaultAssigneeEmployeeDetails')
                    this.maintenancePremiseFormGroup.controls[c].enable();
            }
        }
        for (var k in this.fieldDisable) {
            if (this.fieldDisable.hasOwnProperty(k)) {
                this.fieldDisable[k] = false;
            }
        }
        for (var p in this.ellipsisDisable) {
            if (this.ellipsisDisable.hasOwnProperty(p)) {
                this.ellipsisDisable[p] = false;
            }
        }
    };
    MaintenanceTypePremiseComponent.prototype.beforeUpdate = function () {
        if (this.systemParametersFromParent.systemChars.customBusinessObject.Enable === true) {
            var currentURL = window.location.href;
            if (currentURL.match(new RegExp('Prospect', 'i'))) {
                this.maintenancePremiseFormGroup.controls['AssignToEmployeeCode'].disable();
                this.fieldDisable.isDisablePDALeadInd = false;
                if (this.isCheckedPDALeadInd) {
                    this.fieldDisable.isDisablePDALeadInd = true;
                    this.maintenancePremiseFormGroup.controls['PDALeadEmployeeCode'].enable();
                    this.fieldRequired.PDALeadEmployeeCode = true;
                }
            }
            else {
                this.maintenancePremiseFormGroup.controls['AssignToEmployeeCode'].enable();
            }
            this.fieldDisable.LOSCodeSelect = true;
            this.updateValidators();
        }
    };
    MaintenanceTypePremiseComponent.prototype.addInvalidClass = function () {
        this.isSubmitClick = true;
        if (!this.businessOriginCodeOptionsValue && this.systemParametersFromParent.systemChars.vSCBusinessOriginMandatory && this.isSubmitClick === true) {
            this.BusinessOriginCodeSelectDropdown.isValid = false;
        }
        else {
            this.BusinessOriginCodeSelectDropdown.isValid = true;
        }
    };
    MaintenanceTypePremiseComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-maintenance-type-b',
                    templateUrl: 'maintenanceTabPremise.html'
                },] },
    ];
    MaintenanceTypePremiseComponent.ctorParameters = [
        { type: NgZone, },
        { type: FormBuilder, },
        { type: ActivatedRoute, },
        { type: Store, },
        { type: ServiceConstants, },
        { type: HttpService, },
        { type: ErrorService, },
        { type: RiExchange, },
        { type: LocaleTranslationService, },
        { type: Utils, },
    ];
    MaintenanceTypePremiseComponent.propDecorators = {
        'LOSCodeSelectDropdown': [{ type: ViewChild, args: ['LOSCodeSelectDropdown',] },],
        'BusinessOriginCodeSelectDropdown': [{ type: ViewChild, args: ['BusinessOriginCodeSelectDropdown',] },],
        'BusinessSourceCodeSelectDropdown': [{ type: ViewChild, args: ['BusinessSourceCodeSelectDropdown',] },],
        'BusinessOriginDetailCodeSelectDropdown': [{ type: ViewChild, args: ['BusinessOriginDetailCodeSelectDropdown',] },],
        'BranchNumberDropdwon': [{ type: ViewChild, args: ['BranchNumberDropdwon',] },],
        'premiseContainer': [{ type: ViewChild, args: ['premiseContainer',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'employeeSearchEllipsis': [{ type: ViewChild, args: ['employeeSearchEllipsis',] },],
        'postcodeSearchEllipsis': [{ type: ViewChild, args: ['postcodeSearchEllipsis',] },],
    };
    return MaintenanceTypePremiseComponent;
}());
