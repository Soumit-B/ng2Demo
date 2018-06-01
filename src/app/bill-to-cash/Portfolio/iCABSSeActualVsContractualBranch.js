var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
export var ActualVsContractualBranchComponent = (function (_super) {
    __extends(ActualVsContractualBranchComponent, _super);
    function ActualVsContractualBranchComponent(injector) {
        _super.call(this, injector);
        this.queryParams = {
            operation: 'ApplicationReport/iCABSSeActualVsContractualBranch',
            module: 'charges',
            method: 'bill-to-cash/grid'
        };
        this.pageId = '';
        this.itemsPerPage = 15;
        this.currentPage = 1;
        this.totalItems = 10;
        this.maxColumn = 8;
        this.search = new URLSearchParams();
        this.DateTo = new Date();
        this.DateFrom = new Date();
        this.dateReadOnly = false;
        this.controls = [
            { name: 'BusinessCode', readonly: true, disabled: false, required: false },
            { name: 'BusinessDesc', readonly: true, disabled: false, required: false },
            { name: 'BranchNumber', readonly: true, disabled: false, required: true },
            { name: 'BranchName', readonly: true, disabled: false, required: false },
            { name: 'ServiceFilter', readonly: false, disabled: false, required: false, value: 'all' },
            { name: 'PercTolerance', readonly: false, disabled: false, required: false },
            { name: 'FromDate', readonly: false, disabled: false, required: false },
            { name: 'ToDate', readonly: false, disabled: false, required: false },
            { name: 'WasteTransferTypeCode', readonly: false, disabled: false, required: false },
            { name: 'WasteTransferTypeDesc', readonly: true, disabled: false, required: false },
            { name: 'EWCCode', readonly: false, disabled: false, required: false },
            { name: 'EWCDescription', readonly: true, disabled: false, required: false },
            { name: 'GroupCode', readonly: false, disabled: false, required: false }
        ];
        this.pageId = PageIdentifier.ICABSSEACTUALVSCONTRACTUALBRANCH;
    }
    ActualVsContractualBranchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Actual vs Contractual - Branch';
        if (this.formData.BranchNumber) {
            this.populateUIFromFormData();
            this.handleSavedDate();
            this.buildGrid();
        }
        else {
            this.window_onload();
        }
    };
    ActualVsContractualBranchComponent.prototype.ngOnDestroy = function () {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        _super.prototype.ngOnDestroy.call(this);
    };
    ActualVsContractualBranchComponent.prototype.window_onload = function () {
        this.getSysCharDtetails();
        if (this.parentMode === 'business') {
            this.showBackLabel = true;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchNumber', this.riExchange.getParentHTMLValue('GroupCode'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PercTolerance', this.riExchange.getParentHTMLValue('PercTolerance'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'FromDate', this.riExchange.getParentHTMLValue('FromDate'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ToDate', this.riExchange.getParentHTMLValue('ToDate'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'WasteTransferTypeCode', this.riExchange.getParentHTMLValue('WasteTransferTypeCode'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EWCCode', this.riExchange.getParentHTMLValue('EWCCode'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceFilter', this.riExchange.getParentHTMLValue('ServiceFilter'));
            var toDate = this.formData.ToDate;
            if (window['moment'](this.riExchange.getParentHTMLValue('ToDate'), 'DD/MM/YYYY', true).isValid()) {
                toDate = this.utils.convertDate(this.riExchange.getParentHTMLValue('ToDate'));
            }
            else {
                toDate = this.utils.formatDate(this.riExchange.getParentHTMLValue('ToDate'));
            }
            this.DateTo = new Date(toDate);
            var fromdate = this.riExchange.getParentHTMLValue('FromDate');
            if (window['moment'](this.riExchange.getParentHTMLValue('FromDate'), 'DD/MM/YYYY', true).isValid()) {
                fromdate = this.utils.convertDate(this.riExchange.getParentHTMLValue('FromDate'));
            }
            else {
                fromdate = this.utils.formatDate(this.riExchange.getParentHTMLValue('FromDate'));
            }
            this.DateFrom = new Date(fromdate);
            this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceFilter');
            this.dateReadOnly = true;
            this.riExchange.riInputElement.ReadOnly(this.uiForm, 'FromDate', true);
            this.riExchange.riInputElement.ReadOnly(this.uiForm, 'ToDate', true);
            this.riExchange.riInputElement.ReadOnly(this.uiForm, 'PercTolerance', true);
            this.riExchange.riInputElement.ReadOnly(this.uiForm, 'EWCCode', true);
            this.riExchange.riInputElement.ReadOnly(this.uiForm, 'WasteTransferTypeCode', true);
            this.doLookupformData();
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchNumber', this.utils.getBranchCode());
            this.getFromAndToDates();
            this.doLookupformData();
        }
        this.ServiceFilter_onChange({});
        if (this.parentMode === 'business') {
            this.buildGrid();
        }
    };
    ActualVsContractualBranchComponent.prototype.handleSavedDate = function () {
        var toDate = this.formData.ToDate;
        if (window['moment'](this.formData.ToDate, 'DD/MM/YYYY', true).isValid()) {
            toDate = this.utils.convertDate(this.formData.ToDate);
        }
        else {
            toDate = this.utils.formatDate(this.formData.ToDate);
        }
        this.DateTo = new Date(toDate);
        var fromdate = this.formData.FromDate;
        if (window['moment'](this.formData.FromDate, 'DD/MM/YYYY', true).isValid()) {
            fromdate = this.utils.convertDate(this.formData.FromDate);
        }
        else {
            fromdate = this.utils.formatDate(this.formData.FromDate);
        }
        this.DateFrom = new Date(fromdate);
    };
    ActualVsContractualBranchComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharShowPremiseWasteTab];
        var sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records;
            _this.pageParams.vWasteFilterDisp = record[0]['Required'];
        });
    };
    ActualVsContractualBranchComponent.prototype.getFromAndToDates = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '6');
        query.set('Function', 'GetQuarterDates');
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.errorService.emitError(data.oResponse);
            }
            else {
                var toDate = data.ToDate;
                var fromdate = data.FromDate;
                if (window['moment'](data.ToDate, 'DD/MM/YYYY', true).isValid()) {
                    toDate = _this.utils.convertDate(data.ToDate);
                }
                else {
                    toDate = _this.utils.formatDate(data.ToDate);
                }
                _this.DateTo = new Date(toDate);
                if (window['moment'](data.FromDate, 'DD/MM/YYYY', true).isValid()) {
                    fromdate = _this.utils.convertDate(data.FromDate);
                }
                else {
                    fromdate = _this.utils.formatDate(data.FromDate);
                }
                _this.DateFrom = new Date(fromdate);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'FromDate', data.FromDate);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ToDate', data.ToDate);
            }
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PercTolerance', 0);
        }, function (error) {
            _this.errorService.emitError('Record not found');
        });
    };
    ActualVsContractualBranchComponent.prototype.dateFromSelectedValue = function (value) {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'FromDate', value.value);
        }
    };
    ActualVsContractualBranchComponent.prototype.dateToSelectedValue = function (value) {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ToDate', value.value);
        }
    };
    ActualVsContractualBranchComponent.prototype.doLookupformData = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'BranchNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchNumber')
                },
                'fields': ['BranchName']
            },
            {
                'table': 'WasteTransferType',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'WasteTransferTypeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'WasteTransferTypeCode')
                },
                'fields': ['WasteTransferTypeDesc']
            },
            {
                'table': 'EWCCode',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'EWCCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'EWCCode')
                },
                'fields': ['EWCDescription']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var Branch = data[0][0];
            if (Branch) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchName', Branch.BranchName);
            }
            var WasteTransferType = data[1][0];
            if (WasteTransferType) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'WasteTransferTypeDesc', WasteTransferType.WasteTransferTypeDesc);
            }
            var EWCCode = data[2][0];
            if (EWCCode) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EWCDescription', EWCCode.EWCDescription);
            }
        });
    };
    ActualVsContractualBranchComponent.prototype.ServiceFilter_onChange = function (event) {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceFilter') === 'over') {
            this.pageParams.vPercTolerance = false;
        }
        else {
            this.pageParams.vPercTolerance = true;
        }
    };
    ActualVsContractualBranchComponent.prototype.buildGrid = function () {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set('Level', 'Branch');
        this.search.set('BranchNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchNumber'));
        this.search.set('ViewBy', 'BranchServiceArea');
        this.search.set('ServiceFilter', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceFilter'));
        this.search.set('PercTolerance', this.riExchange.riInputElement.GetValue(this.uiForm, 'PercTolerance'));
        this.search.set('FromDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'FromDate'));
        this.search.set('ToDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'ToDate'));
        this.search.set('EWCCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'EWCCode'));
        this.search.set('WasteTransCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'WasteTransCode'));
        this.search.set(this.serviceConstants.PageSize, (this.itemsPerPage - 1).toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '6227514');
        this.queryParams.search = this.search;
        this.actualVsContractualBranchGrid.loadGridData(this.queryParams);
    };
    ActualVsContractualBranchComponent.prototype.onGridRowClick = function (event) {
        if (event.cellIndex === 0 && event.rowData['Area Code'] !== 'TOTAL') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupCode', event.rowData['Area Code']);
            alert(' Navigate to ActualVsContractualPremise');
        }
    };
    ActualVsContractualBranchComponent.prototype.getGridInfo = function (info) {
        this.actualVsContractualBranchPagination.totalItems = info.totalRows;
    };
    ActualVsContractualBranchComponent.prototype.getCurrentPage = function (currentPage) {
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.buildGrid();
    };
    ActualVsContractualBranchComponent.prototype.refresh = function () {
        this.currentPage = 1;
        this.buildGrid();
    };
    ActualVsContractualBranchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSeActualVsContractualBranch.html'
                },] },
    ];
    ActualVsContractualBranchComponent.ctorParameters = [
        { type: Injector, },
    ];
    ActualVsContractualBranchComponent.propDecorators = {
        'actualVsContractualBranchGrid': [{ type: ViewChild, args: ['actualVsContractualBranchGrid',] },],
        'actualVsContractualBranchPagination': [{ type: ViewChild, args: ['actualVsContractualBranchPagination',] },],
    };
    return ActualVsContractualBranchComponent;
}(BaseComponent));
