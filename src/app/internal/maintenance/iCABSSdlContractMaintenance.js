var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { EmployeeSearchComponent } from './../search/iCABSBEmployeeSearch';
import { PaymentSearchComponent } from './../search/iCABSBPaymentTypeSearch';
import { InvoiceFrequencySearchComponent } from './../search/iCABSBBusinessInvoiceFrequencySearch';
import { PageIdentifier } from '../../base/PageIdentifier';
import { Component, ViewChild, Injector } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { AccountSearchComponent } from '../search/iCABSASAccountSearch';
export var DlContractMaintenanceComponent = (function (_super) {
    __extends(DlContractMaintenanceComponent, _super);
    function DlContractMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.showMessageHeaderSave = true;
        this.showMessageHeader = true;
        this.showPromptMessageHeader = true;
        this.inputParamsContractDuration = {
            parentMode: 'LookUp-Contract',
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode()
        };
        this.contractDurationActive = {
            'id': '',
            'text': ''
        };
        this.pageId = '';
        this.controls = [
            { name: 'dlContractRef', readonly: false, disabled: false, required: false },
            { name: 'ContractTypeCode', readonly: false, disabled: false, required: false },
            { name: 'dlStatusCode', readonly: false, disabled: false, required: false },
            { name: 'dlStatusDesc', readonly: false, disabled: false, required: false },
            { name: 'ClientTypeValue1', readonly: false, disabled: false, required: false },
            { name: 'ClientTypeValue2', readonly: false, disabled: false, required: false },
            { name: 'ContractName', readonly: false, disabled: false, required: true },
            { name: 'ContractAddressLine1', readonly: false, disabled: false, required: true },
            { name: 'ContractAddressLine2', readonly: false, disabled: false, required: false },
            { name: 'ContractAddressLine3', readonly: false, disabled: false, required: false },
            { name: 'ContractAddressLine4', readonly: false, disabled: false, required: false },
            { name: 'ContractAddressLine5', readonly: false, disabled: false, required: true },
            { name: 'ContractPostcode', readonly: false, disabled: false, required: true },
            { name: 'ContractContactName', readonly: false, disabled: false, required: true },
            { name: 'ContractContactPosition', readonly: false, disabled: false, required: true },
            { name: 'DecisionMakerInd', readonly: false, disabled: false, required: false },
            { name: 'ContractContactMobile', readonly: false, disabled: false, required: false },
            { name: 'ContractContactTelephone', readonly: false, disabled: false, required: true },
            { name: 'ContractContactFax', readonly: false, disabled: false, required: false },
            { name: 'ContractContactEmail', readonly: false, disabled: false, required: false },
            { name: 'ContractCommenceDate', readonly: false, disabled: false, required: true },
            { name: 'ContinuousInd', readonly: false, disabled: false, required: false },
            { name: 'RenewalInd', readonly: false, disabled: false, required: false },
            { name: 'ContractExpiryDate', readonly: false, disabled: false, required: false },
            { name: 'InvoiceFrequencyCode', readonly: false, disabled: false, required: false },
            { name: 'InvoiceFrequencyDesc', readonly: false, disabled: false, required: false },
            { name: 'CreditReference', readonly: false, disabled: false, required: false },
            { name: 'AccountNumber', readonly: false, disabled: false, required: false },
            { name: 'AccountName', readonly: false, disabled: false, required: false },
            { name: 'GroupAccountNumber', readonly: false, disabled: false, required: false },
            { name: 'GroupName', readonly: false, disabled: false, required: false },
            { name: 'GroupAccountPriceGroupID', readonly: false, disabled: false, required: false },
            { name: 'GroupAccountPriceGroupDesc', readonly: false, disabled: false, required: false },
            { name: 'CompanyRegistrationNumber', readonly: false, disabled: false, required: false },
            { name: 'CompanyVATNumber', readonly: false, disabled: false, required: false },
            { name: 'NegBranchNumber', readonly: false, disabled: false, required: false },
            { name: 'BranchName', readonly: false, disabled: false, required: false },
            { name: 'ContractSalesEmployee', readonly: false, disabled: false, required: false },
            { name: 'SalesEmployeeSurname', readonly: false, disabled: false, required: false },
            { name: 'EmailInd', readonly: false, disabled: false, required: false },
            { name: 'LetterInd', readonly: false, disabled: false, required: false },
            { name: 'VarianceText', readonly: false, disabled: false, required: false },
            { name: 'AuthorityCode', readonly: false, disabled: false, required: false },
            { name: 'BusinessCode', readonly: false, disabled: false, required: false },
            { name: 'ClientTypeCode', readonly: false, disabled: false, required: false },
            { name: 'ContractDurationCode', readonly: false, disabled: false, required: false },
            { name: 'ContractDurationDesc', readonly: false, disabled: false, required: false },
            { name: 'ContractReference', readonly: false, disabled: false, required: false },
            { name: 'LimitedCompanyInd', readonly: false, disabled: false, required: false },
            { name: 'OriginalContractRenewalDate', readonly: false, disabled: false, required: false },
            { name: 'PaymentDesc', readonly: false, disabled: false, required: false },
            { name: 'PaymentTypeCode', readonly: false, disabled: false, required: false },
            { name: 'QuoteTypeCode', readonly: false, disabled: false, required: false },
            { name: 'ReferenceRequired', readonly: false, disabled: false, required: false },
            { name: 'SalutationName', readonly: false, disabled: false, required: false },
            { name: 'UpdateableInd', readonly: false, disabled: false, required: false },
            { name: 'ValidForClientTypeVal', readonly: false, disabled: false, required: false },
            { name: 'dlApprovalLevel', readonly: false, disabled: false, required: false },
            { name: 'dlBatchRef', readonly: false, disabled: false, required: false },
            { name: 'dlContract', readonly: false, disabled: false, required: false },
            { name: 'dlMasterExtRef', readonly: false, disabled: false, required: false },
            { name: 'dlRejectionCode', readonly: false, disabled: false, required: false },
            { name: 'dlRejectionDesc', readonly: false, disabled: false, required: false },
            { name: 'findResult', readonly: false, disabled: false, required: false },
            { name: 'ContactMobile', readonly: false, disabled: false, required: false },
            { name: 'DisQuoteTypeCode', readonly: false, disabled: false, required: false },
            { name: 'SubSystem', readonly: false, disabled: false, required: false },
            { name: 'ClientTypeCodeSel', readonly: false, disabled: false, required: false },
            { name: 'SalutationNameSel', readonly: false, disabled: false, required: false },
            { name: 'MandateRequired', readonly: false, disabled: false, required: false },
            { name: 'ClientTypeDescription', readonly: false, disabled: false, required: false },
            { name: 'PaymentTypeCodeDefault', readonly: false, disabled: false, required: false },
            { name: 'PaymentTypeDescDefault', readonly: false, disabled: false, required: false },
            { name: 'ClientTypeSalutationInd', readonly: false, disabled: false, required: false },
            { name: 'ClientTypeLabel1', readonly: false, disabled: false, required: false },
            { name: 'ClientTypeLabel2', readonly: false, disabled: false, required: false },
            { name: 'ClientTypeCompanyNoInd', readonly: false, disabled: false, required: false },
            { name: 'ClientTypePrefixText', readonly: false, disabled: false, required: false },
            { name: 'ClientTypeSuffixText', readonly: false, disabled: false, required: false },
            { name: 'DefaultSalutationName', readonly: false, disabled: false, required: false },
            { name: 'PipelineAmendMode', readonly: false, disabled: false, required: false },
            { name: 'CurrentContractType', readonly: false, disabled: false, required: false },
            { name: 'SalutationName', readonly: false, disabled: false, required: false },
            { name: 'menu', readonly: false, disabled: false, required: false }
        ];
        this.tabNameMap = {
            General: true,
            SpecialInstructions: false
        };
        this.sysCharParams = {
            vBusinessCode: '',
            vSCEnableAddressLine3: '',
            vSCAddressLine3Logical: '',
            vSCEnableMaxAddress: '',
            vSCEnableMaxAddressValue: '',
            vDisableFieldList: '',
            vSCEnableHopewiserPAF: '',
            vSCEnableDatabasePAF: '',
            vSCAddressLine4Required: '',
            vSCAddressLine5Required: '',
            vSCAddressLine5Logical: '',
            vSCPostCodeRequired: '',
            vSCPostCodeMustExistInPAF: '',
            vSCRunPAFSearchOn1stAddressLine: '',
            vSCClientTypeValidation: '',
            vSCVatRegMandatory: '',
            vDefaultCountryCode: ''
        };
        this.uiDisplayFlag = {
            dlContractRef: true,
            ContractTypeCode: true,
            dlStatusCode: true,
            dlStatusDesc: true,
            ClientTypeValue1: true,
            ClientTypeValue2: true,
            ContractName: true,
            ContractAddressLine1: true,
            ContractAddressLine2: true,
            ContractAddressLine3: true,
            ContractAddressLine4: true,
            ContractAddressLine5: true,
            ContractPostcode: true,
            ContractContactName: true,
            ContractContactPosition: true,
            DecisionMakerInd: true,
            ContractContactMobile: true,
            ContractContactTelephone: true,
            ContractContactFax: true,
            ContractContactEmail: true,
            ContractCommenceDate: true,
            ContinuousInd: true,
            RenewalInd: true,
            ContractExpiryDate: true,
            InvoiceFrequencyCode: true,
            InvoiceFrequencyDesc: true,
            CreditReference: true,
            AccountNumber: true,
            AccountName: true,
            GroupAccountNumber: true,
            GroupName: true,
            GroupAccountPriceGroupID: true,
            GroupAccountPriceGroupDesc: true,
            CompanyRegistrationNumber: true,
            CompanyVATNumber: true,
            NegBranchNumber: true,
            BranchName: true,
            ContractSalesEmployee: true,
            SalesEmployeeSurname: true,
            EmailInd: true,
            LetterInd: true,
            VarianceText: true,
            AuthorityCode: true,
            BusinessCode: true,
            ClientTypeCode: true,
            ContractDurationCode: true,
            ContractDurationDesc: true,
            ContractReference: true,
            LimitedCompanyInd: true,
            OriginalContractRenewalDate: true,
            PaymentDesc: true,
            PaymentTypeCode: true,
            QuoteTypeCode: true,
            ReferenceRequired: true,
            SalutationName: true,
            UpdateableInd: true,
            ValidForClientTypeVal: true,
            dlApprovalLevel: true,
            dlBatchRef: true,
            dlContract: true,
            dlMasterExtRef: true,
            dlRejectionCode: true,
            dlRejectionDesc: true,
            findResult: true,
            ContactMobile: true,
            cmdCopyName: true,
            cmdGetAddress: true,
            trRenewalInd: true,
            trInvoiceFrequency: true,
            trAccountNumber: true,
            trNegotiatingBranch: true,
            trContinuousInd: true,
            trContractDurationCode: true,
            ClientTypeCodeSel: true,
            SalutationNameSel: true,
            tdSalutationLabel: true,
            trContractExpiryDate: true
        };
        this.uiDisableFlag = {
            dlContractRef: false,
            ContractTypeCode: false,
            dlStatusCode: false,
            dlStatusDesc: false,
            ClientTypeValue1: false,
            ClientTypeValue2: false,
            ContractName: false,
            ContractAddressLine1: false,
            ContractAddressLine2: false,
            ContractAddressLine3: false,
            ContractAddressLine4: false,
            ContractAddressLine5: false,
            ContractPostcode: false,
            ContractContactName: false,
            ContractContactPosition: false,
            DecisionMakerInd: false,
            ContractContactMobile: false,
            ContractContactTelephone: false,
            ContractContactFax: false,
            ContractContactEmail: false,
            ContractCommenceDate: false,
            ContinuousInd: false,
            RenewalInd: false,
            ContractExpiryDate: false,
            InvoiceFrequencyCode: false,
            InvoiceFrequencyDesc: false,
            CreditReference: false,
            AccountNumber: false,
            AccountName: false,
            GroupAccountNumber: false,
            GroupName: false,
            GroupAccountPriceGroupID: false,
            GroupAccountPriceGroupDesc: false,
            CompanyRegistrationNumber: false,
            CompanyVATNumber: false,
            NegBranchNumber: false,
            BranchName: false,
            ContractSalesEmployee: false,
            SalesEmployeeSurname: false,
            EmailInd: false,
            LetterInd: false,
            VarianceText: false,
            AuthorityCode: false,
            BusinessCode: false,
            ClientTypeCode: false,
            ContractDurationCode: false,
            ContractDurationDesc: false,
            ContractReference: false,
            LimitedCompanyInd: false,
            OriginalContractRenewalDate: false,
            PaymentDesc: false,
            PaymentTypeCode: false,
            QuoteTypeCode: false,
            ReferenceRequired: false,
            SalutationName: false,
            UpdateableInd: false,
            ValidForClientTypeVal: false,
            dlApprovalLevel: false,
            dlBatchRef: false,
            dlContract: false,
            dlMasterExtRef: false,
            dlRejectionCode: false,
            dlRejectionDesc: false,
            findResult: false,
            ContactMobile: false,
            cmdCopyName: false,
            cmdGetAddress: false,
            ClientTypeCodeSel: false,
            SalutationNameSel: false,
            isInvoiceFrequencyEllipsisDisabled: false
        };
        this.sysCharArr = [];
        this.querySysChar = new URLSearchParams();
        this.xhrParams = {
            method: 'prospect-to-contract/maintenance',
            module: 'advantage',
            operation: 'Sales/iCABSSdlContractMaintenance'
        };
        this.parentValues = {
            CurrentContractType: '',
            PipelineAmendMode: '',
            DefaultSalutationName: '',
            ContractCommenceDateValue: new Date()
        };
        this.uiSelectDropdownValues = {
            ClientTypeCodeSel: [{ value: '', text: '' }],
            SalutationNameSel: [{ value: '', text: '' }]
        };
        this.showCloseButton = true;
        this.showHeader = true;
        this.inputParamsInvoiceFrequency = { 'parentMode': 'LookUp', 'countryCode': this.utils.getCountryCode(), 'businessCode': this.utils.getBusinessCode() };
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.invoiceFrequencySearchComponent = InvoiceFrequencySearchComponent;
        this.inputParamsPaymentType = { 'parentMode': 'LookUp', 'countryCode': this.utils.getCountryCode(), 'businessCode': this.utils.getBusinessCode() };
        this.paymentTypeCodeComponent = PaymentSearchComponent;
        this.accountSearchComponent = AccountSearchComponent;
        this.inputParamsAccountNumber = {
            'parentMode': 'ContractSearch'
        };
        this.ellipsisConfig = {
            employee: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'LookUp-ContractSalesEmployee',
                showAddNew: false,
                component: EmployeeSearchComponent
            }
        };
        this.pageMode = {
            updateMode: false
        };
        this.menu = '';
        this.savecancelFlag = true;
        this.pageId = PageIdentifier.ICABSSDLCONTRACTMAINTENANCE;
        this.pageTitle = 'Advantage Contract Maintenance';
        this.search = this.getURLSearchParamObject();
    }
    DlContractMaintenanceComponent.prototype.receivedcontractDuration = function (eventObj) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractDurationCode', eventObj.ContractDurationCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractDurationDesc', eventObj.ContractDurationDesc);
    };
    DlContractMaintenanceComponent.prototype.onInvoiceFrequencyDataReceived = function (data) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceFrequencyCode', data.InvoiceFrequencyCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceFrequencyDesc', data.InvoiceFrequencyDesc);
        }
    };
    DlContractMaintenanceComponent.prototype.onPaymentTypeDataReceived = function (data) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PaymentTypeCode', data.PaymentTypeCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PaymentDesc', data.PaymentDesc);
        }
    };
    DlContractMaintenanceComponent.prototype.setAccountNumber = function (data) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', data.AccountNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountName', data.AccountName);
    };
    DlContractMaintenanceComponent.prototype.employeeEllipseDataReceive = function (data) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractSalesEmployee', data.EmployeeCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesEmployeeSurname', data.EmployeeSurName);
    };
    DlContractMaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.initForm();
        this.parentValues.ContractCommenceDateValue = null;
        this.loadParentInputValues();
        this.triggerFetchSysChar(false, true);
        this.formData = this.riExchange.getParentHTMLValues();
        this.sysCharParams.vBusinessCode = this.utils.getBusinessCode();
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        this.uiFormValueChanges = this.uiForm.statusChanges.subscribe(function (value) {
            _this.formChanges(value);
        });
        this.backLinkText = GlobalConstant.Configuration.BackText;
    };
    DlContractMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        this.uiFormValueChanges.unsubscribe();
    };
    DlContractMaintenanceComponent.prototype.initForm = function () {
        this.riExchange.renderForm(this.uiForm, this.controls);
    };
    DlContractMaintenanceComponent.prototype.loadParentInputValues = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'DisQuoteTypeCode', this.riExchange.getParentHTMLValue('DisQuoteTypeCode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'QuoteTypeCode', this.riExchange.getParentHTMLValue('PassQuoteTypeCode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SubSystem', this.riExchange.getParentHTMLValue('SubSystem'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'dlContract', this.riExchange.GetParentHTMLInputElementAttribute({}, 'dlContractRowID'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PipelineAmendMode', this.riExchange.getParentHTMLValue('PipelineAmend'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CurrentContractType', this.riExchange.getParentHTMLValue('CurrentContractType'));
        this.getUrlData();
    };
    DlContractMaintenanceComponent.prototype.getUrlData = function () {
        var _this = this;
        this.activatedRoute.queryParams.subscribe(function (params) {
            if (params['dlContractRowID']) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'dlContract', params['dlContractRowID']);
            }
            if (params['DisQuoteTypeCode']) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'DisQuoteTypeCode', params['DisQuoteTypeCode']);
            }
            if (params['SubSystem']) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SubSystem', params['SubSystem']);
            }
            if (params['PipelineAmendMode']) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PipelineAmendMode', params['PipelineAmendMode']);
            }
            if (params['CurrentContractType']) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'CurrentContractType', params['CurrentContractType']);
            }
            if (params['ContractTypeCode']) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractTypeCode', params['ContractTypeCode']);
            }
            _this.getOnloadValues();
        });
    };
    DlContractMaintenanceComponent.prototype.getOnloadValues = function () {
        var _this = this;
        var search = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '0');
        search.set('dlContractROWID', this.riExchange.riInputElement.GetValue(this.uiForm, 'dlContract'));
        search.set('dlBatchRef', '');
        search.set('dlRecordType', 'CO');
        search.set('dlContractRef', '');
        var dlContract = this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search).subscribe(function (data) {
            _this.loadFormData(data);
        });
    };
    DlContractMaintenanceComponent.prototype.loadFormData = function (data) {
        data.GroupName = '';
        data.GroupAccountPriceGroupDesc = '';
        data.BranchName = '';
        data.SalesEmployeeSurname = '';
        data.ContactMobile = '';
        data.DisQuoteTypeCode = '';
        data.SubSystem = '';
        data.ClientTypeCodeSel = '';
        data.SalutationNameSel = '';
        data.MandateRequired = true;
        data.PaymentDesc = '';
        data.ClientTypeDescription = '';
        data.PaymentTypeCodeDefault = '';
        data.PaymentTypeDescDefault = '';
        data.ClientTypeSalutationInd = '';
        data.ClientTypeLabel1 = '';
        data.ClientTypeLabel2 = '';
        data.ClientTypeCompanyNoInd = '';
        data.ClientTypePrefixText = '';
        data.ClientTypeSuffixText = '';
        data.DefaultSalutationName = '';
        data.PipelineAmendMode = '';
        data.CurrentContractType = '';
        data.ContractTypeCode = '';
        data.SalutationName = '';
        if (!data.hasOwnProperty('dlContractRef'))
            data.dlContractRef = '';
        data.menu = 'Options';
        this.uiForm.setValue(data);
        var dateString = data['ContractCommenceDate'];
        this.parentValues.ContractCommenceDateValue = this.setDatePicker(dateString);
    };
    DlContractMaintenanceComponent.prototype.setDatePicker = function (dateString) {
        var returnDateValue = '';
        if (window['moment'](dateString, 'DD/MM/YYYY', true).isValid()) {
            returnDateValue = this.utils.convertDateString(dateString);
        }
        if (!returnDateValue) {
            returnDateValue = null;
        }
        else {
            returnDateValue = new Date(returnDateValue);
        }
        return returnDateValue;
    };
    DlContractMaintenanceComponent.prototype.cancelForm = function () {
        this.uiForm.reset();
        this.parentValues.ContractCommenceDateValue = this.setDatePicker('');
        this.contractDurationActive = {
            'id': '',
            'text': ''
        };
        this.tabNameMap = {
            General: true,
            SpecialInstructions: false
        };
    };
    DlContractMaintenanceComponent.prototype.changeTab = function (tabname) {
        for (var key in this.tabNameMap) {
            if (this.tabNameMap.hasOwnProperty(key)) {
                this.tabNameMap[key] = false;
            }
        }
        this.tabNameMap[tabname] = true;
    };
    DlContractMaintenanceComponent.prototype.lookupSearch = function () {
        var _this = this;
        var queryParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.MethodType, 'maintenance');
        var lookupQuery;
        queryParams.set(this.serviceConstants.Action, '5');
        lookupQuery = [{
                'table': 'dlContract',
                'query': { 'dlContractRowID': this.riExchange.riInputElement.GetValue(this.uiForm, 'dlContract') },
                'fields': ['dlMasterExtRef', 'dlStatusCode', 'dlStatusDesc', 'dlRejectionCode', 'dlRejectionDesc', 'UpdateableInd']
            }];
        this.isRequesting = true;
        this.invokeLookupSearch(queryParams, lookupQuery).subscribe(function (value) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.isRequesting = false;
        }, function (error) {
            console.log('lookup search error');
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.isRequesting = false;
        }, function () {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.isRequesting = false;
        });
    };
    DlContractMaintenanceComponent.prototype.invokeLookupSearch = function (queryParams, data) {
        this.ajaxSource.next(this.ajaxconstant.START);
        return this.httpService.lookUpRequest(queryParams, data);
    };
    DlContractMaintenanceComponent.prototype.setSysChars = function () {
        if ((this.sysCharParams['vSCEnableHopewiserPAF'] !== 'true') || this.sysCharParams['vSCEnableDatabasePAF'] !== 'true') {
            this.uiDisplayFlag.cmdGetAddress = false;
        }
        if (this.sysCharParams['vSCClientTypeValidation'] === 'true') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ClientTypeCode', true);
        }
        else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ClientTypeCode', false);
        }
        if (this.sysCharParams['vSCAddressLine3Logical'] === 'true') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractAddressLine3', true);
        }
        else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractAddressLine3', false);
        }
        if (this.sysCharParams['vSCAddressLine5Logical'] === 'true') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractAddressLine5', true);
        }
        else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractAddressLine5', false);
        }
        if (this.sysCharParams['vSCClientTypeValidation'] === 'true') {
            this.GetClientTypeSalutationLists();
        }
        this.GetClientTypeSalutationLists();
        this.setOnloadBusinessLogic();
    };
    DlContractMaintenanceComponent.prototype.setOnloadBusinessLogic = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PipelineAmendMode')) {
            this.sysCharParams['vSCClientTypeValidation'] = 'false';
            this.uiDisplayFlag.trRenewalInd = false;
            this.uiDisplayFlag.trInvoiceFrequency = false;
            this.uiDisplayFlag.trAccountNumber = false;
            this.uiDisplayFlag.trNegotiatingBranch = false;
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'CurrentContractType')) {
            this.uiDisplayFlag.trContinuousInd = false;
            this.uiDisplayFlag.trContractDurationCode = false;
            this.uiDisplayFlag.trInvoiceFrequency = false;
        }
        this.uiDisableFlag.cmdGetAddress = true;
        this.uiDisableFlag.cmdCopyName = true;
    };
    DlContractMaintenanceComponent.prototype.GetClientTypeSalutationLists = function () {
        var _this = this;
        var search = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.sysCharParams.vBusinessCode);
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '6');
        search.set('Function', 'GetClientTypeSalutationLists');
        search.set('ContractTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode'));
        var dlContract = this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search).subscribe(function (data) {
            _this.uiSelectDropdownValues = {
                ClientTypeCodeSel: [],
                SalutationNameSel: []
            };
            var ClientTypeCodeList;
            var ClientTypeDescList;
            var SalutationNameList;
            var SalutationDescList;
            var DefaultSalutationName;
            ClientTypeCodeList = data.ClientTypeCodeList.split('\n');
            ClientTypeDescList = data.ClientTypeDescList.split('\n');
            SalutationNameList = data.SalutationNameList.split('\n');
            SalutationDescList = data.SalutationDescList.split('\n');
            DefaultSalutationName = data.DefaultSalutationName;
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'DefaultSalutationName', DefaultSalutationName);
            for (var i = 0; i < ClientTypeCodeList.length; i++) {
                _this.uiSelectDropdownValues.ClientTypeCodeSel.push({ value: ClientTypeCodeList[i], text: ClientTypeDescList[i] });
            }
            for (var i = 0; i < SalutationNameList.length; i++) {
                _this.uiSelectDropdownValues.SalutationNameSel.push({ value: SalutationNameList[i], text: SalutationDescList[i] });
            }
        });
    };
    DlContractMaintenanceComponent.prototype.PopulateNameFromClientDetails = function () {
        var _this = this;
        var search = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.sysCharParams.vBusinessCode);
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '6');
        search.set('Function', 'GetPaymentTypeCodeDetails');
        search.set('PaymentTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'PaymentTypeCode'));
        search.set('ReferenceRequired', this.riExchange.riInputElement.GetValue(this.uiForm, 'ReferenceRequired'));
        search.set('MandateRequired', this.riExchange.riInputElement.GetValue(this.uiForm, 'MandateRequired'));
        var dlContract = this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search).subscribe(function (data) {
            if (data.ReferenceRequired === 'no') {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ReferenceRequired', false);
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ReferenceRequired', true);
            }
            if (data.MandateRequired === 'no') {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'MandateRequired', false);
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'MandateRequired', true);
            }
        });
    };
    DlContractMaintenanceComponent.prototype.sysCharParameters = function () {
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableAddressLine3,
            this.sysCharConstants.SystemCharEnableHopewiserPAF,
            this.sysCharConstants.SystemCharEnableDatabasePAF,
            this.sysCharConstants.SystemCharAddressLine4Required,
            this.sysCharConstants.SystemCharAddressLine5Required,
            this.sysCharConstants.SystemCharPostCodeRequired,
            this.sysCharConstants.SystemCharPostCodeMustExistinPAF,
            this.sysCharConstants.SystemCharRunPAFSearchOnFirstAddressLine,
            this.sysCharConstants.SystemCharMaximumAddressLength,
            this.sysCharConstants.SystemCharEnableClientTypeValidationInSOP,
            this.sysCharConstants.SystemCharMakeCompanyVATMandatoryLikeCompanyReg
        ];
        return sysCharList.join(',');
    };
    DlContractMaintenanceComponent.prototype.onSysCharDataReceive = function (e) {
        if (e.records && e.records.length > 0) {
            this.sysCharParams['vSCEnableAddressLine3'] = e.records[0].Required;
            this.sysCharParams['vSCAddressLine3Logical'] = e.records[0].Required;
            this.sysCharParams['vSCEnableHopewiserPAF'] = e.records[1].Required;
            this.sysCharParams['vSCEnableDatabasePAF'] = e.records[2].Required;
            this.sysCharParams['vSCAddressLine4Required'] = e.records[3].Required;
            this.sysCharParams['vSCAddressLine5Required'] = e.records[4].Required;
            this.sysCharParams['vSCAddressLine5Logical'] = e.records[4].Required;
            this.sysCharParams['vSCPostCodeRequired'] = e.records[5].Required;
            this.sysCharParams['vSCPostCodeMustExistInPAF'] = e.records[6].Required;
            this.sysCharParams['vSCRunPAFSearchOn1stAddressLine'] = e.records[7].Required;
            this.sysCharParams['vSCEnableMaxAddress'] = e.records[8].Required;
            this.sysCharParams['vSCEnableMaxAddressValue'] = e.records[8].Integer;
            this.sysCharParams['vSCClientTypeValidation'] = e.records[9].Required;
            this.sysCharParams['vSCVatRegMandatory'] = e.records[10].Required;
        }
        this.setSysChars();
    };
    DlContractMaintenanceComponent.prototype.fetchSysChar = function (sysCharNumbers) {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    };
    DlContractMaintenanceComponent.prototype.triggerFetchSysChar = function (saveModeData, returnSubscription) {
        var _this = this;
        var sysCharNumbers = this.sysCharParameters();
        this.fetchSysChar(sysCharNumbers).subscribe(function (data) {
            _this.onSysCharDataReceive(data);
        });
    };
    DlContractMaintenanceComponent.prototype.onChange = function (eventobject, value) {
        var selectedValue = '';
        switch (value) {
            case 'ClientTypeCodeSel':
                selectedValue = this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientTypeCodeSel');
                if (this.riExchange.riInputElement.GetValue(this.uiForm, 'SalutationNameSel') === '') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SalutationNameSel', this.riExchange.riInputElement.GetValue(this.uiForm, 'DefaultSalutationName'));
                }
                this.GetClientTypeDetails(true);
                break;
            case 'ClientTypeCodeSel':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SalutationName', this.riExchange.riInputElement.GetValue(this.uiForm, 'SalutationNameSel'));
                this.PopulateNameFromClientDetails();
                break;
            case 'menu':
                var menu = this.menu;
                if (menu === 'Premises') {
                    if (this.riExchange.riInputElement.GetValue(this.uiForm, 'QuoteTypeCode') === '') {
                        this.router.navigate(['grid/application/SOPremiseGrid'], { queryParams: { parentMode: 'Contract' } });
                    }
                    else {
                    }
                }
                break;
            default:
                break;
        }
    };
    DlContractMaintenanceComponent.prototype.GetClientTypeDetails = function (flag) {
        var _this = this;
        var search = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.sysCharParams.vBusinessCode);
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '6');
        search.set('Function', 'GetClientTypeDetails');
        search.set('ClientTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientTypeCodeSel'));
        search.set('PaymentTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'PaymentTypeCode'));
        search.set('PaymentDesc', this.riExchange.riInputElement.GetValue(this.uiForm, 'PaymentDesc'));
        search.set('MandateRequired', this.riExchange.riInputElement.GetValue(this.uiForm, 'MandateRequired'));
        search.set('ContractTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode'));
        search.set('ClientTypeValue1', this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientTypeValue1'));
        search.set('ClientTypeValue2', this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientTypeValue2'));
        var dlContract = this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search).subscribe(function (data) {
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ClientTypeDescription', data.ClientTypeDescription);
            if (data.ClientTypeSalutationInd === 'no') {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ClientTypeSalutationInd', false);
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ClientTypeSalutationInd', true);
            }
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PaymentTypeCodeDefault', data.PaymentTypeCodeDefault);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PaymentTypeDescDefault', data.PaymentTypeDescDefault);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ClientTypeLabel1', data.ClientTypeLabel1);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ClientTypeLabel2', data.ClientTypeLabel2);
            if (data.ClientTypeCompanyNoInd === 'no') {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ClientTypeCompanyNoInd', false);
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ClientTypeCompanyNoInd', true);
            }
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ClientTypePrefixText', data.ClientTypePrefixText);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ClientTypeSuffixText', data.ClientTypeSuffixText);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'DefaultSalutationName', data.DefaultSalutationName);
            _this.SetupClientTypeFields();
        });
    };
    DlContractMaintenanceComponent.prototype.SetupClientTypeFields = function () {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ClientTypeCodeSel', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SalutationNameSel', false);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ClientTypeValue1', false);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ClientTypeValue2', false);
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientTypeSalutationInd') === 'false') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SalutationNameSel', false);
            this.uiDisplayFlag.tdSalutationLabel = false;
        }
        else {
            this.uiDisplayFlag.tdSalutationLabel = true;
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientTypeLabel1') === '') {
            this.uiDisplayFlag.ClientTypeValue1 = false;
        }
        else {
            this.uiDisplayFlag.ClientTypeValue1 = true;
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'clientTypeSalutationInd') === 'false') {
                document.getElementById('ClientTypeValue1').focus();
            }
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientTypeLabel2') === '') {
            this.uiDisplayFlag.ClientTypeValue2 = false;
        }
        else {
            this.uiDisplayFlag.ClientTypeValue2 = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ClientTypeValue2', false);
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientTypeCompanyNoInd') === 'true') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CompanyRegistrationNumber', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CompanyVATNumber', true);
        }
        else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CompanyRegistrationNumber', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CompanyVATNumber', false);
        }
    };
    DlContractMaintenanceComponent.prototype.ContinuousInd_onclick = function () {
        var continuousInd = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContinuousInd');
        if (continuousInd === 'no' || continuousInd === 'false') {
            this.uiDisplayFlag.trRenewalInd = false;
            this.uiDisplayFlag.trContractDurationCode = false;
            this.uiDisplayFlag.trContractExpiryDate = false;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractDurationCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractDurationDesc', '');
            this.uiDisableFlag.ContractDurationCode = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractDurationCode', false);
        }
        else {
            var PipelineAmendMode = this.riExchange.riInputElement.GetValue(this.uiForm, 'PipelineAmendMode');
            if (PipelineAmendMode === 'true' || PipelineAmendMode === 'yes') {
                this.uiDisplayFlag.trRenewalInd = true;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'RenewalInd', true);
                this.uiDisplayFlag.trContractDurationCode = true;
                this.uiDisplayFlag.trContractDurationCode = true;
                this.uiDisableFlag.ContractDurationCode = false;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractDurationCode', true);
            }
        }
    };
    DlContractMaintenanceComponent.prototype.RenewalInd_onclick = function () {
        var renewalInd = this.riExchange.riInputElement.GetValue(this.uiForm, 'RenewalInd');
        if (renewalInd) {
            this.parentValues.ContractCommenceDateValue = this.riExchange.riInputElement.GetValue(this.uiForm, 'OriginalContractRenewalDate');
            this.uiDisableFlag.ContractCommenceDate = true;
            if (this.uiDisplayFlag.trContractExpiryDate === false) {
                this.CalculateExpiryDate();
            }
        }
        else {
            this.uiDisableFlag.ContractCommenceDate = false;
        }
    };
    DlContractMaintenanceComponent.prototype.selDate = function (value, id) {
        this.riExchange.riInputElement.SetValue(this.uiForm, id, value);
    };
    DlContractMaintenanceComponent.prototype.CalculateExpiryDate = function () {
        var _this = this;
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PipelineAmendMode')) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'RenewalInd', true);
        }
        var search = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.sysCharParams.vBusinessCode);
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '6');
        search.set('Function', 'GetExpiryDate');
        search.set('ContractCommenceDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractCommenceDate'));
        search.set('ContractDurationCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractDurationCode'));
        search.set('ContractTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode'));
        search.set('LanguageCode', '');
        search.set('ContractExpiryDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractExpiryDate'));
        search.set('ContractDurationDesc', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractDurationDesc'));
        var dlContract = this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search).subscribe(function (data) {
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractExpiryDate', data.ContractExpiryDate);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractDurationDesc', data.ContractDurationDesc);
        });
    };
    DlContractMaintenanceComponent.prototype.changeMode = function (key, flag) {
        this.pageMode[key] = flag;
        this.EmailRequired();
    };
    DlContractMaintenanceComponent.prototype.EmailRequired = function () {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EmailInd', true);
    };
    DlContractMaintenanceComponent.prototype.cmdCopyName_onclick = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractContactName', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'));
    };
    DlContractMaintenanceComponent.prototype.cmdGetAddress_onclick = function () {
    };
    DlContractMaintenanceComponent.prototype.saveFormData = function () {
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        var allFormData = this.uiForm.value;
        var requiredFieldsArr = ['ContractCommenceDate', 'ContractName', 'ContractAddressLine1', 'ContractAddressLine5', 'ContractPostcode', 'ContractPostcode', 'ContractContactName', 'ContractContactPosition', 'ContractContactTelephone'];
        this.promptConfirmModal.show();
    };
    DlContractMaintenanceComponent.prototype.promptConfirm = function (event) {
        var _this = this;
        var searchPost = new URLSearchParams();
        var allFormData = this.uiForm.value;
        var postParams = {};
        for (var key in allFormData) {
            if (key) {
                postParams[key] = allFormData[key];
            }
        }
        postParams['dlContractROWID'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlContract');
        searchPost.set(this.serviceConstants.Action, '2');
        searchPost.set(this.serviceConstants.BusinessCode, this.sysCharParams.vBusinessCode);
        searchPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, searchPost, postParams)
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
                    _this.riExchange.setParentAttributeValue('dlPremiseRowID', postParams['dlContractROWID']);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    DlContractMaintenanceComponent.prototype.promptCancel = function (eventObj) {
        console.log('prompt cancel');
    };
    DlContractMaintenanceComponent.prototype.formChanges = function (obj) {
        if (obj === 'VALID') {
            this.savecancelFlag = false;
        }
        else {
            this.savecancelFlag = true;
        }
    };
    DlContractMaintenanceComponent.prototype.onBackLinkClick = function (event) {
        event.preventDefault();
        this.location.back();
    };
    DlContractMaintenanceComponent.prototype.menuOnchange = function () {
        var menu = this.menu;
        if (menu === 'Premises') {
            this.router.navigate(['grid/application/SOPremiseGrid'], { queryParams: { parentMode: 'Contract' } });
        }
    };
    DlContractMaintenanceComponent.prototype.messageModalClose = function () {
        console.log('modal closed');
    };
    DlContractMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSdlContractMaintenance.html'
                },] },
    ];
    DlContractMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    DlContractMaintenanceComponent.propDecorators = {
        'contractDurationDropDown': [{ type: ViewChild, args: ['contractDurationDropDown',] },],
        'promptConfirmModal': [{ type: ViewChild, args: ['promptConfirmModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return DlContractMaintenanceComponent;
}(BaseComponent));
