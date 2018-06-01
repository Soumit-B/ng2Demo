import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { TelesalesEntryComponent } from './iCABSCMTelesalesEntry.component';

export class TelesalesEntryProduct {

    private context: TelesalesEntryComponent;

    constructor(private parent: TelesalesEntryComponent) {
        this.context = parent;
    }

    public cmdClearProductOnClick(): void {
        this.context.pageParams.ProductCacheTime = this.context.utils.Time();
        this.context.iCABSCMTelesalesEntryProduct.riGridProductBeforeExecute();
    }

    public cmdCreateProductOnClick(): void {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesOrderNumber', '0');
        this.createTelesalesOrderFromProduct();
    }

    public cmdCreateProductCurrentOnClick(): void {
        this.createTelesalesOrderFromProduct();
    }

    public createTelesalesOrderFromProduct(): void {
        this.context.ajaxSource.next(this.context.ajaxconstant.START);
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ClosedWithChanges', 'Y');
        if (this.context.pageParams.lOrderHeaderChanged) {
            this.context.pageParams.lOrderHeaderChanged = false;
            // richy update the order header information
        }

        this.context.search = this.context.getURLSearchParamObject();
        this.context.search.set(this.context.serviceConstants.Action, '6');
        let formData = {
            'Function': 'createTelesalesOrderFromProduct',
            'TelesalesOrderNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderNumber', MntConst.eTypeInteger),
            'AccountNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AccountNumber'),
            'ContractNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'),
            'PremiseNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber', MntConst.eTypeInteger),
            'ProspectNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProspectNumber', MntConst.eTypeInteger),
            'ProductDesc': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductDescriptionContains'),
            'ProductCode': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCodeBegins'),
            'CacheTime': this.context.pageParams.ProductCacheTime,
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
                    this.context.pageParams.lRefreshProductGrid = true;

                    if (data.TelesalesOrderNumber) {
                        this.context.iCABSCMTelesalesEntry1.fetchSaveTelesalesOrder('FetchTelesalesOrder', function (): void {
                            this.context.iCABSCMTelesalesEntry2.riTabTabFocusAfter();
                        });
                    }
                }
            },
            (error) => {
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
                this.context.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
            }
            );
    }

    public riGridProductBeforeExecute(): void {
        this.context.search = this.context.getURLSearchParamObject();
        this.context.search.set(this.context.serviceConstants.Action, '2');
        //set parameters
        let formData = {
            'TelesalesOrderNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderNumber', MntConst.eTypeInteger),
            'ProductCode': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCodeBegins'),
            'ProductDesc': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductDescriptionContains'),
            'CacheTime': this.context.pageParams.ProductCacheTime,
            'PageSize': this.context.gridConfig.riGridProduct.itemsPerPage.toString(),
            'PageCurrent': this.context.gridConfig.riGridProduct.currentPage.toString(),
            'riGridMode': '0',
            'riGridHandle': '6161770'
        };
        if (this.context.getAttribute('SelectedProductRowID')) {
            formData['RowID'] = this.context.getAttribute('SelectedProductRowID');
        }
        formData['HeaderClickedColumn'] = this.context.riGridProduct.HeaderClickedColumn;
        let sortOrder = 'Descending';
        if (!this.context.riGridProduct.DescendingSort) {
            sortOrder = 'Ascending';
        }
        formData['riSortOrder'] = sortOrder;

        this.context.httpService.makePostRequest(this.context.queryParams.method, this.context.queryParams.module,
            this.context.queryParams.operation, this.context.search, formData)
            .subscribe(
            (data) => {
                if (data) {
                    this.context.gridConfig.riGridProduct.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.context.gridConfig.riGridProduct.totalItems = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    this.context.setAttribute('SelectedProductRowID', '');
                    //this.riGrid.Update = true;
                    this.context.riGridProduct.UpdateBody = true;
                    this.context.riGridProduct.UpdateFooter = true;
                    this.context.riGridProduct.UpdateHeader = true;
                    if (data && data.errorMessage) {
                        this.context.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.context.riGridProduct.Execute(data);
                    }
                }
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
            },
            error => {
                this.context.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
                this.context.gridConfig.riGridProduct.totalItems = 1;
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
            });

        if (this.context.riGridProduct.Update) {
            this.context.riGridProduct.StartRow = this.context.getAttribute('SelectedProductRow');
            this.context.riGridProduct.StartColumn = 0;
            this.context.riGridProduct.RowID = this.context.getAttribute('SelectedProductRowID');
            this.context.riGridProduct.UpdateHeader = false;
            this.context.riGridProduct.UpdateBody = true;
            this.context.riGridProduct.UpdateFooter = false;
        }
    }

    public riGridProductAfterExecute(): void {
        this.context.pageParams.lRefreshProductGrid = false;
        this.context.setControlValue('SelectedProductValue', this.context.riGridProduct.Details.GetAttribute('ProProductUnitPrice', 'AdditionalProperty'));
    }

    public riGridProductBodyOnClick(event: any): void {
        this.selectedRowFocusProduct(event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
    }

    public selectedRowFocusProduct(rsrcElement: any): void {
        rsrcElement.select();
        this.context.setAttribute('SelectedProductRow', rsrcElement.parentElement.parentElement.parentElement.sectionRowIndex);
        this.context.setAttribute('SelectedProductCell', rsrcElement.parentElement.parentElement.cellIndex);
        this.context.setAttribute('SelectedProductRowID', rsrcElement.getAttribute('RowID'));
        this.context.setControlValue('SelectedProduct', this.context.riGridProduct.Details.GetAttribute('OrdHistOrderNumber', 'AdditionalProperty'));
        rsrcElement.focus();
    }

    public riGridProductBodyOnDblClick(): void {
        if (this.context.riGridProduct.CurrentColumnName === 'ProProductDescription' ||
            this.context.riGridProduct.CurrentColumnName === 'ProProductCode' ||
            this.context.riGridProduct.CurrentColumnName === 'ProProductUnitPrice' ||
            this.context.riGridProduct.CurrentColumnName === 'ProProductQuantity' ||
            this.context.riGridProduct.CurrentColumnName === 'ProProductExtPrice' ||
            this.context.riGridProduct.CurrentColumnName === 'ProSelected') {
            this.selectedRowFocusProduct(event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
            this.context.riGridProduct.Update = true;
            this.context.iCABSCMTelesalesEntryProduct.riGridProductBeforeExecute();
        }
    }

    public productDescriptionContainsOnKeyDown(obj: any): void {
        //if( user presses return ) { run the search;
        if (obj.keyCode === 13) {
            this.context.iCABSCMTelesalesEntryProduct.riGridProductBeforeExecute();
        }
    }

    public productCodeBeginsOnKeyDown(obj: any): void {
        //if( user presses return ) { run the search;
        if (obj.keyCode === 13) {
            this.context.iCABSCMTelesalesEntryProduct.riGridProductBeforeExecute();
        }
    }
}
