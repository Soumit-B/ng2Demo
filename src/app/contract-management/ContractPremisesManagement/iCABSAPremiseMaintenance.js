var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { SpeedScript } from './../../../shared/services/speedscript';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { RiMaintenance, MntConst, RiTab } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { UiControls } from './uiControls';
import { PremiseMaintenance0 } from './iCABSAPremiseMaintenance0';
import { PremiseMaintenance1 } from './iCABSAPremiseMaintenance1';
import { PremiseMaintenance1a } from './iCABSAPremiseMaintenance1a';
import { PremiseMaintenance2 } from './iCABSAPremiseMaintenance2';
import { PremiseMaintenance3 } from './iCABSAPremiseMaintenance3';
import { PremiseMaintenance4 } from './iCABSAPremiseMaintenance4';
import { PremiseMaintenanceAddrRes } from './iCABSAPremiseMaintenanceAddrRes';
import { PremiseMaintenanceAddrRes1 } from './iCABSAPremiseMaintenanceAddrRes1';
import { PremiseMaintenanceAddrRes2 } from './iCABSAPremiseMaintenanceAddrRes2';
import { PremiseMaintenanceAddrRes3 } from './iCABSAPremiseMaintenanceAddrRes3';
export var PremiseMaintenanceComponent = (function (_super) {
    __extends(PremiseMaintenanceComponent, _super);
    function PremiseMaintenanceComponent(injector, SpeedScript) {
        _super.call(this, injector);
        this.SpeedScript = SpeedScript;
        this.xhrParams = {
            module: 'premises',
            method: 'contract-management/maintenance',
            operation: 'Application/iCABSAPremiseMaintenance'
        };
        this.flagCopyPremise = false;
        this.actionSave = 2;
        this.isRequesting = true;
        this.showCloseButton = true;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.pageiCABSAPremiseMaintenance = false;
        this.pageiCABSAPremiseMaintenanceAddrRes = false;
        this.contractSearchModal = false;
        this.promptTitle = MessageConstant.Message.ConfirmTitle;
        this.promptContent = MessageConstant.Message.ConfirmRecord;
        this.LostBusinessText = '';
        this.defaultCBBparams = {
            countryCode: '',
            businessCode: '',
            branchNumber: ''
        };
        this.lErrorMessageDesc = [];
        this.callbackHooks = [];
        this.callbackPrompts = [];
        this.currentActivity = '';
        this.CBBupdated = false;
        this.pageId = PageIdentifier.ICABSAPREMISEMAINTENANCE;
        this.xhr = this.httpService;
        this.controls = new UiControls().controls;
        this.uiDisplay = new UiControls().uiDisplay;
        this.ellipsis = new UiControls().ellipsis;
        this.viewChild = new UiControls().viewChild;
        this.dropDown = new UiControls().dropDown;
        this.riMaintenance = new RiMaintenance(this.logger, this.xhr, this.LookUp, this.utils, this.serviceConstants);
        this.uiForm = this.uiForm;
        this.riMaintenance.uiForm = this.uiForm;
        this.riMaintenance.riExchange = this.riExchange;
        this.pageParams.vBusinessCode = this.utils.getBusinessCode();
        this.pageParams.vCountryCode = this.utils.getCountryCode();
        this.pageParams.gUserCode = this.utils.getUserCode();
        this.setURLQueryParameters(this);
    }
    PremiseMaintenanceComponent.prototype.openModal = function (ellipsisName) { this[ellipsisName].openModal(); };
    PremiseMaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.parent = this;
        setTimeout(function () { _this.isRequesting = false; }, 15000);
    };
    PremiseMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        this.riMaintenance.clearQ();
        if (this.pgPM_AR1) {
            this.pgPM_AR1.killSubscription();
        }
        if (this.pgPM_AR2) {
            this.pgPM_AR2.killSubscription();
        }
        if (this.pgPM_AR3) {
            this.pgPM_AR3.killSubscription();
        }
        if (this.pgPM0) {
            this.pgPM0.killSubscription();
        }
        if (this.pgPM1) {
            this.pgPM1.killSubscription();
        }
        if (this.pgPM1a) {
            this.pgPM1a.killSubscription();
        }
        if (this.pgPM2) {
            this.pgPM2.killSubscription();
        }
        if (this.pgPM3) {
            this.pgPM3.killSubscription();
        }
        if (this.pgPM4) {
            this.pgPM4.killSubscription();
        }
        if (this.formStatus) {
            this.formStatus.unsubscribe();
        }
    };
    PremiseMaintenanceComponent.prototype.getURLQueryParameters = function (param) {
        this.queryParams = param;
        this.init();
    };
    PremiseMaintenanceComponent.prototype.init = function () {
        var _this = this;
        this.cbbService.disableComponent(true);
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.initialFormState(false, false);
        this.defaultCBBparams.countryCode = this.utils.getCountryCode();
        this.defaultCBBparams.businessCode = this.utils.getBusinessCode();
        this.defaultCBBparams.branchNumber = this.utils.getBranchCode();
        var qParams = this.location.path().split('?').pop().split('&');
        var fromMenu = false;
        var qParentMode = '';
        var currentContractType = 'C';
        for (var i = 0; i < qParams.length; i++) {
            var qP = qParams[i].split('=');
            var key = qP[0].toLowerCase();
            switch (key) {
                case 'frommenu':
                    if (qP[1] === 'true')
                        fromMenu = true;
                    else
                        fromMenu = false;
                    break;
                case 'contracttypecode':
                    currentContractType = qP[1];
                    break;
                case 'parentmode':
                    qParentMode = qP[1];
                    this.parentMode = qParentMode;
                    break;
                default:
                    this.riExchange.updateCtrl(this.controls, qP[0], 'value', qP[1]);
            }
        }
        switch (currentContractType) {
            default:
            case 'C':
                this.pageParams.currentContractType = 'C';
                this.pageHeader = 'Contract';
                break;
            case 'J':
                this.pageParams.currentContractType = 'J';
                this.pageHeader = 'Job';
                break;
            case 'P':
                this.pageParams.currentContractType = 'P';
                this.pageHeader = 'Product Sale';
                break;
        }
        this.ellipsis.contractNumberEllipsis.childparams.initEmpty = false;
        if (this.pageParams.CurrentContractType !== this.pageParams.currentContractType) {
            this.ellipsis.contractNumberEllipsis.childparams.initEmpty = true;
        }
        this.pageParams.CurrentContractType = this.pageParams.currentContractType;
        this.pageParams.CurrentContractTypeLabel = this.utils.getCurrentContractLabel(this.pageParams.currentContractType);
        this.ellipsis.contractNumberEllipsis.childparams.currentContractType = this.pageParams.CurrentContractType;
        this.pageParams.shouldOpen = fromMenu;
        this.pageParams.ParentMode = this.parentMode;
        if (!this.pageParams.ParentMode) {
            if (qParentMode) {
                this.parentMode = qParentMode;
                this.pageParams.ParentMode = qParentMode;
            }
            else {
                this.parentMode = 'ServiceCover';
                this.pageParams.ParentMode = 'ServiceCover';
            }
        }
        this.logger.log('INIT Premise Maintenance: ', this.pageParams.ParentMode, fromMenu, this.pageHeader, currentContractType, this.pageParams.CurrentContractType, this.pageParams.CurrentContractTypeLabel, qParams, this.isReturning());
        if (this.isReturning()) {
            this.logger.log('DEBUG --- isReturning', this.isReturningFlag, this.formData, this.pageParams);
            setTimeout(function () {
                _this.isReturningFlag = false;
            }, 2000);
            this.riMaintenance.CurrentMode = this.pageParams.CurrentMode;
            this.pageParams.shouldOpen = false;
            this.pgPM1.window_onload();
            this.pgPM2.window_onload();
        }
        else {
            this.showSpinner();
            this.doLookup();
            this.getSysCharTransData();
        }
    };
    PremiseMaintenanceComponent.prototype.initializeViewChild = function () {
    };
    PremiseMaintenanceComponent.prototype.doLookup = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'UserAuthority',
                'query': { 'BusinessCode': this.businessCode(), 'UserCode': this.pageParams.gUserCode },
                'fields': ['AllowViewOfSensitiveInfoInd', 'AllowUpdateOfContractInfoInd']
            },
            {
                'table': 'Branch',
                'query': { 'BusinessCode': this.businessCode() },
                'fields': ['BranchNumber', 'BranchName']
            },
            {
                'table': 'Discount',
                'query': { 'BusinessCode': this.businessCode() },
                'fields': ['DiscountCode', 'DiscountDesc']
            },
            {
                'table': 'Language',
                'query': { 'BusinessCode': this.businessCode() },
                'fields': ['LanguageCode', 'LanguageDescription']
            }
        ];
        var lookupIP2 = [
            {
                'table': 'CustomerAvailTemplate',
                'query': { 'BusinessCode': this.businessCode() },
                'fields': ['CustomerAvailTemplateID', 'CustomerAvailTemplateDesc']
            },
            {
                'table': 'ClosedCalendarTemplate',
                'query': { 'BusinessCode': this.businessCode() },
                'fields': ['ClosedCalendarTemplateNumber', 'TemplateName']
            },
            {
                'table': 'PreferredDayOfWeekReasonLang',
                'query': { 'BusinessCode': this.businessCode(), 'LanguageCode': this.riExchange.LanguageCode() },
                'fields': ['PreferredDayOfWeekReasonCode', 'PreferredDayOfWeekReasonLangDesc']
            }
        ];
        var lookupIP3 = [
            {
                'table': 'SICCodeLang',
                'query': { 'BusinessCode': this.businessCode(), 'LanguageCode': this.riExchange.LanguageCode() },
                'fields': ['SICCode', 'SICDescription']
            },
            {
                'table': 'PestNetOnLineLevel',
                'query': { 'BusinessCode': this.businessCode() },
                'fields': ['PNOLiCABSLevel', 'PNOLDescription']
            },
            {
                'table': 'PremiseTechRetentionReasons',
                'query': { 'BusinessCode': this.businessCode(), 'LanguageCode': this.riExchange.LanguageCode() },
                'fields': ['TechRetentionReasonCode', 'TechRetentionReasonDesc']
            },
            {
                'table': 'NotificationTemplate',
                'query': { 'BusinessCode': this.businessCode() },
                'fields': ['NotifyTemplateCode', 'NotifyTemplateSystemDesc']
            }
        ];
        this.LookUp.lookUpPromise(lookupIP).then(function (data) {
            var recordSet_UserAuthority = data[0];
            if (recordSet_UserAuthority.length > 0) {
                var record = recordSet_UserAuthority[0];
                _this.pageParams.glAllowUserAuthView = record.hasOwnProperty('AllowViewOfSensitiveInfoInd') ? record['AllowViewOfSensitiveInfoInd'] : false;
                _this.pageParams.glAllowUserAuthUpdate = record.hasOwnProperty('AllowUpdateOfContractInfoInd') ? record['AllowUpdateOfContractInfoInd'] : false;
            }
            var branchRecords = data[1];
            if (branchRecords.length > 0) {
                _this.dropDown.ServiceBranchNumber = [];
                for (var i = 0; i < branchRecords.length; i++) {
                    _this.dropDown.ServiceBranchNumber.push({ value: branchRecords[i].BranchNumber, label: branchRecords[i].BranchNumber + ' - ' + branchRecords[i].BranchName });
                }
            }
            var discountRecords = data[2];
            if (discountRecords.length > 0) {
                _this.dropDown.DiscountCode = [];
                for (var i = 0; i < discountRecords.length; i++) {
                    _this.dropDown.DiscountCode.push({ value: discountRecords[i].DiscountCode, label: discountRecords[i].DiscountCode + ' - ' + discountRecords[i].DiscountDesc });
                }
            }
            var langRecords = data[3];
            if (langRecords.length > 0) {
                _this.dropDown.LanguageCode = [];
                for (var i = 0; i < langRecords.length; i++) {
                    _this.dropDown.LanguageCode.push({ value: langRecords[i].LanguageCode, label: langRecords[i].LanguageCode + ' - ' + langRecords[i].LanguageDescription });
                }
            }
        });
        this.LookUp.lookUpPromise(lookupIP2).then(function (data) {
            var recordSet_CustomerAvailTemplate = data[0];
            var recordSet_ClosedCalendarTemplate = data[1];
            var recordSet_PreferredDayOfWeekReasonLang = data[2];
            if (recordSet_CustomerAvailTemplate.length > 0) {
                _this.dropDown.CustomerAvailTemplate = [{ value: '', label: '' }];
                for (var i = 0; i < recordSet_CustomerAvailTemplate.length; i++) {
                    _this.dropDown.CustomerAvailTemplate.push({
                        value: recordSet_CustomerAvailTemplate[i].CustomerAvailTemplateID,
                        label: recordSet_CustomerAvailTemplate[i].CustomerAvailTemplateID + ' - ' + recordSet_CustomerAvailTemplate[i].CustomerAvailTemplateDesc
                    });
                }
            }
            if (recordSet_ClosedCalendarTemplate.length > 0) {
                _this.dropDown.ClosedCalendarTemplate = [];
                for (var i = 0; i < recordSet_ClosedCalendarTemplate.length; i++) {
                    _this.dropDown.ClosedCalendarTemplate.push({
                        value: recordSet_ClosedCalendarTemplate[i].ClosedCalendarTemplateNumber,
                        label: recordSet_ClosedCalendarTemplate[i].ClosedCalendarTemplateNumber + ' - ' + recordSet_ClosedCalendarTemplate[i].TemplateName
                    });
                }
            }
            if (recordSet_PreferredDayOfWeekReasonLang.length > 0) {
                _this.dropDown.PreferredDayOfWeekReasonLang = [];
                for (var i = 0; i < recordSet_PreferredDayOfWeekReasonLang.length; i++) {
                    _this.dropDown.PreferredDayOfWeekReasonLang.push({
                        value: recordSet_PreferredDayOfWeekReasonLang[i].PreferredDayOfWeekReasonCode,
                        label: recordSet_PreferredDayOfWeekReasonLang[i].PreferredDayOfWeekReasonCode + ' - ' + recordSet_PreferredDayOfWeekReasonLang[i].PreferredDayOfWeekReasonLangDesc
                    });
                }
            }
        });
        this.LookUp.lookUpPromise(lookupIP3).then(function (data) {
            var recordSet_SICCodeLang = data[0];
            var recordSet_PestNetOnLineLevel = data[1];
            var recordSet_PremiseTechRetentionReasonsLang = data[2];
            var recordSet_NotificationTemplate = data[3];
            if (recordSet_SICCodeLang.length > 0) {
                _this.dropDown.SICCodeLang = [];
                for (var i = 0; i < recordSet_SICCodeLang.length; i++) {
                    _this.dropDown.SICCodeLang.push({
                        value: recordSet_SICCodeLang[i].SICCode,
                        label: recordSet_SICCodeLang[i].SICCode + ' - ' + recordSet_SICCodeLang[i].SICDescription
                    });
                }
            }
            if (recordSet_PestNetOnLineLevel.length > 0) {
                _this.dropDown.PestNetOnLineLevel = [];
                for (var i = 0; i < recordSet_PestNetOnLineLevel.length; i++) {
                    _this.dropDown.PestNetOnLineLevel.push({
                        value: recordSet_PestNetOnLineLevel[i].PNOLiCABSLevel,
                        label: recordSet_PestNetOnLineLevel[i].PNOLiCABSLevel + ' - ' + recordSet_PestNetOnLineLevel[i].PNOLDescription
                    });
                }
            }
            if (recordSet_PremiseTechRetentionReasonsLang) {
                if (recordSet_PremiseTechRetentionReasonsLang.length > 0) {
                    _this.dropDown.PremiseTechRetentionReasonsLang = [];
                    for (var i = 0; i < recordSet_PremiseTechRetentionReasonsLang.length; i++) {
                        _this.dropDown.PremiseTechRetentionReasonsLang.push({
                            value: recordSet_PremiseTechRetentionReasonsLang[i].TechRetentionReasonCode,
                            label: recordSet_PremiseTechRetentionReasonsLang[i].TechRetentionReasonCode + ' - ' + recordSet_PremiseTechRetentionReasonsLang[i].TechRetentionReasonDesc
                        });
                    }
                }
            }
            if (recordSet_NotificationTemplate.length > 0) {
                _this.dropDown.NotificationTemplate = [];
                _this.dropDown.NotificationTemplate.push({ value: '', label: 'Not Required' });
                for (var i = 0; i < recordSet_NotificationTemplate.length; i++) {
                    _this.dropDown.NotificationTemplate.push({
                        value: recordSet_NotificationTemplate[i].NotifyTemplateCode,
                        label: recordSet_NotificationTemplate[i].NotifyTemplateSystemDesc
                    });
                }
            }
        });
        var lookupIPpostcodedefaulting = [{
                'table': 'Branch',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'EnablePostCodeDefaulting': 'FALSE' },
                'fields': ['BranchNumber', 'EnablePostCodeDefaulting']
            }];
        this.pageParams.vExcludedBranches = '';
        this.LookUp.lookUpPromise(lookupIPpostcodedefaulting).then(function (data) {
            if (data) {
                var excludedBranches = '';
                for (var i = 0; i < data[0].length; i++) {
                    if (excludedBranches === '') {
                        excludedBranches = '';
                    }
                    else {
                        excludedBranches = excludedBranches + ',';
                    }
                    excludedBranches = excludedBranches + data[0][i].BranchNumber;
                }
                _this.pageParams.excludedBranches = excludedBranches;
            }
        });
    };
    PremiseMaintenanceComponent.prototype.getSysCharTransData = function () {
        var _this = this;
        var sysCharList = [this.sysCharConstants.SystemCharEnableTransData];
        var sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.SpeedScript.sysCharPromise(sysCharIP).then(function (data) {
            var record = data.records[0];
            _this.pageParams.vEnableTransData = record.Required;
            _this.riMaintenance.uiForm = _this.uiForm;
            _this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
            if (_this.pageParams.vEnableTransData) {
                _this.pageiCABSAPremiseMaintenanceAddrRes = true;
                _this.riTab = new RiTab(new UiControls().tab_iCABSAPremiseMaintenanceAddrRes, _this.utils);
                _this.pgPM_AR = new PremiseMaintenanceAddrRes(_this);
                _this.pgPM_AR1 = new PremiseMaintenanceAddrRes1(_this);
                _this.pgPM_AR2 = new PremiseMaintenanceAddrRes2(_this);
                _this.pgPM_AR3 = new PremiseMaintenanceAddrRes3(_this);
                _this.pgPM_AR1.window_onload();
                _this.pgPM_AR2.window_onload();
                _this.pgPM_AR3.window_onload();
            }
            else {
                _this.pageiCABSAPremiseMaintenance = true;
                _this.riTab = new RiTab(new UiControls().tab_iCABSAPremiseMaintenance, _this.utils);
                _this.pgPM0 = new PremiseMaintenance0(_this);
                _this.pgPM1 = new PremiseMaintenance1(_this);
                _this.pgPM1a = new PremiseMaintenance1a(_this);
                _this.pgPM2 = new PremiseMaintenance2(_this);
                _this.pgPM3 = new PremiseMaintenance3(_this);
                _this.pgPM4 = new PremiseMaintenance4(_this);
                _this.pgPM0.window_onload();
            }
            _this.tab = _this.riTab.tabObject;
            _this.hideSpinner();
        });
    };
    PremiseMaintenanceComponent.prototype.ngAfterViewInit = function () {
    };
    PremiseMaintenanceComponent.prototype.showAlert = function (msgTxt, type) {
        this.logger.log('showAlert', msgTxt, type);
        this.lErrorMessageDesc.push(msgTxt);
        var titleModal = '';
        if (typeof type === 'undefined')
            type = 0;
        switch (type) {
            default:
            case 0:
                titleModal = MessageConstant.Message.ErrorTitle;
                break;
            case 1:
                titleModal = MessageConstant.Message.SuccessTitle;
                this.lErrorMessageDesc = [];
                this.lErrorMessageDesc.push(msgTxt);
                break;
            case 2:
                titleModal = MessageConstant.Message.WarningTitle;
                break;
        }
        this.isModalOpen(true);
        this.messageModal.show({ msg: this.lErrorMessageDesc, title: titleModal }, false);
    };
    PremiseMaintenanceComponent.prototype.closeModal = function () {
        this.lErrorMessageDesc = [];
        this.isModalOpen(false);
        this.riMaintenance.handleConfirm(this);
        if (this.callbackHooks.length > 0) {
            this.callbackHooks.pop().call(this);
            this.callbackHooks = [];
        }
    };
    PremiseMaintenanceComponent.prototype.showSpinner = function () {
        if (this.parent)
            this.parent.isRequesting = true;
        else
            this.isRequesting = true;
    };
    PremiseMaintenanceComponent.prototype.hideSpinner = function () {
        var _this = this;
        setTimeout(function () {
            var formrawData = _this.uiForm.getRawValue();
            for (var i = 0; i < _this.controls.length; i++) {
                if (formrawData.hasOwnProperty([_this.controls[i].name]))
                    _this.controls[i].value = formrawData[_this.controls[i].name];
            }
            if (_this.parent)
                _this.parent.isRequesting = false;
            else
                _this.isRequesting = false;
        }, 3000);
    };
    PremiseMaintenanceComponent.prototype.save = function () {
        this.lErrorMessageDesc = [];
        this.riMaintenance.clearQ();
        this.utils.highlightTabs();
        this.logger.log('SAVE clicked', this.pageParams.vEnableTransData, this.riMaintenance.CurrentMode, this.uiForm.status, this.uiForm);
        this.riExchange.validateForm(this.uiForm);
        if (this.uiForm.status === 'VALID') {
            this.parent.promptTitle = MessageConstant.Message.ConfirmTitle;
            this.parent.promptContent = MessageConstant.Message.ConfirmRecord;
            this.riTab.TabFocus(1);
            if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                this.riMaintenance.CurrentMode = MntConst.eModeSaveUpdate;
                this.actionSave = 2;
            }
            if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                this.riMaintenance.CurrentMode = MntConst.eModeSaveAdd;
                this.actionSave = 1;
            }
            this.currentActivity = 'SAVE';
            this.riMaintenance.CancelEvent = false;
            if (this.pageParams.vEnableTransData) {
                this.riMaintenance.execMode(this.riMaintenance.CurrentMode, [this.pgPM_AR, this.pgPM_AR1, this.pgPM_AR2, this.pgPM_AR3, this]);
            }
            else {
                this.riMaintenance.execMode(this.riMaintenance.CurrentMode, [this.pgPM0, this.pgPM1, this.pgPM1a, this.pgPM2, this.pgPM3, this.pgPM4, this]);
            }
        }
    };
    PremiseMaintenanceComponent.prototype.cancel = function () {
        this.lErrorMessageDesc = [];
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.logger.log('CANCEL clicked', this.pageParams.vEnableTransData, this.riMaintenance.CurrentMode);
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate || this.riMaintenance.CurrentMode === MntConst.eModeSaveUpdate) {
            this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
            for (var i = 0; i < this.controls.length; i++) {
                this.riExchange.updateCtrl(this.controls, this.controls[i].name, 'value', this.controls[i].value);
                this.setControlValue(this.controls[i].name, this.controls[i].value);
                if (this.controls[i].name.indexOf('Date') > 0) {
                    if (this.pageParams['dt' + this.controls[i].name]) {
                        if (this.pageParams['dt' + this.controls[i].name].value) {
                            this.selDate(this.utils.formatDate(this.pageParams['dt' + this.controls[i].name].value), this.controls[i].name);
                            this.pageParams['dt' + this.controls[i].name].value = this.utils.convertDate(this.utils.formatDate(this.pageParams['dt' + this.controls[i].name].value));
                        }
                    }
                }
            }
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd || this.riMaintenance.CurrentMode === MntConst.eModeSaveAdd) {
            this.initialFormState(false, true);
        }
    };
    PremiseMaintenanceComponent.prototype.confirm = function () {
        if (typeof this.promptModal === 'undefined') {
            this['parent'].promptModal.show();
        }
        else {
            this.promptModal.show();
        }
    };
    PremiseMaintenanceComponent.prototype.confirmed = function (obj) {
        this.lErrorMessageDesc = [];
        if (this.callbackPrompts.length > 0) {
            var fn = this.callbackPrompts.pop();
            this.pageParams.promptAns = true;
            if (typeof fn === 'function')
                fn.call(this);
            this.callbackPrompts = [];
        }
        else {
            this.riMaintenance.CancelEvent = false;
            if (this.pageParams.vEnableTransData) {
                this.riMaintenance.execContinue(this.riMaintenance.CurrentMode, [this.pgPM_AR, this.pgPM_AR1, this.pgPM_AR2, this.pgPM_AR3, this]);
            }
            else {
                this.riMaintenance.execContinue(this.riMaintenance.CurrentMode, [this.pgPM0, this.pgPM1, this.pgPM1a, this.pgPM2, this.pgPM3, this.pgPM4, this]);
            }
        }
    };
    PremiseMaintenanceComponent.prototype.promptCancel = function () {
        if (this.callbackPrompts.length > 0) {
            var fn = this.callbackPrompts.pop();
            this.pageParams.promptAns = false;
            if (typeof fn === 'function')
                fn.call(this);
            this.callbackPrompts = [];
        }
    };
    PremiseMaintenanceComponent.prototype.isModalOpen = function (flag) {
        this.riMaintenance.isModalOpen = flag;
    };
    PremiseMaintenanceComponent.prototype.clearFlags = function () {
        this.uiDisplay.tdContractHasExpired = false;
        this.uiDisplay.tdNationalAccount = false;
        this.uiDisplay.badDebtAccountCheckbox = false;
        this.uiDisplay.badDebtAccount = false;
        this.uiDisplay.tdPNOL = false;
        this.uiDisplay.tdHyperSens = false;
        this.uiDisplay.tdEnvironmentalRestrictedAreaInd = false;
        this.uiDisplay.trialPeriodInd = false;
    };
    PremiseMaintenanceComponent.prototype.initialFormState = function (flag, flagModal) {
        if (!flag)
            this.clearFlags();
        this.riExchange.disableFormFields(this.uiForm);
        if (!flag)
            this.riExchange.resetCtrl(this.controls);
        this.updateButton();
        this.enableContractNumber();
        if (flag) {
            if (this.getControlValue('ContractName') !== '')
                this.enablePremiseNumber();
        }
        else {
            this.disablePremiseNumber();
        }
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.initDatePickers();
        if (!flag) {
            for (var i = 0; i < this.controls.length; i++) {
                if (this.controls[i].name.indexOf('Date') > 0) {
                    if (document.querySelector('#' + this.controls[i].name)) {
                        var elem = document.querySelector('#' + this.controls[i].name).parentElement;
                        if (elem.firstElementChild.firstElementChild) {
                            this.utils.setDateValueByForce(this.controls[i].name, '');
                        }
                    }
                }
            }
        }
        if (!flag) {
            if (flagModal) {
                if (this.contractNumberEllipsis)
                    this.contractNumberEllipsis.openModal();
            }
            this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
        }
    };
    PremiseMaintenanceComponent.prototype.enableControls = function () {
        for (var i = 0; i < this.controls.length; i++) {
            if (!this.controls[i].disabled) {
                this.riExchange.riInputElement.Enable(this.uiForm, this.controls[i].name);
            }
        }
        this.updateButton();
    };
    PremiseMaintenanceComponent.prototype.updateSysCharsLookup = function () {
        var _this = this;
        this.CBBupdated = true;
        var retainParams = {
            ContractNumber: this.getControlValue('ContractNumber'),
            ContractName: this.getControlValue('ContractName'),
            AccountNumber: this.getControlValue('AccountNumber')
        };
        this.initialFormState(false, false);
        var skipIDs = 'CurrentContractType,CurrentContractTypeLabel,ParentMode,currentContractType,currentContractTypeLabel,gUserCode,shouldOpen,vBusinessCode,vCountryCode'.split(',');
        for (var id in this.pageParams) {
            if (id && skipIDs.indexOf(id) === -1) {
                if (id.toLowerCase().indexOf('date') === -1)
                    this.pageParams[id] = null;
            }
        }
        setTimeout(function () {
            _this.pageParams.vBusinessCode = _this.utils.getBusinessCode();
            _this.pageParams.vCountryCode = _this.utils.getCountryCode();
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractNumber', retainParams.ContractNumber);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', retainParams.ContractName);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AccountNumber', retainParams.AccountNumber);
            _this.riExchange.updateCtrl(_this.controls, 'ContractNumber', 'value', retainParams.ContractNumber);
            _this.riExchange.updateCtrl(_this.controls, 'ContractName', 'value', retainParams.ContractName);
            _this.riExchange.updateCtrl(_this.controls, 'AccountNumber', 'value', retainParams.AccountNumber);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseNumber', '');
            _this.riExchange.updateCtrl(_this.controls, 'PremiseNumber', 'value', '');
            _this.pageiCABSAPremiseMaintenanceAddrRes = false;
            _this.pageiCABSAPremiseMaintenance = false;
            _this.doLookup();
            _this.getSysCharTransData();
        }, 500);
    };
    PremiseMaintenanceComponent.prototype.ContractNumber_onchange = function (type) {
        var _this = this;
        this.isRequesting = true;
        var ContractNo = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        ContractNo = this.utils.numberPadding(ContractNo, 8);
        if (!this.pageParams.CurrentContractType) {
            this.pageParams.CurrentContractType = 'C';
        }
        this.LookUp.lookUpPromise([{
                'table': 'Contract',
                'query': { 'BusinessCode': this.businessCode(), 'ContractNumber': ContractNo, 'ContractTypeCode': this.pageParams.CurrentContractType },
                'fields': ['ContractNumber', 'ContractName', 'AccountNumber']
            }]).then(function (data) {
            _this.isRequesting = false;
            if (data) {
                var objData = void 0;
                if (data[0].length > 0) {
                    objData = data[0][0];
                    objData['ContractTypePrefix'] = _this.pageParams.CurrentContractType;
                }
                else {
                    objData = {
                        ContractNumber: '',
                        ContractName: '',
                        AccountNumber: ''
                    };
                    _this.logger.log('ContractNo - No Record Found');
                    _this.showAlert(MessageConstant.Message.noRecordFound);
                    _this.focusField('ContractNumber', true);
                    _this.riTab.TabFocus(1);
                }
                _this.ContractNumberSelection(objData);
            }
            _this.riMaintenance.clearQ();
        });
    };
    PremiseMaintenanceComponent.prototype.ContractNumberSelection = function (data) {
        this.focusField('PremiseNumber', true);
        this.riTab.TabFocus(1);
        this.logger.log('Contract Selection', data);
        this.initialFormState(false, false);
        this.isReturningFlag = false;
        this.primaryFieldsEnableDisable();
        this.ellipsis.contractNumberEllipsis.childparams.initEmpty = false;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', data.AccountNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CurrentContractType', this.pageParams.CurrentContractType);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.pageParams.CurrentContractType);
        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', data.ContractNumber);
        this.riExchange.updateCtrl(this.controls, 'ContractName', 'value', data.ContractName);
        this.riExchange.updateCtrl(this.controls, 'AccountNumber', 'value', data.AccountNumber);
        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', '');
        this.riExchange.updateCtrl(this.controls, 'ContractTypeCode', 'value', this.pageParams.CurrentContractType);
        this.ellipsis.premiseNumberEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.premiseNumberEllipsis.childparams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.premiseNumberEllipsis.childparams.AccountNumber = this.getControlValue('AccountNumber');
        this.ellipsis.linkedContractNumberEllipsis.childparams.currentContractType = this.pageParams.CurrentContractType;
        this.ellipsis.linkedPremiseNumberEllipsis.childparams.currentContractType = this.pageParams.CurrentContractType;
        this.pageParams.CurrentContractType = data.ContractTypePrefix;
        if (data.CountryCode) {
            if (this.defaultCBBparams.countryCode !== data.CountryCode) {
                this.updateSysCharsLookup();
                this.defaultCBBparams.countryCode = data.CountryCode;
                this.defaultCBBparams.businessCode = data.BusinessCode;
            }
        }
        if (data.BusinessCode) {
            if (this.defaultCBBparams.businessCode !== data.BusinessCode) {
                this.updateSysCharsLookup();
                this.defaultCBBparams.countryCode = data.CountryCode;
                this.defaultCBBparams.businessCode = data.BusinessCode;
            }
        }
        if (!this.CBBupdated) {
            if (this.pageParams.vEnableTransData) {
                this.pgPM_AR1.init();
            }
            else {
                this.pgPM1.init();
            }
        }
    };
    PremiseMaintenanceComponent.prototype.ContractNumberSelection_onkeydown = function (obj) {
        if (obj.keyCode === 34) {
            this.ellipsis.contractNumberEllipsis.childparams.parentMode = 'Lookup';
            this.ellipsis.contractNumberEllipsis.childparams.currentContractType = this.pageParams.CurrentContractType;
            this.contractNumberEllipsis.openModal();
        }
    };
    PremiseMaintenanceComponent.prototype.ContractEllipsisClosed = function () {
        this.ellipsis.contractNumberEllipsis.childparams.initEmpty = false;
    };
    PremiseMaintenanceComponent.prototype.PremiseNumber_onchange = function (type) {
        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        this.ellipsis.premiseNumberEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.premiseNumberEllipsis.childparams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.premiseNumberEllipsis.childparams.AccountNumber = this.getControlValue('AccountNumber');
        this.PremiseNumberSelection({
            PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
            PremiseName: '',
            ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')
        });
    };
    PremiseMaintenanceComponent.prototype.PremiseNumberSelection = function (data) {
        var _this = this;
        this.logger.log('Premise Selection', data, this.flagCopyPremise);
        if (!this.flagCopyPremise) {
            var ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber').trim();
            var ContractName = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName').trim();
            var AccountNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber').trim();
            this.initialFormState(false, false);
            if (data.AddMode) {
                this.riMaintenance.CurrentMode = MntConst.eModeAdd;
                this.logger.log('Premise ADD mode', data, this.riMaintenance.CurrentMode);
                this.disablePremiseNumber();
            }
            else {
                this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
                this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', data.PremiseNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', data.PremiseNumber);
            }
            this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', ContractNumber);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', ContractNumber);
            this.riExchange.updateCtrl(this.controls, 'ContractName', 'value', ContractName);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', ContractName);
            this.riExchange.updateCtrl(this.controls, 'AccountNumber', 'value', AccountNumber);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', AccountNumber);
            if (this.pageParams.vEnableTransData) {
                setTimeout(function () { _this.pgPM_AR1.init(); }, 250);
            }
            else {
                this.pgPM1.init();
            }
        }
        else {
            this.flagCopyPremise = false;
            for (var i in data) {
                if (i) {
                    this.riExchange.updateCtrl(this.controls, i, 'value', data[i]);
                    this.riExchange.riInputElement.SetValue(this.uiForm, i, data[i]);
                }
            }
        }
    };
    PremiseMaintenanceComponent.prototype.PremiseNumberSelection_onkeydown = function (obj) {
        if (obj.keyCode === 34 || obj.explicitOpen) {
            this.ellipsis.premiseNumberEllipsis.childparams.parentMode = 'Search';
            this.ellipsis.premiseNumberEllipsis.childparams.currentContractType = this.pageParams.CurrentContractType;
            this.ellipsis.premiseNumberEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
            this.ellipsis.premiseNumberEllipsis.childparams.ContractName = this.getControlValue('ContractName');
            this.ellipsis.premiseNumberEllipsis.childparams.AccountNumber = this.getControlValue('AccountNumber');
            if (obj.explicitOpen) {
                if (this.getControlValue('ContractNumber') !== '') {
                    this.premiseNumberEllipsis.openModal();
                }
            }
            else
                this.premiseNumberEllipsis.openModal();
        }
    };
    PremiseMaintenanceComponent.prototype.PremiseNumberSelectionClosed = function () {
    };
    PremiseMaintenanceComponent.prototype.LinkedContractNumberSelection = function (data) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LinkedToContractNumber', data.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LinkedToContractName', data.ContractName);
        this.ellipsis.linkedPremiseNumberEllipsis.childparams.ContractNumber = data.ContractNumber;
        this.ellipsis.linkedPremiseNumberEllipsis.childparams.ContractName = data.ContractName;
        this.ellipsis.linkedPremiseNumberEllipsis.childparams.AccountNumber = data.AccountNumber;
    };
    PremiseMaintenanceComponent.prototype.LinkedPremiseNumberSelection = function (data) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LinkedToPremiseNumber', data.PremiseNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LinkedToPremiseName', data.PremiseName);
    };
    PremiseMaintenanceComponent.prototype.InvoiceGroupNumberSelection_onkeydown = function (obj) {
        if (obj.keyCode === 34) {
            this.ellipsis.invoiceGrpNumberEllipsis.childparams.AccountNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber');
            this.invoiceGrpNumberEllipsis.openModal();
        }
    };
    PremiseMaintenanceComponent.prototype.InvoiceGroupNumberSelection = function (data) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceGroupNumber', data.trRowData[0].text);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceGroupDesc', data.trRowData[1].text);
        }
    };
    PremiseMaintenanceComponent.prototype.CustomerTypeSelection = function (data) {
        if (data) {
            this.logger.log('CustomerTypeSelection', data);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CustomerTypeCode', data.CustomerTypeCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CustomerTypeDesc', data.CustomerTypeDesc);
        }
    };
    PremiseMaintenanceComponent.prototype.onSalesAreaSearch = function (data) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesAreaCode', data.SalesAreaCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesAreaDesc', data.SalesAreaDesc);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseSalesEmployee', data.PremiseSalesEmployee);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesEmployeeSurname', data.SalesEmployeeSurname);
        }
    };
    PremiseMaintenanceComponent.prototype.SICCodeSelection = function (data) {
        if (data) {
            this.logger.log('SICCodeSelection', data);
        }
    };
    PremiseMaintenanceComponent.prototype.TelesalesEmployeeCodeSelection = function (data) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'TelesalesEmployeeCode', data.EmployeeCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'TelesalesEmployeeName', data.EmployeeSurName);
        }
    };
    PremiseMaintenanceComponent.prototype.VehicleTypeNumberSelection = function (data) {
        if (data) {
            this.logger.log('VehicleTypeNumberSelection', data);
        }
    };
    PremiseMaintenanceComponent.prototype.PNOLSiteRefSelection = function (data) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLSiteRef', data.PNOLSiteRef);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLSiteRefDesc', data.PNOLSiteRefDesc);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLiCABSLevel', data.PNOLiCABSLevel);
            if (data.PremiseAddressLine1) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine1', data.PremiseAddressLine1);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine2', data.PremiseAddressLine2);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine3', data.PremiseAddressLine3);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine4', data.PremiseAddressLine4);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine5', data.PremiseAddressLine5);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremisePostcode', data.PremisePostcode);
            }
        }
    };
    PremiseMaintenanceComponent.prototype.RegulatoryAuthoritySelection = function (data) {
        if (data) {
            this.logger.log('RegulatoryAuthoritySelection', data);
        }
    };
    PremiseMaintenanceComponent.prototype.onEmployeeDataReceived = function (data, employeeCode, employeeSurname, occupationDesc) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, employeeCode, data.EmployeeCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, employeeSurname, data.EmployeeSurName);
            this.riExchange.riInputElement.SetValue(this.uiForm, occupationDesc, data.fullObject.OccupationDesc);
        }
    };
    PremiseMaintenanceComponent.prototype.ellipsisPostCodeSelection = function (data) {
        this.logger.log('DEBUG --- ellipsisPostCodeSelection', data);
        if (this.pageParams.vSCEnableHopewiserPAF) {
        }
        else if (this.pageParams.vSCEnableMarktSelect) {
            this.setControlValue('PremiseAddressLine1', data.PremiseAddressLine1);
            this.setControlValue('PremiseAddressLine2', data.PremiseAddressLine2);
            this.setControlValue('PremiseAddressLine4', data.PremiseAddressLine4);
            this.setControlValue('PremisePostcode', data.PremisePostcode);
        }
        else if (this.pageParams.vSCEnableDatabasePAF) {
            this.setControlValue('PremiseAddressLine4', data.PremiseAddressLine4);
            this.setControlValue('PremiseAddressLine5', data.PremiseAddressLine5);
            this.setControlValue('PremisePostcode', data.PremisePostcode);
        }
    };
    PremiseMaintenanceComponent.prototype.initDatePickers = function () {
        this.pageParams.dtPremiseCommenceDate = { value: null, required: false, disabled: true, focus: false };
        this.pageParams.dtPNOLEffectiveDate = { value: null, required: false, disabled: true };
        this.pageParams.dtPurchaseOrderExpiryDate = { value: null, required: false, disabled: true };
        this.pageParams.dtInactiveEffectDate = { value: null, required: false, disabled: true };
        this.pageParams.dtWasteConsignmentNoteExpiryDate = { value: null, required: false, disabled: true };
        this.pageParams.dtDateFrom1 = { value: null, required: false, disabled: false };
        this.pageParams.dtDateTo1 = { value: null, required: false, disabled: false };
        this.pageParams.dtDateFrom2 = { value: null, required: false, disabled: false };
        this.pageParams.dtDateTo2 = { value: null, required: false, disabled: false };
        this.pageParams.dtDateFrom3 = { value: null, required: false, disabled: false };
        this.pageParams.dtDateTo3 = { value: null, required: false, disabled: false };
        this.pageParams.dtDateFrom4 = { value: null, required: false, disabled: false };
        this.pageParams.dtDateTo4 = { value: null, required: false, disabled: false };
        this.pageParams.dtDateFrom5 = { value: null, required: false, disabled: false };
        this.pageParams.dtDateTo5 = { value: null, required: false, disabled: false };
        this.pageParams.dtDateFrom6 = { value: null, required: false, disabled: false };
        this.pageParams.dtDateTo6 = { value: null, required: false, disabled: false };
        this.pageParams.dtDateFrom7 = { value: null, required: false, disabled: false };
        this.pageParams.dtDateTo7 = { value: null, required: false, disabled: false };
        this.pageParams.dtDateFrom8 = { value: null, required: false, disabled: false };
        this.pageParams.dtDateTo8 = { value: null, required: false, disabled: false };
        this.pageParams.dtDateFrom9 = { value: null, required: false, disabled: false };
        this.pageParams.dtDateTo9 = { value: null, required: false, disabled: false };
        this.pageParams.dtDateFrom10 = { value: null, required: false, disabled: false };
        this.pageParams.dtDateTo10 = { value: null, required: false, disabled: false };
    };
    PremiseMaintenanceComponent.prototype.selDate = function (value, id) {
        var _this = this;
        if (value.length === 10 || value === '') {
            this.logger.log('DEBUG selDate --- A', id, value);
            this.riExchange.riInputElement.SetValue(this.uiForm, id, value);
            this.riExchange.updateCtrl(this.controls, id, 'value', value);
            setTimeout(function () {
                if (!_this.pageParams['dt' + id].value) {
                    _this.pageParams['dt' + id].value = _this.utils.convertDate(value);
                    _this.utils.setDateValueByForce(id, value);
                }
            }, 200);
            this.riExchange.riInputElement.MarkAsDirty(this.uiForm, id);
            if (id.indexOf('DateFrom') !== -1) {
                var newId_1 = id.replace('DateFrom', 'DateTo');
                this.riExchange.riInputElement.SetValue(this.uiForm, newId_1, value);
                this.riExchange.updateCtrl(this.controls, newId_1, 'value', value);
                setTimeout(function () {
                    if (!_this.pageParams['dt' + newId_1].value) {
                        _this.pageParams['dt' + newId_1].value = _this.utils.convertDate(value);
                        _this.utils.setDateValueByForce(newId_1, value);
                    }
                }, 200);
            }
            this.removeFocus(id);
            var obj = void 0;
            if (this.pageParams.vEnableTransData) {
                obj = [this.pgPM_AR1, this.pgPM_AR2, this.pgPM_AR3];
            }
            else {
                obj = [this.pgPM0, this.pgPM1, this.pgPM1a, this.pgPM2, this.pgPM3, this.pgPM4];
            }
            for (var j = 0; j < obj.length; j++) {
                var fntail = '_OnChange';
                if (typeof obj[j][id + fntail] === 'function') {
                    obj[j][id + fntail].call(this);
                }
                fntail = '_onChange';
                if (typeof obj[j][id + fntail] === 'function') {
                    obj[j][id + fntail].call(this);
                }
                fntail = '_onchange';
                if (typeof obj[j][id + fntail] === 'function') {
                    obj[j][id + fntail].call(this);
                }
                fntail = '_OnBlur';
                if (typeof obj[j][id + fntail] === 'function') {
                    obj[j][id + fntail].call(this);
                }
                fntail = '_onBlur';
                if (typeof obj[j][id + fntail] === 'function') {
                    obj[j][id + fntail].call(this);
                }
                fntail = '_onblur';
                if (typeof obj[j][id + fntail] === 'function') {
                    obj[j][id + fntail].call(this);
                }
                fntail = '_ondeactivate';
                if (typeof obj[j][id + fntail] === 'function') {
                    obj[j][id + fntail].call(this);
                }
            }
        }
    };
    PremiseMaintenanceComponent.prototype.dateDisable = function (id, flag, setEmpty) {
        this.pageParams['dt' + id].disabled = flag;
        if (setEmpty) {
            if (!this.getControlValue(id)) {
                var elem = document.querySelector('#' + id).parentElement;
                if (elem.firstElementChild.firstElementChild) {
                    var dateField = elem.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
                    var dateFieldID_1 = dateField.getAttribute('id');
                    setTimeout(function () {
                        document.getElementById(dateFieldID_1)['value'] = '';
                    }, 200);
                }
            }
        }
    };
    PremiseMaintenanceComponent.prototype.focusField = function (id, flagClear) {
        this.logger.log('DEBUG --- focusField', id);
        if (id.indexOf('Date') > 0) {
            var elem = document.querySelector('#' + id).parentElement;
            var dateField = elem.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
            var dateFieldID = dateField.getAttribute('id');
            document.getElementById(dateFieldID).focus();
            if (dateField) {
                this.utils.removeClass(dateField, 'ng-untouched');
                this.utils.addClass(dateField, 'ng-touched');
                this.utils.addClass(dateField, 'ng-invalid');
                if (typeof flagClear === 'undefined')
                    flagClear = true;
                if (flagClear)
                    document.getElementById(dateFieldID)['value'] = null;
            }
        }
        else {
            setTimeout(function () { document.getElementById(id).focus(); }, 200);
        }
    };
    PremiseMaintenanceComponent.prototype.removeFocus = function (id) {
        if (id.indexOf('Date') > 0) {
            var elem = document.querySelector('#' + id).parentElement;
            var dateField = elem.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
            var dateFieldID = dateField.getAttribute('id');
            if (dateField) {
                this.utils.removeClass(dateField, 'ng-invalid');
            }
        }
    };
    PremiseMaintenanceComponent.prototype.onTrialPeriodIndChange = function (event) {
    };
    PremiseMaintenanceComponent.prototype.onChangeFn = function (event, id) {
        var target = event.target || event.srcElement || event.currentTarget;
        var idAttr = target.attributes.id.nodeValue;
        var value = target.value;
        this.logger.log('onChangeFn --->>', idAttr);
        switch (idAttr) {
            case 'CustomerTypeCode':
                if (this.pageParams.vEnableTransData) { }
                else {
                    this.pgPM2.CustomerTypeCode_onchange();
                }
                break;
            case 'SalesAreaCode':
                if (this.pageParams.vEnableTransData) { }
                else {
                    this.pgPM2.riExchange_CBORequest();
                }
                break;
            case 'TelesalesEmployeeCode':
                if (this.pageParams.vEnableTransData) { }
                else {
                    this.pgPM2.riExchange_CBORequest();
                }
                break;
            case 'ServiceBranchNumber':
                if (this.pageParams.vEnableTransData) { }
                else {
                    this.pgPM2.riExchange_CBORequest();
                }
                break;
            case 'VehicleTypeNumber':
                if (this.pageParams.vEnableTransData) { }
                else { }
                break;
            case 'PNOLSiteRef':
                if (this.pageParams.vEnableTransData) { }
                else { }
                break;
            case 'RegulatoryAuthorityNumber':
                if (this.pageParams.vEnableTransData) { }
                else {
                    this.pgPM2.RegulatoryAuthorityNumber_onChange();
                }
                break;
        }
    };
    PremiseMaintenanceComponent.prototype.onKeydownFn = function (event, id) {
        var target = event.target || event.srcElement || event.currentTarget;
        var idAttr = target.attributes.id.nodeValue;
        var value = target.value;
        if (event.keyCode === 34) {
            event.preventDefault();
            this.logger.log('DEBUG onKeydownFn --->>', idAttr);
            switch (idAttr) {
                case 'CustomerTypeCode':
                    this.customerTypeEllipsis.openModal();
                    break;
                case 'SalesAreaCode':
                    this.salesAreaSearchEllipsis.openModal();
                    break;
                case 'TelesalesEmployeeCode':
                    this.telesalesEmployeeEllipsis.openModal();
                    break;
                case 'VehicleTypeNumber':
                    this.pgPM1a.VehicleTypeNumber_onkeydown(event);
                    break;
                case 'PNOLSiteRef':
                    this.siteReferenceEllipsis.openModal();
                    break;
                case 'RegulatoryAuthorityNumber':
                    this.RegulatoryAuthorityEllipsis.openModal();
                    break;
            }
        }
    };
    PremiseMaintenanceComponent.prototype.disableContractNumber = function () {
        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'disabled', true);
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.ellipsis.contractNumberEllipsis.disabled = true;
    };
    PremiseMaintenanceComponent.prototype.disablePremiseNumber = function () {
        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'disabled', true);
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
        this.ellipsis.premiseNumberEllipsis.disabled = true;
    };
    PremiseMaintenanceComponent.prototype.enableContractNumber = function () {
        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'disabled', false);
        this.riExchange.riInputElement.Enable(this.uiForm, 'ContractNumber');
        this.ellipsis.contractNumberEllipsis.disabled = false;
    };
    PremiseMaintenanceComponent.prototype.enablePremiseNumber = function () {
        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'disabled', false);
        this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseNumber');
        this.ellipsis.premiseNumberEllipsis.disabled = false;
    };
    PremiseMaintenanceComponent.prototype.checkFormStatus = function () {
        for (var i = 0; i < this.controls.length; i++) {
            if (!this.uiForm.controls[this.controls[i].name].pristine) {
                this.logger.log('NAVIGATE CONTROL >>', this.controls[i].name, this.uiForm.controls[this.controls[i].name].pristine);
                if (this.controls[i].name.toLowerCase().indexOf('date') > -1) {
                    var elem = document.querySelector('#' + this.controls[i].name).parentElement;
                    var dateField = elem.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
                    var checkClassName = 'ng-untouched';
                    if (this.utils.hasClass(dateField, checkClassName)) {
                        this.uiForm.controls[this.controls[i].name].markAsPristine();
                    }
                }
            }
        }
        this.uiForm.controls['ContractNumber'].markAsPristine();
        this.uiForm.controls['PremiseNumber'].markAsPristine();
        this.uiForm.controls['menu'].markAsPristine();
        this.logger.log('DEBUG Form Status:', this.uiForm.pristine, this.riMaintenance.CurrentMode);
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            if (!this.uiForm.pristine)
                this.routeAwayGlobals.setSaveEnabledFlag(true);
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (!this.uiForm.pristine)
                this.routeAwayGlobals.setSaveEnabledFlag(true);
        }
    };
    PremiseMaintenanceComponent.prototype.updateButton = function () {
        var _this = this;
        this.utils.getTranslatedval('Save').then(function (res) { _this.setControlValue('save', res); });
        this.utils.getTranslatedval('Cancel').then(function (res) { _this.setControlValue('cancel', res); });
        this.utils.getTranslatedval('Contact Details').then(function (res) { _this.setControlValue('BtnAmendContact', res); });
        this.utils.getTranslatedval('Get Address').then(function (res) { _this.setControlValue('cmdGetAddress', res); });
        this.utils.getTranslatedval('Copy').then(function (res) { _this.setControlValue('cmdCopyPremise', res); });
        this.utils.getTranslatedval('Get Vertex Geo Code').then(function (res) { _this.setControlValue('cmdVtxGeoCode', res); });
        this.utils.getTranslatedval('Geocode').then(function (res) { _this.setControlValue('cmdGeocode', res); });
        this.utils.getTranslatedval('Future Change').then(function (res) { _this.setControlValue('cmdValue', res); });
        this.utils.getTranslatedval('Resolve Address').then(function (res) { _this.setControlValue('cmdGetLatAndLong', res); });
        this.utils.getTranslatedval('Match Premise').then(function (res) { _this.setControlValue('cmdMatchPremise', res); });
        this.utils.getTranslatedval('Resend Premises').then(function (res) { _this.setControlValue('cmdResendPremises', res); });
        this.utils.getTranslatedval('View Linked Premises').then(function (res) { _this.setControlValue('cmdViewLinkedPremises', res); });
        this.utils.getTranslatedval('View Associated Premises').then(function (res) { _this.setControlValue('cmdViewAssociatedPremises', res); });
        this.utils.getTranslatedval('Add Next Hazard').then(function (res) { _this.setControlValue('cmdAddNextHazard', res); });
        this.utils.getTranslatedval('Questionnaire Complete').then(function (res) { _this.setControlValue('cmdQuestionnaireComp', res); });
        this.utils.getTranslatedval('Customer Information').then(function (res) { _this.setControlValue('tdCustomerInfo', res); });
    };
    PremiseMaintenanceComponent.prototype.updateEllipsisParams = function () {
        this.ellipsis.premiseNumberEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.premiseNumberEllipsis.childparams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.premiseNumberEllipsis.childparams.AccountNumber = this.getControlValue('AccountNumber');
        this.ellipsis.invoiceGrpNumberEllipsis.childparams.AccountNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber');
        this.ellipsis.invoiceGrpNumberEllipsis.childparams.AccountName = this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountName');
        this.ellipsis.invoiceGrpNumberEllipsis.childparams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        this.ellipsis.invoiceGrpNumberEllipsis.childparams.PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        this.ellipsis.siteReferenceEllipsis.childparams.AccountNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber');
        this.ellipsis.siteReferenceEllipsis.childparams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        this.ellipsis.siteReferenceEllipsis.childparams.ContractName = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
        this.ellipsis.siteReferenceEllipsis.childparams.SearchPostcode = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremisePostcode');
        this.ellipsis.siteReferenceEllipsis.childparams.PremiseName = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName');
        this.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine1 = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine1');
        this.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine2 = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine2');
        this.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine3 = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine3');
        this.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine4 = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine4');
        this.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine5 = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine5');
        this.ellipsis.siteReferenceEllipsis.childparams.PremisePostcode = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremisePostcode');
    };
    PremiseMaintenanceComponent.prototype.focusSave = function (obj) {
        this.riTab.focusNextTab(obj);
    };
    PremiseMaintenanceComponent.prototype.canDeactivate = function () {
        this.checkFormStatus();
        return _super.prototype.canDeactivate.call(this);
    };
    PremiseMaintenanceComponent.prototype.primaryFieldsEnableDisable = function () {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.parent.disablePremiseNumber();
            this.riMaintenance.DisableInput('menu');
        }
        else {
            this.parent.enablePremiseNumber();
            this.riMaintenance.EnableInput('menu');
        }
    };
    PremiseMaintenanceComponent.prototype.fieldValidateTransform = function (event) {
        var retObj = this.utils.fieldValidateTransform(event);
        this.setControlValue(retObj.id, retObj.value);
        if (!retObj.status) {
            this.riExchange.riInputElement.markAsError(this.uiForm, retObj.id);
        }
    };
    PremiseMaintenanceComponent.prototype.servicePrimaryError = function (data) {
        var _this = this;
        var retainParams = {
            ContractNumber: this.getControlValue('ContractNumber'),
            ContractName: this.getControlValue('ContractName'),
            AccountNumber: this.getControlValue('AccountNumber')
        };
        this.initialFormState(false, false);
        setTimeout(function () {
            _this.setControlValue('ContractNumber', retainParams.ContractNumber);
            _this.setControlValue('ContractName', retainParams.ContractName);
            _this.setControlValue('AccountNumber', retainParams.AccountNumber);
            _this.setControlValue('PremiseNumber', '');
            _this.enablePremiseNumber();
        }, 300);
    };
    PremiseMaintenanceComponent.prototype.overrideOpenFieldCR = function () {
        var _this = this;
        setTimeout(function () {
            _this.riExchange.updateCtrl(_this.controls, 'ContractNumber', 'disabled', true);
            _this.riExchange.riInputElement.Disable(_this.uiForm, 'ContractNumber');
            _this.riExchange.updateCtrl(_this.controls, 'PremiseNumber', 'disabled', true);
            _this.riExchange.riInputElement.Disable(_this.uiForm, 'PremiseNumber');
        }, 200);
    };
    PremiseMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAPremiseMaintenance.html'
                },] },
    ];
    PremiseMaintenanceComponent.ctorParameters = [
        { type: Injector, },
        { type: SpeedScript, },
    ];
    PremiseMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'contractNumberEllipsis': [{ type: ViewChild, args: ['contractNumberEllipsis',] },],
        'premiseNumberEllipsis': [{ type: ViewChild, args: ['premiseNumberEllipsis',] },],
        'customerTypeEllipsis': [{ type: ViewChild, args: ['customerTypeEllipsis',] },],
        'telesalesEmployeeEllipsis': [{ type: ViewChild, args: ['telesalesEmployeeEllipsis',] },],
        'vehicleTypeEllipsis': [{ type: ViewChild, args: ['vehicleTypeEllipsis',] },],
        'siteReferenceEllipsis': [{ type: ViewChild, args: ['siteReferenceEllipsis',] },],
        'sicCodeEllipsis': [{ type: ViewChild, args: ['sicCodeEllipsis',] },],
        'invoiceGrpNumberEllipsis': [{ type: ViewChild, args: ['invoiceGrpNumberEllipsis',] },],
        'salesAreaSearchEllipsis': [{ type: ViewChild, args: ['salesAreaSearchEllipsis',] },],
        'RegulatoryAuthorityEllipsis': [{ type: ViewChild, args: ['RegulatoryAuthorityEllipsis',] },],
        'MPAFSearch': [{ type: ViewChild, args: ['MPAFSearch',] },],
        'MarktSelectSearch': [{ type: ViewChild, args: ['MarktSelectSearch',] },],
        'PostCodeSearch': [{ type: ViewChild, args: ['PostCodeSearch',] },],
        'linkedContractNumberEllipsis': [{ type: ViewChild, args: ['linkedContractNumberEllipsis',] },],
        'linkedPremiseNumberEllipsis': [{ type: ViewChild, args: ['linkedPremiseNumberEllipsis',] },],
        'ContractNumber': [{ type: ViewChild, args: ['ContractNumber',] },],
        'ServiceAdjHrs': [{ type: ViewChild, args: ['ServiceAdjHrs',] },],
        'ServiceAdjMins': [{ type: ViewChild, args: ['ServiceAdjMins',] },],
        'PremiseType': [{ type: ViewChild, args: ['PremiseType',] },],
        'ProofOfServFax': [{ type: ViewChild, args: ['ProofOfServFax',] },],
        'PosFax': [{ type: ViewChild, args: ['PosFax',] },],
        'PosSMS': [{ type: ViewChild, args: ['PosSMS',] },],
        'PosEmail': [{ type: ViewChild, args: ['PosEmail',] },],
        'NotifyFax': [{ type: ViewChild, args: ['NotifyFax',] },],
        'ProofOfServSMS': [{ type: ViewChild, args: ['ProofOfServSMS',] },],
        'ProofOfServEmail': [{ type: ViewChild, args: ['ProofOfServEmail',] },],
        'PremisePostcode': [{ type: ViewChild, args: ['PremisePostcode',] },],
        'DateFrom1': [{ type: ViewChild, args: ['DateFrom1',] },],
        'DateFrom2': [{ type: ViewChild, args: ['DateFrom2',] },],
        'DateFrom3': [{ type: ViewChild, args: ['DateFrom3',] },],
        'DateFrom4': [{ type: ViewChild, args: ['DateFrom4',] },],
        'DateFrom5': [{ type: ViewChild, args: ['DateFrom5',] },],
        'DateFrom6': [{ type: ViewChild, args: ['DateFrom6',] },],
        'DateFrom7': [{ type: ViewChild, args: ['DateFrom7',] },],
        'DateFrom8': [{ type: ViewChild, args: ['DateFrom8',] },],
        'DateFrom9': [{ type: ViewChild, args: ['DateFrom9',] },],
        'DateFrom10': [{ type: ViewChild, args: ['DateFrom10',] },],
        'AccessFrom1': [{ type: ViewChild, args: ['AccessFrom1',] },],
        'AccessFrom2': [{ type: ViewChild, args: ['AccessFrom2',] },],
        'AccessFrom3': [{ type: ViewChild, args: ['AccessFrom3',] },],
        'AccessFrom4': [{ type: ViewChild, args: ['AccessFrom4',] },],
        'AccessFrom5': [{ type: ViewChild, args: ['AccessFrom5',] },],
        'AccessFrom6': [{ type: ViewChild, args: ['AccessFrom6',] },],
        'AccessFrom7': [{ type: ViewChild, args: ['AccessFrom7',] },],
        'AccessFrom8': [{ type: ViewChild, args: ['AccessFrom8',] },],
        'AccessFrom9': [{ type: ViewChild, args: ['AccessFrom9',] },],
        'AccessFrom10': [{ type: ViewChild, args: ['AccessFrom10',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return PremiseMaintenanceComponent;
}(BaseComponent));
