var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PremiseLocationAllocationGridComponent } from '../grid-search/iCABSAPremiseLocationAllocationGrid';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { ServiceCoverSearchComponent } from '../search/iCABSAServiceCoverSearch';
import { ServiceCoverLocationEffectDateSearchComponent } from '../search/iCABSAServiceCoverLocationEffectDateSearch.component';
export var ServiceCoverLocationMoveMaintenanceComponent = (function (_super) {
    __extends(ServiceCoverLocationMoveMaintenanceComponent, _super);
    function ServiceCoverLocationMoveMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.pageTitle = '';
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.search = new URLSearchParams();
        this.inputParams = {};
        this.showMessageHeaderSave = true;
        this.showHeader = true;
        this.showPromptCloseButtonSave = true;
        this.promptTitleSave = '';
        this.promptContentSave = MessageConstant.Message.ConfirmRecord;
        this.promptModalConfigSave = {
            ignoreBackdropClick: true
        };
        this.queryParams = {
            operation: 'Application/iCABSAServiceCoverLocationMoveMaintenance',
            module: 'locations',
            method: 'service-delivery/maintenance'
        };
        this.disabledSearch = false;
        this.controls = [
            { name: 'ContractNumber', disabled: true, required: true },
            { name: 'ContractName', disabled: true, required: true },
            { name: 'ServiceVisitFrequency', disabled: true, required: true },
            { name: 'PremiseNumber', disabled: true, required: true },
            { name: 'PremiseName', disabled: true, required: true },
            { name: 'ProductCode', disabled: true, required: true },
            { name: 'ProductDesc', disabled: true, required: true },
            { name: 'PremiseLocationNumber', disabled: false, required: true },
            { name: 'PremiseLocationDesc', disabled: true, required: true },
            { name: 'PremiseLocationNumberTo', disabled: false, required: true },
            { name: 'PremiseLocationToDesc', disabled: true, required: true },
            { name: 'EffectiveDateFrom', disabled: false, required: true },
            { name: 'EffectiveDateTo', disabled: false, required: true },
            { name: 'SourceQuantity', disabled: true, required: true },
            { name: 'TransferQuantity', disabled: false, required: true },
            { name: 'ServiceCoverRowID' }
        ];
        this.ellipsisdata = {};
        this.serviceCoverSearchParams = {
            'parentMode': 'LookUp-Freq-Loc',
            'ContractNumber': '',
            'ContractName': '',
            'PremiseNumber': '',
            'PremiseName': '',
            'CurrentContractTypeURLParameter': ''
        };
        this.serviceCoverSearchComponent = ServiceCoverSearchComponent;
        this.datesearch = new URLSearchParams();
        this.premiselocationsearchparams = {
            'parentMode': 'Move-From',
            'ProductCode': '',
            'ProductDesc': '',
            'CurrentContractTypeURLParameter': ''
        };
        this.premiseLocationComponent = PremiseLocationAllocationGridComponent;
        this.premiseLocationToSearchParams = {
            'parentMode': 'Move-To',
            'ProductCode': '',
            'ProductDesc': '',
            'CurrentContractTypeURLParameter': ''
        };
        this.premiselocationallocationto = PremiseLocationAllocationGridComponent;
        this.effectDatesearchparams = {
            parentMode: 'LookUp',
            ProductCode: '',
            ProductDesc: '',
            PremiseLocationNumber: '',
            PremiseLocationDesc: '',
            ServiceVisitFrequency: '',
            ServiceCoverRowID: ''
        };
        this.effectDateComponent = ServiceCoverLocationEffectDateSearchComponent;
        this.savesearch = new URLSearchParams();
        this.pageId = PageIdentifier.ICABSASERVICECOVERLOCATIONMOVEMAINTENANCE;
        this.search = this.getURLSearchParamObject();
        this.messageContentSave = MessageConstant.Message.SavedSuccessfully;
        this.messageContentRecord = MessageConstant.Message.RecordNotFound;
    }
    ServiceCoverLocationMoveMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Service Cover Location Transfer Maintenance';
        this.window_onload();
        this.serviceCoverSearchParams.ContractNumber = this.getControlValue('ContractNumber') || '';
        this.serviceCoverSearchParams.ContractName = this.getControlValue('ContractName') || '';
        this.serviceCoverSearchParams.PremiseNumber = this.getControlValue('PremiseNumber') || '';
        this.serviceCoverSearchParams.PremiseName = this.getControlValue('PremiseName') || '';
    };
    ServiceCoverLocationMoveMaintenanceComponent.prototype.ngAfterViewInit = function () {
        this.serviceCoverSearch.openModal();
    };
    ServiceCoverLocationMoveMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    ServiceCoverLocationMoveMaintenanceComponent.prototype.window_onload = function () {
        this.CurrentContractTypeURLParameter = this.riExchange.getCurrentContractTypeUrlParam();
        var currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
        this.pageTitle = currentContractTypeLabel + ' ' + 'Service Cover Location Transfer Maintenance';
        this.labelnumber = currentContractTypeLabel + ' ' + 'Number';
        this.serviceCoverSearchParams.CurrentContractTypeURLParameter = this.CurrentContractTypeURLParameter;
        this.premiselocationsearchparams.CurrentContractTypeURLParameter = this.CurrentContractTypeURLParameter;
        this.premiseLocationToSearchParams.CurrentContractTypeURLParameter = this.CurrentContractTypeURLParameter;
        if (this.parentMode === 'Verification' || this.parentMode === 'Premise-Allocate' || this.parentMode === 'ServiceCover-Increase' || this.parentMode === 'NewLocationGrid') {
            this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
            this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
            this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
            this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        }
        else if (this.parentMode === 'System-Allocate') {
            this.setControlValue('ContractNumber', this.riExchange.GetParentHTMLInputElementAttribute(this.uiForm, 'ContractNumber'));
            this.setControlValue('ContractName', this.riExchange.GetParentHTMLInputElementAttribute(this.uiForm, 'ContractName'));
            this.setControlValue('PremiseNumber', this.riExchange.GetParentHTMLInputElementAttribute(this.uiForm, 'PremiseNumber'));
            this.setControlValue('PremiseName', this.riExchange.GetParentHTMLInputElementAttribute(this.uiForm, 'PremiseName'));
        }
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceVisitFrequency');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SourceQuantity');
    };
    ServiceCoverLocationMoveMaintenanceComponent.prototype.setProductCode = function (data) {
        this.ellipsisdata = data;
        this.setControlValue('ProductCode', data.row.ProductCode);
        this.setControlValue('ServiceVisitFrequency', data.row.ServiceVisitFrequency);
        this.setControlValue('ProductDesc', data.row.ProductDesc);
        this.setControlValue('ServiceCoverRowID', data.row.ttServiceCover);
        this.disabledSearch = true;
        this.premiselocationsearchparams.ProductCode = this.getControlValue('ProductCode');
        this.premiselocationsearchparams.ProductDesc = this.getControlValue('ProductDesc');
        this.premiseLocationToSearchParams.ProductCode = this.getControlValue('ProductCode');
        this.premiseLocationToSearchParams.ProductDesc = this.getControlValue('ProductDesc');
    };
    ServiceCoverLocationMoveMaintenanceComponent.prototype.dateFromSelectedValue = function (value) {
        if (value && value.value) {
            this.setControlValue('EffectiveDateFrom', value.value);
            this.fromDateDisplay = new Date(this.utils.convertDateString(value.value));
            this.onChangeDateFrom();
        }
    };
    ServiceCoverLocationMoveMaintenanceComponent.prototype.dateToSelectedValue = function (value) {
        if (value && value.value) {
            this.setControlValue('EffectiveDateTo', value.value);
        }
    };
    ServiceCoverLocationMoveMaintenanceComponent.prototype.PremiseLocationNumberOnChange = function () {
        this.fromDateDisplay = null;
        this.riExchange_CBORequest();
    };
    ServiceCoverLocationMoveMaintenanceComponent.prototype.riExchange_CBORequest = function () {
        if ((this.riExchange.riInputElement.HasChanged(this.uiForm, 'PremiseLocationNumber'))) {
            this.fromDateDisplay = null;
        }
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'EffectiveDateFrom') && this.getControlValue('EffectiveDateFrom') !== null) {
            this.onChangeDateFrom();
        }
    };
    ServiceCoverLocationMoveMaintenanceComponent.prototype.onChangeDateFrom = function () {
        var _this = this;
        this.datesearch = this.getURLSearchParamObject();
        var formdata = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        formdata['ContractNumber'] = this.getControlValue('ContractNumber');
        formdata['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formdata['ProductCode'] = this.getControlValue('ProductCode');
        formdata['PremiseLocationNumber'] = this.getControlValue('PremiseLocationNumber');
        formdata['Function'] = 'GetSourceQuantities';
        formdata['EffectiveDateFrom'] = this.getControlValue('EffectiveDateFrom');
        formdata['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
        this.inputParams.selectsearch = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.search, formdata)
            .subscribe(function (e) {
            if (e.hasError) {
                _this.errorModal.show(e, true);
            }
            else {
                if (e.errorMessage === 'Record Not Found') {
                    _this.showErrorModal(e);
                }
                else {
                    _this.setControlValue('SourceQuantity', e.SourceQuantity);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
        var fromDt = this.getControlValue('EffectiveDateFrom').split('/');
        var toDatetTime = new Date(fromDt[1] + '/' + fromDt[0] + '/' + fromDt[2]);
        this.toDateDisplay = new Date(toDatetTime);
    };
    ServiceCoverLocationMoveMaintenanceComponent.prototype.setPremiseLocation = function (data) {
        this.setControlValue('PremiseLocationNumber', data.PremiseLocationNumber);
        this.setControlValue('PremiseLocationDesc', data.PremiseLocationDesc);
        this.effectDatesearchparams.ProductCode = this.getControlValue('ProductCode');
        this.effectDatesearchparams.ProductDesc = this.getControlValue('ProductDesc');
        this.effectDatesearchparams.PremiseLocationNumber = this.getControlValue('PremiseLocationNumber');
        this.effectDatesearchparams.PremiseLocationDesc = this.getControlValue('PremiseLocationDesc');
        this.effectDatesearchparams.ServiceVisitFrequency = this.getControlValue('ServiceVisitFrequency');
        this.effectDatesearchparams.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
    };
    ServiceCoverLocationMoveMaintenanceComponent.prototype.setPremiseLocationTo = function (data) {
        this.setControlValue('PremiseLocationNumberTo', data.PremiseLocationNumber);
        this.setControlValue('PremiseLocationToDesc', data.PremiseLocationDesc);
    };
    ServiceCoverLocationMoveMaintenanceComponent.prototype.setEffectDate = function (data) {
        this.fromDateDisplay = new Date(this.utils.convertDateString(data.EffectiveDateFrom));
        this.setControlValue('EffectiveDateFrom', data.EffectiveDateFrom);
    };
    ServiceCoverLocationMoveMaintenanceComponent.prototype.onSave = function () {
        if (this.uiForm.valid) {
            this.promptModalForSave.show();
        }
        else {
            this.riExchange.riInputElement.isError(this.uiForm, 'ContractNumber');
            this.riExchange.riInputElement.isError(this.uiForm, 'ContractName');
            this.riExchange.riInputElement.isError(this.uiForm, 'ServiceVisitFrequency');
            this.riExchange.riInputElement.isError(this.uiForm, 'PremiseNumber');
            this.riExchange.riInputElement.isError(this.uiForm, 'PremiseName');
            this.riExchange.riInputElement.isError(this.uiForm, 'ProductCode');
            this.riExchange.riInputElement.isError(this.uiForm, 'ProductDesc');
            this.riExchange.riInputElement.isError(this.uiForm, 'PremiseLocationNumber');
            this.riExchange.riInputElement.isError(this.uiForm, 'PremiseLocationDesc');
            this.riExchange.riInputElement.isError(this.uiForm, 'PremiseLocationNumberTo');
            this.riExchange.riInputElement.isError(this.uiForm, 'PremiseLocationToDesc');
            this.riExchange.riInputElement.isError(this.uiForm, 'SourceQuantity');
            this.riExchange.riInputElement.isError(this.uiForm, 'TransferQuantity');
            this.EffectiveDateFrom.validateDateField();
            this.EffectiveDateTo.validateDateField();
        }
    };
    ServiceCoverLocationMoveMaintenanceComponent.prototype.promptContentSaveData = function (eventObj) {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        var formdata = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.Action, '1');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        formdata['ContractNumber'] = this.getControlValue('ContractNumber');
        formdata['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formdata['ProductCode'] = this.getControlValue('ProductCode');
        formdata['PremiseLocationNumber'] = this.getControlValue('PremiseLocationNumber');
        formdata['PremiseLocationNumberTo'] = this.getControlValue('PremiseLocationNumberTo');
        formdata['TransferQuantity'] = this.getControlValue('TransferQuantity');
        formdata['EffectiveDateFrom'] = this.getControlValue('EffectiveDateFrom');
        formdata['SourceQuantity'] = this.getControlValue('SourceQuantity');
        formdata['EffectiveDateTo'] = this.getControlValue('EffectiveDateTo');
        formdata['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
        this.inputParams.selectsearch = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.search, formdata)
            .subscribe(function (e) {
            if (e.hasError) {
                _this.showErrorModal(e);
            }
            else {
                if (e.errorMessage === 'Record Not Found') {
                    _this.showErrorModal(e);
                }
                else {
                    _this.showMessageModal(e);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverLocationMoveMaintenanceComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show(data, true);
    };
    ServiceCoverLocationMoveMaintenanceComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };
    ServiceCoverLocationMoveMaintenanceComponent.prototype.onCancel = function () {
        this.disabledSearch = false;
        this.setControlValue('ProductCode', '');
        this.setControlValue('ProductDesc', '');
        this.setControlValue('PremiseLocationNumber', '');
        this.setControlValue('PremiseLocationDesc', '');
        this.setControlValue('EffectiveDateFrom', '');
        this.fromDateDisplay = null;
        this.setControlValue('SourceQuantity', '');
        this.setControlValue('PremiseLocationNumberTo', '');
        this.setControlValue('PremiseLocationToDesc', '');
        this.toDateDisplay = null;
        this.EffectiveDateFrom.dtDisplay = '';
        this.EffectiveDateTo.dtDisplay = '';
        this.setControlValue('TransferQuantity', '');
        this.serviceCoverSearch.openModal();
    };
    ServiceCoverLocationMoveMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverLocationMoveMaintenance.html'
                },] },
    ];
    ServiceCoverLocationMoveMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    ServiceCoverLocationMoveMaintenanceComponent.propDecorators = {
        'premiseLocationEllipsis': [{ type: ViewChild, args: ['premiseLocationEllipsis',] },],
        'effectDateEllipsis': [{ type: ViewChild, args: ['effectDateEllipsis',] },],
        'serviceCoverSearch': [{ type: ViewChild, args: ['serviceCoverSearch',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'EffectiveDateFrom': [{ type: ViewChild, args: ['EffectiveDateFrom',] },],
        'EffectiveDateTo': [{ type: ViewChild, args: ['EffectiveDateTo',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'confirmOkModal': [{ type: ViewChild, args: ['confirmOkModal',] },],
        'promptModalForSave': [{ type: ViewChild, args: ['promptModalForSave',] },],
    };
    return ServiceCoverLocationMoveMaintenanceComponent;
}(BaseComponent));
