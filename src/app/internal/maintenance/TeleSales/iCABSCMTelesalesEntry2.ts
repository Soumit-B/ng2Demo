import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { TelesalesEntryComponent } from './iCABSCMTelesalesEntry.component';

export class TelesalesEntry2 {

    private context: TelesalesEntryComponent;

    constructor(private parent: TelesalesEntryComponent) {
        this.context = parent;
    }

    public validateOrder(fncallback?: any): void {
        this.context.pageParams.lValidateOK = true;
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesName') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesAddressLine1') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesAddressLine2') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesAddressLine3') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesAddressLine4') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesAddressLine5') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesPostcode') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesContactName') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesContactPosition') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesContactTelephone') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesContactEmail') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesDeliveryDate') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesPurchaseOrderNo') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'CommissionEmployeeCode') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvName') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvAddressLine1') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvAddressLine2') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvAddressLine3') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvAddressLine4') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvAddressLine5') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvPostcode') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvContactName') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvContactPosition') ||
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvContactTelephone')) {
            this.context.pageParams.lValidateOK = false;
        }

        if (this.context.pageParams.lValidateOk) {
            if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CustomerTypeCodeSelect')) {
                this.context.pageParams.lValidateOk = false;
            }

            if (this.context.pageParams.lValidateOk) {
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CustomerTypeCodeSelect') === '') {
                    this.context.pageParams.lValidateOk = false;
                }
            }

            if (!this.context.pageParams.lValidateOk) {
                this.context.utils.highlightTabs();
                this.context.modalAdvService.emitError(new ICabsModalVO(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ErrorMessageCustomerType')));
            }
        }
        if (!this.context.pageParams.lValidateOk) {
            this.context.utils.highlightTabs();
        }
        if (fncallback && typeof fncallback === 'function') {
            fncallback.call(this.context.iCABSCMTelesalesEntry1);
        }
    }

    public riTabTabFocusAfter(): void {
        if (this.context.uiDisplay.tab.tab2.active && this.context.pageParams.lRefreshProductGrid) {
            this.context.iCABSCMTelesalesEntryProduct.riGridProductBeforeExecute();
            this.context.pageParams.lRefreshProductGrid = false;
        }
        if (this.context.uiDisplay.tab.tab1.active && this.context.pageParams.lRefreshOrderHistoryGrid) {
            this.context.iCABSCMTelesalesEntryOrderHistory.riGridOrderHistoryBeforeExecute();
            this.context.pageParams.lRefreshOrderHistoryGrid = false;
        }
        if (this.context.uiDisplay.tab.tab5.active && this.context.pageParams.lRefreshOrderLineGrid) {
            this.context.iCABSCMTelesalesEntryOrderLine.riGridOrderLineBeforeExecute();
            this.context.pageParams.lRefreshOrderLineGrid = false;
        }
        if (this.context.uiDisplay.tab.tab8.active) {
            this.context.iCABSCMTelesalesEntryStock.riGridStockBeforeExecute();
            this.context.pageParams.lRefreshStockGrid = false;
        }
    }

    public setupGrids(): void {
        this.context.riGridProduct.DefaultBorderColor = 'ADD8E6';
        this.context.riGridProduct.DefaultTextColor = '0000FF';
        this.context.riGridProduct.PageSize = 10;
        this.context.riGridProduct.FunctionPaging = true;
        this.context.riGridProduct.HighlightBar = true;

        this.context.riGridOrderHistory.DefaultBorderColor = 'ADD8E6';
        this.context.riGridOrderHistory.DefaultTextColor = '0000FF';
        this.context.riGridOrderHistory.FunctionPaging = true;
        this.context.riGridOrderHistory.PageSize = 10;

        this.context.riGridOrderLine.DefaultBorderColor = 'ADD8E6';
        this.context.riGridOrderLine.DefaultTextColor = '0000FF';
        this.context.riGridOrderLine.PageSize = 10;
        this.context.riGridOrderLine.FunctionPaging = true;
        this.context.riGridOrderLine.HighlightBar = true;

        this.context.riGridStock.DefaultBorderColor = 'ADD8E6';
        this.context.riGridStock.DefaultTextColor = '0000FF';
        this.context.riGridStock.PageSize = 10;
        this.context.riGridStock.FunctionPaging = true;
        this.context.riGridStock.HighlightBar = true;
    }

    public buildGrids(): void {
        this.buildProductGrid();
        this.buildOrderHistoryGrid();
        this.buildOrderLineGrid();
        this.buildStockGrid();
    }

    public buildProductGrid(): void {
        this.context.riGridProduct.Clear();
        this.context.riGridProduct.AddColumn('ProProductDescription', 'Pro', 'ProProductDescription', MntConst.eTypeTextFree, 40, false);
        this.context.riGridProduct.AddColumn('ProProductCode', 'Pro', 'ProProductCode', MntConst.eTypeCode, 10, false);
        this.context.riGridProduct.AddColumnAlign('ProProductCode', MntConst.eAlignmentCenter);
        this.context.riGridProduct.AddColumn('ProProductUnitPrice', 'Pro', 'ProProductUnitPrice', MntConst.eTypeCurrency, 15, false);
        this.context.riGridProduct.AddColumn('ProProductQuantity', 'Pro', 'ProProductQuantity', MntConst.eTypeInteger, 5, false);
        this.context.riGridProduct.AddColumn('ProProductExtPrice', 'Pro', 'ProProductExtPrice', MntConst.eTypeCurrency, 15, false);
        this.context.riGridProduct.AddColumn('ProSelected', 'Pro', 'ProSelected', MntConst.eTypeImage, 1);
        this.context.riGridProduct.AddColumnAlign('ProProductQuantity', MntConst.eAlignmentCenter);
        this.context.riGridProduct.AddColumnOrderable('ProProductDescription', true, true);
        this.context.riGridProduct.AddColumnOrderable('ProProductUnitPrice', true, true);
        this.context.riGridProduct.AddColumnOrderable('ProProductCode', true, true);
        this.context.riGridProduct.AddColumnOrderable('ProProductQuantity', true, true);
        this.context.riGridProduct.AddColumnOrderable('ProProductExtPrice', true, true);
        //  this.context.riGridProduct.AddColumnOrderable('ProSelected',true,true);
        this.context.riGridProduct.Complete();
    }

    public buildOrderHistoryGrid(): void {
        this.context.riGridOrderHistory.Clear();
        this.context.riGridOrderHistory.AddColumn('OrdHistOrderNumber', 'OrdHist', 'OrdHistOrderNumber', MntConst.eTypeInteger, 8, false);
        this.context.riGridOrderHistory.AddColumn('OrdHistOrderStatus', 'OrdHist', 'OrdHistOrderStatus', MntConst.eTypeTextFree, 20, false);
        this.context.riGridOrderHistory.AddColumn('OrdHistCreateDate', 'OrdHist', 'OrdHistCreateDate', MntConst.eTypeDate, 10, false);
        this.context.riGridOrderHistory.AddColumn('OrdHistDeliveryDate', 'OrdHist', 'OrdHistDeliveryDate', MntConst.eTypeDate, 10, false);
        this.context.riGridOrderHistory.AddColumn('OrdHistNumLines', 'OrdHist', 'OrdHistNumLines', MntConst.eTypeInteger, 5, false);
        this.context.riGridOrderHistory.AddColumn('OrdHistCommissionEmployee', 'OrdHist', 'OrdHistCommissionEmployee', MntConst.eTypeTextFree, 10, false);
        this.context.riGridOrderHistory.AddColumn('OrdHistOrderValue', 'OrdHist', 'OrdHistOrderValue', MntConst.eTypeCurrency, 14, false);
        if (this.context.pageParams.lShowTaxDetails) {
            this.context.riGridOrderHistory.AddColumn('OrdHistOrderValueInclTax', 'OrdLine', 'OrdHistOrderValueInclTax', MntConst.eTypeCurrency, 14, false);
        }
        this.context.riGridOrderHistory.AddColumn('OrdHistOrderTrans', 'OrdHist', 'OrdHistOrderTrans', MntConst.eTypeTextFree, 20, false);
        this.context.riGridOrderHistory.AddColumn('OrdHistSelected', 'OrdHist', 'OrdHistSelected', MntConst.eTypeImage, 1);
        this.context.riGridOrderHistory.AddColumnAlign('OrdHistOrderNumber', MntConst.eAlignmentCenter);
        this.context.riGridOrderHistory.AddColumnAlign('OrdHistOrderStatus', MntConst.eAlignmentCenter);
        this.context.riGridOrderHistory.AddColumnAlign('OrdHistCreateDate', MntConst.eAlignmentCenter);
        this.context.riGridOrderHistory.AddColumnAlign('OrdHistDeliveryDate', MntConst.eAlignmentCenter);
        this.context.riGridOrderHistory.AddColumnAlign('OrdHistNumLines', MntConst.eAlignmentCenter);
        this.context.riGridOrderHistory.AddColumnAlign('OrdHistCommissionEmployee', MntConst.eAlignmentCenter);
        this.context.riGridOrderHistory.AddColumnAlign('OrdHistOrderTrans', MntConst.eAlignmentCenter);
        this.context.riGridOrderHistory.AddColumnOrderable('OrdHistOrderNumber', true, true);
        this.context.riGridOrderHistory.AddColumnOrderable('OrdHistCreateDate', true, true);
        this.context.riGridOrderHistory.AddColumnOrderable('OrdHistDeliveryDate', true, true);
        //  this.context.riGridOrderHistory.AddColumnOrderable('OrdHistOrderTrans',true,true);
        //  this.context.riGridOrderHistory.AddColumnOrderable('OrdHistSelected',true,true);
        this.context.riGridOrderHistory.Complete();
    }

    public buildOrderLineGrid(): void {
        this.context.riGridOrderLine.Clear();
        this.context.riGridOrderLine.AddColumn('OrdLineProductDesc', 'OrdLine', 'OrdLineProductDesc', MntConst.eTypeTextFree, 40, false);
        this.context.riGridOrderLine.AddColumn('OrdLineProductCode', 'OrdLine', 'OrdLineProductCode', MntConst.eTypeTextFree, 6, false);
        this.context.riGridOrderLine.AddColumn('OrdLineQuantity', 'OrdLine', 'OrdLineQuantity', MntConst.eTypeInteger, 5, false);
        this.context.riGridOrderLine.AddColumn('OrdLineExtListPrice', 'OrdLine', 'OrdLineExtListPrice', MntConst.eTypeCurrency, 14, false);
        if (this.context.pageParams.lShowTaxDetails) {
            this.context.riGridOrderLine.AddColumn('OrdLineExtListPriceTax', 'OrdLine', 'OrdLineExtListPriceTax', MntConst.eTypeCurrency, 14, false);
        }
        this.context.riGridOrderLine.AddColumn('OrdLineDiscountPerc', 'OrdLine', 'OrdLineDiscountPerc', MntConst.eTypeDecimal2, 14, false);
        this.context.riGridOrderLine.AddColumn('OrdLineDiscountAmount', 'OrdLine', 'OrdLineDiscountAmount', MntConst.eTypeCurrency, 14, false);
        this.context.riGridOrderLine.AddColumn('OrdLineAgreedValue', 'OrdLine', 'OrdLineAgreedValue', MntConst.eTypeCurrency, 14, false);
        if (this.context.pageParams.lShowTaxDetails) {
            this.context.riGridOrderLine.AddColumn('OrdLineAgreedValueTax', 'OrdLine', 'OrdLineAgreedValueTax', MntConst.eTypeCurrency, 14, false);
        }
        this.context.riGridOrderLine.AddColumn('OrdLineDelivered', 'OrdLine', 'OrdLineDelivered', MntConst.eTypeImage, 1);
        this.context.riGridOrderLine.AddColumn('OrdLineCancelledCust', 'OrdLine', 'OrdLineCancelledCust', MntConst.eTypeImage, 1);
        this.context.riGridOrderLine.AddColumn('OrdLineCancelledSupp', 'OrdLine', 'OrdLineCancelledSupp', MntConst.eTypeImage, 1);
        this.context.riGridOrderLine.AddColumnAlign('OrdLineProductCode', MntConst.eAlignmentCenter);
        this.context.riGridOrderLine.AddColumnAlign('OrdLineQuantity', MntConst.eAlignmentCenter);
        this.context.riGridOrderLine.AddColumnOrderable('OrdLineProductDesc', true, true);
        this.context.riGridOrderLine.AddColumnOrderable('OrdLineProductCode', true, true);
        this.context.riGridOrderLine.Complete();
    }

    public buildStockGrid(): void {
        this.context.riGridStock.Clear();
        this.context.riGridStock.AddColumn('StockRequestNumber', 'Stock', 'StockRequestNumber', MntConst.eTypeTextFree, 20, false);
        this.context.riGridStock.AddColumnAlign('StockRequestNumber', MntConst.eAlignmentCenter);
        this.context.riGridStock.AddColumn('StockSent', 'Stock', 'StockSent', MntConst.eTypeDate, 10);
        this.context.riGridStock.AddColumn('StockSupplierName', 'Stock', 'StockSupplierName', MntConst.eTypeTextFree, 40, false);
        this.context.riGridStock.AddColumn('StockContact', 'Stock', 'StockContact', MntConst.eTypeTextFree, 40, false);
        this.context.riGridStock.AddColumn('StockTelephone', 'Stock', 'StockTelephone', MntConst.eTypeTextFree, 20, false);
        this.context.riGridStock.AddColumn('StockCancelled', 'Stock', 'StockCancelled', MntConst.eTypeTextFree, 40, false);
        this.context.riGridStock.AddColumn('StockDelivered', 'Stock', 'StockDelivered', MntConst.eTypeTextFree, 40, false);
        this.context.riGridStock.AddColumn('StockUndelivered', 'Stock', 'StockUndelivered', MntConst.eTypeTextFree, 40, false);
        this.context.riGridStock.Complete();
    }
}
