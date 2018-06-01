var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MessageConstant } from './../../../shared/constants/message.constant';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { URLSearchParams } from '@angular/http';
export var ChangeEmployeeNumberComponent = (function (_super) {
    __extends(ChangeEmployeeNumberComponent, _super);
    function ChangeEmployeeNumberComponent(injector) {
        _super.call(this, injector);
        this.queryParams = {
            operation: 'Application/iCABSAChangeEmployeeNumber',
            module: 'employee',
            method: 'people/maintenance',
            ActionSearch: '0',
            Actionupdate: '6',
            ActionEdit: '2',
            ActionDelete: '3',
            ActionInsert: '1'
        };
        this.controls = [
            { name: 'EmployeeCode', readonly: false, disabled: false, required: true },
            { name: 'EmployeeSurname', readonly: true, disabled: true, required: false },
            { name: 'NewEmployeeCode', readonly: true, disabled: false, required: false },
            { name: 'BranchNumber', readonly: true, disabled: true, required: false },
            { name: 'MoveType', readonly: true, disabled: false, required: false, value: 'ChangeBranch' },
            { name: 'NewBranchNumber' },
            { name: 'NewBranchName' }
        ];
        this.pageId = '';
        this.cmdSubmit = false;
        this.isShowNewEmpNum = false;
        this.isShowNewBranch = true;
        this.showHeader = true;
        this.showCloseButton = true;
        this.modalTitle = '';
        this.showErrorHeader = true;
        this.selectNewBranchDisable = true;
        this.selectReportDestinationDisable = true;
        this.btnSaveDisable = true;
        this.btnCancelDisable = true;
        this.newEmployeeNumberEllipsisDisable = true;
        this.dataSaved = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.moveTypeVal = 'ChangeBranch';
        this.reportDestinationVal = 'ReportViewer';
        this.empSearchComponent = EmployeeSearchComponent;
        this.isShowBatchSubmitted = false;
        this.showPromptHeader = true;
        this.inputParams = { 'parentMode': 'NewBranch' };
        this.inputParamsEmployeeSearch = {
            'parentMode': 'Search'
        };
        this.inputParamsNewEmployeeSearch = {
            'parentMode': 'Lookup-NewEmployee'
        };
        this.pageId = PageIdentifier.ICABSACHANGEEMPLOYEENUMBER;
    }
    ChangeEmployeeNumberComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.windowOnLoad();
    };
    ChangeEmployeeNumberComponent.prototype.ngAfterViewInit = function () {
        this.autoOpenSearch = true;
    };
    ChangeEmployeeNumberComponent.prototype.windowOnLoad = function () {
        this.cmdSubmit = true;
        this.disableControl('NewEmployeeCode', true);
        this.setMandatoryFields();
    };
    ChangeEmployeeNumberComponent.prototype.onEmployeeDataReturn = function (data) {
        this.employeeCode = data.EmployeeCode;
        this.setControlValue('EmployeeCode', data.EmployeeCode ? data.EmployeeCode : '');
        this.setControlValue('EmployeeSurname', data.fullObject.EmployeeSurname ? data.fullObject.EmployeeSurname : '');
        this.setControlValue('BranchNumber', data.fullObject.BranchNumber ? data.fullObject.BranchNumber : '');
        this.RowID = data.fullObject.ttEmployee;
        this.selectNewBranchDisable = false;
        this.selectReportDestinationDisable = false;
        this.btnSaveDisable = false;
        this.btnCancelDisable = false;
        this.newEmployeeNumberEllipsisDisable = false;
        this.disableControl('NewEmployeeCode', false);
        this.setFormMode(this.c_s_MODE_UPDATE);
    };
    ChangeEmployeeNumberComponent.prototype.onNewEmployeeDataReturn = function (data) {
        this.setControlValue('NewEmployeeCode', data.NewEmployeeCode);
        this.newEmployeeCode = data.NewEmployeeCode;
        this.newEmployeeCodeOnChange();
    };
    ChangeEmployeeNumberComponent.prototype.lookUpCall = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'EmployeeCode': this.getControlValue('EmployeeCode')
                },
                'fields': ['EmployeeSurname', 'BranchNumber', 'RowID']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data[0].length !== 0) {
                _this.selectNewBranchDisable = false;
                _this.selectReportDestinationDisable = false;
                _this.btnSaveDisable = false;
                _this.btnCancelDisable = false;
                _this.newEmployeeNumberEllipsisDisable = false;
                _this.disableControl('NewEmployeeCode', false);
                _this.setControlValue('BranchNumber', data[0][0].BranchNumber ? data[0][0].BranchNumber : _this.utils.getBranchCode());
                _this.setControlValue('EmployeeSurname', data[0][0].EmployeeSurname ? data[0][0].EmployeeSurname : '');
                _this.RowID = data[0][0].ttEmployee;
                _this.setFormMode(_this.c_s_MODE_UPDATE);
            }
            else {
                _this.selectNewBranchDisable = true;
                _this.selectReportDestinationDisable = true;
                _this.btnSaveDisable = true;
                _this.btnCancelDisable = true;
                _this.newEmployeeNumberEllipsisDisable = true;
                _this.disableControl('NewEmployeeCode', false);
                _this.messageModal.show({ msg: MessageConstant.Message.RecordNotFound, title: _this.pageTitle }, false);
            }
        });
    };
    ChangeEmployeeNumberComponent.prototype.onBranchDataReceived = function (obj) {
        this.BranchSearch = obj.BranchNumber;
        this.setControlValue('NewBranchNumber', this.BranchSearch);
        this.setControlValue('NewBranchName', obj.BranchName);
        this.newBranchNumberOnChange();
    };
    ChangeEmployeeNumberComponent.prototype.employeeCodeOnChange = function (employee) {
        this.employeeCode = employee;
        if (employee) {
            this.setControlValue('EmployeeSurname', '');
            this.setControlValue('BranchNumber', '');
            this.lookUpCall();
        }
    };
    ChangeEmployeeNumberComponent.prototype.newEmployeeCodeOnChange = function () {
        var newEmployeeCode = this.getControlValue('NewEmployeeCode');
        if ((this.moveTypeVal === 'CorrectNumber') && (newEmployeeCode !== '')) {
            this.cmdSubmit = false;
        }
        else {
            this.cmdSubmit = true;
        }
        this.lookUpCall();
    };
    ChangeEmployeeNumberComponent.prototype.newBranchNumberOnChange = function () {
        var newbranchnumber = this.getControlValue('NewBranchNumber');
        if ((this.moveTypeVal === 'ChangeBranch') && (newbranchnumber !== '')) {
            this.cmdSubmit = false;
        }
        this.lookUpCall();
    };
    ChangeEmployeeNumberComponent.prototype.riMaintenanceAfterAbandon = function () {
        if (this.dataSaved) {
            if (this.moveTypeVal === 'ChangeBranch') {
                this.mode = 'UPDATE';
                this.newBranchNumberSearch.active = {
                    id: this.formData.NewBranchNumber,
                    text: this.formData.NewBranchNumber + ' - ' + this.formData.NewBranchName
                };
            }
            else {
                this.mode = 'UPDATE';
                this.setControlValue('NewEmployeeCode', this.formData.NewEmployeeCode);
            }
        }
        else {
            this.uiForm.controls['NewEmployeeCode'].markAsUntouched();
            this.setControlValue('NewEmployeeCode', '');
            this.setControlValue('NewBranchNumber', '');
            this.setControlValue('NewBranchName', '');
            this.cmdSubmit = true;
            this.newBranchNumberSearch.active = {
                id: '',
                text: ''
            };
        }
    };
    ChangeEmployeeNumberComponent.prototype.setMandatoryFields = function () {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EmployeeCode', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BranchNumber', true);
    };
    ChangeEmployeeNumberComponent.prototype.moveTypeOnChange = function (move_type_val) {
        this.cmdSubmit = true;
        this.moveTypeVal = move_type_val;
        switch (move_type_val) {
            case 'ChangeBranch':
                this.isShowNewEmpNum = false;
                this.isShowNewBranch = true;
                this.serviceBranchRequired = true;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'NewEmployeeCode', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'NewBranchNumber', true);
                break;
            case 'CorrectNumber':
                this.isShowNewEmpNum = true;
                this.isShowNewBranch = false;
                this.serviceBranchRequired = false;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'NewEmployeeCode', true);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'NewBranchNumber', false);
                break;
            default:
                this.isShowNewEmpNum = false;
                this.isShowNewBranch = false;
        }
    };
    ChangeEmployeeNumberComponent.prototype.reportDestinationOnChange = function (report_dest_val) {
        this.reportDestinationVal = report_dest_val;
        if (this.reportDestinationVal === 'ReportViewer')
            this.newBranchNumberOnChange();
        else
            this.newEmployeeCodeOnChange();
    };
    ChangeEmployeeNumberComponent.prototype.saveData = function () {
        var EmployeeCode_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'EmployeeCode');
        var NewBranchNumber_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'NewBranchNumber');
        var NewEmployeeCode_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'NewEmployeeCode');
        if (this.moveTypeVal === 'CorrectNumber') {
            if (this.riExchange.validateForm(this.uiForm)) {
                this.promptTitle = MessageConstant.Message.ConfirmRecord;
                this.promptModal.show();
            }
        }
        else if (this.moveTypeVal === 'ChangeBranch') {
            if (this.riExchange.validateForm(this.uiForm) && (this.getControlValue('NewBranchNumber') !== '')) {
                this.promptTitle = MessageConstant.Message.ConfirmRecord;
                this.promptModal.show();
            }
            else {
                this.newBranchNumberSearch.branchsearchDropDown.isError = true;
                this.uiForm.controls['NewEmployeeCode'].markAsUntouched();
            }
        }
    };
    ChangeEmployeeNumberComponent.prototype.promptSave = function () {
        var _this = this;
        var searchparams = this.getURLSearchParamObject();
        searchparams.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
        var saveData = {};
        saveData['EmployeeCode'] = this.getControlValue('EmployeeCode');
        saveData['EmployeeSurname'] = this.getControlValue('EmployeeSurname');
        saveData['BranchNumber'] = this.getControlValue('BranchNumber');
        saveData['ROWID'] = this.RowID;
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchparams, saveData)
            .subscribe(function (data) {
            if (data['status'] === 'failure') {
                _this.errorService.emitError(data['oResponse']);
            }
            else {
                if (data.errorMessage) {
                    _this.messageContent = data.errorMessage;
                    _this.messageModal.show();
                }
                else {
                    _this.dataSaved = true;
                    _this.messageContent = MessageConstant.Message.RecordSavedSuccessfully;
                    _this.messageModal.show();
                    _this.formData.EmployeeCode = data.EmployeeCode;
                    _this.formData.BranchNumber = data.BranchNumber;
                    _this.formData.EmployeeSurname = data.EmployeeSurname;
                    _this.formData.NewBranchNumber = _this.getControlValue('NewBranchNumber');
                    _this.formData.NewBranchName = _this.getControlValue('NewBranchName');
                    _this.formData.NewEmployeeCode = _this.getControlValue('NewEmployeeCode');
                }
            }
        }, function (error) {
            _this.errorModal.show(error, true);
        });
    };
    ChangeEmployeeNumberComponent.prototype.submitReportRequest = function () {
        var _this = this;
        if (this.moveTypeVal === 'ChangeBranch') {
            var paramaterValue = this.moveTypeVal + '' + this.businessCode() + '' + this.getControlValue('EmployeeCode') + '' + this.getControlValue('BranchNumber') + '' + this.getControlValue('NewBranchNumber') + '' + '' + 'batch|ReportID';
            var date = new Date();
            var startDate = this.utils.formatDate(date);
            var starttime = Math.round(date.getTime() / (1000 * 60 * 60));
            this.ajaxSource.next(this.ajaxconstant.START);
            var searchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            searchParams.set(this.serviceConstants.Action, '5');
            var bodyParams = {};
            bodyParams['Description'] = 'Employee Change';
            bodyParams['ProgramName'] = 'iCABSEmployeeChange.p';
            bodyParams['StartDate'] = startDate;
            bodyParams['StartTime'] = starttime;
            bodyParams['Report'] = 'Batch';
            bodyParams['ParameterName'] = 'ModeBusinessCodeEmployeeCodeBranchNumberNewBranchNumberNewEmployeeCodeRepManDest';
            bodyParams['ParameterValue'] = paramaterValue;
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams).subscribe(function (data) {
                _this.isShowBatchSubmitted = true;
                _this.batchSubmittedText = data.fullError;
            }, function (error) {
                _this.errorModal.show(error, true);
            });
        }
        else {
            var paramaterValue = this.moveTypeVal + '' + this.businessCode() + '' + this.getControlValue('EmployeeCode') + '' + this.getControlValue('BranchNumber') + '' + '' + this.getControlValue('NewEmployeeCode') + '' + 'batch|ReportID';
            var date = new Date();
            var startDate = this.utils.formatDate(date);
            var starttime = Math.round(date.getTime() / (1000 * 60 * 60));
            this.ajaxSource.next(this.ajaxconstant.START);
            var searchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            searchParams.set(this.serviceConstants.Action, '5');
            var bodyParams = {};
            bodyParams['Description'] = 'Employee Change';
            bodyParams['ProgramName'] = 'iCABSEmployeeChange.p';
            bodyParams['StartDate'] = startDate;
            bodyParams['StartTime'] = starttime;
            bodyParams['Report'] = 'Batch';
            bodyParams['ParameterName'] = 'ModeBusinessCodeEmployeeCodeBranchNumberNewBranchNumberNewEmployeeCodeRepManDest';
            bodyParams['ParameterValue'] = paramaterValue;
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams).subscribe(function (data) {
                _this.isShowBatchSubmitted = true;
                _this.batchSubmittedText = data.fullError;
            }, function (error) {
                _this.errorModal.show(error, true);
            });
        }
    };
    ChangeEmployeeNumberComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAChangeEmployeeNumber.html'
                },] },
    ];
    ChangeEmployeeNumberComponent.ctorParameters = [
        { type: Injector, },
    ];
    ChangeEmployeeNumberComponent.propDecorators = {
        'newBranchNumberSearch': [{ type: ViewChild, args: ['newBranchNumberSearch',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
    };
    return ChangeEmployeeNumberComponent;
}(BaseComponent));
