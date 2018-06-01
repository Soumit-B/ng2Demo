import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { TelesalesEntryComponent } from './iCABSCMTelesalesEntry.component';

export class TelesalesEntryOrderHistory {

    private context: TelesalesEntryComponent;

    constructor(private parent: TelesalesEntryComponent) {
        this.context = parent;
    }

    public riGridOrderHistoryBeforeExecute(): void {
        this.context.search = this.context.getURLSearchParamObject();
        this.context.search.set(this.context.serviceConstants.Action, '2');
        //set parameters
        this.context.search.set('AccountNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AccountNumber'));
        this.context.search.set('ContractNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'));
        this.context.search.set('PremiseNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber', MntConst.eTypeInteger));
        this.context.search.set('ProspectNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProspectNumber', MntConst.eTypeInteger));
        this.context.search.set('FixedTelesalesOrderNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FixedTelesalesOrderNumber', MntConst.eTypeInteger));
        this.context.search.set('DateFilter', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'DateFilter'));
        this.context.search.set('OrderFromDate', this.context.globalize.parseDateToFixedFormat(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OrderFromDate')).toString());
        this.context.search.set('OrderToDate', this.context.globalize.parseDateToFixedFormat(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OrderToDate')).toString());
        this.context.search.set('LevelFilter', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LevelFilter'));
        this.context.search.set('TelesalesOrderStatusCodeFilter', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderStatusCodeFilter'));
        this.context.search.set('CacheTime', this.context.pageParams.OrderHistoryCacheTime);
        if (this.context.getAttribute('SelectedOrderHistoryRowID')) {
            this.context.search.set('RowID', this.context.getAttribute('SelectedOrderHistoryRowID'));
        }
        this.context.search.set('HeaderClickedColumn', this.context.riGridOrderHistory.HeaderClickedColumn);
        let sortOrder = 'Descending';
        if (!this.context.riGridOrderHistory.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.context.search.set('riSortOrder', sortOrder);
        // set grid building parameters
        this.context.search.set(this.context.serviceConstants.PageSize, '10');
        this.context.search.set(this.context.serviceConstants.PageCurrent, this.context.gridConfig.riGridOrderHistory.currentPage.toString());
        this.context.search.set(this.context.serviceConstants.GridMode, '0');
        this.context.search.set(this.context.serviceConstants.GridHandle, '6227514');
        this.context.queryParams.search = this.context.search;
        this.context.ajaxSource.next(this.context.ajaxconstant.START);
        this.context.httpService.makeGetRequest(this.context.queryParams.method, this.context.queryParams.module, this.context.queryParams.operation, this.context.search)
            .subscribe(
            (data) => {
                if (data) {
                    this.context.gridConfig.riGridOrderHistory.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.context.gridConfig.riGridOrderHistory.totalItems = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    this.context.setAttribute('SelectedOrderHistoryRowID', '');
                    //this.riGrid.Update = true;
                    this.context.riGridOrderHistory.UpdateBody = true;
                    this.context.riGridOrderHistory.UpdateFooter = true;
                    this.context.riGridOrderHistory.UpdateHeader = true;
                    if (data && data.errorMessage) {
                        this.context.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.context.riGridOrderHistory.Execute(data);
                    }
                }
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
            },
            error => {
                this.context.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
                this.context.gridConfig.riGridOrderHistory.totalItems = 1;
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
            });

        if (this.context.riGridOrderHistory.Update) {
            this.context.riGridOrderHistory.StartRow = this.context.getAttribute('SelectedOrderHistoryRow');
            this.context.riGridOrderHistory.StartColumn = 0;
            this.context.riGridOrderHistory.RowID = this.context.getAttribute('SelectedOrderHistoryRowID');
            this.context.riGridOrderHistory.UpdateHeader = false;
            this.context.riGridOrderHistory.UpdateBody = true;
            this.context.riGridOrderHistory.UpdateFooter = false;
        }
    }
    public riGridOrderHistoryAfterExecute(): void {
        this.context.pageParams.lRefreshOrderHistoryGrid = false;
        if (this.context.pageParams.lFetchOrderRequired) {
            this.context.iCABSCMTelesalesEntry1.fetchSaveTelesalesOrder('FetchTelesalesOrder', function (): void {
                this.context.pageParams.lFetchOrderRequired = false;
            });
        }
    }

    public createTelesalesOrderFromOrderer(): void {
        this.context.ajaxSource.next(this.context.ajaxconstant.START);
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ClosedWithChanges', 'Y');
        if (this.context.pageParams.lOrderHeaderChanged) {
            this.context.pageParams.lOrderHeaderChanged = false;
            // richy update the order header information
        }

        this.context.search = this.context.getURLSearchParamObject();
        this.context.search.set(this.context.serviceConstants.Action, '6');
        let formData = {
            'Function': 'CreateTelesalesOrderFromOrder',
            'TelesalesOrderNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderNumber', MntConst.eTypeInteger),
            'AccountNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AccountNumber'),
            'ContractNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'),
            'PremiseNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber', MntConst.eTypeInteger),
            'ProspectNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProspectNumber', MntConst.eTypeInteger),
            'DateFilter': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'DateFilter'),
            'OrderFromDate': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OrderFromDate', MntConst.eTypeDate),
            'OrderToDate': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OrderToDate', MntConst.eTypeDate),
            'LevelFilter': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LevelFilter'),
            'TelesalesOrderStatusCodeFilter': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderStatusCodeFilter'),
            'CacheTime': this.context.pageParams.OrderHistoryCacheTime,
            'CurrentCallLogID': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CurrentCallLogID', MntConst.eTypeInteger)
        };
        formData = this.context.utils.cleanForm(formData);
        this.context.httpService.makePostRequest(this.context.queryParams.method, this.context.queryParams.module,
            this.context.queryParams.operation, this.context.search, formData)
            .subscribe(
            (data) => {
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.context.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.context.pageParams.ProductCacheTime = this.context.utils.Time();
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesOrderNumber', data.TelesalesOrderNumber);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesOrderStatusCode', data.TelesalesOrderStatusCode);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesOrderStatusDesc', data.TelesalesOrderStatusDesc);

                    this.context.pageParams.lRefreshOrderHistoryGrid = true;
                    this.context.pageParams.lRefreshOrderlineGrid = true;
                    this.context.pageParams.lRefreshStockGrid = true;
                    this.context.pageParams.OrderHistoryCacheTime = this.context.utils.Time();

                    this.context.iCABSCMTelesalesEntry1.fetchSaveTelesalesOrder('FetchTelesalesOrder', function (): void {
                        this.context.iCABSCMTelesalesEntry2.riTabTabFocusAfter();
                    });
                }
            },
            (error) => {
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
                this.context.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
            }
            );
    }

    public cmdClearOrderHistoryOnClick(): void {
        this.context.pageParams.OrderHistoryCacheTime = this.context.utils.Time();
        this.context.riGridOrderHistory.Update = false;
        this.riGridOrderHistoryBeforeExecute();
    }

    public cmdCreateOrderHistoryOnClick(): void {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesOrderNumber', '0');
        this.createTelesalesOrderFromOrderer();
    }

    public cmdCreateOrderHistoryCurrentOnClick(): void {
        this.createTelesalesOrderFromOrderer();
    }

    public levelFilterOnChange(): void {
        this.context.riGridOrderHistory.Update = false;
        this.riGridOrderHistoryBeforeExecute();
    }

    public riGridOrderHistoryBodyOnClick(event: any): void {
        this.selectedRowFocusOrderHistory(event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
    }

    public selectedRowFocusOrderHistory(rsrcElement: any): void {
        rsrcElement.select();
        this.context.setAttribute('SelectedOrderHistoryRow', rsrcElement.parentElement.parentElement.parentElement.sectionRowIndex);
        this.context.setAttribute('SelectedOrderHistoryCell', rsrcElement.parentElement.parentElement.cellIndex);
        this.context.setAttribute('SelectedOrderHistoryRowID', rsrcElement.getAttribute('RowID'));
        this.context.setControlValue('SelectedOrderHistory', this.context.riGridOrderHistory.Details.GetAttribute('OrdHistOrderNumber', 'AdditionalProperty'));
        rsrcElement.focus();
    }

    public riGridOrderHistoryBodyOnDblClick(event: any): void {
        if (this.context.riGridOrderHistory.CurrentColumnName === 'OrdHistSelected') {
            this.selectedRowFocusOrderHistory(event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
            this.context.riGridOrderHistory.Update = true;
            this.riGridOrderHistoryBeforeExecute();
        } else if (this.context.riGridOrderHistory.CurrentColumnName === 'OrdHistOrderNumber') {
            this.selectedRowFocusOrderHistory(event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
            this.context.pageParams.lRefreshOrderLineGrid = true;
            this.context.pageParams.lRefreshProductGrid = true;
            this.context.pageParams.ProductCacheTime = this.context.utils.Time();
            this.context.pageParams.lDoubleClick = true;
            this.context.pageParams.lFetchOrderRequired = true;
            this.context.setControlValue('TelesalesOrderNumber', this.context.getControlValue('SelectedOrderHistory'));
            // Cannot Fetch The Order Here - It Doesn//t Allow The //Tick// To be Selected!!!;
            // Instead lFetchOrderRequired = true so when we go to a tab we can read it in there;
            //fetchSaveTelesalesOrder ('FetchTelesalesOrder');
            this.context.pageParams.lDoubleClick = false;
            this.context.riGridOrderHistory.Update = true;
            this.riGridOrderHistoryBeforeExecute();
        }
    }
}
