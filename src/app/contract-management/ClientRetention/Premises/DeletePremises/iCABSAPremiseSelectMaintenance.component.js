var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild, EventEmitter } from '@angular/core';
import { PageIdentifier } from '../../../../base/PageIdentifier';
import { BaseComponent } from '../../../../base/BaseComponent';
import { MessageConstant } from './../../../../../shared/constants/message.constant';
import { ContractSearchComponent } from '../../../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from '../../../../internal/search/iCABSAPremiseSearch';
export var PremiseSelectMaintenanceComponent = (function (_super) {
    __extends(PremiseSelectMaintenanceComponent, _super);
    function PremiseSelectMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.queryParams = {
            operation: 'Application/iCABSAPremiseSelectMaintenance',
            module: 'premises',
            method: 'contract-management/maintenance',
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
        this.IsAddEnable = true;
        this.IsUpdateEnable = true;
        this.IsDeleteEnable = true;
        this.IsUrlPending = false;
        this.IsUrlNotPending = false;
        this.setFocusOnContractNumber = new EventEmitter();
        this.setFocusOnPremiseNumber = new EventEmitter();
        this.controls = [
            { name: 'ContractNumber', required: true },
            { name: 'ContractName' },
            { name: 'PremiseNumber', required: true },
            { name: 'PremiseName' },
            { name: 'PremiseCommenceDate' },
            { name: 'Status' },
            { name: 'ServiceBranchNumber' },
            { name: 'PremiseAnnualValue' },
            { name: 'menu' },
            { name: 'ErrorMessageDesc' }
        ];
        this.ellipsis = {
            contract: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'ContractNumber': '',
                    'ContractName': '',
                    'showAddNew': false,
                    'currentContractType': 'C'
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: ContractSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
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
                    'showAddNew': false,
                    'currentContractType': 'C'
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: PremiseSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            }
        };
        this.pageId = PageIdentifier.ICABSAPREMISESELECTMAINTENANCE;
        this.setErrorCallback(this);
        this.setURLQueryParameters(this);
        this.handleBackNavigation(this);
    }
    PremiseSelectMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.window_onload();
    };
    PremiseSelectMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    PremiseSelectMaintenanceComponent.prototype.ngAfterViewInit = function () {
        this.setMessageCallback(this);
        this.setErrorCallback(this);
        if (!this.formData.ContractNumber) {
            this.ellipsis.contract.autoOpen = true;
            this.ellipsis.contract.childConfigParams.currentContractType = this.riExchange.getCurrentContractType();
        }
    };
    PremiseSelectMaintenanceComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show({ msg: data, title: 'Error' }, false);
    };
    PremiseSelectMaintenanceComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data, title: 'Message' }, false);
    };
    PremiseSelectMaintenanceComponent.prototype.window_onload = function () {
        this.getSysCharDtetails();
        this.routeParams = this.riExchange.getRouterParams();
        this.setCurrentContractType();
        this.setPageTitle();
        if (this.formData.ContractNumber) {
            this.populateUIFromFormData();
            this.IsFormEmpty = false;
            this.mode = 'NEUTRAL';
            this.setFormMode(this.c_s_MODE_SELECT);
        }
        else {
            this.setControlValue('menu', 'Options');
            this.IsFormEmpty = true;
            this.mode = 'ADD';
            this.setFormMode(this.c_s_MODE_ADD);
        }
        this.setDefaultFormData();
    };
    PremiseSelectMaintenanceComponent.prototype.getURLQueryParameters = function (param) {
        if (param['Mode']) {
            this.pageParams.ParentMode = param['Mode'];
        }
        else {
            this.pageParams.ParentMode = this.riExchange.getParentMode();
        }
        this.pageParams.pending = param['fromMenu'];
        this.pageParams.CurrentContractTypeURLParameter = param['CurrentContractTypeURLParameter'];
        if (this.pageParams.pending) {
            this.IsUrlPending = true;
        }
        else {
            this.IsUrlNotPending = true;
        }
    };
    PremiseSelectMaintenanceComponent.prototype.setCurrentContractType = function () {
        this.pageParams.currentContractType = this.riExchange.getCurrentContractType();
        this.pageParams.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
    };
    PremiseSelectMaintenanceComponent.prototype.setPageTitle = function () {
        this.pageTitle = 'Premises Select';
        this.utils.setTitle(this.pageTitle);
    };
    PremiseSelectMaintenanceComponent.prototype.getSysCharDtetails = function () {
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
        });
    };
    PremiseSelectMaintenanceComponent.prototype.setDefaultFormData = function () {
        this.disableControl('PremiseCommenceDate', true);
        this.disableControl('Status', true);
        this.disableControl('ServiceBranchNumber', true);
        this.disableControl('PremiseAnnualValue', true);
        this.disableControl('ContractName', true);
        this.disableControl('PremiseNumber', true);
        this.disableControl('PremiseName', true);
        this.setFocusOnContractNumber.emit(true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'contractNumber', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseNumber', true);
        if (this.pageParams.ParentMode === 'ContactManagement') {
            this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('contractNumber'));
            this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
            this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
            this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        }
        this.callLookupData();
    };
    PremiseSelectMaintenanceComponent.prototype.callLookupData = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'UserAuthority',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'UserCode': this.utils.getUserCode()
                },
                'fields': ['AllowViewOfSensitiveInfoInd', 'AllowUpdateOfContractInfoInd']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data[0][0]) {
                _this.formData.glAllowUserAuthView = data[0][0].AllowViewOfSensitiveInfoInd;
                _this.formData.glAllowUserAuthUpdate = data[0][0].AllowUpdateOfContractInfoInd;
            }
        });
    };
    PremiseSelectMaintenanceComponent.prototype.callLookupDataPremiseNumber = function () {
        var _this = this;
        var lookupIP = [
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
            if (data[0][0]) {
                _this.formData.PremiseName = data[0][0].PremiseName;
                _this.setControlValue('PremiseName', _this.formData.PremiseName ? _this.formData.PremiseName : '');
            }
            else {
                _this.setControlValue('PremiseName', '');
            }
            _this.onSearch();
        });
    };
    PremiseSelectMaintenanceComponent.prototype.callLookupDataContractNumber = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber')
                },
                'fields': ['ContractName']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data[0][0]) {
                _this.formData.ContractName = data[0][0].ContractName;
                _this.setControlValue('ContractName', _this.formData.ContractName);
                _this.openPremiseSearch();
            }
            else {
                _this.setControlValue('ContractName', '');
                _this.setControlValue('PremiseNumber', '');
                _this.setControlValue('PremiseName', '');
                _this.disableControl('PremiseNumber', true);
                _this.fetchRecord();
            }
        });
    };
    PremiseSelectMaintenanceComponent.prototype.isNumValidatorContractNumber = function () {
        if (!this.riExchange.riInputElement.isNumber(this.uiForm, 'ContractNumber')) {
            this.setControlValue('ContractNumber', '');
        }
        else {
            this.setControlValue('ContractNumber', this.utils.numberPadding(this.getControlValue('ContractNumber'), 8));
        }
        this.callLookupDataContractNumber();
    };
    PremiseSelectMaintenanceComponent.prototype.contractOnKeyDown = function (obj, call) {
        if (call) {
            if (obj.ContractNumber) {
                this.setControlValue('ContractNumber', obj.ContractNumber);
            }
            if (obj.ContractName) {
                this.setControlValue('ContractName', obj.ContractName);
            }
            this.openPremiseSearch();
        }
    };
    PremiseSelectMaintenanceComponent.prototype.premiseOnKeyDown = function (obj, call) {
        if (call) {
            if (obj.PremiseNumber) {
                this.setControlValue('PremiseNumber', obj.PremiseNumber);
            }
            if (obj.PremiseName) {
                this.setControlValue('PremiseName', obj.PremiseName);
            }
            this.onSearch();
        }
    };
    PremiseSelectMaintenanceComponent.prototype.getModalinfo = function (e) {
        this.ellipsis.contract.autoOpen = false;
        this.ellipsis.premise.autoOpen = false;
    };
    PremiseSelectMaintenanceComponent.prototype.openPremiseSearch = function () {
        this.setFocusOnPremiseNumber.emit(true);
        this.ellipsis.premise.autoOpen = true;
        this.disableControl('PremiseNumber', false);
        this.ellipsis.premise.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.premise.childConfigParams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.premise.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber');
        this.ellipsis.premise.childConfigParams.PremiseName = this.getControlValue('PremiseName');
        this.ellipsis.premise.childConfigParams.currentContractType = this.riExchange.getCurrentContractType();
    };
    PremiseSelectMaintenanceComponent.prototype.fetchRecord = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
        query.set('ContractNumber', this.getControlValue('ContractNumber') ? this.getControlValue('ContractNumber') : '');
        query.set('PremiseNumber', this.getControlValue('PremiseNumber') ? this.getControlValue('PremiseNumber') : '');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.errorService.emitError(data.info['error']);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }
            else {
                if (data.errorMessage) {
                    _this.showErrorModal(data.errorMessage);
                    _this.IsFormEmpty = true;
                }
                else {
                    _this.IsFormEmpty = false;
                }
                _this.afterFetchEvent(data);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PremiseSelectMaintenanceComponent.prototype.afterFetchEvent = function (data) {
        if (data.ErrorMessageDesc) {
            this.showErrorModal(data.ErrorMessageDesc);
        }
        if (this.formData.glAllowUserAuthView) {
            this.IsPremiseAnnualValueDisplay = true;
        }
        else {
            this.IsPremiseAnnualValueDisplay = false;
        }
        this.setControlValue('PremiseCommenceDate', data.PremiseCommenceDate ? data.PremiseCommenceDate : '');
        this.setControlValue('Status', data.Status ? data.Status : '');
        this.setControlValue('ServiceBranchNumber', data.ServiceBranchNumber ? data.ServiceBranchNumber : '');
        this.setControlValue('PremiseAnnualValue', data.PremiseAnnualValue ? this.utils.cCur(data.PremiseAnnualValue) : '');
        this.mode = 'NEUTRAL';
        this.setFormMode(this.c_s_MODE_SELECT);
    };
    PremiseSelectMaintenanceComponent.prototype.onSearch = function () {
        var isValidForm = this.riExchange.validateForm(this.uiForm);
        if (isValidForm) {
            this.fetchRecord();
        }
    };
    PremiseSelectMaintenanceComponent.prototype.menuOptionsChange = function (event) {
        switch (event) {
            case 'Premise':
                if (!this.IsFormEmpty) {
                    this.navigate('Request', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE);
                }
                else {
                    this.showErrorModal(MessageConstant.Message.noRecordSelected);
                }
                break;
            case 'Request':
                if (this.IsUrlPending) {
                    if (!this.IsFormEmpty) {
                        this.messageContent = 'Application/iCABSALostBusinessRequestSearch.htm - Screen is not yet covered';
                        this.showMessageModal(this.messageContent);
                        if (this.pageParams.ParentMode === 'ContactManagement') {
                            this.riExchange.setRouterParams('<Premise>&<ContactManagement>');
                        }
                        else {
                            this.riExchange.setRouterParams('<Premise>');
                        }
                    }
                    else {
                        this.showErrorModal(MessageConstant.Message.noRecordSelected);
                    }
                }
                break;
            default:
                break;
        }
    };
    PremiseSelectMaintenanceComponent.prototype.routeAwayUpdateSaveFlag = function () {
        var _this = this;
        this.uiForm.statusChanges.subscribe(function (value) {
            if (_this.uiForm.dirty === true) {
                _this.routeAwayGlobals.setSaveEnabledFlag(true);
            }
            else {
                _this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    };
    PremiseSelectMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAPremiseSelectMaintenance.html'
                },] },
    ];
    PremiseSelectMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    PremiseSelectMaintenanceComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'ContractSearchComponent': [{ type: ViewChild, args: ['ContractSearchEllipsis',] },],
        'PremiseSearchComponent': [{ type: ViewChild, args: ['PremiseSearchEllipsis',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return PremiseSelectMaintenanceComponent;
}(BaseComponent));
