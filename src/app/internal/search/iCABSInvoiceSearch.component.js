var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
export var InvoiceSearchComponent = (function (_super) {
    __extends(InvoiceSearchComponent, _super);
    function InvoiceSearchComponent(injector, ellipsis) {
        _super.call(this, injector);
        this.ellipsis = ellipsis;
        this.inputParams = {};
        this.pageId = '';
        this.pageTitle = '';
        this.itemsPerPage = 10;
        this.totalRecords = 1;
        this.currentPage = 1;
        this.maxColumn = 9;
        this.isRequesting = false;
        this.invoiceSearchParams = {};
        this.controls = [
            { name: 'BusinessDesc', readonly: true, disabled: true, required: false },
            { name: 'BusinessCode', readonly: true, disabled: true, required: false },
            { name: 'CompanyCode', readonly: true, disabled: true, required: false },
            { name: 'CompanyDesc', readonly: true, disabled: true, required: false },
            { name: 'CompanyInvoiceNumber', disabled: false, required: false }
        ];
        this.search = new URLSearchParams();
        this.queryParams = {
            operation: 'Application/iCABSInvoiceSearch',
            module: 'invoicing',
            method: 'bill-to-cash/search'
        };
        this.formModel = {};
        this.pageId = PageIdentifier.ICABSINVOICESEARCH;
        this.pageParams.vBusinessCode = this.utils.getBusinessCode();
    }
    InvoiceSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
    };
    InvoiceSearchComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    InvoiceSearchComponent.prototype.updateView = function (params) {
        this.invoiceSearchParams['parentMode'] = params.parentMode;
        this.invoiceSearchParams['companyCode'] = params.companyCode;
        switch (params.parentMode) {
            case 'ProRataCharge':
                this.invoiceSearchParams['CompanyInvoiceNumber'] = params.OriginalCompanyInvoiceNumber;
                break;
            case 'InvoiceHistory':
            case 'InvoicePrintMaintenance':
            case 'CreditReInvoice':
                this.invoiceSearchParams['CompanyInvoiceNumber'] = params.CompanyInvoiceNumber;
                break;
            default:
                this.invoiceSearchParams['CompanyInvoiceNumber'] = false;
                break;
        }
        this.doLookup('Business', { 'BusinessCode': this.pageParams.vBusinessCode }, ['BusinessDesc']);
        this.doLookup('Company', { 'BusinessCode': this.pageParams.vBusinessCode, 'CompanyCode': this.invoiceSearchParams.companyCode }, ['CompanyDesc']);
        this.GetDisplayFieldList();
    };
    InvoiceSearchComponent.prototype.doLookup = function (table, query, fields) {
        var _this = this;
        var lookupIP = [{
                'table': table,
                'query': query,
                'fields': fields
            }];
        this.LookUp.lookUpPromise(lookupIP).then(function (data) {
            _this.isRequesting = true;
            var record = data[0];
            switch (table) {
                case 'Business':
                    if (record.length > 0) {
                        _this.pageParams.BusinessDesc = record[0].hasOwnProperty('BusinessDesc') ? record[0]['BusinessDesc'] : false;
                        _this.setControlValue('BusinessDesc', _this.pageParams.BusinessDesc);
                        _this.setControlValue('BusinessCode', _this.pageParams.vBusinessCode);
                    }
                    _this.isRequesting = false;
                    break;
                case 'Company':
                    if (record.length > 0) {
                        _this.pageParams.CompanyDesc = record[0].hasOwnProperty('CompanyDesc') ? record[0]['CompanyDesc'] : false;
                        _this.setControlValue('CompanyDesc', _this.pageParams.CompanyDesc);
                        _this.setControlValue('CompanyCode', query['CompanyCode']);
                    }
                    _this.isRequesting = false;
                    break;
            }
            _this.setControlValue('CompanyInvoiceNumber', _this.ellipsis.childConfigParams['CompanyInvoiceNumber']);
        });
    };
    ;
    InvoiceSearchComponent.prototype.reBuildGrid = function () {
        this.invoiceSearchParams['companyCode'] = this.getControlValue('CompanyCode');
        this.invoiceSearchParams['CompanyInvoiceNumber'] = this.getControlValue('CompanyInvoiceNumber');
        this.GetDisplayFieldList();
    };
    InvoiceSearchComponent.prototype.GetDisplayFieldList = function () {
        var _this = this;
        var postData = {};
        postData['companyCode'] = this.invoiceSearchParams.companyCode;
        postData['CompanyInvoiceNumber'] = this.invoiceSearchParams.CompanyInvoiceNumber;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('Function', 'GetDisplayFieldList');
        this.ajaxSource.next(AjaxConstant.START);
        this.isRequesting = true;
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorService.emitError(e['errorMessage']);
                }
                else {
                    _this.buildGrid(e);
                }
            }
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
            _this.isRequesting = false;
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
            _this.isRequesting = false;
        });
    };
    ;
    InvoiceSearchComponent.prototype.buildGrid = function (DisplayFieldList) {
        this.DisplayFieldList = DisplayFieldList;
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.riGrid.Clear();
        this.riGrid.AddColumn('PeriodStart', 'InvoiceHeader', 'PeriodStart', MntConst.eTypeText, 10, true);
        this.riGrid.AddColumnAlign('PeriodStart', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('PeriodStart', true);
        this.riGrid.AddColumn('ExtractDate', 'InvoiceHeader', 'ExtractDate', MntConst.eTypeText, 10, true);
        this.riGrid.AddColumnAlign('ExtractDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ExtractDate', true);
        if (DisplayFieldList.BranchNumberDisplay.toUpperCase() === 'TRUE') {
            this.riGrid.AddColumn('BranchNumber', 'InvoiceHeader', 'BranchNumber', MntConst.eTypeText, 10);
            this.riGrid.AddColumnAlign('BranchNumber', MntConst.eAlignmentRight);
        }
        if (DisplayFieldList.InvoiceRangePrefixDisplay.toUpperCase() === 'TRUE') {
            this.riGrid.AddColumn('InvoicePrefix', 'InvoiceHeader', 'InvoicePrefix', MntConst.eTypeText, 10);
            this.riGrid.AddColumnAlign('InvoicePrefix', MntConst.eAlignmentRight);
        }
        if (DisplayFieldList.InvoiceRangeSuffixDisplay.toUpperCase() === 'TRUE') {
            this.riGrid.AddColumn('InvoiceSuffix', 'InvoiceHeader', 'InvoiceSuffix', MntConst.eTypeText, 10);
            this.riGrid.AddColumnAlign('InvoiceSuffix', MntConst.eAlignmentRight);
        }
        if (DisplayFieldList.TaxCodeDisplay.toUpperCase() === 'TRUE') {
            this.riGrid.AddColumn('TaxCode', 'InvoiceHeader', 'TaxCode', MntConst.eTypeText, 10);
            this.riGrid.AddColumnAlign('TaxCode', MntConst.eAlignmentRight);
        }
        this.riGrid.AddColumn('InvoiceCreditCode', 'InvoiceHeader', 'InvoiceCreditCode', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('InvoiceCreditCode', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('ContractType', 'InvoiceHeader', 'ContractType', MntConst.eTypeText, 10, true);
        this.riGrid.AddColumnAlign('ContractType', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('AccountNumber', 'InvoiceHeader', 'AccountNumber', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('AccountNumber', MntConst.eAlignmentRight);
        this.riGrid.AddColumnOrderable('AccountNumber', true);
        this.riGrid.AddColumn('InvoiceGroupNumber', 'InvoiceHeader', 'InvoiceGroupNumber', MntConst.eTypeInteger, 30);
        this.riGrid.AddColumnAlign('InvoiceGroupNumber', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnOrderable('InvoiceGroupNumber', true);
        this.riGrid.AddColumn('InvoiceName', 'InvoiceHeader', 'InvoiceName', MntConst.eTypeText, 1, true);
        this.riGrid.AddColumnAlign('InvoiceName', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('Value', 'InvoiceHeader', 'Value', MntConst.eTypeText, 1, true);
        this.riGrid.AddColumnAlign('Value', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('TaxValue', 'InvoiceHeader', 'TaxValue', MntConst.eTypeText, 1, true);
        this.riGrid.AddColumnAlign('TaxValue', MntConst.eAlignmentCenter);
        this.riGrid.Complete();
        this.loadData(DisplayFieldList);
    };
    InvoiceSearchComponent.prototype.loadData = function (DisplayFieldList) {
        var _this = this;
        this.ajaxSource.next(AjaxConstant.START);
        this.isRequesting = true;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set('companyCode', this.getControlValue('CompanyCode'));
        this.search.set('companyInvoiceNumber', this.getControlValue('CompanyInvoiceNumber'));
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.PageCurrent, '1');
        this.search.set(this.serviceConstants.PageSize, '10');
        this.search.set(this.serviceConstants.PageCurrent, '1');
        this.search.set(this.serviceConstants.GridHandle, (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        var sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.search.set(this.serviceConstants.GridSortOrder, sortOrder);
        if (DisplayFieldList.BranchNumberDisplay.toUpperCase() === 'TRUE') {
            this.search.set('BranchDisplay', 'TRUE');
        }
        if (DisplayFieldList.TaxCodeDisplay.toUpperCase() === 'TRUE') {
            this.search.set('TaxCodeDisplay', 'TRUE');
        }
        if (DisplayFieldList.InvoiceRangePrefixDisplay.toUpperCase() === 'TRUE') {
            this.search.set('InvoicePrefixDisplay', 'TRUE');
        }
        if (DisplayFieldList.InvoiceRangeSuffixDisplay.toUpperCase() === 'TRUE') {
            this.search.set('InvoiceSuffixDisplay', 'TRUE');
        }
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search)
            .subscribe(function (data) {
            if (data.errorMessage) {
                _this.errorService.emitError(data);
            }
            else {
                try {
                    _this.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                    _this.totalRecords = data.pageData ? data.pageData.lastPageNumber : 1;
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
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
            _this.isRequesting = false;
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
            _this.isRequesting = false;
        });
    };
    InvoiceSearchComponent.prototype.gridOnDblClick = function (event) {
        var objSrc, objTR;
        if (event.srcElement.tagName === 'SPAN') {
            objSrc = event.srcElement.parentElement.parentElement;
        }
        else {
            objSrc = event.srcElement;
        }
        ;
        objTR = objSrc.parentElement;
        this.ellipsis.sendDataToParent(objTR.children[0].getAttribute('additionalproperty'));
    };
    ;
    InvoiceSearchComponent.prototype.getCurrentPage = function (currentPage) {
        if (this.currentPage === currentPage.value) {
            return;
        }
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.riGrid.RefreshRequired();
        this.reBuildGrid();
    };
    InvoiceSearchComponent.prototype.refresh = function () {
        this.currentPage = 1;
        this.riGrid.RefreshRequired();
        this.reBuildGrid();
    };
    InvoiceSearchComponent.prototype.riGrid_Sort = function (event) {
        this.riGrid.RefreshRequired();
        this.loadData(this.DisplayFieldList);
    };
    InvoiceSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSInvoiceSearch.html'
                },] },
    ];
    InvoiceSearchComponent.ctorParameters = [
        { type: Injector, },
        { type: EllipsisComponent, },
    ];
    InvoiceSearchComponent.propDecorators = {
        'invoiceSearchGrid': [{ type: ViewChild, args: ['invoiceSearchGrid',] },],
        'invoiceSearchPagination': [{ type: ViewChild, args: ['invoiceSearchPagination',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
    };
    return InvoiceSearchComponent;
}(BaseComponent));
