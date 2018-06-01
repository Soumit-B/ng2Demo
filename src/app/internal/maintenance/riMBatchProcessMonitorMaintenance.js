var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'ng2-webstorage';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../../app/base/BaseComponent';
export var MBatchProcessMonitorMaintenanceComponent = (function (_super) {
    __extends(MBatchProcessMonitorMaintenanceComponent, _super);
    function MBatchProcessMonitorMaintenanceComponent(injector, _ls) {
        _super.call(this, injector);
        this._ls = _ls;
        this.queryParams1 = {
            operation: 'Model/riMBatchProcessMonitorMaintenance',
            module: 'batch-process',
            method: 'it-functions/ri-model'
        };
        this.pageId = '';
        this.UserCode = '';
        this.isAccess = true;
        this.itemsPerPage = 10;
        this.page = 1;
        this.totalItem = 11;
        this.currentPage = 1;
        this.maxColumn = 8;
        this.search = new URLSearchParams();
        this.DateTo = new Date();
        this.DateFrom = new Date();
        this.riDeveloper = false;
        this.modalsh = false;
        this.showMessageHeader = true;
        this.promptTitle = 'Confirm Record?';
        this.promptContent = '';
        this.showSave = false;
        this.tabEnable = false;
        this.columns = [
            { title: 'Parameter Name', name: 'BatchProcessParameterName', sort: 'asc' },
            { title: 'Parameter Value', name: 'BatchProcessParameterValue' }
        ];
        this.uiDisplay = {
            tab: {
                tab1: { visible: true, active: true },
                tab2: { visible: false, active: false },
                tab3: { visible: false, active: false }
            }
        };
        this.controls = [
            { name: 'BatchProcessUniqueNumber', readonly: true, disabled: false, required: false },
            { name: 'BatchProcessUserCode', readonly: true, disabled: false, required: false },
            { name: 'BatchProcessSubmittedDate', readonly: true, disabled: false, required: false },
            { name: 'BatchProcessSubmittedTime', readonly: true, disabled: false, required: false },
            { name: 'BatchProcessDescription', readonly: true, disabled: false, required: false },
            { name: 'BatchProcessProgramName', readonly: true, disabled: false, required: false },
            { name: 'BatchProcessTypeCode', readonly: true, disabled: false, required: false },
            { name: 'BatchProcessTypeDisplayDesc', readonly: true, disabled: false, required: false },
            { name: 'BatchProcessFailureReason', readonly: true, disabled: false, required: false },
            { name: 'BatchProcessScheduleStartDate', readonly: true, disabled: false, required: false },
            { name: 'BatchProcessScheduleStartTime', readonly: true, disabled: false, required: false },
            { name: 'BatchProcessActualStartDate', readonly: true, disabled: false, required: false },
            { name: 'BatchProcessActualStartTime', readonly: true, disabled: false, required: false },
            { name: 'BatchProcessActualEndDate', readonly: true, disabled: false, required: false },
            { name: 'BatchProcessActualEndTime', readonly: true, disabled: false, required: false },
            { name: 'BatchProcessLog', readonly: true, disabled: false, required: false }
        ];
        this.pageId = PageIdentifier.RIMBATCHPROCESSMONITORMAINTENANCE;
    }
    MBatchProcessMonitorMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.showBackLabel = true;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessUniqueNumber', this.riExchange.getParentHTMLValue('BatchProcessUniqueNumber'));
        this.UserCode = this._ls.retrieve('RIUserCode');
        this.getRiDeveloperAccess();
        this.riExchange.riInputElement.Disable(this.uiForm, 'BatchProcessTypeCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BatchProcessLog');
    };
    MBatchProcessMonitorMaintenanceComponent.prototype.mathodCall = function () {
        this.renderTab(1);
        this.fetchRecord();
        this.fetchGrid();
        this.fetchLog();
        if ((this.UserCode && this.UserCode.toUpperCase() === 'CIT')
            || this.riDeveloper) {
            this.isAccess = false;
        }
    };
    MBatchProcessMonitorMaintenanceComponent.prototype.ngOnDestroy = function () {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        _super.prototype.ngOnDestroy.call(this);
    };
    MBatchProcessMonitorMaintenanceComponent.prototype.fetchTypeDecs = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'BatchProcessTypeLanguage',
                'query': {
                    'BatchProcessTypeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessTypeCode')
                },
                'fields': ['BatchProcessTypeDisplayDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var Business = data[0][0];
            if (Business) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BatchProcessTypeDisplayDesc', Business.BatchProcessTypeDisplayDesc);
                if (_this.modalsh) {
                    _this.promptModal.show();
                }
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BatchProcessTypeDisplayDesc', '');
                _this.warn = 'mandatoryBatch';
            }
        });
    };
    MBatchProcessMonitorMaintenanceComponent.prototype.promptSave = function (event) {
        this.fetchTypeDecs();
        this.updateProcess();
        this.warn = '';
        this.BatchProcessTypeCodeSaved = this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessTypeCode');
        this.showSave = false;
        this.riExchange.riInputElement.Disable(this.uiForm, 'BatchProcessTypeCode');
    };
    MBatchProcessMonitorMaintenanceComponent.prototype.promptCancel = function (event) {
    };
    MBatchProcessMonitorMaintenanceComponent.prototype.fetchRecord = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '0');
        query.set('countryCode', this.countryCode());
        query.set('businessCode', this.businessCode());
        query.set('BatchProcessUniqueNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessUniqueNumber'));
        this.httpService.makeGetRequest(this.queryParams1.method, this.queryParams1.module, this.queryParams1.operation, query)
            .subscribe(function (data) {
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BatchProcessUserCode', data.BatchProcessUserCode);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BatchProcessSubmittedDate', _this.utils.formatDate(data.BatchProcessSubmittedDate));
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BatchProcessSubmittedTime', _this.utils.secondsToHms(data.BatchProcessSubmittedTime));
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BatchProcessDescription', data.BatchProcessDescription);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BatchProcessProgramName', data.BatchProcessProgramName);
            _this.BatchProcessTypeCodeSaved = data.BatchProcessTypeCode;
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BatchProcessTypeCode', data.BatchProcessTypeCode);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BatchProcessFailureReason', data.BatchProcessFailureReason);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BatchProcessScheduleStartDate', _this.utils.formatDate(data.BatchProcessScheduleStartDate));
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BatchProcessScheduleStartTime', _this.utils.secondsToHms(data.BatchProcessScheduleStartTime));
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BatchProcessActualStartDate', _this.utils.formatDate(data.BatchProcessActualStartDate));
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BatchProcessActualStartTime', _this.utils.secondsToHms(data.BatchProcessActualStartTime));
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BatchProcessActualEndDate', _this.utils.formatDate(data.BatchProcessActualEndDate));
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BatchProcessActualEndTime', _this.utils.secondsToHms(data.BatchProcessActualEndTime));
            _this.fetchTypeDecs();
        });
    };
    MBatchProcessMonitorMaintenanceComponent.prototype.fetchGrid = function () {
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '0');
        query.set('countryCode', this.countryCode());
        query.set('businessCode', this.businessCode());
        query.set('BUFFERLIST', 'BatchProcessParameter');
        query.set('BatchProcessUniqueNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessUniqueNumber'));
        query.set('FIRSTROWID', '');
        query.set('LASTROWID', '');
        query.set('NUMROWS', '8');
        this.queryParams1.search = query;
        this.monitorTable.loadTableData(this.queryParams1);
    };
    MBatchProcessMonitorMaintenanceComponent.prototype.renderTab = function (tabindex) {
        switch (tabindex) {
            case 1:
                this.uiDisplay.tab.tab1.active = true;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                break;
            case 2:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = true;
                this.uiDisplay.tab.tab3.active = false;
                break;
            case 3:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = true;
                break;
        }
    };
    MBatchProcessMonitorMaintenanceComponent.prototype.fetchLog = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '0');
        query.set('countryCode', this.countryCode());
        query.set('businessCode', this.businessCode());
        query.set('Function', 'GetLogFile');
        query.set('BatchProcessUniqueNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessUniqueNumber'));
        this.httpService.makeGetRequest(this.queryParams1.method, this.queryParams1.module, this.queryParams1.operation, query)
            .subscribe(function (data) {
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BatchProcessLog', data.LogText);
        });
    };
    MBatchProcessMonitorMaintenanceComponent.prototype.update = function () {
        this.promptModal.show();
    };
    MBatchProcessMonitorMaintenanceComponent.prototype.updateProcess = function () {
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '2');
        query.set('countryCode', this.countryCode());
        query.set('businessCode', this.businessCode());
        var _formData = {};
        _formData['BatchProcessUserCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessUserCode');
        _formData['BatchProcessTypeCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessTypeCode');
        _formData['BatchProcessDescription'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessDescription');
        _formData['BatchProcessProgramName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessProgramName');
        _formData['BatchProcessFailureReason'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessFailureReason');
        _formData['BatchProcessScheduleStartDate'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessScheduleStartDate');
        _formData['BatchProcessActualStartDate'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessActualStartDate');
        _formData['BatchProcessActualEndDate'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessActualEndDate');
        _formData['ROWID'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ROWID');
        _formData['BatchProcessUniqueNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessUniqueNumber');
        this.httpService.makePostRequest(this.queryParams1.method, this.queryParams1.module, this.queryParams1.operation, query, _formData);
    };
    MBatchProcessMonitorMaintenanceComponent.prototype.getRiDeveloperAccess = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'UserInformation',
                'query': {
                    'UserCode': this.UserCode
                },
                'fields': ['riDeveloper']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var userData = data[0][0];
            if (userData) {
                _this.riDeveloper = userData.riDeveloper;
                _this.mathodCall();
            }
        });
    };
    MBatchProcessMonitorMaintenanceComponent.prototype.selectedData = function (data) {
        this.logger.log('Data', data);
    };
    MBatchProcessMonitorMaintenanceComponent.prototype.cancel = function () {
        this.showSave = false;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessTypeCode', this.BatchProcessTypeCodeSaved);
        this.riExchange.riInputElement.Disable(this.uiForm, 'BatchProcessTypeCode');
    };
    MBatchProcessMonitorMaintenanceComponent.prototype.showButtons = function () {
        this.showSave = true;
        this.riExchange.riInputElement.Enable(this.uiForm, 'BatchProcessTypeCode');
        this.BatchProcessTypeCode.nativeElement.focus();
    };
    MBatchProcessMonitorMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'riMBatchProcessMonitorMaintenance.html'
                },] },
    ];
    MBatchProcessMonitorMaintenanceComponent.ctorParameters = [
        { type: Injector, },
        { type: LocalStorageService, },
    ];
    MBatchProcessMonitorMaintenanceComponent.propDecorators = {
        'monitorTable': [{ type: ViewChild, args: ['monitorTable',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'BatchProcessTypeCode': [{ type: ViewChild, args: ['BatchProcessTypeCode',] },],
    };
    return MBatchProcessMonitorMaintenanceComponent;
}(BaseComponent));
