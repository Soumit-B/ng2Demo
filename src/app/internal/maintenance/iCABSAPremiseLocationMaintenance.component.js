var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild, EventEmitter } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { PremiseLocationSearchComponent } from './../../internal/search/iCABSAPremiseLocationSearch.component';
export var PremiseLocationMaintenanceComponent = (function (_super) {
    __extends(PremiseLocationMaintenanceComponent, _super);
    function PremiseLocationMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.queryParams = {
            operation: 'Application/iCABSAPremiseLocationMaintenance',
            module: 'locations',
            method: 'service-delivery/maintenance',
            ActionSearch: '0',
            ActionUpdate: '6',
            ActionEdit: '2',
            ActionDelete: '3',
            ActionInsert: '1'
        };
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.showPromptHeader = true;
        this.routeParams = {};
        this.postData = {};
        this.saveDataAdd = {};
        this.saveDataDelete = {};
        this.setFocusOnPremiseLocationNumber = new EventEmitter();
        this.setFocusOnPremiseLocationDesc = new EventEmitter();
        this.controls = [
            { name: 'ContractNumber' },
            { name: 'ContractName' },
            { name: 'PremiseNumber' },
            { name: 'PremiseName' },
            { name: 'PremiseLocationNumber' },
            { name: 'PremiseLocationDesc' },
            { name: 'menu' },
            { name: 'ContractTypeCode' },
            { name: 'PremiseLocationRowID' }
        ];
        this.ellipsis = {
            contract: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'ContractNumber': '',
                    'ContractName': '',
                    'currentContractType': '',
                    'currentContractTypeURLParameter': '',
                    'showAddNew': true
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: ContractSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: true
            },
            premise: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'Search',
                    'ContractNumber': '',
                    'ContractName': '',
                    'PremiseNumber': '',
                    'PremiseName': '',
                    'showAddNew': true
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: PremiseSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: true
            },
            premiseLocation: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'ContractNumber': '',
                    'ContractName': '',
                    'PremiseNumber': '',
                    'PremiseName': '',
                    'showAddNew': true
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: PremiseLocationSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            }
        };
        this.pageId = PageIdentifier.ICABSAPREMISELOCATIONMAINTENANCE;
        this.setErrorCallback(this);
        this.setURLQueryParameters(this);
        this.handleBackNavigation(this);
    }
    PremiseLocationMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.routeParams = this.riExchange.getRouterParams();
        this.setCurrentContractType();
        this.setPageTitle();
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.setFormMode(this.c_s_MODE_SELECT);
        }
        else {
            this.window_onload();
        }
    };
    PremiseLocationMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    PremiseLocationMaintenanceComponent.prototype.ngAfterViewInit = function () {
    };
    PremiseLocationMaintenanceComponent.prototype.window_onload = function () {
        this.getSysCharDtetails();
    };
    PremiseLocationMaintenanceComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show({ msg: data, title: 'Error' }, false);
    };
    PremiseLocationMaintenanceComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data, title: 'Message' }, false);
    };
    PremiseLocationMaintenanceComponent.prototype.getURLQueryParameters = function (param) {
        if (param['Mode']) {
            this.pageParams.ParentMode = param['Mode'];
        }
        else {
            this.pageParams.ParentMode = this.riExchange.getParentMode();
        }
        this.pageParams.CurrentContractTypeURLParameter = param['CurrentContractTypeURLParameter'];
    };
    PremiseLocationMaintenanceComponent.prototype.setCurrentContractType = function () {
        this.pageParams.currentContractType = this.riExchange.getCurrentContractType();
        this.pageParams.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
    };
    PremiseLocationMaintenanceComponent.prototype.setPageTitle = function () {
        var strDocTitle = this.getTranslatedValue('^1^ Premises Location Maintenance');
        var strInpTitle = this.getTranslatedValue('^1^ Number');
        this.inpTitle = strInpTitle.value.replace('^1^', this.riExchange.getCurrentContractTypeLabel());
        this.pageTitle = strDocTitle.value.replace('^1^', this.riExchange.getCurrentContractTypeLabel());
        this.utils.setTitle(this.pageTitle);
    };
    PremiseLocationMaintenanceComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableLocations,
            this.sysCharConstants.SystemCharEnableServiceCoverDisplayLevel,
            this.sysCharConstants.SystemCharDisableFirstCapitalOnAddressContact
        ];
        var sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records;
            _this.pageParams.vbEnableLocations = record[0]['Logical'];
            _this.pageParams.vbHoldingLocationDesc = record[0]['Text'];
            _this.pageParams.vbEnableServiceCoverDispLev = record[1]['Required'];
            _this.pageParams.vbDisableCapitalFirstLtr = record[2]['Required'];
            _this.setDefaultFormData();
        });
    };
    PremiseLocationMaintenanceComponent.prototype.setDefaultFormData = function () {
        this.pageParams.FunctionUpdate = true;
        this.pageParams.FunctionAdd = true;
        this.pageParams.FunctionDelete = true;
        this.pageParams.IsDeleteEnable = true;
        this.pageParams.FunctionSelect = true;
        this.formData.strHoldingLocationDesc = this.pageParams.vbHoldingLocationDesc ? this.pageParams.vbHoldingLocationDesc : '';
        if (this.pageParams.ParentMode === 'ProductAllocateAdd' || this.pageParams.ParentMode === 'NewLocationGrid') {
            this.riExchange.SetParentHTMLInputElementAttribute('PremiseLocationNumber', '');
        }
        this.disableControl('ContractNumber', true);
        this.disableControl('ContractName', true);
        this.disableControl('PremiseNumber', true);
        this.disableControl('PremiseName', true);
        this.disableControl('PremiseLocationDesc', true);
        this.riExchange.setParentAttributeValue('ContractNumber', this.riExchange.getParentHTMLValue('PremiseLocationNumber'));
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        this.setControlValue('ContractTypeCode', this.pageParams.currentContractType);
        this.setControlValue('menu', 'Options');
        this.setControlValue('PremiseLocationNumber', this.riExchange.getParentHTMLValue('PremiseLocationNumber') ? this.riExchange.getParentHTMLValue('PremiseLocationNumber') : '');
        this.setControlValue('PremiseLocationDesc', this.riExchange.getParentHTMLValue('PremiseLocationDesc') ? this.riExchange.getParentHTMLValue('PremiseLocationDesc') : '');
        this.formData.ParentRowID = this.riExchange.getParentHTMLValue('ParentRowID');
        if (this.pageParams.ParentMode === 'NewLocationGrid') {
            this.setControlValue('ContractNumber', this.riExchange.getParentAttributeValue('ContractNumber'));
            this.setControlValue('ContractName', this.riExchange.getParentAttributeValue('ContractName'));
            this.setControlValue('PremiseNumber', this.riExchange.getParentAttributeValue('PremiseNumber'));
            this.setControlValue('PremiseName', this.riExchange.getParentAttributeValue('PremiseName'));
        }
        switch (this.pageParams.ParentMode) {
            case 'Premise':
            case 'Search':
            case 'SearchAdd':
            case 'PremiseAllocateAdd':
            case 'ProductAllocateAdd':
                this.formData.FunctionSearch = false;
                break;
            case 'EmptySearch':
                this.pageParams.FunctionSelect = false;
                this.pageParams.FunctionAdd = false;
                break;
            default:
                this.pageParams.FunctionSnapShot = false;
        }
        if (this.pageParams.ParentMode === 'EmptySearch') {
            this.setControlValue('PremiseLocationRowID', this.riExchange.getParentAttributeValue('premiseLocationRowID'));
        }
        this.callLookupData();
        if (this.pageParams.ParentMode === 'EmptySearch') {
            this.FetchRecord();
        }
        switch (this.pageParams.ParentMode) {
            case 'SearchAdd':
            case 'PremiseAllocateAdd':
            case 'ProductAllocateAdd':
            case 'Premise':
            case 'NewLocationGrid':
                this.AddMode();
                break;
        }
        if (this.formData.strHoldingLocationDesc
            && this.riExchange.getParentHTMLValue('PremiseLocationDesc')
            && this.formData.strHoldingLocationDesc === this.riExchange.getParentHTMLValue('PremiseLocationDesc')) {
            this.pageParams.FunctionUpdate = false;
            this.disableFields();
        }
        if (this.pageParams.vbEnableServiceCoverDispLev) {
            if (parseInt(this.riExchange.getParentAttributeValue('QuantityAtLocation'), 10) > 0) {
                this.pageParams.FunctionDelete = false;
                this.pageParams.IsDeleteEnable = false;
            }
        }
        this.modalAutoOpen();
    };
    PremiseLocationMaintenanceComponent.prototype.AddMode = function () {
        this.mode = 'ADD';
        this.setControlValue('PremiseLocationNumber', '');
        this.setControlValue('PremiseLocationDesc', '');
        this.pageParams.IsDeleteEnable = false;
        this.btnAddOnClick();
    };
    PremiseLocationMaintenanceComponent.prototype.FetchRecord = function () {
        this.mode = 'UPDATE';
        this.premiseLocationOnChange();
    };
    PremiseLocationMaintenanceComponent.prototype.callLookupData = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber')
                },
                'fields': ['ContractName']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber')
                },
                'fields': ['PremiseName']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data[0][0].ContractName) {
                _this.formData.ContractName = data[0][0].ContractName;
                _this.setControlValue('ContractName', _this.formData.ContractName);
            }
            if (data[1][0].PremiseName) {
                _this.formData.PremiseName = data[1][0].PremiseName;
                _this.setControlValue('PremiseName', _this.formData.PremiseName);
            }
        });
    };
    PremiseLocationMaintenanceComponent.prototype.rowSelected = function () {
        var returnData = this.formData.returnData;
        this.pageParams.IsDeleteEnable = true;
        if (returnData) {
            this.mode = 'UPDATE';
            this.formData.ParentRowID = returnData.ttPremiseLocation ? returnData.ttPremiseLocation : '';
            this.setControlValue('PremiseLocationRowID', this.formData.ParentRowID ? this.formData.ParentRowID : this.riExchange.getParentAttributeValue('ContractNumberPremiseLocationRowID'));
            this.formData.PremiseLocationNumber = returnData.PremiseLocationNumber ? returnData.PremiseLocationNumber : this.riExchange.getParentHTMLValue('PremiseLocationNumber');
            this.setControlValue('PremiseLocationNumber', this.formData.PremiseLocationNumber);
            this.enableFields();
            this.premiseLocationOnChange();
        }
    };
    PremiseLocationMaintenanceComponent.prototype.isNumValidatorPremiseLocationNumber = function () {
        if (!this.riExchange.riInputElement.isNumber(this.uiForm, 'PremiseLocationNumber')) {
            this.setControlValue('PremiseLocationNumber', '');
        }
        else {
            this.setControlValue('PremiseLocationNumber', parseInt(this.getControlValue('PremiseLocationNumber'), 10));
        }
        this.premiseLocationOnChange();
    };
    PremiseLocationMaintenanceComponent.prototype.premiseLocationOnKeyDown = function (obj, call) {
        if (call) {
            if (obj.PremiseLocationNumber) {
                this.setControlValue('PremiseLocationNumber', obj.PremiseLocationNumber);
            }
            if (obj.PremiseLocationDesc) {
                this.setControlValue('PremiseLocationDesc', obj.PremiseLocationDesc);
            }
            this.btnUpdateOnClick();
        }
    };
    PremiseLocationMaintenanceComponent.prototype.getModalinfo = function (e) {
        this.ellipsis.premiseLocation.autoOpen = false;
        this.ellipsis.premiseLocation.childConfigParams.parentMode = 'LookUp';
        this.ellipsis.premiseLocation.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.premiseLocation.childConfigParams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.premiseLocation.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber');
        this.ellipsis.premiseLocation.childConfigParams.PremiseName = this.getControlValue('PremiseName');
    };
    PremiseLocationMaintenanceComponent.prototype.premiseLocationOnChange = function () {
        var _this = this;
        var lookupIPPremiseLocation = [
            {
                'table': 'PremiseLocation',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'PremiseLocationNumber': this.getControlValue('PremiseLocationNumber')
                },
                'fields': ['PremiseLocationDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIPPremiseLocation).subscribe(function (data) {
            if (data[0][0]) {
                _this.formData.PremiseLocationDesc = data[0][0].PremiseLocationDesc;
                _this.setControlValue('PremiseLocationDesc', _this.formData.PremiseLocationDesc ? _this.formData.PremiseLocationDesc : '');
                if (_this.pageParams.FunctionUpdate)
                    _this.btnUpdateOnClick();
            }
            else {
                _this.setControlValue('PremiseLocationDesc', '');
            }
        });
    };
    PremiseLocationMaintenanceComponent.prototype.beforeSave = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionUpdate);
        this.postData.Function = 'CheckContractType';
        this.postData.ContractNumber = this.getControlValue('ContractNumber') ? this.getControlValue('ContractNumber') : '';
        this.postData.ContractTypeCode = this.getControlValue('ContractTypeCode') ? this.getControlValue('ContractTypeCode') : '';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postData)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.showErrorModal(data['oResponse']);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }
            else {
                if (data.errorMessage) {
                    _this.showErrorModal(data.errorMessage);
                }
                else {
                    _this.riExchange.riInputElement.SetRequiredStatus(_this.uiForm, 'PremiseLocationNumber', false);
                    _this.riExchange.riInputElement.SetRequiredStatus(_this.uiForm, 'PremiseLocationDesc', false);
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }
        }, function (error) {
            _this.showErrorModal(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PremiseLocationMaintenanceComponent.prototype.afterEvent = function () {
        if (this.pageParams.ParentMode === 'ProductAllocateAdd'
            && this.mode === 'ADD') {
            this.riExchange.SetParentHTMLInputElementAttribute('PremiseLocationNumber', this.getControlValue('PremiseLocationNumber'));
            this.riExchange.SetParentHTMLInputElementAttribute('PremiseLocationDesc', this.getControlValue('PremiseLocationDesc'));
        }
        if (this.pageParams.ParentMode === 'EmptySearch'
            && this.mode === 'DELETE') {
            this.showMessageHeader = false;
        }
    };
    PremiseLocationMaintenanceComponent.prototype.btnAddOnClick = function () {
        this.mode = 'ADD';
        this.setFormMode(this.c_s_MODE_ADD);
        this.setFocusOnPremiseLocationDesc.emit(false);
        this.pageParams.IsDeleteEnable = false;
        this.emptyPremiseLocationFields();
        this.disableFields();
        this.disableControl('PremiseLocationDesc', false);
        this.modalAutoClose();
    };
    PremiseLocationMaintenanceComponent.prototype.btnUpdateOnClick = function () {
        this.mode = 'UPDATE';
        this.setFormMode(this.c_s_MODE_UPDATE);
        this.setFocusOnPremiseLocationDesc.emit(false);
        this.enableFields();
        if (this.riExchange.getParentAttributeValue('premiseLocationRowID')) {
            this.ellipsis.premiseLocation.childConfigParams.showAddNew = false;
            this.ellipsis.premiseLocation.disabled = true;
        }
        this.disableControl('PremiseLocationNumber', true);
        this.pageParams.IsDeleteEnable = true;
        this.modalAutoClose();
    };
    PremiseLocationMaintenanceComponent.prototype.btnDeleteOnClick = function () {
        this.mode = 'DELETE';
        this.disableControl('PremiseLocationNumber', true);
        this.modalAutoClose();
        this.onSubmit();
    };
    PremiseLocationMaintenanceComponent.prototype.emptyPremiseLocationFields = function () {
        this.setControlValue('PremiseLocationNumber', '');
        this.setControlValue('PremiseLocationDesc', '');
        this.disableControl('PremiseLocationNumber', false);
        this.disableControl('PremiseLocationDesc', true);
        this.pageParams.IsDeleteEnable = false;
        this.ellipsis.premiseLocation.disabled = false;
    };
    PremiseLocationMaintenanceComponent.prototype.disableFields = function () {
        this.disableControl('PremiseLocationNumber', true);
        this.disableControl('PremiseLocationDesc', true);
        this.ellipsis.premiseLocation.disabled = true;
    };
    PremiseLocationMaintenanceComponent.prototype.enableFields = function () {
        this.disableControl('PremiseLocationNumber', false);
        this.disableControl('PremiseLocationDesc', false);
        this.ellipsis.premiseLocation.disabled = false;
    };
    PremiseLocationMaintenanceComponent.prototype.modalAutoOpen = function () {
        if (this.mode !== 'ADD' && this.mode !== 'UPDATE' && this.mode !== 'DELETE') {
            this.ellipsis.premiseLocation.autoOpen = true;
            this.pageParams.isModalAutoOpen = true;
        }
    };
    PremiseLocationMaintenanceComponent.prototype.modalAutoClose = function () {
        this.ellipsis.premiseLocation.autoOpen = false;
        this.pageParams.isModalAutoOpen = false;
    };
    PremiseLocationMaintenanceComponent.prototype.onAbandon = function () {
        this.setFocusOnPremiseLocationNumber.emit(false);
        this.enableFields();
        this.disableControl('PremiseLocationDesc', true);
        if (this.mode === 'ADD' || this.mode === 'DELETE') {
            this.emptyPremiseLocationFields();
            this.ellipsis.premiseLocation.disabled = false;
            this.mode = 'NEUTRAL';
            this.modalAutoOpen();
        }
        else {
            this.premiseLocationOnChange();
        }
        this.setFormMode(this.c_s_MODE_SELECT);
    };
    PremiseLocationMaintenanceComponent.prototype.onSubmit = function () {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseLocationNumber', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseLocationDesc', true);
        var isValidForm = this.riExchange.validateForm(this.uiForm);
        if (isValidForm) {
            this.promptTitle = MessageConstant.Message.ConfirmRecord;
            this.promptModal.show();
        }
    };
    PremiseLocationMaintenanceComponent.prototype.promptCancel = function (event) {
        if (this.mode === 'DELETE') {
            this.mode = 'NEUTRAL';
        }
        if (this.mode === 'ADD') {
            this.mode = 'ADD';
        }
        if (this.mode === 'UPDATE') {
            this.mode = 'NEUTRAL';
        }
    };
    PremiseLocationMaintenanceComponent.prototype.promptSave = function (event) {
        var _this = this;
        this.beforeSave();
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        if (this.mode === 'ADD') {
            query.set(this.serviceConstants.Action, this.queryParams.ActionInsert);
        }
        if (this.mode === 'UPDATE') {
            query.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
            this.saveDataAdd.VisitToleranceROWID = this.formData.VisitToleranceRowID ? this.formData.VisitToleranceRowID : this.getControlValue('ServiceCoverRowID');
        }
        if (this.mode === 'DELETE') {
            query.set(this.serviceConstants.Action, this.queryParams.ActionDelete);
        }
        if (this.mode === 'ADD' || this.mode === 'UPDATE') {
            this.saveDataAdd.Function = 'CheckContractType';
            this.saveDataAdd.ContractTypeCode = this.getControlValue('ContractTypeCode') ? this.getControlValue('ContractTypeCode') : '';
            this.saveDataAdd.ContractNumber = this.getControlValue('ContractNumber') ? this.getControlValue('ContractNumber') : '';
            this.saveDataAdd.PremiseNumber = this.getControlValue('PremiseNumber') ? this.getControlValue('PremiseNumber') : '';
            this.saveDataAdd.PremiseLocationNumber = this.getControlValue('PremiseLocationNumber') ? this.getControlValue('PremiseLocationNumber') : '';
            this.saveDataAdd.PremiseLocationDesc = this.getControlValue('PremiseLocationDesc') ? this.getControlValue('PremiseLocationDesc') : '';
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.saveDataAdd)
                .subscribe(function (e) {
                if (e['status'] === 'failure') {
                    _this.showErrorModal(e['info']);
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    _this.emptyPremiseLocationFields();
                }
                else {
                    if (e.errorMessage) {
                        _this.showErrorModal(e.errorMessage);
                    }
                    else {
                        _this.formData.returnData = e;
                        _this.rowSelected();
                    }
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                }
            }, function (error) {
                _this.showErrorModal(error);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
        if (this.mode === 'DELETE') {
            this.saveDataDelete.ContractNumber = this.getControlValue('ContractNumber') ? this.getControlValue('ContractNumber') : '';
            this.saveDataDelete.PremiseNumber = this.getControlValue('PremiseNumber') ? this.getControlValue('PremiseNumber') : '';
            this.saveDataDelete.PremiseLocationNumber = this.getControlValue('PremiseLocationNumber') ? this.getControlValue('PremiseLocationNumber') : '';
            this.saveDataDelete.Table = 'PremiseLocation';
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.saveDataDelete)
                .subscribe(function (e) {
                if (e['status'] === 'failure') {
                    _this.showErrorModal(e['info']);
                }
                else {
                    if (e.errorMessage) {
                        _this.showErrorModal(e.errorMessage);
                    }
                    else {
                        _this.formData.returnData = null;
                        _this.emptyPremiseLocationFields();
                        _this.mode = 'NEUTRAL';
                        _this.modalAutoOpen();
                    }
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.showErrorModal(error);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    PremiseLocationMaintenanceComponent.prototype.menuOptionsChange = function (value) {
        this.setControlValue('menu', value);
        switch (value) {
            case 'Purge':
                this.messageTitle = 'Warning';
                this.messageContent = 'Application/iCABSAPremiseLocationPurgeHistory.htm - Screen is not yet covered';
                this.messageModal.show();
                break;
            default:
                break;
        }
    };
    PremiseLocationMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAPremiseLocationMaintenance.html'
                },] },
    ];
    PremiseLocationMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    PremiseLocationMaintenanceComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'ContractSearchComponent': [{ type: ViewChild, args: ['ContractSearchComponent',] },],
        'PremiseSearchComponent': [{ type: ViewChild, args: ['PremiseSearchEllipsis',] },],
        'ServiceCoverSearchComponent': [{ type: ViewChild, args: ['productSearchEllipsis',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return PremiseLocationMaintenanceComponent;
}(BaseComponent));
