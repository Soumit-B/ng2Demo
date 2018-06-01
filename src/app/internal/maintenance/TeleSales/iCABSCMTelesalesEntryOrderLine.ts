import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';

export class TelesalesEntryOrderLine {

    private context: any;

    constructor(private parent: any) {
        this.context = parent;
    }

    public riGridOrderLineBeforeExecute(): void {
        this.context.search = this.context.getURLSearchParamObject();
        this.context.search.set(this.context.serviceConstants.Action, '2');
        //set parameters
        this.context.search.set('TelesalesOrderNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderNumber', MntConst.eTypeInteger));
        this.context.search.set('BulkDiscountPerc', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BulkDiscountPerc'));
        this.context.search.set('CacheTime', this.context.pageParams.OrderLineCacheTime);
        if (this.context.getAttribute('SelectedOrderLineRowID')) {
            this.context.search.set('RowID', this.context.getAttribute('SelectedOrderLineRowID'));
        }
        this.context.search.set('HeaderClickedColumn', this.context.riGridOrderLine.HeaderClickedColumn);
        let sortOrder = 'Descending';
        if (!this.context.riGridOrderLine.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.context.search.set('riSortOrder', sortOrder);
        // set grid building parameters
        this.context.search.set(this.context.serviceConstants.PageSize, (this.context.gridConfig.riGridOrderLine.itemsPerPage).toString());
        this.context.search.set(this.context.serviceConstants.PageCurrent, this.context.gridConfig.riGridOrderLine.currentPage.toString());
        this.context.search.set(this.context.serviceConstants.GridMode, '0');
        this.context.search.set(this.context.serviceConstants.GridHandle, '2294694');
        this.context.queryParams.search = this.context.search;
        this.context.httpService.makeGetRequest(this.context.queryParams.method, this.context.queryParams.module, this.context.queryParams.operation, this.context.search)
            .subscribe(
            (data) => {
                if (data) {
                    this.context.gridConfig.riGridOrderLine.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.context.gridConfig.riGridOrderLine.totalItems = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    this.context.setAttribute('SelectedOrderLineRowID', '');
                    //this.riGrid.Update = true;
                    this.context.riGridOrderLine.UpdateBody = true;
                    this.context.riGridOrderLine.UpdateFooter = true;
                    this.context.riGridOrderLine.UpdateHeader = true;
                    if (data && data.errorMessage) {
                        this.context.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.context.riGridOrderLine.Execute(data);
                    }
                }
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
            },
            error => {
                this.context.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
                this.context.gridConfig.riGridOrderLine.totalItems = 1;
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
            });
        if (this.context.riGridOrderLine.Update) {
            this.context.riGridOrderLine.StartRow = this.context.getAttribute('SelectedOrderLineRow');
            this.context.riGridOrderLine.StartColumn = 0;
            this.context.riGridOrderLine.RowID = this.context.getAttribute('SelectedOrderLineRowID');
            this.context.riGridOrderLine.UpdateHeader = false;
            this.context.riGridOrderLine.UpdateBody = true;
            this.context.riGridOrderLine.UpdateFooter = false;
        }
    }

    public riGridOrderLineAfterExecute(): void {
        this.context.pageParams.lRefreshOrderLineGrid = false;
    }

    public riGridOrderLineBodyOnClick(event: any): void {
        this.selectedRowFocusOrderLine(event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
    }

    public selectedRowFocusOrderLine(rsrcElement: any): void {
        rsrcElement.select();
        this.context.setAttribute('SelectedProductRow', rsrcElement.parentElement.parentElement.parentElement.sectionRowIndex);
        this.context.setAttribute('SelectedProductCell', rsrcElement.parentElement.parentElement.cellIndex);
        this.context.setAttribute('SelectedProductRowID', rsrcElement.getAttribute('RowID'));
        this.context.setControlValue('SelectedOrderLine', this.context.riGridOrderLine.Details.GetAttribute('OrdLineProductCode', 'AdditionalProperty'));
        rsrcElement.focus();
    }

    public riGridOrderLineBodyOnDblClick(event: any): void {
        if (this.context.riGridOrderLine.CurrentColumnName === 'OrdLineProductDesc' && this.context.riGridOrderLine.Details.GetAttribute('OrdLineProductCode', 'AdditionalProperty')) {
            this.selectedRowFocusOrderLine(event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
            this.context.setControlValue('TelesalesOrderLineNumber', this.context.getControlValue('SelectedOrderLine'));
            // window.location = '/wsscripts/riHTMLWrapper.p?riFileName=ContactManagement/iCABSCMTelesalesEntryOrderLineMaintenance.htm<bottom>';
            // this.riExchange.ProcessDoEvents() // RTB0096;
            // Do While this.riExchange.Busy;
            // this.riExchange.ProcessDoEvents();
            // Loop;
            //    fetchSaveTelesalesOrder('FetchTelesalesOrder');
            alert('Navigate to iCABSCMTelesalesEntryOrderLineMaintenance when available');
            this.context.pageParams.lRefreshOrderHistoryGrid = true;
            this.context.pageParams.lRefreshOrderLineGrid = true;
            this.context.riGridOrderLine.Execute();
        }
    }
}
