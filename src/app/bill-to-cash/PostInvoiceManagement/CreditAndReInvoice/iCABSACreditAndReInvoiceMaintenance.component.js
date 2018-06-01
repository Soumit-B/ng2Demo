var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { ScreenNotReadyComponent } from '../../../../shared/components/screenNotReady';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { InvoiceSearchComponent } from './../../../internal/search/iCABSInvoiceSearch.component';
export var CreditAndReInvoiceMaintenanceComponent = (function (_super) {
    __extends(CreditAndReInvoiceMaintenanceComponent, _super);
    function CreditAndReInvoiceMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [{ name: 'CompanyCode', readonly: false, disabled: false, required: false },
            { name: 'CompanyInvoiceNumber', readonly: false, disabled: false, required: true },
            { name: 'AccountNumber', readonly: false, disabled: false, required: false },
            { name: 'InvoiceName', readonly: false, disabled: false, required: false },
            { name: 'InvoiceAddressLine1', readonly: false, disabled: false, required: false },
            { name: 'InvoiceAddressLine2', readonly: false, disabled: false, required: false },
            { name: 'InvoiceAddressLine3', readonly: false, disabled: false, required: false },
            { name: 'InvoiceAddressLine4', readonly: false, disabled: false, required: false },
            { name: 'InvoiceAddressLine5', readonly: false, disabled: false, required: false },
            { name: 'InvoicePostcode', readonly: false, disabled: false, required: false },
            { name: 'ValueExclTax', readonly: false, disabled: false, required: false },
            { name: 'TaxValue', readonly: false, disabled: false, required: false },
            { name: 'rsCredit', readonly: false, disabled: false, required: false },
            { name: 'CreditReasonCode', readonly: false, disabled: false, required: true },
            { name: 'CreditReasonDesc', readonly: false, disabled: false, required: false },
            { name: 'rsUseAddress', readonly: false, disabled: false, required: false },
            { name: 'InvoiceReasonCode', readonly: false, disabled: false, required: true },
            { name: 'InvoiceReasonDesc', readonly: false, disabled: false, required: false },
            { name: 'CreditIndividualItems', readonly: false, disabled: false, required: false },
            { name: 'TaxPointDate', readonly: false, disabled: false, required: false },
            { name: 'CreditNarrative', readonly: false, disabled: false, required: true },
            { name: 'AdditionalCreditInfo', readonly: false, disabled: false, required: false },
            { name: 'TaxPointDateHidden', readonly: false, disabled: false, required: false },
            { name: 'CompanyCode', readonly: false, disabled: false, required: true },
            { name: 'CompanyDesc', readonly: false, disabled: false, required: false },
            { name: 'InvoiceNumber', readonly: false, disabled: false, required: false },
            { name: 'ReInvoice', readonly: false, disabled: false, required: false }
        ];
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
        this.promptConfig = {
            forSave: {
                showPromptMessageHeader: true,
                promptConfirmTitle: '',
                promptConfirmContent: MessageConstant.Message.ConfirmRecord
            },
            promptFlag: 'save',
            config: {
                ignoreBackdropClick: true
            },
            afterSave: {
                showPromptMessageHeader: true,
                promptConfirmTitle: '',
                promptConfirmContent: ''
            },
            forSave2: {
                showPromptMessageHeader: true,
                promptConfirmTitle: '',
                promptConfirmContent: MessageConstant.Message.ConfirmRecord
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
        this.pageVariables = {
            CompanyCode: '',
            CompanyDesc: '',
            savecancelFlag: true,
            isRequesting: false,
            saveMode: true,
            addMode: false,
            requiredStatus: false,
            requiredFormControlsObj: { 'CompanyCode': false, 'CompanyInvoiceNumber': false },
            requiredFormControlsAfterSave: { 'CreditReasonCode': false, 'CreditNarrative': false },
            saveClicked: false,
            saveClickedAfter: false,
            TaxPointDate: new Date(),
            CompanyCodeDefault: {
                'id': '',
                'text': ''
            }
        };
        this.pageDisableFlag = {
            mandatoryFieldsEnableFlag: false,
            CreditIndividualItems: false
        };
        this.pageDisplayFlag = {
            InvoiceReasonCode: false,
            TaxPointDate: false,
            CompanyCode: true
        };
        this.xhrParams = {
            method: 'bill-to-cash/maintenance',
            module: 'invoicing',
            operation: 'Application/iCABSACreditAndReInvoiceMaintenance'
        };
        this.screenNotReadyComponent = ScreenNotReadyComponent;
        this.sysCharParams = {
            vSCEnableCompanyCode: '',
            vSCEnableInvoiceTaxPointRules2: ''
        };
        this.sysCharArr = [];
        this.querySysChar = new URLSearchParams();
        this.pageId = PageIdentifier.ICABSACREDITANDREINVOICEMAINTENANCE;
    }
    CreditAndReInvoiceMaintenanceComponent.prototype.invoiceSearchComponentDataReceived = function (eventObj) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNumber', eventObj);
        this.lookupSearch('InvoiceNumberReceived');
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.companySearchdataReceived = function (eventObj) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyCode', eventObj.CompanyCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyDesc', eventObj.CompanyDesc);
        this.ellipseConfig.invoiceSearchComponent.inputParams.companyCode = eventObj.CompanyCode;
        this.cbbService.disableComponent(true);
        if (this.pageVariables.requiredFormControlsObj.hasOwnProperty('CompanyCode'))
            this.pageVariables.requiredFormControlsObj['CompanyCode'] = false;
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Invoice';
        this.initForm();
        this.uiFormValueChanges = this.uiForm.statusChanges.subscribe(function (value) {
            _this.formChanges(value);
        });
        this.triggerFetchSysChar(false, true);
        this.lookupSearch('defaultCompanyCode');
        this.resetRadios();
        this.pageVariables.TaxPointDate = null;
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.ngAfterViewInit = function () {
        if (localStorage.getItem('navFromCreditReinvoiceToGrid')) {
            if (localStorage.getItem('navFromCreditReinvoiceToGrid') === 'false') {
                this.populateUIFromFormData();
                this.uiForm.controls['CreditIndividualItems'].setValue(true);
                this.ellipseConfig.bCompanySearchComponent.active.id = this.uiForm.controls['CompanyCode'].value;
                this.ellipseConfig.bCompanySearchComponent.active.text = this.uiForm.controls['CompanyDesc'].value;
                var active = { id: this.uiForm.controls['CompanyCode'].value, text: this.uiForm.controls['CompanyDesc'].value };
                this.bCompanySearchComponent.active = active;
                localStorage.removeItem('navFromCreditReinvoiceToGrid');
            }
        }
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.setSysChars = function () {
        if (this.sysCharParams['vSCEnableCompanyCode'].toString() === 'true') {
            this.pageDisplayFlag.CompanyCode = true;
        }
        else {
            this.pageDisplayFlag.CompanyCode = false;
        }
        if (this.sysCharParams['vSCEnableInvoiceTaxPointRules2'].toString() === 'true') {
            this.pageDisplayFlag.TaxPointDate = true;
        }
        else {
            this.pageDisplayFlag.TaxPointDate = false;
        }
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.onSysCharDataReceive = function (e) {
        if (e.records && e.records.length > 0) {
            this.sysCharParams['vSCEnableCompanyCode'] = e.records[0].Required;
            this.sysCharParams['vSCEnableInvoiceTaxPointRules2'] = e.records[1].Required;
        }
        this.setSysChars();
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.fetchSysChar = function (sysCharNumbers) {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.sysCharParameters = function () {
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableCompanyCode,
            this.sysCharConstants.SystemCharEnableInvoiceTaxPointRules2
        ];
        return sysCharList.join(',');
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.triggerFetchSysChar = function (saveModeData, returnSubscription) {
        var _this = this;
        var sysCharNumbers = this.sysCharParameters();
        this.fetchSysChar(sysCharNumbers).subscribe(function (data) {
            _this.onSysCharDataReceive(data);
        });
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.initForm = function () {
        this.riExchange.renderForm(this.uiForm, this.controls);
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        this.uiFormValueChanges.unsubscribe();
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.formChanges = function (obj) {
        if (obj === 'VALID') {
            this.pageVariables.savecancelFlag = false;
        }
        else {
            this.pageVariables.savecancelFlag = true;
        }
        if (!this.uiForm.pristine)
            this.formValidation();
        if (this.pageVariables.saveClickedAfter)
            this.formValidationAfterSave();
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.lookupSearch = function (key) {
        var _this = this;
        switch (key) {
            case 'CompanyInvoiceNumber':
                var flag = this.formValidation('CompanyInvoiceNumber');
                var queryParams = new URLSearchParams();
                queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                queryParams.set(this.serviceConstants.MethodType, 'maintenance');
                var lookupQuery = void 0;
                queryParams.set(this.serviceConstants.Action, '5');
                if (flag === 0) {
                    lookupQuery = [{
                            'table': 'InvoiceHeader',
                            'query': { 'BusinessCode': this.utils.getBusinessCode(), 'Companycode': this.riExchange.riInputElement.GetValue(this.uiForm, 'CompanyCode'), 'CompanyInvoiceNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'CompanyInvoiceNumber') },
                            'fields': ['InvoiceNumber']
                        }];
                    this.pageVariables.isRequesting = true;
                    this.ajaxSource.next(this.ajaxconstant.START);
                    this.invokeLookupSearch(queryParams, lookupQuery).subscribe(function (value) {
                        _this.pageVariables.isRequesting = false;
                        var returnDataLength = value.results[0].length;
                        switch (returnDataLength) {
                            case 0:
                                _this.messageModalConfig.content = MessageConstant.Message.RecordNotFound;
                                _this.messageModal.show();
                                break;
                            case 1:
                                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                                _this.pageVariables.isRequesting = false;
                                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceNumber', value.results[0][0].InvoiceNumber);
                                _this.lookupSearch('InvoiceNumberReceived');
                                break;
                            case 2:
                                _this.ellipseConfig.invoiceSearchComponent.inputParams.CompanyInvoiceNumber = _this.uiForm.controls['CompanyInvoiceNumber'].value;
                                _this.InvoiceSearchEllipsis.openModal();
                                break;
                            default:
                                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                                _this.pageVariables.isRequesting = false;
                                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceNumber', value.results[0][0].InvoiceNumber);
                                _this.lookupSearch('InvoiceNumberReceived');
                                break;
                        }
                    }, function (error) {
                        console.log('lookup search error');
                        _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                        _this.pageVariables.isRequesting = false;
                    }, function () {
                        _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                        _this.pageVariables.isRequesting = false;
                    });
                }
                break;
            case 'InvoiceNumberReceived':
                var searchPost = new URLSearchParams();
                var postParams = {};
                postParams['InvoiceNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNumber');
                postParams['Function'] = 'GetInvoiceDetailsFromCompanyInvoice';
                postParams['methodtype'] = 'maintenance';
                searchPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                searchPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                searchPost.set(this.serviceConstants.Action, '6');
                this.ajaxSource.next(this.ajaxconstant.START);
                this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, searchPost, postParams)
                    .subscribe(function (e) {
                    _this.pageVariables.isRequesting = false;
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
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AccountNumber', e['AccountNumber']);
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'CompanyCode', e['CompanyCode']);
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'CompanyInvoiceNumber', e['CompanyInvoiceNumber']);
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceAddressLine1', e['InvoiceAddressLine1']);
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceAddressLine2', e['InvoiceAddressLine2']);
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceAddressLine3', e['InvoiceAddressLine3']);
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceAddressLine4', e['InvoiceAddressLine4']);
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceAddressLine5', e['InvoiceAddressLine5']);
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceName', e['InvoiceName']);
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceNumber', e['InvoiceNumber']);
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoicePostCode', e['InvoicePostCode']);
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'TaxPointDateHidden', e['TaxPointDate']);
                            var serviceCommenceDateDisplay = '';
                            if (window['moment'](e['TaxPointDate'], 'DD/MM/YYYY', true).isValid()) {
                                serviceCommenceDateDisplay = _this.utils.convertDateString(e['TaxPointDate']);
                            }
                            if (!serviceCommenceDateDisplay) {
                                _this.pageVariables.TaxPointDate = null;
                            }
                            else {
                                _this.pageVariables.TaxPointDate = new Date(serviceCommenceDateDisplay);
                            }
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'TaxValue', e['TaxValue']);
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ValueExclTax', e['ValueExclTax']);
                        }
                    }
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                }, function (error) {
                    _this.errorService.emitError(error);
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                });
                break;
            case 'CheckSaveFormData':
                searchPost = new URLSearchParams();
                var allFormData = this.uiForm.value;
                postParams = {};
                for (var key_1 in allFormData) {
                    if (key_1) {
                        if (typeof allFormData[key_1] !== 'boolean')
                            postParams[key_1] = allFormData[key_1].trim();
                    }
                }
                postParams['InvoiceNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNumber');
                postParams['Function'] = 'CheckInvoiceCredit';
                postParams['methodtype'] = 'maintenance';
                searchPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                searchPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                searchPost.set(this.serviceConstants.Action, '6');
                this.ajaxSource.next(this.ajaxconstant.START);
                this.pageVariables.isRequesting = true;
                this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, searchPost, postParams)
                    .subscribe(function (e) {
                    _this.pageVariables.isRequesting = false;
                    if (e.hasOwnProperty('ErrorMessageDesc')) {
                        var msg = e['ErrorMessageDesc'];
                        if (msg !== '') {
                            _this.promptConfig.promptFlag = 'afterSave';
                            _this.promptConfig.forSave.promptConfirmContent = msg;
                            _this.promptConfirmModal.show();
                            _this.pageVariables.saveClickedAfter = true;
                        }
                        else {
                            _this.afterSaveCheckFormMessagesAndSave();
                        }
                    }
                    else {
                        _this.afterSaveCheckFormMessagesAndSave();
                    }
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                }, function (error) {
                    _this.errorService.emitError(error);
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                });
                break;
            case 'SaveFormData':
                searchPost = new URLSearchParams();
                allFormData = this.uiForm.value;
                postParams = {};
                for (var key_2 in allFormData) {
                    if (key_2) {
                        postParams[key_2] = allFormData[key_2];
                    }
                }
                postParams['InvoiceNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNumber');
                postParams['methodtype'] = 'maintenance';
                searchPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                searchPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                searchPost.set(this.serviceConstants.Action, '1');
                this.ajaxSource.next(this.ajaxconstant.START);
                this.pageVariables.isRequesting = true;
                this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, searchPost, postParams)
                    .subscribe(function (e) {
                    _this.pageVariables.isRequesting = false;
                    if (e.hasOwnProperty('errorMessage')) {
                        var msg = e['errorMessage'];
                        if (msg !== '') {
                            _this.messageModalConfig.content = msg;
                            _this.messageModal.show();
                        }
                    }
                    else if (e.hasOwnProperty('fullError')) {
                        if (e['fullError'] !== '') {
                            _this.messageModalConfig.content = e['fullError'];
                            _this.messageModal.show();
                        }
                    }
                    else {
                        if (_this.uiForm.controls['CreditIndividualItems'].value) {
                            if (_this.uiForm.controls['CreditIndividualItems'].value === true) {
                                var userAddress = false;
                                if (_this.uiForm.controls['rsUseAddress'].value === 1) {
                                    userAddress = true;
                                }
                                var urlParams = {
                                    CompanyCode: _this.uiForm.controls['CompanyCode'].value,
                                    CompanyDesc: _this.uiForm.controls['CompanyDesc'].value,
                                    CompanyInvoiceNumber: _this.uiForm.controls['CompanyInvoiceNumber'].value,
                                    InvoiceNumber: _this.uiForm.controls['InvoiceNumber'].value,
                                    CreditReasonCode: _this.uiForm.controls['CreditReasonCode'].value,
                                    CreditReasonDesc: _this.uiForm.controls['CreditReasonDesc'].value,
                                    UseAddress: userAddress
                                };
                                localStorage.setItem('navFromCreditReinvoiceToGrid', 'true');
                                _this.navigate('navFromCreditReinvoiceToGrid', '/billtocash/InvoicedAndCreditReporting/CreditAndReInvoiceGrid', urlParams);
                            }
                            else {
                                _this.messageModalConfig.content = MessageConstant.Message.SavedSuccessfully;
                                _this.messageModal.show();
                            }
                        }
                        else {
                            _this.messageModalConfig.content = MessageConstant.Message.SavedSuccessfully;
                            _this.messageModal.show();
                        }
                    }
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                }, function (error) {
                    _this.errorService.emitError(error);
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                });
                break;
            case 'SearchCreditReasonCode':
                queryParams = new URLSearchParams();
                queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                queryParams.set(this.serviceConstants.MethodType, 'maintenance');
                queryParams.set(this.serviceConstants.Action, '5');
                lookupQuery = [{
                        'table': 'InvoiceCreditReasonLang',
                        'query': { 'BusinessCode': this.utils.getBusinessCode(), 'LanguageCode': 'ENG', 'InvoiceCreditReasonCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'CreditReasonCode') },
                        'fields': ['InvoiceCreditReasonDesc']
                    }];
                this.ajaxSource.next(this.ajaxconstant.START);
                this.invokeLookupSearch(queryParams, lookupQuery).subscribe(function (value) {
                    if (value.results[0])
                        if (value.results[0][0])
                            _this.uiForm.controls['CreditReasonDesc'].setValue(value.results[0][0].InvoiceCreditReasonDesc);
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                }, function (error) {
                    console.log('lookup search error');
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    _this.pageVariables.isRequesting = false;
                }, function () {
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    _this.pageVariables.isRequesting = false;
                });
                break;
            case 'SearchInvoiceReasonCode':
                queryParams = new URLSearchParams();
                queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                queryParams.set(this.serviceConstants.MethodType, 'maintenance');
                queryParams.set(this.serviceConstants.Action, '5');
                lookupQuery = [{
                        'table': 'InvoiceCreditReasonLang',
                        'query': { 'BusinessCode': this.utils.getBusinessCode(), 'LanguageCode': 'ENG', 'InvoiceCreditReasonCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceReasonCode') },
                        'fields': ['InvoiceCreditReasonDesc']
                    }];
                this.ajaxSource.next(this.ajaxconstant.START);
                this.invokeLookupSearch(queryParams, lookupQuery).subscribe(function (value) {
                    if (value.results[0])
                        if (value.results[0][0])
                            _this.uiForm.controls['InvoiceReasonDesc'].setValue(value.results[0][0].InvoiceCreditReasonDesc);
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                }, function (error) {
                    console.log('lookup search error');
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    _this.pageVariables.isRequesting = false;
                }, function () {
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    _this.pageVariables.isRequesting = false;
                });
                break;
            case 'defaultCompanyCode':
                queryParams = new URLSearchParams();
                queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                queryParams.set(this.serviceConstants.Action, '5');
                lookupQuery = [{
                        'table': 'Company',
                        'query': { 'BusinessCode': this.utils.getBusinessCode(), 'DefaultCompanyInd': true },
                        'fields': ['CompanyCode', 'CompanyDesc']
                    }];
                this.ajaxSource.next(this.ajaxconstant.START);
                this.invokeLookupSearch(queryParams, lookupQuery).subscribe(function (value) {
                    var returnDataLength = value.results[0].length;
                    if (value.results[0].length > 0) {
                        if (value.results[0][0]) {
                            _this.uiForm.controls['CompanyCode'].setValue(value.results[0][0].CompanyCode);
                            _this.uiForm.controls['CompanyDesc'].setValue(value.results[0][0].CompanyDesc);
                            _this.ellipseConfig.invoiceSearchComponent.inputParams.companyCode = value.results[0][0].CompanyCode;
                        }
                    }
                }, function (error) {
                    console.log('lookup search error');
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    _this.pageVariables.isRequesting = false;
                }, function () {
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    _this.pageVariables.isRequesting = false;
                });
                break;
            default:
                break;
        }
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.invokeLookupSearch = function (queryParams, data) {
        this.ajaxSource.next(this.ajaxconstant.START);
        return this.httpService.lookUpRequest(queryParams, data);
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.actionButtonClicked = function (key) {
        var _this = this;
        switch (key) {
            case 'save':
                this.pageVariables.saveClicked = true;
                if (this.formValidation() === 0) {
                    if (this.uiForm.controls['CreditReasonCode'].value !== null) {
                        if (this.uiForm.controls['CreditReasonCode'].value.trim() !== '') {
                            this.lookupSearch('SearchCreditReasonCode');
                        }
                    }
                    if (this.uiForm.controls['InvoiceReasonCode'].value !== null) {
                        if (this.pageDisplayFlag.InvoiceReasonCode) {
                            if (this.uiForm.controls['InvoiceReasonCode'].value.trim() !== '') {
                                this.lookupSearch('SearchInvoiceReasonCode');
                            }
                        }
                    }
                    this.lookupSearch('CheckSaveFormData');
                }
                break;
            case 'cancel':
                this.pageVariables.saveClicked = false;
                this.pageVariables.saveClickedAfter = false;
                var temp = {
                    companyCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'CompanyCode'),
                    companyDesc: this.riExchange.riInputElement.GetValue(this.uiForm, 'CompanyDesc'),
                    rsCredit: this.uiForm.controls['rsCredit'].value,
                    rsUseAddress: this.uiForm.controls['rsUseAddress'].value
                };
                this.uiForm.reset();
                this.pageVariables.TaxPointDate = null;
                this.zone.run(function () {
                    if (_this.bCompanySearchComponent) {
                        _this.bCompanySearchComponent.active = {
                            'id': '',
                            'text': ''
                        };
                    }
                });
                if (this.uiForm.controls['rsCredit'] !== undefined)
                    this.uiForm.controls['rsCredit'].setValue(temp.rsCredit);
                if (this.uiForm.controls['rsUseAddress'] !== undefined)
                    this.uiForm.controls['rsUseAddress'].setValue(temp.rsUseAddress);
                for (var i in this.pageVariables.requiredFormControlsObj) {
                    if (this.pageVariables.requiredFormControlsObj[i]) {
                        this.pageVariables.requiredFormControlsObj[i] = false;
                        if (i !== 'CompanyCode') {
                            if (this.uiForm.controls[key] !== undefined)
                                this.uiForm.controls[key].setValue(' ');
                        }
                    }
                }
                for (var i in this.pageVariables.requiredFormControlsAfterSave) {
                    if (this.pageVariables.requiredFormControlsAfterSave[i]) {
                        this.pageVariables.requiredFormControlsAfterSave[i] = false;
                        if (this.uiForm.controls[key] !== undefined)
                            this.uiForm.controls[key].setValue(' ');
                    }
                }
                break;
            case 'add':
                break;
            default:
                break;
        }
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.formValidation = function (keyName) {
        var status = 0;
        if (keyName) {
            if (this.uiForm.controls[keyName].value === null) {
                this.pageVariables.requiredFormControlsObj[keyName] = true;
                status = 1;
            }
            else if (this.uiForm.controls[keyName].value.trim() === '') {
                this.pageVariables.requiredFormControlsObj[keyName] = true;
                status = 1;
            }
            else {
                if (keyName === 'CompanyInvoiceNumber') {
                    if (isNaN(this.uiForm.controls[keyName].value)) {
                        this.pageVariables.requiredFormControlsObj[keyName] = true;
                        status = 1;
                    }
                    else {
                        this.pageVariables.requiredFormControlsObj[keyName] = false;
                    }
                }
                else {
                    this.pageVariables.requiredFormControlsObj[keyName] = false;
                }
            }
        }
        else {
            if (this.pageVariables.saveClicked) {
                for (var key in this.pageVariables.requiredFormControlsObj) {
                    if (key) {
                        if (this.uiForm.controls[key].value === null) {
                            this.pageVariables.requiredFormControlsObj[key] = true;
                            status = 1;
                        }
                        else if (this.uiForm.controls[key].value.trim() === '') {
                            this.pageVariables.requiredFormControlsObj[key] = true;
                            status = 1;
                        }
                        else {
                            if (key === 'CompanyInvoiceNumber') {
                                if (isNaN(this.uiForm.controls[key].value)) {
                                    this.pageVariables.requiredFormControlsObj[key] = true;
                                    status = 1;
                                }
                                else {
                                    this.pageVariables.requiredFormControlsObj[key] = false;
                                }
                            }
                            else {
                                this.pageVariables.requiredFormControlsObj[key] = false;
                            }
                        }
                        if (this.pageVariables.requiredFormControlsObj[key] === true) {
                            if (key === 'CompanyCode') {
                                document.querySelector('.ui-select-match .ui-select-toggle')['style'].border = '0px';
                            }
                            status = 1;
                        }
                    }
                }
            }
        }
        return status;
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.formValidationAfterSave = function () {
        var status = 0;
        if (this.pageDisplayFlag.InvoiceReasonCode) {
            this.pageVariables.requiredFormControlsAfterSave['InvoiceReasonCode'] = false;
        }
        for (var key in this.pageVariables.requiredFormControlsAfterSave) {
            if (key) {
                if (this.uiForm.controls[key].value === null) {
                    this.pageVariables.requiredFormControlsAfterSave[key] = true;
                    status = 1;
                }
                else if (this.uiForm.controls[key].value.trim() === '') {
                    this.pageVariables.requiredFormControlsAfterSave[key] = true;
                    status = 1;
                }
                else {
                    if ((key === 'InvoiceReasonCode') || (key === 'CreditReasonCode')) {
                        if (isNaN(this.uiForm.controls[key].value)) {
                            this.pageVariables.requiredFormControlsAfterSave[key] = true;
                            status = 1;
                        }
                        else {
                            this.pageVariables.requiredFormControlsAfterSave[key] = false;
                        }
                    }
                    else {
                        this.pageVariables.requiredFormControlsAfterSave[key] = false;
                    }
                }
            }
        }
        return status;
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.formValidationMakeDescBlank = function () {
        for (var key in this.pageVariables.requiredFormControlsAfterSave) {
            if (this.pageVariables.requiredFormControlsAfterSave[key]) {
                if (key === 'CreditReasonCode') {
                    this.uiForm.controls['CreditReasonDesc'].setValue('');
                }
                if (key === 'InvoiceReasonCode') {
                    this.uiForm.controls['InvoiceReasonDesc'].setValue('');
                }
            }
        }
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.invoiceReasonCodeMsg = function () {
        if (this.pageDisplayFlag.InvoiceReasonCode) {
            if (this.uiForm.controls['InvoiceReasonCode'].value) {
                if (this.uiForm.controls['InvoiceReasonCode'].value.trim() === '') {
                    this.messageModalConfig.content = MessageConstant.PageSpecificMessage.invoiceReasonCodeAbsentError;
                    this.messageModal.show();
                }
            }
        }
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.afterSaveCheckFormMessagesAndSave = function () {
        var _this = this;
        var formVal = this.formValidationAfterSave();
        var formVal2 = this.formValidation();
        this.invoiceReasonCodeMsg();
        if ((formVal === 0) && (formVal2 === 0)) {
            this.zone.run(function () {
                _this.promptConfig.promptFlag = 'afterSaveProcess';
                _this.promptConfig.forSave2.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
                _this.promptConfirmModal2.show();
            });
        }
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.promptConfirm = function (eventObj) {
        switch (this.promptConfig.promptFlag) {
            case 'save':
                this.lookupSearch('CheckSaveFormData');
                break;
            case 'afterSave':
                this.afterSaveCheckFormMessagesAndSave();
                this.formValidationMakeDescBlank();
                break;
            default:
                break;
        }
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.promptConfirm2 = function (eventObj) {
        switch (this.promptConfig.promptFlag) {
            case 'afterSaveProcess':
                this.lookupSearch('SaveFormData');
                this.resetPrompt();
                break;
            default:
                break;
        }
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.promptCancel = function (eventObj) {
        switch (this.promptConfig.promptFlag) {
            case 'save':
                break;
            case 'afterSave':
                var formVal = this.formValidationAfterSave();
                this.resetPrompt();
                break;
            default:
                break;
        }
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.promptCancel2 = function (eventObj) {
        switch (this.promptConfig.promptFlag) {
            case 'afterSaveProcess':
                this.resetPrompt();
                break;
            default:
                break;
        }
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.radioOnlick = function (eventObj) {
        switch (eventObj) {
            case 'rsCredit1':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ReInvoice', 'no');
                this.riExchange.riInputElement.Enable(this.uiForm, 'CreditReasonCode');
                this.pageDisplayFlag.InvoiceReasonCode = false;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceReasonCode', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CreditReasonCode', true);
                this.uiForm.controls['CreditIndividualItems'].enable();
                break;
            case 'rsCredit2':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ReInvoice', 'yes');
                this.riExchange.riInputElement.Enable(this.uiForm, 'CreditReasonCode');
                this.pageDisplayFlag.InvoiceReasonCode = true;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceReasonCode', true);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CreditReasonCode', true);
                this.uiForm.controls['CreditIndividualItems'].disable();
                break;
            default:
                break;
        }
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.resetRadios = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'rsCredit', '1');
        this.pageDisplayFlag.InvoiceReasonCode = false;
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceReasonCode', false);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceReasonDesc', false);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'rsUseAddress', '1');
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.resetPrompt = function () {
        this.promptConfig.promptFlag = 'save';
        this.promptConfig.forSave.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
    };
    CreditAndReInvoiceMaintenanceComponent.prototype.messageModalClose = function () {
    };
    CreditAndReInvoiceMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSACreditAndReInvoiceMaintenance.html',
                    styles: [
                        ".red-bdr span {border-color: transparent !important;}\n        .btn-secondary {\n            background: #fff;\n            border-radius: 0px;\n            border: 1px solid #ffffff !important;\n            color: #007dc5;\n        }\n    "]
                },] },
    ];
    CreditAndReInvoiceMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    CreditAndReInvoiceMaintenanceComponent.propDecorators = {
        'bCompanySearchComponent': [{ type: ViewChild, args: ['bCompanySearchComponent',] },],
        'promptConfirmModal': [{ type: ViewChild, args: ['promptConfirmModal',] },],
        'promptConfirmModal2': [{ type: ViewChild, args: ['promptConfirmModal2',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'InvoiceSearchEllipsis': [{ type: ViewChild, args: ['InvoiceSearchEllipsis',] },],
    };
    return CreditAndReInvoiceMaintenanceComponent;
}(BaseComponent));
