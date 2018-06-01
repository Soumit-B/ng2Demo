var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { Component, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
export var ServiceCoverSelectMaintenanceComponent = (function (_super) {
    __extends(ServiceCoverSelectMaintenanceComponent, _super);
    function ServiceCoverSelectMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [{ name: 'ContractNumber', readonly: false, disabled: false, required: false },
            { name: 'ContractName', readonly: false, disabled: true, required: false },
            { name: 'PremiseNumber', readonly: false, disabled: false, required: false },
            { name: 'PremiseName', readonly: false, disabled: true, required: false },
            { name: 'ProductCode', readonly: false, disabled: false, required: false },
            { name: 'ProductDesc', readonly: false, disabled: true, required: false },
            { name: 'Status', readonly: false, disabled: true, required: false },
            { name: 'ServiceCommenceDate', readonly: false, disabled: true, required: false },
            { name: 'ServiceVisitFrequency', readonly: false, disabled: true, required: false },
            { name: 'ServiceQuantity', readonly: false, disabled: true, required: false },
            { name: 'ServiceAnnualValue', readonly: false, disabled: true, required: false },
            { name: 'ActionType', readonly: false, disabled: false, required: false },
            { name: 'CompositeInd', readonly: false, disabled: false, required: false },
            { name: 'LostBusinessRequestNumber', readonly: false, disabled: false, required: false },
            { name: 'AccountNumber', readonly: false, disabled: false, required: false },
            { name: 'AccountName', readonly: false, disabled: false, required: false },
            { name: 'InvoiceFrequencyCode', readonly: false, disabled: false, required: false },
            { name: 'InvoiceAnnivDate', readonly: false, disabled: false, required: false },
            { name: 'GotStatus', readonly: false, disabled: false, required: false },
            { name: 'ServiceCoverROWID', readonly: false, disabled: false, required: false },
            { name: 'findResult', readonly: false, disabled: false, required: false }];
        this.ellipseConfig = {
            contractSearchComponent: {
                inputParams: {
                    parentMode: 'LookUp',
                    businessCode: this.utils.getBusinessCode(),
                    countryCode: this.utils.getCountryCode(),
                    ContractNumber: '',
                    currentContractType: ''
                },
                isDisabled: false,
                isRequired: false,
                showCloseButton: true,
                config: {
                    ignoreBackdropClick: true
                },
                showHeader: true,
                autoOpen: false
            },
            premiseSearchComponent: {
                inputParams: {
                    parentMode: 'LookUp',
                    businessCode: this.utils.getBusinessCode(),
                    countryCode: this.utils.getCountryCode(),
                    ContractNumber: ''
                },
                isDisabled: false,
                isRequired: false,
                showCloseButton: true,
                config: {
                    ignoreBackdropClick: true
                },
                showHeader: true,
                autoOpen: false
            },
            serviceCoverSearchComponent: {
                inputParams: {
                    parentMode: 'Search',
                    businessCode: this.utils.getBusinessCode(),
                    countryCode: this.utils.getCountryCode(),
                    ContractNumber: '',
                    ContractName: '',
                    PremiseNumber: '',
                    PremiseName: ''
                },
                isDisabled: false,
                isRequired: false,
                showCloseButton: true,
                config: {
                    ignoreBackdropClick: true
                },
                showHeader: true,
                autoOpen: false
            }
        };
        this.contractSearchComponent = ContractSearchComponent;
        this.premiseSearchComponent = PremiseSearchComponent;
        this.serviceCoverSearchComponent = ServiceCoverSearchComponent;
        this.pageVariables = {
            savecancelFlag: true,
            isRequesting: false
        };
        this.xhrParams = {
            method: 'contract-management/maintenance',
            module: 'service-cover',
            operation: 'Application/iCABSAServiceCoverSelectMaintenance'
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
            isRequesting: false
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
        this.datePickerConfig = {
            serviceCommencementDate: {
                dt: null
            }
        };
        this.dropdownConfig = {
            menu: {
                dropdownValues: []
            }
        };
        this.menu = '';
        this.formKeys = [];
        this.pageId = PageIdentifier.ICABSASERVICECOVERSELECTMAINTENANCE;
        this.pageTitle = '';
    }
    ServiceCoverSelectMaintenanceComponent.prototype.contractSearchDataReceived = function (eventObj) {
        this.uiForm.reset();
        this.datePickerConfig.serviceCommencementDate.dt = null;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', eventObj.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', eventObj.ContractName);
        this.ellipseConfig.premiseSearchComponent.inputParams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        this.ellipseConfig.serviceCoverSearchComponent.inputParams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        this.ellipseConfig.serviceCoverSearchComponent.inputParams.ContractName = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
        this.setFormMode(this.c_s_MODE_UPDATE);
    };
    ServiceCoverSelectMaintenanceComponent.prototype.premiseSearchDataReceived = function (eventObj) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', eventObj.PremiseNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', eventObj.PremiseName);
        this.ellipseConfig.serviceCoverSearchComponent.inputParams.PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        this.ellipseConfig.serviceCoverSearchComponent.inputParams.PremiseName = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
        this.resetFields();
    };
    ServiceCoverSelectMaintenanceComponent.prototype.serviceCoverSearchDataReceived = function (eventObj) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', eventObj.ProductCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', eventObj.ProductDesc);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverROWID', eventObj.row.ttServiceCover);
        this.lookupSearch('AfterFetch');
    };
    ServiceCoverSelectMaintenanceComponent.prototype.selectedCommenceDdate = function (eventObj) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCommenceDate', eventObj.value);
    };
    ServiceCoverSelectMaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = this.riExchange.getCurrentContractTypeLabel() + ' Service Cover Select';
        this.ellipseConfig.contractSearchComponent.inputParams.currentContractType = this.riExchange.getCurrentContractType();
        this.initForm();
        this.uiFormValueChanges = this.uiForm.statusChanges.subscribe(function (value) {
            _this.formChanges(value);
        });
        this.checkUrlParams();
        this.logicOnParentMode();
        this.getFormKeys();
    };
    ServiceCoverSelectMaintenanceComponent.prototype.ngAfterViewInit = function () {
        this.ellipseConfig.contractSearchComponent.autoOpen = true;
    };
    ServiceCoverSelectMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        this.uiFormValueChanges.unsubscribe();
    };
    ServiceCoverSelectMaintenanceComponent.prototype.resetFields = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'Status', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceQuantity', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceAnnualValue', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCommenceDate', '');
        this.datePickerConfig.serviceCommencementDate.dt = void 0;
    };
    ServiceCoverSelectMaintenanceComponent.prototype.checkUrlParams = function () {
        if (!this.URLParameterContains('Pending')) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ActionType', 'Pending');
            this.dropdownConfig.menu.dropdownValues = [{ text: 'Service Cover', value: 'Service Cover' }, { text: 'Request', value: 'Request' }];
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ActionType', '');
            this.dropdownConfig.menu.dropdownValues = [{ text: 'Pro Rata Charge', value: 'Pro Rata Charge' }];
        }
    };
    ServiceCoverSelectMaintenanceComponent.prototype.logicOnParentMode = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessRequestNumber', this.riExchange.getParentHTMLValue('LostBusinessRequestNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverROWID', this.riExchange.getParentHTMLValue('ServiceCoverROWID'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.riExchange.getParentHTMLValue('ContractTypeCode'));
        var parentMode = this.riExchange.getParentMode();
        switch (parentMode) {
            case 'Contact':
            case 'ServiceCoverLocation':
            case 'ServiceCoverLocationMove':
            case 'ContactManagement':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessRequestNumber', this.riExchange.getParentHTMLValue('LostBusinessRequestNumber'));
                if (parentMode === 'Contact') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', this.riExchange.getParentHTMLValue('AccountNumber'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountName', this.riExchange.getParentHTMLValue('AccountName'));
                }
                break;
            default:
                break;
        }
    };
    ServiceCoverSelectMaintenanceComponent.prototype.formChanges = function (obj) {
        if (obj === 'VALID') {
            this.pageVariables.savecancelFlag = false;
        }
        else {
            this.pageVariables.savecancelFlag = true;
        }
    };
    ServiceCoverSelectMaintenanceComponent.prototype.initForm = function () {
        this.riExchange.renderForm(this.uiForm, this.controls);
    };
    ServiceCoverSelectMaintenanceComponent.prototype.promptConfirm = function (eventObj) {
        switch (this.promptConfig.promptFlag) {
            case 'save':
                break;
            default:
                break;
        }
    };
    ServiceCoverSelectMaintenanceComponent.prototype.promptCancel = function (eventObj) {
        switch (this.promptConfig.promptFlag) {
            case 'save':
                break;
            default:
                break;
        }
    };
    ServiceCoverSelectMaintenanceComponent.prototype.errorMessageModal = function (msg) {
        this.messageModalConfig.content = MessageConstant.Message.noRecordFound;
        msg = msg || MessageConstant.Message.noRecordFound;
        this.messageModal.show({ msg: msg }, false);
    };
    ServiceCoverSelectMaintenanceComponent.prototype.lookupSearch = function (key) {
        var _this = this;
        switch (key) {
            case 'ContractNumber':
                var contractNumber_1;
                contractNumber_1 = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                if (contractNumber_1.toString() === '') {
                    this.setFormMode(this.c_s_MODE_SELECT);
                    this.uiForm.reset();
                    this.datePickerConfig.serviceCommencementDate.dt = null;
                    break;
                }
                contractNumber_1 = this.utils.fillLeadingZeros(contractNumber_1, 8);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', contractNumber_1);
                var queryParams = new URLSearchParams();
                queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                var lookupQuery = void 0;
                queryParams.set(this.serviceConstants.Action, '5');
                lookupQuery = [{
                        'table': 'Contract',
                        'query': { 'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'), 'BusinessCode': this.utils.getBusinessCode() },
                        'fields': ['ContractName']
                    }];
                this.pageVariables.isRequesting = true;
                this.ajaxSource.next(this.ajaxconstant.START);
                this.invokeLookupSearch(queryParams, lookupQuery).subscribe(function (value) {
                    if (value.results !== null) {
                        if (value.results[0].length === 0) {
                            _this.errorMessageModal();
                            _this.setFormMode(_this.c_s_MODE_SELECT);
                            _this.uiForm.reset();
                            _this.datePickerConfig.serviceCommencementDate.dt = null;
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractNumber', contractNumber_1);
                        }
                        else {
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', value.results[0][0].ContractName);
                            _this.setFormMode(_this.c_s_MODE_UPDATE);
                        }
                    }
                    else {
                        _this.errorMessageModal();
                        _this.setFormMode(_this.c_s_MODE_SELECT);
                        _this.uiForm.reset();
                        _this.datePickerConfig.serviceCommencementDate.dt = null;
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractNumber', contractNumber_1);
                    }
                }, function (error) {
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    _this.pageVariables.isRequesting = false;
                }, function () {
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    _this.pageVariables.isRequesting = false;
                });
                break;
            case 'PremiseNumber':
                var premiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
                if (premiseNumber.toString() === '') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
                    this.resetFields();
                    break;
                }
                queryParams = new URLSearchParams();
                queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                queryParams.set(this.serviceConstants.Action, '5');
                lookupQuery = [{
                        'table': 'Premise',
                        'query': { 'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'), 'BusinessCode': this.utils.getBusinessCode(), 'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') },
                        'fields': ['PremiseName']
                    }];
                this.pageVariables.isRequesting = true;
                this.ajaxSource.next(this.ajaxconstant.START);
                this.invokeLookupSearch(queryParams, lookupQuery).subscribe(function (value) {
                    if (value.results !== null) {
                        if (value.results[0].length === 0) {
                            _this.errorMessageModal();
                        }
                        else {
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', value.results[0][0].PremiseName);
                        }
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductCode', '');
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', '');
                        _this.resetFields();
                    }
                    else {
                        _this.errorMessageModal();
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', '');
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductCode', '');
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', '');
                        _this.resetFields();
                    }
                }, function (error) {
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    _this.pageVariables.isRequesting = false;
                }, function () {
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    _this.pageVariables.isRequesting = false;
                });
                break;
            case 'ProductCode':
                var productCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
                if (productCode.toString() === '') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
                    this.resetFields();
                    break;
                }
                queryParams = new URLSearchParams();
                queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                queryParams.set(this.serviceConstants.Action, '5');
                lookupQuery = [{
                        'table': 'Product',
                        'query': { 'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'), 'BusinessCode': this.utils.getBusinessCode() },
                        'fields': ['ProductDesc']
                    }];
                this.pageVariables.isRequesting = true;
                this.ajaxSource.next(this.ajaxconstant.START);
                this.invokeLookupSearch(queryParams, lookupQuery).subscribe(function (value) {
                    if (value.results[0] !== null) {
                        if (value.results[0].length === 0) {
                            _this.errorMessageModal();
                        }
                        else {
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', value.results[0][0].ProductDesc);
                            _this.lookupSearch('AfterFetch');
                        }
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', '');
                        _this.resetFields();
                    }
                    else {
                        _this.errorMessageModal();
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', '');
                        _this.resetFields();
                    }
                }, function (error) {
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    _this.pageVariables.isRequesting = false;
                }, function () {
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    _this.pageVariables.isRequesting = false;
                });
                break;
            case 'AfterFetch':
                queryParams = new URLSearchParams();
                queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                queryParams.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
                queryParams.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
                queryParams.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
                queryParams.set('ContractTypeCode', this.riExchange.getCurrentContractType());
                queryParams.set(this.serviceConstants.Action, '0');
                this.ajaxSource.next(this.ajaxconstant.START);
                var dlContract = this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, queryParams).subscribe(function (data) {
                    if (data['status'] === GlobalConstant.Configuration.Failure) {
                        _this.errorService.emitError(data['oResponse']);
                    }
                    else if (data['errorMessage']) {
                        _this.errorMessageModal(data['errorMessage'] + ' ' + data['fullError']);
                        _this.resetFields();
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', '');
                        return;
                    }
                    for (var key_1 in data) {
                        if (key_1) {
                            if (_this.formKeys.indexOf(key_1) > -1) {
                                _this.riExchange.riInputElement.SetValue(_this.uiForm, key_1, data[key_1]);
                                if (key_1 === 'ServiceCommenceDate') {
                                    var serviceCommenceDateDisplay = '';
                                    if (window['moment'](data[key_1], 'DD/MM/YYYY', true).isValid()) {
                                        serviceCommenceDateDisplay = _this.utils.convertDateString(data[key_1]);
                                    }
                                    if (!serviceCommenceDateDisplay) {
                                        _this.datePickerConfig.serviceCommencementDate.dt = null;
                                    }
                                    else {
                                        _this.datePickerConfig.serviceCommencementDate.dt = new Date(serviceCommenceDateDisplay);
                                    }
                                }
                            }
                        }
                    }
                });
                break;
            default:
                break;
        }
    };
    ServiceCoverSelectMaintenanceComponent.prototype.invokeLookupSearch = function (queryParams, data) {
        this.ajaxSource.next(this.ajaxconstant.START);
        return this.httpService.lookUpRequest(queryParams, data);
    };
    ServiceCoverSelectMaintenanceComponent.prototype.getFormKeys = function () {
        for (var j = 0; j < this.controls.length; j++) {
            this.formKeys.push(this.controls[j].name);
        }
    };
    ServiceCoverSelectMaintenanceComponent.prototype.messageModalClose = function () {
    };
    ServiceCoverSelectMaintenanceComponent.prototype.URLParameterContains = function (param) {
        var flag = false;
        var routerParams = this.riExchange.routerParams;
        for (var key in routerParams) {
            if (key.indexOf(param) > -1)
                flag = true;
        }
        return flag;
    };
    ;
    ServiceCoverSelectMaintenanceComponent.prototype.menuOnchange = function () {
        var menu = this.menu;
        switch (menu) {
            case 'Request':
                this.messageModal.show({ msg: 'iCABSALostBusinessRequestSearch is under construction', title: 'Message' }, false);
                break;
            case 'Service Cover':
                this.navigate('Request', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                    parentMode: 'Request',
                    mode: 'Request',
                    ContractNumber: this.getControlValue('ContractNumber'),
                    ContractName: this.getControlValue('ContractName'),
                    PremiseNumber: this.getControlValue('PremiseNumber'),
                    PremiseName: this.getControlValue('PremiseName'),
                    ProductCode: this.getControlValue('ProductCode'),
                    ProductDesc: this.getControlValue('ProductDesc')
                });
                break;
            case 'Pro Rata Charge':
                this.navigate('ServiceCover', 'grid/application/proRatacharge/summary', { parentMode: 'ServiceCover', mode: 'ServiceCover' });
                break;
            default:
                break;
        }
    };
    ServiceCoverSelectMaintenanceComponent.prototype.searchFunctionality = function () {
        this.lookupSearch('AfterFetch');
    };
    ServiceCoverSelectMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverSelectMaintenance.html'
                },] },
    ];
    ServiceCoverSelectMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    ServiceCoverSelectMaintenanceComponent.propDecorators = {
        'promptConfirmModal': [{ type: ViewChild, args: ['promptConfirmModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return ServiceCoverSelectMaintenanceComponent;
}(BaseComponent));
