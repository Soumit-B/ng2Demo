var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { ICABSBAPICodeSearchComponent } from '../../internal/search/iCABSBAPICodeSearchComponent';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
export var APICodeMaintenanceComponent = (function (_super) {
    __extends(APICodeMaintenanceComponent, _super);
    function APICodeMaintenanceComponent(injector, _router) {
        _super.call(this, injector);
        this._router = _router;
        this.pageId = '';
        this.showHeader = true;
        this.queryParams = {
            operation: 'Business/iCABSBAPICodeMaintenance',
            module: 'api',
            method: 'contract-management/admin'
        };
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.autoOpenSearch = false;
        this.currentContractType = '';
        this.recievedAPICodeDesc = '';
        this.APICodeSearchParams = {
            'parentMode': 'Search'
        };
        this.isDisabledEllipsis = false;
        this.isDisabledDetailButton = true;
        this.searchModalRoute = '';
        this.searchPageRoute = '';
        this.showCloseButton = true;
        this.apiSearchComponent = ICABSBAPICodeSearchComponent;
        this.controls = [
            { name: 'APICode', readonly: true, disabled: true, required: true },
            { name: 'APICodeDesc', readonly: true, disabled: true, required: true }
        ];
        this.pageId = PageIdentifier.ICABSBAPICODEMAINTENANCE;
    }
    APICodeMaintenanceComponent.prototype.onAPICodeDataReceived = function (Obj) {
        if (Obj.mode && Obj.mode === 'add') {
            this.pageParams.mode = 'add';
            this.resetForm();
            this.uiForm.controls['APICode'].enable();
            this.uiForm.controls['APICodeDesc'].enable();
            this.pageParams.isDeleteDisabled = true;
            this.setFormMode(this.c_s_MODE_ADD);
            this.isDisabledEllipsis = true;
            this.pageParams.isSaveDisabled = false;
            this.pageParams.isCancelDisabled = false;
            this.isDisabledDetailButton = true;
        }
        else {
            this.uiForm.controls['APICode'].setValue(Obj.APICode);
            this.uiForm.controls['APICodeDesc'].setValue(Obj.APICodeDesc);
            this.recievedAPICodeDesc = Obj.APICodeDesc;
            this.uiForm.controls['APICodeDesc'].enable();
            this.uiForm.controls['APICode'].disable();
            this.pageParams.mode = 'update';
            this.attributes.ROWID = Obj.ttAPICode;
            this.pageParams.isDeleteDisabled = false;
            this.isDisabledDetailButton = false;
            this.isDisabledEllipsis = false;
            this.pageParams.isSaveDisabled = false;
            this.pageParams.isCancelDisabled = false;
            this.setFormMode(this.c_s_MODE_UPDATE);
        }
    };
    APICodeMaintenanceComponent.prototype.updateAPICode = function (data) {
        var _this = this;
        this.searchParams = new URLSearchParams();
        this.searchParams.set(this.serviceConstants.Action, '2');
        this.searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.searchParams, data)
            .subscribe(function (e) {
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorService.emitError(e['errorMessage']);
                }
                else {
                    _this.messageModal.show({ msg: 'API Code updated successfully!', title: 'Message' }, false);
                    _this.uiForm.controls['APICode'].disable();
                    _this.pageParams.isDeleteDisabled = false;
                    _this.pageParams.isSaveDisabled = false;
                    _this.pageParams.isCancelDisabled = false;
                    _this.isDisabledEllipsis = false;
                    _this.isDisabledDetailButton = false;
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    APICodeMaintenanceComponent.prototype.deleteAPICode = function (data) {
        var _this = this;
        this.searchParams = new URLSearchParams();
        this.searchParams.set(this.serviceConstants.Action, '3');
        this.searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.searchParams, data)
            .subscribe(function (e) {
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorService.emitError(e['errorMessage']);
                }
                else {
                    _this.messageModal.show({ msg: 'APICode deleted successfully!', title: 'Message' }, false);
                    _this.uiForm.controls['APICode'].disable();
                    _this.uiForm.controls['APICodeDesc'].disable();
                    _this.pageParams.isDeleteDisabled = true;
                    _this.pageParams.isSaveDisabled = true;
                    _this.pageParams.isCancelDisabled = true;
                    _this.isDisabledDetailButton = true;
                    _this.resetForm();
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    APICodeMaintenanceComponent.prototype.addAPICode = function (data) {
        var _this = this;
        this.searchParams = new URLSearchParams();
        this.searchParams.set(this.serviceConstants.Action, '1');
        this.searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSource.next(AjaxConstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.searchParams, data)
            .subscribe(function (e) {
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                var errMsg = '';
                if (e['errorMessage']) {
                    errMsg = e['errorMessage'];
                }
                else if (e['fullError']) {
                    errMsg = e['fullError'];
                }
                else {
                    errMsg = '';
                }
                if (errMsg !== '') {
                    _this.messageModal.show({ msg: errMsg, title: 'Message' }, false);
                }
                else {
                    _this.messageModal.show({ msg: 'APICode added successfully!', title: 'Message' }, false);
                    _this.uiForm.controls['APICode'].disable();
                    _this.pageParams.isDeleteDisabled = false;
                    _this.pageParams.isSaveDisabled = false;
                    _this.pageParams.isCancelDisabled = false;
                    _this.isDisabledEllipsis = false;
                    _this.isDisabledDetailButton = false;
                    _this.autoOpenSearch = false;
                    _this.pageParams.mode = 'update';
                    _this.recievedAPICodeDesc = data['APICodeDesc'];
                    _this.attributes.ROWID = e.ttAPICode;
                    _this.setFormMode(_this.c_s_MODE_UPDATE);
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    APICodeMaintenanceComponent.prototype.saveData = function () {
        for (var c in this.uiForm.controls) {
            if (this.uiForm.controls.hasOwnProperty(c)) {
                if (typeof this.uiForm.controls[c].value === 'undefined') {
                    this.uiForm.controls[c].setValue('');
                }
                this.uiForm.controls[c].markAsTouched();
            }
        }
        if (this.uiForm.valid) {
            this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
            this.promptConfirmModal.show();
        }
    };
    APICodeMaintenanceComponent.prototype.promptConfirm = function (type) {
        var formdData = {};
        formdData['APICode'] = this.uiForm.controls['APICode'].value;
        switch (type) {
            case 'save':
                formdData['APICodeDesc'] = this.uiForm.controls['APICodeDesc'].value;
                if (this.pageParams.mode === 'update' && this.attributes.ROWID !== '') {
                    formdData['ROWID'] = this.attributes.ROWID;
                    this.updateAPICode(formdData);
                }
                else {
                    this.addAPICode(formdData);
                }
                break;
            case 'delete':
                formdData['ROWID'] = this.attributes.ROWID;
                this.deleteAPICode(formdData);
                break;
            default:
                break;
        }
    };
    APICodeMaintenanceComponent.prototype.deleteData = function (obj) {
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        this.promptConfirmModalDelete.show();
    };
    APICodeMaintenanceComponent.prototype.goDetails = function () {
        this.router.navigate(['application/apiRateSearch'], { queryParams: { APICode: this.uiForm.controls['APICode'].value, APICodeDesc: this.uiForm.controls['APICodeDesc'].value } });
    };
    APICodeMaintenanceComponent.prototype.resetData = function () {
        if (this.pageParams.mode === 'add') {
            this.resetForm();
            this.isDisabledEllipsis = false;
            this.uiForm.controls['APICode'].disable();
            this.uiForm.controls['APICodeDesc'].disable();
        }
        else if (this.pageParams.mode === 'update') {
            this.uiForm.controls['APICodeDesc'].setValue(this.recievedAPICodeDesc);
        }
        else {
            return;
        }
    };
    APICodeMaintenanceComponent.prototype.resetForm = function () {
        this.uiForm.controls['APICode'].setValue('');
        this.uiForm.controls['APICodeDesc'].setValue('');
        this.pageParams.isSaveDisabled = true;
        this.pageParams.isCancelDisabled = true;
    };
    APICodeMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageParams.isDeleteDisabled = true;
        this.pageParams.isSaveDisabled = true;
        this.pageParams.isCancelDisabled = true;
    };
    APICodeMaintenanceComponent.prototype.ngAfterViewInit = function () {
        this.autoOpenSearch = true;
    };
    APICodeMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBAPICodeMaintenance.html'
                },] },
    ];
    APICodeMaintenanceComponent.ctorParameters = [
        { type: Injector, },
        { type: Router, },
    ];
    APICodeMaintenanceComponent.propDecorators = {
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptConfirmModal': [{ type: ViewChild, args: ['promptConfirmModal',] },],
        'promptConfirmModalDelete': [{ type: ViewChild, args: ['promptConfirmModalDelete',] },],
    };
    return APICodeMaintenanceComponent;
}(BaseComponent));
