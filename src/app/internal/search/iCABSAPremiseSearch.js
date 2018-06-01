var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Input, ViewChild, Injector, ElementRef } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { CBBService } from './../../../shared/services/cbb.service';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
export var PremiseSearchComponent = (function (_super) {
    __extends(PremiseSearchComponent, _super);
    function PremiseSearchComponent(injector, ellipsis, elem, cbbService) {
        _super.call(this, injector);
        this.ellipsis = ellipsis;
        this.elem = elem;
        this.cbbService = cbbService;
        this.controls = [
            { name: 'ContractNumber', readonly: true, disabled: true, required: false, value: '' },
            { name: 'ContractName', readonly: true, disabled: true, required: false, value: '' },
            { name: 'CopyContractNumber', readonly: true, disabled: false, required: false, value: '' },
            { name: 'CopyAccountNumber', readonly: true, disabled: false, required: false, value: '' },
            { name: 'AccountNumber', readonly: true, disabled: false, required: false, value: '' },
            { name: 'AccountName', readonly: true, disabled: false, required: false, value: '' },
            { name: 'SearchPostcode', readonly: true, disabled: false, required: false, value: '' },
            { name: 'InvoiceGroupNumber', readonly: true, disabled: false, required: false, value: '' }
        ];
        this.enableAddNew = true;
        this.showAddNew = true;
        this.search = new URLSearchParams();
        this.queryParams = {
            operation: 'Application/iCABSAPremiseSearch',
            module: 'premises',
            method: 'contract-management/search'
        };
        this.parentMode = 'normalMode';
        this.tdMenuDisplay = true;
        this.itemsPerPage = '10';
        this.page = '1';
        this.totalItem = '11';
        this.tableheading = 'Contract Service Detail Search';
        this.isCopyMode = false;
        this.selectedStatus = '';
        this.EnablePremiseLinking = false;
        this.vEnablePremiseLinking = false;
        this.CurrentContractType = 'C';
        this.tdStatusSearch = true;
        this.pageTitle = 'Premises Details';
        this.trContractLine = true;
        this.grdServiceBranchSearch = false;
        this.trAccountLine = false;
        this.trPostcodeSearch = false;
        this.trCopyAccountLine = false;
        this.trCopyContractLine = false;
        this.selectedServiceBranch = '';
        this.inputParamsBranchSearch = {
            'parentMode': 'Contract-Search',
            'ContractTypeCode': 'J', 'businessCode': 'D',
            'countryCode': 'ZA', action: 0
        };
        this.isAddNewVisible = false;
        this.isAddNewDisabled = false;
        this.tdAddRecord = true;
        this.contractNumberLabel = 'Contract Number';
        this.headerParams = {
            method: 'contract-management/search',
            operation: 'Application/iCABSAPremiseSearch',
            module: 'premises'
        };
        this.pageId = PageIdentifier.ICABSAPREMISESEARCH;
    }
    PremiseSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        if (this.parentMode === 'normalMode') {
            this.isCopyMode = false;
        }
        this.getSysCharDtetails();
        this.windowOnload();
        this.branchCodeList = this.cbbService.getBranchListByCountryAndBusiness(this.countryCode(), this.businessCode());
    };
    PremiseSearchComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    PremiseSearchComponent.prototype.SetCurrentContractType = function () {
        if (this.riExchange.URLParameterContains('job')) {
            this.CurrentContractType = 'J';
            this.CurrentContractTypeURLParameter = '<job>';
        }
        else if (this.riExchange.URLParameterContains('product')) {
            this.CurrentContractType = 'P';
            this.CurrentContractTypeURLParameter = '<product>';
        }
        else {
            this.CurrentContractTypeURLParameter = '';
        }
        var ContractTypesList;
        var Count;
        var contractTypes = this.riExchange.ClientSideValues.Fetch('ContractTypes');
        ContractTypesList = [];
        Count = 0;
        for (var i = 0; i < ContractTypesList.length; i++) {
            if (ContractTypesList[Count] === this.CurrentContractType) {
                this.CurrentContractTypeLabel = ContractTypesList[Count + 1];
                Count = ContractTypesList.length;
            }
            Count = Count + 2;
        }
    };
    PremiseSearchComponent.prototype.windowOnload = function () {
        this.EnablePremiseLinking = (this.vEnablePremiseLinking === true) ? true : false;
        this.SetCurrentContractType();
        if (this.CurrentContractType === 'C') {
            this.tdStatusSearch = true;
            this.contractNumberLabel = 'Contract Number';
        }
        else {
            this.tdStatusSearch = false;
            this.contractNumberLabel = 'Number';
        }
        if (this.parentMode === 'PremisePostcodeSearch' || this.parentMode === 'PremisePostcodeSearchNoSuburb') {
            this.pageTitle = 'Select Old Premises If Renegotiation';
        }
        else {
            this.pageTitle = 'Premises Search';
        }
        switch (this.parentMode) {
            case 'Contract':
                this.trContractLine = true;
                this.grdServiceBranchSearch = true;
                break;
            case 'InvoiceGroup':
            case 'InvoiceGroupGetAddress':
            case 'AddInvoiceGroup':
                this.trAccountLine = true;
                this.grdServiceBranchSearch = true;
                this.trContractLine = false;
                this.pageTitle = 'Premises Details';
                break;
            case 'ShowPremisesOnInvoiceGroup':
                this.trAccountLine = true;
                this.grdServiceBranchSearch = true;
                break;
            case 'PremisePostcodeSearch':
            case 'PremisePostcodeSearchNoSuburb':
                this.trPostcodeSearch = true;
                break;
            case 'LookUpRenegOldPremise':
                this.trContractLine = true;
                this.grdServiceBranchSearch = true;
                break;
            case 'InvGrpPremiseMaintenance':
                this.trContractLine = true;
                this.grdServiceBranchSearch = true;
                if (this.riExchange.URLParameterContains('2')) {
                    if (this.riExchange.GetParentHTMLInputElementAttribute('ContractNumber2', 'ContractName') !== null) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.GetParentHTMLInputElementAttribute('ContractNumber2', 'ContractName'));
                    }
                    else if (this.riExchange.URLParameterContains('3') || this.riExchange.URLParameterContains('R')) {
                        if (this.riExchange.GetParentHTMLInputElementAttribute('ContractNumber3', 'ContractName') !== null) {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.GetParentHTMLInputElementAttribute('ContractNumber3', 'ContractName'));
                        }
                    }
                }
                break;
            case 'PremiseNumber01':
            case 'PremiseNumber02':
            case 'PremiseNumber03':
            case 'PremiseNumber04':
            case 'PremiseNumber05':
            case 'PremiseNumber06':
            case 'PremiseNumber07':
            case 'PremiseNumber08':
            case 'PremiseNumber09':
            case 'PremiseNumber10':
            case 'PremiseNumber11':
            case 'PremiseNumber12':
            case 'PremiseNumber13':
            case 'PremiseNumber14':
                this.trContractLine = true;
                this.grdServiceBranchSearch = true;
                break;
            case 'PremiseCopy':
                this.trCopyAccountLine = true;
                this.tdStatusSearch = false;
                this.trCopyContractLine = true;
                this.grdServiceBranchSearch = true;
                this.trContractLine = false;
                if (this.elem.nativeElement.querySelector('#CopyAccountNumber') !== null) {
                    this.elem.nativeElement.querySelector('#CopyAccountNumber').focus();
                }
                break;
            case 'ServiceCoverCopy':
                this.trCopyContractLine = true;
                this.grdServiceBranchSearch = true;
                break;
            case 'Search-LinkedToPremise':
                this.trContractLine = true;
                this.grdServiceBranchSearch = true;
                this.riExchange.GetParentHTMLInputValue('LinkedToContractNumber', 'ContractNumber');
                this.riExchange.GetParentHTMLInputValue('LinkedToContractName', 'ContractName');
                break;
            case 'Search-ScannedPremise':
                this.trContractLine = true;
                this.grdServiceBranchSearch = true;
                this.riExchange.GetParentHTMLInputValue('ScannedContractNumber', 'ContractNumber');
                this.riExchange.GetParentHTMLInputValue('ScannedContractName', 'ContractName');
                break;
            case 'LookUp':
                this.pageTitle = 'Premises Details';
                break;
            default:
                this.grdServiceBranchSearch = true;
        }
        if (this.parentMode === 'PremiseCopy') {
            if (this.elem.nativeElement.querySelector('#CopyAccountNumber') !== null) {
                this.elem.nativeElement.querySelector('#CopyAccountNumber').focus();
            }
        }
        else {
        }
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceGroupNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SearchPostcode');
    };
    PremiseSearchComponent.prototype.CopyContractNumber_ondeactivate = function () {
    };
    PremiseSearchComponent.prototype.CopyAccountNumber_ondeactivate = function () {
    };
    PremiseSearchComponent.prototype.onAddNew = function (data) {
        switch (this.parentMode) {
            case 'InvoiceGroup':
                this.navigate('Contract', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE);
                return;
        }
        var returnObj = {
            'PremiseNumber': '',
            'PremiseName': '',
            'AddMode': true
        };
        this.ellipsis.sendDataToParent(returnObj);
        this.ellipsis.closeModal();
    };
    PremiseSearchComponent.prototype.buildTableColumns = function () {
        var _this = this;
        this.columns = [];
        if (this.parentMode === 'InvoiceGroup' || this.parentMode === 'ShowPremisesOnInvoiceGroup') {
            this.getTranslatedValue('Prefix', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'ContractTypePrefix' });
                }
                else {
                    _this.columns.push({ title: 'Prefix', name: 'ContractTypePrefix' });
                }
            });
        }
        if (this.parentMode === 'InvoiceGroup' || this.parentMode === 'ShowPremisesOnInvoiceGroup'
            || this.parentMode === 'InvoiceGroupGetAddress' || this.parentMode === 'AddInvoiceGroup' ||
            this.parentMode === 'PremisePostcodeSearch' || this.parentMode === 'PremisePostcodeSearchNoSuburb' ||
            this.parentMode === 'PremiseCopy' || this.parentMode === 'ServiceCoverCopy') {
            this.getTranslatedValue('Contract', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'ContractNumber' });
                }
                else {
                    _this.columns.push({ title: 'Contract', name: 'ContractNumber' });
                }
            });
        }
        if (this.EnablePremiseLinking) {
            this.getTranslatedValue('Linked Contract', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'LinkedToContractNumber' });
                }
                else {
                    _this.columns.push({
                        title: 'Linked Contract', name: 'LinkedToContractNumber'
                    });
                }
            });
            this.getTranslatedValue('Linked Premises', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'LinkedToPremiseNumber' });
                }
                else {
                    _this.columns.push({
                        title: 'Linked Premises', name: 'LinkedToPremiseNumber'
                    });
                }
            });
        }
        if (this.parentMode === 'InvGrpPremiseMaintenance' || this.parentMode === 'InvoiceGroup' ||
            this.parentMode === 'InvoiceGroupGetAddress' || this.parentMode === 'Search' || this.parentMode === 'LookUp' || this.parentMode === 'PremiseCopy') {
            this.getTranslatedValue('Premises', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'PremiseNumber' });
                }
                else {
                    _this.columns.push({ title: 'Premises', name: 'PremiseNumber' });
                }
            });
            this.getTranslatedValue('Premises Name', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'PremiseName' });
                }
                else {
                    _this.columns.push({ title: 'Premises Name', name: 'PremiseName' });
                }
            });
        }
        if (this.parentMode !== 'PremisePostcodeSearch' && this.parentMode !== 'PremisePostcodeSearchNoSuburb') {
            this.getTranslatedValue('Address Line 1', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'PremiseAddressLine1' });
                }
                else {
                    _this.columns.push({ title: 'Address Line 1', name: 'PremiseAddressLine1' });
                }
            });
            this.getTranslatedValue('Town', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'PremiseAddressLine4' });
                }
                else {
                    _this.columns.push({ title: 'Town', name: 'PremiseAddressLine4' });
                }
            });
        }
        this.getTranslatedValue('Branch', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'ServiceBranchNumber' });
            }
            else {
                _this.columns.push({ title: 'Branch', name: 'ServiceBranchNumber' });
            }
        });
        this.getTranslatedValue('Status', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'PortfolioStatusDesc' });
            }
            else {
                _this.columns.push({ title: 'Status', name: 'PortfolioStatusDesc' });
            }
        });
        if (this.parentMode !== 'PremisePostcodeSearch' && this.parentMode !== 'PremisePostcodeSearchNoSuburb') {
            this.getTranslatedValue('Account', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'AccountNumber' });
                }
                else {
                    _this.columns.push({ title: 'Account', name: 'AccountNumber' });
                }
            });
            this.getTranslatedValue('Invoice Group', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'InvoiceGroupNumber' });
                }
                else {
                    _this.columns.push({ title: 'Invoice Group', name: 'InvoiceGroupNumber' });
                }
            });
        }
        this.buildTable();
    };
    PremiseSearchComponent.prototype.buildTable = function () {
        this.search.set('action', '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('ServiceBranchNumber', this.selectedServiceBranch);
        if (this.selectedStatus !== 'All' && this.selectedStatus !== 'AllCurrent') {
            this.search.set('PortfolioStatusCode', this.selectedStatus);
        }
        else {
            this.search.set('PortfolioStatusCode', '');
        }
        this.search.set('AccountNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber'));
        this.search.set('InvoiceGroupNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceGroupNumber'));
        this.search.set('PremisePostcode', '');
        this.search.set('PremiseAddressLine4', '');
        this.search.set('PremiseAddressLine5', '');
        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('PremiseNumber', '');
        this.search.set('PremisePostcodeSearch', this.riExchange.riInputElement.GetValue(this.uiForm, 'SearchPostcode'));
        this.queryParams.search = this.search;
        this.PremiseDetailTable.loadTableData(this.queryParams);
    };
    PremiseSearchComponent.prototype.tableRowClick = function (event) {
        if (this.parentMode === 'PremiseCopy') {
            this.copyPremisesSearch(event);
            return;
        }
        if (this.parentMode === 'InvoiceGroup') {
            this.riTable_BodyRecordSelected(event.row);
            return;
        }
        var returnObj = {
            'PremiseNumber': event.row.PremiseNumber,
            'PremiseName': event.row.PremiseName,
            'ContractNumber': event.row.ContractNumber
        };
        this.ellipsis.sendDataToParent(returnObj);
    };
    PremiseSearchComponent.prototype.copyPremisesSearch = function (data) {
        var _this = this;
        var postSearchParams = new URLSearchParams();
        var _formData = {};
        _formData['ContractNumber'] = data.row.ContractNumber;
        _formData['PremiseNumber'] = data.row.PremiseNumber;
        _formData['NewContractNumber'] = this.getControlValue('ContractNumber');
        _formData['FunctionName'] = 'PremiseCopy';
        postSearchParams.set(this.serviceConstants.Action, '6');
        postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, postSearchParams, _formData)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                }
                else {
                    _this.ellipsis.sendDataToParent(e);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PremiseSearchComponent.prototype.refresh = function () {
        this.PremiseDetailTable.clearTable();
        if ((this.trContractLine && this.getControlValue('ContractNumber')) || (!this.trContractLine && this.getControlValue('AccountNumber'))) {
            this.buildTableColumns();
        }
    };
    PremiseSearchComponent.prototype.StatusFilterSelectedValue = function (data) {
        this.selectedStatus = data;
    };
    PremiseSearchComponent.prototype.updateView = function (params) {
        this.inputParams = params;
        this.setControlValue('ContractNumber', params.ContractNumber);
        if (params.ContractNumber !== '') {
            this.setControlValue('ContractName', params.ContractName);
        }
        else {
            this.setControlValue('ContractName', '');
        }
        this.setControlValue('AccountNumber', params.AccountNumber);
        if (params.AccountNumber !== '') {
            this.setControlValue('AccountName', params.AccountName);
        }
        else {
            this.setControlValue('AccountName', '');
        }
        if (params.InvoiceGroupNumber) {
            this.setControlValue('InvoiceGroupNumber', params.InvoiceGroupNumber);
        }
        console.log('PARAMS: ' + JSON.stringify(params));
        this.parentMode = params.parentMode;
        if (params.CurrentContractType) {
            this.CurrentContractType = params.CurrentContractType;
        }
        this.tdAddRecord = params.showAddNew ? true : false;
        if (this.parentMode === 'PremiseCopy') {
            this.setControlValue('CopyAccountNumber', params.AccountNumber);
        }
        this.inputParamsBranchSearch.businessCode = params.businessCode || this.utils.getBusinessCode();
        this.inputParamsBranchSearch.countryCode = params.countryCode || this.utils.getCountryCode();
        this.getSysCharDtetails();
        this.windowOnload();
        this.refresh();
    };
    PremiseSearchComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharEnablePremiseLinking
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
            _this.vEnablePremiseLinking = record[0]['Required'];
        });
    };
    PremiseSearchComponent.prototype.ServiceBranchFilterSelectedValue = function (data) {
        this.selectedServiceBranch = data;
    };
    PremiseSearchComponent.prototype.onAddNewButtonClicked = function () {
        switch (this.parentMode) {
            case 'InvoiceGroup':
                this.navigate('Contract', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE);
                return;
        }
        var objForParent = {};
        objForParent.addMode = true;
        this.messageService.emitMessage(objForParent);
        this.ellipsis.closeModal();
    };
    PremiseSearchComponent.prototype.riTable_BodyRecordSelected = function (dataObj) {
        var vntReturnData = '';
        var SelectedContractTypeCode = '';
        switch (this.parentMode) {
            case 'Contract':
                break;
            case 'InvoiceGroup':
                switch (this.inputParamsBranchSearch.ContractTypeCode) {
                    case 'J':
                        var parameterData = {
                            'currentContractType': 'J',
                            'AccountNumber': dataObj.AccountNumber,
                            'ContractNumber': dataObj.ContractNumber,
                            'PremiseNumber': dataObj.PremiseNumber
                        };
                        this.navigate('IGSearch', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, parameterData);
                        break;
                    case 'C':
                        break;
                    case 'P':
                }
                break;
            case 'PremisePostcodeSearch':
            case 'PremisePostcodeSearchNoSuburb':
                break;
            case 'InvGrpPremiseMaintenance':
                break;
            case 'ShowPremisesOnInvoiceGroup':
                switch (this.inputParamsBranchSearch.ContractTypeCode) {
                    case 'J':
                        break;
                    case 'C':
                        break;
                    case 'P':
                        break;
                }
                break;
            case 'PremiseNumber01':
            case 'PremiseNumber02':
            case 'PremiseNumber03':
            case 'PremiseNumber04':
            case 'PremiseNumber05':
            case 'PremiseNumber06':
            case 'PremiseNumber07':
            case 'PremiseNumber08':
            case 'PremiseNumber09':
            case 'PremiseNumber10':
            case 'PremiseNumber11':
            case 'PremiseNumber12':
            case 'PremiseNumber13':
            case 'PremiseNumber14':
                break;
            case 'InvoiceGroupGetAddress':
            case 'AddInvoiceGroup':
                break;
            default:
            case 'PremiseCopy':
                switch (this.parentMode) {
                    case 'LookUp':
                        break;
                    case 'LookUp-Search':
                        break;
                    case 'LookUp-ProRataSearch':
                        break;
                    case 'LookUp-ContractHistory':
                        break;
                    case 'LookUp-ProRataChargeSummary':
                        break;
                    case 'InvoiceGroupGetAddress':
                    case 'AddInvoiceGroup':
                        break;
                    case 'LookUpRenegOldPremise':
                        break;
                    case 'LookUp-CopyPremiseNumber':
                    case 'ServiceCoverCopy':
                        break;
                    case 'CallCentreSearch':
                        break;
                    case 'Search-LinkedToPremise':
                        break;
                    case 'Search-ScannedPremise':
                        break;
                    default:
                }
        }
    };
    PremiseSearchComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-premise-search',
                    templateUrl: 'iCABSAPremiseSearch.html'
                },] },
    ];
    PremiseSearchComponent.ctorParameters = [
        { type: Injector, },
        { type: EllipsisComponent, },
        { type: ElementRef, },
        { type: CBBService, },
    ];
    PremiseSearchComponent.propDecorators = {
        'PremiseDetailTable': [{ type: ViewChild, args: ['PremiseDetailTable',] },],
        'inputParams': [{ type: Input },],
    };
    return PremiseSearchComponent;
}(BaseComponent));
