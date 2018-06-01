import { Data } from '@angular/router';

import { MessageConstant } from './../../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';
import { InternalMaintenanceSalesModuleRoutes } from './../../../base/PageRoutes';
import { TelesalesEntryComponent } from './iCABSCMTelesalesEntry.component';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';

export class TelesalesEntry1 {

    private context: TelesalesEntryComponent;
    private dt: Date = new Date();

    constructor(private parent: TelesalesEntryComponent) {
        this.context = parent;
    }

    public windowOnLoad(): void {
        this.context.pageParams.ProductCacheTime = this.context.utils.Time();
        this.context.pageParams.OrderHistoryCacheTime = this.context.utils.Time();
        this.context.pageParams.OrderLineCacheTime = this.context.utils.Time();
        this.context.pageParams.lFetchOrderRequired = false;
        this.context.pageParams.lRefreshProductGrid = false;
        this.context.pageParams.lRefreshOrderHistoryGrid = false;
        this.context.pageParams.lRefreshOrderLineGrid = true;
        this.context.pageParams.lRefreshStockGrid = true;
        this.context.pageParams.lFixedTelesalesOrder = false;

        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdViewOrder');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdEmailOrder');

        this.getInitialSettings();

    }

    public windowOnLoadContinue(): void {
        this.setupDisplayFields();
        this.sensitiseButtons();
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DateFilter', 'Ordered');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdSaveOrder');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdAbandonOrder');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdTelesalesValue');

        this.disableUpdateFields(true);

        if (this.context.pageParams.lRefreshProductGrid) {
            this.context.renderTab(2);
        }

        if (this.context.pageParams.lRefreshOrderHistoryGrid) {
            this.context.iCABSCMTelesalesEntry2.riTabTabFocusAfter();
            this.context.pageParams.lRefreshProductGrid = true;
        }

        if (this.context.pageParams.lFixedTelesalesOrderNumber) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesOrderNumber',
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FixedTelesalesOrderNumber', MntConst.eTypeInteger));
            this.fetchSaveTelesalesOrder('FetchTelesalesOrder', function (): void {
                this.context.iCABSCMTelesalesEntry2.riTabTabFocusAfter();
            });
        }
        this.context.iCABSCMTelesalesEntry2.setupGrids();
        this.context.iCABSCMTelesalesEntry2.buildGrids();
    }

    public getInitialSettings(): void {

        this.context.pageParams.cTelesalesName = this.context.riExchange.getParentHTMLValue('CallAddressName');
        this.context.pageParams.cTelesalesAddressLine1 = this.context.riExchange.getParentHTMLValue('CallAddressLine1');
        this.context.pageParams.cTelesalesAddressLine2 = this.context.riExchange.getParentHTMLValue('CallAddressLine2');
        this.context.pageParams.cTelesalesAddressLine3 = this.context.riExchange.getParentHTMLValue('CallAddressLine3');
        this.context.pageParams.cTelesalesAddressLine4 = this.context.riExchange.getParentHTMLValue('CallAddressLine4');
        this.context.pageParams.cTelesalesAddressLine5 = this.context.riExchange.getParentHTMLValue('CallAddressLine5');
        this.context.pageParams.cTelesalesPostcode = this.context.riExchange.getParentHTMLValue('CallContactPostcode');
        this.context.pageParams.cTelesalesContactName = this.context.riExchange.getParentHTMLValue('CallAddressName');
        this.context.pageParams.cTelesalesContactPosition = this.context.riExchange.getParentHTMLValue('CallContactPosition');
        this.context.pageParams.cTelesalesContactTelephone = this.context.riExchange.getParentHTMLValue('CallContactTelephone');
        this.context.pageParams.cTelesalesContactMobile = this.context.riExchange.getParentHTMLValue('CallContactMobile');
        this.context.pageParams.cTelesalesContactEmail = this.context.riExchange.getParentHTMLValue('CallContactEmail');
        this.context.pageParams.cTelesalesContactFax = this.context.riExchange.getParentHTMLValue('CallContactFax');


        this.context.setControlValue('OrderFromDate', this.context.utils.formatDate(new Date(this.dt.getFullYear() - 1, this.dt.getMonth(), this.dt.getDate())));
        this.context.setControlValue('OrderToDate', this.context.utils.formatDate(new Date(this.dt.getFullYear(), this.dt.getMonth() + 6, this.dt.getDate())));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesOrderNumber', 0);

        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AccountNumber',
            this.context.riExchange.getParentHTMLValue('AccountNumber'));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ContractNumber',
            this.context.riExchange.getParentHTMLValue('ContractNumber'));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PremiseNumber',
            this.context.riExchange.getParentHTMLValue('PremiseNumber'));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ProspectNumber',
            this.context.riExchange.getParentHTMLValue('ProspectNumber'));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CurrentCallLogID',
            this.context.riExchange.getParentHTMLValue('CurrentCallLogID'));

        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'InitialContractNumber', this.context.riExchange.getParentHTMLValue('ContractNumber'));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'InitialPremiseNumber', this.context.riExchange.getParentHTMLValue('PremiseNumber'));

        if (this.context.parentMode === 'PlanVisit' || this.context.parentMode === 'DiscountAnalysisGrid') {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'FixedTelesalesOrderNumber', this.context.riExchange.getParentHTMLValue('TelesalesOrderNumber'));
            this.context.pageParams.lFixedTelesalesOrderNumber = true;
        }

        if (this.context.parentMode === 'StockRequest') {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'FixedTelesalesOrderNumber', this.context.riExchange.getParentHTMLValue('PassTelesalesOrderNumber'));
            this.context.pageParams.lFixedTelesalesOrderNumber = true;
        }

        if (this.context.pageParams.lFixedTelesalesOrderNumber === true) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesOrderNumber', this.context.riExchange.getParentHTMLValue('FixedTelesalesOrderNumber'));
            this.context.pageParams.lRefreshOrderHistoryGrid = true;
            this.context.pageParams.tdTransactionDetails = false;
            this.windowOnLoadContinue();
        } else {
            this.context.pageParams.tdTransactionDetails = true;
            this.getInitialValuesFromService();

        }
    }

    private getInitialValuesFromService(): void {
        this.context.ajaxSource.next(this.context.ajaxconstant.START);
        let query: any = this.context.getURLSearchParamObject();
        query.set(this.context.serviceConstants.Action, '6');
        let formData = {
            'Function': 'GetInitialSettings',
            'AccountNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AccountNumber'),
            'ContractNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'),
            'PremiseNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber', MntConst.eTypeInteger),
            'ProspectNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProspectNumber', MntConst.eTypeInteger),
            'TelesalesOrderNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderNumber', MntConst.eTypeInteger),
            'CurrentCallLogID': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CurrentCallLogID'),
            'TelesalesName': this.context.pageParams.cTelesalesName,
            'TelesalesAddressLine1': this.context.pageParams.cTelesalesAddressLine1,
            'TelesalesAddressLine2': this.context.pageParams.cTelesalesAddressLine2,
            'TelesalesAddressLine3': this.context.pageParams.cTelesalesAddressLine3,
            'TelesalesAddressLine4': this.context.pageParams.cTelesalesAddressLine4,
            'TelesalesAddressLine5': this.context.pageParams.cTelesalesAddressLine5,
            'TelesalesPostcode': this.context.pageParams.cTelesalesPostcode,
            'TelesalesContactName': this.context.pageParams.cTelesalesContactName,
            'TelesalesContactPosition': this.context.pageParams.cTelesalesContactPosition,
            'TelesalesContactTelephone': this.context.pageParams.cTelesalesContactTelephone,
            'TelesalesContactMobile': this.context.pageParams.cTelesalesContactMobile,
            'TelesalesContactEmail': this.context.pageParams.cTelesalesContactEmail,
            'TelesalesContactFax': this.context.pageParams.cTelesalesContactFax
        };
        formData = this.context.utils.cleanForm(formData);
        this.context.httpService.makePostRequest(this.context.queryParams.method, this.context.queryParams.module,
            this.context.queryParams.operation, query, formData)
            .subscribe(
            (data) => {
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.context.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    if ((data.ContractNumber !== this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'))
                        || (data.PremiseNumber !== this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber', MntConst.eTypeInteger))) {
                        this.context.pageParams.lAddressWarning = true;
                    }
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ContractNumber', data.ContractNumber);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PremiseNumber', data.PremiseNumber);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ProspectNumber', data.ProspectNumber);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ErrorMessageCustomerType', data.ErrorMessageCustomerType);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CanEmailOrder', data.CanEmailOrder);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ErrorMessageEmailAddress', data.ErrorMessageEmailAddress);
                    if (data.CanEmailOrder === 'Y') {
                        this.context.pageParams.tdcmdEmailOrder = true;
                    }
                    if (data.CanBulkDiscount === 'Y') {
                        this.context.pageParams.tdBulkDiscountPerc = true;
                    }

                    let ValArray = data.OrderLevelName.split('^');
                    let DescArray = data.OrderLevelDesc.split('^');
                    for (let i = 0; i < ValArray.length; i++) {
                        this.context.pageParams.levelFilter.push({
                            value: ValArray[i],
                            text: DescArray[i]
                        });
                    }
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LevelFilter', data.OrderLevelSelect);

                    if (this.context.pageParams.lFixedTelesalesOrderNumber === true) {
                        this.context.pageParams.tdTransactionDetails = false;
                    } else {
                        this.context.pageParams.tdTransactionDetails = true;
                        this.context.pageParams.tdTransactionLabel = data.TransactionLabel;
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TransactionNumber', data.TransactionNumber);
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TransactionName', data.TransactionName);
                        if (data.OrdersExist === 'N') {
                            this.context.pageParams.lRefreshProductGrid = true;
                        } else {
                            this.context.pageParams.lRefreshOrderHistoryGrid = true;
                        }
                    }

                }
                this.windowOnLoadContinue();
            },
            (error) => {
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
                this.context.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
                this.windowOnLoadContinue();
            }
            );
    }

    public setupDisplayFields(): void {

        if (this.context.pageParams.lEnableAddressLine3) {
            this.context.pageParams.trTelesalesAddressLine3 = true;
            this.context.pageParams.trTelesalesInvAddressLine3 = true;
        }

        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BulkDiscountPerc', '0.00');
        this.context.maxLength = this.context.pageParams.iSCMaximumAddressLength;

        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TransactionNumber');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TransactionName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesNumber');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesOrderStatusDesc');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'CurrentCallLogID');

        if (this.context.pageParams.lSCAddressLine3Logical) {
            this.setRequired('TelesalesAddressLine3', true);
        } else {
            this.setRequired('TelesalesAddressLine3', false);
        }
        if (this.context.pageParams.lSCAddressLine4Required) {
            this.setRequired('TelesalesAddressLine4', true);
        } else {
            if (!this.context.pageParams.lEnablePostcodeSuburbLog && this.context.pageParams.lEnableValidatePostcodeSuburb) {
                this.setRequired('TelesalesAddressLine4', false);
            } else {
                this.setRequired('TelesalesAddressLine4', true);
            }
        }
        if (this.context.pageParams.lSCAddressLine5Required) {
            this.setRequired('TelesalesAddressLine5', true);
        } else {
            this.setRequired('TelesalesAddressLine5', false);
        }
        if (this.context.pageParams.lSCPostCodeRequired) {
            this.setRequired('TelesalesPostcode', true);
        } else {
            this.setRequired('TelesalesPostcode', false);
        }

        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesOrderDate');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'QuoteExpiryDate');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'CommissionEmployeeName');

        if (this.context.pageParams.lSCAddressLine3Logical) {
            this.setRequired('TelesalesInvAddressLine3', true);
        } else {
            this.setRequired('TelesalesInvAddressLine3', false);
        }
        if (this.context.pageParams.lSCAddressLine4Required) {
            this.setRequired('TelesalesInvAddressLine4', true);
        } else {
            if (!this.context.pageParams.lEnablePostcodeSuburbLog && this.context.pageParams.lEnableValidatePostcodeSuburb) {
                this.setRequired('TelesalesInvAddressLine4', false);
            } else {
                this.setRequired('TelesalesInvAddressLine4', true);
            }
        }
        if (this.context.pageParams.lSCAddressLine5Required) {
            this.setRequired('TelesalesInvAddressLine5', true);
        } else {
            this.setRequired('TelesalesInvAddressLine5', false);
        }
        if (this.context.pageParams.lSCPostCodeRequired) {
            this.setRequired('TelesalesInvPostcode', true);
        } else {
            this.setRequired('TelesalesInvPostcode', false);
        }

        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelectedProductValue');

        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'PaymentTypeDesc');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'PaymentRef');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvoiceNumber');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSStatusCode');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSStatusDesc');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSOrderDate');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSOrderTime');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSCreatedBy');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSCreatedByName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesQConfirmedDate');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesQConfirmedTime');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesQConfirmedBy');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSQConfirmedByName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesConfirmedDate');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesConfirmedTime');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesConfirmedBy');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSConfirmedByName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesCancelledDate');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesCancelledTime');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesCancelledBy');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSCancelledByName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesCompletedDate');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesCompletedTime');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesCompletedBy');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSCompletedByName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSProspectNumber');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSProspectName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSAccountNumber');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSAccountName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSContractNumber');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSContractName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSPremiseNumber');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSPremiseName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSOrigContractNumber');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSOrigContractName');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSOrigPremiseNumber');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'OSOrigPremiseName');
    }

    private setRequired(field: string, req: boolean): void {
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, field, req);
    }

    public fetchSaveTelesalesOrder(cFunction: string, fncallback?: any): void {
        this.context.ajaxSource.next(this.context.ajaxconstant.START);
        let query: any = this.context.getURLSearchParamObject();
        query.set(this.context.serviceConstants.Action, '6');
        if (this.context.pageParams.lFetchOrderRequired !== true) {
            this.context.pageParams.OrderHistoryCacheTime = this.context.utils.Time();
        }
        this.context.pageParams.lSavedOk = false;
        let formData = {
            'Function': cFunction,
            'TelesalesOrderNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderNumber', MntConst.eTypeInteger),
            'CurrentCallLogID': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CurrentCallLogID'),
            'AccountNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AccountNumber'),
            'ContractNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'),
            'PremiseNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber', MntConst.eTypeInteger),
            'ProspectNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProspectNumber', MntConst.eTypeInteger),
            'TelesalesOrderStatusCode': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderStatusCode'),
            'TelesalesName': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesName'),
            'TelesalesAddressLine1': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesAddressLine1'),
            'TelesalesAddressLine2': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesAddressLine2'),
            'TelesalesAddressLine3': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesAddressLine3'),
            'TelesalesAddressLine4': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesAddressLine4'),
            'TelesalesAddressLine5': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesAddressLine5'),
            'TelesalesPostcode': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesPostcode'),
            'TelesalesContactName': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesContactName'),
            'TelesalesContactPosition': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesContactPosition'),
            'TelesalesContactTelephone': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesContactTelephone'),
            'TelesalesContactMobile': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesContactMobile'),
            'TelesalesContactEmail': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesContactEmail'),
            'TelesalesContactFax': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesContactFax'),
            'TelesalesOrderDate': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderDate', MntConst.eTypeDate),
            'TelesalesDeliveryDate': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesDeliveryDate', MntConst.eTypeDate),
            'TelesalesDeliveryCharge': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesDeliveryCharge'),
            'TelesalesPurchaseOrderNo': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesPurchaseOrderNo'),
            'ContractReference': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractReference'),
            'PaymentTypeCode': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PaymentTypeCode'),
            'CustomerTypeCode': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CustomerTypeCodeSelect'),
            'CommissionEmployeeCode': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CommissionEmployeeCode'),
            'QuoteExpiryDate': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'QuoteExpiryDate', MntConst.eTypeDate),
            'TelesalesOrderNotes': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderNotes'),
            'TelesalesDeliveryInstructions': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesDeliveryInstructions'),
            'TelesalesInvName': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvName'),
            'TelesalesInvAddressLine1': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvAddressLine1'),
            'TelesalesInvAddressLine2': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvAddressLine2'),
            'TelesalesInvAddressLine3': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvAddressLine3'),
            'TelesalesInvAddressLine4': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvAddressLine4'),
            'TelesalesInvAddressLine5': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvAddressLine5'),
            'TelesalesInvPostcode': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvPostcode'),
            'TelesalesInvContactName': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvContactName'),
            'TelesalesInvContactPosition': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvContactPosition'),
            'TelesalesInvContactTelephone': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvContactTelephone'),
            'TelesalesInvContactMobile': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvContactMobile'),
            'TelesalesInvContactEmail': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvContactEmail'),
            'TelesalesInvContactFax': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesInvContactFax')
        };
        formData = this.context.utils.cleanForm(formData);
        this.context.httpService.makePostRequest(this.context.queryParams.method, this.context.queryParams.module,
            this.context.queryParams.operation, query, formData)
            .subscribe(
            (data) => {
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.context.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdViewOrder');
                    this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdEmailOrder');
                    this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdTelesalesValue');

                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesOrderNumber', data.TelesalesOrderNumber);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesOrderStatusCode', data.TelesalesOrderStatusCode);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesOrderStatusDesc', data.TelesalesOrderStatusDesc);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesName', data.TelesalesName);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesAddressLine1', data.TelesalesAddressLine1);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesAddressLine2', data.TelesalesAddressLine2);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesAddressLine3', data.TelesalesAddressLine3);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesAddressLine4', data.TelesalesAddressLine4);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesAddressLine5', data.TelesalesAddressLine5);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesPostcode', data.TelesalesPostcode);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesContactName', data.TelesalesContactName);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesContactPosition', data.TelesalesContactPosition);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesContactTelephone', data.TelesalesContactTelephone);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesContactMobile', data.TelesalesContactMobile);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesContactEmail', data.TelesalesContactEmail);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesContactFax', data.TelesalesContactFax);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesOrderDate', data.TelesalesOrderDate);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'QuoteExpiryDate', data.QuoteExpiryDate);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesDeliveryDate', data.TelesalesDeliveryDate);

                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesDeliveryCharge', data.TelesalesDeliveryCharge);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesPurchaseOrderNo', data.TelesalesPurchaseOrderNo);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ContractReference', data.ContractReference);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PaymentTypeCode', data.PaymentTypeCode);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CustomerTypeCodeSelect', data.CustomerTypeCode);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CommissionEmployeeCode', data.CommissionEmployeeCode);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CommissionEmployeeName', data.CommissionEmployeeName);

                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesOrderNotes', data.TelesalesOrderNotes);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesDeliveryInstructions', data.TelesalesDeliveryInstructions);

                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesInvName', data.TelesalesInvName);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesInvAddressLine1', data.TelesalesInvAddressLine1);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesInvAddressLine2', data.TelesalesInvAddressLine2);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesInvAddressLine3', data.TelesalesInvAddressLine3);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesInvAddressLine4', data.TelesalesInvAddressLine4);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesInvAddressLine5', data.TelesalesInvAddressLine5);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesInvPostcode', data.TelesalesInvPostcode);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesInvContactName', data.TelesalesInvContactName);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesInvContactPosition', data.TelesalesInvContactPosition);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesInvContactTelephone', data.TelesalesInvContactTelephone);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesInvContactMobile', data.TelesalesInvContactMobile);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesInvContactEmail', data.TelesalesInvContactEmail);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesInvContactFax', data.TelesalesInvContactFax);

                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CompanyRegistrationNumber', data.CompanyRegistrationNumber);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CompanyVATNumber', data.CompanyVATNumber);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CompanyVATNumber2', data.CompanyVATNumber2);

                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PaymentTypeDesc', data.PaymentTypeDesc);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PaymentRef', data.PaymentRef);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesInvoiceNumber', data.TelesalesInvoiceNumber);

                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSStatusCode', data.OSStatusCode);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSStatusDesc', data.OSStatusDesc);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSOrderDate', data.OSOrderDate);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSOrderTime', this.context.utils.secondsToHms(data.OSOrderTime));
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSCreatedBy', data.OSCreatedBy);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSCreatedByName', data.OSCreatedByName);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesQConfirmedDate', data.TelesalesQConfirmedDate);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesQConfirmedTime', this.context.utils.secondsToHms(data.TelesalesQConfirmedTime));
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesQConfirmedUserCode', data.TelesalesQConfirmedUserCode);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSQConfirmedByName', data.OSQConfirmedByName);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesConfirmedDate', data.TelesalesConfirmedDate);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesConfirmedTime', this.context.utils.secondsToHms(data.TelesalesConfirmedTime));
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesConfirmedUserCode', data.TelesalesConfirmedUserCode);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSConfirmedByName', data.OSConfirmedByName);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesCancelledDate', data.TelesalesCancelledDate);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesCancelledTime', this.context.utils.secondsToHms(data.TelesalesCancelledTime));
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesCancelledUserCode', data.TelesalesCancelledUserCode);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSCancelledByName', data.OSCancelledByName);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesCompletedDate', data.TelesalesCompletedDate);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesCompletedTime', this.context.utils.secondsToHms(data.TelesalesCompletedTime));
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TelesalesCompletedUserCode', data.TelesalesCompletedUserCode);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSCompletedByName', data.OSCompletedByName);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSProspectNumber', data.OSProspectNumber);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSProspectName', data.OSProspectName);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSAccountNumber', data.OSAccountNumber);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSAccountName', data.OSAccountName);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSContractNumber', data.OSContractNumber);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSContractName', data.OSContractName);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSPremiseNumber', data.OSPremiseNumber);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSPremiseName', data.OSPremiseName);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSOrigContractNumber', data.OSOrigContractNumber);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSOrigContractName', data.OSOrigContractName);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSOrigPremiseNumber', data.OSOrigPremiseNumber);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OSOrigPremiseName', data.OSOrigPremiseName);

                    this.context.pageParams.lSavedOk = true;

                    this.context.pageParams.cCanConfirmAsOrder = data.CanConfirmAsOrder;
                    this.context.pageParams.cCanConfirmAsQuote = data.CanConfirmAsQuote;
                    this.context.pageParams.cCanCancelOrder = data.CanCancelOrder;
                    this.context.pageParams.cCanCancelQuote = data.CanCancelQuote;
                    this.context.pageParams.cCanUpdate = data.CanUpdate;
                    this.context.pageParams.cCanUpdateAddress = data.CanUpdateAddress;

                    this.sensitiseButtons();
                    if (cFunction.toUpperCase() === 'fetchTelesalesOrder'.toUpperCase()) {
                        if (this.context.pageParams.lDoubleClick === false) {
                            this.context.pageParams.lRefreshOrderGrid = true;
                        }
                        this.context.pageParams.lRefreshOrderOrderlineGrid = true;
                        this.context.pageParams.lRefreshStockGrid = true;
                    }

                }
                if (fncallback && typeof fncallback === 'function') {
                    fncallback.call(this.context);
                }
            },
            (error) => {
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
                this.context.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
                if (fncallback && typeof fncallback === 'function') {
                    fncallback.call(this.context);
                }
            }
            );

    }

    public sensitiseButtons(): void {

        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdConfirmOrder');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdConfirmQuotation');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdCancelOrder');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdCancelQuote');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdUpdateOrder');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'BulkDiscountPerc');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdBulkDiscountPerc');

        if (this.context.pageParams.cCanConfirmAsOrder === 'Y') {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdConfirmOrder');
        }

        if (this.context.pageParams.cCanConfirmAsQuote === 'Y') {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdConfirmQuotation');
        }

        if (this.context.pageParams.cCanCancelOrder === 'Y') {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdCancelOrder');
        }

        if (this.context.pageParams.cCanCancelQuote === 'Y') {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdCancelQuote');
        }

        if (this.context.pageParams.cCanUpdate === 'Y') {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdUpdateOrder');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'BulkDiscountPerc');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BulkDiscountPerc', '0.00');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdBulkDiscountPerc');
        }

    }

    public cmdUpdateOrderOnClick(): void {
        this.context.routeAwayGlobals.setSaveEnabledFlag(true);
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ClosedWithChanges', 'Y');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdConfirmOrder');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdConfirmQuotation');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdCancelOrder');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdCancelQuote');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdUpdateOrder');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdViewOrder');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdEmailOrder');

        this.disableUpdateFields(false);
        this.setRequired('TelesalesPurchaseOrderNo', false);

        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesName')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesName');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesAddressLine1')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesAddressLine1');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesAddressLine2')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesAddressLine2');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesAddressLine3')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesAddressLine3');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesAddressLine4')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesAddressLine4');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesAddressLine5')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesAddressLine5');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesPostcode')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesPostcode');
        }

        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvName')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvName');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvAddressLine1')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvAddressLine1');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvAddressLine2')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvAddressLine2');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvAddressLine3')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvAddressLine3');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvAddressLine4')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvAddressLine4');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvAddressLine5')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvAddressLine5');
        }
        if (this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TelesalesInvPostcode')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvPostcode');
        }

        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdUpdateOrder');
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdSaveOrder');
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdAbandonOrder');
        this.context.pageParams.tdcmdSaveOrder = true;
        this.context.pageParams.tdcmdAbandonOrder = true;

        // Switch to the delivery tab if the user is not on a tab which they can update!
        if (!this.context.uiDisplay.tab.tab3.active && !this.context.uiDisplay.tab.tab4.active
            && !this.context.uiDisplay.tab.tab6.active) {
            this.context.renderTab(3);
        }

    }

    public cmdSaveOrderOnClick(): void {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ClosedWithChanges', 'Y');
        this.context.pageParams.lConfirmingOrder = false;
        this.context.iCABSCMTelesalesEntry2.validateOrder(function (): void {
            if (this.context.pageParams.lValidateOK) {
                this.fetchSaveTelesalesOrder('SaveTelesalesOrder', function (): void {
                    if (this.context.pageParams.lSavedOk) {
                        this.context.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.SavedSuccessfully));
                        this.context.iCABSCMTelesalesEntry1.disableUpdateFields(true);
                        this.context.iCABSCMTelesalesEntry1.sensitiseButtons();
                        this.context.pageParams.tdcmdUpdateOrder = true;
                        this.context.routeAwayGlobals.setSaveEnabledFlag(false);
                        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdUpdateOrder');
                        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdSaveOrder');
                        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdAbandonOrder');
                        this.context.pageParams.tdcmdSaveOrder = false;
                        this.context.pageParams.tdcmdAbandonOrder = false;
                    }
                });
            }
        });
    }

    public cmdAbandonOrderOnClick(): void {
        this.context.routeAwayGlobals.setSaveEnabledFlag(false);
        this.context.uiForm.markAsPristine();
        this.context.utils.makeTabsNormal();
        this.disableUpdateFields(true);
        this.sensitiseButtons();
        this.fetchSaveTelesalesOrder('FetchTelesalesOrder', function (): void {
            this.context.pageParams.tdcmdUpdateOrder = true;
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdUpdateOrder');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdSaveOrder');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdAbandonOrder');
            this.context.pageParams.tdcmdSaveOrder = false;
            this.context.pageParams.tdcmdAbandonOrder = false;
        });
    }

    public cmdCancelQuoteOnClick(): void {
        let obj: ICabsModalVO = new ICabsModalVO(
            'Are You Sure You Want To Cancel This Quote?',
            null,
            this.context.iCABSCMTelesalesEntry1.cmdCancelQuoteexec.bind(this),
            null);
        obj.title = 'About To Cancel Quote';
        this.context.modalAdvService.emitPrompt(obj);
    }

    public cmdCancelQuoteexec(): void {
        this.fetchSaveTelesalesOrder('CancelQuote', function (): void {
            this.context.pageParams.lRefreshOrderHistoryGrid = true;
            this.context.iCABSCMTelesalesEntry2.riTabTabFocusAfter();
        });
    }

    public cmdConfirmQuotationOnClick(): void {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ClosedWithChanges', 'Y');
        this.context.renderTab(3);
        this.context.pageParams.lConfirmingOrder = false;
        this.context.iCABSCMTelesalesEntry2.validateOrder();
        let obj: ICabsModalVO = new ICabsModalVO(
            'Once Confirmed You Will Be Prevented From Making Any Further Changes. Are You Sure You Want To Continue?',
            null,
            this.context.iCABSCMTelesalesEntry1.cmdConfirmQuotationexec.bind(this),
            null);
        obj.title = 'About To Confirm Order';
        this.context.modalAdvService.emitPrompt(obj);
    }

    public cmdConfirmQuotationexec(): void {
        this.fetchSaveTelesalesOrder('ConfirmAsQuote', function (): void {
            this.context.pageParams.lRefreshOrderHistoryGrid = true;
            this.context.pageParams.lRefreshOrderLineGrid = true;
            this.context.pageParams.lRefreshStockGrid = true;
            this.context.pageParams.lRefreshProductGrid = true;
            this.context.iCABSCMTelesalesEntry2.riTabTabFocusAfter();
        });
    }

    public cmdConfirmOrderOnClick(): void {
        //Move focus to the delivery tab to give the user delivery dates etc...
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ClosedWithChanges', 'Y');
        this.context.pageParams.lConfirmingOrder = true;
        this.setRequired('TelesalesPurchaseOrderNo', false);
        this.context.iCABSCMTelesalesEntry2.validateOrder(function (): void {
            if (this.context.pageParams.lValidateOK) {
                this.fetchSaveTelesalesOrder('SaveTelesalesOrder', function (): void {
                    this.context.pageParams.returnState = this.context.createControlObjectFromForm();
                    this.context.pageParams.tabIndex = 7;
                    this.context.pageParams.lRefreshOrderHistoryGrid = true;
                    this.context.pageParams.lRefreshOrderLineGrid = true;
                    this.context.pageParams.lRefreshStockGrid = true;
                    this.context.pageParams.lRefreshProductGrid = true;
                    this.pageParams.saveReturnCallback = true;
                    this.context.navigate('', InternalMaintenanceSalesModuleRoutes.ICABSCMTELESALESENTRYCONFIRMORDER);
                });
            }
        });
    }

    public cmdConfirmOrderResumePage(): void {
        this.fetchSaveTelesalesOrder('FetchTelesalesOrder', function (): void {
            this.context.pageParams.lRefreshOrderHistoryGrid = true;
            this.context.pageParams.lRefreshOrderLineGrid = true;
            this.context.pageParams.lRefreshStockGrid = true;
            this.context.pageParams.lRefreshProductGrid = true;
            this.context.renderTab(7);
        });
    }

    public cmdEmailOrderOnClick(): void {
        //Refetch The Current Telesales Order To Show The Updated Contact Name / Email Address
        this.fetchSaveTelesalesOrder('FetchTelesalesOrder', function (): void {
            this.context.pageParams.lRefreshOrderHistoryGrid = true;
            this.context.pageParams.lRefreshOrderLineGrid = true;
            this.context.pageParams.lRefreshStockGrid = true;
            this.context.pageParams.lRefreshProductGrid = true;
            this.context.pageParams.returnState = this.context.createControlObjectFromForm();
            alert('navigate to iCABSCMTelesalesEntryEmailOrder');
        });
    }

    public cmdCancelOrderOnClick(): void {
        let obj: ICabsModalVO = new ICabsModalVO(
            'Are You Sure You Want To Cancel This Order?',
            null,
            this.context.iCABSCMTelesalesEntry1.cmdCancelOrderexec.bind(this),
            null);
        obj.title = 'About To Cancel Order';
        this.context.modalAdvService.emitPrompt(obj);
    }

    public cmdCancelOrderexec(): void {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ClosedWithChanges', 'Y');
        this.fetchSaveTelesalesOrder('CancelOrder', function (): void {
            this.context.pageParams.lRefreshOrderHistoryGrid = true;
            this.context.pageParams.lRefreshOrderLineGrid = true;
            this.context.pageParams.lRefreshStockGrid = true;
            this.context.pageParams.lRefreshProductGrid = true;
            this.context.iCABSCMTelesalesEntry2.riTabTabFocusAfter();
        });
    }

    public cmdTelesalesValueOnClick(): void {
        this.context.pageParams.returnState = this.context.createControlObjectFromForm();
        alert('navigate to iCABSCMTelesalesEntryTotals');
    }

    public disableUpdateFields(lDisable: boolean): void {
        if (lDisable) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesName');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesAddressLine1');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesAddressLine2');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesAddressLine3');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesAddressLine4');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesAddressLine5');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesPostcode');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesContactName');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesContactPosition');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesContactTelephone');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesContactMobile');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesContactEmail');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesContactFax');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesDeliveryDate');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesDeliveryCharge');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesPurchaseOrderNo');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'ContractReference');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'CommissionEmployeeCode');
            this.context.ellipsisConfig.employee.disabled = true;
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'CustomerTypeCodeSelect');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesOrderNotes');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesDeliveryInstructions');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvName');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvAddressLine1');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvAddressLine2');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvAddressLine3');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvAddressLine4');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvAddressLine5');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvPostcode');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvContactName');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvContactPosition');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvContactTelephone');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvContactMobile');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvContactEmail');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TelesalesInvContactFax');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'CompanyRegistrationNumber');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'CompanyVATNumber');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'CompanyVATNumber2');
        } else {
            if (this.context.pageParams.cCanUpdateAddress === 'Y') {
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesName');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesAddressLine1');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesAddressLine2');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesAddressLine3');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesAddressLine4');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesAddressLine5');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesPostcode');
            }
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesContactName');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesContactPosition');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesContactTelephone');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesContactMobile');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesContactEmail');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesContactFax');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesDeliveryDate');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesDeliveryCharge');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesPurchaseOrderNo');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'ContractReference');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'CommissionEmployeeCode');
            this.context.ellipsisConfig.employee.disabled = false;
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'CustomerTypeCodeSelect');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesOrderNotes');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesDeliveryInstructions');
            if (this.context.pageParams.cCanUpdateAddress === 'Y') {
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvName');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvAddressLine1');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvAddressLine2');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvAddressLine3');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvAddressLine4');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvAddressLine5');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvPostcode');
            }
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvContactName');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvContactPosition');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvContactTelephone');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvContactMobile');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvContactEmail');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TelesalesInvContactFax');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'CompanyRegistrationNumber');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'CompanyVATNumber');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'CompanyVATNumber2');
        }
    }

    public cmdViewOrderOnClick(): void {
        this.submitReportRequest();
    }

    public submitReportRequest(): void {
        let query: any = this.context.getURLSearchParamObject();
        query.set(this.context.serviceConstants.Action, '0');
        query.set('Function', 'Single');
        query.set('TelesalesOrderNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderNumber', MntConst.eTypeInteger));
        this.context.httpService.makeGetRequest(this.context.queryParams.method, this.context.queryParams.module,
            this.context.queryParams.operation, query)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.context.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    window.open(data.url, 'blank');
                }
            },
            (error) => {
                this.context.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
            }
            );
    }

    public cmdBulkDiscountPercOnClick(): void {
        let obj: ICabsModalVO = new ICabsModalVO(
            'Are You Sure You Want To Apply This Discount?',
            null,
            this.context.iCABSCMTelesalesEntry1.cmdBulkDiscountPercexec.bind(this),
            null);
        obj.title = 'About To Apply Discount';
        this.context.modalAdvService.emitPrompt(obj);
    }

    public cmdBulkDiscountPercexec(): void {
        this.context.ajaxSource.next(this.context.ajaxconstant.START);
        let query: any = this.context.getURLSearchParamObject();
        query.set(this.context.serviceConstants.Action, '6');
        if (this.context.pageParams.lFetchOrderRequired !== true) {
            this.context.pageParams.OrderHistoryCacheTime = this.context.utils.Time();
        }
        this.context.pageParams.lSavedOk = false;
        let formData = {
            'Function': 'ApplyBulkDiscount',
            'TelesalesOrderNumber': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TelesalesOrderNumber', MntConst.eTypeInteger),
            'BulkDiscountPerc': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BulkDiscountPerc')
        };

        this.context.httpService.makePostRequest(this.context.queryParams.method, this.context.queryParams.module,
            this.context.queryParams.operation, query, formData)
            .subscribe(
            (data) => {
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.context.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.context.iCABSCMTelesalesEntryOrderLine.riGridOrderLineBeforeExecute();
                }
            },
            (error) => {
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
                this.context.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
            }
            );
    }
}
