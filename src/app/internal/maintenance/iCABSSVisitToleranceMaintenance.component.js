var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild, EventEmitter } from '@angular/core';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { GroupAccountNumberComponent } from './../../internal/search/iCABSSGroupAccountNumberSearch';
import { AccountSearchComponent } from './../../internal/search/iCABSASAccountSearch';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
export var VisitToleranceMaintenanceComponent = (function (_super) {
    __extends(VisitToleranceMaintenanceComponent, _super);
    function VisitToleranceMaintenanceComponent(injector, routeAwayGlobals) {
        _super.call(this, injector);
        this.routeAwayGlobals = routeAwayGlobals;
        this.queryParams = {
            operation: 'System/iCABSSVisitToleranceMaintenance',
            module: 'csi',
            method: 'service-planning/admin',
            ActionSearch: '0',
            Actionupdate: '6',
            ActionEdit: '2',
            ActionDelete: '3',
            ActionInsert: '1'
        };
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.showPromptHeader = true;
        this.routeParams = {};
        this.postData = {};
        this.postDataContractSearch = {};
        this.postDataPremiseSearch = {};
        this.postDataProductSearch = {};
        this.postDataAccountSearch = {};
        this.postDataGroupAccountSearch = {};
        this.saveDataAdd = {};
        this.saveDataDelete = {};
        this.isRequesting = false;
        this.IsAddEnable = true;
        this.IsUpdateEnable = true;
        this.IsDeleteEnable = false;
        this.setFocusOnAccount = new EventEmitter();
        this.controls = [
            { name: 'AccountNumber', readonly: true, disabled: false, required: false },
            { name: 'AccountName', readonly: true, disabled: false, required: false },
            { name: 'GroupAccountNumber', readonly: true, disabled: false, required: false },
            { name: 'GroupName', readonly: true, disabled: false, required: false },
            { name: 'ContractNumber', readonly: true, disabled: false, required: false },
            { name: 'ContractName', readonly: true, disabled: false, required: false },
            { name: 'PremiseNumber', readonly: true, disabled: false, required: false },
            { name: 'PremiseName', readonly: true, disabled: false, required: false },
            { name: 'ProductCode', readonly: true, disabled: false, required: false },
            { name: 'ProductDesc', readonly: true, disabled: false, required: false },
            { name: 'SelTolTableType', readonly: true, disabled: false, required: false },
            { name: 'SelType', readonly: true, disabled: false, required: false },
            { name: 'VisitFrequency', readonly: true, disabled: false, required: true },
            { name: 'Tolerance', readonly: true, disabled: false, required: true },
            { name: 'ClearVisit', readonly: true, disabled: false, required: false },
            { name: 'FinalFollowUp', readonly: true, disabled: false, required: false },
            { name: 'ServiceCoverNumber', readonly: true, disabled: false, required: false },
            { name: 'ServiceCoverRowID', readonly: true, disabled: false, required: false },
            { name: 'TolTableType', readonly: true, disabled: false, required: false },
            { name: 'TypeText', readonly: true, disabled: false, required: false },
            { name: 'save', readonly: true, disabled: false, required: false },
            { name: 'cancel', readonly: true, disabled: false, required: false },
            { name: 'delete', readonly: true, disabled: false, required: false }
        ];
        this.ellipsis = {
            groupaccount: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'currentContractType': this.routeParams.currentContractType,
                    'currentContractTypeURLParameter': this.routeParams.currentContractTypeLabel,
                    'showAddNew': false
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: GroupAccountNumberComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            account: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'currentContractType': this.routeParams.currentContractType,
                    'currentContractTypeURLParameter': this.routeParams.currentContractTypeLabel,
                    'showAddNewDisplay': false
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: AccountSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            contract: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp-All',
                    'currentContractType': this.routeParams.currentContractType,
                    'currentContractTypeURLParameter': this.routeParams.currentContractTypeLabel,
                    'showAddNew': false,
                    'AccountNumber': '',
                    'AccountName': ''
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
            premises: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'ContractNumber': '',
                    'ContractName': '',
                    'currentContractType': this.routeParams.currentContractType,
                    'currentContractTypeURLParameter': this.routeParams.currentContractTypeLabel,
                    'showAddNew': false
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: PremiseSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
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
                    'currentContractType': this.routeParams.currentContractType,
                    'currentContractTypeURLParameter': this.routeParams.currentContractTypeLabel,
                    'showAddNew': false
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: ServiceCoverSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            }
        };
        this.pageId = PageIdentifier.ICABSSVISITTOLERANCEMAINTENANCE;
        this.setCurrentContractType();
        this.setErrorCallback(this);
        this.setURLQueryParameters(this);
        this.handleBackNavigation(this);
    }
    VisitToleranceMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.mode = 'NEUTRAL';
        this.routeAwayUpdateSaveFlag();
        this.window_onload();
    };
    VisitToleranceMaintenanceComponent.prototype.window_onload = function () {
        this.routeParams = this.riExchange.getRouterParams();
        this.pageTitle = 'Visit Tolerance Maintenance';
        this.utils.setTitle(this.pageTitle);
        this.getSysCharDtetails();
        this.setDefaultFormData();
    };
    VisitToleranceMaintenanceComponent.prototype.getURLQueryParameters = function (param) {
        if (param['Mode']) {
            this.pageParams.ParentMode = param['Mode'];
        }
        else {
            this.pageParams.ParentMode = this.riExchange.getParentMode();
        }
        this.routeParams.CurrentContractTypeURLParameter = param['currentContractTypeURLParameter'];
        this.routeParams.currentContractType = param['currentContractTypeURLParameter'];
    };
    VisitToleranceMaintenanceComponent.prototype.setCurrentContractType = function () {
        this.routeParams.currentContractType =
            this.utils.getCurrentContractType(this.routeParams.CurrentContractTypeURLParameter);
        this.routeParams.currentContractTypeLabel =
            this.utils.getCurrentContractLabel(this.routeParams.CurrentContractTypeURLParameter);
    };
    VisitToleranceMaintenanceComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableWeeklyVisitPattern
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
            _this.pageParams.vbVisitPatternRequired = !(record[0]['Required']);
            _this.pageParams.vbVisitPatternLogical = !(record[0]['Logical']);
        });
    };
    VisitToleranceMaintenanceComponent.prototype.setDefaultFormData = function () {
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'GroupName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductDesc');
        this.SelTolTableTypeArray = [
            { title: 'Business', value: '1' },
            { title: 'Contract', value: '2' },
            { title: 'Premise', value: '3' },
            { title: 'Service Cover', value: '4' },
            { title: 'Account', value: '5' },
            { title: 'Group Account', value: '6' }
        ];
        this.SelTypeArry = [
            { title: 'Annually', value: 'Annually' },
            { title: 'Bi-Annually', value: 'Bi-Annually' },
            { title: 'Quarterly', value: 'Quarterly' },
            { title: 'Monthly', value: 'Monthly' },
            { title: '4 Weekly', value: '4 Weekly' },
            { title: 'Weekly', value: 'Weekly' }
        ];
        switch (this.pageParams.ParentMode) {
            case 'AddVisitTolerance':
                this.riExchange.riInputElement.Disable(this.uiForm, 'delete');
                this.btnAddOnClick();
                break;
            case 'VisitToleranceGrid':
                this.mode = 'UPDATE';
                this.IsAddEnable = false;
                this.riExchange.riInputElement.Enable(this.uiForm, 'delete');
                this.formData.VisitToleranceRowID = this.riExchange.getBridgeObjValue('VisitToleranceRowID');
                this.fetchRecord();
                this.disableFields();
                break;
            default:
                this.fetchRecord();
        }
    };
    VisitToleranceMaintenanceComponent.prototype.isNumValidatorVisitFrequency = function (e) {
        if (this.riExchange.riInputElement.isNumber(this.uiForm, 'VisitFrequency') && this.getControlValue('VisitFrequency')) {
            this.setControlValue('VisitFrequency', parseInt(this.getControlValue('VisitFrequency'), 10));
        }
        else {
            this.setControlValue('VisitFrequency', '');
        }
    };
    VisitToleranceMaintenanceComponent.prototype.isNumValidatorTolerance = function (e) {
        if (this.riExchange.riInputElement.isNumber(this.uiForm, 'Tolerance') && this.getControlValue('Tolerance')) {
            this.setControlValue('Tolerance', parseInt(this.getControlValue('Tolerance'), 10));
        }
        else {
            this.setControlValue('Tolerance', '');
        }
    };
    VisitToleranceMaintenanceComponent.prototype.isNumValidatorClearVisit = function (e) {
        if (this.riExchange.riInputElement.isNumber(this.uiForm, 'ClearVisit') && this.getControlValue('ClearVisit')) {
            this.setControlValue('ClearVisit', parseInt(this.getControlValue('ClearVisit'), 10));
        }
        else {
            this.setControlValue('ClearVisit', '');
        }
    };
    VisitToleranceMaintenanceComponent.prototype.isNumValidatorFinalFollowUp = function (e) {
        if (this.riExchange.riInputElement.isNumber(this.uiForm, 'FinalFollowUp') && this.getControlValue('FinalFollowUp')) {
            this.setControlValue('FinalFollowUp', parseInt(this.getControlValue('FinalFollowUp'), 10));
        }
        else {
            this.setControlValue('FinalFollowUp', '');
        }
    };
    VisitToleranceMaintenanceComponent.prototype.fetchRecord = function () {
        this.setControlValue('GroupAccountNumber', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'GroupAccountNumber', true));
        this.setControlValue('GroupName', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'GroupName', true));
        this.setControlValue('AccountNumber', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'AccountNumber', true));
        this.setControlValue('AccountName', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'AccountName', true));
        this.setControlValue('ContractNumber', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'ContractNumber', true));
        this.setControlValue('ContractName', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'ContractName', true));
        this.setControlValue('PremiseNumber', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'PremiseNumber', true));
        this.setControlValue('PremiseName', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'PremiseName', true));
        this.setControlValue('ProductCode', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'ProductCode', true));
        this.setControlValue('ProductDesc', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'ProductDesc', true));
        this.setControlValue('ServiceCoverNumber', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'ServiceCoverNumber', true));
        this.setControlValue('ServiceCoverRowID', this.riExchange.GetParentHTMLInputValue(this.uiForm, 'VisitToleranceRowID', true) ? this.riExchange.GetParentHTMLInputValue(this.uiForm, 'VisitToleranceRowID', true) : this.riExchange.GetParentHTMLInputValue(this.uiForm, 'ServiceCoverRowID', true));
        this.formData.VisitToleranceRowID = this.riExchange.GetParentHTMLInputValue(this.uiForm, 'VisitToleranceRowID', true) ? this.riExchange.GetParentHTMLInputValue(this.uiForm, 'VisitToleranceRowID', true) : this.riExchange.getBridgeObjValue('VisitToleranceRowID');
        if (this.mode === 'ADD') {
            this.selectedTolTableType = '1';
            this.selectedType = 'Annually';
            this.ellipsis.contract.childConfigParams.AccountNumber = this.getControlValue('AccountNumber') ? this.getControlValue('AccountNumber') : '';
            this.ellipsis.contract.childConfigParams.AccountName = this.getControlValue('AccountName') ? this.getControlValue('AccountName') : '';
            this.ellipsis.premises.childConfigParams.ContractNumber = this.getControlValue('ContractNumber') ? this.getControlValue('ContractNumber') : '';
            this.ellipsis.premises.childConfigParams.ContractName = this.getControlValue('ContractName') ? this.getControlValue('ContractName') : '';
            this.ellipsis.product.childConfigParams.ContractNumber = this.getControlValue('ContractNumber') ? this.getControlValue('ContractNumber') : '';
            this.ellipsis.product.childConfigParams.ContractName = this.getControlValue('ContractName') ? this.getControlValue('ContractName') : '';
            this.ellipsis.product.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber') ? this.getControlValue('PremiseNumber') : '';
            this.ellipsis.product.childConfigParams.PremiseName = this.getControlValue('PremiseName') ? this.getControlValue('PremiseName') : '';
        }
        else {
            this.fetchGridRecord();
        }
    };
    VisitToleranceMaintenanceComponent.prototype.fetchGridRecord = function () {
        var GetParentHTMLGridData = this.riExchange.GetParentHTMLInputValue(this.uiForm, 'gridData', true);
        if (GetParentHTMLGridData) {
            switch (GetParentHTMLGridData.rowData['Tolerance Table Type']) {
                case 'Business':
                    this.selectedTolTableType = '1';
                    break;
                case 'Contract':
                    this.selectedTolTableType = '2';
                    break;
                case 'Premise':
                    this.selectedTolTableType = '3';
                    break;
                case 'Service Cover':
                    this.selectedTolTableType = '4';
                    break;
                case 'Account':
                    this.selectedTolTableType = '5';
                    break;
                case 'Group Account':
                    this.selectedTolTableType = '6';
                    break;
                default:
                    this.selectedTolTableType = '1';
                    break;
            }
            this.selectedType = GetParentHTMLGridData.rowData['Type'];
            this.setControlValue('VisitFrequency', GetParentHTMLGridData.rowData['Visit Frequency']);
            this.setControlValue('TolTableType', GetParentHTMLGridData.rowData['Tolerance Table Type']);
            this.setControlValue('TypeText', GetParentHTMLGridData.rowData['Type']);
            this.setControlValue('Tolerance', GetParentHTMLGridData.rowData['Tolerance']);
            this.setControlValue('ClearVisit', GetParentHTMLGridData.rowData['Clear Visit']);
            this.setControlValue('FinalFollowUp', GetParentHTMLGridData.rowData['Final Follow Up']);
        }
    };
    VisitToleranceMaintenanceComponent.prototype.riMaintenanceSearch = function () {
        this.navigate('Search', '/path/to/System/iCABSSSystemPDAActivityStatusSearchComponent');
    };
    VisitToleranceMaintenanceComponent.prototype.accountNumberFormatOnChange = function () {
        var paddedValue = this.utils.numberPadding(this.getControlValue('AccountNumber'), 9);
        this.setControlValue('AccountNumber', paddedValue);
    };
    VisitToleranceMaintenanceComponent.prototype.contractNumberFormatOnChange = function () {
        var paddedValue = this.utils.numberPadding(this.getControlValue('ContractNumber'), 8);
        this.setControlValue('ContractNumber', paddedValue);
    };
    VisitToleranceMaintenanceComponent.prototype.accountNumberOnkeydown = function (obj, call) {
        if (call) {
            if (obj.AccountNumber) {
                this.setControlValue('AccountNumber', obj.AccountNumber);
            }
            if (obj.AccountName) {
                this.setControlValue('AccountName', obj.AccountName);
            }
            this.ellipsis.contract.childConfigParams.AccountNumber = this.getControlValue('AccountNumber') ? this.getControlValue('AccountNumber') : '';
            this.ellipsis.contract.childConfigParams.AccountName = this.getControlValue('AccountName') ? this.getControlValue('AccountName') : '';
        }
    };
    VisitToleranceMaintenanceComponent.prototype.groupAccountNumberOnkeydown = function (obj, call) {
        if (call) {
            if (obj.GroupAccountNumber) {
                this.setControlValue('GroupAccountNumber', obj.GroupAccountNumber);
            }
            if (obj.GroupName) {
                this.setControlValue('GroupName', obj.GroupName);
            }
        }
    };
    VisitToleranceMaintenanceComponent.prototype.contractNumberOnkeydown = function (obj, call) {
        if (call) {
            if (obj.ContractNumber) {
                this.setControlValue('ContractNumber', obj.ContractNumber);
            }
            if (obj.ContractName) {
                this.setControlValue('ContractName', obj.ContractName);
            }
            this.ellipsis.premises.childConfigParams.ContractNumber = this.getControlValue('ContractNumber') ? this.getControlValue('ContractNumber') : '';
            this.ellipsis.premises.childConfigParams.ContractName = this.getControlValue('ContractName') ? this.getControlValue('ContractName') : '';
            this.ellipsis.product.childConfigParams.ContractNumber = this.getControlValue('ContractNumber') ? this.getControlValue('ContractNumber') : '';
            this.ellipsis.product.childConfigParams.ContractName = this.getControlValue('ContractName') ? this.getControlValue('ContractName') : '';
        }
    };
    VisitToleranceMaintenanceComponent.prototype.premiseNumberOnkeydown = function (obj, call) {
        if (call) {
            if (obj.PremiseNumber) {
                this.setControlValue('PremiseNumber', obj.PremiseNumber);
            }
            if (obj.PremiseName) {
                this.setControlValue('PremiseName', obj.PremiseName);
            }
            this.ellipsis.product.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber') ? this.getControlValue('PremiseNumber') : '';
            this.ellipsis.product.childConfigParams.PremiseName = this.getControlValue('PremiseName') ? this.getControlValue('PremiseName') : '';
        }
    };
    VisitToleranceMaintenanceComponent.prototype.productCodeOnkeydown = function (obj, call) {
        if (call) {
            if (obj.ProductCode) {
                this.setControlValue('ProductCode', obj.ProductCode);
            }
            if (obj.ProductDesc) {
                this.setControlValue('ProductDesc', obj.ProductDesc);
            }
        }
    };
    VisitToleranceMaintenanceComponent.prototype.accountNumberOnchange = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
        this.postDataAccountSearch.GroupAccountNumber = this.getControlValue('GroupAccountNumber') ? this.getControlValue('GroupAccountNumber') : '';
        if (this.getControlValue('AccountNumber')) {
            this.accountNumberFormatOnChange();
            this.postDataAccountSearch.AccountNumber = this.getControlValue('AccountNumber');
        }
        else {
            this.postDataAccountSearch.AccountNumber = '';
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postDataAccountSearch)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.errorService.emitError(data['oResponse']);
            }
            else {
                if (data.errorMessage) {
                    _this.errorContent = data.errorMessage;
                    _this.errorModal.show();
                }
                else {
                    _this.setControlValue('AccountNumber', data.AccountNumber ? data.AccountNumber : '');
                    _this.setControlValue('AccountName', data.AccountName ? data.AccountName : '');
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    VisitToleranceMaintenanceComponent.prototype.groupAccountNumberOnchange = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
        if (this.getControlValue('GroupAccountNumber')) {
            this.postDataGroupAccountSearch.GroupAccountNumber = this.getControlValue('GroupAccountNumber');
        }
        else {
            this.postDataGroupAccountSearch.GroupAccountNumber = '';
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postDataGroupAccountSearch)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.errorService.emitError(data['oResponse']);
            }
            else {
                if (data.errorMessage) {
                    _this.errorContent = data.errorMessage;
                    _this.errorModal.show();
                }
                else {
                    _this.setControlValue('GroupAccountNumber', data.GroupAccountNumber ? data.GroupAccountNumber : '');
                    _this.setControlValue('GroupName', data.GroupName ? data.GroupName : '');
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    VisitToleranceMaintenanceComponent.prototype.contractNumberOnchange = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
        if (this.getControlValue('ContractNumber')) {
            this.contractNumberFormatOnChange();
            this.postDataContractSearch.ContractNumber = this.getControlValue('ContractNumber');
        }
        else {
            this.postDataContractSearch.ContractNumber = '';
        }
        this.postDataContractSearch.AccountNumber = this.getControlValue('AccountNumber') ? this.getControlValue('AccountNumber') : '';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postDataContractSearch)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.errorService.emitError(data['oResponse']);
            }
            else {
                if (data.errorMessage) {
                    _this.errorContent = data.errorMessage;
                    _this.errorModal.show();
                }
                else {
                    _this.setControlValue('ContractNumber', data.ContractNumber ? data.ContractNumber : '');
                    _this.setControlValue('ContractName', data.ContractName ? data.ContractName : '');
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    VisitToleranceMaintenanceComponent.prototype.premiseNumberOnchange = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
        if (this.getControlValue('ContractNumber')) {
            this.postDataPremiseSearch.ContractNumber = this.getControlValue('ContractNumber');
        }
        else {
            this.postDataPremiseSearch.ContractNumber = '';
        }
        this.postDataPremiseSearch.AccountNumber = this.getControlValue('AccountNumber') ? this.getControlValue('AccountNumber') : '';
        this.postDataPremiseSearch.PremiseNumber = this.getControlValue('PremiseNumber') ? this.getControlValue('PremiseNumber') : '';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postDataPremiseSearch)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.errorService.emitError(data['oResponse']);
            }
            else {
                if (data.errorMessage) {
                    _this.errorContent = data.errorMessage;
                    _this.errorModal.show();
                }
                else {
                    _this.setControlValue('PremiseNumber', data.PremiseNumber ? data.PremiseNumber : '');
                    _this.setControlValue('PremiseName', data.PremiseName ? data.PremiseName : '');
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    VisitToleranceMaintenanceComponent.prototype.productCodeOnchange = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
        if (this.getControlValue('ContractNumber')) {
            this.postDataProductSearch.ContractNumber = this.getControlValue('ContractNumber');
        }
        else {
            this.postDataProductSearch.ContractNumber = '';
        }
        this.postDataProductSearch.AccountNumber = this.getControlValue('AccountNumber') ? this.getControlValue('AccountNumber') : '';
        this.postDataProductSearch.PremiseNumber = this.getControlValue('PremiseNumber') ? this.getControlValue('PremiseNumber') : '';
        this.postDataProductSearch.ProductCode = this.getControlValue('ProductCode') ? this.getControlValue('ProductCode') : '';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postDataProductSearch)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.errorService.emitError(data['oResponse']);
            }
            else {
                if (data.errorMessage) {
                    _this.errorContent = data.errorMessage;
                    _this.errorModal.show();
                }
                else {
                    _this.setControlValue('ProductCode', data.ProductCode ? data.ProductCode : '');
                    _this.setControlValue('ProductDesc', data.ProductDesc ? data.ProductDesc : '');
                    _this.setControlValue('ServiceCoverNumber', data.ServiceCoverNumber ? data.ServiceCoverNumber : '');
                    _this.attributes.ServiceCoverRowID = data.ServiceCoverNumber ? data.ServiceCoverNumber : '';
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    VisitToleranceMaintenanceComponent.prototype.populateDescriptions = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
        if (this.getControlValue('ContractNumber')) {
            this.contractNumberFormatOnChange();
            this.postData.ContractNumber = this.getControlValue('ContractNumber');
        }
        this.postData.AccountNumber = this.getControlValue('AccountNumber') ? this.getControlValue('AccountNumber') : '';
        this.postData.PremiseNumber = this.getControlValue('PremiseNumber') ? this.getControlValue('PremiseNumber') : '';
        this.postData.ProductCode = this.getControlValue('ProductCode') ? this.getControlValue('ProductCode') : '';
        this.postData.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID') ? this.getControlValue('ServiceCoverRowID') : '';
        this.postData.GroupAccountNumber = this.getControlValue('GroupAccountNumber') ? this.getControlValue('GroupAccountNumber') : '';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postData)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.errorService.emitError(data['oResponse']);
            }
            else {
                if (data.errorMessage) {
                    _this.errorContent = data.errorMessage;
                    _this.errorModal.show();
                }
                else {
                    _this.setControlValue('ContractNumber', data.ContractNumber);
                    _this.setControlValue('ContractName', data.ContractName);
                    _this.setControlValue('PremiseNumber', data.PremiseNumber);
                    _this.setControlValue('PremiseName', data.PremiseName);
                    _this.setControlValue('ProductCode', data.ProductCode);
                    _this.setControlValue('ProductDesc', data.ProductDesc);
                    _this.setControlValue('ServiceCoverNumber', data.ServiceCoverNumber);
                    _this.setControlValue('AccountNumber', data.AccountNumber);
                    _this.setControlValue('AccountName', data.AccountName);
                    _this.setControlValue('GroupAccountNumber', data.GroupAccountNumber);
                    _this.setControlValue('GroupName', data.GroupName);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    VisitToleranceMaintenanceComponent.prototype.btnAddOnClick = function () {
        this.mode = 'ADD';
        this.setFocusOnAccount.emit(true);
        this.fetchRecord();
        this.enableFields();
        this.routeAwayGlobals.setSaveEnabledFlag(true);
    };
    VisitToleranceMaintenanceComponent.prototype.btnUpdateOnClick = function () {
        this.mode = 'UPDATE';
        this.routeAwayGlobals.setSaveEnabledFlag(true);
    };
    VisitToleranceMaintenanceComponent.prototype.btnDeleteOnClick = function () {
        this.mode = 'DELETE';
        this.disableFields();
        this.promptTitle = 'Delete Record?';
        this.promptModal.show();
    };
    VisitToleranceMaintenanceComponent.prototype.enableFields = function () {
        this.riExchange.riInputElement.Enable(this.uiForm, 'SelTolTableType');
        this.riExchange.riInputElement.Enable(this.uiForm, 'SelType');
        this.riExchange.riInputElement.Enable(this.uiForm, 'GroupAccountNumber');
        this.riExchange.riInputElement.Enable(this.uiForm, 'AccountNumber');
        this.riExchange.riInputElement.Enable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Enable(this.uiForm, 'ProductCode');
        this.riExchange.riInputElement.Enable(this.uiForm, 'VisitFrequency');
    };
    VisitToleranceMaintenanceComponent.prototype.disableFields = function () {
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelTolTableType');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelType');
        this.riExchange.riInputElement.Disable(this.uiForm, 'GroupAccountNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'VisitFrequency');
        this.populateDescriptions();
    };
    VisitToleranceMaintenanceComponent.prototype.onAbandon = function () {
        this.mode = 'NEUTRAL';
        this.redirectToParent();
    };
    VisitToleranceMaintenanceComponent.prototype.redirectToParent = function () {
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.router.navigate(['grid/application/visittolerancegrid'], {
            queryParams: {
                parentMode: this.riExchange.GetParentHTMLInputValue(this.uiForm, 'ParentPageMode', true),
                currentContractTypeURLParameter: this.routeParams.currentContractType
            }
        });
    };
    VisitToleranceMaintenanceComponent.prototype.onSubmit = function () {
        var VisitFrequency_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'VisitFrequency');
        var Tolerance_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'Tolerance');
        var ClearVisit_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'ClearVisit');
        var FinalFollowUp_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'FinalFollowUp');
        if (!VisitFrequency_hasError
            && !Tolerance_hasError
            && !ClearVisit_hasError
            && !FinalFollowUp_hasError) {
            this.promptTitle = 'Confirm Record?';
            this.promptModal.show();
        }
    };
    VisitToleranceMaintenanceComponent.prototype.promptCancel = function (event) {
        if (this.mode === 'DELETE') {
            this.mode = 'NEUTRAL';
        }
        if (this.mode === 'ADD') {
            this.mode = 'ADD';
        }
        if (this.mode === 'UPDATE') {
            this.mode = 'NEUTRAL';
            this.fetchGridRecord();
        }
        this.routeAwayGlobals.setSaveEnabledFlag(false);
    };
    VisitToleranceMaintenanceComponent.prototype.promptSave = function (event) {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        if (this.mode === 'ADD') {
            query.set(this.serviceConstants.Action, this.queryParams.ActionInsert);
            this.saveDataAdd.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
        }
        if (this.mode === 'UPDATE') {
            query.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
            this.saveDataAdd.VisitToleranceROWID = this.formData.VisitToleranceRowID ? this.formData.VisitToleranceRowID : this.getControlValue('ServiceCoverRowID');
            this.saveDataAdd.ServiceCoverRowID = '';
        }
        if (this.mode === 'DELETE') {
            query.set(this.serviceConstants.Action, this.queryParams.ActionDelete);
        }
        if (this.mode === 'ADD' || this.mode === 'UPDATE') {
            this.saveDataAdd.AccountNumber = this.getControlValue('AccountNumber');
            this.saveDataAdd.AccountName = this.getControlValue('AccountName');
            this.saveDataAdd.GroupAccountNumber = this.getControlValue('GroupAccountNumber');
            this.saveDataAdd.GroupName = this.getControlValue('GroupName');
            this.saveDataAdd.ContractNumber = this.getControlValue('ContractNumber');
            this.saveDataAdd.ContractName = this.getControlValue('ContractName');
            this.saveDataAdd.PremiseNumber = this.getControlValue('PremiseNumber');
            this.saveDataAdd.PremiseName = this.getControlValue('PremiseName');
            this.saveDataAdd.ProductCode = this.getControlValue('ProductCode');
            this.saveDataAdd.ProductDesc = this.getControlValue('ProductDesc');
            this.saveDataAdd.TolTableType = this.getControlValue('SelTolTableType');
            this.saveDataAdd.Type = this.getControlValue('SelType');
            this.saveDataAdd.ServiceVisitFrequency = this.getControlValue('VisitFrequency');
            this.saveDataAdd.Tolerance = this.getControlValue('Tolerance');
            this.saveDataAdd.ClearVisit = this.getControlValue('ClearVisit');
            this.saveDataAdd.FinalFollowUp = this.getControlValue('FinalFollowUp');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.saveDataAdd)
                .subscribe(function (e) {
                if (e['status'] === 'failure') {
                    _this.errorService.emitError(e['oResponse']);
                    _this.errorContent = e.errorMessage;
                    _this.errorModal.show();
                }
                else {
                    if (e.errorMessage) {
                        _this.errorContent = e.errorMessage;
                        _this.errorModal.show();
                    }
                    else {
                        _this.messageService.emitMessage({
                            msg: MessageConstant.Message.RecordSavedSuccessfully
                        });
                        _this.redirectToParent();
                    }
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.errorService.emitError(error);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.onAbandon();
            });
        }
        if (this.mode === 'DELETE') {
            this.saveDataDelete.ROWID = this.formData.VisitToleranceRowID ? this.formData.VisitToleranceRowID : this.getControlValue('ServiceCoverRowID');
            this.saveDataDelete.Table = 'VisitTolerance';
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.saveDataDelete)
                .subscribe(function (e) {
                if (e['status'] === 'failure') {
                    _this.errorService.emitError(e['oResponse']);
                    _this.errorContent = e.errorMessage;
                    _this.errorModal.show();
                }
                else {
                    if (e.errorMessage) {
                        _this.errorContent = e.errorMessage;
                        _this.errorModal.show();
                    }
                    else {
                        _this.messageService.emitMessage({
                            msg: MessageConstant.Message.RecordDeletedSuccessfully
                        });
                        _this.onAbandon();
                    }
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.errorService.emitError(error);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.onAbandon();
            });
        }
    };
    VisitToleranceMaintenanceComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    VisitToleranceMaintenanceComponent.prototype.routeAwayUpdateSaveFlag = function () {
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
    VisitToleranceMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSVisitToleranceMaintenance.html'
                },] },
    ];
    VisitToleranceMaintenanceComponent.ctorParameters = [
        { type: Injector, },
        { type: RouteAwayGlobals, },
    ];
    VisitToleranceMaintenanceComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'ContractSearchComponent': [{ type: ViewChild, args: ['ContractSearchComponent',] },],
        'PremiseSearchComponent': [{ type: ViewChild, args: ['PremiseSearchEllipsis',] },],
        'ServiceCoverSearchComponent': [{ type: ViewChild, args: ['productSearchEllipsis',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return VisitToleranceMaintenanceComponent;
}(BaseComponent));
