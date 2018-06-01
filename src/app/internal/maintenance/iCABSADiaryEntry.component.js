var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { EmployeeGridComponent } from './iCABSAEmployeeGrid.component';
import { URLSearchParams } from '@angular/http';
import { EmployeeSearchComponent } from './../search/iCABSBEmployeeSearch';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
export var DiaryEntryComponent = (function (_super) {
    __extends(DiaryEntryComponent, _super);
    function DiaryEntryComponent(injector) {
        _super.call(this, injector);
        this.timeRequired = true;
        this.employeeRequired = true;
        this.fieldsDisabled = false;
        this.DateFrom = new Date();
        this.DateTo = new Date();
        this.currentMode = 'U';
        this.promptTitle = 'Confirm Record?';
        this.triggerRefreshComponent = false;
        this.headerParams = {
            method: 'service-planning/grid',
            module: 'diary',
            operation: 'Application/iCABSADiaryEntry'
        };
        this.diaryEventTypes = [];
        this.diaryEventDefaultOption = {
            'value': 'None',
            'text': 'None'
        };
        this.ellipsisConfig = {
            employeeTo: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'LookUpTo',
                showAddNew: false,
                component: EmployeeSearchComponent
            },
            employeeSelect: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'LookUp',
                showAddNew: false,
                component: EmployeeGridComponent
            }
        };
        this.pageId = '';
        this.controls = [
            { name: 'EmployeeCode', required: true },
            { name: 'EmployeeSurname', required: true },
            { name: 'DiaryEventDateFrom' },
            { name: 'DiaryEventDateTo' },
            { name: 'DiaryEventAllDayInd' },
            { name: 'TimeFrom', required: true },
            { name: 'TimeTo', required: true },
            { name: 'DiaryOwner' },
            { name: 'DiaryEventText' },
            { name: 'LinkedEmployees' },
            { name: 'EmployeeCodeTo' },
            { name: 'EmployeeSurnameTo', disabled: true },
            { name: 'RedirectMessagingInd' },
            { name: 'RedirectEmployeeInd' },
            { name: 'btnSelect' },
            { name: 'DiaryEventNumber' },
            { name: 'DiaryEventRowid' },
            { name: 'DiaryEventTypeCodes' },
            { name: 'DiaryEventTypeDescs' },
            { name: 'ReasonCode' },
            { name: 'ReasonDesc' },
            { name: 'PasswordCheck' },
            { name: 'BusinessCode' },
            { name: 'PlanRemoved' }
        ];
        this.pageId = PageIdentifier.ICABSADIARYENTRY;
    }
    DiaryEntryComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Diary Entry';
        this.windowOnLoad();
    };
    DiaryEntryComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        this.routeAwayGlobals.resetRouteAwayFlags();
    };
    DiaryEntryComponent.prototype.windowOnLoad = function () {
        if (this.parentMode !== 'TechVisitDiary') {
            this.riExchange.getParentHTMLValue('EmployeeCode');
        }
        if (this.parentMode === 'YearGrid' || this.parentMode === 'DiaryGridAdd') {
            this.setControlValue('EmployeeSurname', this.riExchange.getParentHTMLValue('EmployeeName'));
        }
        else if (this.parentMode === 'TechVisitDiary') {
            this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('PassDiaryEmployeeCode'));
            this.setControlValue('EmployeeSurname', this.riExchange.getParentHTMLValue('PassDiaryEmployeeName'));
        }
        else {
            this.riExchange.getParentHTMLValue('EmployeeSurname');
        }
        this.setControlValue('DiaryEventNumber', this.riExchange.getParentHTMLValue('PassDiaryEntryNumber'));
        this.DateFrom = this.convertLocalDate(this.riExchange.getParentHTMLValue('DiaryDate'));
        this.DateTo = this.convertLocalDate(this.riExchange.getParentHTMLValue('DiaryDate'));
        this.setControlValue('DiaryEventDateFrom', this.utils.formatDate(this.DateFrom.toString()));
        this.setControlValue('DiaryEventDateTo', this.utils.formatDate(this.DateTo.toString()));
        this.getDiaryEventTypes();
        if (this.getControlValue('DiaryEventNumber')) {
            if (this.getControlValue('DiaryEventNumber') !== '' && parseInt(this.getControlValue('DiaryEventNumber'), 10) > 0) {
                this.getDiaryEventRowid();
            }
            else {
                this.currentMode = 'A';
                this.setControlValue('DiaryOwner', true);
                this.DateFrom = this.convertLocalDate(this.riExchange.getParentHTMLValue('DiaryDate'));
                this.DateTo = this.convertLocalDate(this.riExchange.getParentHTMLValue('DiaryDate'));
                this.setControlValue('DiaryEventDateFrom', this.utils.formatDate(this.DateFrom));
                this.setControlValue('DiaryEventDateTo', this.utils.formatDate(this.DateTo));
                this.setControlValue('TimeFrom', this.riExchange.getParentHTMLValue('PassDiaryStartTime'));
                this.setControlValue('TimeTo', this.riExchange.getParentHTMLValue('PassDiaryStartTime'));
                var vTimeSplit = this.riExchange.getParentHTMLValue('TimeTo').split(':');
                this.setControlValue('TimeTo', (vTimeSplit[0] + 1) + ':' + (vTimeSplit[1]));
                this.routeAwayGlobals.setSaveEnabledFlag(true);
            }
        }
        else {
            this.currentMode = 'A';
            this.setControlValue('DiaryOwner', true);
            if (this.parentMode === 'YearGrid') {
                this.DateFrom = new Date();
                this.DateTo = new Date();
            }
            else if (this.parentMode === 'DiaryGridAdd') {
                this.DateFrom = this.convertLocalDate(this.riExchange.getParentHTMLValue('DateFrom'));
                this.DateTo = this.convertLocalDate(this.riExchange.getParentHTMLValue('DateFrom'));
            }
            else if (this.parentMode === 'TechVisitDiary') {
                this.DateFrom = this.convertLocalDate(this.riExchange.getParentHTMLValue('DiaryDate'));
                this.DateTo = this.convertLocalDate(this.riExchange.getParentHTMLValue('DiaryDate'));
                this.setControlValue('TimeFrom', this.riExchange.getParentHTMLValue('PassDiaryStartTime'));
                this.setControlValue('TimeTo', this.riExchange.getParentHTMLValue('PassDiaryEndTime'));
                var vTimeFromSplit = this.riExchange.getParentHTMLValue('PassDiaryStartTime').split(':');
                this.setControlValue('TimeFrom', vTimeFromSplit[0] + ':' + vTimeFromSplit[1]);
                var vTimeToSplit = this.riExchange.getParentHTMLValue('PassDiaryEndTime').split(':');
                this.setControlValue('TimeTo', vTimeToSplit[0] + ':' + vTimeToSplit[1]);
            }
            else {
                this.DateFrom = this.convertLocalDate(this.riExchange.getParentHTMLValue('DiaryDate'));
                this.DateTo = this.convertLocalDate(this.riExchange.getParentHTMLValue('DiaryDate'));
                this.setControlValue('TimeFrom', this.riExchange.getParentHTMLValue('PassDiaryStartTime'));
                this.setControlValue('TimeTo', this.riExchange.getParentHTMLValue('PassDiaryStartTime'));
                var vTimeSplit = this.riExchange.getParentHTMLValue('PassDiaryStartTime').split(':');
                this.setControlValue('TimeTo', (vTimeSplit[0] + 1) + ':' + vTimeSplit[1]);
            }
            this.setControlValue('DiaryEventDateFrom', this.utils.formatDate(this.DateFrom.toString()));
            this.setControlValue('DiaryEventDateTo', this.utils.formatDate(this.DateTo.toString()));
            this.routeAwayGlobals.setSaveEnabledFlag(true);
        }
        this.setControlValue('DiaryEventNumber', this.riExchange.getParentHTMLValue('PassDiaryEntryNumber'));
    };
    DiaryEntryComponent.prototype.getDiaryEventTypes = function () {
        var _this = this;
        var queryParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.Action, '6');
        queryParams.set(this.serviceConstants.Function, 'GetDiaryEventTypes');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
                return;
            }
            var vcDiaryEventTypeCodes = data.DiaryEventTypeCodes.split(';');
            var vcDiaryEventTypeDescs = data.DiaryEventTypeDescs.split(';');
            for (var i = 0; i < vcDiaryEventTypeCodes.length; i++) {
                var obj = {
                    text: vcDiaryEventTypeDescs[i],
                    value: vcDiaryEventTypeCodes[i]
                };
                _this.diaryEventTypes.push(obj);
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.logger.log('Error =>', error);
            return;
        });
    };
    DiaryEntryComponent.prototype.getDiaryEventRowid = function () {
        var _this = this;
        var queryParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.Action, '6');
        queryParams.set('Function', 'GetDiaryEventRowid');
        queryParams.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        queryParams.set('DiaryEventDateFrom', this.getControlValue('DiaryEventDateFrom'));
        queryParams.set('DiaryEventNumber', this.getControlValue('DiaryEventNumber'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage || data.fullError) {
                _this.errorModal.show(data, true);
                return;
            }
            _this.setControlValue('DiaryEventRowid', data.DiaryEventRowid);
            _this.setControlValue('TimeFrom', data.DiaryTimeFrom);
            _this.setControlValue('TimeTo', data.DiaryTimeTo);
            _this.selEntryType.selectedItem = data.DiaryEventType;
            _this.setControlValue('EmployeeTo', data.EmployeeTo);
            _this.setControlValue('SurnameTo', data.SurnameTo);
            _this.setControlValue('LinkedEmployees', data.LinkedEmployees);
            _this.setControlValue('DiaryEventAllDayInd', _this.utils.convertResponseValueToCheckboxInput(String(data.DiaryAllDay).toUpperCase()));
            _this.setControlValue('DiaryOwner', _this.utils.convertResponseValueToCheckboxInput(String(data.DiaryOwner).toUpperCase()));
            _this.setControlValue('RedirectEmployeeInd', _this.utils.convertResponseValueToCheckboxInput(String(data.RedirectEmployee).toUpperCase()));
            _this.setControlValue('RedirectMessagingInd', _this.utils.convertResponseValueToCheckboxInput(String(data.RedirectMessagingInd).toUpperCase()));
            _this.performDiaryEvent();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.logger.log('Error =>', error);
            return;
        });
    };
    DiaryEntryComponent.prototype.performDiaryEvent = function () {
        var _this = this;
        var queryParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.Action, '0');
        queryParams.set('ROWID', this.getControlValue('DiaryEventRowid'));
        queryParams.set('DiaryEventNumber', this.getControlValue('DiaryEventNumber'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage || data.fullError) {
                _this.errorModal.show(data, true);
                return;
            }
            _this.routeAwayGlobals.setSaveEnabledFlag(true);
            _this.setControlValue('DiaryEventText', data.DiaryEventText);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.logger.log('Error =>', error);
            return;
        });
    };
    DiaryEntryComponent.prototype.riMaintenance_BeforeSave = function () {
        if (!this.getControlValue('DiaryEventAllDayInd')) {
            var isError = false;
            if (!this.getControlValue('TimeFrom')) {
                isError = this.riExchange.riInputElement.isError(this.uiForm, 'TimeFrom');
            }
            if (!this.getControlValue('TimeTo')) {
                isError = this.riExchange.riInputElement.isError(this.uiForm, 'TimeTo');
            }
            if (isError)
                return;
        }
        this.riMaintenance_SaveRecord();
    };
    DiaryEntryComponent.prototype.riMaintenance_SaveRecord = function () {
        var _this = this;
        var queryParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (this.currentMode === 'U') {
            queryParams.set(this.serviceConstants.Action, '2');
        }
        else {
            queryParams.set(this.serviceConstants.Action, '1');
        }
        var bodyParams = {};
        if (this.currentMode === 'U') {
            bodyParams['DiaryEventROWID'] = this.getControlValue('DiaryEventRowid');
        }
        bodyParams['DiaryEventNumber'] = this.getControlValue('DiaryEventNumber') ? this.getControlValue('DiaryEventNumber') : '';
        bodyParams['DiaryEventDateTo'] = this.getControlValue('DiaryEventDateTo');
        bodyParams['DiaryEventDateFrom'] = this.getControlValue('DiaryEventDateFrom');
        bodyParams['DiaryEventText'] = this.getControlValue('DiaryEventText');
        bodyParams['LinkedEmployees'] = this.getControlValue('LinkedEmployees');
        bodyParams['EmployeeCode'] = this.getControlValue('EmployeeCode');
        bodyParams['TimeFrom'] = this.getControlValue('TimeFrom');
        bodyParams['TimeTo'] = this.getControlValue('TimeTo');
        bodyParams['AllDayInd'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('DiaryEventAllDayInd'));
        bodyParams['Owner'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('DiaryOwner'));
        bodyParams['DiaryEventType'] = this.selEntryType.selectedItem;
        bodyParams['EmployeeTo'] = this.getControlValue('EmployeeCodeTo');
        bodyParams['RedirectMessaging'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('RedirectMessagingInd'));
        bodyParams['RedirectEmployee'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('RedirectEmployeeInd'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams, bodyParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
                return;
            }
            _this.routeAwayGlobals.setSaveEnabledFlag(false);
            _this.location.back();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.logger.log('Error =>', error);
            return;
        });
    };
    DiaryEntryComponent.prototype.riMaintenance_DeleteRecord = function () {
        var _this = this;
        var queryParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.Action, '3');
        var bodyParams = {};
        bodyParams['DiaryEventROWID'] = this.getControlValue('DiaryEventRowid');
        bodyParams['DiaryEventNumber'] = this.getControlValue('DiaryEventNumber');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams, bodyParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
                return;
            }
            _this.routeAwayGlobals.setSaveEnabledFlag(false);
            _this.location.back();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.logger.log('Error =>', error);
            return;
        });
    };
    DiaryEntryComponent.prototype.diaryEventAllDayInd_ondeactivate = function (target) {
        this.timeRequired = !target.checked;
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TimeFrom', this.timeRequired);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TimeTo', this.timeRequired);
    };
    DiaryEntryComponent.prototype.employeeCode_OnChange = function (empType) {
        var _this = this;
        if (this.getControlValue('EmployeeCodeTo') === '' && empType === 'EmployeeTo') {
            this.setControlValue('EmployeeSurnameTo', '');
        }
        else if (this.getControlValue('EmployeeCode') === '' && empType === 'EmployeeFrom') {
            this.setControlValue('EmployeeSurname', '');
        }
        else {
            var queryParams = new URLSearchParams();
            queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            queryParams.set(this.serviceConstants.Action, '6');
            queryParams.set(this.serviceConstants.Function, 'EmployeeDetails');
            if (empType === 'EmployeeTo') {
                queryParams.set('EmployeeCode', this.getControlValue('EmployeeCodeTo'));
            }
            else {
                queryParams.set('EmployeeCode', this.getControlValue('EmployeeCode'));
            }
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams).subscribe(function (data) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    _this.errorModal.show(data, true);
                    return;
                }
                if (empType === 'EmployeeTo') {
                    _this.setControlValue('EmployeeSurnameTo', data.EmployeeSurname);
                }
                else {
                    _this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                }
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.logger.log('Error =>', error);
                return;
            });
        }
    };
    DiaryEntryComponent.prototype.onEmployeeGridOpen = function () {
        this.employeeSelectEllipsis.openModal();
    };
    DiaryEntryComponent.prototype.updateDateValue = function (value, type) {
        if (value && value.value) {
            if (type === 'From') {
                this.setControlValue('DiaryEventDateFrom', value.value);
            }
            else if (type === 'To') {
                this.setControlValue('DiaryEventDateTo', value.value);
            }
        }
    };
    DiaryEntryComponent.prototype.ellipsisData_Select = function (data, type) {
        if (type === 'employeeTo') {
            this.setControlValue('EmployeeCodeTo', data.EmployeeCodeTo);
            this.setControlValue('EmployeeSurnameTo', data.EmployeeSurnameTo);
        }
        else {
            this.setControlValue('LinkedEmployees', data);
        }
    };
    DiaryEntryComponent.prototype.convertLocalDate = function (newDate) {
        if (window['moment'](newDate, 'DD/MM/YYYY', true).isValid()) {
            newDate = this.utils.convertDate(newDate);
        }
        else {
            newDate = this.utils.formatDate(newDate);
        }
        return new Date(newDate);
    };
    DiaryEntryComponent.prototype.btnDelete_onClick = function () {
        this.promptModal.show();
    };
    DiaryEntryComponent.prototype.onAbandonClick = function () {
        this.location.back();
    };
    DiaryEntryComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    DiaryEntryComponent.prototype.modalHidden = function () {
        var _this = this;
        this.triggerRefreshComponent = true;
        setTimeout(function () {
            _this.triggerRefreshComponent = false;
        }, 100);
    };
    DiaryEntryComponent.prototype.timeValidation = function (event, field) {
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, field, false);
        var formatedTime;
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TimeFrom', this.timeRequired);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TimeTo', this.timeRequired);
        if (event)
            formatedTime = this.formatTime(event, field);
    };
    DiaryEntryComponent.prototype.formatTime = function (time, field) {
        if (time.indexOf(':') === -1) {
            var result = '';
            var re = /^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/;
            var firstDta = parseInt(time[0] + time[1], 10);
            var secondDta = parseInt(time[2] + time[3], 10);
            if (((firstDta < 24 && secondDta < 60) || (firstDta === 24 && secondDta === 0)) && time.length === 4) {
                result = time[0] + time[1] + ':' + time[2] + time[3];
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, field, false);
                this.setControlValue(field, result);
            }
            else {
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, field, true);
                this.setControlValue(field, time);
            }
        }
        else {
            var firstDta = time.split(':')[0];
            var secondDta = time.split(':')[1];
            if (!((firstDta < 24 && secondDta < 60) || (firstDta === 24 && secondDta === 0)) || time.length !== 5) {
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, field, true);
                this.setControlValue(field, time);
            }
        }
    };
    DiaryEntryComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSADiaryEntry.html'
                },] },
    ];
    DiaryEntryComponent.ctorParameters = [
        { type: Injector, },
    ];
    DiaryEntryComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
        'selEntryType': [{ type: ViewChild, args: ['SelEntryType',] },],
        'employeeSelectEllipsis': [{ type: ViewChild, args: ['employeeSelectEllipsis',] },],
        'TimeFrom': [{ type: ViewChild, args: ['TimeFrom',] },],
        'TimeTo': [{ type: ViewChild, args: ['TimeTo',] },],
    };
    return DiaryEntryComponent;
}(BaseComponent));
