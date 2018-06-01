var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { ViewChild } from '@angular/core';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { CBBService } from '../../../shared/services/cbb.service';
import { Component, Injector } from '@angular/core';
export var ServiceCoverFrequencyMaintenanceComponent = (function (_super) {
    __extends(ServiceCoverFrequencyMaintenanceComponent, _super);
    function ServiceCoverFrequencyMaintenanceComponent(injector, cbb) {
        _super.call(this, injector);
        this.cbb = cbb;
        this.pageId = '';
        this.queryParams = {
            operation: 'Application/iCABSAServiceCoverFrequencyMaintenance',
            module: 'service-cover',
            method: 'contract-management/maintenance'
        };
        this.controls = [
            { name: 'ContractNumber', required: true },
            { name: 'ContractName', required: true, disabled: true },
            { name: 'Status', disabled: true },
            { name: 'PremiseNumber', required: true },
            { name: 'PremiseName', required: true, disabled: true },
            { name: 'ProductCode', required: true },
            { name: 'ProductDesc', required: true, disabled: true },
            { name: 'ServiceAnnualValue', disabled: true },
            { name: 'ServiceQuantity', disabled: true },
            { name: 'ServiceCommenceDate', disabled: true },
            { name: 'ServiceVisitFrequency', disabled: true },
            { name: 'NewServiceVisitFrequency', required: true, disabled: true },
            { name: 'ServiceCoverROWID' }
        ];
        this.buttonDisable = {
            save: true,
            cancel: true
        };
        this.contractSearchComponent = ContractSearchComponent;
        this.premiseSearchComponent = PremiseSearchComponent;
        this.serviceCoverSearchComponent = ServiceCoverSearchComponent;
        this.showpromptHeader = true;
        this.promptTitle = 'Confirm Record?';
        this.currentContractType = '';
        this.dateReadOnly = true;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.contractSearchParams = {
            'parentMode': 'LookUp',
            'currentContractType': 'J',
            'showAddNew': false
        };
        this.premiseSearchParams = {
            'parentMode': 'LookUp',
            'CurrentContractType': 'J',
            'showAddNew': false,
            'ContractNumber': '',
            'ContractName': ''
        };
        this.serviceCoverSearchParams = {
            'parentMode': 'LookUp',
            'showAddNew': false,
            'ContractNumber': '',
            'ContractName': '',
            'PremiseNumber': '',
            'PremiseName': ''
        };
        this.pageId = PageIdentifier.ICABSASERVICECOVERFREQUENCYMAINTENANCE;
    }
    ServiceCoverFrequencyMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.getPageTitle();
    };
    ServiceCoverFrequencyMaintenanceComponent.prototype.ngAfterViewInit = function () {
        this.autoOpenSearch = true;
    };
    ServiceCoverFrequencyMaintenanceComponent.prototype.getPageTitle = function () {
        this.contractTypeCode();
        if (this.currentContractType === 'J') {
            this.pageTitle = 'Job Service Cover Frequency Maintenance';
            this.labelNumber = 'Job Number';
        }
        else if (this.currentContractType === 'C') {
            this.pageTitle = 'Contract Service Cover Frequency Maintenance';
            this.labelNumber = 'Contract Number';
        }
        else if (this.currentContractType === 'P') {
            this.pageTitle = 'Product Service Cover Frequency Maintenance';
            this.labelNumber = 'Product Number';
        }
    };
    ServiceCoverFrequencyMaintenanceComponent.prototype.contractTypeCode = function () {
        var urlParams = this.riExchange.getRouterParams();
        var labels;
        this.currentContractType = 'J';
        if (urlParams.hasOwnProperty('contract')) {
            this.currentContractType = 'C';
        }
        else if (urlParams.hasOwnProperty('product')) {
            this.currentContractType = 'P';
        }
    };
    ServiceCoverFrequencyMaintenanceComponent.prototype.getFormdata = function () {
        var _this = this;
        var contractnumber = this.getControlValue('ContractNumber');
        var premisenumber = this.getControlValue('PremiseNumber');
        var productcode = this.getControlValue('ProductCode');
        this.ajaxSource.next(this.ajaxconstant.START);
        var searchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('ContractTypeCode', this.currentContractType);
        searchParams.set('ContractNumber', contractnumber);
        searchParams.set('PremiseNumber', premisenumber);
        searchParams.set('ProductCode', productcode);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams).subscribe(function (data) {
            if (data.errorMessage && data.errorMessage !== '') {
                _this.clearFormFields();
                _this.messageModal.show({ msg: data.errorMessage, title: 'Message' }, false);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }
            else {
                _this.doLookupformData();
                _this.setControlValue('Status', data.Status);
                _this.setControlValue('ServiceAnnualValue', parseFloat(data.ServiceAnnualValue).toFixed(2));
                _this.setControlValue('ServiceQuantity', data.ServiceQuantity);
                _this.setControlValue('ServiceCommenceDate', data.ServiceCommenceDate);
                _this.setControlValue('ServiceVisitFrequency', data.ServiceVisitFrequency);
                _this.setControlValue('ServiceCoverROWID', data.ServiceCover);
                _this.riExchange.riInputElement.Enable(_this.uiForm, 'NewServiceVisitFrequency');
                _this.buttonDisable.save = false;
                _this.buttonDisable.cancel = false;
                if (data.ServiceCommenceDate) {
                    if (window['moment'](data.ServiceCommenceDate, 'DD/MM/YYYY', true).isValid()) {
                        _this.commenceDateDisplay = _this.utils.convertDate(data.ServiceCommenceDate);
                    }
                    else {
                        _this.commenceDateDisplay = _this.utils.formatDate(new Date(data.ServiceCommenceDate));
                    }
                }
                else {
                    _this.commenceDateDisplay = null;
                }
                if (!_this.commenceDateDisplay) {
                    _this.CommenceDate = null;
                }
                else {
                    _this.CommenceDate = new Date(_this.commenceDateDisplay);
                    if (!window['moment'](_this.commenceDateDisplay, 'DD/MM/YYYY', true).isValid()) {
                        _this.commenceDateDisplay = _this.utils.formatDate(new Date(_this.commenceDateDisplay));
                    }
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.setFormMode(_this.c_s_MODE_UPDATE);
            }
        });
    };
    ServiceCoverFrequencyMaintenanceComponent.prototype.doLookupformData = function () {
        var _this = this;
        var contractnumber = this.getControlValue('ContractNumber');
        var premisenumber = this.getControlValue('PremiseNumber');
        var productcode = this.getControlValue('ProductCode');
        var lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': contractnumber
                },
                'fields': ['ContractName']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': contractnumber,
                    'PremiseNumber': premisenumber
                },
                'fields': ['PremiseName']
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductCode': productcode
                },
                'fields': ['ProductDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data[0].length > 0) {
                _this.setControlValue('ContractName', data[0][0].ContractName);
                _this.premiseSearchParams.ContractNumber = _this.getControlValue('ContractNumber');
                _this.premiseSearchParams.ContractName = _this.getControlValue('ContractName');
                _this.serviceCoverSearchParams.ContractNumber = _this.getControlValue('ContractNumber');
                _this.serviceCoverSearchParams.ContractName = _this.getControlValue('ContractName');
                _this.cbb.disableComponent(true);
            }
            else {
                _this.cbb.disableComponent(false);
            }
            if (data[1].length > 0) {
                _this.setControlValue('PremiseName', data[1][0].PremiseName);
                _this.serviceCoverSearchParams.PremiseNumber = _this.getControlValue('PremiseNumber');
                _this.serviceCoverSearchParams.PremiseName = _this.getControlValue('PremiseName');
            }
            if (data[2].length > 0) {
                _this.setControlValue('ProductDesc', data[2][0].ProductDesc);
            }
        });
    };
    ServiceCoverFrequencyMaintenanceComponent.prototype.onContractDataChanged = function (data) {
        var contractnumber = this.getControlValue('ContractNumber');
        this.setControlValue('ContractName', '');
        this.setControlValue('PremiseNumber', '');
        this.setControlValue('PremiseName', '');
        this.setControlValue('ProductCode', '');
        this.setControlValue('ProductDesc', '');
        this.premiseSearchParams.ContractNumber = '';
        this.premiseSearchParams.ContractName = '';
        this.serviceCoverSearchParams.ContractNumber = '';
        this.serviceCoverSearchParams.ContractName = '';
        this.serviceCoverSearchParams.PremiseNumber = '';
        this.serviceCoverSearchParams.PremiseName = '';
        this.clearFormFields();
        if (contractnumber !== '') {
            this.doLookupformData();
        }
        else {
            this.cbb.disableComponent(false);
        }
    };
    ServiceCoverFrequencyMaintenanceComponent.prototype.onPremiseDataChanged = function (data) {
        var premisenumber = this.getControlValue('PremiseNumber');
        this.setControlValue('PremiseName', '');
        this.setControlValue('ProductCode', '');
        this.setControlValue('ProductDesc', '');
        this.serviceCoverSearchParams.PremiseNumber = '';
        this.serviceCoverSearchParams.PremiseName = '';
        this.clearFormFields();
        if (premisenumber !== '') {
            this.doLookupformData();
        }
    };
    ServiceCoverFrequencyMaintenanceComponent.prototype.onProductDataChanged = function (data) {
        var productcode = this.getControlValue('ProductCode');
        this.setControlValue('ProductDesc', '');
        this.clearFormFields();
        if (productcode !== '') {
            this.doLookupformData();
            this.getFormdata();
        }
    };
    ServiceCoverFrequencyMaintenanceComponent.prototype.clearFormFields = function () {
        this.setControlValue('Status', '');
        this.setControlValue('ServiceAnnualValue', '');
        this.setControlValue('ServiceQuantity', '');
        this.setControlValue('ServiceCommenceDate', '');
        this.CommenceDate = '';
        this.setControlValue('ServiceVisitFrequency', '');
        this.setControlValue('ServiceVisitFrequency', '');
        this.setControlValue('ServiceCoverROWID', '');
        this.setControlValue('NewServiceVisitFrequency', '');
        this.riExchange.riInputElement.Disable(this.uiForm, 'NewServiceVisitFrequency');
        this.buttonDisable.save = true;
        this.buttonDisable.cancel = true;
    };
    ServiceCoverFrequencyMaintenanceComponent.prototype.onContractDataReceived = function (data) {
        this.setControlValue('ContractName', data.ContractName);
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.setControlValue('PremiseNumber', '');
        this.setControlValue('PremiseName', '');
        this.setControlValue('ProductCode', '');
        this.setControlValue('ProductDesc', '');
        this.premiseSearchParams.ContractNumber = data.ContractNumber;
        this.premiseSearchParams.ContractName = data.ContractName;
        this.serviceCoverSearchParams.ContractName = data.ContractName;
        this.serviceCoverSearchParams.ContractNumber = data.ContractNumber;
        this.serviceCoverSearchParams.PremiseNumber = '';
        this.serviceCoverSearchParams.PremiseName = '';
        this.clearFormFields();
        this.cbb.disableComponent(true);
    };
    ServiceCoverFrequencyMaintenanceComponent.prototype.onPremiseDataReceived = function (data) {
        this.setControlValue('PremiseNumber', data.PremiseNumber);
        this.setControlValue('PremiseName', data.PremiseName);
        this.setControlValue('ProductCode', '');
        this.setControlValue('ProductDesc', '');
        this.serviceCoverSearchParams.PremiseNumber = data.PremiseNumber;
        this.serviceCoverSearchParams.PremiseName = data.PremiseName;
        this.clearFormFields();
    };
    ServiceCoverFrequencyMaintenanceComponent.prototype.onProductDataReceived = function (data) {
        this.setControlValue('ProductCode', data.ProductCode);
        this.setControlValue('ProductDesc', data.ProductDesc);
        var contractnumber = this.getControlValue('ContractNumber');
        var premisenumber = this.getControlValue('PremiseNumber');
        if (contractnumber !== '' && premisenumber !== '') {
            this.getFormdata();
        }
    };
    ServiceCoverFrequencyMaintenanceComponent.prototype.saveData = function () {
        if (this.riExchange.validateForm(this.uiForm)) {
            this.promptModal.show('', '');
        }
    };
    ServiceCoverFrequencyMaintenanceComponent.prototype.promptSave = function (data) {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var searchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        searchParams.set(this.serviceConstants.Action, '2');
        var bodyParams = {};
        bodyParams['NewServiceVisitFrequency'] = this.getControlValue('NewServiceVisitFrequency');
        bodyParams['ServiceCoverROWID'] = this.getControlValue('ServiceCoverROWID');
        bodyParams['ContractNumber'] = this.getControlValue('ContractNumber');
        bodyParams['PremiseNumber'] = this.getControlValue('PremiseNumber');
        bodyParams['ProductCode'] = this.getControlValue('ProductCode');
        bodyParams['ServiceVisitFrequency'] = this.getControlValue('ServiceVisitFrequency');
        bodyParams['ServiceQuantity'] = this.getControlValue('ServiceQuantity');
        bodyParams['ServiceAnnualValue'] = this.getControlValue('ServiceAnnualValue');
        bodyParams['ServiceCommenceDate'] = this.getControlValue('ServiceCommenceDate');
        bodyParams['ContractTypeCode'] = this.getControlValue('ContractTypeCode');
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams).subscribe(function (e) {
            if (e.errorMessage && e.errorMessage !== '') {
                _this.messageModal.show({ msg: e.errorMessage, title: 'Message' }, false);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }
            else {
                _this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: 'Message' }, false);
                _this.clearFormFields();
                _this.getFormdata();
                _this.uiForm.controls['NewServiceVisitFrequency'].markAsUntouched();
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }
        });
    };
    ServiceCoverFrequencyMaintenanceComponent.prototype.cancel = function () {
        this.setControlValue('NewServiceVisitFrequency', '');
    };
    ServiceCoverFrequencyMaintenanceComponent.prototype.ngOnDestroy = function () {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        _super.prototype.ngOnDestroy.call(this);
    };
    ServiceCoverFrequencyMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverFrequencyMaintenance.html'
                },] },
    ];
    ServiceCoverFrequencyMaintenanceComponent.ctorParameters = [
        { type: Injector, },
        { type: CBBService, },
    ];
    ServiceCoverFrequencyMaintenanceComponent.propDecorators = {
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return ServiceCoverFrequencyMaintenanceComponent;
}(BaseComponent));
