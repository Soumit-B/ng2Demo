import { Component, OnInit, Injector, ViewChild, OnDestroy, Input } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { URLSearchParams } from '@angular/http';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
@Component({
    templateUrl: 'iCABSInvoiceSearch.html'
})

export class InvoiceSearchComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('invoiceSearchGrid') invoiceSearchGrid;
    @ViewChild('invoiceSearchPagination') invoiceSearchPagination: PaginationComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    public inputParams: any = {};
    public pageId: string = '';
    public pageTitle: string = '';
    public itemsPerPage: number = 10;
    public totalRecords: number = 1;
    public currentPage: number = 1;
    public maxColumn: number = 9;
    public pageParams: any;
    public isRequesting: boolean = false;
    public errorMessage: string;
    public inputParamsForinvoiceSearchGrid: any;
    public invoiceSearchParams: any = {};
    public DisplayFieldList: any;
    public controls = [
        { name: 'BusinessDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'BusinessCode', readonly: true, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'CompanyCode', readonly: true, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'CompanyDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'CompanyInvoiceNumber', disabled: false, required: true, type: MntConst.eTypeInteger }
    ];
    public search = new URLSearchParams();
    public queryParams: any = {
        operation: 'Application/iCABSInvoiceSearch',
        module: 'invoicing',
        method: 'bill-to-cash/search'
    };

    public formModel: any = {};

    constructor(injector: Injector,
        private ellipsis: EllipsisComponent) {
        super(injector);
        this.pageId = PageIdentifier.ICABSINVOICESEARCH;
        this.pageParams.vBusinessCode = this.utils.getBusinessCode();
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
    public updateView(params: any): void {
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
    }
    private doLookup(table: any, query: any, fields: any): any {
        let lookupIP = [{
            'table': table,
            'query': query,
            'fields': fields
        }];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            this.isRequesting = true;
            let record = data[0];
            switch (table) {
                case 'Business':
                    if (record && record.length > 0) {
                        this.pageParams.BusinessDesc = record[0].hasOwnProperty('BusinessDesc') ? record[0]['BusinessDesc'] : false;
                        this.setControlValue('BusinessDesc', this.pageParams.BusinessDesc);
                        this.setControlValue('BusinessCode', this.pageParams.vBusinessCode);
                    }
                    this.isRequesting = false;
                    break;
                case 'Company':
                    if (record && record.length > 0) {
                        this.pageParams.CompanyDesc = record[0].hasOwnProperty('CompanyDesc') ? record[0]['CompanyDesc'] : false;
                        this.setControlValue('CompanyDesc', this.pageParams.CompanyDesc);
                        this.setControlValue('CompanyCode', query['CompanyCode']);
                    }
                    this.isRequesting = false;
                    break;
            }
            this.setControlValue('CompanyInvoiceNumber', this.ellipsis.childConfigParams['CompanyInvoiceNumber'] || this.invoiceSearchParams['CompanyInvoiceNumber']);
        });
    };
    private reBuildGrid(): void {
        this.invoiceSearchParams['companyCode'] = this.getControlValue('CompanyCode');
        this.invoiceSearchParams['CompanyInvoiceNumber'] = this.getControlValue('CompanyInvoiceNumber');
        this.GetDisplayFieldList();
    }
    private GetDisplayFieldList(): void {
        let postData = {};
        postData['companyCode'] = this.invoiceSearchParams.companyCode;
        //(params) ? params.companyCode : this.riExchange.riInputElement.GetValue(this.uiForm, 'CompanyCode');
        postData['CompanyInvoiceNumber'] = this.invoiceSearchParams.CompanyInvoiceNumber;
        // this.riExchange.riInputElement.GetValue(this.uiForm, 'CompanyInvoiceNumber');
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('Function', 'GetDisplayFieldList');

        this.ajaxSource.next(AjaxConstant.START);
        this.isRequesting = true;
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData)
            .subscribe(
            (e) => {

                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorService.emitError(e['errorMessage']);
                    } else {
                        this.buildGrid(e);
                    }
                }
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                this.isRequesting = false;
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                this.isRequesting = false;
            });
    };
    public buildGrid(DisplayFieldList: any): void {
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

    }

    private loadData(DisplayFieldList: any): void {
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
        let sortOrder = 'Descending';
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
            .subscribe(
            (data) => {
                if (data.errorMessage) {
                    this.errorService.emitError(data);
                } else {
                    try {
                        this.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                        this.totalRecords = data.pageData ? data.pageData.lastPageNumber : 1;
                        this.riGrid.UpdateHeader = true;
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateFooter = true;
                        this.riGrid.Execute(data);
                    } catch (e) {
                        this.logger.log(' Problem in grid load', e);
                    }
                    this.setFormMode(this.c_s_MODE_UPDATE);
                }
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                this.isRequesting = false;
            },
            (error) => {
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                this.isRequesting = false;
            }
            );
    }
    public gridOnDblClick(event: any): void {
        let objSrc, objTR;
        if (event.srcElement.tagName === 'SPAN') {
            objSrc = event.srcElement.parentElement.parentElement;
        } else {
            objSrc = event.srcElement;
        };
        objTR = objSrc.parentElement;
        this.ellipsis.sendDataToParent(objTR.children[0].getAttribute('additionalproperty'));
    };
    public getCurrentPage(currentPage: any): void {
        if (this.currentPage === currentPage.value) {
            return;
        }
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.riGrid.RefreshRequired();
        this.reBuildGrid();
    }
    public refresh(): void {
        this.currentPage = 1;
        this.riGrid.RefreshRequired();
        this.reBuildGrid();
    }
    public riGrid_Sort(event: any): void {
        this.riGrid.RefreshRequired();
        this.loadData(this.DisplayFieldList);
    }
}
