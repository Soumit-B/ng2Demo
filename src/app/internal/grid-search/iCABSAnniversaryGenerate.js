var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { CBBService } from '../../../shared/services/cbb.service';
export var AnniversaryGenerateComponent = (function (_super) {
    __extends(AnniversaryGenerateComponent, _super);
    function AnniversaryGenerateComponent(injector, cbb) {
        _super.call(this, injector);
        this.cbb = cbb;
        this.pageId = '';
        this.search = new URLSearchParams();
        this.fromDateDisplay = '';
        this.toDateDisplay = '';
        this.dateObjects = {
            AnniversaryDateFrom: new Date(),
            AnniversaryeDateTo: new Date()
        };
        this.uiDisplay = {
            showWasteTransferNotes: false,
            showPreAcceptanceLetters: false,
            showCustomerQuarterlyReturns: false
        };
        this.IsMedical = false;
        this.inputParams = {};
        this.information = '';
        this.trInformation = false;
        this.queryParams = {
            operation: 'ApplicationReport/iCABSAnniversaryGenerate',
            module: 'letters',
            method: 'ccm/batch'
        };
        this.c_s_MODE_ADD = 'add';
        this.c_s_MODE_UPDATE = 'update';
        this.c_s_MODE_SELECT = 'select';
        this.controls = [
            { name: 'BranchNumber', readonly: true, disabled: false, required: false },
            { name: 'BranchName', readonly: false, disabled: false, required: false },
            { name: 'ANDateFrom', readonly: false, disabled: false, required: true },
            { name: 'ANDateTo', readonly: false, disabled: false, required: true },
            { name: 'AnniversaryLetterInd', readonly: false, disabled: false, required: false },
            { name: 'WasteTransferNoteInd', readonly: false, disabled: false, required: false },
            { name: 'PreAcceptanceLetterInd', readonly: false, disabled: false, required: false },
            { name: 'CustomerQuarterlyReturnInd', readonly: false, disabled: false, required: false }
        ];
        this.pageId = PageIdentifier.ICABSANNIVERSARYGENERATE;
        this.search = this.getURLSearchParamObject();
        this.setFormMode('');
    }
    AnniversaryGenerateComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Anniversary Letter Generation';
        this.window_onload();
        setTimeout(function () {
            _this.cbb.disableComponent(true);
        }, 0);
    };
    AnniversaryGenerateComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    AnniversaryGenerateComponent.prototype.dateFromSelectedValue = function (value) {
        if (value && value['value']) {
            this.fromDateDisplay = value['value'];
            this.uiForm.controls['ANDateFrom'].setValue(this.fromDateDisplay);
        }
        else {
            this.fromDateDisplay = '';
            this.uiForm.controls['ANDateFrom'].setValue('');
        }
    };
    AnniversaryGenerateComponent.prototype.dateToSelectedValue = function (value) {
        if (value && value['value']) {
            this.toDateDisplay = value['value'];
            this.uiForm.controls['ANDateTo'].setValue(this.toDateDisplay);
        }
        else {
            this.toDateDisplay = '';
            this.uiForm.controls['ANDateTo'].setValue('');
        }
    };
    AnniversaryGenerateComponent.prototype.window_onload = function () {
        this.brunchNumber = this.utils.getBranchCode();
        this.setControlValue('BranchNumber', this.utils.getBranchCode());
        this.setControlValue('AnniversaryLetterInd', true);
        this.lookupBranchName();
        this.lookupwatertransfertype();
        var date = new Date();
        this.firstDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        this.lastDay = new Date(date.getFullYear(), date.getMonth() + 2, 0);
        this.fromdate = this.utils.formatDate(this.firstDay);
        this.todate = this.utils.formatDate(this.lastDay);
        var getFromDate = this.fromdate;
        if (window['moment'](getFromDate, 'DD/MM/YYYY', true).isValid()) {
            getFromDate = this.utils.convertDate(getFromDate);
        }
        else {
            getFromDate = this.utils.formatDate(getFromDate);
        }
        this.dateObjects.fromDateDisplay = new Date(getFromDate);
        var getToDate = this.todate;
        if (window['moment'](getToDate, 'DD/MM/YYYY', true).isValid()) {
            getToDate = this.utils.convertDate(getToDate);
        }
        else {
            getToDate = this.utils.formatDate(getToDate);
        }
        this.dateObjects.toDateDisplay = new Date(getToDate);
    };
    AnniversaryGenerateComponent.prototype.lookupBranchName = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode,
                    'BranchNumber': this.utils.getBranchCode()
                },
                'fields': ['BranchName']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data.hasError) {
                _this.errorService.emitError(data);
            }
            else {
                var Branch = data[0][0];
                if (Branch) {
                    _this.setControlValue('BranchName', Branch.BranchName);
                }
                ;
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    AnniversaryGenerateComponent.prototype.onBranchDataReceived = function (obj) {
        this.brunchNumber = obj.BranchNumber;
        this.BranchSearch = obj.BranchNumber + ' : ' + (obj.hasOwnProperty('BranchName') ? obj.BranchName : obj.Object.BranchName);
    };
    AnniversaryGenerateComponent.prototype.ischecked = function (value) {
        if (value) {
            return 'yes';
        }
        else {
            return 'no';
        }
    };
    AnniversaryGenerateComponent.prototype.submitBatchProcess = function (event) {
        var _this = this;
        this.search = new URLSearchParams();
        var formdata = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '0');
        formdata['BranchNumber'] = this.utils.getBranchCode();
        formdata['ANDateFrom'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ANDateFrom');
        formdata['ANDateTo'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ANDateTo');
        formdata['IncludeRN'] = 'no';
        formdata['AnniversaryLetterInd'] = this.ischecked(this.getControlValue('AnniversaryLetterInd'));
        formdata['WasteTransferNoteInd'] = this.ischecked(this.getControlValue('WasteTransferNoteInd'));
        formdata['PreAcceptanceLetterInd'] = this.ischecked(this.getControlValue('PreAcceptanceLetterInd'));
        formdata['CustomerQuarterlyReturnInd'] = this.ischecked(this.getControlValue('CustomerQuarterlyReturnInd'));
        this.inputParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.search, formdata)
            .subscribe(function (e) {
            if (e.hasError) {
                _this.errorModal.show(e, true);
            }
            else {
                _this.messageService.emitMessage(e);
                _this.trInformation = true;
                _this.information = e.ReturnHTML;
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorModal.show(error, true);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    AnniversaryGenerateComponent.prototype.lookupwatertransfertype = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'WasteTransferType',
                'query': {
                    'BusinessCode': this.businessCode
                },
                'fields': ['WasteTransferNoteRequiredInd']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data.hasError) {
                _this.errorModal.show(data, true);
            }
            else {
                for (var i = 0; i < data[0].length; i++) {
                    if (data[0][i].WasteTransferNoteRequiredInd === true) {
                        _this.IsMedical = true;
                        _this.uiDisplay.showWasteTransferNotes = true;
                        _this.setControlValue('WasteTransferNoteInd', 'yes');
                        _this.uiDisplay.showPreAcceptanceLetters = false;
                        _this.setControlValue('PreAcceptanceLetterInd', 'yes');
                        _this.uiDisplay.showCustomerQuarterlyReturns = false;
                        _this.setControlValue('CustomerQuarterlyReturnInd', 'No');
                    }
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }
        }, function (error) {
            _this.errorModal.show(error, true);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    AnniversaryGenerateComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAnniversaryGenerate.html'
                },] },
    ];
    AnniversaryGenerateComponent.ctorParameters = [
        { type: Injector, },
        { type: CBBService, },
    ];
    AnniversaryGenerateComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return AnniversaryGenerateComponent;
}(BaseComponent));
