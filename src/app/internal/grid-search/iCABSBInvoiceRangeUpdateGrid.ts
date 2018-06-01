import { Component, OnInit, Injector, ViewChild, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs/Subscription';

import { InternalMaintenanceSalesModuleRoutes } from './../../base/PageRoutes';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from './../../base/BaseComponent';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';

@Component({
    templateUrl: 'iCABSBInvoiceRangeUpdateGrid.html'
})
export class InvoiceRangeUpdateGridComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    private lookUpSubscription: Subscription;
    private xhr: Object = {
        module: 'invoicing',
        method: 'bill-to-cash/maintenance',
        operation: 'Business/iCABSBInvoiceRangeUpdateGrid'
    };
    public pageId: string = '';
    public itemsPerPage: number = 10;
    public totalRecords: number = 1;
    public currentPage: number = 1;
    public maxColumn: number = 13;
    public controls: Array<any> = [
        { name: 'BusinessDesc', readonly: false, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ActiveOnly', readonly: false, disabled: false, required: false },
        { name: 'menu', readonly: false, disabled: false, required: false }
    ];
    public systemChars: Object = {
        vEnableTaxInvoiceRange: '' //4230
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBINVOICERANGEUPDATEGRID;
        this.pageTitle = 'Invoice Range Details';
        this.browserTitle = 'Invoice Range Maintenance';
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.riGrid.FunctionUpdateSupport = true;
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        };
    }

    public ngAfterViewInit(): void {
        if (this.isReturning()) {
            this.populateUIFromFormData();
        } else
            this.setControlValue('ActiveOnly', true);
        this.setControlValue('BusinessDesc', this.utils.getBusinessCode() + '-' + this.utils.getBusinessText());
        this.setControlValue('menu', '');
        this.loadSystemChars();
    };

    public loadSystemChars(): void {
        let sysNumbers: Array<any> = [
            this.sysCharConstants.SystemCharEnableTaxInvoiceRanges
        ];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpSubscription = this.fetchSysChar(sysNumbers)
            .subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                } else {
                    if (e.records && e.records.length > 0) {
                        this.systemChars['vEnableTaxInvoiceRange'] = e.records[0].Required;
                        this.buildGrid();
                    }
                };
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }
    /*** Method to get system characters
    * @params field- systemchars variables looking for  and type- L,R,I
    */
    public fetchSysChar(sysCharNumbers: any): any {
        let querySysChar: URLSearchParams = this.getURLSearchParamObject();
        querySysChar.set(this.serviceConstants.Action, '0');

        if (this.utils.getBusinessCode()) {
            querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        } else {
            querySysChar.set(this.serviceConstants.BusinessCode, this.businessCode());
        }
        if (this.utils.getCountryCode()) {
            querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        } else {
            querySysChar.set(this.serviceConstants.BusinessCode, this.countryCode());
        }
        querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(querySysChar);
    }

    //Grid
    public buildGrid(): void {
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.DefaultTextColor = '0000FF';
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.FunctionUpdateSupport = true;

        this.riGrid.Clear();
        this.riGrid.AddColumn('InvoiceRangeNumber', 'InvoiceRangeNumber', 'InvoiceRangeNumber', MntConst.eTypeInteger, 3, false, '');
        this.riGrid.AddColumnUpdateSupport('InvoiceRangeNumber', false);
        this.riGrid.AddColumnOrderable('InvoiceRangeNumber', true);
        this.riGrid.AddColumn('InvoiceRangeDesc', 'InvoiceRangeDesc', 'InvoiceRangeDesc', MntConst.eTypeTextFree, 30, false, '');
        this.riGrid.AddColumnUpdateSupport('InvoiceRangeDesc', false);
        this.riGrid.AddColumnOrderable('InvoiceRangeDesc', true);
        this.riGrid.AddColumn('ActiveRangeInd', 'ActiveRangeInd', 'ActiveRangeInd', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumnUpdateSupport('ActiveRangeInd', true);
        this.riGrid.AddColumn('CompanyCode', 'CompanyCode', 'CompanyCode', MntConst.eTypeText, 2, false, '');
        this.riGrid.AddColumnUpdateSupport('CompanyCode', false);
        this.riGrid.AddColumnOrderable('CompanyCode', true);
        this.riGrid.AddColumn('BranchNumber', 'BranchNumber', 'BranchNumber', MntConst.eTypeText, 2, false, '');
        this.riGrid.AddColumnUpdateSupport('BranchNumber', false);
        this.riGrid.AddColumnOrderable('BranchNumber', true);
        this.riGrid.AddColumn('TaxCode', 'TaxCode', 'TaxCode', MntConst.eTypeText, 1, false, '');
        this.riGrid.AddColumnUpdateSupport('TaxCode', false);
        this.riGrid.AddColumnOrderable('TaxCode', true);
        this.riGrid.AddColumn('InvoiceCreditCode', 'InvoiceCreditCode', 'InvoiceCreditCode', MntConst.eTypeText, 1, false, '');
        this.riGrid.AddColumnUpdateSupport('InvoiceCreditCode', false);
        this.riGrid.AddColumnOrderable('InvoiceCreditCode', true);
        this.riGrid.AddColumn('ContractTypeCode', 'ContractTypeCode', 'ContractTypeCode', MntConst.eTypeText, 1, false, '');
        this.riGrid.AddColumnUpdateSupport('ContractTypeCode', false);
        this.riGrid.AddColumnOrderable('ContractTypeCode', true);
        this.riGrid.AddColumn('InvoiceRangePrefix', 'InvoiceRangePrefix', 'InvoiceRangePrefix', MntConst.eTypeCode, 2, false, '');
        this.riGrid.AddColumnUpdateSupport('InvoiceRangePrefix', true);
        this.riGrid.AddColumn('InvoiceRangeSuffix', 'InvoiceRangeSuffix', 'InvoiceRangeSuffix', MntConst.eTypeCode, 2, false, '');
        this.riGrid.AddColumnUpdateSupport('InvoiceRangeSuffix', true);
        this.riGrid.AddColumn('MinimumInvoiceNumber', 'MinimumInvoiceNumber', 'MinimumInvoiceNumber', MntConst.eTypeInteger, 9, false, '');
        this.riGrid.AddColumnUpdateSupport('MinimumInvoiceNumber', true);
        this.riGrid.AddColumn('MaximumInvoiceNumber', 'MaximumInvoiceNumber', 'MaximumInvoiceNumber', MntConst.eTypeInteger, 9, false, '');
        this.riGrid.AddColumnUpdateSupport('MaximumInvoiceNumber', true);
        this.riGrid.AddColumn('NextInvoiceNumber', 'NextInvoiceNumber', 'NextInvoiceNumber', MntConst.eTypeInteger, 10, false, '');
        this.riGrid.AddColumnUpdateSupport('NextInvoiceNumber', false);
        if (this.systemChars['vEnableTaxInvoiceRange']) {
            this.riGrid.AddColumn('TaxRange', 'TaxRange', 'TaxRange', MntConst.eTypeImage, 1, false, '');
            this.riGrid.AddColumnUpdateSupport('TaxRange', true);
        }
        this.riGrid.Complete();
        this.riGridBeforeExecute();
    }

    public riGridBeforeExecute(): void {
        let postParams: any = {};
        let search: URLSearchParams = this.getURLSearchParamObject();
        this.maxColumn = this.systemChars['vEnableTaxInvoiceRange'] ? this.maxColumn + 1 : this.maxColumn;
        postParams.methodtype = 'grid';
        postParams.Level = 'Detail';
        search.set(this.serviceConstants.Action, '2');
        search.set('ActiveOnly', this.getControlValue('ActiveOnly'));
        search.set(this.serviceConstants.GridMode, '0');
        search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        search.set(this.serviceConstants.GridHandle, this.utils.gridHandle);
        search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        let sortOrder: any = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        search.set('riSortOrder', sortOrder);
        this.ajaxSource.next(AjaxConstant.START);
        this.httpService.makePostRequest(this.xhr['method'], this.xhr['module'], this.xhr['operation'], search, postParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.itemsPerPage : 1;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateFooter = true;
                    this.riGrid.Execute(data);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    };
    //Grid Refresh
    public btnRefresh(): void {
        this.currentPage = 1;
        this.riGrid.Mode = MntConst.eModeNormal;
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }
    // pagination current page
    public getCurrentPage(currentPage: any): void {
        if (this.currentPage !== currentPage.value) {
            this.currentPage = currentPage.value;
            this.riGrid.RefreshRequired();
            this.riGridBeforeExecute();
        }
    }

    public riGridSort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    };

    public onDblClick(event: any): void {
        switch (this.riGrid.CurrentColumnName) {
            case 'InvoiceRangeNumber':
                this.navigate('InvoiceRangeUpdate', InternalMaintenanceSalesModuleRoutes.ICABSBINVOICERANGEMAINTENANCE, { 'RowID': this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'rowid') });
                break;
            case 'ActiveRangeInd':
                this.rangeChange(this.riGrid.CurrentColumnName);
                break;
            case 'TaxRange':
                this.rangeChange(this.riGrid.CurrentColumnName);
                break;
        }
    }

    public rangeChange(colName: any): void {
        let postParams: Object = {},
            search: URLSearchParams = this.getURLSearchParamObject();
        switch (this.riGrid.CurrentColumnName) {
            case 'ActiveRangeInd':
                postParams[this.serviceConstants.Function] = 'UpdateActiveRangeInd';
                break;
            case 'TaxRange':
                postParams[this.serviceConstants.Function] = 'UpdateTaxRange';
                break;
        }
        postParams['methodtype'] = 'maintenance';
        search.set(this.serviceConstants.Action, '6');
        search.set('Rowid', this.riGrid.Details.GetAttribute('InvoiceRangeNumber', 'rowid'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhr['method'], this.xhr['module'], this.xhr['operation'], search, postParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.btnRefresh();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }

    public menuOnchange(event: any): void {
        switch (event) {
            case 'Add':
                this.navigate('InvoiceRangeAdd', InternalMaintenanceSalesModuleRoutes.ICABSBINVOICERANGEMAINTENANCE, {});
                break;
        }
    };

    public onCellBlur(event: Event): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '2');
        search.set('InvoiceRangeNumberRowID', this.riGrid.bodyArray[this.riGrid.CurrentRow][0]['rowID']);
        search.set('InvoiceRangeNumber', this.riGrid.Details.GetValue('InvoiceRangeNumber'));
        search.set('CompanyCode', this.riGrid.Details.GetValue('CompanyCode'));
        search.set('BranchNumber', this.riGrid.Details.GetValue('BranchNumber'));
        search.set('TaxCode', this.riGrid.Details.GetValue('TaxCode'));
        search.set('InvoiceCreditCode', this.riGrid.Details.GetValue('InvoiceCreditCode'));
        search.set('ContractTypeCode', this.riGrid.Details.GetValue('ContractTypeCode'));
        search.set('InvoiceRangePrefixRowID', '1');
        search.set('InvoiceRangePrefix', this.riGrid.Details.GetValue('InvoiceRangePrefix'));
        search.set('InvoiceRangeSuffixRowID', '1');
        search.set('InvoiceRangeSuffix', this.riGrid.Details.GetValue('InvoiceRangeSuffix'));
        search.set('MinimumInvoiceNumberRowID', '1');
        search.set('MinimumInvoiceNumber', this.riGrid.Details.GetValue('MinimumInvoiceNumber'));
        search.set('MaximumInvoiceNumberRowID', '1');
        search.set('MaximumInvoiceNumber', this.riGrid.Details.GetValue('MaximumInvoiceNumber'));
        search.set('NextInvoiceNumber', this.riGrid.Details.GetValue('NextInvoiceNumber'));

        search.set('ActiveOnly', 'false');
        search.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        search.set(this.serviceConstants.GridSortOrder, this.riGrid.SortOrder);
        search.set(this.serviceConstants.GridMode, '3');
        search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makeGetRequest(this.xhr['method'], this.xhr['module'], this.xhr['operation'], search)
            .subscribe(
            (data) => {
                if (data) {
                    this.riGrid.Mode = MntConst.eModeNormal;
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
                if (data['errorMessage'] || data['fullError'])
                    this.modalAdvService.emitMessage(new ICabsModalVO(data['errorMessage'], data['fullError']));
                if (data['body'] && data['body']['cells'] && (data['body']['cells'].length < 1))
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully));
            },
            error => {
                this.riGrid.Mode = MntConst.eModeNormal;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }
}
