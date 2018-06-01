var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { ICABSBAPICodeSearchComponent } from '../../internal/search/iCABSBAPICodeSearchComponent';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
export var ServiceCoverAPIGridComponent = (function (_super) {
    __extends(ServiceCoverAPIGridComponent, _super);
    function ServiceCoverAPIGridComponent(injector, _router, el) {
        _super.call(this, injector);
        this._router = _router;
        this.el = el;
        this.pageId = '';
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.totalItems = 10;
        this.maxColumn = 15;
        this.showHeader = true;
        this.promptConfirmTitle = '';
        this.search = new URLSearchParams();
        this.isDisabledAssignAll = false;
        this.isDisabledClearAll = false;
        this.serviceCoverSearchComponent = ServiceCoverSearchComponent;
        this.currentContractTypeURLParameter = { currentContractTypeURLParameter: 'contract', Mode: 'Release' };
        this.queryParams = {
            operation: 'Application/iCABSAServiceCoverAPIGrid',
            module: 'api',
            method: 'contract-management/maintenance'
        };
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.contractSearchParams = {
            'parentMode': 'LookUp',
            'currentContractType': 'C',
            'currentContractTypeURLParameter': '<contract>',
            'showAddNew': true
        };
        this.inputParamsServiceCover = {
            'parentMode': 'LookUp-Freq'
        };
        this.searchModalRoute = '';
        this.searchPageRoute = '';
        this.showCloseButton = true;
        this.contractSearchComponent = ContractSearchComponent;
        this.isAccountEllipsisDisabled = false;
        this.accountSearchComponent = AccountSearchComponent;
        this.inputParamsAccount = {
            'parentMode': 'LookUp',
            'showAddNew': true,
            'countryCode': '',
            'businessCode': '',
            'showCountryCode': true,
            'showBusinessCode': true
        };
        this.inputParams = {
            'parentMode': '',
            'businessCode': '',
            'countryCode': ''
        };
        this.accountPremise = PremiseSearchComponent;
        this.inputParamsAccountPremise = {
            'parentMode': 'LookUp',
            'pageTitle': 'Premise Search'
        };
        this.apiSearchComponent = ICABSBAPICodeSearchComponent;
        this.controls = [
            { name: 'AccountNumber', readonly: true, disabled: false, required: false },
            { name: 'AccountName', readonly: true, disabled: false, required: false },
            { name: 'ContractNumber', readonly: true, disabled: false, required: false },
            { name: 'ContractName', readonly: true, disabled: false, required: false },
            { name: 'PremiseNumber', readonly: true, disabled: false, required: false },
            { name: 'PremiseName', readonly: true, disabled: false, required: false },
            { name: 'ProductCode', readonly: true, disabled: false, required: false },
            { name: 'ProductDesc', readonly: true, disabled: false, required: false },
            { name: 'APICode', readonly: true, disabled: false, required: false },
            { name: 'ServiceCoverRowID', readonly: true, disabled: false, required: false }
        ];
        this.pageId = PageIdentifier.ICABSASERVICECOVERAPIGRID;
    }
    ServiceCoverAPIGridComponent.prototype.onAccountDataReceived = function (data) {
        this.uiForm.controls['AccountNumber'].setValue(data.AccountNumber);
        this.uiForm.controls['AccountName'].setValue(data.AccountName);
        this.contractSearchParams.accountNumber = this.uiForm.controls['AccountNumber'].value;
        this.contractSearchParams.accountName = this.uiForm.controls['AccountName'].value;
        this.contractSearchEllipsis.updateComponent();
        this.cbbService.disableComponent(true);
    };
    ServiceCoverAPIGridComponent.prototype.onContractDataReceived = function (data) {
        this.uiForm.controls['ContractNumber'].setValue(data.ContractNumber);
        this.uiForm.controls['ContractName'].setValue(data.ContractName);
        this.populateDescriptions('c');
        this.inputParamsAccountPremise.ContractNumber = this.uiForm.controls['ContractNumber'].value;
        this.inputParamsAccountPremise.ContractName = this.uiForm.controls['ContractName'].value;
        this.premiseSearchEllipsis.updateComponent();
        this.inputParamsServiceCover.ContractNumber = this.uiForm.controls['ContractNumber'].value;
        this.productCodeSearchEllipsis.updateComponent();
    };
    ServiceCoverAPIGridComponent.prototype.initData = function () {
        this.pageTitle = 'Service Cover API Code Update';
        this.pageParams.CurrentContractType = this.riExchange.getCurrentContractType();
        this.pageParams.CurrentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
        var branchCode = this.utils.getLoggedInBranch();
        this.uiForm.controls['AccountName'].disable();
        this.uiForm.controls['ContractName'].disable();
        this.uiForm.controls['PremiseName'].disable();
        this.uiForm.controls['ProductDesc'].disable();
        this.el.nativeElement.querySelector('#ContractNumber').focus();
        this.pageParams.blnGridHasData = false;
        this.pageParams.blnForceRefresh = false;
        this.activateButtons();
    };
    ServiceCoverAPIGridComponent.prototype.buildGrid = function () {
        this.serviceCoverAPIGrid.clearGridData();
        this.beforeExecute();
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set('BranchNumber', this.utils.getBranchCode());
        this.search.set('AccountNumber', this.uiForm.controls['AccountNumber'].value);
        this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
        this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
        this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
        this.search.set('ServiceCoverRowID', this.uiForm.controls['ServiceCoverRowID'].value);
        this.search.set('ForceRefresh', this.pageParams.strForceRefresh);
        this.search.set('riCacheRefresh', 'True');
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.queryParams.search = this.search;
        this.serviceCoverAPIGrid.loadGridData(this.queryParams);
    };
    ServiceCoverAPIGridComponent.prototype.beforeExecute = function () {
        if (this.pageParams.blnForceRefresh) {
            this.pageParams.strForceRefresh = 'yes';
        }
        else {
            this.pageParams.strForceRefresh = 'no';
        }
    };
    ServiceCoverAPIGridComponent.prototype.activateButtons = function () {
        if (this.uiForm.controls['APICode'].value !== '' && this.pageParams.blnGridHasData === true) {
            this.isDisabledAssignAll = false;
        }
        else {
            this.isDisabledAssignAll = true;
        }
        if (this.pageParams.blnGridHasData === true) {
            this.isDisabledClearAll = false;
        }
        else {
            this.isDisabledClearAll = true;
        }
    };
    ServiceCoverAPIGridComponent.prototype.afterExecute = function () {
        this.pageParams.blnForceRefresh = false;
        this.activateButtons();
    };
    ServiceCoverAPIGridComponent.prototype.clearTable = function () {
        this.pageParams.blnGridHasData = false;
    };
    ServiceCoverAPIGridComponent.prototype.setRefreshRequired = function () {
        this.clearTable();
        this.uiForm.controls['APICode'].setValue('');
        this.uiForm.controls['APICodeDesc'].setValue('');
        this.activateButtons();
    };
    ServiceCoverAPIGridComponent.prototype.onGridRowClick = function (event) {
        if (event.trRowData) {
            this.attributes['ContractNumberContractRowID'] = event.trRowData[0].rowID;
            this.attributes['ContractNumberPremiseRowID'] = event.trRowData[1].rowID;
            this.attributes['ContractNumberServiceCoverRowID'] = event.trRowData[2].rowID;
            this.attributes['grdServiceCoverServiceCoverRowID'] = event.trRowData[2].rowID;
        }
        if (event.rowIndex) {
            this.attributes['grdServiceCoverRow'] = event.rowIndex;
            this.attributes['ContractNumberRow'] = event.rowIndex;
        }
    };
    ServiceCoverAPIGridComponent.prototype.onGridRowDblClick = function (event) {
        var _this = this;
        this.onGridRowClick(event);
        var cellInfo = '';
        try {
            cellInfo = event.columnClicked.text.replace(/[\n\r\s]+/g, '');
        }
        catch (e) {
            this.logger.warn(e);
        }
        switch (cellInfo) {
            case 'ContractNumber':
                this.router.navigate([this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], {
                    queryParams: {
                        parentMode: 'Release',
                        ContractNumber: this.uiForm.controls['ContractNumber'].value,
                        ContractName: this.uiForm.controls['ContractName'].value
                    }
                });
                break;
            case 'ProductCode':
                this.router.navigate([this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE], {
                    queryParams: {
                        'parentMode': 'Release',
                        'ServiceCoverRowID': this.attributes['ContractNumberServiceCoverRowID']
                    }
                });
                break;
            case 'PremisesNumber':
                this.router.navigate([this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
                    queryParams: {
                        'parentMode': 'Release',
                        'PremiseRowID': this.attributes['ContractNumberPremiseRowID'],
                        'ContractTypeCode': this.riExchange.getCurrentContractType()
                    }
                });
                break;
            case 'VisitTypeCode':
                break;
            case 'TrialCommenceDate':
                break;
            case 'ContractCommenceDate':
                this.router.navigate(['contractmanagement/maintenance/commencedate'], { queryParams: this.currentContractTypeURLParameter });
                break;
            case 'TrialEndDate':
                this.router.navigate(['contractmanagement/branch/serviceCover/maintenance'], { queryParams: this.currentContractTypeURLParameter });
                break;
            case 'Assign':
                if (this.uiForm.controls['APICode'].value === '') {
                    this.apiCodeDropDown.apicodesearchDropDown.isError = true;
                }
                else {
                    this.apiCodeDropDown.apicodesearchDropDown.isError = false;
                    this.search = new URLSearchParams();
                    this.search.set(this.serviceConstants.Action, '0');
                    this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
                    this.search.set('APICode', this.uiForm.controls['APICode'].value);
                    this.search.set('ServiceCoverRowID', this.attributes['ContractNumberServiceCoverRowID']);
                    this.search.set('Function', 'SetAPICode');
                    this.search.set(this.serviceConstants.CountryCode, this.countryCode());
                    this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search).subscribe(function (data) {
                        try {
                            if (data['errorMessage']) {
                                _this.messageModal.show({ msg: data['errorMessage'], title: _this.pageTitle }, false);
                            }
                            else {
                                _this.serviceCoverAPIGrid.update = true;
                                _this.currentPage = 1;
                                _this.buildGrid();
                            }
                        }
                        catch (error) {
                            _this.logger.warn(error);
                        }
                    }, function (error) {
                        _this.errorService.emitError(error);
                    });
                }
                break;
            case 'Clear':
                this.search = new URLSearchParams();
                this.search.set(this.serviceConstants.Action, '0');
                this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
                this.search.set('ServiceCoverRowID', this.attributes['ContractNumberServiceCoverRowID']);
                this.search.set('Function', 'ClearAPICode');
                this.search.set(this.serviceConstants.CountryCode, this.countryCode());
                this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search).subscribe(function (data) {
                    try {
                        if (data['errorMessage']) {
                            _this.messageModal.show({ msg: data['errorMessage'], title: _this.pageTitle }, false);
                        }
                        else {
                            _this.serviceCoverAPIGrid.update = true;
                            _this.currentPage = 1;
                            _this.buildGrid();
                        }
                    }
                    catch (error) {
                        _this.logger.warn(error);
                    }
                }, function (error) {
                    _this.errorService.emitError(error);
                });
                break;
            default:
                break;
        }
    };
    ServiceCoverAPIGridComponent.prototype.getGridInfo = function (info) {
        this.pageParams.blnGridHasData = false;
        this.serviceCoverAPIPagination.totalItems = info.totalRows;
        if (info.totalRows > 0) {
            this.pageParams.blnGridHasData = true;
            this.afterExecute();
        }
    };
    ServiceCoverAPIGridComponent.prototype.accountNumberOnchange = function (obj) {
        if (this.uiForm.controls['AccountNumber'].value) {
            this.uiForm.controls['AccountNumber'].setValue(this.utils.numberPadding(obj.value, 9));
            this.populateDescriptions('a');
        }
        else {
            this.uiForm.controls['AccountName'].setValue('');
        }
        this.contractSearchParams.accountNumber = this.uiForm.controls['AccountNumber'].value;
        this.contractSearchParams.accountName = this.uiForm.controls['AccountName'].value;
        this.contractSearchEllipsis.updateComponent();
    };
    ServiceCoverAPIGridComponent.prototype.contractNumberOnchange = function (obj) {
        if (this.uiForm.controls['ContractNumber'].value) {
            this.uiForm.controls['ContractNumber'].setValue(this.utils.numberPadding(obj.value, 8));
            this.populateDescriptions('c');
        }
        else {
            this.uiForm.controls['ContractName'].setValue('');
        }
        this.inputParamsAccountPremise.ContractNumber = this.uiForm.controls['ContractNumber'].value;
        this.inputParamsAccountPremise.ContractName = this.uiForm.controls['ContractName'].value;
        this.premiseSearchEllipsis.updateComponent();
        this.inputParamsServiceCover.ContractNumber = this.uiForm.controls['ContractNumber'].value;
        this.productCodeSearchEllipsis.updateComponent();
    };
    ServiceCoverAPIGridComponent.prototype.premiseNumberOnchange = function (obj) {
        this.populateDescriptions('');
        this.inputParamsServiceCover.PremiseNumber = this.uiForm.controls['PremiseNumber'].value;
        this.productCodeSearchEllipsis.updateComponent();
    };
    ServiceCoverAPIGridComponent.prototype.productCodeOnchange = function (obj) {
        this.populateDescriptions('');
        this.inputParamsServiceCover.ProductCode = this.uiForm.controls['ProductCode'].value;
        this.productCodeSearchEllipsis.updateComponent();
    };
    ServiceCoverAPIGridComponent.prototype.populateDescriptions = function (frmCode) {
        var _this = this;
        var blnAccountNumber = false, blnContractNumber = false, blnPremiseNumber = false, blnProductCode = false, blnAPICode = false;
        if (this.uiForm.controls['AccountNumber'].value) {
            blnAccountNumber = true;
        }
        else {
            this.uiForm.controls['AccountNumber'].setValue('');
        }
        if (this.uiForm.controls['ContractNumber'].value) {
            blnContractNumber = true;
            blnAccountNumber = true;
        }
        else {
            this.uiForm.controls['ContractName'].setValue('');
            this.uiForm.controls['PremiseNumber'].setValue('');
        }
        if (this.uiForm.controls['PremiseNumber'].value) {
            blnContractNumber = true;
            blnPremiseNumber = true;
        }
        else {
            this.uiForm.controls['PremiseName'].setValue('');
        }
        if (this.uiForm.controls['ProductCode'].value) {
            blnProductCode = true;
        }
        else {
            this.uiForm.controls['ProductDesc'].setValue('');
        }
        if (blnAccountNumber || blnContractNumber || blnPremiseNumber || blnProductCode) {
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '0');
            this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
            if (blnContractNumber)
                this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
            if (blnPremiseNumber)
                this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
            if (blnAccountNumber)
                this.search.set('AccountNumber', this.uiForm.controls['AccountNumber'].value);
            if (blnProductCode)
                this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
            this.search.set('Function', 'GetDescriptions');
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search).subscribe(function (data) {
                try {
                    if (data['errorMessage']) {
                        _this.messageModal.show({ msg: data['errorMessage'], title: _this.pageTitle }, false);
                        if (frmCode === 'a' || frmCode === 'c')
                            _this.cbbService.disableComponent(false);
                    }
                    else {
                        if (data.ContractName)
                            _this.uiForm.controls['ContractName'].setValue(data.ContractName);
                        if (data.AccountName)
                            _this.uiForm.controls['AccountName'].setValue(data.AccountName);
                        if (data.PremiseName)
                            _this.uiForm.controls['PremiseName'].setValue(data.PremiseName);
                        if (data.ProductDesc)
                            _this.uiForm.controls['ProductDesc'].setValue(data.ProductDesc);
                        if (data.AccountNumber)
                            _this.uiForm.controls['AccountNumber'].setValue(data.AccountNumber);
                        if (frmCode === 'a' || frmCode === 'c')
                            _this.cbbService.disableComponent(true);
                    }
                }
                catch (error) {
                    _this.logger.warn(error);
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
        else {
            return;
        }
    };
    ServiceCoverAPIGridComponent.prototype.assignAllOnclick = function () {
        this.promptConfirmContent = MessageConstant.Message.assignAllApicodeConfirm;
        this.promptConfirmModalAll.show();
    };
    ServiceCoverAPIGridComponent.prototype.clearAllOnclick = function () {
        this.promptConfirmContent = MessageConstant.Message.assignClearAllApicodeConfirm;
        this.promptConfirmModalClear.show();
    };
    ServiceCoverAPIGridComponent.prototype.promptConfirmAll = function () {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set('AccountNumber', this.uiForm.controls['AccountNumber'].value);
        this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
        this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
        this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
        this.search.set('APICode', this.uiForm.controls['APICode'].value);
        this.search.set('Function', 'AssignAll');
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search).subscribe(function (data) {
            try {
                if (data['errorMessage']) {
                    _this.messageModal.show({ msg: data['errorMessage'], title: _this.pageTitle }, false);
                }
                else {
                    _this.pageParams.blnForceRefresh = true;
                    _this.currentPage = 1;
                    _this.buildGrid();
                }
            }
            catch (error) {
                _this.logger.warn(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverAPIGridComponent.prototype.promptConfirmClear = function () {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set('AccountNumber', this.uiForm.controls['AccountNumber'].value);
        this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
        this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
        this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
        this.search.set('Function', 'ClearAll');
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search).subscribe(function (data) {
            try {
                if (data['errorMessage']) {
                    _this.messageModal.show({ msg: data['errorMessage'], title: _this.pageTitle }, false);
                }
                else {
                    _this.pageParams.blnForceRefresh = true;
                    _this.currentPage = 1;
                    _this.buildGrid();
                }
            }
            catch (error) {
                _this.logger.warn(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverAPIGridComponent.prototype.getCurrentPage = function (currentPage) {
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.buildGrid();
    };
    ServiceCoverAPIGridComponent.prototype.refresh = function () {
        this.currentPage = 1;
        this.buildGrid();
    };
    ServiceCoverAPIGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.initData();
    };
    ServiceCoverAPIGridComponent.prototype.onAPICodeSearchReceived = function (data) {
        if (data.APICode === 'All') {
            this.uiForm.controls['APICode'].setValue('');
        }
        else {
            this.uiForm.controls['APICode'].setValue(data.APICode);
        }
        this.isDisabledAssignAll = true;
        this.activateButtons();
    };
    ServiceCoverAPIGridComponent.prototype.ngOnDestroy = function () {
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
        if (this.userDataSubscription)
            this.userDataSubscription.unsubscribe();
        _super.prototype.ngOnDestroy.call(this);
    };
    ServiceCoverAPIGridComponent.prototype.onPremiseSearchDataReceived = function (eventObj, flag) {
        this.uiForm.controls['PremiseNumber'].setValue(eventObj.PremiseNumber);
        this.uiForm.controls['PremiseName'].setValue(eventObj.PremiseName);
        this.inputParamsServiceCover.PremiseNumber = this.uiForm.controls['PremiseNumber'].value;
        this.productCodeSearchEllipsis.updateComponent();
    };
    ServiceCoverAPIGridComponent.prototype.serviceCoverSearchDataReceived = function (data) {
        this.uiForm.controls['ProductCode'].setValue(data.row.ProductCode);
        this.uiForm.controls['ProductDesc'].setValue(data.row.ProductDesc);
    };
    ServiceCoverAPIGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverAPIGrid.html'
                },] },
    ];
    ServiceCoverAPIGridComponent.ctorParameters = [
        { type: Injector, },
        { type: Router, },
        { type: ElementRef, },
    ];
    ServiceCoverAPIGridComponent.propDecorators = {
        'serviceCoverAPIGrid': [{ type: ViewChild, args: ['serviceCoverAPIGrid',] },],
        'serviceCoverAPIPagination': [{ type: ViewChild, args: ['serviceCoverAPIPagination',] },],
        'apiCodeDropDown': [{ type: ViewChild, args: ['apiCodeDropDown',] },],
        'promptConfirmModalAll': [{ type: ViewChild, args: ['promptConfirmModalAll',] },],
        'promptConfirmModalClear': [{ type: ViewChild, args: ['promptConfirmModalClear',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'contractSearchEllipsis': [{ type: ViewChild, args: ['contractSearchEllipsis',] },],
        'premiseSearchEllipsis': [{ type: ViewChild, args: ['premiseSearchEllipsis',] },],
        'productCodeSearchEllipsis': [{ type: ViewChild, args: ['productCodeSearchEllipsis',] },],
    };
    return ServiceCoverAPIGridComponent;
}(BaseComponent));
