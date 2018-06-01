import { InvoiceGroupSearchComponent } from './../search/iCABSAInvoiceGroupSearch.component';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, ViewChild, Injector, OnDestroy, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { Router, Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
@Component({
    templateUrl: 'iCABSAInvoiceGroupAddressAmendmentGrid.html',
    styles: [`
    :host /deep/ .gridtable tbody tr td div.cursor-auto span.cursor-auto {
        white-space: pre-line;
        text-align: left;
        display: inline-block;
        position: relative;
    } 
    :host /deep/ .gridtable tbody tr td:nth-child(1) div {
        display: inline-block;
        width: 50%;
    }
    :host /deep/ .gridtable tbody tr td:nth-child(1) input[type=text] {
        text-align: center;
    }
    :host /deep/ .gridtable tbody tr td input.form-control {
        cursor: pointer;
    }
  `]
})
export class InvoiceGroupAddressAmendmentGridComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('invoiceGrpNo') public invoiceGrpNo;
    @ViewChild('amendmentGrid') amendmentGrid: GridComponent;
    @ViewChild('amendmentPagination') amendmentPagination: PaginationComponent;
    public translateSubscription: Subscription;
    public validateProperties: Array<any> = [];
    public pageId: string = '';
    public pageTitle: string = '';
    public showMessageHeader: boolean = true;
    public queryParams: any = {
        operation: 'Application/iCABSAInvoiceGroupAddressAmendmentGrid',
        module: 'contract-admin',
        method: 'contract-management/maintenance'
    };
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public showHeader: any = true;
    public itemsPerPage: number = 10;
    public search = this.getURLSearchParamObject();
    public currentPage: number = 1;
    public totalItems: number = 10;
    public maxColumn: number = 5;
    public gridSortOrder: string = 'Ascending';
    public gridHeaderClickedColumn: string = '';
    public gridSortHeaders = [
        {
            'fieldName': 'InvoiceGroupNumber',
            'colName': 'InvoiceGroupNumber',
            'index': 0,
            'sortType': 'ASC'
        }
    ];
    public translatedMessageList: any = {
        'Invoice_Address': 'Click to update Invoice Address',
        'Statement_Address': 'Click to update Statement Address'
    };
    public controls = [
        { name: 'AccountNumber', readonly: true, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'AccountName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'AccountAddressLine1', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'AccountAddressLine2', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'AccountAddressLine3', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'AccountAddressLine4', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'AccountAddressLine5', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'AccountPostcode', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'OldAccountName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'OldAccountAddressLine1', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'OldAccountAddressLine2', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'OldAccountAddressLine3', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'OldAccountAddressLine4', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'OldAccountAddressLine5', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'OldAccountPostcode', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'InvoiceGroupNumber', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger }
    ];
    constructor(injector: Injector, public router: Router) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAINVOICEGROUPADDRESSAMENDMENTGRID;
        this.pageTitle = 'Account Address Amendments';
    }
    public ellipsis: any;
    public showCloseButton: boolean = true;
    public ngOnInit(): void {
        super.ngOnInit();
        this.windowOnload();
        this.ellipsis = {
            invoiceGroupSearchEllipsis: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                childparams: {
                    'parentMode': 'LookUp',
                    'AccountNumber': '',
                    'isEllipsis': true
                },
                component: InvoiceGroupSearchComponent
            }
        };
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.fetchTranslationContent();
            }
        });
    }

    public ngAfterViewInit(): void {
        this.utils.setTitle('Account Address Amendments');
    }

    public fetchTranslationContent(): void {
        this.getTranslatedValuesBatch((data: any) => {
            if (data) {
                this.validateProperties = [
                    {
                        'type': MntConst.eTypeInteger,
                        'index': 0,
                        'align': 'center'
                    },
                    {
                        'type': MntConst.eTypeTextFree,
                        'index': 1,
                        'align': 'center'
                    },
                    {
                        'index': 2,
                        'toolTip': data[0],
                        'type': MntConst.eTypeImage,
                        'align': 'center'
                    },
                    {
                        'type': MntConst.eTypeTextFree,
                        'index': 3,
                        'align': 'center'
                    },
                    {
                        'index': 4,
                        'toolTip': data[1],
                        'type': MntConst.eTypeImage,
                        'align': 'center'
                    }
                ];
                this.translatedMessageList.Invoice_Address = data[0];
                this.translatedMessageList.Statement_Address = data[1];

            }
        },
            ['Click to update Invoice Address'], ['Click to update Statement Address']);
    }


    public windowOnload(): void {
        this.attributes.AccountHistoryRowID = this.riExchange.getParentHTMLValue('AccountHistoryRowID');
        this.ShowAccountAddress();
    }

    public ShowAccountAddress(): void {
        let postParamsPopulate: any = {};
        let searchPostpopulate: any = this.getURLSearchParamObject();
        searchPostpopulate.set(this.serviceConstants.Action, '0');
        postParamsPopulate.GridAction = 'GetAccountAddress';
        postParamsPopulate.AccountHistoryRowID = this.attributes.AccountHistoryRowID;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, searchPostpopulate, postParamsPopulate)
            .subscribe(
            (e) => {
                if (e['errorMessage']) {
                    this.messageModal.show({ msg: e['errorMessage'], title: this.pageTitle }, false);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountName', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountAddressLine1', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountAddressLine2', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountAddressLine3', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountAddressLine4', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountAddressLine5', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountPostcode', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OldAccountName', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OldAccountAddressLine1', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OldAccountAddressLine2', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OldAccountAddressLine3', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OldAccountAddressLine4', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OldAccountAddressLine5', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OldAccountPostcode', '');
                } else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', e.AccountNumber);
                    this.ellipsis.invoiceGroupSearchEllipsis.childparams['AccountNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountName', e.AccountName);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountAddressLine1', e.AccountAddressLine1);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountAddressLine2', e.AccountAddressLine2);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountAddressLine3', e.AccountAddressLine3);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountAddressLine4', e.AccountAddressLine4);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountAddressLine5', e.AccountAddressLine5);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountPostcode', e.AccountPostcode);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OldAccountName', e.OldAccountName);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OldAccountAddressLine1', e.OldAccountAddressLine1);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OldAccountAddressLine2', e.OldAccountAddressLine2);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OldAccountAddressLine3', e.OldAccountAddressLine3);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OldAccountAddressLine4', e.OldAccountAddressLine4);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OldAccountAddressLine5', e.OldAccountAddressLine5);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OldAccountPostcode', e.OldAccountPostcode);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
        this.invoiceGrpNo.nativeElement.focus();
        this.BuildGrid();
    }
    public getGridInfo(info: any): void {
        this.amendmentPagination.totalItems = info.totalRows;
    }
    public sortGrid(eventObj: any): void {
        this.gridHeaderClickedColumn = eventObj.fieldname;
        this.gridSortOrder = eventObj.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.BuildGrid();
    }
    public getCurrentPage(currentPage: any): void {
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.BuildGrid();
    }
    public refresh(): void {
        this.maxColumn = 5;
        if (this.riExchange.riInputElement.isError(this.uiForm, 'InvoiceGroupNumber')) {
            return;
        }
        else {
            this.BuildGrid();
        }
    }
    private BuildGrid(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        //set parameters
        this.search.set('AccountHistoryRowID', this.attributes.AccountHistoryRowID);
        this.search.set('InvoiceGroupNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceGroupNumber'));
        this.search.set('GridAction', 'Execute');
        // set grid building parameters
        this.search.set(this.serviceConstants.PageSize, (this.itemsPerPage).toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, this.utils.gridHandle);
        this.search.set(this.serviceConstants.GridSortOrder, this.gridSortOrder);
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.gridHeaderClickedColumn);
        this.queryParams.search = this.search;
        this.amendmentGrid.loadGridData(this.queryParams);
    }
    public InvoiceGroupFocus(data: any): void {
        this.attributes.AccountNumberInvoiceGroupRowID = data.trRowData[0].rowID;
        this.attributes.AccountNumberRow = data.cellData.rowID;
        if (data.cellIndex === 2) {
            let postParamsInvoice: any = {};
            let searchPostInvoice: any = this.getURLSearchParamObject();
            searchPostInvoice.set(this.serviceConstants.Action, '2');
            postParamsInvoice.GridAction = 'AmendInvoice';
            postParamsInvoice.AccountHistoryRowID = this.attributes.AccountHistoryRowID;
            postParamsInvoice.InvoiceGroupRowID = this.attributes.AccountNumberInvoiceGroupRowID;
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
                this.queryParams.operation, searchPostInvoice, postParamsInvoice)
                .subscribe(
                (e) => {
                    if (e['errorMessage']) {
                        //this.messageModal.show({ msg: e['errorMessage'], title: this.pageTitle }, false);
                    } else {
                        this.BuildGrid();
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
            this.invoiceGrpNo.nativeElement.focus();
            this.BuildGrid();
        }
        if (data.cellIndex === 4) {
            let postParamsAmend: any = {};
            let searchPostAmend: any = this.getURLSearchParamObject();
            searchPostAmend.set(this.serviceConstants.Action, '2');
            postParamsAmend.GridAction = 'AmendStatement';
            postParamsAmend.AccountHistoryRowID = this.attributes.AccountHistoryRowID;
            postParamsAmend.InvoiceGroupRowID = this.attributes.AccountNumberInvoiceGroupRowID;
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
                this.queryParams.operation, searchPostAmend, postParamsAmend)
                .subscribe(
                (e) => {
                    if (e['errorMessage']) {
                        //this.messageModal.show({ msg: e['errorMessage'], title: this.pageTitle }, false);
                    } else {
                        this.BuildGrid();
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
            this.invoiceGrpNo.nativeElement.focus();
            this.BuildGrid();
        }
    }
    public onGridRowClick(data: any): void {
        this.InvoiceGroupFocus(data);
        if (data.cellIndex === 0) {
            this.attributes.AccountNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber');
            this.attributes.AccountNumberInvoiceGroupNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceGroupNumber');
            this.navigate('History', '/billtocash/maintenance/invoicegroup/search', {
                'parentMode': 'History',
                'InvoiceGroupRowID': this.attributes.AccountNumberInvoiceGroupRowID,
                'AccountNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber'),
                'AccountName': this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountName'),
                'InvoiceGroupNumber': data.trRowData[0].text
            });

        }
    }
    public onInvoiceGroupDataReceived(data: any): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceGroupNumber', data.InvoiceGroupNumber);
        }
    }
    public invoiceNumberOonChange(data: any): void {
        if (this.uiForm.controls['InvoiceGroupNumber'].valid) {
            this.uiForm.controls['InvoiceGroupNumber'].setErrors(null);
        }
        else {
            this.uiForm.controls['InvoiceGroupNumber'].setErrors({});
        }

    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.translateSubscription) {
            this.translateSubscription.unsubscribe();
        }
    }
}
