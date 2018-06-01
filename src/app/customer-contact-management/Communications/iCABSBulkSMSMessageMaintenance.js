var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { CCMModuleRoutes } from './../../base/PageRoutes';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OccupationSearchComponent } from './../../internal/search/iCABSSOccupationSearch.component';
import { URLSearchParams } from '@angular/http';
export var BulkSMSMessageMaintenanceComponent = (function (_super) {
    __extends(BulkSMSMessageMaintenanceComponent, _super);
    function BulkSMSMessageMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.occSearchComponent = OccupationSearchComponent;
        this.pageTitle = '';
        this.showHeader = true;
        this.showErrorHeader = true;
        this.modalTitle = '';
        this.showMessageHeader = true;
        this.queryParams = {
            operation: 'ContactManagement/iCABSBulkSMSMessageMaintenance',
            module: 'notification',
            methodtype: 'ccm/maintenance',
            action: '1'
        };
        this.inputParamsOccupationalSearch = {
            'parentMode': 'LookUp-String',
            'OccupationCodeString': null
        };
        this.controls = [
            { name: 'OccupationCode', required: true },
            { name: 'Message', required: true }
        ];
        this.pageId = PageIdentifier.ICABSBULKSMSMESSAGEMAINTENANCE;
    }
    BulkSMSMessageMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.window_onload();
    };
    BulkSMSMessageMaintenanceComponent.prototype.ngAfterViewInit = function () {
        this.setMessageCallback(this);
        this.autoOpen = true;
    };
    BulkSMSMessageMaintenanceComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show(data, true);
    };
    ;
    BulkSMSMessageMaintenanceComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };
    ;
    BulkSMSMessageMaintenanceComponent.prototype.onOccupationDataReturn = function (data) {
        var val = '';
        if (data) {
            val = this.getControlValue('OccupationCode');
            if (val) {
                val = val + ',' + data;
            }
            else {
                val = data;
            }
            this.setControlValue('OccupationCode', val);
            this.occupationSearchOnChange(val);
            this.setFormMode(this.c_s_MODE_UPDATE);
        }
    };
    BulkSMSMessageMaintenanceComponent.prototype.window_onload = function () {
        this.setPageTitle(this.router.url);
    };
    BulkSMSMessageMaintenanceComponent.prototype.setPageTitle = function (url) {
        var lvl = '';
        if (url) {
            if (url.search(CCMModuleRoutes.SENDBULKSMSBUSINESS) !== -1) {
                lvl = ' - Business';
            }
            else if (url.search(CCMModuleRoutes.SENDBULKSMSBRANCH) !== -1) {
                lvl = ' - Branch';
            }
            else if (url.search(CCMModuleRoutes.SENDBULKSMSACCOUNT) !== -1) {
                lvl = ' - Account';
            }
            this.pageTitle = this.pageTitle.concat(lvl);
        }
    };
    BulkSMSMessageMaintenanceComponent.prototype.occupationSearchOnChange = function (data) {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OccupationCode', true);
        if (data) {
            this.setControlValue('OccupationCode', data);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'OccupationCode', false);
        }
        else {
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'OccupationCode', true);
        }
    };
    BulkSMSMessageMaintenanceComponent.prototype.smsMsgOnChange = function (data) {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'Message', true);
        if (data.trim().length !== 0) {
            this.setControlValue('Message', data);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'Message', false);
        }
        else {
            this.setControlValue('Message', '');
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'Message', true);
        }
    };
    BulkSMSMessageMaintenanceComponent.prototype.save = function () {
        var _this = this;
        var occCode = this.getControlValue('OccupationCode');
        var msg = this.getControlValue('Message');
        if (msg.trim().length !== 0 && occCode.trim().length !== 0) {
            this.ajaxSource.next(this.ajaxconstant.START);
            var searchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
            searchParams.set(this.serviceConstants.Action, this.queryParams.action);
            searchParams.set('OccupationCodeString', occCode);
            searchParams.set('SMSMessageText', msg);
            this.httpService.makeGetRequest(this.queryParams.methodtype, this.queryParams.module, this.queryParams.operation, searchParams).subscribe(function (data) {
                if (data.hasError) {
                    _this.errorService.emitError(data);
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.errorService.emitError(error);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
        else {
            this.setControlValue('Message', '');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OccupationCode', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'Message', true);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'OccupationCode', true);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'Message', true);
        }
    };
    BulkSMSMessageMaintenanceComponent.prototype.cancel = function () {
        this.setControlValue('OccupationCode', '');
        this.setControlValue('Message', '');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'OccupationCode', false);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'Message', false);
        this.setFormMode(this.c_s_MODE_SELECT);
    };
    BulkSMSMessageMaintenanceComponent.prototype.occupationCodekey_down = function (data) {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OccupationCode', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'OccupationCode', false);
    };
    BulkSMSMessageMaintenanceComponent.prototype.smsMsgkey_down = function (data) {
        if (data.trim().length !== 0) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'Message', true);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'Message', false);
        }
    };
    BulkSMSMessageMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBulkSMSMessageMaintenance.html'
                },] },
    ];
    BulkSMSMessageMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    BulkSMSMessageMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return BulkSMSMessageMaintenanceComponent;
}(BaseComponent));
