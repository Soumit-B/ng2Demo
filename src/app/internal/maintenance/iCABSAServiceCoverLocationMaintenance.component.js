var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from '../../base/BaseComponent';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PremiseLocationSearchComponent } from './../search/iCABSAPremiseLocationSearch.component';
import { ProductSearchGridComponent } from './../search/iCABSBProductSearch';
import { ServiceCoverSearchComponent } from './../search/iCABSAServiceCoverSearch';
export var ServiceCoverLocationMaintenanceComponent = (function (_super) {
    __extends(ServiceCoverLocationMaintenanceComponent, _super);
    function ServiceCoverLocationMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.isRequesting = false;
        this.showCloseButton = true;
        this.modalConfig = { backdrop: 'static', keyboard: true };
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.promptTitle = 'Confirm';
        this.promptContent = 'Confirm Record?';
        this.showPromptHeader = true;
        this.pageId = '';
        this.controls = [
            { name: 'ContractNumber', readonly: true, disabled: false, required: false },
            { name: 'ContractName', readonly: true, disabled: false, required: false },
            { name: 'PremiseNumber', readonly: true, disabled: false, required: false },
            { name: 'PremiseName', readonly: true, disabled: false, required: false },
            { name: 'ProductCode', readonly: false, disabled: false, required: false },
            { name: 'ProductDesc', readonly: false, disabled: false, required: false },
            { name: 'ServiceQuantity', readonly: false, disabled: false, required: false },
            { name: 'UnallocatedQuantity', readonly: false, disabled: false, required: false },
            { name: 'ServiceVisitFrequency', readonly: false, disabled: false, required: false },
            { name: 'PremiseLocationNumber', readonly: false, disabled: false, required: false },
            { name: 'PremiseLocationDesc', readonly: false, disabled: false, required: false },
            { name: 'QuantityAtLocation', readonly: false, disabled: false, required: false },
            { name: 'QuantityChange', readonly: false, disabled: false, required: false },
            { name: 'EffectiveDate', readonly: false, disabled: false, required: false },
            { name: 'menu', readonly: false, disabled: false, required: false },
            { name: 'ROWID', readonly: false, disabled: false, required: false },
            { name: 'ServiceCoverRowID', readonly: false, disabled: false, required: false },
            { name: 'ServiceCoverLocationRowID', readonly: false, disabled: false, required: false }
        ];
        this.uiDisplay = {};
        this.dropDown = {
            menu: []
        };
        this.ellipsis = {
            productCodeEllipsis: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'PremiseAllocate-Search',
                    'currentContractType': this.riExchange.getCurrentContractType(),
                    'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeLabel(),
                    'showAddNew': false
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                component: ProductSearchGridComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            serviceCoverEllipsis: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'currentContractType': this.riExchange.getCurrentContractType(),
                    'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeLabel(),
                    'showAddNew': false
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                component: ServiceCoverSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            premiseLocationEllipsis: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp-Allocate',
                    'currentContractType': this.riExchange.getCurrentContractType(),
                    'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeLabel(),
                    'showAddNew': false
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                component: PremiseLocationSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            }
        };
        this.xhrParams = {
            module: 'locations',
            method: 'service-delivery/maintenance',
            operation: 'Application/iCABSAServiceCoverLocationMaintenance'
        };
        this.actionAfterSave = 0;
        this.currentActivity = '';
        this.labelContractNumber = 'Contract Number';
        this.pageId = PageIdentifier.ICABSASERVICECOVERLOCATIONMAINTENANCE;
    }
    ServiceCoverLocationMaintenanceComponent.prototype.openModal = function (ellipsisName) { this[ellipsisName].openModal(); };
    ServiceCoverLocationMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Service Cover Location Maintenance';
        this.pageParams.WindowPath = '';
        this.pageParams.blnNoneInstalled = '';
        this.pageParams.blnAutoSearch = '';
        this.pageParams.RecordType = '';
        this.pageParams.AmendedServiceCoverRowID = '';
        this.pageParams.ServiceCoverQuantityChange = '';
        this.pageParams.DefaultEffectiveDate = '';
        this.pageParams.DefaultEffectiveDateProduct = '';
        this.pageParams.blnUnitsInHold = false;
        this.routeAwayUpdateSaveFlag();
        this.routeAwayGlobals.setEllipseOpenFlag(false);
        this.window_onload();
    };
    ServiceCoverLocationMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        this.routeAwayGlobals.resetRouteAwayFlags();
    };
    ServiceCoverLocationMaintenanceComponent.prototype.doLookup = function () {
    };
    ServiceCoverLocationMaintenanceComponent.prototype.getSysCharDtetails = function () {
    };
    ServiceCoverLocationMaintenanceComponent.prototype.showAlert = function (msgTxt, type) {
        var titleModal = '';
        if (typeof type === 'undefined')
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
    ServiceCoverLocationMaintenanceComponent.prototype.showSpinner = function () { this.isRequesting = true; };
    ServiceCoverLocationMaintenanceComponent.prototype.hideSpinner = function () { this.isRequesting = false; };
    ServiceCoverLocationMaintenanceComponent.prototype.save = function () {
        this.currentActivity = 'SAVE';
        this.riMaintenance.CancelEvent = false;
        this.logger.log('SAVE clicked', this.checkErrorStatus(), this.currentActivity, this.riMaintenance.CurrentMode);
        if (this.checkErrorStatus()) {
            switch (this.currentActivity) {
                case 'SAVE':
                    this.currentActivity = '';
                    switch (this.riMaintenance.CurrentMode) {
                        case 'eModeAdd':
                        case 'eModeSaveAdd':
                            this.actionAfterSave = 1;
                            this.riMaintenance.execMode(MntConst.eModeSaveAdd, [this]);
                            break;
                        case 'eModeUpdate':
                        case 'eModeSaveUpdate':
                            this.actionAfterSave = 2;
                            this.riMaintenance.execMode(MntConst.eModeSaveUpdate, [this]);
                            break;
                    }
                    break;
            }
            this.routeAwayGlobals.setSaveEnabledFlag(true);
        }
    };
    ServiceCoverLocationMaintenanceComponent.prototype.confirm = function () {
        this.promptModal.show();
    };
    ServiceCoverLocationMaintenanceComponent.prototype.confirmed = function (obj) {
        this.riMaintenance.CancelEvent = false;
        this.riMaintenance.execContinue(this.riMaintenance.CurrentMode, [this]);
    };
    ServiceCoverLocationMaintenanceComponent.prototype.closeModal = function () {
        this.logger.log('Modal closed.');
        this.isModalOpen(false);
        this.riMaintenance.handleConfirm(this);
    };
    ServiceCoverLocationMaintenanceComponent.prototype.isModalOpen = function (flag) {
        this.logger.log('isModalOpen', flag);
        this.riMaintenance.isModalOpen = flag;
    };
    ServiceCoverLocationMaintenanceComponent.prototype.cancel = function () {
        this.logger.log('CANCEL clicked');
        this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
        this.setControlValue('QuantityChange', '');
        this.EffectiveDate = null;
    };
    ServiceCoverLocationMaintenanceComponent.prototype.checkErrorStatus = function () {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ProductCode', true);
        var hasError_ProductCode = this.riExchange.riInputElement.isError(this.uiForm, 'ProductCode');
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseLocationNumber', true);
        var hasError_PremiseLocationNumber = this.riExchange.riInputElement.isError(this.uiForm, 'PremiseLocationNumber');
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EffectiveDate', true);
        var hasError_EffectiveDate = this.riExchange.riInputElement.isError(this.uiForm, 'EffectiveDate');
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'QuantityChange', true);
        var hasError_QuantityChange = this.riExchange.riInputElement.isError(this.uiForm, 'QuantityChange');
        if (!hasError_ProductCode
            && !hasError_PremiseLocationNumber
            && !hasError_EffectiveDate
            && !hasError_QuantityChange) {
            return true;
        }
        else {
            return false;
        }
    };
    ServiceCoverLocationMaintenanceComponent.prototype.window_onload = function () {
        var _this = this;
        this.pageParams.RecordType = this.riExchange.getParentAttributeValue('RecordType');
        this.setControlValue('menu', 'Options');
        if (this.pageParams.RecordType === 'ServiceCoverLocation' || this.pageParams.RecordType === 'ServiceCover') {
            this.setControlValue('ServiceVisitFrequency', this.riExchange.getParentAttributeValue('ServiceVisitFrequency'));
        }
        this.pageParams.DefaultEffectiveDate = this.riExchange.getParentAttributeValue('DefaultEffectiveDate');
        this.pageParams.DefaultEffectiveDateProduct = this.riExchange.getParentAttributeValue('DefaultEffectiveDateProduct');
        if (this.pageParams.RecordType === 'ServiceCover') {
            this.pageParams.AmendedServiceCoverRowID = this.riExchange.getParentAttributeValue('AmendedServiceCoverRowID');
            this.pageParams.ServiceCoverQuantityChange = this.riExchange.getParentAttributeValue('ServiceCoverQuantityChange');
        }
        var CurrentContractType = this.riExchange.setCurrentContractType();
        this.riExchange.riInputElement.Add(this.uiForm, 'ServiceQuantity');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceQuantity');
        this.riExchange.riInputElement.Add(this.uiForm, 'UnallocatedQuantity');
        this.riExchange.riInputElement.Disable(this.uiForm, 'UnallocatedQuantity');
        var strInpTitle = '^1^ Number';
        var strDocTitle = '^1^ Service Cover Location Maintenance';
        this.getTranslatedValue(strInpTitle, null).subscribe(function (res) {
            if (_this.getTranslatedValue(strInpTitle, null)) {
                strInpTitle = res;
            }
            _this.getTranslatedValue(strDocTitle, null).subscribe(function (res) {
                if (res) {
                    strDocTitle = res;
                }
                strInpTitle = strInpTitle.replace('^1^', _this.riExchange.getCurrentContractTypeLabel());
                strDocTitle = strDocTitle.replace('^1^', _this.riExchange.getCurrentContractTypeLabel());
                _this.utils.setTitle(strDocTitle);
                _this.labelContractNumber = strInpTitle;
            });
        });
        if (this.parentMode === 'Premise-Allocate' || this.parentMode === 'ServiceCover-Increase') {
            this.riExchange.getParentHTMLValue('ContractNumber');
            this.riExchange.getParentHTMLValue('ContractName');
            this.riExchange.getParentHTMLValue('PremiseNumber');
            this.riExchange.getParentHTMLValue('PremiseName');
        }
        else if (this.parentMode === 'System-Allocate') {
            this.setControlValue('ContractNumber', this.riExchange.getParentAttributeValue('ContractNumber'));
            this.setControlValue('ContractName', this.riExchange.getParentAttributeValue('ContractName'));
            this.setControlValue('PremiseNumber', this.riExchange.getParentAttributeValue('PremiseNumber'));
            this.setControlValue('PremiseName', this.riExchange.getParentAttributeValue('PremiseName'));
        }
        this.riExchange.riInputElement.Add(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Add(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Add(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Add(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Add(this.uiForm, 'ServiceVisitFrequency');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceVisitFrequency');
        if (this.pageParams.RecordType !== 'PremiseLocation') {
            this.setControlValue('ProductCode', this.riExchange.getParentAttributeValue('ProductCode'));
            this.setControlValue('ProductDesc', this.riExchange.getParentAttributeValue('ProductDesc'));
        }
        switch (this.pageParams.RecordType) {
            case 'ServiceCover':
                if (this.riExchange.getParentAttributeValue('ServiceCoverRowID')) {
                    this.setControlValue('ServiceCoverRowID', this.riExchange.getParentAttributeValue('ServiceCoverRowID'));
                }
                else {
                    this.setControlValue('ServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCoverRowID'));
                }
                break;
            case 'PremiseLocation':
                if (this.riExchange.getParentAttributeValue('PremiseLocationNumber')) {
                    this.setControlValue('PremiseLocationNumber', this.riExchange.getParentAttributeValue('PremiseLocationNumber'));
                }
                else {
                    this.setControlValue('PremiseLocationNumber', this.riExchange.getParentHTMLValue('PremiseLocationNumber'));
                }
                if (this.riExchange.getParentAttributeValue('PremiseLocationDesc')) {
                    this.setControlValue('PremiseLocationDesc', this.riExchange.getParentAttributeValue('PremiseLocationDesc'));
                }
                else {
                    this.setControlValue('PremiseLocationDesc', this.riExchange.getParentHTMLValue('PremiseLocationDesc'));
                }
                break;
            case 'ServiceCoverLocation':
                if (this.riExchange.getParentAttributeValue('ServiceCoverLocationRowID')) {
                    this.setControlValue('ServiceCoverLocationRowID', this.riExchange.getParentAttributeValue('ServiceCoverLocationRowID'));
                }
                this.setControlValue('ServiceCoverLocationRowID', this.riExchange.getParentHTMLValue('ServiceCoverLocationRowID'));
                if (this.getControlValue('ServiceCoverLocationRowID')) {
                    this.setControlValue('ROWID', this.getControlValue('ServiceCoverLocationRowID'));
                }
                else {
                    this.setControlValue('ROWID', this.riExchange.getParentHTMLValue('ServiceCoverLocationRowID'));
                }
                break;
        }
        this.riMaintenance.BusinessObject = 'riControl.p';
        this.riMaintenance.CustomBusinessObject = 'iCABSServiceCoverLocEntry.p';
        this.riMaintenance.CustomBusinessObjectSelect = false;
        this.riMaintenance.CustomBusinessObjectConfirm = false;
        this.riMaintenance.CustomBusinessObjectInsert = true;
        this.riMaintenance.CustomBusinessObjectUpdate = true;
        this.riMaintenance.CustomBusinessObjectDelete = false;
        this.riMaintenance.FunctionSnapShot = false;
        if (this.parentMode === 'Premise-Allocate' || this.parentMode === 'ServiceCover-Increase') {
            this.riMaintenance.FunctionSearch = false;
        }
        if ((this.parentMode === 'Premise-Allocate' || this.parentMode === 'ServiceCover-Increase') && this.pageParams.RecordType === 'ServiceCoverLocation') {
            this.riMaintenance.FunctionDelete = true;
        }
        else {
            this.riMaintenance.FunctionDelete = false;
        }
        if (this.pageParams.RecordType === 'ServiceCoverLocation') {
            this.riMaintenance.FunctionAdd = false;
            this.riMaintenance.FunctionDelete = false;
        }
        this.riMaintenance.AddTable('ServiceCoverLocation');
        this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddTableKey('ROWID', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        this.riMaintenance.AddTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        this.riMaintenance.AddTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        this.riMaintenance.AddTableKey('ProductCode', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        this.riMaintenance.AddTableKeyAlignment('ProductCode', MntConst.eAlignmentRight);
        if (this.pageParams.RecordType === 'PremiseLocation') {
            this.riMaintenance.AddTableKey('PremiseLocationNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        }
        this.riMaintenance.AddTableField('QuantityAtLocation', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableCommit(this, this.getTableCallbackData);
        this.riMaintenance.AddTable('*');
        this.riMaintenance.AddTableField('QuantityChange', MntConst.eTypeInteger, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('EffectiveDate', MntConst.eTypeDate, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableCommit(this, this.getTableCallbackData);
        if ((this.parentMode === 'Premise-Allocate' || this.parentMode === 'ServiceCover-Increase') && this.pageParams.RecordType === 'ServiceCoverLocation') {
            this.riMaintenance.RowID(this, 'ServiceCoverLocation', this.riExchange.getParentAttributeValue('ServiceCoverLocationRowID'));
        }
        this.riMaintenance.AddVirtualTable('Contract');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('ContractName', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this, this.getVitualCallbackData);
        this.riMaintenance.AddVirtualTable('Premise');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('PremiseName', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this, this.getVitualCallbackData);
        this.riMaintenance.AddVirtualTable('Product');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('ProductCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('ProductDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this, this.getVitualCallbackData);
        if ((this.parentMode === 'Premise-Allocate' || this.parentMode === 'ServiceCover-Increase') && this.pageParams.RecordType === 'PremiseLocation') {
            this.riMaintenance.AddVirtualTable('PremiseLocation');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('PremiseNumber', MntConst.eTypeCodeNumeric, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('PremiseLocationNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('PremiseLocationDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateFixed, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this, this.getVitualCallbackData);
        }
        else {
            this.riMaintenance.AddVirtualTable('PremiseLocation');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('PremiseNumber', MntConst.eTypeCodeNumeric, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('PremiseLocationNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('PremiseLocationDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this, this.getVitualCallbackData);
        }
        this.riMaintenance.Complete();
        if (this.pageParams.RecordType !== 'PremiseLocation') {
            this.GetUnallocated();
        }
        if (this.pageParams.RecordType === 'ServiceCover' || this.pageParams.RecordType === 'PremiseLocation') {
            this.riMaintenance.AddMode();
            this.riMaintenance.execMode(this.riMaintenance.CurrentMode, [this]);
        }
        else if (this.riMaintenance.RecordSelected(false)) {
            this.riMaintenance.FetchRecord();
            this.riMaintenance.UpdateMode();
            this.riMaintenance.execMode(this.riMaintenance.CurrentMode, [this]);
        }
    };
    ServiceCoverLocationMaintenanceComponent.prototype.getTableCallbackData = function (data) {
        this.logger.log('Get Table CallBack Data', data);
    };
    ServiceCoverLocationMaintenanceComponent.prototype.getVitualCallbackData = function (data) {
        this.logger.log('Get Virtual Table CallBack Data', data);
        this.setEllipsisData();
    };
    ServiceCoverLocationMaintenanceComponent.prototype.setEllipsisData = function () {
        this.ellipsis.premiseLocationEllipsis.childConfigParams['ContractNumber'] = this.getControlValue('ContractNumber');
        this.ellipsis.premiseLocationEllipsis.childConfigParams['ContractName'] = this.getControlValue('ContractName');
        this.ellipsis.premiseLocationEllipsis.childConfigParams['PremiseNumber'] = this.getControlValue('PremiseNumber');
        this.ellipsis.premiseLocationEllipsis.childConfigParams['PremiseName'] = this.getControlValue('PremiseName');
    };
    ServiceCoverLocationMaintenanceComponent.prototype.ProductCode_onkeydown = function () {
    };
    ServiceCoverLocationMaintenanceComponent.prototype.productCode_onChange = function (e) {
        if (e.target.value) {
            this.riMaintenance.AddVirtualTable('Product');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('ProductCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('ProductDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this, this.getVitualCallbackData);
        }
    };
    ServiceCoverLocationMaintenanceComponent.prototype.PremiseLocationNumber_onkeydown = function () {
    };
    ServiceCoverLocationMaintenanceComponent.prototype.premiseLocationSelection = function (obj) {
        if (obj) {
            this.setControlValue('PremiseLocationNumber', obj.PremiseLocationNumber);
            this.setControlValue('PremiseLocationDesc', obj.PremiseLocationDesc);
        }
    };
    ServiceCoverLocationMaintenanceComponent.prototype.premiseLocationNumber_onChange = function (e) {
        if (e.target.value) {
            this.riMaintenance.AddVirtualTable('PremiseLocation');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('PremiseNumber', MntConst.eTypeCodeNumeric, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('PremiseLocationNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('PremiseLocationDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateFixed, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this, this.getVitualCallbackData);
        }
    };
    ServiceCoverLocationMaintenanceComponent.prototype.LocationSearch = function () {
    };
    ServiceCoverLocationMaintenanceComponent.prototype.effectiveDateSelectedValue = function (value) {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EffectiveDate', value.value);
        }
    };
    ServiceCoverLocationMaintenanceComponent.prototype.riExchange_CBORequest = function () {
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ProductCode')) {
            if (this.getControlValue('ProductCode') === this.pageParams.DefaultEffectiveDateProduct) {
                this.setControlValue('EffectiveDate', this.pageParams.DefaultEffectiveDate);
                this.setDatePicker();
            }
        }
    };
    ServiceCoverLocationMaintenanceComponent.prototype.riMaintenance_AfterAbandon = function () {
        if (this.pageParams.RecordType === 'PremiseLocation') {
            this.setControlValue('ProductDesc', '');
            this.setControlValue('ServiceVisitFrequency', '');
            this.setControlValue('ServiceQuantity', '');
            this.setControlValue('UnallocatedQuantity', '');
        }
    };
    ServiceCoverLocationMaintenanceComponent.prototype.riMaintenance_BeforeSave = function () {
        var TempServiceCoverRowID, strCheckRowID;
        if (this.pageParams.RecordType === 'ServiceCover' || this.pageParams.RecordType === 'PremiseLocation') {
            TempServiceCoverRowID = this.riExchange.getParentAttributeValue('ServiceCoverRowID');
            strCheckRowID = TempServiceCoverRowID;
        }
        else {
            TempServiceCoverRowID = '';
            strCheckRowID = this.riExchange.getParentAttributeValue('ServiceCoverLocationRowID');
        }
        if (this.pageParams.blnUnitsInHold) {
            this.showAlert('2517');
        }
        this.riMaintenance.BusinessObject = 'iCABSCheckPremiseAllocation.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('CheckType', 'ServiceCover', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('ChangeDate', this.getControlValue('EffectiveDate'), MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('RecordType', this.pageParams.RecordType, MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('ChangeQuantity', this.getControlValue('QuantityChange'), MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('ServiceCoverRowID', strCheckRowID, MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('PremiseLocationNumber', this.getControlValue('PremiseLocationNumber'), MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('ErrorMessage', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data) {
            if (data['ErrorMessage'] !== '') {
                this.showAlert(data['ErrorMessage']);
            }
        }, 'POST', 0);
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'ServiceCoverRowID=' + TempServiceCoverRowID;
    };
    ServiceCoverLocationMaintenanceComponent.prototype.riMaintenance_BeforeUpdateMode = function () {
        if (this.getControlValue('ProductCode') === this.pageParams.DefaultEffectiveDateProduct) {
            this.setControlValue('EffectiveDate', this.pageParams.DefaultEffectiveDate);
            this.setDatePicker();
        }
    };
    ServiceCoverLocationMaintenanceComponent.prototype.riMaintenance_BeforeAddMode = function () {
        switch (this.pageParams.RecordType) {
            case 'PremiseLocation':
                this.navigate('LookUp-Freq-Loc', '/application/serviceCoverSearch');
                this.setControlValue('QuantityAtLocation', '0');
                break;
            case 'ServiceCover':
                this.LocationSearch();
                if (this.getControlValue('ProductCode') === this.pageParams.DefaultEffectiveDateProduct) {
                    this.setControlValue('EffectiveDate', this.pageParams.DefaultEffectiveDate);
                    this.setDatePicker();
                }
        }
    };
    ServiceCoverLocationMaintenanceComponent.prototype.riExchange_UpdateHTMLDocument = function () {
        if (this.pageParams.RecordType === 'PremiseLocation') {
            this.attributes.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
            if (this.getControlValue('ProductCode') !== '') {
                this.GetUnallocated();
            }
        }
    };
    ServiceCoverLocationMaintenanceComponent.prototype.riMaintenance_AfterSave = function () {
        var fields = "QuantityChange, EffectiveDate, ServiceCoverLocationRowID, ContractNumber, PremiseNumber, ProductCode, PremiseLocationNumber, QuantityAtLocation, ServiceCoverRowID";
        fields = fields.replace(/\\t/g, '').replace(/\r?\n|\r/g, '').replace(/ /g, '');
        var fieldsArr = fields.split(',');
        this.riMaintenance.clear();
        for (var i = 0; i < fieldsArr.length; i++) {
            var id = fieldsArr[i];
            var dataType = this.riMaintenance.getControlType(this.controls, id, 'type');
            var value = this.riExchange.riInputElement.GetValue(this.uiForm, id);
            this.riMaintenance.PostDataAdd(id, value, dataType);
        }
        this.riMaintenance.Execute(this, function (data) {
            this.logger.log('DATA POST', data);
            if (data.hasOwnProperty('errorMessage')) {
                if (data.errorMessage.trim() !== '') {
                    this.showAlert(data.errorMessage);
                }
            }
            else {
                this.showAlert('Data Saved', 1);
                if (this.pageParams.RecordType === 'ServiceCover' || this.pageParams.RecordType === 'ServiceCoverLocation') {
                    this.GetUnallocated();
                }
            }
        }, 'POST', this.actionAfterSave);
    };
    ServiceCoverLocationMaintenanceComponent.prototype.riMaintenance_AfterEvent = function () {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd
            || this.riMaintenance.CurrentMode === MntConst.eModeUpdate
            || this.riMaintenance.CurrentMode === MntConst.eModeDelete) {
            this.closeWindowSafe();
        }
    };
    ServiceCoverLocationMaintenanceComponent.prototype.closeWindowSafe = function () {
        this.routeAwayUpdateSaveFlag();
    };
    ServiceCoverLocationMaintenanceComponent.prototype.riExchange_UnLoadHTMLDocument = function () {
    };
    ServiceCoverLocationMaintenanceComponent.prototype.GetUnallocated = function () {
        var tempServiceCoverRowID;
        this.riMaintenance.BusinessObject = 'iCABSCheckServiceCoverAllocation.p';
        this.riMaintenance.clear();
        if (this.parentMode === 'Premise-Allocate'
            || this.parentMode === 'ServiceCover-Increase') {
            switch (this.pageParams.RecordType) {
                case 'PremiseLocation':
                    tempServiceCoverRowID = this.riExchange.getParentAttributeValue('ServiceCoverRowID');
                    break;
                case 'ServiceCover':
                    tempServiceCoverRowID = this.riExchange.getParentAttributeValue('ServiceCoverRowID');
                    break;
                default:
                    tempServiceCoverRowID = this.riExchange.getParentAttributeValue('ServiceCoverRowID');
                    break;
            }
        }
        else {
            tempServiceCoverRowID = this.riExchange.getParentAttributeValue('ServiceCoverRowID');
        }
        if (tempServiceCoverRowID !== '') {
            this.riMaintenance.PostDataAdd('ServiceCoverRowID', tempServiceCoverRowID, MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('ServiceCoverLocationRowID', this.riExchange.getParentAttributeValue('ServiceCoverLocationRowID'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('RecordType', this.pageParams.RecordType, MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('PremiseLocationNumber', this.getControlValue('PremiseLocationNumber'), MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('UnallocatedQuantity', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('ServiceQuantity', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('UnitsInHold', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('NewServiceCoverRowID', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data) {
                this.logger.log('PDA callback A', data);
                this.pageParams.blnUnitsInHold = data['UnitsInHold'].toLowerCase() === 'yes' ? true : false;
                this.setControlValue('UnallocatedQuantity', data['UnallocatedQuantity']);
                this.setControlValue('ServiceQuantity', data['ServiceQuantity']);
                this.attributes.RowID = data['NewServiceCoverRowID'];
                this.setControlValue('ServiceCoverRowID', this.attributes.RowID);
            }, 'GET', 0);
        }
    };
    ServiceCoverLocationMaintenanceComponent.prototype.menu_onchange = function (menu) {
        switch (menu) {
            case 'ServiceValue':
                this.router.navigate(['/grid/contractmanagement/account/serviceValue'], {
                    queryParams: {
                        ParentMode: 'ServiceCoverHistory-All',
                        CurrentContractTypeURLParameter: this.riExchange.getCurrentContractType()
                    }
                });
                break;
        }
    };
    ServiceCoverLocationMaintenanceComponent.prototype.setDatePicker = function () {
        var EffectiveDate = this.pageParams.DefaultEffectiveDate;
        if (window['moment'](EffectiveDate, 'DD/MM/YYYY', true).isValid()) {
            EffectiveDate = this.utils.convertDate(this.riExchange.getParentHTMLValue('EffectiveDate'));
        }
        else {
            EffectiveDate = this.utils.formatDate(this.riExchange.getParentHTMLValue('EffectiveDate'));
        }
        this.EffectiveDate = new Date(EffectiveDate);
    };
    ServiceCoverLocationMaintenanceComponent.prototype.routeAwayUpdateSaveFlag = function () {
        var _this = this;
        this.uiForm.statusChanges.subscribe(function (value) {
            if (value === 'VALID') {
                _this.routeAwayGlobals.setSaveEnabledFlag(true);
            }
            else {
                _this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    };
    ServiceCoverLocationMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverLocationMaintenance.html'
                },] },
    ];
    ServiceCoverLocationMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    ServiceCoverLocationMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'premiseLocationEllipsis': [{ type: ViewChild, args: ['premiseLocationEllipsis',] },],
        'productCodeEllipsis': [{ type: ViewChild, args: ['productCodeEllipsis',] },],
        'serviceCoverEllipsis': [{ type: ViewChild, args: ['serviceCoverEllipsis',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return ServiceCoverLocationMaintenanceComponent;
}(BaseComponent));
