var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { LocalStorageService } from 'ng2-webstorage';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
export var BatchProcessMonitorSearchComponent = (function (_super) {
    __extends(BatchProcessMonitorSearchComponent, _super);
    function BatchProcessMonitorSearchComponent(injector, _ls) {
        _super.call(this, injector);
        this._ls = _ls;
        this.inputParams = {
            module: 'batch-process',
            method: 'it-functions/ri-model',
            operation: 'Model/riMBatchProcessMonitorSearch'
        };
        this.pageId = '';
        this.controls = [
            { name: 'FilterSelect', readonly: false, disabled: false, required: false },
            { name: 'StatusFilterSelect', readonly: false, disabled: false, required: false },
            { name: 'FilterInput', readonly: false, disabled: false, required: false },
            { name: 'FilterInputCheck', readonly: true, disabled: false, required: false },
            { name: 'BatchProcessUniqueNumber', readonly: true, disabled: false, required: false }
        ];
        this.rowmetadata = [
            { name: 'BatchProcessReport', type: 'img' }
        ];
        this.rows = [];
        this.itemsPerPage = 8;
        this.page = 1;
        this.pageParams = {};
        this.pageId = PageIdentifier.RIMBATCHPROCESSMONITORSEARCH;
    }
    BatchProcessMonitorSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        if (this.formData['BatchProcessUniqueNumber']) {
            this.populateUIFromFormData();
            this.loadData();
        }
        else {
            this.pageParams.UserCode = this._ls.retrieve('RIUserCode');
            this.pageTitle = 'Batch Process Monitor Search';
            this.pageParams.statusList = [];
            this.getRiDeveloperAccess();
        }
    };
    BatchProcessMonitorSearchComponent.prototype.ngOnDestroy = function () {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        _super.prototype.ngOnDestroy.call(this);
    };
    BatchProcessMonitorSearchComponent.prototype.window_onload = function () {
        if ((this.pageParams.UserCode && this.pageParams.UserCode.toUpperCase() === 'CIT')
            || this.pageParams.riDeveloper) {
            this.pageParams.IdFilter = false;
        }
        else {
            this.pageParams.IdFilter = true;
        }
        this.FilterSelect_onchange();
        this.addColumn();
        if ((this.pageParams.UserCode && this.pageParams.UserCode.toUpperCase() === 'CIT')
            || this.pageParams.riDeveloper) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'FilterSelect', 'BatchProcessUserCode');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'FilterInput', this.pageParams.UserCode);
        }
        this.loadData();
    };
    BatchProcessMonitorSearchComponent.prototype.addColumn = function () {
        var _this = this;
        this.pageParams.columns = [];
        this.getTranslatedValue('Unique Number', null).subscribe(function (res) {
            if (res) {
                _this.pageParams.columns.push({ title: res, name: 'BatchProcessUniqueNumber' });
            }
            else {
                _this.pageParams.columns.push({ title: 'Unique Number', name: 'BatchProcessUniqueNumber' });
            }
        });
        this.getTranslatedValue('UserCode', null).subscribe(function (res) {
            if (res) {
                _this.pageParams.columns.push({ title: res, name: 'BatchProcessUserCode' });
            }
            else {
                _this.pageParams.columns.push({ title: 'UserCode', name: 'BatchProcessUserCode' });
            }
        });
        this.getTranslatedValue('Submitted Date', null).subscribe(function (res) {
            if (res) {
                _this.pageParams.columns.push({ title: res, name: 'BatchProcessSubmittedDate' });
            }
            else {
                _this.pageParams.columns.push({ title: 'Submitted Date', name: 'BatchProcessSubmittedDate' });
            }
        });
        this.getTranslatedValue('Submitted Time', null).subscribe(function (res) {
            if (res) {
                _this.pageParams.columns.push({ title: res, name: 'BatchProcessSubmittedTime' });
            }
            else {
                _this.pageParams.columns.push({ title: 'Submitted Time', name: 'BatchProcessSubmittedTime' });
            }
        });
        this.getTranslatedValue('Description', null).subscribe(function (res) {
            if (res) {
                _this.pageParams.columns.push({ title: res, name: 'BatchProcessDescription' });
            }
            else {
                _this.pageParams.columns.push({ title: 'Description', name: 'BatchProcessDescription' });
            }
        });
        this.getTranslatedValue('Unique Number', null).subscribe(function (res) {
            if (res) {
                _this.pageParams.columns.push({ title: res, name: 'BatchProcessUniqueNumber' });
            }
            else {
                _this.pageParams.columns.push({ title: 'Unique Number', name: 'BatchProcessUniqueNumber' });
            }
        });
        this.getTranslatedValue('Report', null).subscribe(function (res) {
            if (res) {
                _this.pageParams.columns.push({ title: res, name: 'BatchProcessReport' });
            }
            else {
                _this.pageParams.columns.push({ title: 'Report', name: 'BatchProcessReport' });
            }
        });
        this.getTranslatedValue('Status', null).subscribe(function (res) {
            if (res) {
                _this.pageParams.columns.push({ title: res, name: 'BatchProcessTypeDisplayDesc' });
            }
            else {
                _this.pageParams.columns.push({ title: 'Status', name: 'BatchProcessTypeDisplayDesc' });
            }
        });
    };
    BatchProcessMonitorSearchComponent.prototype.selectedData = function (event) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessUniqueNumber', event.row['BatchProcessUniqueNumber']);
        this.navigate('business', 'application/BatchProcessMonitorMaintenance');
    };
    BatchProcessMonitorSearchComponent.prototype.loadData = function () {
        this.setFilterValues();
        this.search.set(this.serviceConstants.Action, '2');
        this.inputParams.search = this.search;
        this.processMonitorTable.loadTableData(this.inputParams);
    };
    BatchProcessMonitorSearchComponent.prototype.setFilterValues = function () {
        this.search = this.getURLSearchParamObject();
        if (this.pageParams.UserCode && this.pageParams.UserCode.toUpperCase() !== 'CIT'
            && !this.pageParams.riDeveloper) {
            this.search.set('BatchProcessUserCode', this.pageParams.UserCode);
        }
        this.search.set(this.riExchange.riInputElement.GetValue(this.uiForm, 'FilterSelect'), this.riExchange.riInputElement.GetValue(this.uiForm, 'FilterInput'));
        this.search.set('search.op.' + this.riExchange.riInputElement.GetValue(this.uiForm, 'FilterSelect'), 'GE');
        this.search.set('LanguageCode', this.riExchange.LanguageCode());
        this.search.set('search.sortby', 'BatchProcessUniqueNumber DESC');
    };
    BatchProcessMonitorSearchComponent.prototype.getRiDeveloperAccess = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'UserInformation',
                'query': {
                    'UserCode': this.pageParams.UserCode
                },
                'fields': ['riDeveloper']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var userData = data[0][0];
            if (userData) {
                _this.pageParams.riDeveloper = userData.riDeveloper;
            }
            _this.window_onload();
        });
    };
    BatchProcessMonitorSearchComponent.prototype.FilterSelect_onchange = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'FilterInput', '');
        this.processMonitorTable.clearTable();
        var selectedValue = this.riExchange.riInputElement.GetValue(this.uiForm, 'FilterSelect');
        if (selectedValue === 'BatchProcessTypeCode') {
            if (this.pageParams.statusList.length === 0) {
                this.getBatchProcessTypeLanguageList();
            }
            this.pageParams.StatusFilterSelect = false;
            this.riExchange.riInputElement.Disable(this.uiForm, 'FilterInput');
        }
        else {
            this.pageParams.StatusFilterSelect = true;
            this.riExchange.riInputElement.Enable(this.uiForm, 'FilterInput');
        }
    };
    BatchProcessMonitorSearchComponent.prototype.getBatchProcessTypeLanguageList = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        this.pageParams.statusList = [];
        var formdata = {};
        formdata['LanguageCode'] = this.riExchange.LanguageCode();
        query.set(this.serviceConstants.Action, '0');
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, query, formdata)
            .subscribe(function (data) {
            var arr = data.records;
            if (arr && arr.length > 0) {
                for (var i = 0; i < arr.length; i++) {
                    var obj = {
                        BatchProcessTypeCode: arr[i].BatchProcessTypeCode,
                        BatchProcessTypeDisplayDesc: arr[i].BatchProcessTypeDisplayDesc
                    };
                    _this.pageParams.statusList.push(obj);
                }
            }
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'StatusFilterSelect', 0);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'FilterInput', 0);
        }, function (error) {
            _this.errorService.emitError('Record not found');
        });
    };
    BatchProcessMonitorSearchComponent.prototype.StatusFilterSelect_onclick = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'FilterInput', this.riExchange.riInputElement.GetValue(this.uiForm, 'StatusFilterSelect'));
    };
    BatchProcessMonitorSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSMBatchProcessMonitorSearch.html'
                },] },
    ];
    BatchProcessMonitorSearchComponent.ctorParameters = [
        { type: Injector, },
        { type: LocalStorageService, },
    ];
    BatchProcessMonitorSearchComponent.propDecorators = {
        'processMonitorTable': [{ type: ViewChild, args: ['processMonitorTable',] },],
    };
    return BatchProcessMonitorSearchComponent;
}(BaseComponent));
