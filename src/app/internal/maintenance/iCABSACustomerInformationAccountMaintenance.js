var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, ViewChild } from '@angular/core';
export var CustomerInformationAccountMaintenanceComponent = (function (_super) {
    __extends(CustomerInformationAccountMaintenanceComponent, _super);
    function CustomerInformationAccountMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [
            { name: 'GroupAccountNumber', disabled: true },
            { name: 'GroupName', disabled: true },
            { name: 'AccountNumber', disabled: true },
            { name: 'AccountName', disabled: true },
            { name: 'ContractNumber', disabled: true },
            { name: 'ContractName', disabled: true },
            { name: 'CustomerInfoNumber', required: true },
            { name: 'InfoLevel' },
            { name: 'CallingProg' }
        ];
        this.showGroupAccountNumber = true;
        this.showAccountNumber = true;
        this.showContractNumber = true;
        this.queryParams = {
            operation: 'Application/iCABSACustomerInformationAccountMaintenance',
            module: 'customer',
            method: 'contract-management/maintenance'
        };
        this.pageId = PageIdentifier.ICABSACUSTOMERINFORMATIONACCOUNTMAINTENANCE;
    }
    CustomerInformationAccountMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = '';
        this.windowOnLoad();
    };
    CustomerInformationAccountMaintenanceComponent.prototype.windowOnLoad = function () {
        this.setControlValue('GroupAccountNumber', this.riExchange.getParentHTMLValue('GroupAccountNumber'));
        this.setControlValue('GroupName', this.riExchange.getParentHTMLValue('GroupName'));
        this.setControlValue('AccountNumber', this.riExchange.getParentHTMLValue('AccountNumber'));
        this.setControlValue('AccountName', this.riExchange.getParentHTMLValue('AccountName'));
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('CallingProg', this.riExchange.getParentHTMLValue('CallingProg'));
        this.setFormMode(this.c_s_MODE_UPDATE);
        switch (this.getControlValue('CallingProg')) {
            case 'GroupAccount':
                this.showAccountNumber = false;
                this.showContractNumber = false;
                break;
            case 'Account':
                this.showGroupAccountNumber = false;
                this.showContractNumber = false;
                break;
            case 'Contract':
                this.showGroupAccountNumber = false;
                this.showAccountNumber = false;
                break;
        }
    };
    CustomerInformationAccountMaintenanceComponent.prototype.saveData = function () {
        var _this = this;
        if (this.riExchange.validateForm(this.uiForm)) {
            this.ajaxSource.next(this.ajaxconstant.START);
            var searchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
            searchParams.set(this.serviceConstants.Action, '1');
            var bodyParams = {};
            bodyParams['CallingProg'] = this.riExchange.getParentHTMLValue('CallingProg');
            bodyParams['AccountName'] = this.riExchange.getParentHTMLValue('AccountName');
            bodyParams['ContractName'] = this.riExchange.getParentHTMLValue('ContractName');
            bodyParams['GroupName'] = this.riExchange.getParentHTMLValue('GroupName');
            bodyParams['CustomerInfoNumber'] = this.getControlValue('CustomerInfoNumber');
            switch (this.getControlValue('CallingProg')) {
                case 'GroupAccount':
                    bodyParams['GroupAccountNumber'] = this.getControlValue('GroupAccountNumber');
                    break;
                case 'Account':
                    bodyParams['AccountNumber'] = this.getControlValue('AccountNumber');
                    break;
                case 'Contract':
                    bodyParams['ContractNumber'] = this.getControlValue('ContractNumber');
                    break;
            }
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams).subscribe(function (data) {
                if (data.errorMessage) {
                    _this.messageModal.show({ msg: data.errorMessage, title: 'Message' }, false);
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                }
                else {
                    console.log('success', data);
                    _this.riExchange.setParentHTMLValue('CustomerPassNumber', data.CustomerInfoNumber);
                    _this.riExchange.setParentHTMLValue('CustomerPassLevel', data.InfoLevel);
                    _this.messageModal.show({ msg: 'iCABSACustomerInformationMaintenance Page Under Construction', title: 'Message' }, false);
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                }
            });
        }
    };
    CustomerInformationAccountMaintenanceComponent.prototype.cancelData = function () {
        this.setControlValue('CustomerInfoNumber', '');
    };
    CustomerInformationAccountMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    CustomerInformationAccountMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSACustomerInformationAccountMaintenance.html'
                },] },
    ];
    CustomerInformationAccountMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    CustomerInformationAccountMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return CustomerInformationAccountMaintenanceComponent;
}(BaseComponent));
