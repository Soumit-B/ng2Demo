var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, ViewChild } from '@angular/core';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
export var ContractSelectMaintenanceComponent = (function (_super) {
    __extends(ContractSelectMaintenanceComponent, _super);
    function ContractSelectMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [
            { name: 'ContractNumber', disabled: false },
            { name: 'ContractName', disabled: true },
            { name: 'AccountNumber', disabled: true },
            { name: 'Status', disabled: true },
            { name: 'ContractCommenceDate', disabled: true },
            { name: 'NegBranchNumber', disabled: true },
            { name: 'ContractAnnualValue', disabled: true },
            { name: 'CurrentPremises', disabled: true },
            { name: 'InvoiceAnnivDate', disabled: true },
            { name: 'InvoiceFrequencyCode', disabled: true },
            { name: 'LostBusinessNoticePeriod', disabled: true }
        ];
        this.queryParams = {
            operation: 'Application/iCABSAContractSelectMaintenance',
            module: 'contract',
            method: 'contract-management/maintenance'
        };
        this.contractSearchParams = {
            'parentMode': 'LookUp',
            'showAddNew': false,
            'currentContractType': 'C',
            'currentContractTypeURLParameter': '<contract>'
        };
        this.showCloseButton = true;
        this.contractSearchComponent = ContractSearchComponent;
        this.isContractEllipsisDisabled = false;
        this.showMessageHeader = true;
        this.showCancel = false;
        this.showHeader = true;
        this.ismenudisabled = true;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.pageId = PageIdentifier.ICABSACONTRACTSELECTMAINTENANCE;
        this.contractSearchComponent = ContractSearchComponent;
    }
    ;
    ContractSelectMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Contract Select';
        this.windowOnLoad();
    };
    ContractSelectMaintenanceComponent.prototype.ngAfterViewInit = function () {
        if (this.getControlValue('ContractNumber').trim() !== '') {
            this.autoOpenSearch = false;
            this.doLookupformData();
        }
        else {
            this.autoOpenSearch = true;
        }
    };
    ContractSelectMaintenanceComponent.prototype.windowOnLoad = function () {
        if (this.parentMode === 'CallCentreSearchNew') {
            this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
            this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
            this.doLookupformData();
        }
        else if (this.parentMode === 'ContactManagement') {
            this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
            this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
            this.doLookupformData();
        }
        if (this.riExchange.getRouterParams()['fromMenu']) {
            this.pending = true;
            this.viewTypesArray = [
                { text: 'Options', value: '' },
                { text: 'Contract', value: 'Contract' },
                { text: 'Request', value: 'Request' }];
        }
        else {
            this.viewTypesArray = [
                { text: 'Options', value: '' },
                { text: 'Request', value: 'Request' }];
        }
    };
    ContractSelectMaintenanceComponent.prototype.doLookupformData = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')
                },
                'fields': ['ContractName', 'ContractCommenceDate', 'ContractAnnualValue', 'CurrentPremises', 'AccountNumber', 'NegBranchNumber', 'InvoiceAnnivDate',
                    'InvoiceFrequencyCode', 'LostBusinessNoticePeriod']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data[0].length > 0) {
                var contractdata = data[0][0];
                _this.setControlValue('ContractName', contractdata.ContractName);
                _this.setControlValue('AccountNumber', contractdata.AccountNumber);
                _this.setControlValue('ContractCommenceDate', _this.utils.formatDate(contractdata.ContractCommenceDate));
                _this.setControlValue('NegBranchNumber', contractdata.NegBranchNumber);
                _this.setControlValue('ContractAnnualValue', contractdata.ContractAnnualValue);
                _this.setControlValue('CurrentPremises', contractdata.CurrentPremises);
                _this.setControlValue('InvoiceAnnivDate', _this.utils.formatDate(contractdata.InvoiceAnnivDate));
                _this.setControlValue('InvoiceFrequencyCode', contractdata.InvoiceFrequencyCode);
                _this.setControlValue('LostBusinessNoticePeriod', contractdata.LostBusinessNoticePeriod);
            }
            else {
                var cnumber = _this.getControlValue('ContractNumber');
                _this.uiForm.reset();
                _this.setControlValue('ContractNumber', cnumber);
            }
        });
        this.ajaxSource.next(this.ajaxconstant.START);
        var searchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        searchParams.set(this.serviceConstants.Action, '6');
        searchParams.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        var bodyParams = {};
        bodyParams['Function'] = 'GetStatus';
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams).subscribe(function (data) {
            if (data.ErrorMessageDesc !== '') {
                _this.ismenudisabled = true;
                _this.confirmstatusOkModal.show({ msg: data.errorMessage, title: 'Message' }, false);
                if (data.Status !== '') {
                    _this.ismenudisabled = false;
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'Status', data.Status);
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }
            else {
                _this.ismenudisabled = false;
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'Status', data.Status);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }
        });
    };
    ContractSelectMaintenanceComponent.prototype.onContractDataReceived = function (data) {
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.doLookupformData();
        this.setFormMode('update');
    };
    ContractSelectMaintenanceComponent.prototype.onContractChange = function () {
        if (this.getControlValue('ContractNumber').trim() === '') {
            this.uiForm.reset();
        }
        else {
            this.doLookupformData();
        }
    };
    ContractSelectMaintenanceComponent.prototype.onDataChanged = function (data) {
        this.doLookupformData();
    };
    ContractSelectMaintenanceComponent.prototype.onViewTypeCodeChange = function (viewType) {
        if (viewType === 'Contract') {
            this.parentMode = 'Request';
            this.navigate('Request', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                parentMode: 'Request',
                ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName')
            });
        }
        else if (viewType === 'Request') {
            if (this.pending || this.parentMode === 'CallCentreSearchNew') {
                this.parentMode = 'Contract';
                if (this.riExchange.URLParameterContains('CurrentOnly')) {
                    this.confirmstatusOkModal.show({ msg: 'page is under construction', title: 'Message' }, false);
                }
                else if (this.parentMode === 'ContactManagement') {
                    this.confirmstatusOkModal.show({ msg: 'page is under construction', title: 'Message' }, false);
                }
                else {
                    this.confirmstatusOkModal.show({ msg: 'page is under construction', title: 'Message' }, false);
                }
            }
        }
    };
    ContractSelectMaintenanceComponent.prototype.ngOnDestroy = function () {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        _super.prototype.ngOnDestroy.call(this);
    };
    ContractSelectMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAContractSelectMaintenance.html'
                },] },
    ];
    ContractSelectMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    ContractSelectMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'confirmstatusOkModal': [{ type: ViewChild, args: ['confirmstatusOkModal',] },],
    };
    return ContractSelectMaintenanceComponent;
}(BaseComponent));
