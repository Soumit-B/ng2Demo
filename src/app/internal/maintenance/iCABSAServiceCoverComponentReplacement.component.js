var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { BranchServiceAreaSearchComponent } from './../../internal/search/iCABSBBranchServiceAreaSearch';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
export var ServiceCoverComponentReplacementComponent = (function (_super) {
    __extends(ServiceCoverComponentReplacementComponent, _super);
    function ServiceCoverComponentReplacementComponent(injector, routeAwayGlobals) {
        _super.call(this, injector);
        this.routeAwayGlobals = routeAwayGlobals;
        this.ellipsis = {
            contract: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'currentContractType': 'C',
                    'currentContractTypeURLParameter': '<contract>',
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
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: PremiseSearchComponent,
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
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: '',
                showHeader: true,
                searchModalRoute: '',
                disabled: true
            },
            productSearch: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'ComponentReplacement',
                    'ProductComponentCodeRep': '',
                    'AlternateProductCode': '',
                    'currentContractType': 'C',
                    'currentContractTypeURLParameter': '<contract>',
                    'showAddNew': true
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: '',
                showHeader: true,
                searchModalRoute: '',
                disabled: true
            },
            branch: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp-SC',
                    'currentContractType': 'C',
                    'currentContractTypeURLParameter': '<contract>',
                    'showAddNew': true
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: BranchServiceAreaSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: true
            },
            employee: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp-Service-All',
                    'currentContractType': 'C',
                    'currentContractTypeURLParameter': '<contract>',
                    'showAddNew': true
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: EmployeeSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: true
            },
            reasoncode: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUpReplace',
                    'currentContractType': 'C',
                    'currentContractTypeURLParameter': '<contract>',
                    'showAddNew': true
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: '',
                showHeader: true,
                searchModalRoute: '',
                disabled: true
            }
        };
        this.queryParams = {
            operation: 'Application/iCABSAServiceCoverComponentReplacement',
            module: 'components',
            method: 'contract-management/maintenance',
            ActionSearch: '0',
            Actionupdate: '6',
            ActionEdit: '2',
            ActionDelete: '3',
            ActionInsert: '1'
        };
        this.controls = [
            { name: 'ContractNumber', readonly: true, disabled: false, required: true },
            { name: 'ContractName', readonly: true, disabled: false, required: false },
            { name: 'ItemDescription', readonly: true, disabled: false, required: false },
            { name: 'PremiseNumber', readonly: true, disabled: false, required: true },
            { name: 'PremiseName', readonly: true, disabled: false, required: false },
            { name: 'PremiseLocationNumber', readonly: true, disabled: false, required: false },
            { name: 'PremiseLocationDesc', readonly: true, disabled: false, required: false },
            { name: 'ProductCode', readonly: true, disabled: false, required: false },
            { name: 'ProductDesc', readonly: true, disabled: false, required: false },
            { name: 'ReplacementReasonCode', readonly: true, disabled: false, required: true },
            { name: 'ReplacementReasonDesc', readonly: true, disabled: false, required: false },
            { name: 'ComponentTypeCode', readonly: true, disabled: false, required: true },
            { name: 'ComponentTypeDesc', readonly: true, disabled: false, required: true },
            { name: 'ComponentQuantity', readonly: true, disabled: false, required: true },
            { name: 'ProductComponentCode', readonly: true, disabled: false, required: true },
            { name: 'ProductComponentDesc', readonly: true, disabled: false, required: true },
            { name: 'RemovalQty', readonly: true, disabled: false, required: true },
            { name: 'ProductComponentCodeRep', readonly: true, disabled: false, required: false },
            { name: 'AlternateProductCode', readonly: true, disabled: false, required: false },
            { name: 'ReplacementValue', readonly: true, disabled: false, required: false },
            { name: 'ProductComponentDescReplace', readonly: true, disabled: false, required: false },
            { name: 'ReplacementQty', readonly: true, disabled: false, required: true },
            { name: 'VisitDone', readonly: true, disabled: false, required: false },
            { name: 'VisitDate', readonly: true, disabled: false, required: true },
            { name: 'BranchServiceAreaCode', readonly: true, disabled: false, required: false },
            { name: 'BranchServiceAreaDesc', readonly: true, disabled: false, required: false },
            { name: 'ServiceEmployeeCode', readonly: true, disabled: false, required: true },
            { name: 'ServiceEmployeeSurname', readonly: true, disabled: false, required: false },
            { name: 'EmployeeCode', readonly: true, disabled: false, required: false },
            { name: 'EmployeeSurname', readonly: true, disabled: false, required: false },
            { name: 'ReplacementCost', readonly: true, disabled: false, required: false },
            { name: 'VisitRequired', readonly: true, disabled: false, required: false },
            { name: 'AdditionalChargeReq', readonly: false, disabled: false, required: false },
            { name: 'ServiceCoverNumber', readonly: true, disabled: false, required: false, hidden: true },
            { name: 'ServiceCoverItemNumber', readonly: true, disabled: false, required: false, hidden: true },
            { name: 'ServiceCoverComponentNumber', readonly: true, disabled: false, required: false, hidden: true },
            { name: 'SelProductCode', readonly: true, disabled: false, required: false, hidden: true },
            { name: 'SelProductAlternateCode', readonly: true, disabled: false, required: false, hidden: true },
            { name: 'SelProductDesc', readonly: true, disabled: false, required: false, hidden: true },
            { name: 'SelComponentTypeCode', readonly: true, disabled: false, required: false, hidden: true },
            { name: 'ComponentTypeDescLang', readonly: true, disabled: false, required: false, hidden: true },
            { name: 'LanguageCode', readonly: true, disabled: false, required: false, hidden: true },
            { name: 'ComponentReplacementNumber', readonly: true, disabled: false, required: false, hidden: true },
            { name: 'PlanVisitNumber', readonly: true, disabled: false, required: false, hidden: true },
            { name: 'NextVisitDate', readonly: true, disabled: false, required: false, hidden: true },
            { name: 'ServiceBranchNumber', readonly: true, disabled: false, required: true, hidden: true },
            { name: 'OrigServiceEmployeeCode', readonly: true, disabled: false, required: false, hidden: true },
            { name: 'OrigServiceEmployeeSurname', readonly: true, disabled: false, required: false, hidden: true },
            { name: 'OrigBranchServiceAreaCode', readonly: true, disabled: false, required: false, hidden: true },
            { name: 'OrigBranchServiceAreaDesc', readonly: true, disabled: false, required: false, hidden: true },
            { name: 'OrigEmployeeCode', readonly: true, disabled: false, required: false, hidden: true },
            { name: 'OrigEmployeeSurname', readonly: true, disabled: false, required: false, hidden: true },
            { name: 'ServiceCoverRowID', readonly: true, disabled: false, required: true, hidden: true },
            { name: 'PDAVisitRef', readonly: true, disabled: false, required: false, hidden: true },
            { name: 'PDAEmployeeCode', readonly: true, disabled: false, required: false, hidden: true }
        ];
        this.routeParams = {};
        this.postData = {};
        this.postDataAdd = {};
        this.postDataDelete = {};
        this.setFocusOnReason = new EventEmitter();
        this.setFocusOnProductCompDesc = new EventEmitter();
        this.date = {
            dateReadOnly: true,
            dateDisabled: true,
            dateAutoFocus: false,
            isRequired: true
        };
        this.search = new URLSearchParams();
        this.showMessageHeader = true;
        this.showPromptHeader = true;
        this.pageId = PageIdentifier.ICABSASERVICECOVERCOMPONENTREPLACEMENT;
        this.setCurrentContractType();
        this.setErrorCallback(this);
        this.setURLQueryParameters(this);
    }
    ServiceCoverComponentReplacementComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.mode = 'NEUTRAL';
        this.window_onload();
    };
    ServiceCoverComponentReplacementComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    ServiceCoverComponentReplacementComponent.prototype.window_onload = function () {
        this.routeParams = this.riExchange.getRouterParams();
        this.pageTitle = 'Component Maintenance';
        this.getDefaultBranchNumber();
        this.setFormDefaultData();
        this.getDummyProductCodes();
    };
    ServiceCoverComponentReplacementComponent.prototype.getDefaultBranchNumber = function () {
        var _this = this;
        this.utils.getLoggedInBranch(this.businessCode(), this.countryCode()).subscribe(function (data) {
            if (data.results && data.results[0] && data.results[0].length > 0) {
                _this.pageParams.loggedInBranch = data.results[0][0].BranchNumber;
            }
            else if (data.results && data.results[1] && data.results[1].length > 0) {
                _this.pageParams.loggedInBranch = data.results[1][0].BranchNumber;
            }
            else {
                _this.pageParams.loggedInBranch = '';
            }
        });
    };
    ServiceCoverComponentReplacementComponent.prototype.setCurrentContractType = function () {
        this.routeParams.currentContractType =
            this.utils.getCurrentContractType(this.routeParams.CurrentContractTypeURLParameter);
        this.routeParams.currentContractTypeLabel =
            this.utils.getCurrentContractLabel(this.routeParams.currentContractType);
    };
    ServiceCoverComponentReplacementComponent.prototype.getURLQueryParameters = function (param) {
        if (param['parentMode']) {
            this.pageParams.ParentMode = param['parentMode'];
        }
        else {
            this.pageParams.ParentMode = this.riExchange.getParentMode();
        }
    };
    ServiceCoverComponentReplacementComponent.prototype.setFormDefaultData = function () {
        this.isReadOnly = true;
        this.setFocusOnReason.emit(false);
        this.disableAddMode();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
        if (this.pageParams.ParentMode !== 'PDAICABSActivity') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentCode', this.riExchange.getParentHTMLValue('ProductComponentCode'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentDesc', this.riExchange.getParentHTMLValue('ProductComponentDesc'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ComponentQuantity', this.riExchange.getParentHTMLValue('ComponentQuantity'));
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverItemNumber', this.riExchange.getParentHTMLValue('ServiceCoverItemNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ComponentTypeCode', this.riExchange.getParentHTMLValue('ComponentTypeCode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ComponentTypeDesc', this.riExchange.getParentHTMLValue('ComponentTypeDesc'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ItemDescription', this.riExchange.getParentHTMLValue('ItemDescription'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverNumber', this.riExchange.getParentHTMLValue('ServiceCoverNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverComponentNumber', this.riExchange.getParentHTMLValue('ServiceCoverComponentNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseLocationNumber', this.riExchange.getParentHTMLValue('PremiseLocationNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseLocationDesc', this.riExchange.getParentHTMLValue('PremiseLocationDesc'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'VisitRequired', '');
        if (this.pageParams.ParentMode !== 'PDAICABSActivity') {
            if (this.riExchange.getParentAttributeValue('ServiceCoverComponentRowID')) {
                this.formData.ComponentReplacementROWID = this.riExchange.getParentAttributeValue('ServiceCoverComponentRowID');
            }
            else {
                this.formData.ComponentReplacementROWID = this.riExchange.getParentHTMLValue('ServiceCoverComponentRowID');
            }
            this.getAddFormData(this.mode);
        }
        else {
            if (this.riExchange.getParentHTMLValue('ComponentReplacementNumber')) {
                if (parseFloat(this.riExchange.getParentHTMLValue('ComponentReplacementNumber')) > 0) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ComponentReplacementNumber', this.riExchange.getParentHTMLValue('ComponentReplacementNumber'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverNumber', this.riExchange.getParentHTMLValue('ServiceCoverNumber'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverItemNumber', this.riExchange.getParentHTMLValue('ServiceCoverItemNumber'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverComponentNumber', this.riExchange.getParentHTMLValue('ServiceCoverComponentNumber'));
                    this.getAddFormData(this.mode);
                }
            }
            else {
                this.btnAddOnClick();
            }
        }
    };
    ServiceCoverComponentReplacementComponent.prototype.enableAddMode = function () {
        this.isReadOnly = false;
        this.date.dateDisabled = false;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementReasonCode', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementReasonDesc', '');
        this.riExchange.riInputElement.Enable(this.uiForm, 'VisitDone');
        this.riExchange.riInputElement.Enable(this.uiForm, 'VisitRequired');
        this.riExchange.riInputElement.Enable(this.uiForm, 'AdditionalChargeReq');
        this.setFormMode(this.c_s_MODE_ADD);
    };
    ServiceCoverComponentReplacementComponent.prototype.disableAddMode = function () {
        this.isReadOnly = true;
        this.date.dateDisabled = true;
        this.setFocusOnReason.emit(false);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementReasonCode', this.formData.ReplacementReasonCode);
        this.riExchange.riInputElement.Disable(this.uiForm, 'VisitDone');
        this.riExchange.riInputElement.Disable(this.uiForm, 'VisitRequired');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AdditionalChargeReq');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDescReplace');
        this.setFormMode(this.c_s_MODE_SELECT);
    };
    ServiceCoverComponentReplacementComponent.prototype.doLookupformData = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'VisitNarrative',
                'query': {
                    'LanguageCode': this.utils.getDefaultLang(),
                    'BusinessCode': this.businessCode(),
                    'VisitNarrativeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ReplacementReasonCode')
                },
                'fields': ['VisitNarrativeDesc']
            },
            {
                'table': 'BranchServiceArea',
                'query': {
                    'LanguageCode': this.utils.getDefaultLang(),
                    'BusinessCode': this.businessCode(),
                    'BranchNumber': this.utils.getBranchCode(),
                    'BranchServiceAreaCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode')
                },
                'fields': ['BranchServiceAreaDesc']
            },
            {
                'table': 'Employee',
                'query': {
                    'LanguageCode': this.utils.getDefaultLang(),
                    'BusinessCode': this.businessCode(),
                    'EmployeeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceEmployeeCode')
                },
                'fields': ['EmployeeSurname']
            },
            {
                'table': 'Employee',
                'query': {
                    'LanguageCode': this.utils.getDefaultLang(),
                    'BusinessCode': this.businessCode(),
                    'EmployeeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode')
                },
                'fields': ['EmployeeSurname']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data[0][0].VisitNarrativeDesc) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ReplacementReasonDesc', data[0][0].VisitNarrativeDesc);
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ReplacementReasonDesc', '');
            }
            if (data[1][0].BranchServiceAreaDesc) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaDesc', data[1][0].BranchServiceAreaDesc);
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaDesc', '');
            }
            if (data[2][0].EmployeeSurname) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceEmployeeSurname', data[2][0].EmployeeSurname);
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceEmployeeSurname', '');
            }
            if (data[3][0].EmployeeSurname) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EmployeeSurname', data[3][0].EmployeeSurname);
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EmployeeSurname', '');
            }
        });
    };
    ServiceCoverComponentReplacementComponent.prototype.parseFloatData = function (e) {
        if (e.target.id === 'ReplacementCost') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementCost', 'R' + parseFloat(e.target.value.replace('R', '')).toFixed(2));
        }
        if (e.target.id === 'ReplacementValue') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementValue', 'R' + parseFloat(e.target.value.replace('R', '')).toFixed(2));
        }
    };
    ServiceCoverComponentReplacementComponent.prototype.getDummyProductCodes = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        this.postData.Function = 'DummyProductCodeList,SingleQtyComponents';
        this.postData.ProductCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postData)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.errorService.emitError('Bad Request');
            }
            else {
                if (data.errorMessage) {
                    _this.errorContent = data.errorMessage;
                    _this.errorModal.show();
                }
                else {
                    _this.formData.vbDummyProductCodes = data.DummyProductCodes.split('|');
                    _this.formData.vbSingleQtyComponents = data.SingleQtyComponents.split('|');
                }
            }
        }, function (error) {
            _this.errorService.emitError('Record not found');
        });
    };
    ServiceCoverComponentReplacementComponent.prototype.btnAddOnClick = function () {
        this.mode = 'ADD';
        this.setFocusOnReason.emit(true);
        this.getAddFormData(this.mode);
        this.enableAddMode();
        this.ProductComponentInformation();
    };
    ServiceCoverComponentReplacementComponent.prototype.getAddFormData = function (mode) {
        var _this = this;
        if (mode === 'ADD' || mode === 'NEUTRAL') {
            var query = this.getURLSearchParamObject();
            query.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
            query.set('ComponentReplacementROWID', this.formData.ComponentReplacementROWID);
            query.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
            query.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
            query.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber')) {
                query.set('ServiceCoverNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber'));
            }
            else {
                query.set('ServiceCoverNumber', '3');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverItemNumber')) {
                query.set('ServiceCoverItemNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverItemNumber'));
            }
            else {
                query.set('ServiceCoverItemNumber', '1');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverComponentNumber')) {
                query.set('ServiceCoverComponentNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverComponentNumber'));
            }
            else {
                query.set('ServiceCoverComponentNumber', '1');
            }
            query.set('ComponentReplacementNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ComponentReplacementNumber'));
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query)
                .subscribe(function (data) {
                if (data.status === 'failure') {
                    _this.errorService.emitError('Bad Request');
                }
                else {
                    if (data.errorMessage) {
                        _this.errorContent = data.errorMessage;
                        _this.errorModal.show();
                    }
                    else {
                        _this.executeBeforeAdd(data);
                    }
                }
            }, function (error) {
                _this.errorService.emitError('Record not found');
            });
        }
    };
    ServiceCoverComponentReplacementComponent.prototype.executeBeforeAdd = function (data) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', data.PremiseNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', data.ProductCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ComponentTypeCode', data.ComponentTypeCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverNumber', data.ServiceCoverNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverItemNumber', data.ServiceCoverItemNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverComponentNumber', data.ServiceCoverComponentNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseLocationNumber', data.PremiseLocationNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AlternateProductCode', data.AlternateProductCode);
        if (this.pageParams.ParentMode === 'PDAICABSActivity') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PDAVisitRef', this.riExchange.getParentHTMLValue('PDAVisitRef'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PDAEmployeeCode', data.EmployeeCode);
            this.getComponentQuantities();
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ComponentQuantity', data.ComponentQuantity);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentCode', data.ProductComponentCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentDesc', data.ProductComponentDesc);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentCodeRep', data.ProductComponentCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentDescReplace', data.ProductComponentDescReplace);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementReasonCode', data.ReplacementReasonCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementReasonDesc', data.ReplacementReasonDesc);
            this.formData.ReplacementReasonCode = data.ReplacementReasonCode;
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ComponentTypeDesc', data.ComponentTypeDesc);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ComponentQuantity', data.ComponentQuantity);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentCode', data.ProductComponentCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentDesc', data.ProductComponentDesc);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'RemovalQty', data.RemovalQty ? data.RemovalQty : data.ComponentQuantity);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementQty', data.ReplacementQty ? data.ReplacementQty : data.ComponentQuantity);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentCodeRep', data.ProductComponentCodeRep ? data.ProductComponentCodeRep : data.ProductComponentCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentDescReplace', data.ProductComponentDescReplace ? data.ProductComponentDescReplace : data.ProductComponentDesc);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementReasonCode', data.ReplacementReasonCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementReasonDesc', data.ReplacementReasonDesc);
            this.formData.ReplacementReasonCode = data.ReplacementReasonCode;
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ComponentReplacementNumber', '1');
        this.pageParams.ComponentReplacementNumber = data.ComponentReplacementNumber;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementValue', 'R' + parseFloat(data.ReplacementValue).toFixed(2));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementCost', 'R' + parseFloat(data.ReplacementCost).toFixed(2));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceBranchNumber', data.ServiceBranchNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceEmployeeCode', data.ServiceEmployeeCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceEmployeeSurname', data.ServiceEmployeeSurname);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', data.BranchServiceAreaCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDesc', data.BranchServiceAreaDesc);
        if (data.AdditionalChargeReq !== 'no') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AdditionalChargeReq', true);
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AdditionalChargeReq', false);
        }
        if (data.VisitRequired !== 'no') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'VisitRequired', true);
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'VisitRequired', false);
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'OrigEmployeeCode', data.ServiceEmployeeCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'OrigEmployeeSurname', data.ServiceEmployeeSurname);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'OrigServiceEmployeeCode', data.ServiceEmployeeCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'OrigServiceEmployeeSurname', data.ServiceEmployeeSurname);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'OrigBranchServiceAreaCode', data.BranchServiceAreaCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'OrigBranchServiceAreaDesc', data.BranchServiceAreaDesc);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', data.ServiceCoverRowID);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ComponentTypeDesc', data.ComponentTypeDesc);
        this.formData.ComponentReplacementROWID = data.ServiceCoverRowID;
        this.IsReplacementValue = true;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementValue', data.ReplacementValue ? 'R' + parseFloat(data.ReplacementValue).toFixed(2) : 'R0.00');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'VisitDate', data.VisitDate);
        var getDate = data.VisitDate;
        if (window['moment'](getDate, 'DD/MM/YYYY', true).isValid()) {
            getDate = this.utils.convertDate(getDate);
        }
        else {
            getDate = this.utils.formatDate(getDate);
        }
        this.setVisitDate = new Date(getDate);
        this.doLookupformData();
        this.setFocusOnReason.emit(true);
        this.ellipsis.productSearch.disabled = false;
    };
    ServiceCoverComponentReplacementComponent.prototype.btnDeleteOnClick = function () {
        this.mode = 'DELETE';
        this.promptTitle = 'Confirm Records?';
        this.promptModal.show();
    };
    ServiceCoverComponentReplacementComponent.prototype.onSubmit = function () {
        var ReplacementReasonCode_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'ReplacementReasonCode');
        var ComponentTypeCode_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'ComponentTypeCode');
        var ComponentTypeDesc_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'ComponentTypeDesc');
        var ComponentQuantity_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'ComponentQuantity');
        var ProductComponentCode_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'ProductComponentCode');
        var ProductComponentDesc_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'ProductComponentDesc');
        var RemovalQty_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'RemovalQty');
        var ReplacementQty_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'ReplacementQty');
        var VisitDate_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'VisitDate');
        var ServiceEmployeeCode_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'ServiceEmployeeCode');
        var ServiceBranchNumber_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'ServiceBranchNumber');
        var ServiceCoverRowID_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'ServiceCoverRowID');
        var visitDate_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'VisitDate');
        var reg = /^\d+(?:\.\d{1,2})?$/;
        var isValid_ReplacementValue;
        var isValid_ReplacementCost;
        var isValid_ReplacementQty;
        var isValid_RemovalQty;
        if (reg.test(this.riExchange.riInputElement.GetValue(this.uiForm, 'ReplacementValue').replace('R', ''))) {
            isValid_ReplacementValue = reg.test(this.riExchange.riInputElement.GetValue(this.uiForm, 'ReplacementValue').replace('R', ''));
        }
        else {
            isValid_ReplacementValue = false;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementValue', '');
        }
        if (reg.test(this.riExchange.riInputElement.GetValue(this.uiForm, 'ReplacementCost').replace('R', ''))) {
            isValid_ReplacementCost = reg.test(this.riExchange.riInputElement.GetValue(this.uiForm, 'ReplacementCost').replace('R', ''));
        }
        else {
            isValid_ReplacementCost = false;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementCost', '');
        }
        if (reg.test(this.riExchange.riInputElement.GetValue(this.uiForm, 'ReplacementQty'))) {
            isValid_ReplacementQty = reg.test(this.riExchange.riInputElement.GetValue(this.uiForm, 'ReplacementQty'));
        }
        else {
            isValid_ReplacementQty = false;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementQty', '');
        }
        if (reg.test(this.riExchange.riInputElement.GetValue(this.uiForm, 'RemovalQty'))) {
            isValid_RemovalQty = reg.test(this.riExchange.riInputElement.GetValue(this.uiForm, 'RemovalQty'));
        }
        else {
            isValid_RemovalQty = false;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'RemovalQty', '');
        }
        if (!ReplacementReasonCode_hasError
            && !ComponentTypeCode_hasError
            && !ComponentTypeDesc_hasError
            && !ComponentQuantity_hasError
            && !ProductComponentCode_hasError
            && !ProductComponentDesc_hasError
            && !RemovalQty_hasError
            && !ReplacementQty_hasError
            && !VisitDate_hasError
            && !ServiceEmployeeCode_hasError
            && !ServiceBranchNumber_hasError
            && !ServiceCoverRowID_hasError
            && !visitDate_hasError
            && isValid_ReplacementValue
            && isValid_ReplacementCost
            && isValid_ReplacementQty
            && isValid_RemovalQty) {
            this.promptTitle = 'Confirm Records?';
            this.promptModal.show();
        }
    };
    ServiceCoverComponentReplacementComponent.prototype.onAbandon = function () {
        if (this.mode === 'ADD') {
            this.getAddFormData(this.mode);
        }
        if (this.mode === 'DELETE') {
            this.uiForm.reset();
            this.setFormDefaultData();
            this.formData.ReplacementReasonCode = '';
        }
        this.mode = 'NEUTRAL';
        this.disableAddMode();
    };
    ServiceCoverComponentReplacementComponent.prototype.promptCancel = function (event) {
        if (this.mode === 'DELETE') {
            this.mode = 'NEUTRAL';
        }
        if (this.mode === 'ADD') {
            this.mode = 'ADD';
        }
    };
    ServiceCoverComponentReplacementComponent.prototype.promptSave = function (event) {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        if (this.mode === 'ADD') {
            query.set(this.serviceConstants.Action, this.queryParams.ActionInsert);
        }
        if (this.mode === 'UPDATE') {
            query.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
        }
        if (this.mode === 'DELETE') {
            query.set(this.serviceConstants.Action, this.queryParams.ActionDelete);
        }
        if (this.mode === 'ADD' || this.mode === 'UPDATE') {
            this.postDataAdd.ComponentTypeCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ComponentTypeCode');
            this.postDataAdd.ComponentTypeDesc = this.riExchange.riInputElement.GetValue(this.uiForm, 'ComponentTypeDesc');
            this.postDataAdd.ComponentQuantity = this.riExchange.riInputElement.GetValue(this.uiForm, 'ComponentQuantity');
            this.postDataAdd.BranchServiceAreaCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode');
            this.postDataAdd.BranchServiceAreaDesc = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaDesc');
            this.postDataAdd.ServiceBranchNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber');
            this.postDataAdd.ServiceEmployeeCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceEmployeeCode');
            this.postDataAdd.ServiceEmployeeSurname = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceEmployeeSurname');
            this.postDataAdd.EmployeeCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode');
            this.postDataAdd.EmployeeSurname = this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeSurname');
            this.postDataAdd.ReplacementReasonDesc = this.riExchange.riInputElement.GetValue(this.uiForm, 'ReplacementReasonDesc');
            this.postDataAdd.ItemDescription = this.riExchange.riInputElement.GetValue(this.uiForm, 'ItemDescription');
            this.postDataAdd.PremiseLocationNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseLocationNumber');
            this.postDataAdd.PremiseLocationDesc = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseLocationDesc');
            this.postDataAdd.ServiceCoverRowID = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverRowID');
            this.postDataAdd.PDAVisitRef = this.riExchange.riInputElement.GetValue(this.uiForm, 'PDAVisitRef');
            this.postDataAdd.PDAEmployeeCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'PDAEmployeeCode');
            this.postDataAdd.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
            this.postDataAdd.PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
            this.postDataAdd.ProductCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
            this.postDataAdd.ServiceCoverNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber');
            this.postDataAdd.ServiceCoverItemNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverItemNumber');
            this.postDataAdd.ServiceCoverComponentNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverComponentNumber');
            this.postDataAdd.ComponentReplacementNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ComponentReplacementNumber');
            this.postDataAdd.ProductComponentCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCode');
            this.postDataAdd.ProductComponentDesc = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentDesc');
            this.postDataAdd.ProductComponentDescReplace = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentDescReplace');
            this.postDataAdd.AlternateProductCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'AlternateProductCode');
            this.postDataAdd.PlanVisitNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PlanVisitNumber');
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'VisitDone')) {
                this.postDataAdd.VisitDone = 'yes';
            }
            else {
                this.postDataAdd.VisitDone = 'no';
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'VisitRequired')) {
                this.postDataAdd.VisitRequired = 'yes';
            }
            else {
                this.postDataAdd.VisitRequired = 'no';
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AdditionalChargeReq')) {
                this.postDataAdd.AdditionalChargeReq = 'yes';
            }
            else {
                this.postDataAdd.AdditionalChargeReq = 'no';
            }
            this.postDataAdd.ReplacementValue = this.riExchange.riInputElement.GetValue(this.uiForm, 'ReplacementValue').replace('R', '').replace(/\.0{0,2}$/, '');
            this.postDataAdd.ReplacementCost = this.riExchange.riInputElement.GetValue(this.uiForm, 'ReplacementCost').replace('R', '').replace(/\.0{0,2}$/, '');
            this.postDataAdd.VisitDate = this.riExchange.riInputElement.GetValue(this.uiForm, 'VisitDate');
            this.postDataAdd.NextVisitDate = this.riExchange.riInputElement.GetValue(this.uiForm, 'NextVisitDate');
            this.postDataAdd.ReplacementReasonCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ReplacementReasonCode');
            this.postDataAdd.RemovalQty = this.riExchange.riInputElement.GetValue(this.uiForm, 'RemovalQty');
            this.postDataAdd.ReplacementQty = this.riExchange.riInputElement.GetValue(this.uiForm, 'ReplacementQty');
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postDataAdd)
                .subscribe(function (e) {
                if (e['status'] === 'failure') {
                    _this.errorService.emitError('Bad Request');
                    _this.errorContent = e.errorMessage;
                    _this.errorModal.show();
                }
                else {
                    if (e.errorMessage) {
                        _this.errorContent = e.errorMessage;
                        _this.errorModal.show();
                    }
                    else {
                        _this.messageContent = 'Data Saved Successfully';
                        _this.messageModal.show();
                        _this.onAbandon();
                    }
                }
            }, function (error) {
                _this.errorService.emitError('Record not found');
            });
        }
        if (this.mode === 'DELETE') {
            this.postDataDelete.ComponentReplacementROWID = this.formData.ComponentReplacementROWID;
            this.postDataDelete.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
            this.postDataDelete.PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
            this.postDataDelete.ProductCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
            this.postDataDelete.ServiceCoverNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber');
            this.postDataDelete.ServiceCoverItemNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverItemNumber');
            this.postDataDelete.ServiceCoverComponentNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverComponentNumber');
            this.postDataDelete.ComponentReplacementNumber = this.pageParams.ComponentReplacementNumber;
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postDataDelete)
                .subscribe(function (e) {
                if (e['status'] === 'failure') {
                    _this.errorService.emitError('Bad Request');
                    _this.errorContent = e.errorMessage;
                    _this.errorModal.show();
                }
                else {
                    if (e.errorMessage) {
                        _this.errorContent = e.errorMessage;
                        _this.errorModal.show();
                    }
                    else {
                        if (_this.mode === 'DELETE') {
                            _this.messageContent = 'Data Deleted Successfully';
                        }
                        _this.messageModal.show();
                        _this.onAbandon();
                    }
                }
            }, function (error) {
                _this.errorService.emitError('Record not found');
            });
        }
    };
    ServiceCoverComponentReplacementComponent.prototype.executeAfterSave = function () {
        if (this.pageParams.ParentMode === 'PDAICABSActivity') {
            this.pageParams.ComponentReplacementNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ComponentReplacementNumber');
        }
        this.setFormMode(this.c_s_MODE_SELECT);
    };
    ServiceCoverComponentReplacementComponent.prototype.getComponentQuantities = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        this.postData.Function = 'GetComponentQuantities';
        this.postData.PDAEmployeeCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'PDAEmployeeCode');
        this.postData.PDAVisitRef = this.riExchange.riInputElement.GetValue(this.uiForm, 'PDAVisitRef');
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postData)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.errorService.emitError('Bad Request');
            }
            else {
                if (data.errorMessage) {
                    _this.errorContent = data.errorMessage;
                    _this.errorModal.show();
                }
                else {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ComponentQuantity', data.ComponentQuantity);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'RemovalQty', data.RemovalQty);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ReplacementQty', data.ReplacementQty);
                }
            }
        }, function (error) {
            _this.errorService.emitError('Record not found');
        });
    };
    ServiceCoverComponentReplacementComponent.prototype.ProductComponentInformation = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        this.postData = {};
        this.postData.Function = 'PopulateFields';
        this.postData.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        this.postData.PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        this.postData.ProductCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
        this.postData.ServiceCoverNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber');
        this.postData.ServiceCoverItemNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverItemNumber');
        this.postData.ComponentTypeCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ComponentTypeCode');
        this.postData.ProductComponentCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCode');
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postData)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.errorService.emitError('Bad Request');
            }
            else {
                if (data.errorMessage) {
                    _this.errorContent = data.errorMessage;
                    _this.errorModal.show();
                }
                else {
                    _this.vbInclude = true;
                    for (var i = 0; i < _this.formData.vbDummyProductCodes.length; i++) {
                        _this.vbProductCode = _this.formData.vbDummyProductCodes[i];
                        if ((_this.riExchange.riInputElement.GetValue(_this.uiForm, 'ProductComponentCodeRep').toUpperCase() === _this.vbProductCode)
                            && (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'ProductComponentDescReplace') !== '')) {
                            _this.vbInclude = false;
                        }
                    }
                    if (_this.vbInclude === true) {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductComponentDescReplace', data.ProductComponentDesc);
                    }
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ReplacementValue', 'R' + parseFloat(data.ReplacementValue).toFixed(2));
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ReplacementCost', 'R' + parseFloat(data.ReplacementCost).toFixed(2));
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceBranchNumber', data.ServiceBranchNumber);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceEmployeeCode', data.ServiceEmployeeCode);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceEmployeeSurname', data.ServiceEmployeeSurname);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaCode', data.BranchServiceAreaCode);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaDesc', data.BranchServiceAreaDesc);
                    if (data.AdditionalChargeReq !== 'no') {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AdditionalChargeReq', true);
                    }
                    else {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AdditionalChargeReq', false);
                    }
                    if (data.VisitRequired !== 'no') {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'VisitRequired', true);
                    }
                    else {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'VisitRequired', false);
                    }
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'OrigEmployeeCode', data.ServiceEmployeeCode);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'OrigEmployeeSurname', data.ServiceEmployeeSurname);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'OrigServiceEmployeeCode', data.ServiceEmployeeCode);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'OrigServiceEmployeeSurname', data.ServiceEmployeeSurname);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'OrigBranchServiceAreaCode', data.BranchServiceAreaCode);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'OrigBranchServiceAreaDesc', data.BranchServiceAreaDesc);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceCoverRowID', data.ServiceCoverRowID);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ComponentTypeDesc', data.ComponentTypeDesc);
                    _this.formData.ComponentReplacementROWID = data.ServiceCoverRowID;
                    _this.ProductComponentCodeRepOnChange();
                    _this.AdditionalChargeReqOnclick();
                    _this.VisitRequiredOnclick();
                }
            }
        }, function (error) {
            _this.errorService.emitError('Record not found');
        });
    };
    ServiceCoverComponentReplacementComponent.prototype.ProductComponentCodeRepOnChange = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCodeRep')) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDescReplace');
            for (var i = 0; i < this.formData.vbDummyProductCodes.length; i++) {
                this.vbProductCode = this.formData.vbDummyProductCodes[i];
                if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCodeRep').toUpperCase() === this.vbProductCode) {
                    this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentDescReplace');
                }
            }
        }
        else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDescReplace');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentDescReplace', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AlternateProductCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementValue', 'R0.00');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementCost', 'R0.00');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementQty', '0');
        }
    };
    ServiceCoverComponentReplacementComponent.prototype.AdditionalChargeReqOnclick = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AdditionalChargeReq')) {
            this.IsReplacementValue = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ReplacementValue', true);
        }
        else {
            this.IsReplacementValue = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ReplacementValue', false);
        }
    };
    ServiceCoverComponentReplacementComponent.prototype.VisitRequiredOnclick = function () {
        var _this = this;
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'VisitRequired')) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'OrigBranchServiceAreaCode'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDesc', this.riExchange.riInputElement.GetValue(this.uiForm, 'OrigBranchServiceAreaDesc'));
            this.IsBranchServiceAreaCode = true;
            this.IsServiceEmployeeCode = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BranchServiceAreaCode', true);
            this.riExchange.riInputElement.Enable(this.uiForm, 'BranchServiceAreaCode');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'VisitDone', false);
            this.VisitDoneOnclick();
            var query = this.getURLSearchParamObject();
            query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
            query.set(this.serviceConstants.BusinessCode, this.businessCode());
            query.set(this.serviceConstants.CountryCode, this.countryCode());
            this.postData.Function = 'GetNextVisitDate';
            this.postData.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
            this.postData.PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
            this.postData.ProductCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
            this.postData.ServiceCoverNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber');
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postData)
                .subscribe(function (data) {
                if (data.status === 'failure') {
                    _this.errorService.emitError('Bad Request');
                }
                else {
                    if (data.errorMessage) {
                        _this.errorContent = data.errorMessage;
                        _this.errorModal.show();
                    }
                    else {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'VisitDate', data.VisitDate);
                        var getDate = data.VisitDate;
                        if (window['moment'](getDate, 'DD/MM/YYYY', true).isValid()) {
                            getDate = _this.utils.convertDate(getDate);
                        }
                        else {
                            getDate = _this.utils.formatDate(getDate);
                        }
                        _this.setVisitDate = new Date(getDate);
                    }
                }
            }, function (error) {
                _this.errorService.emitError('Record not found');
            });
        }
        else {
            this.IsBranchServiceAreaCode = false;
            this.IsServiceEmployeeCode = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BranchServiceAreaCode', false);
            this.riExchange.riInputElement.Disable(this.uiForm, 'BranchServiceAreaCode');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDesc', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'VisitDate', '');
            this.formData.VisitDate = '';
        }
    };
    ServiceCoverComponentReplacementComponent.prototype.VisitDoneOnclick = function () {
        if (this.mode === 'ADD' || this.mode === 'UPDATE') {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'VisitDone')) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'VisitRequired', false);
                this.VisitRequiredOnclick();
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'OrigEmployeeCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', this.riExchange.riInputElement.GetValue(this.uiForm, 'OrigEmployeeSurname'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'VisitDate', '');
                this.formData.VisitDate = '';
                this.IsEmployeeCode = true;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EmployeeCode', true);
                this.riExchange.riInputElement.Enable(this.uiForm, 'EmployeeCode');
            }
            else {
                this.IsEmployeeCode = false;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EmployeeCode', false);
                this.riExchange.riInputElement.Disable(this.uiForm, 'EmployeeCode');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', '');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', '');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'VisitDate', '');
                this.formData.VisitDate = '';
            }
        }
    };
    ServiceCoverComponentReplacementComponent.prototype.VisitDateOnChange = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'VisitRequired')) {
            this.riExchange.setParentAttributeValue('ServiceCoverRowID', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverRowID'));
        }
    };
    ServiceCoverComponentReplacementComponent.prototype.dateSelectedValue = function (value) {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'VisitDate', value.value);
        }
        this.formData.VisitDate = this.utils.formatDate(this.utils.convertDate(value.value.toString()));
        this.VisitDateOnChange();
    };
    ServiceCoverComponentReplacementComponent.prototype.ReplacementReasonCodeOnChange = function () {
        this.messageTitle = 'Page Not Found';
        this.messageContent = 'Navigate to Service/iCABSBVisitNarrativeSearch.htm';
        this.messageModal.show();
    };
    ServiceCoverComponentReplacementComponent.prototype.ProductComponentCodeRepOnSelect = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'SelProductCode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelComponentTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ComponentTypeCode'));
        this.messageTitle = 'Page Not Found';
        this.messageContent = 'Navigate to Business/iCABSBProductSearch.htm';
        this.messageModal.show();
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'SelProductCode') !== this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCodeRep')) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentCodeRep', this.riExchange.riInputElement.GetValue(this.uiForm, 'SelProductCode'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentDescReplace', this.riExchange.riInputElement.GetValue(this.uiForm, 'SelProductDesc'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AlternateProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'SelProductAlternateCode'));
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'SelProductCode') !== '') {
                this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDescReplace');
                for (var i = 0; i < this.formData.vbDummyProductCodes.length; i++) {
                    this.vbProductCode = this.formData.vbDummyProductCodes[i];
                    if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCodeRep').toUpperCase() === this.vbProductCode) {
                        this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentDescReplace');
                    }
                }
            }
            else {
                this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDescReplace');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentDescReplace', '');
            }
        }
    };
    ServiceCoverComponentReplacementComponent.prototype.AlternateProductCodeOnSelect = function (obj) {
        this.messageTitle = 'Page Not Found';
        this.messageContent = 'Navigate to Business/iCABSBProductSearch.htm';
        this.messageModal.show();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelProductAlternateCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'AlternateProductCode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelComponentTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ComponentTypeCode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelProductDesc', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentDescReplace'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCodeRep'));
        if (obj.AlternateProductCode) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'SelProductAlternateCode') !== obj.AlternateProductCode
                || this.riExchange.riInputElement.GetValue(this.uiForm, 'SelProductCode') !== obj.ProductComponentCodeRep) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AlternateProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'SelProductAlternateCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentDescReplace', this.riExchange.riInputElement.GetValue(this.uiForm, 'SelProductDesc'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentCodeRep', this.riExchange.riInputElement.GetValue(this.uiForm, 'SelProductCode'));
                if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCodeRep')) {
                    this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDescReplace');
                    this.GetProductValues();
                    for (var i = 0; i < this.formData.vbDummyProductCodes.length; i++) {
                        this.vbProductCode = this.formData.vbDummyProductCodes[i];
                        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCodeRep').toUpperCase() === this.vbProductCode) {
                            this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentDescReplace');
                            this.setFocusOnProductCompDesc.emit(true);
                        }
                    }
                }
                else {
                    this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentDescReplace');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentDescReplace', '');
                }
            }
        }
    };
    ServiceCoverComponentReplacementComponent.prototype.GetProductValues = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        this.postData.Function = 'GetProductValues';
        this.postData.ProductComponentCodeRep = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCodeRep');
        this.postData.ServiceBranchNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber');
        this.postData.ProductComponentCodeRep = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCodeRep');
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postData)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.errorService.emitError('Bad Request');
            }
            else {
                if (data.errorMessage) {
                    _this.errorContent = data.errorMessage;
                    _this.errorModal.show();
                }
                else {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AlternateProductCode', data.AlternateProductCode);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductComponentDescReplace', data.ProductComponentDescReplace);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ReplacementValue', 'R' + parseFloat(data.ReplacementValue).toFixed(2));
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ReplacementCost', 'R' + parseFloat(data.ReplacementCost).toFixed(2));
                }
            }
        }, function (error) {
            _this.errorService.emitError('Record not found');
        });
    };
    ServiceCoverComponentReplacementComponent.prototype.ProductComponentCodeRepOnchange = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCodeRep')) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDescReplace');
            this.GetProductValues();
            for (var i = 0; i < this.formData.vbDummyProductCodes.length; i++) {
                this.vbProductCode = this.formData.vbDummyProductCodes[i];
                if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductComponentCodeRep').toUpperCase() === this.vbProductCode) {
                    this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentDescReplace');
                    this.setFocusOnProductCompDesc.emit(true);
                }
            }
        }
        else {
            this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentDescReplace');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductComponentDescReplace', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AlternateProductCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementValue', 'R0.00');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementCost', 'R0.00');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementQty', '0');
        }
    };
    ServiceCoverComponentReplacementComponent.prototype.BranchServiceAreaCodeOnSelect = function (obj) {
        if (obj.BranchServiceAreaCode) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', obj.BranchServiceAreaCode);
        }
        if (obj.BranchServiceAreaDesc) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDesc', obj.BranchServiceAreaDesc);
        }
    };
    ServiceCoverComponentReplacementComponent.prototype.EmployeeCodeOnSelect = function (obj) {
        if (obj.EmployeeCode) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceEmployeeCode', obj.EmployeeCode);
        }
        if (obj.EmployeeSurname) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceEmployeeSurname', obj.EmployeeSurname);
        }
    };
    ServiceCoverComponentReplacementComponent.prototype.GetServiceAreaDefaults = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        this.postData.Function = 'GetServiceAreaDefaults';
        this.postData.ServiceBranchNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber');
        this.postData.BranchServiceAreaCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode');
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postData)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.errorService.emitError('Bad Request');
            }
            else {
                if (data.errorMessage) {
                    _this.errorContent = data.errorMessage;
                    _this.errorModal.show();
                }
                else {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaCode', data.BranchServiceAreaCode);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaDesc', data.BranchServiceAreaDesc);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceEmployeeCode', data.ServiceEmployeeCode);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceEmployeeSurname', data.ServiceEmployeeSurname);
                }
            }
        }, function (error) {
            _this.errorService.emitError('Record not found');
        });
    };
    ServiceCoverComponentReplacementComponent.prototype.GetAlternateProductValues = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        this.postData.Function = 'GetAlternateProductValues';
        this.postData.AlternateProductCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'AlternateProductCode');
        this.postData.ServiceBranchNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber');
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postData)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.errorService.emitError('Bad Request');
            }
            else {
                if (data.errorMessage) {
                    _this.errorContent = data.errorMessage;
                    _this.errorModal.show();
                }
                else {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductComponentCodeRep', data.ProductComponentCodeRep);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductComponentDescReplace', data.ProductComponentDescReplace);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ReplacementValue', 'R' + parseFloat(data.ReplacementValue).toFixed(2));
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ReplacementCost', 'R' + parseFloat(data.ReplacementCost).toFixed(2));
                    _this.riExchange.riInputElement.SetRequiredStatus(_this.uiForm, 'ProductComponentCodeRep', false);
                    _this.riExchange.riInputElement.Disable(_this.uiForm, 'ProductComponentDescReplace');
                    for (var i = 0; i < _this.formData.vbDummyProductCodes.length; i++) {
                        _this.vbProductCode = _this.formData.vbDummyProductCodes[i];
                        if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'ProductComponentCodeRep').toUpperCase() === _this.vbProductCode) {
                            _this.riExchange.riInputElement.Enable(_this.uiForm, 'ProductComponentDescReplace');
                        }
                    }
                }
            }
        }, function (error) {
            _this.errorService.emitError('Record not found');
        });
    };
    ServiceCoverComponentReplacementComponent.prototype.getCBORequest = function () {
        if (this.mode === 'ADD' || this.mode === 'UPDATE') {
            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'BranchServiceAreaCode')) {
                this.GetServiceAreaDefaults();
            }
            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'EmployeeCode')) {
                this.GetServiceAreaDefaults();
            }
            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ProductComponentCodeRep')) {
                this.GetProductValues();
            }
            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'AlternateProductCode')) {
                this.GetAlternateProductValues();
            }
        }
    };
    ServiceCoverComponentReplacementComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    ServiceCoverComponentReplacementComponent.prototype.routeAwayUpdateSaveFlag = function () {
        var _this = this;
        this.uiForm.statusChanges.subscribe(function (value) {
            if (_this.mode !== 'NEUTRAL') {
                _this.routeAwayGlobals.setSaveEnabledFlag(true);
            }
            else {
                _this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    };
    ServiceCoverComponentReplacementComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverComponentReplacement.html'
                },] },
    ];
    ServiceCoverComponentReplacementComponent.ctorParameters = [
        { type: Injector, },
        { type: RouteAwayGlobals, },
    ];
    ServiceCoverComponentReplacementComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'ContractSearchComponent': [{ type: ViewChild, args: ['contractNumberEllipsis',] },],
        'PremiseSearchComponent': [{ type: ViewChild, args: ['premisesNumberEllipsis',] },],
        'BranchServiceAreaSearchComponent': [{ type: ViewChild, args: ['BranchServiceAreaEllipsis',] },],
        'EmployeeSearchComponent': [{ type: ViewChild, args: ['EmployeeSearchEllipsis',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return ServiceCoverComponentReplacementComponent;
}(BaseComponent));
