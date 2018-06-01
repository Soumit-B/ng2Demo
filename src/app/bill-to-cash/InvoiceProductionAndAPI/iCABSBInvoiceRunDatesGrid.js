var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Router } from '@angular/router';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
export var InvoiceRunDatesGridComponent = (function (_super) {
    __extends(InvoiceRunDatesGridComponent, _super);
    function InvoiceRunDatesGridComponent(injector, router) {
        _super.call(this, injector);
        this.router = router;
        this.pageTitle = '';
        this.showHeader = true;
        this.itemsPerPage = 10;
        this.pageCurrent = 1;
        this.totalRecords = 1;
        this.pageId = '';
        this.search = new URLSearchParams();
        this.inputParams = {};
        this.autoRefreshTime = {};
        this.runDatesSelectList = [{ text: 'Options', value: '' }];
        this.currentContractTypeURLParameter = { currentContractTypeURLParameter: 'contract', Mode: 'Release' };
        this.queryParams = {
            operation: 'Business/iCABSBInvoiceRunDatesGrid',
            module: 'invoicing',
            method: 'bill-to-cash/grid'
        };
        this.contractSearchParams = {
            'currentContractTypeURLParameter': '<contract>'
        };
        this.controls = [
            { name: 'RowID', readonly: true, disabled: true, required: false },
            { name: 'InvoiceRunDateRowID', readonly: true, disabled: true, required: false }
        ];
        this.pageId = PageIdentifier.ICABSBINVOICERUNDATESGRID;
    }
    InvoiceRunDatesGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Invoice Run Dates';
        this.window_onload();
        this.autoRefreshTime = TimerObservable.create(0, 60000);
    };
    InvoiceRunDatesGridComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.activatedRouteSubscription = this.activatedRoute.queryParams.subscribe(function (param) {
            if (param.single) {
                _this.StrSingleInvoiceRun = true;
            }
            else {
                _this.StrSingleInvoiceRun = false;
            }
            _this.buildMenuOptions();
        });
    };
    InvoiceRunDatesGridComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show(data, true);
    };
    InvoiceRunDatesGridComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };
    InvoiceRunDatesGridComponent.prototype.window_onload = function () {
        this.buildGrid();
    };
    InvoiceRunDatesGridComponent.prototype.buildMenuOptions = function () {
        if ((this.runDatesSelectList).length > 1) {
            this.runDatesSelectList.pop();
        }
        if (this.StrSingleInvoiceRun) {
            this.runDatesSelectList.push({ text: 'Add Single', value: 'AddSingle' });
        }
        else {
            this.runDatesSelectList.push({ text: 'Add', value: 'Add' });
        }
    };
    InvoiceRunDatesGridComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        if (this.autoRefreshTime_subscription) {
            this.autoRefreshTime_subscription.unsubscribe();
        }
    };
    InvoiceRunDatesGridComponent.prototype.buildGrid = function () {
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.riGrid.Clear();
        this.riGrid.AddColumn('ExtractDate', 'InvoiceRunDate', 'ExtractDate', MntConst.eTypeDate, 10, true);
        this.riGrid.AddColumnAlign('ExtractDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ExtractRunNumber', 'InvoiceRunDate', 'ExtractRunNumber', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('ExtractRunNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ProcessDate', 'InvoiceRunDate', 'ProcessDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ProcessDate', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('InvoiceTotalExclTAX', 'InvoiceRunDate', 'InvoiceTotalExclTAX', MntConst.eTypeCurrency, 10);
        this.riGrid.AddColumnAlign('InvoiceTotalExclTAX', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('InvoiceTAXTotal', 'InvoiceRunDate', 'InvoiceTAXTotal', MntConst.eTypeCurrency, 10);
        this.riGrid.AddColumnAlign('InvoiceTAXTotal', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('CreditTotalExclTAX', 'InvoiceRunDate', 'CreditTotalExclTAX', MntConst.eTypeCurrency, 10);
        this.riGrid.AddColumnAlign('CreditTotalExclTAX', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('CreditTAXTotal', 'InvoiceRunDate', 'CreditTAXTotal', MntConst.eTypeCurrency, 10);
        this.riGrid.AddColumnAlign('CreditTAXTotal', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('NumberofInvoices', 'InvoiceRunDate', 'NumberofInvoices', MntConst.eTypeInteger, 6);
        this.riGrid.AddColumnAlign('NumberofInvoices', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('NumberofCredits', 'InvoiceRunDate', 'NumberofCredits', MntConst.eTypeInteger, 6);
        this.riGrid.AddColumnAlign('NumberofCredits', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('BatchStatus', 'InvoiceRunDate', 'BatchStatus', MntConst.eTypeText, 30);
        this.riGrid.AddColumnAlign('BatchStatus', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('PrintImage', 'InvoiceRunDate', 'PrintImage', MntConst.eTypeImage, 1, true);
        this.riGrid.AddColumnAlign('PrintImage', MntConst.eAlignmentCenter);
        this.riGrid.Complete();
        this.loadData();
    };
    InvoiceRunDatesGridComponent.prototype.loadData = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set(this.serviceConstants.GridSortOrder, 'Descending');
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, '');
        this.search.set('SingleInvoiceRun', '');
        this.inputParams.search = this.search;
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.search)
            .subscribe(function (data) {
            if (data.hasError) {
                _this.showErrorModal(data);
            }
            else {
                try {
                    _this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                    _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    _this.riGrid.Update = true;
                    _this.riGrid.UpdateHeader = true;
                    _this.riGrid.UpdateBody = true;
                    _this.riGrid.UpdateFooter = true;
                    _this.riGrid.Execute(data);
                }
                catch (e) {
                    _this.logger.log(' Problem in grid load', e);
                }
                _this.setFormMode(_this.c_s_MODE_UPDATE);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.showErrorModal(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    InvoiceRunDatesGridComponent.prototype.getCurrentPage = function (data) {
        if (this.pageCurrent === data.value) {
            return;
        }
        this.pageCurrent = data.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.pageCurrent));
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.loadData();
    };
    InvoiceRunDatesGridComponent.prototype.refresh = function () {
        this.riGrid.RefreshRequired();
        this.loadData();
    };
    InvoiceRunDatesGridComponent.prototype.autoRefresh = function (data) {
        var _this = this;
        if (data.target.checked) {
            this.autoRefreshTime_subscription = this.autoRefreshTime.subscribe(function (data) {
                _this.refresh();
            });
        }
        else {
            if (this.autoRefreshTime_subscription) {
                this.autoRefreshTime_subscription.unsubscribe();
            }
        }
    };
    InvoiceRunDatesGridComponent.prototype.invoiceprint = function (data) {
        var tempRange = {};
        var additionaldata = this.riGrid.Details.GetAttribute('PrintImage', 'AdditionalProperty');
        tempRange = additionaldata.split(',');
        this.setControlValue('InvoiceNumberFirst', tempRange[0]);
        this.setControlValue('InvoiceNumberLast', tempRange[1]);
        this.router.navigate(['/application/invoiceRunDate/print'], { queryParams: { InvoiceNumberFirst: tempRange[0], InvoiceNumberLast: tempRange[1] } });
    };
    InvoiceRunDatesGridComponent.prototype.menuOnchange = function (menu) {
        switch (menu) {
            case 'Add':
                this.Add();
                break;
            case 'AddSingle':
                this.AddSingle();
                break;
        }
    };
    InvoiceRunDatesGridComponent.prototype.Add = function () {
        this.navigate('InvoiceRunDatesAdd', '/maintenance/invoiceRunDateMaintenance', {
            'parentMode': 'InvoiceRunDatesAdd'
        });
    };
    InvoiceRunDatesGridComponent.prototype.AddSingle = function () {
        this.navigate('InvoiceRunDatesAddSingle', '/maintenance/invoiceRunDateMaintenance', {
            'parentMode': 'InvoiceRunDatesAddSingle'
        });
    };
    InvoiceRunDatesGridComponent.prototype.riGrid_onGridRowClick = function (data) {
        var cellInfo = data.srcElement.name;
        if (cellInfo !== 'BatchStatus') {
            this.setControlValue('RecordType', this.riGrid.Details.GetAttribute(cellInfo, 'AdditionalProperty'));
            this.setControlValue('ExtractDate', this.riGrid.Details.GetValue('ExtractDate'));
        }
    };
    InvoiceRunDatesGridComponent.prototype.riGrid_getGridOnDblClick = function (event) {
        var StrSingleDesc;
        var colName = this.riGrid.CurrentColumnName;
        switch (colName) {
            case 'PrintImage':
                if (event.target.tagName === 'IMG') {
                    this.invoiceprint(event);
                }
                break;
            case 'ExtractDate':
                var StrSingleDesc_1 = {};
                if (this.StrSingleInvoiceRun === true) {
                    StrSingleDesc_1 = 'Single';
                    this.setControlValue('RowID', this.riGrid.Details.GetAttribute('ExtractDate', 'rowID'));
                    this.navigate('InvoiceRunDates', '/maintenance/invoiceRunDateMaintenance', {
                        'parentMode': 'InvoiceRunDates',
                        'StrSingleDesc': StrSingleDesc_1
                    });
                }
                else {
                    this.setControlValue('RowID', this.riGrid.Details.GetAttribute('ExtractDate', 'rowID'));
                    this.navigate('InvoiceRunDates', '/maintenance/invoiceRunDateMaintenance', {
                        'parentMode': 'InvoiceRunDates'
                    });
                }
                break;
            case 'ExtractRunNumber':
                if (event.target.tagName === 'INPUT') {
                    var ExtractDate = this.riGrid.Details.GetValue('ExtractDate');
                    var InvoiceRunDateRowID = this.riGrid.Details.GetAttribute('ExtractRunNumber', 'rowID');
                    this.navigate('', '/business/rundateconfirm', {
                        ExtractDate: ExtractDate,
                        InvoiceRunDateRowID: InvoiceRunDateRowID
                    });
                }
        }
    };
    InvoiceRunDatesGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBInvoiceRunDatesGrid.html'
                },] },
    ];
    InvoiceRunDatesGridComponent.ctorParameters = [
        { type: Injector, },
        { type: Router, },
    ];
    InvoiceRunDatesGridComponent.propDecorators = {
        'invoiceRunDatesGrid': [{ type: ViewChild, args: ['invoiceRunDatesGrid',] },],
        'invoiceRunDatesGridPagination': [{ type: ViewChild, args: ['invoiceRunDatesGridPagination',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
        'runDatesSelectDropdown': [{ type: ViewChild, args: ['runDatesSelectDropdown',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return InvoiceRunDatesGridComponent;
}(BaseComponent));
