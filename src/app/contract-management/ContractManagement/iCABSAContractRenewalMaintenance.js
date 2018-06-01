var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { AppModuleRoutes } from './../../base/PageRoutes';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { Observable } from 'rxjs/Rx';
import { StaticUtils } from './../../../shared/services/static.utility';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
export var ContractRenewalMaintenanceComponent = (function (_super) {
    __extends(ContractRenewalMaintenanceComponent, _super);
    function ContractRenewalMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [
            { name: 'ContractNumber', disabled: false },
            { name: 'ContractName', disabled: true },
            { name: 'Status', disabled: true },
            { name: 'AccountNumber', disabled: true },
            { name: 'AccountName', disabled: true },
            { name: 'ContractAddressLine1', disabled: true },
            { name: 'NegBranchNumber', disabled: true },
            { name: 'BranchName', disabled: true },
            { name: 'ContractAddressLine2', disabled: true },
            { name: 'InvoiceFrequencyCode', disabled: true },
            { name: 'ContractAddressLine3', disabled: true },
            { name: 'InvoiceAnnivDate', disabled: true },
            { name: 'ContractAddressLine4', disabled: true },
            { name: 'ContractAddressLine5', disabled: true },
            { name: 'ContractPostcode', disabled: true },
            { name: 'ContractCommenceDate', disabled: true },
            { name: 'ContractDurationCode', disabled: true },
            { name: 'NegBranchNumber', disabled: true },
            { name: 'BranchName', disabled: true },
            { name: 'ContractAnnualValue', disabled: true },
            { name: 'ContractExpiryDate', disabled: true },
            { name: 'NewContractExpiryDate', disabled: true },
            { name: 'ContinuousInd', disabled: true },
            { name: 'ContractSalesEmployee', disabled: true },
            { name: 'SalesEmployeeSurname', disabled: true },
            { name: 'NewContractDurationCode' },
            { name: 'LastChangeEffectDate' },
            { name: 'ContractROWID' }
        ];
        this.tabs = {
            tab0: { active: true },
            tab1: { active: false }
        };
        this.contractSearchComponent = ContractSearchComponent;
        this.contractSearchParams = {
            parentMode: 'LookUp'
        };
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.headerParams = {
            method: 'contract-management/grid',
            module: 'duration',
            operation: 'Application/iCABSAContractRenewalMaintenance'
        };
        this.recordRenewalSalesStats = false;
        this.inputParamsContractDuration = {
            parentMode: 'LookUp-NewContract',
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode()
        };
        this.isContinuousContract = false;
        this.gridParams = {
            totalRecords: 0,
            maxColumn: 10,
            itemsPerPage: 10,
            currentPage: 1,
            riGridMode: 0,
            riGridHandle: 2820822,
            riSortOrder: 'Descending',
            HeaderClickedColumn: ''
        };
        this.gridSortHeaders = [];
        this.showValueControl = false;
        this.employeeSearchParams = {
            parentMode: 'LookUp-ContractSalesEmployee'
        };
        this.employeeSearchComponent = EmployeeSearchComponent;
        this.contractDurationCode = '';
        this.showMessageHeader = true;
        this.promptOptionYesNo = false;
        this.contractDurationDefault = {
            id: '',
            text: ''
        };
        this.contractTypeTexts = {
            title: 'Contract Renewal Maintenance',
            label: 'Contract Number'
        };
        this.dataSelected = false;
        this.menuDisabled = true;
        this.menuValue = '';
        this.pageId = PageIdentifier.ICABSACONTRACTRENEWALMAINTENANCE;
    }
    ContractRenewalMaintenanceComponent.prototype.ngAfterViewInit = function () {
        this.setMessageCallback(this);
        this.setErrorCallback(this);
        this.contractRenewalGrid.update = true;
        switch (this.riExchange.getCurrentContractType()) {
            case 'C':
                this.contractTypeTexts.title = 'Contract Renewal Maintenance';
                this.contractTypeTexts.label = 'Contract Number';
                break;
            case 'J':
                this.contractTypeTexts.title = 'Job Renewal Maintenance';
                this.contractTypeTexts.label = 'Job Number';
                break;
            case 'P':
                this.contractTypeTexts.title = 'Product Renewal Maintenance';
                this.contractTypeTexts.label = 'Product Number';
                break;
        }
        this.contractSearchParams = {
            parentMode: 'LookUp',
            currentContractType: this.riExchange.getCurrentContractType()
        };
        var productCode = {
            'fieldName': 'ProductCode',
            'index': 1,
            'sortType': 'ASC'
        };
        var commenceDate = {
            'fieldName': 'CommenceDate',
            'index': 3,
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(productCode);
        this.gridSortHeaders.push(commenceDate);
        if (this.isReturning()) {
            this.autoOpen = false;
            this.fetchDetails();
            return;
        }
        this.autoOpen = true;
    };
    ContractRenewalMaintenanceComponent.prototype.onTabClick = function (index) {
        if (this.tabs['tab' + index].active) {
            return;
        }
        for (var key in this.tabs) {
            if (!key) {
                continue;
            }
            if (key === 'tab' + index) {
                this.tabs[key].active = true;
                continue;
            }
            this.tabs[key].active = false;
        }
    };
    ContractRenewalMaintenanceComponent.prototype.onContractNumberChange = function (event) {
        if (this.getControlValue('ContractNumber') !== '') {
            this.onContractDataReceived({
                'ContractNumber': this.getControlValue('ContractNumber'),
                'ContractName': ''
            });
        }
        else {
            this.formReset();
        }
    };
    ContractRenewalMaintenanceComponent.prototype.formReset = function () {
        var contractNumber = this.getControlValue('ContractNumber');
        this.uiForm.reset();
        this.setControlValue('ContractNumber', contractNumber);
        this.uiForm.controls['ContinuousInd'].disable();
        this.isContinuousContract = false;
        this.dataSelected = false;
        this.contractRenewalGrid.clearGridData();
    };
    ContractRenewalMaintenanceComponent.prototype.onContractDataReceived = function (data) {
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.setControlValue('ContractName', data.ContractName);
        this.inputParamsContractDuration = {
            parentMode: 'LookUp-NewContract',
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode()
        };
        this.fetchDetails();
    };
    ContractRenewalMaintenanceComponent.prototype.fetchDetails = function () {
        var _this = this;
        var search = this.getURLSearchParamObject();
        search.set(this.serviceConstants.SystemCharNumber, '2580');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.sysCharRequest(search).subscribe(function (data) {
            _this.recordRenewalSalesStats = data.records[0].Required;
            _this.getFormData();
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.displayError(MessageConstant.Message.GeneralError, error);
        });
    };
    ContractRenewalMaintenanceComponent.prototype.getFormData = function () {
        var _this = this;
        var contractTypeStatusSearch = this.getURLSearchParamObject();
        var contractTypeFormData = {};
        var contractStatusFormData = {};
        var contractDetailsQuery = {};
        contractTypeStatusSearch.set(this.serviceConstants.Action, '6');
        contractTypeFormData['ContractNumber'] = this.getControlValue('ContractNumber');
        contractTypeFormData['Function'] = 'CheckContractType';
        contractStatusFormData['ContractNumber'] = this.getControlValue('ContractNumber');
        contractStatusFormData['Function'] = 'GetStatus';
        this.setFormMode(this.c_s_MODE_UPDATE);
        contractDetailsQuery = [{
                'table': 'Contract',
                'query': { 'ContractNumber': this.getControlValue('ContractNumber'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['LastChangeEffectDate', 'ContractDurationCode', 'ContractEffectDate', 'ContractExpiryDate', 'ContractName', 'AccountNumber', 'ContractCommenceDate', 'InvoiceAnnivDate', 'InvoiceFrequencyCode', 'NegBranchNumber']
            }];
        this.ajaxSource.next(this.ajaxconstant.START);
        Observable.forkJoin(this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, contractTypeStatusSearch, contractTypeFormData), this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, contractTypeStatusSearch, contractStatusFormData), this.httpService.lookUpRequest(contractTypeStatusSearch, contractDetailsQuery)).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            var contractDetails;
            if (data[0].errorMessage) {
                _this.displayError(data[0].errorMessage);
                _this.formReset();
                return;
            }
            if ((data[1].fullError || data[1].errorMessage) || (data[1].results && data[1].results.errorMessage)) {
                _this.displayError(data[1].errorMessage || data[1].results.errorMessage);
                _this.formReset();
                return;
            }
            _this.contractStatus = data[1].Status;
            _this.setControlValue('Status', data[1].Status);
            _this.setControlValue('ContractAnnualValue', _this.utils.numToDecimal(data[1].ContractAnnualValue, 2).toString());
            _this.isContinuousContract = true;
            contractDetails = data[2].results[0][0];
            _this.contractDurationCode = contractDetails['ContractDurationCode'];
            _this.toggleContinuousContract();
            if (_this.riExchange.ClientSideValues.Fetch('FullAccess') && contractDetails['NegBranchNumber'] === _this.utils.getBranchCode()) {
                _this.showValueControl = true;
            }
            for (var control in contractDetails) {
                if (!control) {
                    continue;
                }
                if (control === 'ContractCommenceDate' && contractDetails[control]) {
                    _this.setControlValue(control, StaticUtils.convertDateToFormat(contractDetails[control], 'YYYY-MM-DD'));
                    continue;
                }
                if (control === 'ContractExpiryDate' && contractDetails[control]) {
                    _this.setControlValue(control, StaticUtils.convertDateToFormat(contractDetails[control], 'YYYY-MM-DD'));
                    continue;
                }
                if (control === 'InvoiceAnnivDate' && contractDetails[control]) {
                    _this.setControlValue(control, StaticUtils.convertDateToFormat(contractDetails[control], 'YYYY-MM-DD'));
                    continue;
                }
                _this.setControlValue(control, contractDetails[control]);
            }
            _this.setControlValue('ContractROWID', contractDetails['ttContract']);
            _this.getAccountDetails();
            _this.dataSelected = true;
        }, function (error) {
            _this.displayError(MessageConstant.Message.GeneralError, error);
        });
    };
    ContractRenewalMaintenanceComponent.prototype.getAccountDetails = function () {
        var _this = this;
        var accountDetailsQuery = [];
        accountDetailsQuery = [{
                'table': 'Branch',
                'query': { 'BranchNumber': this.utils.getBranchCode(), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['BranchName']
            }, {
                'table': 'Account',
                'query': { 'AccountNumber': this.getControlValue('AccountNumber'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['AccountName', 'AccountAddressLine1', 'AccountAddressLine2', 'AccountAddressLine3', 'AccountAddressLine4', 'AccountAddressLine5', 'AccountPostcode']
            }];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(accountDetailsQuery).then(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data[0] && data[0].length) {
                _this.setControlValue('BranchName', data[0][0]['BranchName']);
            }
            if (!data[1] || !data[1].length) {
                _this.displayError(MessageConstant.Message.RecordNotFound);
                return;
            }
            var accountDetails = data[1][0];
            _this.setControlValue('AccountName', accountDetails['AccountName']);
            _this.setControlValue('ContractAddressLine1', accountDetails['AccountAddressLine1']);
            _this.setControlValue('ContractAddressLine2', accountDetails['AccountAddressLine2']);
            _this.setControlValue('ContractAddressLine3', accountDetails['AccountAddressLine3']);
            _this.setControlValue('ContractAddressLine4', accountDetails['AccountAddressLine4']);
            _this.setControlValue('ContractAddressLine5', accountDetails['AccountAddressLine5']);
            _this.setControlValue('ContractPostcode', accountDetails['AccountPostcode']);
            _this.loadGrid();
        }).catch(function (error) {
            _this.displayError(MessageConstant.Message.GeneralError, error);
        });
    };
    ContractRenewalMaintenanceComponent.prototype.loadGrid = function () {
        var gridSearchParams = this.getURLSearchParamObject();
        var gridInputParams;
        gridInputParams = this.headerParams;
        gridSearchParams.set(this.serviceConstants.Action, '2');
        gridSearchParams.set(this.serviceConstants.GridMode, this.gridParams.riGridMode);
        gridSearchParams.set(this.serviceConstants.GridHandle, this.gridParams.riGridHandle);
        gridSearchParams.set(this.serviceConstants.GridSortOrder, this.gridParams.riSortOrder);
        gridSearchParams.set(this.serviceConstants.PageSize, this.gridParams.itemsPerPage);
        gridSearchParams.set(this.serviceConstants.PageCurrent, this.gridParams.currentPage);
        gridSearchParams.set(this.serviceConstants.GridHeaderClickedColumn, this.gridParams.HeaderClickedColumn);
        gridSearchParams.set(this.serviceConstants.GridSortOrder, this.gridParams.riSortOrder);
        gridSearchParams.set(this.serviceConstants.ContractNumber, this.getControlValue('ContractNumber'));
        gridSearchParams.set(this.serviceConstants.LanguageCode, this.riExchange.LanguageCode());
        gridInputParams.search = gridSearchParams;
        this.contractRenewalGrid.loadGridData(gridInputParams);
        this.enableControls();
    };
    ContractRenewalMaintenanceComponent.prototype.refresh = function () {
        this.gridParams.currentPage = 1;
        this.loadGrid();
    };
    ContractRenewalMaintenanceComponent.prototype.getCurrentPage = function (curPage) {
        this.gridParams.currentPage = curPage ? curPage.value : this.gridParams.currentPage;
        this.loadGrid();
    };
    ContractRenewalMaintenanceComponent.prototype.getGridInfo = function (info) {
        var gridTotalItems = this.gridParams.itemsPerPage;
        if (info) {
            this.gridParams.totalRecords = info.totalRows;
        }
        StaticUtils.setGridInputReadonly(2);
    };
    ContractRenewalMaintenanceComponent.prototype.enableControls = function () {
        this.disableControl('ContinuousInd', false);
        this.menuDisabled = false;
        this.disableControl('ContractSalesEmployee', false);
    };
    ContractRenewalMaintenanceComponent.prototype.clearForm = function (ignore) {
        this.isContinuousContract = false;
        this.clearControls(ignore);
        this.uiForm.disable();
    };
    ContractRenewalMaintenanceComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show({ msg: data, title: 'Error' }, false);
    };
    ContractRenewalMaintenanceComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data, title: 'Message' }, false);
    };
    ContractRenewalMaintenanceComponent.prototype.onEmployeeDataReceived = function (data) {
        this.setControlValue('ContractSalesEmployee', data.ContractSalesEmployee);
        this.setControlValue('SalesEmployeeSurname', data.SalesEmployeeSurname);
    };
    ContractRenewalMaintenanceComponent.prototype.toggleContinuousContract = function () {
        var controlValue = this.contractDurationCode ? false : true;
        this.setControlValue('ContinuousInd', controlValue);
        this.onContinuousContractChange();
    };
    ContractRenewalMaintenanceComponent.prototype.onContinuousContractChange = function () {
        this.isContinuousContract = !this.getControlValue('ContinuousInd');
        this.contractDurationDefault = {
            id: '',
            text: ''
        };
        this.setControlValue('NewContractDurationCode', '');
        this.effectiveDate = null;
        this.effectiveDatePicker.dtDisplay = '';
        this.setControlValue('LastChangeEffectDate', '');
        this.setControlValue('NewContractExpiryDate', '');
        this.setControlValue('ContractSalesEmployee', '');
        this.setControlValue('SalesEmployeeSurname', '');
    };
    ContractRenewalMaintenanceComponent.prototype.onMenuChange = function ($event) {
        this.menuValue = $event.target.value;
        switch (this.menuValue) {
            case 'Contract':
                this.navigate('LoadByKeyFields', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                    parentMode: 'LoadByKeyFields',
                    ContractNumber: this.getControlValue('ContractNumber'),
                    ContractName: this.getControlValue('ContractName')
                });
                break;
            case 'Premises':
                this.navigate('Contract', '/' + AppModuleRoutes.GRID + '/application/premise/search', {
                    parentMode: 'Contract',
                    ContractNumber: this.getControlValue('ContractNumber'),
                    ContractName: this.getControlValue('ContractName'),
                    ContractTypeCode: this.riExchange.getCurrentContractType()
                });
                break;
            case 'ServiceCover':
                this.navigate('Contract', '/' + AppModuleRoutes.GRID + '/contractmanagement/account/contractservicesummary', {
                    parentMode: 'Contract',
                    ContractNumber: this.getControlValue('ContractNumber'),
                    ContractName: this.getControlValue('ContractName')
                });
                break;
        }
    };
    ContractRenewalMaintenanceComponent.prototype.onGenerateLetterClick = function () {
        this.showMessageHeader = true;
        this.promptConfirmContent = 'Are You Sure You Wish To Generate the Contract Renewal Letter ?';
        this.promptConfirmTitle = 'Contract Renewal';
        this.promptOptionYesNo = true;
        this.promptModalClose = this.generateContractRenewalLetter;
        this.promptConfirmModal.show();
    };
    ContractRenewalMaintenanceComponent.prototype.generateContractRenewalLetter = function () {
        var _this = this;
        var generateQuery = this.getURLSearchParamObject();
        var formData = {};
        generateQuery.set(this.serviceConstants.Action, '6');
        formData[this.serviceConstants.Function] = 'GenerateContractRenewalLetter';
        formData[this.serviceConstants.ContractNumber] = this.getControlValue('ContractNumber');
        formData[this.serviceConstants.AccountNumber] = this.getControlValue('AccountNumber');
        formData[this.serviceConstants.AccountNumber] = this.getControlValue('AccountNumber');
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, generateQuery, formData).subscribe(function (data) {
            if (data.errorMessage) {
                _this.displayError(data.errorMessage);
                return;
            }
            var reportQuery = _this.getURLSearchParamObject();
            var formData = {};
            reportQuery.set(_this.serviceConstants.Action, '2');
            formData['ReportNumber'] = data.ReportNumber;
            _this.httpService.makePostRequest(_this.headerParams.method, _this.headerParams.module, _this.headerParams.operation, reportQuery, formData).subscribe(function (data) {
                if (data.errorMessage) {
                    _this.displayError(data.errorMessage);
                    return;
                }
                if (data.url) {
                    window.open(data.url, '_blank');
                }
            }, function (error) {
                _this.displayError(MessageConstant.Message.GeneralError, error);
            });
        }, function (error) {
            _this.displayError(MessageConstant.Message.GeneralError, error);
        });
    };
    ContractRenewalMaintenanceComponent.prototype.onGridDoubleClick = function (data) {
        if (data.cellIndex === 1) {
            this.attributes['ServiceCoverRowID'] = data.cellData['rowID'];
            this.navigate('ProRataCharge', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                parentMode: 'ProRataCharge',
                ContractNumber: this.getControlValue('ContractNumber'),
                ContractName: this.getControlValue('ContractName')
            });
        }
    };
    ContractRenewalMaintenanceComponent.prototype.onReceivedContractDuration = function (data) {
        this.setControlValue('NewContractDurationCode', data['NewContractDurationCode']);
        this.uiForm.markAsDirty();
        if (this.getControlValue('NewContractDurationCode')) {
            this.getNewExpiryDate();
        }
    };
    ContractRenewalMaintenanceComponent.prototype.onServiceDateSelect = function (data) {
        this.setControlValue('LastChangeEffectDate', data['value']);
        this.uiForm.markAsDirty();
        if (this.getControlValue('LastChangeEffectDate') && this.getControlValue('NewContractDurationCode')) {
            this.getNewExpiryDate();
        }
    };
    ContractRenewalMaintenanceComponent.prototype.getNewExpiryDate = function () {
        var _this = this;
        var expiryDateQuery = this.getURLSearchParamObject();
        var formData = {};
        expiryDateQuery.set(this.serviceConstants.Action, '6');
        formData[this.serviceConstants.Function] = 'GetDates';
        formData['NewContractDurationCode'] = this.getControlValue('NewContractDurationCode');
        if (this.getControlValue('LastChangeEffectDate')) {
            formData['LastChangeEffectDate'] = this.getControlValue('LastChangeEffectDate');
        }
        formData[this.serviceConstants.ContractNumber] = this.getControlValue('ContractNumber');
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, expiryDateQuery, formData).subscribe(function (data) {
            if (!data['NewContractExpiryDate']) {
                return;
            }
            _this.effectiveDatePicker.dtDisplay = data['LastChangeEffectDate'];
            _this.setControlValue('LastChangeEffectDate', data['LastChangeEffectDate']);
            _this.setControlValue('NewContractExpiryDate', data['NewContractExpiryDate']);
        }, function (error) {
            _this.displayError(MessageConstant.Message.GeneralError, error);
        });
    };
    ContractRenewalMaintenanceComponent.prototype.validateSave = function () {
        this.showMessageHeader = true;
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        this.promptOptionYesNo = false;
        this.promptModalClose = this.saveData;
        if (!this.getControlValue('ContractSalesEmployee')) {
            this.setControlValue('SalesEmployeeSurname', '');
        }
        this.promptConfirmModal.show();
    };
    ContractRenewalMaintenanceComponent.prototype.saveData = function () {
        var _this = this;
        var saveQueryParams = this.getURLSearchParamObject();
        var formData = {};
        var controlList = [
            'ContractNumber',
            'ContractROWID',
            'LastChangeEffectDate',
            'ContractDurationCode',
            'ContractExpiryDate',
            'ContractName',
            'AccountNumber',
            'ContractAnnualValue',
            'ContractCommenceDate',
            'InvoiceFrequencyCode',
            'InvoiceAnnivDate',
            'NegBranchNumber',
            'NewContractDurationCode',
            'NewContractExpiryDate',
            'ContractSalesEmployee'
        ];
        saveQueryParams.set(this.serviceConstants.Action, '2');
        for (var i = 0; i < controlList.length; i++) {
            formData[controlList[i]] = this.getControlValue(controlList[i]) || '';
        }
        formData[this.serviceConstants.Function] = 'GetStatus';
        formData['ContinuousInd'] = StaticUtils.convertCheckboxValueToRequestValue(this.getControlValue('ContinuousInd'));
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, saveQueryParams, formData).subscribe(function (data) {
            if (data.errorMessage) {
                _this.displayError(data.errorMessage);
                return;
            }
            _this.messageService.emitMessage(MessageConstant.Message.RecordSavedSuccessfully);
            _this.formPristine();
        }, function (error) {
            _this.displayError(MessageConstant.Message.GeneralError, error);
        });
    };
    ContractRenewalMaintenanceComponent.prototype.clearUpdates = function () {
        this.toggleContinuousContract();
        this.formPristine();
    };
    ContractRenewalMaintenanceComponent.prototype.promptModalClose = function () {
    };
    ContractRenewalMaintenanceComponent.prototype.onSaveFocus = function (e) {
        var nextTab = 0;
        var code = (e.keyCode ? e.keyCode : e.which);
        var elemList = document.querySelectorAll('.nav-tabs li');
        var currentSelectedIndex = Array.prototype.indexOf.call(elemList, document.querySelector('.nav-tabs li.active'));
        if (code === 9 && currentSelectedIndex < (elemList.length - 1)) {
            nextTab = currentSelectedIndex + 1;
            this.onTabClick(nextTab);
            setTimeout(function () {
                var elem = document.querySelector('.tab-content .tab-pane.active input:not([disabled])');
                if (elem) {
                    elem['focus']();
                }
            }, 100);
        }
        return;
    };
    ContractRenewalMaintenanceComponent.prototype.sortGrid = function (data) {
        this.gridParams.HeaderClickedColumn = data.fieldname;
        this.gridParams.riSortOrder = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.loadGrid();
    };
    ContractRenewalMaintenanceComponent.prototype.onCellClickBlur = function (data) {
        var _this = this;
        var urlParams = this.getURLSearchParamObject();
        var formData = {};
        if (data.cellIndex !== 9 || data.updateValue === data.cellData.text) {
            return;
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        urlParams.set(this.serviceConstants.Action, '2');
        formData[this.serviceConstants.GridMode] = '3';
        formData[this.serviceConstants.GridHandle] = this.gridParams.riGridHandle;
        formData[this.serviceConstants.GridSortOrder] = this.gridParams.riSortOrder;
        formData[this.serviceConstants.PageSize] = this.gridParams.itemsPerPage;
        formData[this.serviceConstants.PageCurrent] = this.gridParams.currentPage;
        formData[this.serviceConstants.GridHeaderClickedColumn] = this.gridParams.HeaderClickedColumn;
        formData[this.serviceConstants.ContractNumber] = this.getControlValue(this.serviceConstants.ContractNumber);
        formData[this.serviceConstants.LanguageCode] = this.getControlValue(this.riExchange.LanguageCode());
        formData['ProductCodeRowID'] = data.cellData.rowID;
        formData['ProductCode'] = data.completeRowData[1].text;
        formData['ProductDesc'] = data.completeRowData[2].text;
        formData['ServiceCommenceDate'] = data.completeRowData[3].text;
        formData['ServiceBranchNumber'] = data.completeRowData[4].text;
        formData['ServiceAreaCode'] = data.completeRowData[5].text;
        formData['ServiceQuantity'] = data.completeRowData[6].text;
        formData['ServiceVisitFrequency'] = data.completeRowData[7].text;
        formData['ServiceAnnualValue'] = data.completeRowData[8].text;
        formData['ProposedNewPriceRowID'] = data.cellData.rowID;
        formData['ProposedNewPrice'] = data.updateValue;
        formData['RowID'] = data.cellData.rowID;
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, urlParams, formData).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.displayError(data.errorMessage);
                return;
            }
            if (data.fullError) {
                _this.displayError(data.fullError);
            }
        }, function (error) {
            _this.displayError(MessageConstant.Message.GeneralError, error);
        });
    };
    ContractRenewalMaintenanceComponent.prototype.onRouteCancel = function () {
        this.menuValue = '';
    };
    ContractRenewalMaintenanceComponent.prototype.onMessageClose = function () {
        this.navigate('Contract', '/' + AppModuleRoutes.GRID + '/contractmanagement/account/contractservicesummary', {
            parentMode: 'Contract',
            ContractNumber: this.getControlValue('ContractNumber'),
            ContractName: this.getControlValue('ContractName')
        });
    };
    ContractRenewalMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAContractRenewalMaintenance.html'
                },] },
    ];
    ContractRenewalMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    ContractRenewalMaintenanceComponent.propDecorators = {
        'contractDurationDropDown': [{ type: ViewChild, args: ['contractDurationDropDown',] },],
        'effectiveDatePicker': [{ type: ViewChild, args: ['effectiveDatePicker',] },],
        'contractRenewalGrid': [{ type: ViewChild, args: ['contractRenewalGrid',] },],
        'promptConfirmModal': [{ type: ViewChild, args: ['promptConfirmModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return ContractRenewalMaintenanceComponent;
}(BaseComponent));
