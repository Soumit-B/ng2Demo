import { InternalMaintenanceSalesModuleRoutes } from './../../base/PageRoutes';
import { Subscription } from 'rxjs/Rx';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';

@Component({
    templateUrl: 'iCABSBInvoiceRunDatesGrid.html'
})

export class InvoiceRunDatesGridComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('invoiceRunDatesGrid') invoiceRunDatesGrid: GridComponent;
    @ViewChild('invoiceRunDatesGridPagination') invoiceRunDatesGridPagination: PaginationComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('runDatesSelectDropdown') runDatesSelectDropdown: DropdownStaticComponent;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    public pageTitle: string = '';
    public showHeader: boolean = true;
    public itemsPerPage: number = 10;
    public pageCurrent: number = 1;
    public gridTotalItems: number;
    public totalRecords: number = 1;
    public pageId: string = '';
    public search: URLSearchParams = new URLSearchParams();
    public inputParams: any = {};
    public autoRefreshTime: any = {};
    public autoRefreshTime_subscription: Subscription;
    public errorMessage: string;
    public runDatesSelectList: Array<any> = [{ text: 'Options', value: '' }];
    public StrSingleInvoiceRun: boolean;
    private currentContractTypeURLParameter: Object = { currentContractTypeURLParameter: 'contract', Mode: 'Release' };

    public queryParams: any = {
        operation: 'Business/iCABSBInvoiceRunDatesGrid',
        module: 'invoicing',
        method: 'bill-to-cash/grid'
    };

    public contractSearchParams: any = {
        'currentContractTypeURLParameter': '<contract>'
    };

    public controls = [
        { name: 'RowID', readonly: true, disabled: true, required: false },
        { name: 'InvoiceRunDateRowID', readonly: true, disabled: true, required: false }
    ];



    constructor(injector: Injector, public router: Router) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBINVOICERUNDATESGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Invoice Run Dates';
        this.window_onload();
        this.utils.setTitle('Invoice Run Dates');
        this.autoRefreshTime = TimerObservable.create(0, 60000);
    }

    ngAfterViewInit(): void {
        this.activatedRouteSubscription = this.activatedRoute.queryParams.subscribe(
            (param: any) => {
                if (param.single) {
                    this.StrSingleInvoiceRun = true;
                } else {
                    this.StrSingleInvoiceRun = false;
                }
                this.buildMenuOptions();
            });
    }

    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    }

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    }

    public window_onload(): void {
        this.buildGrid();
    }

    public buildMenuOptions(): void {
        if ((this.runDatesSelectList).length > 1) {
            this.runDatesSelectList.pop();
        }
        if (this.StrSingleInvoiceRun) {
            this.runDatesSelectList.push({ text: 'Add Single', value: 'AddSingle' });
        } else {
            this.runDatesSelectList.push({ text: 'Add', value: 'Add' });
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.autoRefreshTime_subscription) {
            this.autoRefreshTime_subscription.unsubscribe();
        }
    }

    public buildGrid(): void {
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

    }

    public loadData(): void {
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
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.showErrorModal(data);
                } else {
                    try {
                        this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                        this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                        this.riGrid.UpdateHeader = true;
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateFooter = true;
                        this.riGrid.Execute(data);
                    } catch (e) {
                        this.logger.log(' Problem in grid load', e);
                    }
                    this.setFormMode(this.c_s_MODE_UPDATE);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.showErrorModal(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );

    }

    public getCurrentPage(data: any): void {
        if (this.pageCurrent === data.value) {
            return;
        }
        this.pageCurrent = data.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.pageCurrent));
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.loadData();
    }

    public refresh(): void {
        //this.pageCurrent = 1;
        this.riGrid.RefreshRequired();
        this.loadData();
    }

    public autoRefresh(data: any): void {
        if (data.target.checked) {
            this.autoRefreshTime_subscription = this.autoRefreshTime.subscribe(data => {
                this.refresh();
            });
        } else {
            if (this.autoRefreshTime_subscription) {
                this.autoRefreshTime_subscription.unsubscribe();
            }
        }
    }

    public invoiceprint(data: any): void {
        let tempRange: any = {};
        //let additionaldata = data.srcElement.attributes['additionalproperty'].nodeValue;
        let additionaldata = this.riGrid.Details.GetAttribute('PrintImage', 'AdditionalProperty');
        tempRange = additionaldata.split(',');
        this.setControlValue('InvoiceNumberFirst', tempRange[0]);
        this.setControlValue('InvoiceNumberLast', tempRange[1]);
        this.router.navigate(['/application/invoiceRunDate/print'], { queryParams: { InvoiceNumberFirst: tempRange[0], InvoiceNumberLast: tempRange[1] } });
    }

    public menuOnchange(menu: any): void {
        switch (menu) {
            case 'Add':
                this.Add();
                break;
            case 'AddSingle':
                this.AddSingle();
                break;
        }
    }

    public Add(): void {
        this.navigate('InvoiceRunDatesAdd', InternalMaintenanceSalesModuleRoutes.ICABSBINVOICERUNDATEMAINTENANCE, {
            'parentMode': 'InvoiceRunDatesAdd'
        });
    }

    public AddSingle(): void {
        this.navigate('InvoiceRunDatesAddSingle', InternalMaintenanceSalesModuleRoutes.ICABSBINVOICERUNDATEMAINTENANCE, {
            'parentMode': 'InvoiceRunDatesAddSingle'
        });
    }

    // single click
    public riGrid_onGridRowClick(data: any): void {
        let cellInfo = data.srcElement.name;
        if (cellInfo !== 'BatchStatus') {
            //this.setControlValue('RecordType', data.srcElement.attributes['additionalproperty']);
            this.setControlValue('RecordType', this.riGrid.Details.GetAttribute(cellInfo, 'AdditionalProperty'));
            this.setControlValue('ExtractDate', this.riGrid.Details.GetValue('ExtractDate'));
        }
    }

    // Double click
    public riGrid_getGridOnDblClick(event: any): void {
        let StrSingleDesc;
        let colName = this.riGrid.CurrentColumnName;
        switch (colName) {

            case 'PrintImage':
                if (event.target.tagName === 'IMG') {
                    this.invoiceprint(event);
                }
                break;

            case 'ExtractDate':
                let StrSingleDesc: any = {};
                if (this.StrSingleInvoiceRun === true) {
                    StrSingleDesc = 'Single';
                    //this.setControlValue('RowID', event.target.attributes['rowid'].nodeValue);
                    this.setControlValue('RowID', this.riGrid.Details.GetAttribute('ExtractDate', 'rowID'));
                    this.navigate('InvoiceRunDates', InternalMaintenanceSalesModuleRoutes.ICABSBINVOICERUNDATEMAINTENANCE, {
                        'parentMode': 'InvoiceRunDates',
                        'StrSingleDesc': StrSingleDesc
                    });
                }
                else {
                    this.setControlValue('RowID', this.riGrid.Details.GetAttribute('ExtractDate', 'rowID'));
                    this.navigate('InvoiceRunDates', InternalMaintenanceSalesModuleRoutes.ICABSBINVOICERUNDATEMAINTENANCE, {
                        'parentMode': 'InvoiceRunDates'
                    });
                }
                break;
            case 'ExtractRunNumber':
                if (event.target.tagName === 'INPUT') {
                    //   let runnumber = event.target.value;
                    let ExtractDate = this.riGrid.Details.GetValue('ExtractDate');
                    let InvoiceRunDateRowID = this.riGrid.Details.GetAttribute('ExtractRunNumber', 'rowID');
                    //let InvoiceRunDateRowID = event.target.attributes['rowid'].nodeValue;
                    this.navigate('', InternalMaintenanceSalesModuleRoutes.ICABSBINVOICERUNDATECONFIRM, {
                        ExtractDate,
                        InvoiceRunDateRowID

                    });
                }
        }
    }
}
