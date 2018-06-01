import { URLSearchParams } from '@angular/http';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { RiTab, MntConst } from './../../../../shared/services/riMaintenancehelper';
import { GridAdvancedComponent } from './../../../../shared/components/grid-advanced/grid-advanced';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../../shared/components/grid/grid';
import { EmployeeSearchComponent } from './../../search/iCABSBEmployeeSearch';
import { TelesalesEntryStock } from './iCABSCMTelesalesEntryStock';
import { TelesalesEntryOrderLine } from './iCABSCMTelesalesEntryOrderLine';
import { TelesalesEntryOrderHistory } from './iCABSCMTelesalesEntryOrderHistory';
import { TelesalesEntryProduct } from './iCABSCMTelesalesEntryProduct';
import { TelesalesEntry2 } from './iCABSCMTelesalesEntry2';
import { TelesalesEntry1 } from './iCABSCMTelesalesEntry1';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { MessageCallback } from '../../../../app/base/Callback';

@Component({
    templateUrl: 'iCABSCMTelesalesEntry.html'
})
export class TelesalesEntryComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('riGridOrderHistory') riGridOrderHistory: GridAdvancedComponent;
    @ViewChild('riGridProduct') riGridProduct: GridAdvancedComponent;
    @ViewChild('riGridOrderLine') riGridOrderLine: GridAdvancedComponent;
    @ViewChild('riGridStock') riGridStock: GridAdvancedComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    public queryParams: any = {
        operation: 'ContactManagement/iCABSCMTelesalesEntry',
        module: 'telesales',
        method: 'ccm/maintenance'
    };

    public maxLength: number = 40;
    public promptCallback: any;
    public totalItems: number = 0;
    public showMessageHeader: boolean = true;
    public gLanguageCode: string;
    public search = new URLSearchParams();
    public lookUpSubscription: Subscription;
    public subSysChar: Subscription;
    public context: TelesalesEntryComponent;
    public iCABSCMTelesalesEntry1: TelesalesEntry1;
    public iCABSCMTelesalesEntry2: TelesalesEntry2;
    public iCABSCMTelesalesEntryProduct: TelesalesEntryProduct;
    public iCABSCMTelesalesEntryOrderHistory: TelesalesEntryOrderHistory;
    public iCABSCMTelesalesEntryOrderLine: TelesalesEntryOrderLine;
    public iCABSCMTelesalesEntryStock: TelesalesEntryStock;
    public riTab: RiTab;
    public tabVisited = [false, false, false, false, false, false, false, false];

    public pageId: string = '';
    public controls = [
        { name: 'TransactionNumber', readonly: true, disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'TransactionName', readonly: true, disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'TelesalesOrderNumber', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'TelesalesOrderStatusDesc', readonly: true, disabled: false, required: false },
        { name: 'CurrentCallLogID', readonly: true, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'LevelFilter', readonly: true, disabled: false, required: false },
        { name: 'DateFilter', readonly: true, disabled: false, required: false },
        { name: 'TelesalesOrderStatusCodeFilter', readonly: true, disabled: false, required: false },
        { name: 'cmdCreateOrderHistory', readonly: true, disabled: false, required: false },
        { name: 'cmdCreateOrderHistoryCurrent', readonly: true, disabled: false, required: false },
        { name: 'cmdClearOrderHistory', readonly: true, disabled: false, required: false },
        { name: 'ProductDescriptionContains', readonly: true, disabled: false, required: false },
        { name: 'ProductCodeBegins', readonly: true, disabled: false, required: false },
        { name: 'SelectedProductValue', readonly: true, disabled: false, required: false },
        { name: 'TelesalesName', readonly: true, disabled: false, required: true, type: MntConst.eTypeTextFree },
        { name: 'TelesalesOrderDate', readonly: true, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'TelesalesAddressLine1', readonly: true, disabled: false, required: true, type: MntConst.eTypeTextFree },
        { name: 'QuoteExpiryDate', readonly: true, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'TelesalesAddressLine2', readonly: true, disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'TelesalesAddressLine3', readonly: true, disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'TelesalesAddressLine4', readonly: true, disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'TelesalesDeliveryCharge', readonly: true, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'TelesalesAddressLine5', readonly: true, disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'TelesalesPostcode', readonly: true, disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'TelesalesContactName', readonly: true, disabled: false, required: true, type: MntConst.eTypeTextFree },
        { name: 'TelesalesDeliveryDate', readonly: true, disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'TelesalesPurchaseOrderNo', readonly: true, disabled: false, required: false },
        { name: 'TelesalesContactPosition', readonly: true, disabled: false, required: true, type: MntConst.eTypeTextFree },
        { name: 'ContractReference', readonly: true, disabled: false, required: false },
        { name: 'TelesalesContactTelephone', readonly: true, disabled: false, required: true, type: MntConst.eTypeTextFree },
        { name: 'TelesalesContactMobile', readonly: true, disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'CustomerTypeCodeSelect', readonly: true, disabled: false, required: true },
        { name: 'TelesalesContactEmail', readonly: true, disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'TelesalesContactFax', readonly: true, disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'CommissionEmployeeCode', readonly: true, disabled: false, required: true, type: MntConst.eTypeCode },
        { name: 'CommissionEmployeeName', readonly: true, disabled: false, required: false },
        { name: 'TelesalesOrderNotes', readonly: true, disabled: false, required: false },
        { name: 'TelesalesDeliveryInstructions', readonly: true, disabled: false, required: false },
        { name: 'BulkDiscountPerc', readonly: true, disabled: false, required: false },
        { name: 'TelesalesInvName', readonly: true, disabled: false, required: true },
        { name: 'CompanyRegistrationNumber', readonly: true, disabled: false, required: false },
        { name: 'TelesalesInvAddressLine1', readonly: true, disabled: false, required: true },
        { name: 'CompanyVATNumber', readonly: true, disabled: false, required: false },
        { name: 'TelesalesInvAddressLine2', readonly: true, disabled: false, required: false },
        { name: 'CompanyVATNumber2', readonly: true, disabled: false, required: false },
        { name: 'TelesalesInvAddressLine3', readonly: true, disabled: false, required: false },
        { name: 'TelesalesInvAddressLine4', readonly: true, disabled: false, required: false },
        { name: 'TelesalesInvAddressLine5', readonly: true, disabled: false, required: false },
        { name: 'PaymentTypeDesc', readonly: true, disabled: false, required: false },
        { name: 'TelesalesInvPostcode', readonly: true, disabled: false, required: false },
        { name: 'PaymentRef', readonly: true, disabled: false, required: false },
        { name: 'TelesalesInvContactName', readonly: true, disabled: false, required: true },
        { name: 'TelesalesInvoiceNumber', readonly: true, disabled: false, required: false },
        { name: 'TelesalesInvContactPosition', readonly: true, disabled: false, required: true },
        { name: 'TelesalesInvContactTelephone', readonly: true, disabled: false, required: true },
        { name: 'TelesalesInvContactMobile', readonly: true, disabled: false, required: false },
        { name: 'TelesalesInvContactEmail', readonly: true, disabled: false, required: false },
        { name: 'TelesalesInvContactFax', readonly: true, disabled: false, required: false },
        { name: 'OSStatusDesc', readonly: true, disabled: false, required: false },
        { name: 'OSOrderDate', readonly: true, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'OSOrderTime', readonly: true, disabled: false, required: false, type: MntConst.eTypeTime },
        { name: 'OSCreatedBy', readonly: true, disabled: false, required: false },
        { name: 'OSCreatedByName', readonly: true, disabled: false, required: false },
        { name: 'TelesalesQConfirmedDate', readonly: true, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'TelesalesQConfirmedTime', readonly: true, disabled: false, required: false, type: MntConst.eTypeTime },
        { name: 'TelesalesQConfirmedUserCode', readonly: true, disabled: false, required: false },
        { name: 'TelesalesConfirmedTime', readonly: true, disabled: false, required: false, type: MntConst.eTypeTime },
        { name: 'TelesalesConfirmedUserCode', readonly: true, disabled: false, required: false },
        { name: 'OSQConfirmedByName', readonly: true, disabled: false, required: false },
        { name: 'OSConfirmedByName', readonly: true, disabled: false, required: false },
        { name: 'TelesalesCancelledDate', readonly: true, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'TelesalesCancelledTime', readonly: true, disabled: false, required: false, type: MntConst.eTypeTime },
        { name: 'TelesalesCancelledUserCode', readonly: true, disabled: false, required: false },
        { name: 'OSCancelledByName', readonly: true, disabled: false, required: false },
        { name: 'TelesalesCompletedDate', readonly: true, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'TelesalesCompletedTime', readonly: true, disabled: false, required: false, type: MntConst.eTypeTime },
        { name: 'TelesalesCompletedUserCode', readonly: true, disabled: false, required: false },
        { name: 'OSCompletedByName', readonly: true, disabled: false, required: false },
        { name: 'OSProspectNumber', readonly: true, disabled: false, required: false },
        { name: 'OSProspectName', readonly: true, disabled: false, required: false },
        { name: 'OSAccountNumber', readonly: true, disabled: false, required: false },
        { name: 'OSAccountName', readonly: true, disabled: false, required: false },
        { name: 'OSContractNumber', readonly: true, disabled: false, required: false },
        { name: 'OSContractName', readonly: true, disabled: false, required: false },
        { name: 'OSPremiseNumber', readonly: true, disabled: false, required: false },
        { name: 'OSPremiseName', readonly: true, disabled: false, required: false },
        { name: 'OSOrigContractNumber', readonly: true, disabled: false, required: false },
        { name: 'OSOrigContractName', readonly: true, disabled: false, required: false },
        { name: 'OSOrigPremiseNumber', readonly: true, disabled: false, required: false },
        { name: 'OSOrigPremiseName', readonly: true, disabled: false, required: false },
        { name: 'cmdConfirmQuotation', readonly: true, disabled: false, required: false },
        { name: 'cmdConfirmOrder', readonly: true, disabled: false, required: false },
        { name: 'cmdCancelQuote', readonly: true, disabled: false, required: false },
        { name: 'cmdCancelOrder', readonly: true, disabled: false, required: false },
        { name: 'cmdTelesalesValue', readonly: true, disabled: false, required: false },
        { name: 'cmdViewOrder', readonly: true, disabled: false, required: false },
        { name: 'cmdEmailOrder', readonly: true, disabled: false, required: false },
        { name: 'cmdUpdateOrder', readonly: true, disabled: false, required: false },
        { name: 'cmdSaveOrder', readonly: true, disabled: false, required: false },
        { name: 'cmdAbandonOrder', readonly: true, disabled: false, required: false },
        { name: 'OrderFromDate', readonly: true, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'OrderToDate', readonly: true, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'InitialContractNumber', readonly: true, disabled: false, required: false },
        { name: 'InitialPremiseNumber', readonly: true, disabled: false, required: false },
        { name: 'SelectedProduct', readonly: true, disabled: false, required: false },
        { name: 'SelectedOrderHistory', readonly: true, disabled: false, required: false },
        { name: 'SelectedOrderLine', readonly: true, disabled: false, required: false },
        { name: 'SelectedStock', readonly: true, disabled: false, required: false },
        { name: 'AccountNumber', readonly: true, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'ContractNumber', readonly: true, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'PremiseNumber', readonly: true, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'ProspectNumber', readonly: true, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'TelesalesOrderLineNumber', readonly: true, disabled: false, required: false },
        { name: 'TelesalesOrderStatusCode', readonly: true, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'OSStatusCode', readonly: true, disabled: false, required: false },
        { name: 'PaymentTypeCode', readonly: true, disabled: false, required: false },
        { name: 'FixedTelesalesOrderNumber', readonly: true, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'WindowClosingName', readonly: true, disabled: false, required: false },
        { name: 'ClosedWithChanges', readonly: true, disabled: false, required: false },
        { name: 'ErrorMessageCustomerType', readonly: true, disabled: false, required: false },
        { name: 'CanEmailOrder', readonly: true, disabled: false, required: false },
        { name: 'ErrorMessageEmailAddress', readonly: true, disabled: false, required: false },
        { name: 'cmdBulkDiscountPerc', readonly: true, disabled: false, required: false }
    ];

    public uiDisplay: any = {
        tab: {
            tab1: { visible: true, active: true },
            tab2: { visible: true, active: false },
            tab3: { visible: true, active: false },
            tab4: { visible: true, active: false },
            tab5: { visible: true, active: false },
            tab6: { visible: true, active: false },
            tab7: { visible: true, active: false },
            tab8: { visible: true, active: false }
        }
    };

    public ellipsisConfig = {
        employee: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'TelesalesEntry',
            showAddNew: false,
            ContractTypeCode: 'C',
            action: 0,
            component: EmployeeSearchComponent
        }
    };

    public gridConfig = {
        riGridOrderHistory: {
            totalItems: 1,
            itemsPerPage: 10,
            currentPage: 1
        },
        riGridProduct: {
            totalItems: 1,
            itemsPerPage: 10,
            currentPage: 1
        },
        riGridOrderLine: {
            totalItems: 1,
            itemsPerPage: 10,
            currentPage: 1
        },
        riGridStock: {
            totalItems: 1,
            itemsPerPage: 10,
            currentPage: 1
        }
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMTELESALESENTRY;
        this.browserTitle = 'Telesales Entry';
        this.iCABSCMTelesalesEntry1 = new TelesalesEntry1(this);
        this.iCABSCMTelesalesEntry2 = new TelesalesEntry2(this);
        this.iCABSCMTelesalesEntryProduct = new TelesalesEntryProduct(this);
        this.iCABSCMTelesalesEntryOrderHistory = new TelesalesEntryOrderHistory(this);
        this.iCABSCMTelesalesEntryOrderLine = new TelesalesEntryOrderLine(this);
        this.iCABSCMTelesalesEntryStock = new TelesalesEntryStock(this);
        this.riTab = new RiTab(this.uiDisplay.tab, this.utils);
    }

    public renderTab(tabindex: number, markRed?: boolean): void {
        let elem = document.querySelector('.nav-tabs').children;
        for (let i = 0; i < elem.length; i++) {
            if (this.utils.hasClass(elem[i], 'error')) {
                this.utils.removeClass(elem[i], 'active');
                this.utils.removeClass(document.querySelector('.tab-content').children[i], 'active');
            }
        }
        switch (tabindex) {
            case 1:
                this.uiDisplay.tab.tab1.active = true;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = false;
                this.uiDisplay.tab.tab8.active = false;
                break;
            case 2:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = true;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = false;
                this.uiDisplay.tab.tab8.active = false;
                break;
            case 3:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = true;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = false;
                this.uiDisplay.tab.tab8.active = false;
                break;
            case 4:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = true;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = false;
                this.uiDisplay.tab.tab8.active = false;
                break;
            case 5:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = true;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = false;
                this.uiDisplay.tab.tab8.active = false;
                break;
            case 6:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = true;
                this.uiDisplay.tab.tab7.active = false;
                this.uiDisplay.tab.tab8.active = false;
                break;
            case 7:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = true;
                this.uiDisplay.tab.tab8.active = false;
                break;
            case 8:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = false;
                this.uiDisplay.tab.tab8.active = true;
                this.pageParams.lRefreshStockGrid = false;
                break;
        }
        this.pageParams.tabIndex = tabindex;
        this.utils.addClass(elem[tabindex - 1], 'active');
        this.utils.addClass(document.querySelector('.tab-content').children[tabindex - 1], 'active');
        if (markRed) {
            setTimeout(this.utils.makeTabsRed(this.tabVisited), 200);
        }
        this.iCABSCMTelesalesEntry2.riTabTabFocusAfter();
        this.tabVisited[tabindex - 1] = true;
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.context = this;
        this.ellipsisConfig.employee.ContractTypeCode = this.riExchange.getCurrentContractType();
        this.gLanguageCode = this.riExchange.LanguageCode();
        if (this.isReturning()) {
            this.ellipsisConfig.employee.ContractTypeCode = this.riExchange.getCurrentContractType();
            this.riExchange.renderForm(this.uiForm, this.pageParams.returnState);
            this.context.iCABSCMTelesalesEntry2.setupGrids();
            this.context.iCABSCMTelesalesEntry2.buildGrids();
            this.renderTab(this.pageParams.tabIndex);
            return;
        }
        //All sys char variables
        this.pageParams.lRefreshProductGrid = false;
        this.pageParams.lRefreshOrderHistoryGrid = false;
        this.pageParams.lRefreshOrderLineGrid = false;
        this.pageParams.lRefreshStockGrid = false;
        this.pageParams.lSavedOk = false;
        this.pageParams.cCanConfirmAsOrder = false;
        this.pageParams.cCanConfirmAsQuote = false;
        this.pageParams.cCanCancelOrder = false;
        this.pageParams.cCanCancelQuote = false;
        this.pageParams.cCanUpdate = false;
        this.pageParams.cCanUpdateAddress = false;
        this.pageParams.lShowTaxDetails = false;
        this.pageParams.lEnableAddressLine3 = false;
        this.pageParams.lSCAddressLine3Logical = false;
        this.pageParams.lSCAddressLine4Required = false;
        this.pageParams.lSCAddressLine5Required = false;
        this.pageParams.lSCPostCodeRequired = false;
        this.pageParams.iSCMaximumAddressLength = 0;
        this.pageParams.lValidateOK = true;
        this.pageParams.lFixedTelesalesOrderNumber = false;
        this.pageParams.iDeliverToTab = false;
        this.pageParams.lDoubleClick = false;
        this.pageParams.lConfirmingOrder = false;
        this.pageParams.lEnableValidatePostcodeSuburb = false;
        this.pageParams.lEnablePostcodeSuburbLog = false;
        this.pageParams.trTelesalesAddressLine3 = false;
        this.pageParams.trTelesalesInvAddressLine3 = false;
        this.pageParams.tdcmdEmailOrder = false;
        this.pageParams.tdcmdSaveOrder = false;
        this.pageParams.tdcmdAbandonOrder = false;
        this.pageParams.tdBulkDiscountPerc = false;
        this.pageParams.tdcmdUpdateOrder = true;
        this.pageParams.levelFilter = [];
        this.pageParams.tdTransactionLabel = 'Account';
        this.inititiazeValues();
        this.getSysCharDtetails();
    }

    public ngOnDestroy(): void {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        if (this.subSysChar) {
            this.subSysChar.unsubscribe();
        }
        super.ngOnDestroy();
    }

    public ngAfterViewInit(): void {
        if (this.pageParams.saveReturnCallback) {
            setTimeout(() => {
                this.processConfirmMethods();
            }, 100);
            this.pageParams.saveReturnCallback = false;
        }
    }

    public processConfirmMethods(): void {
        this.iCABSCMTelesalesEntry1.cmdConfirmOrderResumePage();
    }

    public inititiazeValues(): void {
        if (!this.pageParams.ttCustomerType || !this.pageParams.ttTelesalesOrderStatus) {
            this.pageParams.ttCustomerType = [];
            this.pageParams.ttTelesalesOrderStatus = [];
            let desc = 'Please Select';
            this.getTranslatedValue('Please Select', null).subscribe((res: string) => {
                if (res) {
                    desc = res;
                }
            });
            this.pageParams.ttCustomerType.push({
                sequence: -1,
                customerTypeCode: '$$$',
                customerTypeDesc: desc
            });

            let statusDesc = 'All';
            this.getTranslatedValue('All', null).subscribe((res: string) => {
                if (res) {
                    statusDesc = res;
                }
            });
            this.pageParams.ttTelesalesOrderStatus.push({
                sequence: -1,
                telesalesOrderStatusCode: 'All',
                telesalesOrderStatusDesc: statusDesc
            });
            this.riExchange.riInputElement.SetValue(this.uiForm, 'TelesalesOrderStatusCodeFilter', 'All');
            this.createCustomerTypeArray();
        }
    }

    public createCustomerTypeArray(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupIP = [
            {
                'table': 'CustomerType',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['BusinessCode', 'CustomerTypeCode', 'CustomerTypeDesc']
            },
            {
                'table': 'CustomerTypeLanguage',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'LanguageCode': this.gLanguageCode
                },
                'fields': ['CustomerTypeCode', 'CustomerTypeDesc']
            },
            {
                'table': 'TelesalesOrderStatus',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['BusinessCode', 'TelesalesOrderStatusCode', 'TelesalesOrderStatusSystemDesc']
            },
            {
                'table': 'TelesalesOrderStatusLang',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'LanguageCode': this.gLanguageCode
                },
                'fields': ['TelesalesOrderStatusCode', 'TelesalesOrderStatusDesc']
            },
            {
                'table': 'BusinessRegistry',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'RegKey': 'Show_Tax_In_Telesales_Entry'
                },
                'fields': ['RegValue']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let customerType: any = data[0];
            let customerTypeLanguage: any = data[1];
            let telesalesOrderStatus: any = data[2];
            let telesalesOrderStatusLang: any = data[3];
            let glShowTaxDetails = data[4];
            let cType: any[] = [];
            let count = 0;
            if (customerType && customerTypeLanguage) {
                for (let i = 0; i < customerType.length; i++) {
                    let code = customerType[i].CustomerTypeCode;
                    for (let j = 0; j < customerTypeLanguage.length; j++) {
                        if (code === customerTypeLanguage[j].CustomerTypeCode) {
                            cType.push({
                                sequence: count,
                                customerTypeCode: code,
                                customerTypeDesc: customerTypeLanguage[j].CustomerTypeDesc ? customerTypeLanguage[j].CustomerTypeDesc : customerType[i].CustomerTypeDesc
                            });
                            count++;
                        }
                    }
                }
                if (cType.length > 0) {
                    let p = cType.sort(function (a: any, b: any): number {
                        if (a.CustomerTypeDesc && b.CustomerTypeDesc) {
                            let textA = a.CustomerTypeDesc.toUpperCase();
                            let textB = b.CustomerTypeDesc.toUpperCase();
                            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                        } else {
                            return 0;
                        }
                    });
                    this.pageParams.ttCustomerType = this.pageParams.ttCustomerType.concat(p);
                }
            }
            count = 0;
            if (telesalesOrderStatus && telesalesOrderStatusLang) {
                for (let i = 0; i < telesalesOrderStatus.length; i++) {
                    let code = telesalesOrderStatus[i].TelesalesOrderStatusCode;
                    for (let j = 0; j < telesalesOrderStatusLang.length; j++) {
                        if (code === telesalesOrderStatusLang[j].TelesalesOrderStatusCode) {
                            this.pageParams.ttTelesalesOrderStatus.push({
                                sequence: count,
                                telesalesOrderStatusCode: code,
                                telesalesOrderStatusDesc: telesalesOrderStatusLang[j].TelesalesOrderStatusDesc ? telesalesOrderStatusLang[j].TelesalesOrderStatusDesc : telesalesOrderStatus[i].TelesalesOrderStatusSystemDesc
                            });
                            count++;
                        }
                    }
                }
            }
            if (glShowTaxDetails) {
                this.pageParams.lShowTaxDetails = glShowTaxDetails[0]['RegValue'] === 'Y' ? true : false;
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.iCABSCMTelesalesEntry1.windowOnLoad();
        });
    }

    public getSysCharDtetails(): any {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableAddressLine3,
            this.sysCharConstants.SystemCharAddressLine4Required,
            this.sysCharConstants.SystemCharAddressLine5Required,
            this.sysCharConstants.SystemCharPostCodeRequired,
            this.sysCharConstants.SystemCharMaximumAddressLength,
            this.sysCharConstants.SystemCharEnableValidatePostcodeSuburb
        ];
        let sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.subSysChar = this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record: any = data.records;
            this.pageParams.lEnableAddressLine3 = record[0].Required;
            this.pageParams.lSCAddressLine3Logical = record[0].Logical;
            this.pageParams.lSCAddressLine4Required = record[1].Logical;
            this.pageParams.lSCAddressLine5Required = record[2].Required;
            this.pageParams.lSCPostCodeRequired = record[3].Required;
            this.pageParams.iSCMaximumAddressLength = record[4].Integer;
            this.pageParams.lEnableValidatePostcodeSuburb = record[5].Required;
            this.pageParams.lEnablePostcodeSuburbLog = record[5].Logical;
        });
    }

    public commissionEmpSelection(data: any): void {
        if (data.EmployeeSurName) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CommissionEmployeeName', data.EmployeeSurName);
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CommissionEmployeeCode', data.EmployeeCode);
    }

    public TelesalesDeliveryChargeOnChange(): void {
        this.pageParams.lRefreshOrderLineGrid = true;
    }

    public getCurrentPage(currentPage: any, gridId: string): void {
        switch (gridId) {
            case 'riGridOrderHistory':
                this.gridConfig.riGridOrderHistory.currentPage = currentPage.value;
                this.iCABSCMTelesalesEntryOrderHistory.riGridOrderHistoryBeforeExecute();
                break;

            case 'riGridProduct':
                this.gridConfig.riGridProduct.currentPage = currentPage.value;
                this.iCABSCMTelesalesEntryProduct.riGridProductBeforeExecute();
                break;

            case 'riGridOrderLine':
                this.gridConfig.riGridOrderLine.currentPage = currentPage.value;
                this.iCABSCMTelesalesEntryOrderLine.riGridOrderLineBeforeExecute();
                break;

            case 'riGridStock':
                this.gridConfig.riGridStock.currentPage = currentPage.value;
                this.iCABSCMTelesalesEntryStock.riGridStockBeforeExecute();
                break;
        }
    }

    public refresh(gridId: string): void {
        switch (gridId) {
            case 'riGridOrderHistory':
                this.iCABSCMTelesalesEntryOrderHistory.riGridOrderHistoryBeforeExecute();
                break;

            case 'riGridProduct':
                this.iCABSCMTelesalesEntryProduct.riGridProductBeforeExecute();
                break;

            case 'riGridOrderLine':
                this.iCABSCMTelesalesEntryOrderLine.riGridOrderLineBeforeExecute();
                break;

            case 'riGridStock':
                this.iCABSCMTelesalesEntryStock.riGridStockBeforeExecute();
                break;
        }
    }

    public telesalesDeliveryDateSelectedValue(event: any): void {
        if (event && event.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'TelesalesDeliveryDate', event.value);
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'TelesalesDeliveryDate', '');
        }
    }

    public riGridSort(event: any, gridId: string): void {
        switch (gridId) {
            case 'riGridOrderHistory':
                this.iCABSCMTelesalesEntryOrderHistory.riGridOrderHistoryBeforeExecute();
                break;

            case 'riGridProduct':
                this.iCABSCMTelesalesEntryProduct.riGridProductBeforeExecute();
                break;

            case 'riGridOrderLine':
                this.iCABSCMTelesalesEntryOrderLine.riGridOrderLineBeforeExecute();
                break;

            case 'riGridStock':
                this.iCABSCMTelesalesEntryStock.riGridStockBeforeExecute();
                break;
        }
    }

    public focusSave(obj: any): void {
        this.riTab.focusNextTab(obj);
    }

    public canDeactivate(): Observable<boolean> {
        if (this.routeAwayComponent) {
            return this.routeAwayComponent.canDeactivate();
        }
    }
}
