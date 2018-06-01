var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from './../../base/BaseComponent';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
export var InvoiceRunDateConfirmComponent = (function (_super) {
    __extends(InvoiceRunDateConfirmComponent, _super);
    function InvoiceRunDateConfirmComponent(injector) {
        _super.call(this, injector);
        this.search = new URLSearchParams();
        this.queryPost = new URLSearchParams();
        this.pageTitle = '';
        this.vSCEnableNextInvoiceNumberEntry = false;
        this.hideNextCreditNumber = false;
        this.hideNextInvoiceNumber = false;
        this.hideTaxPointDate = false;
        this.scheduleStartDate = new Date();
        this.taxPointDateValue = null;
        this.queryParams = {
            module: 'invoicing',
            operation: 'Business/iCABSBInvoiceRunDateConfirm',
            method: 'bill-to-cash/admin'
        };
        this.controls = [
            { name: 'ExtractDate', readonly: true, disabled: false, required: false },
            { name: 'ScheduleStartTime', readonly: true, disabled: false, required: true },
            { name: 'ScheduleStartDate', disabled: false, required: true },
            { name: 'InvoiceRunDateRowID', readonly: true, disabled: false, required: false },
            { name: 'NextInvoiceNumber', required: false },
            { name: 'NextCreditNumber', required: false },
            { name: 'TaxPointDate', required: false }
        ];
        this.pageId = PageIdentifier.ICABSBINVOICERUNDATECONFIRM;
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        this.messageContentSave = MessageConstant.Message.SavedSuccessfully;
        this.messageContentError = MessageConstant.Message.SaveError;
    }
    InvoiceRunDateConfirmComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Submit Invoice Run Confirm';
        this.setControlValue('InvoiceRunDateRowID', this.riExchange.getParentHTMLValue('InvoiceRunDateRowID'));
        this.getSysCharDtetails();
        this.window_onload();
        this.ShowTaxPointDate();
    };
    InvoiceRunDateConfirmComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableNextInvoiceNumberEntryBeforeInvoiceRun];
        var sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records;
            _this.vSCEnableNextInvoiceNumberEntry = record[0]['Required'];
            if (_this.vSCEnableNextInvoiceNumberEntry) {
                _this.hideNextCreditNumber = true;
                _this.hideNextInvoiceNumber = true;
            }
        });
    };
    InvoiceRunDateConfirmComponent.prototype.ngAfterViewInit = function () {
        this.setErrorCallback(this);
        this.setMessageCallback(this);
        this.setFormMode(this.c_s_MODE_UPDATE);
    };
    InvoiceRunDateConfirmComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show(data, true);
    };
    InvoiceRunDateConfirmComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };
    InvoiceRunDateConfirmComponent.prototype.window_onload = function () {
        var _this = this;
        this.setControlValue('ExtractDate', this.riExchange.getParentHTMLValue('ExtractDate'));
        var hours = new Date().getHours();
        this.date = ((hours * 3600) + ((new Date().getMinutes()) * 60));
        this.setControlValue('ScheduleStartTime', this.utils.secondsToHms(this.date));
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.Function, 'ShowTaxPointDate');
        this.queryParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search)
            .subscribe(function (data) {
            if (data.hasError) {
                _this.errorService.emitError(data);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoiceRunDateConfirmComponent.prototype.dateFromSelectedValue = function (value) {
        if (value && value.value) {
            this.setControlValue('ScheduleStartDate', value.value);
        }
        else {
            this.setControlValue('ScheduleStartDate', '');
        }
    };
    InvoiceRunDateConfirmComponent.prototype.taxPointDateSelectedValue = function (value) {
        if (value && value.value) {
            this.setControlValue('TaxPointDate', value.value);
        }
        else {
            this.setControlValue('TaxPointDate', '');
        }
    };
    InvoiceRunDateConfirmComponent.prototype.runDateConfirmcheck = function () {
        if (this.hideTaxPointDate) {
            if (this.getControlValue('TaxPointDate') === '') {
                var taxPointDate = document.querySelector('#TaxPointDate input[type="text"]');
                this.utils.removeClass(taxPointDate, 'ng-untouched');
                this.utils.addClass(taxPointDate, 'ng-touched');
            }
        }
        if (this.getControlValue('ScheduleStartDate') === '') {
            this.uiForm.controls['ScheduleStartDate'].markAsTouched();
        }
        this.ScheduleStartDatepicker.validateDateField();
        if (this.riExchange.validateForm(this.uiForm)) {
            this.runDateConfirm();
        }
    };
    InvoiceRunDateConfirmComponent.prototype.runDateConfirm = function () {
        var _this = this;
        var formdata = {};
        if (!this.riExchange.riInputElement.isError(this.uiForm, 'TaxPointDate')) {
            formdata['InvoiceRunDateRowID'] = this.getControlValue('InvoiceRunDateRowID');
            formdata['ExtractDate'] = this.getControlValue('ExtractDate');
            if (this.hideTaxPointDate) {
                formdata['TaxPointDate'] = this.getControlValue('TaxPointDate');
            }
            formdata['ScheduleStartTime'] = this.date;
            formdata['ScheduleStartDate'] = this.getControlValue('ScheduleStartDate');
            if (this.hideNextCreditNumber && this.hideNextInvoiceNumber) {
                formdata['NextCreditNumber'] = this.getControlValue('NextCreditNumber');
                formdata['NextInvoiceNumber'] = this.getControlValue('NextInvoiceNumber');
            }
            this.queryPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.queryPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.queryPost.set(this.serviceConstants.Action, '0');
            this.queryParams.search = this.queryPost;
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryPost, formdata)
                .subscribe(function (res) {
                if (res.hasError) {
                    _this.errorService.emitError(res);
                }
                else {
                    _this.navigate('', '/billtocash/rundatesgrid');
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.errorService.emitError(error);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    InvoiceRunDateConfirmComponent.prototype.ShowTaxPointDate = function () {
        var _this = this;
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Function, 'ShowTaxPointDate');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search)
            .subscribe(function (data) {
            if (data.hasError) {
                _this.errorService.emitError(data);
            }
            else {
                if (data.ShowTaxPointDate === 'yes') {
                    _this.hideTaxPointDate = true;
                    _this.riExchange.riInputElement.SetRequiredStatus(_this.uiForm, 'TaxPointDate', true);
                }
                else {
                    _this.hideTaxPointDate = false;
                    _this.riExchange.riInputElement.SetRequiredStatus(_this.uiForm, 'TaxPointDate', false);
                    _this.setControlValue('TaxPointDate', '');
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoiceRunDateConfirmComponent.prototype.formatTime = function (e) {
        var time = e.srcElement.value;
        if ((time.match(/:/g) || []).length < 1) {
            time = time.replace(/(..?)/g, '$1:').slice(0, -1);
            this.setControlValue('ScheduleStartTime', time);
        }
        ;
    };
    ;
    InvoiceRunDateConfirmComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBInvoiceRunDateConfirm.html'
                },] },
    ];
    InvoiceRunDateConfirmComponent.ctorParameters = [
        { type: Injector, },
    ];
    InvoiceRunDateConfirmComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'ScheduleStartDatepicker': [{ type: ViewChild, args: ['ScheduleStartDatepicker',] },],
        'TaxPointDateDatepicker': [{ type: ViewChild, args: ['TaxPointDateDatepicker',] },],
    };
    return InvoiceRunDateConfirmComponent;
}(BaseComponent));
