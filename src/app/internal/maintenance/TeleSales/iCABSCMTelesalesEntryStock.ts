import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';

export class TelesalesEntryStock {

    private context: any;

    constructor(private parent: any) {
        this.context = parent;
    }

    public riGridStockAfterExecute(): void {
        this.context.pageParams.lRefreshStockGrid = false;
    }

    public riGridStockBeforeExecute(): void {
        this.context.search = this.context.getURLSearchParamObject();
        this.context.search.set(this.context.serviceConstants.Action, '2');
        //set parameters
        this.context.search.set('TelesalesOrderNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderNumber', MntConst.eTypeInteger));
        // set grid building parameters
        this.context.search.set(this.context.serviceConstants.PageSize, (this.context.gridConfig.riGridStock.itemsPerPage).toString());
        this.context.search.set(this.context.serviceConstants.PageCurrent, this.context.gridConfig.riGridStock.currentPage.toString());
        this.context.search.set(this.context.serviceConstants.GridMode, '0');
        this.context.search.set(this.context.serviceConstants.GridHandle, '10879794');
        this.context.search.set('HeaderClickedColumn', this.context.riGridStock.HeaderClickedColumn);
        let sortOrder = 'Descending';
        if (!this.context.riGridStock.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.context.search.set('riSortOrder', sortOrder);
        this.context.queryParams.search = this.context.search;
        this.context.httpService.makeGetRequest(this.context.queryParams.method, this.context.queryParams.module, this.context.queryParams.operation, this.context.search)
            .subscribe(
            (data) => {
                if (data) {
                    this.context.gridConfig.riGridStock.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.context.gridConfig.riGridStock.totalItems = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    //this.riGrid.Update = true;
                    this.context.riGridStock.UpdateBody = true;
                    this.context.riGridStock.UpdateFooter = true;
                    this.context.riGridStock.UpdateHeader = true;
                    if (data && data.errorMessage) {
                        this.context.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.context.riGridStock.Execute(data);
                    }
                }
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
            },
            error => {
                this.context.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
                this.context.gridConfig.riGridStock.totalItems = 1;
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
            });
    }

    public riGridStockBodyOnClick(event: any): void {
        this.selectedRowFocusStock(event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
    }

    public selectedRowFocusStock(rsrcElement: any): void {
        rsrcElement.select();
        this.context.setAttribute('SelectedStockRow', rsrcElement.parentElement.parentElement.parentElement.sectionRowIndex);
        this.context.setAttribute('SelectedStockCell', rsrcElement.parentElement.parentElement.cellIndex);
        this.context.setAttribute('SelectedStockRowID', rsrcElement.getAttribute('RowID'));
        this.context.setControlValue('SelectedStock', this.context.riGridOrderLine.Details.GetAttribute('StockRequestNumber', 'Value'));
        rsrcElement.focus();
    }

    //public riGridStockBodyOnDblClick(event: any): void {
    // if( window.event.srcElement.Name = 'StockRequestNumber'  ) {
    // this.setControlValue('//    TelesalesOrderLineNumber', this.getControlValue('SelectedOrderLine'));
    // this.setControlValue('//    ClosedWithChanges', 'Y';
    //    this.riExchange.Mode = 'TelesalesEntry';
    //    window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAStockRequestGrid.htm';
    //;
    //    this.riExchange.ProcessDoEvents() // RTB0096;
    //    Do While this.riExchange.Busy;
    //      this.riExchange.ProcessDoEvents();
    //    Loop;
    //;
    //    lRefreshOrderHistoryGrid = true;
    //    lRefreshOrderLineGrid = true;
    //    lRefreshStockGrid = true;
    //    riTabTabFocusAfter;
    //  }
    //}
}
