var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MessageConstant } from '../../../shared/constants/message.constant';
import { PageIdentifier } from '../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, ViewChild, EventEmitter, Injector } from '@angular/core';
import { EmployeeSearchComponent } from './../search/iCABSBEmployeeSearch';
import { PremiseSearchComponent } from './../search/iCABSAPremiseSearch';
import { ContractSearchComponent } from './../search/iCABSAContractSearch';
import { URLSearchParams } from '@angular/http';
export var AccountOwnerMaintenanceComponent = (function (_super) {
    __extends(AccountOwnerMaintenanceComponent, _super);
    function AccountOwnerMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.dtNextReviewDate = null;
        this.showMessageHeader = true;
        this.setFocusEmployeeCode = new EventEmitter();
        this.setFocusContractNumber = new EventEmitter();
        this.storedFieldData = new Object();
        this.headerParams = {
            method: 'contract-management/maintenance',
            module: 'account',
            operation: 'Application/iCABSAAccountOwnerMaintenance'
        };
        this.ellipsisConfig = {
            contract: {
                disabled: true,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'LookUp',
                showAddNew: false,
                component: ContractSearchComponent,
                currentContractType: 'C'
            },
            premise: {
                disabled: true,
                showCloseButton: true,
                showHeader: true,
                showAddNew: false,
                parentMode: 'LookUp',
                ContractNumber: '',
                ContractName: '',
                component: PremiseSearchComponent,
                currentContractTypeURLParameter: '<contract>'
            },
            employee: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'LookUp',
                showAddNew: false,
                component: EmployeeSearchComponent
            }
        };
        this.controls = [
            { name: 'AccountReviewPortfolioOwnerID', required: true },
            { name: 'AccountNumber', required: true },
            { name: 'AccountName' },
            { name: 'ContractNumber' },
            { name: 'ContractName' },
            { name: 'PremiseNumber' },
            { name: 'PremiseName' },
            { name: 'EmployeeCode', required: true },
            { name: 'EmployeeSurname' },
            { name: 'ReviewCycleMonths', required: true },
            { name: 'AccountReviewNotes' },
            { name: 'SuspendReviewInd' },
            { name: 'NumberReviews' },
            { name: 'FirstReview' },
            { name: 'LastReview' },
            { name: 'NextReviewDate' }
        ];
        this.pageId = PageIdentifier.ICABSAACCOUNTOWNERMAINTENANCE;
    }
    ;
    AccountOwnerMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.getInitialDefaults();
    };
    AccountOwnerMaintenanceComponent.prototype.getInitialDefaults = function () {
        this.accountPortfolioOwnerID = this.riExchange.getParentHTMLValue('SelectedOwner');
        this.parentAccountNumber = this.riExchange.getParentHTMLValue('AccountNumber');
        this.parentAccountName = this.riExchange.getParentHTMLValue('AccountName');
        if (this.parentMode === 'add') {
            this.riMaintenance_BeforeAdd();
        }
        else if (this.parentMode === 'update') {
            this.fetchRecord();
        }
        this.ellipsisConfig.contract['accountNumber'] = this.getControlValue('AccountNumber');
        this.ellipsisConfig.contract['accountName'] = this.getControlValue('AccountName');
        this.routeAwayGlobals.setSaveEnabledFlag(true);
        this.enableDisableFields();
    };
    AccountOwnerMaintenanceComponent.prototype.fetchRecord = function () {
        var _this = this;
        var fetchSearchParams = new URLSearchParams();
        fetchSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        fetchSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        fetchSearchParams.set(this.serviceConstants.Action, '0');
        fetchSearchParams.set('accountReviewPortfolioOwnerID', this.accountPortfolioOwnerID);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, fetchSearchParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.messageModal.show(data, true);
                return;
            }
            _this.setControlValue('AccountReviewPortfolioOwnerID', data.AccountReviewPortfolioOwnerID);
            _this.setControlValue('AccountNumber', data.AccountNumber);
            _this.setControlValue('AccountName', data.AccountName);
            _this.setControlValue('ContractNumber', data.ContractNumber);
            _this.setControlValue('ContractName', data.ContractName);
            _this.setControlValue('PremiseNumber', data.PremiseNumber);
            _this.setControlValue('PremiseName', data.PremiseName);
            _this.setControlValue('FirstReview', data.FirstReview);
            _this.setControlValue('LastReview', data.LastReview);
            _this.setControlValue('EmployeeCode', data.EmployeeCode);
            _this.setControlValue('EmployeeSurname', data.EmployeeSurname);
            _this.setControlValue('ReviewCycleMonths', data.ReviewCycleMonths);
            _this.setControlValue('NextReviewDate', data.NextReviewDate);
            if (data.NextReviewDate) {
                _this.dtNextReviewDate = _this.utils.convertDate(data.NextReviewDate);
            }
            _this.setControlValue('SuspendReviewInd', _this.utils.convertResponseValueToCheckboxInput(data.SuspendReviewInd));
            _this.setControlValue('AccountReviewNotes', data.AccountReviewNotes);
            _this.setControlValue('NumberReviews', data.NumberReviews);
            _this.storeFieldData();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    AccountOwnerMaintenanceComponent.prototype.updateDatePickerValue = function (value) {
        if (value && value.value) {
            this.datepicker.resetDateField();
            this.setControlValue('NextReviewDate', value.value);
            if (!this.getControlValue('NextReviewDate')) {
                this.dtNextReviewDate = null;
            }
            else {
                this.dtNextReviewDate = this.utils.convertDate(this.getControlValue('NextReviewDate'));
            }
        }
    };
    AccountOwnerMaintenanceComponent.prototype.enableDisableFields = function () {
        var _this = this;
        this.ellipsisConfig.employee.disabled = false;
        this.riExchange.riInputElement.Enable(this.uiForm, 'EmployeeCode');
        this.riExchange.riInputElement.Enable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Enable(this.uiForm, 'ReviewCycleMonths');
        this.riExchange.riInputElement.Enable(this.uiForm, 'AccountReviewNotes');
        this.riExchange.riInputElement.Enable(this.uiForm, 'SuspendReviewInd');
        if (this.parentMode === 'update') {
            this.setFocusEmployeeCode.emit(true);
            this.ellipsisConfig.contract.disabled = true;
            this.ellipsisConfig.premise.disabled = true;
            this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
        }
        else if (this.parentMode === 'add') {
            this.ellipsisConfig.contract.disabled = false;
            this.ellipsisConfig.premise.disabled = false;
            this.ellipsisConfig.employee.disabled = false;
            this.riExchange.riInputElement.Enable(this.uiForm, 'ContractNumber');
            this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseNumber');
            setTimeout(function () {
                _this.setFocusContractNumber.emit(true);
            }, 0);
        }
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'EmployeeSurname');
        this.riExchange.riInputElement.Disable(this.uiForm, 'NumberReviews');
        this.riExchange.riInputElement.Disable(this.uiForm, 'FirstReview');
        this.riExchange.riInputElement.Disable(this.uiForm, 'LastReview');
    };
    AccountOwnerMaintenanceComponent.prototype.riMaintenance_BeforeAdd = function () {
        var _this = this;
        this.setControlValue('AccountReviewPortfolioOwnerID', '1');
        this.setControlValue('AccountNumber', this.parentAccountNumber);
        this.setControlValue('AccountName', this.parentAccountName);
        this.setControlValue('ReviewCycleMonths', '12');
        this.setControlValue('NumberReviews', '0');
        this.setControlValue('FirstReview', '');
        this.setControlValue('LastReview', '');
        this.dtNextReviewDate = null;
        var fetchSearchParams = new URLSearchParams();
        fetchSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        fetchSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        fetchSearchParams.set(this.serviceConstants.Action, '8');
        fetchSearchParams.set('AccountNumber', this.getControlValue('AccountNumber'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, fetchSearchParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.messageModal.show(data, true);
                return;
            }
            _this.setControlValue('EmployeeCode', data.EmployeeCode);
            _this.setControlValue('EmployeeSurname', data.EmployeeSurname);
            _this.setControlValue('ReviewCycleMonths', data.ReviewCycleMonths);
            _this.setControlValue('AccountReviewPortfolioOwnerID', data.AccountReviewPortfolioOwnerID);
            _this.storeFieldData();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    AccountOwnerMaintenanceComponent.prototype.btnDelete_onClick = function () {
        if (this.getControlValue('AccountReviewPortfolioOwnerID') === '1') {
            var data = {};
            data['errorMessage'] = 'No record selected';
            this.messageModal.show(data, true);
            return;
        }
        else {
            this.promptTitle = MessageConstant.Message.DeleteRecord;
        }
        this.promptModal.show();
    };
    AccountOwnerMaintenanceComponent.prototype.promptSave = function (event) {
        var _this = this;
        var deleteSearchParams = new URLSearchParams();
        deleteSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        deleteSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        deleteSearchParams.set(this.serviceConstants.Action, '3');
        var bodyParams = {};
        bodyParams['AccountReviewPortfolioOwnerID'] = this.getControlValue('AccountReviewPortfolioOwnerID');
        bodyParams['table'] = 'AccountReviewPortfolioOwner';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, deleteSearchParams, bodyParams).subscribe(function (data) {
            if (data.errorMessage) {
                _this.messageModal.show(data, true);
                return;
            }
            _this.clearFields();
            _this.parentMode = 'add';
            _this.getInitialDefaults();
            _this.routeAwayGlobals.setSaveEnabledFlag(false);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    AccountOwnerMaintenanceComponent.prototype.clearFields = function () {
        this.dtNextReviewDate = null;
        this.uiForm.reset();
    };
    AccountOwnerMaintenanceComponent.prototype.storeFieldData = function () {
        this.storedFieldData = {};
        this.storedFieldData['AccountReviewPortfolioOwnerID'] = this.getControlValue('AccountReviewPortfolioOwnerID');
        this.storedFieldData['AccountNumber'] = this.getControlValue('AccountNumber');
        this.storedFieldData['AccountName'] = this.getControlValue('AccountName');
        this.storedFieldData['ContractNumber'] = this.getControlValue('ContractNumber');
        this.storedFieldData['ContractName'] = this.getControlValue('ContractName');
        this.storedFieldData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        this.storedFieldData['PremiseName'] = this.getControlValue('PremiseName');
        this.storedFieldData['FirstReview'] = this.getControlValue('FirstReview');
        this.storedFieldData['LastReview'] = this.getControlValue('LastReview');
        this.storedFieldData['EmployeeCode'] = this.getControlValue('EmployeeCode');
        this.storedFieldData['EmployeeSurname'] = this.getControlValue('EmployeeSurname');
        this.storedFieldData['ReviewCycleMonths'] = this.getControlValue('ReviewCycleMonths');
        this.storedFieldData['NextReviewDate'] = this.getControlValue('NextReviewDate');
        this.storedFieldData['SuspendReviewInd'] = this.getControlValue('SuspendReviewInd');
        this.storedFieldData['AccountReviewNotes'] = this.getControlValue('AccountReviewNotes');
        this.storedFieldData['NumberReviews'] = this.getControlValue('NumberReviews');
    };
    AccountOwnerMaintenanceComponent.prototype.restoreFieldData = function () {
        this.setControlValue('AccountReviewPortfolioOwnerID', this.storedFieldData['AccountReviewPortfolioOwnerID']);
        this.setControlValue('AccountNumber', this.storedFieldData['AccountNumber']);
        this.setControlValue('AccountName', this.storedFieldData['AccountName']);
        this.setControlValue('ContractNumber', this.storedFieldData['ContractNumber']);
        this.setControlValue('ContractName', this.storedFieldData['ContractName']);
        this.setControlValue('PremiseNumber', this.storedFieldData['PremiseNumber']);
        this.setControlValue('PremiseName', this.storedFieldData['PremiseName']);
        this.setControlValue('FirstReview', this.storedFieldData['FirstReview']);
        this.setControlValue('LastReview', this.storedFieldData['LastReview']);
        this.setControlValue('EmployeeCode', this.storedFieldData['EmployeeCode']);
        this.setControlValue('EmployeeSurname', this.storedFieldData['EmployeeSurname']);
        this.setControlValue('ReviewCycleMonths', this.storedFieldData['ReviewCycleMonths']);
        this.setControlValue('SuspendReviewInd', this.storedFieldData['SuspendReviewInd']);
        this.setControlValue('AccountReviewNotes', this.storedFieldData['AccountReviewNotes']);
        this.setControlValue('NumberReviews', this.storedFieldData['NumberReviews']);
        if (this.storedFieldData['NextReviewDate'] && this.parentMode === 'update') {
            this.setControlValue('NextReviewDate', this.storedFieldData['NextReviewDate']);
            this.dtNextReviewDate = this.utils.convertDate(this.getControlValue('NextReviewDate'));
        }
    };
    AccountOwnerMaintenanceComponent.prototype.onSubmit = function () {
        var _this = this;
        var employeeCode_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'EmployeeCode');
        var reviewCycleMonths_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'ReviewCycleMonths');
        var isDateValid = window['moment'](this.getControlValue('NextReviewDate'), 'DD/MM/YYYY', true).isValid();
        if (employeeCode_hasError || reviewCycleMonths_hasError || !isDateValid) {
            if (!isDateValid) {
                this.datepicker.validateDateField();
            }
            return;
        }
        var updateSearchParams = new URLSearchParams();
        updateSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        updateSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        if (this.parentMode === 'add') {
            updateSearchParams.set(this.serviceConstants.Action, '1');
        }
        else {
            updateSearchParams.set(this.serviceConstants.Action, '2');
        }
        var bodyParams = {};
        bodyParams['AccountReviewPortfolioOwnerID'] = this.getControlValue('AccountReviewPortfolioOwnerID');
        bodyParams['AccountNumber'] = this.getControlValue('AccountNumber');
        bodyParams['AccountName'] = this.getControlValue('AccountName');
        if (this.parentMode === 'add') {
            bodyParams['ContractNumber'] = this.getControlValue('ContractNumber') ? this.getControlValue('ContractNumber') : '';
            bodyParams['ContractName'] = this.getControlValue('ContractName') ? this.getControlValue('ContractName') : '';
            bodyParams['PremiseNumber'] = this.getControlValue('PremiseNumber') ? this.getControlValue('PremiseNumber') : '';
            bodyParams['PremiseName'] = this.getControlValue('PremiseName') ? this.getControlValue('PremiseName') : '';
        }
        bodyParams['EmployeeCode'] = this.getControlValue('EmployeeCode');
        bodyParams['EmployeeSurname'] = this.getControlValue('EmployeeSurname');
        bodyParams['ReviewCycleMonths'] = this.getControlValue('ReviewCycleMonths');
        bodyParams['NextReviewDate'] = this.getControlValue('NextReviewDate');
        bodyParams['SuspendReviewInd'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('SuspendReviewInd') ? this.getControlValue('SuspendReviewInd') : '');
        bodyParams['AccountReviewNotes'] = this.getControlValue('AccountReviewNotes') ? this.getControlValue('AccountReviewNotes') : '';
        bodyParams['NumberReviews'] = this.getControlValue('NumberReviews');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, updateSearchParams, bodyParams).subscribe(function (data) {
            if (data.errorMessage) {
                _this.messageModal.show(data, true);
            }
            else {
                var info = {
                    title: 'Message',
                    msg: MessageConstant.Message.SavedSuccessfully
                };
                _this.messageModal.show(info, false);
                _this.parentMode = 'update';
                _this.setControlValue('AccountReviewPortfolioOwnerID', data.AccountReviewPortfolioOwnerID);
                _this.storeFieldData();
                _this.enableDisableFields();
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    AccountOwnerMaintenanceComponent.prototype.inputField_OnChange = function (e, name) {
        if (e.type === 'blur') {
            var updateValue = void 0;
            if (name === 'Contract' && e.target.value.length > 0) {
                updateValue = this.utils.numberPadding(e.target.value, 8);
                this.setControlValue('ContractNumber', updateValue);
                this.ellipsisConfig.premise.ContractNumber = updateValue;
            }
        }
        else {
            if (name === 'Contract') {
                this.setControlValue('ContractNumber', e.ContractNumber);
                this.setControlValue('ContractName', e.ContractName);
                this.ellipsisConfig.premise.ContractNumber = e.ContractNumber;
                this.ellipsisConfig.premise.ContractName = e.ContractName;
            }
            else if (name === 'Premise') {
                this.setControlValue('PremiseNumber', e.PremiseNumber);
                this.setControlValue('PremiseName', e.PremiseName);
            }
            else if (name === 'Employee') {
                this.setControlValue('EmployeeCode', e.EmployeeCode);
                this.setControlValue('EmployeeSurname', e.EmployeeSurname);
            }
        }
    };
    AccountOwnerMaintenanceComponent.prototype.onAbandon = function () {
        if (this.parentMode === 'add') {
            this.clearFields();
        }
        this.restoreFieldData();
    };
    AccountOwnerMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        this.routeAwayGlobals.resetRouteAwayFlags();
    };
    AccountOwnerMaintenanceComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    AccountOwnerMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAAccountOwnerMaintenance.html'
                },] },
    ];
    AccountOwnerMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    AccountOwnerMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
        'datepicker': [{ type: ViewChild, args: ['datepicker',] },],
    };
    return AccountOwnerMaintenanceComponent;
}(BaseComponent));
