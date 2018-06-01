var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { MessageConstant } from './../../../../shared/constants/message.constant';
export var SystemParameterMaintenanceComponent = (function (_super) {
    __extends(SystemParameterMaintenanceComponent, _super);
    function SystemParameterMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.search = new URLSearchParams();
        this.method = 'it-functions/admin';
        this.module = 'configuration';
        this.operation = 'System/iCABSSSystemParameterMaintenance';
        this.isFormEnabled = false;
        this.isFormValid = false;
        this.controls = [
            { name: 'SystemParameterEndOFWeekDay', readonly: false, disabled: false, required: true },
            { name: 'CentralDocumentServer', readonly: false, disabled: false, required: true },
            { name: 'ReportServer', readonly: false, disabled: false, required: true },
            { name: 'PCDocumentDirectory', readonly: false, disabled: false, required: true },
            { name: 'UnixExportDirectory', readonly: false, disabled: false, required: true },
            { name: 'BatchProcessEmail', readonly: false, disabled: false, required: true },
            { name: 'SystemPerformanceEmail', readonly: false, disabled: false, required: true },
            { name: 'SystemPerformanceMaxDuration', readonly: false, disabled: false, required: true },
            { name: 'NextSiteReviewNumberOfMonths', readonly: false, disabled: false, required: true },
            { name: 'OACompanyNumber', readonly: false, disabled: false, required: true },
            { name: 'OADatabaseName', readonly: false, disabled: false, required: true },
            { name: 'OAConnectionString', readonly: false, disabled: false, required: true },
            { name: 'OASalesLedger', readonly: false, disabled: false, required: false },
            { name: 'OAGeneralLedger', readonly: false, disabled: false, required: false },
            { name: 'HTTPProxyHost', readonly: false, disabled: false, required: false },
            { name: 'HTTPProxyPort', readonly: false, disabled: false, required: false },
            { name: 'NextBPayNumber', readonly: false, disabled: false, required: false }
        ];
        this.pageId = PageIdentifier.ICABSSSYSTEMPARAMETERMAINTENANCE;
    }
    SystemParameterMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.getFormData();
    };
    SystemParameterMaintenanceComponent.prototype.getFormData = function () {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.ajaxSubscription = this.httpService.makeGetRequest(this.method, this.module, this.operation, this.search)
            .subscribe(function (data) {
            if (data.errorMessage) {
                _this.errorService.emitError(data);
            }
            else {
                var systemParameterKey = data.SystemParameterKey;
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SystemParameterEndOFWeekDay', data.SystemParameterEndOfWeekDay);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'CentralDocumentServer', data.CentralDocumentServer);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ReportServer', data.ReportServer);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PCDocumentDirectory', data.PCDocumentDirectory);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'UnixExportDirectory', data.UnixExportDirectory);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BatchProcessEmail', data.BatchProcessEmail);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SystemPerformanceEmail', data.SystemPerformanceEmail);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SystemPerformanceMaxDuration', data.SystemPerformanceMaxDuration);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'NextSiteReviewNumberOfMonths', data.NextSiteReviewNumberOfMonths);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'OACompanyNumber', data.OACompanyNumber);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'OADatabaseName', data.OADatabaseName);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'OAConnectionString', data.OAConnectionString);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'OASalesLedger', data.OASalesLedger);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'OAGeneralLedger', data.OAGeneralLedger);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'HTTPProxyHost', data.HTTPProxyHost);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'HTTPProxyPort', data.HTTPProxyPort);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'NextBPayNumber', data.NextBPayNumber);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    SystemParameterMaintenanceComponent.prototype.saveParameterMaintenance = function (event) {
        var _this = this;
        var formdata = {};
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        formdata['SystemParameterEndOFWeekDay'] = this.uiForm.controls['SystemParameterEndOFWeekDay'].value;
        formdata['CentralDocumentServer'] = this.uiForm.controls['CentralDocumentServer'].value;
        formdata['ReportServer'] = this.uiForm.controls['ReportServer'].value;
        formdata['PCDocumentDirectory'] = this.uiForm.controls['PCDocumentDirectory'].value;
        formdata['UnixExportDirectory'] = this.uiForm.controls['UnixExportDirectory'].value;
        formdata['BatchProcessEmail'] = this.uiForm.controls['BatchProcessEmail'].value;
        formdata['SystemPerformanceEmail'] = this.uiForm.controls['SystemPerformanceEmail'].value;
        formdata['SystemPerformanceMaxDuration'] = this.uiForm.controls['SystemPerformanceMaxDuration'].value;
        formdata['NextSiteReviewNumberOfMonths'] = this.uiForm.controls['NextSiteReviewNumberOfMonths'].value;
        formdata['OACompanyNumber'] = this.uiForm.controls['OACompanyNumber'].value;
        formdata['OADatabaseName'] = this.uiForm.controls['OADatabaseName'].value;
        formdata['OAConnectionString'] = this.uiForm.controls['OAConnectionString'].value;
        formdata['OASalesLedger'] = this.uiForm.controls['OASalesLedger'].value;
        formdata['OAGeneralLedger'] = this.uiForm.controls['OAGeneralLedger'].value;
        formdata['HTTPProxyHost'] = this.uiForm.controls['HTTPProxyHost'].value;
        formdata['HTTPProxyPort'] = this.uiForm.controls['HTTPProxyPort'].value;
        formdata['NextBPayNumber'] = this.uiForm.controls['NextBPayNumber'].value;
        if (this.uiForm.valid) {
            this.ajaxSource.next(this.ajaxconstant.START);
            this.ajaxSubscription = this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
                .subscribe(function (e) {
                if (e.status === 'failure') {
                    _this.errorService.emitError(e.oResponse);
                }
                else {
                    if (e.errorMessage && e.errorMessage !== '') {
                        setTimeout(function () {
                            _this.errorService.emitError(e);
                        }, 200);
                    }
                    else {
                        _this.messageService.emitMessage(e);
                    }
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: 'Message' }, false);
                _this.getFormData();
            }, function (error) {
                _this.errorMessage = error;
                _this.errorService.emitError(error);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    SystemParameterMaintenanceComponent.prototype.resetData = function () {
        this.getFormData();
    };
    SystemParameterMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        this.ajaxSubscription.unsubscribe();
    };
    SystemParameterMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSSystemParameterMaintenance.html'
                },] },
    ];
    SystemParameterMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    SystemParameterMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return SystemParameterMaintenanceComponent;
}(BaseComponent));
