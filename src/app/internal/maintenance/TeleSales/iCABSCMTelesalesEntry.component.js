var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { EmployeeSearchComponent } from './../../search/iCABSBEmployeeSearch';
import { TelesalesEntryStock } from './iCABSCMTelesalesEntryStock';
import { TelesalesEntryOrderLine } from './iCABSCMTelesalesEntryOrderLine';
import { TelesalesEntryOrderHistory } from './iCABSCMTelesalesEntryOrderHistory';
import { TelesalesEntryProduct } from './iCABSCMTelesalesEntryProduct';
import { TelesalesEntry2 } from './iCABSCMTelesalesEntry2';
import { TelesalesEntry1 } from './iCABSCMTelesalesEntry1';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../app/base/BaseComponent';
export var TelesalesEntryComponent = (function (_super) {
    __extends(TelesalesEntryComponent, _super);
    function TelesalesEntryComponent(injector) {
        _super.call(this, injector);
        this.queryParams = {
            operation: 'ContactManagement/iCABSCMTelesalesEntry',
            module: 'telesales',
            method: 'ccm/maintenance'
        };
        this.MaxLength = 40;
        this.totalItems = 0;
        this.showMessageHeader = false;
        this.promptTitle = 'Title';
        this.promptContent = '';
        this.promptContent1 = '';
        this.pageId = '';
        this.controls = [
            { name: 'TransactionNumber', readonly: true, disabled: false, required: false },
            { name: 'TransactionName', readonly: true, disabled: false, required: false },
            { name: 'TelesalesOrderNumber', readonly: true, disabled: false, required: false },
            { name: 'TelesalesOrderStatusDesc', readonly: true, disabled: false, required: false },
            { name: 'CurrentCallLogID', readonly: true, disabled: false, required: false },
            { name: 'LevelFilter', readonly: true, disabled: false, required: false },
            { name: 'DateFilter', readonly: true, disabled: false, required: false },
            { name: 'TelesalesOrderStatusCodeFilter', readonly: true, disabled: false, required: false },
            { name: 'cmdCreateOrderHistory', readonly: true, disabled: false, required: false },
            { name: 'cmdCreateOrderHistoryCurrent', readonly: true, disabled: false, required: false },
            { name: 'cmdClearOrderHistory', readonly: true, disabled: false, required: false },
            { name: 'ProductDescriptionContains', readonly: true, disabled: false, required: false },
            { name: 'ProductCodeBegins', readonly: true, disabled: false, required: false },
            { name: 'SelectedProductValue', readonly: true, disabled: false, required: false },
            { name: 'TelesalesName', readonly: true, disabled: false, required: true },
            { name: 'TelesalesOrderDate', readonly: true, disabled: false, required: false },
            { name: 'TelesalesAddressLine1', readonly: true, disabled: false, required: true },
            { name: 'QuoteExpiryDate', readonly: true, disabled: false, required: false },
            { name: 'TelesalesAddressLine2', readonly: true, disabled: false, required: false },
            { name: 'TelesalesAddressLine3', readonly: true, disabled: false, required: false },
            { name: 'TelesalesAddressLine4', readonly: true, disabled: false, required: false },
            { name: 'TelesalesDeliveryCharge', readonly: true, disabled: false, required: false },
            { name: 'TelesalesAddressLine5', readonly: true, disabled: false, required: false },
            { name: 'TelesalesPostcode', readonly: true, disabled: false, required: false },
            { name: 'TelesalesContactName', readonly: true, disabled: false, required: true },
            { name: 'TelesalesDeliveryDate', readonly: true, disabled: false, required: true },
            { name: 'TelesalesPurchaseOrderNo', readonly: true, disabled: false, required: false },
            { name: 'TelesalesContactPosition', readonly: true, disabled: false, required: true },
            { name: 'ContractReference', readonly: true, disabled: false, required: false },
            { name: 'TelesalesContactTelephone', readonly: true, disabled: false, required: true },
            { name: 'TelesalesContactMobile', readonly: true, disabled: false, required: false },
            { name: 'CustomerTypeCodeSelect', readonly: true, disabled: false, required: true },
            { name: 'TelesalesContactEmail', readonly: true, disabled: false, required: false },
            { name: 'TelesalesContactFax', readonly: true, disabled: false, required: false },
            { name: 'CommissionEmployeeCode', readonly: true, disabled: false, required: true },
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
            { name: 'OSOrderDate', readonly: true, disabled: false, required: false },
            { name: 'OSOrderTime', readonly: true, disabled: false, required: false },
            { name: 'OSCreatedBy', readonly: true, disabled: false, required: false },
            { name: 'OSCreatedByName', readonly: true, disabled: false, required: false },
            { name: 'TelesalesQConfirmedDate', readonly: true, disabled: false, required: false },
            { name: 'TelesalesQConfirmedTime', readonly: true, disabled: false, required: false },
            { name: 'TelesalesQConfirmedUserCode', readonly: true, disabled: false, required: false },
            { name: 'OSQConfirmedByName', readonly: true, disabled: false, required: false },
            { name: 'TelesalesQConfirmedDate', readonly: true, disabled: false, required: false },
            { name: 'TelesalesConfirmedTime', readonly: true, disabled: false, required: false },
            { name: 'TelesalesConfirmedUserCode', readonly: true, disabled: false, required: false },
            { name: 'OSConfirmedByName', readonly: true, disabled: false, required: false },
            { name: 'TelesalesCancelledDate', readonly: true, disabled: false, required: false },
            { name: 'TelesalesCancelledTime', readonly: true, disabled: false, required: false },
            { name: 'TelesalesCancelledUserCode', readonly: true, disabled: false, required: false },
            { name: 'OSCancelledByName', readonly: true, disabled: false, required: false },
            { name: 'TelesalesCompletedDate', readonly: true, disabled: false, required: false },
            { name: 'TelesalesCompletedTime', readonly: true, disabled: false, required: false },
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
            { name: 'OrderFromDate', readonly: true, disabled: false, required: false },
            { name: 'OrderToDate', readonly: true, disabled: false, required: false },
            { name: 'InitialContractNumber', readonly: true, disabled: false, required: false },
            { name: 'InitialPremiseNumber', readonly: true, disabled: false, required: false },
            { name: 'SelectedProduct', readonly: true, disabled: false, required: false },
            { name: 'SelectedOrderHistory', readonly: true, disabled: false, required: false },
            { name: 'SelectedOrderLine', readonly: true, disabled: false, required: false },
            { name: 'SelectedStock', readonly: true, disabled: false, required: false },
            { name: 'AccountNumber', readonly: true, disabled: false, required: false },
            { name: 'ContractNumber', readonly: true, disabled: false, required: false },
            { name: 'PremiseNumber', readonly: true, disabled: false, required: false },
            { name: 'ProspectNumber', readonly: true, disabled: false, required: false },
            { name: 'TelesalesOrderLineNumber', readonly: true, disabled: false, required: false },
            { name: 'TelesalesOrderStatusCode', readonly: true, disabled: false, required: false },
            { name: 'OSStatusCode', readonly: true, disabled: false, required: false },
            { name: 'PaymentTypeCode', readonly: true, disabled: false, required: false },
            { name: 'FixedTelesalesOrderNumber', readonly: true, disabled: false, required: false },
            { name: 'WindowClosingName', readonly: true, disabled: false, required: false },
            { name: 'ClosedWithChanges', readonly: true, disabled: false, required: false },
            { name: 'ErrorMessageCustomerType', readonly: true, disabled: false, required: false },
            { name: 'CanEmailOrder', readonly: true, disabled: false, required: false },
            { name: 'ErrorMessageEmailAddress', readonly: true, disabled: false, required: false },
            { name: 'cmdBulkDiscountPerc', readonly: true, disabled: false, required: false }
        ];
        this.uiDisplay = {
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
        this.ellipsisConfig = {
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
        this.gridConfig = {
            OrderHistoryGrid: {
                maxColumn: 9,
                itemsPerPage: 10,
                currentPage: 1
            },
            ProductGrid: {
                maxColumn: 6,
                itemsPerPage: 10,
                currentPage: 1
            },
            OrderLineGrid: {
                maxColumn: 10,
                itemsPerPage: 10,
                currentPage: 1
            },
            StockGrid: {
                maxColumn: 8,
                itemsPerPage: 10,
                currentPage: 1
            }
        };
        this.search = new URLSearchParams();
        this.pageId = PageIdentifier.ICABSCMTELESALESENTRY;
    }
    TelesalesEntryComponent.prototype.renderTab = function (tabindex) {
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
                if (this.pageParams.lRefreshOrderHistoryGrid) {
                    this.iCABSCMTelesalesEntry2.OrderHistoryGrid_execute();
                    this.pageParams.lRefreshOrderHistoryGrid = false;
                }
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
                if (this.pageParams.lRefreshProductGrid) {
                    this.iCABSCMTelesalesEntry2.ProductGrid_execute();
                    this.pageParams.lRefreshProductGrid = false;
                }
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
                if (this.pageParams.lRefreshOrderLineGrid) {
                    this.iCABSCMTelesalesEntry2.OrderLineGrid_execute();
                    this.pageParams.lRefreshOrderLineGrid = false;
                }
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
                this.iCABSCMTelesalesEntry2.StockGrid_execute();
                this.pageParams.lRefreshStockGrid = false;
                break;
        }
    };
    TelesalesEntryComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.context = this;
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
        this.pageParams.LevelFilter = [];
        this.pageParams.tdTransactionLabel = 'Account';
        this.gLanguageCode = this.riExchange.LanguageCode();
        this.setMessageCallback(this);
        this.inititiazeValues();
        this.getSysCharDtetails();
        this.ellipsisConfig.employee.ContractTypeCode = this.riExchange.getCurrentContractType();
    };
    TelesalesEntryComponent.prototype.ngOnDestroy = function () {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        if (this.subSysChar) {
            this.subSysChar.unsubscribe();
        }
        _super.prototype.ngOnDestroy.call(this);
    };
    TelesalesEntryComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data.msg, title: data.title }, false);
    };
    TelesalesEntryComponent.prototype.inititiazeValues = function () {
        if (!this.pageParams.ttCustomerType || !this.pageParams.ttTelesalesOrderStatus) {
            this.pageParams.ttCustomerType = [];
            this.pageParams.ttTelesalesOrderStatus = [];
            var desc_1 = 'Please Select';
            this.getTranslatedValue('Please Select', null).subscribe(function (res) {
                if (res) {
                    desc_1 = res;
                }
            });
            this.pageParams.ttCustomerType.push({
                Sequence: -1,
                CustomerTypeCode: '$$$',
                CustomerTypeDesc: desc_1
            });
            var statusDesc_1 = 'All';
            this.getTranslatedValue('All', null).subscribe(function (res) {
                if (res) {
                    statusDesc_1 = res;
                }
            });
            this.pageParams.ttTelesalesOrderStatus.push({
                Sequence: -1,
                TelesalesOrderStatusCode: 'All',
                TelesalesOrderStatusDesc: statusDesc_1
            });
            this.riExchange.riInputElement.SetValue(this.uiForm, 'TelesalesOrderStatusCodeFilter', 'All');
            this.createCustomerTypeArray();
            this.iCABSCMTelesalesEntry1 = new TelesalesEntry1(this);
            this.iCABSCMTelesalesEntry2 = new TelesalesEntry2(this);
            this.iCABSCMTelesalesEntryProduct = new TelesalesEntryProduct(this);
            this.iCABSCMTelesalesEntryOrderHistory = new TelesalesEntryOrderHistory(this);
            this.iCABSCMTelesalesEntryOrderLine = new TelesalesEntryOrderLine(this);
            this.iCABSCMTelesalesEntryStock = new TelesalesEntryStock(this);
        }
    };
    TelesalesEntryComponent.prototype.createCustomerTypeArray = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookupIP = [
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
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var CustomerType = data[0];
            var CustomerTypeLanguage = data[1];
            var TelesalesOrderStatus = data[2];
            var TelesalesOrderStatusLang = data[3];
            var glShowTaxDetails = data[4];
            var cType = [];
            var count = 0;
            if (CustomerType && CustomerTypeLanguage) {
                for (var i = 0; i < CustomerType.length; i++) {
                    var code = CustomerType[i].CustomerTypeCode;
                    for (var j = 0; j < CustomerTypeLanguage.length; j++) {
                        if (code === CustomerTypeLanguage[j].CustomerTypeCode) {
                            cType.push({
                                Sequence: count,
                                CustomerTypeCode: code,
                                CustomerTypeDesc: CustomerTypeLanguage[j].CustomerTypeDesc ? CustomerTypeLanguage[j].CustomerTypeDesc : CustomerType[i].CustomerTypeDesc
                            });
                            count++;
                        }
                    }
                }
                if (cType.length > 0) {
                    var p = cType.sort(function (a, b) {
                        var textA = a.CustomerTypeDesc.toUpperCase();
                        var textB = b.CustomerTypeDesc.toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    });
                    _this.pageParams.ttCustomerType = _this.pageParams.ttCustomerType.concat(p);
                }
            }
            count = 0;
            if (TelesalesOrderStatus && TelesalesOrderStatusLang) {
                for (var i = 0; i < TelesalesOrderStatus.length; i++) {
                    var code = TelesalesOrderStatus[i].TelesalesOrderStatusCode;
                    for (var j = 0; j < TelesalesOrderStatusLang.length; j++) {
                        if (code === TelesalesOrderStatusLang[j].TelesalesOrderStatusCode) {
                            _this.pageParams.ttTelesalesOrderStatus.push({
                                Sequence: count,
                                TelesalesOrderStatusCode: code,
                                TelesalesOrderStatusDesc: TelesalesOrderStatusLang[j].TelesalesOrderStatusDesc ? TelesalesOrderStatusLang[j].TelesalesOrderStatusDesc : TelesalesOrderStatus[i].TelesalesOrderStatusSystemDesc
                            });
                            count++;
                        }
                    }
                }
            }
            if (glShowTaxDetails) {
                _this.pageParams.lShowTaxDetails = glShowTaxDetails[0]['RegValue'] === 'Y' ? true : false;
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.iCABSCMTelesalesEntry1.window_onload();
        });
    };
    TelesalesEntryComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableAddressLine3,
            this.sysCharConstants.SystemCharAddressLine4Required,
            this.sysCharConstants.SystemCharAddressLine5Required,
            this.sysCharConstants.SystemCharPostCodeRequired,
            this.sysCharConstants.SystemCharMaximumAddressLength,
            this.sysCharConstants.SystemCharEnableValidatePostcodeSuburb
        ];
        var sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.subSysChar = this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records;
            _this.pageParams.lEnableAddressLine3 = record[0].Logical;
            _this.pageParams.lSCAddressLine3Logical = record[0].Logical;
            _this.pageParams.lSCAddressLine4Required = record[1].Logical;
            _this.pageParams.lSCAddressLine5Required = record[2].Logical;
            _this.pageParams.lSCPostCodeRequired = record[3].Required;
            _this.pageParams.iSCMaximumAddressLength = record[4].Integer;
            _this.pageParams.lEnableValidatePostcodeSuburb = record[5].Logical;
            _this.pageParams.lEnablePostcodeSuburbLog = record[5].Logical;
        });
    };
    TelesalesEntryComponent.prototype.dateFromSelectedValue = function (value) {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OrderFromDate', value.value);
        }
    };
    TelesalesEntryComponent.prototype.dateToSelectedValue = function (value) {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OrderToDate', value.value);
        }
    };
    TelesalesEntryComponent.prototype.promptYes = function (event) {
        if (this.promptCallback && typeof this.promptCallback === 'function') {
            this.promptCallback.call(this.iCABSCMTelesalesEntry1);
        }
    };
    TelesalesEntryComponent.prototype.showDialog = function (message, fncallback) {
        var _this = this;
        this.promptCallback = fncallback;
        this.getTranslatedValue(message, null).subscribe(function (res) {
            if (res) {
                _this.promptContent = res;
            }
            else {
                _this.promptContent = message;
            }
        });
        this.promptModal.show();
    };
    TelesalesEntryComponent.prototype.showDialogSecond = function (message, fncallback) {
        var _this = this;
        this.promptCallback = fncallback;
        this.getTranslatedValue(message, null).subscribe(function (res) {
            if (res) {
                _this.promptContent1 = res;
            }
            else {
                _this.promptContent1 = message;
            }
        });
        this.promptModal1.show();
    };
    TelesalesEntryComponent.prototype.promptYesSecond = function (event) {
        if (this.promptCallback && typeof this.promptCallback === 'function') {
            this.promptCallback.call(this.iCABSCMTelesalesEntry1);
        }
    };
    TelesalesEntryComponent.prototype.cmdCancelQuoteOnClick = function () {
        this.iCABSCMTelesalesEntry1.cmdCancelQuote_OnClick();
    };
    TelesalesEntryComponent.prototype.cmdConfirmQuotationOnClick = function () {
        this.iCABSCMTelesalesEntry1.cmdConfirmQuotation_OnClick();
    };
    TelesalesEntryComponent.prototype.cmdConfirmOrderOnClick = function () {
        this.iCABSCMTelesalesEntry1.cmdConfirmOrder_OnClick();
    };
    TelesalesEntryComponent.prototype.cmdCancelOrderOnClick = function () {
        this.iCABSCMTelesalesEntry1.cmdCancelOrder_OnClick();
    };
    TelesalesEntryComponent.prototype.cmdEmailOrderOnClick = function () {
        this.iCABSCMTelesalesEntry1.cmdEmailOrder_OnClick();
    };
    TelesalesEntryComponent.prototype.cmdUpdateOrderOnClick = function () {
        this.iCABSCMTelesalesEntry1.cmdUpdateOrder_OnClick();
    };
    TelesalesEntryComponent.prototype.cmdSaveOrderOnClick = function () {
        this.iCABSCMTelesalesEntry1.cmdSaveOrder_OnClick();
    };
    TelesalesEntryComponent.prototype.cmdAbandonOrderOnClick = function () {
        this.iCABSCMTelesalesEntry1.cmdAbandonOrder_OnClick();
    };
    TelesalesEntryComponent.prototype.cmdTelesalesValueOnClick = function () {
        this.iCABSCMTelesalesEntry1.cmdTelesalesValue_OnClick();
    };
    TelesalesEntryComponent.prototype.cmdViewOrderOnClick = function () {
        this.iCABSCMTelesalesEntry1.cmdViewOrder_OnClick();
    };
    TelesalesEntryComponent.prototype.cmdBulkDiscountPercOnClick = function () {
        this.iCABSCMTelesalesEntry1.cmdBulkDiscountPerc_OnClick();
    };
    TelesalesEntryComponent.prototype.cmdCreateProductOnClick = function () {
        this.iCABSCMTelesalesEntryProduct.cmdCreateProduct_OnClick();
    };
    TelesalesEntryComponent.prototype.cmdCreateProductCurrentOnClick = function () {
        this.iCABSCMTelesalesEntryProduct.cmdCreateProductCurrent_OnClick();
    };
    TelesalesEntryComponent.prototype.cmdClearProductOnClick = function () {
        this.iCABSCMTelesalesEntryProduct.cmdClearProduct_OnClick();
    };
    TelesalesEntryComponent.prototype.cmdCreateOrderHistoryOnClick = function () {
        this.iCABSCMTelesalesEntryOrderHistory.cmdCreateOrderHistory_OnClick();
    };
    TelesalesEntryComponent.prototype.cmdCreateOrderHistoryCurrentOnClick = function () {
        this.iCABSCMTelesalesEntryOrderHistory.cmdCreateOrderHistoryCurrent_OnClick();
    };
    TelesalesEntryComponent.prototype.cmdClearOrderHistoryOnClick = function () {
        this.iCABSCMTelesalesEntryOrderHistory.cmdClearOrderHistory_OnClick();
    };
    TelesalesEntryComponent.prototype.LevelFilterOnChange = function () {
        this.iCABSCMTelesalesEntryOrderHistory.LevelFilter_OnChange();
    };
    TelesalesEntryComponent.prototype.ProductDescriptionContainsOnkeydown = function (obj) {
        if (obj.keyCode === 13) {
            this.iCABSCMTelesalesEntry2.ProductGrid_execute();
        }
    };
    TelesalesEntryComponent.prototype.ProductCodeBeginsOnkeydown = function (obj) {
        if (obj.keyCode === 13) {
            this.iCABSCMTelesalesEntry2.ProductGrid_execute();
        }
    };
    TelesalesEntryComponent.prototype.commissionEmpSelection = function (data) {
        if (data.EmployeeSurName) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CommissionEmployeeName', data.EmployeeSurName);
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CommissionEmployeeCode', data.EmployeeCode);
    };
    TelesalesEntryComponent.prototype.TelesalesDeliveryCharge_OnChange = function () {
        this.pageParams.lRefreshOrderLineGrid = true;
    };
    TelesalesEntryComponent.prototype.onGridRowClick = function (info, gridId) {
        switch (gridId) {
            case 'OrderHistoryGrid':
                this.attributes.SelectedOrderHistory_Row = info.rowIndex;
                this.attributes.SelectedOrderHistory_Cell = info.cellIndex;
                this.attributes.SelectedOrderHistory_RowID = info.trRowData[0].rowID;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SelectedOrderHistory', info.trRowData[0].additionalData);
                this.pageParams.lRefreshOrderLineGrid = true;
                this.pageParams.lRefreshProductGrid = true;
                this.pageParams.ProductCacheTime = this.utils.Time();
                this.pageParams.lDoubleClick = true;
                this.pageParams.lFetchOrderRequired = true;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'TelesalesOrderNumber', info.trRowData[0].additionalData);
                this.pageParams.lDoubleClick = false;
                this.iCABSCMTelesalesEntry2.OrderHistoryGrid_execute(this.attributes.SelectedOrderHistory_RowID);
                break;
            case 'OrderLineGrid':
                this.attributes.SelectedOrderLine_Row = info.rowIndex;
                this.attributes.SelectedOrderLine_Cell = info.cellIndex;
                this.attributes.SelectedOrderLine_RowID = info.trRowData[0].rowID;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SelectedOrderLine', info.trRowData[1].additionalData);
                this.pageParams.lRefreshOrderLineGrid = true;
                this.pageParams.lRefreshOrderHistoryGrid = true;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'TelesalesOrderLineNumber', info.trRowData[1].additionalData);
                this.pageParams.loadOrderLineMaintenance = true;
                this.iCABSCMTelesalesEntry2.OrderLineGrid_execute(this.attributes.SelectedOrderLine_RowID);
                break;
            case 'ProductGrid':
                this.attributes.SelectedProduct_Row = info.rowIndex;
                this.attributes.SelectedProduct_Cell = info.cellIndex;
                this.attributes.SelectedProduct_RowID = info.trRowData[0].rowID;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SelectedProductValue', info.trRowData[2].additionalData);
                this.iCABSCMTelesalesEntry2.ProductGrid_execute(this.attributes.SelectedProduct_RowID);
                break;
            case 'StockGrid':
                break;
        }
    };
    TelesalesEntryComponent.prototype.getGridInfo = function (info, gridId) {
        switch (gridId) {
            case 'OrderHistoryGrid':
                this.OrderHistoryPagination.totalItems = info.totalRows;
                this.pageParams.lRefreshOrderHistoryGrid = false;
                if (this.pageParams.lFetchOrderRequired) {
                    this.iCABSCMTelesalesEntry1.FetchSaveTelesalesOrder('FetchTelesalesOrder', function () {
                        this.pageParams.lFetchOrderRequired = false;
                    });
                }
                break;
            case 'ProductGrid':
                this.ProductPagination.totalItems = info.totalRows;
                if (info.gridData && info.gridData.body && info.gridData.body.cells) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SelectedProductValue', info.gridData.body.cells[2].additionalData);
                }
                break;
            case 'OrderLineGrid':
                this.OrderLinePagination.totalItems = info.totalRows;
                this.pageParams.lRefreshOrderLineGrid = false;
                if (this.pageParams.loadOrderLineMaintenance) {
                    this.pageParams.loadOrderLineMaintenance = false;
                    alert('NAviagte to iCABSCMTelesalesEntryOrderLineMaintenance');
                }
                break;
            case 'StockGrid':
                this.StockPagination.totalItems = info.totalRows;
                break;
        }
    };
    TelesalesEntryComponent.prototype.getCurrentPage = function (currentPage, gridId) {
        switch (gridId) {
            case 'OrderHistoryGrid':
                this.gridConfig.OrderHistoryGrid.currentPage = currentPage.value;
                this.iCABSCMTelesalesEntry2.OrderHistoryGrid_execute();
                break;
            case 'ProductGrid':
                this.gridConfig.ProductGrid.currentPage = currentPage.value;
                this.iCABSCMTelesalesEntry2.ProductGrid_execute();
                break;
            case 'OrderLineGrid':
                this.gridConfig.OrderLineGrid.currentPage = currentPage.value;
                this.iCABSCMTelesalesEntry2.OrderLineGrid_execute();
                break;
            case 'StockGrid':
                this.gridConfig.StockGrid.currentPage = currentPage.value;
                this.iCABSCMTelesalesEntry2.StockGrid_execute();
                break;
        }
    };
    TelesalesEntryComponent.prototype.refresh = function (gridId) {
        switch (gridId) {
            case 'OrderHistoryGrid':
                this.gridConfig.OrderHistoryGrid.currentPage = 1;
                this.iCABSCMTelesalesEntry2.OrderHistoryGrid_execute();
                break;
            case 'ProductGrid':
                this.gridConfig.ProductGrid.currentPage = 1;
                this.iCABSCMTelesalesEntry2.ProductGrid_execute();
                break;
            case 'OrderLineGrid':
                this.gridConfig.OrderLineGrid.currentPage = 1;
                this.iCABSCMTelesalesEntry2.OrderLineGrid_execute();
                break;
            case 'StockGrid':
                this.gridConfig.StockGrid.currentPage = 1;
                this.iCABSCMTelesalesEntry2.StockGrid_execute();
                break;
        }
    };
    TelesalesEntryComponent.prototype.TelesalesDeliveryDateSelectedValue = function (event) {
        if (event && event.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'TelesalesDeliveryDate', event.value);
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'TelesalesDeliveryDate', '');
        }
    };
    TelesalesEntryComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSCMTelesalesEntry.html'
                },] },
    ];
    TelesalesEntryComponent.ctorParameters = [
        { type: Injector, },
    ];
    TelesalesEntryComponent.propDecorators = {
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'promptModal1': [{ type: ViewChild, args: ['promptModal1',] },],
        'OrderHistoryGrid': [{ type: ViewChild, args: ['OrderHistoryGrid',] },],
        'OrderHistoryPagination': [{ type: ViewChild, args: ['OrderHistoryPagination',] },],
        'ProductGrid': [{ type: ViewChild, args: ['ProductGrid',] },],
        'ProductPagination': [{ type: ViewChild, args: ['ProductPagination',] },],
        'OrderLineGrid': [{ type: ViewChild, args: ['OrderLineGrid',] },],
        'OrderLinePagination': [{ type: ViewChild, args: ['OrderLinePagination',] },],
        'StockGrid': [{ type: ViewChild, args: ['StockGrid',] },],
        'StockPagination': [{ type: ViewChild, args: ['StockPagination',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return TelesalesEntryComponent;
}(BaseComponent));
