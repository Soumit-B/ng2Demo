var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { ContractSearchComponent } from './../../../internal/search/iCABSAContractSearch';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { Component, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from '../../../../app/base/BaseComponent';
export var YTDMaintenanceComponent = (function (_super) {
    __extends(YTDMaintenanceComponent, _super);
    function YTDMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.controls = [
            { name: 'ContractNumber', readonly: false, disabled: false, required: true },
            { name: 'ContractName', readonly: true, disabled: false, required: false },
            { name: 'PremiseNumber', readonly: false, disabled: false, required: true },
            { name: 'PremiseName', readonly: true, disabled: false, required: false },
            { name: 'ProductCode', readonly: false, disabled: false, required: true },
            { name: 'ProductDesc', readonly: true, disabled: false, required: false },
            { name: 'EntitlementAnnivDate', readonly: true, disabled: true, required: false },
            { name: 'EntitlementAnnualQuantity', readonly: true, disabled: true, required: false },
            { name: 'EntitlementYTDQuantity', readonly: false, disabled: false, required: false }
        ];
        this.entitlementAnnivDate = new Date();
        this.modal = {};
        this.saveMode = false;
        this.autoOpen = true;
        this.promptTitle = '';
        this.promptContent = '';
        this.ellipsisConfig = {
            contract: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'currentContractType': 'C',
                    'currentContractTypeURLParameter': '<contract>',
                    'showAddNew': true
                },
                modalConfig: '',
                contentComponent: ContractSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            premises: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'ContractNumber': '',
                    'ContractName': '',
                    'currentContractType': 'C',
                    'currentContractTypeURLParameter': '<contract>',
                    'showAddNew': true
                },
                modalConfig: '',
                contentComponent: '',
                showHeader: true,
                searchModalRoute: '',
                disabled: true
            },
            product: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'ContractNumber': '',
                    'ContractName': '',
                    'PremiseNumber': '',
                    'PremiseName': '',
                    'currentContractType': 'C',
                    'currentContractTypeURLParameter': '<contract>',
                    'showAddNew': true
                },
                modalConfig: '',
                contentComponent: '',
                showHeader: true,
                searchModalRoute: '',
                disabled: true
            }
        };
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.muleConfig = {
            method: 'contract-management/maintenance',
            module: 'contract-admin',
            operation: 'Application/iCABSAServiceCoverYTDMaintenance',
            contentType: 'application/x-www-form-urlencoded'
        };
        this.dateObjectsEnabled = {
            EntitlementAnnivDate: false
        };
        this.pageId = '';
        this.isRequesting = false;
        this.pageId = PageIdentifier.ICABSASERVICECOVERYTDMAINTENANCE;
        this.pageTitle = 'Service Cover Year To Date Maintenance';
        this.search = this.getURLSearchParamObject();
    }
    YTDMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.populateUIFromFormData();
    };
    YTDMaintenanceComponent.prototype.ngAfterViewInit = function () {
        if (this.autoOpen === true) {
            this.ellipsisConfig.contract.autoOpen = true;
            this.autoOpen = false;
        }
    };
    YTDMaintenanceComponent.prototype.onContractSearchDataReceived = function (data, route) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
        this.ellipsisConfig.premises.childConfigParams.ContractNumber = data.ContractNumber;
        this.ellipsisConfig.product.childConfigParams.ContractNumber = data.ContractNumber;
        if (data.ContractName) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
            this.ellipsisConfig.premises.childConfigParams.ContractName = data.ContractName;
            this.ellipsisConfig.product.childConfigParams.ContractName = data.ContractName;
        }
        this.riMaintenanceSearch();
    };
    YTDMaintenanceComponent.prototype.onPremisesDataReceived = function (data, route) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', data.PremiseNumber);
        this.ellipsisConfig.product.childConfigParams.PremiseNumber = data.PremiseNumber;
        if (data.ContractName) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data.PremiseName);
            this.ellipsisConfig.product.childConfigParams.PremiseName = data.PremiseName;
        }
        this.riMaintenanceSearch();
    };
    YTDMaintenanceComponent.prototype.onProductDataReceived = function (data, route) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', data.ProductCode);
        if (data.ContractName) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data.ProductDesc);
        }
        this.saveMode = false;
        this.setFormMode(this.c_s_MODE_SELECT);
        this.getYTDmaintenanceData('fetch');
    };
    YTDMaintenanceComponent.prototype.modalHiddenContract = function () {
    };
    YTDMaintenanceComponent.prototype.modalHiddenPremises = function () {
    };
    YTDMaintenanceComponent.prototype.modalHiddenProductCode = function () {
    };
    YTDMaintenanceComponent.prototype.onKeyDown = function (event) {
        if (event && event.target) {
            var elementValue = event.target.value;
            var _paddedValue = elementValue;
            if (elementValue.length > 0) {
                if (event.target.id === 'ContractNumber') {
                    if (this.contractNumberEllipsis)
                        this.contractNumberEllipsis.openModal();
                }
                else if (event.target.id === 'PremiseNumber') {
                    if (this.premisesNumberEllipsis)
                        this.premisesNumberEllipsis.openModal();
                }
                else if (event.target.id === 'ProductCode') {
                    if (this.productcodeEllipsis)
                        this.productcodeEllipsis.openModal();
                }
            }
        }
    };
    ;
    YTDMaintenanceComponent.prototype.onBlur = function (event) {
        if (event && event.target) {
            var elementValue = event.target.value;
            var _paddedValue = elementValue;
            if (elementValue.length > 0) {
                if (event.target.id === 'ContractNumber') {
                    event.target.value = this.utils.fillLeadingZeros(elementValue, 8);
                    this.uiForm.controls['ContractNumber'].setValue(event.target.value);
                    this.getContractName();
                    this.getYTDmaintenanceData('fetch');
                }
                else if (event.target.id === 'PremiseNumber') {
                    this.getPremiseName();
                    this.getYTDmaintenanceData('fetch');
                }
                else if (event.target.id === 'ProductCode') {
                    this.saveMode = true;
                    this.setFormMode(this.c_s_MODE_UPDATE);
                    this.getProductName();
                    this.getYTDmaintenanceData('fetch');
                }
            }
        }
    };
    ;
    YTDMaintenanceComponent.prototype.processFormData = function () {
        if (this.saveMode) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'EntitlementAnnivDate');
            this.riExchange.riInputElement.Disable(this.uiForm, 'EntitlementAnnualQuantity');
            this.riExchange.riInputElement.Enable(this.uiForm, 'EntitlementYTDQuantity');
        }
        else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'EntitlementAnnivDate');
            this.riExchange.riInputElement.Disable(this.uiForm, 'EntitlementAnnualQuantity');
            this.riExchange.riInputElement.Disable(this.uiForm, 'EntitlementYTDQuantity');
        }
    };
    YTDMaintenanceComponent.prototype.riMaintenanceSearch = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') === '') {
            if (this.contractNumberEllipsis)
                this.contractNumberEllipsis.openModal();
        }
        if ((this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '') &&
            (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') === '')) {
            if (this.premisesNumberEllipsis)
                this.premisesNumberEllipsis.openModal();
        }
        if ((this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '') &&
            (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '')) {
            if (this.productcodeEllipsis)
                this.productcodeEllipsis.openModal();
        }
    };
    YTDMaintenanceComponent.prototype.onSubmit = function (formdata, valid, event) {
        event.preventDefault();
        this.promptContent = MessageConstant.Message.ConfirmRecord;
        this.promptModal.show();
    };
    YTDMaintenanceComponent.prototype.onCancel = function () {
        this.setFormMode(this.c_s_MODE_SELECT);
        this.getYTDmaintenanceData('cancel');
        this.processFormData();
    };
    YTDMaintenanceComponent.prototype.getYTDmaintenanceData = function (actionMode) {
        var _this = this;
        if (!this.uiForm.valid) {
            this.saveMode = false;
            this.setFormMode(this.c_s_MODE_SELECT);
            return;
        }
        var params = {
            'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
            'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode')
        };
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EntitlementAnnivDate', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EntitlementAnnualQuantity', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EntitlementYTDQuantity', '');
        this.saveMode = false;
        this.setFormMode(this.c_s_MODE_SELECT);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchRecordData('', params).subscribe(function (e) {
            if (e.status === 'failure') {
                _this.saveMode = false;
                _this.setFormMode(_this.c_s_MODE_SELECT);
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e.errorMessage || e.error_description) {
                    _this.saveMode = false;
                    _this.setFormMode(_this.c_s_MODE_SELECT);
                    _this.showErrorMessage(e.errorMessage);
                }
                else {
                    _this.modal = e;
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EntitlementAnnivDate', e.EntitlementAnnivDate ? e.EntitlementAnnivDate : '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EntitlementAnnualQuantity', e.EntitlementAnnualQuantity ? e.EntitlementAnnualQuantity : '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EntitlementYTDQuantity', e.EntitlementYTDQuantity ? e.EntitlementYTDQuantity : '');
                    switch (actionMode) {
                        case 'fetch':
                            _this.saveMode = true;
                            _this.setFormMode(_this.c_s_MODE_UPDATE);
                            break;
                        case 'cancel':
                            _this.saveMode = true;
                            _this.setFormMode(_this.c_s_MODE_SELECT);
                            break;
                        default:
                            _this.saveMode = false;
                            break;
                    }
                    _this.processFormData();
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.saveMode = false;
            _this.setFormMode(_this.c_s_MODE_SELECT);
            _this.showErrorMessage(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    YTDMaintenanceComponent.prototype.fetchRecordData = function (functionName, params) {
        var querydata = new URLSearchParams();
        querydata.set(this.serviceConstants.BusinessCode, this.businessCode());
        querydata.set(this.serviceConstants.CountryCode, this.countryCode());
        querydata.set(this.serviceConstants.Action, '0');
        if (functionName !== '') {
            querydata.set(this.serviceConstants.Action, '6');
            querydata.set('Function', functionName);
        }
        for (var key in params) {
            if (key) {
                querydata.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, querydata);
    };
    YTDMaintenanceComponent.prototype.updateRecordData = function () {
        var _this = this;
        var formdata = {};
        var querydata = new URLSearchParams();
        querydata.set(this.serviceConstants.BusinessCode, this.businessCode());
        querydata.set(this.serviceConstants.CountryCode, this.countryCode());
        querydata.set(this.serviceConstants.Action, '2');
        formdata['ServiceCoverROWID'] = this.modal['ServiceCover'];
        formdata['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        formdata['PremiseNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        formdata['ProductCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
        formdata['EntitlementAnnivDate'] = this.utils.formatDate(this.entitlementAnnivDate);
        formdata['EntitlementAnnualQuantity'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'EntitlementAnnualQuantity');
        formdata['EntitlementYTDQuantity'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'EntitlementYTDQuantity');
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, querydata, formdata).subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
            }
        }, function (error) {
            _this.showErrorMessage(error);
        });
    };
    YTDMaintenanceComponent.prototype.showErrorMessage = function (msgTxt, type) {
        var titleModal = '';
        if (!type)
            type = 0;
        switch (type) {
            default:
            case 0:
                titleModal = 'Error Message';
                break;
            case 1:
                titleModal = 'Success Message';
                break;
            case 2:
                titleModal = 'Warning Message';
                break;
        }
        this.messageModal.show({ msg: msgTxt, title: titleModal }, false);
    };
    YTDMaintenanceComponent.prototype.promptSave = function (event) {
        this.updateRecordData();
    };
    YTDMaintenanceComponent.prototype.getContractName = function () {
        var lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'ContractNumber': this.uiForm.controls['ContractNumber'].value, 'BusinessCode': this.businessCode()
                },
                'fields': ['ContractName']
            }
        ];
        this.lookupData(lookupIP, 'Contract');
    };
    YTDMaintenanceComponent.prototype.getPremiseName = function () {
        var lookupIP = [
            {
                'table': 'Premise',
                'query': {
                    'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                    'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
                    'BusinessCode': this.businessCode()
                },
                'fields': ['PremiseName']
            }
        ];
        this.lookupData(lookupIP, 'Premise');
    };
    YTDMaintenanceComponent.prototype.getProductName = function () {
        var lookupIP = [
            {
                'table': 'Product',
                'query': {
                    'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                    'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
                    'ProductCode': this.uiForm.controls['ProductCode'].value,
                    'BusinessCode': this.businessCode()
                },
                'fields': ['ProductDesc']
            }
        ];
        this.lookupData(lookupIP, 'Product');
    };
    YTDMaintenanceComponent.prototype.lookupData = function (lookupIP, mode) {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            switch (mode) {
                case 'Contract':
                    if (data && data[0][0] && data[0][0].ContractName) {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', data[0][0].ContractName);
                    }
                    else {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', '');
                    }
                    break;
                case 'Premise':
                    if (data && data[0][0] && data[0][0].PremiseName) {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', data[0][0].PremiseName);
                    }
                    else {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', '');
                    }
                    break;
                case 'Product':
                    if (data && data[0][0] && data[0][0].ProductDesc) {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', data[0][0].ProductDesc);
                    }
                    else {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', '');
                    }
                    break;
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    YTDMaintenanceComponent.prototype.onBackLinkClick = function (event) {
        event.preventDefault();
        this.location.back();
    };
    YTDMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverYTDMaintenance.html'
                },] },
    ];
    YTDMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    YTDMaintenanceComponent.propDecorators = {
        'contractNumberEllipsis': [{ type: ViewChild, args: ['contractNumberEllipsis',] },],
        'premisesNumberEllipsis': [{ type: ViewChild, args: ['premisesNumberEllipsis',] },],
        'productcodeEllipsis': [{ type: ViewChild, args: ['productcodeEllipsis',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return YTDMaintenanceComponent;
}(BaseComponent));
