var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { RouteAwayGlobals } from './../../../shared/services/route-away-global.service';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
export var ServiceCoverEntryComponent = (function (_super) {
    __extends(ServiceCoverEntryComponent, _super);
    function ServiceCoverEntryComponent(injector, routeAwayGlobals) {
        _super.call(this, injector);
        this.routeAwayGlobals = routeAwayGlobals;
        this.dummyProductCodes = [];
        this.singleQtyComponents = [];
        this.errorMessageFlag = false;
        this.queryParams = {
            operation: 'Application/iCABSAServiceCoverComponentEntry',
            module: 'components',
            method: 'contract-management/maintenance'
        };
        this.promptContent = '';
        this.attr1Mandatory = false;
        this.attr2Mandatory = false;
        this.showHeader = true;
        this.showComponentRange = false;
        this.showRotationalInterval = false;
        this.showCustomUpdateBtn = false;
        this.mode = 'N';
        this.setFocusComponentTypeCode = new EventEmitter();
        this.setFocusProductComponentDesc = new EventEmitter();
        this.storeValues = {};
        this.ellipsisConfig = {
            attribute1: {
                disabled: true,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'Attribute1',
                showAddNew: false,
                ServiceCoverNumber: {}
            },
            attribute2: {
                disabled: true,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'Attribute2',
                showAddNew: false,
                ServiceCoverNumber: {}
            },
            product: {
                disabled: true,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'DisplayEntry',
                showAddNew: false
            },
            alternateProduct: {
                disabled: true,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'AlternateDisplayEntry',
                showAddNew: false
            },
            productRange: {
                disabled: true,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'LookUp',
                showAddNew: false
            }
        };
        this.pageId = '';
        this.controls = [
            { name: 'ContractNumber', disabled: true },
            { name: 'ContractName', disabled: true },
            { name: 'PremiseNumber', disabled: true },
            { name: 'PremiseName', disabled: true },
            { name: 'ProductCode', disabled: true },
            { name: 'ProductDesc', disabled: true },
            { name: 'ItemDescription', disabled: true },
            { name: 'PremiseLocationNumber', disabled: true },
            { name: 'PremiseLocationDesc', disabled: true },
            { name: 'ComponentTypeCode', disabled: true, required: true },
            { name: 'ComponentTypeDesc', disabled: true },
            { name: 'ProductComponentCode', disabled: true, required: true },
            { name: 'ProductComponentDesc', disabled: true },
            { name: 'AttributeLabel1', disabled: true },
            { name: 'AttributeValue1', disabled: true },
            { name: 'AttributeLabel2', disabled: true },
            { name: 'AttributeValue2', disabled: true },
            { name: 'AlternateProductCode', disabled: true },
            { name: 'ComponentQuantity', disabled: true, required: true },
            { name: 'btnCompReplace', disabled: false },
            { name: 'ProductRange', disabled: true },
            { name: 'ProductRangeDesc', disabled: true },
            { name: 'SequenceNumber', disabled: true },
            { name: 'RotationalRule', disabled: true },
            { name: 'RotationalInterval', disabled: true },
            { name: 'btnCustomUpdate', disabled: true },
            { name: 'ServiceCoverNumber' },
            { name: 'ServiceCoverItemNumber' },
            { name: 'ServiceCoverComponentNumber' },
            { name: 'SelProductCode' },
            { name: 'SelProductDesc' },
            { name: 'SelComponentTypeCode' },
            { name: 'ComponentTypeDescLang' },
            { name: 'LanguageCode' },
            { name: 'SelProductAlternateCode' },
            { name: 'AttributeCode1' },
            { name: 'AttributeCode2' },
            { name: 'SelAttributeValue1' },
            { name: 'SelAttributeValue2' },
            { name: 'ServiceCoverCompRotation' },
            { name: 'SelProductRange' },
            { name: 'SelProductRangeDesc' }
        ];
        this.pageId = PageIdentifier.ICABSASERVICECOVERCOMPONENTENTRY;
        this.searchParams = this.getURLSearchParamObject();
        this.promptTitle = MessageConstant.Message.DeleteRecord;
    }
    ServiceCoverEntryComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    ServiceCoverEntryComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.window_onload();
        this.routeAwayUpdateSaveFlag();
    };
    ServiceCoverEntryComponent.prototype.ngOnDestroy = function () {
        this.routeAwayGlobals.resetRouteAwayFlags();
        _super.prototype.ngOnDestroy.call(this);
    };
    ServiceCoverEntryComponent.prototype.window_onload = function () {
        this.serviceCoverROWID = this.riExchange.getParentAttributeValue('ServiceCoverComponentRowID');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseLocationNumber', this.riExchange.getParentHTMLValue('PremiseLocationNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseLocationDesc', this.riExchange.getParentHTMLValue('PremiseLocationDesc'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ItemDescription', this.riExchange.getParentHTMLValue('ItemDescription'));
        this.getPageData();
    };
    ServiceCoverEntryComponent.prototype.getPageData = function () {
        var _this = this;
        var searchParams = this.getURLSearchParamObject();
        searchParams.set('action', '0');
        searchParams.set('ServiceCoverComponentROWID', this.serviceCoverROWID);
        searchParams.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        searchParams.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        searchParams.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        searchParams.set('ServiceCoverNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber'));
        searchParams.set('ServiceCoverItemNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverItemNumber'));
        searchParams.set('ServiceCoverComponentNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverComponentNumber'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams)
            .subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
                return;
            }
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceCoverNumber', data.ServiceCoverNumber);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceCoverItemNumber', data.ServiceCoverItemNumber);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceCoverComponentNumber', data.ServiceCoverComponentNumber);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ComponentTypeCode', data.ComponentTypeCode);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ComponentTypeDesc', data.ComponentTypeDesc);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductComponentCode', data.ProductComponentCode);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductComponentDesc', data.ProductComponentDesc);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ComponentQuantity', data.ComponentQuantity);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AlternateProductCode', data.AlternateProductCode);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AttributeLabel1', data.AttributeLabel1);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AttributeValue1', data.AttributeValue1);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AttributeCode1', data.AttributeCode1);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AttributeLabel2', data.AttributeLabel2);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AttributeValue2', data.AttributeValue2);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AttributeCode2', data.AttributeCode2);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceCoverCompRotation', data.ServiceCoverCompRotation);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductRange', data.ProductRange);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductRangeDesc', data.ProductRangeDesc);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SequenceNumber', data.SequenceNumber);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'RotationalRule', data.RotationalRule);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'RotationalInterval', data.RotationalInterval);
            _this.fetchRecords();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverEntryComponent.prototype.fetchRecords = function () {
        var _this = this;
        var searchParams = this.getURLSearchParamObject();
        searchParams.set('action', '6');
        var bodyParams = {
            'Function': 'DummyProductCodeList,SingleQtyComponents',
            'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode')
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams)
            .subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
                return;
            }
            if (data['DummyProductCodes']) {
                _this.dummyProductCodes = data['DummyProductCodes'].split('|');
            }
            if (data['SingleQtyComponents']) {
                _this.singleQtyComponents = data['SingleQtyComponents'].split('|');
            }
            _this.riMaintenance_AfterFetch();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverEntryComponent.prototype.riMaintenance_AfterFetch = function () {
        var serviceCoverCompRotation = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverCompRotation');
        if (serviceCoverCompRotation === 'yes') {
            this.showComponentRange = true;
            var rotationalRule = this.riExchange.riInputElement.GetValue(this.uiForm, 'RotationalRule').toUpperCase();
            if (rotationalRule === 'C' || rotationalRule === 'S') {
                this.showRotationalInterval = true;
            }
            else {
                this.showRotationalInterval = false;
            }
            if (rotationalRule === 'C') {
                this.showCustomUpdateBtn = true;
                this.riExchange.riInputElement.Disable(this.uiForm, 'ProductRange');
            }
            else {
                this.showCustomUpdateBtn = false;
            }
        }
        else {
            this.showComponentRange = false;
        }
        this.setFormMode(this.c_s_MODE_UPDATE);
    };
    ServiceCoverEntryComponent.prototype.riMaintenance_BeforeAdd = function () {
        this.mode = 'A';
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverComponentNumber', 1);
        this.updateFieldDisableStatus();
        this.clearFieldValues();
        this.setFocusComponentTypeCode.emit(true);
        this.setFormMode(this.c_s_MODE_ADD);
    };
    ServiceCoverEntryComponent.prototype.riMaintenance_BeforeUpdate = function () {
        this.mode = 'U';
        this.updateFieldDisableStatus();
        this.componentTypeCode_onChange();
        this.setFormMode(this.c_s_MODE_UPDATE);
        var productComponentCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCode');
        if (productComponentCode !== '' || productComponentCode) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
            for (var productCode in this.dummyProductCodes) {
                if (productCode) {
                    if (productCode === productComponentCode.toUpperCase()) {
                        this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentDesc');
                        this.setFocusProductComponentDesc.emit(true);
                        return;
                    }
                }
            }
        }
        else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentDesc', '');
        }
        var rotationalRule = this.riExchange.riInputElement.GetValue(this.uiForm, 'RotationalRule').toUpperCase();
        if (rotationalRule === 'C') {
            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductRange');
        }
        this.setFocusComponentTypeCode.emit(true);
    };
    ServiceCoverEntryComponent.prototype.riMaintenance_BeforeSave = function () {
        var _this = this;
        if (!this.uiForm.dirty && !this.uiForm.valid) {
            for (var control in this.uiForm.controls) {
                if (control) {
                    this.uiForm.controls[control].markAsTouched();
                }
            }
            return;
        }
        var searchParams = this.getURLSearchParamObject();
        searchParams.set('action', '6');
        var bodyParams = {
            'Function': 'PopulateFields',
            'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
            'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
            'ServiceCoverNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber'),
            'ComponentTypeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ComponentTypeCode'),
            'ProductComponentCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCode')
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams)
            .subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
                return;
            }
            var include = false;
            if (data['ComponentTypeDesc']) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ComponentTypeDesc', data.ComponentTypeDesc.toUpperCase());
            }
            if (data['ProductComponentDesc']) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductComponentDesc', data.ProductComponentDesc.toUpperCase());
            }
            var productComponentCode = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'ProductComponentCode').toUpperCase();
            var productComponentDesc = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'ProductComponentDesc');
            for (var productCode in _this.dummyProductCodes) {
                if (productCode) {
                    if (productComponentCode === productCode.toUpperCase() && productComponentDesc !== '') {
                        include = false;
                        break;
                    }
                }
            }
            if (include) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductComponentDesc', data.ProductComponentDesc.toUpperCase());
            }
            _this.riMaintenance_SaveRecord();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverEntryComponent.prototype.riMaintenance_SaveRecord = function () {
        var _this = this;
        var searchParams = this.getURLSearchParamObject();
        if (this.mode === 'A') {
            searchParams.set('action', '1');
        }
        else {
            searchParams.set('action', '2');
        }
        var bodyParams = {
            'ComponentTypeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ComponentTypeCode'),
            'ComponentTypeDesc': this.riExchange.riInputElement.GetValue(this.uiForm, 'ComponentTypeDesc'),
            'ProductComponentDesc': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentDesc'),
            'PremiseLocationNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseLocationNumber'),
            'PremiseLocationDesc': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseLocationDesc'),
            'ItemDescription': this.riExchange.riInputElement.GetValue(this.uiForm, 'ItemDescription'),
            'AttributeLabel1': this.riExchange.riInputElement.GetValue(this.uiForm, 'AttributeLabel1'),
            'AttributeValue1': this.riExchange.riInputElement.GetValue(this.uiForm, 'AttributeValue1'),
            'AttributeCode1': this.riExchange.riInputElement.GetValue(this.uiForm, 'AttributeCode1'),
            'AttributeLabel2': this.riExchange.riInputElement.GetValue(this.uiForm, 'AttributeLabel2'),
            'AttributeValue2': this.riExchange.riInputElement.GetValue(this.uiForm, 'AttributeValue2'),
            'AttributeCode2': this.riExchange.riInputElement.GetValue(this.uiForm, 'AttributeCode2'),
            'ServiceCoverCompRotation': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverCompRotation'),
            'ProductRangeDesc': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductRangeDesc'),
            'SequenceNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'SequenceNumber'),
            'RotationalInterval': this.riExchange.riInputElement.GetValue(this.uiForm, 'RotationalInterval'),
            'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
            'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
            'ServiceCoverNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber'),
            'ServiceCoverItemNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverItemNumber'),
            'ServiceCoverComponentNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverComponentNumber'),
            'ProductComponentCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCode'),
            'ComponentQuantity': this.riExchange.riInputElement.GetValue(this.uiForm, 'ComponentQuantity'),
            'AlternateProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'AlternateProductCode'),
            'ProductRange': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductRange'),
            'RotationalRule': this.riExchange.riInputElement.GetValue(this.uiForm, 'RotationalRule')
        };
        if (this.mode === 'U') {
            bodyParams['ServiceCoverComponentROWID'] = this.serviceCoverROWID;
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams)
            .subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
                return;
            }
            if (_this.mode === 'A') {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceCoverComponentNumber', data.ServiceCoverComponentNumber);
                _this.serviceCoverROWID = data.RowID;
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductRange', data.ProductRange);
            }
            _this.mode = 'N';
            _this.routeAwayComponent.resetDirtyFlagAfterSaveUpdate();
            _this.setFormMode(_this.c_s_MODE_SELECT);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
            _this.setFormMode(_this.c_s_MODE_SELECT);
        });
    };
    ServiceCoverEntryComponent.prototype.riMaintenance_AfterAbandon = function () {
        this.mode = 'N';
        this.routeAwayComponent.resetDirtyFlagAfterSaveUpdate();
        this.updateFieldDisableStatus();
        this.setFormMode(this.c_s_MODE_SELECT);
    };
    ServiceCoverEntryComponent.prototype.riMaintenance_BeforeDelete = function () {
        var _this = this;
        var searchParams = this.getURLSearchParamObject();
        searchParams.set('action', '3');
        this.setFormMode(this.c_s_MODE_UPDATE);
        var bodyParams = {
            'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
            'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
            'ServiceCoverNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber'),
            'ServiceCoverItemNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverItemNumber'),
            'ServiceCoverComponentNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverComponentNumber')
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams)
            .subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
                return;
            }
            _this.location.back();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverEntryComponent.prototype.componentTypeCode_onChange = function () {
        this.riExchange.riInputElement.Enable(this.uiForm, 'ComponentQuantity');
        var componentTypeCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ComponentTypeCode');
        if (componentTypeCode !== '' && componentTypeCode) {
            for (var component in this.singleQtyComponents) {
                if (component) {
                    if (componentTypeCode === component.toUpperCase()) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ComponentQuantity', 1);
                        this.riExchange.riInputElement.Disable(this.uiForm, 'ComponentQuantity');
                        return;
                    }
                }
            }
            this.populateAttributes();
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ComponentTypeDesc', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentDesc', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ComponentQuantity', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AttributeLabel1', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AttributeValue1', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AttributeLabel2', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AttributeValue2', '');
        }
    };
    ServiceCoverEntryComponent.prototype.productComponentCode_onChange = function () {
        var _this = this;
        var productComponentCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCode');
        if (productComponentCode) {
            var searchParams = this.getURLSearchParamObject();
            searchParams.set('action', '6');
            searchParams.set('Function', 'GetProductValues');
            searchParams.set('ProductComponentCode', productComponentCode);
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams)
                .subscribe(function (data) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    _this.errorModal.show(data, true);
                    return;
                }
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AlternateProductCode', data.AlternateProductCode.toUpperCase());
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductComponentDesc', data.ProductComponentDesc.toUpperCase());
                _this.displayRotational();
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
            for (var productCode in this.dummyProductCodes) {
                if (productCode) {
                    if (productCode === productComponentCode.toUpperCase()) {
                        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
                        this.setFocusProductComponentDesc.emit(true);
                        return;
                    }
                }
            }
        }
        else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentDesc', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AlternateProductCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductRange', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'RotationalRule', '');
            this.showComponentRange = false;
        }
    };
    ServiceCoverEntryComponent.prototype.productRange_onChange = function () {
        var _this = this;
        var productRange = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductRange');
        if (productRange) {
            var searchParams = this.getURLSearchParamObject();
            searchParams.set('action', '6');
            searchParams.set('Function', 'GetRange');
            searchParams.set('ProductRange', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductRange'));
            searchParams.set('ProductComponentCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCode'));
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams)
                .subscribe(function (data) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    _this.errorModal.show(data, true);
                    return;
                }
                if (data) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductRangeDesc', data.ProductRangeDesc);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SequenceNumber', data.SequenceNumber);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'RotationalInterval', data.RotationalInterval);
                }
                else {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductRange', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductRangeDesc', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SequenceNumber', '0');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'RotationalInterval', '0');
                }
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.errorService.emitError(error);
            });
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductRange', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductRangeDesc', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SequenceNumber', '0');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'RotationalInterval', '0');
        }
    };
    ServiceCoverEntryComponent.prototype.rotationalRule_onChange = function () {
        var _this = this;
        var rotationalRule = this.riExchange.riInputElement.GetValue(this.uiForm, 'RotationalRule').toUpperCase();
        if (rotationalRule === 'C' || rotationalRule === 'S') {
            this.showRotationalInterval = true;
        }
        else {
            this.showRotationalInterval = false;
        }
        if (rotationalRule === 'C') {
            this.showCustomUpdateBtn = true;
            var searchParams = this.getURLSearchParamObject();
            searchParams.set('action', '6');
            searchParams.set('Function', 'DefaultCustomRange');
            searchParams.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
            searchParams.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
            searchParams.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
            searchParams.set('ServiceCoverNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber'));
            searchParams.set('ServiceCoverItemNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverItemNumber'));
            searchParams.set('ServiceCoverComponentNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverComponentNumber'));
            searchParams.set('ProductComponentCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCode'));
            searchParams.set('ProductComponentDesc', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentDesc'));
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams)
                .subscribe(function (data) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    _this.errorModal.show(data, true);
                    return;
                }
                if (data) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductRange', data.ProductRange);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductRangeDesc', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'PremiseName'));
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SequenceNumber', data.SequenceNumber);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'RotationalInterval', data.RotationalInterval);
                }
                else {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductRange', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductRangeDesc', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SequenceNumber', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'RotationalInterval', '');
                }
                _this.riExchange.riInputElement.Disable(_this.uiForm, 'ProductRange');
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
        else {
            this.showCustomUpdateBtn = false;
            this.riExchange.riInputElement.Enable(this.uiForm, 'ProductRange');
        }
    };
    ServiceCoverEntryComponent.prototype.alternateProductCode_onChange = function () {
        var _this = this;
        var alternateProductCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'AlternateProductCode');
        if (alternateProductCode) {
            var searchParams = this.getURLSearchParamObject();
            searchParams.set('action', '6');
            searchParams.set('Function', 'GetAlternateProductValues');
            searchParams.set('AlternateProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'AlternateProductCode'));
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams)
                .subscribe(function (data) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    _this.errorModal.show(data, true);
                    return;
                }
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductComponentCode', data.ProductComponentCode.toUpperCase());
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductComponentDesc', data.ProductComponentDesc.toUpperCase());
                _this.riExchange.riInputElement.Disable(_this.uiForm, 'ProductComponentDesc');
                for (var productCode in _this.dummyProductCodes) {
                    if (productCode) {
                        if (productCode === productCode.toUpperCase()) {
                            _this.riExchange.riInputElement.Disable(_this.uiForm, 'ProductComponentDesc');
                            _this.setFocusProductComponentDesc.emit(true);
                            return;
                        }
                    }
                }
                _this.riExchange.riInputElement.SetErrorStatus(_this.uiForm, 'ProductComponentDesc', false);
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    ServiceCoverEntryComponent.prototype.attributeValue1_onkeydown = function (data) {
        var atrrValue1 = this.riExchange.riInputElement.GetValue(this.uiForm, 'AttributeValue1');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelAttributeValue1', atrrValue1);
        this.ellipsisConfig.attribute1.ServiceCoverNumber['AttributeCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'AttributeCode');
        this.ellipsisConfig.attribute1.ServiceCoverNumber['AttributeLabel'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'AttributeLabel1');
    };
    ServiceCoverEntryComponent.prototype.attributeValue2_onkeydown = function (data) {
        var atrrValue2 = this.riExchange.riInputElement.GetValue(this.uiForm, 'AttributeValue2');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelAttributeValue2', atrrValue2);
        this.ellipsisConfig.attribute2.ServiceCoverNumber['AttributeCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'AttributeCode');
        this.ellipsisConfig.attribute2.ServiceCoverNumber['AttributeLabel'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'AttributeLabel2');
    };
    ServiceCoverEntryComponent.prototype.productRange_onkeydown = function (data) {
        var productRange = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductRange');
        var productRangeDesc = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductRangeDesc');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelProductRange', productRange);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelProductRangeDesc', productRangeDesc);
    };
    ServiceCoverEntryComponent.prototype.updateFieldDisableStatus = function () {
        if (this.mode === 'N') {
            this.riExchange.riInputElement.Disable(this.uiForm, 'ComponentTypeCode');
            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentCode');
            this.riExchange.riInputElement.Disable(this.uiForm, 'AlternateProductCode');
            this.riExchange.riInputElement.Disable(this.uiForm, 'AttributeValue1');
            this.riExchange.riInputElement.Disable(this.uiForm, 'AttributeValue2');
            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
            this.riExchange.riInputElement.Enable(this.uiForm, 'btnCompReplace');
            this.restoreFieldValues();
        }
        else {
            this.riExchange.riInputElement.Enable(this.uiForm, 'ComponentTypeCode');
            this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentCode');
            this.riExchange.riInputElement.Enable(this.uiForm, 'AlternateProductCode');
            this.riExchange.riInputElement.Enable(this.uiForm, 'AttributeValue1');
            this.riExchange.riInputElement.Enable(this.uiForm, 'AttributeValue2');
            this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentDesc');
            this.riExchange.riInputElement.Disable(this.uiForm, 'btnCompReplace');
            this.storeFieldValues();
        }
    };
    ServiceCoverEntryComponent.prototype.storeFieldValues = function () {
        this.storeValues.ComponentTypeCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ComponentTypeCode');
        this.storeValues.ComponentTypeDesc = this.riExchange.riInputElement.GetValue(this.uiForm, 'ComponentTypeDesc');
        this.storeValues.ProductComponentCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCode');
        this.storeValues.ProductComponentDesc = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentDesc');
        this.storeValues.ComponentQuantity = this.riExchange.riInputElement.GetValue(this.uiForm, 'ComponentQuantity');
        this.storeValues.AlternateProductCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'AlternateProductCode');
        this.storeValues.AttributeLabel1 = this.riExchange.riInputElement.GetValue(this.uiForm, 'AttributeLabel1');
        this.storeValues.AttributeValue1 = this.riExchange.riInputElement.GetValue(this.uiForm, 'AttributeValue1');
        this.storeValues.AttributeLabel2 = this.riExchange.riInputElement.GetValue(this.uiForm, 'AttributeLabel2');
        this.storeValues.AttributeValue2 = this.riExchange.riInputElement.GetValue(this.uiForm, 'AttributeValue2');
        this.storeValues.ProductRange = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductRange');
        this.storeValues.ProductRangeDesc = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductRangeDesc');
        this.storeValues.SequenceNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'SequenceNumber');
        this.storeValues.RotationalRule = this.riExchange.riInputElement.GetValue(this.uiForm, 'RotationalRule');
        this.storeValues.RotationalInterval = this.riExchange.riInputElement.GetValue(this.uiForm, 'RotationalInterval');
    };
    ServiceCoverEntryComponent.prototype.restoreFieldValues = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ComponentTypeCode', this.storeValues.ComponentTypeCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ComponentTypeDesc', this.storeValues.ComponentTypeDesc);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentCode', this.storeValues.ProductComponentCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentDesc', this.storeValues.ProductComponentDesc);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ComponentQuantity', this.storeValues.ComponentQuantity);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AlternateProductCode', this.storeValues.AlternateProductCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AttributeLabel1', this.storeValues.AttributeLabel1);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AttributeValue1', this.storeValues.AttributeValue1);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AttributeLabel2', this.storeValues.AttributeLabel2);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AttributeValue2', this.storeValues.AttributeValue2);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductRange', this.storeValues.ProductRange);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductRangeDesc', this.storeValues.ProductRangeDesc);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SequenceNumber', this.storeValues.SequenceNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'RotationalRule', this.storeValues.RotationalRule);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'RotationalInterval', this.storeValues.RotationalInterval);
    };
    ServiceCoverEntryComponent.prototype.clearFieldValues = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ComponentTypeCode', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ComponentTypeDesc', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentCode', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentDesc', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ComponentQuantity', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AlternateProductCode', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AttributeLabel1', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AttributeValue1', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AttributeLabel2', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AttributeValue2', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductRange', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductRangeDesc', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SequenceNumber', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'RotationalRule', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'RotationalInterval', '');
    };
    ServiceCoverEntryComponent.prototype.displayRotational = function () {
        var _this = this;
        var searchParams = this.getURLSearchParamObject();
        searchParams.set('action', '6');
        searchParams.set('Function', 'DisplayRotational');
        searchParams.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        searchParams.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        searchParams.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        searchParams.set('ServiceCoverNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber'));
        searchParams.set('ServiceCoverItemNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverItemNumber'));
        searchParams.set('ServiceCoverComponentNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverComponentNumber'));
        searchParams.set('ProductComponentCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCode'));
        searchParams.set('ProductComponentDesc', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentDesc'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams)
            .subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
                return;
            }
            if (data.RotationalProductInd === 'yes') {
                _this.riExchange.riInputElement.SetRequiredStatus(_this.uiForm, 'ProductRange', true);
                _this.showComponentRange = true;
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductRange', data.ProductRange);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductRangeDesc', data.ProductRangeDesc);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SequenceNumber', data.SequenceNumber);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'RotationalRule', data.RotationalRule);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'RotationalInterval', data.RotationalInterval);
                if (data.RotationalRule === 'C') {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductRangeDesc', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'PremiseName'));
                }
            }
            else {
                _this.riExchange.riInputElement.SetRequiredStatus(_this.uiForm, 'ProductRange', false);
                _this.showComponentRange = false;
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductRange', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductRangeDesc', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SequenceNumber', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'RotationalRule', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'RotationalInterval', '');
            }
            _this.rotationalRule_onChange();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverEntryComponent.prototype.populateAttributes = function () {
        var _this = this;
        var searchParams = this.getURLSearchParamObject();
        searchParams.set('action', '6');
        var bodyParams = {
            'Function': 'PopulateAttributes',
            'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
            'ComponentTypeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ComponentTypeCode')
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams)
            .subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
                return;
            }
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AttributeLabel1', data.AttributeLabel1);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AttributeLabel2', data.AttributeLabel2);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AttributeCode1', data.AttributeCode1);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AttributeCode2', data.AttributeCode2);
            if (data.AttributeMandatory1 === 'yes') {
                _this.attr1Mandatory = true;
                _this.riExchange.riInputElement.SetRequiredStatus(_this.uiForm, 'AttributeValue1', true);
            }
            else {
                _this.attr1Mandatory = false;
                _this.riExchange.riInputElement.SetRequiredStatus(_this.uiForm, 'AttributeValue1', false);
            }
            if (data.AttributeMandatory2 === 'yes') {
                _this.attr2Mandatory = true;
                _this.riExchange.riInputElement.SetRequiredStatus(_this.uiForm, 'AttributeValue2', true);
            }
            else {
                _this.attr2Mandatory = false;
                _this.riExchange.riInputElement.SetRequiredStatus(_this.uiForm, 'AttributeValue2', false);
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverEntryComponent.prototype.checkValidProduct = function () {
        var _this = this;
        var searchParams = this.getURLSearchParamObject();
        searchParams.set('action', '6');
        searchParams.set('Function', 'CheckValidProduct');
        searchParams.set('ProductComponentCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCode'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams)
            .subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
                _this.errorMessageFlag = true;
                return;
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverEntryComponent.prototype.inputField_OnChange = function (e, name) {
    };
    ServiceCoverEntryComponent.prototype.btnDelete_Click = function () {
        this.promptModal.show();
    };
    ServiceCoverEntryComponent.prototype.promptSave = function (ev) {
        this.riMaintenance_BeforeDelete();
    };
    ServiceCoverEntryComponent.prototype.btnCompReplace_onClick = function () {
        this.navigate('DisplayEntry', '/application/maintenance/serviceCover/replacement');
    };
    ServiceCoverEntryComponent.prototype.btnCustomUpdate_onClick = function () {
        this.checkValidProduct();
        if (!this.errorMessageFlag) {
            this.navigate('CustomComponentUpdate', 'business/RangeDetailGrid');
        }
    };
    ServiceCoverEntryComponent.prototype.routeAwayUpdateSaveFlag = function () {
        var _this = this;
        this.uiForm.statusChanges.subscribe(function (value) {
            if (_this.mode !== 'N') {
                _this.routeAwayGlobals.setSaveEnabledFlag(true);
            }
            else {
                _this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    };
    ServiceCoverEntryComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverComponentEntry.html'
                },] },
    ];
    ServiceCoverEntryComponent.ctorParameters = [
        { type: Injector, },
        { type: RouteAwayGlobals, },
    ];
    ServiceCoverEntryComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return ServiceCoverEntryComponent;
}(BaseComponent));
