var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { StaticUtils } from './../../../shared/services/static.utility';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { PostCodeSearchComponent } from './../../internal/search/iCABSBPostcodeSearch.component';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ErrorService } from '../../../shared/services/error.service';
export var PostcodeMoveBranchComponent = (function (_super) {
    __extends(PostcodeMoveBranchComponent, _super);
    function PostcodeMoveBranchComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [];
        this.sysCharParams = {};
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.ellipsisParams = {
            showCloseButton: true,
            showHeader: true,
            contractSearchParams: {
                parentMode: 'LookUp',
                currentContractType: 'C'
            },
            premiseSearchParams: {
                parentMode: 'LookUp'
            },
            postcodeSearchParams: {
                parentMode: 'Premise'
            },
            commisssionEmployeeSearchParams: {
                parentMode: 'LookUp-Commission'
            },
            newCommisssionEmployeeSearchParams: {
                parentMode: 'LookUp-CommissionBranch-Employee'
            },
            newPremiseSalesEmployeeSearchParams: {
                parentMode: 'LookUp-PremiseBranch-Employee'
            },
            newContractSalesEmployeeSearchParams: {
                parentMode: 'LookUp-ContractBranch-Employee'
            }
        };
        this.showMessageHeader = true;
        this.elementShowHide = {
            serviceAreaCode: false,
            salesAreaCode: false,
            transferTurnover: true,
            isControlRequired: false
        };
        this.elementDisabled = {
            isPremisesDisabled: true,
            newServiceBranchNumber: true,
            isContractSalesEmployeeDisabled: true
        };
        this.formModes = {
            addMode: false,
            updateMode: true,
            selectMode: false
        };
        this.isRequesting = false;
        this.pageTitle = '';
        this.showHeader = false;
        this.showPromptMessageHeader = false;
        this.serviceParams = {
            method: 'contract-management/maintenance',
            module: 'contract-admin',
            operation: 'Application/iCABSAPostcodeMoveBranch'
        };
        this.pageData = {};
        this.pageId = PageIdentifier.ICABSAPOSTCODEMOVEBRANCH;
        this.contractSearchComponent = ContractSearchComponent;
        this.premiseSearchComponent = PremiseSearchComponent;
        this.postcodeSearchComponent = PostCodeSearchComponent;
        this.employeeSearchComponent = EmployeeSearchComponent;
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        this.controls = [
            { name: 'ContractNumber', required: true },
            { name: 'ContractName', readonly: true, disabled: true, required: false },
            { name: 'PremiseNumber', disabled: true, required: true },
            { name: 'PremiseName', readonly: true, disabled: true, required: false },
            { name: 'PremiseAddressLine1', disabled: true, required: false },
            { name: 'ServiceBranchNumber', disabled: true, required: false },
            { name: 'NewServiceBranchNumber', required: true },
            { name: 'PremiseAddressLine2', disabled: true, required: false },
            { name: 'PremiseSalesEmployee', readonly: true, disabled: true, required: false },
            { name: 'NewPremiseSalesEmployee', required: true },
            { name: 'PremiseAddressLine3', disabled: true, required: false },
            { name: 'Processas1', readonly: true, disabled: true },
            { name: 'PremiseAddressLine4', required: false },
            { name: 'Processas2', readonly: true, disabled: true },
            { name: 'PremiseAddressLine5', required: false },
            { name: 'CommissionEmployeeCode', required: true },
            { name: 'NewCommissionEmployeeCode', required: true },
            { name: 'PremisePostcode', required: true },
            { name: 'BranchSalesAreaCode', required: true },
            { name: 'BranchServiceAreaCode', required: true },
            { name: 'ContractAddressLine1', readonly: true, disabled: true },
            { name: 'MoveNegBranchYes', readonly: true, disabled: true },
            { name: 'MoveNegBranchNo', readonly: true, disabled: true },
            { name: 'ContractAddressLine2', readonly: true, disabled: true },
            { name: 'NegBranchNumber', disabled: true },
            { name: 'NewNegBranchNumber', required: true },
            { name: 'ContractAddressLine3', readonly: true, disabled: true },
            { name: 'ContractSalesEmployee', readonly: true, disabled: true },
            { name: 'NewContractSalesEmployee', required: true },
            { name: 'ContractAddressLine4', readonly: true, disabled: true },
            { name: 'ContractAddressLine5', readonly: true, disabled: true },
            { name: 'ContractPostcode', readonly: true, disabled: true },
            { name: 'TransferTurnover' },
            { name: 'ProcessType' },
            { name: 'PremisePostcodeDefaults' },
            { name: 'MoveNegBranch' }
        ];
    }
    PostcodeMoveBranchComponent.prototype.ngAfterViewInit = function () {
        this.infoModal.childModal.modalConfig = this.modalConfig;
        this.infoModal.childModal.show();
        this.toggleRequiredStatus('BranchSalesAreaCode', false);
        this.toggleRequiredStatus('BranchServiceAreaCode', false);
        this.setControlValue('PremisePostcodeDefaults', 'Default');
        this.toggleFormDisabledState(true, ['ContractNumber']);
        this.setMessageCallback(this);
        this.setErrorCallback(this);
        this.autoOpen = true;
    };
    PostcodeMoveBranchComponent.prototype.setFormModeUpdate = function () {
        this.setFormMode(this.c_s_MODE_UPDATE);
        this.fetchRecord();
        this.toggleFormDisabledState(false, ['ContractName', 'PremiseName', 'ContractSalesEmployee', 'NewContractSalesEmployee', 'NegBranchNumber', 'NewNegBranchNumber', 'ServiceBranchNumber', 'PremiseSalesEmployee',
            'ContractAddressLine1', 'ContractAddressLine2', 'ContractAddressLine3', 'ContractAddressLine4', 'ContractAddressLine5',
            'ContractPostcode', 'PremiseAddressLine1', 'PremiseAddressLine2', 'PremiseAddressLine3']);
        this.getSysChars();
    };
    PostcodeMoveBranchComponent.prototype.modifyControlStates = function () {
        var status1 = false;
        var status2 = true;
        this.toggleDisabled('Processas1', false);
        this.toggleDisabled('Processas2', false);
        this.toggleDisabled('MoveNegBranchNo', false);
        this.toggleDisabled('MoveNegBranchYes', false);
        this.setControlValue('Processas1', true);
        this.setControlValue('MoveNegBranch', 'No');
        this.setControlValue('MoveNegBranchYes', false);
        this.setControlValue('MoveNegBranchNo', true);
        if (this.getControlValue('PremisePostcodeDefaults') === 'Default') {
            status1 = true;
            status2 = false;
        }
        this.toggleDisabled('NewServiceBranchNumber', status1);
        this.toggleDisabled('NewPremiseSalesEmployee', status1);
        this.toggleRequiredStatus('BranchServiceAreaCode', status2);
        this.toggleRequiredStatus('BranchSalesAreaCode', status2);
        this.elementShowHide.serviceAreaCode = status2;
        this.elementShowHide.salesAreaCode = status2;
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BranchSalesAreaCode', status2);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BranchServiceAreaCode', status2);
        this.elementShowHide.isControlRequired = false;
        if (!this.sysCharParams['EnableValidatePostcodeSuburb'] && this.sysCharParams['EnablePostcodeSuburbLog']) {
            this.elementShowHide.isControlRequired = true;
        }
        this.toggleRequiredStatus('PremiseAddressLine4', this.sysCharParams['EnablePostcodeSuburbLog']);
        this.toggleRequiredStatus('PremiseAddressLine5', this.sysCharParams['EnablePostcodeSuburbLog']);
        this.toggleDisabled('PremiseAddressLine4', !this.sysCharParams['EnableValidatePostcodeSuburb']);
        this.toggleDisabled('PremiseAddressLine5', !this.sysCharParams['EnableValidatePostcodeSuburb']);
    };
    PostcodeMoveBranchComponent.prototype.toggleRequiredStatus = function (control, status) {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, control, status);
    };
    PostcodeMoveBranchComponent.prototype.toggleDisabled = function (control, disable) {
        if (disable) {
            this.riExchange.riInputElement.Disable(this.uiForm, control);
        }
        else {
            this.riExchange.riInputElement.Enable(this.uiForm, control);
        }
    };
    PostcodeMoveBranchComponent.prototype.createSysCharListForQuery = function () {
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableRecordingOfNegEmpMoves,
            this.sysCharConstants.SystemCharEnableValidatePostcodeSuburb];
        return sysCharList.join(',');
    };
    PostcodeMoveBranchComponent.prototype.getSysChars = function () {
        var _this = this;
        var sysCharURLParams = this.getURLSearchParamObject();
        sysCharURLParams.set(this.serviceConstants.SystemCharNumber, this.createSysCharListForQuery());
        this.httpService.sysCharRequest(sysCharURLParams).subscribe(function (data) {
            var records;
            if (!data || !data.records.length) {
                return;
            }
            records = data.records;
            _this.sysCharParams['enableRecordingOfNegEmpMoves'] = records[0].Required;
            _this.sysCharParams['EnableValidatePostcodeSuburb'] = records[1].Required;
            _this.sysCharParams['EnablePostcodeSuburbLog'] = records[1].Logical;
            _this.modifyControlStates();
        }, function (error) {
            _this.logger.log(error);
            _this.errorService.emitError({
                msg: MessageConstant.Message.GeneralError
            });
        });
    };
    PostcodeMoveBranchComponent.prototype.fetchRecord = function () {
        var _this = this;
        var contractNumber = this.getControlValue('ContractNumber');
        var premiseNumber = this.getControlValue('PremiseNumber');
        var fetchURLParams = this.getURLSearchParamObject();
        fetchURLParams.set(this.serviceConstants.ContractNumber, contractNumber);
        fetchURLParams.set(this.serviceConstants.PremiseNumber, premiseNumber);
        fetchURLParams.set(this.serviceConstants.Action, '0');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.serviceParams.method, this.serviceParams.module, this.serviceParams.operation, fetchURLParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorService.emitError({
                    msg: data.errorMessage
                });
                return;
            }
            _this.pageData = data;
            _this.populateForm();
            _this.modifyControlStates();
        }, function (error) {
            _this.logger.log(error);
            _this.errorService.emitError({
                msg: MessageConstant.Message.GeneralError
            });
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PostcodeMoveBranchComponent.prototype.populateForm = function () {
        this.setControlValue('NewServiceBranchNumber', '');
        this.setControlValue('NewPremiseSalesEmployee', '');
        this.setControlValue('NewNegBranchNumber', '');
        this.setControlValue('NewContractSalesEmployee', '');
        this.setControlValue('NewCommissionEmployeeCode', '');
        this.setControlValue('BranchSalesAreaCode', '');
        this.setControlValue('BranchServiceAreaCode', '');
        for (var key in this.pageData) {
            if (!key) {
                continue;
            }
            this.setControlValue(key.trim(), this.pageData[key]);
        }
        this.ellipsisParams.commisssionEmployeeSearchParams = {
            parentMode: 'LookUp-Commission',
            NewNegBranchNumber: this.pageData['NewNegBranchNumber']
        };
        this.ellipsisParams.newCommisssionEmployeeSearchParams = {
            parentMode: 'LookUp-CommissionBranch-Employee',
            NewNegBranchNumber: this.pageData['ServiceBranchNumber']
        };
        this.ellipsisParams.newPremiseSalesEmployeeSearchParams = {
            parentMode: 'LookUp-PremiseBranch-Employee',
            NewServiceBranchNumber: this.pageData['ServiceBranchNumber']
        };
        this.ellipsisParams.newContractSalesEmployeeSearchParams = {
            parentMode: 'LookUp-ContractBranch-Employee',
            NewNegBranchNumber: this.pageData['ServiceBranchNumber']
        };
        this.ellipsisParams.postcodeSearchParams['PremiseAddressLine4'] = this.getControlValue('PremiseAddressLine4');
        this.ellipsisParams.postcodeSearchParams['PremiseAddressLine5'] = this.getControlValue('PremiseAddressLine5');
        this.ellipsisParams.postcodeSearchParams['PremisePostCode'] = this.getControlValue('PremisePostcode');
    };
    PostcodeMoveBranchComponent.prototype.toggleFormDisabledState = function (disable, ignore) {
        for (var control in this.uiForm.controls) {
            if (!control) {
                continue;
            }
            if (ignore.indexOf(control) < 0) {
                this.toggleDisabled(control, disable);
            }
        }
    };
    PostcodeMoveBranchComponent.prototype.isControlDisabled = function (control) {
        return this.uiForm.controls[control].disabled;
    };
    PostcodeMoveBranchComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show({ msg: data.msg, title: 'Error' }, false);
    };
    PostcodeMoveBranchComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };
    PostcodeMoveBranchComponent.prototype.afterSave = function () {
        var controlStates = true;
        this.toggleDisabled('MoveNegBranchNo', true);
        this.toggleDisabled('MoveNegBranchYes', true);
        this.toggleDisabled('Processas1', true);
        this.toggleDisabled('Processas2', true);
        if (this.getControlValue('PremisePostcodeDefaults') === 'Default') {
            controlStates = false;
        }
        this.toggleDisabled('NewServiceBranchNumber', !controlStates);
        this.toggleDisabled('NewPremiseSalesEmployee', !controlStates);
        this.toggleRequiredStatus('BranchServiceAreaCode', controlStates);
        this.toggleRequiredStatus('BranchSalesAreaCode', controlStates);
        this.elementShowHide.salesAreaCode = controlStates;
        this.elementShowHide.serviceAreaCode = controlStates;
        this.cbbService.disableComponent(false);
    };
    PostcodeMoveBranchComponent.prototype.onContractDataReceived = function (data) {
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.setControlValue('ContractName', data.ContractName);
        this.elementDisabled.isPremisesDisabled = false;
        this.toggleFormDisabledState(true, ['ContractNumber', 'PremiseNumber']);
        this.toggleDisabled('PremiseNumber', false);
        this.ellipsisParams.premiseSearchParams = {
            parentMode: 'LookUp',
            ContractNumber: this.getControlValue('ContractNumber'),
            ContractName: this.getControlValue('ContractName')
        };
        this.getSysChars();
        if (this.getControlValue('PremiseNumber')) {
            this.setFormModeUpdate();
        }
        this.ellipsisParams.newCommisssionEmployeeSearchParams = {
            parentMode: 'LookUp-CommissionBranch-Employee',
            NewNegBranchNumber: this.utils.getBranchCode()
        };
        this.ellipsisParams.newPremiseSalesEmployeeSearchParams = {
            parentMode: 'LookUp-PremiseBranch-Employee',
            NewServiceBranchNumber: this.utils.getBranchCode()
        };
        this.ellipsisParams.newContractSalesEmployeeSearchParams = {
            parentMode: 'LookUp-ContractBranch-Employee',
            NewNegBranchNumber: this.utils.getBranchCode()
        };
    };
    PostcodeMoveBranchComponent.prototype.onContractNumberChange = function (event) {
        var _this = this;
        var contractNumber = this.getControlValue('ContractNumber');
        var lookupContractNameData;
        if (!contractNumber) {
            this.setControlValue('ContractName', '');
            return;
        }
        if (contractNumber.length < 9) {
            contractNumber = StaticUtils.fillLeadingZeros(contractNumber, 8);
            this.setControlValue('ContractNumber', contractNumber);
        }
        lookupContractNameData = [{
                'table': 'Contract',
                'query': { 'ContractNumber': contractNumber },
                'fields': ['ContractName']
            }];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(lookupContractNameData).then(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (!data[0].length) {
                return;
            }
            _this.setControlValue('ContractName', data[0][0].ContractName);
            _this.elementDisabled.isPremisesDisabled = false;
            _this.toggleDisabled('PremiseNumber', false);
            if (_this.getControlValue('PremiseNumber')) {
                _this.setFormModeUpdate();
            }
        }).catch(function (error) {
            _this.logger.error(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PostcodeMoveBranchComponent.prototype.onPremiseDataReceived = function (data) {
        this.setControlValue('PremiseNumber', data.PremiseNumber);
        this.setControlValue('PremiseName', data.PremiseName);
        this.setFormModeUpdate();
    };
    PostcodeMoveBranchComponent.prototype.onPremisesNumberChange = function (event) {
        var _this = this;
        var contractNumber = this.getControlValue('ContractNumber');
        var premiseNumber = this.getControlValue('PremiseNumber');
        var lookupPremiseNameData;
        if (!premiseNumber) {
            return;
        }
        lookupPremiseNameData = [{
                'table': 'Premise',
                'query': { 'PremiseNumber': premiseNumber, 'ContractNumber': contractNumber },
                'fields': ['PremiseName']
            }];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(lookupPremiseNameData).then(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (!data[0].length) {
                return;
            }
            _this.setControlValue('PremiseName', data[0][0].PremiseName);
            _this.setFormModeUpdate();
        }).catch(function (error) {
            _this.logger.error(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PostcodeMoveBranchComponent.prototype.onProcessAsTransferChange = function (event) {
        var status = false;
        var processTypeValue = 'Transfer';
        if (!this.getControlValue('Processas1')) {
            processTypeValue = 'Cancellation';
            status = true;
        }
        this.setControlValue('Processas2', status);
        this.setControlValue('ProcessType', processTypeValue);
        this.elementShowHide.transferTurnover = !status;
    };
    PostcodeMoveBranchComponent.prototype.onCancellationChange = function (event) {
        var status = false;
        var processTypeValue = 'Cancellation';
        if (!this.getControlValue('Processas2')) {
            processTypeValue = 'Transfer';
            status = true;
        }
        this.setControlValue('Processas1', status);
        this.setControlValue('ProcessType', processTypeValue);
        this.elementShowHide.transferTurnover = status;
    };
    PostcodeMoveBranchComponent.prototype.onMoveNegBranchYesChange = function (event) {
        var moveNegBranch = 'No';
        var status = true;
        var postCodeDefaultsStatus = true;
        if (this.getControlValue('MoveNegBranchYes')) {
            moveNegBranch = 'Yes';
            status = false;
            postCodeDefaultsStatus = false;
            if (this.getControlValue('PremisePostcodeDefaults') === 'Default') {
                postCodeDefaultsStatus = true;
            }
        }
        this.setControlValue('MoveNegBranch', moveNegBranch);
        this.setControlValue('MoveNegBranchNo', status);
        this.elementDisabled.isContractSalesEmployeeDisabled = postCodeDefaultsStatus;
        this.toggleDisabled('NewContractSalesEmployee', postCodeDefaultsStatus);
        this.toggleDisabled('NewNegBranchNumber', postCodeDefaultsStatus);
    };
    PostcodeMoveBranchComponent.prototype.onMoveNegBranchNoChange = function (event) {
        var moveNegBranch = 'Yes';
        var status = true;
        var postCodeDefaultsStatus = false;
        if (this.getControlValue('MoveNegBranchNo')) {
            moveNegBranch = 'No';
            status = false;
            postCodeDefaultsStatus = true;
            if (this.getControlValue('PremisePostcodeDefaults') === 'Default') {
                postCodeDefaultsStatus = false;
            }
        }
        this.setControlValue('MoveNegBranch', moveNegBranch);
        this.setControlValue('MoveNegBranchYes', status);
        this.elementDisabled.isContractSalesEmployeeDisabled = postCodeDefaultsStatus;
        this.toggleDisabled('NewContractSalesEmployee', postCodeDefaultsStatus);
        this.toggleDisabled('NewNegBranchNumber', postCodeDefaultsStatus);
    };
    PostcodeMoveBranchComponent.prototype.onPremisesStateTownPostcodeChange = function (event) {
        this.ellipsisParams.postcodeSearchParams['PremiseAddressLine4'] = this.getControlValue('PremiseAddressLine4');
        this.ellipsisParams.postcodeSearchParams['PremiseAddressLine5'] = this.getControlValue('PremiseAddressLine5');
        this.ellipsisParams.postcodeSearchParams['PremisePostCode'] = this.getControlValue('PremisePostcode');
        this.postCodeChange();
    };
    PostcodeMoveBranchComponent.prototype.onPostcodeDataReceived = function (data) {
        if (data.PremisePostcode) {
            this.setControlValue('PremisePostcode', data.PremisePostcode);
        }
        if (data.PremiseAddressLine4) {
            this.setControlValue('PremiseAddressLine4', data.PremiseAddressLine4);
        }
        if (data.PremiseAddressLine5) {
            this.setControlValue('PremiseAddressLine5', data.PremiseAddressLine5);
        }
    };
    PostcodeMoveBranchComponent.prototype.postCodeChange = function () {
        var _this = this;
        var formData = {};
        var postCodeChangeParams = this.getURLSearchParamObject();
        var requestParams = [
            'PremiseNumber',
            'ContractNumber',
            'PremisePostcode',
            'PremiseAddressLine4',
            'PremiseAddressLine5',
            'ProcessType',
            'MoveNegBranch',
            'PremiseSalesEmployee',
            'CommissionEmployeeCode',
            'TransferTurnover'
        ];
        postCodeChangeParams.set(this.serviceConstants.Action, '6');
        formData['Function'] = 'GetBranch';
        formData['BranchNumber'] = this.utils.getBranchCode();
        for (var i = 0; i < requestParams.length; i++) {
            var name_1 = requestParams[i];
            if (this.getControlValue(name_1)) {
                formData[name_1] = this.getControlValue(name_1);
            }
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.xhrPost(this.serviceParams.method, this.serviceParams.module, this.serviceParams.operation, postCodeChangeParams, formData).then(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorService.emitError({
                    msg: data.errorMessage
                });
                return;
            }
            for (var key in data) {
                if (!key) {
                    continue;
                }
                _this.setControlValue(key, data[key]);
            }
        }).catch(function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.logger.log(error);
            _this.errorService.emitError({
                msg: MessageConstant.Message.GeneralError
            });
        });
    };
    PostcodeMoveBranchComponent.prototype.onEmployeeDataReceived = function (control, data) {
        this.setControlValue(control, data[control] || '');
    };
    PostcodeMoveBranchComponent.prototype.onMessageClose = function () {
        this.infoModal.hide();
    };
    PostcodeMoveBranchComponent.prototype.confirmSave = function () {
        var isValidForm = this.riExchange.validateForm(this.uiForm);
        if (!isValidForm) {
            return;
        }
        this.promptConfirmModal.show();
    };
    PostcodeMoveBranchComponent.prototype.saveData = function (event) {
        var _this = this;
        var formData = {};
        var saveQueryParams = this.getURLSearchParamObject();
        for (var control in this.uiForm.controls) {
            if (!control) {
                continue;
            }
            formData[control] = this.getControlValue(control);
        }
        formData['ContractROWID'] = this.pageData.Contract;
        saveQueryParams.set(this.serviceConstants.Action, '2');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.serviceParams.method, this.serviceParams.module, this.serviceParams.operation, saveQueryParams, formData).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorService.emitError({
                    msg: data.errorMessage
                });
                return;
            }
            _this.afterSave();
            if (data.InfoMessage) {
                _this.messageService.emitMessage({
                    msg: data.InfoMessage
                });
                return;
            }
            _this.messageService.emitMessage({
                msg: MessageConstant.Message.SavedSuccessfully
            });
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.logger.log(error);
            _this.errorService.emitError({
                msg: MessageConstant.Message.GeneralError
            });
        });
    };
    PostcodeMoveBranchComponent.prototype.cancelData = function () {
        this.populateForm();
        this.setFormModeUpdate();
    };
    PostcodeMoveBranchComponent.prototype.onNewServiceBranchNumberChange = function () {
        this.ellipsisParams.newPremiseSalesEmployeeSearchParams = {
            parentMode: 'LookUp-PremiseBranch-Employee',
            NewServiceBranchNumber: this.getControlValue('NewServiceBranchNumber')
        };
        this.ellipsisParams.newCommisssionEmployeeSearchParams = {
            parentMode: 'LookUp-CommissionBranch-Employee',
            NewNegBranchNumber: this.getControlValue('NewServiceBranchNumber')
        };
    };
    PostcodeMoveBranchComponent.prototype.onNewNegBranchNumberChange = function () {
        this.ellipsisParams.newContractSalesEmployeeSearchParams = {
            parentMode: 'LookUp-ContractBranch-Employee',
            NewNegBranchNumber: this.getControlValue('NewNegBranchNumber')
        };
    };
    PostcodeMoveBranchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAPostcodeMoveBranch.html',
                    providers: [ErrorService]
                },] },
    ];
    PostcodeMoveBranchComponent.ctorParameters = [
        { type: Injector, },
    ];
    PostcodeMoveBranchComponent.propDecorators = {
        'infoModal': [{ type: ViewChild, args: ['infoModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'promptConfirmModal': [{ type: ViewChild, args: ['promptConfirmModal',] },],
    };
    return PostcodeMoveBranchComponent;
}(BaseComponent));
