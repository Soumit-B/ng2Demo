var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
export var ServicePlanDeliveryNoteGenerationComponent = (function (_super) {
    __extends(ServicePlanDeliveryNoteGenerationComponent, _super);
    function ServicePlanDeliveryNoteGenerationComponent(injector) {
        _super.call(this, injector);
        this.queryParams = {
            operation: 'Service/iCABSSeServicePlanDeliveryNoteGeneration',
            module: 'delivery-note',
            method: 'service-delivery/batch',
            action: '2'
        };
        this.pageId = '';
        this.isServiceAreaLabel = true;
        this.isServicePlanNumberLabel = true;
        this.isStartDateLabel = true;
        this.isEndDateLabel = true;
        this.locationsAndFormsDisplay = false;
        this.thInformationDisplayed = false;
        this.thInformation2Displayed = false;
        this.StartDate = new Date();
        this.EndDate = new Date();
        this.isDateReadOnly = true;
        this.search = new URLSearchParams();
        this.autoOpen = false;
        this.destinationType = {
            type: '',
            user: ''
        };
        this.recordFound = false;
        this.controls = [
            { name: 'SelectAction', readonly: true, disabled: false, required: false },
            { name: 'BranchServiceAreaCode', readonly: true, disabled: false, required: false },
            { name: 'EmployeeSurname', readonly: true, disabled: false, required: false },
            { name: 'ServicePlanNumber', readonly: true, disabled: false, required: true },
            { name: 'ServicePlanStartDate', readonly: true, disabled: false, required: true },
            { name: 'ServicePlanEndDate', readonly: true, disabled: false, required: true },
            { name: 'GenerateOption', readonly: true, disabled: false, required: false },
            { name: 'RepDest', readonly: true, disabled: false, required: false },
            { name: 'IncludeLocations', readonly: true, disabled: false, required: false },
            { name: 'NumberOfForms', readonly: true, disabled: false, required: false }
        ];
        this.pageId = PageIdentifier.ICABSSESERVICEPLANDELIVERYNOTEGENERATION;
    }
    ServicePlanDeliveryNoteGenerationComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Generate Service Listing/Receipts';
        this.window_onload();
    };
    ServicePlanDeliveryNoteGenerationComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    ServicePlanDeliveryNoteGenerationComponent.prototype.window_onload = function () {
        this.getSysCharDtetails();
    };
    ServicePlanDeliveryNoteGenerationComponent.prototype.onRepDestChange = function (event) {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'RepDest') === 'Listing') {
            this.destinationType['type'] = 'batch';
            this.destinationType['user'] = 'ReportID';
        }
        else {
            this.destinationType['type'] = 'email';
            this.destinationType['user'] = 'User';
        }
    };
    ServicePlanDeliveryNoteGenerationComponent.prototype.getBranchServiceAreaDesc = function () {
        var _this = this;
        var lookUpSys = [{
                'table': 'Employee',
                'query': { 'EmployeeCode': this.getControlValue('BranchServiceAreaCode'), 'BranchNumber': this.utils.getBranchCode(), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['EmployeeSurname']
            }];
        this.LookUp.lookUpRecord(lookUpSys).subscribe(function (data) {
            if (data[0].length > 0 && data[0][0].BranchServiceAreaDesc) {
                _this.setControlValue('EmployeeSurname', data[0][0].BranchServiceAreaDesc);
            }
        });
    };
    ServicePlanDeliveryNoteGenerationComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharServiceDeliveryNoteType
        ];
        var sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: this.queryParams.action,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records;
            _this.vSCDeliveryNoteTypeRequired = record[0]['Required'];
            if (_this.vSCDeliveryNoteTypeRequired === true)
                _this.SCDeliveryNoteTypeRequired = 'True';
            else
                _this.SCDeliveryNoteTypeRequired = 'False';
            _this.vSCDeliveryNoteType = record[0]['Integer'];
            _this.SCDeliveryNoteType = _this.vSCDeliveryNoteType;
            _this.setInitialValues();
            _this.onRepDestChange({});
        });
    };
    ServicePlanDeliveryNoteGenerationComponent.prototype.setInitialValues = function () {
        this.setControlValue('SelectAction', this.riExchange.getParentHTMLValue('SelectAction'));
        this.SelectAction = this.getControlValue('SelectAction');
        if (this.SelectAction === 'GenerateSel') {
            this.isServiceAreaLabel = false;
            this.isServicePlanNumberLabel = false;
            this.isStartDateLabel = false;
            this.isEndDateLabel = false;
        }
        this.setControlValue('BranchServiceAreaCode', this.riExchange.getParentAttributeValue('BranchServiceAreaCode'));
        this.setControlValue('EmployeeSurname', this.riExchange.getParentHTMLValue('EmployeeSurname'));
        this.setControlValue('ServicePlanNumber', this.riExchange.getParentAttributeValue('ServicePlanNumber'));
        this.setControlValue('ServicePlanStartDate', this.riExchange.getParentAttributeValue('ServicePlanStartDate'));
        this.setControlValue('ServicePlanEndDate', this.riExchange.getParentAttributeValue('ServicePlanEndDate'));
        this.setControlValue('IncludeLocations', false);
        this.setControlValue('NumberOfForms', '4');
        this.setControlValue('RepDest', 'Listing');
        this.getBranchServiceAreaDesc();
        this.riExchange.riInputElement.Disable(this.uiForm, 'BranchServiceAreaCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'EmployeeSurname');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServicePlanNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServicePlanStartDate');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServicePlanEndDate');
        this.branchNumber = this.utils.getBranchCode();
        if (this.SCDeliveryNoteTypeRequired) {
            switch (this.SCDeliveryNoteType) {
                case 1:
                    this.setControlValue('GenerateOption', 'Receipts');
                    break;
                case 2:
                    this.setControlValue('GenerateOption', 'Listing');
                    break;
                case 3:
                    this.setControlValue('GenerateOption', 'Both');
                    this.locationsAndFormsDisplay = true;
                    break;
                case 4:
                    this.setControlValue('GenerateOption', 'TimeSheet');
                    break;
                default:
                    this.setControlValue('GenerateOption', 'Listing');
            }
        }
    };
    ServicePlanDeliveryNoteGenerationComponent.prototype.SubmitReportGeneration = function (eventObj) {
        this.TranslateDescription();
        if (this.SelectAction === 'GenerateSel') {
            this.riExchange.setParentHTMLValue('GenerateOption', this.getControlValue('GenerateOption'));
            this.location.back();
        }
        var generateOption = this.uiForm.controls['GenerateOption'].value;
        if (this.vSCDeliveryNoteTypeRequired) {
            switch (generateOption) {
                case 'Listing':
                    this.submitReportRequestList();
                    break;
                case 'ListingRem':
                    this.SubmitReportRequestListRemovals();
                    break;
                case 'Receipts':
                    this.SubmitReportRequest();
                    break;
                case 'Both':
                    this.SubmitReportBRequestList();
                    this.SubmitReportRequest();
                    break;
                case 'TimeSheet':
                    this.SubmitReportRequest();
                    break;
                default:
            }
        }
    };
    ServicePlanDeliveryNoteGenerationComponent.prototype.TranslateDescription = function () {
        this.strTransListDesc = 'Service Listing' + ' - ' + 'Area' + ' ' + this.getControlValue('BranchServiceAreaCode') + ' ' + 'Plan' + ' ' + this.getControlValue('ServicePlanNumber');
        this.strTransListRemDesc = 'Service Listing ' + '(Removals Only)' + ' - ' + 'Area' + ' ' + this.getControlValue('BranchServiceAreaCode') + ' ' + 'Plan' + ' ' + this.getControlValue('ServicePlanNumber');
        this.strTransReceiptDesc = 'Service Receipts' + ' - ' + 'Area' + ' ' + this.getControlValue('BranchServiceAreaCode') + ' ' + 'Plan' + ' ' + this.getControlValue('ServicePlanNumber');
    };
    ServicePlanDeliveryNoteGenerationComponent.prototype.SubmitReportRequest = function () {
        var _this = this;
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '2');
        var postParams = {};
        postParams.Description = this.strTransReceiptDesc;
        var generateOption = this.uiForm.controls['GenerateOption'].value;
        if (generateOption === 'TimeSheet') {
            postParams.ProgramName = 'iCABSServiceTimeSheetGeneration.p';
        }
        else {
            postParams.ProgramName = 'iCABSServiceDeliveryNoteReportGeneration.p';
        }
        var date = new Date();
        postParams.StartDate = this.utils.formatDate(new Date());
        ;
        postParams.EndDate = this.EndDateDisplay;
        postParams.StartTime = ((date.getHours() * 60 + date.getMinutes()) * 60) + date.getSeconds();
        postParams.Report = 'report';
        postParams.ParameterName = 'BusinessCodeBranchNumberBranchServiceAreaCodeServicePlanNumberIncludeLocationsNumberOfFormsRepManDest';
        postParams.ParameterValue = this.businessCode() + '' + this.branchNumber + '' + this.getControlValue('BranchServiceAreaCode') + '' + this.getControlValue('ServicePlanNumber') + '' + this.getControlValue('IncludeLocations') + '' + this.getControlValue('NumberOfForms') + '' + this.destinationType['type'] + '|' + this.destinationType['user'];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorService.emitError(new Error(e['errorMessage']));
                }
                else {
                    _this.thInformation2 = e.fullError;
                    _this.thInformation2Displayed = true;
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServicePlanDeliveryNoteGenerationComponent.prototype.submitReportRequestList = function () {
        var _this = this;
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '2');
        var postParams = {};
        var date = new Date();
        postParams.Description = this.strTransListDesc;
        postParams.ProgramName = 'iCABSServiceDeliveryNoteListGeneration.p';
        postParams.StartDate = this.utils.formatDate(new Date());
        postParams.EndDate = this.EndDateDisplay;
        postParams.StartTime = ((date.getHours() * 60 + date.getMinutes()) * 60) + date.getSeconds();
        postParams.Report = 'report';
        postParams.ParameterName = 'BusinessCodeBranchNumberBranchServiceAreaCodeServicePlanNumberIncludeLocationsNumberOfFormsRepManDest';
        postParams.ParameterValue = this.businessCode() + '' + this.branchNumber + '' + this.getControlValue('BranchServiceAreaCode') + '' + this.getControlValue('ServicePlanNumber') + '' + this.getControlValue('IncludeLocations') + '' + this.getControlValue('NumberOfForms') + '' + this.destinationType['type'] + '|' + this.destinationType['user'];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorService.emitError(new Error(e['errorMessage']));
                }
                else {
                    _this.thInformation = e.fullError;
                    _this.thInformationDisplayed = true;
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServicePlanDeliveryNoteGenerationComponent.prototype.SubmitReportBRequestList = function () {
        var _this = this;
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '2');
        var postParams = {};
        var date = new Date();
        postParams.Description = this.strTransListDesc;
        postParams.ProgramName = 'iCABSServiceDeliveryNoteListGeneration.p';
        postParams.StartDate = this.utils.formatDate(new Date());
        postParams.EndDate = this.EndDateDisplay;
        postParams.StartTime = ((date.getHours() * 60 + date.getMinutes()) * 60) + date.getSeconds();
        postParams.Report = 'report';
        postParams.ParameterName = 'BusinessCodeBranchNumberBranchServiceAreaCodeServicePlanNumberIncludeLocationsNumberOfFormsRepManDest';
        postParams.ParameterValue = this.businessCode() + '' + this.branchNumber + '' + this.getControlValue('BranchServiceAreaCode') + '' + this.getControlValue('ServicePlanNumber') + '' + this.getControlValue('IncludeLocations') + '' + this.getControlValue('NumberOfForms') + '' + this.destinationType['type'] + '|' + this.destinationType['user'];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorService.emitError(new Error(e['errorMessage']));
                }
                else {
                    _this.thInformation = e.fullError;
                    _this.thInformationDisplayed = true;
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServicePlanDeliveryNoteGenerationComponent.prototype.SubmitReportRequestListRemovals = function () {
        var _this = this;
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '2');
        var postParams = {};
        var date = new Date();
        postParams.Description = this.strTransListRemDesc;
        postParams.ProgramName = 'iCABSServiceDeliveryNoteListRemGeneration.p';
        postParams.StartDate = this.utils.formatDate(new Date());
        postParams.EndDate = this.EndDateDisplay;
        postParams.StartTime = ((date.getHours() * 60 + date.getMinutes()) * 60) + date.getSeconds();
        postParams.Report = 'report';
        postParams.ParameterName = 'BusinessCodeBranchNumberBranchServiceAreaCodeServicePlanNumberIncludeLocationsNumberOfFormsRepManDest';
        postParams.ParameterValue = this.businessCode() + '' + this.branchNumber + '' + this.getControlValue('BranchServiceAreaCode') + '' + this.getControlValue('ServicePlanNumber') + '' + this.getControlValue('IncludeLocations') + '' + this.getControlValue('NumberOfForms') + '' + this.destinationType['type'] + '|' + this.destinationType['user'];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorService.emitError(new Error(e['errorMessage']));
                }
                else {
                    _this.thInformation = e.fullError;
                    _this.thInformationDisplayed = true;
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServicePlanDeliveryNoteGenerationComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSeServicePlanDeliveryNoteGeneration.html'
                },] },
    ];
    ServicePlanDeliveryNoteGenerationComponent.ctorParameters = [
        { type: Injector, },
    ];
    return ServicePlanDeliveryNoteGenerationComponent;
}(BaseComponent));
