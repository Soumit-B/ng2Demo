var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MessageConstant } from './../../../shared/constants/message.constant';
import { URLSearchParams } from '@angular/http';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from './../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
export var ServiceCoverCommenceDateMaintenanceExComponent = (function (_super) {
    __extends(ServiceCoverCommenceDateMaintenanceExComponent, _super);
    function ServiceCoverCommenceDateMaintenanceExComponent(injector) {
        _super.call(this, injector);
        this.showMessageHeaderSave = true;
        this.showHeader = true;
        this.showPromptCloseButtonSave = true;
        this.promptTitleSave = '';
        this.promptContentSave = MessageConstant.Message.ConfirmRecord;
        this.promptModalConfigSave = {
            ignoreBackdropClick: true
        };
        this.showMessageHeader = true;
        this.showErrorHeader = true;
        this.isDisabled = true;
        this.pageId = '';
        this.search = new URLSearchParams();
        this.statusSearch = new URLSearchParams();
        this.inputParams = {};
        this.queryParams = {
            operation: 'Application/iCABSAServiceCoverCommenceDateMaintenanceEx',
            module: 'service-cover',
            method: 'contract-management/maintenance'
        };
        this.serviceCoverRowID = '';
        this.commencedateValidationFlag = 0;
        this.controls = [
            { name: 'ContractNumber', required: true },
            { name: 'ContractName', required: false },
            { name: 'Status', required: true },
            { name: 'PremiseNumber', required: true },
            { name: 'PremiseName', required: false },
            { name: 'ProductCode', required: true },
            { name: 'ProductDesc', required: false },
            { name: 'AccountNumber', required: false },
            { name: 'AccountName', required: false },
            { name: 'ContractAddressLine1', required: false },
            { name: 'ContractAddressLine2', required: false },
            { name: 'ContractAddressLine3', required: false },
            { name: 'ContractAddressLine4', required: false },
            { name: 'ContractAddressLine5', required: false },
            { name: 'ContractPostcode', required: false },
            { name: 'ServiceAnnualValue', required: false },
            { name: 'ServiceCommenceDate', required: true },
            { name: 'ServiceVisitAnnivDate', required: true }
        ];
        this.pageId = PageIdentifier.ICABSASERVICECOVERCOMMENCEDATEMAINTENANCEEX;
    }
    ServiceCoverCommenceDateMaintenanceExComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Service Cover Commence Date Maintenance';
        this.window_onload();
    };
    ServiceCoverCommenceDateMaintenanceExComponent.prototype.window_onload = function () {
        this.riMaintenance.CustomBusinessObjectSelect = false;
        this.riMaintenance.CustomBusinessObjectConfirm = false;
        this.riMaintenance.CustomBusinessObjectInsert = false;
        this.riMaintenance.CustomBusinessObjectUpdate = true;
        this.riMaintenance.CustomBusinessObjectDelete = false;
        this.riMaintenance.FunctionSnapShot = false;
        this.riMaintenance.FunctionAdd = false;
        this.riMaintenance.FunctionDelete = false;
        if (this.parentMode !== '') {
            this.riMaintenance.FunctionSelect = false;
        }
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.lookupFormData();
        if (this.parentMode !== '') {
            this.serviceCoverRowID = this.riExchange.getParentHTMLValue('ServiceCoverRowID');
        }
        this.otherLookupFn();
        this.riMaintenance.FetchRecord();
        this.riMaintenance.FetchRecord();
        if (this.riMaintenance.RecordSelected(false)) {
            this.riMaintenance.UpdateMode();
        }
    };
    ServiceCoverCommenceDateMaintenanceExComponent.prototype.ngAfterViewInit = function () {
        this.setMessageCallback(this);
        this.setErrorCallback(this);
    };
    ;
    ServiceCoverCommenceDateMaintenanceExComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show(data, true);
    };
    ;
    ServiceCoverCommenceDateMaintenanceExComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };
    ;
    ServiceCoverCommenceDateMaintenanceExComponent.prototype.commenceDateSelectedValue = function (value) {
        this.uiForm.controls['ServiceCommenceDate'].setValue('');
        this.commencedateValidationFlag = this.commencedateValidationFlag + 1;
        if (value && value.value) {
            this.uiForm.controls['ServiceCommenceDate'].setValue(value.value);
            if (this.commencedateValidationFlag > 2) {
                this.commencedateValidation(value.value);
            }
        }
    };
    ServiceCoverCommenceDateMaintenanceExComponent.prototype.anniversaryDateSelectedValue = function (value) {
        this.uiForm.controls['ServiceVisitAnnivDate'].setValue('');
        if (value && value.value) {
            this.uiForm.controls['ServiceVisitAnnivDate'].setValue(value.value);
        }
    };
    ServiceCoverCommenceDateMaintenanceExComponent.prototype.lookupFormData = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'ServiceCover',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber')
                },
                'fields': ['ContractNumber', 'PremiseNumber', 'ProductCode', 'ServiceCommenceDate', 'ServiceVisitAnnivDate', 'ServiceAnnualValue']
            },
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber')
                },
                'fields': ['ContractName', 'AccountNumber']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber')
                },
                'fields': ['PremiseName']
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductCode': this.getControlValue('ProductCode')
                },
                'fields': ['ProductDesc']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data.length > 0) {
                var serviceCoverData = data[0];
                var contractData = data[1];
                var premiseData = data[2];
                var productData = data[3];
                if (serviceCoverData.length > 0) {
                    for (var i = 0; i < serviceCoverData.length; i++) {
                        if (serviceCoverData[i].ttServiceCover === _this.serviceCoverRowID) {
                            _this.setControlValue('ContractNumber', serviceCoverData[i].ContractNumber);
                            _this.setControlValue('PremiseNumber', serviceCoverData[i].PremiseNumber);
                            _this.setControlValue('ProductCode', serviceCoverData[i].ProductCode);
                            _this.commenceDate = new Date(serviceCoverData[i].ServiceCommenceDate);
                            _this.anniversaryDate = new Date(serviceCoverData[i].ServiceVisitAnnivDate);
                            _this.setControlValue('ServiceCommenceDate', _this.commenceDate);
                            _this.setControlValue('ServiceVisitAnnivDate', _this.anniversaryDate);
                            _this.setControlValue('ServiceAnnualValue', serviceCoverData[i].ServiceAnnualValue);
                        }
                    }
                }
                if (contractData.length > 0) {
                    _this.setControlValue('AccountNumber', contractData[0].AccountNumber);
                    _this.setControlValue('ContractName', contractData[0].ContractName);
                }
                if (premiseData.length > 0) {
                    _this.setControlValue('PremiseName', premiseData[0].PremiseName);
                }
                if (productData.length > 0) {
                    _this.setControlValue('ProductDesc', productData[0].ProductDesc);
                }
            }
        });
    };
    ;
    ServiceCoverCommenceDateMaintenanceExComponent.prototype.otherLookupFn = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Account',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'AccountNumber': this.getControlValue('AccountNumber')
                },
                'fields': ['AccountName', 'AccountAddressLine1', 'AccountAddressLine2', 'AccountAddressLine3', 'AccountAddressLine4', 'AccountAddressLine5', 'AccountPostcode']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data.length > 0) {
                var accountData = data[0];
                if (accountData.length > 0) {
                    _this.setControlValue('AccountName', accountData[0].AccountName);
                    _this.setControlValue('ContractAddressLine1', accountData[0].AccountAddressLine1);
                    _this.setControlValue('ContractAddressLine2', accountData[0].AccountAddressLine2);
                    _this.setControlValue('ContractAddressLine3', accountData[0].AccountAddressLine3);
                    _this.setControlValue('ContractAddressLine4', accountData[0].AccountAddressLine4);
                    _this.setControlValue('ContractAddressLine5', accountData[0].AccountAddressLine5);
                    _this.setControlValue('ContractPostcode', accountData[0].AccountPostcode);
                }
                _this.getStatus();
            }
        });
    };
    ;
    ServiceCoverCommenceDateMaintenanceExComponent.prototype.getStatus = function () {
        var _this = this;
        this.statusSearch = this.getURLSearchParamObject();
        var formdata = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.statusSearch.set(this.serviceConstants.Action, '6');
        this.statusSearch.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.statusSearch.set(this.serviceConstants.CountryCode, this.countryCode());
        formdata['Function'] = 'GetStatus';
        formdata['SCRowID'] = this.serviceCoverRowID;
        this.inputParams.selectsearch = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.statusSearch, formdata)
            .subscribe(function (data) {
            if (data.hasError) {
                _this.errorService.emitError(data);
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'Status', data.Status);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
        });
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
    };
    ServiceCoverCommenceDateMaintenanceExComponent.prototype.commencedateValidation = function (event) {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        var formdata = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        formdata['ServiceCommenceDate'] = this.getControlValue('ServiceCommenceDate');
        formdata['Function'] = 'GetAnniversaryDate,WarnCommenceDate';
        formdata['SCRowID'] = this.serviceCoverRowID;
        this.inputParams.selectsearch = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.search, formdata)
            .subscribe(function (data) {
            if (data.hasError) {
                _this.errorService.emitError(data);
            }
            else {
                if (data.hasOwnProperty('ErrorMessage') && (data.ErrorMessage.trim() !== '')) {
                    _this.errorModal.show({ msg: data.ErrorMessage.split('|'), title: 'Error' }, false);
                    var dtStr = _this.getControlValue('ServiceCommenceDate');
                    _this.anniversaryDate = new Date(_this.utils.convertDate(dtStr));
                    _this.setControlValue('ServiceVisitAnnivDate', dtStr);
                }
                else {
                    var dtStr = _this.getControlValue('ServiceCommenceDate');
                    _this.anniversaryDate = new Date(_this.utils.convertDate(dtStr));
                    _this.setControlValue('ServiceVisitAnnivDate', dtStr);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ;
    ServiceCoverCommenceDateMaintenanceExComponent.prototype.onSave = function () {
        this.uiForm.controls['ServiceVisitAnnivDate'].markAsTouched();
        this.uiForm.controls['ServiceCommenceDate'].markAsTouched();
        this.CommencePicker.validateDateField();
        this.annivDatePicker.validateDateField();
        if (this.riExchange.validateForm(this.uiForm)) {
            this.otherLookupFn();
            this.promptModalForSave.show();
        }
    };
    ServiceCoverCommenceDateMaintenanceExComponent.prototype.promptContentSaveData = function (eventObj) {
        var _this = this;
        var formdata = {};
        var queryPost = this.getURLSearchParamObject();
        queryPost.set(this.serviceConstants.Action, '2');
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        formdata['ServiceCoverROWID'] = this.serviceCoverRowID;
        formdata['ContractNumber'] = this.getControlValue('ContractNumber');
        formdata['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formdata['ProductCode'] = this.getControlValue('ProductCode');
        formdata['ServiceCommenceDate'] = this.getControlValue('ServiceCommenceDate');
        formdata['ServiceVisitAnnivDate'] = this.getControlValue('ServiceVisitAnnivDate');
        formdata['ServiceAnnualValue'] = this.getControlValue('ServiceAnnualValue');
        formdata['Function'] = 'GetStatus';
        formdata['SCRowID'] = this.serviceCoverRowID;
        this.inputParams.search = queryPost;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, queryPost, formdata)
            .subscribe(function (data) {
            if (data.hasError) {
                _this.errorService.emitError(data);
            }
            else {
                _this.confirmOkModal.show({ msg: MessageConstant.Message.SavedSuccessfully, title: 'Message' }, false);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverCommenceDateMaintenanceExComponent.prototype.onCancel = function () {
        this.navigate('', '/billtocash/servicecover/acceptGrid');
    };
    ServiceCoverCommenceDateMaintenanceExComponent.prototype.confirmok = function () {
        this.navigate('', '/billtocash/servicecover/acceptGrid');
    };
    ServiceCoverCommenceDateMaintenanceExComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverCommenceDateMaintenanceEx.html'
                },] },
    ];
    ServiceCoverCommenceDateMaintenanceExComponent.ctorParameters = [
        { type: Injector, },
    ];
    ServiceCoverCommenceDateMaintenanceExComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'confirmOkModal': [{ type: ViewChild, args: ['confirmOkModal',] },],
        'promptModalForSave': [{ type: ViewChild, args: ['promptModalForSave',] },],
        'CommencePicker': [{ type: ViewChild, args: ['CommencePicker',] },],
        'annivDatePicker': [{ type: ViewChild, args: ['annivDatePicker',] },],
    };
    return ServiceCoverCommenceDateMaintenanceExComponent;
}(BaseComponent));
