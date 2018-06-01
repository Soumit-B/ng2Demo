var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
export var RateMaintenanceComponent = (function (_super) {
    __extends(RateMaintenanceComponent, _super);
    function RateMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [
            { name: 'APICode', readonly: true, disabled: true, required: true },
            { name: 'APICodeDesc', readonly: true, disabled: true, required: true },
            { name: 'APIRateEffectDate', readonly: false, disabled: false, required: true },
            { name: 'APIRate', readonly: false, disabled: false, required: true }
        ];
        this.showHeader = true;
        this.queryParams = {
            operation: 'Business/iCABSBAPIRateMaintenance',
            module: 'api',
            method: 'contract-management/admin'
        };
        this.messages = {
            apiRateUpdateSuccess: MessageConstant.Message.RecordSavedSuccessfully,
            apiRateDeleteSuccess: MessageConstant.Message.RecordDeletedSuccessfully
        };
        this.pageId = PageIdentifier.ICABSBAPIRATEMAINTENANCE;
        this.pageTitle = 'API Rate Maintenance';
    }
    RateMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.fetchTranslatedContent();
        this.window_onload();
    };
    RateMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    RateMaintenanceComponent.prototype.fetchTranslatedContent = function () {
        var _this = this;
        this.getTranslatedValue(this.messages.apiRateUpdateSuccess, null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.messages.apiRateUpdateSuccess = res;
                }
            });
        });
        this.getTranslatedValue(this.messages.apiRateDeleteSuccess, null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.messages.apiRateDeleteSuccess = res;
                }
            });
        });
    };
    RateMaintenanceComponent.prototype.window_onload = function () {
        this.parentMode = this.riExchange.getParentMode();
        switch (this.parentMode) {
            case 'RowSelected':
                this.pageParams.mode = 'update';
                this.updateAPIRateForm();
                break;
            case 'SearchAdd':
                this.pageParams.mode = 'add';
                this.addApiRateForm();
                break;
            default:
                break;
        }
    };
    RateMaintenanceComponent.prototype.dateSelectedValue = function (value) {
        if (value && value.value) {
            this.uiForm.controls['APIRateEffectDate'].setValue(value.value);
        }
    };
    ;
    RateMaintenanceComponent.prototype.updateAPIRateForm = function () {
        var _this = this;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'APICode', this.riExchange.getParentHTMLValue('APICode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'APICodeDesc', this.riExchange.getParentHTMLValue('APICodeDesc'));
        this.setControlValue('APIRateEffectDate', this.riExchange.getParentHTMLValue('APIRateEffectDate'));
        this.effectDate = new Date(this.utils.convertDate(this.getControlValue('APIRateEffectDate')));
        this.dateDisable = true;
        this.pageParams.mode = 'update';
        this.parentMode = 'RowSelected';
        this.pageParams.isDeleteDisabled = false;
        this.pageParams.isAddDisabled = false;
        var lookupIP = [
            {
                'table': 'APIRate',
                'query': {
                    'APICode': this.riExchange.getParentHTMLValue('APICode'),
                    'BusinessCode': this.riExchange.getParentHTMLValue('BusinessCode'),
                    'APIRateEffectDate': this.getControlValue('APIRateEffectDate')
                },
                'fields': ['APIRate']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var result = data[0][0];
            if (result) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'APIRate', result.APIRate);
                _this.ROWID = result.ttAPIRate;
            }
        });
    };
    RateMaintenanceComponent.prototype.addApiRateForm = function () {
        this.pageParams.mode = 'add';
        this.riExchange.riInputElement.SetValue(this.uiForm, 'APICode', this.riExchange.getParentHTMLValue('APICode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'APICodeDesc', this.riExchange.getParentHTMLValue('APICodeDesc'));
        this.pageParams.isDeleteDisabled = true;
        this.resetForm();
        this.dateDisable = false;
        this.pageParams.isAddDisabled = true;
    };
    RateMaintenanceComponent.prototype.resetData = function () {
        if (this.pageParams.mode === 'add') {
            if (this.parentMode === 'SearchAdd') {
                this.addApiRateForm();
                this.resetForm();
            }
            else {
                this.updateAPIRateForm();
            }
        }
        else if (this.pageParams.mode === 'update') {
            this.updateAPIRateForm();
        }
        else {
            return;
        }
    };
    RateMaintenanceComponent.prototype.resetForm = function () {
        this.APIRateEffectDatePicker.dtDisplay = '';
        this.effectDate = null;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'APIRate', '');
        this.uiForm.controls['APIRate'].markAsUntouched();
        this.uiForm.controls['APIRateEffectDate'].markAsUntouched();
    };
    RateMaintenanceComponent.prototype.saveData = function () {
        this.uiForm.controls['APIRate'].markAsTouched();
        this.uiForm.controls['APIRateEffectDate'].markAsTouched();
        this.APIRateEffectDatePicker.validateDateField();
        if (this.uiForm.valid) {
            this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
            this.promptConfirmModal.show();
        }
    };
    RateMaintenanceComponent.prototype.deleteData = function (obj) {
        this.promptConfirmContent = MessageConstant.Message.DeleteRecord;
        this.promptConfirmModalDelete.show();
    };
    RateMaintenanceComponent.prototype.promptConfirm = function (type) {
        var formdData = {};
        formdData['APICode'] = this.uiForm.controls['APICode'].value;
        switch (type) {
            case 'save':
                formdData['APIRate'] = this.uiForm.controls['APIRate'].value;
                if (this.pageParams.mode === 'update' && this.ROWID !== '') {
                    formdData['ROWID'] = this.ROWID;
                    this.saveAPIRate(formdData);
                }
                else {
                    formdData['ROWID'] = '';
                    formdData['APICode'] = this.uiForm.controls['APICode'].value;
                    formdData['APIRateEffectDate'] = this.uiForm.controls['APIRateEffectDate'].value;
                    this.addAPIRate(formdData);
                }
                break;
            case 'delete':
                formdData['APIRate'] = this.uiForm.controls['APIRate'].value;
                formdData['APICode'] = this.uiForm.controls['APICode'].value;
                formdData['ROWID'] = this.ROWID;
                this.deleteAPIRate(formdData);
                break;
            default:
                break;
        }
    };
    RateMaintenanceComponent.prototype.saveAPIRate = function (data) {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, data)
            .subscribe(function (e) {
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.messageModal.show({ msg: e['errorMessage'], title: 'Error' }, false);
                }
                else {
                    if (e['fullError']) {
                        _this.messageModal.show({ msg: e['fullError'], title: 'Error' }, false);
                        return;
                    }
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'APIRate', e.APIRate);
                    _this.riExchange.setParentHTMLValue('APIRateEffectDate', _this.utils.formatDate(e.APIRateEffectDate));
                    _this.riExchange.setParentHTMLValue('BusinessCode', e.BusinessCode);
                    _this.messageModal.show({ msg: _this.messages.apiRateUpdateSuccess, title: 'Message' }, false);
                    _this.uiForm.controls['APICode'].disable();
                    _this.pageParams.mode = 'update';
                    _this.parentMode = 'RowSelected';
                    _this.pageParams.isDeleteDisabled = false;
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    RateMaintenanceComponent.prototype.deleteAPIRate = function (data) {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '3');
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, data)
            .subscribe(function (e) {
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.messageModal.show({ msg: e['errorMessage'], title: 'Error' }, false);
                }
                else {
                    if (e['fullError']) {
                        _this.messageModal.show({ msg: e['fullError'], title: 'Error' }, false);
                        return;
                    }
                    _this.messageModal.show({ msg: _this.messages.apiRateDeleteSuccess, title: 'Message' }, false);
                    _this.uiForm.controls['APICode'].disable();
                    _this.uiForm.controls['APICodeDesc'].disable();
                    _this.pageParams.isDeleteDisabled = false;
                    _this.pageParams.mode = 'add';
                    _this.parentMode = 'SearchAdd';
                    _this.addApiRateForm();
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    RateMaintenanceComponent.prototype.addAPIRate = function (data) {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '1');
        this.ajaxSource.next(AjaxConstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, data)
            .subscribe(function (e) {
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.messageModal.show({ msg: e['errorMessage'], title: 'Error' }, false);
                }
                else {
                    if (e['fullError']) {
                        _this.messageModal.show({ msg: e['fullError'], title: 'Error' }, false);
                        return;
                    }
                    _this.messageModal.show({ msg: _this.messages.apiRateUpdateSuccess, title: 'Message' }, false);
                    _this.uiForm.controls['APICode'].disable();
                    _this.riExchange.setParentHTMLValue('APIRateEffectDate', _this.utils.formatDate(e.APIRateEffectDate));
                    _this.riExchange.setParentHTMLValue('BusinessCode', e.BusinessCode);
                    _this.pageParams.isDeleteDisabled = false;
                    _this.pageParams.mode = 'update';
                    _this.ROWID = e.ttAPIRate;
                    _this.updateAPIRateForm();
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    RateMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBAPIRateMaintenance.html'
                },] },
    ];
    RateMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    RateMaintenanceComponent.propDecorators = {
        'APIRateEffectDatePicker': [{ type: ViewChild, args: ['APIRateEffectDatePicker',] },],
        'promptConfirmModal': [{ type: ViewChild, args: ['promptConfirmModal',] },],
        'promptConfirmModalDelete': [{ type: ViewChild, args: ['promptConfirmModalDelete',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return RateMaintenanceComponent;
}(BaseComponent));
